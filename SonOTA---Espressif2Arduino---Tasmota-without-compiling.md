This is for the lazy people that don't want to open the device, don't want to install SDKs and don't want to compile stuff ;-). **Warning: Many of these components are very new, nothing is guaranteed to work, you might need to solder headers to recover from bugs here.** Flashing with SonOTA only works on Itead firmware versions up to 1.6. Beginning with version 1.6, Itead removed the broadcast WiFi network used for configuration. **_It appears that [SonOTA may work again with Sonoff firmware v2.0.1 or greater](https://github.com/mirko/SonOTA/wiki#known-working-configurations)._**

SonOTA has been updated to include pre-compiled binary files, see the home page for more information: https://github.com/mirko/SonOTA

# Prerequisites

You need
* Your **home** WiFi 
* **Temporary** WiFi (you can use smartphone hotspot) with following parameters:
  * SSID: indebuurt1
  * Password: VnsqrtnrsddbrN
  * NOTE: Please make sure hotspot uses exactly these parameters!
  * NOTE: This Wifi needs internet connectivity.
* A PC or similar with python3 that can run SonOTA. On a Mac, python3 can be installed like this:
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install python3
```
* You obviously need SonOTA:
```
mkdir ~/src/
cd ~/src/
git clone https://github.com/mirko/SonOTA.git
cd SonOTA
pip3 install -r requirements.txt
```
* You will also need prepackaged library of certificates and intermediate Espressif2Arduino firmwares:
```
cd ~/src/SonOTA
wget -c http://cputoasters.com/ameyer/sonoff/sonota-e2a.zip
unzip sonota-e2a.zip
```
* We're assuming you have at least one of the supported Sonoff devices, but make sure they are running latest Itead firmware. You can update firmware from EweLink. Make sure you run latest firmware, old firmware is known not to work with SonOTA! Really. Seriously. Honto!

# Compatibility

It worked with these devices. The firmware version is the version after the update with EweLink, before starting the actual SonOTA process.
* TH10
  * FW 2.0.4 (reported by: cputoaster)
* TH16
  * FW 2.0.4 (reported by: cputoaster)
* POW (reported by: cputoaster)
* T1 ((reported by: cputoaster - use the left button to set the device to config mode)
* Dual (reported by: lgnd33)
* 4CH (reported by: lgnd33)

# Steps:

* Start sonota.py with your **home** Wifi parameters and your PC IP (e.g. 192.168.1.10)
```
cd ~/src/SonOTA
./sonota.py --wifi-ssid myhomewifi --wifi-password supersecredpassword --serving-host 192.168.1.10
```
SonOTA should say something like: 
```
** No ip address of the ITEAD DHCP range (10.10.7.0/24) is assigned to any of your interfaces, which means you don't appear to be connected to the IEAD WiFi network.
** Please change into the ITEAD WiFi network (ITEAD-100001XXXX)
** This application can be kept running.
.......
```
* Connect Sonoff to mains, press button for 5s or so, until it blinks in blocks of 3, then again 5s or so until it blinks continuously. This will put Sonoff device in AP mode and will start ITEAD-10000xxxxx wifi.
* Connect your PC to ITEAD-xxxx wifi (password is always: 12345678)
* Device and SonOTA will chat for a bit and you should see something ending with: 
```
<< {
    "error": 0
}
~~ Provisioning completed
** The IP address of <serve_host> (192.168.1.10) is not  assigned to any interface on this machine.
** Please change WiFi network to $ESSID and make  sure %s is being assigned to your WiFi interface.
** This application can be kept running.
...
```
* Switch PC to your **home** Wifi. SonOTA should send more stuff, and all being OK, you should get something ending with:
```
(INFO) 200 GET /ota/image_user2-0x81000.bin?deviceid=xxxxxxxx2&ts=xxxxxxxx&sign=bbf6xxxxxxxx495dd2ef548d9bcddb83a319fd074d9a69a056 (192.168.1.4) 3073.26ms
(DEBUG) << WEBSOCKET INPUT
(DEBUG) << {
    "userAgent": "device",
    "sequence": "150393500xxxx",
    "error": 0,
    "apikey": "18ec4241-ee80-xxxx-xxxx-xxxxxxxxxxxx",
    "deviceid": "xxxxxxxxxxxx"
}
(DEBUG) ~~~ device acknowledged our action request (seq 150393500xxxx) with error code 0
```
* Now, the device is connecting to your *temporary* Wifi and downloading minimal Tasmota image. This can take some time (2 minutes), after which device will reset and connect back to temporary Wifi.
* Connect your PC to the *temporary* Wifi
* Use NMAP to find the device's IP (or use Fing in Android):
```
nmap 172.20.19.1-255 -p 80
``` 
* Use a web browser to connect to a new firmware on your device (note, we're not done yet ;)
* Update to Tasmota standard image, either by using OTA via internet (http://sonoff.maddox.co.uk/tasmota/tasmota.bin), or uploading image. Device will restart once again. Not upgrading to the standard image will result in not being able to store config values and more, as this is just an intermediate image.
* Still connected to *temporary*  Wifi, login and change Wifi settings to your *home* Wifi. Device will reset.
* Connect the PC to your *home* Wifi and find your new device. 
* You can now configure rest of the system, including correct device type, MQTT settings and everything else.
