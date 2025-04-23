How to setup and configure Esptool for Tasmota upload on an esp8266

The information below is for the Python version of esptool - If you want to use the Windows/Linux/OSX(MAC) executable version of esptool (as would be included in Arduino ESP8266 cores) then please go to the [esptool executable (Windows, MacOs and Linux)](#esptool-executable-windows-macos-and-linux) section at the bottom.

## Download Esptool
If you do not have an installed copy of Python download and install it from <https://www.python.org/>.

Download Esptool Source code from <https://github.com/espressif/esptool/releases> to a known folder.

## Install Esptool
Go to the known folder and install Esptool with command ``python setup.py install``.

Packages for Esptool are maintained for [Debian](https://packages.debian.org/stretch/esptool) and [Ubuntu](https://packages.ubuntu.com/cosmic/esptool) and can be installed with `sudo apt install esptool`.

## Download Tasmota
Download the latest Tasmota release firmware file [tasmota.bin](http://ota.tasmota.com/tasmota/release/) to a known folder. 

## Upload Tasmota

### Put device in firmware upload mode
When performing a firmware upload do **not connect the device to AC** but use the power supply provided by your (FTDI type) serial interface.

Put the device in firmware upload mode by grounding pin GPIO00 while applying power.

Grounding pin GPIO00 can often be achieved by pressing button 1 on the Sonoff device or using a wire between GPIO00 and Gnd if the button is not available. Deviations may apply.

Connect the serial interface of your PC to the device while GPIO00 to Gnd.

Esptool uses the serial interface to communicate with your device. On Windows these interfaces are named COM1, COM2 etc. On Linux these interfaces are called /dev/ttyUSB0, /dev/ttyUSB1 etc.

Before using Esptool make sure you know to which serial interface name your device is connected to.

In the following commands I use COM5 as an example.

### Optional: Backup firmware
Ensure the device is in firmware upload mode.

Backup the current firmware with the following command:
```
esptool.py --port COM5 read_flash 0x00000 0x100000 image1M.bin
```
NOTE: When the command completes the device is out of firmware upload mode!

### Erase firmware
Ensure the device is in firmware upload mode.

Erase the complete flash memory holding the firmware with the following command:
```
esptool.py --port COM5 erase_flash
```
NOTE1: When the command completes the device is out of firmware upload mode!

NOTE2: It only takes a few seconds to erase 1M of flash.

### Upload firmware
Ensure the device is in firmware upload mode.

Load the downloaded Tasmota firmware file *tasmota.bin* with the following command:

```
esptool.py --port COM5 write_flash -fs 1MB -fm dout 0x0 tasmota.bin
```
NOTE1: When the command completes the device is out of firmware upload mode!

NOTE2: For a proper device initialization after first firmware upload power down and power up the device.

### ESPTOOL Executable (Windows, MacOs and Linux)

The executable version of esptool can be downloaded from [https://github.com/espressif/esptool/releases](https://github.com/espressif/esptool/releases)

### Download and Install

For the purpose of simplicity only the Windows version will be explained here, but the command and parameters are the same for Windows, Linux and MAC/OSX.

Download the latest release from [https://github.com/espressif/esptool/releases](https://github.com/espressif/esptool/releases) and extract the compressed file to a known location.

### Download Tasmota

Download the latest Tasmota release firmware file [tasmota.bin](http://ota.tasmota.com/tasmota/release/) to a known folder (The same folder as where you have the esptool executable will work well for this process to be simpler)

If you want features from the current development codebase which has not been included in the last release please download this [tasmota.bin](http://ota.tasmota.com/tasmota/) to a known folder (The same folder as where you have the esptool executable will work well for this process to be simpler)

The information posted further up in this Wiki for placing the device into bootload / firmware upgrade mode may be followed as this process does not change irrespective whether you use the Python or executable version of esptool.

Once the device is in firmware upload mode the following commands are recommended for completion of the firmware flashing.

Erase the flash completely with the following command (substituting the COM port for the one which was used on your computer)

`esptool.exe --port COM5 erase_flash`

Once the erase is complete, reset your device back into programming mode and then upload the firmware using the following command

`
esptool.exe --port COM5 write_flash -fs 1MB -fm dout 0x0 tasmota.bin`


