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
<a href="http://ota.tasmota.com/tasmota/release-12.0.0/"><span style="font-size:40px;">Tasmota 12.0.0 Paul</span></a><br>

#### Breaking Changes :warning: 
- ***This version removes support for direct migration from versions before v8.1.0 (Doris)*** 
- Restructured tasmota source directories taking benefit from PlatformIO Core v6.0.2
- Prepare to remove dedicated Home Assistant discovery in favour of Tasmota Discovery and hatasmota
- ESP32 Tasmota SafeBoot with changed partition scheme allowing larger binaries
- ESP32 increase Serial Bridge input buffer from 130 to 520 characters
- Removed Arduino IDE support

#### New features
- Support for: Sonoff MS01 soil moisture sensor, Sonoff SPM v1.2.0, Sonoff Zigbee Bridge Pro, Sonoff NSPanel, 5-channel light dimmer driver BP5758D, HYTxxx temperature and humidity sensor, flowrate meters like YF-DN50
- New commands: [`SetOption139`](Commands.md#setoption139), [`SetOption140`](Commands.md#setoption140), [`SetOption141`](Commands.md#setoption141), [`SetOption142`](Commands.md#setoption142), [`EnergyExportActive<phase>`](Sonoff-SPM.md#energyexportactive), [`IfxRp`](Commands.md#ifxrp), [`SspmDisplay`](Commands.md#sspmdisplay), [`SSerialSend9`](Commands.md#sserialsend)

See [release notes](https://github.com/arendst/Tasmota/releases/tag/v12.0.0) for a complete list of new features, changes and bug fixes.

### Join our communities and chat
See [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota), [Reddit](https://www.reddit.com/r/tasmota/) or [Google Groups](https://groups.google.com/d/forum/sonoffusers) for general chat, feedback, questions and live troubleshooting.

### Report bugs and suggest features
Open a new topic on [Tasmota discussions](https://github.com/arendst/Tasmota/discussions).

Report a bug in [Tasmota issues](https://github.com/arendst/Tasmota/issues).

#### If you like Tasmota
<iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe> 
