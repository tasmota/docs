!!! info "TuyaMCU - Module (54) is configured for devices with a Tuya Wi-Fi module and a secondary MCU. "

Originally, in those devices, the Wi-Fi module takes care of network and software features. Meanwhile, the MCU controls the hardware based on commands received from the Wi-Fi module or built-in controls (buttons, switches, remotes and similar) and reports the status back to the Wi-Fi module. 

TuyaMCU module facilitates communication between Tasmota and the MCU using [Tuya Serial Port Communication Protocol](#tuya-protocols):

- `TuyaMCU` command maps device functions to Tasmota components 
- `TuyaSend<x>` command calculates and sends complex serial commands using only two parameters
- `TuyaReceived` MCU response interpreted and publishes as status message and a JSON payload to an MQTT topic 

# TuyaMCU Command
Command [`TuyaMCU`](Commands.md#tuyamcu) is used to map Tasmota components to Tuya device dpId's. 
!!! warning
    Used only if your device is defined as module `TuyaMCU (54)`.

Command value consists of two comma separated parameters: fnId and dpId. 
```
TuyaMCU <fnId>,<dpId>
```  
where `<fnId>` is a Tasmota component and `<dpId>` is the dpId to map the function to.
!!! example
    `TuyaMCU 11,1` maps Relay1 (fnId 11) to dpId 1.

If any existing entry with same `fnId` or `dpId` is already present, it will be updated to the new value.    

Entry is removed when `fnId` or `dpId` is `0`.     

When no parameters are provided `TuyaMCU` prints the current mapped values.    

## dpId
All the device functions controlled by the MCU are identified by a dpId.    
Whenever a command is sent to the MCU, this dpId determines which component needs to be controlled and the applies when the status is received from MCU. 

**There is no way to autodetect dpId's and their functions.**

To assist in the process of determining what dpId does what, there is a [bookmarklet available](https://github.com/sillyfrog/Tasmota-Tuya-Helper) that can be used on the console screen. This will send the `weblog` and other required commands automatically, and present the TuyaMCU information in a single table allowing for easier testing.

Use this procedure to determine which dpId's are available:

1. Go to `Configure` -> `Console` option in Tasmota web interface.
2. Use command `weblog 4` to enable verbose logging in web interface.
3. Observe the log. After every 9-10 seconds you should see TYA messages.

```
{"TuyaReceived":{"Data":"55AA0107000501010001000F","Cmnd":7,"CmndData":"0101000100","DpType1Id1":0,"1":{"DpId":1,"DpIdType":1,"DpIdData":"00"}}}
TYA: fnId=11 is set for dpId=1
TYA: RX Relay-1 --> MCU State: Off Current State:Off
{"TuyaReceived":{"Data":"55AA01070005020100010010","Cmnd":7,"CmndData":"0201000100","DpType1Id2":0,"2":{"DpId":2,"DpIdType":1,"DpIdData":"00"}}}
TYA: fnId=0 is set for dpId=2
{"TuyaReceived":{"Data":"55AA01070005030100010011","Cmnd":7,"CmndData":"0301000100","DpType1Id3":0,"3":{"DpId":3,"DpIdType":1,"DpIdData":"00"}}}
TYA: fnId=0 is set for dpId=3
{"TuyaReceived":{"Data":"55AA01070005040100010012","Cmnd":7,"CmndData":"0401000100","DpType1Id4":0,"4":{"DpId":4,"DpIdType":1,"DpIdData":"00"}}}
TYA: fnId=0 is set for dpId=4
{"TuyaReceived":{"Data":"55AA0107000807020004000000001C","Cmnd":7,"CmndData":"0702000400000000","DpType2Id7":0,"7":{"DpId":7,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=7
{"TuyaReceived":{"Data":"55AA0107000808020004000000001D","Cmnd":7,"CmndData":"0802000400000000","DpType2Id8":0,"8":{"DpId":8,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=8
{"TuyaReceived":{"Data":"55AA0107000809020004000000001E","Cmnd":7,"CmndData":"0902000400000000","DpType2Id9":0,"9":{"DpId":9,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=9
{"TuyaReceived":{"Data":"55AA010700080A020004000000001F","Cmnd":7,"CmndData":"0A02000400000000","DpType2Id10":0,"10":{"DpId":10,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=10
{"TuyaReceived":{"Data":"55AA0107000865020004000000007A","Cmnd":7,"CmndData":"6502000400000000","DpType2Id101":0,"101":{"DpId":101,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=101
{"TuyaReceived":{"Data":"55AA0107000866020004000000007B","Cmnd":7,"CmndData":"6602000400000000","DpType2Id102":0,"102":{"DpId":102,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=102
{"TuyaReceived":{"Data":"55AA0107000867020004000000007C","Cmnd":7,"CmndData":"6702000400000000","DpType2Id103":0,"103":{"DpId":103,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=103
{"TuyaReceived":{"Data":"55AA01070008680200040000099117","Cmnd":7,"CmndData":"6802000400000991","DpType2Id104":2449,"104":{"DpId":104,"DpIdType":2,"DpIdData":"00000991"}}}
TYA: fnId=0 is set for dpId=104
```

4. Observe all lines printed as `TYA: FnId=0 is set for dpId=XXX` and note all dpId values. 


Now that you have a list of usable dpId's you need to determine what their functions are:

1. Consulting our [list of commonly used](#dpid-function-tables) dpId's and existing device configurations
2. Observing Tasmota logs while activating features of the device (with a remote or on device controls) and correlating log messages and looking at the DpIdType and DpIdData values (eg: boolean vs value)
3. Extrapolating possible function of the dpId based on Data Type and Function Command, then testing using `TuyaSend<x>`

## fnId
Identifier used in `TuyaMCU` command to map a dpId to a Tasmota component.

Component| FunctionId|Note
-|-|-
Switch1 to Switch4 | 1 to 4 | Map only to dpId with on / off function
Relay1 to Relay8 | 11 to 18 | Map only to dpId with on / off function
Lights | 21 to 28 | 21 for Dimmer<br>22 for Dimmer2<br>23 for CCT Light<br>24 for RGB light<br>25 for white light<br>26 for light mode set (0 = white and 1 = color)<br>27 to report the state of Dimmer1<br>28 to report the state of Dimmer2
Power Monitoring | 31 to 33 | 31 for Power (in deci Watt)<br>32 for Current (in milli Amps)<br>33 for Voltage (in deci Volt)
Relay1i to Relay8i | 41 to 48 | Map only to dpId with on / off function
Battery powered sensor mode | 51 | Battery powered devices use a slightly different protocol
Fan control | 61 to 64 | 61 for 3 speeds fan controller (possible values 0,1,2)<br>62 for 4 speeds fan controller (possible values 0,1,2,3)<br>63 for 5 speeds fan controller (possible values 0,1,2,3,4)<br>64 for 6 speeds fan controller (possible values 0,1,2,3,4,5)
Extra functions | 97 to 99 | 97 for motor direction<br>98 for error logging (report only)<br>99 as a dummy function<br>

!!! note
    This component is under active development which means the function list may expand in the future.

Since the majority of devices have a power on/off functions on dpId 1 its mapped to fnId 11 (Relay1) by default. If you don't need it, map it to fnId 99  with `TuyaMcu 99,1`

!!! danger
    Mapping a relay or switch to a dpId that is not a simple on/off function (data Type 1) might result in unwanted power toggling (i.e. dpId sends value of 4 which toggles the relay to Power 4 aka blink mode)

## TuyaSend Command
Command `TuyaSend` is used to send commands to dpId's. It is required for dpId's that shouldn't be mapped to a fnId. 

With this command it is possible to control every function of the dpId that is controllable, providing you know its data type and data length. With them provided, the rest of the protocol command is calculated.

Command's value consists of two comma separated parameters: dpId and data. 

`TuyaSend<x> dpId,data`

#### `TuyaSend0` 
Used without payload to query states of dpID's.

#### `TuyaSend1` 
Sends boolean (Type 1) data (`0/1`) to dpId (Max data length 1 byte)

!!! example
    `TuyaSend1 1,0` sends vaue `0` to dpId=1 switching the device off
#### `TuyaSend2` 
Sends integer or 4 byte (Type 2) data to dpId (Max data length 4 bytes)

!!! example
    `TuyaSend2 14,100` sends value `100` to dpId=14 setting timer to 100 minutes

#### `TuyaSend3` 
Sends string (Type 3) data to dpId (Max data length? Not known at this time).  

!!! warning
    Note that when sending color values, the MCU may interpret lower case and upper case hex codes differently. You may need to test with your specific MCU to ensure that the values sent properly render the color you desire.  

!!! example
    `TuyaSend3 108,ff0000646464ff` sends a 14 char hex string to dpId=108 (Type 3) containing RGBHSV values to control a light

#### `TuyaSend4` 
Sends enum (Type 4) data (`0/1/2/3/4/5`) to dpId (Max data length 1 bytes)

!!! example
    `TuyaSend4 103,2` sends value `2` to dpId=103 to set fan speed to high

#### `TuyaSend8`
Used without payload to get device information and dpId states.  Replaces `SerialSend5 55aa000100000`

#### `TuyaSend9`
Use without any payload to toggle a new `STAT` topic reporting changes to a dpId, for example:

```haskell
17:45:38 MQT: stat/TuyaMCU/DPTYPE1ID1 = 1
```

## TuyaReceived
Every status message from the MCU gets a JSON response named `TuyaReceived` which contains the MCU protocol status message inside key/value pairs which are hidden from the user by default.

To publish them to an MQTT Topic of `tele/%topic%/RESULT` you need to enable `SetOption66 1`.

#### Example
After issuing serial command `55aa0006000501010001010e` (Device power (dpId=1) is mapped to Relay1 (fnId=11)) we get the following console output (with `weblog 4`):

```
19:54:18 TYA: Send "55aa0006000501010001010e"
19:54:18 MQT: stat/GD-30W/STATE = {"Time":"2019-10-25T19:54:18","Uptime":"0T01:45:51","UptimeSec":6351,"Heap":27,"SleepMode":"Dynamic","Sleep":0,"LoadAvg":999,"MqttCount":1,"POWER1":"ON","POWER2":"OFF","POWER3":"ON","POWER4":"OFF","POWER5":"ON","Dimmer":100,"Fade":"OFF","Speed":1,"LedTable":"OFF","Wifi":{"AP":1,"SSId":"HTPC","BSSId":"50:64:2B:5B:41:59","Channel":10,"RSSI":24,"LinkCount":1,"Downtime":"0T00:00:08"}}
19:54:18 MQT: stat/GD-30W/RESULT = {"POWER1":"ON"}
19:54:18 MQT: stat/GD-30W/POWER1 = ON
19:54:18 MQT: stat/GD-30W/RESULT = {"TuyaReceived":{"Data":"55AA0007000501010001010F","ChkSum":"0x0F","Cmnd":7,"CmndDataLen":5,"CmndData":"0101000101","DpId":1,"DpIdType":1,"DpIdLen":1,"DpIdData":"01"}}
19:54:18 TYA: fnId=11 is set for dpId=1
19:54:18 TYA: RX Relay-1 --> MCU State: On Current State:On
```
Above `TYA: fnId=11 is set for dpId=1` you can see the JSON response for that dpId. This JSON string displays the response MCU gave to our command.

"Data" field contains the complete response and the rest of the key/value pairs show the protocol broken into parts. "DpId", "DpIdData" and "DpIdType" are the ones we're most interested in since we can use them for `TuyaSend`.

!!! tip
    Use command `TuyaSend8` and/or `TuyaSend0` at any time to request statuses of all dpId's from the MCU. 
    
#### Use in Rules
This data can also be used as a trigger for rules using `TuyaReceivedData#Data=hex_string`

```haskell
Rule1 on TuyaReceived#Data=55AA000700056E040001007E do publish2 stat/tuya_light/effect rgb_cycle endon
``` 
will publish a status message to a custom topic when `55AA000700056E040001007E` appears in "Data" field of the response.

##  Device Configurations
Before proceeding identify dpId's and their function.

### Dimmer	
We need to configure four functions of a dimmer: 
	
1. Dimming dpId	
2. Dimming Range	
3. Dimming less than 10%	

#### Dimming dpId	
The dimmer FunctionId is `21`. On a dimmer dpId generally is `2` or `3`. Try both.  	

1. Go to the Tasmota Console and type `TuyaMCU 21,2` and wait for it to reboot.	
2. Enter `Backlog Dimmer 10; Dimmer 100` in the Console. 	
   - If your bulb responds to `Dimmer` commands, you have successfully configured the dimmer FunctionId. Make note of it. 	
   - If not try id `3` and if even `3` doesn't work keep trying Ids from all unknown Ids from the log until one works.	

#### Dimming Range	
Once you have figured out the dimming functionId, we need to find the maximum dimming range. Once the dimming Id is set, the logs will continue	

```	
TYA: Heartbeat	
TYA: RX Packet: "55aa03070005010100010011"	
TYA: RX Relay-1 --> MCU State: Off Current State:Off	
TYA: RX Packet: "55aa03070008020200040000000720"	
TYA: FnId=21 is set for dpId=2	
TYA: RX Dim State=7	
```	

Now using the hardware buttons increase the dimmer to its maximum and observe the log. The `Dim State=XXX` shows the current dimmer level reported by MCU. Once the dimmer is at max, note this number. Again using hardware buttons decrease dimmer to minimum and note the number for minimum.	
Now we need to tell Tasmota to use maximum and minimum values. This controlled by [DimmerRange](Commands.md#dimmerrange) command. We can set it using `DimmerRange <Min>,<Max>` where `<Min>` is the minimum dimmer state and `<Max>` maximum dimmer state reported in logs.	

Once set, try `dimmer 100` in the Console and check if the brightness of bulb is same is the same as when the maximum was set using hardware buttons.	

!!! warning
    Some Tuya devices automatically send the state of a dimmer after a power off. Tasmota could misunderstand the command and try to turn on the light even with `SetOption20` and `SetOption54` enabled.

### Dual Dimmer
To enable a dual dimmer setup assign fnId's:

- `21` as Dimmer1
- `22` as Dimmer2
- `11` as Relay1
- `12` as Relay2

Tasmota will automatically enable `SetOption68` and the dimmers will respond to `Channel1` and `Channel2` commands.

!!! warning
    The use of SetOption68 is limited to two channels and will be automatically disabled if any other combination of lights is used.

### Lights

#### CCT Light

To enable a CCT light assign fnId's:

- `21` as Dimmer1
- `11` as Relay1
- `23` as CT channel

#### RGB Light

To enable an RGB light assign fnId's:

- `21` as Dimmer1
- `11` as Relay1
- `24` as RGB controller

TuyaMCU uses different types of RGB Hex format where the most recent is `0HUE0SAT0BRI0` (type 1) and the older being `RRGGBBFFFF6464` (type 2). Depending on the MCU, code can be case sensitive.

After enabling the RGB function check the TuyaReceived information and use `TuyaRGB` to configure and store the correct (or the closest) format:

- `TuyaRGB 0` - Type 1, 12 characters uppercase. Example: `00DF00DC0244` _(default)_
- `TuyaRGB 1` - Type 1, 12 characters lowercase. Example: `008003e8037a`
- `TuyaRGB 2` - Type 2, 14 characters uppercase. Example: `00FF00FFFF6464`
- `TuyaRGB 3` - Type 2, 14 characters lowercase. Example: `00e420ffff6464`

`TuyaRGB` without payload will return the actual configured format.

#### RGB+X Light
To enable an RGB+W light use RGB Light configuration and assign fnId `25` as white color.

To enable an RGB+CCT light use RGB Light configuration and assign fnId `23` as CT channel.

#### Light mode selector
The majority of  TuyaMCU devices with an RGB+W or an RGB+CCT light have a button or app function to switch between White and Colored light. 

To do the same in Tasmota, assign function (fnId) `26` to the mode select dpId. The possible values are 0 (white) and 1 (colorful). A button on the WebUI will be available once configured.

When the ModeSet function is enabled it is not  possible to update both lights at the same time. Only the currently selected light mode will be updated. 

!!! warning
    Use of `SetOption68` for more than two channels and the light split option (`SetOption37 >= 128`) are not supported in TuyaMCU mode.

### Enums

Better control over Type4 or enum dpId's. Up to four can be added, with a range from 0 to 31.

- `61` as Enum1
- `62` as Enum2
- `63` as Enum3
- `64` as Enum4

After an enum is configured, use `TuyaEnumList` to declare the range it must respect (note `0` is always the first item in range).

`TuyaEnumlist <enum>,<range>` where `<enum>` is declared using `TuyaMCU` and `<range>` is `0..31`.

Example: configure Enum 1 with a range from 0 to 8.
```py
21:14:52 CMD: tuyaenumlist 1,8
21:14:52 MQT: stat/TuyaMCU/RESULT = {"TuyaEnumList":{"Enum1":8,"Enum2":9,"Enum4":1}}
```
!!! warning "Entering a value greater than `31` will return an error"

`TuyaEnumList` without payload will return the configuration of all the enums enabled in the list.

To update an enum use the command `TuyaEnum`:

Usage `TuyaEnum [1|2|3|4],[TuyaEnumList range]`

Example: update Enum 2 to 4.
```py
21:14:12 CMD: tuyaenum2 4
21:14:12 MQT: stat/TuyaMCU/RESULT = {"TuyaEnum2":4}
```
!!! warning  "Entering a value not in range will return an error"

`TuyaEnum` without payload will return the state of all the enums configured.

### Sensors

These are the currently available sensors:

- `71` as Temperature Sensor
- `73` as Humidity Sensor
- `75` as Illuminance Sensor
- `76` as TVOC Sensor
- `77` as CO2 Sensor
- `78` as ECO2 Sensor

If your device has a dpId for setting a specific Temperature and/or Humidity:

- `72` for Temperature Set
- `74` for Humidity Set

Use `TuyaSend2` to manage them.

Temperature and Temperature Set default to `°C`. If you need `°F` change `SetOption8` to `1`.

Please note this will not update the value sent by the MCU but will just change the unit of measure reported on `/SENSOR` topic. You have to find a dpid to set the correct unit and change reported values (if it exists).

### Timers
4 Type2 (integer) timers can be managed directly from Tasmota

- `81` as Timer1
- `82` as Timer2
- `83` as Timer3
- `84` as Timer4

Timers can be managed with `TuyaSend2` and are visible in the WebUI.

### Covers
Single shutter or double shutters devices can be managed with a dimmer setup
For devices that are reporting position to a another dpId assign fnId's:

- `27` to report the state of Dimmer1
- `28` to report the state of Dimmer2

If your cover device has a motor direction change option assign fnId `97` for motor direction.

### Switches	
There is currenty no way to detect the number of relays present in an MCU based switch. We need to tell the number of relays to Tasmota using FunctionIDs 12 to 18 for Relay2 to Relay4. 	

!!! example
    For a 4 gang switch set `TuyaMCU 12,2`, `TuyaMCU 13,3` and `TuyaMCU 14,4` if the dpIds for Relays 2-4 are `2`,`3`,`4`.	

!!! tip
    You can configure all at once by using `Backlog TuyaMCU 12,2; TuyaMCU 13,3; TuyaMCU 14,4`	

<!--
### Curtain Motors	
The Zemismart WiFi curtain motor uses a Tuya TYWE1S inside the little white dongle as a radio modem.	
`U1TX` is connected to "USB D+", `U1RX` is connected to "USB D-", and there is a blue LED in the dongle connected to "USB3 R-" controlled by the MCU. To flash Tasmota, we need `U0RX`, `U0TX`, and `GPIO0`. None of which are broken out on the PCB, so soldering or Tuya-Convert are necessary.	

The stock Tuya App communicates with the PIC Micro inside the motor housing at 9600 8N1. 	

* `dpId 101` is the "partial open/partial close" command with a 4 byte field of 0-100%. 	
* `dpId 102` is a "fully open/fully close" command with a 1-byte Boolean field. 	
* `dpId 103` is unknown.	

#### Debugging	
```
55 aa 00 06 "deliver dp" 0005 "len=5" 66 04 00 01 <00=close100%,01=open0%> <chksum> is the fully open/close command	
07 "report dp" 0005 (len) 66 04 00 01 <00 or 01> <chksum> is the reply.	
55 aa 00 06 "deliver dp" 0008 (len=8) 65 02 00 04  <value.32 <chksum> is the move partial command	
55 aa 00 07 "report dp" 0008 (len=8) 65 02 00 04 <value.32> <chksum> is the reply. 	
```	

There may first be a reply of 65 02 00 04 <oldvalue.32> <chksum> before the motor engages	

#### dpId Configuration	
1. `module 54` # TuyaMCU (will reboot)	
2. `backlog gpio1 0; gpio3 0; gpio15 107; gpio13 108` # change GPIO assignments. The dongle uses gpio15 for U1TX and gpio13 for U1RX (will reboot)	
3. `tuyamcu 21,101` # declare curtain as a dimmer (will reboot)	
4. \# no idea what a good tuyamcu xx,102 is	
5. \# no idea what a good tuyamcu xx,103 is	
6. `setoption 69 0` # allow dimmer below 25% or 10%. (won't reboot)	

With these settings, the `dimmer` command can adjust the curtain from 100% (closed) to 1% (almost fully open, 0% is the motor limit, but 1% is the Tasmota limit?)	

#### Things That Did Not Work	
```lua
tuyamcu 1,102 # make 0x66 a button	
tuyamcu 1,103 # make 0x67 a button	
```	
Having 0x66 declared a button caused the motor to oscillate - open part way and then close again. Like Tasmota was sending the "fully open" command and then immediately cancelling it with a "partial close" command.	
```lua
tuyamcu 11,102 # make 0x66 a relay	
tuyamcu 11,103 # make 0x67 a relay	
```	
Does not appear to have any impact on the curtain. 

### Aromatherapy Diffuser
Applies to devices using the PCB marked GD-HDFW05-v1.0. 

![image](https://user-images.githubusercontent.com/5904370/67526288-c4559500-f6b4-11e9-867f-2b3ae0b82437.png ":size=100")

This diffuser uses the same dpId scheme as the [example protocol](#aromatherapy-machine-oil-diffuser)

#### Functions
`dpID 1` device power: 0 = off / 1 = on    
`dpID 11` led power: 0 = off / 1 = on    
`dpID 12` error notification: 0 = ok / 1 = error  
`dpID 13` countdown mode options: 0 = off / 1 = 1hr / 2 = 3hr *not needed with Tasmota*    
`dpID 14` countdown status: reports value of 0...360 minutes *not needed with Tasmota*    
`dpID 103` mist strength: 0 = low / 1 = high    
`dpID 108` led color: 14 char value in hex (can define only RGB and send HSV value as max: `RRGGBBffff6464`)    
`dpID 110` led mode: 0 = rgb_cycle / 1 = color / 2 = white    
`dpID 110` led dimmer **color and white modes only** *it is important to define 'DimmerRange 1,255'*

#### Configuration

After applying the template and configuring Wi-Fi and MQTT issue

```lua
Backlog SetOption66 1; TuyaMCU 21,111; TuyaMCU 11,1; TuyaMCU 12,11; TuyaMCU 13,103; TuyaMCU 14,12; TuyaMCU 15,110; DimmerRange 1,255; SetOption59 1
```
```lua
Rule1 on TuyaReceived#data=55AA000700056E040001007E do publish2 stat/GD-30W/EFFECT rgb_cycle endon on TuyaReceived#data=55AA000700056E040001017F do publish2 stat/GD-30W/EFFECT color endon on event#rgb_cycle do tuyasend4 110,0 endon on event#color do tuyasend4 110,1 endon on event#ON do backlog tuyasend4 110,1; tuyasend 11,1 endon on event#off do tuyasend1 11,0 endon on power3#state=1 do tuyasend4 103,1 endon on power3#state=0 do tuyasend4 103,0 endon
Rule1 1
```

*Optional rule used to prevent the device going into countdown mode (i.e. using on device controls) and complete MCU status update on restart*

```haskell
Rule3 on TuyaReceived#data=55AA000700050D040001011E do tuyasend4 13,0 endon on TuyaReceived#data=55AA000700050D040001021F do tuyasend4 13,0 endon on mqtt#connected do serialsend5 55aa0001000000 endon
Rule3 1
```
[All commands in .txt](https://gist.github.com/blakadder/2d112b50edd8f75f2d7fb0dddd9310c4)

#### What you get
- Relay1 turns the diffuser on or off in stored mist strength mode, turns led on or off in stored mode and serves as device power status
- Relay2 turns light on or off and serves as light power status.
- Relay3 mist strength status and control using `Rule1`
- Relay4 is used for error status (ON = error), no control
- Relay5 is used for light mode status (0 = rgb_cycle, 1 = color), no control

LED mode status is reported to mqtt topic `stat/GD-30W/EFFECT` and command [`Event`](Commands.md#event) is used to control some functions using [`TuyaSend4`](Commands.md#tuyasend4) command. All this is defined in `Rule1`

Color can be changed using `TuyaSend3 108,RRGGBB64646464` (RR, GG and BB are hex value) only in color mode.

Dimming works using slider and `Dimmer` command but only when in color mode, in rgb_cycle there are no brightness controls.

Long press on device's power button initiates Tasmota's Wi-Fi config -->
### Power Metering	
Some Tuya MCU devices support Power measurement support over serial. For this it is better to use a bulb with known wattage rating.  	

Observe the logs in the Console  	

```	
TYA: Heartbeat
{"TuyaReceived":{"Data":"55AA0107000501010001000F","Cmnd":7,"CmndData":"0101000100","DpType1Id1":0,"1":{"DpId":1,"DpIdType":1,"DpIdData":"00"}}}
TYA: fnId=11 is set for dpId=1
TYA: RX Relay-1 --> MCU State: Off Current State:Off
{"TuyaReceived":{"Data":"55AA01070005020100010111","Cmnd":7,"CmndData":"0201000101","DpType1Id2":1,"2":{"DpId":2,"DpIdType":1,"DpIdData":"01"}}}
TYA: fnId=0 is set for dpId=2
{"TuyaReceived":{"Data":"55AA01070005030100010011","Cmnd":7,"CmndData":"0301000100","DpType1Id3":0,"3":{"DpId":3,"DpIdType":1,"DpIdData":"00"}}}
TYA: fnId=0 is set for dpId=3
{"TuyaReceived":{"Data":"55AA01070005040100010113","Cmnd":7,"CmndData":"0401000101","DpType1Id4":1,"4":{"DpId":4,"DpIdType":1,"DpIdData":"01"}}}
TYA: fnId=0 is set for dpId=4
{"TuyaReceived":{"Data":"55AA0107000807020004000000001C","Cmnd":7,"CmndData":"0702000400000000","DpType2Id7":0,"7":{"DpId":7,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=7
{"TuyaReceived":{"Data":"55AA0107000808020004000000001D","Cmnd":7,"CmndData":"0802000400000000","DpType2Id8":0,"8":{"DpId":8,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=8
{"TuyaReceived":{"Data":"55AA0107000809020004000000001E","Cmnd":7,"CmndData":"0902000400000000","DpType2Id9":0,"9":{"DpId":9,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=9
{"TuyaReceived":{"Data":"55AA010700080A020004000000001F","Cmnd":7,"CmndData":"0A02000400000000","DpType2Id10":0,"10":{"DpId":10,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=10
{"TuyaReceived":{"Data":"55AA0107000865020004000000007A","Cmnd":7,"CmndData":"6502000400000000","DpType2Id101":0,"101":{"DpId":101,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=101
{"TuyaReceived":{"Data":"55AA01070008660200040000009813","Cmnd":7,"CmndData":"6602000400000098","DpType2Id102":152,"102":{"DpId":102,"DpIdType":2,"DpIdData":"00000098"}}}
TYA: fnId=0 is set for dpId=102
{"TuyaReceived":{"Data":"55AA01070008670200040000017EFB","Cmnd":7,"CmndData":"670200040000017E","DpType2Id103":382,"103":{"DpId":103,"DpIdType":2,"DpIdData":"0000017E"}}}
TYA: fnId=0 is set for dpId=103
{"TuyaReceived":{"Data":"55AA0107000868020004000009951B","Cmnd":7,"CmndData":"6802000400000995","DpType2Id104":2453,"104":{"DpId":104,"DpIdType":2,"DpIdData":"00000995"}}}
TYA: fnId=0 is set for dpId=104
```	

In the `TuyaReceived` we are interested in `DpIdData`. For example: `00000995` is the second last entry.	

* Make sure the bulb if off.	
* Find out the voltage standard of your country (generally 220, 240, 120v) from this [table](https://www.worldstandards.eu/electricity/plug-voltage-by-country/).	
* Multiply that number by 10 (2400) and Convert that number (2400) to Hex using any [hex converter](https://www.binaryhexconverter.com/decimal-to-hex-converter) (2400 = 0x960)	
* Now look for the number nearest to `960` in the logs. In our case it is `00000995`. So we expect that's the voltage which is `"DpId":104` in our example.
* Set voltage functionId `33` by entering `TuyaMCU 33,104`.	
* Now set dimmer to 100% using the `dimmer 100` command, or power on using `power1 on` (depending on the device) and observe the logs.	
* Now we need the power rating of your bulb, for example `40W`. Multiply by 10 (400) and convert to hex which gives us 0x190. Check which unknown ID is close to `190`. I this example it is `17E` for `"DpId":103`. This is the Id of `Active Power` function.	
* Set the active power functionId `31` by entering `TuyaMCU 31,103`.	
* Once Power and Voltage are set you should see something such as this in the logs:	
```
TYA: Heartbeat
{"TuyaReceived":{"Data":"55AA0107000501010001000F","Cmnd":7,"CmndData":"0101000100","DpType1Id1":0,"1":{"DpId":1,"DpIdType":1,"DpIdData":"00"}}}
TYA: fnId=11 is set for dpId=1
TYA: RX Relay-1 --> MCU State: Off Current State:Off
{"TuyaReceived":{"Data":"55AA01070005020100010111","Cmnd":7,"CmndData":"0201000101","DpType1Id2":1,"2":{"DpId":2,"DpIdType":1,"DpIdData":"01"}}}
TYA: fnId=0 is set for dpId=2
{"TuyaReceived":{"Data":"55AA01070005030100010011","Cmnd":7,"CmndData":"0301000100","DpType1Id3":0,"3":{"DpId":3,"DpIdType":1,"DpIdData":"00"}}}
TYA: fnId=0 is set for dpId=3
{"TuyaReceived":{"Data":"55AA01070005040100010113","Cmnd":7,"CmndData":"0401000101","DpType1Id4":1,"4":{"DpId":4,"DpIdType":1,"DpIdData":"01"}}}
TYA: fnId=0 is set for dpId=4
{"TuyaReceived":{"Data":"55AA0107000807020004000000001C","Cmnd":7,"CmndData":"0702000400000000","DpType2Id7":0,"7":{"DpId":7,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=7
{"TuyaReceived":{"Data":"55AA0107000808020004000000001D","Cmnd":7,"CmndData":"0802000400000000","DpType2Id8":0,"8":{"DpId":8,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=8
{"TuyaReceived":{"Data":"55AA0107000809020004000000001E","Cmnd":7,"CmndData":"0902000400000000","DpType2Id9":0,"9":{"DpId":9,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=9
{"TuyaReceived":{"Data":"55AA010700080A020004000000001F","Cmnd":7,"CmndData":"0A02000400000000","DpType2Id10":0,"10":{"DpId":10,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=10
{"TuyaReceived":{"Data":"55AA0107000865020004000000007A","Cmnd":7,"CmndData":"6502000400000000","DpType2Id101":0,"101":{"DpId":101,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=101
{"TuyaReceived":{"Data":"55AA01070008660200040000009712","Cmnd":7,"CmndData":"6602000400000097","DpType2Id102":151,"102":{"DpId":102,"DpIdType":2,"DpIdData":"00000097"}}}
TYA: fnId=0 is set for dpId=102
{"TuyaReceived":{"Data":"55AA01070008670200040000017BF8","Cmnd":7,"CmndData":"670200040000017B","DpType2Id103":379,"103":{"DpId":103,"DpIdType":2,"DpIdData":"0000017B"}}}
TYA: fnId=31 is set for dpId=103
TYA: Rx ID=103 Active_Power=379
{"TuyaReceived":{"Data":"55AA0107000868020004000009961C","Cmnd":7,"CmndData":"6802000400000996","DpType2Id104":2454,"104":{"DpId":104,"DpIdType":2,"DpIdData":"00000996"}}}
TYA: fnId=33 is set for dpId=104
TYA: Rx ID=104 Voltage=2454
```	
* To get the Id for the current, calculate Current = Power / Voltage ( 37.9 / 245.4 ) = ~0.1544 (Remember to divide each value by 10). Multiply this by 1000 = 154. Now convert 154 to hex which is 0x9A. This is closest to `97` which is Id `"DpId":102`. 	
* Set the current FunctionId `32` using command `TuyaMCU 32,102`.	
* Observe the logs should start showing Current in addition to Active_Power and Voltage
```
TYA: Heartbeat
{"TuyaReceived":{"Data":"55AA0107000501010001000F","Cmnd":7,"CmndData":"0101000100","DpType1Id1":0,"1":{"DpId":1,"DpIdType":1,"DpIdData":"00"}}}
TYA: fnId=11 is set for dpId=1
TYA: RX Relay-1 --> MCU State: Off Current State:Off
{"TuyaReceived":{"Data":"55AA01070005020100010111","Cmnd":7,"CmndData":"0201000101","DpType1Id2":1,"2":{"DpId":2,"DpIdType":1,"DpIdData":"01"}}}
TYA: fnId=0 is set for dpId=2
{"TuyaReceived":{"Data":"55AA01070005030100010011","Cmnd":7,"CmndData":"0301000100","DpType1Id3":0,"3":{"DpId":3,"DpIdType":1,"DpIdData":"00"}}}
TYA: fnId=0 is set for dpId=3
{"TuyaReceived":{"Data":"55AA01070005040100010113","Cmnd":7,"CmndData":"0401000101","DpType1Id4":1,"4":{"DpId":4,"DpIdType":1,"DpIdData":"01"}}}
TYA: fnId=0 is set for dpId=4
{"TuyaReceived":{"Data":"55AA0107000807020004000000001C","Cmnd":7,"CmndData":"0702000400000000","DpType2Id7":0,"7":{"DpId":7,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=7
{"TuyaReceived":{"Data":"55AA0107000808020004000000001D","Cmnd":7,"CmndData":"0802000400000000","DpType2Id8":0,"8":{"DpId":8,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=8
{"TuyaReceived":{"Data":"55AA0107000809020004000000001E","Cmnd":7,"CmndData":"0902000400000000","DpType2Id9":0,"9":{"DpId":9,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=9
{"TuyaReceived":{"Data":"55AA010700080A020004000000001F","Cmnd":7,"CmndData":"0A02000400000000","DpType2Id10":0,"10":{"DpId":10,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=10
{"TuyaReceived":{"Data":"55AA0107000865020004000000007A","Cmnd":7,"CmndData":"6502000400000000","DpType2Id101":0,"101":{"DpId":101,"DpIdType":2,"DpIdData":"00000000"}}}
TYA: fnId=0 is set for dpId=101
{"TuyaReceived":{"Data":"55AA01070008660200040000009712","Cmnd":7,"CmndData":"6602000400000097","DpType2Id102":151,"102":{"DpId":102,"DpIdType":2,"DpIdData":"00000097"}}}
TYA: fnId=32 is set for dpId=102
TYA: Rx ID=102 Current=151
{"TuyaReceived":{"Data":"55AA01070008670200040000017BF8","Cmnd":7,"CmndData":"670200040000017B","DpType2Id103":379,"103":{"DpId":103,"DpIdType":2,"DpIdData":"0000017B"}}}
TYA: fnId=31 is set for dpId=103
TYA: Rx ID=103 Active_Power=379
{"TuyaReceived":{"Data":"55AA0107000868020004000009961C","Cmnd":7,"CmndData":"6802000400000996","DpType2Id104":2454,"104":{"DpId":104,"DpIdType":2,"DpIdData":"00000996"}}}
TYA: fnId=33 is set for dpId=104
TYA: Rx ID=104 Voltage=2454
```	
* Power and current should change on dimming high / low or turning the device on and off. The Tasmota web UI should show power values now on the home page.

### Battery Powered Sensors
- [TYMC-1 Door/Window Sensor](https://templates.blakadder.com/TYMC-1.html)
- [TY-01 Door/Window Sensor](https://templates.blakadder.com/TY01.html)
- [Gas Sensor](https://templates.blakadder.com/PA-210WYS.html)
- [Smoke Sensor](https://templates.blakadder.com/YG400A.html)
- [PIR Sensor](https://templates.blakadder.com/lenovo_ZG38C02927.html)

### Specific Devices
 - [Aromatherapy Diffuser](https://templates.blakadder.com/blitzwolf_BW-FUN3.html)
 - [Water Kettle](https://templates.blakadder.com/proficook_PC-WKS_1167.html)
 - [Air Purifier](https://templates.blakadder.com/alfawise_P2.html)
 - [Mouse Trap](https://templates.blakadder.com/neo_coolcam_NAS-MA01W.html)
 - [Humidifer](https://templates.blakadder.com/proscenic_807C.html)

## Tuya Protocols
The MCU communicates with the Wi-Fi module through the serial port with a Tuya specified protocol. Those are classified into basic and functional protocols. 

## Basic protocols 
They are common protocols integrated in Tasmota's TuyaMCU module. They stay the same for each product and are mandatory for Tuya module to work correctly. 

## Functional protocols 
Functional protocols are used for delivering and reporting data of functions. These protocols differ between devices and manufacturers and might require configuration in Tasmota using [`TuyaMCU`](#tuyamcu) command or with [`TuyaSend<x>`](#tuyasend) command.

## Anatomy of Tuya Protocol

|Name|Description|
|---|---|
|Frame Header Version|Fixed value of 0x55aa |
|Command Word | `0x06` - send commands<br>`0x07` - report status|
|Data Length | defines expected length of data
|dpID|numbered ID of a function (DP = Data Point or Define Product)|
|Data Type|[see Data Type table below](#data-type-table)|
|Function Length|length of command|
|Function Command|formatted according to Data Type| 
|Verification Method| checksum = remainder of the byte sum starting from Frame Header to 256|

<a id="data-type-table"></a>
#### Data Type
|Hex|Tasmota Command|Decription|Max length|
|---|---|---|---|
|0x01|TuyaSend1|boolean data `0/1`|1 byte|
|0x02|TuyaSend2|value data. If a value contains less than 4 bytes, 0 is supplemented before|4 bytes|
|0x00|TuyaSend3|string data|unknown|
|0x04|TuyaSend4|enum data `0/1/2/3/4/5`|1 byte|
|0x05|###|fault data, report only|8 bytes|

Let's dissect and explain the MCU protocol using serial command `55aa0006000501010001010e`:

| Frame Header Version | Command Word | Data Length | dpID | Data Type | Function Length | Function Command | Verification Method |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 55aa00| 06| 0005| 01   | 01| 0001| 01| 0e|

This is the command which powers on the device sending Function Command = `1` to dpID 1 (Switch): 

- Frame Header Version = `0x55aa00` which is a fixed value and always the same
- Command Word = `0x06` because we're sending a command
- Data Type = `0x01` since the command sent is a 1 byte boolean
- Function Length = `0x001` instruct 1 character only for function command length
- Function Command = `0x01` in hex which equals `1` in int
- Verification Method = `0e` is calculated

#### Protocol flow
On device boot, TuyaMCU executes the required basic protocols and reads the functional protocol data received, which are used to update status of components mapped in TuyaMCU (Relays, dimmer, power monitoring data).

After receiving a command from Tasmota (Command Word `0x06`), the MCU performs corresponding logical control. When the dpID status is changed, the MCU reports the data (Command Word `0x07`) to TuyaMCU component. 

## dpId Function Tables

!!! warning "This information is just for orientation. Functions are assigned by the manufacturer and can be on different dpId's"

- DP ID: dpId.
- Function Point：Used to describe the product function.
- Identifier: Function codename. Can only be letters, numbers and underscores
- Data type：
   - Issue and report: command data can be sent and status data can be reported back to the Wi-Fi module
   - Report only: supports only status reporting, no control options

- Function Type (Referred as Data Type):
   - Boolean (bool): non-true or false binary variable, such as: switch function, on / off
   - Value (value): suitable for linear adjustment of the type of data, such as: temperature regulation, temperature range 20-40 ℃
   - Enum (enum): custom finite set value, such as: working levels, low / mid / high
   - Fault (fault): dedicated to reporting and statistical failure of the function points. Support multi-fault, the data is reported only
   - Integer（integer）: transmitted as integer
   - Transparent (raw): data in binary 

### Switches or Plugs/Power Strips

| DP ID | Identifier  | Data type          | Function type | Properties                                   |
|-------|-------------|--------------------|---------------|----------------------------------------------|
| 1     | switch_1    | Control and report | Boolean       |                                              |
| 2     | switch_2    | Control and report | Boolean       |                                              |
| 3     | switch_3    | Control and report | Boolean       |                                              |
| 4     | switch_4    | Control and report | Boolean       |                                              |
| 5     | switch_5    | Control and report | Boolean       |                                              |
| 9     | countdown_1 | Control and report | Integer       | undefined0-86400, undefined1, Scale0, Unit:s |
| 10    | countdown_2 | Control and report | Integer       | undefined0-86400, undefined1, Scale0, Unit:s |
| 11    | countdown_3 | Control and report | Integer       | undefined0-86400, undefined1, Scale0, Unit:s |
| 12    | countdown_4 | Control and report | Integer       | undefined0-86400, undefined1, Scale0, Unit:s |
| 13    | countdown_5 | Control and report | Integer       | undefined0-86400, undefined1, Scale0, Unit:s |


### Aromatherapy Machine (Oil Diffuser)

| DP ID | Function points          | Identifier     | Data type        | Function type | Properties |
|-------|-----------------|---------------|------------------|---------------|-----------------------------------------------|
| 1     | Switch                   | Power          | Issue and report | Boolean       |         |
| 6     | Amount of fog            | fog            | Issue and report | Enum          | Enumerated values:small, large|
| 11    | Light                    | Light          | Issue and report | Boolean       | |
| 12    | Fault alarm              | fault          | Only report      | Fault         | Barrier values:1|
| 13    | Countdown                | countdown      | Issue and report | Enum          | Enumerated values: 0, 1, 2, 3|
| 14    | Countdown remaining time | countdown_left | Only report      | Integer       | Values range: 0-360, Pitch1, Scale0, Unit:min|
| 101   | Light mode               | work_mode      | Issue and report | Enum          | Enumerated values: white, colour, scene, scene1, scene2, scene3, scene4 |
| 102   | Color value              | colour_data    | Issue and report | Char type     | *see below |
| 103   | Light mode               | lightmode      | Issue and report | Enum          | Enumerated values: 1, 2, 3|
| 104   | Brightness setting       | setlight       | Issue and report | Integer       | Values range: 0-255, Pitch1, Scale0, Unit:\%|

> `colour_data` format of the lights is a string of 14 characters, for example, 00112233334455, where 00 indicates R, 11 indicates G, 22 indicates B, 3333 indicates the hue, 44 indicates the saturation, and 55 indicates the value. The initial value is saved by default. If you do not want to adjust the light, set the data to the maximum value 100% (0x64). The last four characters have fixed values.

### Curtain Motor

| DP ID | Function points | Identifier    | Data type        | Function type | Properties                                    |
|-------|-----------------|---------------|------------------|---------------|-----------------------------------------------|
| 1     | Percentage      | percent_state | Only report      | Integer       | Values range:0-100, Pitch1, Scale0, Unit:%    |
| 2     | Motor Direction | control_back  | Issue and report | Boolean       |                                               |
| 3     | Auto Power      | auto_power    | Issue and report | Boolean       |                                               |
| 4     | Left time       | countdown     | Issue and report | Enum          | Enumerated values:cancel, 1, 2, 3, 4          |
| 5     | Total Time      | time_total    | Only report      | Integer       | Values range:0-120000, Pitch1, Scale0, Unit:m |

> [Complete document on protocols](https://github.com/arendst/Tasmota/files/3658412/protocol_CurtainM_20190926.pdf)

| DP ID | Function points       | Identifier      | Data type        | Function type | Properties                              |
|----|--------------------------|-----------------|------------------|---------|-----------------------------------------------|
| 1  | Control (required)       | control         | Issue and report | Enum    | Enumerated values:open, stop, close, continue |
| 2  | Curtain position setting | percent_control | Issue and report | Integer | Values range:0-100, Pitch1, Scale0, Unit:%    |
| 3  | Current curtain position | percent_state   | Only report      | Integer | Values range:0-100, Pitch1, Scale0, Unit:%    |
| 4  | Mode                     | mode            | Issue and report | Enum    | Enumerated values:morning, night              |
| 5  | Motor Direction          | control_back    | Issue and report | Enum    | Enumerated values:forward, back               | 
| 6  | Auto Power               | auto_power      | Issue and report | Boolean |                                               |
| 7  | Work State (required)       | work_state      | Only report      | Enum    | Enumerated values:opening, closing            | 
| 11 | Situation_set            | situation_set   | Only report      | Enum    | Enumerated values:fully_open, fully_close     | 
| 12 | Fault  (required)            | fault           | Only report      | Fault   | Barrier values:motor_fault                    | 

### Power Monitoring Plug

| DP ID | Function points        | Identifier      | Data type          | Function type | Properties                                    |
|-------|------------------------|-----------------|--------------------|---------------|-----------------------------------------------|
| 1     | switch_1               | switch_1        | Control and report | Boolean       |                                               |
| 9     | countdown_1            | countdown_1     | Control and report | Integer       | undefined0-86400, undefined1, Scale0, Unit:s  |
| 17    | statistics Function    | add_ele         | Control and report | Integer       | undefined0-50000, undefined100, Scale3, Unit: |
| 18    | current                | cur_current     | Data report        | Integer       | undefined0-30000, undefined1, Scale0, Unit:mA |
| 19    | power                  | cur_power       | Data report        | Integer       | undefined0-50000, undefined1, Scale1, Unit:W  |
| 20    | voltage                | cur_voltage     | Data report        | Integer       | undefined0-5000, undefined1, Scale1, Unit:V   |
| 21    | test flag              | test_bit        | Data report        | Integer       | undefined0-5, undefined1, Scale0, Unit:       |
| 22    | voltage coefficient    | voltage_coe     | Data report        | Integer       | undefined0-1000000, undefined1, Scale0, Unit: |
| 23    | current coefficient    | electric_coe    | Data report        | Integer       | undefined0-1000000, undefined1, Scale0, Unit: |
| 24    | power coefficient      | power_coe       | Data report        | Integer       | undefined0-1000000, undefined1, Scale0, Unit: |
| 25    | statistics coefficient | electricity_coe | Data report        | Integer       | undefined0-1000000, undefined1, Scale0, Unit: |
| 26    | warning                | fault           | Data report        | Fault         | Barrier values:ov_cr                          |


### Dehumidifier

| DP ID | Function points | Identifier  | Data type        | Function type | Properties                                               |
|-------|-----------------|-------------|------------------|---------------|----------------------------------------------------------|
| 1     | Switch          | Switch      | Issue and report | Boolean       |                                                          |
| 2     | PM2.5           | PM25        | Only report      | Integer       | Values range:0-999, Pitch1, Scale0, Unit:                |
| 3     | Work mode       | Mode        | Issue and report | Enum          | Enumerated values:Manual, Auto, Sleep                    |
| 4     | Wind speed      | Speed       | Issue and report | Enum          | Enumerated values:speed1, speed2, speed3, speed4, speed5 |
| 5     | Filter usage    | Filter      | Only report      | Integer       | Values range:0-100, Pitch1, Scale0, Unit:%               |
| 6     | Fresh           | Anion       | Issue and report | Boolean       |                                                          |
| 7     | Child lock      | Lock        | Issue and report | Boolean       |                                                          |
| 9     | UV light        | UV          | Issue and report | Boolean       |                                                          |
| 11    | Filter reset    | FilterReset | Issue and report | Boolean       |                                                          |
| 12    | indoor temp     | Temp        | Only report      | Integer       | Values range:-20-50, Pitch1, Scale0, Unit:℃             |
| 13    | Indoor humidity | Humidity    | Only report      | Integer       | Values range:0-100, Pitch1, Scale0, Unit:%               |


### Lighting

| DP ID | Function points | Identifier    | Data type          | Function type | Properties                                                                 |
|-------|-----------------|---------------|--------------------|---------------|----------------------------------------------------------------------------|
| 1     | Switch          | led_switch    | Control and report | Boolean       |                                                                            |
| 2     | Mode            | work_mode     | Control and report | Enum          | Enumerated values:white, colour, scene, scene_1, scene_2, scene_3, scene_4 |
| 3     | Bright          | bright_value  | Control and report | Integer       | undefined25-255, undefined1, Scale0, Unit:                                 |
| 5     | Colour mode     | colour_data   | Control and report | Char type     |                                                                            |
| 6     | Scene           | scene_data    | Control and report | Char type     |                                                                            |
| 7     | Scene1          | flash_scene_1 | Control and report | Char type     |                                                                            |
| 8     | Scene2          | flash_scene_2 | Control and report | Char type     |                                                                            |
| 9     | Scene3          | flash_scene_3 | Control and report | Char type     |                                                                            |
| 10    | Scene4          | flash_scene_4 | Control and report | Char type     |                                                                            |

### Contact Sensor
| DP ID | Function points   | Identifier         | Data type   | Function type | Properties                                 |
|-------|-------------------|--------------------|-------------|---------------|--------------------------------------------|
| 1     | Door Sensor       | doorcontact_state  | Only report | Boolean       |                                            |
| 2     | Battery Level     | battery_percentage | Only report | Integer       | Values range:0-100, Pitch1, Scale0, Unit:% |
| 3     | Battery Level     | battery_state      | Only report | Enum          | Enumerated values:low, middle, high        |
| 4     | Anti-remove Alarm | temper_alarm       | Only report | Boolean       |                                            |

### Air purifier

| DP ID | Function points | Identifier  | Data type        | Function type | Properties                                               |
|-------|-----------------|-------------|------------------|---------------|----------------------------------------------------------|
| 1     | Switch          | Switch      | Issue and report | Boolean       |                                                          |
| 2     | PM2.5           | PM25        | Only report      | Integer       | Values range:0-999, Pitch1, Scale0, Unit:                |
| 3     | Work mode       | Mode        | Issue and report | Enum          | Enumerated values:Manual, Auto, Sleep                    |
| 4     | Wind speed      | Speed       | Issue and report | Enum          | Enumerated values:speed1, speed2, speed3, speed4, speed5 |
| 5     | Filter usage    | Filter      | Only report      | Integer       | Values range:0-100, Pitch1, Scale0, Unit:%               |
| 6     | Fresh           | Anion       | Issue and report | Boolean       |                                                          |
| 7     | Child lock      | Lock        | Issue and report | Boolean       |                                                          |
| 9     | UV light        | UV          | Issue and report | Boolean       |                                                          |
| 11    | Filter reset    | FilterReset | Issue and report | Boolean       |                                                          |
| 12    | indoor temp     | Temp        | Only report      | Integer       | Values range:-20-50, Pitch1, Scale0, Unit:℃              |
| 13    | Indoor humidity | Humidity    | Only report      | Integer       | Values range:0-100, Pitch1, Scale0, Unit:%               |


### Heater

| DP ID | Function points     | Identifier  | Data type        | Function type | Properties                                 |
|-------|---------------------|-------------|------------------|---------------|--------------------------------------------|
| 1     | Switch              | Power       | Issue and report | Boolean       |                                            |
| 2     | Target temperature  | TempSet     | Issue and report | Integer       | Values range:0-37, Pitch1, Scale0, Unit:℃  |
| 3     | Current Temperature | TempCurrent | Only report      | Integer       | Values range:-9-99, Pitch1, Scale0, Unit:℃ |
| 4     | Mode                | Mode        | Issue and report | Enum          | Enumerated values:m, p                     |
| 5     | Fault alarm         | Fault       | Only report      | Fault         | Barrier values:1, 2, 3                     |
| 6     | Gear position       | gear        | Issue and report | Enum          | Enumerated values:low, mid, high, off      |
| 7     | Conservation        | eco_mode    | Issue and report | Boolean       |                                            |


### Smart fan

| DP ID | Function points      | Identifier     | Data type        | Function type | Properties                                |
|-------|----------------------|----------------|------------------|---------------|-------------------------------------------|
| 1     | Switch               | switch         | Issue and report | Boolean       |                                           |
| 2     | Wind Speed Level     | fan_speed      | Issue and report | Enum          | Enumerated values:1, 2, 3, 4              |
| 3     | Left-and-Right Swing | fan_horizontal | Issue and report | Enum          | Enumerated values:on, off                 |
| 4     | Up-and-Down Swing    | fan_vertical   | Issue and report | Enum          | Enumerated values:on, off                 |
| 5     | Fault Alarm          | fault          | Only report      | Fault         | Barrier values:1, 2                       |
| 6     | Anion                | anion          | Issue and report | Boolean       |                                           |
| 7     | Humidify             | humidifier     | Issue and report | Boolean       |                                           |
| 8     | Oxygen               | oxygan         | Issue and report | Boolean       |                                           |
| 9     | Child Lock           | lock           | Issue and report | Boolean       |                                           |
| 10    | Cool                 | fan_cool       | Issue and report | Boolean       |                                           |
| 11    | Set Temperate        | temp           | Issue and report | Integer       | Values range:0-50, Pitch1, Scale0, Unit:℃ |
| 12    | Current Temperature  | temp_current   | Only report      | Integer       | Values range:0-50, Pitch1, Scale0, Unit:℃ |

### Kettle

| DP ID | Function points                                            | Identifier           | Data type        | Function type | Properties                                                          |
|-------|------------------------------------------------------------|----------------------|------------------|---------------|---------------------------------------------------------------------|
| 1     | Working switch                                             | start                | Issue and report | Boolean       |                                                                     |
| 2     | Heat to target temperature shortcut (°C)                   | temp_setting_quick_c | Issue and report | Enum          | Enumerated values:50, 65, 85, 90, 100                               |
| 3     | Heat to target temperature shortcut (°F)                   | temp_setting_quick_f | Issue and report | Enum          | Enumerated values:122, 149, 185, 194, 212                           |
| 4     | Cool to the target temperature shortcut after boiling (°C) | temp_boiling_quick_c | Issue and report | Enum          | Enumerated values:50, 65, 85, 90, 100                               |
| 5     | Cool to the target temperature shortcut after boiling (°F) | temp_boiling_quick_f | Issue and report | Enum          | Enumerated values:122, 149, 185, 194, 212                           |
| 6     | Temperature scale switching                                | temp_unit_convert    | Issue and report | Enum          | Enumerated values:c, f                                              |
| 7     | Insulation switch                                          | switch_keep_warm     | Issue and report | Boolean       |                                                                     |
| 8     | Holding time setting                                       | keep_warm_setting    | Issue and report | Integer       | Values range:0-360, Pitch1, Scale0, Unit:min                        |
| 9     | Mode                                                       | work_type            | Issue and report | Enum          | Enumerated values: setting_quick, boiling_quick, temp_setting, temp_ |


### BecaThermostat 

!!! warning "Work in progress"

| DP ID | Function points     | Identifier  | Data type        | Function type | Properties                                 |
|-------|---------------------|-------------|------------------|---------------|--------------------------------------------|
| 1     | Switch              | Power       | Issue and report | Boolean       |                                            |
| 2     | Target temperature  | TempSet     | Issue and report | Integer       | Values range:0-37, Pitch1, Scale0, Unit:℃  |
| 3     | Current Temperature | TempCurrent | Only report      | Integer       | Values range:-9-99, Pitch1, Scale0, Unit:℃ |
| 4     | Mode                | Mode        | Issue and report | Enum          | Enumerated values:m, p (wip)               |
| 102   | Floor Temperature   | FloorCurrent| Issue and report | Integer       | Values range:0-37, Pitch1, Scale0, Unit:℃ |


### Inkbird ITC-308-Wifi 
Temperature controller with individual plug in sockets for heating/cooling

| DP ID | Function points            | Identifier | Data type        | Function type | Properties                                                  |
|-------|----------------------------|------------|------------------|---------------|-------------------------------------------------------------|
| 101   | Temperature unit           | Cf         | Issue and report | Integer       | 0=C, 1=F                                                    |
| 102   | Calibration                | Ca         | Issue and report | Integer       | Unit is 0.1C                                                |
| 104   | Temperature sensor         |            | Issue and report | Integer       | Unit is 0.1C                                                |
| 106   | Temperature set point      | Ts         | Issue and report | Integer       | Unit is 0.1C                                                |
| 108   | Compressor delay time      | Pt         | Issue and report | Integer       | Unit is minutes                                             |
| 109   | Alarm high temperature     | Ah         | Issue and report | Integer       | Unit is 0.1C                                                |
| 110   | Alarm low temperature      | Al         | Issue and report | Integer       | Unit is 0.1C, For negative values use -(0xFFFFFFFF - value) |
| 115   | Relay status               |            | Only report      | Integer       | 01=cool, 02=off, 03=heating                                 |
| 116   | Temperature sensor         |            | Issue and report | Integer       | Unit is 0.1F                                                |
| 117   | Heating differential value | Hd         | Issue and report | Integer       | Unit is 0.1C                                                |
| 118   | Cooling differential value | Cd         | Issue and report | Integer       | Unit is 0.1C                                                |

The unit will constantly be sending the temperature sensor value in
celcius and fahrenheit: 104 and 116.  To trigger the unit to send all
settings, send any value to a non-used register, e.g. TuyaSend1 2,1

Example:

| Tasmota command   | Result                                  |
|-------------------|-----------------------------------------|
| TuyaSend1 2,1     | Trigger the unit to reveal all settings |
| TuyaSend2 106,250 | Change set-point to 25.0C               |
| TuyaSend2 101,1   | Change units to Fahrenheit              |


## Further Reading

* [TuyaMCU Flashing and Device Configuration](TuyaMCU-Devices)
