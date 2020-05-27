!!! info "This feature is included only in tasmota-sensors.bin" 

Otherwise you must [compile your build](Compile-your-build.md). Add the following to `user_config_override.h`:
```
#ifndef USE_RCSWITCH
#define USE_RC_SWITCH         // Add support for RF transceiver using library RcSwitch (+2k7 code, 460 iram)
#endif
```
----

!!! warning "This guide does not apply to [Sonoff RF Bridge](devices/Sonoff-RF-Bridge-433.md) specific commands"

Tasmota uses the [rc-switch library](https://github.com/sui77/rc-switch/) to decode RF codes. Supported hardware depends on rc-switch library support only.

## Sending RF Codes
Send an RF control code as a decimal or hexadecimal string in a JSON payload. An inexpensive RF receiver such as a [STX882](https://www.nicerf.com/product_132_82.html) can be connected to a device running Tasmota. In order to send RF data you need to _**configure the connected GPIO as `RFSend (105)`**_  

Command|Parameters
:---|:---
RFsend<a id="rfsend"></a>|`<value>` = code in hexadecimal, decimal or JSON. Data value is required, other values are optional.<BR><BR>_JSON_<BR>`{"Data":"<value>","Bits":<value>,"Protocol":<value>,"Pulse":<value>}`<BR>`"Data":"<value>"` = hexadecimal code<BR>`"Bits":<value>` = required number of data bits _(default = `24`)_<BR>`"Protocol":<value>` = protocol number _(default = `1`)_<BR>`"Pulse":<value>` = pulse value _(`350` = default for protocol 1)_<BR>&emsp;e.g., `RFsend {"Data":"0x7028DC","Bits":24,"Protocol":1,"Pulse":238}`<BR><BR>_Decimal_<BR>data, bits, protocol, repeat, pulse <BR>&emsp;e.g., `RFsend 7350492, 24, 1, 238` or `RFsend 0x7028DC, 24, 1, 238`

If you send only the "Data" value in decimal or hexadecimal other values will be sent as default.

!!! example
    `RfSend 123456`

    will be sent as `{"Data":"0x1E240","Bits":24,"Protocol":1,"Pulse":351}`

## Receiving RF Codes
An inexpensive RF receiver such as a [SRX882](https://www.nicerf.com/product_132_82.html) can be connected to a device running Tasmota. Configure the GPIO connected to Data pin on the RF receiver as 'RFrecv (106)'. 

If you have an RF receiver configured, a message will be logged each time an RF code is seen. RF driver will try to decode it against all protocols supported by rc-switch library.   

When Tasmota receives an RF message, the data portion of the payload has the same format as the [`RFSend`](Commands#rfsend) JSON parameters.

```
"RfReceived":{"Data":"<hex-value>","Bits":<value>,"Protocol":<value>,"Pulse":<value>}
```

This JSON payload data can be used in a rule such as:

```
ON RfReceived#Data=<hex-value> DO <command> ENDON
```

Examples:  
**Sonoff RM433 Remote**  
`MQT: tele/tasmota/RESULT = {"Time":"2020-05-27T18:59:06","RfReceived":{"Data":"0x7028D2","Bits":24,"Protocol":1,"Pulse":238}}`
