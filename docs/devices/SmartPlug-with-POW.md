Smart Plugs from Amazon with same internal parts:
- [AISIRER](https://www.amazon.de/dp/B07DGH8Y8S)
- [AVATAR](https://www.amazon.de/dp/B07D73S72W)

### Device:
- solid design with 16A Relays
- 8 MB memory chip
- 2 LEDs
- POW function (unfortunately did not test yet, need help)
- very small size, easy to disassemble
- no need to disassemble PCBs
- test mode works with 5 or 3.3 V (relays also works)

**Disassemble**
* take off the lead with 2 screws
* put small cross screwdriver **inside** 220V plug connector, there are 2 screws 
* free the antenna from plastic (no need to disconnect)
* pull of PCB from the case

**Important build flags.**
* in Platformio for Tasmota flag change from 1MB to 8MB is needed, otherwise flash fails.
  build_flags = ${esp82xx_defaults.build_flags} -Wl,-Teagle.flash.8m.ld  
* in Arduino IDE:
  board selected - "Node MCU 1.0", standard

Found how some of PINS are linked to main PCB and are easy to connect for flashing

[PCB](https://drive.google.com/open?id=1ggvDwS6b83ZdMiPbk4BkTA-crqfShJYv)

### Flashing:
I've decided to use 5V - there is a painted pad on the PCB, clean it and attach 5V (see image)
* Connect GPIO0 to GND
* Connect RX, TX
* Connect 5V and GND
* Connect USB to PC, start flashing

Tasmota WEB config (Generic)
* GPIO0 - Led1i
* GPIO2 - Led2i
* GPIO5 - HLW8012 CF
* GPIO12 - HLWBLSELi
* GPIO13 - Button1
* GPIO14 - HLWBL CF1
* GPIO15- Relais1

[webconfig](https://drive.google.com/open?id=12ysKDN6wBvdHVVC33qB3a9rpg5mzKCC7)

**IMPORTANT:** in order to have an accurate measurement of Voltage/Current/Power, you have to calibrate the internal meter with a well know load (like lamp or hair dryer) using this [detailed procedure](/Power-Monitoring-Calibration).

## Update from my side
I managed to flash two Aisirer plugs using pre-compiled tasmota.binaries, since my plugs had only 1M flash. I used 3.3V connected directly to the ESP board. I had some trouble with WLAN connectivity which caused the relays to pulse, so I switched to 2.3.0 core, which seems default again since a few releases. This runs quite well.
Configure as BlitzWolf SHP(45) Module and also the power measurement is working.

## Update from nos86
I have updated the guide in order to interface Tasmota with the power meter inside smart plug (tested only on AISIRER) and added the link for the power monitoring calibration
