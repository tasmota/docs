### Connection
Vcc - 3,3V  
TX - RX  
RX - TX  
GND - GND

For flashing you need to connect GPIO0 to GND

### Additional Information
## Hardware details
* ESP8266 - on TYWE2S Module
* HLW8012 - Power Monitor Chip
* SRU 5VDC SDA - Relais

## GPIO0
You need to solder a wire to the test-point on the TYWE2S  Module to be able to enter the flashmode. The Resest Pin has no function for that purpose.

### Device Images
![SmartPlug](https://user-images.githubusercontent.com/24415462/46573064-ec7e3300-c98f-11e8-827e-15c7e803ece5.png)
![PCB-back](https://user-images.githubusercontent.com/24415462/46572634-b9d13c00-c989-11e8-835a-ea3ac254bb29.png)
![ESP-Module](https://user-images.githubusercontent.com/24415462/46572635-b9d13c00-c989-11e8-8fd4-a8f6b28fddaa.png)

### GPIO Config
Power Monitoring will not work with that configuration... wait for software update in case you want to use it

**UPDATE: with Tasmota 6.3.0 you have fully monitoring support (Add support for CSL Aplic WDP 303075 Power Socket with Energy Monitoring (#3991, #3996))**

![generic_config](https://user-images.githubusercontent.com/24415462/46572853-1550f900-c98d-11e8-8ecc-317e314e3ade.PNG)

