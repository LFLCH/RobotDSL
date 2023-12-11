import { EmptyFileSystem, startLanguageServer, DocumentState } from 'langium';
import { BrowserMessageReader, BrowserMessageWriter, createConnection, NotificationType, Diagnostic } from 'vscode-languageserver/browser.js';
import { createRpcServices } from './rpc-module.js';
import { GameDescription, describeGame } from '../generator/generator.js';
import { Game } from './generated/ast.js';

declare const self: DedicatedWorkerGlobalScope;

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

const { shared, Rpc } = createRpcServices({ connection, ...EmptyFileSystem });

startLanguageServer(shared)


// Send a notification with the serialized AST after every document change
type DocumentChange = { uri: string, content: string, diagnostics: Diagnostic[] };
const documentChangeNotification = new NotificationType<DocumentChange>('browser/DocumentChange');
const jsonSerializer = Rpc.serializer.JsonSerializer;
shared.workspace.DocumentBuilder.onBuildPhase(DocumentState.Validated, documents => {
    for (const document of documents) {
        let module = document.parseResult.value as Game;

        //document.diagnostics

        if(document.diagnostics?.length == 0 &&  module.plays.length==2){
           let json : GameDescription =  describeGame(module);
           
           (module as unknown as GameDescription) = json
        }
        
        // (module as unknown as {$commands: Command[]}).$commands = json;
        connection.sendNotification(documentChangeNotification, {
            uri: document.uri.toString(),
            content: jsonSerializer.serialize(module, { sourceText: true, textRegions: true }),
            diagnostics: document.diagnostics ?? []
        });
    }
});