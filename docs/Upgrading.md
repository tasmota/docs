description: Easily upgrade Tasmota to a newer version or different build while keeping all your settings

!!! info "Easily upgrade Tasmota to a newer version or different build while keeping all your settings"

<span style="font-size:30px;font-weight: bold">The first rule of upgrading: If it ain't broke, don't fix it!</span>

In other words, ensure that there is a good reason to mess with a working installation (e.g., a need to use a new feature or address a found problem fixed in the current version).

!!! tip "Backup before upgrading"
    Any time you upgrade it is highly recommended to [back up your device settings](#backing-up-settings). That is easily done from the webUI using **Configuration - Backup Config**.

If you wish to switch to a different [build](Builds) or use development branch you need to download a binary file (gzipped or regular) or change the ***OTA Url*** link.

Download binaries from:

- GitHub [releases](https://github.com/arendst/Tasmota/releases)
- official [OTA Server](http://thehackbox.org/tasmota/release/)
- development branch [OTA Server](http://thehackbox.org/tasmota/)
- your [personal OTA server](#private-ota-server)

### Gzipped binaries

!!! failure "Gzipped binaries can be used **only** once you've upgraded to atleast Tasmota 8.2"
    Trying to upgrade with a gzipped binary using versions older than 8.2 will fail.

Tasmota 8.2 introduced upgrading using gzipped binaries which are smaller in size and will likely skip the intermediary minimal build installation. This makes the upgrade process faster and straightforward. 

To use simply add `.gz` to the existing OTA Url or download the `.bin.gz` binary from the official [OTA Server](http://thehackbox.org/tasmota/release/) and the next upgrade will use the compressed file.

## Upgrade using webUI
Upgrading the device firmware [over-the-air](https://en.wikipedia.org/wiki/Over-the-air_programming), aka OTA, is the most convenient way to upgrade. 

To start the upgrade, open a web browser to your device's web UI and select **Firmware Upgrade**.

![Upgrading_1](https://user-images.githubusercontent.com/5904370/68962045-fbaaf380-07d3-11ea-9736-a44c13ef7653.png)

You are presented with two choices:

- **_Upgrade by webserver_** - use an OTA server 
- **_Ugprade by file upload_** - uploading a downloaded or self-compiled binary file from your computer

![Upgrading_2](https://user-images.githubusercontent.com/5904370/68962130-301eaf80-07d4-11ea-87bb-54c018fe7794.png)

### Upgrade by web server
If you want to upgrade to the latest release version click the first **Start Upgrade** button. This screen should appear

 ![Upgrading_3](https://user-images.githubusercontent.com/5904370/68962209-52b0c880-07d4-11ea-8ea8-193e945dab9b.png)

During this process Tasmota will download the new firmware from the url and install it. If you're not using a gzipped binary it might need to download `tasmota-minimal.bin` first, but all that happens automatically. All you have to do is **wait 2 to 5 minutes**. 

After the upgrade is completed you can reconnect back to the web UI and check the firmware version on the bottom of the page or in the ***Information*** tab of the webUI.

### Upgrade by file upload 

Go to **Firmware Upgrade**. This time browse to the binary you want to upgrade to with **Choose File** and click **Start upgrade**.    
_In our example its `tasmota-sensors.bin`._

![image](https://user-images.githubusercontent.com/5904370/68962783-a7087800-07d5-11ea-9f8c-bd90fdb3e9ca.png)

You will see an __Upload starting...__ and then __Upload successful__ message. Wait until the device restarts, reconnect back to the web UI and check the firmware version on the bottom of the page or in the ***Information*** tab of the webUI.

!!! failure "Minimal build upgrade step"
    If the binary you're upgrading with is larger than 500kb you also need to download the minimal build (`tasmota-minimal.bin(.gz)`) since the upload process needs the space in flash memory to upload the new binary. 

When you try to immediately upgrade with the new binary without using smaller minimal firmware you will be greeted with this error.

![Upgrading_4](https://user-images.githubusercontent.com/5904370/68962296-85f35780-07d4-11ea-90ae-86fcd7d14681.png)

#### Minimal build upgrade step
==This step is necessary only if you get the above error==    
Browse to the minimal binary with ***Choose File***. The chosen filename should be visible.    
_In our example its `tasmota-minimal.bin`._

![minimal upgrade](https://user-images.githubusercontent.com/5904370/68962383-baffaa00-07d4-11ea-8122-fcf971ca96f5.png)

Wait until the device restarts. In the Main Menu web UI will display this warning message on top.

![minimal message](https://user-images.githubusercontent.com/5904370/68962530-1a5dba00-07d5-11ea-83aa-f6f640d9a38f.png)

Proceed to [upgrade](#upgrade-by-file-upload)

### Using Commands

Your device can be upgraded using [commands](Commands.md) via MQTT, web requests or Console in the web UI.

[OtaUrl](Commands.md#otaurl) is used to set your OTA address. 
```haskell
OtaUrl http://thehackbox.org/tasmota/tasmota-sensors.bin
```
*In this example we chose a development branch version with additional sensors support*

Initiate [upgrade](Commands.md#upgrade) from OTA server
```haskell
Upgrade 1
```
Wait for the upgrade process to complete and check the Tasmota version. In console you can use `Status 2`.

### Using Device Button

Devices with a built in button (the one used to put your device into [flash mode](Getting-Started#programming-mode)) can initiate OTA upgrade with it.

7 short presses of the button will start OTA download of firmware using the Ota Url. Device LED is lit during the update.

## Serial Upgrade

Upgrade over the serial connection using serial-to-USB adapter.

Upload the new version over serial using the same process as in [Flashing](Getting-Started#flashing) but DO NOT erase flash. The new binary will overwrite the old one and keep your settings.

## External Programs

[**Tasmota Device Manager**](https://github.com/jziolkowski/tdm) or TDM is a multiplatform GUI application written in Python for discovery and management of Tasmota devices.
You can set up OTA url and initiate OTA upgrade from TDM using GUI.

[**openHAB**](openHAB#maintenance-actions)  - implement an automation rule to upgrade devices from openHAB

[**Node-RED OTA server and firmware manager**](https://flows.nodered.org/flow/888b4cd95250197eb429b2f40d188185) - [Node-RED](https://nodered.org/) flow for managing OTA updates 

[**OTA over SCP**](OTA-over-SCP) - setup and configure "OTA over SCP" upload for PlatformIO

### Private OTA Server
It is possible to create your own simple http OTA server (https is not supported) using Python and perform upgrades from there. 
Install Python3 and from the folder where the binary resides (make sure `tasmota-minimal.bin` is located there too) run:
```
python -m http.server 8000
```
(If the response is "No module named http" then try again with `python3` instead of `python`.)

Change your OtaUrl to http://ipoftheserver:8000/yourbinary.bin(.gz) and start the upgrade process. Note: do not use `/`, `-`, or `.` characters in the name of `yourbinary`.

If your binary build (yourbinary.bin) is larger than the available free flash program space, Tasmota will need to first install the minimal version of Tasmota to make more space. To have this work via the web server OTA process, you have to copy the file `tasmota-minimal.bin` in the same folder where `OTAURL` for `yourbinary.bin` is placed, and rename `tasmota-minimal.bin` to `yourbinary-minimal.bin`.

## Migration Path

Until now several versions of Tasmota have been released starting with the C version Sonoff-MQTT-OTA followed by Sonoff-MQTT-OTA-Arduino, Sonoff-Tasmota and ultimately Tasmota.

Intermediate upgrade steps are needed to migrate from older firmware to the current version. No migration is possible from original [_Sonoff-MQTT-OTA_](https://github.com/arendst/Sonoff-MQTT-OTA) to [_Sonoff-MQTT-OTA-Arduino_](https://github.com/arendst/Sonoff-MQTT-OTA-Arduino) v1.0.11.

!!! failure "DO NOT ATTEMPT TO UPGRADE VERSIONS PRIOR TO v7.x STRAIGHT TO THE CURRENT VERSION"

Remember that you **must take each individual step** between the device firmware version and the latest available.You can find all the required binaries in [Tasmota Releases](https://github.com/arendst/Tasmota/tags) listed by version number.

!!! tip 
    As a safeguard perform "Backup Configuration" before upgrading. If settings are lost "Restore Configuration" should bring them back.

Upgrading from one minor version to the next is mostly painless as the settings are saved in the same location in flash and newer settings are appended.

As said, mostly painless! There are some deviations to this rule as the flash settings changed. 

### Upgrade Flow
 **v1.0.11** &nbsp;:twisted_rightwards_arrows:&nbsp; [**v3.9.22**](https://github.com/arendst/Tasmota/releases/download/v3.9.22/firmware.bin) &nbsp;:twisted_rightwards_arrows:&nbsp; [**v4.2.0**](https://github.com/arendst/Tasmota/releases/download/v4.2.0/firmware.bin) &nbsp;:twisted_rightwards_arrows:&nbsp; [**v5.14.0**](https://github.com/arendst/Tasmota/releases/download/v5.14.0/sonoff-classic.bin) &nbsp;:twisted_rightwards_arrows:&nbsp; [**v6.1.1**](https://github.com/arendst/Tasmota/releases/download/v6.1.1/sonoff-classic.bin) &nbsp;:twisted_rightwards_arrows:&nbsp; [**v7.2.0**](https://github.com/arendst/Tasmota/releases/download/v7.2.0/tasmota-lite.bin) &nbsp;:twisted_rightwards_arrows:&nbsp; [**v8.1.0**](https://github.com/arendst/Tasmota/releases/download/v8.1.0/tasmota-lite.bin) &nbsp;:twisted_rightwards_arrows:&nbsp; [**Current release**](https://github.com/arendst/Tasmota/releases/)

Follow the path strictly to ensure success. **Do not install only tasmota-minimal.bin** but upgrade to full, working firmware. Linked `-lite/-classic.bin` binaries will do the job.  

!!! warning "Tasmota v8.1 introduced a major change in parameter storage."
    Downgrading is not recommended and upgrading to 8.1 **has to follow** the recommended path and **can still** fail in some cases. Don't forget to backup!

!!! quote "Notice for versions between 6.6.0.7 and 6.6.0.11"
    If you've used development versions between 6.6.0.7 and 6.6.0.11 [**back up your device settings**](#backing-up-settings). Convert the backup to human readable form as you **MUST** restore these settings manually.    
    Perform a `Reset 6` before upgrading the firmware and, for safe measure, after the upgrade completes.  

<!-- 
  The settings flash layout and OTA image locations are different from the Arduino versions
* Easy migration from **Sonoff-MQTT-OTA-Arduino 1.0.11** to **Sonoff-Tasmota 3.9.x**.  
  After installing Tasmota for the first time some settings need to be adjusted via web configuration or MQTT commands.
* Easy migration from **Sonoff-MQTT-OTA-Arduino 3.1.0** to **Sonoff-Tasmota 4.x**.  
  After installing Tasmota for the first time some settings need to be adjusted via web configuration or MQTT commands.
* Easy migration from **Sonoff-Tasmota 4.x** to **Sonoff-Tasmota 5.14**.
  As a safeguard perform a Backup Configuration before installing the new version. If settings are lost after the upgrade perform a Restore Configuration.
* Easy migration from **Sonoff-Tasmota 5.2** to **Sonoff-Tasmota 6.x**. 
  As a safeguard perform a **_Backup Configuration_** before installing the new version. If settings are lost after the upgrade perform a **Restore Configuration**. 
  
  - Enter your device configurations using the settings saved in the first step.
* Easy migration from **Tasmota 6.x** to **Tasmota 7.x**. 
  As a safeguard perform a **Backup Configuration** before installing the new version. If settings are lost after the upgrade perform a **Restore Configuration**.


  * Upgrade from **Tasmota 7.2** to **Tasmota 8.1**
  * Upgrade from **Tasmota 8.1** to **Tasmota 8.x**
-->


## Downgrading

While fallback or downgrading is common practice it was never supported due to Settings additions or changes in newer releases. 

Starting with release v8.1.0 Doris settings in flash are re-allocated in such a way that fallback is only allowed and possible to v7.2.0. Once at v7.2.0 you're on your own when downgrading even further.

## Backing Up Settings

Tasmota uses flash memory to store options and settings. New versions add (or remove) features that use various regions of that memory. If you did not erase flash when you flashed your device, an updated version of Tasmota may be accessing areas with values left over from the old Tasmota or even the original factory firmware. This might cause unexpected and unwanted behavior or even major problems (constant reboots or reconnects). 

To avoid this use our decode-config tool to easily create and restore backups in Tasmota:

## decode-config tool 
* [decode-config](https://github.com/tasmota/decode-config/releases) - OS independent Python program to backup and restore Tasmota configuration data, also available as precompiled executables for Windows, MacOS and Linux. See [Using instructions](https://github.com/tasmota/decode-config/blob/master/README.md) for details.  
If using one of the precompiled binary for your OS replace `decode-config.py` with `decode-config_win32.exe`, `decode-config_win64.exe`, `decode-config_mac` or `decode-config_linux` from the instruction examples.

#### 1. make a configuration backup:

  * Create a new backup straight from your device   

    `decode-config.py --source <deviceIP> --backup-file Config-@f`

    `@f` will be replaced by decode-config to device's FriendlyName

  **_or_**

* Create a backup from previously made `.dmp` file
  
  `decode-config.py --source <dmp_filename> --backup-file Config-@f`

#### 2. perform a device reset 
Erase flash settings area but keep Wi-Fi and MQTT settings

`Reset 6`
   
#### 3. upgrade the firmware via OTA or file upload
#### 4. restore configuration

`decode-config.py --source <deviceIP> --restore-file <backupfile>`

...and you're done!


If you can't restore configuration directly you can configure the device manually referring to the [Commands article](Commands.md) and the settings (e.g., SetOptions, Rules, etc.) in the JSON file you created in step #1. You can paste the JSON into a [JSON parser](https://jsonformatter.org/json-parser) to make it easily readable. 

!!! tip
    If ***Backup Configuration -> Restore Configuration*** fails, reset to firmware defaults and use [decode-config tool](#decode-config-tool) to restore your backed up configuration.
