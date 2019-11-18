Tasmota provides a Rule feature heavily inspired by the _ESPEasy_ implementation. Rules expand the functionality of Tasmota with flexible and user configurable logic while maintaining a small memory footprint. Automation solutions can be implemented without having to add dedicated code or use external solutions.  

- [Rule Syntax](#rule-syntax)
  - [Trigger](#Rule-trigger)
  - [Command](#Rule-command)
  - [Variables](#Rule-variables)
- [Rule Cookbook](Rule-Cookbook) (_Sample rules_)

<a id="top"></a>
## Introduction
Rules perform actions based on triggers (e.g., switch state change, temperature threshold, events like system boot, a defined timer elapsing, custom defined events, etc.) They are stored in flash and therefore will survive a reboot.

> Most pre-compiled binaries ([builds](Builds)) have the Rules feature enabled. The exception being `tasmota-minimal.bin`. *If you are compiling your own firmware, in order to use rules, include `#define USE_RULES` in `user_config_override.h`.*

## Rule Syntax
**Nested rules are not supported.**  

- Optional [`IF / ELSE / ELSEIF` and `AND / OR`](Rules---IF-ELSE-ELSEIF-and-AND-OR-Support) support **6.6.0.11**  
- Optional [use of expressions](Expressions-in-Rules) support **6.4.1.14**  

Rule definition statement:  
`ON <trigger> DO <command> [ENDON | BREAK]`  
- **`ON`** - marks the beginning of a rule definition  
- **`<trigger>`** - what condition needs to occur for the rule to execute  
- **`DO`** - what <command> the rule is to perform if the `<trigger>` condition is met  
- **`ENDON`**  - marks the end of a rule. It can be followed by another rule.
- **`BREAK`**  - marks the end of a rule. `BREAK` will stop the execution of the remaining rules that follow this rule within the rule set. If a rule that ends with `BREAK` is triggered, the following rules in that rule set will not be executed. This allows the rules to somewhat simulate an "IF/ELSE" statement.  

Rule sets are defined by using the [`Rule<x>`](Commands#rule) command. After defining a rule set, you have to enable it (turn it on) using `Rule<x> 1`. Similarly you can disable the rule set using `Rule<x> 0`.  
  
See [Commands](Commands#Rules) for a complete list of rules related commands.  
  
There are three separate rule sets called `Rule1`, `Rule2` and `Rule3`. Each rule set can contain as many rules as can fit within the 511 character limit. Whenever a rule set is enabled all the rules in it will be active.

Rules inside a rule set `Rule<x>` are concatenated and entered as a single statement.  
`Rule<x> ON <trigger1> DO <command> ENDON ON <trigger2> DO <command> ENDON ...`  

Spaces after `ON`, around `DO`, and before `ENDON` or `BREAK` are mandatory. A rule is **not** case sensitive.  

### Rule Trigger
A rule trigger can consist of:  
- `[TriggerName]#[ValueName]`
- `[TriggerName]#[ValueName][comparison][value]`
- `[SensorName]#[ValueName]`
- `[SensorName]#[ValueName][comparison][value]`
- `Tele-[SensorName]#[ValueName]`

Comparison operators:  

|Operator|Function|
|:-:|:--|
|`=` | equal to (used for string comparison)|
|`==`| equal to (used for numerical comparison)|
|`>`| greater than|
|`<`| lesser than|
|`!=`| not equal to|
|`>=`| greater than or equal to|
|`<=`| lesser than or equal to|
|`\|`| used for [modulo operation](https://en.wikipedia.org/wiki/Modulo_operation) with remainder = 0 (exact division)|

#### Some of available triggers:  

Trigger|When it occurs 
:-|:-
Analog#A0div10<a id="Analog"></a>|when the `A0` input changes by more than 1% it provides a value between 0 and 100
Button2#State<a id="ButtonState"></a>|when a button changes state:<br>`0` = OFF<BR>`1` = ON<BR>`2` = TOGGLE<BR>`3` = HOLD
Clock#Timer=3<a id="ClockTimer"></a>|when global `Timer3` is activated
Dimmer#Boot<a id="DimmerBoot"></a>|occurs after Tasmota starts<a id="ADC0"></a> 
Dimmer#State<a id="DimmerState"></a>|when the value for Dimmer is changed
Event#eventName<a id="EventeventName"></a>|when command `Event eventName` is executed. You can define your own event values and trigger them with the [`Event`](commands#event) command.
FanSpeed#Data=3|when the fan speed is set to `3`
Mem\<x>#State<a id="MemState"></a>|when the value for Mem\<x> is changed
Http#Initialized<a id="HttpInitialized"></a>|
Mqtt#Connected<a id="MqttConnected"></a>|when MQTT is connected
Mqtt#Disconnected<a id="MqttDisconnected"></a>|when MQTT is disconnected
Power1#Boot<a id="PowerBoot"></a>|`Relay1` state before Wi-Fi and MQTT are connected and before Time sync but after `PowerOnState` is executed. Power#Boot triggers before System#Boot.<BR>This trigger's value will be the last state of `Relay1` if [`PowerOnState`](Commands#poweronstate) is set to its default value (`3`).
Power1#State<a id="PowerState"></a>|when a power output is changed<br>use `Power1#state=0` and `Power1#state=1` for comparison, not =off or =on<br>Power2 for Relay2, etc.
Rules#Timer=1<a id="RulesTimer"></a>|when countdown `RuleTimer1` expires
Switch1#Boot<a id="SwitchBoot"></a>|occurs after Tasmota starts before it is initializated.
Switch1#State<a id="SwitchState"></a>|when a switch changes state:<br>`0` = OFF<BR>`1` = ON<BR>`2` = TOGGLE<BR>`3` = HOLD<BR>(`SwitchTopic 0` must be set for this to trigger)
System#Boot<a id="SystemBoot"></a>|occurs once after Tasmota is intialised (after the INFO1, INFO2 and INFO3 console messages).
System#Save<a id="SystemSave"></a>|executed just before a planned restart
Time#Initialized<a id="TimeInitialized"></a>|once when NTP is initialized and time is in sync
Time#Initialized>120|once, 120 seconds after NTP is initialized and time is in sync
Time#Minute<a id="TimeMinute"></a>|every minute
Time#Minute\|5|every five minutes
Time#Minute==241|every day once at 04:01 (241 minutes after midnight)
Time#Set<a id="TimeSet"></a>|every hour when NTP makes time in sync
Var\<x>#State<a id="VarState"></a>|when the value for Var\<x> is changed
Wifi#Connected<a id="WifiConnected"></a>|when Wi-Fi is connected
Wifi#Disconnected<a id="WifiDisconnected"></a>|when Wi-Fi is disconnected

Every [command](Commands) with a one level JSON response has the #Data trigger.

Trigger           | When it occurs |
------------------|----------------|
|\<command>#Data|A response such as {"Fanspeed":3} has the Fanspeed#Data trigger.<br>A response like {"PulseTime2":{"Set":0,"Remaining":0}} does NOT have the #data trigger as the triggers are PulseTime2#Set and PulseTime2#Remaining. 

Connected sensors can be a trigger in the form as they are represented in the `TelePeriod` and `Status 8` JSON payloads.  

Trigger           | When it occurs |
------------------|----------------|
|DS18B20#Temperature| whenever the temperature of sensor DS18B20 changes|
|DS18B20#Temperature<20| whenever the temperature of sensor DS18B20 is below 20 degrees|
|AM2301-12#Humidity==55.5| whenever the humidity of sensor AM2301-12 equals 55.5%|
|INA219#Current>0.100| whenever the current drawn is more than 0.1A|
|Energy#Power>100| whenever the power used is more than 100W|

To trigger only at TelePeriod time, prefix the sensor with the word `Tele-`.  

Trigger           | When it occurs |
------------------|----------------|
|Tele-AM2301#Temperature|sensor AM2301 Temperature value when the TelePeriod JSON payload is output|

Hardware and software serial interface, RF, IR and TuyaMCU are also supported based on their [JSON](JSON-Status-Responses) status message:  

Trigger           | When it occurs |
------------------|----------------|
|TuyaReceived#Data=\<hex_string><a id="TuyaReceivedData"></a>| whenever \<hex_string> is received with [TuyaMCU](tuyamcu) component|
|SerialReceived#Data=\<string><a id="SerialReceivedData"></a>| whenever \<string> is received via hardware serial|
|SSerialReceived#Data=\<string>| whenever \<string> is received via software serial|
|IrReceived#Data=801<a id="IrReceivedData"></a>| whenever an IR signal for a RC5 remote control button 1 is received|
|IrReceived#Data=0x00FF9867|whenever an IR signal with hex code 0x00FF9867 is received|
|RfReceived#RfKey=4<a id="RfReceivedRfKey"></a>| whenever the [RF Bridge](Sonoff-RF-Bridge-433) receives a recognized RfKey 4 signal
|RfReceived#Data=0xE8329E<a id="RfReceivedData"></a>|whenever an RF signal with hex code 0xE8329E is received|

[Back To Top](#top)

### Rule Command
A rule command can be any command listed in the [Commands list](Commands). The command's `<parameter>` can be replaced with  `%value%` which will use the value of the trigger. 

`ON Switch1#State DO Power %value% ENDON`

To accomplish a rule with one trigger but several commands, you need to use `Backlog`:  
`ON <trigger> DO Backlog <command1>; <command2>; <command3> ENDON`

**Appending a rule onto an existing rule set**  
Use the `+` character to append a new rule to the rule set. For example:

&nbsp;&nbsp;&nbsp;&nbsp;Existing Rule1:  `ON Rules#Timer=1 DO Mem2 %time% ENDON`

&nbsp;&nbsp;&nbsp;&nbsp;Rule to append:  `ON button1#state DO POWER TOGGLE ENDON`

&nbsp;&nbsp;&nbsp;&nbsp;Command:         `Rule1 + ON button1#state DO POWER TOGGLE ENDON`

&nbsp;&nbsp;&nbsp;&nbsp;Resulting Rule1: `ON Rules#Timer=1 DO Mem2 %time% ENDON ON button1#state DO POWER TOGGLE ENDON`

### Rule Variables

There are ten available variables (double precision reals) in Tasmota, `Var1..Var5` and `Mem1..Mem5`. All `Var` will be empty strings when the program starts. The value of all `Mem` persists after a reboot. They provide a means to store the trigger `%value%` to be used in any rule.    

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

To set the value for `Var<x>` and `Mem<x>` use the command  
- `Var<x> <value>`
- `Mem<x> <value>`

The `<value>` can also be the value of the trigger of the rule.  
- Set Var2 to the temperature of the AM2301 sensor - `ON AM2301#Temperature DO Var2 %value% ENDON`
- Set Var4 to Var2's value - `ON Event#temp DO Var4 %Var2% ENDON`
- Set Mem2 to the current time (minutes elapsed since midnight) - `ON Rules#Timer=1 DO Mem2 %time% ENDON`
- After a Wi-Fi reconnect event, publish a payload containing timestamps of when Wi-Fi was disconnected in *From:* and when Wi-Fi re-connected in *To:* to `stat/topic/BLACKOUT`.
  ```
  Rule1
  ON wifi#disconnected DO Var1 %timestamp% ENDON
  ON wifi#connected DO Var2 %timestamp% ENDON
  ON mqtt#connected DO Publish stat/topic/BLACKOUT {"From":"%Var1%","To":"%Var2%"} ENDON
  ```
