<h1>Tasmota v7 comes with a **HUGE** change!</h1>

The official firmware name is ***Tasmota*** instead of Sonoff-Tasmota and this introduces a few, possibly breaking, changes that need to be addressed:

1. References to _sonoff_ in the UI, code and wiki are replaced with **tasmota**
2. Default device topic is now `tasmota` and friendly name is _Tasmota_. 
3. Default AP for WiFiConfig is `tasmota-xxxx` instead of `sonoff-xxxx`
4. All binaries are now named `tasmota-xxxx.bin` and default OTA url is `http://thehackbox.org/tasmota/tasmota.bin`

## Upgrading
Upgrading from older versions will not be painless!!! It is ***highly recommended*** to [backup your configuration](Upgrading#backing-up-settings) first, upgrade, erase flash and reset the device to firmware defaults and finally use decode-config tool to restore the configuration.

If you're upgrading from a core version older than 2.6 and you're experiencing connectivity issues use `reset 3` command to reset wi-fi calibration settings. Always fully power cycle your device after the reset is complete to make sure everything is cleared.

## v7 Important Changes
### GroupTopic
**All sweeping changes across all devices are done through publishing to the group topic so this is required to do first for all other changes to be effective! If you have custom group topics defined you're on your own** 

Default GroupTopic changed from `sonoffs` to `tasmotas`. Every new device will have `tasmotas` as the default GroupTopic but previously flashed ones will remain on `sonoffs`.

To change GroupTopic of all old devices to the new one:
```console
Publish cmnd/sonoffs/GroupTopic tasmotas
```
### Wi-Fi Config AP
To configure your device after flashing it for the first time you searched for AP named "sonoff-xxxx" but from now on you have to search for "tasmota-xxxx".

### OTAUrl
Default OTAUrl is now `http://thehackbox.org/tasmota/tasmota.bin`. If you're using other precompiled builds in your OTAUrl simply change `sonoff` to `tasmota`.

To change OTAUrl for all devices (after changing GroupTopic with the above command):

```console
Publish cmnd/tasmotas/OTAUrl http://thehackbox.org/tasmota/tasmota.bin
```

### Dark Theme
New default theme is the Dark theme. Note that upgraded devices will keep their old theme. Ff you want all your devices on the dark side use:
```console
Publish cmnd/tasmotas/WebColor 0
```

