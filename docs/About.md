!!! danger "If you don't have the willingness to tinker and learn... TURN BACK!."
    Tasmota is not a commercial product and support is limited. You have to be willing to research and solve potential problems yourself. 

![Tasmota logo](_media/logo-blue.png)

Tasmota is an open source firmware for [ESP8266](https://en.wikipedia.org/wiki/ESP8266) based devices created and maintained by [Theo Arendst](https://github.com/arendst). 

Everything began as [Sonoff-MQTT-OTA](https://github.com/arendst/Sonoff-MQTT-OTA) with a [commit](https://github.com/arendst/Sonoff-MQTT-OTA/commit/9d4c0c60dc7ca8c24cf562a932f263d76f664473) on 25th January 2016. by Theo Arendst. Its goal was to provide ESP8266 based [ITEAD Sonoff](https://www.itead.cc/sonoff-wifi-wireless-switch.html) devices with MQTT and 'Over the Air' or OTA firmware. 

What started as a simple way to hack a cloud bound Sonoff Basic (one of the first cheap and accessible smart home devices in the market) into a locally controlled device has grown into a fully fledged ecosystem for virtually any ESP8266 based device.

## Contribute
**Any contribution helps our team and makes Tasmota better for the entire community!**

Everybody is welcome and invited to contribute to Tasmota Project by:

- providing Pull Requests (Features, Proof of Concepts, Language files or Fixes)
- testing new released features and report issues
- donating to acquire hardware for testing and implementing or out of gratitude
- contributing missing [documentation](Contributing.md) for features and devices

## Credits

People helping to keep the show on the road:

- David Lang providing initial issue resolution and code optimizations
- Heiko Krupp for his IRSend, HTU21, SI70xx and Wemo/Hue emulation drivers
- Wiktor Schmidt for Travis CI implementation
- Thom Dietrich for PlatformIO optimizations
- Marinus van den Broek for his EspEasy groundwork
- Pete Ba for more user friendly energy monitor calibration
- Lobradov providing compile optimization tips
- Flexiti for his initial timer implementation
- reloxx13 for his [TasmoAdmin](https://github.com/reloxx13/TasmoAdmin) management tool
- Joachim Banzhaf for his TSL2561 library and driver
- Gijs Noorlander for his MHZ19, SenseAir and updated PubSubClient drivers
- Erik Montnemery for his HomeAssistant Discovery concept and many code tuning tips
- Federico Leoni for continued HomeAssistant Discovery support
- Aidan Mountford for his HSB support
- Daniel Ztolnai for his Serial Bridge implementation
- Gerhard Mutz for multiple sensor & display drivers, Sunrise/Sunset, and scripting
- Nuno Ferreira for his HC-SR04 driver
- Adrian Scillato for his (security) fixes and implementing and maintaining KNX
- Gennaro Tortone for implementing and maintaining Eastron drivers
- Raymond Mouthaan for managing Wemos Wiki information
- Norbert Richter for his [decode-config.py](https://github.com/tasmota/decode-config) tool
- Andre Thomas for providing [thehackbox](http://thehackbox.org/tasmota/) OTA support and daily development builds
- Joel Stein, digiblur and Shantur Rathore for their Tuya research and driver
- Frogmore42 for providing many issue answers
- Jason2866 for platformio support and providing many issue answers
- Blakadder for managing the new document site and providing template management
- Stephan Hadinger for refactoring light driver, enhancing HueEmulation and Zigbee support
- tmo for designing the official Tasmota logo
- Stefan Bode for his Shutter and Deep sleep drivers
- Jacek Ziółkowski for his [TDM](https://github.com/jziolkowski/tdm) management tool and [Tasmotizer](https://github.com/tasmota/tasmotizer) flashing tool
- Christian Staars for NRF24L01 and HM-10 Bluetooth sensor support
- Paul Diem for UDP Group communication support
- Jörg Schüler-Maroldt for his initial ESP32 port
- Many more providing Tips, Wips, Pocs, PRs and Donations

## License

This program is licensed under GPL-3.0
