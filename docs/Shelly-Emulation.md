---
description: Present a Tasmota ESP32 device as a Shelly Gen2 Pro 2PM
---

# Shelly Gen2 Emulation

Shelly emulation presents a Tasmota device as a generation 2 **Shelly Pro 2PM** (`SPSW-202PE16EU`). It is intended for local controllers that discover and communicate with Shelly devices using mDNS and the [Shelly Gen2 RPC protocol](https://shelly-api-docs.shelly.cloud/gen2/General/RPCProtocol/), including the Sigenergy stack and its mySigen app.

??? tip "This feature is included in standard `tasmota32` binaries"

    Shelly emulation is disabled at runtime by default. Standard `tasmota32` builds include the web server and mDNS discovery, so they advertise `_shelly._tcp` without requiring a custom build.

    Some specialized ESP32 variants can include Shelly emulation without mDNS discovery. In those builds, `/shelly` and `/rpc` remain available, but controllers cannot discover the device automatically.

    When [compiling your build](Compile-your-build), add the following to `user_config_override.h`:

    ```c++
    #define USE_WEBSERVER
    #define USE_EMULATION_SHELLY
    #define USE_DISCOVERY
    ```

    `USE_EMULATION` is enabled automatically when `USE_EMULATION_SHELLY` is defined.

## Enable Shelly emulation

Select **Configuration > Configure Other > Emulation > Shelly single device**, or run:

```text
Emulation 3
```

The device restarts after the emulation setting changes. Only one Tasmota emulation can be active at a time, so selecting Shelly emulation disables Belkin WeMo or Hue Bridge emulation.

## Discovery and identity

When Shelly emulation is selected, Tasmota advertises `_shelly._tcp` and `_http._tcp` on port 80 using mDNS. Discovery includes the active IPv4 and IPv6 addresses on Wi-Fi and Ethernet.

The emulated identity is derived from the ESP32 Wi-Fi station MAC address:

| Field | Value |
|:---|:---|
| Device type | Shelly Pro 2PM, generation 2 |
| Model | `SPSW-202PE16EU` |
| Device ID | `shellypro2pm-<lowercase-mac>` |
| mDNS hostname | `ShellyPro2PM-<uppercase-mac>.local` |
| Device name | Tasmota `DeviceName` |

The controller and Tasmota device must be able to exchange multicast DNS traffic on UDP port 5353 and reach HTTP port 80. Networks that isolate wireless clients, filter multicast, or separate the controller and device across VLANs may require additional mDNS forwarding and firewall configuration.

## Tasmota channel mapping

The emulated device always exposes two switch, two input, and two metering channels:

| Shelly component | Tasmota source |
|:---|:---|
| `switch:0` | `Power1` / `Relay1` |
| `switch:1` | `Power2` / `Relay2` |
| `input:0` | `Switch1` |
| `input:1` | `Switch2` |
| Metering for `switch:0` | Energy phase/channel 1 |
| Metering for `switch:1` | Energy phase/channel 2 |

If a relay is not configured, that Shelly output uses a persistent virtual state so controllers still see a working two-output Pro 2PM. An unconfigured input reports `false`. Metering fields report zero when no corresponding Tasmota energy channel is available.

The emulation reports active power, voltage, frequency, current, power factor, imported active energy, and returned active energy when those values are supplied by the configured Tasmota energy driver.

## HTTP and RPC interface

The emulation implements the Shelly Gen2 device-information endpoint and the HTTP forms of RPC calls:

```bash
# Identify the emulated device
curl http://<tasmota-ip>/shelly

# Read all component status
curl http://<tasmota-ip>/rpc/Shelly.GetStatus

# Turn the first output on
curl "http://<tasmota-ip>/rpc/Switch.Set?id=0&on=true"

# Send a framed RPC request
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"id":1,"src":"user_1","method":"Switch.Toggle","params":{"id":1}}' \
  http://<tasmota-ip>/rpc
```

The supported RPC methods are:

| Namespace | Methods |
|:---|:---|
| `Shelly` | `GetDeviceInfo`, `GetStatus`, `GetConfig`, `GetComponents`, `ListMethods`, `ListProfiles` |
| `Switch` | `GetStatus`, `GetConfig`, `Set`, `Toggle` |
| `Input` | `GetStatus`, `GetConfig` |
| `Wifi` | `GetStatus`, `GetConfig` |
| `BLE` | `GetStatus`, `GetConfig` |
| `Sys` | `GetStatus`, `GetConfig` |
| `RPC` | `Ping` |

RPC component IDs are zero-based and limited to `0` and `1`.

!!! warning "Local network control is unauthenticated"
    The emulation identifies itself with `auth_en: false`. Its `/shelly` and `/rpc` endpoints do not use Shelly digest authentication or Tasmota `WebPassword`, because local Shelly controllers must be able to discover and poll them. Enable this feature only on a trusted network.

## Scope and limitations

This is a compatibility layer for local Shelly discovery, polling, metering, and two-output control. It is not Shelly firmware and does not implement the complete Shelly ecosystem.

- The emulated model and switch profile are fixed to a two-channel Shelly Pro 2PM.
- Shelly Cloud, Shelly MQTT, WebSocket RPC, BLE transport, scripts, webhooks, schedules, firmware update, and Shelly configuration writes are not implemented.
- Status is intended for polling. The emulation does not send Shelly RPC event notifications.
- `GetConfig` methods report compatibility values; configuration must still be changed with Tasmota commands or the Tasmota web UI.
- Only the methods listed above are supported. Other Shelly RPC calls return `Method not found`.

## Troubleshooting

1. Run `Emulation` and confirm it returns `3`.
2. Open `http://<tasmota-ip>/shelly`. If this fails, confirm the firmware contains `USE_EMULATION_SHELLY` and `USE_WEBSERVER`.
3. Browse for `_shelly._tcp` with `dns-sd -B _shelly._tcp` (macOS) or `avahi-browse -rt _shelly._tcp` (Linux). If the HTTP endpoint works but discovery does not, confirm the build contains `USE_DISCOVERY` and that multicast is not filtered.
4. Confirm the controller and Tasmota device are on the same reachable network. For mySigen, the Shelly-compatible device and SigenStor must be connected to the same WLAN.
5. If outputs or readings do not match, check the Tasmota template, relay count, switch assignments, and energy-driver channel order.

See the official Shelly documentation for the [`/shelly` endpoint](https://shelly-api-docs.shelly.cloud/gen2/ComponentsAndServices/Shelly/) and [RPC over HTTP](https://shelly-api-docs.shelly.cloud/gen2/General/RPCChannels/).
