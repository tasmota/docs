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
<a href="https://github.com/arendst/Tasmota/releases/tag/v8.2.0"><span style="font-size:40px;">Tasmota 8.2 Elliot</span></a> 

:rotating_light: **BREAKING CHANGE** :rotating_light: 

#### Most of the sensor support is moved to tasmota-sensors.bin!

- ==If your sensor didn't come with the device, it is most likely **not** supported in the default tasmota.bin firmware build anymore.== Consult [Builds table](Builds) for complete information.
- Enabling `SetOption19` will no longer switch %prefix% and %topic% and will keep the default topic structure
- Zigbee command prefixes have changed from `Zigbee*` to `Zb*`

#### Notable new features:

- Support for gzipped binaries
- Added group control of devices using UDP
- Added support for Mijia BLE sensors using [HM10](HM-10.md) or [NRF24L01](NRF24L01.md) peripherals
- Added native support for Martin Jerry type [PWM dimmer switches](PWM-dimmer-switch.md)
- Plenty of new [switchmodes](Buttons-and-Switches#switchmode).

See [changelog](changelog-8.2.md) for a complete list of new features, changes and fixes.

<!-- === "2019-12-25 - Tasmota v8.1"

    Merry Christmas and Happy New Year from the Tasmota Development Team.

    Tasmota v8.1 Doris is released. See [changelog for all changes](changelog-8.1.md).

    This release supports downgrade only to **version 7.2.0.x**. There are major changes in configuration code and layout which will completely break any downgrade to versions prior to v7.2. 

=== "2019-12-21 - Tasmota v7.2"

    Tasmota v7.2 Constance is released. See [changelog for all changes](changelog-7.2.md).

    Breaking change: tasmota-basic.bin is renamed to **tasmota-lite.bin**. Update your OtaUrl accordingly.

    :warning: :warning: :warning:    
    This will be the only release that supports fallback from future **release 8.0 and development versions 7.2.0.x** which will be released shortly. Tasmota v8.0 will have major changes in configuration code and layout which will completely break any downgrade to versions below v7.2.  -->

### Join our community
See [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota) or [Community Forum](https://groups.google.com/d/forum/sonoffusers) for feedback, questions and troubleshooting.

### If you like Tasmota
<iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe> 