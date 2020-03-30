<img src="https://user-images.githubusercontent.com/5904370/67487311-fbed1e80-f66d-11e9-8d82-28b4c451abba.png" align="right" width="80"> </img><img src="https://user-images.githubusercontent.com/5904370/67487232-de1fb980-f66d-11e9-9717-a457d225effa.png" align="right" width="80"> </img>

[Tuya](http://tuya.com/) devices are sold under numerous brand names but they're all identifiable by the fact that they connect with these phone apps: "[Smart Life](https://play.google.com/store/apps/details?id=com.tuya.smartlife)" or "[Tuya Smart](https://play.google.com/store/apps/details?id=com.tuya.smart)". They incorporate different types of [Tuya Wi-Fi modules](http://en.hysiry.com/products.aspx?TypeId=10) internally.

> Tuya has begun manufacturing some Wi-Fi modules using a [Realtek RTL8710BN](https://www.realtek.com/en/products/communications-network-ics/item/rtl8710bn) Wi-Fi SOC instead of an ESP82xx chip. <br>**Tasmota cannot run on Realtek devices and there are no plans on supporting them**.  

[Tuya-Convert](https://github.com/ct-Open-Source/tuya-convert) is the most successful method of flashing Tuya modules without opening the device and soldering. 

Tuya-Convert comes with [`tasmota-wifiman.bin`](http://thehackbox.org/tasmota/tasmota-wifiman.bin) build which includes nearly all Tasmota features required for normal operation with Tuya devices, while removing superfluous sensors, IR and RF support for size. It has pre set [`WifiConfig`](Commands#wificonfig)`= 2` so the device will revert to [Wi-Fi Manager mode](https://github.com/tzapu/WiFiManager/blob/master/README.md#how-it-works) if it cannot connect to the configured Wi-Fi network. Naturally you can upgrade to any other build of the firmware if needed.

**To ensure Tasmota runs reliably execute the command [`reset 5`](Commands#reset) after Tuya-Convert is finished and Tasmota is up and running.** Doing this removes fragments of the original firmware left in flash which can create issues in the future. After all that is done you can proceed with the needed [configuration](installation/Initial-Configuration) of your device.

Help and troubleshooting for Tuya-Convert is done on [Tuya-Convert's Github](https://github.com/ct-Open-Source/tuya-convert/issues).

>[!DANGER]
>The fact that you can flash Tasmota on your device does not mean all of its features are currently supported. Please research before purchasing to see if other users have successfully flashed the device and are able to use it fully

* [Tuya-Convert](https://github.com/ct-Open-Source/tuya-convert) video walkthrough
* [TuyOTA](https://github.com/SynAckFin/TuyOTA/wiki/Walkthrough) walkthrough
* [Mock Tuya Cloud](https://github.com/kueblc/mocktuyacloud) - A general purpose framework for interacting with Tuya devices without the Tuya operated cloud.
* [Tuya API](https://github.com/codetheweb/tuyapi) - A library for communicating with devices that use the Tuya cloud network.


