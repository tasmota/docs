This driver allows the control of Eqiva TRV's (i.e. Thermostat Radiator
Valve). Compatible models are:

  - Eqiva eQ-3 Bluetooth Smart (141771E0/141771E0A)
  - Eqiva eQ-3 Bluetooth Smart(UK Version) (142461D0)

Other Eqiva EQ3 models should work as well, but make sure you select a
Bluetooth model as there are also non-Bluetooth models.

### Compiling from source

In order to have EQ3 valves working when compiling from source you need
to add these define in ``user_config_override.h``:

```c
#ifdef USE_EQ3_ESP32
   #undef USE_EQ3_ESP32
#endif
#define USE_EQ3_ESP32
```

### Setup

Before you can use the TRV you will need to enable Bluetooth on the TRV:

1.  Press the Mode/Menu button for at least 3 seconds.
2.  Select the menu item ``bLE`` with the control wheel and confirm by
    pressing the control wheel shortly.
3.  The display will show ``OFF`` to deactivate the function or ``On`` to
    activate the function.
4.  Confirm by pressing the control wheel shortly.

!!! note "Note: No need to pair the TRV"

Next you will need to make sure that BLE is enabled in Tasmota:

1.  Configuration
2.  Configure BLE
3.  Enable Bluetooth

To determine the mac addresses of a TRV:

1.  Go to the BLE menu in Tasmota
2.  Enable active scan
3.  In to the tasmota console: TRV devlist

This will give you the mac address of each valve.

!!! note "Note"
      - Enable 1 valve at a time as this makes it easier to identify
      - You might need to wait a minute or so or repeat the "TRV devlist"
        command a few times before the devices have been properly identified
      - Keep in mind that the TRV does NOT report the current temperature,
        only the requested, target, temperature. The Xiaomi Thermometer
        LYWSD03MMC makes a perfect combo for measuring the room temperature
        (~USD 4)

### Operating your TRV

There are 2 ways to control your TRV:

  - The Tasmota Console (convenient for setup)
    syntax: ``TRV <MAC Address> <command> [options]``
    example: ``TRV 001A2216A458 settemp 21.5``
  - MQTT:
    syntax:
    ``cmnd/<tasmota_topic>/EQ3/<MAC Address>/command [options]``
    example: ``cmnd/ble_esp32/EQ3/001A2216A458/settemp 22.5``

As you can see from the example the MQTT topic is made of:

  - Standard Tasmota ``%prefix%`` : ``cmnd``, ``stat``
  - ``%topic%`` of the BLE\_ESP32 gateway device, here ``ble_esp32``
  - An ``EQ3`` element to specify this command is specific to the EQ3
    driver
  - The MAC address or alias of the EQ3
  - The command to the EQ3 or result from the EQ3

The EQ3 TRV has 3 modes of
operation:

| Mode    | Description                                                                                                                                                                        |
|:---|:---|
| auto    | follows the week program. A temperature different from the week program can be set any time, but at the next programmed timeslot the TRV will switch back to the given temperature |
| manual  | keeps the current requested temperature                                                                                                                                            |
| holiday | keeps the temperature requested for the period of holiday and then switches back to the mode that was active before: *auto* or *manual*                                            |

These 3 modes can be set and configured using different commands
described below. After submitting a command you will see one or more of
the possible
results.

| Status       | Description                                                                                                                                               |
|:---|:---|
| queued       | Command has been accepted by the BLE driver                                                                                                               |
| DONENOTIFIED | Command has been successfully processed by the TRV and the results are send in a json format                                                              |
| ignoredbusy  | Currently we can only accept a single command in the queue, during the processing of a TRV command subsequent commands will be rejected. Please resubmit. |
| FAILCONNECT  | After 3 automatic retries we were not able to contact the TRV and we give up. Please resubmit                                                             |

Under normal circumstance you will get a JSON formatted response from
the valve:

```json
{
  "cmd": "settemp",
  "result": "ok",
  "MAC": "001A2216A458",
  "tas": "ble-esp32-0936",
  "RSSI": -79,
  "stattime": 1642328707,
  "temp": 21.0,
  "posn": 95,
  "mode": "auto",
  "hassmode": "auto",
  "boost": "inactive",
  "dst": "set",
  "window": "closed",
  "state": "unlocked",
  "battery": "GOOD",
  "holidayend": "00-00-00 00:00",
  "windowtemp": 12.0,
  "windowdur": 15,
  "day": 21.0,
  "night": 17.0,
  "offset": 0.0
}
```

If the mode is *holiday,* "holidayend" will show when the holiday period
and mode is about to end:

```json
{
  "mode": "holiday",
  "holidayend": "22-01-19 17:00"
}
```

In the response for the command *setprofile,* "profiledayset" will be
added:

```json
{
  "cmd": "setprofile",
  "profiledayset": 4
}
```

In the response for the command *reqprofile,* "profileday*n*" (n=0…6)
will be
added:

```json
{
  "cmd": "reqprofile",
  "profileday4": "17.0-07:00,23.0-10:00,17.0-17:00,21.0-23:00,17.0-24:00"
}
```

| Field         | Description                                                                                                                                       |
|:---|:---|
| cmd           | recent command the response is given for                                                                                                          |
| MAC           | mac address. It is always the mac address even if an alias was used in the command.                                                               |
| tas           | hostname of your tasmota                                                                                                                          |
| RSSI          | BLE signal strength                                                                                                                               |
| stattime      | seconds since Unix Epoch (January 1st, 1970)                                                                                                      |
| temp          | target temperature                                                                                                                                |
| posn          | valve position (0=closed / 100=fully opened)                                                                                                      |
| mode          | manual / auto / holiday                                                                                                                           |
| hassmode      | mode for Home Assistant usage: auto (=mode *auto*) / off (valve is set to frost protection = off) / heat (valve is open) / idle (valve is closed) |
| boost         | boost mode (valve opened 80 % for 5 minutes): active / inactive                                                                                   |
| dst           | daylight savings time: set / unset                                                                                                                |
| window        | status of the window open functionality (activated when the temperature suddenly drops): open / closed                                            |
| state         | child lock enabled (disables the buttons on the TRV): locked / unlocked                                                                           |
| battery       | battery status of the TRV: GOOD / LOW                                                                                                             |
| holidayend    | end of holiday mode                                                                                                                               |
| windowtemp    | window open temperature                                                                                                                           |
| windowdur     | window open duration                                                                                                                              |
| day           | comfort temperature                                                                                                                               |
| night         | reduction temperature                                                                                                                             |
| offset        | offset temperature                                                                                                                                |
| profiledayset | day the profile was set for: (0 … 9). Only included for command [setprofile](#setprofile)                                                         |
| profileday*n* | profile for the day it just has been requested for. (n=0…6). Only included for command [reqprofile](#reqprofile)                                  |

### Available commands

#### Base commands

| Command                              | Description and parameters                                                                                                                                                  |
|:---|:---|
| TRVperiod<a class="cmnd" id="TRVperiod"></a>           | Display/Set the EQ3 poll interval in seconds. In this intervall to every TRV matching the following critera a *poll* (=[state](#state)) command will be sent automatically. |
| TRVonlyaliased<a class="cmnd" id="TRVonlyaliased"></a> | Display/Set the EQ3 OnlyAliased parameter<br />set to 1 for any aliased BLE devices<br />set to 2 for only aliases starting with ``EQ3``                                                |
| TrvMatchPrefix<a class="cmnd" id="TRVmatchprefix"></a> | Display/Set the EQ3 MatchPrefix parameter<br />set to 1 to not require active scan to identify EQ3 - identify from MAC (default)<br />Set to 0 to disable this matching               |

#### TRV subcommands

| Command                                  | Description and parameters                                                                                                                                                                                                                                                                                                                                                                                                                      |
|:---|:---|
| devlist<a class="cmnd" id="devlist"></a>                   | Display all TRV's which have been found in BLE scan mode.<br />No parameters.                                                                                                                                                                                                                                                                                                                                                                        |
| scan<a class="cmnd" id="blescan"></a>                      | Alias of devlist.<br />No parameters.                                                                                                                                                                                                                                                                                                                                                                                                                |
| state<a class="cmnd" id="state"></a>                       | Current valve state without changing anything. (except the time on the valve)<br />No parameters.<br />Note: If your ESP32 tasmota is not sychronized with a valid date and time, this command will set the wrong time and date to the TRV. See [set](#settime)[time](#settime).                                                                                                                                                                          |
| settemp<a class="cmnd" id="settemp"></a>                   | Set the desired target temperature.<br />**temperature**.                                                                                                                                                                                                                                                                                                                                                                                            |
| valve<a class="cmnd" id="valve"></a>                       | Control the valve state.<br />**off** Enable frost protection<br />**on** Open the valve completely<br />Note: If the current mode is *auto* or *holiday:* at the next programmed timeslot the valve will switch back to the given temperature. To set the valve permanently please use direct commands *on* or *off*.                                                                                                                                         |
| on<a class="cmnd" id="on"></a>                             | Set mode to *manual* and enable frost protection.<br />Note:Temperature will be reported as 30.0 C.                                                                                                                                                                                                                                                                                                                                                  |
| off<a class="cmnd" id="off"></a>                           | Set mode to *manual* and open the valve completely (saves potentially battery in summer while the central heating is not working).<br />Note:Temperature will be reported as 4.5 C.                                                                                                                                                                                                                                                                  |
| mode<a class="cmnd" id="mode"></a>                         | Define the current operating mode.<br />**auto** same as *auto*, see below<br />**manual** same as *manual*, see below.<br />**on** same as *on*, see above.<br />**off** same as *off*, see above.<br />**heat** same as *on*, see above.<br />**cool** same as *off*, see above.<br />Note: The 3rd mode *holiday* can only be set with the [setholiday](#setholiday) command                                                                                                    |
| auto<a class="cmnd" id="auto"></a>                         | Define *auto* as the current operating mode. Run the week program as stored in the TRV. <br />Note: When setting a temperature, switch to day or night temperature: at the next programmed timeslot the TRV will switch back to the given temperature.                                                                                                                                                                                               |
| manual<a class="cmnd" id="manual"></a>                     | Define *manual* as the current operating mode. Disable the week program and keep the temperature as selected with *settemp / day / night*                                                                                                                                                                                                                                                                                                       |
| day<a class="cmnd" id="day"></a>                           | Set to comfort temperature                                                                                                                                                                                                                                                                                                                                                                                                                      |
| night<a class="cmnd" id="night"></a>                       | Set to reduction temperature                                                                                                                                                                                                                                                                                                                                                                                                                    |
| setdaynight<a class="cmnd" id="setdaynight"></a>           | Change the comfort and reduction temperature.<br />**daytemp nighttemp**.                                                                                                                                                                                                                                                                                                                                                                            |
| boost<a class="cmnd" id="boost"></a>                       | Activate boost mode (valve 80% open for 5 minutes).<br />Note: boost mode will stop automatically after 5 minutes.                                                                                                                                                                                                                                                                                                                                   |
| unboost<a class="cmnd" id="unboost"></a>                   | Deactivate boost mode                                                                                                                                                                                                                                                                                                                                                                                                                           |
| lock<a class="cmnd" id="lock"></a>                         | Disable TRV buttons                                                                                                                                                                                                                                                                                                                                                                                                                             |
| unlock<a class="cmnd" id="unlock"></a>                     | Enable TRV buttons                                                                                                                                                                                                                                                                                                                                                                                                                              |
| settime<a class="cmnd" id="settime"></a>                   | Synchronize current tasmota time to the TRV:<br />No parameters.<br />Send an alternate time to the TRV:<br />**yyMMddhhmmss**<br />(byte by byte conversion from decimal to hexadecimal).<br />Note: If your ESP32 tasmota is not sychronized with a valid date and time, this command (with no parameters) will set the wrong time and date to the TRV.                                                                                                                |
| setprofile<a class="cmnd" id="setprofile"></a>             | Set the temperature schedule for the given day. (0=Saturday, 1=Sunday, … 6=Friday)<br />Up to seven pairs of temperature-timeslot (e.g. 20.5-07:30) can be given.<br />**day temperature-timeslot, temperature-timeslot**<br />It is also possible to set a couple of days with one command: use 7=weekend, 8=workday, 9=everyday for this purpose.<br />Note: The last timeslot shall always be -24:00, otherwise a default temperature is used for this timeslot. |
| reqprofile<a class="cmnd" id="reqprofile"></a>             | Read the temperature schedule for the **given day. **(0=Saturday, 1=Sunday, … 6=Friday)<br />**day**                                                                                                                                                                                                                                                                                                                                                 |
| setholiday<a class="cmnd" id="setholiday"></a>             | Define *holiday* as the current operating mode.<br />**end-date,end-time temperature**.<br />*holiday* mode will automatically terminate and resume the former mode and temperature when the end date and time are reached.<br />Note: During this period it makes no sense to apply any commands for setting different temperatures. For manually ending *holiday* mode call *auto* or *manual*. Only then other commands will be accepted again.             |
| setwindowtempdur<a class="cmnd" id="setwindowtempdur"></a> | set window open temperature and duration in minutes.<br />**temperature minutes**.                                                                                                                                                                                                                                                                                                                                                                   |
| offset<a class="cmnd" id="offset"></a>                     | set offset temperature<br />**temperature**                                                                                                                                                                                                                                                                                                                                                                                                          |

#### Examples

Request the current status without changing anything:

```
cmnd/tasmota/EQ3/001A2216A458/state
```

set a target temperature (21.5 C)

```
cmnd/tasmota/EQ3/001A2216A458/settemp 21.5
```

Select TRV mode *auto*: run the week program as stored in the TRV

```
cmnd/tasmota/EQ3/001A2216A458/auto
```

Select TRV mode *manual*: disable the week program and keep the
temperature as selected (settemp/day/night)

```
cmnd/tasmota/EQ3/001A2216A458/manual
```

Select TRV mode *holiday*: suspend the week program or manually applied
temperature until 2022 - Jan - 19 - 17:00 and set the temperature to
18.5 C

```
cmnd/tasmota/EQ3/001A2216A458/setholiday 22-01-19,17:00 18.5
```

Select TRV temperature *day*: Switch to comfort temperature

```
cmnd/tasmota/EQ3/001A2216A458/day
```

Select TRV temperature *night*: Switch to reduction temperature

```
cmnd/tasmota/EQ3/001A2216A458/night
```

!!! note "Note"
    If *auto* is the current mode: When setting a temperature, switch to day
    or night temperature, the TRV will switch back to the temperature
    according the next programmed timeslot.

Disable the TRV and enable frost protection.

Until the next programmed timeslot

```
cmnd/tasmota/EQ3/001A2216A458/valve off
```

Permanently:

```
cmnd/tasmota/EQ3/001A2216A458/off
```

Disable the TRV and open the valve completely (saves potentially battery
in summer while the central heating is not working):

Until the next programmed timeslot

```
cmnd/tasmota/EQ3/001A2216A458/valve on
```

Permanently:

```
cmnd/tasmota/EQ3/001A2216A458/on
```

Change the comfort and reduction temperature to 22 C and 17.5 C

```
cmnd/tasmota/EQ3/001A2216A458/setdaynight 22 17.5
```

Enable boost mode (valve 80% open for 5 minutes)

```
cmnd/tasmota/EQ3/001A2216A458/boost
```

Disable TRV buttons

```
cmnd/tasmota/EQ3/001A2216A458/lock
```

Synchronize current tasmota time with the TRV

```
cmnd/tasmota/EQ3/001A2216A458/settime
```

Set the time and date (byte by byte conversion from decimal to
hexadecimal)

  - Date: 2021 - jan - 04 - 13:00:00
  - In hex: 15 - 01 - 04 - 0d:00:00 (yyMMddhhmmss)
  - Concatenate: 1501040d0000

```
cmnd/tasmota/EQ3/001A2216A458/settime 1501040d0000
```

Set the temperature schedule for day 3 (Tuesday) as

  - 20.5 C until 07:30
  - 17.0 C until 17:00
  - 22.5 C until 22:00
  - 18.0 C until 24:00

```
cmnd/tasmota/EQ3/001A2216A458/setprofile 3 20.5-07:30,17.0-17:00,22.5-22:00,18.0-24:00
```

