Even though Tasmota offers several pre-compiled firmware variants, sometimes the ready-to-flash binaries aren't enough.
If you need to enable or disable some features, or simply change some parameters, then you need to compile a firmware binary yourself.  

If you are not experienced enough or don't want to install an IDE (Integrated Development Environment) like PlatformIO or Arduino-IDE on your computer, compiling your own firmware is a breeze using [Gitpod](https://www.gitpod.io/).

Gitpod is a web browser based online IDE. All you need to use it is to link your GitHub account (or make a new one [here](https://github.com/join?source=header)). Gitpod will take care of all the necessary software package dependencies for you.

![Gitpod login](https://i.imgur.com/irTdi4A.png)

After you successfully sign in, you can start your personal project. The fastest way to load Tasmota into Gitpod is with one of the following links:  
- Development Branch: [`https://gitpod.io#https://github.com/arendst/Tasmota/tree/development`](https://gitpod.io#https://github.com/arendst/Tasmota/tree/development)
- Master Release: [`https://gitpod.io#https://github.com/arendst/Tasmota/tree/master`](https://gitpod.io#https://github.com/arendst/Tasmota/tree/master)
- [TasmoCompiler](https://github.com/benzino77/tasmocompiler/blob/master/README.md): [`https://gitpod.io/#https://github.com/benzino77/tasmocompiler`](https://gitpod.io/#https://github.com/benzino77/tasmocompiler)

**Browser Extension**  
Gitpod has a browser extension (Chrome and Firefox) which is handy to directly load a GitHub project into your personal Gitpod work-space.  
![Gitpod link](https://i.imgur.com/uEHszIn.png)

[More information on the Gitpod browser extension](https://www.gitpod.io/docs/20_Browser_Extension/).

## Using Gitpod
After Gitpod loads the project, you will be greeted by the main window. Gitpod will then automatically compile `tasmota.bin`. Wait for the compilation to complete.

The display consists of three panels:  
1. Explorer
2. Editor
3. Terminal

![Gitpod main screen](https://i.imgur.com/nfAYnwM.png)

### Customize Firmware Features and Settings
:warning: ATTENTION: The proper method of customizing firmware compilation options is to use the `user_config_override.h` file. Most customizations should not require changes to the `my_user_config.h` file. To modify the stock configuration:  
1. Select the `/tasmota` folder in the Explorer (1) pane
2. Create a new file called `user_config_override.h`
3. In the Editor (2) pane, add, change, or remove anything you need in your configuration file to define your own settings. Refer to the `user_config_override_sample.h` file as well as `my_user_config.h` for `#define` options ([sample](https://pastebin.com/M5KPPWAJ)). You can find a list of Tasmota features and settings listed [here](Builds). Define the features you require in your configuration file.
4. Click 'File' on the menu bar and 'Save' your edits.

### Prepare the IDE for Compilation
1. Open the `platformio.ini` file located in the `/tasmota` root directory (scroll to the bottom of the file Explorer (1) pane). In this file, removing a leading semicolon `;` enables a statement.
2. In the Editor (2) pane:
   - If you are using your own `user_config_override.h`, you must tell the compiler to use it. Rename `platformio_override_sample.ini` to `platformio_override.ini`. This enables `-DUSE_CONFIG_OVERRIDE`.
   - By default, the 2.6.1 Core will be compiled. If you wish to use a different Core, find the `[core_active]` section in the file and enable the `platform` and `build_flags` lines for the desired Core. Then click 'File' on the menu bar and 'Save' your edits.

### Compile Your Firmware
This action is done in the Terminal pane (3) with very simple commands.  

![compile command](https://i.imgur.com/wXA4hvd.png)

The simplest one is `platformio run -e tasmota`. With this command, Gitpod will compile the Tasmota firmware with the features you selected. If you need a different variant, you can specify this option on the command line:  
`platformio run -e <variant-name>`  

Examples:  
- `platformio run -e tasmota-sensors`  
- `platformio run -e tasmota-DE`

Compilation normally takes only a couple of minutes. The time if takes is directly related to the configurations you selected; the more features selected means more time is needed to compile. When done, you will find a firmware file named `firmware.bin` in the `/Tasmota/.pioenvs/<variant-name>/` folder in the Explorer (1) pane.

![folders](https://i.imgur.com/SEqyGy2.png)

Download `firmware.bin` to your computer by right-clicking on the file and selecting 'Download'. You are now ready to flash your device. 

Watch a [livestream video by digiblurDIY](https://www.youtube.com/watch?v=vod3Woj_vrs) of compiling Tasmota using Gitpod.

### Flash Your Device
#### OTA Flash
If you already have Tasmota flashed on your device, you can use the `File Upload` OTA method to load the new firmware binary file.
1. Download [`tasmota-minimal.bin`](http://thehackbox.org/tasmota/tasmota-minimal.bin)
2. Make a backup of the device configuration using the web UI `Configuration` menu option.
3. Upload `tasmota-minimal.bin` to your device using the web UI `Firmware Upgrade` selection. Choose `Upgrade by file upload`.
3. After `tasmota-minimal.bin` is successfully loaded, select `Firmware Upgrade` once again and upload the firmware file compiled using Gitpod.

#### Serial Flash
Follow the same [procedure for flashing](installation/Flashing) as you would any new device.
