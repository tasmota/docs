There are many available features programmed into Tasmota. Not all devices need all of the available features. ESP based devices have a limited amount of memory available. To ensure that there is enough memory available to flash the firmware, it is best to keep the total size as small as possible, and definitely under 625K total to ensure OTA updates are possible. For this reason, Tasmota makes available the ability to create different firmware binary files to suit each particular device's requirements (e.g., sensors) and each application's needs (e.g., Rules, Timers, etc.). Once features such as support for sensors, rules, timers, etc. is compiled into the firmware binary, the features themselves can be configured at run-time, or, for some features, configured at compile time as well.

Many times one just needs to download a pre-compiled binary and perform the necessary run-time configuration. It is not necessary to compile your own binary if these pre-compiled builds meet your needs. These available files provide a simpler approach to get up and going with Tasmota quickly.

The binary files available on [GitHub](https://github.com/arendst/Tasmota/releases) are for the current master release version only. These master release binaries are also available from the [OTA server](http://thehackbox.org/tasmota/release/). However, the latest development branch code binaries are only available from the [OTA server](http://thehackbox.org/tasmota/).

Features that are not available in any release build have to be enabled in source code and compiled yourself. Read more about [compiling your own build](Compile-your-build).

## Firmware Variants

- **tasmota.bin**  supports most features. **THIS IS THE RECOMMENDED BINARY**  
  **tasmota-BG.bin** to **tasmota-TW.bin** the same features as _tasmota.bin_ with localized language support. *(Note: tasmota-UK.bin is for the Ukrainian language)*
- **tasmota-sensors.bin** enables the same features as _tasmota.bin_ and includes support for connectable sensors
- **tasmota-lite.bin**  has a stripped down feature set. This reduces the required CPU cycles in order to reduce power draw to allow devices with a weak power supply to run reliably.

!!! note
    This is similar to the pre-compiled Tasmota binary that comes bundled within the Tuya-Convert package when you install their OTA flashing tool. If you used Tuya-Convert to flash your device, it is strongly recommended to update to `tasmota.bin`. Otherwise some crucial features (e.g., energy monitoring, auto-discovery, etc.) will not work.

- **tasmota-minimal.bin** is a specialised build to subsequently allow OTA uploads. **This version should NOT be used for initial installation!**
- **tasmota-knx.bin** includes [KNX](integrations/KNX) support but omits some features. If you need additional features, compile your own firmware (e.g., [Gitpod](Gitpod)  ).
- **tasmota-display.bin**  built for connecting displays but omits some features such as energy monitoring. If you need additional features, compile your own firmware (e.g., [Gitpod](Gitpod)  ).
- [**tasmota-ir.bin**](Tasmota-IR) provides almost all `IRremoteESP8266` protocols. If you need additional features, compile your own firmware (e.g., [Gitpod](Gitpod)) to compile [`ircustom`](Tasmota-IR).

## Available Features and Sensors

| Feature or Sensor | min | lite | tasmota | knx | sensors | ir | display |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| MY_LANGUAGE en-GB     | x | x | x | x | x | x | x |
| USE_ARDUINO_OTA       | - | - | - | - | - | - | - |
| USE_DOMOTICZ          | - | - | x | x | x | x | - |
| USE_HOME_ASSISTANT    | - | - | x | x | x | x | - |
| USE_MQTT_TLS          | - | - | - | - | - | - | - |
| USE_MQTT_TLS_CA_CERT  | - | - | - | - | - | - | - |
| USE_MQTT_AWS_IOT      | - | - | - | - | - | - | - |
| USE_4K_RSA            | - | - | - | - | - | - | - |
| USE_KNX               | - | - | - | x | - | - | - |
| USE_WEBSERVER         | x | x | x | x | x | x | x |
| USE_JAVASCRIPT_ES6    | - | - | - | - | - | - | - |
| USE_WEBSEND_RESPONSE  | - | - | - | - | - | - | - |
| USE_EMULATION_HUE     | - | x | x | - | x | - | - |
| USE_EMULATION_WEMO    | - | x | x | - | x | - | - |
| USE_DISCOVERY         | - | - | x | x | - | - | x |
| WEBSERVER_ADVERTISE   | - | - | x | x | - | - | x |
| MQTT_HOST_DISCOVERY   | - | - | x | x | - | - | x |
| USE_TIMERS            | - | x | x | x | x | x | x |
| USE_TIMERS_WEB        | - | x | x | x | x | x | x |
| USE_SUNRISE           | - | x | x | x | x | x | x |
| USE_RULES             | - | x | x | x | x | x | x |
| USE_SCRIPT            | - | - | - | - | - | - | - |
| USE_EXPRESSION        | - | - | - | - | - | - | - |
| SUPPORT_IF_STATEMENT  | - | - | - | - | - | - | - |
| USE_HOTPLUG           | - | - | - | - | - | - | - |
| __Feature or Sensor__ | min | lite | tasmota | knx | sensors | ir | display |
| ROTARY_V1             | - | - | - | - | - | - | - |
| USE_SONOFF_RF         | - | - | x | x | x | - | - |
| USE_RF_FLASH          | - | - | x | x | x | - | - |
| USE_SONOFF_SC         | - | - | x | x | x | - | - |
| USE_TUYA_MCU          | - | x | x | x | x | - | x |
| USE_ARMTRONIX_DIMMERS | - | - | x | x | - | - | - |
| USE_PS_16_DZ          | - | - | x | x | - | - | - |
| USE_SONOFF_IFAN       | - | - | x | x | - | - | - |
| USE_BUZZER            | - | - | x | x | x | - | - |
| USE_ARILUX_RF         | - | - | x | x | - | - | - |
| USE_SHUTTER           | - | - | x | x | - | - | - |
| USE_DEEPSLEEP         | - | - | x | - | x | - | - |
| USE_EXS_DIMMER        | - | - | x | x | - | - | - |
| USE_DEVICE_GROUPS     | - | - | x | - | - | - | - |
| USE_PWM_DIMMER        | - | - | x | x | - | - | - |
| USE_KEELOQ            | - | - | - | - | - | - | - |
| USE_SONOFF_D1         | - | - | x | x | - | - | - |
| __Feature or Sensor__     | min | lite | tasmota | knx | sensors | ir | display |
| USE_LIGHT             | - | x | x | x | x | x | x |
| USE_WS2812            | - | - | x | x | x | - | x |
| USE_WS2812_DMA        | - | - | - | - | - | - | - |
| USE_MY92X1            | - | - | x | x | x | - | x |
| USE_SM16716           | - | - | x | x | x | - | x |
| USE_SM2135            | - | - | x | x | x | - | x |
| USE_SONOFF_L1         | - | - | x | x | x | - | x |
| USE_ELECTRIQ_MOODL    | - | - | x | x | x | - | x |
|                       |   |   |   |   |   |   |   |
| USE_ENERGY_SENSOR     | - | x | x | x | x | - | - |
| USE_PZEM004T          | - | - | x | x | x | - | - |
| USE_PZEM_AC           | - | - | x | x | x | - | - |
| USE_PZEM_DC           | - | - | x | x | x | - | - |
| USE_MCP39F501         | - | x | x | x | x | - | - |
| USE_SDM120            | - | - | - | - | x | - | - |
| USE_SDM630            | - | - | - | - | x | - | - |
| USE_DDS2382           | - | - | - | - | x | - | - |
| USE_DDSU666           | - | - | - | - | x | - | - |
| USE_SOLAX_X1          | - | - | - | - | - | - | - |
| USE_LE01MR            | - | - | - | - | - | - | - |
|                       |   |   |   |   |   |   |   |
| USE_ADC_VCC           | x | x | - | - | - | - | - |
| USE_COUNTER           | - | - | x | x | x | x | x |
| USE_DS18x20           | - | - | x | x | x | x | x |
| USE_DHT               | - | - | x | x | x | x | x |
| USE_MAX31855          | - | - | - | - | x | - | - |
| USE_MAX31865          | - | - | - | - | - | - | - |
| __Feature or Sensor__ | min | lite | tasmota | knx | sensors | ir | display |
| USE_I2C               | - | - | x | x | x | - | x |
| USE_SHT               | - | - | - | - | x | - | - |
| USE_HTU               | - | - | - | - | x | - | - |
| USE_BMP               | - | - | - | - | x | - | - |
| USE_BME680            | - | - | - | - | x | - | - |
| USE_BH1750            | - | - | - | - | x | - | - |
| USE_VEML6070          | - | - | - | - | x | - | - |
| USE_ADS1115           | - | - | - | - | x | - | - |
| USE_INA219            | - | - | - | - | x | - | - |
| USE_INA226            | - | - | - | - | - | - | - |
| USE_SHT3X             | - | - | - | - | x | - | - |
| USE_TSL2561           | - | - | - | - | x | - | - |
| USE_TSL2591           | - | - | - | - | - | - | - |
| USE_MGS               | - | - | - | - | x | - | - |
| USE_SGP30             | - | - | - | - | x | - | - |
| USE_SI1145            | - | - | - | - | - | - | - |
| USE_LM75AD            | - | - | - | - | x | - | - |
| USE_APDS9960          | - | - | - | - | - | - | - |
| USE_MCP230xx          | - | - | - | - | - | - | - |
| USE_PCA9685           | - | - | - | - | - | - | - |
| USE_MPR121            | - | - | - | - | - | - | - |
| USE_CCS811            | - | - | - | - | x | - | - |
| USE_MPU6050           | - | - | - | - | - | - | - |
| USE_DS3231            | - | - | - | - | - | - | - |
| USE_MGC3130           | - | - | - | - | - | - | - |
| USE_MAX44009          | - | - | - | - | - | - | - |
| USE_SCD30             | - | - | - | - | x | - | - |
| USE_SPS30             | - | - | - | - | - | - | - |
| USE_ADE7953           | - | - | x | x | x | - | x |
| USE_VL53L0X           | - | - | - | - | - | - | - |
| USE_MLX90614          | - | - | - | - | - | - | - |
| USE_CHIRP             | - | - | - | - | - | - | - |
| USE_PAJ7620           | - | - | - | - | - | - | - |
| USE_PCF8574           | - | - | - | - | - | - | - |
| USE_HIH6              | - | - | - | - | x | - | - |
| USE_DHT12             | - | - | - | - | x | - | - |
| USE_DS1624            | - | - | - | - | x | - | - |
| USE_AHT1x             | - | - | - | - | - | - | - |
| USE_HDC1080           | - | - | - | - | - | - | - |
| USE_WEMOS_MOTOR_V1    | - | - | - | - | x | - | - |
| __Feature or Sensor__ | min | lite | tasmota | knx | sensors | ir | display |
| USE_SPI               | - | - | - | - | - | - | x |
| USE_MHZ19             | - | - | - | - | x | - | - |
| USE_SENSEAIR          | - | - | - | - | x | - | - |
| USE_PMS5003           | - | - | - | - | x | - | - |
| USE_NOVA_SDS          | - | - | - | - | x | - | - |
| USE_HPMA              | - | - | - | - | x | - | - |
| USE_SERIAL_BRIDGE     | - | - | x | x | x | - | x |
| USE_MP3_PLAYER        | - | - | - | - | x | - | - |
| USE_AZ7798            | - | - | - | - | - | - | - |
| USE_PN532_HSU         | - | - | - | - | x | - | - |
| USE_RDM6300           | - | - | - | - | x | - | - |
| USE_IBEACON           | - | - | - | - | x | - | - |
| USE_GPS               | - | - | - | - | - | - | - |
| USE_HM10              | - | - | - | - | x | - | - |
| USE_HRXL              | - | - | - | - | x | - | - |
|                       |   |   |   |   |   |   |   |
| USE_NRF24             | - | - | - | - | - | - | - |
| USE_MIBLE             | - | - | - | - | - | - | - |
| USE_ZIGBEE            | - | - | - | - | - | - | - |
|                       |   |   |   |   |   |   |   |
| USE_IR_REMOTE         | - | - | x | x | x | x | x |
| USE_IR_RECEIVE        | - | - | x | x | x | x | x |
| USE_IR_REMOTE_FULL    | - | - | - | - | - | x | - | 
|                       |   |   |   |   |   |   |   |
| USE_SR04              | - | - | - | - | x | - | - |
| USE_TM1638            | - | - | - | - | x | - | - |
| USE_HX711             | - | - | - | - | x | - | - |
| USE_TX2x_WIND_SENSOR  | - | - | - | - | - | - | - |
| USE_RC_SWITCH         | - | - | - | - | x | - | - |
| USE_RF_SENSOR         | - | - | - | - | x | - | - |
| USE_HRE               | - | - | - | - | x | - | - |
| USE_A4988_STEPPER     | - | - | - | - | - | - | - |
| USE_TASMOTA_SLAVE     | - | - | - | - | - | - | - | 
| __Feature or Sensor__ | min | lite | tasmota | knx | sensors | ir | display |
| USE_DISPLAY           | - | - | - | - | - | - | x |
| USE_DISPLAY_LCD       | - | - | - | - | - | - | x |
| USE_DISPLAY_SSD1306   | - | - | - | - | - | - | x |
| USE_DISPLAY_MATRIX    | - | - | - | - | - | - | x |
| USE_DISPLAY_SH1106    | - | - | - | - | - | - | x |
| USE_DISPLAY_ILI9341   | - | - | - | - | - | - | x |
| USE_DISPLAY_EPAPER_29 | - | - | - | - | - | - | x |
| USE_DISPLAY_EPAPER_42 | - | - | - | - | - | - | x |
| USE_DISPLAY_ILI9488   | - | - | - | - | - | - | - |
| USE_DISPLAY_SSD1351   | - | - | - | - | - | - | - |
| USE_DISPLAY_RA8876    | - | - | - | - | - | - | - |
