import { EmptyFileSystem, startLanguageServer, DocumentState } from 'langium';
import { BrowserMessageReader, BrowserMessageWriter, createConnection, NotificationType, Diagnostic } from 'vscode-languageserver/browser.js';
import { createRobotScriptServices } from './robot-script-module.js';
import { Model } from './generated/ast.js';
import { Interpreter } from '../interpretation/interpreter.js';
import { RunningEnvironment } from '../interpretation/environment/runningEnvironment.js';
import { Compiler } from '../compilation/compiler.js';
import { EnvironmentParameters } from '../interpretation/environment/parameters.js';
import { RobotEnvironment } from '../interpretation/environment/environment.js';

declare const self: DedicatedWorkerGlobalScope;

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

const { shared, RobotScript } = createRobotScriptServices({ connection, ...EmptyFileSystem });

startLanguageServer(shared)

let currentModel: Model | undefined = undefined;
let currentCompilationResult: string | undefined = undefined;

function liveASTAnalysis(){
    // Send a notification with the serialized AST after every document change
    type DocumentChange = { uri: string, content: string, diagnostics: Diagnostic[] };
    const documentChangeNotification = new NotificationType<DocumentChange>('browser/livechange');
    const jsonSerializer = RobotScript.serializer.JsonSerializer;
    shared.workspace.DocumentBuilder.onBuildPhase(DocumentState.Validated, documents => {
        // for (const document of documents) {
            const document = documents[0];
            if(!document.diagnostics || document.diagnostics.length==0) currentModel = document.parseResult.value as Model;
            else currentModel = undefined;
            jsonSerializer; 
            connection.sendNotification(documentChangeNotification, {
                uri: document.uri.toString(),
                content: jsonSerializer.serialize(document.parseResult.value),
                diagnostics: document.diagnostics ?? []
            });
            // }
    });
}

function compile(){
    type CompileResult = { errorMessage?:string, inocode?:string}
    const analysisCompilationResultNotification = new NotificationType<CompileResult>('browser/compilation-result');
    connection.onNotification('browser/compile', (params: any) => {
        let errorMessage = undefined;
        let inocode = undefined;
        if(currentModel){
            const compiler = new Compiler();
            inocode = compiler.compile(currentModel);
        }
        else {
            errorMessage = "No valid model to compile";
        }
        currentCompilationResult = inocode;
        connection.sendNotification(analysisCompilationResultNotification, {errorMessage, inocode});
    });
}

function run(){
    type RunResult = { errorMessage?:string, environment?: RunningEnvironment};
    const analysisRunResultNotification = new NotificationType<RunResult>('browser/run-result');
    connection.onNotification('browser/run', (params: EnvironmentParameters) => {
        let errorMessage = undefined;
        let environment = undefined;
        if (currentModel) {
          const interpreter = new Interpreter(RobotEnvironment.getParameteredEnvironment(params));
          environment = interpreter.interpret(currentModel);
        } else {
          errorMessage = "No valid model to run";
        }
        connection.sendNotification(analysisRunResultNotification, {errorMessage, environment});
    }
    );
}

function save(){
    connection.onNotification('browser/save-compilation', async (params: {type: string}) => {
        const data = await fetch(`http://localhost:3001/save-arduino?content=${encodeURIComponent(currentCompilationResult!)}`).then(async (response) => {
            if(response.ok){
                const data = await response.json()
                return data;
            }
        }, (error) => {
            return {message: "Error while saving compilation result", level: "error", content: error};
        });
        connection.sendNotification('browser/save-compilation-result', {detail : data});
    });
}

liveASTAnalysis();
run();
compile()
save();