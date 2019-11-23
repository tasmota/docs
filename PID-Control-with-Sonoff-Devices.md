This extension adds a PID (Proportional Integral Derivative) feature into the Tasmota software.  

The PID algorithm is one designed to be used to control real-world processes that the users of Sonoff devices are likely to encounter.  This includes room heating/cooling, temperature control when brewing, and a multitude of other processes.  The PID tuning parameters are designed to be meaningful in the real world (rather than the abstract Ki Kd Kp that are often used which are completely meaningless to most). The algorithm is based on that in the node-red node [node-red-contrib-pid](https://www.npmjs.com/package/node-red-contrib-pid) which has been well received.

In use it can either regularly be given the current process value via MQTT or if the device has a sensor attached then that sensor can be used to read the process value.  So using a TH10 with a DS18B20 the complete PID loop control can be build into the device so that the process will continue to be controlled even if the wifi is down.  This is a very cost effective way of achieving PID control.

The algorithm allows the relay to be used in a time proportioned way using the [Time Proportioned output](Time-Proportioned-Output-support) extension.

The loop tuning parameters can be set at build time and can be adjusted at run time via MQTT.

To add the feature into the standard Tasmotta s/w (at least version 5.12.0 is required) then have a look at the pid_branch of the tasmota fork at https://github.com/colinl/Sonoff-Tasmota/tree/pid_branch. Pick up from there the files in the folder `lib/ProcessControl` (which are from this [process-control repository](https://github.com/colinl/process-control)) and `sonoff/xdrv_91_timeprop.ino` and `sonoff/xdrv_92_pid.ino` and add them into your Tasmota sources.

The PID code adds about 4.3k and the Timeprop code another 1.2k

Instructions for setup are in the two xdrv files.

The ESP8266 will run the PID algorithm at 1 cycle per second, which is much faster than is needed for the sort of processes Sonoff devices are usually associated with.  It rather clobbers the Tasmota terminal output in the web browser at that rate so it is getting near to the limit.  The maximum anyone is likely to need it running at is maybe once every 5 seconds, and the majority of home IoT applications probably nearer once per minute would be sufficient, so the device is well up to the task.

Help with using the PID algorithm and with loop tuning can be found at  http://blog.clanlaw.org.uk/2018/01/09/PID-tuning-with-node-red-contrib-pid.html  This is directed towards using the algorithm in the node-red node node-red-contrib-pid but the algorithm here is based on the same code so the tuning technique described there should work just the same.

Due to limited hardware availability this has so far only been tested in a Sonoff Basic and a TH10, if there are any issues running this on other hardware let me know.

For any issues please submit an issue to the Tasmota fork on gitub or ask on the [sonoff mailing list](https://groups.google.com/d/forum/sonoffusers).