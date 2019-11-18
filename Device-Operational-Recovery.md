Configuration problems can cause boot loops, devices which will not appear (i.e., no `sonoff-xxxx` AP) or connect to Wi-Fi or appear, erratic behavior, etc. In cases such as these, a means to restore the device to proper operation is difficult. A "recovery" process is required.

By default, the firmware tries to preserve the existing configuration (to support automated updates via OTA upgrades). However, various things can happen that cause the existing configuration to be a problem, e.g., when upgrading from old releases without following the [migration path](Upgrading#migration-path-for-older-releases).

When code updates change the values or the way settings are used, those code changes don't directly change the settings on the running device when you load the new firmware. What happens is that when it boots up, the firmware looks to see if it has a valid configuration (is it an upgrade from an older Tasmota version), and if the CFG_HOLDER value is in the right place, it assumes that the existing configuration is valid. If it doesn't find the right value, it assumes that this is not a "simple" upgrade and takes the compiled-in configuration settings and writes them out to the configuration area.

Listed below are a few ways to reset the device to what is set in the firmware binary (`my_user_config` and `user_config_override.h`), i.e., firmware defaults, in order to recover a device:  
- Hold the button (`Button1`) down, if available, for 40 seconds. After the device reboots, fully cycle power.  
- Issue `Reset 1` command via the console, MQTT, or HTTP. After the device reboots, fully cycle power.  
- Cycle power following this procedure: **(6.6.0.18)**  
  Unplug the device for several seconds (>30) to ensure that the volatile memory clears, specifically, the real time clock (RTC) memory.  

  Initiate a power cycling procedure:  
  1. Apply power for 1-2 seconds but less than 8 seconds and unplug the device.
  2. Wait 1-2 seconds and repeat step _i_  

  &nbsp;&nbsp;&nbsp;&nbsp;Cycle power four (4) times in this manner

  On the following powering up of the device, _all the device settings_ will be reset to the defaults of the firmware binary originally flashed on the device.  

  If your region experiences regular brownouts (rapid succession power outages), you may wish to disable this feature to avoid unwanted device settings resets. Use [`SetOption65 1`](Commands#setoption65) to disable this device recovery feature.

The device should operate without instabilities before attempting to configure the device in any way. If the device still does not, follow these steps if you are able to configure its Wi-Fi and connect:
1. Configure the device as `Generic (18)`
2. Perform an OTA upgrade specifically to [`tasmota-minimal.bin`](http://thehackbox.org/tasmota/tasmota-minimal.bin). Taking this intermediate step ensures that the firmware will be reloaded. Since Tasmota performs a version comparison before performing the OTA update, explicitly changing the firmware that is on the device will ensure that the firmware is indeed replaced in the next step.
3. Perform an OTA upgrade to the desired firmware variant.

Once the device operates reliably, begin the configuration to set the GPIO configuration (via a Template or Module). Take any further configuration steps one at a time to ensure that after each setting is applied, the device continues to operate reliably.  

If the device exhibits defective behavior immediately after a particular individual setting is changed, then be aware that there may be a problem in the firmware. Please report this behavior via the [Tasmota Discord Chat](https://discord.gg/Ks2Kzd4).  

If none of these methods result in reliable operation, the only remaining option is to connect the device to the serial programming interface, erase the flash memory, and flash a "clean" well-known firmware binary.  
