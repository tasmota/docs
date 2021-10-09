# Serial to TCP Bridge

!!! info "Connect to a serial device over the network"

Needs `#define USE_TCP_BRIDGE`. This is available in the `zbbridge` build so you can use that or [compile your own build](Compile-your-build).

This feature can be used to add a "serial to network" functionality to a device that is otherwise serial only. You connect the device to a ESP8266/ESP32 and Tasmota will bridge between serial and network.

This is commonly used with a CCxxxx Zigbee based module to connect it to a remote ZHA or zigbee2mqtt instance.

## Commands

* `TCPBaudRate <x>`: sets the baudrate for serial (only 8N1 mode), min `1200`, max `115200` by 1200 increments.
* `TCPStart <port>`: listens to port `<port>`. This features supports 2 parallel TCP connections, which can be useful if you need a terminal + a specific protocol (like XMODEM). The 3rd connection will disconnect an previous connection. The number of parallel connections is a compile-time option. Note that this can be accessed by *any* host on the network and may have security implications.
* `TCPStart <port>,<ip address>`: listens to port `<port>`, but only allows connections from the provided IPv4 address. Any connections from a different host will be immediately closed.
* `TCPStart 0` or `TCPStart`: shuts down the TCP server and disconnects any existing connection(s).

For security reasons, the TCP bridge is not started at boot, and requires an explicit TCPStart command (this can be automated with Rules).

## Configuration

First assign two GPIOs to `TCP Tx (208)` and `TCP Rx (209)` types in the "Configure Module" page. The Rx/Tx are relative to the ESP device. For example with ESP01's hardware serial, set GPIO1 as TCP Tx and GPIO3 as TCP Rx.

Then set baud rate with `TCPBaudRate` and port with `TCPStart`.

You can add a rule to start the TCP server at boot.  
To do this for port `8888` and allow connections only from host `192.168.0.10`, run `Rule1 ON System#Boot do TCPStart 8888,192.168.0.10 endon` then enable with `Rule1 1` and restart the device.

## Additional resources

[PR](https://github.com/arendst/Tasmota/pull/8702)  
[Sonoff ZBBridge reference](https://zigbee.blakadder.com/Sonoff_ZBBridge.html)