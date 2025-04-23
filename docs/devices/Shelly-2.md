**Shelly 2 is discontinued and replaced by [Shelly 2.5](Shelly-2.5)**
<img src="https://shelly.cloud/wp-content/uploads/2018/02/shelly2_small_250.png" width="250" align="right" />

The Shelly 2 is fully supported in Tasmota from version 6.2.1.7<br>

## ⚠️️Special Shelly Attention⚠️️

**DO NOT CONNECT ANYTHING TO ANY GPIOs OF THESE DEVICES!!! (No sensors, no switches, nothing) <br>
The GPIOs on the Shelly are connected to AC power!** Only use a Shelly as designed. 

**Do not connect AC power and the serial connection at the same time**
The GND connection of the Shelly is connected to the live AC wire. Connecting serial with your PC will fry your PC.

**Check the correct jumper position before connecting AC power to Shelly 1.**
If the jumper is set to 12V you will destroy your Shelly!
# Shelly 2
An ESP8266 with 2MB flash dual relay device with Energy Monitoring the size of round 45mm.<br>
<img src="https://raw.githubusercontent.com/arendst/arendst.github.io/master/media/shelly/shelly2_serial_connection2.jpg" height="250"></img>

## Templates as of v6.4.1.17
The inbuilt template equals the following:<br>
``{"NAME":"Shelly 2","GPIO":[0,135,0,136,21,22,0,0,9,0,10,137,0],"FLAG":0,"BASE":47}``<br>
An alternative template without switch pull-up is:<br>
``{"NAME":"Shelly 2n","GPIO":[0,135,0,136,21,22,0,0,82,0,83,137,0],"FLAG":0,"BASE":47}``

## Pullup or no pullup
The shelly 2 inputs may or may not need pullups for SW1 and SW2 to work correctly. Default state is pullups enabled.

To disable pullups either use command SetOption62 1 or select the option from the GUI.

<img src="https://raw.githubusercontent.com/arendst/arendst.github.io/master/media/shelly/shelly2pullup.png" width="250"></img>

Refer to the following issue: <https://github.com/arendst/Tasmota/issues/4841>
