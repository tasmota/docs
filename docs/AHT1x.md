# AHT1x/AHT2x and compatible temperature and humidity sensor
!!! failure "This feature is not included in precompiled binaries"  

To use it you must [compile your build](Compile-your-build). Add the following to `user_config_override.h` to add support for AHT10 or AHT15:
```
#ifndef USE_AHT1x
#define USE_AHT1x       // [I2cDriver43] Enable AHT10/15 humidity and temperature sensor (I2C address 0x38 or 0x39)
#endif
```
or those lines for AHT20 or AM2301B:
```
#ifndef USE_AHT2x
#define USE_AHT2x       Enable AHT20 instead of AHT1x humidity and temperature sensor (I2C address 0x38)
#endif
```

----

AHT10 or AH15 are an I<sup>2</sup>C temperature and humidity sensor.
AHT20 or AM2301B are upgraded versions.

## Configuration

!!! failure "This sensor is incompatible with other I^2^C devices on I^2^C bus"
    Sensor datasheet implicitly says:
    **Only a single** AHT10 can be connected to the I^2^C bus and no other I^2^C devices can be connected.
    The AHT20/AM2301B do not suffer from this problem.

### Wiring
| AHT1x   | ESP8266 |
|---|---|
|VCC   |3.3V
|GND   |GND   
|SDA   | GPIOx
|SCL   | GPIOy


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

### Troubleshooting
On some I2C sensors, like the AHT25, Tasmota might mistake the sensor for another one using the same address.
This can be resolved by disabling the unneeded drivers.

For our example AHT25, the address might get confused with the VEML6070 UV sensor. You can tell Tasmota to use the other driver by issuing the following commands in the console:

- `I2CDriver12 0` to disable the VEML driver
- `I2CDriver43 1` to enable the AHT driver

An overview of all [I2C drivers](https://tasmota.github.io/docs/I2CDEVICES/#supported-i2c-devices) is available in the docs.


### Breakout Boards

![AHT10](_media/peripherals/AHT10.jpg)![AHT15](_media/peripherals/AHT15.jpg)

[AHT10 Datasheet](https://server4.eca.ir/eshop/AHT10/Aosong_AHT10_en_draft_0c.pdf)    
[AHT15 Datasheet](https://wiki.liutyi.info/download/attachments/35291280/Aosong_AHT15_en_draft_0.pdf?version=1&modificationDate=1563622682730&api=v2)
