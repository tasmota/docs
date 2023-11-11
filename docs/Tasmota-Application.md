# Tasmota Application Files 

!!! info "Easily import any configuration or script using the `.tapp` file extension :material-cpu-32-bit:"

Any file with `.tapp` (Tasmota Application) extension will be considered as an uncompressed ZIP, and if it contains a sub-file `autoexec.be` it will be executed. In parallel `tasmota.wd` (working dir) contains the archive tapp prefix to easily load other assets from the same archive.

!!! example 
    `heating.tapp` contains: `autoexec.be` and `html.json`. The sub-file `html.json` can be opened with `f = open(tasmota.wd + "html.json", "r")`

Berry allow imports from files inside a Tasmota App (.tapp file). Also enabled `sys` module.

Here is the code you should add in your `autoexec.be` inside tapp file:

```berry
import sys
var wd = tasmota.wd
if size(wd) sys.path().push(wd) end

# [...] you can import files from within the archive

if size(wd) sys.path().pop() end
```

## TAPP's

### LCD/OLED Anti Screen Burn

* copy [Antiburn.tapp](https://raw.githubusercontent.com/arendst/Tasmota/development/tasmota/berry/modules/Antiburn.tapp) to file system
* Either issue Tasmota command `Antiburn` or programmatically using `lv.antiburn()` in Berry

The LVGL screen will change from black to red to green to blue to white each second for 30 seconds. The anti-burn cleaning can be cancelled by touching the screen or it will complete after 30 seconds. Once complete the previous screen will be reloaded.

### Partition Management

[Partition Wizard](https://raw.githubusercontent.com/arendst/Tasmota/development/tasmota/berry/modules/Partition_Wizard.tapp)

[Partition Manager](https://raw.githubusercontent.com/arendst/Tasmota/development/tasmota/berry/modules/Partition_Manager.tapp)

To run either of these apps, simply upload the .tapp file to the filesystem and reboot the board.  After doing so, the app will appear on the consoles page in the GUI.

![Partition_Wizard](_media/Partition_Wizard.png)

### Display Calibration

Tasmota Application useful for Touch Screen calibration (resistive touchscreens only). This application guides you through simple steps and generates automatically the required settings in `display.ini` (the ':M' line).

1. First download [`DisplayCalibrate.tapp`](https://raw.githubusercontent.com/arendst/Tasmota/development/tasmota/berry/modules/DisplayCalibrate.tapp) application and upload it in the file system, and restart.

2. Make sure you are in orientation `DisplayRotate 0`

3. In the console, type the command `DisplayCalibrate`

You will see the following screens. Click on all 4 crosses near corners.

![ts_0](https://user-images.githubusercontent.com/49731213/149639165-a03a3864-1403-4f0c-8a7b-760db1ff926d.png)

![ts_1_0](https://user-images.githubusercontent.com/49731213/149639166-360572ac-3e8c-4e9d-a3e4-62ff8d67896c.png)

![ts_1_1](https://user-images.githubusercontent.com/49731213/149639168-cf7eb258-742c-4e53-a0ed-709f3b347deb.png)

![ts_1_2](https://user-images.githubusercontent.com/49731213/149639169-2b7c9f22-7834-473f-83c7-39c32e94c461.png)

![ts_1_3](https://user-images.githubusercontent.com/49731213/149639170-63681b67-cf37-4e73-9776-af762bc7d617.png)

Note: measures are taken every 50 ms and are averaged, and requires at least 3 measures (150ms).

If everything went well, you will see the following screen. After reboot, your touchscreen is ready and calibrate.

![ts_ok](https://user-images.githubusercontent.com/49731213/149639215-cadf5d58-9d31-4278-8f21-927487ed7058.png)

If the geometry is wrong, you will see the following screen and no change is done to `display.ini`

![ts_nok](https://user-images.githubusercontent.com/49731213/149639222-32a9ead6-e4fe-4a63-a4fe-6c8fb7ad11c3.png)
