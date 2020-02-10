# Hm-1x-Family of BT-modules  


## ibeacon-driver  
  
The ibeacon driver uses the BLE4 module [HM-17](https://www.herman-shop.com/PDF/bluetooth%20hm16%20hm17.pdf) (HM-16 should also work).
The HM-10 works too and maybe other compatible modules (capable of bluetooth central role and driven by AT commands).

The driver needs firmware Version V120 or V110 for the HM-17 Module.
For using the HM-10 in most cases a low level flash of the firmware is neccessary. Since nearly all available HM-10 are Clones!
The HM-10 needs the firmware V609 or the newest V707 to work with the Tasmota driver. You can use the [ESP8266 HM-10 Flasher](https://github.com/Jason2866/CCLoader) to update the firmware. The flasher is based on this [work](https://circuitdigest.com/microcontroller-projects/how-to-flash-the-firmware-on-cloned-hm-10-ble-module-using-arduino-uno)
  
  
  
## MIJIA-BLE-sensors via HM-10  
  
