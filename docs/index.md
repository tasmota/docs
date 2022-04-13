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
<a href="http://ota.tasmota.com/tasmota/release-11.1.0/"><span style="font-size:40px;">Tasmota 11.1.0 Ostara</span></a><br>

- Tasmota Web Installer improved and integrated in the [Flashing](Getting-started.md#flashing)
- Support for improv when using Tasmota Web Installer
- New peripherals: up to four DS3502 digital potentiometers, ADE7880 3 phase energy monitor as used in Shelly 3EM, PCF85363 RTC as used in Shelly 3EM, __experimental__ Sonoff MS01 moisture sensor
- New commands: [`SetOption135`](Commands.md#setoption135), [`SetOption136`](Commands.md#setoption136), [`SetOption137`](Commands.md#setoption137), [`SetOption138`](Commands.md#setoption138), [`SspmMap`](Sonoff-SPM.md#sspmmap), [`TcpConnect`](Commands.md#tcpconnect), [`RfTimeout`](Commands.md#rftimeout), [`IfxSensor`](Commands.md#ifxsensor), [`Sensor12`](Commands.md#sensor12), [`Sensor34`](Commands.md#sensor34), [`Wiper`](Commands.md#wiper) and lots of [NeoPool](NeoPool.md) commands
- Shrunk `tasmota-minimal.bin` by removing all commands except Upgrade, Upload, OtaUrl, Seriallog, Weblog and Restart
- Sonoff SPM increase maximum number of relays supported to 32 (8 SPM-4Relay modules)
- Extend number of pulsetimers from 8 to 32
- ESP32
    - Support for [OpenHASP](OpenHASP.md)
    - support for BLE Mi Scale V1
    - Integrate Homekit in Bluetooth binary
    - Berry virtual Alexa hue device
    - Berry bootloop protection

See [release notes](https://github.com/arendst/Tasmota/releases/tag/v11.1.0) for a complete list of new features, changes and bug fixes.

### Join our communities and chat
See [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota), [Reddit](https://www.reddit.com/r/tasmota/) or [Google Groups](https://groups.google.com/d/forum/sonoffusers) for general chat, feedback, questions and live troubleshooting.

### Report bugs and suggest features
Open a new topic on [Tasmota discussions](https://github.com/arendst/Tasmota/discussions).

Report a bug in [Tasmota issues](https://github.com/arendst/Tasmota/issues).

#### If you like Tasmota
<iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe> 
