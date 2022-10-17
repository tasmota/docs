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

<span style="font-size: 1.5rem">Current Release<BR><a href="https://github.com/arendst/Tasmota/releases/tag/v12.2.0">Tasmota 12.2.0 Patrick</a></span>

## Breaking Changes :warning: :warning: :warning:

- Button debounce code has changes. Some setups might need adjustments of values.
- Shelly EM swap internal channels A and B to match P1 and P2

## New Features

- Added support for: 
  - Shelly Plus 2PM
  - SGP40 gas and air quality sensor
  - Modbus writing using ModbusBridge and Modbus Energy Monitoring devices using a rule file
  - DFRobot SEN0390 V30B ambient light sensor 
  - QMC5883L magnetic induction sensor
  - flowrate meter flow amount/duration
  - Zigbee device plugin mechanism with commands `ZbLoad`, `ZbUnload` and `ZbLoadDump`
  - Zigbee basic support for Green Power
  - Ethernet in ESP32 safeboot firmware
  - ESP32-S3 support for internal temperature sensor
  - ESP32-S2 and ESP32-S3 touch button support
  - ESP32 Automatically resize FS to max flash size at initial boot
  - LVGL/HASPmota add tiny "pixel perfect" fonts for small screens
  - HASPmota support for TTF fonts
  - 
- New commands: [`SetOption46`](Commands.md#setoption46), [`SetOption146`](Commands.md#setoption146), [`DspSpeed`](Commands.md#dspspeed), [`DspLine`](Commands.md#dspline), [`SspmPowerOnState`](Commands.md#sspmpoweronstate), [`StatusRetain`](Commands.md#statusretain), [`Sunrise`](Commands.md#sunrise), [`UrlFetch`](Commands.md#urlfetch), [`WcClock`](Commands.md#wcclock)

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
