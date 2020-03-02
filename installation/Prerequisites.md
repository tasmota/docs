## Needed Hardware

<img style="float:right;width:250px" src="_media/esp8266.png"></img>

#### ESP8266 or ESP8285 Device
Any [variation](https://en.wikipedia.org/wiki/ESP8266#Espressif_modules) of the [ESP8266 chip](https://www.espressif.com/en/products/hardware/esp8266ex/overview) can be flashed with Tasmota.

#### Serial-to-USB Adapter
The [power supplied to the device](https://www.letscontrolit.com/wiki/index.php?title=Power) is **one of the most important elements** for both flashing the device and for stable operation. You must ensure that the device receives sufficient power (current AND appropriate voltage level) to properly flash the firmware on the device.
* [CH340G](https://cdn.sparkfun.com/datasheets/Dev/Arduino/Other/CH340DS1.PDF) is a reliable and very cheap adapter (example [1](https://www.sparkfun.com/products/14050), [2](https://www.aliexpress.com/item/1PCS-CH340-module-instead-of-PL2303-CH340G-RS232-to-TTL-module-upgrade-USB-to-serial-port/32761423124.html)).
<img src="_media/ch340g.png" style="margin:5px;float:right;width:200px"></img>
* [FTDI FT232](https://www.ftdichip.com/Products/ICs/FT232R.htm) - these adapters have a lot of fakes in the market so buy only from reliable sources ([example](https://www.sparkfun.com/products/13746)). Buy only the variant with a separate 3.3V regulator on PCB! 
* [CP2102](https://www.silabs.com/documents/public/data-sheets/cp2102-9.pdf) or [PL2303](http://www.prolific.com.tw/UserFiles/files/ds_pl2303HXD_v1_4_4.pdf) - works with certain devices, but using an external 3.3V supply might be necessary. Not recommended for beginners!
* [RaspberryPi](Flash-Sonoff-using-Raspberry-Pi) - only for advanced users. External 3.3V supply necessary.
* [NodeMCU](https://en.wikipedia.org/wiki/NodeMCU) and [D1 mini](https://cleanuri.com/x60JQ9) (Pro/Lite) boards have a micro USB upload port and don't require an adapter.

> [!NOTE]
>Don't forget to install drivers for your serial-to-USB adapter.

> [!DANGER]
>Some adapters can be switched between 3.3V and 5V for the data pins, but still provide 5V on the power pin which will fry your device.  You MUST make sure both the data and VCC pins are set for 3.3V.

#### Soldering Tools
To solder you'll of course need a soldering iron, soldering tin and some flux. If you're new to soldering check out some soldering tutorial videos while you're at it.

If you're intimidated by soldering you could get away with holding the headers with jumper wires in the pin holes during flashing but it is not a fool proof process and flashing might fail.
#### Jumper wires

You could use any kind of wire but [jumper wires](http://blog.sparkfuneducation.com/what-is-jumper-wire) (also called DuPont wires) are more practical than soldering and desoldering.

#### Pin Headers
<img src="_media/pinheaders.png" style="margin:5px;float:right;width:10em"></img>

[Pin headers](https://learn.sparkfun.com/tutorials/connector-basics/pin-header-connectors) come in male or female version. Choose according to your jumper wire connectors.
#### Computer with Linux, Windows or MacOS
You need a computer with a USB port to upload the firmware to your device and configure it.
#### Smartphone
Tasmota installed from a precompiled binary needs to be configured to work with your Wi-Fi network before you can access the Tasmota web UI. This is usually done by connecting to a Tasmota Wi-Fi Access Point with your smartphone (or tablet or computer with Wi-Fi). 

## Needed Software
#### Tasmota Firmware Binary
Download a Tasmota firmware binary file (.bin). If you're not sure which binary is the right one for you just start with `tasmota.bin` or consult the [builds table](Builds) to see which features you need. 

Official release binaries can be downloaded from [GitHub releases](https://github.com/arendst/Tasmota/releases) or from our [OTA server](http://thehackbox.org/tasmota/release/). 

Latest _**development**_ branch binaries are available only from our [OTA server](http://thehackbox.org/tasmota). The latest merged development code is compiled hourly. 

### Flashing Tool
- [**Tasmotizer**](https://github.com/tasmota/tasmotizer) - NEW flashing and firmware download tool just for Tasmota. (Windows, Linux or Mac)
- [**Tasmota PyFlasher**](https://github.com/tasmota/tasmota-pyflasher) - flashing tool intended for Tasmota. (Windows or Mac)
- [**NodeMCU PyFlasher**](https://github.com/marcelstoer/nodemcu-pyflasher) - easy to use GUI flasher based on esptool.py. (Windows or Mac)
- [**Esptool.py**](https://github.com/espressif/esptool) - the official flashing tool from Espressif. (Requires Python)
- [**Esptool executable**](https://github.com/igrr/esptool-ck) - Esptool in executable form, no Python required. (Windows, Linux or Mac)

##### OTA Flashing Tools
**Tasmota is NOT a developer of these tools. For help and troubleshooting you will need to _get support from those projects_.**
- [**Tuya-Convert**](Tuya-Convert) - easy OTA flash for devices with Tuya chips, no disassembly required
- [**Sonoff DIY**](Sonoff-DIY) - OTA flash for select Sonoff devices (some disassembly required)
- [**Node-RED OTA server and firmware manager**](https://flows.nodered.org/flow/888b4cd95250197eb429b2f40d188185) - [Node-RED](https://nodered.org/) flow for managing OTA updates 
- [**OTA over SCP**](OTA-over-SCP) - setup and configure "OTA over SCP" upload for PlatformIO
- [**Python HTTP OTA server**](Python-HTTP-OTA-Server) - setting up a small Python server to serve OTA upgrade binaries
- [**SonOTA**](SonOTA---Espressif2Arduino---Tasmota-without-compiling) - OTA flash eWeLink based devices *(mostly outdated)*

### Serial Terminal
A program that connects to your Tasmota device directly over the serial connection you used to flash it.

This is an optional way to configure your device using [Commands](Commands) and [Backlog](Commands#the-power-of-backlog). 
* **[Termite](https://www.compuphase.com/software_termite.htm)** - simple terminal for windows
* **[Termie](http://termie.sourceforge.net/)** - open source clone of Termite
* **[Putty](https://www.putty.org/)** - popular client available on every platform
* **[Minicom](https://www.acmesystems.it/minicom)** - one of many Linux terminals

> [!TIP] Enable _local echo_ so that you can see what is typed and transmitted to the device. Enable **Append CR+LF** since every request needs to end with `<CR><LF>`. 

## MQTT Knowledge
Tasmota is designed to be controlled and communicate via [MQTT](http://mqtt.org/). To use it to its fullest potential you need an [MQTT broker](https://www.hivemq.com/blog/mqtt-essentials-part-3-client-broker-connection-establishment/). 

Read our [article on MQTT](MQTT) for how it is utilised in Tasmota.

## Compiling Tools <small>(Optional)</small>
If you want to modify the code or default settings you can use:
- [**PlatformIO**](PlatformIO) -  setup and configure [PlatformIO](https://platformio.org) for Tasmota compilation and upload
- [**PlatformIO CLI**](PlatformIO-CLI) - how to flash Tasmota using the PlatformIO command line interface on Linux
- [**PlatformIO-Core**](Create-your-own-Firmware-Build-without-IDE) - automate firmware builds using PlatformIO-Core and flash with esptool
- [**Visual Studio Code**](Visual-Studio-Code) -  setup and configure [Visual Studio Code](https://code.visualstudio.com) with PlatformIO for Tasmota
- [**Atom**](Create-your-own-Firmware-Build-without-IDE) - beginner guide building Tasmota firmware using [Atom](https://atom.io/) with PlatformIO plugin
- [**Arduino IDE**](Arduino-IDE) - setup and configure Arduino IDE for Tasmota compilation and upload
- [**Docker Tasmota**](https://github.com/tasmota/docker-tasmota) - compile from a Docker container using PlatformIO

#### Online Compilers
_**Can only create a firmware binary.** Use one of the [tools](/installation/Prerequisites#flashing-tool) to flash it to your device._
- [**Gitpod**](Gitpod) - compile your own binary in the cloud using [Gitpod](https://www.gitpod.io/).  
- [**TasmoCompiler**](https://github.com/benzino77/tasmocompiler) - simple web GUI to compile Tasmota with your own settings

More details in [Compile Your Own Tasmota](Compile-your-build).
