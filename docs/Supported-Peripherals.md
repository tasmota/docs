# Supported Peripherals

Name|Description|Connection
---|---|---
**74x595**| 74x595 shift register | gpio
[**A4988**](A4988-Stepper-Motor-Controller)| Stepper motor controller 
[**ADC**](ADC) | Analog input over A0 pin | analog
**ADS111x** | A/D Converter | I^2^C
[**AHT1x**](AHT1x.md) | Asair AHT10/AHT15 temperature and humidity sensor | I^2^C
[**AHT2x**](AHT2x.md) | Asair AHT20/AHT21/AHT25/AM2301B temperature and humidity sensor | I^2^C
[**AM2301 / DHT21 <BR>AM2302 / DHT22<BR>AM2321**](AM2301) | Temperature and humidity sensor | gpio
[**AM2301B**](AHT2x) | Temperature and humidity sensor<br><i>Uses same driver as AHT2X</i>| I^2^C
**AM2320** | Temperature and humidity sensor | gpio
**AS608** | AS608 pptical and R503 capacitive fingerprint sensors| serial
[**AS3935**](AS3935) | Franklin lightning sensor| serial
[**APDS-9960**](APDS-9960) |  Ambient light, RGB color and proximity sensor with gesture detection | I^2^C
[**AZ 7798**](AZ-7798) | CO~2~ meter datalogger
[**BH1750**](BH1750) | Luminosity sensor
[**BMP280<BR>BMP085<BR>BMP180)**](BME280) | Pressure sensor
[**BME280**](BME280) | temperature, humidity and pressure sensor | I^2^C
[**BME680**](BME680)<BR>BME688 | temperature, humidity, pressure and gas sensor | I^2^C
[**Buzzer**](Buzzer) | Audio signalling device | gpio
[**CC2530**](CC2530) | TI CC2530 Zigbee adapter| serial
**CCS811** | Gas and air quality sensor| I^2^C
[**Chirp! Soil Moisture sensor**](Moisture-Sensor-and-Chirp!-Sensor.md) | Moisture sensor| I^2^C
[**DFR0299**](DFR0299) | DFRobot DFPlayer mini MP3 player| serial
[**DHT11**](DHT11) | Temperature and humidity sensor | gpio
**DHT12** | Temperature and humidity sensor | gpio
[**DY-SV17F**](DY-SV17F) | DY-SV17F MP3 player| serial
**DYP-ME007** | Ultrasonic distance sensor| serial
**[DS18x20](DS18x20)** | Temperature sensor| 1-Wire
**DS1624<BR>DS1621** | Temperature sensor| 1-Wire
[**DS3231**](DS3231) | Real time clock| I^2^C
DS3502 | Digital potentiometer| I^2^C
**[EZO](EZO)** | EZO series of chemical sensors | I^2^C
**F&F LE-01MR** | F&F LE-01MR single phase Modbus energy meter
[**GDK101**](https://github.com/arendst/Tasmota/blob/development/tasmota/tasmota_xsns_sensor/xsns_106_gdk101.ino) | Gamma radiation sensor | I^2^C
[**GGreg20_V3**](https://github.com/iotdevicesdev/ggreg20-v3-tasmota-esp32-driver) | Ionizing radiation detector | gpio _(ESP32 only)_
[**GM861**](https://github.com/arendst/Tasmota/discussions/18399#discussioncomment-5817001) | Barcode and QR code reader | serial
[**GPS-NTP-server**](GPS-NTP-server) | GPS NTP server | serial
**[ENS161](ENS161)** | Air quality sensor | I^2^C
**HDC1080** | Texas Instruments HDC1080 humidity and temperature sensor | I^2^C
**HDC2010** | Texas Instruments HDC2010 humidity and temperature sensor | I^2^C
**[HM-10](HM-10)** |  BLE Bluetooth gateway | serial
**[HM-17<BR>HM-16](HM-17)** |  Bluetooth iBeacon reader | serial
**HMC5883L** | 3-channels magnetic field sensor | I^2^C
**HP303B** | Barometric pressure sensor | I^2^C
**HYTxx** | Temperature and humidity sensor | I^2^C
**HR-E** | Water meter encoder interface| serial
**HRG-15** | Hydreon RG-15 rain gauge sensor | serial
**HRXL** | MaxBotix HRXL line of sonar ranging sensors| gpio
**[HC-SR04<BR>HC-SR04P<BR>JSN-SR04T)](HC-SR04)** | Ultrasonic sensor | gpio
**HM330x** | SeedStudio Grove HM3301 particulate matter sensor | I^2^C
[**HMC5883L**](https://github.com/arendst/Tasmota/blob/development/tasmota/tasmota_xsns_sensor/xsns_101_hmc5883l.ino) | 3-Axis digital compass sensor | I^2^C
**[HLK-LD2410<br>HLK-LD2410B](HLK-LD2410)** | 24GHz mmWave presence sensor | serial
**[HLK-LD2410S](HLK-LD2410S)** | Low energy 24GHz mmWave presence sensor | serial
**[Honeywell HIH](Honeywell-HIH)** | Temperature and humidity sensor| I^2^C
**Honeywell HPMA115xx** | Particulate matter sensor| serial
**HTU21** | Temperature and humidity sensor| I^2^C
**HX711** | Load cell sensor| gpio
**[HRG15](HRG15)** | Solid state rain sensor| serial
[**I2S Audio**](I2S-Audio.md) | :material-cpu-32-bit: I2S audio DAC and microphone | I2s
[**iAQ-Core**](IAQ) | Indoor air quality sensor| I^2^C
**iEM3000** | Schenider Electric Modbus energy meter| serial
**INA219**<BR>**ISL28022** | High-side DC current and voltage sensor| I^2^C
**INA226** | High-side or Low-side DC current and voltage sensor| I^2^C
[**IR Remote**](IR-Remote) | IR transmitter and receiver
**K30, K70, S8** | SenseAir CO~2~ sensors | serial | 
[**LM75AD**<BR>**STDS75**(LM75AD) | Temperature sensor | I^2^C
[**LMT01**](LMT01) | Temperature sensor | gpio
[**MAX17043**](https://github.com/arendst/Tasmota/blob/development/tasmota/tasmota_xsns_sensor/xsns_110_max17043.ino) | LiPo fuel gauge | I^2^C
[**MAX31855**<br>**MAX6675**](MAX31855) | Thermocouple sensor | SPI
**MAX31865** | RTD temperature sensor amplifier | SPI
**MAX44009** | Ambient light sensor | I^2^C
[**MCP23008<BR>MCP23017<BR>MCP23S17**](MCP230xx) | I/O expander | I^2^C
**MCP2515** | CAN bus controller | SPI
[**MCP9808**](MCP9808) | Temperature sensor | I^2^C
[**ME007**](https://github.com/mathias-buder/water-level-measure) | Ultrasonic distance sensor | gpio
[**MFRC522**](MFRC522) | NFC tag reader| SPI
[**MGC3130**](MGC3130) | 3D tracking and gesture Controller
[**MH-Z19B**](MH-Z19B) | CO~2~ sensor
[**MLX90614**](MLX90614) | MLX9061X infrared thermometer| I^2^C
[**MLX90640**](MLX90640) | MLX90640 far infrared thermal sensor array| I^2^C
[**MPR121**](MPR121) | Proximity capacitive touch sensor controller (I^2^C)
[**MPU6050**](MPU-6050)| 3-axis gyroscope and 3-axis accelerometer sensor (I^2^C)
**MQ** | MQ sensors (MQ-02, MQ-03, MQ-04, MQ-05, MQ-06, MQ-07, MQ-08, MQ-09, MQ-131, MQ-135) | analog
**MS01** | Moisture sensor from Sonoff | 1wire
[**NeoPool**](NeoPool) | Sugar Valley NeoPool controller| serial
[**NRF24L01**](NRF24L01) | NRF24L01 as BLE-bridge for Mijia BT sensors| SPI
[**OpenTherm**](OpenTherm) | OpenTherm adapter| serial
[**P1 Smart Meter**](P1-Smart-Meter) | Energy meter | serial
[**PAJ7620**](PAJ7620) | Gesture & proximity detection sensor
[**PIR**](PIR-Motion-Sensors.md) | Passive infrared sensor| gpio
[**PCA9557**](PCA9557) | I/O expander | I^2^C
[**PCA9685**](PCA9685) | 16-channel, 12-bit PWM LED controller| I^2^C
[**PCA9632**](https://github.com/arendst/Tasmota/blob/development/tasmota/tasmota_xdrv_driver/xdrv_64_pca9632.ino) | 4-channel, 8-bit PWM LED controller| I^2^C
[**PCF8574(A)**](PCF8574) 8-port I/O expander | I^2^C
**PMS3003<BR>[PMS5003](https://www.superhouse.tv/38-diy-air-quality-sensor-part-1-basic-model/)<BR>PMS7003**<BR>**PMSx003T** | Particle concentration sensor | serial
[**PMSA003I**](https://github.com/arendst/Tasmota/blob/development/tasmota/tasmota_xsns_sensor/xsns_104_pmsa003i.ino) | Air quality sensor | I^2^C
[**PN532**](PN532) | NFC/RFID controller
[**PZEM-004<BR>PZEM-016**](PZEM-0XX) | Energy monitor| serial
**QMC5883L** | Magnetic field sensor | I^2^C
[**RCWL-0516**](RCWL-0516) |  Microwave radar presence detection
[**RDM6300**](RDM6300) | 125Khz RFID module
[**RF Transceiver**](RF-Transceiver) | IR receiver and/or transmitter
**RX-4M50RR30SF<BR>RX-AM8SF** | RF sensor receiver | gpio
**SCD30** | CO~2~ sensor| I^2^C
[**SCD40**<BR>**SCD41**](SCD4x) | CO~2~ sensor| I^2^C
**Eastron SDM72** | Modbus energy meter| serial
**Eastron SDM120** | Modbus energy meter| serial
**Eastron SDM220** | Modbus energy meter| serial
**Eastron SDM230** | Modbus energy meter| serial
**Eastron SDM630** | Modbus energy meter| serial
**YF-DN50** | Flow rate meter | gpio
[**SDS011<BR>SDS021**](SDS011) | Laser dust sensor
**SEN0390** |  Ambient light sensor| I^2^C
[**SEN5X**](https://blakadder.com/seeedstudio-grove-all-in-one-environmental-sensor-sen5x/) | All-in-one environmental sensor | I^2^C
**SGP30** | Gas and air Quality sensor| I^2^C
**SGP40** | Gas and air Quality sensor| I^2^C
[**SGP41**](https://github.com/arendst/Tasmota/pull/18880#issue-1757083089) | VOC and NOx sensor| I^2^C
**SHT1x** | Temperature and humidity sensor| I^2^C
[**SHT30**](SHT30) | Temperature and humidity sensor| I^2^C
**SHT4x** | Temperature and humidity sensor| I^2^C
**SI114x** | UV index, IR and visible light sensor | I^2^C
**Si7021** | Temperature and humidity sensor| I^2^C
[**SK6812**](SK6812.md) | Addressable LEDs
[**Smart Meter Interface**](Smart-Meter-Interface) | Smart Meter Interface | serial, gpio
[**SolaX X1**](SolaX-X1) | SolaX Power X1 inverter | serial
[**SPS30**](SPS30) | Particulate matter | sensor | I^2^C
**T6703**<BR>**T6713** | Telaire T6700 series CO~2~ sensor | I^2^C
[**TC74**](https://github.com/arendst/Tasmota/blob/development/tasmota/tasmota_xsns_sensor/xsns_108_tc74.ino) | Temperature sensor| I^2^C
[**Téléinfo**](Teleinfo) | French energy measuring system | serial
**TFMini** | TFmini, TFmini Plus, TFmini Plus (indoor Version), TFmini-S LiDAR module | serial
**TM1638** | 8 Switch, LED and 7-segment unit sensor| gpio
[**TSL2561**](TSL2561) | Luminosity sensor| I^2^C
**TSL2591** | Luminosity sensor| I^2^C
[**TX20<BR>TX23<BR>WS2300**](TX2x) | La Crosse TX2x / Technoline WS2300-15 anemometer (wind sensor) | gpio
[**VEML6070**](VEML6070) |  UV sensor| I^2^C
[**VEML6075**](VEML6075) |  UVA/UVB/UVINDEX sensor| I^2^C
[**VEML7700**](VEML7700) |  Ambient light intensity sensor| I^2^C
[**VL53L0x**](VL53Lxx) | Time of flight sensor| I^2^C
[**VL53L1x**](VL53Lxx) | Time of flight sensor| I^2^C
**[VINDRIKTNING](https://blakadder.com/vindriktning-tasmota/)** | IKEA VINDRIKTNING particle concentration sensor | serial
**WindMeter** | Analog cup anemometer
[**Winsen ZH03B**](https://github.com/arendst/Tasmota/pull/19850) | Particle concentration sensor | serial
[**WS2812B**](WS2812B-RGB-Shield) | Wemos shield with addressable LED
[**WS2812B<BR>WS2813B**](WS2812B-and-WS2813) | Addressable LEDs
**Xadow Grove Mutichannel Gas sensor** | Gas sensor | I^2^C
[**InvenSense ICP-10125**](https://https://gitlab.com/Parura57/icp10125-driver) | Barometer/pressure sensor | I^2^C

[Google Sheet list of supported peripherals](https://docs.google.com/spreadsheets/d/1VaZrCUjNosUQGYBX0pTVoY_rkSzEIcTP8K3052smOB4/edit?usp=sharing)

[sensor API Documentation](Sensor-API.md)

## Expanding Specific Devices

* [LEGO nightstand switch using Sonoff SV](https://jeff.noxon.cc/2018/11/21/lego-nightstand-light-switch/)
* [Add a physical button to Sonoff Basic](https://translate.google.com/translate?hl=en&sl=auto&tl=en&u=https%3A%2F%2Fwww.domo-blog.fr%2Fajouter-un-bouton-physique-au-sonoff-basic%2F)
* [Remote button for Sonoff](Control-a-Sonoff-using-a-remote-button)
* [Expand Sonoff S20 with a jack plug](https://github.com/arendst/Tasmota/issues/670)
* [Expand Sonoff 4CH with a jack plug](Expanding-4CH)
* [Modify KaKu to WKaKu Power Socket](devices/Modify-KaKu-to-WKaKu-Power-Socket.md)
* [GPIO Locations for some devices](Pinouts)
