This extension adds a Time Proportioned Digital Output feature into the Tasmota software.

The relay output on a Sonoff device provides (obviously) just on/off control.  Often it is desirable to be able to get a value between off and on, for example 25% power.  The conventional way to achieve this with devices such as electrical heaters or hot water radiators is to switch the device on for a period and then off for a period.  This extension allows a required power value between 0 and 1 to be specified via MQTT and the code will automatically cycle the relay on/off to achieve this power.  The s/w is configured with a Cycle Time that specifies the period.  So for example if a power value of 0.25 is specified with a cycle time of 12 minutes then the relay will be on for 3 minutes and off for 9 minutes every 12 minute period.

The s/w includes a safety mechanism where the maximum time expected between MQTT power updates is specified. If this time is exceeded with no value being received then the power will revert to a specified fallback value.

To add the feature into the standard Tasmotta s/w (at least version 5.12.0 is required) then have a look at the timeprop_branch of the tasmota fork at [https://github.com/colinl/Sonoff-Tasmota/tree/timeprop_branch](https://github.com/colinl/Sonoff-Tasmota/tree/timeprop_branch). Pick up the three files from there, `lib/ProcessControl/Timeprop.cpp` and `Timeprop.h` (which are from this [process-control repository](https://github.com/colinl/process-control)) and `sonoff/xdrv_91_timeprop.ino` and add them into your Tasmota sources.

Instructions for setting it up and using it are in `xdrv_91_timeprop.ino`. The feature adds about 1.2k to the compiled code.

Currently all configuration parameters must be setup at build time. If anyone wanted to add these to the MQTT and/or web interfaces a PR would be gratefully received.

For any issues please submit an issue to the Tasmota fork on gitub or ask on the [sonoff mailing list](https://groups.google.com/d/forum/sonoffusers) .