<<<<<<< HEAD
?> Presence detection with iBeacons or BLE sensor gateway using HM-1x or nRF24L01(+) peripherals
=======
Tasmota provides limited Bluetooth functionality through the use of external hardware. Two different drivers support the use of bluetooth beacons or several BLE sensors from the Mijia/Xiaomi-universe.  
  
>>>>>>> 2e65a7b49ad13c05bce0b7d40783d4adb71f0833

## iBeacon  
**This feature is included only in tasmota-sensors.bin** 

Otherwise you must [compile your build](compile-your-build). Add the following to `user_config_override.h`:

```
#ifndef USE_IBEACON
#define USE_IBEACON          // Add support for bluetooth LE passive scan of ibeacon devices 
#endif
```
----
  
Tasmota uses a BLE 4.x module to scan for [iBeacon](https://en.wikipedia.org/wiki/IBeacon) devices. This driver is working with [HM-10 and clones](/peripherals/HM-10) and [HM16/HM17](/peripherals/HM-17) Bluetooth modules and potentially with other HM-1x modules depending on firmware capabilities.

### Features
For a list of all available commands see [Sensor52](Commands#sensor52) command.  

This driver reports all beacons found during a scan with its ID (derived from beacon's MAC address) prefixed with `IBEACON_` and RSSI value.

Every beacon report is published as an MQTT tele/%topic%/SENSOR in a separate message:

```json
tele/ibeacon/SENSOR = {"Time":"2020-03-24T20:09:40","IBEACON_FF34C21G2174":{"RSSI":-81}}
tele/ibeacon/SENSOR = {"Time":"2020-03-24T20:09:42","IBEACON_DEAABC788BC1":{"RSSI":-60}}
```

If the beacon can no longer be found during a scan and the timeout interval has passed the beacon's RSSI is set to zero (0) and it is no longer displayed in the webUI

```json
tele/ibeacon/SENSOR = {"Time":"2020-03-24T20:05:00","IBEACON_DEAABC788BC1":{"RSSI":-0}}
```

> [!TIP] When first connected some modules will be in peripheral mode. You have to change it to central mode using commands `Sensor52 1` and `Sensor52 2`.

### Supported Devices
<img src="/_media/bluetooth/nRF51822.png" width=155 align="right">

All Apple compatible iBeacon devices should be discoverable. 

Various nRF51822 beacons should be fully Apple compatible, programmable and their battery lasts about a year.

- [Amazon.com](https://www.amazon.com/s?k=nRF51822+4.0)
- [Aliexpress](https://www.aliexpress.com/af/NRF51822-beacon.html)


Cheap "iTag" beacons with a beeper. The battery on these lasts only about a month.
- [Aliexpress](https://www.aliexpress.com/af/itag.html?trafficChannel=af&SearchText=itag&ltype=affiliate&SortType=default&g=y&CatId=0)
- [eBay](https://www.ebay.de/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=Smart-Tag-GPS-Tracker-Bluetooth-Anti-verlorene-Alarm-Key-Finder-Haustier-Kind&_sacat=0)
- [Amazon.com](https://www.amazon.com/s?k=itag+tracker+4.0)

<<<<<<< HEAD
<img src="/_media/bluetooth/itag.png" width=225><img src="/_media/bluetooth/itag2.png" width=225><img src="/_media/bluetooth/itag3.png" width=225>

> [!TIP] 
You can activate a beacon with a beeper using command `IBEACON_%BEACONID%_RSSI 99` (ID is visible in webUI and SENSOR reports). This command can freeze the Bluetooth moduel and beacon scanning will stop. After a reboot of Tasmota the beacon will start beeping and scanning will resume.

## BLE Sensors using HM-1x
=======
With the arrival of the (cheap) LYWSD03 came the problem of encrypted data in MiBeacons, which to date has only been successfully decrypted in open source projects in a quite complicated way (getting the 16-byte-key with 3rd-party-software while pairing the device with the original Xiaomi-Apps).
At least the device allows the use of a simple BLE connection without any encrypted authentication and the reading of the sensor data using normal subscription methods to GATT-services. This is more power hungry than the passive reading of BLE advertisements.   
  
### Working principle of both Tasmota drivers (>8.2.0.1)
  
The idea is to provide drivers with as much automatic functions as possible. Besides the hardware setup, there are zero or very few things to configure. It is not necessary to pair the sensors with any of the vendor apps.  
The sensor namings are based on the original sensor names and shortened if appropriate (Flower care -> Flora). A part of the MAC will be added to the name as a suffix.  
All sensors are treated as if they are physically connected to the ESP8266-device.


## Tasmota-HM10-driver

### prerequisites:
-firmware 707 (other versions may work, but this is undefined behavior)  
-simple serial cable connection  
-HM-10 is set to default baud rate of 115200  (if not look for HM10BAUD-command)  
-uncomment #ifdef USE_HM10 in my_user_config.h  
-select GPIO-pins "HM10 RX" and "HM10 TX"

!> **Most of the self-flashed modules will still have their factory default with a baud rate of 9600 !!**  
 Please try:  
` 
  HM10BAUD 9600`  
`   
  HM10AT RENEW
`  
Then reboot ESP8266.



### expected behavior:
1. The driver will set a few options of the HM-10
2. A discovery scan will search for known sensors (Mi Flora, MJ_HT_V1, LYWSD02, LYWSD03, CGG1, CGD1)
3. Supported sensors will be connected at a given interval, a subscription is established for ~5 seconds and temperature/humidity/battery will be read.
4. After deconnection return to point 3 after the interval.

### command interface:  
+ hm10scan  
start new discovery scan  
+ hm10period x  
set or show interval in seconds between sensor read cycles (is set to the value of teleperiod at start). hm10period 1 will trigger one read cycle and not change the period. 
+ hm10baud x   
set or show the speed of the serial interface of the esp8266, not of the hm10  
+ hm10at xxxx  
sends AT-commands,e.g. hm10at verr? results in AT+VERR?  
+ hm10time x
sets the time of sensor x (if it is a LYWSD02) to the system-UTC-time and the timezone of Tasmota. Sensors are ordered from 0 to n in the order of the arrival. 
+ hm10auto x
start an automatic discovery scan with an interval of x seconds to receive data in BLE-advertisements periodically. This an active scan and it should only be used, if necessary. This might change in the future, if a newer firmware of the HM-10 will support passive scan.  
+ hm10 page x  
shows a maximum of x sensors at a time in the web UI, if there are more sensors than x, the driver will cycle through multiple pages.  


### Features:  
+ RULES
After a discovery scan the driver will report the number of found sensors. As the driver can not know, how many sensors are to be found, this can be used to force a re-scan.  
`Rule1 on hm10#found<6 do ADD1 1 endon on Var1#state<=3 do hm10scan endon`  - will re-scan up to 3 times, if less than 6 sensors were found.  
+ DEW POINT  
Dew point will be calculated.  


### Supported sensors:  

+ LYWSD02  
This device has an E-Ink-Display, works with 2 x CR2032-coin-cells and the driver can read temperature, humidity and battery. In addition the clock of the device can be set tot the system-time of Tasmota via command "hm10time".  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/lywsd02.jpg?raw=true" style="width:200px"></img>  
 
  
+ LYWSD03MMC  
Small, rectangular form, 1 x CR2032-coin-cell. The driver can read temperature, humidity and battery.
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/lywsd03.png?raw=true" style="width:200px"></img>  
 
 
+ Flower Care ("Flora")  
Works with a CR2032-coin-cell and provides temperature, illuminance, (soil-)humidity, (soil-)fertility and battery.  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/miflora.png?raw=true" style="width:200px"></img>  
  
+ MJ_HT_V1  
Model: LYWSDCGQ/01ZM  
This device works with an AAA-battery for several months and the driver can read temperature, humidity and battery level. Needs HM10AUTO to update sensor data.
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/mj_ht_v1.png?raw=true" style="width:200px"></img>
 
  
+ CGD1 (Alarm clock)  
The driver can read temperature, humidity and battery. Time or alarm functions are not supported.  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/CGD1.png?raw=true" style="width:200px"></img>  
 
#### not supported:  
CGG1 should be found and may give readings via MiBeacons, but is untested.  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/CGG1.png?raw=true" style="width:200px"></img>  
 
>>>>>>> 2e65a7b49ad13c05bce0b7d40783d4adb71f0833

!> **This feature is included only in tasmota-sensors.bin**

Otherwise you must [compile your build](compile-your-build). Add the following to `user_config_override.h`:

```
#ifndef USE_HM10
#define USE_HM10          // Add support for HM-1x as a BLE-bridge (+5k1 code)
#endif
```

### Features
Supported sensors will be connected to at a set interval (default interval equals TelePeriod). A subscription is established for 5 seconds and data (e.g. temperature, humidity and battery) is read and reported to an mqtt topic (Dew point is calculated):

```json
tele/%topic%/SENSOR = {"Time":"2020-03-24T12:47:51","LYWSD03-52680f":{"Temperature":21.1,"Humidity":58.0,"DewPoint":12.5,"Battery":100},"LYWSD02-a2fd09":{"Temperature":21.4,"Humidity":57.0,"DewPoint":12.5,"Battery":2},"MJ_HT_V1-d8799d":{"Temperature":21.4,"Humidity":54.6,"DewPoint":11.9},"TempUnit":"C"}
```

After a completed discovery scan, the driver will report the number of found sensors. As Tasmota can not know how many sensors are meant to be discovered you have to force a re-scan until the desired number of devices is found.
```console
Rule1 ON HM10#Found<6 DO Add1 1 ENDON ON Var1#State<=3 DO HM10Scan ENDON 
```
This will re-scan up to 3 times if less than 6 sensors are found.

#### Commands

Command|Parameters
:---|:---
HM10Scan<a id="hm10scan"></a>|Start a new device discovery scan
HM10Period<a id="hm10period"></a>|Show interval in seconds between sensor read cycles. Set to TelePeriod value at boot.<BR>|`<value>` = set interval in seconds
HM10Baud<a id="hm10baud"></a>|Show ESP8266 serial interface baudrate (***Not HM-10 baudrate***)<BR>`<value>` = set baudrate
HM10AT<a id="hm10at"></a>|`<command>` = send AT commands to HM-10. See [list](http://www.martyncurrey.com/hm-10-bluetooth-4ble-modules/#HM-10%20-%20AT%20commands)
HM10Time <a id="hm10time"></a>|`<n>` = set time time of a **LYWSD02 only** sensor to Tasmota UTC time and timezone. `<n>` is the sensor number in order of discovery starting with 0 (topmost sensor in the webUI list).
HM10Auto <a id="hm10auto"></a>|`<value>` = start an automatic discovery scan with an interval of  `<value>` seconds to receive data in BLE advertisements periodically.<BR>This is an active scan and it should be used **only if necessary**. At the moment that is the case just with MJ_HT_V1. This can change if a future HM-10 firmware starts supporting passive scan.

### Supported Devices

<table>
  <tr>
    <th class="th-lboi">MJ_HT_V1</th>
    <th class="th-lboi">LYWSD02</th>
    <th class="th-lboi">LYWSD03MMC</th>
    <th class="th-lboi">CGD1</th>
    <th class="th-lboi">MiFlora</th>
  </tr>
  <tr>
    <td class="tg-lboi"><img src="/_media/bluetooth/mj_ht_v1.png" width=200></td>
    <td class="tg-lboi"><img src="/_media/bluetooth/LYWDS02.png" width=200></td>
    <td class="tg-lboi"><img src="/_media/bluetooth/LYWSD03MMC.png" width=200></td>
    <td class="tg-lboi"><img src="/_media/bluetooth/CGD1.png" width=200></td>
    <td class="tg-lboi"><img src="/_media/bluetooth/miflora.png" width=200></td>
  </tr>
  <tr>
    <td class="tg-lboi">temperature, humidity, battery</td>
    <td class="tg-lboi">temperature, humidity, battery</td>
    <td class="tg-lboi">temperature, humidity, battery</td>
    <td class="tg-lboi">temperature, humidity, battery</td>
    <td class="tg-lboi">temperature, illuminanace, soil humidity, soil fertility, battery</td>
  </tr>
  <tr>
    <td class="tg-lboi"></td>
    <td class="tg-lboi">set time using <a href="Commands#hm10time">"HM10Time"</a></td>
    <td class="tg-lboi"></td>
    <td class="tg-lboi">unsupported time or alarm</td>
    <td class="tg-lboi"></td>
  </tr>
</table>

   
#### Unconfirmed Devices  
CGG1 should be found and may give readings via MiBeacons, but is untested.  

## BLE Sensors using nRF24L01(+)

### Configuration
  
Sensors will be discriminated by using the Product-ID of the MiBeacon. A human readable short product name will be shown instead of the company-assigned ID of the BLE Public Device Address (= the "lower" 24 bits). 

A TELE message could like look this:  
  
```
10:13:38 RSL: stat/tasmota/STATUS8 = {"StatusSNS":{"Time":"2019-12-18T10:13:38","Flora-6ab577":{"Temperature":21.7,"Illuminance":21,"Humidity":0,"Fertility":0},"MJ_HT_V1-3108be":{"Temperature":22.3,"Humidity":56.1},"TempUnit":"C"}}
```
  
As the NRF24L01 can only read BLE-advertisements, only the data in these advertisements is accessible.  
All sensors have an additional GATT-interface with more data in it, but it can not be read with a NRF24l01. 
  
As we can not use a checksum to test data integrity of the packet, only data of sensors whose adresses showed up more than once (default = 3 times) will be published. 
Internally from time to time "fake" sensors will be created, when there was data corruption in the address bytes.  These will be removed automatically.  
  
### Supported Devices

!> **It can not be ruled out, that changes in the device firmware may break the functionality of this driver completely!**  

The naming conventions in the product range of bluetooth sensors in XIAOMI-universe can be a bit confusing. The exact same sensor can be advertised under slightly different names depending on the seller (Mijia, Xiaomi, Cleargrass, ...).
<<<<<<< HEAD
=======
  
#### MJ_HT_V1:  
Model: LYWSDCGQ/01ZM  
This device works with an AAA-battery for several months and the driver can read temperature, humidity and battery level.  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/mj_ht_v1.png?raw=true" style="width:200px"></img>
  
  
#### Flower Care ("Flora"):  
Works with a CR2032-coin-cell and provides temperature, illuminance, (soil-)humidity and (soil-)fertility.  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/miflora.png?raw=true" style="width:200px"></img>  
  
  
#### LYWSD02:  
This device has an E-Ink-Display, works with 2 x CR2032-coin-cells and the driver can read temperature and humidity.  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/lywsd02.jpg?raw=true" style="width:200px"></img>  
  
  
#### CGG1:  
This device has an E-Ink-Display, with CR2430-coin-cell and the driver can read temperature, humidity and battery.  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/CGG1.png?raw=true" style="width:200px"></img>  
 
  
#### CGD1:  
Alarm clock powered by 2 AA-batteries. Driver can read temperature and humidity.  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/CGD1.png?raw=true" style="width:200px"></img>  
   
   
 
>>>>>>> 2e65a7b49ad13c05bce0b7d40783d4adb71f0833

 <table>
  <tr>
    <th class="th-lboi">MJ_HT_V1</th>
    <th class="th-lboi">LYWSD02</th>
    <th class="th-lboi">CGG1</th>
    <th class="th-lboi">CGD1</th>
    <th class="th-lboi">MiFlora</th>
  </tr>
  <tr>
    <td class="tg-lboi"><img src="/_media/bluetooth/mj_ht_v1.png" width=200></td>
    <td class="tg-lboi"><img src="/_media/bluetooth/LYWDS02.png" width=200></td>
    <td class="tg-lboi"><img src="/_media/bluetooth/CGG1.png" width=200></td>
    <td class="tg-lboi"><img src="/_media/bluetooth/CGD1.png" width=200></td>
    <td class="tg-lboi"><img src="/_media/bluetooth/miflora.png" width=200></td>
  </tr>
  <tr>
    <td class="tg-lboi">temperature, humidity, battery</td>
    <td class="tg-lboi">temperature, humidity</td>
    <td class="tg-lboi">temperature, humidity, battery</td>
    <td class="tg-lboi">temperature, humidity</td>
    <td class="tg-lboi">temperature, illuminance, soil humidity, soil fertility, battery</td>
  </tr>
</table>
   
#### Unsupported Devices  
 
<<<<<<< HEAD
For LYWSD03MMC the sensor data in the advertisements is encrypted. It is highly unlikely to read data with the NRF24L01 out-of-the-box in the future. You can use an HM-1x module for this sensor.
=======
The situation for the LYWSD03MMC (small, rectangular form) is different, as the sensor data in the advertisements is encrypted. It is highly unlikely to read data with the NRF24L01 out-of-the-box in the future.  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/lywsd03.png?raw=true" style="width:200px"></img>  

>>>>>>> 2e65a7b49ad13c05bce0b7d40783d4adb71f0833

## Getting data from BT Xiaomi Devices

Different vendors offer BT-solutions with different accessibilities under the MIJIA-brand. A common solution is the use of so-called „MiBeacons“ which are BLE advertisement packets with a certain data structure, which are broadcasted by the devices automatically. These packets already contain the sensor data and can be passively received by other devices. 

Most of the „older“ BT-sensor-devices use unencrypted messages, which can be read by all kinds of BLE-devices or even a NRF24L01. The big advantage is the power efficiency as no active bi-directional connection has to be established. This is therefore the preferred option, if technically possible (= for the supported sensors).

With the arrival of the (cheap) LYWSD03 came the problem of encrypted data in MiBeacons, which to date has only been successfully decrypted in open source projects in a quite complicated way (getting the 16-byte-key with 3rd-party-software while pairing the device with the original Xiaomi Apps).
At least the device allows the use of a simple BLE connection without any encrypted authentication and the reading of the sensor data using normal subscription methods to GATT-services. This is more power hungry than the passive reading of BLE advertisements.   
  
### Working principle of both Tasmota drivers (>8.2.0.1)
  
The idea is to provide drivers with as many automatic functions as possible. Besides the hardware setup, there are zero or very few things to configure.  
The sensor namings are based on the original sensor names and shortened if appropriate (Flower care -> Flora). A part of the MAC will be added to the name as a suffix.  
All sensors are treated as if they are physically connected to the ESP8266 device.
