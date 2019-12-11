## Description of the settings step by step, to configure Shutter and the Stepper motor.    
**AAAAAAAAA:**  
1.  
2.  For connnections Stepper motor ans Stepper drivers use [Wiring diagrams](#wiring-diagrams)  

**For more information:**  
1.  To use it you must [compile your build](Compile-your-build.md).  
2.  Full description of working with Shutteris available at [Blinds and Shutters](Blinds-and-Shutters.md).  
2.  Complete list of commands is available at [Blinds, Shutters and Roller Shades Commands](Commands.md#blinds-shutters-and-roller-shades).  
4. ///

***NOTE:***  
 - the connection of the COUNTER is mandatory, or the ESP will always freeze.  
 - a maximum of four shutters per device are supported (1 shutters = 1 stepper motor).  
 - a `shutteropenduration<x>` must be same as `shuttercloseduration<x>`.  
 - if you use >1 stpper motor cofiguration, you must use the same combination of stepper drivers and stepper motors, and only one stepper motor can work at a time.  

## SHUTTER1.
Example configuration:  
 - D1: Relay1i  = EN  
 - D2: Relay2   = DIR  
 - D3: PWM1     = STP  
 - D4: COUNTER1 = connected to D3/PWM1   

**a) Enable SHUTTER support**  
 `SetOption80 1`   //for all Shutters 

**b) Setting for work ShutterMode 1**  
  `Backlog PulseTime1 0; PulseTime2 0`   // for relay Relay1i and Relay2  
  `Interlock OFF`                        // for all relay  

**c) Restart ESP**  
  `restart 1`

**d) Test work ShutterMode 1**  
  `ShutterRelay1 1`   // for relay Relay1i and Relay2

**e) Test work STEEPR1**  
  `ShutterOpen1`   
  `ShutterStop1`      // to stop the STEEPR1  
  `ShutterClose1`  
  `ShutterInvert1`    // to change the direction of rotation of the STEEPR1  

**f) Setting the speed of the stepper motor (optional settings)**  
  `ShutterFrequency 1500`  // this is a global variable for all steppers (1000rpm by default)

**g) Next steps, perform the calibration as written on the Wiki.**  


## SHUTTER2.
Example configuration:  
 - D6: Relay3i  = EN  
 - D6: Relay4   = DIR  
 - D7: PWM2     = STP  
 - D8: COUNTER2 = connected to D7/PWM2   

***NOTE: the connection of the COUNTER is mandatory, or the ESP will always freeze.***

**a) Setting for work ShutterMode 1**  
  `Backlog PulseTime3 0; PulseTime4 0`   // for relay Relay1i and Relay2  

**b) Restart ESP**  
  `restart 1`

**c) Test work ShutterMode 1**  
  `ShutterRelay2 3`   // for relay Relay3i and Relay4

**d) Test work STEEPR2**  
  `ShutterOpen2`  
  `ShutterStop2`     // to stop the STEEPR2  
  `ShutterClose2`  
  `ShutterInvert2`   // to change the direction of rotation of the STEEPR2  
  
**e) Next steps, perform the calibration as written on the Wiki.**  

## Wiring Diagrams  
### SHUTTER1: (pic. v4.1.1 and v4.1.2)  
![411](https://github.com/TrDA-hab/blinds/blob/master/images/A4988%20v411.jpg ":size=200px")
![411](https://github.com/TrDA-hab/blinds/blob/master/images/A4988%20v412.jpg ":size=200px")

### SHUTTER2: (pic. v4.1.1 and v4.1.2)  
![411](https://github.com/TrDA-hab/blinds/blob/master/images/A4988%20v421.jpg ":size=200px")
![411](https://github.com/TrDA-hab/blinds/blob/master/images/A4988%20v422.jpg ":size=200px")
