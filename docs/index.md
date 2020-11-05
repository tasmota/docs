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


For OTA updates please use the new server [http://ota.tasmota.com/tasmota/release](http://ota.tasmota.com/tasmota/release) and [http://ota.tasmota.com/tasmota32/release](http://ota.tasmota.com/tasmota32/release/). <br>
Download [latest Tasmotizer](https://github.com/tasmota/tasmotizer/releases/) to use the new OTA server during flashing.

### Current release 
<a href="https://github.com/arendst/Tasmota/releases/tag/v9.1.0"><span style="font-size:40px;">Tasmota 9.1.0 Imogen</span></a><small><span style="float:right">\*all documentation is for current release only</small></span><br>

Christmas has come early: 

- Detach switches from relays and lights using command [`SetOption114 1`](Commands#setoption114)
- Added official [Tasmota integration](https://www.home-assistant.io/integrations/tasmota/) for Home Assistant. _Still in beta_

- :warning: **BREAKING CHANGE** :warning: Redesigned GPIO representation changing Template layout. [Read more...](GPIO-Conversion)
- :warning: **BREAKING CHANGE** :warning: Changed `SetOption73 1` JSON result from {"ACTION":"SINGLE"} to {"Button1":{"Action":"SINGLE"}} 

- Added support for [EZO](EZO.md) sensors
- Removed support for direct upgrade from Tasmota versions before v7.0. You **have to follow** the [migration path](Upgrading#migration-path).
- Support for analog buttons indexed within standard button range
- PlatformIO library structure redesigned for improved compilation speed 
- Added Vietnamese language tranlation
- New commands: [`DimmerStep`](Commands#dimmerstep), [`NoDelay`](Commands#nodelay), [`PulseTime<x>`](Commands#pulsetime), [`ShutterChange`](Commands#nodelay), [`SO114`](Commands#setoption114), [`SwitchMode 15`](Commands#nodelay), [`SwitchText`](Commands#switchtext), [`SO113`](Commands#nodelay), [`ZbMap`](Commands#zbmap), [`ZbOccupancy`](Commands#zboccupancy), 

See [changelog](https://github.com/arendst/Tasmota/blob/development/CHANGELOG.md) for a complete list of new features, changes and fixes.

### Join our community
See [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota) or [Community Forum](https://groups.google.com/d/forum/sonoffusers) for feedback, questions and troubleshooting.

### If you like Tasmota
<iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe> 
