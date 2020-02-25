!> **This feature is not included in precompiled binaries.**     
To use it you must [compile your build](Compile-your-build.md). Add the following to `user_config_override.h`:
```
#ifndef USE_SHUTTER
#define USE_SHUTTER           // Add Shutter support (+6k code)
#endif
```

Stepper motors can be used to operate shutters and blinds. The configuration is very similar to the  Circuit Safe (Shuttermode 1) configuration. To operate a stepper motor requires driver module such as the A4988 and uses EN (enable), DIR (direction), STP (Stepper) for controls. If everything is defined correctly the shuttermode 3 will be reported at boot time.

Tasmota supports a maximum of four shutters with one stepper motor per shutter simultanously. In very rare conditions where two or more shutters simoultanously move the last mm it can happen than one shutter moves to far.   

- Full description of [Blinds and Shutters](Blinds-and-Shutters.md)  
- Complete list of [Blinds, Shutters and Roller Shades Commands](Commands.md#blinds-shutters-and-roller-shades)  
- Stepper motor and Stepper drivers [wiring diagrams](#wiring-diagrams)  
- Stepper drivers configuration tutorials:  
  - [A4988](https://lastminuteengineers.com/a4988-stepper-motor-driver-arduino-tutorial/)
  - [DRV8825](https://lastminuteengineers.com/drv8825-stepper-motor-driver-arduino-tutorial/)
  - [TMC2208](https://wiki.fysetc.com/TMC2208/)  
- Modifying a 28BYJ-48 12V stepper motor from unipolar to bipolar [tutorial](https://coeleveld.com/wp-content/uploads/2016/10/Modifying-a-28BYJ-48-step-motor-from-unipolar-to-bipolar.pdf)  
- [Bill of Materials](#Bill-of-materials)  

## Example configuration  
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

## Configuration for additional shutters  
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


## Wiring Diagrams  
### One Shutter  
![411](https://raw.githubusercontent.com/TrDA-hab/blinds/master/images/A4988%20v411.jpg ":size=200px")
- Diagram v412: simple universal setup. For example, the control of horizontal curtain or vertical shutters, blinds adjuster or window opener, pet feeders, opening of a water tap for watering the lawn, rotating table for subject photography, opening the ventilation flap, PTZ camera, 3D Scanner Table, linear Actuator.  
![412](https://raw.githubusercontent.com/TrDA-hab/blinds/master/images/A4988%20v412.jpg ":size=200px")
- Diagram v414: parallel setup is to run two parallel steppers motors from the same controller. For example, to control a large and heavy hanging screen for an LCD projector, or two curtains at once on one large window.  
![414](https://raw.githubusercontent.com/TrDA-hab/blinds/master/images/A4988%20v414.jpg ":size=200px")
- Diagram v416: minimum setup size. For example, for small curtains located in a limited space.  
![416](https://raw.githubusercontent.com/TrDA-hab/blinds/master/images/A4988%20v416.jpg ":size=200px")

### 2 Shutters  
![421](https://raw.githubusercontent.com/TrDA-hab/blinds/master/images/A4988%20v421.jpg ":size=200px")
- Diagram v422: parallel setup is to run two shutters and independent control of two stepper motors from one controller. For example, to control two independent curtains.  
![422](https://raw.githubusercontent.com/TrDA-hab/blinds/master/images/A4988%20v422.jpg ":size=200px")
- Diagram v424: big parallel setup is to run two shutters and independent control of two pairs of stepper motors from one controller. For example, to control four curtains on one very large window.  
![424](https://raw.githubusercontent.com/TrDA-hab/blinds/master/images/A4988%20v424.jpg ":size=200px")

## Bill of Materials  
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
