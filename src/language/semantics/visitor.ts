import { AstNode, CstNode, LangiumDocument, Reference } from "langium";
import * as ASTInterfaces from "../representation/currentast.js";

export interface RobotScriptVisitor {
  // One visit method for each concept of the language
  visitAnd(node: VAnd): any;
  visitAssignment(node: VAssignment): any;
  visitBlock(node: VBlock): any;
  visitBoolConstant(node: VBoolConstant): any;
  visitComparison(node: VComparison): any;
  visitDistanceUnit(node: VDistanceUnit): any;
  visitDoubleConstant(node: VDoubleConstant): any;
  visitEquality(node: VEquality): any;
  visitFor(node: VFor): any;
  visitFunctionCall(node: VFunctionCall): any;
  visitFunctionDef(node: VFunctionDef): any;
  visitFunctionReturn(node: VFunctionReturn): any;
  visitIf(node: VIf): any;
  visitIntConstant(node: VIntConstant): any;
  visitMinus(node: VMinus): any;
  visitModel(node: VModel): any;
  visitMovement(node: VMovement): any;
  visitMulDiv(node: VMulDiv): any;
  visitNot(node: VNot): any;
  visitOr(node: VOr): any;
  visitParameter(node: VParameter): any;
  visitPlusMinus(node: VPlusMinus): any;
  visitPrint(node: VPrint): any;
  visitRobotSpeedAdjust(node: VRobotSpeedAdjust): any;
  visitRobotDistanceSensor(node: VRobotDistanceSensor): any;
  visitRobotMovement(node: VRobotMovement): any;
  visitRobotRotation(node: VRobotRotation): any;
  visitRobotTimeSensor(node: VRobotTimeSensor): any;
  visitRotation(node: VRotation): any;
  visitTimeUnit(node: VTimeUnit): any;
  visitType(node: VType): any;
  visitVariableDecl(node: VVariableDecl): any;
  visitVariableCall(node: VVariableCall): any;
  visitWhile(node: VWhile): any;
}

export class VAnd implements ASTInterfaces.And {
  constructor(
    public $type: "And",
    public left: VExpression,
    public right: VExpression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VAssignment implements ASTInterfaces.Assignment {
  constructor(
    public $type: "Assignment",
    public symbol: Reference<VRobotSymbol>,
    public expression: VExpression,
    public $container: VBlock
    ) {}

  accept(visitor: RobotScriptVisitor): any {}
}

export class VBlock implements ASTInterfaces.Block {
  constructor(
    public $type: "Block",
    public statements: VStatement[],
    public $container: VFunctionDef
  ) {}

  accept(visitor: RobotScriptVisitor): any {}
}

export class VBoolConstant implements ASTInterfaces.BoolConstant {
  constructor(
    public $type: "BoolConstant",
    public value: 'true' | 'false',
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VComparison implements ASTInterfaces.Comparison {
  constructor(
    public $type: "Comparison",
    public operator: "<" | "<=" | ">" | ">=",
    public left: VExpression,
    public right: VExpression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VDistanceUnit implements ASTInterfaces.DistanceUnit {
  constructor(
    public $type: "DistanceUnit",
    public unit: "cm" | "m" | "mm" | "dm",
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VDoubleConstant implements ASTInterfaces.DoubleConstant {
  constructor(
    public $type: "DoubleConstant",
    public $container: any,
    public value : number,
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VEquality implements ASTInterfaces.Equality {
  constructor(
    public $type: "Equality",
    public operator: "!=" | "==",
    public left: VExpression,
    public right: VExpression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VFor implements ASTInterfaces.For {
  constructor(
    public $type: "For",
    public condition: VExpression,
    public block: VBlock,
    public increment: VAssignment,
    public init: VAssignment | VVariableDecl,
    public $container: VBlock
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VFunctionCall implements ASTInterfaces.FunctionCall {
  constructor(
    public $type: "FunctionCall",
    public functionCall: Reference<VFunctionDef>,
    public args: VExpression[],
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VFunctionDef implements ASTInterfaces.FunctionDef {
  constructor(
    public $type: "FunctionDef",
    public name: string,
    public block: VBlock,
    public params: VParameter[],
    public type: VType,
    public $container: VModel
  ) {}

  accept(visitor: RobotScriptVisitor): any {}
}

export class VFunctionReturn implements ASTInterfaces.FunctionReturn {
  constructor(
    public $type: "FunctionReturn",
    public expression: VExpression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VIf implements ASTInterfaces.If {
  constructor(
    public $container: VBlock | VModel,
    public $type: "If",
    public mainCondition: VExpression,
    public subsidaryConditions: VExpression[],
    public thenBlock: VBlock,
    public elifBlocks: VBlock[],
    public elseBlock?:VBlock | undefined,
  ) {}

  accept(visitor: RobotScriptVisitor): any {}
}

export class VIntConstant implements ASTInterfaces.IntConstant {
  constructor(
    public $type: "IntConstant",
    public value: number,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VMinus implements ASTInterfaces.Minus {
  constructor(
    public $type: "Minus",
    public expression: VExpression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VModel implements ASTInterfaces.Model {
  constructor(
    public $type: "Model",
    public functionsDef: VFunctionDef[],
    public statements: VStatement[],
    public $container?: AstNode | undefined
  ) {}

  accept(visitor: RobotScriptVisitor): any {}
}

export class VMovement implements ASTInterfaces.Movement {
  constructor(
    public $type: "Movement",
    public movement: "Backward" | "Forward" | "Left" | "Right",
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VMulDiv implements ASTInterfaces.MulDiv {
  constructor(
    public $type: "MulDiv",
    public operator: "*" | "/" | "%",
    public left: VExpression,
    public right: VExpression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VNot implements ASTInterfaces.Not {
  constructor(
    public $type: "Not",
    public expression: VExpression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VOr implements ASTInterfaces.Or {
  constructor(
    public $type: "Or",
    public left: VExpression,
    public right: VExpression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VParameter implements ASTInterfaces.Parameter {
  constructor(
    public $type: "Parameter",
    public name: string,
    public type: VType,
    public $container: VFunctionDef,
    public $containerProperty?: string | undefined,
    public $containerIndex?: number | undefined,
    public $cstNode?: CstNode | undefined,
    public $document?: LangiumDocument<AstNode> | undefined
  ) {}

  accept(visitor: RobotScriptVisitor): any {}
}

export class VPlusMinus implements ASTInterfaces.PlusMinus {
  constructor(
    public $type: "PlusMinus",
    public operator: "+" | "-",
    public left: VExpression,
    public right: VExpression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VPrint implements ASTInterfaces.Print {
  constructor(
    public $type: "Print",
    public expression: VExpression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VRobotSpeedAdjust implements ASTInterfaces.RobotSpeedAdjust {
  constructor(
    public $type: "RobotSpeedAdjust",
    public speed: VExpression,
    public unit: VDistanceUnit,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VRobotDistanceSensor implements ASTInterfaces.RobotDistanceSensor {
  constructor(
    public $type: "RobotDistanceSensor",
    public unit: VDistanceUnit,
    public $container: any
  ) {}
}

export class VRobotMovement implements ASTInterfaces.RobotMovement {
  constructor(
    public $type: "RobotMovement",
    public robotMovement: VMovement,
    public distance: VExpression,
    public unit: VDistanceUnit,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VRobotRotation implements ASTInterfaces.RobotRotation {
  constructor(
    public $type: "RobotRotation",
    public robotRotation: VRotation,
    public angle: VExpression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VRobotTimeSensor implements ASTInterfaces.RobotTimeSensor {
  constructor(
    public $type: "RobotTimeSensor",
    public robotTimeSensor: "CurrentTime",
    public unit: VTimeUnit,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VRotation implements ASTInterfaces.Rotation {
  constructor(
    public $type: "Rotation",
    public rotation: "Clock" | "Anticlock",
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VTimeUnit implements ASTInterfaces.TimeUnit {
  constructor(
    public $type: "TimeUnit",
    public unit: "s" | "ms",
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VType implements ASTInterfaces.Type {
  constructor(
    public $type: "Type",
    public name: string,
    public type: "boolean" | "double" | "int" | "void",
    public $container:
      | VParameter
      | VFunctionDef
      | VVariableDecl
  ) {}

  accept(visitor: RobotScriptVisitor): any {}
}

export class VVariableDecl implements ASTInterfaces.VariableDecl {
  constructor(
    public $type: "VariableDecl",
    public name: string,
    public type: VType,
    public expression: VExpression,
    public $container: VBlock
  ) {}

  accept(visitor: RobotScriptVisitor): any {}
}

export class VVariableCall implements ASTInterfaces.VariableCall {
  constructor(
    public $type: "VariableCall",
    public variable: Reference<ASTInterfaces.RobotSymbol>,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VWhile implements ASTInterfaces.While {
  constructor(
    public $type: "While",
    public condition: VExpression,
    public block: VBlock,
    public $container: VBlock
  ) {}

  accept(visitor: RobotScriptVisitor): any {}
}

/**
 * 
 * THE FOLLOWING CLASSES ARE "ABSTRACT" AST NODES CLASSES
 * CURRENTLY, THEY CAN ONLY BE USED IF WE USE THE CUSTOMIZED AST.ts FILE (currentast.ts)
 * 
 * IF THE NEW GRAMMAR HANDLES THIS ISSUE, THIS MESSAGE WONT BE NECESSARY ANYMORE  
 */


export class VExpression implements ASTInterfaces.Expression {
  constructor(
    public $type: "Expression",
    public $container: any,
    public $containerProperty?: string | undefined,
    public $containerIndex?: number | undefined,
    public $cstNode?: CstNode | undefined,
    public $document?: LangiumDocument<AstNode> | undefined
  ) {}
 
  accept(visitor: RobotScriptVisitor): any {}
}

export class VStatement implements ASTInterfaces.Statement {
  constructor(
    public $type: "Statement",
    public $container: any,
    public $containerProperty?: string | undefined,
    public $containerIndex?: number | undefined,
    public $cstNode?: CstNode | undefined,
    public $document?: LangiumDocument<AstNode> | undefined
  ) {}
  
  accept(visitor: RobotScriptVisitor): any {}
}


export class VRobotSymbol implements ASTInterfaces.RobotSymbol {
  constructor(
    public  $container: ASTInterfaces.VariableDecl | ASTInterfaces.Parameter,
    public $type: "RobotSymbol",
    public name: string,
    public type: ASTInterfaces.Type,
    public $containerProperty?: string | undefined,
    public $containerIndex?: number | undefined,
    public $cstNode?: CstNode | undefined,
    public $document?: LangiumDocument<AstNode> | undefined
    ) {}
    
    accept(visitor: RobotScriptVisitor): any {}
}