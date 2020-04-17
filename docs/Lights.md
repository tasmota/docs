!!! info "You know what lights do.... Right? 💡"

## Control Lights

### with WebUI

<img style="float:right;height:120px" alt="Tasmota_on-off" src="../_media/light_UI_5channel.png">

Tasmota webUI displays **Brightness**, **CT**, **White**, **Color Picker**, **Color Saturation** or **PWM Level**  sliders depending on the light component, the number of PWM channels configured and SetOptions used. 

<br clear="right">

<img style="float:right;;height:100px; padding:5px" alt="HSV" src="https://user-images.githubusercontent.com/49731213/71559882-a2d1aa80-2a63-11ea-8bb9-6d4b98144809.jpg">

Tasmota uses a HSB color model, which besides other more subtile differences compared to HSL means, that the color must be desaturated to reach complete black or white.

|Control|Range|Commands and details|
|---|---|---|
|**Brightness**|0..100 (percent)|`Dimmer`, `HSBColor3`: Brightness of the light|
|**Hue**|0..359 (degrees)|`HSBColor1`: Color as an angle in the color wheel<BR><img width="240" alt="Hue" src="https://user-images.githubusercontent.com/49731213/71559624-ae6fa200-2a60-11ea-938a-024376dc00d2.png">|
|**Sat**|0..100 (percent)|`HSBColor2`: saturation of the color, 0=grey/white, 100=pure color|
|**CT**|153..500 (mireds)|`CT`: white color temperature, from 153 (Cold White) to 500(Warm White)<BR><img width="240" alt="Mireds" src="https://user-images.githubusercontent.com/49731213/71559840-0909fd80-2a63-11ea-8e15-efb8cce3575b.jpg">|

### with Commands

See [**light commands**](Commands.md#light) for how to control lights.

## Light Types

### Switched Lights aka Relays

<img style="float:right; padding:5px" width="180" alt="Tasmota_on-off" src="https://user-images.githubusercontent.com/49731213/71555057-8d3e8f80-2a27-11ea-8fc5-4ecaed755bd5.png">

Switched or On/Off lights are controlled through `Relay` GPIOs.

If you define multiple relays, they are controlled with `Power<x>` starting at `x=1`.

**Alexa**: you can use Wemo emulation, your device will appear as a switch. You can change it to a light in the Alexa app.

**Alexa**: if you have one or multiple relays, you can use Philips Hue emulation. All devices will appear as On/Off lights, and named accordingly to `FriendlyName`. Note: if you have only Echo Spot 2nd generation, your light will have a dummy dimmer.

<br clear="right"/>

|Configuration|(see below)|
|---|---|
|Commands|`Power`|
|Configuration|none|

### 1 Channel - Dimmable Light

<img style="float:right; width:180px" alt="Tasmota_1" src="https://user-images.githubusercontent.com/49731213/71555196-9e889b80-2a29-11ea-9f96-fc47ad65ef43.png">

1 channel lights are often white lights with On/Off controls and Dimmer.

**Alexa**: you can use Philips Hue emulation, the light will appear as White light with Dimmer.

|Configuration|(see below)|
|---|---|
|Commands|`Power`, `Dimmer`|
|Options|[**Auto Power On**](#disable-auto-power-on), [**PWM Channel Configuration**](#pwm-channel-configuration), [**Gamma Correction**](#gamma-correction)|

<br clear="right"/>

### 2 Channels - CCT Light

<img style="float:right;width:180px" alt="CCT" src="https://user-images.githubusercontent.com/49731213/71555483-3471f580-2a2d-11ea-8eff-8a76e3555ef5.png">

2 channels lights are white lights with correlated color temperature (CCT) controls from Cold White (CT=153) to Warm White (CT=500).

**Alexa**: you can use Philips Hue emulation, the light will appear as White light with Color Temperature. Control through the Alexa app is limited to the `CT` range `199..383`.

|Configuration|(see below)|
|---|---|
|Commands|`Power`, `Dimmer`, `Color`, `White`, `CT`|
|Options|[**Auto Power On**](#disable-auto-power-on), [**PWM Channel Configuration**](#pwm-channel-configuration), [**Gamma Correction**](#gamma-correction), [**PWM CT**](#pwm-ct-module-48)|

<br clear="right"/>

### 3 Channels - RGB Lights

<img style="float:right; width:180px" alt="RGB" src="https://user-images.githubusercontent.com/49731213/71555478-11474600-2a2d-11ea-88e5-94a8eac3560a.png">

3 channel lights are RGB color lights. You can set color either via RGB or HSB (_not HSL_). Alexa support also allows XY color, but that is not supported through commands.

**Alexa**: you can use Philips Hue emulation, the light will appear as Color light.

|Configuration|(see below)|
|---|---|
|Commands|`Power`, `Dimmer`, `Color`, `HSBColor`|
|Options|[**Auto Power On**](#disable-auto-power-on), [**PWM Channel Configuration**](#pwm-channel-configuration), [**Gamma Correction**](#gamma-correction), [**Channel Remapping**](#channel-remapping)|

<br clear="right"/>

### 4 Channels - RGBW Lights

<img style="float:right; width:180px; padding:5px" alt="RGBW-2" src="https://user-images.githubusercontent.com/49731213/71555832-65075e80-2a30-11ea-9ab6-66688081ef48.png"><img style="float:right; width:180px; padding:5px" alt="RGBW using RGB and White Split" src="https://user-images.githubusercontent.com/49731213/71555488-48b5f280-2a2d-11ea-8173-1fd45cd5a1e3.png">

4 channel lights are RGBW, i.e. RGB light and an additional White light. White can be either Warm White or Cold White depending on the manufacturer.

**Alexa**: you can use Philips Hue emulation, the light will appear as Color light and White light with CT control. The CT control is only present to force pure white instead of RGB white. Changin CT will have no effect.

|Configuration|(see below)|
|---|---|
|Commands|`Power`, `Dimmer`, `Color`, `HSBColor`, `White`|
|Options|[**Auto Power On**](#disable-auto-power-on), [**PWM Channel Configuration**](#pwm-channel-configuration), [**Gamma Correction**](#gamma-correction), [**Channel Remapping**](#channel-remapping), [**White Blend Mode**](#white-blend-mode), [**RGB and White Split**](#rgb-and-white-split)|

<br clear="right"/>

!!! failure "There is no White only slider in the UI for 4 channel lights"
    Use [`White`](Commands.md#white) commands or set up [White Blend Mode](#white-blend-mode).

!!! danger 
    Some lights have limited power supply that do not allow all channels to be at full power at the same time. Be careful not to burn out your light if you force all channels via `Color` or [**RGB and White Split**](#rgb-and-white-split).

### 5 Channels - RGBCCT Lights

<img style="float:right; padding:5px" width="180" alt="Tasmota_5_2" src="https://user-images.githubusercontent.com/49731213/71555844-8405f080-2a30-11ea-98c9-ea247cbedbc7.png"><img style="float:right; padding:5px" width="180" alt="RGBCCT using RGB and White Split" src="https://user-images.githubusercontent.com/49731213/71555498-57040e80-2a2d-11ea-867c-a37d591930d2.png">

5 channel lights are RGBCCT - a 3 channel RGB light and an additional 2 channel CCT light.

**Alexa**: you can use Philips Hue emulation, the light will appear as Color light and White light with CT control.

|Configuration|(see below)|
|---|---|
|Commands|`Power`, `Dimmer`, `Color`, `HSBColor`, `White`, `CT`|
|Options|[**Auto Power On**](#disable-auto-power-on), [**PWM Channel Configuration**](#pwm-channel-configuration), [**Gamma Correction**](#gamma-correction), [**Channel Remapping**](#channel-remapping), [**White Blend Mode**](#white-blend-mode), [**RGB and White Split**](#rgb-and-white-split)|

<br clear="right"/>

!!! danger
    Some lights have limited power supply that do not allow all channels to be at full power at the same time. Be careful not to burn out your light if you force all channels via `Color` or [**RGB and White Split**](#rgb-and-white-split)

### Independent PWM Channels 

<img style="float:right;width:180px" alt="Tasmota_multi" src="https://user-images.githubusercontent.com/49731213/71555865-bdd6f700-2a30-11ea-8bdb-9dda72139a9a.png">

Any combination of Relays and PWMs, when enabling `SetOption68 1`. Splits off the light into individually controlled Channels (Useful when connecting multiple 1 channel strips to a single controller)

|Configuration|(see below)|
|---|---|
|Commands|`Power`, `Channel`, `Color`|
|Options|[**Auto Power On**](#disable-auto-power-on), [**PWM Channel Configuration**](#pwm-channel-configuration), [**Gamma Correction**](#gamma-correction)|

<br clear="right"/>

## Light Options

### Gamma Correction 

Gamma Correction is enabled by default in Tasmota ([`LedTable 1`](Commands.md#ledtable)).

<img style="float:right; width:200px" src="https://user-images.githubusercontent.com/49731213/71531106-798f0e00-28ed-11ea-8916-9ce2e9b98e27.png">

Human eye perception of brightness is non linear, bringing back linearity needs a trick called **[Gamma Correction](https://learn.adafruit.com/led-tricks-gamma-correction)**.

Some lights have hardware gamma correction (f.e. Sonoff B1)., in which case software gamma correction should be disabled with `LedTable 0`.

The curve used: orange=ideal, blue=tasmota.

!!! question "How do I know if I have hardware gamma correction?"
    If you find your light very dark even with `Dimmer 40`, it can mean either you have hardware PWM, disable it with `LedTable 0`, or you need to apply a minimum PWM value, use `DimmerRange 40,100` (adapt to the best value).

!!! quote ""
    Internally Tasmota uses 10 bits resolution PWM to get smoother levels at low brightness. 

### White Blend Mode

White Blend Mode mixes in the white channel with RGB colors while controlling the RGB light which results in a better and brighter color output. It is used only with 4 channel (RGBW) and 5 channel (RGBCCT) lights. 
Enable it by setting the last PWM channel to zero using [`RGBWWTable 255,255,255,255,0`](Commands.md#rgbwwtable).

#### Calibration (optional)
Generally white LEDs are brighter than RGB LEDs. If you want to keep the same brightness, you need to calibrate the white level. In this mode, any white component will be removed from RGB LEDs and sent to the white LEDs. This makes whites look much better.

!!! example 
    `Color 30508000` will be converted to `Color 0020503000` (0x30 is subtracted from RGB channels and added to the White channel)

To calibrate a RGBW light:

1. `Color FFFFFF00`
2. `RGBWWTable 255,255,255,255,255` - reset to RGB mode
3. `RGBWWTable 255,255,255,<n>,0` - (begin the calibration process with `<n>` == 150)
4. If too bright, decrease `<n>`. If too dim, increase `<n>`
5. Go back to step 2 and iterate until satisfied with the color intensities.

!!! example "Calibration examples for specific devices:"
    Sonoff B1: `RGBWWTable 255,255,255,35,0`
    Teckin SB50: `RGBWWTable 255,255,255,80,0`

### RGB and White Split 

[`SetOption37 128`](Commands.md#setoption37)

By default RGBW and RGBCCT lights can only be controlled in single mode, either RGB or White (f.e. Turning on CT lights turns off RGB lights and vice versa).

Use `SetOption37 128` to split RGB and White into 2 independent lights. If you are already using Channel Remapping, just add `128` to the value of `SetOption37`.

### Channel Remapping 

[`SetOption37`](Commands.md#setoption37)

[Read More](SetOption37.md)

### Disable Auto Power On 

Lights are always powered on when a light command or a webUI slider is used and automatically powered off when color is set to black or `Dimmer` is set to `0`.

When enabling [`SetOption20 1`](Commands.md#setoption20) any change to webUI sliders or using commands `CT`, `Dimmer`, `HSBColor3`, `Color` or `Channel` will not automatically power on the light if it is off.

### PWM CT 

`Module 48`

Some CCT lights use PWM1 for brightness and PWM2 for color temperature (instead of PWM1 for Cold White and PWM2 for Warm White).

For these lights, use `Module 48` aka Philips Xiaomi mode.

## Light Categories

Lights come in various shapes (bulb, strips, ceiling lights, ...) but in Tasmota they are separated in 3 categories:

 - [Channel Controlled LEDs](#channel-controlled-leds)
 - [Addressable LEDs](#addressable-leds)
 - [Status LEDs](#status-leds) 

### Channel Controlled Lights

#### PWM Lights

Lights controlled using up to 5 channels (red, green, blue, cold white, warm white). Channels are controlled using PWM or APDM.

PWM (Pulse Width Modulation) is the most common method of controlling LED lights. 

These lights are configured by assigning `PWM1(i)` through `PWM5(i)` components to their GPIOs; `PWM<x>i` means PWM is inverted. Depending on the number of used PWMs Tasmota will recognize the light as

|Channels|PWM1|PWM2|PWM3|PWM4|PWM5|
|---|---|---|---|---|---|
|1|Brightness|||||
|2|Cold White|Warm White||||
|3|Red|Green|Blue||
|4|Red|Green|Blue|White||
|5|Red|Green|Blue|Cold White|Warm White|

#### MY92xx
MY92xx [family](http://www.my-semi.com/content/products/product_list.aspx?id=2) of drivers uses Adaptive Pulse Density Modulation. 

Configured in Tasmota by assigning `MY92x1 DI` and `MY92x DCKI` components to their GPIOs (some devices might have more than one  MY92xx controller)

Channel mapping for such devices is dependent on the controllers but is easily [remapped](SetOption37) using [`SetOption37`](Commands.md#setoption37).

#### SM16716
SM16716 LEDs, sometimes mislabelled as WS2801.

Configured in Tasmota by assigning `SM16716 CLK`, `SM16716 DAT` and `SM16716 PWR` component to their GPIOs. 

Some SM16716 bulbs have BGR order and need [`SetOption37 54`](Commands.md#setoption57) to work properly.

### PWM Dimmer Switches

Specific module (requires a custom binary) for Martin Jerry/acenx/Tessan/NTONPOWER SD0x PWM dimmer switches. Brightness of the load for these dimmers is controlled by a PWM GPIO pin. They typically have power, up and down buttons, a power status LED, five brightness LEDs and another status LED. [Read more...](PWM-dimmer-switch)

### Addressable LEDs
Lights where each LED is individually controlled. In these lights it is possible to adjust each LEDs power, color and brightness, all just with the use of a single GPIO pin.

WebUI shows hue, saturation and brightness sliders and power toggle for these lights. Red and green color may be mixed up (observed for clone of [Wemos RGB shield](WS2812B-RGB-Shield) using Tasmota 8.1.0).

#### WS2812
Any light using WS2811, WS2812b, WS2813 or SK6812 LEDs falls into this component. They're also commonly called Neopixel lights.

Configured in Tasmota by assigning `WS2812 (7)` component to its GPIO. 

For wiring, see instructions for [LED strip](WS2812B-and-WS2813) or [Wemos RGB shield](WS2812B-RGB-Shield).

### Status LEDs

!!! info "**Status LEDs** are the LEDs on the device used to display device information"

Those LEDs are defined in a template or module using `Led1`, `Led2`, `Led3` or `Led4` (or `Led1i`, `Led2i`, `Led3i` or `Led4i`) and additionally using `LedLink` or `LedLinki` (`LedLink` was introduced in version 6.5.0.12). It is not recommended to assign `Led<x>` and `Led<x>i` with the same `<x>` number. Prior to version 6.5.0.12, Tasmota only supported up to two LED components to indicate the power state of the relay(s), and the Wi-Fi/MQTT connectivity status. 

!!! note "It is possible to wire in your own LED and assign it as any of the above mentioned but that's outside the scope of this article"

If only one LED is configured, it serves both purposes; the link status LED and/or the LED that indicates the power state of the relay(s). If more than one LED component is defined, `Led1`/`Led1i` will act as the Wi-Fi/MQTT status LED and the next defined LED (e.g., `Led2`/`Led2i`) will act as the LED that indicates the power state of the relay(s). _This is the default behavior_. Configuring a GPIO as an [`LEDLink`/`LEDLinki`](#using-ledlink) component changes this behavior.

<img src="https://raw.githubusercontent.com/blakadder/testdocusite/master/sonoff%20blinking.gif" align=right height=90%>

For example, on a Sonoff Basic the green LED is used as the link status LED. Once the device connects, the LED is used to indicate the relay's power status.

#### Link status LED

**Link status LED** shows the network state, more specifically the Wi-Fi and MQTT connection status.

It blinks if the device is not connected to your Wi-Fi AP **and** MQTT broker (if MQTT is enabled). You can change this behaviour with [`LedState`](Commands#ledstate) or turn it off with [`SetOption31`](Commands#SetOption31).

#### Power status LED
**Power status LED** shows the power status of relay component(s). [`LedMask`](Commands#ledmask) determines which relay(s) are associated with the power status LED. This behavior can be modified with the [`LedState`](Commands#ledstate) command. The LED is turned off by default when the relay is OFF and turned on when the relay switches ON.

!!! note 
    Depending on the device design, some LEDs are connected to the same GPIO as the relay. Those cannot be independently controlled since they have to follow the relay state.

If you have more than one LED wired independently and you want it to show the power state of the relay, you must assign an `LedLink` GPIO.

#### Using LedLink
`LedLink` / `LedLinki` was introduced with Tasmota version 6.5.0.12. It is used to assign the link status LED. If your device does not have an LED for link status (or you want to use that LED for a different purpose), you can assign `LedLink` to an available free GPIO. When `LedLink(i)` is assigned, other LEDs are automatically linked to their corresponding relay and serve as that relay's power status LED - i.e., `Led<x>(i)` links to `Relay<x>(i)`

#### LedPower Command
When you use [`LedPower`](Commands#ledpower) you take over control of that particular LED and it stops being linked to its corresponding relay and being its power status LED.
