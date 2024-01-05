import { Instruction, MovingEntity } from "./runningEnvironment.js";

/**
 * Capture of a robot object at a specific state
 */
export class Robot{
    constructor(
        public id : string,
        public position : Position,
        public angle: number = 0,
        public speed: number = 1,
        public width: number = 1, // in meters
        public height: number = 1, // in meters
        private time : number = 0,
        private instructions : Instruction[] = []
    ){}

    /**
     * 
     * @returns a copy of the current robot. without its instruction history
     */
    public clone() : Robot {
        const position = {...this.position}; //{x: this.position.x, y: this.position.x};
        return new Robot(this.id, position, this.angle, this.speed);
    }

    public asMovingEntity() : MovingEntity {
        return {
            "id" : this.id,
            "position" : this.position,
            "angle" : this.angle,
            "speed" : this.speed,
            "width" : this.width,
            "height" : this.height,
        }
    }

    public addInstruction(instruction : Instruction){
        instruction.timestamp = this.time;
        this.instructions.push(instruction);
        this.time += instruction.duration;
    }

    public getInstructions() : Instruction[]{
        return this.instructions;
    }

    public getTime() : number{
        return this.time;
    }
}

export interface Position{
    x : number,
    y : number
} 


// Maybe in next version ?
// export interface Wall {
//     x1: number;
//     y1: number;
//     x2: number;
//     y2: number;
//     thickness: number;
// }