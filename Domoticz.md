<img alt="Sonoff" src="https://github.com/arendst/arendst.github.io/blob/master/media/domoticz2.jpg" width="250" align="right" /> 

Sonoff supports [Domoticz](http://www.domoticz.com/) MQTT 'out of the box' for both relays and sensors.

Find below the procedure to configure Domoticz and Tasmota.

## Prerequisites
The following servers should be made available:

- You have installed/access to a MQTT broker server and made contact with your sonoff
- You have installed Domoticz

### Domoticz MQTT and Virtual Sensor
If not already done configure Domoticz MQTT and Virtual Sensor hardware.

- On the hardware page add Type ```MQTT Client Gateway with LAN interface```
    1. Give it a name
    2. Configure the interface with access to your MQTT server (```Remote Address```, ```Port```, ```Username``` and ```Password```)
    3. Set the ```Public Topic``` to flat (which seems to relate to ```out``` in the select field)
- On the hardware page add Type ```Dummy (used for virtual switches)```
    1. Give it a name

### Domoticz virtual switch
Make a new virtual switch and remeber its Idx number.

1. Make a new virtual switch to be used with Sonoff by clicking ```Create Virtual Sensors```
    1. Give it a name
    2. Select ```Sensor Type Switch```
2. On the Devices page find the new switch by it's name
    1. Remember it's Idx number

## Tasmota
<img alt="Sonoff" src="https://github.com/arendst/arendst.github.io/blob/master/media/domoticz3.jpg" width="250" align="right" /> 
Sonoff provides different ways to configure Domoticz parameters. Choose the method you prefer:

[The sections below don't look like they are needed any longer. The in topic and out topic entry areas don't appear to be in the DOMOTICZ config section for the Sonoffs running Tasmota firmware - at least they are not there in mine and mine is working 17/03/2018]

- Use the webinterface and select ```Configuration - Configure Domoticz```
    1. Set ```In topic``` to ```domoticz/in``` as hardcoded in Domoticz
    2. Set ```Out topic``` to ```domoticz/out``` as hardcoded in Domoticz
    3. Configure ```Idx 1``` to the value read in step 2.i
- Use MQTT and execute commands (if necessary, replace ```sonoff``` with unique topic you configured in Initital Configuration, see point 5 [there](Initital-Configuration)):
    1. ```cmnd/tasmota/DomoticzInTopic``` with payload ```domoticz/in``` as hardcoded in Domoticz
    2. ```cmnd/tasmota/DomoticzOutTopic``` with payload ```domoticz/out``` as hardcoded in Domoticz
    3. ```cmnd/tasmota/DomoticzIdx1``` with payload value read in step 2.i
- Use the serial interface and execute commands:
    1. ```DomoticzInTopic``` with ```domoticz/in``` as hardcoded in Domoticz
    2. ```DomoticzOutTopic``` with ```domoticz/out``` as hardcoded in Domoticz
    3. ```DomoticzIdx1``` with the value read in step 2.i

## Usage    
That's it! You can now switch Sonoff from the Domoticz user interface.

- On the Switches page scroll down and find your Switch as configured in step 1
    - Toggle the light bulb; Sonoff should respond