import { changeCanvasVisibility } from "./canvas.js";


const defaultWrapper = document.getElementById('default-output-wrapper') as HTMLElement;

const wrapper = document.getElementById('arduino-wrapper')! as HTMLDivElement;
const codeElem = document.getElementById('arduino-code')! as HTMLDivElement;


export function changeArduinoWrapperVisibility(visible : boolean = true){
  wrapper.hidden = !visible;
}

document.addEventListener('compilation-content', async (event) => {
    defaultWrapper.hidden = true;
    changeCanvasVisibility(false);
    changeArduinoWrapperVisibility(true);
    const ino = (event as CustomEvent<string>).detail;
    codeElem.textContent = ino;
    document.dispatchEvent(new CustomEvent('prism-update'));
} );