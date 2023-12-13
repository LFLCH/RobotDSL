import type { ValidationAcceptor, ValidationChecks } from 'langium';
import {   type Model, type RobotScriptAstType } from './generated/ast.js';
import type { RobotScriptServices } from './robot-script-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: RobotScriptServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.RobotScriptValidator;
    const checks: ValidationChecks<RobotScriptAstType> = {
        Model: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class RobotScriptValidator {

    checkPersonStartsWithCapital(model : Model, accept: ValidationAcceptor): void {

        for(const instruction of model.statements) {
            console.log("Instruction :", instruction.$type);
            // switch(instruction.$type) {
            //     case "VariableDecl":
            //         console.log("VariableDecl");
            //         break;
            //     case "Assignment":
            //         console.log("Assignment");
            //         break;
            //     case "FunctionReturn":
            //         console.log("FunctionReturn");
            //         break;
            //     default:
            //         console.log(instruction.$type);
            // }
        }

        for(const functionDef of model.functionsDef) {
            console.log("FunctionDef :", functionDef.name, functionDef.type.type);
        }
    }
}
