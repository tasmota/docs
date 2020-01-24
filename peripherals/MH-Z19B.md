## MH-Z19B CO<sub>2</sub> Sensor (Serial)

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/mhz19b-co2-sensor-front.jpg?raw=true" align=right width=225>
<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/mhz19b-co2-sensor-back.jpg?raw=true" align=right width=225>

The MH-Z19 sensor is manufactured by [Winsen](http://www.winsensor.com/) Lt., China and the measurement method used is based on the non-dispersive infrared ([NDIR](https://en.wikipedia.org/wiki/Nondispersive_infrared_sensor)) principle to detect the existence of CO<sub>2</sub> in the air.

Key features according to the manufacturer are:
* good sensitivity
* non-oxygen dependent
* long life
* built-in temperature compensation
* UART serial interface and Pulse Width Modulation (PWM) output

Principle of operation:
The main components of an NDIR sensor are an infrared source (lamp), a sample chamber or light tube, a light filter and an infrared detector. The IR light is directed through the sample chamber towards the detector. In parallel there is another chamber with an enclosed reference gas, typically nitrogen. The gas in the sample chamber causes absorption of specific wavelengths according to the BeerñLambert law, and the attenuation of these wavelengths is measured by the detector to determine the gas concentration. The detector has an optical filter in front of it that eliminates all light except the wavelength that the selected gas molecules can absorb. 

See also the [datasheet](https://www.winsen-sensor.com/d/files/PDF/Infrared%20Gas%20Sensor/NDIR%20CO2%20SENSOR/MH-Z19%20CO2%20Ver1.0.pdf).

Buy example: [AliExpress.com: MH-Z19B-Infrared-CO2-Sensor-for-CO2-Monitor-NDIR-Gas-Sensor-CO2-gas-sensor](https://www.aliexpress.com/item/MH-Z19B-Infrared-CO2-Sensor-for-CO2-Monitor-NDIR-Gas-Sensor-CO2-gas-sensor/32823821163.html)

Operating current < 18mA average

### Connecting the MH-Z19B to a Wemos D1 mini

| Wemos D1 Mini  | MH-Z19B |
|---|---|
|VCC +5V   | Vin|
|GND   | GND|
|TX   |Rx|
|RX   |Tx|

In some situations if you only get `0 ppm` displayed it may be necessary to set "TX GPIO1" to "MHZ Rx" and "RX GPIO3" to "MHZ Tx" and correspondingly reverse the cabling for RX/TX.  See [here](https://github.com/arendst/Tasmota/issues/2659#issuecomment-387712292) for more details.

#### Tasmota Settings
In the Configuration -> Configure Module page, select the following for Wemos D1 mini:
1. **Module Type:** 18 Generic
2. **TX GPIO1 Serial Out:** 60 MHZ Tx
3. **RX GPIO3 Serial In:** 61 MHZ Rx

![](https://user-images.githubusercontent.com/24528715/50478370-119fa200-09d1-11e9-912d-f58ac3779ca5.png)

For Sonoff Basic:
1. **Module Type:** 01 Sonoff Basic
2. **GPIO01** 60 MHZ Tx
3. **GPIO03** 61 MHZ Rx

![](https://user-images.githubusercontent.com/24528715/50478262-9807b400-09d0-11e9-8659-000eca113802.png)


### Tasmota Main
After reboot of the device the MHZ-19B measurements are shown.

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_mhz19b_main_marked.jpg?raw=true" width=300>

Measure range can be selected with command:

* sensor15 1000 for 1000 ppm range
* sensor15 2000 for 2000 ppm range
* sensor15 3000 for 3000 ppm range
* sensor15 5000 for 5000 ppm range

[Full commands list for the sensor](Commands#sensor15)
