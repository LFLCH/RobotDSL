import type { ValidationAcceptor, ValidationChecks } from 'langium';
import * as InterfaceAST from '../representation/currentast.js';
import { RobotScriptServices } from '../robot-script-module.js';
import { RobotScriptVisitor, VAnd, VAssignment, VBlock, VBoolConstant, VComparison, VDistanceUnit, VDoubleConstant, VEquality, VFor, VFunctionCall, VFunctionDef, VFunctionReturn, VIf, VIntConstant, VMinus, VModel, VMovement, VMulDiv, VNot, VOr, VParameter, VPlusMinus, VPrint, VRobotDistanceSensor, VRobotMovement, VRobotRotation, VRobotSpeedAdjust, VRobotTimeSensor, VRotation, VTimeUnit, VType, VVariableCall, VVariableDecl, VWhile } from './visitor.js';

/**
 * Register custom validation checks.
 * @info this function needs to be called in the language module.ts file (see registerValidationChecks(...);)
 */
export function weaveAcceptMethods(services: RobotScriptServices) {
    const registry = services.validation.ValidationRegistry;
    const weaver = services.validation.RobotScriptAcceptWeaver
    registry.register(weaver.checks, weaver);
}


export class RobotScriptAcceptWeaver {

    weaveAnd(node : InterfaceAST.And, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitAnd(node as VAnd);}
    }

    weaveAssignment(node : InterfaceAST.Assignment, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitAssignment(node as VAssignment) ;}
    }

    weaveBlock(node : InterfaceAST.Block, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitBlock(node as  VBlock);}
    }

    weaveBoolConstant(node : InterfaceAST.BoolConstant, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitBoolConstant(node as  VBoolConstant);}
    }

    weaveComparison(node : InterfaceAST.Comparison, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitComparison(node as  VComparison);}
    }

    weaveDistanceUnit(node : InterfaceAST.DistanceUnit, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitDistanceUnit(node as  VDistanceUnit);}
    }

    weaveDoubleConstant(node : InterfaceAST.DoubleConstant, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitDoubleConstant(node as  VDoubleConstant);}
    }

    weaveEquality(node : InterfaceAST.Equality, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitEquality(node as  VEquality);}
    }

    weaveFor(node : InterfaceAST.For, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitFor(node as  VFor);}
    }

    weaveFunctionCall(node : InterfaceAST.FunctionCall, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitFunctionCall(node as  VFunctionCall);}
    }

    weaveFunctionDef(node : InterfaceAST.FunctionDef, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitFunctionDef(node as  VFunctionDef);}
    }

    weaveFunctionReturn(node : InterfaceAST.FunctionReturn, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitFunctionReturn(node as  VFunctionReturn);}
    }

    weaveIf(node : InterfaceAST.If, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitIf(node as  VIf);}
    }

    weaveIntConstant(node : InterfaceAST.IntConstant, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitIntConstant(node as  VIntConstant);}
    }

    weaveMinus(node : InterfaceAST.Minus, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitMinus(node as  VMinus);}
    }

    weaveModel(node : InterfaceAST.Model, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitModel(node as  VModel);}
    }

    weaveMovement(node : InterfaceAST.Movement, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitMovement(node as  VMovement);}
    }

    weaveMulDiv(node : InterfaceAST.MulDiv, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitMulDiv(node as  VMulDiv);}
    }

    weaveNot(node : InterfaceAST.Not, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitNot(node as  VNot);}
    }

    weaveOr(node : InterfaceAST.Or, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitOr(node as  VOr);}
    }

    weaveParameter(node : InterfaceAST.Parameter, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitParameter(node as  VParameter);}
    }

    weavePlusMinus(node : InterfaceAST.PlusMinus, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitPlusMinus(node as  VPlusMinus);}
    }

    weavePrint(node : InterfaceAST.Print, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitPrint(node as  VPrint);}
    }


    weaveRobotSpeedAdjust(node : InterfaceAST.RobotSpeedAdjust, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitRobotSpeedAdjust(node as  VRobotSpeedAdjust);}
    }

    weaveRobotDistanceSensor(node : InterfaceAST.RobotDistanceSensor, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitRobotDistanceSensor(node as  VRobotDistanceSensor);}
    }

    weaveRobotMovement(node : InterfaceAST.RobotMovement, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitRobotMovement(node as  VRobotMovement);}
    }

    weaveRobotRotation(node : InterfaceAST.RobotRotation, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitRobotRotation(node as  VRobotRotation);}
    }

    weaveRobotTimeSensor(node : InterfaceAST.RobotTimeSensor, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitRobotTimeSensor(node as  VRobotTimeSensor);}
    }

    weaveRotation(node : InterfaceAST.Rotation, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitRotation(node as  VRotation);}
    }

    weaveTimeUnit(node : InterfaceAST.TimeUnit, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitTimeUnit(node as  VTimeUnit);}
    }

    weaveType(node : InterfaceAST.Type, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitType(node as  VType);}
    }

    weaveVariableDecl(node : InterfaceAST.VariableDecl, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitVariableDecl(node as  VVariableDecl);}
    }

    weaveVariableCall(node : InterfaceAST.VariableCall, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitVariableCall(node as  VVariableCall);}
    }

    weaveWhile(node : InterfaceAST.While, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitWhile(node as  VWhile);}
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
        Print : this.weavePrint,
        RobotSpeedAdjust : this.weaveRobotSpeedAdjust,
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