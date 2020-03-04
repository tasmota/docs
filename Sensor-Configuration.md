?> Read before continuing:   
 &emsp;- [Components](Components)    
 &emsp;- [Expanding Tasmota](Expanding-Tasmota) 

> [!WARNING]
>A peripheral must have correctly wired power, GND and data pins to the device prior to booting in order for Tasmota to detect it and initialize it properly.

## Tasmota Settings
<img src="https://user-images.githubusercontent.com/5904370/68432161-2a154700-01b4-11ea-8ba9-adb7b717490d.png" style="float:right;height:15em;margin:10px 0">
Tasmota allows for easy selection of peripherals (sensors, switches, etc) and assignment to GPIO pins. 

Configuration is possible in the webUI ***Configuration - Configure Module*** page

or by using commands: [`Module`](Commands#module) and [`GPIO`](Commands#gpio), or [`Template`](Commands#template).

**[`Module`](Commands#module)**    
First select desired module for the device (Wait for the restart). Depending on the type of [Module](Modules), only certain GPIO pins are user configurable. Module Generic (18) has all the GPIOs configurable.   

_[`Modules`](Commands#modules) shows supported modules_

**[`GPIO`](Commands#gpio)**    
Assign a [component](Components) to a GPIO.
   
- `gpio14 2` configures sensor AM2301 to GPIO14_    
- `Backlog gpio14 5; gpio4 6` sets I<sup>2</sup>C SCL to GPIO14 and I<sup>2</sup>C SDA to GPIO4
   Tasmota will auto-detect all connected and supported I<sup>2</sup>C devices. If you have conflicting I<sup>2</sup>C addresses see [I2CDevices](I2CDevices)

_[`Gpios All`](Commands#gpios) shows list of all available components by name and index_

**For a peripheral to show up you may need to power cycle your device instead of a soft restart.**

**[`Template`](Commands#template)**   
Instead of using `Module` and `GPIO` you can define all using `Template` [Read more...](Templates#template-configuration-with-commands)

## Additional Options
### Measurement Units
Temperature units can be set to Celsius or Fahrenheit with [`SetOption8`](Commands#setoption8) command.

Pressure units can be set to hPa or mmHg with [`SetOption24`](Commands#setoption24) command. 
### Update Interval
To change the update interval (teleperiod) of MQTT messages change the [`TelePeriod`](Commands#teleperiod). Default interval is 300 seconds but can be set between 10 and 3600 seconds.    
`TelePeriod 10` will set the update interval to 10 seconds, so the sensor will update 6 times a minute.

### Peripheral Specific
Some peripherals offer, or even require, additional commands. See [Commands](Commands#Sensors) page for peripheral specific commands.
