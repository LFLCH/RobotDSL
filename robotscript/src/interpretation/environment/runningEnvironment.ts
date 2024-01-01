// JSON data that will be sent to be drawn. 

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