* Itead Product Page: http://sonoff.itead.cc/en/products/residential/sonoff-s26-smart-plug
* Itead Shop: https://www.itead.cc/sonoff-s26-wifi-smart-plug.html

## Serial Connection

Please see the [Hardware Preparation](../Getting-Started#hardware-preparation) page for general instructions.

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

## No Solder Connection
With the help of some adhesive tape it is possible to acheive a flash without soldering.

Hook your connecting wires / pins into the locations shown on the T1117A regulator - there is enough space under the SOT-223 package pins for a connection to be made. 
Use some adhesive tape to hold these pins in place; it only needs to remain there for a few minutes. (Vout = 3v3, Pin 1 = GND)

![](https://i.imgur.com/O8U6qhf.jpg)

Flip the board on its side to expose the TX and RX pins. Follow steps 1-4 below, ignoring the TX/RX connection. Once in flash mode, hold the TX/RX pin connection in place with one hand and start the flash with the other! It looks messy with the tape in the below photo but means no soldering required.

![](https://i.imgur.com/6FClKoW.jpg)

## S26 Release 2
If you happen to have an S26R2 (sold since the end of 2021?), which is recognizable by the S26R2 label on the back of the case, you may choose to solder or not:

<img src="https://user-images.githubusercontent.com/47012122/148542001-460195d0-3bda-475a-984d-060c7449e302.jpeg" width=30%>

Board release v2.6 has a slightly different layout, and connecting to it may be even easier.
In the above picture, serial flasher GND is connected to the capacitor, but you may use the GND pad on the board.


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
