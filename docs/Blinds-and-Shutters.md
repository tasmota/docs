
# Shutters and Blinds

!!! info "Control blinds and roller shades connected to regular ON/OFF motors or stepper motors"

Your device must have at least two relays (see [Shutters with Sonoff Dual R2](#using-sonoff-dual-r2)). 
Only available in normal tasmota.bin!

## Commands
First enable shutter support with `SetOption80 1`

Complete list of commands is available at [Blinds, Shutters and Roller Shades Commands](Commands.md#shutters).

## Shutter Modes
There are five shutter modes which defines how the relays operate. Additional you can define on any relay [PulseTime](Commands.md#pulsetime) to change the relay into a pulse relay whre the pulse changes start/stop. Additionaly we recomment at least for mode=1 to define an [Interlock](Commands.md#interlock) settings. The examples below are for a `ShutterRelay1 1` configuration (using Relay1 and Relay2).

**Shutter mode 1** - Normal Operation   

First relay: OFF/DOWN, Second relay: OFF/UP  
   - `Interlock 1,2` (Interlocked relay pair)
   - `Interlock ON`

**Shutter mode 2** - Circuit Safe 

First relay: ON/OFF, Second relay: UP/DOWN
   - `Interlock OFF`

**Shutter mode 3** - Garage Motors   

First relay: OFF/DOWN PULSE, Second relay: OFF/UP PULSE
   
**Shutter mode 4** - Stepper Motors   

First relay: ON/OFF, Second relay: UP/DOWN
   PWM: Stepper signal, COUNTER: Stepper position signal
   - PWM and COUNTER defined
   
**Shutter mode 5** - Servo Motors (PWM position based servo)  
First relay: ON/OFF, Second relay: UP/DOWN (optional not used)
   PWM: Stepper signal
   PWMfrequency 200   ( This is mandatory for most relay to get correct PWM duty cylces)
   SetOption15 0 (required to store value and make it reboot save)
   
[Wiring diagrams](#motor-wiring-diagrams) for Normal, Stepper motor, and Short Circuit-Safe configurations are available at the end of this page. Even if the shutter does not have two motors, three wires have to be connected.

!!! note 
    **After setting the options for shutter mode, the device must be rebooted.** Otherwise, the sliders won't be available in the web UI, and the `ShutterOpenDuration<x>`and  `ShutterCloseDuration<x>` commands will report "Shutter unknown". 

Issue `ShutterRelay<x> 1` command and check in console which **ShutterMode** is displayed:
Issue `Status 13` command and check in console how the shutter is defined

```
Shutter accuracy digits: 1
Shutter 0 (Relay:1): Init. Pos: 20000 [100 %], Open Vel.: 100 Close Vel.: 100 , Max Way: 20000, Opentime 10.0 [s], Closetime 10.0 [s], CoedffCalc: c0: 0, c1 200, c2: 200, c3: 0, c4: 0, binmask 3, is inverted 1, <span style="font-weight:bold;color:lime">ShutterMode 0</span>, motordelay 0
```

## Operation
Turning a device relay on or off directly (i.e., using `Power`) will function to affect a shutter's movement. In momentary mode (i.e., stepper motor), the relays start or stop the motor. The driver takes care of the direction and proper update of the shutter position.

The shutter reports its position and can also be sent to a dedicated position. `ShutterPosition` = `0` means the shutter is closed and `ShutterPosition` = `100` means the shutter is open. If you need the position values reversed (`0` = open, `100` = closed), define and [calibrate your shutter as documented below](#calibration). Then tell Tasmota to reverse the shutter position meaning via the `ShutterInvert<x> 1` command. All internal calculations are the same (the log output is the same). Only the interaction with the user and other systems changes. Now `ShutterPosition<x> 0` will open the shutter and `ShutterPosition<x> 100` will close the shutter.

By default, only `Shutter1` is enabled when `SetOption80 1` is invoked.  
![](https://user-images.githubusercontent.com/34340210/65997878-3517e180-e468-11e9-950e-bfe299771233.png)

A maximum of four shutters per device are supported.  
![](https://user-images.githubusercontent.com/34340210/65997879-3517e180-e468-11e9-9c44-9ad4a4a970cc.png) 

To enable additional shutters, `ShutterRelay<x> <value>` must be executed for each additional shutter. Additional shutter declarations must be sequentially numbered, and without gaps (i.e., second shutter is 2, then shutter 3, and finally shutter 4).

Disabling a shutter in the middle of the defined set of shutters will disable all other higher numbered shutters. If the disabled shutter is restored, the higher numbered shutters previously declared will also be restored. When a shutter is added or removed, a list of the active shutters, with their parameters, is output to the log. If you intend to remove shutters, explicitly remove each one beginning with the highest numbered shutter.

With four shutters, eight `Relay<x>` components are needed. If manual operation switches (`Switch<x>` or `Button<x>` pairs) are also used, additional input GPIO are required. The ESP82xx device may not have enough free GPIO to support all the shutter connections required. A GPIO expander such as a PCF8574 or [MCP230xx](MCP230xx) can be used.

Using manual operation `Switch<x>` pairs may require setting `SwitchMode<x> 4` (inverse follow) for proper switch behavior.

Any shutter positioning can be locked `ShutterLock<x> 1`. Once executed an ongoing movement is finished while further positioning commands like `ShutterOpen<x>`, `ShutterClose<x>`, `ShutterStop<x>`,  `ShutterPosition<x>`, ... as well as web UI buttons, web UI sliders, and shutter buttons are disabled. This can be used to lock an outdoor blind in case of high wind or rain. You may also disable shutter positioning games by your children. Shutter positioning can be unlocked using `ShutterLock<x> 0`. Please be aware that the shutter can still be moved by direct relay control (i.e., `power<x>`), or physical switches and buttons. Use hte `ShutterButton<x>` command prior to `ShutterLock` to be able to lock buttons.

### Pulse Motor Support
There are shutters that have two relays but only need a pulse to start or stop. Depending on the current situation a pulse will stop the shutter or send it into a specific direction. To use these kinds of shutters a [`PulseTime`](Commands.md#pulsetime) must be defined on each relay. The minimum setting that seems to make it work consistently is `2`. A setting of `1` does not work. If the shutter moves too fast and does not react to a stop command, increase the setting to `3` or `4`. 

### Stepper Motor Support
Stepper motors can also be used to operate shutters and blinds. Additionally you can operate sliding doors with this configuration.

### Servo Motor Support
Servos are small devices with typical 180° or 360" rotation movement. The position will be drived by the PWM duty cycle time. This will all automatically calculated

### Smooth RAMP-UP and RAMP-DOWN Support
Servos and Steppers also have a velocity control. With `ShutterMotorDelay<x> 1.5` you can define a 1.5second soft start/stop before the device reaches it final moving speed. Usefull for moving heavy items like doors.
    
### Calibration
[Shutter calibration video tutorial](https://www.youtube.com/watch?v=Z-grrvnu2bU)  

- Set the `ShutterOpenDuration<x>` to the time the shutter needs to open completely.
- Set the `ShutterCloseDuration<x>` at least to the time the shutter needs to close completely. If the shutter does not close completely or runs too long, the calibration point of a closed shutter can be defined with `ShutterSetClose<x>`. Move the shutter to the close position and execute `ShutterSetClose<x>` command. `ShutterPosition<x>` will be reset to 0 (`ShutterClose<x>`).
- Set the 50% open position of the shutter. Some shutters need some time from totally closed until they begin moving the bottom-most part and opening. This often results a shutter that is less than 50% open when the shutter has been operating for 50% of the set duration. This can be corrected by using `ShutterSetHalfway<x>`. Use this procedure to calibrate the half-open position:
  1. `ShutterClose<x>` (confirm that the shutter is completely closed)
  2. `ShutterSetHalfway<x> 50` (reset to default)
  3. Move the shutter to actual 50% open position.
  4. Use `ShutterPosition<x>` to inquire the shutter's current position and record the value. This value is a **percentage of the total opening** (e.g., `63` = 63% of opening).
  5. `ShutterClose<x>`
  6. `ShutterSetHalfway<x> 63` (using the value from step #4 above)
  7. `Restart 1`
- After calibration you might want to enable an additional 1s motor movement by `ShutterEnableEndStopTime<x> 1` when the shutter is asked to move to its end positions (0% and 100%). By this you can guarantee that end positions are still reached in case of inaccuracies. Take care to disable this by `ShutterEnableEndStopTime<x> 0` before further open or close duration measurements.

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
- Finally, enter the position measurements as the calibration values:
  `ShutterCalibration<x> 15 50 100 150 180`  

`ShutterCalibration<x>` takes position measurements (**not** the time it takes to move). During calibration you position the shutter to an indicated percentage (e.g., `30%`) of opening and measure the shutter position (e.g., `15`). Use the same unit of measure for all your measurements (e.g., centimeters, inches, steps, etc.). After calibration `ShutterPosition<x> 30` will move to `30%` opening which will correspond to the position you provided (`15`).  

Notice that there is no calibration for the 10\% position. On many shutters, there is no movement during the initial phase (i.e., nearly 10% of total time). Therefore the opening could be `0`. This measurement would cause an execution DIV 0 exception. Therefore the first calibration point is 30%. In most cases this is not a large opening so the calibration will be near enough. Yes, until ~10%, the position will be a bit "off" but not enough for concern.  

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

### Button control
When shutter is running in normal `ShutterMode: 0`, you already have basic control over the shutter movement using tasmota switches or tasmota buttons in the module configuration to directly drive the shutter relays.  For  short circuit safe operation `ShutterMode: 1` direct control of the relays will not give you a nice user interface since you have to 1st set the direction with one switch or button and 2nd switch on the power by the other switch or button. 

To have shutter mode independent button control over the shutter and not over its relays one can use the `ShutterButton<x>` command. It also introduces some more features, see below:

`ShutterButton<x> <button> <func> <mqtt>` 

This assigns a tasmota button `<button>` to control your shutter `<x>` having functionality `<func>`. The tasmota button `<button>` must already be configured in the module configuration. You can assign multiple buttons to a single shutter. Any button can only control one shutter (beside the `<mqtt>` broadcast feature, see description below). Any press of the button while the shutter is moving will immediately stop the shutter.

One can remove all button control for shutter `<x>`  by `ShutterButton<x> 0`. 

The assigned button can have one of the following functionalities:<BR>

 - Setup for an "up" button: `ShutterButton<x> <button> up <mqtt>`
   Single press will move shutter to 100%, double press to 50% and tripple press to 74%. Holding the button for more than the hold time (SetOption32) moves all shutters with same `<grouptopic>` to 100% when `<mqtt>` is equal to `1`. When `<mqtt>` is equal to `0` hold action of this button is same as single press. 

- Setup for a "down" button: `ShutterButton<x> <button> down <mqtt>`
   Single press will move shutter to 0%, double press to 50% and tripple press to 24%. Holding the button for more than the hold time (SetOption32) moves all shutters with same `<grouptopic>` to 0% when `<mqtt>` is equal to `1`. When `<mqtt>` is equal to `0` hold action of this button is same as single press. 

- Setup for an "updown" button: `ShutterButton<x> <button> updown <mqtt>`
   Single press will move shutter to 100%, double press down to 0% and tripple press to 50%. No hold action and no other shutter control by MQTT, `<mqtt>` is don't care here.

- Setup for an "toggle" button: `ShutterButton<x> <button> toggle <mqtt>`
   Single press will toggle shutter, double press will move it to 50%. No hold action and no other shutter control by MQTT, `<mqtt>` is don't care here.

More advanced control of the button press actions is given by the following `ShutterButton<x>` command syntax:

`ShutterButton<x> <button> <p1> <p2> <p3> <ph> <m1> <m2> <m3> <mh> <mi>` 

`<button>` `1..4`: Button number, `0/-`: disable buttons for this shutter<BR>`<p1>` `0..100`: single press position, `t`: toggle, `-`: disable<BR>`<p2>` `0..100`: double press position, `t`: toggle, `-`: disable<BR>`<p3>` `0..100`: tripple press position, `t`: toggle, `-`: disable<BR>`<ph>` `0..100`: hold press position, `t`: toggle, `-`: disable<BR>`<m1>` `1`: enable single press position MQTT broadcast, `0/-`: disable<BR>`<m2>` `1`: enable double press position MQTT broadcast, `0/-`: disable<BR>`<m3>` `1`: enable tripple press position MQTT broadcast, `0/-`: disable<BR>`<mh>` `1`: enable hold press position MQTT broadcast, `0/-`: disable<BR>`<mi>` `1`: enable MQTT broadcast to all shutter indices, `0/-`: disable

Parameters are optional. When missing, all subsequent parameters are set to `disable`.

By a button single press the shutter is set to position `<p1>`.  Double press will drive the shutter to position `<p2>` and  tripple press to position `<p3>`. Holding the button for more than the `SetOption32` time sets the shutter position to `<ph>`. Any button action `<p1>` to `<ph>` can be disabled by setting the parameter to `-`. Independent from configuration `<p1>` to `<ph>` any press of the button while the shutter is moving will immediately stop the shutter.

Global steering of all your shutters at home is supported by additional MQTT broadcast. By any button action a corresponding MQTT command can be initiated to the `<grouptopic>` of the device. For single press this can be enabled by `<m1>` equal to `1`, disabling is indicated by `-`. Double to hold MQTT configurations are given by `<m2>` to `<mh>`, correspondingly. When `<mi>` is equal to `-` only `cmnd/<grouptopic>/Shutterposition<x> <p1..h>` is fired. When `<mi>` is equal to `1`, `<x>`=`1..4` is used to control any shutter number of a tasmota device having same `<grouptopic>`.

!!! example 

- `ShutterButton<x> <button> 100 50 74 100 0 0 0 1 1` is same as `ShutterButton<x> <button> up 1`.
- `ShutterButton<x> <button> 0 50 24 0 0 0 0 1 1` is same as `ShutterButton<x> <button> down 1`.
- `ShutterButton<x> <button> 100 0 50 - 0 0 0 0 0` is same as `ShutterButton<x> <button> updown 0`.
- `ShutterButton<x> <button> t 50 - - 0 0 0 0 0` is same as `ShutterButton<x> <button> toggle 0`.

Module WiFi setup, restart, upgrade and reset according to [Buttons and Switches](Buttons-and-Switches) are supported "child and fool save" only when no button restriction (SetOption1) is given and when all configured shutter buttons of that shutter are pressed 5x, 6x, 7x times or hold long simultaneously.

### Button remote control
One can use any other tasmota module with attached button(s) or switch(es) to remote control a shutter using rules. Similar behavior as direct button control can be achieved by  applying `ShutterStopClose, ShutterStopOpen, ShutterStopToggle, ShutterStopPosition` commands. They stops shutter while movement and carry out close, open, toggle or position commands otherwise.

`rule<n> on switch1#state=2 do publish cmnd/<myTasmotaShutter>/ShutterStopToggle endon`

## Configuration

### using Pulse Motors
#### Normal wire configuration with a PCF as digital I/O
![Normal wire](https://user-images.githubusercontent.com/34340210/65997880-35b07800-e468-11e9-82d3-8dcaab14b3bf.png)

#### Short Circuit safe wire configuration with a PCF as digital I/O
![ShortCicuitSafe](https://user-images.githubusercontent.com/34340210/65997877-3517e180-e468-11e9-9b8c-2f0787f977f6.png)

#### Sample Log Output
Typical log output (log level `3`) when starting from `ShutterOpen1`. The first command is `ShutterClose1`. After closing, open it to 50% with `ShutterPosition1 50`  
```
SHT: Accuracy digits: 1
SHT: Shutter 0 (Relay:1): Init. Pos: 20000 [100 %], Open Vel.: 100 Close Vel.: 100 , Max Way: 20000, Opentime 10.0 [s], Closetime 10.0 [s], CoedffCalc: c0: 0, c1 200, c2: 200, c3: 0, c4: 0, binmask 3, is inverted 0, ShutterMode 0
....
CMD: ShutterClose
SRC: Serial
SHT: Position in: payload 0, index 1, source 7
SHT: lastsource 7:, realpos 20000, target 0, payload 0
SHT: Start shutter in direction -1
SRC: Shutter
MQT: stat/%topic%/RESULT = {"POWER2":"ON"}
MQT: stat/%topic%/POWER2 = ON
MQT: stat/%topic%/RESULT = {"ShutterClose1":0}
SHT: Shutter 0: Real Pos: 19000, Target 0, source: Shutter, start-pos: 100 %, direction: -1, rtcshutter: 0.5  [s]
CFG: Saved to flash at F5, Count 725, Bytes 4096
SHT: Shutter 0: Real Pos: 17000, Target 0, source: Shutter, start-pos: 100 %, direction: -1, rtcshutter: 1.5  [s]
SHT: Shutter 0: Real Pos: 15000, Target 0, source: Shutter, start-pos: 100 %, direction: -1, rtcshutter: 2.5  [s]
SHT: Shutter 0: Real Pos: 13000, Target 0, source: Shutter, start-pos: 100 %, direction: -1, rtcshutter: 3.5  [s]
SHT: Shutter 0: Real Pos: 11000, Target 0, source: Shutter, start-pos: 100 %, direction: -1, rtcshutter: 4.5  [s]
SHT: Shutter 0: Real Pos: 9000, Target 0, source: Shutter, start-pos: 100 %, direction: -1, rtcshutter: 5.5  [s]
SHT: Shutter 0: Real Pos: 7000, Target 0, source: Shutter, start-pos: 100 %, direction: -1, rtcshutter: 6.5  [s]
SHT: Shutter 0: Real Pos: 5000, Target 0, source: Shutter, start-pos: 100 %, direction: -1, rtcshutter: 7.5  [s]
SHT: Shutter 0: Real Pos: 3000, Target 0, source: Shutter, start-pos: 100 %, direction: -1, rtcshutter: 8.5  [s]
SHT: Shutter 0: Real Pos: 1000, Target 0, source: Shutter, start-pos: 100 %, direction: -1, rtcshutter: 9.5  [s]
SHT: Shutter 0: Real Pos. 0, Stoppos: 0, relay: 1, direction -1, pulsetimer: 0, rtcshutter: 10.1 [s], operationtime 0
MQT: stat/%topic%/SHUTTER1 = 0
SRC: Shutter
MQT: stat/%topic%/RESULT = {"POWER2":"OFF"}
MQT: stat/%topic%/POWER2 = OFF
MQT: tele/%topic%/RESULT = {"Shutter1":{"Position":0,"direction":0}}
CFG: Saved to flash at F4, Count 726, Bytes 4096
....
CMD: ShutterPosition 50
SRC: Serial
SHT: Position in: payload 50, index 1, source 23
SHT: lastsource 23:, realpos 0, target 10000, payload 50
SHT: Start shutter in direction 1
SRC: Shutter
MQT: stat/%topic%/RESULT = {"POWER1":"ON"}
MQT: stat/%topic%/POWER1 = ON
MQT: stat/%topic%/RESULT = {"ShutterPosition1":50}
SHT: Shutter 0: Real Pos: 1500, Target 10000, source: Shutter, start-pos: 0 %, direction: 1, rtcshutter: 0.8  [s]
CFG: Saved to flash at FB, Count 727, Bytes 4096
SHT: Shutter 0: Real Pos: 3500, Target 10000, source: Shutter, start-pos: 0 %, direction: 1, rtcshutter: 1.8  [s]
SHT: Shutter 0: Real Pos: 5500, Target 10000, source: Shutter, start-pos: 0 %, direction: 1, rtcshutter: 2.7  [s]
SHT: Shutter 0: Real Pos: 7500, Target 10000, source: Shutter, start-pos: 0 %, direction: 1, rtcshutter: 3.7  [s]
SHT: Shutter 0: Real Pos: 9500, Target 10000, source: Shutter, start-pos: 0 %, direction: 1, rtcshutter: 4.7  [s]
SHT: Shutter 0: Real Pos. 10000, Stoppos: 50, relay: 0, direction 1, pulsetimer: 0, rtcshutter: 5.0 [s], operationtime 2
MQT: stat/%topic%/SHUTTER1 = 50
SRC: Shutter
MQT: stat/%topic%/RESULT = {"POWER1":"OFF"}
MQT: stat/%topic%/POWER1 = OFF
MQT: tele/%topic%/RESULT = {"Shutter1":{"Position":50,"direction":0}}
CFG: Saved to flash at FA, Count 728, Bytes 4096
```
### using Stepper Motors
Stepper motors can be used to operate shutters and blinds. The configuration is very similar to the  Circuit Safe (Shuttermode 1) configuration. To operate a stepper motor requires driver module such as the A4988 and uses EN (enable), DIR (direction), STP (Stepper) for controls. If everything is defined correctly the shuttermode 3 will be reported at boot time.

Tasmota supports a maximum of four shutters with one stepper motor per shutter simultanously. In very rare conditions where two or more shutters simoultanously move the last mm it can happen than one shutter moves to far.   

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

You can define a soft start/stop by defining a `ShutterMotorDelay`. This causes the driver to ramp the speed up and down during the defined duration. The change of the `ShutterMotorDelay` does NOT change the distance the shutter makes. This is very convinent to trim the accelerate and decelerate rate without changeing the distance.

Wemos Pin|GPIO|Component|Stepper Signal
:-:|:-:|:-:|:-:
D1|5|Relay1i|EN
D2|4|Relay2|DIR
D3|0|PWM1|STP
D4|2|Counter1|STP

**a) Set ShutterMode 3**  
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

**a) Set ShutterMode 3**  
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
- `Shutter#Moving` is triggered during movement and just before moving (shutter independently). If VAR<x> is set to 99 then this trigger will be executed BEFORE the shutter starts. You can start the shutter after rule execution by setting VAR<x> to 0 or wait 10seconds before the timeout kicks in. After the movement with shutter#moved the var must be set back to 99 and the inital rule must be enabled again. The inital rule has to be defined to run ONCE. 
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

Examples:  
- Publish a message with the position of the shutter:
  `Rule1 ON Shutter1#Position DO Publish status/%topic%/level {"%value%"} ENDON`

- Open/Close or set a specific position for a shutter. This example drives the second shutter to the same position as the first shutter:  
  `Rule1 ON Shutter1#Position DO ShutterPosition2 %value%" ENDON`

#### Jarolift Shutter Support
Jarolift shutters operates by the 3 commands up/stop/down. Compile with the KeeLoq Option and provide the extracted master keys to communicate. Please see KeeLog description how to do that. After this create a rule to allow the shutter to control the Jarolift devices. Shutter must be in ShutterMode 0.

  `Rule1 On Power1#state=0 DO KeeloqSendButton 4 endon On Power2#state=0 DO KeeloqSendButton 4 endon on Power1#state=1 DO KeeloqSendButton 8 endon on Power2#State=1 DO KeeloqSendButton 2 endon`

#### Venetian Blind Support
A 2nd shutter can be configured to support the adjustment of the horizontal tilt.  
After movement the tilt will be restored if blind is not fully opened or closed via an additional rule.  

Custom build with following options is needed:  
  `#define USE_EXPRESSION`  
  `#define SUPPORT_IF_STATEMENT`  

Configuration of 2nd shutter:  
  `ShutterRelay2 1`            // setup 2nd shutter at same relay as shutter 1  
  `ShutterOpenDuration2 1.4`   // adjust to real duration  
  `ShutterCloseDuration2 1.4`  // adjust to real duration  

Add rule (requires rules with [Conditional Rules](Rules.md#conditional-rules) enabled :  
```
Rule1 on Shutter2#Position DO mem1 %value% ENDON on Shutter1#Position DO var2 %value% ENDON on Shutter1#Direction!=0 DO var1 %value% ENDON on Shutter1#Direction=0 DO IF (var1==1) var1 0; IF (var2!=100) ShutterSetOpen2; shutterposition2 %mem1% ENDIF ENDIF ENDON on Shutter1#Direction=0 DO IF (var1==-1) var1 0; IF (var2!=0) ShutterSetClose2; shutterposition2 %mem1% ENDIF ENDIF ENDON
```

#### Home Assistant Support
For shutter position to persist in Home Assistant through device reboots, execute `PowerRetain 1`.

These sample configurations should allow the shutter work in Home Assistant. Change the device MQTT topic and templates to match your settings. This is only an example and may need further modification to work in your environment.

The configuration requirements changed starting with Home Assistant version 0.82.0. This example uses a new configuration for roller shutters with options for positioning. It assumes that `%prefix%/%topic%/` is configured in the Tasmota Full Topic MQTT parameter.  
```yaml
cover:
  - platform: mqtt
    name: "Balcony Blinds"
    availability_topic: "tele/%topic%/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
    position_topic: stat/%topic%/Shutter1
    position_open: 100
    position_closed: 0
    set_position_topic: "cmnd/%topic%/ShutterPosition1"
    command_topic: "cmnd/%topic%/Backlog"
    payload_open: "ShutterOpen1"
    payload_close: "ShutterClose1"
    payload_stop: "ShutterStop1"
    retain: false
    optimistic: false
    qos: 1
```
Check [Issue 130](https://github.com/stefanbode/Sonoff-Tasmota/issues/130) for more information about this configuration.

Another Home Assistant integration example:  
```yaml
cover:
  - platform: mqtt
    name: "Test"
    availability_topic: "tele/%topic%/LWT"
    state_topic: "stat/%topic%/RESULT"
    command_topic: "cmnd/%topic%/Backlog"
    value_template: '{{ value | int }}'
    qos: 1
    retain: false
    payload_open: "ShutterOpen1"
    payload_close: "ShutterClose1"
    payload_stop: "ShutterStop1"
    state_open: "ON"
    state_closed: "OFF"
    payload_available: "Online"
    payload_not_available: "Offline"
    optimistic: false
    tilt_command_topic: 'cmnd/%topic%/ShutterPosition1'
    tilt_status_topic: 'cmnd/%topic%/ShutterPosition1'
    set_position_topic: 'cmnd/%topic%/ShutterPosition1'
    position_topic: "stat/%topic%/SHUTTER1"
    tilt_min: 0
    tilt_max: 100
    tilt_closed_value: 0
    tilt_opened_value: 100
```
Another Home Assistant integration example with position update while movement (Tasmota versions >= v8.1.0.5):  
```yaml
cover:
  - platform: mqtt
    name: "Balcony Blinds"
    availability_topic: "tele/%topic%/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
    position_topic: "stat/%topic%/RESULT"
    value_template: >
      {% if ('Shutter1' in value_json) and ('Position' in value_json.Shutter1) %}
        {{ value_json.Shutter1.Position }}
      {% else %}
        {% if is_state('cover.balcony_blinds', 'unknown') %}
          50
        {% else %}
          {{ state_attr('cover.balcony_blinds','current_position') }}
        {% endif %}
      {% endif %}    
    position_open: 100
    position_closed: 0
    set_position_topic: "cmnd/%topic%/ShutterPosition1"
    command_topic: "cmnd/%topic%/Backlog"
    payload_open: "ShutterOpen1"
    payload_close: "ShutterClose1"
    payload_stop: "ShutterStop1"
    retain: false
    optimistic: false
    qos: 1
```
In addition, add to your home assistant start up automation a query for the current shutter position:
```yaml
- alias: "Power state on HA start-up"
  trigger:
    platform: homeassistant
    event: start
  action:
    - service: mqtt.publish
      data:
        topic: "cmnd/%shutters grouptopic%/shutterposition"
        payload: ""       
```
