# HDMI CEC 

??? tip "This feature is not included in standard Tasmota builds." 

    When [compiling your build](Compile-your-build) add the following flag to the build environment or `user_config_override.h`:
    ```arduino
    #define USE_HDMI_CEC
    ```

??? tip "This feature relies on I2C support, and may not compile if this is not enabled."

    If you encounter this issue, add the following flag to the build environment or `user_config_override.h`:
    ```arduino
    #ifndef USE_I2C
    #define USE_I2C
    #endif
    ```

## What is HDMI CEC?

HDMI CEC is a feature of HDMI designed to control HDMI connected devices by using only one remote controller; so, individual CEC enabled devices can command and control each other without user intervention, for up to 15 devices.

This feature enables a simple Tasmota device plugged to any HDMI port of your home equipment, to control the TV and other equipments, with a protocol more standard and robust than Infra-Red.

## Hardware needed

HDMI CEC needs only 3 GPIOs to be connected to an HDMI port. You can use a simple ESP8266 Wemos D1 Mini plugged with Dupont cables to an HDMI pass-through like [these devices from Alix](https://www.aliexpress.com/item/1005004343592426.html)

The GPIOs from ESP devices are electrically compatible with HDMI specifications (running at 3.3V logic levels, and the ESP is able to emulate an open-drain communication line by switching its pin input state), so you can simply connect GPIOs with no additional hardware components:

<img width="345" alt="HDMI_CEC_template" src="https://github.com/tasmota/docs/assets/49731213/02ad00fc-3d91-4dba-ba00-deb8a05a38a7">

ESP8266|Wemos D1 Mini|Configuration|HDMI
:---|:---|:---|:---
GPIO 2|D4|HDMI CEC|HDMI Pin 13<BR>On the Wemos D1 Mini (and possibly other dev boards), GPIO2 is connected to a blue LED which can act as a visual indicator of CEC traffic.
GPIO 4|D2|I2C SDA|HDMI Pin 16
GPIO 5|D1|I2C SCL|HDMI Pin 15
Ground|||HDMI Pin 17
+5V|||HDMI Pin 18<BR>If another device is present on the same HDMI port by using a passthrough adapter such as the one linked above, the other device provides +5V with enough power for ESP8266. In such cases, you don't need an external power (tested with AppleTV). However, if you are using the Tasmota device in a standalone capacity (without a further device connected), you may need to supply 5V from the ESP's power source to cause the TV to detect the port as active, and listen to and broadcast commands.

Below is the template:

`Template {"NAME":"HDMI CEC","GPIO":[1,1,9824,1,640,608,1,1,1,1,1,1,1,1],"FLAG":0,"BASE":18}`

## Quick start and quick tour

HDMI CEC auto-detects all parameters and does not need specific configuration, although you may override the default configuration if needed. By default, Tasmota announces itself as a "Playback Device" on the HDMI bus.

Logs during boot:
```
00:00:00.002 HDW: ESP8266EX
00:00:00.005 UFS: FlashFS mounted with 1992 kB free
00:00:00.063 CFG: Loaded from File, Count 422
00:00:00.118 QPC: Reset
00:00:00.130 Project tasmota - Tasmota Version 13.1.0.2(tasmota-4M)-2_7_4_9(2023-09-01T20:20:26)
00:00:00.247 CEC: HDMI CEC initialized on GPIO 2, Logical address 8, Physical address 0x1000
```

Extra logs when `Weblog 3`:
```
00:00:00.001 HDW: ESP8266EX
00:00:00.007 UFS: FlashFS mounted with 1992 kB free
00:00:00.066 CFG: Loaded from File, Count 426
00:00:00.072 QPC: Count 1
00:00:00.074 CFG: CR 342/699, Busy 0
00:00:00.082 SRC: Restart
00:00:00.083 Project tasmota - Tasmota Version 13.1.0.2(tasmota-4M)-2_7_4_9(2023-09-01T20:20:26)
00:00:00.084 CEC: trying to read physical address
00:00:00.110 CEC: successfully read EDID 256 bytes, extensions count 1
00:00:00.111 CEC: EDID: 00FFFFFFFFFFFF004DD9015C010101010112010380A05A780A0DC9A05747982712484C21080081800101010101010101010101010101023A801871382D40582C450040846300001E011D007251D01E206E28550040846300001E000000FC00534F4E592054562058560A2020000000FD00303E0E460F000A20202020202001E402032B70501F101405130412111615030207060120230907078301000066030C00100080E3050301E20039023A80D072382D40102C458040846300001E011D00BC52D01E20B828554040846300001E011D8018711C1620582C250040846300009E011D80D0721C1620102C258040846300009E000000000000000000000000CA
00:00:00.111 CEC: physical address found: 0x1000
00:00:00.152 CEC: Packet sent: 44 ACK
00:00:00.199 CEC: Packet sent: 88 NAK
00:00:00.200 CEC: HDMI CEC initialized on GPIO 2, Logical address 8, Physical address 0x1000
00:00:00.678 CEC: Packet sent: 8F84100004 ACK
```

In the above example, the first part probes I2C to get EDID data and compute the physical address. Tasmota sends `44` message to check if Logical address `4` is in use. Since the message is `ACK`ed it is in use (here by an AppleTV plugged on the same HDMI port). It tries address `8` with packet `88`. `NAK` indicates that the address is free, so it is claimed by Tasmota. The message `8F84100004` indicates to the bus that logical device `8` has the physical address `0x1000`, i.e. connected the HDMI port 1 of TV.


## Commands

Command|Parameters
:---|:---
HdmiType<a class="cmnd" id="hdmitype"></a>|<type>: set the CEC device type (0..15 as per CEC specs)<BR>The default value is `4` (Playback Device). Changes require a restart to renegotiate a new HDMI logical address.<BR>Possible values are:<BR>`0`: TV<BR>`1`: Recording Device<BR>`2`: Reserved<BR>`3`: Tuner<BR>`4`: Playback Device<BR>`5`: Audio System
HdmiSend<a class="cmnd" id="hdmisend"></a>|Send a payload to the TV or to any device<BR>`HdmiSend <hex>`: sends the `<hex>` payload to the TV<BR>`HdmiSend { ["To": <to>, ] "Data":"<hex>"}` gives more control about the target.<BR>`<to>` is the logical address of the target, default is `0` which is the TV.<BR>`<hex>` is the payload, being an encoded CEC command. Note that the byte which describes the requesting and target device does not need to be added; it will be calculated from the logical address which Tasmota has claimed.<BR>Examples:<BR>`HdmiSend 8F` or `HdmiSend {"Data":"8F"}` - ask the power status of the TV<BR>`HdmiSend {"To":4,"Data":"8C"}` - ask its vendor id to logical address `4`


## Receiving and parsing payloads

Currently, payloads are passed as HEX data without any encoding/decoding.

Whenever a message is received on the CEC bus, a payload using the following syntax is triggered and can be matched with a Rule. Only messages addressed to Tasmota are published as payloads in MQTT; all messages not adressed to Tasmota are masked to avoid generating too much traffic. Note: the total traffic can be monitored with loglevel 3.

Received payloads generate an Rule event as follows:
```
{"HdmiReceived":{"From":<from>,"To":<to>,"Data":"<hex>"}}
```

Example: command `HdmiSend 8F`
```
20:07:59.449 CMD: HdmiSend 8F
20:07:59.454 RSL: RESULT = {"HdmiSend":"Done"}
20:07:59.632 RSL: SENSOR = {"HdmiReceived":{"From":0,"To":8,"Data":"9001"}}
```
In the above, Tasmota sends command `8F` (Give Device Power Status) to query the power status of the TV. The response `9001` (command `90`: Report Power Status) indicates that the TV is in Standby mode (the value of `01`).

### Turning the TV on

Command: `HdmiSend 04`

### Turning the TV off

Command: `HdmiSend 36`

## Advanced usage

When setting loglevel 3 (ex: `WebLog 3`), you see all messages being published in the CEC bus. They all generate an internal JSON event `HdmiReceived` that can be used by a rule.

The following commands are for advanced users or specific use-cases:

Command|Parameters
:---|:---
HdmiSendRaw<a class="cmnd" id="hdmisendraw"></a>|`<hex>`: send a raw payload to the HDMI CEC bus.<BR>This gives full control over messages and allows to impersonate another device. Note that if using this command, unlike `HdmiSend`, the address byte must be included.<BR>`HdmiSendRaw 408F` will issue a command that asks the TV for its power status, and report it to the device at logical address `4` (which may not be the Tasmota device that actually issued the command).
HdmiAddr<a class="cmnd" id="hdmiaddr"></a>|<addr>: set the default HDMI Physical Address in case it cannot be discovered.<BR>The default value is `0x1000` which is HDMI Port 1 on the TV<BR>This value is only used if the I2C port is not connected or if the discovery failes.<BR>If no argument is provided, this command returns the current physical adress.

The [CEC-O-MATIC](https://www.cec-o-matic.com/) tool is handy to decode and encode payloads. Note that it does take into account the addressing byte; you may need to remove it if you are sending commands.
