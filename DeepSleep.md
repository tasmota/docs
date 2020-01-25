Deep sleep support for up to 1 day (i.e., 86,400 seconds) (e.g., if used with KNX) ([`DeepSleepTime`](Commands#deepsleeptime)).

The ESP8266 has a limitation of a maximum of ~71 minutes deep sleep. To overcome the limitation, a short wake-up is performed - the device will wake up every hour for <0.3 seconds until the deep sleep time is reached. The remaining deep sleep time is decremented, and the device is then put back in deep sleep again. The remaining time is stored in RTC memory. As long as the device is powered (e.g., via the battery), this should work fine. Flash memory is not used because of how often this has to occur (every hour) and the time it takes for the flash to be ready takes much longer than the total time to write to the RTC.

`DeepSleepTime` sets the time that the device remains in deep sleep before it returns to full operating mode before returning to deep sleep again. **This cannot be changed!** For example, if you set `DeepSleepTime 3600`, the device will wake up every hour, exactly (e.g., 8:00am, 9:00am, ...). If you define `DeepSleepTime 86400` (i.e., 60\*60\*24), it will wake-up exactly at 0:00 UTC time - not your local time. If you define `DeepSleepTime 600`, it will wake-up every 10 minutes (e.g., 8:00, 8:10, 8:20, ...).

To "reset" deep sleep, temporarily disconnect power and the RTC will be wiped on the next reboot. Alternatively, you can define a deep sleep input to temporarily disable deep sleep (described below).

Please be aware that the minimum deep sleep time is 10 seconds. To wake the device, the RST pin must be connected to the D0/GPIO16 pin because the wake-up signal is sent through D0/GPIO16 to RST.

### Temporarily disable deep sleep mode
There are a couple of different methods to temporarily disable deep sleep mode as outlined below.  

- Use any GPIO and connect it through a 10k resistor to GND. Using D0/GPIO16 is acceptable. You can define the `(182) DeepSleep` component as shown below.

  ![](https://user-images.githubusercontent.com/34340210/66764675-4d302d80-ee78-11e9-80fb-cca65e57f26d.png)
 
  If you want to execute some commands or a special script **BEFORE** the device goes into deep sleep you can use FUNC_SAVE_BEFORE_RESTART as a predefined hook to implement your own procedure. This requires you to code your own function and self-compile custom firmware.  

  To use rules, use the `System#Save` trigger. This will be executed just before the device goes into deep sleep.

- Configure a settable flag in your home automation hub (e.g., Node-Red, openHAB, Home Assistant). The flag should subscribe to the `INFO1` boot time message on the device topic, e.g., `tele/myDeviceTopic/INFO1`.  

  The moment a message is received on this topic, the automation solution can publish a message to topic `cmnd/myDeviceTopic/DeepSleepTime` with a payload `0`. This will cause the device to disable deep sleep and allow maintenance such as firmware updates to be performed without having an unexpected deep sleep event. Send the `DeepSleepTime 0` command **_only once_**.  

  Once the device maintenance is completed, place the device back into deep sleep mode using the original configuration.  

  Be sure to change `myDeviceTopic` to the device topic.

> **If you're having issues after wakeup from sleep make sure bootloop detection is off [`SetOption36 0`](Commands#setoption36) [#6890](https://github.com/arendst/Tasmota/issues/6890#issuecomment-552181980)**

### Overcome any Network issue
If all requirements (Wifi, time synchronization via NTP, MQTT broker connection, and the Teleperiod) are not met, the device will stay awake while trying to attain the remaining requirements. On battery powered devices this behavior is undesirable because it will quickly deplete the battery. To avoid this when these requirements cannot be met, put the device back into deep sleep for an hour. Do this through a rule that will be triggered 30 seconds after reboot and sends the device into deepsleep for an hour.

```console
Rule1
  ON Dimmer#Boot DO RuleTimer1 30 ENDON
  ON Rules#Timer=1 DO DeepSleepTime 3600 ENDON

Rule1 ON
```

### Deep Sleep Algorithm General Timing
Let's assume you have set `DeepSleepTime 3600` (one hour) and `TelePeriod 300` (five minutes). The device will first wake at 8:00 am. The device will boot and connect Wi-Fi. Next, the correct time must be sync'ed from one of the NTP servers. Now the device has all prerequisites for going into deep sleep.  

Deep sleep is then triggered at the TELEPERIOD event. In this example, it will occur after five minutes. Telemetry will be collected and sent (e.g., via MQTT). Now, deep sleep can happen. First, `Offline` is published to the LWT topic on MQTT. It then calculates the new sleeping time to wake-up at 9:00 am (3600 seconds after the last wake-up). At 9:00 am this same sequence of events happens again.  

If you want to minimize the time that the device is in operation, decrease TELEPERIOD down to 10 seconds. This period of time is counted **after** MQTT is connected. Also, in this case, the device will wake up at 9:00 am even if the uptime was much smaller. If the device missed a wake-up it will try a start at the next event - in this case 10:00 am.

## WEMOS D1 Deep Sleep Side-effects
Not all GPIO behave the same during deep sleep. Some GPIO go HIGH, some LOW, some FOLLOW the relay but work only on FET transistors. As soon as current flows they go LOW. I use one GPIO to trigger a BC337 transistor to switch OFF all connected devices during deep sleep.  

Findings:  

Pin|GPIO|Behavior
-|:-:|-
D0|16|Excluded due to use as wake-up pin
D1|5|KEEP STATE, go LOW if resistance to ground < infinite
D2|4|KEEP STATE, go LOW if resistance to ground < infinite
D3|0|HIGH
D4|2|HIGH
D5|14|HIGH, go LOW if resistance to ground < infinite
D6|12|HIGH, go LOW if resistance to ground < infinite
D7|13|HIGH, go LOW if resistance to ground < infinite
D8|15|LOW

## Log Output Explanation
_(logging level `4`)_  

When MQTT connects at `13:08:38`, this sets the system to READY.  
```
13:08:43 MQT: tele/tasmota/INFO3 = {"RestartReason":"Deep-Sleep Wake"}
13:08:44 APP: Boot Count 3
13:08:44 CFG: Saved to flash at F4, Count 96, Bytes 3824
```

In the context of DeepSleep, maintaining a device boot count is not relevant. When deep sleep is enabled, boot count will not be incremented. This avoids excessive flash writes which will deteriorate the flash memory chip and eventually cause the device to fail. Boot count incrementing can be enabled using [`SetOption76`](Commands#setoption76).

In this example, TELEPERIOD is 10. Therefore when TELEPERIOD is reached, telemetry reporting occurs.
```
13:08:48 MQT: tele/tasmota/STATE = {"Time":"2019-09-04T13:08:48","Epoch":1567595328,"Uptime":"0T00:00:14","UptimeSec":14,"Heap":24,"SleepMode":"Dynamic","Sleep":50,"LoadAvg":20,"MqttCount":1,"Wifi":{"AP":1,"SSId":"MyWLAN","BSSId":"AA:FF:AA:AA:AA:AA","Channel":11,"RSSI":100,"LinkCount":1,"Downtime":"0T00:00:08","DeepSleep":300,"Heap":25160}}
13:08:48 MQT: tele/tasmota/SENSOR = {"Time":"2019-09-04T13:08:48","Epoch":1567595328,"ANALOG":{"A0":8}}
```

DATETIME is set. Status and telemetry sent. Now start shutdown procedure.  

First, send MQTT offline.  
`13:08:48 MQT: state/sonoff/LWT = Offline`  

Deep sleep is 300 seconds. Therefore +-30 sec is allowed as the deviation between the proposed time between wake-up and real time between wake-up. Reporting in 0.1sec. In this case wake-up was one second late.  
`13:08:48 Timeslip 0.1 sec:? -300 < -10 < 300`  

If the error is in the range, this is tagged as a normal wake up where drift can we recalculated  
`13:08:48 Normal deepsleep? 1`  

Recalculate a new drift that is a multiplier for the next wake-up in 1/10000. In this case, the multiplier is 1.0257  
`13:08:48 % RTC new drift 10257`  

And for information: New target wake-up time  
`13:08:48 Next wakeup 2019-09-04T13:10:00`  

Based on run time and the error in the last loop, a new sleeping time will be calculated. This will be multiplied by the `deepsleep_slip` and, ideally, the device will wake up at the time above.  
`13:08:48 Sleeptime 285 sec, deepsleep_slip 10257`

The effectiveness of the compensation can be seen here. Instead of typically 160-200 seconds, most times it is better than 10 seconds in a one hour deep sleep cycle.

![TempComp](https://raw.githubusercontent.com/stefanbode/stefanbode.github.io/master/images/deepsleep_comp.png)
