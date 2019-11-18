To install Tasmota on your device you have to prepare some tools and software.

If your device works with Tuya Smart or Smart Life app it may be possible to flash it with [Tuya-Convert](https://github.com/ct-Open-Source/tuya-convert) without disassembly or soldering and skip directly to [initial configuration](initial-configuration).
# Prerequisites
## Needed Hardware

<img src="https://user-images.githubusercontent.com/5904370/55688732-43cf8100-597c-11e9-9171-e8f7d975aff4.jpg" width=150 align=right></img>
### Device with an ESP8266/ESP8285 chip
Any [variation](https://en.wikipedia.org/wiki/ESP8266#Espressif_modules) of the [ESP8266 chip](https://www.espressif.com/en/products/hardware/esp8266ex/overview) can be flashed with Tasmota.

### Serial-to-USB adapter with 3.3V supply
The [power supplied to the device](https://www.letscontrolit.com/wiki/index.php?title=Power) is **one of the most important elements** for both flashing the device and for stable operation. You must ensure that the device receives sufficient power (current AND appropriate voltage level) to properly flash the firmware on the device.
* [CH340G](https://cdn.sparkfun.com/datasheets/Dev/Arduino/Other/CH340DS1.PDF) is a reliable and very cheap adapter (example [1](https://www.sparkfun.com/products/14050), [2](https://www.aliexpress.com/item/1PCS-CH340-module-instead-of-PL2303-CH340G-RS232-to-TTL-module-upgrade-USB-to-serial-port/32761423124.html)).
* [FTDI FT232](https://www.ftdichip.com/Products/ICs/FT232R.htm) - these adapters have a lot of fakes in the market so buy only from reliable sources ([example](https://www.sparkfun.com/products/13746)). Buy only the variant with a separate 3.3V regulator on PCB! 
* [CP2102](https://www.silabs.com/documents/public/data-sheets/cp2102-9.pdf) or [PL2303](http://www.prolific.com.tw/UserFiles/files/ds_pl2303HXD_v1_4_4.pdf) - works with certain devices, but using an external 3.3V supply might be necessary. Not recommended for beginners!
* [RaspberryPi](https://github.com/arendst/Tasmota/wiki/Flash-Sonoff-using-Raspberry-Pi) - only for advanced users. External 3.3V supply necessary.
* [NodeMCU](https://en.wikipedia.org/wiki/NodeMCU) and [D1 mini](https://wiki.wemos.cc/products:d1:d1_mini) (Pro/Lite) boards have a micro USB upload port and don't require an adapter.
<img src="https://user-images.githubusercontent.com/5904370/55688731-3f0acd00-597c-11e9-866c-d6ed7658ec4b.png" align=right></img>

***Don't forget to install drivers for your serial-to-USB adapter.***

*Some adapters can be switched between 3.3V and 5V for the data pins, but still provide 5V on the power pin which will fry your device.  You **MUST** make sure both the **data** and **VCC** pins are set for 3.3V.*
### Soldering equipment
To solder you'll of course need a soldering iron, soldering tin and some flux. If you're new to soldering check out some soldering tutorial videos while you're at it.

If you're intimidated by soldering you could get away with holding the headers with jumper wires in the pin holes during flashing but it is not a fool proof process and flashing might fail.
### Jumper wires

You could use any kind of wire but [jumper wires](http://blog.sparkfuneducation.com/what-is-jumper-wire) (also called DuPont wires) are more practical than soldering and desoldering.

### Pin headers<img src="https://user-images.githubusercontent.com/5904370/55688997-a6764c00-597f-11e9-9f5f-cb5c38c21479.png" height=100 align=right></img>
[Pin headers](https://learn.sparkfun.com/tutorials/connector-basics/pin-header-connectors) come in male or female version. Choose according to your jumper wire connectors.
### Computer with Linux, Windows or MacOS
You need a computer with a USB port to upload the firmware to your device and configure it.
### Smartphone
Tasmota installed from a precompiled binary needs to be configured to work with your Wi-Fi network before you can access the Tasmota web UI. This is usually done by connecting to a Tasmota Wi-Fi Access Point with your smartphone (or tablet or computer with Wi-Fi). 

## Needed Software
### Tasmota firmware
Download a Tasmota binary (.bin) file. If you're not sure which binary is the right one for you consult the [builds table](Builds) or just start with `tasmota.bin`.

The latest _**development**_ binary files are available on the [OTA server](http://thehackbox.org/tasmota). The latest merged development code is compiled hourly. The latest _**master**_ release binary files can be downloaded from [GitHub](https://github.com/arendst/Tasmota/releases) or from the [OTA server](http://thehackbox.org/tasmota/release/). 

### Flashing tool
- [**Tasmota PyFlasher**](https://github.com/tasmota/tasmota-pyflasher) - official flashing tool intended for Tasmota. (Windows or Mac)
- [**NodeMCU PyFlasher**](https://github.com/marcelstoer/nodemcu-pyflasher) - easy to use GUI flasher based on esptool.py. (Windows or Mac)
- [**Esptool.py**](https://github.com/espressif/esptool) - the official flashing tool from Espressif. (Requires Python)
- [**Esptool executable**](https://github.com/igrr/esptool-ck) - Esptool in executable form, no Python required. (Windows, Linux or Mac)

#### OTA Flashing Tools
**Tasmota is NOT a developer of these tools. For help and troubleshooting you will need to _get support from those projects_.**
- [**Tuya OTA**](Tuya-OTA) - easy OTA flash for devices with Tuya chips, no disassembly required
- [**Sonoff DIY**](Sonoff-DIY) - OTA flash for select Sonoff devices (some disassembly required)
- [**Node-RED OTA server and firmware manager**](https://flows.nodered.org/flow/888b4cd95250197eb429b2f40d188185) - [Node-RED](https://nodered.org/) flow for managing OTA updates 
- [**OTA over SCP**](OTA-over-SCP) - setup and configure "OTA over SCP" upload for PlatformIO
- [**Python HTTP OTA server**](Python-HTTP-OTA-Server) - setting up a small Python server to serve OTA upgrade binaries
- [**SonOTA**](SonOTA---Espressif2Arduino---Tasmota-without-compiling) - OTA flash eWeLink based devices *(mostly outdated)*

#### Modifying Tasmota Code
If you want to modify the code or default settings you can use:
- [**PlatformIO**](PlatformIO) -  setup and configure [PlatformIO](https://platformio.org) for Tasmota compilation and upload
- [**PlatformIO CLI**](PlatformIO-CLI) - how to flash Tasmota using the PlatformIO command line interface on Linux
- [**PlatformIO-Core**](Create-your-own-Firmware-Build-without-IDE) - automate firmware builds using PlatformIO-Core and flash with esptool
- [**Visual Studio Code**](Visual-Studio-Code) -  setup and configure [Visual Studio Code](https://code.visualstudio.com) with PlatformIO for Tasmota
- [**Atom**](Beginner-Guide---Create-your-own-Firmware-Build) - beginner guide building Tasmota firmware using [Atom](https://atom.io/) with PlatformIO plugin
- [**Arduino IDE**](Arduino-IDE) - setup and configure Arduino IDE for Tasmota compilation and upload

If you use PlatformIO, to be sure that you have the latest build of the ESP Core, first delete the following folders in your current `.platformio` folder:
- Everything in `.platformio/platforms`  
- All folders that begin with `framework...` in `.platformio/packages`  

#### Online Compilers
_**Can only create a firmware binary.** Use one of the [tools](Prerequisites#flashing-tool) to flash it to your device._
- [**Gitpod**](Compiling-Tasmota-on-Gitpod) - compile your own binary in the cloud using [Gitpod](https://www.gitpod.io/).  
- [**TasmoCompiler**](https://github.com/benzino77/tasmocompiler) - simple web GUI to compile Tasmota with your own settings

### Serial terminal
A program that connects to your Tasmota device directly over the serial connection you used to flash it.

This is an optional way to configure your device using [Commands](Commands) and [Backlog](Commands#using-backlog). Be sure to configure your program for local echo so that the characters you type are displayed locally on your monitor as well as transmitted to the device. Also, every request needs to end with `<CR><LF>`. Your program may only send the carriage return (`Ctrl-M`) when hitting `Enter` and not automatically send the `<LF>`. You can send a linefeed using `Ctrl-J` on the keyboard.
* **[Termite](https://www.compuphase.com/software_termite.htm)** - simple terminal for windows
* **[Termie](http://termie.sourceforge.net/)** - open source clone of Termite
* **[Putty](https://www.putty.org/)** - popular client available on every platform
* **[Minicom](https://www.acmesystems.it/minicom)** - one of many Linux terminals

## Other Requirements
### The willingness to tinker and learn
Tasmota is not a commercial product and support is limited. You have to be willing to research and debug problems that might arise.
### MQTT
Tasmota is designed to be controlled and communicate via [MQTT](http://mqtt.org/). To use it to its fullest potential you need an [MQTT broker and client](https://www.hivemq.com/blog/mqtt-essentials-part-3-client-broker-connection-establishment/). 

Read our [wiki article on MQTT](MQTT) for a quick introduction.

# Hardware Preparation
You've followed [Prerequisites](Prerequisites) and got everything you need. Now you have to prepare your device for flashing.

We need to connect to the serial programming interface of the ESP8266 chip. This is done by connecting our serial-to-USB converter TX and RX pins to the ESP8266 RX and TX pins and powering the chip with the 3.3V and GND pins.

In most cases those pins are available on the PCB in the form of pin holes or solder pads but pin headers or jumper wires need to be soldered or otherwise applied. In some cases you will need to solder wires directly on the chip's pins which requires some experience and good soldering equipment.

!> :warning: WARNING BEFORE PROCEEDING :warning: 

**DO NOT CONNECT DEVICES TO MAINS POWER WHILE THE COVER IS OPEN AND CIRCUIT BOARD IS EXPOSED!!!**

**NEVER TRY TO FLASH WHILE YOUR DEVICE IS CONNECTED TO MAINS POWER!!!**
<img alt="Sonoff Pow Bricked" src="https://raw.githubusercontent.com/arendst/arendst.github.io/master/media/pow1.jpg" height="240" align="right" />

**YOU CAN BE ELECTROCUTED IF YOU DON'T KNOW WHAT YOU ARE DOING!**

If you are not careful, your own health will be in danger. Shorting your serial interface with mains AC power will fry your device and serial adapter and will also harm or destroy your computer. It is important to _**always have all mains power cables disconnected from the device**_ while being connected via serial or even while the case of the device is opened.

## Serial Connection
Each device has its pins labelled differently. If the labelling isn't visible on the PCB please refer to the devices flashing guide or search the Internet for correct pin locations. Device specific instructions and restrictions are documented in the [Tasmota Device Templates Repository](https://blakadder.github.io/templates/)

When you have identified pins on your device, connect wires according to the table:

|Serial<br>adapter|ESP8266<br>device|
|---:|:--------|
| 3V3 | 3V3 or VCC|
| TX | RX  |
| RX | TX  |
| GND | GND|

**Note that TX from your adapter goes to RX on the ESP8266 device and RX from adapter goes to TX on the device!**
![Image courtesy of https://www.domo-blog.fr/](https://user-images.githubusercontent.com/5904370/57880182-69bf2f80-781e-11e9-8953-88599cb89155.png)

## Putting the Device into Programming Mode
<img alt="Example without button" src="https://user-images.githubusercontent.com/5904370/55689595-8dbd6480-5986-11e9-81c6-a13c6b7e5971.png" height=200 align=right></img>
ESP8266 needs to be put into **Programming Mode** before the firmware can be uploaded. This is done by pulling the GPIO0 pin to GND while the chip is booting. 

On most devices the installed control button is connected to GPIO0 and GND, making entering Programming Mode very easy. On others you will need to bridge the pins on the PCB or directly on the chip with a jumper wire. Device specific instructions are documented in [Tasmota Device Templates Repository](https://blakadder.github.io/templates/).

To put the ESP8266 into Programming Mode:

1. Disconnect serial-to-USB adapter and power
2. Bridge GPIO0 and GND (by pressing the on-board button or connection with a wire)
3. Connect the serial-to-USB adapter to your computer
4. After a few seconds disconnect GPIO0 from GND (release button or remove the wire connection). On devices that do not provide the GPIO0 connected button, it may be easier to leave the wired bridge in place throughout the entire flashing process (erase & upload). Doing so will not create any problems. After the firmware is uploaded successfully, remove the bridge. This allows the device to boot normally.

You can test whether your device is in Programming Mode by attempting to read information from the ESP82xx chip. This requires `esptool.py`. Instructions on installing and using `esptool` are provided in the [Flashing article](Flashing#esptoolpy). For example (`COM5` will be your COM port):  
- `esptool.py -p COM5 read_mac` (It should read the MAC address. It may fail afterwards during Uploading and running a "stub". This is normal.)
- `esptool.py -p COM5 flash_id`

If everything went well, you are now in Programming Mode and ready to continue with [flashing](Flashing). If the flashing process is unable to start, disconnect the device and retry the steps.

## Common Mistakes
- Wire connections and solder joints - Double check all connections and also check for solder overflow.
- Use a USB _**data**_ cable - Some USB cables are for charging only and do not connect the data lines needed to load the firmware onto the device.
- Insufficient power delivered over the serial-to-USB adapter. This leads to flashing failures or corrupted flash altogether. Supply more power with a separate 3.3V power supply or get an adapter with a better power supply. Be sure all DC voltages use the same GND reference.
- Recheck your serial-to-USB adapter so to ensure that it supplies 3.3V voltage and **NOT 5V**. _**5V will damage the ESP chip!**_
- Releasing GPIO0 button/wire before booting is finished - It is safe to leave GPIO0 connected to GND during the entire programming process (erase & upload). Just be sure to remove the GPIO0 to GND bridge before booting the device for regular operation.
- Make sure that the RX pin is connected to the TX pin between the serial adapter and your ESP device, and vice versa.
- Erase the flash memory first and cycle power afterwards before uploading the Tasmota firmware binary. Not erasing can leave behind remnants of the previous flash contents which can interfere with the new firmware operation.

# Flashing

If you have read through the [Prerequisites](Prerequisites) you should have selected [a pre-compiled Tasmota firmware binary](Prerequisites#tasmota-firmware) or chosen to [compile your own Tasmota firmware binary](#flashing-and-compiling-from-source).

Once you have followed [Hardware preparation](Hardware-preparation), your device should be in Flash Mode and ready for a Tasmota firmware binary file to be flashed. For that you need a **flashing tool**.

Optionally, you may want to back up the device manufacturer's firmware. To do so, you must use esptool. Refer to the [instructions below](#optional-backup-firmware).

## Tasmota PyFlasher
<img src="https://raw.githubusercontent.com/tasmota/tasmota-pyflasher/v1/images/splash.png" width=300 align=right></img>
Tasmota PyFlasher is specifically designed for use with Tasmota binaries with an easy to use GUI. It is based on [NodeMcu Pyflasher](https://github.com/marcelstoer/nodemcu-pyflasher) and [esptool.py](https://github.com/espressif/esptool).

Download the [latest release](https://github.com/tasmota/tasmota-pyflasher/releases) for your platform (currently only Windows). Double click the downloaded file and it'll start, no installation required. Simple and fast...

![Tasmota PyFlasher UI](https://user-images.githubusercontent.com/5904370/68957676-d2399a00-07ca-11ea-9a21-3ef2fb7d4349.png)

1. Connect your device to the serial-to-USB adapter or plug in NodeMCU/D1 mini.
2. Select the correct **Serial port** (COM# port). Leave on auto-select if not sure.
3. **Browse** to the Tasmota firmware binary you downloaded or compiled.

:red_circle: Set **Erase flash** to **yes, wipe all data!!!** if it is the first time flashing Tasmota on the device or you're experiencing issues with the existing flash and need to do a full erase.    
**If you're upgrading an already flashed Tasmota and wish to keep your settings, set it to *no*.**

4. Click **Flash Tasmota** and wait until done.

If the flash was successful the _Console_ window will display: 

![Flash succeeded](https://user-images.githubusercontent.com/5904370/55690010-489c3100-598c-11e9-8135-e44469037e11.png)

Unplug your serial programming adapter or device and plug it back in or connect to another power source. Your device is now ready for [Initial configuration](Initial-Configuration). **For proper device initialization after the firmware upload completes, power down and power up the device.**

### Common mistakes
Message `COM# failed to connect: Failed to connect to Espressif device: Timed out waiting for packet header` means your device is not connected (recheck COM port number and USB cable) or not in flash mode (retry flash mode procedure for your device).  

Sometimes a "successful" flash will still result in a device that does not function as expected. If your device exhibits strange behaviors, we recommend that you use esptool.py to erase the flash as described below. And, if you are using esptool.py for erasing, you might as well upload the firmware that way as well. But definitely erase using esptool.py.

<a id="esptool"></a>
## esptool.py

Esptool is the official tool for flashing ESP8266 chips and is the most reliable. 

It requires Python, if you do not have an installed copy of Python 2.x or 3.x download and install it from https://www.python.org.

Download the [esptool Source code](https://github.com/espressif/esptool/releases) to a folder of your choice.
Go to the folder and install Esptool with command 
```bash
python setup.py install
```
Esptool for [Debian](https://packages.debian.org/stretch/esptool) and [Ubuntu](https://packages.ubuntu.com/cosmic/esptool) is installed with 
```bash
sudo apt install esptool
```

### Upload Tasmota
Make sure you followed the steps to put your device in flash mode. Place your chosen firmware binary file in the same folder as esptool.py.

Esptool uses the serial interface to communicate with your device. On Windows these interfaces are named COM1, COM2, etc. and on Linux they are named /dev/ttyUSB0, /dev/ttyUSB1, etc. Before using esptool, make sure you know which serial port your programming adapter is connected to.

The following use `COM5` as an example. Change `COM5` with your serial port designation.

Ensure the device is in flash mode before each step.

#### *Optional:* Backup firmware
Backup the current firmware with the following command:
```
esptool.py --port COM5 read_flash 0x00000 0x100000 fwbackup.bin
```
*When the command completes the device is not in flash mode anymore.* Repeat the process of putting your device in programming mode.

#### Erase flash memory
Erase the complete flash memory holding the firmware with the following command:
```
esptool.py --port COM5 erase_flash
```
It only takes a few seconds to erase 1M of flash.

*When the command completes the device is not in flash mode anymore.* Repeat the process of putting your device in programming mode.

#### Upload firmware
Load the chosen Tasmota firmware file with the following command (e.g., `tasmota.bin` in this example):

```
esptool.py --port COM5 write_flash -fs 1MB -fm dout 0x0 tasmota.bin
```

Unplug your serial programming adapter or your device and plug it back in or connect to another power source. Your device is now ready for [Initial configuration](Initial-Configuration). **For proper device initialization after the firmware upload completes, power down and power up the device.**

### Esptool executable
The executable version of esptool is maintained by Ivan Grokhotkov and releases are kept at [https://github.com/igrr/esptool-ck/releases](https://github.com/igrr/esptool-ck/releases). Supports Linux, Linux ARM, Windows 32-bit and Mac

#### Download and install
For the purpose of simplicity only the Windows version will be explained here, but the commands and parameters are the same for Windows, Linux and Mac.

Download the latest release of [Esptool-CK](https://github.com/igrr/esptool-ck/releases) and extract the compressed file to a folder of your choice.

### Upload Tasmota
Place your chosen firmware binary file (e.g., `tasmota.bin` in the example below) in the same folder as Esptool-CK to simplify the process.

The following commands use `COM5` as an example. Change `COM5` with your port designation.

Ensure the device is in flash mode before each step.

#### Erase flash memory  
```
esptool -cp COM5 -ce -v
```

#### Upload firmware
Once the erase is complete, put device back into programming mode and upload the firmware
```
esptool -cp COM5 -bm dout -cf tasmota.bin -v
```

Unplug your serial programming adapter or your device and plug it back in or connect to another power source. Your device is now ready for [Initial configuration](Initial-Configuration). **For proper device initialization after the firmware upload completes, power down and power up the device.**

## OTA Flashing Tools
**Tasmota is NOT a developer of these tools. For help and troubleshooting you will need to _get support from those projects_.**
- [**Tuya Convert**](Tuya-OTA) - easy OTA flash for devices with Tuya chips, no disassembly required
- [**Sonoff DIY**](Sonoff-DIY) - OTA flash for select Sonoff devices (some disassembly required)
- [**Node-RED OTA server and firmware manager**](https://flows.nodered.org/flow/888b4cd95250197eb429b2f40d188185) - [Node-RED](https://nodered.org/) flow for managing OTA updates 
- [**OTA over SCP**](OTA-over-SCP) - setup and configure "OTA over SCP" upload for PlatformIO
- [**Python HTTP OTA server**](Python-HTTP-OTA-Server) - setting up a small Python server to serve OTA upgrade binaries
- [**SonOTA**](SonOTA---Espressif2Arduino---Tasmota-without-compiling) - OTA flash eWeLink based devices *(mostly outdated)*

# Compiling From Source
Tutorials for setting up development environments if you want to modify the code or default settings and [compile your own binaries](compile-your-build).
- [**PlatformIO**](PlatformIO) -  setup and configure [PlatformIO](https://platformio.org) for compilation and upload
- [**PlatformIO CLI**](PlatformIO-CLI) - use the PlatformIO command line interface on Linux for compilation and upload
- [**PlatformIO-Core**](Create-your-own-Firmware-Build-without-IDE) - automate firmware builds using PlatformIO-Core and flash with esptool
- [**Visual Studio Code**](Visual-Studio-Code) -  setup and configure [Visual Studio Code](https://code.visualstudio.com) with PlatformIO for Tasmota
- [**Atom**](Beginner-Guide---Create-your-own-Firmware-Build) - beginner guide building Tasmota firmware using [Atom](https://atom.io/) with PlatformIO plugin
- [**Arduino IDE**](Arduino-IDE) - setup and configure Arduino IDE for Tasmota compilation and upload
- [**Docker Tasmota**](https://github.com/tasmota/docker-tasmota) - compile from a Docker container using PlatformIO

In PlatformIO, be sure that you always have the latest build of the ESP Core. 
Delete the following in your `.platformio` folder (`%USERPROFILE%\.platformio` in Windows):
- Everything in `.platformio/platforms`  
- All folders that begin with `framework...` in `.platformio/packages`  

### Online Compilers

?> **Can only create a firmware binary.** Use one of the [tools](Prerequisites#flashing-tool) to flash it to your device._

- [**Gitpod**](Compiling-Tasmota-on-Gitpod) - compile your own binary in the cloud using [Gitpod](https://www.gitpod.io/).  
- [**TasmoCompiler**](https://github.com/benzino77/tasmocompiler) - simple web GUI to compile Tasmota with your own settings

# Need More Help?
If you have encountered problems during flash see the [FAQ](FAQ). Ask for help in [Discord](https://discord.gg/Ks2Kzd4) or [Community Forum](https://groups.google.com/d/forum/sonoffusers)
