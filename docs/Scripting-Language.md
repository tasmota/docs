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
USE_SCRIPT_STATUS | enable `>U` section (receive JSON payloads)
SCRIPT_POWER_SECTION | enable `>P` section (execute on power changes)
SUPPORT_MQTT_EVENT | enables support for subscribe unsubscribe  
USE_SENDMAIL | enable `>m` section and support for sending e-mail   
USE_SCRIPT_WEB_DISPLAY | enable `>W` section (modify web UI)
USE_TOUCH_BUTTONS | enable virtual touch button support with touch displays
USE_WEBSEND_RESPONSE | enable receiving the response of a [`WebSend`](Commands#websend) command (received in section >E)
SCRIPT_STRIP_COMMENTS | enables stripping comments when attempting to paste a script that is too large to fit
USE_ANGLE_FUNC | add sin(x),acos(x) and sqrt(x) e.g. to allow calculation of horizontal cylinder volume
USE_24C256 | enables use of 24C256 I^2^C EEPROM to expand script buffer (defaults to 4k)
USE_SCRIPT_FATFS | enables SD card support (on SPI bus). Specify the CS pin number. Also enables 4k script buffer on ESP8266 if using device with 4 or more Mb can enable FS by specifying -1 (using linker files with enabled FS Buffer e.g. eagle.flash.4m1m.ld)  
USE_SCRIPT_FATFS_EXT | enables additional FS commands  
SDCARD_DIR | enables support for web UI for SD card directory upload and download  
USE_WEBCAM | enables support ESP32 Webcam which is controlled by scripter cmds
USE_FACE_DETECT | enables face detecting in ESP32 Webcam
USE_SCRIPT_TASK | enables Task in ESP32
USE_SML_SCRIPT_CMD | enables SML script cmds
USE_SCRIPT_COMPRESSION | enables compression of scripts (2560 chars buffer, ESP8266 only)  
LITTLEFS_SCRIPT_SIZE S | enables script buffer of size S (e.g.8192, ESP32)  
USE_GOOGLE_CHARTS | enables defintion of google charts within web section 
----

!!! info "Scripting Language for Tasmota is an alternative to Tasmota [Rules](Rules)"

To enter a script, go to **Configuration - Edit script** in the Tasmota web UI menu

The maximum script size is 1535 bytes (uses rule set buffers). If the pasted script is larger than 1535 characters, comments will be stripped to attempt to  make the script fit.  

To save code space almost no error messages are provided. However it is taken care of that at least it should not crash on syntax errors.  

### Features

- Up to 50 variables (45 numeric and 5 strings - this may be changed by setting a compilation `#define` directive)  
- Freely definable variable names (all variable names are intentionally _**case sensitive**_)  
- Nested if,then,else up to a level of 8  
- Math operators  `+`,`-`,`*`,`/`,`%`,`&`,`|`,`^`  
- All operators may be used in the `op=` form, e.g., `+=`  
- Comparison operators `==`,`!=`,`>`,`>=`,`<`,`<=`  
- `and` , `or` support  
- Hexadecimal numbers with prefix `0x` are supported
- Strings support `+` and `+=` operators  
- Support for \\n \\r regular expressions on strings
- String comparison `==`, `!=`  
- String size is 19 characters (default). This can be increased or decreased by the optional parameter on the `D` section definition

**Script Interpreter**  

- Execution is _**strictly sequential**_, _**line by line**_
- Evaluation is _**left to right**_ with optional brackets  
- All _**numbers are float**_, e.g., temp=hum\*(100/37.5)+temp-(timer\*hum%10)  
- _**No spaces are allowed between math operators**_
- Comments start with `;`  

**Console Commands**   

`script <n>` <n>: `0` = switch script off; `1` = switch script on  
`script ><cmdline>` execute <cmdline>  
- Can be used to set variables, e.g., `script >mintmp=15`  
- Multiple statements can be specified by separating each with a semicolon, e.g. `script >mintmp=15;maxtemp=40`  
- The script itself can't be specified because the size would not fit the MQTT buffers

## Script Sections
_Section descriptors (e.g., `>E`) are **case sensitive**_  
`>D ssize`   
  `ssize` = optional max string size (default=19)  
  define and init variables here, must be the first section, no other code allowed  
  `p:vname`   
  specifies permanent variables. The number of permanent variables is limited by Tasmota rules space (50 bytes) - numeric variables are 4 bytes; string variables are one byte longer than the length of string  
  `t:vname`   
  specifies countdown timers, if >0 they are decremented in seconds until zero is reached. see example below  
  `i:vname`   
  specifies auto increment counters if =0 (in seconds)  
  `m:vname`   
   specifies a median filter variable with 5 entries (for elimination of outliers)  
  `M:vname`   
  specifies a moving average filter variable with 8 entries (for smoothing data)  
  (max 5 filters in total m+M) optional another filter length (1..127) can be given after the definition.  
  Filter vars can be accessed also in indexed mode `vname[x]` (x = `1..N`, x = `0` returns current array index pointer)  
  Using this filter, vars can be used as arrays  

!!! tip
    Keep variable names as short as possible. The length of all variable names taken together may not exceed 256 characters.  
    Memory is dynamically allocated as a result of the D section.  
    Copying a string to a number or reverse is supported  

`>B`  
executed on BOOT time and on save script  

`>E`  
Executed when a Tasmota MQTT `RESULT` message is received, e.g., on `POWER` change. Also  Zigbee reports to  this section.

`>F`  
Executed every 100 ms  

`>S`  
Executed every second  

`>R`  
Executed on restart. p vars are saved automatically after this call  

`>T`  
Executed on [`TelePeriod`](Commands#teleperiod) time (`SENSOR` and `STATE`), only put `tele-` vars in this section  
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

`>U`  
status JSON Messages arrive here

`>b` _(note lower case)_  
executed on button state change  

`bt[x]`   
read button state (x = `1.. MAX_KEYS`)  

!!! example

```
if bt[1]==0  
then  
print falling edge of button1  
endif  
if bt[1]==1  
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

A web user interface may be generated containing any of the following elements:  
**Button:**   
 `bu(vn txt1 txt2)` (up to 4 buttons may be defined in one row)  
 `vn` = name of variable to hold button state  
 `txt1` = text of ON state of button  
 `txt2` = text of OFF state of button  
**Checkbox:**   
 `ck(vn txt)`  
 `vn` = name of variable to hold checkbox state  
 `txt` = label text   
**Slider:**    
`sl(min max vn ltxt mtxt rtxt)`  
 `min` = slider minimum value  
 `max` = slider maximum value  
 `vn` = name of variable to hold slider value  
 `ltxt` = label left of slider  
 `mtxt` = label middle of slider  
 `rtxt` = label right of slider  
**Text Input:**    
 `tx(vn lbl)`  
 `vn` = name of string variable to hold text state  
 `lbl` = label text  
 
**Number Input:**    
 `nm(min max step vn txt)`  
 `min` = number minimum value  
 `max` = number maximum value  
 `step` = number step value for up/down arrows  
 `vn` = name of number variable to hold number  
 `txt` = label text 
 
 **Google Charts:**  
  draws a google chart with up to 4 data sets per chart  
  `gc( T array1 ... array4 "name" "label1" ... "label4" "entrylabels" "header" {"maxy1"} {"maxy2"})`   
  `T` = type
  - b=barchart  
  - c=columnchart  
  - p=piechart  
  - l=linechart up to 4 lines with same scaling
  - l2=linechart with exactly 2 lines and 2 y scales (must be given at end)
  - 2f2 like above but with splined lines 
  - h=histogram  
  - t=data table
  - g=simple gauges (must give extra 3 vars after header, yellow start, red start, maxval)  
  - T=Timeline (special type arrays contains start,stop pairs in minutes timeofday)
  
  b,l,h type may have the '2' option to specify exactly 2 arrays with 2 y scales given at the end of paramter list.  
  
  `array` = up to 4 arrays of data  
  `name` = name of chart  
  `label` = label for up to the 4 datasets in chart  
  `entrylabel` = labels of each entry separated by '|' char ("cntN" starts numbering entries with the number N)  
  `header` = visible header name of chart  
  
  additionally you have to define the html frame to put the chart in (both lines must be preceded by a $ char)
  e.g.  
  $<div id="chart1"style="width:640px;height:480px;margin:0 auto">\</div>  
  $gc(c array1 array2 "wr" "pwr1" "pwr2" "mo|di|mi|do|fr|sa|so" "Solar feed")  
  you may define more then one chart. The charts id is chart1 ... chartN
  
  
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
`prefixn` = prefix n = 1-3  
`pwr[x]` = power state  (x = 1..N)  
`pc[x]` = pulse counter value  (x = 1..4)  
`tbut[x]` = touch screen button state  (x = 1..N)  
`sw[x]` = switch state  (x = 0..N) (Switch1 = `sw[0]`)  
`bt[x]` = button state  (x = 1..N) only valid in section b  (if defined USE_BUTTON_EVENT)  
`pin[x]` = GPIO pin level (x = 0..16)  
`pn[x]` = GPIO for sensor code x. 99 if none  
`pd[x]` = defined sensor for GPIO x. 999 if none  
`sht[x]` = shutter position (x = 1..N) (if defined USE_SHUTTER)  
`gtmp` = global temperature  
`ghum` = global humidity  
`gprs` = global pressure  
`pow(x y)` = calculates exponential powers x^y  
`med(n x)` = calculates a 5 value median filter of x (2 filters possible n=0,1)  
`int(x)` = gets the integer part of x (like floor)  
`hn(x)` = converts x (0..255) to a hex nibble string  
`hx(x)` = converts x (0..65535) to a hex string  
`st(svar c n)` = string token - retrieve the n^th^ element of svar delimited by c  
`sl(svar)` = gets the length of a string  
`sb(svar p n)` = gets a substring from svar at position p (if p<0 counts from end) and length n  
`sin(x)` = calculates the sinus(x) (if defined USE_ANGLE_FUNC)  
`acos(x)` = calculates the acos(x) (if defined USE_ANGLE_FUNC)  
`sqrt(x)` = calculates the sqrt(x) (if defined USE_ANGLE_FUNC)  
`sf(F)` = sets the CPU Frequency (ESP32) to 80,160,240 Mhz, returns current Freq.  
`s(x)` = explicit conversion from number x to string  
`mqtts` = MQTT connection status: `0` = disconnected, `>0` = connected  
`wifis` = Wi-Fi connection status: `0` = disconnected, `>0` = connected  
`sml(m 0 bd)` = set SML baudrate of Meter m to bd (baud) (if defined USE_SML_SCRIPT_CMD)  
`sml(m 1 htxt)` = send SML Hexstring htxt as binary to Meter m (if defined USE_SML_SCRIPT_CMD)  
`sml[n]` = get value of SML energy register n (if defined USE_SML_SCRIPT_CMD)  
`enrg[n]` = get value of energy register n 0=total, 1..3 voltage of phase 1..3, 4..6 current of phase 1..3, 7..9 power of phase 1..3 (if defined USE_ENERGY_SENSOR)  
`hours` = hours  
`mins` = mins  
`secs` = seconds  
`day` = day of month  
`wday` = day of week  
`month` = month  
`year` = year  
`epoch` = epoch time (from 2019-1-1 00:00)  

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

`=> <command>` Execute <command>  recursion disabled  
`+> <command>` Execute <command>  recursion enabled  
`-> <command>` Execute <command> - do not send MQTT or log messages (i.e., silent execute - useful to reduce traffic)  

**Variable Substitution**  
- A single percent sign must be given as `%%`  
- Variable replacement within commands is allowed using `%varname%`. Optionally, the decimal places precision for numeric values may be specified by placing a digit (`%Nvarname%`, N = `0..9`) in front of the substitution variable (e.g., `Humidity: %3hum%%%` will output `Humidity: 43.271%`)   
- Linefeed and carriage return may be defined by \n and \r  

**Special** commands:  
`print` or `=>print` prints to the log for debugging  
A Tasmota MQTT RESULT message invokes the script's `E` section. Add `print` statements to debug a script.  
    
!!! example
 >
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
 

`break` exits a section or terminates a `for next` loop  
`dpx` sets decimal precision to x (0-9)  
`svars` save permanent vars  
`delay(x)` pauses x milliseconds (should be as short as possible)  
`beep(f l)` (ESP32) beeps with a passive piezo beeper. beep(-f 0) attaches PIN f to the beeper, beep(f l) starts a sound with frequency f (Hz) and len l (ms). f=0 stops the sound.  
`spin(x b)` set GPIO `x` (0..16) to value `b` (0,1). Only bit 0 of `b` is used - even values set the GPIO to `0` and uneven values set the GPIO to `1`  
`spinm(x m)` set GPIO `x` (0..16) to mode `m` (input=0, output=1, input with pullup=2,alternatively b may be: O=out, I=in, P=in with pullup)  
`ws2812(array dstoffset)` copies an array (defined with `m:vname`) to the WS2812 LED chain. The array length should be defined as long as the number of pixels. Color is coded as 24 bit RGB. optionally the destinationoffset in the LED chain may be given  
`hsvrgb(h s v)` converts hue (0..360), saturation (0..100) and value (0..100) to RGB color  

`#name` names a subroutine. Subroutine is called with `=#name`  
`#name(param)` names a subroutine with a parameter. Subroutine is called with `=#name(param)`  
Subroutines end with the next `#` or `>` line or break. Subroutines may be nested  
Parameters can be numbers or strings and on type mismatch are converted  

If `#define USE_SCRIPT_SUB_COMMAND` is included in your `user_config_override.h`, a subroutine may be invoked via the Console or MQTT using the subroutine's name. For example, a declared subroutine `#SETLED(num)` may be invoked by typing `SETLED 1` in the Console. The parameter `1` is passed into the `num` argument. This also works with string parameters.  

It is possible to "replace" internal Tasmota commands. For example, if a `#POWER1(num)` subroutine is declared, the command `POWER1` is processed in the scripter instead of in the main Tasmota code.  

`=(svar)` executes a routine whose name is passed as a string in a variable (dynamic or self modifying code). The string has to start with `>` or `=#` for the routine to be executed.

```
D
svar="=#subroutine"

S
=(svar)

#subroutine
=>print subroutine was executed
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
    sendmail [smtp.gmail.com:465:user:passwd:sender@gmail.com:<rec@gmail.com:alarm] %string%
    ```  

    Remark:  
    A number of e-mail servers (such as Gmail) require the receiver's e-mail address to be enclosed by `< ... ` as in example above. Most other e-mail servers also accept this format.  

The following parameters can be specified during compilation via `#define` directives in `user_config_override.h`:  
* `EMAIL_SERVER`  
* `EMAIL_PORT`  
* `EMAIL_USER`  
* `EMAIL_PASSWORD`  
* `EMAIL_FROM`  

To use any of these values, pass an `*` as its corresponding argument placeholder.  

!!! example "`sendmail [*:*:*:*:*:<rec@gmail.com:theSubject] theMessage`  "

Instead of passing the `msg` as a string constant, the body of the e-mail message may also be composed using the script `m` _(note lower case)_ section. The specified text in this script section must end with an `#` character. `sendmail` will use the `m` section if `*` is passed as the `msg` parameter. See [Scripting Cookbook Example].(#send-e-mail)  
 
**Subscribe, Unsubscribe**  
`#define SUPPORT_MQTT_EVENT`  
`subscribe` and `unsubscribe` commands are supported. In contrast to rules, no event is generated but the event name specifies a variable defined in `D` section and this variable is automatically set on transmission of the subscribed item  
within a script the subscribe cmd must be send with +> instead of =>  
the MQTT decoder may be configured for more space in user config overwrite by  
`#define MQTT_EVENT_MSIZE` xxx   (default is 256)  
`#define MQTT_EVENT_JSIZE` xxx   (default is 400)  

**SD Card Support** (+ 10k flash)  
`#define USE_SCRIPT_FATFS` `CARD_CS`  
`CARD_CS` = GPIO of card chip select   
SD card uses standard hardware SPI GPIO: mosi,miso,sclk  
A maximum of four files may be open at a time  
e.g., allows for logging sensors to a tab delimited file and then downloading the file ([see Sensor Logging example](#sensor-logging))  
The downloading of files may be executed in a kind of "multitasking" when bit 7 of loglvl is set (128+loglevel)  
Without multitasking 150kb/s (all processes are stopped during downloading), with multitasking 50kb/s (other Tasmota processes are running)  
The script itself is also stored on the SD card with a default size of 4096 characters  

Enable SD card directory support (+ 1,2k flash)  
`#define SDCARD_DIR`  
Shows a web SD card directory (submenu of scripter) where you can upload and download files to/from sd card  

`fr=fo("fname" m)` open file fname, mode 0=read, 1=write, 2=append (returns file reference (0-3) or -1 for error) 
(alternatively m may be: r=read, w=write, a=append)  
`res=fw("text" fr)` writes text to (the end of) file fr, returns number of bytes written  
`res=fr(svar fr)` reads a string into svar, returns bytes read. String is read until delimiter (\\t \\n \\r) or eof  
`fc(fr)` close file  
`ff(fr)` flush file, writes cached data and updates directory  
`fd("fname")` delete file fname  
`flx(fname)` create download link for file (x=1 or 2) fname = file name of file to download  
`fsm` return 1 if filesystem is mounted, (valid SD card found)  

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

**Script compression**  
`#define USE_SCRIPT_COMPRESSION`  
enables compression of script storage to about 40%. The script buffer is set to 2560 instead of 1535 chars.  
no backward compatibility. first save your old script before updating.  


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
    =>print BOOT executed
    =>print %hello%
    =>mp3track 1

    ; list gpio pin definitions
    for cnt 0 16 1
    tmp=pd[cnt]
    =>print %cnt% = %tmp%
    next

    ; get gpio pin for relais 1
    tmp=pn[21]
    =>print relais 1 is on pin %tmp%

    ; pulse relais over raw gpio
    spin(tmp 1)
    delay(100)
    spin(tmp 0)

    ; raw pin level
    =>print level of gpio1 %pin[1]%

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
    =>print %median% %movav%

    if chg[rssi]>0
    then =>print rssi changed to %rssi%
    endif

    if temp>30
    and hum>70
    then =>print damn hot!
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
    =>print timer1 expired
    endif

    ; auto counter with restart
    if count=10
    then =>print 10 seconds over
    count=0
    endif

    if upsecs%5==0
    then =>print %upsecs%  (every 5 seconds)
    endif

    ; not recommended for reliable timers
    timer+=1
    if timer>=5
    then =>print 5 seconds over (may be)
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
    =>displaytext [c1l1f1s2p20] dimmer=%dimmer%

    =>print %upsecs% %uptime% %time% %sunrise% %sunset% %tstamp%

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
    then =>displaytext [z]
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
    then =>print %hello%
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
    =>print full hour reached
    endif

    if time5 {
    =>print more then 5 minutes after midnight
    } else {
    =print less then 5 minutes after midnight
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
    =>print state=%state% , start
    state+=1
    case 2
    =>print state=%state%
    state+=1
    case 3
    =>print state=%state%  , reset
    state=1
    ends

    ; subroutines
    #sub1(string)
    =>print sub1: %string%
    #sub2(param)
    =>print sub2: %param%

    #sendmail(string)
    =>sendmail [smtp.gmail.com:465:user:passwd:<sender@gmail.de:<rec@gmail.de:alarm] %string%

    >E
    =>print event executed!

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
    =>print color changed  %col%
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
    =>print restarting now

### Sensor Logging

    ; define all vars here
    ; reserve large strings
    >D 48
    hum=0
    temp=0
    fr=0
    res=0
    ; moving average for 60 seconds
    M:mhum=0 60
    M:mtemp=0 60
    str=""

    >B
    ; set sensor file download link
    fl1("slog.txt")
    ; delete file in case we want to start fresh
    ;fd("slog.txt")

    ; list all files in root directory
    fr=fo("/" 0)
    for cnt 1 20 1
    res=fr(str fr)
    if res>0
    then
    =>print %cnt% : %str%
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
    ; DisplayText substituted to save script space
    DT="DisplayText"
    ; preset units in case they are not available
    punit="hPa"
    tunit="C"

    >B
    ;reset auto draw
    =>%DT% [zD0]
    ;clr display and draw a frame
    =>%DT% [x0y20h296x0y40h296]

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
    =>%DT% [f1p7x0y5]%temp% %tunit%
    =>%DT% [p5x70y5]%hum% %%[x250y5t]
    =>%DT% [p11x140y5]%press% %punit%
    =>%DT% [p10x30y25]TVOC: %tvoc% ppb
    =>%DT% [p10x160y25]eCO2: %eco2% ppm
    =>%DT% [p10c26l5]ahum: %ahum% g^m3

    dp0
    =>%DT% [p25c1l5]WR 1 (Dach)  : %wr1% W
    =>%DT% [p25c1l6]WR 2 (Garage): %-wr3% W
    =>%DT% [p25c1l7]WR 3 (Garten): %-wr2% W
    =>%DT% [p25c1l8]Aussentemperatur: %otmp% C
    =>%DT% [x170y95r120:30f2p6x185y100] %pwl% %%
    ; now update screen
    =>%DT% [d]
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
    DT="DisplayText"
    res=0
    
    >B
    ->setoption64 1
    tper=30
    
    ->%DT% [IzD0]
    ->%DT% [zG10352:5:40:-350:80:10080:0:100f3x360y40]100 %%[x360y115]0 %%
    ->%DT% [f1x100y25]Powerwall - 7 Tage[f1x360y75] 0 %%
    ->%DT% [G10353:5:140:-350:80:10080:0:5000f3x360y140]+5000 W[x360y215]0 W
    ->%DT% [f1x70y125]Volleinspeisung - 7 Tage[f1x360y180] 0 W
    ->%DT% [p13x10y230]WR 1,2,3:
    ->%DT% [p13x10y245]H-Einsp.:
    ->%DT% [p13x10y260]H-Verbr.:
    ->%DT% [p13x10y275]D-Einsp.:
    ->%DT% [d]
    
    ->%DT% [Gr0:/g0_sav.txt:]
    ->%DT% [Gr1:/g1_sav.txt:]
    
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
    ->%DT% [f1p7x0y5]%temp% C
    ->%DT% [x0y20h400x250y5T][x350t][f1p10x70y5]%hum% %%
    ->%DT% [p10x140y5]%press% hPa
    dp0
    ->%DT% [p5x360y75]%pwl% %%
    ->%DT% [p6x360y180]%wr1%W
    ->%DT% [g0:%pwl%g1:%wr1%]
    
    ->%DT% [p24x75y230] %wr1% W : %-wr2% W : %-wr3% W
    ->%DT% [p-10x75y245]%ezh% kWh
    ->%DT% [p-10x75y260]%vzh% kWh
    ->%DT% [p-10x75y275]%ez1% kWh
    
    t1=mezh*7
    ->%DT% [p-10x150y245]: %t1% kWh
    t1=mvzh*7
    ->%DT% [p-10x150y260]: %t1% kWh
    t1=mez1*7
    ->%DT% [p-10x150y275]: %t1% kWh
    
    dp1
    t1=ezh-sezh
    ->%DT% [p12x250y245]: %t1% kWh
    t1=vzh-svzh
    ->%DT% [p12x250y260]: %t1% kWh
    t1=ez1-sez1
    ->%DT% [p12x250y275]: %t1% kWh
    
    dp0
    ->%DT% [f2p5x320y250] %otmp%C
    
    ->%DT% [d]
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
    print sening email
    endif


    if upsecs%300==0
    then
    =#savgraf
    print saving graph
    endif
    
    #savgraf
    ->%DT% [Gs0:/g0_sav.txt:]
    ->%DT% [Gs1:/g1_sav.txt:]

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
    ; DisplayText substituted to save script space
    DT="DisplayText"
    punit="hPa"
    tunit="C"
    hour=0

    >B
    =>%DT% [z]

    // define 2 graphs, 2. has 3 tracks
    =>%DT% [zCi1G2656:5:20:400:80:1440:-5000:5000:3Ci7f3x410y20]+5000 W[x410y95]-5000 W [Ci7f1x70y3] Zweirichtungsz~80hler - 24 Stunden
    =>%DT%  [Ci1G2657:5:120:400:80:1440:0:5000:3Ci7f3x410y120]+5000 W[x410y195]0 W [Ci7f1x70y103] Wechselrichter 1-3 - 24 Stunden
    =>%DT% [Ci1G2658:5:120:400:80:1440:0:5000:16][Ci1G2659:5:120:400:80:1440:0:5000:5]
    =>%DT% [f1s1b0:260:260:100&#8203;:50:2:11:4:2:Rel 1:b1:370:260:100&#8203;:50:2:11:4:2:Dsp off:]
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
    ->%DT% [f1Ci3x40y260w30Ci1]
    ->%DT% [Ci7x120y220t]
    ->%DT% [Ci7x180y220T]
    ->%DT% [Ci7p8x120y240]%temp% %tunit%
    ->%DT% [Ci7x120y260]%press% %punit%
    ->%DT% [Ci7x120y280]%dist% mm
    dp0
    ->%DT% [g0:%zwz%g1:%wr1%g2:%-wr2%g3:%-wr3%]
    if zwz0
    then
    ->%DT% [p-8x410y55Ci2Bi0]%zwz% W
    else
    ->%DT% [p-8x410y55Ci3Bi0]%zwz% W
    endif
    ->%DT% [p-8x410y140Ci3Bi0]%wr1% W
    ->%DT% [p-8x410y155Ci16Bi0]%-wr2% W
    ->%DT% [p-8x410y170Ci5Bi0]%-wr3% W
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
    ;=>print short press
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
    ;=>print hold=%timer%
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
    =>print "WiFi-Dimmer-Script-v0.2"
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
