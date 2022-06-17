# Safeboot partition layout :material-cpu-32-bit:

!!! info "This page is specific to ESP32 and variants (not applicable to ESP8266)"

!!! info "This feature was introduced in Tasmota v12"

Safeboot partition layout is a new feature in Tasmota v12 that optimizes the use of Flash memory and allows for bigger filesystems and bigger firmware sizes.

## Before v12

Tasmota used a standard partition layout consistint of 2 firmware partitions of equal sizes. One partition is active and is booted from, while the other partition receives the new code when an OTA (Over The Air) update occurs.

This scheme is standard in ESP32 Arduino. Its main advantage is that it is very safe. If a power failure occurs during the OTA update, the device is not bricked and reboots on the untouched version. The main drawback is that it consumes a lot of flash space, enough to contains twice the firmware size.

Example, standard Tasmota layout for 4MB flash:

- a fixed size 64KB system area
- 2x partitions of 1856KB each to receive Tasmota code
- a filesystem of 320KB

## Introducing Safeboot

We introduced a new variant of Tasmota calles "Safeboot". It contains a minimal version of Tasmota used only for OTA, and a normal firmware. The main advantage is that it provides 1024KB of additional storage for firmware and/or filesystem.


Example of new partition layout since v12:

- a fixed size 64KB system area
- a Safeboot partition of 832KB
- 1x partition of 2880KB to receive Tasmota code
- a filesystem of 320KB

An alternate partition scheme is used in Sonoff Zigbee Bridge Pro:

- a fixed size 64KB system area
- a Safeboot partition of 832KB
- 1x partition of 1856KB to receive Tasmota code
- a filesystem of 1344KB

Note: the Safeboot firmware is a reduced version of Tasmota containing only what's required for OTA updates (Web UI, MQTT, TLS...). However it does not save settings nor support initial wifi configuration.