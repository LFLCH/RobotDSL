import type { ValidationAcceptor, ValidationChecks } from 'langium';
import * as InterfaceAST from '../generated/ast.js';
import * as ClassAST from './visitor.js';
import { RobotScriptVisitor } from './visitor.js';
import { RobotScriptServices } from '../robot-script-module.js';

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
 * TODO :
 * You must implement a weaving function for each concrete concept of the language.
 * you will also need to fill the check data structure to map the weaving function to the Type of node
 */
export class RoboMlAcceptWeaver {
    weaveModel(node : InterfaceAST.Model, accept : ValidationAcceptor) : void{
        (<any> node).accept = (visitor: RobotScriptVisitor) => {return visitor.visitModel(node as unknown as ClassAST.VModel);}
    }

    checks: ValidationChecks<InterfaceAST.RobotScriptAstType> = {
        Model : this.weaveModel
    };

}