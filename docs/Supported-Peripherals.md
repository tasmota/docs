# Peripherals
!!! info "You can connect all kinds of peripherals (sensors, displays, switches, LED lights, ...) to available pins of your device or even create your own from a development board"

!!! tip
    A peripheral must have correctly wired power, GND and data pins to the device prior to booting in order for Tasmota to detect it and initialize it properly.

## Tasmota Settings
<img src="https://user-images.githubusercontent.com/5904370/68432161-2a154700-01b4-11ea-8ba9-adb7b717490d.png" style="float:right;height:15em;margin:10px 0">
Tasmota allows for easy selection of peripherals (sensors, switches, etc) and assignment to GPIO pins. 

Configuration is possible in the webUI ***Configuration - Configure Module*** page

or by using commands: [`Module`](Commands.md#module) and [`GPIO`](Commands.md#gpio), or [`Template`](Commands.md#template).

#### `Module`
First select desired module for the device (Wait for the restart). Depending on the type of [Module](Modules), only certain GPIO pins are user configurable. Module Generic (18) has all the GPIOs configurable.   

_[`Modules`](Commands.md#modules) shows supported modules_

#### `GPIO`
Assign a [component](Components) to a GPIO.
   
- `GPIO14 2` configures sensor AM2301 to GPIO14_    
- `Backlog GPIO14 5; GPIO4 6` sets I<sup>2</sup>C SCL to GPIO14 and I<sup>2</sup>C SDA to GPIO4
   Tasmota will auto-detect all connected and supported I<sup>2</sup>C devices. If you have conflicting I<sup>2</sup>C addresses see [I2CDevices](I2CDevices)

_[`GPIOs All`](Commands.md#gpios) shows list of all available components by name and index_

**For a peripheral to show up you may need to power cycle your device instead of a soft restart.**

#### `Template`
Instead of using `Module` and `GPIO` you can define everything using `Template`. [Read more...](Templates#template-configuration-with-commands)

### Additional Options

#### Measurement Units
Temperature units can be set to Celsius or Fahrenheit with [`SetOption8`](Commands.md#setoption8) command.

Pressure units can be set to hPa or mmHg with [`SetOption24`](Commands.md#setoption24) command. 
#### Update Interval
To change the update interval (TelePeriod) of MQTT messages change the [`TelePeriod`](Commands.md#teleperiod). Default interval is 300 seconds but can be set between 10 and 3600 seconds.    
`TelePeriod 10` will set the update interval to 10 seconds, so the sensor will update 6 times a minute.

#### Peripheral Specific
Some peripherals offer, or even require, additional commands. See [Commands](Commands.md#sensors) page for peripheral specific commands.

!!! tip
    To make a link between the different naming schemes the [Pin Definition overview](https://github.com/esp8266/esp8266-wiki/wiki/Pin-definition) in the ESP8266 wiki is quite helpful.

## Examples

#### Connect switch
If you take a Sonoff Basic and connect a switch between pin4 (GND) and pin5 (GPIO14) of the 5 pin programming header you now have a second switch connected to the device. You can set this through the module config page as option `Switch1 (9)` or from the command line with `gpio14 9`.

See [Buttons and Switches](../Buttons-and-Switches.md) for more information.

#### Connect jack
Instead of connecting a switch, you could connect a 4-pin 2.5mm jack, with the pins wired:  

|Jack|Pin|ESP8266|
|:-:|:-:|:-:|
tip|5 |GPIO14 
R1 | | no connection
R2 | 1 | GND
R3 | 4 | 3.3V

You can then plug a sensor into the jack like you would to a [Sonoff TH](../devices/Sonoff-TH.md) and define what sensor you have connected to GPIO14.


## Restrictions  

!!! danger
     If you can avoid it, don't use GPIOs: **0, 1, 2, 6-11, 15 and 16**. That leaves **4, 5, 12, 13, 14** as GPIOs without any constraints. **3** being RX is also good to avoid (PWM is not working on this GPIO).

Others ***can*** be used but you have to mind the constraints outlined in [this document](https://tttapa.github.io/ESP8266/Chap04%20-%20Microcontroller.html).

### Voltage and Current
!!! danger
    The ESP8266 is a 3.3V microcontroller, so its I/O operates at 3.3V as well. The pins are **not** 5V tolerant, applying more than 3.6V on any pin will release the [magic smoke](https://en.wikipedia.org/wiki/Magic_smoke) (fry the chip). The maximum current that can be drawn from a single GPIO pin is 12mA.

### Power Supply
> [!DANGER]

The [power supplied to the device](https://www.letscontrolit.com/wiki/index.php?title=Power) is **one of the most important elements** for stable device operation. Many devices on the market have barely adequate power supplies for normal operation. ***Connected peripherals may strain the ability of the power supply on the device to deliver appropriate power to all the components, both on-board as well as externally connected.***

Voltage regulation issues typically result in fatal exception [fault code](https://github.com/esp8266/Arduino/blob/master/doc/exception_causes.rst) `1`. You must ensure that the device receives sufficient power (current **and** appropriate voltage level). Take into account the current that each wired component (f.e. sensor) will draw from the device itself. 

### Electrical Considerations
When you switch a GPIO pin to an input and hang a long wire off of it, that wire can pick up stray signals and cause the voltage on the GPIO pin to vary. This can cause the system to think the switch has changed.

To fix this, there are several things you can do.

1. add a pull-up resistor
2. add a bypass capacitor
3. shielding on the wire
4. use twisted pair wiring

A pull-up resistor is a resistor connected between the GPIO pin and 3.3v. The exact value of this is not critical, 4.7k is a common value to use, as is 10k. This ensures that when the switch it open, the GPIO pin will go high.

A bypass capacitor is a small (pF range) capacitor that is connected between the GPIO and ground. This provides a path for any radio signals that are picked up by the wire to go to ground and not confuse the system.

Shielding or using twisted pair wiring are other ways to reduce the effect of radio signals on the system.

[Example for 10K Resistor](https://user-images.githubusercontent.com/35574450/39960640-8b2735ca-5626-11e8-8128-461b6d9976ad.png)
(issue[#2708](https://github.com/arendst/Tasmota/issues/2708#issuecomment-388574891))

# ESP8266 In Depth
Complete document available from https://tttapa.github.io/ESP8266/Chap04%20-%20Microcontroller.html
## Digital I/O
Just like a normal Arduino, the ESP8266 has digital input/output pins (I/O or GPIO, General Purpose Input/Output pins). As the name implies, they can be used as digital inputs to read a digital voltage, or as digital outputs to output either 0V (sink current) or 3.3V (source current).

### Usable Pins
The ESP8266 and ESP8285 have 17 GPIO pins (0-16) but several are [reserved or have constraints](https://i.imgur.com/IH1fYqF.jpg). Do not use any of the _**reserved**_ pins. If you do, you might crash your program. On the ESP8266, six pins (GPIO 6 - 11) are used to interface the flash memory (the small 8-legged chip usually right next to the ESP8266). The ESP8285 has its flash memory integrated into the chip which frees up GPIO 9 and 10.

GPIO 1 and 3 are used as TX and RX of the hardware Serial port (UART), so in most cases, you can’t use them as normal I/O while sending/receiving serial data.

#### Boot Mode Pins
Some I/O pins have a special function during boot: They select 1 of 3 boot modes:

GPIO15 |	GPIO0 |	GPIO2 |	Mode
---------------|-----------|------------|------------------------------------------------------------------
0V |	0V	| 3.3V	| Uart Bootloader
0V |	3.3V |	3.3V |	Boot sketch (SPI flash)
3.3V	| x|	x |	SDIO mode (not used for Arduino)

Note: you don’t have to add an external pull-up resistor to GPIO2, the internal one is enabled at boot.

We have to be sure that these conditions are met by adding external resistors, or the board manufacturer of your board has added them for you. This has some implications, however:

GPIO15 is always pulled low, so you can’t use the internal pull-up resistor. You have to keep this in mind when using GPIO15 as an input to read a switch or connect it to a device with an open-collector (or open-drain) output, like I²C.
GPIO0 is pulled high during normal operation, so you can’t use it as a Hi-Z input.
GPIO2 can’t be low at boot, so you can’t connect a switch to it.
Internal pull-up/-down resistors
GPIO 0-15 all have a built-in pull-up resistor, just like in an Arduino. GPIO16 has a built-in pull-down resistor.

### PWM
Unlike most Atmel chips (Arduino), the ESP8266 doesn’t support hardware PWM, however, software PWM is supported on all digital pins. The default PWM range is 10-bits @ 1kHz, but this can be changed (up to >14-bit@1kHz). Check [Restrictions](#restrictions).

### Analog Input
The ESP8266 has a single analog input, with an input range of 0 - 1.0V. If you supply 3.3V, for example, you will damage the chip. Some boards like the NodeMCU have an on-board resistive voltage divider, to get an easier 0 - 3.3V range. You could also just use a trimpot as a voltage divider.

The ADC (analog to digital converter) has a resolution of 10 bits.

## Communication 
### Serial
The ESP8266 has two hardware UARTS (Serial ports):
UART0 on pins 1 and 3 (TX0 and RX0 resp.), and UART1 on pins 2 and 8 (TX1 and RX1 resp.), however, GPIO8 is used to connect the flash chip. This means that UART1 can only transmit data.

UART0 also has hardware flow control on pins 15 and 13 (RTS0 and CTS0 resp.). These two pins can also be used as alternative TX0 and RX0 pins.

### I²C
ESP8266 doesn’t have a hardware TWI (Two Wire Interface) but it is implemented in software. This means that you can use pretty much any two digital pins. By default, the I²C library uses pin 4 as SDA and pin 5 as SCL. (The data sheet specifies GPIO2 as SDA and GPIO14 as SCL.) The maximum speed is approximately 450kHz.

### SPI
The ESP8266 has one SPI connection available to the user, referred to as HSPI. It uses GPIO14 as CLK, 12 as MISO, 13 as MOSI and 15 as Slave Select (SS). It can be used in both Slave and Master mode (in software).

### GPIO Overview
[NodeMCU Labelled Pin](https://techtutorialsx.com/2017/04/02/esp8266-nodemcu-pin-mappings/) | GPIO# | 	Function | 	State	 | Restrictions
-|-|-|-|-
D3 | 0 | 	Boot mode select	 | 3.3V	 | No Hi-Z
D10 | 1 | 	TX0 | 	-	 | Not usable during Serial transmission
D4 | 2 | 	Boot mode select TX1 | 	3.3V (boot only) | 	Don’t connect to ground at boot time Sends debug data at boot time
D9 | 3 | 	RX0 | 	-	 | Not usable during Serial transmission
D2 | 4 | 	SDA (I²C) | 	-	 | - 
D1 | 5 | 	SCL (I²C) | 	-	 | -
 x | 6 - 8  | 	Flash connection | 	x | 	Not usable, and not broken out
 x | 9, 10  | 	Flash connection * |  | 	*Only available on the ESP8285*
 x | 11 | 	Flash connection | 	x | 	Not usable, and not broken out
D6 | 12 | MISO (SPI) | 	- | 	-
D7 | 13 | 	MOSI (SPI)	 | - | 	-
D5 | 14 | 	SCK (SPI)	 | - | 	-
D8 | 15 | 	SS (SPI)	 | 0V	 | Pull-up resistor not usable (extern pull down resistor)
D0 | 16 | 	Wake up from sleep	 | - | 	No pull-up resistor, but pull-down instead Should be connected to RST to wake up

<!-- 
I2C: 
<img src="https://img.shields.io/static/v1?label=&message=i2c&color=blue" style="float:right"> </img> 

GPIO:
 <img src="https://img.shields.io/static/v1?label=&message=gpio&color=purple"  style="float:right"> </img> 

ADC:
 <img src="https://img.shields.io/static/v1?label=&message=adc&color=orange"  style="float:right"> </img> 

Serial:
 <img src="https://img.shields.io/static/v1?label=&message=serial&color=seagreen"  style="float:right"> </img> 

Serial:
 <img src="https://img.shields.io/static/v1?label=&message=spi&color=slategrey"  style="float:right"> </img> 

Tuya:
 <img src="https://img.shields.io/static/v1?label=&message=tuya&color=orangered"  style="float:right"> </img> 
 -->

# Supported Peripherals
Name|Description|Image
---|---|---
[**A4988**](A4988-Stepper-Motor-Controller)|Stepper Motor Controller 
[**ADC**](ADC) | Analog input over A0 pin  
**ADS1x15** | A/D Converter 
**AHT10/AHT15** | Asair AHT10 / AHT15 Temperature and Humidity Sensor (I<sup>2</sup>C)
[**AM2301 (DHT21), AM2302 (DHT22), AM2321**](AM2301) | Temperature and Humidity Sensor (gpio)|<img src="https://user-images.githubusercontent.com/5904370/53279561-cfb18480-3711-11e9-9889-76ab1d6eafcb.png" style="width:50px"></img>
[**APDS-9960**](APDS-9960) |  Ambient Light, RGB Color and Proximity Sensor with Gesture Detection  | <img src="https://i.postimg.cc/qRLyPy1n/APDS-9960-1-720x533.jpg" style="width:30px"></img>
[**AZ 7798**](AZ-7798) | CO<sub>2</sub> Meter Datalogger
[**BH1750**](BH1750) | Luminosity Sensor
[**BMP280 (BMP085, BMP180)**](BME280) | Pressure Sensor
[**BME280**](BME280) | Temperature, Humidity and Pressure Sensor
[**BME680**](BME680) | Temperature, Humidity, Pressure and Gas Sensor
[**Buzzer**](Buzzer) | Audio Signalling Device
[**CC2530**](CC2530) | TI CC2530 Zigbee Adapter (serial)
**CCS811** | Gas and Air Quality sensor (I<sup>2</sup>C)
[**Chirp! Soil Moisture Sensor**](Moisture-Sensor-and-Chirp!-Sensor) | Moisture Sensor (I<sup>2</sup>C)
[**DHT11**](DHT11) | Temperature and Humidity Sensor
**DHT12** |
**[DS18x20](DS18x20)** | Temperature sensor (1-Wire)
**DS1624/DS1621** | Temperature sensor (1-Wire)
[**DS3231**](DS3231) | Real-Time-Clock (I<sup>2</sup>C)
**F&F LE-01MR** | F&F LE-01MR Single Phase Modbus Energy meter
[**GPS-NTP-server**](GPS-NTP-server) | GPS-NTP-server (serial)
**HDC1080** | Texas Instruments HDC1080 Humidity and Temperature Sensor (I<sup>2</sup>C)
**[HM-10](HM-10)** |  BLE Bluetooth gateway (serial)
**[HM-17/HM-16](HM-17)** |  Bluetooth iBeacon reader (serial)
**HR-E** | Water Meter Encoder interface (serial)
**HRXL** | MaxBotix HRXL line of Sonar Ranging Sensors (gpio)
**[HC-SR04 (HC-SR04P, JSN-SR04T)](HC-SR04)** | Ultrasonic Sensor
**[Honeywell HIH](Honeywell-HIH)** | Temperature and Humidity sensor (I<sup>2</sup>C)
**Honeywell HPMA115xx** | Particulate Matter Sensor (serial)
**HTU21** | Temperature and Humidity sensor (I<sup>2</sup>C)
**HX711** | Load Cell sensor (gpio)
**INA219** | High-Side DC Current and Voltage sensor (I<sup>2</sup>C)
[**IR Remote**](IR-Remote) | IR transmitter and receiver
**K30, K70, S8** | CO<sub>2</sub> sensor (I<sup>2</sup>C) | 
[**LM75AD**](LM75AD) |  Temperature Sensor (I<sup>2</sup>C)
**MAX31855** | Thermocouple Sensor (SPI)
**MAX31865** | RTD Temperature Sensor Amplifier (SPI)
**MAX44009** | Ambient Light Sensor (I<sup>2</sup>C)
[**MCP23008 / MCP23017**](MCP230xx) |  I/O Expander (I<sup>2</sup>C)
[**MGC3130**](MGC3130) | 3D Tracking and Gesture Controller
[**MH-Z19B**](MH-Z19B) | CO<sub>2</sub> Sensor |<img src="https://user-images.githubusercontent.com/5904370/53279635-54040780-3712-11e9-8c83-970280003b6d.png" style="width:50px"></img>
[**MI-HM10**](MI-HM10) | BLE-Bridge via HM-10
[**MLX90614**](MLX90614) | MLX9061X Infrared Thermometer (I<sup>2</sup>C) | <img src="https://github.com/tasmota/docs/blob/master_media/mlx90614-1.jpg?raw=true" style="width:30px"></img>
[**NRF24L01**](NRF24L01) | NRF24L01 as BLE-bridge for Mijia BT sensors (SPI)
[**MPR121**](MPR121) | Proximity Capacitive Touch Sensor Controller (I<sup>2</sup>C)
[**MPU6050**](MPU-6050)| 3-Axis Gyroscope and 3-Axis Accelerometer sensor (I<sup>2</sup>C)
[**P1 Smart Meter**](P1-Smart-Meter) | Energy Meter (serial)
[**PAJ7620**](PAJ7620) | Gesture & Proximity Detection Sensor
[**PIR**](PIR-Motion-Sensors#AM312) | Passive Infrared Sensor (gpio) | <img src="https://user-images.githubusercontent.com/5904370/53279530-8c571600-3711-11e9-85c0-27d35be2df48.png"  style="width:1.5em"></img>
[**PCA9685**](PCA9685) | 16-channel, 12-bit PWM LED controller (I<sup>2</sup>C)
**PCF8574** | 8-port IO Expander (I<sup>2</sup>C) 
**PMS3003-5003-7003** | Particle Concentration sensor (serial)
[**PN532**](PN532) | NFC/RFID controller
[**PZEM-0XX**](PZEM-0XX) | Energy Monitor (serial) | <img src="https://user-images.githubusercontent.com/5904370/53279642-7433c680-3712-11e9-9aa2-7fd1adce3def.png"  style="width:1.5em"></img>
[**RCWL-0516**](RCWL-0516) |  Microwave Radar Presence detection
[**RDM6300**](RDM6300) | 125Khz RFID Module
**RX-4M50RR30SF / RX-AM8SF** | RF Sensor receiver (gpio)
**SCD30** | CO<sub>2</sub> sensor (I<sup>2</sup>C)
**Eastron SDM120** | Modbus Energy Meter (serial)
**Eastron SDM630** | Modbus Energy Meter (serial)
[**SDS011 (SDS021)**](SDS011) | Laser Dust Sensor
**SGP30** | Gas and Air Quality sensor (I<sup>2</sup>C)
**SHT1x** | Temperature and Humidity sensor (I<sup>2</sup>C)
[**SHT30**](SHT30) | Humidity & Temperature Sensor
**SI114x** | UV Index, IR and Visible Light sensor (I<sup>2</sup>C)
**Si7021** | Humidity and Temperature Sensor (I<sup>2</sup>C)
[**Smart Meter Interface**](Smart-Meter-Interface) | (serial)
**SolaX X1** | SolaX X1 inverter (serial)
**SPS30** | Particulate Matter (PM) | sensor (I<sup>2</sup>C)
**TM1638** | 8 Switch, LED and 7 Segment Unit sensor (gpio)
[**TSL2561**](TSL2561) | Luminosity Sensor (I<sup>2</sup>C)
**TSL2591** | Luminosity Sensor (I<sup>2</sup>C)
[**TX2x**](TX2x) | La Crosse TX2x Series Anemometer | sensor (gpio)
[**VEML6070**](VEML6070) |  UV Sensor (I<sup>2</sup>C)
[**VL53L0x**](VL53L0x) | Time of flight sensor (I<sup>2</sup>C)
[**WS2812B**](WS2812B-RGB-Shield) | Wemos RGB LED Shield
[**WS2812B/WS2813B**](WS2812B-and-WS2813) | LED Strip
**Xadow (Grove) Mutichannel Gas Sensor** | gas sensor (I<sup>2</sup>C)

[Google Sheet list of supported peripherals](https://docs.google.com/spreadsheets/d/1VaZrCUjNosUQGYBX0pTVoY_rkSzEIcTP8K3052smOB4/edit?usp=sharing)

[Sensor API Documentation](Sensor-API)

## Expanding Specific Devices

* [LEGO nightstand switch using Sonoff SV](https://jeff.noxon.cc/2018/11/21/lego-nightstand-light-switch/)
* [Add a physical button to Sonoff Basic](https://translate.google.com/translate?hl=en&sl=auto&tl=en&u=https%3A%2F%2Fwww.domo-blog.fr%2Fajouter-un-bouton-physique-au-sonoff-basic%2F)
* [Remote button for Sonoff](Control-a-Sonoff-using-a-remote-button)
* [Expand Sonoff S20 with a jack plug](https://github.com/arendst/Tasmota/issues/670)
* [Expand Sonoff 4CH with a jack plug](Expanding-4CH)
* [Modify KaKu to WKaKu Power Socket](/devices/Modify-KaKu-to-WKaKu-Power-Socket)
* [GPIO Locations](GPIO-Locations)
