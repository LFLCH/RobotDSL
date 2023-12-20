import { RunningEnvironment } from "../../interpretation/environment/runningEnvironment.js";

const canvas : HTMLCanvasElement  = document.getElementById('simulation-canvas')! as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

document.addEventListener('run-execution', (event) => {
    const environment = (event as CustomEvent<RunningEnvironment>).detail;
    console.log(environment);
    drawEnvironment(environment);
});


function drawEnvironment(environment: RunningEnvironment) {
    // update the canvas width and height
    let height = environment.height;
    let width = environment.width;

    // if(width<height) height = (width*environment.height)/environment.width;
    // else width = (height*environment.width) / environment.height;

    canvas.setAttribute('width', `${width}`);
    canvas.setAttribute('height', `${height}`);

    // draw a grid on the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gridSize = 50;

    ctx.strokeStyle = 'yellow';

    // Draw vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(Math.floor(x), 0);
      ctx.lineTo(Math.floor(x), canvas.height);
      ctx.stroke();
    }
  
    // Draw horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, Math.floor(y));
      ctx.lineTo(canvas.width, Math.floor(y));
      ctx.stroke();
    }
  
    // Draw the robot (red square)
    // ctx.fillStyle = 'red';
    // ctx.fillRect(robotPosition.x * gridSize, robotPosition.y * gridSize, gridSize, gridSize);
  

}

