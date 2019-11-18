This Device is based on a Tuya Wi-Fi Module. Refer to ["MCU Based Tuya Dimmers and Switches"](MCU-Based-Tuya-Dimmers-and-Switches) for details.  

Curtain motors come in a confusing array. This one has a little Wi-Fi dongle, that looks like a USB stick. But it talks using `9600 8N1`, not USB. This means we can unplug the Tuya Dongle and flash it without worrying about the PCI micro. Excellent.

![Dongle and Motor](https://user-images.githubusercontent.com/43923557/64846609-25735d00-d661-11e9-8d51-a315c45fc462.jpg)

![TY-TYWE1S PCB](https://user-images.githubusercontent.com/43923557/64846576-18566e00-d661-11e9-8025-c2e400384267.jpg)

`U1RX` and `U1TX`, top right of the module are connected to the USB plug on `D-` and `D+` respectively. This dongle uses a Tuya TYWE1S, which is an ESP8266 with 2MB flash. USB3 pin `R-` connects the onboard LED to the MCU via a 4k7 resistor. `R+`, `T+`, and `T-` are all unused and unconnected on the motor PCB, so I liberated them for soldering to `GPIO0`, `U0RX` and `U0TX`, to flash the chip.

![modded_tuya](https://user-images.githubusercontent.com/43923557/64847157-7899df80-d662-11e9-8133-2c6201658ec2.jpg)

* short GPIO0 and flash Tasmota
* Connect to your Wi-Fi and get MQTT and SSL working
* change to TuyaMCU with `module 54` (will reboot)
* Switch from U0RX/TX to U1RX/TX with `backlog gpio1 0; gpio3 0; gpio15 107; gpio13 108` (will reboot)
* Treat DpId 0x65 as a Dimmer with `tuyamcu 21,101`
* Allow the dimmer to get down to 1% with `setoption69 0`

And done. The curtain motor now presents as a Dimmer, with 100% full brightness = fully closed, and 0% full darkness = fully open. 

The curtain motor also presents DpId 0x66 as a single event "Full Open" `00`, "Full Close" `01`, and "Stop" `02` command; but as of September 2019, I can't see how to get that working.

The curtain motor also presents DpId 0x67 as a Boolean. I have only seen value 0x01 in all my prodding. `55 aa 00 07 00 05 67 01 00 01 01 75` = 07 Status, 0005 length, 67 DpId, 01 type, 0001 length, 01 value, 75 checksum

### Product Links:
- [ZemiSmart](https://www.zemismart.com/zemismart-smart-curtain-alexa-google-home-electric-stage-curtain-motorized-tuya-wifi-curtain-motor-with-track-p0160-p0160.html)