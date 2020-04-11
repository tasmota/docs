# AHT1x temperature and humidity sensor
!!! info "This feature is included only in tasmota-sensors.bin" 

Otherwise you must [compile your build](Compile-your-build). Add the following to `user_config_override.h`:
```
#ifndef USE_AHT1x
#define USE_AHT1x       // [I2cDriver43] Enable AHT10/15 humidity and temperature sensor (I2C address 0x38) (+0k8 code)
#endif
```
----

AHT10 or AH15 are an I<sup>2</sup>C temperature and humidity sensor.

## Configuration

!!! failure "This sensor is incompatible with other I^2^C devices on I^2^C bus"
    Sensor datasheet implicitly says:
    **Only a single** AHT10 can be connected to the I^2^C bus and no other I^2^C devices can be connected.

### Wiring
| AHT1x   | ESP8266 |
|---|---|
|VCC   |3.3V
|GND   |GND   
|SDA   | GPIOx
|SCL   | GPIOy

The driver currently only allows the use of a single LM75AD sensor on any of the addresses configurable through pins A0, A1 and A2. These are conveniently broken out on the breakout board either as pins or as solderable joints as can be seen on the example breakout board.

### Tasmota Settings 
In the **_Configuration -> Configure Module_** page assign:

1. GPIOx to `I2C SDA (6)`
2. GPIOy to `I2C SCL (5)`

After a reboot the driver will detect AHT1x automatically and display sensor readings.

![webUI readout](_media/peripherals/aht1x-readout.jpg)

and in MQTT topic (according to TelePeriod):    
```
{"Time":"2020-01-01T00:00:00","AHT1X-0x38":{"Temperature":24.7,"Humidity":61.9,"DewPoint":16.8},"TempUnit":"C"}
```


### Breakout Boards

![AHT10](_media/peripherals/AHT10.jpg)![AHT15](_media/peripherals/AHT15.jpg)

[AHT10 Datasheet](https://server4.eca.ir/eshop/AHT10/Aosong_AHT10_en_draft_0c.pdf)    
[AHT15 Datasheet](https://wiki.liutyi.info/download/attachments/35291280/Aosong_AHT15_en_draft_0.pdf?version=1&modificationDate=1563622682730&api=v2)
