# Sugar Valley NeoPool Controller

??? failure "This feature is not included in precompiled binaries"  

    When [compiling your build](Compile-your-build) add the following to `user_config_override.h`:
    ```arduino
    #define USE_NEOPOOL                       // Add support for Sugar Valley NeoPool Controller - also known under brands Hidrolife, Aquascenic, Oxilife, Bionet, Hidroniser, UVScenic, Station, Brilix, Bayrol and Hay (+6k flash, +60 mem)
    #define NEOPOOL_MODBUS_ADDRESS       1    // Any modbus address
  #endif
  ```

[Sugar Valley](https://sugar-valley.net/en/productos/) NeoPool are water treatment systems also known under the names Hidrolife, Aquascenic, Oxilife, Bionet, Hidroniser, UVScenic, Station, Brilix, Bayrol and Hay.
It uses a [RS485](https://en.wikipedia.org/wiki/RS-485) interface with the [Modbus](https://en.wikipedia.org/wiki/Modbus) data protocol for enhancment equipments like Wifi-Interface or a second attached control panel. All functions and parameters can be queried and controlled via this bus interface.

The Tasmota Sugar Valley NeoPool Controller sensor module shows the most of parameters such as the built-in display:

![](_media/xsns_83_neopool_s.png)

There are [Tasmota commands](#commands) implemented to control the high level functions for filtration, light and system parameters such as pH set point, hydrolysis level, redox set point etc.
However, the sensor also provides low-level commands to directly [read]#NPRead) and [write](#NPWrite) NeoPool register, means that you have the option to implement your own commands via home automation systems or by using the Tasmota build-in possibilities [Rules](Commands#rules) with [Backlog](Commands#the-power-of-backlog) or the powerful Berry language on ESP32.

## Connection

The NeoPool controller uses a RS485 interface, the ESP has RS232 interfaces. Both are serial interfaces but with different physical specifications. Therefore to connect your NeoPool controller to an ESP82xx/32 you need a TTL-UART to RS485 converter. It is recommended to use GPIO1 and GPIO3 on ESP8266 side, since the ESP then uses the hardware serial interface.

![](_media/xsns_83_neopool_schematic.png)

The following TTL UART to RS485 converter have been tested with both an ESP8266 and ESP32 using a Vcc of 3.3V:

![](_media/xsns_83_neopool_rs485_1_s.png) ![](_media/xsns_83_neopool_rs485_2_s.png)

!!! note
    Your TTL UART to RS485 converter must be able to work with an operating voltage of 3.3V. Some converters are not designed for operating with 3.3V and only works with 5V TTL level - these converters are useless. __Do not operate your TTL UART to RS485 converter with 5V__, your converter __must be operated with the 3.3V__ from ESP, otherwise the ESP GPIO ports will be damaged.

The Sugar Valley NeoPool RS485 connector pins are located under the connection cover, for the Sugar-Valley products on the right-hand side next to the relay connections:

The pin assignment (from top to bottom):

| Pin | Description |
|-----|-------------|
|  1  | +12V        |
|  2  | nc          |
|  3  | Modbus A+   |
|  4  | Modbus B-   |
|  5  | Modbus GND  |

!!! failure "The +12V connection is the 12V from the internal power supply, do not feed in any external voltage."     

You can use the "WIFI" or "EXTERN" connector, both are independent Modbus channels and uses the Modbus address 1 by default.

!!! note
    The "DISPLAY" port can only be used if neither the built-in nor an external display is connected but since there is probably at least one display connected to one of the two "DISPLAY" ports, the "DISPLAY" port is useless.

### Using WIFI Port

![](_media/xsns_83_neopool_connector_wifi.jpg)

### Using EXTERN Port

![](_media/xsns_83_neopool_connector.jpg)

!!! note
    Leave the define for `NEOPOOL_MODBUS_ADDRESS` set to 1 whether you are using the "WIFI" or "EXTERNAL" port (unless you have changed the parameters for it within your Sugar Valley device).

## Configuration

### Tasmota settings

If you followed the recommendations above, the two GPIOs will be assigned as follows under Tasmota **_Configuration -> Configure Module_**:

* first change Module type to `Generic (0)` - this will restart your Tasmota

After restart set
* GPIO1 to `NeoPool RX`
* GPIO3 to `NeoPool TX`

so it looks like this

![](_media/xsns_83_neopool_config.png)

Don't be surprised that Rx seems to be connected to Tx here (and vice versa). The Rx and Tx designations are to be considered from the point of view of the respective devices, which can be confusing.

After Tasmota restarts, the main screen should display the controller data as shown above. If not, check that the A+/B pins aren't swapped and that the Rx/Tx pins are on the correct GPIOs - swap once if in doubt.

## SENSOR data

Sensor data is sent via the Tasmota topic `tele/%topic%/SENSOR` in JSON format every TelePeriod interval. To get the data immediately, use the Tasmota `TelePeriod` command without parameter:

```json
{
  "Time": "2021-06-01T11:00:00+02:00",
  "NeoPool": {
    "Time": "2021-06-01T11:00:00",
    "Type": "Oxilife",
    "Module": {
      "pH": 1,
      "Redox": 1,
      "Hydrolysis": 1,
      "Chlorine": 1,
      "Conductivity": 1,
      "Ionization": 1
    },
    "Temperature": 23.5,
    "Power": {
      "Version": "V3.45",
      "NodeID": "2A55 6E6B 6E6F 776E 2049 442A",
      "5V": 5.017,
      "12V": 13.904,
      "24-30V": 33.721,
      "4-20mA": 0.01
    },
    "pH": {
      "Data": 7.2,
      "Min": 7.0,
      "Max": 7.2,
      "State": 0,
      "Pump": 2,
      "FL1": 0,
      "Tank": 1
    },
    "Redox": {
      "Data": 752,
      "Setpoint": 750
    },
    "Chlorine": {
      "Data": 0.7,
      "Setpoint": 1.0
    },
    "Conductivity": 0,
    "Ionization": {
      "Data": 0,
      "Setpoint": 0,
      "Max": 0
    },
    "Hydrolysis": {
      "Data": 100,
      "Unit": "%",
      "Runtime": {
        "Total": "28T22:13:19",
        "Part": "28T22:13:02",
        "Pol1": "14T12:32:46",
        "Pol2": "14T09:40:33",
        "Changes": 258
      },
      "State": "Pol1",
      "Cover": 0,
      "Boost": 0,
      "Low": 0
    },
    "Filtration": {
      "State": 1,
      "Speed": 2,
      "Mode": 1
    },
    "Light": 0,
    "Relay": {
      "State": [0, 1, 0, 0, 0, 1, 0],
      "Aux": [0, 0, 1, 0],
      "Acid": 0
    }
  },
  "TempUnit": "C"
}
```

The JSON values "pH", "Redox", "Hydrolysis", "Chlorine", "Conductivity" and "Ionization" are only available if the corresponding module is installed in the device (the corresponding "Module" subkey must be 1 ).

To check which modules are installed use the "Module" value from SENSOR topic or query it manually by using the [NPControl command](#NPControl):

```json
{
  "Modules": {
    "pH": 1,
    "Redox": 1,
    "Hydrolysis": 1,
    "Chlorine": 0,
    "Conductivity": 0,
    "Ionization": 0
  },
  "Relay": {
    "Acid": 1,
    "Base": 0,
    "Redox": 0,
    "Chlorine": 0,
    "Conductivity": 0,
    "Heating": 0,
    "UV": 0,
    "Valve": 0
  }
}
```

## Commands

This sensor supports some high-level [Tasmota commands](#commands) for end user.

Regardless, all other Modbus registers can be read and write, so you can [enhance](#Enhancements) your Sugar Valley control by using low-level [NPRead]#NPRead)/[NPWrite]#NPWrite) commands.

Modbus register addresses and their meaning are described within source file [xsns_83_neopool.ino](https://github.com/arendst/Tasmota/blob/development/tasmota/xsns_83_neopool.ino) at the beginning and (partly) within document [171-Modbus-registers](https://downloads.vodnici.net/uploads/wpforo/attachments/69/171-Modbus-registers.pdf).<BR>
Please note that Sugar Valley Modbus registers are not byte addresses but modbus registers containing 16-bit values - don't think in byte memory layout.

Command|Parameters
:---|:---
NPFiltration<a id="NPFiltration"></a>|`{<state> {speed}}`<BR>get/set manual filtration (state = `0` or `1`, speed = `1..3`). Get if state is omitted, otherwise set accordingly  `<state>`:<ul><li>`0` - manual turn filtration pump off</li><li>`1` - manual turn filtration pump on</li></ul>optional speed control is possible for non-standard filtration types:<ul><li>`1` - slow</li><li>`2` - medium</li><li>`3` - fast</li></ul>
NPFiltrationMode<a id="NPFiltrationMode"></a>|`{<mode>}`<BR>get/set filtration mode (mode = `0..4` or `13`). Get if mode is omitted, otherwise set accordingly `<mode>`:<ul><li>`0` - *MANUAL*<BR>allows to turn the filtration (and all other systems that depend on it) on and off</li><li>`1` - *AUTO*<BR>allows filtering to be turned on and off according to the settings of the *MBF_PAR_TIMER_BLOCK_FILT_INT* timers.</li><li>`2` - *HEATING*<BR>similar to the AUTO mode, but includes setting the temperature for the heating function. This mode is activated only if the BF_PAR_HEATING_MODE register is at 1 and there is a heating relay assigned.</li><li>`3` - *SMART*<BR>adjusts the pump operating times depending on the temperature. This mode is activated only if the MBF_PAR_TEMPERATURE_ACTIVE register is at 1.</li><li>`4` - *INTELLIGENT*<BR>performs an intelligent filtration process in combination with the heating function. This mode is activated only if the MBF_PAR_HEATING_MODE register is at 1 and there is a heating relay assigned.</li><li>`13` - *BACKWASH*<BR>started when the backwash operation is activated.</ul>
NPTime<a id="NPTime"></a>|`{<time>}`<BR>get/set device time. Get if time is omitted, otherwise set device time accordingly `<time>`:<ul><li>`0` - sync with Tasmota local time</li><li>`1` - sync with Tasmota utc time</li><li>`2..4294967295` - set time as epoch</li></ul>
NPLight<a id="NPLight"></a>|`{<state> {delay}}`<BR>get/set light (state = `0..4`, delay = `5..100` in 1/10 sec). Get if state is omitted, otherwise set accordingly `<state>`:<ul><li>`0` - manual turn light off</li><li>`1` - manual turn light on</li><li>`2` - manual toogle light</li><li>`3` - switch light into auto mode according MBF_PAR_TIMER_BLOCK_LIGHT_INT settings</li><li>`4` - select light RGB LED to next program. This is normally done by power the light on (if currently off), then power off the light for a given time (delay) and power on again. The default delay is 15 (=1.5 sec).</ul>
NPpHMin<a id="NPpHMin"></a>|`{<ph>}`<BR>(only available if pH module is installed)<BR>get/set pH lower limit (ph = `0..14`)<BR>get current limit if <ph> is omitted, otherwise set.
NPpHMax<a id="NPpHMax"></a>|`{<ph>}`<BR>(only available if pH module is installed)<BR>get/set pH upper limit (ph = `0..14`)<BR>get current limit if <ph> is omitted, otherwise set.
NPpH<a id="NPpH"></a>|`{<ph>}`<BR>(only available if pH module is installed)<BR>get/set pH upper limit (ph = `0..14`)<BR>same as NPpHMax
NPRedox<a id="NPRedox"></a>|`{<setpoint>}`<BR>(only available if redox module is installed)<BR>get/set redox set point in mV (setpoint = `0..100`, the upper limit of the range may vary depending on the MBF_PAR_HIDRO_NOM register)<BR>get current set point if <setpoint> is omitted, otherwise set
NPHydrolysis<a id="NPHydrolysis"></a>|`{<level>}`<BR>(only available if hydrolysis/electrolysis control is present)<BR>get/set hydrolysis/electrolysis level in % (level = `0..100`)<BR>get current level if <level> is omitted, otherwise set
NPIonization<a id="NPIonization"></a>|`{<level>}`<BR>(only available if ionization control is present)<BR>get/set ionization target production level (level = `0..x`, the upper limit `x` of the range may vary depending on the MBF_PAR_ION_NOM register)<BR>get current level if <level> is omitted, otherwise set
NPChlorine<a id="NPChlorine"></a>|`{<setpoint>}`<BR>(only available if free chlorine probe detector is installed)<BR>get/set chlorine set point in ppm (setpoint = `0..10`)<BR>get current set point if <setpoint> is omitted, otherwise set
NPControl<a id="NPControl"></a>|<BR>Show information about system controls
NPOnError<a id="NPOnError"></a>|`{<repeat>}`<BR>get/set auto-repeat Modbus read/write commands on error (repeat = `0..10`). Get if repeat is omitted, otherwise set accordingly `<repeat>`:<ul><li>`0` - disable auto-repeat on read/write error</li><li>`1..10` - repeat commands n times until ok</li></ul>
NPResult<a id="NPResult"></a>|`{<format>}`<BR>get/set addr/data result format for read/write commands (format = `0|1`). Get if format is omitted, otherwise set accordingly `<format>`:<ul><li>`0` - output decimal numbers</li><li>`1` - output hexadecimal strings, this is the default</li></ul>
NPPHRes<a id="NPPHRes"></a>|`{<digits>}`<BR>get/set number of digits in results for PH value (digits = `0..3`).
NPCLRes<a id="NPPHRes"></a>|`{<digits>}`<BR>get/set number of digits in results for CL value (digits = `0..3`).
NPIonRes<a id="NPPHRes"></a>|`{<digits>}`<BR>get/set number of digits in results for ION value (digits = `0..3`).
NPRead<a id="NPRead"></a>|`<addr> {<cnt>}`<BR>read 16-bit register (addr = `0..0x060F`, cnt = `1..30`). cnt = `1` if omitted
NPReadL<a id="NPReadL"></a>|`<addr> {<cnt>}`<BR>read 32-bit register (addr = `0..0x060F`, cnt = `1..15`). cnt = `1` if omitted
NPWrite<a id="NPWrite"></a>|`<addr> <data> {<data>...}`<BR>write 16-bit register (addr = `0..0x060F`, data = `0..0xFFFF`). Use of data max 10 times
NPWriteL<a id="NPWriteL"></a>|`<addr> <data> {<data>...}`<BR>write 32-bit register (addr = `0..0x060F`, data = `0..0xFFFFFFFF`). Use of data max 10 times
NPBit<a id="NPBit"></a>|`<addr> <bit> {<data>}`<BR>read/write a 16-bit register single bit (addr = `0..0x060F`, bit = `0..15`, data = `0|1`). Read if data is omitted, otherwise set single bit
NPBitL<a id="NPBitL"></a>|`<addr> <bit> {<data>}`<BR>read/write a 32-bit register single bit (addr = `0..0x060F`, bit = `0..31`, data = `0|1`). Read if data is omitted, otherwise set single bit
NPEscape<a id="NPEscape"></a>|clears possible errors (like pump exceeded time etc.)
NPExec<a id="NPExec"></a>|take over changes without writing to EEPROM. This command is necessary e.g. on changes in *Installer page* (addr 0x0400..0x04EE).
NPSave<a id="NPSave"></a>|write data permanently into EEPROM.<BR>During the EEPROM write procedure the NeoPool device may be unresponsive to MODBUS requests, this process always takes less than 1 second.<BR>Since this process is limited by the number of EEPROM write cycles, it is recommend to write all necessary changes to the registers and only then execute EEPROM write process using this command.<BR>__Note: The number of EEPROM writes for Sugar Valley NeoPool devices is guaranteed 100,000 cycles. As soon as this number is exceeded, further storage of information can no longer be guaranteed__.

### Examples

!!! example
    Get filtration mode

```json
NPFiltrationMode
RESULT = {"NPFiltrationmode":"Manual"}
```

!!! example
    Set filtration mode

```json
NPFiltrationMode 1
{"NPFiltrationmode":"Auto"}
```

!!! example
    Enable hydrolysis boost mode without redox control

To do this, write `0x85A0` to register `MBF_BOOST_CTRL` (`0x020C`), exec, save it and notify system using register `MBF_NOTIFICATION` (`0x0110`) about changes:

```json
Backlog NPWrite 0x020C,0x85A0;NPSave;NPExec;NPWrite 0x0110,0x7F
RESULT = {"NPWrite":{"Address":"0x020C","Data":"0x85A0"}}
RESULT = {"NPSave":"Done"}
RESULT = {"NPExec":"Done"}
RESULT = {"NPWrite":{"Address":"0x0110","Data":"0x0000"}}
```

!!! example
    Disable hydrolysis boost mode

To do this, write `0` to register `MBF_BOOST_CTRL` (`0x020C`), exec, save it and notify system using register `MBF_NOTIFICATION` (`0x0110`) about changes:

```json
Backlog NPWrite 0x020C,0;NPSave;NPExec;NPWrite 0x0110,0x7F
RESULT = {"NPWrite":{"Address":"0x020C","Data":"0x0000"}}
RESULT = {"NPSave":"Done"}
RESULT = {"NPExec":"Done"}
RESULT = {"NPWrite":{"Address":"0x0110","Data":"0x0000"}}
```

!!! example
    Switch light relay on

```json
NPLight 1
RESULT = {"NPLight":"ON"}
```

!!! example
    Read Heating setpoint temperature

Here we read register `MBF_PAR_HEATING_TEMP` (`0x0416`):

```json
Backlog NPResult 0;NPRead 0x416
RESULT = {"NPResult":0}
RESULT = {"NPRead":{"Address":1046,"Data":28}}
```

!!! example
    Enable additonal factory menu

For that enable bit `MBMSK_SHOW_FACTORY_MENU` (15) in register `MBF_PAR_UICFG_VISUAL_OPTIONS` (`0x0605`)

```json
Backlog NPBit 0x605,15,1;NPSave
RESULT = {"NPBit":{"Address":"0x0605","Data":"0xAFC0","Bit15":1}}
RESULT = {"NPSave":"Done"}
```

!!! example
    Read system time

We either use command `NPTime` or read the 32-bit value starting `MBF_PAR_TIME_LOW` (`0x0408`) using decimal output:

```json
Backlog NPResult 0;NPTime;NPReadL 0x408
RESULT = {"NPResult":0}
RESULT = {"NPTime":"2021-01-31T21:22:20"}
RESULT = {"NPReadL":{"Address":1032,"Data":1612124540}}
```

!!! example
    Enable temperature module

Do this by enabling `MBF_PAR_TEMPERATURE_ACTIVE` (`0x04F`) and set it permanently in EEPROM::

```json
Backlog NPWrite 0x40F,1;NPSave
RESULT = {"NPWrite":{"Address":"0x040F","Data":"0x0001"}}
RESULT = {"NPSave":"Done"}
```

!!! example
    Hide auxiliary relay display from main menu

To do this, set bit `MBMSK_HIDE_AUX_RELAYS` (3) in register `MBF_PAR_UICFG_VISUAL_OPTIONS` (`0x0605`):

```json
NPBit 0x605,3,1
RESULT = {"NPBit":{"Address":"0x0605","Data":"0x08C8"}}
```

!!! example
    Read Filtration interval 1-3 settings

To do this, we read the registers `MBF_PAR_TIMER_BLOCK_FILT_INT1` (`0x0434`), `MBF_PAR_TIMER_BLOCK_FILT_INT2` (`0x0443`) and `MBF_PAR_TIMER_BLOCK_FILT_INT3` (`0x0452`) with offset `MBV_TIMER_OFFMB_TIMER_ENABLE` (0) as 16-bit values and the remaining timer offset values `MBV_TIMER_OFFMB_*` as 32-bit values:

```json
Backlog NPResult 0;NPRead 0x434;NPReadL 0x435,7;NPRead 0x443;NPReadL 0x444,7;NPRead 0x452;NPReadL 0x0453,7
RESULT = {"NPResult":0}
RESULT = {"NPRead":{"Address":1076,"Data":1}}
RESULT = {"NPReadL":{"Address":1077,"Data":[28800,0,86400,14400,0,1,0]}}
RESULT = {"NPRead":{"Address":1091,"Data":1}}
RESULT = {"NPReadL":{"Address":1092,"Data":[43200,0,86400,21600,0,1,0]}}
RESULT = {"NPRead":{"Address":1106,"Data":1}}
RESULT = {"NPReadL":{"Address":1107,"Data":[0,0,86400,0,0,1,0]}} *
```

!!! example
    Set filtration interval

Here we set interval 1 to a daily interval between 9:00 - 12:30 (9:00: 3600 * 9 ≙ 32400 / 12:30 ≙ 3,5h = 12600)

For this write register `MBF_PAR_TIMER_BLOCK_FILT_INT1` (`0x0434`) using the offsets `MBV_TIMER_OFFMB_`.  For the sake of simplicity we write 4 consecutive 32-bit registers:

* `MBV_TIMER_OFFMB_TIMER_ON`: Timer start = 9*3600 + 00*60 = 32400
* `MBV_TIMER_OFFMB_TIMER_OFF`: Timer stop - not used
* `MBV_TIMER_OFFMB_TIMER_PERIOD`: Time in seconds between starting points = 86400 (means daily interval)
* `MBV_TIMER_OFFMB_TIMER_INTERVAL`: Time in seconds that the timer has to run when started. This is the difference between 12:30 (12*3600 + 30*60 = 45000) and 9:30(see Timer start = 32400) = 12600

```json
NPWriteL 0x435,32400 0 86400 12600
RESULT = {"NPWriteL":{"Address":1077,"Data":[32400,0,86400,12600]}}
```

!!! example
    Manual switch relay 7 (Aux4)

To switch Aux4 ON, we set `MBF_PAR_TIMER_BLOCK_AUX4_INT1` (`0x04D9`) + `MBV_TIMER_OFFMB_TIMER_ENABLE` (0) to MBV_PAR_CTIMER_ALWAYS_ON (`3`):.

```json
Backlog NPWrite 0x4D9,3;NPExec
RESULT = {"NPWrite":{"Address":"0x04D9","Data":"0x0003"}}
RESULT = {"NPExec":"Done"}
```

To switch Aux4 OFF, we set `MBF_PAR_TIMER_BLOCK_AUX4_INT1` (`0x04D9`) + `MBV_TIMER_OFFMB_TIMER_ENABLE` (0) to MBV_PAR_CTIMER_ALWAYS_OFF (`4`):.

```json
Backlog NPWrite 0x4D9,4;NPExec
RESULT = {"NPWrite":{"Address":"0x04D9","Data":"0x0004"}}
RESULT = {"NPExec":"Done"}
```

!!! example
    Modbus autorepeat on communication error

Read current autorepeat value:

```json
NPOnError
RESULT = {"NPOnError":2}
```

Set autorepeat value to 3:

```json
NPOnError 3
RESULT = {"NPOnError":3}
```

## Enhancements

### Daily sync device to Tasmota time

Since the NeoPool devices, without a WiFi module, have no way of synchronizing their internal clock with an external clock and, in addition, the accuracy of the internal clock leaves something to be desired, it makes sense to synchronize the clock with Tasmota once a day. Advantageously, we do this at night after a possible daylight saving time or normal time change.

We use a rule that synchronizes the time and which is triggered by the Tasmota built-in timer (here we use timer 10):

```haskell
Rule2
  ON Clock#Timer=10 DO NPTime 0 ENDON
```

Activate it:

```haskell
Backlog Rule2 4;Rule2 1
```

Configure Tasmota "Timer 10" for your needs:

![](_media/xsns_83_neopool_timer.png)


### ESP82xx: Add buttons for filtration and light control

Add two dummy buttons to control the filtration pump and the light.

First we define two dummy relay (which does not have any physical function) on two unused GPIO (here we use GPIO0 and GPIO4 where we define Tasmota Relay 1 and 2):

```haskell
Backlog GPIO0 224;GPIO4 225
```

Then we rename the buttons for better visibility:

```haskell
Backlog WebButton1 Filtration;WebButton2 Light
```

Now we have the WebGUI buttons like this:

![](_media/xsns_83_neopool_ctrl.png)

but missing the functionality behind. For that we use [Rules](Rules) and connect the states for Tasmota Power, Neopool filtration and light:

```haskell
Rule1
  ON Power1#State==0 DO NPFiltration %value% ENDON
  ON Power1#State==1 DO NPFiltration %value% ENDON
  ON NeoPool#Filtration#State==0 DO Power1 %value% ENDON
  ON NeoPool#Filtration#State==1 DO Power1 %value% ENDON
  ON Power2#State==0 DO NPLight %value% ENDON
  ON Power2#State==1 DO NPLight %value% ENDON
  ON NeoPool#Light==0 DO Power2 %value% ENDON
  ON NeoPool#Light==1 DO Power2 %value% ENDON
```

Don't wonder about the double trigger definition, which at first glance seem nonsensical - they are necessary so that the rule does not trigger endless.

At least we activate the rule:

```haskell
Backlog Rule1 5;Rule1 1
```

It is important to enable the Rule ONCE (`Rule1 5`) function, which prevents the trigger is triggering themself in a loop.

You can now control filtration and light using the WebGUI and get the current status of the device elements when they are switched by auto-mode or manually on the device directly.

![](_media/xsns_83_neopool_do_ctrl.png)

Additional advantage is that you can also use Tasmota Timer switching Power1 (=filtration) and Power2 (light) for your needs.

### ESP32: Adding user defined NeoPool commands to Tasmota

The following enhancements are made using the [Berry Scripting Language](Berry) which is available on ESP32 only.

The class `NeoPoolCommands` below adds two new commands to Tasmota:

Command|Parameters
:---|:---
NPBoost<a id="NPBoost"></a>|`{<state>}`<BR>get/set boost mode (state = `0..2`). Get if state is omitted, otherwise set accordingly  `<state>`:<ul><li>`0` - disable boost mode</li><li>`1` - enable boost mode (without redox control)</li><li>`2` - enable boost mode (with redox control)</li></ul>
NPAux<x\><a id="NPAux"></a>|`{<state>}`<BR>get/set auxiliary relay <x\> (state = `0..2`). Get if state is omitted, otherwise set accordingly  `<state>`:<ul><li>`0` - switch off auxiliary relay</li><li>`1` - switch on auxiliary relay</li></ul>

The class members `NPBoost` and `NPAux` can also be used as templates for further commands.

Store the following code using the WebGUI "Console" / "Manage File system".

ESP32 file `neopool.be`:    
```python
class NeoPoolCommands
  var TEXT_OFF
  var TEXT_ON

  # string helper
  def ltrim(s)
    import string
    var i = 0 while(s[i]==' ') i += 1 end
    return string.split(s, i)[1]
  end
  def rtrim(s)
    import string
    return string.split(s, " ")[0]
  end
  def trim(s)
    return self.rtrim(self.ltrim(s));
  end

  # NPBoost OFF|0|ON|1|REDOX|2
  #    0|OFF:   Switch boost off
  #    1|ON:    Switch boost on without redox control
  #    2|REDOX: Switch boost on with redox control
  def NPBoost(cmd, idx, payload)
    import string
    var ctrl, parm
    try
      parm = string.toupper(self.trim(payload))
    except ..
      parm = ""
    end
    if parm != ""
      if string.find(parm, 'OFF')>=0 || string.find(parm, self.TEXT_OFF)>=0 || string.find(parm, '0')>=0
        ctrl = 0
      elif string.find(parm, 'ON')>=0 || string.find(parm, self.TEXT_ON)>=0 || string.find(parm, '1')>=0
        ctrl = 0x85A0
      elif string.find(parm, 'REDOX')>=0 || string.find(parm, '2')>=0
        ctrl = 0x05A0
      else
        tasmota.resp_cmnd_error()
        return
      end
      tasmota.cmd(string.format("Backlog NPWrite 0x020C,0x%04X;NPSave;NPExec;NPWrite 0x0110,0x7F", ctrl))
    else
      try
        ctrl = compile("return "+str(tasmota.cmd("NPRead 0x020C")['NPRead']['Data']))()
      except ..
        tasmota.resp_cmnd_error()
        return
      end
    end
    tasmota.resp_cmnd(string.format('{"NPBoost":"%s"}', ctrl == 0 ? self.TEXT_OFF : (ctrl & 0x8500) == 0x8500 ? self.TEXT_ON : "REDOX"))
  end

  # NPAux<x> OFF|0|ON|1 (<x> = 1..4)
  #    0|OFF:   Switch aux x off
  #    1|ON:    Switch aux x on
  def NPAux(cmd, idx, payload)
    import string
    var ctrl, parm

    if idx < 1 || idx > 4
      tasmota.resp_cmnd_error()
      return
    end

    try
      parm = string.toupper(self.trim(payload))
    except ..
      parm = ""
    end
    if parm != ""
      if string.find(parm, 'OFF')>=0 || string.find(parm, self.TEXT_OFF)>=0 || string.find(parm, '0')>=0
        ctrl = 4
      elif string.find(parm, 'ON')>=0 || string.find(parm, self.TEXT_ON)>=0 || string.find(parm, '1')>=0
        ctrl = 3
      else
        tasmota.resp_cmnd_error()
        return
      end
      tasmota.cmd(string.format("Backlog NPWrite 0x%04X,%d;NPExec", [0x04AC, 0x04BB, 0x04CA, 0x04D9][idx-1], ctrl))
    else
      try
        ctrl = (compile("return "+str(tasmota.cmd("NPRead 0x010E")['NPRead']['Data']))() >> (idx+2)) & 1
      except ..
        tasmota.resp_cmnd_error()
        return
      end
    end
    tasmota.resp_cmnd(string.format('{"NPAux%d":"%s"}', idx, ctrl == (parm != "" ? 4 : 0) ? self.TEXT_OFF : self.TEXT_ON))
  end

  def init()
    self.TEXT_OFF = tasmota.cmd("StateText1")['StateText1']
    self.TEXT_ON = tasmota.cmd("StateText2")['StateText2']
    # Add commands
    tasmota.add_cmd('NPBoost', / cmd, idx, payload -> self.NPBoost(cmd, idx, payload))
    tasmota.add_cmd('NPAux', / cmd, idx, payload -> self.NPAux(cmd, idx, payload))
  end

  def deinit()
    tasmota.remove_cmd('NPBoost')
    tasmota.remove_cmd('NPAux')
  end
end

neopool_commands = NeoPoolCommands()
```

To activate the new commands go to WebGUI "Consoles" / "Berry Scripting console" and execute

```python
load("neopool.be")
```

If you want get the new commands available after a restart of your ESP32, store the load command into the special file
 `autoexec.be`:

ESP32 file `autoexec.be`:    
```python
load("neopool.be")
```
