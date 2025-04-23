This extension adds a PID (Proportional Integral Derivative) feature into the Tasmota software.  

The PID algorithm is designed to be used to control real-world processes.  This includes room heating/cooling, temperature control when brewing, and a multitude of other processes.  The PID tuning parameters are designed to be meaningful in the real world (rather than the abstract Ki Kd Kp that are often used which are completely meaningless to most). The algorithm is based on that in the node-red node [node-red-contrib-pid](https://www.npmjs.com/package/node-red-contrib-pid) which has been well received.

In use it can either regularly be given the current process value via MQTT or if the device has a sensor attached then that sensor can be used to read the process value.  So using any Tasmota-capable device with e.g. a temperature sensor (e.g. a TH10 with a DS18B20) the complete PID loop control can be built into the device so that the process will continue to be controlled even if the wifi is down.  This is a very cost effective way of achieving PID control.

The algorithm allows the relay to be used in a time proportioned way using the [Time Proportioned output](Time-Proportioned-Output-support) extension.

The loop tuning parameters can be set at build time and can be adjusted at run time via MQTT.  Choice of which local sensor to servo to is set at build time, with configuration looking like: 

    #define PID_LOCAL_SENSOR_NAME "ANALOG"
    #define PID_LOCAL_SENSOR_TYPE "Temperature1"

The feature is included in Tasmota v9.3.0 onward.

The PID code adds about 11.1k and the Timeprop code another 1k

Detailed instructions for setup are in these two xdrv files: [`tasmota/xdrv_48_timeprop.ino`](https://github.com/arendst/Tasmota/blob/development/tasmota/tasmota_xdrv_driver/xdrv_48_timeprop.ino) and [`tasmota/xdrv_49_pid.ino`](https://github.com/arendst/Tasmota/blob/development/tasmota/tasmota_xdrv_driver/xdrv_49_pid.ino).

The ESP8266/ESP32 will run the PID algorithm at up to 1 cycle per second (whenever a physical PV value is set through MQTT, or obtained locally every second of a locally attached sensor), which is much faster than is needed for the sort of processes Sonoff devices are usually associated with (eg, thermostats in rooms with response functions of the order of 10 minutes).  It rather clobbers the Tasmota terminal output in the web browser at that rate, but show no real signs of stress.  For locally attached sensors, the process control survives network detachment and loss of communications to the MQTT server.

Help with using the PID algorithm and with loop tuning can be found at <http://blog.clanlaw.org.uk/pid-loop-tuning.html>. This is directed towards using the algorithm in the node-red node node-red-contrib-pid but the algorithm here is based on the same code so the tuning technique described there should work just the same.

This has been tested in a Sonoff Basic with a TH10, and a Sonoff Mini with a DS18B20 connected, and a ESP32 DevKit with a NTC thermistor attached to a GPIO port and tuned appropriately. If there are any issues running this on other hardware let us know.
