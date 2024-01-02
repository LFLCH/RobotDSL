import { Model } from "../language/generated/ast.js";
import { RobotEnvironment } from "./environment/environment.js";
import { RunningEnvironment } from "./environment/runningEnvironment.js";
import { RobotInterpreterVisitor } from "./interpreterVisitor.js";

export class Interpreter {

    private visitors: RobotInterpreterVisitor[];
    
    constructor(
        public environment: RobotEnvironment = RobotEnvironment.getDefaultEnvironment()
        ) {
            this.visitors = [];
            for(let i=0; i<environment.robots.length ; i++){
                this.visitors.push(new RobotInterpreterVisitor(environment, i));
            }
     }

    interpret(model: Model): RunningEnvironment {
        for(const visitor of this.visitors){
            visitor.visitModel(model);
        }
        return this.environment.export();
    }
}