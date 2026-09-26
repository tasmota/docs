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

<span style="font-size: 1.5rem">Current Release<BR><a href="https://github.com/arendst/Tasmota/releases/tag/v15.6.0">Tasmota v15.6.0 Sylvie</a></span>

## New Features

- Support for BLE BTHome in binary tasmota32-bluetooth.bin
- Shelly Pro 2PM emulation for ESP32 (Emulation 3)
- TLS support for EC P-384 curve in server certificate 
- Fixes regressions from version v15.5.0

See [release notes](https://github.com/arendst/Tasmota/releases/) for a complete list of new features, changes and bug fixes.

## Why Tasmota?

Tasmota is open-source firmware born for the **ESP8266**/**ESP8285**, now covering the whole ESP32 family: **ESP32**, **ESP32-S2**, **ESP32-S3**, **ESP32-C3**, **ESP32-C5**, **ESP32-C6**, **ESP32-P4**, with PSRAM and USB/CDC support where available.

It talks MQTT (v3.1.1 or v5) to your own broker or a cloud one over TLS ([AWS IoT Core](../AWS-IoT/) and [Azure IoT Hub](../Azure-IoT-Hub/)), or runs entirely standalone with no server at all — your choice.

Here's a tour of what it can do:

| Area | What you get |
|---|---|
| **Smart home integrations** | Plugs into [Home Assistant](../Home-Assistant/), [Domoticz](../Domoticz/), [openHAB](../openHAB/), [Node-RED](../NodeRed/), [KNX](../KNX/) and more via [MQTT](../MQTT/), local or cloud ([AWS IoT Core](../AWS-IoT/) and [Azure IoT Hub](../Azure-IoT-Hub/)). See [Smart Home Integrations](../Integrations/). |
| **Matter protocol** | Runs natively on ESP32, no MQTT, hub or companion app required. Pairs directly with Apple Home, Google Home, Amazon Alexa and Home Assistant. An ESP32 can also bridge your existing ESP8266 devices into Matter. See [Matter](../Matter/). |
| **Sensors & peripherals** | 150+ supported sensors and peripherals over I²C, SPI, 1-Wire and analog, most auto-detected once wired: temperature/humidity ([DHT11](../DHT11/)/DHT22, [DS18x20](../DS18x20/), [BME280](../BME280/), [SHT30](../SHT30/)), CO2 ([MH-Z19](../MH-Z19B/), [SCD4x](../SCD4x/)), air quality/dust (PMS5003, SPS30), energy monitoring (INA219, Eastron SDM), motion (PIR, mmWave radar), light ([BH1750](../BH1750/)), and many more. See [Peripherals](../Peripherals/) and the [device database](https://templates.blakadder.com/). |
| **Home appliances** | Drives [shutters and blinds](../Blinds-and-Shutters/) (pulse, stepper or servo motors), [thermostat](../Thermostat/) control for heating/cooling, and reads [smart meter interfaces](../Smart-Meter-Interface/) (SML, OBIS, Modbus meters) for energy and utility data. |
| **Lights** | Dims, color-temperature-tunes or full-color controls [light bulbs and strips](../Lights/): single-channel dimmers, CT, RGB, RGBW and RGBCW, plus addressable LED strips (WS2812, SK6812...). |
| **Protocol bridging** | Speaks [Infrared](../Tasmota-IR/) (send & receive), [RF](../RF-Protocol/), [DALI](../DALI/), [Modbus](../Modbus-Bridge/), RS-485, [OpenTherm](../OpenTherm/), [TWAI](../TWAI/)/CAN, [LoRa/LoRaWan](../LoRa-and-LoRaWan-Bridge/), [HDMI-CEC](../HDMI_CEC/), [Telegram](../Telegram/) and SMTP email, plus a generic Arduino MCU bridge. |
| **Zigbee & Bluetooth** | Turns an ESP32 into a [Zigbee](../Zigbee/) coordinator or a [BLE gateway](../Bluetooth/) (including BTHome), bridging devices without a separate hub. |
| **Displays & touch UI** | Drives [character, graphic and e-paper displays](../Displays/), and on ESP32 renders rich, animated touchscreen UIs with [LVGL](../LVGL/) — resistive or capacitive touch, SPI panels. [HASPmota](../HASPmota/) builds full UIs from simple JSON templates, no LVGL or Berry code needed. |
| **Automation & scripting** | [Rules](../Rules/) and [Timers](../Timers/) handle on-device automation; the [Berry](../Berry/) scripting language gives full programmatic control — it's also what powers LVGL, HASPmota and the animation engine. |
| **Networking** | Wired Ethernet, [IPv6](../IPv6/), [Wi-Fi range extender](../Range-Extender/) mode, a built-in [WireGuard VPN](../Wireguard/) client for secure remote access, and [TasMesh](https://github.com/arendst/Tasmota/blob/development/info/xdrv_57_tasmesh.md) for encrypted ESP-NOW mesh links to battery-powered nodes. |
| **LED animation** | A dedicated DSL-based engine animates addressable LED strips (WS2812, SK6812...) with effects like pulse, breathe, comet and twinkle. Design and preview animations in the [online browser emulator](https://tasmota.github.io/docs/Tasmota-Berry-emulator/index.html) before flashing. |
| **Audio** | [I2S audio](../I2S-Audio_ESP32/) support adds microphone input and speaker/DAC output, including MP3/AAC/OPUS streaming. |
| **And more** | [TuyaMCU](../TuyaMCU/) support for Tuya Wi-Fi/MCU devices, [Shelly Gen2 emulation](../Shelly-Emulation/), [deep](../DeepSleep/)/[dynamic](../Dynamic-Sleep/) sleep for battery devices, [Device Groups](../Device-Groups/) for keeping devices in sync, [ArtNet DMX](../ArtNet/), [TensorFlow Lite](../TFL/) and [ULP coprocessor](../ULP/) scripting on ESP32, a [file system](../UFS/) with optional SD card storage. |

Not every feature fits in the precompiled release binaries due to flash size limits — some require [compiling your own build](../Compile-your-build/). Pages with that requirement say so explicitly.

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
