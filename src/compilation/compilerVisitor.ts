import { RobotScriptVisitor, VAnd, VAssignment, VBlock, VBoolConstant, VComparison, VDistanceUnit, VDoubleConstant, VEquality, VFor, VFunctionCall, VFunctionDef, VFunctionReturn, VIf, VIntConstant, VMinus, VModel, VMovement, VMulDiv, VNot, VOr, VParameter, VPlusMinus, VPrint, VRobotDistanceSensor, VRobotMovement, VRobotRotation, VRobotSpeedAdjust, VRobotTimeSensor, VRotation, VTimeUnit, VType, VVariableCall, VVariableDecl, VWhile } from "../language/semantics/visitor.js";
import { InoCode } from "./inocode.js";


export class RobotCompilerVisitor implements RobotScriptVisitor{

    constructor(
    ) {}

    visitAnd(node: VAnd) {
        return '(' +node.left.accept(this) +')' + InoCode.AND + node.right.accept(this);
    }
    visitAssignment(node: VAssignment) {
        return node.symbol.ref?.name + InoCode.ASSIGN + node.expression.accept(this);
    }
    visitBlock(node: VBlock) {
        return InoCode.BLOCK_START + node.statements.map(s => "  "+s.accept(this)).join(';\n') + ';'+InoCode.BLOCK_END;
    }
    visitBoolConstant(node: VBoolConstant) {
        return node.value==="true" ? InoCode.TRUE : InoCode.FALSE;
    }
    visitComparison(node: VComparison) {
        let comparison =""
        switch(node.operator){
            case "<":
                comparison = InoCode.LESS;
                break;
            case "<=":
                comparison = InoCode.LESS_EQUAL;
                break;
            case ">":
                comparison = InoCode.GREATER;
                break;
            case ">=":
                comparison = InoCode.GREATER_EQUAL;
                break;
            default:
                throw new Error("Operator not supported");
        }
        return '(' +node.left.accept(this) +')' + comparison + node.right.accept(this);
    }
    /**
     * @returns a multiplication factor that helps to convert the current unit value in meters
     */
    visitDistanceUnit(node: VDistanceUnit) {
        switch(node.unit){
            case "m" :
                return 1;
            case "dm":
                return 0.1;
            case "cm" :
                return 0.01;
            case "mm" :
                return 0.001;
        }
    }
    visitDoubleConstant(node: VDoubleConstant): number {
        return node.value;
      }
    visitEquality(node: VEquality) {
        let equality =""
        switch(node.operator){
            case "==":
                equality = InoCode.EQUAL;
                break;
            case "!=":
                equality = InoCode.DIFFERENT;
                break;
            default:
                throw new Error("Operator not supported");
        }
        return '(' +node.left.accept(this) +')' + equality + node.right.accept(this);
    }
    visitFor(node: VFor) {
        return InoCode.FOR + InoCode.COND_START + node.init.accept(this) + InoCode.FOR_SEPARATOR + node.condition.accept(this) + InoCode.FOR_SEPARATOR + node.increment.accept(this)+ InoCode.COND_END + node.block.accept(this);
    }
    visitFunctionCall(node: VFunctionCall) {
        return node.functionCall.ref?.name + InoCode.METHOD_CALL_START + node.args.map(a => a.accept(this)).join(InoCode.PARAM_SEPARATOR) + InoCode.METHOD_CALL_END;
    }
    visitFunctionDef(node: VFunctionDef) {
        return node.type.accept(this) + " " + node.name + InoCode.METHOD_DECLARATION_START + node.params.map(p => p.accept(this)).join(InoCode.PARAM_SEPARATOR) + InoCode.METHOD_DECLARATION_END + node.block.accept(this); 
    }
    visitFunctionReturn(node: VFunctionReturn) {
        return InoCode.RETURN + node.expression.accept(this);
    }
    visitIf(node: VIf) {
        const ifPart = InoCode.IF + InoCode.COND_START  + node.mainCondition.accept(this)+ InoCode.COND_END + node.thenBlock.accept(this);
        let elseIfPart = "" 
        for(let i=0 ; i<node.subsidaryConditions.length; i++){
            const condition = node.subsidaryConditions[i];
            elseIfPart+= InoCode.ELSE_IF + InoCode.COND_START + condition.accept(this) + InoCode.COND_END + node.elifBlocks[i].accept(this);
        }
        const elsePart = node.elseBlock ? InoCode.ELSE + node.elseBlock.accept(this) : "";
        return ifPart + elseIfPart + elsePart;
    }
    visitIntConstant(node: VIntConstant) {
        return node.value;
    }
    visitMinus(node: VMinus) {
        return InoCode.MINUS_UNARY + node.expression.accept(this)
    }
    visitModel(node: VModel) {
        const functionsImplementations = node.functionsDef.map(f => f.accept(this)).join('\n');
        const mainCode = node.statements.map(s => "  "+s.accept(this)).join(';\n') + ';'
        return InoCode.INCLUDES+ '\n' + InoCode.DECLARATIONS + '\n' + InoCode.ROBOT_METHODS + '\n' + "void setup(){"+InoCode.SETUP_CONTENT+"}\n"+ functionsImplementations + "\n" + "void loop()"+InoCode.BLOCK_START + InoCode.LOOP_CONTENT + mainCode + InoCode.BLOCK_END;
    }
    visitMovement(node: VMovement) {
        // not necessary. The arduino method will handle itself. 
        // switch(node.movement)
        // {
        //     case "Forward":
        //         return 0;
        //     case "Backward":
        //         return -180;
        //     case "Left":
        //         return -90;
        //     case "Right":
        //         return +90;
        // }
    }
    visitMulDiv(node: VMulDiv) {
        let operator = "";
        switch(node.operator){
            case "*":
                operator = InoCode.TIMES;
                break;
            case "/":
                operator = InoCode.DIVIDE;
                break;
            case "%":
                operator = InoCode.MODULO;
                break;
        }
        return '(' +node.left.accept(this) +')' + operator + node.right.accept(this);
    }
    visitNot(node: VNot) {
        return InoCode.NOT + node.expression.accept(this);
    }
    visitOr(node: VOr) {
        return '(' +node.left.accept(this) +')' + InoCode.OR + node.right.accept(this);
    }
    visitParameter(node: VParameter) {
        return node.type.accept(this) + " " + node.name;
    }
    visitPlusMinus(node: VPlusMinus) {
        let operator = "";
        switch(node.operator){
            case "+":
                operator = InoCode.PLUS;
                break;
            case "-":
                operator = InoCode.MINUS;
                break;
        }
        return '(' +node.left.accept(this) +')' + operator + node.right.accept(this);
    }
    visitPrint(node: VPrint) {
        return "robotSpeak( String(" + node.expression.accept(this) + "))";
    }
    visitRobotSpeedAdjust(node: VRobotSpeedAdjust) {
        return "setRobotSpeed(" + '(' +node.speed.accept(this)+')'+ InoCode.TIMES+ '('+node.unit.accept(this)+')' + ")";
    }
    visitRobotDistanceSensor(node: VRobotDistanceSensor) {
        return "getRobotDistance()"+ InoCode.TIMES + node.unit.accept(this);
    }
    visitRobotMovement(node: VRobotMovement) {
        return "robotMove(" +'"'+ node.robotMovement.movement +'"'+ InoCode.PARAM_SEPARATOR + '('+node.distance.accept(this)+ ')' + InoCode.TIMES + node.unit.accept(this) + ")";
    }
    visitRobotRotation(node: VRobotRotation) {
        return "robotRotate(" +'(' +node.robotRotation.accept(this)+')'+ InoCode.TIMES + '(' +node.angle.accept(this)+ "))";
    }
    visitRobotTimeSensor(node: VRobotTimeSensor) {
        return "getRobotTime()"+ InoCode.TIMES + node.unit.accept(this);
    }
    visitRotation(node: VRotation) {
        switch(node.rotation)
        {
            case "Anticlock":
                return -1;
            case "Clock":
                return +1;
        }
    }
    visitTimeUnit(node: VTimeUnit) {
        switch(node.unit)
        {
            case "s":
                return 1;
            case "ms":
                return 0.001;
        }
    }
    visitType(node: VType) {
        switch(node.type)
        {
            case "int":
                return InoCode.INT_TYPE;
            case "double":
                return InoCode.DOUBLE_TYPE;
            case "boolean":
                return InoCode.BOOLEAN_TYPE;
            case "void":
                return InoCode.VOID_TYPE;
        }
    }
    visitVariableDecl(node: VVariableDecl) {
        return node.type.accept(this) + " " + node.name + InoCode.ASSIGN + node.expression.accept(this);
    }
    visitVariableCall(node: VVariableCall) {
        return node.variable.ref?.name;
    }
    visitWhile(node: VWhile) {
        return InoCode.WHILE + InoCode.COND_START + node.condition.accept(this) + InoCode.COND_END + node.block.accept(this);
    }
    
}