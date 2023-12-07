import type { DefaultSharedModuleContext, LangiumServices, LangiumSharedServices, Module, PartialLangiumServices } from 'langium';
import { createDefaultModule, createDefaultSharedModule, inject } from 'langium';
import { RobotScriptGeneratedModule, RobotScriptGeneratedSharedModule } from './generated/module.js';
import { RobotScriptValidator, registerValidationChecks } from './robot-script-validator.js';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type RobotScriptAddedServices = {
    validation: {
        RobotScriptValidator: RobotScriptValidator
    }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type RobotScriptServices = LangiumServices & RobotScriptAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const RobotScriptModule: Module<RobotScriptServices, PartialLangiumServices & RobotScriptAddedServices> = {
    validation: {
        RobotScriptValidator: () => new RobotScriptValidator()
    }
};

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createRobotScriptServices(context: DefaultSharedModuleContext): {
    shared: LangiumSharedServices,
    RobotScript: RobotScriptServices
} {
    const shared = inject(
        createDefaultSharedModule(context),
        RobotScriptGeneratedSharedModule
    );
    const RobotScript = inject(
        createDefaultModule({ shared }),
        RobotScriptGeneratedModule,
        RobotScriptModule
    );
    shared.ServiceRegistry.register(RobotScript);
    registerValidationChecks(RobotScript);
    return { shared, RobotScript };
}
