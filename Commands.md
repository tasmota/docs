## How to Use

Tasmota provides three powerful man machine interfaces for issuing commands: **MQTT**, **web** and **serial** 

Every command **used without a parameter (payload) returns the current setting**.
   * `Power` will return the status of first defined relay (usually Relay1)

Instead of `0` you can use `off` or `false` and instead of `1` you can use `on` or `true`.
   * `Power ON` turns first defined relay (usually Relay1) on
   * `Power1 1` also turns first defined relay (usually Relay1) on
   * `Power1 True` also turns first defined relay (usually Relay1) on

Replace `<x>` in a command with the appropriate index number. Leave it empty to use the first available.
   * `Power1` and `Power` both control first defined relay (usually Relay1)

In commands with `x..y` value parameters use a number from `x` to `y` range.

When a command mentions resetting to *"firmware default"* it means the setting will revert to the one in the flashed binary file. If you used `user_config_override.h` at compile time it will revert to those.

> [!NOTE]
> Beside results initiated by a command (synchronous) you can get asynchronous results initiated by rule trigger, telemetry event, commands from other source or changed device values.    
Simply put, other messages may precede messages published as a result of your commands.

> [!EXAMPLE] A `tele/%topic%/STATUS` message (sent every 300 seconds by default) may appear exactly after you issue `Power off` command and before you receive `stat/%topic%/RESULT = {"POWER":"OFF"}` message.


### ...with MQTT

To send commands and view responses you'll need an [MQTT client](http://www.hivemq.com/blog/seven-best-mqtt-client-tools).

Commands over MQTT are issued by using `cmnd/%topic%/<command> <parameter>` where `%topic%` is the topic of the device you're sending the command to. If there is no `<parameter>` (an empty MQTT message/payload), a query is sent for current status of the `<command>`.

See [MQTT](MQTT) article to find out more.

### ...with Web Requests

Commands can be executed via web (HTTP) requests, for example:  
```
http://<ip>/cm?cmnd=Power%20TOGGLE
http://<ip>/cm?cmnd=Power%20On
http://<ip>/cm?cmnd=Power%20off
http://<ip>/cm?user=admin&password=joker&cmnd=Power%20Toggle
```
> [!NOTE] Any spaces or special characters must be replaced with their [ASCII hex codes](https://www.rapidtables.com/code/text/ascii-table.html). You must precede each hex code with `%`.  
Most used ones are: `space` = `%20` &emsp; `;` = `%3B`   

If you have set a password for web user interface access, this must be included (in plaintext) in the URL of the HTTP request, like so:  
```
http://<ip>/cm?&user=<username>&password=<password>&cmnd=Power%20On
```
### ...in Console in the Web UI

**Console** menu in the web UI is a convenient place to send commands and it behaves similar to a terminal connection via serial bridge. 

### ...over Serial Bridge

If you flashed the device via serial method you can connect to it with a terminal application (e.g. [Termite](https://www.compuphase.com/software_termite.htm) or Arduino IDE Serial Monitor) to issue commands and follow responses. This is a practical way to do a `Backlog` setup of your new device.

*The serial interface is set to 115200 bps except for devices that require a different baudrate.

### ...the Power of Backlog

`Backlog` command allows executing up to 30 consecutive commands with a single command line. Each command is separated by a semicolon (";"). `Backlog` is a useful feature to avoid numerous restarts when setting up a new device. You can use it to:

Set up both Wi-Fi AP's
```console
Backlog SSID1 <myssid>; Password1 <mypassword>; SSID2 <myssid2>; Password2 <mypassword2>
```
Configure MQTT broker address, MQTT credentials, device topic and activate a few custom options
```console
Backlog MqttHost <yourhost>; MqttUser <user>; MqttPassword <password>; Topic <customtopic>; SetOption53 1; PowerRetain on
```
For specific power control, using backlog like a script
```console
Backlog Status 1; Power2 on; Delay 20; Power2 off; Status 4
```
When using [web requests](#with-web-requests) *(You have to encode "space" as '%20' and ";" as '%3B')*
```http
http://<ip>/cm?user=admin&password=joker&cmnd=Backlog%20Power%20Toggle%3BPower1%20ff
```
#### Clear Backlog queue

A `Backlog` command without an argument clears an possible existing `Backlog` queue.

E.g. in case of command _`Backlog Power1 OFF; Delay 600; Power1 ON`_ the usage of an additional `Backlog` command without any argument within the delay time of 1 minute will delete the whole queue _`Power1 OFF; Delay 600; Power1 ON`_. Therefore `Power1 ON` command will not be executed and the power would remain off.

## Command List
> [!WARNING] If you're using Tasmota versions earlier than v7.1 some of the commands might not work. Note that availability of some features and their associated commands is dependent on the options selected during the firmware compilation. Please consult the [builds](Builds) table for a reference of which features are available for each firmware variant.

### Control

Command|Parameters
:---|:---
Backlog<a id="backlog"></a>|List of commands to be executed in sequence separated by  `;`<BR> See [Using Backlog](#the-power-of-backlog) for examples.
BlinkCount<a id="blinkcount"></a>|Number of relay toggles ([blinks](#power)) **(does not control the status LED)**<BR> `0` = blink many times before restoring power state <BR> `1..32000` = set number of blinks *(default = `10`)*
BlinkTime<a id="blinktime"></a>|`2..3600` set duration, in 0.1 second increments, to [blink](#power) aka toggle Power **(does not control the status LED)**
ButtonDebounce<a id="buttondebounce"></a>|User control over button debounce timing <BR>`40..1000` = set button debounce time in milliseconds *(default = `50`)*
Buzzer<a id="buzzer"></a>|`0` = stop active buzzer cycle<BR>`<count>,<beep>,<silence>,<tune>` = [read more...](peripherals/Buzzer)<BR>`2,3` - Beep twice with 300 milliseconds duration and 100 milliseconds pause<BR>`2,3,4` - Beep twice with 300 milliseconds duration and 400 milliseconds pause<BR>`1,2,3,0xF54` (0000 0000 0000 0000 0000 1111 0101 0100). Each `1` bit beeps for 200 milliseconds and each bounded `0` bit pauses for 300 milliseconds
DevGroupShare<a id="devgroupshare"></a>|Set incoming and outgoing shared item mask.<BR>`<in>,<out>` (default = 0xFFFFFFFF,0xFFFFFFFF)<BR>1 = Power, 2 = Light brightness, 4 = Light fade/speed, 8 = Light scheme, 16 = Light color, 32 = Minimum brightness
FanSpeed<a id="fanspeed"></a>|Fan speed control *(iFan02/iFan03 only)*<BR>`0` = turn fan OFF<BR>`1..3` = set fan speed<BR>`+` = increase fan speed <BR>`-` = decrease fan speed <BR>
Interlock<a id="interlock"></a>|Relay interlock mode and group selection.<BR>`0` = disable relay interlock for all relays (i.e., each relay is self-locking) *(default)*<BR> `1` = set interlock mode for selected relays<br>Add up to 8 relays in 1 to 4 interlock groups, each separated by a space. For example<BR> `1,2 3,4` = Group Relay1 and Relay2 in group 1 and Relay3 and Relay4 in group 2 (_note the space between the two groups_) <BR> `1,2,3` = group Relay1, Relay2 and Relay3 in a single interlock group <BR>`1 3 2,4` = Relay1 is in group 1, Relay3 in group 2, Relay2 and Relay4 in group 3
LedMask<a id="ledmask"></a>|Set a  [bitmask](https://en.wikipedia.org/wiki/Mask_(computing)#Masking_bits_to_1) specifiying which relays control the LED indicator. [Read more...](LedMask) <br>`<bitmask>` = [bitwise](https://whatis.techtarget.com/definition/bitwise) value representing each relay. Values may be entered as either hexadecimal or decimal values (e.g., 0xFFFF = 65535).<BR>`0xFFFF` (= 1111 1111 1111 1111) All relays control the power LED _(default)_<BR>*[LedState](#ledstate) must be enabled (i.e., `!= 0`) in order for `LedMask` to take effect.*
LedPower<a id="ledpower"></a>|LED power state as on or off <BR> `0` = turn LED OFF and set `LedState 0` <BR> `1` = turn LED ON and set `LedState 8` <BR> `2` = toggle LED and set `LedState 0` <BR>(Use `Backlog LedPower 0; SetOption31 1` to disable LED even when Wi-Fi or MQTT is not connected)
LedPower<x\>|LED<x\> power state control. **Enabled only when LedLink(i) is configured**<BR>`0` = turn LED OFF and set `LedState 0` <BR> `1` = turn LED ON and set `LedState 0` <BR> `2` = toggle LED and set `LedState 0`
LedState<a id="ledstate"></a>|Manage LED state<BR> `0` = disable use of LED as much as possible <BR> `1` = show power state on LED (LED on when power on) *(default)* *(inverted for Sonoff Touch/T1)*<BR> `2` = show MQTT subscriptions as a LED blink<BR> `3` = show power state and MQTT subscriptions as a LED blink<BR> `4` = show MQTT publications as a LED blink<BR> `5` = show power state and MQTT publications as a LED blink<BR> `6` = show all MQTT messages as a LED blink<BR> `7` = show power state and MQTT messages as a LED blink<BR>`8` = LED on when Wi-Fi and MQTT are connected.<BR>_*Cannot* be issued directly and is only activated when `LedPower` is switched from `0` to `1` due to a software function_
Power0<a id="Power0"></a>|Control the power state simultaneously for all power outputs on the device<BR> `0` / `off` = turn OFF <BR> `1` / `on` = turn ON <BR> `2` / `toggle` = if relay is `ON` switch to `OFF` and vice versa
Power<x\><a id="power"></a>|Control the corresponding power state (`1..8`) (also restarts PulseTime)<x\><BR> `0` / `off` / `false` = turn OFF <BR> `1` / `on` / `true` = turn ON <BR> `2` / `toggle` = if power state is `ON` switch to `OFF` and vice versa<BR> `3` / `blink` = toggle power for [BlinkCount](#blinkcount) times each [BlinkTime](#blinktime) duration (at the end of `blink`, power state is returned to pre-blink state)<BR> `4` / `blinkoff` = stop blink sequence and return power state to pre-blink state
PowerOnState<a id="poweronstate"></a>|Control power state when the device is _**powered up**_. [More information](PowerOnState)<BR> `0` / `OFF` = keep power(s) OFF after power up <BR> `1` / `ON` = turn power(s) ON after power up <BR> `2` / `TOGGLE` = toggle power(s) from last saved state <BR> `3` = switch power(s) to their last saved state *(default)* <BR> `4` = turn power(s) ON and disable further power control <BR> `5` = after a `PulseTime` period turn power(s) ON (acts as inverted [`PulseTime`](Commands#pulsetime) mode)
PulseTime<x\><a id="pulsetime"></a>|Display the amount of `PulseTime` remaining on the corresponding Relay<x\><BR>`<value>` Set the duration to keep Relay<x\> `ON` when `Power<x> ON` command is issued. After this amount of time, the power will be turned `OFF`.<BR>`0` / `OFF` = disable use of PulseTime for Relay<x\><BR>`1..111` = set PulseTime for Relay<x\> in 0.1 second increments<BR>`112..64900` = set PulseTime for Relay<x\>, offset by 100, in 1 second increments. Add 100 to desired interval in seconds, e.g., `PulseTime 113` = 13 seconds and `PulseTime 460` = 6 minutes (i.e., 360 seconds)<BR>
SwitchDebounce<a id="switchdebounce"></a>|User control over switch debounce timing <BR>`40..1000` = set switch debounce time in milliseconds *(default = `50`)*
SwitchMode<x\><a id="switchmode"></a>|[Switch mode](Buttons-and-Switches#switchmode) <BR> `0` = toggle *(default)* <BR> `1` = follow (0 = off, 1 = on) <BR> `2` = inverted follow (0 = on, 1 = off) <BR> `3` = pushbutton (default 1, 0 = toggle) <BR> `4` = inverted pushbutton (default 0, 1 = toggle) <BR> `5` = pushbutton with hold (default 1, 0 = toggle, Hold = hold) <BR> `6` = inverted pushbutton with hold (default 0, 1 = toggle, hold = hold) <BR> `7` = pushbutton toggle (0 = toggle, 1 = toggle)
See also|[`SetOption1`](#setoption1) - Set button multipress mode<BR>[`SetOption11`](#setoption11) - Swap pushbutton single and double press functionality<BR>[`SetOption13`](#setoption13) - Allow immediate action on single button press<BR>[`SetOption26`](#setoption26) - Use indexes even when only one relay is present<BR>[`SetOption31`](#setoption31) - Disable Wi-Fi LED status blinking<BR>[`SetOption32`](#setoption32) - Set hold interval before sending `HOLD` action<BR>[`SetOption40`](#setoption40) - Stop detecting any input change on button GPIO<BR>[`SetOption67`](#setoption67) - Enable/Disable Buzzer

### Management

Command|Parameters
:---|:---
Delay<a id="delay"></a>|`2..3600` = set delay between two backlog commands with 0.1 second increment
DeepSleepTime<a id="deepsleeptime"></a>|Time to enter [deep sleep mode](DeepSleep)<BR>`0` = disable deep sleep mode *(default)*<BR>`10..86400` = set deep sleep mode time period in seconds
Emulation<a id="emulation"></a>|`0` = disable emulation *(default)*<BR>`1` = enable Belkin WeMo emulation for [Alexa](integrations/Alexa)<BR>`2` = enable Hue Bridge emulation for [Alexa](integrations/Alexa)
FriendlyName<x\><a id="friendlyname"></a>|`1` = Reset friendly name to firmware default<BR>`<value>` = set friendly name (32 char limit)
Gpios<a id="gpios"></a>|Show list of available [components](Components#components-list) by name and index<BR>`255` / `All` Show list of all [components](Components#components-list) by name and index<BR>
Gpio<a id="gpio"></a>|Show current [component](Components#components-list) assignments of the Module's configurable GPIO<BR>`255` / `All` Show [component](Components#components-list) assignments for all the devices available GPIO<BR>
Gpio<x\><a id="gpiox"></a>|_For built-in Modules only. This command does not work for devices configured with a Template._<BR>`<component>` = assign a [component](Components) to `Gpio<x>`
I2Cscan<a id="I2Cscan"></a>|Scan I<sup>2</sup>C bus and show addresses for found devices
I2CDriver<a id="I2CDriver"></a>|Enable / Disable I<sup>2</sup>C sensor drivers. [Read more...](I2CDevices)<BR>
LogHost<a id="loghost"></a>|`1` = reset [syslog](https://www.sigmdel.ca/michel/ha/rpi/syslog_en.html) host to firmware default (`SYS_LOG_HOST`)<BR>`<value>` = set syslog host (32 chars max)
LogPort<a id="logport"></a>|`1` = reset [syslog](https://www.sigmdel.ca/michel/ha/rpi/syslog_en.html) port to firmware default (`SYS_LOG_PORT`)<BR>`2..32766` = set syslog port
Modules<a id="modules"></a>|Show available modules by name and index
Module<a id="module"></a>|Displays active module by name and index<BR>`<x>` = switch to Module<x\> and restart<BR>`0` = switch to defined [template](Templates) and restart
MqttLog<a id="mqttlog"></a>|`0` =  disable logging via MQTT *(default)*<BR> `1` = show only error messages<BR> `2` = show error and info messages<BR>`3` = show error, info and debug messages<BR>`4` = show error, info and more debug messsages
NtpServer<x\><a id="ntpserver"></a>|NTP server setup (x= `1..3`)<BR>`0` = clear NtpServer<x\> settings<BR>`1` = reset NtpServer<x\> settings to firmware defaults<BR>`<value>` = set NtpServer<x\> host or IP address (32 char limit)
OtaUrl<a id="otaurl"></a>|Display current OTA URL<BR> `1` = Reset OtaUrl to firmware default<BR> `url` = set address for OTA (100 char limit)
Pwm<x\><a id="pwm"></a>|`0..1023` = set PWM value for channel
PwmFrequency<a id="pwmfrequency"></a>|`1` = reset PWM frequency to 880Hz<BR>`100..4000` = set PWM frequency (100Hz to 4kHz)
PwmRange<a id="pwmrange"></a>|`1` = reset maximum PWM range to 1023<BR>`255..1023` = set maximum PWM range
Reset<a id="reset"></a>|`1` = reset device settings to firmware defaults and restart<BR>`2` = erase flash, reset device settings to firmware defaults and restart<BR> `3` = erase System Parameter Area in flash (Wi-Fi calibration and related data) and restart<BR>`4` = reset device settings to firmware defaults but retain Wi-Fi credentials and restart<BR> `5` = erase all flash and reset parameters to firmware defaults but keep Wi-Fi settings and restart<BR>`6` = erase all flash and reset parameters to firmware defaults but keep Wi-Fi and MQTT settings and restart<BR>*(Erase of flash can take a few seconds to complete and there is no output during the erase process on the serial or web console)*<BR>`99` = reset device bootcount to zero
Restart<a id="restart"></a>|`1` = restart device with configuration saved to flash<BR>`99` = force restart device without configuration save<BR>_For debug and testing stack trace dumps only:_<BR>`-1` = force an Exception (28) crash<BR>`-2` = force a Soft WDT reset (after a freeze of 2 seconds)<BR>`-3` = force an OS watchdog reset (after a freeze of 120 seconds, **caution!**)
SaveData<a id="savedata"></a>|`0` = save parameter changes only manually, e.g. with `Restart 1`<BR>`1` = save parameter changes every second *(default)*<BR>`2..3600` = save parameter changes every x second 
SerialLog<a id="seriallog"></a>|Disable hardware serial bridge and<BR>`0` =  disable serial logging<BR> `1` = show only error messages<BR> `2` = show error and info messages *(default)*<BR>`3` = show error, info and debug messages<BR>`4` = show error, info and more debug messages<BR>`SerialLog` will be disabled automatically 10 minutes after the device reboots.
Sleep<a id="sleep"></a>|`0` = turn sleep off<BR>`1..250` = set sleep duration in milliseconds to enable [energy saving](Energy-Saving) *(default = `50`)*
State<a id="state"></a>|Display current device state and publish to `%prefix%/%topic%/RESULT` topic&emsp;  »5.12.0
Status<a id="status"></a>|` ` = show abbreviated [status information](JSON-Status-Responses#basic-response)<BR>`0` = show all status information (1 - 11)<BR>`1` = show device parameters information<BR>`2` = show firmware information<BR>`3` = show logging and telemetry information<BR>`4` = show memory information<BR>`5` = show network information<BR>`6` = show MQTT information<BR>`7` = show time information<BR>`8` = show connected sensor information<BR>`9` = show power thresholds *(only on modules with power monitoring)*<BR>`10` = same as `Status 8` *(retained for backwards compatibility)*<BR>`11` = show information equal to [`TelePeriod`](#teleperiod) state message<BR>`12` = in case of crash to dump the call stack saved in RT memory
SysLog<a id="syslog"></a>|`0` = disable syslog logging *(default)*<BR> `1` = show only error messages<BR> `2` = show error and info messages<BR>`3` = show error, info and debug messages<BR>`4` = show error, info and more debug messages
Template<a id="template"></a>|Show current [Template](Templates)<BR>`0` = create template from active module<BR>`x` = create template from a [supported module](Modules)<BR>`255` = merge current module and template settings into new template<BR>`{ ... }` = store template in a [JSON payload](Templates#anatomy-of-a-template)<BR>Does not activate the template. To activate use `Module 0`.
Time<a id="time"></a>|`0` = enable NTP *(default)*<BR>`1` = format JSON message timestamp in ISO format<BR>`2` = format JSON message timestamp in both ISO and Epoch format<BR>`3` = format JSON message timestamp in Epoch format<BR>`<value>` = disable NTP and set UTC time as epoch value if greater than `1451602800` (January 1, 2016)
TimeSTD<BR>TimeDST<a id="timestd"></a><a id="timedst"></a>|Set policies for the beginning of daylight saving time (DST) and return back to standard time (STD)&emsp;  »5.14.0<BR>`0` = reset parameters to firmware defaults<BR>`H`,`W`,`M`,`D`,`h`,`T`<BR>   `H` = hemisphere (`0` = northern hemisphere / `1` = southern hemisphere)<BR>   `W` = week (`0` = last week of month, `1..4` = first .. fourth)<BR>   `M` = month (`1..12`)<BR>   `D` = day of week (`1..7` `1` = sunday `7` = saturday)<BR>   `h` = hour (`0..23`)<BR>   `T` = timezone (`-780..780`) (offset from UTC in **MINUTES** - 780min / 60min=13hrs)<BR>_Example:_ `TIMEDST 1,1,10,1,2,660`
Timezone<a id="timezone"></a>|`-13..+13` = set timezone offset from UTC in hours<BR>`-13:00..+13:00` = set timezone offset from UTC in hours and minutes<BR>`99` = use timezone configured with `TimeDST` and `TimeSTD`
TuyaMCU<a id="tuyamcu"></a>|Used to map functions in TuyaMCU <br>`<fnId>,<dpId>` = [read more...](TuyaMCU)<BR>`<fnId>,0` = remove setting for fnId
Upgrade<a id="upgrade"></a>|`1` = download firmware from `OtaUrl` and restart<BR>`<value>` = download firmware from `OtaUrl` if \<value\> is higher than device version
Upload<a id="upload"></a>|`1` = download firmware from `OtaUrl` and restart<BR>`<value>` = download firmware from `OtaUrl` if \<value\> is higher than device version
WebLog<a id="weblog"></a>|`0` = disable web logging<BR> `1` = show only error messages<BR> `2` = show error and info messages *(default)*<BR>`3` = show error, info and debug messages<BR>`4` = show error, info and more debug messages
See also|[`SetOption68`](#setoption68) - PWM Channel control<BR>[`SetOption76`](#setoption76) - DeepSleep disable bootcount incrementing

### Wi-Fi

Command|Parameters
:---|:---
AP<a id="ap"></a>|`0` = switch to other Wi-Fi Access Point<BR>`1`= select Wi-Fi Access Point 1<BR>`2`= select Wi-Fi Access Point 2
CORS<a id="cors"></a>|`"` = disable CORS (Cross Origin Resource Sharing) (default)<BR>`*` = enable CORS for all locations<BR>`value` = Enable CORS for location. This needs to be complete url ex: `http://tasui.shantur.com`
Hostname<a id="hostname"></a>|`1` = reset hostname to `MQTT_TOPIC-<4digits>` and restart<BR>`<value>` = set hostname (32 char limit) and restart. If hostname contains `%` it will be reset to the default instead.<BR>**_If using MQTT to issue this command, if it is used with the device `GroupTopic`, the command will not be executed._**
IPAddress&#60;x><a id="ipaddress"></a>|Set networking IP (`XXX.XXX.XXX.XXX`) addresses<BR>`IPAddress1` = set device IP address<BR><li>`0.0.0.0` = use dynamic IP address (DHCP)</li><li>`XXX.XXX.XXX.XXX` = set static IP address</li>`IPAddress2` = set gateway IP address<BR>`IPAddress3` = set subnet mask<BR>`IPAddress4` = set DNS server IP address<BR><BR>*follow IPAddress commands with `restart 1` to apply changes*
Password<x\><a id="password"></a>|`<x>` = `1..2`<BR>`<value>` = set AP<x\> Wi-Fi password and restart<BR>`1` = reset AP<x\> Wi-Fi password to firmware default (`STA_PASS1` or `STA_PASS2`) and restart<BR>Passwords are limited to 64 characters. **Do not use special characters or white spaces in the password**.<BR>**Note that `Password` and `Password1` are equivalent commands.**
Ssid<x\><a id="ssid"></a>|`<x>` = `1..2`<BR>`<value>` = set AP<x\> Wi-Fi SSID and restart<BR>`1` = reset AP<x\> Wi-Fi SSID to firmware default (`STA_SSID1` or `STA_SSID2`) and restart<BR>SSID are limited to 32 characters. **Do not use special characters or white spaces in the SSID**
WebColor<x\><a id="webcolor"></a>|Configure Web GUI colors (x = `1..19`)<BR>`#RRGGBB` = Set color for `WebColor<x>`<BR>`1` = Global text (Black)<BR>`2` = Global background (White)<BR>`3` = Form background (Greyish)<BR>`4` = Input text (Black)<BR>`5` = Input background (White)<BR>`6` = Console text (Black)<BR>`7` = Console background (White)<BR>`8` = Warning text (Red)<BR>`9` = Success text (Green)<BR>`10` = Button text (White)<BR>`11` = Button (Blueish)<BR>`12` = Button hovered over (Darker blueish)<BR>`13` = Restart/Reset/Delete button (Redish)<BR>`14` = Restart/Reset/Delete button hover (Darker reddish)<BR>`15` = Save button (Greenish)<BR>`16` = Save button hover (Darker greenish)<BR>`17` = Config timer tab text (White)<BR>`18` = Config timer tab background (Light grey)<br>`19` = Module title and FriendlyName text (Whiteish)<br>[User themes](WebUI#themes)
WebPassword<a id="webpassword"></a>|Show current web server password<BR>`0` = disable use of password for web UI<BR>`1` = reset password to firmware default (`WEB_PASSWORD`)<BR>`<value>` = set web UI password (32 char limit) for user `WEB_USERNAME` *(Default WEB_USERNAME = `admin`)*
WebRefresh<a id="webrefresh"></a>|Web page refresh<BR>`1000..10000` = set refresh time in milliseconds *(default = `2345`)*
WebSend<a id="websend"></a>|Send a command to Tasmota host over http. If a command starts with a `\` it will be used as a link.<BR>`[<host>:<port>,<user>:<password>] <command>`<BR>`<host>` = hostname or IP address.<BR>`<port>` = port for the device if not the default `80`<BR>`<user>` = enter username of the device you're sending the command to<BR>`<password>` = enter password of the device you're sending the command to<BR>`<command>` = command and payload<BR>*example: `[<ip>] POWER1 ON` sends `http://<ip>/cm?cmnd=POWER1 ON`*
WebSensor<x\><a id="websensor"></a>|Control display of sensor telemetry in the web UI<BR>`0` - Do not display sensor's telemetry<BR>`1` - Display sensor's telemetry (*default*)<BR>`<x>` = number corresponding to the sensor - listed in the `sns` section of the [supported sensor spreadsheet](https://docs.google.com/spreadsheets/d/e/2PACX-1vRBFqaP5QAFmT8iIYBxrn-EQp7-SrkxL6tb0OjpqtBxDEsmkiWCFei3sFyA_UXoqlbs3CqtEdOfC6Pa/pubhtml?gid=1029939700&single=true)<BR>`<x>` = `3` Energy telemetry<BR>Issue a `Status 4` to obtain a list of sensor types enabled in the firmware loaded on the device.
WebServer<a id="webserver"></a>|`0` = stop web server<BR>`1` = start web server in user mode<BR>`2` = start web server in admin mode
WifiConfig<a id="wificonfig"></a>|`0` - disable Wi-Fi Manager and reboot (used with alternate AP)<BR>`2` = set [Wi-Fi Manager](https://github.com/tzapu/WiFiManager/blob/master/README.md#how-it-works) as the current configuration tool and start Wi-Fi Manager (web server at 192.168.4.1) for 3 minutes, then reboot and try to connect Wi-Fi network<BR>`4` = disable Wi-Fi Manager but retry the other AP without rebooting<BR>`5` = disable Wi-Fi Manager and wait until that AP is available again without rebooting<BR>`6` = Wi-Fi parameters can only be entered via commands in the serial console<BR>`7` = set [Wi-Fi Manager](https://github.com/tzapu/WiFiManager/blob/master/README.md#how-it-works) (web server at 192.168.4.1) as the current configuration tool restricted with the only option to reset settings. <BR>_This setting is recommended for devices without an external control/reset button_.<BR>&emsp;_No longer supported_ <BR>`1` = set [SmartConfig](https://community.particle.io/t/smart-config-the-missing-manual-now-available/442) ([Android](https://play.google.com/store/apps/details?id=com.iotmaker&hl=en_US)/iOS) as the current configuration tool, start SmartConfig for 3 minutes and reboot and try to connect to Wi-Fi<BR>`3` = set [WPS](https://en.wikipedia.org/wiki/Wi-Fi_Protected_Setup) as configuration tool, try WPS for 3 minutes and reboot and try to connect to Wi-Fi
[WifiPower](WifiPower)<a id="wifipower"></a>|set Wi-Fi transmit power level in decibel-milliwatts (dBm) *(default = `17`)*
See also|[`SetOption55`](#setoption55) - mDNS service control<BR>[`SetOption56`](#setoption56) - Wi-Fi network scan to select strongest signal on restart<BR>[`SetOption57`](#setoption57) - Wi-Fi network re-scan, alternate AP

### MQTT

Command|Parameters
:---|:---
ButtonRetain<a id="buttonretain"></a>|`0` = disable use of MQTT retain flag *(default)*<BR>`1` = enable MQTT retain flag on button press
ButtonTopic<a id="buttontopic"></a>|`<value>` = set MQTT button topic (32 chars max)<BR>`0` = disable use of MQTT button topic<BR>`1` = set MQTT button topic to device `%topic%`<BR>`2` = reset MQTT button topic to firmware default (`MQTT_BUTTON_TOPIC`) *(default = `0`)*<BR>_If using MQTT to issue this command, if it is published to the device `GroupTopic`, the command will not be executed._
FullTopic<a id="fulltopic"></a>|`1` = reset MQTT fulltopic to firmware default (`MQTT_FULLTOPIC`) and restart<BR>`<value>` = set MQTT fulltopic (100 chars max) and restart. Use of [optional %prefix%, %topic%, %hostname%, and %id% substitution tokens](MQTT#mqtt-topic-definition) is allowed.<br>*If using MQTT to issue this command, if it is published to the device `GroupTopic`, _you must ensure uniqueness of the resulting fulltopic on each destination device by using one or more of these substitution tokens._*
GroupTopic<x\><a id="grouptopic"></a>|`1` = reset MQTT group <x\> topic to firmware default (`MQTT_GRPTOPIC`) and restart<BR>`<value>` = set MQTT group <x\> topic (32 chars max) and restart
MqttClient<a id="mqttclient"></a>|`1` = reset MQTT client to firmware config (`MQTT_CLIENT_ID`) and restart<BR>`<value>` = set MQTT client (32 chars max) and restart.<BR>You can use the `%06X` substitution token to replace with last six characters of MAC address.<BR>_If using MQTT to issue this command, if it is used with the device `GroupTopic`, the command will not be executed._
MqttFingerprint<a id="mqttfingerprint"></a>|*TLS needs to be enabled in firmware for this command*&emsp;  »5.13.1<BR>`<value>` =  set current fingerprint as 20 space separated bytes (59 chars max)
MqttHost<a id="mqtthost"></a>|`0` = clear MQTT host field and allow mDNS to find MQTT host<BR>`1` = reset MQTT host to firmware default (`MQTT_HOST`) and restart<BR>`<value>` = set MQTT host (32 chars max) and restart (do NOT use `.local`)
MqttPassword<a id="mqttpassword"></a>|`0` = clear MQTT password<BR>`1` = reset MQTT password to firmware default (`MQTT_PASS`) and restart<BR>`<value>` = set MQTT password (32 chars max) and restart
MqttPort<a id="mqttport"></a>|`1` = reset MQTT port to firmware default (`MQTT_PORT`) and restart<BR>`<value>` = set MQTT port between 2 and 32766 and restart
MqttRetry<a id="mqttretry"></a>|`10..32000` = set MQTT connection retry timer in seconds *(default = `10`)*
MqttUser<a id="mqttuser"></a>|`0` = clear MQTT user name<BR>`1` = reset MQTT user name to firmware default (`MQTT_USER`) and restart<BR>`<value>` = set MQTT user name (32 chars max) and restart
PowerRetain<a id="powerretain"></a>|MQTT [power retain state](MQTT#retained-mqtt-messages)<BR> `0` / `off` = disable MQTT power retain on status update *(default)* <BR> `1` / `on` = enable MQTT power retain on status update <BR>
Prefix1<a id="Prefix1"></a>|`1` = reset MQTT command subscription prefix to firmware default (`SUB_PREFIX`) and restart<BR>`<value>` = set MQTT command subscription prefix (10 chars max) and restart
Prefix2<a id="Prefix2"></a>|`1` = reset MQTT status prefix to firmware default (`PUB_PREFIX`) and restart<BR>`<value>` = set MQTT status prefix (10 chars max) and restart
Prefix3<a id="Prefix3"></a>|`1` = Reset MQTT telemetry prefix to firmware default (`PUB_PREFIX2`) and restart<BR>`<value>` = set MQTT telemetry prefix (10 chars max) and restart
Publish<a id="publish"></a>|`<topic> <payload>` = MQTT publish any topic and optional payload&emsp;  »5.13.0
Publish2<a id="Publish2"></a>|`<topic> <payload>` = MQTT publish any topic and optional payload with retain flag
SensorRetain<a id="sensorretain"></a>|`0` = disable use of sensor MQTT retain flag *(default)*<BR>`1` = enable MQTT retain flag on message `tele/%topic%/SENSOR`
StateText1<a id="StateText1"></a>|`<value>` = set `OFF` state text (10 chars max)
StateText2<a id="StateText2"></a>|`<value>` = set `ON` state text (10 chars max)
StateText3<a id="StateText3"></a>|`<value>` = set `TOGGLE` state text (10 chars max)
StateText4<a id="StateText4"></a>|`<value>` = set `HOLD` state text (10 chars max)
SwitchRetain<a id="switchretain"></a>|`0` = disable use of MQTT retain flag *(default)*<BR>`1` = enable MQTT retain flag on switch press
Subscribe<a id="subscribe"></a>|Subscribes to an MQTT topic and assigns an Event name to it.<BR>`<eventName>, <mqttTopic> [, <key>]` = [Read more...](Subscribe-&-Unsubscribe)<br>`  ` = list all topics currently subscribed
SwitchTopic<a id="switchtopic"></a>|`<value>` = set MQTT switch topic (32 chars max)<BR>`0` = disable use of MQTT switch topic<BR>`1` = set MQTT switch topic to device `%topic%`<BR>`2` = reset MQTT switch topic to firmware default (`MQTT_SWITCH_TOPIC`) *(default = `0`)*<BR>[Read more](Buttons-and-Switches) about this.<BR>_If using MQTT to issue this command, if it is used with the device `GroupTopic`, the command will not be executed._
TelePeriod<a id="teleperiod"></a>|`0` = disable telemetry messages<BR>`1` = reset telemetry period to firmware default (`TELE_PERIOD`)<BR>`10..3600` = set telemetry period in seconds *(default = `300`)*
Topic<a id="topic"></a>|`1` = reset MQTT topic to firmware default (`MQTT_TOPIC`) and restart<BR>`<value>` = set MQTT topic (32 chars max) **and** `ButtonTopic` and restart.<BR>*If using MQTT to issue this command, if it is used with the device `GroupTopic`, the command will not be executed. (Mqtt Topic can't be equal to Mqtt Client)*
Unsubscribe<a id="unsubscribe"></a>|Unsubscribe from topics subsribed to with [`Subscribe`](#subscribe) <BR>`  ` = unsubscribe all topics<BR>`<eventName>` = unsubscribe from a specific MQTT topic
See also|[`SetOption3`](#setoption3) - Disable//Enable MQTT<BR>[`SetOption4`](#setoption4) - Return MQTT response as `RESULT` or `%COMMAND%` topic<BR>[`SetOption10`](#setoption10) - Main topic change behavior

### Rules

Command|Parameters
:---|:---
Add<x\><a id="add"></a>|`<value>` = add value to Var<x\> ([example](Rule-Cookbook#arithmetic-commands-to-be-used-with-vars))
CalcRes<a id="calcres"></a>|Current calculation resolution<BR>`0..7` = set number of decimal places to be used in `Add`, `Sub`, `Mult` and `Scale`
Event<a id="event"></a>|Execute an event to trigger a rule as [documented](Rules#rule-trigger)&emsp;  »5.13.0
Mem<x\><a id="mem"></a>|Manage up to 16 variables stored on flash (x = `1..16`)<BR>`Mem` returns all current values. `Mem<x>` returns the variable's current value.<BR>`<value>` = store a string value in a variable<BR>`"` = clear stored value in Mem<x\>
Mult<x\><a id="mult"></a>|`<value>` = multiply value to Var<x\> ([example](Rule-Cookbook#arithmetic-commands-to-be-used-with-vars))<BR>
Rule<x\><a id="rule"></a>|Rules. [Read more...](Rules)<BR>`0` = disable Rule<x\><BR>`1` = enable Rule<x\><BR>`2` = toggle Rule<x\><BR>`4` = disable one-shot detection (perform commands as long as trigger is met)<BR>`5` = enable one-shot (e.g., sometimes used for slow changing sensors like temperature) detection<BR>`6` = toggle one-shot detection<BR>`8` = disable stop-on-error after exception restart<BR>`9` = enable stop-on-error after exception restart<BR>`10` = toggle stop-on-error after exception restart<BR>`<value>` = define Rule<x\><BR>`+<value>` = append to Rule<x\><BR>`"` = clear Rule<x\>
RuleTimer<x\><a id="ruletimer"></a>|Up to eight timers to be used as countdown event (x = `1..8`)&emsp;  »5.13.0<BR>`0..32766` = set countdown rule timer in seconds
Scale<x\><a id="scale"></a>|Scale value from a low and high limit to another low and high limits and save in Var<x\> ([example](Rule-Cookbook#arithmetic-commands-to-be-used-with-vars))<BR>`v` = value: the number to scale<BR>`fl` = fromLow: the lower bound of the value’s current range<BR>`fh` = fromHigh: the upper bound of the value’s current range<BR>`tl` = toLow: the lower bound of the value’s target range<BR>`th` = toHigh: the upper bound of the value’s target range
Sub<x\><a id="sub"></a>|`<value>` = subtract value to Var<x\> ([example](Rule-Cookbook#arithmetic-commands-to-be-used-with-vars))
Var<x\><a id="var"></a>|Manage up to 16 variables stored in memory (x = `1..16`)<BR>`Var` returns all current values. `Var<x>` returns the variable's current value.<BR>`<string>` = store a string value in a variable<BR>`"` = clear stored value in Var<x\>

### Timers
» v5.13.1

Command|Parameters
:---|:---
Latitude<a id="latitude"></a>|`<value>` = set latitude
Longitude<a id="longitude"></a>|`<value>` = set longitude
Timers<a id="timers"></a>|Timers control<br>`0` = disable all timers<BR>`1` = enable all timers<BR>`2` = toggle all timers<BR>
Timer<x\><a id="timer"></a>|Parameters for Timer<x\> where x = `1..16`<BR>`0` = clear parameters for Timer<x\><BR>`1..16` = copy Timer\<y\> parameters to Timer<x\><BR>`{ "name":value ; .. }` = set all or individual parameters using JSON payload with names and values of data pairs from the [table](Timers#json-payload-anatomy) 

> [!Note]
> Information on sensors documented below is transmitted in the Tasmota telemetry message
### Sensors

Command|Parameters
:---|:---
AdcParam<a id="adcparam"></a>|ADC0 analog input tuning parameters<br>`<sensor>, <param1>, <param2>, <param3>,  <param4>`<BR>`<sensor>` values:<br>&emsp; `2` = Temperature [Steinhart-Hart thermistor equation](https://en.wikipedia.org/wiki/Steinhart%E2%80%93Hart_equation) parameters:</li><ul>`<param1>` = NTC Voltage bridge resistor in Ohms *(default = `32000`)*<br>`<param2>` = NTC Resistance in Ohms *(default = `10000`)*<BR>`<param3>` = NTC Beta Coefficient *(default = `3350`)*</li></ul><br>&emsp; `3` = Light [Lux equation](https://www.allaboutcircuits.com/projects/design-a-luxmeter-using-a-light-dependent-resistor/) parameters:</li><ul>`<param1>` = LDR Voltage bridge resistor in Ohms *(default = `10000`)*<BR>`<param2>` = LDR Lux Scalar *(default = `12518931`)*<BR>`<param3>` = LDR Lux Exponent *(default = `-1.4050`)*</li></ul><br>&emsp; `6` = ADC linear range remapping parameters:</li><ul>`<param1>` = input range low value `adcLow` *(default = `0`)*<BR>`<param2>` = input range high value `adcHigh` *(default = `1023`)*<BR>`<param3>` = output range low value `rangeLow` *(default = `0`)*<BR>`<param4>` = output range high value `rangeHigh` *(default = `100`)*<BR>The range remapping perform the following calculation on the ADC value *[0..1023]*:<BR>`Range = ((adcHigh - ADC) / (adcHigh - adcLow)) * (rangeLow - rangeHigh) + rangeHigh`<br>*The calculation is performed in double resolution floating point but all 4 parameters as well as the range output are unsigned 16 bit integers. The calculation result must not exceed [0..65535].*<BR>Example to convert the ADC value on a D1-mini into millivolts (using the default resistor bridge of 220k/100k):<BR>`AdcRange 6, 0, 1023, 0, 3200`
Altitude<a id="altitude"></a>|`-30000..30000` - altitude in meters
AmpRes<a id="sensors-ampres"></a>|Current sensor resolution<BR>`0..3` = maximum number of decimal places
Counter<x\><a id="counter"></a>|`0` = reset Counter<x\><BR> `1..64900` = preset Counter<x\><BR>`-1..-64900` = decrease Counter<x\><BR>`+1..+64900` = increase Counter<x\><BR>In order to define and use a Counter, _**you must configure one of the free device GPIO as `Counter<x>`**_
CounterDebounce<a id="counterdebounce"></a>|`0` = turn off counter debounce<BR> `1..3200` = set counter debounce time in milliseconds
CounterType<x\><a id="countertype"></a>|`0` = set Counter<x\> as pulse Counter<BR>`1` = set Counter<x\> as pulse Timer
HumOffset<a id="humoffset"></a>|`-10.0..10.0` = Set calibraton offset value for reported humidity telemetry<BR>This setting affects **all** humidity sensors on the device.
HumRes<a id="humres"></a>|Humidity sensor resolution<BR>`0..3` = maximum number of decimal places
PressRes<a id="pressres"></a>|Pressure sensor resolution<BR>`0..3` = maximum number of decimal places
Sensor13<a id="sensor13"></a>|[INA219](http://www.ti.com/product/INA219) low voltage current sensor calibration mode<BR>Predefined modes to use with standard 0.1 ohm resistor:<BR>`0` = set INA219 calibration to max 32V and 2A<BR>`1` = set INA219 calibration to max 32V and 1A<BR>`2` = set INA219 calibration to max 16V and 0.4A<BR>`10`..`255`: Define custom shunt resistor encoded as a decimal number `RRM` such that `Rshunt = RR * 10^M` milliohm<BR>Do not forget to choose a resistor adapted for the correct power dissipation and apply a 50% security margin !<BR>Examples:<BR>`11` = 1 * 10^1 = 10 milliohm (Imax=32A => Pres=15W)<BR>`21` = 2 * 10^1 = 20 milliohm (Imax=16A => Pres=7W)<BR>`12` = 1 * 10^2 = 100 milliohm (default, Imax=3.2A => Pres=2W)<BR>`13` = 1 * 10^3 = 1000 milliohm = 1 ohm (Imax=0.320A => Pres=0,2W)
Sensor15<a id="sensor15"></a>|[Automatic Baseline Correction](https://github.com/arendst/Tasmota/blob/c97ea4d9176eb7e87abff5f963a0f1c60f0a5e52/sonoff/xsns_15_mhz19.ino#L47) for [MH-Z19B](/peripherals/MH-Z19B) CO<sub>2</sub> sensor<BR>`0` = disabled<BR>`1` = enabled *(default)*<BR>`2` = disable and start manual calibration from 400 ppm of CO<sub>2</sub><BR>`9` = reset sensor to factory defaults<BR>`1000` = sets measurement range to 1000ppm CO<sub>2</sub><BR>`2000` = sets measurement range to 2000ppm CO<sub>2</sub><BR>`3000` = sets measurement range to 3000ppm CO<sub>2</sub><BR>`5000` = sets measurement range to 5000ppm CO<sub>2</sub>
Sensor20<a id="sensor20"></a>|[Nova Fitness SDS011](/peripherals/SDS011) dust sensor.<BR>1..255` = number of seconds before TelePeriod to poll the sensor
Sensor27<a id="sensor27"></a>|[APDS-9960](/peripherals/APDS-9960) sensor commands<BR>`0` = enable light level and proximity sensor / disable gestures *(default)* <BR> `1` = enable gesture mode/ disable light level and proximity sensor<BR> `2` = enable gestures with half gain / disable light and proximity sensor<BR>`3..255` = Set [ATIME register](/peripherals/APDS-9960#known-issues) for different integration times
Sensor29<a id="sensor29"></a>|MCP23008 / MCP23017 I<sup>2</sup>C GPIO Expander configuration.  [Read more...](/peripherals/MCP230xx)<BR>`Reset<x>` = reset all pins<BR>x = `1..6`<BR>`1` = INPUT mode, no reporting, no pull-up<BR>`2` = INPUT mode, report on CHANGE, pull-up enabled<BR>`3` = INPUT mode, report on LOW, pull-up enabled<BR>`4` = INPUT mode, report on HIGH, pull-up enabled<BR>`5` = OUTPUT mode (if enabled by `#define USE_MCP230xx_OUTPUT`)<BR>`6` = inverted OUTPUT mode (if enabled by `#define USE_MCP230xx_OUTPUT`)<BR><BR>`pin,pinmode{,intpullup\|outstate{,repmode}}`<br>[Continue reading...](/peripherals/MCP230xx#device-configuration)
Sensor34<a id="sensor34"></a>|<BR>[HX711 load cell](https://github.com/bogde/HX711) sensor calibration<BR>`1` = reset display to 0<BR>`2` = start calibration<BR>`2` `<value>` = set reference weight in grams and start calibration<BR>`3` = show reference weight in grams<BR>`3` `<value>` = set reference weight in grams<BR>`4` = show calibrated scale value<BR>`4` `<value>` = set calibrated scale value<BR>`5` = show max weight in gram<BR>`5` `<value>` = set max weight in grams<BR>`6` = show single item weight in grams<BR>`6` `<value>` = set single item weight in grams. Once the item weight is set, when items are added to the scale, the telemetry message will report `Count` as the number of items on the scale<BR>`7` = save current weight to be used as start weight on restart<BR>`8` `0/1` <BR>&emsp;`0` = disable JSON message on weight change over 4 grams<BR>&emsp;`1` = enable JSON message on weight change (see below)<BR>`9` `<value>` = set minimum delta to trigger JSON message (see above). <BR>&emsp;`0` = 4 grams (old default)<BR>&emsp;`1..100` = set delta to 0-99 grams<BR>&emsp;`101-255` = set delta to 110-1650 grams (10g increments)
Sensor50<a id="Sensor50"></a>|[PAJ7620](/peripherals/PAJ7620) gesture sensor<BR>`0` = sensor muted, no readings in Tasmota<BR>`1`= gesture mode<BR>`2` = proximity mode<BR>`3` = corner mode<br>`4` = PIN mode<br>`5` = cursor mode
Sensor53<a id="sensor53"></a>|[Smart Meter Interface](/peripherals/Smart-Meter-Interface)<BR>`r` = reset the driver with a new descriptor specified with the Tasmota [Scripting](Scripting-Language) language.<BR>`c<x> <value>` = preset counter (x = `1..5`) to `value` when the driver is set to counter mode<BR>`d<x>` = disable data decoding and dump meter (x = `1..5`) data to the Console. This is used to decipher the meter's data format to define the variable encoding in the meter's descriptor.<BR>`d0` = disable data dump mode and revert to decoding mode.
SpeedUnit<a id="SpeedUnit"></a>|[TX20/TX23](/peripherals/TX2x) anemometer speed unit<BR>`1` = m/s<BR>`2`= km/h<BR>`3` = kn<br>`4` = mph<BR>`5` = ft/s<BR>`6` = yd/s
TempRes<a id="tempres"></a>|Temperature sensor resolution<BR>`0..3` = maximum number of decimal places
TempOffset<a id="tempoffset"></a>|`-12.6..12.6` = Set calibraton offset value for reported temperature telemetry<BR>This setting affects **all** temperature sensors on the device.
VoltRes<a id="sensors-voltres"></a>|Voltage sensor resolution<BR>`0..3` = maximum number of decimal places
WattRes<a id="sensors-wattres"></a>|Power sensor resolution<BR>`0..3` = maximum number of decimal places
WeightRes<a id="weightres"></a>|Load cell sensor resolution<BR>`0..3` = maximum number of decimal places
See also|[`SetOption8`](#setoption8)  - Show temperature in Celsius *(default)* or Fahrenheit<BR>[`SetOption18`](#setoption18) - Set status of signal light paired with CO<sub>2</sub> sensor<BR>[`SetOption24`](#setoption24) - Set pressure units

### Power Monitoring

Command|Parameters
:---|:---
AmpRes<a id="ampres"></a>|Current sensor resolution<BR>`0..3` = maximum number of decimal places
CurrentCal<a id="currentcal"></a>|<value> `1100..32767` *(default = `3500`)*<BR>Set calibration offset value for reported `Current` telemetry<BR>Allows finer calibration for HLW8012, HJL01, and BL0937 energy monitoring devices
CurrentHigh<a id="currenthigh"></a>|`0` = disable current high threshold *(default)*<BR>`<value>` = set current high threshold value in milliamps
CurrentLow<a id="currentlow"></a>|`0` = disable current low threshold *(default)*<BR>`<value>` = set current low threshold value in milliamps
CurrentSet<a id="currentset"></a>|`<value>` = [calibrate](Power-Monitoring-Calibration) current to target value in mA
EnergyRes<a id="energyres"></a>|Energy sensor resolution<BR>`0..5` = maximum number of decimal places
EnergyReset&#60;x><a id="energyreset"></a>|`0..42500` (for `3`, Total, upper limit is `4250000`) in watt-hours (Wh)<BR>x = `1..5`<BR>`1` `<value>` = ((p)re)set values for Today<BR>`2` `<value>` = ((p)re)set values for Yesterday<BR>`3` `<value>` = ((p)re)set values for Total<BR><BR>`4` `<standard>`{,`<off-peak>`} = ((p)re)set tariff period values for Totals<BR>`5` `<standard>`{,`<off-peak>`} = ((p)re)set tariff period values for Exported
FreqRes<a id="freqres"></a>|Frequency sensor resolution<BR>`0..3` = maximum number of decimal places
FrequencySet<a id="frequencyset"></a>|`<value>` = [calibrate](Power-Monitoring-Calibration) frequency to a target value in Hz
MaxPower<a id="maxpower"></a>|`0` - disable use maximum power monitoring<BR>`<value>` = set maximum allowed power in watts
MaxPowerHold<a id="maxpowerhold"></a>|`1` = set default time to 10 seconds to stay over MaxPower before power off<BR>`<value>` = set time in seconds to stay over MaxPower before power off
MaxPowerWindow<a id="maxpowerwindow"></a>|`1` = set default time to 30 seconds to stay power off before re-applying power up to 5 times<BR>`<value>` = set time in seconds to stay power off before re-applying power up to 5 times
ModuleAddress<a id="moduleaddress"></a>|Set the address of a PZEM module<BR>`1..3` = the last octet of the PZEM-004T serial address<BR>`<address>` = the last octet of the slave address on MODBUS PZEM energy monitoring modules<BR>Prior to setting the module address, the PZEM **_must be connected_** to **both** RX and TX, **and** AC voltage.<BR>Connect one PZEM at a time and issue this command. Repeat for each PZEM to be connected for multi-phase monitoring.<BR>_The command without an argument cannot be used to read the address of the connected PZEM._
PowerCal<a id="powercal"></a>|<value> `4000..32767` *(default = `12530`)*<BR>Set calibration offset value for reported `Power` telemetry reading<BR>Allows finer calibration for HLW8012, HJL01, and BL0937 energy monitoring devices
PowerDelta<a id="powerdelta"></a>|Set maximum delta for energy monitoring devices to report on active power load change while the power is ON. `PowerDelta` will not report when the power turns off.&emsp;  »5.13.0<BR>`0` = disable reporting on power change<BR>`1..100` = set reporting on percentage power change to send an MQTT telemetry message<BR>`101..32000` = set reporting on absolute power change to send an MQTT telemetry message (offset by 100, e.g., `101`=1W, `207`=107W) 
PowerHigh<a id="powerhigh"></a>|`0` = disable power high threshold *(default)*<BR>`<value>` = set power high threshold value in watts to send an MQTT telemetry message
PowerLow<a id="powerlow"></a>|`0` = disable power low threshold *(default)*<BR>`<value>` = set power low threshold value in watts to send an MQTT telemetry message
PowerSet<a id="powerset"></a>|`<value>` = [calibrate](Power-Monitoring-Calibration) power to a target value in watts&emsp;  »5.12.0
Status<a id="powermon-status"></a>|`8` = show power usage<BR>`9` = show power thresholds
Tariff&#60;x><a id="tariff"></a>|P1 Smart Meter tariff configuration<BR>x = `1, 2, 9`<BR>`1` `STD,DST` Start times for off-peak tariff<BR>`2` `STD,DST` End times for off-peak tariff<BR>`9` `0/1`<BR>&emsp;`0` = use Start/End times also on weekends.<BR>&emsp;`1` = use off-peak tariff all weekend.<BR>`STD` and `DST` may be specified as:<BR>&emsp;`<hour>` = `0..23` or<BR>&emsp;`<time>` = `00:00..23:59` or<BR>&emsp;`<minutes>` = `0..1439` (since midnight)<BR>If both `Tariff1` STD and `Tariff2` STD are equal, all tariffs are disabled.
VoltageCal<a id="voltagecal"></a>|Set calibration offset value for reported `Voltage` telemetry reading<BR><value> `1000..32767` *(default = `1950`)*<BR>Allows finer calibration for HLW8012, HJL01, and BL0937 energy monitoring devices
VoltageHigh<a id="voltagehigh"></a>|`0` = disable voltage high threshold *(default)*<BR>`<value>` = set voltage high threshold value in V 
VoltageLow<a id="voltagelow"></a>|`0` = disable voltage low threshold *(default)*<BR>`<value>` = set voltage low threshold value in V 
VoltageSet<a id="voltageset"></a>|`<value>` = [calibrate](Power-Monitoring-Calibration) voltage to a target value in V&emsp;  »5.12.0
VoltRes<a id="voltres"></a>|Voltage sensor resolution<BR>`0..3` = maximum number of decimal places
WattRes<a id="wattres"></a>|Power sensor resolution<BR>`0..3` = maximum number of decimal places
See Also|[`SetOption21`](#setoption21) - Energy monitoring when power is off<BR>[`SetOption33`](#setoption33) - Configure power monitoring Max_Power_Retry count number<BR>[`SetOption39`](#setoption39) - Control handling of invalid power measurements<BR>[`SetOption72`](#setoption72) - Set reference used for total energy

### Light
<!--- 
<a id="Brightness>"></a>Brightness|`0..255` = set brightness value from 0 to 255
 -->

Command|Parameters
:---|:---
Channel<x\><a id="channel"></a>|`0..100` = set PWM channel dimmer value from 0 to 100%&emsp;  »5.13.0<BR>`+` = increase by 10<BR>`-` = decrease by 10<BR>When [`SetOption68`](#setoption68) is set to `1` `Channel<x>` will follow `Power<x>` numbering with Relays first then PWM.<BR>**Example**:<br>2 Relays and 3 PWM: Relay1 = `Power1`; Relay2 = `Power2`; PWM1 = `Power3` and `Channel3`; PWM2 = `Power4` and `Channel4`; PWM3 = `Power5` and `Channel5`
Color<x\><a id="color"></a>|x = `1..6`<BR>&emsp; `1` = Set color<BR>&emsp; `2` = Set color adjusted to current `Dimmer` value<BR>&emsp; `3` = Set clock seconds hand color *([Scheme](#Scheme) `5` only)*<BR>&emsp; `4` = Set clock minutes hand color *([Scheme](#Scheme) `5` only)*<BR>&emsp; `5` = Set clock hour hand color *([Scheme](#Scheme) `5` only)*<BR>&emsp; `6` = Set clock hour marker color<BR>`<value>`<BR>`r,g,b` = set color by decimal value (`0..255`)<BR>`#CWWW` = set hex color value for CT lights <BR>`#RRGGBB` = set hex color value for RGB lights<BR>`#RRGGBBWW` = set hex color value for RGBW lights<BR>`#RRGGBBCWWW` = set hex color value for RGBCCT lights (5 PWM channels)<BR>**Note**:<br>Just append an `=` instead of the remaining color codes, this way they wont get changed. For example a command like `Color #00ff=` would update the RGB part to disable red and enable geen, but would omit to update blue or any white channel.
 |Set color to<BR>`1` = red<BR>`2` = green<BR>`3` = blue<BR>`4` = orange<BR>`5` = light green<BR>`6` = light blue<BR>`7` = amber<BR>`8` = cyan<BR>`9` = purple<BR>`10` = yellow<BR>`11` = pink<BR>`12` = white (using RGB channels)<BR>`+` = next color<BR>`-` = previous color
CT<a id="ct"></a>|`153..500` = set color temperature from 153 (cold) to 500 (warm) for CT lights<BR>`+` = increase CT value by 10<BR>`-` = decrease CT value by 10
Dimmer<a id="dimmer"></a>|`0..100` = set dimmer value from 0 to 100%<BR>`+` = increase by 10<BR>`-` = decrease by 10
Dimmer&#60;x>|**Commands available only when `SetOption37 >= 128`** ([#6819](https://github.com/arendst/Tasmota/pull/6819))<br>`<value>` same as in `Dimmer`<br>`Dimmer0 <value>` - set dimming for all channels<BR>`Dimmer1 <value>` - set dimming for RGB channels<BR>`Dimmer2 <value>` - set dimming for white channels
DimmerRange<a id="dimmerrange"></a>|Change dimming range. *Works only with TuyaMCU and PS_16_DZ serial dimmers.*<br>`<dimmerMin>,<dimmerMax>` = set dimming range from minimum to maximum value<BR>***Does not change [`Dimmer`](#dimmer) command behavior***
Fade<a id="fade"></a>|`0` = do not use fade *(default)* <BR>`1` = use fade
HsbColor<a id="hsbcolor"></a>|`<hue>,<sat>,<bri>` = set color by hue, saturation and brightness
HsbColor1<a id="HsbColor1"></a>|`0..360` = set hue
HsbColor2<a id="HsbColor2"></a>|`0..100` = set saturation 
HsbColor3<a id="HsbColor3"></a>|`0..100` = set brightness
Led<x\><a id="led"></a>|`#RRGGBB` = set hex color value where `<x>` is the pixel number of the LED<br> *(applies only to addressable LEDs)*
LedTable<a id="ledtable"></a>|`0` = do not use [LED gamma correction](https://learn.adafruit.com/led-tricks-gamma-correction?view=all) *(default &laquo;6.5.0.9)*<BR>`1` = use gamma correction *(default &raquo;6.5.0.9)*
Pixels<a id="pixels"></a>|`1..512` = set amount of pixels in strip or ring and reset [`Rotation`](#rotation) *(applies only to addressable LEDs)*
RGBWWTable<a id="rgbwwtable"></a>|Control compensation of unbalanced PWM channels or  [White Blend Mode](White-Blend-Mode) <br>`PWM1,PWM2,PWM3,PWM4,PWM5` = channel range with values `0..255` *(default =`255,255,255,255,255`)*<BR>Range adjustment is computed **after** Gamma correction.
Rotation<a id="rotation"></a>|`<value>` = set amount of pixels to rotate (up to `Pixels` value) *(applies only to addressable LEDs)*
Scheme<a id="scheme"></a>|Light effects<BR>`+` = next scheme<BR>`-` = previous scheme<BR>`0` = single color for LED light *(default)*<BR>`1` = start wake up sequence (same as [`Wakeup`](#wakeup))<BR>`2` = cycle up through colors using Speed option<BR>`3` = cycle down through colors using Speed option<BR>`4` = random cycle through colors using Speed and Fade
|**Following schemes are usable only with addressable LEDs, e.g. WS281X, Neopixel**<BR>`5` = clock mode ([example](https://hackaday.io/project/28194-esp-and-ws2812-based-clock))<BR>`6` = candlelight pattern<BR>`7` = RGB pattern<BR>`8` = Christmas pattern<BR>`9` = Hanukkah pattern<BR>`10` = Kwanzaa pattern<BR>`11` = rainbow pattern<BR>`12` = fire pattern
Speed<a id="speed"></a>|`1..40` = set fade speed from fast `1` to very slow `40`<BR>`+` = increase speed<BR>`-` = decrease speed<BR>The `Speed` value represents the time in 0.5s to fade from 0 to 100% (or the reverse). Example: `Speed 4` takes 2.0s to fade from full brightness to black, or 0.5s to move from 75% to 100%.
Wakeup<a id="wakeup"></a>|Start wake up sequence from OFF to stored `Dimmer` value<BR>`0..100` = Start wake up sequence from OFF to provided `Dimmer` value
WakeupDuration<a id="wakeupduration"></a>|`1..3000` = set wake up duration in seconds
White<a id="white"></a>|<BR>`1..100` = set white channel brightness in single white channel lights (single W or RGBW lights)
Width&#60;x><a id="width"></a>|x = `1..4`<BR>`1` - `0..4` = LED group width *([Scheme](#Scheme) `6..12` only)*<BR>`2` - `0..32` = seconds hand width *([Scheme](#Scheme) `5` only)*<BR>`3` - `0..32` = minutes hand width *([Scheme](#Scheme) `5` only)*<BR>`4` - `0..32` = hour hand width *([Scheme](#Scheme) `5` only)*
See also|[`SetOption15`](#setoption15), [`SetOption16`](#setoption16), [`SetOption17`](#setoption17), [`SetOption20`](#setoption20), [`SetOption37`](#setoption37) and [`SetOption68`](#setoption68) 

### RF Bridge


Command|Parameters
:---|:---
RfCode<a id="rfcode"></a>|Show last sent 24-bit user code<BR>`1..8388607` = send 24-bit user code<BR>`#1..#7FFFFF` = send 24-bit hexadecimal user code using RfSync, RfLow and RfHigh timing
RfHigh<a id="rfhigh"></a>|`1` = reset high pulse time to 840 microseconds<BR>`2..32767` = set high pulse time in microseconds<BR>`#2..#7FFF` = set high pulse time in hexadecimal microseconds
RfHost<a id="rfhost"></a>|Show 16-bit host part of user code<BR>`1` = reset 16-bit host part of user code to 11802 (#2E1A)<BR>`2..32767` = set 16-bit host part of user code<BR>`#2..7FFF` = set 16-bit host part of user code in hexadecimal
RfKey<x\><a id="rfkey"></a>|Send learned or default RF data for RfKey<x\> (x = `1 – 16`)<BR>`1` = send default RF data for RfKey<x\> using RfSync, RfLow, RfHigh and RfHost parameters<BR>`2` = learn RF data for RfKey<x\><BR>`3` = unlearn RF data for RfKey<x\><BR>`4` = save RF data using RfSync, RfLow, RfHigh and last RfCode parameters<BR>`5` = show default or learned RF data<BR>`6` = send learned RF data
RfLow<a id="rflow"></a>|`1` = reset low pulse time to 270 microseconds<BR>`2..32767` = set low pulse time in microseconds<BR>`#2..#7FFF` = set low pulse time in hexadecimal microseconds
RfRaw<a id="rfraw"></a>|**This command only works when the firmware has been updated with [Portisch firmware](https://github.com/Portisch/RF-Bridge-EFM8BB1/releases).** Refer to the [Portisch wiki](https://github.com/Portisch/RF-Bridge-EFM8BB1/wiki) for details.<BR>[Learning and Decoding RF Codes with Portisch Firmware](/devices/Sonoff-RF-Bridge-433#portisch-firmware-specific-usage)<BR>`0` = Set iTead default firmware support and messages *(default on restart)*<BR> `1` = set Portisch firmware support and messages<BR> `166` or `AAA655` = start sniffing/reading RF signals disabling iTead default RF handling<BR> `167` or `AAA755` = stop sniffing/reading RF signals enabling iTead default RF handling<BR> `168` or `AAA855` = transmitting iTead default RF protocols<BR> `169` or `AAA955` = start sniffing and learning predefined protocols<BR> `176` or `AAB055` = bucket Transmitting using command 0xB0<BR> `177` or `AAB155` = start Bucket sniffing using command 0xB1<BR> `192` or `AAC000C055` = beep (`00C0` is the length of the sound)<BR> `255` or `AAFF55` = show Rf firmware version (result AA02FF means Version 02)<BR> `<value>` = hexadecimal data to be sent to RF chip. This must be immediately followed by the `RfRaw 0` command (e.g., `Backlog RfRaw <value>; RfRaw 0`
RfSync<a id="rfsync"></a>|`1` = reset start sync pulse time to 8470 microseconds<BR>`2..32767` = set start sync pulse time in microseconds<BR>`#2..#7FFF` = set start sync pulse time in hexadecimal microseconds
See also|[`SetOption28`](#setoption28) - Set RF received data format

### IR Remote

Command|Parameters
:---|:---
IRsend`<x>`<a id="irsend"></a>|Send an IR remote control code as a decimal or hexadecimal string in a JSON payload. In order to send IR data, _**you must configure one of the free device GPIO as `IRsend (8)`. GPIO01 nor GPIO03 can be used.**_<BR>`<x>` [_optional_] = number of times the IR message is sent. If not specified or `0..1`, the message is sent only once (i.e., not repeated) _(default)_<BR>`>1` = emulate a long-press on the remote control, sending the message `<x>` times, or sending a repeat message for specific protocols (like NEC)<BR><BR>`{"Protocol":"<value>","Bits":<value>,"Data":<value>}`<BR><BR>`"Protocol"` (select one of the following):<ul><li>`"NEC"`</li><li>`"SONY"`</li><li>`"RC5"`</li><li>`"RC6"`</li><li>`"DISH"`</li><li>`"JVC"`</li><li>`"PANASONIC"`</li><li>`"SAMSUNG"`</li><li>`"PIONEER"`</li></ul>`"Bits":1..32` = required number of data bits<BR>&nbsp;&nbsp;&nbsp;&nbsp;for PANASONIC protocol this parameter is the the address, not the number of bits<BR><BR>`"Data":1..(2^32)-1` = data frame as 32 bit decimal.<BR>&nbsp;&nbsp;&nbsp;&nbsp;e.g., `IRsend {"Protocol":"NEC","Bits":32,"Data":2170978686}`<BR>**or**<BR>`"Data":0x1..0xFFFFFFFF` = data frame as 32 bit hexadecimal.<BR>&nbsp;&nbsp;&nbsp;&nbsp;e.g., `IRsend {"Protocol":"NEC","Bits":32,"Data":0x8166817E}`<BR><BR>Alternatively, you can send IR remote control codes using [RAW command encoding](IRSend-RAW-Encoding).<BR><BR>Information on [Receiving Infrared Data](Receiving-Infrared-Remote-Control-Data)
IRhvac<a id="irhvac"></a>|Send HVAC IR remote control code as JSON payload<Br>`{"Vendor":"<value>","Power":<value>,"Mode":”<value>”, "FanSpeed":”<value>”,"Temp":<value>}`<BR>`"Vendor":"Toshiba"\|"Mitsubishi"\|"LG"\|"Fujitsu"`<BR>`"Power":0\|1`<BR>`"Mode":"Hot"\|"Cold"\|"Dry"\|"Auto"`<BR>`"FanSpeed":"1"\|"2"\|"3"\|"4"\|"5"\|"Auto"\|"Silence"` <BR>`"Temp":17..30`
|See also|[`SetOption29`](#setoption29)  - Set IR received data format<BR>[`SetOption38`](#setoption38)  - Set IR received protocol sensitivity<BR>[`SetOption58`](#setoption58) - [IR Raw data in JSON payload](https://github.com/arendst/Tasmota/issues/2116#issuecomment-440716483)

### SetOptions

Command|Parameters
:---:|:---
SetOption0<a id="setoption0"></a>|Save power state and use after restart (=SaveState)<BR> `0` = disable<BR> `1` = enable *(default)*
SetOption1<a id="setoption1"></a>|Set [button multipress](Buttons-and-Switches#multi-press-functions) mode to<BR> `0` = allow all button actions *(default)*<BR> `1` = restrict to single, double and hold actions (i.e., disable inadvertent reset due to long press)
SetOption3<a id="setoption3"></a>|[MQTT](MQTT) <BR>`0` = disable MQTT<BR> `1` = enable MQTT *(default)* 
SetOption4<a id="setoption4"></a>|Return MQTT response as<BR> `0` = RESULT topic *(default)*<BR> `1` = %COMMAND% topic
SetOption8<a id="setoption8"></a>|Show temperature in<BR> `0`= Celsius *(default)*<BR> `1` = Fahrenheit
SetOption10<a id="setoption10"></a>|When the device MQTT topic changes <BR> `0` = remove retained message on old topic LWT *(default)*<BR> `1` = send "Offline" to old topic LWT
SetOption11<a id="setoption11"></a>|Swap button single and double press [functionality](Buttons-and-Switches#changing-default-functionality)<BR> `0` = disabled *(default)*<BR> `1` = enabled
SetOption12<a id="setoption12"></a>|Configuration saving to flash option<BR>`0` = allow dynamic flash save slot rotation *(default)*<BR>`1` = use fixed eeprom flash slot 
SetOption13<a id="setoption13"></a>|Allow immediate action on single button press<BR>`0` = single, multi-press and hold button actions *(default)*<BR> `1` = only single press action for immediate response (i.e., disable multipress detection). Disable by holding for 4 x button hold time (see [`SetOption32`](#setoption32)).
SetOption15<a id="setoption15"></a>|Set PWM control for LED lights<BR>`0` = basic PWM control<BR>`1` = control with [`Color`](#Color) or [`Dimmer`](#Dimmer) commands _(default)_
SetOption16<a id="setoption16"></a>|Set addressable LED Clock scheme parameter<BR> `0` = clock-wise mode *(default)*<BR> `1` = counter-clock-wise mode
SetOption17<a id="setoption17"></a>|Show [`Color`](#Color) string as<BR> `0` = hex string *(default)*<BR> `1` = comma-separated decimal string
SetOption18<a id="setoption18"></a>|Set status of signal light paired with [CO<sub>2</sub> sensor](#sensor14)<BR> `0` = disable light *(default)*<BR>`1` = enable light<BR>The light will be green below `CO2_LOW` and red above `CO2_HIGH` (transition yellow/orange between).  The default levels are: 800ppm for low and 1200ppm for high but these can be set in `user_config_override.h`.
SetOption19<a id="setoption19"></a>|[Home Assistant](integrations/Home-Assistant) automatic discovery.<BR>***WARNING*** On version 6.4.1.x enabling may cause a watchdog reset if used on a device with a configured sensor <BR> `0` = disabled *(default)*<BR> `1` = enabled and also sets [`SetOption59 1`](#setoption59)<BR>If you enable and then disable `SetOption19`, doing so does not set [`SetOption59`](#setoption59)`= 0` and does not revert to default `%prefix%/%topic%/` [`FullTopic`](#fulltopic)
SetOption20<a id="setoption20"></a>|Update of Dimmer/Color/CT without turning power on<BR>`0` = disabled *(default)*<BR>`1` = enabled
SetOption21<a id="setoption21"></a>|Energy monitoring when power is off<BR>`0` = disabled *(default)*<BR>`1` = enabled
SetOption24<a id="setoption24"></a>|Set pressure units <BR> `0` = hPa *(default)*<BR> `1` = mmHg
SetOption26<a id="setoption26"></a>|Use indexes even when only one relay is present<BR> `0` = messages use POWER *(default)*<BR> `1` = messages use POWER1
SetOption28<a id="setoption28"></a>|RF received data format<BR> `0` = hex *(default)*<BR> `1` = decimal 
SetOption29<a id="setoption29"></a>|IR received data format<BR> `0` = hex *(default)*<BR> `1` = decimal 
SetOption30<a id="setoption30"></a>|Enforce Home Assistant auto-discovery as light<BR> `0` = relays are announced as a switch and PWM as a light *(default)*<BR> `1` = both relays and PWM are announced as light
SetOption31<a id="setoption31"></a>|Set status LED  blinking during Wi-Fi and MQTT connection problems.<br> _[`LedPower`](#LedPower) must be set to `0` for this feature to work_<BR>`0` = Enabled *(default)*<BR> `1` = Disabled
SetOption32<a id="setoption32"></a>|Number of 0.1 seconds to hold button before sending `HOLD` action message.<BR> `1..100` to set button hold time *(default = `40`)*. This option also affects the time required to perform a firmware defaults reset (10x `HOLD` action time)
SetOption33<a id="setoption33"></a>|Number of seconds for which the maximum power limit can be exceeded before the power is turned off<BR> `1..250` = set number of seconds *(default = `5`)*
SetOption34<a id="setoption34"></a>|`0..255` = set [Backlog](#backlog) inter-command delay in milliseconds *(default = `200`)*
SetOption36<a id="setoption36"></a>|Boot loop defaults restoration control.<BR>`0` = disable boot loop control<BR> `1..200` = set number of boot loops (a restart caused by any exception or watchdog timer within less than `BOOT_LOOP_TIME` (default 10 seconds) before beginning to restore settings  *(default = `1`)*. Once this number is reached, subsequent restarts will:<ul><li>1<sup>st</sup> restart: disable ESP8285 generic GPIOs interfering with flash SPI</li><li>2<sup>nd</sup> restart: disable rules causing boot loop</li><li>3<sup>rd</sup> restart: disable all rules</li><li>4<sup>th</sup> restart: reset user defined GPIOs to disable any attached peripherals</li><li>5<sup>th</sup> restart: reset module to Sonoff Basic (1)</li></ul>
SetOption37<a id="setoption37"></a>|Color remapping for led channels, also provides an option for allowing independent handling of RGB and white channels. Setting changes require a device reboot.<BR>`0` = disabled<br>`1..119` = according to [this table](SetOption37)<br>`120..127` = invalid (results in same as `0`)<br>`128..255` = same as `0..127` but with independent channel handling enabled
SetOption38<a id="setoption38"></a>|`6..255 ` = set IRReceive protocol detection sensitivity minimizing UNKNOWN protocols
SetOption39<a id="setoption39"></a>|Control handling of invalid power measurements. [Read more...](Power-Monitoring-Calibration#known-issues)<BR>`0` = reset to default on next restart<BR>`1..255` = number of invalid power readings before reporting no load *(default =`128`)*.
SetOption40<a id="setoption40"></a>|Stop detecting input change on the button GPIO. Solves [#5449](https://github.com/arendst/Tasmota/issues/5449)<br>Active only when [`SetOption1 1`](#setoption1) and [`SetOption13 0`](#setoption13). **This disables all long press functionality.**<BR>`0..250` = button hold time in 0.1 seconds after which button functionality is disabled.*(default =`1`)* <BR>Example: `Backlog SetOption1 1; SetOption13 0; SetOption40 10` - discard any button press over 1 second
SetOption42<a id="setoption42"></a>|<BR>`0..255` = set over-temperature (Celsius only) threshold resulting in power off on all energy monitoring devices *(default = `90`)* 
SetOption43<a id="setoption43"></a>|**Deprecated** in favor of [`DimmerRange`](#DimmerRange) <BR>`0..255` = set maximum dimming value ([details](TuyaMCU#dimming-range)) *(default = `100`)*<BR>Available for Tuya  and PS_16_DZ  dimmers
SetOption51<a id="setoption51"></a>|Enable GPIO9 and GPIO10 component selections in Module Configuration<BR>:rotating_light: **WARNING** Do not use on ESP8266 devices! :rotating_light:<BR>`0` = disable *(default)*<BR>`1` = enable
SetOption52<a id="setoption52"></a>|Control display of optional time offset from UTC in JSON payloads<BR>`0` = disable *(default)*<BR> `1` = enable
SetOption53<a id="setoption53"></a>|Display hostname and IP address in GUI<BR>`0` = disable *(default)*<BR> `1` = enable
SetOption54<a id="setoption54"></a>|Apply [`SetOption20`](#setoption20) settings to commands from Tuya device<BR>`0` = disable *(default)*<BR> `1` = enable
SetOption55<a id="setoption55"></a>|mDNS service<BR>`0` = disable *(default)* <BR> `1` = enable
SetOption56<a id="setoption56"></a>|Wi-Fi network scan to select strongest signal on restart (network has to be visible)<BR>`0` = disable *(default)*<BR> `1` = enable
SetOption57<a id="setoption57"></a>|Wi-Fi network re-scan every 44 minutes with alternate to +10dB stronger signal if detected (only visible networks)<BR>`0` = disable *(default)*<BR> `1` = enable
SetOption58<a id="setoption58"></a>|[IR Raw data in JSON payload](https://github.com/arendst/Tasmota/issues/2116#issuecomment-440716483)<BR>`0` = disable *(default)*<BR> `1` = enable
SetOption59<a id="setoption59"></a>|Send `tele/%topic%/STATE` in addition to `stat/%topic%/RESULT` for commands: [`State`](#State), [`Power`](#Power) and any command causing a light to be turned on.<BR>`0` = disable *(default)*<BR> `1` = enable
SetOption60<a id="setoption60"></a>|Set sleep mode<BR> `0` = [dynamic sleep](Dynamic-Sleep) *(default)*<BR> `1` = normal sleep
SetOption61<a id="setoption61"></a>|Force [local operation](https://github.com/arendst/Tasmota/pull/4562#issuecomment-446230001) when [`ButtonTopic`](#ButtonTopic) or [`SwitchTopic`](#SwitchTopic) is set.<BR>`0` = disable *(default)*<BR> `1` = enable
SetOption62<a id="setoption62"></a>|Set retain on Button or Switch hold messages<BR>`0` = disable *(default)*<BR> `1` = don't use retain flag on `HOLD` messages
SetOption63<a id="setoption63"></a>|Set relay state feedback scan at restart ([#5594](https://github.com/arendst/Tasmota/issues/5594), [#5663](https://github.com/arendst/Tasmota/issues/5663))<BR>`0` = Scan power state at restart *(default)*<BR> `1` = Disable power state scanning at restart
SetOption64<a id="setoption64"></a>|Switch between `-` or `_` as sensor name separator<BR>`0` = sensor name index separator is `-` _(hyphen)_ *(default)*<BR> `1` = sensor name index separator is `_` _(underscore)_<br>*Affects DS18X20, DHT, BMP and SHT3X sensor names in tele messages*
SetOption65<a id="setoption65"></a>|Device recovery using [fast power cycle detection](Fast-power-cycle-device-recovery)<BR>`0` = enabled *(default)*<BR>`1` = disabled
SetOption66<a id="setoption66"></a>|Set publishing TuyaReceived to MQTT<BR>`0` = disable publishing `TuyaReceived` over MQTT *(default)*<BR>`1` = enable publishing `TuyaReceived` over MQTT
SetOption67<a id="setoption67"></a>|iFan03 Buzzer control<BR>`0` = disable Sonoff iFan03 buzzer *(default)*<BR>`1` = enable Sonoff iFan03 buzzer 
SetOption68<a id="setoption68"></a>|Multi-channel PWM instead of a single light<BR>`0` = Treat [PWM](#pwm) as a single light *(default)*<BR>`1` = Treat [PWM](#pwm) as separate channels. In this mode, use [`Power<x>`](#power) to turn lights on and off, and [`Channel<x>`](#channel) to change the value of each channel.<BR>[`Color`](#color) still works to set all channels at once.<BR>***Requires restart after change***
SetOption69<a id="setoption69"></a>|**Deprecated** in favor of [DimmerRange](#DimmerRange) <br>By default Tuya dimmers won't dim below 10% because some don't function very well that way.<BR>`0` = disable Tuya dimmer 10% lower limit<BR>`1` = enable Tuya dimmer 10% lower limit *(default)*
SetOption71<a id="setoption71"></a>|Set DDS238 Modbus register for active energy<BR>`0` = set primary register *(default)*<BR>`1` = set alternate register
SetOption72<a id="setoption72"></a>|Set reference used for total energy <BR>`0` = use firmware counter *(default)*<BR>`1` = use energy monitor (e.g., PZEM-0xx, SDM120, SDM630, DDS238, DDSU666) hardware counter
SetOption73<a id="setoption73"></a>|*Deprecated in version 7.1.2.4 in favor of CORS command*<BR>Set HTTP Cross-Origin Resource Sharing (CORS) <BR>`0` = disable CORS *(default)*<BR>`1` = enable CORS
SetOption74<a id="setoption74"></a>|Enable internal pullup for single DS18x20 sensor <BR>`0` = disabled *(default)*<BR>`1` = internal pullup enabled
SetOption75<a id="setoption75"></a>|Set grouptopic behaviour ([#6779](https://github.com/arendst/Tasmota/issues/6779))<BR>`0` = GroupTopic using FullTopic replacing %topic% _(default)_<BR>`1` =  GroupTopic is `cmnd/%grouptopic%/` 
SetOption76<a id="setoption76"></a>|Bootcount incrementing when [DeepSleep](DeepSleep) is enabled ([#6930](https://github.com/arendst/Tasmota/issues/6930))<BR>`0` = disable bootcount incrementing _(default)_<BR>`1` = enable bootcount incrementing 
SetOption77<a id="setoption77"></a>|Do not power off if a slider is moved to far left<BR>`0` = disabled _(default)_<BR>`1` = enabled 
SetOption80<a id="setoption80"></a>|[Blinds and shutters](Blinds-and-Shutters) support<BR>`0` = disable blinds and shutters support *(default)*<BR>`1` = enable blinds and shutters support
SetOption81<a id="setoption81"></a>|Set PCF8574 component behavior for all ports<BR>`0` = set as regular state *(default)*<BR>`1` = set as inverted state
SetOption82<a id="setoption82"></a>|Reduce the CT range from 153..500 to 200.380 to accomodate with Alexa range<BR>`0` = CT ranges from 153 to 500 *(default)*<BR>`1` = CT ranges from 200 to 380 (although you can still set in from 153 to 500)
SetOption83<a id="setoption83"></a>|Uses Zigbee device friendly name instead of 16 bits short addresses as JSON key when reporting values and commands<BR>`0` = JSON key as short address<BR>`1` = JSON key as friendly name<BR>See [`ZbName <device>,<name>`](#zbname)
SetOption84<a id="setoption84"></a>|(Experimental) When using AWS IoT, sends a device shadow update (alternative to retained)<BR>`0` = don't update device shadow (default)<BR>`1` = update device shadow<BR>Note: if the `Topic` contains `'/'` they are replaced with `'_'`
SetOption85<a id="setoption85"></a>|Enable device group support
SetOption86<a id="setoption86"></a>|PWM Dimmer Turn brightness LED's off 5 seconds after last change
SetOption87<a id="setoption87"></a>|PWM Dimmer Turn red LED on when powered off
SetOption88<a id="setoption88"></a>|PWM Dimmer Buttons control remote devices
SetOption89<a id="setoption89"></a>|Use distinct per device MQTT topic for Zigbee `SENSOR` (see `SensorRetain`)<BR>`0` = unique SENSOR topic (default)<BR>Ex: `tele/tasmota/Zigbee_home/SENSOR = {"ZbReceived":{"0x5ADF":{"Dimmer":254,"Endpoint":1,"LinkQuality":72}}}`<BR>`1`= per-device topic<BR>Ex: `tele/tasmota/Zigbee_home/5ADF/SENSOR = {"ZbReceived":{"0x5ADF":{"Dimmer":254,"Endpoint":1,"LinkQuality":70}}}`

### Serial Bridge
Both hardware and software Serial Bridge are supported.
 
Hardware Serial Bridge uses `GPIO1 (Tx)` and `GPIO3 (Rx)` or `GPIO13 (Tx)` and `GPIO15 (Rx)` pins of your device.   
Software Serial Bridge can use any other GPIO to be configured as components `Serial Tx` and `Serial Rx` (or `SerBr Tx` and `SerBr Rx`). If `Tx` and `Rx` components are not assigned in the Template or Module, `GPIO1` and `GPIO3` will be used. Note that changing serial logging ([`SerialLog`](#seriallog) 0) will disable the hardware Serial Bridge.  

Information received by Tasmota over the serial bridge is captured automatically. Before data will be received, a properly formatted [`SerialSend<x>` or `SSerialSend<x>`](#SerialSend) command must be executed. This must be done any time the device restarts (e.g., via a `System#Boot` triggered rule). This command is required in order to set how the expected serial data will be formatted and interpreted (i.e., which &#60;x> option). A `{"SSerialReceived":{"Data":"<string>"}}` message will be posted. You can use [a rule](Rule-Cookbook#switch-relays-via-serial-interface) to process the string which will be contained in `SSerialReceived#Data`.

Expect possible communication errors when additional sensors are configured.  

Command|Parameters
:---|:---
Baudrate<a id="baudrate"></a>|`1` = set hardware serial bridge to default baud rate of 115200 bps<BR>`<value>` = set baud rate. The set rate will be a multiple of 300. The maximum baud rate possible is 19,660,500.
SBaudrate<a id="sbaudrate"></a>|`1` = set software serial bridge to default baud rate of 9600 bps<BR>`<value>` = set baud rate. The set rate will be a multiple of 300. The maximum baud rate possible is 19,660,500.
SerialConfig<a id="serialconfig"></a>|`value` = set serial protocol using [data/parity/stop](https://en.wikipedia.org/wiki/Serial_port#Settings) conventional notation (example: `8N1` or `702`)<BR>`0..23` = set serial protocol (`3` equals `8N1`)
SerialDelimiter<a id="serialdelimiter"></a>|`<value>` = set serial delimiter to [escape character code](https://en.wikipedia.org/wiki/Escape_character#ASCII_escape_character) or ASCII character<BR>`1..127` = set serial delimiter to [decimal ASCII](http://www.asciichart.com/)<BR>`128` = only allow ASCII characters 32 to 127 in response text<BR>`129..255` = disable serial delimiter
SerialSend&#60;x><a id="serialsend"></a>|`<string>`<BR>Disable serial logging and send using hardware serial<BR>x = `1..5`<BR>`1` = send appending `\n` (newline) ()<BR>`2` = send<BR>`3` = replace escape characters and send <BR>`4` = send as binary. Data in serial response messages is encoded as hex strings <BR>`5` = send as hex. Data in serial response messages is encoded as hex strings 
SSerialSend&#60;x><a id="sserialsend"></a>|`<string>`<BR>Send using software serial protocol<BR>x = `1..5`<BR>`1` = send appending `\n` (newline) ()<BR>`2` = send<BR>`3` = replace escape characters and send <BR>`4` = send as binary data. Data in serial response messages is encoded as hex strings<BR>`5` = send as hex. Data in serial response messages is encoded as hex strings 
TuyaSend&#60;x><a id="tuyasend"></a>|Send data to MCU with [TuyaMCU](TuyaMCU)<br>x = `1..4`<br>`TuyaSend1 <dpId>,<boolean>` = send boolean (`0`/`1`) data type to dpId (1 byte max length)<br>`TuyaSend2 <dpId>,<int>` = send integer data to dpId (4 bytes max length)<br>`TuyaSend2 <dpId>,<0xAABBCCDD>` = send 4 byte data to dpId (4 bytes max length)<br>`TuyaSend3 <dpId>,<value>` = send any data type to dpId (unknown max length)<br>`TuyaSend4 <dpId>,<enum>` = send enumerated (`0`/`1`/`2`/`3`/`4`/`5`) data type to dpId (1 byte max length)<br>

### MP3 Player 
» v6.6.0

The MP3 Player driver is based on the one from DFRobot. They named it [DFPlayer mini](https://www.dfrobot.com/wiki/index.php/DFPlayer_Mini_SKU:DFR0299). All MP3 Players with the identical Serial Control Command structure can be used.

Command|Parameters
:---|:---
MP3DAC<a id="MP3DAC"></a>|`0` = DAC on *(default)*<BR>`1` = DAC off
MP3Device<a id="MP3Device"></a>|Specify playback device<BR>`1` = USB<BR>`2` = SD Card *(default (also defaults on reset or power cycle))*
MP3EQ<a id="MP3EQ"></a>|Set equalizer mode:<BR>`0` = normal<BR>`1` = pop<BR>`2` = rock<BR>`3` = jazz<BR>`4` = classic<BR>`5` = bass)
MP3Pause<a id="MP3Pause"></a>|Pause
MP3Play<a id="MP3Play"></a>|Play, works as a normal play on a real MP3 Player, starts at first MP3 file
MP3Reset<a id="MP3Reset"></a>|Reset the MP3 player to defaults
MP3Stop<a id="MP3Stop"></a>|Stop
MP3Track<a id="MP3Track"></a>|`x` = play track <x\>
MP3Volume<a id="MP3Volume"></a>|`0..100` = set Volume

### Domoticz


Command|Parameters
:---|:---
<a id="domoticzidx"></a>DomoticzIdx<x\>|Show Domoticz Relay idx <x\> (x = `1..4`)<BR>`0` = disable use of Relay idx <x\> *(default)*<BR>`<value>` = Show Relay idx <x\>
<a id="domoticzkeyidx"></a>DomoticzKeyIdx<x\>|Show Domoticz Key idx <x\> (x = `1..4`)<BR>`0` = disable use of Key idx <x\> *(default)*<BR>`<value>` = Show Key idx <x\> (to use enable [ButtonTopic](#buttontopic))
<a id="domoticzsensoridx"></a>DomoticzSensorIdx<x\>|Show Domoticz Sensor idx <x\> (x = `1..5`)<BR>`0` = disable use of Sensor idx <x\> *(default)*<BR>`<value>` = Show Sensor idx <x\> 
<a id="domoticzswitchidx"></a>DomoticzSwitchIdx<x\>|Show Domoticz Switch idx <x\> (x = `1..4`)<BR>`0` = disable use of Switch idx <x\> *(default)*<BR>`<value>` = Show Switch idx <x\> (to use enable [SwitchTopic](#switchtopic))
<a id="domoticzupdatetimer"></a>DomoticzUpdateTimer|Show current update timer value in seconds<BR>`0` = disable sending interim Domoticz status *(default)*<BR>`1..3600` = send status to Domoticz in defined intervals

### KNX

Command|Parameters
:---|:---
KnxTx_Cmnd<x\><a id="KnxTx_Cmnd"></a>|`0` or `1` = send command using slot <x\> set in KNX Menu at KNX_TX
KnxTx_Val<x\><a id="KnxTx_Val"></a>|`<value>` = send float value using slot <x\> set in KNX Menu at KNX_TX
KNX_ENABLED<a id="KNX_ENABLED"></a>|Status of KNX Communications<BR>`0` = set to Disable<BR>`1` = set to Enable
KNX_ENHANCED<a id="KNX_ENHANCED"></a>|Status of Enhanced mode for KNX Communications<BR>`0` = set to Disable<BR>`1` = set to Enable
KNX_PA<a id="KNX_PA"></a>|KNX Physical Address<BR>`0.0.0` = address not set<BR>`x.x.x` = set the device address (example `1.1.0`)
KNX_GA<a id="KNX_GA"></a>|Return the amount of Group Address to Send Data/Commands configured
KNX_GA<x\><a id="KNX_GAx"></a>|Setup Group Address to Send Data/Commands (<x\> = KNX Group Address number)<BR>`1` = return configuration of GA<x\><BR>`<option>, <area>, <line>, <member>` to set configuration of GA<x\><BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`<option>` = [see table below for OPTION list](#knxJSON)<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`<area>, <line>, <member>` = KNX Address to Send Data/Commands<BR>
KNX_CB<a id="KNX_CB"></a>|Return the amount of Group Address to Receive Data/Commands configured
KNX_CB<x\><a id="KNX_CBx"></a>|Setup Group Address to Receive Data/Commands <BR>`1` = return configuration of CB<x\><BR>`<option>, <area>, <line>, <member>` to set configuration of CB<x\><BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`<option>` = [see table below for OPTION list](#knxJSON)<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`<area>, <line>, <member>` = KNX Address to Receive Data/Commands

<a id="knxjson"></a><BR>OPTION|OPTION<BR>Value|<BR>OPTION|OPTION<BR>Value
:---|---|:---|---
1|Relay 1|17|TEMPERATURE
2|Relay 2|18|HUMIDITY
3|Relay 3|19|ENERGY_VOLTAGE
4|Relay 4|20|ENERGY_CURRENT
5|Relay 5|21|ENERGY_POWER
6|Relay 6|22|ENERGY_POWERFACTOR
7|Relay 7|23|ENERGY_DAILY
8|Relay 8|24|ENERGY_START
9|Button 1|25|ENERGY_TOTAL
10|Button 2|26|KNX_SLOT1
11|Button 3|27|KNX_SLOT2
12|Button 4|28|KNX_SLOT3
13|Button 5|29|KNX_SLOT4
14|Button 6|30|KNX_SLOT5
15|Button 7|255|EMPTY
16|Button 8|

### Displays
» v6.3.0

Command|Parameters
:--- |:---
Display<a id="display"></a>|Show current display setting as a JSON payload
DisplayAddress<a id="displayaddress"></a>|`0..255` Set display module address
DisplayDimmer<a id="displaydimmer"></a>|`0` Turn the display off<BR> `1..100` Turn the display on<BR>`0..100` Set display luminosity *(only on 8x8 Dot-Matrix displays)*
DisplayMode<a id="displaymode"></a>|`0..5` Set to display [predefined content](Displays#displaymode-parameters) according to display type
DisplayModel<a id="displaymodel"></a>|Set display model:<BR>`1` = [I<sup>2</sup>C LCD Display](https://learn.adafruit.com/i2c-spi-lcd-backpack) (default addresses `0x27`, `0x3F`)<BR>`2` = [SSD1306](https://learn.adafruit.com/monochrome-oled-breakouts/arduino-library-and-examples) OLED 128x32/128x64 (default I<sup>2</sup>C addresses `0x3C`, `0x3D`)<BR>`3` = [HT16K33](https://www.adafruit.com/product/1427) 8x8 Dot-Matrix<BR>`4` = [ILI9341](https://www.adafruit.com/product/1770) TFT LCD<BR>`5` = [2.9 inch E-Paper Display](https://www.waveshare.com/wiki/2.9inch_e-Paper_Module) 296x128 (software 3-wire SPI)<BR>`6` = [4.2 inch E-Paper Display](https://www.waveshare.com/wiki/4.2inch_e-Paper_Module) 400x300 (software 3-wire SPI)<BR>`7` = [SH1106](https://www.ebay.com/itm/1-3-SH1106-I2C-IIC-128X64-OLED-LCD-LED-Display-Module-Board-For-Arduino-BLUE/391701761596) OLED 128x64 (default I<sup>2</sup>C address `0x3c`)<BR>`8` = [ILI9488](https://www.buydisplay.com/default/lcd-3-5-inch-320x480-tft-display-module-optl-touch-screen-w-breakout-board) TFT 480x320 (capacitive touch, hardware 3-wire SPI)<BR>`9` = [SSD1351](https://www.ebay.com/itm/3-3V-5V-General-1-5inch-RGB-OLED-Display-Module-128x128-SSD1351-SPI-Interface/253655550921) color OLED 128x128 (hardware 3-wire SPI)<BR>`10` = [RA8867](https://www.buydisplay.com/default/spi-7-inch-tft-lcd-dislay-module-1024x600-ra8876-optl-touch-screen-panel) TFT LCD 1024x600 (capacitive touch, hardware 4-wire SPI)
DisplayRefresh<a id="displayrefresh"></a>|`1..7` Set time in seconds to update predefined content when using `DisplayMode` &ne; `0`
DisplaySize<a id="displaysize"></a>|`1..4` Set display scale-up size *(SSD1306  and ILI9341 only)*
DisplayRotate<a id="displayrotate"></a>|Set rotation angle<BR> `0` = 0°<BR> `1` = 90°<BR> `2` = 180°<BR> `3` = 270°
DisplayText<a id="displaytext"></a>|`<value>` - See [DisplayText use](Displays#displaytext-use)
DisplayCols<a id="displaycols"></a>|`1..44` Set number of display columns *(for display modes>0)*
DisplayRows <a id="displayrows"></a>|`1..32` Set number of display rows *(for display modes>0)*
DisplayFont<a id="displayfont"></a>|Specify the current font<BR>`0` use classic GFX font<BR>`1` = 12<BR>`2` = 24<BR>`3` = 8 (opt)<BR>`7` use RA8876 internal font 
DisplayWidth<a id="displaywidth"></a>|Specify the display width in pixels *(SSD1306 only)*
DisplayHeight<a id="displayheight"></a>|Specify the display height in pixels *(SSD1306 only)*

### Stepper Motors 


<a id="tb-stepperMotors">Command|Parameters
:---|:---
MotorMIS<a id="motormis"></a>|`1,2,4,8,16` Set micro stepping increment - 1/1 (full steps) to 1/16 *(default = `1`)*
MotorSPR<a id="motorspr"></a>|`integer` Set the number of steps the given motor needs for one revolution *(default = `200`)*<BR>This is dependent on the type of motor and micro stepping. Most common motors are 1.8° per step.
MotorRPM<a id="motorrpm"></a>|`1..300` Set revolutions per minute *(default = `30`)*
MotorMove<a id="motormove"></a>|`integer` Move the motor the given number of steps (positive values: clockwise, negative values: counterclockwise)
MotorRotate<a id="motorrotate"></a>|`integer` Rotate the motor the given number of degrees (positive values: clockwise, negative values: counterclockwise)
MotorTurn<a id="motorturn"></a>|`float` Spin the motor the given number of turns (positive values: clockwise, negative values: counterclockwise)

### Blinds, Shutters and Roller Shades


Command<BR> (x = `1..4`)|Parameters
:---|:---
ShutterButton&#60;x><a id="shutterbutton"></a>|`<button> <func> <mqtt>`<BR><BR>Assign a button to control the shutter. For more details please refer to [Blinds and Shutters](Blinds-and-Shutters) support<BR><BR>`<button>`<BR>&emsp;`0`: disable buttons for this shutter<BR>&emsp;`1..4`: Button number<BR>`<func>` `up`/`down`/`updown`: function to assign to the button<BR>`<mqtt>` `1`/`0`: enable/disable MQTT publish for button hold action<BR><BR>For example:<li>To control shutter #1 by two buttons: `Backlog ShutterButton1 1 up 1; ShutterButton1 2 down 1` assigns button #1 to act as an "up" button and button #2 to act as an "down" button for shutter #1 including MQTT publish.</li><li>To control shutter #1 by a single button: `ShutterButton1 1 updown 0` assigns button #1 to act as an "up and down" button.</li>
ShutterCalibration&#60;x><a id="shuttercalibration"></a>|Granular shutter position calibration. The measured opening position of the shutter at the 30, 50, 70, 90, and 100 percent opened locations. For example: `ShutterCalibration<x> 23 38 56 74 82`
ShutterCloseDuration&#60;x><a id="shuttercloseduration"></a>| `1..255` *(default = `10`)*<BR>time, in seconds, it takes to fully close the shutter. A fraction of a second can be specified (e.g. `45.7`).
ShutterClose&#60;x><a id="shutterclose"></a>|Engage the relay to close the shutter. This action can be requested at any time. Number of shutter can be the index or the arguement
ShutterFrequency&#60;x><a id="shutterfrequency"></a>|`0..10,000`Hz *(default = `1000`)*<BR>the maximum frequency at which the stepper motor can operate reliably. Typically this is up to 2,000Hz with a 12V power supply and up to 5,000Hz with a 24V power supply.
ShutterEnableEndStopTime&#60;x><a id="shutterenableendstoptime"></a>|`0` = no additional shutter end stop time *(default)*<BR>`1` = 1 s additional shutter end stop time
ShutterInvert&#60;x><a id="shutterinvert"></a>|`0` = use default shutter positioning (`0` = Closed, `100` = Open)<BR>`1` = invert shutter positioning (`100` = Closed, `0` = Open) (e.g., if used with KNX)
ShutterInvertWebButtons&#60;x><a id="shutterinvertwebbuttons"></a>|`0` = use default button icons (▲ for open, ▼ for close)<BR>`1` = invert button icons (▼ for open, ▲ for close) (e.g., if used with horizontal awning: where open means rolling-down fabric material and close rolling-up in a protect position)
ShutterLock&#60;x><a id="shutterlock"></a>|`0` = unlock shutter positioning *(default)*<BR>`1` = lock shutter positioning
ShutterMotorDelay&#60;x><a id="shuttermotordelay"></a>|`0.00 .. 12.75` *(default = `0`)*<BR>time, in seconds, it takes the motor to start moving once power is turned on; i.e., motor lag time.<BR><BR>When used with stepper motors, this setting defines the  ramp up/down speed (i.e., acceleration/deceleration) before the motor reaches its target speed for gradual starting and stopping.
ShutterOpenDuration&#60;x><a id="shutteropenduration"></a>|`1..255` *(default = `10`)*<BR>time, in seconds, it takes to fully open the shutter. A fraction of a second can be specified (e.g. `45.7`).
ShutterOpen&#60;x><a id="shutteropen"></a>|Engage the relay to open the shutter. This action can be requested at any time. Number of shutter can be index or the arguement
ShutterPosition&#60;x><a id="shutterposition"></a>|`0..100`, `UP`, `DOWN`, `STOP`<BR>A shutter position change can be requested at any time. The shutter will stop and revert or update to the requested position. The shutter's actual position will be saved _**after**_ the movement is completed. In this case, the position will be restored during reboot. An interruption during shutter movement (e.g., a device restart) will lose the current position.
ShutterRelay&#60;x><a id="shutterrelay"></a>|`<value>`<BR>`0` = disable this and all higher numbered shutters<BR>`1,3,5,7,...` (must be an odd number) = `Relay<value>` component used to open the shutter. This relay's mate, the next higher numbered relay, closes the shutter. Depending on the shutter mode, the relays may need to be interlocked using the [`Interlock`](Commands#interlock) command.<BR>**The `ShutterRelay` command must be executed first before any other shutter commands for `Shutter<x>` can be executed.**
ShutterSetClose&#60;x><a id="shuttersetclose"></a>|shutter closed position. `ShutterPosition` will be reset to fully closed value (e.g., `0` when `ShutterInvert = 0`, `100` otherwise).
ShutterSetHalfway&#60;x><a id="shuttersethalfway"></a>| `0..100` *(default = `50`)*<BR>Define shutter half open position (in percent)
ShutterStop&#60;x><a id="shutterstop"></a>|Disengage the relays to stop the shutter. Number of shutter can be the index or the arguement
See also| [`SetOption80`](#setoption80) - Enable shutter support

### Zigbee

See the [Complete Zigbee guide](Zigbee)

Command|Parameters
:---|:---
||Options to specify a Zigbee device: `<device>`:<BR>&emsp;`<shortaddr>`  the short address of the Zigbee device on the network, ex: `0x1234`<BR>&emsp;`<longaddr>` the permanent IEEE address of the Zigbee device (64 bits), ex: `0x00158D00041160C5`<BR>&emsp;`<index>` the number of the device in the internal list (starts at 1), ideal for enumerating devices, ex: `1`<BR>&emsp;`<name>` friednly name set with `ZbName`, ex: `Room_Light`
ZbBind<a id="zbping"></a>|Binds one Zigbee device to another device or to a groups. This allows one device to directly send commands, like a remote to a bulb, without any action on the coordinator.<BR>`{"Device":"<device>", "Endpoint":<endpoint>, "Cluster":<cluster>, "ToDevice":"<to_device>", "ToEndpoint":<to_endpoint>, "ToGroup":<to_group> }`<BR>&emsp;`<device>` = the device sending the messages (mandatory)<BR>&emsp;`<endpoint>` = the source endpoint (mandatory)<BR>&emsp;`<cluster>` = the source cluster id (mandatory)<BR>&emsp;`<to_device>` = the target device (optional)<BR>&emsp;`<to_endpoint>` = the target endpoint (optional if it can be inferred from `ZbStatus3`)<BR>&emsp;`<to_group>` = the target group id (optional)<BR><BR>Note1: you must specify either `"ToDevice"` or `"ToGroup"` but not both<BR>Note2: Z2T must know the IEEE address of the target device, see `ZbStatus2` to verify, and `ZbProbe` to have Z2T query the address
ZbForget<a id="zbforget"></a>|Removes a device from the Tasmota flash memory. To be used for devices that are no more used and are still visible in `ZbStatus`<BR>&emsp;`<device>`
ZbName<a id="zbname"></a>|Sets or reads the Zigbee device friendly name (up to 32 characters).<BR>&emsp;`<device>,<name>` sets the new friendly name<BR>&emsp;`<device>,` (empty name) clears the friendly name<BR>&emsp;`<device>` displays the current friendly name<BR>See [`SetOption83 1`](#setoption83) to enable friendly names as JSON keys instead of short addresses
ZbPermitJoin<a id="zbpermitjoin"></a>|Sets new device pairing mode<BR>`0` = disable pairing<BR>`1` = enable pairing for 60 seconds<BR>`99` = enable pairing until device reboot<BR><ul>:warning: Leaving your Zigbee network pairing open to join will allow any Zigbee device to connect and retrieve your network encryption key. This can lead to a compromise of your Zigbee network.</ul>
ZbPing<a id="zbping"></a>|Test the availability of a Zigbee device. If the device is connected and not sleeping, you should receive a `ZbPing` message within the next second.<BR>&emsp;`<device>`<BR>Ex: `ZbPing 0x5ADF`<BR>`{"ZbPing":{"Device":"0x5ADF","IEEEAddr":"0x90FD9FFFFE03B051"}}`
ZbSend<a id="zbsend"></a>|`{ "Device":"<shortaddr>", "Endpoint":"<endpoint>", "Send":{"<sendcmd>":<sendparam>} }`<BR>&emsp;`<shortaddr>` the short address of the Zigbee device on the network.<BR>&emsp;`<endpoint>` the target endpoint on the device ([understandig endpoints](Zigbee#understanding-endpoints))<BR>&emsp;`"<sendcmd>":<sendparam>` the command and parameters to send ([Zigbee Device Commands](Zigbee#supported-zigbee-device-commands))<BR>Note: Use [`ZbZNPSend`](#ZbZNPSend) to send a raw form low-level message<BR><BR>Ex: `ZigbeeSend { "Device":"0x1234", "Endpoint":"0x03", "Send":{"Power":"on"} }`
ZbStatus&#60;x><a id="zigbeestatus"></a>|Display Zigbee devices seen on the network since boot<BR>`<device>` (optional)<BR>` ` = all devices<BR>This command provides three levels of increasing detail according to `<x>`<BR>`ZbStatus1` Display Short Address, and Friendly Name<BR>`ZbStatus2` Also include Manufacturer ID and Model ID<BR>`ZbStatus3` Also include a list of endpoints and the clusterIds supported by each endpoint<BR>Ex: `ZbStatus3 1` requests all details for device number 1<BR><BR>The information requested may exceed the maximum result size allowed by Tasmota. In this case, the output will be truncated. To get all of the desired information, request results for a specific device individually.

Zigbee debug functions.
:warning: :warning: :warning: **Do not use unless you know exactly what you are doing.** :warning: :warning: :warning:

Command|Parameters
:---|:---
ZbModelId<a id="zbmodelid"></a>|Manually force the `ModelId` field of a Zigbee device. This is used to simulate devicesnot physically present on the network, for debugging only.<BR>&emsp;`<device>,<modelid>` sets the new ModelId<BR>&emsp;`<device>,` (empty modelid) clears the ModelId<BR>&emsp;`<device>` displays the current ModelId, also displayed in `ZbStatus2`
ZbProbe<a id="zbprobe"></a>|Probe a Zigbee device to get additional information including its IEEEaddress, vendor and model names, endpoints, and supported clusters per endpoint.<BR>`<device>`<BR>A device probe is performed automatically when a new Zigbee device connects.<BR>Battery powered Zigbee devices can generally not be probed because they are in sleep mode most of the time.
ZbRead<a id="zbread"></a>|Read Zigbee device attributes<BR>`{ "Device":"<shortaddr>", "Endpoint":"<endpoint>", "Cluster":"<cluster>", "Read":[<attrlist>] }`<BR>&emsp;`<shortaddr>` the short address of the Zigbee device on the network.<BR>&emsp;`<endpoint>` the target endpoint on the device ([understandig endpoints](Zigbee#understanding-endpoints))<BR>&emsp;`<cluster>` the cluster number of the attributes<BR>&emsp;`<attrlist>` requested attributes array<BR><BR>Ex: `ZbRead { "device":"0x69CF", "endpoint":"0x03", "cluster":"0x0006", "read":["0x0000"] }`
ZbReset<a id="zbreset"></a>|`1` = perform a factory reset and reconfiguration of the CC2530 chip.<BR>**You will need to re-pair all Zigbee devices**
ZbSave<a id="zbsave"></a>|Forces saving the Zigbee device information to Flash. Auto-saving happens 10 seconds after a new Device parameter was changed, this command is normally not useful
ZbZNPSend<a id="zbznpsend"></a>|Send a raw ZCL message to a Zigbee device. This is a low-level command, and requires to manually build the ZCL parameters. Most common usage will be provided as high-level functions.
ZbZNPReceive<a id="zbznpreceive"></a>|Simulates a received message<BR>&emsp;`<hex>` = hex string of the simulated message, same format as `ZbZNPReceived` debug logs
