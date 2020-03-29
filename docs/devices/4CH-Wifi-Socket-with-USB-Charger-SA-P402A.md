### Products
* [WiFi-Socket-Smart-Power-Strip at aliexpress](https://www.aliexpress.com/item/WiFi-Socket-Smart-Power-Strip-Voice-Control-Timer-Switch-Power-Strip-Outlet-with-4-AC-Outlets/32914473349.html)
* AKA: SA-P402A BY-V1.1. 180823
* [Wifi Smart Power Strip 4 EU Outlets Plug with 4 USBCharging Port at aliexpress](https://www.aliexpress.com/item/Wifi-Smart-Power-Strip-4-EU-Outlets-Plug-with-4-USBCharging-Port-Timing-App-Voice-Control/32939654903.html) also at [Amazon.de as AOFO ZLD-44EU-W](https://www.amazon.de/gp/product/B07SKTBC47/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1)
* [Koogeek Wifi Smart USB Power Strip Socket at aliexpress](https://nl.aliexpress.com/item/Koogeek-Smart-Power-Strip-4-Port-USB-4-AC-Outlets-Plug-Socket-Voor-Alexa-Google-Thuis/32932078575.html)
* AKA: 0710033644644 / KLOE4

![vierfachdose](https://user-images.githubusercontent.com/3671232/51432807-25d86700-1c3e-11e9-871e-bffdbd35eefc.jpg)

### Opening
To open take a very small screwdrive to pull out the six feets. Don't remove the rubber plates, it won't help.

![fuesschen](https://user-images.githubusercontent.com/3671232/51432805-25d86700-1c3e-11e9-9d48-bad4c086510d.jpg)

### Flashing
You'll have to connect GPIO0 manually, the switch is connected to GPIO1. It marked the pin in the picture. Because the TYWE2S has 2mm pitch, I made a little adapter to 2,54mm pitch. Then it can easy soldered to the first four pins. From left to right 3,3V, Gnd, Rx, Tx.

![anschluss](https://user-images.githubusercontent.com/3671232/51432804-253fd080-1c3e-11e9-9030-80a459afe06e.jpg)

### Configuration
Configure the USB-Charger as number five, then the next socket as number one and so on. 
This is the configuration:

![configure module](https://user-images.githubusercontent.com/3671232/51432806-25d86700-1c3e-11e9-90a1-0ad73de47a14.png)

* For the other model (Koogeek and AOFO) the GPIO connections are a bit different:
* LED: 		GPIO1
* Switch: 	GPIO3
* Socket 1: 	GPIO5
* Socket 2: 	GPIO4
* Socket 3: 	GPIO12
* Socket 4: 	GPIO13
* USB: 		GPIO14