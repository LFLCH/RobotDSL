import { DistanceCheck, Instruction, Log, Move, MovingEntity, Rotation, RunningEnvironment, Speedset, Vector } from "./runningEnvironment.js";
import { Robot } from "./entities.js";
import { EnvironmentParameters } from "./parameters.js";

/**
 * 2D environment where robots can evolve.
 */
export class RobotEnvironment {

    public static getDefaultEnvironment(): RobotEnvironment {
        return new RobotEnvironment([new Robot("@Robot1", {x: 0, y: 0})]);
    }

    public static getParameteredEnvironment(params : EnvironmentParameters) : RobotEnvironment {
        const robots : Robot[] = [];
        // Place the robots on a line. (we could be more creative)
        const space = params.spaceAtStart;
        const retrait = ((params.robotsNumber-1)*space)/2;
        for(let i = 0; i<params.robotsNumber; i++){
            const x = i*space - retrait;
            robots.push(new Robot(`@Robot${i}`, {x: x, y: 0}));
        }
    
        return new RobotEnvironment(robots);
    }

    readonly initRobots : MovingEntity[];

    public constructor(
        public robots: Robot[]
    ) {
        this.initRobots = robots.map(r => r.clone().asMovingEntity());
    }

    public getAllInstructions() : Instruction[] {
        const instructions : Instruction[] = this.robots.flatMap(r => r.getInstructions());
        instructions.sort((a, b) => a.timestamp - b.timestamp);
        return instructions;
    }

    public export() : RunningEnvironment {
        return {
            initrobots: this.initRobots,
            instructions: this.getAllInstructions()
        }
    }

    /**
     * Sets up the robot speed
     * @param robotIndex 
     * @param speed value in m/s
     */
    public setRobotSpeed(robotIndex: number, speed: number) {
        const robot = this.robots[robotIndex]; 
        const entity = robot.clone().asMovingEntity();
        robot.speed = speed;
        const speedset : Speedset = {"value" : speed}
        robot.addInstruction({
            "timestamp" : 0,
            "duration" : 0,
            "robot" : {
                "initstate" : entity,
                "nextstate" : robot.clone().asMovingEntity()
            },
            "name" : "speed",
            "value" : speedset
        })
    }

    /**
     * Sets up the robot angle
     * @param robotIndex 
     * @param angle in degrees. Can be negative (it will be processed for its positive value)
     * @param rotationname the name of the rotation : "clockwise" | "anticlockwise"
     */
    public setRobotAngle(robotIndex: number, angle: number, rotationname : "clockwise" | "anticlockwise") : void {
        const robot = this.robots[robotIndex]; 
        const entity = robot.clone().asMovingEntity();
        robot.angle = RobotEnvironment.validAngle(angle);
        const angleset : Rotation = {
            "name" : rotationname,
            "duration" : 500,
            "value" : robot.angle
        }
        robot.addInstruction({
            "timestamp" : 0,
            "duration" : 123,
            "robot" : {
                "initstate" : entity,
                "nextstate" : robot.clone().asMovingEntity()
            },
            "name" : "rotate",
            "value" : angleset
        })
    }

    /**
     * 
     * @param angle 
     * @returns the angle value between 0 and 360
     */
    private static validAngle(angle : number){
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

    private static toRadians (angle : number) : number {
        return angle * (Math.PI / 180);
    }

    /**
     * Sets up the robot movement 
     * @param robotIndex 
     * @param movement 
     * @param distance in m
     */
    public moveRobot(robotIndex : number, movement : "Forward" | "Backward" | "Left" | "Right", distance : number){
        const robot = this.robots[robotIndex];
        const entity = robot.clone().asMovingEntity();
        const duration = distance/robot.speed; // in seconds
        const action = RobotEnvironment.computeRobotAction(movement, robot.angle, distance);
        const vector : Vector = action.vector;
        robot.angle = RobotEnvironment.validAngle(action.angle) ;
        robot.position.x = vector.x +robot.position.x;
        robot.position.y = vector.y + robot.position.y;
        const name = movement==="Forward"?"forward": movement==="Backward"?"backward": movement==="Left"?"left": "right"; 
        const move : Move = {
            "duration" : duration * 1000, // in milliseconds
            "name" : name,
            "vector" : vector,
            "distance" : distance
        }
        robot.addInstruction({
            "timestamp" : 0,
            "duration" : duration * 1000,
            "robot" : {
                "initstate" : entity,
                "nextstate" : robot.clone().asMovingEntity()
            },
            "name" : "move",
            "value" : move,
        })
    }

    private static computeRobotAction(movement : "Forward" | "Backward" | "Left" | "Right", angle : number, distance = 1): {"vector" : Vector, "angle" : number} {
        if(movement === "Backward"){
            angle = RobotEnvironment.validAngle(angle - 180);
        } else if(movement === "Left"){
            angle = RobotEnvironment.validAngle(angle - 90);
        } else if(movement === "Right"){
            angle = RobotEnvironment.validAngle(angle + 90);
        }
        const vector : Vector = {"x": distance*Math.sin(RobotEnvironment.toRadians(angle)), "y" : distance*Math.cos(RobotEnvironment.toRadians(angle))};
        // Round to 4 decimals to avoid floating point errors
        vector.x = +vector.x.toFixed(4);
        vector.y = +vector.y.toFixed(4);
        return {"vector" : vector, "angle" : angle};
    }



    /**
     * @return time (in seconds)
     */
    public getTime(robotIndex : number) : number {
        return this.robots[robotIndex].getTime() / 1000;
    }

    /**
     * Get the distance captured by the sensor in front of the robot
     * @param robotIndex 
     * @returns the distance between the robot and the next obstacle he will face
     */
    public getDistance(robotIndex: number): number {
        const robot = this.robots[robotIndex];
        const entity = robot.clone().asMovingEntity();
        let distance = -1; // TODO: calculate the distance
        const distancecheck : DistanceCheck = {
            "value" : distance
        }
        robot.addInstruction({
            "timestamp" : 0,
            "duration" : 0,
            "name" : "distance",
            "robot" : {
                "initstate" : entity,
                "nextstate" : robot.clone().asMovingEntity()
            },
            "value": distancecheck
        })
        return distance;
    }

    public makeRobotSpeak(robotIndex: number, message: any) {
        const robot = this.robots[robotIndex]
        const entity = robot.clone().asMovingEntity();
        const log : Log = {
            "value" : message
        }
        robot.addInstruction({
            "timestamp" : 0,
            "duration" : 0,
            "name" : "speak",
            "value" : log,
            "robot" : {
                "initstate" : entity,
                "nextstate" : robot.clone().asMovingEntity()
            }
        })
    }

}