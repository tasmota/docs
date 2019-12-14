!> **This feature is not included in precompiled binaries.**     
To use it you must [compile your build](Compile-your-build.md). Add the following to `user_config_override.h`:
```
#ifndef USE_SHUTTER
#define USE_SHUTTER           // Add Shutter support (+6k code)
#endif
```

Stepper motors can be used to operate shutters and blinds. The configuration is very similar to the  Circuit Safe (Shuttermode 1) configuration. To operate a stepper motor requires driver module such as the A4988 and uses EN (enable), DIR (direction), STP (Stepper) for controls.  

Tasmota supports a maximum of four shutters with one stepper motor per shutter. Each stepper connected to a Tasmota device must use the **same** stepper driver and motor. **You cannot move more than one shutter _concurrently_.**  

- Full description of [Blinds and Shutters](Blinds-and-Shutters.md).  
- Complete list of [Blinds, Shutters and Roller Shades Commands](Commands.md#blinds-shutters-and-roller-shades).  
- Stepper motor and Stepper drivers [wiring diagrams](#wiring-diagrams).  
- Stepper drivers configuration tutorials:  
  - [A4988](https://lastminuteengineers.com/a4988-stepper-motor-driver-arduino-tutorial/)
  - [DRV8825](https://lastminuteengineers.com/drv8825-stepper-motor-driver-arduino-tutorial/)
  - [TMC2208](https://wiki.fysetc.com/TMC2208/).  
- Modifying a 28BYJ-48 12V stepper motor from unipolar to bipolar [tutorial](https://coeleveld.com/wp-content/uploads/2016/10/Modifying-a-28BYJ-48-step-motor-from-unipolar-to-bipolar.pdf).  
- Stepper Motor Control Development Boards to create your prototype controls circuit:  
  - [x1](https://aliexpress.com/item/32908836265.html)
  - [x2](https://aliexpress.com/item/32870732179.html)  

## Example configuration  
`EN` and `DIR` are on `Relay1i` and `Relay2` respectively. Please be aware to use the **inverse** relay for the enable signal.  

The `STP` signal is assigned as a `PWM<x>` component where `<x>` matches the number of the shutter (e.g., `PWM1` for `Shutter1`). The shutter feature adjusts the PWM frequency to operate the motor for proper shutter operation. The stepper motor frequency setting is a global setting all PWM components on the device. This means that all shutters on the device will operate at the same speed. Therefore no PWM devices other than shutters can be connected to the same Tasmota device.  

The frequency of the PWM can be changed from 1000Hz to any value up to 10,000Hz. The command `ShutterFrequency` globally changes this. Be aware that most 12V operated motors cannot work faster than 2,000Hz. 5,000Hz is possible by increasing the supplied voltage to 24V. The maximum voltage of the A4988 is 36V.

Finally a GPIO **must** be assigned as `Counter1`. This counter is used to keep track of the steps and send the stepper to the correct position. The `Counter1` GPIO must be connected to the `PWM1` GPIO. Otherwise the stepper and your shutter will run continually or freeze up randomly.

Only **bipolar** stepper motors may be used (see above).  

You must properly configure the stepper motor driver (see above).

`ShutterOpenDuration` must be same as `ShutterCloseDuration`.  

You can define a soft start/stop by defining a `ShutterMotorDelay`. This causes the driver to ramp the speed up and down during the defined duration.

Wemos Pin|GPIO|Component|Stepper Signal
:-:|:-:|:-:|:-:
D1|5|Relay1i|EN
D2|4|Relay2|DIR
D3|0|PWM1|STP
D4|2|Counter1|STP

**a) Enable SHUTTER support**  
   `SetOption80 1`   // this is a global variable for all Shutters 

**b) Setting for work ShutterMode 1**  
   `Backlog PulseTime1 0; PulseTime2 0`   // for relay Relay1i and Relay2  
   `Interlock OFF`                        // this is a global variable for all Relays  

**c) Restart ESP**  
   `restart 1`

**d) Test work ShutterMode 1**  
   `ShutterRelay1 1`   // for relay Relay1i and Relay2

**e) Test work STEPPER1**  
   `ShutterOpen1`   
   `ShutterStop1`      // to stop the STEPPER1  
   `ShutterClose1`  
   `ShutterInvert1`    // to change the direction of rotation of the STEPPER1  

**f) Setting the speed of the stepper motor (optional settings)**  
   `ShutterFrequency 1500`  // this is a global variable for all steppers (1000rpm by default)

**g) Next steps, perform the calibration as written on the [Wiki](Blinds-and-Shutters.md#calibration).**    

## Configuration for additional shutters  
You must first set up the first shutter and only then the next.  

Wemos Pin|GPIO|Component|Stepper Signal
:-:|:-:|:-:|:-:
D5|14|Relay3i|EN
D6|12|Relay4|DIR
D7|13|PWM2|STP
D8|15|Counter2|STP

**a) Setting for work ShutterMode 1**  
  `Backlog PulseTime3 0; PulseTime4 0`   // for relay Relay3i and Relay4  

**b) Restart ESP**  
  `restart 1`

**c) Enable ShutterRelay2 and test work ShutterMode 1**  
  `ShutterRelay2 3`   // for relay Relay3i and Relay4

**d) Test work STEPPER2**  
  `ShutterOpen2`  
  `ShutterStop2`     // to stop the STEPPER2  
  `ShutterClose2`  
  `ShutterInvert2`   // to change the direction of rotation of the STEPPER2  
  
**e) Next steps, perform the calibration as written on the [Wiki](Blinds-and-Shutters.md#calibration).**    

## Wiring Diagrams  
### SHUTTER1: (pic. v4.1.1 and v4.1.2)  
![411](https://github.com/TrDA-hab/blinds/blob/master/images/A4988%20v411.jpg?raw=true ":size=200px")
![411](https://github.com/TrDA-hab/blinds/blob/master/images/A4988%20v412.jpg?raw=true ":size=200px")

### SHUTTER2: (pic. v4.2.1 and v4.2.2)  
![411](https://github.com/TrDA-hab/blinds/blob/master/images/A4988%20v421.jpg?raw=true ":size=200px")
![411](https://github.com/TrDA-hab/blinds/blob/master/images/A4988%20v422.jpg?raw=true ":size=200px")
