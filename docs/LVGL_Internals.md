# LVGL - Internals

Below are notes about the LVGL-Berry mapping in Tasmota. You will find information for curious people and maintainers.

## Build system

Berry mapping to LVGL is entirely automated.

Most of the components are generated C code from the LVGL's C source code, similar to MicroPython approach.


**Phase 1: Parse LVGL source**

This first phase parses most C headers from the LVGL source tree and generates two files:
- `lv_enum.h` containing all the `enum` values from LVGL (constants)
- `lv_funcs.h` containing all the functions of the LVGL API normalized to 1 function per line, and with cleaned argument signature.

```
(in folder Tasmota/lib/libesp32_lvgl/lv_berry/tools)

❯ python3 preprocessor.py

(no output)
```

**Phase 2: Generate automatic Berry mapping**

From the two files created in the previous step, all the requires C files are created for the Berry mapping.

```
(in folder Tasmota/lib/libesp32_lvgl/lv_berry/tools)

> python3 convert.py
| callback types['lv_group_focus_cb', 'lv_event_cb', 'lv_constructor_cb', 'lv_layout_update_cb', 'lv_obj_tree_walk_cb', 'lv_theme_apply_cb', 'lv_color_filter_cb']
```

The output should look as above, and indicates the C function that have been ignored (if any) if their return type is listed above. It also lists the callback types supported.

**Phase 3: Generate the Berry pre-compiled stubs**

This phase is specific to Berry pre-compiled modules and classes.

```
(in folder Tasmota/lib/libesp32/berry)

> ./gen.sh

(no output)
```

**Phase 4: compile Tasmota using platform.io as usual**

# `lv` module

Tasmota automatically and implicitly imports `lvgl` module if compiled with LVGL.

```
import lvgl as lv
```

## Constants

The `lv` module is a placeholder for all LVGL constants, the equivalent of C enums.

As a rule of thumb, all C constants are mapped with a similar name. Just replace `LV_<name>` with `lv.<name>`.

Example: C API `LV_LABEL_ALIGN_LEFT` becomes in Berry `lv.LABEL_ALIGN_LEFT`

## Implementation

The C enum constants are all compiled in a single file `tools/lv_berry/lv_module.h`. Only names are listed, the actual values are retrieved by the C compiler at runtime (which avoids many mistakes).

Internally constants are handled by a virtual member in lvgl module. The module `lvgl` has a `member()` function that is called when the Berry runtime does not know the member name.

The search happens in `lv0_member()` which first searches for a static member name, and if not found, looks for a widget class name.

Constants are put in a C table in `lib/libesp32/Berry/default/be_lv_lvgl_module.c` as `lv0_constants[]`. The table is sorted by member name to allow for fast binary search (dichotomy).

```C

const be_constint_t lv0_constants[] = {

    { "ALIGN_CENTER", LV_ALIGN_CENTER },
    { "ALIGN_IN_BOTTOM_LEFT", LV_ALIGN_IN_BOTTOM_LEFT },
   [...]
    { "WIN_PART_SCROLLBAR", LV_WIN_PART_SCROLLBAR },
    { "YELLOW", 16776960 },
};
```

## Colors

An exception for LVGL colors, they are defined as 32 bits RGB values as follows, and not based on their C representation:

```C
COLOR_WHITE=0xFFFFFF
COLOR_SILVER=0xC0C0C0
COLOR_GRAY=0x808080
COLOR_BLACK=0x000000
COLOR_RED=0xFF0000
COLOR_MAROON=0x800000
COLOR_YELLOW=0xFFFF00
COLOR_OLIVE=0x808000
COLOR_LIME=0x00FF00
COLOR_GREEN=0x008000
COLOR_CYAN=0x00FFFF
COLOR_AQUA=0x00FFFF
COLOR_TEAL=0x008080
COLOR_BLUE=0x0000FF
COLOR_NAVY=0x000080
COLOR_MAGENTA=0xFF00FF
COLOR_PURPLE=0x800080
```

Example: `lv.COLOR_RED`

# Widgets classes

Although LVGL is C code and is not formally object oriented, LVGL widget follow an inheritance model. Each widget is a virtual subclass of `lv_obj` structure.

Berry builds an actual Object Oriented class system, with a base class `lv_obj` and subclasses.

The class names supported are defined in `convert.py` and are currently:

```
'lv_arc', 'lv_bar', 'lv_btn', 'lv_btnmatrix', 'lv_calendar', 'lv_canvas', 'lv_chart', 'lv_checkbox',
'lv_cont', 'lv_cpicker', 'lv_dropdown', 'lv_gauge', 'lv_img', 'lv_imgbtn', 'lv_keyboard', 'lv_label', 'lv_led', 'lv_line',
'lv_linemeter', 'lv_list', 'lv_msgbox', 'lv_objmask', 'lv_templ', 'lv_page', 'lv_roller', 'lv_slider', 'lv_spinbox',
'lv_spinner', 'lv_switch', 'lv_table', 'lv_tabview', 'lv_textarea', 'lv_tileview', 'lv_win'
```

Additional 'special' classes are (they do not inherit from `lv_obj`):

```
'lv_obj', 'lv_group', 'lv_style', 'lv_indev'
```

## Parsing

The parsing is done by `convert.py` which parses `tools/lv_berry/lv_widgets.h`. This file contains all the C function signatures as single lines. `convert.py` checks if the types are supported and converts it as a Berry signature.

The resulting signatures are used to generate class stubs for all Berry classes in `lib/libesp32/Berry/default/be_lvgl_widgets_lib.c` and the Berry signatures are in `tasmota/lvgl_berry/be_lv_c_mapping.h`


Example:

The C signature:

```
bool lv_obj_area_is_visible(const lv_obj_t * obj, lv_area_t * area);
```

is recognized to be part of `lv_obj` class (by prefix) and has the following signature:

```
{ "area_is_visible", (void*) &lv_obj_area_is_visible, "b", "(lv_obj)(lv_area)" },
```

Decomposed as:
- "area_is_visible": name of the Berry method
- (void*) &lv_obj_area_is_visible: pointer to the C implementation
- "b": return type, here boolean
- "(lv_obj)(lv_area)": input types, 2 arguments of classes lv_obj and lv_area

Other example:

```
void lv_btnmatrix_set_align(lv_obj_t * btnm, lv_label_align_t align);  

{ "set_align", (void*) &lv_btnmatrix_set_align, "", "(lv_obj)i" },
```

The parsing of the signature is done in `be_check_arg_type()`

Input and output types are:

- "b": boolean
- "s": string
- "i": int (signed 32 bits)- ".": any type
- "&<n>": where n is a digit, Berry callback by class (see below)
- "(lv\_<classname>)": an instance of lv\_<classname>. Note if you pass `0` (NULL) to a class argmunent it is accepted without warning.

Note: any missing argument or `nil` argument is converted to `0`.

In case of an argument mismatch, a warning is printed but the call is still proceed.

**Warning**: you can easily crash Tasmota if you send wrong types arguments.

## Widgets instanciation

Instanciation of a widget is marked as a specific signature. The return type is prefixed with `+`:

```
lv_obj_t * lv_canvas_create(lv_obj_t * par, const lv_obj_t * copy);

{ "create", (void*) &lv_canvas_create, "+lv_canvas", "(lv_obj)(lv_obj)" },
```

All widgets constructor always take 2 arguments, the first is the parent object, the second is the copy object (generally null or ignored)

Example:

```
scr = lv.scr_act()
log = lv_label(scr)   # scr is parent object of log
```

Internally, widget constructors call `lvx_init_2()`. LVGL object are allocated by LVGL, the Berry object only contains a reference to the C structure (a pointer). These objects can be garbage collected without any impact.


`lv_obj` and widget constructors also accept a specific form: `log2 = lv_label(-1, log)` which just creates a second reference to the same LVGL object - it is mostly used internally to dynamically create an instance from a returned C pointed.

## Callbacks

Callbacks are a challenge in Berry. A callback is only a C pointer to a function and does not natively hold any other information. However we would like to match a single C address to multiple Berry closures.

We take into account the fact that the first argument of any LVGL callback has always an instance as first argument, from the type list: `'lv_group_focus_cb', 'lv_event_cb', 'lv_signal_cb', 'lv_design_cb', 'lv_gauge_format_cb'`

We define 5 different C functions with 5 distinct addresses, one for each callback type. Then we use the first argument to dispatch the call to the appropriate Berry closure.

Here is the call used at startup:

```python
import lvgl as lv

# for each callback type, mapping between first argument and closure
_lvgl_cb = [ {}, {}, {}, {}, {}, {} ]

# for each callback type, mapping between first argument and the actual Berry object with the correct type (C arguments are not explicitly typed)
_lvgl_cb_obj = [ {}, {}, {}, {}, {}, {} ]

def _lvgl_cb_dispatch(idx, obj, v1, v2, v3, v4)
  var func = _lvgl_cb[idx].find(obj)
  var inst = _lvgl_cb_obj[idx].find(obj)
  if func != nil
    return func(inst, v1, v2, v3, v4)
  end
  return nil
end
```

## Styles

`lv_style` is not a subclass of `lv_obj` but uses a similar mechanism to map the members.

Main difference, it uses a distinct constructor `lvs_init()`.

Note: `lv_style` needs to allocate memory and must not be garbage collected. For this reason `lv_style` allocates static memory which is never freed. Be aware that it may be a cause of memory leak (although not very likely).

## Colors

`lv_color` is a simple class that maps RGB 32 bits colors (as 32 bits int) to the internal representation of colors (usually 16 bits).

Don't be surprised that getting back a value is the 16 bits color converted to 32 bits - rounding errors may occur:

```
[Berry Console]
> c = lv_color(0x808080)
> c
lv_color(0xff838183 - native:0x1084)
```

Note:

- 0xff838183 - is the 32 bits color, with alpha channel (opaque)
- 0x1084 - is the native internal representation as 16 bits color with swapped bytes

## Groups

`lv_group` behaves like `lv_obj` but does not inherit from it.

## Indev

Indev or 'Input Device' is a simple class wrapper to handle touch screens and input buttons. It is similar to `lv_obj` but uses a simple constructor `lv0_init()` that just wraps the C pointer into the Berry instance.

