description: Documentation (Wiki) for Tasmota: Open source firmware for ESP8266 devices with easy configuration using webUI, OTA updates, automation using timers or rules, expandability and entirely local control over MQTT, HTTP, serial or KNX.

# Open source firmware for ESP8266 devices

<img style="margin: 10px 10px; float:right; width:35%" src="_media/frontlogo.svg" alt="Tasmota Logo"></img>
Total local control with quick setup and updates.    
Control using MQTT, Web UI, HTTP or serial.    
Automate using timers, rules or scripts.    
Integration with home automation solutions.    
Incredibly expandable and flexible.     

[![Latest release](https://img.shields.io/github/downloads/arendst/Tasmota/total.svg?style=flat-square&color=green)](http://ota.tasmota.com/tasmota/release)
[![License](https://img.shields.io/github/license/arendst/Tasmota.svg?style=flat-square)](https://github.com/arendst/Tasmota/blob/development/LICENSE.txt)
[![Chat](https://img.shields.io/discord/479389167382691863.svg?style=flat-square&color=blueviolet)](https://discord.gg/Ks2Kzd4)
[![Donate](https://img.shields.io/badge/donate-PayPal-blue.svg?style=flat-square)](https://paypal.me/tasmota)


OTA update servers: [http://ota.tasmota.com/tasmota/release](http://ota.tasmota.com/tasmota/release) and [http://ota.tasmota.com/tasmota32/release](http://ota.tasmota.com/tasmota32/release/).

<small><span style="float:right">\*all documentation is for current release only</small></span>
### Current release 
<a href="http://ota.tasmota.com/tasmota/release-9.5.0/"><span style="font-size:40px;">Tasmota 9.5.0 Michael</span></a><br>

- :warning: BREAKING :warning: Lights using MQTT discovery will not work correcty in Home Assistant 2015.5 due to new [color modes](https://www.home-assistant.io/blog/2021/05/05/release-20215/#color-modes). Upgrade to [v9.5](http://ota.tasmota.com/release/tasmota/) of Tasmota and use [Tasmota integration](https://www.home-assistant.io/integrations/tasmota)

- new optional Template configuration field [`"CMND"`](Templates.md#cmnd) to embed crucial configuration commands in the template string [#11788](https://github.com/arendst/Tasmota/discussions/11788)
- Support for MQTT using [Azure IoT Hub](Azure-IoT-Hub.md)
- new device IP is displayed in the UI after Wi-Fi initial config [#12091](https://github.com/arendst/Tasmota/discussions/12091)

- ESP32
    - ESP32 pulldown buttons Button_d and Button_id and switches Switch_d [#10814](https://github.com/arendst/Tasmota/discussions/10814)

See [changelog](https://github.com/arendst/Tasmota/blob/development/CHANGELOG.md) for a complete list of new features, changes and bug fixes.

### Join our communities and chat
See [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota), [Reddit](https://www.reddit.com/r/tasmota/) or [Google Groups](https://groups.google.com/d/forum/sonoffusers) for general chat, feedback, questions and live troubleshooting.

### Report bugs and suggest features
Open a new topic on [Tasmota discussions](https://github.com/arendst/Tasmota/discussions).

Report a bug in [Tasmota issues](https://github.com/arendst/Tasmota/issues).


#### If you like Tasmota
<iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe> 
