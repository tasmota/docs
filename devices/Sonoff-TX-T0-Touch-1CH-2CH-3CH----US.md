June 2019 - Devices delivered with Sonoff v3.3.0 stock firmware.

- [Product page](https://www.itead.cc/sonoff-tx-series-wifi-smart-wall-switches.html)
- [Banggood](https://www.banggood.com/SONOFF-T3-EUUSUK-AC-100-240V-123-Gang-TX-Series-WIFI-Wall-Switch-433Mhz-RF-Smart-Wall-Touch-Light-Switch-For-Smart-Home-Work-With-Alexa-Google-Home-p-1470799.html?rmmds=search&ID=3426528397&cur_warehouse=CN)

Serial flashing works for this device. You may wish to check whether the [Sonoff DIY](Sonoff-DIY) flashing method works if this device is upgraded to v3.3.1.

Board label: `T0US TOUCH v1.0 2008.11.15`

* TX T0 US, 1-3CH boards are physically the same.
* Only need the "top board" to flash (not the bottom relay part) -- don't power with mains (you can't if you only use top anyway)
* R19 is tied to GPIO 0 to enter flash mode, just like on T1 but in a different spot for t0 (or US?).
  - Find the C2 (j1) pins and look directly up about half inch for r19
* Ensure that you select 3.3v and **not 5v!** to flash the board.
* ESP8285 - 1M - DOUT - erase flash - 115200 baud

Like the T1, this does not have enough room to solder a header on.

Use a piece of thick cardboard to lay your top board on. Firmly press some jumpers through the serial holes into the cardboard.

If you push these through at an angle will be good enough to make contact to connect to your serial adaptor, trial and error but is not hard. See photo below.

Regular flashing steps apply: connect Ground, Vcc TX, RX to your serial adaptor. Pay attention to TX/RX!

For flash mode, use another jumper through the ground hole on the C2 pins (left of the serial and label J1). Same as above, push the jumper through cardboard to secure it.

While powered off hold the other end of jumper to R19 and then power up (plug in your USB serial adaptor).

Hold it for 3-5 seconds after it powers up before removing it. 

You should not see the network status led flash anymore, then you know you're in flash mode. If its flashing power off and try again.

Using the TX T1 1-3 device template will work. A new T0 template is forthcoming. 

![image](https://user-images.githubusercontent.com/52976730/61833228-9c4e5f80-ae41-11e9-909b-1ea5d10f9deb.png)
![image](https://user-images.githubusercontent.com/52976730/61833325-f3eccb00-ae41-11e9-896a-4e9ebe4f47d9.png)

## Start-to-Finish Flashing Guide
### [Flashing](installation/Flashing)
1. Connect the device's serial interface pins to the [Serial-to-USB adapter](installation/Prerequisites#serial-to-usb-adapter). **Be sure that your adapter is set to supply 3.3v**. Place a jumper wire from GND to the side of R19 nearest the screw hole cutout - this is connected to GPIO0.
2. Download `tasmota.bin` from http://thehackbox.org/tasmota
3. Have [`Tasmota PyFlasher`](installation/Flashing#nodemcu-pyflasher) running with the correct settings. Be sure to select `DOUT` and `Erase flash - yes`. Select the right COM port for your serial-to-USB adapter and select `tasmota.bin` from the folder where you downloaded the file. 
4. Plug the serial adapter into the USB port and click the `Flash` button on `Tasmota PyFlasher`.
5. When you get the flash complete, remove the GND jumper wire from GPIO0.
6. Cycle power on your device by disconnecting the serial adapter from the USB port for a couple of seconds and plugging it back in.

### [IP Configuration](installation/Initial-Configuration#configure-wi-fi)
1. Using a mobile device, scan for Wi-Fi networks and connect to the **`sonoff-xxxx`** access point. When it connects to the network, you may get a warning that there is no Internet connection and be prompted to connect to a different network. _Do not allow the mobile device to select a different network_.
2. Open the browser on your mobile device and navigate to http://192.168.4.1.
3. In the Tasmota web UI, scan wifi networks and select the network for your home. Then enter the network's password (_**click the checkbox to see the password you enter to ensure that it is correct and that your mobile device has not inadvertently capitalized the first letter if it is supposed to be lower case nor autocorrected what you entered**_). When you save the settings, the device will restart and connect to your home network. The `sonoff-xxxx` network will not longer be present. Therefore your mobile device will automatically be disconnected and should connect back to its data network.
4. Check in your router or use an IP scanner to ensure that the device is connected to your home network. Make not of the IP address assigned to your device.
### [MQTT Configuration](installation/Initial-Configuration#configure-mqtt)
1. Go to new IP address (http://`IP`) in a browser.
2. Click Configuration->Configure MQTT->
   * MQTT Host: Enter the address (192.168.xx.yy or Hostname) of your MQTT broker. If you use the Home Assistant embedded broker, this will be your HA server.
   * User: Enter the username for your MQTT broker
   * Password: Enter the password for your MQTT broker
   * Topic: Enter the unique MQTT topic for your device
   * Save your settings. The device will restart

### [Device Configuration](installation/Initial-Configuration#configure-module-or-template)
1. Click Configuration->Configure Module->Module Type->Sonoff T1 3CH (30) (the appropriate module for your device model) and save. The device will restart.
2. Test the operation of the switches from the web UI. You should hear the relays click.
3. Click Console
4. If you use Home Assistant, enter [`SetOption19 1`](Commands#setoption19) to enable device auto-discovery.
5. Check the log for any errors.
 
Reassemble the switch and connect it to mains power. Check in your router or use an IP scanner to ensure that the device is connected to your home network. Also use the Tasmota web UI to ensure the switch is operating as expected.  

### Home Assistant Configuration
1. Open TasmoAdmin via Hassio and Autoscan
2. In Name1->Name3 enter switch position names again (note: understand orientation of switch)
3. Go to ‘Devices List’ and check/test buttons click 
4. Click Cog configuration and enter names again and save
5. Click Cog configuration, go to MQTT and change Group Topic to **swtheatre** and save
6. Go to Devices List again and the circle arrows to restart the device
7. Go to Integrations->MQTT and find the new switch and rename/locate items accordingly
