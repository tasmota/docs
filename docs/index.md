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


**For OTA updates please use the new server [http://ota.tasmota.com/tasmota](http://ota.tasmota.com/tasmota/) and [http://ota.tasmota.com/tasmota32](http://ota.tasmota.com/tasmota32/)**

Download [Tasmotizer v1.1c](https://github.com/tasmota/tasmotizer/releases/tag/v.1.1c) to use the new OTA server during flashing.

### Current release 
<a href="https://github.com/arendst/Tasmota/releases/tag/v8.4.0"><span style="font-size:40px;">Tasmota 8.4 George</span></a><small><span style="float:right">\*all documentation is for current release only</small></span><br>

- :rotating_light: **BREAKING CHANGE** :rotating_light: Change Domoticz commands prefix from `Domoticz` to `Dz`
- :rotating_light: **BREAKING CHANGE** :rotating_light: Support for Arduino Core versions before 2.7.1 has been removed
- :rotating_light: **BREAKING CHANGE** :rotating_light: Limited support of Arduino IDE as an increasing amount of features cannot be compiled with it. PlatformIO is now the only recommended tool for compiling Tasmota.
- Experimental support for [Sonoff Zigbee Bridge](https://templates.blakadder.com/sonoff_ZBBridge.html) with a dedicated binary and device module
- Support for switches/relays using AC detection circuitry e.g. [Moes MS-104B](https://templates.blakadder.com/moes-MS-104B.html) or [BlitzWolf BW-SS5](https://templates.blakadder.com/blitzwolf_BW-SS5.html)
- Support for [VEML6075](VEML6075), [VEML7700](VEML7700), [BH1750](BH1750), BL0940, HP303B, iEM3000, [LMT01](LMT01.md), [Teleinfo](http://hallard.me/category/tinfo/) and Telegram bot
- Initial support for rotary encoder as light controller
- Led<x\> can now be PWM controlled. See [LedPwmMode](Commands.md#ledpwmmode)

See [changelog](changelog.md) for a complete list of new features, changes and fixes.

### Join our community
See [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota) or [Community Forum](https://groups.google.com/d/forum/sonoffusers) for feedback, questions and troubleshooting.

### If you like Tasmota
<iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe> 
