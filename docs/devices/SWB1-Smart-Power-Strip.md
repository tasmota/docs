### Product
SWB1 Wi-Fi smart power strip with 4 main ports. Each port can be controlled manually
FCCID: 2AJK8-SWB1
This is a new device not using the Tuya PCB but is an esp8266ex based and works great with Tasmota

The product can be purchased on amazon.ca (could be found on other amazon sites)
![SWB1-power_strip](https://raw.githubusercontent.com/rigorm/Tasmota-contrib/master/SWB1-power_strip.jpg)

### Inside
![SWB1-inside](https://raw.githubusercontent.com/rigorm/Tasmota-contrib/master/SWB1-inside.jpg)
Inside PCB

![SWB1-WT8288-S1](https://raw.githubusercontent.com/rigorm/Tasmota-contrib/master/SWB1-WT8288-S1.jpg)
The chip used WT8266-S1. The specs can be found on [wireless-tags.com](http://www.wireless-tags.com)

### JTAG
![WT8266-S1_annoted](https://raw.githubusercontent.com/rigorm/Tasmota-contrib/master/WT8266-S1_annoted.jpg)
Pins used. You can choose one of 3 GND to your liking. the RESET(RST) pin is also marked for those that use that pin to reset the chip while flashing

Alternatively, you can solder a header on to the COM2 through holes, and use those for flashing the WT8266
![SWB1 COM2 annotated](https://raw.githubusercontent.com/jrstarke/tasmota-docs/SWB1-COM2/docs/_media/SWB1-COM2.jpg)

### TASMOTA CONFIGURATION
![SWB1-Power_strip_tasmota_configs](https://raw.githubusercontent.com/rigorm/Tasmota-contrib/master/SWB1-Power_strip_tasmota_configs.png)
