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

<span style="font-size: 1.5rem">Current Release<BR><a href="https://github.com/arendst/Tasmota/releases/tag/v12.4.0">Tasmota 12.4.0 Peter</a></span>

## Breaking Changes

- TM1638 button and led support are handled as virtual switches and relays

## New Features

- Added support for: 
  - up to 3 (ESP8266) or 8 (ESP32) phase modbus energy monitoring device using generic Energy Modbus driver
  - RGB displays
  - IPv6 DNS records (AAAA) and IPv6 Ping for ESP32 and ESP8266
  - TM1650 display as used in some clocks
  - CA9632 4-channel 8-bit PWM driver as light driver 
  - SEN5X gas and air quality sensor
  - Shelly Pro 4PM
  - ESP32 preliminary support for Matter protocol, milestone 1 (commissioning)
- New commands: [`DhtDelay`](Commands.md#dhtdelay)

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
