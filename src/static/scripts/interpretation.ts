import { RunningEnvironment } from "../../interpretation/environment/runningEnvironment.js";
import { CanvasSession, changeCanvasVisibility } from "./canvas.js";
import { changeArduinoWrapperVisibility } from "./compilation.js";
import { addTerminalLine } from "./terminal.js";

const defaultWrapper = document.getElementById('default-output-wrapper') as HTMLElement;

document.addEventListener('run-content', async (event) => {
    defaultWrapper.hidden = true;
    changeCanvasVisibility(true);
    changeArduinoWrapperVisibility(false);
    const environment = (event as CustomEvent<RunningEnvironment>).detail;
    for(const instruction of environment.instructions){
        addTerminalLine("[SIMULATION]"+ instruction.name + ' ' + JSON.stringify(instruction.value) );
    }
    let cs : CanvasSession = new CanvasSession(environment);
    cs.start();
});