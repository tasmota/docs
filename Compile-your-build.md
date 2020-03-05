Flash and memory space on an ESP82XX chip is limited and very valuable. Because of that our precompiled binaries include the most popular features of Tasmota but no build can include all of them.

To include a feature you need (or build completely customized Tasmota) you will have to configure and compile your own version.

First you will need a [development environment](installation/Flashing#compiling-from-source) and Tasmota's source code (either [development](https://github.com/arendst/Tasmota/archive/development.zip) or [master](https://github.com/arendst/Tasmota/archive/master.zip) branch).

**Simplest way to compile is with [GitPod](Gitpod), requires only a web browser.**

Once you have set up the development environment, unzip the source code into a folder.

Navigate to where you unpacked Tasmota and into `/tasmota` folder.

Open `my_user_config.h` and uncomment (remove `//`) line with `#define USE_CONFIG_OVERRIDE`. It should look like this:    

```
#define USE_CONFIG_OVERRIDE                          // Uncomment to use user_config_override.h file. See README.md
```

In PlatformIO you can edit platformio_override.ini instead. Go to root directory of source code, rename platformio_override_sample.ini to platformio_override.ini. By doing this you enable the settings done in this file.
By default the file `user_config_override.h` is enabled and to build the standard `tasmota` variant.
    
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

- identifier = `USE_SHUTTER`
1. check whether USE_SHUTTER is already defined and proceed if it is not
2. this line copied from [`my_user_config.h`](https://github.com/arendst/Tasmota/blob/20370820b85acf282fbf7ebec38ef2a484921a16/tasmota/my_user_config.h#L332) then uncommented, tells the compiler to include (#define) shutter support
3. close the IF statement from line 1

Example: disable Domoticz support

```
#ifdef USE_DOMOTICZ
#undef USE_DOMOTICZ                              
#endif 
```

- identifier = `USE_DOMOTICZ`
1. check whether `USE_DOMOTICZ` is already defined and proceed if it is
2. tell the compiler to remove (#undef) Domoticz support
3. close the IF statement from line 1

>[!WARNING] It is not recommended to change `my_user_config.h`, use it only for reference 

Save file, compile the custom binary and flash it

>[!NOTE] There are limits to how many features can be included! If you go overboard code might not compile due to features conflicting _or_ might not be able to be flashed if it exceeds [ESP8266 limits](Sensor-API#keeping-esp8266-code-compact).
