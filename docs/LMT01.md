# LMT01 temperature sensor

!!! info "This feature is included only in tasmota-sensors.bin" 

Otherwise you must [compile your build](Compile-your-build) and define `USE_LMT01`.

The Texas Instruments LMT01 is 2-pin digital output temperature sensor
that converts temperature directly to a sequence of digital pulses,
reading a range from -50°C to +150°C with up to 0.5°C accuracy.  It is
available in a DIY-friendly small TO-92 package.

Connection is by a single GPIO to count the pulses, which needs a
driver transistor to convert the small current changes into logic
level voltage swings.

* [LMT01 data sheet](http://www.ti.com/lit/ds/symlink/lmt01.pdf)
* [LMT01 product page](https://www.ti.com/product/LMT01) with links to evaluation board and 
  [training video and sample code](https://training.ti.com/how-interface-lmt01-temperature-sensor-arduino).


*Limitations of current implementation*: 

* Only the simple linear conversion is used.  The datasheet suggests
the use of a look-up table to improve the accuracy at the edges of the
range, this is not yet implemented.
* The sensor code only supports one LMT01 instance.


## Configuration

Choose a pin GPIOx.  The GPIO can be connected to the LMT01 via a NPN
transistor, so current pulses pull the GPIO line low: see Figure 32
in the LMT01 datasheet.

In the **_Configuration -> Configure Module_** page assign:

* GPIOx to `LMT01 Pulse`

After a reboot the sensor will be detected and displayed.  If the
connection is not working, the pulse counting will timeout and you will
see `null` displayed for the temperature.

