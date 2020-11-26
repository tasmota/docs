!!! info "Rules expand the functionality of Tasmota with user configurable flexible logic"

Tasmota provides a Rule feature heavily inspired by the _ESPEasy_ implementation while maintaining a small memory footprint. Automation solutions can be implemented without having to add dedicated code or use external solutions.  

Rules perform actions based on triggers (e.g., switch state change, temperature threshold, events like system boot, a defined timer elapsing, custom defined events, etc.) They are stored in flash and therefore will survive a reboot.

!!! note
    Most pre-compiled [builds](Builds) have the Rules feature enabled. *If you are >compiling your own firmware, in order to use rules, include `#define USE_RULES` in `user_config_override.h`.*

**List of [Rules Commands](Commands.md#rules)**  

## Rule Syntax

Rule definition syntax 

```haskell
ON <trigger> DO <command> [ENDON | BREAK]
```  

- **`ON`** - marks the beginning of a rule   
- **`<trigger>`** - what condition needs to occur for the rule to trigger  
- **`DO`** - statement marking end of trigger and beginning of command part
- **`<command>`** - command that is executed if the `<trigger>` condition is met  
- **`ENDON`**  - marks the end of a rule. It can be followed by another rule.
- **`BREAK`**  - marks the end of a rule. `BREAK` will stop the execution of the remaining rules that follow this rule within the rule set. If a rule that ends with `BREAK` is triggered, the following rules in that rule set will not be executed. This allows the rules to somewhat simulate an "IF/ELSE" statement.  

Rule sets are defined by using the [`Rule<x>`](Commands.md#rule) command. After defining a rule set, you have to enable it (turn it on) using `Rule<x> 1`. Similarly you can disable the rule set using `Rule<x> 0`.

!!! note
    If bootloops are detected all rules will be disabled as a precaution. See [SetOption36](Commands.md#setoption36).
  
There are three separate **rule sets** called `Rule1`, `Rule2` and `Rule3`. Each rule set can contain many rules which are dynamically compressed. Number of rules that can fit in a rule set varies. Expect at least 1000 characters available per rule set.

Whenever a rule set is enabled all the rules in it will be active. If the character count of the rules in one set actually exceeds the limit, start using the next rule set. If you have a long list of rules, verify the rules have all fit by inspecting the resulting log.

Rules inside a rule set `Rule<x>` are concatenated and entered as a single statement.  

```haskell
Rule<x> ON <trigger1> DO <command> ENDON ON <trigger2> DO <command> ENDON ...
```

Spaces after `ON`, around `DO`, and before `ENDON` or `BREAK` are mandatory. A rule is **not** case sensitive.  

### Rule Trigger
Rule trigger names are derived from the JSON message displayed in the console. Each JSON level (all values enclosed in `{...}`) is separated in the trigger with a `#`.

A rule trigger can consist of:  

- `[TriggerName]#[ValueName]`
- `[TriggerName]#[ValueName][comparison][value]`
- `[SensorName]#[ValueName]`
- `[SensorName]#[ValueName][comparison][value]`
- `Tele-[SensorName]#[ValueName]`
- `[TriggerName1]#[TriggerName2]#[ValueName]`
- `[TriggerName1]#?#[ValueName]`

Use `?` as a wildcard for a single trigger level. Rule will trigger on `[TriggerName]#?#[Value]` where `?` is any value.

!!! example
    Rule with a trigger of `ZBReceived#?#Power=0` will trigger on `{"ZBReceived":{"0x4773":{"Power":0}}}` and on `{"ZBReceived":{"aqara_switch":{"Power":0}}}` both.

!!! note
    Same trigger may be used in more than one rule. This may be required for some cases of using `IF/ELSE` since an `IF` statement cannot be used within a `Backlog`.

#### Rule Trigger Comparison Operators

|Operator|Function|
|:-:|:--|
|`=` | equal to (used for string comparison)|
|`==`| equal to (used for numerical comparison)|
|`>`| greater than|
|`<`| lesser than|
|`!=`| not equal to|
|`>=`| greater than or equal to|
|`<=`| lesser than or equal to|
|`|`| used for [modulo operation](https://en.wikipedia.org/wiki/Modulo_operation) with remainder = 0 (exact division)|

#### Examples of Available Triggers

_This is just a sampling of available triggers to showcase what is possible and not a definitive list_

Trigger|When it occurs 
:-|:-
Analog#A0div10<a id="Analog"></a>|when the `A0` input changes by more than 1% it provides a value between 0 and 100
Button2#State<a id="ButtonState"></a>|when a button changes state:<br>`0` = OFF<BR>`1` = ON<BR>`2` = TOGGLE<BR>`3` = HOLD
Clock#Timer=3<a id="ClockTimer"></a>|when global `Timer3` is activated
Dimmer#Boot<a id="DimmerBoot"></a>|occurs after Tasmota starts<a id="ADC0"></a> 
Dimmer#State<a id="DimmerState"></a>|when the value for Dimmer is changed
Event#eventName<a id="EventeventName"></a>|when command `Event eventName` is executed. You can define your own event values and trigger them with the [`Event`](Commands.md#event) command.
FanSpeed#Data=3|when the fan speed is set to `3`
Mem&lt;x\>#State<a id="MemState"></a>|when the value for Mem&lt;x\> is changed
Http#Initialized<a id="HttpInitialized"></a>|
Mqtt#Connected<a id="MqttConnected"></a>|when MQTT is connected
Mqtt#Disconnected<a id="MqttDisconnected"></a>|when MQTT is disconnected
Power1#Boot<a id="PowerBoot"></a>|`Relay1` state before Wi-Fi and MQTT are connected and before Time sync but after `PowerOnState` is executed. Power#Boot triggers before System#Boot.<BR>This trigger's value will be the last state of `Relay1` if [`PowerOnState`](Commands.md#poweronstate) is set to its default value (`3`).
Power1#State<a id="PowerState"></a>|when a power output is changed<br>use `Power1#state=0` and `Power1#state=1` for comparison, not =off or =on<br>Power2 for Relay2, etc.
Rules#Timer=1<a id="RulesTimer"></a>|when countdown `RuleTimer1` expires
Switch1#Boot<a id="SwitchBoot"></a>|occurs after Tasmota starts before it is initializated.
Switch1#State<a id="SwitchState"></a>|when a switch changes to state. Will not trigger if SwitchTopic is set.<br>use `Switch1#state=0` and `Switch1#state=1` for comparison, not =off or =on<br>`0` = OFF<BR>`1` = ON<BR>`2` = TOGGLE<BR>`3` = HOLD (`SwitchTopic 0` must be set for this to trigger)<BR>`4` = INC_DEC (increment or decrement dimmer)<BR>`5` = INV (change from increment to decrement dimmer and vice versa)<BR>`6` = CLEAR (button released for the time set with `SetOption32`)
System#Boot<a id="SystemBoot"></a>|occurs once after Tasmota is fully intialized (after the INFO1, INFO2 and INFO3 console messages). `System#Boot` triggers after Wi-Fi and MQTT (if enabled) are connected. If you need a trigger prior to every service being initialized, use `Power1#Boot`
System#Init<a id="SystemInit"></a>|occurs once after restart before Wi-Fi and MQTT are initialized
System#Save<a id="SystemSave"></a>|executed just before a planned restart
Time#Initialized<a id="TimeInitialized"></a>|once when NTP is initialized and time is in sync
Time#Initialized>120|once, 120 seconds after NTP is initialized and time is in sync
Time#Minute<a id="TimeMinute"></a>|every minute
Time#Minute\|5|every five minutes
Time#Minute=241|every day once at 04:01 (241 minutes after midnight)
Time#Set<a id="TimeSet"></a>|every hour when NTP makes time in sync
Var&lt;x\>\#State<a id="VarState"></a>|when the value for Var&lt;x\> is changed (triggers whenever a value is written to `Var<x>` even if its the same value)
Wifi#Connected<a id="WifiConnected"></a>|when Wi-Fi is connected
Wifi#Disconnected<a id="WifiDisconnected"></a>|when Wi-Fi is disconnected
Tele-Wifi1#AP<a id="tele-Wifi1-AP"></a>|when a teleperiod message is sent with the number of the used AP 
Tele-Wifi1#Ssid<a id="tele-Wifi1-Ssid"></a>|when a teleperiod message is sent with the name of the used AP 
Tele-Wifi1#Bssid<a id="tele-Wifi1-Bssid"></a>|when a teleperiod message is sent with the name of the bSSID
Tele-Wifi1#Channel<a id="tele-Wifi1-Channel"></a>|when a teleperiod message is sent with the number of the wifi channel used
Tele-Wifi1#RSSI<a id="tele-Wifi1-RSSI"></a>|when a teleperiod message is sent with the RSSI LEVEL
Tele-Wifi1#LinkCount<a id="tele-Wifi1-LinkCount"></a>|when a teleperiod message is sent with the number of wifi disconnections
Tele-Wifi1#Downtime<a id="tele-Wifi1-Downtime"></a>|when a teleperiod message is sent with the total seconds of wifi disconnections

Every [command](Commands.md) with a JSON payload response has an associated rule trigger.

|Trigger           | When it occurs |
|------------------|----------------|
|&lt;command\>#Data|A one level JSON payload such as `{"Command":"value"}`. For example, for {"Fanspeed":3}, the trigger is`Fanspeed#Data`.|
|&lt;command\>#level1#level2#levelN|A multi-level JSON payload such as `{"TriggerLevel1":{"TriggerLevel2":{"ValueName":"value"}}}` does **NOT** have the `#Data` trigger. Instead, the trigger for these responses is `TriggerLevel1#TriggerLevel2#ValueName`. 

!!! example
    For `{"PulseTime2":{"Set":0,"Remaining":0}}`, the triggers are `PulseTime2#Set` and `PulseTime2#Remaining`.|

    For a 3 level JSON message such as `{"ZbReceived":{"test_switch":{"Device":"0x0C94","Power":1,"Endpoint":8,"LinkQuality":70}}}` one possible trigger is `ZbReceived#test_switch#Power` or another `ZbReceived#test_switch#LinkQuality` 

Connected sensors can be a trigger in the form as they are represented in the `TelePeriod` and `Status 8` JSON payloads.  

|Trigger           | When it occurs |
|------------------|----------------|
|DS18B20#Temperature| whenever the temperature of sensor DS18B20 changes|
|DS18B20#Temperature&lt;20| whenever the temperature of sensor DS18B20 is below 20 degrees|
|BME280#Humidity==55.5| whenever the humidity of sensor BEM280 equals 55.5%|
|INA219#Current\>0.100| whenever the current drawn is more than 0.1A|
|Energy#Power\>100| whenever the power used is more than 100W|

When the payload consists of an array of data eg: `ENERGY":{Current":[1.320,2.100]}`

|Trigger           | When it occurs |
------------------|----------------|
|Energy#Current\[N\]|N = Number of the field. 1 for the first `1.320`, 2 for the second `2.100` etc.|
|Energy#Current\[1\]\>1.000|whenever the first value of Energy#Current is higher than 1.000.|

To trigger only at TelePeriod time, prefix the sensor with the word `Tele-`.  

|Trigger           | When it occurs |
------------------|----------------|
|Tele-AM2301#Temperature|sensor AM2301 Temperature value when the TelePeriod JSON payload is output|

Hardware and software serial interface, RF, IR and TuyaMCU are also supported based on their [JSON](JSON-Status-Responses) status message:  

|Trigger           | When it occurs |
------------------|----------------|
|TuyaReceived#Data=&lt;hex_string><a id="TuyaReceivedData"></a>| whenever &lt;hex_string> is received with [TuyaMCU](TuyaMCU) component|
|SerialReceived#Data=&lt;string><a id="SerialReceivedData"></a>| whenever &lt;string> is received via hardware serial|
|SSerialReceived#Data=&lt;string>| whenever &lt;string> is received via software serial|
|IrReceived#Data=801<a id="IrReceivedData"></a>| whenever an IR signal for a RC5 remote control button 1 is received|
|IrReceived#Data=0x00FF9867|whenever an IR signal with hex code 0x00FF9867 is received|
|RfReceived#RfKey=4<a id="RfReceivedRfKey"></a>| whenever the [RF Bridge](devices/Sonoff-RF-Bridge-433) receives a recognized RfKey 4 signal
|RfReceived#Data=0xE8329E<a id="RfReceivedData"></a>|whenever an RF signal with hex code 0xE8329E is received|


### Rule Command
A rule command can be any command listed in the [Commands list](Commands.md). The command's `<parameter>` can be replaced with  `%value%` which will use the value of the trigger. 

`ON Switch1#State DO Power %value% ENDON`

To accomplish a rule with one trigger but several commands, you need to use `Backlog`:

`ON <trigger> DO Backlog <command1>; <command2>; <command3> ENDON`

**Appending new rule onto an existing rule set**  
Use the `+` character to append a new rule to the rule set. For example:

&nbsp;&nbsp;&nbsp;&nbsp;Existing Rule1:  `ON Rules#Timer=1 DO Mem2 %time% ENDON`

&nbsp;&nbsp;&nbsp;&nbsp;Rule to append:  `ON Button1#state DO POWER TOGGLE ENDON`

&nbsp;&nbsp;&nbsp;&nbsp;Command:         `Rule1 + ON button1#state DO POWER TOGGLE ENDON`

&nbsp;&nbsp;&nbsp;&nbsp;Resulting in 
```haskell
Rule1 ON Rules#Timer=1 DO Mem2 %time% ENDON ON Button1#state DO POWER TOGGLE ENDON
```

You can repeate the same trigger in rules. 

```haskell
Rule
  ON Power2#state=1 DO Power1 1 ENDON
  ON Power2#state=1 DO RuleTimer1 100 ENDON
```

### Rule Variables

There are ten available variables (single precision reals) in Tasmota: `Var1..Var5` and `Mem1..Mem5`. They provide a means to store the trigger `%value%` to be used in any rule.         
All `Var` will be empty strings when the program starts. The value of all `Mem` persists after a reboot. 

The value of a `Var<x>` and `Mem<x>` can be: 

- any number
- any text
- %var1% to %var5%
- %mem1% to %mem5% 
- %time%
- %timestamp%
- %uptime%
- %sunrise%
- %sunset%
- %utctime%
- %topic%

To set the value for `Var<x>` and `Mem<x>` use the command  

- `Var<x> <value>`
- `Mem<x> <value>`

The `<value>` can also be the value of the trigger of the rule.  

- Set Var2 to the temperature of the AM2301 sensor - `ON AM2301#Temperature DO Var2 %value% ENDON`
- Set Var4 to Var2's value - `ON Event#temp DO Var4 %Var2% ENDON`
- Set Mem2 to the current time (minutes elapsed since midnight) - `ON Rules#Timer=1 DO Mem2 %time% ENDON`
- After a Wi-Fi reconnect event, publish a payload containing timestamps of when Wi-Fi was disconnected in *From:* and when Wi-Fi re-connected in *To:* to `stat/topic/BLACKOUT`.

```haskell
Rule1
  ON wifi#disconnected DO Var1 %timestamp% ENDON
  ON wifi#connected DO Var2 %timestamp% ENDON
  ON mqtt#connected DO Publish stat/topic/BLACKOUT {"From":"%Var1%","To":"%Var2%"} ENDON
```

#### Delete rule

To [clear / delete](Commands.md#rule) use quote(s):

```haskell
Rule1 "
```


## Conditional Rules

!!! failure "This feature is not included in precompiled binaries."    
To use it you must [compile your build](Compile-your-build). Add the following to `user_config_override.h`:
```arduino
#define USE_EXPRESSION         // Add support for expression evaluation in rules (+3k2 code, +64 bytes mem)  
#define SUPPORT_IF_STATEMENT   // Add support for IF statement in rules (+4k2 code, -332 bytes mem)  
```
----

#### Major features  
- Support IF, ELSEIF, ELSE  
- Support for `<comparison>` and `<logical expression>` as condition  
- Support for executing multiple commands  
- Support for nested IF statements  
- Available free RAM is the only limit for logical operators, parenthesis, and nested IF statements.  

#### Grammar  
`<if-statement>`  

- `IF (<logical-expression>) <statement-list> {ELSEIF (<logical-expression>) <statement-list>} [ELSE <statement-list>] ENDIF`  

`(<logical-expression>)`  
Parentheses must enclose the expression. They can also be used to explicitly control the order of evaluation.  

- `<comparison-expression>`  
- `(` `<comparison-expression>` | `<logical-expression>` `)` {{`AND` | `OR`} `<logical-expression>`}  
- `(` `<logical-expression>` `)` {`AND` | `OR`} `<logical expression>`}  

`<comparison-expression>`  

- `<expression>` {`=` | `<` | `>` | `|` | `==` | `<=` | `>=` | `!=`} `<expression>`  

`<statement-list>`  

- `<statement>` {`;` `<statement>`}  

`<statement>`  

- {`<Tasmota-command>` | `<if-statement>`}  

#### Syntax
IF statement supports 3 formats:  

- `IF (<logical-expression>) <statement-list> ENDIF`  
- `IF (<logical-expression>) <statement-list> ELSE <statement-list> ENDIF`  
- `IF (<logical-expression>) <statement-list> [ELSEIF (<logical-expression>) <statement-list> ] ELSE <statement-list> ENDIF`  

When the `<if-statement>` directly follows the trigger the standard 'Do' syntax applies, however, it is not necessary to use 'Backlog' within the chain
  `Rule1 ON Power1#State DO IF (%value%==1) Backlog Power2 1;Power3 1 ENDIF ENDON` is **permitted**
  `Rule1 ON Power1#State DO IF (%value%==1) Power2 1;Power3 1 ENDIF ENDON` is also **permitted**

When the `<if-statement>` is preceded by other Tasmota commands you should use `Backlog' rather thab 'Do' , e.g.  
  `Rule1 ON ENERGY#Current>10 Backlog Power1 0; IF (%var1%==1) Power1 1 ENDIF;Power 2 0;Power3 1 ENDON`
  **and not**
  `Rule1 ON ENERGY#Current>10 DO Power1 0; IF (%var1%==1) Power1 1 ENDIF ENDON`

`(<logical-expression>)` example: `(VAR1>=10)`  
- Multiple comparison expressions with logical operator `AND` or `OR` between them. `AND` has higher priority than `OR`. For example:  
  `((UPTIME>100) AND (MEM1==1) OR (MEM2==1))`  
- Parenthesis can be used to change the priority of the logical expression evaluation. For example:  
  `((UPTIME>100) AND ((MEM1==1) OR (MEM2==1)))`  

- Following variables can be used in `<condition>`:  

  Symbol|Description
  -|-
  VAR&lt;x>|variable (&lt;x> = `1..MAX_RULE_VARS`, e.g., `VAR2`)
  MEM&lt;x>|persistent variable (&lt;x> = `1..MAX_RULE_MEMS`, e.g., `MEM3`)
  TIME|minutes past midnight
  UPTIME|uptime minutes
  UTCTIME|UTC time, UNIX timestamp, seconds since 01/01/1970
  LOCALTIME|local time, UNIX timestamp
  SUNRISE|current sunrise time (minutes past midnight)
  SUNSET|current sunset time (minutes past midnight)

`<statement-list>`  
- A Tasmota command (e.g.,`LedPower on`)  
- Another IF statement (`IF ... ENDIF`)  
- Multiple Tasmota commands or IF statements separated by `;`. For example:  
  `Power1 off; LedPower on; IF (Mem1==0) Var1 Var1+1; Mem1 1 ENDIF; Delay 10; Power1 on`  
  `Backlog` is implied and is not required (saves rule set buffer space).  
  
  But not like this:
   `Power1 off; LedPower on; IF (Mem1==0) Var1 Var1+1; Mem1 1 ENDIF; Delay 10; Power1 on`

   You should split it in two lines like:
   `ON Power2#state=1 DO Power1 off; LedPower on; ENDON`
   `ON Power2#state=1 DO IF (Mem1==0) Var1 Var1+1; Mem1 1 ENDIF; Delay 10; Power1 on ENDON`

!!! example
     Rule used to control pressure cooker with a Sonoff S31. Once it is finished cooking, shut off the power immediately.  
```haskell
Rule1
 ON system#boot DO var1 0 ENDON
 ON energy#power>100 DO if (var1!=1) ruletimer1 0;var1 1 endif ENDON
 ON tele-energy#power<50 DO if (var1==1) var1 2;ruletimer1 600 endif ENDON
 ON rules#timer=1 DO Backlog var1 0;power off ENDON  
```

## Expressions in Rules

!!! failure "This feature is not included in precompiled binaries."    

To use it you must [compile your build](Compile-your-build). Add the following to `user_config_override.h`:
```arduino
#define USE_EXPRESSION         // Add support for expression evaluation in rules (+3k2 code, +64 bytes mem)  
#define SUPPORT_IF_STATEMENT   // Add support for IF statement in rules (+4k2 code, -332 bytes mem)  
```
----

Beginning with Tasmota version 6.4.1.14, an optional feature for using mathematical expressions in rules was introduced. 

#### Supported Commands
Once the feature is enabled, the use of expressions is supported in the following commands:

* Var
* Mem
* RuleTimer
* [If conditional statement](#conditional-rules) (requires `#define SUPPORT_IF_STATEMENT`)

#### Syntax
Expressions can use of the following operators. They are listed by the order of operations priority, from higher to lower.

* `(  )` (parentheses can be used to explicitly control the order of operations)
* `^` (power)
* `%` (modulo, division by zero returns modulo "0")
* `*` and `/`  (multiplication and division; division by zero returns "0")
* `+` and `-`  (addition and subtraction)

!!! example
    * `1+2*2`   results in 5.0 as the multiplication is done first due to its higher priority
* `(1+2)*2`   results in 6.0

In addition to numeric constants, the following symbolic values can be used:  

Symbol|Description
-|-
VAR&lt;x>|variable (&lt;x> = `1..MAX_RULE_VARS`, e.g., `VAR2`)
MEM&lt;x>|persistent variable (&lt;x> = `1..MAX_RULE_MEMS`, e.g., `MEM3`)
TIME|minutes past midnight
UPTIME|uptime minutes
UTCTIME|UTC time, UNIX timestamp, seconds since 01/01/1970
LOCALTIME|local time, UNIX timestamp
SUNRISE|current sunrise time (minutes past midnight)
SUNSET|current sunset time (minutes past midnight)

!!! example
     `Mem1=((0.5*Var1)+10)*0.7`

To use expressions in the `Var`, `Mem` and `RuleTimer` commands, an equal sign (`=`) character has to be used after the command. If not, the traditional syntax interpretation is used.  

Statement|Var1 Result
-|-
`Var1=42`|42
`Var1 1+1`|"1+1" (the literal string)
`Var1=1+1`|2
`Var1=sunset-sunrise`|duration of daylight in minutes

## Rule Cookbook

### Long press on a switch

!!! note "This example is for GPIOs defined as switches not buttons"

Activate long press action with `Switchmode 5` and shorten long press time to 2 seconds (`Setoption32 20`).

```haskell
Backlog SwitchMode 5; SetOption32 20
Rule ON switch1#state=3 DO publish cmnd/tasmota02/POWER 2 ENDON
```

Long pressing on switch1 sends `POWER 2` (toggle action) command to the `tasmota02` device

Notice we use `Rule` which edits `Rule1` rule set. They can be used interchangeably. If your rule does not trigger there could some constraints, in this case if SwitchTopic has a value it will override rules for switches and will need to be disabled: `SwitchTopic 0`.

------

### Send MQTT message on button press
When a button is pressed the user has the possibility to send a MQTT message based on FullTopic and ButtonTopic. This MQTT message is going to be received by the MQTT broker and if there is any other device(s) subscribed to that Topic, it will receive also that message. So this approach can be used for sending messages/commands to MQTT Broker to Home Automation System, and/or sending messages/commands to MQTT Broker to other device(s).

A problem with this solution is that on a Sonoff 4CH all four buttons will be sending the same MQTT topic using only a different Power index number like `cmnd/ButtonTopic/Power3 toggle`.

By using a rule a single button can send any MQTT message allowing for more flexibility.

Disable ButtonTopic as it overrides rules for buttons: `ButtonTopic 0`

#### Rule

```haskell
Rule1
  ON button1#state DO publish cmnd/ring2/power %value% ENDON
  ON button2#state DO publish cmnd/strip1/power %value% ENDON
```

You will need to enable this rule if it's the first time you've used rule with `Rule1 1`

#### Result
When Button1 is pressed the rule kicks in and sends a MQTT message substituting variable `%value%` with the button state, f.e `cmnd/ring2/Power 2`. When Button2 is pressed an MQTT message `cmnd/strip1/Power 2` will be sent.

------------------------------------------------------------------------------

### Usage of one-shot (once)
The rule command once option provides the possibility to trigger only once ON a slow change while the change is still within the bounds of the test.


```haskell
Rule
  ON ENERGY#Current>0.100 DO publish tool/tablesaw/power 1 ENDON
  ON ENERGY#Current<0.100 DO publish tool/tablesaw/power 0 ENDON
```

This creates a rule to publish MQTT commands whenever a Sonoff POW has current passing through it. Used as is, it will publish MQTT commands repeatedly, over and over, while current is >0.100 ... but, executing another command:

`Rule 5`

Now the MQTT message will be sent once, and only once, while the condition is met. This is perfect for thermostat on/off depending on temperature, bathroom extractor fan on/off depending on humidity, workshop dust collector on/off depending on whether some dust-producing machine is running.

It meets the 'hard thermostat' requests that have been common.


### Use a potentiometer
Connecting a potentiometer to the Analog A0 input and a rule can be used to control the dimmer state of any device.

Hardware
- Wemos D1 mini
- Potentiometer of 2k2 connected to Gnd, A0 and 3V3
- WS2812 LED

```haskell
Rule ON analog#a0div10 DO dimmer %value% ENDON
```

#### Result
Turning the potentiometer the voltage on the analog input will change resulting in a value change of 0 (Off) to 100 for the trigger. Using this value to control the dimmer of the WS2812 will control the brightness of the led(s)

```haskell
Rule ON analog#a0div10 DO publish cmnd/grouplight/dimmer %value% ENDON
```

Result
This time all lights configured with GroupTopic `grouplight` will change their brightness according to the potentiometer position.

NOTE: You might want to execute command `SaveData 2` to reduce flash writes ;-)

------------------------------------------------------------------------------------

### Use Zigbee to control Tasmota devices
This setup uses a [Zigbee](Zigbee) gateway with an [Ikea remote switch](https://zigbee.blakadder.com/Ikea_E1743.html) paired. 

Ikea switch's name was set with `ZbName` to make it more user friendly.

#### Rule
```haskell
Rule1 on zbreceived#ikea_switch#power=1 do publish cmnd/backyard/POWER TOGGLE endon on zbreceived#ikea_switch#power=0 do publish cmnd/hall_light/POWER TOGGLE endon
```

#### Result
Pressing `I` on the Ikea switch will toggle `backyard` device and pressing `O` toggles `hall_light` device.

------------------------------------------------------------------------------

### Button single press, double press and hold

_[assuming Button1 and Setoption73 0]_

* single press: Toggle Power1  
* double press: send a mqtt message  
* hold 2 secs: send a different mqtt message

```haskell
Backlog ButtonTopic 0; SetOption1 1; SetOption11 1; SetOption32 20
```

```haskell
Rule1
  ON button1#state=3 DO publish cmnd/topicHOLD/power 2 ENDON
  ON button1#state=2 DO publish cmnd/topicDOUBLEPRESS/power 2 ENDON 
```

`Rule1 1`

#### Another example:
_[assuming Button1 and Setoption73 0]_

* single press: send MQTT message
* double press: Toggle Power1 (SetOption11 swaps single and double press)
* hold 2 secs: send another mqtt message  

```haskell
Backlog ButtonTopic 0; SetOption1 1; SetOption11 0; SetOption32 20  
```

```haskell
Rule1
  ON button1#state=3 DO publish cmnd/topicHOLD/power 2 ENDON
  ON button1#state=2 DO publish cmnd/topicSINGLEPRESS/power 2 ENDON 
```

`Rule1 1`

----------------------------------------------------------------------------

### Disable switch single press and use long press

`SetOption11 0`  

**Switches do not have double press feature**  

_[assuming a connected pushbutton configured as Switch1]_

* single press: Does nothing (empty `Delay` commands)  
* hold 2 secs: Toggle Power1

```haskell
Backlog SwitchTopic1 0; SwitchMode1 5; SetOption32 20  
```

```haskell
Rule1
  ON Switch1#State=3 DO Power1 2 ENDON
  ON Switch1#State=2 DO Delay ENDON  
```

`Rule1 1`


------------------------------------------------------------------------------

### Execute several commands when a Timer expires
The default Timer1..16 functionality allows for controlling one output to either off, on, toggle or blink. When rules are enabled the blink option will be replaced by rule functionality allowing much more flexibility.

Configure timer5 for rule execution when activated:  

```haskell
Timer5 {"Arm":1,"Mode":0,"Time":"16:00","Days":"1111111","Repeat":1,"Action":3}
```

#### Rule  

```haskell
Rule1 ON clock#Timer=5 DO Backlog Power2 on; Power1 off; Power3 2 ENDON
```

#### Result
When the timer expires the rule kicks in and set Power1 to OFF, Power2 to ON and Power3 TOGGLE.

If you want to have blink functionality define a rule like `ON clock#Timer=5 DO power 3 ENDON`

------------------------------------------------------------------------------

### Setting variables
Demonstrate the use of variables. Make sure to execute commands `Rule 4`(Disable one-shot detection) first when trying the following example.

Set a variable

```haskell
Rule ON event#setvar1 DO var1 %value% ENDON
```

Command:  `event setvar1=1`

View a variable
```haskell
rule ON event#getvar1 DO var1 ENDON
```

Command:  `event getvar1`

* Toggle a variable

```haskell
Rule
  ON event#togglevar1 DO event toggling1=%var1% ENDON
  ON event#toggling1<1 DO event setvar1=1 ENDON
  ON event#toggling1>0 DO event setvar1=0 ENDON
  ON event#setvar1 DO var1 %value% ENDON
```

Command:  `event togglevar1`

Show Messages:

```haskell
Rule ON event#message DO publish stat/[topic]/log %value% ENDON
```

Command:  `event message=INIT`

All event commands can be executed from:

- console: `event anyname=number`
-  mqtt:    `cmnd/[topic]/event anyname=number`

Everything together: 
 
```haskell
Rule1 
  ON event#togglevar1 DO event toggling1=%var1% ENDON 
  ON event#toggling1<1 DO event setvar1=1 ENDON 
  ON event#toggling1>0 DO event setvar1=0 ENDON 
  ON event#setvar1 DO var1 %value% ENDON 
  ON event#getvar1 DO var1 ENDON 
  ON event#message DO publish stat/mqttTopic/log %value% ENDON
```

!!! note "The following won't work:"
    `Rule1 ON event#setvar1 DO Backlog var1 %value%; Power1 %var1% ENDON`

    At least not as you probably would expect. The `var1` value used by the `Power1` command will be the value present before the `Backlog` command is executed. This is so, because the rule will replace `%var1%` BEFORE the `Backlog` commands are put in the `Backlog` command stream.

------------------------------------------------------------------------------

<!-- ### Control device LEDs with Relays
If a device has more than one relay and LEDs ON different GPIOs (not connected to the relay) you need to use rules to display current relay status on LEDs. This example is a 3 gang wall switch. Instead of LEDs you need to assign 3 dummy relays that will be controlled when the real relays are switched to reflect their status.

```haskell
Backlog LedMask 0x0000; setoption13 1; seriallog 0

Rule1 
  ON Power1#state DO Power4 %value% ENDON 
  ON Power2#state DO Power5 %value% ENDON 
  ON Power3#state DO Power6 %value% ENDON

Rule1 1
```
Note: This method doubles the number of flash writes. [Link to the device](https://templates.blakadder.com/DS-102_3.html)


------------------------------------------------------------------------------ -->


### Time-delayed Auto-off Switch

#### Rule
```haskell
Rule1
  ON button1#state DO Backlog Power1 %value%; RuleTimer1 600 ENDON
  ON Rules#Timer=1 DO Power1 off ENDON
```

#### Result

`on button1#state do Backlog Power1 %value%;`  
On Button press the Light will toggle on/off  

`RuleTimer1 600 ENDON`  
Additionally RuleTimer1 will begin to countdown 10 minutes  

`ON Rules#Timer=1 DO Power1 off ENDON`  
After the RuleTimer1 expires the light will be turned off (if you forgot to turn it off)  

------------------------------------------------------------------------------

### Time-delay After Switch Off

#### Rule
```haskell
Backlog switchmode1 1; rule1 1
```

```haskell
Rule1 ON switch1#state=1 DO Backlog Power1 on; ruletimer1 0 ENDON
ON switch1#state=0 DO ruletimer1 300 ENDON
ON rules#timer=1 DO Power1 0 ENDON
```


#### Result  
`ruletimer1 300` sets a 5 minute timer. After that time, fan will be switched off. If during the defined 5 minutes (or in general - when timer is counting) you the switch on, the timer will be canceled.

`switchmode1 1` sets the switch in follow mode (LOW=off, HIGH=on)  
If you have inverted switch (LOW=on, HIGH=off) then use `switchmode1 2` 

------------------------------------------------------------------------------

### Auto-off Motion Sense Switch
Example works fine on a Wemos D1 Mini. Used as night light with motion sensor or as ambient light on floor or kitchen.

Connect an LED Strip WS2812 on D1 and the PIR on D2 and a LDR on A0 (voltage divider with 10k ohm resistor)

`SwitchMode1 1`

#### Rule   
```haskell
Rule1
  ON analog#a0<400 DO Backlog Rule3 0; Rule2 1 ENDON
  ON analog#a0>500 DO Backlog Rule2 0; Rule3 1 ENDON
```
```haskell
Rule2
  ON switch1#state DO Backlog Power1 1; RuleTimer1 30 ENDON
  ON Rules#Timer=1 DO Power1 off ENDON
```

```haskell
Rule3
  ON switch1#state DO Power1 off ENDON
```

Activate Rule1 with one shot detection  
`Backlog Rule1 1; Rule1 6`  

Optional  
`Backlog Rule2 4; Rule3 4`  

#### Result  
`on analog#a0>400`  
disable Rule3 and activate Rule2

`on analog#a0>500`  
disable Rule2 and activate Rule3

Rule2 activates the LEDs for RuleTimer1 30 seconds on each trigger from PIR the RuleTimer start again.  

`on Rules#Timer=1 do Power1 off`  
The LEDs turn off after the RuleTimer expires  

Rule3 is active on daylight and pipe the PIR signal in a Power1 off signal. The LEDs stay off.  

------------------------------------------------------------------------------

### Control Timers from a Switch

Assuming that your switch is on `GPIO00` and configured as `Switch1`:

[`Switchmode1 1`](Commands#switchmode) will make Switch1#state be 1 when ON and 0 when OFF

If you don't set `Switchmode1` or it is equal 0, it will only have `Switch1#state=2` (toggle) and the rule will not work.

#### Rule

```haskell
Rule1
  ON Switch1#state=1 DO Timers 0 ENDON
  ON Switch1#state=0 DO Timers 1 ENDON
```

------------------------------------------------------------------------------

### Toggle Relay when holding button for 2 seconds

The following example is to explain how to catch and use the HOLD feature for buttons.

Behavior: Disable Button1 Short Press and Toggle Relay1 only when holding button1 for 2 Seconds.

```haskell
Backlog ButtonTopic 0; SetOption1 1; SetOption32 20
```

```haskell
Rule1
  ON button1#state=3 DO Power1 2 ENDON
  ON button1#state=2 DO delay ENDON
```
```haskell
Rule1 1
```

**Commands Explanation**

`ButtonTopic 0` : (default) To not use topics for buttons  
`SetOption1 1` : Allow only single, double and hold press button actions  
`SetOption32 20` : Set key hold time from 0.1 to 10 seconds (20 = 2 seconds)  
`Rule ON button1#state=3 DO Power1 2 ENDON` : When holding the button1 for 2 seconds it will toggle relay 1 (state = 3 means HOLD)  
`ON button1#state=2 DO delay ENDON` : Do nothing when short pressing the button1 (state = 2 means TOGGLE)  
`Rule1 1` : To enable rules  

NOTE: There is no state value for "double press" for Buttons. It is designed that double press will toggle the relay. See [Multi-Press Functions](Buttons-and-Switches#multi-press-functions) for more information.

In the case you do not want the double press feature you can configure your button as switch and also set `SwitchMode` that fits your use case (such as `SwitchMode 5` to make the switch behave like a pushbutton) [SWITCH does not support double press] 

**Another example but using switch instead of button:**

```haskell
Backlog SwitchTopic1 0; SwitchMode1 5; SetOption32 20

Rule1
  ON switch1#state=3 DO Power1 2 ENDON
  ON switch1#state=2 DO delay ENDON

Rule1 1
```

------------------------------------------------------------------------------

### Make sure Light is on at night

Using Timers, you can set a light to turn on and off to illuminate a street/patio by night. But if the device has no power at the trigger time, then, when it powers up, the light will be off all night. So, as a fail-safe, implement a conditional control to be checked at Tasmota Startup.

Set Timers to turn on your light at Sunset and Turn off at sunrise.
Use `poweronstate 0` in order to start with lights off when powering up your device.
Set the following rules:

```haskell
Rule1
  ON Time#Initialized DO Backlog event checksunrise=%time%; event checksunset=%time% ENDON
  ON event#checksunset>%sunset% DO Power1 1 ENDON
  ON event#checksunrise<%sunrise% DO Power1 1 ENDON
```

The previous rules are conditionals that represent the following logic:

IF %time%>%sunset DO Power1 1 / IF %time%<%sunrise DO Power1 1

------------------------------------------------------------------------------

### Turn On Light Before Dawn and At Dusk
Turn on light at dusk until your nighttime and again in the morning before dawn.  

What if the sun sets after your nighttime, as in during the summer? Then the timer will turn off the light at "night", but then the Sunset timer will turn it on again, so it stays on all night.  

#### Rule
```haskell
Rule1
  ON Time#Initialized DO event chkSun ENDON
  ON Time#Minute=%sunset% DO event chkSun ENDON
  ON Time#Minute=%mem2% DO event chkSun ENDON
  ON Time#Minute=%sunrise% DO event chkSun ENDON
  ON Time#Minute=%mem1% DO event chkSun ENDON
```

```haskell
Rule2
  ON event#chkSun DO Backlog var1 0; event chkSunrise=%time%; event chkSunset=%time%; event chkmorn=%time%; event chknight=%time%; event setPower ENDON
  ON event#chkSunrise<%sunrise% DO var1 1 ENDON
  ON event#chkSunset>=%sunset% DO var1 1 ENDON
  ON event#chkmorn<%mem1% DO var1 0 ENDON
  ON event#chknight>=%mem2% DO var1 0 ENDON
  ON event#setPower DO Power1 %var1% ENDON
```

```haskell
Backlog mem1 360; mem2 1350; Rule1 1; Rule2 1
```

#### Result
  - When device restarts, calculate if the light should be on or off  
  `ON Time#Initialized DO event chkSun ENDON`

  - Calculate if the light should be on or off  
  `ON Time#Minute=%sunset% DO event chkSun ENDON`
  `ON Time#Minute=%mem2% DO event chkSun ENDON`
  `ON Time#Minute=%sunrise% DO event chkSun ENDON`
  `ON Time#Minute=%mem1% DO event chkSun ENDON`

  -  Calculate if the light should be on or off  
  `on event#chkSun do Backlog `
  
  - Assume off  
  `var1 0; `
  
  - Trigger each event with the current time  
  `event chkSunrise=%time%; event chkSunset=%time%; event chkmorn=%time%; event chknight=%time%; event setPower`
  - End rule   
   `ENDON`
  
  - If before sunrise, turn on  
  `ON event#chkSunrise<%sunrise% DO var1 1 ENDON`
  
  - If past sunset, turn on  
  `ON event#chkSunset>=%sunset% DO var1 1 ENDON`
  
  - But if before Morning time (`mem1`), do not turn on  
  `ON event#chkmorn<%mem1% DO var1 0 ENDON`
  
  - Or if after Night time (`mem2`), do not turn on  
  `ON event#chknight>=%mem2% DO var1 0 ENDON`
  
  - Perform on/off state  
  `ON event#setPower DO Power1 %var1% ENDON`

  - Set variables for Morning (06h00) and Night (22h30) times  
  `Backlog mem1 360; mem2 1350`

  - Turn on the rule sets  
  `Backlog Rule1 1; Rule2 1`

------------------------------------------------------------------------------

### Enable a PIR Switch only at night

Latitude and Longitude need to be set in config.

`SwitchMode1 1`

```haskell
Rule1
  ON Switch1#state=1 DO Backlog event checksunrise=%time%; event checksunset=%time% ENDON
  ON event#checksunrise<%sunrise% DO Power1 1 ENDON
  ON event#checksunset>%sunset% DO Power1 1 ENDON
```

------------------------------------------------------------------------------

### Control luminance switch with Timer

**Background:**
Tasmota powers a Sonoff Basic attached to a TS-2561 Luminance Sensor. This switch toggles a lamp ON or OFF. The switch should work as below: 
i) during daytime (sunrise-sunset): ON when it is too dark (<150 lx)  and OFF when it gets brighter (>175 lx). 
ii) during evenings it ignores the sensor and turns on at sunset and turns off after about 5 hours 

**Approach:**
Used a combination of Clock Timers and Rule to do this. 

**Timer 1:** Power ON switch at Sunset  
Powers on the switch at sunset with an offset of 20 minutes. Repeats every day.  
```haskell
Timer1 {"Arm":1,"Mode":2,"Time":"-00:20","Window":0,"Days":"1111111","Repeat":1,"Output":1,"Action":1}
```

**Timer 2:** Power OFF switch at Night.  
Turns power OFF at 23.00hrs. Repeats every day.  
```haskell
Timer2 {"Arm":1,"Mode":0,"Time":"23:00","Window":0,"Days":"1111111","Repeat":1,"Output":1,"Action":0}
```

**Timer 3:** Trigger Luminance Rule at Sunrise  
Start watching the Lux sensor 15 minutes after sunrise.  
```haskell
Timer3 {"Arm":1,"Mode":1,"Time":"00:15","Window":0,"Days":"1111111","Repeat":1,"Output":1,"Action":3}
```

**Rule 1:** Main Rule to check Luminance  
If Luminance is less than 150lx, power ON. If it goes beyond 175lx, power OFF.  
```haskell
Rule1
  ON tele-TSL2561#Illuminance<150 DO Power1 1 ENDON
  ON tele-TSL2561#Illuminance>175 DO Power1 0 ENDON 

Rule1 1
```haskell

**Rule 2:** Trigger Rule1 only in the Mornings  
This ensures that Rule1 is triggered when Timer3 starts (in the morning) and stops when Timer1 starts (in the evenings).  
```haskell
Rule2
  ON Clock#Timer=3 DO Rule1 1 ENDON
  ON Clock#Timer=1 DO Rule1 0 ENDON

Rule2 1
```

------------------------------------------------------------------------------

### Perform any action on single/double press (for switches AND buttons)

#### Rule

`SwitchMode 5`

```haskell
Rule1
  ON switch1#state==2 DO add1 1 ENDON
  ON switch1#state==2 DO Power1 2 ENDON
  ON var1#state!=0 DO Backlog delay 6;var1 0 ENDON
  ON var1#state==2 DO publish cmnd/othertasmota/POWER toggle ENDON
```

`Rule1 on`

#### Result

- each toggle of the switch triggers first condition and adds 1 to our variable (var1 in the example),
- each toggle of the switch toggles the associated relay (`Power1 2` - but can do anything else instead, `Publish` for example)
- when var1 changes to non zero, we set it back to 0 but after a `Delay` (arbitrarily chosen 6 here - 0.6 seconds)
- when var1 reaches 2 (i.e. the switch has been toggled twice within the last 0.6 seconds), desired action is triggered (here: `Publish` to `othertasmota`)

Every time you press the switch, your light toggles state (as it should). If you do press the switch twice in a rapid succession (i.e., double-click), you can trigger a different action (e.g., on a remote device).

------------------------------------------------------------------------------

### Enable or disable relay with a switch in Domoticz

When you want to send MQTT messages ( we use domoticz in this example ) and choose when you want the relay on or off, by simply sending HTTP commands to trigger an event.  

**Initial Config:**

- PushButton Doorbell
- (Sonoff Basic R1) GPIO14 - Switch4 (12)

Connect the Switch to GND and the GPIO on your device. Be sure put a 4.7k resistor between VCC(3.3v) and the GPIO. This prevents ghost switching (capacitor is optional) See: [YouTube](https://www.youtube.com/watch?v=aq8_os6g13s)  

_Dont forget to change the IDX value_

**Commands:**

```haskell
Backlog SwitchTopic 0; SwitchMode4 2; SetOption0 0; PowerOnState 0

var1 1

Rule1
  ON event#doorbell DO var1 %value% ENDON
  ON switch4#state=1 DO publish domoticz/in {"idx":11,"nvalue":1} ENDON
  ON switch4#state=1 DO Power1 %var1% ENDON
  ON switch4#state=0 DO publish domoticz/in {"idx":11,"nvalue":0} ENDON
  ON switch4#state=0 DO Power1 0 ENDON

Rule1 1
```

**Usage:**  

Turn off the relay by calling the event using HTTP:  
`http://<tasmotaIP>/cm?cmnd=event%20doorbell=0`  

Turn on the relay by calling the event using HTTP:  
`http://<tasmotaIP>/cm?cmnd=event%20doorbell=1`  

If your Tasmota device is password protected, which is most common, then use the following HTTP commands instead. Make sure you change `<tasmotaUsername>` and `<tasmotaPassword>`  

Off:  
`http://<tasmotaIP>/cm?&user=<tasmotaUsername>&password=<tasmotaPassword>&cmnd=event%20doorbell=0`  
On:  
`http://<tasmotaIP>/cm?&user=<tasmotaUsername>&password=<tasmotaPassword>&cmnd=event%20doorbell=1`

------------------------------------------------------------------------------

### Force automatic re-connection to MQTT server via SD DNS

In order to search for the MQTT server using SD-DNS service (a.k.a. Bonjour or Zero Network Configuration) the suggested configuration is to leave the MQTT Host field blank.

The standard behavior of Tasmota is 

- searches for _mqtt._tcp service
- resolve that to the proper IP address
- connect to it 
- in case the connection is successful, retain the IP address and use that in the subsequent connections

The above is not proper, though, in case you have a redundant MQTT (e.g., two MQTT server synchronized).
In such case, when the active MQTT fails for any reason, the expected behavior is to achieve automatic re-connection to the other MQTT server.

That can be easily configured defining the following rule on the device console:

```haskell
Rule1 ON Mqtt#Disconnected DO MqttHost 0 ENDON
Rule1 1
```

If the MqttHost field already contains an IP, you have to delete it using the web interface or the following MQTT command:

```console
mosquitto_pub -h mqtt_server.local -t "cmnd/mqttTopic/MqttHost" -m ''
```

------------------------------------------------------------------------------

### Change distance to percentage

When measuring distance and you have the need to see it in percentage of distance. In the example 100% is everything below 69cm and 0% is everything above 128cm. This is used for showing fill percentage of a wood pellets storage.

```haskell
Rule1
  ON tele-SR04#distance DO Backlog var1 %value%; event checklimit=%value%; event senddistance ENDON
  ON event#checklimit>128 DO var1 128 ENDON
  ON event#checklimit<69 DO var1 68 ENDON
  ON event#senddistance DO Backlog SCALE1 %var1%, 128, 69, 0, 100; event pubdata ENDON
  ON event#pubdata DO publish tele/pannrum-temp/SENSOR %var1% ENDON

Rule1 1
```

------------------------------------------------------------------------------

### Distinguish Switch1 and Switch2 (without the use of Relay1 and Relay2)

When two (or more) switches are defined as input and you want to distinguish these in the RESULT topic without the use of Relays, then consider the following rules. 

- SwitchMode1 1 will make Switch1#state to be 1 when ON and 0 when OFF  
  `SwitchMode1 1`

- SwitchMode2 1 will make Switch2#state to be 1 when ON and 0 when OFF  
  `SwitchMode2 1`

- Publish json with key POWER1 and value %value%
```haskell
Rule1 ON switch1#state DO publish stat/wemos-4/RESULT {"POWER1":"%value%"} ENDON
```

- Publish json with key POWER2 and value %value%  
```haskell
Rule2 ON switch2#state DO publish stat/wemos-4/RESULT {"POWER2":"%value%"} ENDON
```

- Enable Rules
  `Backlog Rule1 1; Rule2 1`

Output:

```
RUL: SWITCH1#STATE performs "publish stat/wemos-4/RESULT {"POWER1":"1"}"
MQT: stat/wemos-4/RESULT = {"POWER1":"1"}
RUL: SWITCH2#STATE performs "publish stat/wemos-4/RESULT {"POWER2":"1"}"
MQT: stat/wemos-4/RESULT = {"POWER2":"1"}
RUL: SWITCH1#STATE performs "publish stat/wemos-4/RESULT {"POWER1":"0"}"
MQT: stat/wemos-4/RESULT = {"POWER1":"0"}
RUL: SWITCH2#STATE performs "publish stat/wemos-4/RESULT {"POWER2":"0"}"
MQT: stat/wemos-4/RESULT = {"POWER2":"0"}
RUL: SWITCH1#STATE performs "publish stat/wemos-4/RESULT {"POWER1":"1"}"
MQT: stat/wemos-4/RESULT = {"POWER1":"1"}
RUL: SWITCH1#STATE performs "publish stat/wemos-4/RESULT {"POWER1":"0"}"
MQT: stat/wemos-4/RESULT = {"POWER1":"0"}
```

------------------------------------------------------------------------------

### Receiving state of anything that triggers SWITCH more than one time

With analog intercom doorbells you can take out info about ringing from speaker voltage. You can connect GPIO to it via opto-isolator and resistor to take out state. But even with those speaker voltage is dropping so it switches the device multiple times.
```
MQT: cmnd/doorbell/POWER2 = OFF (retained)
MQT: cmnd/doorbell/POWER2 = ON (retained)
MQT: cmnd/doorbell/POWER2 = OFF (retained)
MQT: cmnd/doorbell/POWER2 = ON (retained)
MQT: cmnd/doorbell/POWER2 = OFF (retained)
```

To solve it we can use rules.
```haskell
SwitchTopic 0

Rule1
  on System#Boot var1 0 ENDON
  ON Switch2#State DO Backlog add1 1; event START ENDON
  ON event#START DO event BELL=%var1% ENDON
  ON event#BELL=1.000 DO Backlog publish cmnd/bell/power on; RuleTimer1 60 ENDON
  ON event#BELL=0 DO publish cmnd/bell/power off ENDON
  ON Rules#Timer=1 DO Backlog var1 0; event BELL=0 ENDON

Rule1 1
```

description:

- Disable SwitchTopic as it overrides rules for switches: `SwitchTopic 0`
- on system boot set var1 to 0
- on switch2 click (person pushing doorbell) - var1 += 1; trigger event START
- on START - set event BELL equal to var1
- if event#BELL=1 (triggered first time) publish mqtt message ON and trigger RulesTimer1 for 60 seconds
- if event#BELL=0 publish mqtt message OFF 
- on RulesTimer1 - reset var1 to 0, and call event#BELL.
- enable rule 1

In this case we have lock for 60 seconds for multiple people calls or to be resistant for speaker voltage drops.

------------------------------------------------------------------------------

### Prevent Wemos D1 mini load overcurrent
As a WS2812 24 led ring draws approximately 24x3x20 mA = 1.44A and the Wemos D1 mini powered from a PC's USB port can only provide up to 0.5A it would be nice to have some kind of mechanism in place to limit the amount of current to the WS2812 LEDring to 0.1A. This is still enough to light all 24 leds up to color 202020.

Hardware

- Wemos D1 mini
- INA219 I<sup>2</sup>C sensor
- WS2812 LEDring with 24 LEDs powered by the Wemos D1 mini 5V thru the INA219 sensor


```haskell
Rule1 ON INA219#Current>0.100 DO Backlog Dimmer 10;Color 10,0,0 ENDON
Rule1 on
```

Result
- When a user raises brightness to a level using more than 0.1A the rule kicks in and lowers the current by executing command `Dimmer 10` and changes the color to Red with command `Color 10,0,0`.

------------------------------------------------------------------------------

### Using dummy GPIO to send Serial codes to an MCU

By having a device that controls all its features through an MCU and reports the states in serial codes to the ESP8266 we have to create some rules to control it using the Web UI or standard Power commands.

```haskell
Rule1
  ON Power1#state=1 DO serialsend5 55AA00060005020400010213 ENDON 
  ON Power1#state=0 DO serialsend5 55AA00060005020400010011 ENDON 
  ON Power2#state=1 DO serialsend5 55AA00060005060400010217 ENDON 
  ON Power2#state=0 DO serialsend5 55AA00060005060400010015 ENDON
```
Power1 controls the device, Power2 turn on and off the light on the device.

Another rule was created to issue commands on boot so the serial interface works every time and to control the built in fan using Event triggers and have its state retained in an MQTT message for Home Assistant.

```haskell
Rule2 
  ON system#boot DO Backlog baudrate 9600; seriallog 2; serialsend5 55aa000300010306 ENDON 
  ON event#high DO Backlog serialsend5 55AA00060005650400010175; publish2 stat/diffuser/FAN high ENDON 
  ON event#low DO Backlog serialsend5 55AA00060005650400010074; publish2 stat/diffuser/FAN low ENDON
```

------------------------------------------------------------------------------

### Arithmetic commands used with VAR

#### ADD  
  `ADD1` to `ADD5`: Add a value to `VARx`  
  Syntax: `ADDx value`  
  Usage: `ADD1 15`  
  Result: `VAR1 = VAR1 + 15`  

#### SUBTRACT  
  `SUB1 `to `SUB5`: Subtract a value from `VARx`  
  Syntax: `SUBx value`  
  Usage: `SUB1 15`  
  Result: `VAR1 = VAR1 - 15`  

#### MULTIPLY  
  `MULT1 `to `MULT5`: Multiply a value to `VARx`  
  Syntax: `MULTx value`  
  Usage: `MULT1 15`  
  Result: `VAR1 = VAR1 * 15`  

#### SCALE A VALUE  
  `SCALE1 `to `SCALE5`: Scale a value from a low and high limit to another low and high limit and store it in `VARx` (directly equivalent to MAP arduino command)  

  Syntax: `SCALEx value, fromLow, fromHigh, toLow, toHigh`  

  where,  

  _value_: the number to scale  
  _fromLow_: the lower bound of the value’s current range  
  _fromHigh_: the upper bound of the value’s current range  
  _toLow_: the lower bound of the value’s target range  
  _toHigh_: the upper bound of the value’s target range  

  _(omitted values are taken as zero)_  

  Usage: `SCALE1 15, 0, 100, 0, 1000`  
  Result: `VAR1 = 150`  

----------------------------------------------------------------------------

### Transmit sensor value only when a delta is reached

Send only when the sensor value changes by a certain amount.  

```haskell
Rule1
  ON SI7021#temperature>%var1% DO Backlog var1 %value%; publish stat/mqttTopic/temp %value%; var2 %value%; add1 2; sub2 2 ENDON
  ON SI7021#temperature<%var2% DO Backlog var2 %value%; publish stat/mqttTopic/temp %value%; var1 %value%; add1 2; sub2 2 ENDON
```
-----------------------------------------------------------------------------

### Adjust a value and send it over MQTT
This example adds 2 degrees to the measured temperature and then sends that value to an MQTT topic.

```haskell
Rule1
  ON tele-SI7021#temperature DO Backlog var1 %value%; add1 2; event sendtemp ENDON
  ON event#sendtemp DO publish stat/mqttTopic/temp %var1% ENDON
```

------------------------------------------------------------------------------

### Control relays via serial

This example switches connected relays over the software serial on and off.

Write the following rules:

```haskell
rule1
  ON SSerialReceived#Data=on DO Power1 1 ENDON
  ON SSerialReceived#Data=off DO Power1 0 ENDON
```

receiving `on` and `off` results in

```
MQT: tele/mqttTopic/RESULT = {"SSerialReceived":"on"}
RUL: SSERIALRECEIVED#DATA=ON performs "Power1 1"
MQT: stat/mqttTopic/RESULT = {"POWER":"ON"}
MQT: stat/mqttTopic/POWER = ON
MQT: tele/mqttTopic/RESULT = {"SSerialReceived":"off"}
RUL: SSERIALRECEIVED#DATA=OFF performs "Power1 0"
MQT: stat/mqttTopic/RESULT = {"POWER":"OFF"}
MQT: stat/mqttTopic/POWER = OFF
```

------------------------------------------------------------------------------

### Using BREAK to simulate IF..ELSEIF..ELSE..ENDIF

``BREAK`` is an alternative to ``ENDON``. ``BREAK`` will stop the execution for the triggers that follow. If a trigger that ends with ``BREAK`` fires, then the following triggers of that rule will not be executed. This allows to simulate ``IF..ELSEIF..ELSE..ENDIF``

**Example:**
```console
IF temp > 85 then
  VAR1 more85
ELSEIF temp > 83 then
  VAR1 more83
ELSEIF temp > 81 then
  VAR1 more81
ELSEIF temp = 81 then
  VAR1 equal81
ELSE
  VAR1 less81
ENDIF
```

With the actual rules, if we use a set like the following:
```haskell
Rule1
  ON event#temp>85 DO VAR1 more85 ENDON
  ON event#temp>83 DO VAR1 more83 ENDON
  ON event#temp>81 DO VAR1 more81 ENDON
  ON event#temp=81 DO VAR1 equal81 ENDON
  ON event#temp<81 DO VAR1 less81 ENDON
```

This is the output in the console:
```
CMD: rule
MQT: stat/living/RESULT = {"Rule1":"ON","Once":"ON","StopOnError":"OFF","Free":322,"Rules":"ON event#temp>85 do VAR1 more85 ENDON ON event#temp>83 do VAR1 more83 ENDON on event#temp>81 do VAR1 more81 ENDON on event#temp=81 do VAR1 equal81 ENDON on event#temp<81 DO VAR1 less81 ENDON"}
CMD: event temp=10
MQT: stat/living/RESULT = {"Event":"Done"}
RUL: EVENT#TEMP<81 performs "VAR1 less81"
MQT: stat/living/RESULT = {"Var1":"less81"}
CMD: event temp=100
MQT: stat/living/RESULT = {"Event":"Done"}
RUL: EVENT#TEMP>85 performs "VAR1 more85"
MQT: stat/living/RESULT = {"Var1":"more85"}
RUL: EVENT#TEMP>83 performs "VAR1 more83"
MQT: stat/living/RESULT = {"Var1":"more83"}
RUL: EVENT#TEMP>81 performs "VAR1 more81"
MQT: stat/living/RESULT = {"Var1":"more81"}
```
So, all the triggers where TEMP>100, are firing. With the ``BREAK`` statement the rule set can be changed to:
```haskell
Rule
  on event#temp>85 do VAR1 more85 break
  on event#temp>83 do VAR1 more83 break
  ON event#temp>81 DO VAR1 more81 ENDON
  ON event#temp=81 DO VAR1 equal81 ENDON
  ON event#temp<81 DO VAR1 less81 ENDON
```

Which will result in the following output:
```
CMD: rule
RSL: RESULT = {"Rule1":"ON","Once":"OFF","StopOnError":"OFF","Free":321,"Rules":"ON event#temp>85 do VAR1 more85 break ON event#temp>83 do VAR1 more83 break on event#temp>81 do VAR1 more81 ENDON on event#temp=81 do VAR1 equal81 ENDON on event#temp<81 DO VAR1 less81 ENDON"}
CMD: event temp=10
RSL: RESULT = {"Event":"Done"}
RUL: EVENT#TEMP<81 performs "VAR1 less81"
RSL: RESULT = {"Var1":"less81"}
CMD: event temp=100
RSL: RESULT = {"Event":"Done"}
RUL: EVENT#TEMP>85 performs "VAR1 more85"
RSL: RESULT = {"Var1":"more85"}
CMD: event temp=83
RSL: RESULT = {"Event":"Done"}
RUL: EVENT#TEMP>81 performs "VAR1 more81"
RSL: RESULT = {"Var1":"more81"}
```

------------------------------------------------------------------------------

### Adjust PowerDelta according to current Power values
Power sensor reporting thresholds are set by a percentage change in the Power value by setting [PowerDelta](Commands#powerdelta). Power changes from 10W to 11W (10%) may not be very interesting. But power changes from 1000W to 1100W (also 10%) could be very important. To avoid getting reports for small changes but ensuring that larger power swings are reported, a rule set can be used to create a gradient threshold based on the absolute power values.

This rule also uses the [one-shot feature of rules](#usage-of-one-shot-once) to avoid reporting of every small change within a threshold window. The rule (a ON/DO/ENDON rule in this the set) will trigger only once when a threshold is crossed.

```haskell
Backlog PowerDelta 0; Rule1 0; Rule1 5
 
Rule1
  ON ENERGY#Power>=35 DO Backlog PowerDelta 10; Status 8 BREAK 
  ON ENERGY#Power>=15 DO Backlog PowerDelta 25; Status 8 BREAK 
  ON ENERGY#Power>5 DO Backlog PowerDelta 35; Status 8 BREAK 
  ON ENERGY#Power<=5 DO PowerDelta 100 ENDON

Rule1 1
```

Which translates (pseudo code):
```haskell
IF ENERGY#Power>=35  // ENERGY#Power GE 35
  DO Backlog PowerDelta 10; Status 8
ELSE IF ENERGY#Power>=15  // ENERGY#Power GE 15 and LT 35
  DO Backlog PowerDelta 25; Status 8
ELSE IF ENERGY#Power>5  // ENERGY#Power GT 5 and LT 15
  DO Backlog PowerDelta 35; Status 8
ELSE  // ENERGY#Power changed (i.e. LE 5)
  DO PowerDelta 100
```

------------------------------------------------------------------------------

### Forward IR signals

Using one IR receiver and one sender (or both extender) you can simply forward signals from one to another using the following rule
```haskell
rule1 ON IRreceived#Data DO publish cmnd/irsideboard/irsend {Protocol:NEC,Bits:32,Data:%value%} ENDON
```

------------------------------------------------------------------------------

### Garage Door Opener

([#3942](https://github.com/arendst/Tasmota/issues/3942#issue-365226844))

// Set the relay on time to signal the opener  
`PulseTime 7`

// Send ON and OFF as the switch is ON or OFF  
```haskell
Backlog SwitchMode1 1; SwitchMode2 1; SwitchMode3 1
```

//No need to save changes on power cycle  
`SetOption0 0`

//Don’t blindly run the door on power up  
`PowerOnState 0`

//One shot Detection off  
```haskell
Backlog Rule1 0; Rule1 4; Rule2 0; Rule2 4; Rule2 0; Rule2 4
```

//Set Counter to measure the period between on and off, check if its blinking because of an obstruction  
```haskell
Backlog CounterType 1; CounterDebounce 100
```

//So the door doesn't close if you send it an Open when it's already Opened, etc.  
```
// var1=1 Only When OPEN  
// var2=1 Only When CLOSED  
// var3=1 Only When OPENING  
// var4=1 Only When CLOSING  
```
```haskell
Rule1
  ON Switch1#Boot=1 DO Backlog delay 99; event Opened ENDON
  ON Switch2#Boot=1 DO Backlog delay 99; event Closed ENDON
  ON EVENT#OPEN DO Power1 %var2% ENDON
  ON EVENT#CLOSE DO Power1 %var1% ENDON
  ON EVENT#STOP DO Backlog Power1 %var3%; Power1 %var4%; event PState=STOP ENDON
  ON Switch1#State=1 DO event Opened ENDON
  ON Switch2#State=1 DO event Closed ENDON
  ON Switch1#State=0 DO event Closing ENDON
  ON Switch2#State=0 DO event Opening ENDON

Rule2
  ON event#Opened DO Backlog var 1; var2 0; var3 0; var4 0; ruletimer1 0; event PState=OPEN ENDON
  ON event#Closed DO Backlog var1 0; var2 1; var3 0; var4 0; ruletimer1 0; event PState=CLOSE ENDON
  ON event#Opening DO Backlog var1 0; var2 0; var3 1; var4 0; ruletimer1 15; event PState=OPENING ENDON
  ON event#Closing DO Backlog var1 0; var2 0; var3 0; var4 1; ruletimer1 15; event PState=CLOSING ENDON

Rule3
  ON counter#c1>1000 DO event PObstr=0 ENDON
  ON counter#c1<1000 DO event PObstr=1 ENDON
  ON event#PObstr DO publish stat/GarageDoor/OBSTR %value% ENDON
  ON event#PState DO publish stat/GarageDoor/STATE %value% ENDON
  ON rules#timer=1 DO event PState=STOP ENDON
```

//Turn on Rules  
```haskell
Backlog Rule1 1; Rule2 1; Rule3 1
```

------------------------------------------------------------------------------

### IR Remote Button Multi-press

For example, a remote control with one button to change speed. This rules simulates pressing the button three times to set the receiving device to the third speed setting. 

Specify the rule set  

- The `<trigger>` can be a a condition or an event sent from another device or home automation hub.  
- `<topic>` corresponds to the device transmitting the code (e.g., [YTF IR Bridge](devices/YTF-IR-Bridge)). This could also be modified to send an RF code from a [Sonoff RF Bridge](devices/Sonoff-RF-Bridge-433).  
- The `Delay` may not be necessary in your environment or may need to be adjusted according to your device characteristics. 

```haskell
Rule 1
  ON Event#tora DO Backlog Publish cmnd/<topic>/IRSend {"Protocol":"NEC","Bits":32,"Data":"0x00FF30CF"}; Delay 10 ENDON
  ON <trigger> DO Backlog Event tora; Event tora; Event tora ENDON
```

- Enable the Rule set  
`Rule1 1`


------------------------------------------------------------------------------

### Two-way light switches without MQTT

Two Sonoff T1 3-gang light switches can be used at either end of a room by setting up one the master and the other as the slave.  The master performs the switching of the power to the lights, while the slave just asks the master to toggle the power state.  The master also turns the slave's relays on and off so that the LED indicators follow the master's state.

Using the `WebSend` command, the two switches can talk to each other without an MQTT broker.  It remains to be seen how reliable this is.

Starting with the slave, the rule to toggle the master is pretty simple:

```haskell
Rule1
  ON Event#sendPower DO WebSend [192.168.0.74] POWER%value% TOGGLE ENDON
  ON Button1#State DO Event sendPower=1 ENDON
  ON Button2#State DO Event sendPower=2 ENDON
  ON Button3#State DO Event sendPower=3 ENDON
```
`Rule1 1`


Note that having a rule for the Button#State disables the power toggling of the slave's relay(s).  This is desirable because we want the master to control the slave's relay state(s) according to its own as follows:

```haskell
Rule1
  ON Event#sendPower DO WebSend [192.168.0.144] POWER%Var1% %value% ENDON
  ON Power1#state DO Backlog Var1 1;Event sendPower=%value% ENDON
  ON Power2#state DO Backlog Var1 2;Event sendPower=%value% ENDON
  ON Power3#state DO Backlog Var1 3;Event sendPower=%value% ENDON
```
`Rule1 1`



------------------------------------------------------------------------------

### Roller shutter push-button toggle

With a two relay device (e.g., Shelly 2.5) configured for a roller shutter, you can also connect push-buttons (configured as switch components in this example) and set them for inverted toggle behavior. Pressing a push-button once makes the roller shutter move in one direction. Pressing it again stops it. These rules each use a variable to remember the shutter state where `0 == Stopped` and `1 == Moving`.

```haskell
Backlog SwitchTopic 0; SwitchMode1 4; SwitchMode2 4

Rule1
  ON Switch1#State==1 DO Add1 1 ENDON
  ON Var1#State==0 DO ShutterStop1 ENDON
  ON Var1#State==1 DO ShutterClose1 ENDON
  ON Var1#State>=2 DO Var1 0 ENDON
  ON Shutter1#Close DO Var1 0 ENDON
  ON Switch2#State==1 DO Add2 1 ENDON
  ON Var2#State==0 DO ShutterStop1 ENDON
  ON Var2#State==1 DO ShutterOpen1 ENDON
  ON Var2#State>=2 DO Var2 0 ENDON
  ON Shutter1#Open DO Var2 0 ENDON

Rule1 1
```

### Control a dimmer with one switch

!!! note "This example is for GPIOs defined as switches not buttons"

Activate dimmer mode with `Switchmode 11` and shorten long press time to 1 second (`Setoption32 10`).

A short press of the switch sends a `TOGGLE` message to toggle the dimmer. A long press sends repeated `INC_DEC` messages to increment the dimmer. If a second press of the switch follows the first press a `INV` message is sent to invert the function from increment to decrement and repeatet `INC_DEC` messages are sent to decrement the dimmer. After releasing the switch a timeout message `CLEAR` resets the automation

```haskell
Backlog SwitchMode 5; SetOption32 20

Rule1
on system#boot mem1 + ENDON
ON switch1#state=2 DO publish light/cmnd/POWER TOGGLE ENDON
ON switch1#state=4 DO publish light/cmnd/DIMMER %mem1% ENDON
ON switch1#state=5 DO mem1 - ENDON
ON switch1#state=6 DO mem1 + ENDON

Rule1 1
```
Notice we use `Rule` which edits `Rule1` rule set. They can be used interchangeably.

------------------------------------------------------------------------------

### Watchdog for Wi-Fi router

A Tasmota socket can ping a remote host (router itself or something else connected to the router)
and power cycle the socket to reboot the router. In this example, ping interval of 3 minutes is used.
The simplest watchdog rule does not use variables:

```haskell
Rule1
  ON Time#Minute|3 DO Ping4 192.168.1.10 ENDON
  ON Ping#192.168.1.10#Success==0 DO Backlog Power1 0; Delay 10; Power1 1; ENDON
Rule1 1
```

However, if the router becomes unreachable for a long time, the watchdog will keep cycling it every three minutes. 
This could reduce the watchdog's relay lifetime to months, at most years. Safer option would be to use an 
**exponential backoff** algorithm. `Var1` contains the current ping interval in minutes, which is trippled
after each failed ping, but limited to 1439 minutes (1 day).

```haskell
Rule1
  ON system#boot do Var1 3 ENDON
  ON Var1#State>1439 DO Var1 1439 ENDON
  
  ON Time#Minute|%var1% DO Ping4 192.168.1.10 ENDON
  ON Ping#192.168.1.10#Success==0 DO backlog Mult1 3; Power1 0; Delay 10; Power1 1 ENDON
  ON Ping#192.168.1.10#Success>0 DO Var1 3 ENDON
```

!!! note "This requires `#define USE_PING` and Tasmota version 8.2.0.3 or newer"

-------------------------------------------------------------------------------
### Simple Thermostat Example

As example, to be used on a Sonoff TH10 with Sensor Si7021

This example turn on and off an output based on the temperature value and the upper set point and the lower set point.
It waits until is enabled by pressing the button or by mqtt message 1 to mem1. This value is remembered. So if power cycle occurs, will resume operation.
The set point values can be changed on the fly by mqtt or console commands
If the Temperature sensor disconnects, the outputs will shutdown until the sensor is back again and will resume operation.
When the device is power up, the thermostat also waits until the sensor value to resume operation.

Initial Config:

* Available physical button as **Switch1**
* **Relay1** will be used the controller
* **Rules** must be used to control Relay so the pushbutton must only control **Switch1** and not directly control the relay - For this we use SwitchMode1 3 as described below and create the necessary rules because the pushbutton control of the relay is only disabled when the rules are in place.

Initial config on console:

* `SwitchMode1 3`  <- Use the switch1 as pushbutton (It will allow us to disable the link between the button and the relay by inserting a rule to dictate what the pushbutton will do - **NOTE: Until rules are created the pushbutton will still control the relay!**)
* `Rule1 1 `        <- turn on rules
* `Rule1 4`        <- turn off one-shot rule
* `TelePeriod 60`  <- check temp every minute
* `SetOption26 1`  <- use Power1 on mqtt messages
* `SetOption0 0`   <- dont save relay status on eeprom
* `PowerOnState 0` <- start all relays off
* `Mem1 0`         <- thermostat status: 0-off 1-enabled - View or set by MQTT cmnd/mqttTopic/mem1
* `Mem2 25`       <- setpoint Temp upper limit - View or set by MQTT cmnd/mqttTopic/mem2
* `Mem3 23`        <- setpoint Temp lower limit - View or set by MQTT cmnd/mqttTopic/mem3
* `Var1 0 `       <- thermostat actual status: 1-OK 0-NOT READY - View by MQTT cmnd/mqttTopic/var1

#### Rules

On boot start a watchdog timer to check temp sensor connection.  
```haskell
Rule ON system#boot DO RuleTimer1 70 ENDON
```

An available button is configured as switch to set thermostat ON or OFF

```haskell
Rule1
  ON switch1#state DO Backlog event toggling1=%mem1% ENDON
  ON event#toggling1=0 DO mem1 1 ENDON
  ON event#toggling1=1 DO mem1 0 ENDON
```

Check temp sensor connection. If fails, set to off and turn off thermostat. Also continue checking  

```haskell
Rule ON Rules#Timer=1 DO Backlog var1 0; RuleTimer1 70; Power1 0 ENDON
```

Resets checking timer if temperature is connected  

```haskell
Rule ON tele-SI7021#temperature DO Backlog var1 1; RuleTimer1 30; event ctrl_ready=1; event temp_demand=%value% ENDON
```

Thermostat control - upper limit and lower limit and enabled  

```haskell
Rule1
  ON event#ctrl_ready>%mem1% DO var1 0 ENDON
  ON event#temp_demand>%mem2% DO Power1 0 ENDON
  ON event#temp_demand<%mem3% DO Power1 %var1% ENDON
```


Thermostat can be turned On by:  
* pushing button
* by command on local console: mem1 1
* by command on any other console: publish cmnd/mqttTopic/mem1 1
* or MQTT at: cmnd/mqttTopic/mem1 1

Thermostat can be turned Off by:  
* pushing button
* by command on local console: mem1 0
* by command on any other console: publish cmnd/mqttTopic/mem1 0
* or MQTT at: cmnd/mqttTopic/mem1 0

To get the status:  
* `mem1`        <- thermostat status: 0-off 1-enabled - View or set by MQTT cmnd/mqttTopic/mem1
* `mem2`       <- setpoint Temp upper limit - View or set by MQTT cmnd/mqttTopic/mem2
* `mem3`         <- setpoint Temp lower limit - View or set by MQTT cmnd/mqttTopic/mem3
* `var1`        <- thermostat actual status: 1-OK 0-NOT READY - View by MQTT cmnd/mqttTopic/var1

Everything together:

Initial config: 

!!! note "RuleTimer1 must be greater that TelePeriod for expected results"

```haskell
Backlog SwitchMode1 3; Rule 1; Rule 4; TelePeriod 60; SetOption26 1; SetOption0 0; poweronstate 0; mem1 0; mem2 25; mem3 23; var1 0
```

Rules

```haskell
Rule1 
  ON system#boot DO RuleTimer1 70 ENDON 
  ON Switch1#State DO event toggling1=%mem1% ENDON 
  ON event#toggling1=0 DO mem1 1 ENDON 
  ON event#toggling1=1 DO mem1 0 ENDON 
  ON Rules#Timer=1 DO Backlog var1 0; RuleTimer1 70; Power1 0 ENDON 
  ON tele-SI7021#temperature DO Backlog var1 1; RuleTimer1 70; event ctrl_ready=1; event temp_demand=%value% ENDON 
  ON event#ctrl_ready>%mem1% DO var1 0 ENDON 
  ON event#temp_demand>%mem2% DO Power1 0 ENDON 
  ON event#temp_demand<%mem3% DO Power1 %var1% ENDON
```

Example rules without temp sensor to test the thermostat rules

```haskell
Rule1 
  ON system#boot DO RuleTimer1 70 ENDON 
  ON Switch1#State DO event toggling1=%mem1% ENDON 
  ON event#toggling1=0 DO mem1 1 ENDON 
  ON event#toggling1=1 DO mem1 0 ENDON 
  ON Rules#Timer=1 DO Backlog var1 0; RuleTimer1 70; Power1 0 ENDON 
  ON event#temp DO Backlog var1 1; RuleTimer1 70; event ctrl_ready=1; event temp_demand=%value% ENDON 
  ON event#ctrl_ready>%mem1% DO var1 0 ENDON 
  ON event#temp_demand>%mem2% DO Power1 0 ENDON 
  ON event#temp_demand<%mem3% DO Power1 %var1% ENDON
```

Tests:  

* Push the button1. The thermostat changes to ENABLED (mem1=1)
* on console: event temp=20 (now the system receives like a tele message from temperature sensor) and will turn on the relay1 (to heat)
* on console: event temp=26 (the thermostat turn off the heater)
* on console: event temp=22 (the thermostat turn on the heater)
* wait more than a minute without using the event temp and the thermostat will turn off as there is no temperature value (like a sensor error or disconnection)
* will resume when using again the event temp
* console mem1 0, DISABLED, console mem1 1, ENABLED

Timers:

* With the above the timers can be used to control mem1 and add a schedule to when the thermostat will be enabled  
  `Rule2 ON Clock#Timer=1 DO mem1 1 ENDON
ON Clock#Timer=2 DO mem1 0 ENDON`

------------------------------------------------------------------------------

### Solar heater control

In a swimming pool, a filter pump and a solar panel is installed. When the sun is shining, the pump should push water through the solar panel, to heat the pool. When it's night or cloudy, the pump should be off, to avoid cooling the pool water through the solar panel. The pump is controlled by a Sonoff TH10 with 2x DS18B20 sensors connected.

3 rules:

* Pump should start when solar panel is more than 2 deg warmer than the pool water
* Pump should stop when solar panel is less than 1 deg warmer than the pool water
* Pump should not start if the solar panel is below 25 deg Celsius.

`t1`: pool temp  
`t2`: panel temp  
`var1`: in valid panel temp range?  
`var2`: off threshold temp for panel  
`var3`: on threshold temp for panel  
`mem3`: lowest valid panel temp  

```haskell
mem3 25
```

```haskell
rule1
  ON DS18B20-1#temperature DO event t1=%value% ENDON
  ON DS18B20-2#temperature DO event t2=%value% ENDON
  ON event#t2>%mem3% DO var1 1 ENDON
  ON event#t2<=%mem3% DO var1 0 ENDON
  ON event#t1 DO Backlog var2 %value%; add2 1 ENDON
  ON event#t1 DO Backlog var3 %value%; add3 2 ENDON
  ON event#t2>%var3% DO Power1 %var1% ENDON
  ON event#t2<%var2% DO Power1 0 ENDON
```

To test the rule without having the sensors in place, simply enter the events for `t1` and `t2` in the console:  
`Backlog event t1=21;event t2=30`

And watch the relay turn on and off based on the values.

Please note that this example does not support manual override or handles missing sensor data. 

------------------------------------------------------------------------------

### Energy Saving Switch

Example of a switch controlling a light with a condition of a required amount of lux.

When the switch is on, the light will turn on but only when you have less than 100 lux in that room. While if the switch is off the light will be off.

```haskell
Rule1
  ON switch1#state=1 DO var1 100 ENDON
  ON switch1#state=0 DO Backlog var1 0; Power1 off ENDON
  ON APDS9960#Ambient<%var1% DO Power1 on ENDON
```

-------------------------------------------------------------------------------

### Use of variables and tele- in Domoticz
Using variables allows for storing sensor results to be used in composing a single HA message like used with Domoticz. To prevent flooding Domoticz with messages we only want to send a message at TelePeriod time. This is achieved by prefixing the `<SensorName>` with the label `tele-`. This example will use a variable storing the temperature to be used together with humidity in one Domoticz MQTT message.

- Domoticz configured with a virtual sensor Temp+Hum using Idx 134

Rule
```haskell
Rule
  ON tele-am2301-12#temperature DO var1 %value% ENDON
  ON tele-am2301-12#humidity DO publish domoticz/in {"idx":134,"svalue":"%var1%;%value%;1"} ENDON
```

Result
- As a result of the `tele-` prefix the rules will be checked at TelePeriod time for sensor AM2301-12 Temperature and Humidity. The first rule will use the Temperature stored in `%value%` and save it in `%var1%` for future use. The second rule will use the Humidity stored in `%value%` and the Temperature stored in `%var1%` to compose a single MQTT message suitable for Domoticz. 

-----------------------------------------------------------------------------

------------------------------------------------------------------------------

### RF Repeater / IR Repeater

In some applications, an RF-Repeater may come in handy to increase the range of RF based devices. We need to use RF reciever and RF transmitter modules with tasmota powered controllers. The following rule looks for data received by the RF receiver and re transmits the same over the transmitter. 

```haskell
Rule1
  on RfReceived#data do Rfsend {"Data":%value%,"Bits":24,"Protocol":1,"Pulse":454} endon
```
Enable it with `Rule1 1`


A similar concept can also work for IR- Repeater. Connect IR receiver module and IR trnasmitter to Tasmotized device and the following rule retransmits any data over IR
```haskell
Rule1
  on IrReceived#Data do IRsend {"Protocol":"NEC","Bits":32,"Data":%value%} endon
```
Enable it with `Rule1 1`

The only catch is that the protocol needs to be setup in the rule. Most likely this can be taken care of by using a more complex rule maybe using variables. Would update in future


------------------------------------------------------------------------------

