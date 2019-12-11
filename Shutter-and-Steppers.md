## Description of the settings step by step, to configure Shutter and the Stepper motor.    

1.  To use it you must [compile your build](Compile-your-build.md).  
2.  Full description of working with Shutteris available at [Blinds and Shutters](Blinds-and-Shutters.md).  
3.  Complete list of commands is available at [Blinds, Shutters and Roller Shades Commands](Commands.md#blinds-shutters-and-roller-shades).  
4.  For connnections Stepper motor ans Stepper drivers use [Wiring diagrams](#wiring-diagrams).  
5.  For configure your stepper drivers use:
 - [A4988](https://lastminuteengineers.com/a4988-stepper-motor-driver-arduino-tutorial/).
 - [DRV8825](https://lastminuteengineers.com/drv8825-stepper-motor-driver-arduino-tutorial/).

***NOTE 0:***  
- you can use only **bipolar** stepper motors.  
- you must use the **same combination** of stepper drivers and stepper motors.  
- you must **definitely** configure your stepper drivers.  

***NOTE 1:***  
 if you use 1 stepper motor cofiguration.  
 - if you use only one stepper motor, you must step-by-step execute the commands for SHUTTER1 only.  
 - the connection of the COUNTER is mandatory, or the ESP will always random freeze.  
 - a `shutteropenduration<x>` must be same as `shuttercloseduration<x>`.  
 
 ***NOTE 2:***  
 if you use 2 or more stepper motor cofiguration.  
 - you must step by step execute the commands first for SHUTTER1, and only then for SHUTTER2.  
 - the connection of the COUNTER is mandatory, or the ESP will always random freeze.  
 - a `shutteropenduration<x>` must be same as `shuttercloseduration<x>`.  
 - at one moment in time, only one stepping motor should work.  
 - you can use only one speed value for all stepper motors.  
 - a maximum of four shutters per device are supported (1 shutters = 1 stepper motor). 
 - a maximum configuration may contain four stepper motors (4 shutters = 4 stepper motor).  

## SHUTTER1.
Example configuration:  
 - D1: Relay1i  = EN  
 - D2: Relay2   = DIR  
 - D3: PWM1     = STP  
 - D4: COUNTER1 = connected to D3/PWM1   

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

**g) Next steps, perform the calibration as written on the Wiki.**  


## SHUTTER2.
Example configuration:  
 - D6: Relay3i  = EN  
 - D6: Relay4   = DIR  
 - D7: PWM2     = STP  
 - D8: COUNTER2 = connected to D7/PWM2   

**a) Setting for work ShutterMode 1**  
  `Backlog PulseTime3 0; PulseTime4 0`   // for relay Relay1i and Relay2  

**b) Restart ESP**  
  `restart 1`

**c) Enable ShutterRelay2 and test work ShutterMode 1**  
  `ShutterRelay2 3`   // for relay Relay3i and Relay4

**d) Test work STEPPER2**  
  `ShutterOpen2`  
  `ShutterStop2`     // to stop the STEPPER2  
  `ShutterClose2`  
  `ShutterInvert2`   // to change the direction of rotation of the STEPPER2  
  
**e) Next steps, perform the calibration as written on the Wiki.**  

## Wiring Diagrams  
### SHUTTER1: (pic. v4.1.1 and v4.1.2)  
![411](https://github.com/TrDA-hab/blinds/blob/master/images/A4988%20v411.jpg ":size=200px")
![411](https://github.com/TrDA-hab/blinds/blob/master/images/A4988%20v412.jpg ":size=200px")

### SHUTTER2: (pic. v4.1.1 and v4.1.2)  
![411](https://github.com/TrDA-hab/blinds/blob/master/images/A4988%20v421.jpg ":size=200px")
![411](https://github.com/TrDA-hab/blinds/blob/master/images/A4988%20v422.jpg ":size=200px")
