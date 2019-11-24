<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos-d1-mini-pro-v1.0.0.jpg?raw=true" width=225>
<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos-d1-mini-v2.2.0.jpg?raw=true" width=200>
<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos-d1-mini-v3.0.0.jpg?raw=true" width= 225>

# Flashing Wemos with Tasmota

[Flashing](installation/Flashing) a Wemos D1 Mini with Tasmota firmware is nearly the same as for every other device.<br>
Just connect Wemos D1 mini via USB. No action required to enter Flashmode!

# Configure Tasmota for Wemos
## Generic Module
In the Configuration -> Configure Module page, select **Module Type: "18 Generic"**. After Saving the settings, the WEMOS reboots with the Generic configuration. The first time you switch to "18 Generic" you will NOT see all the options as seen in the picture below YET. You have to save "18 Generic" first and when you go there again after the reboot you get the long table where you can change all the pin's parameters. These steps are confirmed to also work with the Wemos D1 mini PRO v2.0.0.

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/tasmota_module_config.jpg?raw=true">

# Link to Wemos hardware & documentation
[DOCS dot WEMOS dot CC](https://docs.wemos.cc/en/latest/)
