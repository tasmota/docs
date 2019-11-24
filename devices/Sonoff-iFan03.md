(For information on the iFan02 please see here - [iFan02](devices/Sonoff-iFan02))

## Serial Flashing
Please see the [Hardware Preparation](installation/Hardware-Preparation) page for general instructions.

Next, please see the [Flashing](installation/Flashing) page for general information on the flashing process.

Flash the latest version of [`tasmota.bin`](http://thehackbox.org/tasmota/release/tasmota.bin):

1. Connect your serial flashing device pins to the iFan03 (for connection locations see the pin out on the left hand side of the picture below).  
   ![](https://github.com/tim-dcl/BRUH3-Home-Assistant-Configuration/blob/master/IMG_20190817_155847511_HDR.jpg)

2. When you are ready to flash your device, hold down the large white tipped button on the iFan03 while connecting the serial adapter to your computer. This will power the serial adapter as well as the iFan03. Usually, you can release the button on the iFan03 once it has fully booted - after 3-5 seconds once the lights have flashed. If the device does not enter programming mode successfully, cycle power but this time continue to hold the button during the entire firmware upload process (i.e., step 4 below).

3. Using Tasmota PyFlasher (recommended):
   - Select the firmware file that you want to flash
   - Set the COM port for your serial programming adapter
   - Ensure that flash mode `Dual Output (DOUT)`, and baud rate of `115200` is selected
   - If you are flashing Tasmota for the first time, also select `yes, wipes all data`.

4. Click on the "Flash NodeMCU" button and wait until the flashing process is completed. 

5. Cycle power on the serial adapter by unplugging and plugging it back in from the USB port. Do not hold down the iFan03 button. Wait for the iFan03 to reboot.

6. If this is the first time you have flashed Tasmota on the device, connect to the iFan03 `sonoff-xxxx` Wi-Fi access point and configure your Wi-Fi credentials by opening `192.168.4.1` in a browser. Wait for the iFan03 to reboot.

7. Find the IP address of the iFan03 and navigate to that IP address in any browser. Select "Configure Module" from the "Configuration" menu and select `Sonoff iFan03 (71)` from the drop down list.

8. Wait for the iFan03 to restart and then continue any other required or desired configuration.

## US Ceiling Fans

The capacitors in the iFan03 do not set the speed of US fans correctly. To correct the speeds for US ceiling fans, you need to remove the existing capacitors from the iFan03 and replace them with equivalently electrically rated 5uF (microfarad) capacitors. **Do NOT do this if you are not comfortable using a soldering iron as improperly performing this action could increase the risk of bodily injury or property damage.**
![](https://github.com/tim-dcl/BRUH3-Home-Assistant-Configuration/blob/master/IMG_20190817_155903267.jpg)
![](https://github.com/tim-dcl/BRUH3-Home-Assistant-Configuration/blob/master/IMG_20190817_155910936_HDR.jpg)
![](https://github.com/tim-dcl/BRUH3-Home-Assistant-Configuration/blob/master/IMG_20190817_155853950_HDR.jpg)

## RF Remote Control Pairing

To pair the remote control after the device has been flashed with the new firmware, the device needs to be powered from _**mains**_ voltage (not from the USB serial flashing device). **Be careful dealing with mains voltages. Ensure that all connections are correctly made and that the iFan03 covers are properly re-assembled.**

To pair the remote control, hold down any button on the remote control and apply power to the iFan03. Once the device boots up you should hear a series of clicks as the internal relays operate. Once completed you can test the remote and it should all be operational.