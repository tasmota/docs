# Bluetooth

Tasmota provides limited Bluetooth functionality through the use of external hardware. Current drivers support the use of bluetooth beacons and several BLE sensors from the Mijia/Xiaomi-universe.  
  
  
  
## iBeacon  
  
The ibeacon driver uses the BLE4 module [HM-17](https://www.herman-shop.com/PDF/bluetooth%20hm16%20hm17.pdf) (HM-16 should also work).
The HM-10 works too and maybe other compatible modules (capable of bluetooth central role and driven by AT commands).

The driver needs firmware Version V120 or V110 for the HM-17 Module.
For using the HM-10 in most cases a low level flash of the firmware is neccessary. Since nearly all available HM-10 are Clones!
The HM-10 needs the firmware V609 or the newest V707 to work with the Tasmota driver. You can use the [ESP8266 HM-10 Flasher](https://github.com/Jason2866/CCLoader) to update the firmware. The flasher is based on this [work](https://circuitdigest.com/microcontroller-projects/how-to-flash-the-firmware-on-cloned-hm-10-ble-module-using-arduino-uno)

All apple compatible ibeacon devices should work as beacons. This one is fully apple compatible and the battery lasts about a year [NRF51822 ibeacon module](https://cleanuri.com/KYzMAv)

Another special beacon is supported. It has a build in speaker and can be made beeping by mqtt cmd. The battery however lasts only about a month [smart-tag](https://www.ebay.de/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=Smart-Tag-GPS-Tracker-Bluetooth-Anti-verlorene-Alarm-Key-Finder-Haustier-Kind&_sacat=0)

The HM-17 / HM-10 is connected to GND , 3.3 V, RX to TX of ESP and TX to RX of ESP. 
When delivered the module is in the peripheral mode. It has to bechanged to central mode.

This commands does the change the mode. Needed only once since the settings are stored in the module.
`sensor52 1` and `sensor52 2` 

`sensor52 us`  sets the (update) scanning interval in seconds s  (5....n)
`sensor52 ts`  sets the timeout interval in seconds s  (10....n)

The driver reports all beacons found during a scan with its ID and RSSI.
If the beacon can no longer be found during scan and the timeout interval has passed the beacons RSSI is set to zero (0)

A beacon with beeper can made beeping by setting RSSI to 99 by MQTT cmd.

## Mijia-BLE-sensors  
### Getting data from BT-Xiaomi-Devices:

Different vendors offer BT-solutions with different accessibilities under the MIJIA-brand. A common solution is the use of so-called „MiBeacons“ which are BLE advertisement packets with a certain data structure, which are broadcasted by the devices automatically. These packets already contain the sensor data and can be passively received by other devices. 

Most of the „older“ BT-sensor-devices use unencrypted messages, which can be read by all kinds of BLE-devices or even a NRF24L01. The big advantage is the power efficiency as no active bi-directional connection has to be established. This is therefore the preferred option, if technically possible.

With the arrival of the (cheap) LYWSD03 came the problem of encrypted data in MiBeacons, which to date has not been successfully decrypted in open source projects.
At least the device allows the use of a simple BLE connection without any encrypted authentication and the reading of the sensor data using normal subscription methods to GATT-services. This is more power hungry than the passive reading of BLE advertisements.


## Tasmota-HM10-driver

### prerequisites:
-firmware 707 (other versions may work, but this is undefined behavior)  
-simple serial cable connection  
-HM-10 is set to default baud rate of 115200  (if not look for HM10BAUD-command)  
-uncomment #ifdef USE_HM10 in my_user_config.h  
-select GPIO-pins "HM10 RX" and "HM10 TX"

### expected behavior:
1. The driver will set a few options of the HM-10
2. A discovery scan will search for known sensors (Mi Flora, MJ_HT_V1, LYWSD02, LYWSD03)
3. LYWSD0x-sensors will be connected at a given interval, a subscription is established for 5 seconds and temperature/humidity/battery will be read.
4. After deconnection return to point 3 after the interval.

### command interface:  
+ hm10scan  
start new discovery scan  
+ hm10period x  
set or show interval in seconds between sensor read cycles (is set to the value of teleperiod at start)  
+ hm10baud x   
set or show the speed of the serial interface of the esp8266, not of the hm10  
+ hm10at xxxx  
sends AT-commands,e.g. hm10at verr? results in AT+VERR?  
+ hm10time x
sets the time of sensor x (if it is a LYWSD02) to the system-UTC-time and the timezone of Tasmota. Sensors are ordered from 0 to n in the order of the arrival. 


### supported sensors:  
+ LYWSD02  
This device has an E-Ink-Display, works with 2 x CR2032-coin-cells and the driver can read temperature, humidity and battery. In addition the clock of the device can be set tot the system-time of Tasmota via command "hm10time".  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/lywsd02.jpg?raw=true" style="width:200px"></img>  
 
  
+ LYWSD03  

#### not supported:  
Mi Flora, MJ_HT_V1, CGG1


## Experimental BLE-Bridge for certain Mijia-Bluetooth-Sensor using the NRF24L01(+)

### USAGE:
Uncomment #USE_SPI, #USE_NRF24 and #USE_MIBLE in 'my_user_config.h' and configure the pins vor SPI_DC and SPI_CS while connecting the hardware SPI pins 12 - 14(MOSI, MISO and CLOCK).  
!! ⚠️ In order to simplify the code, the pin names from the SPI-display-drivers are used ⚠️ !!   
For the NRF24L01 SPI_DC translates to CSN and SPI_CS to CE.  
   
   
  <img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/nrf24_config.png?raw=true" style="width:400px"></img>  
   
   
No additional steps are necessary.  
The initial log should like this:  
  
```  
00:00:00 NRF24L01 initialized  
00:00:00 NRF24L01+ detected  
00:00:00 MIBLE: started  
```  
  
The driver will do the rest automatically and starts to look for known "special" packets, which will be used to extract the sensor readings.
Web-GUI and TELE-messages will be populated with the sensor data.  This can take a while after start and may be influenced by the general traffic on the 2,4 GHz-band.  

Various sensors of the Xiaomi-Bluetooth-universe are supported. They will be discriminated by using the Product-ID of the MiBeacon. A human readable short product name will be shown instead of the company-assigned ID of the BLE Public Device Address (= the "lower" 24 bits). So a TELE-message could like look this:  
  
```
10:13:38 RSL: stat/tasmota/STATUS8 = {"StatusSNS":{"Time":"2019-12-18T10:13:38","Flora-6ab577":{"Temperature":21.7,"Illuminance":21,"Humidity":0,"Fertility":0},"MJ_HT_V1-3108be":{"Temperature":22.3,"Humidity":56.1},"TempUnit":"C"}}
```
  
As the NRF24L01 can only read BLE-advertisements, only the data in these advertisements is accessible.  
All sensors have an additional GATT-interface with more data in it, but it can not be read with a NRF24l01. 
  
As we can not use a checksum to test data integrity of the packet, only data of sensors, which adresses showed up more than once (default = 3 times) will be published. 
Internally from time to time "fake" sensors will be created, when there was data corruption in the address bytes.  These will be removed automatically.  
  
#### Working sensors:

!> **It can not be ruled out, that changes in the device firmware may break the functionality of this driver completely !!**  

The naming conventions in the product range of bluetooth sensors in XIAOMI-universe can be a bit confusing. The exact same sensor can be advertised under slightly different names depending on the seller (Mijia, Xiaomi, Cleargrass, ...).
  
#### MJ_HT_V1:  
Model: LYWSDCGQ/01ZM  
This device works with an AAA-battery for several months and the driver can read temperature, humidity and battery level.  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/mj_ht_v1.png?raw=true" style="width:200px"></img>
  
  
#### Mi Flora:  
Works with a CR2032-coin-cell and provides temperature, illuminance, (soil-)humidity and (soil-)fertility.  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/miflora.png?raw=true" style="width:200px"></img>  
  
  
#### LYWSD02:  
This device has an E-Ink-Display, works with 2 x CR2032-coin-cells and the driver can read temperature and humidity.  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/lywsd02.jpg?raw=true" style="width:200px"></img>  
  
  
#### CGG1:  
This device has an E-Ink-Display, with CR2430-coin-cell and the driver can read temperature, humidity and battery.  
 

#### Not supported:  
 
The situation for the new (and cheap) LYWSD03MMC (small, rectangular form) is different, as the sensor data in the advertisements is encrypted (or even absent at all). The same is valid for the CGD1, which is a tiny alarm clock with temperature and humidity.

It is highly unlikely to read data with the NRF24L01 out-of-the-box in the future.  

