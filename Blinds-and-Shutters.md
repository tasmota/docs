!> **This feature is not included in precompiled binaries.**     
To use it you must [compile your build](Compile-your-build.md). Add the following to `user_config_override.h`:
```
#ifndef USE_SHUTTER
#define USE_SHUTTER           // Add Shutter support (+6k code)
#endif
```
----
?> Control blinds and roller shades connected to regular ON/OFF motors or stepper motors.

The device must have at least two relays (e.g., a [Sonoff Dual R2](#sonoff-dual-r2-required-configuration)). Otherwise the shutter feature will not work.

## Commands
First enable shutter support with `SetOption80 1`

Complete list of commands is available at [Blinds, Shutters and Roller Shades Commands](Commands.md#blinds-shutters-and-roller-shades).

## Shutter Modes
There are three shutter modes which are defined according to the [PulseTime](Commands.md#pulsetime) and [Interlock](Commands.md#interlock) settings. The examples below are for a `ShutterRelay1 1` configuration (using Relay1 and Relay2).
1. **ShutterMode 0** - Normal Operation   
   First relay: OFF/DOWN, Second relay: OFF/UP  
   - `Backlog PulseTime1 0; PulseTime2 0`
   - `Backlog Interlock 1,2; Interlock ON` (Interlocked relay pair)

1. **ShutterMode 1** - Circuit Safe 
   First relay: ON/OFF, Second relay: UP/DOWN
   - `Backlog PulseTime1 0; PulseTime2 0`
   - `Interlock OFF`

1. **ShutterMode 2** - Pulse Motors   
   First relay: OFF/DOWN PULSE, Second relay: OFF/UP PULSE
   - `Backlog PulseTime1 2; PulseTime2 2`
   - `Backlog Interlock 1,2; Interlock ON` (Interlocked relay pair)
   
1. **ShutterMode 3** - Stepper Motors   
   First relay: ON/OFF, Second relay: UP/DOWN
   PWM: Stepper signal, COUNTER: Stepper position signal
   - `Backlog PulseTime1 0; PulseTime2 0`
   - `Interlock OFF`
   - PWM and COUNTER defined
   
   
[Wiring diagrams](#wiring-diagrams) for Normal, Stepper motor, and Short Circuit-Safe configurations are available at the end of this page. Even if the shutter does not have two motors, three wires have to be connected.

> [!NOTE] **After setting the options for shutter mode, the device must be rebooted.** Otherwise, the sliders won't be available in the web UI, and the `ShutterOpenDuration<x>`and  `ShutterCloseDuration<x>` commands will report "Shutter unknown". 

Issue `ShutterRelay<x> 1` command and check in console which **ShutterMode** is displayed:

<pre style="white-space:pre-line">
Shutter accuracy digits: 1
Shutter 0 (Relay:1): Init. Pos: 20000 [100 %], Open Vel.: 100 Close Vel.: 100 , Max Way: 20000, Opentime 10.0 [s], Closetime 10.0 [s], CoedffCalc: c0: 0, c1 200, c2: 200, c3: 0, c4: 0, binmask 3, is inverted 1, <span style="font-weight:bold;color:lime">ShutterMode 0</span>, motordelay 0
</pre>

## Operation
Turning a device relay on or off directly (i.e., using `Power`) will function to affect a shutter's movement. In momentary mode (i.e., stepper motor), the relays start or stop the motor. The driver takes care of the direction and proper update of the shutter position.

The shutter reports its position and can also be sent to a dedicated position. `ShutterPosition` = `0` means the shutter is closed and `ShutterPosition` = `100` means the shutter is open. If you need the position values reversed (`0` = open, `100` = closed), define and [calibrate your shutter as documented below](#calibration). Then tell Tasmota to reverse the shutter position meaning via the `ShutterInvert<x> 1` command. All internal calculations are the same (the log output is the same). Only the interaction with the user and other systems changes. Now `ShutterPosition<x> 0` will open the shutter and `ShutterPosition<x> 100` will close the shutter.

By default, only `Shutter1` is enabled when `SetOption80 1` is invoked.  
![](https://user-images.githubusercontent.com/34340210/65997878-3517e180-e468-11e9-950e-bfe299771233.png ":size=200")

A maximum of four shutters per device are supported.  
![](https://user-images.githubusercontent.com/34340210/65997879-3517e180-e468-11e9-9c44-9ad4a4a970cc.png ":size=200") 

To enable additional shutters, `ShutterRelay<x> <value>` must be executed for each additional shutter. Additional shutter declarations must be sequentially numbered, and without gaps (i.e., second shutter is 2, then shutter 3, and finally shutter 4).

Disabling a shutter in the middle of the defined set of shutters will disable all other higher numbered shutters. If the disabled shutter is restored, the higher numbered shutters previously declared will also be restored. When a shutter is added or removed, a list of the active shutters, with their parameters, is output to the log. If you intend to remove shutters, explicitly remove each one beginning with the highest numbered shutter.

With four shutters, eight `Relay<x>` components are needed. If manual operation switches (`Switch<x>` or `Button<x>` pairs) are also used, additional input GPIO are required. The ESP82xx device may not have enough free GPIO to support all the shutter connections required. A GPIO expander such as a PCF8574 or [MCP230xx](peripherals/MCP230xx) can be used.

Using manual operation `Switch<x>` pairs may require setting `SwitchMode<x> 4` (inverse follow) for proper switch behavior.

Any shutter positioning can be locked `ShutterLock<x> 1`. Once executed an ongoing movement is finished while further positioning commands like `ShutterOpen<x>`, `ShutterClose<x>`, `ShutterStop<x>`, and `ShutterPosition<x>`, as well as web UI buttons, web UI sliders, and shutter buttons are disabled. This can be used to lock an outdoor blind in case of high wind or rain. You may also disable shutter positioning games by your children. Shutter positioning can be unlocked using `ShutterLock<x> 0`. Please be aware that the shutter can still be moved by direct relay control (i.e., `power<x>`), or physical switches and buttons. Use hte `ShutterButton<x>` command prior to `ShutterLock` to be able to lock buttons.

## Pulse Motor Support
There are shutters that have two relays but only need a pulse to start or stop. Depending on the current situation a pulse will stop the shutter or send it into a specific direction. To use these kinds of shutters a [`PulseTime`](Commands.md#pulsetime) must be defined on each relay. The minimum setting that seems to make it work consistently is `2`. A setting of `1` does not work. If the shutter moves too fast and does not react to a stop command, increase the setting to `3` or `4`. 

## Stepper Motor Support
Stepper motors can also be used to operate shutters and blinds. Additionally you can operate sliding doors with this configuration.
  
Please refer to [Shutters and Steppers](Shutter-and-Steppers.md) for details.  
  
## Calibration
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

### Increasing Calibration Granularity
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

`ShutterCalibration<x>` takes position measurements (**not** the time it takes to move). During calibration you position the shutter to an indicated percentage (e.g., `30%`) of opening and measure the shutter position (e.g., `15`). Use the same unit of measure for all your measurements (e.g., centimeters, inches, etc.). After calibration `ShutterPosition<x> 30` will move to `30%` opening which will correspond to the position you provided (`15`).  

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

## Button control
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

More advanced control of the button press actions is given by the following `ShutterButton<x>` command syntax:

`ShutterButton<x> <button> <p1> <p2> <p3> <ph> <m1> <m2> <m3> <mh> <mi>` 

`<button>` `1..4`: Button number, `0/-`: disable buttons for this shutter<BR>`<p1>` `0..100`: single press position, `-`: disable<BR>`<p2>` `0..100`: double press position, `-`: disable<BR>`<p3>` `0..100`: tripple press position, `-`: disable<BR>`<ph>` `0..100`: hold press position, `-`: disable<BR>`<m1>` `1`: enable single press position MQTT broadcast, `0/-`: disable<BR>`<m2>` `1`: enable double press position MQTT broadcast, `0/-`: disable<BR>`<m3>` `1`: enable tripple press position MQTT broadcast, `0/-`: disable<BR>`<mh>` `1`: enable hold press position MQTT broadcast, `0/-`: disable<BR>`<mi>` `1`: enable MQTT broadcast to all shutter indices, `0/-`: disable

Any parameters are optional: when missing all subsequent parameters are set to `disable`.

By a button single press the shutter is set to position `<p1>`.  Double press will drive the shutter to position `<p2>` and  tripple press to position `<p3>`. Holding the button for more than the `SetOption32` time sets the shutter position to `<ph>`. Any button action `<p1>` to `<ph>` can be disabled by setting the parameter to `-`. Independent from configuration `<p1>` to `<ph>` any press of the button while the shutter is moving will immediately stop the shutter.

Global steering of all your shutters at home is supported by additional MQTT broadcast. By any button action a corresponding MQTT command can be initiated to the `<grouptopic>` of the device. For single press this can be enabled by `<m1>` equal to `1`, disabling is indicated by `-`. Double to hold MQTT configurations are given by `<m2>` to `<mh>`, correspondingly. When `<mi>` is equal to `-` only `cmnd/<grouptopic>/Shutterposition<x> <p1..h>` is fired. When `<mi>` is equal to `1`, `<x>`=`1..4` is used to control any shutter number of a tasmota device having same `<grouptopic>`.

Examples:
- `ShutterButton<x> <button> 100 50 74 100 0 0 0 1 1` is same as `ShutterButton<x> <button> up 1`.
- `ShutterButton<x> <button> 0 50 24 0 0 0 0 1 1` is same as `ShutterButton<x> <button> down 1`.
- `ShutterButton<x> <button> 100 0 50 - 0 0 0 0 0` is same as `ShutterButton<x> <button> updown 0`.

Module WiFi setup, restart, upgrade and reset according to [Buttons and Switches](Buttons-and-Switches) are supported "child and fool save" only when no button restriction (SetOption1) is given and when all configured shutter buttons of that shutter are pressed 5x, 6x, 7x times or hold long simultaneously.

## Configuration
#### Sonoff Dual R2 Required Configuration
If using a Sonoff Dual R2, use the following Template:  
`{"NAME":"Sonoff Dual R2","GPIO":[17,255,0,255,0,22,18,0,21,56,0,0,0,0],"FLAG":0,"BASE":39}`

### Checklist
- Ensure that the first relay opens the shutter
- Ensure that the second relay closes the shutter
- Set `ShutterRelay<x>`
- Set `ShutterOpenDuration<x>`
- Set `ShutterCloseDuration<x>`
- Set `ShutterSetHalfway<x>` (optional)
- Set `ShutterInvert<x>`(optional)
- Set `ShutterInvertWebButtons<x>`(optional) (eg. useful for horizontal awnings)
- If the shutter uses a pulse motor instead of a motors with one wire for each direction (i.e., duration based), define `PulseTime<x> 2` on both relays. The driver's behavior will change to a pulse motor that needs pulses to start and stop.  

### Rules
Tasmota rule triggers:  
- `Shutter<x>#Position` is triggered at start and and of movement reporting actual position
- `Shutter<x>#Direction` is triggered at start and and of movement reporting actual direction
- `Shutter<x>#Target` is triggered at start and and of movement reporting current target
- `Shutter<x>#Open` and `Shutter<x>#Close`
- `Shutter#Moving` is triggered every second if the shutter is moving
- `Shutter#Moved` is triggered ONCE after the shutter stopped
- `Shutter<x>#Button<button>=0`  is triggered when `button` is hold
- `Shutter<x>#Button<button>=<n>`  is triggered when `button` is pressed `n` times
- `Shutter<x>#Button0=0`  is triggered when all buttons of that shutter are hold simultaneously
- `Shutter<x>#Button0=<n>`  is triggered when all buttons of that shutter are pressed simultaneously `n` times

With #Direction and var1..var4 you can store the movement ofa shutter and get information which shutter is moving

Examples:  
- Publish a message with the position of the shutter:
  `Rule1 ON Shutter1#Position DO Publish status/%topic%/level {"%value%"} ENDON`

- Open/Close or set a specific position for a shutter. This example drives the second shutter to the same position as the first shutter:  
  `Rule1 ON Shutter1#Position DO ShutterPosition2 %value%" ENDON`

### Jarolift Shutter Support
Jarolift shutters operates by the 3 commands up/stop/down. Compile with the KeeLoq Option and provide the extracted master keys to communicate. Please see KeeLog description how to do that. After this create a rule to allow the shutter to control the Jarolift devices. Shutter must be in ShutterMode 0.

  `Rule1 On Power1#state=0 DO KeeloqSendButton 4 endon On Power2#state=0 DO KeeloqSendButton 4 endon on Power1#state=1 DO KeeloqSendButton 8 endon on Power2#State=1 DO KeeloqSendButton 2 endon`

### Home Assistant Support
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

This example works with Home Assistant **versions prior to 0.82**:  
```yaml
cover:
 - platform: template
   covers:
     studio_shutter:
       friendly_name: "Studio Shutter"
       position_template: "{{ states.sensor.studio_shutter_position.state | int }}"
       open_cover:
         service: mqtt.publish
         data:
           topic: 'cmnd/%topic%/ShutterOpen1'
       close_cover:
         service: mqtt.publish
         data:
           topic: 'cmnd/%topic%/ShutterClose1'
       stop_cover:
         service: mqtt.publish
         data:
           topic: 'cmnd/%topic%/shutterstop1'
       set_cover_position:
         service: mqtt.publish
         data_template:
           topic: 'cmnd/%topic%/ShutterPosition1'
           payload: '{{position}}'
```

## Wiring Diagrams
### Normal wire configuration with a PCF as digital I/O
![Normal wire](https://user-images.githubusercontent.com/34340210/65997880-35b07800-e468-11e9-82d3-8dcaab14b3bf.png ":size=200px")

### Short Circuit safe wire configuration with a PCF as digital I/O
![ShortCicuitSafe](https://user-images.githubusercontent.com/34340210/65997877-3517e180-e468-11e9-9b8c-2f0787f977f6.png ":size=200px")

## Sample Log Output
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
