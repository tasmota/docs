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
  "btn":[0,0,0,0],                                  // Buttons, 0: disabled: 1: enabled
  "dn":"Living Room",                               // Device name
  "ip":"192.168.15.10",                             // IP address
  "fn":["Ceiling Lamp", "Floor Lamp"],              // List of friendly names
  "ft":"%prefix%/%topic%/",                         // Fulltopic
  "hn":"tasmota_49A3BC-0956",                       // Hostname
  "mac":"49A3BC873A78",                             // MAC address
  "md":"Sonoff Dual",                               // Module
  "ofln":"Offline",                                 // D_OFFLINE
  "onln":"Online",                                  // D_ONLINE
  "rl":[0,0,0,0,0,0,0,0],                           // Relays, 0: disabled, 1: relay, 2.. future extension (fan, shutter?)
  "so":{"13":0,"17":1,"30":0,"37":1,"68":0,"73":1}, // SetOption needed by HA to map Tasmota devices to HA entities and triggers
  "state":["OFF","ON","TOGGLE","HOLD"],             // StateText[0..3]
  "sw":"13.3.0"                                     // Tasmota SW build version
  "swc":[0,0,0,0,0,0,0,0],                          // Switches, 0: disabled: 1: enabled
  "t":"tasmota_49A3BC",                             // Topic
  "tp":["cmnd","stat","tele"],                      // [SUB_PREFIX, PUB_PREFIX, PUB_PREFIX2]
  "lt_st":0,                                        // Light subtype
  "ver":1                                           // Discovery protocol version, must be 1
}
```
