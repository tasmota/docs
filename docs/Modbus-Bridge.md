# Modbus Bridge

!!! info "This feature is only included in `tasmota32` binary"  

!!! tip "To use it you must [compile your build](Compile-your-build). Add the following to `user_config_override.h`:"
    ```c++
    #ifndef USE_MODBUS_BRIDGE
    #define USE_MODBUS_BRIDGE       // Add support for software Modbus Bridge (+3k code)
    #define USE_MODBUS_BRIDGE_TCP   // Add support for software Modbus TCP Bridge (Must also enable USE_MODBUS_BRIDGE)
    #endif
    ```

This feature can be used to add a "Modbus bridge" functionality to a device that is otherwise serial Modbus RTU only. You connect the device to a ESP8266/ESP32 and Tasmota will create a bridge to the Modbus network.

In most cases you'll need an RS485 converter like this:

![rs485 converter](https://user-images.githubusercontent.com/2833940/179932126-df473fcb-8de3-488d-b200-f57dc76db198.png)

## Introduction
The Modbus Bridge modules features 2 kind of bridges. 
  
`USE_MODBUS_BRIDGE`: The bridge can be used by commands in the console and via MQTT messages.    
`USE_MODBUS_BRIDGE_TCP`: The bridge can be used by commands in the console and via MQTT messages but also as Modbus TCP/IP bridge

## Configuration

First assign two GPIOs to `ModBR Tx` and `ModBR Rx` in the "Configure Module" page. The Rx/Tx are relative to the ESP device. For example with ESP-12's hardware serial, set GPIO1 as ModBR Tx and GPIO3 as ModBR Rx.

Then set baud rate with `ModbusSetBaudRate` (default is 9600).

## Commands

Command|Parameters
:---|:---
ModbusSend|Sending a message to the Modbus network as JSON payload.<BR>```{"deviceAddress":<value>, "functionCode":<value>, "startAddress":<value>, "type":"<value>","count":<value>}```<BR>&emsp;&emsp;`"deviceAddress":1..255` = device address from the Modbus slave.<BR>&emsp;&emsp;`"functioncode":1..6 or 15..16` = function code to send to the Modbus slave (see table below).<BR>&emsp;&emsp;`"startaddress":1..65535` address of the first register to read.<BR>&emsp;&emsp;`"type":"<value>"` Gives the type of the returned data (see table below). <BR>&emsp;&emsp;`"count":1..n` the number of values to be requested.
|ModbusBaudrate| `1200...115200` = set baudrate for serial (only 8N1 mode) in 1200 increments _(default = `9600`)_
|ModbusSerialConfig|Set serial protocol using data/parity/stop conventional notation (example: 8N1 or 702)<BR>`0..23` = set serial protocol (`3` equals 8N1)
  
### FunctionCode
Function Code|Description
:---|:---
1|Read Coils
|2|Read Discrete Inputs
|3|Read Multiple Holding Registers
|4|Read Input Registers
|5|Write Single Coil
|6|Write Single Register
|15|Write Multiple Coils
|16|Write Multiple Registers

  
### Type
Type|Description
:---|:---
raw|Return or send the slave data as a raw values
bit|Return or send the slave data as a bit values
hex|Return or send the slave data as a hex values
|float|Return or send the slave data as floats
|uint8|Return or send the slave data as an 8 bits unsigned int
|uint32|Return or send the slave data as an 32 bits unsigned int
|uint16|Return or send the slave data as an 16 bits unsigned int
|uint32|Return or send the slave data as an 32 bits unsigned int
|int8|Return or send the slave data as an 8 bits signed int
|int16|Return or send the slave data as an 16 bits signed int
|int32|Return or send the slave data as an 32 bits signed int
  
### Additional commands for USE_MODBUS_TCP_BRIDGE
Command|Parameters
:---|:---
ModbusTcpStart| Start the Modbus tcp bridge on the specified `tcp port`
|ModbusTcpConnect| Connect to a remote Modbus tcp server on `ip address` and `remote tcp port`
  
## Returned Data
```json
{"ModbusReceived":{"DeviceAddress":<value>,"FunctionCode":<value>,"StartAddress":<value>,"Length":<value>,"Count":<value>,"Values":[value1,value2,value3,valueN]}}
```

In raw mode, only the data is returned, no other fields.
  
## Error Codes
There are 2 types of errors, errors from the tasmotamodbus driver and errors from this Modbusbridge module.

### Module Errors
Errors from this Modbus bridge module can be recognized by `MBS: MBR Send error` or `MBS: MBR Recv error` at the start of the errormessage.
  
Errorcode|Description
:---|:---
1|nodataexpected
|2|wrongdeviceaddress
|3|wrongfunctioncode
|4|wrongstartaddress
|5|wrongtype
|6|wrongregistercount
|7|wrongcount
|8|tomanydata
  
### Driver Errors  
Errors from the tasmotamodbus driver can be recognized by `MBS: MBR Driver error`

Errorcode|Description
:---|:---
1|Illegal Function
|2|Illegal Data Address
|3|Illegal Data Value
|4|Slave Error
|5|Acknowledge but not finished (no error)
|6|Slave Busy
|7|Not enough minimal data received
|8|Memory Parity error
|9|Crc error
|10|Gateway Path Unavailable
|11|Gateway Target device failed to respond
|12|Wrong register count
|13|Register data not specified

## Example of use
Requesting 4 holding registers starting from register 1 from slave address 

#### Register 1
On command:
```
ModBusSend {"deviceaddress": 1, "functioncode": 3, "startaddress": 1, "type":"uint16", "count":4}`
```

Response:
```json
RSL: RESULT = {"ModbusSend":"Done"}
RSL: RESULT = {"ModbusReceived":{"DeviceAddress":1,"FunctionCode":3,"StartAddress":1,"Length":13,"Count":4,"Values":[65282,65028,65280,65024]}}
```

#### Set coil register 1 of slaveaddress 1 to ON:
On command:
```
ModBusSend {"deviceaddress": 1, "functioncode": 5, "startaddress": 1, "type":"bit", "count":1, "values":[1]}
```
Response:
```json
RSL: RESULT = {"ModbusSend":"Done"}
RSL: RESULT = {"ModbusReceived":{"DeviceAddress":1,"FunctionCode":5,"StartAddress":1,"Length":8,"Count":1,"Values":[255]}}
```

#### Setting multiple coils starting from coil register 1 from slave address 1
On command:
```
ModBusSend '{"deviceaddress": 1, "functioncode": 15, "startaddress": 1, "type":"bit", "count":8, "values":[1,0,0,1,1,1,0,0]}
```
Response:
```json
RSL: RESULT = {"ModbusSend":"Done"}
RSL: RESULT = {"ModbusReceived":{"DeviceAddress":1,"FunctionCode":15,"StartAddress":1,"Length":8,"Count":1}}
```

## Additional resources
  
[Tasmota Pull Request](https://github.com/arendst/Tasmota/pull/16014)    
[Modbus Protocol](https://en.wikipedia.org/wiki/Modbus)    
[More Modbus information](https://www.modbustools.com/modbus.html)
