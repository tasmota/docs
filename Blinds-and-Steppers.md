
*** More information: ***

https://tasmota.github.io/docs/#/Commands?id=setoption80

https://tasmota.github.io/docs/#/Blinds-and-Shutters

https://tasmota.github.io/docs/#/Commands?id=blinds-shutters-and-roller-shades


*** Description of the settings step by step.

*** rename file user_config_override.h to user_config.h
*** insert it user_config.h
#ifndef USE_SHUTTER
#define USE_SHUTTER
#endif

*** in platformio.ini Uncomment by deleting ";"
tasmota
-DUSE_CONFIG_OVERRIDE

-----------------------------------
SHUTTER1: (pic. v4.1.1 and v4.1.2)
-----------------------------------
D1: Relay1i = EN
D2: Relay2 = DIR
D3: PWM1 = STP
D4: COUNTER1 = connected to D3/PWM1

!!! The connection of the COUNTER is mandatory, or the ESP will always freeze!!!

**Enable shutter support (SHUTTER1 is enable)**  
 -`SetOption80 1`  

**Setting for work ShutterMode 1**  
  -`Backlog PulseTime1 0; PulseTime2 0`  
  -`Interlock OFF`  

*** Restart ESP
restart 1

*** Test ShutterMode 1 (SHUTTER1 is already on)
ShutterRelay1 1

*** Setting the speed of the stepper motor.
*** (1000 by default, one frequency for all PWM)
shutterfrequency 1500 

*** TEST work SHUTTER1
ShutterOpen1 or ShutterClose1

*** Setting for SHUTTER1 (optional settings)
*** (ShutterOpenDuration==ShutterCloseDuration)
Backlog ShutterOpenDuration1 15; ShutterCloseDuration1 15; shuttermotordelay1 0.25

*** Next, perform the calibration as written on the wiki.


++++++++++++++++
optional steps
++++++++++++++++

-----------------------------------
SHUTTER2: (pic. v4.2.1 and v4.2.2)
-----------------------------------
D5: Relay3i = EN
D6: Relay4 = DIR
D7: PWM2 = STP
D8: COUNTER2 = connected to D7/PWM2

!!! The connection of the COUNTER is mandatory, or the ESP will always freeze!!!

*** Setting for work ShutterMode 1
Backlog PulseTime3 0; PulseTime4 0

*** Restart ESP
restart 1

*** Enable SHUTTER2 and test ShutterMode 1
ShutterRelay2 3

*** TEST work SHUTTER2
ShutterOpen2 or ShutterClose2

*** Setting for SHUTTER2 (optional settings)
*** (ShutterOpenDuration==ShutterCloseDuration)
Backlog ShutterOpenDuration2 15; ShutterCloseDuration2 15; shuttermotordelay2 0.25

*** Next, perform the calibration as written on the wiki.

## Wiring Diagrams
### SHUTTER1: (pic. v4.1.1 and v4.1.2)
![411](https://github.com/TrDA-hab/blinds/blob/master/images/A4988%20v411.jpg ":size=200px")
![411](https://github.com/TrDA-hab/blinds/blob/master/images/A4988%20v412.jpg ":size=200px")

### SHUTTER2: (pic. v4.1.1 and v4.1.2)
![411](https://github.com/TrDA-hab/blinds/blob/master/images/A4988%20v421.jpg ":size=200px")
![411](https://github.com/TrDA-hab/blinds/blob/master/images/A4988%20v422.jpg ":size=200px")
