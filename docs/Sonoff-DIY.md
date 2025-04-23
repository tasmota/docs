Some new Sonoff devices support the new [Itead DIY architecture](https://www.youtube.com/watch?v=fRS-ukCgD_I) which allows OTA firmware upload. With [Sonoff DIY](https://github.com/itead/Sonoff_Devices_DIY_Tools), a user has more control over the hardware features of the device and also allows for upgrading the firmware without additional hardware. The following procedure upgrades Sonoff eWelink firmware to Tasmota.

!!! warning "There are many reports this procedure has changed with newer versions of Sonoff DIY"
    Tasmota does not provide any kind of support for flashing using this method. Please contact [Sonoff Support](https://sonoff.tech/support) for help.

**IMPORTANT:** There are [some reports](https://github.com/itead/Sonoff_Devices_DIY_Tools/issues/36) suggesting that the Windows version of Sonoff DIY Tool contains a trojan. It is not clear if it actually contains the malicious code or these are just false positives due to the way Python code was converted to native executables. Nevertheless, proceed with care.

## Compatible devices
Currently the following devices officially support Sonoff DIY:
- Sonoff Basic R3
- Sonoff RF R3
- Sonoff Mini

As Sonoff DIY is enabled by connecting GPIO16 to GND it may well be possible that other Sonoff devices running eWelink will support it.

!!! note
    The OTA process Sonoff provides through the Sonoff DIY procedure **does not create a backup** of the Itead firmware on the device. If you use this OTA method to flash Tasmota on the Sonoff device, you will not be able to revert to the original factory firmware. :warning:

## Flash procedure
_Guide originally from [@Brunas](https://github.com/Brunas/HomeAutomation/blob/master/doc/Sonoff%20Mini%203.6.0%20to%20Tasmota.md)_

0. Pair the device with the eWeLink app and update firmware. [The wifi network you connect to during this step will need to be reachable in order to enter DIY mode.](https://github.com/itead/Sonoff_Devices_DIY_Tools/issues/90)
1. Follow instructions how to enter DIY mode from [Sonoff](https://github.com/itead/Sonoff_Devices_DIY_Tools/blob/master/SONOFF%20DIY%20MODE%20Protocol%20Doc%20v2.0%20Doc.pdf). This is the excerpt from it:

	1. Long press the button for 5 seconds to enter pairing mode, then press another 5 seconds to ender Compatible Pairing Mode (AP). The LED indicator should blink continuously.
	2. From mobile phone or PC WiFi setting, an Access Point of the device named **ITEAD-XXXXXXXX** will be found, connect it with default password **12345678**
	3. Open the browser and access <http://10.10.7.1/>
	4. Next, Fill in WiFi SSID and password. Once successfully connected, the device is in DIY mode.

Note: I needed to manually change IP address to 10.10.7.2, 255.0.0.0 with gateway 10.10.7.1 in adapter TCP/IPv4 settings to access that IP address.

2. Use Fing or any similar local network scanning app on your smartphone or PC to find IP address of your Sonoff Mini device. MAC Vendor most likely is **Espressif** and the device has **8081** port open.
3. Check that diy mode is working properly.

`$SONOFF_IP` must be defined with the IP or FQDN of the intended Sonoff device before running the `curl` command. With curl or with PowerShell (Windows):
```sh
# curl
SONOFF_IP="10.0.0.2"
curl -XPOST --header "Content-Type: application/json" --data-raw '{"deviceid": "", "data": {}}' http://$SONOFF_IP:8081/zeroconf/info
```

```pwsh
# powershell
$SONOFF_IP='10.0.0.2'
Invoke-RestMethod -Method POST -Body '{"deviceid": "", "data": {}}' -Uri "http://$($SONOFF_IP):8081/zeroconf/info" | ConvertTo-Json
```

<details>
<summary> Or with the Rester browser extension:</summary>  
	
Install **Rester** extension in Chrome or Firefox or any other preferred tool to perform REST API operations.

To test your device DIY mode create new request in **Rester**: 

	1. Method: **POST**
	2. URL: http://<*IP of your device*>:8081/zeroconf/info
	3. Body: `{"data": {}}`
	4. You might need to add Header **Content-Type** with value **application/json**
	5. Press **SEND**
</details>

If all is OK, status code *200* should be returned with bunch of data:
```json
{
    "seq": 1,
    "error": 0,
    "data": {
        "switch": "off",
        "startup": "off",
        "pulse": "off",
        "pulseWidth": 2000,
        "ssid": "YourWiFi",
        "otaUnlock": false,
        "fwVersion": "3.6.0",
        "deviceid": "YourDeviceId",
        "bssid": "YourBSSId",
        "signalStrength": -52
    }
}
```
If that doesn't return *200*, try going back to 5s+5s reset above.
4. If all above works, let's unlock OTA:

With curl or PowerShell (Windows):

```sh
# curl
curl -XPOST --header "Content-Type: application/json" --data-raw '{"deviceid": "", "data": {}}' http://$SONOFF_IP:8081/zeroconf/ota_unlock
```

```pwsh
# powershell
Invoke-RestMethod -Method POST -Body '{"deviceid": "", "data": {}}' -Uri "http://$($SONOFF_IP):8081/zeroconf/ota_unlock" | ConvertTo-Json
```

<details>
<summary> Or with the Rester browser extension:</summary> 
	
	1. Method: **POST**
	2. URL: http://<*IP of your device*>:8081/zeroconf/ota_unlock
	3. Body: `{"data": {}}`
	4. You might need to add Header **Content-Type** with value **application/json**
	5. Press **SEND**
	6. You should get status code *200*
</details>

Optionally for curiosity you could retry *info* query to check if *otaUnlock* value now is *true*
5. Download the appropriate binary from <http://ota.tasmota.com/tasmota/release> and flash it. *NOTE: The maximum firmware size is 508kb, which precludes the standard release binary.* Absolutely do not use tasmota-minimal at this stage, this would brick your device.

!!! There are a number of [reported](https://github.com/itead/Sonoff_Devices_DIY_Tools/issues/10) [issues](https://github.com/itead/Sonoff_Devices_DIY_Tools/issues/95) with the stock 
    firmware's OTA behavior, so it may be easier to use [an existing server](http://sonoff-ota.aelius.com/) that works around these issues.  

!!! Please note: if you have 3.5.0 or 3.6.0 firmware, maybe others (see version in `/info` response), firmware has a bug: it connects to specified server, but always sends dl.itead.cn as server name.
    That is why you have to update from server that supports serving files with server name `dl.itead.cn`
    * `ota.tasmota.com` is NOT suitable for this.
    * Use `sonoff-ota.aelius.com` or set up your local web server

`$HASH` must be defined with the `sha256sum` of the intended firmware file (the `.bin` file) before running the `curl` command. 
If using PowerShell, it is not necessary.
!!! There are a number of [reported](https://github.com/itead/Sonoff_Devices_DIY_Tools/issues/10) [issues](https://github.com/itead/Sonoff_Devices_DIY_Tools/issues/95) with the stock 
    firmware's OTA behavior, so it may be easier to use [an existing server](http://sonoff-ota.aelius.com/) that works around these issues.  

!!! Please note: if you have 3.5.0 or 3.6.0 firmware, maybe others (see version in `/info` response), firmware has a bug: it connects to specified server, but always sends dl.itead.cn as server name.
    That is why you have to update from server that supports serving files with server name `dl.itead.cn`
    * `ota.tasmota.com` is NOT suitable for this.
    * Use `sonoff-ota.aelius.com` or set up your local web server

`$HASH` must be defined with the `sha256sum` of the intended firmware file (the `.bin` file) before running the `curl` command. 
If using PowerShell, it is not necessary.
For example:
```sh
# curl
HASH="5c1aecd2a19a49ae1bec0c863f69b83ef40812145c8392eebe5fd2677a6250cc"
curl -XPOST --data "{\"deviceid\":\"\",\"data\":{\"downloadUrl\": \"http://sonoff-ota.aelius.com/tasmota-latest-lite.bin\", \"sha256sum\": \"$HASH\"} }" http://$SONOFF_IP:8081/zeroconf/ota_flash
```

```pwsh
# powershell
$FW_URL = 'http://sonoff-ota.aelius.com/tasmota-latest-lite.bin'
$HASH = [BitConverter]::ToString([System.Security.Cryptography.SHA256]::Create().ComputeHash([System.Net.WebClient]::new().DownloadData($FW_URL))).Replace('-','').ToLower()
Invoke-RestMethod -Method POST -Body ('{"deviceid":"","data":{"downloadUrl": "' + $FW_URL + '", "sha256sum": "' + $HASH +'"} }') -Uri "http://$($SONOFF_IP):8081/zeroconf/ota_flash" | ConvertTo-Json
```

<details>
<summary> Or with the Rester browser extension:</summary>  
	
	1. Method: **POST**
	2. URL: http://<*IP of your device*>:8081/zeroconf/ota_flash
	3. Body: `{"data": {"downloadUrl": "http://sonoff-ota.aelius.com/tasmota-latest-lite.bin", "sha256sum": "5c1aecd2a19a49ae1bec0c863f69b83ef40812145c8392eebe5fd2677a6250cc"}}`
	4. Header: **Content-Type** with value **application/json**
	5. Press **SEND**
	6. You should get status code *200*
</details>

!!! Flashing can take up to few minutes, as device downloads firmware part-by-part. There is high risk of bricking device if you reboot it or if internet connection fails.

**Note:** If flashing is successful, a new **tasmota-XXXXXXXX** access point will be created.  
Connect to this AP to configure Tasmota to connect to your WiFi network. 

You're now ready to [configure tasmota](https://tasmota.github.io/docs/Getting-Started/#using-web-ui).

<!--
## Using the Itead DIY tool
### Verify and/or update eWelink firmware version
<img src="https://raw.githubusercontent.com/arendst/arendst.github.io/master/media/w10mobile_hotspot.png" style="float:right"></img>
- Open the device and remove the jumper labeled OTA if present
- Power on device and connect to eWelink
- eWelink firmware updated to at least 3.1
### Flash Tasmota
- Download the [Sonoff DIY `tool_01DIY85`](https://github.com/itead/Sonoff_Devices_DIY_Tools) from Github:
  - `./tool` `.exe` (Microsoft Windows)
  - `./code` `.py` (_not yet tested_)
- Power off the Sonoff DIY device and install the DIY OTA jumper
- Modify your PC configuration to provide a Mobile hotspot:
  - SSID: `sonoffDiy` (_**case sensitive!**_)
  - Password: `20170618sn`
  - Power on the Sonoff device and verify that it shows up on the Mobile hotspot Settings page
- Start the `tool_01DIY85` utility
- The utility should discover the device
- Select the device and toggle it `ON` and `OFF` to verify you are connected to the right device
- Select `Firmware flash` (`Brush machine` on newer versions of the tool)
- Select a Tasmota binary (e.g., [`tasmota-wifiman.bin`](http://ota.tasmota.com/tasmota/tasmota-wifiman.bin)) or your own self-compiled binary. It must fit in the available free program space. _**Do NOT use tasmota-minimal.bin**_ as it does not allow you to change any settings and will make your device inaccessible and you will have to serial flash it to recover.
  
!!! note 
    You may wish to [compile your own firmware](Gitpod) with all the features you require and disabling the features you do not. This will usually result in a "full" binary that is under 500k. You can use the resulting firmware file instead of the pre-compiled binary.  

    - Select the device in the flash pop-up and then select OK
    - Tasmota will be uploaded and started

  If the firmware update gets stuck at 0%, the Sonoff device could not reach the manufacturer server because your mobile hotspot does not share the Internet connection. If this happens, use the DIY tool to set the SSID and password of your Wi-Fi network on the Sonoff device. The device will connect to your network. Disable the hotspot and use your Wi-Fi for DIY tool laptop as well. Now start `Brush machine` again, flash Tasmota. Then continue with this guide.

### Clean up

- Quit DIY mode tool
- Stop mobile hotspot
- Power off the device and remove DIY jumper as it is no longer needed and might interfere with future Tasmota features that use GPIO16

## Manual Flash
This procedure is recommended for MacOS, but also works for Linux.  
### Requirements

- eWelink firmware updated to at least 3.1
- OS with `curl` and a network services discovery tool (e.g., `mDNS` for MacOS or `avahi-browse` for Linux)
- `sonoffDiy` SSID on your local network. Use a router/access point or configure your laptop/smartphone as a hotspot with the proper SSID and password.
- A `<webServer>` available on the same local network. Very simple web servers like `SimpleHTTPServer` will not work. For Mac, the [OSX built-in web server](MacOSX-Server) is recommended.  
- A Tasmota binary (e.g., [`tasmota-wifiman.bin`](http://ota.tasmota.com/tasmota/tasmota-wifiman.bin)) or your own self-compiled binary. It must fit in the available free program space. You can use the 2.3.0 Core for this initial flash since it has the smallest program memory footprint. _**Do NOT use the tasmota-minimal pre-compiled binary**_ as it does not allow you to change any settings.
  >You may wish to [compile your own firmware](Gitpod) with all the features you require and disabling the features you do not. This will usually result in a "full" binary that is under 500k. You can use the resulting firmware file instead of the pre-compiled `tasmota-wifiman.bin`. This way you will not have to perform the secondary OTA firmware update. _**Nevertheless, it is still recommended that you perform a `Reset 5` immediately after the Sonoff DIY flash completes.**_  

  Upload the firmware file to the `<webServer>` available on the same local network.  
- SHA256 `<SHAsum>` of firmware binary file  
  ```
  $ shasum -a 256 tasmota-wifiman.bin
  ```  

  **_`1da0e89be4c01df033fa6da9d0c1db58c3deea354d7ad194f607d1f518db48f9`_**

### Verify and/or update eWelink firmware version

- Open the device and remove the jumper labeled OTA if present
- Power on device and connect to eWelink
- Update eWelink firmware to at least 3.1

### Discover the device ID

- Power off the Sonoff DIY device and install the DIY OTA jumper
- Create a new SSID on your router:
  - SSID: `sonoffDiy` (_**case sensitive!**_)
  - Password: `20170618sn`
- Wait for the Sonoff device to connect
- Obtain the `<deviceIP>` address (search on the router or perform an IP scan)
- Discover the Zeroconf details.  
  In this example, the `<deviceID>` is **_1000988699_**  

  _MacOS_  
  `$ dns-sd -B _ewelink._tcp`  
  
  ```
  Browsing for _ewelink._tcp  
  DATE: ---Mon 12 Aug 2019---  
  20:19:31.956  ...STARTING...  
  Timestamp     A/R    Flags  if Domain               Service Type         Instance Name  
  20:19:31.957  Add        2   5 local.               _ewelink._tcp.       eWeLink_1000988699  
  ```

  _Linux_  
    `$ avahi-browse -t _ewelink._tcp --resolve`  
  
```
  + wlp3s0 IPv4 eWeLink_1000988699 _ewelink._tcp local
  = wlp3s0 IPv4 eWeLink_1000988699 _ewelink._tcp local hostname = [eWeLink_1000988699.local] address = [192.168.1.109] port = [8081] txt = ["data1={"switch":"off","startup":"off","pulse":"off","pulseWidth":500,"rssi":-47}" "seq=1" "apivers=1" "type=diy_plug" "id=1000988699" "txtvers=1"]
```

### Flash the firmware and confirm
- Test with `/zeroconf/info` POST  
  > `$ curl http://<deviceIP>:8081/zeroconf/info -XPOST --data '{"deviceid":"<deviceID>","data":{} }'`  

  **_`{"seq":2,"error":0,"data":"{"switch":"off","startup":"off","pulse":"off","pulseWidth":500,"ssid":"sonoffDiy","otaUnlock":false}"}`_**  
- Unlock OTA updates at `/zeroconf/ota_unlock`  
 ```
 $ curl http://<deviceIP>:8081/zeroconf/ota_unlock -XPOST --data '{"deviceid":"<deviceID>","data":{} }'
 ```  

  **_`{"seq":2,"error":0}`_**  

  If OTA unlocking gets stuck, the Sonoff device could not reach the manufacturer server because your mobile hotspot does not share the Internet connection. If this happens, POST a request on `/zeroconf/wifi` with `'{"deviceid":"<deviceID>","data":{ "ssid": "yourssid", "password": "yourpasswd" } }'` to set the SSID and password of your Wi-Fi network on the Sonoff device. The device will connect to your network. Disable the hotspot and use your Wi-Fi as well, and restart `/zeroconf/info` and `/zeroconf/ota_unlock`.


- Flash firmware at `/zeroconf/ota_flash`  
```
$ curl http://<deviceIP>:8081/zeroconf/ota_flash -XPOST --data '{"deviceid":"<deviceID>","data":{"downloadUrl": "http://<webServer>/tasmota-wifiman.bin", "sha256sum": "<SHAsum>"} }'
```  

  **_`{"seq":3,"error":0}`_**  
- Ping the device for about 30 seconds until it has rebooted

## Post Installation
Once the firmware upload completes and the device restarts, the usual `tasmota-xxxx` SSID should now be available.

1. Set up Wi-Fi to connect your device to your network
2. **_Perform a `Reset 5` to wipe any flash remnants BEFORE attempting a Tasmota OTA flash for the first time_**
3. If you flashed `tasmota-wifiman.bin`, it is recommended that you upgrade to the firmware and Core variant that is needed for your device and use case (e.g., `tasmota.bin`). You _**must perform this update**_ using the local `File upload` OTA. **Do not use a web OTA** for this step. Download the firmware file from the [repository](http://ota.tasmota.com/tasmota) to your computer.

!!! note
    **_Some users have reported that upgrading via web OTA from `tasmota-wifiman.bin` to another binary has resulted in an unresponsive device which has required a wired flash to recover._**  
    
4. Once the desired firmware is on the device, continue the regular Tasmota setup process. Use the the appropriate Template from the [repository](https://templates.blakadder.com/) to assign the device components to the GPIO pins. For example, the  [Sonoff Mini template](https://templates.blakadder.com/sonoff_mini.html) assigns these GPIO:

   GPIO | Tasmota Component | Device Function
   --: | :--: | :--:
   0 | Button1 (17) | Button
   4 | Switch1 (9) | S1/S2
   12 | Relay1 (21) | L Out
   13 | LED1 (56) | Link/Power Indicator
-->

### Video tutorials
- [Andreas Spiess](https://youtu.be/fzEDFmB0UYU?t=239)
- [DrZzs](https://www.youtube.com/watch?v=9fkYBWvwn4A)
- [Paul Hibbert](https://www.youtube.com/watch?v=BUfWytrzrJ4&t=93s)

### More info: 
 - [Michel Deslierres](https://www.sigmdel.ca/michel/ha/sonoff/sonoff_mini_en.html)
