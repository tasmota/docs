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


For OTA updates please use the new server [http://ota.tasmota.com/tasmota](http://ota.tasmota.com/tasmota/) and [http://ota.tasmota.com/tasmota32](http://ota.tasmota.com/tasmota32/). <br>
Download [latest Tasmotizer](https://github.com/tasmota/tasmotizer/releases/) to use the new OTA server during flashing.

### Current release 
<a href="https://github.com/arendst/Tasmota/releases/tag/v8.5.0"><span style="font-size:40px;">Tasmota 8.5 Hannah</span></a><small><span style="float:right">\*all documentation is for current release only</small></span><br>

- :rotating_light: **BREAKING CHANGE** :rotating_light: Removed support for direct upgrade from versions before 6.6.0.11 to versions after 8.4.0.1
- :rotating_light: **BREAKING CHANGE** :rotating_light: PlatformIO 5.0 is **required** to compile Tasmota 8.5+
- :rotating_light: **BREAKING CHANGE** :rotating_light: Change White blend mode to using command [`SetOption105`](Commands.md#setoption105) instead of ``RGBWWTable``
- Improvements for Zigbee UI display and ZbBridge
- Experimental virtual CT for 4 channels lights, emulating a 5th channel
- Support for DYP ME007 ultrasonic distance sensor 


See [changelog](changelog.md) for a complete list of new features, changes and fixes.

### Join our community
See [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota) or [Community Forum](https://groups.google.com/d/forum/sonoffusers) for feedback, questions and troubleshooting.

### If you like Tasmota
<iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe> 
