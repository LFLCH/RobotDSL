import { RunningEnvironment } from "../../interpretation/environment/runningEnvironment.js";
import { CanvasSession, changeCanvasVisibility } from "./canvas.js";
import { changeArduinoWrapperVisibility } from "./compilation.js";

const defaultWrapper = document.getElementById('default-output-wrapper') as HTMLElement;

const terminal = document.getElementById('simulation-console')! as HTMLDivElement;

document.addEventListener('run-content', async (event) => {
    defaultWrapper.hidden = true;
    clearTerminal();
    changeCanvasVisibility(true);
    changeArduinoWrapperVisibility(false);
    const environment = (event as CustomEvent<RunningEnvironment>).detail;
    for(const instruction of environment.instructions){
        addTerminalLine(instruction.name + ' ' + JSON.stringify(instruction.value) );
    }
    let cs : CanvasSession = new CanvasSession(environment);
    cs.start();

    for(const instruction of environment.instructions){
        cs.runInstruction(instruction);
    }

});

document.addEventListener('run-error', (event) => {
    const errorMessage = (event as CustomEvent<string>).detail;
    addTerminalLine(errorMessage, 'error');
});


function clearTerminal() {
    terminal.innerHTML = '';
}

function addTerminalLine(line: string, level: string = 'info') {
    if(level === 'info')
        terminal.innerHTML += "<pre data-prefix='>'><code  class='text-info'>" + line + "</code></pre>";
    else if(level === 'error')
        terminal.innerHTML += "<pre  data-prefix='>'  ><code class='text-warning'>" + line + "</code></pre>";
    else if(level === 'success')
        terminal.innerHTML += "<pre  data-prefix='>'><code class='text-success'>" + line + "</code></pre>";
    else
        terminal.innerHTML += "<pre data-prefix='>' ><code>" + line + "</code></pre>";
}