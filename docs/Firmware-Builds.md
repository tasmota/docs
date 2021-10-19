---
description: Differences between firmware binaries
---

There are many available features programmed into Tasmota. Not all devices need all of the available features. ESP based devices have a limited amount of memory available. To ensure that there is enough memory available to flash the firmware, it is best to keep the total size as small as possible, and definitely under 625K total to ensure OTA updates are possible. For this reason, Tasmota makes available the ability to create different firmware binary files to suit each particular device's requirements (e.g., sensors) and each application's needs (e.g., Rules, Timers, etc.). Once features such as support for sensors, rules, timers, etc. is compiled into the firmware binary, the features themselves can be configured at run-time, or, for some features, configured at compile time as well.

Many times one just needs to download a pre-compiled binary and perform the necessary run-time configuration. It is not necessary to compile your own binary if these pre-compiled builds meet your needs. These available files provide a simpler approach to get up and going with Tasmota quickly.

Release binaries are from the [official OTA server](http://ota.tasmota.com/tasmota/release/). Firmware built from development branch code is available from the [development OTA server](http://ota.tasmota.com/tasmota/).

Features that are not available in any official release build have to be enabled in source code and compiled yourself. Read more about [compiling your own build](Compile-your-build).

!!! tip
    You might find some of the features you need included in one of our unofficial experimental builds over at [https://github.com/tasmota/install](https://github.com/tasmota/install).

## Firmware Variants

- **tasmota.bin**  supports most features. **THIS IS THE RECOMMENDED BINARY**  
  **tasmota-BG.bin** to **tasmota-TW.bin** the same features as _tasmota.bin_ with localized language support. *(Note: tasmota-UK.bin is for the Ukrainian language)*
- **tasmota-sensors.bin** enables many features as _tasmota.bin_ - not all - and includes support for connectable sensors
- **tasmota-lite.bin**  has a stripped down feature set. This reduces the required CPU cycles in order to reduce power draw to allow devices with a weak power supply to run reliably.

!!! note
    This is similar to the pre-compiled Tasmota binary that comes bundled with Tuya-Convert. If you used Tuya-Convert to flash your device, it is strongly recommended to update to `tasmota.bin`. Otherwise some crucial features (e.g., energy monitoring, auto-discovery, etc.) will not work.

- **tasmota-minimal.bin** is a specialised build to subsequently allow OTA uploads. **This version should NOT be used for initial installation!**
- **tasmota-knx.bin** includes [KNX](KNX) support but omits some features. If you need additional features, compile your own firmware (e.g., [Gitpod](Gitpod)  ).
- **tasmota-display.bin**  built for connecting displays but omits some features such as energy monitoring. If you need additional features, compile your own firmware (e.g., [Gitpod](Gitpod)  ).
- [**tasmota-ir.bin**](Tasmota-IR) provides almost all `IRremoteESP8266` protocols. If you need additional features, compile your own firmware (e.g., [Gitpod](Gitpod)) to compile [`ircustom`](Tasmota-IR).
- **tasmota-zbbridge.bin** built speciically for Sonoff Zigbee Bridge device.

## Available Features and Sensors

--8<-- "BUILDS.md"

