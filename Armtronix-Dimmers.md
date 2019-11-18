There is a small company making dimmers in about the same formfactor as a sonoff dual and single. These [Single](https://www.tindie.com/products/Armtronix/wifi-ac-dimmer-esp8266-one-triac-board-alexaecho/) and [Dual](https://www.tindie.com/products/Armtronix/wifi-ac-dimmer-two-triac-board/) dimmer boards have open source firmware. 

***Supported since version [6.4.0](https://github.com/arendst/Tasmota/pull/4321) as ARMTR Dimmer (56)*** 

## Hardware
The dimmers contain an ESP8266 for the wifi connection and an Atmega328 which monitors the mains frequency and dimm the lights using a triac and phase controlled dimming. Communication between the two is done using the serial port at 115200 baud. The dimmers contain extra connections (pin headers) for a 10K potentiometer. When this one is connected you get 10 step dimming of the lights which overrides the tasmota dimm level. This feature also works when the Tasmota firmware is non-functional, so it is nice as a fail safe feature. The setting of the potentiometer is fed back to the Tasmota firmware, so when the potentiometer dimmer is turned and the Tasmota setting overridden, the value in the Tasmota channel is representable of the dimmer value. 

## WARNINGS
[Phase dimming](https://www.ecmweb.com/lighting-control/shining-light-dimming) is not for all lights. Most incandescent bulbs will work, but for LED and CCFL bulbs you will need the special dimmable versions of these lights. The large Blue/Yellow Swedish furniture store has some nice ones.
Because these dimmers come in a small package, they lack a bit on the safety and interference side. A good idea would be to add a 1A fuse in the AC line and a R/C Snubber on the output. I also read somewhere that they work less well on 110VAC but this could probably be solved using a firmware update. The ESP8266 and Atmega are isolated from Mains. The used 220v-5V converter is the tried and tested HiLink 5V 0.6A PM01, but without the case.

## Software
For now, to use these dimmers you need to take it apart and flash new firmware to the ESP8266 and the Atmega328p using the Arduino IDE. The whole process is quite well documented for the [single](Wifi-Single-Dimmer-Board/Wifi-Single-Dimmer-Board/Document/A0004_Wifi_One_Dimmer_1A_Board.pdf) and [dual](Wifi-Two-Dimmer-Board/Doc/WiFi-Two-triac(SMD).pdf) dimmers. But you do need a USB to serial bridge, at best one with the DTR and RTS signals broken out as well. The software can be found in two Github repositories, for the [single](https://github.com/wvdv2002/Wifi-Single-Dimmer-Board/blob/master/Wifi-Single-Dimmer-Board/Arduino_Code/Atmega_Single_dimmerV0_6/Atmega_Single_dimmerV0_6.ino) and [dual](https://github.com/wvdv2002/Wifi-Two-Dimmer-Board/tree/master/Arduino_Code/Atmega328_two_dimmerV0.4_Tasmota) dimmer.

The Armtronix dimmer can be used in the Tasmota firmware by uncommenting the line `#define USE_ARMTRONIX_DIMMERS` in my_user_config.h and setting the module to ARMTR Dimmer. 

The Dual dimmer has a dual color led, which for now shows the wifi status of the Tasmota firmware. But this can be changed in the Tasmota firmware.


      
