import { Model } from "../language/generated/ast.js";
import { RobotEnvironment } from "./environment/environment.js";
import { InterpreterVisitor } from "./interpreterVisitor.js";

export class Interpreter {

    private visitor;
    
    constructor(
        public environment: RobotEnvironment | undefined
    ) {
        if(!environment) environment = RobotEnvironment.getDefaultEnvironment();
        this.visitor = new InterpreterVisitor(environment);
     }

    interpret(model: Model): void {
        this.visitor.visitModel(model);
    }
}