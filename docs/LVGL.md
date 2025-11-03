# Light and Versatile Embedded Graphics Library :material-cpu-32-bit:

!!! info "Tasmota now supports openHASP-compatible templates - named HASPmota - which makes it much easier to start with LVGL. Check the [HASPmota](HASPmota.md) documentation." 

!!! info "This feature is included in tasmota32-lvgl.bin" 

!!! info "Check the [LVGL API Reference](LVGL_API_Reference.md)"

Supported version: LVGL v9.4.0, LodePNG v20201017, Freetype 2.13.2

**LVGL** (_Light and Versatile Graphics Library_) is Tasmota's next generation display. It is powerful, lightweight and simple to use. It combines:

- LVGL's powerful graphics and GUI library for embedded
- Tasmota's stability, richness of features and frugality on resources
- Berry's powerful language similar to MicroPython


[LVGL](https://lvgl.io/) is an open-source graphics library providing everything you need to create embedded GUI with easy-to-use graphical elements, beautiful visual effects and low memory footprint.

[Berry](Berry.md) is an ultra-lightweight dynamically typed embedded scripting language. It is designed for lower-performance embedded devices

After compiling Tasmota with LVGL support and configuring [uDisplay](Displays.md#universal-display-driver) (see below), you can start using LVGL through the Berry console.

## Using LVGL

This example uses the [M5Stack Fire](https://docs.m5stack.com/en/core/fire) device.

Use the **Auto-Conf** feature in **Configuration** menu to set up the GPIOs and the `display.ini` file. After a couple of restarts, the device should show a splash scren with a Tasmota logo. You are ready to start.

Then open the Berry console and copy/paste the following: (alternatively create an `autoexec.be` file with this content):

```berry
#- start LVGL and init environment -#
lv.start()

hres = lv.get_hor_res()       # should be 320
vres = lv.get_ver_res()       # should be 240

scr = lv.scr_act()            # default screen object
f20 = lv.montserrat_font(20)  # load embedded Montserrat 20

#- Background with a gradient from black #000000 (bottom) to dark blue #0000A0 (top) -#
scr.set_style_bg_color(lv.color(0x000077), lv.PART_MAIN | lv.STATE_DEFAULT)

#- Upper state line -#
stat_line = lv.label(scr)
if f20 != nil stat_line.set_style_text_font(f20, lv.PART_MAIN | lv.STATE_DEFAULT) end
stat_line.set_long_mode(lv.LABEL_LONG_SCROLL)                                        # auto scrolling if text does not fit
stat_line.set_width(hres)
stat_line.set_align(lv.TEXT_ALIGN_LEFT)                                              # align text left
stat_line.set_style_bg_color(lv.color(0xD00000), lv.PART_MAIN | lv.STATE_DEFAULT)    # background #000088
stat_line.set_style_bg_opa(lv.OPA_COVER, lv.PART_MAIN | lv.STATE_DEFAULT)            # 100% background opacity
stat_line.set_style_text_color(lv.color(0xFFFFFF), lv.PART_MAIN | lv.STATE_DEFAULT)  # text color #FFFFFF
stat_line.set_text("Tasmota")
stat_line.refr_size()                                                                # new in LVGL8
stat_line.refr_pos()                                                                 # new in LVGL8

#- display wifi strength indicator icon (for professionals ;) -#
wifi_icon = lv_wifi_arcs_icon(stat_line)    # the widget takes care of positioning and driver stuff
clock_icon = lv_clock_icon(stat_line)

#- create a style for the buttons -#
btn_style = lv.style()
btn_style.set_radius(10)                        # radius of rounded corners
btn_style.set_bg_opa(lv.OPA_COVER)              # 100% background opacity
if f20 != nil btn_style.set_text_font(f20) end  # set font to Montserrat 20
btn_style.set_bg_color(lv.color(0x1fa3ec))      # background color #1FA3EC (Tasmota Blue)
btn_style.set_border_color(lv.color(0x0000FF))  # border color #0000FF
btn_style.set_text_color(lv.color(0xFFFFFF))    # text color white #FFFFFF

#- create buttons -#
prev_btn = lv.btn(scr)                            # create button with main screen as parent
prev_btn.set_pos(20,vres-40)                      # position of button
prev_btn.set_size(80, 35)                         # size of button
prev_btn.add_style(btn_style, lv.PART_MAIN | lv.STATE_DEFAULT)   # style of button
prev_label = lv.label(prev_btn)                   # create a label as sub-object
prev_label.set_text("<")                          # set label text
prev_label.center()

next_btn = lv.btn(scr)                            # right button
next_btn.set_pos(220,vres-40)
next_btn.set_size(80, 35)
next_btn.add_style(btn_style, lv.PART_MAIN | lv.STATE_DEFAULT)
next_label = lv.label(next_btn)
next_label.set_text(">")
next_label.center()

home_btn = lv.btn(scr)                            # center button
home_btn.set_pos(120,vres-40)
home_btn.set_size(80, 35)
home_btn.add_style(btn_style, lv.PART_MAIN | lv.STATE_DEFAULT)
home_label = lv.label(home_btn)
home_label.set_text(lv.SYMBOL_OK)                 # set text as Home icon
home_label.center()

#- callback function when a button is pressed, react to EVENT_CLICKED event -#

def btn_clicked_cb(obj, event)
    var btn = "Unknown"
    if   obj == prev_btn  btn = "Prev"
    elif obj == next_btn  btn = "Next"
    elif obj == home_btn  btn = "Home"
    end
    # get the coordinates
    var indev = event.get_indev()
    var point = lv.point()
    indev.get_point(point)
    # get local coordinates
    var area = lv.area()
    obj.get_coords(area)

    print(f"{btn} button pressed at ({point.x},{point.y}) local ({point.x - area.x1},{point.y - area.y1})")
end


prev_btn.add_event_cb(btn_clicked_cb, lv.EVENT_CLICKED, 0)
next_btn.add_event_cb(btn_clicked_cb, lv.EVENT_CLICKED, 0)
home_btn.add_event_cb(btn_clicked_cb, lv.EVENT_CLICKED, 0)
```

You should see this:

![lvgl8](https://user-images.githubusercontent.com/49731213/135708399-139b0866-ab16-4db0-98f5-e7b2892c1940.png)

![IMG_1137](https://user-images.githubusercontent.com/49731213/115155634-2d875000-a081-11eb-9089-b2e67ee86b1d.jpg)

Setting an input device is simple, we are now configuring the three buttons as the equivalent of a rotary encoder: left/ok/right.

To control focus, you need to create a group, put the focusable items in the group, and assign the input device to the group:

```berry
g = lv.group()
g.add_obj(prev_btn)
g.add_obj(home_btn)
g.add_obj(next_btn)
rotary = lv.register_button_encoder(true)	#- buttons are inverted -#
rotary.set_group(g)
```

### Touch Screen Support

Touch screen are supported natively via Universal Display driver.

Let's go into the details of this example.

### Starting LVGL

Start LVGL

```berry
lv.start()
```

Note: when you create an LVGL object, you need to use the `lv` module. For example, creating a label object is done with `lv.lv_label`. As a convenience, classes can also be named with a shorter name `lv.label` which is equivalent to `lv.lv_label`. The internal class name is still `lv_label`.

Use `lv.montserrat_font(<size>)` to load a pre-defined montserrat font. Embedded sizes are: 10, 14, 20, 28. You can also load a font from the file-system but you need to convert them first. See: <https://docs.lvgl.io/latest/en/html/overview/font.html>

```berry
hres = lv.get_hor_res()       # should be 320
vres = lv.get_ver_res()       # should be 240

scr = lv.scr_act()            # default screan object
f20 = lv.montserrat_font(20)  # load embedded Montserrat 20
```

### Set the background color

```berry
#- Background with a gradient from black #000000 (bottom) to dark blue #0000A0 (top) -#
scr.set_style_bg_color(lv.color(0x0000A0), lv.PART_MAIN | lv.STATE_DEFAULT)
scr.set_style_bg_grad_color(lv.color(0x000000), lv.PART_MAIN | lv.STATE_DEFAULT)
scr.set_style_bg_grad_dir(lv.GRAD_DIR_VER, lv.PART_MAIN | lv.STATE_DEFAULT)
```

The display is composed of a virtual screen object `scr`. To change the background you need to change the style of this object. You can either create a full style object or change the style inside the object. This is what we do here. Hence methods: `set_style_<xxx>`

In this example we do a vertical color gradient from dark blue (up) to black (down).

### Colors

Color are created via `lv.color(<int>)` with 0xRRGGBB as 24 bits color. Internally the color is converted to the display color depth so rounding errors may happen:

```
> lv.color(0x808080)
lv_color(0x838183 - native:0x1084)
```

The line above shows the internal color converted back to 24 bits RGB (rounding errors occur) and the native 15 bits RGB internal color.

### Create the upper text line

```berry
#- Upper state line -#
stat_line = lv.label(scr)
if f20 != nil stat_line.set_style_text_font(f20, lv.PART_MAIN | lv.STATE_DEFAULT) end
stat_line.set_long_mode(lv.LABEL_LONG_SCROLL)                                        # auto scrolling if text does not fit
stat_line.set_width(hres)
stat_line.set_align(lv.TEXT_ALIGN_LEFT)                                              # align text left
stat_line.set_style_bg_color(lv.color(0xD00000), lv.PART_MAIN | lv.STATE_DEFAULT)    # background #000088
stat_line.set_style_bg_opa(lv.OPA_COVER, lv.PART_MAIN | lv.STATE_DEFAULT)            # 100% background opacity
stat_line.set_style_text_color(lv.color(0xFFFFFF), lv.PART_MAIN | lv.STATE_DEFAULT)  # text color #FFFFFF
stat_line.set_text("Tasmota")
stat_line.refr_size()                                                                # new in LVGL8
stat_line.refr_pos()                                                                 # new in LVGL8
```

Let's decompose:

```berry
stat_line = lv.label(scr)
```

Creates an object of type `lv_label` with parent `scr` (screen).

```berry
if f20 != nil stat_line.set_style_text_font(f20, lv.PART_MAIN | lv.STATE_DEFAULT) end
```

If `f20` is correctly loaded, set the font to Montserrat 20. Styles are associated to parts of objects and to states. Here we associate to the main part for state default.

```berry
stat_line.set_long_mode(lv.LABEL_LONG_SCROLL)                                        # auto scrolling if text does not fit
```

Set the label to auto roll from right to left and vice versa if the text does not fit in the display.

```berry
stat_line.set_width(hres)
stat_line.set_align(lv.TEXT_ALIGN_LEFT)                                              # align text left
```

Set the width to full screen resolution, and align text to the left.

```berry
stat_line.set_style_bg_color(lv.color(0xD00000), lv.PART_MAIN | lv.STATE_DEFAULT)    # background #000088
stat_line.set_style_bg_opa(lv.OPA_COVER, lv.PART_MAIN | lv.STATE_DEFAULT)            # 100% background opacity
stat_line.set_style_text_color(lv.color(0xFFFFFF), lv.PART_MAIN | lv.STATE_DEFAULT)  # text color #FFFFFF
```

Set background color to red, text color to white, opacity to 100%.

```berry
stat_line.set_text("Tasmota")
```

Set the text of the label.

```berry
stat_line.refr_size()                                                                # new in LVGL8
stat_line.refr_pos()                                                                 # new in LVGL8
```

The latter is new in LVGL8 and tells the widget to update its size and position, that we will use right after to position other widgets.
Please note that the actual display is asynchronous. We describe the objects, in whatever order, they will be all displayed at once.

### Create a style

```berry
#- create a style for the buttons -#
btn_style = lv.style()
btn_style.set_radius(10)                        # radius of rounded corners
btn_style.set_bg_opa(lv.OPA_COVER)              # 100% background opacity
if f20 != nil btn_style.set_text_font(f20) end  # set font to Montserrat 20
btn_style.set_bg_color(lv.color(0x1fa3ec))      # background color #1FA3EC (Tasmota Blue)
btn_style.set_border_color(lv.color(0x0000FF))  # border color #0000FF
btn_style.set_text_color(lv.color(0xFFFFFF))    # text color white #FFFFFF
```

We create a `lv_style` object and associate some attributes. This works similarly to CSS styles. This style sets background color to Tasmota button blue, text to white, opacity to 100%, font to Montserrat 20 and corner rounding to 1 pixel (10 decipixels).

### Create the buttons

```berry
home_btn = lv.btn(scr)                            # center button
home_btn.set_pos(120,vres-40)
home_btn.set_size(80, 35)
home_btn.add_style(btn_style, lv.PART_MAIN | lv.STATE_DEFAULT)
home_label = lv.label(home_btn)
home_label.set_text(lv.SYMBOL_OK)                 # set text as Home icon
home_label.center()
```

Finally create a `lv_btn` object with parent `scr`, set its size and position, add the previously defined style and set its text.

LVGL provides some pre-defined symbols like `lv.SYMBOL_OK`.

## Advanced features and extensions

### Screenshot

Tasmota includes an easy way to take screenshots.

Just use `lv.screenshot()` and a `BMP` file will be stored in the file system.

Example:

``` ruby
> lv.screenshot()
/screenshot-1642356919.bmp
```

Then download the file to your local computer. The file format is uncompressed BMP with 16 bits per pixel. It is highly recommended to then compress the image to PNG or JPG with the software of your choice.

Warning: due to internal implementation limitations, the image is stored upside down. Don't forget to vertically revert the image.

![screenshot-1642356919](https://user-images.githubusercontent.com/49731213/149672598-3ed79c40-7a7e-42e0-9bd9-9ec1a997ae69.png)


### PNG Image support

Support for PNG decoding depends on `#define USE_LVGL_PNG_DECODER` - which is enabled by default in Tasmota32-lvgl.

You need to first store images on the file system, and simply load them through LVGL standard way. PNG identification depends on the `.png` extension.

Example: store the following image as `Sunrise320.png`

![Sunrise320.png](https://user-images.githubusercontent.com/49731213/149226013-257926a9-28f3-4316-b165-981c3ad4e1f8.png)

```berry
sunrise = lv.img(scr)                   # create an empty image object in the current screen
sunrise.set_src("A:/Sunrise320.png")    # load "Sunrise320.png", the default drive letter is 'A:'
sunrise.move_background()               # move the image to the background
```

![screenshot-1642357636](https://user-images.githubusercontent.com/49731213/149672938-e01264c4-1a8a-4e00-b217-01b35981d1bc.png)

### FreeType fonts support

Support for FreeType fonts depends on `#define USE_LVGL_FREETYPE` - which is **NOT** enabled by default in Tasmota32-lvgl.

Bitmat fonts typically consume significant flash size because you need to embed the font at different size. Using FreeType vector fonts can bring more flexibility and options. You need to first upload the desired fonts on the Tasmota file system.

To create the `lv_font` object, use `lv.load_freetype_font(name:string, size:int, type:int) -> nil or lv_font`. If the font is not found, the call returns `nil`. `type` can be `0` or `lv.FT_FONT_STYLE_NORMAL`, or a combination of `lv.FT_FONT_STYLE_ITALIC` and `lv.FT_FONT_STYLE_BOLD`.

Example (after loading `lvgl_demo.be`) using `sketchbook.ttf` font:

```berry
sb120 = lv.load_freetype_font("sketchbook.ttf", 120, 0)
tt = lv.label(scr)
tt.set_style_bg_opa(lv.OPA_0, lv.PART_MAIN | lv.STATE_DEFAULT)
tt.set_style_text_color(lv.color(0xFFFFFF), lv.PART_MAIN | lv.STATE_DEFAULT)
tt.set_text("MQTT")
tt.set_pos(10,40)
tt.set_size(300,150)
if sb120 != nil tt.set_style_text_font(sb120, lv.PART_MAIN | lv.STATE_DEFAULT) end
```

![lv_freetype_sketch](https://user-images.githubusercontent.com/49731213/149389674-6e325fc7-72ab-4cd0-9137-56c333cfbb7c.png)


## What's implemented and what's not?

What's implemented currently:

* All standard [LVGL widgets](https://docs.lvgl.io/latest/en/html/widgets/index.html) are available, most of extras
* [Styles](https://docs.lvgl.io/master/overview/style.html)
* File-system
* Fonts, currently Montserrat fonts are embedded at sizes 10, 14 (default), 20 and 28 (compressed - smaller and slower)
* External Fonts in file-system, either in LVGL's binary format of TrueType fonts via the FreeType library (requires `#defined USE_LVGL_FREETYPE`)
* Images in file-system, either in LVGL's binary format or PNG
* Most of the high-level LVGL APIs via the `lv` Berry object
* SPI displays with 16 bits per pixels
* Animations via Berry code
* Touch Screen support
* SPI DMA
* Callbacks on LVGL objects to react on events
* Ability to define custom widgets in Berry

What will probably not be implemented

* ~~Native LVGL animation engine~~
* Styles garbage collection is not done, which means that creating lots of styles leads to memory leak
* multi-screens display - I don't know of a single ESP32 based device with multi-screens
* Bidirectional fonts - unless there is strong demand
* LVGL tasks - Berry provides all the necessary tools for task scheduling

## Converting C LVGL to Berry

Simply speaking, you can convert most constants from their C equivalent to Berry by just changing the `LV_` prefix to `lv.`.

Example: `LV_SYMBOL_OK` becomes `lv.SYMBOL_OK`

Berry provides an object model to `lv_object` and sub-classes for widgets like `lv_btn`, `lv_label`... To create an object, just instantiate the class: `lv_btn(parent)`

`lv_style` is created independently.

`lv_color` takes a 24 bits 0xRRGGB as parameter, or a pre-defined color like `lv.BLUE`

## Compiling for LVGL

In `my_user_config.h` or in your config override, add:

```
#define USE_LVGL
#define USE_DISPLAY
#define USE_DISPLAY_LVGL_ONLY
#define USE_XPT2046
#define USE_UNIVERSAL_DISPLAY
  #undef USE_DISPLAY_MODES1TO5
  #undef USE_DISPLAY_LCD
  #undef USE_DISPLAY_SSD1306
  #undef USE_DISPLAY_MATRIX
  #undef USE_DISPLAY_SEVENSEG
```

Be aware that it adds 440Kb to you firmware, so make sure you have a partition with enough program Flash space. Preferably use `esp32_partition_app1856k_spiffs320k.csv` partition file.

## Goodies

### Tasmota Logo

Get a Tasmota logo:

```berry
# start the display
lv.start()

# set background color to blue
scr = lv.scr_act()
scr.set_style_bg_color(lv.color(lv.COLOR_BLUE), lv.PART_MAIN | lv.STATE_DEFAULT)

# create a lv_img object and set it to Tasmota logo
logo = lv.img(scr)
logo.set_tasmota_logo()
logo.center()
```

![screenshot-1618843384](https://user-images.githubusercontent.com/49731213/115389330-3ee56f00-a1dd-11eb-9925-bc91a1d3cf89.png)

The logo is black, with anti-aliasing and transparency. You can now manipulate the logo: change zoom, rotate or recolor.

```berry
# recolor logo to white
logo.set_style_img_recolor_opa(255, lv.PART_MAIN | lv.STATE_DEFAULT)
logo.set_style_img_recolor(lv.color(lv.COLOR_WHITE), lv.PART_MAIN | lv.STATE_DEFAULT)

# set the center point of the image as the reference for zoom and rotation
logo.set_style_transform_pivot_x(32, lv.PART_MAIN | lv.STATE_DEFAULT)
logo.set_style_transform_pivot_y(32, lv.PART_MAIN | lv.STATE_DEFAULT)

# zoom by 125% - 100% is 256, so 125% is 320
logo.set_style_transform_scale(320, lv.PART_MAIN | lv.STATE_DEFAULT)

# rotate by 30 degrees - or 300 deci-degrees
logo.set_style_transform_rotation(300, lv.PART_MAIN | lv.STATE_DEFAULT)
```

![screenshot-1618843394](https://user-images.githubusercontent.com/49731213/115389410-5886b680-a1dd-11eb-9b9f-bb901268aeec.png)

Example of animation:

```berry
cur_zoom = 200
cur_incr = 5
def animate_logo()
  cur_zoom += cur_incr
  if cur_zoom > 300 cur_incr = - cur_incr end
  if cur_zoom < 200 cur_incr = - cur_incr end
  logo.set_style_transform_scale(cur_zoom, lv.PART_MAIN | lv.STATE_DEFAULT)
  tasmota.set_timer(100, animate_logo)
end
animate_logo()
```

### Calibrate a resistive Touch Screen

Some touchscreens like [Lolin TFT 2.4 Touch Shields](https://www.wemos.cc/en/latest/d1_mini_shield/tft_2_4.html) use a resistive touchscreen controlled by `XPT2046`. Contrary to capacitive touchscreens, resistive touchscreens needs a per-device calibration.

You can download **[DisplayCalibrate.tapp](https://raw.githubusercontent.com/arendst/Tasmota/development/tasmota/berry/modules/DisplayCalibrate.tapp)**
Tasmota Application which allows for easy calibration. In only a few steps, it will generate the universal display line `:M` with calibration information.

1. First download **[DisplayCalibrate.tapp](https://raw.githubusercontent.com/arendst/Tasmota/development/tasmota/berry/modules/DisplayCalibrate.tapp)** application and upload it in the file system, and restart.

2. Make sure you are in orientation `DisplayRotate 0`

3. In the console, type the command `DisplayCalibrate`

You will see the following screens. Click on all 4 crosses near corners.

![ts_0](https://user-images.githubusercontent.com/49731213/149639165-a03a3864-1403-4f0c-8a7b-760db1ff926d.png)

![ts_1_0](https://user-images.githubusercontent.com/49731213/149639166-360572ac-3e8c-4e9d-a3e4-62ff8d67896c.png)

![ts_1_1](https://user-images.githubusercontent.com/49731213/149639168-cf7eb258-742c-4e53-a0ed-709f3b347deb.png)

![ts_1_2](https://user-images.githubusercontent.com/49731213/149639169-2b7c9f22-7834-473f-83c7-39c32e94c461.png)

![ts_1_3](https://user-images.githubusercontent.com/49731213/149639170-63681b67-cf37-4e73-9776-af762bc7d617.png)

Note: measures are taken every 50 ms and are averaged, and requires at least 3 measures (150ms).

If everything went well, you will see the following screen. After reboot, your touchscreen is ready and calibrate.

![ts_ok](https://user-images.githubusercontent.com/49731213/149639215-cadf5d58-9d31-4278-8f21-927487ed7058.png)

If the geometry is wrong, you will see the following screen and no change is done to `display.ini`

![ts_nok](https://user-images.githubusercontent.com/49731213/149639222-32a9ead6-e4fe-4a63-a4fe-6c8fb7ad11c3.png)

## Cookbook

### Measuring user inactivity

LVGL has a notion of screen inactivity, i.e. how long did the user not interact with the screen. This can be use to dim the display or turn it off after a moment of inactivity (like a screen saver). The time is in milliseconds. Full doc here: <https://docs.lvgl.io/8/overview/display.html#inactivity>

```berry
# time of inactivity in ms
lv.disp().get_inactive_time()
```

## Technical Details

The code size impact is quite significant, so you probably need partitions with code at least set to 1856KB. Doing so leaves 320KB for file system on 4MB flash. With the [Safeboot partition layout](Safeboot.md), default code partition size for 4MB of flash is 2880KB.

Most of Berry code is solidified in Flash, so the initial RAM footprint is very low (a few KB).
