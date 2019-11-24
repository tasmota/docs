**Sonoff 4CH DIY**

* Itead Shop: https://www.itead.cc/psf-b85.html
* Itead Wiki: https://www.itead.cc/wiki/PSF-B85

The Sonoff 4CH DIY is based on the ESP8285.

<img alt="Sonoff 4CH DIY GPIO" src="https://raw.githubusercontent.com/Gtis69/arendst.github.io/master/media/Sonoff_DIY_4CH_GPIO.jpg" width="50%"/>

## Serial Connection

### Sonoff 4CH DIY

Please see the [Hardware Preparation](installation/Hardware-Preparation) page for general instructions.

As always, you need to access the serial interface. The **four serial pins** (3V3, Rx, Tx, GND) can be seen in the picture.

<img alt="Sonoff 4CH DIY serial" src="https://raw.githubusercontent.com/Gtis69/arendst.github.io/master/media/Sonoff_DIY_4CH_serial.JPG" width="50%"/>

Programming the Sonoff 4CH DIY is a breeze although the on-board-button is not connected to GPIO0. As with all ESP8266/ESP8285 modules pulling GPIO0 to GND is needed to put the chip in programming mode. You need to **connect GPIO0 and GND** during power up.

Luckily both GND and GPIO0 (as KEY 1) are available on the header. A simple jumper between GND and KEY 1 while programming will do.

<img alt="Sonoff 4CH DIY jumper" src="https://raw.githubusercontent.com/Gtis69/arendst.github.io/master/media/Sonoff_DIY_4CH_jump.JPG" width="50%"/>

## Module parameters

### Type

<img alt="Sonoff 4CH DIY parameters" src="https://raw.githubusercontent.com/Gtis69/arendst.github.io/master/media/Sonoff_DIY_4CH_parameters.jpg" width="30%" align="right" />

Module Type => Generic (18)

Restart the module.

### GPIO9 & GPIO10

<img alt="Sonoff 4CH DIY SetOption51" src="https://raw.githubusercontent.com/Gtis69/arendst.github.io/master/media/Sonoff_DIY_4CH_Option51.jpg" width="50%" />

To use GPIO9 and GPIO10 of the ESP8285, open the consol and enter => "SetOption51 on".

Restart the module.

### Assign inputs and outputs

* GPIO 1 => Button 1 (17)
* GPIO 9 => Button 2 (18)
* GPIO 10 => Button 3 (19)
* GPIO 14 => Button 4 (20)
* GPIO 12 => relay 1 (21)
* GPIO 5 => relay 2 (22)
* GPIO 4 => relay 3 (23)
* GPIO 15 => relay 4 (24)
* GPIO 13 => LED 1 (52)

