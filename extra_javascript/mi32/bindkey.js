//BLE values
var bluetoothDevice, gattServer, Theservice, writeCharacteristic;
var ServiceMain, writeCharacteristicSpeed, notifiyCharTemp, time_char, enc_main, enc_10, enc_19;

//Connection values
var state = 0,
    connectTrys = 0;
//Custom firmware
var customEnabled;
var settingsCharacteristics;
//Mi values
var miEnabled = false,
    miConnected = false,
    mode_activation;
//Current device
var current_device;
//Login values
var mi_random_key, mi_random_key_recv, mi_device_info_recv, mi_device_info_send, device_known_id, expected_device_infos, is_logged_in = false;
//Activation values
var keypair, is_activated, own_public_key, device_public_key, shared_key, derived_key, mi_write_did;
var device_new_id = "00626c742e332e31323976" + makeRandomID(6) + "415443";


var importedJSON, finalJSON;
let supported_mi_devices = {"055b":{"NAME":"LYWSD03","AdName":"LYWSD03MMC","sensor":["s"],"data":['t','h','b'],"encrypt":1,"img":"../_media/bluetooth/LYWSD03MMC.png"},
                                "0387":{"NAME":"MHOC401","AdName":"MHO-C401","sensor":["s"],"data":['t','h','b'],"encrypt":1,"img":"../_media/bluetooth/MHO-C401.png"},
                                "01aa":{"NAME":"LYWSDCGQ","AdName":"","sensor":["s"],"data":['t','h','b'],"encrypt":1,"img":"../_media/bluetooth/MHO-C303.png"},
                                "0b48":{"NAME":"CGG1","AdName":"","sensor":["s"],"data":['t','h','b'],"encrypt":1,"img":"../_media/bluetooth/CGG1.png"},
                                "066f":{"NAME":"CGDK2","AdName":"","sensor":["s"],"data":['t','h','b'],"encrypt":1,"img":"../_media/bluetooth/MHO-C303.png"},
                                "045b":{"NAME":"LYWSD02","AdName":"LYWSD02MMC","sensor":["s"],"data":['t','h','b'],"encrypt":0,"img":"../_media/bluetooth/LYWDS02.png"},
                                "0a1c":{"NAME":"ATC","AdName":"","sensor":["s"],"data":['t','h','b'],"encrypt":0,"img":"../_media/bluetooth/LYWSD03MMC.png"},
                                "0576":{"NAME":"CGD1","AdName":"Qingping Alarm Cloc","sensor":["s"],"data":['t','h','b'],"encrypt":1,"img":"../_media/bluetooth/CGD1.png"},
                                "06d3":{"NAME":"MHOC303","AdName":"MHO-C303","sensor":["s"],"data":['t','h','b'],"encrypt":0,"img":"../_media/bluetooth/MHO-C303.png"},
                                "0153":{"NAME":"YEERC","AdName":"YEE-RC","sensor":["s"],"data":['bt'],"encrypt":0,"img":"../_media/bluetooth/yeerc.png"},
                                "03dd":{"NAME":"NLIGHT","AdName":"NLIGHT","sensor":["s"],"data":['m'],"encrypt":0,"img":"../_media/bluetooth/nlight.png"},
                                "098b":{"NAME":"MCCGQ02","AdName":"standard demo","sensor":["s"],"data":['t','h','b'],"encrypt":1,"img":"../_media/bluetooth/MCCGQ02HL.png"},
                                "0863":{"NAME":"SJWS01L","AdName":"Mi Flood Detector","sensor":["s"],"data":['bt','f','b'],"encrypt":1,"img":"../_media/bluetooth/SJWS01L.png"},
                                "07f6":{"NAME":"MJYD02S","AdName":"","sensor":["s","b"],"data":['it','i','b','l'],"encrypt":1,"img":"../_media/bluetooth/mjyd2s.png"}
                                };
let device_tips = {"055b":"No special workarounds needed.","07f6":"Rapidly move the hidden switch <br>for device reset before pairing.",
                  "098b":"Use Pair instantly.","7605":"Use Pair instantly.",
                  };

function resetVariables() {
    document.querySelectorAll('.connected').forEach(function(el) {
    el.style.display = 'none';});
    busy = false;
    gattServer = null;
    Theservice = null;
    writeCharacteristic = null;
    miConnected = false;
    is_logged_in = false;
    try {
      document.getElementById("known_id").value = '';
      document.getElementById("mi_token").value = '';
      document.getElementById("mi_bind_key").value = '';
      document.getElementById("connected_device").innerHTML = '';
    } catch (error) {
      addClog('nothing to be done on this page');
    }
    current_device = {"PID":"-1","MAC": "", "encrypt":0};
}

function handleError(error) {
    addLog(error);
    resetVariables();
    if (connectTrys < 5) {
        connectTrys++;
        addLog("Reconnect " + connectTrys + " from " + 5);
        doConnect();
    } else {
        setStatus("Something went wrong, to many reconnect's");
        connectTrys = 0;
    }
}

function onDisconnected() {
    addLog('Disconnected.');
    setStatus('Disconnected.');
}

function disconnect() {
    bluetoothDevice.gatt.disconnect();
}

function reload_page(){
  window.location.reload(false); 
}

function connect() {
    var deviceOptions = {
        optionalServices: ["ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6", 0xfe95, 0x1f10],
        acceptAllDevices: true,
    };
    // const hideUnknown = document.getElementById('hideUnknown').checked;
    const namePrefix = document.getElementById('namePrefix').value;
    // if (hideUnknown) {
    deviceOptions.acceptAllDevices = false;
    deviceOptions.filters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz"
        .split("")
        .map((x) => ({ namePrefix: x }));
    // } 
    if (namePrefix) {
        deviceOptions.acceptAllDevices = false;
        deviceOptions.filters = namePrefix.split(",")
            .map((x) => ({ namePrefix: x }));
    }
    
    console.log(deviceOptions)

    if (bluetoothDevice != null) bluetoothDevice.gatt.disconnect();
    resetVariables();
    addLog("Searching for devices");
    connectTrys = 0;
    navigator.bluetooth.removeEventListener('advertisementreceived',(event) =>{addClog('stop event listening'),true});
    navigator.bluetooth.requestDevice(deviceOptions).then(device => {
        bluetoothDevice = device;
        catchAdvertisement(device);
        bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
        addLog("Connecting to: " + device.name);
        doConnect();
    }).catch(handleError);
}

function fallbackWithoutFullFeatures(device){
    document.getElementById("MAC").value = "Unknown";
    for(var pid in supported_mi_devices){
      // console.log(pid);
      if(supported_mi_devices[pid].AdName == device.name){
        current_device.PID = pid;
        current_device.encrypt  = supported_mi_devices[pid].encrypt;
        current_device.name = supported_mi_devices[pid].NAME;
        current_device.MAC = 0; //unknown

        document.getElementById("device_name").innerHTML = supported_mi_devices[pid].NAME;
        document.querySelectorAll('.connected').forEach(function(el) {
        el.style.display = '';});
        if(pid in device_tips){
          document.getElementById("device_tip").innerHTML = device_tips[pid]
        }
        if(supported_mi_devices[pid].encrypt == 0) {
          document.getElementById("mi_bind_key").value = 'no encryption';
          document.getElementById("DoActivation").style.visibility = 'hidden';
        }
        else{
          document.getElementById("DoActivation").style.visibility = 'visible';
        }
        var _img = document.createElement("img");
        _img.src = supported_mi_devices[pid].img;
        _img.width = 200;
        document.getElementById("connected_device").appendChild(_img);
        return;
      }
      // else{
      //   console.log(supported_mi_devices[pid].AdName);
      //   console.log(device.name);
      // }
    }
    current_device.PID = 0; //unknown
    current_device.encrypt  = 1; //we pretend, so we can try
    document.getElementById("DoActivation").style.visibility = 'hidden';
    current_device.name = device.name; // not so important for the config file
    current_device.MAC = 0; //unknown
    document.getElementById("device_name").innerHTML = 'unknown device';
}

function catchAdvertisement(device) {
  const abortController = new AbortController();
  try{
    device.watchAdvertisements();
  }
  catch{
    addLog("Please enable experimental-web-platform-features in chrome://flags/ ...");
    addLog("... impossible to read MAC. Using simplified fallback mode");
    document.getElementById("MI32_warning").innerHTML = '<b>Fallback mode, please enable experimental-web-platform-features!!<b>';
    fallbackWithoutFullFeatures(device);
    return;
  }
  
  device.addEventListener('advertisementreceived', (event) => {
    addLog('Received advertisement from "' + device.name + '"...');
    event.serviceData.forEach((valueDataView) => {
    const buffer = new Uint8Array(valueDataView.buffer);
    var dataview = new DataView(valueDataView.buffer);
    let frame_ctrl = dataview.getUint16(0, true);
    addClog(decimalToHex(frame_ctrl));
    if(current_device.PID == "-1"){
      const pid = decimalToHex(dataview.getUint16(2,true));
      current_device.PID = pid;
      addClog(pid);
      if(pid in supported_mi_devices){
        document.getElementById("device_name").innerHTML = supported_mi_devices[pid].NAME;
        document.querySelectorAll('.connected').forEach(function(el) {
    el.style.display = '';});
        current_device.encrypt = supported_mi_devices[pid].encrypt;
      }
      else{
        document.getElementById("device_name").innerHTML = 'unknown device';
      }
      if(pid in device_tips){
        document.getElementById("device_tip").innerHTML = device_tips[pid]
      }
      if(supported_mi_devices[pid].encrypt == 0) {
        document.getElementById("mi_bind_key").value = 'no encryption';
        document.getElementById("DoActivation").style.visibility = 'hidden';
      }
      else{
        document.getElementById("DoActivation").style.visibility = 'visible';
      }
      addClog(document.getElementById("connected_device"));
      var _img = document.createElement("img");
      _img.src = supported_mi_devices[pid].img;
      _img.width = 200;
      document.getElementById("connected_device").appendChild(_img);
      addClog(document.getElementById("connected_device"));
    }
    if(frame_ctrl & (1<<3)){
      addClog('encrypted');
    }
    if(frame_ctrl & (1<<4)){
      addClog('has MAC');
      if(current_device.MAC == ''){
        parse_MAC(buffer, current_device.PID);
        addClog(current_device.PID);
        if(supported_mi_devices[current_device.PID].encrypt == 0) {
          fillConfig();
        }
      }
    }
    if(frame_ctrl & (1<<9)){
      addClog('binding confirm');
    }
    addClog(bytesToHex(buffer), device, event);
    })
    abortController.abort();
  }, { once: true });
}

function parse_MAC(buffer, pid){
  addClog(pid);
  var mac = buffer[10].toString(16).padStart(2, '0') + buffer[9].toString(16).padStart(2, '0') + buffer[8].toString(16).padStart(2, '0') + buffer[7].toString(16).padStart(2, '0') + buffer[6].toString(16).padStart(2, '0') + buffer[5].toString(16).padStart(2, '0');
  addClog(mac);
  if (pid in supported_mi_devices){
      document.getElementById("MAC").value = mac;
      addLog(document.getElementById("MAC").value);
      current_device.MAC = mac;
  }
  else {
      // document.getElementById("MAC").value = mac;
      addLog(document.getElementById("MAC").value);
      addLog(' device not supported');
  }
}



function miAction() {
    console.log('miAction');
    if(bluetoothDevice.name != 'LYWSD03MMC') {
                addClog('will not read temp/hum/bat');
                miAuthorization();
                return;
            }
    var _primSvc, _mainChr, _readChr;
    if(bluetoothDevice.name == 'CGDK2') {
        _primSvc = '0000fe95-0000-1000-8000-00805f9b34fb';
        _mainChr = '00000004-0000-1000-8000-00805f9b34fb';
        _readChr = '00000017-0000-1000-8000-00805f9b34fb';
    }
    else {
        _primSvc = 'ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6';
        _mainChr = 'ebe0ccd8-7a0a-4b0c-8a1a-6ff2997da3a6';
        _readChr = 'ebe0ccc1-7a0a-4b0c-8a1a-6ff2997da3a6';
    }

    gattServer.getPrimaryService(_primSvc)
        .then(service => {
            addClog("Found Main service");
            ServiceMain = service;
            return ServiceMain.getCharacteristic(_mainChr);
        }).then(characteristic => {
            addClog("Found Write characteristic Speed");
            writeCharacteristicSpeed = characteristic;
            return ServiceMain.getCharacteristic(_readChr);
        }).then(characteristic => {
            addClog('Found Temp characteristic');
            notifiyCharTemp = characteristic;
            return notifiyCharTemp.startNotifications().then(() => {
                notifiyCharTemp.addEventListener('characteristicvaluechanged', event => {
                    var value = event.target.value;
                    var sign = value.getUint8(1) & (1 << 7);
                    var temp = ((value.getUint8(1) & 0x7F) << 8 | value.getUint8(0));
                    var batt = (value.getUint8(3) + (value.getUint8(4) * 256 ))/1000;
                    if(sign) temp = temp-32767;
                    temp = temp/100;
                    var hum = value.getUint8(2);
                    var tempTempString = "Temp/Humi/Batt: " + temp + "°C / " + hum + "% / " + batt + "V";
                    // document.getElementById("tempHumiData").innerHTML = tempTempString;
                    addClog(tempTempString);
                },{ once: true });
                miAuthorization()
            });
        }).catch(handleError);
}

function miAuthorization() {
  addClog("miAuthorization");
  if(current_device.encrypt == 0){
      return;
  }
    gattServer.getPrimaryService(0xfe95)
        .then(service => {
            addClog("Found Main service");
            enc_main = service;
            return enc_main.getCharacteristic(0x0010);
        }).then(characteristic => {
            addClog("Found enc_10 char");
            enc_10 = characteristic;
            return enc_main.getCharacteristic(0x0019);
        }).then(characteristic => {
            addClog('Found enc_19 char');
            enc_19 = characteristic;
            miConnected = true;
            return enc_10.startNotifications().then(() => {
                enc_10.addEventListener('characteristicvaluechanged', event => {
                    var value = bytesToHex(event.target.value.buffer);
                    addClog("Enc_10: " + value);
                    if (value == "12000000") {
                        addLog("Activation Failed!");
                    } else if (value == "11000000") {
                        addLog("Activation successfull");
                        sendLogin();
                    }
                    if (value == "23000000") {
                        addLog("Login Failed!");
                    } else if (value == "21000000") {
                        is_logged_in = true;
                        addLog("Login successfull");
                    }
                });
            }).then(characteristic => {
                return enc_19.startNotifications().then(() => {
                    enc_19.addEventListener('characteristicvaluechanged', event => {
                        var value = bytesToHex(event.target.value.buffer);
                        addClog("Enc_19: " + value);

                        if (mode_activation == 1) {
                            if (value == "000000000100") {
                                is_activated = false;
                                mainCharSend("00000101", enc_19);
                            } else if (value == "000000000200") {
                                is_activated = true;
                                mainCharSend("00000101", enc_19);
                            } else if ((is_activated == true) && (state == 0) && value.substring(0, 4) == "0100") {
                                device_known_id = value.substring(4);
                            } else if ((is_activated == true) && (state == 0) && value.substring(0, 4) == "0200") {
                                device_known_id += value.substring(4);
                                device_new_id = device_known_id.substring(8);
                                document.getElementById("known_id").value = hex2ascii(device_known_id.substring(10));
                                addClog('is_activated == true');
                                mainCharSend("00000100", enc_19).then(function(character) { //00000100
                                    mainCharSend("15000000", enc_10).then(function(character) {
                                        mainCharSend("000000030400", enc_19); //000000030400
                                        state = 1;
                                    }).catch(function(err) {
                                        updateFail(err);
                                    });
                                }).catch(function(err) {
                                    updateFail(err);
                                });
                            } else if (value == "010001000000") mainCharSend("00000100", enc_19).then(function(character) {
                                addClog('010001000000');
                                mainCharSend("15000000", enc_10).then(function(character) {
                                    mainCharSend("000000030400", enc_19);
                                    state = 1;
                                }).catch(function(err) {
                                    updateFail(err);
                                });
                            }).catch(function(err) {
                                updateFail(err);
                            });

                            else if ((state == 1) && (value == "00000101")) {
                                state = 2;
                                mainCharSend("0100" + own_public_key.substring((36 * 0) + 2, (36 * 0) + 36 + 2), enc_19).then(function(character) {
                                    mainCharSend("0200" + own_public_key.substring((36 * 1) + 2, (36 * 1) + 36 + 2), enc_19).then(function(character) {
                                        mainCharSend("0300" + own_public_key.substring((36 * 2) + 2, (36 * 2) + 36 + 2), enc_19).then(function(character) {
                                            mainCharSend("0400" + own_public_key.substring((36 * 3) + 2, (36 * 3) + 36 + 2), enc_19);
                                        }).catch(function(err) {
                                            updateFail(err);
                                        });
                                    }).catch(function(err) {
                                        updateFail(err);
                                    });
                                }).catch(function(err) {
                                    updateFail(err);
                                });
                            } else if (value == "000000030400") mainCharSend("00000101", enc_19);

                            else if ((state == 2) && value.substring(0, 4) == "0100") {
                                device_public_key = "04" + value.substring(4);
                            } else if ((state == 2) && value.substring(0, 4) == "0200") {
                                device_public_key += value.substring(4);
                            } else if ((state == 2) && value.substring(0, 4) == "0300") {
                                device_public_key += value.substring(4);
                            } else if ((state == 2) && value.substring(0, 4) == "0400") {
                                device_public_key += value.substring(4);
                                mainCharSend("00000100", enc_19).then(function(character) {
                                    makeSharedKey();
                                }).catch(function(err) {
                                    updateFail(err);
                                });
                            } else if ((state == 2) && (value == "00000101")) {
                                state = 3;
                                mainCharSend("0100" + mi_write_did.substring(36 * 0, (36 * 0) + 36), enc_19).then(function(character) {
                                    mainCharSend("0200" + mi_write_did.substring(36 * 1, (36 * 1) + 36), enc_19);
                                }).catch(function(err) {
                                    updateFail(err);
                                });
                            } else if ((state == 3) && (value == "00000100")) {
                                state = 0;
                                mainCharSend("13000000", enc_10);
                            } else if (value == "000001050100") {
                                addLog("Received Timeout from device");
                            } else if (value == "12000000") {
                                addLog("Register Failed!");
                            } else if (value == "11000000") {
                                addLog("Register successfull");
                            }
                        } else { //Mode Login
                            if ((state == 0) && (value == "00000101")) {
                                state = 1;
                                mainCharSend("0100" + mi_random_key, enc_19);
                            } else if ((state == 1) && (value == "0000000d0100")) {
                                state = 2;
                                mainCharSend("00000101", enc_19);
                            } else if ((state == 2) && value.substring(0, 4) == "0100") {
                                state = 3;
                                mi_random_key_recv = value.substring(4);
                                do_login_generate();
                            } else if ((state == 3) && (value == "0000000c0200")) {
                                state = 4;
                                mainCharSend("00000101", enc_19);
                            } else if ((state == 4) && value.substring(0, 4) == "0100") {
                                state = 5;
                                mi_device_info_recv = value.substring(4);
                            } else if ((state == 5) && value.substring(0, 4) == "0200") {
                                state = 6;
                                mi_device_info_recv += value.substring(4);
                                if (expected_device_infos == mi_device_info_recv)
                                    addLog("Received device infos are correct");
                                else
                                    addLog("Received device infos are not correct");
                                mainCharSend("00000100", enc_19).then(function(character) {
                                    mainCharSend("0000000a0200", enc_19);
                                })
                            } else if ((state == 6) && (value == "00000101")) {
                                state = 7;
                                mainCharSend("0100" + mi_device_info_send.substring(36 * 0, (36 * 0) + 36), enc_19).then(function(character) {
                                    mainCharSend("0200" + mi_device_info_send.substring(36 * 1, (36 * 1) + 36), enc_19);
                                }).catch(function(err) {
                                    updateFail(err);
                                });
                            }
                        }
                    });
                    addLog("Connected");
                    setStatus("Connected, you can now Do <br> the Activation to get the Token");
                    const instantPair = document.getElementById('instantPair').checked;
                    if (instantPair){
                      sendRegister();
                    }
                });
            });
        }).catch(handleError);
}

function doConnect() {
    setStatus('Waiting for GATT server');
    bluetoothDevice.gatt.connect().then(server => {
        addClog("Found GATT server", server);
        gattServer = server;
        return gattServer.getPrimaryService(0xfe95); //anything Xiaomi
    }).then(service => {
        addClog("Found GATT service", service);
        detectMi();
    }).catch(handleError);
}

function detectMi() {
    addClog("Detect MI device");
    gattServer.getPrimaryServices().then(services => {
        miEnabled = false;
        customEnabled = false;
        for (var i = 0; i < services.length; i++) {
            console.log("Services: " + services[i].uuid);
            if (services[i].uuid == "ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6") miEnabled = true;
            if (services[i].uuid == "0000fe95-0000-1000-8000-00805f9b34fb") miEnabled = true;  /* CGDK2 ???*/
            if (services[i].uuid == "00000100-0065-6C62-2E74-6F696D2E696D") miEnabled = true;  /* MYJDS2*/
            if (services[i].uuid == "00001f10-0000-1000-8000-00805f9b34fb") customEnabled = true;
        }
        if (miEnabled) {
            addLog("Detected Mi Device");
            setStatus("Detected Mi Device");
            document.querySelectorAll('.connected').forEach(function(el) {
    el.style.display = '';});
            miAction();
        } else if (customEnabled) {
            addLog("Detected custom Firmware");
            setStatus("Detected custom Firmware");
            customAction();
        } else {
            addLog("Connected");
            setStatus("Connected")
        }
    }).catch(handleError);
}

function reConnect() {
    if (bluetoothDevice != null) bluetoothDevice.gatt.disconnect();
    resetVariables();
    addLog("Reconnect");
    connectTrys = 0;
    doConnect();
}


function sendBLEdata(data) {
    addLog(data);
}

function send10(data) {
    mainCharSend(data, enc_10);
}

function send19(data) {
    mainCharSend(data, enc_19);
}

function sendRegister() {
    if (miConnected == false) {
        addLog("Not connected");
        return;
    }
    addLog("Activating now, please wait...");
    state = 0;
    mode_activation = 1;
    doGenerate();
    mainCharSend("a2000000", enc_10);
}

function sendLogin() {
    mi_random_key = bytesToHex(window.crypto.getRandomValues(new Uint8Array(16)));
    state = 0;
    mode_activation = 0;
    mainCharSend("24000000", enc_10).then(function(character) {
        mainCharSend("0000000b0100", enc_19);
    }).catch(function(err) {
        updateFail(err);
    });
}

function addLog(logTXT) {
    var time = new Date().toLocaleTimeString("de-DE");
    var logString = time + ": " + logTXT;
    var el = document.getElementsByClassName("summary");
    for(cel of el){
        if(cel.firstElementChild.innerText == 'BLE-Log:'){
            cel.lastElementChild.innerHTML += logString + '<br>';
        }
    }
}

function addClog(logTXT) {
    console.log(logTXT);
}

function clearLog() {
    var el = document.getElementsByClassName("summary");
    for(cel of el){
        if(cel.firstElementChild.innerText == 'BLE-Log:'){
            cel.lastElementChild.innerHTML = '<br>';
        }
    }
}

function setStatus(status) {
    addClog("Status: " + status);
    document.getElementById("MI32_status").innerHTML = "Status: " + status;
}


function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    while (hex.length < 4) {
        hex = "0" + hex;
    }
    return hex;
}

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return new Uint8Array(bytes);
}

function bytesToHex(data) {
    return new Uint8Array(data).reduce(function(memo, i) {
        return memo + ("0" + i.toString(16)).slice(-2);
    }, "");
}

function makeRandomID(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return bytesToHex(new TextEncoder("utf-8").encode(result));
}


function hex2ascii(hexx) {
    var hex = hexx.toString();
    var str = '';
    for (var i = 0;
        (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

var mainCharSend = function(data, characteristic) {
    return new Promise(function(resolve, reject) {
        addClog("Send: " + data);
        characteristic.writeValue(hexToBytes(data)).then(function(character) {
            resolve("ok");
        }).catch(function(err) {
            reject("some error while sending char data");
        });
    });
}

function doGenerate() {
    addClog("... do generate");
    window.crypto.subtle.generateKey({
            name: 'ECDH',
            namedCurve: 'P-256'
        }, false, ['deriveKey', 'deriveBits'])
        .then(own_key => {
            keypair = own_key
            return window.crypto.subtle.exportKey('raw', own_key.publicKey);
        })
        .then(ownPublicKeyExported => {
            own_public_key = bytesToHex(ownPublicKeyExported);
        })
        .catch(err => {
            addLog(err);
        });
}

function makeSharedKey() {
    window.crypto.subtle.importKey('raw', hexToBytes(device_public_key), {
            name: 'ECDH',
            namedCurve: 'P-256'
        }, true, [])
        .then(device_key_imported => {
            return window.crypto.subtle.deriveBits({
                name: 'ECDH',
                namedCurve: 'P-256',
                public: device_key_imported
            }, keypair.privateKey, 256)
        })
        .then(sharedSecret => {
            shared_key = bytesToHex(sharedSecret);
            deriveTheKey();
        })
        .catch(err => {
            addLog(err)
        })
}

function deriveTheKey() {
    var derived_key = sjcl.codec.hex.fromBits(sjcl.misc.hkdf(sjcl.codec.hex.toBits(shared_key), 8 * 64, null, "mible-setup-info", sjcl.hash["sha256"]));
    document.getElementById("mi_token").value = derived_key.substring(0, 24);
    document.getElementById("mi_bind_key").value = derived_key.substring(24, 56);
    var mi_bind_A = derived_key.substring(56, 88);
    mi_write_did = sjcl.codec.hex.fromBits(sjcl.mode.ccm.encrypt(new sjcl.cipher.aes(sjcl.codec.hex.toBits(mi_bind_A)), sjcl.codec.hex.toBits(device_new_id), sjcl.codec.hex.toBits("101112131415161718191A1B"), sjcl.codec.hex.toBits("6465764944"), 32));
    mainCharSend("000000000200", enc_19);
    fillConfig();
}

function do_login_generate() {
    var salt = hexToBytes(mi_random_key + mi_random_key_recv);
    var salt1 = hexToBytes(mi_random_key_recv + mi_random_key);
    var derived_key = sjcl.codec.hex.fromBits(sjcl.misc.hkdf(sjcl.codec.hex.toBits(document.getElementById("mi_token").value), 8 * 64, sjcl.codec.hex.toBits(bytesToHex(salt)), "mible-login-info", sjcl.hash["sha256"]));
    expected_device_infos = sjcl.codec.hex.fromBits(new sjcl.misc.hmac(sjcl.codec.hex.toBits(derived_key.substring(0, 32))).mac(sjcl.codec.hex.toBits(bytesToHex(salt1))));
    mi_device_info_send = sjcl.codec.hex.fromBits(new sjcl.misc.hmac(sjcl.codec.hex.toBits(derived_key.substring(32, 64))).mac(sjcl.codec.hex.toBits(bytesToHex(salt))));
    mainCharSend("00000100", enc_19);
}

// function exportCfg(){
//   navigator.clipboard.writeText(document.getElementById("result_config").value).then(function() {
//     addClog('copied JSON string to clipboard');
//   }, function() {
//     addClog('clipboard write failed')
//   });
// }

function drawMi32cfgTable(){
  const _oldMi32Cfg = document.getElementById("mi32cfg_tab").parentElement.nextElementSibling.children[3].firstElementChild.firstElementChild;
  _oldMi32Cfg.innerHTML = '';
    var _header = document.createElement("thead");
    var _header_row = document.createElement("tr");
    var _text = document.createElement("th");
    // _text.innerHTML = 'MI32Cfg';
    _header_row.appendChild(_text);
    _header.appendChild(_header_row);
    _oldMi32Cfg.appendChild(_header);
    var i  = 0;
    var _body = document.createElement("tbody");
    for(_sensor of finalJSON){
      addClog(_sensor);
      var row = document.createElement("tr");
      var pic = document.createElement("td");
      pic.innerHTML = '<img src="'+supported_mi_devices[_sensor.PID].img +' "style="max-height: 50px;">';
      row.appendChild(pic);
      var mac = document.createElement("td");
      mac.innerHTML = supported_mi_devices[_sensor.PID].NAME+ ' at slot: ' + i + '<br>MAC: '+_sensor.MAC;
      row.appendChild(mac);
      var key = document.createElement("td");
      key.innerHTML = 'Key: '+_sensor.key;
      row.appendChild(key);
      var but = document.createElement("button");
      but.innerHTML = '-';
      but.className="md-button md-button--primary";
      but.setAttribute("padding", "0.6em");
      var targetFunc = "removeSensor(" + i + ")";
      but.setAttribute("onClick", targetFunc);
      row.appendChild(but);
      _body.appendChild(row);
      // addLog(result);
      i += 1;
  }
  _oldMi32Cfg.appendChild(_body);
}

function importCfg() {
    if(finalJSON){
      if(window.confirm("Do you want to overwrite the current Mi32cfg?\n Okay will delete your current config table") == false) return;
    }
    try {
        importedJSON = JSON.parse(document.getElementById("result_config").value) ;
    } catch (error) {
        addClog("no valid JSON");
        return;
    }
    if(Object.prototype.toString.call(importedJSON)!='[object Array]'){
        addClog(Object.prototype.toString.call(importedJSON));
        addClog("no valid Config, root must be array");
        return;
    }
    addClog(importedJSON);
    finalJSON = [];
    var i = 0;
    var skipped = 0;
    for(_sensor of importedJSON){
        var result = '';
        try {
          addClog('Sensor: ' + _sensor.PID);
        } catch (error) {
          addLog('no valid config, has no PID, skip JSON entry');
          skipped += 1;
          continue;
        }
        try {
          result += supported_mi_devices[_sensor.PID].NAME + ' at slot:' + i;
        } catch (error) {
          result += 'unknown sensor ' + 'at slot:' + i;
          skipped += 1;
          continue;
        }
        try {
          result += ' with MAC: ' + _sensor.MAC + ' and key: ' +_sensor.key ;
        } catch (error) {
          addLog('no valid config, has no MAC and/or key, skip JSON entry');
          skipped += 1;
          continue;
        }
        addToFinalJSON(_sensor);
        i += 1;
        addLog(result);
    }
    var errortext = '';
    if(skipped>0){
      errortext = '(skipped ' + skipped +' invalid item(s))'
    }
    document.getElementById("importedDev").innerHTML = " - " + (i) + " devices imported." + errortext;
    drawMi32cfgTable();
    updateExportedJSON();

}

function removeSensor(slot){
  addClog("Shall remove:" + slot);
  try {
    finalJSON.splice(slot,1);
  } catch (error) {
    addClog('could not remove sensor from Array')
  }
  drawMi32cfgTable();
  updateExportedJSON();
}

function addToFinalJSON(entry){
  if(!finalJSON){
    finalJSON = [];
  }
  finalJSON.push(entry);

}

function updateExportedJSON(){
  const exportEl = document.getElementById("mi32cfg_tab").parentElement.nextElementSibling.children[3].lastElementChild.firstElementChild.firstElementChild.lastElementChild;
  exportEl.innerHTML = "";
  var cp = document.createElement("span");
  cp.className = "cp";
  var el = document.createElement("span");
  el.innerText = "[";
  el.className = "p";
  exportEl.appendChild(el);
  exportEl.appendChild(cp);
  var i = 1;
  for (sensor of finalJSON){
    el = document.createElement("div");
    el.innerText = JSON.stringify(sensor);
    if(i!=finalJSON.length){
      el.innerText += ",";
    }
    el.className = "cpf";
    exportEl.appendChild(el);
    exportEl.appendChild(cp);
    i += 1;
  }
  var el = document.createElement("span");
  el.innerText = "]";
  el.className = "p";
  exportEl.appendChild(el);
}

function checkForDuplicate(){
  for(_sensor of finalJSON){
    if(_sensor.MAC.toUpperCase() == current_device.MAC.toUpperCase()){
      return false;
    }
  }
  return true;
}

function addNewSensor(){
  if(!checkForDuplicate()){
    setStatus('Sensor was already in mi32cfg');
    return;
  }
  if(current_device.MAC == 0){
    setStatus('Probably in fallback mode, try to enable experimental-web-platform-features');
    return;
  }
  var newSensor = new Object;
  newSensor.MAC = current_device.MAC;
  newSensor.PID = current_device.PID;
  newSensor.key = current_device.key;
  if (typeof newSensor.key == "undefined") {newSensor.key ="";}
  finalJSON.push(newSensor);
  addClog(finalJSON);
  drawMi32cfgTable();
  updateExportedJSON();
}

function fillConfig() {

    addLog("writing new Config");
    addClog(current_device);
    if(!finalJSON){
      finalJSON = [];
    }
    addNewSensor();
    return;
    var result = '[';

    for(sensor of finalJSON){
      addLog("...adding " + sensor.MAC);
      result += '{"MAC":"'+ sensor.MAC;
      result += '","PID":"'+ sensor.PID;
      var key = sensor.key;
      if (typeof key == "undefined") {key ="";}
      result += '","key":"'+ key +'"},';
    }

    if(checkForDuplicate()){
      result += '{"MAC":"'+ current_device.MAC;
      result += '","PID":"'+ current_device.PID;
      var key = current_device.key;
      if (typeof key == "undefined") {key ="";}
      result += '","key":"'+ key +'"}';
      setStatus('Sensor added to mi32cfg');
    }
    else{
      setStatus('Sensor was already in mi32cfg');
    }
    result += "]";
    document.getElementById("result_config").value = result;
    addClog(result);
}

function bindKeyPageInit(){
    if(typeof sjcl === 'undefined'){
        const scriptPromiseCrypto = new Promise((resolve, reject) => {
            console.log("Loading Crypto library ...")
            const script = document.createElement('script');
            document.body.appendChild(script);
            script.onload = resolve;
            script.onerror = reject;
            script.async = true;
            script.src = '../extra_javascript/mi32/crypto.js';
            });
            scriptPromiseCrypto.then(() => {console.log("Crypto library loaded.")});     
    }
    
    resetVariables();
    try{
        if(navigator.bluetooth.getAvailability()){
        addLog('Bluetooth support detected, make sure experimental-web-platform-features is enabled for full functionality');
        }
        else{
        addLog('Bluetooth supported by browser, but no Bluetooth device detected!!');
        document.getElementById("bind_key_section").innerHTML = '⚠️ Bluetooth supported by browser, but no Bluetooth device detected!! ⚠️';
        }
    }
    catch {
        addLog('Bluetooth not supported by browser!!');
        document.getElementById("bind_key_section").innerHTML = '⚠️ Bluetooth not supported by browser!! Try Chrome, Opera or Edge. ⚠️';
    }
    document.getElementById("Wifi-MAC").addEventListener('change', makeQRCode);
}

window.onload = function() {
    if(document.head.getElementsByTagName("title")[0].innerHTML != "MI32 - Tasmota"){
        return;
    }
    bindKeyPageInit();
}

// QRCode section
// basically a port of: https://github.com/simongolms/homekit-qrcode ... Many Thanks!!!

function makeQRCode () {
    const code = getCodeFromMAC(document.getElementById("Wifi-MAC").value);
    console.log(makeURI(code));
    var idx = 1;
    const _hk_QR_el = document.getElementById("hk_qrcode");
    for (var s of code){
        digID = "Digit" + idx;
        digRef = "#" + s;
        _hk_QR_el.contentDocument.firstChild.getElementById(digID).setAttribute("href",digRef);
        idx++;
    }
    const qrcode = new QRCode(_hk_QR_el.contentDocument.firstChild.getElementById("qrcode"), {
        width : 100,
        height : 100,
        useSVG: true
    });
    qrcode.makeCode(makeURI(code),{correctLevel:'Q',version:2,margin:0});
    _hk_QR_el.contentDocument.firstChild.style.visibility = "visible";
    _hk_QR_el.style.height = "400px";
}

function makeURI (code){
    var setupUri = {
      category: 2, //bridge acc
      password: code,
      setupId: "MI32",
      version: 0,
      reserved: 0,
      flags: 2
    }

    let payload = BigInt(0);
    payload = payload | BigInt(setupUri.version &0x7);
    payload = payload << BigInt(4);
    payload = payload | BigInt(setupUri.reserved &0xf); // reserved bits
    payload = payload << BigInt(8);
    payload = payload | BigInt(setupUri.category &0xff);
    payload = payload << BigInt(4);
    payload = payload | BigInt(setupUri.flags &0xf);
    payload = BigInt(payload) << BigInt(27);
    payload = BigInt(payload) | BigInt(Number(setupUri.password) &0x7fffffff);
    const payloadBase36 = payload.toString(36).toUpperCase().padStart(9,'0');
    return `X-HM://${payloadBase36}${setupUri.setupId}`;
}



function 
getCodeFromMAC(MACString) {
  if (!(MACString.length ==12 || MACString.length ==17)) {
      alert("No known MAC format");
      return;
  }

  var mac = MACString.replace(/\W/ig,'');
  console.log("MAC without colons:", mac);
  mac = mac.replace(/[a-f0-1]/ig,'1');
  var finalSetupCode =  mac.substr(0,3) + mac.substr(4,2) + mac.substr(7,3) ;
  console.log("Setup Code HomeKit:",finalSetupCode);
  return finalSetupCode;
}
