# "Complete" IR Remote Protocols
The default Tasmota firmware variants include support for IR send/receive for a limited set of protocols (see [IR Remote](Commands#ir-remote)). Tasmota uses the [IRremoteESP8266 library](https://github.com/crankyoldgit/IRremoteESP8266) that supports numerous protocols. Each protocol consumes some program memory, especially air conditioner protocols (up to 81k of flash size). Also, every protocol included increases the time to decode the IR signal. 

There are now two additional Tasmota firmware variants that provide almost all IRremoteESP8266 protocols. This requires disabling some other features to keep code size manageable.  
- `sonoff-ir` is pre-packaged for IR blasters, like [Eachen IR Bridge](https://blakadder.github.io/templates/eachen_SANT-IR_01.html) or [YTF IR Bridge](https://blakadder.github.io/templates/ytf_ir_bridge.html). Choose `sonoff-ir` if you are using an IR blaster.  
- `sonoff-ircustom` is used if you want to customize your features (additional sensors, language, etc.). This variant is required because it triggers a special compilation flag for IRremoteESP8266. Edit the [`IRremoteESP8266.h`](../tree/development/lib/) header in the `IRremoteESP8266-x.x.x/src` folder to disable (i.e., set to `false`) any unneeded/unwanted protocols. Then [compile your own firmware](installation/Flashing#compiling-from-source).

Once you have the Tasmota IR firmware file you need, [flash it](installation/Flashing) on your device using the usual method.  

You can test that you have the correct firmware on your device by performing the following command in the web UI Console: `IRhvac {"Vendor":"xx"}`. The output should be a list of the supported protocols/vendors. For example:  
```
RESULT = {"IRHVAC":"Wrong Vendor (COOLIX|DAIKIN|KELVINATOR|MITSUBISHI_AC|GREE|ARGO|TROTEC|TOSHIBA_AC|FUJITSU_AC|MIDEA|HAIER_AC|HITACHI_AC|HAIER_AC_YRW02|WHIRLPOOL_AC|SAMSUNG_AC|ELECTRA_AC|PANASONIC_AC|DAIKIN2|VESTEL_AC|TECO|TCL112AC|MITSUBISHI_HEAVY_88|MITSUBISHI_HEAVY_152|DAIKIN216|SHARP_AC|GOODWEATHER|DAIKIN160|NEOCLIMA|DAIKIN176|DAIKIN128|AMCOR)"}
```

## Sending IR Commands
Send an IR remote control code as a decimal or hexadecimal string in a JSON payload. In order to send IR data, _**you must configure one of the free device GPIO as `IRsend (8)`. Neither GPIO01 nor GPIO03 can be used.**_  

Command|Parameters
:---|:---
IRsend`<x>`<a id="IRsend"></a>|`<x>` [_optional_] = number of times the IR message is sent. If not specified or `0..1`, the message is sent only once (i.e., not repeated) _(default)_<BR>`>1` = emulate a long-press on the remote control, sending the message `<x>` times, or sending a repeat message for specific protocols (like NEC)<BR><BR>`{"Protocol":"<value>","Bits":<value>,"Data":<value>,"DataLSB":<value>,"Repeat":<value>}`<BR><BR>`"Protocol"` or `"Vendor"` (select one of the following): <BR>`RC5, RC6, NEC, SONY, PANASONIC, JVC, SAMSUNG, WHYNTER, AIWA_RC_T501, LG, MITSUBISHI, DISH, SHARP, DENON, SHERWOOD, RCMM, SANYO_LC7461, RC5X, NEC (non-strict), NIKAI, MAGIQUEST, LASERTAG, CARRIER_AC, MITSUBISHI2, HITACHI_AC1, HITACHI_AC2, GICABLE, LUTRON, PIONEER, LG2, SAMSUNG36, LEGOPF, INAX, DAIKIN152`<BR><BR>`"Bits":1..64` = required number of data bits<BR>&nbsp;&nbsp;&nbsp;&nbsp;for PANASONIC protocol this parameter is the the address, not the number of bits<BR><BR>`"Data":0x1..0xFFFFFFFFFFFFFFFF` = data frame as 64 bit hexadecimal.<BR>&nbsp;&nbsp;&nbsp;&nbsp;e.g., `IRsend {"Protocol":"NEC","Bits":32,"Data":0x8166817E}`<BR>**Or**<BR>`"DataLSB":0x1..0xFFFFFFFFFFFFFFFF` = data frame as 64 bit hexadecimal with LSB (each byte with bits reversed).<BR>&nbsp;&nbsp;&nbsp;&nbsp;e.g., `IRsend {"Protocol":"NEC","Bits":32,"Data":0x8166817E}`<BR>`DataLSB` comes handy with LSB-first (Least Significant Bit First) protocols like NEC, and makes decoding/encoding easier.<BR><BR>`"Repeat":0..<x>` if `0` send the frame once, if `>0` simulates a long press; Note: `"Repeat":1` sends the message twice.<BR><BR>Alternatively, you can send IR remote control codes using [RAW command encoding](IRSend-RAW-Encoding).
|See also|[`SetOption29`](Commands#SetOption29)  - Set IR received data format<BR>[`SetOption38`](Commands#SetOption38)  - Set IR received protocol sensitivity<BR>[`SetOption58`](Commands#SetOption58) - [IR Raw data in JSON payload](https://github.com/arendst/Tasmota/issues/2116#issuecomment-440716483)

## Sending IRHVAC Commands

Command|Parameters
:---|:---
IRhvac<a id="IRhvac"></a>|Send HVAC IR remote control code as JSON payload<BR><BR>```IRhvac {"Vendor":"Mitsubishi_Heavy_152", "Power":"On","Mode":"Hot","FanSpeed":3,"Temp":22.5}```<BR><BR>`"Protocol"` or `"Vendor"` (select one of the following): <BR>`COOLIX, DAIKIN, KELVINATOR, MITSUBISHI_AC, GREE, ARGO, TROTEC, TOSHIBA_AC, FUJITSU_AC, MIDEA, HAIER_AC, HITACHI_AC, HAIER_AC_YRW02, WHIRLPOOL_AC, SAMSUNG_AC, ELECTRA_AC, PANASONIC_AC, DAIKIN2, VESTEL_AC, TECO, TCL112AC, MITSUBISHI_HEAVY_88, MITSUBISHI_HEAVY_152, DAIKIN216, SHARP_AC, GOODWEATHER, DAIKIN160, NEOCLIMA, DAIKIN176, DAIKIN128`<BR><BR>`"Model":` Some HVAC have variants in protocols, this field allows to specify the variant, see [detailed list](https://github.com/crankyoldgit/IRremoteESP8266/blob/master/SupportedProtocols.md).<BR><UL><LI>`Fujitsu_AC`: `ARRAH2E\|ARDB1`</LI><LI>`Panasonic_AC`: `LKE\|NKE\|DKE\|JKE\|CKP\|RKR`</LI><LI>`Whirlpool_AC`: `DG11J13A\|DG11J104\|DG11J1-04\|DG11J191`</LI></UL>`"Power"`:<UL><LI>`On, Yes, True, 1`</LI><LI>`Off, No, False, 0`</LI></UL>`"Mode"`:<UL><LI>`Off, Stop`</LI><LI>`Auto, Automatic`</LI><LI>`Cool, Cooling`</LI><LI>`Heat, Heating`</LI><LI>`Dry, Drying, Dehumidify`</LI><LI>`Fan, Fanonly, Fan_Only`</LI></UL>`"FanSpeed"`:<UL><LI>`Auto, Automatic`</LI><LI>`Min, Minimum, Lowest, 1`</LI><LI>`Low, 2`</LI><LI>`Med, Medium, Mid, 3`</LI><LI>`High, Hi, 4`</LI><LI>`Max, Maximum, Highest, 5`</LI></UL>`"SwingV"`: vertical swing of Fan<UL><LI>`Auto, Automatic, On, Swing`</LI><LI>`Off, Stop`</LI><LI>`Min, Minimum, Lowest, Bottom, Down`</LI><LI>`Low`</LI><LI>`Mid, Middle, Med, Medium, Centre, Center`</LI><LI>`High, Hi`</LI><LI>`Highest, Max, Maximum, Top, Up`</LI></UL>`"SwingH"`: horizontal swing of Fan<UL><LI>`Auto, Automatic, On, Swing`</LI><LI>`Off, Stop`</LI><LI>`LeftMax, Left Max, MaxLeft, Max Left, FarLeft, Far Left`</LI><LI>`Left`</LI><LI>`Mid, Middle, Med, Medium, Centre, Center`</LI><LI>`Right`</LI><LI>`RightMax, Right Max, MaxRight, Max Right, FarRight, Far Right`</LI><LI>`Wide`</LI></UL>`"Celsius"`: temperature is in Celsius (`"On"`) of Farenheit (`"Off"`)<BR>`"Temp"`: Temperature, can be float if supported by protocol<BR>`"Quiet"`: Quiet mode (`"On"` / `"Off"`)<BR>`"Turbo"`: Turbo mode (`"On"` / `"Off"`)<BR>`"Econo"`: Econo mode (`"On"` / `"Off"`)<BR>`"Light"`: Light (`"On"` / `"Off"`)<BR>`"Filter"`: Filter active (`"On"` / `"Off"`)<BR>`"Clean"`: Clean mode (`"On"` / `"Off"`)<BR>`"Beep"`: Beep active (`"On"` / `"Off"`)<BR>`"Sleep"`: Timer in seconds

## Receiving IR Commands
If you have an IR receiver, a message will be logged each time an IR message is seen. `IRremoteESP8266` will try to decode the message against all supported protocols. If unrecognized, the `"Protocol":"UNKNOWN"` will be shown. In this case, the `"Data"` field contains a hash of the received message. The hash can't be used to send the a message, but the same hash will be produced by the same message.  

An inexpensive IR sensor such as a [TSOP1838](https://hobbyking.com/en_us/keyes-tsop1838-infra-red-37-9khz-receiver-for-arduino.html) can be connected to a device running Tasmota. Configure a free device GPIO as 'IRrecv (51)'. When Tasmota receives an IR message, the data portion of the payload has the same format as the [`IRsend`](Commands#irsend) parameter.

    {"IrReceived":{"Protocol":"<value>","Bits":<value>,"Data":<value>}}

This JSON payload data can be used in a rule such as:

    ON IrReceived#Data=<value> DO <command> ENDON

If the data is received on an unknown protocol, `setoption58 1`  See [here](https://github.com/arendst/Tasmota/issues/2116#issuecomment-440716483).

Examples:  
**Pioneer Vol+**  
`MQT: tele/tasmota/IR1/RESULT = {"IrReceived":{"Protocol":"PIONEER","Bits":64,"Data":"0xA55A50AFA55A50AF","DataLSB":"0xA55A0AF5A55A0AF5","Repeat":0}}`

**Pioneer Vol-**  
`tele/tasmota/IR1/RESULT = {"IrReceived":{"Protocol":"PIONEER","Bits":64,"Data":"0xA55AD02FA55AD02F","DataLSB":"0xA55A0BF4A55A0BF4","Repeat":0}}`

Toshiba (NEC): **Channel 1**  
`MQT: tele/tasmota/IR1/RESULT = {"IrReceived":{"Protocol":"NEC","Bits":32,"Data":"0x02FD807F","DataLSB":"0x40BF01FE","Repeat":0}}`

Toshiba (NEC): **Channel 2**  
`MQT: tele/tasmota/IR1/RESULT = {"IrReceived":{"Protocol":"NEC","Bits":32,"Data":"0x02FD40BF","DataLSB":"0x40BF02FD","Repeat":0}}`

Toshiba (NEC): **Channel 3**  
`MQT: tele/tasmota/IR1/RESULT = {"IrReceived":{"Protocol":"NEC","Bits":32,"Data":"0x02FDC03F","DataLSB":"0x40BF03FC","Repeat":0}}`

As you can see above, `"DataLSB"` are easier to decode than `"Data"`. The third byte contains the command, and the fourth byte is the third with all bits reversed.

Example of HVAC message:  
`MQT: tele/tasmota/IR1/RESULT = {"IrReceived":{"Protocol":"MITSUBISHI_HEAVY_152","Bits":152,"Data":"0xAD513CE51A08F705FA02FDC03F08F700FF807F","Repeat":0,"IRHVAC":{"Vendor":"MITSUBISHI_HEAVY_152","Model":-1,"Power":"on","Mode":"auto","Celsius":"on","Temp":22,"FanSpeed":"medium","SwingV":"off","SwingH":"off","Quiet":"off","Turbo":"off","Econo":"off","Light":"off","Filter":"off","Clean":"off","Beep":"off","Sleep":-1}}}`

`MQT: tele/tasmota/IR1/RESULT = {"IrReceived":{"Protocol":"COOLIX","Bits":24,"Data":"0xB25F78","DataLSB":"0x4DFA1E","Repeat":0,"IRHVAC":{"Vendor":"COOLIX","Model":-1,"Power":"on","Mode":"auto","Celsius":"on","Temp":22,"FanSpeed":"medium","SwingV":"off","SwingH":"off","Quiet":"off","Turbo":"off","Econo":"off","Light":"on","Filter":"off","Clean":"on","Beep":"off","Sleep":-1}}}`

`RSL: RESULT = {"Time":"2019-09-09T21:52:35","IrReceived":{"Protocol":"PANASONIC_AC","Bits":216,"Data":"0x0220E004000000060220E00400032C805F06000EE0000081000089","Repeat":0,"IRHVAC":{"Vendor":"PANASONIC_AC","Model":2,"Power":"on","Mode":"auto","Celsius":"on","Temp":22,"FanSpeed":"medium","SwingV":"auto","SwingH":"middle","Quiet":"off","Turbo":"off","Econo":"off","Light":"off","Filter":"off","Clean":"off","Beep":"off","Sleep":-1}}}`
