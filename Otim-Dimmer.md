This Device is based on a Tuya Wi-Fi Module. Refer to ["MCU Based Tuya Dimmers and Switches"](MCU-Based-Tuya-Dimmers-and-Switches) for details.  

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
