PlatformIO is not just an IDE.
In fact, all its features are accessible from the command line, and the IDE is a convenience wrapper layer around it.

Thus, we can build Tasmota using only this PlatformIO-Core, which may come handy for automated builds, or for those who feel more comfortable with the command line than with the IDE.

The steps are surprisingly simple and straightforward:

## Provision a Linux VM

At least if you want to work in a cloud environment, but you may also choose to work on your physical machine as well.

PlatformIO is based on python, so if we use `python-virtualenv`, then all the dependent packages will be confined to a separate folder, so it won't even taint the OS installation.

As all of `python`, `python-virtualenv` and `python-pip` are available in most of the recent distros, you may pick your favourite one.


## Install python and tools

Install `python` and `python-virtualenv`, and `python-pip`, because we don't want to mess up the python ecosystem of the distro.

Update pip by `pip install --upgrade pip`, and this was the last step done as root, the rest goes as a plain user.

I used CentOS here, so if you prefer Debian-based distros, just substitute `apt-get install -y ...` for `yum install -y ...`.

```
[tasmota_builder@jtest ~]$ sudo yum install -y python python-virtualenv python-pip
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
...
Complete!
```
You may update `pip` in the host environment, but we'll do it in the virtualenv as well, so it's optional:
```
[tasmota_builder@jtest ~]$ sudo pip install --upgrade pip
Collecting pip
...
Successfully installed pip-18.1
```

## Prepare a PlatformIO-Core environment contained in a folder

`virtualenv` creates a folder and prepares a whole self-contained python subsystem there.

To activate it, so that all python-related things refer to this environment and not to the system global, you need to source the file `bin/activate` within it.

**NOTE**: Not just execute in a subshell, but include it into the current one, so please note the `. ` before `bin/activate` below:

```
[tasmota_builder@jtest ~]$ virtualenv platformio-core
New python executable in /home/tasmota_builder/platformio-core/bin/python
Installing setuptools, pip, wheel...done.
[tasmota_builder@jtest ~]$ cd platformio-core
[tasmota_builder@jtest platformio-core]$ . bin/activate

(platformio-core) [tasmota_builder@jtest platformio-core]$
```

Now we are ready to install PlatformIO-Core into this small virtual environment:

```
(platformio-core) [tasmota_builder@jtest platformio-core]$ pip install -U platformio
Collecting platformio
  Downloading https://files.pythonhosted.org/packages/95/4a/3ccce45ba750dd9a8d48dcbe9b9080011ac2a5a248312b19552bbaec6b7d/platformio-3.6.3-py27-none-any.whl (160kB)
    100% |████████████████████████████████| 163kB 4.5MB/s 
Collecting semantic-version<3,>=2.5.0 (from platformio)
  Downloading https://files.pythonhosted.org/packages/72/83/f76958017f3094b072d8e3a72d25c3ed65f754cc607fdb6a7b33d84ab1d5/semantic_version-2.6.0.tar.gz
Collecting click<6,>=5 (from platformio)
  Downloading https://files.pythonhosted.org/packages/8f/98/14966b6d772fd5fba1eb3bb34a62a7f736d609572493397cdc5715c14514/click-5.1-py2.py3-none-any.whl (65kB)
    100% |████████████████████████████████| 71kB 8.1MB/s 
Collecting colorama (from platformio)
  Downloading https://files.pythonhosted.org/packages/4f/a6/728666f39bfff1719fc94c481890b2106837da9318031f71a8424b662e12/colorama-0.4.1-py2.py3-none-any.whl
Collecting requests<3,>=2.4.0 (from platformio)
  Downloading https://files.pythonhosted.org/packages/7d/e3/20f3d364d6c8e5d2353c72a67778eb189176f08e873c9900e10c0287b84b/requests-2.21.0-py2.py3-none-any.whl (57kB)
    100% |████████████████████████████████| 61kB 7.9MB/s 
Collecting pyserial!=3.3,<4,>=3 (from platformio)
  Downloading https://files.pythonhosted.org/packages/0d/e4/2a744dd9e3be04a0c0907414e2a01a7c88bb3915cbe3c8cc06e209f59c30/pyserial-3.4-py2.py3-none-any.whl (193kB)
    100% |████████████████████████████████| 194kB 4.7MB/s 
Collecting bottle<0.13 (from platformio)
  Downloading https://files.pythonhosted.org/packages/32/4e/ed046324d5ec980c252987c1dca191e001b9f06ceffaebf037eef469937c/bottle-0.12.16.tar.gz (72kB)
    100% |████████████████████████████████| 81kB 8.8MB/s 
Collecting urllib3<1.25,>=1.21.1 (from requests<3,>=2.4.0->platformio)
  Downloading https://files.pythonhosted.org/packages/62/00/ee1d7de624db8ba7090d1226aebefab96a2c71cd5cfa7629d6ad3f61b79e/urllib3-1.24.1-py2.py3-none-any.whl (118kB)
    100% |████████████████████████████████| 122kB 7.5MB/s 
Collecting chardet<3.1.0,>=3.0.2 (from requests<3,>=2.4.0->platformio)
  Downloading https://files.pythonhosted.org/packages/bc/a9/01ffebfb562e4274b6487b4bb1ddec7ca55ec7510b22e4c51f14098443b8/chardet-3.0.4-py2.py3-none-any.whl (133kB)
    100% |████████████████████████████████| 143kB 6.8MB/s 
Collecting idna<2.9,>=2.5 (from requests<3,>=2.4.0->platformio)
  Downloading https://files.pythonhosted.org/packages/14/2c/cd551d81dbe15200be1cf41cd03869a46fe7226e7450af7a6545bfc474c9/idna-2.8-py2.py3-none-any.whl (58kB)
    100% |████████████████████████████████| 61kB 7.8MB/s 
Collecting certifi>=2017.4.17 (from requests<3,>=2.4.0->platformio)
  Downloading https://files.pythonhosted.org/packages/9f/e0/accfc1b56b57e9750eba272e24c4dddeac86852c2bebd1236674d7887e8a/certifi-2018.11.29-py2.py3-none-any.whl (154kB)
    100% |████████████████████████████████| 163kB 5.9MB/s 
Building wheels for collected packages: semantic-version, bottle
  Running setup.py bdist_wheel for semantic-version ... done
  Stored in directory: /home/tasmota_builder/.cache/pip/wheels/60/bb/50/215d669d31f992767f5dd8d3c974e79261707ee7f898f0dc10
  Running setup.py bdist_wheel for bottle ... done
  Stored in directory: /home/tasmota_builder/.cache/pip/wheels/0c/68/ac/1546dcb27101ca6c4e50c5b5da92dbd3307f07cda5d88e81c7
Successfully built semantic-version bottle
Installing collected packages: semantic-version, click, colorama, urllib3, chardet, idna, certifi, requests, pyserial, bottle, platformio
Successfully installed bottle-0.12.16 certifi-2018.11.29 chardet-3.0.4 click-5.1 colorama-0.4.1 idna-2.8 platformio-3.6.3 pyserial-3.4 requests-2.21.0 semantic-version>
You are using pip version 9.0.1, however version 18.1 is available.
```
As it would prefer a recent `pip` instead of the one set up by `virtualenv`, so let's upgrade it:

```
(platformio-core) [tasmota_builder@jtest platformio-core]$ pip install --upgrade pip
Collecting pip
  Downloading https://files.pythonhosted.org/packages/c2/d7/90f34cb0d83a6c5631cf71dfe64cc1054598c843a92b400e55675cc2ac37/pip-18.1-py2.py3-none-any.whl (1.3MB)
    100% |████████████████████████████████| 1.3MB 793kB/s 
Installing collected packages: pip
  Found existing installation: pip 9.0.1
    Uninstalling pip-9.0.1:
      Successfully uninstalled pip-9.0.1
Successfully installed pip-18.1
```

## Fetch the Tasmota sources

If you want only to build, then the original repo will do, but if you want to contribute as well, then fork an own copy of the repo and clone out that one.

```
(platformio-core) [tasmota_builder@jtest platformio-core]$ git clone https://github.com/arendst/Tasmota.git
Cloning into 'Tasmota'...
remote: Enumerating objects: 6, done.
remote: Counting objects: 100% (6/6), done.
remote: Compressing objects: 100% (5/5), done.
remote: Total 16930 (delta 1), reused 3 (delta 1), pack-reused 16924
Receiving objects: 100% (16930/16930), 23.75 MiB | 12.94 MiB/s, done.
Resolving deltas: 100% (11426/11426), done.
```

After changing to the working copy, we are ready to go:

```
(platformio-core) [tasmota_builder@jtest platformio-core]$ cd Tasmota/
(platformio-core) [tasmota_builder@jtest Tasmota]$
```

## Configure the sources

Now you may want to configure the sources for your needs, as described at [Upload](Upload-tools)

Actually, the sources do build fine right out-of-the box, only it'll be a full build, including all the language localisation and all the build flavours as well, while you are usually interested only in one language and one build flavour only.

In `platformio.ini` choose the environment (or flavour, if you like) you want to build.

In `tasmota/user_config_override.h` fine tune the default values for the module, the wifi, the MQTT server, and so on. Refer to the Tasmota Wiki for details.

## Build the firmware

The build command itself is `pio run`, but as it emits quite a lot of messages (including errors if you're developing), so you may want to redirect a copy of the standard output and error to a file, so it'll be `pio run 2>&1 | tee build.log`.

```
(platformio-core) [tasmota_builder@jtest Tasmota]$ time pio run 2>&1 | tee build.log
************************************************************************************************************************************************************************
If you like PlatformIO, please:
- follow us on Twitter to stay up-to-date on the latest project news > https://twitter.com/PlatformIO_Org
- star it on GitHub > https://github.com/platformio/platformio
- try PlatformIO IDE for IoT development > https://platformio.org/platformio-ide
- support us with PlatformIO Plus > https://pioplus.com
************************************************************************************************************************************************************************

Processing tasmota (framework: arduino; platform: espressif8266@1.8.0; board: esp01_1m)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
PlatformManager: Installing espressif8266 @ 1.8.0
Downloading
...
Environment tasmota-TW           [SUCCESS]
Environment tasmota-UK           [SUCCESS]
==================================================================== [SUCCESS] Took 797.56 seconds ====================================================================
```

That's all, really :D !

PlatformIO seems to handle the rebuilds and dependencies well, but if you want a clean build, the say `pio run -t clean` first, and then the `pio run`.

## Collect the results

The result will be here: `./.pioenvs/<build-flavour>/firmware.bin`

```
(platformio-core) [tasmota_builder@jtest Tasmota]$ find .pioenvs -name '*.bin'
.pioenvs/tasmota-FR/firmware.bin
.pioenvs/tasmota-GR/firmware.bin
.pioenvs/tasmota-HE/firmware.bin
.pioenvs/tasmota-HU/firmware.bin
.pioenvs/tasmota-IT/firmware.bin
.pioenvs/tasmota-NL/firmware.bin
.pioenvs/tasmota-PL/firmware.bin
.pioenvs/tasmota-PT/firmware.bin
.pioenvs/tasmota-RU/firmware.bin
.pioenvs/tasmota-SE/firmware.bin
.pioenvs/tasmota-SK/firmware.bin
.pioenvs/tasmota-TR/firmware.bin
.pioenvs/tasmota-TW/firmware.bin
.pioenvs/tasmota-UK/firmware.bin
.pioenvs/tasmota/firmware.bin
.pioenvs/tasmota-minimal/firmware.bin
.pioenvs/tasmota-basic/firmware.bin
.pioenvs/tasmota-knx/firmware.bin
.pioenvs/tasmota-sensors/firmware.bin
.pioenvs/tasmota-display/firmware.bin
.pioenvs/tasmota-BG/firmware.bin
.pioenvs/tasmota-BR/firmware.bin
.pioenvs/tasmota-CN/firmware.bin
.pioenvs/tasmota-CZ/firmware.bin
.pioenvs/tasmota-DE/firmware.bin
.pioenvs/tasmota-ES/firmware.bin
```

## About build times

The recent versions of PlatformIO-Core seem to parallelise quite well.

When you've changed only a few files, not everything needs to be recompiled (though the image must still be re-packed), so that minute-like build time is the maximum, usually it'll be less.


## Prepare the **local** installer tool

You may rebuild the firmware on a remote machine, but you must have the installer tool on the local machine where the module is connected to.

Fortunately, it's also python-based, so we can again employ `virtualenv` here.

If you built the firmware also on your localhost, then there is no need for a separate environment, you may quite well install `esptool` into that one.

Otherwise, create a virtual environment the usual way:

```
[tasmota_installer@lantash ~]$ virtualenv esptool
New python executable in /home/tasmota_installer/esptool/bin/python2.7
Also creating executable in /home/tasmota_installer/esptool/bin/python
Installing setuptools, pip, wheel...done.

[tasmota_installer@lantash ~]$ cd esptool/

[tasmota_installer@lantash ~/esptool]$ . bin/activate

(esptool) [tasmota_installer@lantash ~/esptool]$ pip install --upgrade pip
Requirement already up-to-date: pip in ./lib/python2.7/site-packages (18.1)
```

Now let's install `esptool`:

```
(esptool) [tasmota_installer@lantash ~/esptool]$ pip install esptool
Collecting esptool
  Downloading https://files.pythonhosted.org/packages/5c/85/5654e7b9019739d3d89af0adf528c9ae57a9a26682e3aa012e1e30f20674/esptool-2.6.tar.gz (80kB)
    100% |################################| 81kB 222kB/s 
Collecting pyserial>=3.0 (from esptool)
  Downloading https://files.pythonhosted.org/packages/0d/e4/2a744dd9e3be04a0c0907414e2a01a7c88bb3915cbe3c8cc06e209f59c30/pyserial-3.4-py2.py3-none-any.whl (193kB)
    100% |################################| 194kB 491kB/s 
Collecting pyaes (from esptool)
  Downloading https://files.pythonhosted.org/packages/44/66/2c17bae31c906613795711fc78045c285048168919ace2220daa372c7d72/pyaes-1.6.1.tar.gz
Collecting ecdsa (from esptool)
  Downloading https://files.pythonhosted.org/packages/63/f4/73669d51825516ce8c43b816c0a6b64cd6eb71d08b99820c00792cb42222/ecdsa-0.13-py2.py3-none-any.whl (86kB)
    100% |################################| 92kB 382kB/s 
Building wheels for collected packages: esptool, pyaes
  Running setup.py bdist_wheel for esptool ... done
  Stored in directory: /home/tasmota_installer/.cache/pip/wheels/cf/1f/62/7ad4e47843affd4f5b7032a39f1ef8a153c6d27533614d21aa
  Running setup.py bdist_wheel for pyaes ... done
  Stored in directory: /home/tasmota_installer/.cache/pip/wheels/bd/cf/7b/ced9e8f28c50ed666728e8ab178ffedeb9d06f6a10f85d6432
Successfully built esptool pyaes
Installing collected packages: pyserial, pyaes, ecdsa, esptool
Successfully installed ecdsa-0.13 esptool-2.6 pyaes-1.6.1 pyserial-3.4
```

If you've built the firmware on a remote machine, now it's time to download it into this installer environment (e.g. via `scp` or `sftp`).

**IMPORTANT**: For the subsequent steps your user must have the permission to write the serial port.


## Back up the current firmware (optional)

First of all, disconnect the bulb from the mains and wire up the serial connection **and** a button on GPIO0.

If this GPIO0 is connected to GND when the module gets power, it starts in a firmware-update mode, and you can then read/write its flash storage.

Switch off the power of the board, this will be the reference 'steady state' of the system.

```
(esptool) [tasmota_installer@lantash ~/esptool]$ esptool.py read_flash 0x00000 0x100000 fcmila_bulb_orig.bin
esptool.py v2.6
Found 1 serial ports
Serial port /dev/cuaU0
Connecting......
```

Now, it'll wait for the module to appear connected, so

- press the button (GPIO0 to GND), **keep it pressed**
- switch on the power of the board
- now you may release the button

```
...
Detecting chip type... ESP8266
Chip is ESP8266EX
Features: WiFi
MAC: bc:dd:c2:e0:2a:f2
Uploading stub...
Running stub...
Stub running...
1048576 (100 %)
Read 1048576 bytes at 0x0 in 95.0 seconds (88.3 kbit/s)...
Hard resetting via RTS pin...
```

If all is well, the flash is being dumped, it may take a minute or so.

If done, then **power the module off**, as this management mode is not restartable!

If it's not well, then you may try some queries:

```
(esptool) [tasmota_installer@lantash ~/esptool]$ esptool.py -p /dev/ttyU0 chip_id
...
Chip ID: 0x00e02af2
...
(esptool) [tasmota_installer@lantash ~/esptool]$ esptool.py -p /dev/ttyU0 flash_id
...
Manufacturer: c8
Device: 4014
Detected flash size: 1MB
...
```

If they don't work, then check your cabling and your serial adapter.
Until you can't get this step working, don't proceed to the next one, it won't work either.


## Erase the flash

(With the usual button-pressed-power-on rain dance, and don't forget to power the module off afterwards.)

```
(esptool) [tasmota_installer@lantash ~/esptool]$ esptool.py erase_flash
...
Erasing flash (this may take a while)...
Chip erase completed successfully in 1.6s
```

## Install the firmware to your module

```
(esptool) [tasmota_installer@lantash ~/esptool]$ esptool.py write_flash --flash_size 1MB --flash_mode dout 0x00000 firmware.bin
Configuring flash size...
Compressed 535424 bytes to 367679...
Wrote 535424 bytes (367679 compressed) at 0x00000000 in 33.8 seconds (effective 126.6 kbit/s)...
Hash of data verified.

Leaving...
```

## Power on for normal operation

No button-pressing, power on, and see what you achieved :).

The module sends its logs on the serial line at 115200 baud 8N1,
so to check the logs:

```
(esptool) [tasmota_installer@lantash ~/esptool]$ cu -s 115200 -l /dev/ttyU0 | tee -a my_sonoff.log
Connected
<some initial binary data>
00:00:00 CFG: Use defaults
00:00:00 SM16716: ModuleSelected; clk_pin=4, dat_pin=14)
00:00:00 SRC: Restart
00:00:00 SM16716: Entry; function=FUNC_SET_DEVICE_POWER, index=00, payload=02
00:00:00 SM16716: Update; pwr=00, rgb=000000
00:00:00 Project sonoff Sonoff Version 6.4.1.9(sonoff)-2_4_2
00:00:00 SM16716: Entry; function=FUNC_INIT
00:00:00 SM16716: ModuleSelected; clk_pin=4, dat_pin=14)
00:00:00 WIF: Attempting connection...
...
```

(Assuming that you're using FreeBSD. On Linux you set the speed via `setserial` or `stty`, and then do the dump with `dd`. Or just `minicom`, if you prefer.)

Now you have a complete build path from source to device, and a log feedback as well, so you've got everything needed for being able to implement your ideas :D !
