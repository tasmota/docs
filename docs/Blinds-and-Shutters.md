
# Shutters and Blinds

!!! info "Control blinds and roller shades connected to regular ON/OFF motors,stepper motors or position servos"

Before starting you have to enable shutter support with `SetOption80 1`

## Commands

Complete list of commands is available at [Blinds, Shutters and Roller Shades Commands](Commands.md#shutters).

## Shutter Modes
There are five shutter modes which define how the relays operate. Additionally you can define [PulseTime](Commands.md#pulsetime) on any relay to change the relay into a pulse relay where the pulse changes start/stop. At least for Shutter mode 1 an interlock is mandatory [Interlock](Commands.md#interlock). 

The examples below are for a `ShutterRelay1 1` configuration (using Relay1 and Relay2).

**Shutter mode 1** - Normal Operation   

Relay1: UP/OFF, Relay2: DOWN/OFF  
   
- `Interlock 1,2` (Interlocked relay pair)
- `Interlock ON`

**Shutter mode 2** - Circuit Safe (must be set manually)

Relay1: ON/OFF, Relay2: UP/DOWN

- `Interlock OFF`

**Shutter mode 3** - Garage Motors (must be set manually) 

Relay1: OFF/DOWN PULSE, Relay2: OFF/UP PULSE
   
**Shutter mode 4** - Stepper Motors (autodetect with PWM and COUNTER)  

Relay1: ON/OFF, Relay2: UP/DOWN

- PWM: Stepper signal, COUNTER: Stepper position signal
- PWM and COUNTER defined
   
**Shutter mode 5** - Servo Motors (PWM position based servo)  

Relay1: ON/OFF, Relay2: UP/DOWN (optional not used)

- PWM: Stepper signal
- `PWMfrequency 200`   ( This is mandatory for most relay to get correct PWM duty cylces)
- `SetOption15 0` (required to store value and make it reboot save)
 
 **Shutter mode 6** - Servo Motors 360° (PWM speed based servo)
 
 Relay1: ON/OFF, Relay2: UP/DOWN (optional not used)
 
 - PWM: Stepper signal
- `PWMfrequency 200`   ( This is mandatory for most relay to get correct PWM duty cylces)
- `SetOption15 0` (required to store value and make it reboot save)
 
[Wiring diagrams](#motor-wiring-diagrams) for Normal, Stepper motor, and Short Circuit-Safe configurations are available at the end of this page. Even if the shutter does not have two motors, three wires have to be connected.

!!! note 
    **After setting the options for shutter mode, the device should be rebooted.** Otherwise, the sliders won't be available in the web UI, and the `ShutterOpenDuration<x>`and  `ShutterCloseDuration<x>` commands will report "Shutter unknown". 

Issue `Shuttermode` command and check in console which **ShutterMode** is displayed:
Issue `Status 13` command and check in console how the shutter is defined

If you define `Shuttermode 1` and there is NO interlock defined on the relay the driver go into ERROR state. To solve define INTERLOCK on the relay pair and set it to ON. Then define `ShutterRelay1` again.

```
Shutter accuracy digits: 1
Shutter 0 (Relay:1): Init. Pos: 20000 [100 %], Open Vel.: 100 Close Vel.: 100 , Max Way: 20000, Opentime 10.0 [s], Closetime 10.0 [s], CoedffCalc: c0: 0, c1 200, c2: 200, c3: 0, c4: 0, binmask 3, is inverted 1, <span style="font-weight:bold;color:lime">ShutterMode 0</span>, motordelay 0
```

## Operation
Turning a device relay on or off directly (i.e., using `Power`) will function to affect a shutter's movement. In momentary mode (i.e., stepper motor), the relays start or stop the motor. The driver takes care of the direction and proper update of the shutter position.

The shutter reports its position and can also be sent to a dedicated position. `ShutterPosition 0` means the shutter is closed and `ShutterPosition 100` means the shutter is open. If you need the position values reversed (`0` = open, `100` = closed), define and [calibrate your shutter as documented below](#calibration). Then tell Tasmota to reverse the shutter position meaning via the `ShutterInvert<x> 1` command. All internal calculations are the same (the log output is the same). Only the interaction with the user and other systems changes. Now `ShutterPosition<x> 0` will open the shutter and `ShutterPosition<x> 100` will close the shutter. To set a value to all shutter you can use the index 0. For example `ShutterPosition0 30` will move all shutters to 30%. The index 0 also works with all configuration items.

When `SetOption80 1` is invoked you have to define `Shutterrelay1 <value>` to get started
If possible to avoid any injury on unexpected movement all RELAYS should start in OFF mode when the device reboots: `PowerOnState 0`
![](https://user-images.githubusercontent.com/34340210/65997878-3517e180-e468-11e9-950e-bfe299771233.png)

A maximum of four shutters per device are supported.  
![](https://user-images.githubusercontent.com/34340210/65997879-3517e180-e468-11e9-9c44-9ad4a4a970cc.png) 

To enable additional shutters, `ShutterRelay<x> <value>` must be executed for each additional shutter. Additional shutter declarations must be sequentially numbered, and without gaps (i.e., second shutter is 2, next shutter 3 and finally shutter 4).

Disabling a shutter in the middle of the defined set of shutters will disable all other higher numbered shutters. If the disabled shutter is restored, the higher numbered shutters previously declared will also be restored. When a shutter is added or removed, a list of the active shutters, with their parameters, is output to the log. If you intend to remove shutters, explicitly remove each one beginning with the highest numbered shutter.

With four shutters, eight `Relay<x>` components are needed. If manual operation switches (`Switch<x>` or `Button<x>` pairs) are also used, additional input GPIO are required. The ESP82xx device may not have enough free GPIO to support all the shutter connections required. A GPIO expander such as a [PCF8574](PCF8574) or [MCP230xx](MCP230xx) can be used with additional effort.

When using a switch for manual operation `Switch<x>` pairs should usually be set to `SwitchMode<x> 2` (inverse follow) for proper switch behavior.

Any shutter positioning can be locked `ShutterLock<x> 1`. Once executed an ongoing movement is finished while further positioning commands like `ShutterOpen<x>`, `ShutterClose<x>`, `ShutterStop<x>`,  `ShutterPosition<x>`, ... as well as web UI buttons, web UI sliders, and shutter buttons are disabled. This can be used to lock an outdoor blind in case of high wind or rain. You may also disable shutter positioning games by your children. Shutter positioning can be unlocked using `ShutterLock<x> 0`. Please be aware that the shutter can still be moved by direct relay control (i.e., `Power<x>`), or physical switches and buttons. Use the `ShutterButton<x>` command prior to `ShutterLock` to be able to lock buttons.
    
### Calibration
[Shutter calibration video tutorial](https://www.youtube.com/watch?v=Z-grrvnu2bU)  

[Shutter calibration Google Spreadsheet](https://docs.google.com/spreadsheets/d/1-okVzGfdltbx8kMcObw4I0B22m9ZCQL3JgifgwjbzTc/edit?usp=sharing)

- Start your shutter in a closed position preferably. Set internal position to closed with `ShutterSetClose<x>`. 
- Set the time needed to open the shutter completely with `ShutterOpenDuration<x>`. 
  * If the shutter opens more than needed, move it to the desired position with `ShutterSetPosition<x>` then set the position to fully open (100) with `ShutterSetOpen<x>` and decrease the open time. 
- Set the time needed to close the shutters with `ShutterCloseDuration<x>`. 
  * If the shutter does not close completely, open again and adjust close time.
  * If it runs too long, move it back to desired closed position with `ShutterSetPosition<x>`, reset to 0 with `ShutterSetClose<x>` and decrease open time.
- Alternate between opening and closing the shutter until you find out the exact times needed to get the same positions multiple times
- Now set the 50% open position of the shutter. Some shutters need some time from totally closed until they begin moving the bottom-most part and opening. This often results in a shutter that is less than 50% open when the shutter has been operating for 50% of the set time. This can be corrected by using `ShutterSetHalfway<x>`. Use this procedure to calibrate the half-open position:
   1. `ShutterClose<x>` (confirm that the shutter is completely closed)
   2. `ShutterSetHalfway<x> 50` (reset to default)
   3. Move the shutter to actual 50% open position.
   4. Use `ShutterPosition<x>` to inquire the shutter's current position and record the value. This value is a **percentage of the total opening** (e.g., `63` = 63% of opening).
   5. `ShutterClose<x>`
   6. `ShutterSetHalfway<x> 63` (using the value from step #4 above)
   7. `Restart 1`

After calibration is complete, you might want to enable an additional 1 second motor movement with `ShutterEnableEndStopTime<x> 1` when the shutter is asked to move to its end positions (0% and 100%). With this you can guarantee that end positions are still reached in case of inaccuracies. Take care to disable this with `ShutterEnableEndStopTime<x> 0` before further open or close duration measurements.

#### Increasing Calibration Granularity
If you desire that the %-opening closely match what `ShutterPosition<x>` and web UI indicate, there is a granular calibration matrix available. Ensure that `ShutterClose<x>` and `ShutterOpen<x>` moves the shutter more or less to the limit positions and follow this procedure:

- `ShutterSetHalfway<x> 50` (reset to default)
- `ShutterCalibration<x> 30 50 70 90 100`
- `Restart 1`
- `ShutterClose<x>`
- Move the shutter to each of the following opening percentages and measure the shutter's position for each. 
   - `ShutterPosition<x> 30` (e.g., measurement = `15`)
   - `ShutterPosition<x> 50` (e.g., measurement = `50`)
   - `ShutterPosition<x> 70` (e.g., measurement = `100`)
   - `ShutterPosition<x> 90` (e.g., measurement = `150`)
   - `ShutterPosition<x> 100` (e.g., measurement = `180`)
- Finally, enter the position measurements as the calibration values: `ShutterCalibration<x> 15 50 100 150 180`  

`ShutterCalibration<x>` takes position measurements (**not** the time it takes to move). During calibration you position the shutter to an indicated percentage (e.g., `30%`) of opening and measure the shutter position (e.g., `15`). Use the same unit of measure for all your measurements (e.g., centimeters, inches, steps, etc.). After calibration `ShutterPosition<x> 30` will move to `30%` opening. This will be 30% from  `180` (full open) == `54`. Now the percentage match the percent in cm/inch/steps.

Notice that there is no calibration for the 10% position. On many shutters, there is no movement during the initial phase (i.e., nearly 10% of total time). Therefore the opening could be `0`. This measurement would cause an execution DIV 0 exception. Therefore the first calibration point is 30%. In most cases this is not a large opening so the calibration will be near enough. Yes, until ~10%, the position will be a bit "off" but not enough for concern.  

### Motor Movement Delays
Some motors need up to one second after power is turned on before they start moving. You can confirm if you are having this issue if opening and closing as a single action works properly but doing this in smaller steps result in a shift of the position.  

1. `Shutterposition<x> 30`  
   Measure the shutter position. This is the `reference_position`
2. `Shutterposition<x> 80`  
   Measure the shutter position. This is the `max_position`
3. `Shutterposition<x> 30`  
   Return the shutter to starting position. This must be the same position as measured in step #1 (`reference_position`). If not, `ShutterCloseDuration` must be adjusted.  
4. `Shutterposition<x> 50`  
5. `Shutterposition<x> 70`  
6. `Shutterposition<x> 80`    
   If you do not reach `max_position` you have a motor delay problem. Measure the shutter position. This is the `real_max`. Use this value in the calculation below.  
7. `ShutterMotorDelay<x> <delay>`  
   Motor `<delay>` calculation - fine tune in 0.05 second increments (e.g. `0.65`) as required.  
   `<delay> =  ((max_position-real_max) / 2) / (((100/80) * max_position) / ShutterOpenDuration)`

Close the shutter and repeat this procedure until the motor delay is set properly.  

Following defaults are pre-compiled into the code and can only be changed by compiling you own binary and use the `user_config.override`
- In Failsafe-Mode the driver waits for 0.1sec to let the direction relay execute and be stable before switching on the power relay starting the movement. The time in [ms] can be changed by adding following line with a different value: `#define SHUTTER_RELAY_OPERATION_TIME 100 // wait for direction relay 0.1sec before power up main relay`
- 
### Motor Stop time
When shutters change direction immediatly it can happen that there is a short circuit or at least high moments on the motors. Therfore the default time between a STOP and the next START of the shutter is 0.5s = 500ms. This allows in most cases the shutter to fully stop and then start from a static position. With Version 12.3 you can change the duration through `shuttermotorstop 500` or any other value in ms. The value is for all defined shutters the same.

### Button Control
When shutter is running in `ShutterMode 1` (normal two relay up/off down/off), you already have basic control over the shutter movement using switches or buttons in the module configuration to directly drive the shutter relays. For short circuit safe operation `ShutterMode 2` direct control of the relays will not give you a nice user interface since you have to 1st set the direction with one switch/button and 2nd switch on the power by the other switch/button. Because the button controll use multi-press events ensure that the "immediate action" is disabled: `SetOption13 0` (default)

To have shutter mode independent button control over the shutter and not over its relays one can use the `ShutterButton<x>` command. It also introduces some more features, see below:

`ShutterButton<x> <button> <func> <mqtt>` 

This assigns a Tasmota button `<button>` to control your shutter `<x>` having functionality `<func>`. The Tasmota button `<button>` must already be configured in the module configuration. You can assign multiple buttons to a single shutter. Any button can only control one shutter (beside the `<mqtt>` broadcast feature, see description below). Any press of the button while the shutter is moving will immediately stop the shutter.

One can remove all button control for shutter `<x>` by `ShutterButton<x> 0`. 

The assigned button can have one of the following functionalities:<BR>

- Setup for an "up" button: `ShutterButton<x> <button> up <mqtt>`    
   Single press will move shutter to 100%, double press to 50% and triple press to 74%. Holding the button for more than the hold time ([`SetOption32`](Commands.md#setoption32)) moves all shutters with same `<grouptopic>` to 100% when `<mqtt>` is equal to `1`. When `<mqtt>` is equal to `0` hold action of this button is same as single press.

- Setup for a "down" button: `ShutterButton<x> <button> down <mqtt>`    
   Single press will move shutter to 0%, double press to 50% and triple press to 24%. Holding the button for more than the hold time (SetOption32) moves all shutters with same `<grouptopic>` to 0% when `<mqtt>` is equal to `1`. When `<mqtt>` is equal to `0` hold action of this button is same as single press. 

- Setup for an "updown" button: `ShutterButton<x> <button> updown <mqtt>`    
   Single press will move shutter to 100%, double press down to 0% and triple press to 50%. No hold action and no other shutter control by MQTT, `<mqtt>` is don't care here.

- Setup for a "toggle" button: `ShutterButton<x> <button> toggle <mqtt>`
   Single press will toggle shutter, double press will move it to 50%. Be aware that the toggle select direction based on the current position. If the position is between 0..50% the shutter move to 100%. If the position is 51%..100% it moves to 0%. No hold action and no other shutter control by MQTT, `<mqtt>` is don't care here.

More advanced control of the button press actions is given by the following `ShutterButton<x>` command syntax:

`ShutterButton<x> <button> <p1> <p2> <p3> <ph> <m1> <m2> <m3> <mh> <mi>` 

`<button>` `1..4`: Button number, `0/-`: disable buttons for this shutter<BR>`<p1>` `0..100`: single press position, `t`: toggle, `-`: disable<BR>`<p2>` `0..100`: double press position, `t`: toggle, `-`: disable<BR>`<p3>` `0..100`: triple press position, `t`: toggle, `-`: disable<BR>`<ph>` `0..100`: hold press position, shutter stop after releasing the hold button, `t`: toggle, `-`: disable<BR>`<m1>` `1`: enable single press position MQTT broadcast, `0/-`: disable<BR>`<m2>` `1`: enable double press position MQTT broadcast, `0/-`: disable<BR>`<m3>` `1`: enable triple press position MQTT broadcast, `0/-`: disable<BR>`<mh>` `1`: enable hold press position MQTT broadcast, `0/-`: disable<BR>`<mi>` `1`: enable MQTT broadcast to all shutter indices, `0/-`: disable

Parameters are optional. When missing, all subsequent parameters are set to `disable`.

By a button single press the shutter is set to position `<p1>`.  Double press will drive the shutter to position `<p2>` and  triple press to position `<p3>`. Holding the button for more than the `SetOption32` time sets the shutter position to `<ph>` max if button is hold until position. If the hold button is released during the shutter moves the shutter will stop. Any button action `<p1>` to `<ph>` can be disabled by setting the parameter to `-`. Independent from configuration `<p1>` to `<ph>` any press of the button while the shutter is moving will immediately stop the shutter.

Global steering of all your shutters at home is supported by additional MQTT broadcast. By any button action a corresponding MQTT command can be initiated to the `<grouptopic>` of the device. For single press this can be enabled by `<m1>` equal to `1`, disabling is indicated by `-`. Double to hold MQTT configurations are given by `<m2>` to `<mh>`, correspondingly. When `<mi>` is equal to `-` only `cmnd/<grouptopic>/Shutterposition<x> <p1..h>` is fired. When `<mi>` is equal to `1`, `<x>`=`1..4` is used to control any shutter number of a Tasmota device having same `<grouptopic>`.

!!! example 

    - `ShutterButton<x> <button> 100 50 74 100 0 0 0 1 1` is same as `ShutterButton<x> <button> up 1`.
    - `ShutterButton<x> <button> 0 50 24 0 0 0 0 1 1` is same as `ShutterButton<x> <button> down 1`.
    - `ShutterButton<x> <button> 100 0 50 - 0 0 0 0 0` is same as `ShutterButton<x> <button> updown 0`.
    - `ShutterButton<x> <button> t 50 - - 0 0 0 0 0` is same as `ShutterButton<x> <button> toggle 0`.

Module WiFi setup, restart, upgrade and reset according to [Buttons and Switches](Buttons-and-Switches.md) are supported "child and fool proof" only when no button restriction ([`SetOption1`](Commands.md#setoption1)) is given and when all configured shutter buttons of that shutter are pressed 5x, 6x, 7x times or hold long simultaneously.

### Remote Control
Use any other Tasmota device with buttons or switches to control remotely a shutter using rules. Similar behavior as direct button control can be achieved by applying `ShutterStopClose, ShutterStopOpen, ShutterStopToggle, ShutterStopPosition` commands. They stop shutter movement if it is in motion and otherwise execute close, open, toggle or position commands.

!!! example
    Run this rule on another Tasmota device with a switch configured.
    `rule1 on switch1#state=2 do publish cmnd/%shutter-topic%/ShutterStopToggle endon`

## Specific Configuration

!!! note 
    The PWM remains on even after the end position has been reached. The motor then permanently tries to hold the position and could thereby trigger noises or a slight "twitching". If this is not desired, you can switch off the PWM after reaching the end position with ```#define SHUTTER_CLEAR_PWM_ONSTOP```. 
   
### Pulse Motors
There are shutters that have two relays but only need a pulse to start or stop. Depending on the current situation a pulse will stop the shutter or send it into a specific direction. To use these kinds of shutters a [`PulseTime`](Commands.md#pulsetime) must be defined on each relay. The minimum setting that seems to make it work consistently is `2`. A setting of `1` does not work. If the shutter moves too fast and does not react to a stop command, increase the setting to `3` or `4`. 

### Stepper Motors
Stepper motors can also be used to operate shutters and blinds. Additionally you can operate sliding doors with this configuration. Currently ESP32 12.0.2  does not support shutter with stepper motors. ESP8266 and ESP32 12.0.3+ supports up to 4 shutters. 

### Servo Motors
Servos are small devices with typical 180° or 360" rotation movement. The position will be drived by the PWM duty cycle time. This will all automatically calculated

!!! note
If you miss low angles (i.e 2°) you should be able to get this by changing the minimum `ShutterPWMRange`. If this does not help you can customize `PwmFrequency`. Normally for PWM servos, there is no calibration required, but you have the option to do a calibration. Check the documentation for shuttercallibration. Maybe `ShutterSetHalfway` is already enough. Otherwise you can do a fine granular calibration.

!!! note
If you change the shutteropenduration/closeduration the servo will operate slower, but now the servo also achieves small angle changes.
   
[More info](https://github.com/arendst/Tasmota/discussions/10443#discussion-1627790)

### DC Motors

[More info](https://github.com/arendst/Tasmota/discussions/10387)

### Smooth RAMP-UP and RAMP-DOWN Support
Servos and Steppers also have a velocity control. With `ShutterMotorDelay<x> 1.5` you can define a 1.5second soft start/stop before the device reaches it final moving speed. Usefull for moving heavy items like doors.

### using normal Motors

#### Short Circuit safe wire configuration with a PCF as digital I/O. Avoid electrical shortage also on wrong configuration.
![ShortCicuitSafe](https://user-images.githubusercontent.com/34340210/65997877-3517e180-e468-11e9-9b8c-2f0787f977f6.png)

<!-- outdated log output
#### Sample Log Output
Typical log output (log level `3`) when starting from `ShutterOpen1`. The first command is `ShutterClose1`. After closing, open it to 50% with `ShutterPosition1 50`  
```
13:56:56.073 RSL: RESULT = {"ShutterClose1":0}
13:56:59.763 CMD: shutteropen
13:56:59.779 RSL: RESULT = {"POWER2":"OFF"}
13:56:59.781 RSL: POWER2 = OFF
13:56:59.787 RSL: RESULT = {"POWER1":"ON"}
13:56:59.788 RSL: POWER1 = ON
13:56:59.790 RSL: RESULT = {"ShutterOpen1":100}
13:56:59.817 RSL: RESULT = {"Shutter1":{"Position":0,"Direction":1,"Target":100}}
13:57:00.429 RSL: RESULT = {"Shutter1":{"Position":7,"Direction":1,"Target":100}}
13:57:01.451 RSL: RESULT = {"Shutter1":{"Position":17,"Direction":1,"Target":100}}
13:57:02.427 RSL: RESULT = {"Shutter1":{"Position":27,"Direction":1,"Target":100}}
13:57:03.409 RSL: RESULT = {"Shutter1":{"Position":36,"Direction":1,"Target":100}}
13:57:04.432 RSL: RESULT = {"Shutter1":{"Position":47,"Direction":1,"Target":100}}
13:57:05.455 RSL: RESULT = {"Shutter1":{"Position":57,"Direction":1,"Target":100}}
13:57:06.429 RSL: RESULT = {"Shutter1":{"Position":67,"Direction":1,"Target":100}}
13:57:07.449 RSL: RESULT = {"Shutter1":{"Position":77,"Direction":1,"Target":100}}
13:57:08.420 RSL: RESULT = {"Shutter1":{"Position":86,"Direction":1,"Target":100}}
13:57:09.445 RSL: RESULT = {"Shutter1":{"Position":97,"Direction":1,"Target":100}}
13:57:09.802 RSL: RESULT = {"POWER1":"OFF"}
13:57:09.804 RSL: POWER1 = OFF
13:57:10.308 RSL: SHUTTER1 = 100
13:57:10.309 RSL: RESULT = {"Shutter1":{"Position":100,"Direction":0,"Target":100}}
13:57:16.174 CMD: shutterposition 50
13:57:16.190 RSL: RESULT = {"POWER2":"ON"}
13:57:16.192 RSL: POWER2 = ON
13:57:16.198 RSL: RESULT = {"POWER1":"ON"}
13:57:16.199 RSL: POWER1 = ON
13:57:16.201 RSL: RESULT = {"ShutterPosition1":50}
13:57:16.229 RSL: RESULT = {"Shutter1":{"Position":100,"Direction":-1,"Target":50}}
13:57:16.433 RSL: RESULT = {"Shutter1":{"Position":98,"Direction":-1,"Target":50}}
13:57:17.422 RSL: RESULT = {"Shutter1":{"Position":89,"Direction":-1,"Target":50}}
13:57:18.445 RSL: RESULT = {"Shutter1":{"Position":78,"Direction":-1,"Target":50}}
13:57:19.413 RSL: RESULT = {"Shutter1":{"Position":69,"Direction":-1,"Target":50}}
13:57:20.436 RSL: RESULT = {"Shutter1":{"Position":58,"Direction":-1,"Target":50}}
13:57:21.265 RSL: RESULT = {"POWER1":"OFF"}
13:57:21.267 RSL: POWER1 = OFF
13:57:21.273 RSL: RESULT = {"POWER2":"OFF"}
13:57:21.274 RSL: POWER2 = OFF
13:57:21.778 RSL: SHUTTER1 = 50
13:57:21.780 RSL: RESULT = {"Shutter1":{"Position":50,"Direction":0,"Target":50}}

```
-->
### using Stepper Motors
Stepper motors can be used to operate shutters and blinds. The configuration is very similar to the  Circuit Safe (Shuttermode 1) configuration. To operate a stepper motor requires driver module such as the A4988 and uses EN (enable), DIR (direction), STP (Stepper) for controls. If everything is defined correctly Shuttermode 4 will be reported at boot time. ESP32 only supports one shutter with steppermotors. ESP8266 up to 4.

Tasmota supports a maximum of four shutters with one stepper motor per shutter simultaneously. In very rare conditions where two or more shutters simultaneously move the last mm it can happen than one shutter moves to far.   

- Stepper drivers configuration tutorials:  
    - [A4988](https://lastminuteengineers.com/a4988-stepper-motor-driver-arduino-tutorial/)
    - [DRV8825](https://lastminuteengineers.com/drv8825-stepper-motor-driver-arduino-tutorial/)
    - [TMC2208](https://wiki.fysetc.com/TMC2208/)  
- Modifying a 28BYJ-48 12V stepper motor from unipolar to bipolar [tutorial](https://coeleveld.com/wp-content/uploads/2016/10/Modifying-a-28BYJ-48-step-motor-from-unipolar-to-bipolar.pdf)  
- [Bill of Materials](#bill-of-materials)  

#### Example configuration  
`EN` and `DIR` are on `Relay1i` and `Relay2` respectively. Please be aware to use the **inverse** relay for the enable signal.  

The `STP` signal is assigned as a `PWM<x>` component where `<x>` matches the number of the shutter (e.g., `PWM1` for `Shutter1`). The shutter feature adjusts the PWM frequency to operate the motor for proper shutter operation. The stepper motor frequency setting is a global setting all PWM components on the device. This means that all shutters on the device will operate at the same speed. Therefore no PWM devices other than shutters can be connected to the same Tasmota device.  

The frequency of the PWM can be changed from 1000Hz to any value up to 10,000Hz. The command `ShutterFrequency` globally changes this. Be aware that most 12V operated motors cannot work faster than 2,000Hz. 5,000Hz.10,000Hz is possible by increasing the supplied voltage to 24V and use `ShutterMotorDelay` to allow a slow speed up/speed down. The maximum voltage of the A4988 is 36V. The TMC2208 is much more silent than the others but also significant slower and does not like high frequencies. For example, the speed at 24V is half o A4988

Finally a GPIO **must** be assigned as `Counter1`. This counter is used to keep track of the steps and send the stepper to the correct position. The `Counter1` GPIO must be connected to the `PWM1` GPIO. Otherwise the stepper and your shutter will run continually or freeze up randomly.

Only **bipolar** stepper motors may be used (see above).  

You must properly configure the stepper motor driver (see above).

`ShutterOpenDuration` and `ShutterCloseDuration` can be different. Shutter with Stepper motors always match positions exact. There is no need to vary `ShutterOpenDuration` and `ShutterCloseDuration`. Anyhow, if you decrease `ShutterCloseDuration` the Shutter will close with a higher speed on a virtual higher `ShutterFrequency` if possible. Same vice versa.

You can define a soft start/stop by defining a `ShutterMotorDelay`. This causes the driver to ramp the speed up and down during the defined duration. The change of the `ShutterMotorDelay` does NOT change the distance the shutter makes. This is very convenient to trim the accelerate and decelerate rate without changing the distance.

Wemos Pin|GPIO|Component|Stepper Signal
:-:|:-:|:-:|:-:
D1|5|Relay1i|EN
D2|4|Relay2|DIR
D3|0|PWM1|STP
D4|2|Counter1|STP

**a) Set ShutterMode 4**  
   `Backlog PulseTime1 0; PulseTime2 0`   // for relay Relay1i and Relay2  
   `Interlock OFF`                        // this is a global variable for all Relays or at least the RELAYS NOT in the Interlock group
   PWM1 and COUNTER1 defined

**b) Enable Shutters**  
   `SetOption80 1`   // this is a global variable for all Shutters  

**c) Configure Shutter 1 and test ShutterMode 1 is working**  
   `ShutterRelay1 1`   // for relay Relay1i and Relay2

**d) Set the stepper motor speed (optional setting)**  
   `ShutterFrequency 1500`  // this is a global variable for all steppers (1000rpm by default)

**e) Set at least a small ramp-up/ramp down period 1.0 second (optional)**  
   `ShutterMotorDelay1 1.0`  // Stepper do not like infinite momentum. Ramp up/down speed allow much higher frequencies.

**f) Restart Tasmota**  
   `Restart 1`

**g) Test the shutter**  
   `ShutterOpen1`   
   `ShutterStop1`      // to stop the STEPPER1  
   `ShutterClose1`  
   `ShutterInvert1`    // to change the direction of rotation of the STEPPER1  

**h) Perform the [shutter calibration](Blinds-and-Shutters.md#calibration)**    

#### Configuration for additional shutters  
You must first set up the first shutter and only then the next.  

Wemos Pin|GPIO|Component|Stepper Signal
:-:|:-:|:-:|:-:
D5|14|Relay3i|EN
D6|12|Relay4|DIR
D7|13|PWM2|STP
D8|15|Counter2|STP

**a) Set ShutterMode 4**  
  `Backlog PulseTime3 0; PulseTime4 0`   // for relay Relay3i and Relay4  
  PWM2 and COUNTER2 defined

**c) Configure Shutter 2 and test ShutterMode 1 is working**  
  `ShutterRelay2 3`   // for relay Relay3i and Relay4

**b) Restart Tasmota**  
  `Restart 1`

**d) Test the shutter**  
  `ShutterOpen2`  
  `ShutterStop2`     // to stop the STEPPER2  
  `ShutterClose2`  
  `ShutterInvert2`   // to change the direction of rotation of the STEPPER2  
  
**e) Perform the [shutter calibration](Blinds-and-Shutters.md#calibration)**    


#### Motor Wiring Diagrams  
#### One Shutter  
![411](https://raw.githubusercontent.com/TrDA-hab/blinds/master/images/A4988%20v411.jpg)
- Diagram v412: simple universal setup. For example, the control of horizontal curtain or vertical shutters, blinds adjuster or window opener, pet feeders, opening of a water tap for watering the lawn, rotating table for subject photography, opening the ventilation flap, PTZ camera, 3D Scanner Table, linear Actuator.  
![412](https://raw.githubusercontent.com/TrDA-hab/blinds/master/images/A4988%20v412.jpg)
- Diagram v414: parallel setup is to run two parallel steppers motors from the same controller. For example, to control a large and heavy hanging screen for an LCD projector, or two curtains at once on one large window.  
![414](https://raw.githubusercontent.com/TrDA-hab/blinds/master/images/A4988%20v414.jpg)
- Diagram v416: minimum setup size. For example, for small curtains located in a limited space.  
![416](https://raw.githubusercontent.com/TrDA-hab/blinds/master/images/A4988%20v416.jpg)

#### 2 Shutters  
![421](https://raw.githubusercontent.com/TrDA-hab/blinds/master/images/A4988%20v421.jpg)
- Diagram v422: parallel setup is to run two shutters and independent control of two stepper motors from one controller. For example, to control two independent curtains.  
![422](https://raw.githubusercontent.com/TrDA-hab/blinds/master/images/A4988%20v422.jpg)
- Diagram v424: big parallel setup is to run two shutters and independent control of two pairs of stepper motors from one controller. For example, to control four curtains on one very large window.  
![424](https://raw.githubusercontent.com/TrDA-hab/blinds/master/images/A4988%20v424.jpg)

#### Bill of Materials  
- ESP8266 Boards:  
  - [Wemos D1 mini](https://www.aliexpress.com/item/32529101036.html)  
  - [NodeMCU](https://www.aliexpress.com/item/32266751149.html)  
  - [ESP-01S](https://www.aliexpress.com/item/32973088687.html)  
- Stepper motors (NEMA 17):  
  - [Standard](https://www.aliexpress.com/item/32572890101.html)  
  - [5:1 Planetary Gearbox](https://www.aliexpress.com/item/32586860419.html)  
- Stepper motors (28BYJ-48):  
  - [Standard](https://www.aliexpress.com/item/32849028097.html)  
- Stepper Drivers:  
  - [A4988](https://www.aliexpress.com/item/1609523735.html)  
  - [DRV8825](https://www.aliexpress.com/item/1609523735.html)  
  - [TMC 2208](https://www.aliexpress.com/item/32851067375.html)  
- Stepper Motor Control Development Boards:  
  - [x1 board](https://aliexpress.com/item/32908836265.html)  
  - [x2 board](https://aliexpress.com/item/32870732179.html)  
- DC-DC Step Down Power Supply Module:  
  - [MP1584EN](https://www.aliexpress.com/item/33038302152.html)  
  - [LM2596](https://www.aliexpress.com/item/32719726240.html)  
  - [XL4015](https://www.aliexpress.com/item/1859072209.html)  
- Power Supplies (AC-DC):  
  - [DC 12V 2.5A](https://www.aliexpress.com/item/32588476889.html)  
  - [DC 12V 4A](https://www.aliexpress.com/item/32854720283.html) 
  - [DC 24v 4A](https://www.aliexpress.com/item/32854269135.html)  
- Aluminum Capacitors:  
  - [35V 100UF](https://www.aliexpress.com/item/32814611460.html)  
  - [35V 10UF](https://www.aliexpress.com/item/32887486570.html)  
- Motor Testing PWM Signal Generator:  
  - [1 type](https://www.aliexpress.com/item/32856654440.html)  
  - [2 type](https://www.aliexpress.com/item/32818889845.html)   

### using Sonoff Dual R2 
If using a Sonoff Dual R2, use the following Template:
```  
{"NAME":"Sonoff Dual R2","GPIO":[17,255,0,255,0,22,18,0,21,56,0,0,0],"FLAG":0,"BASE":39}
```

#### Checklist

- Ensure that the first relay opens the shutter
- Ensure that the second relay closes the shutter
- Set `ShutterRelay<x>`
- Set `ShutterOpenDuration<x>`
- Set `ShutterCloseDuration<x>`
- Set `ShutterSetHalfway<x>` (optional)
- Set `ShutterInvert<x>`(optional)
- Set `ShutterInvertWebButtons<x>`(optional) (eg. useful for horizontal awnings)
- If the shutter uses a pulse motor instead of a motors with one wire for each direction (i.e., duration based), define `PulseTime<x> 2` on both relays. The driver's behavior will change to a pulse motor that needs pulses to start and stop.  

#### Rules
Tasmota rule triggers:  

- `Shutter<x>#Position` is triggered at start, during and at the end of movement reporting actual position (`%value%`=0-100)
- `Shutter<x>#Direction` is triggered at start, during and at the end of movement reporting actual direction (`%value%`: `-1`=close direction, `0`=no movement, `1`=open direction)
- `Shutter<x>#Target` is triggered at start, during and at the end of movement reporting current target (`%value%`0-100)
- `Shutter#Moving` is triggered during movement and just before moving (shutter independently). If VAR&#60;x> is set to 99 then this trigger will be executed BEFORE the shutter starts. You can start the shutter after rule execution by setting VAR&#60;x> to 0 or wait 10seconds before the timeout kicks in. After the movement with shutter#moved the `VAR` must be set back to 99 and the initial rule must be enabled again. The initial rule has to be defined to run ONCE. 
   EXAMPLE: power3 on and wait 2sec before start. After movement: power off
   ```
   rule1 on shutter#moving=1 do backlog power3 on;delay 20;var1 0 endon
   rule1 5
   rule2 on shutter#moved do backlog power3 off;var1 99;rule1 5 endon
   rule2 1
   ```
- `Shutter#Moved` is triggered at end of movement (shutter independently)
- `Shutter<x>#Button<button>=0`  is triggered when `button` is hold
- `Shutter<x>#Button<button>=<n>`  is triggered when `button` is pressed `n` times
- `Shutter<x>#Button0=0`  is triggered when all buttons of that shutter are hold simultaneously
- `Shutter<x>#Button0=<n>`  is triggered when all buttons of that shutter are pressed simultaneously `n` times

!!! example "Examples"

- Publish a message with the position of the shutter:
  `Rule1 ON Shutter1#Position DO Publish status/%topic%/level {"%value%"} ENDON`
- Open/Close or set a specific position for a shutter. This example drives the second shutter to the same position as the first shutter:  
  `Rule1 ON Shutter1#Position DO ShutterPosition2 %value%" ENDON`

### Jarolift Shutter Support
Jarolift shutters operates by the 3 commands up/stop/down. Compile with the KeeLoq Option and provide the extracted master keys to communicate. Please see KeeLoq description how to do that. After this create a rule to allow the shutter to control the Jarolift devices. Shutter must be in ShutterMode 0.

  `Rule1 On Power1#state=0 DO KeeloqSendButton 4 endon On Power2#state=0 DO KeeloqSendButton 4 endon on Power1#state=1 DO KeeloqSendButton 8 endon on Power2#State=1 DO KeeloqSendButton 2 endon`

### Venetian Blind Support
All time based shutters (not stepper, pwm) can be enhanced with Venetian Blind functionality. The configuration need following parameters: angle of blinds during opening phase, angle of blinds during closing phase. This are the max and the min values of the venetian blinds (e.g. opening at 0° - closing at 90°). Additionally the runtime is required from min to max. This is typically 1-2sec. The resolution of the time is 0.05sec. Duration in [sec] must be multiplied by 20. e.g. 1.2sec => 1.2 x 20 = 24. To open and close the tilt you must define the angle for CLOSE and the angle for OPEN of the tilt (be careful about the correct order, refer to the following example)

Example:
- Angle of the slats when the blind is opening: 0°
- Angle of the slats when the blind is closing: 90°
- Time needed to flip in 1/20 seconds (1 second = 20): 40
- Desired angle of the slats when set to CLOSE : 90°
- Desired angle of the slats when set to OPEN : 0°
   
 `ShutterTiltConfig1  0  90  40  90  0`

Tilt configuration can be set for every shutter independently. The tilt can be set with one of the following commands:
   `shuttertilt1 open` set tilt to defined open angle
   `shuttertilt1 close` set tilt to defined close angle
   `shuttertilt1 20` set tilt to 20° angle
   
If the shutter is moved from one position to another position the tilt will be restored AFTER the movement. If the shutter is fully opened or fully closed the tilt will be reset. This means there is no tilt restore at the endpoints. If you want to restore the tilt at the endpoint you have to use a backlog command e.g. `backlog shutterclose1; shuttertilt1 open`

Similar to shutterchange to make relative movements there is also a `shuttertiltchange` with the same behavior. 
   
If the shutter is operated with wall buttons or the web interface and stopped during a tilte change before the shutter starts moving the NEW tilt position is stored. Now any additional position movements will restore this new tilt position. This makes is possible with small ON/OFF to change the tilt and with long ON/OFF to change the position and retain the tilt after movement.

Similar to shutterposition there is a minimum runtime of the motor required that TASMOTA can control. This is 0.2sec. Because the tiltmovement from one position into the other takes often about 1sec it is very common that you cannot make small tilt changes of 10° or sometimes even 20". 
