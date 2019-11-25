## WS2812B RGB Shield (single pin)
<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_ws2812b_shield.jpg?raw=true" align="right" width=320>

From the [Wemos ws2812b shield specs](https://cleanuri.com/a8jX2Q) the DATA  pin is connected to D2 of the Wemos.

#### Tasmota Settings
In the Configuration -> Configure Module page, select the following:
* **D2 GPIO4** : **07 WS2812**

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_ws2812b_config_marked.jpg?raw=true"/>

### Tasmota Main
After reboot of the device the dark-bright slider and toggle button are displayed to control the led.

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_ws2812b_main_marked.jpg?raw=true"/>