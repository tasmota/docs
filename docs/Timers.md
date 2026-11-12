!!! info "Timers allow you to automate your device based on time triggers"

To control a device locally 16 timers are programmable. They can be configured with the `Timer<x>` command followed by a JSON payload with optional parameters. For example:

Timer 1 will ENABLE output of POWER1 at exactly 2:23 every Tue/Wed and Sat
```haskell
Timer1 {"Enable":1,"Time":"02:23","Window":0,"Days":"--TW--S","Repeat":1,"Output":1,"Action":1}
```

Timer 4 will TOGGLE output of POWER2 within a 30 minute window centered around 16:23 each Sunday, Monday, Thursday and Friday and will disable (disarm) after executing.
```haskell
Timer4 {"Enable":1,"Time":"16:23","Window":15,"Days":"SM00TF0","Repeat":0,"Output":2,"Action":2}
```

When `Mode 1` or `Mode 2` is used, `Latitude` and `Longitude` are required. In that case the `Time` value is **always** used as an offset from sunrise or sunset, so make sure to set it to `00:00` if no offset is wanted. Timer 1 will ENABLE output of POWER1 2 hours and 23 minutes before sunset every day of the week.
```haskell
Timer1 {"Enable":1,"Mode":2,"Time":"-2:23","Window":0,"Days":"11TW11S","Repeat":1,"Output":1,"Action":1}
```

### Commands
Command|Parameters
:---|:---
Latitude<a id="Latitude"></a>|`<value>` = set latitude
Longitude<a id="Longitude"></a>|`<value>` = set longitude
Sunrise<a id="Sunrise"></a>|Sunrise/Sunset type<br>`0` = Normal (default)<br>`1` = Civil<br>`2` = Nautical<br>`3` = Astronomical<br>*introduced in version 12.1.1.5*
Timers<a id="Timers"></a>|Timers control<br>`0` = disable all timers&emsp;  » v6.2.0<BR>`1` = enable all timers<BR>`2` = toggle all timers<BR>
Timer<x\><a id="Timer"></a>|Parameters for Timer<x\> where x = `1..16`<BR>`0` = clear parameters for Timer<x\>&emsp;  » v6.2.0<BR>`1..16` = copy Timer<y\> parameters to Timer<x\><BR>`{ "name":value ; .. }` = set all or individual parameters using JSON payload with names and values of data pairs from the table below

### JSON Payload Anatomy
JSON Name|JSON Value
:---|:---
Enable|`0` = disarm or disable timer<BR>`1` = arm or enable timer
Mode|`0` = use clock time<BR>`1` = Use local sunrise time using `Longitude`, `Latitude` and `Time` offset<BR>`2` = use local sunset time using `Longitude`, `Latitude` and `Time` offset
Time|*When `Mode 0` is active*<BR>>&ensp;`hh:mm` = set time in hours `0 .. 23` and minutes `0 .. 59`<BR>*When `Mode 1` or `Mode 2` is active*<BR>>&ensp;`+hh:mm` or `-hh:mm` = set offset in hours `0 .. 11` and minutes `0 .. 59` from the time defined by sunrise/sunset.
Window|`0..15` = add or subtract a random number of minutes to `Time`
Days|`SMTWTFS` = set day of weeks mask where `0` or `-` = OFF and any different character = ON
Repeat|`0` = allow timer only once<BR>`1` = repeat timer execution
Output|`1..16` = select an output to be used if no rule is enabled
Action|`0` = turn output OFF<BR> `1` = turn output ON<BR>`2` = TOGGLE output<BR>`3` = RULE/BLINK<br>If the Tasmota [Rules](Rules) feature has been activated by compiling the code (activated by default in all pre-compiled Tasmota binaries), a rule with `Clock#Timer=<timer>` will be triggered if written and turned on by the user.<br>If Rules are not compiled, BLINK output using [BlinkCount](Commands.md#blinkcount) parameters.
  
### Sunrise
In order to set a timer to use the automatically calculated sunrise or sunset time, the latitude and longitude of the location as decimal degrees needs to be entered using the respective commands.
  
By default, Tasmota calculates the times of the actual sunrise and sunset. Starting with version 12.1.1.5, it is possible instead to use the beginning and ending times of civil, nautical or astronomical twilight. In particular, civil twilight is the period of time when the sun is below the horizon, but artificial lighting is not yet needed.
