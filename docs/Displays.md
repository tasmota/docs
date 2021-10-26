!!! info "This feature is included only in `-displays.bin`"

## Supported Displays

| DisplayModel | Name | Interface
:---: | --- | ---
1 | LCD display |  I^2^C
2 | SSD1306 OLED display | I^2^C
3 | 8x8 MATRIX display | GPIO
4 | ILI934x TFT display<BR>`DisplayIliMode 1` for ILI9341 or `DisplayIliMode 3` for ILI9342<BR>When second SPI bus on ESP32 is used, SSPI must be defined instead of SPI| SPI
5 | Waveshare E-Paper 2.9" display (black/white, partial update) | SPI
6 | Waveshare E-Paper 4.2" display (black/white, full update) | SPI
7 | SH1106 OLED display | I^2^C
8 | ILI9488 TFT display | SPI
9 | SSD1351 OLED color display | SPI
10 | RA8876 TFT display | SPI 
11 | 7 segment common anode display | I^2^C
12 | ST7789 TFT display | SPI
14 | SD1331 TFT display | SPI
15 | [TM1637, TM1638 and MAX7219](TM163x) 7-segment displays | GPIO
16 | LilyGO T5 4.7" E-Paper display ESP32 device | :material-cpu-32-bit:
17 | [Universal Display Driver](#universal-display-driver) | SPI or I^2^C
18 | Interface to virtual display driver with [Berry](Berry) | :material-cpu-32-bit:

## Display Commands

See commands page for full list of available [Display Commands](Commands.md#displays)  

## DisplayMode

The display driver is able to display predefined setups of text or user defined text. To display text using `DisplayText` set `DisplayMode` to `0`, or set `DisplayMode` to `1` for the HT16K33 dot-matrix display.  

To use the seven-segment-specific [TM1637, TM1638 and MAX7219](TM163x#commands-and-usage) _Display-_ commands, set `DisplayMode` to `0`.

Parameter	|	LCD Display	|	OLED Display	|	TFT Display  | 7-segment Display (TM163x and MAX7219)
---	|	---	|	---	|	---     |    ----
0	|	DisplayText	|	DisplayText	|	DisplayText  |    All [TM163x](TM163x#commands-and-usage) _Display-_ functions
1	|	Time/Date	|	Time/Date	|	Time/Date    |    Time
2	|	Local sensors	|	Local sensors	|	Local sensors   |   Date
3	|	MQTT and Time/Date	|	Local sensors and Time/Date	|	Local sensors and Time/Date  |   Time/Date
4	|	Local sensors	|	MQTT and local sensors	|	MQTT and local sensors  |  NA
5	|	MQTT and Time/Date	|	MQTT, local sensors and Time/Date	|	MQTT, local sensors and Time/Date | NA


## DisplayText

The `DisplayText` command is used to display text as well as graphics and graphs on LCD, OLED and e-Paper
displays (EPD). The command argument is a string that is printed on the display at the current position.
The string can be prefixed by embedded control commands enclosed in brackets `[]`.

In order to use the `DisplayText` command the `DisplayMode` must be set to `0` (or optional `1` on LCD displays) or other modes must be disabled before compilation with `#undef USE_DISPLAY_MODES1TO5`.  

The `DisplayText` command is customised for the TM1637, TM1638 and MAX7219 seven-segment display modules. This is documented [here](TM163x#commands-and-usage).  

### DisplayText Parameters

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

### Line Primitives

`hp` = draws a horizontal line with length `p` (x is advanced)  
`vp` = draws a vertical line with length `p` (y is advanced)  
`Lp:p` = draws a line top:`p` (x,y are advanced)  
`kp` = draws a circle with radius `p`  
`Kp` = draws a filled circle with radius `p`  
`rp:p` = draws a rectangle with `p` with and `p` height  
`Rp:p` = draws a filled rectangle with `p` with and `p` height  
`up:p:p` = draws a rounded rectangle with `p` with, `p` height and `p` radius v
`Up:p:p` = draws a filled rounded rectangle with `p` with, `p` height and `p` radius  

### Miscellaneous

`z` = clear the display  
`i` = (re)init the display (in e-Paper mode with partial update)  
`I` = (re)init the display (in e-Paper mode with full update)  
`d` = update the display  
`Dp` = switch display drawing options:  
  bit 0: auto updates => 1 auto draw on each displaytext cmd, 0 display must be updated manually with `d`  
  ( only valid for bw oled and epaper displays, color displays draw always immediately)  
  bit 1: character drawing => 0 opaque character drawing, 1 transparent character drawing  
`o` = switch display off  
`O` = switch display on  
`ap` =  `p` (0..3) set rotation angle  
`t` = display Tasmota time in HH:MM  
`tS` = display Tasmota time in HH:MM:SS  
`T` = display Tasmota date in DD.MM.YY  
`pp` = pad text with spaces, positive values align left, negative values
align right    
`sp` = set text scaling for all fonts (scaling factor 1...N)  
`fp` = set font (1=12, 2=24,(opt 3=8)) if font==0 the classic GFX font is used, if font==7 RA8876 internal font is used, if font==4  special 7 segment 24 pixel number font is used, a ram based font is selected if font==5  
`Cp` = set foreground color (0,1) for black or white and RGB decimal code for color (see [color codes](#color-codes))  
`Bp` = set background color (0,1) for black or white and RGB decimal code for color (see [color codes](#color-codes))   
`Cip` = set foreground index color (0..31) for color displays (see index color table below)  
`Bip` = set background index color (0..31) for color displays (see index color table below)  
`wp` = draws an analog watch with radius p  (#define USE_AWATCH)   
`Pfilename:` = display an rgb 16-bit color image when file system is present  
`Ffilename:` = load RAM font file when file system is present. the font is selected with font Nr. 5, these fonts are special binary versions of GFX fonts of any type. they end with .fnt. an initial collection is found in Folder BinFonts  
`SXfilename:` = load display descriptor for multiple display support (X = 1..3) for up to 3 displays. 
`SX:` = switch to display number (X = 1..3).  
`dcI:V` = define index color entry Index 19-31, V 16 bit color value (index 0-18 is fixed)  

### Touch Buttons and Sliders

Requires `#define USE_TOUCH_BUTTONS`

![touch elements](https://user-images.githubusercontent.com/11647075/107513682-dbb9d980-6ba8-11eb-9716-18f788f8b08d.jpg)

Draw up to 16 GFX buttons to switch real Tasmota devices such as relays or draw Sliders to dimm e.g. a lamp

- Button number + 256 - a virtual touch toggle button is created (MQTT => TBT)
- Button number + 512 - a virtual touch push button is created (MQTT => PBT)
  
`b#:xp:yp:xa:ys:oc:fc:tc:ts:text:`   
_Parameters are separated by colons._   

* `b#` where # = define a button number 0-15  
* `xp` = x position  
* `yp` = y position  
* `xa` = x size  
* `ys` = y size  
* `oc` = outline index color  
* `fc` = fill index color  
* `tc` = text index color  
* `ts` = text size on buttons  
* `text:` = button text (must end with a colon :) (max 9 chars)  

!!! example "`b0:260:260:100:50:2:11:4:2:Rel 1:`"

### Picture Buttons
To create picture touch buttons (jpg on ESP32 only) requires `#define JPEG_PICTS` and `#define USE_UFILESYS`. 
 
Upload pictures to the file system with a ".jpg" extension, then give the path to the picture as button text omitting the .jpg extension.

!!! example "Create a picture button with a picture file named `wifi.jpg`"
    `b0:260:260:100:50:2:11:4:2:/wifi:`

The size of the picture is **not** scaled and the dimensions of the button must fit the picture size. Clicked buttons will invert the colors of the picture.  

You may specify a picture for selected and unselected button state. Picture filename ending with '1' is used for unselected state and ending '2' is for selected state.  

### Sliders

* `bs#` where # = is slider number `0..15`  
* `xp` = x position  
* `yp` = y position  
* `xa` = x size  
* `ys` = y size  
* `ne` = number of elements  
* `bc` = background color  
* `fc` = frame color  
* `bc` = bar color  

Set the state of a button or slider with:  

* `bs#` where # = is slider number `0..15`
* `val` = `0` or `1` for buttons, `0..100` for sliders   

### Display JSON variables

Requires `#define USE_DT_VARS`

Display variables that are exposed in JSON MQTT strings e.g. in TelePeriod messages.  

The values are updated every second.

`dv#:xp:yp:gc:fc:fo:ts:tl:dp:ut:JSON:ut:`   
_Parameters are separated by colons._   

* `dv#` where # = defines a variable number 0-7  (may be expanded by #define MAX_DT_VARS N)
* `xp` = x position  
* `yp` = y position  
* `gc` = text background color (index color)  
* `fc` = text foreground color (index color)  
* `fo` = text font  
* `ts` = text size (negativ value denotes transparent text)  
* `tl` = text field length (if negative align right)  
* `dp` = decimal precision (if < 0 denotes a string) 
* `ut` = update time in seconds  (1...N)  
* `jt` = JSON VARIABLE NAME (uppercase) if you specify a string in brackets here it is treated as displaytext cmd   
* `ut` = unit string (max 5 chars and must end with a colon :)  

example:
```haskell
;ILI9341 320x240 portrait mode
[x0y0P/corona.rgb:]
[dc19:31000]
[x60y30f2Ci3D2]Tasmota
; display text cmd displays time with seconds
[dv0:50:70:19:3:2:1:11:1:1:[tS]::]
; display text cmd displays analog watch
[dv1:120:250:19:2:2:1:11:1:5:[w40]::]
; displays Wifi SSID JSON
[dv2:10:10:0:3:1:-1:10:-1:1:WIFI#SSID::]
[x10y150f1s1Ci3Bi19]Counter:
; displays a sensor JSON variable (here counter1)
[dv3:80:150:0:7:1:1:11:0:1:COUNTER#C1:cnt:]
[x10y300f1s1Ci3Bi19]memory free:
; displays pre memory space JSON (heap)
[dv4:100:300:0:7:1:1:-7:-1:1:HEAP:kb:]
```

### Line chart

(`#define USE_GRAPH` and `#define NUM_GRAPHS 4` - maximum of 16)  

Up to 4 line charts may be defined.  

Ticks may be defined by adding tick numbers to the `n` parameter.  

!!! example
    `n` = graph number (0..3) + x ticks (16\*number of x ticks) + y ticks (1024\*number of y ticks).  


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

* `Gsn:path:` = save graph `n` to path (if optional file system is present)  
* `Grn:path:` = restore graph `n` from path (if optional file system is present)  

### Batch files

When a file system is present you may define displaytext batch files. If a file named "display.bat" is present in the file system this batch file is executed.
The file may contain any number of diplaytext cmds, one at a line. You may have comment lines beginning with a `;`

!!! example

    ```haskell
    ; clr screen
    [z]
    ; draw full screen picture
    [x0y0P/corona.rgb:]
    ; define index color
    [dc19:31000]
    ; draw transparent text with new index color over picture
    [x60y30f2Ci19D2]Tasmota
    ```
    A displaytext batch file may be executed from console by displaybatch /file  


### Color Codes

While computers and web design are generally using a 24-bit RGB888 color code built from a byte-triplet such as (255, 136, 56) or #FF8038, small color panels often use a more compact code 16-bit RGB565 color code. This means that the R, G and B coefficient are coded on less number of bits:

* Red on 5 bits = `0..31`
* Green on 6 bits = `0..63`
* Blue on 5 bits = `0..31`

For `Cp` and `Bp`, `p` is calculated as `p = 2048 * Red + 64 * Green + Blue`

!!! example
    Red 50% + Green 20% + Blue 100% = 2048 * 16 + 64 * 12 + 31 = 33576 equivalent to web #8033FF

Common colors table:

| Color | Code | Color | Code | Color | Code |
| -- | -- | -- | -- | -- | -- |
| Black	| 0 | Navy	| 15 | Dark green	| 3 |
| Dark cyan	| 1007 | Maroon	| 30720 | Purple	| 30735 |
| Olive	| 31712 | Light grey	| 50712 | Dark grey	| 31727 |
| Blue	| 31 | Green	| 7 | Cyan	| 2047 |
| Red	| 63488 | Magenta	| 63519 | Yellow	| 65504 |
| White	| 65535 | Orange	| 64800 | Green yellow	| 45029 |
| Pink	| 64536 | | | | |


### Color Indices

Selected with `Ci` and `Bi` in the ILI9488, SSD1351, RA8876 and ST7789 color panels  

| Index | Color | Index | Color | Index | Color |
| -- | -- | -- | -- | -- | -- |
| 0 | BLACK | 1 | WHITE | 2 | RED |
| 3 | GREEN | 4 | BLUE | 5 | CYAN |
| 6 | MAGENTA | 7 | YELLOW | 8 | NAVY |
| 9 | DARKGREEN | 10 | DARKCYAN | 11 | MAROON |
| 12 | PURPLE | 13 | OLIVE | 14 | LIGHTGREY |
| 15 | DARKGREY | 16 | ORANGE | 17 | GREENYELLOW |
| 18 | PINK |

You may expand the index color table up from index 19 to 31.
the cmd [dcI:V] defines the index color with index I (19-31) to the 16 bit color value V

#### Note on e-Paper Displays

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
![GFXFont](https://user-images.githubusercontent.com/11647075/63440218-bb83e100-c42f-11e9-810c-74099f851902.jpg)

EPDFont:  
![EPDFont](https://user-images.githubusercontent.com/11647075/63440222-be7ed180-c42f-11e9-9be3-2f446fc28037.jpg)

## Hardware Connections
I<sup>2</sup>C displays are connected in the usual manner and defined via the GPIO component selection.  

The I<sup>2</sup>C address must be specified using `DisplayAddress XX`, e.g., `60`. The model must be spedified with `DisplayModel`, e.g., `2` for SSD1306. To permanently turn the display on set `DisplayDimmer 100`. Display rotation can be permanently set using `DisplayRotate X` (x = `0..3`).  

On SPI the CS and DC pins when needed must use the pin definition with Display_ID + CS e.g. ST7789_CS

E-Paper displays are connected via software 3-wire SPI `(CS, SCLK, MOSI)`. DC should be connected to GND , Reset to 3.3 V 
and busy may be left unconnected. The jumper on the circuit board of the display must be set to 3-wire SPI.  

The ILI9488 is connected via hardware 3-wire SPI `(SPI_MOSI=GPIO13, SPI_SCLK=GPIO14, CS=GPIO15)` and must also be connected to the backlight pin 
The SSD1351 may be connected via hardware 3-wire SPI or 4-wire SPI with support for dimmer.
The ILI9341 is connected via hardware 4-wire SPI, Backlight and OLEDRESET (dimmer supported on ESP32)
 [Wiring](https://github.com/arendst/Tasmota/issues/2557#issuecomment-444454436)

The RA8876 is connected via standard hardware 4-wire SPI `(SPI_MOSI=GPIO13, SPI_SCLK=GPIO14, RA_8876_CS=GPIO15, SSPI_MISO=GPIO12)`. No backlight pin is needed, dimmer supported, on ESP32 gpio pins may be freeley defined (below gpio 33).  

The ST7789 is connected via 4 Wire software SPI ((ST7789_CS), SSPI_SCLK, SSPI_MOSI, ST7789_DC, OLEDRESET, Backlight )  

## Rule Examples

!!! tip "For scripting examples see [Scripting Cookbook](Scripting-Language.md#scripting-cookbook)"

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
```haskell
rule1 on tele-SHT3X-0x44#Temperature do DisplayText [f1p7x0y5]%value% C endon
      on tele-SHT3X-0x44#Humidity do DisplayText [f1p10x70y5]%value% %[x0y20h296x250y5t] endon
      on tele-BMP280#Pressure do DisplayText [f1p10x140y5]%value% hPa endon
      on Time#Minute|60 do DisplayText [Tt] endon
```

Show 4 analog channels:
```haskell
rule1 on tele-ADS1115#A0 do DisplayText [s1p21c1l01]Analog1: %value% adc endon
      on tele-ADS1115#A1 do DisplayText [s1p21c1l3]Analog2: %value% adc endon
      on tele-ADS1115#A2 do DisplayText [s1p21c1l5]Analog3: %value% adc endon
      on tele-ADS1115#A3 do DisplayText [s1p21c1l7]Analog4: %value% adc endon
```

Show BME280 + SGP30:
```haskell
rule1 on tele-BME280#Temperature do DisplayText [s1p21x0y0]Temp: %value% C endon
      on tele-BME280#Humidity do DisplayText [s1p21x0y10]Hum : %value% %% endon
      on tele-BME280#Pressure do DisplayText [s1p21x0y20]Prss: %value% hPa endon
      on tele-SGP30#TVOC do DisplayText [s1p21x0y30]TVOC: %value% ppb endon
      on tele-SGP30#eCO2 do DisplayText [s1p21x0y40]eCO2: %value% ppm [s1p0x0y50]Time: [x35y50t] endon
```

## WaveShare Display Drivers

Waveshare has two kinds of display controllers: with partial update and without partial update. The 2.9 inch driver is for partial update and should also support other Waveshare partial update models with modified WIDTH and HEIGHT parameters. The 4.2 inch driver is a hack which makes the full update display behave like a partial update and should probably work with other full update displays.  

The drivers are subclasses of the Adafruit GFX library. The class hierarchy is `LOWLEVEL :: Paint :: Renderer :: GFX`, where:  

- `GFX`: unmodified Adafruit library  
- `Renderer`: the interface for Tasmota  
- `Paint`: the modified pixel driver for e-paper  
- there are several virtual functions that can be subclassed down to `LOWLEVEL`

The display dispatcher only does the class initialization call. All other calls go to the `Renderer` class.

In black and white displays, a local RAM buffer must be allocated before calling the driver. This must be set to zero on character or TFT color displays.

The EPD fonts use about 9k space, which can be selected at compile time using \#ifdef directives.

- SSD1306 - 1.15k
- EPD42   - 2.57k
- EPD29   - 2.1k
- Display and Render class - ~12k


## Universal Display Driver

Universal Display Driver or uDisplay is a way to define your display settings using a simple text file and easily add it to Tasmota.
uDisplay is `DisplayModel 17`. It supports I2C and hardware or software SPI (3 or 4 wire). 

The driver is enabled by compiling with `#define USE_UNIVERSAL_DISPLAY` and setting an unused GPIO to `Option A3`.

### Descriptor File
The display itself is defined by a descriptor file. Many display descriptor files are included in Tasmota GitHub in [`tasmota/displaydesc`](https://github.com/arendst/Tasmota/tree/development/tasmota/displaydesc) folder

which may be provided by any of the following methods:

1. A `display.ini` file present in the flash file system. ***preferred option***
2. A special `>d` section in scripting. Copy the file to the `>d` script section and place a `->displayreinit` cmd into `>B` section
3. Copy the descriptor to `Rule 3` but **do not** enable it (descriptor may not contain ANY spaces in this mode)
4. Compile the descriptor into the binary in a section in `user_config_override.h` under driver 17 (const char)

Options 2 and 4 work well for 1M flash devices.

Descriptor text file has the following elements:  

`:H`  

Header line describes the main features of the display (comma seperated, no spaces allowed)

1. name
2. x size in pixels
3. y size in pixels
4. bits per pixel (1 for bw displays, 16 for color displays)
5. hardware interface used either I2C or SPI

`I2C`  

1. I2C address in HEX
2. SCL pin
3. SDA pin
4. RESET pin

`SPI`  

1. Number (1 = hardware SPI 1, 2 = Hardware SPI 2 (ESP32), 3 = software SPI
2. CS pin
3. CLK pin
4. MOSI pin
5. DC pin
6. Backlight pin
7. RESET pin
8. MISO pin
9. SPI Speed in MHz

All signals must be given. Unused pins may be set to -1. If you specify a `*` char the pin number is derived from the Tasmota GPIO GUI.  
The CS and DC pins must be the standard pins e.g. `SPI_CS` or `SPI_DC`.  

!!! example "Example"

```haskell
:H,SH1106,128,64,1,I2C,3c,*,*,*
```

```haskell
:H,ILI9341,240,320,16,SPI,1,-1,14,13,5,4,15,*,40
```

`:S`  
(_optional_) Splash setup, also defines initial colors. If omitted screen is not cleared initially.

1. Font number
2. Font size
3. FG color (as index color)
4. BG color (as index color)
5. x position of text
6. y position of text  

!!! example

    ```haskell
    :S,2,1,1,0,40,20
    ```
    
`:I`  
Initial register setup for the display controler. (`IC` marks that the controller is using command mode even with command parameters)  
All values are in hex. On SPI the first value is the command, then the number of arguments and the the arguments itself.
`Bi7 7` on the number of arguments set indicate a wait of 150 ms. On I^2^C all hex values are sent to I^2^C.

!!! example

    ```haskell
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
    ```

`:o`,OP      
`OP` = controller OPCODE to switch display off  

`:O`,OP       
`OP` = controller OPCODE to switch display on  

`:R`,OP,SL       

1. `OP` = rotation opcode
2. `SL` = startline opcode (optional)  

`:0`  
`:1`  
`:2`  
`:3`  

Register values for all 4 rotations (color display only)

1. rotation code
2. x offset
3. y offset
4. rotation pseudo opcode for touch panel
the appropriate coordinate convervsions are defined via pseudo opcodes
0 = no conversion
1 = swap and flip x
2 = flipx, flip y
3 = swap and flip y
4 = flip x
5 = flip y
bit 7 = swap x,y

`:A`  
3 OPCODES to set adress window _(color display only)_

1. set column opcode  
2. set row opcode  
3. start write opcode  
4. pixel size (optional)  

`:P`  
Pixel transfer size (default = 16 bit RGB) _(optional)_

`:i`  
invert display opcodes  
1. inversion off  
2. inversion on  

`:D`  
dimmer opcode _(optional)_

`:B`  
LVGL _(optional)_
1. number of display lines flushed at once (min 10) the lower the lesser memory needed  
2. 0 for no DMA, 1 use DMA (not supported on all displays) bit 1 selects color swap, 2 = swap 16 bit color  

`:T`  
Wait times used for E-paper display  
1. full refresh wait in ms  
2. partial refresh wait in ms  
3. wait after update in ms  

`:L`  
Lookup table for full refresh (Waveshare 29)

`:l`  
Lookuptable for partial refresh (Waveshare 29)

`:Lx`,OP  
Lookuptable for full refresh (Waveshare 42) 
`x` = 1..5  
`OP` = opcode for sending refresh table  

`:TIx,AA,SCL,SDA`  
Defines a touch panel an I2C bus nr `x` (1 or 2)  
AA is device address  
SCL, SDA are the pins used (or * for tasmota definition)  

`:TS,CS_PIN`   
Defines a touch panel an SPI bus with chip select `CS_PIN` (or *)  

`:r,X`
Defines optional display rotation `X` = `0..3`

!!! example "Full configuration for SH1106 (comment lines starting with ; are allowed)"  

```haskell
:H,SH1106,128,64,1,I2C,3c,*,*,*
:S,0,2,1,0,30,20
:I
AE
D5,80
A8,3f
D3,00
40
8D,14
20,00
A1
C8
DA,12
81,CF
D9F1
DB,40
A4
A6
AF
:o,AE
:O,AF
:A,00,10,40
#
```

!!! example "Full configuration for ILI9341: (comment lines starting with ; are allowed)"  

```haskell
:H,ILI9341,240,320,16,SPI,1,*,*,*,*,*,*,*,40
:S,2,1,1,0,40,20
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
:0,48,00,00,00
:1,28,00,00,01
:2,88,00,00,02
:3,E8,00,00,02
#
```
Scripter is the nost convenient way to edit and develop a uDisplay driver. On every scripter save the display is reinitialized and you immediately see results of your changes.  

!!! example "Scripter driven display descriptor"  

```haskell
>D
>B
=>displayreinit
>d
; name,xs,ys,bpp,interface, address, scl,sda,reset
:H,SH1106,128,64,1,I2C,3c,*,*,*
:S,0,2,1,0,30,20
:I
AE
D5,80
A8,3f
D3,00
40
8D,14
20,00
A1
C8
DA,12
81,CF
D9F1
DB,40
A4
A6
AF
:o,AE
:O,AF
:A,00,10,40
#
```

## Compiling
There are also many variants of each display available and not all variants may be supported.  

#define directive | Description
 ---|---
USE_DISPLAY | Enable display support. Also requires at least one of the following compilation directives 
USE_DISPLAY_LCD | Enable LCD display. Also requires `USE_I2C`
USE_DISPLAY_SSD1306 | Enable OLED SSD1306 display. Also requires `USE_I2C`
USE_DISPLAY_MATRIX | Enable MATRIX display
USE_DISPLAY_ILI9341 | Enable TFT ILI9341 display. Also requires `USE_SPI`<br>if seconds SPI bus on ESP32 shall be used SSPI must be defined instead of SPI<br>ILI9342 also supported, select with cmd displayilimode 3, default is: displayilimode 1 (ILI9341)
USE_DISPLAY_EPAPER_29 | Enable Waveshare EPAPER_29 display.(black/white, partial update)<br>Also requires `USE_SPI`
USE_DISPLAY_EPAPER_42 | Enable Waveshare EPAPER_42 display.(black/white, full update)<br>Also requires `USE_SPI`
USE_DISPLAY_SH1106 | Enable OLED SH1106 display. Also requires `USE_I2C`
USE_DISPLAY_ILI9488 | Enable TFT ILI9488 display. Also requires `USE_SPI`
USE_DISPLAY_SSD1351 | Enable color OLED SSD1351 display. Also requires `USE_SPI`
USE_DISPLAY_RA8876  | Enable TFT RA8876 display. Also requires `USE_SPI` 
USE_DISPLAY_SEVENSEG  | Enable 7 segment display. Also requires `USE_I2C` 
USE_DISPLAY_ST7789  | Enable TFT ST7789 display. Also requires `USE_SPI`  
USE_DISPLAY_ILI9342  | Enable TFT ILI9342 display. Also requires `USE_SPI` 
USE_DISPLAY_SD1331  | Enable TFT SD1331 display. Also requires `USE_SPI` 
USE_DISPLAY_TM1637  | Enable 7-segment [TM1637, TM1638 and MAX7219](TM163x.md) display. 
USE_DISPLAY_SEVENSEG_COMMON_ANODE | Common anode 7 segment displays. Also requires `USE_I2C`  
USE_DISPLAY_TM1637 | Enable TM1637 display
USE_LILYGO47  | Enable LILGO 4.7 Epaper display ESP32 combo
USE_UNIVERSAL_DISPLAY  | Enable universal display driver
USE_LVGL  | Enable LVGL, currently only supported by berry scripting  
USE_TOUCH_BUTTONS | Enable virtual touch button support with touch displays 
SHOW_SPLASH | Enable initialization splash message on the display  
USE_RAMFONT | Enable loadable Fonts  
USE_MULTI_DISPLAY | Enable mutiple display support (up to 3)  
USE_AWATCH | Enables analog watch support  
USE_GRAPH | Enable line charts. Also requires `NUM_GRAPHS`  
  
----
