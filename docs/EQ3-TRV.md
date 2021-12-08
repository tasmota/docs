This driver alows the control of Eqiva TRV's (i.e. Thermostat Radiator Valve). Compatible models are:

* Eqiva eQ-3 Bluetooth Smart (141771E0/141771E0A)
* Eqiva eQ-3 Bluetooth Smart(UK Version) (142461D0)

Other Eqiva EQ3 models should work as well, but make sure you select a Bluetooth model as there are also non-Bluetooth models.

### Compiling from source
In order to have EQ3 valves working when compiling from source you need to add these define in `user_config_override.h`:
```
#ifdef USE_EQ3_ESP32
   #undef USE_EQ3_ESP32
#endif
#define USE_EQ3_ESP32
```

### Setup
Before you can use the TRV you will need to enable Bluetooth on the TRV:

1. Press the Mode/Menu button for at least 3 seconds.
1. Select the menu item `bLE` with the control wheel and confirm by pressing the
control wheel shortly.
1. The display will show `OFF` to deactivate the function or `On` to activate the
function.
1. Confirm by pressing the control wheel shortly.
 
!!! Note "Note: No need to pair the TRV"

Next you will need to make sure that BLE is enabled in Tasmota:

1. Configuration
1. Configure BLE
1. Enable Bluetooth

To determine the mac addresses of a TRV:

1. Go to the BLE menu in Tasmota
1. Enable active scan
1. In to the tasmota console: TRV devlist

This will give you the mac address of each valve.

!!! note

    * Enable 1 valve at a time as this makes it easier to identify
    * You might need to wait a minute or so or repeat the "TRV devlist" command a few times before the devices have been properly identified
    * Keep in mind that the TRV does NOT report the current temperature, only the requested, target, temperature. The Xiaomi Thermometer LYWSD03MMC makes a perfect combo for measuring the room temperature (~USD 4)

### Operating your TRV

There are 2 ways to control your TRV:

* The Tasmota Console (convenient for setup)<br>
    syntax: `TRV <MAC Address> <command> [options]`<br>
    example: `TRV 001A2216A458 settemp 21.5`
* MQTT:<br>
    syntax: `cmnd/<tasmota_topic>/EQ3/<MAC Address>/command [options]`<BR>
    example: `cmnd/ble_esp32/EQ3/001A2216A458/settemp 22.5`

As you can see from the example the MQTT topic is made of:

* Standard Tasmota `%prefix%` : `cmnd`, `stat`
* `%topic%` of the BLE_ESP32 gateway device, here `ble_esp32`
* An `EQ3` element to specify this command is specific to the EQ3 driver
* The MAC address of the EQ3
* The command to the EQ3 or result from the EQ3

After submitting a command you will see one or more of the possible results.<BR>

Status|Description
:---|:---
queued|Command has been accepted by the BLE driver
DONENOTIFIED|Command has been successfully processed by the TRV and the results are send in a json format
ignoredbusy|Currently we can only accept a single command in the queue, during the processing of a TRV command subsequent commands will be rejected. Please resubmit.
FAILCONNECT|After 3 automatic retries we were not able to contact the TRV and we give up. Please resubmit

Under normal circumstance you will get a response from the valve (blestate DONENOTIFIED).
``` json
{
    "TRV":"00:1a:22:16:a4:58",
    "blestate":"DONENOTIFIED",
    "raw":"02010900041C000000001803201707",
    "temp":14.0,
    "posn":0,
    "mode":"manual",
    "boost":"inactive",
    "dst":"set",
    "window":"closed",
    "state":"unlocked",
    "battery":"GOOD",
    "holidayend":"00-00-00 00:00"
}
```

Field|Description
:---|:---
TRV|mac address (should be the same as in the topic)
blestate|ble driver status queued/DONENOTIFIED/ignoredbusy/FAILCONNECT
raw|raw data as received from the device
temp|target temperature
posn|valve position (0=closed / 100=fully opened)
mode|manual / auto (auto follows the week program, manual keeps the current requested temperature)
boost|boost mode (valve opened 80 % for 5 minutes) active/inactive
dst|Daylight savings time active active
window|status of the window open functionality (activated when the temperature suddenly drops)
state|child lock enabled (disables the buttons on the TRV)
battery|battery status of the TRV
holidayend|end of holiday mode

### Available commands

#### Base commands
Command|Parameters
:---|:---
TRVperiod<a class="cmnd" id="TRVperiod"></a>|Display/Set the EQ3 poll interval in seconds
TRVonlyaliased<a class="cmnd" id="TRVonlyaliased"></a>|Display/Set the EQ3 OnlyAliased parameter<BR>set to 1 for any aliased BLE devices<BR>set to 2 for only aliases starting with `EQ3`
TrvMatchPrefix<a class="cmnd" id="TRVmatchprefix"></a>|Display/Set the EQ3 MatchPrefix parameter<BR>set to 1 to not require active scan to identify EQ3 - identify from MAC (default)<BR>Set to 0 to disable this matching

#### TRV subcommands

Command|Parameters
:---|:---
devlist<a class="cmnd" id="devlist"></a>|Display all TRV's which have been found in BLE scan mode.<BR>No parameters.
scan<a class="cmnd" id="blescan"></a>|Alias of devlist.<BR>No parameters.
state<a class="cmnd" id="state"></a>|Current valve state without changing anything.<BR>No parameters.
settemp<a class="cmnd" id="settemp"></a>|Set the desired target temperature.<BR>**Temperature**.
valve<a class="cmnd" id="valve"></a>|Control the valve state.<BR>**off** Disable the TRV and enable frost protection<BR>**on** Disable the TRV and open the valve completely (saves potentially battery in summer while the central heating is not working).
mode<a class="cmnd" id="mode"></a>|Define the current operating mode.<BR>**auto** run the week program as stored in the TRV.<BR>**day** Comfort temperature.<BR>**night** Reduction temperature.<BR>**Manual** disable the week program and keep the temperature as selected (settemp/day/night).<BR>Note: When setting a temperature, switch to day or night mode, the TRV will switch back to the program at the next programmed timeslot.
setdaynight<a class="cmnd" id="setdaynight"></a>|Change the comfort and reduction temperature.<BR>**daytemp nighttemp**.
boost<a class="cmnd" id="boost"></a>|Activate boost mode (valve 80% open for 5 minutes).<BR>**1**<br>Note: once activated, boost mode cannot be stopped until end of the 5 minutes.
lock<a class="cmnd" id="lock"></a>|Enable or disable TRV buttons.<BR>**0** Unlocks buttons<br>**1** Locks buttons.
settime<a class="cmnd" id="settime"></a>|Synchronize current tasmota time to the TRV:<BR>No parameters.<BR>Send an alternate time to the TRV:<BR>**yyMMddhhmmss**<BR>(byte by byte conversion from decimal to hexadecimal).

#### Examples
Request the current status without changing anything:
```
cmnd/tasmota/EQ3/001A2216A458/state
```

set a target temperature (21.5 c)
```
cmnd/tasmota/EQ3/001A2216A458/settemp 21.5
```

Select TRV mode auto: run the week program as stored in the TRV
```
cmnd/tasmota/EQ3/001A2216A458/mode auto
```

Select TRV mode Day: Switch to comfort temperature
```
cmnd/tasmota/EQ3/001A2216A458/mode day
```

Select TRV mode Night: Switch to reduction temperature
```
cmnd/tasmota/EQ3/001A2216A458/mode night
```

Select TRV mode Manual: disable the week program and keep the temperature as selected (settemp/day/night)
```
cmnd/tasmota/EQ3/001A2216A458/mode manual
```

!!! Note
    When setting a temperature, switch to day or night mode, the TRV will switch back to the program at the next programmed timeslot.

Disable the TRV and enable frost protection:
```
cmnd/tasmota/EQ3/001A2216A458/valve off
```

Disable the TRV and open the valve completely (saves potentially battery in summer while the central heating is not working):
```
cmnd/tasmota/EQ3/001A2216A458/valve on
```

Change the comfort and reduction temperature to 22C and 17.5C
```
cmnd/tasmota/EQ3/001A2216A458/setdaynight 22 17.5
```

Enable boost mode (valve 80% open for 5 minutes)
```
cmnd/tasmota/EQ3/001A2216A458/boost 1
```

Disable TRV buttons  
```
cmnd/tasmota/EQ3/001A2216A458/lock 1
```

Synchronize current tasmota time with the TRV
```
cmnd/tasmota/EQ3/001A2216A458/settime
```

Set the time and date (byte by byte conversion from decimal to hexadecimal)

* Date:   2021 - jan - 04 - 13:00:00
* In hex:   15 - 01  - 04 - 0d:00:00  (yyMMddhhmmss)
* Concatenate: 1501040d0000 

```
cmnd/tasmota/EQ3/001A2216A458/settime 1501040d0000
```
