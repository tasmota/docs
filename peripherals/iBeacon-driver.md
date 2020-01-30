The ibeacon driver uses the BLE4 module [HM-17](https://www.herman-shop.com/PDF/bluetooth%20hm16%20hm17.pdf) (HM-16 should also work).
The HM-10 works too and maybe other compatible modules (capable of bluetooth central role and driven by AT commands).

The driver needs firmware Version V120 or V110 for the HM-17 Module.
For using the HM-10 in most cases a low level flash of the firmware is neccessary. Since nearly all available HM-10 are Clones!
The HM-10 needs the firmware V609 or the newest V707 to work with the Tasmota driver. You can use the [ESP8266 HM-10 Flasher](https://github.com/Jason2866/CCLoader) to update the firmware. The flasher is based on this [work] (https://circuitdigest.com/microcontroller-projects/how-to-flash-the-firmware-on-cloned-hm-10-ble-module-using-arduino-uno)

All apple compatible ibeacon devices should work as beacons. This one is fully apple compatible and the battery lasts about a year [NRF51822 ibeacon module](https://cleanuri.com/KYzMAv)

Another special beacon is supported. It has a build in speaker and can be made beeping by mqtt cmd. The battery however lasts only about a month [smart-tag](https://www.ebay.de/itm/Smart-Tag-GPS-Tracker-Bluetooth-Anti-verlorene-Alarm-Key-Finder-Haustier-Kind/192587529819?_trkparms=aid%3D555018%26algo%3DPL.SIM%26ao%3D1%26asc%3D20190212102350%26meid%3Df9a325be14f84f9c9b09eda9217da1d2%26pid%3D100012%26rk%3D1%26rkt%3D12%26mehot%3Dpp%26sd%3D132960074783%26itm%3D192587529819%26pmt%3D1%26noa%3D0%26pg%3D2047675&_trksid=p2047675.c100012.m1985)

The HM-17 / HM-10 is connected to GND , 3.3 V, RX to TX of ESP and TX to RX of ESP. 
When delivered the module is in the peripheral mode. It has to bechanged to central mode.

This commands does the change the mode. Needed only once since the settings are stored in the module.
`sensor52 1` and `sensor52 2` 

`sensor52 us`  sets the (update) scanning interval in seconds s  (5....n)
`sensor52 ts`  sets the timeout interval in seconds s  (10....n)

The driver reports all beacons found during a scan with its ID and RSSI.
If the beacon can no longer be found during scan and the timeout interval has passed the beacons RSSI is set to zero (0)

A beacon with beeper can made beeping by setting RSSI to 99 by MQTT cmd.








