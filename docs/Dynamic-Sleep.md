### Dynamic Sleep (CPU Main loop target / CPU Power Management)

SetOption60 may be used to configure your device to use Normal Sleep or Dynamic Sleep.

Dynamic Sleep is enabled by default from Tasmota version 6.3.0.15 but may be reconfigured by setting the value of SetOption60 accordingly.

Command       | Description
--------------|---------------------------------------------------------------------------
SetOption60 0 | Dynamic Sleep is ENABLED (Default since 6.3.0.15)
SetOption60 1 | Normal Sleep is ENABLED

The term CPU is used loosely here for the sake of making it easier to understand - When the term CPU is used it is actually referring to the ESP8266 SoC Micro Controller.

With the introduction of many new drivers, sensors and other functions as part of the Tasmota firmware, it has become more important to pay specific attention to the amount of microcontroller clock cycles shared with the underlying SDK/Arduino ESP8266 Core.

The main application loop of the Tasmota firmware needs to visit each of the driver callbacks within the main loop to make sure all the required drivers and sensors receive the necessary processing time whilst ensuring that the main loop does not overwhelm the need for processing time by the SDK / Arduino ESP8266 core.

The highest priority drivers/sensors need to be called once per 50ms to operate as designed but most of the normal run of the mill drivers and sensors do not necessarily require this amount of intense polling. The 50-millisecond mark would normally be considered to be an absolute minimum duty cycle for the main processing loop on ESP8266 boards whilst most Sonoff device derivatives will function perfectly well way above this default setting.

To make this manageable from device to device a new setting has been introduced enabling the setting of the main loop target to a specific value in milliseconds.

For default operation, this will be set to 50 milliseconds as there are generally no drivers or sensors that need to be polled at a rate higher than this.

To allow for power usage flexibility this value may also be increased to a value of up to 250 milliseconds which is very useful to reduce power and processing demand on non-time critical devices such as switches (which is what most of Tasmota is used for.)

The purpose of this setting is to allow you as a user to set the speed at which driver and sensors will be serviced and as a result also the amount of time given to the SDK / Arduino ESP8266 core to handle its background tasks (which are not under direct control of the Tasmota firmware.)

### Example Use Case

Let's assume the default value of 50 for sleep and that a simple device such as a Sonoff Basic R1 or R2 is being used.

In this case, the main firmware loop will iterate through all the drivers and sensors once per 50 milliseconds.

Current tests suggest that a simple device such as a Sonoff Basic requires only about 9.5 milliseconds to complete one iteration of servicing all the drivers and sensors enabled in the standard tasmota.bin firmware.

The time management functionality offered by dynamic sleep will compute this time requirement automatically and allow the SDK / Arduino ESP8266 Core to service background tasks such as maintaining WiFi connectivity for the remainder of the time not spent in the main firmware loop - i.e. in the case of sleep 50 this would mean 50 milliseconds - ~9.5 milliseconds = ~40.5 milliseconds spent outside of the main firmware loop servicing SDK / ESP8266 Core functions which automatically consume fewer clock cycles when there is nothing intense for the SDK / ESP8266 Core to maintain or perform.

Normal Sleep was previously the only option for Tasmota powered devices wishing to take advantage of power saving but it does have the disadvantage that the sleep would be a constant setting insofar that the entire firmware codebase would run at a pre-determined speed causing some drivers to run slower than expected and decreasing the speed at which services such as the WebUI is rendered (This varies between the various underlying cores depending on which version is used.)

Using Dynamic Sleep (SetOption60 = 0) instead of Normal Sleep (SetOption60 = 1) has the advantage that CPU time will be given to any particular driver or process (let's say the WebUI) on demand as and when needed whilst spending most of its time waiting for the next main loop iteration to occur.

During this time of waiting the ESP8266's power demand can go from 80mA all the way down to 20mA which yields great benefits for power saving vs. firmware responsiveness compared to the traditional sleep setting.

Normally the target main loop setting would be 50 milliseconds. The firmware will service all the driver and sensor callbacks up to a maximum of 20 times per second. In most cases, this is unnecessary as most normal sensors like temperature sensors only need polling once per second. So, whether you poll the temperature sensor 20 times per second (sleep 50) or 5 times per second (sleep 200) it has no impact on the functionality.
 
Allowing the main loop to iterate 20 times per second vs. 5 times per second is obviously more time consuming and processor consuming leaving less time to idle (i.e., save power).
 
For example, if you were using an MCP230xx with interrupts, and you need a high interrupt response then sleep 50 or lower would make sense since that specific driver can poll once per 50 milliseconds to check for interrupts. Most other sensor polling can be done in intervals longer than 50 milliseconds so you achieve more idle time, and therefore also more sleep time so it saves power.

### Monitoring Performance

Given all the above it is an obvious conclusion that in order to manage something you would need to be able to measure it. For this reason two new variables have been added to the telemetry data namely **LoopSet** and **LoadAvg** and are represented in the telemetry JSON as follows:
```
MQT: tele/sound1/STATE = {"Time":"2018-11-26T17:41:27","Uptime":"0T05:05:17","Vcc":3.504,"SleepMode":"Dynamic","Sleep":50,"LoadAvg":19,"POWER":"OFF","Wifi":{"AP":1,"SSId":"Wireless","BSSId":"DE:AD:00:00:BE:EF","Channel":3,"RSSI":100}}
```

The two values indicated for LoopSet and LoadAvg have the following relation:

Variable  | Value   | Description
----------|---------|---------------------------------------------------------------------------
SleepMode | Normal  | Normal Sleep mode is enabled (SetOption60 = 1)
SleepMode | Dynamic | Dynamic Sleep mode is enabled (SetOption60 = 0)
Sleep     | 50      | Current setting for sleep
LoadAvg   | 19      | Reported % time of Sleep spent doing Tasmota main loop processing

In this example, 19% of 50 milliseconds would be 9.5 milliseconds (19/100*50), so we can see
that there is sufficient headroom for the SDK / ESP8266 Arduino Core to do its background
work.

On some devices which have many sensors connected you may observe the LoadAvg value exceeding 100 - This means that you have not set the value of sleep high enough to accommodate all the sensors and drivers which need to be serviced.

In the latter case, you have two options - either increase the value of sleep to a higher one to maintain a load average well below 100 or use multiple devices to spread the load across separate Tasmota powered devices/boards.

For the most part, all Sonoff based products should perform well balanced with the default setting of 50 for sleep.

### How to use Dynamic Sleep

From serial console, or webui console enter command

`SetOption60 0`
and
`Sleep xx`

Where xx is the number of milliseconds you wish to target your main processing loop at ranging from 0 through to 250.

Should you set a sleep value that is too low you will observe output on telemetry for the value of LoadAvg to be in excess of 100 - This is not ideal and should be avoided as it starves the Arduino Core / SDK of the needed processing time to take care of background tasks such as WiFi management.

For optimal operation of the Tasmota firmware, it is recommended to keep your device running at a LoadAvg value of 75 or lower. If your device does not have any time critical drivers/sensors connected you are encouraged to increase the sleep value to a higher value to gain from the power saving benefits thereof.
