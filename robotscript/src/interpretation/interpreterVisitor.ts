
import { RobotEnvironment } from "./environment/environment.js";
import { RobotScriptVisitor, VAnd, VAssignment, VBlock, VBoolConstant, VComparison, VDistanceUnit, VDoubleConstant, VEquality, VFor, VFunctionCall, VFunctionDef, VFunctionReturn, VIf, VIntConstant, VMinus, VModel, VMovement, VMulDiv, VNot, VOr, VParameter, VPlusMinus, VPrint, VRobotDistanceSensor, VRobotMovement, VRobotRotation, VRobotSpeedAdjust, VRobotSymbol, VRobotTimeSensor, VRotation, VTimeUnit, VType, VVariableCall, VVariableDecl, VWhile } from "../language/semantics/visitor.js";


interface MemoryZone {
    type: string;
    value: number | boolean ;
}

class Context {
    public variables: Map<string, MemoryZone> = new Map();
    public functionNames: string[] = [];
}

export class RobotInterpreterVisitor implements RobotScriptVisitor {
  // Stack of contexts. The last one is the most recent.
  private contexts: Context[];

  public constructor(
    public environment: RobotEnvironment,
    public robotIndex: number
  ) {
    this.contexts = [new Context()];
  }

  // Visitor methods
  visitAnd(node: VAnd): boolean {
    // const left = this.visitBooleanExpression(node.left);
    // const right = this.visitBooleanExpression(node.right);
    // return left && right;
    return node.left.accept(this) && node.right.accept(this);
  }

  visitAssignment(node: VAssignment) {
    const nodevariable : VRobotSymbol | undefined = node.symbol.ref;
    if(nodevariable) {
      const type = nodevariable.type.type;
      // 1 : check if variable exists among the contexts, starting from the last one (the most recent)
      let contextIndex = this.contexts.length - 1;
      for(; contextIndex >= 0; contextIndex--) {
        if(this.contexts[contextIndex].variables.has(nodevariable.name)) {
          break;
        }
      }
      // 2 : if variable exists, update it
      if(contextIndex >= 0) {
        // 3 : check if the type is the same
        if(this.contexts[contextIndex].variables.get(nodevariable.name)?.type === type) {
          // 4 : update the value
          // this.contexts[contextIndex].variables.set(nodevariable.name, {type : type, value : this.visitTypedExpression(node.expression)});
          this.contexts[contextIndex].variables.set(nodevariable.name, {type : type, value : node.expression.accept(this)});
        } else {
          throw new Error(`Type mismatch : variable ${nodevariable.name} is of type ${this.contexts[contextIndex].variables.get(nodevariable.name)?.type} but you are trying to assign a value of type ${type}`);
        }
      }
    }
  }

  /**
   * A block is an agnostic list of statements.
   * It can call a function, declare a variable, etc.
   * And its scope is limited to the block.
   * A return statement can be used to exit the block. The return value will be added to the context calling the block.
   * @param node
   * @param variables
   */
  visitBlock(
    node: VBlock,
    inputVariables: Map<string, MemoryZone> = new Map()
  ): number | boolean | undefined {
    this.contexts.push(new Context());
    let returnValue: number | boolean | undefined = undefined;
    // 1 : add input variables to the context
    for (const [name, value] of inputVariables) {
      this.contexts[this.contexts.length - 1].variables.set(name, value);
    }
    // 2 : visit all statements
    for (const stmt of node.statements) {
        returnValue = stmt.accept(this);
    }
    // 3 : remove the context
    this.contexts.pop();
    // 4 : return the value
    return returnValue;
  }
  visitBoolConstant(node: VBoolConstant): boolean {
    return node.value === "true";
  }
  visitComparison(node: VComparison): boolean {
    const left = node.left.accept(this);
    const right = node.right.accept(this);
    switch (node.operator) {
      case "<":
        return left < right;
      case "<=":
        return left <= right;
      case ">":
        return left > right;
      case ">=":
        return left >= right;
    }
  }

  /**
   * Visits a distance unit and returns its value in meters.
   * @param node
   * @param value
   */
  visitDistanceUnit(node: VDistanceUnit, value: number = 0): number {
    switch (node.unit) {
      case "m":
        return value;
      case "dm":
        return value / 10;
      case "cm":
        return value / 100;
      case "mm":
        return value / 1000;
    }
  }
  visitDoubleConstant(node: VDoubleConstant): number {
    return node.value;
  }
  visitEquality(node: VEquality): boolean {
    const left = node.left.accept(this);
    const right = node.right.accept(this);
    switch (node.operator) {
      case "==":
        return left == right;
      case "!=":
        return left != right;
    }
  }
  visitFor(node: VFor) {
    node.init.accept(this);
    while (node.condition.accept(this)) {
      let returnValue: number | boolean | undefined = this.visitBlock(
        node.block
      );
      if (returnValue !== undefined) return returnValue;
      this.visitAssignment(node.increment);
    }
    return undefined;
  }
  /**
   * Interprets on the fly the function call.
   * @param node
   */
  visitFunctionCall(node: VFunctionCall) {
    // Call of a function (a block with input arguments and a return value)
    let fun = node.functionCall.ref!;
    // 1 : check if the function exists
    let contextIndex = this.contexts.length - 1;
    for (; contextIndex >= 0; contextIndex--) {
      if (this.contexts[contextIndex].functionNames.includes(fun.name)) {
        break;
      }
    }
    // 2 : check existence of the function in the stack of contexts
    if (contextIndex < 0) {
      throw new Error(`Function ${fun.name} does not exist`);
    }
    // 3 : check the number of params
    if (node.args.length > fun.params.length) {
      throw new Error(
        `Too many arguments for the call of ${fun.name} (${node.args.length} instead of ${fun.params.length} as expected)`
      );
    }
    // 4 : cast the parameters to context variables
    let inputs: Map<string, MemoryZone> = new Map();
    for (let i = 0; i < fun.params.length; i++) {
      let param = fun.params[i];
      let arg = node.args[i];

      inputs.set(param.name, {
        type: param.type.type,
        value: arg.accept(this),
      });
    }
    return this.visitBlock(fun.block, inputs);
  }
  visitFunctionDef(node: VFunctionDef) {
    this.contexts[this.contexts.length - 1].functionNames.push(node.name);
  }

  visitFunctionReturn(node: VFunctionReturn): number | boolean {
    // return this.visitTypedExpression(node.expression);
    return node.expression.accept(this);
  }

  visitIf(node: VIf) {
    // if(this.visitBooleanExpression(node.mainCondition)) {
    if (node.mainCondition.accept(this)) {
      let returnValue: number | boolean | undefined = this.visitBlock(
        node.thenBlock
      );
      if (returnValue !== undefined) return returnValue;
    } else if (node.subsidaryConditions) {
      for (let condition of node.subsidaryConditions) {
        // if(this.visitBooleanExpression(condition)) {
        if (condition.accept(this)) {
          let returnValue: number | boolean | undefined = this.visitBlock(
            node.thenBlock
          );
          if (returnValue !== undefined) return returnValue;
        }
      }
    } else if (node.elseBlock) {
      let returnValue: number | boolean | undefined = this.visitBlock(
        node.elseBlock
      );
      if (returnValue !== undefined) return returnValue;
    }
    return undefined;
  }
  visitIntConstant(node: VIntConstant): number {
    return node.value;
  }
  visitMinus(node: VMinus): number {
    // return -this.visitNumberExpression(node.expression);
    return -node.expression.accept(this);
  }

  visitModel(node: VModel) {
    for (const def of node.functionsDef) {
      this.visitFunctionDef(def);
    }
    for (const stmt of node.statements) {
      stmt.accept(this);
    }
  }

  visitMovement(node: VMovement, value: number = 0): void {
    this.environment.moveRobot(this.robotIndex, node.movement, value);
  }
  visitMulDiv(node: VMulDiv): number {
    const left = node.left.accept(this);
    const right = node.right.accept(this);
    switch (node.operator) {
      case "*":
        return left * right;
      case "/":
        return left / right;
      case "%":
        return left % right;
    }
  }
  visitNot(node: VNot) {
    return !node.expression.accept(this);
  }
  visitOr(node: VOr): boolean {
    const left = node.left.accept(this);
    const right = node.right.accept(this);
    return left || right;
  }
  visitParameter(node: VParameter) {
    // Useless (already handled in visitFunctionCall)
  }
  visitPlusMinus(node: VPlusMinus) {
    const left = node.left.accept(this); 
    const right = node.right.accept(this); 
    switch (node.operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
    }
  }

  visitPrint(node: VPrint) {
    this.environment.makeRobotSpeak(
      this.robotIndex,
      node.expression.accept(this)
    );
  }
  visitRobotSpeedAdjust(node: VRobotSpeedAdjust): void {
    this.environment.setRobotSpeed(
      this.robotIndex,
      this.visitDistanceUnit(node.unit, node.speed.accept(this))
    );
  }
  visitRobotDistanceSensor(node: VRobotDistanceSensor): number {
    const d: number = this.environment.getDistance(this.robotIndex);
    return this.visitDistanceUnit(node.unit, d);
  }
  visitRobotMovement(node: VRobotMovement) {
    return this.visitMovement(node.robotMovement, node.distance.accept(this));
  }
  visitRobotRotation(node: VRobotRotation) {
    this.visitRotation(node.robotRotation, node.angle.accept(this));
  }
  visitRobotTimeSensor(node: VRobotTimeSensor): number {
    return this.visitTimeUnit(
      node.unit,
      this.environment.getTime(this.robotIndex)
    );
  }
  visitRotation(node: VRotation, value: number = 0): void {
    const angle = this.environment.getRobotAngle(this.robotIndex);
    switch (node.rotation) {
      case "Clock":
        this.environment.setRobotAngle(
          this.robotIndex,
          angle + value,
          "clockwise"
        );
        break;
      case "Anticlock":
        this.environment.setRobotAngle(
          this.robotIndex,
          angle - value,
          "anticlockwise"
        );
        break;
    }
  }
  /**
   * Converts a time unit to seconds.
   * @param node
   * @param value
   */
  visitTimeUnit(node: VTimeUnit, value: number = 0): number {
    switch (node.unit) {
      case "s":
        return value;
      case "ms":
        return value / 1000;
    }
  }
  visitType(node: VType) {
    // Not necessary. Handled by other methods.
  }
  visitVariableDecl(node: VVariableDecl) {
    this.contexts[this.contexts.length - 1].variables.set(node.name, {
      type: node.type.type,
      value: node.expression.accept(this),
    });
  }
  visitVariableCall(node: VVariableCall): boolean | number {
    let name = node.variable.ref?.name!;
    for (
      let contextIndex = this.contexts.length - 1;
      contextIndex >= 0;
      contextIndex--
    ) {
      const context = this.contexts[contextIndex];
      if (context.variables.has(name)) {
        return context.variables.get(name)!.value;
      }
    }
    throw new Error(`Variable ${name} does not exist`);
  }

  visitWhile(node: VWhile) {
    while (node.condition.accept(this)) {
      let returnValue: number | boolean | undefined = this.visitBlock(
        node.block
      );
      if (returnValue !== undefined) return returnValue;
    }
    return undefined;
  }
}
