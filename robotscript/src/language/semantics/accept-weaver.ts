import type { ValidationAcceptor, ValidationChecks } from 'langium';
import * as InterfaceAST from '../generated/ast.js';
import { RobotScriptServices } from '../robot-script-module.js';
import { RobotScriptVisitor, VAnd, VAssignment, VBlock, VModel } from './visitor.js';

/**
 * Register custom validation checks.
 * TODO : Call this function in the language module.ts file (see registerValidationChecks(...);)
 */
export function weaveAcceptMethods(services: RobotScriptServices) {
    const registry = services.validation.ValidationRegistry;
    const weaver = services.validation.RoboMlAcceptWeaver
    registry.register(weaver.checks, weaver);
}

/**
 * TODO:
 * You must implement a weaving function for each concrete concept of the language.
 * you will also need to fill the check data structure to map the weaving function to the Type of node
 */
export class RoboMlAcceptWeaver {

    weaveAnd(node : InterfaceAST.And, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitAnd(node as unknown as VAnd);}
    }

    weaveAssignment(node : InterfaceAST.Assignment, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitAssignment(node as unknown as VAssignment) ;}
    }

    weaveBlock(node : InterfaceAST.Block, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitBlock(node as unknown as VBlock);}
    }

    weaveBoolConstant(node : InterfaceAST.BoolConstant, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitBoolConstant(node as unknown as InterfaceAST.BoolConstant);}
    }

    weaveComparison(node : InterfaceAST.Comparison, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitComparison(node as unknown as InterfaceAST.Comparison);}
    }

    weaveDistanceUnit(node : InterfaceAST.DistanceUnit, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitDistanceUnit(node as unknown as InterfaceAST.DistanceUnit);}
    }

    weaveDoubleConstant(node : InterfaceAST.DoubleConstant, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitDoubleConstant(node as unknown as InterfaceAST.DoubleConstant);}
    }

    weaveEquality(node : InterfaceAST.Equality, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitEquality(node as unknown as InterfaceAST.Equality);}
    }

    weaveFor(node : InterfaceAST.For, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitFor(node as unknown as InterfaceAST.For);}
    }

    weaveFunctionCall(node : InterfaceAST.FunctionCall, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitFunctionCall(node as unknown as InterfaceAST.FunctionCall);}
    }

    weaveFunctionDef(node : InterfaceAST.FunctionDef, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitFunctionDef(node as unknown as InterfaceAST.FunctionDef);}
    }

    weaveFunctionReturn(node : InterfaceAST.FunctionReturn, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitFunctionReturn(node as unknown as InterfaceAST.FunctionReturn);}
    }

    weaveIf(node : InterfaceAST.If, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitIf(node as unknown as InterfaceAST.If);}
    }

    weaveIntConstant(node : InterfaceAST.IntConstant, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitIntConstant(node as unknown as InterfaceAST.IntConstant);}
    }

    weaveMinus(node : InterfaceAST.Minus, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitMinus(node as unknown as InterfaceAST.Minus);}
    }

    weaveModel(node : InterfaceAST.Model, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitModel(node as unknown as VModel);}
    }

    weaveMovement(node : InterfaceAST.Movement, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitMovement(node as unknown as InterfaceAST.Movement);}
    }

    weaveMulDiv(node : InterfaceAST.MulDiv, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitMulDiv(node as unknown as InterfaceAST.MulDiv);}
    }

    weaveNot(node : InterfaceAST.Not, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitNot(node as unknown as InterfaceAST.Not);}
    }

    weaveOr(node : InterfaceAST.Or, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitOr(node as unknown as InterfaceAST.Or);}
    }

    weaveParameter(node : InterfaceAST.Parameter, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitParameter(node as unknown as InterfaceAST.Parameter);}
    }

    weavePlusMinus(node : InterfaceAST.PlusMinus, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitPlusMinus(node as unknown as InterfaceAST.PlusMinus);}
    }


    weaveRobotAdjust(node : InterfaceAST.RobotAdjust, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitRobotAdjust(node as unknown as InterfaceAST.RobotAdjust);}
    }

    weaveRobotDistanceSensor(node : InterfaceAST.RobotDistanceSensor, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitRobotDistanceSensor(node as unknown as InterfaceAST.RobotDistanceSensor);}
    }

    weaveRobotMovement(node : InterfaceAST.RobotMovement, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitRobotMovement(node as unknown as InterfaceAST.RobotMovement);}
    }

    weaveRobotRotation(node : InterfaceAST.RobotRotation, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitRobotRotation(node as unknown as InterfaceAST.RobotRotation);}
    }

    weaveRobotTimeSensor(node : InterfaceAST.RobotTimeSensor, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitRobotTimeSensor(node as unknown as InterfaceAST.RobotTimeSensor);}
    }

    weaveRotation(node : InterfaceAST.Rotation, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitRotation(node as unknown as InterfaceAST.Rotation);}
    }

    weaveTimeUnit(node : InterfaceAST.TimeUnit, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitTimeUnit(node as unknown as InterfaceAST.TimeUnit);}
    }

    weaveType(node : InterfaceAST.Type, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitType(node as unknown as InterfaceAST.Type);}
    }

    weaveVariableDecl(node : InterfaceAST.VariableDecl, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitVariableDecl(node as unknown as InterfaceAST.VariableDecl);}
    }

    weaveVariableCall(node : InterfaceAST.VariableCall, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitVariableCall(node as unknown as InterfaceAST.VariableCall);}
    }

    weaveWhile(node : InterfaceAST.While, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitWhile(node as unknown as InterfaceAST.While);}
    }

    checks: ValidationChecks<InterfaceAST.RobotScriptAstType> = {
        And : this.weaveAnd,
        Assignment : this.weaveAssignment,
        Block : this.weaveBlock,
        BoolConstant : this.weaveBoolConstant,
        Comparison : this.weaveComparison,
        DistanceUnit : this.weaveDistanceUnit,
        DoubleConstant : this.weaveDoubleConstant,
        Equality : this.weaveEquality,
        For : this.weaveFor,
        FunctionCall : this.weaveFunctionCall,
        FunctionDef : this.weaveFunctionDef,
        FunctionReturn : this.weaveFunctionReturn,
        If : this.weaveIf,
        IntConstant : this.weaveIntConstant,
        Minus : this.weaveMinus,
        Model : this.weaveModel,
        Movement : this.weaveMovement,
        MulDiv : this.weaveMulDiv,
        Not : this.weaveNot,
        Or : this.weaveOr,
        Parameter : this.weaveParameter,
        PlusMinus : this.weavePlusMinus,
        RobotAdjust : this.weaveRobotAdjust,
        RobotDistanceSensor : this.weaveRobotDistanceSensor,
        RobotMovement : this.weaveRobotMovement,
        RobotRotation : this.weaveRobotRotation,
        RobotTimeSensor : this.weaveRobotTimeSensor,
        Rotation : this.weaveRotation,
        TimeUnit : this.weaveTimeUnit,
        Type : this.weaveType,
        VariableCall : this.weaveVariableCall,
        VariableDecl : this.weaveVariableDecl,
        While : this.weaveWhile,
    };

}