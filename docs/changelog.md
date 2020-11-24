<!-- 

find: \(#(\d{4})\) 
replace with: [#$1](https://github.com/arendst/Tasmota/issues/$1)
     
-->

[CHANGELOG.md](https://github.com/arendst/Tasmota/blob/development/CHANGELOG.md) tracks changes after 8.5.1

### Version 8.5.1 Hannah

- Fix energy total counters [#9263](https://github.com/arendst/Tasmota/issues/9263), [#9266](https://github.com/arendst/Tasmota/issues/9266)
- Fix crash in ``ZbRestore``
- Fix reset BMP sensors when executing command ``SaveData`` and define USE_DEEPSLEEP enabled [#9300](https://github.com/arendst/Tasmota/issues/9300)
- Fix ``status 0`` message when using define USE_MQTT_TLS due to small log buffer [#9305](https://github.com/arendst/Tasmota/issues/9305)
- Fix ``status 13`` exception 9 when more than one shutter is configured
- Fix ``status 13`` json message
- Fix Shelly 2.5 higher temperature regression from 8.2.0.1 [#7991](https://github.com/arendst/Tasmota/issues/7991)
- Change replace ArduinoJson with JSMN for JSON parsing
- Change ``WakeUp`` uses 256 steps instead of 100 [#9241](https://github.com/arendst/Tasmota/issues/9241)
- Add command ``SetOption110 1`` to disable Zigbee auto-config when pairing new devices
- Add command ``SetOption111 1`` to enable frequency output for buzzer GPIO [#8994](https://github.com/arendst/Tasmota/issues/8994)
- Add command ``SetOption112 1`` to enable friendly name in zigbee topic (use with SetOption89)
- Add ``#define USE_MQTT_AWS_IOT_LIGHT`` for password based AWS IoT authentication
- Add ``#define MQTT_LWT_OFFLINE`` and ``#define MQTT_LWT_ONLINE`` to user_config.h [#9395](https://github.com/arendst/Tasmota/issues/9395)
- Add new shutter modes [#9244](https://github.com/arendst/Tasmota/issues/9244)
- Add Zigbee auto-config when pairing
- Add support for MLX90640 IR array temperature sensor by Christian Baars
- Add support for VL53L1X time of flight sensor by Johann Obermeier

### Version 8.5.0 Hannah

- Remove support for direct upgrade from versions before 6.6.0.11 to versions after 8.4.0.1
- Change references from http://thehackbox.org/tasmota/ to http://ota.tasmota.com/tasmota/
- Change triple-mode TLS via configuration in a single firmware (TLS AWS IoT, Letsencrypt and No-TLS)
- Change White blend mode to using command ``SetOption 105`` instead of ``RGBWWTable``
- Fix ESP32 PWM range
- Fix display power control [#9114](https://github.com/arendst/Tasmota/issues/9114)
- Add command ``SetOption102 0/1`` to set Baud rate for Teleinfo communication (0 = 1200 or 1 = 9600)
- Add command ``SetOption103 0/1`` to set TLS mode when TLS is selected
- Add command ``SetOption104 1`` to disable all MQTT retained messages
- Add command ``SetOption105 1`` to enable White Blend Mode
- Add command ``SetOption106 1`` to create a virtual White ColorTemp for RGBW lights
- Add command ``SetOption107 0/1`` to select virtual White as (0) Warm or (1) Cold
- Add command ``SetOption108 0/1`` to enable Teleinfo telemetry into Tasmota Energy MQTT (0) or Teleinfo only (1)
- Add command ``SetOption109 1`` to force gen1 Alexa mode, for Echo Dot 2nd gen devices only
- Add command ``Restart 2`` to halt system. Needs hardware reset or power cycle to restart [#9046](https://github.com/arendst/Tasmota/issues/9046)
- Add command ``PowerDelta1`` to ``PowerDelta3`` to trigger on up to three phases [#9134](https://github.com/arendst/Tasmota/issues/9134)
- Add Zigbee options to ``ZbSend`` ``Config`` and ``ReadCondig``
- Add Zigbee better support for IKEA Motion Sensor
- Add Zigbee web gui widget for Battery and Temp/Humidity/Pressure sensors
- Add Zigbee web ui for power metering plugs
- Add better configuration corruption recovery [#9046](https://github.com/arendst/Tasmota/issues/9046)
- Add virtual CT for 4 channels lights, emulating a 5th channel
- Add support for DYP ME007 ultrasonic distance sensor by Janusz Kostorz [#9113](https://github.com/arendst/Tasmota/issues/9113)
- Add ESP32 Analog input support for GPIO32 to GPIO39
- Add experimental support for ESP32 TTGO Watch and I2S Audio by Gerhard Mutz


### Version 8.4.0 George

- :rotating_light: **BREAKING CHANGE** :rotating_light: Remove Arduino ESP8266 Core support for versions before 2.7.1
- :rotating_light: **BREAKING CHANGE** :rotating_light: Change to limited support of Arduino IDE as an increasing amount of features cannot be compiled with Arduino IDE
- Change IRRemoteESP8266 library from v2.7.6 to v2.7.8.10, fixing Samsung and Pioneer protocols [#8938](https://github.com/arendst/Tasmota/issues/8938)
- Change Adafruit_SGP30 library from v1.0.3 to v1.2.0 [#8519](https://github.com/arendst/Tasmota/issues/8519)
- Change Energy JSON Total field from ``"Total":[33.736,11.717,16.978]`` to ``"Total":33.736,"TotalTariff":[11.717,16.978]``
- Change Energy JSON ExportActive field from ``"ExportActive":[33.736,11.717,16.978]`` to ``"ExportActive":33.736,"ExportTariff":[11.717,16.978]``
- Change ESP32 USER GPIO template representation decreasing template message size
- Change define USE_TASMOTA_SLAVE into USE_TASMOTA_CLIENT
- Change commands ``SlaveSend`` and ``SlaveReset`` into ``ClientSend`` and ``ClientReset``
- Change all timer references from ``Arm`` to ``Enable`` in GUI, ``Timer`` command and JSON message
- :rotating_light: **BREAKING CHANGE** :rotating_light: Change Domoticz commands prefix from ``Domoticz`` to ``Dz``
- Change Zigbee randomizing of parameters at first run or after Reset
- Fix escape of non-JSON received serial data [#8329](https://github.com/arendst/Tasmota/issues/8329)
- Fix exception or watchdog on rule re-entry [#8757](https://github.com/arendst/Tasmota/issues/8757)
- Add command ``Rule0`` to change global rule parameters
- Add command ``Time 4`` to display timestamp using milliseconds [#8537](https://github.com/arendst/Tasmota/issues/8537)
- Add command ``SetOption94 0/1`` to select MAX31855 or MAX6675 thermocouple support [#8616](https://github.com/arendst/Tasmota/issues/8616)
- Add command ``SetOption97 0/1`` to switch between Tuya serial speeds 9600 bps (0) or 115200 bps (1)
- Add command ``SetOption98 0/1`` to provide rotary rule triggers (1) instead of controlling light (0)
- Add command ``SetOption99 0/1`` to enable zero cross detection on PWM dimmer
- Add command ``SetOption100 0/1`` to remove Zigbee ``ZbReceived`` value from ``{"ZbReceived":{xxx:yyy}}`` JSON message
- Add command ``SetOption101 0/1`` to add the Zigbee source endpoint as suffix to attributes, ex `Power3` instead of `Power` if sent from endpoint 3
- Add command ``DzSend<type> <index>,<value1(;value2)|state>`` to send values or state to Domoticz
- Add command ``Module2`` to configure fallback module on fast reboot [#8464](https://github.com/arendst/Tasmota/issues/8464)
- Add command (``S``)``SerialSend6`` \<comma seperated values\> [#8937](https://github.com/arendst/Tasmota/issues/8937)
- Add commands ``LedPwmOn 0..255``, ``LedPwmOff 0..255`` and ``LedPwmMode1 0/1`` to control led brightness by George [#8491](https://github.com/arendst/Tasmota/issues/8491)
- Add ESP32 ethernet commands ``EthType 0/1``, ``EthAddress 0..31`` and ``EthClockMode 0..3``
- Add more functionality to command ``Switchmode`` 11 and 12 [#8450](https://github.com/arendst/Tasmota/issues/8450)
- Add rule trigger ``System#Init`` to allow early rule execution without wifi and mqtt initialized yet
- Add support for unique MQTTClient (and inherited fallback topic) by full Mac address using ``mqttclient DVES_%12X`` [#8300](https://github.com/arendst/Tasmota/issues/8300)
- Add wildcard pattern ``?`` for JSON matching in rules
- Add Three Phase Export Active Energy to SDM630 driver
- Add Zigbee options to ``ZbSend`` to write and report attributes
- Add Zigbee auto-responder for common attributes
- Add ``CpuFrequency`` to ``status 2``
- Add ``FlashFrequency`` to ``status 4``
- Add compile time interlock parameters [#8759](https://github.com/arendst/Tasmota/issues/8759)
- Add compile time user template [#8766](https://github.com/arendst/Tasmota/issues/8766)
- Add support for VEML6075 UVA/UVB/UVINDEX Sensor by device111 [#8432](https://github.com/arendst/Tasmota/issues/8432)
- Add support for VEML7700 Ambient light intensity Sensor by device111 [#8432](https://github.com/arendst/Tasmota/issues/8432)
- Add support for up to two BH1750 sensors controlled by commands ``BH1750Resolution`` and ``BH1750MTime`` [#8139](https://github.com/arendst/Tasmota/issues/8139)
- Add support for up to eight MCP9808 temperature sensors by device111 [#8594](https://github.com/arendst/Tasmota/issues/8594)
- Add support for BL0940 energy monitor as used in Blitzwolf BW-SHP10 [#8175](https://github.com/arendst/Tasmota/issues/8175)
- Add support for Telegram bot [#8619](https://github.com/arendst/Tasmota/issues/8619)
- Add support for HP303B Temperature and Pressure sensor by Robert Jaakke [#8638](https://github.com/arendst/Tasmota/issues/8638)
- Add support for Energy sensor (Denky) for French Smart Metering meter provided by global Energy Providers, need a adaptater. See dedicated full [blog](http://hallard.me/category/tinfo/) about French teleinformation stuff
- Add support for ESP32 ethernet adding commands ``Wifi 0/1`` and ``Ethernet 0/1`` both default ON
- Add support for single wire LMT01 temperature Sensor by justifiably [#8713](https://github.com/arendst/Tasmota/issues/8713)
- Add support for rotary encoder as light dimmer and optional color temperature if button1 still pressed [#8670](https://github.com/arendst/Tasmota/issues/8670)
- Add support for switches/relays using an AC detection circuitry e.g. MOES MS-104B or BlitzWolf SS5 [#8606](https://github.com/arendst/Tasmota/issues/8606)
- Add support for Schneider Electric iEM3000 series Modbus energy meter by Marius Bezuidenhout
- Add support for Sonoff Zigbee Bridge as module 75 [#8583](https://github.com/arendst/Tasmota/issues/8583)

### Version 8.3.1 Fred

- Change Hass discovery from using Template or Module name to new Device name [#8462](https://github.com/arendst/Tasmota/issues/8462)
- Change KNX pow function to approximative pow saving 5k of code space
- Change Mutichannel Gas sensor pow function to approximative pow saving 5k of code space
- Change Quick Power Cycle detection from 4 to 7 power interrupts [#4066](https://github.com/arendst/Tasmota/issues/4066)
- Fix default state of ``SetOption73 0`` for button decoupling and send multi-press and hold MQTT messages
- Add command ``DeviceName`` defaults to FriendlyName1 and replaces FriendlyName1 in GUI

### Version 8.3.0 Fred

- Breaking Change Device Groups multicast address and port  [8270](https://github.com/arendst/Tasmota/issues/8270)
- Change PWM implementation to Arduino #7231 removing support for Core versions before 2.6.3
- Change default PWM Frequency to 977 Hz from 880 Hz
- Change minimum PWM Frequency from 100 Hz to 40 Hz
- Change flash access removing support for any Core before 2.6.3
- Change HM-10 sensor type detection and add features [7962](https://github.com/arendst/Tasmota/issues/7962)
- Change light scheme 2,3,4 cycle time speed from 24,48,72,... seconds to 4,6,12,24,36,48,... seconds [8034](https://github.com/arendst/Tasmota/issues/8034)
- Change remove floating point libs from IRAM
- Change remove MQTT Info messages on restart for DeepSleep Wake [8044](https://github.com/arendst/Tasmota/issues/8044)
- Change IRremoteESP8266 library updated to v2.7.6
- Change HAss discovery by Federico Leoni [8370](https://github.com/arendst/Tasmota/issues/8370)
- Fix possible Relay toggle on (OTA) restart
- Fix PWM flickering during wifi connection [8046](https://github.com/arendst/Tasmota/issues/8046)
- Fix Zigbee sending wrong Sat value with Hue emulation
- Fix Zigbee crash with Occupancy sensor [8089](https://github.com/arendst/Tasmota/issues/8089)
- Add Zigbee command ``ZbRestore`` to restore device configuration dumped with ``ZbStatus 2``
- Add Zigbee command ``ZbUnbind``
- Add Zigbee command ``ZbBindState`` and ``manuf``attribute
- Add Zigbee command ``ZbConfig`` and configuration in Settings
- Add commands ``CounterDebounceLow`` and ``CounterDebounceHigh`` to control debouncing [8021](https://github.com/arendst/Tasmota/issues/8021)
- Add commands ``NrfPage``, ``NrfIgnore``, ``NrfScan`` and ``NrfBeacon`` to NRF24 Bluetooth driver [8075](https://github.com/arendst/Tasmota/issues/8075)
- Add commands ``GlobalTemp`` and ``GlobalHum`` to init sensor data [8152](https://github.com/arendst/Tasmota/issues/8152)
- Add command ``SO`` as shortcut for command ``SetOption``
- Add command ``SetOption41 <x>`` to force sending gratuitous ARP every <x> seconds
- Add command ``SetOption73 1`` for button decoupling and send multi-press and hold MQTT messages by Federico Leoni [8235](https://github.com/arendst/Tasmota/issues/8235)
- Add command ``SetOption90 1`` to disable non-json MQTT messages [8044](https://github.com/arendst/Tasmota/issues/8044)
- Add command ``SetOption91 1`` to enable fading at startup / power on
- Add command ``SetOption92 1`` to set PWM Mode from regular PWM to ColorTemp control (Xiaomi Philips ...)
- Add command ``SetOption93 1`` to control caching of compressed rules
- Add command ``Sensor10 0/1/2`` to control BH1750 resolution - 0 = High (default), 1 = High2, 2 = Low [8016](https://github.com/arendst/Tasmota/issues/8016)
- Add command ``Sensor10 31..254`` to control BH1750 measurement time which defaults to 69 [8016](https://github.com/arendst/Tasmota/issues/8016)
- Add command ``Sensor18 0..32000`` to control PMS5003 sensor interval to extend lifetime by Gene Ruebsamen [8128](https://github.com/arendst/Tasmota/issues/8128)
- Add command ``DevGroupName`` to specify up to four Device Group Names [8087](https://github.com/arendst/Tasmota/issues/8087)
- Add command ``DevGroupSend`` to send an update to a Device Group [8093](https://github.com/arendst/Tasmota/issues/8093)
- Add command ``Ping`` [7176](https://github.com/arendst/Tasmota/issues/7176)
- Add command ``Palette`` to add the ability to specify a palette of colors [8150](https://github.com/arendst/Tasmota/issues/8150)
- Add support for unreachable (unplugged) Zigbee devices in Philips Hue emulation and Alexa
- Add support for 64x48 SSD1306 OLED [6740](https://github.com/arendst/Tasmota/issues/6740)
- Add support for Seven Segment display using HT16K33 [8116](https://github.com/arendst/Tasmota/issues/8116)
- Add support for up to four MQTT GroupTopics [8014](https://github.com/arendst/Tasmota/issues/8014)
- Add support for longer template names
- Add support for an iAQ sensor [8107](https://github.com/arendst/Tasmota/issues/8107)
- Add support for AS3935 Lightning Sensor by device111 [8130](https://github.com/arendst/Tasmota/issues/8130)
- Add console command history [7483, #8015](https://github.com/arendst/Tasmota/issues/7483, #8015)
- Add quick wifi reconnect using saved AP parameters when ``SetOption56 0`` [3189](https://github.com/arendst/Tasmota/issues/3189)
- Add more accuracy to GPS NTP server [8088](https://github.com/arendst/Tasmota/issues/8088)
- Add support for analog anemometer by Matteo Albinola [8283](https://github.com/arendst/Tasmota/issues/8283)
- Add support for OpenTherm by Yuriy Sannikov [8373](https://github.com/arendst/Tasmota/issues/8373)
- Add support for Thermostat control by arijav [8212](https://github.com/arendst/Tasmota/issues/8212)
- Add experimental basic support for Tasmota on ESP32 based on work by Joerg Schueler-Maroldt
- Add automatic compression of Rules to achieve ~60% compression by Stefan Hadinger
- Add rule trigger at root level like ``on loadavg<50 do power 2 endon`` after ``state`` command

### Version 8.2.0 Elliot

- Change default my_user_config.h driver and sensor support removing most sensors and adding most drivers to tasmota.bin
- Change DHT driver ([7468](https://github.com/arendst/Tasmota/issues/7468), [7717](https://github.com/arendst/Tasmota/issues/7717))
- Change Lights: simplified gamma correction and 10 bits internal computation
- Change commands `Prefix`, `Ssid`, `StateText`, `NTPServer`, and `FriendlyName` displaying all items
- Change Zigbee command prefix from `Zigbee*` to `Zb*`
- Change MQTT message size with additional 200 characters
- Change display of some date and time messages from `Wed Feb 19 10:45:12 2020` to `2020-02-19T10:45:12`
- Change IRremoteESP8266 library updated to v2.7.4
- Fix `PowerDelta` zero power detection ([7515](https://github.com/arendst/Tasmota/issues/7515))
- Fix `White` added to light status ([7142](https://github.com/arendst/Tasmota/issues/7142))
- Fix `WakeUp <x>` ignores provided value ([7473](https://github.com/arendst/Tasmota/issues/7473))
- Fix `RGBWWTable` ignored ([7572](https://github.com/arendst/Tasmota/issues/7572))
- Fix commands `Display` and `Counter` from overruling command processing ([7322](https://github.com/arendst/Tasmota/issues/7322))
- Fix Sonoff Bridge, Sc, L1, iFan03 and CSE7766 serial interface to forced speed, config and disable logging
- Fix Improved fade linearity with gamma correction
- Fix PWM flickering at low levels ([7415](https://github.com/arendst/Tasmota/issues/7415))
- Fix LCD line and column positioning ([7387](https://github.com/arendst/Tasmota/issues/7387))
- Fix Display handling of hexadecimal escape characters ([7387](https://github.com/arendst/Tasmota/issues/7387))
- Fix exception 9 restart on log message in Ticker interrupt service routines NTP, Wemos and Hue emulation ([7496](https://github.com/arendst/Tasmota/issues/7496))
- Fix Hass sensor discovery by Federico Leoni ([7582](https://github.com/arendst/Tasmota/issues/7582), [7548](https://github.com/arendst/Tasmota/issues/7548))
- Fix MaxPower functionality ([7647](https://github.com/arendst/Tasmota/issues/7647))
- Fix relation between Wifi RSSI and signal strength
- Add command `SetOption79 0/1` to enable reset of counters at teleperiod time by Andre Thomas ([7355](https://github.com/arendst/Tasmota/issues/7355))
- Add command `SetOption82 0/1` to limit the CT range for Alexa to 200..380
- Add command `SetOption84 0/1` to send AWS IoT device shadow updates (alternative to retained)
- Add commands `SetOption85 0/1` and `DevGroupShare` supporting UDP Group command using `GroupTopic` without MQTT by Paul Diem ([7790](https://github.com/arendst/Tasmota/issues/7790))
- Add command `SetOption86 0/1` for PWM dimmer to turn brightness LED's off 5 seconds after last change
- Add command `SetOption87 0/1` for PWM dimmer to turn red LED on when powered off
- Add command `SetOption88 0/1` for PWM dimmer to let buttons control remote devices
- Add command `SetOption89 0/1` for Zigbee distinct MQTT topics per device for SENSOR, allowing retained messages ([7835](https://github.com/arendst/Tasmota/issues/7835))
- Add command `ShutterButton <parameters>` to control shutter(s) by to-scho ([7403](https://github.com/arendst/Tasmota/issues/7403))
- Add commands `SwitchMode 8` ToggleMulti, `SwitchMode 9` FollowMulti and `SwitchMode 10` FollowMultiInverted ([7522](https://github.com/arendst/Tasmota/issues/7522))
- Add commands `SwitchMode 11` PushHoldMulti and `SwitchMode 12` PushHoldInverted ([7603](https://github.com/arendst/Tasmota/issues/7603))
- Add commands `SwitchMode 13` PushOn and `SwitchMode 14` PushOnInverted ([7912](https://github.com/arendst/Tasmota/issues/7912))
- Add command `Buzzer -1` for infinite mode and command `Buzzer -2` for following led mode ([7623](https://github.com/arendst/Tasmota/issues/7623))
- Add command `HumOffset -10.0 .. 10.0` to set global humidity sensor offset ([7934](https://github.com/arendst/Tasmota/issues/7934))
- Add support for `AdcParam` parameters to control ADC0 Current Transformer Apparent Power formula by Jodi Dillon ([7100](https://github.com/arendst/Tasmota/issues/7100))
- Add optional parameter `<startcolor>` to command `Scheme <scheme>, <startcolor>` to control initial start color
- Add web page sliders when `SetOption37 128` is active allowing control of white(s)
- Add SerialConfig to `Status 1`
- Add BootCount Reset Time as BCResetTime to `Status 1`
- Add WifiPower to `Status 5`
- Add most SetOptions as defines to my_user_config.h
- Add optional Wifi AccessPoint passphrase define WIFI_AP_PASSPHRASE in my_user_config.h ([7690](https://github.com/arendst/Tasmota/issues/7690))
- Add SoftwareSerial to CSE7766 driver allowing different GPIOs ([7563](https://github.com/arendst/Tasmota/issues/7563))
- Add rule trigger on one level deeper using syntax with two `#` like `on zbreceived#vibration_sensor#aqaracubeside=0 do ...`
- Add Zigbee attribute decoder for Xiaomi Aqara Cube
- Add `ZbZNPReceived`and `ZbZCLReceived` being published to MQTT when `SetOption66 1`
- Add Zigbee enhanced commands decoding, added `ZbPing`
- Add Zigbee features and improvements
- Add Zigbee support for Hue emulation by Stefan Hadinger
- Add HAss Discovery support for Button and Switch triggers by Federico Leoni ([7901](https://github.com/arendst/Tasmota/issues/7901))
- Add Dew Point to Temperature and Humidity sensors
- Add optional support for Prometheus using file xsns_91_prometheus.ino ([7216](https://github.com/arendst/Tasmota/issues/7216))
- Add support for gzipped binaries
- Add support for Romanian language translations by Augustin Marti
- Add support for sensors DS18x20 and DHT family on Shelly 1 and Shelly 1PM using Shelly Add-On adapter ([7469](https://github.com/arendst/Tasmota/issues/7469))
- Add support to BMP driver to enter reset state (sleep enable) when deep sleep is used in Tasmota
- Add support for DS1624, DS1621 Temperature sensor by Leonid Myravjev
- Add support for NRF24L01 as BLE-bridge for Mijia Bluetooth sensors by Christian Baars ([7394](https://github.com/arendst/Tasmota/issues/7394))
- Add support for MI-BLE sensors using HM-10 Bluetooth 4.0 module by Christian Staars ([7683](https://github.com/arendst/Tasmota/issues/7683))
- Add support for FiF LE-01MR energy meter by saper-2 ([7584](https://github.com/arendst/Tasmota/issues/7584))
- Add support for Sensors AHT10 and AHT15 by Martin Wagner ([7596](https://github.com/arendst/Tasmota/issues/7596))
- Add support for Wemos Motor Shield V1 by Denis Sborets ([7764](https://github.com/arendst/Tasmota/issues/7764))
- Add support for La Crosse TX23 Anemometer by Norbert Richter ([3146](https://github.com/arendst/Tasmota/issues/3146), [7765](https://github.com/arendst/Tasmota/issues/7765))
- Add support for Martin Jerry/acenx/Tessan/NTONPOWER SD0x PWM dimmer switches by Paul Diem ([7791](https://github.com/arendst/Tasmota/issues/7791))
- Add support for UDP Group control without MQTT by Paul Diem ([7790](https://github.com/arendst/Tasmota/issues/7790))
- Add support for Jarolift rollers by Keeloq algorithm
- Add support for MaxBotix HRXL-MaxSonar ultrasonic range finders by Jon Little ([7814](https://github.com/arendst/Tasmota/issues/7814))
- Add support for HDC1080 Temperature and Humidity sensor by Luis Teixeira ([7888](https://github.com/arendst/Tasmota/issues/7888))
- Add support for ElectriQ iQ-wifiMOODL RGBW light by Ian King ([7947](https://github.com/arendst/Tasmota/issues/7947))
