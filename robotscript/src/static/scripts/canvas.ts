export const canvas : HTMLCanvasElement  = document.getElementById('simulation-canvas')! as HTMLCanvasElement;
const context = canvas.getContext('2d')!;


export function changeCanvasVisibility(visible : boolean = true){
  const wrapper = document.querySelector('.run-wrapper') as HTMLElement;
  wrapper.hidden = !visible;
}

export function drawEnvironment() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.strokeStyle = '#333';
  for (let x = 0; x <= canvas.width; x+=(canvas.width / 10)) {
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
  }
  for (let y = 0; y <= canvas.height; y+=(canvas.height / 10)) {
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
  }
  context.stroke();
}

export function drawRobot(x : number, y : number, angle : number) {
  // draw  a little red square on the center of the canvas rotate it by the angle
  context.fillStyle = 'red';
    context.fillRect(x - 10, y - 10, 20, 20);
}

export let animationRequestId : number = 0;
export let currentx = 0;
export let currenty = 0;


// Async function to move the robot. It returns a promise that resolves when the movement is finished
export async function moveRobot(xstart : number, ystart : number, xtarget : number, ytarget : number, duration : number){
  const startTime = performance.now();
  
  currentx = xstart;
  currenty = ystart;

  return new Promise<void>((resolve, reject) => {
    function update() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      currentx = xstart + (xtarget - xstart) * progress;
      currenty = ystart + (ytarget - ystart) * progress;

      drawEnvironment();
      drawRobot(currentx, currenty, 0);

      if (progress < 1) {
        // Continue the animation
        animationRequestId = requestAnimationFrame(update);
      } else {
        resolve();
      }
    }
    
    // Cancel any existing animation
    cancelAnimationFrame(animationRequestId);

    // Start the animation
    animationRequestId = requestAnimationFrame(update);
  });
}