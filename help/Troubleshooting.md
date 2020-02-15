# Troubleshooting Tools

## Debugging
### Logs
For debugging purposes you can use Level 4 or Level 5 logging to the `MqttLog`, `WebLog`, `SerialLog`, or remote `SysLog`.  

The logging level is set separately for each log destination. Log levels range from `0` to `5`. The higher the log level, the more information is logged. When troubleshooting your device its recommended to set the logging level to `4`.  

#### Web Logging
These show up in the Web UI Console (http://deviceip/cs). The default logging level for WebLog logging is 2.

#### Serial Logging
> [!WARNING]
> Never connect to serial while the device is connected to mains power. You can still collect the logs, but only when powering it via your serial connection.  

Some devices use the serial port to control the relays or an MCU, so serial logging might interfere with control and even switch relays or lights.  

The default logging level for SerialLog logging is 2. Unless explicitly set by a command (e.g., user input in the Console, a System#Boot triggered rule), SerialLog will be disabled automatically 10 minutes after the device reboots.

Through a [terminal program](installation/Prerequisites#serial-terminal) set the baud rate to 115200 (19200 for Sonoff Dual), both NL & CR, and disable hardware flow control.  

- Debugging the Sonoff Pow is a bit tricky as the serial interface has a **direct connection to one of the AC power lines**. The schematic below uses two optocouplers separating the AC connection on the **left** from the low voltage connection on the **right** allowing for serial control at 115200 baud and uploading of firmware up to 57600 baud while AC is connected.
<img alt="OptoSerial" src="/_media/OptoSerial.jpg" /> 

#### Crashdumps
If the ESP8266 crashes, it frequently dumps information about the crash out the serial port, so the process listed above to see serial logs can provide extremely useful information

#### Syslog Logging
If you have a Linux system, it is probably already running [syslog](https://www.sigmdel.ca/michel/ha/rpi/syslog_en.html). You just need to configure it to listen on the network. SysLog logging is disabled in Tasmota by default.

On systems running rsyslog (most linux distros), edit the `/etc/rsyslog.conf` file. Adding (or uncommenting) the following lines will probably start making the logs show up in some file under `/var/log`  
```
$ModLoad imudp  
$UDPServerRun 514  
```

If you do not have access to a Linux system, there are [Microsoft Windows Syslog server options](https://www.ittsystems.com/best-free-syslog-server-windows/).

#### MQTT Logging
These log messages show up as MQTT messages. MqttLog logging is disabled by default.  

## MQTT traffic
To check the flow of MQTT traffic you can use [MQTT Explorer](https://mqtt-explorer.com/) which shows your entire MQTT traffic in an organised and structured way.

[Tasmota Device Manager](https://github.com/jziolkowski/tdm) offers an overview of all your Tasmota devices using MQTT protocol. You can manage them, use device features and do basic troubleshooting with ease. It also cleanly displays if your device is dropping from the network often or reboots unexpectedly.

## Running out of RAM
This typically shows up in the device working when it first starts up (hitting the button toggles the relay), but some time later it either reboots or some function won't work.

For example, you can't load the module configuration page.

The only fix for this is to recompile the firmware and disable features you don't need. Known large features are web server and TLS, but other things to consider disabling if you don't need them are emulation support, Domoticz support and WS8212 support.

## Program Memory
A 512K firmware binary size is a good "target" and rule of thumb for allowing future OTA firmware updates. Flashing over the air (OTA) requires that there is enough free program memory available to upload the new firmware along with the existing copy before the old copy is deleted. If your firmware binary is larger than the available free program memory, you can replace the existing firmware with a minimal functionality version of Tasmota (roughly 375K). This leaves enough free in the 1024K program memory for the final copy of the firmware (i.e., larger than 512K).

Flashing Tasmota makes it simpler to update to newer versions because it is built for OTA upgrades. In fact, if the new firmware is larger than the available free memory, Tasmota's OTA process will, automatically, first replace the existing firmware with  "minimal" to then have enough space to put the new firmware in.

If one is loading firmware only via the serial interface (i.e., wired), then theoretically you could load firmware as large at the program memory size. since you can erase the flash and then fill it to the rim with the new firmware. But then you'd be left with performing upgrades by having to have physical access to the device each time.
