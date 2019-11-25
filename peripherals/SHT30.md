**Wemos SHT30 Shield High Precision Humidity & Temperature (I<sup>2</sup>C) sensor**


From the [Wemos SHT30 shield specs](https://cleanuri.com/qMpp3V) the SDA pin on the SHT30 shield is connected to D2 and the SCL pin to D1. 

_Note: v1.0.0 is retired, but v2.0.0 has the same pinout._

## Configuration

As a default the SHT30 uses I<sup>2</sup>C address 0x45 and is user changeable by short-circuiting the two soldering pads at the **lower** left-side of the sensor (see image below marked green).

Also if no other I<sup>2</sup>C devices are connected to the Wemos it might be wise to short-circuit the three soldering pads at the **upper** left-side of the sensor (see image below marked red). This connects the pull-up resistors for I<sup>2</sup>C and biases the SCL and SDA pins to VCC. This is to avoid possible false detections of other sensors like VEML6070.

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_sht30_shield_v2.0.0_marked_pads.jpg?raw=true" width=300>

#### Tasmota Settings
In the _Configuration -> Configure Module_ page assign:
1. D2 GPIO4 to `I2C SDA (6)`
2. D1 GPIO5 to `I2C SCL (5)`

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_sht30_config_marked.jpg?raw=true" style="width:10em">

After reboot of the device the temperature and humidity are displayed.

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_sht30_main_marked.jpg?raw=true" style="width:10em">

## Breakout Boards

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_sht30_shield_v1.0.0.jpg?raw=true" width=220></img>
<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_sht30_shield_v2.0.0.jpg?raw=true" width=250></img>
