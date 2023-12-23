import { RunningEnvironment } from "../../interpretation/environment/runningEnvironment.js";
import { moveRobot } from "./canvas.js";

const terminal = document.getElementById('simulation-console')! as HTMLDivElement;

document.addEventListener('run-execution', async (event) => {
    terminal.classList.remove('error');
    const environment = (event as CustomEvent<RunningEnvironment>).detail;
    terminal.innerText = environment.instructions.map(instruction => instruction.name + ' ' + instruction.value).join('\n');
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
    terminal.className = 'error';
    terminal.innerText = errorMessage;
});