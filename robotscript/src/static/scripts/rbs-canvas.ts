function updateRobotScriptCanvas() {
    const canvas : HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement | null;
    if (!canvas) {
        throw new Error('Unable to find canvas element!');
    }
    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('Unable to get canvas context!');
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";

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

    context.strokeStyle = 'white';
    console.log('Updating canvas');
}

updateRobotScriptCanvas()