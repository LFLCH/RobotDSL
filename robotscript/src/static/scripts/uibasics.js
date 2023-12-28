document.addEventListener('prism-update', ()=>{
    Prism.highlightAll();
});

function copyToClipboard(id){
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(()=>{
        console.log("Text copied to the clipboard!")
    }).catch((err)=>{
        console.log(err)
    });
}

const copyButtons = document.querySelectorAll('.cpy');

copyButtons.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
        copyToClipboard(btn.getAttribute('data-copy'));
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
        if(saveLocally(document.querySelector('.'+btn.getAttribute('data-save')).innerText)){
            toastPop("Code saved locally");
        }
        else{
            toastPop("Local storage not supported", "error");
        }
    });
});

function toastPop(message, level="success") {
    const toastContent = document.getElementById("toast-content");
    toastContent.querySelector(".toast-title").innerText = message;
    toastContent.className =  "alert alert-" + level;
    showIcon(level);
    const toastElem = document.getElementById("toast")
    toastElem.className = "show";
    setTimeout(function(){ toastElem.className = toastElem.className.replace("show", ""); }, 3000);
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