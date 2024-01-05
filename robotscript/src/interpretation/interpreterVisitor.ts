
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
   * @param node a distance unit
   * @returns its factor to convert it in meters
   */
  visitDistanceUnit(node: VDistanceUnit): number {
    switch (node.unit) {
      case "m":
        return 1;
      case "dm":
        return  0.1;
      case "cm":
        return 0.01;
      case "mm":
        return 0.001;
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
    return node.expression.accept(this);
  }

  visitIf(node: VIf) {
    if (node.mainCondition.accept(this)) {
      let returnValue: number | boolean | undefined = this.visitBlock(
        node.thenBlock
      );
      if (returnValue !== undefined) return returnValue;
    } else if (node.subsidaryConditions) {
      for (let i=0; i<node.subsidaryConditions.length ; i++) {
        const condition = node.subsidaryConditions[i];
        if (condition.accept(this)) {
          let returnValue: number | boolean | undefined = this.visitBlock(node.elifBlocks[i]);
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

  visitMovement(node: VMovement): void {
    // This method has no effect
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
      this.visitDistanceUnit(node.unit) * node.speed.accept(this)
    );
  }
  visitRobotDistanceSensor(node: VRobotDistanceSensor): number {
    return this.visitDistanceUnit(node.unit)*this.environment.getDistance(this.robotIndex);
  }
  visitRobotMovement(node: VRobotMovement) {
    const value = this.visitDistanceUnit(node.unit)*node.distance.accept(this);
    this.environment.moveRobot(this.robotIndex, node.robotMovement.movement, value);
  }
  visitRobotRotation(node: VRobotRotation) {
    const angle = this.environment.getRobotAngle(this.robotIndex);
    const value = node.angle.accept(this);
    const rotation = this.visitRotation(node.robotRotation);
    this.environment.setRobotAngle(
      this.robotIndex,
      angle + (value*rotation.factor),
      rotation.name
    );
  }
  visitRobotTimeSensor(node: VRobotTimeSensor): number {
    return this.visitTimeUnit(node.unit) * this.environment.getTime(this.robotIndex);
  }
  visitRotation(node: VRotation) : {"name": "clockwise" | "anticlockwise", "factor" : number} {
    switch (node.rotation) {
      case "Clock":
        return {"name" : "clockwise", "factor" : 1}
      case "Anticlock":
        return {"name": "anticlockwise", "factor" : -1}
    }
  }
  /**
   * @param node
   * @returns the conversion factor for translating the time unit to seconds.
   */
  visitTimeUnit(node: VTimeUnit): number {
    switch (node.unit) {
      case "s":
        return 1;
      case "ms":
        return 0.001;
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
