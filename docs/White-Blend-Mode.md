White Blend Mode is used for 4 channel (RGBW) and 5 channel (RGBWC) devices. It is enabled by setting the last PWM channel to zero (e.g., [`RGBWWTable 255,255,255,<n>,0`](Commands#rgbwwtable)) to lower the white channel intensity.

Generally, white LEDs are brighter than RGB LEDs. If you want to keep the same brightness, you need to calibrate the white level. In this mode, any white component will be removed from RGB LEDs and sent to the white LEDs. This makes whites look much better.

Example: `Color 30508000` will be converted to `Color 0020503000` (0x30 is subtracted from R,G,B channels and added to the White channel)

To calibrate:

1. `Color FFFFFF00`
2. `RGBWWTable 255,255,255,255,255` - reset to RGB mode
3. `RGBWWTable 255,255,255,<n>,0` (begin the calibration process with `<n>` == 150)
4. If too bright, decrease `<n>`. If too dim, increase `<n>`
5. Go back to step 2 and iterate until satisfied with the color intensities.

Examples:
* Sonoff B1: `RGBWWTable 255,255,255,35,0`
* Teckin SB50: `RGBWWTable 255,255,255,80,0`