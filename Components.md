?>**Component** is anything wired to the ESP8266/ESP8255 chip to be controlled by or send data to it. 

<img src="_media/components.png" style="float:right;height:8em;margin:10px"></img>
Components can be: buttons, switches, relays, LEDs, sensors, displays, MCU units, etc. Every component is assigned in the device template to the GPIO it is wired (connected) to.

Every Tasmota device has some components configured by default. Most often there is a relay, a button and a LED configured as is the case for a Sonoff Basic in the following image.

> [!TIP]
> GPIOs configured as User (255) are the GPIOs that can be assigned to components in the **Configure Module** page. 

## Assigning Components
<img src="_media/components2.png" style="float:right;height:10em;margin:10px"></img>
If you wish to expand a device with a [peripheral](peripherals/) component, after properly wiring everything, you need to assign it to a free GPIO in **Configure Module** page or use command [`GPIO<x>`](Commands#gpio).


Read more about [peripherals](peripherals/).

## Components List
[Google Sheet](https://docs.google.com/spreadsheets/d/10aYCaR3P09omn_vryFGyyq7dS-XK54K2fGAcb4gruik) of components by number and alphabetically

|#|Name|Description
|-:|:-:|-
| 255 | User        | GPIO configurable in modules                                                               |
| 0   | None        | Not used                                                                                   |
| 1   | DHT11       | DHT11 sensor                                                                               |
| 2   | AM2301      | AM230X, DHT21 and DHT22 sensor                                                             |
| 3   | SI7021      | Only for Sonoff Si7021, not the i2c version                                                |
| 4   | DS18x20     | Dallas Semiconductor DS18b20 1-Wire temperature sensor                                     |
| 5   | I2C SCL     | I2C serial clock pin, used with any I2C component (sensors, displays, ...)                 |
| 6   | I2C SDA     | I2C serial data pin, used with any I2C component (sensors, displays, ...)                  |
| 7   | WS2812      | Addressable LEDs such as WS281X or Neopixel                                                |
| 8   | IRsend      | IR Transmitter LED                                                                         |
| 9   | Switch1     | Switch                                                                                     |
| 10  | Switch2     | Switch                                                                                     |
| 11  | Switch3     | Switch                                                                                     |
| 12  | Switch4     | Switch                                                                                     |
| 13  | Switch5     | Switch                                                                                     |
| 14  | Switch6     | Switch                                                                                     |
| 15  | Switch7     | Switch                                                                                     |
| 16  | Switch8     | Switch                                                                                     |
| 17  | Button1     | Button                                                                                     |
| 18  | Button2     | Button                                                                                     |
| 19  | Button3     | Button                                                                                     |
| 20  | Button4     | Button                                                                                     |
| 21  | Relay1      | Relay                                                                                      |
| 22  | Relay2      | Relay                                                                                      |
| 23  | Relay3      | Relay                                                                                      |
| 24  | Relay4      | Relay                                                                                      |
| 25  | Relay5      | Relay                                                                                      |
| 26  | Relay6      | Relay                                                                                      |
| 27  | Relay7      | Relay                                                                                      |
| 28  | Relay8      | Relay                                                                                      |
| 29  | Relay1i     | Relay inverted                                                                             |
| 30  | Relay2i     | Relay inverted                                                                             |
| 31  | Relay3i     | Relay inverted                                                                             |
| 32  | Relay4i     | Relay inverted                                                                             |
| 33  | Relay5i     | Relay inverted                                                                             |
| 34  | Relay6i     | Relay inverted                                                                             |
| 35  | Relay7i     | Relay inverted                                                                             |
| 36  | Relay8i     | Relay inverted                                                                             |
| 37  | PWM1        | Pulse Width Modulated Output                                                               |
| 38  | PWM2        | Pulse Width Modulated Output                                                               |
| 39  | PWM3        | Pulse Width Modulated Output                                                               |
| 40  | PWM4        | Pulse Width Modulated Output                                                               |
| 41  | PWM5        | Pulse Width Modulated Output                                                               |
| 42  | Counter1    | Counter Input                                                                              |
| 43  | Counter2    | Counter Input                                                                              |
| 44  | Counter3    | Counter Input                                                                              |
| 45  | Counter4    | Counter Input                                                                              |
| 46  | PWM1i       | Pulse Width Modulated inverted Output                                                      |
| 47  | PWM2i       | Pulse Width Modulated inverted Output                                                      |
| 48  | PWM3i       | Pulse Width Modulated inverted Output                                                      |
| 49  | PWM4i       | Pulse Width Modulated inverted Output                                                      |
| 50  | PWM5i       | Pulse Width Modulated inverted Output                                                      |
| 51  | IRrecv      | IR Receiver Input (for example TSOP1838)                                                   |
| 52  | Led1        | LED                                                                                        |
| 53  | Led2        | LED                                                                                        |
| 54  | Led3        | LED                                                                                        |
| 55  | Led4        | LED                                                                                        |
| 56  | Led1i       | Inverted LED - default state ON                                                            |
| 57  | Led2i       | Inverted LED - default state ON                                                            |
| 58  | Led3i       | Inverted LED - default state ON                                                            |
| 59  | Led4i       | Inverted LED - default state ON                                                            |
| 60  | MHZ Rx      | MHZ 19 CO2 Sensor                                                                          |
| 61  | MHZ Tx      | MHZ 19 CO2 Sensor                                                                          |
| 62  | PZEM0XX Tx  | Peacefair Pzem-0XX Power Meter Tx pin                                                      |
| 63  | PZEM004 Rx  | Peacefair Pzem-004 Power Meter Rx pin                                                      |
| 64  | SAir Rx     | Sensor Senseair                                                                            |
| 65  | SAir Tx     | Sensor Senseair                                                                            |
| 66  | SPI CS      | SPI Interface (ePaper Display)                                                             |
| 67  | SPI DC      | SPI Interface (ePaper Display)                                                             |
| 68  | BkLight     | Backlight (Display)                                                                        |
| 69  | PMS5003     | PMS5003 Air Quality Sensor                                                                 |
| 70  | SDS0X1 Rx   | Nova Fitness SDS011 Laser Dust Sensor Rx pin                                               |
| 71  | SerBr Rx    | Serial Bridge Receive                                                                      |
| 72  | SerBr Tx    | Serial Bridge Transmit                                                                     |
| 73  | SR04 Tri    | Ultrasonic Sensor HC-SR04 Trigger pin                                                      |
| 74  | SR04 Ech    | Ultrasonic Sensor HC-SR04 Echo pin                                                         |
| 75  | SDMx20 Tx   | SDMx20-Modbus Multifunction Power Analyser Tx pin                                          |
| 76  | SDMx20 Rx   | SDMx20-Modbus Multifunction Power Analyser Rx pin                                          |
| 77  | SDM630 Tx   | SDM630-Modbus Multifunction Power Analyser Tx pin                                          |
| 78  | SDM630 Rx   | SDM630-Modbus Multifunction Power Analyser Rx pin                                          |
| 79  | TM16 CLK    | TM1638 Switch Module                                                                       |
| 80  | TM16 DIO    | TM1638 Switch Module                                                                       |
| 81  | TM16 STB    | TM1638 Switch Module                                                                       |
| 82  | Switch1n    | Switch, no pullup resistor                                                                 |
| 83  | Switch2n    | Switch, no pullup resistor                                                                 |
| 84  | Switch3n    | Switch, no pullup resistor                                                                 |
| 85  | Switch4n    | Switch, no pullup resistor                                                                 |
| 86  | Switch5n    | Switch, no pullup resistor                                                                 |
| 87  | Switch6n    | Switch, no pullup resistor                                                                 |
| 88  | Switch7n    | Switch, no pullup resistor                                                                 |
| 89  | Switch8n    | Switch, no pullup resistor                                                                 |
| 90  | Button1n    | Button, no pullup resistor                                                                 |
| 91  | Button2n    | Button, no pullup resistor                                                                 |
| 92  | Button3n    | Button, no pullup resistor                                                                 |
| 93  | Button4n    | Button, no pullup resistor                                                                 |
| 94  | Counter1n   | Counter sensor, no pullup resistor                                                         |
| 95  | Counter2n   | Counter sensor, no pullup resistor                                                         |
| 96  | Counter3n   | Counter sensor, no pullup resistor                                                         |
| 97  | Counter4n   | Counter sensor, no pullup resistor                                                         |
| 98  | PZEM016 Rx  | Peacefair Pzem-016 Power Meter Rx pin                                                      |
| 99  | PZEM017 Rx  | Peacefair Pzem-017 Power Meter Rx pin                                                      |
| 100 | MP3 Player  | DF MP3 Player mini (Input)                                                                 |
| 101 | SDS0X1 Tx   | Nova Fitness SDS011 Laser Dust Sensor Tx pin                                               |
| 102 | HX711 SCK   | HX711 weight sensor serial clock input                                                     |
| 103 | HX711 DAT   | HX711 weight sensor data output                                                            |
| 104 | TX20        | TX20 Wind Sensor Input (Tx from sensor)                                                    |
| 105 | RFSend      | RF Emitter (433Mhz module needed; Requires self-compile with RF_SENSOR and USE_RC_SWITCH)  |
| 106 | RFrecv      | RF Receiver (433Mhz module needed; Requires self-compile with RF_SENSOR and USE_RC_SWITCH) |
| 107 | Tuya Tx     | Tuya Transfer pin                                                                          |
| 108 | Tuya Rx     | Tuya Receive pin                                                                           |
| 109 | MGC3130 Xfr | MGC3130 E-field Xfr pin                                                                    |
| 110 | MGC3130 Rst | MGC3130 E-field Reset pin                                                                  |
| 111 | SSPI MISO   | Software SPI MISO (Display)                                                                |
| 112 | SSPI MOSI   | Software SPI MOSI (Display)                                                                |
| 113 | SSPI SCLK   | Software SPI SCLK (Display)                                                                |
| 114 | SSPI CS     | Software SPI CS (Display)                                                                  |
| 115 | SSPI DC     | Software SPI DC (Display)                                                                  |
| 116 | RF Sensor   | Theo Arendst RF433 Sensor                                                                  |
| 117 | AZ Rx       | AZ 7798 CO2 datalogger                                                                     |
| 118 | AZ Tx       | AZ 7798 CO2 datalogger                                                                     |
| 119 | MX31855 CS  | MAX31855 Thermocouple Sensor Chip Select pin                                               |
| 120 | MX31855 CLK | MAX31855 Thermocouple Sensor Serial Clock pin                                              |
| 121 | MX31855 DO  | MAX31855 Thermocouple Sensor Digital Output pin                                            |
| 122 | Button1i    | Button inverted                                                                            |
| 123 | Button2i    | Button inverted                                                                            |
| 124 | Button3i    | Button inverted                                                                            |
| 125 | Button4i    | Button inverted                                                                            |
| 126 | Button1in   | Button inverted, no pullup resistor                                                        |
| 127 | Button2in   | Button inverted, no pullup resistor                                                        |
| 128 | Button3in   | Button inverted, no pullup resistor                                                        |
| 129 | Button4in   | Button inverted, no pullup resistor                                                        |
| 130 | HLWBL SEL   | Energy Monitoring (for example Pow)                                                        |
| 131 | HLWBL SELi  | Energy Monitoring (for example Pow)                                                        |
| 132 | HLWBL CF1   | Energy Monitoring (for example Pow)                                                        |
| 133 | HLW8012 CF  | HLW8012 Single Phase Energy Monitor Chip CF pin                                            |
| 134 | BL0937 CF   | BL0937 Single Phase Energy Monitor Chip CF pin                                             |
| 135 | MCP39F5 Tx  | Energy Monitoring (for example Shelly2)                                                    |
| 136 | MCP39F5 Rx  | Energy Monitoring (for example Shelly2)                                                    |
| 137 | MCP39F5 Rst | Energy Monitoring (for example Shelly2)                                                    |
| 138 | PN532 Tx    | PN532 RFID/NFC Reader Tx pin                                                               |
| 139 | PN532 Rx    | PN532 RFID/NFC Reader Rx pin                                                               |
| 140 | SM16716 CLK | SM16716 Pixel LED Serial Clock pin                                                         |
| 141 | SM16716 DAT | SM16716 Pixel LED Data pin                                                                 |
| 142 | SM16716 PWR | SM16716 Pixel LED Power pin                                                                |
| 143 | MY92x1 DI   | Light Bulb with MY92x controller                                                           |
| 144 | MY92x1 DCKI | Light Bulb with MY92x controller                                                           |
| 145 | CSE7766 Tx  | CSE7766 Single Phase Energy Monitor Chip Tx pin                                            |
| 146 | CSE7766 Rx  | CSE7766 Single Phase Energy Monitor Chip Rx pin                                            |
| 147 | ALux IrRcv  | AriLux RGB Controller IR receive (Input)                                                   |
| 148 | Serial Tx   | Serial Transfer pin                                                                        |
| 149 | Serial Rx   | Serial Receive pin                                                                         |
| 150 | Rotary1a    | Rotary Encoder (Mi Desk Lamp)                                                              |
| 151 | Rotary1b    | Rotary Encoder (Mi Desk Lamp)                                                              |
| 152 | Rotary1c    | Rotary Encoder (Mi Desk Lamp)                                                              |
| 153 | Rotary1d    | Rotary Encoder (Mi Desk Lamp)                                                              |
| 154 | HRE CLOCK   | Clock/Power line for HR-E Water Meter                                                      |
| 155 | HRE DATA    | Data line for HR-E Water Meter                                                             |
| 156 | ADE7953_IRQ | ADE7953 IRQ                                                                                |
| 157 | LedLink     | Device Status LED                                                                          |
| 158 | LedLinki    | Device Status LED, inverted                                                                |
| 159 | ALux IrSel  | For AriLux devices - switches between IR/RF mode                                           |
| 160 | Buzzer      | Sonoff iFan03 Buzzer                                                                       |
| 161 | Buzzeri     | Sonoff iFan03 Buzzer inverted                                                              |
| 162 | OLED Reset  | OLED Display Reset                                                                         |
| 163 | SolaxX1 Tx  | Solax Inverter Tx pin                                                                      |
| 164 | SolaxX1 Rx  | Solax Inverter Rx pin                                                                      |
| 165 | Zigbee Tx   | Zigbee Serial interface Tx                                                                 |
| 166 | Zigbee Rx   | Zigbee Serial interface Rx                                                                 |
| 167 | RDM6300 Rx  | RDM6300 RX                                                                                 |
| 168 | iBeacon Tx  | HM17 iBeacon Tx                                                                            |
| 169 | iBeacon Rx  | HM17 iBeacon Rx                                                                            |
| 170 | A4988 DIR   | A4988 Motor Direction                                                                      |
| 171 | A4988 STP   | A4988 Step motor                                                                           |
| 172 | A4988 ENA   | A4988 Enable motor                                                                         |
| 173 | A4988 MS1   | A4988 Microstep increment select pin1                                                      |
| 174 | A4988 MS2   | A4988 Microstep increment select pin2                                                      |
| 175 | A4988 MS3   | A4988 Microstep increment select pin3                                                      |
| 176 | DDS238-2 Tx | DDS2382 Serial interface Tx                                                                |
| 177 | DDS238-2 Rx | DDS2382 Serial interface Rx                                                                |
| 178 | DDSU666 Tx  | DDSU666 Serial interface Tx                                                                |
| 179 | DDSU666 Rx  | DDSU666 Serial interface Rx                                                                |
| 180 | SM2135 CLK  | SM2135 Clk                                                                                 |
| 181 | SM2135 DAT  | SM2135 Dat                                                                                 |
| 182 | DeepSleep   | DeepSleep wake switch                                                                      |
| 183 | EXS Enable  | EXS Dimmer MCU Enable                                                                      |
| 184 | Slave TX    | TasmotaSlave TX                                                                            |
| 185 | Slave RX    | TasmotaSlave RX                                                                            |
| 186 | Slave RST   | TasmotaSlave Reset Pin                                                                     |
| 187 | Slave RSTi  | TasmotaSlave Reset Inverted                                                                |
| 188 | HPMA RX     | Honeywell HPMA115S0 Serial Rx                                                              |
| 189 | HPMA TX     | Honeywell HPMA115S0 Serial Tx                                                              |
