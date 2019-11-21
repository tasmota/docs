!> **This feature is not included in precompiled binaries.**     
To use it you must [compile your build](compile-your-build). Add the following to `user_config_override.h`:
```
#ifndef USE_CHIRP
#define USE_CHIRP
#endif
```
----

[Chirp! I<sup>2</sup>C moisture sensor](https://github.com/Miceuz/i2c-moisture-sensor) is the sensor-only version of the original Chirp! sensor.  

The "sensor mode only" (without the chirp function) is the preferred sensor variant for Tasmota. It provides additional temperature readings. Chirp! is a plant watering alarm which uses capacitive sensing to measure moisture. It provides ambient light readings and works in Tasmota, but is not the recommended version.  

Additional References:
- [Catnip electronics](https://www.tindie.com/stores/miceuz/)  
- [Plant Watering Alarm](https://github.com/Miceuz/PlantWateringAlarm)  

### Connecting to an ESP82xx
Use a standard I<sup>2</sup>C connection plus 3.3V and GND.

### Device Configuration
In the Configuration -> Configure Other page, enter and activate  the following template:  
`{"NAME":"HW-655 PZEM","GPIO":[0,0,0,0,6,5,0,0,0,0,0,0,0],"FLAG":0,"BASE":18}`  

**BASE: Generic (18)**
**GPIO4 : I2C SDA (06)**
**GPIO5 : I2C SCL (05)**
  
At boot time the driver will scan the I<sup>2</sup>C bus for CHIRP moisture sensors and enumerate them starting with 0. The sensor has a default I<sup>2</sup>C address of `0x20`, which can be changed within the driver so that multiple sensors are possible.  

Write access to the sensor is potentially dangerous!! Only change the I<sup>2</sup>C address while only one is sensor connected, using a stable power supply, and if you are familiar with how to flash the sensor.  

### Commands
| Command | Description |
| -- | -- |
| CHIRPSCAN | Re-scan the I<sup>2</sup>C bus and re-enumerate the sensors.
| CHIRPSELECT | Select the active sensor, which can receive commands. To select the first sensor use `CHIRPSELECT 0`.  
| CHIRPSET | Set the new I<sup>2</sup>C address for the selected sensor. Use decimal address.<BR>To change active sensor to `0x1f` (=31) use `CHIRPSET 31`.  
| CHIRPSLEEP | Put the selected sensor into sleep mode.
| CHIRPWAKE | Wake the selected (sleeping) sensor.  
| CHIRPRESET | Reset the selected sensor.

### Sensor readings
The original explanation from the manufacturer can be found on this [tindie page ](https://www.tindie.com/products/miceuz/i2c-soil-moisture-sensor/).  

It is important to understand, that the light sensor does not provide LUX but a relative reading (`0..65535`), where more light means a lower value!  The term DARKNESS is used in Tasmota.  

!! ⚠️ PLEASE USE `TelePeriod` OF 20 OR GREATER ⚠️ !!  
The driver will sync with the `TelePeriod` and start the measure cycle about 17 seconds before the next telemetry message. You can issue a `Status 8` and any time to output that last sensor readings.  

### Known issues
The sensor is relatively slow and therefore the driver will (try to) slow down the I<sup>2</sup>C bus-speed and extend the CLOCKSTRETCHLIMIT. A long discussion about it can be found [here](https://github.com/Apollon77/I2CSoilMoistureSensor/issues/8). The problem seems to occur mostly when the sensor wakes up from sleep. That is why the implemented auto-sleep-wake function is currently deactivated in the driver. Typically when you get readings of `0` for all 3 measurements, then the I<sup>2</sup>C bus is likely "frozen". The expected result for `I2CSCAN` on the console is `{"I2CScan":"Error 4 at 0x01"}`. A restart (`Restart 1`) of Tasmota should be enough, but you may need to power cycle the device. Different ESP Cores may lead to different behavior.  

It is possible to flash incorrect firmware to a sensor (chirp vs non-chirp). This will very likely lead to nonsense temperature readings.  

Multiple sensors on one I<sup>2</sup>C  bus were tested successfully, but are not guaranteed to work due to multiple possible reasons (power, cabling, ...). Your mileage may vary.
