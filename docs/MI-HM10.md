# Mijia-BLE-sensors via HM-10

The HM-10 is a 3.3v Bluetooth 4.0  module based on the TI CC2540/1-Chip. It is made by Jinan Huamao and one of a whole family of Bluetooth devices.  
  
  
In reality the chance to buy a clone on the „usual“ distribution channels (BG, AE, Ebay, …) is sky-high. In order to get them to work in Tasmota it is mandatory to flash the original firmware on it, which is described elsewhere.  
Example: https://circuitdigest.com/microcontroller-projects/how-to-flash-the-firmware-on-cloned-hm-10-ble-module-using-arduino-uno  
(Note: it is even possible to do this without soldering by directly sticking male jumper wire connectors through the plastic foil of some boards).

The communication with the ESP8266 works over serial connection using AT-commands and the driver expects the default baud rate of firmware>700 which is 115200.  
The expected firmware version is 707. Other versions may work too, but before raising an issue on GitHub a test with this version is mandatory.  


### Getting data from BT-Xiaomi-Devices:

Different vendors offer BT-solutions with different accessibilities under the MIJIA-brand. A common solution is the use of so-called „MiBeacons“ which are BLE advertisement packets with a certain data structure, which are broadcasted by the devices automatically. These packets already contain the sensor data and can be passively received by other devices. 

Most of the „older“ BT-sensor-devices use unencrypted messages, which can be read by all kinds of BLE-devices or even a NRF24L01. The big advantage is the power efficiency as no active bi-directional connection has to be established. This is therefore the preferred option, if technically possible.

With the arrival of the (cheap) LYWSD03 came the problem of encrypted data in MiBeacons, which to date has not been successfully decrypted in open source projects.
At least the device allows the use of a simple BLE connection without any encrypted authentication and the reading of the sensor data using normal subscription methods to GATT-services. This is more power hungry than the passive reading of BLE advertisements.

### Tasmota-HM10-driver

#### prerequisites:
-firmware 707 (other versions may work, but this is undefined behavior)  
-simple serial cable connection  
-HM-10 is set to default baud rate of 115200  (if not look for HM10BAUD-command)  
-uncomment #ifdef USE_HM10 in my_user_config.h  
-select GPIO-pins "HM10 RX" and "HM10 TX"

#### expected behavior:
1. The driver will set a few options of the HM-10
2. A discovery scan will search for known sensors (Mi Flora, MJ_HT_V1, LYWSD02, LYWSD03)
3. LYWSD0x-sensors will be connected at a given interval, a subscription is established for 5 seconds and temperature/humidity/battery will be read.
4. After deconnection return to point 3 after the interval.

#### command interface:  
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


#### supported sensors:  
+ LYWSD02  
  
+ LYWSD03  

##### not supported:  
Mi Flora and MJ_HT_V1 will be shown in the WEB-UI, but at the moment no sensor readings will be received.
