description: Documentation (Wiki) for Tasmota: Open source firmware for ESP8266 devices with easy configuration using webUI, OTA updates, automation using timers or rules, expandability and entirely local control over MQTT, HTTP, serial or KNX.

# Open source firmware for ESP8266 devices

<img style="margin: 10px 10px; float:right; width:35%" src="_media/frontlogo.svg" alt="Tasmota Logo"></img>
Total local control with quick setup and updates.    
Control using MQTT, Web UI, HTTP or serial.    
Automate using timers, rules or scripts.    
Integration with home automation solutions.    
Incredibly expandable and flexible.     

[![GitHub download](https://img.shields.io/github/downloads/arendst/Tasmota/total.svg?style=flat-square&color=green)](https://github.com/arendst/Tasmota/releases/latest)
[![License](https://img.shields.io/github/license/arendst/Tasmota.svg?style=flat-square)](https://github.com/arendst/Tasmota/blob/development/LICENSE.txt)
[![Chat](https://img.shields.io/discord/479389167382691863.svg?style=flat-square&color=blueviolet)](https://discord.gg/Ks2Kzd4)
[![Donate](https://img.shields.io/badge/donate-PayPal-blue.svg?style=flat-square)](https://paypal.me/tasmota)


For OTA updates please use the new server [http://ota.tasmota.com/tasmota/release](http://ota.tasmota.com/tasmota/release) and [http://ota.tasmota.com/tasmota32/release](http://ota.tasmota.com/tasmota32/release/). <br>
Download [latest Tasmotizer](https://github.com/tasmota/tasmotizer/releases/) to use the new OTA server during flashing.

### Current release 
<a href="https://github.com/arendst/Tasmota/releases/tag/v9.2.0"><span style="font-size:40px;">Tasmota 9.2.0 Julie</span></a><small><span style="float:right">\*all documentation is for current release only</small></span><br>

Tasmota team wishes you happy holidays and a prosperous New Year!

- :warning: **BREAKING CHANGE** :warning: mDNS has been removed from all pre-compiled binaries to conserve flash size 
- :warning: **BREAKING CHANGE** :warning: Removed TuyaMCU Fan functions in favor of new enum dpId's
- :warning: **BREAKING CHANGE** :warning: PN532 define `USE_PN532_CAUSE_EVENTS` replaced by rule trigger `PN532#UID=`
- :warning: **BREAKING CHANGE** :warning: KNX DPT9 (16-bit float) to DPT14 (32-bit float)

- Added TuyaMCU support for enum dpId's, some sensors and timers
- Official support for Shelly Dimmer 1 and 2 with custom STM32 firmware from James Turton
- Support for multiple WeMo devices
- Optional CCloader support for CC25xx Zigbee or CC26xx BLE 
- New sensor support: more EZO sensors, AS608 optical and R503 capacitive fingerprint sensor, MFRC522 13.56MHz rfid card reader
- New commands: [`RfProtocol`](Commands#rfprotocol), [`SO115`](Commands#setoption115), [`SO116`](Commands#setoption116), [`SO117`](Commands#setoption117), [`TuyaEnum`](Commands#tuyaenum), [`TuyaEnumList`](Commands#tuyaenumlist),[`ZbInfo`](Commands#zbinfo), [`ZbLeave`](Commands#zbleave) 

See [changelog](https://github.com/arendst/Tasmota/blob/development/CHANGELOG.md) for a complete list of new features, changes and bug fixes.

### Join our community
See [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota), [Reddit](https://www.reddit.com/r/tasmota/) or [Google Groups](https://groups.google.com/d/forum/sonoffusers) for feedback, questions and troubleshooting.

### If you like Tasmota
<iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe> 
