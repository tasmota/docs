# Sugar Valley NeoPool Controller

??? failure "This feature is not included in precompiled binaries"  

    When [compiling your build](Compile-your-build) add the following to `user_config_override.h`:
    ```arduino
    #ifndef USE_NEOPOOL
    #define USE_NEOPOOL                       // Add support for Sugar Valley NeoPool Controller - also known under brands Hidrolife, Aquascenic, Oxilife, Bionet, Hidroniser, UVScenic, Station, Brilix, Bayrol and Hay (+6k flash, +60 mem)
    #endif
    ```

[Sugar Valley](https://sugar-valley.net/en/productos/) NeoPool are water treatment systems also known under the names Hidrolife, Aquascenic, Oxilife, Bionet, Hidroniser, UVScenic, Station, Brilix, Bayrol and Hay.
It uses a [RS485](https://en.wikipedia.org/wiki/RS-485) interface with the [Modbus](https://en.wikipedia.org/wiki/Modbus) data protocol for enhancement equipment like Wifi-Interface or a second attached control panel. All functions and parameters can be queried and controlled via this bus interface.

The Tasmota Sugar Valley NeoPool Controller sensor module shows the most of parameters such as the built-in display:

![](_media/xsns_83_neopool_s.png)

There are [Tasmota commands](#commands) implemented to control the high level functions for filtration, light and system parameters such as pH set point, hydrolysis level, redox set point etc.
However, the sensor also provides low-level commands to directly [read](#NPRead) and [write](#NPWrite) NeoPool register, means that you have the option to implement your own commands via home automation systems or by using the Tasmota build-in possibilities [Rules](Commands.md#rules) with [Backlog](Commands.md#the-power-of-backlog) or the powerful Berry language on ESP32.

## Connection

The NeoPool controller uses a RS485 interface, the ESP has RS232 interfaces. Both are serial interfaces but with different physical specifications. Therefore to connect your NeoPool controller to an ESP82xx/32 you need a TTL-UART to RS485 converter. For an ESP8266 it is recommended to use GPIO1 and GPIO3, because the ESP then uses the serial interface of the hardware.

![](_media/xsns_83_neopool_schematic.png)

### Using M5Stack Atom Lite with Tail485 addon

This is the easiest and the most comfortable way to run Tasmota with the Sugar Valley system. The combination of a [M5Stack Atom Lite](https://docs.m5stack.com/en/core/atom_lite) and the [Tail485](https://docs.m5stack.com/en/atom/tail485) addon is very small, does not need a separate power supply (because it is powered from the Sugar Valley system) and can even be placed directly next to the system or in the junction box itself. 

For this you will need:

- a [M5Stack Atom Lite](https://docs.m5stack.com/en/core/atom_lite)<BR>![](_media/xsns_83_neopool_m5stack_atom_lite.png)
- a [Tail485](https://docs.m5stack.com/en/atom/tail485)<BR>![](_media/xsns_83_neopool_tail485.png)
- a 4 wire dupont cable or 4 wire cable using a 5 pin 2,54 mm JST connector<BR>![](_media/xsns_83_neopool_tail485_cable.png)<BR>(see also [Sugar Valley connection](#sugar-valley-connection))<BR>
  - Sugar Valley pin 1 (+12V) goes to Tail485 pin 12V (9-24V)
  - Sugar Valley pin 3 (Modbus A+) goes to Tail485 pin A
  - Sugar Valley pin 4 (Modbus B-) goes to Tail485 pin B
  - Sugar Valley pin 5 (Modbus GND) goes to Tail485 pin GND

For final use, put the whole thing together:

![](_media/xsns_83_neopool_m5stack_atom_lite_tail485_cable.png)

To get this combination running:

- compile your own Tasmota including the NeoPool driver as described under the red note `"This function is not included in precompiled binaries"` at the very top of this page and flash your this to your M5STack Atom Lite using USB
- make the configuration steps [M5Stack Atom Lite with Tail485 template](#m5stack-atom-lite-with-tail485-template)
- turn off the Sugar Valley device and plug the 4-wire dupont or 5 pin JST cable into the [WIFI](using-wifi-port) or (EXTERN)[#using-extern-port] port
- turn on the Sugar Valley device

That's all.

### Using any other ESP

The following TTL UART to RS485 converter have been tested with both an ESP8266 and ESP32 using a Vcc of 3.3V:

![](_media/xsns_83_neopool_rs485_1_s.png) ![](_media/xsns_83_neopool_rs485_2_s.png)

!!! note
    Your TTL UART to RS485 converter must be able to work with an operating voltage of 3.3V. Some converters are not designed for operating with 3.3V and only works with 5V TTL level - these converters are useless. __Do not operate your TTL UART to RS485 converter with 5V__, your converter __must be operated with the 3.3V__ from ESP, otherwise the ESP GPIO ports will be damaged.

### Sugar Valley connection

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

#### Using WIFI Port

![](_media/xsns_83_neopool_connector_wifi.jpg)

#### Using EXTERN Port

![](_media/xsns_83_neopool_connector.jpg)

!!! note
    Leave the define for `NEOPOOL_MODBUS_ADDRESS` set to 1 whether you are using the "WIFI" or "EXTERNAL" port (unless you have changed the parameters for it within your Sugar Valley device).

## Configuration

### Tasmota settings

The configuration is limited to the assignment of two GPIOs under Tasmota **_Configuration -> Configure Module_**:

- change the Module type to `Generic (0)` - this will restart your Tasmota
- After restart set<BR>
  - GPIO1 to `NeoPool RX`<BR>
  - GPIO3 to `NeoPool TX`

![](_media/xsns_83_neopool_config.png)

Don't be surprised that Rx seems to be connected to Tx here (and vice versa). The Rx and Tx designations are to be considered from the point of view of the respective devices, which can be confusing.

### M5Stack Atom Lite with Tail485 template

For this combination use a template, got to Console and enter the command below:

```
Template {"NAME":"NeoPool","GPIO":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,0,0,6976,0,0,0,0,0,7008,1,0,0,0,0,0,0],"FLAG":0,"BASE":1}
```

This also allows the later use of the additonal GPIOs 19, 21 - 23 and 33 for other purposes (sensors or similar).

After a restart active the template using command `Module 0`.

### Final check

After Tasmota restarts, the main screen should display the controller data as shown above. If not, check that the A+/B pins aren't swapped and that the Rx/Tx pins are on the correct GPIOs - swap once if in doubt.

## SENSOR data

Sensor data is sent via the Tasmota topic `tele/%topic%/SENSOR` in JSON format every [TelePeriod](Commands.md#teleperiod) interval. To get the data immediately, use the Tasmota [TelePeriod](Commands.md#teleperiod) command without parameter:

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
    "Powerunit": {
      "Version": "V3.45",
      "NodeID": "XXXX XXXX XXXX XXXX XXXX 442A",
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
      "Setpoint": 100,
      "Max": 100,
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

### SENSOR data description

Key|Details
:---|:---
Time|(String) Device time
Type|(String) Model description (`Hidrolife`, `Aquascenic`, `Oxilife`, `Bionet`, `Hidroniser`, `UVScenic`, `Station`, `Brilix`, `Generic`, `Bayrol` or `Hay`)
Module|(Bool) These subkeys indicate whether the corresponding module is installed and activated (`1`) or not (`0`)
Temperature|(Float) Temperature value from temperature sensor (only available if temperature sensor is installed)
Powerunit.Version|(String) The firmware version of the power unit module
Powerunit.NodeID|(String) The NodeID of your device (default hidden, do not publish your NodeID). See [`SetOption157`](Commands.md#setoption157)
Powerunit.5V|(Float) Voltage value of the 5 Volt output
Powerunit.12V|(Float) Voltage value of the 12 Volt output
Powerunit.24-30V|(Float) Voltage value of the 24-30 Volt output
Powerunit.4-20mA|(Float) Current value of the 4-20mA output
pH.Data|(Float) Current pH value (`0`..`14`)
pH.Min|(Float) Minimum setting value for pH control (only useful if a base pump is connected).
pH.Max|(Float) Maximum setting value for pH control (only useful if an acid pump is connected).
pH.State|(Int) Status of the pH controller:<BR>`0` = no alarm<BR>`1` = pH too high: pH value is 0.8 points higher than the setpoint (PH1 on acid systems, PH2 on base systems, PH1 on acid+base systems)<BR>`2` = pH too low: pH value is 0.8 points lower than the set point value set in (PH1 on acid systems, PH2 on base systems, PH2 on acid+base systems)<BR>`3` = pH pump has exceeded the working time set by the MBF_PAR_RELAY_PH_MAX_TIME parameter and has stopped<BR>`4` = pH higher than the set point (PH1 + 0.1 on acid systems, PH2 + 0.1 on base systems, PH1 on acid+base systems)<BR>`5` = pH lower than the set point  (PH1 - 0.3 on acid systems, PH2 - 0.3 on base systems, PH2 on acid+base systems)<BR>`6` = Tank level alarm
pH.Pump|(Int) pH control module and controlling pumps:<BR>`0` = pH control module and controlling pumps inactive<BR>`1` = Acid/base pH pump pump on<BR>`2` = Acid/base pH pump pump off
pH.FL1|(Bool) Water flow status:<BR>`0` = No flow alarm<BR>`1` = Flow alarm
pH.Tank|(Bool) Acid/Base tank signal input:<BR>`0` = Tank empty<BR>`1` = No Tank alarm
Redox.Data|(Int) Current redox value [mV]
Redox.Setpoint|(Int) Redox target [mV]
Chlorine.Data|(Float) Current chlorine value [ppm]
Chlorine.Setpoint|(Float) Chlorine target production level [ppm]
Conductivity|(Int) Current conductivity level [%]
Ionization.Data|(Int) Current ionization level
Ionization.Setpoint|(Int) Ionization target production level
Ionization.Max|(Int) Ionization maximum production level (system defined)
Hydrolysis.Data|(Float/Int) Hydrolysis current production level
Hydrolysis.Unit|(String)  Hydrolysis unit ("g/h" or "%")
Hydrolysis.Setpoint|(Float/Int) Hydrolisis target production level
Hydrolysis.Max|(Float/Int) Hydrolysis maximum production level [g/h|%]
Hydrolysis.Runtime.Total|(String) Cell total runtime (format _dd_T_hh_:_mm_:_ss_)
Hydrolysis.Runtime.Part|(String) Cell partly runtime
Hydrolysis.Runtime.Pol1|(String) Cell runtime for polarization 1
Hydrolysis.Runtime.Pol2|(String) Cell runtime for polarization 2
Hydrolysis.Runtime.Changes|(Int) Number of polarization changes
Hydrolysis.State|(String) Cell state:<BR>`OFF` = Cell inactive<BR>`FLOW` = Cell water flow alarm<BR>`POL1` = Cell polarization 1 active<BR>`POL2` = Cell polarization 2 active
Hydrolysis.Cover|(Bool) Cover signal input:<BR>`0` = Cover input inactive<BR>`1` = Cover input active
Hydrolysis.Boost|(Int) Boost mode state:<BR>`0` = Boost mode inactive<BR>`1` = Boost mode active with redox control<BR>`2` = Boost mode active without redox control
Hydrolysis.Low|(Bool) Hydrolysis low alarm:<BR>`0` = No alarm<BR>`1` = Hydrolysis cannot reach the set point
Filtration.State|(Int) Filtration pump state:<BR>`0` = Pump off<BR>`1` = Pump on
Filtration.Speed|(Int) Filtration pump speed:<BR>`1` = Low<BR>`2` = Middle<BR>`3` = High
Filtration.Mode|(Int) Filtration mode:<BR>`0` = Manual<BR>`1` = Auto<BR>`2` = Heating<BR>`3` = Smart<BR>`4` = Intelligent<BR>`13` = Backwash operation
Light|(Bool) Light state:<BR>`0` = Light off<BR>`1` = Light on
Relay|Relay state values (`0` = off, `1` = on):
Relay.State|(Array) Relay states for all possible seven relays 1-7 (functional independent)
Relay.Aux|(Array) Relay states for the 4 Aux relais (these are the same as `Relay.State` 4-7 - functional independent)
Relay.Acid|(Bool) Acid relay state
Relay.Base|(Bool) Base relay state
Relay.Redox|(Bool) Redox relay state
Relay.Chlorine|(Bool) Chlorine relay state
Relay.Conductivity|(Bool) Conductivity relay state
Relay.Heating|(Bool) Heating relay state
Relay.UV|(Bool) UV relay state
Relay.Valve|(Bool) Valve relay state

The JSON values `pH`, `Redox`, `Hydrolysis`, `Chlorine`, `Conductivity` and `Ionization` are only available if the corresponding module is installed in the device (the corresponding "Module" subkey must be `1`).

The `Relay` subkeys `Acid`, `Base`, `Redox`, `Chlorine`, `Conductivity`, `Heating`, `UV` and `Valve` are only available if the related function is assigned to a relay.

To check which modules are installed use the `Module` value from SENSOR topic or query it manually by using the [NPControl command](#NPControl):

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

Key|Details
:---|:---
Modules|(Bool) These subkeys indicate whether the corresponding module is installed and activated (`1`) or not (`0`)
Relays|(Bool) These subkeys indicate whether the corresponding relay is active (`1`) or not (`0`) regardless of whether a relay is assigned or not.

## Commands

This sensor supports some high-level [commands](#commands) for end user.

Regardless, all other Modbus registers can be read and write, so you can [enhance](#Enhancements) your Sugar Valley control by using low-level [NPRead](#NPRead)/[NPWrite](#NPWrite) commands.

Modbus register addresses and their meaning are described within source file [xsns_83_neopool.ino](https://github.com/arendst/Tasmota/blob/development/tasmota/xsns_83_neopool.ino) at the beginning and (partly) within document [171-Modbus-registers](https://downloads.vodnici.net/uploads/wpforo/attachments/69/171-Modbus-registers.pdf).<BR>
Please note that Sugar Valley Modbus registers are not byte addresses but modbus registers containing 16-bit values - don't think in byte memory layout.

Command|Parameters
:---|:---
NPFiltration<a id="NPFiltration"></a>|`{<state> {speed}}`<BR>get/set manual filtration (state = `0` or `1`, speed = `1..3`). Get if state is omitted, otherwise set accordingly  `<state>`:<ul><li>`0` - manual turn filtration pump off</li><li>`1` - manual turn filtration pump on</li></ul>optional speed control is possible for non-standard filtration types:<ul><li>`1` - slow</li><li>`2` - medium</li><li>`3` - fast</li></ul>
NPFiltrationmode<a id="NPFiltrationmode"></a>|`{<mode>}`<BR>get/set filtration mode (mode = `0..4` or `13`). Get if mode is omitted, otherwise set accordingly `<mode>`:<ul><li>`0` - *MANUAL*<BR>allows to turn the filtration (and all other systems that depend on it) on and off</li><li>`1` - *AUTO*<BR>allows filtering to be turned on and off according to the settings of the *MBF_PAR_TIMER_BLOCK_FILT_INT* timers.</li><li>`2` - *HEATING*<BR>similar to the AUTO mode, but includes setting the temperature for the heating function. This mode is activated only if the BF_PAR_HEATING_MODE register is at 1 and there is a heating relay assigned.</li><li>`3` - *SMART*<BR>adjusts the pump operating times depending on the temperature. This mode is activated only if the MBF_PAR_TEMPERATURE_ACTIVE register is at 1.</li><li>`4` - *INTELLIGENT*<BR>performs an intelligent filtration process in combination with the heating function. This mode is activated only if the MBF_PAR_HEATING_MODE register is at 1 and there is a heating relay assigned.</li><li>`13` - *BACKWASH*<BR>started when the backwash operation is activated.</ul>
NPFiltrationspeed<a id="NPFiltrationspeed"></a>|`{<speed>}`<BR>(only available for non-standard filtration types)<BR>get/set manual filtration speed (speed = `1..3`)<BR>get filtration speed if `<speed>` is omitted, otherwise set new `<speed>`:<ul><li>`1` - Low</li><li>`2` - Mid</li><li>`3` - High</li></ul>
NPTime<a id="NPTime"></a>|`{<time>}`<BR>get/set device time. Get if time is omitted, otherwise set device time accordingly `<time>`:<ul><li>`0` - sync with Tasmota local time</li><li>`1` - sync with Tasmota utc time</li><li>`2..4294967295` - set time as epoch</li></ul>
NPLight<a id="NPLight"></a>|`{<state> {delay}}`<BR>get/set light (state = `0..4`, delay = `5..100` in 1/10 sec). Get if state is omitted, otherwise set accordingly `<state>`:<ul><li>`0` - manual turn light off</li><li>`1` - manual turn light on</li><li>`2` - manual toggle light</li><li>`3` - switch light into auto mode according MBF_PAR_TIMER_BLOCK_LIGHT_INT settings</li><li>`4` - select light RGB LED to next program. This is normally done by power the light on (if currently off), then power off the light for a given time (delay) and power on again. The default delay is 15 (=1.5 sec).</ul>
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
NPCLRes<a id="NPCLRes"></a>|`{<digits>}`<BR>get/set number of digits in results for CL value (digits = `0..3`).
NPIONRes<a id="NPIONRes"></a>|`{<digits>}`<BR>get/set number of digits in results for ION value (digits = `0..3`).
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
NPFiltrationmode
RESULT = {"NPFiltrationmode":"Manual"}
```

!!! example
    Set filtration mode

```json
NPFiltrationmode 1
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
    Enable additional factory menu

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


### ESP82xx/ESP32: Add buttons for filtration and light control

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

The class `NeoPoolCommands` below adds three new commands to Tasmota:

Command|Parameters
:---|:---
NPBoost<a id="NPBoost"></a>|`{<state>}`<BR>get/set boost mode (state = `0..2`). Get if state is omitted, otherwise set accordingly  `<state>`:<ul><li>`0` - disable boost mode</li><li>`1` - enable boost mode (without redox control)</li><li>`2` - enable boost mode (with redox control)</li></ul>
NPAux<x\><a id="NPAux"></a>|`{<state>}`<BR>get/set auxiliary relay <x\> (state = `0..2`). Get if state is omitted, otherwise set accordingly  `<state>`:<ul><li>`0` - switch off auxiliary relay</li><li>`1` - switch on auxiliary relay</li></ul>
NPVersion<a id="NPVersion"></a>|Get the firmware info as array (normally firmware version and creation date)

The class can be used as a template for further commands.

Store the following code into a Tasmota file by using the WebGUI "Console" / "Manage File system".

#### neopoolcmd.be

```python
# File: neopoolcmd.be
#
# Add commands NPBoost, NPAux and NPVersion

# Neopool definitions
MBF_POWER_MODULE_REGISTER = 0x000C
MBF_POWER_MODULE_DATA = 0x000D
var MBF_RELAY_STATE = 0x010E
var MBF_NOTIFICATION = 0x0110
var MBF_CELL_BOOST = 0x020C

var MBF_PAR_TIMER_BLOCK_AUX1_INT1 = 0x04AC
var MBF_PAR_TIMER_BLOCK_AUX2_INT1 = 0x04BB
var MBF_PAR_TIMER_BLOCK_AUX3_INT1 = 0x04CA
var MBF_PAR_TIMER_BLOCK_AUX4_INT1 = 0x04D9
var PAR_TIMER_BLOCK_AUX = [
  MBF_PAR_TIMER_BLOCK_AUX1_INT1,
  MBF_PAR_TIMER_BLOCK_AUX2_INT1,
  MBF_PAR_TIMER_BLOCK_AUX3_INT1,
  MBF_PAR_TIMER_BLOCK_AUX4_INT1
]
var MBV_PAR_CTIMER_ALWAYS_ON      = 3
var MBV_PAR_CTIMER_ALWAYS_OFF     = 4

import string
import json

# NeoPool command class
class NeoPoolCommands
  var TEXT_OFF
  var TEXT_ON
  var TEXT_TOGGLE

  # string helper
  def ltrim(s)
    var i = 0 while(s[i]==' ') i += 1 end
    return string.split(s, i)[1]
  end
  def rtrim(s)
    return string.split(s, " ")[0]
  end
  def trim(s)
    return self.rtrim(self.ltrim(s));
  end

  def Param(payload, p2)
    var parm, res
    try
      parm = string.toupper(self.trim(payload))
    except ..
      parm = ""
    end
    if parm != ""
      if string.find(parm, 'OFF')>=0 || string.find(parm, self.TEXT_OFF)>=0 || string.find(parm, '0')>=0
        res = 0
      elif string.find(parm, 'ON')>=0 || string.find(parm, self.TEXT_ON)>=0 || string.find(parm, '1')>=0
        res = 1
      elif string.find(parm, p2)>=0 || string.find(parm, '2')>=0
        res = 2
      else
        res = -1
      end
    else
      res = nil
    end
    parm = nil
    tasmota.gc()
    return res
  end

  #- NPBoost OFF|0|ON|1|REDOX|2
      0|OFF:   Switch boost off
      1|ON:    Switch boost on without redox control
      2|REDOX: Switch boost on with redox control
  -#
  def NPBoost(cmd, idx, payload)
    var ctrl, parm
    parm = self.Param(payload, 'REDOX')
    if parm != nil
      if 0 == parm
        ctrl = 0
      elif 1 == parm
        ctrl = 0x85A0
      elif 2 == parm
        ctrl = 0x05A0
      else
        tasmota.resp_cmnd_error()
        return
      end
      tasmota.cmd(string.format("NPWrite 0x%04X,0x%04X", MBF_CELL_BOOST, ctrl))
      tasmota.cmd("NPSave")
      tasmota.cmd("NPExec")
      tasmota.cmd(string.format("NPWrite 0x%04X,0x7F", MBF_NOTIFICATION))
    else
      try
        ctrl = compile("return "..tasmota.cmd(string.format("NPRead 0x%04X", MBF_CELL_BOOST)).find('NPRead', json.load('{"Data": "0x0000"}')).find('Data', 0))()
      except ..
        tasmota.resp_cmnd_error()
        return
      end
    end
    tasmota.resp_cmnd(string.format('{"%s":"%s"}', cmd, ctrl == 0 ? self.TEXT_OFF : (ctrl & 0x8500) == 0x8500 ? self.TEXT_ON : "REDOX"))
  end

  #- NPAux<x> OFF|0|ON|1 t (<x> = 1..4)
      0|OFF:   Switch aux x off
      1|ON:    Switch aux x on
      2|TOGGLE: Toggle Aux x
  -#
  def NPAux(cmd, idx, payload, payload_json, subcmd)
    var ctrl, parm

    if idx < 1 || idx > 4
      tasmota.resp_cmnd_error()
      return
    end
    parm = self.Param(payload, self.TEXT_TOGGLE)
    if parm != nil
      if 0 == parm
        ctrl = MBV_PAR_CTIMER_ALWAYS_OFF
      elif 1 == parm
        ctrl = MBV_PAR_CTIMER_ALWAYS_ON
      elif 2 == parm
        try
          ctrl = (compile("return "..tasmota.cmd(string.format("NPRead 0x%04X", MBF_RELAY_STATE)).find('NPRead', json.load('{"Data": "0x0000"}')).find('Data', 0))() >> (idx+2)) & 1 ? MBV_PAR_CTIMER_ALWAYS_OFF : MBV_PAR_CTIMER_ALWAYS_ON
        except ..
          tasmota.resp_cmnd_error()
          return
        end
      else
        tasmota.resp_cmnd_error()
        return
      end
      tasmota.cmd(string.format("NPWrite 0x%04X,%d", PAR_TIMER_BLOCK_AUX[idx-1], ctrl))
      tasmota.cmd("NPExec")
    else
      try
        ctrl = (compile("return "..tasmota.cmd(string.format("NPRead 0x%04X", MBF_RELAY_STATE)).find('NPRead', json.load('{"Data": "0x0000"}')).find('Data', 0))() >> (idx+2)) & 1
      except ..
        tasmota.resp_cmnd_error()
        return
      end
    end
    if subcmd != nil
      tasmota.resp_cmnd(string.format('{"%s":"%s"}', subcmd, ctrl == (parm != nil ? 4 : 0) ? self.TEXT_OFF : self.TEXT_ON))
    else
      tasmota.resp_cmnd(string.format('{"%s%d":"%s"}', cmd, idx, ctrl == (parm != nil ? 4 : 0) ? self.TEXT_OFF : self.TEXT_ON))
    end
  end

  # NPVersion
  def NPVersion(cmd)
    var verstr = ""
    for i: 0 .. 12
      tasmota.cmd(string.format("NPWrite 0x%04X,%d", MBF_POWER_MODULE_REGISTER, i*2))
      var data = compile("return "..tasmota.cmd(string.format("NPRead 0x%04X", MBF_POWER_MODULE_DATA)).find('NPRead', json.load('{"Data": "0x0000"}')).find('Data', 0))()
      verstr += string.char(data>>8 & 0xFF)
      verstr += string.char(data    & 0xFF)
    end
    var arr = ""
    for i: string.split(verstr,'\n')
      if arr != ""
        arr += ","
      end
      arr += '"'+i+'"'
    end
    tasmota.resp_cmnd(string.format('{"%s":[%s]}', cmd, arr))
  end

  def init()
    # get tasmota settings
    self.TEXT_OFF = tasmota.cmd("StateText1")['StateText1']
    self.TEXT_ON = tasmota.cmd("StateText2")['StateText2']
    self.TEXT_TOGGLE = tasmota.cmd("StateText3")['StateText3']
    # add commands
    tasmota.add_cmd('NPBoost', / cmd, idx, payload -> self.NPBoost(cmd, idx, payload))
    tasmota.add_cmd('NPAux', / cmd, idx, payload -> self.NPAux(cmd, idx, payload))
    tasmota.add_cmd('NPVersion', / cmd -> self.NPVersion(cmd))
  end

  def deinit()
    # remove commands
    tasmota.remove_cmd('NPBoost')
    tasmota.remove_cmd('NPAux')
    tasmota.remove_cmd('NPVersion')
  end
end
neopoolcommands = NeoPoolCommands()
```

To activate the new commands, go to WebGUI "Consoles" / "Berry Scripting console" and execute

```python
load("neopoolcmd.be")
```

### ESP32: Add GUI controls for filtration, light and aux relais

The following enhancements are made using the [Berry Scripting Language](Berry) which is available on ESP32 only.

The class `NeoPoolButtonMethods` below adds new GUI elements to control filtration, light and aux relais:

![](_media/xsns_83_neopool_gui.png)

Store the following code into a Tasmota file by using the WebGUI "Console" / "Manage File system".

####  neopoolgui.be

```python
# File: neopoolgui.be
#
# Add GUI elements for filtration control, light and aux relais

import webserver
import string

class NeoPoolButtonMethods : Driver

  #- method for adding elements to the main menu -#
  def web_add_main_button()

    def selected(value, comp)
      return comp == value ? 'selected=""' : ''
    end

    var html = '<p></p>'

    var speed = tasmota.cmd('NPFiltration').find('Speed', 'invalid')
    var mode = tasmota.cmd('NPFiltrationmode').find('NPFiltrationmode', 'invalid')
    if 'invalid' == speed && 'invalid' == mode
      html+= 'NeoPool device not available'
    else
      # Filtration mode/speed
      html+= '<table style="width:100%"><tbody><tr>'
      html+= '  <td style="width:50%;padding: 0 4px 0 4px;">'
      html+= '    <label for="mode"><small>Mode:</small></label>'
      html+= '    <select id="mode" name="mode">'
      html+= string.format('<option value="m_sv_manual"%s>Manual</option>', selected(mode, 'Manual'))
      html+= string.format('<option value="m_sv_auto"%s>Auto</option>', selected(mode, 'Auto'))
      html+= string.format('<option value="m_sv_heating"%s>Heating</option>', selected(mode, 'Heating'))
      html+= string.format('<option value="m_sv_smart"%s>Smart</option>', selected(mode, 'Smart'))
      html+= string.format('<option value="m_sv_intelligent"%s>Intelligent</option>', selected(mode, 'Intelligent'))
      html+= '    </select>'
      html+= '  </td>'
      html+= '  <td style="width:50%;padding: 0 4px 0 4px;">'
      html+= '    <label for="speed"><small>Speed:</label>'
      html+= '    <select id="speed" name="speed">'
      html+= string.format('<option value="m_sv_slow"%s>Slow</option>', selected(speed, '1'))
      html+= string.format('<option value="m_sv_medium"%s>Medium</option>', selected(speed, '2'))
      html+= string.format('<option value="m_sv_fast"%s>Fast</option>', selected(speed, '3'))
      html+= '    </select>'
      html+= '  </td>'
      html+= '</tr><tr></tr></tbody></table>'
      html+= '<script>'
      html+= 'document.getElementById("speed").addEventListener ("change",function(){la("&"+this.value+"=1");});'
      html+= 'document.getElementById("mode").addEventListener ("change",function(){la("&"+this.value+"=1");});'
      html+= '</script>'

      # Filtration button
      html+= '<table style="width:100%"><tbody><tr>'
      html+= '  <td style="width:100%">'
      html+= '    <button id="bn_filtration" name="bn_filtration" onclick="la(\'&m_sv_filtration=1\');">Filtration</button>'
      html+= '  </td>'
      html+= '</tr><tr></tr></tbody></table>'

      # Light button
      html+= '<table style="width:100%"><tbody><tr>'
      html+= '  <td style="width:100%">'
      html+= '    <button onclick="la(\'&m_sv_light=1\');">Light</button>'
      html+= '  </td>'
      html+= '</tr><tr></tr></tbody></table>'

      # Aux buttons
      html+= '<table style="width:100%"><tbody><tr>'
      html+= '  <td style="width:25%"><button onclick="la(\'&m_sv_aux=1\');">Aux1</button></td>'
      html+= '  <td style="width:25%"><button onclick="la(\'&m_sv_aux=2\');">Aux2</button></td>'
      html+= '  <td style="width:25%"><button onclick="la(\'&m_sv_aux=3\');">Aux3</button></td>'
      html+= '  <td style="width:25%"><button onclick="la(\'&m_sv_aux=4\');">Aux4</button></td>'
      html+= '</tr><tr></tr></tbody></table>'
    end

    webserver.content_send(html)
    html = nil
    speed = nil
    mode = nil
    tasmota.gc()
  end

  #- As we can add only one sensor method we will have to combine them besides all other sensor readings in one method -#
  def web_sensor()
    if webserver.has_arg("m_sv_filtration")
      tasmota.cmd("NPFiltration 2")
    end

    if webserver.has_arg("m_sv_slow")
      tasmota.cmd("NPFiltration 1,1")
    end
    if webserver.has_arg("m_sv_medium")
      tasmota.cmd("NPFiltration 1,2")
    end
    if webserver.has_arg("m_sv_fast")
      tasmota.cmd("NPFiltration 1,3")
    end

    if webserver.has_arg("m_sv_manual")
      tasmota.cmd("NPFiltrationmode 0")
    end
    if webserver.has_arg("m_sv_auto")
      tasmota.cmd("NPFiltrationmode 1")
    end
    if webserver.has_arg("m_sv_heating")
      tasmota.cmd("NPFiltrationmode 2")
    end
    if webserver.has_arg("m_sv_smart")
      tasmota.cmd("NPFiltrationmode 3")
    end
    if webserver.has_arg("m_sv_intelligent")
      tasmota.cmd("NPFiltrationmode 4")
    end

    if webserver.has_arg("m_sv_light")
      tasmota.cmd("NPLight 2")
    end

    if webserver.has_arg("m_sv_aux")
      tasmota.cmd("NPAux"+webserver.arg("m_sv_aux")+" TOGGLE")
    end
  end

  def init()
  end

  def deinit()
  end
end

neopool_driver = NeoPoolButtonMethods()
tasmota.add_driver(neopool_driver)
```

To activate the new gui elements, go to WebGUI "Consoles" / "Berry Scripting console" and execute

```python
load("neopoolgui.be")
```

### ESP32: Make the scripts persistent

If you want the extensions to be activated automatically every time you restart your ESP32, save the `load()` commands into the special file
 `autoexec.be`:

#### autoexec.be

```python
load("neopoolcmd.be")
load("neopoolgui.be")
```
