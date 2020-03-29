How to setup and configure Visual Studio Code with PlatformIO for Tasmota compilation and upload.

## Easy way (only Windows): Portable install of Visual Studio Code for Tasmota
Download the ready made [Portable Installation](https://github.com/Jason2866/Portable_VSC_PlatformIO/releases/download/1.3/VSC_PlatformIO_Python.zip)
of VSC/PlatformIO and extract the ZIP to a folder or a fast extern drive.<br>
Grab the [Tasmota compile package](https://github.com/Jason2866/Portable_VSC_PlatformIO/releases/download/1.3/Tasmota_compile_pack.zip) and extract it to the same destination.<br>
Start `VS Code.exe` (in folder VSC)

## Full Install (Windows, Linux and Mac)

## Download and Install Visual Studio Code
Download Visual Studio Code (VSC) from https://code.visualstudio.com/

### Install PlatformIO Extension
Install the _PlatformIO IDE_ extension in VSC.

Select ``View`` - ``Extensions`` and type PlatformIO in the search box.

Make sure to select the official PlatformIO.org *PlatformIO IDE* extension and select *Install*. Accept to install dependencies.

## Download Tasmota
Download the latest Tasmota version from https://github.com/arendst/Tasmota and unzip to a known folder.

### Copy files
Copy all files from the Tasmota Source code into your VSC working folder.

## Compile Tasmota
Start VSC and select ``File`` - ``Open Folder...`` to point to the working folder.

**Note:** Press `Ctrl` + `Shift` + `P` and type `PlatformIO` to see all options.

Select the desired firmware by editing file _platformio.ini_ as needed.

Easy compilation can be performed from the icons at the bottom of the VSC screen. 

## Upload Tasmota

Enable desired options in _platformio.ini_ for serial upload like:
```
; *** Upload Serial reset method for Wemos and NodeMCU
upload_port = COM5
;upload_speed = 512000
upload_speed = 115200
;upload_resetmethod = nodemcu
```
Enable desired options in _platformio_override.ini_ for upload to your local OTA server like:
```
; *** Upload file to OTA server using HTTP
upload_port = domus1:80/api/upload-arduino.php
extra_scripts = pio/http-uploader.py
```
Easy compilation and upload can be performed from the icons at the bottom of the VSC screen or use `Ctrl` + `Alt` + `U` to upload (will build if needed).

## *Hint:*
In case vscode shows a huge amount of errors using PlatformIO - Intellisense a possible "solution" is to change the cpp-Intelli Sense Engine type to "TAG PARSER"

This setting can be changed in workspace settings by:
Use `Ctrl` + `Shift` + `P` and type `Preferences: Open Workspace Settings` and type `intelli Sense` in the search box.
Now change the value for `Intelli Sense Engine` to `Tag Parser`.
