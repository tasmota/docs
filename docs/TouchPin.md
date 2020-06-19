The ESP32 has 10 capacitive touch GPIOs. It is possible to use a maximum number of 4 as a touch button.  

!!! note
     Only special pins are usable and not all of these 10 pins are exposed on every dev-board. 
  

After wiring a cable or electrode to a supported pin you have to configure it in **Configure Module** as "button_tc".  

It is helpful to understand, what is going on under the hood:  
The continuous pin reading gives a unitless value, that will decrease when the pin (or connected cable) is touched. The touch pin driver 
report a button touch when the pin reading falls below a threshold value for a certain amount of read cycles. The latter is important to filter out spikes.  
  
The default values are very conservative in order to rule out unwanted actions. In most cases it will be desirable to do a calibration.  
  
  
# Commands:  
 
TouchCal x - x=button 1 .. 4. This plots the sensor values to the console, to get information regarding the setting of the 2 following commands  
  
TouchThres x - sets threshold to x, which will get smaller by touching the pin. In the driver a sensor value beneath that threshold, will trigger a button touch.  
  
TouchNum x - sets number of ignored measurements below the threshold, because there will likely be spikes. The default value of 3 is very conservative and 1 should be fine most of the time. A higher value is safer in a noisy environment, but for obvious reasons you will have to touch the pin (or cable ...) longer to trigger the button press.  
   
# Tasmota Serial Plotter  
  
This little tool should be helpful to get a feel for the touch values.
Usage:
./serial-plotter.py --port /dev/XXX --baud 115200

You can send commands to Tasmota via SEND-box.
Example for the touch button driver:
TouchCal 255 - turns on calibration mode for all buttons  
  
