ESP8266 has a single ADC pin available. It may be used to read voltage at ADC pin or to read module supply voltage (VCC). 

!!! note
    When referring to the ADC pin these terms are used interchangeably: ADC (Analog-to-digital Converter), TOUT, Pin6, A0 or Analog0.  

!!! warning
     Check your Wi-Fi module! The ESP8266 A0 pin supports a maximum voltage of 1.0V. Many newer Wi-Fi modules have an on-board voltage divider to support a higher A0 input voltage range (typically in the range between 0 and 3.3 volts). You may need to use an external voltage divider to ensure your input voltage is in the right range.

By default Tasmota uses the ADC pin to read voltage. The signal comes from an analog [peripheral](), or sometimes from the device itself (see [Shelly 2.5](/devices/Shelly-2.5)). 

After wiring a peripheral to GPIO17 (A0) pin you have to configure it in **Configure Module**:

![ADC configuration](_media/A0.png)

ESP32 has more ADC pin available, of this something specified for analog input (gpio34, gpio35, gpio36, gpio39). It may be used to read voltage at ADC pin or to read module supply voltage (VCC). 
All analog input pins support 3.3V of max supply. 

After wiring a peripheral to specified Analog Input GPIO pin you have to configure it in **Configure Module**:

![ADC configuration](_media/ADCesp32.png)

#|Option|WebUI display|MQTT mesage
-|-|-|-
0|None| none | none
1|Analog | Analog0 _%value%_ | `{"A0":%value%}`
2|Temperature | Temperature _%value%_ °C (°F) | `{"Temperature":%value%},"TempUnit":"C"}`
3|Light | Illuminance _%value%_ lux | `{"Illuminance":%value%}`
4|Button | none | none
5|Buttoni | none | none
6|Range| Range _%value%_ | `{"Range":%value%}`
7|CT Power| Voltage 230 V<br>Current _%value_ A<br>Power _%value_ W<br>Energy Total _%value_ kWh| `{"Energy":%value,"Power":%value,"Voltage":230,"Current":%value}`
9|pH| ph _%value_| `{"pH":%value}`
10|MQ-X| MQ-X _%value_ ppm| `{"MQX":%value}`

The reading will show in web UI's sensor section as "_%option% %value%_" depending on the selected option. Tasmota calculates the values for temperature and light, analog values can be `1` to `1024`.

!!! note
     When using Temperature (2) or light (3) a calibration could be needed. In case of shifted values [`AdcParam`](Commands.md#adcparam) can be used to calibrate the output.

Example: ADC as `Analog (1)`    
![ADC in web UI](_media/Analog0.png)

A message will be published in `tele/%topic%/SENSOR` JSON response as `"ANALOG": ` depending on the selected option.

Example: ADC as `Light (3)`   
```json
18:55:09 MQT: tele/tasmota/SENSOR = {"Time":"2019-10-31T18:55:09","ANALOG":{"Illuminance":8}}
```

!!! warning
     Careful when setting ADC as Button, if there is constant voltage on the pin it might register as a [long press](Buttons-and-Switches#long-press) and reset the device to firmware defaults

### Commands

Command|Parameters
:---|:---
AdcParam<x\><a class="cmnd" id="adcparam"></a>|[ADC](ADC) analog input tuning parameters. On ESP32 x is channel `1..8`<br>`<sensor>, <param1>, <param2>, <param3>,  <param4>`<BR>`<sensor>` values:<br>&emsp; `2` = Temperature [Steinhart-Hart thermistor equation](https://en.wikipedia.org/wiki/Steinhart%E2%80%93Hart_equation) parameters:</li><ul>`<param1>` = NTC Voltage bridge resistor in Ohms *(default = `32000`)*<br>`<param2>` = NTC Resistance in Ohms *(default = `10000`)*<BR>`<param3>` = NTC Beta Coefficient *(default = `3350`)*</li></ul><br>&emsp; `3` = Light [Lux equation](https://www.allaboutcircuits.com/projects/design-a-luxmeter-using-a-light-dependent-resistor/) parameters:</li><ul>`<param1>` = LDR Voltage bridge resistor in Ohms *(default = `10000`)*<BR>`<param2>` = LDR Lux Scalar *(default = `12518931`)*<BR>`<param3>` = LDR Lux Exponent *(default = `-1.4050`)*</li></ul><br>&emsp; `6` = ADC linear range remapping parameters:</li><ul>`<param1>` = input range low value `adcLow` *(default = `0`)*<BR>`<param2>` = input range high value `adcHigh` *(default = `1023`)*<BR>`<param3>` = output range low value `rangeLow` *(default = `0`)*<BR>`<param4>` = output range high value `rangeHigh` *(default = `100`)*<BR>The range remapping perform the following calculation on the ADC value *[0..1023]*:<BR>`Range = ((adcHigh - ADC) / (adcHigh - adcLow)) * (rangeLow - rangeHigh) + rangeHigh`<br>*The calculation is performed in double resolution floating point but all 4 parameters as well as the range output are unsigned 16 bit integers. The calculation result must not exceed [0..65535].*<BR>Example to convert the ADC value on a D1-mini into millivolts (using the default resistor bridge of 220k/100k):<BR>`AdcParam 6, 0, 1023, 0, 3200`</li></ul><br>&emsp; `7` = CT POWER parameter adjustments:</li><ul>`<param1>` = ANALOG_CT_FLAGS (default 0 for a non-invasive current sensor). When value is `>0` its sets the `adcLow` value as base for the measurement via OpAmp differential amplifier.<BR>`<param2>` = ANALOG_CT_MULTIPLIER ( 2146 = Default settings for a (AC) 20A/1V Current Transformer.) multiplier\*100000 to convert raw ADC peak to peak range 0..1023 to RMS current in Amps. Value of 100000 corresponds to 1<BR>`<param3>` = ANALOG_CT_VOLTAGE (default 2300) to convert current in Amps to apparent power in Watts using voltage in Volts*10. Value of 2200 corresponds to AC220V. For DC its Volt/1000. Eg. 12VDC = 0.012.<BR> `AdcParam 7,406,3282,0.012`</li></ul><BR>&emsp; `9` = ANALOG_PH parameter adjustments:</li><ul>`<param1>` = ANALOG_PH_CALSOLUTION_LOW_PH (default 4.0).<BR>`<param2>` = ANALOG_PH_CALSOLUTION_LOW_ANALOG_VALUE ( default 282 )<BR>`<param3>` = ANALOG_PH_CALSOLUTION_HIGH_PH (default 9.18).<BR>`<param4>` = ANALOG_PH_CALSOLUTION_HIGH_ANALOG_VALUE (default 435).<BR><BR>To calibrate the probe, two reference solutions with known pH are required. Calibration procedure: <ol><li>Put probe in solution with lower pH value. pH value of the solution is ANALOG_PH_CALSOLUTION_LOW_PH.</li><li>Wait until analog value / RAW value stabilizes (~3 minutes)</li><li>The analog reading is ANALOG_PH_CALSOLUTION_LOW_ANALOG_VALUE</li><li>Clean probe and put in solution with higher pH value. pH value of the solution is ANALOG_PH_CALSOLUTION_HIGH_PH.</li><li>Wait until analog value / RAW value stabilizes (~3 minutes)</li><li>The analog reading is ANALOG_PH_CALSOLUTION_HIGH_ANALOG_VALUE</li></ol>Analog readings can be read by either changing the analog port configuration to "Analog Input" while calibrating, or by enabling debug logs in the console and having a look at the `RAW Value`reading instead.</li></ul><BR>&emsp; `10` = MQ-X sensors parameter adjustments:</li><ul>`<param1>` = ANALOG_MQ_TYPE (default 2) It used to specify sensor type. At the moment exists: 2, 3, 4, 5, 6, 7, 8, 9, 131, 135 (means MQ-02, MQ-03, MQ-04 ecc.).<BR>`<param2>` = ANALOG_MQ_A (default 574.25 a params for MQ-02) It is exponential regression a params<BR>`<param3>` = ANALOG_MQ_B (default -2.222 b params for MQ-02) It is exponential regression b params, generally negative<BR>`<param4>` = ANALOG_MQ_RatioMQCleanAir (default 15.0 RatioMQCleanAir params for MQ-02) NOT USED YET. It is threashold for good air in ppm for future alams arming<BR>Usage example for MQ-02, MQ-04, MQ-07 and MQ-131<BR> `AdcParam 10, 2.00, 574.25, -2.22, 9.83`<BR> `AdcParam 10, 4.00, 1012.70, -2.79, 4.40 `<BR> `AdcParam 10, 7.00, 99.04, -1.52, 27.50 `<BR> `AdcParam 10, 131.00, 23.94, -1.11, 15.00 `</li></ul><BR>

### Rule triggers
Use these triggers in rules:    

`on ANALOG#A0div10 do ...` - when the ADC input changes by more than 1% it provides a value between 0 and 100    

`on Tele-ANALOG#A0 do ...` - triggers on tele messages with Analog object
> `MQT: tele/tasmota/SENSOR = {"Time":"2019-01-14T19:36:51","ANALOG":{"A0":1024}}`

Rule example: [using a potentiometer on analog pin](Rules#use-a-potentiometer).

## ADC_VCC
Instead of an input, ADC pin can be used to measure supply voltage of the ESP module (*this reading in not 100% accurate*). To enable ADC_VCC feature you need to [compile your own build](Compile-your-build):

**If you enable ADC_VCC you cannot use the pin as analog input anymore.**

user_config_override.h flag:
```
// -- Internal Analog input -----------------------
#define USE_ADC_VCC                              // Display Vcc in Power status
```

Supply voltage is published in `tele/%topic%/STATE` under `"Vcc":` in mV:
```
11:14:59 MQT: tele/tasmota/STATE = {"Time":"2019-10-31T11:14:59","Uptime":"0T18:36:12","UptimeSec":66972,"Vcc":3.423,"Heap":28,"SleepMode":"Dynamic","Sleep":50,"LoadAvg":19,"MqttCount":6,"POWER":"OFF","Wifi":{"AP":1,"SSId":"Tasmota","BSSId":"00:00:00:00:00:00","Channel":13,"RSSI":100,"LinkCount":1,"Downtime":"0T00:00:06"}}
```
