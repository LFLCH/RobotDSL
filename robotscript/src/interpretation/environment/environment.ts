import { Instruction, RunningEnvironment } from "./runningEnvironment.js";
import { Robot } from "./robot.js";

// Maybe in next version ?
// export interface Wall {
//     x1: number;
//     y1: number;
//     x2: number;
//     y2: number;
//     thickness: number;
// }

/**
 * 2D environment where robots can evolve.
 * The coordinate system starts at the upper left (0,0) of the grid. 
 * Every considered value is therefore positive.
 */
export class RobotEnvironment {

    public static getDefaultEnvironment(): RobotEnvironment {
        return new RobotEnvironment(400, 400);
    }

    public constructor(
        public width: number,
        public height: number,
        private robots: Robot[] = [ new Robot(width / 2, height / 2)],
        private time: number = 0, // in milliseconds
    ) {}

    public getAllInstructions() : Instruction[] {
        let instructions : Instruction[] = [];
        // Retrieve all instructions from all robots, and sort them by timestamp
        for (const robot of this.robots) {
            for (let instruction of robot.getInstructionHistory()) {
                instruction.executor = "@Robot" + this.robots.indexOf(robot);
                instructions.push(instruction);
            }
        }
        instructions.sort((a, b) => a.timestamp - b.timestamp);
        return instructions;
    }

    public getRobotInstructions(robotIndex : number) : Instruction[] {
        return this.robots[robotIndex].getInstructionHistory();
    }

    public export() : RunningEnvironment {
        return {
            width: this.width,
            height: this.height,
            executors:  this.robots.map(robot => ({initPosition: [200, 200], name: "@Robot" + this.robots.indexOf(robot)})),
            instructions: this.getAllInstructions()
        }
    }

    /**
     * Sets up the robot speed
     * @param robotIndex 
     * @param speed value un m/s
     */
    public setRobotSpeed(robotIndex: number, speed: number) {
        this.robots[robotIndex].speed = speed;
        this.robots[robotIndex].recordInstruction({"timestamp": this.time, "name": "speed", "value":speed});
    }

    /**
     * Sets up the robot angle
     * @param robotIndex 
     * @param angle in degrees. Can be negative (it will be processed for its positive value)
     */
    public setRobotAngle(robotIndex: number, angle: number) : void {
        this.robots[robotIndex].angle = this.validAngle(angle);
        this.robots[robotIndex].recordInstruction({"timestamp": this.time, "name": "rotate", "value":this.robots[robotIndex].angle});
    }

    /**
     * 
     * @param angle 
     * @returns the angle value between 0 and 360
     */
    private  validAngle(angle : number){
        if(angle<0) angle= 360 + (angle%360)
        return angle%360;
    }

    /**
     * 
     * @param robotIndex 
     * @returns the robot angle in degrees (between 0 and 360)
     */
    public getRobotAngle(robotIndex : number) : number {
        return this.robots[robotIndex].angle;
    }

    /**
     * Sets up the robot movement 
     * @param robotIndex 
     * @param movement 
     */
    public makeRobotMove(robotIndex : number, movement : "Forward" | "Backward" | "Left" | "Right", distance : number){
        // console.log("Making the robot move ", movement, " for ", distance, " meters.");
        const robot = this.robots[robotIndex];
        robot.moveInstruction = movement;
        robot.remainingDistance =distance;
        const duration = distance / robot.speed;
        if(duration > 0){
            this.update(duration * 1000);
        }
    }

    /**
     * 
     * @param dt delta time in ms
     */
    private update(dt: number) {
        this.time += dt;
        for (const robot of this.robots) {
            if(robot.remainingDistance > 0 && robot.speed > 0){
                const distance = Math.min(robot.remainingDistance, (robot.speed * dt/1000));
                const mov = robot.moveInstruction;
                const angle = 
                    mov==="Forward" ? robot.angle : 
                    mov==="Backward" ? this.validAngle(robot.angle - 180) :
                    mov==="Left" ? this.validAngle(robot.angle -90) : 
                    this.validAngle(robot.angle + 90);    

                robot.y -= distance * Math.cos(this.toRadians(angle));
                robot.x += distance * Math.sin(this.toRadians(angle));
                // Environment limits
                robot.x = Math.max(0, Math.min(this.width, robot.x));
                robot.y = Math.max(0, Math.min(this.height, robot.y));
                
                robot.remainingDistance = Math.max(0, robot.remainingDistance - distance);

                robot.recordInstruction({"timestamp": this.time, "name": "move", "value":[robot.x, robot.y]});
            }
        }
    }

    /**
     * @return time (in seconds)
     */
    public getTime() : number {
        return this.time / 1000;
    }

    /**
     * Get the distance captured by the sensor in front of the robot
     * @param robotIndex 
     * @returns the distance between the robot and the border he is facing in his angle
     * @warning incomplete function ! TODO: currently only one border is considered at the time. 
     */
    public getDistance(robotIndex: number): number {
        const robot = this.robots[robotIndex];
        let distance;
        if(robot.angle <90){ //  up border
            distance = robot.y / Math.cos(this.toRadians(robot.angle));
        }
        else if (robot.angle < 180){ // right border
            distance = (this.height - robot.y) / Math.sin(this.toRadians(robot.angle));
        }
        else if (robot.angle < 270){ // bottom border
            distance = robot.x / Math.cos(this.toRadians(270-robot.angle));
        }
        else { // left border
            distance = robot.x / Math.cos(this.toRadians(robot.angle - 270));
        }
        return distance;
    }

    private toRadians (angle : number) : number {
        return angle * (Math.PI / 180);
    }

    public makeRobotSpeak(robotIndex: number, message: any) {
        this.robots[robotIndex].recordInstruction({"timestamp": this.time, "name": "speak", "value":message});
    }

}