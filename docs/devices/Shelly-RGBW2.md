


  
The Shelly RGBW2 is supported by using a template.

<img src="https://shelly.cloud/wp-content/uploads/2019/05/RGBW_250.png" width="250" align="right" />

* [Allterco Shelly RGBW2 Product Page](https://shelly.cloud/wifi-smart-shelly-rgbw-2/)
* [Allterco Shelly RGBW2 Shop](https://shop.shelly.cloud/shelly-rgbw2-wifi-smart-home-automation)


## ⚠️️Special Shelly Attention⚠️️

**DO NOT CONNECT ANYTHING TO ANY GPIOs OF THESE DEVICES!!! (No sensors, no switches, nothing)  
There is no galvanic isolation between the DC Inputs and the GPIOs.**
**Do not connect AC/DC power and the serial connection at the same time!**
 Only use a Shelly as designed. 




# [Shelly RGBW2](https://shelly.cloud/wifi-smart-shelly-rgbw-2/)


An ESP8266 with 2MB flash LED Controller.
- Support any 12v or 24v White, RGB, RGBW led strips and 12/24v led bulbs, with up to 288W combined power
- Support 4 ways PWM, applied to control 4 colors LED(R/G/B/W), meet a requirement for colored lights, color temperature lights, and general lights
- A separate 12V/24V power supply unit is required.
- 12V => 144W combined / 45W p. Channel
- 24V => 288W combined / 90W p. Channel




## Serial Connection

The Shelly RGBW2 model comes with a partially exposed programming/debug header which can be used to flash Tasmota on the device. A USB-to-UART adapter is needed as well as a reliable 3.3V with at least 350 mA drive capability. The following diagram shows the device pinout.

<img src="https://i1.wp.com/indomus.it/wp-content/uploads/Shelly-RGBW2-connessioni-per-riprogrammazione.png?w=610&ssl=1" height="250" />

The onboard connector is 1.27mm raster with 1mm diameter holes. Normal Dupont cables won't fit. To avoid damaging the pcb, use either a stripped Ethernet cable and breadboard as an adapter, or female header socket legs (see image below). The legs of a female header socket fit nicely. Solder them to custom-crimped Dupont wires for use with your USB-to-UART adapter. These often come with Wemos D1 Mini boards in multiple lengths.

<img src="https://user-images.githubusercontent.com/188284/63646301-aef1d800-c710-11e9-9bf7-5b45ca470144.png" height="250" />
<img src="https://user-images.githubusercontent.com/188284/63646333-3dfef000-c711-11e9-9446-82ea0ce88c95.png" height="250" />

## Template
 

| GPIO | Component |
| -- | -- |
| 0 | None
| 1 | None
| 2 | LEDLink
| 3 | None
| 4 | PWM4
| 5 | USER
| 9 | None
| 10 | None
| 12 | PWM1
| 13 | Button1
| 14 | PWM3
| 15 | PWM2
| 16 | None
| A0 | OpAmp Current Monitor

[Template:](../Templates/#importing-templates)
` {"NAME":"ShellyRGBW2","GPIO":[0,0,157,0,40,89,0,0,37,17,39,38,0],"FLAG":7,"BASE":18}`  

Energy metering is done by a LM321 OpAmp (1mOhm Shunt lowside) via ADC0 .

If you want to use a push button, you should take a look at the [Button & Switches.](../Buttons-and-Switches/#button-vs-switch) 

If you want the buttons to respond instantly, go to the console and type `SetOption13 1`.
But, if you want press/double press/hold functionality, run instead `Backlog SetOption1 1; SetOption11 1; SetOption32 20` to enable all three states and set hold time of 2 seconds. Use [SetOption32](../Commands#setoption32) to set another hold time.



## Flash mode
To be able to flash the Tasmota firmware you need to get into flash mode. Therefore connect a wire from GPIO0 to ground. For further information have a look at [programming mode](../Getting-Started#programming-mode).

## Calibration
After successfully flashing Tasmota and selecting the template for the Shelly RGBW2, you can start configuring the power consumption.

1. Disconnect the GPIOs and connect the Shelly RGBW to its future power supply.  Set ADC0 to Analog in the [template settings](../Templates/#how-to-use). Save this setting.
2. After restarting, you will find the acutal ADC Value of the analog input in the main menu. There should be no light on at this time. 
Make a note of this value. Its the baseValue.

3. In the template settings, set ADC0 to CT-POWER and save the settings.

4. Use the [AdcParam](../Commands/#sensors) command:<BR> `AdcParam 7, baseValue, Multiplcator, Voltage` <BR>in the webconsole. For a 12VDC PowerSupply and a baseValue of 407 this lines looks like this: <BR>  `AdcParam 7, 407, 3282, 0.012`<BR>
5. If there are no lights on, the Main Menu should show only the Voltage but no consumption.
6. Connect a light source with a current consumption known to you. Or measure the current with a multimeter. Compare the displayed values in the menu and those of your meter.
Please note that the measurement of the Shelly RGBW2 is very inaccurate due to its electrical construction.

!!! tip
In case the values do not fit at all, you have to perform a recalibration. 

1. Set the ADC0 input back to analog. 
2. Note the base value when the light is switched off.
3. Switch on the light and note the displayed analog value (comparison value) and the current value displayed by your meter (real value). 
4. Calculate: `(ComparisonValue-baseValue)*100/realValue = Multiplicator`

!!! example
`BaseValue 407, ComparisonValue 455, realValue=1.5A
(455-407)*100/1,5 = 3200`

5. Set the ADC0 input back to CT-Power and start at 4. of the previous list.



## Use rules to control both switches

If [SetOption37](../Commands/#setoption37) is set to 128 the RGB and White is splited.
To switch both RGB and W on/off with the connected hardware switch, you can use this Rule:
>`rule1 on power1#state do power2 %value% endon`<BR> `rule1 1`




## Ghost switching
The Shelly 2.5 inputs appear to be notoriously susceptible to interference. Therefore ghost switching can happen if the wires are long (>1m / 3ft). If you experience this issue, you might want to experiment with the switch debounce delay. It is set to 50 milliseconds by default.

Use command `SwitchDebounce 100` to change it to a less sensitive value, which might work better. The value be set up to 1000 milliseconds.

Some issues were reported for this topic - [search query](https://github.com/arendst/Tasmota/issues?utf8=%E2%9C%93&q=ghost+shelly)


## Light setup

Please read: [Lights](../Lights/#control-lights).
