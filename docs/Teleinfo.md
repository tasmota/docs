!!! failure "This feature is not included in precompiled binaries."
See below how to build you own Tasmota with Teleinfo enabled.

## Overview

Teleinfo is an Tasmota ENERGY driver for energy meters installed by French national electricity 
grid manager Enedis in all households. Teleinfo driver works with either legacy meters or the new
Linky meters. It is based on Charles Hallard's LibTeleinfo.

Teleinfo driver features:

* Support for Legacy mode (mode _Historique_ at 1200 baud) or Standard mode (9600 baud)
* Extract fields to feed Tasmota standard ENERGY module allowing Tasmota to report standard 
SENSOR.ENERGY messages and all related features (PowerDelta, margins, ...)
* Publish raw Teleinfo frame to MQTT for processing by the backend 

Support in french is available on Charles Hallard [forums](https://community.ch2i.eu/topic/676/tasmota).

## Compiling with support for Teleinfo

As the feature is not included by default, you must [compile your build](Compile-your-build).

To enable Teleinfo, add the following line in your `user_config_override.h` and compile `tasmota` or `tasmota32`. 
```
#define USE_TELEINFO
```

## Configure GPIOs for Teleinfo

### Serial reception

Once you have flashed Tasmota with the support for Teleinfo, you need to configure the proper GPIO
to receive the Teleinfo serial data with "TInfo RX"

On ESP8266, suitable pins are

* Standard UART0 RX pin on GPIO3 ![RX on GPIO3](_media/teleinfo_esp8266_rx_d3.png)
* Alternate UART0 RX pin on GPIO13 (D7) ![RX on D7](_media/teleinfo_esp8266_rx_d7.png)

On ESP32, suitable pins are

* _To be completed_

### Optional enable pin

An optional Enable GPIO can be configured as "TInfo EN". Any GPIO can be used for that purpose
(D5/GPIO14 here below is just an exemple):

![EN on D5](_media/teleinfo_esp8266_en.png)

TODO : Explain usage of EN pin

After selecting the GPIOs, click on "SAVE" and Tasmota will reboot.

## Configuring Teleinfo

You can customize Teleinfo with the command `EnergyConfig <command> <parameter>`. The list of
supported commands and parameters are:

Command|Parameters
:---:|:---
 |Without any command and parameter, displays the current active configuration.
Historique|Set Teleinfo in legacy (_historique_) mode at 1200 baud.
Standard|Set Teleinfo in standard mode at 9600 baud.
NoRaw|Disable sending of raw frame (see below).
Full|Enable sending of all frames in raw mode.
Changed|Enable sending raw frames only when data has changed.
Skip _n_|Skips _n_ frames before sending raw frame.
Limit|Limit raw frames to values subject fo fast change (Power, Current, ...)

TODO : Tell if some config make Tasmota restart or if Tasmota must be restarted to be taken into account.

## Energy from Teleinfo

TODO explain which Teleinfo data is read and how it is used by Tasmota

## Raw frames

TODO Describe the format of raw frames and usage of the configuration commands

### Raw frames in legacy mode

### Raw frames in standard mode

## Hardware information

You can find information such as schematics and wiring diagrams on Charles Hallard [blog](http://hallard.me/)

TODO may be copy some standard schematics ?
