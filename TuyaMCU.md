?> TuyaMCU - Module (54) is configured for devices with a Tuya Wi-Fi module and a secondary MCU. 

Originally, in those devices, the Wi-Fi module takes care of network and software features. Meanwhile, the MCU controls the hardware based on commands received from the Wi-Fi module or built-in controls (buttons, switches, remotes and similar) and reports the status back to the Wi-Fi module. 

TuyaMCU module facilitates communication between Tasmota and the MCU using [Tuya Serial Port Communication Protocol](#tuya-protocols):
- `TuyaMCU` command maps device functions to Tasmota components 
- `TuyaSend<x>` command calculates and sends complex serial commands using only two parameters
- _**TuyaReceived**_ response interprets status messages and publishes a JSON payload to an MQTT topic 

## TuyaMCU Command
Command [`TuyaMCU`](Commands#tuyamcu) is used to map Tasmota components to Tuya device dpId's. 
> [!WARNING] Used only if your device is defined as module `TuyaMCU (54)`.

Command value consists of two comma separated parameters: fnId and dpId. 
```
TuyaMCU <fnId>,<dpId>
```  
where `<fnId>` is a Tasmota component and `<dpId>` is the dpId to map the function to.
> [!EXAMPLE] `TuyaMCU 11,1` maps Relay1 (fnId 11) to dpId 1.

If any existing entry with same `fnId` or `dpId` is already present, it will be updated to the new value.    

Entry is removed when `fnId` or `dpId` is `0`.     

When no parameters are provided `TuyaMCU` prints the current mapped values.    

### dpId
All the device functions controlled by the MCU are identified by a dpId.    
Whenever a command is sent to the MCU, this dpId determines which component needs to be controlled and the applies when the status is received from MCU. 

**There is no way to autodetect dpId's and their functions.**

Use this procedure to determine which dpId's are available:

1. Go to `Configure` -> `Console` option in Tasmota web interface.
2. Use command `weblog 4` to enable verbose logging in web interface.
3. Observe the log. After every 9-10 seconds you should see log messages similar to:
   ```json
   TYA: Heartbeat
   TYA: RX Packet: "55aa0107000501010001000f"
   TYA: FnId=0 is set for dpId=1
   TYA: RX Packet: "55aa01070005020100010010"
   TYA: FnId=0 is set for dpId=2
   TYA: RX Packet: "55aa01070005030100010011"
   TYA: FnId=0 is set for dpId=3
   TYA: RX Packet: "55aa01070005040100010012"
   TYA: FnId=0 is set for dpId=4
   TYA: RX Packet: "55aa0107000807020004000000001c"
   TYA: FnId=0 is set for dpId=7
   TYA: RX Packet: "55aa0107000808020004000000001d"
   TYA: FnId=0 is set for dpId=8
   TYA: RX Packet: "55aa0107000809020004000000001e"
   TYA: FnId=0 is set for dpId=9
   TYA: RX Packet: "55aa010700080a020004000000001f"
   TYA: FnId=0 is set for dpId=0
   TYA: RX Packet: "55aa0107000865020004000000007a"
   TYA: FnId=0 is set for dpId=101
   TYA: RX Packet: "55aa0107000866020004000000007b"
   TYA: FnId=0 is set for dpId=102
   TYA: RX Packet: "55aa0107000867020004000000007c"
   TYA: FnId=0 is set for dpId=103
   TYA: RX Packet: "55aa0107000868020004000009870d"
   TYA: FnId=0 is set for dpId=104
   ```
4. Observe all lines printed as `TYA: FnId=0 is set for dpId=XXX` and note all dpId values. 

Now that you have a list of usable dpId's you need to determine what their functions are:
1. Consulting our [list of commonly used](#dpid-function-tables) dpId's and existing device configurations
2. Observing Tasmota logs while activating features of the device (with a remote or on device controls) and correlating log messages
3. Extrapolating possible function of the dpId based on Data Type and Function Command, then testing using `TuyaSend<x>`

### fnId
Identifier used in `TuyaMCU` command to map a dpId to a Tasmota component.

Component| FunctionId|Note
-|-|-
Switch1 to Switch4 | 1 to 4 | Map only to dpId with on / off function
Relay1 to Relay8 | 11 to 18 | Map only to dpId with on / off function
Dimmer | 21 | Only on dpId with dimming function
Power (in deci Watt) | 31 |
Current (in milli Amps) | 32 |
Voltage (in deci Volt) | 33 |
Relay Inverted1 to Relay Inverted8 | 41 to 48 | Map only to dpId with on / off function
Battery powered sensor mode | 51 | 

> [!NOTE] This component is under active development which means the function list may expand in the future.

Since the majority of devices have a power on/off functions on dpId 1 its mapped to fnId 11 (Relay1) by default.

> [!DANGER]
>Mapping a relay or switch to a dpId that is not a simple on/off function (data Type 1) might result in unwanted power toggling (f.e. dpId sends value of 4 which toggles the relay to Power 4 aka blink mode)

## TuyaSend Command
Command `TuyaSend` is used to send commands to dpId's. It is required for dpId's that shouldn't be mapped to a fnId. 

With this command it is possible to control every function of the dpId that is controllable, providing you know its data type and data length. With them provided, the rest of the protocol command is calculated.

Command's value consists of two comma separated parameters: dpId and data. 

`TuyaSend<x> dpId,data`

There are 4 different commands, one for each [data type](#data-type-table).

#### `TuyaSend1` 
Sends boolean (Type 1) data (`0/1`) to dpId (Max data length 1 byte)

> [!EXAMPLE] `TuyaSend1 1,0` sends vaue `0` to dpId=1 switching the device off
#### `TuyaSend2` 
Sends integer or 4 byte (Type 2) data to dpId (Max data length 4 bytes)

> [!EXAMPLE] `TuyaSend2 14,100` sends value `100` to dpId=14 setting timer to 100 minutes

#### `TuyaSend3` 
Sends string (Type 3) data to dpId (Max data length? Not known at this time).  

> [!WARNING] Note that when sending color values, the MCU may interpret lower case and upper case hex codes differently. You may need to test with your specific MCU to ensure that the values sent properly render the color you desire.  

> [!EXAMPLE] `TuyaSend3 108,ff0000646464ff` sends a 14 char hex string to dpId=108 (Type 3) containing RGBHSV values to control a light

#### `TuyaSend4` 
Sends enum (Type 4) data (`0/1/2/3/4/5`) to dpId (Max data length 1 bytes)

> [!EXAMPLE] `TuyaSend4 103,2` sends value `2` to dpId=103 to set fan speed to high

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

> [!TIP] Use command `SerialSend5 55aa0001000000` at any time to request statuses of all dpId's from the MCU. 
#### Use in Rules
This data can also be used as a trigger for rules using `TuyaReceivedData#Data=hex_string`

```console
Rule1 on TuyaReceived#Data=55AA000700056E040001007E do publish2 stat/tuya_light/effect rgb_cycle endon
``` 
will publish a status message to a custom topic when `55AA000700056E040001007E` appears in "Data" field of the response.

#  Device Configurations
Before proceeding identify dpId's and their function.

## Dimmers	
We need to configure four functions of a dimmer:  	
1. Dimming dpId	
2. Dimming Range	
3. Power metering if supported.	
4. Dimming less than 10%	

### Dimming dpId	
The dimmer FunctionId is `21`. On a dimmer dpId generally is `2` or `3`. Try both.  	
1. Go to the Tasmota Console and type `TuyaMCU 21,2` and wait for it to reboot.	
2. Enter `Backlog Dimmer 10; Dimmer 100` in the Console. 	
   - If your bulb responds to `Dimmer` commands, you have successfully configured the dimmer FunctionId. Make note of it. 	
   - If not try id `3` and if even `3` doesn't work keep trying Ids from all unknown Ids from the log until one works.	

### Dimming Range	
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
Now we need to tell Tasmota to use maximum and minimum values. This controlled by [DimmerRange](Commands#DimmerRange) command. We can set it using `DimmerRange <Min>,<Max>` where `<Min>` is the minimum dimmer state and `<Max>` maximum dimmer state reported in logs.	

Once set, try `dimmer 100` in the Console and check if the brightness of bulb is same is the same as when the maximum was set using hardware buttons.	

[Video instructions](https://www.youtube.com/embed/_3WW4NVYHrU) by Digiblur

### Power Metering	
Some Tuya MCU devices support Power measurement support over serial. For this its better to use a bulb with known wattage rating.  	

Observe the logs in the Console  	
```	
TYA: RX Packet: "55aa03070005010100010011"	
TYA: FnId=11 is set for dpId=1	
TYA: RX Device-1 --> MCU State: Off Current State:Off	
TYA: RX Packet: "55aa03070008020200040000000720"	
TYA: FnId=21 is set for dpId=2	
TYA: RX Dim State=7	
TYA: RX Packet: "55aa0307000803020004000000001a"	
TYA: FnId=0 is set for dpId=3	
TYA: RX Packet: "55aa0307000804020004000000251b"	
TYA: FnId=0 is set for dpId=4	
TYA: RX Packet: "55aa0307000805020004000000591c"	
TYA: FnId=0 is set for dpId=5	
TYA: RX Packet: "55aa03070008060200040000098fb5"	
TYA: FnId=0 is set for dpId=6	
```	

In the `RX Packet` we are interested in the 3 digits before last 2 digits. For example:	
`98f` in `"55aa03070008060200040000098fb5"`	

1. Make sure the bulb if off.	
2. Find out the voltage standard of your country (generally 220, 240, 120v) from this [table](https://www.worldstandards.eu/electricity/plug-voltage-by-country/).	
3. Multiply that number by 10 (2400) and Convert that number (2400) to Hex using any [hex converter](https://www.binaryhexconverter.com/decimal-to-hex-converter) (2400 = 0x960). 	
4. Now look for the number nearest to `960` in the logs. In our case it is `98f`. So we expect that's the voltage which is `ID=6` in our example.	
5. Set voltage functionId `33` by entering `TuyaMCU 33,6`.	
6. Now set dimmer to 100% using the `dimmer 100` command and observe the logs.	
7. Now we need the power rating of your bulb example `9W`. Multiply by 10 (90) and convert to hex which gives us 0x5A. Check which unknown ID is close to `5A`. I this example it is `59` for `ID=5`. This is the Id of `Active Power` function.	
8. Set the active power functionId `31` by entering `TuyaMCU 31,5`.	
9. Once Power and Voltage are set you should see something such as this in the logs:	
   ```	
   TYA: RX Packet: "55aa03070005010100010011"	
   TYA: FnId=11 is set for dpId=1	
   TYA: RX Device-1 --> MCU State: Off Current State:Off	
   TYA: RX Packet: "55aa03070008020200040000000720"	
   TYA: FnId=21 is set for dpId=2	
   TYA: RX Dim State=7	
   TYA: RX Packet: "55aa0307000803020004000000001a"	
   TYA: FnId=0 is set for dpId=3	
   TYA: RX Packet: "55aa0307000804020004000000251b"	
   TYA: FnId=0 is set for dpId=4	
   TYA: RX Packet: "55aa0307000805020004000000591c"	
   TYA: FnId=31 is set for dpId=5	
   TYA: Rx ID=5 Active_Power=9	
   TYA: RX Packet: "55aa03070008060200040000098fb5"	
   TYA: FnId=33 is set for dpId=6	
   TYA: Rx ID=6 Voltage=244.7	
   ```	
10. To get the Id for the current, calculate Current = Power / Voltage ( 9 / 244.7 ) = 0.0367. Multiply this by 1000 = 36.77. Now convert 36 to hex which is 0x24. This is closest to `25` which is Id 4. 	
11. Set the current FunctionId `32` using command `TuyaMCU 32,4`.	
12. Observe the logs should start showing	
    ```	
    TYA: RX Packet: "55aa03070005010100010011"	
    TYA: FnId=11 is set for dpId=1	
    TYA: RX Device-1 --> MCU State: Off Current State:Off	
    TYA: RX Packet: "55aa03070008020200040000000720"	
    TYA: FnId=21 is set for dpId=2	
    TYA: RX Dim State=7	
    TYA: RX Packet: "55aa0307000803020004000000001a"	
    TYA: FnId=0 is set for dpId=3	
    TYA: RX Packet: "55aa0307000804020004000000251b"	
    TYA: FnId=32 is set for dpId=4	
    TYA: Rx ID=4 Current=312	
    TYA: RX Packet: "55aa0307000805020004000000591c"	
    TYA: FnId=31 is set for dpId=5	
    TYA: Rx ID=5 Active_Power=9	
    TYA: RX Packet: "55aa03070008060200040000098fb5"	
    TYA: FnId=33 is set for dpId=6	
    TYA: Rx ID=6 Voltage=2447	
    ```	
13. Power and current should change on dimming high / low. The Tasmota web UI should show power values now.	

## Switches	
For switches we need to  	
1. Configure the number of relays.	
2. Configure Power metering.	

### Number of Relays	
By default, the TuyaMCU module expects a 1 gang switch. There is currenty no way to detect the number of relays present in an MCU based switch. We need to tell the number of relays to Tasmota using FunctionIDs 12 to 18 for Relay2 to Relay4. 	
* For a 4 gang switch set `TuyaMCU 12,2`, `TuyaMCU 13,3` and `TuyaMCU 14,4` if the dpIds for Relays 2-4 are `2`,`3`,`4`.	

> [!TIP] You can configure all at once by using `Backlog TuyaMCU 12,2; TuyaMCU 13,3; TuyaMCU 14,4`	
### Power Metering	
Power metering configuration is same as for [dimmers](#power-metering).	

## Curtain Motors	
The Zemismart WiFi curtain motor uses a Tuya TYWE1S inside the little white dongle as a radio modem.	
`U1TX` is connected to "USB D+", `U1RX` is connected to "USB D-", and there is a blue LED in the dongle connected to "USB3 R-" controlled by the MCU. To flash Tasmota, we need `U0RX`, `U0TX`, and `GPIO0`. None of which are broken out on the PCB, so soldering or Tuya-Convert are necessary.	

The stock Tuya App communicates with the PIC Micro inside the motor housing at 9600 8N1. 	
* `dpId 101` is the "partial open/partial close" command with a 4 byte field of 0-100%. 	
* `dpId 102` is a "fully open/fully close" command with a 1-byte Boolean field. 	
* `dpId 103` is unknown.	

### Debugging	
```	
55 aa 00 06 "deliver dp" 0005 "len=5" 66 04 00 01 <00=close100%,01=open0%> <chksum> is the fully open/close command	
07 "report dp" 0005 (len) 66 04 00 01 <00 or 01> <chksum> is the reply.	
55 aa 00 06 "deliver dp" 0008 (len=8) 65 02 00 04  <value.32 <chksum> is the move partial command	
55 aa 00 07 "report dp" 0008 (len=8) 65 02 00 04 <value.32> <chksum> is the reply. 	
```	

There may first be a reply of 65 02 00 04 <oldvalue.32> <chksum> before the motor engages	

### dpId Configuration	
1. `module 54` # TuyaMCU (will reboot)	
2. `backlog gpio1 0; gpio3 0; gpio15 107; gpio13 108` # change GPIO assignments. The dongle uses gpio15 for U1TX and gpio13 for U1RX (will reboot)	
3. `tuyamcu 21,101` # declare curtain as a dimmer (will reboot)	
4. \# no idea what a good tuyamcu xx,102 is	
5. \# no idea what a good tuyamcu xx,103 is	
6. `setoption 69 0` # allow dimmer below 25% or 10%. (won't reboot)	

With these settings, the `dimmer` command can adjust the curtain from 100% (closed) to 1% (almost fully open, 0% is the motor limit, but 1% is the Tasmota limit?)	

#### Things That Did Not Work	
```console	
tuyamcu 1,102 # make 0x66 a button	
tuyamcu 1,103 # make 0x67 a button	
```	
Having 0x66 declared a button caused the motor to oscillate - open part way and then close again. Like Tasmota was sending the "fully open" command and then immediately cancelling it with a "partial close" command.	
```console	
tuyamcu 11,102 # make 0x66 a relay	
tuyamcu 11,103 # make 0x67 a relay	
```	
Does not appear to have any impact on the curtain.

## Aromatherapy Diffuser
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

```console
Backlog SetOption66 1; TuyaMCU 21,111; TuyaMCU 11,1; TuyaMCU 12,11; TuyaMCU 13,103; TuyaMCU 14,12; TuyaMCU 15,110; DimmerRange 1,255; SetOption59 1
```
```console
Rule1 on TuyaReceived#data=55AA000700056E040001007E do publish2 stat/GD-30W/EFFECT rgb_cycle endon on TuyaReceived#data=55AA000700056E040001017F do publish2 stat/GD-30W/EFFECT color endon on event#rgb_cycle do tuyasend4 110,0 endon on event#color do tuyasend4 110,1 endon on event#ON do backlog tuyasend4 110,1; tuyasend 11,1 endon on event#off do tuyasend1 11,0 endon on power3#state=1 do tuyasend4 103,1 endon on power3#state=0 do tuyasend4 103,0 endon
Rule1 1
```

*Optional rule used to prevent the device going into countdown mode (f.e. using on device controls) and complete MCU status update on restart*

```console
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

LED mode status is reported to mqtt topic `stat/GD-30W/EFFECT` and command [`Event`](Commands#event) is used to control some functions using [`TuyaSend4`](Commands#tuyasend4) command. All this is defined in `Rule1`

Color can be changed using `TuyaSend3 108,RRGGBB64646464` (RR, GG and BB are hex value) only in color mode.

Dimming works using slider and `Dimmer` command but only when in color mode, in rgb_cycle there are no brightness controls.

Long press on device's power button initiates Tasmota's Wi-Fi config

## Battery Powered Door Window Sensor
[Read more here...](https://blakadder.github.io/templates/TYMC-1.html)

# Tuya Protocols
The MCU communicates with the Wi-Fi module through the serial port with a Tuya specified protocol. Those are classified into basic and functional protocols. 

## Basic protocols 
They are common protocols integrated in Tasmota's TuyaMCU module. They stay the same for each product and are mandatory for Tuya module to work correctly. 

## Functional protocols 
Functional protocols are used for delivering and reporting data of functions. These protocols differ between devices and manufacturers and might require configuration in Tasmota using [`TuyaMCU`](#tuyamcu) command or with [`TuyaSend<x>`](#tuyasend) command.

### Anatomy of Functional Protocols

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

### Protocol flow
On device boot, TuyaMCU executes the required basic protocols and reads the functional protocol data received, which are used to update status of components mapped in TuyaMCU (Relays, dimmer, power monitoring data).

After receiving a command from Tasmota (Command Word `0x06`), the MCU performs corresponding logical control. When the dpID status is changed, the MCU reports the data (Command Word `0x07`) to TuyaMCU component. 

## dpId Function Tables
***This information is just for orientation. Functions are assigned by the manufacturer and can be on different dpId's***

- DP ID: dpId.
- Function Point：Used to describe the product function.
- Identifier: Function codename. Can only be letters, numbers and underscores
- Data type：
   - Issue and report: command data can be sent and status data can be reported back to the Wi-Fi module
   - Report only: supports only status reporting, no control options

- Function Type (Referred as Data Type in [Tuya Protocols](Tuya-Protocols) article):
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


### BecaThermostat(WIP)

| DP ID | Function points     | Identifier  | Data type        | Function type | Properties                                 |
|-------|---------------------|-------------|------------------|---------------|--------------------------------------------|
| 1     | Switch              | Power       | Issue and report | Boolean       |                                            |
| 2     | Target temperature  | TempSet     | Issue and report | Integer       | Values range:0-37, Pitch1, Scale0, Unit:℃  |
| 3     | Current Temperature | TempCurrent | Only report      | Integer       | Values range:-9-99, Pitch1, Scale0, Unit:℃ |
| 4     | Mode                | Mode        | Issue and report | Enum          | Enumerated values:m, p (wip)               |
| 102   | Floor Temperature   | FloorCurrent| Issue and report | Integer       | Values range:0-37, Pitch1, Scale0, Unit:℃ |


### Inkbird ITC-308-Wifi Temperature controller with individual plug in sockets for heating/cooling

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
