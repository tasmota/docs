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

<span style="font-size: 1.5rem">Current Release<BR><a href="https://github.com/arendst/Tasmota/releases/tag/v13.1.0">Tasmota 13.1.0 Quentin</a></span>

## Breaking Changes

- ESP32 Safeboot partition is now enforced. If you're unable to upgrade due to "Program flash size is larger than real flash size" error run the [Partition Wizard](https://tasmota.github.io/docs/Tasmota-Application/#partition-management). See [GitHub discussion](https://github.com/arendst/Tasmota/discussions/18983) for more information.
- Support dropped for C3 < chip rev. 3. You can still build a [custom binary](https://github.com/arendst/Tasmota/pull/18998) if you wish to ugprade.
- Change command FileUpload index binary data detection from >199 to >299
- Matter relay numbering starts at 1 instead of 0 to match Tasmota numbering
- Berry `bool( [] )` and `bool( {} )` now evaluate as false
- Berry import strict now detects useless expression without side effects

## New Features

- Matter enhancements with option to disable bridge mode, mini-profiler and fabric_filtered request (for Google compatibility)
- Added support for:
  - MAX17043 fuel-gauge systems
  - multiple PCA9685 with extended functionality
  - SGP41 TVOC/NOx Sensor
  - DeepSleep battery level percentage
  - support for Zigbee air sensors
- Preparations for Arduino Core v3 and esp-idf v5
- Removed support in release builds for ESP32-C3 with chip revision below 3 (old development boards)
- New commands: [`BrRestart`](Commands.md#brrestart), [`I2cScan0`](Commands.md#i2cscan0)

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
