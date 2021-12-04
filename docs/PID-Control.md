This extension adds a PID (Proportional Integral Derivative) feature into the Tasmota software.  

The PID algorithm is designed to be used to control real-world processes.  This includes room heating/cooling, temperature control when brewing, and a multitude of other processes.  The PID tuning parameters are designed to be meaningful in the real world (rather than the abstract Ki Kd Kp that are often used which are completely meaningless to most). The algorithm is based on that in the node-red node [node-red-contrib-pid](https://www.npmjs.com/package/node-red-contrib-pid) which has been well received.

In use it can either regularly be given the current process value via MQTT or if the device has a sensor attached then that sensor can be used to read the process value.  So using any Tasmota-capable device with a e.g. a temperature sensor (e.g. a TH10 with a DS18B20) the complete PID loop control can be built into the device so that the process will continue to be controlled even if the wifi is down.  This is a very cost effective way of achieving PID control.

The algorithm allows the relay to be used in a time proportioned way using the [Time Proportioned output](Time-Proportioned-Output-support) extension.

The loop tuning parameters can be set at build time and can be adjusted at run time via MQTT.

The feature is included in Tasmota v9.3.0 onward.

The PID code adds about 11.1k and the Timeprop code another 1k

Detailed instructions for setup are in these two xdrv files: [`tasmota/xdrv_48_timeprop.ino`](https://github.com/arendst/Tasmota/blob/development/tasmota/xdrv_48_timeprop.ino) and [`tasmota/xdrv_49_pid.ino`](https://github.com/arendst/Tasmota/blob/development/tasmota/xdrv_49_pid.ino).

The ESP8266 will run the PID algorithm at 1 cycle per second, which is much faster than is needed for the sort of processes Sonoff devices are usually associated with.  It rather clobbers the Tasmota terminal output in the web browser at that rate so it is getting near to the limit.  The maximum anyone is likely to need it running at is maybe once every 5 seconds, and the majority of home IoT applications probably nearer once per minute would be sufficient, so the device is well up to the task.

Help with using the PID algorithm and with loop tuning can be found at  http://blog.clanlaw.org.uk/pid-loop-tuning.html  This is directed towards using the algorithm in the node-red node node-red-contrib-pid but the algorithm here is based on the same code so the tuning technique described there should work just the same.

Due to limited hardware availability this has so far only been tested in a Sonoff Basic with a TH10, and a Sonoff Mini with a DS18B20 connected. If there are any issues running this on other hardware let us know.
