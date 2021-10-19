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
<a href="http://ota.tasmota.com/tasmota/release-10.0.0/"><span style="font-size:40px;">Tasmota 10.0.0 Norman</span></a><br>

The big number 10 is here and with such a big number comes stable ESP32 support and a [web installer](https://tasmota.github.io/install/) as the easiest way to install Tasmota.

- Energy monitoring of individual phases
- Support for second DNS server
- Support for [InfluxDB](Commands.md#influxdb)
- Changed message `Upload buffer miscompare` into `Not enough space` while upgrading.
- New peripherals: IKEA VINDRIKTNING particle concentration sensor, AM2320 temperature and humidity sensor, [Hydreon RG-15 rain sensor](HRG15.md), Sensirion SCD40/SCD41 CO~2~ sensor, SeedStudio Grove HM3301 particle sensor, BL0939 and BL0942 energy monitor, Technoline WS2300-15 Anemometer, Telaire T6700 Series CO2 sensor, CAN bus and Freedom Won Battery Management System,  IEM3155 Wattmeter
- New commands: [`SetOption2`](Commands.md#setoption2), [`SetOption127`](Commands.md#setoption127), [`SetOption128`](Commands.md#setoption128), [`SetOption129`](Commands.md#setoption129), [`SetOption130`](Commands.md#setoption130), [`EnergyExport`](Commands.md#energyexport), [`EnergyUsage`](Commands.md#energyusage), [`EnergyTotal`](Commands.md#energytotal), [`EnergyToday`](Commands.md#energytoday), [`EnergyYesterday`](Commands.md#energyyesterday)
- Removed command `EnergyReset` and replaced by new energy commands
- Initial support for Tasmota Mesh (TasMesh) providing node/broker communication using ESP-NOW
- Initial support for Wi-Fi extender
- Default disable CORS for enhanced security and provide user compile option `#define USE_CORS`
- ESP32
    - Support for ESP32 chips is now stable, ESP32-C3 support is promoted beta and ESP32-S2 is now in alpha with support for GPIOS
    - support for (Yeelight) Mi Desk Pro using binary tasmota32solo1.bin
    - LVGL updated to v8.0.2
    - add GPIO 6/7/8/11 to template construction and remove GPIO 28-31 (remapping so backwards compatible)
    - **Berry:** partition manager, new class webclient for HTTP/HTTPS requests, support for serial, I2S audio mp3 playback, vararg, Curve 25519 EC crypto, ESP32/ESP32S2 DAC gpio
- Fixes: Sonoff L1(lite) controls, negative power values for ADE7953 based devices like Shelly EM

See [release notes](https://github.com/arendst/Tasmota/releases/tag/v10.0.0) for a complete list of new features, changes and bug fixes.

### Join our communities and chat
See [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota), [Reddit](https://www.reddit.com/r/tasmota/) or [Google Groups](https://groups.google.com/d/forum/sonoffusers) for general chat, feedback, questions and live troubleshooting.

### Report bugs and suggest features
Open a new topic on [Tasmota discussions](https://github.com/arendst/Tasmota/discussions).

Report a bug in [Tasmota issues](https://github.com/arendst/Tasmota/issues).

#### If you like Tasmota
<iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe> 
