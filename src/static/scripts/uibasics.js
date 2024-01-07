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
    `void square(int size){
    Forward size in m;
    Right size*100 in cm;
    Clock 270;
    Backward size in m;
    Anticlock 180-90+90;
    Left (size*2)/2 in m;
    Clock 90;
}

// Draw five times the same square
// Each time faster

int loopings = 5;
for(int i=0;i<loopings;i=i+1){
    Print i;
    ModifySpeed (i+1)*10 in m;
    square(5);
}`,
    `int sum(int a, int b){
  int c = a + b;
  
  return c;
}

int a = sum(5, 6);

int b = a - 3 * 4 / 5;

Print b;
`,
    `void square(int nb){
for(int i = 0; i < nb; i=i+1){
    Forward 1 in m;
    Clock 90;
    Forward 1 in m;
    Clock 90;
    Forward 1 in m;
    Clock 90;
    Forward 1 in m;
    Clock 90;
}
}
square(4);
`
]

const exampleButtons = document.querySelectorAll('.example-button');

exampleButtons.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
        resetLocally();
        const id = btn.name.split('-')[1];
        const code = exampleCodes[id-1];
        document.dispatchEvent(new CustomEvent('load-code', {detail: {code: code}}));   
    });
});


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