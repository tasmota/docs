The ESP32 has 10 capacitive touch GPIOs. It is possible to use a maximum number of 4 as a touch button.

!!! note
     Only special pins are usable and not all of these 10 pins are exposed on every dev-board. 
  

After wiring a cable or electrode to a supoorted pin you have to configure it in **Configure Module** as "button_tc".

It is helpful to understand, what is going on under the hood:
The continuous pin reading gives a unitless value, that will decrease when the pin (or connected cable) is touched. The touch pin driver 
report a button touch when the pin reading falls below a threshold value for a certain amount of read cycles. The latter is important to filter out spikes.  

The default values are very conservative in order to rule out unwanted actions. In most cases it will be desirable to do a calibration.  
