## UFS - universal file system

Since ESP8266-12F has 4MB flash you can build a variant with a `filesystem` and store your files there (data, images, commands, etc).<br>
The file partition does NOT get erased by reset commands or factory default. Only a flash erase will wipe it.<br>
There are some special files that you can upload and use to execute actions.

## How to activate UFS ?

**You need to compile your firmware to activate this feature:**

Copy `platformio_override_sample.ini` as `platformio_override.ini`

Activate/uncomment one line.<br>
`board_build.ldscript = eagle.flash.4m2m.ld` for 2Mb file system<br>
`board_build.ldscript = eagle.flash.4m1m.ld` for 1Mb file system

Add or uncomment `#define ...` lines in your `user_config_override.h`:
```
// UFS filesystem
#define USE_UFILESYS
// This line will allow to delete files from GUI
#define GUI_TRASH_FILE
```
Compile, flash and you will find a new entry in Tasmota web GUI menu:
Configuration - Manage File system.
![fs-1](https://user-images.githubusercontent.com/18531150/113911368-31da8000-97da-11eb-8f57-b08f371bdfd3.jpg)
![fs-2](https://user-images.githubusercontent.com/18531150/113911396-3868f780-97da-11eb-8726-d720180e013c.jpg)
![fs-3](https://user-images.githubusercontent.com/18531150/113980065-58ce9b80-9846-11eb-9f4b-a1c6b199e8fb.jpg)

**UFS commands** can be found here:<br>
https://tasmota.github.io/docs/Commands/#ufs

**Berry scripting language** can benefit from UFS,
more info here:<br>
https://tasmota.github.io/docs/Berry-Scripting/#loading-code-from-filesystem

## Special files

**autoexec.bat**

Stores commands that will be executed at every boot, similar to the backlog commands in rules trigger at `System#Boot`.<br>
Almost any commands can be used.<br>
However, avoid commands that will make the device to reboot (examples: changing Wifi setting, MQTT settings, Templates & GPIO, etc)
otherwise it will reboot continuously (in fact 3 or 4 times then autoexec will be disabled after boot loop detection).<br>
Commands must be kept to one command per line; they will be executed sequentially.

**display.ini**

Stores data that will be displayed at every boot, similar to the DisplayText commands in rules trigger at `System#Init` (as long as you have a display driver initializated).<br>
example:
```
; clr screen
[z]
; draw full screen picture - corona.rgb file must exist in UFS storage
[x0y0P/corona.rgb]
; define index color
[dc19:31000]
; draw transparent text with new index color
[x60y30f2Ci19D2]Tasmota
```
