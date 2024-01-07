document.addEventListener('prism-update', ()=>{
    Prism.highlightAll();
});

async function copyToClipboard(id){
    const text = document.getElementById(id).innerText;
    return await navigator.clipboard.writeText(text).then(()=>{
        return true;
    }).catch((err)=>{
        return false;
    });
}

const copyButtons = document.querySelectorAll('.cpy');

copyButtons.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
        copyToClipboard(btn.getAttribute('data-copy')).then((res)=>{
            if(res){
                toastPop("Copied to clipboard");
            }
            else{
                toastPop("Failed to copy to clipboard", "error");
            }
        });
    });
});

const saveDiskButtons = document.querySelectorAll('.save-disk');

// The save button tries to save the code in a file. 
//If it is on localhost, it will directly save the code on the computer. 
//Otherwise, it will create a download link.
saveDiskButtons.forEach((btn) => {
  // check if the  instance is in localhost
  if (window.location.hostname === "localhost") {
    btn.addEventListener("click", () => {
      const code = document.getElementById(
        btn.getAttribute("data-save")
      ).innerText;
      const event = new CustomEvent("save-code", { detail: { code: code } });
      document.dispatchEvent(event);
    });
  } else {
    btn.addEventListener("click", () => {
      // Content to be saved in the file
      const fileContent = document.getElementById(
        btn.getAttribute("data-save")
      ).innerText;

      // Create a Blob with the content
      const blob = new Blob([fileContent], { type: "text/plain" });

      // Create a download link
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "robotscript.ino";

      // Append the link to the body and trigger the click event
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.dispatchEvent(new CustomEvent('toast-notification', {detail : {"message" : "Saving the arduino code...", "level": "info"}}));
      document.body.removeChild(link);
    });
  }
});

const saveBrowserButtons = document.querySelectorAll('.save-browser');

saveBrowserButtons.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
        document.dispatchEvent(new CustomEvent('capture-code'));
    });
});

/**
 * 
 * @param {string} message 
 * @param {string} level between success, warning, error, info 
 */
function toastPop(message, level="success") {
    const toastContent = document.getElementById("toast-content");
    toastContent.querySelector(".toast-title").innerText = message;
    toastContent.className =  "alert alert-" + level;
    showIcon(level);
    const toastElem = document.getElementById("toast")
    toastElem.className = "show";
    toastElem.removeAttribute("hidden");
    setTimeout(function(){ toastElem.className = toastElem.className.replace("show", ""); }, 2500);
}

function showIcon(level){
    const icons = document.querySelectorAll('.alert-icon');
    icons.forEach((icon)=>{
        if(icon.classList.contains('toast-icon-'+level)){
            icon.classList.remove('hidden');
        }
        else{
            icon.classList.add('hidden');
        }
    });
}

function saveLocally(code){
    if (window.localStorage) {
        window.localStorage.setItem("mainCode", code);
        return true;
    }
    else{
        return false;
    }
}

function resetLocally(){
    if (window.localStorage) {
        window.localStorage.removeItem("mainCode");
        return true;
    }
    else{
        return false;
    }
}

document.addEventListener('toast-notification', (e)=>{
    toastPop(e.detail.message, e.detail.level);
});

document.addEventListener('code-captured', (e)=>{
    const code = e.detail;
    if(saveLocally(code)){
        toastPop("Code saved locally");
    }
    else{
        toastPop("Local storage not supported", "error");
    }
});

const exampleCodes = [
    `// RobotScript is running in the web!
Forward 2 in m;
Backward 1 in m;
Left 3 in m;
Right 3.5 in m;`,
`void square(int size){
    Forward 1 in m;
    Clock 90;
    Forward 10 in dm;
    Clock 90;
    Forward 100 in cm;
    Clock 90;
    Forward 1000 in mm;
    Clock 90;
}

// Follow a square path 3 times.

int square_number = 3;
double square_size = 2.5;

for(int i=0; i< square_number ; i = i+1){
    square(square_size);
}
`,
`// The default speed is 1 m/s. We set it to 2 m/s.
ModifySpeed 2 in m; 

// Draw a snail shell shape during 30 s.

int i=1;
while(CurrentTime in s < 30){
    Anticlock 90;
    Forward i in dm;
    i = i +1;
    Print i;
}
`
]

const exampleButtons = document.querySelectorAll('.example-button');

exampleButtons.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
        const id = btn.name.split('-')[1];
        const code = id<=exampleCodes.length ? exampleCodes[id-1] : window.localStorage.getItem("mainCode") ?? exampleCodes[0];
        document.dispatchEvent(new CustomEvent('load-code', {detail: {code: code}}));   
    });
});

if(!window.localStorage.getItem("mainCode")){
    window.localStorage.setItem("mainCode", exampleCodes[0]);
}

const playingCanvasButtons = document.querySelectorAll('.playing-canvas');
const pausedCanvasButtons = document.querySelectorAll('.paused-canvas');

function updatePlayState(play){
    pausedCanvasButtons.forEach((psd)=>{
        if(play) psd.classList.add('hidden')
        else  psd.classList.remove('hidden');
    });
    
    playingCanvasButtons.forEach((ply)=>{
        if(play) ply.classList.remove('hidden');
        else  ply.classList.add('hidden')
    });
}

playingCanvasButtons.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
        document.dispatchEvent(new CustomEvent('pause-canvas'));
        updatePlayState(false)
    });
});

pausedCanvasButtons.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
        document.dispatchEvent(new CustomEvent('play-canvas'));
        updatePlayState(true)
    });
});

document.addEventListener('init-canvas', ()=>updatePlayState(true))

const simulationProgressSlider = document.getElementById('simulation-progress-slider')

simulationProgressSlider.addEventListener('input', () => {
    document.dispatchEvent(new CustomEvent('pause-canvas'));
    updatePlayState(false)
});
  
  simulationProgressSlider.addEventListener('change', () => {
    document.dispatchEvent(new CustomEvent('play-canvas'));
    updatePlayState(true)
  });


const restartCanvasButtons = document.querySelectorAll('.restart-canvas');

restartCanvasButtons.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
        document.dispatchEvent(new CustomEvent('restart-canvas'));
        updatePlayState(true)
    });
});