The Shelly 1 is supported in Tasmota from version 6.2.1.7<br>

<img src="https://shelly.cloud/wp-content/uploads/2018/11/shelly1_thumb.png" width="250" align="right" />

* [Allterco Shelly 1 Product Page](https://shelly.cloud/shelly1-open-source/)
* [Allterco Shelly 1 Shop](https://shelly.cloud/product/shelly-1-open-source/)

## ⚠️️Special Shelly Attention⚠️️

**DO NOT CONNECT ANYTHING TO ANY GPIOs OF THESE DEVICES!!! (No sensors, no switches, nothing) <br>
The GPIOs on the Shelly are connected to AC power!** Only use a Shelly as designed. 

**Do not connect AC power and the serial connection at the same time**
The GND connection of the Shelly is connected to the live AC wire. Connecting serial with your PC will fry your PC.

**Check the correct jumper position before connecting AC power to Shelly 1.**
If the jumper is set to 12V you will destroy your Shelly!

An ESP8266 with 2MB flash single relay device 42mm "round" in size.

## Serial Connection
Shelly1 comes with a partially exposed programming/debug header which can be used to flash Tasmota on the device. A serial-to-USB adapter is needed as well as a reliable 3.3V source with at least 350 mA drive capability. The following diagram shows the device pinout and power source voltage selection jumper.

<img src="https://github.com/arendst/arendst.github.io/blob/master/media/shelly/shelly1_pinout-800x433.jpg?raw=true" height="250" />

## Flash mode
To be able to flash the Tasmota firmware you need to get into flash mode. Therefore connect a wire from GPIO0 to ground. For further information have a look at [Hardware Preparation](installation/Hardware-Preparation#programming-mode).

## **⚠️️WARNING⚠️️**
Please note what version of the Shelly 1 you have (V1, V2 or V3). The V2 user guide is [incorrect](https://gallery.mailchimp.com/0d9bf8d9ddf1b29f33cb71ba5/images/cb16c7b5-5887-4ef2-b6c1-6e90ccaf648a.png?mc_cid=0a274764f3&mc_eid=05c10a130f). The mains connections are as shown in the image above for all versions of the switch. The labels on the V2 switches are **WRONG!**

![wrong](https://gallery.mailchimp.com/0d9bf8d9ddf1b29f33cb71ba5/images/cb16c7b5-5887-4ef2-b6c1-6e90ccaf648a.png?mc_cid=0a274764f3&mc_eid=05c10a130f ":size=200")
## Video tutorial by digiblurDIY
[![](http://img.youtube.com/vi/mSENAY9_AlI/0.jpg)](http://www.youtube.com/watch?v=mSENAY9_AlI "")
### Video tutorial by BurnsHA
[![](http://img.youtube.com/vi/O5MT5t1DT6A/0.jpg)](http://www.youtube.com/watch?v=O5MT5t1DT6A "")
