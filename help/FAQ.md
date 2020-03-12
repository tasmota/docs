## Table of Contents
#### Installation
 - [Cannot enter flash mode](#Cannot-enter-flash-mode)
 - [Flashing issues](#Flashing-issues)
 - [Firmware update with file upload not working](Upgrading#by-file-upload)
 - [Device is hot to the touch](#Device-is-hot-to-the-touch)
 - [There was white smoke and the device does not work anymore!](#There-was-white-smoke-and-the-device-does-not-work-anymore)
 - [Sonoff 4CH V2 / Sonoff Dual V2 will not flash](#Sonoff-4CH-V2-Sonoff-Dual-V2-will-not-flash)
 - [Flashing fails on MacOS High Sierra](#Flashing-fails-on-MacOS-High-Sierra)
#### Wi-Fi
 - [Cannot connect to Wi-Fi](#Cannot-connect-to-Wi-Fi)
 - [I entered the wrong Wi-Fi information](#I-entered-the-wrong-Wi-Fi-information)
 - [Device disconnects from Wi-Fi often](#Device-disconnects-from-Wi-Fi-often)
 - [Wi-Fi stops working](#Wi-Fi-stops-working)
 - [Control device from outside my network](https://github.com/arendst/Tasmota/issues/5352)
 - [Weaker Wi-Fi signal after upgrade](#Weaker-Wi-Fi-signal-after-upgrade)
#### MQTT
 - [Cannot connect to my MQTT broker](#Cannot-connect-to-my-MQTT-broker)
 - [Frequent MQTT reconnects](#Frequent-MQTT-reconnects)
 - [What's Topic, GroupTopic and FallBack Topic](MQTT#mqtt-topic-definition)
#### Device
 - [How do I configure this unknown device](Configuration-Procedure-for-New-Devices)
 - [Relay clicks and LED flashes at 1 second intervals](#Relay-clicks-and-LED-flashes-at-1-second-intervals)
 - [Status LED blinking](#Status-LED-blinking)
 - [My device randomly switches on and off. Do I have ghosts in my house?](#My-device-randomly-switches-on-and-off-Do-I-have-ghosts-in-my-house)
 - [Device resets to defaults every minute or so](#Device-resets-to-defaults-every-minute-or-so)
 - [Cannot find my device in Modules](#Cannot-find-my-device-in-Modules) 
 - [Device keeps restarting after changing config over MQTT](#Device-keeps-restarting-after-changing-config-over-MQTT)
 - [Can you add this unsupported sensor to Tasmota](#Can-you-add-this-unsupported-sensor-to-Tasmota)
 - [Tasmota is sending a lengthy status update ("STATUS" - "STATUS11") every 5 seconds. What's going on?](#tasmota-is-sending-a-lengthy-status-update-every-5-seconds-what39s-going-on)
 - [Web interface asks for password](#Web-interface-asks-for-password)
 - [Power monitoring shows wrong values](#Power-monitoring-shows-wrong-values)
 - [Power monitoring resets Energy Today mid-day](https://github.com/arendst/Tasmota/issues/5571)
 - [Sensors do not show values](#Sensors-do-not-show-values)
 - [Timers trigger at the wrong time](#Timers-trigger-at-the-wrong-time)
 - [Auto-discovery in Home Assistant does not work](#Auto-discovery-in-Home-Assistant-does-not-work)
 - [Why is my changed configuration not loaded?](#Why-is-my-changed-configuration-not-loaded)
 - [How do I invert the output of the green LED on the Sonoff Basic so the LED is on when the relay is off?](#How-do-I-invert-the-output-of-the-green-LED-on-the-Sonoff-Basic-so-the-LED-is-on-when-the-relay-is-off)
 - [What is an Arduino core?](#What-is-an-Arduino-Core)
 - [help/Device-Recovery Recovery](/help/Device-Recovery)

## Installation

### Cannot enter flash mode
Be sure to press the button correctly, you must "feel" a click. If your on-device button doesn't allow you to enter flash mode or there is no GPIO0 broken out to the PCB, you can always bridge GND to GPIO0 pin directly on the chip. Search on the Internet for your chip's pinouts and use [the tutorial](installation/Hardware-Preparation#programming-mode). Be sure to keep GPIO0 grounded long enough (3-5 seconds) before disconnecting to ensure the chip has booted completely into programming mode. On devices that do not provide a GPIO0 connected button, it may be easier to leave the wired bridge in place throughout the entire flashing process (erase & upload). Doing so will not create any problems for flashing the device. After the firmware is uploaded successfully, remove the bridge. This allows the device to boot normally.

### Flashing issues
- Double check if you wired the device the serial-to-USB adapter correctly. Almost every device needs RX and TX pins switched to TX and RX. See [Hardware Preparation](installation/Hardware-Preparation) for more.

- Another common problem are the jumper cables used. Try another cable if you keep getting connection errors or check the cables for connectivity. Most of them are made cheaply and it happens quite often that those cables do not offer a good connection because of bad crimping or broken copper lines in them.

- Be sure to use a **USB Data Cable** and not a cheap loading cable for mobile phones for connecting the serial-to-USB adapter to your computer. If you are unsure, just try another USB cable. Data USB cables are often thicker than the normal loading cables (and more expensive).

- Another problem can be the difficulties in getting the ESP chip into [programming mode](#cannot-enter-flash-mode) when it boots. 

- If the flash still fails or the progress interrupts, it could be that your computer or serial-to-USB adapter doesn't provide enough power to the device. Try another computer or use an external power supply (3.3V one).
   
- Use the correct serial-to-USB adapter driver. Check the model of your adapter chip and get the correct driver.

- If the flash completes successfully, but you get a hash mismatch (esptool.py error message `A fatal error occurred: MD5 of file does not match data in flash!`) ensure that your 3.3v current is sufficient. Workarounds include using a dedicated _bread board power supply_ or using the 3.3v output of an additional microcontroller. If using an additional power supply to power the device, be sure to use a common ground for the power supply, the device to be flashed and the serial-to-USB adapter.

- If esptool.py stops at "Uploading stub...", use --no-stub 

- If the flash fails or the device does not operate as expected, try using the default ESP82xx boot ROM baud rate - `74880`. This is the baud rate the ESP82xx is set to by default when it boots into programming mode. It can be specified as a command line option in [esptool.py](/installation/Flashing#esptoolpy) (`-b`) and [esptool.exe](/installation/Flashing#esptool-executable) (`-cb`).

  You may also want to select a serial monitor/terminal capable of setting this "unusual" baud rate. In Termite, type this value (`74880`) in the baud rate selection text box when configuring the port. Having the option to specify this unusual baud rate will allow you to view the [ESP8266 boot ROM log](https://github.com/espressif/esptool/wiki/ESP8266-Boot-ROM-Log) while the device is booting.

### Device is hot to the touch
Remember - **NEVER EVER FLASH WITH 5V!**?

Better unpower your device and check if the wiring is correct and the voltage is on your FTDI is set to 3.3V. 
If you've connected VCC to the wrong pin it might cause your device to overheat and destroy it.

### There was white smoke and the device does not work anymore!
Yes, you've released the fabled "white smoke", the mysterious substance all electronic devices work on. 

In the immortal words of Doctor Bones: **It's dead Jim!**

### Sonoff 4CH V2 / Sonoff Dual V2 will not flash
Testing with two different (fairly new) FTDI boards and two Sonoff 4CH v2.0 and the Sonoff Dual v2.0 boards I found that I was getting errors uploading sketches i.e. "warning: espcomm_sync failed" basically a lack of communication between the two devices.

I found that the problem in both Sonoff's was that instead of the FTDI Sonoff cross-over TX->RX and RX->TX I had to do TX->TX RX->RX this then allowed me to upload the sketch.

### Flashing fails on MacOS High Sierra
Related to issue [#957](https://github.com/arendst/Tasmota/issues/957#issuecomment-338779258).

Solution:
1. Install the VCP drivers for Mac from the [FTDI website](http://www.ftdichip.com/Drivers/VCP.htm)
2. After install, reboot (it does not work if you do not reboot).
3. After reboot, plug the FTDI USB/serial converter. Accept the security alert from MacOS.
4. Restart the flash process. It works!

## Wi-Fi

### Cannot connect to Wi-Fi 
If your device does not connect to your Wi-Fi and you've made sure the Wi-Fi credentials are correct, it is caused by using special chars or white spaces in your SSID or Password of your Wi-Fi. Remove them and try again. Other reason can be using an SSID longer than the allowed 32 characters.

With some Wi-Fi routers (i.e. Linksys with DD-WRT), you may have conflicts with the 5GHz radio. Don't choose _"Mixed"_ option. Select _"AC/N-Mixed"_ instead. Moreover, you probably should disconnect 5GHz radio during the configuration process.

DD-WRT also has Wi-Fi Multi-Media (WMM) enabled by default.  Disabling WMM can resolve connectivity issues.

### I entered the wrong Wi-Fi information
- If you have a device with a button and the button is configured as a component in the Tasmota settings (e.g., GPIO0 - Button1), you can try pressing the button to force the device into [Wi-Fi configuration mode](Buttons-and-Switches#4-short-presses) with 4 short presses of the button. 

- If that didn't work reset your device using [Fast power cycle device recovery](Fast-power-cycle-device-recovery)

- If you are unsure what SSID you have entered, you can try to find that with special Wi-Fi sniffing tools. For example [Nirsoft WifiChannelMonitor](https://www.nirsoft.net/utils/wifi_channel_monitor.html) can show your mistakenly configured SSID name.  
  **Linux system example:**
  ```
  apt install aircrack-ng wireshark
  airmon-ng check kill
  airmon-ng start (e.g. wlp58s0 or wlan0)
  wireshark
  ```
  Select your Wi-Fi device from the list. Plug in the mis-configured device and immediately watch SSIDs. You should see your mis-configured SSID fairly soon.  

- If these methods don't work, it may still be possible to save the device without opening it to perform a serial flash. Since Tasmota uses GET request for forms, the password may be in your browser history.  
  1. Search in your browser history for 192.168.4.1 (or whatever address you used for configuring it)
  2. There should be an entry similar to this:  
     `http://192.168.4.1/wi?s1=<mySSID>&p1=<myPassword>-********&s2=&p2=********&h=hostName&save=`  
     - `s1` is your first AP SSID
     - `p1` is the first AP password
     - `s2` and `p2` are the same parameters but for the second AP
     - `h` is the hostname given to the device by the Tasmota configuration
  3. After getting the incorrectly entered configuration from this URL, configure an access point with these settings as described above
  4. Access your device and set the correct Wi-Fi credentials

- If you flashed a light bulb or any device without a built-in button and entered wrong Wi-Fi password you now have a device that won't connect to your Wi-Fi and you have no button to force it into Wi-Fi configuration mode.

  **This tip takes advantage of a security risk present in Arduino Cores prior to 2.6.0. It will not work with Tasmota binaries compiled with 2.6.0 or later.**  

  To solve this you can try creating a new Wi-Fi AP with the same SSID and no (none) authentication. Use an old router, a mobile phone or, if you're desperate, change the settings on your main router (but remember to turn authentication back on when you're done). Depending on the router/phone it will ignore the wrong Wi-Fi password since authentication is set to none and let your Tasmota flashed device connect to it.  

  Now simply connect to the same AP and open the web UI, triple check your ssid and password, enter some simple info for `SSID2` which you can create as a hotspot on your phone and save.  

### Device disconnects from Wi-Fi often

First thing to try when having Wi-Fi issues:

   Erase all flash using esptool.py or esptool.exe and flash via serial (as explained [here](installation/Flashing#erase-flash-memory)) using [the latest precompiled binaries](http://thehackbox.org/tasmota/).

   This approach has solved most of the reported issues. Sometimes this is due to a bad flash, a bad OTA or invalid data that remains in the flash where the SDK memory is.

If you still have issues, you should look into your Wi-Fi network:

   - Check the Wi-Fi channel availability and noise with an Android app like Wi-Fi Analyzer. Disable Auto Channel in your Wi-Fi router and select any Wi-Fi channel that is not very congested in your area.
   - Disable Wi-Fi Repeaters and Mesh Networks.
   - Check Wi-Fi signal in your device.

   The same Mesh may be stable in one area and lead to unwanted Tasmota reconnects in other areas, presumably when the signals of access points overlap with similar strength. If disabling Mesh Networks is not an option, then keeping the network busy, e.g. by issuing a Ping from another host every 20 seconds has helped to avoid the reconnects.

### Wi-Fi Stops Working
There have been many reports of Wi-Fi no longer working after it was working for a while.

Every time this has been reported, it's ended up being a hardware or signal interference problem.

On the hardware side, we've seen reports of bad solder joints on the board that when touched up seem to solve the problem (capacitors being loose can cause this) or low quality/weak power supplies or voltage regulators that cannot cope with the power requirements of Tasmota or have degraded over time.

We've also seen reports then when a specific LED light bulb was hooked up near one, the signal quality dropped to unusable.

All you can really do is check the solder joints, move the device closer to your Access Point. If all else fails, replace the device.

### Weaker Wi-Fi signal after upgrade
On an ESP82xx, Wi-Fi calibration is sensitive to the power supplied. If this changes substantially (e.g., you add a sensor, configure a new Tasmota feature, upgrade the firmware or Arduino Core, etc.), the device's Wi-Fi calibration may not be set properly any longer. The Wi-Fi signal strength (RSSI) can drop significantly and impact Wi-Fi performance. In such a case, the Wi-Fi calibration needs to be deleted to force the device to re-calibrate Wi-Fi after it restarts.  
1. **Save the device configuration**
2. Run [`Reset 5`](Commands#reset) in the Console. This command deletes Wi-Fi calibration data, erases all flash memory, and resets parameters to firmware defaults _but keeps your Wi-Fi network credentials_
3. The device will restart
4. Cycle the power on the device. Wi-Fi calibration will not be done unless the device performs a cold boot from power up.
5. **Restore your device configuration from the _step 1_ backup**  

## MQTT

### Cannot connect to my MQTT broker
Make sure you've [configured MQTT](MQTT) correctly. If that didn't solve the issue check your MQTT broker logs. 
Most likely problem is your broker doesn't allow logins for your Tasmota configure user and password or your ACL settings do not include your device.

In some very specific cases the MQTT broker code clashes with the Arduino Core and doesn't allow a connection. In that case create a different user for your device, try another core binary or a different MQTT broker.

### Frequent MQTT reconnects
Most MQTT reconnect messages are linked with Wi-Fi instability first. Resolve any Wi-Fi issue first!

If the console shows repeated messages like:
```
02:32:54 MQTT: tele/MYSONOFF/LWT = Online (retained)
02:32:54 MQTT: cmnd/MYSONOFF/POWER = 
02:32:55 MQTT: Attempting connection...
02:32:56 mDNS: Query done with 0 mqtt services found
02:32:56 MQTT: Connected
```
or your mosquitto broker log shows messages like this -
```
1496455347: New client connected from IP_addr_1 as SONOFF (c1, k15, u'SONOFF_USER').
1496455349: New connection from IP_addr_1 on port 1883.
1496455349: Client SONOFF already connected, closing old connection.
1496455349: Client SONOFF disconnected.
1496455349: New client connected from IP_addr_2 as SONOFF (c1, k15, u'SONOFF_USER').
1496455350: New connection from IP_addr_2 on port 1883.
1496455350: Client SONOFF already connected, closing old connection.
1496455350: Client SONOFF disconnected.
```
You have more than one device connected with the same %topic% defined. Its important that each device has a unique %topic% instead of the default `sonoff`.

If that is not the issue, erase all flash using esptool.py or esptool.exe and flash again by wire (as explained [here](Esptool#upload-tasmota)) using [the latest precompiled bins with core v2.6](http://thehackbox.org/tasmota/pre-2.6/).

## Device

### Relay clicks and LED flashes at 1 second intervals
This indicates that your device did not get flashed properly. In this case it will toggle all it's pins at 1 sec intervals. A flash erase and a new flash is required.

### Status LED blinking
Your device status LED blinks repeatedly when Wi-Fi and/or MQTT is not connected. If you're not using MQTT and did not configure it the status LED will still keep blinking.

You can disable status LED blinking using:
`Backlog LedPower 0; SetOption31 1`

### My device randomly switches on and off. Do I have ghosts in my house?
Most of the issues with random, or "ghost", switching are related to MQTT retain settings. In short, your MQTT broker is retaining a message with the POWER status of the device which gets applied on reboots. [Solution here](MQTT#retained-mqtt-messages) 

In some cases, adding a switch to a device causes ghost switching. In this case, you may need to add a [low pass filter](https://www.youtube.com/watch?v=aq8_os6g13s&ab_channel=DrZzs) to dampen any spikes on the input. In the case of the Sonoff T1, a modification to [change the filter capacitor](https://github.com/arendst/Tasmota/issues/5449#issuecomment-478471697) on the PCB may be required.

This short [10 minute video by TheHookUp](https://www.youtube.com/watch?v=31IyfM1gygo&t=15s) nicely explains what it is and how to prevent it. 

Other cause can be of electrical nature. If you have connected an external switch using long wires they can pick up stray signals and cause the voltage on the GPIO to vary. [Solution here](Expanding-Tasmota#electrical-considerations) 

### Device resets to defaults every minute or so
Your device may be in a boot loop - a restart caused by any exception or watchdog timer within less than `BOOT_LOOP_TIME` (_default 10 seconds_). The number of boot loops allowed before beginning to reset settings is determined by [`SetOption36`](Commands#setoption36). When Tasmota reaches this situation, it will begin restoring default settings as follows:
- 1<sup>st</sup> restart: disable ESP8285 generic GPIOs interfering with flash SPI
- 2<sup>nd</sup> restart: disable rules causing boot loop
- 3<sup>rd</sup> restart: disable all rules
- 4<sup>th</sup> restart: reset user defined GPIOs to disable any attached peripherals
- 5<sup>th</sup> restart: reset module to Sonoff Basic (1)

### Cannot find my device in Modules

If you flashed a device which is not listed in the Modules list, use [Templates](Templates) to configure your device. Try looking for it first in the [Templates Repository](http://blakadder.github.io/templates).

### Device keeps restarting after changing config over MQTT
If you changed configurations over MQTT, the command can fail due to a bug and the command is repeatedly sent, causing the device to restart.

The restart is normal if you change something at the device configuration.

You need to clear the retain messages of your HA/Broker/MQTT Server.

Read also:
- [#2140](https://github.com/arendst/Tasmota/issues/2140)
- [#2658 (comment)](https://github.com/arendst/Tasmota/issues/2658#issuecomment-387112217)
- [#2716](https://github.com/arendst/Tasmota/issues/2716)

### Can you add this unsupported sensor to Tasmota

Short answer: **NO!**

Long answer: There is not enough time in our coders lives to take requests, if you can code a driver for that sensor and submit a PR it will be considered, otherwise you can only wait for someone else to do it.

### Tasmota is sending a lengthy status update every 5 seconds. What's going on?
Turn off [TasmoAdmin](integrations/TasmoAdmin)! It is polling your device with `STATUS 0` command with a HTTP request every 5 seconds which causes the status updates and unnecessary stress load on the device. In some cases it might even interfere with normal device operation.

### Web Interface Asks for Password
You modified the Web Admin password (`Configure Other`) and now you cannot access the web interface. You have set up a password for the web interface. You can login with the username `admin` and the password you entered. However, if you don't remember that password there are a few options you can try to gain access to the web interface again.

1. Reset the password using the [`WebPassword`](Commands#webpassword) command.

   - If you have serial connection to the device: Execute `WebPassword 0` using a serial terminal interface.

   - If you have configured MQTT: Send `0` to `cmnd/<device-topic>/WebPassword`.  You can send it from any [MQTT client](http://www.hivemq.com/blog/seven-best-mqtt-client-tools). You can also use another Tasmota device using the [`Publish`](Commands#publish) command - Execute `Publish cmnd/<device-topic>/WebPassword 0` from that device's Console.

2. If the options above are not available:
   Since Tasmota uses GET request for forms, the password may be in your browser history. Look there for entries with the name you configured for the device. For example, in the following link:

   `http://<device-ip>/co?t1={"NAME":"Generic"'"GPIO":[23'22'24'17'134'132'0'0'131'52'21'0'0]'"FLAG":0'"BASE":67}&p1=SecretPassword&b1=on&a1=Sonoff&a2=Sonoff2&a3=Sonoff3&a4=Sonoff4&b2=0&save=`

   the `p1` parameter contains the password for the web interface (`SecretPassword` in this case).

   _Note: special characters may appear as the characters' corresponding ASCII hexadecimal codes (e.g., "\{" = '\%7B', etc.)_

3. If you had set up `WifiConfig 7` as your Wi-Fi fallback method (by previously executing [`WiFiConfig`](Commands#wificonfig) in the Console),  you can reset the device by booting it into Wi-Fi Manager mode. If the SSID configured in the device is not available (e.g., turn off the router), the device will fallback to that restricted Wi-Fi Manager Mode.

4. If your device has a physical push-button, reset the firmware to the default settings as detailed [here](Buttons-and-Switches#long-press).

5. If nothing helps, then you have to [flash the firmware](installation/Flashing) again using the serial interface. Be sure to erase the flash memory before uploading the binary.

### Power monitoring shows wrong values
If the values shown in the Web UI don't seem right and you're using a Supported Module you need to [calibrate the power monitoring sensor](Power-Monitoring-Calibration).

In case you're using a template you created yourself or found in our Templates Repository try the calibration method first. If the values are still wrong or unrealistic the power monitoring sensors' GPIOs are not configured correctly and you will need to find the correct GPIO assignments before proceeding.

### Sensors do not show values
Make sure your sensor is properly wired and the GPIOs assigned. 
Your vanilla `tasmota.bin` doesn't have complete sensor support. Make sure you've installed tasmota-sensors.bin that support the largest number of sensors. Some sensors require enabling in the code and compiling your own binary. See [Builds](Builds) for a comprehensive list of supported components.

### Timers trigger at the wrong time
Tasmota devices must have a their time of day set properly in order for **any** timers to work properly. Check the log in the web UI Console to see if the device's time is set correctly. There are two elements to setting the time: 1. obtaining the UTC time, and, 2. local Daylight Saving Time policies.  

There are three methods available to set the device time: 1. [NTP](http://www.ntp.org/), 2. An [RTC peripheral](peripherals/DS3231), or 3. the [`Time`](Commands#time) command. The typical method Tasmota uses to set its time is to obtain the time from an Internet NTP server. It can also query an NTP server on its local network (e.g., a network router with an NTP service, a Raspberry Pi running the NTP daemon, the [Chrony add-on](https://github.com/hassio-addons/addon-chrony) in Home Assistant, etc.).  

Check the information about your router's features. If the router provides an NTP server, be sure to configure it properly. If the Tasmota device receives its IP address via DHCP from the router, Tasmota will request its time sync from the router's time server. This is managed by the Arduino core, not Tasmota ([\#5283](https://github.com/arendst/Tasmota/issues/5283#issuecomment-466888846)). Therefore, if the NTP server on the router is not configured, or configured improperly, the time on the Tasmota device could be wrong. If the router does not have a time server, this is not the problem.  

If you cannot configure your router's time server to the correct time (e.g., a router provided by your ISP with no access to administration functions), you will need to set a static IP address on the Tasmota device. If the device does not request its address from a DHCP server (i.e., uses a static IP address), the time sync request is forced to `NTPSERVER1`. If can't connect, it tries `NTPSERVER2`. And finally `NTPSERVER3`. Ensure that these parameters are set appropriately and that the device can reach at least one of these time servers. You may want to consider setting up an NTP server locally. As long as the computer is able to set its time at some point from an Internet time server, this computer can serve as an NTP server for your Tasmota device(s). This can be the same computer that hosts your MQTT broker or home automation hub.  

You must also set the [`TimeZone`](Commands#timezone) and Daylight Saving Time policies ([`TimeDST`](Commands#timestd)/[`TimeSTD`](Commands#timedst)).  

If you have timers that use the sunset or sunrise times, you must set your [latitude](Commands#latitude) and [longitude](Commands#longitude) in order for these times to be calculated correctly for your location.

### Auto-discovery in Home Assistant does not work
The `tasmota-lite.bin` firmware binary (which comes packaged with Tuya-Convert) does not support auto-discovery. Please upgrade to `tasmota.bin` or a similar firmware variant that supports this feature.

Make sure its enabled in Tasmota it with `SetOption19 1` and you configured the  Home Assistant MQTT integration with Discovery enabled.

### Why is my changed configuration not loaded?
If you have flashed a precompiled binary, be aware that all the configuration made after the flash (Wi-Fi, MQTT, topics, names, rules, etc) will be lost in a factory firmware reset.

**In short**: The CFG_HOLDER is the place where the config is stored on your device. The device checks if a config is saved in this CFG_HOLDER (value from the my_user_config.h) and always loads this if exists.
=> won't load new applied configs in your my_user_config.h

To get the new config on your device, you need to change the CFG_HOLDER.
BUT: You should always try to stay on the default CFG_HOLDER, to reach this, you need to flash two times

- change your config in the my_user_config.h or better user_config_override.h
- change the CFG_HOLDER number. +1 or -1 is enough (e.g. 0x20161208)
- flash
- change the CFG_HOLDER back to default ( 0x20161209 )
- flash again

After this, your new config is saved in the default CFG_HOLDER on your device. 

This is necessary to avoid losing your config if you update to a new firmware by using the pre-build images or if you forget to change the CFG_HOLDER to your custom one if you build the firmware yourself.

**How CFG_HOLDER works**: The config of your Tasmota is stored in an area of the flash memory (flash config area or _FCA_). Using a new device (where Tasmota firmware runs the first time) the FCA does not contain a Tasmota configuration so on the very first start of Tasmota it uses your settings from _my_user_config.h_ or _user_config_override.h_ and copy this into the FCA.
To prevent that the following Tasmota starts will overwrite your FCA settings again (e.g. because you has changed some things using commands) the FCA will be marked by a header value to indicate not copy the values from _my_user_config.h_/_user_config_override.h_ again. This header becomes the value from CFG_HOLDER.

On every start the device compares the header of FCA with the CFG_HOLDER from your source code and only if this header value is not identical, Tasmotat will copy the data from my_user_config.h/user_config_override.h to flash settings area - this is normally only the case on a fresh device or if you has changed the CFG_HOLDER value.

**Summary**: To force Tasmota to overwrite current (valid or invalid) settings in FCA with your settings from _my_user_config.h_/_user_config_override.h_ you can
- change CFG_HOLDER value once, compile, reflash device (as described above). To avoid overwriting settings by new versions don't forget either
  - repeat the step above using original CFG_HOLDER value
  - or never forget to change CFG_HOLDER value for even all upcoming version to your value
- or use the command `Reset 1` or `Reset 2` after changes in your _my_user_config.h_/_user_config_override.h_ without the need to double reflash your device and/or double change your CFG_HOLDER value:
  - change values in _my_user_config.h_/_user_config_override.h_
  - leave CFG_HOLDER as is
  - start your device and issue command `Reset 1` or `Reset 2`

### How do I invert the output of the green LED on the Sonoff Basic so the LED is on when the relay is off?
[`LedState`](Commands#ledstate) default value is `1` (on) - Show power state on LED. The LED can be disabled completely with `LedState 0` (off).  However, there is no option to invert the output of the green LED on the Sonoff Basic.

### What is an Arduino Core

Arduino Core (open source) are the core libraries for ESP8266/ESP8285 chips to make them Arduino Framework Compatible. This Core is programmed on top of the Espressif SDK (closed source). 

You can see the Arduino Core Version and the Espressif SDK Version on the Tasmota WebUI under the Information Menu entry.
Example: Core-/SDK-Version: **2_3_0**/1.5.3(aec24ac9)

* 2.6.1 (**recommended version**): 
  - All Tasmota features work
  - mqtt reconnect and lagging fixed
  - fixed [Esp8266 IP Address not reachable](https://github.com/esp8266/Arduino/issues/2330)
  - [umm_malloc](https://github.com/esp8266/Arduino/pull/6161) error fixed
  - Extend PWM resolution for low brightness lights ([Details](https://github.com/arendst/Tasmota/pull/5742))
  - Modem Sleep doesn't work but Tasmota has a CPU dynamic sleep to save energy, so it is not a big issue for this core
  - Alexa works
  - Web UI is fast
  - Serial Software exceptions of 2.3.0 are solved
  - Krack Vulnerability is solved
  - Security fix [Beacon Frame Crash](https://github.com/arendst/Tasmota/issues/6348)
  - More RAM is available
  - Firmware is a little bigger in size compared to 2.4.2
  - Most Wi-Fi Repeaters don't produces conflicts or disconnections
  - Mesh Networks are supported
  - Most Routers of brands Ubiquity and Fritzbox don't produces conflicts or disconnections

* 2.3.0 (**this core has many security issues, not supported beginning with 6.7.0.x**)
  - Not all Tasmota features work
  - Modem Sleep works to save energy (see [Energy Saving](Energy-Saving))
  - Web UI is slower
  - Low RAM Available - Not many features can be enabled at once (sensors, etc.)
  - **Has the Krack Vulnerability**
  - Software Serial can produce a restart exception (not enough RAM) if several features are enabled. (So, in this case only hardware serial will work - TX and RX pins)
  - Most Wi-Fi Repeaters produces conflicts and disconnections
  - Mesh Networks are not supported
  - Some Routers of brands (Ubiquiti and Fritzbox) produce conflicts and disconnections
  - If the Wi-Fi router has auto channel, channel switching is reliably  managed by this core 

* 2.4.2 (**avoid this core version, has security issues too, not supported beginning with 6.7.0.x**):
  - All Tasmota features work
  - Modem Sleep doesn't work but Tasmota has a CPU dynamic sleep to save energy, so it is not a big issue for this core
  - Web UI is faster
  - Serial Software exceptions of 2.3.0 are solved
  - Krack Vulnerability is solved
  - More RAM is available
  - Firmware is a little bigger in flash size
  - Most Wi-Fi Repeaters produce conflicts and disconnections
  - Mesh Networks are not supported
  - Some Routers of brands (Ubiquiti and Fritzbox) produce conflicts and disconnections
  - If the Wi-Fi router has auto channel, channel switching is not reliably  managed by this core. Use Fixed Channels in the router instead

* 2.5.2 **Not supported beginning with 6.6.0.18**  

## I Cannot Find An Answer Here!
Check the [Troubleshooting](/help/Troubleshooting) section or join [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota), or the [Community Forum](https://groups.google.com/d/forum/sonoffusers) for assistance from other Tasmota users.  
