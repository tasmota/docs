# Modbus Bridge

Needs `#define USE_MODBUS_BRIDGE` or `#define USE_MODBUS_BRIDGE_TCP`. 

Important: If you're building the modbus tcp bridge you have to define both defines.

This is not available in any builds but you can [compile your own build](Compile-your-build).

This feature can be used to add a "modbus bridge" functionality to a device that is otherwise serial modbus RTU only. You connect the device to a ESP8266/ESP32 and Tasmota will create a bridge to the modbus network.

In most cases you'll need an RS485 converter like this:<BR>
![rs485 converter](https://user-images.githubusercontent.com/2833940/179932126-df473fcb-8de3-488d-b200-f57dc76db198.png)

## Introduction
The Modbus Bridge modules features 2 kind of bridges. 
  
USE_MODBUS_BRIDGE : The bridge can be used by commands in the console and via MQTT messages.<BR>
USE_MODBUS_BRIDGE_TCP : The bridge can be used by commands in the console and via MQTT messages but also as Modbus TCP/IP bridge

## Commands

Command|Parameters
:---|:---
ModbusSend|Sending a message to the modbus network as JSON payload.<BR><BR>```{"deviceAddress":<value>, "functionCode":<value>, "startAddress":<value>, "type":"<value>","count":<value>}```<BR><BR>`"deviceAddress":1..255` = device address from the modbus slave.<BR><BR>`"functioncode":1..6 or 15..16` = function code to send to the modbus slave (see table below).<BR><BR>`"startaddress":1..65535` address of the first register to read.<BR><BR>`"type":"<value>"` Gives the type of the returned data (see table below). <BR><BR>`"count":1..n` the number of values to be requested.
|ModbusBaudrate|Sets the baudrate for serial (only 8N1 mode), min 1200, max 115200 by 1200 increments.
|ModbusSerialConfig|Set serial protocol using data/parity/stop conventional notation (example: 8N1 or 702)<BR>0..23 = set serial protocol (3 equals 8N1)
  
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
ModbusTcpStart| Start the modbus tcp bridge on the specified ```tcp port```
|ModbusTcpConnect| Connect to a remote modbus tcp server on ```ip address``` and ```remote tcp port```
  
## Returned Data
{"ModbusReceived":{"DeviceAddress":<value>,"FunctionCode":<value>,"StartAddress":<value>,"Length":<value>,"Count":<value>,"Values":[value1,value2,value3,valueN]}}

In raw mode, only the data is returned, no other fields.
  
## Error Codes
There are 2 types of errors, errors from the tasmotamodbus driver and errors from this modbusbridge module.

### Module Errors
Errors from this modbus bridge module can be recognized by "MBS: MBR Send error" or "MBS: MBR Recv error" at the start of the errormessage.
  
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
Errors from the tasmotamodbus driver can be recognized by "MBS: MBR Driver error"

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

## Configuration

First assign two GPIOs to `ModBR Tx` and `ModBR Rx` types in the "Configure Module" page. The Rx/Tx are relative to the ESP device. For example with ESP01's hardware serial, set GPIO1 as
ModBR Tx and GPIO3 as ModBR Rx.

Then set baud rate with `ModbusSetBaudRate` (default is 9600).

## Examples
Requesting 4 holding registers starting from register 1 from slave address 1:<BR>
MODBUSSEND  {"deviceaddress": 1, "functioncode": 3, "startaddress": 1, "type":"uint16", "count":4}<BR>
RSL: RESULT = {"ModbusSend":"Done"}<BR>
RSL: RESULT = {"ModbusReceived":{"DeviceAddress":1,"FunctionCode":3,"StartAddress":1,"Length":13,"Count":4,"Values":[65282,65028,65280,65024]}}<BR>

Set coil register 1 of slaveaddress 1 to ON:<BR>
MODBUSSEND {"deviceaddress": 1, "functioncode": 5, "startaddress": 1, "type":"bit", "count":1, "values":[1]}<BR>
RSL: RESULT = {"ModbusSend":"Done"}<BR>
RSL: RESULT = {"ModbusReceived":{"DeviceAddress":1,"FunctionCode":5,"StartAddress":1,"Length":8,"Count":1,"Values":[255]}}<BR>

Setting multiple coils starting from coil register 1 from slave address 1:<BR>
MODBUSSEND '{"deviceaddress": 1, "functioncode": 15, "startaddress": 1, "type":"bit", "count":8, "values":[1,0,0,1,1,1,0,0]}<BR>
RSL: RESULT = {"ModbusSend":"Done"}<BR>
RSL: RESULT = {"ModbusReceived":{"DeviceAddress":1,"FunctionCode":15,"StartAddress":1,"Length":8,"Count":1}}<BR>

## Additional resources
  
[PR](https://github.com/arendst/Tasmota/pull/16014)<BR>
[Modbus Protocol](https://en.wikipedia.org/wiki/Modbus)<BR>
[More modbus information](https://www.modbustools.com/modbus.html)
