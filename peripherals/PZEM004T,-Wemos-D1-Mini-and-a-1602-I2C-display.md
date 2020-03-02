# Connected Power Meter using PZEM-004T, Wemos D1 Mini and a 1602 I<sup>2</sup>C display

## Parts needed
- Wemos D1 Mini
- PZEM-004T
- 1kOhm Resistor (optional - see alternate wiring)
- [Enclosure](https://www.itead.cc/smart-home/sonoff-ip66.html)
- 5V buck converter power supply (search for "700ma 3.5w 5v" on usual stores...)
- I<sup>2</sup>C 1602 LCD Display (I had issues with green one, I<sup>2</sup>C address 0x3F, while no problems with blue ones, address 0x27)
- Mains Power cable
- Mammuth Clamps

## Preparation
**You need to compile your own Tasmota firmware as none of the pre-compiled binaries have support for _display and PZEM_ module.**  

**Set up your preferred IDE as described in [wiki](/docs/Compile-your-build)**  

### Enable IDE to Use Custom Settings
Create _**user_config_override.h**_ in the `tasmota` folder and paste the contents of this [sample configuration file](https://pastebin.com/WkfyKYnh).

#### PlatformIO
- Rename [platformio_override_sample.ini](https://github.com/arendst/Tasmota/blob/development/platformio_override_sample.ini).   to platformio_override.ini
- Enter `platformio run -e <variant-name>`  
  Examples:  
  - `platformio run -e tasmota-sensors`  
  - `platformio run -e tasmota-DE`  

#### Arduino IDE
- Edit [_**my_user_config.h**_](https://github.com/arendst/Tasmota/blob/development/tasmota/my_user_config.h). Uncomment the statement by removing the "//" in front of the line:
  `#define USE_CONFIG_OVERRIDE`
- Click compile

[Flash](installation/Flashing) the binary on the Wemos D1 Mini and confirm it is functional before connecting the PZEM-004T to its serial interface.

## Tasmota Parameter Configuration

[Device Template](Templates)<BR>
**PZEM-004T version prior to V3:**

`{"NAME":"HW-655 PZEM","GPIO":[0,63,0,62,6,5,0,0,0,0,0,0,0],"FLAG":0,"BASE":18}`


**PZEM-004T version V3:**

`{"NAME":"HW-655 PZEM","GPIO":[0,98,0,62,6,5,0,0,0,0,0,0,0],"FLAG":0,"BASE":18}`

- use **`I2CScan`** to detect your device address
- use **`DeviceAddress XXX`** (where XXX is the decimal converted address found) to set the I<sup>2</sup>C address
- set **`TelePeriod 10`** to have the display refresh every 10 seconds (you can't go under this value)
- set **`DisplayModel 1`**, and **`DisplayMode 0`**
- finally, add a Rule to display values (I choose these):
```
Rule1 ON Tele-ENERGY#Power DO DisplayText [z] [x1y0]%value%W ENDON ON Tele-ENERGY#Today DO DisplayText [x8y0]%value%Wh ENDON ON Tele-ENERGY#Voltage DO DisplayText [x1y1]%value%V ENDON ON Tele-ENERGY#Current DO DisplayText [x8y1]%value%A ENDON
```
- remember to enable the rule, with **`Rule1 1`**

## Images and Wiring diagram

**DANGER - MAINS VOLTAGE**. Be sure to crimp connectors and use heat-shrinking tube wherever possible/needed, and tightly secure any screw.

<img src="https://user-images.githubusercontent.com/21192010/51847810-bb4db800-231c-11e9-9d25-b93591115351.png" height="400" /><br><br>

How it looks, from web GUI:

<img src="https://user-images.githubusercontent.com/34340210/52659455-4c9b5d80-2ecb-11e9-9897-b0bb6353cee4.png" height="400" /><br><br>

How it looks, from enclosure:

<img src="https://user-images.githubusercontent.com/21192010/51847823-c3a5f300-231c-11e9-8755-a7787327e5c5.png" height="400" />

You can set the contrast using the little trimmer/pot on back of the display. I cut a bit of the corners from the display to have it flush with border, and used two hexagonal plastic standoffs with nuts and bolts to secure it to transparent top.<br><br>

Mains IN, mains OUT, all sealed:

<img src="https://user-images.githubusercontent.com/21192010/51847837-c99bd400-231c-11e9-9b7b-2d68bd177b21.png" height="400" /><br><br>

**Wiring Diagram:**
* Check images below for more information about the 1kOhm resistor needed to shift the voltage to 5V from 3V3 for the PZEM-004T serial connection.  

PZEM-004T v.1.0  
<img src="https://github.com/arendst/arendst.github.io/blob/master/media/pzem/pzem-fix.jpg?raw=true" height="400" />

PZEM-004T v.3.0  
<img src="https://user-images.githubusercontent.com/34340210/63592015-8508ac00-c57e-11e9-9e20-2b41b2662161.jpeg" height="400" />
<img src="https://user-images.githubusercontent.com/34340210/63591794-cf3d5d80-c57d-11e9-9945-eb062bebf71b.jpeg" height="400" />

<img src="https://user-images.githubusercontent.com/21192010/51847858-d4eeff80-231c-11e9-9c13-41172a6924ee.png" height="400" />

## Calibration
[Per Theo](https://github.com/arendst/Tasmota/issues/3208#issuecomment-405048466) - As the PZEM is a dedicated energy monitor, device calibration in TASMOTA is currently not supported.
