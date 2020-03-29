How to flash the Tasmota firmware onto a device using the `platformio` command line interface. This manual was tested on Ubuntu 17.10.

# Prerequisites
## Install Python and PIP
`sudo apt-get install python-pip`

## Install PlatformIO CLI
`sudo pip install -U platformio`

## Download the Tasmota source code

Either download the latest Tasmota Source code from https://github.com/arendst/Tasmota/ and extract it or clone the Git repository:  

'git clone https://github.com/arendst/Tasmota.git`

## Select the environment
The default environment configuration can be used to easily generate Tasmota firmware variants (sonoff, sensors, display, etc.). If you're not sure which binary is the right one for you, consult the [builds table](Builds) or just start with `tasmota.bin`. To build and/or flash exactly one of these, use the `-e` command line argument (e.g., `-e tasmota-sensors`). Alternatively, uncomment (i.e., remove the leading `;`) the desired *env_default* line in the *platformio.ini* file and do not use the `-e` argument on the command.
```
; *** Uncomment one of the lines below to build/upload only one environment
;default_envs = tasmota
;default_envs = tasmota-ircustom     ; alternative to 'tasmota' with full IR protocols activated, you will need to disable some features to keep code not too big
;default_envs = tasmota-minimal
;default_envs = tasmota-basic
;default_envs = tasmota-knx
;default_envs = tasmota-sensors
;default_envs = tasmota-display
;default_envs = tasmota-ir
;default_envs = tasmota-BG
;default_envs = tasmota-BR
;default_envs = tasmota-CN
;default_envs = tasmota-CZ
;default_envs = tasmota-DE
;default_envs = tasmota-ES
;default_envs = tasmota-FR
;default_envs = tasmota-GR
;default_envs = tasmota-HE
;default_envs = tasmota-HU
;default_envs = tasmota-IT
;default_envs = tasmota-KO
;default_envs = tasmota-NL
;default_envs = tasmota-PL
;default_envs = tasmota-PT
;default_envs = tasmota-RU
;default_envs = tasmota-SE
;default_envs = tasmota-SK
;default_envs = tasmota-TR
;default_envs = tasmota-TW
;default_envs = tasmota-UK 
```

# Compile and upload
Once all the prerequisites are in place, compiling and uploading is one simple command. Execute this from within the `Tasmota` source code directory:  

`platformio run -e <variant> --target upload --upload-port <port>`

Just make sure to replace `<port>` with the actual serial port your device is connected to. On Windows these interfaces are named COM ports (COM1, COM2, etc.). On Linux these interfaces are named [TTY ports](https://unix.stackexchange.com/questions/144029/command-to-determine-ports-of-a-device-like-dev-ttyusb0) (e.g., /dev/ttyUSB0, /dev/ttyUSB1, etc.)].

Depending on your configuration your user account [may need to be in the `dialout` group](https://askubuntu.com/questions/112568/how-do-i-allow-a-non-default-user-to-use-serial-device-ttyusb0).