# Thermostat

The Thermostat driver allows the tasmota device, provided it receives the temperature input via MQTT or a locally connected sensor, to follow control heating/cooling strategies to reach the desired setpoint. The thermostat offers similar functions as feature reach commercial ones, similar to the ones found below:

![Pinout](_media/thermostat/Feature_rich_thermostat.png)

## Typical setup: Heating floor system

A typical setup for heating room systems can be found in the picture below. A conventional room thermostat is connected to a heating floor valve actuator, both running at AC voltage (f.i. 220V). The thermostat is connected to neutral as well as to the phase, the actuator to the same neutral connection of the thermostat and to its actuation signal. The actuation signal will switch between the neutral voltage (actuation Off) and the phase voltage (actuation On).

The conventional room thermostats offer nowadays either 2 point control with hysteresis or a more advanced PI (Proportional-Integral) control. The result of the PI control is typically transformed into a PWM signal with a pre-defined period and a variable duty cycle.

![Pinout](_media/thermostat/conventional_thermostat.png)

### Use of tasmota switch to bypass an existing wall thermostat

A tasmota switch can be installed in a way that it bypasses the existing wall thermostat. The advantage of this setup is that the thermostat driver offers the possibility to follow the output of the existing wall thermostat or acting autonomously. This setup allows a seamless integration with existing wall thermostats and gives the user the freedom to still use them.

Below you can find an example of a Shelly switch bypassing a wall thermostat:

![Pinout](_media/thermostat/bypass_thermostat.png)

### Temperature sensors

The tasmota driver can receive the temperature either via the related MQTT command or via a local temperature sensor (see example of DS18B20 and shelly addon below).

![Pinout](_media/thermostat/sensors.png)

## Advanced features

### Multi-controller

The tasmota driver can be compiled to be used in devices with more than one output, allowing independant controllers for each one of the outputs. This feature has been successfully tested with an Sonoff 4CH PRO R2.

![Pinout](_media/thermostat/multi-thermostat.png)
