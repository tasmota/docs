# Sonoff SPM

??? tip "This feature is included only in `tasmota32` binaries" 

!!! Warning "Do not use this device as safety fuse!"

!!! Info 
    For ARM firmware upgrades it's advised to make a full backup of the SPM-Main ESP 4M flash firmware before flashing Tasmota.

The Sonoff Smart Stackable Power Meter uses a SPM-Main unit with ESP32 providing Wi-Fi and ethernet connections. A serial interface and a SPI interface connects to an ARM MCU which in turn provides a RS-485 bus to up to 32 SPM-4Relay modules. The SPM-4Relay module contains an ARM MCU too providing independent power management for four bi-stable relays rated for 20A at 240V for a total of 4400W.

!!! Note 
    As of this writing Tasmota v11.1.0.3 supports ARM firmware versions 1.0.0 and 1.2.0.

The firmware monitors the attached SPM-4Relay modules and stores energy usage history for up to 180 days on an optional SD-Card accessible by the ARM MCU only. The ARM firmware provides numerous un-documented functions allowing the ESP32 to send and receive information.

### Background information

More information about the SPM can be obtained here:

- [Sonoff tech product documentation](https://sonoff.tech/product-document/diy-smart-switch-doc/spm-main-spm-4relay-doc/)
- [SPM HTTP API](https://sonoff.tech/product-review/product-insight/get-started-quicklynow-you-can-control-spm-units-via-http-api/)
- [Sonoff DIY mode API](http://developers.sonoff.tech/spm-main-http-api.html)

## Tasmota

Tasmota, installed on the ESP32, can connect to the SPM-Main ARM MCU using the serial interface and provides the following functionality:

- Support for up to 8 SPM-4Relays limited by current register usage
- Power control of all 32 relays using standard features
- Energy usage using standard features
- Overload detection using ARM firmware
- GUI display of rotating relays or a user selected 4Relay module
- Fix firmware max 180 days energy usage by storing daily Energy Total in Tasmota's filesystem
- Mapping physical relays to scanned relays

### Limitations

The following notes currently apply:

- Tasmota is unable to upgrade the ARM firmware. In case an upgrade is wanted install the backed-up sonoff firmware and perform the upgrade using the eWeLink app. Once upgraded make another backup before restoring Tasmota for future ARM firmware upgrades.

## Configuration

In addition to installing the ``tasmota32.bin`` image some configuration might be needed.

### Relay mapping

After a restart the ARM firmware starts to scan for available 4Relay modules. Every module has a unique id which is send to Tasmota in random order. For a user to pinpoint a physical set of four relays it is therefor needed to "map" the scanned modules once. Tasmota stores the id's in a mapping table build using the command ``SSPMMap <scanned module number>,<scanned module number>,..`` where the first entry will map to physical relays 1 to 4, the second entry will map to physical relays 5 to 8 etc. The scanned module information needed is displayed on the console during restart or on request by executing command ``SSPMScan`` with a ``weblog 2`` setting.

!!! Note
    Scanning takes over 20 seconds so be patient
    
Look for the below information during a restart for a two 4Relay module system:

```
00:00:00.123 Project tasmota - Sspm2 Version 11.0.0.1(tasmota)-2_0_2_2(2022-02-18T12:09:05)
00:00:05.191 CFG: SPM loaded from file
00:00:08.305 SPM: Main version 1.0.0 found
13:54:05.392 SPM: 4Relay 1 (mapped to 2) type 130 version 1.0.0 found with id 8B343237393734134B353637
13:54:05.401 SPM: 4Relay 2 (mapped to 1) type 130 version 1.0.0 found with id 6B7E3237393734134B353637
```

In this case the two modules are mapped using command ``SSPMMap 2,1``. As Tasmota does store the ids of the 4Relay modules a future hussle of the received modules will keep the physical mapping correct.

## Commands List

The following SPM specific commands are supported.

Command|Parameters
:---|:---
SspmDisplay<a class="cmnd" id="SspmDisplay"></a>|Change GUI display between rotating display of all scanned relays, of all scanned relays that are powered on or select a group of four relays using a tab<BR>`0` = Display all relays<BR>`1` = Display powered on relays<BR>`2` = Provide user selectable tabs to display four relays within a 4Relay module
SspmEnergyTotal<x\><a class="cmnd" id="SspmEnergyTotal"></a>|(P)reset total energy in kWh without today's energy for relay <x\><BR>`0` = preset with total of history<BR>`0.01..262143.99` = set value in kWh
SspmEnergyYesterday<x\><a class="cmnd" id="SspmEnergyYesterday"></a>|(P)reset energy yesterday in kWh for relay <x\><BR>`0.01..262143.99` = set value in kWh
SspmHistory<x\><a class="cmnd" id="SspmHistory"></a>|Show daily energy for relay <x\> of up to 180 days
SspmIAmHere<x\><a class="cmnd" id="SspmIAmHere"></a>|Blink SPM-4Relay module error light containing relay <x\>
SspmLog<x\><a class="cmnd" id="SspmLog"></a>|Show relay <x\> power state change and cause
SspmMap<a class="cmnd" id="SspmMap"></a>|Map scanned SPM-4Relay modules to physical location. Use unique numbers for all fields<BR>`0` = rescan modbus for SPM-4Relay modules and reset mapping to default. This takes at least 20 seconds<BR>`3,4,1,2` = map scanned module 1 to physical module 3 containing relays 9 to 12, module 2 to 4 with relays 13 to 16, module 3 to 1 with relays 1 to 4 and module 4 to 2 with relays 5 to 8
SspmOverload<x\><a class="cmnd" id="SspmOverload"></a>|Set overload detection criteria for relay <x\> <BR>`0` = reset and disable overload detection to scanned module criteria<BR>`<delay>,<min_power>,<max_power>,<min_voltage>,<max_voltage>,<max_current>` = set any or all overload detection criteria<BR>`0,0.10,4400.00,0.10,240.00,20.00` = enable overload detection with default values<BR>`9,0,22.1` = enable max_power over 22.1W detection after 9 seconds<BR>`0,0,0,0,235.2` = enable immediate max_voltage over 235.2V detection
SspmPowerOnState<x\><a class="cmnd" id="SspmPowerOnState"></a>|Set v1.2.0 relay <x\> power on state overruling Tasmota global power on state<BR>`0` = off, `1` = on, `2` = saved state
SspmScan<a class="cmnd" id="sspmscan"></a>|Rescan modbus for SPM-4Relay modules. This takes at least 20 seconds

