# Luminea ZX-2844-* 

also known as:
* XS-RGBW-LedControl-V2.0.2
* JCD XS-RGBW

![](https://i.ibb.co/8xkFHMp/IMG-1424.jpg)

sold by PEARL and amazon (i know know if they are available outside D-A-CH)
* <https://www.pearl.de/a-ZX2844-3103.shtml>
* <https://www.amazon.de/Luminea-Zubeh%C3%B6r-Smarthome-LED-Strips-WLAN-Controller-spritzwassergesch%C3%BCtzt/dp/B074T11793>

## Hardware

There is an [ESP8266EX](https://www.espressif.com/sites/default/files/documentation/0a-esp8266ex_datasheet_en.pdf) sitting on the backside. 4 PWM outputs are connected to drive the 4 output channels (RGB + W).
Red is on GPIO14
Green is on GPIO12
Blue is on GPIO5
White is on GPIO13

The pushbutton is GPIO13.  Assign it to Button1 for local on/off control.

You can configure it as a "generic module"

And set the GPIO as follow:

| Function | ESP Pin | Channel |
| -------- | ----------- | ------- |
| R | GPIO 14 | PWM1 |
| G | GPIO 12 | PWM2 |
| B | GPIO 5 | PWM3 |
| W | GPIO 0 | PWM4 |
| PushButton |GPIO 13 | Button1 |

There is a second version with a green PCB and different pinout:

| Function | ESP Pin | Channel |
| -------- | ----------- | ------- |
| R | GPIO 4 | PWM1 |
| G | GPIO 12 | PWM2 |
| B | GPIO 14 | PWM3 |
| W | GPIO 5 | PWM4 |
| PushButton |GPIO 0 | Button1 |

## Serial Connection

See the [Hardware Preparation](../Getting-Started#hardware-preparation) page for general instructions.

![](https://i.ibb.co/NtDnSQ4/JCDXSRGBW.jpg)

The serial header (3.3V, RXD, TXD, GND) as well as GPIO0, GPIO2 and RESET (IO0, IO2, RST) are populated as test pads on the frontside of the PCB. You can easily add some solder to fix the wires during the flash process.

To place the board into flashing mode, you will need to short IO0 to GND. This can remain shorted while flashing is in progress, but you will need to remove the short in order to boot the Tasmota firmware.

