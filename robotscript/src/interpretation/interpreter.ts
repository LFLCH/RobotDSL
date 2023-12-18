import { Model } from "../language/generated/ast.js";
import { RobotEnvironment } from "./environment/environment.js";
import { RunningEnvironment } from "./environment/runningEnvironment.js";
import { InterpreterVisitor } from "./interpreterVisitor.js";

export class Interpreter {

    private visitor: InterpreterVisitor;
    
    constructor(
        public environment: RobotEnvironment = RobotEnvironment.getDefaultEnvironment()
        ) {
        this.visitor = new InterpreterVisitor(this.environment);
     }

    interpret(model: Model): RunningEnvironment {
        this.visitor.visitModel(model);
        return this.environment.export();
    }
}