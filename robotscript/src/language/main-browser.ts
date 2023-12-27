import { EmptyFileSystem, startLanguageServer, DocumentState } from 'langium';
import { BrowserMessageReader, BrowserMessageWriter, createConnection, NotificationType, Diagnostic } from 'vscode-languageserver/browser.js';
import { createRobotScriptServices } from './robot-script-module.js';
import { Model } from './generated/ast.js';
import { Interpreter } from '../interpretation/interpreter.js';
import { RunningEnvironment } from '../interpretation/environment/runningEnvironment.js';

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
    });
}

function compile(){
    type CompileResult = { errorMessage?:string, inocode?:string}
    const analysisCompilationResultNotification = new NotificationType<CompileResult>('browser/compilation-result');
    connection.onNotification('browser/compile', (params: any) => {
        let errorMessage = undefined;
        let inocode = `
void setup() {
    // put your setup code here, to run once:
    Serial.begin(9600);
}
  
void loop() {
  // put your main code here, to run repeatedly:
  Serial.println("Hello World!");
  delay(1000);
}          
        `;
        connection.sendNotification(analysisCompilationResultNotification, {errorMessage, inocode});
    });
}

function run(){
    type RunResult = { errorMessage?:string, environment?: RunningEnvironment};
    const analysisRunResultNotification = new NotificationType<RunResult>('browser/run-result');
    connection.onNotification('browser/run', (params: any) => {
        let errorMessage = undefined;
        let environment = undefined;
        if (currentModel) {
          const interpreter = new Interpreter();
          environment = interpreter.interpret(currentModel);
        } else {
          errorMessage = "No valid model to run";
        }
        connection.sendNotification(analysisRunResultNotification, {errorMessage, environment});
    }
    );
}

liveASTAnalysis();
run();
compile()