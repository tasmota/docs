## GPS-based NTP-server (Serial)

The foremost reason for the inclusion of this driver was to have a network unrelated time source, but besides this location data is provided  too.  

!>**Only u-blox-devices are supported**  
The UBX binary protocol was chosen, because it is very memory efficient and all the needed data can be read without further parsing.  The genereric NMEA-standard is NOT supported!  

The driver is tested on a NEO-6m and a Beitian-220. Series 7 should work too. These modules are quite cheap, starting at about 3.50€ for the NEO-6m.  


### Features:
- simplified NTP-Server
- sets system time automatically and Settings.latitude and Settings.longitude via command
- get position and time data
- can log postion data with timestamp to flash with a small memory footprint of only 12 Bytes per record (!!EXPERIMENTAL!!)
- constructs a GPX-file for download of this data
- Web-UI and console command interface

### Connecting the GPS-device to a Wemos D1 mini

| Wemos D1 Mini  | GPS |
|---|---|
|VCC +3.3V   | Vin|
|GND   | GND|
|TX   |Rx|
|RX   |Tx|

#### Tasmota Settings
In the Configuration -> Configure Module page, select the following for Wemos D1 mini:
1. **Module Type:** 18 Generic
2. **TX GPIO1 Serial Out:** GPX_TX
3. **RX GPIO3 Serial In:** GPX_RX

No further installation steps needed. To get more debug information compile it with option "DEBUG_TASMOTA_SENSOR".
The driver expects the device to be configured for 9600 baud, which is the default for most of these sensors.
If necessary the configuration can be changed with the freely available "u-center"-software, which is windows-only but is reported to run quite well with WINE.  

### NTP-Server  
Simply start the server with 'sensor60 9'.

### Flash-Log  
This is highly experimental feature, which uses the OTA-partition to log position data.  
!! ⚠️ FOR OBVIOUS REASONS THIS WILL SHORTEN THE LIFE OF THE FLASH MEMORY AND SHOULD BE USED WISELY ⚠️ !!  
After the first recording, a download-link will appear in the web interface. By clicking on it, a GPX-file will be created on-the fly for download. All recorded data is lost after each OTA-update.  

### Commands:
+ sensor60 0
  write to all available sectors, then restart and overwrite the older ones
+ sensor60 1
  write to all available sectors, then restart and overwrite the older ones
+ sensor60 2
  filter out horizontal drift noise
+ sensor60 3
  turn off noise filter
+ sensor60 4
  start recording, new data will be appended
+ sensor60 5
  start new recording, old data will lost
+ sensor60 6
  stop recording, download link will be visible in Web-UI
+ sensor60 7
  send mqtt on new postion + TELE -> consider to set TELE to a very high value
+ sensor60 8
  only TELE message
+ sensor60 9
  start NTP-Server
+ sensor60 10
  deactivate NTP-Server
+ sensor60 11
  force update of Tasmota-system-UTC with every new GPS-time-message
+ sensor60 12
  do NOT update of Tasmota-system-UTC with every new GPS-time-message
+ sensor60 13
  set latitude and longitude in settings
+ sensor60 14
  open virtual serial port over TCP, usable for u-center:  
  tcp://ip-address:port (default port: 1234)  
  !! ⚠️ misconfiguration via u-center can virtually brick the device ⚠️ !!  
+ sensor60 15
  pause virtual serial port over TCP  (connection stays active in the background)
