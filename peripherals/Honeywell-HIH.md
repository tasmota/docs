**This feature is included only in tasmota-sensors.bin** 

Otherwise you must [compile your build](compile-your-build). Add the following to `user_config_override.h`:
```
#ifndef USE_HIH6
#define USE_HIH6    // Enable Honeywell HIH (I2C address 0x27) (+0k6)
#endif
```
----
Honeywell HumidIcon™ Digital Humidity and Temperature Sensors HIH Series

## Configuration

#### Wiring
Get the 4 pin SIP version if possible, as this will be easier to solder than the 8 pin SMD version.

![wiring diagram](https://i.imgur.com/UzP6Z85.png)

![pins](https://i.imgur.com/GnNDvxm.jpg)

Looking at the side of the sensor with a filter:
* Pin 1 **VDD**
 1.  connect via 0.22 uF to ground
 1.  connect to 3v3 on the ESP
* Pin 2 **GND**
 1.  connect to GND on the ESP
* Pin 3 **SCL**
 1.  connect via 2k2 resistor to 3v3
 1.  connect to TX on the ESP 
* Pin 4 **SDA**
 1.  connect via 2k2 resistor to 3v3
 1.  connect to RX on the ESP

Remember to peel off the white sticker over the filter before use.

I have tested several of these without the 0.22 uF capacitor and without the pull-up resistors, and I haven't seen any difference in the readings.  The cap is probably more important that the resistors, since the internal pull-ups in the ESP8266 will work. That said, if I was installing these in a hard-to-service location, I would follow the wiring diagram exactly.

I have noticed that temperature readings tend to be a degree or so high if the sensor is wired directly to the ESP:
![directly connected - don't do this!](https://i.imgur.com/yKGJ8OR.jpg)

Soldering a 1-2" piece of wire between the ESP and the HIH7121 fixes this issue:
![connect via a short wire](https://i.imgur.com/AznIPGX.jpg)

#### Tasmota Settings
In the _Configuration -> Configure Module_ page assign:
1. GPIO RX to `I2C SDA (6)`
2. GPIO TX to `I2C SCL (5)`

After a reboot the driver will detect the HIHxxxx automatically and display sensor data.

<--- ![tasmota setup](https://i.imgur.com/UYOUPm7.png)

>if you have an LCD display also configured, run `I2CDriver3 0`
>
> More documentation on this is in the [I2CDEVICES.md](https://github.com/arendst/Tasmota/blob/development/I2CDEVICES.md) file.

### Why the Honeywell HIH series sensors?
The go-to humidity sensor for the DIY Arduino/ESP8266 community is the DHT22.  Unfortunately, this sensor has a tendency to collect condensation and give false readings (usually 99.9% RH) in wet environments like a bathroom or outside.  Not being able to use a humidity sensor in a wet area (IMHO) defeats the point of a humidity sensor, so I set about looking for alternatives.

After looking at several options, I found the Honeywell HIHxxxx sensors. Different models of the HIH line have different features and work over different ranges of humidity, but most of them use the same I2C protocol, which is now supported in Tasmota.  Check the [datasheets](https://sensing.honeywell.com/sensors/humidity-sensors) to compare sensors.  One of the most critical features to look for is a hydrophobic filter which allows humid air through, but blocks water droplets from entering the sensor.  This is listed on the datasheets as "with filter,condensation resistant".  Also keep in mind the humidity range you'll be measuring.

For my purposes (bathroom humidity sensor), there was a clear choice in the HIH7121-021 ([datasheet](https://www.mouser.com/datasheet/2/187/honeywell-sensing-humidicon-hih7000-series-product-1140774.pdf), [non-affiliate direct link to product on Mouser](https://www.mouser.com/ProductDetail/Honeywell/HIH7121-021-001?qs=sGAEpiMZZMsrQJTAfdCBRHqyplkhxKu6kqHzVrlY%2FZM%3D), which works over a range of 0-100% RH, supports I2C, is accurate to within 3%, and has a hydrophobic filter. The article focuses on that sensor, but I suspect much of the information will be applicable to other HIHxxxx sensors.

by [@thepotoo](https://github.com/thepotoo)
