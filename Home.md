<img src="https://raw.githubusercontent.com/arendst/Tasmota/development/tools/logo/TASMOTA_FullLogo_Vector.svg" alt="Tasmota Logo"></img>

<img src="https://user-images.githubusercontent.com/5904370/55973675-661c1400-5c86-11e9-8453-0082bfcd61b6.png" width="200" align="right"> </img>
### Open-source operating system for ESP8266

### Features
- Easy [initial setup](initial-configuration)
- [Browser interface](webui) for configuration and control
- Firmware [updates](Upgrading) via OTA or web UI
- [Rules](Rules), [Timers](commands#Timers) or [Scripts](scripting-language) for automation
- Control with [web UI](commands#console-in-web-ui), [MQTT](MQTT), [web requests](commands#web) or [serial terminal](commands#serial)
- Easy configuration of devices using [Templates](Templates)
- Connect [components](components) ([switches](Buttons-and-Switches), [sensors](Peripherals), [displays](displays),...)
- Easy integration in home automation solutions such as [openHAB](https://www.openhab.org/), [Home Assistant](https://www.home-assistant.io/), [Domoticz](http://www.domoticz.com/) and [more](Integrations)
- Wemo and Hue emulation for [Amazon Alexa](Alexa) support
- [KNX](KNX-features) IP protocol support

### How to start
You will need [some tools](Prerequisites) to [prepare](Hardware-preparation) your device for [flashing](Flashing) Tasmota and [connect](initial-configuration) it to your Wi-Fi network and [MQTT](MQTT) broker.

## News
<img src="https://user-images.githubusercontent.com/5904370/55974399-d4ada180-5c87-11e9-99cc-316220bf5e95.png" align="right" width=200></img>

**2019-11-15**   
We present the official Tasmota firmware flashing tool:  
   
[<img src="https://raw.githubusercontent.com/tasmota/tasmota-pyflasher/v1/images/splash.png" width=300></img>](https://github.com/tasmota/tasmota-pyflasher) 

**2019-10-26**    
[Tasmota v6.7.1 Allison](../releases/tag/v6.7.1) releases with a fix for the bug causing serious issues in power monitoring devices. 

**2019-10-25**    
[Tasmota v6.7.0](../releases/tag/v6.7.0) is released bringing support for [blind and shutters](Commands#blinds-shutters-and-roller-shades), [deep sleep and wake up pin](DeepSleep). [Tuya component](tuyamcu) is more customisable supporting a wider range of devices and a plethora of new sensors. Support for [Zigbee](https://github.com/arendst/Tasmota/wiki/Zigbee) devices is in a nascent stage of development.    
Besides that there are bug fixes and improvements and on top of all that: better support for iFan03, Shelly 2.5, a rewrite of the light driver and the default Arduino core is now pre2.6. Last, but not least, the new tasmota-ir.bin build that has fully featured IR support but at the cost of other features.

_In with the new, out with the old!_    
Some outdated features have been removed so wave goodbye to: WPS, SmartConfig, tasmota-classic.bin build and Setoptions 2, 34, 41, 44, 45, 46, 65, 66 and 69

**2019-10-10**    
Tasmota development branch is undergoing a big code rewrite of the light driver. Some things might break in the process, be aware of that if you're installing the daily build on a critical device and make sure to report any [issues](https://github.com/arendst/Tasmota/issues).

## Community
See [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota) or [Community Forum](https://groups.google.com/d/forum/sonoffusers) for feedback, questions and troubleshooting.