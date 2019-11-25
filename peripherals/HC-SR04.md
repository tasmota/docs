HC-SR04 (HC-SR04P and JSN-SR04T) is an ultrasonic ranging sensor. Provides 2cm to 400cm of non-contact measurement functionality with a ranging accuracy that can reach up to 3mm. Each HC-SR04 module includes an ultrasonic transmitter, a receiver and a control circuit. See [HC-SR04 Ultrasonic Sensor](https://www.sparkfun.com/products/13959) for more information.

Buy example: 
- [AliExpress](https://www.aliexpress.com/item/4000124226294.html)
- [Sparkfun](https://www.sparkfun.com/products/13959)

## Configuration

#### Wiring<img src="https://raw.githubusercontent.com/arendst/arendst.github.io/master/media/wemos/wemos_hc-sr04_schematic.jpg" align=right></img>

| HC-SR04   | ESP8266 |
|---|---|
|Vcc   |5V |
|GND   |GND |
|Trig   |GPIOx |
|Echo<br>use voltage divider!   |GPIOy | 

The HC-SR04 operates at 5V and therefore the echo signal will be 5V as well. Connecting the echo pin via a voltage divider (see schematic) will divide the 5V to 3.3V, which is the operating voltage of an ESP8266.

There is a variant of the HC-SR04, called HC-SR04P. It mainly operates at 3.3V and then it doesn't need the voltage divider but you will notice a range drop of about 1 meter.
![image](https://user-images.githubusercontent.com/5904370/68340827-75155880-00e7-11ea-8f79-efd47bd421bc.png)

#### Tasmota Settings 
In the _Configuration -> Configure Module_ page assign:
1. GPIOx to `SR04 Tri (69)`
2. GPIOy to `SR04 Ech (70)`

![image](https://user-images.githubusercontent.com/5904370/68340227-4ea2ed80-00e6-11ea-90bf-c6da3cd6eb22.png)

### Tasmota Main
After a reboot webUI displays the HC-SR04 distance.

![image](https://user-images.githubusercontent.com/5904370/68340187-39c65a00-00e6-11ea-8c27-22527368e3d5.png)

Sensor sends a  `tele/%topic%/SENSOR` JSON reponse:
```json
{"Time":"2019-01-01T22:42:35","SR04":{"Distance":16.754}}
```
