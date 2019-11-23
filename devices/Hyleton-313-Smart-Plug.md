## Intro
Recently I bought a very nice and compact *Smart Plug* (UK variant) from Aliexpress - a [Hyleton 313](https://www.aliexpress.com/item/Hyleton-smart-plug-10A-Home-Automation-wifi-socket-100-240V-Remote-Control-EU-US-AU-Wifi/32862034918.html). This was in fact the smallest smart plug device with UK plug I've ever seen - it is no bigger than an average USB/phone charger:

![hyleton-313](https://znanev.github.io/images/hyleton-313/hyleton-313.jpg "Hyleton 313 Smart Plug")

Another good thing is that it is built around a ESP8266 module, which gives us the possibility to change its firmware and install Tasmota.

## Open the case
There are no visible screws, however it is not that difficult to open the case using some sharp plastic or metal pry tool and a heat gun (or hair dryer on max setting also works - hold on each side for about 20-30 seconds). Heat the edge of the plug a bit, then work your way slowly and pry from the middle of side with the button, slowly moving the tool towards the corners.

Alternatively if you don't have a heat gun or hair dryer you can use a pry tool or something else thin to slowly "saw" away at the middle of the side with the button until you are through (about 2-3mm) .

With or without a heat gun/hair drier it can be quite tough - **be careful and keep your fingers away from the tool you are using!**

Once you have got through the layer of adhesive you can lever the case open to dislodge the adhesive on the other sides.  Be careful not to accidentally knock off the PCB supports in each corner as these are crucial to safety.

Once the case is open, the top side of the PCB will be exposed:

![top-side](https://znanev.github.io/images/hyleton-313/pcb-top.jpg "PCB top side")

The WiFi module is soldered vertically to the main PCB and sits right next to the relay. In order to get access to its pins, remove the screw from the centre of the PCB. After that the bottom plastic plate, which holds the three mains connector prongs, can be moved a bit to the side without desoldering anything (it is attached with short cables to the PCB, but cables' length is just enough to move it out of the way of the WiFi module's pins).

Here's a view of the bottom side of the PCB:

![bottom-side](https://znanev.github.io/images/hyleton-313/pcb-bottom.jpg "PCB bottom side")

You can see the product labels (product code, date and board revision), as well as the UL number.

## WiFi module pins

Here is a close-up view of the module's pins as seen from the bottom of the main PCB:
![pcb-bottom-module-pins](https://znanev.github.io/images/hyleton-313/pcb-bottom-module-pins.jpg "module pins")

And this is how module pins numbers are mapped (I had to desolder the module looking for labels when I tried to identify it):
![module-pins-numbered](https://znanev.github.io/images/hyleton-313/module-pins-numbered.jpg "module pins")

Failed to identify the module, I had remove the metal shielding cap to find the routing of the ESP8266's pins, so I grabbed the multimeter and soon I had the following table:

|Module pin	|ESP8266 pin|Pin name		|| Pin name		|ESP8266 pin|Module pin|
|:---------:|:---------:|-------------|---|------------|:---------:|:--------:|
|**1**		|7		|Chip Enable		||Tout (ADC)	|6		|**2**		|
|**3**		|9			|MTMS / GPIO14	||MTDI / GPIO12	|10			|**4**		|
|**5**		|12			|MTCK / GPIO13	||MTDO / GPIO15	|13			|**6**		|
|**7**		|15			|GPIO0			||GPIO2			|14			|**8**		|
|**9**		|16			|GPIO4			||GPIO5			|24			|**10**		|
|**11**		|25			|U0RXD			||U0TXD			|26			|**12**		|
|**13**		|*Vdd*		|- 				||-				|*GND*		|**14**		|

## Serial Connection
For programming you need to solder 4 jumper wires to pins *11*, *12*, *13* and *14*: 

|Pin  | Function |
|-----|----------|
|11   | Rx       |
|12   | Tx       |
|13   | Vdd      |
|14   | Ground   |

In this picture Yellow is Tx, Orange is Ground, Grey is Rx and White is Vdd:

![Jumper wires attached](https://i.imgur.com/pIHzDkg.png)

Connect the other end of the wires to your USB-to-serial adapter and make sure the supply voltage selected is 3.3V.

Shorting pin *7* (GPIO0) to ground while plugging the serial adapter into the computer's USB port will bring the module into UART firmware upload mode. See devices/Esptool for details of how to flash the firmware when in firmware upload mode.

Once you have flashed the firmware, leave the jumpers soldered to the pins and unplug & reinsert your USB-to-serial adapter - this will reset the unit and provide voltage to the ESP8266 which will then boot the new Tasmota firmware - you'll see a Wifi network called "sonof-xxxx" if it has flashed successfully worked (if you do not see the wifi, the flashing process might not have worked correctly and you'll need to try again).

If you see the wifi network come up ok, you can de-solder the jumpers and reassemble the unit.

## Reassembly

Screw the PCB back to the housing, and place the PCB back into the other half of the socket. Apply a small 1mm bead of super glue around the edges and firmly clip the two halves back together again, and hold firmly for about 30 seconds to allow the glue to cure. 

> ### Dangerous Failure Mode To Avoid
> When reassembling the plug, be extremely careful to ensure that the resistor next to the PCB screw is not leaning towards the earth (top) pin! It is very easy to slightly bend it towards the earth pin when unscrewing. If the resistor is too close to the earth pin, the plastic shield for the earth pin on the upper-half of the case will press the resistor down onto the earth pin and when a plug is inserted it can short-out and trigger a small explosion:
>
> <img src="https://i.imgur.com/EljDTYH.jpg" alt="Do not let the resistor short-out on the earth pin" width="400"/>
>
> <img src="https://i.imgur.com/KjzsoFu.jpg" alt="Do not let the resistor short-out on the earth pin" width="400"/>
>
> This will kill the socket, and maybe you too. Take extreme caution - mains electricity is dangerous.
>
> If you cannot neatly clip everything back into place (i.e. the two halves of the shell don't neatly sit together again, or there is a springiness) then you may have caught the resistor. If you accidentally broke off the PCB standoffs when opening the case, this is harder to detect (as the PCB may be pushed further down than usual) so be especially careful.  Double & triple check.

If you've done everything right you should have a fairly clean looking plug still with just a small amount of cosmetic scratches on the bottom side of the unit where you used the pry tool.

## Configuration

Enroll your plug back onto your wifi as usual for Tasmota (i.e. join the wifi network started by the plug, give it your wifi details, then restart it).

Once *Tasmota*'s WebUI configuration interface is loaded in the browser, you need to configure the template type:

1. Go to "Configuration"
1. Go to "Configure template"
1. Create a new template that looks like this one and save it:

![Tasmota configuration](https://i.imgur.com/8lfHqhU.png)

Once you have saved the template:

1. Wait for the device to restart
1. Go to "Configuration"
1. Go to "Configure module"
1. Select the new template you just created and save.

### Note on LEDs
*Sonoff* devices usually have a bi-colour LED, but just one of the colours can be controlled directly. The other colour is usually tied together with the relay, so it cannot be controlled independently. I think that is the reason why the *Tasmota* firmware by default controls just *Led1* when a single relay is configured. In the configuration above, only the blue LED will be used (tied to *GPIO2*). But if you prefer the red LED, just change the values for *Led1i* and *Led2i* (select *Led1i* for *GPIO0* and *Led2i* for *GPIO2*).

## Additional Details
If you want to read a detailed project log that uses this plug, you can do so at [GitHub Blog page](https://znanev.github.io/Hyleton-313-Smart-Plug/), although some of the information is now out of date.

 