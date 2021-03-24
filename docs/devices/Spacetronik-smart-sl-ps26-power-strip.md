### Product
Spacetronik SMART SL-PS26 Power Strip with 4 main ports and 4 USB ports. All USBs are on 1 relay.

![SL-PS26-power_strip](https://raw.githubusercontent.com/fast-potat0/images/master/sl-ps26powerstrip.jpg)

### TASMOTA CONFIGURATION
![SWB1-Power_strip_tasmota_configs](https://raw.githubusercontent.com/fast-potat0/images/master/RelayGPIO.png)
D3 GPIO0 LED_i 1
D2 GPIO4 Relay 5
D1 GPIO5 Relay 2
D6 GPIO12 Relay 4
D7 GPIO13 Button 1
D5 GPIO14 Relay 3
D8 GPIO15 Relay 1

Power strip has RGB LEDs in button, but I think Tasmota won't be able to take advantage of that, so I didn't look for further LEDs.

