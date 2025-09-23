# Addressable LEDs in Berry

!!! note "Requires `#define USE_WS2812`, included in Tasmota32"

Support for addressable leds strips and animation.
Internally relies on optimized TasmotaLED library, currently supporting WS2812 and SK6812, 3 and 4 channels, over RMT and SPI.

##  How to use

### Compatibility with Templates

You can control multiple LED strips. `WS2812 - 1` is also controlled by Tasmota's light controls.
It is still possible to control this light strip with Berry, but whenever you use Tasmota light controls
they will temporarily overrid Berry animations.

To avoid any conflict between native WS2812 and Berry control, you can use `Scheme 14` which disables native WS2812.

### Led strips, sub-strips

You first need to define the low-level `Leds` object that describes the hardware strip of connected leds.

You can then define higher level objects like sub-strips
(if there are actually several strips chained together like rings).

Class|Details
:---|:---
Leds<a class="cmnd" id="leds_ctor"></a>|`Leds(pixels:int, gpio:int [,model:int ,rmt:int]) -> instance<Leds>`<br>Creates a `Leds` instance for a linear leds strip<br>`pixels`: number of leds<br>`gpio`: physical gpio number<br>`model`: (optional) LED model, default: `Leds.WS2812_GRB`, alternative `Leds.SK6812_GRBW`<br>`rmt`: (optional) `RMT`channel to use, or auto-select (see below)

Once a `Leds` object, you can use sub-objects:

Method|Details
:---|:---
create_segment<a class="cmnd" id="leds_segment"></a>|`<strip>.create_segment(offset:int, pixels:int) -> instance<Leds_segment>`<br>Creates a virtual segment from a physical Leds strip, from Led number `offset` with `pixels` leds.

The `Leds_segment` class provides the same interface as the `Leds` class, with the following differences:
- It doesn't have its own buffer, it's a view into the parent strip's buffer
- The `show()` method takes an optional `force` parameter that, when `true`, forces a show even if the segment doesn't cover the entire strip
- The `pixels_buffer()` method returns `nil` since segments don't have their own buffer

LED model|Details
:---|:---
Leds.WS2812_GRB|WS2812b Leds (GRB) - takes 24 bits RGB colors
Leds.SK6812_GRBW|SK6812 Leds (GRBW) - takes 32 bits RGBW colors (with white channel)

Methods are the equivalent low-level from NeoPixelBus. All colors are in `0xRRGGBB` format (24 bits) or `0xWWRRGGBB` format (32 bits).

Attributes|Details
:---|:---
clear<a class="cmnd" id="leds_clear"></a>|`clear() -> nil`<br>Clear all led (set to black)
clear\_to<a class="cmnd" id="leds_clear_to"></a>|`clear_to(col:color [, bri:int]) -> nil`<br>Set all leds to the specified color. `bri` (0..255) is optional and default to 255
show<a class="cmnd" id="leds_show"></a>|`show() -> nil`<br>Pushes the internal buffer to leds. May be ignored if a show command is already in progress. Use `can_show()` to see if `show()` is possible
can\_show<a class="cmnd" id="leds_can_show"></a>|`can_show() -> bool`<br>Indicates if `show()` is possible, i.e. no transfer is ongoing
can\_show\_wait<a class="cmnd" id="leds_can_show_wait"></a>|`can_show_wait() -> nil`<br>Waits until `show()` is possible, i.e. no transfer is ongoing
is\_dirty<a class="cmnd" id="leds_is_dirty"></a>|`is_dirty() -> bool`<br>Indicates if a led was changed since last `show()`
dirty<a class="cmnd" id="leds_dirty"></a>|`dirty() -> nil`<br>Forces a refresh during next `show()`
pixel\_size<a class="cmnd" id="leds_pixel_size"></a>|`pixel_size() -> int`<br>Returns the number of bytes per pixel
pixel\_count<a class="cmnd" id="leds_pixel_count"></a>|`pixel_count() -> int`<br>Returns the number of leds in the strip
clear\_to<a class="cmnd" id="leds_clear_to"></a>|`clear_to(col:color [, bri:int]) -> nil`<br>Clears all leds to the specified color. `bri` is optional and default to 255
set\_pixel\_color<a class="cmnd" id="leds_set_pixel_color"></a>|`set_pixel_color(idx:int, col:color [, bri:int]) -> nil`<br>Set led number `idx` to the specified color. `bri` (0..255) is optional and default to 255
get\_pixel\_color<a class="cmnd" id="leds_get_pixel_color"></a>|`get_pixel_color(idx:int) -> color:int`<br>Returns the color (including brightness and gamma correction) of led number `idx`
set\_gamma<a class="cmnd" id="leds_set_gamma"></a>|`set_gamma(gamma:bool) -> nil`<br>Sets whether gamma correction is applied
get\_gamma<a class="cmnd" id="leds_get_gamma"></a>|`get_gamma() -> bool`<br>Returns whether gamma correction is applied
set\_bri<a class="cmnd" id="leds_set_bri"></a>|`set_bri(bri:int) -> nil`<br>Sets the brightness (0..255)
get\_bri<a class="cmnd" id="leds_get_bri"></a>|`get_bri() -> int`<br>Returns the current brightness
set\_animate<a class="cmnd" id="leds_set_animate"></a>|`set_animate(animate) -> nil`<br>Sets the animation object attached to this strip
get\_animate<a class="cmnd" id="leds_get_animate"></a>|`get_animate() -> instance`<br>Returns the animation object attached to this strip
gamma<a class="cmnd" id="leds_gamma"></a>|`gamma:bool`<br>Applies gamma correction if `true` (default)
pixels\_buffer<a class="cmnd" id="leds_pixels_buffer"></a>|`pixels_buffer() -> bytes()`<br>Returns the internal buffer used by NeoPixelBus. The `byte()` object points to the original buffer, no new buffer is allocated; which means that raw data can be changed directly. Don't forget to call `dirty()` and `show()` afterwards

## animation framework - module `animate`

!!! note "An [offline emulator](https://github.com/s-hadinger/Tasmota-Berry-emulator) is available to test animation on a computer instead of an embedded device and generate animated images to show the final result"

!!! note "Based on the project above there as an [online emulator](https://staars.github.io/docs/emulator/) with a minimal Tasmota environment running real Berry in a web browser, which will show animations in real time. Just copy and paste the code."

The module `animate` provides a simple framework to build customizable animations. It is optimized for 1D animations on Led strips.

![Leds_animator](https://github.com/tasmota/docs/assets/49731213/1b4db455-938a-4f89-a3b6-69886be1ce6f)

Note: `import animate` is only available if Tasmota is compiled with `#define USE_WS2812` , which is the case of most precompiled binaries.

The core class is `animate.core`. You first need to create a `Leds` object to describe the Led strip object and length. 

```
import animate
var strip = Leds(25, gpio.pin(gpio.WS2812, 0))
var anim = animate.core(strip)
```

At each tick (50 times per second) the `core` classes first executes the `animators`. Each `animator` can change a velue depending on the timestamp and internal parameters, and publishes the new values to a 'listener'. For example, a "palette animator" iterates through colors, and publishes color values to an object like a background or a dot.

The concept of `animator` is inspired from audio modular synthesizers. An `animator` is like a stand-alone oscillator and a waveform (square, triangle...) that feeds directly other components in cascade.

Once all `animators` are called, `core` then runs each layered `painter` object. A `painter` draws a layer into a `Leds_frame` object (like a frame buffer). The frame supports transparency alpha channel in ARGB mode (see below). Each layer is flattened onto the background layer like a layered cake. Once all layers are rendered and flattened, the final frame buffer is availale.

Finally the frame buffer is copied to the physical WS2812 led strip, after applying brightness `bri` and applying gamma correction (if required).
### `animate.core` class

This is the main helper class to host all the animation components. It is composed of:

- `strip` object representing the led strip (1-dimension, only RGB supported for now)
- `bri` parameter (0..255) to control the overall brightness
- `frame` the background frame buffer, instance of `animate.frame`
- `layer` the current frame buffer being painted by a `painter`, instance of `animate.frame`. It is merged to `frame` once painted, taking into account transparency (alpha channel)

The instance also does the following:

- register a `fast_loop` for quick animation, and iterate every 20ms (50Hz)
- call each `animator` object to compute new values of all parameters
- call each `painter` object to paint layers on top of each others
- apply brightness to frame buffer
- copy to `strip` WS2812 leds

Methods:

- `init(strip [, bri:int])` constructor, needs a strip, brightness defaults to 50%
- `set_bri()` and `get_bri()` to set/get brightness
- `add_animator()` adds an animator object to be called at each tick
- `add_painter()` adds a painter object
- `start()` and `stop()`, by default the animation is stopped. It needs to be started explcitly
- `clear()` clear all leds and stop animation
- `set_cb()` sets the callback at each tick to compute the animation. All animators have been processed before this call. `set_cb(instance, method)`
- `remove()` stop the animation and removes the object from `fast_loop`; `clear()` is called internally

### `animate.frame` class

This class is a helper class to manage RGB pixels frame, mix layers and compute the final image. All frames are computed in ARGB (alpha + RGB) at full brightness and with no gamma (full linear). It's only at the last moment that brightness and gamma correction are applied.

`Leds_frame` is a super-class of `bytes` and encapsulate a raw bytes buffer. Each pixel is in ARGB 32 bits format with alpha-channel.

Methods:

- constructor `Leds_frame(number_of_pixels:int)`: creates a frame buffer with the specified number of pixels (the actual bytes buffer is x4 this size). The buffer is filled with black opaque by default
- `frame[i]`: read/write the 32-bit value of the ARGB pixel at index `i`
- `frame.set_pixel(i, r, g, b, alpha)`: set the pixel at index `i` for value `r`/`g`/`b` (0..255) and optional `alpha` channel (opaque 0x00 if not specified)
- `frame.fill_pixels(argb)`: fill the frame with `argb` 32-bit value
- `frame.blend_pixels(background, foreground)`: blends a background frame (considered opaque) with a front layer with alpha, and stores in the current object. It is common that the target and the background are the same objects, hence `frame.blend_pixels(frame, fore)`
- `frame.paste_pixels(strip_raw_bytes, bri:0..255, gamma:bool)`: pastes the `Led_buffer` object into a Leds strip. This is the final step before displaying the frame to the actual leds, and apply `bri` and `gamma` correction.

### pre-built animators

Currently the following animators are provided:

- `animate.oscillator`: generate a variable integer that can be used by painters as a cyclic value (brightness, size, speed...)
- `animate.palette`: cycle through a color palette with smooth transitions

#### `animate.oscillator`

Methods|Description
:---|:---
set_duration_ms|`set_duration_ms(int) -> nil` sets the duration of the animation (in ms)
set_cb|`set_cb(object, method) -> nil` sets the callback object and method to update after a new value is computed
set_a<br>set_b|`set_a(int) -> nil` or `set_b(int)` sets the start and end value
set_form|`set_form(int) -> nil` sets the waveform among the following values<br>`animate.SAWTOOTH`: ramp from `a` to `b` and start over<br>`animate.TRIANGLE`: move back and forth from `a` to `b`<br>`animate.SQUARE`: alternate values `a` and `b`<br>`animate.COSINE`: move from `a` to `b` in a cosine wave<br>`animate.SINE`: move from half-way between `a` and `b` and move in SINE wave
set_phase|`set_phase(phase:0..100) -> nil` set the phase between 0% and 100%, defaults to `0`%
set_duty_cycle|`set_duty_cycle(int:0..100) -> int` sets the duty cycle between `a` and `b` values, defaults to `50`%

#### `animate.palette`

Methods|Description
:---|:---
init|`init(palette: bytes() or comptr [, duration_ms:int])` initialize the palette animator with a palette object, see below
set_duration_ms|`set_duration_ms(int) -> nil` sets the duration of the animation (in ms)
set_cb|`set_cb(object, method) -> nil` sets the callback object and method to update after a new value is computed
set_bri|`set_bri(bri:0..255) -> nil` sets the brightness for the color, defaults to `255`

**palettes solidified in Flash**

Palette|Description
:---|:---
`animate.PALETTE_RAINBOW_WHITE`|Cycle through 8 colors (including white) and keep colors steady<br><div style='width:100%;height:30px;background:linear-gradient(to right,#FF0000 0.0%,#FF0000 8.9%,#FFA500 14.3%,#FFA500 23.2%,#FFFF00 28.6%,#FFFF00 37.5%,#00FF00 42.9%,#00FF00 51.8%,#0000FF 57.1%,#0000FF 66.1%,#FF00FF 71.4%,#FF00FF 80.4%,#FFFFFF 85.7%,#FFFFFF 94.6%,#FF0000 100.0%);'></div>
`animate.PALETTE_STANDARD_TAG`|Standard palette cycling through 7 colors<br><div style='width:100%;height:30px;background:linear-gradient(to right,#FF0000 0.0%,#FFA500 14.3%,#FFFF00 28.6%,#00FF00 42.9%,#0000FF 57.1%,#FF00FF 71.4%,#EE44A5 85.7%,#FF0000 100.0%);'></div>
`animate.PALETTE_STANDARD_VAL`|Cycle through 6 colors as values<br><div style='width:100%;height:30px;background:linear-gradient(to right,#FF0000 0.0%,#FFA500 16.5%,#FFFF00 33.3%,#00FF00 49.8%,#0000FF 66.7%,#FF00FF 83.1%,#FF0000 100.0%);'></div>
`animate.PALETTE_SATURATED_TAG`|Cycle through 6 saturated colors<br><div style='width:100%;height:30px;background:linear-gradient(to right,#FF0000 0.0%,#FFA500 16.7%,#FFFF00 33.3%,#00FF00 50.0%,#0000FF 66.7%,#FF00FF 83.3%,#FF0000 100.0%);'></div>
`animate.PALETTE_ib_jul01_gp`|<div style='width:100%;height:30px;background:linear-gradient(to right,#E60611 0.0%,#25605A 36.9%,#90BD6A 52.2%,#BB030D 100.0%);'></div>
`animate.PALETTE_ib_44`|<div style='width:100%;height:30px;background:linear-gradient(to right,#D61810 0.0%,#E3734E 25.1%,#EFCE8C 100.0%);'></div>
`animate.PALETTE_Fire_1`|<div style='width:100%;height:30px;background:linear-gradient(to right,#FF0000 0.0%,#FF8000 50.2%,#FFFF00 100.0%);'></div>
`animate.PALETTE_bhw1_sunconure`|<div style='width:100%;height:30px;background:linear-gradient(to right,#61F04E 0.0%,#F6891E 63.1%,#F62D1E 100.0%);'></div>
`animate.PALETTE_bhw4_089`|<div style='width:100%;height:30px;background:linear-gradient(to right,#AE341C 0.0%,#E09A85 11.0%,#EBD0CE 20.8%,#F9D076 31.0%,#E45F32 42.7%,#E3A574 51.8%,#E28343 63.9%,#FCD576 72.2%,#FCA97D 78.8%,#FFC265 87.8%,#D75023 100.0%);'></div>

Palettes can be specified as a `bytes()` object of via `comptr` if they are solidified in Flash.

Palettes can follow to different formats:

**1. Palette in time units**

Bytes: `<transition_time>|<RR><GG><BB>` (4 bytes per entry)

Each entry specifies the time in units to go from the current value to the next value. The last entry must have a `<transition_time>` of `0x00`. The unit is abstract, and only ratio between value are meaningful - the actual duration is derived from `duration_ms` where all indivudal `<transition_time>` are stretched to cover the desired duration.

This format makes it easier to adjust the transition time between colors

Example:

```berry
var PALETTE_TAG = bytes(
  "40"  "FF0000"    # red
  "40"  "FFA500"    # orange
  "40"  "FFFF00"    # yellow
  "40"  "00FF00"    # green
  "40"  "0000FF"    # blue
  "40"  "FF00FF"    # indigo
  "40"  "EE44A5"    # violet
  "00"  "FF0000"    # red
)
```


**2. Palette in values**

Bytes: `<value>|<RR><GG><BB>` (4 bytes per entry)

Each entry indicates what is the target color for a specific value. Values go from `0x00` to `0xFF` (0..255). The first entry must start with `0x00` and the last must use value `0xFF`.

This format is useful to use palettes that represent a color range.

Example:

```berry
var PALETTE_VAL = bytes(
  "00"  "FF0000"    # red
  "24"  "FFA500"    # orange
  "49"  "FFFF00"    # yellow
  "6E"  "008800"    # green
  "92"  "0000FF"    # blue
  "B7"  "4B0082"    # indigo
  "DB"  "EE82EE"    # violet
  "FF"  "FF0000"    # red
)
```

Note: you can generate a CSS linear-gradient of a palette with the following code:

```berry
import animate
print(animate.palette.to_css_gradient(animate.PALETTE_STANDARD_TAG))
# background:linear-gradient(to right,#FF0000 0.0%,#FFA500 14.3%,#FFFF00 28.6%,#00FF00 42.9%,#0000FF 57.1%,#FF00FF 71.4%,#FFFFFF 85.7%,#FF0000 100.0%);
```

## Advanced features

### Hardware `RMT` channels

This library uses NeoPixelBus library, and `RMT` hardware support in ESP32. The number of `RMT` channels, hence the number of simultaneous strips, depends on the CPU type. Tasmota native support for WS2812 uses `RMT` channel 0; it is not usable in such case.

CPU type|RMT channels
:---|:---
ESP32|8
ESP32S2|4
ESP32C3|2

Currently `RMT` channel 0 is used by default if no GPIO `WS2812-1` is configured, `RMT` channel 1 otherwise.  

## pixmat class for 2D pixel buffers

The `pixmat` class provides a native high-performance 2D pixel buffer abstraction for Berry.  
It supports mono (1‑bpp), RGB (3‑bpp), and RGBW (4‑bpp) formats, with optional serpentine layout.

### Constructor

Overload|Description
:---|:---
`pixmat(bitplane_bytes:bytes, bytes_per_line:int)`|Creates a 1‑bpp mono matrix from packed bitplane data. Each bit becomes a pixel (0 or 255).
`pixmat(buf:bytes, width:int, height:int, bpp:int[, serpentine:bool])`|Wraps an existing pixel buffer. No copy is made. `bpp` is bytes per pixel (1=mono, 3=RGB, 4=RGBA). `serpentine` reverses odd rows if `true`.
`pixmat(width:int, height:int, bpp:int[, serpentine:bool])`|Allocates a new zero‑filled buffer with given dimensions and pixel format.


- `bitplane_bytes`: packed bits (1‑bpp), each bit becomes a pixel (0 or 255)
- `buf`: external buffer to wrap (no copy)
- `width`, `height`: pixel dimensions
- `bpp`: bytes per pixel (1=mono, 3=RGB, 4=RGBW)
- `serpentine`: if true, odd rows are reversed in memory

### Methods

Method|Description
:---|:---
`pixmat.clear([val:int])`|Fills the entire matrix with `val` (default 0). For mono: luminance. For RGB/RGBA: all channels.
`pixmat.get(x:int, y:int)` → `int` or `list`|Returns pixel value at `(x, y)`. Packed int for mono/RGB/RGBA, list for other bpp.
`pixmat.set(x:int, y:int, rgb:int[, bri:int])`|Sets pixel at `(x, y)` using packed RGB (`0xRRGGBB`). Optional brightness scaling.
`pixmat.set(x:int, y:int, h:int, s:int, v:int[, bri:int])`|Sets pixel using HSV values. Converts to RGB internally. Optional brightness.
`pixmat.blit(src:pixmat, dx:int, dy:int[, bri:int][, tint:int])`|Copies pixels from `src` matrix with optional brightness and RGB tint. Supports mono→color expansion.
`pixmat.scroll(dir:int[, src:pixmat])`|Scrolls matrix content by one pixel. `dir`: 0=up, 1=left, 2=down, 3=right. Optional `src` fills vacated row/column.


- `clear(val)`: fills matrix with value (default 0)
- `get(x,y)`: returns pixel value (packed int or list)
- `set(x,y,rgb)`: sets pixel with packed RGB
- `set(x,y,h,s,v)`: sets pixel with HSV (converted internally)
- `blit(src, dx, dy)`: copies pixels from another matrix, for mono source 0 becomes transparent
- `scroll(dir)`: scrolls content by one pixel (0=up, 1=left, 2=down, 3=right)

### Notes

- All operations are in-place and use integer math
- Brightness and tinting are supported in `set()` and `blit()`
- Mono→color expansion is automatic when blitting
- Ideal for use with `Leds.pixels_buffer()` to drive 2D LED panels

### Example

```berry
var strip = Leds(256, gpio.pin(gpio.WS2812, 32))
var m = pixmat(strip.pixels_buffer(), 32, 8, strip.pixel_size(), true)
m.set(0, 0, 0xFF0000)  # top-left pixel red
strip.show()
```
  
A few more examples can be found [here](https://github.com/Staars/ulanzi-tc001-tasmota/tree/master/anim).
