!!! info "**Component** is anything wired to the ESP8266/ESP8285 chip to be controlled by or send data to it."

<a href="../_media/components.png" target="_blank"><img src="../_media/components.png" style="float:right;height:10em;margin:10px"></img></a>

Components can be: buttons, switches, relays, LEDs, sensors, displays, MCU units, etc. Every component is assigned in the device template to the GPIO it is wired (connected) to.

Every Tasmota device has some components configured by default. Most often there is a relay, a button and a LED configured as is the case for a Sonoff Basic in the following image.

!!! bug
    Tasmota 9.1 completely redesigned GPIO mapping to allow for future expansion. Read more about the [GPIO Conversion](GPIO-Conversion.md)

## Assigning Components
<img src="../_media/components2.png" style="float:right;height:10em;margin:10px"></img>
If you wish to expand a device with a peripheral component, after properly wiring everything, you need to assign it to a free GPIO in **Configure Module** page or use command [`GPIO<x>`](Commands.md#gpio).

Read more about [peripherals](Supported-Peripherals.md).

!!! tip
     GPIOs configured as User (1) are the GPIOs that can be assigned to components in the **Configure Module** page.

## GPIO Overview

### Tasmota

| #    | UI Label       | Comment                                                                                                 |
|------|----------------|---------------------------------------------------------------------------------------------------------|
| 0    | None           | Not used                                                                                                |
| 32   | Button1        | Button active low, internal pull-up resistor                                                                                               |
| 33   | Button2        | Button active low, internal pull-up resistor                                                                                               |
| 34   | Button3        | Button active low, internal pull-up resistor                                                                                               |
| 35   | Button4        | Button active low, internal pull-up resistor                                                                                               |
| 36   | Button5        | Button active low, internal pull-up resistor                                                                                               |
| 37   | Button6        | Button active low, internal pull-up resistor                                                                                               |
| 38   | Button7        | Button active low, internal pull-up resistor                                                                                               |
| 39   | Button8        | Button active low, internal pull-up resistor                                                                                               |
| 64   | Button_n1      | Button active low, no internal pull-up resistor                                                                                               |
| 65   | Button_n2      | Button active low, no internal pull-up resistor                                                                                               |
| 66   | Button_n3      | Button active low, no internal pull-up resistor                                                                                               |
| 67   | Button_n4      | Button active low, no internal pull-up resistor                                                                                               |
| 68   | Button_n5      | Button active low, no internal pull-up resistor                                                                                               |
| 69   | Button_n6      | Button active low, no internal pull-up resistor                                                                                               |
| 70   | Button_n7      | Button active low, no internal pull-up resistor                                                                                               |
| 71   | Button_n8      | Button active low, no internal pull-up resistor                                                                                               |
| 96   | Button_i1      | Button inverted, active high with internal pull-up resistor                                                                                              |
| 97   | Button_i2      | Button inverted, active high with internal pull-up resistor                                                                                              |
| 98   | Button_i3      | Button inverted, active high with internal pull-up resistor                                                                                              |
| 99   | Button_i4      | Button inverted, active high with internal pull-up resistor                                                                                              |
| 100  | Button_i5      | Button inverted, active high with internal pull-up resistor                                                                                              |
| 101  | Button_i6      | Button inverted, active high with internal pull-up resistor                                                                                              |
| 102  | Button_i7      | Button inverted, active high with internal pull-up resistor                                                                                              |
| 103  | Button_i8      | Button inverted, active high with internal pull-up resistor                                                                                              |
| 128  | Button_in1     | Button inverted, active high no internal pull-up resistor                                                                                              |
| 129  | Button_in2     | Button inverted, active high no internal pull-up resistor                                                                                              |
| 130  | Button_in3     | Button inverted, active high no internal pull-up resistor                                                                                              |
| 131  | Button_in4     | Button inverted, active high no internal pull-up resistor                                                                                              |
| 132  | Button_in5     | Button inverted, active high no internal pull-up resistor                                                                                              |
| 133  | Button_in6     | Button inverted, active high no internal pull-up resistor                                                                                              |
| 134  | Button_in7     | Button inverted, active high no internal pull-up resistor                                                                                              |
| 135  | Button_in8     | Button inverted, active high no internal pull-up resistor                                                                                              |
| 160  | Switch1        | Switch, internal pull-up resistor                                                                    |
| 161  | Switch2        | Switch, internal pull-up resistor                                                                    |
| 162  | Switch3        | Switch, internal pull-up resistor                                                                    |
| 163  | Switch4        | Switch, internal pull-up resistor                                                                    |
| 164  | Switch5        | Switch, internal pull-up resistor                                                                    |
| 165  | Switch6        | Switch, internal pull-up resistor                                                                    |
| 166  | Switch7        | Switch, internal pull-up resistor                                                                    |
| 167  | Switch8        | Switch, internal pull-up resistor                                                                    |
| 192  | Switch_n1      | Switch, no pull-up resistor                                                                    |
| 193  | Switch_n2      | Switch, no pull-up resistor                                                                    |
| 194  | Switch_n3      | Switch, no pull-up resistor                                                                    |
| 195  | Switch_n4      | Switch, no pull-up resistor                                                                    |
| 196  | Switch_n5      | Switch, no pull-up resistor                                                                    |
| 197  | Switch_n6      | Switch, no pull-up resistor                                                                    |
| 198  | Switch_n7      | Switch, no pull-up resistor                                                                    |
| 199  | Switch_n8      | Switch, no pull-up resistor                                                                    |
| 224  | Relay1         | Relay                                                                                              |
| 225  | Relay2         | Relay                                                                                              |
| 226  | Relay3         | Relay                                                                                              |
| 227  | Relay4         | Relay                                                                                              |
| 228  | Relay5         | Relay                                                                                              |
| 229  | Relay6         | Relay                                                                                              |
| 230  | Relay7         | Relay                                                                                              |
| 231  | Relay8         | Relay                                                                                              |
| 255  | User           | User pin                                                                                                |
| 256  | Relay_i1       | Relay inverted                                                                                              |
| 257  | Relay_i2       | Relay inverted                                                                                              |
| 258  | Relay_i3       | Relay inverted                                                                                              |
| 259  | Relay_i4       | Relay inverted                                                                                              |
| 260  | Relay_i5       | Relay inverted                                                                                              |
| 261  | Relay_i6       | Relay inverted                                                                                              |
| 262  | Relay_i7       | Relay inverted                                                                                              |
| 263  | Relay_i8       | Relay inverted                                                                                              |
| 288  | Led1           | 4 x Leds                                                                                                |
| 289  | Led2           | 4 x Leds                                                                                                |
| 290  | Led3           | 4 x Leds                                                                                                |
| 291  | Led4           | 4 x Leds                                                                                                |
| 320  | Led_i1         | 4 x Leds                                                                                                |
| 321  | Led_i2         | 4 x Leds                                                                                                |
| 322  | Led_i3         | 4 x Leds                                                                                                |
| 323  | Led_i4         | 4 x Leds                                                                                                |
| 352  | Counter1       | 4 x Counter                                                                                             |
| 353  | Counter2       | 4 x Counter                                                                                             |
| 354  | Counter3       | 4 x Counter                                                                                             |
| 355  | Counter4       | 4 x Counter                                                                                             |
| 384  | Counter_n1     | 4 x Counter                                                                                             |
| 385  | Counter_n2     | 4 x Counter                                                                                             |
| 386  | Counter_n3     | 4 x Counter                                                                                             |
| 387  | Counter_n4     | 4 x Counter                                                                                             |
| 416  | PWM1           | 5 x PWM                                                                                                 |
| 417  | PWM2           | 5 x PWM                                                                                                 |
| 418  | PWM3           | 5 x PWM                                                                                                 |
| 419  | PWM4           | 5 x PWM                                                                                                 |
| 420  | PWM5           | 5 x PWM                                                                                                 |
| 448  | PWM_i1         | 5 x PWM                                                                                                 |
| 449  | PWM_i2         | 5 x PWM                                                                                                 |
| 450  | PWM_i3         | 5 x PWM                                                                                                 |
| 451  | PWM_i4         | 5 x PWM                                                                                                 |
| 452  | PWM_i5         | 5 x PWM                                                                                                 |
| 480  | Buzzer         | Buzzer                                                                                                  |
| 512  | Buzzer_i       | Buzzer                                                                                                  |
| 544  | LedLink        | Link led                                                                                                |
| 576  | LedLink_i      | Link led                                                                                                |
| 608  | I2C SCL1       | Software I2C                                                                                            |
| 640  | I2C SDA1       | Software I2C                                                                                            |
| 672  | SPI MISO1      | Hardware SPI                                                                                            |
| 704  | SPI MOSI1      | Hardware SPI                                                                                            |
| 736  | SPI CLK1       | Hardware SPI                                                                                            |
| 768  | SPI CS1        | Hardware SPI                                                                                            |
| 800  | SPI DC1        | Hardware SPI                                                                                            |
| 832  | SSPI MISO      | Software SPI                                                                                            |
| 864  | SSPI MOSI      | Software SPI                                                                                            |
| 896  | SSPI SCLK      | Software SPI                                                                                            |
| 928  | SSPI CS        | Software SPI                                                                                            |
| 960  | SSPI DC        | Software SPI                                                                                            |
| 992  | Backlight      | Display backlight control                                                                               |
| 1024 | Display Rst    | OLED Display Reset                                                                                      |
| 1056 | IRsend         | IR interface                                                                                            |
| 1088 | IRrecv         | IR interface                                                                                            |
| 1120 | RFSend         | RF interface                                                                                            |
| 1152 | RFrecv         | RF interface                                                                                            |
| 1184 | DHT11          | DHT11 DHT21 DHT22 AM2301 AM2302 AM2321                                                                  |
| 1216 | AM2301         | DHT11 DHT21 DHT22 AM2301 AM2302 AM2321                                                                  |
| 1248 | SI7021         | DHT11 DHT21 DHT22 AM2301 AM2302 AM2321                                                                  |
| 1280 | DHT11_o        | DHT11 DHT21 DHT22 AM2301 AM2302 AM2321                                                                  |
| 1312 | DS18x20        | DS18B20 or DS18S20                                                                                      |
| 1344 | DS18x20_o      | DS18B20 or DS18S20                                                                                      |
| 1376 | WS2812         | WS2812 Led string                                                                                       |
| 1408 | MHZ Tx         | MH-Z19 Serial interface                                                                                 |
| 1440 | MHZ Rx         | MH-Z19 Serial interface                                                                                 |
| 1472 | PZEM0XX Tx     | PZEM Serial Modbus interface                                                                            |
| 1504 | PZEM004 Rx     | PZEM Serial Modbus interface                                                                            |
| 1536 | PZEM016 Rx     | PZEM Serial Modbus interface                                                                            |
| 1568 | PZEM017 Rx     | PZEM Serial Modbus interface                                                                            |
| 1600 | SAir Tx        | SenseAir Serial interface                                                                               |
| 1632 | SAir Rx        | SenseAir Serial interface                                                                               |
| 1664 | PMS5003 Tx     | Plantower PMS5003 Serial interface                                                                      |
| 1696 | PMS5003 Rx     | Plantower PMS5003 Serial interface                                                                      |
| 1728 | SDS0X1 Tx      | Nova Fitness SDS011 Serial interface                                                                    |
| 1760 | SDS0X1 Rx      | Nova Fitness SDS011 Serial interface                                                                    |
| 1792 | SerBr Tx       | Serial Bridge Serial interface                                                                          |
| 1824 | SerBr Rx       | Serial Bridge Serial interface                                                                          |
| 1856 | SR04 Tri/TX    | SR04 interface                                                                                          |
| 1888 | SR04 Ech/RX    | SR04 interface                                                                                          |
| 1920 | SDMx20 Tx      | SDM120 Serial interface                                                                                 |
| 1952 | SDMx20 Rx      | SDM120 Serial interface                                                                                 |
| 1984 | SDM630 Tx      | SDM630 Serial interface                                                                                 |
| 2016 | SDM630 Rx      | SDM630 Serial interface                                                                                 |
| 2048 | TM1638 CLK     | TM1638 interface                                                                                        |
| 2080 | TM1638 DIO     | TM1638 interface                                                                                        |
| 2112 | TM1638 STB     | TM1638 interface                                                                                        |
| 2144 | MP3 Player     | RB-DFR-562 DFPlayer Mini MP3 Player                                                                     |
| 2176 | HX711 SCK      | HX711 Load Cell interface                                                                               |
| 2208 | HX711 DAT      | HX711 Load Cell interface                                                                               |
| 2240 | TX2x           | TX20/TX23 Transmission Pin                                                                              |
| 2272 | Tuya Tx        | Tuya Serial interface                                                                                   |
| 2304 | Tuya Rx        | Tuya Serial interface                                                                                   |
| 2336 | MGC3130 Xfr    | MGC3130 interface                                                                                       |
| 2368 | MGC3130 Rst    | MGC3130 interface                                                                                       |
| 2400 | RF Sensor      | Rf receiver with sensor decoding                                                                        |
| 2432 | AZ Tx          | AZ-Instrument 7798 Serial interface                                                                     |
| 2464 | AZ Rx          | AZ-Instrument 7798 Serial interface                                                                     |
| 2496 | MX31855 CS     | MAX31855 Serial interface                                                                               |
| 2528 | MX31855 CLK    | MAX31855 Serial interface                                                                               |
| 2560 | MX31855 DO     | MAX31855 Serial interface                                                                               |
| 2592 | HLWBL SEL      | HLW8012/HJL-01/BL0937 energy monitoring                                                                 |
| 2624 | HLWBL SEL_i    | HLW8012/HJL-01/BL0937 energy monitoring                                                                 |
| 2656 | HLWBL CF1      | HLW8012/HJL-01/BL0937 energy monitoring                                                                 |
| 2688 | HLW8012 CF     | HLW8012/HJL-01/BL0937 energy monitoring                                                                 |
| 2720 | BL0937 CF      | HLW8012/HJL-01/BL0937 energy monitoring                                                                 |
| 2752 | MCP39F5 Tx     | MCP39F501 Energy monitoring (Shelly2)                                                                   |
| 2784 | MCP39F5 Rx     | MCP39F501 Energy monitoring (Shelly2)                                                                   |
| 2816 | MCP39F5 Rst    | MCP39F501 Energy monitoring (Shelly2)                                                                   |
| 2848 | PN532 Tx       | PN532 NFC Serial interface                                                                              |
| 2880 | PN532 Rx       | PN532 NFC Serial interface                                                                              |
| 2912 | SM16716 CLK    | SM16716 SELECT                                                                                          |
| 2944 | SM16716 DAT    | SM16716 SELECT                                                                                          |
| 2976 | SM16716 PWR    | SM16716 SELECT                                                                                          |
| 3008 | MY92x1 DI      | my92x1 PWM controller                                                                                   |
| 3040 | MY92x1 DCKI    | my92x1 PWM controller                                                                                   |
| 3072 | CSE7766 Tx     | CSE7766 Serial interface (S31 and Pow R2)                                                               |
| 3104 | CSE7766 Rx     | CSE7766 Serial interface (S31 and Pow R2)                                                               |
| 3136 | ALux IrRcv     | Arilux RF Receive input                                                                                 |
| 3168 | ALux IrSel     | Arilux RF Receive input                                                                                 |
| 3200 | Serial Tx      | Serial interface                                                                                        |
| 3232 | Serial Rx      | Serial interface                                                                                        |
| 3264 | RotaryA1       | Rotary switch                                                                                           |
| 3265 | RotaryA2       | Rotary switch                                                                                           |
| 3296 | RotaryB1       | Rotary switch                                                                                           |
| 3297 | RotaryB2       | Rotary switch                                                                                           |
| 3328 | ADC Joystick   | Analog joystick                                                                                         |
| 3360 | MX31865 CS1    | MAX31865 Chip Select                                                                                    |
| 3361 | MX31865 CS2    | MAX31865 Chip Select                                                                                    |
| 3362 | MX31865 CS3    | MAX31865 Chip Select                                                                                    |
| 3363 | MX31865 CS4    | MAX31865 Chip Select                                                                                    |
| 3364 | MX31865 CS5    | MAX31865 Chip Select                                                                                    |
| 3365 | MX31865 CS6    | MAX31865 Chip Select                                                                                    |
| 3392 | HRE Clock      | HR-E Water Meter                                                                                        |
| 3424 | HRE Data       | HR-E Water Meter                                                                                        |
| 3456 | ADE7953 IRQ1   | ADE7953 IRQ                                                                                             |
| 3457 | ADE7953 IRQ2   | ADE7953 IRQ                                                                                             |
| 3488 | SolaxX1 Tx     | Solax Inverter Serial interface                                                                         |
| 3520 | SolaxX1 Rx     | Solax Inverter Serial interface                                                                         |
| 3552 | Zigbee Tx      | Zigbee Serial interface                                                                                 |
| 3584 | Zigbee Rx      | Zigbee Serial interface                                                                                 |
| 3616 | RDM6300 RX     | RDM6300 RX                                                                                              |
| 3648 | iBeacon TX     | HM17 IBEACON Serial interface                                                                           |
| 3680 | iBeacon RX     | HM17 IBEACON Serial interface                                                                           |
| 3712 | A4988 DIR      | A4988 interface                                                                                         |
| 3744 | A4988 STP      | A4988 interface                                                                                         |
| 3776 | A4988 ENA      | A4988 interface                                                                                         |
| 3808 | A4988 MS11     | A4988 interface                                                                                         |
| 3809 | A4988 MS12     | A4988 interface                                                                                         |
| 3810 | A4988 MS13     | A4988 interface                                                                                         |
| 3840 | Output Hi      | Fixed output state                                                                                      |
| 3872 | Output Lo      | Fixed output state                                                                                      |
| 3904 | DDS238-2 Tx    | DDS2382 Serial interface                                                                                |
| 3936 | DDS238-2 Rx    | DDS2382 Serial interface                                                                                |
| 3968 | DDSU666 Tx     | DDSU666 Serial interface                                                                                |
| 4000 | DDSU666 Rx     | DDSU666 Serial interface                                                                                |
| 4032 | SM2135 Clk     | SM2135 PWM controller                                                                                   |
| 4064 | SM2135 Dat1    | SM2135 PWM controller                                                                                   |
| 4065 | SM2135 Dat2    | SM2135 PWM controller                                                                                   |
| 4066 | SM2135 Dat3    | SM2135 PWM controller                                                                                   |
| 4067 | SM2135 Dat4    | SM2135 PWM controller                                                                                   |
| 4068 | SM2135 Dat5    | SM2135 PWM controller                                                                                   |
| 4069 | SM2135 Dat6    | SM2135 PWM controller                                                                                   |
| 4070 | SM2135 Dat7    | SM2135 PWM controller                                                                                   |
| 4096 | DeepSleep      | Kill switch for deepsleep                                                                               |
| 4128 | EXS Enable     | EXS MCU Enable                                                                                          |
| 4160 | Client TX      | Client Serial interface                                                                                 |
| 4192 | Client RX      | Client Serial interface                                                                                 |
| 4224 | Client RST     | Client Reset                                                                                            |
| 4256 | Client RST_i   | Client Reset                                                                                            |
| 4288 | HPMA Rx        | Honeywell HPMA115S0 Serial interface                                                                    |
| 4320 | HPMA Tx        | Honeywell HPMA115S0 Serial interface                                                                    |
| 4352 | GPS RX         | GPS Serial interface                                                                                    |
| 4384 | GPS TX         | GPS Serial interface                                                                                    |
| 4416 | HM10 RX        | HM10-BLE-Mijia-bridge Serial interface                                                                  |
| 4448 | HM10 TX        | HM10-BLE-Mijia-bridge Serial interface                                                                  |
| 4480 | LE-01MR Rx     | F&F LE-01MR energy meter                                                                                |
| 4512 | LE-01MR Tx     | F&F LE-01MR energy meter                                                                                |
| 4544 | CC1101 GDO0    | CC1101 Serial interface                                                                                 |
| 4576 | CC1101 GDO2    | CC1101 Serial interface                                                                                 |
| 4608 | HRXL Rx        | Data from MaxBotix HRXL sonar range sensor                                                              |
| 4640 | MOODL Tx       | ElectriQ iQ-wifiMOODL Serial TX                                                                         |
| 4672 | AS3935         | Franklin Lightning Sensor                                                                               |
| 4704 | ADC Input      | Analog input                                                                                            |
| 4736 | ADC Temp       | Analog Thermistor                                                                                       |
| 4768 | ADC Light      | Analog Light sensor                                                                                     |
| 4800 | ADC Button     | Analog Button                                                                                           |
| 4832 | ADC Button_i   | Analog Button                                                                                           |
| 4864 | ADC Range      | Analog Range                                                                                            |
| 4896 | ADC CT Power   | ANalog Current                                                                                          |
| 4928 | OpenTherm RX   | OpenTherm Boiler TX pin                                                                                 |
| 4960 | OpenTherm TX   | OpenTherm Boiler TX pin                                                                                 |
| 4992 | WindMeter Spd  | WindMeter speed counter pin                                                                             |
| 5024 | Button_tc      | Touch pin as button                                                                                     |
| 5056 | BL0940 Rx      | BL0940 serial interface                                                                                 |
| 5088 | TCP Tx         | TCP to serial bridge                                                                                    |
| 5120 | TCP Rx         | TCP to serial bridge                                                                                    |
| 5152 | TInfo Rx       | Teleinfo telemetry data receive pin                                                                     |
| 5184 | TInfo EN       | Teleinfo Enable Receive Pin                                                                             |
| 5216 | LMT01 Pulse    | LMT01 input counting pin                                                                                |
| 5248 | iEM3000 TX     | IEM3000 Serial interface                                                                                |
| 5280 | iEM3000 RX     | IEM3000 Serial interface                                                                                |
| 5312 | Zigbee Rst1    | Zigbee reset                                                                                            |
| 5313 | Zigbee Rst2    | Zigbee reset                                                                                            |
| 5344 | DYP Rx         |                                                                                                         |
| 5376 | MiEl HVAC Tx   | Mitsubishi Electric HVAC                                                                                |
| 5408 | MiEl HVAC Rx   | Mitsubishi Electric HVAC                                                                                |
| 5440 | WE517 Tx       | ORNO WE517 Serial interface                                                                             |
| 5472 | WE517 Rx       | ORNO WE517 Serial interface                                                                             |
| 5504 | AS608 Tx       | Serial interface AS608 / R503                                                                           |
| 5536 | AS608 Rx       | Serial interface AS608 / R503                                                                           |
| 5568 | SHD Boot 0     |                                                                                                         |
| 5600 | SHD Reset      |                                                                                                         |
| 5632 | RC522 Rst      | RC522 reset                                                                                             |
| 5664 | P9813 Clk      | P9813 Clock and Data                                                                                    |
| 5696 | P9813 Dat      | P9813 Clock and Data                                                                                    |
| 5728 | OptionA1       | Specific device options to be served in code                                                            |
| 5729 | OptionA2       | Specific device options to be served in code                                                            |
| 5730 | OptionA3       | Specific device options to be served in code                                                            |
| 5731 | OptionA4       | Specific device options to be served in code                                                            |
| 5732 | OptionA5       | Specific device options to be served in code                                                            |
| 5733 | OptionA6       | Specific device options to be served in code                                                            |
| 5760 | FTC532         | FTC532 touch ctrlr serial input                                                                         |
| 5792 | RC522 CS       |                                                                                                         |
| 5824 | NRF24 CS       |                                                                                                         |
| 5856 | NRF24 DC       |                                                                                                         |
| 5888 | ILI9341 CS     |                                                                                                         |
| 5920 | ILI9341 DC     |                                                                                                         |
| 5952 | ILI9488 CS     |                                                                                                         |
| 5984 | EPaper29 CS    |                                                                                                         |
| 6016 | EPaper42 CS    |                                                                                                         |
| 6048 | SSD1351 CS     |                                                                                                         |
| 6080 | RA8876 CS      |                                                                                                         |
| 6112 | ST7789 CS      |                                                                                                         |
| 6144 | ST7789 DC      |                                                                                                         |
| 6176 | SSD1331 CS     |                                                                                                         |
| 6208 | SSD1331 DC     |                                                                                                         |
| 6240 | SDCard CS      |                                                                                                         |
| 6272 | RotaryA_n1     | Rotary switch                                                                                           |
| 6273 | RotaryA_n2     | Rotary switch                                                                                           |
| 6304 | RotaryB_n1     | Rotary switch                                                                                           |
| 6305 | RotaryB_n2     | Rotary switch                                                                                           |
| 6336 | ADC pH         | Analog PH Sensor                                                                                        |
| 6368 | BS814 CLK      | Holtek BS814A2 touch ctrlr                                                                              |
| 6400 | BS814 DAT      | Holtek BS814A2 touch ctrlr                                                                              |
| 6432 | Wiegand D0     | Wiegand Data lines                                                                                      |
| 6464 | Wiegand D1     | Wiegand Data lines                                                                                      |
| 6496 | NeoPool Tx     | Sugar Valley RS485 interface                                                                            |
| 6528 | NeoPool Rx     | Sugar Valley RS485 interface                                                                            |
| 6560 | SDM72 Tx       | SDM72 Serial interface                                                                                  |
| 6592 | SDM72 Rx       | SDM72 Serial interface                                                                                  |
| 6624 | TM1637 CLK     | TM1637 interface                                                                                        |
| 6656 | TM1637 DIO     | TM1637 interface                                                                                        |
| 6688 | DLP Tx         | LCD/DLP Projector Serial Control                                                                        |
| 6720 | DLP Rx         | LCD/DLP Projector Serial Control                                                                        |
| 6752 | SSD1351 DC     |                                                                                                         |
| 6784 | XPT2046 CS     | XPT2046 SPI Chip Select                                                                                 |
| 6816 | CSE7761 Tx     | CSE7761 Serial interface (Dual R3)                                                                      |
| 6848 | CSE7761 Rx     | CSE7761 Serial interface (Dual R3)                                                                      |
| 6880 | VL53LXX XSHUT1 | VL53LXX_XSHUT (the max number of sensors is VL53LXX_MAX_SENSORS)- Used when connecting multiple VL53LXX |
| 6881 | VL53LXX XSHUT2 | VL53LXX_XSHUT (the max number of sensors is VL53LXX_MAX_SENSORS)- Used when connecting multiple VL53LXX |
| 6882 | VL53LXX XSHUT3 | VL53LXX_XSHUT (the max number of sensors is VL53LXX_MAX_SENSORS)- Used when connecting multiple VL53LXX |
| 6883 | VL53LXX XSHUT4 | VL53LXX_XSHUT (the max number of sensors is VL53LXX_MAX_SENSORS)- Used when connecting multiple VL53LXX |
| 6884 | VL53LXX XSHUT5 | VL53LXX_XSHUT (the max number of sensors is VL53LXX_MAX_SENSORS)- Used when connecting multiple VL53LXX |
| 6885 | VL53LXX XSHUT6 | VL53LXX_XSHUT (the max number of sensors is VL53LXX_MAX_SENSORS)- Used when connecting multiple VL53LXX |
| 6886 | VL53LXX XSHUT7 | VL53LXX_XSHUT (the max number of sensors is VL53LXX_MAX_SENSORS)- Used when connecting multiple VL53LXX |
| 6887 | VL53LXX XSHUT8 | VL53LXX_XSHUT (the max number of sensors is VL53LXX_MAX_SENSORS)- Used when connecting multiple VL53LXX |
| 6912 | MAX7219 CLK    | MAX7219 interface                                                                                       |
| 6944 | MAX7219 DIN    | MAX7219 interface                                                                                       |
| 6976 | MAX7219 CS     | MAX7219 interface                                                                                       |
| 7008 | TFmini+ TX     | TFmini Plus ToF sensor                                                                                  |
| 7040 | TFmini+ RX     | TFmini Plus ToF sensor                                                                                  |
| 7072 | ZC Pulse       |                                                                                                         |
| 7104 | Input1         |                                                                                                         |
| 7105 | Input2         |                                                                                                         |
| 7106 | Input3         |                                                                                                         |
| 7107 | Input4         |                                                                                                         |
| 7108 | Input5         |                                                                                                         |
| 7109 | Input6         |                                                                                                         |
| 7110 | Input7         |                                                                                                         |
| 7111 | Input8         |                                                                                                         |
| 7136 | I2S Out Data1  |                                                                                                         |
| 7168 | I2S Out Clk1   |                                                                                                         |
| 7200 | I2S Out Slct1  |                                                                                                         |
| 7232 | I2S In Data1   |                                                                                                         |
| 7264 | I2S In Clk1    |                                                                                                         |
| 7296 | I2S In Slct1   |                                                                                                         |
| 7328 | Interrupt1     |                                                                                                         |
| 7329 | Interrupt2     |                                                                                                         |
| 7330 | Interrupt3     |                                                                                                         |
| 7331 | Interrupt4     |                                                                                                         |
| 7332 | Interrupt5     |                                                                                                         |
| 7333 | Interrupt6     |                                                                                                         |
| 7334 | Interrupt7     |                                                                                                         |
| 7335 | Interrupt8     |                                                                                                         |
| 7360 | MCP2515 CS     | MCP2515 Chip Select                                                                                     |
| 7392 | HRG15 Tx       | Hydreon RG-15 rain sensor serial interface                                                              |
| 7424 | HRG15 Rx       | Hydreon RG-15 rain sensor serial interface                                                              |
| 7456 | VINDRIKTNING   | IKEA VINDRIKTNING Serial interface                                                                      |
| 7488 | BL0939 Rx      | BL0939 Serial interface (Dual R3 v2)                                                                    |
| 7520 | BL0942 Rx      | BL0942 Serial interface                                                                                 |
| 7552 | HM330X SET     | HM330X SET pin (sleep when low)                                                                         |
| 7584 | Heartbeat      |                                                                                                         |
| 7616 | Heartbeat_i    |                                                                                                         |
| 7648 | 74x595 SRCLK   | 74x595 Shift register                                                                                   |
| 7680 | 74x595 RCLK    | 74x595 Shift register                                                                                   |
| 7712 | 74x595 OE      | 74x595 Shift register                                                                                   |
| 7744 | 74x595 SER     | 74x595 Shift register                                                                                   |
| 7776 | SolaxX1 RTS    | Solax Inverter Serial interface                                                                         |
| 7808 | OptionE        | Emulated module                                                                                         |
| 7840 | SDM230 Tx      | SDM230 Serial interface                                                                                 |
| 7872 | SDM230 Rx      | SDM230 Serial interface                                                                                 |
| 7904 | ADC MQ         | Analog MQ Sensor                                                                                        |
| 7936 | CM110x TX      | CM11 Serial interface                                                                                   |
| 7968 | CM110x RX      | CM11 Serial interface                                                                                   |
| 8000 | BL6523 Tx      | BL6523 based Watt meter Serial interface                                                                |
| 8032 | BL6523 Rx      | BL6523 based Watt meter Serial interface                                                                |
| 8064 | ADE7880 IRQ1   | ADE7880 IRQ                                                                                             |
| 8065 | ADE7880 IRQ2   | ADE7880 IRQ                                                                                             |
| 8096 | Reset          | Generic reset                                                                                           |
| 8128 | MS01           | Sonoff MS01 Moisture Sensor 1wire interface                                                             |
| 8160 | SDIO CMD       | SD Card SDIO interface including 1-bit and 4-bit modes                                                  |
| 8192 | SDIO CLK       | SD Card SDIO interface including 1-bit and 4-bit modes                                                  |
| 8224 | SDIO D0        | SD Card SDIO interface including 1-bit and 4-bit modes                                                  |
| 8256 | SDIO D1        | SD Card SDIO interface including 1-bit and 4-bit modes                                                  |
| 8288 | SDIO D2        | SD Card SDIO interface including 1-bit and 4-bit modes                                                  |
| 8320 | SDIO D3        | SD Card SDIO interface including 1-bit and 4-bit modes                                                  |

### Tasmota32

| #    | UI Label       | Comment                                                                                                 |
|------|----------------|---------------------------------------------------------------------------------------------------------|
| 0    | None           | Not used                                                                                                |
| 1    | User           | User pin                                                                                                |
| 32   | Button1        | 4 x Button                                                                                              |
| 33   | Button2        | 4 x Button                                                                                              |
| 34   | Button3        | 4 x Button                                                                                              |
| 35   | Button4        | 4 x Button                                                                                              |
| 36   | Button5        | 4 x Button                                                                                              |
| 37   | Button6        | 4 x Button                                                                                              |
| 38   | Button7        | 4 x Button                                                                                              |
| 39   | Button8        | 4 x Button                                                                                              |
| 64   | Button_n1      | 4 x Button                                                                                              |
| 65   | Button_n2      | 4 x Button                                                                                              |
| 66   | Button_n3      | 4 x Button                                                                                              |
| 67   | Button_n4      | 4 x Button                                                                                              |
| 68   | Button_n5      | 4 x Button                                                                                              |
| 69   | Button_n6      | 4 x Button                                                                                              |
| 70   | Button_n7      | 4 x Button                                                                                              |
| 71   | Button_n8      | 4 x Button                                                                                              |
| 96   | Button_i1      | 4 x Button                                                                                              |
| 97   | Button_i2      | 4 x Button                                                                                              |
| 98   | Button_i3      | 4 x Button                                                                                              |
| 99   | Button_i4      | 4 x Button                                                                                              |
| 100  | Button_i5      | 4 x Button                                                                                              |
| 101  | Button_i6      | 4 x Button                                                                                              |
| 102  | Button_i7      | 4 x Button                                                                                              |
| 103  | Button_i8      | 4 x Button                                                                                              |
| 128  | Button_in1     | 4 x Button                                                                                              |
| 129  | Button_in2     | 4 x Button                                                                                              |
| 130  | Button_in3     | 4 x Button                                                                                              |
| 131  | Button_in4     | 4 x Button                                                                                              |
| 132  | Button_in5     | 4 x Button                                                                                              |
| 133  | Button_in6     | 4 x Button                                                                                              |
| 134  | Button_in7     | 4 x Button                                                                                              |
| 135  | Button_in8     | 4 x Button                                                                                              |
| 160  | Switch1        | 8 x User connected external switches                                                                    |
| 161  | Switch2        | 8 x User connected external switches                                                                    |
| 162  | Switch3        | 8 x User connected external switches                                                                    |
| 163  | Switch4        | 8 x User connected external switches                                                                    |
| 164  | Switch5        | 8 x User connected external switches                                                                    |
| 165  | Switch6        | 8 x User connected external switches                                                                    |
| 166  | Switch7        | 8 x User connected external switches                                                                    |
| 167  | Switch8        | 8 x User connected external switches                                                                    |
| 168  | Switch9        | 8 x User connected external switches                                                                    |
| 169  | Switch10       | 8 x User connected external switches                                                                    |
| 170  | Switch11       | 8 x User connected external switches                                                                    |
| 171  | Switch12       | 8 x User connected external switches                                                                    |
| 172  | Switch13       | 8 x User connected external switches                                                                    |
| 173  | Switch14       | 8 x User connected external switches                                                                    |
| 174  | Switch15       | 8 x User connected external switches                                                                    |
| 175  | Switch16       | 8 x User connected external switches                                                                    |
| 176  | Switch17       | 8 x User connected external switches                                                                    |
| 177  | Switch18       | 8 x User connected external switches                                                                    |
| 178  | Switch19       | 8 x User connected external switches                                                                    |
| 179  | Switch20       | 8 x User connected external switches                                                                    |
| 180  | Switch21       | 8 x User connected external switches                                                                    |
| 181  | Switch22       | 8 x User connected external switches                                                                    |
| 182  | Switch23       | 8 x User connected external switches                                                                    |
| 183  | Switch24       | 8 x User connected external switches                                                                    |
| 184  | Switch25       | 8 x User connected external switches                                                                    |
| 185  | Switch26       | 8 x User connected external switches                                                                    |
| 186  | Switch27       | 8 x User connected external switches                                                                    |
| 187  | Switch28       | 8 x User connected external switches                                                                    |
| 192  | Switch_n1      | 8 x User connected external switches                                                                    |
| 193  | Switch_n2      | 8 x User connected external switches                                                                    |
| 194  | Switch_n3      | 8 x User connected external switches                                                                    |
| 195  | Switch_n4      | 8 x User connected external switches                                                                    |
| 196  | Switch_n5      | 8 x User connected external switches                                                                    |
| 197  | Switch_n6      | 8 x User connected external switches                                                                    |
| 198  | Switch_n7      | 8 x User connected external switches                                                                    |
| 199  | Switch_n8      | 8 x User connected external switches                                                                    |
| 200  | Switch_n9      | 8 x User connected external switches                                                                    |
| 201  | Switch_n10     | 8 x User connected external switches                                                                    |
| 202  | Switch_n11     | 8 x User connected external switches                                                                    |
| 203  | Switch_n12     | 8 x User connected external switches                                                                    |
| 204  | Switch_n13     | 8 x User connected external switches                                                                    |
| 205  | Switch_n14     | 8 x User connected external switches                                                                    |
| 206  | Switch_n15     | 8 x User connected external switches                                                                    |
| 207  | Switch_n16     | 8 x User connected external switches                                                                    |
| 208  | Switch_n17     | 8 x User connected external switches                                                                    |
| 209  | Switch_n18     | 8 x User connected external switches                                                                    |
| 210  | Switch_n19     | 8 x User connected external switches                                                                    |
| 211  | Switch_n20     | 8 x User connected external switches                                                                    |
| 212  | Switch_n21     | 8 x User connected external switches                                                                    |
| 213  | Switch_n22     | 8 x User connected external switches                                                                    |
| 214  | Switch_n23     | 8 x User connected external switches                                                                    |
| 215  | Switch_n24     | 8 x User connected external switches                                                                    |
| 216  | Switch_n25     | 8 x User connected external switches                                                                    |
| 217  | Switch_n26     | 8 x User connected external switches                                                                    |
| 218  | Switch_n27     | 8 x User connected external switches                                                                    |
| 219  | Switch_n28     | 8 x User connected external switches                                                                    |
| 224  | Relay1         | 8 x Relays                                                                                              |
| 225  | Relay2         | 8 x Relays                                                                                              |
| 226  | Relay3         | 8 x Relays                                                                                              |
| 227  | Relay4         | 8 x Relays                                                                                              |
| 228  | Relay5         | 8 x Relays                                                                                              |
| 229  | Relay6         | 8 x Relays                                                                                              |
| 230  | Relay7         | 8 x Relays                                                                                              |
| 231  | Relay8         | 8 x Relays                                                                                              |
| 232  | Relay9         | 8 x Relays                                                                                              |
| 233  | Relay10        | 8 x Relays                                                                                              |
| 234  | Relay11        | 8 x Relays                                                                                              |
| 235  | Relay12        | 8 x Relays                                                                                              |
| 236  | Relay13        | 8 x Relays                                                                                              |
| 237  | Relay14        | 8 x Relays                                                                                              |
| 238  | Relay15        | 8 x Relays                                                                                              |
| 239  | Relay16        | 8 x Relays                                                                                              |
| 240  | Relay17        | 8 x Relays                                                                                              |
| 241  | Relay18        | 8 x Relays                                                                                              |
| 242  | Relay19        | 8 x Relays                                                                                              |
| 243  | Relay20        | 8 x Relays                                                                                              |
| 244  | Relay21        | 8 x Relays                                                                                              |
| 245  | Relay22        | 8 x Relays                                                                                              |
| 246  | Relay23        | 8 x Relays                                                                                              |
| 247  | Relay24        | 8 x Relays                                                                                              |
| 248  | Relay25        | 8 x Relays                                                                                              |
| 249  | Relay26        | 8 x Relays                                                                                              |
| 250  | Relay27        | 8 x Relays                                                                                              |
| 251  | Relay28        | 8 x Relays                                                                                              |
| 256  | Relay_i1       | 8 x Relays                                                                                              |
| 257  | Relay_i2       | 8 x Relays                                                                                              |
| 258  | Relay_i3       | 8 x Relays                                                                                              |
| 259  | Relay_i4       | 8 x Relays                                                                                              |
| 260  | Relay_i5       | 8 x Relays                                                                                              |
| 261  | Relay_i6       | 8 x Relays                                                                                              |
| 262  | Relay_i7       | 8 x Relays                                                                                              |
| 263  | Relay_i8       | 8 x Relays                                                                                              |
| 264  | Relay_i9       | 8 x Relays                                                                                              |
| 265  | Relay_i10      | 8 x Relays                                                                                              |
| 266  | Relay_i11      | 8 x Relays                                                                                              |
| 267  | Relay_i12      | 8 x Relays                                                                                              |
| 268  | Relay_i13      | 8 x Relays                                                                                              |
| 269  | Relay_i14      | 8 x Relays                                                                                              |
| 270  | Relay_i15      | 8 x Relays                                                                                              |
| 271  | Relay_i16      | 8 x Relays                                                                                              |
| 272  | Relay_i17      | 8 x Relays                                                                                              |
| 273  | Relay_i18      | 8 x Relays                                                                                              |
| 274  | Relay_i19      | 8 x Relays                                                                                              |
| 275  | Relay_i20      | 8 x Relays                                                                                              |
| 276  | Relay_i21      | 8 x Relays                                                                                              |
| 277  | Relay_i22      | 8 x Relays                                                                                              |
| 278  | Relay_i23      | 8 x Relays                                                                                              |
| 279  | Relay_i24      | 8 x Relays                                                                                              |
| 280  | Relay_i25      | 8 x Relays                                                                                              |
| 281  | Relay_i26      | 8 x Relays                                                                                              |
| 282  | Relay_i27      | 8 x Relays                                                                                              |
| 283  | Relay_i28      | 8 x Relays                                                                                              |
| 288  | Led1           | 4 x Leds                                                                                                |
| 289  | Led2           | 4 x Leds                                                                                                |
| 290  | Led3           | 4 x Leds                                                                                                |
| 291  | Led4           | 4 x Leds                                                                                                |
| 320  | Led_i1         | 4 x Leds                                                                                                |
| 321  | Led_i2         | 4 x Leds                                                                                                |
| 322  | Led_i3         | 4 x Leds                                                                                                |
| 323  | Led_i4         | 4 x Leds                                                                                                |
| 352  | Counter1       | 4 x Counter                                                                                             |
| 353  | Counter2       | 4 x Counter                                                                                             |
| 354  | Counter3       | 4 x Counter                                                                                             |
| 355  | Counter4       | 4 x Counter                                                                                             |
| 384  | Counter_n1     | 4 x Counter                                                                                             |
| 385  | Counter_n2     | 4 x Counter                                                                                             |
| 386  | Counter_n3     | 4 x Counter                                                                                             |
| 387  | Counter_n4     | 4 x Counter                                                                                             |
| 416  | PWM1           | 5 x PWM                                                                                                 |
| 417  | PWM2           | 5 x PWM                                                                                                 |
| 418  | PWM3           | 5 x PWM                                                                                                 |
| 419  | PWM4           | 5 x PWM                                                                                                 |
| 420  | PWM5           | 5 x PWM                                                                                                 |
| 448  | PWM_i1         | 5 x PWM                                                                                                 |
| 449  | PWM_i2         | 5 x PWM                                                                                                 |
| 450  | PWM_i3         | 5 x PWM                                                                                                 |
| 451  | PWM_i4         | 5 x PWM                                                                                                 |
| 452  | PWM_i5         | 5 x PWM                                                                                                 |
| 480  | Buzzer         | Buzzer                                                                                                  |
| 512  | Buzzer_i       | Buzzer                                                                                                  |
| 544  | LedLink        | Link led                                                                                                |
| 576  | LedLink_i      | Link led                                                                                                |
| 608  | I2C SCL1       | Software I2C                                                                                            |
| 609  | I2C SCL2       | Software I2C                                                                                            |
| 640  | I2C SDA1       | Software I2C                                                                                            |
| 641  | I2C SDA2       | Software I2C                                                                                            |
| 672  | SPI MISO1      | Hardware SPI                                                                                            |
| 673  | SPI MISO2      | Hardware SPI                                                                                            |
| 704  | SPI MOSI1      | Hardware SPI                                                                                            |
| 705  | SPI MOSI2      | Hardware SPI                                                                                            |
| 736  | SPI CLK1       | Hardware SPI                                                                                            |
| 737  | SPI CLK2       | Hardware SPI                                                                                            |
| 768  | SPI CS1        | Hardware SPI                                                                                            |
| 769  | SPI CS2        | Hardware SPI                                                                                            |
| 800  | SPI DC1        | Hardware SPI                                                                                            |
| 801  | SPI DC2        | Hardware SPI                                                                                            |
| 832  | SSPI MISO      | Software SPI                                                                                            |
| 864  | SSPI MOSI      | Software SPI                                                                                            |
| 896  | SSPI SCLK      | Software SPI                                                                                            |
| 928  | SSPI CS        | Software SPI                                                                                            |
| 960  | SSPI DC        | Software SPI                                                                                            |
| 992  | Backlight      | Display backlight control                                                                               |
| 1024 | Display Rst    | OLED Display Reset                                                                                      |
| 1056 | IRsend         | IR interface                                                                                            |
| 1088 | IRrecv         | IR interface                                                                                            |
| 1120 | RFSend         | RF interface                                                                                            |
| 1152 | RFrecv         | RF interface                                                                                            |
| 1184 | DHT11          | DHT11 DHT21 DHT22 AM2301 AM2302 AM2321                                                                  |
| 1216 | AM2301         | DHT11 DHT21 DHT22 AM2301 AM2302 AM2321                                                                  |
| 1248 | SI7021         | DHT11 DHT21 DHT22 AM2301 AM2302 AM2321                                                                  |
| 1280 | DHT11_o        | DHT11 DHT21 DHT22 AM2301 AM2302 AM2321                                                                  |
| 1312 | DS18x20        | DS18B20 or DS18S20                                                                                      |
| 1344 | DS18x20_o      | DS18B20 or DS18S20                                                                                      |
| 1376 | WS2812         | WS2812 Led string                                                                                       |
| 1408 | MHZ Tx         | MH-Z19 Serial interface                                                                                 |
| 1440 | MHZ Rx         | MH-Z19 Serial interface                                                                                 |
| 1472 | PZEM0XX Tx     | PZEM Serial Modbus interface                                                                            |
| 1504 | PZEM004 Rx     | PZEM Serial Modbus interface                                                                            |
| 1536 | PZEM016 Rx     | PZEM Serial Modbus interface                                                                            |
| 1568 | PZEM017 Rx     | PZEM Serial Modbus interface                                                                            |
| 1600 | SAir Tx        | SenseAir Serial interface                                                                               |
| 1632 | SAir Rx        | SenseAir Serial interface                                                                               |
| 1664 | PMS5003 Tx     | Plantower PMS5003 Serial interface                                                                      |
| 1696 | PMS5003 Rx     | Plantower PMS5003 Serial interface                                                                      |
| 1728 | SDS0X1 Tx      | Nova Fitness SDS011 Serial interface                                                                    |
| 1760 | SDS0X1 Rx      | Nova Fitness SDS011 Serial interface                                                                    |
| 1792 | SerBr Tx       | Serial Bridge Serial interface                                                                          |
| 1824 | SerBr Rx       | Serial Bridge Serial interface                                                                          |
| 1856 | SR04 Tri/TX    | SR04 interface                                                                                          |
| 1888 | SR04 Ech/RX    | SR04 interface                                                                                          |
| 1920 | SDMx20 Tx      | SDM120 Serial interface                                                                                 |
| 1952 | SDMx20 Rx      | SDM120 Serial interface                                                                                 |
| 1984 | SDM630 Tx      | SDM630 Serial interface                                                                                 |
| 2016 | SDM630 Rx      | SDM630 Serial interface                                                                                 |
| 2048 | TM1638 CLK     | TM1638 interface                                                                                        |
| 2080 | TM1638 DIO     | TM1638 interface                                                                                        |
| 2112 | TM1638 STB     | TM1638 interface                                                                                        |
| 2144 | MP3 Player     | RB-DFR-562 DFPlayer Mini MP3 Player                                                                     |
| 2176 | HX711 SCK      | HX711 Load Cell interface                                                                               |
| 2208 | HX711 DAT      | HX711 Load Cell interface                                                                               |
| 2240 | TX2x           | TX20/TX23 Transmission Pin                                                                              |
| 2272 | Tuya Tx        | Tuya Serial interface                                                                                   |
| 2304 | Tuya Rx        | Tuya Serial interface                                                                                   |
| 2336 | MGC3130 Xfr    | MGC3130 interface                                                                                       |
| 2368 | MGC3130 Rst    | MGC3130 interface                                                                                       |
| 2400 | RF Sensor      | Rf receiver with sensor decoding                                                                        |
| 2432 | AZ Tx          | AZ-Instrument 7798 Serial interface                                                                     |
| 2464 | AZ Rx          | AZ-Instrument 7798 Serial interface                                                                     |
| 2496 | MX31855 CS     | MAX31855 Serial interface                                                                               |
| 2528 | MX31855 CLK    | MAX31855 Serial interface                                                                               |
| 2560 | MX31855 DO     | MAX31855 Serial interface                                                                               |
| 2592 | HLWBL SEL      | HLW8012/HJL-01/BL0937 energy monitoring                                                                 |
| 2624 | HLWBL SEL_i    | HLW8012/HJL-01/BL0937 energy monitoring                                                                 |
| 2656 | HLWBL CF1      | HLW8012/HJL-01/BL0937 energy monitoring                                                                 |
| 2688 | HLW8012 CF     | HLW8012/HJL-01/BL0937 energy monitoring                                                                 |
| 2720 | BL0937 CF      | HLW8012/HJL-01/BL0937 energy monitoring                                                                 |
| 2752 | MCP39F5 Tx     | MCP39F501 Energy monitoring (Shelly2)                                                                   |
| 2784 | MCP39F5 Rx     | MCP39F501 Energy monitoring (Shelly2)                                                                   |
| 2816 | MCP39F5 Rst    | MCP39F501 Energy monitoring (Shelly2)                                                                   |
| 2848 | PN532 Tx       | PN532 NFC Serial interface                                                                              |
| 2880 | PN532 Rx       | PN532 NFC Serial interface                                                                              |
| 2912 | SM16716 CLK    | SM16716 SELECT                                                                                          |
| 2944 | SM16716 DAT    | SM16716 SELECT                                                                                          |
| 2976 | SM16716 PWR    | SM16716 SELECT                                                                                          |
| 3008 | MY92x1 DI      | my92x1 PWM controller                                                                                   |
| 3040 | MY92x1 DCKI    | my92x1 PWM controller                                                                                   |
| 3072 | CSE7766 Tx     | CSE7766 Serial interface (S31 and Pow R2)                                                               |
| 3104 | CSE7766 Rx     | CSE7766 Serial interface (S31 and Pow R2)                                                               |
| 3136 | ALux IrRcv     | Arilux RF Receive input                                                                                 |
| 3168 | ALux IrSel     | Arilux RF Receive input                                                                                 |
| 3200 | Serial Tx      | Serial interface                                                                                        |
| 3232 | Serial Rx      | Serial interface                                                                                        |
| 3264 | RotaryA1       | Rotary switch                                                                                           |
| 3265 | RotaryA2       | Rotary switch                                                                                           |
| 3296 | RotaryB1       | Rotary switch                                                                                           |
| 3297 | RotaryB2       | Rotary switch                                                                                           |
| 3328 | ADC Joystick1  | Analog joystick                                                                                         |
| 3329 | ADC Joystick2  | Analog joystick                                                                                         |
| 3330 | ADC Joystick3  | Analog joystick                                                                                         |
| 3331 | ADC Joystick4  | Analog joystick                                                                                         |
| 3332 | ADC Joystick5  | Analog joystick                                                                                         |
| 3333 | ADC Joystick6  | Analog joystick                                                                                         |
| 3334 | ADC Joystick7  | Analog joystick                                                                                         |
| 3335 | ADC Joystick8  | Analog joystick                                                                                         |
| 3360 | MX31865 CS1    | MAX31865 Chip Select                                                                                    |
| 3361 | MX31865 CS2    | MAX31865 Chip Select                                                                                    |
| 3362 | MX31865 CS3    | MAX31865 Chip Select                                                                                    |
| 3363 | MX31865 CS4    | MAX31865 Chip Select                                                                                    |
| 3364 | MX31865 CS5    | MAX31865 Chip Select                                                                                    |
| 3365 | MX31865 CS6    | MAX31865 Chip Select                                                                                    |
| 3392 | HRE Clock      | HR-E Water Meter                                                                                        |
| 3424 | HRE Data       | HR-E Water Meter                                                                                        |
| 3456 | ADE7953 IRQ1   | ADE7953 IRQ                                                                                             |
| 3457 | ADE7953 IRQ2   | ADE7953 IRQ                                                                                             |
| 3488 | SolaxX1 Tx     | Solax Inverter Serial interface                                                                         |
| 3520 | SolaxX1 Rx     | Solax Inverter Serial interface                                                                         |
| 3552 | Zigbee Tx      | Zigbee Serial interface                                                                                 |
| 3584 | Zigbee Rx      | Zigbee Serial interface                                                                                 |
| 3616 | RDM6300 RX     | RDM6300 RX                                                                                              |
| 3648 | iBeacon TX     | HM17 IBEACON Serial interface                                                                           |
| 3680 | iBeacon RX     | HM17 IBEACON Serial interface                                                                           |
| 3712 | A4988 DIR      | A4988 interface                                                                                         |
| 3744 | A4988 STP      | A4988 interface                                                                                         |
| 3776 | A4988 ENA      | A4988 interface                                                                                         |
| 3808 | A4988 MS11     | A4988 interface                                                                                         |
| 3809 | A4988 MS12     | A4988 interface                                                                                         |
| 3810 | A4988 MS13     | A4988 interface                                                                                         |
| 3840 | Output Hi      | Fixed output state                                                                                      |
| 3872 | Output Lo      | Fixed output state                                                                                      |
| 3904 | DDS238-2 Tx    | DDS2382 Serial interface                                                                                |
| 3936 | DDS238-2 Rx    | DDS2382 Serial interface                                                                                |
| 3968 | DDSU666 Tx     | DDSU666 Serial interface                                                                                |
| 4000 | DDSU666 Rx     | DDSU666 Serial interface                                                                                |
| 4032 | SM2135 Clk     | SM2135 PWM controller                                                                                   |
| 4064 | SM2135 Dat1    | SM2135 PWM controller                                                                                   |
| 4065 | SM2135 Dat2    | SM2135 PWM controller                                                                                   |
| 4066 | SM2135 Dat3    | SM2135 PWM controller                                                                                   |
| 4067 | SM2135 Dat4    | SM2135 PWM controller                                                                                   |
| 4068 | SM2135 Dat5    | SM2135 PWM controller                                                                                   |
| 4069 | SM2135 Dat6    | SM2135 PWM controller                                                                                   |
| 4070 | SM2135 Dat7    | SM2135 PWM controller                                                                                   |
| 4096 | DeepSleep      | Kill switch for deepsleep                                                                               |
| 4128 | EXS Enable     | EXS MCU Enable                                                                                          |
| 4160 | Client TX      | Client Serial interface                                                                                 |
| 4192 | Client RX      | Client Serial interface                                                                                 |
| 4224 | Client RST     | Client Reset                                                                                            |
| 4256 | Client RST_i   | Client Reset                                                                                            |
| 4288 | HPMA Rx        | Honeywell HPMA115S0 Serial interface                                                                    |
| 4320 | HPMA Tx        | Honeywell HPMA115S0 Serial interface                                                                    |
| 4352 | GPS RX         | GPS Serial interface                                                                                    |
| 4384 | GPS TX         | GPS Serial interface                                                                                    |
| 4416 | HM10 RX        | HM10-BLE-Mijia-bridge Serial interface                                                                  |
| 4448 | HM10 TX        | HM10-BLE-Mijia-bridge Serial interface                                                                  |
| 4480 | LE-01MR Rx     | F&F LE-01MR energy meter                                                                                |
| 4512 | LE-01MR Tx     | F&F LE-01MR energy meter                                                                                |
| 4544 | CC1101 GDO0    | CC1101 Serial interface                                                                                 |
| 4576 | CC1101 GDO2    | CC1101 Serial interface                                                                                 |
| 4608 | HRXL Rx        | Data from MaxBotix HRXL sonar range sensor                                                              |
| 4640 | MOODL Tx       | ElectriQ iQ-wifiMOODL Serial TX                                                                         |
| 4672 | AS3935         | Franklin Lightning Sensor                                                                               |
| 4704 | ADC Input1     | Analog input                                                                                            |
| 4705 | ADC Input2     | Analog input                                                                                            |
| 4706 | ADC Input3     | Analog input                                                                                            |
| 4707 | ADC Input4     | Analog input                                                                                            |
| 4708 | ADC Input5     | Analog input                                                                                            |
| 4709 | ADC Input6     | Analog input                                                                                            |
| 4710 | ADC Input7     | Analog input                                                                                            |
| 4711 | ADC Input8     | Analog input                                                                                            |
| 4736 | ADC Temp1      | Analog Thermistor                                                                                       |
| 4737 | ADC Temp2      | Analog Thermistor                                                                                       |
| 4738 | ADC Temp3      | Analog Thermistor                                                                                       |
| 4739 | ADC Temp4      | Analog Thermistor                                                                                       |
| 4740 | ADC Temp5      | Analog Thermistor                                                                                       |
| 4741 | ADC Temp6      | Analog Thermistor                                                                                       |
| 4742 | ADC Temp7      | Analog Thermistor                                                                                       |
| 4743 | ADC Temp8      | Analog Thermistor                                                                                       |
| 4768 | ADC Light1     | Analog Light sensor                                                                                     |
| 4769 | ADC Light2     | Analog Light sensor                                                                                     |
| 4770 | ADC Light3     | Analog Light sensor                                                                                     |
| 4771 | ADC Light4     | Analog Light sensor                                                                                     |
| 4772 | ADC Light5     | Analog Light sensor                                                                                     |
| 4773 | ADC Light6     | Analog Light sensor                                                                                     |
| 4774 | ADC Light7     | Analog Light sensor                                                                                     |
| 4775 | ADC Light8     | Analog Light sensor                                                                                     |
| 4800 | ADC Button1    | Analog Button                                                                                           |
| 4801 | ADC Button2    | Analog Button                                                                                           |
| 4802 | ADC Button3    | Analog Button                                                                                           |
| 4803 | ADC Button4    | Analog Button                                                                                           |
| 4804 | ADC Button5    | Analog Button                                                                                           |
| 4805 | ADC Button6    | Analog Button                                                                                           |
| 4806 | ADC Button7    | Analog Button                                                                                           |
| 4807 | ADC Button8    | Analog Button                                                                                           |
| 4832 | ADC Button_i1  | Analog Button                                                                                           |
| 4833 | ADC Button_i2  | Analog Button                                                                                           |
| 4834 | ADC Button_i3  | Analog Button                                                                                           |
| 4835 | ADC Button_i4  | Analog Button                                                                                           |
| 4836 | ADC Button_i5  | Analog Button                                                                                           |
| 4837 | ADC Button_i6  | Analog Button                                                                                           |
| 4838 | ADC Button_i7  | Analog Button                                                                                           |
| 4839 | ADC Button_i8  | Analog Button                                                                                           |
| 4864 | ADC Range1     | Analog Range                                                                                            |
| 4865 | ADC Range2     | Analog Range                                                                                            |
| 4866 | ADC Range3     | Analog Range                                                                                            |
| 4867 | ADC Range4     | Analog Range                                                                                            |
| 4868 | ADC Range5     | Analog Range                                                                                            |
| 4869 | ADC Range6     | Analog Range                                                                                            |
| 4870 | ADC Range7     | Analog Range                                                                                            |
| 4871 | ADC Range8     | Analog Range                                                                                            |
| 4896 | ADC CT Power1  | ANalog Current                                                                                          |
| 4897 | ADC CT Power2  | ANalog Current                                                                                          |
| 4898 | ADC CT Power3  | ANalog Current                                                                                          |
| 4899 | ADC CT Power4  | ANalog Current                                                                                          |
| 4900 | ADC CT Power5  | ANalog Current                                                                                          |
| 4901 | ADC CT Power6  | ANalog Current                                                                                          |
| 4902 | ADC CT Power7  | ANalog Current                                                                                          |
| 4903 | ADC CT Power8  | ANalog Current                                                                                          |
| 4928 | CAM_PWDN       | Webcam                                                                                                  |
| 4960 | CAM_RESET      | Webcam                                                                                                  |
| 4992 | CAM_XCLK       | Webcam                                                                                                  |
| 5024 | CAM_SIOD       | Webcam I2C                                                                                              |
| 5056 | CAM_SIOC       | Webcam I2C                                                                                              |
| 5088 | CAM_DATA1      |                                                                                                         |
| 5089 | CAM_DATA2      |                                                                                                         |
| 5090 | CAM_DATA3      |                                                                                                         |
| 5091 | CAM_DATA4      |                                                                                                         |
| 5092 | CAM_DATA5      |                                                                                                         |
| 5093 | CAM_DATA6      |                                                                                                         |
| 5094 | CAM_DATA7      |                                                                                                         |
| 5095 | CAM_DATA8      |                                                                                                         |
| 5120 | CAM_VSYNC      |                                                                                                         |
| 5152 | CAM_HREF       |                                                                                                         |
| 5184 | CAM_PCLK       |                                                                                                         |
| 5216 | CAM_PSCLK      |                                                                                                         |
| 5248 | CAM_HSD1       |                                                                                                         |
| 5249 | CAM_HSD2       |                                                                                                         |
| 5250 | CAM_HSD3       |                                                                                                         |
| 5280 | CAM_PSRCS      |                                                                                                         |
| 5312 | OpenTherm RX   | OpenTherm Boiler TX pin                                                                                 |
| 5344 | OpenTherm TX   | OpenTherm Boiler TX pin                                                                                 |
| 5376 | WindMeter Spd  | WindMeter speed counter pin                                                                             |
| 5408 | Button_tc1     | Touch pin as button                                                                                     |
| 5409 | Button_tc2     | Touch pin as button                                                                                     |
| 5410 | Button_tc3     | Touch pin as button                                                                                     |
| 5411 | Button_tc4     | Touch pin as button                                                                                     |
| 5412 | Button_tc5     | Touch pin as button                                                                                     |
| 5413 | Button_tc6     | Touch pin as button                                                                                     |
| 5414 | Button_tc7     | Touch pin as button                                                                                     |
| 5415 | Button_tc8     | Touch pin as button                                                                                     |
| 5440 | BL0940 Rx      | BL0940 serial interface                                                                                 |
| 5472 | TCP Tx         | TCP to serial bridge                                                                                    |
| 5504 | TCP Rx         | TCP to serial bridge                                                                                    |
| 5536 | ETH POWER      | Ethernet                                                                                                |
| 5568 | ETH MDC        | Ethernet                                                                                                |
| 5600 | ETH MDIO       | Ethernet                                                                                                |
| 5632 | TInfo Rx       | Teleinfo telemetry data receive pin                                                                     |
| 5664 | TInfo EN       | Teleinfo Enable Receive Pin                                                                             |
| 5696 | LMT01 Pulse    | LMT01 input counting pin                                                                                |
| 5728 | iEM3000 TX     | IEM3000 Serial interface                                                                                |
| 5760 | iEM3000 RX     | IEM3000 Serial interface                                                                                |
| 5792 | Zigbee Rst1    | Zigbee reset                                                                                            |
| 5793 | Zigbee Rst2    | Zigbee reset                                                                                            |
| 5824 | DYP Rx         |                                                                                                         |
| 5856 | MiEl HVAC Tx   | Mitsubishi Electric HVAC                                                                                |
| 5888 | MiEl HVAC Rx   | Mitsubishi Electric HVAC                                                                                |
| 5920 | WE517 Tx       | ORNO WE517 Serial interface                                                                             |
| 5952 | WE517 Rx       | ORNO WE517 Serial interface                                                                             |
| 5984 | AS608 Tx       | Serial interface AS608 / R503                                                                           |
| 6016 | AS608 Rx       | Serial interface AS608 / R503                                                                           |
| 6048 | SHD Boot 0     |                                                                                                         |
| 6080 | SHD Reset      |                                                                                                         |
| 6112 | RC522 Rst      | RC522 reset                                                                                             |
| 6144 | P9813 Clk      | P9813 Clock and Data                                                                                    |
| 6176 | P9813 Dat      | P9813 Clock and Data                                                                                    |
| 6208 | OptionA1       | Specific device options to be served in code                                                            |
| 6209 | OptionA2       | Specific device options to be served in code                                                            |
| 6210 | OptionA3       | Specific device options to be served in code                                                            |
| 6211 | OptionA4       | Specific device options to be served in code                                                            |
| 6212 | OptionA5       | Specific device options to be served in code                                                            |
| 6213 | OptionA6       | Specific device options to be served in code                                                            |
| 6240 | FTC532         | FTC532 touch ctrlr serial input                                                                         |
| 6272 | RC522 CS       |                                                                                                         |
| 6304 | NRF24 CS       |                                                                                                         |
| 6336 | NRF24 DC       |                                                                                                         |
| 6368 | ILI9341 CS     |                                                                                                         |
| 6400 | ILI9341 DC     |                                                                                                         |
| 6432 | ILI9488 CS     |                                                                                                         |
| 6464 | EPaper29 CS    |                                                                                                         |
| 6496 | EPaper42 CS    |                                                                                                         |
| 6528 | SSD1351 CS     |                                                                                                         |
| 6560 | RA8876 CS      |                                                                                                         |
| 6592 | ST7789 CS      |                                                                                                         |
| 6624 | ST7789 DC      |                                                                                                         |
| 6656 | SSD1331 CS     |                                                                                                         |
| 6688 | SSD1331 DC     |                                                                                                         |
| 6720 | SDCard CS      |                                                                                                         |
| 6752 | RotaryA_n1     | Rotary switch                                                                                           |
| 6753 | RotaryA_n2     | Rotary switch                                                                                           |
| 6784 | RotaryB_n1     | Rotary switch                                                                                           |
| 6785 | RotaryB_n2     | Rotary switch                                                                                           |
| 6816 | ADC pH1        | Analog PH Sensor                                                                                        |
| 6817 | ADC pH2        | Analog PH Sensor                                                                                        |
| 6818 | ADC pH3        | Analog PH Sensor                                                                                        |
| 6819 | ADC pH4        | Analog PH Sensor                                                                                        |
| 6820 | ADC pH5        | Analog PH Sensor                                                                                        |
| 6821 | ADC pH6        | Analog PH Sensor                                                                                        |
| 6822 | ADC pH7        | Analog PH Sensor                                                                                        |
| 6823 | ADC pH8        | Analog PH Sensor                                                                                        |
| 6848 | BS814 CLK      | Holtek BS814A2 touch ctrlr                                                                              |
| 6880 | BS814 DAT      | Holtek BS814A2 touch ctrlr                                                                              |
| 6912 | Wiegand D0     | Wiegand Data lines                                                                                      |
| 6944 | Wiegand D1     | Wiegand Data lines                                                                                      |
| 6976 | NeoPool Tx     | Sugar Valley RS485 interface                                                                            |
| 7008 | NeoPool Rx     | Sugar Valley RS485 interface                                                                            |
| 7040 | SDM72 Tx       | SDM72 Serial interface                                                                                  |
| 7072 | SDM72 Rx       | SDM72 Serial interface                                                                                  |
| 7104 | TM1637 CLK     | TM1637 interface                                                                                        |
| 7136 | TM1637 DIO     | TM1637 interface                                                                                        |
| 7168 | DLP Tx         | LCD/DLP Projector Serial Control                                                                        |
| 7200 | DLP Rx         | LCD/DLP Projector Serial Control                                                                        |
| 7232 | SSD1351 DC     |                                                                                                         |
| 7264 | XPT2046 CS     | XPT2046 SPI Chip Select                                                                                 |
| 7296 | CSE7761 Tx     | CSE7761 Serial interface (Dual R3)                                                                      |
| 7328 | CSE7761 Rx     | CSE7761 Serial interface (Dual R3)                                                                      |
| 7360 | VL53LXX XSHUT1 | VL53LXX_XSHUT (the max number of sensors is VL53LXX_MAX_SENSORS)- Used when connecting multiple VL53LXX |
| 7361 | VL53LXX XSHUT2 | VL53LXX_XSHUT (the max number of sensors is VL53LXX_MAX_SENSORS)- Used when connecting multiple VL53LXX |
| 7362 | VL53LXX XSHUT3 | VL53LXX_XSHUT (the max number of sensors is VL53LXX_MAX_SENSORS)- Used when connecting multiple VL53LXX |
| 7363 | VL53LXX XSHUT4 | VL53LXX_XSHUT (the max number of sensors is VL53LXX_MAX_SENSORS)- Used when connecting multiple VL53LXX |
| 7364 | VL53LXX XSHUT5 | VL53LXX_XSHUT (the max number of sensors is VL53LXX_MAX_SENSORS)- Used when connecting multiple VL53LXX |
| 7365 | VL53LXX XSHUT6 | VL53LXX_XSHUT (the max number of sensors is VL53LXX_MAX_SENSORS)- Used when connecting multiple VL53LXX |
| 7366 | VL53LXX XSHUT7 | VL53LXX_XSHUT (the max number of sensors is VL53LXX_MAX_SENSORS)- Used when connecting multiple VL53LXX |
| 7367 | VL53LXX XSHUT8 | VL53LXX_XSHUT (the max number of sensors is VL53LXX_MAX_SENSORS)- Used when connecting multiple VL53LXX |
| 7392 | MAX7219 CLK    | MAX7219 interface                                                                                       |
| 7424 | MAX7219 DIN    | MAX7219 interface                                                                                       |
| 7456 | MAX7219 CS     | MAX7219 interface                                                                                       |
| 7488 | TFmini+ TX     | TFmini Plus ToF sensor                                                                                  |
| 7520 | TFmini+ RX     | TFmini Plus ToF sensor                                                                                  |
| 7552 | ZC Pulse       |                                                                                                         |
| 7584 | HallEffect1    |                                                                                                         |
| 7585 | HallEffect2    |                                                                                                         |
| 7616 | EPD Data       | Base connection EPD driver                                                                              |
| 7648 | Input1         |                                                                                                         |
| 7649 | Input2         |                                                                                                         |
| 7650 | Input3         |                                                                                                         |
| 7651 | Input4         |                                                                                                         |
| 7652 | Input5         |                                                                                                         |
| 7653 | Input6         |                                                                                                         |
| 7654 | Input7         |                                                                                                         |
| 7655 | Input8         |                                                                                                         |
| 7656 | Input9         |                                                                                                         |
| 7657 | Input10        |                                                                                                         |
| 7658 | Input11        |                                                                                                         |
| 7659 | Input12        |                                                                                                         |
| 7660 | Input13        |                                                                                                         |
| 7661 | Input14        |                                                                                                         |
| 7662 | Input15        |                                                                                                         |
| 7663 | Input16        |                                                                                                         |
| 7664 | Input17        |                                                                                                         |
| 7665 | Input18        |                                                                                                         |
| 7666 | Input19        |                                                                                                         |
| 7667 | Input20        |                                                                                                         |
| 7668 | Input21        |                                                                                                         |
| 7669 | Input22        |                                                                                                         |
| 7670 | Input23        |                                                                                                         |
| 7671 | Input24        |                                                                                                         |
| 7672 | Input25        |                                                                                                         |
| 7673 | Input26        |                                                                                                         |
| 7674 | Input27        |                                                                                                         |
| 7675 | Input28        |                                                                                                         |
| 7680 | Button_d1      |                                                                                                         |
| 7681 | Button_d2      |                                                                                                         |
| 7682 | Button_d3      |                                                                                                         |
| 7683 | Button_d4      |                                                                                                         |
| 7684 | Button_d5      |                                                                                                         |
| 7685 | Button_d6      |                                                                                                         |
| 7686 | Button_d7      |                                                                                                         |
| 7687 | Button_d8      |                                                                                                         |
| 7712 | Button_id1     |                                                                                                         |
| 7713 | Button_id2     |                                                                                                         |
| 7714 | Button_id3     |                                                                                                         |
| 7715 | Button_id4     |                                                                                                         |
| 7716 | Button_id5     |                                                                                                         |
| 7717 | Button_id6     |                                                                                                         |
| 7718 | Button_id7     |                                                                                                         |
| 7719 | Button_id8     |                                                                                                         |
| 7744 | Switch_d1      |                                                                                                         |
| 7745 | Switch_d2      |                                                                                                         |
| 7746 | Switch_d3      |                                                                                                         |
| 7747 | Switch_d4      |                                                                                                         |
| 7748 | Switch_d5      |                                                                                                         |
| 7749 | Switch_d6      |                                                                                                         |
| 7750 | Switch_d7      |                                                                                                         |
| 7751 | Switch_d8      |                                                                                                         |
| 7752 | Switch_d9      |                                                                                                         |
| 7753 | Switch_d10     |                                                                                                         |
| 7754 | Switch_d11     |                                                                                                         |
| 7755 | Switch_d12     |                                                                                                         |
| 7756 | Switch_d13     |                                                                                                         |
| 7757 | Switch_d14     |                                                                                                         |
| 7758 | Switch_d15     |                                                                                                         |
| 7759 | Switch_d16     |                                                                                                         |
| 7760 | Switch_d17     |                                                                                                         |
| 7761 | Switch_d18     |                                                                                                         |
| 7762 | Switch_d19     |                                                                                                         |
| 7763 | Switch_d20     |                                                                                                         |
| 7764 | Switch_d21     |                                                                                                         |
| 7765 | Switch_d22     |                                                                                                         |
| 7766 | Switch_d23     |                                                                                                         |
| 7767 | Switch_d24     |                                                                                                         |
| 7768 | Switch_d25     |                                                                                                         |
| 7769 | Switch_d26     |                                                                                                         |
| 7770 | Switch_d27     |                                                                                                         |
| 7771 | Switch_d28     |                                                                                                         |
| 7776 | I2S Out Data1  |                                                                                                         |
| 7777 | I2S Out Data2  |                                                                                                         |
| 7808 | I2S Out Clk1   |                                                                                                         |
| 7809 | I2S Out Clk2   |                                                                                                         |
| 7840 | I2S Out Slct1  |                                                                                                         |
| 7841 | I2S Out Slct2  |                                                                                                         |
| 7872 | I2S In Data1   |                                                                                                         |
| 7873 | I2S In Data2   |                                                                                                         |
| 7904 | I2S In Clk1    |                                                                                                         |
| 7905 | I2S In Clk2    |                                                                                                         |
| 7936 | I2S In Slct1   |                                                                                                         |
| 7937 | I2S In Slct2   |                                                                                                         |
| 7968 | Interrupt1     |                                                                                                         |
| 7969 | Interrupt2     |                                                                                                         |
| 7970 | Interrupt3     |                                                                                                         |
| 7971 | Interrupt4     |                                                                                                         |
| 7972 | Interrupt5     |                                                                                                         |
| 7973 | Interrupt6     |                                                                                                         |
| 7974 | Interrupt7     |                                                                                                         |
| 7975 | Interrupt8     |                                                                                                         |
| 7976 | Interrupt9     |                                                                                                         |
| 7977 | Interrupt10    |                                                                                                         |
| 7978 | Interrupt11    |                                                                                                         |
| 7979 | Interrupt12    |                                                                                                         |
| 7980 | Interrupt13    |                                                                                                         |
| 7981 | Interrupt14    |                                                                                                         |
| 7982 | Interrupt15    |                                                                                                         |
| 7983 | Interrupt16    |                                                                                                         |
| 7984 | Interrupt17    |                                                                                                         |
| 7985 | Interrupt18    |                                                                                                         |
| 7986 | Interrupt19    |                                                                                                         |
| 7987 | Interrupt20    |                                                                                                         |
| 7988 | Interrupt21    |                                                                                                         |
| 7989 | Interrupt22    |                                                                                                         |
| 7990 | Interrupt23    |                                                                                                         |
| 7991 | Interrupt24    |                                                                                                         |
| 7992 | Interrupt25    |                                                                                                         |
| 7993 | Interrupt26    |                                                                                                         |
| 7994 | Interrupt27    |                                                                                                         |
| 7995 | Interrupt28    |                                                                                                         |
| 8000 | MCP2515 CS     | MCP2515 Chip Select                                                                                     |
| 8032 | HRG15 Tx       | Hydreon RG-15 rain sensor serial interface                                                              |
| 8064 | HRG15 Rx       | Hydreon RG-15 rain sensor serial interface                                                              |
| 8096 | VINDRIKTNING   | IKEA VINDRIKTNING Serial interface                                                                      |
| 8128 | BL0939 Rx      | BL0939 Serial interface (Dual R3 v2)                                                                    |
| 8160 | BL0942 Rx      | BL0942 Serial interface                                                                                 |
| 8192 | HM330X SET     | HM330X SET pin (sleep when low)                                                                         |
| 8224 | Heartbeat      |                                                                                                         |
| 8256 | Heartbeat_i    |                                                                                                         |
| 8288 | 74x595 SRCLK   | 74x595 Shift register                                                                                   |
| 8320 | 74x595 RCLK    | 74x595 Shift register                                                                                   |
| 8352 | 74x595 OE      | 74x595 Shift register                                                                                   |
| 8384 | 74x595 SER     | 74x595 Shift register                                                                                   |
| 8416 | SolaxX1 RTS    | Solax Inverter Serial interface                                                                         |
| 8448 | OptionE1       | Emulated module                                                                                         |
| 8480 | SDM230 Tx      | SDM230 Serial interface                                                                                 |
| 8512 | SDM230 Rx      | SDM230 Serial interface                                                                                 |
| 8544 | ADC MQ1        | Analog MQ Sensor                                                                                        |
| 8545 | ADC MQ2        | Analog MQ Sensor                                                                                        |
| 8546 | ADC MQ3        | Analog MQ Sensor                                                                                        |
| 8547 | ADC MQ4        | Analog MQ Sensor                                                                                        |
| 8548 | ADC MQ5        | Analog MQ Sensor                                                                                        |
| 8549 | ADC MQ6        | Analog MQ Sensor                                                                                        |
| 8550 | ADC MQ7        | Analog MQ Sensor                                                                                        |
| 8551 | ADC MQ8        | Analog MQ Sensor                                                                                        |
| 8576 | CM110x TX      | CM11 Serial interface                                                                                   |
| 8608 | CM110x RX      | CM11 Serial interface                                                                                   |
| 8640 | BL6523 Tx      | BL6523 based Watt meter Serial interface                                                                |
| 8672 | BL6523 Rx      | BL6523 based Watt meter Serial interface                                                                |
| 8704 | ADE7880 IRQ1   | ADE7880 IRQ                                                                                             |
| 8705 | ADE7880 IRQ2   | ADE7880 IRQ                                                                                             |
| 8736 | Reset          | Generic reset                                                                                           |
| 8768 | MS01           | Sonoff MS01 Moisture Sensor 1wire interface                                                             |
| 8800 | SDIO CMD       | SD Card SDIO interface including 1-bit and 4-bit modes                                                  |
| 8832 | SDIO CLK       | SD Card SDIO interface including 1-bit and 4-bit modes                                                  |
| 8864 | SDIO D0        | SD Card SDIO interface including 1-bit and 4-bit modes                                                  |
| 8896 | SDIO D1        | SD Card SDIO interface including 1-bit and 4-bit modes                                                  |
| 8928 | SDIO D2        | SD Card SDIO interface including 1-bit and 4-bit modes                                                  |
| 8960 | SDIO D3        | SD Card SDIO interface including 1-bit and 4-bit modes                                                  |

## ADC Conversion

| Old ADC | New ADC | Option      | WebUI display                                                         | MQTT mesage                                                           |
|---|---|---|---|---|
| 0       | 0       | None        | none                                                                  | none                                                                  |
| 1       | 4704    | Analog      | Analog0 %value%                                                       | {"A0":%value%}                                                        |
| 2       | 4736    | Temperature | Temperature %value% °C (°F)                                           | {"Temperature":%value%},"TempUnit":"C"}                               |
| 3       | 4768    | Light       | Illuminance %value% lux                                               | {"Illuminance":%value%}                                               |
| 4       | 4800    | Button      | none                                                                  | none                                                                  |
| 5       | 4832    | Buttoni     | none                                                                  | none                                                                  |
| 6       | 4864    | Range       | Range %value%                                                         | {"Range":%value%}                                                     |
| 7       | 4896    | CT Power    | Voltage 230 V Current %value A Power %value W Energy Total %value kWh | {"Energy":_%value_,"Power":_%value_,"Voltage":230,"Current":_%value_} |
| 8       | 3328    | Joystick    | none                                                                  | {"ANALOG":{"Joy1":%value%}                                            |
