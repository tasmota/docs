
The Teckin SP23 is wifi enabled smart plug with the ability to remotely monitor power consumption and turn devices on and off.

## Details:

The Teckin SP23 appears to be a clone of the BlitzWolf SHP2 hardware with Tuya firmware. It uses an ESP8266EX and is capable of switching up to 16 amps at 250 VAC.

Two Teckin SP23s (marked V1.2) [purchased from Amazon UK](https://www.amazon.co.uk/TECKIN-Outlet-Wireless-Control-Required/dp/B07CVJYV3G) (January 2019) have been flashed successfully and use BlitzWolf SHP2 Sonoff configuration. Voltage calibration may be required for accurate power monitoring.

Two additional Teckin SP23s were [purchased from Amazon UK](https://www.amazon.co.uk/TECKIN-Outlet-Wireless-Control-Required/dp/B07CVJYV3G) (July 2019) and successfully flashed using Tuya-Convert. Upgrading to Tasmota 6.6 and using BlitzWolf SHP configuration was problematic - LED's did not show power status - but downgrading to 6.3 and using BlitzWolf SHP2 as above gave perfect performance. The units were not disassembled so there was no way of determining board version.  

A set of 4 Teckin SP23s were [purchased from Amazon UK](https://www.amazon.co.uk/gp/product/B07QN5XY89) (Sept 2019) and they flashed without issues using Tuya-Convert. This device functions properly with tasmota.bin 6.6.0 (LED flashing blue when ON) with the [template in the repository](https://blakadder.github.io/templates/teckin-sp23.html). 

Two devices purchased on Amazon ES were already patched, but have been successfully flashed with the `new-sdk` branch of [kueblc's tuya-convert fork](https://github.com/kueblc/tuya-convert).

## How to flash

### OTA Flashing
No hardware preparation is required to flash if you are confident about having the same version and can easily be flashed using [Tuya-Convert](Tuya-Convert) methods.

This results in a fully functional device when using the BlitzWolf SHP2 template.

**The ability to OTA flash the device may not work in the future**. Tuya has patched their firmware to block the OTA flashing tools. If the manufacturer updates the firmware shipped with the device to the latest Tuya version, OTA flashing will cease to be an option. As of August 2019, devices purchased from Amazon (link above) were still able to be OTA flashed (via Tuya-Convert).

### Flashing via serial

[Video Tutorial by Marcus Bennett](https://www.youtube.com/watch?v=7vjpcEedEBI)

### Configuration
After flashing and configuring the Wi-Fi parameters, use the Tasmota web UI Configure Template. Set `Based on` to `BlitzWolf SHP (45)` and then change `GPIO2` from `Led1i (56)` to `Led2i (57)` for the LED to operate properly.


## How to disassemble if desired

If you wish to confirm you have the same hardware the Teckin SP23 can be opened by hitting each side of the plug at the lip with a rubber mallet or similar. This will leave a visually unblemished enclosure which can be resecured with superglue or similar.

![](https://i.imgur.com/1wwz6kb.jpg)
![](https://i.imgur.com/4RiNCfg.jpg)
![](https://i.imgur.com/ZTSMI7j.jpg)

**[Full album](https://imgur.com/a/stdhc4c)**

## Home Automation Hub Integration

### openHAB

sonoff.items:
```
Switch BlitzwoIFSHP2 "Switch"  { mqtt=">[broker:cmnd/BlitzwoIFSHP2/POWER:command:*:default],<[broker:stat/BlitzwoIFSHP2/POWER:state:default]" }
Number Power_Total "Total: [%.3f kWh]"  { mqtt="<[broker:tele/BlitzwoIFSHP2/SENSOR:state:JSONPATH($.ENERGY.Total)]" }
Number Power_Today "Today: [%.3f kWh]"  { mqtt="<[broker:tele/BlitzwoIFSHP2/SENSOR:state:JSONPATH($.ENERGY.Today)]" }
Number Power_Yesterday "Yesterday: [%.3f kWh]"  { mqtt="<[broker:tele/BlitzwoIFSHP2/SENSOR:state:JSONPATH($.ENERGY.Yesterday)]" }
Number Power "Power: [%.1f Watt]"  { mqtt="<[broker:tele/BlitzwoIFSHP2/SENSOR:state:JSONPATH($.ENERGY.Power)]" }
Number Voltage "Voltage: [%.0f V]"  { mqtt="<[broker:tele/BlitzwoIFSHP2/SENSOR:state:JSONPATH($.ENERGY.Voltage)]" }
Number Current "Current: [%.3f A]"  { mqtt="<[broker:tele/BlitzwoIFSHP2/SENSOR:state:JSONPATH($.ENERGY.Current)]" }
Number Factor "Factor: [%.2f]"  { mqtt="<[broker:tele/BlitzwoIFSHP2/SENSOR:state:JSONPATH($.ENERGY.Factor)]" }
```

default.sitemap:
```
Switch item=BlitzwoIFSHP2 label="BlitzWoIF SHP2" icon="socket" mappings=[OFF="Off",ON="On"]		
Text item=Power label="Power: [%.1f Watt]" icon="energy"
Text item=Voltage label="Voltage: [%.0f V]" icon="energy"
Text item=Current label="Current: [%.3f A]" icon="energy"
Text item=Factor label="Factor: [%.2f]" icon="energy"
Text item=Power_Total label="Power Total: [%.3f kWh]" icon="energy"
Text item=Power_Today label="Power Today: [%.3f kWh]" icon="energy"
Text item=iPower_Yesterday label="Power Yesterday: [%.3f kWh]" icon="energy"
```

### Home Assistant

```yaml
switch:
  - platform: mqtt
    name: "Blitzwolf"
    state_topic: "stat/blitzwolf/POWER"
    command_topic: "cmnd/blitzwolf/POWER"
    payload_on: "ON"
    payload_off: "OFF"
    retain: false
  
sensor:
  - platform: mqtt
    name: "Blitzwolf Energy Today"
    state_topic: "tele/blitzwolf/SENSOR"
    value_template: '{{ value_json["ENERGY"]["Today"] }}'
    unit_of_measurement: "kWh"
  - platform: mqtt
    name: "Blitzwolf Energy Yesterday"
    state_topic: "tele/blitzwolf/SENSOR"
    value_template: '{{ value_json["ENERGY"]["Yesterday"] }}'
    unit_of_measurement: "kWh"
  - platform: mqtt
    name: "Blitzwolf Energy Total"
    state_topic: "tele/blitzwolf/SENSOR"
    value_template: '{{ value_json["ENERGY"]["Total"] }}'
    unit_of_measurement: "kWh"
  - platform: mqtt
    name: "Blitzwolf Power"
    state_topic: "tele/blitzwolf/SENSOR"
    value_template: '{{ value_json["ENERGY"]["Power"] }}'
    unit_of_measurement: "W"
  - platform: mqtt
    name: "Blitzwolf Voltage"
    state_topic: "tele/blitzwolf/SENSOR"
    value_template: '{{ value_json["ENERGY"]["Voltage"] }}'
    unit_of_measurement: "V"
  - platform: mqtt
    name: "Blitzwolf Power Factor"
    state_topic: "tele/blitzwolf/SENSOR"
    value_template: '{{ value_json["ENERGY"]["Factor"] }}'
```