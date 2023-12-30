class Square {
  constructor(startX, startY) {
    this.size = 50;
    this.x = startX;
    this.y = startY;
    this.targetX = startX;
    this.targetY = startY;
    this.angle = 45; // Default angle in radians
  }

  display() {
    this.x = lerp(this.x, this.targetX, 0.1);
    this.y = lerp(this.y, this.targetY, 0.1);

    push();
    translate(this.x, this.y);
    rotate(radians(this.angle));
    fill(237, 34, 93); 
    rectMode(CENTER);
    rect(0, 0, this.size, this.size);
    pop();
  }

  setTargetPosition(x, y) {
    this.targetX = x;
    this.targetY = y;
  }

  moveInDirection(angle) {
    let dx = cos(angle) * 10;
    let dy = sin(angle) * 10;
    this.setTargetPosition(this.targetX + dx, this.targetY + dy);
  }
}

let zoomLevel;
let panX;
let panY;
let squares;


function resetCanvas(){
    zoomLevel = 1;
    panX = 0;
    panY = 0;
    squares = [];
    squares.push(new Square(-50, 50));
    squares.push(new Square(0, -50));
    squares.push(new Square(50, 0));
}


const simulationCanvas = document.getElementById("simulation-canvas");

simulationCanvas.addEventListener("mousewheel", function (event) {
    console.log(event)
    event.preventDefault();
});

function setup() {
  createCanvas(400, 400, simulationCanvas);
  resetCanvas();
}

function draw() {
  background(220);
  translate(width / 2 + panX, height / 2 + panY);
  scale(zoomLevel);

  // Display all squares
  for (let square of squares) {
    square.display();
  }
}

function mouseWheel(event) {
    if(isFocused(event)){
        // Adjust the zoom level based on the scroll direction
        zoomLevel += event.delta / 1000;
        // Constrain the zoom level to a reasonable range
        zoomLevel = constrain(zoomLevel, 0.1, 5);
    }
}

function mouseDragged() {
  // If the left mouse button is pressed, update panX and panY
  if (mouseButton === LEFT) {
    panX += mouseX - pmouseX;
    panY += mouseY - pmouseY;
  }
}

function isFocused(event){
    return event.srcElement===simulationCanvas;
}

function keyPressed(event) {
    if(isFocused(event) && [RIGHT_ARROW, LEFT_ARROW, UP_ARROW, DOWN_ARROW].includes(keyCode)){
        event.preventDefault();
        // Move all squares based on arrow key presses
        for (let square of squares) {
          if (keyCode === RIGHT_ARROW) {
            square.moveInDirection(square.angle);
          } else if (keyCode === LEFT_ARROW) {
            square.moveInDirection(square.angle + PI); // Opposite direction
          } else if (keyCode === UP_ARROW) {
            square.moveInDirection(square.angle - HALF_PI); // 90 degrees counter-clockwise
          } else if (keyCode === DOWN_ARROW) {
            square.moveInDirection(square.angle + HALF_PI); // 90 degrees clockwise
          }
        }
      }
    }

// Optional: Double-click to reset zoom, pan, and rotation
function doubleClicked(event) {
    if(isFocused(event)){
        resetCanvas();
    }
}