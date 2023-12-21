import { RunningEnvironment } from "../../interpretation/environment/runningEnvironment.js";
import { canvas, drawEnvironment, drawRobot, moveRobot } from "./canvas.js";

const terminal = document.getElementById('simulation-console')! as HTMLDivElement;

document.addEventListener('run-execution', (event) => {
    const environment = (event as CustomEvent<RunningEnvironment>).detail;
    terminal.innerText = environment.instructions.map(instruction => instruction.name + ' ' + instruction.value).join('\n');
    for(const instruction of environment.instructions) {
      drawEnvironment();
      drawRobot(canvas.width/2 , canvas.height/2, instruction.value);
      // if(instruction.name=='rotate'){
      // }
    }
    moveRobot(canvas.width/2 , canvas.height/2, canvas.width, canvas.height, 2000);
});