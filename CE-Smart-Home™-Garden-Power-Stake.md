
### Device Template
```
{"NAME":"CE Power Stake","GPIO":[255,255,255,255,56,57,255,255,21,17,255,255,255],"FLAG":0,"BASE":18}
```
### Connection
This 6-outlet outdoor garden power stake is controlled by a standard ESP-12 chip connected to a single relay, meaning that all 6 outlets are on or off simultaneously. It also has a mains switch, a manual relay trigger button, and an LED indicator.

|Programmer  | Power Stake        |
|------------|--------------------|
|        3V3 | VCC                |
|         TX | RX                 |
|         RX | TX                 |
|        GND | GND                |

The button is not connected to `D0`, so you will need to shunt `D0`/`GPIO0` to GND to enable programming mode. You may need to briefly shunt RESET to GND in order to initiate connections to the device.

### Internal Device Image
[[https://github.com/untergeek/shared_images/blob/master/devices/powerstake/powerstake_esp12s.jpg|alt=PowerStake Pinout]]
   
### Generic Module Config
[[https://github.com/untergeek/shared_images/blob/master/devices/powerstake/powerstake_tasmota_config.jpg|alt=Generic Module Config]] 

### Additional Information

This device was found at Costco, and in fact appears to be made _for_ Costco (see image below). The regular price was $13.97 USD, but was on sale for Christmas for $9.99 USD.

[[https://github.com/untergeek/shared_images/blob/master/devices/powerstake/powerstake_front.jpg|alt=PowerStake Box Front]]
[[https://github.com/untergeek/shared_images/blob/master/devices/powerstake/powerstake_rear.jpg|alt=PowerStake Box Rear]]
[[https://github.com/untergeek/shared_images/blob/master/devices/powerstake/powerstake_side1.jpg|alt=PowerStake Box Side 1]]
[[https://github.com/untergeek/shared_images/blob/master/devices/powerstake/powerstake_side2.jpg|alt=PowerStake Box Side 2]]

[[https://github.com/untergeek/shared_images/blob/master/devices/esp12-pinout.png|alt=ESP12]]