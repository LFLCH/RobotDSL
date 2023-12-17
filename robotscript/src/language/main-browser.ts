import { EmptyFileSystem, startLanguageServer, DocumentState } from 'langium';
import { BrowserMessageReader, BrowserMessageWriter, createConnection, NotificationType, Diagnostic } from 'vscode-languageserver/browser.js';
import { createRobotScriptServices } from './robot-script-module.js';
import { Model } from './generated/ast.js';
import { Interpreter } from '../interpretation/interpreter.js';

declare const self: DedicatedWorkerGlobalScope;

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

const { shared, RobotScript } = createRobotScriptServices({ connection, ...EmptyFileSystem });

startLanguageServer(shared)

let currentModel: Model | undefined = undefined;

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
            console.log(documents)
    });
}

function compile(){
    connection.onNotification('browser/compile', (params: any) => {
        console.log("Received compile request !")
        console.log(params)
    });
}

function run(){
    type RunResult = { result: string };
    const analysisRunResultNotification = new NotificationType<RunResult>('browser/run-result');
    connection.onNotification('browser/run', (params: any) => {
        console.log("Received run request !")
        if(currentModel){
            const interpreter = new Interpreter();
            interpreter.interpret(currentModel);
        }
        connection.sendNotification(analysisRunResultNotification, {result: currentModel?"ok":"unavailable"});
    }
    );
}

liveASTAnalysis();
run();
compile()