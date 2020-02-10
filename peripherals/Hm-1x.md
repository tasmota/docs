# HM-1x-Family of BT-modules  
  
The HM-1x-serie is  a whole family of Bluetooth Low Energy devices made by Jinan Huamao.  
http://www.jnhuamao.cn/bluetooth.asp  
  
  
  
In reality the chance to buy a clone on the „usual“ distribution channels (BG, AE, Ebay, …) is sky-high. In order to get them to work in Tasmota it is mandatory to flash the original firmware on it, which is described elsewhere.  
Example: https://circuitdigest.com/microcontroller-projects/how-to-flash-the-firmware-on-cloned-hm-10-ble-module-using-arduino-uno  
(Note: it is even possible to do this without soldering by directly sticking male jumper wire connectors through the plastic foil of some boards).  
The communication with the ESP8266 works over serial connection using AT-commands.



## ibeacon-driver  
  
The ibeacon driver uses the BLE4 module [HM-17](https://www.herman-shop.com/PDF/bluetooth%20hm16%20hm17.pdf) (HM-16 should also work).
The HM-10 works too and maybe other compatible modules (capable of bluetooth central role and driven by AT commands).

The driver needs firmware Version V120 or V110 for the HM-17 Module.
For using the HM-10 in most cases a low level flash of the firmware is neccessary. Since nearly all available HM-10 are Clones!
The HM-10 needs the firmware V609 or the newest V707 to work with the Tasmota driver. You can use the [ESP8266 HM-10 Flasher](https://github.com/Jason2866/CCLoader) to update the firmware. The flasher is based on this [work](https://circuitdigest.com/microcontroller-projects/how-to-flash-the-firmware-on-cloned-hm-10-ble-module-using-arduino-uno)
  
[Bluetooth article](/Bluetooth?id=ibeacon).

  
## MIJIA-BLE-sensors via HM-10  
  
The HM-10 is a 3.3v Bluetooth 4.0  module based on the TI CC2540/1-Chip and was the development platform for this driver.
  
The default baud rate of firmware>700 is 115200.  
The expected firmware version is 707. Other versions may work too, but before raising an issue on GitHub a test with this version is mandatory.  
  
[Bluetooth article](/Bluetooth?id=tasmota-hm10-driver).

