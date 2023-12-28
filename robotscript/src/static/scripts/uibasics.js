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

saveDiskButtons.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
        const code = document.getElementById(btn.getAttribute('data-save')).innerText;
        const event = new CustomEvent('save-code', {detail: {code: code}});
        document.dispatchEvent(event);
    });
});

const saveBrowserButtons = document.querySelectorAll('.save-browser');

saveBrowserButtons.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
        document.dispatchEvent(new CustomEvent('capture-code'));
    });
});

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

document.getElementById('time-input').addEventListener('input', (e)=>{
    document.getElementById('time-progress').innerText = e.target.value;
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
Backward 2 in m;
Left 5 in m;
Right 10 in m;`,
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