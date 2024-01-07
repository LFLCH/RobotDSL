import { MonacoEditorLanguageClientWrapper, UserConfig } from "monaco-editor-wrapper";
import { setupMonacoRBS } from "./monaco-rbs.js";
import { EnvironmentParameters } from "../../interpretation/environment/parameters.js";
import { addTerminalLine, terminalInit } from "./terminal.js";

function getMainCode(config : UserConfig) :string{
    return config.wrapperConfig.editorAppConfig.code!;
}

async function  setup() {
    const monaco = await setupMonacoRBS();
    const wrapper = monaco.wrapper;
    const config = monaco.config;
    const client  = wrapper.getLanguageClient()!;
        
    // Add event listeners
    document.getElementById("run")!.addEventListener("click", () => {
        const robotNumber = (document.getElementById("robot-number") as HTMLInputElement).valueAsNumber;
        const spaceAtStart = (document.getElementById("robot-space") as HTMLInputElement).valueAsNumber;
        const params : EnvironmentParameters = { 
            robotsNumber : robotNumber,
            spaceAtStart : spaceAtStart
        };
        addTerminalLine("[SIMULATION] Loading the simulation...", "info");
        client.sendNotification("browser/run", params)
    });
    
    document.getElementById("compile")!.addEventListener("click", () => {
        client.sendNotification("browser/compile", { content: getMainCode(config) });
        addTerminalLine("[COMPILATION] Compiling...", "info");
    } );
    
    client.onNotification("browser/run-result", (resp) => {
        if(resp.errorMessage) {
            addTerminalLine("[SIMULATION]" + resp.errorMessage, "error");
            document.dispatchEvent(new CustomEvent('toast-notification', {detail : {"message" : resp.errorMessage, "level": "error"}}));
        } else {
            addTerminalLine("[SIMULATION] Simulation loaded with success !", "success");
            document.dispatchEvent(new CustomEvent('run-content', { detail: resp.environment }));
        }
    });
    
    client.onNotification("browser/compilation-result", (resp)=>{
        if(resp.errorMessage) {
            addTerminalLine("[COMPILATION]" + resp.errorMessage, "error");
            document.dispatchEvent(new CustomEvent('toast-notification', {detail : {"message" : resp.errorMessage, "level": "error"}}));
        }
        else {
            addTerminalLine("[COMPILATION] Compiled with success !", "success");
            document.dispatchEvent(new CustomEvent('compilation-content', {detail : resp.inocode}));
        }
    });
    
    document.addEventListener('save-code', (evt)=>{
        const data = (evt as CustomEvent<{code : string}>).detail.code;
        client.sendNotification("browser/save-compilation", { type: "compilation", content: data });
    })
    
    client.onNotification("browser/save-compilation-result", (resp)=>{
        document.dispatchEvent(new CustomEvent('toast-notification', {detail : resp.detail}));
    });
    
    document.addEventListener('load-code', (evt)=>{
        const data = (evt as CustomEvent<{code : string}>).detail.code;
        wrapper.getEditor()?.setValue(data);
    }) 
    
    document.addEventListener('capture-code', (evt)=>{
        const data = wrapper.getEditor()?.getValue();
        document.dispatchEvent(new CustomEvent('code-captured', {detail : data}));
    })

    // Initialize the terminal
    terminalInit()
}

document.addEventListener('DOMContentLoaded', setup);
