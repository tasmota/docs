There are many available features programmed into Tasmota. Not all devices need all of the available features. ESP based devices have a limited amount of memory available. To ensure that there is enough memory available to flash the firmware, it is best to keep the total size as small as possible, and definitely under 625K total to ensure OTA updates are possible. For this reason, Tasmota makes available the ability to create different firmware binary files to suit each particular device's requirements (e.g., sensors) and each application's needs (e.g., Rules, Timers, etc.). Once features such as support for sensors, rules, timers, etc. is compiled into the firmware binary, the features themselves can be configured at run-time, or, for some features, configured at compile time as well.

Many times one just needs to download a pre-compiled binary and perform the necessary run-time configuration. It is not necessary to compile your own binary if these pre-compiled builds meet your needs. These available files provide a simpler approach to get up and going with Tasmota quickly.

The binary files available on [GitHub](https://github.com/arendst/Tasmota/releases) are for the current master release version only. These master release binaries are also available from the [OTA server](http://thehackbox.org/tasmota/release/). However, the latest development branch code binaries are only available from the [OTA server](http://thehackbox.org/tasmota/).

Features that are not available in any release build have to be enabled in source code and compiled yourself. Read more about [compiling your own build](compile-your-build).

## Firmware Variants
- **tasmota.bin**  supports most features. **THIS IS THE RECOMMENDED BINARY**  
  **tasmota-BG.bin** to **tasmota-TW.bin** the same features as _tasmota.bin_ with localized language support. *(Note: tasmota-UK.bin is for the Ukrainian language)*
- **tasmota-lite.bin**  has a stripped down feature set. This reduces the required CPU cycles in order to reduce power draw to allow devices with a weak power supply to run reliably.
  >This is similar to the pre-compiled Tasmota binary that comes bundled within the Tuya-Convert package when you install their OTA flashing tool. If you used Tuya-Convert to flash your device, it is strongly recommended to update to `tasmota.bin`. Otherwise some crucial features (e.g., energy monitoring, auto-discovery, etc.) will not work.
- **tasmota-minimal.bin** is a specialised build to subsequently allow OTA uploads. ***This version should NOT be used for initial installation!***
- **tasmota-sensors.bin** enables the same features as _tasmota.bin_ and includes support for additional sensors
- **tasmota-knx.bin** includes [KNX](integrations/KNX) support but omits some features. If you need additional features, compile your own firmware (e.g., [Gitpod](Gitpod)).
- **tasmota-display.bin**  built for connecting displays but omits some features such as energy monitoring. If you need additional features, compile your own firmware (e.g., [Gitpod](Gitpod)).
- [**tasmota-ir.bin**](Tasmota-IR) provides almost all `IRremoteESP8266` protocols. If you need additional features, compile your own firmware (e.g., [Gitpod](Gitpod)) to compile [`ircustom`](Tasmota-IR).

[remoteMarkdownUrl](https://raw.githubusercontent.com/arendst/Tasmota/development/BUILDS.md)
