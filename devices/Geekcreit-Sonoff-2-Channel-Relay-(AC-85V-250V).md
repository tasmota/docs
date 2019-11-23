**Geekcreit "Sonoff" 2 Channel Relay**

* Bare PCB version: https://www.aliexpress.com/item/Sonoff-2CH-AC85-250V-Wireless-Switch-Timer-Smart-Wifi-Switch-Universal-Automation-Module-Remote-Control-for/32948157608.html
* Version with enclosure: https://www.banggood.com/Geekcreit-2-Channel-AC-85V-250V-APP-Remote-Control-WIFI-Wireless-Switch-Socket-For-Smart-Home-p-1114958.html?rmmds=search&cur_warehouse=CN

The Geekcreit/"Sonoff" 2CH is based on the ESP8285 via the Itead PSF-B04.
It is very similar to 4CH DIY, so this wiki page is based on [the page](devices/Sonoff-4CH-DIY) for that device.

More info here:
https://github.com/arendst/Tasmota/issues/1970

![Geekcreit/"Sonoff" 2CH](https://user-images.githubusercontent.com/5823294/52651590-5b423e80-2ee4-11e9-91d2-9cc4e8535c7d.png)

## Serial Connection

### Geekcreit/"Sonoff" 2CH

Please see the [Hardware Preparation](installation/Hardware-Preparation) page for general instructions.

As always, you need to access the serial interface. The **four serial pins** (3V3, Rx, Tx, GND) can be seen in the picture.
Unless you have a very steady hand soldering will be required for the TX and RX on the ESP chip.

Programming the Geekcreit/"Sonoff" 2CH is easy.
The bottom left on-board-button is connected to GPIO0 and as with all ESP8266/ESP8285 modules pulling GPIO0 to GND is needed to put the chip in programming mode. You need to hold this button when booting the device for flashing.

## Module parameters

### Enable GPIO9 & GPIO10

![Geekcreit/"Sonoff" 2CH SetOption51](https://github.com/Gtis69/arendst.github.io/blob/master/media/Sonoff_DIY_4CH_Option51.jpg)

To use GPIO9 and GPIO10 of the ESP8285, open the console and enter => "SetOption51 on".

Restart the module.

### Assign inputs and outputs

**Note: ** The third button on this device is not connected to a GPIO. Instead it is used to cycle through some relay modes that are supported by the two external ICs. Only one of these modes works with Tasmota, so it is necessary to continue to press this button 3 until the relays can be controlled from the toggle buttons in the Tasmota web UI.

![Geekcreit/"Sonoff" 2CH parameters](https://user-images.githubusercontent.com/5823294/52594844-6a71af80-2e44-11e9-86fc-3d5fe045b6c9.png)

Module Type => Generic (18)

* GPIO 1 => Button 1 (17)
* GPIO 9 => Button 2 (18)
* GPIO 10 => Button 3 (19)
* GPIO 14 => Button 4 (20)
* GPIO 12 => relay 1 (21)
* GPIO 5 => relay 2 (22)
* GPIO 13 => LED 1 (52)

Restart the module.