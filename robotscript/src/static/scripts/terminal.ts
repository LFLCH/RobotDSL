const terminal = document.getElementById('simulation-console')! as HTMLDivElement;
const settingsLines : HTMLDivElement = terminal.querySelector('.settings-lines')! as HTMLDivElement;
const consoleLines : HTMLDivElement = terminal.querySelector('.console-lines')! as HTMLDivElement;

interface Setting {
    name: string;
    id: string;
    description: string;
    type: string;
    clss: string;
    defaultValue?: number;
    min?: number;
    max?: number;
    checkOption?: boolean;
}

const settings: Setting[] = [
    {
        "name": "robotNumber",
        "id": "robot-number",
        "description": "[SIMULATION] number of robots =",
        "type": "number",
        "clss": "input input-sm",
        "defaultValue": 1,
        "min": 1,
    }, 
    {
        "name": "robotSpace",
        "id": "robot-space",
        "description": "[SIMULATION] space between the robots (meters) =",
        "type": "number",
        "clss": "input input-sm",
        "defaultValue": 1,
        "min": 1,
    },
    {
        "name": "showTrail",
        "id": "show-trail",
        "description": "[SIMULATION] show robot trail =",
        "type": "checkbox",
        "clss": "checkbox",
        "checkOption": true,
        "defaultValue": 1,
    }
];

function saveSetting(name:string, value: number){
    const setting = settings.find(s => s.name === name);
    if(setting){
        localStorage.setItem(name, value.toString());
    }
}

function loadSettings(){
    settings.forEach(s => {
        const value = localStorage.getItem(s.name);
        if(value){
           s.defaultValue = parseFloat(value);
        }
        else if(s.defaultValue){
            localStorage.setItem(s.name, s.defaultValue.toString());
        }
    });
    let lines = '';
    settings.forEach(s => {
        lines += `<pre data-prefix="$"><code class="text-success">${s.description}</code><input type="${s.type}" class="${s.clss}" id="${s.id}" ${s.min ? `min="${s.min}"` : ''} ${s.max ? `max="${s.max}"` : ''} ${s.checkOption && s.defaultValue===1 ? 'checked="checked"' : s.defaultValue?"value="+s.defaultValue : ''}></pre>`;
    });
    settingsLines.innerHTML += lines;

    settings.forEach(s => {
        const input = document.getElementById(s.id) as HTMLInputElement;
        if(input){
            input.addEventListener('change', () => {
                if(s.type === 'checkbox'){
                    saveSetting(s.name, input.checked ? 1 : 0);
                }else{
                    saveSetting(s.name, parseFloat(input.value));
                }
            });
        }
    });
}

// Removes the output lines and loads the parameters ones
export function clearTerminal() {
    consoleLines.innerHTML = '';
}

export function addTerminalLine(line: string, level: string = 'info') {
    const clss = level === 'info' ? 'text-info' : level === 'error' ? 'text-warning' : level === 'success' ? 'text-success' : '';
    consoleLines.innerHTML += `<pre data-prefix='>'><code class="${clss}">${line}</code></pre>`;
}

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    clearTerminal();
});