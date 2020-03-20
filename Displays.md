!> **This feature is not included in precompiled binaries.**     
To use it you must [compile your build](compile-your-build). Add the following to `user_config_override.h`:

#define directive | Description
 ---|---
USE_DISPLAY | Enable display support. Also requires at least one of the following compilation directives 
USE_DISPLAY_LCD | Enable LCD display. Also requires `USE_I2C`
USE_DISPLAY_SSD1306 | Enable OLED SSD1306 display. Also requires `USE_I2C`
USE_DISPLAY_MATRIX | Enable MATRIX display
USE_DISPLAY_ILI9341 | Enable TFT display. Also requires `USE_SPI`
USE_DISPLAY_EPAPER_29 | Enable EPAPER_29 display. Also requires `USE_SPI`
USE_DISPLAY_EPAPER_42 | Enable EPAPER_42 display. Also requires `USE_SPI`
USE_DISPLAY_SH1106 | Enable OLED SH1106 display. Also requires `USE_I2C`
USE_DISPLAY_ILI9488 | Enable TFT ILI9488 display. Also requires `USE_SPI`
USE_DISPLAY_SSD1351 | Enable OLED SSD1351 display. Also requires `USE_SPI`
USE_DISPLAY_RA8876  | Enable TFT RA8876 display. Also requires `USE_SPI` 
USE_TOUCH_BUTTONS | Enable virtual touch button support with touch displays 
SHOW_SPLASH | Enable initialization splash message on the display
USE_AWATCH | Enables analog watch support
USE_GRAPH | Enable line charts. Also requires `NUM_GRAPHS`

----
## Display Commands
See commands page for full list of available [Display Commands](Commands#displays)

## DisplayMode Parameters

The display driver is able to display predefined setups of text or user defined text. To display text using `DisplayText` set `DisplayMode` to `0`, or set `DisplayMode` to `1` for the HT16K33 dot-matrix display.

Parameter	|	LCD Display	|	OLED Display	|	TFT Display
------------	|	----------------------	|	-----------------------------------	|	----------------------------
0	|	DisplayText	|	DisplayText	|	DisplayText
1	|	Time/Date	|	Time/Date	|	Time/Date
2	|	Local sensors	|	Local sensors	|	Local sensors
3	|	MQTT and Time/Date	|	Local sensors and Time/Date	|	Local sensors and Time/Date
4	|	Local sensors	|	MQTT and local sensors	|	MQTT and local sensors
5	|	MQTT and Time/Date	|	MQTT, local sensors and Time/Date	|	MQTT, local sensors and Time/Date

## DisplayText Use

The `DisplayText` command is used to display text as well as graphics and graphs on LCD, OLED and e-Paper
displays (EPD). The command argument is a string that is printed on the display at the current position.
The string can be prefixed by embedded control commands enclosed in brackets `[]`.

In order to use the `DisplayText` command the `DisplayMode` must be set to `0` (or optional `1` on LCD displays) or other modes must be disabled before compilation with `#undef USE_DISPLAY_MODES1TO5`.

### DisplayText parameters

In the list below `p` stands for parameter and may be a number from 1 to n digits.
On monochrome graphic displays things are drawn into a local frame buffer and sent to the display either
via the `d` command or automatically at the end of the command.

### Positioning

`lp` = sets a character line to print at (on LCD display `p` = {0&hellip;}, on TFT display `p` = {1&hellip;})  
`cp` = sets a character column to print at (on LCD display `p` = {0&hellip;}, on TFT display `p` = {1&hellip;})  
`xp` = sets the x position for consecutive prints  
`yp` = sets the y position for consecutive prints  

Text is printed at the last provided position, either l or y for the vertical position,
and either x or x for the horizontal position. Neither x nor y are advanced/updated after printing text.

### Line primitives

`hp` = draws a horizontal line with length `p` (x is advanced)  
`vp` = draws a vertical line with length `p` (y is advanced)  
`Lp:p` = draws a line top:`p` (x,y are advanced)  
`kp` = draws a circle with radius `p`  
`Kp` = draws a filled circle with radius `p`  
`rp:p` = draws a rectangle with `p` with and `p` height  
`Rp:p` = draws a filled rectangle with `p` with and `p` height  
`up:p:p` = draws a rounded rectangle with `p` with, `p` height and `p` radius (_not for ILI9341_)  
`Up:p:p` = draws a filled rounded rectangle with `p` with, `p` height and `p` radius (_not for ILI9341_)  

### Miscellaneous

`z` = clear the display  
`i` = (re)init the display (in e-Paper mode with partial update)  
`I` = (re)init the display (in e-Paper mode with full update)  
`d` = update the display  
`Dp` = switch display auto updates on(`p`=1)/off(`p`=0), when off display must be updated with `d`  
`o` = switch display off  
`O` = switch display on  
`ap` =  `p` (0..3) set rotation angle  
`t` = display Tasmota time in HH:MM  
`tS` = display Tasmota time in HH:MM:SS  
`T` = display Tasmota date in DD.MM.YY  
`pp` = pad text with spaces, positive values align left, negative values
align right    
`sp` = set text scaling for classic GFX font (scaling factor 1...N)  
`fp` = set font (1=12, 2=24,(opt 3=8)) if font==0 the classic GFX font is used, if font==7 RA8876 internal font is used   
`Cp` = set foreground color (0,1) for black or white and RGB decimal code for color  
`Bp` = set background color (0,1) for black or white and RGB decimal code for color  
`Cip` = set foreground index color (0..18) for color displays (see index color table below)  
`Bip` = set background index color (0..18) for color displays (see index color table below)  
`wp` = draws an analog watch with radius p  (#define USE_AWATCH)   
`Pfilename:` = display an rgb 16-bit color image when SD card file system is present  

### Touch Buttons
(`#define USE_TOUCH_BUTTONS`)  

Draw up to 16 GFX buttons to switch real Tasmota devices such as relays.
- Button number + 256 - a virtual touch toggle button is created (MQTT => TBT)
- Button number + 512 - a virtual touch push button is created (MQTT => PBT)
  
`b#:xp:yp:xa:ys:oc:fc:tc:ts:text:`   
_Parameters are separated by colons._   
* `b#` where # = button number 0-15  
* `xp` = x position  
* `yp` = y position  
* `xa` = x size  
* `ys` = y size  
* `oc` = outline index color  
* `fc` = fill index color  
* `tc` = text index color  
* `ts` = text size  
* `text:` = button text (must end with a colon :) (max 9 chars)  

Example:   
`b0:260:260:100:50:2:11:4:2:Rel 1:`


### Line chart
(`#define USE_GRAPH` and `#define NUM_GRAPHS 4` - maximum of 16)  

Up to 4 line charts may be defined.  

Ticks may be defined by adding tick numbers to the `n` parameter.  
> [!EXAMPLE] `n` = graph number (0..3) + x ticks (16\*number of x ticks) + y ticks (1024\*number of y ticks).  


`Gn:xp:yp:xs:ys:t:fmax:fmin` defines a line chart:   
_Parameters are separated by colons._
* `n` = number up to 4 charts (0..3) + optional ticks  
* `xp` = x position  
* `yp` = y position  
* `xs` = x size  (if xs<0) graph is not reinitialized on second call (e.g., restart of scripter)  
* `ys` = y size  
* `t` = time in minutes for total chart  
* `ymin` = float chart minimum y  
* `ymax` = float chart maximum y  
* `icol` = line color index (only for color graphs)  

`gn:v` adds a value to the chart buffer:
* `n` = number up to 4 charts (0..3)  
* `v` = float value to add  

`Gdn:m` sets graph n draw mode `0` = off, `1` = on. When on, redraw graph  
* `Gsn:path:` = save graph `n` to path (if optional SD card is present)  
* `Grn:path:` = restore graph `n` from path (if optional SD card is present)  

### Color Indices

Selected with `Ci` and `Bi` in the ILI9488, SSD1351, and RA8876 color panels  

| Index | Color | Index | Color | Index | Color |
| -- | -- | -- | -- | -- | -- |
| 0 | BLACK | 1 | WHITE | 2 | RED |
| 3 | GREEN | 4 | BLUE | 5 | CYAN |
| 6 | MAGENTA | 7 | YELLOW | 8 | NAVY |
| 9 | DARKGREEN | 10 | DARKCYAN | 11 | MAROON |
| 12 | PURPLE | 13 | OLIVE | 14 | LIGHTGREY |
| 15 | DARKGREY | 16 | ORANGE | 17 | GREENYELLOW |
| 18 | PINK |

#### Notes on e-Paper Displays

E-Paper displays have 2 operating modes: full update and partial update. While full update delivers a clean and sharp picture, it has the disadvantage of taking several seconds for the screen update and shows severe flickering during update. Partial update is quite fast (300 ms) with no flickering but there is the possibility that erased content is still slightly visible. It is therefore useful to perform a full update in regular intervals (e.g., each hour) to fully refresh the display.
 
Compilation directives: `#define USE_SPI`, `#define USE_DISPLAY`, `#define USE_DISPLAY_EPAPER29`, or `#define USE_DISPLAY_EPAPER42`

**Remark**: the 4.2 e-Paper display requires about 15k of RAM. Therefore it only works with Core 2.42 and above.

#### OLED Lifetime
The typical specifications for the lifetime of an OLED when permanently on is about 10000 hours (416 days). Dimming to 50% expands the lifetime to about 25000 hours.  

#### Burn-in
The data sheets of the TFT and OLED displays mention burn-in effects when a static display is shown for extended periods of time. You may want to consider turning on the display on demand only.

## Fonts
The EPD font contains 95 characters starting from code 32, while the classic GFX font contains 256 characters ranging from 0 to 255. Custom characters above 127 can be displayed. To display these characters, you must specify an escape sequence (standard octal escapes do not work). The `~`character followed by a hex byte can define any character code.  

GFXFont:  
![GFXFont](https://user-images.githubusercontent.com/11647075/63440218-bb83e100-c42f-11e9-810c-74099f851902.jpg ":size=200")

EPDFont:  
![EPDFont](https://user-images.githubusercontent.com/11647075/63440222-be7ed180-c42f-11e9-9be3-2f446fc28037.jpg ":size=200")

## Hardware Connections
I<sup>2</sup>C displays are connected in the usual manner and defined via the GPIO component selection.  

The I<sup>2</sup>C address must be specified using `DisplayAddress XX`, e.g., `60`. The model must be spedified with `DisplayModel`, e.g., `2` for SSD1306. To permanently turn the display on set `DisplayDimmer 100`. Display rotation can be permanently set using `DisplayRotate X` (x = `0..3`).  

E-Paper displays are connected via software 3-wire SPI `(CS, SCLK, MOSI)`. The other three interface lines of the display
(DC, Reset, busy) may be left unconnected. The jumper on the circuit board of the display must be set to 3-wire SPI.  

The ILI9488, ILI9341 and SSD1351 are connected via hardware 3-wire SPI `(MOSI=GPIO13, SCLK=GPIO14, CS=GPIO15)`. The ILI9488 must also be connected to the backlight pin (dimmer supported on SSD1351). [Wiring](https://github.com/arendst/Tasmota/issues/2557#issuecomment-444454436)

The RA8876 is connected via standard hardware 4-wire SPI `(MOSI=GPIO13, SCLK=GPIO14, CS=GPIO15, MISO=GPIO12)`. No backlight pin is needed (dimmer supported).  

## Examples

Print Text at size 1 on line 1, column 1:  
`DisplayText [s1l1c1]Hello how are you?`

Draw a rectangle and draw text inside with size 2 and 7 chars padded with spaces:  
`DisplayText [x85y95h130v30h-130v-30s2p7x90y100]37.25 C`

Refresh screen:  
`DisplayText [z]`

Draw rectangle from x,y with width and height:  
`DisplayText [x50y50r200:100]`

### Display Local Sensors
_(line breaks and indentation added to the rules for readability)_

Use Tasmota rules to display sensor values, time, and a separation line. Refresh the display every 60 minutes:
```console
rule1 on tele-SHT3X-0x44#Temperature do DisplayText [f1p7x0y5]%value% C endon
      on tele-SHT3X-0x44#Humidity do DisplayText [f1p10x70y5]%value% %[x0y20h296x250y5t] endon
      on tele-BMP280#Pressure do DisplayText [f1p10x140y5]%value% hPa endon
      on Time#Minute|60 do DisplayText [Tt] endon
```

Show 4 analog channels:
```console
rule1 on tele-ADS1115#A0 do DisplayText [s1p21c1l01]Analog1: %value% adc endon
      on tele-ADS1115#A1 do DisplayText [s1p21c1l3]Analog2: %value% adc endon
      on tele-ADS1115#A2 do DisplayText [s1p21c1l5]Analog3: %value% adc endon
      on tele-ADS1115#A3 do DisplayText [s1p21c1l7]Analog4: %value% adc endon
```

Show BME280 + SGP30:
```console
rule1 on tele-BME280#Temperature do DisplayText [s1p21x0y0]Temp: %value% C endon
      on tele-BME280#Humidity do DisplayText [s1p21x0y10]Hum : %value% %% endon
      on tele-BME280#Pressure do DisplayText [s1p21x0y20]Prss: %value% hPa endon
      on tele-SGP30#TVOC do DisplayText [s1p21x0y30]TVOC: %value% ppb endon
      on tele-SGP30#eCO2 do DisplayText [s1p21x0y40]eCO2: %value% ppm [s1p0x0y50]Time: [x35y50t] endon
```

## Display Drivers

Waveshare has two kinds of display controllers: with partial update and without partial update. The 2.9 inch driver is for partial update and should also support other Waveshare partial update models with modified WIDTH and HEIGHT parameters. The 4.2 inch driver is a hack which makes the full update display behave like a partial update and should probably work with other full update displays.  

The drivers are subclasses of the Adafruit GFX library. The class hierarchy is `LOWLEVEL :: Paint :: Renderer :: GFX`, where:  
`GFX`: unmodified Adafruit library  
`Renderer`: the interface for Tasmota  
`Paint`: the modified pixel driver for e-paper  
- there are several virtual functions that can be subclassed down to `LOWLEVEL`.

The display dispatcher only does the class initialization call. All other calls go to the `Renderer` class.

In black and white displays, a local RAM buffer must be allocated before calling the driver. This must be set to zero on character or TFT color displays.

**Remark**: To use the 400x300 e-Paper display, the Arduino library 2.4 or later must be used because it leaves much more RAM available than prior versions. This display requires 15k of RAM!

The EPD fonts use about 9k space, which can be selected at compile time using \#ifdef directives.

- SSD1306 - 1.15k
- EPD42   - 2.57k
- EPD29   - 2.1k
- Display and Render class - ~12k
