Easily upgrade Tasmota to a newer version or different build while keeping all your settings.

_**The first rule of upgrading: If it ain't broke, don't fix it!**_    
In other words, ensure that there is a good reason to mess with a working installation (e.g., a need to use a new feature or address a found problem fixed in a more current version).

> [!TIP]
>Any time you upgrade it is highly recommended that you [back up your device settings](#Backing-Up-Settings). It is easily done in webUI under **Configuration - Backup Config** page in the webUI


## OTA Upgrade 
Upgrading the device firmware [over-the-air](https://en.wikipedia.org/wiki/Over-the-air_programming), or OTA, is the convenient way to upgrade. Open a web browser to you device's web UI and select Firmware Upgrade.

![Upgrading_1](https://user-images.githubusercontent.com/5904370/68962045-fbaaf380-07d3-11ea-9736-a44c13ef7653.png ":size=200")

You are presented with two choices. Using an OTA server or by uploading a downloaded or self-compiled binary file.

![Upgrading_2](https://user-images.githubusercontent.com/5904370/68962130-301eaf80-07d4-11ea-87bb-54c018fe7794.png ":size=200")

### Using Web UI
If you want to upgrade to the latest release version click the first **Start Upgrade** button. This screen should appear

 ![Upgrading_3](https://user-images.githubusercontent.com/5904370/68962209-52b0c880-07d4-11ea-8ea8-193e945dab9b.png ":size=200")

During this process Tasmota will download the new firmware from the url and install it. It might need to download **`tasmota-minimal.bin`** first but all that happens automatically. All you have to do is **wait 2 to 5 minutes**. 

After the upgrade is completed you can reconnect back to the web UI and check the firmware version on the bottom of the page.

#### Changing OtaUrl
If you wish to switch to a different [build](Builds) you have to change OtaUrl to the desired binary from our [OTA Server](http://thehackbox.org/tasmota/).

It is possible to create your own simple http OTA server (https is not supported) using Python and perform upgrades from there. 
Install Python3 and from the folder where the binary resides (make sure `tasmota-minimal.bin` is located there too) run:
```
python -m http.server 8000
```
(If the response is "No module named http" then try again with `python3` instead of `python`.)

Change your OtaUrl to http://ipoftheserver:8000/yourbinary.bin and start the upgrade process. Note: do not use `/`, `-`, or `.` characters in the name of `yourbinary`.

If your binary build (yourbinary.bin) is larger than the available free flash program space, Tasmota will need to first install the minimal version of Tasmota to make more space. To have this work via the web server OTA process, you have to copy the file `tasmota-minimal.bin` in the same folder where `OTAURL` for `yourbinary.bin` is placed, and rename `tasmota-minimal.bin` to `yourbinary-minimal.bin`.

### By File Upload
This process requires you to have a minimal build `tasmota-minimal.bin` of the firmware since the upload process needs the space in flash memory to upload the new binary. 

When you try to immediately upgrade to a new binary without using minimal firmware you will be greeted with this error.

![Upgrading_4](https://user-images.githubusercontent.com/5904370/68962296-85f35780-07d4-11ea-90ae-86fcd7d14681.png ":size=200")

Browse to the minimal binary with **Choose File**. The chosen filename should be visible. _In our example its **`tasmota-minimal.bin`**._

![minimal upgrade](https://user-images.githubusercontent.com/5904370/68962383-baffaa00-07d4-11ea-8122-fcf971ca96f5.png ":size=200")

Wait until the device restarts. In the Main Menu web UI will display this warning message on top.

![minimal message](https://user-images.githubusercontent.com/5904370/68962530-1a5dba00-07d5-11ea-83aa-f6f640d9a38f.png ":size=200")

Go to **Firmware Upgrade** again. This time browse to the binary you want to upgrade to with **Choose File** and click **Start upgrade**. _In our example its **`tasmota-sensors.bin`**._

![image](https://user-images.githubusercontent.com/5904370/68962783-a7087800-07d5-11ea-9f8c-bd90fdb3e9ca.png ":size=200")

You will see an **Upload starting...** and then **Upload successful** message. Wait until the device restarts, reconnect back to the web UI and check the firmware version on the bottom of the page.

### Using Commands

Your device can be upgraded using [commands](Commands) via MQTT, web requests or Console in the web UI.

[OtaUrl](Commands#OtaUrl) is used to set your OTA address. 
```console
OtaUrl http://thehackbox.org/tasmota/tasmota-sensors.bin
```
*In this example we chose a development branch version with additional sensors support*

Initiate [upgrade](Commands#upgrade) from OTA server
```console
Upgrade 1
```
Wait for the upgrade process to complete and check the Tasmota version. If in console you can use `Status 2`.

### Using Device Button

Devices with a built in button (the one used to put your device into [flash mode](installation/Hardware-Preparation#programming-mode)) can initiate OTA upgrade with it.

7 short presses of the button will start OTA download of firmware using the Ota Url. Device LED is lit during the update.

## Serial Upgrade

Upgrade over the serial connection using serial-to-USB adapter.

Upload the new version over serial using the same process as in [Flashing](installation/Flashing) but DO NOT erase flash. The new binary will flash over the old one and keep all your settings intact.

## External Programs

[**Tasmota Device Manager**](https://github.com/jziolkowski/tdm) or TDM is a multiplatform GUI application written in Python for discovery and management of Tasmota devices.
You can set up OTA url and initiate OTA upgrade from TDM using GUI.

[**openHAB**](integrations/openHAB#maintenance-actions)  - implement an automation rule to upgrade devices from openHAB

[**Node-RED OTA server and firmware manager**](https://flows.nodered.org/flow/888b4cd95250197eb429b2f40d188185) - [Node-RED](https://nodered.org/) flow for managing OTA updates 

[**OTA over SCP**](OTA-over-SCP) - setup and configure "OTA over SCP" upload for PlatformIO

# Backing Up Settings

Tasmota uses flash memory to store options and settings. New versions add (or remove) features that use various regions of that memory. If you did not erase flash when you flashed your device, an updated version of Tasmota may be accessing areas with values left over from the old Tasmota or even the original factory firmware. This might cause unexpected and unwanted behavior or even major problems (constant reboots or reconnects). 

To avoid this use our decode-config tool to easily create and restore backups in Tasmota:

## decode-config tool 
* [decode-config.py](https://github.com/tasmota/decode-config/blob/master/decode-config.py) - [installation instructions](https://github.com/tasmota/decode-config/blob/master/README.md) in Python for Windows or Linux
* [decode-config.exe](https://github.com/tasmota/decode-config/releases) - Windows only executable. If using this replace `decode-config.py` with `decode-config.exe` or `decode-config_x64.exe`  in the instruction examples.

#### 1. make a configuration backup:

  * Create a new backup straight from your device   

    `decode-config.py -d <deviceIP> --backup-file Config-@f --backup-type json`

    `@f` will be replaced by decode-config to device's FriendlyName

  **_or_**

* Convert a previously made `.dmp` backup into a JSON file   
  
  `decode-config.py -f <dmp_filename> --backup-file Config-@f --backup-type json`

#### 2. perform a device reset 
Erase flash settings area but keep Wi-Fi and MQTT settings

`Reset 6`
   
#### 3. upgrade the firmware via OTA or file upload
#### 4. restore configuration

`decode-config.py -d <deviceIP> --restore-file <config-filename>`

...and you're done!


If you can't restore configuration directly you can configure the device manually referring to the [Commands article](Commands) and the settings (e.g., SetOptions, Rules, etc.) in the JSON file you created in step #1. You can paste the JSON into a [JSON parser](https://jsonformatter.org/json-parser) to make it easily readable. 

# Migration Path
Until now several versions of Tasmota have been released starting with the C version Sonoff-MQTT-OTA followed by Sonoff-MQTT-OTA-Arduino, Sonoff-Tasmota and ultimately **Tasmota**.

Intermediate upgrade steps might be needed to migrate from an older firmware version to the latest.
The following table lists all relevant firmware versions and a direct link to their minimal build.
Remember that you **must take each individual step** between the device firmeware version and the latest available.

As a safeguard perform "Backup Configuration" before installing a new version. If settings are lost "Restore Configuration" should bring them back.

| Project Name | Release | Direct Download |
|-|-|-|
| Sonoff-Tasmota | [v3.9.22](https://github.com/arendst/Tasmota/releases/tag/v3.9.22) | [`firmware.bin`](https://github.com/arendst/Tasmota/releases/download/v3.9.22/firmware.bin) |
| Sonoff-Tasmota | [v4.2.0](https://github.com/arendst/Tasmota/releases/tag/v4.2.0) | [`firmware.bin`](https://github.com/arendst/Tasmota/releases/download/v4.2.0/firmware.bin) |
| Sonoff-Tasmota | [v5.14.0](https://github.com/arendst/Tasmota/releases/tag/v5.14.0) | [`sonoff-minimal.bin`](https://github.com/arendst/Tasmota/releases/download/v5.14.0/sonoff-minimal.bin)|
| Sonoff-Tasmota | [v6.7.1](https://github.com/arendst/Tasmota/releases/tag/v6.7.1) | [`sonoff-minimal.bin`](https://github.com/arendst/Tasmota/releases/download/v6.7.1/sonoff-minimal.bin) |
| Tasmota        | [v7.2.0](https://github.com/arendst/Tasmota/releases/tag/v7.2.0) | [`tasmota-minimal.bin`](https://github.com/arendst/Tasmota/releases/download/v7.2.0/tasmota-minimal.bin) |
| Tasmota        | [latest](https://github.com/arendst/Tasmota/releases/latest) | (Check "Assets" section) |

Follow the path till you reach the latest Tasmota version.

## Background Info and Details

Migrating from one version to the next is mostly painless as the settings are saved in the same location in flash and newer settings are appended.

As said, mostly painless. There are some deviations to this rule as I rearranged the flash. In the next list you'll find an overview of supported migrations paths.

* No migration from **Sonoff-MQTT-OTA** to **Sonoff-MQTT-OTA-Arduino** or **Tasmota**.  
  The settings flash layout and OTA image locations are different from the Arduino versions
* Easy migration from **Sonoff-MQTT-OTA-Arduino 1.0.11** to **Sonoff-Tasmota 3.9.x**.  
  After installing Tasmota for the first time some settings need to be adjusted via web configuration or MQTT commands.
* Easy migration from **Sonoff-MQTT-OTA-Arduino 3.1.0** to **Sonoff-Tasmota 4.x**.  
  After installing Tasmota for the first time some settings need to be adjusted via web configuration or MQTT commands.
* Easy migration from **Sonoff-Tasmota 4.x** to **Sonoff-Tasmota 5.14**.
  As a safeguard perform a Backup Configuration before installing the new version. If settings are lost after the upgrade perform a Restore Configuration.
* Easy migration from **Sonoff-Tasmota 5.2** to **Sonoff-Tasmota 6.x**. 
  As a safeguard perform a **_Backup Configuration_** before installing the new version. If settings are lost after the upgrade perform a **Restore Configuration**.
  > [!WARNING] If you've used development versions between 6.6.0.7 and 6.6.0.11 [**back up your device settings**](#backing-up-settings) as described above. Convert the backup to human readable form as you **MUST** restore these settings manually.

  - Perform a `Reset 6` before upgrading the firmware and, for safe measure, after the upgrade completes.  
  - Enter your device configurations using the settings saved in the first step.
* Easy migration from **Tasmota 6.x** to **Tasmota 7.x**. 
  As a safeguard perform a **Backup Configuration** before installing the new version. If settings are lost after the upgrade perform a **Restore Configuration**.

If ***Backup Configuration -> Restore Configuration*** fails, reset to firmware defaults and use [decode-config tool](#decode-config-tool) to restore your backed up configuration.
