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

## WLED Palettes Reference

This page displays all 59 WLED gradient palettes available in the Berry Animation Framework.

<style>
h3#palette-gallery + * td:nth-child(2) {
    background-color: rgb(30, 33, 41);
    padding: 8px;
}
</style>

### Palette Gallery

Palette | Gradient
:--- | :---
`Analogous`<br><small>5 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #2600FF 0.0%, #5600FF 24.7%, #8B00FF 49.8%, #C40075 74.9%, #FF0000 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`April Night`<br><small>17 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #01052D 0.0%, #01052D 3.9%, #05A9AF 9.8%, #01052D 15.7%, #01052D 23.9%, #2DAF1F 29.8%, #01052D 35.7%, #01052D 43.9%, #F99605 49.8%, #01052D 56.1%, #01052D 63.5%, #FF5C00 69.8%, #01052D 75.7%, #01052D 83.9%, #DF2D48 89.8%, #01052D 95.7%, #01052D 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Aqua Flash`<br><small>7 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #000000 0.0%, #82F2F5 25.9%, #FFFF35 37.6%, #FFFFFF 48.6%, #FFFF35 60.0%, #82F2F5 73.7%, #000000 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Atlantica`<br><small>6 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #001C70 0.0%, #2060FF 19.6%, #00F32D 39.2%, #0C5F52 58.8%, #19BE5F 78.4%, #28AA50 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Aurora`<br><small>6 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #01052D 0.0%, #00C817 25.1%, #00FF00 50.2%, #00F32D 66.7%, #008707 78.4%, #01052D 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Aurora 2`<br><small>5 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #11B10D 0.0%, #79F205 25.1%, #19AD79 50.2%, #FA4D7F 75.3%, #AB65DD 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Autumn`<br><small>13 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #5A0E05 0.0%, #8B290D 20.0%, #B44611 32.9%, #C0CA7D 40.8%, #B18903 43.9%, #BEC883 47.8%, #C0CA7C 48.6%, #B18903 52.9%, #C2CB76 55.7%, #B14411 63.9%, #80230C 80.0%, #4A0502 97.6%, #4A0502 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Beach`<br><small>6 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #0C2D00 0.0%, #655602 7.5%, #CF8004 14.9%, #F3C512 24.7%, #6DC492 25.9%, #052707 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Beech`<br><small>15 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #FFFEEC 0.0%, #FFFEEC 4.7%, #FFFEEC 8.6%, #DFE0B2 10.2%, #C0C37C 11.0%, #B0FFE7 11.0%, #7BFBEC 19.6%, #4AF6F1 27.8%, #21E1E4 36.5%, #00CCD7 47.1%, #04A8B2 52.2%, #0A848F 53.3%, #33BDD4 53.3%, #179FC9 81.6%, #0081BE 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Blink Red`<br><small>8 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #040704 0.0%, #28193E 16.9%, #3D0F24 29.8%, #CF2760 42.7%, #FF9CB8 49.8%, #B949CF 64.7%, #6942F0 80.0%, #4D1D4E 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Breeze`<br><small>4 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #103033 0.0%, #1BA6AF 34.9%, #C5E9FF 60.0%, #009198 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`C9`<br><small>8 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #B80400 0.0%, #B80400 23.5%, #902C02 25.5%, #902C02 49.0%, #046002 51.0%, #046002 74.5%, #070758 76.5%, #070758 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`C9 2`<br><small>10 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #067E02 0.0%, #067E02 17.6%, #041E72 18.0%, #041E72 35.3%, #FF0500 35.7%, #FF0500 52.9%, #C43902 53.3%, #C43902 70.6%, #895502 71.0%, #895502 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`C9 New`<br><small>8 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #FF0500 0.0%, #FF0500 23.5%, #C43902 23.9%, #C43902 47.1%, #067E02 47.5%, #067E02 70.6%, #041E72 71.0%, #041E72 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Candy2`<br><small>10 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #6D6666 0.0%, #2A3147 9.8%, #796054 18.8%, #F1D61A 28.6%, #D8682C 34.9%, #2A3147 51.0%, #FFB12F 63.9%, #F1D61A 72.9%, #6D6666 82.7%, #14130D 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Candy`<br><small>5 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #F3F217 0.0%, #F2A826 5.9%, #6F1597 55.7%, #4A1696 77.6%, #000075 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Cyane`<br><small>11 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #3D9B2C 0.0%, #5FAE4D 9.8%, #84C171 23.5%, #9AA67D 36.5%, #AF8A88 41.6%, #B77989 42.7%, #C2688A 44.3%, #E1B3A5 45.5%, #FFFFC0 48.6%, #A7DACB 65.9%, #54B6D7 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Departure`<br><small>12 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #352200 0.0%, #563300 16.5%, #936C31 24.7%, #D4A66C 32.9%, #EBD4B4 41.6%, #FFFFFF 45.5%, #BFFFC1 54.1%, #54FF58 58.0%, #00FF00 66.7%, #00C000 74.9%, #008000 83.1%, #008000 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Drywet`<br><small>7 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #776121 0.0%, #EBC758 16.5%, #A9EE7C 32.9%, #25EEE8 49.8%, #0778EC 66.7%, #1B01AF 83.1%, #043365 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Fairy Reaf`<br><small>4 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #DC13BB 0.0%, #0CE1DB 62.7%, #CBF2DF 85.9%, #FFFFFF 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Fire`<br><small>13 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #000000 0.0%, #4D0000 18.0%, #B10000 37.6%, #C42609 42.4%, #D74C13 46.7%, #EB731D 57.3%, #FF9929 68.2%, #FFB229 73.7%, #FFCC29 79.2%, #FFE629 85.5%, #FFFF29 91.8%, #FFFF8F 95.7%, #FFFFFF 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Grintage`<br><small>5 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #1D0803 0.0%, #4C0100 20.8%, #8E601C 40.8%, #D3BF3D 60.0%, #75812A 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Hult64`<br><small>8 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #18B8AE 0.0%, #08A296 25.9%, #7C8907 40.8%, #B2BA16 51.0%, #7C8907 58.8%, #069C90 78.8%, #008075 93.7%, #008075 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Hult`<br><small>6 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #FBD8FC 0.0%, #FFC0FF 18.8%, #EF5FF1 34.9%, #3399D9 62.7%, #18B8AE 84.7%, #18B8AE 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Icefire`<br><small>7 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #000000 0.0%, #003375 23.1%, #0066FF 46.7%, #2699FF 58.4%, #56CCFF 70.6%, #A7E6FF 85.1%, #FFFFFF 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Jul`<br><small>4 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #E2060C 0.0%, #1A604E 36.9%, #82BD5E 51.8%, #B10309 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Landscape`<br><small>9 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #000000 0.0%, #1F5913 14.5%, #48B22B 29.8%, #96EB05 49.8%, #BAEA77 50.2%, #DEE9FC 51.0%, #C5DBE7 60.0%, #84B3FD 80.0%, #1C6BE1 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Light Pink`<br><small>11 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #4F206D 0.0%, #5A2875 9.8%, #66307C 20.0%, #8D87B9 29.8%, #B4DEF8 40.0%, #D0ECFC 42.7%, #EDFAFF 44.7%, #CEC8EF 47.8%, #B195DE 58.4%, #BB82CB 71.8%, #C66FB8 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Lite Light`<br><small>6 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #000000 0.0%, #141516 3.5%, #2E2B31 15.7%, #2E2B31 25.9%, #3D1041 39.6%, #000000 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Magenta`<br><small>7 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #000000 0.0%, #000075 16.5%, #0000FF 32.9%, #7100FF 49.8%, #FF00FF 66.7%, #FF80FF 83.1%, #FFFFFF 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Magred`<br><small>5 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #000000 0.0%, #710075 24.7%, #FF00FF 49.8%, #FF0075 74.9%, #FF0000 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Orangery`<br><small>9 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #FF5F17 0.0%, #FF5200 11.8%, #DF0D08 23.5%, #902C02 35.3%, #FF6E11 47.1%, #FF4500 58.8%, #9E0D0B 70.6%, #F15211 82.4%, #D52504 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Orange & Teal`<br><small>4 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #00965C 0.0%, #00965C 21.6%, #FF4800 78.4%, #FF4800 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Pastel`<br><small>11 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #3D87B8 0.0%, #81BCA9 14.1%, #CBF19B 34.1%, #E4ED8D 39.2%, #FFE87F 42.0%, #FBCA82 45.1%, #F8AC85 47.1%, #FBCA82 50.2%, #FFE87F 70.6%, #FFF278 87.5%, #FFFC71 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Pink Candy`<br><small>7 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #FFFFFF 0.0%, #3240FF 17.6%, #F210BA 43.9%, #FFFFFF 54.9%, #F210BA 60.8%, #740DA6 76.9%, #FFFFFF 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Red & Blue`<br><small>9 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #290E63 0.0%, #80184A 12.2%, #E32232 24.7%, #841F4C 37.3%, #2F1D66 49.8%, #6D2F65 62.4%, #B04264 74.9%, #813968 87.5%, #54306C 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Red Flash`<br><small>5 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #000000 0.0%, #F20C08 38.8%, #FDE4A3 51.0%, #F20C08 60.8%, #000000 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Red Reaf`<br><small>4 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #244472 0.0%, #95C3F8 40.8%, #FF0000 73.7%, #5E0E09 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Red Shift`<br><small>7 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #62165D 0.0%, #671649 17.6%, #C02D38 38.8%, #EBBB3B 51.8%, #E4551A 68.6%, #E43830 78.8%, #020002 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Red Tide`<br><small>11 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #FB2E00 0.0%, #FF8B19 11.0%, #F69E3F 16.9%, #F6D87B 22.7%, #F35E0A 32.9%, #B1410B 44.7%, #FFF173 54.9%, #B1410B 65.9%, #FAE99E 76.9%, #FF5E06 84.7%, #7E0804 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Retro Clown`<br><small>3 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #F2A826 0.0%, #E24E50 45.9%, #A136E1 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Rewhi`<br><small>6 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #B1A0C7 0.0%, #CD9E95 28.2%, #E99B65 34.9%, #FF5F3F 42.0%, #C0626D 55.3%, #84659F 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Rivendell`<br><small>5 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #18452C 0.0%, #496946 39.6%, #818C61 64.7%, #C8CCA6 94.9%, #C8CCA6 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Sakura`<br><small>5 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #C4130A 0.0%, #FF452D 25.5%, #DF2D48 51.0%, #FF5267 76.5%, #DF0D11 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Semi Blue`<br><small>9 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #000000 0.0%, #180426 4.7%, #370854 20.8%, #2B309F 31.4%, #1F59ED 46.7%, #323BA6 56.9%, #471E62 72.9%, #1F0F2D 91.4%, #000000 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Sherbet`<br><small>7 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #FF6629 0.0%, #FF8C5A 16.9%, #FF335A 33.7%, #FF99A9 49.8%, #FFFFF9 66.7%, #71FF55 82.0%, #9DFF89 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Splash`<br><small>5 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #BA3FFF 0.0%, #E30955 49.8%, #EACDD5 68.6%, #CD26B0 86.7%, #CD26B0 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Sunset2`<br><small>8 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #AF793E 0.0%, #80673C 11.4%, #54543A 26.7%, #F8B837 26.7%, #EFCC5D 38.0%, #E6E185 48.6%, #667D81 69.8%, #001A7D 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Sunset`<br><small>7 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #B50000 0.0%, #DA5500 8.6%, #FFAA00 20.0%, #D3554D 33.3%, #A700A9 52.9%, #4900BC 77.6%, #0000CF 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Temperature`<br><small>18 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #145CAB 0.0%, #0F6FBA 5.5%, #068ED3 11.0%, #02A1E3 16.5%, #10B5EF 22.0%, #26BCC9 27.5%, #56CCC8 32.9%, #8BDBB0 38.8%, #B6E57D 44.3%, #C4E63F 49.8%, #F1F016 55.3%, #FEDE1E 60.8%, #FBC704 66.7%, #F79D09 72.2%, #F3720F 77.6%, #D51E1D 88.6%, #972623 94.1%, #972623 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Tertiary`<br><small>5 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #0019FF 0.0%, #268C75 24.7%, #56FF00 49.8%, #A78C13 74.9%, #FF1929 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Tiamat`<br><small>11 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #01020E 0.0%, #020523 12.9%, #0D875C 39.2%, #2BFFC1 47.1%, #F707F9 54.9%, #C111D0 62.7%, #27FF9A 70.6%, #04D5EC 78.4%, #27FC87 86.3%, #C1D5FD 94.1%, #FFF9FF 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Toxy Reaf`<br><small>2 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #02EF7E 0.0%, #9123D9 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Traffic Light`<br><small>4 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #000000 0.0%, #00FF00 33.3%, #FFFF00 66.7%, #FF0000 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Vintage`<br><small>8 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #291218 0.0%, #490016 20.0%, #A5AA26 29.8%, #FFBD50 39.6%, #8B3828 49.8%, #490016 60.0%, #291218 89.8%, #291218 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Yelblu`<br><small>5 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #0000FF 0.0%, #0080FF 24.7%, #00FFFF 49.8%, #71FF75 74.9%, #FFFF00 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Yelblu Hot`<br><small>7 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #2B1E39 0.0%, #490077 22.7%, #57004A 47.8%, #C53916 62.0%, #DA751B 71.8%, #EFB120 85.9%, #F6F71B 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Yellowout`<br><small>2 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #DEBF08 0.0%, #753401 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>
`Yelmag`<br><small>7 color stops</small> | <div style='width:400px;height:30px;background:linear-gradient(to right, #000000 0.0%, #710000 16.5%, #FF0000 32.9%, #FF0075 49.8%, #FF00FF 66.7%, #FF8075 83.1%, #FFFF00 100.0%);border-color:#888;border-width:1px;border-style:solid;'></div>

### Credits

- **WLED Palettes**: From [WLED Project](https://github.com/Aircoookie/WLED) by Aircoookie
- **Conversion**: For Tasmota Berry Animation Framework
- **Total Palettes**: 59 gradient palettes
