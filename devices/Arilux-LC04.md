# Arilux AL-LC04 (WIFI Smart RGBW Controller With 24-key IR Remote, Working Voltage: DC 9-12V, Output Current: RGBW, 4*4A)

These devices can be configured as "generic module" with this GPIO configuration:
* GPIO04 = [51] IRrecv
* GPIO05 = [38] PWM2 (G)
* GPIO12 = [39] PWM3 (R)
* GPIO14 = [37] PWM1 (B)
* GPIO13 = [40] PWM4 (W) [Only for RGBW-Stripe]

A later version has been found to use the following configuration:
* GPIO04 = [51] IRrecv
* GPIO05 = [38] PWM2 (G)
* GPIO13 = [39] PWM3 (R)
* GPIO12 = [37] PWM1 (B)
* GPIO15 = [40] PWM4 (W) [Only for RGBW-Stripe]

Note: as of #5523 IRCodes are now 64 bits.

Copy this Code to your console to use the 24 Button IR Remote

```
rule1
on IrReceived#Data=0x00FFB04F do power1 on endon
on IrReceived#Data=0x00FFF807 do power1 off endon
on IrReceived#Data=0x00FF906F do dimmer + endon
on IrReceived#Data=0x00FFB847 do dimmer - endon
on IrReceived#Data=0x00FFB24D do scheme 0 endon
on IrReceived#Data=0x00FF00FF do scheme 4 endon
on IrReceived#Data=0x00FF58A7 do scheme 2 endon
on IrReceived#Data=0x00FF30CF do scheme 3 endon
```

```
rule2
on IrReceived#Data=0x00FF9867 do color2 #FF0000 endon
on IrReceived#Data=0x00FFE817 do color2 #470D00 endon
on IrReceived#Data=0x00FF02FD do color2 #381600 endon
on IrReceived#Data=0x00FF50AF do color2 #331E00 endon
on IrReceived#Data=0x00FF38C7 do color2 #332800 endon
on IrReceived#Data=0x00FFD827 do color2 #00FF00 endon
on IrReceived#Data=0x00FF48B7 do color2 #00330A endon
on IrReceived#Data=0x00FF32CD do color2 #003314 endon
on IrReceived#Data=0x00FF7887 do color2 #00331E endon
```

```
rule3
on IrReceived#Data=0x00FF28D7 do color2 #003328 endon
on IrReceived#Data=0x00FF8877 do color2 #0000FF endon
on IrReceived#Data=0x00FF6897 do color2 #0A0033 endon
on IrReceived#Data=0x00FF20DF do color2 #140033 endon
on IrReceived#Data=0x00FF708F do color2 #140033 endon
on IrReceived#Data=0x00FFF00F do color2 #280033 endon
on IrReceived#Data=0x00FFA857 do color2 #FFFFFF endon
```

and then activate the rules

`Backlog rule1 1; rule2 1; rule3 1`

[Learn more about Arilux devices](devices/MagicHome-with-ESP8285)
