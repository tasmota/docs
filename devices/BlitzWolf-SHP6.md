![BlitzWolf SHP6](https://raw.githubusercontent.com/wiki/RTurala/Sonoff-Tasmota/images/BlitzWolf-SHP6/BW-SHP6-01.jpg ":size=200")

The BlitzWolf BW-SHP6 and the Gosund SP111 are basically the same device, barring the branding.  

Product page:
- [BlitzWolf® BW-SHP6 - 2300W EU WIFI Smart Socket](https://www.blitzwolf.com/2300W-EU-WIFI-Smart-Socket-p-300.html)
- [Gosund SP111](https://www.gosund.store/)  

Device needs exact calibration with a load >=60 Watt to gain good results!
For further infos see [Issue #4727](https://github.com/arendst/Tasmota/issues/4727)

## Serial Connection

Please see the [Hardware Preparation](installation/Hardware-Preparation) page for general instructions.

### Step 1
**Disconnect device from power source!**

### Step 2
Remove one screw on the back of the device. **PH1** screwdriver required.

![One PH1 Screw](https://raw.githubusercontent.com/wiki/RTurala/Sonoff-Tasmota/images/BlitzWolf-SHP6/BW-SHP6-02.jpg ":size=200")

### Step 3
Undo 2 screws. **PH1** screwdriver required.
Disconnect antenna.

![Two PH1 Screws and antenna](https://raw.githubusercontent.com/wiki/RTurala/Sonoff-Tasmota/images/BlitzWolf-SHP6/BW-SHP6-03.jpg ":size=200")

### Step 4
Carefully remove PCB from casing for easier soldering.
* Don't stress antenna cable too much.
* Don't lose metal tube.

### Step 5
Solder cables to the ESP Pins.

SHP6 10A model:
![Solder points](https://raw.githubusercontent.com/wiki/RTurala/Sonoff-Tasmota/images/BlitzWolf-SHP6/BW-SHP6-04.jpg ":size=200")

SHP6 15A model:
![Solder points](
https://raw.githubusercontent.com/tiagofreire-pt/docs/master/_media/Blitzwolf_SHP6_15A.jpg ":size=200")

If you do not want to solder you can try using crocodile clips and manually push a jumper cable first to IO0 (enter flash mode while booting, i.e. connect IO0 to ground) and then during flashing push a jumper to TX. Just be careful to not cause any short-circuit with the clips on the other side of the pads.

[Crocodile clips](https://nc.jahnen.me/apps/files_sharing/publicpreview/ES2nWDNsgc9MgJY?x=1920&y=685&a=true&file=blitzwolf_shp6_crocodile_clips.jpg)


### Step 6
Connect serial adapter and make a shortwire between Pin IO0 and GND during startup (for entering flashmode).

![Soldered cables](https://raw.githubusercontent.com/wiki/RTurala/Sonoff-Tasmota/images/BlitzWolf-SHP6/BW-SHP6-05.jpg ":size=200")

### Step 7
Erase flash to avoid issues with dropping WiFi connection.

Example using esptool:
```
esptool.py --port COM3 erase_flash
```

### Step 8
Flash Tasmota.

### Step 9
Select the correct configuration under _Configuration -> Configure Module_ or apply [correct template](#template)

* [SHP6 10A model](https://blakadder.github.io/templates/blitzwolf_SHP6.html)
* [SHP6 15A model (compatible with SP111 v2)](https://blakadder.github.io/templates/gosund_SP111_v2.html)

### As an alternative for steps 2 to 5: 
The following programming adapter could be an option, which requires no soldering or significant disassembly on the SHP-6.
It significantly reduces the effort of reflashing multiple SHP-6 units. [Thingiverse link](http://www.thingiverse.com/thing:3476167)

![adapter](https://cdn.thingiverse.com/renders/e2/cc/49/cc/6a/298542652c3ba493b6d4a284ed505efe_preview_featured.jpg ":size=200")

## Other photos

![Left side](https://raw.githubusercontent.com/wiki/RTurala/Sonoff-Tasmota/images/BlitzWolf-SHP6/BW-SHP6-06.jpg ":size=100")
![Right side](https://raw.githubusercontent.com/wiki/RTurala/Sonoff-Tasmota/images/BlitzWolf-SHP6/BW-SHP6-07.jpg ":size=100")
![Back](https://raw.githubusercontent.com/wiki/RTurala/Sonoff-Tasmota/images/BlitzWolf-SHP6/BW-SHP6-08.jpg ":size=100")
![All parts](https://raw.githubusercontent.com/wiki/RTurala/Sonoff-Tasmota/images/BlitzWolf-SHP6/BW-SHP6-09.jpg ":size=100")

# Power monitoring calibration
Approach the calibration using the Method 2. If not satisfied with the results, you could mod the SMD direct measure resistor or mitigate this using a Tasmota set of rules (values valid only for the 10A model):

```console
Rule1 ON energy#power<=100 DO Currentcal 2500 BREAK ON energy#power<=500 DO Currentcal 2635 BREAK ON energy#power<=1000 DO Currentcal 2788 BREAK ON energy#power<=1500 DO Currentcal 2942 BREAK ON energy#power<=2000 DO Currentcal 3095 BREAK ON energy#power<=2500 DO Currentcal 3249 BREAK ON energy#power>2500 DO Currentcal 3402 BREAK 
Rule1 1
```

Take the CurrentCal values above as a first approach and should be corrected through the Tasmota Method 2 calibration procedure: [[devices/Power-Monitoring-Calibration]]

## Home Assistant configuration 
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
