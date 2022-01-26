# Sonoff SPM

!!! Warning "Do not use this device as safety fuse!"

!!! Info 
    For future ARM firmware upgrades it's advised to make a full backup of the SPM-Main ESP 4M flash firmware before flashing Tasmota.

The Sonoff Smart Stackable Power Meter uses a SPM-Main unit with ESP32 providing wifi and ethernet connections. A serial interface connects to an ARM MCU which in turn provides a RS-485 bus to up to 32 SPM-4Relay modules. The SPM-4Relay module contains an ARM MCU too providing independent power management for four bi-stable relays rated for 20A at 240V for a total of 4800W.

As of this writing the ARM firmware is version 1.0.0 and provides limited functionality.

The firmware monitors the attached SPM-4Relay modules and stores energy usage history for up to 180 days on an optional SD-Card accessable by the ARM MCU only. The ARM firmware provides numerous un-documented function allowing the ESP32 to send and receive information.

### Background information

More information about the SPM can be opbtained here:

- [Sonoff tech product documentation](https://sonoff.tech/product-document/diy-smart-switch-doc/spm-main-spm-4relay-doc/)
- [SPM HTTP API](https://sonoff.tech/product-review/product-insight/get-started-quicklynow-you-can-control-spm-units-via-http-api/)
- [Sonoff DIY mode API](http://developers.sonoff.tech/spm-main-http-api.html)

## Tasmota

Tasmota, installed on the ESP32, can connect to the SPM-Main ARM MCU using the serial interface and provides the following functionality:

- Support for up to 7 SPM-4Relays limited by current register usage
- Power control of all 28 relays using standard features
- Energy usage using standard features
- Gui display of rotating relays
- Fix firmware max 180 days energy usage by storing daily Energy Total in Tasmota's filesystem
- Mapping physical relays to scanned relays

### Limitations

The following notes currently apply:

- Tasmota is unable to upgrade the ARM firmware
- Setting ARM overload and overtemp detection is not supported

## Commands List

The following SPM specific commands are supported.

Command|Parameters
:---|:---
SspmDisplay<a class="cmnd" id="SspmDisplay"></a>|Toggle GUI display between rotating display of all scanned relays or of all scanned relays that are powered on<BR>`0` = Display all relays<BR>`1` = Display powered on relays
SspmEnergyTotal<x\><a class="cmnd" id="SspmEnergyTotal"></a>|(P)reset total energy in kWh without today's energy for relay <x\><BR>`0` = preset with total of history<BR>`0.01..262143.99` = set value in kWh
SspmHistory<x\><a class="cmnd" id="SspmHistory"></a>|Show daily energy for relay <x\> of up to 180 days
SspmIAmHere<x\><a class="cmnd" id="SspmIAmHere"></a>|Blink SPM-4Relay module error light containing relay <x\>
SspmLog<x\><a class="cmnd" id="SspmLog"></a>|Show relay <x\> power state change and cause
SspmMap<a class="cmnd" id="SspmMap"></a>|Map scanned SPM-4Relay modules to physical location. Use unique numbers for all fields<BR>`3,4,1,2` = map scanned module 1 to physical module 3 containing relays 9 to 12, module 2 to 4 with relays 13 to 16, module 3 to 1 with relays 1 to 4 and module 4 to 2 with relays 5 to 8
SspmScan<a class="cmnd" id="SspmScan"></a>|Rescan modbus for SPM-4Relay modules. This takes at least 20 seconds
  
  
