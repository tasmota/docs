> **:warning: page under construction :warning:**  

## Operation
Refer to the [Zigbee Commands](Commands#zigbee)  

Note: Zigbee will automatically boot the CC2530 device, configure it and wait for Zigbee messages.  

### Z2T Status
You can inspect the log output to determine whether Z2T started correctly. Z2T sends several status messages to inform the MQTT host about initialization.  

Ex: ```{"ZigbeeState":{"Status":1,"Message":"CC2530 booted","RestartReason":"Watchdog","MajorRel":2,"MinorRel":6}}```  
- `Status` contains a numeric code about the status message
  - `0`: initialization complete, **Z2T is running normally**
  - `1`: booting
  - `2`: resetting CC2530 configuration
  - `3`: starting Zigbee coordinator
  - `20`: disabling Permit Join
  - `21`: allowing Permit Join for 60 seconds
  - `22`: allowing Permit Join until next boot
  - `30`: Zigbee device connects or reconnects
  - `31`: Received Node Descriptor information for a Zigbee device
  - `32`: Received the list of active endpoints for a Zigbee device
  - `33`: Received the simple Descriptor with active ZCL clusters for a Zigbee device
  - `50`: reporting CC2530 firmware version
  - `51`: reporting CC2530 device information and associated devices
  - `98`: error, unsupported CC2530 firmware
  - `99`: general error, **Z2T was unable to start**
- `Message` (optional) a human-readable message
- other fields depending on the message (e.g., Status=`50` or Status=`51`)

### Pairing Zigbee Devices
By default, and for security reasons, the Zigbee coordinator does not automatically accept new devices. To pair new devices, use [`ZigbeePermitJoin 1`](Commands#zigbeepermitjoin). Once Z2T is in pairing mode, put the Zigbee device into pairing mode. This is usually accomplished by pressing the button on the device for 5 seconds or more. To stop pairing, use [`ZigbeePermitJoin 0`](Commands#zigbeepermitjoin).

### Reading sensors
Sensor messages are published via MQTT when they are received from the Zigbee device. Unlike Zigbee2MQTT, there is currently no debouncing nor caching.

Example: [Xiaomi Aqara Sensor](https://www.aliexpress.com/item/32876734250.html)
<img src="https://user-images.githubusercontent.com/49731213/64921315-3a1b3680-d7c2-11e9-94a1-32e6ac6d4e72.jpg"  width="140">

This sensor monitors humidity, temperature, and air pressure.  Its Zigbee model ID is `lumi.weather`.

1. Put Z2T into pairing mode using the `ZigbeePermitJoin` command as described above
2. Press the Xiaomi Aqara sensor's button for 5 seconds to pair the devices. You will see a message as follows:  
   ```
   MQT: tele/<topic>/RESULT = {"ZigbeeState":{"Status":30,"IEEEAddr":"00158D00036B50AE","ShortAddr":"0x8F20","PowerSource":false,"ReceiveWhenIdle":false,"Security":false}}
   ```

   |Field name|Value|
   |---|---|
   |`Status`|`30` indicates a device connect or reconnect. This is the opportunity to match IEEEAddress and short address|
   |`IEEEAddr`|Long unique address (64 bits) of the device - factory set|
   |`ShortAddr`|Short address (16 bits) randomly assigned to the device on this Zigbee network|
   |`PowerSource`|`true` = the device is connected to a power source<BR>`false` = the device runs on battery|
   |`ReceiveWhenIdle`|`true` = the device can receive commands when idle<BR>`false` = the device is not listening. Commands should be sent when the device reconnects and is idle|
   |`Security`|Security capability (meaning unknown, to be determined)|

This device publishes sensor values roughly every hour or when a change occurs. You can also force an update pressing the device's button. It sends two kinds of messages, either 3x standard Zigbee messages, or a single proprietary message containing all sensor values.  

Examples:
```
MQT: tele/<topic>/RESULT = {"0x8F20":{"Humidity":23.47}}
MQT: tele/<topic>/RESULT = {"0x8F20":{"Temperature":59.85}}
MQT: tele/<topic>/RESULT = {"0x8F20":{"Pressure":1005,"PressureUnit":"hPa"}}
MQT: tele/<topic>/RESULT = {"0x8F20":{"Temperature":23.47,"Humidity":58.97,"Pressure":1005.8,"PressureUnit":"hPa","Voltage":3.005,"Battery":100}}
MQT: tele/<topic>/RESULT = {"0x8F20":{"ModelId":"lumi.weather"}}
```
`0x8F20` is the ShortAddress of the sensor.  

Supported values:  

|Field name|Value|
|---|---|
|`Humidity`|Humidity in percentage (float)|
|`Pressure` and `PressureUnit`|Atmospheric pressure (float) and unit (string)<BR>Currently only `hPa` (A.K.A. mbar) is supported|
|`Temperature`|Temperature in Celsius (float)|
|`Voltage`|Battery voltage (float)|
|`Battery`|Battery charge in percentage (integer)|
|`ModelId`|Model name of the Zigbee device (string)<BR>Ex: `lumi.weather`|

### Device Information
You can dump the internal information gathered about connected Zigbee devices with the command [`ZigbeeStatus`](Commands#zigbeestatus).  

`ZigbeeStatus1` - List all connected devices  
```yaml
{"ZigbeeStatus-99":[{"ShortAddr":"0x6B58"},{"ShortAddr":"0xE9C3"},{"ShortAddr":"0x3D82"}]}
```

_(JSON pretty-printed for readability)_  
```yaml
{
    "ZigbeeStatus-99": [
        {
            "ShortAddr":"0x6B58"
        },
        {
            "ShortAddr":"0xE9C3"
        },
        {
            "ShortAddr":"0x3D82"
        }
    ]
}
```

`ZigbeeStatus 2` - Display detailed information for each device, including long address, model and manufacturer:  
```yaml
{"ZigbeeStatus2":[{"ShortAddr":"0x6B58","IEEEAddr":"7CB03EAA0A0292DD","ModelId":"Plug 01","Manufacturer":"OSRAM"},{"ShortAddr":"0xE9C3","IEEEAddr":"00158D00036B50AE","ModelId":"lumi.weather","Manufacturer":"LUMI"},{"ShortAddr":"0x3D82","IEEEAddr":"0017880102FE1DBD","ModelId":"LWB010","Manufacturer":"Philips"}]}
```

_(JSON pretty-printed for readability)_  
```yaml
{
    "ZigbeeStatus2": [
        {
            "ShortAddr": "0x6B58",
            "IEEEAddr": "7CB03EAA0A0292DD",
            "ModelId": "Plug 01",
            "Manufacturer": "OSRAM"
        },
        {
            "ShortAddr": "0xE9C3",
            "IEEEAddr": "00158D00036B50AE",
            "ModelId": "lumi.weather",
            "Manufacturer": "LUMI"
        },
        {
            "ShortAddr": "0x3D82",
            "IEEEAddr": "0017880102FE1DBD",
            "ModelId": "LWB010",
            "Manufacturer": "Philips"
        }
    ]
}
```

#### Identifying Target Device Endpoints
You can use `ZigbeeStatus3` to display information about all the endpoints and ZCL clusters supported. If probing was successful (at pairing time or using `ZigbeeProbe`), Tasmota will automatically find the right endpoint. If the device was not probed, you need to specify the endpoint explicitly. It is always better to explicitly add the endpoint number if you know it.

##### Known Endpoints

Device|Endpoint
-|-
OSRAM Plug|`0x03`
Philips Hue Bulb|`0x0B`

```yaml
{"ZigbeeStatus3":[{"ShortAddr":"0x6B58","Endpoints":{"0x03":{"ProfileId":"0xC05E","ProfileIdName":"ZigBee Light Link","ClustersIn":["0x1000","0x0000","0x0003","0x0004","0x0005","0x0006","0x0B04","0xFC0F"],"ClustersOut":["0x0019"]}}},{"ShortAddr":"0xE9C3","Endpoints":{"0x01":{"ProfileId":"0x0104","ClustersIn":["0x0000","0x0003","0xFFFF","0x0402","0x0403","0x0405"],"ClustersOut":["0x0000","0x0004","0xFFFF"]}}},{"ShortAddr":"0x3D82","Endpoints":{"0x0B":{"ProfileId":"0xC05E"," ...
```

_(JSON pretty-printed for readability)_  
```yaml
{
  "ZigbeeStatus3": [
    {
      "ShortAddr": "0x6B58",
      "Endpoints": {
        "0x03": {
          "ProfileId": "0xC05E",
          "ProfileIdName": "ZigBee Light Link",
          "ClustersIn": [
            "0x1000",
            "0x0000",
            "0x0003",
            "0x0004",
            "0x0005",
            "0x0006",
            "0x0B04",
            "0xFC0F"
          ],
          "ClustersOut": [
            "0x0019"
          ]
        }
      }
    },
    {
      "ShortAddr": "0xE9C3",
      "Endpoints": {
        "0x01": {
          "ProfileId": "0x0104",
          "ClustersIn": [
            "0x0000",
            "0x0003",
            "0xFFFF",
            "0x0402",
            "0x0403",
            "0x0405"
          ],
          "ClustersOut": [
            "0x0000",
            "0x0004",
            "0xFFFF"
          ]
        }
      }
    },
    {
      "ShortAddr": "0x3D82",
      "Endpoints": {
        "0x0B": {
          "ProfileId": "0xC05E",
          " ...
        }
      }
    }
  ]
}
```

Ex: OSRAM Zigbee plug:  
```yaml
{"Device":"0x69CF","IEEEAddr":"0000000000000000","ModelId":"Plug 01","Manufacturer":"OSRAM","Endpoints":{"0x03":{"ProfileId":"0xC05E","ProfileIdName":"ZigBee Light Link","ClustersIn":["0x1000","0x0000","0x0003","0x0004","0x0005","0x0006","0x0B04","0xFC0F"],"ClustersOut":["0x0019"]}}}
```

The message above shows that the device supports only one endpoint `0x03` which accepts messages (`ClustersIn`) for clusters `"0x1000","0x0000","0x0003","0x0004","0x0005","0x0006","0x0B04","0xFC0F"`.

### Supported Zigbee Device Commands

Command|Parameters|Cluster
-|-|-
Power|`1\|true\|"true"\|"on"`: On<BR>`0\|false\|"false"\|"off"`: Off<BR>`2\|"Toggle"`: Toggle|0x0006
Dimmer|`0..254`: Dimmer value<BR>255 is normally considered as invalid, and may be converted to 254|0x0008
Dimmer+|`null`: no parameter. Increases dimmer by 10%|0x0008
Dimmer-|`null`: no parameter. Decreases dimmer by 10%|0x0008
DimmerStop|`null`: no parameter. Stops any running increase of decrease of dimmer.|0x0008
ResetAlarm|`<alarmcode>,<clusterid>`: (to be documented later)|0x0009
ResetAllAlarms|`null`: no parameter, (to be documented later)|0x0009
Hue|`0..254`: change Hue value|0x0300
Sat|`0..254`: change Sat value|0x0300
HueSat|`0..254,0..254`: change both Hue and Sat values|0x0300
Color|`0..65534,0..65534`: change the color using [x,y] coordinates|0x0300
CT|`0..65534`: change the white color-temperature in Mireds|0x0300
Shutter|`0..254`: send any Shutter command (prefer the commands below)|0x0102
ShutterOpen|`null`: no parameter, open shutter|0x0102
ShutterClose|`null`: no parameter, close shutter|0x0102
ShutterStop|`null`: no parameter, stop shutter movement|0x0102
ShutterLift|`0..100`: move shutter to a specific position in percent<BR>`0`%=open, `100`%=closed|0x0102
ShutterTilt|`0..100`: move the shutter to the specific tilt position in percent|0x0102

Examples:

**OSRAM Plug**

```yaml
ZigbeeSend { "device":"0x69CF", "endpoint":"0x03", "send":{"Power":"On"} }
ZigbeeSend { "device":"0x69CF", "endpoint":"0x03", "send":{"Power":1} }
ZigbeeSend { "device":"0x69CF", "endpoint":"0x03", "send":{"Power":false} }
ZigbeeSend { "device":"0x69CF", "endpoint":"0x03", "send":{"Power":"Toggle"} }
```

Read the On/Off status: (all three commands below are synonyms)

```yaml
ZigbeeRead { "device":"0x69CF", "endpoint":"0x03", "cluster":"0x0006", "read":"0x0000" }
ZigbeeRead { "device":"0x69CF", "endpoint":"0x03", "cluster":"0x0006", "read":["0x0000"] }
ZigbeeRead { "device":"0x69CF", "endpoint":3, "cluster":6, "read":0 }
```

**Philips Hue bulb**

```yaml
ZigbeeSend { "device":"0x3D82", "endpoint":"0x0B", "send":{"Power":"Off"} }
ZigbeeSend { "device":"0x3D82", "endpoint":"0x0B", "send":{"Dimmer":128} }
ZigbeeSend { "device":"0x3D82", "endpoint":"0x0B", "send":{"Dimmer":254} }
ZigbeeSend { "device":"0x3D82", "endpoint":"0x0B", "send":{"Dimmer":0} }
```
