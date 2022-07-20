# Modbus Bridge

Needs `#define USE_MODBUS_BRIDGE`. This is not available in any builds but you can [compile your own build](Compile-your-build).

This feature can be used to add a "modbus bridge" functionality to a device that is otherwise serial modbus RTU only. You connect the device to a ESP8266/ESP32 and Tasmota will create a bridge to the modbus network.

In most cases you'll need an RS485 converter like this:<BR>
![rs485 converter](https://user-images.githubusercontent.com/2833940/179932126-df473fcb-8de3-488d-b200-f57dc76db198.png)


## Commands

Command|Parameters
:---|:---
ModbusSend|Sending a message to the modbus network as JSON payload.<BR><BR>```{"deviceAddress":<value>, "functionCode":<value>, "startAddress":<value>, "type":"<value>","count":<value>}```<BR><BR>`"deviceAddress":1..255` = device address from the modbus slave.<BR><BR>`"functioncode":1..4` = function code to send to the modbus slave (see table below).<BR><BR>`"startaddress":1..65535` address of the first register to read.<BR><BR>`"type":"<value>"` Gives the type of the returned data (see table below). <BR><BR>`"count":1..n` the number of values to be requested.
|ModbusBaudrate|Sets the baudrate for serial (only 8N1 mode), min 1200, max 115200 by 1200 increments.
|ModbusSerialConfig|Set serial protocol using data/parity/stop conventional notation (example: 8N1 or 702)
0..23 = set serial protocol (3 equals 8N1)

### FunctionCode
Function Code|Description
:---|:---
1|Read Coils
|2|Read Discrete Inputs
|3|Read Multiple Holding Registers
|4|Read Input Registers
  
### Type
Type|Description
:---|:---
raw|Return the slave data as a raw value
|float|Return the slave data as floats
|uint8|Return the slave data as an 8 bits unsigned int
|uint16|Return the slave data as an 16 bits unsigned int
|uint32|Return the slave data as an 32 bits unsigned int
|int8|Return the slave data as an 8 bits signed int
|int16|Return the slave data as an 16 bits signed int
|int32|Return the slave data as an 32 bits signed int
  
## Returned Data
{"ModbusReceived":{"DeviceAddress":<value>,"FunctionCode":<value>,"StartAddress":<value>,"Length":<value>,"Count":<value>,"Values":[value1,value2,value3,valueN]}}

## Configuration

First assign two GPIOs to `ModBR Tx` and `ModBR Rx` types in the "Configure Module" page. The Rx/Tx are relative to the ESP device. For example with ESP01's hardware serial, set GPIO1 as
ModBR Tx and GPIO3 as ModBR Rx.

Then set baud rate with `ModbusSetBaudRate` (default is 9600).

## Example
CMD: modbussend  {"deviceaddress": 1, "functioncode": 3, "startaddress": 1, "type":"uint16", "count":4}
RSL: RESULT = {"ModbusSend":"Done"}
RSL: RESULT = {"ModbusReceived":{"DeviceAddress":1,"FunctionCode":3,"StartAddress":1,"Length":13,"Count":4,"Values":[65282,65028,65280,65024]}}

## Additional resources

[PR](https://github.com/arendst/Tasmota/pull/16014)  
[Modbus Protocol](https://en.wikipedia.org/wiki/Modbus)
