For those knowing more about HomeSeer please update this page.

**About HomeSeer**
``
HS3 is the industry standard for flexible, powerful, home automation software. A wide selection of software drivers (plug-ins) is available for use with scores of home automation technologies and products.
``

The following [forum link](https://forums.homeseer.com/showpost.php?p=1365811&postcount=250) provides a guide to upload Tasmota to an S20 using SonOTA and integrate it with HomeSeer HS3 using the mcsMQTT plugin.

[Here](https://forums.homeseer.com/showpost.php?p=1367158&postcount=289) is a guide for integrating HomeSeer HS3 with the Sonoff 4CH Pro and Tasmota firmware as a Garage Door controller using the mcsMQTT plugin.  

Requirements for HomeSeer HS3 and Tasmota devices:
* HomeSeer HS3 
* MQTT server
* A MQTT plugin for HS3

Currently there are two plugins, both free: "MQTT" and "mcsMQTT". 
The former is more intuitive but hasn't been updated for a while, the latter is newer and constantly updated.

If you use "MQTT" plugin you need to synch the virtual device to reflect the status of the physical button, this can be done  with a plugin:
* EasyTrigger plugin - costs 25$ (used to synchronise the status of the virtual device in HomeSeer when the Sonoff Tasmota module is operated from the physical button)

If you use "mcsMQTT", starting from ver 3.0.3+ it allows to create a device that both report and control the status of the Sonoff. More info here: https://forums.homeseer.com/showthread.php?t=192675

**Tasmota Plug-in**

If your interested in a FREE specific plug-in for Sonoff + Tasmota, then Instructions are [HERE](https://www.gen.net.uk/sonoff-homeseer) and you can install it from the Homeseer Plug-ins Manager, in Primary Technology as TasMQTT. 

This plug-in takes care of two-way updates so wall switches update Homseer devices and homeseer changes update Sonoff devices. The plug-in also takes care of monitoring sonoff availability and optionally flags homeseer devices as offline so events can take that into consideration before making changes. When devices come back online Homeseer is updated with the current status of the devices. The plug-in also supports Tasmota Sensors such as the Sonoff TH1 etc. The plug-in has so far been tested extensively with the entire Sonoff Portfolio and as new devices become available we'll test those too. 

![](https://www.gen.net.uk/images/External/TasMQTT1.png)

This plug-in has been in beta for 6 months and has now reached production. Beta's will continue to be released to support any new Tasmota enabled devices. 