# GPS-based NTP-server (Serial)

??? failure "This feature is not included in precompiled binaries"  

    When [compiling your build](Compile-your-build) add the following to `user_config_override.h`:
    ```c++
    #ifndef USE_GPS
    #define USE_GPS                                  // Add support for GPS and NTP Server for becoming Stratus 1 Time Source (+3k1 code, +132 bytes RAM)
      #define USE_FLOG                               // Add support for GPS logging in OTA's Flash (Experimental) (+2k9 code, +8 bytes RAM)
    #endif
    ```

The foremost reason for the inclusion of this driver was to have a network unrelated time source, but besides this location data is provided  too.  

!!! info "Only u-blox-devices are supported"  

The UBX binary protocol was chosen, because it is very memory efficient and all the needed data can be read without further parsing.  The generic NMEA-standard is NOT supported!

The driver is tested on a NEO-6m and a Beitian-220. Series 7 should work too. These modules are quite cheap, starting at about 3.50€ for the NEO-6m.  


## Features:

- simplified NTP-Server
- sets system time automatically and Settings.latitude and Settings.longitude via command
- get position and time data
- can log position data with timestamp to flash with a small memory footprint of only 12 Bytes per record (!!EXPERIMENTAL!!)
- constructs a GPX-file for download of this data
- Web-UI and console command interface

## Connecting the GPS-device to a Wemos D1 mini

| Wemos D1 Mini  | GPS |
|---|---|
|VCC +3.3V   | Vin|
|GND   | GND|
|TX   |Rx|
|RX   |Tx|

## Tasmota Settings
In the Configuration -> Configure Module page, select the following for Wemos D1 mini:
1. **Module Type:** 18 Generic
2. **TX GPIO1 Serial Out:** GPX_TX
3. **RX GPIO3 Serial In:** GPX_RX

No further installation steps needed. To get more debug information compile it with option "DEBUG_TASMOTA_SENSOR".
The driver expects the device to be configured for 9600 baud, which is the default for most of these sensors.
If necessary the configuration can be changed with the freely available "u-center"-software, which is windows-only but is reported to run quite well with WINE and can be confirmed to work with CrossOver on macOs Catalina.  

## NTP-Server  
Simply start the server with 'sensor60 9'.

## Flash-Log  
This is highly experimental feature, which uses the OTA-partition to log position data.  

!! ⚠️ FOR OBVIOUS REASONS THIS WILL SHORTEN THE LIFE OF THE FLASH MEMORY AND SHOULD BE USED WISELY ⚠️ !!  

After the first recording, a download-link will appear in the web interface. By clicking on it, a GPX-file will be created on-the fly for download. All recorded data is lost after each OTA-update.  

## Commands

| Command | Description |
|---|---|
| Sensor60 0 |   write to all available sectors, then restart and overwrite the older ones |
| Sensor60 1 |   write to all available sectors, then restart and overwrite the older ones |
| Sensor60 2 |   filter out horizontal drift noise |
| Sensor60 3 |   turn off noise filter |
| Sensor60 4 |   start recording, new data will be appended |
| Sensor60 5 |   start new recording, old data will lost |
| Sensor60 6 |   stop recording, download link will be visible in Web-UI |
| Sensor60 7 |   send mqtt on new position TELE -> consider to set TELE to a very high value |
| Sensor60 8 |   only TELE message |
| Sensor60 9 |   start NTP-Server |
| Sensor60 10 |   deactivate NTP-Server |
| Sensor60 11 |   force update of Tasmota-system-UTC with every new GPS-time-message |
| Sensor60 12 |   do NOT update of Tasmota-system-UTC with every new GPS-time-message |
| Sensor60 13 |   set latitude and longitude in settings |
| Sensor60 14 |   open virtual serial port over TCP, usable for u-center<br>tcp://ip-address:port (default port 1234)<br>⚠️ misconfiguration via u-center can virtually brick the device ⚠️   |
| Sensor60 15 |   pause virtual serial port over TCP  (connection stays active in the background) |
