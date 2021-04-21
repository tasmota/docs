How to flash the Tasmota firmware onto a device using the `platformio` command line interface. This manual was tested on Ubuntu 17.10.

# Prerequisites
## Install Python and PIP
`sudo apt-get install python-pip`

## Install PlatformIO CLI
`sudo pip install -U platformio`

## Download the Tasmota source code

Either download the latest Tasmota Source code from https://github.com/arendst/Tasmota/ and extract it or clone the Git repository:  

`git clone https://github.com/arendst/Tasmota.git`

## Select the environment
The default environment configuration can be used to easily generate Tasmota firmware variants (tasmota, sensors, display, etc.). If you're not sure which binary is the right one for you, consult the [builds table](Builds) or just start with `tasmota.bin`. To build and/or flash exactly one of these, use the `-e` command line argument (e.g., `-e tasmota-sensors`). 

# Compile and upload
Once all the prerequisites are in place, compiling and uploading is one simple command. Execute this from within the `Tasmota` source code directory:  

`platformio run -e <variant> --target upload --upload-port <port>`

Just make sure to replace `<port>` with the actual serial port your device is connected to. On Windows these interfaces are named COM ports (COM1, COM2, etc.). On Linux these interfaces are named [TTY ports](https://unix.stackexchange.com/questions/144029/command-to-determine-ports-of-a-device-like-dev-ttyusb0) (e.g., /dev/ttyUSB0, /dev/ttyUSB1, etc.)].

Depending on your configuration your user account [may need to be in the `dialout` group](https://askubuntu.com/questions/112568/how-do-i-allow-a-non-default-user-to-use-serial-device-ttyusb0).
