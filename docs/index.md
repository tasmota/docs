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

<span style="font-size: 1.5rem">Current Release<BR><a href="https://github.com/arendst/Tasmota/releases/tag/v14.0.0">Tasmota v14.0.0 Rodney</a></span>

## Breaking Changes

- Replaced most display drivers by Universal Display driver
- Removed dedicated touch drivers in favour of Universal Touch driver
- ESP32-C3 OTA binary name from `tasmota32c3cdc.bin` to `tasmota32c3.bin`
- ESP32-C6 OTA binary name from `tasmota32c6cdc.bin` to `tasmota32c6.bin`
- ESP32-S3 OTA binary name from `tasmota32s3cdc.bin` to `tasmota32s3.bin`

## New Features

- New commands `Wifi 6`, `PowerLock` and `Publish3`
- Added support for:
  - LoRa and LoRaWanBridge
  - Domoticz `idx5` to `idx32`
  - SPL06_007 pressure and temperature sensor
  - AHT30 temperature and humidity sensor
- ESP32 Framework (Arduino Core) v3.0.0
- Berry functions

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
