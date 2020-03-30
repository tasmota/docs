To wire a DHT11 up to a Sonoff Basic, I first soldered a pin header to the main pin header row. For the location see [[GPIO-Locations]].

I decided to use regular 2.54mm connectors (often referred to as Dupont connectors), so that I can switch sensors if I have to. In order to fit the dupont cables within the enclosure, I had to bend the 2.54mm pin headers by about 45°.

As the DHT11 requires a pullup (depending on the cable length), and I didn't want to design a PCB just to connect 3 wires and a resistor, I came up with the solution described below.

![](https://pbs.twimg.com/media/Dfutw9EW4AAB6IY.jpg)

First, I slipped ferrules over the DHT11 pins and inserted the wires. This makes it a lot easier to hold the cables and the DHT11 pins in place.

I left a bit more wire exposed so that I have a place to apply solder without burning the wire insulation. I applied heat to the ferrule, not the wire, and applied solder directly at the end of the ferrule.

Solder will then flow into the ferrule.

![](https://pbs.twimg.com/media/DfuuNi0XkAEYSyv.jpg)

I also added a small solder blob (visible on the top ferrule) so that I can solder an 0805 resistor in place. Thanks to the ferrule, the wires won't become detached when heated again. Keep in mind that the ferrule has quite some heat capacity, so wait for the solder to cool down prior moving the wires or the sensor.

![](https://pbs.twimg.com/media/DfuuvQKXUAAYaZx.jpg)

I then did shrink the 2:1 green heatshrink tubes so that the contacts don't touch each other.

Also, it is *so* very handy to have 4:1 shrinking tube. An 8mm 4:1 tube fits perfectly over the pins, and fully encloses the 3 wires.

Get 4:1 heatshrink tube. It's so worth it.

Here's how the finished project looks like:

![](https://pbs.twimg.com/media/Dfuz8TuWkAEfmTJ.jpg)