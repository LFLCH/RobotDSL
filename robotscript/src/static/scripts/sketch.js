class Robot {
  constructor(id, size, startX, startY, angle = 0) {
    this.id = id;
    this.size = size;
    this.x = startX;
    this.y = startY;
    this.angle = angle;
    this.image = loadImage("assets/metro.svg");
    this.instruction_queue = [];
    this.draw_path = true;
    this.draw_name = true;
    this.path = [];
    this.time = 0;
    this.currentInstruction = undefined;
  }

  display() {
    this.time+=deltaTime;

    if(this.currentInstruction){
      const instru = this.currentInstruction;
      const ended =  this.time > (instru.timestamp + instru.duration);
      const started = this.time >= instru.timestamp;
      if(started && !ended){
        this.x = instru.robot.nextstate.x;
        this.y = instru.robot.nextstate.y;
        this.angle = instru.robot.nextstate.angle;
      }
      else if(ended)this.currentInstruction = undefined;
    }
    else if(this.instruction_queue.length > 0){
      this.currentInstruction =  this.instruction_queue.shift();
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
}

let zoomLevel;
let panX;
let panY;
let robots;
let instructions;

function resetCanvas(env) {
  zoomLevel = 1;
  panX = 0;
  panY = 0;
  robots = env.robots;
  instructions = env.instructions;
}

const simulationCanvas = document.getElementById("simulation-canvas");

function setup() {
  createCanvas(400, 400, simulationCanvas);
  const env = {
    robots: [new Robot("@NiceRobot", 50, 0, 0)],
    instructions: [],
  };
  resetCanvas(env);
}

function draw() {
  background(220);
  translate(width / 2 + panX, height / 2 + panY);
  scale(zoomLevel);

  // Display all robots
  for (let robot of robots.values()) {
    robot.display();
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


function loadInstructions(){
  for (let instruction of instructions) {
    const initstate = instruction.robot.initstate;
    const robot = robots.find((robot) => robot.id === initstate.id);
    robot.instruction_queue.push(instruction);
  }
}



document.addEventListener("run-canvas", () => {
  robots = robots.map((robot) => {
    return new Robot(robot.id, robot.size, robot.x, robot.y, robot.angle);
  });
  loadInstructions();
});


document.addEventListener("reset-canvas", () => {
  setup();
});

document.addEventListener("init-canvas", (event) => {
  const env = event.detail.env;
  env.robots = env.robots.map((robot) => {
    return new Robot(robot.id, robot.size, robot.x, robot.y, robot.angle);
  });
  resetCanvas(env);
  loadInstructions();
});

// // Optional: Double-click to reset zoom, pan, and rotation
function doubleClicked(event) {
  if (isFocused(event)) {
    setup();
  }
}
