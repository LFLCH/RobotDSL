// Environment during the execution of the instructions, that is handled by the simulation

export interface RunningEnvironment {
    initrobots: MovingEntity[], 
    instructions : Instruction[] 
}

export interface MovingEntity{
    id : string,
    position : Vector, // current possition before the instruction
    angle : number, // in degrees
    speed : number, // in m/s
    width : number, // in meters
    height : number, // in meters
}

export interface Instruction {
    timestamp: number, // the moment the instruction must start (in milliseconds)
    duration: number, // in milliseconds. Can worth 0 if not meaningfull
    robot : {
        "initstate" : MovingEntity,
        "nextstate" : MovingEntity,
    }
    name: "move" | "rotate" | "speed" | "distance" | "speak",
    value: Move | Rotation | Speedset | DistanceCheck | Log,
}

export interface Move{
    name : "forward" | "backward" | "left" | "right",
    distance : number,
    vector : Vector   // action of the move : MovingEntity.position_t0 + Move.vector_t0 = MovingEntity.position_t1
    duration : number // time in milliseconds
}

export interface Rotation {
    name : "clockwise" | "anticlockwise"
    value : number // In degree
    duration : number 
}

export interface Speedset {
    value : number
}

export interface DistanceCheck {
    value : number  // can be infinite. 
}

export interface Log{
    value : any,
}

export interface Vector {
    x : number, 
    y : number
}

export function instructionToString(instruction : Instruction) : string{
    const id = instruction.robot.initstate.id;
    const name = instruction.name;
    const time = instruction.timestamp;
    const duration = instruction.duration;
    let value ="";
    if(name==="move"){
        const move = (instruction.value as Move);
        value = move.name+ ": " + move.distance +"m";
    }
    else if(name ==="rotate"){
        const rotation = (instruction.value as Rotation);
        value = rotation.name + ": " + rotation.value + "deg";
    }
    else if(name==="distance"){
        const distance = (instruction.value as DistanceCheck);
        value = "check distance: " +distance.value + "m";
    }
    else if(name==="speed"){
        const speed = (instruction.value as Speedset);
        value = "speed setting: "+speed.value + "s";
    }
    else if(name==="speak"){
        const speak = (instruction.value as Log);
        value = "Speak :" + speak.value;
    }
    return id + " (t=" + time +")" +"  "+ value + " for "+ duration+"s";
}