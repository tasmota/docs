How to setup and configure Visual Studio Code with PlatformIO for Tasmota compilation and upload.

## Full Install (Windows, Linux and Mac)

## Download and Install Visual Studio Code
Download Visual Studio Code (VSC) from <https://code.visualstudio.com/>

### Install PlatformIO Extension
Install the _PlatformIO IDE_ extension in VSC.

Select ``View`` - ``Extensions`` and type PlatformIO in the search box.

Make sure to select the official PlatformIO.org *PlatformIO IDE* extension and select *Install*. Accept to install dependencies.
To install on Linux, it is essential to first have the python3-venv package installed on your system.

As an alternative to the *Platformio IDE* the *pioarduino IDE* extension can be used.

## Download Tasmota
Download the latest Tasmota version from <https://github.com/arendst/Tasmota> and unzip to a known folder.

## Compile Tasmota
Start VSC and select ``File`` - ``Open Folder...`` the folder with the unzipped Tasmota files

**Note:** Press `Ctrl` + `Shift` + `P` and type `PlatformIO` to see all options.

Select the desired firmware via VSC [menu](https://docs.platformio.org/en/latest/integration/ide/vscode.html#project-tasks).

Easy compilation can be performed from the icons at the bottom of the VSC screen. 

## Upload Tasmota

Optional: Enable desired options in _platformio_override.ini_ for serial upload like:
```
upload_port = COM5
;upload_speed = 512000
upload_speed = 115200
```

Easy compilation and upload can be performed from the icons at the bottom of the VSC screen or use `Ctrl` + `Alt` + `U` to upload (will build if needed).

## *Hint:*
In case vscode shows a huge amount of errors using PlatformIO - Intellisense a possible "solution" is to change the cpp-Intelli Sense Engine type to "TAG PARSER"

This setting can be changed in workspace settings by:
Use `Ctrl` + `Shift` + `P` and type `Preferences: Open Workspace Settings` and type `intelli Sense` in the search box.
Now change the value for `Intelli Sense Engine` to `Tag Parser`.
