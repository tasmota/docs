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
- Allow discovery of MCP2300xx output as relay [#12037](https://github.com/arendst/Tasmota/discussions/12037)
- Defines `USER_RULE1`, `USER_RULE2` and `USER_RULE3` to store rules at compile time
- Define `USER_BACKLOG` to store commands at compile time to be executed at firmware load or when executing command reset
- New commands: [`TuyaSend5`](Commansd.md#tuyasend), [`Status0`](Commansd.md#status)
- Acer projector support [#12190](https://github.com/arendst/Tasmota/discussions/12190)
- ESP32
    - Preliminary **alpha** support for ESP32-C3 (RiscV based)
    - pull-down buttons `Button_d` and `Button_id` and switches `Switch_d` [#10814](https://github.com/arendst/Tasmota/discussions/10814)
    - LVGL support for 3 buttons as rotary encoder [#12035](https://github.com/arendst/Tasmota/discussions/12035)
    - LVGL support for touchscreen [#12039](https://github.com/arendst/Tasmota/discussions/12039)
    - LVGL support for TrueType fonts via FreeType library [#12087](https://github.com/arendst/Tasmota/discussions/12087)
    - LVGL support for PSRAM [#12062](https://github.com/arendst/Tasmota/discussions/12062)
    - LVGL support for PNG images [#12148](https://github.com/arendst/Tasmota/discussions/12148)
    - Support for BM8563 RTC chip (I2C) found in M5Stack Core2 and M5StickC [#12199](https://github.com/arendst/Tasmota/discussions/12199)
    - I2S and Interrupt GPIO types [#12192](https://github.com/arendst/Tasmota/discussions/12192)

See [changelog](https://github.com/arendst/Tasmota/blob/development/CHANGELOG.md) for a complete list of new features, changes and bug fixes.

### Join our communities and chat
See [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota), [Reddit](https://www.reddit.com/r/tasmota/) or [Google Groups](https://groups.google.com/d/forum/sonoffusers) for general chat, feedback, questions and live troubleshooting.

### Report bugs and suggest features
Open a new topic on [Tasmota discussions](https://github.com/arendst/Tasmota/discussions).

Report a bug in [Tasmota issues](https://github.com/arendst/Tasmota/issues).


#### If you like Tasmota
<iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe> 
