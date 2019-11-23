# Description
Very nice and cheap plug :)

https://www.amazon.de/gp/product/B07FD971T9/

# Features:
* 3800 W switchi ng
* USB port 5V 2.1A for charging
* Power monitor
* Tuya compatible

# Model description
* FLHS ZN04

# Configuration
Tasmota template based on BlitzWolf (45)

> {"NAME":"Plug","GPIO":[57,0,56,0,0,134,0,0,131,17,132,21,0],"FLAG":0,"BASE":45}

# Flashing
It is possible to flash over OTA. But, it seems flashing via OTA may leave remains of old firmware because it wasn't fully erased before flashing Tasmota. So the device can fail after feature updates. (I have 3 devices originally flashed via OTA bricked after update later). So if you flashed via OTA it better to not update FW anymore.
Unfortunately I bricked one of my plugs (probably by typing wrong Wifi name), so I needed to flash manually.

Manual flash should be done exactly as shown here:
* https://github.com/arendst/Tasmota/issues/3950#issuecomment-436074625
* devices/Hyleton-313-Smart-Plug

Access to the internals is easy. Casing is held by 3 torx screws (no glue anywhere).

# Chip info
> Detecting chip type... ESP8266
> Chip is ESP8266EX
> Features: WiFi
> MAC: 
> Manufacturer: a1
> Device: 4014
> Detected flash size: 1MB
