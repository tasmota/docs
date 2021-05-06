description: Getting started with Tasmota. What you need, how to install and do initial configuration.

## Prerequisites
### Needed Hardware

<img style="float:right;width:250px" src="../_media/esp8266.png"></img>

#### ESP8266 or ESP8285 Device
Any [variation](https://en.wikipedia.org/wiki/ESP8266#Espressif_modules) of the [ESP8266 chip](https://www.espressif.com/en/products/hardware/esp8266ex/overview) can be flashed with Tasmota.

#### Serial-to-USB Adapter
The [power supplied to the device](https://www.letscontrolit.com/wiki/index.php?title=Power) is **one of the most important elements** for both flashing the device and for stable operation. You must ensure that the device receives sufficient power (current AND appropriate voltage level) to properly flash the firmware on the device.

* [CH340G](https://cdn.sparkfun.com/datasheets/Dev/Arduino/Other/CH340DS1.PDF) is a reliable and very cheap adapter (example [1](https://www.sparkfun.com/products/14050), [2](https://www.aliexpress.com/item/1PCS-CH340-module-instead-of-PL2303-CH340G-RS232-to-TTL-module-upgrade-USB-to-serial-port/32761423124.html)).
<img src="../_media/ch340g.png" style="margin:5px;float:right;width:200px"></img>
* [FTDI FT232](https://www.ftdichip.com/Products/ICs/FT232R.htm) - these adapters have a lot of fakes in the market so buy only from reliable sources ([example](https://www.sparkfun.com/products/13746)). Buy only the variant with a separate 3.3V regulator on PCB! 
* [CP2102](https://www.silabs.com/documents/public/data-sheets/cp2102-9.pdf) or [PL2303](http://www.prolific.com.tw/UserFiles/files/ds_pl2303HXD_v1_4_4.pdf) - works with certain devices, but using an external 3.3V supply might be necessary. Not recommended for beginners!
* [RaspberryPi](Flash-Sonoff-using-Raspberry-Pi) - only for advanced users. External 3.3V supply necessary.
* [NodeMCU](https://en.wikipedia.org/wiki/NodeMCU) and [D1 mini](https://cleanuri.com/x60JQ9) (Pro/Lite) boards have a micro USB upload port and don't require an adapter.
* [NodeMCU](https://en.wikipedia.org/wiki/NodeMCU) You can also use a NodeMCU (or similar) as a good Serial-to-USB adapter, if you disable the onboard ESP8266 by bridging the RST and GND pins, and connect TX/RX straight instead of crossed.

!!! note 
    Don't forget to install drivers for your serial-to-USB adapter.

!!! danger
    Some adapters can be switched between 3.3V and 5V for the data pins, but still provide 5V on the power pin which will fry your       device.  You MUST make sure both the data and VCC pins are set for 3.3V.

#### Soldering Tools
To solder you'll of course need a soldering iron, soldering tin and some flux. If you're new to soldering check out some soldering tutorial videos while you're at it.

If you're intimidated by soldering you could get away with holding the headers with jumper wires in the pin holes during flashing but it is not a fool proof process and flashing might fail.
#### Jumper wires

You could use any kind of wire but [jumper wires](http://blog.sparkfuneducation.com/what-is-jumper-wire) (also called DuPont wires) are more practical than soldering and desoldering.

#### Pin Headers
<img src="../_media/pinheaders.png" style="margin:5px;float:right;width:10em"></img>

[Pin headers](https://learn.sparkfun.com/tutorials/connector-basics/pin-header-connectors) come in male or female version. Choose according to your jumper wire connectors.
#### Computer with Linux, Windows or MacOS
You need a computer with a USB port to upload the firmware to your device and configure it.
#### Smartphone
Tasmota installed from a precompiled binary needs to be configured to work with your Wi-Fi network before you can access the Tasmota web UI. This is usually done by connecting to a Tasmota Wi-Fi Access Point with your smartphone (or tablet or computer with Wi-Fi). 

### Needed Software
#### Tasmota Firmware Binary
Download a Tasmota firmware binary file (.bin). If you're not sure which binary is the right one for you just start with `tasmota.bin` or consult the [builds table](Builds) to see which features you need. 

Official release binaries can be downloaded from [firmware server](http://ota.tasmota.com/tasmota/release/). 

Latest _**development**_ branch binaries are available only from our [OTA server](http://ota.tasmota.com/tasmota). The latest merged development code is compiled hourly. 

#### Flashing Tool
- [**Tasmotizer**](https://github.com/tasmota/tasmotizer) - NEW flashing and firmware download tool just for Tasmota. (Windows, Linux or Mac)
- [**Tasmota PyFlasher**](https://github.com/tasmota/tasmota-pyflasher) - flashing tool intended for Tasmota. (Windows or Mac)
- [**ESP-Flasher**](https://github.com/Jason2866/ESP_Flasher) - GUI flasher for Tasmota based on esptool.py for ESP82XX *and* ESP32. (Windows or Mac)
- [**NodeMCU PyFlasher**](https://github.com/marcelstoer/nodemcu-pyflasher) - easy to use GUI flasher based on esptool.py. (Windows or Mac)
- [**Esptool.py**](https://github.com/espressif/esptool) - the official flashing tool from Espressif. (Requires Python)
- [**Esptool executable**](https://github.com/igrr/esptool-ck) - Esptool in executable form, no Python required. (Windows, Linux or Mac)

#### Serial Terminal
A program that connects to your Tasmota device directly over the serial connection you used to flash it.

This is an optional way to configure your device using [Commands](Commands) and [Backlog](Commands#the-power-of-backlog). 

* **[Termite](https://www.compuphase.com/software_termite.htm)** - simple terminal for windows
* **[Termie](http://termie.sourceforge.net/)** - open source clone of Termite
* **[Putty](https://www.putty.org/)** - popular client available on every platform
* **[Minicom](https://www.acmesystems.it/minicom)** - one of many Linux terminals

!!! tip 
    Enable _local echo_ so that you can see what is typed and transmitted to the device. Enable **Append CR+LF** since every request needs to end with `<CR><LF>`. 

### MQTT Knowledge
Tasmota is designed to be controlled and communicate via [MQTT](http://mqtt.org/). To use it to its fullest potential you need an [MQTT broker](https://www.hivemq.com/blog/mqtt-essentials-part-3-client-broker-connection-establishment/). 

Read our [article on MQTT](MQTT) to learn why it is essential in Tasmota.

### Compiling Tools <small>(Optional)</small>
If you want to modify the code or default settings and [compile your own Tasmota firmware](Compile-your-build).

## Hardware Preparation

We need to connect to the serial programming interface of the ESP8266 chip. This is done by connecting our serial-to-USB converter TX and RX pins to the ESP8266 RX and TX pins and powering the chip with the 3.3V and GND pins.

In most cases those pins are available on the PCB in the form of pin holes or solder pads but pin headers or jumper wires need to be soldered or otherwise applied. In some cases you will need to solder wires directly on the chip's pins which requires some experience and good soldering equipment.

!!! failure "BEWARE!"
    DO NOT CONNECT DEVICES TO MAINS POWER WHILE THE COVER IS OPEN AND CIRCUIT BOARD IS EXPOSED!!!

<img alt="Sonoff Pow Bricked" src="../_media/pow1.jpg" style="margin:5px;float:right;width:240px">

==**NEVER TRY TO FLASH WHILE YOUR DEVICE IS CONNECTED TO MAINS POWER!!!**==

==**YOU CAN BE ELECTROCUTED IF YOU DON'T KNOW WHAT YOU ARE DOING!**==

If you are not careful, your own health will be in danger. Shorting your serial interface with mains AC power will fry your device and serial adapter and will also harm or destroy your computer. It is important to _**always have all mains power cables disconnected from the device**_ while being connected via serial or even while the case of the device is opened.

### Serial Connection
Each device has its pins labelled differently. If the labelling isn't visible on the PCB please refer to the devices flashing guide or search the Internet for correct pin locations. Device specific instructions and restrictions are documented in the [Tasmota Device Templates Repository](https://templates.blakadder.com/). Pinouts for commonly used Wi-Fi modules are [found here](Pinouts.md)

When you have identified pins on your device, connect wires according to the table:

|Serial adapter  | ESP8266 device |
|-----------:|:-------------------|
|        3V3 | 3V3 or VCC         |
|         TX | RX                 |
|         RX | TX                 |
|        GND | GND                |

**Note that TX from your adapter goes to RX on the ESP8266 device and RX from adapter goes to TX on the device!**
![Image courtesy of https://www.domo-blog.fr/](https://user-images.githubusercontent.com/5904370/57880182-69bf2f80-781e-11e9-8953-88599cb89155.png)

<!--
#### Serial Connection using NODEMCU ESP8266
You can use the USB-to-serial adaptor of a NODEMCU (and probably other ESP8266 boards with a serial chip). You do not need to overwrite the existing firmware of your NODEMCU so it can be done using one already pre-installed with Tasmota - when you unplug and reset the NODEMCU it will revert to its previous state. 

!!! tip
    If your NodeMCU or similar ESP8266 module does not respond to the flash commands, you can try to "unbrick" it like that:    
    + connect GPIO 0 (D3 on the D1 mini WEMOS) to GND    
    + connect GPIO 15 (D8 on the D1 mini WEMOS) to GND    
    + connect GPIO 2 (D4 on the D1 mini WEMOS) to 3.3V    

Simply connect the EN pin to ground to prevent the ESP8266 chip on your NODEMCU from starting. Then connect as a normal USB-to-serial *except* connect TX to TX and RX to RX, ie no crossover required. 

|NODEMCU  | ESP8266 device |
|-----------:|:-------------------|
|        3V3 | 3V3 or VCC         |
|         RX | RX                 |
|         TX | TX                 |
|        GND | GND                |
-->

### Programming Mode
<img alt="Typical GPIO0 Location" src="https://raw.githubusercontent.com/tasmota/docs/master/docs/_media/gpio0.png" style="margin:5px;float:right;width:180px"></img>

ESP8266 needs to be put into **programming mode** or **flash mode** before the firmware can be uploaded. This is done by pulling the GPIO0 pin to GND while the chip is booting. 

On most devices the installed control button is connected to GPIO0 and GND, making entering Programming Mode very easy. On others you will need to bridge the pins on the PCB or directly on the chip with a jumper wire. GPIO0 is always in the same location on ESP8266 and ESP8285!

Device specific instructions are documented in [Tasmota Device Templates Repository](https://templates.blakadder.com/).

To put the ESP8266 into Programming Mode:

1. Disconnect serial-to-USB adapter and power
2. Bridge GPIO0 and GND (by pressing the on-board button or connection with a wire)
3. Connect the serial-to-USB adapter to your computer
4. After a few seconds disconnect GPIO0 from GND (release button or remove the wire connection). On devices that do not provide the GPIO0 connected button, it may be easier and there are no problems leaving the wired bridge in place throughout the entire flashing process (erase & upload). After the firmware is uploaded successfully, remove the bridge so the device will boot normally into **run mode**.

You can test whether your device is in Programming Mode by attempting to read information from the ESP82xx chip. This requires `esptool.py`. Instructions on installing and using `esptool` are provided [below](#esptoolpy). For example (`COM5` will be your COM port):  

- `esptool.py -p COM5 read_mac` (It should read the MAC address. It may fail afterwards during Uploading and running a "stub". This is normal.)
- `esptool.py -p COM5 flash_id`

If everything went well, you are now in Programming Mode and ready to continue with [flashing](#flashing). If the flashing process is unable to start, disconnect the device and retry the steps.

### Common Mistakes
- Wire connections and solder joints - Double check all connections and also check for solder overflow.
- Use a USB _**data**_ cable - Some USB cables are for charging only and do not connect the data lines needed to load the firmware onto the device.
- Insufficient power delivered over the serial-to-USB adapter. This leads to flashing failures or corrupted flash altogether. Supply more power with a separate 3.3V power supply or get an adapter with a better power supply. Be sure all DC voltages use the same GND reference.
- Recheck your serial-to-USB adapter so to ensure that it supplies 3.3V voltage and **NOT 5V**. _**5V will damage the ESP chip!**_
- Releasing GPIO0 button/wire before booting is finished - It is safe to leave GPIO0 connected to GND during the entire programming process (erase & upload). Just be sure to remove the GPIO0 to GND bridge before booting the device for regular operation (**run mode**).
- Make sure that the RX pin is connected to the TX pin between the serial adapter and your ESP device, and vice versa.
- Erase the flash memory first and cycle power afterwards before uploading the Tasmota firmware binary. Not erasing can leave behind remnants of the previous flash contents which can interfere with the new firmware operation.

## Flashing

If you have followed [Hardware preparation](#hardware-preparation), your device should be in Flash Mode and ready for a Tasmota firmware binary file to be flashed. For that you need a **flashing tool**.

!!! tip 
    You may want to back up the device manufacturer's firmware on the one in a million chance you don't like Tasmota.


### Tasmotizer!
Tasmotizer! is specifically designed for use with Tasmota with an easy to use GUI and [esptool.py](https://github.com/espressif/esptool) under the hood.

Download the [latest release](https://github.com/tasmota/tasmotizer/releases) for your platform. In Windows just double click the downloaded file and it'll start, no installation required. For python follow the installation [instructions](https://github.com/tasmota/tasmotizer#installation-and-how-to-run). 

!!! tip "[Video tutorial](https://youtu.be/hIwIhu5OWiA) by SuperHouseTV"

!!! note 
    If you get an anti-virus infection warning don't fret, it is a [known false positive](https://stackoverflow.com/questions/43777106/program-made-with-pyinstaller-now-seen-as-a-trojan-horse-by-avg). If you're still apprehensive you can always run the Python version. 

**It is time to Tasmotize!**

![Tasmotizer UI](_media/tasmotizer1.png)

1. Connect your device to the serial-to-USB adapter or plug in NodeMCU/D1 mini.
1. Check whether the correct **serial port** (COM or tty port) is selected. Tasmotizer! will try its best to select the right one for you.
1. Choose Tasmota firmware binary:
   * **BIN file** - browse to the Tasmota firmware binary you downloaded or compiled.
   * **Release** - select from a list of available release binaries
   * **Development** - select from a list of latest development binaries
4. _optional_ Backup the original device firmware
5. Erase flash

!!! danger 
    Leave *Erase before flashing* checked if it is the first time flashing Tasmota on the device or you're experiencing issues with the existing flash and need to do a full erase. If you're upgrading an already flashed Tasmota and wish to keep your settings, uncheck *Erase before flashing*.

6. Click **Tasmotize** and wait until done.

![Tasmotizer progress](_media/tasmotizer2.png)

If the flash was successful it will display: 

![Tasmotizer success](_media/tasmotizer3.png)

Unplug your serial programming adapter or device and plug it back in or connect to another power source. 

<!-- ## Tasmota PyFlasher
<img src="https://raw.githubusercontent.com/tasmota/tasmota-pyflasher/v1/images/splash.png" style="margin:5px;float:left;width:150px"></img>
Tasmota PyFlasher is specifically designed for use with Tasmota binaries with an easy to use GUI. It is based on [NodeMcu Pyflasher](https://github.com/marcelstoer/nodemcu-pyflasher) and [esptool.py](https://github.com/espressif/esptool).

Download the [latest release](https://github.com/tasmota/tasmota-pyflasher/releases) for your platform (currently only Windows). Double click the downloaded file and it'll start, no installation required. Simple and fast...

![Tasmota PyFlasher UI](https://user-images.githubusercontent.com/5904370/68957676-d2399a00-07ca-11ea-9a21-3ef2fb7d4349.png)

1. Connect your device to the serial-to-USB adapter or plug in NodeMCU/D1 mini.
2. Select the correct **Serial port** (COM# port). Leave on auto-select if not sure.
3. **Browse** to the Tasmota firmware binary you downloaded or compiled.

> [!DANGER] Leave *Erase flash* on *yes, wipe all data!!!* if it is the first time flashing Tasmota on the device or you're experiencing issues with the existing flash and need to do a full erase. If you're upgrading an already flashed Tasmota and wish to keep your settings, set it to *no*.

4. Click **Flash Tasmota** and wait until done.

If the flash was successful the _Console_ window will display: 

![Flash succeeded](https://user-images.githubusercontent.com/5904370/55690010-489c3100-598c-11e9-8135-e44469037e11.png)

The device can be powered up with another power source but if the serial programming adapter is used, and GPIO0 and GND are connected with a wired bridge, then remove the bridge before powering up the device into **run mode**. Your device is now ready for [Initial configuration](#initial-configuration).  -->

### esptool.py

Esptool is the official Espressif tool for flashing ESP8266 chips. It requires Python, if you do not have an installed copy of Python 2.x or 3.x download and install it from https://www.python.org.

Download the [esptool Source code](https://github.com/espressif/esptool/releases) to a folder of your choice.
Go to the folder and install Esptool with command 
```
python setup.py install
```

#### Upload Tasmota
Make sure you followed the steps to put your device in flash mode. Place your chosen firmware binary file in the same folder as esptool.py.

Esptool uses the serial interface to communicate with your device. On Windows these interfaces are named COM1, COM2, etc. and on Linux they are named /dev/ttyUSB0, /dev/ttyUSB1, etc. Before using esptool, make sure you know which serial port your programming adapter is connected to.

The following use `COM5` as an example. Change `COM5` with your serial port designation.

Ensure the device is in flash mode before each step.

#### Backup Firmware <small>(optional step)</small>
Backup the current firmware with the following command:
```
esptool.py --port COM5 read_flash 0x00000 0x100000 fwbackup.bin
```
*When the command completes the device is not in flash mode anymore.* Repeat the process of putting your device in programming mode.

#### Erase Flash Memory
Erase the complete flash memory holding the firmware with the following command:
```
esptool.py --port COM5 erase_flash
```
It only takes a few seconds to erase 1M of flash.

*When the command completes the device is not in flash mode anymore.* Repeat the process of putting your device in programming mode.

#### Upload Firmware
Load the chosen Tasmota firmware file with the following command (e.g., `tasmota.bin` in this example):

```
esptool.py --port COM5 write_flash -fs 1MB -fm dout 0x0 tasmota.bin
```

!!! tip "For proper device initialization after the firmware upload completes, power down and power up the device."

The device can be powered up with another power source but if the serial programming adapter is used, and GPIO0 and GND are connected with a wired bridge, then remove the bridge before powering up the device into **run mode**. Your device is now ready for [Initial configuration](#initial-configuration). 

### Esptool Executable
The executable version of esptool is maintained by Ivan Grokhotkov and releases are kept at [https://github.com/igrr/esptool-ck/releases](https://github.com/igrr/esptool-ck/releases). Supports Linux, Linux ARM, Windows 32-bit and Mac

#### First Step
For the purpose of simplicity only the Windows version will be explained here, but the commands and parameters are the same for Windows, Linux and Mac.

Download the latest release of [Esptool-CK](https://github.com/igrr/esptool-ck/releases) and extract the compressed file to a folder of your choice.

Place your chosen firmware binary file (e.g., `tasmota.bin` in the example below) in the same folder as Esptool-CK to simplify the process.

The following commands use `COM5` as an example. Change `COM5` with your port designation.

Ensure the device is in flash mode before each step.

#### Erase Flash Memory  
```
esptool -cp COM5 -ce -v
```

#### Upload firmware
Once the erase is complete, put device back into programming mode and upload the firmware
```
esptool -cp COM5 -bm dout -cf tasmota.bin -v
```

!!! tip "For proper device initialization after the firmware upload completes, power down and power up the device."

The device can be powered up with another power source but if the serial programming adapter is used, and GPIO0 and GND are connected with a wired bridge, then remove the bridge before powering up the device into **run mode**. Your device is now ready for [Initial configuration](#initial-configuration). 

#### OTA Conversion
**Tasmota is NOT a developer of these tools. For help and troubleshooting you will need to _get support from those projects_.**

- [**Tuya-Convert**](Tuya-Convert) - easy OTA flash for devices with Tuya chips, no disassembly required
- [**Sonoff DIY**](Sonoff-DIY) - OTA flash for select Sonoff devices (some disassembly required)

You've successfully flashed your device with a downloaded binary of Tasmota but now you need to connect the tasmotised device to your Wi-Fi network. 

## Initial Configuration
### Using Web UI
#### Configure Wi-Fi 
Tasmota provides a wireless access point for easy Wi-Fi configuration. 

!!! note "If you flashed using Tuya Convert this is the only option to set up your device."

<img alt="Tasmota AP" src="../_media/wificonfig1.jpg" style="margin:10px;float:left;width:250px"></img>Connect your device to a power source and grab your smartphone (or tablet or laptop or any other web and Wi-Fi capable device). Search for a Wi-Fi AP named _**tasmota_XXXXXX-####**_ (where _XXXXXX_ is a string derived from the device's MAC address and _####_ is a number) and connect to it. _In this example the Wi-Fi AP is named **tasmota_3D5E26-7718**._ 

When it connects to the network, you may get a warning that there is no Internet connection and be prompted to connect to a different network. _Do not allow the mobile device to select a different network_.

<p></p>

!!! warning 
    Wi-Fi manager server is active for only 3 minutes. If you miss the window you might have to disconnect your device from power and reconnect.

<img alt="Sign in to Wi-Fi Network" src="../_media/wificonfig2.jpg" style="margin:5px;float:right;width:300px"></img>
After you have connected to the Tasmota Wi-Fi AP, open `http://192.168.4.1` in a web browser on the smartphone (or whatever device you used). 
Depending on the phone, it will take you to the Tasmota configuration page automatically, or you will get a prompt to *sign in to Wi-Fi network* or *authorize*. Tapping on the AP name should also open the configuration page.

<img alt="Tasmota AP" src="https://user-images.githubusercontent.com/5904370/68961890-a242c480-07d3-11ea-912f-b45464104f2c.png" style="margin:5px;float:right;width:300px"></img> 
At this page you can have Tasmota scan for available Wi-Fi networks. Select the right network from the list or enter the following:

**AP1 SSid** - your Wi-Fi network name  
_SSID's are case sensitive_

**AP1 Password** - password for your Wi-Fi AP    
Wi-Fi password has to be under 32 characters and without special characters (e.g. asterisks) or white spaces

*Recommended:*   
**AP2 SSid** - alternative Wi-Fi network SSID   
**AP2 Password** - password for your alternative Wi-Fi AP   

Click the checkbox to see the password you enter to ensure that it is correct and that your mobile device has not inadvertently capitalized the first letter if it is supposed to be lower case nor autocorrected what you entered. ~~Double~~ **Triple check the Wi-Fi credentials** and click on **Save** to apply the settings. The device will restart and connect to your home network. The _tasmota_XXXXXX-####_ network will not longer be present. Therefore your smartphone will automatically be disconnected and should connect back to its data network.

!!! tip
    If you're not using a second Wi-Fi network you can enter an SSID without a password you can connect to as a backup in case something went wrong with your Wi-Fi credentials.

#### Configure MQTT
Look in your router for a newly connected device with the same name as the Wi-Fi access point. _In our example it is **tasmota_3D5E26-7718**._

!!! tip " `tasmota_XXXXXX` is also the firmware default MQTT topic for that device"

If you don't have access to your router you can find your newly flashed device with an IP scanner:

* [Fing](https://www.fing.com/products/) - for Android or iOS
* [Angry IP Scanner](https://angryip.org/) - open source for Linux, Windows and Mac. Requires Java.
* [Super Scan](https://sectools.org/tool/superscan/) - Windows only too (free)
* [Tasmota Device Locator](http://tasmota.simplethings.work/) - Browser-based

Open the IP address with your web browser and you have full access to Tasmota.

Now is the time to set up [MQTT](MQTT) and the last remaining, but equally important, step:

#### Configure Template or Module

Configure your device using [Templates](Templates) in **Configuration - Configure Template** or [Modules](Modules) in **Configuration - Configure Module**.

Your device running Tasmota is now ready to be [controlled](Commands).

!!! quote "Check out all the supported devices in [Tasmota Device Templates Repository](https://templates.blakadder.com/)"

#### Configure Other (optional)

Configure your device name which is displayed in webUI and used for [Home Assistant autodiscovery](Home-Assistant.md). 

Configure web admin password for the webUI. Default username is `admin`. This type of security is rudimentary since Tasmota doesn't use HTTPS, do not expose your device outside of your local network.


### Using Serial Terminal
If you flashed the device using serial-to-USB adapter (or it is a NodeMCU/D1 mini) you can take advantage of the existing connection and configure your device over the serial connection using [Commands](Commands).

First you will need a [Serial Terminal](#serial-terminal) program. 

*In this example [Termite](https://www.compuphase.com/software_termite.htm) on Windows is used.*

Download Termite and extract the .exe file, no installation necessary. Connect your serial-to-USB adapter or NodeMCU/D1 mini to the computer.

![Termite setup](https://user-images.githubusercontent.com/5904370/55745914-abe39d00-5a38-11e9-91d8-1b8e16ed34d3.png)

Open Termite and set it to the proper COM port (*Termite selects the first available port by default*). 
Set Baud rate to 115200 and Forward to none. 

![First boot](https://user-images.githubusercontent.com/5904370/55746947-5e1c6400-5a3b-11e9-871f-11ac80e40205.png)

Connect your device to the serial-to-USB adapter. You should see the initial boot output in Termite.
If your screen is empty type `status` in the bottom command bar and hit enter. If you get a return message from your device similar to the one displayed under purple `status` you're all set.

To configure Tasmota you need to issue commands, some commands will reboot your device and to avoid that we will use the `Backlog` command feature.

Configure your Wi-Fi network and a secondary Wi-Fi network
```console
Backlog ssid1 <yourssid>; password1 <your_password>; ssid2 <your_ssid2>; password2 <your_password>
```
![After restart](https://user-images.githubusercontent.com/5904370/55748616-69718e80-5a3f-11e9-8b58-4d15c1816e71.png)

Device will restart and connect to your network. It will display your devices newly assigned IP. Direct your web browser to that IP address to access the Web UI for further configuration and contol.

Configure MQTT broker address, MQTT credentials, unique device topic and OTA url to the latest official release
```console
Backlog mqtthost <yourhost>; mqttuser <user>; mqttpassword <password>; topic <unique_topic>; otaurl http://ota.tasmota.com/tasmota/release/tasmota.bin
```
!!! tip 
    Keep your personal configuration in a text file and simply copy and paste the backlog commands to a newly flashed device.

## Final Configuration
Your device is connected to your network and to the MQTT broker. One last thing to do is configure your device using [Templates](Templates) in **Configuration - Configure Template** or [Modules](Modules) in **Configuration - Configure Module**. 

!!! quote "Check out all the supported devices in [Tasmota Device Templates Repository](https://templates.blakadder.com/)"

!!! warning
     If you experience power fluctuations in your power grid its best to immediately disable [Power Cycle Recovery](Device-Recovery#fast-power-cycle-device-recovery) feature with command [`SetOption65 1`](Commands.md#setoption65) immediately or you might end up with firmware defaults on your device.

[Commands](Commands) and Backlog are powerful and in time you can learn to configure almost everything (NTP servers, longitude and latitude, custom device options, etc) with a few copy and paste moves.
