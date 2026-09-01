if (typeof supported_mi_devices === 'undefined')
{
    console.log("Loading Bindkey script ...");
    const scriptPromiseBindKey = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    document.body.appendChild(script);
    script.onload = resolve;
    script.onerror = reject;
    script.async = true;
    script.src = '../extra_javascript/mi32/bindkey.js';
    });
    scriptPromiseBindKey.then(() => {
        console.log("Bindkey script loaded.");
        bindKeyPageInit();
    });          
}
else{
    console.log("Bindkey script already loaded.");
    bindKeyPageInit();
}