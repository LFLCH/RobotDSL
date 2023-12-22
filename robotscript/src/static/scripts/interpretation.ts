import { RunningEnvironment } from "../../interpretation/environment/runningEnvironment.js";
import { moveRobot } from "./canvas.js";

const terminal = document.getElementById('simulation-console')! as HTMLDivElement;

document.addEventListener('run-execution', (event) => {
    const environment = (event as CustomEvent<RunningEnvironment>).detail;
    terminal.innerText = environment.instructions.map(instruction => instruction.name + ' ' + instruction.value).join('\n');
    // let robotsInitPositions : [number, number][] = environment.executors.map(executor => executor.initPosition);
    for(const instruction of environment.instructions){
        if(instruction.name === "move"){
            // const robotIndex = environment.executors.findIndex(executor => executor.name === instruction.executor);
            // const robotInitPosition = robotsInitPositions[robotIndex];
            // const robotTargetPosition = [robotInitPosition[0] + instruction.value[0], robotInitPosition[1] + instruction.value[1]];
            moveRobot(200, 200, instruction.value[0], instruction.value[1], 1000);
        }
    }
});