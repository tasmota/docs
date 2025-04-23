# Capacitive Touch GPIO :material-cpu-32-bit:

The ESP32 has 10 capacitive touch GPIOs. It is possible to use a maximum number of 4 as a touch button.  

!!! note
     Only special pins are usable and not all of these 10 pins are exposed on every dev-board. More info in this [article](https://randomnerdtutorials.com/esp32-touch-pins-arduino-ide/)
  

After wiring a cable or electrode to a supported pin you have to configure it in **Configure Module** as "button_tc".  

It is helpful to understand, what is going on under the hood:  
The continuous pin reading gives a unitless value, that will decrease (ESP32) or increase (ESP32-S2 and S3) when the pin (or connected cable) is touched. 
As a result the touch pin driver will report a button touch when the pin reading crosses a threshold value which can be modified at runtime.  
The default values are very conservative in order to rule out unwanted actions. In most cases it will be desirable to do a calibration.   
  
## Commands:  
 
| __Command__ | __Description__                            |
|------------|--------------------------------------------|
| TouchCal x    | x=button 1 .. 4. This plots the sensor values to the console, to get information regarding the setting of the `TouchThres` value.<BR> 0 will turn off calibration<BR> 255 will turn on calibration for all buttons     |
| TouchThres x  | Set touch threshold for all touch buttons, as determined via the `TouchCal` command. |
  
While the calibration process is running, the raw data values will be printed in the console in the format:  
<Time> PLOT: g, v, h,  
     
g - number of the graph (= number of the button)
v - raw value of the corresponding touch pin
h - number of continuous hits below current threshold, useful to see the number and length of "spikes", should be 0 without touching
  
### Tasmota Serial Plotter  
  
This little tool should be helpful to get a feel for the touch values. It is located in the /tools folder of the Tasmota repository and needs the installation of "mathplotlib" and "pyserial" in the active python environment. It is confirmed to work under Windows 10 and macOS Catalina.  

Example: `./serial-plotter.py --port /dev/XXX --baud 115200`

You can send commands to Tasmota via SEND-box.  
  
!!! example "For the touch button driver:"
    `TouchCal 255` - turns on calibration mode for all buttons  
  
  
![](https://user-images.githubusercontent.com/5481060/83327677-f730be80-a27d-11ea-85a2-bf72e644cb4e.gif)  
