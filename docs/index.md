---
title: Tasmota Documentation
description: Open source firmware for ESP devices with easy configuration using webUI, OTA updates, automation using timers or rules, expandability and entirely local control over MQTT, HTTP, serial or KNX.
hide:
  - toc
---
# Open source firmware for ESP devices

<img style="margin: 10px 10px; float:right; width:50%" src="_media/frontlogo.svg" alt="Tasmota Logo"></img>
Total local control with quick setup and updates.    
Control using MQTT, Web UI, HTTP or serial.    
Automate using timers, rules or scripts.    
Integration with home automation solutions.    
Incredibly expandable and flexible.     

[![Latest release](https://img.shields.io/github/downloads/arendst/Tasmota/total.svg?style=flat-square&color=green)](http://ota.tasmota.com/tasmota/release) [![License](https://img.shields.io/github/license/arendst/Tasmota.svg?style=flat-square)](https://github.com/arendst/Tasmota/blob/development/LICENSE.txt) [![Chat](https://img.shields.io/discord/479389167382691863.svg?style=flat-square&color=blueviolet)](https://discord.gg/Ks2Kzd4) [![Donate](https://img.shields.io/badge/donate-PayPal-blue.svg?style=flat-square)](https://paypal.me/tasmota)

<span style="font-size: 1.5rem">Current Release<BR><a href="http://ota.tasmota.com/tasmota/release-12.1.1/">Tasmota 12.1.1 Patricia</a></span>

## Breaking Changes :warning: :warning: :warning: 
- ***This version removes support for direct migration from versions before v8.1.0 (Doris)*** 
- Restructured tasmota source directories taking benefit from PlatformIO Core v6.0.2
- Removed dedicated MQTT Home Assistant discovery in favour of Tasmota Discovery and hatasmota
- ESP32 Tasmota [Safeboot](Safeboot.md) with changed partition scheme allowing larger binaries
- ESP32 increase Serial Bridge input buffer from 130 to 520 characters
- Removed Arduino IDE support

## New Features
- Added support for: 
    - 5-channel light dimmer driver SM2335 used in SwitchBot color bulbs
    - Sonoff POWR3xxD and THR3xxD with their bistable (latching) relays mixed with monostable relays
    - Modbus bridge
    - multiple IRSend GPIOs
    - Catalan language
    - ESP32 Support for Ultra Low Power (ULP) coprocessor via Berry
- New commands: [`SetOption45`](Commands.md#setoption45), [`SetOption144`](Commands.md#setoption144), [`GlobalTemp2`](Commands.md#globaltemp2), [`GlobalHum2`](Commands.md#globalhum2), [`GlobalPress2`](Commands.md#globalpress2), [`Sleep2`](Commands.md#sleep2), [`WiFiScan`](Commands.md#wifiscan), [`WiFiTest`](Commands.md#wifitest)

### 12.1.1 Hotfixes
- Button response delay regression from v12.0.2.4 
- Lost module name in GUI regression from v12.0.2.4
- RTC not detected when lights are present #16242
- DNS lookup for .local domains 

See [release notes](https://github.com/arendst/Tasmota/releases/) for a complete list of new features, changes and bug fixes.

## Join Our Community

For feedback, questions, live troubleshooting or just general chat

<a href="https://discord.gg/Ks2Kzd4"><img src="https://discordapp.com/api/guilds/479389167382691863/widget.png?style=banner3"></a>

- [Telegram](https://t.me/tasmota)
- [Reddit](https://www.reddit.com/r/tasmota/) 
- [Google Groups](https://groups.google.com/d/forum/sonoffusers)

## Report bugs and suggest features
Open a new topic on [Tasmota discussions](https://github.com/arendst/Tasmota/discussions).

Report a bug in [Tasmota issues](https://github.com/arendst/Tasmota/issues).
