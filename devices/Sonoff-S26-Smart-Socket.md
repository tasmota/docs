* Itead Product Page: http://sonoff.itead.cc/en/products/residential/sonoff-s26-smart-plug
* Itead Shop: https://www.itead.cc/sonoff-s26-wifi-smart-plug.html

## Serial Connection

Please see the [Hardware Preparation](installation/Hardware-Preparation) page for general instructions.

## LED State

The S26 has a red LED connected to GPIO12 along with the relay so it's not possible to disable the power button LED entirely. Setting `LedState 0` disables the blue LED when the relay is turned on and reserves it for Wi-Fi/MQTT state only.

## Soldering guide
Apply rosin to shaved wires. Solder tin to the flats on the module.(First put solder tip to flat and apply tin). Gently solder the wires.

![](http://hosting.pilsfree.cz/chudy/s26/1.jpg)
![](http://hosting.pilsfree.cz/chudy/s26/2.jpg)
![](http://hosting.pilsfree.cz/chudy/s26/3.jpg)
![](http://hosting.pilsfree.cz/chudy/s26/4.jpg)

Alternative solder points available for 3V3, GND and RX on the underside of the mainboard.

| Jumper | Pin     |
| ------ | ------- |
| J1     | 3V3     |
| J2     | GND     |
| J3     | GPIO-12 |
| J4     | GPIO-0  |
| J5     | GPIO-13 |
| J10    | RX      |

![](https://user-images.githubusercontent.com/1029851/45257726-a2ab2880-b3a2-11e8-9cb8-5cc1d49225b2.png)

## Bringing the Module into Flash Mode

1. Disconnect serial programmer and power
2. Press and hold the on-board button - Note: The Button on the main board is not very sensitive and must be pressed firmly.
3. Connect the serial programmer (VCC, RX, TX, GND)
4. Release the on-board button

The blue LED should NOT be blinking when in Flash mode.

## Storage/Memory

Running Tasmota 6.1.1 the unit reports:

|    Flash Size      | 1024kB |
|--------------------|--------|
| Program Flash Size | 1024kB |
| Program Size       | 536kB  |
| Free Program Space | 464kB  |
| Free Memory        |  16kB  |

## More information

See issue [#2808](https://github.com/arendst/Tasmota/issues/2808) for user information