The [sonoff TX Series](https://www.itead.cc/sonoff-tx-series-wifi-smart-wall-switches.html) comes with 4 versions T0, T1, T2, T3

The boards are the same for all the series with only a difference in the T0 which has no RF chip

# Flashing

The flashing steps are the same than for the [older T1 switch](devices/Sonoff-T1) but holding switch 1 does not put the board into flashing mode and there is no reset button on the board

So to put a T1 Touch v1.0 board into flash mode you need to ground GPIO 0 which is exposed on the back of the board and plug the board to USB

Here is an image of the wiring

![](https://user-images.githubusercontent.com/6115458/62552030-462fe200-b86d-11e9-9ee9-30998fed2a9d.jpg)

Legend:
* Yellow => 3.3v
* Purple => GND
* Green => TX FTDI to RX sonoff
* Blue => RX FTDI to TX sonoff


If the manipulation is done correctly the Wifi led will not blink when the device is powered, this means you are in flash mode and you can follow the other guide
