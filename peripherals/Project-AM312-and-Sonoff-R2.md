This use case represents a method to use AM312 as a "wave hand toggle" (for under-cabinet kitchen LED). Please note that this solution isn't working in 100% (this sensor has a detection range of a few meters, to decrease the range you can remove the lens from the sensor but still it will pick up movement from 50 cm. You can create the Tasmota rule that will disable AM312 toggle action when the light is on and turn off the power after a few minutes. The gesture sensor [APDS-9960](peripherals/APDS-9960) should work better for "hand-wave" toggle.


#### Wiring for Sonoff Basic R2

As the R2 version doesn't have GPIO14 exposed you can use [GPIO3 (RX)](https://www.youtube.com/watch?v=yavDqDzRdUk&t=139) as the AM312 data pin. GPIO2 goes high during the boot (it would toggle the switch then).

|AM312       | ESP8255 device     |
|-----------:|:-------------------|
|        VCC | 3V3 or VCC         |
|       VOUT | GPIO3 (RX)         |
|        GND | GND                |

Remember to remove the lens to lower the sensitivity of the sensor.

#### Configuration the module

1. Go to IP of the device, next _Configuration --> Configure Module -->_ set "GPIO3 Serial In" to "Switch1 (9)"
2. Go to _Console_ and type _"[SwitchMode 4](Commands#switchmode)"_ ([detailed description of SwitchModes](Buttons-and-Switches#switchmode)) to enable toggle switch type.
3. Set rule to turn off light after X amount of seconds (mentioned workaround):
```
rule1 on Switch1#State=2 do backlog Power1 1; RuleTimer1 180 endon on Rules#Timer=1 do backlog Power1 0 endon
rule1 1
```

Rule explanation:
``Switch1#State=2`` - fire the event when switch1 is toggled, 
``Power1 1`` - turn on power, 
``RuleTimer1 180`` - set Timer1 to 180 seconds and start counting, 
``Rules#Timer=1`` - fire the event when Timer1 has stopped, 
``Power1 0`` - turn off power.

This rule will turn off the light after 3 minutes, if the movement will be detected prior, the timer will be restarted and will count the time from the beginning.

4. Instead of point 3, you can set below rules in order to ignore the second and next movements. It will just turn off the power after 3 minutes.
```
rule1 on Switch1#State=2 do backlog Power1 1; RuleTimer1 180; Rule1 0; Rule2 1 endon
rule2 on Rules#Timer=1 do backlog Power1 0; Rule1 1; Rule2 0 endon on Switch1#State=2 do break
backlog rule1 1; rule2 0
```

Rules explanation:
``rule1 on Switch1#State=2 do backlog Power1 1; RuleTimer1 180; Rule1 0; Rule2 1 endon``:
``Switch1#State=2`` - fire the event when switch1 is toggled, 
``Power1 1`` - turn on power, 
``RuleTimer1 180`` - set Timer1 to 180 seconds and start counting, 
``Rule1 0`` - disable Rule1, 
``Rule2 1`` - enable Rule2.

``rule2 on Rules#Timer=1 do backlog Power1 0; Rule1 1; Rule2 0 endon on Switch1#State=2 do break``:
``Rules#Timer=1`` - fire the event when Timer1 has stopped
``Power1 0`` - turn off power
``Rule1 1`` - enable Rule1
``Rule2 0`` - disable Rule2
``Switch1#State=2 do break`` - ignore toggling

