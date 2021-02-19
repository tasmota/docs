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
<a href="https://github.com/arendst/Tasmota/releases/tag/v9.3.0"><span style="font-size:40px;">Tasmota 9.3.0 Kenneth</span></a><small><span style="float:right">\*all documentation is for current release only</small></span><br>

- Support for filesystem ``autoexec.bat`` to execute sequential commands like backlog
- Filesystem commands ``Ufs``, ``UfsType``, ``UfsSize``, ``UfsFree``, ``UfsDelete``, ``UfsRename`` and ``UfsRun``- Support for Afrikaans and Frysk language translations
- Added BSSID and Signal Strength Indicator to GUI wifi scan result [#10253](https://github.com/arendst/Tasmota/issues/10253)
- Rule trigger string comparisons for EndsWith ``$>``, StartsWith ``$<`` and Contains ``$|`` [#10538](https://github.com/arendst/Tasmota/issues/10538)
- New commands: ``CTRange``, ``L1MusicSync <0|Off>|<1|On>|<2|Toggle>, 1..10, 1..100>``, ``RuleTimer0``, ``Speed2``, ``VirtualCT``, ``SetOption40 0..250``, ``SetOption43 1..255``, ``SetOption118 1``, ``SetOption119 1``, ``SetOption120 1`` or ``ZbEndpointTopic 1``, ``ZbScan``
- Command synonims: ``ChannelRemap``, ``MultiPWM``, ``AlexaCTRange``, ``PowerOnFade``, ``PWMCT``, ``WhiteBlend`` and ``VirtualCT`` as synonyms for ``SetOption37, 68, 82, 91, 92, 105`` and ``106``
- Commands ``ZbNameKey``, ``ZbDeviceTopic``, ``ZbNoPrefix``, ``ZbEndpointSuffix``, ``ZbNoAutoBind`` and ``ZbNameTopic`` as synonyms for ``SetOption83, 89, 100, 101, 110`` and ``112``
- Commands ``ZbNoAutoBind``, ``ZbReceivedTopic`` and ``ZbOmitDevice`` as synonyms for ``SetOption116, 118`` and ``119``
- Commands ``BuzzerActive`` and ``BuzzerPwm`` as synonyms for ``SetOption67`` and ``111``
- Milliseconds to console output [#10152](https://github.com/arendst/Tasmota/issues/10152)
- Gpio ``Option_a1`` enabling PWM2 high impedance if powered off as used by Wyze bulbs [#10196](https://github.com/arendst/Tasmota/issues/10196)
- Rotary No Pullup GPIO selection ``Rotary A/B_n`` [#10407](https://github.com/arendst/Tasmota/issues/10407)
- Support for P9813 RGB Led MOSFET controller, FTC532 8-button touch controller, BS814A-2 8-button touch buttons, up to 4 I2C SEESAW_SOIL Capacitance & Temperature sensors, TOF10120 time of flight sensor, SPI display driver for ST7789 TFT, TM1637 seven segment display, RFID Wiegand interface, Sugar Valley NeoPool Controller, Eastron SDM72D-M three phase 100A Modbus energy meter, SPI display driver SSD1331 Color OLED
- Support for ESP32 ``Module 3`` Odroid Go 16MB binary tasmota32-odroidgo.bin [#8630](https://github.com/arendst/Tasmota/issues/8630)
- Support for ESP32 ``Module 5`` Wireless Tag ETH01 [#9496](https://github.com/arendst/Tasmota/issues/9496)
- Support for ESP32 ``Module 7`` M5stack core2 16MB binary tasmota32-core2.bin [#10635](https://github.com/arendst/Tasmota/issues/10635)
- Berry language on ESP32

See [changelog](https://github.com/arendst/Tasmota/blob/development/CHANGELOG.md) for a complete list of new features, changes and bug fixes.

### Join our communities and chat
See [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota), [Reddit](https://www.reddit.com/r/tasmota/) or [Google Groups](https://groups.google.com/d/forum/sonoffusers) for general chat, feedback, questions and live troubleshooting.

### Report bugs and suggest features
Open a new topic on [Tasmota discussions](https://github.com/arendst/Tasmota/discussions).

Report a bug in [Tasmota issues](https://github.com/arendst/Tasmota/issues).


#### If you like Tasmota
<iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=arendst&repo=tasmota&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe> 
