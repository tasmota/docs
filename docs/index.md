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

<span style="font-size: 1.5rem">Current Release<BR><a href="https://github.com/arendst/Tasmota/releases/tag/v12.3.1">Tasmota 12.3.1 Percy</a></span>

## Breaking Changes

- Redesign distance sensors VL53LXX, TOF10120, HRXL and DYP to use cm instead of mm

## New Features

- Added support for: 
  - HLK-LD2410 24GHz smart wave motion sensor
  - Shelly Pro 1/1PM and 2/2PM
  - up to four DS18x20 GPIOs
  - Digital Addressable Lighting Interface (DALI)
  - NTAG2xx tags read and write on PN532 NFC reader
  - Plantower PMSx003T AQI models with temperature and humidity
  - BP1658CJ RGBCW LED bulbs
  - Dingtian x595 shift register based relay boards
  - ME007-ULS narrow FoV ultrasonic distance sensor
  - WS2812 and Light ArtNet DMX control over UDP port 6454
  - Zigbee router firmware for Sonoff ZBBridgePro
- New commands: [`SetOption35`](Commands.md#setoption35), [`SetOption47`](Commands.md#setoption47), [`RgxClients`](Commands.md#rgxclients), [`RgxPort`](Commands.md#rgxport), [`Switchmode 16`](Commands.md#switchmode)

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
