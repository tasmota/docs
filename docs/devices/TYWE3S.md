Pinout for flashing TYWE3S devices. Module has a nearly identical pinout to ESP-12 module series.

![Flashing pinout](/docs/_media/TYWE3S_pinout.png)

### TYWE3S Wiring for Flashing
Vcc - 3.3V  
TX - RX  
RX - TX  
GND - GND

Make sure to ground GPIO0 during boot.

[TYWE3S](https://docs.tuya.com/en/hardware/WiFi-module/wifi-e3s-module-plug.html) - [Flashing Jig](https://www.thingiverse.com/thing:3231225)
 
### Additional Information

![Full pinout](/docs/_media/TYWE3S_fullpinout.png)

| Pin Number | Symbol | IO type |                                       Function                                      |
|:----------:|:------:|:-------:|:-----------------------------------------------------------------------------------:|
| 1          | TXD0   | O       | UART0_TXD                                                                           |
| 2          | RXD0   | I/O     | UART0_RXD                                                                           |
| 3          | GPIO5  | I/O     | GPIO5_05                                                                            |
| 4          | GPIO4  | I/O     | GPIO5_04                                                                            |
| 5          | GPIO0  | I/O     | GPIO5_0<br>(Participate in the module power-on initialization process,use with caution) |
| 6          | GPIO2  | O       | UART0_TXD<br>(Used to print module internal information)                                |
| 7          | GPIO15 | O       | GPIO_15<br>(Participate in the module power-on initialization process,use with caution) |
| 8          | GND    | P       | Power Reference Ground                                                              |
| 9          | VCC    | P       | Module Power Pin<br>(3.3V)                                                              |
| 10         | GPIO13 | I/O     | GPIO_13                                                                             |
| 11         | GPIO12 | I/O     | GPIO_12                                                                             |
| 12         | GPIO14 | I/O     | GPIO_14                                                                             |
| 13         | GPIO16 | I/O     | GPIO_16<br>(Use 10K pull-up resistor for use)                                           |
| 14         | EN     | I       | Module enable pin,normal use needs to receive 3.3V                                  |
| 15         | ADC    | AI      | ADC port, 10-bit precision SAR ADC                                                  |
| 16         | RST    | I/O     | Hardware reset pin (low level effective, internal pull-up resistance)               |

For Switches and dimmers with additional MCU check guide [here](../TuyaMCU) 
