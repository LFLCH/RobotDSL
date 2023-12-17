import { Model } from "../language/generated/ast.js";
import { RobotEnvironment } from "./environment/environment.js";
import { InterpreterVisitor } from "./interpreterVisitor.js";

export class Interpreter {

    private visitor: InterpreterVisitor;
    
    constructor(
        public environment: RobotEnvironment = RobotEnvironment.getDefaultEnvironment()
        ) {
        this.visitor = new InterpreterVisitor(this.environment);
     }

    interpret(model: Model): void {
        this.environment?.startSimulation();
        console.log("Interpreting the model...");
        this.visitor.visitModel(model);
        console.log("Interpretation finished.");
        this.environment?.stopSimulation();
    }
}