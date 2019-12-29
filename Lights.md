?> 💡 You know what lights do.... Right?

Lights come in various shapes (bulb, strips, ceiling lights, ...) but in Tasmota they are separated in 3 categories:
 - Channel Controlled LEDs
 - Addressable LEDs
 - Status LEDs 


## Lights in WebUI

<img style="float:right;" width="180" alt="Tasmota_on-off" src="https://tasmota.github.io/docs/_media/light_UI_5channel.png">

Tasmotas webUI displays **Brightness**, **CT**, **White**, **Color Picker**, **Color Saturation** or **PWM** level sliders depending on the light component, the number of PWM channels configured and SetOptions used. 

RGBCCT or 5 channel LED light strip presented in web UI:

<div clear="right"/>

### Light controls

<img style="float:right;" width="180" alt="HSV" src="https://user-images.githubusercontent.com/49731213/71559882-a2d1aa80-2a63-11ea-8bb9-6d4b98144809.jpg">

Tasmota uses a HSB color model, which besides other more subtile differences compared to HSL means, that the color must be desaturated to reach complete black or white.

<br clear="right"/>

|Control|Range|Commands and details|
|---|---|---|
|**Brightness**|0..100 (percent)|`Dimmer`, `HSBColor3`: Brightness of the light|
|**Hue**|0..359 (degrees)|`HSBColor1`: Color as an angle in the color wheel<BR><img width="240" alt="Hue" src="https://user-images.githubusercontent.com/49731213/71559624-ae6fa200-2a60-11ea-938a-024376dc00d2.png">|
|**Sat**|0..100 (percent)|`HSBColor2`: saturation of the color, 0=grey/white, 100=pure color|
|**CT**|153..500 (mireds)|`CT`: white color temperature, from 153 (Cold White) to 500(Warm White)<BR><img width="240" alt="Mireds" src="https://user-images.githubusercontent.com/49731213/71559840-0909fd80-2a63-11ea-8e15-efb8cce3575b.jpg">|

See [**light commands**](Commands#light) for how to control lights.

## Detailed configuration and options for all types of lights

### * On/Off lights, aka Relays

<img style="float:right;" width="180" alt="Tasmota_on-off" src="https://user-images.githubusercontent.com/49731213/71555057-8d3e8f80-2a27-11ea-8fc5-4ecaed755bd5.png">

On/Off lights are controlled through `Relay` GPIOs.

<br clear="right"/>

|Configuration|(see below)|
|---|---|
|Commands|`Power`|
|Configuration|none|

### * 1 channel

<img style="float:right;z-index:300;" width="180" alt="Tasmota_1" src="https://user-images.githubusercontent.com/49731213/71555196-9e889b80-2a29-11ea-9f96-fc47ad65ef43.png">

1 channel lights are often white lights with On/Off control and Dimmer.

<br clear="right"/>

|Configuration|(see below)|
|---|---|
|Commands|`Power`, `Dimmer`|
|Configuration|**PWM configuration**, **Gamma Correction**, **Independant Channels**|

### * 2 channels

<img style="float:right;z-index:300;" width="180" alt="Tasmota_2" src="https://user-images.githubusercontent.com/49731213/71555483-3471f580-2a2d-11ea-8eff-8a76e3555ef5.png">

2 channels lights are white lights with color temperature from Cold White (CT=153) to Warm White (CT=500).

<br clear="right"/>

|Configuration|(see below)|
|---|---|
|Commands|`Power`, `Dimmer`, `Color`, `White`, `CT`|
|Configuration|**PWM configuration**, **Gamma Correction**, **PWM CT**|

### * 3 channels

<img style="float:right;z-index:300;" width="180" alt="Tasmota_3" src="https://user-images.githubusercontent.com/49731213/71555478-11474600-2a2d-11ea-88e5-94a8eac3560a.png">

3 channels lights are color RGB lights. You can set color either via RGB or HSB (not HSL). Alexa support also allows XY color, but they are not supported through commands.

<br clear="right"/>

|Configuration|(see below)|
|---|---|
|Commands|`Power`, `Dimmer`, `Color`, `HSBColor`|
|Configuration|**PWM configuration**, **Gamma Correction**, **Channel remapping**|

### * 4 channels

<img style="float:right;" width="180" alt="Tasmota_4" src="https://user-images.githubusercontent.com/49731213/71555488-48b5f280-2a2d-11ea-8173-1fd45cd5a1e3.png"><img style="float:right;" width="180" alt="Tasmota_4_2" src="https://user-images.githubusercontent.com/49731213/71555832-65075e80-2a30-11ea-9ab6-66688081ef48.png">

4 channels lights are RGBW, i.e. RGB light and an additional White light. White can be either Warm White or Cold White depending on the manufacturer.

**Warning**: some lights have limited power supply that do not allow all channels to be at full power at the same time. So be careful if you force all channels via `Color` or **RGB/White split**
<br clear="right"/>

|Configuration|(see below)|
|---|---|
|Commands|`Power`, `Dimmer`, `Color`, `HSBColor`, `White`|
|Configuration|**PWM configuration**, **Gamma Correction**, **Channel remapping**, **White blend mode**, **RGB/White split**|

### * 5 channels

<img style="float:right;" width="180" alt="Tasmota_5" src="https://user-images.githubusercontent.com/49731213/71555498-57040e80-2a2d-11ea-867c-a37d591930d2.png"><img style="float:right;" width="180" alt="Tasmota_5_2" src="https://user-images.githubusercontent.com/49731213/71555844-8405f080-2a30-11ea-98c9-ea247cbedbc7.png">

5 channels lights are RGBCW, i.e. RGB light and an additional Cold/Warm White light.

**Warning**: some lights have limited power supply that do not allow all channels to be at full power at the same time. So be careful if you force all channels via `Color` or **RGB/White split**
<br clear="right"/>

|Configuration|(see below)|
|---|---|
|Commands|`Power`, `Dimmer`, `Color`, `HSBColor`, `White`, `CT`|
|Configuration|**PWM configuration**, **Gamma Correction**, **Channel remapping**, **White blend mode**, **RGB/White split**|

### * Multiple independent channels

<img style="float:right;" width="180" alt="Tasmota_multi" src="https://user-images.githubusercontent.com/49731213/71555865-bdd6f700-2a30-11ea-8bdb-9dda72139a9a.png">

Any combination of Relays and PWMs, when enabling `SetOption68 1`.

<br clear="right"/>

|Configuration|(see below)|
|---|---|
|Commands|`Power`, `Channel`, `Color`|
|Configuration|**PWM configuration**, **Gamma Correction**|


## Channel Controlled LEDs
Lights controlled using up to 5 channels (red, green, blue, cold white, warm white). Channels are controlled using PWM or APDM.

### PWM
PWM (Pulse Width Modulation) is the most common method of controlling LED lights. 

These lights are configured by assigning `PWM1(i)` through `PWM5(i)` components to their GPIOs. Depending on the number of used PWMs Tasmota will recognize the light as

|Channels|PWM1|PWM2|PWM3|PWM4|PWM5|
|---|---|---|---|---|---|
|1|Brightness|||||
|2|Cold White|Warm White||||
|3|Red|Green|Blue|||
|4|Red|Green|Blue|White||
|5|Red|Green|Blue|Cold White|Warm White|

If you require individual channel control (f.e. when connecting multiple single channel light strips to a multichannel LED controller) use [`SetOption68 1`](Commands#setoption68) to control each PWM individually with sliders in webUI and  [`Channel<x>`](Commands#channel) commands.

For better color mixing of RGB and white channels read about [White Blend Mode](White-Blend-Mode).

> [!TIP] In a 4 channel RGB+W light there is no separate white slider control. To gain control over the white channel use `RGBWWTable 255,255,255,255,0` which activates White Blend Mode.

### MY92xx
MY92xx [family](http://www.my-semi.com/content/products/product_list.aspx?id=2) of drivers uses Adaptive Pulse Density Modulation. 

Configured in Tasmota by assigning `MY92x1 DI` and `MY92x DCKI` components to their GPIOs (some devices might have more than one  MY92xx controller)

Channel mapping for such devices is dependent on the controllers but is easily [remapped](SetOption37) using [`SetOption37`](Commands#setoption37).

### SM16716
SM16716 LEDs, sometimes mislabelled as WS2801.

Configured in Tasmota by assigning `SM16716 CLK`, `SM16716 DAT` and `SM16716 PWR` component to their GPIOs. 

Some SM16716 bulbs have BGR order and need [`SetOption37 54`](Commands#setoption57) to work properly.

## Addressable LEDs
Lights where each LED is individually controlled. In these lights it is possible to adjust each LEDs power, color and brightness, all just with the use of a single GPIO pin.

WebUI shows only the brightness slider and power toggle for these lights, all other controls are available with [commands](Commands#light).

### WS2812
Any light using WS2811, WS2812b, WS2813 or SK6812 LEDs falls into this component. They're also commonly called Neopixel lights.

Configured in Tasmota by assigning `WS2812 (7)` component to its GPIO. 

For wiring, see instructions for [LED strip](/peripherals/WS2812B-and-WS2813) or [Wemos RGB shield](/peripherals/WS2812B-RGB-Shield).

## Status LEDs
Special subset of lights used to convey device status such as Wi-Fi and power. [Read more...](Status-LED)
