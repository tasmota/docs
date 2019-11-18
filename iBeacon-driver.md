The ibeacon driver uses a BLE4 module [hm17](https://www.ebay.de/itm/HM-17-BLE-4-1-Bluetooth-CC2541-UART-Modul-Wireless-neuer-als-HM10-HM11-HM17/223189729091?hash=item33f724ff43:g:yxoAAOSweTlbw8l7) (hm16 should also work) which is capable of bluetooth central role  
it is driven by AT cmds so there may be other compatible modules too.

all apple compatible ibeacon devices should work as beacons. this one is fully apple compatible and the battery lasts about a year [(ibeacon)](https://www.ebay.de/itm/NRF51822-2V-3-3V-bluetooth-4-0-wireless-module-for-ibeacon-base-stationABTYDE/193026333670?hash=item2cf1441be6:g:TT4AAOSwaMtcnXbr)

another special beacon is supported. it has a build in speaker and can be made beeping by mqtt cmd. the battery however lasts only about a month [(smart-tag)](https://www.ebay.de/itm/Smart-Tag-GPS-Tracker-Bluetooth-Anti-verlorene-Alarm-Key-Finder-Haustier-Kind/192587529819?_trkparms=aid%3D555018%26algo%3DPL.SIM%26ao%3D1%26asc%3D20190212102350%26meid%3Df9a325be14f84f9c9b09eda9217da1d2%26pid%3D100012%26rk%3D1%26rkt%3D12%26mehot%3Dpp%26sd%3D132960074783%26itm%3D192587529819%26pmt%3D1%26noa%3D0%26pg%3D2047675&_trksid=p2047675.c100012.m1985)

the hm17 is connected to GND , 3.3 V, RX to TX of ESP and TX to RX of ESP. 
the module when delivered is in the peripheral mode and must be switched to central mode only once by the cmds
sensor52 1 and sensor52 2. the settings are stored inside the module.

sensor52 us  sets the (update) scanning interval in seconds s  (5....n)
sensor52 ts  sets the timeout interval in seconds s  (10....n)

the driver reports all beacons found during a scan with its ID and RSSI.
if the beacon can no longer be found during scan and the timeout interval has passed the beacons RSSI is set to zero (0)

a beacon with beeper can made beeping by setting RSSI to 99 by MQTT cmd.








