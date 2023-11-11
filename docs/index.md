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

<span style="font-size: 1.5rem">Current Release<BR><a href="https://github.com/arendst/Tasmota/releases/tag/v13.2.0">Tasmota 13.2.0 Quincy</a></span>

## Breaking Changes

- `Sendmail` upgraded to ESP-Mail-Client v3.4.9 from v1.2.0, using BearSSL instead of MbedTLS
- Removed support for Homekit in favour of Matter 

## New Features

- Experimental support for ESP32-C2 and ESP32-C6 using Arduino core v3
- Added rule variables `%power<1..28>` and `%switch<1..28>%` 
- Added support for:
  - Shelly PlusPMMini, Plus1Mini and Plus1PMMini
  - HDMI CEC protocol 
  - [ENS16x](ENS161.md) air quality and ENS210 temperture and humidity sensors
  - HC8 CO2 sensor
- Matter support for Virtual Devices controllable via Rules or Berry

See [release notes](https://github.com/arendst/Tasmota/releases/) for a complete list of new features, changes and bug fixes.

## Join Our Community

For feedback, questions, live troubleshooting or just general chat

<a href="https://discord.gg/Ks2Kzd4"><img src="https://discordapp.com/api/guilds/479389167382691863/widget.png?style=banner3"></a>

- [Telegram](https://t.me/tasmota)
- [Matrix](https://matrix.to/#/%23tasmota:matrix.org)
- [Reddit](https://www.reddit.com/r/tasmota/) 
- [Google Groups](https://groups.google.com/d/forum/sonoffusers)

## Report bugs and suggest features

Open a new topic on [Tasmota discussions](https://github.com/arendst/Tasmota/discussions).

Report a bug in [Tasmota issues](https://github.com/arendst/Tasmota/issues).
