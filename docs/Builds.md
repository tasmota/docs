There are many available features programmed into Tasmota. Not all devices need all of the available features. ESP based devices have a limited amount of memory available. To ensure that there is enough memory available to flash the firmware, it is best to keep the total size as small as possible, and definitely under 625K total to ensure OTA updates are possible. For this reason, Tasmota makes available the ability to create different firmware binary files to suit each particular device's requirements (e.g., sensors) and each application's needs (e.g., Rules, Timers, etc.). Once features such as support for sensors, rules, timers, etc. is compiled into the firmware binary, the features themselves can be configured at run-time, or, for some features, configured at compile time as well.

Many times one just needs to download a pre-compiled binary and perform the necessary run-time configuration. It is not necessary to compile your own binary if these pre-compiled builds meet your needs. These available files provide a simpler approach to get up and going with Tasmota quickly.

The binary files available on [GitHub](https://github.com/arendst/Tasmota/releases) are for the current master release version only. These master release binaries are also available from the [OTA server](http://thehackbox.org/tasmota/release/). However, the latest development branch code binaries are only available from the [development OTA server](http://thehackbox.org/tasmota/).

Features that are not available in any release build have to be enabled in source code and compiled yourself. Read more about [compiling your own build](Compile-your-build).

## Firmware Variants

- **tasmota.bin**  supports most features. **THIS IS THE RECOMMENDED BINARY**  
  **tasmota-BG.bin** to **tasmota-TW.bin** the same features as _tasmota.bin_ with localized language support. *(Note: tasmota-UK.bin is for the Ukrainian language)*
- **tasmota-sensors.bin** enables the same features as _tasmota.bin_ and includes support for connectable sensors
- **tasmota-lite.bin**  has a stripped down feature set. This reduces the required CPU cycles in order to reduce power draw to allow devices with a weak power supply to run reliably.

!!! note
    This is similar to the pre-compiled Tasmota binary that comes bundled with Tuya-Convert. If you used Tuya-Convert to flash your device, it is strongly recommended to update to `tasmota.bin`. Otherwise some crucial features (e.g., energy monitoring, auto-discovery, etc.) will not work.

- **tasmota-minimal.bin** is a specialised build to subsequently allow OTA uploads. **This version should NOT be used for initial installation!**
- **tasmota-knx.bin** includes [KNX](KNX) support but omits some features. If you need additional features, compile your own firmware (e.g., [Gitpod](Gitpod)  ).
- **tasmota-display.bin**  built for connecting displays but omits some features such as energy monitoring. If you need additional features, compile your own firmware (e.g., [Gitpod](Gitpod)  ).
- [**tasmota-ir.bin**](Tasmota-IR) provides almost all `IRremoteESP8266` protocols. If you need additional features, compile your own firmware (e.g., [Gitpod](Gitpod)) to compile [`ircustom`](Tasmota-IR).

## Available Features and Sensors

| Feature or Sensor | min | lite | tasmota | knx | sensors | ir | display |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| MY_LANGUAGE en-GB     | x | x | x | x | x | x | x |
| ARDUINO_OTA       | - | - | - | - | - | - | - |
| DOMOTICZ          | - | - | x | x | x | x | - |
| HOME_ASSISTANT    | - | - | x | x | x | x | - |
| MQTT_TLS          | - | - | - | - | - | - | - |
| MQTT_TLS_CA_CERT  | - | - | - | - | - | - | - |
| MQTT_AWS_IOT      | - | - | - | - | - | - | - |
| 4K_RSA            | - | - | - | - | - | - | - |
| KNX               | - | - | - | x | - | - | - |
| WEBSERVER         | x | x | x | x | x | x | x |
| JAVASCRIPT_ES6    | - | - | - | - | - | - | - |
| WEBSEND_RESPONSE  | - | - | - | - | - | - | - |
| EMULATION_HUE     | - | x | x | - | x | - | - |
| EMULATION_WEMO    | - | x | x | - | x | - | - |
| DISCOVERY         | - | - | x | x | - | - | x |
| WEBSERVER_ADVERTISE   | - | - | x | x | - | - | x |
| MQTT_HOST_DISCOVERY   | - | - | x | x | - | - | x |
| TIMERS            | - | x | x | x | x | x | x |
| TIMERS_WEB        | - | x | x | x | x | x | x |
| SUNRISE           | - | x | x | x | x | x | x |
| RULES             | - | x | x | x | x | x | x |
| SCRIPT            | - | - | - | - | - | - | - |
| EXPRESSION        | - | - | - | - | - | - | - |
| SUPPORT_IF_STATEMENT  | - | - | - | - | - | - | - |
| HOTPLUG           | - | - | - | - | - | - | - |
| Feature | min | lite | tasmota | knx | sensors | ir | display |
| ROTARY_V1             | - | - | - | - | - | - | - |
| SONOFF_RF         | - | - | x | x | x | - | - |
| RF_FLASH          | - | - | x | x | x | - | - |
| SONOFF_SC         | - | - | x | x | x | - | - |
| TUYA_MCU          | - | x | x | x | x | - | x |
| ARMTRONIX_DIMMERS | - | - | x | x | - | - | - |
| PS_16_DZ          | - | - | x | x | - | - | - |
| SONOFF_IFAN       | - | - | x | x | - | - | - |
| BUZZER            | - | - | x | x | x | - | - |
| ARILUX_RF         | - | - | x | x | - | - | - |
| SHUTTER           | - | - | x | x | - | - | - |
| DEEPSLEEP         | - | - | x | - | x | - | - |
| EXS_DIMMER        | - | - | x | x | - | - | - |
| DEVICE_GROUPS     | - | - | x | - | - | - | - |
| PWM_DIMMER        | - | - | x | x | - | - | - |
| KEELOQ            | - | - | - | - | - | - | - |
| SONOFF_D1         | - | - | x | x | - | - | - |
| Feature     | min | lite | tasmota | knx | sensors | ir | display |
| LIGHT             | - | x | x | x | x | x | x |
| WS2812            | - | - | x | x | x | - | x |
| WS2812_DMA        | - | - | - | - | - | - | - |
| MY92X1            | - | - | x | x | x | - | x |
| SM16716           | - | - | x | x | x | - | x |
| SM2135            | - | - | x | x | x | - | x |
| SONOFF_L1         | - | - | x | x | x | - | x |
| ELECTRIQ_MOODL    | - | - | x | x | x | - | x |
| --- |   |   |   |   |   |   |   |
| ENERGY_SENSOR     | - | x | x | x | x | - | - |
| PZEM004T          | - | - | x | x | x | - | - |
| PZEM_AC           | - | - | x | x | x | - | - |
| PZEM_DC           | - | - | x | x | x | - | - |
| MCP39F501         | - | x | x | x | x | - | - |
| SDM120            | - | - | - | - | x | - | - |
| SDM630            | - | - | - | - | x | - | - |
| DDS2382           | - | - | - | - | x | - | - |
| DDSU666           | - | - | - | - | x | - | - |
| SOLAX_X1          | - | - | - | - | - | - | - |
| LE01MR            | - | - | - | - | - | - | - |
| --- |   |   |   |   |   |   |   |
| ADC_VCC           | x | x | - | - | - | - | - |
| COUNTER           | - | - | x | x | x | x | x |
| DS18x20           | - | - | x | x | x | x | x |
| DHT               | - | - | x | x | x | x | x |
| MAX31855          | - | - | - | - | x | - | - |
| MAX31865          | - | - | - | - | - | - | - |
| Feature | min | lite | tasmota | knx | sensors | ir | display |
| I2C               | - | - | x | x | x | - | x |
| SHT               | - | - | - | - | x | - | - |
| HTU               | - | - | - | - | x | - | - |
| BMP               | - | - | - | - | x | - | - |
| BME680            | - | - | - | - | x | - | - |
| BH1750            | - | - | - | - | x | - | - |
| VEML6070          | - | - | - | - | x | - | - |
| ADS1115           | - | - | - | - | x | - | - |
| INA219            | - | - | - | - | x | - | - |
| INA226            | - | - | - | - | - | - | - |
| SHT3X             | - | - | - | - | x | - | - |
| TSL2561           | - | - | - | - | x | - | - |
| TSL2591           | - | - | - | - | - | - | - |
| MGS               | - | - | - | - | x | - | - |
| SGP30             | - | - | - | - | x | - | - |
| SI1145            | - | - | - | - | - | - | - |
| LM75AD            | - | - | - | - | x | - | - |
| APDS9960          | - | - | - | - | - | - | - |
| MCP230xx          | - | - | - | - | - | - | - |
| PCA9685           | - | - | - | - | - | - | - |
| MPR121            | - | - | - | - | - | - | - |
| CCS811            | - | - | - | - | x | - | - |
| MPU6050           | - | - | - | - | - | - | - |
| DS3231            | - | - | - | - | - | - | - |
| MGC3130           | - | - | - | - | - | - | - |
| MAX44009          | - | - | - | - | - | - | - |
| SCD30             | - | - | - | - | x | - | - |
| SPS30             | - | - | - | - | - | - | - |
| ADE7953           | - | - | x | x | x | - | x |
| VL53L0X           | - | - | - | - | - | - | - |
| MLX90614          | - | - | - | - | - | - | - |
| CHIRP             | - | - | - | - | - | - | - |
| PAJ7620           | - | - | - | - | - | - | - |
| PCF8574           | - | - | - | - | - | - | - |
| HIH6              | - | - | - | - | x | - | - |
| DHT12             | - | - | - | - | x | - | - |
| DS1624            | - | - | - | - | x | - | - |
| AHT1x             | - | - | - | - | - | - | - |
| HDC1080           | - | - | - | - | - | - | - |
| WEMOS_MOTOR_V1    | - | - | - | - | x | - | - |
| Feature | min | lite | tasmota | knx | sensors | ir | display |
| SPI               | - | - | - | - | - | - | x |
| MHZ19             | - | - | - | - | x | - | - |
| SENSEAIR          | - | - | - | - | x | - | - |
| PMS5003           | - | - | - | - | x | - | - |
| NOVA_SDS          | - | - | - | - | x | - | - |
| HPMA              | - | - | - | - | x | - | - |
| SERIAL_BRIDGE     | - | - | x | x | x | - | x |
| MP3_PLAYER        | - | - | - | - | x | - | - |
| AZ7798            | - | - | - | - | - | - | - |
| PN532_HSU         | - | - | - | - | x | - | - |
| RDM6300           | - | - | - | - | x | - | - |
| IBEACON           | - | - | - | - | x | - | - |
| GPS               | - | - | - | - | - | - | - |
| HM10              | - | - | - | - | x | - | - |
| HRXL              | - | - | - | - | x | - | - |
| --- |   |   |   |   |   |   |   |
| NRF24             | - | - | - | - | - | - | - |
| MIBLE             | - | - | - | - | - | - | - |
| ZIGBEE            | - | - | - | - | - | - | - |
| --- |   |   |   |   |   |   |   |
| IR_REMOTE         | - | - | x | x | x | x | x |
| IR_RECEIVE        | - | - | x | x | x | x | x |
| IR_REMOTE_FULL    | - | - | - | - | - | x | - | 
| --- |   |   |   |   |   |   |   |
| SR04              | - | - | - | - | x | - | - |
| TM1638            | - | - | - | - | x | - | - |
| HX711             | - | - | - | - | x | - | - |
| TX2x_WIND_SENSOR  | - | - | - | - | - | - | - |
| RC_SWITCH         | - | - | - | - | x | - | - |
| RF_SENSOR         | - | - | - | - | x | - | - |
| HRE               | - | - | - | - | x | - | - |
| A4988_STEPPER     | - | - | - | - | - | - | - |
| TASMOTA_SLAVE     | - | - | - | - | - | - | - | 
| Feature | min | lite | tasmota | knx | sensors | ir | display |
| DISPLAY           | - | - | - | - | - | - | x |
| DISPLAY_LCD       | - | - | - | - | - | - | x |
| DISPLAY_SSD1306   | - | - | - | - | - | - | x |
| DISPLAY_MATRIX    | - | - | - | - | - | - | x |
| DISPLAY_SH1106    | - | - | - | - | - | - | x |
| DISPLAY_ILI9341   | - | - | - | - | - | - | x |
| DISPLAY_EPAPER_29 | - | - | - | - | - | - | x |
| DISPLAY_EPAPER_42 | - | - | - | - | - | - | x |
| DISPLAY_ILI9488   | - | - | - | - | - | - | - |
| DISPLAY_SSD1351   | - | - | - | - | - | - | - |
| DISPLAY_RA8876    | - | - | - | - | - | - | - |
