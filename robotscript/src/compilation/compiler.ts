import { VModel } from "../language/semantics/visitor.js";
import { RobotCompilerVisitor } from "./compilerVisitor.js";

export class Compiler {

    private visitor : RobotCompilerVisitor;

    constructor(
        ) {
            this.visitor = new RobotCompilerVisitor();
     }

    compile(model: VModel): string {
        return this.visitor.visitModel(model);
    }
}