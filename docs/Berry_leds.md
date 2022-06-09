# Berry leds

Requires `#define USE_WS2812`.

Support for addressable leds strips or matrix, including animation. 

Internally relies on NeoPixelBus library and currently supports WS2812 and SK6812.

## Example

Pulsating round on M5Stack Atom Matrix if GPIO 27 is configured as `WS1812 - 2`

``` python
var strip = Leds_matrix(5,5, gpio.pin(gpio.WS2812, 1))
var r = Round(strip, 2, 30)
r.start()
```

**VIDEO**

##  How to use

### Compatibility with Templates

Leds strip must be either controlled by Tasmota's lights features or by Berry, but they can't be controlled by both at the same time.

For Berry control, it is highly recommended to use `WS2812 - 2` and higher (for multiple strips)

### `Leds`and `Leds_matrix` classes


All leds features rely on the low-level `Leds` or `Leds_matrix` classes.


Attributes|Details
:---|:---
Leds<a class="cmnd" id="leds_ctor"></a>|`Leds(pixels:int, gpio:int [,model:int ,rmt:int]) -> instance<Leds>`<br>Creates a `Leds` instance for a linear leds strip<br>`pixels`: number of leds<br>`gpio`: gpio number<br>`model`: (opt) LED model, default:Leds.WS2812_GRB`<br>`rmt`: (opt) `RMT`channel to use, or auto-select (see below)
Leds.matrix<a class="cmnd" id="leds_matrix_ctor"></a>|`Leds_matrix(width:int, height:int, gpio:int [,model:int ,rmt:int]) -> instance<Leds_matrix>`<br>Creates a `Leds` instance for a matrix of leds<br>`width`: number of leds horizontally<br>`height`: number of leds vertically<br>`gpio`: gpio number<br>`model`: (opt) LED model, default:Leds.WS2812_GRB`<br>`rmt`: (opt) `RMT`channel to use, or auto-select (see below)
<strip>.create_segment<a class="cmnd" id="leds_segment"></a>|`<strip>.create_segment(offset:int, pixels:int) -> instance<Leds_segment>`<br>Creates a virtual segment from a physical Leds strip, from Led number `offset` with `pixels` leds.

LED model|Details
:---|:---
Leds.WS2812_GRB|WS2812b Leds (GRB) - takes 24 bits RGB colors
Leds.SK6812_GRBW|SK6812 Leds (GRBW) - takes 32 bits RGBW colors (with white channel)

Methods are the equivalent low-level from NeoPixelBus. All colors are in `0xRRGGBB` format (24 bits) or `0xWWRRGGBB` format (32 bits).

Attributes|Details
:---|:---
clear<a class="cmnd" id="leds_clear"></a>|`clear() -> nil`<br>Clear all led (set to black)
show<a class="cmnd" id="leds_show"></a>|`show() -> nil`<br>Pushes the internal buffer to leds. May be ignored if a show command is already in progress. Use `can_show()` to see if `show()` is possible
can\_show<a class="cmnd" id="leds_can_show"></a>|`can_show() -> bool`<br>Indicates if `show()` is possible, i.e. no transfer is ongoing
is\_dirty<a class="cmnd" id="leds_is_dirty"></a>|`is_dirty() -> bool`<br>Indicates if a led was changed since last `show()`
dirty<a class="cmnd" id="leds_dirty"></a>|`dirty() -> nil`<br>Forces a refresh during next `show()`
pixel\_size<a class="cmnd" id="leds_pixel_size"></a>|`pixel_size() -> int`<br>Returns the number of bytes per pixel
pixel\_count<a class="cmnd" id="leds_pixel_count"></a>|`pixel_count() -> int`<br>Returns the number of leds in the strip/matrix
clear\_to<a class="cmnd" id="leds_clear_to"></a>|`clear_to(col:color [, bri:int]) -> nil`<br>Clears all leds to the specified color. `bri` is optional and default to 100%
set\_pixel\_color<a class="cmnd" id="leds_set_pixel_color"></a>|`set_pixel_color(idx:int, col:color [, bri:int]) -> nil`<br>Set led number `idx`to the specified color. `bri` is optional and default to 100%
set\_matrix\_pixel\_color<a class="cmnd" id="leds_set_matrix_pixel_color"></a>|`set_matrix_pixel_color(x:int, y:int, col:color [, bri:int]) -> nil`<br>(only `Leds_matrix`) Set led number of coordinates `x`/`y` to the specified color. `bri` is optional and default to 100%
get\_pixel\_color<a class="cmnd" id="leds_get_pixel_color"></a>|`get_pixel_color(idx:int) -> color:int`<br>Returns the color (including brightness and gamma correction) of led number `idx`
gamma<a class="cmnd" id="leds_gamma"></a>|`gamma:bool`<br>Applies gamma correction if `true` (default)
pixels\_buffer<a class="cmnd" id="leds_pixels_buffer"></a>|`pixels_buffer() -> bytes()`<br>Returns the internal buffer used by NeoPixelBus. The `byte()` object points to the original buffer, no new buffer is allocated; which means that raw data can be changed directly. Don't forget to call `dirty()` and `show()` afterwards

## Animation framework

The class `Leds_animator` sets the necessary methods to facilitate animations. You just need create a sub-class or `Leds_animator`, provide a `Leds` or `Leds_matrix` instance and implement the `animate` method. You can also register `animators` (see below).

The instance is automatically registered as driver. Call `start()` to start the animation, and `stop()` to stop it.


Attributes|Details
:---|:---
Leds\_animator<a class="cmnd" id="leds_animator_ctor"></a>|`Leds_animator(strip:instance) -> instance<Leds_animator>`<br>Constructors only needs an instance of `Leds` or `Leds_matrix`
start<a class="cmnd" id="leds_animator_start"></a>|`start() -> nil`<br>Register the animator as Tasmota driver (with `tasmota.add_driver`) and start the animation
stop<a class="cmnd" id="leds_animator_stop"></a>|`stop() -> nil`<br>Stop the animation and removes the driver from Tasmota drivers list
clear<a class="cmnd" id="leds_animator_clear"></a>|`clear() -> nil`<br>Call `stop()` and clear all leds (set to black)
remove<a class="cmnd" id="leds_animator_remove"></a>|`remove() -> nil`<br>Removes the instance from Tasmota's list of drivers, and stops the animation
set\_bri<a class="cmnd" id="leds_animator_set_bri"></a>|`set_bri(bri:int) -> nil`<br>Sets the brightness of the animation (0..100)
add\_anim<a class="cmnd" id="leds_animator_add_anim"></a>|`add_anim(anim:instance) -> nil`<br>Registers an animator to be called just before the call to `animate` (see below)
get\_bri<a class="cmnd" id="leds_animator_get_bri"></a>|`get_bri() -> int`<br>Returns the brightness of the animation (0..100)
animate<a class="cmnd" id="leds_animator_animate"></a>|`animate() -> nil`<br>Place-holder for the actual animation. You need to override this method

Example:

``` python
import animate
class Rainbow_stripes : Leds_animator
  var cur_offset     # current offset in the palette
  static palette = [ 0xFF0000, #- red -#
                     0xFFA500, #- orange -#
                     0xFFFF00, #- yellow -#
                     0x008800, #- green -#
                     0x0000FF, #- blue -#
                     0x4B0082, #- indigo -#
                     0xEE82EE, #- violet -#
                  ]

  # duration in seconds
  def init(strip, duration)
    super(self).init(strip)
    self.cur_offset = 0
    # add an animator to change `self.cur_offset` to each value of the palette
    self.add_anim(animate.rotate(def(v) self.cur_offset = v end, 0, size(self.palette), int(duration * 1000)))
  end

  def animate()
    var i = 0
    while i < self.pixel_count    # doing a loop rather than a `for` prevents from allocating a new object
      var col = self.palette[(self.cur_offset + i) % size(self.palette)]
      strip.set_pixel_color(i, col, self.bri)   # simulate the method call without GETMET
      i += 1
    end
    strip.show()
  end
end
```

How to use:

``` python
var strip = Leds_matrix(5,5, gpio.pin(gpio.WS2812, 1))
var r = Rainbow_stripes(strip, 1.0)
r.start()
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
