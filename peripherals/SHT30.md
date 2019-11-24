## SHT30 Shield High Precision Humidity & Temperature (I<sup>2</sup>C)

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_sht30_shield_v1.0.0.jpg" align="right" width=220>
<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_sht30_shield_v2.0.0.jpg" align="right" width=250>

From the [Wemos SHT30 shield specs](https://wiki.wemos.cc/products:d1_mini_shields:sht30_shield) the SDA pin on the SHT30 shield is connected to D2 and the SCL pin to D1. 

_Note: v1.0.0 is retired, but v2.0.0 has the same pining._


### I<sup>2</sup>C address & Biasing SDA / SDA 
As per default the sht30 uses I<sup>2</sup>C address 0x45 and is user changeable by short-circuit the two soldering pads at the **lower** left-side of the sensor (see image below marked green).

Also if no other I<sup>2</sup>C devices are connected to the Wemos it might be wise to short-circuit the three soldering pads at the **upper** left-side of the sensor (see image below marked red). This connects the pull-up resistors for I<sup>2</sup>C and biases the SCL and SDA pins to VCC. This is to avoid possible false detections of other sensors like VEML6070.

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_sht30_shield_v2.0.0_marked_pads.jpg" width=300>

#### Tasmota Settings
In the Configuration -> Configure Module page, select the following:
* **D2 GPIO4** : **06 I<sup>2</sup>C SDA**
* **D1 GPIO5** : **05 I<sup>2</sup>C SCL**

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_sht30_config_marked.jpg">

### Tasmota Main
After reboot of the device the temperature and humidity are displayed.

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_sht30_main_marked.jpg">