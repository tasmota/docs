---
title: Tasmota Documentation
description: Open source firmware for ESP devices with easy configuration using webUI, OTA updates, automation using timers or rules, expandability and entirely local control over MQTT, HTTP, serial or KNX.
---
# Open source firmware for ESP devices

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

<b>Install Tasmota using a Chrome based browser at [https://tasmota.github.io/install/](https://tasmota.github.io/install/).</b>    

### Current release 
<a href="http://ota.tasmota.com/tasmota/release-11.0.0/"><span style="font-size:40px;">Tasmota 11.0.0 Olivia</span></a><br>

- Tasmota favicon to webbrowser tab 
- Support for Linkind dimmer as GPIO `Option A6`
- New rule variables `%color%` and `%timer1%` to `%timer16%`
- New peripherals: Eastron SDM230 modBus energy meter, MQ analog sensor for air quality
- New commands: [`SetOption44`](Commands.md#setoption44), [`SetOption134`](Commands.md#setoption134), [`SSerialConfig`](Commands.md#sserialconfig), [`WebTime`](Commands.md#webtime)
- ESP32
    - Single binary firmware
    - Support for TuyaMCU
    - Increase PWM channels to 16
    - Initial support for ESP32S3 with support for 38 configurable GPIOs

See [release notes](https://github.com/arendst/Tasmota/releases/tag/v10.1.0) for a complete list of new features, changes and bug fixes.

### Join our communities and chat
See [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota), [Reddit](https://www.reddit.com/r/tasmota/) or [Google Groups](https://groups.google.com/d/forum/sonoffusers) for general chat, feedback, questions and live troubleshooting.

### Report bugs and suggest features
Open a new topic on [Tasmota discussions](https://github.com/arendst/Tasmota/discussions).

Report a bug in [Tasmota issues](https://github.com/arendst/Tasmota/issues).

#### If you like Tasmota
<iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe> 
