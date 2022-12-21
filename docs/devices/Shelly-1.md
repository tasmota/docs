The Shelly 1 is supported in Tasmota from version 6.2.1.7<br>

<img src="https://kb.shelly.cloud/__attachments/57049089/Shelly-1-front.jpg" width="250" align="right" />

* [Allterco Shelly 1 Product Page](https://shelly.cloud/shelly1-open-source/)
* [Allterco Shelly 1 Shop](https://shelly.cloud/product/shelly-1-open-source/)

# Flashing
There are two options to get tasmota onto your shelly:
1) OTA update with an intermediate firmware (preferred - can be done in an already installed state)
2) The common way using a serial adapter. DO NOT DO THIS WHEN CONNECTED TO AC MAINS!

## OTA Update
Follow the guide from this repository: https://github.com/yaourdt/mgos-to-tasmota

## ⚠️️Special Shelly Attention⚠️️

**DO NOT CONNECT ANYTHING TO ANY GPIOs OF THESE DEVICES!!! (No sensors, no switches, nothing) <br>
The GPIOs on the Shelly are connected to AC power!** Only use a Shelly as designed. 

**There is possibility to attach DS18B20 or other sensors BUT only using Digital Voltage Isolator**
For example the company sells [Temperature Sensor AddOn for Shelly 1/1PM](https://shop.shelly.cloud/temperature-sensor-addon-for-shelly-1-1pm-wifi-smart-home-automation#312) with DS18B20. This should not fool you, **never ever attach any sensor directly to the GPIOs** - this expansion board uses TexasInstruments ISO7221 for voltage isolation. More information and Tasmota support for the extension board at https://github.com/arendst/Tasmota/issues/7469.

**Do not connect AC power and the serial connection at the same time**
The GND connection of the Shelly is connected to the live AC wire. Connecting serial with your PC will fry your PC.

**Check the correct jumper position before connecting AC power to Shelly 1.**
If the jumper is set to 12V you will destroy your Shelly!

An ESP8266 with 2MB flash single relay device 42mm "round" in size.

## Serial Connection
Shelly1 comes with a partially exposed programming/debug header which can be used to flash Tasmota on the device. A serial-to-USB adapter is needed as well as a reliable 3.3V source with at least 350 mA drive capability. The following diagram shows the device pinout.

<img src="https://kb.shelly.cloud/__attachments/57049089/Gen1-addon-interface.png" height="250" />

## Flash mode
To be able to flash the Tasmota firmware you need to get into flash mode. Therefore connect a wire from GPIO0 to ground. For further information have a look at [Hardware Preparation](../Getting-Started#programming-mode).

## **⚠️️WARNING⚠️️**
Please note what version of the Shelly 1 you have (V1, V2 or V3). The V2 user guide is [incorrect](https://gallery.mailchimp.com/0d9bf8d9ddf1b29f33cb71ba5/images/cb16c7b5-5887-4ef2-b6c1-6e90ccaf648a.png?mc_cid=0a274764f3&mc_eid=05c10a130f). The labels on the V2 switches are **WRONG!** The following image shows how to connect the device to mains power.

![wrong](https://gallery.mailchimp.com/0d9bf8d9ddf1b29f33cb71ba5/images/cb16c7b5-5887-4ef2-b6c1-6e90ccaf648a.png?mc_cid=0a274764f3&mc_eid=05c10a130f)
## Video tutorial by digiblurDIY
[![](http://img.youtube.com/vi/mSENAY9_AlI/0.jpg)](http://www.youtube.com/watch?v=mSENAY9_AlI "")
### Video tutorial by BurnsHA
[![](http://img.youtube.com/vi/O5MT5t1DT6A/0.jpg)](http://www.youtube.com/watch?v=O5MT5t1DT6A "")
