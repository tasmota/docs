Flash and memory space on an ESP82XX chip is limited and very valuable. Because of that our precompiled binaries include the most popular features of Tasmota but no build can include all of them.

To include a feature you need (or build completely customized Tasmota) you will have to configure and compile your own version.

First you will need Tasmota's source code (either [development](https://github.com/arendst/Tasmota/archive/development.zip) or [master](https://github.com/arendst/Tasmota/archive/master.zip) branch) and a compiling tool.

## Compiling Tools
If you want to modify the code or default settings you can use:

- [**PlatformIO**](PlatformIO) -  setup and configure [PlatformIO](https://platformio.org) for Tasmota compilation and upload
- [**PlatformIO CLI**](PlatformIO-CLI) - how to flash Tasmota using the PlatformIO command line interface on Linux
- [**PlatformIO-Core**](Create-your-own-Firmware-Build-without-IDE) - automate firmware builds using PlatformIO-Core and flash with esptool
- [**Visual Studio Code**](Visual-Studio-Code) -  setup and configure [Visual Studio Code](https://code.visualstudio.com) with PlatformIO for Tasmota
- [**Atom**](Create-your-own-Firmware-Build-without-IDE) - beginner guide building Tasmota firmware using [Atom](https://atom.io/) with PlatformIO plugin
- [**Arduino IDE**](Arduino-IDE) - setup and configure Arduino IDE for Tasmota compilation and upload
- [**Docker Tasmota**](https://github.com/tasmota/docker-tasmota) - compile from a Docker container using PlatformIO

#### Online Compilers
_**Can only create a firmware binary.** Use one of the [tools](Getting-Started.md#flashing-tool) to flash it to your device._

- [**Gitpod**](Gitpod) - compile your own binary in the cloud using [Gitpod](https://www.gitpod.io/).  
- [**TasmoCompiler**](https://github.com/benzino77/tasmocompiler) - simple web GUI to compile Tasmota with your own settings

**Simplest way to compile is with [GitPod](Gitpod), requires only a web browser.**

Once you have set up the development environment, unzip the source code into a folder.

## Preparing compiler

### PlatformIO based 
Nothing to do :-)


### Arduino IDE
Navigate to where you unpacked Tasmota and into `/tasmota` folder.

Open `my_user_config.h` and uncomment (remove `//`) line with `#define USE_CONFIG_OVERRIDE`. It should look like this:    

```
#define USE_CONFIG_OVERRIDE                          // Uncomment to use user_config_override.h file. See README.md
```

## Customize your build    
Create a new file in `/tasmota` folder called `user_config_override.h`.

Open the file in chosen development environment for editing.

Enter lines required to enable or disable desired feature. All features and their identifier can be found in [`my_user_config.h`](https://github.com/arendst/Tasmota/blob/development/tasmota/my_user_config.h).   

Best practice to enable a feature is to use

```
#ifndef %identifier%
#define %identifier%
#endif
```

|Directives|Description|
|---|----|
|`#define %identifier%` | enables the feature|
|`#undef %identifier%` | disables the feature|
|`#ifdef %identifier%` | checks if the feature is defined in code|
|`#ifndef %identifier%` | checks if the feature is not defined|
|`#endif` | closes #if statement|

Example: enable blinds and shutters support

```
#ifndef USE_SHUTTER
#define USE_SHUTTER             // Add Shutter support for up to 4 shutter with different motortypes (+6k code)
#endif
```

identifier = `USE_SHUTTER`
  
1. check whether USE_SHUTTER is already defined and proceed if it is not
2. this line copied from [`my_user_config.h`](https://github.com/arendst/Tasmota/blob/20370820b85acf282fbf7ebec38ef2a484921a16/tasmota/my_user_config.h#L332) then uncommented, tells the compiler to include (#define) shutter support
3. close the IF statement from line 1

Example: disable Domoticz support

```
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
