## Theo's Tasmota Tips

[remoteMarkdownUrl](https://raw.githubusercontent.com/tasmota/docs/master/Theo's-Tasmota-Tips.md)

## Obtaining the IP address of a Tasmota device
- The network name is be `<MQTT_TOPIC>-<last 4 decimal chars of MAC address>`. The default name is `sonoff-xxxx`.
- Use the `Status 5` command

## Available Characters for HOSTNAME
  - 24 chars max
  - only a..z A..Z 0..9 '-'
  - no '-' as last char

**RFC952**  
>  ASSUMPTIONS  
>  1. A "name" (Net, Host, Gateway, or Domain name) is a text string up    to 24 characters drawn from the alphabet (A-Z), digits (0-9), minus    sign (-), and period (.).  Note that periods are only allowed when    they serve to delimit components of "domain style names". (See    RFC-921, "Domain Name System Implementation Schedule", for    background).  No blank or space characters are permitted as part of a    name. No distinction is made between upper and lower case.  The first    character must be an alpha character.  The last character must not be    a minus sign or period.  A host which serves as a GATEWAY should have    "-GATEWAY" or "-GW" as part of its name.  Hosts which do not serve as    Internet gateways should not use "-GATEWAY" and "-GW" as part of    their names. A host which is a TAC should have "-TAC" as the last    part of its host name, if it is a DoD host.  Single character names    or nicknames are not allowed.  

## Flash Memory Considerations
- To stop saving parameter changes to Flash or Spiffs use command ```SaveData off```.

- To stop saving power changes only to Flash or Spiffs use command ```SetOption0 off```. This will disable the relay from returning to the same state after power on UNLESS you use the MQTT retain flag in which case the MQTT broker will send the last known MQTT state on restart or power on. The command ```ButtonRetain on``` will configure the button to send a MQTT command with Topic and the MQTT retain flag set.

## 3D Printed Cases
Don't have 3D printer? Depending on where you live, you may be able to find a third party to print the model for you. Some schools and public libraries provide printing services. Search for a printing service using [3D Hubs](https://www.3dhubs.com/) or send your design to a service like [Shapeways](https://www.shapeways.com/).  
- [**Thingiverse**](https://www.thingiverse.com/search?q=tasmota&dwh=375b8ac9ddc286e)
- [**Yeggi**](https://www.yeggi.com/q/sonoff/)
