# Universal Display and Universal Touch drivers (uDisplay/uTouch)

!!! info "Starting with Tasmota v13.4, we are progressibely removing specific display and touch drivers and replacing with Universal Drivers. This is made to simplify future evolutions and shrink the code base, as the number of drivers is increasing fast."

This page is primarily targeting users that need to move from specific driver (ILI9341, SSD1306...)

## Migrating to uDisplay

### Step 1. Check that your display is supported by uDisplay driver

The currently supported display drivers are:

**TO BE UPDATED**

Display type|Interface
:---|:---
ILI9341 TFT|SPI
ILI9342 TFT|SPI
ILI9488 TFT|SPI
GC9A01|SPI
SH1106 OLED display|I^2^C
SH1107|SPI
SSD1306 OLED display|I^2^C
SSD1331|SPI
ST7262|RGB (ESP32S3)
ST7735<br>ST7735S|SPI
ST7789 TFT display|SPI
ST7796U|SPI<br>Parallel
Waveshare E-Paper 2.9" display|SPI
Waveshare E-Paper 4.2" display|SPI

### Step 2. Flash with uDisplay compatible binary

All `tasmota-display.bin`, `tasmota32-display.bin` and `tasmota32-lvgl.bin` include native support for uDisplay and uTouch. Select the appropriate binary and flash the device.

### Step 3. Use `autoconf` (ESP32 only)

Check if your device has already an `autoconf` file. In the main Tasmota UI, click on "Configuration" then "Auto-configuration". If you device is in the list, select it and "Apply Configuration". You can now skip steps 4 (GPIOs) and 5 (display.ini).

### Step 4. Configure GPIOs

The configuration template is slightly different with uDrive:

- Set an unused GPIO to `Option A3`.<br>This GPIO configuration is a virtual marker to signal that uDriver should be started; it has no effect on the GPIO. It can be assigned to "reserved" (red) GPIOs.
- If `SPI`, change the device specific `<device> CS` GPIO to the general `SPI CS` GPIO.<br>For example change from `ILI9341 CS` to `SPI_CS`
- If `I2C`, you should not need any change (**IS IT TRUE?**)

### Step 5. Configure the `display.ini` descriptor file

Select the appropriate `display.ini` file from the [repository](https://github.com/arendst/Tasmota/tree/development/tasmota/displaydesc), and store it as `display.ini` file in the file system.

Storing `display.ini` is the preferred method to configure the descriptor file. If this is not possible or if the device has no filesystem, use one of the alternative methods:

1. A `display.ini` file present in the flash file system. ***preferred option***
2. A special `>d` section in scripting. Copy the file to the `>d` script section and place a `->displayreinit` cmd into `>B` section
3. Copy the descriptor to `Rule3` but **do not** enable it. Convert the multiline descriptor into a single line descriptor by replacing every linefeed with a space. All other spaces need to be removed. Maximum length is a little more than 511 bytes.
4. Compile the descriptor into the binary with a `#define DSP_ROM_DESC` string in `user_config_override.h`, see [example here](https://github.com/arendst/Tasmota/blob/development/tasmota/displaydesc/readme.md).

### Step 6. Restart

The migration to uDisplay is now complete.

## Migrating to uTouch

### Step 1. Check you `display.ini`

It is possible that you `display.ini` has already the uTouch configuration, especially if you used `autoconf`. If this is the case, you are done.

### Step 2. Add uTouch section to `display.ini`

Depending on your touch device, add the following templates to `display.ini`:

### FT5206 example

Configure:

- GPIO `TS SPI CS` to the touch SPI `CS` pin
- add the following template:

```
:UTI,FT5206,I2,*,-1,-1
RD A8
CP 11
RTF
RD A3
CP 64
RTF
RT
:UTT
RDM 00 16
MV 2 1
RT
:UTX
MV 3 2
RT
:UTY
MV 5 2
RT
#
```

### XPT2046 example

Configure:

- GPIO `TS SPI CS` to the touch SPI `CS` pin
- GPIO `TS IRQ` to the interrupt pin
- add the following template:

```
:UTI,XPT2046,S1,*,-1,*
CPR 00
RT
:UTT
XPT 300
RT
:UTX
MV 0 2
;DBG 1
SCL 460 0.0930233
LIM 319
RT
:UTY
MV 2 2
SCL 300 0.0695652
LIM 239
RT
#
```

If your device does not have the same calibration, you instead:


```
:UTI,XPT2046,S1,*,-1,*
CPR 00
RT
:UTT
XPT 300
RT
:UTX
MV 0 2
RT
:UTY
MV 2 2
RT
#
```

then run [DisplayCalibrate](https://tasmota.github.io/docs/Tasmota-Application/#display-calibration) application which creates an additional `:H` line with your display's specific calibration.

### GT911 example

Configure:

- GPIO `TS RST` to the touch reset pin
- add the following template:

```
:UTI,GT911,I1,5d,*,-1
RDWM 8140 4
MV 0 1
CPR 39
RTF
MV 1 1
CPR 31
RTF
MV 2 1
CPR 31
RTF
RT
:UTT
RDW 814E
MV 0 1
AND 80
CPR 80
RTF
RDWM 8150 8
WRW 814E 00
RT
:UTX
MV 0 3
RT
:UTY
MV 2 3
RT
#
```

### Simple resitive touch example

```
:UTI,SRES,R
CPR 00
RT
:UTT
GSRT 500
RT
:UTX
MV 0 2
RT
:UTY
MV 2 2
RT
#
```

### Step 3. Restart

You are now done.

## Universal Display Driver (uDisplay)

!!! info "uDisplay is included in all pre-compiled display binaries, for ESP8266 and ESP32. If you compile yourself, you need to `#define USE_UNIVERSAL_DISPLAY`"

Universal Display Driver or uDisplay is a way to define your display settings using a simple text file and easily add it to Tasmota.
uDisplay is `DisplayModel 17`. It supports I2C and hardware or software SPI (3 or 4 wire), 8,16 Bit parallel and RGB interface. The driver must be enabled by OPTION A3 on any GPIO pin. 

The driver is enabled by compiling with `#define USE_UNIVERSAL_DISPLAY` and setting an unused GPIO to `Option A3`.

### Descriptor File
The display itself is defined by a descriptor file. Many display descriptor files are included in Tasmota GitHub in [`tasmota/displaydesc`](https://github.com/arendst/Tasmota/tree/development/tasmota/displaydesc) folder

which may be provided by any of the following methods:

1. A `display.ini` file present in the flash file system. ***preferred option***
2. A special `>d` section in scripting. Copy the file to the `>d` script section and place a `->displayreinit` cmd into `>B` section
3. Copy the descriptor to `Rule 3` but **do not** enable it. Convert the multiline descriptor into a single line descriptor by replacing every linefeed with a space. All other spaces need to be removed
4. Compile the descriptor into the binary in a section in `user_config_override.h` under driver 17 (const char)

Options 2 and 4 work well for 1M flash devices.

Descriptor text file has the following elements:  

`:H`  

Header line describes the main features of the display (comma separated, no spaces allowed)

1. name
2. x size in pixels
3. y size in pixels
4. bits per pixel (1 for bw displays, 16 for color displays)
5. hardware interface used either I2C or SPI

`I2C`  
  
I2C interface:

1. I2C address in HEX
2. SCL pin
3. SDA pin
4. RESET pin

`SPI`  

SPI interface:
  
1. Number (1 = hardware SPI 1, 2 = Hardware SPI 2 (ESP32), 3 = software SPI
2. CS pin
3. CLK pin
4. MOSI pin
5. DC pin
6. Backlight pin
7. RESET pin
8. MISO pin
9. SPI Speed in MHz
  
`PAR`  

Parallel interface: (ESP32-S3 only)
  
1. Bus size 8 or 16
2. RESET pin
3. CS pin
4. DC pin
5. WR pin
6. RD pin
7. Backlight pin
8. d0-d7 pins
9. d8-d15 pins if bus size = 16
10. Parallel Speed in MHz (usually 20)

`RGB`  

RGB 16 bit interface: (ESP32-S3 only)
  
1. DE pin
2. VSYNC pin
3. HSYNC pin
4. PCLK pin
5. Backlight pin 
6. b0-b4 pins (blue color)
7. g0-g5 pins (green color)
8. r0-r4 pins (red color) 
9. Pixel clock Speed in MHz (usually 14)
  
All signals must be given. Unused pins may be set to -1. If you specify a `*` char the pin number is derived from the Tasmota GPIO GUI.  
The CS and DC pins must be the standard pins e.g. `SPI_CS` or `SPI_DC`.  

there are RGB displays that also need an SPI initialisation. in this case specify the Init sequence with :IS,SCLK,MOSI,CS,RESET   
there are RGB displays that also need an I2C initialisation. in this case specify the Init sequence with :II,BUS,ADDR (BUS = i2c bus nr 1 or 2, ADDR = adress of i2c device)  

!!! i2c example
```haskell
:II,1,38
03,00
08,00
10
07,FF
```

1. entry = device register to write  
2. entry = value to write  
single entry defines a delay in milliseconds  


!!! example "Example"

```haskell
:H,SH1106,128,64,1,I2C,3c,*,*,*
```

```haskell
:H,ILI9341,240,320,16,SPI,1,-1,14,13,5,4,15,*,40
```

`:S`  
(_optional_) Splash setup, also defines initial colors. If omitted screen is not cleared initially.

1. Font number, if -1 splash screen is suppressed
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
Initial register setup for the display controller. (`IC` marks that the controller is using command mode even with command parameters)
All values are in hex. On SPI the first value is the command, then the number of arguments and the the arguments itself.
`Bit 7` on the number of arguments set indicate a wait of 150 ms. On I^2^C all hex values are sent to I^2^C.

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
    #
    ```

`:V` video signal parameters for RGB panels  
  hsync_polarity,  
  hsync_front_porch,  
  hsync_pulse_width,  
  hsync_back_porch,  
  vsync_polarity,  
  vsync_front_porch,  
  vsync_pulse_width,  
  vsync_back_porch,  
  pclk_active_neg,  
  
  
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
4. rotation pseudo opcode for touch panel, in case of RGB panel use only these entries 
the appropriate coordinate convervsions are defined via pseudo opcodes:<br>
0 = no conversion<br>
1 = swap and flip x<br>
2 = flip x, flip y<br>
3 = swap and flip y<br>
4 = flip x<br>
5 = flip y<br>
bit 7 = swap x,y<br>

`:A`  
3 OPCODES to set address window _(all but epaper displays)_

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
2. bit 0: DMA enables (`0` for no DMA, 1 use DMA) - not supported on all displays<br>bit 1: selects color swap, 2 = swap 16 bit color<br>bit 2: enable async DMA, `0` wait for DMA to complete before returning, `4` run DMA async in the background. This later mode is only valid if the SPI bus is not shared between the display and any other SPI device like SD Card Reader,<br>bit 3: `8` inverted busy line on epaper displays.<br>bit 4: `16` swap black and white in monochrome pictures (pushcolors, needed for bw pictures on epaper displays).

`:T`  
Wait times used for E-paper display  
1. full refresh wait in ms  
2. partial refresh wait in ms  
3. wait after update in ms  

`:f`  
codes for epaper full refresh update  

`:p`  
codes for epaper partial refresh update  
  
beside the epaper chip codes, some pseudo opcodes are supported  
EP_RESET 60,1,T = toggle reset pin T milliseconds  
EP_LUT_FULL 61,0 = switch to full update mode  
EP_LUT_PARTIAL 62,0 = switch to partial update mode  
EP_WAITIDLE 63,1,T = wait for busy pin or T milliseconds  
EP_SET_MEM_AREA 64,0 = set memory area to full screen  
EP_SET_MEM_PTR 65,0 = set memory pointer to start of screen  
EP_SEND_DATA 66,0 = send framebuffer  
EP_CLR_FRAME 67,0 = send clr data  
EP_SEND_FRAME 68,0 = complete sendframedata sequence  
EP_BREAK_RR_EQU 69,X = break when reset reason == X  
EP_BREAK_RR_NEQ 6a,X = break when reset reason != X
  
`:L`,size,OP  
Lookup table for full refresh (Waveshare 29)

`:l`,size,OP  
Lookuptable for partial refresh (Waveshare 29)

`:Lx`,size,OP  
Lookuptable for full refresh (Waveshare 42) 
`x` = 1..5  
`size` = number of bytes in table  
`OP` = opcode for sending refresh table  

`:TIx,AA,SCL,SDA,<IRQ>,<RST>`  
Defines a touch panel an I2C bus nr `x` (1 or 2)  
AA is device address  
SCL, SDA are the pins used (or * for tasmota definition)  
IRQ,RST optional IRQ and RST pins
  
`:TS,CS_PIN,(IRQ_PIN),(BUS Nr)`   
Defines a touch panel an SPI bus with chip select `CS_PIN` (or *)  
optionally defines an IRQ_PIN (or -1) and the SPI BUS number  

`:TR` 
enable simple resistive touch via data lines (e.g. cheap il9341 displays)  
  
`:M,X1,X2,Y1,Y2`
Defines an optional mapping for touch controllers (always needed on resistive touch) 
`X1` = display left margin  
`X2` = display right margin  
`Y1` = display upper margin  
`Y2` = display lower margin  
  
`:r,X`
Defines optional display rotation `X` = `0..3`

`:b,X`
Defines optional inverted backpanel `X` = `1` = use inverted logic for backpanel  

  
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
Scripter is the nost convenient way to edit and develop an uDisplay driver. On every scripter save the display is reinitialized and you immediately see results of your changes.  

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

## Universal Touch Driver (uTouch)

(`#define USE_UNIVERSAL_TOUCH`)  
This option allows to add drivers for various touch chips  
to use this you must ommit the Touch ids in normal display.ini  
instead use these IDs.  

4 sections:  

`:UTI`,FT5206,I2,38,-1,-1  
init section  
device name, up to 7 chars  
interface type:  I=I2C, S=SPI, R=resistive,  1 or 2 denotes bus number, i2c address or SPI CS pin, reset pin, irq pin

`:UTT`  
touch check call  

`:UTX`  
get x coordinate  

`:UTY`  
get y coordinate  

commands:  
input goes to array[16]  
result register holds move or compare  

DN = decimal number  
HN = hex number  

`RD HN` = read one byte  (from bytes adress)  
`RDM HN DN` = read n bytes (from bytes adress)  

`RDW HWN` = read one byte  (from word adress)  
`RDWM HWN DN` = read n bytes (from word adress)  

`WR HN HN` = write one byte  (to bytes adress)  
`WRW HWN HN` = write one byte (to word adress)  

`CP HN` = compare array[0] with immediate to result  
`CPM NUM HN1 HN2 HNx` = compare array[0] with NUM immediate numbers to result

`CPR HN` = compare result with immediate to result  

`RTF` = return when result == false with false  
`RTT` = return when result == true  with false  

`MV DN DN` = move from array index to result, second parameter: 1 = move byte, 2 = move word, 3 = move word, reverse order  

`MVB DN DN` = move byte from array index to result, par1; 0 = low, 1 = high byte, par2 = array index  

`AND HWN` = and result with immediate HEX WORD to result  

`SCL DWN FLOAT` = scale result by subtracting first paramter and multiplying with second float paramter  

`LIM DWN` = limit result with immediate word to result  

`RT` = return result  

`GSRT DN` = get result from simple resitive touch to array, parameter = threshold  

`XPT DN` = get result from XPT2046 SPI touch chip to array, parameter = threshold  

`DBG DN` = log result and first 4 array bytes, DN = id number  

example:  

```
:H,ILI9342,320,240,16,SPI,1,5,18,23,15,-1,-1,38,40
:S,2,1,3,0,100,100
:B,60,0
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
21,80
11,80
29,80
:o,28
:O,29
:A,2A,2B,2C,16
:R,36
:0,08,00,00,00
:1,A8,00,00,84
:2,C8,00,00,02
:3,68,00,00,85
:i,21,20
:UTI,FT5206,I2,38,-1,-1
RD A8
CP 11
RTF
RD A3
CP 64
RTF
RT
:UTT
RDM 00 16
MV 2 1
RT
:UTX
MV 3 2
RT
:UTY
MV 5 2
RT
#
```
### FT5206 example
```
:UTI,FT5206,I2,38,-1,-1
RD A8
CP 11
RTF
RD A3
CP 64
RTF
RT
:UTT
RDM 00 16
MV 2 1
RT
:UTX
MV 3 2
RT
:UTY
MV 5 2
RT
#
```
### XPT2046 example
```
:UTI,XPT2046,S1,21,-1,22
CPR 00
RT
:UTT
XPT 300
RT
:UTX
MV 0 2
;DBG 1
SCL 460 0.0930233
LIM 319
RT
:UTY
MV 2 2
SCL 300 0.0695652
LIM 239
RT
#
```
### GT911 example
```
:UTI,GT911,I1,5d,38,-1
RDWM 8140 4
MV 0 1
CPR 39
RTF
MV 1 1
CPR 31
RTF
MV 2 1
CPR 31
RTF
RT
:UTT
RDW 814E
MV 0 1
AND 80
CPR 80
RTF
RDWM 8150 8
WRW 814E 00
RT
:UTX
MV 0 3
RT
:UTY
MV 2 3
RT
#
```

### Simple resitive touch example
```
:UTI,SRES,R
CPR 00
RT
:UTT
GSRT 500
RT
:UTX
MV 0 2
RT
:UTY
MV 2 2
RT
#
```
