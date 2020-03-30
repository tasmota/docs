These Wi-Fi Smart Light Switches are essentially a sonoff basic in a decora wall switch.

## GPIO Map 
GPIO 0 - Button1 - Button 

GPIO 12 - Relay1 - Red LED and Relay

GPIO 13 - Led1 (not Led1i like the Sonoff Basic) Green LED 

**As of May 2019 there may be a modified version.  This is the pinout. **
* GPIO 0 - Button1 - Button 
* GPIO 14 - Relay1 - Relay
* GPIO 16 - Led1/Led1i - Red LED
* I couldn't find the green LED but it exists.


## Product Links
[Amazon Link of KULED Branded Switches](https://www.amazon.com/Required-Wireless-Requires-Schedule-Compatible/dp/B079FDTG7T)

## Unboxing
![](https://github.com/lvgeek/KS-602S/blob/master/images/IMG_0282.jpg)
![](https://github.com/lvgeek/KS-602S/blob/master/images/IMG_0285.jpg)
![](https://github.com/lvgeek/KS-602S/blob/master/images/IMG_0286.jpg)
![](https://github.com/lvgeek/KS-602S/blob/master/images/IMG_0287.jpg)

Some revisions of the switch have the header marked GND, RXD, TXD, 3V3. Some revisions do not.  It has been reported that some boxes have mixed revisions.  If you are ever in doubt, double check with a meter to determine your pins.  Flashing process and hardware revision without the labels can be seen on the following [video link](https://www.youtube.com/watch?v=4nX90vhAniQ).

RXD is connected to Transmit on your programmer
TXD is connected to Receive on your programmer
Ground and 3.3vdc to power unit during flash.

You do not need to solder a header to flash the board, an empty 4 pin header connected to 4 dupont jumper wires held into the empty header location works fine with a little pressure to ensure connectivity.

![](https://github.com/lvgeek/KS-602S/blob/master/images/IMG_0289.jpg)

Hold the button(GPIO0) and plug in programmer.

Device works perfectly as a Sonoff Basic but the LED will be backwards as designed.  The Red LED is hardwired to the relay and the green is controllable over GPIO pins.  If you wish to change the functionality to have the green LED when the device is off, you can utilize or change the template to a generic device type and map the suggested names except you will choose Led1 instead of Led1i. 

![](https://github.com/lvgeek/KS-602S/blob/master/images/IMG_0298.jpg)
