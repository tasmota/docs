You can connect peripherals (sensors, displays, switches, LED lights, ...) to available pins of the device. [Read here](Expanding-Tasmota) for more. 

More about [general configuration](Sensor-Configuration) of peripherals.

### Supported peripherals
*Some of the articles were written originally for D1 mini but the information still applies except the wiring instructions*
- [**A4988**](A4988-Stepper-Motor-Controller) - Stepper Motor Controller 
- [**ADC**](ADC) - Analog input over A0 pin  
- **ADS1x15** - A/D Converter (I<sup>2</sup>C)
- [**AM2301 (DHT21), AM2302 (DHT22), AM2321**](AM2301) - Temperature and Humidity Sensor (single wire)
- [**AM312**](PIR-Motion-Sensors#AM312) - PIR Motion Sensor (single wire)<img src="https://i.postimg.cc/qRLyPy1n/APDS-9960-1-720x533.jpg" align=right>
- [**APDS-9960**](APDS-9960) -  Ambient Light, RGB Color and Proximity Sensor with Gesture Detection
- [**AZ 7798**](AZ-7798) - CO<sub>2</sub> Meter Datalogger
- [**BH1750**](BH1750) - Luminosity Sensor
- [**BMP280 (BMP085, BMP180)**](BME280) - Pressure Sensor
- [**BME280**](BME280) - Temperature, Humidity and Pressure Sensor
- [**BME680**](BME680) - Temperature, Humidity, Pressure and Gas Sensor
- [**Buzzer**](Buzzer) - Audio Signalling Device
- [**CC2530**](Zigbee) - Zigbee Adapter (serial)
- **CCS811** - Gas and Air Quality sensor (I<sup>2</sup>C)
- [**Chirp! Soil Moisture Sensor**](Moisture-Sensor-and-Chirp!-Sensor) - Moisture Sensor (I<sup>2</sup>C)
- [**DHT11**](DHT11) - Temperature and Humidity Sensor<img src="https://user-images.githubusercontent.com/5904370/53279561-cfb18480-3711-11e9-9889-76ab1d6eafcb.png" width="200" align="right">
- **[DS18x20](DS18x20)** - Temperature sensor (1-Wire)
- [**DS3231**](DS3231) - Real-Time-Clock (I<sup>2</sup>C)
- [**HM16/HM17**](iBeacon-driver) -  Bluetooth iBeacon reader (serial)
- **HR-E** - Water Meter Encoder interface (serial)
- [**HC-SR04 (HC-SR04P, JSN-SR04T)**](HC-SR04) - Ultrasonic Sensor
- [**HC-SR501**](PIR-Motion-Sensors#HC-SR501) - PIR Motion Sensor<img src="https://user-images.githubusercontent.com/5904370/53279530-8c571600-3711-11e9-85c0-27d35be2df48.png" width="200" align="right" />
- **[Honeywell HIH](Honeywell-HIH)** - Temperature and Humidity sensor (I<sup>2</sup>C)
- **Honeywell HPMA115xx** - Particulate Matter Sensor (serial)
- **HTU21** - Temperature and Humidity sensor (I<sup>2</sup>C)
- **HX711** - Load Cell sensor (single wire)
- **INA219** - High-Side DC Current and Voltage sensor (I<sup>2</sup>C)
- [**IR Remote**](IR-Remote) - IR transmitter and receiver
- **K30, K70, S8** - CO<sub>2</sub> sensor (I<sup>2</sup>C) - 
- [**LM75AD**](LM75AD) -  Temperature Sensor (I<sup>2</sup>C)
- **MAX31855** - Thermocouple Sensor (SPI)
- **MAX31865** - RTD Temperature Sensor Amplifier (SPI)
- **MAX44009** - Ambient Light Sensor (I<sup>2</sup>C)
- [**MCP23008 / MCP23017**](MCP230xx) -  I/O Expander (I<sup>2</sup>C)
- [**MGC3130**](MGC3130) - 3D Tracking and Gesture Controller<img src="https://user-images.githubusercontent.com/5904370/53279635-54040780-3712-11e9-8c83-970280003b6d.png" width="200" align="right" />
- [**MH-Z19B**](MH-Z19B) - CO<sub>2</sub> Sensor
- **MLX90614** - MLX IR Temperature sensor (I<sup>2</sup>C)
- [**MPR121**](MPR121) - Proximity Capacitive Touch Sensor Controller (I<sup>2</sup>C)
- **MPU6050** - 3-Axis Gyroscope and 3-Axis Accelerometer sensor (I<sup>2</sup>C)
- [**P1 Smart Meter**](P1-Smart-Meter) - Energy Meter (serial)
- [**PAJ7620**](PAJ7620) - Gesture & Proximity Detection Sensor
- [**PCA9685**](PCA9685) - 16-channel, 12-bit PWM LED controller (I<sup>2</sup>C)
- **PCF8574** 8-port I\/O Expander (I<sup>2</sup>C)
- **PMS3003-5003-7003** - Particle Concentration sensor (serial)
- [**PN532**](PN532) - NFC/RFID controller
- [**PZEM-0XX**](PZEM-0XX) - Energy Monitor (serial)<img src="https://user-images.githubusercontent.com/5904370/53279642-7433c680-3712-11e9-9aa2-7fd1adce3def.png" width="200" align="right" />
- [**RCWL-0516**](RCWL-0516) -  Microwave Radar Presence detection
- [**RDM6300**](RDM6300) - 125Khz RFID Module
- **RX-4M50RR30SF / RX-AM8SF** - RF Sensor receiver (single wire)
- **SCD30** - CO<sub>2</sub> sensor (I<sup>2</sup>C)
- **SDM120** - Modbus Energy Meter (serial)
- **SDM630** - Modbus Energy Meter (serial)
- [**SDS011 (SDS021)**](SDS011) - Laser Dust Sensor
- **SGP30** - Gas and Air Quality sensor (I<sup>2</sup>C)
- **SHT1x** - Temperature and Humidity sensor (I<sup>2</sup>C)
- [**SHT30**](Wemos-D1-Mini-and-SHT30-Shield-High-Precision-Humidity-&-Temperature) - Humidity & Temperature Sensor
- **SI114x** - UV Index, IR and Visible Light sensor (I<sup>2</sup>C)
- **Si7021** - Humidity and Temperature Sensor (I<sup>2</sup>C)
- [**Smart Meter Interface**](smart-meter-interface) - (serial)
- **SolaX X1** - SolaX X1 inverter (serial)
- **SPS30** - Particulate Matter (PM) - sensor (I<sup>2</sup>C)
- **TM1638** - 8 Switch, LED and 7 Segment Unit sensor (single wire)
- [**TSL2561**](TSL2561) - Luminosity Sensor (I<sup>2</sup>C)
- **TSL2591** - Luminosity Sensor (I<sup>2</sup>C)
- **TX20** - La Crosse Wind (Anemometer) - sensor (single wire)
- [**VEML6070**](VEML6070) -  UV Sensor (I<sup>2</sup>C)
- **VL53L0x** - Time of flight sensor (I<sup>2</sup>C)
- [**WS2812B**](WS2812B-RGB-Shield) - Wemos RGB LED Shield
- [**WS2812B/WS2813B**](WS2812B-and-WS2813) - LED Strip
- **Xadow (Grove) Mutichannel Gas Sensor** - gas sensor (I<sup>2</sup>C)

[Google Sheet list of supported peripherals](https://docs.google.com/spreadsheets/d/1VaZrCUjNosUQGYBX0pTVoY_rkSzEIcTP8K3052smOB4/edit?usp=sharing)

[Sensor API Documentation](Sensor-API)

## Expanding specific devices

  - [LEGO nightstand switch using Sonoff SV](https://jeff.noxon.cc/2018/11/21/lego-nightstand-light-switch/)
  - [Add a physical button to Sonoff Basic](https://translate.google.com/translate?hl=en&sl=auto&tl=en&u=https%3A%2F%2Fwww.domo-blog.fr%2Fajouter-un-bouton-physique-au-sonoff-basic%2F)
- [Remote button for Sonoff](Control-a-Sonoff-using-a-remote-button)
- [Expand Sonoff S20 with a jack plug](https://github.com/arendst/Tasmota/issues/670)
- [Expand Sonoff 4CH with a jack plug](Expanding-4CH)
- [Modify KaKu to WKaKu Power Socket](Modify-KaKu-to-WKaKu-Power-Socket)
- [GPIO Locations](GPIO-Locations)
