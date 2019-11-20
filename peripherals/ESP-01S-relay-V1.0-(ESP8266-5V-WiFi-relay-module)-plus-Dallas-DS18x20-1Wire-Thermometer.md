!!! WARNING !!! 

BEWARE OF MANY VISUALLY SIMILAR BOARDS TO THIS RELAY BOARD but different schematics (see photos below).

![ESP 01S top](https://lh5.googleusercontent.com/kSDkBFfpdNcLwom779OjfglL2mC9J7knu0cCNJSYdxuNfqTdNpPBmZObb0-545w4vffLdsCm1UF6aCjYA28MxPcoCXH_wnt01mCyL5QJ)
![](https://lh5.googleusercontent.com/I9m2z-Gv8KAu97Vt6VHS3rhXoisia_dfUOvnJiHtPMEgODr_fhBRB9r11AcmVjdfD5MktheObivTyU853afK3sDQbcu3JOQqofmJezHM)
![](https://lh6.googleusercontent.com/3O1goVGD49mJnNyJXTVHirSN17dCTRPUmoQ4mr5UAiN3w6WV-DtlviwNK6aUAcEIVpwYyD0wV65z8yrAB26C37rE6IfvFEyjgU0RnH_i)

When I have received this module from Aliexpress (US $2.09 including ESP-01S), it was not working (I have found other people had the same issue)
There are two culprits of this:
* "CH_PD" is not set to HI (3.3V) as actually required. Usually this is done with a 10K resistor or directly to 3.3V, I have connected directly to the 3.3V
* The resistor R2 (10k) which is connected between the terminal GPIO0 to ground. This ensures that the GPIO0 is always pulled to ground, which actually places the ESP-01 in program mode (flashing). **To make the module working it is necessary to remove (solder out) the R2.**

After soldering out (removing) R2, the module ran smoothly and flashing Tasmota firmware was easy:

` esptool.py --port /dev/ttyUSB0 write_flash -fs 1MB -fm dout 0x0 tasmota.bin
`

Connect DS18B20 to the GPIO2 (see diagram below - **soldering not necessary**, it is possible to put the wires and the resistor directly in to the female part of the connector together with ESP 01S module pins)

After flashing, set up Tasmota (see images below):
* "Generic module"
* GPIO0 as Relay1 (21)
* GPIO2 as DS18x20(4) 

Retrieving the temperature via HTTP 

`http://tasmota-ip/cm?user=<USER>&password=<PASS>&cmnd=status%2010`

The temperature information will put published by MQTT to the
tele/<SONOFFDEVICE>/SENSOR in the format of:

`"Time":"2018-06-14T07:56:34","DS18B20":{"Temperature":21.9},"TempUnit":"C"}`

Setting interval at which the sonoff will report it's status: 
Display current interval: TelePeriod
Set interval: TelePeriod <seconds>
You can change PulseTime by typing `PulseTime 30` in the Console at the Tasmota Webinterface.

