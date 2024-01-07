import { Instruction, Move, MovingEntity, RunningEnvironment } from "../../interpretation/environment/runningEnvironment.js";

export const canvas : HTMLCanvasElement  = document.getElementById('simulation-canvas') as HTMLCanvasElement;
const slider: HTMLInputElement = document.getElementById('simulation-progress-slider') as HTMLInputElement;

export function changeCanvasVisibility(visible : boolean = true){
  const wrapper = document.querySelector('.run-wrapper') as HTMLElement;
  wrapper.hidden = !visible;
}

export class CanvasSession{
  constructor(
    public environment : RunningEnvironment,
    public scale : number = 50 // In pixels per meter
  ){}
      
  private metersToPixels(meters : number) {
    return meters * this.scale;
  }

  private pixelsToMeters(pixels : number) {
    return pixels / this.scale;
  }

  private movingEntityToPixels(entity : MovingEntity) {
    return {
      ...entity,
      x : this.metersToPixels(entity.position.x),
      y : -this.metersToPixels(entity.position.y), // y is inverted in canvas
      size : this.metersToPixels(Math.max(entity.width, entity.height))
    }
  }

////  condense the instructions that have the same timestamp
  private translateInstructionToP5(instruction : Instruction) {
      instruction.robot.initstate = this.movingEntityToPixels(instruction.robot.initstate);
      instruction.robot.nextstate = this.movingEntityToPixels(instruction.robot.nextstate);
      if(instruction.name === "move"){
        instruction.value = (instruction.value as Move)
        instruction.value.vector = {
          x : this.metersToPixels(instruction.value.vector.x),
          y : this.metersToPixels(instruction.value.vector.y)
        }
        instruction.value.distance = this.metersToPixels(instruction.value.distance);
      }
      return instruction;
    }

  
 public start(){
  const robots = this.environment.initrobots.map(robot => {
    return this.movingEntityToPixels(robot);
  });
  const instructions = this.environment.instructions.map(instruction => this.translateInstructionToP5(instruction));
  // slider.max= (instructions.length).toString();
  if(instructions.length>0) {
    const lastinstruction = instructions[instructions.length-1];
    slider.max = (lastinstruction.timestamp + lastinstruction.duration).toString();
  }
  document.dispatchEvent(new CustomEvent('init-canvas', {detail: {"env" : {"robots" : robots, "instructions" : instructions}}}));
  console.log("Canvas session started");
}
}
