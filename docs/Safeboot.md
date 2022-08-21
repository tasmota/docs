# Safeboot Partition Layout :material-cpu-32-bit:

!!! info "This page is specific to ESP32 and variants (not applicable to ESP8266)"

!!! info "This feature was introduced in Tasmota v12"

Safeboot partition layout is a new feature in Tasmota v12 that optimizes the use of Flash memory and allows for bigger filesystems and bigger firmware sizes.

![Flash_layout_original](https://user-images.githubusercontent.com/49731213/174431015-a38d5365-54bc-473c-b632-1e84c9ea708c.svg){ width="200" } ![Flash_layout_safeboot](https://user-images.githubusercontent.com/49731213/174431178-d26062a7-9c33-4d4b-a415-eea974cefb8e.svg){ width="200" } ![Flash_layout_safeboot_alt](https://user-images.githubusercontent.com/49731213/174431192-351b4226-7b84-420a-9f9f-0e27855a53e4.svg){ width="200" }

## Before v12

Tasmota used a standard partition layout consisting of 2 firmware partitions of equal sizes. One partition is active and is booted from, while the other partition receives the new code when an OTA (Over The Air) update occurs.

This scheme is standard in ESP32 Arduino. Its main advantage is that it is very safe. If a power failure occurs during the OTA update, the device is not bricked and reboots on the untouched version. The main drawback is that it consumes a lot of flash space, enough to contains twice the firmware size.

Example, standard Tasmota layout for 4MB flash:

- a fixed size 64KB system area
- 2x partitions of 1856KB each to receive Tasmota code
- a filesystem of 320KB

![Flash_layout_original](https://user-images.githubusercontent.com/49731213/174431015-a38d5365-54bc-473c-b632-1e84c9ea708c.svg){ width="270" align="left" }

## Introducing Safeboot

We introduced a new variant of Tasmota called "Safeboot". It contains a minimal version of Tasmota used only for OTA, and a normal firmware. The main advantage is that it provides 1024KB of additional storage for firmware and/or filesystem.

Example of new partition layout since v12:

- a fixed size 64KB system area
- a Safeboot partition of 832KB
- 1x partition of 2880KB to receive Tasmota code
- a filesystem of 320KB

![Flash_layout_safeboot](https://user-images.githubusercontent.com/49731213/174431178-d26062a7-9c33-4d4b-a415-eea974cefb8e.svg){ width="270" align="left" }

An alternate partition scheme is used in Sonoff Zigbee Bridge Pro:

- a fixed size 64KB system area
- a Safeboot partition of 832KB
- 1x partition of 1856KB to receive Tasmota code
- a filesystem of 1344KB

![Flash_layout_safeboot_alt](https://user-images.githubusercontent.com/49731213/174431192-351b4226-7b84-420a-9f9f-0e27855a53e4.svg){ width="270" align="left" }

Note: the Safeboot firmware is a reduced version of Tasmota containing only what's required for OTA updates (Web UI, MQTT, TLS...). However it does not save settings nor support initial Wi-Fi configuration.
