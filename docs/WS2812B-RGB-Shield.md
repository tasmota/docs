## WS2812B RGB Shield (single pin)
<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_ws2812b_shield.jpg?raw=true" align="right" width=320>

From the [Wemos ws2812b shield specs](https://cleanuri.com/a8jX2Q) the DATA  pin is connected to D2 of the Wemos.

## Tasmota Settings

In *Configuration -> Configure Module* page assign:

- D2 GPIO4 to `WS2812`

After a reboot of the device the toggle button and light controls are displayed in the webUI.
