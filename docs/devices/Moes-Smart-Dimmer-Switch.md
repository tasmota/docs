This is a nice device, which is a 0(?)-220W led dimmer, with wifi! I've modded it with an ESP-12E.

I followed the guide at https://community.home-assistant.io/t/treatlife-dual-outlet-indoor-dimmer-plug-wb3s-to-esp-12-transplant/256798. 

In case that guide isn't online anymore, here's a textual summary:

- Replace WB3S with ESP-12E
- Bridge GND with GPIO15 (right next to each other) in order to allow ESP to boot

```
Module 54
Backlog TuyaMCU 21,2; SetOption20 1; SetOption54 1
Backlog TuyaSend2 3,100; DimmerRange 10,1000
SetOption97 1
```

I've replaced the bridge (GND -> GPIO15) with a 10k smd resistor.

Dimmer seems to work perfectly!

Text on the PCB:
```
EDM-03AA-EU KER_V1.4
2037
```

Text on the back of the case:
```
MOES
Smart Dimmer Switch
Model NO: EDM-1WAA-EU
Input: 220V AC 50Hz
Output: 220W LED/CFL
300W Incandescent
Indoor Dry 
Location 
Use Only
```

Product link: https://www.moeshouse.com/products/new-wifi-smart-rotary-light-dimmer-switch-schedule-timer-brightness-memory-eu?variant=39456089309265
