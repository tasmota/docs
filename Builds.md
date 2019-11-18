There are many available features programmed into Tasmota. Not all devices need all of the available features. ESP based devices have a limited amount of memory available. To ensure that there is enough memory available to flash the firmware, it is best to keep the total size as small as possible, and definitely under 625K total to ensure OTA updates are possible. For this reason, Tasmota makes available the ability to create different firmware binary files to suit each particular device's requirements (e.g., sensors) and each application's needs (e.g., Rules, Timers, etc.). Once features such as support for sensors, rules, timers, etc. is compiled into the firmware binary, the features themselves can be configured at run-time, or, for some features, configured at compile time as well.

Many times one just needs to download a pre-compiled binary and perform the necessary run-time configuration. It is not necessary to compile your own binary if these pre-compiled builds meet your needs. These available files provide a simpler approach to get up and going with Tasmota quickly.

The binary files available on [GitHub](https://github.com/arendst/Tasmota/releases) are for the current master release version only. These master release binaries are also available from the [OTA server](http://thehackbox.org/tasmota/release/). However, the latest development branch code binaries are only available from the [OTA server](http://thehackbox.org/tasmota/).

Features that are not available in any release build have to be enabled in source code and compiled yourself. Read more about [compiling your own build](compile-your-build).

## Firmware Variants
- **tasmota.bin** *(sonoff)* supports most features. **THIS IS THE RECOMMENDED BINARY**  
  **tasmota-BG.bin** to **tasmota-TW.bin** the same features as _tasmota.bin_ with localized language support. *(Note: tasmota-UK.bin is for the Ukrainian language)*
- **tasmota-basic.bin** *(bas)* addresses a problem with some Sonoff Basics that lack sufficient electrical power (due to its poor design) to properly run the electronics. In this firmware variant, most sensors are disabled to minimize background tasks. This reduces the required CPU cycles in order to reduce power draw to allow the device to run reliably.
  >This is the pre-compiled Tasmota binary that comes bundled within the Tuya-Convert package when you install their OTA flashing tool. If you used Tuya-Convert to flash your device, it is strongly recommended to update to `tasmota.bin`. Otherwise some crucial features (e.g., energy monitoring, auto-discovery, etc.) will not work.
- **tasmota-classic.bin** **!DISCONTINUED SINCE v6.7.0!** *(cla)* stripped down version but it allows initial installation using either [Wi-Fi Manager](Initial-Configuration#configure-wi-fi), [WPS](https://en.wikipedia.org/wiki/Wi-Fi_Protected_Setup) or [ESP8266 SmartConfig](http://techiesms.com/iot-projects/now-no-need-enter-ssid-name-password-inside-code-esp8266-smart-config/).
- **tasmota-minimal.bin** *(min)* is a specialised build to subsequently allow OTA uploads. ***This version should NOT be used for initial installation!***
- **tasmota-sensors.bin** *(sns)* enables the same features as _tasmota.bin_ and includes support for additional sensors
- **tasmota-knx.bin** *(knx)* includes [KNX](KNX-Features) support but omits some features. If you need additional features, compile your own firmware (e.g., [Gitpod](Compiling-Tasmota-on-Gitpod)).
- **tasmota-display.bin** *(dsp)* built for connecting displays but omits some features such as energy monitoring. If you need additional features, compile your own firmware (e.g., [Gitpod](Compiling-Tasmota-on-Gitpod)).
- [**tasmota-ir.bin**](Tasmota-IR) *(ir)* provides almost all `IRremoteESP8266` protocols. If you need additional features, compile your own firmware (e.g., [Gitpod](Compiling-Tasmota-on-Gitpod)) to compile [`ircustom`](Tasmota-IR).

|Feature/Sensor|sonoff|bas|cla|min|sns|knx|dsp|ir|
|-|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|LANGUAGEen-GB|✓|✓|✓|✓|✓|✓|✓|✓|
|WPS|-|-|✓|-|-|-|-|-|
|SMARTCONFIG|-|-|✓|-|-|-|-|-|
|ARDUINO_OTA|-|-|-|-|-|-|-|-|
|DOMOTICZ|✓|-|✓|-|✓|✓|-|✓|
|HOME_ASSISTANT|✓|-|-|-|✓|✓|-|✓|
|MQTT_TLS|-|-|-|-|-|-|-|-|
|KNX|-|-|-|-|-|✓|-|-|
|WEBSERVER|✓|✓|✓|✓|✓|✓|✓|✓|
|EMULATION|✓|✓|✓|-|✓|-|-|-|
|DISCOVERY|✓|-|✓|-|✓|✓|✓|-|
|WEBSERVER_ADVERTISE|-|-|-|-|-|-|-|-|
|MQTT_DISCOVERY|✓|-|✓|-|✓|✓|✓|-|
|TIMERS|✓|✓|-|-|✓|✓|✓|✓|
|TIMERS_WEB|✓|✓|-|-|✓|✓|✓|✓|
|SUNRISE|✓|✓|-|-|✓|✓|✓|✓|
|RULES|✓|✓|-|-|✓|✓|✓|✓|
|EXPRESSION|-|-|-|-|-|-|-|-|
|**Feature/Sensor**|**sonoff**|**bas**|**cla**|**min**|**sns**|**knx**|**dsp**|**ir**|
|ADC_VCC|✓|✓|✓|✓|-|✓|✓|-|
|DS18B20|-|-|-|-|-|-|-|-|
|DS18x20|✓|-|✓|-|✓|✓|✓|-|
|I2C|✓|-|-|-|✓|✓|✓|-|
|DHT|✓|-|-|-|✓|✓|✓|✓|
|SHT|✓|-|-|-|✓|✓|✓|-|
|HTU|✓|-|-|-|✓|✓|✓|-|
|BMP|✓|-|-|-|✓|✓|✓|-|
|BME680|-|-|-|-|✓|-|-|-|
|BH1750|✓|-|-|-|✓|✓|✓|-|
|VEML6070|-|-|-|-|✓|-|-|-|
|ADS1115|-|-|-|-|✓|-|-|-|
|ADS1115_I2CDEV|-|-|-|-|-|-|-|-|
|INA219|-|-|-|-|✓|-|-|-|
|SHT3X|✓|-|-|-|✓|✓|✓|-|
|TSL2561|-|-|-|-|✓|-|-|-|
|MGS|-|-|-|-|✓|-|-|-|
|SGP30|✓|-|-|-|✓|✓|✓|-|
|SI1145|-|-|-|-|-|-|-|-|
|**Feature/Sensor**|**sonoff**|**bas**|**cla**|**min**|**sns**|**knx**|**dsp**|**ir**|
|LM75AD|✓|-|-|-|✓|✓|✓|-|
|APDS9960|-|-|-|-|-|-|-|-|
|MCP230xx|-|-|-|-|-|-|-|-|
|PCA9685|-|-|-|-|-|-|-|-|
|MPR121|-|-|-|-|-|-|-|-|
|CCS811|-|-|-|-|-|-|-|-|
|MPU6050|-|-|-|-|-|-|-|-|
|DS3231|-|-|-|-|-|-|-|-|
|MGC3130|-|-|-|-|-|-|-|-|
|MAX44009|-|-|-|-|-|-|-|-|
|SCD30|-|-|-|-|✓|-|-|-|
|SPI|-|-|-|-|-|-|✓|-|
|MHZ19|✓|-|-|-|✓|✓|✓|-|
|SENSEAIR|✓|-|-|-|✓|✓|✓|-|
|PMS5003|✓|-|-|-|✓|✓|✓|-|
|NOVA_SDS|✓|-|-|-|✓|✓|✓|-|
|ENERGY_SENSOR|✓|✓|✓|-|✓|✓|-|-|
|PZEM004T|✓|-|-|-|✓|✓|-|-|
|PZEM_AC|✓|-|-|-|✓|✓|-|-|
|**Feature/Sensor**|**sonoff**|**bas**|**cla**|**min**|**sns**|**knx**|**dsp**|**ir**|
|PZEM_DC|✓|-|-|-|✓|✓|-|-|
|MCP39F501|✓|✓|-|-|✓|✓|-|-|
|SERIAL_BRIDGE|✓|-|-|-|✓|✓|✓|-|
|SDM120|-|-|-|-|✓|-|-|-|
|SDM630|-|-|-|-|✓|-|-|-|
|MP3_PLAYER|-|-|-|-|✓|-|-|-|
|TUYA_DIMMER|✓|✓|-|-|✓|✓|✓|-|
|ARMTRONIX_DIMMERS|✓|✓|-|-|✓|✓|✓|-|
|PS_16_DZ|✓|✓|-|-|✓|✓|✓|-|
|AZ7798|-|-|-|-|-|-|-|-|
|PN532_HSU|-|-|-|-|✓|-|-|-|
|IR_REMOTE|✓|-|-|-|✓|✓|✓|✓|
|IR_HVAC|-|-|-|-|✓|-|-|✓|
|IR_RECEIVE|✓|-|-|-|✓|✓|✓|✓|
|WS2812|✓|-|✓|-|✓|✓|✓|-|
|WS2812_DMA|-|-|-|-|-|-|-|-|
|ARILUX_RF|✓|-|-|-|✓|✓|-|-|
|SHUTTER|-|-|-|-|-|-|-|-|
|DEEPSLEEP|-|-|-|-|-|-|-|-|
|EXS_DIMMER|-|-|-|-|-|-|-|-|
|SR04|✓|-|-|-|✓|✓|✓|-|
|TM1638|-|-|-|-|✓|-|-|-|
|**Feature/Sensor**|**sonoff**|**bas**|**cla**|**min**|**sns**|**knx**|**dsp**|**ir**|
|HX711|✓|-|-|-|✓|✓|✓|-|
|RF_FLASH|✓|-|-|-|✓|✓|-|-|
|TX20_WIND_SENSOR|✓|-|-|-|✓|✓|✓|-|
|RC_SWITCH|-|-|-|-|✓|-|-|-|
|RF_SENSOR|-|-|-|-|✓|-|-|-|
|SM16716|✓|✓|✓|-|✓|✓|✓|-|
|DISPLAY|-|-|-|-|-|-|✓|-|
|DISPLAY_LCD|-|-|-|-|-|-|✓|-|
|DISPLAY_SSD1306|-|-|-|-|-|-|✓|-|
|DISPLAY_MATRIX|-|-|-|-|-|-|✓|-|
|DISPLAY_ILI9341|-|-|-|-|-|-|✓|-|
|DISPLAY_EPAPER|-|-|-|-|-|-|✓|-|