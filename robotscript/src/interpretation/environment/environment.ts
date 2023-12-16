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
 * 2D environment where robots can evolve
 */
export class RobotEnvironment {

    public static getDefaultEnvironment(): RobotEnvironment {
        return new RobotEnvironment(100, 100);
    }

    public constructor(
        public width: number,
        public height: number,
        public robots: Robot[] = [ { x : width / 2, y : height / 2, angle : 0, speed : 0 }],
        public time: number = 0, // in milliseconds
    ) {}

    public setRobotSpeed(robotIndex: number, speed: number) {
        this.robots[robotIndex].speed = speed;
    }

    public setRobotAngle(robotIndex: number, angle: number) {
        this.robots[robotIndex].angle = angle;
    }

    public update(dt: number) {
        this.time += dt;
        for (const robot of this.robots) {
            robot.x += robot.speed * Math.cos(robot.angle) * dt;
            robot.y += robot.speed * Math.sin(robot.angle) * dt;

            // Beware environment limits
            robot.x = Math.max(0, Math.min(this.width, robot.x));
            robot.y = Math.max(0, Math.min(this.height, robot.y));
        }
    }

    public getRobot(robotIndex: number): Robot {
        return this.robots[robotIndex];
    }

}