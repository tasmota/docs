# ModBus Bridge

!!! info "This feature is included in `tasmota32` binary"  

To use it you must [compile your build](Compile-your-build). Add the following to `user_config_override.h`:
```
#ifndef USE_MODBUS_BRIDGE
#define USE_MODBUS_BRIDGE      // [I2cDriver23] Enable MPR121 controller (I2C addresses 0x5A, 0x5B, 0x5C and 0x5D) in input mode for touch buttons (+1k3 code)
#define USE_MODBUS_BRIDGE_TCP      // [I2cDriver23] Enable MPR121 controller (I2C addresses 0x5A, 0x5B, 0x5C and 0x5D) in input mode for touch buttons (+1k3 code)
#endif
```
----

This feature can be used to add a software serial ModBus only bridge to Tasmota. It can be used trough Tasmota commands or via direct TCP connection when defined.

## Commands

* `ModbusBaudrate <value>`: sets the baudrate for serial communication.
* `ModbusSerialConfig`: listens to port `<port>`. This features supports 2 parallel TCP connections, which can be useful if you need a terminal + a specific protocol (like XMODEM). The 3rd connection will disconnect an previous connection. The number of parallel connections is a compile-time option. Note that this can be accessed by *any* host on the network and may have security implications.
* `ModBusSend`: send using JSON payload `{"deviceaddress": 1, "functioncode": 3, "startaddress": 1, "type":"raw", "count":4}`

For security reasons, the TCP bridge is not started at boot, and requires an explicit TCPStart command (this can be automated with Rules).

## Configuration

First assign two GPIOs to `ModBr Tx` and `ModBr Rx` types in the "Configure Module" page. Set the baud rate with `ModBusBaudRate` 

### TCPBridge

When `USE_MODBUS_BRIDGE_TCP` is also defined, this bridge can also be used as a ModBus TCP bridge. 

Set the port with `TCPStart`.

You can add a rule to start the TCP server at boot.  
To do this for port `8888` and allow connections only from host `192.168.0.10`, run `Rule1 ON System#Boot do TCPStart 8888,192.168.0.10 endon` then enable with `Rule1 1` and restart the device.

## Use

Read Input Register
```
ModbusSend {"deviceaddress": 1, "functioncode": 3, "startaddress": 1, "type":"uint16", "count":2}
```
Write multiple coils
```
ModbusSend {"deviceaddress": 1, "functioncode": 15, "startaddress": 1, "type":"uint16", "count":4, "values":[1,2,3,4]}
```