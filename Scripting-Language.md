!> **This feature is not included in precompiled binaries.**     

To use it you must [compile your build](compile-your-build). Add the following to `user_config_override.h`:
```
#ifndef USE_SCRIPT
#define USE_SCRIPT  // adds about 17k flash size, variable ram size
#endif
#ifdef USE_RULES
#undef USE_RULES
#endif  
```

#### Optional Includes

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
USE_WEBSEND_RESPONSE | enable receiving the response of a [`WebSend`](Commands#websend) command (received in section E)
SCRIPT_STRIP_COMMENTS | enables stripping comments when attempting to paste a script that is too large to fit
USE_ANGLE_FUNC | add sin(x),acos(x) and sqrt(x) e.g. to allow calculation of horizontal cylinder volume
USE_24C256 | enables use of 24C256 I<sup>2</sup>C EEPROM to expand script buffer (defaults to 4k)
USE_SCRIPT_FATFS | enables SD card support (on SPI bus). Specify the CS pin number. Also enables 4k script buffer  
USE_SCRIPT_FATFS_EXT | enables additional FS commands  
SDCARD_DIR | enables support for web UI for SD card directory upload and download  

----

## Features
Scripting Language for Tasmota is an alternative to Tasmota [Rules](Rules).

To enter a script, go to **Configuration -> Edit script** in the Tasmota web UI menu

The maximum script size is 1535 bytes (uses rule set buffers). If the pasted script is larger than 1535 characters, comments will be stripped to attempt to  make the script fit.  

To save code space almost no error messages are provided. However it is taken care of that at least it should not crash on syntax errors.  

**Features**
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
- String size is 19 characters (default). This can be increased or decreased by the optional parameter on the `>D` section definition

**Script Interpreter**  
- Execution is _**strictly sequential**_, _**line by line**_
- Evaluation is _**left to right**_ with optional brackets  
- All _**numbers are float**_, e.g., temp=hum\*(100/37.5)+temp-(timer\*hum%10)  
- _**No spaces are allowed between math operators**_
- Comments start with `;`  

**Console Commands**   
`script <n>` \<n>: `0` = switch script off; `1` = switch script on  
`script ><cmdline>` execute \<cmdline>  
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
  specifies countdown timers, if >0 they are decremented in seconds  until zero is reached. see example below  
  `i:vname`   
  specifies auto increment counters if >=0 (in seconds)  
  `m:vname`   
   specifies a median filter variable with 5 entries (for elimination of outliers)  
  `M:vname`   
  specifies a moving average filter variable with 8 entries (for smoothing data)  
  (max 5 filters in total m+M) optional another filter length (1..127) can be given after the definition.  
  Filter vars can be accessed also in indexed mode `vname[x]` (x = `1..N`, x = `0` returns current array index pointer)  
  Using this filter, vars can be used as arrays  

> [!TIP] Keep variable names as short as possible. The length of all variable names taken together may not exceed 256 characters.  
  Memory is dynamically allocated as a result of the D section.  
  Copying a string to a number or reverse is supported  

`>B`  
executed on BOOT time and on save script  

`>E`  
Executed when a Tasmota MQTT `RESULT` message is received, e.g., on `POWER` change

`>F`  
Executed every 100 ms  

`>S`  
Executed every second  

`>R`  
Executed on restart. p vars are saved automatically after this call  

`>T`  
Executed on [`TelePeriod`](Commands#teleperiod) time (`SENSOR` and `STATE`), only put `tele-` vars in this section  
Remark: json variable names (like all others) may not contain math operators like - , you should set [`SetOption64 1`](Commands#setoption64) to replace `-` (_dash_) with `_` (_underscore_)

`>H`  
Alexa Hue interface (up to 32 virtual hue devices) *([example](Scripting-Cookbook#hue-emulation))*  
`device`,`type`,`onVars`  
Remark: hue values have a range from 0-65535. Divide by 182 to assign HSBcolors hue values.

`device` device name  
`type` device type - `E` = extended color; `S` = switch  
`onVars` assign Hue "on" extended color parameters for hue, saturation, brightness, and color temperature (hue,sat,bri,ct) to scripter variables  
> [!EXAMPLE] `lamp1,E,on=pwr1,hue=hue1,sat=sat1,bri=bri1,ct=ct1`

`>U`  
status JSON Messages arrive here

`>b` _(note lower case)_  
executed on button state change  

`bt[x]`   
read button state (x = `1.. MAX_KEYS`)  

>[!EXAMPLE]  
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
The lines in this section are published via MQTT in a JSON payload on [TelePeriod](Commands#teleperiod). Requires compiling with `#define USE_SCRIPT_JSON_EXPORT `.  

`>W`  
The lines in this section are displayed in the web UI main page. Requires compiling with `#define USE_SCRIPT_WEB_DISPLAY`.  

You may put any html code here.  
- Variables may be substituted using %var%  
- HTML statements are displayed in the sensor section of the main page  
- HTML statements preceded with a `@` are displayed at the top of the page  
- USER IO elements are displayed at the top of the page  

A web user interface may be generated containing any of the following elements: toggle button, check box, slider, or text and number input.  
- **Button:**   
 `bu(<vn> <txt1> <txt2>)` (up to 4 buttons may be defined in one row)  
 `<vn>` = name of variable to hold button state  
 `<txt1>` = text of ON state of button  
 `<txt2>` = text of OFF state of button
- **Checkbox:**   
 `ck(<vn> <txt>)`  
 `<vn>` = name of variable to hold checkbox state  
 `<txt>` = label text   
- **Slider:**    
`sl(<min> <max> <vn> <ltxt> <mtxt> <rtxt>)`  
 `<min>` = slider minimum value  
 `<max>` = slider maximum value  
 `<vn>` = name of variable to hold slider value  
 `<ltxt>` = label left of slider  
 `<mtxt>` = label middle of slider  
 `<rtxt>` = label right of slider  
- **Text Input:**    
 `tx(<vn> <txt>)`  
 `<vn>` = name of string variable to hold text state  
 `<txt>` = label text   
- **Number Input:**    
 `nm(<min <max> <step> <vn> <txt>)`  
 `<min>` = number minimum value  
 `<max>` = number maximum value  
 `<step>` = number step value for up/down arrows  
 `<vn>` = name of number variable to hold number  
 `<txt>` = label text 

`>M`  
[Smart Meter Interface](peripherals/Smart-Meter-Interface)  

If a variable does not exist, `???` is displayed for commands  

If a Tasmota `SENSOR` or `STATUS` or `RESULT` message is not generated or a `Var` does not exist the destination variable is NOT updated.  

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
`prefixn` = prefix n = 1-3  
`pwr[x]` = power state  (x = 1..N)  
`pc[x]` = pulse counter value  (x = 1..4)  
`tbut[x]` = touch screen button state  (x = 1..N)  
`sw[x]` = switch state  (x = 1..N)  
`bt[x]` = button state  (x = 1..N) only valid in section >b  (if defined USE_BUTTON_EVENT)  
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
`st(svar c n)` = string token - retrieve the n<sup>th</sup> element of svar delimited by c  
`sl(svar)` = gets the length of a string  
`sb(svar p n)` = gets a substring from svar at position p (if p<0 counts from end) and length n  
`sin(x)` = calculates the sinus(x) (if defined USE_ANGLE_FUNC)  
`acos(x)` = calculates the acos(x) (if defined USE_ANGLE_FUNC)  
`sqrt(x)` = calculates the sqrt(x) (if defined USE_ANGLE_FUNC)  
`s(x)` = explicit conversion from number x to string  
`mqtts` = MQTT connection status: `0` = disconnected, `>0` = connected  
`wifis` = Wi-Fi connection status: `0` = disconnected, `>0` = connected  

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
`heap` = heap size  
`ram` = used ram size  
`slen` = script length  
`micros` = running microseconds  
`millis` = running milliseconds  
`loglvl` = loglevel of script cmds (_**may be set also**_)  

Remarks:  
If you define a variable with the same name as a special variable that special variable is discarded  

## Commands
`=> <command>` Execute \<command>  recursion disabled  
`+> <command>` Execute \<command>  recursion enabled  
`-> <command>` Execute \<command> - do not send MQTT or log messages (i.e., silent execute - useful to reduce traffic)  

**Variable Substitution**  
- A single percent sign must be given as `%%`  
- Variable replacement within commands is allowed using `%varname%`. Optionally, the decimal places precision for numeric values may be specified by placing a digit (`%Nvarname%`, N = `0..9`) in front of the substitution variable (e.g., `Humidity: %3hum%%%` will output `Humidity: 43.271%`)   
- Linefeed and carriage return may be defined by \n and \r  

**Special** commands:  
`print` or `=> print` prints to the log for debugging  
&nbsp;&nbsp;&nbsp;&nbsp;A Tasmota MQTT RESULT message invokes the script's `>E` section. Add `=> print` statements to debug a script.  
    
> [!EXAMPLE]  
>```
>slider=Dimmer
>power=POWER
>
>if upd[slider]>0
>then
>=>print slider updated %slider%
>endif
>
>if upd[power]>0
>then
>=>print power updated %power%
>endif
>```

`break` exits a section or terminates a `for next` loop  
`dpx` sets decimal precision to x (0-9)  
`svars` save permanent vars  
`delay(x)` pauses x milliseconds (should be as short as possible)  
`spin(x b)` set GPIO `x` (0..16) to value `b` (0,1). Only bit 0 of `b` is used - even values set the GPIO to `0` and uneven values set the GPIO to `1`  
`spinm(x m)` set GPIO `x` (0..16) to mode `m` (input=0, output=1, input with pullup=2)  
`ws2812(array)` copies an array (defined with `m:vname`) to the WS2812 LED chain. The array length should be defined as long as the number of pixels. Color is coded as 24 bit RGB.  
`hsvrgb(h s v)` converts hue (0..360), saturation (0..100) and value (0..100) to RGB color  

`#name` names a subroutine. Subroutine is called with `=#name`  
`#name(param)` names a subroutine with a parameter. Subroutine is called with `=#name(param)`  
Subroutines end with the next `#` or `>` line or break. Subroutines may be nested  
Parameters can be numbers or strings and on type mismatch are converted  

If `#define USE_SCRIPT_SUB_COMMAND` is included in your `user_config_override.h`, a subroutine may be invoked via the Console or MQTT using the subroutine's name. For example, a declared subroutine `#SETLED(num)` may be invoked by typing `SETLED 1` in the Console. The parameter `1` is passed into the `num` argument. This also works with string parameters.  

It is possible to "replace" internal Tasmota commands. For example, if a `#POWER1(num)` subroutine is declared, the command `POWER1` is processed in the scripter instead of in the main Tasmota code.  

`=(svar)` executes a routine whose name is passed as a string in a variable (dynamic or self modifying code). The string has to start with `=>` or `=#` for the routine to be executed.
```
>D
svar="=#subroutine"

>S
=(svar)

#subroutine
=>print subroutine was executed
```

**For loop** (loop count must not be less than 1)
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
then => do this  
else => do that  
endif  
```

**or**   

```
if a==b  
and x==y  
or k==i {  
  => do this  
} else {  
  => do that  
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

**E-mail**  
`#define USE_SENDMAIL`  
Enabling this feature also enables [Tasmota TLS](TLS) as `sendmail` uses SSL.  
  
`sendmail [server:port:user:passwd:from:to:subject] msg`  

> [!EXAMPLE]  
```
sendmail [smtp.gmail.com:465:user:passwd:sender@gmail.com:<rec@gmail.com>:alarm] %string%
```  
Remark:  
A number of e-mail servers (such as Gmail) require the receiver's e-mail address to be enclosed by `< ... >` as in example above. Most other e-mail servers also accept this format.  

The following parameters can be specified during compilation via `#define` directives in `user_config_override.h`:  
* `EMAIL_SERVER`  
* `EMAIL_PORT`  
* `EMAIL_USER`  
* `EMAIL_PASSWORD`  
* `EMAIL_FROM`  

To use any of these values, pass an `*` as its corresponding argument placeholder.  
> [!EXAMPLE] `sendmail [*:*:*:*:*:<rec@gmail.com>:theSubject] theMessage`  

Instead of passing the `msg` as a string constant, the body of the e-mail message may also be composed using the script `>m` _(note lower case)_ section. The specified text in this script section must end with an `#` character. `sendmail` will use the `>m` section if `*` is passed as the `msg` parameter. See [Scripting Cookbook Example].(Scripting-Cookbook#Send-e-mail)  
 
**Subscribe, Unsubscribe**  
`#define SUPPORT_MQTT_EVENT`  
`subscribe` and `unsubscribe` commands are supported. In contrast to rules, no event is generated but the event name specifies a variable defined in `>D` section and this variable is automatically set on transmission of the subscribed item  

**SD Card Support** (+ 10k flash)  
`#define USE_SCRIPT_FATFS` `CARD_CS`  
`CARD_CS` = GPIO of card chip select   
SD card uses standard hardware SPI GPIO: mosi,miso,sclk  
A maximum of four files may be open at a time  
e.g., allows for logging sensors to a tab delimited file and then downloading the file ([see Sensor Logging example](Scripting-Cookbook#sensor-logging))  
The downloading of files may be executed in a kind of "multitasking" when bit 7 of loglvl is set (128+loglevel)  
Without multitasking 150kb/s (all processes are stopped during downloading), with multitasking 50kb/s (other Tasmota processes are running)  
The script itself is also stored on the SD card with a default size of 4096 characters  

Enable SD card directory support (+ 1,2k flash)  
`#define SDCARD_DIR`  
Shows a web SD card directory (submenu of scripter) where you can upload and download files to/from sd card  

`fr=fo("fname" m)` open file fname, mode 0=read, 1=write (returns file reference (0-3) or -1 for error)  
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

# [Scripting Cookbook](Scripting-Cookbook)
