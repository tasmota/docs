&emsp;  » v6.5.0

!> **This feature is not included in precompiled binaries.**     
To use it you must [compile your build](compile-your-build). Add the following to `user_config_override.h`:
```c++
#ifndef SUPPORT_MQTT_EVENT
#define SUPPORT_MQTT_EVENT
#endif
```

## Subscribe
Subscribes to an MQTT topic and assigns an [`Event`](Commands#event) name to it. 

`Subscribe <eventName>, <mqttTopic> [, <key>]`
> The command without any parameters will list all currently subscribed topics.

The `<key>` parameter is optional. It is specified to parse a key/value pair from a JSON payload in the MQTT message. In order to parse a value from a multi-level JSON pair, you can use one dot (`.`) syntax to split the key into sections.
You can subscribe a MQTT topic and assign an event name. Once we received subscribed MQTT message, an event will be automatically triggered. So you can set up a rule with `ON EVENT#<event_name> DO ... ENDON` to do whatever you want based on this MQTT message. The payload is passed as a parameter once the event has been triggered. If the payload is in JSON format, you are able to get the value of specified key as a parameter.  

For example, if you have a Tasmota based thermostat and multiple temperature sensors in different locations, usually you have to set up a home automation system like Domoticz to control the thermostat. Right now, with this new feature, you can write a rule to do this.  

**Examples:**  
```console
Rule1
  ON mqtt#connected DO Subscribe BkLight, stat/%topic%/POWER ENDON
  ON Event#BkLight=ON DO <command> ENDON
```
```console
Rule1
  ON mqtt#connected DO Subscribe DnTemp, stat/%topic%/SENSOR, DS18B20.Temperature ENDON
  ON Event#DnTemp>=21 DO <command> ENDON

where the MQTT message payload is `{"Time":"2017-02-16T10:13:52", "DS18B20":{"Temperature":20.6}}`
```

## Unsubscribe
Unsubscribe from topics which were subscribed to using the [`Subscribe`](#subscribe) command.  

Unsubscribe from a specific MQTT topic  
`Unsubscribe <eventName>`  

> The command without a parameter will unsubscribe from all currently subscribed topics.  
