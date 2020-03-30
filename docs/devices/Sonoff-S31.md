⚠️️️ **Do not connect AC power and the serial connection at the same time** ️️️⚠️️️

The GND connection of the S31 is connected to the live AC wire. Connecting serial with your PC will fry your PC and will electrocute you. 

**DO NOT CONNECT ANY SENSOR TO THESE DEVICES.** Only use them as designed. 

**The GPIOs on this device are connected to AC power**, therefore it is not possible to safely add sensors or displays to it. 

## Serial Flashing
The S31 is pretty easy to take apart.
1. Pry off the gray cover on the end.
1. Slide off the two rounded corner pieces to reveal the 3 screws.
1. Unscrew the 3 screws.
1. Lift off the cover.
1. There are no through holes.  You can solder a piece of header or you can fabricate something using pogo pins and just hold it for the duration of the flashing process.  But, be aware that can get tiring if you need to do it multiple times.
1. The pads are labeled, you need VCC, RX, TX, GND.  There are two others that also have RX and TX on them.  The ones next to the GND pin are not used for flashing.
1. Connect to your serial converter and 3V3.
1. You need to press the switch (GPIO0) before applying power to put into bootloader mode.

For exact energy monitoring you might need to [calibrate the device](/Power-Monitoring-Calibration).

Tinkerman's review of [Sonoff S31](http://tinkerman.cat/sonoff-s31-now-serious/)

### Video tutorial by BK Hobby
[![](http://img.youtube.com/vi/kKtLKjI4wA0/0.jpg)](http://www.youtube.com/watch?v=kKtLKjI4wA0 "")

