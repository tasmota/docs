
description: Comprehensive list of Tasmota commands and how to use them

!!! info "Tasmota provides a powerful control interface using commands"
Commands can be issued using **MQTT**, **web requests**, **webUI console** and **serial**

## How to use commands
Every command **used without a parameter (payload) returns the current setting**.

> `Power` returns the status of first defined power output (usually Relay1)

Instead of `0` you can use `off` or `false` and instead of `1` you can use `on` or `true`.

> `Power ON` turns first defined power output (usually Relay1) on

> `Power1 1` also turns first defined power output (usually Relay1) on
dela
> `Power1 True` also turns first defined power output (usually Relay1) on

Replace `<x>` in a command with the appropriate index number. Leave it empty to use the first available.

> `Power1` and `Power` both control first defined power output (usually Relay1)

In commands with `x..y` value parameters use a number from `x` to `y` range.

When a command mentions resetting to *"firmware default"* it means the setting will revert to the one in the flashed binary file. If you used `user_config_override.h` at compile time it will revert to those.

!!! note
    Beside results initiated by a command (synchronous) you can get asynchronous results initiated by rule trigger, telemetry event, commands from other source or changed device values.
    Simply put, other messages may precede messages published as a result of your commands.

!!! example
    A `tele/%topic%/STATUS` message (sent every 300 seconds by default) may appear exactly after you issue `Power off` command and before you receive `stat/%topic%/RESULT = {"POWER":"OFF"}` message.


### with MQTT

To send commands and view responses you'll need an [MQTT client](http://www.hivemq.com/blog/seven-best-mqtt-client-tools).

Commands over MQTT are issued by using topic `cmnd/%topic%/<command>` and payload `<parameter>` where `%topic%` is the topic of the device you're sending the command to. If there is no `<parameter>` (an empty MQTT message/payload), a query is sent for current status of the `<command>`.

See [MQTT](MQTT) article to find out more.

### with Web Requests

Commands can be executed via web (HTTP) requests, for example:
```
http://<ip>/cm?cmnd=Power%20TOGGLE
http://<ip>/cm?cmnd=Power%20On
http://<ip>/cm?cmnd=Power%20off
http://<ip>/cm?user=admin&password=joker&cmnd=Power%20Toggle
```
!!! warning "Any spaces or special characters must be replaced with their [ASCII hex codes](https://www.rapidtables.com/code/text/ascii-table.html)."
    You must precede each hex code with `%`.
    Most used codes are: `space` = `%20` and `;` = `%3B`.

!!! tip
    Use [URLencoder.org](https://www.urlencoder.org/) to easily convert your commands.

If you have set a password for web user interface access, this must be included (in plaintext) in the URL of the HTTP request, like so:
```
http://<ip>/cm?user=<username>&password=<password>&cmnd=Power%20On
```
### in Console in the Web UI

**Console** menu in the web UI is a convenient place to send commands and it behaves similar to a terminal connection via serial bridge.

!!! warning
    The GUI controls **do not** and **can not** have all the features and commands implemented. For precise and complete control use Console commands!

### over Serial Bridge

If you flashed the device via serial method you can connect to it with a terminal application (e.g. [Termite](https://www.compuphase.com/software_termite.htm) or Arduino IDE Serial Monitor) to issue commands and follow responses. This is a practical way to do a `Backlog` setup of your new device.

!!! bug "Serial interface is set to 115200 bps except for devices that require a different baudrate"

### the Power of Backlog

`Backlog` command allows executing up to 30 consecutive commands with a single command line. Each command is separated by a semicolon (";"). `Backlog` is a useful feature to avoid numerous restarts when setting up a new device. You can use it to:

Set up both Wi-Fi AP's
```haskell
Backlog SSID1 <myssid>; Password1 <mypassword>; SSID2 <myssid2>; Password2 <mypassword2>
```
Configure MQTT broker address, MQTT credentials, device topic and activate a few custom options
```haskell
Backlog MqttHost <yourhost>; MqttUser <user>; MqttPassword <password>; Topic <customtopic>; SetOption53 1; PowerRetain on
```
For specific power control, using backlog like a script
```haskell
Backlog Status 1; Power2 on; Delay 20; Power2 off; Status 4
```
When using [web requests](#with-web-requests) *(Don't forget to encode "space" as '%20' and ";" as '%3B')*
```
http://<ip>/cm?user=admin&password=joker&cmnd=Backlog%20Power%20Toggle%3BPower1%20off
```

A `Backlog` command without an argument clears an possible existing `Backlog` queue.

!!! example
    in case of command _`Backlog Power1 OFF; Delay 600; Power1 ON`_ the usage of an additional `Backlog` command without any argument within the delay time of 1 minute will delete the whole queue _`Power1 OFF; Delay 600; Power1 ON`_. Therefore `Power1 ON` command will not be executed and the power would remain off.

## Commands List

!!! warning
    If you're using Tasmota versions earlier current release some of the commands might not work.
    Availability of some features and their associated commands depend on the firmware build. Please consult the [builds](Firmware-Builds) table for a reference of which features are available for each firmware variant.

!!! note
    Almost all settings using string parameters (except `Rule` and `MqttFingerprint`) share a common area with max 698 chars, i.e. the total length of all these parameters is limited to this size (you will be noted if this limit is exceeded).

### Control

Command|Parameters
:---|:---
Backlog<a class="cmnd" id="backlog"></a>|List of commands to be executed in sequence separated by  `;`<BR> See [Using Backlog](#the-power-of-backlog) for examples.<a class="cmnd" id="blinkcount"></a>
Backlog0<a class="cmnd" id="backlog0"></a>|List of commands to be executed without any delay in sequence separated by  `;`<BR> See [Using Backlog](#the-power-of-backlog) for examples.
BlinkCount<a class="cmnd" id="blinkcount"></a>|Number of relay toggles ([blinks](#power)) _(does not control the status LED)_<BR> `0` = blink many times before restoring power state <BR> `1..32000` = set number of blinks *(default = `10`)*
BlinkTime<a class="cmnd" id="blinktime"></a>|`2..3600` set duration, in 0.1 second increments, to [blink](#power) aka toggle Power _(does not control the status LED)_
ButtonDebounce<a class="cmnd" id="buttondebounce"></a>|User control over button debounce timing <BR>`40..1000` = set button debounce time in milliseconds *(default = `50`)*
Buzzer<a class="cmnd" id="buzzer"></a>|`0` = stop active buzzer cycle<BR>`<count>,<beep>,<silence>,<tune>` = [read more...](Buzzer)<BR>`2,3` = Beep twice with 300 milliseconds duration and 100 milliseconds pause<BR>`2,3,4` = Beep twice with 300 milliseconds duration and 400 milliseconds pause<BR>`1,2,3,0xF54` (0000 0000 0000 0000 0000 1111 0101 0100). Each `1` bit beeps for 200 milliseconds and each bounded `0` bit pauses for 300 milliseconds<BR>`-1` = infinite mode<BR>`-2` = follow LED mode
BuzzerActive<a class="cmnd" id="buzzeractive"></a><BR>SetOption67<a class="cmnd" id="setoption67"></a>|iFan03 Buzzer control<BR>`0` = disable Sonoff iFan03 buzzer *(default)*<BR>`1` = enable Sonoff iFan03 buzzer
BuzzerPwm<a class="cmnd" id="buzzerpwm"></a><BR>SetOption111<a class="cmnd" id="setoption111"></a>|`0` = _(default)_<BR>`1` = use frequency output for buzzer pin instead of on/off signal, for piezo buzzers
DevGroupName<x\><a class="cmnd" id="devgroupname"></a>|`0` = clear device group <x\> name and restart<br>`<value>` = set device group <x\> name and restart.<br>If a device group name is not set for a group, the MQTT group topic (`GroupTopic`) is used (with the device group number appended for device group numbers > 1).
DevGroupSend<x\><a class="cmnd" id="devgroupsend"></a>|`<item> = <value>[ ...]` = send an update to device group <x\>. The device group name must have been previously set with DevGroupName<x\>. Multiple item/value pairs can be specified separated by a space. Spaces in `<value>` must be escaped with a backslash (\\). The message sent is also processed on the local device as if it had been received from the network.<br><br>For items with numeric values, `<value>` can be specified as @<operator\>[<operand\>] to send a value after performing an operation on the current value. <operator\> can be + (add), - (subtract), ^ (invert), & (bitwise AND) or \| (bitwise OR). If <operand\> is not specified, it defaults to 0xffffffff for the invert operator and 1 for other operators.<br><br>To indicate that an item should not be shared with the group until changed again, prefix the value with N.<br><br>`3` = Light fade (0 = Off, 1 = On)<br>`4` = Light speed (1..40)<br>`5` = Light brightness (0..255)<br>`6` = Light [`Scheme`](Commands.md#scheme)<br>`7` = Light fixed color (0 = white (using CT channels), other values according to [`Color`](Commands.md#color)</a>)<br>`8` = PWM dimmer low preset (0..255)<br>`9` = PWM dimmer high preset (0..255)<br>`10` = PWM dimmer power-on brightness (0..255)<br>`128` = Relay Power - bitmask with bits set for relays to be powered on. The number of relays can be specified in bits 24 - 31. If the number of relays is not specified, only relay 1 is set<br>`129` = No Status Share - DevGroupShare bitmask indicating which items should not be shared until changed.<br>`192` = Event - event name and arguments<br>`193` = Command - command and arguments<br>`224` = Light channels - comma separated list of brightness levels (0..255) for channels 1 - 5 (e.g. 255,128,0,0,0  will turn the red channel on at 100% and the green channel on at 50% on an RBG light) or hex color value (#RRGGBB, #RRGGBBWW, etc.)<br><br>Examples:<br>`DevGroupSend 5=90 128=1` - send an update to set the light brightness to 90 and turn relay 1 on.<br>`DevGroupSend 193=Buzzer\ 2,3` - send the Buzzer 2,3 command.<br>`DevGroupSend 6=@+ 5=@-10` - set the next fixed color and decrease the brightness by 10.<br>`DevGroupSend 128=^` - toggle all the relays.<br>`DevGroupSend 224=NFF0000` - set the color to red locally and inform the group that light channel information is not to be shared until changed.<br>`DevGroupSend 129=@\|18` - do not share light brightness or channel status until changed.
DevGroupShare<a class="cmnd" id="devgroupshare"></a>|`<in>,<out>` = set incoming and outgoing shared items _(default = `0xffffffff,0xffffffff`)_<BR> <in\> and <out\> are bit masks where each mask is the sum of the values for the categories (listed below) to be shared. For example, to receive only power (1), light brightness (2) and light color (16) and send only power (1), enter the command DevGroupShare 19,1.<br><br>`1` = Power<br>`2` = Light brightness<br>`4` = Light fade/speed<br>`8` = Light scheme<br>`16` = Light color<br>`32` = Dimmer settings (presets)<br>`64` = Event
DevGroupStatus<x\><a class="cmnd" id="devgroupstatus"></a>|Show the status of device group <x\> including a list of the currently known members.
DevGroupTie<x\><a class="cmnd" id="devgrouptie"></a>|`<relay>` = Tie the relay to the device group <x\>. Only applies when option 88 is enabled.
FanSpeed|Fan speed control *(iFan02/iFan03 only)*<BR>`0` = turn fan OFF<BR>`1..3` = set fan speed<BR>`+` = increase fan speed <BR>`-` = decrease fan speed
Interlock<a class="cmnd" id="interlock"></a>|Relay interlock mode and group selection.<BR>`0` = disable relay interlock for all relays (i.e., each relay is self-locking) *(default)*<BR> `1` = set interlock mode for selected relays<br>Add up to 8 relays in 1 to 4 interlock groups, each separated by a space. For example<BR> `1,2 3,4` = Group Relay1 and Relay2 in group 1 and Relay3 and Relay4 in group 2 (_note the space between the two groups_) <BR> `1,2,3` = group Relay1, Relay2 and Relay3 in a single interlock group <BR>`1 3 2,4` = Relay1 is in group 1, Relay3 in group 2, Relay2 and Relay4 in group 3
LedMask<a class="cmnd" id="ledmask"></a>|Set a  [bitmask](https://en.wikipedia.org/wiki/Mask_(computing)#Masking_bits_to_1) specifiying which relays control the LED indicator. [Read more...](LedMask) <br>`<bitmask>` = [bitwise](https://whatis.techtarget.com/definition/bitwise) value representing each relay. Values may be entered as either hexadecimal or decimal values (e.g., 0xFFFF = 65535).<BR>`0xFFFF` (= 1111 1111 1111 1111) All relays control the power LED _(default)_<BR>*[LedState](#ledstate) must be enabled (i.e., `!= 0`) in order for `LedMask` to take effect.*
LedPower<a class="cmnd" id="ledpower"></a>|LED power state as on or off <BR> `0` = turn LED OFF and set `LedState 0` <BR> `1` = turn LED ON and set `LedState 8` <BR> `2` = toggle LED and set `LedState 0` <BR>(Use `Backlog LedPower 0; SetOption31 1` to disable LED even when Wi-Fi or MQTT is not connected)
LedPower<x\>|LED<x\> power state control. **Enabled only when LedLink(i) is configured**<BR>`0` = turn LED OFF and set `LedState 0` <BR> `1` = turn LED ON and set `LedState 0` <BR> `2` = toggle LED and set `LedState 0`
LedState<a class="cmnd" id="ledstate"></a>|Manage LED state<BR> `0` = disable use of LED as much as possible <BR> `1` = show power state on LED (LED on when power on) *(default)* *(inverted for Sonoff Touch/T1)*<BR> `2` = show MQTT subscriptions as a LED blink<BR> `3` = show power state and MQTT subscriptions as a LED blink<BR> `4` = show MQTT publications as a LED blink<BR> `5` = show power state and MQTT publications as a LED blink<BR> `6` = show all MQTT messages as a LED blink<BR> `7` = show power state and MQTT messages as a LED blink<BR>`8` = LED on when Wi-Fi and MQTT are connected.<BR>_*Cannot* be issued directly and is only activated when `LedPower` is switched from `0` to `1` due to a software function_
NoDelay<a class="cmnd" id="nodelay"></a>|Delay defined by `SetOption34` is omitted for any command in a backlog sequence following immediately after `NoDelay`<BR>_This must be used with care, and only for simple commands._ [Example](https://github.com/arendst/Tasmota/pull/9544)
Power0<a class="cmnd" id="power0"></a>|Control the power state simultaneously for all power outputs on the device<BR> `0` / `off` = turn OFF <BR> `1` / `on` = turn ON <BR> `2` / `toggle` = if relay is `ON` switch to `OFF` and vice versa
Power<x\><a class="cmnd" id="power"></a>|Control the corresponding power state (`1..8`) (also restarts PulseTime)<x\><BR> `0` / `off` / `false` = turn OFF <BR> `1` / `on` / `true` = turn ON <BR> `2` / `toggle` = if power state is `ON` switch to `OFF` and vice versa<BR> `3` / `blink` = toggle power for [BlinkCount](#blinkcount) times each [BlinkTime](#blinktime) duration (at the end of `blink`, power state is returned to pre-blink state)<BR> `4` / `blinkoff` = stop blink sequence and return power state to pre-blink state
PowerOnState<a class="cmnd" id="poweronstate"></a>|Control power state when the device is _**powered up**_. [More information](PowerOnState)<BR> `0` / `OFF` = keep power(s) OFF after power up <BR> `1` / `ON` = turn power(s) ON after power up <BR> `2` / `TOGGLE` = toggle power(s) from last saved state <BR> `3` = switch power(s) to their last saved state *(default)* <BR> `4` = turn power(s) ON and disable further power control <BR> `5` = after a `PulseTime` period turn power(s) ON (acts as inverted [`PulseTime`](Commands.md#pulsetime) mode)
PulseTime<x\><a class="cmnd" id="pulsetime"></a>|Display the amount of `PulseTime` remaining on the corresponding Relay<x\><BR>`<value>` Set the duration to keep Relay<x\> `ON` when `Power<x> ON` command is issued. After this amount of time, the power will be turned `OFF`.<BR>`0` / `OFF` = disable use of PulseTime for Relay<x\><BR>`1..111` = set PulseTime for Relay<x\> in 0.1 second increments<BR>`112..64900` = set PulseTime for Relay<x\>, offset by 100, in 1 second increments. Add 100 to desired interval in seconds, e.g., `PulseTime 113` = 13 seconds and `PulseTime 460` = 6 minutes (i.e., 360 seconds)<BR>Note if you have more than 8 relays:<BR>Defined PulseTime for relays <1-8> will also be active for correspondent Relay <9-16>.<BR>
SwitchDebounce<a class="cmnd" id="switchdebounce"></a>|User control over switch debounce timing and method<BR>`40..1000` = set switch debounce time in milliseconds *(default = `50`)*. The granularity is 10 milliseconds, so the normally unnecessary last digit is used by the debouncing code to flag special handling: <BR> `0` = no special handling <BR> `1` = force_high: only a debounce time long LOW pulse could turn the switch off <BR> `2` = force_low: only a debounce time long HIGH pulse could turn the switch on <BR> `3` = force_high + force_low <BR> `4..8` = unused <BR> `9` = [AC detection](https://tasmota.github.io/docs/Buttons-and-Switches/#ac-frequency-detection-switch) for switches / relays similar to MOES MS-104B / BlitzWolf SS5 etc. If the AC frequency is 50 Hz, `SwitchDebounce 69` will turn on the switch after three pulses and off after three missing one.
SwitchMode<x\><a class="cmnd" id="switchmode"></a>|[Switch mode](Buttons-and-Switches#switchmode) <BR> `0` = toggle *(default)* <BR> `1` = follow (0 = off, 1 = on) <BR> `2` = inverted follow (0 = on, 1 = off) <BR> `3` = pushbutton (default 1, 0 = toggle) <BR> `4` = inverted pushbutton (default 0, 1 = toggle) <BR> `5` = pushbutton with hold (default 1, 0 = toggle, Hold = hold) <BR> `6` = inverted pushbutton with hold (default 0, 1 = toggle, hold = hold) <BR> `7` = pushbutton toggle (0 = toggle, 1 = toggle)<BR> `8` = multi change toggle (0 = toggle, 1 = toggle, 2x change = hold)<BR> `9` = multi change follow (0 = off, 1 = on, 2x change = hold)<BR> `10` = inverted multi change follow (0 = on, 1 = off, 2x change = hold)<BR> `11` = pushbutton with dimmer mode <BR> `12` = inverted pushbutton with dimmer mode <BR> `13` = pushon mode (1 = on, switch off using `PulseTime`)<BR> `14` = inverted pushon mode (0 = on, switch off using `PulseTime`)<BR> `15` = send only MQTT message on switch change (Example tele/tasmota/SENSOR = `{"Time":"2021-01-01T00:00:00","Switch1":"OFF"}`)
SwitchText<x\><a class="cmnd" id="switchtext"></a>|Show current JSON label of `Switch<x>` (`1..8`). Only `SwitchText` shows value for all 8 switches<BR>`<text>` - replace default `Switch<x>` label in JSON messages with a custom text<BR>
WebButton<x\><a class="cmnd" id="webbutton"></a>|Change the name of the toggle buttons of the WEB UI. This command accepts spaces in the name
WebQuery<x\><a class="cmnd" id="webquery"></a>|Command for GET, POST, PUT, and PATCH HTTP queries, complete with Request Headers and request body (when applicable)<BR> `<url> GET|POST|PUT|PATCH [<headers>] <body>`<BR>[More information...](https://github.com/arendst/Tasmota/pull/13209)
See also|[`SetOption1`](#setoption1) - Set button multipress mode<BR>[`SetOption11`](#setoption11) - Swap pushbutton single and double press functionality<BR>[`SetOption13`](#setoption13) - Allow immediate action on single button press<BR>[`SetOption26`](#setoption26) - Use indexes even when only one relay is present<BR>[`SetOption31`](#setoption31) - Disable Wi-Fi LED status blinking<BR>[`SetOption32`](#setoption32) - Set hold interval before sending `HOLD` action<BR>[`SetOption40`](#setoption40) - Stop detecting any input change on button GPIO<BR>[`SetOption67`](#setoption67) - Enable/Disable Buzzer<BR>[`SetOption73`](#setoption73) - Decouple buttons from controlling power outputs

### Management

Command|Parameters
:---|:---
Delay<a class="cmnd" id="delay"></a>|`2..3600` = set a delay between two backlog commands with 0.1 second increment. *Not recommended for precision timing!*
DeepSleepTime<a class="cmnd" id="deepsleeptime"></a>|Time to enter [deep sleep mode](DeepSleep)<BR>`0` = disable deep sleep mode *(default)*<BR>`11..86400` = set deep sleep mode time period in seconds
DeviceName<a class="cmnd" id="devicename"></a>|Device name displayed in the webUI and used for HA autodiscovery.<br>`<value>` = set device name _(default = `FriendlyName1` value)_
Emulation<a class="cmnd" id="emulation"></a>|`0` = disable emulation *(default)*<BR>`1` = enable Belkin WeMo emulation for [Alexa](Alexa)<BR>`2` = enable Hue Bridge emulation for [Alexa](Alexa)
FriendlyName<x\><a class="cmnd" id="friendlyname"></a>|`1` = Reset friendly name to firmware default<BR>`<value>` = set friendly name (32 char limit)
Gpios<a class="cmnd" id="gpios"></a>|Show list of available [components](Components#gpio-conversion) by name and index<BR>`255` / `All` Show list of all [components](Components#gpio-conversion) by name and index<BR>
Gpio<a class="cmnd" id="gpio"></a>|Show current [component](Components#gpio-conversion) assignments of the Module's configurable GPIO<BR>`255` / `All` Show [component](Components#gpio-conversion) assignments for all the devices available GPIO<BR>
Gpio<x\><a class="cmnd" id="gpiox"></a>|`<component>` = assign a [component](Components) to `Gpio<x>`
I2Cscan<a class="cmnd" id="i2cscan"></a>|Scan I<sup>2</sup>C bus and show addresses for found devices
I2CDriver<a class="cmnd" id="i2cdriver"></a>|Enable / Disable I<sup>2</sup>C sensor drivers. [Read more...](I2CDEVICES)<BR>
LogHost<a class="cmnd" id="loghost"></a>|`1` = reset [syslog](https://www.sigmdel.ca/michel/ha/rpi/syslog_en.html) host to firmware default (`SYS_LOG_HOST`)<BR>`<value>` = set syslog host
LogPort<a class="cmnd" id="logport"></a>|`1` = reset [syslog](https://www.sigmdel.ca/michel/ha/rpi/syslog_en.html) port to firmware default (`SYS_LOG_PORT`)<BR>`2..32766` = set syslog port
Modules<a class="cmnd" id="modules"></a>|Show available modules by name and index
Module<a class="cmnd" id="module"></a>|Displays active module by name and index<BR>`<value>` = switch to module <value\> and restart<BR>`0` = switch to defined [template](Templates) and restart
Module2<a class="cmnd" id="module2"></a>|Displays active [fast reboot](Device-Recovery#fast-power-cycle-device-recovery) fallback module by name and index<BR>`<value>` = set fast reboot fallback module to <value\><BR>`0` = set fast reboot fallback module to defined [template](Templates)
MqttLog<a class="cmnd" id="mqttlog"></a>|`0` =  disable logging via MQTT *(default)*<BR> `1` = show only error messages<BR> `2` = show error and info messages<BR>`3` = show error, info and debug messages<BR>`4` = show error, info and more debug messsages
NtpServer<x\><a class="cmnd" id="ntpserver"></a>|NTP server setup (x= `1..3`)<BR>`0` = clear NtpServer<x\> settings<BR>`1` = reset NtpServer<x\> settings to firmware defaults<BR>`<value>` = set NtpServer<x\> host or IP address (32 char limit)
OtaUrl<a class="cmnd" id="otaurl"></a>|Display current OTA URL<BR> `1` = Reset OtaUrl to firmware default<BR> `url` = set address for OTA (100 char limit)
Pwm<x\><a class="cmnd" id="pwm"></a>|`0..1023` = set PWM value for channel
PwmFrequency<a class="cmnd" id="pwmfrequency"></a>|`1` = reset PWM frequency to 223Hz<BR>`40..4000 or 40..50000` = set PWM frequency (40Hz to 4kHz on ESP 82xx / 40-50kHz on ESP32)<BR>_As of v8.3.0 the default frequency changed to 977Hz_
PwmRange<a class="cmnd" id="pwmrange"></a>|`1` = reset maximum PWM range to 1023<BR>`255..1023` = set maximum PWM range
Reset<a class="cmnd" id="reset"></a>|`1` = reset device settings to firmware defaults and restart (see warning below)<BR>`2` = erase flash, reset device settings to firmware defaults and restart<BR> `3` = erase System Parameter Area in flash (Wi-Fi calibration and related data) and restart (see warning below)<BR>`4` = reset device settings to firmware defaults but retain Wi-Fi credentials and restart<BR> `5` = erase all flash and reset parameters to firmware defaults but keep Wi-Fi settings and restart<BR>`6` = erase all flash and reset parameters to firmware defaults but keep Wi-Fi and MQTT settings and restart<BR>*(Erase of flash can take a few seconds to complete and there is no output during the erase process on the serial or web console)*<BR>`99` = reset device bootcount to zero<BR>:warning: For `reset 3`and `reset 1`, device must be power-cycled in order to load new Wifi System parameters.
Restart<a class="cmnd" id="restart"></a>|`1` = restart device with configuration saved to flash<BR>`2` = halt system (needs hardware reset or power cycle to restart)<BR>`99` = force restart device without configuration save<BR>_For debug and testing stack trace dumps only:_<BR>`-1` = force an Exception (28) crash<BR>`-2` = force a Soft WDT reset (after a freeze of 2 seconds)<BR>`-3` = force an OS watchdog reset (after a freeze of 120 seconds, **caution!**)
SaveData<a class="cmnd" id="savedata"></a>|`0` = save parameter changes only manually, e.g. with `Restart 1`<BR>`1` = save parameter changes every second *(default)*<BR>`2..3600` = save parameter changes every x second
SerialLog<a class="cmnd" id="seriallog"></a>|Disable hardware serial bridge and<BR>`0` =  disable serial logging<BR> `1` = show only error messages<BR> `2` = show error and info messages *(default)*<BR>`3` = show error, info and debug messages<BR>`4` = show error, info and more debug messages<BR>`SerialLog` will be disabled automatically 10 minutes after the device reboots.
SetSensor<x\><a class="cmnd" id="setsensor"></a>|Enable / Disable individual sensor driver(x= `1..127`)
Sleep<a class="cmnd" id="sleep"></a>|`0` = turn sleep off<BR>`1..250` = set sleep duration in milliseconds to enable [energy saving](Energy-Saving) *(default = `50`)*
State<a class="cmnd" id="state"></a>|Display current device state and publish to `%prefix%/%topic%/RESULT` topic&emsp;
Status<a class="cmnd" id="status"></a>|` ` = show abbreviated [status information](JSON-Status-Responses#basic-response)<BR>`0` = show all status information (1 - 11)<BR>`1` = show device parameters information<BR>`2` = show firmware information<BR>`3` = show logging and telemetry information<BR>`4` = show memory information<BR>`5` = show network information<BR>`6` = show MQTT information<BR>`7` = show time information<BR>`8` = show connected sensor information *(retained for backwards compatibility)*<BR>`9` = show power thresholds *(only on modules with power monitoring)*<BR>`10` = show connected sensor information *(replaces 'Status 8')*<BR>`11` = show information equal to [`TelePeriod`](#teleperiod) state message<BR>`12` = in case of crash to dump the call stack saved in RT memory
Status0<a class="cmnd" id="status0"></a>|`0` = show all status information in a single line
SysLog<a class="cmnd" id="syslog"></a>|`0` = disable syslog logging *(default)*<BR> `1` = show only error messages<BR> `2` = show error and info messages<BR>`3` = show error, info and debug messages<BR>`4` = show error, info and more debug messages
Template<a class="cmnd" id="template"></a>|Show current [Template](Templates)<BR>`0` = create template from active module<BR>`x` = create template from a [supported module](Modules)<BR>`255` = merge current module and template settings into new template<BR>`{ ... }` = store template in a [JSON payload](Templates#anatomy-of-a-template)<BR>Does not activate the template. To activate use `Module 0`.
Time<a class="cmnd" id="time"></a>|`0` = enable NTP *(default)*<BR>`1` = format JSON message timestamp in ISO format<BR>`2` = format JSON message timestamp in both ISO and Epoch format<BR>`3` = format JSON message timestamp in Epoch format<BR>`4` = format JSON message timestamp in milliseconds<BR>`<value>` = disable NTP and set UTC time as epoch value if greater than `1451602800` (January 1, 2016)
TimeStd<BR>TimeDst<a class="cmnd" id="timestd"></a><a class="cmnd" id="timedst"></a>|Set policies for the beginning of daylight saving time (Dst) and return back to standard time (Std)&emsp; <BR>`0` = reset parameters to firmware defaults<BR>`H`,`W`,`M`,`D`,`h`,`T`<BR>   `H` = hemisphere (`0` = northern hemisphere / `1` = southern hemisphere)<BR>   `W` = week (`0` = last week of month, `1..4` = first .. fourth)<BR>   `M` = month (`1..12`)<BR>   `D` = day of week (`1..7` `1` = sunday `7` = saturday)<BR>   `h` = hour (`0..23`) in **local** time<BR>   `T` = timezone (`-780..780`) (offset from UTC in **MINUTES** - 780min / 60min=13hrs)<BR>_Example:_ `TIMEDST 1,1,10,1,2,660`<BR>_If timezone is **NOT** 99, DST is not used (even if displayed) [see](https://github.com/arendst/Tasmota/issues/8528#issuecomment-633247984)
Timezone<a class="cmnd" id="timezone"></a>|`-13..+13` = set timezone offset from UTC in hours<BR>`-13:00..+13:00` = set timezone offset from UTC in hours and minutes<BR>`99` = use timezone configured with `TimeDst` and `TimeStd`
Ufs<a class="cmnd" id="ufs"></a>|Universal File System commands [read more...](UFS.md)
UfsDelete<a class="cmnd" id="ufsdelete"></a>|Delete SD card or Flash FS file if only of them available
UfsDelete2<a class="cmnd" id="ufsdelete2"></a>|Deleten only Flash FS file if available
UfsFree<a class="cmnd" id="ufsfree"></a>|Filesystem free size in kb
UfsRename<a class="cmnd" id="ufsrename"></a>|Rename SD card or Flash FS file if only of them available
UfsRename2<a class="cmnd" id="ufsrename2"></a>|Rename only Flash FS file if available
UfsRun<a class="cmnd" id="ufsrun"></a>|Run file
UfsSize<a class="cmnd" id="ufssize"></a>|Filesystem size in kb
UfsType<a class="cmnd" id="ufstype"></a>|Get filesystem type<BR>`0` = none<BR>`1` = SD card<BR>`2` = Flash file<BR>`3` = LittleFS
Upgrade<a class="cmnd" id="upgrade"></a>|`1` = download firmware from `OtaUrl` and restart<BR>`<value>` = download firmware from `OtaUrl` if <value\> is higher than device version
Upload<a class="cmnd" id="upload"></a>|`1` = download firmware from `OtaUrl` and restart<BR>`<value>` = download firmware from `OtaUrl` if <value\> is higher than device version
WebGetConfig<a class="cmnd" id="webgetconfig"></a>|`<url>` = pull a configuration `.dmp`  file from a HTPP URL<BR>[More information...](https://github.com/arendst/Tasmota/pull/13034)
WebLog<a class="cmnd" id="weblog"></a>|`0` = disable web logging<BR> `1` = show only error messages<BR> `2` = show error and info messages *(default)*<BR>`3` = show error, info and debug messages<BR>`4` = show error, info and more debug messages
See also|[`SetOption68`](#setoption68) - PWM Channel control<BR>[`SetOption76`](#setoption76) - DeepSleep disable bootcount incrementing

### Wi-Fi

Command|Parameters
:---|:---
AP<a class="cmnd" id="ap"></a>|`0` = switch to other Wi-Fi Access Point<BR>`1`= select Wi-Fi Access Point 1<BR>`2`= select Wi-Fi Access Point 2
CORS<a class="cmnd" id="cors"></a>|`"` = disable CORS (Cross Origin Resource Sharing) (default)<BR>`*` = enable CORS for all locations<BR>`value` = Enable CORS for location. This needs to be complete url ex: `http://tasui.shantur.com`
Hostname<a class="cmnd" id="hostname"></a>|`1` = reset hostname to `MQTT_TOPIC-<4digits>` and restart<BR>`<value>` = set hostname (32 char limit) and restart. If hostname contains `%` it will be reset to the default instead. See [FAQ](FAQ#available-characters-for-hostname) for allowed characters.<BR>**_If using MQTT to issue this command, if it is used with the device `GroupTopic`, the command will not be executed._**
IPAddress&#60;x><a class="cmnd" id="ipaddress"></a>|Set networking IP (`XXX.XXX.XXX.XXX`) addresses<BR>`IPAddress1` = set device IP address<BR><li>`0.0.0.0` = use dynamic IP address (DHCP)</li><li>`XXX.XXX.XXX.XXX` = set static IP address</li>`IPAddress2` = set gateway IP address<BR>`IPAddress3` = set subnet mask<BR>`IPAddress4` = set DNS server IP address<BR><BR>*follow IPAddress commands with `restart 1` to apply changes*
Password<x\><a class="cmnd" id="password"></a>|`<x>` = `1..2`<BR>`<value>` = set AP<x\> Wi-Fi password and restart<BR>`1` = reset AP<x\> Wi-Fi password to firmware default (`STA_PASS1` or `STA_PASS2`) and restart<BR>Passwords are limited to 64 characters. **Do not use special characters or white spaces in the password**.<BR>**Note that `Password` and `Password1` are equivalent commands.**
Ping<x\> <addr\><a class="cmnd" id="ping"></a>|`<x>` = `0..8` = the number of ICMP packets to send, `0` uses the default (4)<BR>`<addr>` = address to send Ping, either in numerical format `192.168.1.200` or domain name `tasmota.com`<BR><BR>(requires `#define USE_PING`)<BR>Example `Ping4 192.168.1.203`: ```RSL: tele/tasmota_xxx/RESULT = {"Ping":{"192.168.1.203":{"Reachable":true,"Success":4,"Timeout":0,"MinTime":59,"MaxTime":167,"AvgTime":116}}}```
Ssid<x\><a class="cmnd" id="ssid"></a>|`<x>` = `1..2`<BR>`<value>` = set AP<x\> Wi-Fi SSID and restart<BR>`1` = reset AP<x\> Wi-Fi SSID to firmware default (`STA_SSID1` or `STA_SSID2`) and restart<BR>SSID are limited to 32 characters. **Do not use special characters or white spaces in the SSID**
TCPBaudRate<a class="cmnd" id="tcpbaudrate"></a>|Requires GPIOs `TCP Tx` and `TCP Rx` and can work with hardware or software serial.<BR>`1200..115200` = set the baudrate for serial (only 8N1 mode)
TCPStart<a class="cmnd" id="tcpstart"></a>|Requires GPIOs `TCP Tx` and `TCP Rx` and can work with hardware or software serial.<BR>`<port>, [<ipaddress>]` = Start listening to port. If `<ipaddress>` is defined only allows connections from the provided IPv4 address <BR>`0` = Shut down TCP server and disconnect any existing connection<BR> Supports 2 parallel TCP connections, which can be useful if you need a terminal + a specific protocol (like XMODEM). The 3rd connection will disconnect a previous connection. The number of parallel connections is a compile-time option.
WebColor<x\><a class="cmnd" id="webcolor"></a>|Configure Web GUI colors (x = `1..19`)<BR>`#RRGGBB` = Set color for `WebColor<x>`<BR>`1` = Global text (Black)<BR>`2` = Global background (White)<BR>`3` = Form background (Greyish)<BR>`4` = Input text (Black)<BR>`5` = Input background (White)<BR>`6` = Console text (Black)<BR>`7` = Console background (White)<BR>`8` = Warning text (Red)<BR>`9` = Success text (Green)<BR>`10` = Button text (White)<BR>`11` = Button (Blueish)<BR>`12` = Button hovered over (Darker blueish)<BR>`13` = Restart/Reset/Delete button (Redish)<BR>`14` = Restart/Reset/Delete button hover (Darker reddish)<BR>`15` = Save button (Greenish)<BR>`16` = Save button hover (Darker greenish)<BR>`17` = Config timer tab text (White)<BR>`18` = Config timer tab background (Light grey)<br>`19` = Module title and FriendlyName text (Whiteish)<br>[User themes](WebUI#themes)
WebPassword<a class="cmnd" id="webpassword"></a>|Show current web server password<BR>`0` = disable use of password for web UI<BR>`1` = reset password to firmware default (`WEB_PASSWORD`)<BR>`<value>` = set web UI password (32 char limit) for user `WEB_USERNAME` *(Default WEB_USERNAME = `admin`)*
WebQuery<a class="cmnd" id="webquery"></a>|Send HTTP GET, POST, PUT, and PATCH Requests<BR>`<url> <method> [<header1Name:header1Value\|header2Name:header2Value...>] <body>`<BR>`<url>` = HTTP URL to query<BR>`<method>` = HTTP Request method. Must be `GET`, `POST`, `PUT`, or `PATCH`<BR>`[<header1Name:header1Value\|header2Name:header2Value...>]` *(optional)* =  HTTP Request Headers.<BR>`<body>` *(optional)* = HTTP Request Body. Ignored for GET requests<BR><BR>Examples<BR>`WebQuery http://www.mysite.com/api/status GET`: Simple HTTP GET Request<BR>`WebQuery http://www.mysite.com/api/update POST [Authorization:Bearer xyz\|Content-Type:application/json] {"message":"body"}`: Sends POST data with an authorization header and Content-Type<br>`WebQuery http://www.mysite.com/api/set PUT {"message":"body"}`: Sends PUT request with a body, but no headers
WebRefresh<a class="cmnd" id="webrefresh"></a>|Web page refresh<BR>`1000..10000` = set refresh time in milliseconds *(default = `2345`)*
WebSend<a class="cmnd" id="websend"></a>|Send a command to Tasmota host over http. If a command starts with a `/` it will be used as a link.<BR>`[<host>:<port>,<user>:<password>] <command>`<BR>`<host>` = hostname or IP address.<BR>`<port>` = port for the device if not the default `80`<BR>`<user>` = enter username of the device you're sending the command to<BR>`<password>` = enter password of the device you're sending the command to<BR>`<command>` = command and payload<BR>*example 1: `[<ip>] POWER1 ON` sends `http://<ip>/cm?cmnd=POWER1 ON`*<BR>*example 2: `WebSend [myserver.com] /fancy/data.php?log=1234` sends `http://myserver.com/fancy/data.php?log=1234`*
WebGetConfig<a class="cmnd" id="webgetconfig"></a>|`<url>`<BR>Download a configuration (*.dmp) from an http URL. The URL can include `%id%` which will be substituted by the device's MAC address without the dots. A possible usage for ones that compile their own binary is to include the command in USER_BACKLOG for automatic reconfiguration after a `reset 1`command.
WebSensor<x\><a class="cmnd" id="websensor"></a>|Control display of sensor telemetry in the web UI<BR>`0` = Do not display sensor's telemetry<BR>`1` = Display sensor's telemetry (*default*)<BR>`<x>` = number corresponding to the sensor - listed in the `sns` section of the [supported sensor spreadsheet](https://docs.google.com/spreadsheets/d/e/2PACX-1vRBFqaP5QAFmT8iIYBxrn-EQp7-SrkxL6tb0OjpqtBxDEsmkiWCFei3sFyA_UXoqlbs3CqtEdOfC6Pa/pubhtml?gid=1029939700&single=true)<BR>`<x>` = `3` Energy telemetry<BR>Issue a `Status 4` to obtain a list of sensor types enabled in the firmware loaded on the device.
WebServer<a class="cmnd" id="webserver"></a>|`0` = stop web server<BR>`1` = start web server in user mode<BR>`2` = start web server in admin mode
Wifi<a class="cmnd" id="wifi"></a>|`0` = disable Wi-Fi<BR>`1` = enable Wi-Fi _(default)_ <BR>`2` = Wi-Fi mode 802.11b<BR>`3` = Wi-Fi mode 802.11b/g<BR>`4` = Wi-Fi mode 802.11b/g/n<BR> When wifi is Off it is always returned On after a restart except for a wake-up from deepsleep.    
WifiConfig<a class="cmnd" id="wificonfig"></a>|`0` = disable Wi-Fi Manager and reboot (used with alternate AP)<BR>`2` = set [Wi-Fi Manager](https://github.com/tzapu/WiFiManager/blob/master/README.md#how-it-works) as the current configuration tool and start Wi-Fi Manager (web server at 192.168.4.1) for 3 minutes, then reboot and try to connect Wi-Fi network<BR>`4` = retry other AP without rebooting _(default)_<BR>`5` = wait until selected AP is available again without rebooting<BR>`6` = Wi-Fi parameters can only be entered via commands in the serial console<BR>`7` = set [Wi-Fi Manager](https://github.com/tzapu/WiFiManager/blob/master/README.md#how-it-works) (web server at 192.168.4.1) as the current configuration tool restricted to reset settings only. <BR>_This setting is recommended for devices without an external control/reset button_.<BR>&emsp;_No longer supported_ <BR>`1` = set [SmartConfig](https://community.particle.io/t/smart-config-the-missing-manual-now-available/442) ([Android](https://play.google.com/store/apps/details?id=com.iotmaker&hl=en_US)/iOS) for 3 minutes<BR>`3` = set [WPS](https://en.wikipedia.org/wiki/Wi-Fi_Protected_Setup) for 3 minutes
[WifiPower](WifiPower)<a class="cmnd" id="wifipower"></a>|set Wi-Fi transmit power level in decibel-milliwatts (dBm) *(default = `17`)*
See also|[`SetOption55`](#setoption55) - mDNS service control<BR>[`SetOption56`](#setoption56) - Wi-Fi network scan to select strongest signal on restart<BR>[`SetOption57`](#setoption57) - Wi-Fi network re-scan, alternate AP

### MQTT

Command|Parameters
:---|:---
ButtonRetain<a class="cmnd" id="buttonretain"></a>|`0` = disable use of MQTT retain flag *(default)*<BR>`1` = enable MQTT retain flag on button press
ButtonTopic<a class="cmnd" id="buttontopic"></a>|`<value>` = set MQTT button topic<BR>`0` = disable use of MQTT button topic<BR>`1` = set MQTT button topic to device `%topic%`<BR>`2` = reset MQTT button topic to firmware default (`MQTT_BUTTON_TOPIC`) *(default = `0`)*<BR>_If using MQTT to issue this command, if it is published to the device `GroupTopic`, the command will not be executed._
FullTopic<a class="cmnd" id="fulltopic"></a>|`1` = reset MQTT fulltopic to firmware default (`MQTT_FULLTOPIC`) and restart<BR>`<value>` = set MQTT fulltopic and restart. Use of [optional %prefix%, %topic%, %hostname%, and %id% substitution tokens](MQTT#mqtt-topic-definition) is allowed.<br>*If using MQTT to issue this command, if it is published to the device `GroupTopic`, _you must ensure uniqueness of the resulting fulltopic on each destination device by using one or more of these substitution tokens._*
GroupTopic<x\><a class="cmnd" id="grouptopic"></a>|`1` = reset MQTT group <x\> topic to firmware default (`MQTT_GRPTOPIC`) and restart<BR>`<value>` = set MQTT group <x\> topic and restart
MqttClient<a class="cmnd" id="mqttclient"></a>|`1` = reset MQTT client to firmware config (`MQTT_CLIENT_ID`) and restart<BR>`<value>` = set MQTT client and restart.<BR>You can use the `%06X` substitution token to replace with last six characters of MAC address.<BR>_If using MQTT to issue this command, if it is used with the device `GroupTopic`, the command will not be executed._
MqttFingerprint<a class="cmnd" id="mqttfingerprint"></a>|*TLS needs to be enabled in firmware for this command*&emsp; <BR>`<value>` =  set current fingerprint as 20 space separated bytes (59 chars max)
MqttHost<a class="cmnd" id="mqtthost"></a>|`0` = clear MQTT host field and allow mDNS to find MQTT host<BR>`1` = reset MQTT host to firmware default (`MQTT_HOST`) and restart<BR>`<value>` = set MQTT host and restart (do NOT use `.local`)
MqttKeepAlive<a class="cmnd" id="mqttkeepalive"></a>|`1..100` = set MQTT Keep Alive timer *(default = `30`)*
MqttPassword<a class="cmnd" id="mqttpassword"></a>|`0` = clear MQTT password<BR>`1` = reset MQTT password to firmware default (`MQTT_PASS`) and restart<BR>`<value>` = set MQTT password and restart (min 5 chars)
MqttPort<a class="cmnd" id="mqttport"></a>|`1` = reset MQTT port to firmware default (`MQTT_PORT`) and restart<BR>`<value>` = set MQTT port between 2 and 32766 and restart
MqttRetry<a class="cmnd" id="mqttretry"></a>|`10..32000` = set MQTT connection retry timer in seconds *(default = `10`)*
MqttTimeout<a class="cmnd" id="mqtttimeout"></a>|`1..100` = set MQTT socket timeout *(default = `4`)*
MqttUser<a class="cmnd" id="mqttuser"></a>|`0` = clear MQTT user name<BR>`1` = reset MQTT user name to firmware default (`MQTT_USER`) and restart<BR>`<value>` = set MQTT user name and restart
MqttWifiTimeout<a class="cmnd" id="mqttwifitimeout"></a>|`100..20000` = set MQTT Wi-Fi connection timeout in miliseconds *(default = `200`)*
PowerRetain<a class="cmnd" id="powerretain"></a>|MQTT [power retain state](MQTT#retained-mqtt-messages)<BR> `0` / `off` = disable MQTT power retain on status update *(default)* <BR> `1` / `on` = enable MQTT power retain on status update <BR>
Prefix1<a class="cmnd" id="Prefix1"></a>|`1` = reset MQTT command subscription prefix to firmware default (`SUB_PREFIX`) and restart<BR>`<value>` = set MQTT command subscription prefix and restart
Prefix2<a class="cmnd" id="Prefix2"></a>|`1` = reset MQTT status prefix to firmware default (`PUB_PREFIX`) and restart<BR>`<value>` = set MQTT status prefix and restart
Prefix3<a class="cmnd" id="Prefix3"></a>|`1` = Reset MQTT telemetry prefix to firmware default (`PUB_PREFIX2`) and restart<BR>`<value>` = set MQTT telemetry prefix and restart
Publish<a class="cmnd" id="publish"></a>|`<topic> <payload>` = MQTT publish any topic and optional payload&emsp;
Publish2<a class="cmnd" id="Publish2"></a>|`<topic> <payload>` = MQTT publish any topic and optional payload with retain flag
SensorRetain<a class="cmnd" id="sensorretain"></a>|`0` = disable use of sensor MQTT retain flag *(default)*<BR>`1` = enable MQTT retain flag on message `tele/%topic%/SENSOR`
StateText<x\><a class="cmnd" id="StateText"></a>|`<value>` = set state text  (`<x>` = `1..4`)<BR>1 = `OFF` state text<BR>2 = `ON` state text<BR>3 = `TOGGLE` state text<BR>4 = `HOLD` state text<BR>
SwitchRetain<a class="cmnd" id="switchretain"></a>|`0` = disable use of MQTT retain flag *(default)*<BR>`1` = enable MQTT retain flag on switch press
Subscribe<a class="cmnd" id="subscribe"></a>|Subscribes to an MQTT topic without appended `/#` and assigns an Event name to it.<BR>`<eventName>, <mqttTopic> [, <key>]` = [Read more...](Subscribe-&-Unsubscribe)<br>`  ` = list all topics currently subscribed
Subscribe2<a class="cmnd" id="subscribe2"></a>|Subscribes to an MQTT topic and assigns an Event name to it.<BR>`<eventName>, <mqttTopic> [, <key>]` = [Read more...](Subscribe-&-Unsubscribe)<br>`  ` = list all topics currently subscribed
SwitchTopic<a class="cmnd" id="switchtopic"></a>|`<value>` = set MQTT switch topic<BR>`0` = disable use of MQTT switch topic<BR>`1` = set MQTT switch topic to device `%topic%`<BR>`2` = reset MQTT switch topic to firmware default (`MQTT_SWITCH_TOPIC`) *(default = `0`)*<BR>[Read more](Buttons-and-Switches) about this.<BR>_If using MQTT to issue this command, if it is used with the device `GroupTopic`, the command will not be executed._
TelePeriod<a class="cmnd" id="teleperiod"></a>|See current value and force publish STATE and SENSOR message<BR>`0` = disable telemetry messages<BR>`1` = reset telemetry period to firmware default (`TELE_PERIOD`)<BR>`10..3600` = set telemetry period in seconds _(default = `300`)_
Topic<a class="cmnd" id="topic"></a>|`1` = reset MQTT topic to firmware default (`MQTT_TOPIC`) and restart<BR>`<value>` = set MQTT topic **and** `ButtonTopic` and restart.<BR>When using MQTT to issue this command, if it is used with the device `GroupTopic`, the command will not be executed. **Topic can not be identical to [`MqttClient`](#mqttclient)**
Unsubscribe<a class="cmnd" id="unsubscribe"></a>|Unsubscribe from topics subscribed to with [`Subscribe`](#subscribe) <BR>`  ` = unsubscribe all topics<BR>`<eventName>` = unsubscribe from a specific MQTT topic
See also|[`SetOption3`](#setoption3) - Disable//Enable MQTT<BR>[`SetOption4`](#setoption4) - Return MQTT response as `RESULT` or `%COMMAND%` topic<BR>[`SetOption10`](#setoption10) - Main topic change behavior

### Rules

Command|Parameters
:---|:---
Add<x\><a class="cmnd" id="add"></a>|`<value>` = add value to Var<x\> ([example](Rules#arithmetic-commands-used-with-var))
CalcRes<a class="cmnd" id="calcres"></a>|Current calculation resolution<BR>`0..7` = set number of decimal places to be used in `Add`, `Sub`, `Mult` and `Scale`
Event<a class="cmnd" id="event"></a>|Execute an event to trigger a rule as [documented](Rules#rule-trigger)&emsp;
Mem<x\><a class="cmnd" id="mem"></a>|Manage up to 16 variables stored on flash (x = `1..16`)<BR>`Mem` returns all current values. `Mem<x>` returns the variable's current value.<BR>`<value>` = store a string value in a variable<BR>`"` = clear stored value in Mem<x\>
Mult<x\><a class="cmnd" id="mult"></a>|`<value>` = multiply value to Var<x\> ([example](Rules#arithmetic-commands-used-with-var))<BR>
Rule<x\><a class="cmnd" id="rule"></a>|Rules. [Read more...](Rules)<BR>`0` = disable Rule<x\><BR>`1` = enable Rule<x\><BR>`2` = toggle Rule<x\><BR>`4` = disable one-shot detection (perform commands as long as trigger is met)<BR>`5` = enable one-shot (e.g., sometimes used for slow changing sensors like temperature) detection<BR>`6` = toggle one-shot detection<BR>`8` = disable stop-on-error after exception restart<BR>`9` = enable stop-on-error after exception restart<BR>`10` = toggle stop-on-error after exception restart<BR>`<value>` = define Rule<x\><BR>`+<value>` = append to Rule<x\><BR>`"` = clear Rule<x\><BR><BR>Rule set one-shot: Each rule within the rule set will trigger only once until the trigger condition returns to a false condition. For example, `ON Energy#Power<3`: Without one-shot enabled, it will trigger anytime `Energy#Power` gets an update (i.e., the `Power` telemetry value changes) and the value is `<3`. This can potentially trigger that rule multiple times. With one-shot enabled, the rule will trigger only the on the first transition to `<3` and not again until the trigger value goes `>=3`. In other words, the rule will trigger again, but it has to cross the conditional "boundary" before it will trigger again.
Rule0<a class="cmnd" id="rule0"></a>|Same functionality as Rule<x\> but affects all rulesets at once
RuleTimer<x\><a class="cmnd" id="ruletimer"></a>|Up to eight timers to be used as countdown event (x = `1..8`)&emsp; <BR>`0..65535` = set countdown rule timer in seconds<BR>`RuleTimer0 0` = stops and clear all timer simultaneously
Scale<x\><a class="cmnd" id="scale"></a>|Scale value from a low and high limit to another low and high limits and save in Var<x\> ([example](Rules#arithmetic-commands-used-with-var))<BR>`v` = value: the number to scale<BR>`fl` = fromLow: the lower bound of the value’s current range<BR>`fh` = fromHigh: the upper bound of the value’s current range<BR>`tl` = toLow: the lower bound of the value’s target range<BR>`th` = toHigh: the upper bound of the value’s target range
Sub<x\><a class="cmnd" id="sub"></a>|`<value>` = subtract value to Var<x\> ([example](Rules#arithmetic-commands-used-with-var))
Var<x\><a class="cmnd" id="var"></a>|Manage up to 16 variables stored in memory (x = `1..16`)<BR>`Var` returns all current values. `Var<x>` returns the variable's current value.<BR>`<string>` = store a string value in a variable<BR>`"` = clear stored value in Var<x\>

### Timers

Command|Parameters
:---|:---
Latitude<a class="cmnd" id="latitude"></a>|`<value>` = set latitude in decimal degrees format, e.g. -33.893681
Longitude<a class="cmnd" id="longitude"></a>|`<value>` = set longitude in decimal degrees format, e.g. 18.619954
Timers<a class="cmnd" id="timers"></a>|Timers control<br>`0` = disable all timers<BR>`1` = enable all timers<BR>`2` = toggle all timers<BR>
Timer<x\><a class="cmnd" id="timer"></a>|Parameters for Timer<x\> where x = `1..16`<BR>`0` = clear parameters for Timer<x\><BR>`1..16` = copy Timer<y\> parameters to Timer<x\><BR>`{ "name":value ; .. }` = set all or individual parameters using JSON payload with names and values of data pairs from the [table](Timers#json-payload-anatomy)

!!! note "Information on sensors documented below is transmitted in the Tasmota telemetry message"

### Sensors

Command|Parameters
:---|:---
AdcParam<x\><a class="cmnd" id="adcparam"></a>|[ADC](ADC) analog input tuning parameters. On ESP32 x is channel `1..8`<br>`<sensor>, <param1>, <param2>, <param3>,  <param4>`<BR>`<sensor>` values:<br>&emsp; `2` = Temperature [Steinhart-Hart thermistor equation](https://en.wikipedia.org/wiki/Steinhart%E2%80%93Hart_equation) parameters:</li><ul>`<param1>` = NTC Voltage bridge resistor in Ohms *(default = `32000`)*<br>`<param2>` = NTC Resistance in Ohms *(default = `10000`)*<BR>`<param3>` = NTC Beta Coefficient *(default = `3350`)*</li></ul><br>&emsp; `3` = Light [Lux equation](https://www.allaboutcircuits.com/projects/design-a-luxmeter-using-a-light-dependent-resistor/) parameters:</li><ul>`<param1>` = LDR Voltage bridge resistor in Ohms *(default = `10000`)*<BR>`<param2>` = LDR Lux Scalar *(default = `12518931`)*<BR>`<param3>` = LDR Lux Exponent *(default = `-1.4050`)*</li></ul><br>&emsp; `6` = ADC linear range remapping parameters:</li><ul>`<param1>` = input range low value `adcLow` *(default = `0`)*<BR>`<param2>` = input range high value `adcHigh` *(default = `1023`)*<BR>`<param3>` = output range low value `rangeLow` *(default = `0`)*<BR>`<param4>` = output range high value `rangeHigh` *(default = `100`)*<BR>The range remapping perform the following calculation on the ADC value *[0..1023]*:<BR>`Range = ((adcHigh - ADC) / (adcHigh - adcLow)) * (rangeLow - rangeHigh) + rangeHigh`<br>*The calculation is performed in double resolution floating point but all 4 parameters as well as the range output are unsigned 16 bit integers. The calculation result must not exceed [0..65535].*<BR>Example to convert the ADC value on a D1-mini into millivolts (using the default resistor bridge of 220k/100k):<BR>`AdcParam 6, 0, 1023, 0, 3200`</li></ul><br>&emsp; `7` = CT POWER parameter adjustments:</li><ul>`<param1>` = ANALOG_CT_FLAGS (default 0 for a non-invasive current sensor). When value is `>0` its sets the `adcLow` value as base for the measurement via OpAmp differential amplifier.<BR>`<param2>` = ANALOG_CT_MULTIPLIER ( 2146 = Default settings for a (AC) 20A/1V Current Transformer.) multiplier\*100000 to convert raw ADC peak to peak range 0..1023 to RMS current in Amps. Value of 100000 corresponds to 1<BR>`<param3>` = ANALOG_CT_VOLTAGE (default 2300) to convert current in Amps to apparent power in Watts using voltage in Volts*10. Value of 2200 corresponds to AC220V. For DC its Volt/1000. Eg. 12VDC = 0.012.<BR> `AdcParam 7,406,3282,0.012`</li></ul><BR>&emsp; `9` = ANALOG_PH parameter adjustments:</li><ul>`<param1>` = ANALOG_PH_CALSOLUTION_LOW_PH (default 4.0).<BR>`<param2>` = ANALOG_PH_CALSOLUTION_LOW_ANALOG_VALUE ( default 282 )<BR>`<param3>` = ANALOG_PH_CALSOLUTION_HIGH_PH (default 9.18).<BR>`<param4>` = ANALOG_PH_CALSOLUTION_HIGH_ANALOG_VALUE (default 435).<BR><BR>To calibrate the probe, two reference solutions with known pH are required. Calibration procedure: <ol><li>Put probe in solution with lower pH value. pH value of the solution is ANALOG_PH_CALSOLUTION_LOW_PH.</li><li>Wait until analog value / RAW value stabilizes (~3 minutes)</li><li>The analog reading is ANALOG_PH_CALSOLUTION_LOW_ANALOG_VALUE</li><li>Clean probe and put in solution with higher pH value. pH value of the solution is ANALOG_PH_CALSOLUTION_HIGH_PH.</li><li>Wait until analog value / RAW value stabilizes (~3 minutes)</li><li>The analog reading is ANALOG_PH_CALSOLUTION_HIGH_ANALOG_VALUE</li></ol>Analog readings can be read by either changing the analog port configuration to "Analog Input" while calibrating, or by enabling debug logs in the console and having a look at the `RAW Value`reading instead.<BR>
Altitude<a class="cmnd" id="altitude"></a>|`-30000..30000` = altitude in meters
AmpRes<a class="cmnd" id="sensors-ampres"></a>|Current sensor resolution<BR>`0..3` = maximum number of decimal places
BH1750Resolution<x\><a class="cmnd" id="bh1750resolution"></a>|[BH1750](BH1750.md) resolution mode. `x` = BH1750 sensor number (`1..2`) <BR>`0..2` = choose sensor resolution (`0` = high _(default)_, `1` = high2, `2` = low)
BH1750MTime<x\><a class="cmnd" id="bh1750mtime"></a>|[BH1750](BH1750.md) Measurement Time value. `x` = BH1750 sensor number (`1..2`) <BR>`30..255` = set Measurement Time value. Not persistent after reboot. _(default = `69`)_
Counter<x\><a class="cmnd" id="counter"></a>|`0` = reset Counter<x\><BR> `1..2,147,483,645` = preset Counter<x\><BR>`-1..-2,147,483,645` = decrease Counter<x\><BR>`+1..+2,147,483,645` = increase Counter<x\><BR>In order to define and use a Counter, _**you must configure one of the free device GPIO as `Counter<x>`. Counter<x> module configuration is using internal pull-up resistor while Counter<x>n does not. **_
CounterDebounce<a class="cmnd" id="counterdebounce"></a>|`0` = turn off counter debounce<BR> `1..32000` = set counter debounce time in milliseconds. Counter is increased with every falling edge when CounterType<x>=0 or time between successive falling edges is measured when CounterType<x>=1. When CounterDebounceLow and CounterDebounceHigh are set to zero (default) only falling edges of the counter's GPIO are checked. Any CounterDebounceLow or CounterDebounceHigh unequal zero checks are carried out befor CounterDebounce check is done. As an example you can set `CounterDebounce 500` to allow a minimum distance between to succesive valid falling edges equal to 500ms.
CounterDebounceLow<a class="cmnd" id="counterdebouncelow"></a>|`0` = turn off counter debounce low<BR> `1..32000` = set counter debounce low time in milliseconds. Allow individual debounce times for low pulse widths to discard non valid falling edges. These are checked before legacy CounterDebounce checks distance between two valid falling edges. When unequal zero tasmota will check falling and rising edges on the counter's GPIO. For CounterDebounceLow any GPIO change from low to high hat happens after the GPIO was not low for at least CounterDebounceLow will be ignored. As an example you can set `CounterDebounceLow 50` to allow a valid minimum distance between a falling and rising edge equal to 50ms while having a final CounterDebounce 500 check between to succesive valid falling edges equal to 500ms.
CounterDebounceHigh<a class="cmnd" id="counterdebouncehigh"></a>|`0` = turn off counter debounce high<BR> `1..32000` = set counter debounce high time in milliseconds. Allow individual debounce times for high pulse widths to discard non valid falling edges. These are checked before legacy CounterDebounce checks distance between two valid falling edges. When unequal zero tasmota will check falling and rising edges on the counter's GPIO. For CounterDebounceHigh any GPIO change from high to low hat happens after the GPIO was not high for at least CounterDebounceHigh will be ignored. As an example you can set `CounterDebounceHigh 100` to allow a valid minimum distance between a rising and falling edge equal to 100ms while having a final CounterDebounce 500 check between to succesive valid falling edges equal to 500ms.
CounterType<x\><a class="cmnd" id="countertype"></a>|`0` = set Counter<x\> as pulse Counter<BR>`1` = set Counter<x\> as pulse Timer
GlobalHum<a class="cmnd" id="globalhum"></a>|`0.0..100.0` = Set global Humidity for some Sensors that uses global Humidity.
GlobalTemp<a class="cmnd" id="globaltemp"></a>|`-50.0..100.0` = Set global Temperature for some Sensors that uses global temperature.
HumOffset<a class="cmnd" id="humoffset"></a>|`-10.0..10.0` = Set calibraton offset value for reported humidity telemetry<BR>This setting affects **all** humidity sensors on the device.
HumRes<a class="cmnd" id="humres"></a>|Humidity sensor resolution<BR>`0..3` = maximum number of decimal places
HumRes<a class="cmnd" id="humres"></a>|Humidity sensor resolution<BR>`0..3` = maximum number of decimal places
NPCLRes<a class="cmnd" id="npclres"></a>|*Neopool only*<BR>`<value>` = number of digits in results for CL values
NPIonRes<a class="cmnd" id="npcionres"></a>|*Neopool only*<BR>`<value>` = number of digits in results for ION values
NPPHRes<a class="cmnd" id="npphres"></a>|*Neopool only*<BR>`<value>` = number of digits in results for PH values
Sensor13<a class="cmnd" id="sensor13"></a>|[INA219](http://www.ti.com/product/INA219) low voltage current sensor calibration mode<BR>Predefined modes to use with standard 0.1 ohm resistor:<BR>`0` = set INA219 calibration to max 32V and 2A<BR>`1` = set INA219 calibration to max 32V and 1A<BR>`2` = set INA219 calibration to max 16V and 0.4A<BR>`10`..`255`: Define custom shunt resistor encoded as a decimal number `RRM` such that `Rshunt = RR * 10^M` milliohm<BR>Do not forget to choose a resistor adapted for the correct power dissipation and apply a 50% security margin !<BR>Examples:<BR>`11` = 1 * 10^1 = 10 milliohm (Imax=32A => Pres=15W)<BR>`21` = 2 * 10^1 = 20 milliohm (Imax=16A => Pres=7W)<BR>`12` = 1 * 10^2 = 100 milliohm (default, Imax=3.2A => Pres=2W)<BR>`13` = 1 * 10^3 = 1000 milliohm = 1 ohm (Imax=0.320A => Pres=0,2W)
Sensor15<a class="cmnd" id="sensor15"></a>|[Automatic Baseline Correction](https://github.com/arendst/Tasmota/blob/c97ea4d9176eb7e87abff5f963a0f1c60f0a5e52/sonoff/xsns_15_mhz19.ino#L47) for [MH-Z19B](MH-Z19B) CO~2~ sensor<BR>`0` = disable<BR>`1` = enable *(default)*<BR>`2` = start manual calibration from 400 ppm of CO~2~<BR>`9` = reset sensor to factory defaults<BR>`1000` = sets measurement range to 1000ppm CO~2~<BR>`2000` = sets measurement range to 2000ppm CO~2~<BR>`3000` = sets measurement range to 3000ppm CO~2~<BR>`5000` = sets measurement range to 5000ppm CO~2~<BR>`10000` = sets measurement range to 10000ppm CO~2~
Sensor18<a class="cmnd" id="sensor18"></a>|PMSx003 particle dust sensor<BR>`0..32000` = control sensor polling interval to extend lifetime
Sensor20<a class="cmnd" id="sensor20"></a>|[Nova Fitness SDS011](SDS011) dust sensor.<BR>`1..255` = number of seconds before TelePeriod to poll the sensor
Sensor27<a class="cmnd" id="sensor27"></a>|[APDS-9960](APDS-9960) sensor commands<BR>`0` = enable light level and proximity sensor / disable gestures *(default)* <BR> `1` = enable gesture mode/ disable light level and proximity sensor<BR> `2` = enable gestures with half gain / disable light and proximity sensor<BR>`3..255` = Set [ATIME register](APDS-9960#known-issues) for different integration times
Sensor29<a class="cmnd" id="sensor29"></a>|MCP23008 / MCP23017 I<sup>2</sup>C GPIO Expander configuration.  [Read more...](MCP230xx)<BR>`Reset<x>` = reset all pins<BR>x = `1..6`<BR>`1` = INPUT mode, no reporting, no pull-up<BR>`2` = INPUT mode, report on CHANGE, pull-up enabled<BR>`3` = INPUT mode, report on LOW, pull-up enabled<BR>`4` = INPUT mode, report on HIGH, pull-up enabled<BR>`5` = OUTPUT mode (if enabled by `#define USE_MCP230xx_OUTPUT`)<BR>`6` = inverted OUTPUT mode (if enabled by `#define USE_MCP230xx_OUTPUT`)<BR><BR>`pin,pinmode{,intpullup|outstate{,repmode}}`<br>[Continue reading...](MCP230xx#device-configuration)
Sensor34<a class="cmnd" id="sensor34"></a>|<BR>[HX711 load cell](https://github.com/bogde/HX711) sensor calibration<BR>`1` = reset display to 0<BR>`2` = start calibration<BR>`2` `<value>` = set reference weight in grams and start calibration<BR>`3` = show reference weight in grams<BR>`3` `<value>` = set reference weight in grams<BR>`4` = show calibrated scale value<BR>`4` `<value>` = set calibrated scale value<BR>`5` = show max weight in gram<BR>`5` `<value>` = set max weight in grams<BR>`6` = show single item weight in grams<BR>`6` `<value>` = set single item weight in grams. Once the item weight is set, when items are added to the scale, the telemetry message will report `Count` as the number of items on the scale<BR>`7` = save current weight to be used as start weight on restart<BR>`8` `0/1` <BR>&emsp;`0` = disable JSON message on weight change over 4 grams<BR>&emsp;`1` = enable JSON message on weight change (see below)<BR>`9` `<value>` = set minimum delta to trigger JSON message (see above). <BR>&emsp;`0` = 4 grams (old default)<BR>&emsp;`1..100` = set delta to 0-99 grams<BR>&emsp;`101-255` = set delta to 110-1650 grams (10g increments)
Sensor50<a class="cmnd" id="Sensor50"></a>|[PAJ7620](PAJ7620) gesture sensor<BR>`0` = sensor muted, no readings in Tasmota<BR>`1`= gesture mode<BR>`2` = proximity mode<BR>`3` = corner mode<br>`4` = PIN mode<br>`5` = cursor mode
Sensor52<a class="cmnd" id="sensor52"></a>|iBeacon driver with [HM10](HM-10) or [HM17/HM16](HM-17)<BR>`1` and `2` = required only once to initialize the module  <BR>`u<x>` = sets update interval in seconds (scan tags every <x\> seconds) _(default = 10)_<BR>`t<x>` = set timeout interval in seconds (send RSSI=0 if tag is not detected after <x\> seconds) _(default = 30)_<BR>`d1` = enable debug mode (shows all serial traffic in console)<BR>`d0` = disable debug mode_(default = 30)_<BR>`c` = clears iBeacon list<BR>`s AT+<command>`  = send native AT commands
Sensor53<a class="cmnd" id="sensor53"></a>|[Smart Meter Interface](Smart-Meter-Interface)<BR>`r` = reset the driver with a new descriptor specified with the Tasmota [Scripting](Scripting-Language) language.<BR>`c<x> <value>` = preset counter (x = `1..5`) to `value` when the driver is set to counter mode<BR>`d<x>` = disable data decoding and dump meter (x = `1..5`) data to the Console. This is used to decipher the meter's data format to define the variable encoding in the meter's descriptor.<BR>`d0` = disable data dump mode and revert to decoding mode.
Sensor54<a class="cmnd" id="sensor54"></a>|INA226 Current Sensor<BR> `1` = rescan for devices and return the number found.<BR>`2` = save the configuration and restart<BR>`10` = return channel 1 shunt resistance and full scale current<BR>`11 <resistance>` = set INA226 channel 1 shunt <resistance> in ohms, floating point<BR>`12 <current>` = set INA226 channel 1 full scale <current> in amperes, floating point<BR>`20` = return channel 2 shunt resistance and full scale current<BR>`21 <resistance>` = set INA226 channel 2 shunt <resistance> in ohms, floating point<BR>`22 <current>` = set INA226 channel 2 full scale <current> in amperes, floating point<BR>`30` = return channel 1 shunt resistance and full scale current<BR>`31 <resistance>` = set INA226 channel 1 shunt <resistance> in ohms, floating point<BR>`32 <current>` = set INA226 channel 1 full scale <current> in amperes, floating point<BR>`40` = return channel 1 shunt resistance and full scale current<BR>`41 <resistance>` = set INA226 channel 1 shunt <resistance> in ohms, floating point<BR>`42 <current>` = set INA226 channel 1 full scale <current> in amperes, floating point
Sensor60<a class="cmnd" id="sensor60"></a>|GPS<BR>`0` = write to all available sectors, then restart and overwrite the older ones<BR>`1` = write to all available sectors, then restart and overwrite the older ones<BR>`2` = filter out horizontal drift noise<BR>`3` = turn off noise filter<BR>`4` = start recording, new data will be appended<BR>`5` = start new recording, old data will lost<BR>`6` = stop recording, download link will be visible in webUI<BR>`7` = send mqtt on new postion + TELE _(consider to set TELE to a very high value)_<BR>`8` = only TELE message<BR>`9` = start NTP server<BR>`10` = deactivate NTP server<BR>`11` = force update of Tasmota-system-UTC with every new GPS-time-message<BR>`12` = do not update of Tasmota-system-UTC with every new GPS-time-message<BR>`13` = set latitude and longitude in settings<BR>`14` = open virtual serial port over TCP, usable for u-center<BR>`15` = pause virtual serial port over TCP
Sensor68<a class="cmnd" id="sensor68"></a>|WindMeter sensor - Analog (pulse count) anemometer<BR>`1, <value>` = set radius length in millimeters (measured from centre to the edge of one of the cups) `0..65535` (default = `61`mm)<BR>`2, <value>` = set number of pulses for a complete turn `1..255` (default = `1`)<BR>`3, <value>` = set pulse counter debounce time in milliseconds `1..32000` (default = `10`)<BR>`4, <value>` = set speed compensation factor, a multiplication coefficient to adjust resulting speed `-32.768..32.767` three decimal places (default = `1.180`)<BR>`5, <value>` = set minimum percentage change between current and last reported speed trigger a new tele message `0..100`, `255` = off (default = `255`)
Sensor78<a class="cmnd" id="sensor78"></a>|EZO sensors - commands<BR>Ascii commands are sent directly to the sensor as-is.  See your specific [EZO device datasheet](https://atlas-scientific.com/#) for the list of commands available.<BR>By default, the specific command is sent to all EZO devices that are found.  If using multiple EZO sensors, and the command should be issued to a single device, the index can be specified as part of the command: Sensor78-# where `#` represent the index of the device (ex: Sensor78-1 i).  For more details please see Tasmota's support for [EZO devices](EZO.md).
Sensor80<a class="cmnd" id="sensor80"></a>|Set antenna gain for MFRC522 RFID Reader.<BR>Sensor80 1 <0..7><BR>0 18dB<BR>1 23dB<BR>2 18dB<BR>3 23dB<BR>4 33dB<BR>5 38dB<BR>6 43dB<BR>7 48dB
Sensor90<a class="cmnd" id="sensor90"></a>|Send [commands](https://rainsensors.com/wp-content/uploads/sites/3/2020/07/rg-15_instructions_sw_1.000.pdf) to Hydreon RG-15 Rain Sensor<BR>`A` Reads accumulation data<BR>`R` Read all available data<BR>`K` Restart the rain sensor<BR>`P` Set to polling only mode (not supported)<BR>`C` Set to continuous mode, where data is sent when accumulation changes (default)<BR>`H` Force high resolution<BR>`L` Force low resolution<BR>`I` Force imperial (not supported)<BR>`M` Force metric (default)<BR>`S` Revert to jumper configured values<BR>`O` Reset the accumulation counter
SpeedUnit<a class="cmnd" id="SpeedUnit"></a>|[TX20/TX23](TX2x) and WindMeter anemometer speed unit<BR>`1` = m/s<BR>`2`= km/h<BR>`3` = kn<br>`4` = mph<BR>`5` = ft/s<BR>`6` = yd/s
TempRes<a class="cmnd" id="tempres"></a>|Temperature sensor resolution<BR>`0..3` = maximum number of decimal places
TempOffset<a class="cmnd" id="tempoffset"></a>|`-12.6..12.6` = Set calibraton offset value for reported temperature telemetry<BR>This setting affects **all** temperature sensors on the device.
VoltRes<a class="cmnd" id="sensors-voltres"></a>|Voltage sensor resolution<BR>`0..3` = maximum number of decimal places
WattRes<a class="cmnd" id="sensors-wattres"></a>|Power sensor resolution<BR>`0..3` = maximum number of decimal places
WeightRes<a class="cmnd" id="weightres"></a>|Load cell sensor resolution<BR>`0..3` = maximum number of decimal places
See also|[`SetOption8`](#setoption8)  - Show temperature in Celsius *(default)* or Fahrenheit<BR>[`SetOption18`](#setoption18) - Set status of signal light paired with CO~2~ sensor<BR>[`SetOption24`](#setoption24) - Set pressure units

### Power Monitoring

Command|Parameters
:---|:---
AmpRes<a class="cmnd" id="ampres"></a>|Current sensor resolution<BR>`0..3` = maximum number of decimal places
CurrentCal<a class="cmnd" id="currentcal"></a>|<value> `1000..32000` *(default = `3500`)*<BR>Set calibration offset value for reported `Current` telemetry<BR>Allows finer calibration for energy monitoring devices
CurrentHigh<a class="cmnd" id="currenthigh"></a>|`0` = disable current high threshold *(default)*<BR>`<value>` = set current high threshold value in milliamps
CurrentLow<a class="cmnd" id="currentlow"></a>|`0` = disable current low threshold *(default)*<BR>`<value>` = set current low threshold value in milliamps
CurrentSet<a class="cmnd" id="currentset"></a>|`<value>` = [calibrate](Power-Monitoring-Calibration) current to target value in mA
EnergyExport<x\><a class="cmnd" id="energyexport"></a>|Export energy values<BR>
EnergyToday<x\><a class="cmnd" id="energytoday"></a>|Reset Energy Today values<BR>`0` = reset<BR>`<value>` = set value<BR>`<time>` = `0..4294967295` set StartTotalTime time as epoch value (optional 2nd parameter)
EnergyTotal<x\><a class="cmnd" id="energytotal"></a>|Reset Energy Total values<BR>`0` = reset<BR>`<value>` = set value<BR>`<time>` = `0..4294967295` set StartTotalTime time as epoch value (optional 2nd parameter)<BR>The new value represents start of day, and output for total includes the today value.
EnergyReset&#60;x><a class="cmnd" id="energyreset"></a>|x = `1..5`<BR>`1` `<value>{,<time>}` = ((p)re)set values<BR>`2` `<value>{,<time>}` = ((p)re)set values for Yesterday<BR>`3` `<value>{,<time>}` = ((p)re)set values for Total<BR>`<value>` = `0..42949672` in watt-hours (Wh)<BR>`<time>` = `0..4294967295` set StartTotalTime time as epoch value<BR>`4` `<standard>`{,`<off-peak>`} = ((p)re)set tariff period values for Totals<BR>`5` `<standard>`{,`<off-peak>`} = ((p)re)set tariff period values for Exported<BR>With version 10, this command has been replaced, see above.
EnergyRes<a class="cmnd" id="energyres"></a>|Energy sensor resolution<BR>`0..5` = maximum number of decimal places
EnergyYesterday<x\><a class="cmnd" id="energyyesterday"></a>|Reset Energy Yesterday values<BR>`0` = reset<BR>`<value>` = set value<BR>`<time>` = `0..4294967295` set StartTotalTime time as epoch value (optional 2nd parameter)
EnergyUsage<a class="cmnd" id="energyusage"></a>|Reset energy usage values<BR>`0` = reset<BR>`<value>` = set energy usage value
FreqRes<a class="cmnd" id="freqres"></a>|Frequency sensor resolution<BR>`0..3` = maximum number of decimal places
FrequencySet<a class="cmnd" id="frequencyset"></a>|`<value>` = [calibrate](Power-Monitoring-Calibration) frequency to a target value in Hz
MaxPower<a class="cmnd" id="maxpower"></a>|`0` = disable use maximum power monitoring<BR>`<value>` = set maximum allowed power in watts
MaxPowerHold<a class="cmnd" id="maxpowerhold"></a>|`1` = set default time to 10 seconds to stay over MaxPower before power off<BR>`<value>` = set time in seconds to stay over MaxPower before power off
MaxPowerWindow<a class="cmnd" id="maxpowerwindow"></a>|`1` = set default time to 30 seconds to stay power off before re-applying power up to 5 times<BR>`<value>` = set time in seconds to stay power off before re-applying power up to 5 times
ModuleAddress<a class="cmnd" id="moduleaddress"></a>|Set the address of a PZEM module<BR>`1..3` = the last octet of the PZEM-004T serial address<BR>`<address>` = the last octet of the address on MODBUS PZEM energy monitoring modules<BR>Prior to setting the module address, the PZEM **_must be connected_** to **both** RX and TX, **and** AC voltage.<BR>Connect one PZEM at a time and issue this command. Repeat for each PZEM to be connected for multi-phase monitoring.<BR>_The command without an argument cannot be used to read the address of the connected PZEM._
PowerCal<a class="cmnd" id="powercal"></a>|<value> `1000..32000` *(default = `12530`)*<BR>Set calibration offset value for reported `Power` telemetry reading<BR>Allows finer calibration for energy monitoring devices
PowerDelta&#60;x><a class="cmnd" id="powerdelta"></a>|Set maximum delta of phase a&#60;x> in energy monitoring devices to report on active power load change while the power is ON. `PowerDelta` will not report when the power turns off.&emsp; <BR>`0` = disable reporting on power change<BR>`1..100` = set reporting on percentage power change to send an MQTT telemetry message<BR>`101..32000` = set reporting on absolute power change to send an MQTT telemetry message (offset by 100, e.g., `101`=1W, `207`=107W)
PowerHigh<a class="cmnd" id="powerhigh"></a>|`0` = disable power high threshold *(default)*<BR>`<value>` = set power high threshold value in watts to send an MQTT telemetry message
PowerLow<a class="cmnd" id="powerlow"></a>|`0` = disable power low threshold *(default)*<BR>`<value>` = set power low threshold value in watts to send an MQTT telemetry message
PowerSet<a class="cmnd" id="powerset"></a>|`<value>` = [calibrate](Power-Monitoring-Calibration) power to a target value in watts&emsp;
Status<a class="cmnd" id="powermon-status"></a>|`8` = show power usage<BR>`9` = show power thresholds
Tariff&#60;x><a class="cmnd" id="tariff"></a>|P1 Smart Meter tariff configuration<BR>x = `1, 2, 9`<BR>`1` `STD,DST` Start times for off-peak tariff<BR>`2` `STD,DST` End times for off-peak tariff<BR>`9` `0/1`<BR>&emsp;`0` = use Start/End times also on weekends.<BR>&emsp;`1` = use off-peak tariff all weekend.<BR>`STD` and `DST` may be specified as:<BR>&emsp;`<hour>` = `0..23` or<BR>&emsp;`<time>` = `00:00..23:59` or<BR>&emsp;`<minutes>` = `0..1439` (since midnight)<BR>If both `Tariff1` STD and `Tariff2` STD are equal, all tariffs are disabled.
VoltageCal<a class="cmnd" id="voltagecal"></a>|Set calibration offset value for reported `Voltage` telemetry reading<BR><value> `1000..32000` *(default = `1950`)*<BR>Allows finer calibration for energy monitoring devices
VoltageHigh<a class="cmnd" id="voltagehigh"></a>|`0` = disable voltage high threshold *(default)*<BR>`<value>` = set voltage high threshold value in V
VoltageLow<a class="cmnd" id="voltagelow"></a>|`0` = disable voltage low threshold *(default)*<BR>`<value>` = set voltage low threshold value in V
VoltageSet<a class="cmnd" id="voltageset"></a>|`<value>` = [calibrate](Power-Monitoring-Calibration) voltage to a target value in V&emsp;
VoltRes<a class="cmnd" id="voltres"></a>|Voltage sensor resolution<BR>`0..3` = maximum number of decimal places
WattRes<a class="cmnd" id="wattres"></a>|Power sensor resolution<BR>`0..3` = maximum number of decimal places
See Also|[`SetOption21`](#setoption21) - Energy monitoring when power is off<BR>[`SetOption33`](#setoption33) - Configure power monitoring Max_Power_Retry count number<BR>[`SetOption39`](#setoption39) - Control handling of invalid power measurements<BR>[`SetOption72`](#setoption72) - Set reference used for total energy

### Light

Command|Parameters
:---|:---
AlexaCTRange<a class="cmnd" id="alexactrange"></a><BR>SetOption82<a class="cmnd" id="setoption82"></a>|Reduce the CT range from `153..500` to `200..380` to accomodate with Alexa range<BR>`0` = CT ranges from 153 to 500 *(default)*<BR>`1` = CT ranges from 200 to 380 (although you can still set in from 153 to 500)
Channel<x\><a class="cmnd" id="channel"></a>|`0..100` = set PWM channel dimmer value from 0 to 100%&emsp; <BR>`+` = increase by 10<BR>`-` = decrease by 10<BR>When [`SetOption68`](#setoption68) is set to `1` `Channel<x>` will follow `Power<x>` numbering with Relays first then PWM.<BR>**Example**:<br>2 Relays and 3 PWM: Relay1 = `Power1`; Relay2 = `Power2`; PWM1 = `Power3` and `Channel3`; PWM2 = `Power4` and `Channel4`; PWM3 = `Power5` and `Channel5`
ChannelRemap<a class="cmnd" id="channelremap"></a><BR>SetOption37<a class="cmnd" id="setoption37"></a>|Color remapping for led channels, also provides an option for allowing independent handling of RGB and white channels. Setting changes require a device reboot.<BR>`0` = disable<br>`1..119` = according to [this table](SetOption37)<br>`120..127` = invalid (results in same as `0`)<br>`128..255` = same as `0..127` but with independent channel handling enabled
Color<x\><a class="cmnd" id="color"></a>|x = `1..6`<BR>&emsp; `1` = Set color<BR>&emsp; `2` = Set color adjusted to current `Dimmer` value<BR>&emsp; `3` = Set clock seconds hand color *([Scheme](#scheme) `5` only)*<BR>&emsp; `4` = Set clock minutes hand color *([Scheme](#scheme) `5` only)*<BR>&emsp; `5` = Set clock hour hand color *([Scheme](#scheme) `5` only)*<BR>&emsp; `6` = Set clock hour marker color<BR>`<value>`<BR>`r,g,b` = set color by decimal value (`0..255`)<BR>`#CWWW` = set hex color value for CT lights <BR>`#RRGGBB` = set hex color value for RGB lights<BR>`#RRGGBBWW` = set hex color value for RGBW lights<BR>`#RRGGBBCWWW` = set hex color value for RGBCCT lights (5 PWM channels)<BR>**Note**:<br>Just append an `=` instead of the remaining color codes, this way they wont get changed. For example a command like `Color #00ff=` would update the RGB part to disable red and enable geen, but would omit to update blue or any white channel.
 |Set color to<BR>`1` = red<BR>`2` = green<BR>`3` = blue<BR>`4` = orange<BR>`5` = light green<BR>`6` = light blue<BR>`7` = amber<BR>`8` = cyan<BR>`9` = purple<BR>`10` = yellow<BR>`11` = pink<BR>`12` = white (using RGB channels)<BR>`+` = next color<BR>`-` = previous color
CT<a class="cmnd" id="ct"></a>|`153..500` = set color temperature from 153 (cold) to 500 (warm) for CT lights<BR>`+` = increase CT value by 10<BR>`-` = decrease CT value by 10
CTRange<a class="cmnd" id="ctrange"></a>|Specify CT range of the bulb. The slider will still allow to set CT from 153 to 500, but the rendering will be done within the new range.<BR>`<ct_min>,<ct_max>` = set color temperature from 153 (cold) to 500 (warm) for CT lights _default = `153,500`_<BR>**This settings is not persisted in flash**
Dimmer<a class="cmnd" id="dimmer"></a>|`0..100` = set dimmer value from 0 to 100%<BR>`+` = increase by `DimmerStep` value *(default =`10`)*<BR>`-` = decrease by `DimmerStep` value *(default =`10`)*<BR>*Use of these parameters with `Fade` on enables dimmer level "move down," "move up," and "stop" commands* ([#11269](https://github.com/arendst/Tasmota/pull/11269))<BR>`<` = decrease to 1<BR>`>` = increase to 100<BR>`!` = stop any dimmer fade in progress at current dimmer level
Dimmer&#60;x>|**Commands available only when `SetOption37 >= 128`** ([#6819](https://github.com/arendst/Tasmota/pull/6819))<br>`<value>` same as in `Dimmer`<br>`Dimmer0 <value>` = set dimming for all channels<BR>`Dimmer1 <value>` = set dimming for RGB channels<BR>`Dimmer2 <value>` = set dimming for white channels<BR>`Dimmer4 <value>` = allow retaining brightness ratio between white and color channels when setting dimmer for linked lights
DimmerRange<a class="cmnd" id="dimmerrange"></a>|Change dimming range. <br>`<dimmerMin>,<dimmerMax>` = set the internal dimming range from minimum to maximum value (0..255, 0..255)<BR>***Does not change [`Dimmer`](#dimmer) command behavior***
DimmerStep<a class="cmnd" id="dimmerstep"></a>|`1..50` - set `Dimmer +/-` step value. *(default =`10`)*
Fade<a class="cmnd" id="fade"></a>|`0` = do not use fade *(default)* <BR>`1` = use fade<BR>See also [`SetOption91`](#setoption91)
HsbColor<a class="cmnd" id="hsbcolor"></a>|`<hue>,<sat>,<bri>` = set color by hue, saturation and brightness
HsbColor1<a class="cmnd" id="HsbColor1"></a>|`0..360` = set hue
HsbColor2<a class="cmnd" id="HsbColor2"></a>|`0..100` = set saturation
HsbColor3<a class="cmnd" id="HsbColor3"></a>|`0..100` = set brightness
L1MusicSync<a class="cmnd" id="l1musicsync"></a>|_Only for Sonoff L1 (Lite) and Spider Z LED controllers_<BR>`<power,sensitivity,speed>`<BR> &emsp; `power` = `0` - off, `1` - on, `2` - toggle<BR> &emsp; `sensitivity` = `1..10` (_default: `5`_)<BR> &emsp; `speed` = `1..100`  (_default: `50`_)<br>Can be used with only `power` argument
Led<x\><a class="cmnd" id="led"></a>|`#RRGGBB` = set hex color value where `<x>` is the pixel number of the LED. A blank-delimited list of colors sets multiple successive pixels.<br> *(applies only to addressable LEDs)*
LedPwmMode<x\><a class="cmnd" id="ledpwmmode"></a>|Control status LED light mode (x = `0..4`)<br>`0` = digital on/off mode _(default)_<BR>`1` = PWM mode<BR>`2` = toggle between modes
LedPwmOff<a class="cmnd" id="ledpwmoff"></a>|`0..255` = set LED brightness when OFF
LedPwmOn<a class="cmnd" id="ledpwmon"></a>|`0..255` = set LED brightness when ON
LedTable<a class="cmnd" id="ledtable"></a>|`0` = do not use [LED gamma correction](https://learn.adafruit.com/led-tricks-gamma-correction?view=all) *(default &laquo;6.5.0.9)*<BR>`1` = use gamma correction *(default &raquo;6.5.0.9)*
MultiPwm<a class="cmnd" id="multipwm"></a><BR>SetOption68<a class="cmnd" id="setoption68"></a>|Multi-channel PWM instead of a single light<BR>`0` = Treat [PWM](#pwm) as a single light *(default)*<BR>`1` = Treat [PWM](#pwm) as separate channels. In this mode, use [`Power<x>`](#power) to turn lights on and off, and [`Channel<x>`](#channel) to change the value of each channel.<BR>[`Color`](#color) still works to set all channels at once.<BR>***Requires restart after change***
Palette<a class="cmnd" id="palette"></a>| `0` = Clear color palette<br>`[ ...]` = Set list of colors used by `Color<1,2>` and `Scheme<2,3,4>` commands with each color separated by a space. The palette setting is not saved to flash. Use a boot-time rule such as ON System#Boot DO Palette xxxxx ENDON to set it back at each restart.
Pixels<a class="cmnd" id="pixels"></a>|`1..512` = set amount of pixels in strip or ring and reset [`Rotation`](#rotation) *(applies only to addressable LEDs)*
PowerOnFade<a class="cmnd" id="poweronfade"></a><BR>SetOption91<a class="cmnd" id="setoption91"></a>|Enable `Fade` at boot and power on. By default fading is not enabled at boot because of stuttering caused by wi-fi connection<BR>`0` = don't Fade at startup _(default)_ <BR>`1` = Fade at startup
PWMCT<a class="cmnd" id="pwmct"></a><BR>SetOption92<a class="cmnd" id="setoption92"></a>|Alternative to `Module 38`: for Cold/Warm white bulbs, enable the second PWM as CT (Color Temp) instead of Warm White, as required for Philips-Xiaomi bulbs.<BR>`0` = normal Cold/Warm PWM _(default)_ <BR>`1` = Brightness/CT PWM<BR>See [PWM CT in Lights](Lights.md#pwm-ct)
RGBWWTable<a class="cmnd" id="rgbwwtable"></a>|Control lightintensity of unbalanced PWM channels<br>`PWM1,PWM2,PWM3,PWM4,PWM5` = channel range with values `0..255` *(default =`255,255,255,255,255`)*<BR>Range adjustment is computed **after** Gamma correction.
Rotation<a class="cmnd" id="rotation"></a>|`<value>` = set amount of pixels to rotate (up to `Pixels` value) *(applies only to addressable LEDs)*
Scheme<a class="cmnd" id="scheme"></a>|Light effects<BR>`+` = next scheme<BR>`-` = previous scheme<BR>`0` = single color for LED light *(default)*<BR>`1` = start wake up sequence (same as [`Wakeup`](#wakeup))<BR>`2` = cycle up through colors using Speed option<BR>`3` = cycle down through colors using Speed option<BR>`4` = random cycle through colors using Speed and Fade<BR>Use `<value>, <startcolor>` if you want to set the starting color of selected scheme
|**Following schemes are usable only with addressable LEDs, e.g. WS281X, Neopixel**<BR>`5` = clock mode ([example](https://hackaday.io/project/28194-esp-and-ws2812-based-clock))<BR>`6` = candlelight pattern<BR>`7` = RGB pattern<BR>`8` = Christmas pattern<BR>`9` = Hanukkah pattern<BR>`10` = Kwanzaa pattern<BR>`11` = rainbow pattern<BR>`12` = fire pattern
Speed<a class="cmnd" id="speed"></a>|`1..40` = set fade speed from fast `1` to very slow `40`<BR>`+` = increase speed<BR>`-` = decrease speed<BR>The `Speed` value represents the time in 0.5s to fade from 0 to 100% (or the reverse). Example: `Speed 4` takes 2.0s to fade from full brightness to black, or 0.5s to move from 75% to 100%.
Speed2<a class="cmnd" id="speed2"></a>|Same as `Speed` but settings aren't stored.
VirtualCT<a class="cmnd" id="virtualct"></a>|Precisely specify color rendering of the bulb for Color Temperature. Needs `SetOption106 1` and works for 3, 4 or 5 channel lights<BR>`{"<minct>":"<color1>","midct":"<color2>","maxct":"<color3"}`<BR>Example: `VirtualCT {"200":"FFFFFF0000","400":"000000FF00"}`<BR>The first and last CT values indicate the min and max CT and are equivalent to `CTRange`. [Read more...](https://github.com/arendst/Tasmota/pull/10311)<BR>**This settings is not persisted in flash**
Wakeup<a class="cmnd" id="wakeup"></a>|Start wake up sequence from OFF to stored `Dimmer` value<BR>`0..100` = Start wake up sequence from OFF to provided `Dimmer` value
WakeupDuration<a class="cmnd" id="wakeupduration"></a>|`1..3000` = set wake up duration in seconds
White<a class="cmnd" id="white"></a>|`1..100` = set white channel brightness in single white channel lights (single W or RGBW lights)
WhiteBlend<a class="cmnd" id="whiteblend"></a><BR>SetOption105<a class="cmnd" id="setoption105"></a>|[White Blend Mode](Lights#white-blend-mode)<BR>`0` = disable _(default)_ <BR>`1` = enable
Width&#60;x><a class="cmnd" id="width"></a>|x = `1..4`<BR>`1` = `0..4` = LED group width *([Scheme](#scheme) `6..12` only)*<BR>`2` = `0..32` = seconds hand width *([Scheme](#scheme) `5` only)*<BR>`3` = `0..32` = minutes hand width *([Scheme](#scheme) `5` only)*<BR>`4` = `0..32` = hour hand width *([Scheme](#scheme) `5` only)*
See also|[`SetOption15`](#setoption15), [`SetOption16`](#setoption16), [`SetOption17`](#setoption17), [`SetOption20`](#setoption20), [`SetOption37`](#setoption37) and [`SetOption68`](#setoption68)

### Device Groups

Command|Parameters
:---|:---
DevGroupName<x\><a class="cmnd" id="devgroupname"></a>|`0` = clear device group <x\> name and restart<br>`<value>` = set device group <x\> name and restart.<br>Prior to 8.2.0.3, `GroupTopic` was used to specify the device group name.
DevGroupSend<x\><a class="cmnd" id="devgroupsend"></a>|`<item>`=`<value>[ ...]` = send an update to device group <x\>. The device group name must have been previously set with DevGroupName<x\>. Multiple item/value pairs can be specified separated by a space. Spaces in `<value>` must be escaped with a backslash (\\). The message sent is also processed on the local device as if it had been received from the network.<br><br>For items with numeric values, `<value>` can be specified as @<operator\>[<operand\>] to send a value after performing an operation on the current value. <operator\> can be + (add), - (subtract) or ^ (invert). If <operand\> is not specified, it defaults to 0xffffffff for the invert operator and 1 for other operators.<br><br>Examples:<br>`DevGroupSend 4=90 128=1` - send an update to set the light brightness to 90 and turn relay 1 on.<br>`DevGroupSend 193=Buzzer\\ 2,3` - send the Buzzer 2,3 command.<br>`DevGroupSend 6=@+ 4=@-10` - set the next fixed color and decrease the brightness by 10.<br>`DevGroupSend 128=^` - toggle all the relays.<br><br>`2` = Light fade (0 = Off, 1 = On)<br>`3` = Light speed (1..40)<br>`4` = Light brightness (0..255)<br>`5` = Light [`Scheme`](#scheme)<br>`6` = Light fixed color (0 = white (using CT channels), other values according to [`Color`](#color)</a>)<br>`7` = PWM dimmer low preset (0..255)<br>`8` = PWM dimmer high preset (0..255)<br>`9` = PWM dimmer power-on brightness (0..255)<br>`128` = Relay Power - bitmask with bits set for relays to be powered on. The number of relays can be specified in bits 24 - 31. If the number of relays is not specified, only relay 1 is set<br>`192` = Event - event name and arguments<br>`193` = Command - command and arguments<br>`224` = Light channels - comma separated list of brightness levels (0..255) for channels 1 - 5 (e.g. 255,128,0,0,0  will turn the red channel on at 100% and the green channel on at 50% on an RBG light)
DevGroupShare<a class="cmnd" id="devgroupshare"></a>|`<in>,<out>` = set incoming and outgoing shared items _(default = `0xffffffff,0xffffffff`)_<BR> <in\> and <out\> are bit masks where each mask is the sum of the values for the categories (listed below) to be shared. For example, to receive only power (1), light brightness (2) and light color (16) and send only power (1), enter the command DevGroupShare 19,1.<br><br>`1` = Power<br>`2` = Light brightness<br>`4` = Light fade/speed<br>`8` = Light scheme<br>`16` = Light color<br>`32` = Dimmer settings (presets)<br>`64` = Event
DevGroupStatus<x\><a class="cmnd" id="devgroupstatus"></a>|Show the status of device group <x\> including a list of the currently known members.

### SetOptions

!!! tip
    Instead of typing `SetOption` you can use shorter form of `SO`. so instead of `SetOption19 1` you can use `SO19 1`

Command|Parameters
:---:|:---
SetOption0<a class="cmnd" id="setoption0"></a>|Save power state and use after restart (=SaveState)<BR> `0` = disable (see note below)<BR> `1` = enable *(default)*<BR>Note: Power state means on/off state of eg. relays, lights, but other parameters like color, color temperature, brightness, dimmer, etc. are still saved when changed. To disable saving other parameters see [`SaveData`](#savedata).
SetOption1<a class="cmnd" id="setoption1"></a>|Set [button multipress](Buttons-and-Switches#multi-press-functions) mode to<BR> `0` = allow all button actions *(default)*<BR> `1` = restrict to single to penta press and hold actions (i.e., disable inadvertent reset due to long press)
SetOption2<a class="cmnd" id="setoption2"></a>|Set display of global temperature/humidity/pressure info to JSON sensor message<BR> `0` = disable *(default)*<BR> `1` = enable 
SetOption3<a class="cmnd" id="setoption3"></a>|[MQTT](MQTT) <BR>`0` = disable MQTT<BR> `1` = enable MQTT *(default)*
SetOption4<a class="cmnd" id="setoption4"></a>|Return MQTT response as<BR> `0` = RESULT topic *(default)*<BR> `1` = %COMMAND% topic
SetOption8<a class="cmnd" id="setoption8"></a>|Show temperature in<BR> `0`= Celsius *(default)*<BR> `1` = Fahrenheit
SetOption10<a class="cmnd" id="setoption10"></a>|When the device MQTT topic changes <BR> `0` = remove retained message on old topic LWT *(default)*<BR> `1` = send "Offline" to old topic LWT
SetOption11<a class="cmnd" id="setoption11"></a>|Swap button single and double press [functionality](Buttons-and-Switches#changing-default-functionality)<BR> `0` = disable *(default)*<BR> `1` = enable
SetOption12<a class="cmnd" id="setoption12"></a>|Configuration saving to flash option<BR>`0` = allow dynamic flash save slot rotation *(default)*<BR>`1` = use fixed eeprom flash slot
SetOption13<a class="cmnd" id="setoption13"></a>|Allow immediate action on single button press<BR>`0` = single, multi-press and hold button actions *(default)*<BR> `1` = only single press action for immediate response (i.e., disable multipress detection). Disable by holding for 4 x button hold time (see [`SetOption32`](#setoption32)).
SetOption15<a class="cmnd" id="setoption15"></a>|Set PWM control for LED lights<BR>`0` = basic PWM control<BR>`1` = control with [`Color`](#color) or [`Dimmer`](#dimmer) commands _(default)_
SetOption16<a class="cmnd" id="setoption16"></a>|Set addressable LED Clock scheme parameter<BR> `0` = clock-wise mode *(default)*<BR> `1` = counter-clock-wise mode
SetOption17<a class="cmnd" id="setoption17"></a>|Show [`Color`](#color) string as<BR> `0` = hex string *(default)*<BR> `1` = comma-separated decimal string
SetOption18<a class="cmnd" id="setoption18"></a>|Set status of signal light paired with [CO~2~ sensor](#sensor14)<BR> `0` = disable light *(default)*<BR>`1` = enable light<BR>The light will be green below `CO2_LOW` and red above `CO2_HIGH` (transition yellow/orange between).  The default levels are: 800ppm for low and 1200ppm for high but these can be set in `user_config_override.h`.
SetOption19<a class="cmnd" id="setoption19"></a>|Set [Home Assistant](Home-Assistant.md) discovery protocol.<BR> `0` = use Tasmota integration *(default)*<BR> `1` = use MQTT discovery
SetOption20<a class="cmnd" id="setoption20"></a>|Update of Dimmer/Color/CT without turning power on<BR>`0` = disable *(default)*<BR>`1` = enable
SetOption21<a class="cmnd" id="setoption21"></a>|Energy monitoring when power is off<BR>`0` = disable *(default)*<BR>`1` = enable
SetOption24<a class="cmnd" id="setoption24"></a>|Set pressure units <BR> `0` = hPa *(default)*<BR> `1` = mmHg
SetOption26<a class="cmnd" id="setoption26"></a>|Use indexes even when only one relay is present<BR> `0` = messages use POWER *(default)*<BR> `1` = messages use POWER1
SetOption28<a class="cmnd" id="setoption28"></a>|RF received data format<BR> `0` = hex *(default)*<BR> `1` = decimal
SetOption29<a class="cmnd" id="setoption29"></a>|IR received data format<BR> `0` = hex *(default)*<BR> `1` = decimal
SetOption30<a class="cmnd" id="setoption30"></a>|Enforce Home Assistant auto-discovery as light<BR> `0` = relays are announced as a switch and PWM as a light *(default)*<BR> `1` = both relays and PWM are announced as light
SetOption31<a class="cmnd" id="setoption31"></a>|Set status LED  blinking during Wi-Fi and MQTT connection problems.<br> _[`LedPower`](#ledpower) must be set to `0` for this feature to work_<BR>`0` = Enabled *(default)*<BR> `1` = Disabled
SetOption32<a class="cmnd" id="setoption32"></a>|Number of 0.1 seconds to hold button before sending `HOLD` action message.<BR> `1..100` to set button hold time *(default = `40`)*. This option also affects the time required to perform a firmware defaults reset (10x `HOLD` action time)
SetOption33<a class="cmnd" id="setoption33"></a>|Number of seconds for which the maximum power limit can be exceeded before the power is turned off<BR> `1..250` = set number of seconds *(default = `5`)*
SetOption34<a class="cmnd" id="setoption34"></a>|`0..255` = set [Backlog](#backlog) inter-command delay in milliseconds *(default = `200`)*
SetOption36<a class="cmnd" id="setoption36"></a>|Boot loop defaults restoration control.<BR>`0` = disable boot loop control<BR> `1..200` = set number of boot loops (a restart caused by any exception or watchdog timer within less than `BOOT_LOOP_TIME` (default 10 seconds) before beginning to restore settings  *(default = `1`)*. Once this number is reached, subsequent restarts will:<ul><li>1<sup>st</sup> restart: disable ESP8285 generic GPIOs interfering with flash SPI</li><li>2<sup>nd</sup> restart: disable rules causing boot loop</li><li>3<sup>rd</sup> restart: disable all rules (and [`autoexec.bat`](UFS#autoexecbat))</li><li>4<sup>th</sup> restart: reset user defined GPIOs to disable any attached peripherals</li><li>5<sup>th</sup> restart: reset module to Sonoff Basic (1)</li></ul>
SetOption38<a class="cmnd" id="setoption38"></a>|`6..255 ` = set IRReceive protocol detection sensitivity minimizing UNKNOWN protocols
SetOption39<a class="cmnd" id="setoption39"></a>|Control handling of invalid power measurements. [Read more...](Power-Monitoring-Calibration#known-issues)<BR>`0` = reset to default on next restart<BR>`1..255` = number of invalid power readings before reporting no load *(default =`128`)*.
SetOption40<a class="cmnd" id="setoption40"></a>|Stop detecting input change on the button GPIO. Solves [#5449](https://github.com/arendst/Tasmota/issues/5449)<br>Active only when [`SetOption1 1`](#setoption1) and [`SetOption13 0`](#setoption13). **This disables all long press functionality.**<BR>`0..250` = button hold time in 0.1 seconds after which button functionality is disabled.*(default =`1`)* <BR>Example: `Backlog SetOption1 1; SetOption13 0; SetOption40 10` = discard any button press over 1 second
SetOption41<a class="cmnd" id="setoption41"></a>|`0` = Disable ARP *(default)* <BR>`<x>` = Force sending gratuitous ARP (Wi-Fi keep alive) every `<x>` seconds *(default = `0`)*<BR>If `<x>` is below `100` it is the number of seconds, if `<x>` is above `100`, it is the number of minutes after substracting 100. Ex: `105` is every 5 minutes, while `90` is every 90 seconds.
SetOption42<a class="cmnd" id="setoption42"></a>|`0..255` = set over-temperature (Celsius only) threshold resulting in power off on all energy monitoring devices *(default = `90`)*
SetOption43<a class="cmnd" id="setoption43"></a>|`0..255` = to control Rotary step. Details [#10407](https://github.com/arendst/Tasmota/issues/10407)
SetOption51<a class="cmnd" id="setoption51"></a>|Enable GPIO9 and GPIO10 component selections in Module Configuration<BR>:rotating_light: **WARNING** Do not use on ESP8266 devices! :rotating_light:<BR>`0` = disable *(default)*<BR>`1` = enable
SetOption52<a class="cmnd" id="setoption52"></a>|Control display of optional time offset from UTC in JSON payloads<BR>`0` = disable *(default)*<BR> `1` = enable
SetOption53<a class="cmnd" id="setoption53"></a>|Display hostname and IP address in GUI<BR>`0` = disable *(default)*<BR> `1` = enable
SetOption54<a class="cmnd" id="setoption54"></a>|Apply [`SetOption20`](#setoption20) settings to commands from Tuya device<BR>`0` = disable *(default)*<BR> `1` = enable
SetOption55<a class="cmnd" id="setoption55"></a>|mDNS service<BR>`0` = disable *(default)* <BR> `1` = enable
SetOption56<a class="cmnd" id="setoption56"></a>|Wi-Fi network scan to select strongest signal on restart (network has to be visible)<BR>`0` = disable *(default)*<BR> `1` = enable
SetOption57<a class="cmnd" id="setoption57"></a>|Wi-Fi network re-scan every 44 minutes with alternate to +10dB stronger signal if detected (only visible networks)<BR>`0` = disable<BR> `1` = enable *(default)*
SetOption58<a class="cmnd" id="setoption58"></a>|[IR Raw data in JSON payload](https://github.com/arendst/Tasmota/issues/2116#issuecomment-440716483)<BR>`0` = disable *(default)*<BR> `1` = enable
SetOption59<a class="cmnd" id="setoption59"></a>|Send `tele/%topic%/STATE` in addition to `stat/%topic%/RESULT` for commands: [`State`](#state), [`Power`](#power) and any command causing a light to be turned on.<BR>`0` = disable *(default)*<BR> `1` = enable
SetOption60<a class="cmnd" id="setoption60"></a>|Set sleep mode<BR> `0` = [dynamic sleep](Dynamic-Sleep) *(default)*<BR> `1` = normal sleep
SetOption61<a class="cmnd" id="setoption61"></a>|Force [local operation](https://github.com/arendst/Tasmota/pull/4562#issuecomment-446230001) when [`ButtonTopic`](#buttontopic) or [`SwitchTopic`](#switchtopic) is set.<BR>`0` = disable *(default)*<BR> `1` = enable
SetOption62<a class="cmnd" id="setoption62"></a>|Set retain on Button or Switch hold messages<BR>`0` = disable *(default)*<BR> `1` = don't use retain flag on `HOLD` messages
SetOption63<a class="cmnd" id="setoption63"></a>|Set relay state feedback scan at restart ([#5594](https://github.com/arendst/Tasmota/issues/5594), [#5663](https://github.com/arendst/Tasmota/issues/5663))<BR>`0` = Scan power state at restart *(default)*<BR> `1` = Disable power state scanning at restart
SetOption64<a class="cmnd" id="setoption64"></a>|Switch between `-` or `_` as sensor name separator<BR>`0` = sensor name index separator is `-` _(hyphen)_ *(default)*<BR> `1` = sensor name index separator is `_` _(underscore)_<br>*Affects DS18X20, DHT, BMP and SHT3X sensor names in tele messages*
SetOption65<a class="cmnd" id="setoption65"></a>|Device recovery using [fast power cycle detection](Device-Recovery.md#fast-power-cycle-device-recovery)<BR>`0` = enabled *(default)*<BR>`1` = disabled
SetOption66<a class="cmnd" id="setoption66"></a>|Set publishing TuyaReceived to MQTT<BR>`0` = disable publishing `TuyaReceived` over MQTT *(default)*<BR>`1` = enable publishing `TuyaReceived` over MQTT
SetOption69<a class="cmnd" id="setoption69"></a>|**Deprecated** in favor of [DimmerRange](#dimmerrange) <br>By default Tuya dimmers won't dim below 10% because some don't function very well that way.<BR>`0` = disable Tuya dimmer 10% lower limit<BR>`1` = enable Tuya dimmer 10% lower limit *(default)*
SetOption71<a class="cmnd" id="setoption71"></a>|Set DDS238 Modbus register for active energy<BR>`0` = set primary register *(default)*<BR>`1` = set alternate register
SetOption72<a class="cmnd" id="setoption72"></a>|Set reference used for total energy <BR>`0` = use firmware counter *(default)*<BR>`1` = use energy monitor (e.g., PZEM-0xx, SDM120, SDM630, DDS238, DDSU666) hardware counter
SetOption73<a class="cmnd" id="setoption73"></a>|Detach buttons from relays and send multi-press and hold MQTT messages instead<BR>`0` = disable *(default)*<BR>`1` = enable <BR>Example message: `{"Button1":{"Action":"SINGLE"}}`
SetOption74<a class="cmnd" id="setoption74"></a>|Enable internal pullup for single DS18x20 sensor <BR>`0` = disable *(default)*<BR>`1` = internal pullup enabled
SetOption75<a class="cmnd" id="setoption75"></a>|Set grouptopic behaviour ([#6779](https://github.com/arendst/Tasmota/issues/6779))<BR>`0` = GroupTopic using FullTopic replacing %topic% _(default)_<BR>`1` =  GroupTopic is `cmnd/%grouptopic%/`
SetOption76<a class="cmnd" id="setoption76"></a>|Bootcount incrementing when [DeepSleep](DeepSleep) is enabled ([#6930](https://github.com/arendst/Tasmota/issues/6930))<BR>`0` = disable bootcount incrementing _(default)_<BR>`1` = enable bootcount incrementing
SetOption77<a class="cmnd" id="setoption77"></a>|Do not power off if a slider is moved to far left<BR>`0` = disable _(default)_<BR>`1` = enable
SetOption79<a class="cmnd" id="setoption79"></a>|Reset counters at TelePeriod time<BR>`0` = disable _(default)_<BR>`1` = enable
SetOption80<a class="cmnd" id="setoption80"></a>|[Blinds and shutters](Blinds-and-Shutters) support<BR>`0` = disable blinds and shutters support *(default)*<BR>`1` = enable blinds and shutters support
SetOption81<a class="cmnd" id="setoption81"></a>|Set [PCF8574](PCF8574) component behavior for all ports<BR>`0` = set as regular state *(default)*<BR>`1` = set as inverted state
SetOption82<a class="cmnd" id="setoption82"></a>|Reduce the CT range from 153..500 to 200.380 to accomodate with Alexa range<BR>`0` = CT ranges from 153 to 500 *(default)*<BR>`1` = CT ranges from 200 to 380 (although you can still set in from 153 to 500)
SetOption83<a class="cmnd" id="setoption83"></a>|Uses Zigbee device friendly name instead of 16 bits short addresses as JSON key when reporting values and commands<BR>`0` = JSON key as short address<BR>`1` = JSON key as friendly name<BR>See [`ZbName <device>,<name>`](#zbname)
SetOption84<a class="cmnd" id="setoption84"></a>|(Experimental) When using AWS IoT, sends a device shadow update (alternative to retained)<BR>`0` = don't update device shadow (default)<BR>`1` = update device shadow<BR>Note: if the `Topic` contains `'/'` they are replaced with `'_'`
SetOption85<a class="cmnd" id="setoption85"></a>|[Device group](Device-Groups) support<BR>`0` = disable _(default)_<BR>`1` = enable
SetOption86<a class="cmnd" id="setoption86"></a>|**PWM Dimmer only!** Turn brightness LED's off 5 seconds after last change<BR>`0` = disable _(default)_<BR>`1` = enable
SetOption87<a class="cmnd" id="setoption87"></a>|**PWM Dimmer only!** Turn red LED on when powered off<BR>`0` = disable _(default)_<BR>`1` = enable
SetOption88<a class="cmnd" id="setoption88"></a>|Make each relay part of a separate device group. Relay 1 updates are sent to/received from device group 1, relay 2 updates are sent to/received from device group 2, etc. For the PWM Dimmer module, make each button be associated with a different device group.<BR>`0` = disable _(default)_<BR>`1` = enable
SetOption90<a class="cmnd" id="setoption90"></a>|Disable sending MQTT with non-JSON messages<BR>`0` = send all MQTT _(default)_ <BR>`1` = send only MQTT messages with JSON payloads
SetOption93<a class="cmnd" id="setoption93"></a>|Control caching of compressed rules<BR>`0` = Disable memory caching of uncompressed rules <BR>`1` = Keep uncompressed rules in memory to avoid CPU load of uncompressing at each tick _(default)_
SetOption94<a class="cmnd" id="setoption94"></a>|Select MAX31855 or MAX6675 thermocouple support<BR>`0` = Use MAX31855 protocol _(default)_ <BR>`1` = Use simpler MAX6675 protocol instead of MAX31855 
SetOption97<a class="cmnd" id="setoption97"></a>|Set TuyaMCU serial baudrate<BR>`0` = 9600 bps _(default)_ <BR>`1` = 115200 bps     
SetOption98<a class="cmnd" id="setoption98"></a>|Provide rotary dimmer rule triggers<BR>`0` = disable _(default)_ <BR>`1` = enable     
SetOption99<a class="cmnd" id="setoption99"></a>|Enable zero-cross capable AC dimmer<BR>`0` = no zero-cross AC dimmer connected _(default)_ <BR>`1` = zero-cross AC dimmer attached. Focus on raising edge and sync frequency     
SetOption101<a class="cmnd" id="setoption101"></a>|Add Zigbee source endpoint as suffix to attributes<BR>`0` = disable _(default)_ <BR>`1` = enable<BR>e.g. `Power3` instead of `Power` if sent from endpoint `3`.
SetOption103<a class="cmnd" id="setoption103"></a>|Set TLS mode<BR>`0` = disable TLS<BR>`1` = enable TLS
SetOption104<a class="cmnd" id="setoption104"></a>|Disable MQTT retained messages (some brokers don't support them)<BR>`0` = retained messages enabled _(default)_ <BR>`1` = retained messages disabled
SetOption107<a class="cmnd" id="setoption107"></a>|Set virtual CT channel light type (experimental feature)<BR>`0` = Warm White <BR>`1` = Cold White
SetOption108<a class="cmnd" id="setoption108"></a>|`0` = Teleinfo telemetry only sent into Energy MQTT JSON _(default)_<BR>`1` = Each Teleinfo received frame is also sent by MQTT (mainly to be able to display real time data)
SetOption109<a class="cmnd" id="setoption109"></a>|`0` = _(default)_<BR>`1` = force gen1 Alexa mode, for Echo Dot 2nd gen devices only
SetOption113<a class="cmnd" id="setoption113"></a>|_works only with rotary dial button_<BR>`0` = _(default)_<BR>`1` = set dimmer low on rotary dial after power off
SetOption114<a class="cmnd" id="setoption114"></a>|Detach switches from relays and send MQTT messages instead<BR>`0` = disable *(default)*<BR>`1` = enable<BR> Example result: `{"Switch1":{"Action":"ON"}}`
SetOption115<a class="cmnd" id="setoption115"></a>|ESP32 MI32 BLE<BR>`0` = disable  _(default)_<BR>`1` = enable
SetOption116<a class="cmnd" id="setoption116"></a>|Auto-query of lights and devices<BR>`1` = disable
SetOption117<a class="cmnd" id="setoption117"></a>|Run fade at fixed duration instead of fixed slew rate<BR>`1` = enable
SetOption123<a class="cmnd" id="setoption123"></a>|Wiegand tag number output in hex format<BR>`1` = enable
SetOption124<a class="cmnd" id="setoption124"></a>|Wiegand key pad stroke format<br>`0` = one tag (ending char # or *) *(default)*<BR>`1` = one key
SetOption125<a class="cmnd" id="setoption125"></a>|_ZbBridge only_ Hide bridge topic from zigbee topic (use with [`SetOption89`](#setoption89))<br>`1` = enable
SetOption126<a class="cmnd" id="setoption126"></a>|Enable arithmetic mean over teleperiod for JSON temperature for DS18x20 sensors<BR>`1` = enable
SetOption127<a class="cmnd" id="setoption127"></a>|Force Wi-Fi in no-sleep mode even if Sleep 0 is not enabled<BR>`1` = enable
SetOption128<a class="cmnd" id="setoption128"></a>|Web referer check for HTTP API commands<BR>`0` = disabled<BR>`1` = enabled *(default)*
SetOption129<a class="cmnd" id="setoption129"></a>|Enable split total energy results [#13030](https://github.com/arendst/Tasmota/issues/13030)<BR>`1` = enable
SetOption130<a class="cmnd" id="setoption130"></a>|Add heap size (and ESP32 fragmentation) to logging timestamp for debugging<BR>`1` = enable
SetOption131<a class="cmnd" id="setoption131"></a>|(Tuya) Allow save dimmer = 0 received by MCU<BR>`1` = enable
SetOption132<a class="cmnd" id="setoption132"></a>|When MQTT Tls is enabled, forces fingerprint validation of server identity instead of checking the identitfy against a certificate authority (CA)<BR>`1` = Fingerprint, `0` = CA

### TuyaMCU

Command|Parameters
:---|:---
TuyaEnum&#60;x><a class="cmnd" id="tuyaenum"></a>|Send value to an Enum (fnId 61, 62, 63 and 64) where`<x>` = number of Enum<br> `<value>` = must be from a range set in `TuyaEnumList`
TuyaEnumList<a class="cmnd" id="tuyaenumlist"></a>|Declare the range an Enum (fnId 61, 62, 63 and 64) must respect (0 is always the first item in range)<br>`<enum>,<range>` = `<enum>` is `Enum<x>` declared using TuyaMCU and `<range>` can be `0..31`<br>Without payload returns the configuration of all the Enums
TuyaMCU<a class="cmnd" id="tuyamcu"></a>|Used to map functions in TuyaMCU <br>`<fnId>,<dpId>` = [read more...](TuyaMCU)<BR>`<fnId>,0` = remove setting for fnId
TuyaRGB<a class="cmnd" id="tuyargb"></a>|Set correct format of color reporting by tuyaMCU <br>`0` - Type 1, 12 characters uppercase. Example: `00DF00DC0244` (default)<br>`1` - Type 1, 12 characters lowercase. Example: `008003e8037a`<br>`2` - Type 2, 14 characters uppercase. Example: `00FF00FFFF6464`<br>`3` - Type 2, 14 characters lowercase. Example: `00e420ffff6464`
TuyaSend&#60;x><a class="cmnd" id="tuyasend"></a>|Send data to MCU with [TuyaMCU](TuyaMCU)<br>x = `0..4,8`<br>`TuyaSend0` = send a query command to the MCU<br>`TuyaSend1 <dpId>,<boolean>` = send boolean (`0`/`1`) data type to dpId (1 byte max length)<br>`TuyaSend2 <dpId>,<int>` = send integer data to dpId (4 bytes max length)<br>`TuyaSend2 <dpId>,<0xAABBCCDD>` = send 4 byte data to dpId (4 bytes max length)<br>`TuyaSend3 <dpId>,<value>` = send an ASCII string to dpId (unknown max length)<br>`TuyaSend4 <dpId>,<enum>` = send enumerated (`0`/`1`/`2`/`3`/`4`/`5`) data type to dpId (1 byte max length)<br>`TuyaSend5 <dpId>,<value>` = send an HEX string to dpId - `0x` prefix NOT needed - (unknown max length)<br>`TuyaSend8` = request dpId states if supported
TuyaTempSetRes<a class="cmnd" id="tuyatempsetres"></a>|Set resolution only for Tuya Set Temperature sensor (fnId 72). <br>`0..3` = maximum number of decimals shown
See also|[`SetOption8`](#setoption8) - change temperature display unit<br>[`SetOption66`](#setoption66) - publish TuyaReceived outputto MQTT<br>[`DimmerRange`](#dimmerrange) - to adjust dimmer range<br>[TempRes](#tempres) - set number of decimals shown for temperature sensors

### Serial Bridge

Hardware Serial Bridge uses `GPIO1 (Tx)` and `GPIO3 (Rx)` or `GPIO13 (Tx)` and `GPIO15 (Rx)` pins of your device.
Software Serial Bridge can use any other GPIO to be configured as components `Serial Tx` and `Serial Rx` (or `SerBr Tx` and `SerBr Rx`). If `Tx` and `Rx` components are not assigned in the Template or Module, `GPIO1` and `GPIO3` will be used. Note that changing serial logging ([`SerialLog`](#seriallog) 0) will disable the hardware Serial Bridge.

Information received by Tasmota over the serial bridge is captured automatically. Before data will be received, a properly formatted [`SerialSend<x>` or `SSerialSend<x>`](#serialsend) command must be executed. This must be done any time the device restarts (e.g., via a `System#Boot` triggered rule). This command is required in order to set how the expected serial data will be formatted and interpreted (i.e., which &#60;x> option). A `{"SSerialReceived":{"Data":"<string>"}}` message will be posted. You can use [a rule](Rules#control-relays-via-serial) to process the string which will be contained in `SSerialReceived#Data`.

Expect possible communication errors when additional sensors are configured.

Command|Parameters
:---|:---
Baudrate<a class="cmnd" id="baudrate"></a>|`1` = set hardware serial bridge to default baud rate of 115200 bps<BR>`<value>` = set baud rate. The set rate will be a multiple of 300. The maximum baud rate possible is 19,660,500.
SBaudrate<a class="cmnd" id="sbaudrate"></a>|`1` = set software serial bridge to default baud rate of 9600 bps<BR>`<value>` = set baud rate. The set rate will be a multiple of 300. The maximum baud rate possible is 19,660,500.
SerialBuffer<a class="cmnd" id="serialbuffer"></a>|`256..520` = set the serial buffer size. This option will **not be persisted**, use [a rule with a trigger](Rules#examples-of-available-triggers) like `Power1#Boot` when you want this to survive a reboot. Sometimes, _serial buffer overruns_ can be mitigated by setting this to a large value such as `520`.
SerialConfig<a class="cmnd" id="serialconfig"></a>|`value` = set serial protocol using [data/parity/stop](https://en.wikipedia.org/wiki/Serial_port#Settings) conventional notation (example: `8N1` or `702`)<BR>`0..23` = set serial protocol (`3` equals `8N1`)
SerialDelimiter<a class="cmnd" id="serialdelimiter"></a>|`<value>` = set serial delimiter to [escape character code](https://en.wikipedia.org/wiki/Escape_character#ASCII_escape_character) or ASCII character<BR>`1..127` = set serial delimiter to [decimal ASCII](http://www.asciichart.com/)<BR>`128` = only allow ASCII characters 32 to 127 in response text<BR>`129..255` = disable serial delimiter
SerialSend&#60;x><a class="cmnd" id="serialsend"></a>|`<string>`<BR>Disable serial logging and send using hardware serial<BR>x = `1..5`<BR>`1` = send appending `\n` (newline) ()<BR>`2` = send<BR>`3` = replace escape characters and send <BR>`4` = send as binary. Data in serial response messages is encoded as hex strings <BR>`5` = send as hex. Data in serial response messages is encoded as hex strings<BR>`6` = send as comma-delimited string of decimal numbers
SSerialSend&#60;x><a class="cmnd" id="sserialsend"></a>|`<string>`<BR>Send using software serial protocol<BR>x = `1..5`<BR>`1` = send appending `\n` (newline) ()<BR>`2` = send<BR>`3` = replace escape characters and send <BR>`4` = send as binary data. Data in serial response messages is encoded as hex strings<BR>`5` = send as hex. Data in serial response messages is encoded as hex strings<BR>`6` = send as comma-delimited string of decimal numbers


### RF Bridge

Command|Parameters
:---|:---
RfCode<a class="cmnd" id="rfcode"></a>|Show last sent 24-bit user code<BR>`1..8388607` = send 24-bit user code<BR>`#1..#7FFFFF` = send 24-bit hexadecimal user code using RfSync, RfLow and RfHigh timing
RfHigh<a class="cmnd" id="rfhigh"></a>|`1` = reset high pulse time to 840 microseconds<BR>`2..32767` = set high pulse time in microseconds<BR>`#2..#7FFF` = set high pulse time in hexadecimal microseconds
RfHost<a class="cmnd" id="rfhost"></a>|Show 16-bit host part of user code<BR>`1` = reset 16-bit host part of user code to 11802 (#2E1A)<BR>`2..32767` = set 16-bit host part of user code<BR>`#2..7FFF` = set 16-bit host part of user code in hexadecimal
RfKey<x\><a class="cmnd" id="rfkey"></a>|Send learned or default RF data for RfKey<x\> (x = `1 – 16`)<BR>`1` = send default RF data for RfKey<x\> using RfSync, RfLow, RfHigh and RfHost parameters<BR>`2` = learn RF data for RfKey<x\><BR>`3` = unlearn RF data for RfKey<x\><BR>`4` = save RF data using RfSync, RfLow, RfHigh and last RfCode parameters<BR>`5` = show default or learned RF data<BR>`6` = send learned RF data
RfLow<a class="cmnd" id="rflow"></a>|`1` = reset low pulse time to 270 microseconds<BR>`2..32767` = set low pulse time in microseconds<BR>`#2..#7FFF` = set low pulse time in hexadecimal microseconds
RfRaw<a class="cmnd" id="rfraw"></a>|**This command only works when the firmware has been updated with [Portisch firmware](https://github.com/Portisch/RF-Bridge-EFM8BB1/releases).** Refer to the [Portisch wiki](https://github.com/Portisch/RF-Bridge-EFM8BB1/wiki) for details.<BR>[Learning and Decoding RF Codes with Portisch Firmware](devices/Sonoff-RF-Bridge-433#portisch-firmware-specific-usage)<BR>`0` = Set iTead default firmware support and messages *(default on restart)*<BR> `1` = set Portisch firmware support and messages<BR> `166` or `AAA655` = start sniffing/reading RF signals disabling iTead default RF handling<BR> `167` or `AAA755` = stop sniffing/reading RF signals enabling iTead default RF handling<BR> `168` or `AAA855` = transmitting iTead default RF protocols<BR> `169` or `AAA955` = start sniffing and learning predefined protocols<BR> `176` or `AAB055` = bucket Transmitting using command 0xB0<BR> `177` or `AAB155` = start Bucket sniffing using command 0xB1<BR> `192` or `AAC000C055` = beep (`00C0` is the length of the sound)<BR> `255` or `AAFF55` = show Rf firmware version (result AA02FF means Version 02)<BR> `<value>` = hexadecimal data to be sent to RF chip. This must be immediately followed by the `RfRaw 0` command (e.g., `Backlog RfRaw <value>; RfRaw 0`
RfSync<a class="cmnd" id="rfsync"></a>|`1` = reset start sync pulse time to 8470 microseconds<BR>`2..32767` = set start sync pulse time in microseconds<BR>`#2..#7FFF` = set start sync pulse time in hexadecimal microseconds
See also|[`SetOption28`](#setoption28) - Set RF received data format

### RF Transceiver
Command|Parameters
:---|:---
RFsend<a id="rfsend"></a>|`<value>` = code decimal or JSON. Data value is required and can be decimal or hexadecimal (using the 0x prefix), other values are optional.<BR><BR>_JSON_<BR>`{"Data":"<value>","Bits":<value>,"Protocol":<value>,"Pulse":<value>}`<BR>`"Data":"<value>"` = hexadecimal code<BR>`"Bits":<value>` = required number of data bits _(default = `24`)_<BR>`"Protocol":<value>` = protocol number _(default = `1`)_<BR>`"Repeat":<value>` = repeat value _(default = `10`)_<BR>`"Pulse":<value>` = pulse value _(`350` = default for protocol 1)_<BR>&emsp;e.g., `RFsend {"Data":"0x7028DC","Bits":24,"Protocol":1,"Pulse":238}`<BR><BR>_Decimal_<BR>`data, bits, protocol, repeat, pulse` <BR>&emsp;e.g., `RFsend 7350492, 24, 1, 10, 238` or `RFsend 0x7028DC, 24, 1, 10, 238`

### IR Remote

The standard Tasmota builds have reduced support for IR protocols: `RC5`, `RC6` and `NEC`. Use Tasmota-IR to have access to full protocols.

Command|Parameters
:---|:---
IRsend`<x>`<a class="cmnd" id="irsend"></a>|Send an IR remote control code as a decimal or hexadecimal string in a JSON payload. In order to send IR data, _**you must configure one of the free device GPIO as `IRsend (8)`. GPIO01 nor GPIO03 can be used.**_<BR>`<x>` [_optional_] = number of times the IR message is sent. If not specified or `0..1`, the message is sent only once (i.e., not repeated) _(default)_<BR>`>1` = emulate a long-press on the remote control, sending the message `<x>` times, or sending a repeat message for specific protocols (like NEC)<BR><BR>`{"Protocol":"<value>","Bits":<value>,"Data":<value>}`<BR><BR>`"Protocol"` (select one of the following):<ul><li>`"NEC"`</li><li>`"RC5"`</li><li>`"RC6"`</li></ul>`"Bits":1..32` = required number of data bits<BR>&nbsp;&nbsp;&nbsp;&nbsp;for PANASONIC protocol this parameter is the the address, not the number of bits<BR><BR>`"Data":1..(2^32)-1` = data frame as 32 bit decimal.<BR>&nbsp;&nbsp;&nbsp;&nbsp;e.g., `IRsend {"Protocol":"NEC","Bits":32,"Data":2170978686}`<BR>**or**<BR>`"Data":0x1..0xFFFFFFFF` = data frame as 32 bit hexadecimal.<BR>&nbsp;&nbsp;&nbsp;&nbsp;e.g., `IRsend {"Protocol":"NEC","Bits":32,"Data":0x8166817E}`<BR><BR>Alternatively, you can send IR remote control codes using [RAW command encoding](IRSend-RAW-Encoding).<BR><BR>[Read more...](Tasmota-IR#receiving-ir-commands)

[Tasmota-IR enabled with all protocols](Tasmota-IR#receiving-ir-commands)

Command|Parameters
:---|:---
IRsend`<x>`<a id="IRsend"></a>|`<x>` [_optional_] = number of times the IR message is sent. If not specified or `0..1`, the message is sent only once (i.e., not repeated) _(default)_<BR>`>1` = emulate a long-press on the remote control, sending the message `<x>` times, or sending a repeat message for specific protocols (like NEC)<BR><BR>`{"Protocol":"<value>","Bits":<value>,"Data":<value>,"DataLSB":<value>,"Repeat":<value>}`<BR><BR>`"Protocol"` or `"Vendor"` (select one of the following): <BR>`RC5, RC6, NEC, SONY, PANASONIC, JVC, SAMSUNG, WHYNTER, AIWA_RC_T501, LG, MITSUBISHI, DISH, SHARP, DENON, SHERWOOD, RCMM, SANYO_LC7461, RC5X, NEC (non-strict), NIKAI, MAGIQUEST, LASERTAG, CARRIER_AC, MITSUBISHI2, HITACHI_AC1, HITACHI_AC2, GICABLE, LUTRON, PIONEER, LG2, SAMSUNG36, LEGOPF, INAX, DAIKIN152`<BR><BR>`"Bits":1..64` = required number of data bits<BR>&nbsp;&nbsp;&nbsp;&nbsp;for PANASONIC protocol this parameter is the the address, not the number of bits<BR><BR>`"Data":0x1..0xFFFFFFFFFFFFFFFF` = data frame as 64 bit hexadecimal.<BR>&nbsp;&nbsp;&nbsp;&nbsp;e.g., `IRsend {"Protocol":"NEC","Bits":32,"Data":0x8166817E}`<BR>**Or**<BR>`"DataLSB":0x1..0xFFFFFFFFFFFFFFFF` = data frame as 64 bit hexadecimal with LSB (each byte with bits reversed).<BR>&nbsp;&nbsp;&nbsp;&nbsp;e.g., `IRsend {"Protocol":"NEC","Bits":32,"Data":0x8166817E}`<BR>`DataLSB` comes handy with LSB-first (Least Significant Bit First) protocols like NEC, and makes decoding/encoding easier.<BR><BR>`"Repeat":0..<x>` if `0` send the frame once, if `>0` simulates a long press; Note: `"Repeat":1` sends the message twice.<BR><BR>Alternatively, you can send IR remote control codes using [RAW command encoding](IRSend-RAW-Encoding).
|See also<BR>[`SetOption29`](Commands#setoption29)  - Set IR received data format<BR>[`SetOption38`](Commands#setoption38)  - Set IR received protocol sensitivity<BR>[`SetOption58`](Commands#setoption58) - [IR Raw data in JSON payload](https://github.com/arendst/Tasmota/issues/2116#issuecomment-440716483)
IRhvac<a id="IRhvac"></a>|Send HVAC IR remote control code as JSON payload<BR><BR>```IRhvac {"Vendor":"Mitsubishi_Heavy_152", "Power":"On","Mode":"Hot","FanSpeed":3,"Temp":22.5}```<BR><BR>`"Protocol"` or `"Vendor"` (select one of the following): <BR>`COOLIX, DAIKIN, KELVINATOR, MITSUBISHI_AC, GREE, ARGO, TROTEC, TOSHIBA_AC, FUJITSU_AC, MIDEA, HAIER_AC, HITACHI_AC, HAIER_AC_YRW02, WHIRLPOOL_AC, SAMSUNG_AC, ELECTRA_AC, PANASONIC_AC, DAIKIN2, VESTEL_AC, TECO, TCL112AC, MITSUBISHI_HEAVY_88, MITSUBISHI_HEAVY_152, DAIKIN216, SHARP_AC, GOODWEATHER, DAIKIN160, NEOCLIMA, DAIKIN176, DAIKIN128`<BR><BR>`"Model":` Some HVAC have variants in protocols, this field allows to specify the variant, see [detailed list](https://github.com/crankyoldgit/IRremoteESP8266/blob/master/SupportedProtocols.md).<BR><UL><LI>`Fujitsu_AC`: `ARRAH2E|ARDB1`</LI><LI>`Panasonic_AC`: `LKE|NKE|DKE|JKE|CKP|RKR`</LI><LI>`Whirlpool_AC`: `DG11J13A|DG11J104|DG11J1-04|DG11J191`</LI></UL>`"Power"`:<UL><LI>`On, Yes, True, 1`</LI><LI>`Off, No, False, 0`</LI></UL>`"Mode"`:<UL><LI>`Off, Stop`</LI><LI>`Auto, Automatic`</LI><LI>`Cool, Cooling`</LI><LI>`Heat, Heating`</LI><LI>`Dry, Drying, Dehumidify`</LI><LI>`Fan, Fanonly, Fan_Only`</LI></UL>`"FanSpeed"`:<UL><LI>`Auto, Automatic`</LI><LI>`Min, Minimum, Lowest, 1`</LI><LI>`Low, 2`</LI><LI>`Med, Medium, Mid, 3`</LI><LI>`High, Hi, 4`</LI><LI>`Max, Maximum, Highest, 5`</LI></UL>`"SwingV"`: vertical swing of Fan<UL><LI>`Auto, Automatic, On, Swing`</LI><LI>`Off, Stop`</LI><LI>`Min, Minimum, Lowest, Bottom, Down`</LI><LI>`Low`</LI><LI>`Mid, Middle, Med, Medium, Centre, Center`</LI><LI>`High, Hi`</LI><LI>`Highest, Max, Maximum, Top, Up`</LI></UL>`"SwingH"`: horizontal swing of Fan<UL><LI>`Auto, Automatic, On, Swing`</LI><LI>`Off, Stop`</LI><LI>`LeftMax, Left Max, MaxLeft, Max Left, FarLeft, Far Left`</LI><LI>`Left`</LI><LI>`Mid, Middle, Med, Medium, Centre, Center`</LI><LI>`Right`</LI><LI>`RightMax, Right Max, MaxRight, Max Right, FarRight, Far Right`</LI><LI>`Wide`</LI></UL>`"Celsius"`: temperature is in Celsius (`"On"`) of Farenheit (`"Off"`)<BR>`"Temp"`: Temperature, can be float if supported by protocol<BR>`"Quiet"`: Quiet mode (`"On"` / `"Off"`)<BR>`"Turbo"`: Turbo mode (`"On"` / `"Off"`)<BR>`"Econo"`: Econo mode (`"On"` / `"Off"`)<BR>`"Light"`: Light (`"On"` / `"Off"`)<BR>`"Filter"`: Filter active (`"On"` / `"Off"`)<BR>`"Clean"`: Clean mode (`"On"` / `"Off"`)<BR>`"Beep"`: Beep active (`"On"` / `"Off"`)<BR>`"Sleep"`: Timer in seconds<BR>`"StateMode"`:<UL><LI>`SendOnly` (default)</LI><LI>`StoreOnly`</LI><LI>`SendStore`</LI></UL>
|See also<BR>[`SetOption29`](#setoption29)  - Set IR received data format<BR>[`SetOption38`](#setoption38)  - Set IR received protocol sensitivity<BR>[`SetOption58`](#setoption58) - [IR Raw data in JSON payload](https://github.com/arendst/Tasmota/issues/2116#issuecomment-440716483)


### Displays

Command|Parameters
:--- |:---
Display<a class="cmnd" id="display"></a>|Show current display setting as a JSON payload
DisplayAddress<a class="cmnd" id="displayaddress"></a>|`0..255` Set display module address
DisplayDimmer<a class="cmnd" id="displaydimmer"></a>|`0` = Turn the display off<BR>`1..100` = Set display luminosity *(only on 8x8 Dot-Matrix displays)*<br>`13..100` maps to `1..7` levels of brightness for [TM1637, TM1638 and MAX7219](TM163x#displaydimmer) seven-segment display modules
DisplayInvert<a class="cmnd" id="displayinvert"></a>|`1` - Invert display where implemented. [More info...](Displays.md)
DisplayMode<a class="cmnd" id="displaymode"></a>|`0..5` Set to display [predefined content](Displays#displaymode-parameters) according to display type<br>`0..3` for [TM1637, TM1638 and MAX7219](TM163x#displaymodes) seven-segment display modules
DisplayModel<a class="cmnd" id="displaymodel"></a>|Set display model:<BR>`1` = [I<sup>2</sup>C LCD Display](https://learn.adafruit.com/i2c-spi-lcd-backpack) (default addresses `0x27`, `0x3F`)<BR>`2` = [SSD1306](https://learn.adafruit.com/monochrome-oled-breakouts/arduino-library-and-examples) OLED 128x32/128x64/68x48 (default I<sup>2</sup>C addresses `0x3C`, `0x3D`)<BR>`3` = [HT16K33](https://www.adafruit.com/product/1427) 8x8 Dot-Matrix<BR>`4` = [ILI9341](https://www.adafruit.com/product/1770) TFT LCD<BR>`5` = [2.9 inch E-Paper Display](https://www.waveshare.com/wiki/2.9inch_e-Paper_Module) 296x128 (software 3-wire SPI)<BR>`6` = [4.2 inch E-Paper Display](https://www.waveshare.com/wiki/4.2inch_e-Paper_Module) 400x300 (software 3-wire SPI)<BR>`7` = [SH1106](https://www.ebay.com/itm/1-3-SH1106-I2C-IIC-128X64-OLED-LCD-LED-Display-Module-Board-For-Arduino-BLUE/391701761596) OLED 128x64 (default I<sup>2</sup>C address `0x3c`)<BR>`8` = [ILI9488](https://www.buydisplay.com/default/lcd-3-5-inch-320x480-tft-display-module-optl-touch-screen-w-breakout-board) TFT 480x320 (capacitive touch, hardware 3-wire SPI)<BR>`9` = [SSD1351](https://www.ebay.com/itm/3-3V-5V-General-1-5inch-RGB-OLED-Display-Module-128x128-SSD1351-SPI-Interface/253655550921) color OLED 128x128 (hardware 3-wire SPI)<BR>`10` = [RA8867](https://www.buydisplay.com/default/spi-7-inch-tft-lcd-dislay-module-1024x600-ra8876-optl-touch-screen-panel) TFT LCD 1024x600 (capacitive touch, hardware 4-wire SPI)<BR>`15` = [TM1637](https://wiki.seeedstudio.com/Grove-4-Digit_Display/) 7-segment, 4-,6- and 8-digit displays (TM1637, TM1638 and MAX7219), hardware 2- and 3-wire I2C-like interface<BR>`16` = [LilyGO T5-4.7](http://www.lilygo.cn/prod_view.aspx?TypeId=50061&Id=1384&FId=t3:50061:3) E-Paper display board<BR>`17` = [Universal Display Driver](https://tasmota.github.io/docs/Displays/#universal-display-driver) powered displays    
DisplayRefresh<a class="cmnd" id="displayrefresh"></a>|`1..7` Set time in seconds to update predefined content when using `DisplayMode` &ne; `0`
DisplaySize<a class="cmnd" id="displaysize"></a>|`1..4` Set display scale-up size *(SSD1306  and ILI9341 only)*
DisplayRotate<a class="cmnd" id="displayrotate"></a>|Set rotation angle<BR> `0` = 0°<BR> `1` = 90°<BR> `2` = 180°<BR> `3` = 270°
DisplayText<a class="cmnd" id="displaytext"></a>|`<value>` = See [DisplayText use](Displays.md#displaytext)<br>For TM1637, TM1638 and MAX7219, see below
DisplayText<br>*(TM1637, TM1638 and MAX7219)* | `text`[, `position`[, `length`]] <br>Clears and then displays basic text on the 7-segment display. <br><br> `length` can be `1` to `NUM_DIGITS` , <br> `position` can be `0` (left-most) to `NUM_DIGITS-1` (right-most) <br><br>  A caret(`^`) symbol in the text input is dispayed as the degrees(`°`) symbol. This is useful for displaying Temperature (or angle)! <br>See [TM163x](TM163x#commands-and-usage) for details.
DisplayTextNC<br>*(TM1637, TM1638 and MAX7219)*  | `text`[, `position`[, `length`]] <br>Clears first, then displays text. Usage is same as above. <br>See [TM163x](TM163x#commands-and-usage) for details.
DisplayType<a class="cmnd" id="displaytype"></a>|Select display sub-modules. [More info...](Displays.md)<br>For usage of this command with TM163x, see [TM163x](TM163x#displaytype) for details.
DisplayCols<a class="cmnd" id="displaycols"></a>|`1..44` Set number of display columns *(for display modes>0)*
DisplayRows <a class="cmnd" id="displayrows"></a>|`1..32` Set number of display rows *(for display modes>0)*
DisplayFont<a class="cmnd" id="displayfont"></a>|Specify the current font<BR>`0` use classic GFX font<BR>`1` = 12<BR>`2` = 24<BR>`3` = 8 (opt)<BR>`7` use RA8876 internal font
DisplayWidth<a class="cmnd" id="displaywidth"></a>|Specify the display width in pixels *(SSD1306 only)*<br> -or-<br>Specify number of digits in [TM163x](TM163x#displaywidth) seven-segment display module
DisplayHeight<a class="cmnd" id="displayheight"></a>|Specify the display height in pixels *(SSD1306 only)*
DisplayClear<br>*(TM1637, TM1638 and MAX7219)*<a class="cmnd" id="displayclear"></a>|Clears the display. <br>See [TM163x](TM163x#commands-and-usage) for details.
DisplayNumber <br>*(TM1637, TM1638 and MAX7219)*<a class="cmnd" id="displaynumber"></a>| `num` [, `position`[, `leading_zeros`[, `length`]]] <br>Clears and then displays number `num` without decimal.<br><br> `leading zeros` can be `1` or `0` (default),<br> `length` can be `1` to `NUM_DIGITS` (4 or 6), <br> `position` can be `0` (left-most) to `NUM_DIGITS` (right-most). <br>See [TM163x](TM163x#commands-and-usage) for details.
DisplayNumberNC <br>*(TM1637, TM1638 and MAX7219)* | `num` [, `position`[, `leading_zeros`[, `length`]]] <br>Display integer number as above, but without clearing first. Usage is same as above. <br>See [TM163x](TM163x#commands-and-usage) for details.
DisplayFloat <br>*(TM1637, TM1638 and MAX7219)* | `num`[, `position`[, `precision`[, `length`]]] <br>Clears and then displays float (with decimal point).<br><br> `precision` can be `0` to `NUM_DIGITS` (default), <br> `length` can be `1` to `NUM_DIGITS` (4 or 6), <br> `position` can be `0` (left-most) to `NUM_DIGITS` (right-most). <br>See [TM163x](TM163x#commands-and-usage) for details.
DisplayFloatNC <br>*(TM1637, TM1638 and MAX7219)* | `num`[, `position`[, `precision`[, `length`]]] <br>Displays float (with decimal point) as above, but without clearing first. Usage same as above. <br>See [TM163x](TM163x#commands-and-usage) for details.
DisplayRaw <br>*(TM1637, TM1638 and MAX7219)* | `position`, `length`,  `num1` [, `num2`[, `num3`[, `num4`[, ...upto `NUM_DIGITS` numbers]]...] <br>Takes upto `NUM_DIGITS` comma-separated integers (0-255) and displays raw segments. <br>  <br> `length` can be `1` to `NUM_DIGITS` (4 or 6), <br> `position` can be `0` (left-most) to `NUM_DIGITS` (right-most). <br>`num1`, `num2`, ...  are numbers representing a 7-segment digit. Each number represents all segments of one digit. <br> Segment a=1, b=2, c=4, d=8, e=16, f=32, g=64 and h (decimal point)=128.<br> To turn on all segments, the number would be 1+2+4+8+16+32+64+128 = 255. <br>See [TM163x](TM163x#commands-and-usage) for details.
DisplayScrollText<br>*(TM1637, TM1638 and MAX7219)* | `text` [, `num_iterations`]<br> Displays scrolling text, upto 50 characters. <br>If `num_iterations` is not specified, it scrolls indefinitely, until another *Display-* command is issued. Optionally, specifying `num_iterations` causes the scrolling to stop after the specified number of iterations.<br>See [TM163x](TM163x#commands-and-usage) for details.
DisplayScrollDelay<br>*(TM1637, TM1638 and MAX7219)* | `0..15` Sets the speed of text scroll. Smaller delay implies faster scrolling. <br> <br>See [TM163x](TM163x#commands-and-usage) for details.
DisplayLevel<br>*(TM1637, TM1638 and MAX7219)* | `0..100` Display a horizontal bar graph. <br><br>See [TM163x](TM163x#commands-and-usage) for details.
DisplayClock<br>*(TM1637, TM1638 and MAX7219)* | Displays a clock. <br> `1` = displays a clock in 12-hour format. <br> `2` = displays a clock in 24-hour format. <br> `0` = turns off the clock and clears the display  <br>See [TM163x](TM163x#commands-and-usage) for details.



### Shutters

Command<BR> (x = `1..4`)|Parameters
:---|:---
ShutterMode&#60;x><a class="cmnd" id="shuttermode"></a>|`1..5` *(default = `0`)*<BR>Defines the mode the shutter will operates the relays, steppers and/or servos. 0=autodetect based on INTERLOCK and GPIO defined. STATUS 13 show the mode. 1=normal two relay up/off down/off. 2=two relay on/off up/down. 3=one relay garage mode. 4=one relay plus stepper motor. 5=one relay and position servo.
ShutterButton&#60;x><a class="cmnd" id="shutterbutton"></a>|`<button> <func> <mqtt>`<BR><BR>Assign a button to control the shutter. For more details please refer to [Blinds and Shutters](Blinds-and-Shutters) support<BR><BR>`<button>`<BR>&emsp;`0`: disable buttons for this shutter<BR>&emsp;`1..4`: Button number<BR>`<func>` `up`/`down`/`updown`/`toggle`: function to assign to the button<BR>`<mqtt>` `1`/`0`: enable/disable MQTT publish for button hold action<BR><BR>For example:<li>To control shutter #1 by two buttons: `Backlog ShutterButton1 1 up 1; ShutterButton1 2 down 1` assigns button #1 to act as an "up" button (1x press open, 2x press 50% position, 3x press 74% position) and button #2 to act as an "down" button (1x press close, 2x press 50% position, 3x press 24% position) for shutter #1 including MQTT publish.</li><li>To control shutter #1 by a single button: `ShutterButton1 1 updown 0` assigns button #1 to act as an "up and down" button (1x press up, 2x press down).</li><li>To control shutter #1 by a single button: `ShutterButton1 1 toggle 0` assigns button #1 to act as a "toggle" button (1x press toggle, 2x press 50% position).</li>
ShutterCalibration&#60;x><a class="cmnd" id="shuttercalibration"></a>|Granular shutter position calibration. The measured opening position of the shutter at the 30, 50, 70, 90, and 100 percent opened locations. For example: `ShutterCalibration<x> 23 38 56 74 82`
ShutterChange<a class="cmnd" id="shutterchange"></a>|`-100..100` Moves the shutter from the current position relativly in %. If the resulting position is below 0 or above 100 it will be capped. Command can also be executed during movement and will change the target position.
ShutterCloseDuration&#60;x><a class="cmnd" id="shuttercloseduration"></a>| `1.0 ..240.0` *(default = `10.0`)*<BR>time, in seconds, it takes to fully close the shutter. A fraction of a second can be specified (e.g. `45.7`).
ShutterClose&#60;x><a class="cmnd" id="shutterclose"></a>|Engage the relay to close the shutter. This action can be requested at any time. Number of shutter can be the index or the arguement
ShutterFrequency&#60;x><a class="cmnd" id="shutterfrequency"></a>|`0..10,000`Hz *(default = `1000`)*<BR>the maximum frequency at which the stepper motor can operate reliably. Typically this is up to 2,000Hz with a 12V power supply and up to 5,000Hz with a 24V power supply.
ShutterEnableEndStopTime&#60;x><a class="cmnd" id="shutterenableendstoptime"></a>|`0` = no additional shutter end stop time *(default)*<BR>`1` = 1 s additional shutter end stop time
ShutterInvert&#60;x><a class="cmnd" id="shutterinvert"></a>|`0` = use default shutter positioning (`0` = Closed, `100` = Open)<BR>`1` = invert shutter positioning (`100` = Closed, `0` = Open) (e.g., if used with KNX)
ShutterInvertWebButtons&#60;x><a class="cmnd" id="shutterinvertwebbuttons"></a>|`0` = use default button icons (▲ for open, ▼ for close)<BR>`1` = invert button icons (▼ for open, ▲ for close) (e.g., if used with horizontal awning: where open means rolling-down fabric material and close rolling-up in a protect position)
ShutterLock&#60;x><a class="cmnd" id="shutterlock"></a>|`0` = unlock shutter positioning *(default)*<BR>`1` = lock shutter positioning
ShutterMotorDelay&#60;x><a class="cmnd" id="shuttermotordelay"></a>|`-12.75 .. 12.75` *(default = `0`)*<BR>time, in seconds, it takes the motor to start moving once power is turned on; i.e., motor lag time. You can use negative numbers if your motor stops to late after power OFF<BR><BR>When used with stepper motors, this setting defines the  ramp up/down speed (i.e., acceleration/deceleration) before the motor reaches its target speed for gradual starting and stopping. In this case only positive numbers are allowed.
ShutterOpenDuration&#60;x><a class="cmnd" id="shutteropenduration"></a>|`1.0 ..240.0` *(default = `10.0`)*<BR>time, in seconds, it takes to fully open the shutter. A fraction of a second can be specified (e.g. `45.7`).
ShutterOpen&#60;x><a class="cmnd" id="shutteropen"></a>|Engage the relay to open the shutter. This action can be requested at any time. Number of shutter can be index or the arguement
ShutterPosition&#60;x><a class="cmnd" id="shutterposition"></a>|`0..100`, `UP`, `OPEN`, `DOWN`, `CLOSE`, `STOP`, `TOGGLE`, `TOGGLEDIR`,,<BR>A shutter position change can be requested at any time. The shutter will stop and revert or update to the requested position. The shutter's actual position will be saved _**after**_ the movement is completed. In this case, the position will be restored during reboot. An interruption during shutter movement (e.g., a device restart) will lose the current position.
ShutterPWMRange&#60;x><a class="cmnd" id="shutterpwmrange"></a>|`0..1023,0..1023`<BR>For servo motors the min and max position is defined by the length of the duty cycle signal. Because every servo is different the min and max PWM value must be set for each servo type. The value is also dependend on the `PWMfrequency`. Servos normally use `50..200` as `PWMfrequency`.
ShutterRelay&#60;x><a class="cmnd" id="shutterrelay"></a>|`<value>`<BR>`0` = disable this and all higher numbered shutters<BR>`Relay<value>` component used to open the shutter. This relay's mate, the next higher numbered relay, closes the shutter. Depending on the shutter mode, the relays may need to be interlocked using the [`Interlock`](Commands.md#interlock) command.<BR>**The `ShutterRelay` command must be executed first before any other shutter commands for `Shutter<x>` can be executed.**
ShutterSetClose&#60;x><a class="cmnd" id="shuttersetclose"></a>|shutter closed position. `ShutterPosition` will be reset to fully closed value (e.g., `0` when `ShutterInvert = 0`, `100` otherwise). This does not work with Servos. min and max of servos are always defined through `ShutterPWMRange`.
ShutterSetOpen&#60;x><a class="cmnd" id="shuttersetopen"></a>|shutter opened position. `ShutterPosition` will be reset to fully opened value (e.g., `100` when `ShutterInvert = 0`, `0` otherwise). This does not work with Servos. min and max of servos are always defined through `ShutterPWMRange`.
ShutterSetHalfway&#60;x><a class="cmnd" id="shuttersethalfway"></a>| `0..100` *(default = `50`)*<BR>Define shutter half open position (in percent)
ShutterStop&#60;x><a class="cmnd" id="shutterstop"></a>|Disengage the relays to stop the shutter. Number of shutter can be the index or the argument
ShutterStopClose&#60;x><a class="cmnd" id="shutterstopclose"></a>|Stop the shutter when currently moving, close it otherwise
ShutterStopOpen&#60;x><a class="cmnd" id="shutterstopopen"></a>|Stop the shutter when currently moving, open it otherwise
ShutterStopPosition&#60;x><a class="cmnd" id="shutterstopposition"></a>|Stop the shutter when currently moving, set it to position `0..100`, `UP`, `DOWN`, `STOP`, `TOGGLE` otherwise
ShutterStopToggle&#60;x><a class="cmnd" id="shutterstoptoggle"></a>|Stop the shutter when currently moving, do `ShutterToggle` otherwise
ShutterStopToggleDir&#60;x><a class="cmnd" id="shutterstoptoggledir"></a>|Stop the shutter when currently moving, do `ShutterToggleDir` otherwise
ShutterToggle&#60;x><a class="cmnd" id="shuttertoggle"></a>|Toggle the shutter - close the shutter when its position is >50, open it otherwise
ShutterToggleDir&#60;x><a class="cmnd" id="shuttertoggledir"></a>|Toggle the shutter - close the shutter when it previously moved to open, open it otherwise
ShutterTiltConfig&#60;x><a class="cmnd" id="shuttertiltconfig"></a>|`<min> <max> <Tiltduration> <openposition> <closeposition>` *(default = `0 0 0 0 0`)*<BR>Configure the tilt for venetian blinds. Min/man values must be in the range of -90° to 90°. Open and Close position must be part of the defined range between min and max. Tiltduration defines the time the shutter needs to change the tilt from min to max value. This time has to been multiplied by 20. E.g. 1.2sec = 1.2 x 20 = 24. Example defines tilt on shutter 2: `shuttertiltconfig2 -90 90 24 0 90`
ShutterTilt&#60;x><a class="cmnd" id="shuttertilt"></a>|Set the tilt position `<value>` (between min and max), `OPEN`, `CLOSE`. Definition please see `shuttertiltconfig`
ShutterTiltChange&#60;x><a class="cmnd" id="shuttertiltchange"></a>|`-100..100` Moves the shuttertilt from the current position relativly in %. If the resulting tilt is below min or above max it will be capped. Command can also be executed during movement and will change the tilt at target position.
See also| [`SetOption80`](#setoption80) - Enable shutter support

### Zigbee

See [Zigbee article](Zigbee) for more information

Command|Parameters
:---|:---
`<device>` |As `<device>` in following commands you can use interchangeably:<BR>`<shortaddr>` = short address of the Zigbee device on the network, example: `0x1234`<BR>`<longaddr>` = permanent IEEE address of the Zigbee device (64 bits), example: `0x00158D00041160C5`<BR>`<index>` = number of the device in the internal list (starts at 1), ideal for enumerating devices, example: `3` for third device in the list<BR>`<name>` = friendly name. _Only when previously set with [`ZbName`](#zbname)_
ZbBind<a class="cmnd" id="zbbind"></a>|Binds one Zigbee device to another device or to a group. This allows one device to directly send commands (f.e. a remote to a bulb) without any action on the coordinator.<BR>Command structure: `{"Device":"<device>", "Endpoint":<endpoint>, "Cluster":<cluster>, "ToDevice":"<to_device>", "ToEndpoint":<to_endpoint>, "ToGroup":<to_group> }`<BR>`<device>` = device sending messages **(mandatory)**<BR>`<endpoint>` = source endpoint **(mandatory)**<BR>`<cluster>` = source cluster id **(mandatory)**<BR>`<to_device>` = target device (optional)<BR>`<to_endpoint>` = target endpoint<br>&emsp;(optional if it can be inferred from `ZbStatus3`)<BR>`<to_group>` = target group id (optional)<BR>:notebook: You must specify either `"ToDevice"` or `"ToGroup"` but not both<BR>:notebook: Zigbee2Tasmota must know the IEEE address of target device, see `ZbStatus2` to verify and `ZbProbe` to have Zigbee2Tasmota query the address<BR>(EZSP ZBBridge only) If you bind devices to groups you should also use ZbListen to that group, otherwise MQTT messages will not be published
ZbBindState&#60;n><a class="cmnd" id="zbbindstate"></a>|Asks the device for its internal binding states<BR>`<device>` the device to query<BR>`<n>` the start index for the request, `1` is the default. This is used to scan through all bindings.
ZbConfig<a class="cmnd" id="zbconfig"></a>|display the current Zigbee configuration<BR>Example or result: ```{"ZbConfig":{"Channel":11,"PanID":"0x1A63","ExtPanID":"0xCCCCCCCCCCCCCCCC","KeyL":"0x0F0D0B0907050301","KeyH":"0x0D0C0A0806040200"}}```
ZbConfig<a class="cmnd" id="zbconfig2"> <json\></a>|change the configuration and restart if any change was applied. **Warning: change in configuration causes a reset of the CC2530/ZBBridge and requires devices to be re-paired.**<BR>`"Channel":<channel>`: Zigbee radio channel (11-26)<BR>`"PanID":<panid>`: identifier of the Zigbee Network<BR>`"ExtPanID":<extpanid>`: unique identifier of the Zigbee Network (ExtPanID features are not supported in Z2T but this parameter needs to be set)<BR>`"KeyL":<key_l>,"KeyH":<key_h>`: 128 bits encryption key, split into 2 64 bits values (Low and High)<BR>`"TXRadio":<txradio>`: radion power in dBm (1-20) only for ZBBridge<BR>All parameters are optional and only the ones specified are changed. The command always displays the complete configuration after the change<BR>Example of command: ```ZbConfig {"Channel":22,"PanID":"0x1A69","ExtPanID":"0xDDCCCCCCCCCCCCCC","KeyL":"0xFF0D0B0907050301","KeyH":"0xED0C0A0806040200"}```<BR>The following command creates a highly secure Network key based on a hardware random generator:<BR>```ZbConfig {"KeyL":"","KeyH":""}```
ZbData<a class="cmnd" id="zbdata"></a>|feature in development
ZbDeviceTopic<a class="cmnd" id="zbdevicetopic"></a><BR>SetOption89<a class="cmnd" id="setoption89"></a>|Configure MQTT topic for Zigbee devices (also see `SensorRetain`)<BR>`0` = single `tele/%topic%/SENSOR` topic _(default)_ <BR>`1` = unique device topic based on Zigbee device ShortAddr<br>_Example:_ `tele/Zigbee/5ADF/SENSOR = {"ZbReceived":{"0x5ADF":{"Dimmer":254,"Endpoint":1,"LinkQuality":70}}}`
EndpointTopic<a class="cmnd" id="endpointtopic"></a><BR>SetOption101<a class="cmnd" id="setoption101"></a>|Add Zigbee source endpoint as suffix to attributes<BR>`0` = disable _(default)_ <BR>`1` = enable<BR>e.g. `Power3` instead of `Power` if sent from endpoint `3`.
ZbEndpointSuffix<a class="cmnd" id="zbendpointsuffix"></a><BR>SetOption120<a class="cmnd" id="setoption120"></a>|Add the Zigbee endpoint as suffix in topic when using `SetOption89 1`<BR>`0` = disable *(default)*<BR>`1` = enable
ZbForget<a class="cmnd" id="zbforget"></a>|Used for devices that are unused but still visible in `ZbStatus`<BR>`<device>` = Remove a device from the Tasmota flash memory. It does not un-pair the device nor deleting the device information in the CC2530/ZBBridge.
ZbLight<a class="cmnd" id="zblight"></a>|Sets or reads the light type to be emulated in Zigbee Hue Emulation with Alexa.<BR>`<device>,<light_type>` sets the light type using an integer `0..5` corresponding to the number of channels (from one channel (on/off) to 5 channel (RGBCCT) lights)<BR>`<device>,-1` removes the device from Philips Hue emulation<BR>`<device>` displays the current status of the Light (Zigbee2Tasmota tracks all changes to the light)
ZbListen&#60;x> &#60;group>|(EZSP ZBBridge only)Listens to a multicast group address. By default EZSP will not report group messages unless you subscribe to the group.<BR>`<x>`: slot in the array of group addresses, 1..15<BR>`<group>`: group address to listen to, 0..0xFFFF<BR>At start-up, Z2T automatically listns to groupe 0 in slot 0.<BR>CC2530 does not need this command and always report all group messages.
ZbMap&#60;n><a class="cmnd" id="zbmap"></a>|Asks the device for its view of the Zigbee topology<BR>`<device>` the device to query<BR>`<n>` the start index for the request, `1` is the default. This is used to scan through all values since devices usually return only 3 values per request.
ZbName<a class="cmnd" id="zbname"></a>|Sets or reads the Zigbee device friendly name (up to 32 characters).<BR>`<device>,<name>` sets the new friendly name<BR>`<device>,` (empty name) clears the friendly name<BR>`<device>` displays the current friendly name<BR>Also see [`SetOption83 1`](#setoption83) to enable friendly names as JSON keys instead of ShortAddr.
ZbNameKey<a class="cmnd" id="zbnamekey"></a><BR>SetOption83<a class="cmnd" id="setoption83"></a>|Uses Zigbee device friendly name instead of 16 bits short addresses as JSON key when reporting values and commands<BR>`0` = JSON key as short address<BR>`1` = JSON key as friendly name<BR>See [`ZbName <device>,<name>`](#zbname)
ZbNameTopic<a class="cmnd" id="zbnametopic"></a><BR>SetOption112<a class="cmnd" id="setoption112"></a>|`0` = _(default)_<BR>`1` = use friendly name in Zigbee topic (use with [`ZbDeviceTopic`](#zbdevicetopic))
ZbNoAutoBind<a class="cmnd" id="zbnoautobind"></a><BR>SetOption110<a class="cmnd" id="setoption110"></a>|`0` = _(default)_<BR>`1` = disable Zigbee auto-binding and auto-attribute reporting when pairing a new device. Use only if you want to manually configure devices
ZbNoPrefix<a class="cmnd" id="zbnoprefix"></a><BR>SetOption100<a class="cmnd" id="setoption100"></a>|remove Zigbee `ZbReceived` value from `{"ZbReceived":{xxx:yyy}}` JSON message<BR>`0` = disable _(default)_ <BR>`1` = enable     
ZbOccupancy<a class="cmnd" id="zboccupancy"></a>|Configure the time-out after `"Occupancy":1` to send a synthetic `"Occupancy":0` for Zigbee motion sensors<BR>`<device>,<x>` - set occupancy timeout for `<device>`<BR>Possible values for `<x>`<br>`0`: no time-out, the device actually generates "Occupancy":0<br>`n`: the number of seconds. The possible values are 15, 30, 45, 60, 75, 90, 105, 120. If the number is different, it is rounded up<br>`-1`: apply the default of 90 seconds
ZbOmitDevice<a class="cmnd" id="zbomitdevice"></a><BR>SetOption119<a class="cmnd" id="setoption119"></a>|Remove device addr from JSON payload<BR>`0` = disable *(default)*<BR>`1` = enable
ZbPermitJoin<a class="cmnd" id="zbpermitjoin"></a>|Sets pairing mode for new device discovery<BR>`0` = disable pairing mode<BR>`1` = enable pairing mode for 60 seconds<BR>`99` = enable pairing until device reboots (CC2530 only)<BR>:rotating_light: Leaving Zigbee network open to join will allow any Zigbee device to connect and retrieve your network encryption key. This can lead to a compromise of your Zigbee network.
ZbPing<a class="cmnd" id="zbping"></a>|`<device>` = test availability of Zigbee device. If the device is connected and not sleeping, you should receive a `ZbPing` message within the next second.<BR>Example: `ZbPing 0x5ADF` responds with:<br> `{"ZbPing":{"Device":"0x5ADF","IEEEAddr":"0x90FD9FFFFE03B051"}}`
ZbReceivedTopic<a class="cmnd" id="zbreceivedtopic"></a><BR>SetOption118<a class="cmnd" id="setoption118"></a>|Move ZbReceived from JSON message into the subtopic replacing "SENSOR" default<BR>`0` = disable *(default)*<BR>`1` = enable
ZbSend<a class="cmnd" id="zbsend"></a>|Command structure: `{"Device":"<shortaddr>", "Endpoint":"<endpoint>", "Manuf":<manuf>, "Send":{"<sendcmd>":<sendparam>}}`<BR>`<shortaddr>` = short address of the Zigbee device on the network<BR>`<endpoint>` = target endpoint on the device ([understanding endpoints](Zigbee#understanding-endpoints-and-clusters))<BR>`<manuf>` = (optional) forces a specific ManufacturerId in the ZCL frame (required by some Xiaomi devices)<BR>`"<sendcmd>":<sendparam>` = command and parameters to send ([Zigbee Device Commands](Zigbee#sending-device-commands))<BR>:notebook: _Use [`ZbZNPSend`](#zbznpsend) to send a raw form low-level message on CC253x gateways _<BR>Example: `ZbSend { "Device":"0x1234", "Endpoint":"0x03", "Send":{"Power":"on"} }`
ZbScan<a class="cmnd" id="zbscan"></a>|Do an energy scan on each radio channel
ZbStatus&#60;x><a class="cmnd" id="zbstatus"></a>|Display Zigbee devices seen on the network since boot<BR>`<device>` (optional)<BR>` ` = all devices<BR>This command provides three levels of increasing detail according to `<x>`<BR>`ZbStatus1` Display Short Address, and Friendly Name<BR>`ZbStatus2` Also include Manufacturer ID and Model ID<BR>`ZbStatus3` Also include a list of endpoints and the clusterIds supported by each endpoint<BR>Example: `ZbStatus3 1` requests all details for device number 1<BR>:notebook: Requested information may exceed maximum result size allowed by Tasmota. In this case, the output will be truncated. To get all of the desired information, request results for a specific device individually.
ZbUnbind<a class="cmnd" id="zbunbind"></a>|Unbinds one Zigbee device from another or from a group. <BR>`{"Device":"<device>", "Endpoint":<endpoint>, "Cluster":<cluster>, "ToDevice":"<to_device>", "ToEndpoint":<to_endpoint>, "ToGroup":<to_group> }`<BR>`<device>` = the device sending the messages **(mandatory)**<BR>`<endpoint>` = the source endpoint **(mandatory)**<BR>`<cluster>` = the source cluster id **(mandatory)**<BR>`<to_device>` = the target device (optional)<BR>`<to_endpoint>` = the target endpoint (optional if it can be inferred from `ZbStatus3`)<BR>`<to_group>` = the target group id (optional)<BR>:notebook: You must specify either `"ToDevice"` or `"ToGroup"` but not both<BR>:notebook: Zigbee2Tasmota must know the IEEE address of the target device, use `ZbStatus2` to verify and `ZbProbe` to query the address.
See also| [`SetOption83`](#setoption83), [`SetOption89`](#setoption89), [`SetOption100`](#setoption100), [`SetOption101`](#setoption101)


#### Zigbee Debug Functions
:warning: :warning: :warning: **Do not use unless you know exactly what you are doing.** :warning: :warning: :warning:

Command|Parameters
:---|:---
ZbModelId<a class="cmnd" id="zbmodelid"></a>|Manually force the `ModelId` field of a Zigbee device. This is used to simulate devicesnot physically present on the network, for debugging only.<BR>`<device>,<modelid>` = set new ModelId<BR>`<device>,` = (empty modelid) clear ModelId<BR>`<device>` = display current ModelId (also displayed in `ZbStatus2`)
ZbProbe<a class="cmnd" id="zbprobe"></a>|`<device>`= probe a Zigbee device to get additional information including its IEEEaddress, vendor and model names, endpoints, and supported clusters per endpoint.<BR>Device probe is performed automatically when a new Zigbee device connects.<BR>Battery powered Zigbee devices can not be probed in general because they are usually in sleep mode.
ZbRead<a class="cmnd" id="zbread"></a>|[Removed](https://github.com/arendst/Tasmota/pull/8572) in favor of `ZbSend` with "Read" attribute.
ZbReset<a class="cmnd" id="zbreset"></a>|`1` = perform a factory reset and reconfiguration of the CC2530 chip.<BR>:warning: **You will need to re-pair all Zigbee devices**
ZbRestore<a class="cmnd" id="zbrestore"></a>|Restores a device configuration previously dumped with `ZbStatus2`. This command does not pair a device, but lets you get back device configuration like ModelId or IEEEAddress.<BR>`<json>` = json contains the fields dumped with `ZbStatus2`. `<json>` can contain multiple devices (if they fit).
ZbSave &#60;hex><a class="cmnd" id="zbsave"></a>|Forces saving the Zigbee device information to Flash. Auto-saving happens 10 seconds after a new Device parameter was changed, this command is normally not useful
ZbZNPSend &#60;hex><a class="cmnd" id="zbznpsend"></a>|(CC2530 only) Send a raw ZCL message to a Zigbee device. This is a low-level command, and requires to manually build the ZCL parameters. Most common usage will be provided as high-level functions.
ZbZNPReceive <hex><a class="cmnd" id="zbznpreceive"></a>|(CC2530 only) Simulates a received message<BR>`<hex>` = hex string of the simulated message, same format as `ZbZNPReceived` debug logs
ZbEZSPSend&#60;x> &#60;hex><a class="cmnd" id="zbezspsend"></a>|(EZSP only) Send a raw EZSP message. This is a low-level command, and requires to manually build the ZCL parameters. Most common usage will be provided as high-level functions.<BR>`<x>`: `1`=high-level EZSP command, `2`=low-level EZSP frame, `3`=low-level EZSP/ASH frame<BR>`<hex>` = hex string of the message
ZbEZSPReceive&#60;x> &#60;hex><a class="cmnd" id="zbezspreceive"></a>|(EZSP only) Simulates a received message<BR>`<x>`: `1`=high-level EZSP command, `2`=low-level EZSP frame, `3`=low-level EZSP/ASH frame<BR>`<hex>` = hex string of the simulated message, same format as `ZbZNPReceived` debug logs

### Bluetooth

Command|Parameters
:---|:---
HM10Scan<a class="cmnd" id="hm10scan"></a>|Start a new device discovery scan
HM10Period<a class="cmnd" id="hm10period"></a>|Show interval in seconds between sensor read cycles. Set to TelePeriod value at boot.<BR>|`<value>` = set interval in seconds
HM10Baud<a class="cmnd" id="hm10baud"></a>|Show ESP8266 serial interface baudrate (***Not HM-10 baudrate***)<BR>`<value>` = set baudrate
HM10AT<a class="cmnd" id="hm10at"></a>|`<command>` = send AT commands to HM-10. See [list](http://www.martyncurrey.com/hm-10-bluetooth-4ble-modules/#HM-10%20-%20AT%20commands)
HM10Time <a class="cmnd" id="hm10time"></a>|`<n>` = set time time of a **LYWSD02 only** sensor to Tasmota UTC time and timezone. `<n>` is the sensor number in order of discovery starting with 0 (topmost sensor in the webUI list).
HM10Auto <a class="cmnd" id="hm10auto"></a>|`<value>` = start an automatic discovery scan with an interval of  `<value>` seconds to receive data in BLE advertisements periodically.<BR>This is an active scan and it should be used **only if necessary**. At the moment that is the case just with MJ_HT_V1. This can change if a future HM-10 firmware starts supporting passive scan.
NRFBeacon<a id="nrfbeacon"></a>| Set a BLE device as a beacon using the (fixed) MAC-address<BR>`<value>` (1-3 digits) = use beacon from scan list<BR>`<value>` (12 characters) = use beacon given the MAC interpreted as an uppercase string `AABBCCDDEEFF`
NRFIgnore<a id="nrfignore"></a>|`0` = all known sensor types active_(default)_<BR>`<value>` =  ignore certain sensor type (`1` = Flora, `2` = MJ_HT_V1, `3` = LYWSD02, `4` = LYWSD03, `5` = CGG1, `6` = CGD1
NRFKey<a id="nrfkey"></a>| Set a "bind_key" for a MAC-address to decrypt (LYWSD03MMC & MHO-C401). The argument is a 44 uppercase characters long string, which is the concatenation of the bind_key and the corresponding MAC.<BR>`<00112233445566778899AABBCCDDEEFF>` (32 characters) = bind_key<BR>`<112233445566>` (12 characters) = MAC of the sensor<BR>`<00112233445566778899AABBCCDDEEFF112233445566>` (44 characters)= final string
NRFMjyd2s<a id="nrfmjyd2s"></a>| Set a "bind_key" for a MAC-address to decrypt sensor data of the MJYD2S. The argument is a 44 characters long string, which is the concatenation of the bind_key and the corresponding MAC.<BR>`<00112233445566778899AABBCCDDEEFF>` (32 characters) = bind_key<BR>`<112233445566>` (12 characters) = MAC of the sensor<BR>`<00112233445566778899AABBCCDDEEFF112233445566>` (44 characters)= final string
NRFNlight<a id="nrfnlight"></a>| Set the MAC of an NLIGHT<BR>`<value>` (12 characters) =  MAC interpreted as an uppercase string `AABBCCDDEEFF`
NRFPage<a id="nrfpage"></a>|Show the maximum number of sensors shown per page in the webUI list.<BR>`<value>` = set number of sensors _(default = 4)_
NRFScan<a id="nrfscan"></a>| Scan for regular BLE-advertisements and show a list in the console<BR>`0` = start a new scan list<BR>`1` = append to the scan list<BR>`2` = stop running scan

### Stepper Motors

Command|Parameters
:---|:---
MotorMIS<a class="cmnd" id="motormis"></a>|`1,2,4,8,16` Set micro stepping increment - 1/1 (full steps) to 1/16 *(default = `1`)*
MotorSPR<a class="cmnd" id="motorspr"></a>|`integer` Set the number of steps the given motor needs for one revolution *(default = `200`)*<BR>This is dependent on the type of motor and micro stepping. Most common motors are 1.8° per step.
MotorRPM<a class="cmnd" id="motorrpm"></a>|`1..300` Set revolutions per minute *(default = `30`)*
MotorMove<a class="cmnd" id="motormove"></a>|`integer` Move the motor the given number of steps (positive values: clockwise, negative values: counterclockwise)
MotorRotate<a class="cmnd" id="motorrotate"></a>|`integer` Rotate the motor the given number of degrees (positive values: clockwise, negative values: counterclockwise)
MotorTurn<a class="cmnd" id="motorturn"></a>|`float` Spin the motor the given number of turns (positive values: clockwise, negative values: counterclockwise)

### MP3 Player

The MP3 Player driver is based on the one from DFRobot. They named it [DFPlayer mini](https://www.dfrobot.com/wiki/index.php/DFPlayer_Mini_SKU:DFR0299). All MP3 Players with the identical Serial Control Command structure can be used.

!!! Note
    Player module pin RX should be connected to a GPIO defined as "MP3 Player" from the drop-down list. The driver uses a Software Serial and do not requires usage of hardware TX/RX pins.

Command|Parameters
:---|:---
MP3DAC<a class="cmnd" id="MP3DAC"></a>|`0` = DAC on *(default)*<BR>`1` = DAC off
MP3Device<a class="cmnd" id="MP3Device"></a>|Specify playback device<BR>`1` = USB<BR>`2` = SD Card *(default (also defaults on reset or power cycle))*
MP3EQ<a class="cmnd" id="MP3EQ"></a>|Set equalizer mode:<BR>`0` = normal<BR>`1` = pop<BR>`2` = rock<BR>`3` = jazz<BR>`4` = classic<BR>`5` = bass)
MP3Pause<a class="cmnd" id="MP3Pause"></a>|Pause
MP3Play<a class="cmnd" id="MP3Play"></a>|Play, works as a normal play on a real MP3 Player, starts at first MP3 file
MP3Reset<a class="cmnd" id="MP3Reset"></a>|Reset the MP3 player to defaults
MP3Stop<a class="cmnd" id="MP3Stop"></a>|Stop
MP3Track<a class="cmnd" id="MP3Track"></a>|`x` = play track <x\>
MP3Volume<a class="cmnd" id="MP3Volume"></a>|`0..100` = set Volume

### Thermostat

Command|Parameters
:---|:---
ThermostatModeSet<x><a class="cmnd" id="ThermostatModeSet"></a>|Sets the thermostat mode<BR> `0` = Thermostat Off (controller inactive, default)<BR> `1` = Thermostat in automatic mode (controller active)<BR> `2` = Thermostat in manual mode (output switch follows the input switch, used to follow an existing wall thermostat)</ul>
ClimateModeSet<x><a class="cmnd" id="ClimateModeSet"></a>|Sets the climate mode<BR> `0` = Heating mode (default)<BR> `1` = Cooling mode</ul>
ControllerModeSet<x><a class="cmnd" id="ControllerModeSet"></a>|Sets the controller mode (used for thermostat in automatic mode)<BR> `0` = Hybrid controller (Predictive ramp-up controller and PI, default)<BR> `1` = PI controller<BR> `2` = Predictive ramp-up controller</ul>
TempFrostProtectSet<x><a class="cmnd" id="TempFrostProtectSet"></a>|Sets the frost protection temperature. The controller, if in automatic mode, will never allow the temperature to sink below this value<BR> `<0..12>` = Temperature value in degrees Celsius/Fahrenheit (default 4.0° Celsius) </ul>
InputSwitchSet<x><a class="cmnd" id="InputSwitchSet"></a>|Sets the number of the input used in case in manual control<BR> `<1..4>` = Number of the input (default 1)</ul>
InputSwitchUse<x><a class="cmnd" id="InputSwitchUse"></a>|Switch to decide if the input shall be used to automatically switch to manual mode and assign it to the output (usefull if using a serially connected wall thermostat)<BR> `0` = Input not used (default)<BR> `1` = Input used</ul>
SensorInputSet<x><a class="cmnd" id="SensorInputSet"></a>|Sets the temperature sensor to be used<BR> `0` = MQTT (default)<BR> `1` = Local sensor (can be changed by define, default DS18B20)</ul>
OutputRelaySet<x><a class="cmnd" id="OutputRelaySet"></a>|Sets the output switch to be used for the thermostat<BR> `<1..8>` = Number of the output (default 1)</ul>
EnableOutputSet<x><a class="cmnd" id="EnableOutputSet"></a>|Enables or disables the physical output<BR> `0` = Output disabled<BR> `1` = Output enabled (default)</ul>
TimeAllowRampupSet<x><a class="cmnd" id="TimeAllowRampupSet"></a>|Sets the minimum time in minutes since the last control action to be able to switch to the predictive ramp-up controller phase (applicable just in case of Hybrid controller, used normally in case of big deltas between the setpoint and the room temperature)<BR> `<value>` = Minutes (default 300 minutes) </ul>
TempFormatSet<x><a class="cmnd" id="TempFormatSet"></a>|Sets the temperature format<BR> `0` = Degrees celsius (default)<BR> `1` = Degrees Fahrenheit</ul>
TempMeasuredSet<x><a class="cmnd" id="TempMeasuredSet"></a>|Sets the temperature measured by the sensor (for MQTT sensor mode)<BR> `<TempFrostProtectSet..100>` = Temperature (default 18.0° Celsius) </ul>
TempTargetSet<x><a class="cmnd" id="TempTargetSet"></a>|Sets the target temperature for the controller (setpoint)<BR> `<TempFrostProtectSet..100>` = Temperature (default 18.0° Celsius) </ul>
TempMeasuredGrdRead<x><a class="cmnd" id="TempMeasuredGrdRead"></a>|Returns the calculated temperature gradient<BR> `<value>` = Temperature gradient in degrees Celsius/Fahrenheit </ul>
StateEmergencySet<x><a class="cmnd" id="StateEmergencySet"></a>|Sets the thermostat emergency flag<BR> `0` = Emergency flag off (default)<BR> `1` = Emergency flag on (thermostat switches to off state)</ul>
TimeManualToAutoSet<x><a class="cmnd" id="TimeManualToAutoSet"></a>|Sets the time in manual mode after the last active input  action (f.i. last action from serial connected wall thermostat) to switch to aumatic mode<BR> `0..1440` = time in minutes (default 60 minutes)</ul>
PropBandSet<x><a class="cmnd" id="PropBandSet"></a>|Sets the value of the proportional band of the PI controller<BR> `0..20` = value in degrees Celsius (default 4 degrees Celsius)</ul>
TimeResetSet<x><a class="cmnd" id="TimeResetSet"></a>|Sets the value of the reset time of the PI controller<BR> `0..86400` = value in seconds (default 12000 seconds)</ul>
TimePiProportRead<x><a class="cmnd" id="TimePiProportRead"></a>|Returns the proportional part of the PI controller calculation in seconds<BR> `value` = value in seconds</ul>
TimePiIntegrRead<x><a class="cmnd" id="TimePiIntegrRead"></a>|Returns the integral part of the PI controller calculation in seconds<BR> `value` = value in seconds</ul>
TimePiCycleSet<x><a class="cmnd" id="TimePiCycleSet"></a>|Sets the value of the cycle for the PI controller<BR> `0..1440` = value in minutes (default 30 minutes)</ul>
TempAntiWindupResetSet<x><a class="cmnd" id="TempAntiWindupResetSet"></a>|Sets the value of the delta between controlled temperature and setpoint above which the integral part of the PI controller will be set to 0, in degrees Celsius/Fahrenheit<BR> `0..10` = value in degrees (default 0.8° Celsius)</ul>
TempHystSet<x><a class="cmnd" id="TempHystSet"></a>|Sets the value of the temperature hysteresis for the PI controller, in degrees Celsius/Fahrenheit<BR> `-10..10` = value in degrees (default 0.1° Celsius)</ul>
TimeMaxActionSet<x><a class="cmnd" id="TimeMaxActionSet"></a>|Sets the maximum duty cycle of the PI controller in minutes<BR> `0..1440` = value in minutes (default 20 minutes)</ul>
TimeMinActionSet<x><a class="cmnd" id="TimeMinActionSet"></a>|Sets the minimum duty cycle of the PI controller in minutes<BR> `0..1440` = value in minutes (default 4 minutes)</ul>
TimeSensLostSet<x><a class="cmnd" id="TimeSensLostSet"></a>|Sets the maximum time without a temperature sensor update to mark it as lost in minutes<BR> `0..1440` = value in minutes (default 30 minutes)</ul>
TimeMinTurnoffActionSet<x><a class="cmnd" id="TimeMinTurnoffActionSet"></a>|Sets the minimum time in minutes within a cycle for the PI controller to switch off the output, below it, it will stay on<BR> `0..1440` = value in minutes (default 3 minutes)</ul>
TempRupDeltInSet<x><a class="cmnd" id="TempRupDeltInSet"></a>|Sets the minimum delta between controlled temperature and setpoint for the controller to switch to ramp-up controller phase (applicable just in Hybrid controller mode)<BR> `0..10` = value in degrees Celsius/Fahrenheit (default 0.4° Celsius)</ul>
TempRupDeltOutSet<x><a class="cmnd" id="TempRupDeltOutSet"></a>|Sets the maximum delta between controlled temperature and setpoint for the controller to switch to the PI controller phase (applicable just in Hybrid controller mode)<BR> `0..10` = value in degrees Celsius/Fahrenheit (default 0.2° Celsius)</ul>
TimeRampupMaxSet<x><a class="cmnd" id="TimeRampupMaxSet"></a>|Sets the maximum time in minutes for the controller to stay in the ramp-up phase (applicable just in Hybrid controller mode<BR> `0..1440` = value in minutes (default 960 minutes)</ul>
TimeRampupCycleSet<x><a class="cmnd" id="TimeRampupCycleSet"></a>|Sets the value of the cycle for the ramp-up controller<BR> `0..1440` = value in minutes (default 30 minutes)</ul>
TempRampupPiAccErrSet<x><a class="cmnd" id="TempRampupPiAccErrSet"></a>|Sets the initial accumulated error when switching from ramp-up to the PI controller phase if the target temperature has not been reached (applicable just in Hybrid controller mode)<BR> `0..25` = value in degrees Celsius/Fahrenheit (default 2° Celsius)</ul>
CtrDutyCycleRead<x><a class="cmnd" id="CtrDutyCycleRead"></a>|Returns the duty cycle of the controller<BR> `0..100` = value in %</ul>
DiagnosticModeSet<x><a class="cmnd" id="DiagnosticModeSet"></a>|Enables/disables the diagnostics flag<BR> `0` = Diagnostics disabled<BR> `1` = Diagnostics enabled (default)</ul>

### Domoticz

Command|Parameters
:---|:---
<a class="cmnd" id="dzidx"></a>DzIdx<x\>|Show Domoticz Relay idx <x\> (x = `1..4`)<BR>`0` = disable use of Relay idx <x\> *(default)*<BR>`<value>` = Show Relay idx <x\>
<a class="cmnd" id="dzkeyidx"></a>DzKeyIdx<x\>|Show Domoticz Key idx <x\> (x = `1..4`)<BR>`0` = disable use of Key idx <x\> *(default)*<BR>`<value>` = Show Key idx <x\> (to use enable [ButtonTopic](#buttontopic))
<a class="cmnd" id="dzsend"></a>DzSend<type\>|send values or state to Domoticz<BR>`<index>,<value1(;value2)|state>`
<a class="cmnd" id="dzsensoridx"></a>DzSensorIdx<x\>|Show Domoticz Sensor idx <x\> (x = `1..5`)<BR>`0` = disable use of Sensor idx <x\> *(default)*<BR>`<value>` = Show Sensor idx <x\>
<a class="cmnd" id="dzswitchidx"></a>DzSwitchIdx<x\>|Show Domoticz Switch idx <x\> (x = `1..4`)<BR>`0` = disable use of Switch idx <x\> *(default)*<BR>`<value>` = Show Switch idx <x\> (to use enable [SwitchTopic](#switchtopic))
<a class="cmnd" id="dzupdatetimer"></a>DzUpdateTimer|Show current update timer value in seconds<BR>`0` = disable sending interim Domoticz status *(default)*<BR>`1..3600` = send status to Domoticz in defined intervals

### InfluxDB

Command|Parameters
:---|:---
Ifx<a class="cmnd" id="ifx"></a>|InfluxDB state<BR>`0` = off<br> `1` = on
IfxHost<a class="cmnd" id="ifxhost"></a>|`<value>` =  set Influxdb host name or IP address
IfxPort<a class="cmnd" id="ifxport"></a>|`<value>` =  set Influxdb port
IfxDatabase<a class="cmnd" id="ifxdatabase"></a>|`<value>` =  set Influxdb V1 and database name
IfxUser<a class="cmnd" id="ifxuser"></a>|`<value>` =  set Influxdb V1 and userid
IfxPassword<a class="cmnd" id="ifxpassword"></a>|`<value>` =  set Influxdb V1 and password
IfxBucket<a class="cmnd" id="ifxbucket"></a>|`<value>` =  set Influxdb V2 and bucket name
IfxOrg<a class="cmnd" id="ifxorg"></a>|`<value>` =  set Influxdb V2 and organization
IfxToken<a class="cmnd" id="ifxtoken"></a>|`<value>` =  set Influxdb V2 and token
 |TelePeriod sets InfluxDB update interval



### KNX

Command|Parameters
:---|:---
KnxTx_Cmnd<x\><a class="cmnd" id="KnxTx_Cmnd"></a>|`0` or `1` = send command using slot <x\> set in KNX Menu at KNX_TX
KnxTx_Val<x\><a class="cmnd" id="KnxTx_Val"></a>|`<value>` = send float value using slot <x\> set in KNX Menu at KNX_TX
KnxTx_Scene<a class="cmnd" id="KnxTx_Scene"></a>|`<value>` = send scene number to the GA set in KNX Menu
KNX_ENABLED<a class="cmnd" id="KNX_ENABLED"></a>|Status of KNX Communications<BR>`0` = set to Disable<BR>`1` = set to Enable
KNX_ENHANCED<a class="cmnd" id="KNX_ENHANCED"></a>|Status of Enhanced mode for KNX Communications<BR>`0` = set to Disable<BR>`1` = set to Enable
KNX_PA<a class="cmnd" id="KNX_PA"></a>|KNX Physical Address<BR>`0.0.0` = address not set<BR>`x.x.x` = set the device address (example `1.1.0`)
KNX_GA<a class="cmnd" id="KNX_GA"></a>|Return the amount of Group Address to Send Data/Commands configured
KNX_GA<x\><a class="cmnd" id="KNX_GAx"></a>|Setup Group Address to Send Data/Commands (<x\> = KNX Group Address number)<BR>`1` = return configuration of GA<x\><BR>`<option>, <area>, <line>, <member>` to set configuration of GA<x\><BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`<option>` = see table below for OPTION list<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`<area>, <line>, <member>` = KNX Address to Send Data/Commands<BR>
KNX_CB<a class="cmnd" id="KNX_CB"></a>|Return the amount of Group Address to Receive Data/Commands configured
KNX_CB<x\><a class="cmnd" id="KNX_CBx"></a>|Setup Group Address to Receive Data/Commands <BR>`1` = return configuration of CB<x\><BR>`<option>, <area>, <line>, <member>` to set configuration of CB<x\><BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`<option>` = see table below for OPTION list<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`<area>, <line>, <member>` = KNX Address to Receive Data/Commands

OPTION|OPTION<BR>Value|<BR>OPTION|OPTION<BR>Value
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

## ESP32

### BLE ESP32

Command|Parameters
:---|:---
BLEAddrFilter<a class="cmnd" id="bleaddrfilter"></a>|Set BLE Address type filter.<BR>`BLEAddrFilter` = show filter level<BR>`BLEAddrFilter n` = set BLE address type filter 0..3 - default 3.  Ignores BLE address types > filter value.  Set 0 to ONLY see public addresses.
BLEAlias<a class="cmnd" id="blealias"></a>|Set Alias names for devices.  A device may be referred to by it's alias in subsequent commands<BR>`BLEAlias mac=alias mac=alias ...` = set one or more aliases from devices.<BR>`BLEAlias2` = clear all aliases.
BLEDebug<a class="cmnd" id="bledebug"></a>|Set BLE debug level.<BR>`BLEDebug` = show extra debug information<BR>`BLEDebug0` = suppress extra debug
BLEDetails<a class="cmnd" id="bledetails"></a>|Display details about recevied adverts<BR>`BLEDetails0` = disable showing of details.<BR>`BLEDetails1 mac|alias` = show the next advert from device mac|alias<BR>`BLEDetails2 mac|alias` = show all advert from device mac|alias (some may be lost).<BR>`BLEDetails3` = show all adverts from all devices (some will be lost).
BLEDevices<a class="cmnd" id="bledevices"></a>|Cause a list of known devices to be sent on MQTT, or Empty the list of known devices.<BR>`BLEDevices0` = clear the known devices list.<BR>`BLEDevices` = Cause the known devices list to be published on stat/TASName/BLE.
BLEMaxAge<a class="cmnd" id="blemaxage"></a>|Set the timeout for device adverts.<BR>`BLEMaxAge n` = set the devices timeout to n seconds.<BR>`BLEMaxAge` = display the device timeout.
BLEMode<a class="cmnd" id="blemode"></a>|Change the operational mode of the BLE driver.<BR>`BLEMode0` = disable regular BLE scans.<BR>`BLEMode1` = BLE scan on command only.<BR>`BLEMode2` = regular BLE scanning (default).
BLEName<a class="cmnd" id="blename"></a>|Read or write the name of a BLE device.<BR>`BLEName mac|alias` = read the name of a device using 1800/2A00.<BR>`BLEName mac|alias` = write the name of a device using 1800/2A00 - many devices are read only.
BLEOp<a class="cmnd" id="bleop"></a>|Perform a simple active BLE operation (read/write/notify).<BR>see separate description in source code
BLEPeriod<a class="cmnd" id="bleperiod"></a>|Set the period for publish of BLE data<BR>`<value>` = set interval in seconds
BLEScan<a class="cmnd" id="blescan"></a>|Cause/Configure BLE a scan<BR>`BLEScan0 0..1` = enable or disable Active scanning. (an active scan will gather extra data from devices, including name)<BR>`BLEScan` = Trigger a 20s scan now if in BLEMode1<BR>`BLEScan n` = Trigger a scan now for n seconds if in BLEMode1
iBeacon<a class="cmnd" id="ibeacon"></a>|Show or set enable for the iBeacon driver<BR>`iBeacon` = Display 0|1<BR>`iBeacon 0` = disable<BR>`iBeacon 1` = enable.
iBeaconClear<a class="cmnd" id="ibeaconclear"></a>|Clear iBeacon list
iBeaconOnlyAliased<a class="cmnd" id="ibeacononlyaliased"></a>|Show or set OnlyAliased for the iBeacon driver<BR>`iBeaconOnlyAliased` = Display 0|1<BR>`iBeaconOnlyAliased 0` = enable iBeacon to hear ALL BLE devices<BR>`iBeaconOnlyAliased 1` = enable iBeacon to hear ONLY devices with valid BLEAlias<BR>`iBeaconOnlyAliased 2` = enable iBeacon to hear ONLY devices with valid BLEAlias starting `iB`
iBeaconPeriod<a class="cmnd" id="ibeaconperiod"></a>|Display or Set the period for publish of iBeacon data<BR>`iBeaconPeriod` = display interval<BR>`iBeaconPeriod ss` = set interval in seconds
iBeaconTimeout<a class="cmnd" id="ibeacontimeout"></a>|Display or Set the timeout for iBeacon devices<BR>`iBeaconTimeout` = display timeout<BR>`iBeaconTimeout ss` = set timeout in seconds

### BLE MI Sensors 

Command|Parameters
:---|:---
MI32Battery<a class="cmnd" id="mi32battery"></a>|Trigger an active read of battery values.<BR>`MI32Battery` = request the driver read the battery from all sensors which have active battery read requirements.
MI32Block<a class="cmnd" id="mi32block"></a>|Block or unblock a sensor device.<BR>`MI32Block` = list blocked devices by mac.<BR>`MI32Block <mac or blealias>` = Block one mac/alias.
MI32Key<a class="cmnd" id="mi32key"></a>|Add a decryption key.<BR>`MI32Key hexkey` = add a 44 character decryption key to the keys list.
MI32Keys<a class="cmnd" id="mi32keys"></a>|Add one or more decryption keys by mac or alias.<BR>`MI32Keys` = list keys.<BR>`MI32Keys <mac or blealias>=<bind_key> <mac or blealias>=<bind_key> ...` = add keys for MAC or ble_alias.<BR>`MI32Keys <mac or blealias>=` - remove keys for one mac|alias.<BR>`MI32Keys2` - remove all keys.
MI32Option<x\> n<a class="cmnd" id="mi32option"></a>| Set driver options at runtime<BR> `x=0` - 0 -> sends only recently received sensor data, 1 -> aggregates all recent sensors data types<BR>`x=1` - 0 -> shows full sensor data at TELEPERIOD, 1 -> shows no sensor data at TELEPERIOD<BR>`x=2` - 0 -> sensor data only at TELEPERIOD (default and "usual" Tasmota style), 1 -> direct bridging of BLE-data to mqtt-messages<BR>`x=5` - 0 -> show all relevant BLE sensors, 1 -> show only sensors with a BLEAlias<BR>x=6 (from v 9.0.2.1) 1 -> always use MQTT Topic like `tele/tasmota_ble/<name>` containing only one sensor
MI32Page<a class="cmnd" id="mi32page"></a>|Display/Set the sensors per page in the web view.<BR>`MI32page` = show sensors per page.<BR>`MI32page n` = Set sensors per page to n.
MI32Period<a class="cmnd" id="mi32period"></a>|Display/Set the active scan and tele period for the MI32 driver.<BR>`MI32Period` = display the period in seconds.<BR>`MI32Period n` = Set the MI driver active read and tele period to n seconds.
MI32Time<a class="cmnd" id="mi32time"></a>|`<x>` = set the time on the device in slot `x`.
MI32Unit<a class="cmnd" id="mi32unit"></a>|`<x>` = set the current Tasmota temperature unit as the temp unit for sensor in slot `x`.

### Camera

Command|Parameters
:---|:---
Wc<a class="cmnd" id="wc"></a>|Query all camera settings
WcBrightness<a class="cmnd" id="wcbrightness"></a>|`-2..+2` = set picture brightness
WcContrast<a class="cmnd" id="wccontrast"></a>|`-2..+2` = set picture contrast
WcMirror<a class="cmnd" id="wcmirror"></a>|Mirror camera. <BR>`0` = disable *(default)*<BR>`1` = enable
WcResolution<a class="cmnd" id="wcresolution"></a>|Set camera resolution.<BR>`0` = 96x96 (96x96)<BR>`1` = QQVGA2 (128x160)<BR>`2` = QCIF (176x144)<BR>`3` = HQVGA (240x176)<BR>`4` = QVGA (320x240)<BR>`5` = CIF (400x296)<BR>`6` = VGA (640x480)<BR>`7` = SVGA (800x600)<BR>`8` = XGA (1024x768)<BR>`9` = SXGA (1280x1024)<BR>`10` = UXGA (1600x1200)
WcSaturation<a class="cmnd" id="wcsaturation"></a>|`-2..+2` = set picture saturation
WcStream<a class="cmnd" id="wcstream"></a>|Control streaming<BR>`0` = stop<BR>`1` = start

### Ethernet

Command|Parameters
:---|:---
Ethernet<a class="cmnd" id="ethernet"></a>|*Only for ESP32 boards with additional LAN chip*<BR>`0` = disable Ethernet<BR>`1` = enable Ethernet _(default)_
EthAddress<a class="cmnd" id="ethaddress"></a>|`0..31` = PHYxx address
EthClockMode<a class="cmnd" id="ethclockmode"></a>|Ethernet clock mode.<BR>`0` = ETH_CLOCK_GPIO0_IN *(default)*<BR>`1` = ETH_CLOCK_GPIO0_OUT <BR>`2` = ETH_CLOCK_GPIO16_OUT<BR>`3` = ETH_CLOCK_GPIO17_OUT
EthType<a class="cmnd" id="ethtype"></a>|Ethernet type.<BR>`0` = ETH_PHY_LAN8720 *(default)*<BR>`1` = ETH_PHY_TLK110 <BR>`2` = ETH_PHY_IP101
See Also|[`wifi`](#wifi) - Enable/Disable Wi-Fi<BR>
