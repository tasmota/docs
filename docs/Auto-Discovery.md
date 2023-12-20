description: Device auto discovery

# Auto discovery
Tasmota auto discovery is meant to replace deprecated [Home Assistant discovery]([Home-Assistant.md](Home-Assistant.md#legacy-discovery-format)) (`SetOption19`) by a custom discovery format better suited for Tasmota.

> Home Assistant's MQTT discovery protocol includes a lot of redundant information which increases Tasmota's code size, and has some crucial limitations e.g. RGBxx lights flickering when turning on from HA.
> Also, Home Assistant's MQTT discovery protocol is not easy to add new features or make breaking changes to. (https://github.com/arendst/Tasmota/issues/9267)

## Availability
* Starting `v9.3.1.2` Tasmota ships with its format as an alternative to Home Assistant discovery.
* Since `v11.1.0.2` Home Assistant discovery is considered deprecated.

## Discovery message format
Topic: `tasmota/discovery/49A3BC`

Payload:
```
{
  "ip":"192.168.15.10",                             // IP address
  "dn":"Living Room",                               // Device name
  "fn":["Ceiling Lamp", "Floor Lamp"],              // List of friendly names
  "hn":"tasmota_49A3BC-0956",                       // Hostname
  "id":"49A3BC",                                    // ChipID
  "md":"Sonoff Dual",                               // Module
  "of":"Offline",                                   // D_OFFLINE
  "on":"Online",                                    // D_ONLINE
  "st":["OFF","ON","TOGGLE","HOLD"],                // StateText[0..3]
  "bd":"8.4.0.2",                                   // Tasmota SW build version
  "t":"tasmota_49A3BC",                             // Topic
  "ft":"%prefix%/%topic%/",                         // Fulltopic
  "tp":["cmnd","stat","tele"],                      // [SUB_PREFIX, PUB_PREFIX, PUB_PREFIX2]
  "li":[0,0,0,0,0,0,0,0],                           // Lights, 0: disabled, 1: Enabled
  "rl":[0,0,0,0,0,0,0,0],                           // Relays, 0: disabled, 1: relay, 2.. future extension (fan, shutter?)
  "sw":[0,0,0,0,0,0,0,0],                           // Switches, 0: disabled: 1: enabled
  "bt":[0,0,0,0],                                   // Buttons, 0: disabled: 1: enabled
  "so":{"13":0,"17":1,"30":0,"37":1,"68":0,"73":1}, // SetOption needed by HA to map Tasmota devices to HA entities and triggers
  "lt_st":0,                                        // Light subtype
  "se":[0],                                         // Sensors, 0: disabled, 0..xx index in kHAssJsonSensorTypes (??)
  "ver":1                                           // Discovery protocol version, must be 1
}
```
