# MH-Z19 CO~2~ Sensor

!!! info "This feature is included only in tasmota-sensors.bin" 

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/mhz19b-co2-sensor-front.jpg?raw=true" align=right width=225>
<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/mhz19b-co2-sensor-back.jpg?raw=true" align=right width=225>

The MH-Z19 sensor is manufactured by [Winsen](http://www.winsensor.com/) Lt., China and the measurement method used is based on the non-dispersive infrared ([NDIR](https://en.wikipedia.org/wiki/Nondispersive_infrared_sensor)) principle to detect the existence of CO~2~ in the air.

Key features according to the manufacturer are:

* good sensitivity
* non-oxygen dependent
* long life
* built-in temperature compensation
* UART serial interface and Pulse Width Modulation (PWM) output

Principle of operation:    
The main components of an NDIR sensor are an infrared source (lamp), a sample chamber or light tube, a light filter and an infrared detector. The IR light is directed through the sample chamber towards the detector. In parallel there is another chamber with an enclosed reference gas, typically nitrogen. The gas in the sample chamber causes absorption of specific wavelengths according to the BeerñLambert law, and the attenuation of these wavelengths is measured by the detector to determine the gas concentration. The detector has an optical filter in front of it that eliminates all light except the wavelength that the selected gas molecules can absorb. 

### Wiring

| ESP  | MH-Z19 |
|---|---|
|VCC +5V   | Vin |
|GND   | GND |
|TX   | Rx |
|RX   | Tx |

In some situations if you only get `0 ppm` displayed it may be necessary to set "TX GPIO1" to "MHZ Rx" and "RX GPIO3" to "MHZ Tx" and correspondingly reverse the cabling for RX/TX.  See [here](https://github.com/arendst/Tasmota/issues/2659#issuecomment-387712292) for more details.

### Tasmota Settings 
In the **_Configuration -> Configure Module_** page assign:

1. RX to `MHZ Tx`
2. TX to `MHZ Rx`

![](https://user-images.githubusercontent.com/24528715/50478370-119fa200-09d1-11e9-912d-f58ac3779ca5.png)

After a reboot the driver will detect MH-Z19 automatically and display measurements.

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_mhz19b_main_marked.jpg?raw=true" width=300>

Measure range can be selected with command:

* `sensor15 1000` for 1000 ppm range
* `sensor15 2000` for 2000 ppm range
* `sensor15 3000` for 3000 ppm range
* `sensor15 5000` for 5000 ppm range

[Full commands list for the sensor](Commands.md#sensor15)

## Model Comparison

| Product model |  MH-Z19B | MH-Z19C |  MH-Z19D |
|---|---|---|---|
| Power supply voltage | 4.5~ 5.5 V DC |  DC (5.0 ± 0.1) V |  DC (5.0 ± 0.1) V |
| Average current | < 60mA(@5V) |  <40mA (@5V power supply) |  <40mA (@5V power supply) |
| Peak current |  150 mA (@5V supply) | 125mA (@5V power supply) |  125 mA (@5V power supply) |
| Measuring range | 0~5000ppm, 0~10000ppm | 400~5000ppm(optional)<BR>400~10000ppm range could be customized | 400~10000ppm(optional) |
| Warm-up time |  3min | 2.5min |  1min |
| Response time |  T90<120s |  T90< 120s |  T90 <120s |
| Working temperature | 0 ~ 50 ℃ | -10℃ ~ 50℃ | -10℃ ~ 50℃ |
| Working humidity | 0~ 90% RH (No condensation) | 0~ 90% RH (No condensation) | 0~ 90% RH (No condensation) |
| Storage temperature |  | -20℃～60℃ |  -20℃～60℃ |
| Source | [link](https://sensorco2.com/co2-sensor/mh-z19b-ndir-co2-sensor/) | [link](https://sensorco2.com/co2-sensor/mh-z19c-ndir-co2-sensor/) | [link](https://sensorco2.com/co2-sensor/mh-z19d-ndir-co2-sensor/) |
                                                      
Available from [AliExpress](https://www.aliexpress.com/item/1005003228074009.html)
