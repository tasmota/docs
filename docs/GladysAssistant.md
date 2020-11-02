<img src="_media/logo/gladys.png" title="Gladys Assistant" style="float:right"/>
Tasmota supports [Gladys Assistant](https://gladysassistant.com/) MQTT for both relays and sensors.
HTTP protocol incoming soon.

Find below the procedure to configure Gladys Assistant and Tasmota.

#### Prerequisites
The following servers should be made available:

- You have installed Gladys Assistant (embedded MQTT broker available)
- You have installed/access to a MQTT broker server and made contact with your Tasmota device

## Automatic Disovery

[Gladys Assistant](https://gladysassistant.com/) automatically discovers Tasmota devices (once all are connected on same MQTT broker).

On [Gladys Assistant](https://gladysassistant.com/) application:
1. Go to `Integration` page
2. Look for `Tasmota` element, click on it
3. Then, `MQTT discover`
4. `Save` to add device

Try on [Gladys Assistant demonstration website](https://demo.gladysassistant.com/).
