import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { RobotScriptAstType, Person } from './generated/ast.js';
import type { RobotScriptServices } from './robot-script-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: RobotScriptServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.RobotScriptValidator;
    const checks: ValidationChecks<RobotScriptAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class RobotScriptValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
