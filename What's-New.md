See [development build changelog](https://github.com/arendst/Tasmota/blob/development/tasmota/_changelog.ino) for planned features.
## Version 6.7.1 20191026
* Fix on energy monitoring devices using PowerDelta Exception0 with epc1:0x4000dce5 = Divide by zero (#6750)
* Fix Script array bug (#6751)
## Version 6.7.0 20191025
* Remove support for WPS and SmartConfig in favour of Web server (!) based WifiManager [#6680](#6680)
* Remove binary sonoff-classic (#6680)
* Remove command SetOption2
* Remove default DS18B20 driver and only support define USE_DS18x20 (#6647)
* Remove support for define USE_DS18x20_LEGACY and legacy DS18x20 driver (#6486)
* Replace xsns_23_sdm120 with xnrg_08_sdm120
* Replace xsns_25_sdm630 with xnrg_10_sdm630
* Replace xsns_49_solaxX1 with xnrg_12_solaxX1 (#6677)
* Change Sonoff L1 support by adding define USE_SONOFF_L1
* Change light drivers internals to ease management
* Change command PulseTime JSON message format and allow display of all pulsetimer information (#6519)
* Change command SetOption43 to make it more general. Now supports PS_16_DZ driver too (#6544)
* Change command handling by moving buffers up in chain solving MQTTlog support (#6529)
* Change commands Var and Mem to show all parameters when no index is given (#6107)
* Change detection of non-MQTT commands by allowing non-space characters as delimiter (#6540)
* Change rename "Data" to "Hash" and limit to 32 bits when receiving UNKNOWN IR protocol (see DECODE_HASH from IRremoteESP8266)
* Change JSON output format for commands Adc, Adcs, Modules, Gpio and Gpios from list to dictionary (#6407)
* Change energy sensors for three phase/channel support
* Change Settings crc calculation allowing short term backward compatibility
* Change Improve reliability of TasmotaSerial at 115200 bauds and reduce IRAM usage
* Change Tuya support by Shantur Rathore removing tuya related commands SetOption34, 41, 44, 45, 46, 65, 66 and 69 (#6353)
* Change theoretical baudrate range to 300..19660500 bps in 300 increments (#6294)
* Change Settings area to 4k for future use
* Change some table locations from RAM to Flash
* Change filename of configuration backup from using FriendlyName1 to Hostname solving diacritic issues (#2422)
* Change Store AWS IoT Private Key and Certificate in SPI Flash avoiding device-specific compilations
* Change defines USE_TX20_WIND_SENSOR and USE_RC_SWITCH in my_user_config.h to disable to lower iram usage enabling latest core compilation (#6060, #6062)
* Fix handling of ligth channels when pwm_multichannel (SetOption68) is enabled
* Fix better handling of PWM White Temperature mode for Module 48 (#6534)
* Fix TasmotaSerial: move serial send to IRAM for high speed baud rates
* Fix Domoticz battery level set to 100 if define USE_ADC_VCC is not used (#6033)
* Fix Force Elliptic Curve for Letsencrypt TLS #6042
* Fix WeMo emulation for 1G echo and 2G echo dot (#6086)
* Fix Xiaomi Philips brightness (#6091)
* Add support for EX-Store WiFi Dimmer V4 (#5856)
* Add support for Arduino serial connection (EXPERIMENTAL)
* Add support for Zigbee devices Xiaomi lumi.weather air quality sensor, Osram mini-switch
* Add support for Zigbee device cc2530 initialization and basic ZCL decoding
* Add support for PMS3003 dust particle sensor
* Add support for Chint DDSU666 Modbus energy meter by Pablo Zerón
* Add support for SM2135 as used in Action LSC Smart Led E14 (#6495)
* Add support for Shelly 2.5 dual energy (#6160)
* Add support for shutters by Stefan Bode (#288)
* Add support for PCF8574 I2C I/O Expander (currently output only) by Stefan Bode
* Add support for up to three PZEM-014/-016 on one serial modbus connection with addresses 1 (default), 2 and 3 (#2315)
* Add support for up to three PZEM-004T on one serial connection with addresses 192.168.1.1 (default), 2 and 3 (#2315)
* Add support for up to three PZEM-003/-017 on one serial modbus connection with addresses 1 (default), 2 and 3 (#2315)
* Add support for up to 4 INA226 Voltage and Current sensors by Steve Rogers (#6342)
* Add support for A4988 stepper-motor-driver-circuit by Tim Leuschner (#6370)
* Add support for Hiking DDS238-2 Modbus energy meter by Matteo Campanella (#6384)
* Add support for HM17 bluetooth LE passive scan of ibeacon devices by Gerhard Mutz
* Add support for Solax X1 inverter by Pablo Zerón
* Add support for PAJ7620 gesture sensor by Christian Baars
* Add support for MAX31865 Thermocouple sensor by Alberto Lopez Siemens
* Add support for RDM6300 125kHz RFID Reader by Gerhard Mutz
* Add support for CHIRP soil moisture sensor by Christian Baars
* Add support for Sonoff iFan03 as module 71 (#5988)
* Add support for a buzzer
* Add support for IRSend long press ('repeat' feature from IRRemoteESP8266) (#6074)
* Add support for IRHVAC Midea/Komeco protocol (#3227)
* Add support for more IRSend protocols enabled in my_user_config.h
* Add support for IRSend Pioneer protocol (#6100)
* Add support for up to 4 INA219 sensors (#6046)
* Add support for I2C display driver SH1106 oled by Gerhard Mutz
* Add support for SPI display drivers epaper 4.2 inch, ILI9488 TFT, SSD1351 Color oled and RA8876 TFT by Gerhard Mutz
* Add command Buzzer with optional parameters ,<duration of beep in 100mS steps>,<duration of silence in 100mS steps> enabled when a buzzer is configured (#5988)
* Add command DimmerRange in Light module to support 2 byte dimming ranges from Tuya
* Add command DisplayHeight to set pixel height on supported devices
* Add command DisplayWidth to set pixel width on supported devices
* Add command EnergyReset4 x,x to initialize total usage for two tarrifs
* Add command EnergyReset5 x,x to initialize total export (or production) for two tarrifs
* Add command Gpio 255/All to show physical GPIO configuration of all non-flash pins (#6407)
* Add command Gpios 255/All to show all available GPIO components (#6407)
* Add command ModuleAddress 1/2/3 to set Pzem module address when a single module is connected (#2315)
* Add command MqttLog <loglevel> for support of MQTT logging (#6498)
* Add command Power0 0/1/2/Off/On/Toggle to control all power outputs at once (#6340)
* Add command PowerDelta 101..32000 for absolute power delta where 101 = 101-100 = 1W, 202 = 202-100 = 102W (#5901)
* Add command Reset 99 to reset bootcount to zero (#684, #6351)
* Add command Sensor29 pin,0/1/2 for OFF/ON/TOGGLE
* Add command Sensor34 8,0 and Sensor34 8,1 to disable/enable JSON message on weight change over 4 gram
* Add command SetOption34 0..255 to set backlog delay. Default value is 200 (mSeconds) (#6562)
* Add command SetOption42 0..255 to set overtemperature (Celsius only) threshold resulting in power off all on energy monitoring devices. Default setting is 90 (#6036)
* Add command SetOption65 0/1 to disable (1) fast power cycle detection fixing unwanted brownout trigger
* Add command SetOption67 0/1 to disable or enable a buzzer as used in iFan03
* Add command SetOption68 0/1 to enable multi-channel PWM instead of a single light (#6134)
* Add command SetOption71 0/1 to switch between different Modbus Active Energy registers on DDS238-2 energy meters (#6531)
* Add command SetOption72 0/1 to switch between software (0) or hardware (1) energy total counter (#6561)
* Add command Time to disable NTP and set UTC time as Epoch value if above 1451602800 (=20160101). Time 0 re-enables NTP (#5279)
* Add command Time 1/2/3 to select JSON time format ISO + Epoch, ISO or Epoch
* Add command Tariff to default to 0 (=disabled) and allowing to set both Standard Time (ST) and Daylight Savings Time (DST) start hour ex. Tariff1 22,23 = Tariff1 (Off-Peak) ST,DST Tariff2 6,7 = Tariff2 (Standard) ST,DST Tariff9 0/1 = Weekend toggle (1 = Off-Peak during weekend)
* Add command WebSensor<sensor number> 0/1 to control display of sensor data in web GUI (#6085)
* Add command ZigbeeRead (#6095)
* Add define USE_DEEPSLEEP and command DeepSleepTime 0 or 10..86400 (seconds) to enter deepsleep mode (#6638)
* Add define USE_ENERGY_MARGIN_DETECTION to disable Energy Margin and Power Limit detection
* Add define USE_ENERGY_POWER_LIMIT to disable Energy Power Limit detection while Energy Margin detection is active
* Add define USE_SONOFF_RF to enable/disable Sonoff Rf support (#6648)
* Add define USE_WS2812_HARDWARE to select hardware type WS2812, WS2812X, WS2813, SK6812, LC8812 or APA106 (DMA mode only)
* Add incremental beeps to Ifan03 remote control fan speed buttons (#6636)
* Add rule support after every command execution like Fanspeed#Data=2 (#6636)
* Add WebUI for multiple, independent PWM channels
* Add JSON array index support to rules evaluation allowing trigger on ENERGY#POWER[2]>0.60 from JSON ..,"Power":[0.00,0.68],.. (#6160)
* Add Full support of all protocols in IRremoteESP8266, to be used on dedicated-IR Tasmota version. Warning: +81k Flash when compiling with USE_IR_REMOTE_FULL
* Add 'sonoff-ir' pre-packaged IR-dedicated firmware and 'sonoff-ircustom' to customize firmware with IR Full protocol support
* Add Tuya Energy monitoring by Shantur Rathore
* Add Domoticz P1 Smart Meter support using energy sensors handled by xdrv_03_energy.ino based on an idea by pablozg
* Add debug compile features using defines DEBUG_TASMOTA_CORE, DEBUG_TASMOTA_DRIVER and DEBUG_TASMOTA_SENSOR. See DEBUG_CORE_LOG example in sonoff.ino and DEBUG_DRIVER_LOG example in xdrv_09_timers.ino
* Add option 0 to Width1 (Marker), Width2 (Second), Width3 (Minute) and Width4 (Hour) disabling display (#6152)
* Add MqttCount metric to STATE (#6155)
* Add allow repeat/longpress for IRSend raw, introduced IRSend<r> option (#6074)
* Add Oled reset GPIO option "OLED reset"
* Add blend RGB leds with White leds for better whites (#5895, #5704)
* Add AZ7798 automatic setting of clock display (#6034)
* Add Epoch and UptimeSec to JSON messages (#6068)

## Version 6.6 20190707
 * Remove support of TLS on core 2.3.0 and extend support on core 2.4.2 and higher
 * Remove MQTT uptime message every hour
 * Refactor TLS based on BearSSL - **warning** breaking change for TLS fingerprint validation
 * Refactor management of lights
 * Refactor double to float for substantial program size reduction
 * Add Shelly 2.5 and Shelly 1PM support
 * Improved power monitoring device startup and data checks
 * Enhanced Hue emulation
 * Add control for LED components extending LED power control
 * Add support for AWS IoT with TLS 1.2 on core 2.4.2 and up
 * Add support for Badger HR-E Water Meter (#5539)
 * Add support for optional scripting language alternative to rules
 * Add support for SPS30 Particle sensor
 * Add support for VL53L0x time of flight sensor
 * Add support for Sonoff L1
 * Add Http#Initialized rule trigger
 * Add System#Save rule trigger executed just before a planned restart
 * Add support for single JSON value pair allowing for trigger such as SSerialReceived#Data=on
 * Add define USE_COUNTER to reduce program size in tasmota-basic.bin and tasmota-minimal.bin
 * Add define USE_DHT to reduce program size in tasmota-basic.bin
 * Add defines USE_EMULATION_WEMO and USE_EMULATION_HUE to control emulation features
 * Add Toggle functionality to button double press when more devices are detected
 * Add device OverTemp (>73 Celsius) detection to Energy Monitoring devices with temperature sensor
 * Add Tuya Dimmer 10 second heartbeat serial packet required by some Tuya dimmer secondary MCUs
 * Add all temperature, humidity and pressure for global access
 * Add validation check when loading settings from flash
 * Add GUI hexadecimal color compiler options
 * Add alternative IRSend Raw
 * Add user configurable ADC0 component to Module and Template configuration
 * Add AriLux RF control GPIO option "ALux IrSel" for full LED control
 * Add LED GPIO option "LedLink" to select dedicated link status LED
 * Add all 5 PWM channels individually adressable with LEDs
 * Add reset of Energy values when connection to sensor is lost for over 4 seconds
 * Add checkbox to GUI password field enabling visibility during password entry

## Version 6.5 20190319
 * Release bins are back to Arduino core 2.3 for improved Wi-Fi stability with various hardware
 * Add support for online template change using command Template or GUI Configure Other
 * Add support for Korean language translations
 * Add commands PowerCal, VoltageCal and CurrentCal for HLW8012, HJL01 and BL0937 based energy sensors
 * Add command SSerialSend5 \<hexdata\> to SerialBridge
 * Add command Interlock 0 / 1 / 1,2 3,4 .. to control interlock ON/OFF and add up to 8 relays in 1 to 4 interlock groups
 * Add command Template 255 to copy module configuration over to current active template and store as user template named Merged
 * Add command SetOption36 to control boot loop default restoration 
 * Add command SetOption37 for RGBCW color mapping
 * Add command SetOption55 0/1 and define MDNS_ENABLE to disable/enable mDNS 
 * Add command SetOption62 0/1 to disable retain on Button or Switch hold messages
 * Add support for Smanergy KA10 Smart Wall Socket with Energy monitoring
 * Add support for OBI Power Socket 2
 * Add support for YTF IR Bridge 
 * Add support for Mi LED Desk Lamp with rotary switch 
 * Add support for Digoo DG-SP202 Smart Socket with Energy monitoring 
 * Add support for MAX31855 K-Type thermocouple sensor using softSPI 
 * Add support for Luminea ZX2820 Smart Socket with Energy monitoring 
 * Add support for Near Field Communication (NFC) controller PN532 using Serial 
 * Add support for MAX44009 Ambient Light sensor 
 * Add support for multiple ADS1115 I<sup>2</sup>C devices 
 * Add support for sensor SCD30 
 * Add property MqttCount to status 6 message representing number of Mqtt re-connections
 * Add property LinkCount to state and status 11 message representing number of Wifi Link re-connections
 * Add property Downtime to state and status 11 message representing the duration of wifi connection loss
 * Add variable %timestamp% to rules 
 * Add rule support for "==", "!=" ">=" and "<=" 
 * Add Home Assistant status sensor 

## Version 6.4.1 20181225
* Add Slovak language.
* Add support for AZ-Instrument 7798 CO<sub>2</sub> meter/datalogger

## Version 6.4.0 20181217
### Devices
* Add support for Gosund SP1 v2.3 Power Socket with Energy Monitoring
* Add support for Armtronix dimmers.
* Add support for SM Smart Wifi Dimmer PS-16-DZ 
* Add support for Teckin US Power Socket with Energy Monitoring 
* Add support for GPIO02 for newer Sonoff Basic
* Add support for Manzoku Power Strip 
### Peripherals
* Add support for I<sup>2</sup>C MGC3130 Electric Field Effect sensor 
* Add support for SDM220
### Commands
* Add command SetOption24 0/1 to select pressure unit as hPa or mmHg
* Add command SetOption59 0/1 to change state topic from tele/STATE to stat/RESULT
* Add command SetOption58 0/1 to enable IR raw data info in JSON message 
* Add command IRSend \<frequency\>|0,\<rawdata1\>,\<rawdata2\>,.. to allow raw data transmission 
* Add command SetOption56 0/1 to enable wifi network scan and select highest RSSI 
* Add command SetOption57 0/1 to enable wifi network re-scan every 44 minutes with a rssi threshold of 10 to select highest RSSI
* Add command SetOption60 0/1 to select dynamic sleep (0) or sleep (1)
### Features
* Add Announce Switches to MQTT Discovery 

 
## Version 6.3.0.3 20181105
TasmotaSerial hardware serial detection is swapped started with TasmotaSerial v2.2.0. While keeping the hardware connection unchanged the Rx and Tx configuration parameters need to be reconfigured swapped to align TasmotaSerial single wire to two wire use. 

The following configuration will select Hardware Serial and will disable **user serial input**, SerialLog and force a sensor specific baudrate.

Sensor       | GPIO1 (Tx)     | GPIO3 (Rx)     | Baudrate
-------------|----------------|----------------|---------
MHZ19(B)     | 60 MHZ Tx      | 61 MHZ Rx      | 9600
PZEM004T     | 62 PZEM0XX Tx  | 63 PZEM004 Rx  | 9600
SenseAir     | 64 SAir Tx     | 65 SAir Rx     | 9600
PMS5003      | 00 None        | 69 PMS5003     | 9600
NovaSds      | 101 SDS0X1 Tx  | 70 SDS0X1 Rx   | 9600
SDM120       | 75 SDM120 Tx   | 76 SDM120 Rx   | 9600
SDM630       | 77 SDM120 Tx   | 78 SDM120 Rx   | 9600
PZEM014/016  | 62 PZEM0XX Tx  | 98 PZEM016 Rx  | 9600
PZEM003/017  | 62 PZEM0XX Tx  | 99 PZEM017 Rx  | 9600
MP3 Player   | 100 MP3 Player | 00 None        | 9600
Tuya Dimmer  | 107 Tuya Tx    | 108 Tuya Rx    | 9600

## Version 6.3.0 20181030
See [Release Information](https://github.com/arendst/Tasmota/releases/tag/v6.3.0)

## Version 6.2.1 20180905 
See [Release Information](https://github.com/arendst/Tasmota/releases/tag/v6.2.1)

## Version 6.1.0 20180706
This release expands the rule functionality with:
- commands like ``Add``, ``Sub``, ``Mult`` and ``Scale`` allowing floating point arithmetic on sensor data.
- variables like %time%, %uptime%, %sunrise% and %sunset%

Support for the following devices was added:
- Sonoff S26
- Sonoff iFan02
- BlitzWolf or equivalent energy monitoring devices

#### Under the hood
Removed libraries
- Adafruit_BME680-1.0.5
- Adafruit_Sensor-1.0.2.02
Libraries added
- BME680_driver-bme680_v3.5.9
- C2Programmer-1.0.0
- ESPAsyncUDP-master
Updated library
- esp-knx-ip-0.5.1

## Version 5.14.0 20180515 
#### Hardware Serial fallback
Starting with TasmotaSerial version 2.0.0 it is possible for serial connected sensors to use the Hardware Serial interface. This solves possible software interrupts failures resulting in lost sensor readings or watchdog/exception reboots. This is especially true for ESP8266/Arduino core version 2.3.0 which, by lack of iRam, does only allow interrupt routines from flash which might lead to before mentioned failures. 

When the following sensor configurations are made Hardware Serial is used which will disable **user serial input**, SerialLog and force a sensor specific baudrate.

Sensor   | GPIO1 (Tx)   | GPIO3 (Rx)   | Baudrate
---------|--------------|--------------|---------
PZEM004T | 59 PZEM Rx   | 58 PZEM Tx   | 9600
SDM120   | 72 SDM120 Rx | 71 SDM120 Tx | 9600
MHZ19(B) | 57 MHZ Rx    | 56 MHZ Tx    | 9600
SenseAir | 61 SAir Rx   | 60 SAir Tx   | 9600
PMS5003  | 00 None      | 65 PMS5003   | 9600
NovaSds  | 00 None      | 66 SDS0X1    | 9600

#### ESP8266/Arduino core information
The current release is compiled with core version v2.3.0. Due to increased wifi issues like no connection and lower signal strength using core 2.4.0 this release falls back to core 2.3.0.

#### Under the hood
Updated libraries
- TasmotaSerial-2.0.0

### 20180430 - 5.13.0 - Release
#### Rules
To have more flexible control this release introduces rules to act on different events like activated timers, button presses or sensor readings. See the [wiki](https://github.com/arendst/Tasmota/wiki/Rules) for more information and examples.

#### Timers
To provide more local control 16 timers were introduced for controlling power outlets during different times during the week. Optional webinterface and Sunrise/Sunset support is also available.

#### ESP8266/Arduino core information
The current release is compiled with core version v2.4.0. This is done to use at least a newer version of the core as it allows better interrupt support due to more free iRAM used by the Arilux Rf and Software Serial interrupt handlers. In v2.3.0 my interrupts had to use normal RAM because of lack of free iRAM which sometimes results in software watchdog restarts.

Core v2.4.1 could have been used too but this version has a problem with sleep mode making the device unresponsive and only a serial firmware upload would revive it. See issue [#2559](https://github.com/arendst/Tasmota/issues/2559) for background information. This version of Tasmota disables sleep mode on core v2.4.1

#### Under the hood
Updated libraries
- TasmotaSerial-1.2.0

New libraries
- Adafruit_SGP30 1.0.0 + 13 commits
- esp-knx-ip 0.5.0
- esp-mqtt-arduino 1.0.1 + 2 commits and 1 local fix
- Joba_Tsl2561 replacing TSL2561-Arduino-Library
- Multichannel_Gas_Sensor
- TasmotaMqtt 1.1.1

### 20180209 - 5.12.0 - Release
#### MQTT device discovery
To ease Home Assistant (and Domoticz [#1731](https://github.com/arendst/Tasmota/issues/1731)) configuration a feature called MQTT device discovery is made available for Tasmota switches and lights.

By executing command ``SetOption19 On`` this feature is enabled and after a forced reboot a retained MQTT message starting with topic "homeassistant..", as defined in user_config.h HOME_ASSISTANT_DISCOVERY_PREFIX, is send containing parameters used by Home Assistant to configure a switch or a light.

So no user interaction is needed on Home Assistant.

If you manage to let Home Assistant execute a script after it's restart containing a MQTT command like ``cmnd/your_light/state`` it will also use the current state of Tasmota without the use of the retain flag so hated by me.

To disable this feature and get rid of the retained message execute command ``SetOption19 Off`` and after a forced reboot the homeassistant topic should have been removed from the MQTT server.

#### OtaMagic
Tasmota is build to install on devices with 1MB usable flash. To easily use Over The Air (OTA) firmware updates only half of this flash space can be used by Tasmota as the other half is needed to store the OTA firmware image before it can be installed.

To keep Tasmota this small I had to reduce redundancy as much as possible. I also had to tweak some libraries by removing default features and disable some features in the user_config.h.

This worked kind of fine until version 2.4.0 of the [ESP8266/Arduino board manager](https://github.com/esp8266/Arduino) came along. This version needs an extra 22k for it's libraries and functionality. To provide easy OTA updates I had to tweak Tasmota even further to the point that major features like Emulation almost had to be disabled by default.

Luckily the ESP8266/Arduino board manager software adjusts it's free flash space based on the current program space. This means that a small program has more OTA flash space to use than a large program. I used this feature by providing the tasmota-minimal.bin firmware image containing only MQTT and a webserver which allows for larger Tasmota images by using a two step OTA approach.

- First OTA upload the _tasmota-minimal.bin_ image in the small free space area
- Then OTA upload the final _tasmota.bin_ image in the larger free space area

This process is now automated if used with an external OTA server.

Tasmota now tries to load the requested image and if it notices that the image won't fit it will load the minimal version first which in turn will load the requested final image. This is OtaMagic.

#### Under the hood
To aid in OtaMagic the file _pio/espupload.py_ has been updated to rename the platformio generated _firmware.bin_ filename to the released firmware filename.

To save code space when using version 2.4.0 of the ESP8266/Arduino board manager some compile time parameters need to be removed. For Ardiuino IDE a change has been made to file _arduino/version 2.4.0/platform.txt_ and for platformio a script _pio/strip-floats.py_ is made available to be enabled in _platformio.ini_ when compiling. When the correct installation steps are being performed as outlined in the menu on the right this will be implemented correctly.

Updated libraries
- TasmotaSerial-1.1.0
- PubSubClient library file PubSubClient.h define MQTT_MAX_PACKET_SIZE 1000

### 20180107 - 5.11.1 - Release 

The use of a different language from English has been revisited due to incompatible JSON messages between Tasmota and external tools [(#1473)](https://github.com/arendst/Tasmota/issues/1473). This has resulted in major changes to the language files which now only translate the Web GUI and Logging messages. All JSON messages will now be in English. 

The response from a HTPP command request will now be in plain JSON only. This allows for better integration with external tools. As a result the special Energy status message has been abandoned and is now provided as a Sensor status message. Useres may have to update their tools monitoring Energy values. 

The ``Color2``, ``Color3`` and ``Color4`` commands have been renamed to respectively ``Color3``, ``Color4`` and ``Color5`` to make room for the new ``Color2`` command.

#### Under the hood

The introduction of Device function pointers should make future integration of new devices easier. 

New libraries have been added:
- Adafruit_BME680-1.0.5
- Adafruit_Sensor-1.0.2 + 2 commits
- TasmotaSerial-1.0.0
- TSL2561-Arduino-Library

### 20171201 - 5.10.0 - Release 

Command ``EnergyReset 1..3`` has been replaced by commands ``EnergyReset1``, ``EnergyReset2`` and ``EnergyReset3`` to allow more functonality.

#### Under the hood

Updated libraries
- ArduinoJson 5.11.2
- IRRemoteEsp8266 2.2.1 + 2 commits but disabled some protocols (code size reduction)
- NeoPixelBus 2.2.9
- OneWire 2.3.3 + 6 commits and disabled CRC lookup-table (#define ONEWIRE_CRC8_TABLE 0) (code size reduction)
- PubSubClient 2.6 + 9 commits and additional delay (#790)
- I2Cdevlib-Core patched for esp8266-core 2.4.0 compatibility
