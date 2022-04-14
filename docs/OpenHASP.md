# OpenHASP :material-cpu-32-bit:

!!! info "This feature is experimental"

Tasmota is happy to support OpenHASP format, which allows to describe rich graphics interfaces using simple JSON templates. OpenHASP support leverages the power of [LVGL](https://tasmota.github.io/docs/LVGL/) and the [Berry language](https://tasmota.github.io/docs/Berry/), but doesn't need to code nor learn the LVGL API.

This feature is heavily inspired from @franvoie's [OpenHASP project](https://github.com/HASwitchPlate/openHASP).

## Minimal requirements

**Hardware**: OpenHASP is supported on all ESP32 variants, and requires a display configured with universal display (using `display.ini` or `autoconf`). You should see a splash screen at startup.

Currently **PSRAM** is required to run OpenHASP. The core engine is compiled and loaded in memory, which makes it unsuitable for ESP32 without PSRAM. Future versions 

**Firmware**: you need a tasmota firmware with LVGL support, like `tasmota32-lvgl` or a self-compiled version.

## Quick tour

You can see OpenHASP in action in a couple of minutes.

Upload in your ESP32 file system the following files, from: https://github.com/arendst/Tasmota/tree/development/tasmota/berry/openhasp

  - `openhasp_widgets.tapp` (contains widgets for wifi, logging and general info)
  - `robotocondensed_latin1.tapp` (contains additional fonts)
  - `openhasp.tapp` (contains the core OpenHASP engine)
  - `files.jsonl` (contains a sample definition)

Restart and enjoy. You should see the following screen, and click on buttons to switch to the second screen:

![openhasp1](https://user-images.githubusercontent.com/49731213/162054703-376955c1-233b-4a60-aaae-8a316829325e.png)

![openhasp2](https://user-images.githubusercontent.com/49731213/162054725-57ec6a25-f250-4404-b013-7d54b37d497f.png)

### Understanding the template

OpenHASP automatically loads the template from a file named `pages.jsonl`. This file contains JSON Lines, i.e. a single JSON document per line. Each line describes an element on the screen. Elements are groupes into pages.

Page `0` contains objects that are displayed on all screens. They are typically used for headers and menus.

The lines below define the header label (red background) and the clock and wifi widgets.

``` json
{"page":0,"comment":"---------- Upper stat line ----------"}

{"id":11,"obj":"label","x":0,"y":0,"w":320,"pad_right":90,"h":22,"bg_color":"#D00000","bg_opa":255,"radius":0,"border_side":0,"text":"Tasmota","text_font":"montserrat-20"}

{"id":15,"obj":"lv_wifi_arcs","x":291,"y":0,"w":29,"h":22,"radius":0,"border_side":0,"bg_color":"#000000","line_color":"#FFFFFF"}
{"id":16,"obj":"lv_clock","x":232,"y":3,"w":55,"h":16,"radius":0,"border_side":0}
```

The lines below describe the 3 buttons at the bottom, and their respective actions.

``` json
{"comment":"---------- Bottom buttons - prev/home/next ----------"}
{"id":101,"obj":"btn","x":20,"y":210,"w":80,"h":25,"action":"prev","bg_color":"#1fa3ec","radius":10,"border_side":1,"text":"\uF053","text_font":"montserrat-20"}
{"id":102,"obj":"btn","x":120,"y":210,"w":80,"h":25,"action":"back","bg_color":"#1fa3ec","radius":10,"border_side":1,"text":"\uF015","text_font":"montserrat-20"}
{"id":103,"obj":"btn","x":220,"y":210,"w":80,"h":25,"action":"next","bg_color":"#1fa3ec","radius":10,"border_side":1,"text":"\uF054","text_font":"montserrat-20"}
```

Page `1` is the default page, and contains different widgets types: labels and arc. The values are changed at runtime via Tasmota's rule system, see below for details.

``` json
{"page":1,"comment":"---------- Page 1 ----------"}
{"id":0,"bg_color":"#0000A0","bg_grad_color":"#000000","bg_grad_dir":1,"text_color":"#FFFFFF"}

{"id":2,"obj":"arc","x":20,"y":65,"w":80,"h":100,"border_side":0,"type":0,"rotation":0,"start_angle":180,"end_angle":0,"start_angle1":180,"value_font":12,"value_ofs_x":0,"value_ofs_y":-14,"bg_opa":0,"text":"--.-°C","min":200,"max":800,"val":0,"val_rule":"ESP32#Temperature","val_rule_formula":"val * 10","text_rule":"ESP32#Temperature","text_rule_format":"%2.1f °C"}

{"id":5,"obj":"label","x":2,"y":35,"w":120,"text":"Temperature","align":1}

{"id":10,"obj":"label","x":172,"y":35,"w":140,"text":"MPU","align":0}
{"id":11,"obj":"label","x":172,"y":55,"w":140,"text":"x=","align":0,"text_rule":"MPU9250#AX","text_rule_format":"x=%6.3f","text_rule_formula":"val / 1000"}
{"id":12,"obj":"label","x":172,"y":75,"w":140,"text":"y=","align":0,"text_rule":"MPU9250#AY","text_rule_format":"y=%6.3f","text_rule_formula":"val / 1000"}
{"id":13,"obj":"label","x":172,"y":95,"w":140,"text":"z=","align":0,"text_rule":"MPU9250#AZ","text_rule_format":"z=%6.3f","text_rule_formula":"val / 1000"}
```

Page `2` contains custom widgets as Berry code. These widgets are imported within `openhasp_widgets.tapp`

``` json
{"page":2,"comment":"---------- Page 2 ----------"}
{"id":0,"bg_color":"#0000A0","bg_grad_color":"#000000","bg_grad_dir":1,"text_color":"#FFFFFF"}

{"comment":"---------- Wifi status ----------"}
{"id":20,"obj":"lv_wifi_graph","x":257,"y":25,"w":60,"h":40,"radius":0}
{"id":21,"obj":"lv_tasmota_info","x":3,"y":25,"w":251,"h":40,"radius":0}
{"id":22,"obj":"lv_tasmota_log","x":3,"y":68,"w":314,"h":90,"radius":0,"text_font":12}
```

Finally, the following line allows to run arbitrary Berry code.

``` json
{"comment":"--- Trigger sensors every 2 seconds ---","berry_run":"tasmota.add_cron('*/2 * * * * *', def () tasmota.publish_rule(tasmota.read_sensors()) end, 'oh_every_5_s')"}
```

The code trigger a read of sensors every 2 seconds and publish the JSON result to be parsed by the rule engine.

``` berry
tasmota.add_cron('*/2 * * * * *', def () tasmota.publish_rule(tasmota.read_sensors()) end, 'oh_every_5_s')
```

## OpenHASP reference

### Integration to Berry

#### objects as `p<x>b<y>`

Each OpenHASP widget is mapped to a global variable of name `p<x>b<y>`. Example:  `p1b10`. Such objects can be directly used via their attributes.

Example:

```
p1b10.x += 10
p1b10.text = "Hello"
print(p1b10.w)
```

#### pages as `p<x>`

Pages objects are mapped to a global variable of name `p<x>`.

Changing pages can be done with `p2.show()`

#### additional parsing

OpenHASP parses all lines from the file `pages.jsonl`. You can dynamically add new objects as JSON with `openhasp.parse(<json>)`. This functions takes a single json line. It is highly recommended to specify the page id in the json, otherwise the object is added to the current page.


### Pages

Pages object are identified by object if `0`. Example:

``` json
{"page":1,"id":0,"bg_color":"#0000A0","bg_grad_color":"#000000","bg_grad_dir":1,"text_color":"#FFFFFF"}
```

Internally OpenHASP pages are implemented with LVGL screens, i.e. a parent object.

Page `0` is a special page that is displays over every screens. It is the perfect place to put navigation menus. It is implement as `lv.layer_top()`.

Page `1` is always present and the default page.

Attributes specifis to page|Details
:---|:---
`prev`|(int) target page number when pressing PREV button
`next`|(int) target page number when pressing NEXT button
`home`|(int) target page number when pressing HOME button
  |And generally all object attributes

### Classes of widgets

Attribute `"obj"` can take the following values:

OpenHASP Class|Embedded LVGL class
:---|:---
`obj`|`lv.obj`
`btn`|`lv.btn`
`switch`|`lv.switch`
`checkbox`|`lv.checkbox`
`label`|`lv.label`
`spinner`|`lv.spinner`
`line`|`lv.line`
`img`|`lv.img`
`dropdown`|`lv.dropdown`
`roller`|`lv.roller`
`btnmatrix`|`lv.btnmatrix`
`bar`|`lv.bar`
`slider`|`lv.slider`
`arc`|`lv.arc`
`textarea`|`lv.textarea`

You can also import custom widget as long as they inherit from `lv.obj` and the class name matches the module name.

Example: `"obj":"lv_wifi_graph"` will trigger the followin:
- `import lv_wifi_graph`
- instanciation of `lv_wifi_graph(parent)` object
- if successful, it can be used like a typical OpenHASP object

### Attributes

Below are the standard attributes:

Attribute name|LVGL equivalent|Details
:---|:---|:---
`comment`||Ignored
`page`|0 to 15<br>Parent screen object|Page id for the current object.<br>If not present, takes the value of the current page
`id`|0..255|Id number of the object. Id `0` means the entire page.<br>A global berry object is created with name `p<page>b<id>` (ex: `p1b10`)
`obj`|widget class|Class of the widget (see above).<br>If not present, the entire JSON line is ignored
`action`|`"next"`, `"prev"`, `"back"` or `"p<x>"`|Switch to page when the object is touched
`x`|`x`|X coordinate of top left corner
`y`|`y`|Y coordinate of top left corner (Y is pointing down)
`h`|`height`|Height in pixels
`w`|`width`|Width in pixels
`hidden`|flag `lv.OBJ_FLAG_HIDDEN`|Object is hidden (bool)
`enabled`|flag `lv.OBJ_FLAG_CLICKABLE`|Object is touch/clickable (bool)
`click`|flag `lv.OBJ_FLAG_CLICKABLE`|Synonym of `enabled`. Object is touch/clickable (bool)
`toggle`|flag `lv.STATE_CHECKED`|When enabled, creates a toggle-on/toggle-off button. If false, creates a normal button.<br>TODO check if bool or string
`radius`|`style_radius`|Radius of rounded corners
`bg_opa`|`style_bg_opa`|Opacity: `0` is transparent, `255` is opaque
`bg_color`|`style_bg_color`|Color of background, format is `#RRGGBB`
`bg_grad_color`|`style_bg_grad_color`|Color of background gradient
`bg_grad_dir`|`style_bg_grad_dir`|Gradient direction<br>`0`: none<br>`1`: Vertical (top to bottom) gradient<br>`2`: Horizontal (left to right) gradient
`border_side`|`style_border_side`|Borders to be displayed (add all values)<br>`0`: none<br>`1`: bottom<br>`2`: top<br>`4`: left<br>`8`: bottom<br>`15`: full (all 4)
`border_width`|`style_border_width`|Width of border in pixels
`border_color`|`style_border_color`|
`line_color`|`style_line_color`|Color of line
`line_width`|`style_line_width`|
`line_width1`|`style_arc_width`|Sets the line width of an `arc` indicator part
`pad_left`|`style_pad_left`|Left padding in pixels
`pad_right`|`style_pad_right`|Right padding in pixels
`pad_top`|`style_pad_top`|Top padding in pixels
`pad_bottom`|`style_pad_bottom`|Bottom padding in pixels
`pad_all`|`style_pad_all`|Sets all 4 padding values at once (Write-only)

Attributes related to text content

Attribute name|LVGL equivalent|Details
:---|:---|:---
`text`|`text`|Sets the inner text of the object.<br>If the native LVGL object does not support text (like `lv.btn`), a `lv.label` sub-object is automatically created.
`value_str`|`text`|Synonym of `text`
`align`|`style_text_align`|Set alignment for text<br>`0` or `"left"`: `lv.TEXT_ALIGN_LEFT`<br>`1` or `"center"`: `lv.TEXT_ALIGN_CENTER`<br>`2` or `"right"`: `lv.TEXT_ALIGN_RIGHT`
`text_font`|`style_text_font`|Sets the font name and size for the text.<br>If `int`, the default font is `robotocondensed_latin1` and the parameter sets the size<br>If `string`, the font is in the form `<font_name>-<font_size>`, example: `montserrat-20` or in the form `A:<font_file>` to load a binary font from the file-system.
`value_font`|`style_text_font`|Synonym of `text_font`
`text_color`|`style_text_color`|Sets the color of text
`value_color`|`style_text_color`|Synonym of `text_color`
`value_ofs_x`|`x` of sub-label|Sets the X offet in pixels within the object
`value_ofs_y`|`y` of sub-label|Sets the Y offet in pixels within the object
`text_rule`||Link the text to a Tasmota rule, see below
`text_rule_formula`||Link the text to a Tasmota rule, see below
`text_rule_format`||Link the text to a Tasmota rule, see below

Attributes related to values

Attribute name|LVGL equivalent|Details
:---|:---|:---
`min`|`range`|Set the minimum value of range (int)
`max`|`range`|Set the maximum value of range (int)
`val`|`value`|Set the value (int)
`val_rule`||Link a value to a Tasmota rule, see below
`val_rule_formula`||Link a value to a Tasmota rule, see below

Attributes specific to `arc`

Attribute name|LVGL equivalent|Details
:---|:---|:---
`start_angle`|`bg_start_angle`|Start angle of the arc background.<br>Angles are in degrees in [0;360] range.<br>Zero degrees is at the middle right (3 o'clock) of the object and the degrees are increasing in clockwise direction.
`end_angle`|`bg_end_angle`|End angle of the arc background.
`start_angle1`|`start_angle`|Start angle of the arc indicator.
`end_angle1`|`end_angle`|End angle of the arc indicator.
`rotation`|`rotation`|Offset to the 0 degree position
`type`|`mode`|Sets the arc mode<br>`0`: `lv.ARC_MODE_NORMAL`<br>`1`: `lv.ARC_MODE_REVERSE`<br>`2`: `lv.ARC_MODE_SYMMETRICAL`
`pad_top2`|`style_pad_top`|Top padding for `lv.PART_KNOB` part
`pad_bottom2`|`style_pad_bottom`|Bottom padding for `lv.PART_KNOB` part
`pad_left2`|`style_pad_left`|Left padding for `lv.PART_KNOB` part
`pad_right2`|`style_pad_right`|Right padding for `lv.PART_KNOB` part
`pad_all2`|`style_pad_all`|Set all 4 padding for `lv.PART_KNOB` part (write-only)
`radius2`|`style_radius`|Radius for `lv.PART_KNOB` part


Attributes specific to `img`

Attribute name|LVGL equivalent|Details
:---|:---|:---
`src`|`src`|Path to the image in the file-system
`image_recolor`|`style_image_recolor`|Color used to recolor the image
`image_recolor_opa`|`style_image_recolor_opa`|Opacity of image recoloring

Attributes specific to `spinner`

Attribute name|LVGL equivalent|Details
:---|:---|:---
`angle`||The length of the spinning segment in degrees - cannot be changed after initial value
`speed`||The time for 1 turn in ms - cannot be changed after initial value

## Tasmota extensions

### Update sensor value via rules

You can automatically adjust attributes `val` and `text` from sensor values via a simple rule engine.

attribute|description
:---|:---
val\_rule|Rule pattern to trigger an update of the `val` attribute.<br>Example: `"val_rule":"ESP32#Temperature"`
val\_rule\_formula|Optional expression (using Berry) to transform the value extracted from the rule to the value pushed to `val`. This typically allows to adjust ranges of values.<br>Input value is always converted to `float` not `int`. The input value is named `val`.<br>Example: `"val_rule_formula":"val / 1000"` 

Changing a `text` attribute from rules:

attribute|description
:---|:---
text\_rule|Rule pattern to trigger an update of the `text` attribute.<br>Example: `"text_rule":"ESP32#Temperature"`
text\_rule\_formula|Optional expression (using Berry) to transform the value extracted from the rule to the value pushed to `val`. This typically allows to adjust ranges of values.<br>Input value is always converted to `float` not `int`. The input value is named `val`.<br>Example: `"val_rule_formula":"val * 10"`
text\_rule\_format|String format of the result string. The format uses Berry's `string.format()`, which is a subset of `printf` format.<br>Example: `"text_rule_format":"%2.1f °C"`

### React to user actions

Every time the user touches an active element on the screen, OpenHASP publishes internal events you can listen and react to. For example if you press a button `p1b10`, OpenHASP publishes an event `{"hasp":{"p1b10":"up"}}` when the button is released. You can easily create a rule to react to this event.

Example:

``` berry
tasmota.add_rule(hasp#p1b10==up, / -> print("Button p1b10 pressed"))
```

### Run arbitrary Berry code

Inserting an attribute `berry_run` to any object will compile and run the embedded Berry code during widget initialization.

One common use is to trigger sensors read every 2 seconds:

``` json
{"comment":"--- Trigger sensors every 2 seconds ---","berry_run":"tasmota.add_cron('*/2 * * * * *', def () tasmota.publish_rule(tasmota.read_sensors()) end, 'oh_every_5_s')"}
```
