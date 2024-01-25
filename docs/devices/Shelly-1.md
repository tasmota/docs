# [Shelly 1](https://www.shelly.com/en-us/products/shop/shelly-1-ul)

The Shelly 1 is supported in Tasmota from version 6.2.1.7

[Shelly 1 Knowledge Base](https://kb.shelly.cloud/knowledge-base/shelly-1)

[Shelly 1 API Reference](https://shelly-api-docs.shelly.cloud/gen1/#shelly1-shelly1pm)

<img src="https://kb.shelly.cloud/__attachments/60424193/shelly1.png" width="250" align="right" />

# Flashing
There are two options to get Tasmota onto your Shelly:

1. OTA update with an intermediate firmware (preferred - can be done in an already installed state)
1. The common way using a serial adapter. DO NOT DO THIS WHEN CONNECTED TO AC MAINS!

## OTA Update
Follow the guide from this repository: <https://github.com/arendst/mgos-to-tasmota>

## ⚠️️Special Shelly Attention⚠️️

**DO NOT CONNECT ANYTHING TO ANY GPIOs OF THESE DEVICES!!! (No sensors, no switches, nothing) <br>
The GPIOs on the Shelly are connected to AC power!** Only use a Shelly as designed.

**There is possibility to attach DS18B20 or other sensors BUT only using Digital Voltage Isolator**
For example the company sells [Temperature Sensor AddOn for Shelly 1/1PM](https://shop.shelly.cloud/temperature-sensor-addon-for-shelly-1-1pm-wifi-smart-home-automation#312) with DS18B20. This should not fool you, **never ever attach any sensor directly to the GPIOs** - this expansion board uses TexasInstruments ISO7221 for voltage isolation. More information and Tasmota support for the extension board at <https://github.com/arendst/Tasmota/issues/7469>.

**Do not connect AC power and the serial connection at the same time**
The GND connection of the Shelly is connected to the live AC wire. Connecting serial with your PC will fry your PC.

**Check the correct jumper position before connecting AC power to Shelly 1.**
If the jumper is set to 12V you will destroy your Shelly!

An ESP8266 with 2MB flash single relay device 42mm "round" in size.

## Serial Connection
Shelly1 comes with a partially exposed programming/debug header which can be used to flash Tasmota on the device. A serial-to-USB adapter is needed as well as a reliable 3.3V source with at least 350 mA drive capability. The following diagram shows the device pinout.

<img src="https://kb.shelly.cloud/__attachments/237502485/Gen1-addon-interface.png" height="250" />

## Flash mode
To be able to flash the Tasmota firmware you need to get into flash mode. Therefore connect a wire from GPIO0 to ground. For further information have a look at [Hardware Preparation](../Getting-Started#programming-mode).

## **⚠️️WARNING⚠️️**
Please note what version of the Shelly 1 you have (V1, V2 or V3). The V2 user guide is incorrect. The labels on the V2 switches are **WRONG!** The following image shows how to connect the device to mains power.

![Basic Wiring](https://kb.shelly.cloud/__attachments/243531777/1%20AC%20wiring%20diagram.png?inst-v=c5a6a296-4215-467c-94e2-cd19f02ebcf8)

## Video tutorial by digiblurDIY
[![](http://img.youtube.com/vi/mSENAY9_AlI/0.jpg)](http://www.youtube.com/watch?v=mSENAY9_AlI "")

### Video tutorial by BurnsHA
[![](http://img.youtube.com/vi/O5MT5t1DT6A/0.jpg)](http://www.youtube.com/watch?v=O5MT5t1DT6A "")
