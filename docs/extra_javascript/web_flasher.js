ewt_s=document.createElement('script');ewt_s.type='module';
ewt_s.src="https://unpkg.com/esp-web-tools@8.0.6/dist/web/install-button.js?module";
document.body.append(ewt_s);

ewt_b=document.createElement("esp-web-install-button");ewt_b.manifest="https://tasmota.github.io/install/manifest/release.tasmota.manifest.json";
ewt_b.overrides = {
  checkSameFirmware(manifest, improvInfo) {
    const manifestFirmware = manifest.name.toLowerCase();
    const deviceFirmware = improvInfo.firmware.toLowerCase();
    return manifestFirmware.includes(deviceFirmware);
  }
};


fw_sel=document.createElement('select');
fw_sel.id ='pick-variant';

fetch('https://tasmota.github.io/install/manifests.json')
  .then(response => response.json())
  .then(data => make_select(data));


function make_select(data){
    // console.log(data);
    for (opt_group in data){
        var og=document.createElement('optgroup');
        og.label = opt_group;
        fw_sel.appendChild(og);
        console.log(opt_group,data[opt_group]);
        for (fw of data[opt_group]){
            var opt=document.createElement('option');
            opt.label = fw['name'];
            opt.value = fw['path'];
            opt.title = "Supported chip families:\n"
            for (chipFamily of fw['chipFamilies']){
                opt.title += chipFamily + "\n";
            }
            console.log( opt.value);
            og.appendChild(opt);
        }
    }
    appendButtonInTable();
}


function appendButtonInTable(){
    //Step1: add web flasher button to DOM
    const anchor_point =document.getElementById("web_installer").parentElement.nextElementSibling.nextElementSibling.children[5].firstElementChild.firstElementChild;
    anchor_point.parentNode.append(ewt_b);
    let bNode = document.getElementById("web_installer").parentElement.nextElementSibling.nextElementSibling.children[5].firstElementChild.firstElementChild.nextElementSibling
    console.log(bNode);
    let observer = new IntersectionObserver(function (entries, observer) {
        if(entries[0].target==ewt_b);
        appendSelectorInTable(1); //first try, may fail in some cases
        observer.disconnect();
      });
      observer.observe(bNode, {
        childList: true, 
        subtree: false
        // characterDataOldValue: true
      });
}

var waitForDialogTimer;
function waitForDialog(){
    //I apologize for this solution...
    var _ewt = document.querySelector("ewt-install-dialog");
    if(_ewt){
        _ewt.style.cssText = "--mdc-dialog-max-width:900px;";
        clearInterval(waitForDialogTimer);
    }
}

var secondTryTimer;
function secondTry(){
    console.log("One more time ...");
    clearInterval(secondTryTimer);
    appendSelectorInTable(2);
}

function appendSelectorInTable(attempt) {
    //step2: check result of attempt to add button to DOM
    try{
        const button = document.querySelector("esp-web-install-button");
        console.log("Button status:",button.shadowRoot.firstChild.name);
        if(button.shadowRoot.firstChild.name == 'activate'){
            //success: add the select picker and some info
            button.insertAdjacentHTML('beforebegin','<p>1. Connect the ESP device to your computer using USB or serial-to-USB adapter</p><p>2. Select the firmware variant suitable for your device</p>');
            button.insertAdjacentElement('beforebegin',fw_sel);
            button.insertAdjacentHTML('beforebegin','<p>3. Hit "CONNECT" and select the correct port or find help if no device found</p>');
            const selectEl = document.querySelector("#pick-variant");
            button.manifest = selectEl.value;
            selectEl.addEventListener("change", () => {
                button.manifest = selectEl.value;
                console.log(button.manifest);
            });
            button.addEventListener("click", () => {
                console.log("Wait for dialog to set max-width ...");
                waitForDialogTimer = setInterval(waitForDialog, 500);
            });
            // stop mkdocs keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                e.stopPropagation();
            });
        }
    }
    catch(e){
        if(attempt==1){
            secondTryTimer = setInterval(secondTry, 250);
        }
        console.log(e);
    }
}
