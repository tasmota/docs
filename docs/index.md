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
<a href="https://github.com/arendst/Tasmota/releases/tag/v9.4.0"><span style="font-size:40px;">Tasmota 9.4.0 Leslie</span></a><small><span style="float:right">\*all documentation is for current release only</small></span><br>


- :warning: BREAKING :warning: ESP32 partition layout changed to accommodate more file space on most boards and more code space on Core2 and Odroid-GO [#11746](https://github.com/arendst/Tasmota/issues/11746)

- Redesigned initial GUI wifi configuration by Adrian Scillato [#11693](https://github.com/arendst/Tasmota/issues/11693)
- Support to control [NEC and OPTOMA LCD/DLP Projector](Projector.md)
- Support XPT2046 touch screen digitizer on ILI9341 display 
- Support for CSE7761 energy monitor as used in ESP32 based Sonoff Dual R3 Pow [#10793](https://github.com/arendst/Tasmota/issues/10793)
- Support for Frequency monitoring and zero-cross detection on CSE7761 (Sonoff Dual R3)
- Support for dummy energy monitor using user values set by commands ``VoltageSet``, ``CurrentSet``, ``PowerSet`` and ``FrequencySet``. Enable by selecting any GPIO as ``Option A2`` [#10640](https://github.com/arendst/Tasmota/issues/10640)
- Support for TM1638 and MAX7219 seven segment displays 
- Tasmota discovery as alternative to Home Assistant discovery using define ``USE_TASMOTA_DISCOVERY``
- New commands: [`Sensor80`](Commands.md#sensor80), [`SerialBuffer`](Commands.md#serialbuffer), [`SetOption126`](Commands.md#setoption126), [`Backlog0`](Commands.md#backlog0), [`TuyaTempSetRes 0..3`](Commands.md#tuyatempsetres), [`MqttKeepAlive 1..100`](Commands.md#mqttkeepalive), [`MqttTimeout 1..100`](Commands.md#mqtttimeout), [`DisplayType`](Commands.md#displaytype), [`DisplayInvert`](Commands.md#displayinvert)
- Optional GUI file editor enabled with define ``GUI_EDIT_FILE`` [#11668](https://github.com/arendst/Tasmota/issues/11668)
- Initial support for universal display driver UDisplay by Gerhard Mutz. Enable by selecting any GPIO as ``Option A3`` [#11665](https://github.com/arendst/Tasmota/issues/11665)
- ESP32
    - Berry improvements [#11163](https://github.com/arendst/Tasmota/issues/11163)
    - Extent BLE [#11212](https://github.com/arendst/Tasmota/issues/11212)
    - Support for WS2812 hardware driver via RMT or I2S, secondary I2C controller, internal Hall Effect sensor connected to both GPIO36 and GPIO39, LVGL 7.11 with Berry binding
    - Build changes: tasmota32-knx.bin, tasmota32-sensors.bin and tasmota32-lite.bin binaries consolidated in *tasmota32.bin* binary

See [changelog](https://github.com/arendst/Tasmota/blob/development/CHANGELOG.md) for a complete list of new features, changes and bug fixes.

### Join our communities and chat
See [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota), [Reddit](https://www.reddit.com/r/tasmota/) or [Google Groups](https://groups.google.com/d/forum/sonoffusers) for general chat, feedback, questions and live troubleshooting.

### Report bugs and suggest features
Open a new topic on [Tasmota discussions](https://github.com/arendst/Tasmota/discussions).

Report a bug in [Tasmota issues](https://github.com/arendst/Tasmota/issues).


#### If you like Tasmota
<iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe> 
