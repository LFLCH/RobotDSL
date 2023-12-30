import { Instruction } from "../../interpretation/environment/runningEnvironment.js";

export const canvas : HTMLCanvasElement  = document.getElementById('simulation-canvas')! as HTMLCanvasElement;
const context = canvas.getContext('2d')!;


export function changeCanvasVisibility(visible : boolean = true){
  const wrapper = document.querySelector('.run-wrapper') as HTMLElement;
  wrapper.hidden = !visible;
}

export function moveRobot(movement : Instruction){
  document.dispatchEvent(new CustomEvent('move-robot', {detail: movement}));
}