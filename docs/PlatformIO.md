How to setup and configure PlatformIO for Tasmota compilation and upload.

## Download PlatformIO
Download PlatformIO from https://platformio.org/

## Install PlatformIO
Install PlatformIO to a known folder.

## Download Tasmota
Download the latest Tasmota Source code from https://github.com/arendst/Tasmota and unzip to another known folder.

## Compile Tasmota
Choose the Tasmota variant from the Platformio [menu](https://docs.platformio.org/en/latest/integration/ide/vscode.html#project-tasks).

## Upload Tasmota
PlatformIO uses the serial interface to upload the firmware to your device. On Windows these interfaces are named COM ports (COM1, COM2, etc.). On Linux these interfaces are named [TTY ports](https://unix.stackexchange.com/questions/144029/command-to-determine-ports-of-a-device-like-dev-ttyusb0) (e.g., /dev/ttyUSB0, /dev/ttyUSB1, etc.).

### Put device into programming mode
When performing a firmware upload do **not connect the device to AC**. Use a 3.3v DC power supply such as that provided by your serial programming adapter.

Put the device in programming mode by grounding pin GPIO0 and then applying power (e.g., connecting your computer to the serial adapter). Grounding pin GPIO0 can often be achieved by pressing the button on the device or using a wire between GPIO0 and GND if the button is not available. Deviations may apply.

### Perform serial upload
Select ``Upload`` from the menu.

NOTE: For a proper device initialization after first firmware upload power down and power up the device.
