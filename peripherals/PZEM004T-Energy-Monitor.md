<img src="https://github.com/arendst/arendst.github.io/blob/master/media/pzem/pzem-done.jpg?raw=true" width="250" align="right" />
The PZEM-004T together with a Sonoff Basic provide a good clamp on energy monitor.

## Parts needed
- Sonoff Basic
- PZEM-004T
- Resistor 1k
- [Enclosure](https://www.itead.cc/smart-home/sonoff-ip66.html)
- Power cable

## Preparation
Install Tasmota on the Sonoff Basic and confirm it is functional before connecting the PZEM-004T to its serial interface.

## Hardware connections
As the PZEM-004T expects 5V serial data and the Sonoff Basic only provides up to 3V3, the expected optocoupler input power of the PZEM-004T has to be reduced. This can be accomplished by soldering a 1k resistor between the joints shown below (modification works for version v.1.0 and v.3.0).

PZEM-004T v.1.0  
<img src="https://github.com/arendst/arendst.github.io/blob/master/media/pzem/pzem-fix.jpg?raw=true" height="400" />

PZEM-004T v.3.0  
<img src="https://user-images.githubusercontent.com/34340210/63592015-8508ac00-c57e-11e9-9e20-2b41b2662161.jpeg" height="400" />
<img src="https://user-images.githubusercontent.com/34340210/63591794-cf3d5d80-c57d-11e9-9945-eb062bebf71b.jpeg" height="400" />

Connect the serial interface of the Sonoff Basic with the serial interface of the PZEM-004T. See pictures regarding used colors and connections.

- 3V3/5V Red
- Rx Yellow
- Tx Green
- Gnd Grey

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/pzem/pzem-basic.png" height="400" />

_(Image re-used from https://www.instructables.com/id/Use-Homie-Firmware-to-Drive-Sonoff-Switch-Module-E/ Thanks @amayii0)_


As the PZEM004T is functioning better on 5V, it can be obtained from the Voltage regulator as shown in this image.
<img src="https://camo.githubusercontent.com/f014130fdde36f97f37a5af20fc223621b192e1b/687474703a2f2f74696e6b65726d616e2e6361742f77702d636f6e74656e742f75706c6f6164732f323031362f30362f70696e6f75745f6261636b2e6a7067" height="400" />

Cut the power cable in two and connect the input wires to both Sonoff Basic and PZEM-004T. Route one of the power output wires through the PZEM-004T core and connect the output wires to the Sonoff Basic output.

As most parts are connected to high voltage AC it is recommended to fit the hardware in a solid enclosure.

## Software configuration
Configure the GPIO's for hardware serial connection as shown below.

**IMPORTANT: If using the connections as following, the communication works in all cores due to TASMOTA using hardware serial. If the user wants to use other GPIOs for communication, TASMOTA will emulate a serial interface using software serial. This feature does not work using core 2.3.0 due to insufficient RAM. To use the software serial feature, you must use a core version of 2.4.2 or greater.**

[Device Template](Templates)<BR>
**PZEM-004T version prior to V3:**

`{"NAME":"HW-655 PZEM","GPIO":[0,62,0,63,0,0,0,0,0,0,0,0,0],"FLAG":0,"BASE":1}`


**PZEM-004T version V3:**

`{"NAME":"HW-655 PZEM","GPIO":[0,62,0,98,0,0,0,0,0,0,0,0,0],"FLAG":0,"BASE":1}`


## Calibration
[Per Theo](https://github.com/arendst/Tasmota/issues/3208#issuecomment-405048466) - As the PZEM is a dedicated energy monitor, device calibration in TASMOTA is currently not supported.
