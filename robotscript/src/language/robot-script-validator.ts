import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { Model, RobotScriptAstType } from './generated/ast.js';
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
        
    }
}
