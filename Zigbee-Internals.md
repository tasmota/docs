# Zigbee internals
[Back to Zigbee](Zigbee)

This page is for developers who want to understand how Zigbee2Tasmota (Z2T) works and its implementation details.

## CC2530 ZNP protocol
The CC2530 is flashed with Texas Instrument ZNP Software version 1.2. The protocol is build on a serial communication between the main cpu and the CC2530.

Serial communication is configured as 8N1, 115200 bauds. We suggest to use GPIO13/15 because they have hardware serial support. Please note that there is only one usable hardware serial, either on GPIO1/3 or GPIO13/15.

To enable hardware serial on GPIO13/15 for Tasmota, set `Serial 0` and restart. Otherwise Z2T will use Software serial provided by TasmotaSerial.

