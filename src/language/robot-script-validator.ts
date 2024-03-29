import type { ValidationAcceptor, ValidationChecks } from 'langium';
import {   type Model, type RobotScriptAstType } from './representation/currentast.js';
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
        //TODO: check that the function calls are correct (right number of arguments, right type of arguments, etc.)
        // console.log("Typechecking the model...");
        // for(const instruction of model.statements) {
        //     console.log("Instruction :", instruction.$type);
        //     if(instruction.$type === "Assignment") {
        //         console.log("Assignment :", instruction.expression, instruction.symbol);
        //     }
        // }

        // for(const functionDef of model.functionsDef) {
        //     console.log("FunctionDef :", functionDef.name, functionDef.type.type);
        // }
    }
}
