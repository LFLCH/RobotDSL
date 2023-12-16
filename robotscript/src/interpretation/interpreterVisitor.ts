
import { RobotEnvironment } from "./environment/environment.js";
import { And, Assignment, Block, BoolConstant, Comparison, DistanceUnit, DoubleConstant, Equality, For, FunctionCall, FunctionDef, FunctionReturn, If, IntConstant, Minus, Model, Movement, MulDiv, Not, Or, Parameter, PlusMinus, RobotAdjust, RobotDistanceSensor, RobotMovement, RobotRotation, RobotTimeSensor, Rotation, TimeUnit, Type, VariableDecl, VariableCall, While, Statement, isAssignment, isControlStructure, isExpression, isFunctionReturn, isVariableDecl, ControlStructure, isFor, isIf, isWhile, Expression, isAnd, isBoolConstant, isComparison, isDoubleConstant, isEquality, isFunctionCall, isIntConstant, isMinus, isMovement, isMulDiv, isNot, isOr, isPlusMinus, isRobotAdjust, isRobotDistanceSensor, isRobotMovement, isRobotRotation, isRobotTimeSensor, isVariableCall, RobotSymbol } from "../language/generated/ast.js";
import { RobotScriptVisitor } from "../language/semantics/visitor.js";


interface MemoryZone {
    type: string;
    value: number | boolean ;
}

class Context {
    public variables: Map<string, MemoryZone> = new Map();
    public functionNames: string[] = [];
}

export class InterpreterVisitor implements RobotScriptVisitor {

    // Stack of contexts. The last one is the most recent.
    private contexts : Context[];

    public constructor(
        public environment: RobotEnvironment, 
        public robotIndex: number = 0
    ) { 
        this.contexts = [new Context()];
    }


// Visitor methods    
  visitAnd(node: And): boolean {
    const left = this.visitBooleanExpression(node.left);
    const right = this.visitBooleanExpression(node.right);
    return left && right;
  }

  visitAssignment(node: Assignment) {
    const nodevariable : RobotSymbol | undefined = node.symbol.ref;
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
          this.contexts[contextIndex].variables.set(nodevariable.name, {type : type, value : this.visitTypedExpression(node.expression)});
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
  visitBlock(node: Block, inputVariables: Map<string, MemoryZone> = new Map()) :  number | boolean | undefined {
    this.contexts.push(new Context());
    let returnValue : number | boolean | undefined = undefined;
    // 1 : add input variables to the context
    for(const [name, value] of inputVariables) {
      this.contexts[this.contexts.length - 1].variables.set(name, value);
    }
    // 2 : visit all statements
    for (const stmt of node.statements) {
      if(isFunctionReturn(stmt)) {
        returnValue =  this.visitFunctionReturn(stmt);
        break;
      }
      else {
        this.visitStatement(stmt);
      }
    }
    // 3 : remove the context
    this.contexts.pop();
    // 4 : return the value
    return returnValue;
  }
  visitBoolConstant(node: BoolConstant): boolean {
    return node.value === "true";
  }
  visitComparison(node: Comparison): boolean {
    const left = this.visitNumberExpression(node.left);
    const right = this.visitNumberExpression(node.right);
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
  visitDistanceUnit(node: DistanceUnit, value: number = 0) : number{
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
  visitDoubleConstant(node: DoubleConstant): number {
    return node.value;
  }
  visitEquality(node: Equality): boolean {
    const left = this.visitBooleanExpression(node.left);
    const right = this.visitBooleanExpression(node.right);
    switch (node.operator) {
      case "==":
        return left == right;
      case "!=":
        return left != right;
    }
  }
  visitFor(node: For) {
   if(isAssignment(node.init)) this.visitAssignment(node.init);
   else if(isVariableDecl(node.init)) this.visitVariableDecl(node.init);
   while(this.visitBooleanExpression(node.condition)) {
     let returnValue : number | boolean | undefined = this.visitBlock(node.block);
     if(returnValue !== undefined) {
        return returnValue;
      }
     this.visitAssignment(node.increment);
   }
   return undefined;
  }
  /**
   * Interprets on the fly the function call.
   * @param node 
   */
  visitFunctionCall(node: FunctionCall) {
    // Call of a function (a block with input arguments and a return value)
    let fun = node.functionCall.ref!;
    // 1 : check if the function exists
    let contextIndex = this.contexts.length - 1;
    for(; contextIndex >= 0; contextIndex--) {
      if(this.contexts[contextIndex].functionNames.includes(fun.name)) {
        break;
      }
    }
    // 2 : check existence of the function in the stack of contexts
    if(contextIndex < 0) {
      throw new Error(`Function ${fun.name} does not exist`);
    }
    // 3 : check the number of params
    if(node.args.length>fun.params.length){
      throw new Error(`Too many arguments for the call of ${fun.name} (${node.args.length} instead of ${fun.params.length} as expected)`)
    }
    // 4 : cast the parameters to context variables
    let inputs : Map<string , MemoryZone> = new Map();
    for(let i=0; i<fun.params.length ; i++){
      let param = fun.params[i];
      let arg = node.args[i];
      
      inputs.set(param.name, {"type" : param.type.type, "value" : this.visitTypedExpression(arg)})
    }
    return this.visitBlock(fun.block, inputs);
  }
  visitFunctionDef(node: FunctionDef) {
    this.contexts[this.contexts.length - 1].functionNames.push(node.name);
  }

  visitFunctionReturn(node: FunctionReturn) :  number | boolean {
    return this.visitTypedExpression(node.expression);
  }

  visitIf(node: If) {
    if(this.visitBooleanExpression(node.mainCondition)) {
      let returnValue : number | boolean | undefined = this.visitBlock(node.thenBlock);
      if(returnValue !== undefined) return returnValue;
    }
    else if(node.subsidaryConditions){
      for(let condition of node.subsidaryConditions) {
        if(this.visitBooleanExpression(condition)) {
          let returnValue : number | boolean | undefined = this.visitBlock(node.thenBlock);
          if(returnValue !== undefined) return returnValue;
        }
      }
    }
    else if(node.elseBlock) {
      let returnValue : number | boolean | undefined = this.visitBlock(node.elseBlock);
      if(returnValue !== undefined) return returnValue;
    }
    return undefined;
  }
  visitIntConstant(node: IntConstant): number {
    return node.value;
  }
  visitMinus(node: Minus) : number{
    return -this.visitNumberExpression(node.expression);
  }

  visitModel(node: Model) {
    for (const def of node.functionsDef) {
      this.visitFunctionDef(def);
    }
    for (const stmt of node.statements) {
      this.visitStatement(stmt);
    }
  }

  visitMovement(node: Movement) {
    throw new Error("Method not implemented.");
  }
  visitMulDiv(node: MulDiv) : number{
    const left = this.visitNumberExpression(node.left);
    const right = this.visitNumberExpression(node.right);
    switch (node.operator) {
      case "*":
        return left * right;
      case "/":
        return left / right;
      case "%":
        return left % right;
    }
  }
  visitNot(node: Not) {
    return !this.visitBooleanExpression(node.expression);
  }
  visitOr(node: Or): boolean {
    const left = this.visitBooleanExpression(node.left);
    const right = this.visitBooleanExpression(node.right);
    return left || right;
  }
  visitParameter(node: Parameter) {
    // Useless (already handled in visitFunctionCall)
  }
  visitPlusMinus(node: PlusMinus) {
    const left = this.visitNumberExpression(node.left);
    const right = this.visitNumberExpression(node.right);
    switch (node.operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
    }
  }
  visitRobotAdjust(node: RobotAdjust) {
    throw new Error("Method not implemented.");
  }
  visitRobotDistanceSensor(node: RobotDistanceSensor) {
    throw new Error("Method not implemented.");
  }
  visitRobotMovement(node: RobotMovement) {
    throw new Error("Method not implemented.");
  }
  visitRobotRotation(node: RobotRotation) {
    throw new Error("Method not implemented.");
  }
  visitRobotTimeSensor(node: RobotTimeSensor) {
    throw new Error("Method not implemented.");
  }
  visitRotation(node: Rotation) {
    throw new Error("Method not implemented.");
  }
  /**
   * Converts a time unit to seconds.
   * @param node 
   * @param value 
   */
  visitTimeUnit(node: TimeUnit, value: number = 0) {
    switch (node.unit) {
      case "s":
        return value;
      case "ms":
        return value / 1000;
    }
  }
  visitType(node: Type) {
    throw new Error("Method not implemented.");
  }
  visitVariableDecl(node: VariableDecl) {
    this.contexts[this.contexts.length - 1].variables.set(node.name, { type: node.type.type, value: this.visitTypedExpression(node.expression) });
  }
  visitVariableCall(node: VariableCall) : boolean | number {
    let name = node.variable.ref?.name!;
    for(let contextIndex = this.contexts.length - 1; contextIndex >= 0; contextIndex--) {
      const context = this.contexts[contextIndex];
      if(context.variables.has(name)) {
        return context.variables.get(name)!.value;
      }
    }
    throw new Error(`Variable ${name} does not exist`);
  }

  visitWhile(node: While) {
    while(this.visitBooleanExpression(node.condition)) {
      let returnValue : number | boolean | undefined = this.visitBlock(node.block);
      if(returnValue !== undefined)  return returnValue;
    }
    return undefined;
  }

// Custom visitor methods.


  /**
   * Custom method. Currently contains ifs for all possible statements. It
   * @param stmt
   */
  visitStatement(stmt: Statement) {
    // Assignment | ControlStructure | Expression | FunctionReturn | VariableDecl
    if (isAssignment(stmt)) this.visitAssignment(stmt);
    else if (isControlStructure(stmt)) this.visitControlStructure(stmt);
    else if (isExpression(stmt)) this.visitExpression(stmt);
    else if (isFunctionReturn(stmt)) this.visitFunctionReturn(stmt);
    else if (isVariableDecl(stmt)) {
      this.visitVariableDecl(stmt);
    } 
  }

  visitControlStructure(stmt: ControlStructure) {
    // For | If | While
    if (isFor(stmt)) this.visitFor(stmt);
    else if (isIf(stmt)) this.visitIf(stmt);
    else if (isWhile(stmt)) this.visitWhile(stmt);
  }

  visitExpression(stmt: Expression): boolean | number | void {
    // And | BoolConstant | Comparison | DoubleConstant | Equality | FunctionCall | IntConstant | Minus | MulDiv | Not | Or | PlusMinus | RobotAdjust | RobotDistanceSensor | RobotMovement | RobotRotation | RobotTimeSensor | VariableCall;
    if (isAnd(stmt)) return this.visitAnd(stmt);
    else if (isBoolConstant(stmt)) return this.visitBoolConstant(stmt);
    else if (isComparison(stmt)) return this.visitComparison(stmt);
    else if (isDoubleConstant(stmt)) return this.visitDoubleConstant(stmt);
    else if (isEquality(stmt)) return this.visitEquality(stmt);
    else if (isFunctionCall(stmt)) return this.visitFunctionCall(stmt);
    else if (isIntConstant(stmt)) return this.visitIntConstant(stmt);
    else if (isMinus(stmt)) return this.visitMinus(stmt);
    else if (isMovement(stmt)) return this.visitMovement(stmt);
    else if (isMulDiv(stmt)) return this.visitMulDiv(stmt);
    else if (isNot(stmt)) return this.visitNot(stmt);
    else if (isOr(stmt)) return this.visitOr(stmt);
    else if (isPlusMinus(stmt)) return this.visitPlusMinus(stmt);
    else if (isRobotAdjust(stmt)) return this.visitRobotAdjust(stmt);
    else if (isRobotDistanceSensor(stmt))
      return this.visitRobotDistanceSensor(stmt);
    else if (isRobotMovement(stmt)) return this.visitRobotMovement(stmt);
    else if (isRobotRotation(stmt)) return this.visitRobotRotation(stmt);
    else if (isRobotTimeSensor(stmt)) return this.visitRobotTimeSensor(stmt);
    else if (isVariableCall(stmt)) return this.visitVariableCall(stmt);
    else throw new Error("Expression not implemented.");
  }

  visitBooleanExpression(node: Expression): boolean {
    let result = this.visitExpression(node);
    if (typeof result === "boolean") {
      return result;
    } else throw new Error("Expression must be boolean");
  }

  visitNumberExpression(node: Expression): number {
    let result = this.visitExpression(node);
    if (typeof result === "number") {
      return result;
    } else throw new Error("Expression must be number");
  }

  visitTypedExpression(node: Expression): number | boolean {
    let result = this.visitExpression(node);
    if (typeof result === "number" || typeof result === "boolean") {
      return result;
    } else throw new Error("Expression must be number or boolean");
  }
}
