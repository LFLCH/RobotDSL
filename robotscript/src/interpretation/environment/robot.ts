import { Instruction } from "./runningEnvironment.js";

/**
 * Capture of a robot object at a specific state
 */
export class Robot{
    constructor(
        public x: number,
        public y: number,
        public angle: number = 0,
        public speed: number = 0.1,
        public moveInstruction : "Forward" | "Backward" | "Left" | "Right"  = "Forward",
        // public remainingTime :number = 0,
        public remainingDistance : number = 0,
        private instructionHistory : Instruction[] = []
    ){}

    public recordInstruction(instruction : Instruction){
        this.instructionHistory.push(instruction);
    }

    public getInstructionHistory() : Instruction[]{
        return this.instructionHistory;
    }

}