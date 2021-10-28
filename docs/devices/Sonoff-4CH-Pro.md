Compared to the 4CH the main differences/improvements of the 4CH Pro are:

  - Relays are isolated from mains and can each switch their own circuit (mains or low voltage).
  - With stock firmware special modes are supported (stand-alone schedules, inching, interlocking).
  - RF receiver (optional key fob or Sonoff RF Bridge 433 required).
  - Dual microcontroller, both a ESP8285 and a STM32.

## Serial Flashing

### Sonoff 4CH Pro 

The "FW/IO0" button (Switch 1) is not directly connected to GPIO0 of the ESP module. A different method has to be used to program this board.

To program the ESP chip disconnect power from the board, connect a cable from any Ground (GND) pin to the GPIO0 pin on the ESP (be careful not to touch any of the other pins). This is the second pin to the right on the top row of pins (see picture). While holding the pin connected power on the board. The board does not respond to any button pressed when in programming mode and LED 1, 2 and 3 are on (might differ per board). 

Use the ESP programming header as described in the picture to upload the firmware and follow regular programming procedure.

<img title="Sonoff 4CH Pro programming" src="https://github.com/arendst/arendst.github.io/blob/master/media/4chpro_gpio0.JPG?raw=true" width="100%" align="middle" />

### Sonoff 4CH Pro R2
On the R2 module the GPIO0 pin is broken out to [a small pad to the right of the ESP package](https://github.com/arendst/Tasmota/issues/2021#issuecomment-371227748):

<img title="R2 module - GPIO0 pad" src="https://user-images.githubusercontent.com/3594528/37109801-58fb97a4-223b-11e8-969c-1131dcfa6ee1.jpg" align="middle" />

If you have 4CH R2 v1.0 hardware, the GPIO0 is available as L1 switch - you don't need to solder additional cable to the PCB. Just push it during powering on for 3 seconds and release. 

### Sonoff 4CH Pro R3
R3 module has no any pad, so use the pin of R21 on the board to connect to the ground during powering for 3 seconds and release in order to put a chip in flashing mode
![image](https://user-images.githubusercontent.com/563412/109331013-fce71f00-7864-11eb-91cd-6f775cbc33a4.png)

If you like to use RF433 module is possible to direct connect SYN470R output to SDA (GPIO2), and then configure [RF Receiver](https://tasmota.github.io/docs/RF-Protocol/#receiving-rf-codes)
![image](https://user-images.githubusercontent.com/3578202/139196247-4f67058f-3f2f-4d8e-81e7-f08dfc9595bb.jpg)

## Solving Sonoff 4CH Pro programing issues

If you have problems to program the 4CH Pro, you might find below tips useful:
* Use the ESP program header and ensure that the right port is set in the Arduino IDE. 
* TX/RX are printed correctly on the pro version => TX goes to RX PIN and RX to TX.
* GPIO0 needs to be connected to ground the first 3 seconds during reboot (or longer)! If not you can not program it.
* On 4CH Pro R2 try switch S6 to 0 before connecting power to enter flash mode. Reset to 1 (default) after finished flashing.

1. If you use Windows7+, check in the device manager if the port is not added/removed all 2 seconds.
   - If yes then your USB port does not deliver enough ampere.
2. And/Or reduce upload speed to 57600 in Arduino IDE.
3. Use an active USB HUB if your computer delivers not enough ampere
   - External power source will stabilize the 4CH-pro and you can increase upload speed back to 115200.
   - Using a Laptop instead of a Desktop Tower might also do the trick as Laptops have a battery to deliver more ampere.
4. you can not flash it with tasmota-minimal.bin, you need to flash it with tasmota.bin ! Using esptool following commands might be usefull (you need to change com port) 
to clear: esptool.exe -cp COM6 -cb 115200 -ce -v
to program: esptool.exe -cp COM6 -bm dout -cf tasmota.bin -v

## 4CH Pro DIPSwitch Configuration

Most special modes of the 4CH Pro are controlled by DIP switch panels on the board.
Please refer to the back of the board or the Sonoff documentation for more details.
For normal operation with Tasmota the following settings are recommended:

- S6: 1
- K5: all 1
- K6: all 0

(0 and 1 are printed onto the board next to the switch names)

Changing these switches for operations like inching and interlocking are also supported with Tasmota.


## Official Sources

* [Itead Product Page](http://sonoff.itead.cc/en/products/sonoff/sonoff-4ch-pro)
* [Itead Shop](https://www.itead.cc/sonoff-4ch-pro.html)
* [Itead Wiki](https://www.itead.cc/wiki/Sonoff_4CH_Pro)


WARNING
The Sonoff CH4 PRO is subject to radio frequency disturbances with random activation of the buttons. 
To eliminate interference due to the U7 (SYN470RU7 RF-433  module) you can cut the wire between U7 and U8 (MCU STM32f030c6). This line starts from pin 10 of U7, the part towards MCU can be soldered to ground (surrounding area). It is also possible to set the RF module (U7) in shutdown-mode by unsoldering or cutting pin 11.

<img title="Disable RF433 interferece" src="https://github.com/forty76/ch4_pro/blob/main/Disabilitare%20RF%20ch4_pro.jpg" align="middle" />

