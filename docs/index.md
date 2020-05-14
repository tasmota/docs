description: Documentation (Wiki) for Tasmota: Open source firmware for ESP8266 devices with easy configuration using webUI, OTA updates, automation using timers or rules, expandability and entirely local control over MQTT, HTTP, serial or KNX.

# Open source firmware for ESP8266 devices

<img style="margin: 10px 10px; float:right; width:35%" src="_media/frontlogo.svg" alt="Tasmota Logo"></img>
Total local control with quick setup and updates.    
Control using MQTT, Web UI, HTTP or serial.    
Automate using timers, rules or scripts.    
Integration with home automation solutions.    
Incredibly expandable and flexible.     

[![GitHub download](https://img.shields.io/github/downloads/arendst/Tasmota/total.svg?style=flat-square&color=green)](https://github.com/arendst/Tasmota/releases/latest)
[![License](https://img.shields.io/github/license/arendst/Tasmota.svg?style=flat-square)](https://github.com/arendst/Tasmota/blob/development/LICENSE.txt)
[![Chat](https://img.shields.io/discord/479389167382691863.svg?style=flat-square&color=blueviolet)](https://discord.gg/Ks2Kzd4)
[![Donate](https://img.shields.io/badge/donate-PayPal-blue.svg?style=flat-square)](https://paypal.me/tasmota)

### Current release 
<a href="https://github.com/arendst/Tasmota/releases/tag/v8.3.0"><span style="font-size:40px;">Tasmota 8.3.0 Fred</span></a><small><span style="float:right">\*all documentation is for current release only</small></span><br>
 
- :rotating_light: **BREAKING CHANGE** :rotating_light: 
Changed multicast address and port used by device groups. All devices using [Device Groups](Device-Groups.md) must be upgraded. 
- :rotating_light: **BREAKING CHANGE** :rotating_light: Upgraded [Home Assistant](Home-Assistant.md) discovery with new features: 
    - Template/Module name is now used as the Device name in autodiscovery;
    - New management for Lights discovery, using directly LIGHT structure;
    - Add support for SetOption37 for color remapping for led channels and independent handling of RGB and white channels;
    - Add support for SetOption68 for multi-channel PWM instead of a single light;
    - Add a failsafe to warn about the wrong order of Relay IDs when a light is present, it will block the MQTT generation for Relays/Lights until the issue is fixed;
    - New management for Relays discovery, using GPIO map directly;
    - Updated status sensor and its list of information
- :rotating_light: **BREAKING CHANGE** :rotating_light:  Buttons have a new configurable multipress feature, to activate AP mode now requires 6 button presses.

- Add quick wifi reconnect using saved AP parameters when [`SetOption56 0`](Commands.md#setoption56). Tasmota will now reconnect to your network in under a second.
- Add compression of Rules allowing for up to 60% more rules per each rule buffer
- Add rule trigger at root level such as `on loadavg<50 do power 2 endon` triggered by `state` command
- Add command `SO` as shortcut for `SetOption`
- Add command [`SetOption73`](Commands.md#setoption73) to decouple button from relays
- Add command [`SetOption41`](Commands.md#setoption41) to fix possible webUI unresponsiveness due to bad ARP implementation in routers
- Implemented [Zigbee](Zigbee.md#zigbee-binding) bind commands
- Add [`Palette`](Commands.md#palette) to specify a palette of colors used in schemes
- Add support for [OpenTherm](OpenTherm), [Thermostat](Commands.md#thermostat) control, [iAQ-core](IAQ.md) air quality sensor, [AS3935](AS3935) lightning sensor, analog anemometer, 64x48 SSD1306 OLED, Seven Segment display using HT16K33 and _highly experimental_ support of [ESP32](ESP32.md)
- Add console command history
- Add support for longer template names
- Fix possible Relay toggles on (OTA) restart

See [changelog](changelog.md) for a complete list of new features, changes and fixes.

### Join our community
See [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota) or [Community Forum](https://groups.google.com/d/forum/sonoffusers) for feedback, questions and troubleshooting.

### If you like Tasmota
<iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe> 
