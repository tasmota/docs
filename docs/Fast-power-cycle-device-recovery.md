**Introduced in v6.7.1**

Fast power cycle device recovery is implemented for situations where a device cannot be reset to firmware defaults (no serial access, no button). It resets all Tasmota settings (equal to [`Reset 1`](Commands#reset)) after 4 power cycles.

[`SetOption65`](Commands#setoption65) must be set to `0` *(default)* in order for this feature to be enabled.

## To use:
1. Cut power from the device completely for 30 seconds
2. Power the device on and off three times with intervals lower than 10 seconds and leave it on after fourth time
3. Fast power cycle device recovery should activate and the device should be reset to firmware defaults
   > If you flashed a precompiled binary you can [reconfigure](installation/Initial-Configuration#configure-wi-fi) the device using the web UI.
