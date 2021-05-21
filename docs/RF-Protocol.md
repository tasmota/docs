!!! info "This feature is included only in tasmota-sensors.bin" 

Otherwise you must [compile your build](Compile-your-build.md). Add the following to `user_config_override.h`:
```
#ifndef USE_RC_SWITCH
#define USE_RC_SWITCH         // Add support for RF transceiver using library RcSwitch (+2k7 code, 460 iram)
#endif
```
----

!!! warning "This guide does not apply to [Sonoff RF Bridge](devices/Sonoff-RF-Bridge-433.md) specific commands"

Tasmota uses the [rc-switch library](https://github.com/sui77/rc-switch/) to decode RF codes. Supported hardware depends on rc-switch library support only.

## Sending RF Codes
Send an RF control code as a decimal or hexadecimal string in a JSON payload. An inexpensive RF receiver such as a [STX882](https://www.nicerf.com/productslist_119_stx882.html) can be connected to a device running Tasmota. In order to send RF data you need to _**configure the connected GPIO as `RFSend (105)`**_  

Command|Parameters
:---|:---
RFsend<a id="rfsend"></a>|`<value>` = code decimal or JSON. Data value is required and can be decimal or hexadecimal (using the 0x prefix), other values are optional.<BR><BR>_JSON_<BR>`{"Data":"<value>","Bits":<value>,"Protocol":<value>,"Pulse":<value>}`<BR>`"Data":"<value>"` = hexadecimal code<BR>`"Bits":<value>` = required number of data bits _(default = `24`)_<BR>`"Protocol":<value>` = protocol number _(default = `1`)_<BR>`"Repeat":<value>` = repeat value _(default = `10`)_<BR>`"Pulse":<value>` = pulse value _(`350` = default for protocol 1)_<BR>&emsp;e.g., `RFsend {"Data":"0x7028DC","Bits":24,"Protocol":1,"Pulse":238}`<BR><BR>_Decimal_<BR>`data, bits, protocol, repeat, pulse` <BR>&emsp;e.g., `RFsend 7350492, 24, 1, 10, 238` or `RFsend 0x7028DC, 24, 1, 10, 238`

If you send only the "Data" value in decimal or hexadecimal other values will be sent as default.

!!! example
    `RfSend 123456`

    will be sent as `{"Data":"0x1E240","Bits":24,"Protocol":1,"Pulse":351}`

When sending decimal formatted command you need to follow the pattern otherwise a part of the command will be ignored. 

!!! example
    `RfSend 123456, 24, 1, 238` is missing the `repeat` value so the last number intended as pulse value won't be sent

## Receiving RF Codes
An inexpensive RF receiver such as a [SRX882](https://www.nicerf.com/product_132_82.html) can be connected to a device running Tasmota. Configure the GPIO connected to Data pin on the RF receiver as 'RFrecv (106)'. 
<br>Once you have identified the protocols that you want to receive data on , you can enable only those protocols . 
<br>The RfProtocol command will only work if you have set a pin function to rfrecv

Command|Parameters
:---|:---
RfProtocol<a id="RfProtocol"></a> `<value>`|`<value>` 0 .. 0x7FFFFFFFF  or 'A' for All :: This Sets the Enabled Protocol Mask Value
RfProtocol`<idx> <value>`|`<idx>` 1 .. 35 `<value>` 0 or 1 :: This Disables or Enables a Specific Protocol

!!! example
	`RfProtocol 5`
	<br> &nbsp; &nbsp; &nbsp; will enable only protocols 1 & 3 &nbsp; &nbsp; &nbsp; `stat/tasmota_D728A8/RESULT {"RfProtocol":"1,3"}`<br>
	`RfProtocol27 1`
	<br> &nbsp; &nbsp; &nbsp; will enable protocol 27 &nbsp; &nbsp; &nbsp; `stat/tasmota_D728A8/RESULT {"RfProtocol":"1,3,27"}`<br>
	`RfProtocol 0`
	<br> &nbsp; &nbsp; &nbsp;`stat/tasmota_D728A8/RESULT {"RfProtocol":"None Enabled"}`<br>
	`RfProtocol a`
	<br> &nbsp; &nbsp; &nbsp;`stat/tasmota_D728A8/RESULT {"RfProtocol":"1,2,3,4,5,6,7,8,9,10,11,12,`
	<br> &nbsp; &nbsp; &nbsp;`13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35"}`<br>

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
