# LVGL + Berry + Tasmota

!!! info "ESP32 only and NOT included in ESP32 pre-compiled builds". See below How to Compile"

**Supported LVGL version**: **v8.0.2**

**LVGL** (_Light and Versatile Graphics Library_) is Tasmota's next generation display. It is powerful, lightweight and simple to use. It combines:

- **LVGL**'s powerful graphics and GUI library for embedded
- **Tasmota**'s stability, richness of features and frugality on resources
- **Berry**'s powerful language similar to MicroPython


[LVGL](https://lvgl.io/) LVGL is an open-source graphics library providing everything you need to create embedded GUI with easy-to-use graphical elements, beautiful visual effects and low memory footprint.

[Berry](https://tasmota.github.io/docs/Berry/) is a ultra-lightweight dynamically typed embedded scripting language. It is designed for lower-performance embedded devices

## Example

After compiling a Tasmota LVGL firmware and configuring uDisplay (see below), you can start using LVGL through Berry's web console.

## Example - M5Stack Fire or Core

Use the following template to define the relevant SPI GPIOs. Also set one of the unsued GPIOs to `Option A: 3`.

The complete configuration for M5Stack Fire is:

```json
Backlog Module 0; Template {"NAME":"M5stack Fire","GPIO":[6210,1,1,1,1,1,1,1,1,1,768,1,1,1,736,672,0,640,608,704,0,3872,3872,800,0,0,0,0,992,1024,1,0,0,34,33,32],"FLAG":0,"BASE":1}
```

Save the following file as `display.ini` in the file system:

```
:H,ILI9341,320,240,16,SPI,1,*,*,*,*,*,*,*,40
:B,60,1
:I
EF,3,03,80,02
CF,3,00,C1,30
ED,4,64,03,12,81
E8,3,85,00,78
CB,5,39,2C,00,34,02
F7,1,20
EA,2,00,00
C0,1,23
C1,1,10
C5,2,3e,28
C7,1,86
36,1,48
37,1,00
3A,1,55
B1,2,00,18
B6,3,08,82,27
F2,1,00
26,1,01
E0,0F,0F,31,2B,0C,0E,08,4E,F1,37,07,10,03,0E,09,00
E1,0F,00,0E,14,03,11,07,31,C1,48,08,0F,0C,31,36,0F
11,80
29,80
:o,28
:O,29
:A,2A,2B,2C
:R,36
:0,08,00,00,00
:1,68,00,00,01
:2,C8,00,00,02
:3,A8,00,00,03
#
```

Then open the Berry console, and copy/paste the following: (alternatively you      can create a `autoexec.be` file with this content):

``` ruby
#- start LVGL and init environment -#
lv.start()

hres = lv.get_hor_res()       # should be 320
vres = lv.get_ver_res()       # should be 240

scr = lv.scr_act()            # default screean object
f20 = lv.montserrat_font(20)  # load embedded Montserrat 20

#- Background with a gradient from black #000000 (bottom) to dark blue #0000A0 (top) -#
scr.set_style_bg_color(lv_color(0x0000A0), lv.PART_MAIN | lv.STATE_DEFAULT)
scr.set_style_bg_grad_color(lv_color(0x000000), lv.PART_MAIN | lv.STATE_DEFAULT)
scr.set_style_bg_grad_dir(lv.GRAD_DIR_VER, lv.PART_MAIN | lv.STATE_DEFAULT)

#- Upper state line -#
stat_line = lv_label(scr)
if f20 != nil stat_line.set_style_text_font(f20, lv.PART_MAIN | lv.STATE_DEFAULT) end
stat_line.set_long_mode(lv.LABEL_LONG_SCROLL)                                                  # auto scrolling if text does not fit
stat_line.set_width(hres)
stat_line.set_align(lv.TEXT_ALIGN_LEFT)                                                      # align text left
stat_line.set_style_bg_color(lv_color(0xD00000), lv.PART_MAIN | lv.STATE_DEFAULT)    # background #000088
stat_line.set_style_bg_opa(lv.OPA_COVER, lv.PART_MAIN | lv.STATE_DEFAULT)            # 100% background opacity
stat_line.set_style_text_color(lv_color(0xFFFFFF), lv.PART_MAIN | lv.STATE_DEFAULT)  # text color #FFFFFF
stat_line.set_text("Tasmota")
stat_line.refr_size()                                                                # new in LVGL8
stat_line.refr_pos()                                                                 # new in LVGL8

#- display wifi strength indicator icon (for professionals ;) -#
wifi_icon = lv_wifi_arcs_icon(stat_line)    # the widget takes care of positioning and driver stuff
clock_icon = lv_clock_icon(stat_line)

#- create a style for the buttons -#
btn_style = lv_style()
btn_style.set_radius(10)                        # radius of rounded corners
btn_style.set_bg_opa(lv.OPA_COVER)              # 100% backgrond opacity
if f20 != nil btn_style.set_text_font(f20) end  # set font to Montserrat 20
btn_style.set_bg_color(lv_color(0x1fa3ec))      # background color #1FA3EC (Tasmota Blue)
btn_style.set_border_color(lv_color(0x0000FF))  # border color #0000FF
btn_style.set_text_color(lv_color(0xFFFFFF))    # text color white #FFFFFF

#- create buttons -#
prev_btn = lv_btn(scr)                            # create button with main screen as parent
prev_btn.set_pos(20,vres-40)                      # position of button
prev_btn.set_size(80, 30)                         # size of button
prev_btn.add_style(btn_style, lv.PART_MAIN | lv.STATE_DEFAULT)   # style of button
prev_label = lv_label(prev_btn)                   # create a label as sub-object
prev_label.set_text("<")                          # set label text
prev_label.center()

next_btn = lv_btn(scr)                            # right button
next_btn.set_pos(220,vres-40)
next_btn.set_size(80, 30)
next_btn.add_style(btn_style, lv.PART_MAIN | lv.STATE_DEFAULT)
next_label = lv_label(next_btn)
next_label.set_text(">")
next_label.center()

home_btn = lv_btn(scr)                            # center button
home_btn.set_pos(120,vres-40)
home_btn.set_size(80, 30)
home_btn.add_style(btn_style, lv.PART_MAIN | lv.STATE_DEFAULT)
home_label = lv_label(home_btn)
home_label.set_text(lv.SYMBOL_OK)                 # set text as Home icon
home_label.center()

#- callback function when a button is pressed, react to EVENT_CLICKED event -#

def btn_clicked_cb(obj, event)
    var btn = "Unknown"
    if   obj == prev_btn  btn = "Prev"
    elif obj == next_btn  btn = "Next"
    elif obj == home_btn  btn = "Home"
    end
    print(btn, "button pressed")
end


prev_btn.add_event_cb(btn_clicked_cb, lv.EVENT_CLICKED, 0)
next_btn.add_event_cb(btn_clicked_cb, lv.EVENT_CLICKED, 0)
home_btn.add_event_cb(btn_clicked_cb, lv.EVENT_CLICKED, 0)
```

You should see this:

![lvgl8](https://user-images.githubusercontent.com/49731213/135708399-139b0866-ab16-4db0-98f5-e7b2892c1940.png)

![IMG_1137](https://user-images.githubusercontent.com/49731213/115155634-2d875000-a081-11eb-9089-b2e67ee86b1d.jpg)

Setting an input device is also simple, we are now configuring the three buttons as the equivalent of a rotary encoder: left/ok/right.

To control focus, you need to create a group, put the focusable items in the group, and assign the input device to the group:

```python
g = lv_group()
g.add_obj(prev_btn)
g.add_obj(home_btn)
g.add_obj(next_btn)
rotary = lv.register_button_encoder(true)	#- buttons are inverted -#
rotary.set_group(g)
```

#### Touch Screen support
![colorwheel](https://user-images.githubusercontent.com/49731213/135708597-ae589748-417b-46c2-a452-5398cd90ee09.png)

Touch screen are supported natively via Universal Display driver.

Example:

```python
colp = lv_colorwheel(scr)
colp.set_size(130, 130)
colp.set_pos(10,30)
```

Let's go into the details of this example.

### Starting LVGL

Start LVGL

```python
lv.start()
```

Use `lv.montserrat_font(<size>)` to load a pre-defined montserrat font. Embedded sizes are: 10, 14, 20, 28. You can also load a font from the file-system but you need to convert them first. See: https://docs.lvgl.io/latest/en/html/overview/font.html

```python
hres = lv.get_hor_res()       # should be 320
vres = lv.get_ver_res()       # should be 240

scr = lv.scr_act()            # default screean object
f20 = lv.montserrat_font(20)  # load embedded Montserrat 20
```

### Set the background color

```python
#- Background with a gradient from black #000000 (bottom) to dark blue #0000A0 (top) -#
scr.set_style_bg_color(lv_color(0x0000A0), lv.PART_MAIN | lv.STATE_DEFAULT)
scr.set_style_bg_grad_color(lv_color(0x000000), lv.PART_MAIN | lv.STATE_DEFAULT)
scr.set_style_bg_grad_dir(lv.GRAD_DIR_VER, lv.PART_MAIN | lv.STATE_DEFAULT)
```

The display is composed of a virtual screen object `scr`. To change the background you need to change the style of this object. You can either create a full style object or change the style inside the object. This is what we do here. Hence methods: `set_style_<xxx>`

In this example we do a vertical color cradient from dark blue (up) to black (down).

### Colors

Color are created via `lv_color(<int>)` with 0xRRGGBB as 24 bits color. Internally the color is converted to the display color depth so rounding errors may happen:

```
> lv_color(0x808080)
lv_color(0x838183 - native:0x1084)
```

The line above shows the internal color converted back to 24 bits RGB (rounding errors occur) and the native 15 bits RGB internal color.

### Create the upper text line

```python
#- Upper state line -#
stat_line = lv_label(scr)
if f20 != nil stat_line.set_style_text_font(f20, lv.PART_MAIN | lv.STATE_DEFAULT) end
stat_line.set_long_mode(lv.LABEL_LONG_SCROLL)                                        # auto scrolling if text does not fit
stat_line.set_width(hres)
stat_line.set_align(lv.TEXT_ALIGN_LEFT)                                              # align text left
stat_line.set_style_bg_color(lv_color(0xD00000), lv.PART_MAIN | lv.STATE_DEFAULT)    # background #000088
stat_line.set_style_bg_opa(lv.OPA_COVER, lv.PART_MAIN | lv.STATE_DEFAULT)            # 100% background opacity
stat_line.set_style_text_color(lv_color(0xFFFFFF), lv.PART_MAIN | lv.STATE_DEFAULT)  # text color #FFFFFF
stat_line.set_text("Tasmota")
stat_line.refr_size()                                                                # new in LVGL8
stat_line.refr_pos()                                                                 # new in LVGL8
```

Let's decompose:

```python
stat_line = lv_label(scr)
```

Creates an object of type `lv_label` with parent `scr` (screen).

```python
if f20 != nil stat_line.set_style_text_font(f20, lv.PART_MAIN | lv.STATE_DEFAULT) end
```

If `f20` is correctly loaded, set the font to Montserrat 20. Styles are associated to parts of objects and to states. Here we associate to the main part for state default.

```python
stat_line.set_long_mode(lv.LABEL_LONG_SCROLL)                                        # auto scrolling if text does not fit
```

Set the label to auto roll from right to left and vice versa if the text does not fit in the display.

```python
stat_line.set_width(hres)
stat_line.set_align(lv.TEXT_ALIGN_LEFT)                                                      # align text left
```

Set the width to full screen resolution, and align text to the left.

```python
stat_line.set_style_bg_color(lv_color(0xD00000), lv.PART_MAIN | lv.STATE_DEFAULT)    # background #000088
stat_line.set_style_bg_opa(lv.OPA_COVER, lv.PART_MAIN | lv.STATE_DEFAULT)            # 100% background opacity
stat_line.set_style_text_color(lv_color(0xFFFFFF), lv.PART_MAIN | lv.STATE_DEFAULT)  # text color #FFFFFF
```

Set background color to red, text color to white, opacity to 100%.

```python
stat_line.set_text("Tasmota")
```

Set the text of the label.

```python
stat_line.refr_size()                                                                # new in LVGL8
stat_line.refr_pos()                                                                 # new in LVGL8
```

The latter is new in LVGL8, and tells the widget to update its size and position, that we will use right after to position other widgets.
Please note that the actual display is asynchronous. We describe the objects, in whatever order, they will be all displayed at once.

### Create a style

```python
#- create a style for the buttons -#
btn_style = lv_style()
btn_style.set_radius(10)                        # radius of rounded corners
btn_style.set_bg_opa(lv.OPA_COVER)              # 100% backgrond opacity
if f20 != nil btn_style.set_text_font(f20) end  # set font to Montserrat 20
btn_style.set_bg_color(lv_color(0x1fa3ec))      # background color #1FA3EC (Tasmota Blue)
btn_style.set_border_color(lv_color(0x0000FF))  # border color #0000FF
btn_style.set_text_color(lv_color(0xFFFFFF))    # text color white #FFFFFF
```

We create a `lv_style` object and associate some attributes. This works similarly to CSS styles. This style sets background color to Tasmota button blue, text to white, opacity to 100%, font to Montserrat 20 and corner rounding to 1 pixel (10 decipixels).

### Create the buttons

```python
home_btn = lv_btn(scr)                            # center button
home_btn.set_pos(120,vres-40)
home_btn.set_size(80, 30)
home_btn.add_style(btn_style, lv.PART_MAIN | lv.STATE_DEFAULT)
home_label = lv_label(home_btn)
home_label.set_text(lv.SYMBOL_OK)                 # set text as Home icon
home_label.center()
```

Finally create a `lv_btn` object with parent `scr`, set its size and position, add the previously defined style and set its text.

LVGL provides some pre-defined symbols like `lv.SYMBOL_OK`.

## How to compile

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

## What's implemented and not implemented

What's implemented currently:

* LVGL 8.0.2
* All standard LVGL widgets are available, most of extras
* Styles
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
* Styles garbage collection is not done, which means that creating lots of styles leads to memoly leak
* multi-screens display - I don't know of a single ESP32 based device with multi-screens
* Bidirectional fonts - unless there is strong demand
* LVGL tasks - Berry provides all the necessary tools for task scheduling

## Converting C LVGL to Berry

Simply speaking, you can convert most constants from their C equivalent to berry by just changing the `LV_` prefix to `lv.`.

Example: `LV_SYMBOL_OK` becomes `lv.SYMBOL_OK`

Berry provides an object model to `lv_object` and sub-classes for widhets like `lv_btn`, `lv_label`... To create an object, just instantiate the class: `lv_btn(parent)`

`lv_style` is created independantly.

`lv_color` takes an 24 bits 0xRRGGB as parameter, or a pre-defined color like `lv.BLUE`

## Goodies

You get a free Tasmota logo like this:

```python
# start the display
lv.start()

# set background color to blue
scr = lv.scr_act()
scr.set_style_bg_color(lv_color(lv.COLOR_BLUE), lv.PART_MAIN | lv.STATE_DEFAULT)

# create a lv_img object and set it to Tasmota logo
logo = lv_img(scr)
logo.set_tasmota_logo()
logo.center()
```

![screenshot-1618843384](https://user-images.githubusercontent.com/49731213/115389330-3ee56f00-a1dd-11eb-9925-bc91a1d3cf89.png)

The logo is is black, with anti-aliasing and transparency. You can now manipulate the logo: change zoom, rotate or recolor.

```python
# recolor logo to white
logo.set_style_img_recolor_opa(255, lv.PART_MAIN | lv.STATE_DEFAULT)
logo.set_style_img_recolor(lv_color(lv.COLOR_WHITE), lv.PART_MAIN | lv.STATE_DEFAULT)

# zoom by 125% - 100% is 256, so 125% is 320
logo.set_zoom(300)

# rotate by 30 degrees - or 300 deci-degrees
logo.set_angle(300)
```

![screenshot-1618843394](https://user-images.githubusercontent.com/49731213/115389410-5886b680-a1dd-11eb-9b9f-bb901268aeec.png)

Example of animation:

```
cur_zoom = 200
cur_incr = 5
def animate_logo()
  cur_zoom += cur_incr
  if cur_zoom > 300 cur_incr = - cur_incr end
  if cur_zoom < 200 cur_incr = - cur_incr end
  logo.set_zoom(cur_zoom)
  tasmota.set_timer(100, animate_logo)
end
animate_logo()
```

## Tech details

The code size impact is quite significant, so you probably need partitions with code at least set to 1856KB. Doing so leaves 320KB for file system on 4MB flash.

Most of Berry code is solidified in Flash, so the initial RAM footpring is very low (a few KB).

### Generating Berry-LVGL mapping

There is an internal code generator to convert LVGL data structures, constants and functions to Tasmota/Berry code. Each time a change is made in LVGL or its mapping, you need to run the following (the messages are normal and show it is sucessful):

```bash
> cd tools/lv_berry
> python3 convert.py
  // Skipping unsupported return type: lv_group_user_data_t *
  // Skipping unsupported return type: lv_indev_t *
  // Skipping unsupported return type: lv_disp_t *
  // Skipping unsupported return type: lv_style_list_t *
  // Skipping unsupported return type: lv_obj_user_data_t *
  // Skipping unsupported return type: const lv_font_t *
  // Skipping unsupported return type: lv_text_decor_t
  // Skipping unsupported return type: const lv_font_t *
  // Skipping unsupported return type: const lv_anim_path_t *
  // Skipping unsupported return type: const char **
  // Skipping unsupported return type: lv_calendar_date_t *
  // Skipping unsupported return type: lv_calendar_date_t *
  // Skipping unsupported return type: lv_calendar_date_t *
  // Skipping unsupported return type: lv_calendar_date_t *
  // Skipping unsupported return type: const char **
  // Skipping unsupported return type: const char **
  // Skipping unsupported return type: lv_img_dsc_t *
  // Skipping unsupported return type: lv_chart_series_t *
  // Skipping unsupported return type: lv_chart_cursor_t *
  // Skipping unsupported return type: const char **
  // Skipping unsupported return type: lv_style_list_t *
  // Skipping unsupported return type: lv_img_src_t
  // Skipping unsupported return type: lv_draw_mask_res_t
  // Skipping unsupported return type: lv_img_dsc_t *
| callback types['lv_group_focus_cb', 'lv_event_cb', 'lv_signal_cb', 'lv_design_cb', 'lv_gauge_format_cb']
```

Then Berry mapping to C needs to be updated:

```bash
> cd lib/libesp32/Berry
> make prebuild
[Prebuild] generate resources
done
```

Finally compile Tasmota.

### LVGL mapping definition

The reference model for LVGL is contained in the following files. They were manually built for this first version, but we will work in automating it (similarly to MicroPython):

- `tools/lv_berry/lv_module.h` contains all LVGL constants (enum) and are added to `module lvgl`
- `tools/lv_berry/lv_symbols.h` contains the font symbols strings (manually built), they are added to `module lvgl`
- `tools/lv_berry/lv_widgets.h` contains the function signatures of all LVGL APIs in a single file (large file)

The file generated are:

- `tasmota/lvgl_berry/be_lv_c_mapping.h` which contains the signatures used by Tasmota to map LVGL to Berry (large file). The mapping contains the LVGL object structure, and for each function the C API address, expected types of parameters and return type.
- `lib/libesp32/Berry/default/be_lvgl_widgets_lib.c` Berry C definition of classes
- `lib/libesp32/Berry/default/be_lv_lvgl_module.c` Berry C definition of `module lvgl` with core functions and constants
