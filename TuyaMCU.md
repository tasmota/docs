Module **TuyaMCU (54)** is configured for devices with a Tuya Wi-Fi module and a secondary MCU. 

Originally, in those devices, the Wi-Fi module takes care of network and software features. Meanwhile, the MCU controls the hardware based on commands received from the Wi-Fi module or built-in controls (buttons, switches, remotes and similar) and reports the status back to the Wi-Fi module. 

TuyaMCU module facilitates communication between Tasmota and the MCU using [Tuya Serial Port Communication Protocol](tuya-protocols):
- `TuyaMCU` command maps device functions to Tasmota components 
- `TuyaSend<x>` command calculates and sends complex serial commands using only two parameters
- "TuyaReceived" response interprets status messages and publishes a JSON payload to an MQTT topic 

# TuyaMCU
Command [`TuyaMCU`](commands#tuyamcu) is used to map Tasmota components to Tuya device dpId's. 
> Used only if your device is defined as module `TuyaMCU (54)`.

Command value consists of two comma separated parameters: fnId and dpId. 
```
TuyaMCU <fnId>,<dpId>
```  
where `<fnId>` is a Tasmota component and `<dpId>` is the dpId to map the function to.
> `TuyaMCU 11,1` maps Relay1 (fnId 11) to dpId 1.

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
   ```
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
1. Consulting our [list of commonly used](tuya-protocols#dpid-function-tables) dpId's and existing device configurations
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

> This component is under active development which means the function list may expand in the future.

Since the majority of devices have a power on/off functions on dpId 1 its mapped to fnId 11 (Relay1) by default.

***Mapping a relay or switch to a dpId that is not a simple on/off function (data Type 1) might result in unwanted power toggling (f.e. dpId sends value of 4 which toggles the relay to Power 4 aka blink mode)***

###  Device Configurations
- [Dimmers](TuyaMCU-Configurations#dimmer)
- [Switches or plugs](TuyaMCU-Configurations#switches)
- [Curtain motors](TuyaMCU-Configurations#curtain-motor)
- [Aromatherapy diffusers](TuyaMCU-Configurations#aromatherapy-diffuser)

# TuyaSend
**Requires latest development version, not supported in 6.7.1**

Command `TuyaSend` is used to send commands to dpId's. It is required for dpId's that shouldn't be mapped to a fnId. 

With this command it is possible to control every function of the dpId that is controllable, providing you know its data type and data length. With them provided, the rest of the protocol command is calculated.

Command's value consists of two comma separated parameters: dpId and data. 

`TuyaSend<x> dpId,data`

There are 4 different commands, one for each [data type](#data-type-table).

- `TuyaSend1` -> Sends boolean (Type 1) data (`0/1`) to dpId (Max data length 1 byte)
> `TuyaSend1 1,0` sends vaue `0` to dpId=1 switching the device off
- `TuyaSend2` -> Sends integer or 4 byte (Type 2) data to dpId (Max data length 4 bytes)
> `TuyaSend2 14,100` sends value `100` to dpId=14 setting timer to 100 minutes
- `TuyaSend3` -> Sends string (Type 3) data to dpId ( Max data length not-known)
> `TuyaSend3 108,ff0000646464ff` sends a 14 char hex string to dpId=108 (Type 3) containing RGBHSV values to control a light
- `TuyaSend4` -> Sends enum (Type 4) data (`0/1/2/3/4/5`) to dpId (Max data length 1 bytes)
> `TuyaSend4 103,2` sends value `2` to dpId=103 to set fan speed to high

# TuyaReceived
**Requires latest development version, not supported in 6.7.1**

Every status message from the MCU gets a JSON response named `TuyaReceived` which contains the MCU protocol status message inside key/value pairs which are hidden from the user by default.

To publish them to an MQTT Topic of `tele/%topic%/RESULT` you need to enable `SetOption66 1`.

### Example
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

> Use command `SerialSend5 55aa0001000000` at any time to request statuses of all dpId's from the MCU. 
### Use in rules
This data can also be used as a trigger for rules using `TuyaReceivedData#Data=hex_string`

```
Rule1 on TuyaReceived#Data=55AA000700056E040001007E do publish2 stat/tuya_light/effect rgb_cycle
``` 
will publish a status message to a custom topic when `55AA000700056E040001007E` appears in "Data" field of the response.

#### Useful links
* [dpId function tables](tuya-protocols#dpid-functions-tables)
* [TuyaMCU based dimmers and switches](MCU-Based-Tuya-Dimmers-and-Switches)