// File in charge of setting up the Monaco editor for RobotScript
// Strongly inspired by the minilogo.ts file from the Langium examples.

import { MonacoEditorLanguageClientWrapper, UserConfig } from "monaco-editor-wrapper/bundle";
import { buildWorkerDefinition } from "monaco-editor-workers";
import { addMonacoStyles } from 'monaco-editor-wrapper/styles';

export type WorkerUrl = string;

/**
 * Generalized configuration used with 'getMonacoEditorReactConfig' to generate a working configuration for monaco-editor-react
 */
export interface ClassicConfig {
    code: string,
    htmlElement: HTMLElement,
    languageId: string,
    worker: WorkerUrl | Worker,
    monarchGrammar: any;
}

/**
 * Generates a UserConfig for a given Langium example, which is then passed to the monaco-editor-react component
 * 
 * @param config A VSCode API or classic editor config to generate a UserConfig from
 * @returns A completed UserConfig
 */
export function createUserConfig(config: ClassicConfig): UserConfig {
    // setup urls for config & grammar
    const id = config.languageId;

    // generate langium config
    return {
        htmlElement: config.htmlElement,
        wrapperConfig: {
            editorAppConfig: {
                $type: 'classic',
                languageId: id,
                useDiffEditor: false,
                automaticLayout: true,
                code: config.code,
                theme: 'vs-dark',
                languageDef: config.monarchGrammar,
                
                
                
            },
            serviceConfig: {
                enableModelService: true,
                configureConfigurationService: {
                    defaultWorkspaceUri: '/tmp/'
                },
                enableKeybindingsService: true,
                enableLanguagesService: true,
                debugLogging: false
            }
        },
        languageClientConfig: {
            options: {
                $type: 'WorkerDirect',
                worker: config.worker as Worker,
                name: `${id}-language-server-worker`
            }
        }
    };
}

function getMonarchGrammar(){
    // Grammar defined in out/syntaxes/robot-script.monarch.js
    return {
        keywords: [
            'Anticlock', 'Backward', 'Clock', 'CurrentDistance', 'CurrentTime', 'Forward', 'Left', 'ModifySpeed', 'Print', 'Right', 'boolean', 'cm', 'dm', 'double', 'else', 'elseif', 'false', 'for', 'if', 'in', 'int', 'm', 'mm', 'ms', 'return', 's', 'true', 'void', 'while'
        ],
        operators: [
            '!', '!=', '%', '&&', '*', '+', ',', '-', '/', ';', '<', '<=', '=', '==', '>', '>=', '||'
        ],
        symbols: /!|!=|%|&&|\(|\)|\*|\+|,|-|\/|;|<|<=|=|==|>|>=|\{|\|\||\}/,
        tokenizer: {
            initial: [
                { regex: /[_a-zA-Z][\w_]*/, action: { cases: { '@keywords': { "token": "keyword" }, '@default': { "token": "ID" } } } },
                { regex: /\d+\.\d+/, action: { "token": "number" } },
                { regex: /\d+/, action: { "token": "number" } },
                { include: '@whitespace' },
                { regex: /@symbols/, action: { cases: { '@operators': { "token": "operator" }, '@default': { "token": "" } } } },
            ],
            whitespace: [
                { regex: /\s+/, action: { "token": "white" } },
                { regex: /\/\*/, action: { "token": "comment", "next": "@comment" } },
                { regex: /\/\/[^\n\r]*/, action: { "token": "comment" } },
            ],
            comment: [
                { regex: /[^/\*]+/, action: { "token": "comment" } },
                { regex: /\*\//, action: { "token": "comment", "next": "@pop" } },
                { regex: /[/\*]/, action: { "token": "comment" } },
            ],
        }
    };
}

function getWorker() {
    const workerURL = new URL('robot-script-server-worker.js', window.location.href);
    return new Worker(workerURL.href, {
        type: 'module',
        name: 'RobotScriptLSW'
    });
}


/**
 * Retrieves the program code to display, either a default or from local storage
 */
function getMainCode() {
    let mainCode = `//RobotScript is running in the web !`;
    // seek to restore any previous code from our last session
    if (window.localStorage) {
        const storedCode = window.localStorage.getItem('mainCode');
        if (storedCode !== null) {
            mainCode = storedCode;
        }
    }
    return mainCode;
}

export interface MonacoRBS {
    wrapper: MonacoEditorLanguageClientWrapper,
    config: UserConfig
}

export async function setupMonacoRBS() : Promise<MonacoRBS>{
    // setup worker def & styles
    buildWorkerDefinition(
        './monaco-editor-workers/workers',
        new URL('', window.location.href).href,
        false
    );
    addMonacoStyles('monaco-editor-styles');
    
    // setup a new wrapper
    // keep a reference to a promise for when the editor is finished starting, we'll use this to setup the canvas on load
    const wrapper = new MonacoEditorLanguageClientWrapper();
    // Hide minimap La propriété 'getEditorConfig' n'existe pas sur le type 'MonacoEditorLanguageClientWrapper'
    
    const config = createUserConfig({
        htmlElement: document.getElementById("monaco-editor-root")!,
        languageId: 'minilogo',
        code: getMainCode(),
        worker: getWorker(),
        monarchGrammar: getMonarchGrammar()
    });
    await wrapper.start(config);
    return {wrapper, config};
}