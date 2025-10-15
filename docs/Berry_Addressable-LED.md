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
