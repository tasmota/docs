# [Shelly RGBW2](https://www.shelly.com/en-us/products/shop/shelly-rgbw2-us)

<img src="https://kb.shelly.cloud/__attachments/229146742/image-20220920-071244.png?inst-v=37db5b47-02b4-47d2-9c77-9f9b8a60a4f2" width="250" align="right" />

An ESP8266 with 2MB flash LED Controller.

- Supports any 12v or 24v White, RGB, or RGBW led strips and 12/24v led bulbs, with up to 288W combined power
- Supports four-way PWM, applied to control four colors LED(R/G/B/W) for colored lights, color temperature lights, and general lights
- A separate 12V/24V power supply unit is required
- 12V --> 144W combined / 45W per Channel
- 24V --> 288W combined / 90W per Channel
- [Shelly RGBW2 Knowledge Base](https://kb.shelly.cloud/knowledge-base/shelly-rgbw2)
- [Shelly RGW2 API Reference](https://shelly-api-docs.shelly.cloud/gen1/#shelly-rgbw2-color)



## ⚠️️Special Shelly Attention⚠️️

**DO NOT CONNECT ANYTHING TO ANY GPIOs OF THESE DEVICES!**

**No sensors, no switches, nothing!**

**There is no galvanic isolation between the DC Inputs and the GPIOs.**

**Do not connect AC/DC power and the serial connection at the same time!**

**Only use a Shelly as designed.**



## Serial Connection

The Shelly RGBW2 model comes with a partially exposed programming/debug header which can be used to flash Tasmota on the device. A USB-to-UART adapter is needed as well as a reliable 3.3V with at least 350 mA drive capability. The following diagram shows the device pinout.

<img src="https://i1.wp.com/indomus.it/wp-content/uploads/Shelly-RGBW2-connessioni-per-riprogrammazione.png?w=610&ssl=1" height="250" />

The onboard connector is 1.27mm pitch with 1mm diameter holes. Normal Dupont cables won't fit. To avoid damaging the PCB, use either a stripped Ethernet cable and breadboard as an adapter, or female header socket legs (see image below). The legs of a female header socket fit nicely. Solder them to custom-crimped Dupont wires for use with your USB-to-UART adapter. These often come with Wemos D1 Mini boards in multiple lengths.

<img src="https://user-images.githubusercontent.com/188284/63646301-aef1d800-c710-11e9-9bf7-5b45ca470144.png" height="250" />
<img src="https://user-images.githubusercontent.com/188284/63646333-3dfef000-c711-11e9-9446-82ea0ce88c95.png" height="250" />



## Template

| GPIO | Component |
| --- | --- |
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
| 17 | OpAmp Current Monitor

[Template:](../Templates.md#importing-templates)

    {"NAME":"ShellyRGBW2","GPIO":[0,0,157,0,40,89,0,0,37,17,39,38,0],"FLAG":7,"BASE":18}

Energy metering is done by a LM321 OpAmp (1mOhm Shunt low side) via **GPIO17**.

If you want to use a push button, you should take a look at the [Button and Switches](../Buttons-and-Switches.md#button-vs-switch).

If you want the buttons to respond instantly, go to the console and type `SetOption13 1`.

If you want press/double press/hold functionality, run instead `Backlog SetOption1 1; SetOption11 1; SetOption32 20` to enable all three states and set hold time of 2 seconds. Use [SetOption32](../Commands.md#setoption32) to set another hold time.



## Flash mode
To be able to flash the Tasmota firmware you need to get into flash mode. Connect a wire from **GPIO0** to ground when powering on the device. For further information have a look at [programming mode](../Getting-Started.md#programming-mode).

## Calibration
After successfully flashing Tasmota and selecting the template for the Shelly RGBW2, you can start configuring the power consumption.

1. Disconnect the GPIOs and connect the Shelly RGBW to its future power supply. Set **GPIO17** to **ADC Input** in the [template configuration](../Templates.md#how-to-use) and click Save.

2. After restarting, the actual ADC value of the analog input is displayed on the Main Menu as **Analog0**. There should be no LED lights on at this time.

    Make a note of this value. It's the **baseValue** passed to the `AdcParam` command later on.

3. In the template configuration, set **GPIO17** to **ADC CT Power** and click Save.

4. Use the [AdcParam](../Commands.md#sensors) command in the web console:

        AdcParam 7, baseValue, Multiplier, Voltage/1000

    For a 12VDC power supply and a **baseValue** of 407, the command looks like this:

        AdcParam 7, 407, 3282, 0.012


5. If there are no lights on, the Main Menu should show only the Voltage but no consumption.
6. Connect a light source with a current consumption known to you. Or measure the current with a multimeter. Compare the displayed values in the menu and those of your meter.
Please note that the measurement of the Shelly RGBW2 is very inaccurate due to its electrical construction.

### Calculate the Analog CT Multiplier (optional)

It may be necessary to calculate the Analog CT Multiplier value. Generally 3282 is sufficient.

1. Set **GPIO17** input back to **ADC Input**.
2. Note the **baseValue** when the light is switched off.
3. Switch on the light and note the displayed analog value (**comparisonValue**) and the current value displayed by your meter (**realValue**).
4. Calculate the Multiplier value:

    (comparisonValue - baseValue) x 100 / realValue = Multiplier

    **Example**:

        comparisonValue = 455
        baseValue = 407
        realValue 1.5A

        (455-407)*100/1.5 = 3200

5. Set **GPIO17** input back to **ADC CT Power** and start at step 4 of the  Calibration procedure.


## Using the Attached AC Switch Adapter

As described in [AC Frequency Detection Switch](../Buttons-and-Switches.md#ac-frequency-detection-switch) section, the adapter sends pulses (by shorting red wire to GND), when AC voltage is present between the two black wires.

Shelly RGBW2 has an onboard pull-up resistor to 3.3V. To make it work correctly, set **GPIO5** to `Switch_n` mode. Then use the ['SwitchDebounce'](../Commands.md#switchdebounce) command to set the number of pulses required for the switch to be recognized as on or off. For example, `SwitchDebounce 69`.


## Use Rules to Control Both Switches

If [SetOption37](../Commands.md#setoption37) is set to 128 the RGB and White is split, use this rule to switch both RGB and White on/off with the connected hardware switch:

    Rule1 ON Power1#State DO Power2 %value% ENDON
    Rule1 1




## Ghost switching
The inputs on Shelly devices appear to be notoriously susceptible to interference. Therefore ghost switching can happen if the wires are long (>1m / 3ft). If you experience this issue, you might want to experiment with the switch debounce delay. It is set to 50 milliseconds by default.

Use command `SwitchDebounce 100` to change it to a less sensitive value, which might work better. The value can be set up to 1000 milliseconds.

Some issues were reported for this topic - [search query](https://github.com/arendst/Tasmota/issues?utf8=%E2%9C%93&q=ghost+shelly)


## Light setup

To get the equivalent of what Shelly calls "White mode", run `SetOption68 1`.

To switch back to what Shelly calls "Color mode" (the default), run `SetOption68 0`.

See [Lights](../Lights.md#control-lights) for more details.

## PCB images

![shelly-rgbw2-front](https://user-images.githubusercontent.com/1452106/150571332-524315ce-dfe9-478d-8a47-cddf80980ab4.png)
 ![shelly-rgbw2-bottom](https://user-images.githubusercontent.com/1452106/150574749-f83f88d8-8b33-4f3b-a8ab-94d4a8bbfbdb.png)

