Flash and memory space on an ESP82XX chip is limited and very valuable. Because of that our precompiled binaries include the most popular features of Tasmota but no build can include all of them.

To include a feature you need (or build completely customized Tasmota) you will have to configure and compile your own version.

First you will need Tasmota's source code (either [development](https://github.com/arendst/Tasmota/archive/development.zip) or [master](https://github.com/arendst/Tasmota/archive/master.zip) branch) and a compiling tool.

## Compiling Tools
If you want to modify the code or default settings you can use:

- [**PlatformIO**](PlatformIO) -  setup and configure [PlatformIO](https://platformio.org) for Tasmota compilation and upload
- [**PlatformIO CLI**](PlatformIO-CLI) - how to flash Tasmota using the PlatformIO command line interface on Linux
- [**PlatformIO-Core**](Create-your-own-Firmware-Build-without-IDE) - automate firmware builds using PlatformIO-Core and flash with esptool
- [**Visual Studio Code**](Visual-Studio-Code) -  setup and configure [Visual Studio Code](https://code.visualstudio.com) with PlatformIO for Tasmota
- [**Docker Tasmota**](https://github.com/tasmota/docker-tasmota) - compile from a Docker container using PlatformIO

#### Online Compilers
_**Can only create a firmware binary.** Use one of the [tools](Getting-Started.md#flashing-tool) to flash it to your device._

- [**Gitpod**](Gitpod) - compile your own binary in the cloud using [Gitpod](https://www.gitpod.io/).  
- [**TasmoCompiler**](https://github.com/benzino77/tasmocompiler) - simple web GUI to compile Tasmota with your own settings

**Simplest way to compile is with [GitPod](Gitpod), requires only a web browser.**

Once you have set up the development environment, unzip the source code into a folder.

## Customize your build
There are mainly 2 type of possible customization:

- Changing default settings that will be used by tasmota when running for the first time on a blank device (no previous existing configutaion in flash, or flash erased). This can be done on any variant as it doesn't change the code base, memory footprint or required libraries. Such customization includes default Wifi settings, default MQTT settings, default values for a setting including `SetOption<x>`.

- Adding or removing features. This is essentially supported only on the base **tasmota** (or **tasmota32** for ESP32). Other variants have been fine tuned and trying to add/remove features to them is most likely to fail and Tasmota development team will provide no support. The typical failure is trying to add sensors to `tasmota-display`or adding displays to `tasmota-sensors`. The proper way is to add both sensors and displays to `tasmota`.

!!! Failure "Do not try to add or remove features to a variant, only to tasmota or tasmota32"

### General customization principle
Create a new file in `/tasmota` folder called `user_config_override.h`. You can copy the sample file `user_config_override_sample.h` that is already there and which include some sample definition for coding your own Wifi SSID and pasword inside the Tasmota firmware.

Open the file in chosen development environment for editing.

!!! warning "Do not modify my_user_config.h"
It is strongly recommended to NOT customize your build by making changes in `my_user_config.h` because the changes you made there will be overwritten if you download/clone a newer version of Tasmota code-base. At least this would make any merge complicated. Add your custom configurations ONLY in `user_config_override.h`.
The file [`my_user_config.h`](https://github.com/arendst/Tasmota/blob/development/tasmota/my_user_config.h) is a great reference for available settings and features.

### Changing default settings
Most default settings are defined in [`my_user_config.h`](https://github.com/arendst/Tasmota/blob/development/tasmota/my_user_config.h) along with an explanation and the command used to change it dynamically. For example:
``` c++
#define WIFI_CONFIG_TOOL       WIFI_RETRY        // [WifiConfig] Default tool if Wi-Fi fails to connect (default option: 4 - WIFI_RETRY)
                                                 // (WIFI_RESTART, WIFI_MANAGER, WIFI_RETRY, WIFI_WAIT, WIFI_SERIAL, WIFI_MANAGER_RESET_ONLY)
                                                 // The configuration can be changed after first setup using WifiConfig 0, 2, 4, 5, 6 and 7.
#define WIFI_SCAN_AT_RESTART   false             // [SetOption56] Scan Wi-Fi network at restart for configured AP's
```
The first line shows that `WIFI_CONFIG_TOOL` is the macro matching the command `WifiConfig`. The default value, as stated in [`WifiConfig`](Commands#wificonfig)'s documentation is `WIFI_RETRY` (value `4`).

The other line shows the default value for `SetOption56` which is by default `false` (`OFF`or `0`).

If you want to **override** any of these in your own binary, add the following in `user_config_override.h`: 
```c++
#ifdef %identifier%
#undef %identifier%
#endif
#define %identifier%   %the_new_value%
```
Example:
```c++
#ifdef WIFI_CONFIG_TOOL
#undef WIFI_CONFIG_TOOL
#endif
#define WIFI_CONFIG_TOOL  WIFI_WAIT   // Change WifiConfig to wait (5)
```

### Enabling a feature in `tasmota`
A feature can be enabled by #defining the matching `USE_featurename` macro. It can be disabled by #undefining the same macro. All features and their identifier can be found in [`my_user_config.h`](https://github.com/arendst/Tasmota/blob/development/tasmota/my_user_config.h).   

Best practice to enable a feature is to use
```c++
#ifndef %identifier%
#define %identifier%
#endif
```

Best practice to disable a feature is to use
```c++
#ifdef %identifier%
#undef %identifier%
#endif
```

If the feature you want to customize have a value like for example: `#define WIFI_CONFIG_TOOL  WIFI_WAIT`, the best practice to modify it is to use
```c++
#ifdef %identifier%
#undef %identifier%
#endif
#define %identifier% %value%
```

|Directives|Description|
|---|----|
|`#define %identifier%` | enables the feature|
|`#undef %identifier%` | disables the feature|
|`#ifdef %identifier%` | checks if the feature is defined in code|
|`#ifndef %identifier%` | checks if the feature is not defined|
|`#endif` | closes #if statement|

Example: enable blinds and shutters support

```c++
#ifndef USE_SHUTTER
#define USE_SHUTTER             // Add Shutter support for up to 4 shutter with different motortypes (+6k code)
#endif
```

identifier = `USE_SHUTTER`
  
1. check whether USE_SHUTTER is already defined and proceed if it is not
2. this line copied from [`my_user_config.h`](https://github.com/arendst/Tasmota/blob/20370820b85acf282fbf7ebec38ef2a484921a16/tasmota/my_user_config.h#L332) then uncommented, tells the compiler to include (#define) shutter support
3. close the IF statement from line 1

Example: disable Domoticz support

```c++
#ifdef USE_DOMOTICZ
#undef USE_DOMOTICZ                              
#endif 
```

identifier = `USE_DOMOTICZ`

1. check whether `USE_DOMOTICZ` is already defined and proceed if it is
2. tell the compiler to remove (#undef) Domoticz support
3. close the IF statement from line 1

!!! warning "It is not recommended to change `my_user_config.h`, use it only for reference"

Save file, compile the custom binary and flash it

!!! note
    There are limits to how many features can be included! If you go overboard code might not compile due to features conflicting _or_ might not be able to be flashed if it exceeds [ESP8266 limits](Sensor-API#keeping-esp8266-code-compact).

## Advanced customization

### USER_BACKLOG
`USER_BACKLOG` allows a set of commands to be automatically executed when the binary is ran for the first time on blank device (no settings in flash) or after a settings reset using `reset 1`/`reset 2`. It should be defined as a list of commands separated by a `;`. No `Backlog` command is required. It can be used for example for settings which do not have a changeable default. An interesting usage is to automatically reconfigure a device from a saved configuration file right after a `reset 1`/`reset 2`. 

Exemple:
```c++
#define USER_BACKLOG "WebGetConfig http://myserver/tasmota/conf/%id%.dmp"
```
Will automatically load a configuration backup (*.dmp) file based on the MAC address of the device.

### USER_RULE
If you need some rules to be automatically populated in you rbinary, you can define `USER_RULE<x>`.
```c++
#define USER_RULE1 "On Switch1#state DO publish cmnd/otherdevice/POWER %value% ENDON"
```

### Defining multiple custom firmwares

You may want to generate multiple custom firmwares such as one for switches/relays, one for sensors, in a similar way as Tasmota provides different binaries. This can be achieved very simply.

1. Rename the file `platformio_override_sample.ini` as `platformio_override.ini`. Do not change anything inside.
1. Create a file `platformio_tasmota_cenv.ini` like the sample below. This will allow you to define your own binaries. `cenv` stands for Custom ENVironment where an environment is a specific binary to generate.
1. In your `user_config_override.h` you can create sections with specific settings for each type of firmware. SSID and MQTT can be outside of the section so they apply to every binary.

#### Sample `platformio_tasmota_cenv.ini`

```ini
; *********************************************************************
[platformio]
; For best Gitpod performance remove the ";" in the next line. Needed 
; Platformio files are cached and installed at first run
;core_dir = .platformio

; *** Build/upload environment
default_envs =
; *** Uncomment the line(s) below to select version(s) that will be build
;     by default. Commented versions can still be build individually from
;     VSCode or command line
                tasmota-foo
                tasmota-bar
                tasmota32-foo
                tasmota32-grizzly

; *********************************************************************
; Common section can override global parameters for all builds
[common]

; *** Upload Serial reset method for Wemos and NodeMCU
upload_port               = COM4

; *********************************************************************
; This section show how to create 2 alternative binaries : tasmota-foo.bin
; and tasmota-bar.bin. Those binaries are derived form tasmota.bin and 
; customization is defined in user_config_override.h 
; Those binaries are for ESP8266
; The name after the env: tag will give its name to the binary
[env:tasmota-foo]
build_flags = ${env.build_flags} -DFIRMWARE_FOO

[env:tasmota-bar]
build_flags = ${env.build_flags} -DFIRMWARE_BAR

; *********************************************************************
; Similar exemple for ESP32
; Note that you must explicitly state that they derive from `tasmota32`
[env:tasmota32-foo]
extends = env:tasmota32_base
build_flags             = ${env:tasmota32_base.build_flags} -DFIRMWARE_FOO

[env:tasmota32-grizzly]
extends = env:tasmota32_base
build_flags             = ${env:tasmota32_base.build_flags} -DFIRMWARE_GRIZZLY
```

#### Sample `user_config_override.h`

```c++
#ifndef _USER_CONFIG_OVERRIDE_H_
#define _USER_CONFIG_OVERRIDE_H_

// force the compiler to show a warning to confirm that this file is included
#warning **** user_config_override.h: Using Settings from this File ****

// ***********************************************
// ** Global settings for all binaries ***********

// -- Setup your own Wifi settings  ---------------
#undef  STA_SSID1
#define STA_SSID1         "YourSSID"             // [Ssid1] Wifi SSID
#undef  STA_PASS1
#define STA_PASS1         "YourWifiPassword"     // [Password1] Wifi password

// You can also define your IP settings or your MQTT settings

// ***********************************************
// ** Firmare specific settings ******************

// -- Options for firmware tasmota-foo and tasmota32-foo ------
#ifdef FIRMWARE_FOO
    // This line will issue a warning during the build (yellow in 
    // VSCode) so you see which section is used
    #warning **** Build: FOO ****
    // -- CODE_IMAGE_STR is the name shown between brackets on the 
    //    Information page or in INFO MQTT messages
    #undef CODE_IMAGE_STR
    #define CODE_IMAGE_STR "foo"

    // Put here your override for firmware tasmota-foo
    #define USE_I2C
    #define USE_SENSOR_FOO  // Beware this doesn't exist !!!

#endif

// -- Options for firmware tasmota-bar ------
#ifdef FIRMWARE_BAR
    #warning **** Build: BAR ****
    #undef CODE_IMAGE_STR
    #define CODE_IMAGE_STR "bar"

    // Put here your override for firmware tasmota-bar

#endif

// -- Options for firmware tasmota32-grizzly ------
#ifdef FIRMWARE_GRIZZLY

    // If these settings are only for ESP32, you can check these
    // are used only when building for ESP32
    #ifndef ESP32
    #error *** This setup of for tasmota32 only ***
    #endif
    
    #warning **** Build: GRIZZLY ****
    #undef CODE_IMAGE_STR
    #define CODE_IMAGE_STR "grizzly"

    // Put here your override for firmware tasmota32-grizzly

#endif

#endif  // _USER_CONFIG_OVERRIDE_H_
```
