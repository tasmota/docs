# Be Aware
There are different versions of this power strip. An MSS425EEU-R purchased in August 2019 was based on the Mediatek Wi-Fi chip and **not on an ESP82xx!** Tasmota is only suitable for ESP82xx based devices.  

# meross Power Strip
This power strip was selling on [Amazon](https://www.amazon.com/meross-Protector-Compatible-Assistant-Individually/dp/B07DXSJP8H/ref=sr_1_21?ie=UTF8&qid=1539543509&sr=8-21&keywords=wifi+smart+power+strip) for about $17 when I bought it. The ESP module is mounted on the side vertically on board. It's another Tuya TYWE3S, 1MB. For more information on the Tuya TYWE3S, see [this page](devices/TYWE3S). I soldered pins on and bent them down to get everything back in the case.

![meross guts picture](https://raw.githubusercontent.com/hank/tasmota-contrib/master/2018-10-27-163303.jpg)

To open, 4 screws are under the soft foot pads. They take a size 2.0 triangle bit; make sure you have a large collection of small screwdriver bits around.

The programming header is directly on the Tuya module and is silkscreened with the labels for the pins. Solder onto those and program just like any other Tuya. There's unfortunately no button to get into firmware mode that I could find, so you have to ground the pin yourself. If you're using an external power source for the board and another power source for your TXD/RXD, make sure to tie the grounds together or else it won't talk. I burned on the generic tasmota release and set it up like so:

![tasmota config](https://raw.githubusercontent.com/hank/tasmota-contrib/master/Screenshot%20from%202018-10-27%2019-05-32.png)

Relays 1-3 are the AC plugs
Relays 4,5 are the USBs
The button only turns off the first AC by default, but you could write rules to do whatever you want.

