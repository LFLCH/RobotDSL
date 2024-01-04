/******************************************************************************
 * This file is normally Generaty by Langium and should not be manually edited.
 * However, the current grammar generation does not provide interfaces for 
 * "Abstract" AST nodes such as "Expression",  "RobotSymbol"  and  "Statement". 
 * Therefore, in this file we commented their previous definitions, 
 * prefixed by the text "PREVIOUS <AST NODE>" and wrote them as interfaces instead, 
 * prefixed by  the text "NEW <AST NODE>".
 * 
 * Obviously, the best solution would be to have the grammar generation 
 * providing interfaces for these nodes.
 *
 ******************************************************************************/

/* eslint-disable */
import type { AstNode, Reference, ReferenceInfo, TypeMetaData } from 'langium';
import { AbstractAstReflection } from 'langium';

export const RobotScriptTerminals = {
    WS: /\s+/,
    ID: /[_a-zA-Z][\w_]*/,
    INT: /[0-9]+/,
    DOUBLE: /((([0-9]+)\.([0-9]+))|([0-9]+))/,
    ML_COMMENT: /\/\*[\s\S]*?\*\//,
    SL_COMMENT: /\/\/[^\n\r]*/,
};

export type ControlStructure = For | If | While;

export const ControlStructure = 'ControlStructure';

export function isControlStructure(item: unknown): item is ControlStructure {
    return reflection.isInstance(item, ControlStructure);
}

// PREVIOUS EXPRESSION
// export type Expression = And | BoolConstant | Comparison | DoubleConstant | Equality | FunctionCall | IntConstant | Minus | MulDiv | Not | Or | PlusMinus | Print | RobotDistanceSensor | RobotMovement | RobotRotation | RobotSpeedAdjust | RobotTimeSensor | VariableCall;

// NEW EXPRESSION
export interface Expression extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | MulDiv | Not | Or | PlusMinus | Print | RobotDistanceSensor | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableCall | While;
    readonly $type: 'Expression';
}

export const Expression = 'Expression';

export function isExpression(item: unknown): item is Expression {
    return reflection.isInstance(item, Expression);
}

// PREVIOUS ROBOT SYMBOL
// export type RobotSymbol = Parameter | VariableDecl;

// NEW ROBOT SYMBOL
export interface RobotSymbol extends AstNode {
    readonly $container: Parameter | VariableDecl;
    readonly $type: 'RobotSymbol';
    name: string
    type: Type
}

export const RobotSymbol = 'RobotSymbol';

export function isRobotSymbol(item: unknown): item is RobotSymbol {
    return reflection.isInstance(item, RobotSymbol);
}

// PREVIOUS STATEMENT
// export type Statement = Assignment | ControlStructure | Expression | FunctionReturn | VariableDecl;

// NEW STATEMENT
export interface Statement extends AstNode {
    readonly $container:Assignment | ControlStructure | Expression | FunctionReturn | VariableDecl;
    readonly $type: 'Statement';
}

export const Statement = 'Statement';

export function isStatement(item: unknown): item is Statement {
    return reflection.isInstance(item, Statement);
}

export interface And extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'And';
    left: Expression
    right: Expression
}

export const And = 'And';

export function isAnd(item: unknown): item is And {
    return reflection.isInstance(item, And);
}

export interface Assignment extends AstNode {
    readonly $container: Block | For | Model;
    readonly $type: 'Assignment';
    expression: Expression
    symbol: Reference<RobotSymbol>
}

export const Assignment = 'Assignment';

export function isAssignment(item: unknown): item is Assignment {
    return reflection.isInstance(item, Assignment);
}

export interface Block extends AstNode {
    readonly $container: For | FunctionDef | If | While;
    readonly $type: 'Block';
    statements: Array<Statement>
}

export const Block = 'Block';

export function isBlock(item: unknown): item is Block {
    return reflection.isInstance(item, Block);
}

export interface BoolConstant extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'BoolConstant';
    value: 'false' | 'true'
}

export const BoolConstant = 'BoolConstant';

export function isBoolConstant(item: unknown): item is BoolConstant {
    return reflection.isInstance(item, BoolConstant);
}

export interface Comparison extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'Comparison';
    left: Expression
    operator: '<' | '<=' | '>' | '>='
    right: Expression
}

export const Comparison = 'Comparison';

export function isComparison(item: unknown): item is Comparison {
    return reflection.isInstance(item, Comparison);
}

export interface DistanceUnit extends AstNode {
    readonly $container: RobotDistanceSensor | RobotMovement | RobotSpeedAdjust;
    readonly $type: 'DistanceUnit';
    unit: 'cm' | 'dm' | 'm' | 'mm'
}

export const DistanceUnit = 'DistanceUnit';

export function isDistanceUnit(item: unknown): item is DistanceUnit {
    return reflection.isInstance(item, DistanceUnit);
}

export interface DoubleConstant extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'DoubleConstant';
    value: number
}

export const DoubleConstant = 'DoubleConstant';

export function isDoubleConstant(item: unknown): item is DoubleConstant {
    return reflection.isInstance(item, DoubleConstant);
}

export interface Equality extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'Equality';
    left: Expression
    operator: '!=' | '=='
    right: Expression
}

export const Equality = 'Equality';

export function isEquality(item: unknown): item is Equality {
    return reflection.isInstance(item, Equality);
}

export interface For extends AstNode {
    readonly $container: Block | Model;
    readonly $type: 'For';
    block: Block
    condition: Expression
    increment: Assignment
    init: Assignment | VariableDecl
}

export const For = 'For';

export function isFor(item: unknown): item is For {
    return reflection.isInstance(item, For);
}

export interface FunctionCall extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'FunctionCall';
    args: Array<Expression>
    functionCall: Reference<FunctionDef>
}

export const FunctionCall = 'FunctionCall';

export function isFunctionCall(item: unknown): item is FunctionCall {
    return reflection.isInstance(item, FunctionCall);
}

export interface FunctionDef extends AstNode {
    readonly $container: Model;
    readonly $type: 'FunctionDef';
    block: Block
    name: string
    params: Array<Parameter>
    type: Type
}

export const FunctionDef = 'FunctionDef';

export function isFunctionDef(item: unknown): item is FunctionDef {
    return reflection.isInstance(item, FunctionDef);
}

export interface FunctionReturn extends AstNode {
    readonly $container: Block | Model;
    readonly $type: 'FunctionReturn';
    expression: Expression
}

export const FunctionReturn = 'FunctionReturn';

export function isFunctionReturn(item: unknown): item is FunctionReturn {
    return reflection.isInstance(item, FunctionReturn);
}

export interface If extends AstNode {
    readonly $container: Block | Model;
    readonly $type: 'If';
    elifBlock?: Block
    elseBlock?: Block
    mainCondition: Expression
    subsidaryConditions: Array<Expression>
    thenBlock: Block
}

export const If = 'If';

export function isIf(item: unknown): item is If {
    return reflection.isInstance(item, If);
}

export interface IntConstant extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'IntConstant';
    value: number
}

export const IntConstant = 'IntConstant';

export function isIntConstant(item: unknown): item is IntConstant {
    return reflection.isInstance(item, IntConstant);
}

export interface Minus extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'Minus';
    expression: Expression
}

export const Minus = 'Minus';

export function isMinus(item: unknown): item is Minus {
    return reflection.isInstance(item, Minus);
}

export interface Model extends AstNode {
    readonly $type: 'Model';
    functionsDef: Array<FunctionDef>
    statements: Array<Statement>
}

export const Model = 'Model';

export function isModel(item: unknown): item is Model {
    return reflection.isInstance(item, Model);
}

export interface Movement extends AstNode {
    readonly $container: RobotMovement;
    readonly $type: 'Movement';
    movement: 'Backward' | 'Forward' | 'Left' | 'Right'
}

export const Movement = 'Movement';

export function isMovement(item: unknown): item is Movement {
    return reflection.isInstance(item, Movement);
}

export interface MulDiv extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'MulDiv';
    left: Expression
    operator: '%' | '*' | '/'
    right: Expression
}

export const MulDiv = 'MulDiv';

export function isMulDiv(item: unknown): item is MulDiv {
    return reflection.isInstance(item, MulDiv);
}

export interface Not extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'Not';
    expression: Expression
}

export const Not = 'Not';

export function isNot(item: unknown): item is Not {
    return reflection.isInstance(item, Not);
}

export interface Or extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'Or';
    left: Expression
    right: Expression
}

export const Or = 'Or';

export function isOr(item: unknown): item is Or {
    return reflection.isInstance(item, Or);
}

export interface Parameter extends AstNode {
    readonly $container: FunctionDef;
    readonly $type: 'Parameter';
    name: string
    type: Type
}

export const Parameter = 'Parameter';

export function isParameter(item: unknown): item is Parameter {
    return reflection.isInstance(item, Parameter);
}

export interface PlusMinus extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'PlusMinus';
    left: Expression
    operator: '+' | '-'
    right: Expression
}

export const PlusMinus = 'PlusMinus';

export function isPlusMinus(item: unknown): item is PlusMinus {
    return reflection.isInstance(item, PlusMinus);
}

export interface Print extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'Print';
    expression: Expression
}

export const Print = 'Print';

export function isPrint(item: unknown): item is Print {
    return reflection.isInstance(item, Print);
}

export interface RobotDistanceSensor extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'RobotDistanceSensor';
    unit: DistanceUnit
}

export const RobotDistanceSensor = 'RobotDistanceSensor';

export function isRobotDistanceSensor(item: unknown): item is RobotDistanceSensor {
    return reflection.isInstance(item, RobotDistanceSensor);
}

export interface RobotMovement extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'RobotMovement';
    distance: Expression
    robotMovement: Movement
    unit: DistanceUnit
}

export const RobotMovement = 'RobotMovement';

export function isRobotMovement(item: unknown): item is RobotMovement {
    return reflection.isInstance(item, RobotMovement);
}

export interface RobotRotation extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'RobotRotation';
    angle: Expression
    robotRotation: Rotation
}

export const RobotRotation = 'RobotRotation';

export function isRobotRotation(item: unknown): item is RobotRotation {
    return reflection.isInstance(item, RobotRotation);
}

export interface RobotSpeedAdjust extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'RobotSpeedAdjust';
    speed: Expression
    unit: DistanceUnit
}

export const RobotSpeedAdjust = 'RobotSpeedAdjust';

export function isRobotSpeedAdjust(item: unknown): item is RobotSpeedAdjust {
    return reflection.isInstance(item, RobotSpeedAdjust);
}

export interface RobotTimeSensor extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'RobotTimeSensor';
    unit: TimeUnit
}

export const RobotTimeSensor = 'RobotTimeSensor';

export function isRobotTimeSensor(item: unknown): item is RobotTimeSensor {
    return reflection.isInstance(item, RobotTimeSensor);
}

export interface Rotation extends AstNode {
    readonly $container: RobotRotation;
    readonly $type: 'Rotation';
    rotation: 'Anticlock' | 'Clock'
}

export const Rotation = 'Rotation';

export function isRotation(item: unknown): item is Rotation {
    return reflection.isInstance(item, Rotation);
}

export interface TimeUnit extends AstNode {
    readonly $container: RobotTimeSensor;
    readonly $type: 'TimeUnit';
    unit: 'ms' | 's'
}

export const TimeUnit = 'TimeUnit';

export function isTimeUnit(item: unknown): item is TimeUnit {
    return reflection.isInstance(item, TimeUnit);
}

export interface Type extends AstNode {
    readonly $container: FunctionDef | Parameter | VariableDecl;
    readonly $type: 'Type';
    type: 'boolean' | 'double' | 'int' | 'void'
}

export const Type = 'Type';

export function isType(item: unknown): item is Type {
    return reflection.isInstance(item, Type);
}

export interface VariableCall extends AstNode {
    readonly $container: And | Assignment | Block | Comparison | Equality | For | FunctionCall | FunctionReturn | If | Minus | Model | MulDiv | Not | Or | PlusMinus | Print | RobotMovement | RobotRotation | RobotSpeedAdjust | VariableDecl | While;
    readonly $type: 'VariableCall';
    variable: Reference<RobotSymbol>
}

export const VariableCall = 'VariableCall';

export function isVariableCall(item: unknown): item is VariableCall {
    return reflection.isInstance(item, VariableCall);
}

export interface VariableDecl extends AstNode {
    readonly $container: Block | For | Model;
    readonly $type: 'VariableDecl';
    expression: Expression
    name: string
    type: Type
}

export const VariableDecl = 'VariableDecl';

export function isVariableDecl(item: unknown): item is VariableDecl {
    return reflection.isInstance(item, VariableDecl);
}

export interface While extends AstNode {
    readonly $container: Block | Model;
    readonly $type: 'While';
    block: Block
    condition: Expression
}

export const While = 'While';

export function isWhile(item: unknown): item is While {
    return reflection.isInstance(item, While);
}

export type RobotScriptAstType = {
    And: And
    Assignment: Assignment
    Block: Block
    BoolConstant: BoolConstant
    Comparison: Comparison
    ControlStructure: ControlStructure
    DistanceUnit: DistanceUnit
    DoubleConstant: DoubleConstant
    Equality: Equality
    Expression: Expression
    For: For
    FunctionCall: FunctionCall
    FunctionDef: FunctionDef
    FunctionReturn: FunctionReturn
    If: If
    IntConstant: IntConstant
    Minus: Minus
    Model: Model
    Movement: Movement
    MulDiv: MulDiv
    Not: Not
    Or: Or
    Parameter: Parameter
    PlusMinus: PlusMinus
    Print: Print
    RobotDistanceSensor: RobotDistanceSensor
    RobotMovement: RobotMovement
    RobotRotation: RobotRotation
    RobotSpeedAdjust: RobotSpeedAdjust
    RobotSymbol: RobotSymbol
    RobotTimeSensor: RobotTimeSensor
    Rotation: Rotation
    Statement: Statement
    TimeUnit: TimeUnit
    Type: Type
    VariableCall: VariableCall
    VariableDecl: VariableDecl
    While: While
}

export class RobotScriptAstReflection extends AbstractAstReflection {

    getAllTypes(): string[] {
        return ['And', 'Assignment', 'Block', 'BoolConstant', 'Comparison', 'ControlStructure', 'DistanceUnit', 'DoubleConstant', 'Equality', 'Expression', 'For', 'FunctionCall', 'FunctionDef', 'FunctionReturn', 'If', 'IntConstant', 'Minus', 'Model', 'Movement', 'MulDiv', 'Not', 'Or', 'Parameter', 'PlusMinus', 'Print', 'RobotDistanceSensor', 'RobotMovement', 'RobotRotation', 'RobotSpeedAdjust', 'RobotSymbol', 'RobotTimeSensor', 'Rotation', 'Statement', 'TimeUnit', 'Type', 'VariableCall', 'VariableDecl', 'While'];
    }

    protected override computeIsSubtype(subtype: string, supertype: string): boolean {
        switch (subtype) {
            case And:
            case BoolConstant:
            case Comparison:
            case DoubleConstant:
            case Equality:
            case FunctionCall:
            case IntConstant:
            case Minus:
            case MulDiv:
            case Not:
            case Or:
            case PlusMinus:
            case Print:
            case RobotDistanceSensor:
            case RobotMovement:
            case RobotRotation:
            case RobotSpeedAdjust:
            case RobotTimeSensor:
            case VariableCall: {
                return this.isSubtype(Expression, supertype);
            }
            case Assignment:
            case ControlStructure:
            case Expression:
            case FunctionReturn: {
                return this.isSubtype(Statement, supertype);
            }
            case For:
            case If:
            case While: {
                return this.isSubtype(ControlStructure, supertype);
            }
            case Parameter: {
                return this.isSubtype(RobotSymbol, supertype);
            }
            case VariableDecl: {
                return this.isSubtype(RobotSymbol, supertype) || this.isSubtype(Statement, supertype);
            }
            default: {
                return false;
            }
        }
    }

    getReferenceType(refInfo: ReferenceInfo): string {
        const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
        switch (referenceId) {
            case 'Assignment:symbol':
            case 'VariableCall:variable': {
                return RobotSymbol;
            }
            case 'FunctionCall:functionCall': {
                return FunctionDef;
            }
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }

    getTypeMetaData(type: string): TypeMetaData {
        switch (type) {
            case 'Block': {
                return {
                    name: 'Block',
                    mandatory: [
                        { name: 'statements', type: 'array' }
                    ]
                };
            }
            case 'FunctionCall': {
                return {
                    name: 'FunctionCall',
                    mandatory: [
                        { name: 'args', type: 'array' }
                    ]
                };
            }
            case 'FunctionDef': {
                return {
                    name: 'FunctionDef',
                    mandatory: [
                        { name: 'params', type: 'array' }
                    ]
                };
            }
            case 'If': {
                return {
                    name: 'If',
                    mandatory: [
                        { name: 'subsidaryConditions', type: 'array' }
                    ]
                };
            }
            case 'Model': {
                return {
                    name: 'Model',
                    mandatory: [
                        { name: 'functionsDef', type: 'array' },
                        { name: 'statements', type: 'array' }
                    ]
                };
            }
            default: {
                return {
                    name: type,
                    mandatory: []
                };
            }
        }
    }
}

export const reflection = new RobotScriptAstReflection();
