***indirectly supported as configuration of Digoo NX-SP202 seems to work fine***

Device can switch 2 individual plugs. It has a builtin metering sensor which measures power consumption of the sum of both.

My 2 devices I bought at Amazon have ROHS and CE signs and are officially valid for a maximum of 16A.

You can buy it at [Amazon](https://www.amazon.de/dp/B07LC4M1BK)

According to the template configuration the device seems to be compatible with [Digoo NX-SP202](https://de.aliexpress.com/item/DIGOO-NX-SP202-Dual-EU-Stecker-Smart-WIFI-Buchse-Individuelle-Steuerbar-Energie-Monitor-Fernbedienung-Timing-Smart/32952717922.html)

## Configuration
Currently Slitinto is not present as separate module but DIGOO NX-SP202 seems to work.
I had to adjust voltage and current with the following commands in the console
* command VoltageSet 233 // measured with a multimeter
* command CurrentSet 171 // known milliampere of my reference (here lightbulb of 40watts)
This calibration is potentially individual for every device so I would suggest to calibrate it with a known power consuming device like a good old light bulb where the wattage is well known.


# Flashing
## Disassembly
The device has no screws but disassembling as not needed as you can flash it OTA using tuya-convert.
Nevertheless one user described a method to "crack" it using a rubber hammer and then glue it together again with no visible defects.

## Pinout
Not known.

## Procedure
[Here](https://github.com/arendst/Tasmota/issues/3950) is described how to crack the device but also how to flash it OTA.

# Miscellaneous
I use metering capable devices to observe the power consumption and execute rule based behaviour on base of the consumption values.

i.e.: if the power consumption is lower than 10W for 30min (checked every 60 seconds) then switch off.

My script for this looks like this:
* rule1 on Energy#Power>10 do backlog ruletimer1 1800; ruletimer2 60; rule1 off; endon
* rule2 on rules#timer=1 do power2 off endon
* rule3 on rules#timer=2 do rule1 on endon
* rule1 on
* rule2 on
* rule3 on