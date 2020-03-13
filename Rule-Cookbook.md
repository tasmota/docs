<a id="top"></a>
- [Use long press action on a switch](#use-long-press-action-on-a-switch)
- [Execute any MQTT message when a button is pressed](#execute-any-mqtt-message-when-a-button-is-pressed)
- [Execute Several Commands when a Timer Expires](#execute-several-commands-when-a-timer-expires)
- [Usage of one-shot (once)](#usage-of-one-shot-once)
- [Use of Variables and tele-](#use-of-variables-and-tele-)
- [Use a Potentiometer](#use-a-potentiometer)
- [Setting Variables](#setting-variables)
- [Control device LEDs with Relays](#control-device-leds-with-relays)
- [Thermostat Example](#thermostat-example)
- [Solar heater control](#solar-heater-control)
- [Energy Saving Smart Switch](#energy-saving-smart-switch)
- [Time-delayed Auto-off Switch](#Time-delayed-Auto-off-Switch)
  - [Time-delay After Switch Off](#Time-delay-After-Switch-Off)
  - [Auto-off Motion Sense Switch](#Auto-off-Motion-Sense-Switch)
- [Controlling Timers Enabled from a switch](#controlling-timers-enabled-from-a-switch)
- [Toggle a Relay only when holding the button for 2 seconds](#toggle-a-relay-only-when-holding-the-button-for-2-seconds)
- Using Sunrise and Sunset
  - [Make sure light is on at night](#make-sure-light-is-on-at-night)
  - [Turn On Light Before Dawn and At Dusk](#Turn-On-Light-Before-Dawn-and-At-Dusk)
  - [Enable a PIR Switch only at night](#enable-a-pir-switch-only-at-night)
    - [PIR Configuration](peripherals/PIR-Motion-Sensors)
  - [Using clock timer to control a luminance-triggered switch only in mornings](#using-clock-timer-to-control-a-luminance-triggered-switch-only-in-mornings)
- [Button with single press, double press, and hold](#button-with-single-press-double-press-and-hold)
- [Perform any action on single/double press (for switches AND buttons)](#perform-any-action-on-singledouble-press-for-switches-and-buttons)
- [External switch to enable or disable doorbell relay with HTTP call](#External-switch-to-enable-or-disable-doorbell-relay-with-HTTP-call)
- [Force automatic re-connection to MQTT server via SD DNS](#force-automatic-re-connection-to-mqtt-server-via-sd-dns)
- [Change distance to percentage](#change-distance-to-percentage)
- [Distinguish Switch1 and Switch2 without the use of Relay1 and Relay2](#distinguish-switch1-and-switch2-without-the-use-of-relay1-and-relay2)
- [Receiving state of anything that triggers SWITCH more than one time](#receiving-state-of-anything-that-triggers-switch-more-than-one-time)
- [Prevent Wemos D1 mini load overcurrent](#prevent-wemos-d1-mini-load-overcurrent)
- [Using dummy GPIO to send Serial codes to the MCU](#Using-dummy-gpio-to-send-Serial-codes-to-the-MCU)
- [Arithmetic Commands to be used with VARs](#arithmetic-commands-to-be-used-with-vars)
  - [Transmit sensor value only when a delta is reached](#Transmit-sensor-value-only-when-a-delta-is-reached)
  - [Adjust the value of a sensor and send it by MQTT](#adjust-the-value-of-a-sensor-and-send-it-by-mqtt)
- [Switch relays via serial interface](#Switch-relays-via-serial-interface)
- [Using BREAK to simulate IF..ELSEIF..ELSE..ENDIF](#Using-BREAK-to-simulate-IFELSEIFELSEENDIF)
- [Adjust PowerDelta according to current Power values](#adjust-powerdelta-according-to-current-power-values)
- [IR Forward](#ir-forward)
- [Garage Door Opener](#Garage-Door-Opener)
- [Remote Control Button Multi-press](#Remote-Control-Button-Multi-press)
- [Two-way light switches without MQTT](#two-way-light-switches-without-mqtt)
- [Roller shutter push-button toggle](#roller-shutter-push-button-toggle)
------------------------------------------------------------------------------

#### Use long press action on a switch

> [!NOTE]
> This example is for GPIOs defined as switches not buttons

Activate long press action with `Switchmode 5` and shorten long press time to 2 seconds (`Setoption32 20`).

Long pressing on switch1 sends `POWER 2` (toggle action) command to the `tasmota02` device
```console
Backlog SwitchMode 5; SetOption32 20
Rule on switch1#state=3 do publish cmnd/tasmota02/POWER 2 endon
Rule 1
```
Notice we use `Rule` which edits `Rule1` rule set. They can be used interchangeably.


[Back To Top](#top)

------------------------------------------------------------------------------

#### Execute any MQTT message when a button is pressed
When a button is pressed the user has the possibility to send a MQTT message based on FullTopic and ButtonTopic. This MQTT message is going to be received by the MQTT Broker and if there is any other device(s) subscripted to that Topic, it will receive also that message. So this approach can be used for sending messages/commands to MQTT Broker to Home Automation System, and/or sending messages/commands to MQTT Broker to other device(s).

A problem with this solution is that on a Sonoff 4CH all four buttons will be sending the same MQTT topic using only a different Power index number like `cmnd/ButtonTopic/power3 toggle`.

By using a rule a single button can now send any MQTT message allowing much more flexibility.

Hardware
- Sonoff 4CH

Software
- Tasmota compiled with `#define USE_RULES`
- Disable ButtonTopic as it overrides rules for buttons: `ButtonTopic 0`

Rule
```console
Rule1
  on button1#state do publish cmnd/ring2/power %value% endon
  on button2#state do publish cmnd/strip1/power %value% endon
```

(You will likely need to enable this rule if it's the first time you've used them)
"Rule1 on".

Result
- When button 1 is pressed the rule kicks in and sends a MQTT message substituting variable `%value%` with the button state like `cmnd/ring2/power 2`. When button 2 is pressed a MQTT message like `cmnd/strip1/power 2` will be sent.


[Back To Top](#top)

------------------------------------------------------------------------------

#### Execute several commands when a Timer expires
The default Timer1..16 functionality allows for controlling one output to either off, on, toggle or blink. When rules are enabled the blink option will be replaced by rule functionality allowing much more flexibility.

Hardware
- Sonoff 4CH

Software
- Tasmota compiled with `#define USE_RULES`
- Configure timer5 for rule execution when activated:  
  ```console
  Timer5 {"Arm":1,"Mode":0,"Time":"16:00","Days":"1111111","Repeat":1,"Action":3}
  ```
- Rule  
  ```console
  Rule1 on clock#Timer=5 do backlog power2 on;power1 off;power3 2 endon
  ```

Result
- When the timer expires the rule kicks in and set Power1 to OFF, Power2 to ON and Toggles Power3

If you want to have blink functionality define a rule like `on clock#Timer=5 do power 3 endon`


[Back To Top](#top)

------------------------------------------------------------------------------

#### Usage of one-shot (once)
The rule command once option provides the possibility to trigger only once on a slow change while the change is still within the bounds of the test.


```console
Rule
  on ENERGY#Current>0.100 do publish tool/tablesaw/power 1 endon
  on ENERGY#Current<0.100 do publish tool/tablesaw/power 0 endon
```

This creates a rule to publish MQTT commands whenever a Sonoff POW has current passing through it. Used as is, it will publish MQTT commands repeatedly, over and over, while current is >0.100 ... but, executing another command:

`Rule 5`

Now the MQTT message will be sent once, and only once, while the condition is met. This is perfect for thermostat on/off depending on temperature, bathroom extractor fan on/off depending on humidity, workshop dust collector on/off depending on whether some dust-producing machine is running.

It meets the 'hard thermostat' requests that have been common.


[Back To Top](#top)

------------------------------------------------------------------------------

#### Use of variables and tele-
Using variables allows for storing sensor results to be used in composing a single HA message like used with Domoticz. To prevent flooding Domoticz with messages we only want to send a message at TelePeriod time. This is achieved by prefixing the `<SensorName>` with the label `tele-`. This example will use a variable storing the temperature to be used together with humidity in one Domoticz MQTT message.

Hardware
- Sonoff TH or Wemos D1 mini
- AM2301 Temperature and Humidity sensor

Software
- Tasmota compiled with `#define USE_RULES`
- Home Automation tool Domoticz configured with a virtual sensor Temp+Hum using Idx 134

Rule
```console
Rule
  on tele-am2301-12#temperature do var1 %value% endon
  on tele-am2301-12#humidity do publish domoticz/in {"idx":134,"svalue":"%var1%;%value%;1"} endon
```

Result
- As a result of the `tele-` prefix the rules will be checked at TelePeriod time for sensor AM2301-12 Temperature and Humidity. The first rule will use the Temperature stored in `%value%` and save it in `%var1%` for future use. The second rule will use the Humidity stored in `%value%` and the Temperature stored in `%var1%` to compose a single MQTT message suitable for Domoticz. 

Clever Dickies now finally have a way to send Temperatures from multiple DS18B20 to Domoticz.


[Back To Top](#top)

------------------------------------------------------------------------------

#### Use a potentiometer
Connecting a potentiometer to the Analog A0 input and a rule can be used to control the dimmer state of any device.

Hardware
- Wemos D1 mini
- Potentiometer of 2k2 connected to Gnd, A0 and 3V3
- WS2812 LED

Software
- Tasmota compiled with `#define USE_RULES`

```console
Rule on analog#a0div10 do dimmer %value% endon
```

Result
- Turning the potentiometer the voltage on the analog input will change resulting in a value change of 0 (Off) to 100 for the trigger. Using this value to control the dimmer of the WS2812 will control the brightness of the led(s)

```console
Rule on analog#a0div10 do publish cmnd/grouplight/dimmer %value% endon
```

Result
- This time all lights configured with GroupTopic `grouplight` will change their brightness according to the potentiometer position.

NOTE: You might want to execute command `SaveData 2` to reduce flash writes ;-)


[Back To Top](#top)

------------------------------------------------------------------------------

#### Setting variables
Demonstrate the use of variables. Make sure to execute commands `Rule 4`(Disable one-shot detection) first when trying the following example.

Set a variable

```console
Rule on event#setvar1 do var1 %value% endon
```

Command:  `event setvar1=1`

View a variable
```console
rule on event#getvar1 do var1 endon
```

Command:  `event getvar1`

* Toggle a variable

```console
Rule
  on event#togglevar1 do event toggling1=%var1% endon
  on event#toggling1<1 do event setvar1=1 endon
  on event#toggling1>0 do event setvar1=0 endon
  on event#setvar1 do var1 %value% endon
 ```

Command:  `event togglevar1`

Show Messages:

```console
Rule on event#message do publish stat/[topic]/log %value% endon
```

Command:  `event message=INIT`

All event commands can be executed from:

- console: `event anyname=number`
-  mqtt:    `cmnd/[topic]/event anyname=number`

Everything together:  
```console
Rule1 
  on event#togglevar1 do event toggling1=%var1% endon 
  on event#toggling1<1 do event setvar1=1 endon 
  on event#toggling1>0 do event setvar1=0 endon 
  on event#setvar1 do var1 %value% endon 
  on event#getvar1 do var1 endon 
  on event#message do publish stat/mqttTopic/log %value% endon
```

>[!NOTE]
>The following won't work:  
```console
Rule1 on event#setvar1 do backlog var1 %value%; power1 %var1% endon
```

At least not as you probably would expect. The `var1` value used by the `power1` command will be the value present before the `backlog` command is executed. This is so, because the rule will replace `%var1%` BEFORE the `backlog` commands are put in the `backlog` command stream.


[Back To Top](#top)

------------------------------------------------------------------------------
#### Control device LEDs with Relays
If a device has more than one relay and LEDs on different GPIOs (not connected to the relay) you need to use rules to display current relay status on LEDs. This example is a 3 gang wall switch. Instead of LEDs you need to assign 3 dummy relays that will be controlled when the real relays are switched to reflect their status.

```console
Backlog ledmask 0x0000; setoption13 1; seriallog 0

rule1 
  on power1#state do power4 %value% endon 
  on power2#state do power5 %value% endon 
  on power3#state do power6 %value% endon

rule1 1
```
Note: This method doubles the number of flash writes. [Link to the device](https://blakadder.github.io/templates/DS-102_3.html)

[Back To Top](#top)

------------------------------------------------------------------------------

#### Thermostat Example

As example, to be used on a Sonoff TH10 with Sensor Si7021

This example turn on and off an output based on the temperature value and the upper set point and the lower set point.
It waits until is enabled by pressing the button or by mqtt message 1 to mem1. This value is remembered. So if power cycle occurs, will resume operation.
The set point values can be changed on the fly by mqtt or console commands
If the Temperature sensor disconnects, the outputs will shutdown until the sensor is back again and will resume operation.
When the device is power up, the thermostat also waits until the sensor value to resume operation.

Initial Config:

* Available physical button as **switch1**
* **Relay1** will be used the controller
* **Rules** must be used to control Relay so the pushbutton must only control **switch1** and not directly control the relay - For this we use SwitchMode1 3 as described below and create the necessary rules because the pushbutton control of the relay is only disabled when the rules are in place.

Initial config on console:

* `SwitchMode1 3`  <- Use the switch1 as pushbutton (It will allow us to disable the link between the button and the relay by inserting a rule to dictate what the pushbutton will do - **NOTE: Until rules are created the pushbutton will still control the relay!**)
* `Rule1 1 `        <- turn on rules
* `Rule1 4`        <- turn off one-shot rule
* `TelePeriod 60`  <- check temp every minute
* `SetOption26 1`  <- use power1 on mqtt messages
* `SetOption0 0`   <- dont save relay status on eeprom
* `PowerOnState 0` <- start all relays off
* `Mem1 0`         <- thermostat status: 0-off 1-enabled - View or set by MQTT cmnd/mqttTopic/mem1
* `Mem2 25`       <- setpoint Temp upper limit - View or set by MQTT cmnd/mqttTopic/mem2
* `Mem3 23`        <- setpoint Temp lower limit - View or set by MQTT cmnd/mqttTopic/mem3
* `Var1 0 `       <- thermostat actual status: 1-OK 0-NOT READY - View by MQTT cmnd/mqttTopic/var1

Rules:

On boot start a watchdog timer to check temp sensor connection.  
```console
Rule on system#boot do RuleTimer1 70 endon
```

An available button is configured as switch to set thermostat ON or OFF
```console
Rule1
  on switch1#state do backlog event toggling1=%mem1% endon
  on event#toggling1=0 do mem1 1 endon
  on event#toggling1=1 do mem1 0 endon
```

Check temp sensor connection. If fails, set to off and turn off thermostat. Also continue checking  
```console
Rule on Rules#Timer=1 do backlog var1 0; RuleTimer1 70; power1 0 endon
```

Resets checking timer if temperature is connected  
```console
Rule on tele-SI7021#temperature do backlog var1 1; RuleTimer1 30; event ctrl_ready=1; event temp_demand=%value% endon
```

Thermostat control - upper limit and lower limit and enabled  
```console
Rule1
  on event#ctrl_ready>%mem1% do var1 0 endon
  on event#temp_demand>%mem2% do power1 0 endon
  on event#temp_demand<%mem3% do power1 %var1% endon
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

INITIAL CONFIG: (Note: RuleTimer1 must be greater that TelePeriod for expected results)

```console
backlog SwitchMode1 3; Rule 1; Rule 4; TelePeriod 60; SetOption26 1; SetOption0 0; poweronstate 0; mem1 0; mem2 25; mem3 23; var1 0
```

RULES:

```console
Rule1 
  on system#boot do RuleTimer1 70 endon 
  on Switch1#State do event toggling1=%mem1% endon 
  on event#toggling1=0 do mem1 1 endon 
  on event#toggling1=1 do mem1 0 endon 
  on Rules#Timer=1 do backlog var1 0; RuleTimer1 70; power1 0 endon 
  on tele-SI7021#temperature do backlog var1 1; RuleTimer1 70; event ctrl_ready=1; event temp_demand=%value% endon 
  on event#ctrl_ready>%mem1% do var1 0 endon 
  on event#temp_demand>%mem2% do power1 0 endon 
  on event#temp_demand<%mem3% do power1 %var1% endon
```

EXAMPLE RULES WITHOUT TEMP SENSOR TO TEST THE THERMOSTAT RULES

```console
Rule1 
  on system#boot do RuleTimer1 70 endon 
  on Switch1#State do event toggling1=%mem1% endon 
  on event#toggling1=0 do mem1 1 endon 
  on event#toggling1=1 do mem1 0 endon 
  on Rules#Timer=1 do backlog var1 0; RuleTimer1 70; power1 0 endon 
  on event#temp do backlog var1 1; RuleTimer1 70; event ctrl_ready=1; event temp_demand=%value% endon 
  on event#ctrl_ready>%mem1% do var1 0 endon 
  on event#temp_demand>%mem2% do power1 0 endon 
  on event#temp_demand<%mem3% do power1 %var1% endon
```

TESTS:  
* Push the button1. The thermostat changes to ENABLED (mem1=1)
* on console: event temp=20 (now the system receives like a tele message from temperature sensor) and will turn on the relay1 (to heat)
* on console: event temp=26 (the thermostat turn off the heater)
* on console: event temp=22 (the thermostat turn on the heater)
* wait more than a minute without using the event temp and the thermostat will turn off as there is no temperature value (like a sensor error or disconnection)
* will resume when using again the event temp
* console mem1 0, DISABLED, console mem1 1, ENABLED

TIMERS:  
* With the above the timers can be used to control mem1 and add a schedule to when the thermostat will be enabled  
  `Rule2 on Clock#Timer=1 do mem1 1 endon
on Clock#Timer=2 do mem1 0 endon`

[Back To Top](#top)

------------------------------------------------------------------------------

#### Solar heater control

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

```console
mem3 25

rule1
  on DS18B20-1#temperature do
    event t1=%value%
  endon
  on DS18B20-2#temperature do
    event t2=%value%
  endon
  on event#t2>%mem3% do 
    var1 1;
  endon
  on event#t2<=%mem3% do 
    var1 0;
  endon
  on event#t1 do 
    backlog
    var2 %value%;
    add2 1;
  endon
  on event#t1 do 
    backlog
    var3 %value%;
    add3 2;
  endon
  on event#t2>%var3% do
    power1 %var1%;
  endon
  on event#t2<%var2% do
    power1 0;
  endon

rule1 1
```

To test the rule without having the sensors in place, simply enter the events for `t1` and `t2` in the console:  
`Backlog event t1=21;event t2=30`

And watch the relay turn on and off based on the values.

Please note that this example does not support manual override or handle missing sensor data. Take a look at [Thermostat Example](#thermostat-example) for examples.

[Back To Top](#top)

------------------------------------------------------------------------------

#### Energy Saving Smart Switch

Example of a switch controlling a light with a condition of a required amount of lux.

When the switch is on, the light will turn on but only when you have less than 100 lux in that room. While if the switch is off the light will be off.

```console
Rule1
  on switch1#state=1 do var1 100 endon
  on switch1#state=0 do backlog var1 0; power1 off endon
  on APDS9960#Ambient<%var1% do power1 on endon
```

_All together to work as a rule:_

```console
Rule 1

Rule1
  on switch1#state=1 do var1 100 endon 
  on switch1#state=0 do backlog var1 0; power1 off endon 
  on APDS9960#Ambient<%var1% do power1 on endon
```

[Back To Top](#top)

------------------------------------------------------------------------------

#### Time-delayed Auto-off Switch
**Rule:**  
```console
Rule1
  on button1#state do backlog power1 %value%; RuleTimer1 600 endon
  on Rules#Timer=1 do power1 off endon
```

**Result:**  
  `on button1#state do backlog power1 %value%;`  
  > On Button press the Light will toggle on/off  

  `RuleTimer1 600 endon`  
  > Additionally RuleTimer1 will begin to countdown 10 minutes  

  `on Rules#Timer=1 do power1 off endon`  
  > After the RuleTimer1 expires the light will be turned off (if you forgot to turn it off)  


[Back To Top](#top)

------------------------------------------------------------------------------

#### Time-delay After Switch Off
```console
Rule1 on switch1#state=1 do backlog
  power1 on;
  ruletimer1 0
endon
on switch1#state=0 do
  ruletimer1 300
endon
on rules#timer=1 do
  power1 0
endon
```
```console
backlog switchmode1 1; rule1 1
```

**Legend:**  
`ruletimer1 300` sets a 5 minute timer. After that time, fan will be switched off. If during the defined 5 minutes (or in general - when timer is counting) you the switch on, the timer will be canceled.

`switchmode1 1` sets the switch in follow mode (LOW=off, HIGH=on)  
If you have inverted switch (LOW=on, HIGH=off) then use `switchmode1 2` 

[Back To Top](#top)

------------------------------------------------------------------------------

#### Auto-off Motion Sense Switch
Example works fine on a Wemos D1 Mini. Used as night light with motion sensor or as ambient light on floor or kitchen.
I connect an LED Strip WS2812 on D1 and the PIR on D2 and a LDR on A0 (voltage divider with 10k ohm resistor)

PIR example: HR-SC501

**The Settings are:**  
18 Generic  
D1 WS2812  
D2 Switch1  
LDR on Wemos A0 (activated in user_config_override.h)  

and type the following statements in the Console:

**Rules:**   
```console
SwitchMode1 1

Rule1
  on analog#a0<400 do backlog Rule3 0; Rule2 1 endon
  on analog#a0>500 do backlog Rule2 0; Rule3 1 endon

Rule2
  on switch1#state do backlog power1 1; RuleTimer1 30 endon
  on Rules#Timer=1 do power1 off endon

Rule3
  on switch1#state do power1 off endon
```

Activate Rule1 with one shot detection  
`Backlog Rule1 1; Rule1 6`  

Optional  
`Backlog Rule2 4; Rule3 4`  

**Result:**  
* `on analog#a0>400`  
  > disable Rule3 and activate Rule2
* `on analog#a0>500`  
  > disable Rule2 and activate Rule3
* Rule2 activates the LEDs for RuleTimer1 30 seconds on each trigger from PIR the RuleTimer start again.  
  `on Rules#Timer=1 do power1 off`  
  > The LEDs turn off after the RuleTimer expires  
* Rule3 is active on daylight and pipe the PIR signal in a power1 off signal. The LEDs stay off.  

[Back To Top](#top)

------------------------------------------------------------------------------

#### Controlling Timers Enabled from a Switch

Assuming that your switch is on `GPIO00` and configured as `Switch1`:

```console
SwitchMode1 1

Rule1
  on Switch1#state=1 do Timers 0 endon
  on Switch1#state=0 do Timers 1 endon

Rule1 1
```

[`Switchmode1 1`](Commands#switchmode) will make Switch1#state be 1 when ON and 0 when OFF

If you don't set `Switchmode1` or it is equal 0, it will only have `Switch1#state=2` (toggle) and the previous rule will not work.


[Back To Top](#top)

------------------------------------------------------------------------------

#### Toggle a Relay only when holding the button for 2 seconds

The following example is to explain how to catch and use the HOLD feature for buttons.

Behavior: Disable Button1 Short Press and Toggle Relay1 only when holding button1 for 2 Seconds.

Type in the console:

```console
Backlog ButtonTopic 0; SetOption1 1; SetOption32 20

Rule1
  on button1#state=3 do power1 2 endon
  on button1#state=2 do delay endon

Rule1 1
```

**Commands Explanation**

`ButtonTopic 0` : (default) To not use topics for buttons  
`SetOption1 1` : Allow only single, double and hold press button actions  
`SetOption32 20` : Set key hold time from 0.1 to 10 seconds (20 = 2 seconds)  
`Rule on button1#state=3 do power1 2 endon` : When holding the button1 for 2 seconds it will toggle relay 1 (state = 3 means HOLD)  
`on button1#state=2 do delay endon` : Do nothing when short pressing the button1 (state = 2 means TOGGLE)  
`Rule1 1` : To enable rules  

NOTE: There is no state value for "double press" for Buttons. It is designed that double press will toggle the relay. See [Multi-Press Functions](Buttons-and-Switches#multi-press-functions) for more information.

In the case you do not want the double press feature you can configure your button as switch and also set `SwitchMode` that fits your use case (such as `SwitchMode 5` to make the switch behave like a pushbutton) [SWITCH does not support double press] 

**Another example but using switch instead of button:**

```console
Backlog SwitchTopic1 0; SwitchMode1 5; SetOption32 20

Rule1
  on switch1#state=3 do power1 2 endon
  on switch1#state=2 do delay endon

Rule1 1
```

[Back To Top](#top)

------------------------------------------------------------------------------

#### Make Sure Light is on at Night

Using Timers, you can set a light to turn on and off to illuminate a street/patio by night. But if the device has no power at the trigger time, then, when it powers up, the light will be off all night. So, as a fail-safe, implement a conditional control to be checked at Tasmota Startup.

Set Timers to turn on your light at Sunset and Turn off at sunrise.
Use `poweronstate 0` in order to start with lights off when powering up your device.
Set the following rules:

```console
Rule1
  on Time#Initialized do backlog event checksunrise=%time%; event checksunset=%time% endon
  on event#checksunset>%sunset% do power1 1 endon
  on event#checksunrise<%sunrise% do power1 1 endon
```

The previous rules are conditionals that represent the following logic:

IF %time%>%sunset DO power1 1 / IF %time%<%sunrise DO power1 1

[Back To Top](#top)

------------------------------------------------------------------------------

#### Turn On Light Before Dawn and At Dusk
Turn on light at dusk until your nighttime and again in the morning before dawn.  

What if the sun sets after your nighttime, as in during the summer? Then the timer will turn off the light at "night", but then the Sunset timer will turn it on again, so it stays on all night.  
```console
Rule1
  on Time#Initialized do event chkSun endon
  on Time#Minute=%sunset% do event chkSun endon
  on Time#Minute=%mem2% do event chkSun endon
  on Time#Minute=%sunrise% do event chkSun endon
  on Time#Minute=%mem1% do event chkSun endon

Rule2
  on event#chkSun do backlog var1 0; event chkSunrise=%time%; event chkSunset=%time%; event chkmorn=%time%; event chknight=%time%; event setPower endon
  on event#chkSunrise<%sunrise% do var1 1 endon
  on event#chkSunset>=%sunset% do var1 1 endon
  on event#chkmorn<%mem1% do var1 0 endon
  on event#chknight>=%mem2% do var1 0 endon
  on event#setPower do power1 %var1% endon
```

```console
Backlog mem1 360; mem2 1350
Backlog Rule1 1; Rule2 1
```

**Explanation:**  
  - When device restarts, calculate if the light should be on or off  
  `on Time#Initialized do event chkSun endon`

  - Calculate if the light should be on or off  
  `on Time#Minute=%sunset% do event chkSun endon`
  `on Time#Minute=%mem2% do event chkSun endon`
  `on Time#Minute=%sunrise% do event chkSun endon`
  `on Time#Minute=%mem1% do event chkSun endon`

  -  Calculate if the light should be on or off  
  `on event#chkSun do backlog `
  
  - Assume off  
  `var1 0; `
  
  - Trigger each event with the current time  
  `event chkSunrise=%time%; event chkSunset=%time%; event chkmorn=%time%; event chknight=%time%; event setPower`
  - End rule   
   `endon`
  
  - If before sunrise, turn on  
  `on event#chkSunrise<%sunrise% do var1 1 endon`
  
  - If past sunset, turn on  
  `on event#chkSunset>=%sunset% do var1 1 endon`
  
  - But if before Morning time (`mem1`), do not turn on  
  `on event#chkmorn<%mem1% do var1 0 endon`
  
  - Or if after Night time (`mem2`), do not turn on  
  `on event#chknight>=%mem2% do var1 0 endon`
  
  - Perform on/off state  
  `on event#setPower do power1 %var1% endon`

  - Set variables for Morning (06h00) and Night (22h30) times  
  `Backlog mem1 360; mem2 1350`

  - Turn on the rule sets  
  `Backlog Rule1 1; Rule2 1`

[Back To Top](#top)

------------------------------------------------------------------------------

#### Enable a PIR Switch only at night

PreInfo:
- PIR HC-SR501
- GPIO14 09 Switch1 (Sonoff Basic)
- Jumper outside ( [like this](https://user-images.githubusercontent.com/14855001/44810565-5c034480-abd2-11e8-893e-1be9302cb91e.jpg) )
- Lat and Lng set in config

Commands:
```console
SwitchMode1 1

Rule1
  on Switch1#state=1 do backlog event checksunrise=%time%; event checksunset=%time% endon
  on event#checksunrise<%sunrise% do power1 1 endon
  on event#checksunset>%sunset% do power1 1 endon

Rule1 1
```

[Back To Top](#top)

------------------------------------------------------------------------------

#### Using Clock Timer to control a Luminance triggered switch (only in mornings)

**Background:**
Tasmota powers a Sonoff Basic attached to a TS-2561 Luminance Sensor. This switch toggles a lamp ON or OFF. The switch should work as below: 
i) during daytime (sunrise-sunset): ON when it is too dark (<150 lx)  and OFF when it gets brighter (>175 lx). 
ii) during evenings it ignores the sensor and turns on at sunset and turns off after about 5 hours 

**Approach:**
Used a combination of Clock Timers and Rule to do this. 

**Timer 1:** Power ON switch at Sunset  
Powers on the switch at sunset with an offset of 20 minutes. Repeats every day.  
```console
Timer1 {"Arm":1,"Mode":2,"Time":"-00:20","Window":0,"Days":"1111111","Repeat":1,"Output":1,"Action":1}
```

**Timer 2:** Power OFF switch at Night.  
Turns power OFF at 23.00hrs. Repeats every day.  
```console
Timer2 {"Arm":1,"Mode":0,"Time":"23:00","Window":0,"Days":"1111111","Repeat":1,"Output":1,"Action":0}
```

**Timer 3:** Trigger Luminance Rule at Sunrise  
Start watching the Lux sensor 15 minutes after sunrise.  
```console
Timer3 {"Arm":1,"Mode":1,"Time":"00:15","Window":0,"Days":"1111111","Repeat":1,"Output":1,"Action":3}
```

**Rule 1:** Main Rule to check Luminance  
If Luminance is less than 150lx, power ON. If it goes beyond 175lx, power OFF.  
```console
Rule1
  on tele-TSL2561#Illuminance<150 do power1 1 endon
  on tele-TSL2561#Illuminance>175 do power1 0 endon 

Rule1 1
```

**Rule 2:** Trigger Rule1 only in the Mornings  
This ensures that Rule1 is triggered when Timer3 starts (in the morning) and stops when Timer1 starts (in the evenings).  
```console
Rule2
  on Clock#Timer=3 do Rule1 1 endon
  on Clock#Timer=4 do  Rule1 0  endon

Rule2 1
```

[Back To Top](#top)

------------------------------------------------------------------------------

#### Button with single press, double press, and hold
You can have all 3 actions but only if defining your GPIO as button. In this case the double press will toggle the relay.

There is also an [option](Buttons-and-Switches#changing-default-functionality) to swap the actions of the **single press** and **double press**.

**_BUTTON WITH 3 DIFFERENT ACTIONS_**

- As an example:
  **_[assuming Button1]_**

  **single press**: Turn relay 1  
  **double press**: send a mqtt message  
  **hold 2 secs**: send another mqtt message

  ```console
  Backlog ButtonTopic 0; SetOption1 1; SetOption11 1; SetOption32 20
  
  Rule1
    on button1#state=3 do publish cmnd/topicHOLD/power 2 endon
    on button1#state=2 do publish cmnd/topicDOUBLEPRESS/power 2 endon 
  
  Rule1 1
  ```

- Another example:
  **_[assuming Button1]_**

  **single press**: send a mqtt message  
  **double press**: Turn relay 1  
  **hold 2 secs**: send another mqtt message  

  ```console
  Backlog ButtonTopic 0; SetOption1 1; SetOption11 0; SetOption32 20  
  
  Rule1
    on button1#state=3 do publish cmnd/topicHOLD/power 2 endon
    on button1#state=2 do publish cmnd/topicSINGLEPRESS/power 2 endon 
  
  Rule1 1
  ```

  _**Note:**_ `SetOption11 0`  

**_SWITCHES WITH 2 DIFFERENT ACTIONS_**  

**Switches do not have double press feature**  

- Example:
  **_[assuming a connected pushbutton configured as Switch1]_**

  **single press**: Do nothing  
  **hold 2 secs**: Toggle relay 1

  ```console
  Backlog SwitchTopic1 0; SwitchMode1 5; SetOption32 20  
  
  Rule1
    on Switch1#State=3 do Power1 2 endon
    on Switch1#State=2 do Delay endon  
  
  Rule1 1
  ```

[Back To Top](#top)

------------------------------------------------------------------------------

#### Perform any action on single/double press (for switches AND buttons)

```console
SwitchMode 5  

Rule1
  on switch1#state==2 do add1 1 endon
  on switch1#state==2 do power1 2 endon
  on var1#state!=0 do backlog delay 6;var1 0 endon
  on var1#state==2 do publish cmnd/othertasmota/POWER toggle endon

Rule1 on
```

**Explanation:**  
- each toggle of the switch triggers first condition and adds 1 to our variable (var1 in the example),
- each toggle of the switch toggles the associated relay (`Power1 2` - but can do anything else instead, `Publish` for example)
- when var1 changes to non zero, we set it back to 0 but after a `Delay` (arbitrarily chosen 6 here - 0.6 seconds)
- when var1 reaches 2 (i.e. the switch has been toggled twice within the last 0.6 seconds), desired action is triggered (here: `Publish` to `othertasmota`)

**Result:**  
Every time you press the switch, your light toggles state (as it should). If you do press the switch twice in a rapid succession (i.e., double-click), you can trigger a different action (e.g., on a remote device).

[Back To Top](#top)

------------------------------------------------------------------------------

#### External switch to enable or disable doorbell relay with HTTP call

When you want to send MQTT messages ( we use domoticz in this example ) and choose when you want the relay on or off, by simply sending HTTP commands to trigger an event.  

**Initial Config:**
- PushButton Doorbell
- (Sonoff Basic R1) GPIO14 - Switch4 (12)

Connect the Switch to GND and the GPIO on your device. Be sure put a 4.7k resistor between VCC(3.3v) and the GPIO. This prevents ghost switching (capacitor is optional) See: [YouTube](https://www.youtube.com/watch?v=aq8_os6g13s)  

_Dont forget to change the IDX value_

**Commands:**
```console
Backlog SwitchTopic 0; SwitchMode4 2; SetOption0 0; PowerOnState 0

var1 1

Rule1
  on event#doorbell do var1 %value% endon
  on switch4#state=1 do publish domoticz/in {"idx":11,"nvalue":1} endon
  on switch4#state=1 do power1 %var1% endon
  on switch4#state=0 do publish domoticz/in {"idx":11,"nvalue":0} endon
  on switch4#state=0 do power1 0 endon

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

[Back To Top](#top)

------------------------------------------------------------------------------

#### Force automatic re-connection to MQTT server via SD DNS

In order to search for the MQTT server using SD-DNS service (a.k.a. Bonjour or Zero Network Configuration) the suggested configuration is to leave the MQTT Host field blank.

The standard behavior of Tasmota is  
- searches for _mqtt._tcp service
- resolve that to the proper IP address
- connect to it 
- in case the connection is successful, retain the IP address and use that in the subsequent connections

The above is not proper, though, in case you have a redundant MQTT (e.g., two MQTT server synchronized).
In such case, when the active MQTT fails for any reason, the expected behavior is to achieve automatic re-connection to the other MQTT server.

That can be easily configured defining the following rule on the device console:
```console
Rule1 on Mqtt#Disconnected do MqttHost 0 endon
Rule1 1
```

If the MqttHost field already contains an IP, you have to delete it using the web interface or the following MQTT command:

```
mosquitto_pub -h mqtt_server.local -t "cmnd/mqttTopic/MqttHost" -m ''
```


[Back To Top](#top)

------------------------------------------------------------------------------

#### Change distance to percentage

When measuring distance and you have the need to see it in percentage of distance. In the example 100% is everything below 69cm and 0% is everything above 128cm. This is used for showing fill percentage of a wood pellets storage.

```console
Rule1
  on tele-SR04#distance do backlog var1 %value%; event checklimit=%value%; event senddistance endon
  on event#checklimit>128 do var1 128 endon
  on event#checklimit<69 do var1 68 endon
  on event#senddistance do backlog SCALE1 %var1%, 128, 69, 0, 100; event pubdata endon
  on event#pubdata do publish tele/pannrum-temp/SENSOR %var1% endon

Rule1 1
```

[Back To Top](#top)

------------------------------------------------------------------------------

#### Distinguish Switch1 and Switch2 (without the use of Relay1 and Relay2)

When two (or more) switches are defined as input and you want to distinguish these in the RESULT topic without the use of Relays, then consider the following rules. 

- SwitchMode1 1 will make Switch1#state to be 1 when ON and 0 when OFF  
  `SwitchMode1 1`

- SwitchMode2 1 will make Switch2#state to be 1 when ON and 0 when OFF  
  `SwitchMode2 1`

- Publish json with key POWER1 and value %value%
  `Rule1 on switch1#state do publish stat/wemos-4/RESULT {"POWER1":"%value%"} endon`

- Publish json with key POWER2 and value %value%  
  `Rule2 on switch2#state do publish stat/wemos-4/RESULT {"POWER2":"%value%"} endon`

- Enable Rule1  
  `Rule1 1`

- Enable Rule2  
  `Rule2 1`

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

[Back To Top](#top)

------------------------------------------------------------------------------

#### Receiving state of anything that triggers SWITCH more than one time

With analog intercom doorbells you can take out info about ringing from speaker voltage. You can connect GPIO to it via opto-isolator and resistor to take out state. But even with those speaker voltage is dropping so it switches the device multiple times.
```
MQT: cmnd/doorbell/POWER2 = OFF (retained)
MQT: cmnd/doorbell/POWER2 = ON (retained)
MQT: cmnd/doorbell/POWER2 = OFF (retained)
MQT: cmnd/doorbell/POWER2 = ON (retained)
MQT: cmnd/doorbell/POWER2 = OFF (retained)
```

To solve it we can use rules.
```console
SwitchTopic 0

Rule1
  on System#Boot var1 0 endon
  on Switch2#State do backlog add1 1; event START endon
  on event#START do event BELL=%var1% endon
  on event#BELL=1.000 do backlog publish cmnd/bell/power on; RuleTimer1 60 endon
  on event#BELL=0 do publish cmnd/bell/power off endon
  on Rules#Timer=1 do backlog var1 0; event BELL=0 endon

Rule1 1
```

description:
- turn off switchtopic as it is necessary to trigger Switch2#state
- on system boot set var1 to 0
- on switch2 click (person pushing doorbell) - var1 += 1; trigger event START
- on START - set event BELL equal to var1
- if event#BELL=1 (triggered first time) publish mqtt message ON and trigger RulesTimer1 for 60 seconds
- if event#BELL=0 publish mqtt message OFF 
- on RulesTimer1 - reset var1 to 0, and call event#BELL.
- enable rule 1

In this case we have lock for 60 seconds for multiple people calls or to be resistant for speaker voltage drops.

[Back To Top](#top)

------------------------------------------------------------------------------
#### Prevent Wemos D1 mini load overcurrent
As a WS2812 24 led ring draws approximately 24x3x20 mA = 1.44A and the Wemos D1 mini powered from a PC's USB port can only provide up to 0.5A it would be nice to have some kind of mechanism in place to limit the amount of current to the WS2812 LEDring to 0.1A. This is still enough to light all 24 leds up to color 202020.

Hardware
- Wemos D1 mini
- INA219 I<sup>2</sup>C sensor
- WS2812 LEDring with 24 LEDs powered by the Wemos D1 mini 5V thru the INA219 sensor


```console
Rule1 on INA219#Current>0.100 do Backlog Dimmer 10;Color 10,0,0 endon
Rule1 on
```

Result
- When a user raises brightness to a level using more than 0.1A the rule kicks in and lowers the current by executing command `Dimmer 10` and changes the color to Red with command `Color 10,0,0`.

[Back To Top](#top)

------------------------------------------------------------------------------

#### Using dummy GPIO to send Serial codes to the MCU

By having a device (an [Oil Diffusser](https://blakadder.github.io/templates/oil_diffuser_550ml.html)) that controls all its features through an MCU and reports the states in serial codes to the ESP8266 I had to create some rules to control it using the Web UI or standard Power commands.

```console
Rule2 
  on power1#state=1 do serialsend5 55AA00060005020400010213 endon 
  on power1#state=0 do serialsend5 55AA00060005020400010011 endon 
  on power2#state=1 do serialsend5 55AA00060005060400010217 endon 
  on power2#state=0 do serialsend5 55AA00060005060400010015 endon
```
Power1 controls the device, Power2 turn on and off the light on the device.

Another rule was created to issued commands on boot so the serial interface works every time and to control the built in fan using Event triggers and have its state retained in an MQTT message for Home Assistant.

```console
Rule3 
  on system#boot do backlog baudrate 9600; seriallog 2; serialsend5 55aa000300010306 endon 
  on event#high do backlog serialsend5 55AA00060005650400010175; publish2 stat/diffuser/FAN high endon 
  on event#low do backlog serialsend5 55AA00060005650400010074; publish2 stat/diffuser/FAN low endon
```

[Back To Top](#top)

------------------------------------------------------------------------------
#### Arithmetic commands to be used with VARs

* ADD  
  `ADD1` to `ADD5`: Add a value to `VARx`  
  Syntax: `ADDx value`  
  Usage: `ADD1 15`  
  Result: `VAR1 = VAR1 + 15`  

* SUBTRACT  
  `SUB1 `to `SUB5`: Subtract a value from `VARx`  
  Syntax: `SUBx value`  
  Usage: `SUB1 15`  
  Result: `VAR1 = VAR1 - 15`  

* MULTIPLY  
  `MULT1 `to `MULT5`: Multiply a value to `VARx`  
  Syntax: `MULTx value`  
  Usage: `MULT1 15`  
  Result: `VAR1 = VAR1 * 15`  

* SCALE A VALUE  
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

#### Transmit sensor value only when a delta is reached  
Send only when the sensor value changes by a certain amount.  

```console
Rule1
  on SI7021#temperature>%var1% do backlog var1 %value%; publish stat/mqttTopic/temp %value%; var2 %value%; add1 2; sub2 2 endon
  on SI7021#temperature<%var2% do backlog var2 %value%; publish stat/mqttTopic/temp %value%; var1 %value%; add1 2; sub2 2 endon
```

#### Adjust the value of a sensor and send it by MQTT
This example adds 2 degrees to the measured temperature and then sends that value to an MQTT topic.

```console
Rule1
  on tele-SI7021#temperature do backlog var1 %value%; add1 2; event sendtemp endon
  on event#sendtemp do publish stat/mqttTopic/temp %var1% endon
```

[Back To Top](#top)

------------------------------------------------------------------------------

#### Switch relays via serial interface

This example switches a connected relays over the software serial on and off.<br> 
Write the following rules:

```console
rule1
  on SSerialReceived#Data=on do power1 1 endon
  on SSerialReceived#Data=off do power1 0 endon
```

receiving `on` and `off` results in

```
MQT: tele/mqttTopic/RESULT = {"SSerialReceived":"on"}
RUL: SSERIALRECEIVED#DATA=ON performs "power1 1"
MQT: stat/mqttTopic/RESULT = {"POWER":"ON"}
MQT: stat/mqttTopic/POWER = ON
MQT: tele/mqttTopic/RESULT = {"SSerialReceived":"off"}
RUL: SSERIALRECEIVED#DATA=OFF performs "power1 0"
MQT: stat/mqttTopic/RESULT = {"POWER":"OFF"}
MQT: stat/mqttTopic/POWER = OFF
```

[Back To Top](#top)

------------------------------------------------------------------------------

#### Using BREAK to simulate IF..ELSEIF..ELSE..ENDIF

``BREAK`` is an alternative to ``ENDON``. ``BREAK`` will stop the execution for the triggers that follow. If a trigger that ends with ``BREAK`` fires, then the following triggers of that rule will not be executed. This allows to simulate ``IF..ELSEIF..ELSE..ENDIF``

**Example:**
```
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
```console
Rule1
  on event#temp>85 do VAR1 more85 endon
  on event#temp>83 do VAR1 more83 endon
  on event#temp>81 do VAR1 more81 endon
  on event#temp=81 do VAR1 equal81 endon
  on event#temp<81 do VAR1 less81 endon
```

This is the output in the console:
```
CMD: rule
MQT: stat/living/RESULT = {"Rule1":"ON","Once":"ON","StopOnError":"OFF","Free":322,"Rules":"on event#temp>85 do VAR1 more85 endon on event#temp>83 do VAR1 more83 endon on event#temp>81 do VAR1 more81 endon on event#temp=81 do VAR1 equal81 endon on event#temp<81 do VAR1 less81 endon"}
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
```console
Rule
  on event#temp>85 do VAR1 more85 break
  on event#temp>83 do VAR1 more83 break
  on event#temp>81 do VAR1 more81 endon
  on event#temp=81 do VAR1 equal81 endon
  on event#temp<81 do VAR1 less81 endon
```

Which will result in the following output:
```
CMD: rule
RSL: RESULT = {"Rule1":"ON","Once":"OFF","StopOnError":"OFF","Free":321,"Rules":"on event#temp>85 do VAR1 more85 break on event#temp>83 do VAR1 more83 break on event#temp>81 do VAR1 more81 endon on event#temp=81 do VAR1 equal81 endon on event#temp<81 do VAR1 less81 endon"}
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

[Back To Top](#top)

------------------------------------------------------------------------------

#### Adjust PowerDelta according to current Power values
Power sensor reporting thresholds are set by a percentage change in the Power value by setting [PowerDelta](Commands#powerdelta). Power changes from 10W to 11W (10%) may not be very interesting. But power changes from 1000W to 1100W (also 10%) could be very important. To avoid getting reports for small changes but ensuring that larger power swings are reported, a rule set can be used to create a gradient threshold based on the absolute power values.

This rule also uses the [one-shot feature of rules](#usage-of-one-shot-once) to avoid reporting of every small change within a threshold window. The rule (a ON/DO/ENDON rule in this the set) will trigger only once when a threshold is crossed.

```console
Backlog PowerDelta 0; Rule1 0; Rule1 5
 
Rule1
  ON ENERGY#Power>=35 DO Backlog PowerDelta 10; Status 8 BREAK 
  ON ENERGY#Power>=15 DO Backlog PowerDelta 25; Status 8 BREAK 
  ON ENERGY#Power>5 DO Backlog PowerDelta 35; Status 8 BREAK 
  ON ENERGY#Power<=5 DO Backlog PowerDelta 100 ENDON

Rule1 1
```

Which translates to:
```
Rule Pseudo Code
IF ENERGY#Power>=35  // ENERGY#Power GE 35
  DO Backlog PowerDelta 10; Status 8
ELSE IF ENERGY#Power>=15  // ENERGY#Power GE 15 and LT 35
  DO Backlog PowerDelta 25; Status 8
ELSE IF ENERGY#Power>5  // ENERGY#Power GT 5 and LT 15
  DO Backlog PowerDelta 35; Status 8
ELSE  // ENERGY#Power changed (i.e. LE 5)
  DO PowerDelta 100
```

[Back To Top](#top)

------------------------------------------------------------------------------

#### IR Forward

Using one IR receiver and one sender (or both extender) you can simply forward signals from one to another using the following rule
```console
rule1 on IRreceived#Data do publish cmnd/irsideboard/irsend {Protocol:NEC,Bits:32,Data:%value%} endon
```

[Back To Top](#top)

------------------------------------------------------------------------------

#### Garage Door Opener
([#3942](https://github.com/arendst/Tasmota/issues/3942#issue-365226844))

// Set the relay on time to signal the opener  
`PulseTime 7`

// Send ON and OFF as the switch is ON or OFF  
```console
Backlog SwitchMode1 1; SwitchMode2 1; SwitchMode3 1
```

//No need to save changes on power cycle  
`SetOption0 0`

//Don’t blindly run the door on power up  
`PowerOnState 0`

//One shot Detection off  
```console
Backlog Rule1 0; Rule1 4; Rule2 0; Rule2 4; Rule2 0; Rule2 4
```

//Set Counter to measure the period between on and off, check if its blinking because of an obstruction  
```console
Backlog CounterType 1; CounterDebounce 100
```

//So the door doesn't close if you send it an Open when it's already Opened, etc.  
```
// var1=1 Only When OPEN  
// var2=1 Only When CLOSED  
// var3=1 Only When OPENING  
// var4=1 Only When CLOSING  
```
```console
Rule1
  on Switch1#Boot=1 do backlog delay 99; event Opened endon
  on Switch2#Boot=1 do backlog delay 99; event Closed endon
  on EVENT#OPEN do power1 %var2% endon
  on EVENT#CLOSE do power1 %var1% endon
  on EVENT#STOP do backlog power1 %var3%; power1 %var4%; event PState=STOP endon
  on Switch1#State=1 do event Opened endon
  on Switch2#State=1 do event Closed endon
  on Switch1#State=0 do event Closing endon
  on Switch2#State=0 do event Opening endon

Rule2
  on event#Opened do backlog var 1; var2 0; var3 0; var4 0; ruletimer1 0; event PState=OPEN endon
  on event#Closed do backlog var1 0; var2 1; var3 0; var4 0; ruletimer1 0; event PState=CLOSE endon
  on event#Opening do backlog var1 0; var2 0; var3 1; var4 0; ruletimer1 15; event PState=OPENING endon
  on event#Closing do backlog var1 0; var2 0; var3 0; var4 1; ruletimer1 15; event PState=CLOSING endon

Rule3
  on counter#c1>1000 do event PObstr=0 endon
  on counter#c1<1000 do event PObstr=1 endon
  on event#PObstr do publish stat/GarageDoor/OBSTR %value% endon
  on event#PState do publish stat/GarageDoor/STATE %value% endon
  on rules#timer=1 do event PState=STOP endon
```

//Turn on Rules  
```console
Backlog Rule1 1; Rule2 1; Rule3 1
```

[Back To Top](#top)

------------------------------------------------------------------------------

#### Remote Control Button Multi-press
For example, a remote control with one button to change speed. This rules simulates pressing the button three times to set the receiving device to the third speed setting. 

//Specify the rule set  
//The `<trigger>` can be a a condition or an event sent from another device or home automation hub.  
//`<topic>` corresponds to the device transmitting the code (e.g., [YTF IR Bridge](devices/YTF-IR-Bridge)). This could also be modified to send an RF code from a [Sonoff RF Bridge](devices/Sonoff-RF-Bridge-433).  
// The `Delay` may not be necessary in your environment or may need to be adjusted according to your device characteristics. 
```console
Rule 1
  ON Event#tora DO Backlog Publish cmnd/<topic>/IRSend {"Protocol":"NEC","Bits":32,"Data":"0x00FF30CF"}; Delay 10 ENDON
  ON <trigger> DO Backlog Event tora; Event tora; Event tora ENDON
```

//Enable the Rule set  
`Rule1 1`

[Back To Top](#top)

------------------------------------------------------------------------------

#### Two-way light switches without MQTT

Two Sonoff T1 3-gang light switches can be used at either end of a room by setting up one the master and the other as the slave.  The master performs the switching of the power to the lights, while the slave just asks the master to toggle the power state.  The master also turns the slave's relays on and off so that the LED indicators follow the master's state.

Using the `WebSend` command, the two switches can talk to each other - no need for an MQTT broker.  It remains to be seen how reliable this is.

Starting with the slave, the rule to toggle the master is pretty simple:

```console
Rule1
  ON Event sendPower DO WebSend [192.168.0.74] POWER%value% TOGGLE ENDON
  ON Button1#State DO Event sendPower=1 ENDON
  ON Button2#State DO Event sendPower=2 ENDON
  ON Button3#State DO Event sendPower=3 ENDON

Rule1 1
```

Note that having a rule for the Button#State disables the power toggling of the slave's relay(s).  This is desirable because we want the master to control the slave's relay state(s) according to its own as follows:

```console
Rule1
  ON Event sendPower DO WebSend [192.168.0.144] POWER%Var1% %value% ENDON
  ON Power1#state DO Backlog Var1 1;Event sendPower=%value% ENDON
  ON Power2#state DO Backlog Var1 2;Event sendPower=%value% ENDON
  ON Power3#state DO Backlog Var1 3;Event sendPower=%value% ENDON

Rule1 1
```

[Back To Top](#top)

------------------------------------------------------------------------------

#### Roller shutter push-button toggle

With a two relay device (e.g., Shelly 2.5) configured for a roller shutter, you can also connect push-buttons (configured as switch components in this example) and set them for inverted toggle behavior. Pressing a push-button once makes the roller shutter move in one direction. Pressing it again stops it. These rules each use a variable to remember the shutter state where `0 == Stopped` and `1 == Moving`.

```console
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

#### Control a dimmer with one switch

> [!NOTE]
> This example is for GPIOs defined as switches not buttons

Activate dimmer mode with `Switchmode 11` and shorten long press time to 1 second (`Setoption32 10`).

A short press of the switch sends a `TOGGLE` message to toggle the dimmer. A long press sends repeated `INC_DEC` messages to increment the dimmer. If a second press of the switch follows the first press a `INV` message is sent to invert the function from increment to decrement and repeatet `INC_DEC` messages are sent to decrement the dimmer. After releasing the switch a timeout message `CLEAR` resets the automation

```console
Backlog SwitchMode 5; SetOption32 20

Rule1
on system#boot mem1 + endon
on switch1#state=2 do publish light/cmnd/POWER TOGGLE endon
on switch1#state=4 do publish light/cmnd/DIMMER %mem1% endon
on switch1#state=5 do mem1 - endon
on switch1#state=6 do mem1 + endon

Rule1 1
```
Notice we use `Rule` which edits `Rule1` rule set. They can be used interchangeably.


[Back To Top](#top)

------------------------------------------------------------------------------
