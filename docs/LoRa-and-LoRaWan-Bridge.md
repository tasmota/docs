# LoRa and LoRaWan Bridge

??? tip "This feature is included only in `tasmota32` binaries" 

    When [compiling your build](Compile-your-build) add the following to `user_config_override.h`:
    ```c++
    #ifndef USE_SPI 
    #define USE_SPI                 // Add support for SPI
    #endif
    #define USE_SPI_LORA            // Add support for LoRaSend and LoRaCommand (+4k code)
    #define USE_LORA_SX126X         // Add driver support for LoRa on SX126x based devices like LiliGo T3S3 Lora32 (+16k code)
    #define USE_LORA_SX127X         // Add driver support for LoRa on SX127x based devices like M5Stack LoRa868, RFM95W (+5k code)
    #define USE_LORAWAN_BRIDGE      // Add support for LoRaWan bridge (+8k code)
    ```

The LoRa feature can be used to add a RF communication channel between two or more devices. The LoRaWan Bridge feature can be used to receive information from any joined LoRaWan device.

Both features use dedicated hardware supporting the LoRa protocol. Tasmota provides support for two different Semtech drivers used in most LoRa devices today: SX127x and newer SX126x.

Some devices using SX127x are:

- HopeRF RFM95W, RFM96W and RFM98W
- LilyGo TTGO T3 LoRa32 868MHz ESP32 (SX1276)
- LilyGo TTGO T-Higrow 868MHz (SX1276)
- DFRobot FireBeetle Covers LoRa Radio 868MHz (SX1276) or 434MHz (SX1278)
- M5Stack LoRa868 (uses AI-01 whith SX1276)
- Modtronix
 
Some devices using SX126x are:

- LilyGo T3S3 LoRa32 868MHz ESP32S3 (SX1262)
- LilyGo TTGO T-Weigh ESP32 LoRa 868MHz HX711 (SX1262)
- Heltec (CubeCell) (SX1262)
- Waveshare SX1262 Lora Node (HF) and (LF)

## LoRa commands

* `LoRaConfig`: show current configuration.
* `LoRaConfig 1`: set default LoRa configuration.
* `LoRaConfig 2`: set default LoRaWan configuration.
* `LoRaConfig {"Frequency":868.0,"Bandwidth":125.0}`: changes frequency and bandwidth. Other parameters can be changed using the same JSON parameter layout.
* `LoRaSend`: disable hexadecimal and switch to text decoding.
* `LoRaSend <string>`: send appending `\n` (newline).
* `LoRaSend1 <string>`: send appending `\n` (newline).
* `LoRaSend2 <string>`: send.
* `LoRaSend3 <string>`: replace escape characters and send.
* `LoRaSend4 <string>`: send as binary. Data in response messages is encoded as binary strings.
* `LoRaSend5 <string>`: send as hex. Data in response messages is encoded as hex strings.
* `LoRaSend6 <string>`: send as comma-delimited string of decimal numbers.
* `LoRaSend15 <string>`: send as hex with inverted IQ. Data in response messages is encoded as hex strings.
* `LoRaOption4 1`: enable reception of `LoRaCommand` commands. No security, anyone in range can send any command.
* `LoRaCommand <topic_of_lora_receiver> <command>`: send command to device with MQTT topic.

## LoRaWan commands

* `LoRaWanBridge 1`: enable LoRaWan bridge.
* `LoRaWanBridge 0`: disable LoRaWan bridge.
* `LoRaOption3 1`: enable LoRaWan decoding of received data from Dragino LDS01 and MerryIoT DW10.
* `SetOption100 1`: remove LwReceived form JSON message.
* `SetOption118 1`: move LwReceived from JSON message and into the subtopic replacing "SENSOR" default.
* `SetOption119 1`: remove the device addr from json payload, can be used with LoRaWanName where the addr is already known from the topic.
* `SetOption144 1`: include time in `LwReceived` messages like other sensors.
* `LoRaWanAppKey<x> <32_character_app_key>`: set known appkey of LoRaWan device or node to be joined.
* `LoRaWanName<x> <string>`: set friendly name for device or node.
* `LoRaWanDecoder<x> <string>`: set name of decoder file. See [LoRaWan-Decoders](LoRaWan-Decoders).

## Configuration

First assign SPI GPIOs to `SPI MISO`, `SPI MOSI`, `SPI CLK`, `LoRa CS` and `LoRa Rst` types in the "Configure Module" page. In addition assign sx127x specific GPIO to `LoRa DIO0` or sx126x specific GPIOs to 
`LoRa Busy` and `LoRa DIO1`.

## LoRaWan bridge

The goal of the LoRaWan bridge is to provide local communication with off-the-shelf LoRaWan devices. So no LoRaWan gateway, network- and application server and cloud service like `The Thing Network` or `Helium Network` is needed. The bridge will provide MQTT JSON response like 

``` json
{"LwReceived":{"LDS01":{"Node":1,"Device":"0x4AD6","Name":"LDS01","RSSI":-49.0,"SNR":9.8,"Events":2,"LastEvent":0,"DoorOpen":1,"Alarm":0,"Battery":3.006}}}
```

or if decoding is disabled using command ``LoRaOption3 0`` or no hardcoded device (LDS01 or DW10)

``` json
{"LwReceived":{"LDS01":{"Node":1,"Device":"0x4AD6","Name":"LDS01","RSSI":-49.0,"SNR":9.5,"DevEUIh":"A840410E","DevEUIl":"71894AD6","FPort":10,"Payload":[11,196,1,0,0,2,0,0,19,0]}}}
```

### Information

The LoRaWan Bridge can communicate with LoRaWan devices supporting single channel mode and/or Adaptive Data Rate (ADR).

End-Device activation is supported via Over-The-Air-Activation (OTAA). Activation By Personalization (ABP) is not supported. The bridge currently supports maximum four devices.

The functionality of the bridge has been tested using Dragino LDS01 and a MerryIoT DW10 devices on 868MHz. 

### Example of OTAA

For OTAA the LoRaWan AppKey, provided with the device, needs to be known by the LoRaWan bridge. In case of MerryIoT, default configured for `Helium Network`, I received the AppKey as a response to my e-mail to their support office.

``` json
11:41:06.111 CMD: LoRaWanAppKey1 11F81EAEB17EE9043E5884BB98EFC9D6
11:41:06.113 SRC: WebConsole from 192.168.2.1
11:41:06.114 CMD: Grp 0, Cmd 'LORAWANAPPKEY', Idx 1, Len 32, Pld 11, Data '11F81EAEB17EE9043E5884BB98EFC9D6'
11:41:06.131 MQT: stat/core2/RESULT = {"LoRaWanAppKey1":"11F81EAEB17EE9043E5884BB98EFC9D6"}
```

Initiate the OTAA process on the device either by pressing a button or replacing it's batteries and wait for the bridge to receive it's request. This can take several minutes as the device cycles through several Frequencies and Spreadingsfactors.

``` json
11:42:13.772 LOR: JoinEUI 07010000004140A8, DevEUIh A840410E, DevEUIl 71894AD6, DevNonce F45F, MIC 3B3EE35E
11:42:14.719 CFG: Lora saved to file
11:42:19.441 MQT: tele/core2/SENSOR = {"LwReceived":{"0x4AD6":{"Node":1,"Device":"0x4AD6","RSSI":-50.0,"SNR":12.0,"Events":0,"LastEvent":0,"DoorOpen":1,"Alarm":0,"Battery":3.000}}}
11:42:21.216 CFG: Lora saved to file
```

Now is a good time to give the device a friendlyname.

``` json
11:46:55.067 CMD: LoRaWanName1 LDS01
11:46:55.069 SRC: WebConsole from 192.168.2.1
11:46:55.070 CMD: Grp 0, Cmd 'LORAWANNAME', Idx 1, Len 5, Pld -99, Data 'LDS01'
11:46:55.086 MQT: stat/core2/RESULT = {"LoRaWanName1":"LDS01"}
11:46:56.829 CFG: Lora saved to file
```

## Resources

[LoRaWan specification v1.0.2](https://resources.lora-alliance.org/technical-specifications/lorawan-specification-v1-0-2)

