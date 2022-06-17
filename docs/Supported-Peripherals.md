# Supported Peripherals

Name|Description|Connection
---|---|---
**74x595**| 74x595 Shift Registers | gpio
[**A4988**](A4988-Stepper-Motor-Controller)| Stepper Motor Controller 
[**ADC**](ADC) | Analog input over A0 pin | analog
**ADS111x** | A/D Converter | I^2^C
[**AHT1x**](AHT1x.md)<BR>**AHT2x** | Asair AHT10/AHT15/AHT20/AHT21/AHT25/AM2301B Temperature and Humidity Sensor | I^2^C
[**AM2301 / DHT21 <BR>AM2302 / DHT22<BR>AM2321**](AM2301) | Temperature and Humidity Sensor | gpio
[**AM2301B**](AHT1x) | Temperature and Humidity Sensor<br><i>Use same driver as AHT2X</i>| I^2^C
**AM2320** | Temperature and Humidity Sensor | gpio
**AS608** | AS608 Optical and R503 Capacitive Fingerprint Sensor| serial
[**AS3935**](AS3935) | Franklin Lightning Sensor| serial
[**APDS-9960**](APDS-9960) |  Ambient Light, RGB Color and Proximity Sensor with Gesture Detection | I^2^C
[**AZ 7798**](AZ-7798) | CO~2~ Meter Datalogger
[**BH1750**](BH1750) | Luminosity Sensor
[**BMP280<BR>BMP085<BR>BMP180)**](BME280) | Pressure Sensor
[**BME280**](BME280) | Temperature, Humidity and Pressure Sensor | I^2^C
[**BME680**](BME680)<BR>BME688 | Temperature, Humidity, Pressure and Gas Sensor | I^2^C
[**Buzzer**](Buzzer) | Audio Signalling Device | gpio
[**CC2530**](CC2530) | TI CC2530 Zigbee Adapter| serial
**CCS811** | Gas and Air Quality Sensor| I^2^C
[**Chirp! Soil Moisture Sensor**](Moisture-Sensor-and-Chirp!-Sensor) | Moisture Sensor| I^2^C
[**DFR0299**](DFR0299) | DFRobot DFPlayer Mini MP3 Player| serial
[**DHT11**](DHT11) | Temperature and Humidity Sensor | gpio
**DHT12** | Temperature and Humidity Sensor | gpio
**DYP-ME007** | Ultrasonic distance Sensor| serial
**[DS18x20](DS18x20)** | Temperature Sensor| 1-Wire
**DS1624<BR>DS1621** | Temperature Sensor| 1-Wire
[**DS3231**](DS3231) | Real-Time-Clock| I^2^C
[**DS3502**](DS3502) | Digital potentiometer| I^2^C
**[EZO](EZO)** | EZO series of chemical Sensors | I^2^C
**F&F LE-01MR** | F&F LE-01MR Single Phase Modbus Energy meter
[**GPS-NTP-server**](GPS-NTP-server) | GPS-NTP-server | serial
[**GGreg20_V3**](https://github.com/iotdevicesdev/ggreg20-v3-tasmota-esp32-driver) | Ionizing Radiation Detector | gpio _(ESP32 only)_
**HDC1080** | Texas Instruments HDC1080 Humidity and Temperature Sensor | I^2^C
**HDC2010** | Texas Instruments HDC2010 Humidity and Temperature Sensor | I^2^C
**[HM-10](HM-10)** |  BLE Bluetooth gateway | serial
**[HM-17<BR>HM-16](HM-17)** |  Bluetooth iBeacon reader | serial
**HP303B** | Barometric Pressure Shield| I^2^C
**HYTxx** | Temperature and Humidity Sensor| I^2^C
**HR-E** | Water Meter Encoder interface| serial
**HRG-15** | Hydreon RG-15 Rain Gauge Sensor | serial
**HRXL** | MaxBotix HRXL line of Sonar Ranging Sensors| gpio
**[HC-SR04<BR>HC-SR04P<BR>JSN-SR04T)](HC-SR04)** | Ultrasonic Sensor | gpio
**HM330x** | SeedStudio Grove HM3301 Particulate Matter Sensor | I^2^C
**[Honeywell HIH](Honeywell-HIH)** | Temperature and Humidity Sensor| I^2^C
**Honeywell HPMA115xx** | Particulate Matter Sensor| serial
**HTU21** | Temperature and Humidity Sensor| I^2^C
**HX711** | Load Cell Sensor| gpio
**[HRG15](HRG15)** | Solid State Rain Sensor| serial
[**iAQ-Core**](IAQ) | Indoor Air Quality Sensor| I^2^C
**iEM3000** | Schenider Electric modbus energy meter| serial
**INA219**<BR>**ISL28022** | High-Side DC Current and Voltage Sensor| I^2^C
**INA226** | High-Side or Low-side DC Current and Voltage Sensor| I^2^C
[**IR Remote**](IR-Remote) | IR transmitter and receiver
**K30, K70, S8** | SenseAir CO~2~ Sensors| serial | 
[**LM75AD**](LM75AD) |  Temperature Sensor| I^2^C
[**LMT01**](LMT01) | Temperature Sensor| gpio
**MAX31855**<br>**MAX6675** | Thermocouple Sensor| SPI
**MAX31865** | RTD Temperature Sensor Amplifier| SPI
**MAX44009** | Ambient Light Sensor| I^2^C
[**MCP23008<BR>MCP23017**](MCP230xx) |  I/O Expander| I^2^C
**MCP2515** | CAN bus controller | SPI
[**MCP9808**](MCP9808) |  Temperature Sensor| I^2^C
[**MFRC522**](MFRC522) | NFC Tag Reader| SPI
[**MGC3130**](MGC3130) | 3D Tracking and Gesture Controller
[**MH-Z19B**](MH-Z19B) | CO~2~ Sensor
[**MLX90614**](MLX90614) | MLX9061X Infrared Thermometer| I^2^C
[**MLX90640**](MLX90640) | MLX90640 Far Infrared Thermal Sensor Array| I^2^C
[**MPR121**](MPR121) | Proximity Capacitive Touch Sensor Controller (I^2^C)
[**MPU6050**](MPU-6050)| 3-Axis Gyroscope and 3-Axis Accelerometer Sensor (I^2^C)
**MQ** | MQ Sensors (MQ-02, MQ-03, MQ-04, MQ-05, MQ-06, MQ-07, MQ-08, MQ-09, MQ-131, MQ-135) | analog
**MS01** | Moisture sensor from Sonoff | 1wire
[**NeoPool**](NeoPool) | Sugar Valley NeoPool Controller| serial
[**NRF24L01**](NRF24L01) | NRF24L01 as BLE-bridge for Mijia BT Sensors| SPI
[**OpenTherm**](OpenTherm) | OpenTherm adapter| serial
[**P1 Smart Meter**](P1-Smart-Meter) | Energy Meter| serial
[**PAJ7620**](PAJ7620) | Gesture & Proximity Detection Sensor
[**PIR**](PIR-Motion-Sensors#am312) | Passive Infrared Sensor| gpio
[**PCA9685**](PCA9685) | 16-channel, 12-bit PWM LED controller| I^2^C
[**PCF8574(A)**](PCF8574) 8-port IO Expander| I^2^C
**PMS3003<BR>[PMS5003](https://www.superhouse.tv/38-diy-air-quality-Sensor-part-1-basic-model/)<BR>PMS7003** | Particle Concentration Sensor| serial
[**PN532**](PN532) | NFC/RFID controller
[**PZEM-004<BR>PZEM-016**](PZEM-0XX) | Energy Monitor| serial
[**RCWL-0516**](RCWL-0516) |  Microwave Radar Presence detection
[**RDM6300**](RDM6300) | 125Khz RFID Module
[**RF Transceiver**](RF-Transceiver) | IR receiver and/or transmitter
**RX-4M50RR30SF<BR>RX-AM8SF** | RF Sensor receiver| gpio
**SCD30** | CO~2~ Sensor| I^2^C
**SCD40**<BR>**SCD41** | CO~2~</sub> Sensor| I^2^C
**Eastron SDM72** | Modbus Energy Meter| serial
**Eastron SDM120** | Modbus Energy Meter| serial
**Eastron SDM220** | Modbus Energy Meter| serial
**Eastron SDM230** | Modbus Energy Meter| serial
**Eastron SDM630** | Modbus Energy Meter| serial
**YF-DN50** | Flow rate meter | gpio
[**SDS011<BR>SDS021**](SDS011) | Laser Dust Sensor
**SGP30** | Gas and Air Quality Sensor| I^2^C
**SHT1x** | Temperature and Humidity Sensor| I^2^C
[**SHT30**](SHT30) | Humidity & Temperature Sensor| I^2^C
**SHT4x** | Temperature and Humidity Sensor| I^2^C
**SI114x** | UV Index, IR and Visible Light Sensor | I^2^C
**Si7021** | Humidity and Temperature Sensor| I^2^C
[**SK6812**](SK6812.md) | Addressable LEDs
[**Smart Meter Interface**](Smart-Meter-Interface) | Smart Meter Interface | serial, gpio
[**SolaX X1**](SolaX-X1) | SolaX Power X1 inverter | serial
[**SPS30**](SPS30) | Particulate Matter| PM) | Sensor | I^2^C
**T6703**<BR>**T6713** | Telaire T6700 Series CO~2~ sensor | I^2^C
[**Téléinfo**](Teleinfo) | French energy measuring system | serial
**TFMini** | TFmini, TFmini Plus, TFmini Plus (Indoor Version), TFmini-S LiDAR module | serial
**TM1638** | 8 Switch, LED and 7 Segment Unit Sensor| gpio
[**TSL2561**](TSL2561) | Luminosity Sensor| I^2^C
**TSL2591** | Luminosity Sensor| I^2^C
[**TX20<BR>TX23<BR>WS2300**](TX2x) | La Crosse TX2x / Technoline WS2300-15 Anemometer | gpio
[**VEML6070**](VEML6070) |  UV Sensor| I^2^C
[**VEML6075**](VEML6075) |  UVA/UVB/UVINDEX Sensor| I^2^C
[**VEML7700**](VEML7700) |  Ambient light intensity Sensor| I^2^C
[**VL53L0x**](VL53Lxx) | Time of flight Sensor| I^2^C
[**VL53L1x**](VL53Lxx) | Time of flight Sensor| I^2^C
**[VINDRIKTNING](https://blakadder.com/vindriktning-tasmota/) | IKEA VINDRIKTNING Particle Concentration Sensor | serial
**WindMeter** | Analog cup anemometer
[**WS2812B**](WS2812B-RGB-Shield) | Wemos Shield with Addressable LED
[**WS2812B<BR>WS2813B**](WS2812B-and-WS2813) | Addressable LEDs
**Xadow| Grove) Mutichannel Gas Sensor** | gas Sensor (I^2^C

[Google Sheet list of supported peripherals](https://docs.google.com/spreadsheets/d/1VaZrCUjNosUQGYBX0pTVoY_rkSzEIcTP8K3052smOB4/edit?usp=sharing)

[Sensor API Documentation](Sensor-API)

## Expanding Specific Devices

* [LEGO nightstand switch using Sonoff SV](https://jeff.noxon.cc/2018/11/21/lego-nightstand-light-switch/)
* [Add a physical button to Sonoff Basic](https://translate.google.com/translate?hl=en&sl=auto&tl=en&u=https%3A%2F%2Fwww.domo-blog.fr%2Fajouter-un-bouton-physique-au-sonoff-basic%2F)
* [Remote button for Sonoff](Control-a-Sonoff-using-a-remote-button)
* [Expand Sonoff S20 with a jack plug](https://github.com/arendst/Tasmota/issues/670)
* [Expand Sonoff 4CH with a jack plug](Expanding-4CH)
* [Modify KaKu to WKaKu Power Socket](/devices/Modify-KaKu-to-WKaKu-Power-Socket)
* [GPIO Locations for some devices](Pinouts)
