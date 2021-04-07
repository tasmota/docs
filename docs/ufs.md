## UFS - universal file system

Since ESP8266-12F has 4MB flash you can build a variant with a `filesystem` and store your files there (data, images, commands, etc).<br>
The file partition does NOT get erased by reset commands or factory default. Only a flash erase will wipe it.<br>
There are some special files that you can upload and use:<br>

**autoexec.bat**<br>
Stores commands that will be executed at every boot.<br>
Almost any commands can be used.<br>
However, avoid commands that will make the device to reboot (examples: changing Wifi setting, MQTT settings, Templates & GPIO, etc)<br>
otherwise it will reboot continuously (in fact 3 or 4 times then autoexec will be disabled after boot loop detection)<br>
Commands must be kept to one command per line; they will be executed sequentially.<br>

**display.ini**<br>
Stores data that will be displayed at every boot (as long as you have a display attached).<br>
example:<br>
```; clr screen
[z]
; draw full screen picture - corona.rgb file must exist in UFS storage
[x0y0P/corona.rgb]
; define index color
[dc19:31000]
; draw transparent text with new index color
[x60y30f2Ci19D2]Tasmota
```

**UFS commands** can be found here:<br>
https://tasmota.github.io/docs/Commands/#ufs

**Berry scripting language** can benefit from UFS,<br>
more info here: https://tasmota.github.io/docs/Berry-Scripting/#loading-code-from-filesystem

## How to activate UFS ?<br>
**You need to compile your firmware to activate this feature:**<br>
Copy `platformio_override_sample.ini` as `platformio_override.ini`<br>
Activate/uncomment the line:<br>
`board_build.ldscript = eagle.flash.4m2m.ld` for 2Mb file system<br>
`board_build.ldscript = eagle.flash.4m1m.ld` for 1Mb file system<br>

Add or uncomment `#define ...` lines in your `user_config_override.h`:<br>
```
// UFS filesystem
#define USE_UFILESYS
#define GUI_TRASH_FILE
```
Compile, flash and you will find a new entry in Tasmota web GUI menu:<br>
Configuration - Manage File system.<br>
![fs-1](https://user-images.githubusercontent.com/18531150/113911368-31da8000-97da-11eb-8f57-b08f371bdfd3.jpg)
![fs-2](https://user-images.githubusercontent.com/18531150/113911396-3868f780-97da-11eb-8726-d720180e013c.jpg)
