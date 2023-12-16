import { AstNode, CstNode, LangiumDocument, Reference } from "langium";
import * as ASTInterfaces from "../generated/ast.js";
import { Model } from "../generated/ast.js";

export interface RobotScriptVisitor {
  // One visit method for each concept of the language
  visitAnd(node: ASTInterfaces.And): any;
  visitAssignment(node: ASTInterfaces.Assignment): any;
  visitBlock(node: ASTInterfaces.Block): any;
  visitBoolConstant(node: ASTInterfaces.BoolConstant): any;
  visitComparison(node: ASTInterfaces.Comparison): any;
  visitDistanceUnit(node: ASTInterfaces.DistanceUnit): any;
  visitDoubleConstant(node: ASTInterfaces.DoubleConstant): any;
  visitEquality(node: ASTInterfaces.Equality): any;
  visitFor(node: ASTInterfaces.For): any;
  visitFunctionCall(node: ASTInterfaces.FunctionCall): any;
  visitFunctionDef(node: ASTInterfaces.FunctionDef): any;
  visitFunctionReturn(node: ASTInterfaces.FunctionReturn): any;
  visitIf(node: ASTInterfaces.If): any;
  visitIntConstant(node: ASTInterfaces.IntConstant): any;
  visitMinus(node: ASTInterfaces.Minus): any;
  visitModel(node: ASTInterfaces.Model): any;
  visitMovement(node: ASTInterfaces.Movement): any;
  visitMulDiv(node: ASTInterfaces.MulDiv): any;
  visitNot(node: ASTInterfaces.Not): any;
  visitOr(node: ASTInterfaces.Or): any;
  visitParameter(node: ASTInterfaces.Parameter): any;
  visitPlusMinus(node: ASTInterfaces.PlusMinus): any;
  visitRobotAdjust(node: ASTInterfaces.RobotAdjust): any;
  visitRobotDistanceSensor(node: ASTInterfaces.RobotDistanceSensor): any;
  visitRobotMovement(node: ASTInterfaces.RobotMovement): any;
  visitRobotRotation(node: ASTInterfaces.RobotRotation): any;
  visitRobotTimeSensor(node: ASTInterfaces.RobotTimeSensor): any;
  visitRotation(node: ASTInterfaces.Rotation): any;
  visitTimeUnit(node: ASTInterfaces.TimeUnit): any;
  visitType(node: ASTInterfaces.Type): any;
  visitVariableDecl(node: ASTInterfaces.VariableDecl): any;
  visitVariableCall(node: ASTInterfaces.VariableCall): any;
  visitWhile(node: ASTInterfaces.While): any;
}

export class VAnd implements ASTInterfaces.And {
  constructor(
    public $type: "And",
    public left: ASTInterfaces.Expression,
    public right: ASTInterfaces.Expression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VAssignment implements ASTInterfaces.Assignment {
  constructor(
    public $type: "Assignment",
    public name: string,
    public expr: ASTInterfaces.Expression,
    public symbol: Reference<ASTInterfaces.RobotSymbol>,
    public expression: ASTInterfaces.Expression,
    public $container: ASTInterfaces.Block
  ) {}

  accept(visitor: RobotScriptVisitor): any {}
}

export class VBlock implements ASTInterfaces.Block {
  constructor(
    public $type: "Block",
    public statements: ASTInterfaces.Statement[],
    public $container: ASTInterfaces.FunctionDef
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
    public left: ASTInterfaces.Expression,
    public right: ASTInterfaces.Expression,
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
    public value: number,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VEquality implements ASTInterfaces.Equality {
  constructor(
    public $type: "Equality",
    public operator: "!=" | "==",
    public left: ASTInterfaces.Expression,
    public right: ASTInterfaces.Expression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VFor implements ASTInterfaces.For {
  constructor(
    public $type: "For",
    public condition: ASTInterfaces.Expression,
    public block: ASTInterfaces.Block,
    public increment: ASTInterfaces.Assignment,
    public init: ASTInterfaces.Assignment | ASTInterfaces.VariableDecl,
    public $container: ASTInterfaces.Block
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VFunctionCall implements ASTInterfaces.FunctionCall {
  constructor(
    public $type: "FunctionCall",
    public name: string,
    public functionCall: Reference<ASTInterfaces.FunctionDef>,
    public args: ASTInterfaces.Expression[],
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VFunctionDef implements ASTInterfaces.FunctionDef {
  constructor(
    public $type: "FunctionDef",
    public name: string,
    public block: ASTInterfaces.Block,
    public params: ASTInterfaces.Parameter[],
    public type: ASTInterfaces.Type,
    public $container: Model
  ) {}

  accept(visitor: RobotScriptVisitor): any {}
}

export class VFunctionReturn implements ASTInterfaces.FunctionReturn {
  constructor(
    public $type: "FunctionReturn",
    public expression: ASTInterfaces.Expression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VIf implements ASTInterfaces.If {
  constructor(
    public $type: "If",
    public mainCondition: ASTInterfaces.Expression,
    public subsidaryConditions: ASTInterfaces.Expression[],
    public thenBlock: ASTInterfaces.Block,
    public $container: ASTInterfaces.Block,
    public elifBlock?: ASTInterfaces.Block | undefined,
    public elseBlock?: ASTInterfaces.Block | undefined
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
    public expression: ASTInterfaces.Expression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VModel implements ASTInterfaces.Model {
  constructor(
    public $type: "Model",
    public functionsDef: ASTInterfaces.FunctionDef[],
    public statements: ASTInterfaces.Statement[],
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
    public operator: "*" | "/",
    public left: ASTInterfaces.Expression,
    public right: ASTInterfaces.Expression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VNot implements ASTInterfaces.Not {
  constructor(
    public $type: "Not",
    public expression: ASTInterfaces.Expression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VOr implements ASTInterfaces.Or {
  constructor(
    public $type: "Or",
    public left: ASTInterfaces.Expression,
    public right: ASTInterfaces.Expression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VParameter implements ASTInterfaces.Parameter {
  constructor(
    public $type: "Parameter",
    public name: string,
    public type: ASTInterfaces.Type,
    public $container: ASTInterfaces.FunctionDef,
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
    public left: ASTInterfaces.Expression,
    public right: ASTInterfaces.Expression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VRobotAdjust implements ASTInterfaces.RobotAdjust {
  constructor(
    public $type: "RobotAdjust",
    public args: ASTInterfaces.Expression,
    public robotAdjustment: "ModifySpeed",
    public unit: ASTInterfaces.DistanceUnit,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VRobotDistanceSensor implements ASTInterfaces.RobotDistanceSensor {
  constructor(
    public $type: "RobotDistanceSensor",
    public args: ASTInterfaces.Expression,
    public robotDistanceSensor: "CurrentDistance",
    public unit: ASTInterfaces.DistanceUnit,
    public $container: any
  ) {}
}

export class VRobotMovement implements ASTInterfaces.RobotMovement {
  constructor(
    public $type: "RobotMovement",
    public robotMovement: ASTInterfaces.Movement,
    public args: ASTInterfaces.Expression,
    public unit: ASTInterfaces.DistanceUnit,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VRobotRotation implements ASTInterfaces.RobotRotation {
  constructor(
    public $type: "RobotRotation",
    public robotRotation: ASTInterfaces.Rotation,
    public args: ASTInterfaces.Expression,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VRobotTimeSensor implements ASTInterfaces.RobotTimeSensor {
  constructor(
    public $type: "RobotTimeSensor",
    public robotTimeSensor: "CurrentTime",
    public unit: ASTInterfaces.TimeUnit,
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
      | ASTInterfaces.Parameter
      | ASTInterfaces.FunctionDef
      | ASTInterfaces.VariableDecl
  ) {}

  accept(visitor: RobotScriptVisitor): any {}
}

export class VVariableDecl implements ASTInterfaces.VariableDecl {
  constructor(
    public $type: "VariableDecl",
    public name: string,
    public type: ASTInterfaces.Type,
    public expression: ASTInterfaces.Expression,
    public $container: ASTInterfaces.Block
  ) {}

  accept(visitor: RobotScriptVisitor): any {}
}

export class VVariableCall implements ASTInterfaces.VariableCall {
  constructor(
    public $type: "VariableCall",
    public name: string,
    public variable: Reference<ASTInterfaces.RobotSymbol>,
    public $container: any
  ) {}
  accept(visitor: RobotScriptVisitor): any {}
}

export class VWhile implements ASTInterfaces.While {
  constructor(
    public $type: "While",
    public condition: ASTInterfaces.Expression,
    public block: ASTInterfaces.Block,
    public $container: ASTInterfaces.Block
  ) {}

  accept(visitor: RobotScriptVisitor): any {}
}
