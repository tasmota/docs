# LoRaWan Decoders

LoRaWan end devices transmit packets containing raw _Payload Data_. The Tasmota _LoRaWan Bridge_ feature normally passes the raw _Payload Data_ onto an MQTT server.
```
{
  "LwReceived": {
    "0xAE3D": {
      "Node": 1,
      "Device": "0xAE3D",
      "RSSI": -14,
      "SNR": 8.8,
      "Decoder": "LHT52",
      "DevEUIh": "A840414E",
      "DevEUIl": "4F5CAE3D",
      "FPort": 2,
      "Payload": [9,230,2,48,127,255,1,104,33,178,172]
    }
  }
}
``` 

## Adding Payload Data Decoding
There are no industry standards on the format or content of the raw data send by each sensor; every manufacturer/device is different. There are public databases of decoder scripts for many devices; e.g. [TTN decoder script database](https://github.com/TheThingsNetwork/lorawan-devices/tree/master/vendor)

The _Tasmota LoRaWAN Decoder_ feature:
 - is optional  
 - is implemented in [Berry](https://tasmota.github.io/docs/Berry/)
 - does not require any custom builds
 - the elements are:
    - a Berry script `LwDecode.be` that:
       - subscribes to the tele/xxxx/SENSOR MQTT messages, looking for the `LwReceived` packets sent by the _Tasmota LoRaWAN Bridge_.
       - dynamically loads (once only) _Device Decoder Files_ from the Tasmota file system, if they exist.
       - asks a _Device Decoder File_ to decode the raw _Data Payload_ 
	   - reports the result via MQTT
	- Device Decoder Files:
      - are written in Berry
      - closely modelled on the [TTN decoder script database](https://github.com/TheThingsNetwork/lorawan-devices/tree/master/vendor).

### Example LwDecoded MQTT message
```
{
  "LwDecoded": {
    "0xAE3D": {
      "TempC_Internal": 25.34,
      "Ext_SensorType": 1,
      "Systimestamp": 1747038892,
      "Device": "Dragino LHT52",
      "Ext_SensorConnected": false,
      "Hum_Internal": 56
    }
  }
}
```
 
## Files
These files are available from the [Tasmota Github Repository](
https://github.com/arendst/Tasmota/tree/master/tasmota/berry/lorawan/decoders)

- [LwDecoder.be](https://github.com/arendst/Tasmota/tree/master/tasmota/berrylorawan/decoders/LwDecoder.be)
- [Device Decoder Files](https://github.com/arendst/Tasmota/tree/master/tasmota/berry/lorawan/decoders/vendors) (indexed by Vendor/Model)


## How to use the Device Decoder feature
 1. Download to your local PC, then upload to the Tasmota File System 
    - [LwDecode.be](https://github.com/arendst/Tasmota/tree/master/tasmota/berry/lorawan/decoders/LwDecode.be)
    - the _Device Decoder File(s)_ for your _End Device(s)_, or write your own (see below)
 3. Add this line to `autoexec.be` in the Tasmota File System (create if necessary)   
 `load("LwDecode.be")`
 4. Execute these Tasmota Console commands:
    - `LoRaWanAppKey<x> yyyyyyyy`  
   where `<x>` is the Tasmota LoRaWAN node number. Joins an End Device to the LoRaWan Bridge. See <a href="https://tasmota.github.io/docs/LoRa-and-LoRaWan-Bridge/#lorawan-commands" target="_blank">LoRaWan Commands</a>.
    - `LoRaWanDecoder<x> <decoderfile>` where `<x>` is the Tasmota LoRaWan node number. Sets the name of the _Decoder File_ for each end device.  
	e.g.  `LoRaWanDecoder1 LHT52` associates node 1 with the `LHT52.be` decoder file
    - `BrRestart` to restart Berry  
 
## Write your own Device Decoder file ##
1. Find the JavaScript (*.js) decoder file for your device from [TTN Device Decoder database](https://github.com/TheThingsNetwork/lorawan-devices/tree/master/vendor)  
Alternatively, find the manufacturer's datasheet/User Guide/User Manual/etc. to learn the syntax of the _Raw Data Payload_
2. Edit [LwDecoderSample.be](https://github.com/arendst/Tasmota/tree/master/tasmota/berry/lorawan/decoders/LwDecoderSample.be) to decode the _Raw Data Payload_
3. Rename `LwDecoderSample.be`  to `<DeviceName>.be` where `<DeviceName>` matches your device name.
4. Copy `<DeviceName>.be` to the _Tasmota File System_.
5. Test
	- `load("<DeviceName>.be")` from the Berry Scripting Console, looking for any reported errors.
        - Execute this Tasmota console command: `LoRaWanDecoder<x> <DeviceName>` 	
	- Wait for your device to send raw Data Payloads to your Tasmota installation, and confirm `LwDecoded` MQTT messages are received, and the values are correct: 

6. Submit a [PR](https://github.com/arendst/Tasmota/pulls) to share your new decoder with the Tasmota community.
 

