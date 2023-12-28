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

const saveButtons = document.querySelectorAll('.save');

saveButtons.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
        const code = document.getElementById(btn.getAttribute('data-save')).innerText;
        const event = new CustomEvent('save-code', {detail: {code: code}});
        document.dispatchEvent(event);
    });
});