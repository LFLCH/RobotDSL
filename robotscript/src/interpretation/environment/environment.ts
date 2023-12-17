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
        return new RobotEnvironment(100, 100);
    }

    public constructor(
        public width: number,
        public height: number,
        private robots: Robot[] = [ new Robot(width / 2, height / 2)],
        private time: number = 0, // in milliseconds
        private simulationId: NodeJS.Timer | undefined = undefined
    ) {}

    /**
     * Sets up the robot speed
     * @param robotIndex 
     * @param speed value un m/s
     */
    public setRobotSpeed(robotIndex: number, speed: number) {
        this.robots[robotIndex].speed = speed;
    }

    /**
     * Sets up the robot angle
     * @param robotIndex 
     * @param angle in degrees. Can be negative (it will be processed for its positive value)
     */
    public setRobotAngle(robotIndex: number, angle: number) : void {
        if(angle<0) angle= 360 + (angle%360)
        this.robots[robotIndex].angle = angle%360;
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
    public setRobotMovement(robotIndex : number, movement : "Forward" | "Backward" | "Left" | "Right"){
        this.robots[robotIndex].moveInstruction = movement;
    }

    /**
     * 
     * @param dt delta time in ms
     */
    public update(dt: number) {
        if(this.time%100===0) console.log(`Updating simulation at ${this.time}ms`);
        this.time += dt;
        for (const robot of this.robots) {
            robot.x += robot.speed * Math.cos(robot.angle) * dt;
            robot.y += robot.speed * Math.sin(robot.angle) * dt;

            // Beware environment limits
            robot.x = Math.max(0, Math.min(this.width, robot.x));
            robot.y = Math.max(0, Math.min(this.height, robot.y));
        }
    }

    public startSimulation(){
        console.log("Simulation started")
        this.time = 0;
        // Simulate every 10ms
        this.simulationId = setInterval(() => this.update(100), 10);
    }

    public stopSimulation(){
        if(this.simulationId) {
            console.log("Simulation stopped")
            clearInterval(this.simulationId);
        }
    }

    public resetSimulation(){
        this.stopSimulation();
        this.robots = [ new Robot(this.width / 2, this.height / 2)];
        this.time = 0;
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
     */
    public getDistance(robotIndex: number): number {
        const robot = this.robots[robotIndex];
        let distance;
        if(robot.angle <90){ //  up & right border
            distance = robot.y / Math.cos(this.toRadians(robot.angle));
        }
        else if (robot.angle < 180){ // bottom & right border
            distance = (this.height - robot.y) / Math.sin(this.toRadians(robot.angle));
        }
        else if (robot.angle < 270){ // bottom & left border
            distance = robot.x / Math.cos(this.toRadians(270-robot.angle));
        }
        else { // top & left border
            distance = robot.x / Math.cos(this.toRadians(robot.angle - 270));
        }
        return distance;
    }

    private toRadians (angle : number) : number {
        return angle * (Math.PI / 180);
    }

}