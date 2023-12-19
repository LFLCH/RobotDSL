const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const height = 500;
const width = 500;

canvas.height = height;

function initCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    drawGrid();
    placeRobot(100, 100, 0);
}


function drawGrid() {
    ctx.beginPath();
    ctx.strokeStyle = "lightgrey";
    ctx.lineWidth = 0.2;
    for (let i = 0; i < width; i += 10) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
    }
    for (let i = 0; i < height; i += 10) {
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
    }
    ctx.stroke();
}


function placeRobot(x, y, angle) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    // Write angle on the circle
    ctx.fillStyle = "blue";
    ctx.font = "10px Arial";
    ctx.fillText(angle, x - 2.5, y +2.5);
    ctx.fillStyle = "black";
}

async function moveRobot(xorigin, yorigin, xdestination, ydestination, duration) {
    // Linearly move the robot to the destination
    const dx = xdestination - xorigin;
    const dy = ydestination - yorigin;
    const steps = 100;
    const stepx = dx / steps;
    const stepy = dy / steps;
    let x = xorigin;
    let y = yorigin;
    
    return new Promise((resolve, reject) => {
        for (let i = 0; i < steps; i++) {
            setTimeout(() => {
                ctx.clearRect(0, 0, width, height);
                drawGrid();
                placeRobot(x, y, i+1);
                x += stepx;
                y += stepy;
            }, duration / steps * i);
        }
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

initCanvas();

const movements = [
    [500, 500, 20, 20, 2000],
    [20, 20, 100, 100, 2000],
    [300, 300, 100, 100, 2000],
    [400, 400, 100, 100, 2000],
    [689, 689, 45, 23, 3000],
];

moveRobot(...movements[0]).then(() =>{
    console.log("1st done");
    moveRobot(...movements[1]).then(() =>{
        console.log("2nd done");
    });
});