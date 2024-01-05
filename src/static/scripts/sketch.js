class Robot {
  constructor(id, size, startX, startY, angle = 0) {
    this.id = id;
    this.size = size;
    this.x = startX;
    this.y = startY;
    this.angle = angle;
    this.image = loadImage("assets/metro.svg");
    this.draw_path = true;
    this.draw_name = true;
    this.path = [];
    this.time = 0;
    this.currentInstruction = undefined;
    this.playing = true;
  }

  display() {

    if(this.playing && this.currentInstruction){
        const instru = this.currentInstruction;
        const ended =  this.time > (instru.timestamp + instru.duration);
        const started = this.time >= instru.timestamp;
        if(started && !ended){
          const progress = (this.time - instru.timestamp) / instru.duration;
          this.x = instru.robot.nextstate.x * progress + instru.robot.initstate.x * (1 - progress);
          this.y = instru.robot.nextstate.y * progress + instru.robot.initstate.y * (1 - progress);
          this.angle = instru.robot.nextstate.angle;
        }
        else if(ended){
          this.x = instru.robot.nextstate.x;
          this.y = instru.robot.nextstate.y;
          this.angle = instru.robot.nextstate.angle;
          this.currentInstruction = undefined;
        }
    }
    
    if (this.draw_path) {
      this.path.push(createVector(this.x, this.y));
      this.drawPath();
    }

    push();
    translate(this.x, this.y);
    rotate(radians(this.angle));
    const img = this.image;
    const ratio = this.image.width / this.image.height;
    if (ratio < 1) img.resize(this.size * ratio, this.size);
    else img.resize(this.size, this.size * ratio);
    image(img, -this.image.width / 2, -this.image.height / 2);
    pop();

    if (this.draw_name) {
      this.drawName((2 * img.height) / 3);
    }
  }

  drawPath() {
    noFill();
    stroke(255, 0, 0);
    beginShape();
    for (let point of this.path) {
      vertex(point.x, point.y);
    }
    endShape();
  }

  drawName(shift) {
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(this.id, this.x, this.y + shift);
  }


  // Methods for the robot control with the keyboard
  moveInDirection(angle, distance = 1) {
    angle -= PI / 2;
    let dx = cos(angle) * distance;
    let dy = sin(angle) * distance;
    const roundX = + (dx).toFixed(4);
    const roundY = + (dy).toFixed(4);
    this.x += roundX;
    this.y += roundY;
  }

  moveRight(distance = 1) {
    this.angle += 90;
    this.moveInDirection(radians(this.angle), distance);
  }

  moveLeft(distance = 1) {
    this.angle += 270;
    this.moveInDirection(radians(this.angle), distance);
  }

  moveForward(distance = 1) {
    this.moveInDirection(radians(this.angle), distance);
  }

  moveBackward(distance = 1) {
    this.angle += 180;
    this.moveInDirection(radians(this.angle), distance);
  }
}

let zoomLevel;
let panX;
let panY;
let robots;
let instructions;
let time;
let playing;
let slider;
let initSignal;
let previousDeltaTime;

function resetCanvas(env) {
  zoomLevel = 1;
  panX = 0;
  panY = 0;
  playing = true;
  time = 0;
  previousDeltaTime = 0;
  robots = env.robots;
  instructions = env.instructions;
  slider = select('#simulation-progress-slider');
}

const simulationCanvas = document.getElementById("simulation-canvas");

function setup() {
  createCanvas(400, 400, simulationCanvas);
  const env = {
    robots: [new Robot("@NiceRobot", 50, 0, 0)],
    instructions: [],
  };
  resetCanvas(env);


  // Maybe later, using the slider to control the time. For now there is a little problem in the drawing : when we select another time, the robot draw a line from the previous position to the new one.
  slider.elt.addEventListener('input', () => {
    console.log("Current value", slider.value());
  });
  
  slider.elt.addEventListener('change', () => {
    // This event is triggered when the user releases the slider handle
    console.log('Selected value:', slider.value());
  });
}

function draw() {
  background(220);
  translate(width / 2 + panX, height / 2 + panY);
  scale(zoomLevel);

  const trailingActivated = trailingLineActive();

  
  for (const robot of robots.values()) {
    robot.time = time;
    robot.draw_path = trailingActivated;
    robot.display();
  }

  // Update the instruction of each robot if necesssary
  const currentInstructions = instructions.filter((instru) => {
    return instru.timestamp <= time - previousDeltaTime && time <= (instru.timestamp + instru.duration);
  });
  for (const instruction of currentInstructions) {
    const robot = robots.find((robot) => robot.id === instruction. robot.initstate.id);
    if(robot.instruction !== instruction){
      robot.currentInstruction = instruction;
    }
  }
  if(playing) {
    previousDeltaTime = deltaTime;
    time+= previousDeltaTime;
    slider.value(time);
  }
  
}

function mouseWheel(event) {
  if (isFocused(event)) {
    event.preventDefault();
    // Adjust the zoom level based on the scroll direction
    zoomLevel += event.delta / 1000;
    // Constrain the zoom level to a reasonable range
    zoomLevel = constrain(zoomLevel, 0.1, 5);
  }
}

function mouseDragged(event) {
  // If the left mouse button is pressed, update panX and panY
  if (isFocused(event) && mouseButton === LEFT) {
    panX += mouseX - pmouseX;
    panY += mouseY - pmouseY;
  }
}

function isFocused(event) {
  return event.srcElement === simulationCanvas;
}

function keyPressed(event) {
  if (
    isFocused(event) &&
    [RIGHT_ARROW, LEFT_ARROW, UP_ARROW, DOWN_ARROW].includes(keyCode)
  ) {
    event.preventDefault();
    // Move all squares based on arrow key presses
    for (let square of robots) {
      if (keyCode === RIGHT_ARROW) {
        square.moveRight(20);
      } else if (keyCode === LEFT_ARROW) {
        square.moveLeft(20);
      } else if (keyCode === UP_ARROW) {
        square.moveForward(20);
      } else if (keyCode === DOWN_ARROW) {
        square.moveBackward(20);
      }
    }
  }
}

function canvasInitialisationFromSignal(event) {
  initSignal = event;
  const env = event.detail.env;
  resetCanvas({
    robots: env.robots.map((robot) => { return new Robot(robot.id, robot.size, robot.x, robot.y, robot.angle);}),
    instructions: env.instructions,
  });
}

document.addEventListener("init-canvas", (event) => {
  canvasInitialisationFromSignal(event);
});

// // Optional: Double-click to reset zoom, pan, and rotation
// function doubleClicked(event) {
//   if (isFocused(event)) {
//     setup();
//   }
// }

function updateRobotsPlayingState(){
  for (const robot of robots.values()){
    robot.playing = playing;
  }
}

document.addEventListener('play-canvas', (event)=>{
  playing = true;
  updateRobotsPlayingState();
});

document.addEventListener('pause-canvas', (event)=>{
  playing = false;
  updateRobotsPlayingState();
})


document.addEventListener('restart-canvas', ()=>{
  canvasInitialisationFromSignal(initSignal);
});

function trailingLineActive(){
  return localStorage.getItem('showTrail') === '1';
}