# Matter Protocol :material-cpu-32-bit:

!!! danger "Matter protocol is highly experimental"

!!! tip "Matter is only supported on ESP32x based devices and requires a specific build with `#define USE_MATTER_DEVICE`"

## What is Matter?

Matter is a new secure / reliable / local / standard protocol for smart devices launched at the end of 2022.
To know more about Matter: https://csa-iot.org/all-solutions/matter/

Tasmota supports Matter over IP (Wifi or Ethernet) as an end-device. This means that you can connect a Tasmota device or sensor to a Matter gateway, using standard and well define protocols. The Matter communication happens on the local network.

Thread is not supported. Thread requires a specific radio and is not supported by ESP32x devices, it would require a separate MCU.

Matter cannot be supported on ESP8266 due to limited memory resources. We are exploring the possibility to use a single ESP32 as a Matter bridge to control ESP8266 devices through the bridge.


### Supported platforms

Tasmota Matter is confirmed to work with:

- **iOS - Home app**
- **ESP Matter mobile app**
- ... more to come

### Getting started

tbc

### Known limitations

As Matter support is still experimental, there are some limitations:

- Matter requires IPv6 support, yet IPv4 is often tolerated. For debug purpose you can force Tasmota to manage Matter only on IPv4
- Tasmota devices with dual active networks (Ethernet + Wifi) are not yet supported. You need to disable Wifi or Ethernet. For example use [Ethernet Network Flipper](https://tasmota.github.io/docs/Berry-Cookbook/#ethernet-network-flipper)
- Tasmota cannot be Matter certified, it uses development vendor-ids, which typically raise user warnings when commissioning the device


What's not suported:

- **ESP8266** because of limited memory resources and lack of Berry support
- **Thread** as it requires a separate MCU. The number of Thread devices is still very limited. 
- **Zigbee**