There are several Tuya dimmer and switch variants made by various manufacturers. The switches range from 1 to 8 gangs. The dimmers are usually 1 gang. They dim mains voltage for various lighting types: incandescent, CFL, and LED. Consult the specific device for the type of bulbs and capacity it supports as well as the bulbs themselves to verify they support dimming.

## Identification and Technical details

The basic identification of a Tuya device is when the device information references the "Tuya Smart", "SmartLife", or "Smart Living" app. These switches and dimmers are based on a [Tuya TYWE3S Wi-Fi PCB](https://docs.tuya.com/en/hardware/WiFi-module/wifi-e3s-module.html) module along with an MCU. TYWE3S is based on the ESP8266 which is supported by Tasmota.

[Wiki page for TYWE3S](devices/TYWE3S)

The TYWE3S module mostly takes care of Wi-Fi and software features while the MCU controls the actual hardware (buttons, relays, dimmer, power measurement, etc). The MCU is interfaced to TYWE3S using the serial interface which connects to the Rx and Tx pins.

The easiest way to identify if your switch or dimmer uses MCU is by using a continuity tester (multimeter, ohmmeter) and checking continuity from the Rx and Tx pins on TYWE3S to any other chip. Then check the datasheet of that chip to see if it is an MCU.

## Flashing - Preparation

To boot the TYWE3S in flashing mode, GPIO0 needs to be connected to GND while powering up. It can be left grounded for the entire process. Flashing a TYWE3S connected to a MCU is a bit trickier than one without MCU. This is due the same Rx Tx pins used by MCU and serial programmer for flashing. The TYWE3S cannot be booted to flash mode with MCU sending data over the same pins. To be able to do that, we need to disable MCU from sending data over Rx and Tx pins. There are few ways to do it:  
1. Disconnect TYWE3S module from the rest of board. _(Naah, too much work)_
2. Just break the Rx track from MCU to TYWE3S, flash and then reconnect. _(Messy work, we want cleaner approach)_
3. Just keep MCU disabled while flashing TYWE3S without any soldering / cutting. _(We like that)_

The easiest is to keep MCU disabled is by identifying the NRST/RST (Reset) pin of the MCU from its datasheet and connect it to GND for the entire flashing process. This will keep MCU disabled while you flash TYWE3S. If there are some contacts or test points in switches that connect to the MCU, you might be lucky to find contacts for RST that you can easily solder onto.  

### TYWE3S Connection Options
1. 3D print a [flashing Jig](https://www.thingiverse.com/thing:3231225) and use pogo pins to make nice and easy to use flashing jig
2. Solder wires directly onto TYWE3S
3. Use a jumper header like the one below and bend the pins to match VCC, Rx Tx GPIO0 and GND. You can just press the jumper header to the contacts during the flashing process

![](https://www.mouser.co.uk/images/tycoelectronics/lrg/PR1055044A_header_SPL.jpg ":size=100")

## Flashing - Process

Once you are done identifying the pins and ready to connect, *BEFORE connecting USB to PC* you need to connect them as follows:  
**NOTE : Use 3.3V NOT 5V**  

TYWE3S | Serial<BR>Programmer
:-:|:-:
RX | TX
TX | RX
GPIO0 | GND
GND | GND
VCC | 3.3V

If an MCU is present, bridge RST to GND on the MCU

Use a 6.6.0.10 Tasmota version or higher. There are lots of Tuya Serial fixes / features added in there and the tutorial below expects them.

Now you need to follow the commands explained in the [flashing tutorial](installation/Flashing).

TIP: If you are using jumper headers use `sleep 15 &&` before your commands, this would free your hand and give you some time to set the jumper pins and connect the USB to PC.

## Configuration

1. Once Tasmota is flashed on the TYWE3S, just disconnect GND -> GPIO0 (and RST if there is an MCU), and power your device again from USB. 
2. On your PC, you should see a Wi-Fi network named `sonoff-xxxx` where `xxxx` is a number from the ESP's MAC address.
3. Connect to it and go to 192.168.4.1 in your browser. Enter the Wi-Fi credentials for your network and click save.
4. Connect your PC back to your network. Now you need to find the IP of newly connected Tasmota device. Refer to this very [good video from SuperHouseTV](https://www.youtube.com/watch?v=IcOFeIcLFFo&t=1623s) (ignore flashing information) about configuring Tasmota.
5. Once you get to the Tasmota configuration you need to select `TuyaMCU` module assign GPIO components as indicated below depending on your hardware. You already know the pin connections to the MCU.

   GPIO | Component
   :-:|-
   01 | Tuya Rx (108)
   03 | Tuya Tx (107)
   &nbsp;|&nbsp;
   13 | Tuya Rx (108)
   15 | Tuya Tx (107)

6. If the device is connecting fine to your network, now is the time to power it down and re-assemble it. Connect a test bulb (or to the final place if you don't mind testing there)
7. Once this is saved and device is rebooted. Open the Tasmota configuration page and you should be able to use the Toggle button to toggle the dimmer or at least one of the gangs in a multi gang switch.
8. Follow the process [here](TuyaMCU) depending on switch or dimmer.

# Product Specific guides
## Otim Dimmer
This Device is based on a Tuya Wi-Fi Module. Refer to ["MCU Based Tuya Dimmers and Switches"](TuyaMCU-Devices) for details.  

![](https://github.com/digiblur/TuyaDimmer-Tasmota/raw/master/IMG_0788.JPG)
![](https://github.com/digiblur/TuyaDimmer-Tasmota/raw/master/IMG_1946.JPG)
![](https://github.com/digiblur/TuyaDimmer-Tasmota/raw/master/IMG_4881.JPG)
![](https://github.com/digiblur/TuyaDimmer-Tasmota/raw/master/IMG_8149.JPG)

[Flashing and Setup Video Guide](https://www.youtube.com/watch?v=fyxxk2NrKG8)

These devices use a Tuya TYWE3S Wi-Fi PCB module.  Once the switch is carefully popped open you will need to remove the ribbon cables for flashing and ease of soldering.  An easy soldering method is to take several Dupont style jumper wires, cut one end off, and apply a bit of solder to each stripped end. This will keep the wire flexible and prevent any circuit board pads from ripping off. Apply a bit of solder to each pad necessary to flash (double check your pin-outs).  Once the wire and pad have solder simply put the two together and apply a bit of heat and they will join together.  

![tywe3s_3](https://user-images.githubusercontent.com/3240875/43324698-669affd6-917a-11e8-8e06-c800741bfb68.png)
![chip_wires](https://user-images.githubusercontent.com/3240875/43324672-578ffcbc-917a-11e8-800c-f1d008ca3cf4.JPG)

Attach the GPIO0 wire to ground during initial boot to flash. You may need to also connect MCU RST to GND during initial boot to get it into programming mode as described [here](https://forum.iobroker.net/topic/9886/tuya-jinvoo-unterputz-wandschalter/17). A 3-pin header bridged together works great with GPIO0, GND and the GND from the USB flasher attached. (TX pin to RX pin and RX pin to TX pin on USB flash adapter). Verify that you are using 3.3volts to flash, **NOT 5V!**

Product Links:

- [Oittm](https://www.amazon.com/gp/product/B07D127YL5)
- [Moes DS01](https://www.amazon.com/gp/product/B07DRG19S6) ([Template](https://blakadder.github.io/templates/moes_DS01.html))
- [Konesky](https://www.amazon.fr/gp/product/B07L3LNVG1/)
- [Heygo](https://www.amazon.com/gp/product/B07JG6T1G8/)

### Costco Charging Essentials

This devices use a Tuya TYWE1S Wi-Fi PCB module. And it uses U1TX (GPIO15) and U1RX (GPIO13) to communicate between ESP8266 and MCU, no other GPIO is used in this device.

#### Flashing

![tywe1s](https://user-images.githubusercontent.com/34905120/47533504-f524a380-d881-11e8-9b23-61c20074b06f.png)
![CE Dimmer](https://user-images.githubusercontent.com/34905120/47618033-a30f9800-daa4-11e8-80b7-de041c57ab36.jpg)

The CE dimmer uses standard Tuya GPIO

[Product Link](https://www.costco.ca/CE-Smart-Home-Wi-Fi-Smart-Dimmer-Light-Switch%2c-2-pack.product.100417574.html)

### Touch (EU and US) - Multiple manufacturers

#### Flashing
![Tuya-Touch](https://user-images.githubusercontent.com/1183624/42902025-7b57aa9a-8acd-11e8-8fed-bda9bff28e70.png)

The procedure is similar to above, additionally NRST must be connected to GND during flashing.

#### Optional configuration (recommended)

[`LedState 0`](Commands#ledstate) Only use the green LED for Wi-Fi/MQTT connectivity status.  

### Product Links:

- [AIGLEN](https://www.aliexpress.com/item/WiFi-LED-Dimmer-Switch-220V-110V-Dimming-Panel-Switch-Connected-To-Alexa-Google-Home-Voice-Control/32859257784.html)
- [ALLOMN](https://www.amazon.de/Lichtschalter-Fernbedienung-Timing-Funktion-%C3%9Cberlastschutz-Neutralleitung/dp/B07BKY1N9S)
- [MakeGood](https://www.aliexpress.com/item/32663017309.html?spm=a2g0o.productlist.0.0.2cb63c95dOaB98&algo_pvid=0b6ae362-b37d-43dc-8aa2-2f26263b8d20&algo_expid=0b6ae362-b37d-43dc-8aa2-2f26263b8d20-21&btsid=bfb628ab-6c5b-4236-94f4-b57775d95fee&ws_ab_test=searchweb0_0,searchweb201602_6,searchweb201603_55)


## Zemismart Curtain Motor
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

### DM_WF_MDV4 Leading edge dimmer
![DM_WF_MDV4 Dimmer and Case](https://user-images.githubusercontent.com/34340210/66512192-6c107780-eaa6-11e9-9584-e8b3f77cba14.jpg)

This is a 240V Leading Edge Dimmer with a TYWE3S controller and an STM8 MCU

### Flashing:

The NRST pin of the STM8 needs to be grounded upon boot to disable it, this is brought out to a header pin, along with ground and VCC from the TYWE3S. Confirm by checking continuity with a multimeter

IO0 from the TYWE3s also needs to be grounded upon boot, otherwise it's normal tasmota flashing procedure.

Header pins from left to right
*VCC
*Unknown
*Ground
*STM8 NRST

![Header](https://user-images.githubusercontent.com/29167124/66513019-1d78d280-ead2-11e9-8a6e-d33e82b60154.png)

![TYWE3S](https://user-images.githubusercontent.com/29167124/66513030-236eb380-ead2-11e9-9887-d87159f2a0ab.png)

![STM8S003F3P6](https://user-images.githubusercontent.com/29167124/66513040-2669a400-ead2-11e9-9a70-ef29f9c231d0.png)

### Config:
As per main TuyaMCU page using

   GPIO | Component
   :-:|-
   01 | Tuya Rx (108)
   03 | Tuya Tx (107)

### More information:
Bought from [ebay](https://www.ebay.co.uk/itm/Smart-Wifi-Dimmer-Switch-Support-Tuya-Smart-Life-LED-Light-Timing-Remote-Control/233233166207)

[More information on TYWE3S](https://docs.tuya.com/docDetail?code=K8uhkbb1ihp8u)]

## Product Links:

- [AIGLEN](https://www.aliexpress.com/item/WiFi-LED-Dimmer-Switch-220V-110V-Dimming-Panel-Switch-Connected-To-Alexa-Google-Home-Voice-Control/32859257784.html)
- [ALLOMN](https://www.amazon.de/Lichtschalter-Fernbedienung-Timing-Funktion-%C3%9Cberlastschutz-Neutralleitung/dp/B07BKY1N9S)
- [MakeGood](https://www.aliexpress.com/item/32663017309.html?spm=a2g0o.productlist.0.0.2cb63c95dOaB98&algo_pvid=0b6ae362-b37d-43dc-8aa2-2f26263b8d20&algo_expid=0b6ae362-b37d-43dc-8aa2-2f26263b8d20-21&btsid=bfb628ab-6c5b-4236-94f4-b57775d95fee&ws_ab_test=searchweb0_0,searchweb201602_6,searchweb201603_55)
- [ZemiSmart](https://www.zemismart.com/zemismart-smart-curtain-alexa-google-home-electric-stage-curtain-motorized-tuya-wifi-curtain-motor-with-track-p0160-p0160.html)
