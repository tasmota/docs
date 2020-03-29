### MCP230xx - Microchip MCP23008 / MCP23017 I<sup>2</sup>C GPIO Expander

Technical Data from the manufacturer:
* Microchip [MCP23008](https://www.microchip.com/wwwproducts/en/MCP23008)
* Microchip [MCP23017](https://www.microchip.com/wwwproducts/en/MCP23017)

Generally available breakout boards for the MCP23017 look similar to this:

![https://github.com/andrethomas/images/raw/master/mcp230xx/mcp23017_breakout.jpg](https://github.com/andrethomas/images/raw/master/mcp230xx/mcp23017_breakout.jpg)

The MCP23008 has 8 IO pins which the MCP230xx driver uses as D0 - D7. The MCP23017 has 16 IO pins which the MCP230xx driver uses as D0 - D15. This is visualized in the circuit diagram below but it's important to note that the MCP23017 actually differentiates between PORTA (being A0 to A7) and PORTB (being B0 to B7) - The MCP230xx driver combines the two ports in sequence to translate to pins represented as D0 through D15 for the MCP23017.

The chip can be connected quite easily, especially if you can source the DIP version of the chip. Here's a basic outline of what a typical circuit would require to be functional:

![Manual Wiring for MCP23008 / MCP23017](https://github.com/andrethomas/images/raw/master/mcp230xx/mcp230xx_manual_wiring_v2.png)

You will need to pick an I2C address in either of the above scenario's using the address mapping according to pin A0, A1, and A2 as from the datasheet as follows:

![MCP23008 / MCP23017 I2C Address Map](https://github.com/andrethomas/images/raw/master/mcp230xx/i2c_address_map.png)

You will need to define the address you are using in `user_config_override.h` for the driver to know on which address the MCP23008/MCP23017 is expected to be found.

`#define USE_MCP230xx_ADDR 0x20`

The MCP23008/MCP23017 chips allow for both INPUT and OUTPUT - Most of the functionality of the driver is focused on INPUT mode - especially since they allow interrupt reporting and are 5V tolerant.

OUTPUT functionality is however available as pinmode 5 (Documented later in this Wiki) as an additional option for those who want to use the OUTPUT functionality using the `Sensor29` command which consumes ~1Kbyte of flash. The driver is disabled by default in the Tasmota firmware so the only way to gain its use would be to perform a manual compilation of your own firmware.

There are three different levels in which functionality may be enabled, in the following order, by adding these lines in `user_config_override.h`:
```
#define USE_MCP230xx                 // Enable INPUT mode (pinmode 1 through 4)
#define USE_MCP230xx_OUTPUT          // Enable OUTPUT mode (pinmode 5)
#define USE_MCP230xx_DISPLAYOUTPUT   // Display state of OUTPUT pins on main Tasmota web interface
```

The ESP8266 will automatically detect whether you have connected an MCP23008 (8 input) or MCP23017 (16 input) and will provide telemetry data in accordance with how the device was configured from within the Tasmota firmware.

If OUTPUT is enabled, telemetry data for the current state of OUTPUT pins will also be provided by telemetry.

### MCP23008 / MCP23017 Pin numbers in Tasmota compared to datasheets

The table below outlines how the pins of the MCP23008/MCP23017 are assigned:

![MCP23008 / MCP23017 Pin Map](https://github.com/andrethomas/images/raw/master/mcp230xx/mcp_pin_mapping.PNG)

### Usage of the driver

The MCP230xx chip (or breakout board) must be connected to the ESP8266 and the I2C pins must be configured for the module similar to the following:

![https://github.com/andrethomas/images/raw/master/mcp230xx/Generic_Config_Menu.PNG](https://github.com/andrethomas/images/raw/master/mcp230xx/Generic_Config_Menu.PNG)

One that is complete you may want to confirm that the Tasmota firmware is finding your MCP23008/MCP23017 chip by sending the command through serial or MQTT:  
`I2Cscan`

You should see a response giving you an address within the range of the MCP23008/MCP23017 chip (0x20 through 0x27) which may look as follows  
`MQT: stat/tasmota/RESULT = {"I2CScan":"Device(s) found at 0x20"}`

If the extender is not detected, check your wiring and pin configuration.

The configuration of MCP23008/MCP23017 by using `Sensor29` commands via the Console or MQTT messages.

In order to use the MCP23008/MCP23017, add the following two lines in your `user_config_override.h` as the MCP chip support is not enabled by default.  
```
#define USE_MCP230xx
#define USE_MCP230xx_ADDR 0x20
```

The MCP23008/MCP23017 supports I<sup>2</sup>C address range of 0x20 through 0x27. Take care that you are not using an address which is already used by another device (e.g., 0x27 is a known address for some I<sup>2</sup>C Liquid Crystal Displays).

## Device Configuration
The behavior of all pins on the MCP23008/MCP23017 can be reset to a specific setting/mode globally to simplify the initial configuration as follows

Command|Parameters
-|-
Sensor29<a id="Sensor29"></a>|MCP23008 / MCP23017 I<sup>2</sup>C GPIO Expander configuration<BR>`Reset<x>` = reset all pins<BR>x = `1..6`<BR>`1` = INPUT mode, no reporting, no pull-up<BR>`2` = INPUT mode, report on CHANGE, pull-up enabled<BR>`3` = INPUT mode, report on LOW, pull-up enabled<BR>`4` = INPUT mode, report on HIGH, pull-up enabled<BR>`5` = OUTPUT mode (if enabled by `#define USE_MCP230xx_OUTPUT`)<BR>`6` = inverted OUTPUT mode (if enabled by `#define USE_MCP230xx_OUTPUT`)<BR><BR>`pin,pinmode{,intpullup\|outstate{,repmode}}`<ul></ul>`pin` = the I/O pin on the MCP230xx chip<ul><li>`0..7` for MCP23008</li><li>`0..15` for the MCP23017)</ul>`pinmode` = operational mode of the pin (`?, 0..5`)<ul><li>`?` = query pin configuration</li><li>`0` = Disabled (deprecated, but will be default for previously unconfigured devices)</li><li>`1` = INPUT (Floating - only telemetry data will be sent according to configuration `TelePeriod` intervals)</li><li>`2` = INPUT with INTERRUPT on CHANGE (will send an MQTT output on state change from LOW to HIGH **and** HIGH to LOW)</li><li>`3` = INPUT with INTERRUPT on CHANGE to **LOW** (will send an MQTT output on state change **only** from HIGH to LOW)</li><li>`4` = INPUT with INTERRUPT on CHANGE to **HIGH** (will send an MQTT output on state change **only** from LOW to HIGH)</li><li>`5` = OUTPUT (if enabled with `#define USE_MCP230xx_OUTPUT`)</li><li>`6` = inverted OUTPUT (if enabled with `#define USE_MCP230xx_OUTPUT`)</li></ul>`intpullup` *(pinmode `1..4`)*. Pull-up resistors are disabled by default for pin mode `1` whilst enabled by default for pin modes `2..4` (because they are interrupt enabled pins and we do not want signal bounce). The internal pull-up on these pins may be disabled if necessary if you are biasing them externally.<ul><li>`0` = weak internal pull-up disabled *(default for pinmode `1`)*</li><li>`1` = weak internal pull-up enabled *(default for pinmode `2..4`)*</li></ul>`outstate` *(pinmode `5..6`)* = set the default state of an OUTPUT pin on reset/power-up. If your device is configured to save state (`SetOption0 = 1`), the `outstate` setting will be ignored and the last known state of the pin will be applied during power-up/reset.<ul><li>`0/off` = set output pin to OFF</li><li>`1/on` = set output pin state to ON</li><li>`2/toggle` = toggle output pin state</li></ul>`repmode` = reporting mode (optional). Applicable only for pinmode `2..4`. Reporting mode is disabled for pinmode `1` and for output pinmodes (`5..6`)<ul><li>`0` = interrupt using Event and report using telemetry *(default)*</li><li>`1` = interrupt using Event only (no telemetry reported)</li><li>`2` = report using telemetry only (no Event triggered)</li></ul>

Examples:  
`Sensor29 Reset1`  
`MQT: stat/tasmota/RESULT = {"Sensor29_D99":{"MODE":1,"PULL_UP":"OFF","INT_MODE":"DISABLED","STATE":""}}`  
Pin and State is reported as 99 because it is set across all pins.  
Mode should correspond with the reset pinmode option used.  

`Sensor29 0,?`  
`MQT: stat/tasmota/RESULT = {"Sensor29_D0":{"MODE":1,"PULL_UP":"OFF","INT_MODE":"DISABLED","STATE":"ON"}}`  
Confirming that the pin is in pinmode 1 and that the pull-up resistor is not enabled.  
INT_MODE indicates the interrupt mode for pins which are interrupt enabled (pinmode 2 through 4) - In the example above it is disabled for pin mode 1 (INPUT without INTERRUPT)  
The current STATE of the pin as ON or OFF is reported as at the time the command is issued is also reported.  

### IMPORTANT NOTICE ON USE OF INTERRUPTS
**_Only use interrupts on pins which are either explicitly pulled down GND or up to VCC externally as floating pins may cause unintended MQTT responses for pins which are floating. So unless your connected wire/device explicitly pulls the pin to GND or VCC only when conditions of an interrupt would be met it is recommended that you either do not set a pin for an interrupt mode or at least enable pull-up resistors for the unused pins with pullup = 1 when you perform your sensor29 pin,pinmode,pullup command._**

Examples of some pin configuration options:

`sensor29 4,1,0` - Will enable D4 for INPUT without internal pull-up resistor

`sensor29 3,1,1` - Will enable D3 for INPUT with the internal pull-up resistor ENABLED

`sensor29 5,2,1` - Will enable D5 for INPUT and report on change state from LOW to HIGH and HIGH to LOW via MQTT

`sensor29 6,3,1` - Will enable D6 for INPUT and report on change state from HIGH to LOW (note pull-up is also enabled)

`sensor29 2,4,0` - Will enable D2 for INPUT and report on change state from LOW to HIGH (note pull-up is not enabled)

Pull-up resistor support is valid for all modes from 1 through 4

Default telemetry logging will occur for all pins as per the configured logging interval of the ESP8266 as configured in the Tasmota firmware options. The telemetry logging will push out to log and MQTT a JSON as follows:
```
tele/tasmota/SENSOR = {"Time":"2018-08-18T16:13:47","MCP230XX": "D0":0,"D1":0,"D2":1,"D3":0,"D4":0,"D5":0,"D6":0,"D7":1}}
```

Again, this will depend on whether an MCP23008 or MCP23017 is used insofar that the number of pins/bits reported will be 8 (0 to 7) or 16 (0 to 15) respectively.

### INTERRUPT MODES AND USAGE

Interrupts will report for individual pins as and when the conditions which were configured are met and will look something like this:

Interrupt message on HIGH for input pin 0
```
MQT: stat/tasmota/RESULT = {"Time":"2018-08-19T16:04:50","MCP230XX_INT":{"D0":1,"MS":301}}
```
Interrupt message on LOW for input pin 1
```
MQT: stat/tasmota/RESULT = {"Time":"2018-08-19T16:04:50","MCP230XX_INT":{"D1":0,"MS":519}}
```

The state of the pin captured during the interrupt is reported as Dx=y where x is the pin number and y is the state of the pin. In addition the number of milliseconds since the last interrupt occurred for the particular pin is also reported as MS=xx where xx is the number of milliseconds recorded.

In addition to the MQTT message the driver will also execute an event command in the following format:

`event MCPINT_Dxx=y`

Where xx = the pin number from 0 through 7 (MCP23008) or 0 through 15 (MCP23017) and y the state of the pin as it was captured by the interrupt register of the MCP23008/MCP23017 chip.

The complete output for an interrupt enabled pin would look like this:

```
MQT: stat/tasmota/RESULT = {"Time":"2018-08-19T16:08:28","MCP230XX_INT":{"D0":0,"MS":217353}}
SRC: Rule
RSL: Group 0, Index 1, Command EVENT, Data MCPINT_D0=0
MQT: stat/tasmota/RESULT = {"Event":"Done"}
```
```
MQT: stat/tasmota/RESULT = {"Time":"2018-08-19T16:08:46","MCP230XX_INT":{"D0":1,"MS":18101}}
SRC: Rule
RSL: Group 0, Index 1, Command EVENT, Data MCPINT_D0=1
MQT: stat/tasmota/RESULT = {"Event":"Done"}
```

The latter makes it possible to integrate interrupt responses with rules for example:
```
rule on event#MCPINT_D0=1 do power on endon on event#MCPINT_D0=0 do power off endon
```

In the example above the rule would respond to an interrupt of HIGH on pin 0 of the MCP by executing command "power on" and respond to an interrupt of LOW on pin 0 with the command "power off"

See the Wiki on [Using Rules](Rules) for more information on how this can be helpful to your requirements.

If you require only one of the two reporting methods you may use the sensor29 command to configure the interrupt behavior according to your requirements using command:

`sensor29 pin,pinmode,pullup,intmode`

The intmode parameter is optional for pin modes 2 through 4 (those that support interrupts) and may be configured according to the table below depending on your requirements:

![MCP23008 / MCP23017 Interrupt Modes](https://github.com/andrethomas/images/raw/master/mcp230xx/interrupt_modes_v1.PNG)

_Keep in mind that the MCP23008/MCP23017 chip will only store the last interrupt registered in the interrupt register and capture register - Because the interrupt register is only checked every 50 milliseconds by the Tasmota firmware you may experience missed interrupts if your incoming signals fluctuate/change faster than 20 times per second._

### ADVANCED FUNCTIONS

Several advanced functions have been added to extend the flexibility and interoperability of the MCP23008/MCP23017 with specific focus on adding functionality which is not present on the hardware's built-in GPIO pins and offloading some of the functionality that would normally be performed by rules or counters on the Tasmota device into the driver of the MCP23008/MCP23017.

These include the following
* INTPRI - Interrupt Priority, being able to control the rate at which the MCP23008/MCP23017 is polled to see if any interrupts has occurred since the previous poll.
* INTDEF - Interrupt Deffer, being able to control the number of interrupts that are ignored on a specific pin before reporting would occur via telemetry and/or EVENT.
* INTTIMER - Interrupt Timer which allows for time based counter reporting, specifically reporting the number of times an interrupt has occurred on interrupt enabled pins.
* INTCNT - Works with INTTIMER to enable/disable counting for a specific pin.
* INTRETAIN - Keep track of whether an interrupt occurred or not and defer reporting to next telemetry message.

The above additions are described in further detail below.

### ADVANCED FUNCTION #1 - INTERRUPT PRIORITY (INTPRI)

The maximum interrupt polling rate is once per approximately 50 milliseconds - This is what the Tasmota firmware allows as a maximum and how it is configured in the MCP23008/MCP23017 driver by default.

If you want to reduce the number of interrupt polls per second you may use the INTPRI command parameter as follows:

`sensor29 intpri`

Will give you the current setting via JSON response as follows:

`MQT: stat/tasmota/RESULT = {"MCP230xx_INTPRI":{"D_99":0}}`

To change the value you may use command as follows:

`sensor29 intpri,x`

Where x is the number of 50ms cycles (between 0 and 20) which will be skipped before the MCP23008/MCP23017 chip is polled for interrupt. The last interrupt recorded by the MCP23008/MCP23017 will be reported via the configured method.

For example, lets assume you only want the interrupt polling to occur every 500ms  (i.e. twice per second) you could do command:

```
sensor29 intpri,10 // interrupt polled every 10*50 milliseconds, approximated
```

### ADVANCED FUNCTION #2 - INTERRUPT DEFER (INTDEF)

This setting is useful if you need to defer the reporting of an interrupt by event or telemetry until it has occurred at least X number of times.

Syntax:
```
sensor29 intdef,pin         // Will provide current setting of pin
sensor29 intdef,pin,x       // Will set new deffer value to x (0-15)
```

Examples:
```
sensor29 intdef,pin,5       // Will only report interrupt when it occurs 5 times
sensor29 intdef,pin,10      // Will only report interrupt when it has occured 10 times
```

Interrupts occurring a number of times prior to the setting will be counted but ignored for reporting purposes.

### ADVANCED FUNCTION #3 - INTERRUPT TIMER (INTTIMER)

This function is used in conjunction with INTCOUNT (Documented below)

It allows a timer to be configured over which period the number of interrupts will be counted.

Syntax:
```
sensor29 inttimer          // Will provide the current amount of seconds for timer
sensor29 inttimer,x        // Allows setting number of seconds (x) for timer interval
```
### ADVANCED FUNCTION #4 - INTERRUPT COUNTER ENABLE (INTCNT)

Enable interrupt counting for a particular pin. This functionality works in conjunction with INTTIMER (Documented above)

Syntax:
```
sensor29 intcnt,pin       // Readback current setting of interrupt counting for pin (0=OFF/1=ON)
sensor29 intcnt,pin,x     // Enable/Disable interrupt counting for pin (x=0=OFF,x=1=ON)
```

Use case example could be if you want to count the number of times an interrupt occurred on a D0 over a period of 60 seconds. For this we will need the following:
```
sensor29 inttimer,60      // Enable interrupt timer for 60 second interval
sensor29 intcnt,0,1       // Enable interrupt counter for pin D0
```

The above will result in the number of interrupts that occur within the 60 second period configured to be counted and then reported via telemetry at the end of the 60 second time.

A use case for this would be to determine the RPM of something, or perhaps the number of pulses received from an energy meter within a 60 second period to determine energy usage on a per minute bases... or wind speed from impulses received from an anemometer.

### ADVANCED FUNCTION #5 - INTERRUPT RETAIN (INTRETAIN)

This functionality disables immediate even and/or telemetry reporting for a specific pin that has been configured for any of the interrupt modes listed above.

If this is enabled for a particular pin and the pin has an interrupt mode configured the fact that an interrupt condition was met will be remembered (but not reported immediately) and will be reported in a MQTT message when the next telemetry period occurs in the following format:

```
{"Time":"2018-12-06T23:59:26","MCP_INTRETAIN": {"D0":1,"D1":0,"D2":1,"D3":1,"D4":0,"Value":13}}
```

In the example above it means that an interrupt occurred at some point during the previous telemetry period for pins D0, D2, and D3 as indicated by the 1's present for each pin - Pins with a value of 0 means that although the pin was configured for interrupt retain that no interrupt occurred during the previous telemetry period for that particular pin.

For the sake of handling bit-wise operations within your home automation software the decimal value of the respective bits are also aggregated into the Value output included in the telemetry message.

Syntax:
```
sensor29 intretain,pin       // Readback current setting of interrupt retain for a pin (0=OFF/1=ON)
sensor29 intretain,pin,x     // Enable/Disable interrupt counting for pin (x=0=OFF,x=1=ON)
```
***
### OUTPUT FUNCTIONS (PIN MODES 5 AND 6)

Enable OUTPUT support by removing the comment (#) for the following compiler directive to your user_config_override.h

`#define USE_MCP230xx_OUTPUT`

This will extend the sensor29 command enabling pinmode 5 and 6 (inverted) for output, for example:

```
sensor29 0,5,0  // Configure pin 0 as OUTPUT and default to OFF on reset/power-up
sensor29 0,5,1  // Configure pin 0 as OUTPUT and default to ON on reset/power-up
sensor29 0,6,0  // Configure pin 0 as INVERTED OUTPUT and default to ON on reset/power-up
sensor29 0,6,1  // Configure pin 0 as INVERTED OUTPUT and default to OFF on reset/power-up
```

Confirmation will be sent using MQT, for example:
```
MQT: stat/tasmota/RESULT = {"Sensor29_D2":{"MODE":5,"PULL_UP":"OFF","INT_MODE":"DISABLED","STATE":"OFF"}}
```

The only difference between pinmode 5 and pinmode 6 is that pinmode 5 will result in normal output state, i.e. pin will be LOW when OFF whereas pinmode 6 will cause the pin to be HIGH when OFF. This is useful when using relays which have inverted inputs.

If SAVE_STATE / setoption0 is enabled in your firmware configuration then the last known state of the pin will be used on power-up/reset thereby ignoring the pull-up parameter in the commands above.

To change the state of an output pin you may use:
```
sensor29 0,ON   // Turn pin ON (HIGH if pinmode 5 or LOW if pinmode 6(inverted))
sensor29 0,OFF  // Turn pin OFF (LOW if pinmode 5 or HIGH if pinmode 6(inverted))
sensor29 0,T    // Toggle the current state of pin from ON to OFF, or OFF to ON
```

Telemetry response will be provided accordingly, for example:
```
MQT: stat/tasmota/RESULT = {"S29cmnd_D0":{"COMMAND":"ON","STATE":"ON"}}
MQT: stat/tasmota/RESULT = {"S29cmnd_D0":{"COMMAND":"OFF","STATE":"OFF"}}
MQT: stat/tasmota/RESULT = {"S29cmnd_D0":{"COMMAND":"TOGGLE","STATE":"ON"}}
```

`COMMAND = Command which was sent`

`STATE = New state after execution of command`

Telemetry data is provided for pins which are enabled for output. For example, if pin 0 was enabled for OUTPUT the following additional telemetry message will be sent by MQTT at the same time as the normal telemetry interval occurs which reports the current states of pins.

```
MQT: tele/tasmota/SENSOR = {"Time":"2018-08-18T16:41:20","MCP230XX":{"D0":0,"D1":0,"D2":1,"D3":0,"D4":0,"D5":0,"D6":0,"D7":0}}
MQT: tele/tasmota/SENSOR = {"Time":"2018-08-18T16:41:20","MCP230_OUT": {"OUT_D4":"OFF","END":1}}
```

Note the MCP230XX telemetry which provides the current logic state of all the pins and then the second MQT telemetry as MCP230_OUT which indicates the current state of pins configured for OUTPUT - In this case pin 4 or D4

Remember to adhere to the current limitations of OUTPUT pins when using the device for switching external devices such as LED's - Relay's will need additional circuitry as the MCP23008/MCP23017 cannot drive relays directly - That being said most readily available relay pc boards available from vendors are optically isolated from the input so these will work perfectly.
