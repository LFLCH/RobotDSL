import { MonacoEditorLanguageClientWrapper } from "./monaco-editor-wrapper/index.js";
import { buildWorkerDefinition } from "./monaco-editor-workers/index.js";
import monarchSyntax from "./syntaxes/robot-script.monarch.js";

buildWorkerDefinition("./monaco-editor-workers/workers", new URL("", window.location.href).href, false);

MonacoEditorLanguageClientWrapper.addMonacoStyles("monaco-editor-styles");

const wrapper = new MonacoEditorLanguageClientWrapper();
const editorConfig = wrapper.getEditorConfig();
editorConfig.setMainLanguageId("robot-script");

editorConfig.setMonarchTokensProvider(monarchSyntax);

editorConfig.setMainCode(`// RobotScript is running in the web!
Forward 2 in m;
Backward 2 in m;
Left 5 in m;
Right 10 in m;
`);

editorConfig.theme = "vs-dark";
editorConfig.useLanguageClient = true;
editorConfig.useWebSocket = false;

const workerURL = new URL("./robot-script-server-worker.js", import.meta.url);
console.log(import.meta.url);

const lsWorker = new Worker(workerURL.href, {
  type: "classic",
  name: "RobotScript Language Server",
});
wrapper.setWorker(lsWorker);

// keep a reference to a promise for when the editor is finished starting, we'll use this to setup the canvas on load
const startingPromise = wrapper.startEditor( document.getElementById("monaco-editor-root"));

const client = wrapper.getLanguageClient();
if (!client) {
    throw new Error('Unable to obtain language client for the RobotScript DSL !');
}

client.onNotification('browser/livechange', (resp) => {
    console.log(JSON.parse(resp.content))
});

document.getElementById("run").addEventListener("click", () => {
    client.sendNotification("browser/run", { content: editorConfig.getMainCode() })
});

document.getElementById("compile").addEventListener("click", () => {
    client.sendNotification("browser/compile", { content: editorConfig.getMainCode() });
} );

client.onNotification("browser/run-result", (resp) => {
    console.log(resp);
} );


// Expected simulation output here.