class Robot {
  constructor(id, size, startX, startY, angle = 0) {
    this.id = id;
    this.size = size;
    this.x = startX;
    this.y = startY;
    this.targetX = startX;
    this.targetY = startY;
    this.angle = angle;
    // this.speed = 0.1; // Default speed in pixels per frame
    this.image = loadImage("assets/metro.svg");
    this.state_queue = [];
    this.draw_path = true;
    this.draw_name = true;
    this.path = [];
  }

  display() {
    if (this.state_queue.length > 0) this.updateState();

    this.x = this.targetX;
    this.y = this.targetY;

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

  setTargetPosition(x, y) {
    this.targetX = x;
    this.targetY = y;
  }

  moveInDirection(angle, distance = 1) {
    angle -= PI / 2;
    let dx = cos(angle) * distance;
    let dy = sin(angle) * distance;
    this.setTargetPosition(this.targetX + dx, this.targetY + dy);
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

  updateState() {
    if (this.state_queue.length > 0) {
      let state = this.state_queue.shift();
      this.setTargetPosition(state.x, state.y);
      this.angle = state.angle;

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

//TODO: modify. receive only an id of instruction to run.
document.addEventListener("canvas-run-instruction", (event) => {
  // robots[0].move_queue.push(event.detail.value);
  const instruction = event.detail;
});

document.addEventListener("run-canvas", () => {
  if(instructions){
    
    for (let instruction of instructions) {
      const robot = robots.find((robot) => robot.id === instruction.robot.initstate.id);
      robot.state_queue.push(instruction.robot.nextstate);
    }
  }
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
});

// // Optional: Double-click to reset zoom, pan, and rotation
function doubleClicked(event) {
  if (isFocused(event)) {
    setup();
  }
}
