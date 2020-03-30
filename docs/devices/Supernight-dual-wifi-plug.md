https://smile.amazon.com/gp/product/B07K1QSFFJ/ref=ppx_yo_dt_b_asin_title_o01__o00_s00?ie=UTF8&psc=1

Received these in a 2 pack.  flashing with OTA was no issue.

I quickly figured out most of the IO.

* GPIO1 = Left Socket Button
* GPIO3 = Left Socket Relay
* GPIO12 = Right Socket Relay
* GPIO14 = Red LED for both buttons

The "night light" seems to be tied to the light sensor only and cannot be turned off.  This makes the plug a no-go for me.

Also, I could not figure out the right socket button.  I ended up destroying one of the two plugs to see what was inside.

There are 2 circuit boards.  One with the Wifi and esp module and another with the buttons and the night lights.  On the button board, the trace for the right button is purposely notched for that button so that it doesn't connect to the header leading to the second circuit board with the esp chip.  I'm really wishing I verified that button before flashing as I don't intend to buy more to test it.

***

Found this on the [issues tracker](https://github.com/arendst/Tasmota/issues/5185#issuecomment-462120415)

Just a quick update. I've still not figured out the second button, but I do have energy monitoring working now.

My current pinout is...
* GPIO1 = Left Socket Button
* GPIO3 = Left Socket Relay
* GPIO4 = HLW8012/Voltage (HLWBL CF1)
* GPIO5 = HLW8012 CF Power (HLW8012 CF)
* GPIO12 = Right Socket Relay
* GPIO13 = HLW8012 Output (HLWBL SEL)
* GPIO14 = Red LED for both buttons

Pins 6,7,8 and 11 cause hard resets when I try to set them to switches or buttons.

***

If you have tasmota >= 6.4.1.14 then here is a template based on the above.

{"NAME":"SuperNight Dua","GPIO":[255,17,255,21,132,133,255,255,22,130,58,255,255],"FLAG":1,"BASE":18}