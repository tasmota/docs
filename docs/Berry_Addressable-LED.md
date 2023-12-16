# Addressable LEDs in Berry

!!! note "Requires `#define USE_WS2812`, included in Tasmota32"

Support for addressable leds strips or matrix, including animation.
Internally relies on NeoPixelBus library and currently supports WS2812 and SK6812.

##  How to use

### Compatibility with Templates

You can control multiple LED strips. `WS2812 - 1` is also controlled by Tasmota's light controls.
It is still possible to control this light strip with Berry, but whenever you use Tasmota light controls
they will temporarily overrid Berry animations.

To avoid any conflict between native WS2812 and Berry control, you can use `Scheme 14` which disables native WS2812.

### Led strips, matrix and sub-strips

You first need to define the low-level `Leds` object that describes the hardware strip of connected leds.

You can then define higher level objects like sub-strips
(if there are actually several strips chained together like rings) or LED matrix.

Class|Details
:---|:---
Leds<a class="cmnd" id="leds_ctor"></a>|`Leds(pixels:int, gpio:int [,model:int ,rmt:int]) -> instance<Leds>`<br>Creates a `Leds` instance for a linear leds strip<br>`pixels`: number of leds<br>`gpio`: physical gpio number<br>`model`: (optional) LED model, default: `Leds.WS2812_GRB`, alternative `Leds.SK6812_GRBW`<br>`rmt`: (optional) `RMT`channel to use, or auto-select (see below)

Once a `Leds` object, you can use sub-objects:

Method|Details
:---|:---
create_matrix<a class="cmnd" id="leds_matrix_ctor"></a>|`<strip>.create_matrix(width:int, height:int [, offset:int]) -> instance<Leds_matrix>`<br>Creates a `Leds_matrix` instance from a `Leds` instance<br>`width`: number of leds horizontally<br>`height`: number of leds vertically<br>`offset`: number of leds to skip until start of matrix<BR>You can use `set_alternate(true)` to enabled alternate lines (i.e. zigzag mode).
create_segment<a class="cmnd" id="leds_segment"></a>|`<strip>.create_segment(offset:int, pixels:int) -> instance<Leds_segment>`<br>Creates a virtual segment from a physical Leds strip, from Led number `offset` with `pixels` leds.

LED model|Details
:---|:---
Leds.WS2812_GRB|WS2812b Leds (GRB) - takes 24 bits RGB colors
Leds.SK6812_GRBW|SK6812 Leds (GRBW) - takes 32 bits RGBW colors (with white channel)

Methods are the equivalent low-level from NeoPixelBus. All colors are in `0xRRGGBB` format (24 bits) or `0xWWRRGGBB` format (32 bits).

Attributes|Details
:---|:---
clear<a class="cmnd" id="leds_clear"></a>|`clear() -> nil`<br>Clear all led (set to black)
clear\_to<a class="cmnd" id="leds_clear_to"></a>|`clear_to(col:color [, bri:int]) -> nil`<br>Set all leds to the specified color. `bri` (0..100) is optional and default to 100%
show<a class="cmnd" id="leds_show"></a>|`show() -> nil`<br>Pushes the internal buffer to leds. May be ignored if a show command is already in progress. Use `can_show()` to see if `show()` is possible
can\_show<a class="cmnd" id="leds_can_show"></a>|`can_show() -> bool`<br>Indicates if `show()` is possible, i.e. no transfer is ongoing
is\_dirty<a class="cmnd" id="leds_is_dirty"></a>|`is_dirty() -> bool`<br>Indicates if a led was changed since last `show()`
dirty<a class="cmnd" id="leds_dirty"></a>|`dirty() -> nil`<br>Forces a refresh during next `show()`
pixel\_size<a class="cmnd" id="leds_pixel_size"></a>|`pixel_size() -> int`<br>Returns the number of bytes per pixel
pixel\_count<a class="cmnd" id="leds_pixel_count"></a>|`pixel_count() -> int`<br>Returns the number of leds in the strip/matrix
clear\_to<a class="cmnd" id="leds_clear_to"></a>|`clear_to(col:color [, bri:int]) -> nil`<br>Clears all leds to the specified color. `bri` is optional and default to 100%
set\_pixel\_color<a class="cmnd" id="leds_set_pixel_color"></a>|`set_pixel_color(idx:int, col:color [, bri:int]) -> nil`<br>Set led number `idx` to the specified color. `bri` (0..100) is optional and default to 100%
set\_matrix\_pixel\_color<a class="cmnd" id="leds_set_matrix_pixel_color"></a>|`set_matrix_pixel_color(x:int, y:int, col:color [, bri:int]) -> nil`<br>(only `Leds_matrix`) Set led number of coordinates `x`/`y` to the specified color. `bri` is optional and default to 100%
set\_alternate<a class="cmnd" id="leds_set_alternate"></a>|`set_alternate(bool) -> nil`<br>(only `Leds_matrix`) Sets the matrix as alternate cabling (i.e. zigzag mode) instead of regular mode.<BR>It is common for large led matrix to have every other line in reverse order.
get\_alternate<a class="cmnd" id="leds_get_alternate"></a>|`get_alternate() -> bool`<br>(only `Leds_matrix`) Read the value set with `set_alternate(bool)`.
get\_pixel\_color<a class="cmnd" id="leds_get_pixel_color"></a>|`get_pixel_color(idx:int) -> color:int`<br>Returns the color (including brightness and gamma correction) of led number `idx`
gamma<a class="cmnd" id="leds_gamma"></a>|`gamma:bool`<br>Applies gamma correction if `true` (default)
pixels\_buffer<a class="cmnd" id="leds_pixels_buffer"></a>|`pixels_buffer() -> bytes()`<br>Returns the internal buffer used by NeoPixelBus. The `byte()` object points to the original buffer, no new buffer is allocated; which means that raw data can be changed directly. Don't forget to call `dirty()` and `show()` afterwards
set\_bytes<a class="cmnd" id="leds_set_bytes"></a>|`set_bytes(row:int, buffer:bytes, offset:int, len:int) -> nil` (matrix only)<br>Copy a bytes() `buffer` directly in the internal matrix buffer, for row `row`, skipping `offset` pixels and copying `len` bytes.

## animation framework - module `animate`

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
- `bri` parameter (0..100) to control the overall brightness
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
- `frame.paste_pixels(strip_raw_bytes, bri:0..100, gamma:bool)`: pastes the `Led_buffer` object into a Leds strip. This is the final step before displaying the frame to the actual leds, and apply `bri` and `gamma` correction.

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
set_bri|`set_bri(bri:0..100) -> nil` sets the brightness for the color, defaults to `100`%

**palettes solidified in Flash**

Palette|Description
:---|:---
`animate.PALETTE_STANDARD_TAG`|Standard palette cycling through 7 colors<br><div style='width:140px;height:20px;background:linear-gradient(to right,#FF0000 0.0%,#FFA500 14.3%,#FFFF00 28.6%,#00EE00 42.9%,#0000FF 57.1%,#4B00FF 71.4%,#FF82FF 85.7%,#FF0000 100.0%);'>Test</div>
`animate.PALETTE_STANDARD_VAL`|Same palette described as values<br>
`animate.PALETTE_RAINBOW_WHITE`|Cycle through 8 colors (including white) and keep colors steady<br>
`animate.PALETTE_SATURATED_TAG`|Cycle through 7 saturated colors<br>

Palettes can be specified as a `bytes()` object of via `comptr` if they are solidified in Flash.

Palettes can follow to different formats:

**1. Palette in time units** 
Bytes: `<transition_time>|<RR><GG><BB>` (4 bytes per entry)

Each entry specifies the time in units to go from the current value to the next value. The last entry must have a `<transition_time>` of `0x00`. The unit is abstract, and only ratio between value are meaningful - the actual duration is derived from `duration_ms` where all indivudal `<transition_time>` are stretched to cover the desired duration.

This format makes it easier to adjust the transition time between colors

Example:

```
var PALETTE_SATURATED_TAG = bytes(
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

```
var PALETTE_STANDARD_VAL = bytes(
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

## Advanced features

### Hardware `RMT` channels

This library uses NeoPixelBus library, and `RMT` hardware support in ESP32. The number of `RMT` channels, hence the number of simultaneous strips, depends on the CPU type. Tasmota native support for WS2812 uses `RMT` channel 0; it is not usable in such case.

CPU type|RMT channels
:---|:---
ESP32|8
ESP32S2|4
ESP32C3|2

Currently `RMT` channel 0 is used by default if no GPIO `WS2812-1` is configured, `RMT` channel 1 otherwise.
<!-- 
## Example

Pulsating round on M5Stack Atom Matrix if GPIO 27 is configured as `WS1812 - 2`

```berry
var strip = Leds_matrix(5,5, gpio.pin(gpio.WS2812, 1))
var r = Round(strip, 2, 30)
r.start()
```

**VIDEO** -->
