# VL53L0X laser ranging module

The VL53L0X is a Time-of-Flight (ToF) laser-ranging module.

The support for this sensor is included by default in Tasmota-sensors.bin (ESP8266) and in Tasmota32.bin (ESP32).

About how to install this sensor and how to adapt the laser operation for several use-cases, please check:
https://www.st.com/resource/en/datasheet/vl53l0x.pdf

If you are going to use long I2C wires read this:
https://hackaday.com/2017/02/08/taking-the-leap-off-board-an-introduction-to-i2c-over-long-wires/

## Breakout Boards
![VL53L0x](_media/peripherals/vl53l0x-1.jpg)
![VL53L0x](_media/peripherals/vl53l0x-2.jpg)

## Configuration for single sensor

### Wiring for single sensor
| VL53L0x   | ESP8266 |
|---|---|
|GND   |GND   
|VCC   |3.3V
|SDA   | GPIOa
|SCL   | GPIOb

### Tasmota Settings for single sensor
In the **_Configuration -> Configure Module_** page assign:

1. GPIOa to `I2C SDA`
2. GPIOb to `I2C SCL`

After a reboot Tasmota will detect the VL53L0x automatically and display distance in mm.

![image](_media/peripherals/vl53l0x.png)

Sensor sends a  `tele/%topic%/SENSOR` JSON reponse:

```json
{"Time":"2019-12-20T11:29:22","VL53L0X":{"Distance":263}}
```

## Configuration for Multiple VL53L0x sensors in parallel

Tasmota supports by default up to 8 of these sensors in parallel.

When using multiple VL53L0X, it is required to also wire the XSHUT pin of all those sensors and assign them to free GPIOs of the ESP as VL53L0X XSHUT 1 to 8. This is to let Tasmota change by software the I2C address of those and give them an unique address for operation. The sensor don't save its address, so this procedure of changing its address is needed to be performed every restart. The Addresses used for this are 120 (0x78) to 127 (0x7F). In the I2c Standard (https://i2cdevices.org/addresses) those addresses are used by the PCA9685, so take into account they won't work together.

### Wiring for Multiple Sensors
| VL53L0x-1   | VL53L0x-2   | VL53L0x-3   | ... | ESP8266 |
|---|---|---|---|---|
|GND   |GND   |GND   |GND   |GND   
|VCC   |VCC   |VCC   |VCC   |3.3V
|SDA   |SDA   |SDA   |SDA   | GPIOa
|SCL   |SCL   |SCL   |SCL   | GPIOb
|XSHUT | -     | -     | - | GPIOc
| -    | XSHUT | -     | - | GPIOd
| -    | -     | XSHUT | - | GPIOe
| -    | -     | -     | XSHUT | GPIOz

### Tasmota Settings for single sensor
In the **_Configuration -> Configure Module_** page assign:

1. GPIOa to `I2C SDA`
2. GPIOb to `I2C SCL`
3. GPIOc to `XSHUT 1`
4. GPIOd to `XSHUT 2`
5. GPIOe to `XSHUT 3`
6. ...

After a reboot Tasmota will detect each VL53L0x in sequence and after auto-configuring them, it will display distance in mm.

Sensor sends a  `tele/%topic%/SENSOR` JSON reponse:

```json
{"Time":"2019-12-20T11:29:22","VL53L0X_1":{"Distance":263},"VL53L0X_2":{"Distance":344},"VL53L0X_3":{"Distance":729}}
```

![image](https://user-images.githubusercontent.com/35405447/111362860-144c4780-866e-11eb-84f1-461d2857ede7.png)

![image](https://user-images.githubusercontent.com/35405447/111363016-465da980-866e-11eb-9074-eb4f4c9f5237.png)

![image](https://user-images.githubusercontent.com/35405447/111363173-7907a200-866e-11eb-83e1-93cfefc45315.png)

### Notes

* **MAXIMUM AMOUNT OF SENSORS:** Tasmota supports by default up to 8 of these sensors in parallel. Expanding this limit is possible but backwards incompatible. The default value of VL53L0X_MAX_SENSORS is set in the file tasmota.h

* **VL53L0X LONG RANGE:** By default VL53L0X reads up to 1.2 meters. If you want to use the long range mode (up to 2.2 meters), you need to add a define in user_config_override.h file:
```cpp
#define VL53L0X_LONG_RANGE
```
This increases the sensitivity of the sensor and extends its potential range, but increases the likelihood of getting an inaccurate reading because of reflections from objects other than the intended target. It works best in dark conditions.
