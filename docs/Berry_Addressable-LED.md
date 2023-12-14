![Leds_animator](https://github.com/tasmota/docs/assets/49731213/1b4db455-938a-4f89-a3b6-69886be1ce6f)# Addressable LEDs in Berry

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

![Uploading Leds_animat<svg width="3443" height="752" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" overflow="hidden"><defs><clipPath id="clip0"><path d="M1265.36 1275.7 1133.66 1547 862.369 1415.29 994.07 1144Z" fill-rule="nonzero" clip-rule="nonzero"/></clipPath><clipPath id="clip1"><path d="M1265.36 1275.7 1133.66 1547 862.369 1415.29 994.07 1144Z" fill-rule="evenodd" clip-rule="evenodd"/></clipPath><clipPath id="clip2"><path d="M1265.36 1275.7 1133.66 1547 862.369 1415.29 994.07 1144Z" fill-rule="evenodd" clip-rule="evenodd"/></clipPath></defs><g transform="translate(-737 -1026)"><g><rect x="1856.5" y="1577.5" width="238" height="89" stroke="#2F5597" stroke-width="6.875" stroke-linecap="butt" stroke-linejoin="round" stroke-miterlimit="10" stroke-opacity="1" fill="none"/><rect x="747" y="1032" width="2946" height="738" stroke="#000000" stroke-width="10.3125" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none"/><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 819.292 1295)">“fast_loop”</text><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 806.963 1361)">every 20ms</text><g clip-path="url(#clip0)"><g clip-path="url(#clip1)"><g clip-path="url(#clip2)"><path d="M1020.86 1476.52C1025.48 1474.92 1028.37 1469.69 1026.91 1464.79L1013.96 1427.43C1071.72 1452.32 1139 1427.37 1166.44 1370.85 1187.57 1327.33 1180.07 1275.16 1147.06 1239.58 1114.33 1204.13 1062.91 1192.09 1017.88 1209.34 1013.12 1211.22 1010.51 1216.59 1012.68 1221.48 1014.56 1226.23 1019.93 1228.84 1024.68 1226.96 1066.36 1210.88 1113.73 1224.79 1140 1260.59 1166.56 1296.53 1165.59 1346 1137.9 1380.74 1110.07 1415.77 1062.3 1427.85 1021.35 1410.06L1059.83 1396.97C1064.87 1395.22 1067.47 1389.85 1065.59 1385.1 1063.71 1380.34 1058.48 1377.45 1053.72 1379.34L994.534 1399.84C992.435 1400.57 990.627 1402.13 989.384 1403.97L989.11 1404.54 988.698 1405.39 988.286 1406.23 988.295 1406.94C988.158 1407.22 988.303 1407.64 988.166 1407.92 987.9 1409.19 988.336 1410.45 988.772 1411.71L1009.27 1470.9C1010.74 1475.8 1016.11 1478.4 1020.86 1476.52Z" fill="#000000" fill-rule="nonzero" fill-opacity="1"/></g></g></g><rect x="1201.5" y="1208.5" width="577" height="250" stroke="#000000" stroke-width="6.875" stroke-linecap="butt" stroke-linejoin="round" stroke-miterlimit="10" stroke-opacity="1" fill="none"/><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 1233.92 1320)">a. Clear frame</text><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 1233.92 1386)">b. Apply back_color</text><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 1233.92 1166)">1. Initialization</text><rect x="1820.5" y="1212.5" width="577" height="250" stroke="#000000" stroke-width="6.875" stroke-linecap="butt" stroke-linejoin="round" stroke-miterlimit="10" stroke-opacity="1" fill="none"/><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 1853.09 1291)">Run each registered </text><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 1853.09 1357)">animator and update </text><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 1853.09 1423)">all parameters</text><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 1839 1166)">2. Run Animators</text><rect x="2439.5" y="1212.5" width="577" height="250" stroke="#000000" stroke-width="6.875" stroke-linecap="butt" stroke-linejoin="round" stroke-miterlimit="10" stroke-opacity="1" fill="none"/><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 2472.11 1291)">Run each each </text><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 2472.11 1357)">painter as a layer </text><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 2472.11 1423)">and flatten</text><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 2458.03 1166)">3. Apply Painters</text><path d="M2488.5 1504.5 2683.2 1504.5" stroke="#2F5597" stroke-width="6.875" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd"/><path d="M2488.5 1532.5 2683.2 1532.5" stroke="#2F5597" stroke-width="6.875" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd"/><path d="M2488.5 1559.5 2683.2 1559.5" stroke="#2F5597" stroke-width="6.875" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd"/><path d="M2488.5 1586.5 2683.2 1586.5" stroke="#2F5597" stroke-width="6.875" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd"/><path d="M2488.5 1613.5 2683.2 1613.5" stroke="#FF0000" stroke-width="6.875" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd"/><path d="M2729.94 1511.31 2729.94 1624.03 2723.06 1624.03 2723.06 1511.31ZM2707.49 1537.07 2726.5 1504.48 2745.51 1537.07C2746.47 1538.71 2745.91 1540.82 2744.27 1541.78 2742.63 1542.73 2740.53 1542.18 2739.57 1540.54L2723.53 1513.04 2729.47 1513.04 2713.43 1540.54C2712.47 1542.18 2710.37 1542.73 2708.73 1541.78 2707.09 1540.82 2706.53 1538.71 2707.49 1537.07ZM2745.51 1598.27 2726.5 1630.86 2707.49 1598.27C2706.53 1596.63 2707.09 1594.52 2708.73 1593.56 2710.37 1592.61 2712.47 1593.16 2713.43 1594.8L2729.47 1622.3 2723.53 1622.3 2739.57 1594.8C2740.53 1593.16 2742.63 1592.61 2744.27 1593.56 2745.91 1594.52 2746.47 1596.63 2745.51 1598.27Z" fill="#000000" fill-rule="nonzero" fill-opacity="1"/><path d="M2764.5 1552.5 2959.2 1552.5" stroke="#C55A11" stroke-width="6.875" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd"/><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="46" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 2787.33 1604)">flatten</text><rect x="1841.5" y="1498.5" width="239" height="133" stroke="#2F5597" stroke-width="6.875" stroke-linecap="butt" stroke-linejoin="round" stroke-miterlimit="10" stroke-opacity="1" fill="#FFFFFF" fill-opacity="1"/><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="46" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 1874.27 1560)">animator</text><path d="M1878.5 1578.5 1900.35 1578.5" stroke="#000000" stroke-width="4.58333" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd"/><path d="M1899.5 1600.5 1921.35 1600.5" stroke="#000000" stroke-width="4.58333" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd"/><path d="M0 0 0.000360892 21.7708" stroke="#000000" stroke-width="4.58333" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd" transform="matrix(1 0 0 -1 1878.5 1600.27)"/><path d="M0 0 0.000360892 21.7708" stroke="#000000" stroke-width="4.58333" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd" transform="matrix(1 0 0 -1 1899.5 1600.27)"/><path d="M0 0 0.000360892 21.7708" stroke="#000000" stroke-width="4.58333" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd" transform="matrix(1 0 0 -1 1921.5 1600.27)"/><path d="M0 0 43.7026 22.9167" stroke="#000000" stroke-width="4.58333" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd" transform="matrix(1 0 0 -1 1943.5 1600.42)"/><path d="M0 0 21.8513 21.4652" stroke="#000000" stroke-width="4.58333" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd" transform="matrix(1 0 0 -1 2000.5 1599.97)"/><path d="M2022.5 1578.5 2044.35 1599.97" stroke="#000000" stroke-width="4.58333" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd"/><path d="M2080.5 1540.06 2151.75 1540.06 2151.75 1546.94 2080.5 1546.94ZM2125.98 1524.49 2158.57 1543.5 2125.98 1562.51C2124.34 1563.47 2122.23 1562.91 2121.28 1561.27 2120.32 1559.63 2120.88 1557.53 2122.52 1556.57L2150.02 1540.53 2150.02 1546.47 2122.52 1530.43 2122.52 1530.43C2120.88 1529.47 2120.32 1527.37 2121.28 1525.73 2122.24 1524.09 2124.34 1523.53 2125.98 1524.49Z" fill="#000000" fill-rule="nonzero" fill-opacity="1"/><rect x="2161.5" y="1497.5" width="234" height="168" stroke="#2F5597" stroke-width="6.875" stroke-linecap="butt" stroke-linejoin="round" stroke-miterlimit="10" stroke-opacity="1" fill="none"/><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="46" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 2193.58 1559)">param.</text><path d="M2161.5 1515.5 2187.23 1543.59" stroke="#4472C4" stroke-width="4.58333" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd"/><path d="M0 0 22.4338 19.0349" stroke="#4472C4" stroke-width="4.58333" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd" transform="matrix(-1 0 0 1 2183.93 1543.5)"/><path d="M2158.5 1610.5 2184.23 1638.59" stroke="#4472C4" stroke-width="4.58333" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd"/><path d="M0 0 22.4338 19.0349" stroke="#4472C4" stroke-width="4.58333" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none" fill-rule="evenodd" transform="matrix(-1 0 0 1 2181.93 1638.5)"/><path d="M2094.5 1638.06 2154.28 1638.06 2154.28 1644.94 2094.5 1644.94ZM2128.51 1622.49 2161.1 1641.5 2128.51 1660.51C2126.87 1661.47 2124.76 1660.91 2123.81 1659.27 2122.85 1657.63 2123.41 1655.53 2125.05 1654.57L2152.55 1638.53 2152.55 1644.47 2125.05 1628.43 2125.05 1628.43C2123.41 1627.47 2122.85 1625.37 2123.81 1623.73 2124.77 1622.09 2126.87 1621.53 2128.51 1622.49Z" fill="#000000" fill-rule="nonzero" fill-opacity="1"/><rect x="3076.5" y="1210.5" width="577" height="250" stroke="#000000" stroke-width="6.875" stroke-linecap="butt" stroke-linejoin="round" stroke-miterlimit="10" stroke-opacity="1" fill="none"/><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 3108.67 1289)">a.</text><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 3191.17 1289)">Apply brightness</text><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 3108.67 1355)">b.</text><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 3191.17 1355)">Apply Gamma</text><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 3108.67 1421)">c.</text><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 3191.17 1421)">Copy to strip</text><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="55" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 3094.58 1164)">4. Copy to strip</text><rect x="3752" y="1268" width="423" height="155" stroke="#000000" stroke-width="10.3125" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8" stroke-opacity="1" fill="none"/><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="73" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 3804.8 1372)">Leds</text><text fill="#000000" fill-opacity="1" font-family="Arial,Arial_MSFontService,sans-serif" font-style="normal" font-variant="normal" font-weight="400" font-stretch="normal" font-size="73" text-anchor="start" direction="ltr" writing-mode="lr-tb" unicode-bidi="normal" text-decoration="none" transform="matrix(1 0 0 1 3984.12 1372)">strip</text><path d="M3653 1329.75 3710.5 1329.75 3710.5 1309 3752 1350.5 3710.5 1392 3710.5 1371.25 3653 1371.25Z" fill="#4472C4" fill-rule="evenodd" fill-opacity="1"/></g></g></svg>or.svg…]()


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
