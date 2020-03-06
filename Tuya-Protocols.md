The MCU communicates with the Wi-Fi module through the serial port. Protocols are classified into basic and functional protocols. 

## Basic protocols 
They are common protocols integrated in Tasmota's TuyaMCU module. They stay the same for each product and are mandatory for Tuya module to work correctly. 

## Functional protocols 
Functional protocols are used for delivering and reporting data of functions. These protocols differ between devices and manufacturers and might require configuration in Tasmota using [`TuyaMCU`](Commands#tuyamcu) command or with [`TuyaSend<x>`](Commands#tuyasend) command.

### Anatomy of functional protocols

|Name|Description|
|---|---|
|Frame Header Version|Fixed value of 0x55aa |
|Command Word | `0x06` - send commands<br>`0x07` - report status|
|Data Length | defines expected length of data
|dpID|numbered ID of a function (DP = Data Point or Define Product)|
|Data Type|[see Data Type table below](#data-type-table)|
|Function Length|length of command|
|Function Command|formatted according to Data Type| 
|Verification Method| checksum = remainder of the byte sum starting from Frame Header to 256|

<a id="data-type-table"></a>
#### Data Type
|Hex|Tasmota Command|Decription|Max length|
|---|---|---|---|
|0x01|TuyaSend1|boolean data `0/1`|1 byte|
|0x02|TuyaSend2|value data. If a value contains less than 4 bytes, 0 is supplemented before|4 bytes|
|0x00|TuyaSend3|string data|unknown|
|0x04|TuyaSend4|enum data `0/1/2/3/4/5`|1 byte|
|0x05|###|fault data, report only|8 bytes|

Let's dissect and explain the MCU protocol using serial command `55aa0006000501010001010e`:

| Frame Header Version | Command Word | Data Length | dpID | Data Type | Function Length | Function Command | Verification Method |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 55aa00| 06| 0005| 01   | 01| 0001| 01| 0e|

This is the command which powers on the device sending Function Command = `1` to dpID 1 (Switch): 
- Frame Header Version = `0x55aa00` which is a fixed value and always the same
- Command Word = `0x06` because we're sending a command
- Data Type = `0x01` since the command sent is a 1 byte boolean
- Function Length = `0x001` instruct 1 character only for function command length
- Function Command = `0x01` in hex which equals `1` in int
- Verification Method = `0e` is calculated

### Protocol flow
On device boot, TuyaMCU executes the required basic protocols and reads the functional protocol data received, which are used to update status of components mapped in TuyaMCU (Relays, dimmer, power monitoring data).

After receiving a command from Tasmota (Command Word `0x06`), the MCU performs corresponding logical control. When the dpID status is changed, the MCU reports the data (Command Word `0x07`) to TuyaMCU component. 

## dpId functions tables
***This information is just for orientation. Functions are assigned by the manufacturer and can be on different dpId's***

- DP ID: dpId.
- Function Point：Used to describe the product function.
- Identifier: Function codename. Can only be letters, numbers and underscores
- Data type：
   - Issue and report: command data can be sent and status data can be reported back to the Wi-Fi module
   - Report only: supports only status reporting, no control options

- Function Type (Referred as Data Type in [TuyaMCU](TuyaMCU) article):
   - Boolean (bool): non-true or false binary variable, such as: switch function, on / off
   - Value (value): suitable for linear adjustment of the type of data, such as: temperature regulation, temperature range 20-40 ℃
   - Enum (enum): custom finite set value, such as: working levels, low / mid / high
   - Fault (fault): dedicated to reporting and statistical failure of the function points. Support multi-fault, the data is reported only
   - Integer（integer）: transmitted as integer
   - Transparent (raw): data in binary 

### Switches or plugs/power strips
```
| DP ID | Identifier  | Data type          | Function type | Properties                                   |
|-------|-------------|--------------------|---------------|----------------------------------------------|
| 1     | switch_1    | Control and report | Boolean       |                                              |
| 2     | switch_2    | Control and report | Boolean       |                                              |
| 3     | switch_3    | Control and report | Boolean       |                                              |
| 4     | switch_4    | Control and report | Boolean       |                                              |
| 5     | switch_5    | Control and report | Boolean       |                                              |
| 9     | countdown_1 | Control and report | Integer       | undefined0-86400, undefined1, Scale0, Unit:s |
| 10    | countdown_2 | Control and report | Integer       | undefined0-86400, undefined1, Scale0, Unit:s |
| 11    | countdown_3 | Control and report | Integer       | undefined0-86400, undefined1, Scale0, Unit:s |
| 12    | countdown_4 | Control and report | Integer       | undefined0-86400, undefined1, Scale0, Unit:s |
| 13    | countdown_5 | Control and report | Integer       | undefined0-86400, undefined1, Scale0, Unit:s |
```

### Aromatherapy machine (Oil Diffuser)
```
| DP ID | Function points          | Identifier     | Data type        | Function type | Properties
| 1     | Switch                   | Power          | Issue and report | Boolean       |                                                                        |
| 6     | Amount of fog            | fog            | Issue and report | Enum          | Enumerated values:small, large|
| 11    | Light                    | Light          | Issue and report | Boolean       | |
| 12    | Fault alarm              | fault          | Only report      | Fault         | Barrier values:1|
| 13    | Countdown                | countdown      | Issue and report | Enum          | Enumerated values: 0, 1, 2, 3|
| 14    | Countdown remaining time | countdown_left | Only report      | Integer       | Values range: 0-360, Pitch1, Scale0, Unit:min|
| 101   | Light mode               | work_mode      | Issue and report | Enum          | Enumerated values: white, colour, scene, scene1, scene2, scene3, scene4 |
| 102   | Color value              | colour_data    | Issue and report | Char type     | *see below |
| 103   | Light mode               | lightmode      | Issue and report | Enum          | Enumerated values: 1, 2, 3|
| 104   | Brightness setting       | setlight       | Issue and report | Integer       | Values range: 0-255, Pitch1, Scale0, Unit:\%|
```
> `colour_data` format of the lights is a string of 14 characters, for example, 00112233334455, where 00 indicates R, 11 indicates G, 22 indicates B, 3333 indicates the hue, 44 indicates the saturation, and 55 indicates the value. The initial value is saved by default. If you do not want to adjust the light, set the data to the maximum value 100% (0x64). The last four characters have fixed values.

### Curtain motor
```
| DP ID | Function points | Identifier    | Data type        | Function type | Properties                                    |
|-------|-----------------|---------------|------------------|---------------|-----------------------------------------------|
| 1     | Percentage      | percent_state | Only report      | Integer       | Values range:0-100, Pitch1, Scale0, Unit:%    |
| 2     | Motor Direction | control_back  | Issue and report | Boolean       |                                               |
| 3     | Auto Power      | auto_power    | Issue and report | Boolean       |                                               |
| 4     | Left time       | countdown     | Issue and report | Enum          | Enumerated values:cancel, 1, 2, 3, 4          |
| 5     | Total Time      | time_total    | Only report      | Integer       | Values range:0-120000, Pitch1, Scale0, Unit:m |
```
> [Complete document on protocols](https://github.com/arendst/Tasmota/files/3658412/protocol_CurtainM_20190926.pdf)

### Power monitoring plug
```
| DP ID | Function points        | Identifier      | Data type          | Function type | Properties                                    |
|-------|------------------------|-----------------|--------------------|---------------|-----------------------------------------------|
| 1     | switch_1               | switch_1        | Control and report | Boolean       |                                               |
| 9     | countdown_1            | countdown_1     | Control and report | Integer       | undefined0-86400, undefined1, Scale0, Unit:s  |
| 17    | statistics Function    | add_ele         | Control and report | Integer       | undefined0-50000, undefined100, Scale3, Unit: |
| 18    | current                | cur_current     | Data report        | Integer       | undefined0-30000, undefined1, Scale0, Unit:mA |
| 19    | power                  | cur_power       | Data report        | Integer       | undefined0-50000, undefined1, Scale1, Unit:W  |
| 20    | voltage                | cur_voltage     | Data report        | Integer       | undefined0-5000, undefined1, Scale1, Unit:V   |
| 21    | test flag              | test_bit        | Data report        | Integer       | undefined0-5, undefined1, Scale0, Unit:       |
| 22    | voltage coefficient    | voltage_coe     | Data report        | Integer       | undefined0-1000000, undefined1, Scale0, Unit: |
| 23    | current coefficient    | electric_coe    | Data report        | Integer       | undefined0-1000000, undefined1, Scale0, Unit: |
| 24    | power coefficient      | power_coe       | Data report        | Integer       | undefined0-1000000, undefined1, Scale0, Unit: |
| 25    | statistics coefficient | electricity_coe | Data report        | Integer       | undefined0-1000000, undefined1, Scale0, Unit: |
| 26    | warning                | fault           | Data report        | Fault         | Barrier values:ov_cr                          |
```

### Dehumidifier
```
| DP ID | Function points | Identifier  | Data type        | Function type | Properties                                               |
|-------|-----------------|-------------|------------------|---------------|----------------------------------------------------------|
| 1     | Switch          | Switch      | Issue and report | Boolean       |                                                          |
| 2     | PM2.5           | PM25        | Only report      | Integer       | Values range:0-999, Pitch1, Scale0, Unit:                |
| 3     | Work mode       | Mode        | Issue and report | Enum          | Enumerated values:Manual, Auto, Sleep                    |
| 4     | Wind speed      | Speed       | Issue and report | Enum          | Enumerated values:speed1, speed2, speed3, speed4, speed5 |
| 5     | Filter usage    | Filter      | Only report      | Integer       | Values range:0-100, Pitch1, Scale0, Unit:%               |
| 6     | Fresh           | Anion       | Issue and report | Boolean       |                                                          |
| 7     | Child lock      | Lock        | Issue and report | Boolean       |                                                          |
| 9     | UV light        | UV          | Issue and report | Boolean       |                                                          |
| 11    | Filter reset    | FilterReset | Issue and report | Boolean       |                                                          |
| 12    | indoor temp     | Temp        | Only report      | Integer       | Values range:-20-50, Pitch1, Scale0, Unit:℃             |
| 13    | Indoor humidity | Humidity    | Only report      | Integer       | Values range:0-100, Pitch1, Scale0, Unit:%               |
```

### Lighting
```
| DP ID | Function points | Identifier    | Data type          | Function type | Properties                                                                 |
|-------|-----------------|---------------|--------------------|---------------|----------------------------------------------------------------------------|
| 1     | Switch          | led_switch    | Control and report | Boolean       |                                                                            |
| 2     | Mode            | work_mode     | Control and report | Enum          | Enumerated values:white, colour, scene, scene_1, scene_2, scene_3, scene_4 |
| 3     | Bright          | bright_value  | Control and report | Integer       | undefined25-255, undefined1, Scale0, Unit:                                 |
| 5     | Colour mode     | colour_data   | Control and report | Char type     |                                                                            |
| 6     | Scene           | scene_data    | Control and report | Char type     |                                                                            |
| 7     | Scene1          | flash_scene_1 | Control and report | Char type     |                                                                            |
| 8     | Scene2          | flash_scene_2 | Control and report | Char type     |                                                                            |
| 9     | Scene3          | flash_scene_3 | Control and report | Char type     |                                                                            |
| 10    | Scene4          | flash_scene_4 | Control and report | Char type     |                                                                            |
```

### Air purifier
```
| DP ID | Function points | Identifier  | Data type        | Function type | Properties                                               |
|-------|-----------------|-------------|------------------|---------------|----------------------------------------------------------|
| 1     | Switch          | Switch      | Issue and report | Boolean       |                                                          |
| 2     | PM2.5           | PM25        | Only report      | Integer       | Values range:0-999, Pitch1, Scale0, Unit:                |
| 3     | Work mode       | Mode        | Issue and report | Enum          | Enumerated values:Manual, Auto, Sleep                    |
| 4     | Wind speed      | Speed       | Issue and report | Enum          | Enumerated values:speed1, speed2, speed3, speed4, speed5 |
| 5     | Filter usage    | Filter      | Only report      | Integer       | Values range:0-100, Pitch1, Scale0, Unit:%               |
| 6     | Fresh           | Anion       | Issue and report | Boolean       |                                                          |
| 7     | Child lock      | Lock        | Issue and report | Boolean       |                                                          |
| 9     | UV light        | UV          | Issue and report | Boolean       |                                                          |
| 11    | Filter reset    | FilterReset | Issue and report | Boolean       |                                                          |
| 12    | indoor temp     | Temp        | Only report      | Integer       | Values range:-20-50, Pitch1, Scale0, Unit:℃              |
| 13    | Indoor humidity | Humidity    | Only report      | Integer       | Values range:0-100, Pitch1, Scale0, Unit:%               |
```

### Heater
```
| DP ID | Function points     | Identifier  | Data type        | Function type | Properties                                 |
|-------|---------------------|-------------|------------------|---------------|--------------------------------------------|
| 1     | Switch              | Power       | Issue and report | Boolean       |                                            |
| 2     | Target temperature  | TempSet     | Issue and report | Integer       | Values range:0-37, Pitch1, Scale0, Unit:℃  |
| 3     | Current Temperature | TempCurrent | Only report      | Integer       | Values range:-9-99, Pitch1, Scale0, Unit:℃ |
| 4     | Mode                | Mode        | Issue and report | Enum          | Enumerated values:m, p                     |
| 5     | Fault alarm         | Fault       | Only report      | Fault         | Barrier values:1, 2, 3                     |
| 6     | Gear position       | gear        | Issue and report | Enum          | Enumerated values:low, mid, high, off      |
| 7     | Conservation        | eco_mode    | Issue and report | Boolean       |                                            |
```

### Smart fan
```
| DP ID | Function points      | Identifier     | Data type        | Function type | Properties                                |
|-------|----------------------|----------------|------------------|---------------|-------------------------------------------|
| 1     | Switch               | switch         | Issue and report | Boolean       |                                           |
| 2     | Wind Speed Level     | fan_speed      | Issue and report | Enum          | Enumerated values:1, 2, 3, 4              |
| 3     | Left-and-Right Swing | fan_horizontal | Issue and report | Enum          | Enumerated values:on, off                 |
| 4     | Up-and-Down Swing    | fan_vertical   | Issue and report | Enum          | Enumerated values:on, off                 |
| 5     | Fault Alarm          | fault          | Only report      | Fault         | Barrier values:1, 2                       |
| 6     | Anion                | anion          | Issue and report | Boolean       |                                           |
| 7     | Humidify             | humidifier     | Issue and report | Boolean       |                                           |
| 8     | Oxygen               | oxygan         | Issue and report | Boolean       |                                           |
| 9     | Child Lock           | lock           | Issue and report | Boolean       |                                           |
| 10    | Cool                 | fan_cool       | Issue and report | Boolean       |                                           |
| 11    | Set Temperate        | temp           | Issue and report | Integer       | Values range:0-50, Pitch1, Scale0, Unit:℃ |
| 12    | Current Temperature  | temp_current   | Only report      | Integer       | Values range:0-50, Pitch1, Scale0, Unit:℃ |
```
### Kettle
```
| DP ID | Function points                                            | Identifier           | Data type        | Function type | Properties                                                          |
|-------|------------------------------------------------------------|----------------------|------------------|---------------|---------------------------------------------------------------------|
| 1     | Working switch                                             | start                | Issue and report | Boolean       |                                                                     |
| 2     | Heat to target temperature shortcut (°C)                   | temp_setting_quick_c | Issue and report | Enum          | Enumerated values:50, 65, 85, 90, 100                               |
| 3     | Heat to target temperature shortcut (°F)                   | temp_setting_quick_f | Issue and report | Enum          | Enumerated values:122, 149, 185, 194, 212                           |
| 4     | Cool to the target temperature shortcut after boiling (°C) | temp_boiling_quick_c | Issue and report | Enum          | Enumerated values:50, 65, 85, 90, 100                               |
| 5     | Cool to the target temperature shortcut after boiling (°F) | temp_boiling_quick_f | Issue and report | Enum          | Enumerated values:122, 149, 185, 194, 212                           |
| 6     | Temperature scale switching                                | temp_unit_convert    | Issue and report | Enum          | Enumerated values:c, f                                              |
| 7     | Insulation switch                                          | switch_keep_warm     | Issue and report | Boolean       |                                                                     |
| 8     | Holding time setting                                       | keep_warm_setting    | Issue and report | Integer       | Values range:0-360, Pitch1, Scale0, Unit:min                        |
| 9     | Mode                                                       | work_type            | Issue and report | Enum          | Enumerated values: setting_quick, boiling_quick, temp_setting, temp_ |
```

### BecaThermostat(WIP)
```
| DP ID | Function points     | Identifier  | Data type        | Function type | Properties                                 |
|-------|---------------------|-------------|------------------|---------------|--------------------------------------------|
| 1     | Switch              | Power       | Issue and report | Boolean       |                                            |
| 2     | Target temperature  | TempSet     | Issue and report | Integer       | Values range:0-37, Pitch1, Scale0, Unit:℃  |
| 3     | Current Temperature | TempCurrent | Only report      | Integer       | Values range:-9-99, Pitch1, Scale0, Unit:℃ |
| 4     | Mode                | Mode        | Issue and report | Enum          | Enumerated values:m, p (wip)               |
| 102   | Floor Temperature   | FloorCurrent| Issue and report | Integer       | Values range:0-37, Pitch1, Scale0, Unit:℃ |
```
