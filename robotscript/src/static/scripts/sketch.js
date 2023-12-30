class Square {
  constructor(startX, startY) {
    this.size = 50;
    this.x = startX;
    this.y = startY;
    this.targetX = startX;
    this.targetY = startY;
    this.angle = 0; // Default angle in dehrees
    this.image = loadImage("assets/metro.svg")
  }

  display() {
    this.x = lerp(this.x, this.targetX, 0.1);
    this.y = lerp(this.y, this.targetY, 0.1);

    push();
    translate(this.x, this.y);
    rotate(radians(this.angle));
    const img = this.image;
    const ratio = this.image.width / this.image.height;
    if(ratio <1) img.resize(this.size * ratio, this.size)
    else img.resize(this.size, this.size * ratio);
    image(img, - this.image.width/2 , - this.image.height/2 );
    pop();
  }

  setTargetPosition(x, y) {
    this.targetX = x;
    this.targetY = y;
  }

  moveInDirection(angle) {
    angle -=PI/2;
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
    squares.push(new Square(0, 0));
}


const simulationCanvas = document.getElementById("simulation-canvas");

simulationCanvas.addEventListener("mousewheel", function (event) {
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
           square.angle += 90;
           square.moveInDirection(radians(square.angle));
          }
          else if (keyCode === LEFT_ARROW) {
            square.angle += 270;
            square.moveInDirection(radians(square.angle));
          }
          else if(keyCode === UP_ARROW){
            square.moveInDirection(radians(square.angle));
          }
          else if (keyCode === DOWN_ARROW) {
            // square.moveInDirection(PI);
            square.angle += 180;
            square.moveInDirection(radians(square.angle));
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