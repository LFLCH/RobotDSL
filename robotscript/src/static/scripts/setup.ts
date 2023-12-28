import { MonacoEditorLanguageClientWrapper, UserConfig } from "monaco-editor-wrapper";
import { setupMonacoRBS } from "./monaco-rbs.js";

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
        client.sendNotification("browser/run", { content: getMainCode(config) })
    });

    document.getElementById("compile")!.addEventListener("click", () => {
        client.sendNotification("browser/compile", { content: getMainCode(config) });
    } );

    client.onNotification("browser/run-result", (resp) => {
        if(resp.errorMessage) {
            document.dispatchEvent(new CustomEvent('run-error', { detail: resp.errorMessage }));
        } else {
            document.dispatchEvent(new CustomEvent('run-content', { detail: resp.environment }));
        }
    });

    client.onNotification("browser/compilation-result", (resp)=>{
        if(resp.errorMessage) {
            document.dispatchEvent(new CustomEvent('compilation-error', {detail : resp.errorMessage}));
        }
        else {
            document.dispatchEvent(new CustomEvent('compilation-content', {detail : resp.inocode}));
        }
    });

    document.addEventListener('save-code', (evt)=>{
        const data = (evt as CustomEvent<{code : string}>).detail.code;
        client.sendNotification("browser/save-compilation", { type: "compilation", content: data });
    })
}

document.addEventListener('DOMContentLoaded', setup);