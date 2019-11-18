Sonoff supports automatic discovery by [Domoticz](http://www.domoticz.com/) through the [Domoticz MQTT Discovery plugin](https://github.com/emontnemery/domoticz_mqtt_discovery).

## Prerequisites
The following services should be made available:

- You have installed/access to a MQTT broker server and made contact with your sonoff
- You have installed Domoticz
- You have installed the Domoticz MQTT Discovery plugin

### Domoticz MQTT Discovery plugin
Configure Domoticz MQTT Discovery plugin.

- On the hardware page add Type ```MQTT Discovery```
    1. Give it a name, e.g. ```Sonoff```
    2. Configure the interface with access to your MQTT server (```MQTT Server Address```, ```Port```, ```Username``` and ```Password```)
    3. Set the ```Discovery topic``` to ```homeassistant``` unless it has been changed in a custom Tasmota build
    4. Set the ```Ignored device topic``` to ```tasmota/sonoff/``` to avoid unconfigured Tasmota devices from being discoved

## Tasmota (official binary)
- Each Tasmota device must have it's own topic, the easiest way is to set topic to ```sonoff_%06X``` (%06X will be replaced by MAC address). See point 5 [here](Initial-Configuration) for how to set the topic.
- Use MQTT or Serial or Web console and execute commands (replace ```<sonoff_MAC>``` with the device's unique topic)
    1. ```cmnd/<sonoff_MAC>/SetOption19``` with payload ```1``` to enable MQTT discovery

## Tasmota (custom binary)
- The above settings can be defined in user_config_override.h (TBD)

## Usage    
That's it! You will now find your Sonoff in the Domoticz user interface.

- On the Switches page scroll down and find your Switch as configured in step 1
    - Toggle the light bulb; Sonoff should respond

