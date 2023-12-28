import { RunningEnvironment } from "../../interpretation/environment/runningEnvironment.js";
import { changeCanvasVisibility, moveRobot } from "./canvas.js";
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
        addTerminalLine(instruction.name + ' ' + instruction.value);
    }
    let robotsCurrentPositions : [number, number][] = environment.executors.map(executor => executor.initPosition);

    for(const instruction of environment.instructions){
        if(instruction.name === "move"){
            const robotIndex = environment.executors.findIndex(executor => executor.name === instruction.executor);
            const robotPosition = robotsCurrentPositions[robotIndex];
            await moveRobot(robotPosition[0] , robotPosition[1], instruction.value[0], instruction.value[1], 1000);
            robotsCurrentPositions[robotIndex] = instruction.value;
        }
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