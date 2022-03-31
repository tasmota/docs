# Scripting
!!! failure "This feature is not included in precompiled binaries"

To use it you must [compile your build](Compile-your-build). Add the following to `user_config_override.h`:
```arduino
#ifndef USE_SCRIPT
#define USE_SCRIPT  // adds about 17k flash size, variable ram size
#endif
#ifdef USE_RULES
#undef USE_RULES
#endif  
```

Additional features are enabled by adding the following `#define` compiler directive parameters and then compiling the firmware. These parameters are explained further below in the article.

| Feature | Description |
| -- | -- |
USE_BUTTON_EVENT | enable `>b` section (detect button state changes)
USE_SCRIPT_JSON_EXPORT | enable `>J` section (publish JSON payload on [TelePeriod](Commands#teleperiod))
USE_SCRIPT_SUB_COMMAND | enables invoking named script subroutines via the Console or MQTT
USE_SCRIPT_HUE | enable `>H` section (Alexa Hue emulation)
USE_HOMEKIT | enable `>h` section (Siri Homekit support (ESP32 only),<br>define must be given in platform_override see below)
USE_SCRIPT_STATUS | enable `>U` section (receive JSON payloads from cmd status)
SCRIPT_POWER_SECTION | enable `>P` section (execute on power changes)
SUPPORT_MQTT_EVENT | enables support for subscribe unsubscribe
USE_SENDMAIL | enable `>m` section and support for sending e-mail<br>(on ESP32 you must add USE_ESP32MAIL)  
USE_SCRIPT_WEB_DISPLAY | enable `>W` section (modify web UI)
SCRIPT_FULL_WEBPAGE | enable ``>w`` section (seperate full web page and webserver)
USE_TOUCH_BUTTONS | enable virtual touch button support with touch displays
USE_WEBSEND_RESPONSE | enable receiving the response of [`WebSend`](Commands#websend) and [`WebQuery`](Commands#webquery) commands (received in section >E)
SCRIPT_STRIP_COMMENTS | enables stripping comments when attempting to paste a script that is too large to fit
USE_ANGLE_FUNC | add sin(x),acos(x) and sqrt(x) e.g. to allow calculation of horizontal cylinder volume
USE_SCRIPT_FATFS_EXT | enables additional FS commands   
USE_WEBCAM | enables support ESP32 Webcam which is controlled by scripter cmds
USE_FACE_DETECT | enables face detecting in ESP32 Webcam
USE_SCRIPT_TASK | enables multitasking Task in ESP32
USE_LVGL | enables support for LVGL
USE_SCRIPT_GLOBVARS | enables global variables and >G section
USE_SML_M | enables [Smart Meter Interface](Smart-Meter-Interface)
SML_REPLACE_VARS | enables posibility to replace the lines from the (SML) descriptor with Vars
USE_SML_SCRIPT_CMD | enables SML script cmds
USE_SCRIPT_I2C | enables I2C support
USE_SCRIPT_SERIAL | enables support for serial io cmds
USE_LVGL | enables support for LVGL
USE_SCRIPT_TIMER | enables up to 4 Arduino timers (so called tickers)  
SCRIPT_GET_HTTPS_JP | enables reading HTTPS JSON WEB Pages (e.g. Tesla Powerwall)
LARGE_ARRAYS | enables arrays of up to 1000 entries instead of max 127  
SCRIPT_LARGE_VNBUFF | enables to use 4096 in stead of 256 bytes buffer for variable names  
USE_GOOGLE_CHARTS | enables defintion of google charts within web section 
USE_FEXTRACT | enables array extraction from database  fxt(...)  
USE_SCRIPT_SPI | enables support for SPI interface  
USE_DSIPLAY_DUMP | enables to show epaper screen as BMP image in >w section  
----

!!! info "Scripting Language for Tasmota is an alternative to Tasmota [Rules](Rules)"

To enter a script, go to **Consoles -> Edit Script** in the Tasmota web UI menu (for version before 9.4, go to **Configuration -> Edit script**)

To save code space almost no error messages are provided. However it is taken care of that at least it should not crash on syntax errors.  

### Features

- Up to 50 variables (45 numeric and 5 strings - this may be changed by setting a compilation `#define` directive)  
- Freely definable variable names (all variable names are intentionally _**case sensitive**_)  
- Nested if,then,else up to a level of 8  
- Math operators  `+`,`-`,`*`,`/`,`%`,`&`,`|`,`^`,`<<`,`>>`  
- All operators may be used in the `op=` form, e.g., `+=`  
- Comparison operators `==`,`!=`,`>`,`>=`,`<`,`<=`  
- `and` , `or` support  
- Hexadecimal numbers with prefix `0x` are supported
- Strings support `+` and `+=` operators  
- Support for \\n \\r regular expressions on strings
- String comparison `==`, `!=`  
- String size is 19 characters (default). This can be increased or decreased by the optional parameter on the `D` section definition

#### Script Interpreter

- Execution is _**strictly sequential**_, _**line by line**_
- Evaluation is _**left to right**_ with optional brackets  
- All _**numbers are float**_, e.g., temp=hum\*(100/37.5)+temp-(timer\*hum%10)  
- _**No spaces are allowed between math operators**_
- Comments start with `;`  

#### Script buffer size
the script language normally shares script buffer with rules buffer which is 1536 chars.
with below options script buffer size may be expanded. PVARS is size for permanant vars.

| Feature | ESP8266 | ESP32 | PVARS | remarks |
| :---    | :---:   | :---: | :---: | :--- |
| fallback | 1536 | 1536 | 50 | no longer supported |
| compression (default)| 2560 | 2560 | 50 |actual compression rate may vary |
| #define USE_UFILESYS<br>#define UFSYS_SIZE S | S<=8192 | S<=16384 | 1536 | ESP8266 must use 4M Flash use linker option `-Wl,-Teagle.flash.4m2m.ld` or SDCARD  <BR>ESP32 can use any linker file, size of Filesystem depends on linker file 
| #define EEP_SCRIPT_SIZE S<br>#define USE_EEPROM<br>#define USE_24C256 | S<=8192 | S<=16384 | 1536 |for hardware eeprom only|
| #define EEP_SCRIPT_SIZE 6200<br>#define USE_EEPROM | S=6200 | not supported | 1536 | script may be lost on OTA and serial flash, not on restart |

most useful definition for larger scripts would be  

##### ESP8266

with 1M flash only default compressed mode should be used (or an SDCARD)  
a special compressed mode can enable up to 6200 chars by defining #define USE_EEPROM, #define EEP_SCRIPT_SIZE 6200  
however this has some side effects. the script may be deleted on OTA or serial update and may have to be reinstalled  after update.  

with 4M Flash best mode would be     
`#define USE_UFILESYS`     
with linker file "eagle.flash.4m2m.ld"  

##### ESP32

with all linker files  
`#define USE_UFILESYS` 


#### script init error codes
after initizialisation the script reports some info in the console e.g:  
20:21:28.259 Script: nv=51, tv=13, vns=279, vmem=3305, smem=4096  
nv = number of used variables in total (numeric and strings)  
tv = number of used string variables  
vns = total size of name strings in bytes (may not exeed 255) or #define SCRIPT_LARGE_VNBUFF extents the size to 4095  
vmem = used heap ram by the script (psram if available)  
smem = used script (text) memory (psram if available)  
  
if the script init fails an error code is reported:  
-1 = too many numerical variables defined  
-2 = too many string variables defined  
-3 = too many variables in total  
-4 = not enough memory  
-5 = variable name length too long in total  
-6 = too many arrays defined  
-7 = not enough memory  

you may increase the number of allowed variables with defines in user_config_override  
defaults and override defines:  
Numer of total variables = 50  (#define MAXVARS)  
Numer of string variables = 5  (#define MAXSVARS)  
Number of filters (arrays) = 5 (#define MAXFILT)  
Max string size            = 20 (override with >D size up to 48)  



#### Optional external editor

you may use a special external editor with syntax highlighting to edit the scripts. (mac and pc)
you may use any number of comments and indents to make it better readable.
then with cmd r the script is transfered to the ESP and immediately started.
(all comments and indents are removed before transfering)
see further info and download [here](https://www.dropbox.com/sh/0us18ohui4c3k82/AACcVmpZ4AfpdrWE_MPFGmbma?dl=0)  

#### Console Commands

`script <n>` <n>: `0` = switch script off; `1` = switch script on  
`script ><cmdline>` execute <cmdline>  
- Can be used to set variables, e.g., `script >mintmp=15`  
- Multiple statements can be specified by separating each with a semicolon, e.g. `script >mintmp=15;maxtemp=40`  
  
`script?<var>` queries a script variable `var`  

- The script itself can't be specified because the size would not fit the MQTT buffers

## Script Sections
_Section descriptors (e.g., `>E`) are **case sensitive**_  
a valid script must start with >D in the first line  
`>D ssize`   
  `ssize` = optional max string size (default=19)  
  define and init variables here, must be the first section, no other code allowed  
  `p:vname`   
  specifies permanent variables. The number of permanent variables is limited by Tasmota rules space (50 bytes) - numeric variables are 4 bytes; string variables are one byte longer than the length of string  
  `t:vname`   
  specifies countdown timers, if >0 they are decremented in seconds until zero is reached. see example below  
  `i:vname`   
  specifies auto increment counters if =0 (in seconds)  
  `g:vname`   
  specifies global variable which is linked to all global variables with the same defintion on all devices in the homenet.
  when a variable is updated in one device it is instantly updated in all other devices. if a section >G exists it is executed when a variable is updated from another device (this is done via UDP-multicast, so not always reliable)  
  `m:vname`   
   specifies a median filter variable with 5 entries (for elimination of outliers)  
  `M:vname`   
  specifies a moving average filter variable with 8 entries (for smoothing data)  
  (max 5 filters in total m+M) optional another filter length (1..127) can be given after the definition.  
  Filter vars can be accessed also in indexed mode `vname[x]` (x = `1..N`, x = `0` returns current array index pointer, x = `-1` returns arry lenght)  
  Using this filter, vars can be used as arrays, #define LARGE_ARRAYS allows for arrays up to 1000 entries  
  array may also be permanent by specifying an extra :p  
  m:p:vname defines a permanent array. Keep in mind however that in 1M Flash standard configurations you only have 50 bytes permanent storage which stands for a maximum of 12 numbers. (see list above for permanent storage in other configurations)  

!!! tip
    Keep variable names as short as possible. The length of all variable names taken together may not exceed 256 characters.  
    Memory is dynamically allocated as a result of the D section.  
    Copying a string to a number or reverse is supported  

`>B`  
executed on BOOT time before sensors are initialized and on save script  

`>BS`  
executed on BOOT time after sensors are initialized  

`>E`  
Executed when a Tasmota MQTT `RESULT` message is received, e.g., on `POWER` change. Also  Zigbee reports to  this section.

`>F`  
Executed every 100 ms  

`>S`  
Executed every second  

`>R`  
Executed on restart. p vars are saved automatically after this call  

`>T`  
Executed at least at [`TelePeriod`](Commands#teleperiod) time (`SENSOR` and `STATE`) but mostly faster up to every 100 ms, only put `tele-` vars in this section  
Remark: json variable names (like all others) may not contain math operators like - , you should set [`SetOption64 1`](Commands#setoption64) to replace `-` (_dash_) with `_` (_underscore_). Zigbee sensors will not report to this section, use E instead.

`>H`  
Alexa Hue interface (up to 32 virtual hue devices) *([example](#hue-emulation))*  
`device`,`type`,`onVars`  
Remark: hue values have a range from 0-65535. Divide by 182 to assign HSBcolors hue values.

`device` device name  
`type` device type - `E` = extended color; `S` = switch  
`onVars` assign Hue "on" extended color parameters for hue, saturation, brightness, and color temperature (hue,sat,bri,ct) to scripter variables  

!!! example 
    `lamp1,E,on=pwr1,hue=hue1,sat=sat1,bri=bri1,ct=ct1`

`>h` passcode  
Siri Homekit interface (up to 16 virtual Homekit devices)  
passcode = 111-11-111  keep this format, numbers 0-9  
`name`,`type`,`opt`,`var1`,`var2`...  

`name` device name  (max 23 characters)  
`type` device type (HAP_CID)  
- `7` = outled, on/off  
- `5` = light, on/off,hue,sat,bri  
- `10` = sensor  


`opt` sensor type  
- `0` = Temperature,val  
- `1` = Humidty,val  
- `2` = Lightlevel,val  
- `3` = Battery status,level,lowbat,charging  
- `4` = Ambient light level with extended range -10000,+10000  
- `5` = Contact Sensor (switch)

`var1 ...` variable name (max 11 characters)
the variables denote scripting variables that need to be set by script  
the special variables  
@px x (1..9) directly set, read power states e.g. relais  
@sx x (1..9) directly read switch state  
@bx x (1..9) directly read button state  

!!! example  

    `>h 111-11-111`  
    `outlet,7,0,@p1`
    `lamp1,5,0,pwr,hue,sat,bri`  
    `temperature,10,0,tval` 
    
    a restart is required after modification of descriptor!  
    by faulty parameters the homekit dataset may get corrupted  
    to reset the homekit dataset completely type in console script>hki(89)  
    
    compilation:
    
    needs to add in linker to  
    
    build_flags  
    -DUSE_HOMEKIT  
    
    lib_extra_dirs  
    lib/libesp32_div  
    
`>U`  
JSON messages from cmd status arrive here
  
`>C`  
HTML messages arrive here (on web user io event, (if defined USE_HTML_CALLBACK))  

`>G`  
global variable updated section

`>P`  
any power change triggers here (if defined SCRIPT_POWER_SECTION)

`>jp`  
https webpage json parse arrives here  

`>ti1`  
`>ti2`  
`>ti3`  
`>ti4`  
ticker callback after timer expiration


`>b` _(note lower case)_  
executed on button state change  

`bt[x]`   
read button state (x = `1.. MAX_KEYS`)  

!!! example
    ```
    >D
    tmp=0
    >b
    tmp=bt[1]
    if tmp==0  
    then  
    print falling edge of button1  
    endif  
    if tmp==1  
    then  
    print rising edge of button1  
    endif
    ```
  
`>J`  
The lines in this section are published via MQTT in a JSON payload on [TelePeriod](Commands#teleperiod). ==Requires compiling with `#define USE_SCRIPT_JSON_EXPORT `.==  

`>W`  
The lines in this section are displayed in the web UI main page. ==Requires compiling with `#define USE_SCRIPT_WEB_DISPLAY`.== 

You may put any html code here. 

- Variables may be substituted using %var%  
- HTML statements are displayed in the sensor section of the main page  
- HTML statements preceded with a `@` are displayed at the top of the page  
- USER IO elements are displayed at the top of the page  
for next loops are supported to repeat HTML code (precede with % char)
%for var from to inc
%next
script subroutines may be called sub=name of subroutine, like normal subroutines
%=#sub
in this subroutine a web line may be sent by wcs (see below) thus allowing dynamic HTML pages


A web user interface may be generated containing any of the following elements:  
**Button:**   
 `bu(vn txt1 txt2)` (up to 4 buttons may be defined in one row)  
 `vn` = name of variable to hold button state  
 `txt1` = text of ON state of button  
 `txt2` = text of OFF state of button  

**Pulldown:**   
 `pd(vn label (xs) txt1 txt2 ... txtn)`  
 `vn` = name of variable to hold selected state  
 `label` = label text  
 `xs` = optional xs (default 200) 
 `txt1` = text of 1. entry  
 `txt2` = text of 2. entry and so on  
  
**Checkbox:**   
 `ck(vn txt (xs))`  
 `vn` = name of variable to hold checkbox state  
 `txt` = label text   
 `xs` = optional xs (default 200) 

**Slider:**    
`sl(min max vn ltxt mtxt rtxt)`  
 `min` = slider minimum value  
 `max` = slider maximum value  
 `vn` = name of variable to hold slider value  
 `ltxt` = label left of slider  
 `mtxt` = label middle of slider  
 `rtxt` = label right of slider  
  
**Text Input:**    
 `tx(vn lbl (xs) (type min max))`  
 `vn` = name of string variable to hold text state  
 `lbl` = label text  
 `xs` = optional xs (default 200)  
 `type min max` = optional strings type = e.g "datetime-local" for date+time selector, min, max = date-time min max range  
  
**Time Input:**    
 `tm(vn lbl (xs))`  
 `vn` = name of number variable to hold time HHMM as number e.g. 1900 means 19:00  
 `lbl` = label text  
 `xs` = optional xs (default 70)  
  
**Number Input:**  
 `nm(min max step vn txt (xs) (prec))`  
 `min` = number minimum value  
 `max` = number maximum value  
 `step` = number step value for up/down arrows  
 `vn` = name of number variable to hold number  
 `txt` = label text  
 `xs` = optional xs (default 200)  
 `prec` = optional number precision (default 1)  
  
**special html options:**  
  `so(flags)`  
  `WSO_NOCENTER` = 1 force elements not centered  
  `WSO_NODIV` = 2 force elements not in extra \<div\>  
  `WSO_FORCEPLAIN` = 4 send line in plain (no table elements)
  
 **Google Charts:**  
  google chart support requires arrays and to make sense also permanent arrays. Therefore on 4M Flash Systems the use of `USE_UFILESYS` is recommended while on 1 M Flash Systems the special EEPROM mode should be used (see above). other options may also be needed like `LARGE_ARRAYS`  
  
  draws a google chart with up to 4 data sets per chart  
  `gc( T array1 ... array4 "name" "label1" ... "label4" "entrylabels" "header" {"maxy1"} {"maxy2"})`   
  `T` = type  
  - b=barchart  
  - c=columnchart  
  - C=combochart  
  - p=piechart  
  - l=linechart up to 4 lines with same scaling  
  - l2=linechart with exactly 2 lines and 2 y scales (must be given at end)  
  - lf2 like above but with splined lines  
  - h=histogram  
  - t=data table  
  - g=simple gauges (must give extra 3 vars after header, yellow start, red start, maxval)  
  - T=Timeline (special type arrays contains start,stop pairs in minutes timeofday)  
  
  b,l,h type may have the '2' option to specify exactly 2 arrays with 2 y scales given at the end of paramter list.  
  
  a very individual chart may be specified by splitting the chart definition and inserting the chart options directly see example below  
  
  `array` = up to 4 arrays of data  
  `name` = name of chart  
  `label` = label for up to the 4 datasets in chart  
  `entrylabel` = labels of each x axis entry separated by '|' char  
  ("cntN" starts numbering entries with the number N an optional /X generates numbers devided by X)  
  ("wdh: before a week defintion generates a week with full hours)  
  `header` = visible header name of chart  
  
  additionally you have to define the html frame to put the chart in (both lines must be preceded by a $ char)
  e.g.  
  <pre><code>$&lt;div id="chart1"style="width:640px;height:480px;margin:0 auto">&lt;/div>
  $gc(c array1 array2 "wr" "pwr1" "pwr2" "mo|di|mi|do|fr|sa|so" "Solar feed")</pre></code>
  
  you may define more then one chart. The charts id is chart1 ... chartN
  
  very customized chart definition:  
  define a chart like above, but add a t to the definition  
  this generates a google table from the arrays e.g.:  
  &gc(lt array1 array2 "wr" "pwr1" "pwr2" "mo|di|mi|do|fr|sa|so")
  
  then define the options for the graph as from the doku of google e.g.:  
  $var options = {  
  $vAxes:{0:{maxValue:40,title:'Außentemperatur'},1:{maxValue:60,title:'Solarspeicher'}},  
  $series:{0:{targetAxisIndex:0},1:{targetAxisIndex:1}},  
  $hAxis: {title: 'Wochenverlauf'},  
  $};  
  then gc(e) closes the definition   
  $gc(e)  
  
  
  
  
`>w` ButtonLabel
generates a button with the name "ButtonLabel" in Tasmota main menu.  
Clicking  this button displays a web page with the HTML data of this section.
all cmds like in >W apply here. these lines are refreshed frequently to show e.g. sensor values.
lines preceeded by $ are static and not refreshed and displayed below lines without $.  
this option also enables a full webserver interface when USE_UFILESYS is activ.  
you may display files from the flash or SD filesystem by specifying the url:  IP/ufs/path  .
(supported files: *.jpg, *.html, *.txt)  
`>w1` `>w2` `>w3` some as above `>w`  
==Requires compiling with `#define SCRIPT_FULL_WEBPAGE`.==  

  
`>M`  
[Smart Meter Interface](Smart-Meter-Interface)  

If a variable does not exist, `???` is displayed for commands  

If a Tasmota `SENSOR` or `STATUS` or `RESULT` message is not generated or a `Var` does not exist the destination variable is ==NOT== updated.  

## Special Variables

(read only)  
`upsecs` = seconds since start  
`uptime` = minutes since start  
`time` = minutes since midnight  
`sunrise` = sunrise minutes since midnight  
`sunset` = sunset minutes since midnight  
`tper` = [TelePeriod](Commands#teleperiod) (_**may be set also**_)  
`tstamp` = timestamp (local date and time)  
`topic` = mqtt topic  
`gtopic` = mqtt group topic  
`lip` = local ip as string  
`luip` = udp ip as string (from updating device when USE_SCRIPT_GLOBVARS defined)  
`prefixn` = prefix n = 1-3  
`frnm` = friendly name  
`dvnm` = device name  
`pwr[x]` = power state  (x = 1..N)  
`npwr` = number of tasmota power devices    
`pc[x]` = pulse counter value  (x = 1..4)  
`tbut[x]` = touch screen button state  (x = 1..N)  
`sw[x]` = switch state  (x = 0..N) (Switch1 = `sw[0]`)  
`bt[x]` = button state  (x = 1..N) only valid in section b  (if defined USE_BUTTON_EVENT)  
`pin[x]` = GPIO pin level (x = 0..16)  
`pn[x]` = GPIO for sensor code x. 99 if none  
`pd[x]` = defined sensor for GPIO x. 999 if none  
`adc(fac (pin))` = get adc value (on ESP32 can select pin) fac is number of averaged samples (power of 2: 0..7)  
`sht[x]` = shutter position (x = 1..N) (if defined USE_SHUTTER)  
`gtmp` = global temperature  
`ghum` = global humidity  
`gprs` = global pressure  
`pow(x y)` = calculates exponential powers x^y  
`med(n x)` = calculates a 5 value median filter of x (2 filters possible n=0,1)  
`int(x)` = gets the integer part of x (like floor)  
`hn(x)` = converts x (0..255) to a hex nibble string  
`hx(x)` = converts x (0..65535) to a hex string  
`hd("hstr")` = converts hex number string to a decimal number  
`hf("hstr")` = converts hex float number string to a decimal number  
`hf("hstr" r)` = converts hex float number string (reverse byte order) to a decimal number  
`st(svar c n)` = string token - retrieve the n^th^ element of svar delimited by c  
`ins(s1 s2)` = check if string s2 is contained in string s1, return -1 if not contained or position of conatined string  
`sl(svar)` = gets the length of a string  
`asc(svar)` = gets the binary value of 1. char of a string  
`sb(svar p n)` = gets a substring from svar at position p (if p<0 counts from end) and length n  
`is(num "string1|string2|....|stringn|")` = defines a string array optionally preset with immediate strings separated by '|' (this immediate string may be up to 255 chars long) num = 0 read only string array, num > 0 number of elements in read write string array  
`is[index]` = gets string `index` from string array, if read-write also write string of index  
`is1(..)`, `is2(...)` string array see above  
`is1[x]`, `is2[x]` string array see above  
`sin(x)` = calculates the sinus(x) (if defined USE_ANGLE_FUNC)   
`cos(x)` = calculates the cosinus(x) (if defined USE_ANGLE_FUNC)  
`acos(x)` = calculates the acos(x) (if defined USE_ANGLE_FUNC)  
`sqrt(x)` = calculates the sqrt(x) (if defined USE_ANGLE_FUNC)  
`abs(x)` = calculates the absolute value of x  
`mpt(x)` = measure pulse time, x>=0 defines pin to use, -1 returns low pulse time,-2 return high pulse time (if defined USE_ANGLE_FUNC)  
`rnd(x)` = return a random number between 0 and x, (seed may be set by rnd(-x))  
`sf(F)` = sets the CPU Frequency (ESP32) to 80,160,240 Mhz, returns current Freq.  
`s(x)` = explicit conversion from number x to string  may be preceeded by precsion digits e.g. s(2.2x) = use 2 digits before and after decimal point  
  
I2C support #define USE_SCRIPT_I2C  
`ia(AA)`, `ia2(AA)` test and set I2C device with adress AA (on BUS 1 or 2), returns 1 if device is present  
`iw(aa val)` , `iw1(aa val)`, `iw2(aa val)`, `iw3(aa val) `write val to register aa (1..3 bytes)  
`ir(aa)`, `ir1(aa)`, `ir2(aa)`, `ir3(aa)` read 1..3 bytes from register aa  
  
Serial IO support #define USE_SCRIPT_SERIAL  
`so(RXPIN TXPIN BR)` open serial port with RXPIN, TXPIN and baudrate BR with 8N1 serial mode (-1 for pin means dont use)  
`so(RXPIN TXPIN BR MMM)` open serial port with RXPIN, TXPIN and baudrate BR and serial mode e.g 7E2 (all 3 modechars must be specified)  
`so(RXPIN TXPIN BR MMM BSIZ)` open serial port with RXPIN, TXPIN and baudrate BR and serial mode e.g 7E2 (all 3 modechars must be specified) ans serial IRW buffer size  
`sc()` close serial port  
`sw(STR)` write the string STR to serial port  
`swb(NUM)` write the number char code NUM to serial port  
`sa()` returns number of bytes available on port  
`sr()` read a string from serial port, all available chars up to string size  
`sr(X)` read a string from serial port until charcode X, all available chars up to string size or until charcode X  
`srb()` read a number char code from serial port  
`sp()` read a number char code from serial port, dont remove it from serial input (peek)  
  
SPI IO support #define `USE_SCRIPT_SPI`  
`spi(0 SCLK MOSI MISO)` defines a software SPI port with pin numbers used for SCLK, MOSI, MISO.  
`spi(0 -1)` defines a hardware SPI port with pin numbers defined by Tasmota GPIO definition.  
`spi(0 -2)` defines a hardware SPI port 2 on ESP32 with pin numbers defined by Tasmota GPIO definition.  
`spi(1 N GPIO)` sets the CS pin with index N (1..4) to pin Nr GPIO.  
`spi(2 N VAL S)` sends and receives a VAL with S (1..3) bytes (8,16,24 bits)  
  
`ttget(TNUM SEL)` get tasmota timer setting from timer TNUM (1 .. 16)  
SEL:  
  0 = time  
  1 = time window  
  2 = repeat  
  3 = days  
  4 = device  
  5 = power  
  6 = mode  
  7 = arm  
`mqtts` = MQTT connection status: `0` = disconnected, `>0` = connected  
`wbut` = button status of watch side button (if defined USE_TTGO_WATCH)  
`wdclk` = double tapped on display (if defined USE_TTGO_WATCH)  
`wtch(sel)` = gets state from touch panel sel=0 => touched, sel=1 => x position, sel=2 => y position (if defined USE_TTGO_WATCH)  
`slp(time)` = sleep time in seconds, pos values => light sleep, neg values => deep sleep (if defined USE_TTGO_WATCH)  
`pl("path")` = play mp3 audio from filesystem (if defined USE_I2S_AUDIO or USE_TTGO_WATCH or USE_M5STACK_CORE2)  
`say("text")` = plays specified text to speech (if defined USE_I2S_AUDIO or USE_TTGO_WATCH or USE_M5STACK_CORE2)   
`c2ps(sel val)` = gets, sets values on ESP32 CORE2 sel=0 green led, sel=1 vibration motor, sel=2,3,4 get touch button state 1,2,3 (if defined USE_M5STACK_CORE2)  
`rec(path seconds)` = rec n seconds wav audio file from i2s microphone to filesystem path (if defined USE_I2S_AUDIO or USE_M5STACK_CORE2)  
`pwmN(-pin freq)` = defines a pwm channel N (1..N) with pin Nr and frequency (pin 0 beeing -64, N=5 with esp8266 and N=8 with esp32)  
`pwmN(val)` = outputs a pwm signal on channel N (1..N) with val (0-1023)  
`wifis` = Wi-Fi connection status: `0` = disconnected, `>0` = connected  

`wcs` = send this line to webpage (WebContentSend)  
`rapp` = append this line to MQTT (ResponseAppend)  
`wm` = contains source of web request code e.g. 0 = Sensor display (FUNC_WEB_SENSOR)  
  
`acp(dst src)` = copy array   

`sml(m 0 bd)` = set SML baudrate of Meter m to bd (baud) (if defined USE_SML_SCRIPT_CMD)  
`sml(m 1 htxt)` = send SML Hexstring htxt as binary to Meter m (if defined USE_SML_SCRIPT_CMD)  
`sml(m 2)` = reads serial data received by Meter m into string (if m<0 reads hex values, else asci values)(if defined USE_SML_SCRIPT_CMD)  
`sml(m 3 hstr)` = inserts SML Hexstring variable hstr as binary to Meter m in Output stream e.g. for special MODBUS cmds, hstr must be a string variable NO string constant (if defined USE_SML_SCRIPT_CMD)  
`sml[n]` = get value of SML energy register n (if defined USE_SML_SCRIPT_CMD)  
`smls[m]` = get value of SML meter string info of meter m (if defined USE_SML_SCRIPT_CMD)  
`smlv[n]` = get SML decode valid status of line n (1..N), returns 1 if line decoded. n=0 resets all status codes to zero (if defined USE_SML_SCRIPT_CMD)  
`enrg[n]` = get value of energy register n 0=total, 1..3 voltage of phase 1..3, 4..6 current of phase 1..3, 7..9 power of phase 1..3 (if defined USE_ENERGY_SENSOR)  
`gjp("host" "path")` = trigger HTTPS JSON page read as used by Tesla Powerwall (if defined SCRIPT_GET_HTTPS_JP)  
`gwr("del" index)` = gets non JSON element from webresponse del = delimiter char or string, index = n´th element (if defined USE_WEBSEND_RESPONSE)  
`http("url" "payload")` = does a GET or POST request on an URL (http:// is internally added)  
`tsN(ms)` = set up to 4 timers (N=1..4) to millisecond time on expiration triggers section >tiN  (if defined USE_SCRIPT_TIMER)  
`hours` = hours  
`mins` = mins  
`secs` = seconds  
`day` = day of month  
`wday` = day of week  (Sunday=1,Monday=2;Tuesday=3;Wednesday=4,Thursday=5,Friday=6,Saturday=7)  
`month` = month   
`year` = year  
`epoch` = epoch time (from 2019-1-1 00:00)  
`epoffs` = set epoch offset, (must be no longer then 2 years to fit into single float with second precision)  
`eres` = result of >E section set this var to 1 in section >E to tell Tasmota event is handled (prevents MQTT)  

The following variables are cleared after reading true:  
`chg[var]` = true if a variables value was changed (numeric vars only)  
`upd[var]` = true if a variable was updated  
`boot` = true on BOOT  
`tinit` = true on time init  
`tset` = true on time set  
`mqttc` = true on mqtt connect  
`mqttd` = true on mqtt disconnect  
`wific` = true on wifi connect  
`wifid` = true on wifi disconnect  

**System variables** (for debugging)  
`stack` = stack size  
`heap` = free heap size  
`pheap` = PSRAM free heap size (ESP32)  
`core` = current core (0 or 1)  (ESP32)  
`ram` = used ram size  
`slen` = script length  
`freq` = cpu frequency  
`micros` = running microseconds  
`millis` = running milliseconds  
`loglvl` = loglevel of script cmds (_**may be set also**_)  

Remarks:  
If you define a variable with the same name as a special variable that special variable is discarded  

## Commands

`=> <command>` Execute <command> cmd with MQTT output enabled  
`-> <command>` Execute <command> cmd with MQTT output disabled, _**recursion**_  disabled. Do not send MQTT or log messages (i.e., silent execute - useful to reduce traffic)  
`+> <command>` Execute <command> cmd with MQTT output enabled, _**recursion**_ enabled.  
!!! warning
    _**Recursion**_: If you execute a tasmota cmd in an >E section and this cmd itself executes >E you will get an infinite loop.
    this is disabled normally and enabled by the +> in case you know what you are doing

**Variable Substitution**  
- A single percent sign must be given as `%%`  
- Variable replacement within commands is allowed using `%varname%`. Optionally, the decimal places precision for numeric values may be specified by placing a digit (`%Nvarname%`, N = `0..9`) in front of the substitution variable (e.g., `Humidity: %3hum%%%` will output `Humidity: 43.271%`)  
- instead of variables arbitrary calculations my be inserted by bracketing %N(formula)%  
- Linefeed and carriage return may be defined by \n and \r  

**Special** commands:  
`print` or `=>print` prints to the log for debugging  
A Tasmota MQTT RESULT message invokes the script's `E` section. Add `print` statements to debug a script.  
    
!!! example
    ```
    >E
    slider=Dimmer
    power=POWER
    
    if upd[slider]>0
    then
    print slider updated %slider%
    endif
    
    if upd[power]>0
    then
    print power updated %power%
    endif
    ```

`break` exits a section or terminates a `for next` loop  
`dpx` sets decimal precision to x (0-9)  
`dpx.y` sets preceeding digits to x and decimal precision to y (0-9)  
`dp(x y)` sets preceeding digits to x and decimal precision to y  
`svars` save permanent vars  
`delay(x)` pauses x milliseconds (should be as short as possible)  
`beep(f l)` (ESP32) beeps with a passive piezo beeper. beep(-f 0) attaches PIN f to the beeper, beep(f l) starts a sound with frequency f (Hz) and len l (ms). f=0 stops the sound.  
`spin(x b)` set GPIO `x` (0..16) to value `b` (0,1). Only bit 0 of `b` is used - even values set the GPIO to `0` and uneven values set the GPIO to `1`  
`spinm(x m)` set GPIO `x` (0..16) to mode `m` (input=0, output=1, input with pullup=2,alternatively b may be: O=out, I=in, P=in with pullup)  
`ws2812(array dstoffset)` copies an array (defined with `m:vname`) to the WS2812 LED chain. The array length should be defined as long as the number of pixels. Color is coded as 24 bit RGB. optionally the destinationoffset in the LED chain may be given  
  if dstoffset is flagged by 0x1000, 2 values 16 bits each in an array are used for 32 bit RGBW pixels
`hsvrgb(h s v)` converts hue (0..360), saturation (0..100) and value (0..100) to RGB color  
`dt` display text command (if #define USE_DISPLAY)  

**Subroutines and Parameters**
`#name` names a subroutine. Subroutine is called with `=#name`  
`#name(param)` names a subroutine with a parameter.  
Each parameter variable must be declared in the '>D' section.  
A subroutine with multiple parameters is declared as '#name(p1 p2 p3)', i.e. spaces between parameters.  
A subroutine is invoked with `=#name(param)` or '=#name(p1 p2)  
Invoking a subroutine sets the parameter variable to the corresponding expression of the invocation. This means that parameter variables have script wide scope, i.e. they are not local variables to the subroutine.  
Subroutines end with the next `#` or `>` line or break. Subroutine invocations may be nested (each level uses about 600 bytes stack space, so nesting level should not exeed 4).  
Parameters can be numbers or strings and on type mismatch are converted.  

If `#define USE_SCRIPT_SUB_COMMAND` is included in your `user_config_override.h`, a subroutine may be invoked via the Console or MQTT using the subroutine's name. For example, a declared subroutine `#SETLED(num)` may be invoked by typing `SETLED 1` in the Console. The parameter `1` is passed into the `num` argument. This also works with string parameters. since Tasmota capitalizes all commands you must use upper case labels.  

It is possible to "replace" internal Tasmota commands. For example, if a `#POWER1(num)` subroutine is declared, the command `POWER1` is processed in the scripter instead of in the main Tasmota code.  

String parameter should be passed within double quotas: `CUSTOMCMD "Some string here"`
  
`=(svar)` executes a routine whose name is passed as a string in a variable (dynamic or self modifying code). The string has to start with `>` or `=#` for the routine to be executed.
  
a subroutine may return a value (number or string):  
`return var`

a subroutine is called with:
var=#sub(x) when returning a value  
or  
=#sub(x) when not returning a value

```
D
svar="=#subroutine"

S
=(svar)

#subroutine
print subroutine was executed
```

**For loop** (loop count must not be less than 1, no direct nesting supported)

```
for var <from> <to> <inc>  
next  
```
  
**Switch selector** (numeric or string)

```
switch x  
case a  
case b  
ends  
```

**Conditional Statements**  
There are two syntax alternatives. You may **_NOT_** mix both formats.  

```
if a==b  
and x==y  
or k==i  
then = do this  
else = do that  
endif  
```

**or**   

```
if a==b  
and x==y  
or k==i {  
  = do this  
} else {  
  = do that  
}  
```
  
Remarks:  
The last closing bracket must be on a separate line  
Calculations are permitted in conditional expressions, e.g.,  

```
if var1-var2==var3*var4
```

Conditional expressions may be enclosed in parentheses. The statement must be on a single line. e.g.,  

```
if ((a==b) and ((c==d) or (c==e)) and (s!="x"))
```

***mapping function***  

mp(x str1 str2 ... str<n>)  
It addresses a standard task with less code and much flexibility: mapping an arbitrary incoming numeric value into the allowed range.  
The numeric value x passed as the first parameter is compared to the rules in the order they are provided as subsequent sting parameters. If the value matches the criteria, the defined value is returned. Subsequent rules are skipped. If x matches none of the rules, x is returned unchanged.  

Rules consist of one of the comparison operators < > = followed by a numeric value v1, optionally followed by a colon and another numeric value v2.  

```

<|>|=v1[:v2] 
Example 1: "<8:0" - this rule reads: If x is less than 8, return 0.
Example 2: ">100" - this rule reads: If x is greater than 100, return 100.

Example 3:

y=mp(x "<8:0" ">100")
Assigns 0 to y if x is less than 8.
Assigns 100 to y if x is greater than 100.
Assigns x to y for all values of x that do not meet the above criteria (8 to 100).

The above code of example 3 does the same as the following code - with just one line of code and 15 characters less:

y=x
if x<8 {
y=0
}
if x>100 {
y=100
}

```


**E-mail**  
`#define USE_SENDMAIL`  
Enabling this feature also enables [Tasmota TLS](TLS) as `sendmail` uses SSL.  
  
`sendmail [server:port:user:passwd:from:to:subject] msg`  

!!! example
    ```
    sendmail [smtp.gmail.com:465:user:passwd:<sender@gmail.com>:<rec@gmail.com>:alarm] %string%
    ```  

    Remark:  
    A number of e-mail servers (such as Gmail) require the receiver's e-mail address to be enclosed by angle brackets `< ... >` as in example above. Most other e-mail servers also accept this format. While ESP8266 sendmail needs brackets, ESP32 sendmail inserts brackets itself so you should not specify brackets here.  

!!! warning
    Don't use your Google account password with GMAIL SMTP server.<br>
    You must create an [Application specific password](https://support.google.com/accounts/answer/185833)

The following parameters can be specified during compilation via `#define` directives in `user_config_override.h`:  
* `EMAIL_SERVER`  
* `EMAIL_PORT`  
* `EMAIL_USER`  
* `EMAIL_PASSWORD`  
* `EMAIL_FROM`  

To use any of these values, pass an `*` as its corresponding argument placeholder.  

!!! example
    `sendmail [*:*:*:*:*:<rec@gmail.com>:theSubject] theMessage`

Instead of passing the `msg` as a string constant, the body of the e-mail message may also be composed using the script `m` _(note lower case)_ section. The specified text in this script section must end with an `#` character. `sendmail` will use the `m` section if `*` is passed as the `msg` parameter. in this >m section you may also specify email attachments.  
@/filename specifies a file to be attached (if file system is present)  
&arrayname specifies an array attachment (as tab delimeted text, no file system needed)  

See [Scripting Cookbook Example].(#send-e-mail)  
 
**Subscribe, Unsubscribe**  
`#define SUPPORT_MQTT_EVENT`  
`subscribe` and `unsubscribe` commands are supported. In contrast to rules, no event is generated but the event name specifies a variable defined in `D` section and this variable is automatically set on transmission of the subscribed item  
within a script the subscribe cmd must be send with +> instead of =>  
the MQTT decoder may be configured for more space in user config overwrite by  
`#define MQTT_EVENT_MSIZE` xxx   (default is 256)  
`#define MQTT_EVENT_JSIZE` xxx   (default is 400)  

**File System Support**    
`#define USE_UFILESYS`  
optional for SD_CARD:  
`#define USE_SDCARD`  
`#define SDCARD_CS_PIN X` X = GPIO of card chip select   
SD card uses standard hardware SPI GPIO: mosi,miso,sclk  
depending on used linker file you get a flash file system with the same functionality but very low capacity (e.g. 2 MB)  
A maximum of four files may be open at a time  
e.g., allows for logging sensors to a tab delimited file and then downloading the file ([see Sensor Logging example](#sensor-logging))   
The script itself is also stored on the file system with a default size of 8192 characters  

`fr=fo("fname" m)` open file fname, mode 0=read, 1=write, 2=append (returns file reference (0-3) or -1 for error) 
(alternatively m may be: r=read, w=write, a=append)  
`res=fw("text" fr)` writes text to (the end of) file fr, returns number of bytes written  
`res=fr(svar fr)` reads a string into svar, returns bytes read. String is read until delimiter (\\t \\n \\r) or eof  
`fc(fr)` close file  
`ff(fr)` flush file, writes cached data and updates directory  
`fd("fname")` delete file fname  
`flx(fname)` create download link for file (x=1 or 2) fname = file name of file to download  
`fsm` return 1 if filesystem is mounted, (valid SD card found)  
`res=fsi(sel)` gets file system information, sel=0 returns total media size, sel=1 returns free space both in kB   
`fra(array fr)` reads array from open file with fr (assumes tab delimeted entries)  
`fwa(array fr)` writes array to open file with fr (writes tab delimited entries)  
`fz(fr)` returns file size  
`fa(fr)` returns number of available bytes in open file stream  
`fs(fr pos)` seek to file position pos  
`fwb(byte fr)` write byte to file  
`frb(fr)` read byte from file  
`frw(fr url)` read file from web url  
`fxt(fr ts_from ts_to col_offs accum array1 array2 ... arrayn)` read arrays from csv file from timestamp to timestamp with column offset and accumulate values into arrays1 .. N, assumes csv file with timestamp in 1. column and data values in colums 2 to n.(#define USE_FEXTRACT)  
`fxto(...` same as above with time optimized access  
`cts(tstamp flg)` convert timestamp to german locale format back and forth flg=0 to webformat, 1 to german format  
`tso(tstamp day flag)` add time offset in days to timestamp optional flg = char 0 zo zero time HH:MM:SS  
`tsn(tstamp)` convert timestamp to seconds  

**Extended commands**   (+0,9k flash)  
`#define USE_SCRIPT_FATFS_EXT`  
`fmd("fname")` make directory fname  
`frd("fname")` remove directory fname  
`fx("fname")` check if file fname exists  
`fe("fname")` execute script fname (max 2048 bytes, script must start with the '>' character on the first line)  

**ESP32 real Multitasking support**  
`#define USE_SCRIPT_TASK` 
enables support for multitasking scripts  
res=ct(num timer core)  
creates a task num (1 or 2)  
which is executed every timer (ms) time  
on core 0 or 1  
  
the sections are named  
\>t1 for task 1  
\>t2 for task 2  

!!! example
```
>D
>B
; create task 1 every 1000 ms on core 0
ct(1 1000 0)
; create task 2 every 3000 ms on core 1
ct(2 3000 1)

>t1
print task1 on core %core%

>t2
print task2 on core %core%

```
**minimal LVGL support**  
`#define USE_LVGL`  
to test LVGL a few functions are implemented:  
`lvgl(sel ...)` general lvgl call  
each object gets a concurrent number 1 ... N with which you can reference the object
sel = 0 => initialyze LVGL with current display
sel = 1 => clear screen  
sel = 2 xp yp xs ys text => create a button. the button press is reported in section >lvb  
sel = 3 xp yp xs ys => create a slider. the slider move is reported in section >lvs  
sel = 4 xp yp xs ys min max => create a gauge.    
set = 5 objnr value => set gauge value.  
sel = 6 xp yp xs ys text => create a label.  
sel = 7 objnr text => set label text  
sel = 8 create a keyboard, just get a look and feel  

sel = 50 => get obj nr from caller in callback >lvb or >lvs  
sel = 51 => get event nr from caller in callback >lvb or >lvs  
sel = 52 => get slider value from caller in callback >lvs  



**minimal LVGL support**  
`#define USE_LVGL`  
to test LVGL a few functions are implemented:  
`lvgl(sel ...)` general lvgl call  
each object gets a concurrent number 1 ... N with which you can reference the object
sel = 0 => initialyze LVGL with current display
sel = 1 => clear screen  
sel = 2 xp yp xs ys text => create a button. the button press is reported in section >lvb  
sel = 3 xp yp xs ys => create a slider. the slider move is reported in section >lvs  
sel = 4 xp yp xs ys min max => create a gauge.    
set = 5 objnr value => set gauge value.  
sel = 6 xp yp xs ys text => create a label.  
sel = 7 objnr text => set label text  
sel = 8 create a keyboard, just get a look and feel  

sel = 50 => get obj nr from caller in callback >lvb or >lvs  
sel = 51 => get event nr from caller in callback >lvb or >lvs  
sel = 52 => get slider value from caller in callback >lvs  

**ESP32 Webcam support**   
`#define USE_WEBCAM`  
Template for AI THINKER CAM :  
{"NAME":"AITHINKER CAM No SPI","GPIO":[4992,65504,65504,65504,65504,5088,65504,65504,65504,65504,65504,65504,65504,65504,5089,5090,0,5091,5184,5152,0,5120,5024,5056,0,0,0,0,4928,65504,5094,5095,5092,0,0,5093],"FLAG":0,"BASE":1}


remarks:  
- GPIO0 zero must be disconnected from any wire after programming because this pin drives the cam clock and does not tolerate any capictive load  
- Only boards with PSRAM should be used. To enable PSRAM board should be se set to esp32cam in common32 of platform_override.ini  
board                   = esp32cam  
- To speed up cam processing cpu frequency should be better set to 240Mhz in common32 of platform_override.ini  
board_build.f_cpu       = 240000000L  
 
file system extension:  
`fwp(pnum fr)` write picture from RAM buffer number pnum to sdcard file with file reference fr  
specific webcam commands:  
`res=wc(sel p1 p2)` controll webcam, sel = function selector  p1 ... optional parameters  
`res=wc(0 pres)` init webcam with picture resolution pres, returns 0 when error, 2 when PSRAM found, else 1  
 pres  
* `0 = FRAMESIZE_QQVGA,    // 160x120`  
* `1 = FRAMESIZE_QQVGA2,   // 128x160`  
* `2 = FRAMESIZE_QCIF,     // 176x144`  
* `3 = FRAMESIZE_HQVGA,    // 240x176`  
* `4 = FRAMESIZE_QVGA,     // 320x240`  
* `5 = FRAMESIZE_CIF,      // 400x296`  
* `6 = FRAMESIZE_VGA,      // 640x480`  
* `7 = FRAMESIZE_SVGA,     // 800x600`  
* `8 = FRAMESIZE_XGA,      // 1024x768`  
* `9 = FRAMESIZE_SXGA,     // 1280x1024`  
* `10 = FRAMESIZE_UXGA,     // 1600x1200`  

`res=wc(1 bnum)` capture picture to rambuffer bnum (1..4), returns framesize of picture or 0 when error  
`res=wc(2 sel p1)` execute various controls, details below.  
`res=wc(3)` gets picture width  
`res=wc(4)` gets picture height  
`res=wc(5 p)` start stop streaming 0=stop, 1=start  
`res=wc(6 p)` start stop motion detector, p=0 => stop detector, p=T start detector with picture every T ms, -1 get picture difference, -2 get picture brightness  
`res=wc(7 p)` start stop face detector, p=0 => stop detector, p=T start detector with picture every T ms, -1 get number of faces found in picture (USE_FACE_DETECT must be defined)  

control cmds sel =  
* 0 fs = set frame size (see above for constants)    
* 1 se = set special effect  

  - `0 = no effect`  
  - `1 = negative`  
  - `2 = black and white`  
  - `3 = reddish`  
  - `4 = greenish`  
  - `5 = blue`  
  - `6 = retro`  

* 2 fl = set horizontal flip 0,1  
* 3 mi = set vertical mirror 0,1  

to read a value without setting pass -1

* extensions to the email system on ESP32  
`#define SEND_EMAIL` and `#define USE_ESP32MAIL`  
enables specific ESP32 mail server  
this server can handle more mail servers by supporting START_TLS  
remark:  mail adresses must not be enclosed with <> because the server inserts them automatically  
this server also supports email attachments  
in the >m section you may write  
&amp;/file.txt  to attach a file from SD card  
$N   N=1..4 to attach a picture from picture RAM buffer number N  

* displaying webcam pictures in WEBUI  
you may display a webcam picture by giving the name /wc.jpg?p=N (1..4) for RAM picturebuffer N  
"&lt;img src="/wc.jpg?p=1" alt="webcam image" >"  
you may also provide the picture size  (h and v have to be preset before)  
"&lt;img src="/wc.jpg?p=1" alt="webcam image" style="width:%w%px;height:%h%px;">"  
if you precede the line by & char the image is diplayed in the main section, else in the sensor tab section  

the webcam stream can be specified by the following line  
lip is a system variable containing the local device ip   
"&&lt;br>"  
"&&lt;img src="http://%lip%:81/stream" style="width:%w%px;height:%h%px">"  
"&&lt;br>&lt;center>webcam stream"  

remark: the Flash illumination LED is connected to GPIO4

!!! example
```
    >D
    res=0
    w=0
    h=0
    mot=0
    bri=0

    >B
    ; init cam with QVGA
    res=wc(0 4)
    ; get pixel size
    w=wc(3)
    h=wc(4)
    ; start motion detector, picture every 1000 ms
    mot=wc(6 1000)

    >S
    if wific>0
    then
    ; when wifi up, start stream
    res=wc(5 1)
    endif
 
    ; get motion detect diff value
    mot=wc(6 -1)
    ; get picture brightnes
    bri=wc(6 -2)

    >W
    <center>motion diff = %mot%<br>
    <center>brightness = %bri%<br>
    ; show stream on WEBUI
    &<br>
    &<img src="http://%lip%:81/stream" style="width:%w%px;height:%h%px">
    &<br><center>webcam stream
```
    
## Scripting Cookbook

### Scripting Language Example

    a valid script must start with >D in the first line!  
    some samples still contain comment lines before >D. This is no longer valid!  
    
    **Actually this code is too large**. This is only meant to show some of the possibilities

    >D
    ; define all vars here
    p:mintmp=10  (p:means permanent)
    p:maxtmp=30
    t:timer1=30  (t:means countdown timer)
    t:mt=0
    i:count=0  (i:means auto counter)
    hello="hello world"
    string="xxx"
    url="[_IP_]";
    hum=0
    temp=0
    zigbeetemp=0
    timer=0
    dimmer=0
    sw=0
    rssi=0
    param=0

    col=""
    ocol=""
    chan1=0
    chan2=0
    chan3=0

    ahum=0
    atemp=0
    tcnt=0
    hour=0
    state=1
    m:med5=0
    M:movav=0
    ; define array with 10 entries
    m:array=0 10

    >B
    string=hello+"how are you?"
    print BOOT executed
    print %hello%
    =>mp3track 1

    ; list gpio pin definitions
    for cnt 0 16 1
    tmp=pd[cnt]
    print %cnt% = %tmp%
    next

    ; get gpio pin for relais 1
    tmp=pn[21]
    print relais 1 is on pin %tmp%

    ; pulse relais over raw gpio
    spin(tmp 1)
    delay(100)
    spin(tmp 0)

    ; raw pin level
    print level of gpio1 %pin[1]%

    ; pulse over tasmota cmd
    =>power 1
    delay(100)
    =power 0

    >T
    hum=BME280#Humidity
    temp=BME280#Temperature
    rssi=Wifi#RSSI
    string=SleepMode

    ; add to median filter
    median=temp
    ; add to moving average filter
    movav=hum

    ; show filtered results
    print %median% %movav%

    if chg[rssi]>0
    then print rssi changed to %rssi%
    endif

    if temp>30
    and hum>70
    then print damn hot!
    endif

    =#siren(5)

    ; loop nesting workaround
    ; by using subroutine
    #siren(num)
    for cnt 1 num 1
    =#stone
    next

    #stone
    for tone 2000 1000 -20
    beep(tone 10);
    delay(12)
    next

    >S
    ; every second but not completely reliable time here
    ; use upsecs and uptime or best t: for reliable timers

    ; arrays
    array[1]=4
    array[2]=5
    tmp=array[1]+array[2]

    ; call subrountines with parameters
    =#sub1("hallo")
    =#sub2(999)

    ; stop timer after expired
    if timer1==0
    then timer1=-1
    print timer1 expired
    endif

    ; auto counter with restart
    if count=10
    then print 10 seconds over
    count=0
    endif

    if upsecs%5==0
    then print %upsecs%  (every 5 seconds)
    endif

    ; not recommended for reliable timers
    timer+=1
    if timer>=5
    then print 5 seconds over (may be)
    timer=0
    endif

    dimmer+=1
    if dimmer>100
    then dimmer=0
    endif

    =>dimmer %dimmer%
    =>WebSend %url% dimmer %dimmer%

    ; show on display
    dp0
    dt [c1l1f1s2p20] dimmer=%dimmer%

    print %upsecs% %uptime% %time% %sunrise% %sunset% %tstamp%

    if time>sunset
    and time<sunrise
    then
    ; night time
    if pwr[1]==0
    then =>power1 1
    endif
    else
    ; day time
    if pwr[1]>0
    then =>power1 0
    endif
    endif

    ; clr display on boot
    if boot>0
    then dt [z]
    endif

    ; frost warning
    if ((temp<0 or zigbeetemp<0) and mt<=0)
    then =#sendmail("frost alert")
    ; alarm only every 5 minutes
    mt=300
    =mp3track 2
    endif

    ; var has been updated
    if upd[hello]>0
    then print %hello%
    endif

    ; send to Thingspeak every 60 seconds
    ; average data in between
    if upsecs%60==0
    then
    ahum>=tcnt
    atemp>=tcnt
    =WebSend [_IP_]/update?key=_token_&field1=%atemp%&field2=%ahum%
    tcnt=0
    atemp=0
    ahum=0
    else
    ahum+=hum
    atemp+=temp
    tcnt+=1
    endif

    hour=int(time/60)
    if chg[hour]>0
    then
    ; exactly every hour
    print full hour reached
    endif

    if time5 {
    print more then 5 minutes after midnight
    } else {
    print less then 5 minutes after midnight
    }

    ; publish abs hum every teleperiod time
    if mqtts>0
    and upsecs%tper==0
    then
    ; calc abs humidity
    tmp=pow(2.718281828 (17.67*temp)/(temp+243.5))
    tmp=(6.112*tmp*hum*18.01534)/((273.15+temp)*8.31447215)
    ; publish median filtered value
    =>Publish tele/%topic%/SENSOR {"Script":{"abshum":%med(0 tmp)%}}
    endif

    ;switch case state machine
    switch state
    case 1
    print state=%state% , start
    state+=1
    case 2
    print state=%state%
    state+=1
    case 3
    print state=%state%  , reset
    state=1
    ends

    ; subroutines
    #sub1(string)
    print sub1: %string%
    #sub2(param)
    print sub2: %param%

    #sendmail(string)
    =>sendmail [smtp.gmail.com:465:user:passwd:<sender@gmail.de:<rec@gmail.de:alarm] %string%

    >E
    print event executed!

    ; Assign temperature from a Zigbee sensor
    zigbeetemp=ZbReceived#0x2342#Temperature
    ; get HSBColor 1. component
    tmp=st(HSBColor , 1)

    ; check if switch changed state
    sw=sw[1]
    if chg[sw]>0
    then =>power1 %sw%
    endif

    hello="event occured"

    ; check for Color change (Color is a string)
    col=Color
    ; color change needs 2 string vars
    if col!=ocol
    then ocol=col
    print color changed  %col%
    endif

    ; or check change of color channels
    chan1=Channel[1]
    chan2=Channel[2]
    chan3=Channel[3]

    if chg[chan1]>0
    or chg[chan2]>0
    or chg[chan3]>0
    then = color has changed
    endif

    ; compose color string for red
    col=hn(255)+hn(0)+hn(0)
    =color %col%

    >R
    print restarting now

### Sensor Logging

    ; define all vars here
    ; reserve large strings
    >D 48
    hum=0
    temp=0
    fr=0
    res=0
    cnt=0
    ; moving average for 60 seconds
    M:mhum=0 60
    M:mtemp=0 60
    str=""

    >B
    ; set sensor file download link
    ;fl1("slog.txt")
    ; delete file in case we want to start fresh
    ;fd("slog.txt")

    ; list all files in root directory
    fr=fo("/" 0)
    for cnt 1 20 1
    res=fr(str fr)
    if res>0
    then
    print %cnt% : %str%
    else
    break
    endif
    next
    fc(fr)

    >T
    ; get sensor values
    temp=BME280#Temperature
    hum=BME280#Humidity

    >S
    ; average sensor values every second
    mhum=hum
    mtemp=temp

    ; write average to sensor log every minute
    if upsecs%60==0
    then
    ; open file for write
    fr=fo("slog.txt" 1)
    ; compose string for tab delimited file entry
    str=s(upsecs)+"\t"+s(mhum)+"\t"+s(mtemp)+"\n"
    ; write string to log file
    res=fw(str fr)
    ; close file
    fc(fr)
    endif

    >R
    
### global variables example

make temperature and humidity of an SHT sensor public  
all devices in the local network may use the global variables
needs #define USE_SCRIPT_GLOBVARS  

Sender:

    >D
    g:temp=0
    g:hum=0
    
    >T
    temp=SHT3X_0x44#Temperature
    hum=SHT3X_0x44#Humidity
    
Receiver(s) displays the value on a display

    >D
    g:temp=0
    g:hum=0
    
    >S
    dt [l1c1p10]temp=%temp% C
    dt [l2c1p10]hum=%hum% %%
    

### e-Paper 29 Display with SGP30 and BME280

Some variables are set from ioBroker

    >D
    hum=0
    temp=0
    press=0
    ahum=0
    tvoc=0
    eco2=0
    zwz=0
    wr1=0
    wr2=0
    wr3=0
    otmp=0
    pwl=0
    tmp=0
    ; preset units in case they are not available
    punit="hPa"
    tunit="C"

    >B
    ;reset auto draw
    dt [zD0]
    ;clr display and draw a frame
    dt [x0y20h296x0y40h296]

    >T
    ; get telemetry sensor values
    temp=BME280#Temperature
    hum=BME280#Humidity
    press=BME280#Pressure
    tvoc=SGP30#TVOC
    eco2=SGP30#eCO2
    ahum=SGP30#aHumidity
    tunit=TempUnit
    punit=PressureUnit

    >S
    ; update display every [`TelePeriod`](Commands#teleperiod)
    if upsecs%tper==0
    then
    dp2
    dt [f1p7x0y5]%temp% %tunit%
    dt [p5x70y5]%hum% %%[x250y5t]
    dt [p11x140y5]%press% %punit%
    dt [p10x30y25]TVOC: %tvoc% ppb
    dt [p10x160y25]eCO2: %eco2% ppm
    dt [p10c26l5]ahum: %ahum% g^m3

    dp0
    dt [p25c1l5]WR 1 (Dach)  : %wr1% W
    dt [p25c1l6]WR 2 (Garage): %-wr3% W
    dt [p25c1l7]WR 3 (Garten): %-wr2% W
    dt [p25c1l8]Aussentemperatur: %otmp% C
    dt [x170y95r120:30f2p6x185y100] %pwl% %%
    ; now update screen
    dt [d]
    endif

    >E

    >R

### e-Paper 42 Display with SHT31 and BME280

This script shows 2 graphs on an 4.2 inch e-Paper display: 1. some local sensors, and 2. power statistics  

- The first graph is the battery level of a solar battery (Tesla PowerWall 2)  
- The second graph shows the solar yield of the roof panels in Watts  
- Another special feature is that this script displays daily and weekly averages (via moving average) of all power IO of the house.  
- it sends an email every sunday night with the weekly data  
- it displays a google bar chart on the webui with values for each weekday of the last week  
- ESP32 CPU with SD card 
- Since the display is a full update panel it is updated only once a minute  
- Some values (like power meters) are set remotely from ioBroker  

----------------  

    >D
    hum=0
    temp=0
    press=0
    zwz=0
    wr1=0
    wr2=0
    wr3=0
    otmp=0
    pwl=0
    ez1=0
    sez1=0
    M:mez1=0 7
    ezh=0
    sezh=0
    M:mezh=0 7
    vzh=0
    svzh=0
    M:mvzh=0 7
    wd=0
    res=0    
    hr=0
    t1=0
    res=0
    
    >B
    ->setoption64 1
    tper=30
    
    dt [IzD0]
    dt [zG10352:5:40:-350:80:10080:0:100f3x360y40]100 %%[x360y115]0 %%
    dt [f1x100y25]Powerwall - 7 Tage[f1x360y75] 0 %%
    dt [G10353:5:140:-350:80:10080:0:5000f3x360y140]+5000 W[x360y215]0 W
    dt [f1x70y125]Volleinspeisung - 7 Tage[f1x360y180] 0 W
    dt [p13x10y230]WR 1,2,3:
    dt [p13x10y245]H-Einsp.:
    dt [p13x10y260]H-Verbr.:
    dt [p13x10y275]D-Einsp.:
    dt [d]
    
    dt [Gr0:/g0_sav.txt:]
    dt [Gr1:/g1_sav.txt:]
    
    beep(-25 0)
    beep(1000 100)
    
    >T
    press=BMP280#Pressure
    temp=SHT3X_0x44#Temperature
    hum=SHT3X_0x44#Humidity
    
    >S
    
    if upsecs%60==0
    then
    dp2
    dt [f1p7x0y5]%temp% C
    dt [x0y20h400x250y5T][x350t][f1p10x70y5]%hum% %%
    dt [p10x140y5]%press% hPa
    dp0
    dt [p5x360y75]%pwl% %%
    dt [p6x360y180]%wr1%W
    dt [g0:%pwl%g1:%wr1%]
    
    dt [p24x75y230] %wr1% W : %-wr2% W : %-wr3% W
    dt [p-10x75y245]%ezh% kWh
    dt [p-10x75y260]%vzh% kWh
    dt [p-10x75y275]%ez1% kWh
    
    t1=mezh*7
    dt [p-10x150y245]: %t1% kWh
    t1=mvzh*7
    dt [p-10x150y260]: %t1% kWh
    t1=mez1*7
    dt [p-10x150y275]: %t1% kWh
    
    dp1
    t1=ezh-sezh
    dt [p12x250y245]: %t1% kWh
    t1=vzh-svzh
    dt [p12x250y260]: %t1% kWh
    t1=ez1-sez1
    dt [p12x250y275]: %t1% kWh
    
    dp0
    dt [f2p5x320y250] %otmp%C
    
    dt [d]
    print updating display
    endif
    
    hr=hours
    if chg[hr]>0
    and hr==0
    then
    mez1=ez1-sez1
    sez1=ez1
    mezh=ezh-sezh
    sezh=ezh
    mvzh=vzh-svzh
    svzh=vzh
    endif
    
    if sezh==0
    then
    sez1=ez1
    sezh=ezh
    svzh=vzh
    endif
    
    wd=wday
    if chg[wd]>0
    and wd==1
    then
    =>sendmail [*:*:*:*:*:user.tasmota@gmail.com: Wochenbericht]*
    print sending email
    endif


    if upsecs%300==0
    then
    =#savgraf
    print saving graph
    endif
    
    #savgraf
    dt [Gs0:/g0_sav.txt:]
    dt [Gs1:/g1_sav.txt:]

    >m
    Wochenbericht Einspeisung und Verbrauch<br><br>
    w1=%mez1[1]%,%mez1[2]%,%mez1[3]%,%mez1[4]%,%mez1[5]%,%mez1[6]%,%mez1[7]%,%mez1[8]%<br>
    w2=%mezh[1]%,%mezh[2]%,%mezh[3]%,%mezh[4]%,%mezh[5]%,%mezh[6]%,%mezh[7]%,%mezh[8]%<br>
    w3=%mvzh[1]%,%mvzh[2]%,%mvzh[3]%,%mvzh[4]%,%mvzh[5]%,%mvzh[6]%,%mvzh[7]%,%mvzh[8]%<br>
    #
    >W
    &<br><div id="container"style="width:640px;height:480px;margin:0 auto"></div><br>
    &<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    &<script type="text/javascript">google.charts.load('current',{packages:['corechart']});</script>
    &<script language="JavaScript">function drawChart(){var data=
    &google.visualization.arrayToDataTable([
    &['weekday','Power'],['Mo',%mvzh[1]%],['Di',%mvzh[2]%],['Mi',%mvzh[3]%],['Do',%mvzh[4]%],
    &['Fr',%mvzh[5]%],['Sa',%mvzh[6]%],['So',%mvzh[7]%]]);
    &var options={title:'daily solar feed',isStacked:true};
    &var chart=new 
    &google.visualization.ColumnChart(document.getElementById('container'));chart.draw(data,options);}
    &google.charts.setOnLoadCallback(drawChart);</script>
    #


### ILI 9488 Color LCD Display with BMP280 and VL5310X

Shows various BMP280 energy graphs
Turn display on and off using VL5310X proximity sensor to prevent burn-in

Some variables are set from ioBroker

    >D
    temp=0
    press=0
    zwz=0
    wr1=0
    wr2=0
    wr3=0
    otmp=0
    pwl=0
    tmp=0
    dist=0
    punit="hPa"
    tunit="C"
    hour=0

    >B
    dt [z]

    // define 2 graphs, 2. has 3 tracks
    dt [zCi1G2656:5:20:400:80:1440:-5000:5000:3Ci7f3x410y20]+5000 W[x410y95]-5000 W [Ci7f1x70y3] Zweirichtungsz~80hler - 24 Stunden
    dt  [Ci1G2657:5:120:400:80:1440:0:5000:3Ci7f3x410y120]+5000 W[x410y195]0 W [Ci7f1x70y103] Wechselrichter 1-3 - 24 Stunden
    dt [Ci1G2658:5:120:400:80:1440:0:5000:16][Ci1G2659:5:120:400:80:1440:0:5000:5]
    dt [f1s1b0:260:260:100&#8203;:50:2:11:4:2:Rel 1:b1:370:260:100&#8203;:50:2:11:4:2:Dsp off:]
    =>mp3volume 100
    =>mp3track 4

    >T
    ; get some telemetry values
    temp=BMP280#Temperature
    press=BMP280#Pressure
    tunit=TempUnit
    punit=PressureUnit
    dist=VL53L0X#Distance

    ; check proximity sensor to turn display on and off to prevent burn-in
    if dist>300
    then
    if pwr[2]>0
    then
    =>power2 0
    endif
    else
    if pwr[2]==0
    then
    =>power2 1
    endif
    endif

    >S
    ; update graph every teleperiod
    if upsecs%tper==0
    then
    dp2
    dt [f1Ci3x40y260w30Ci1]
    dt [Ci7x120y220t]
    dt [Ci7x180y220T]
    dt [Ci7p8x120y240]%temp% %tunit%
    dt [Ci7x120y260]%press% %punit%
    dt [Ci7x120y280]%dist% mm
    dp0
    dt [g0:%zwz%g1:%wr1%g2:%-wr2%g3:%-wr3%]
    if zwz0
    then
    dt [p-8x410y55Ci2Bi0]%zwz% W
    else
    dt [p-8x410y55Ci3Bi0]%zwz% W
    endif
    dt [p-8x410y140Ci3Bi0]%wr1% W
    dt [p-8x410y155Ci16Bi0]%-wr2% W
    dt [p-8x410y170Ci5Bi0]%-wr3% W
    endif

    ; chime every full hour
    hour=int(time/60)
    if chg[hour]>0
    then ->mp3track 4
    endif

    >E

    >R

### LED Bar Display with WS2812 LED Chain

Used to display home's solar power input/output (+-5000 Watts)

    >D
    m:array=0 60 ;defines array for 60 led pixels
    cnt=0
    val=0
    ind=0
    ; rgb values for grid
    colr1=0x050000
    colr2=0x050100
    colg1=0x000300
    colg2=0x020300
    ledbar=0
    blue=64
    pixels=60
    steps=10
    div=0
    tog=0
    max=5000
    min=-5000
    pos=0

    >B
    div=pixels/steps
    =#prep
    ws2812(array)

    ; ledbar is set from broker

    >S
    if ledbar<min
    then ledbar=min
    endif

    if ledbar>max
    then ledbar=max
    endif

    pos=(ledbar/max)*(pixels/2)
    if ledbar>0
    then
    pos+=(pixels/2)
    if pospixels-1
    then pos=pixels
    endif
    else
    pos+=(pixels/2)+1
    if pospixels-1
    then pos=1
    endif
    endif

    if pos<1
    or pos>pixels
    then pos=1
    endif

    =#prep
    if ledbar==0
    then
    array[pos]=blue
    array[pos-1]=blue
    else
    array[pos]=blue
    endif

    ; only used if power is off
    ; so lets may be used normally if on
    if pwr[1]==0
    then
    ws2812(array)
    endif

    ; subroutine for grid
    #prep
    for cnt 1 pixels 1
    ind+=1
    if ind>div
    then ind=1
    tog^=1
    endif

    if cnt<=pixels/2
    then
    if tog>0
    then val=colr1
    else val=colr2
    endif
    else
    if tog>0
    then val=colg1
    else val=colg2
    endif
    endif
    array[cnt]=val
    next

    >R

### Multiple IR Receiver Synchronization

Shows how a Magic Home with IR receiver works
Synchronizes 2 Magic Home devices by also sending the commands to a second Magic Home via [`WebSend`](Commands#websend)

**Script example using `if then else`**
    ; expand default string length to be able to hold `WebSend [xxx.xxx.xxx.xxx]`  

    >D 25
    istr=""
    ws="WebSend [_IP_]"

    ; event section
    >E
    ; get ir data
    istr=IrReceived#Data

    ; on
    if istr=="0x00F7C03F"
    then
    ->wakeup
    ->%ws% wakeup
    endif

    ; off
    if istr=="0x00F740BF"
    then
    ->power1 0
    ->%ws% power1 0
    endif

    ;white
    if istr=="0x00F7E01F"
    then
    ->color 000000ff
    ->%ws% color 000000ff
    endif

    ;red
    if istr=="0x00F720DF"
    then
    ->color ff000000
    ->%ws% color ff000000
    endif

    ;green
    if istr=="0x00F7A05F"
    then
    ->color 00ff0000
    ->%ws% color 00ff0000
    endif

    ;blue
    if istr=="0x00F7609F"
    then
    ->color 0000ff00
    ->%ws% color 0000ff00
    endif

    ; dimmer up
    if istr=="0x00F700FF"
    then
    ->dimmer +
    ->%ws% dimmer +
    endif

    ;dimmer down  
    if istr=="0x00F7807F"  
    then  
    ->dimmer -  
    ->%ws% dimmer -  
    endif

    istr=""

**Script example using `switch case ends`**
    ; expand default string length to be able to hold `WebSend [xxx.xxx.xxx.xxx]`  

    >D 25
    istr=""
    ws="WebSend [_IP_]"

    ; event section
    >E
    ; get ir data
    istr=IrReceived#Data

    switch istr
    ; on
    case "0x00F7C03F"
    ->wakeup
    ->%ws% wakeup

    ;off
    case "0x00F740BF"
    ->power1 0
    ->%ws% power1 0

    ;white
    case "0x00F7E01F"
    ->color 000000ff
    ->%ws% color 000000ff

    ;red
    case "0x00F720DF"
    ->color ff000000
    ->%ws% color ff000000

    ;green
    case "0x00F7A05F"
    ->color 00ff0000
    ->%ws% color 00ff0000

    ;blue
    case "0x00F7609F"
    ->color 0000ff00
    ->%ws% color 0000ff00

    ; dimmer up
    case "0x00F700FF"
    ->dimmer +
    ->%ws% dimmer +

    ; dimmer down
    case "0x00F7807F"
    ->dimmer -
    ->%ws% dimmer -
    ends

    istr=""

### Fast Polling

    ; expand default string length to be able to hold `WebSend [xxx.xxx.xxx.xxx]`  
    >D 25
    sw=0
    ws="WebSend [_IP_]"
    timer=0
    hold=0
    toggle=0

    >B
    ; gpio 5 button input
    spinm(5,0)

    ; fast section 100ms
    >F
    sw=pin[5]
    ; 100 ms timer
    timer+=1

    ; 3 seconds long press
    ; below 0,5 short press
    if sw==0
    and timer5
    and timer<30
    then
    ; short press
    ;print short press
    toggle^=1
    =>%ws% power1 %toggle%
    endif

    if sw>0
    then
    ;pressed
    if timer>30
    then
    ; hold
    hold=1
    ;print hold=%timer%
    if toggle>0
    then
    =>%ws% dimmer +
    else
    =>%ws% dimmer -
    endif
    endif
    else
    timer=0
    hold=0
    endif

### Web UI

An example to show how to implement a web UI. This example controls a light via `WebSend`

    >D
    dimmer=0
    sw=0
    color=""
    col1=""
    red=0
    green=0
    blue=0
    ww=0

    >F
    color=hn(red)+hn(green)+hn(blue)+hn(ww)
    if color!=col1
    then
    col1=color
    =>websend [192.168.178.75] color %color%
    endif

    if chg[dimmer]>0
    then  
    =>websend [192.168.178.75] dimmer %dimmer%
    endif

    if chg[sw]>0
    then
    =>websend [192.168.178.75] power1 %sw%
    endif

    >W
    bu(sw "Light on" "Light off")
    ck(sw "Light on/off   ")
    sl(0 100 dimmer "0" "Dimmer" "100")
    sl(0 255 red "0" "red" "255")
    sl(0 255 green "0" "green" "255")
    sl(0 255 blue "0" "blue" "255")
    sl(0 255 ww "0" "warm white" "255")
    tx(color "color:   ")

### Hue Emulation

An example to show how to respond to Alexa requests via Hue Emulation

When Alexa sends on/off, dimmer, and color (via hsb), send commands to a MagicHome device

    >D
    pwr1=0
    hue1=0
    sat1=0
    bri1=0
    tmp=0
      
    >E
    if upd[hue1]>0
    or upd[sat1]>0
    or upd[bri1]>0
    then
    tmp=hue1/182
    ->websend [192.168.178.84] hsbcolor %tmp%,%sat1%,%bri1%
    endif

    if upd[pwr1]>0
    then
    ->websend [192.168.178.84] power1 %pwr1%
    endif
      
    >H
    ; on,hue,sat,bri,ct
    livingroom,E,on=pwr1,hue=hue1,sat=sat1,bri=bri1

### Alexa Controlled MCP230xx I^2^C GPIO Expander

Uses Tasmota's Hue Emulation capabilities for Alexa interface

    ; define vars
    >D
    p:p1=0
    p:p2=0
    p:p3=0
    p:p4=0
      
    ; init ports
    >B
    ->sensor29 0,5,0
    ->sensor29 1,5,0
    ->sensor29 2,5,0
    ->sensor29 3,5,0
    ->sensor29 0,%0p1%
    ->sensor29 1,%0p2%
    ->sensor29 2,%0p3%
    ->sensor29 3,%0p4%
      
    ; define Alexa virtual devices
    >H
    port1,S,on=p1
    port2,S,on=p2
    port3,S,on=p3
    port4,S,on=p4
      
    ; handle events
    >E
    print EVENT
      
    if upd[p1]>0
    then
    ->sensor29 0,%0p1%
    endif
    if upd[p2]>0
    then
    ->sensor29 1,%0p2%
    endif
    if upd[p3]>0
    then
    ->sensor29 2,%0p3%
    endif
    if upd[p4]>0
    then
    ->sensor29 3,%0p4%
    endif
  
    =#pub
  
    ; publish routine
    #pub
    =>publish stat/%topic%/RESULT {"MCP23XX":{"p1":%0p1%,"p2":%0p2%,"p3":%0p3%,"p4":%0p4%}}
    svars
  
    ; web interface
    >W
    bu(p1 "p1 on" "p1 off")bu(p2 "p2 on" "p2 off")bu(p3 "p3 on" "p3 off")bu(p4 "p4 on" "p4 off")

### Retrieve network gateway IP Address

    >D
    gw=""

    ; Request Status information. The response will trigger the `U` section
    >B
    +>status 5

    ; Read the status JSON payload
    >U
    gw=StatusNET#Gateway
    print %gw%


 
### Send e-mail

    >D 25
    day1=0
    et=0
    to="<mrx@gmail.com>"

    >T
    et=ENERGY#Total

    >S
    ; send at midnight
    day1=day
    if chg[day1]>0
    then
    =>sendmail [*:*:*:*:*:%to%:energy report]*
    endif

    >m
    email report at %tstamp%
    your power consumption today was %et% KWh
    #

### Switching and Dimming By Recognizing Mains Power Frequency

Switching in Tasmota is usually done by High/Low (+3.3V/GND) changes on a GPIO. However, for devices like the [Moes QS-WiFi-D01 Dimmer](https://templates.blakadder.com/qs-wifi_D01_dimmer.html), this is achieved by a pulse frequency when connected to the GPIO, and these pulses are captured by `Counter1` in Tasmota.

![pushbutton-input](https://user-images.githubusercontent.com/36734573/61955930-5d90e480-afbc-11e9-8d7e-00ac526874d3.png)

- When the **light is OFF** and there is a **short period** of pulses - then turn the light **ON** at the previous dimmer level.
- When the **light is ON** and there is a **short period** of pulses - then turn the light **OFF**.
- When there is a longer period of pulses (i.e., **HOLD**) - toggle dimming direction and then adjust the brightness level as long as the button is pressed or until the limits are reached.

[Issue 6085](https://github.com/arendst/Tasmota/issues/6085#issuecomment-512353010)

In the Data Section D at the beginning of the Script the following initialization variables may be changed:

dim multiplier = `0..2.55` set the dimming increment value
dim lower limit = range for the dimmer value for push-button operation (set according to your bulb); min 0
dim upper limit = range for the dimmer value for push-button operation (set according to your bulb); max 100
start dim level = initial dimmer level after power-up or restart; max 100


    >D
    sw=0
    tmp=0
    cnt=0
    tmr=0
    hold=0
    powert=0
    slider=0
    dim=""
    shortprl=2 ;short press lo limit
    shortpru=10;short press up limit
    dimdir=0   ;dim direction 0/1
    dimstp=2   ;dim step/speed 1 to 5
    dimmlp=2.2 ;dim multiplier
    dimll=15   ;dim lower limit
    dimul=95   ;dim upper limit
    dimval=70  ;start dim level
      
    >B
    print "WiFi-Dimmer-Script-v0.2"
    =>Counter1 0
    =>Baudrate 9600
    ; boot sequence
    =#senddim(dimval)
    delay(1000)
    =#senddim(0)
      
    >F
    cnt=pc[1]
    if chg[cnt]>0
    ; sw pressed
    then sw=1
    else sw=0
    ; sw not pressed
    endif

    ; 100ms timer
    tmr+=1

    ; short press
    if sw==0
    and tmr>shortprl
    and tmr<shortpru
    then
    powert^=1

    ; change light on/off
    if powert==1
    then
    =#senddim(dimval)
    else
    =#senddim(0)
    endif
    endif


    ; long press
    if sw>0
    then
    if hold==0
    then

    ; change dim direction
    dimdir^=1
    endif
    if tmr>shortpru
    then
    hold=1
    if powert>0
    ; dim when on & hold
    then
    if dimdir>0
    then

    ; increase dim level
    dimval+=dimstp
    if dimval>dimul  
    then

    ; upper limit
    dimval=dimul
    endif
    =#senddim(dimval)
    else

    ; decrease dim level
    dimval-=dimstp
    if dimval<dimll
    then

    ; lower limit
    dimval=dimll
    endif
    =#senddim(dimval)
    endif
    endif
    endif
    else
    tmr=0
    hold=0
    endif
      
    >E
    slider=Dimmer

    ; slider change
    if chg[slider]>0
    then

    ; dim according slider
    if slider>0
    then
    dimval=slider
    =#senddim(dimval)
    else
    powert=0
    =#senddim(0)
    endif
    endif

    if pwr[1]==1
    ; on/off webui
    then
    powert=1
    =#senddim(dimval)
    else
    powert=0
    =#senddim(0)
    endif

    ; subroutine dim
    #senddim(tmp)
    dim="FF55"+hn(tmp*dimmlp)+"05DC0A"
    =>SerialSend5 %dim%
    =>Dimmer %tmp%
    #

### Dual display example

    >D
    >B
    ; load sh1106 driver
    dt [S2/SH1106_desc.txt:]
    ; clear screen, switch to LCD font; set auto draw
    dt [zf4s1D1]
    dt [S1:]
    >S
    ; switch to display 2
    dt [S2:]
    ; show time
    dt [x20y20t]
    ; switch back to display 1
    dt [S1:]

### read I2C example (AXP192)

    >D
    volt=0
    curr=0
    found=0
    >B
    ; check device on I2C bus Nr.2
    found=ia2(0x34)
    
    >S
    ; if found read registers, (this example takes 2ms to read both values)
    if found>0 {
    volt=ir(0x5a)<<4|ir(0x5b)*1.7/1000
    curr=ir(0x58)<<4|ir(0x59)*0.625
    }
    
    >W
    ; show on webui
    Bus Voltage{m}%volt% V
    Bus Current{m}%curr% mA


### Multiplexing a single adc with CD4067 breakout

    >D
    ; this script works with an CD4067 breakout to multiplex a single ADC channel
    ; of an ESP
    IP=192.168.178.177
    SB=8192
    res=0
    cnt=0
    mcnt=0
    m:mux=0 16
    
    >B
    ; define output pins for multiplexer
    spinm(12 O)
    spinm(13 O)
    spinm(14 O)
    spinm(15 O)
    ; define string array with 16 entries
    res=is1(16 "")
    is1[1]="Azalea"
    is1[2]="Aster"
    is1[3]="Bougainvillea"
    is1[4]="Camellia"
    is1[5]="Carnation"
    is1[6]="Chrysanthemum"
    is1[7]="Clematis"
    is1[8]="Daffodil"
    is1[9]="Dahlia"
    is1[10]="Daisy"
    is1[11]="Edelweiss"
    is1[12]="Fuchsia"
    is1[13]="Gladiolus"
    is1[14]="Iris"
    is1[15]="Lily"
    is1[16]="Periwinkle"
    
    >F
    ; get adc value into array, average 4 values
    ; this is for ESP32 here on pin 32
    mux[mcnt+1]=adc(4 32)
    ; this is for ESP8266 it has only 1 ADC input
    ; mux[mcnt+1]=adc(4)
    mcnt+=1
    if mcnt>=16
    then
    mcnt=0
    endif
    ; set multiplexer
    spin(12 mcnt)
    spin(13 mcnt/2)
    spin(14 mcnt/4)
    spin(15 mcnt/8)
    
    ; display web UI
    #wsub
    if wm==0
    then
    for cnt 1 16 1
    wcs  {s}Ch %0cnt%: %is1[cnt]%{m}%mux[cnt]% %%{e}
    next
    endif
    
    >J
    ; send to mqtt
    ,"CD4067":{
    "%is1[1]%":%mux[1]%,
    "%is1[2]%":%mux[2]%,
    "%is1[3]%":%mux[3]%,
    "%is1[4]%":%mux[4]%,
    "%is1[5]%":%mux[5]%,
    "%is1[6]%":%mux[6]%,
    "%is1[7]%":%mux[7]%,
    "%is1[8]%":%mux[8]%,
    "%is1[9]%":%mux[9]%,
    "%is1[10]%":%mux[10]%,
    "%is1[11]%":%mux[11]%,
    "%is1[12]%":%mux[12]%,
    "%is1[13]%":%mux[13]%,
    "%is1[14]%":%mux[14]%,
    "%is1[15]%":%mux[15]%,
    "%is1[16]%":%mux[16]%
    }
    
    >W
    ; call web subroutine
    %=#wsub

