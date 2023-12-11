import { MonacoEditorLanguageClientWrapper } from './monaco-editor-wrapper/index.js';
import { buildWorkerDefinition } from "./monaco-editor-workers/index.js";
import monarchSyntax from "./syntaxes/rpc.monarch.js";

buildWorkerDefinition('./monaco-editor-workers/workers', new URL('', window.location.href).href, false);

MonacoEditorLanguageClientWrapper.addMonacoStyles('monaco-editor-styles');

const wrapper = new MonacoEditorLanguageClientWrapper();
const editorConfig = wrapper.getEditorConfig();
editorConfig.setMainLanguageId('rpc');

editorConfig.setMonarchTokensProvider(monarchSyntax);

editorConfig.setMainCode(`// Play your best rock paper scissors game in that editor !
player Leo
player Jeremy

Jeremy play  paper
Leo play rock
`);

editorConfig.theme = 'vs-dark';
editorConfig.useLanguageClient = true;
editorConfig.useWebSocket = false;

const workerURL = new URL('./rpc-server-worker.js', import.meta.url);
console.log(workerURL);

const lsWorker = new Worker(workerURL.href, {
    type: 'classic',
    name: 'RPC Language Server'
});
wrapper.setWorker(lsWorker);

// keep a reference to a promise for when the editor is finished starting, we'll use this to setup the canvas on load
const startingPromise = wrapper.startEditor(document.getElementById("monaco-editor-root"));

const client = wrapper.getLanguageClient();
if (!client) {
    throw new Error('Unable to obtain language client for the RPC!');
}

let running = false;
let timeout = null;
client.onNotification('browser/DocumentChange', (resp) => {

    // always store this new program in local storage
    // const value = wrapper.getModel()?.getValue();
    // if (window.localStorage && value) {
    //     window.localStorage.setItem('mainCode', value);
    // }

    // block until we're finished with a given run
    if (running) {
        return;
    }
    
    // clear previous timeouts
    if (timeout) {
        clearTimeout(timeout);
    }

    // set a timeout to run the current code
    timeout = setTimeout(async () => {
        running = true;
        // setStatus('');
        console.info('generating & running current code...');

        // decode & run commands
        let result = JSON.parse(resp.content);
        console.log(result)
        try {
            updateConsole(result);
            running = false;
        } catch (e) {
            // failed at some point, log & disable running so we can try again
            console.error(e);
            running = false;
        }

    }, 200);
});

document.getElementById("ino-button").addEventListener('click',()=>generateIno())

async function generateIno(){
    try {
        // Make a GET request to the backend endpoint when the button is clicked
        const response = await fetch('http://localhost:3000/ino');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const responseData = await response.text();
        console.log('Response from server:', responseData);
      } catch (error) {
        console.error('Error:', error);
      }
}


function updateConsole(result){
    const terminal =  document.getElementById('console');
    if(result.finished){
        const gd = result;
        let display ="<div class='players'>"+gd.players[0]+" vs "+gd.players[1]+"</div>";
        if(gd.winner){
            display+="<h1>"+gd.winner+" wins !</h1>";
            terminal.className="success";
        }
        else if(gd.draw){
            display+="<h1>It is a draw !</h1>";
            terminal.className="info";
        }
        terminal.innerHTML=display;
    //    terminal.innerHTML=JSON.stringify(result, null, 2);
    }
    else {
        terminal.innerHTML="waiting for a valid code...";
        terminal.className="primary"
    }
}