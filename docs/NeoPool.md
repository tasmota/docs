# Sugar Valley NeoPool Controller

!!! failure "This feature is not included in precompiled binaries"     

To use it you must [compile your build](Compile-your-build). Add the following to `user_config_override.h`:

```C
#ifndef USE_NEOPOOL
#define USE_NEOPOOL                       // Add support for Sugar Valley NeoPool Controller (+6k flash, +60 mem)
#endif
```

Optional set Modbus address matching the address of your device (default is 1) by add the following to `user_config_override.h`:

```C
#ifndef NEOPOOL_MODBUS_ADDRESS
#define NEOPOOL_MODBUS_ADDRESS       1    // Any modbus address
#endif
```

----

![](https://github.com/curzon01/media/raw/master/pics/neopool_s.png)

Sugar Valley NeoPool are water treatment systems also known under the names Hidrolife, Aquascenic, Oxilife, Bionet, Hidroniser, UVScenic, Station, Brilix, Bayrol and Hay. It uses a RS485 interface for enhancment equipments like Wifi-Interface or a second attached control panel. Most functions and parameters can be queried and controlled via the RS485 interface.

The sensor shows the most of parameters such as the built-in display:

![](https://raw.githubusercontent.com/curzon01/media/master/pics/xsns_83_neopool_s.png)

The function for direct control of the filtration pump and the filtration mode is currently implemented.

However, the driver provides commands to read and write all Modbus registers of the NeoPool controller. This means that everyone has the option of implementing their own commands via their home automation system. The source code describes the known registers.

## Configuration

To get the sensor driver work you need

* connect your NeoPool controller to two GPIO using an UART to RS485 converter
* configure two GPIO using the sensor

### Connection

An TTL UART to RS485 converter module is required to connect the controller to the ESP.

Note that the converter can also work with a voltage of 3.3 V. Some converters are not designed for this and only work with 5 V TTL level (the converter must be operated with the 3.3 V voltage of the ESP, otherwise the ESP GPIO ports will be damaged)

The RS485 connector pins are located under the connection cover, on the Sugar-Valley products on the right-hand side next to the relay connections:

![](https://raw.githubusercontent.com/curzon01/media/master/pics/conn.jpg)

The pin assignment (from top to bottom):


| Pin | Description |
|-----|-------------|
|  1  | +12V        |
|  2  |             |
|  3  | Modbus A+   |
|  4  | Modbus B-   |
|  5  | Modbus GND  |


Please note that the interface also works with 3.3V, because it must be supplied with 3.3V from the ESP side, otherwise the RX / TX outputs of the RS485 interface have incorrect voltage levels - even if this may be in a first test works, sooner or later this leads to the destruction of the GPIOs of the ESP.


### Tasmota settings

In the **_Configuration -> Configure Module_** page assign:

![](https://raw.githubusercontent.com/curzon01/media/master/pics/module%20type_s.png)

GPIO1 to `NeoPool RX`

GPIO3 to `NeoPool TX` 


After a reboot the driver will detect NeoPool controller automatically.

### SENSOR data

Sensor sends a  `tele/%topic%/SENSOR` JSON reponse:

```json
{
  "Time": "2021-01-23T10:10:54+01:00",
  "NeoPool": {
    "Time": "2021-01-23T10:10:48",
    "Type": "Oxilife (green)",
    "Temperature": 21.6,
    "pH": 7.74,
    "Redox": 0,
    "Hydrolysis": 0,
    "Filtration": 0,
    "FiltrationSpeed": 3,
    "Light": 0,
    "Relay": 770
  },
  "TempUnit": "C"
}
```

### Commands

With the sensor command `Sensor83`, in addition to the filtration mode, all known system registers can be read and written in different ways.

For a list of known device register addresses see [171-Modbus-registers](https://downloads.vodnici.net/uploads/wpforo/attachments/69/171-Modbus-registers.pdf) and comments at the beginning (`NeoPoolRegister` and `NeoPoolConstAndBitMask`) of sensor code [xsns_83_neopool.ino](https://github.com/arendst/Tasmota/blob/development/tasmota/xsns_83_neopool.ino)

Command|Parameters
-|-
Sensor83<a id="Sensor83"></a>|`1 <addr> {<cnt>}`<BR>Read 16-bit register (cnt = `1..30`). cnt=1 if omitted.<BR><BR>`2 <addr> <data> {<data>...}`<BR>Write 16-bit register (data = `0..65535|0x0000..0xFFFF`). Use `<data>` max 8 times.<BR><BR>`3 <addr> <bit> {<data>}`<BR>Read/Write register bit (`bit`=`0..15`, `data`=`0|1`). Read if `data` is omitted, otherwise Write<BR><BR>`4 {<state>}`<BR>Get/Set filtration state (state = `0|1`). Get if `state` is omitted, otherwise Set<BR><BR>`5 {<mode>}`<BR>Get/Set filtration mode (`mode`=`0..4|13`). Get if `mode` is omitted, otherwise Set<BR><BR>`6 {<time>}`<BR>Get/Set device time (time = `0..4294967295|0..0xFFFFFFFF`). Get if `time` is omitted, otherwise set accordingly `time`:<ul><li>`0` - sync device time with Tasmota local time</li><li>`1` - sync device time with Tasmota utc time</li><li>`2..4294967295`- set device time as epoch</li></ul><BR>`16 <addr> {<cnt>}`<BR>same as  read 16-bit register (Sensor83 1) but using hex data output<BR><BR>`21 <addr> {<cnt>}`<BR>read 32-bit register (cnt = `1..15`). cnt=1 if omitted.<BR><BR>`22 <addr> <data> {<data>...}`<BR>Write 32-bit register (data = `0..4294967295|0..0xFFFFFFFF`). Use `data` max 8 times.<BR><BR>`26 <addr> (<cnt>}`<BR>same as read 32-bit register (Sensor83 21) but using hex data output

#### Examples

<ul>
<li>Read filtration status `MBF_PAR_FILT_MANUAL_STATE`

```C
Sensor83 1 0x413
RESULT = {"Sensor83":{"Command":1,"Address":"0x0413","Data":0}}
```
</li>

<li>Read Heating setpoint temperature `MBF_PAR_HEATING_TEMP`:

```C
Sensor83 1 0x416
RESULT = {"Sensor83":{"Command":1,"Address":"0x0416","Data":28}}
```
</li>

<li>Read system time `MBF_PAR_TIME_*` as 32-bit register:

```C
Sensor83 21 0x408
RESULT = {"Sensor83":{"Command":21,"Address":"0x0408","Data":1611399658}}
```
</li>

<li>Enable temperature module by setting `MBF_PAR_TEMPERATURE_ACTIVE` and set it permanent by using a write to `MBF_SAVE_TO_EEPROM` (0x02F0):

```C
Backlog Sensor83 2 0x40F,1;Sensor83 2 0x2F0,1
RESULT = {"Sensor83":{"Command":3,"Address":"0x040F","Data":1}}
RESULT = {"Sensor83":{"Command":3,"Address":"0x2F0","Data":1}}
```
</li>

<li>Hide auxiliary relay display from main menu by setting bit 3 `MBMSK_HIDE_AUX_RELAYS` of `MBF_PAR_UICFG_VISUAL_OPTIONS`:

```C
Sensor83 3 0x0605,3,1
RESULT = {"Sensor83":{"Command":2,"Address":"0x0605","Bit":3,"Data":1}}
```
</li>

<li>Read Filtration interval 1-3 (`MBF_PAR_TIMER_BLOCK_FILT_INT1` - `MBF_PAR_TIMER_BLOCK_FILT_INT3`) settings:

```C
Backlog Sensor83 1 0x434;Sensor83 21 0x435 7;Sensor83 1 0x0443;Sensor83 21 0x0444 7;Sensor83 1 0x0452;Sensor83 21 0x0453 7
RESULT = {"Sensor83":{"Command":1,"Address":"0x0434","Data":1}}
RESULT = {"Sensor83":{"Command":21,"Address":"0x0435","Data":[28800,0,86400,14400,0,1,0]}}
RESULT = {"Sensor83":{"Command":1,"Address":"0x0443","Data":1}}
RESULT = {"Sensor83":{"Command":21,"Address":"0x0444","Data":[43200,0,86400,21600,0,1,0]}}
RESULT = {"Sensor83":{"Command":1,"Address":"0x0452","Data":1}}
RESULT = {"Sensor83":{"Command":21,"Address":"0x0453","Data":[0,0,86400,0,0,1,0]}}
```
</li>

<li>Set Filtration interval 1 to daily 9:00 - 12:30 (9:00: 36009 ≙ 32400 / 12:30 ≙ 3,5h = 12600)

```C
Sensor83 22 0x435 32400 0 86400 12600
RESULT = {"Sensor83":{"Command":22,"Address":"0x0435","Data":[32400,0,86400,12600]}}
```
</li>

</ul>