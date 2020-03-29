Opening my Sonoff 4CH (https://www.itead.cc/sonoff-4ch.html) I realized that on PCB there is a predisposition for 2.5 mm jack (also confirmed by schematic on Itead wiki: https://www.itead.cc/wiki/File:Sonoff_4CH.SCHMATIC.pdf).

I ordered on Aliexpress some 2.5 mm jacks and when I received it after some work...

<p align="center">
  <img src="https://github.com/arendst/arendst.github.io/blob/master/media/4chjack/sf4ch-jack.jpg?raw=true">
</p>

The schematic reports that 2.5 mm jack is configured as following (jack on right side, ESP8285 on the left side:

<p align="center">
  <img src="https://github.com/arendst/arendst.github.io/blob/master/media/4chjack/sf4ch-schematic.png">
</p>

3.3V and GND are very welcome for sensors expansions but GPIO7 and GPIO8 are not usable because they are used internally by ESP8285 for flash memory connection (sigh!)

R35 and R36 resistors are not soldered on Sonoff 4CH PCB and it is possible to use their pads to "manually route" the jack contact on another ESP8285 pin (!). I selected R35 pad because my "waterproof" DS18B20 sensors provide signal line on TEM1 jack contact. 
For ESP8285 pin I prefer IO2 that is already available on header programming pins...

Then the route to do is: TEM1 -> R35 pad -> GPIO2:

| ![](https://github.com/arendst/arendst.github.io/blob/master/media/4chjack/r35-zoom.jpg) |![](https://github.com/arendst/arendst.github.io/blob/master/media/4chjack/r35.jpg)  | 
|---|---|

|![](https://github.com/arendst/arendst.github.io/blob/master/media/4chjack/sf4ch-pcb-rear.jpg)|![](https://github.com/arendst/arendst.github.io/blob/master/media/4chjack/rear-zoom.jpg)|
|---|---|

DS18B20 sensors need a 4.7Kohm pullup resistor between DATA pin and 3.3V and this is also useful to pullup GPIO2 in order to avoid ESP8285 reset.

Final result in these photos:

|![](https://github.com/arendst/arendst.github.io/blob/master/media/4chjack/final-jack.jpg) |![](https://github.com/arendst/arendst.github.io/blob/master/media/4chjack/final-result.jpg) |
|---|---|

Tasmota is also configured with DS18x20 on GPIO2 and it works !

|![](https://github.com/arendst/arendst.github.io/blob/master/media/4chjack/Sonoff-Configure-Module.png)|![](https://github.com/arendst/arendst.github.io/blob/master/media/4chjack/Sonoff-Main-Menu.png)|
|---|---|

****Note****: source file [sonoff/sonoff_template.h ](https://github.com/arendst/Tasmota/blob/development/sonoff/sonoff_template.h) provides the configuration on Sonoff 4CH and it is also possible to use GPIO16 (as in the screenshot above) but be aware that no interrupts can be used on GPIO16 and
you could have problems with some sensors.


