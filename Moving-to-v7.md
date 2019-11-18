V7 brought a **HUGE** change!   
The official name is now ***Tasmota*** instead of Sonoff-Tasmota and this introduces a few, possibly breaking, changes that need to be addressed:

1. References to _sonoff_ in the UI, code and wiki are replaced with **tasmota**
2. Default device topic is now `tasmota` and friendly name is _Tasmota_. 
3. Default AP for WiFiConfig is `tasmota-xxxx` instead of `sonoff-xxxx`
4. All binaries are now named `tasmota-xxxx.bin` and default OTA url is `http://thehackbox.org/tasmota/tasmota.bin`

Upgrading from older versions will not be painless. It is ***highly recommended*** to backup your configuration first, upgrade, erase flash and reset the device to firmware defaults and finally use decode-config tool to restore the configuration.

### GroupTopic
**All sweeping changes across all devices are done through publishing to the group topic so this is required to do first for all other changes to be effective! If you have custom group topics defined you're on your own** 

Default GroupTopic changed from `sonoffs` to `tasmotas`. Every new device will have `tasmotas` as the default GroupTopic but previously flashed ones will remain on `sonoffs`.

To change GroupTopic of all old devices to the new one:
```
Publish cmnd/sonoffs/GroupTopic tasmotas
```

### OTAUrl
Default OTAUrl is now `http://thehackbox.org/tasmota/tasmota.bin`. If you're using other precompiled builds in your OTAUrl just change `sonoff` to `tasmota`.

To change OTAUrl for all devices (after changing GroupTopic with the above command):

```
Publish cmnd/tasmotas/OTAUrl http://thehackbox.org/tasmota/tasmota.bin
```

### Dark Theme
New default theme is Dark, if you want all your devices on the dark side use:
```
Publish cmnd/tasmotas/WebColor 0
```

