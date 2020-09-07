description: Device recovery procedures

# Device Recovery
Configuration problems can cause boot loops, erratic behavior, devices which will not appear (i.e., no `tasmota-xxxx` AP) or connect to Wi-Fi, etc. In cases such as these when there is no proper operation a **recovery process** is required.

By default, the firmware tries to preserve the existing configuration (to support automated updates via OTA upgrades). However, various things can happen that cause the existing configuration to become problematic, e.g., when upgrading from old releases without following the [migration path](Upgrading#migration-path).

When code updates change the values or the way settings are used, those code changes don't directly write the settings on the running device when you load the new firmware. What happens is that when it boots up, the firmware looks to see if it has a valid configuration (if its an upgrade from an older Tasmota version) and if the CFG_HOLDER value is in the right place it assumes that the existing configuration is valid. 

If it doesn't find the right value it assumes that this is not a "simple" upgrade and takes the compiled-in configuration settings and writes them out to the configuration area.

## Recovery Techniques
Listed below are a few ways to reset the device to what is set in the firmware binary (`my_user_config.h` and `user_config_override.h`) aka firmware defaults, in order to recover a device:

- Hold the button (`Button1`) down, if available, for 40 seconds. After that the device should reset and reboot. Fully cycle power after that is done to make sure everything is starting from scratch.
- Issue `Reset 1` command via the console, MQTT or HTTP. After the device reboots fully cycle power.  
- use Fast Power Cycle Device Recovery procedure

## Fast Power Cycle Device Recovery

Implemented for situations where a device cannot be reset to firmware defaults by other means (no serial access, no button). It resets ***ALL*** Tasmota settings (equal to [`Reset 1`](Commands.md#reset)) after 7 power cycles.

[`SetOption65`](Commands.md#setoption65) must be set to `0` *(default)* in order for this feature to be enabled.

!!! warning
     If you have a weak power grid or frequent power brownouts its best to disable this feature with [`SetOption65 1`](Commands.md#setoption65) immediately or you'll end up with firmware default devices after a brownout event.

#### Procedure

1. Cut power from the device completely for 30 seconds
2. Power the device on and off six times with intervals lower than 10 seconds and leave it on after seventh time
3. Fast power cycle device recovery should activate and the device should be reset to firmware defaults

If you flashed a precompiled binary you can [reconfigure](Getting-Started.md#configure-wi-fi) the device using the web UI after the reset. 

## After Recovery
Once recovered, the device should be observed that it operates without instabilities before attempting to configure the device in any way. If the device still does not, follow these steps if you are able to configure its Wi-Fi and connect:

1. Configure the device as `Generic (18)`
2. Perform an OTA upgrade specifically to [`tasmota-minimal.bin`](http://ota.tasmota.com/tasmota/tasmota-minimal.bin). Taking this intermediate step ensures that the firmware will be reloaded. Since Tasmota performs a version comparison before performing the OTA update, explicitly changing the firmware that is on the device will ensure that the firmware is indeed replaced in the next step.
3. Perform an OTA upgrade to the desired firmware variant.

Once the device operates reliably, begin the configuration to set the GPIO configuration (via a Template or Module). Take any further configuration steps one at a time to ensure that after each setting is applied, the device continues to operate reliably.  

If the device exhibits defective behavior immediately after a particular individual setting is changed, then be aware that there may be a problem in the firmware. Please report this behavior via the [Tasmota Discord Chat](https://discord.gg/Ks2Kzd4).  

## That Didn't Work, What Now?
If none of these methods result in a working and reliable device, the only remaining option is to connect the device to the serial programming interface, erase the flash memory and [flash](Getting-Started.md#flashing) a different precompiled firmware binary.
