!> **This feature is not included in precompiled binaries.**     
To use it you must [compile your build](compile-your-build). Add the following to `user_config_override.h`:
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

1. **ShutterMode 2** - Stepper Motors   
   First relay: OFF/DOWN PULSE, Second relay: OFF/UP PULSE
   - `Backlog PulseTime1 2; PulseTime2 2`
   - `Backlog Interlock 1,2; Interlock ON` (Interlocked relay pair)

[Wiring diagrams](#wiring-diagrams) for Normal, Stepper motor, and Short Circuit-Safe configurations are available at the end of this page. Even if the shutter does not have two motors, three wires have to be connected.

> [!NOTE] **After setting the options for shutter mode, the device must be rebooted.** Otherwise, the sliders won't be available in the web UI, and the `ShutterOpenDuration<x>`and  `ShutterCloseDuration<x>` commands will report "Shutter unknown". 

Issue `ShutterRelay<x> 1` command and check in console which **ShutterMode** is displayed:

<pre style="white-space:pre-line">
Shutter accuracy digits: 1
Shutter 0 (Relay:1): Init. Pos: 20000 [100 %], Open Vel.: 100 Close Vel.: 100 , Max Way: 20000, Opentime 10.0 [s], Closetime 10.0 [s], CoedffCalc: c0: 0, c1 200, c2: 200, c3: 0, c4: 0, binmask 3, is inverted 1, <span style="font-weight:bold;color:lime">ShutterMode 0</span>, motordelay 0
</pre>

## Operation
Turning a device relay on or off directly (i.e., using `Power`) will function to affect a shutter's movement. In momentary mode (i.e., stepper motor), the relays start or stop the motor. The driver takes care of the direction and proper update of the shutter position.

By default, only `Shutter1` is enabled when `SetOption80 1` is invoked.  
![](https://user-images.githubusercontent.com/34340210/65997878-3517e180-e468-11e9-950e-bfe299771233.png ":size=200")


A maximum of four shutters per device are supported.  
![](https://user-images.githubusercontent.com/34340210/65997879-3517e180-e468-11e9-9c44-9ad4a4a970cc.png ":size=200") 

To enable additional shutters, `ShutterRelay<x> <value>` must be executed for each additional shutter. Additional shutter declarations must be sequentially numbered, and without gaps (i.e., first shutter 2, then shutter 3, and finally shutter 4).

Disabling a shutter in the middle of the defined set of shutters will disable all other higher numbered shutters. If the disabled shutter is restored, the higher numbered shutters previously declared will also be restored. When a shutter is added or removed, a list of the active shutters, with their parameters, is output to the log. If you intend to remove shutters, explicitly remove each one beginning with the highest numbered shutter.

With four shutters, eight `Relay<x>` components are needed. If manual operation switches (`Switch<x>` or `Button<x>` pairs) are also used, additional input GPIO are required. The ESP82xx device may not have enough free GPIO to support all the shutter connections required. A GPIO expander such as a PCF8574 or [MCP230xx](MCP230xx) can be used.

Using manual operation `Switch<x>` pairs may require setting `SwitchMode<x> 4` (inverse follow) for proper switch behavior.

## Pulse Motor Support
There are shutters that have two relays but only need a pulse to start or stop. Depending on the current situation a pulse will stop the shutter or send it into a specific direction. To use these kinds of shutters a [`PulseTime`](Commands#pulsetime) must be defined on each relay. The minimum setting that seems to make it work consistently is `2`. A setting of `1` does not work. If the shutter moves too fast and does not react to a stop command, increase the setting to `3` or `4`. 

## Stepper Motor Support
You can also use the favourite NEMA stepper motors to operate your shutters and blinds. You have to configure them very similar to the  Circuit Safe (Shuttermode 1) configuration. To operate the NEMA you need a stepper driver module. The A4988 are very vamous. The most important pins of thisboard are: EN (enable), DIR (direction), STP (Stepper) for input. We use EN and DIR as RELAY1i and RELAY2. Please be aware to use the INVERSE relay for the enable. To send the STP Signal we will define a PWM on the next GPIO. You number of the PWM, e.g. PWM1 must match to the number of the shutter. e.g. shutter1. You cannot use any other PWM devices on the same ESP, when using the stepper motor because I need to work with the frequency. This is a global variable for all PWM ports. Last not least we need on the next GPIO a COUNTER1. This is for measuring the steps and send the stepper to the correct position. COUNTER1 must be connected to PWM1. If not your device will run forever.

Example configuration:
 - D1: Relay1i  = EN
 - D2: Relay2   = DIR
 - D3: PWM1     = STP
 - D4: COUNTER1 = connected to D3/PWM1

`shutteropenduration` must be same as `shuttercloseduration`. There is a soft start of 0.5sec. After first Open/Close the operation is automatically fine tuned and the fine positioning at the end of the movement gets shorter.

If you want to define a second or more shutters the definition must be similar to this one.
 - D5: Relay3i  = EN
 - D6: Relay4   = DIR
 - D7: PWM2     = STP
 - D8: COUNTER2 = connected to D7/PWM2
 
 and `ShutterRelay2 3`.
 
 Please be aware that you cannot move more than ONE shutter at the time. The used PWM frequency control is globally

## Calibration
[Shutter calibration video tutorial](https://www.youtube.com/watch?v=Z-grrvnu2bU)  

- Set the `ShutterOpenDuration<x>` to the time the shutter needs to open completely.
- Set the `ShutterCloseDuration<x>` at least to the time the shutter needs to close completely. If the shutter does not close completely or runs too long, the calibration point of a closed shutter can be defined with `ShutterSetClose<x>`. Move the shutter to the close position and execute `ShutterSetClose<x>` command. `ShutterPosition<x>` will be reset to 0 (`ShutterClose<x>`).
- Set the 50% open position of the shutter. Some shutters need some time from totally closed until they begin moving the bottom-most part and opening. This often results a shutter that is less than 50% open when the shutter has been operating for 50% of the set duration. This can be corrected by using `ShutterSetHalfway<x>`. Use this procedure to calibrate the half-open position:
  1. `ShutterClose<x>` (confirm that the shutter is completely closed)
  2. `ShutterSetHalfway<x> 50` (reset to default)
  3. Move the shutter to actual 50% open position.
  4. `ShutterPosition<x>` and record the value (e.g., 63)
  5. `ShutterClose<x>`
  6. `ShutterSetHalfway<x> 63` (using the value from step #4 above)
  7. `Restart 1`

### Increasing Calibration Granularity
If you desire that the %-opening closely match what `ShutterPosition<x>` and web UI indicate, there is a granular calibration matrix available. Ensure that `ShutterClose<x>` and `ShutterOpen<x>` moves the shutter more or less to the limit positions and follow this procedure:
- `ShutterSetHalfway<x> 50` (reset to default)
- `ShutterCalibration<x> 30 50 70 90 100`
- `Restart 1`
- `ShutterClose<x>`
- Now move the shutter to each of the following positions and measure the opening for each. 
  - `ShutterPosition<x> 30` (e.g., measurement = `15`)
  - `ShutterPosition<x> 50` (e.g., measurement = `50`)
  - `ShutterPosition<x> 70` (e.g., measurement = `100`)
  - `ShutterPosition<x> 90` (e.g., measurement = `150`)
  - `ShutterPosition<x> 100` (e.g., measurement = `180`)
- Now enter the measurements as the calibration:
  `ShutterCalibration<x> 15 50 100 150 180`

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
- If the shutter uses a pulse motor instead of a motors with one wire for each direction (i.e., duration based), define `PulseTime<x> 2` on both relays. The driver's behavior will change to a pulse motor that needs pulses to start and stop.  

### Rules
Tasmota rule triggers:  
- `Shutter<x>#Position`
- `Shutter<x>#Open` and `Shutter<x>#Close`
- `Shutter#Moving` is triggered every second if the shutter is moving
- `Shutter#Moved` is triggered ONCE after the shutter stopped

If more than one shutter is configured, it is not possible to know which shutter is moving.

Examples:  
- Publish a message with the position of the shutter:
  `Rule1 ON Shutter1#Position DO Publish status/%topic%/level {"%value%"} ENDON`

- Open/Close or set a specific position for a shutter. This example drives the second shutter to the same position as the first shutter:  
  `Rule1 ON Shutter1#Position DO ShutterPosition2 %value%" ENDON`

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
    position_topic: "stat/sonoff-cletto/SHUTTER1"
    tilt_min: 0
    tilt_max: 100
    tilt_closed_value: 0
    tilt_opened_value: 100
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
