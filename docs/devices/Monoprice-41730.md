
![Monoprice 417301](https://images.monoprice.com/productlargeimages/417301.jpg)

[STITCH by Monoprice Mini Wi-Fi 10A Outlet on monoprice.com](https://www.monoprice.com/product?p_id=41730)


The WiFi module is the [ESP8266](Pinouts/#esp8266-and-esp8285)

This is based on the documention created for the [Teckin sp10](devices/Teckin-sp10) and the [Hyleton 313 Smart Plug](devices/Hyleton-313-Smart-Plug)

## Opening the smart plug

*NOTE*: There are probably easier and/or cleaner ways to do this.  I am sharing how I opened mine and exposed the pins to flash Tasmota.


The cover and the back are fused together with a "plastic weld" forming a seam around the back edge of the plug.  Using at least one very small and durable flathead screwdriver, [I used some from this Craftsman jeweler set](https://www.amazon.com/gp/product/B07QRCYC78/), pry along the seam on the back.  After the seam has been broken, the two pieces will slide apart.

The pins used to flash Tasmota are still behind a piece of the back plastic cover.  Using a a cutting wheel on a Dremel rotary tool,  I cut just enough to expose all of the pins.  All of the pins do not need to be accessed so you can make a more precision cut if desired.

![Monoprice-417301 pins exposed](_media/Monoprice-417301-cutout.jpg)

ESP8266 is mounted in vertically in a edge connector module.  The red line is to show where the cut made on the other side.

![Monoprice-417301 inside](_media/Monoprice-417301-inside.jpg)

## WiFi module pins

The five (5) relevant pins have highlighted in different colors 

![Monoprice-417301 pins exposed](_media/Monoprice-417301-cutout-with-pin-numbering.jpg)

The pin number follows the same pattern as the [Teckin sp10](devices/Teckin-sp10/).

My version of the device is labelled `C7 HYS-X5-SOCKET_V1.2` (it is printed in the PCB and can be seen when the cover is removed.  It is visible in the image with the red line above)

Using a multimeter, I traced as many of the pins a possible but some seemed to map to multiple pins.  These are not needed to flash Tasmota

![Monoprice-417301 pins exposed](_media/Monoprice-417301-pin-numbering.jpg)

||Module pin	|ESP8266 pin|Pin name		|| Pin name		|ESP8266 pin|Module pin||
|:---:|:---------:|:---------:|-------------|---|------------|:---------:|:--------:|:---:
||**1**		|7		|Chip Enable		|| ?            | ?		    |**2**		||
||**3**		|9			|MTMS / GPIO14	|| ?            | ?		    |**4**		||
||**5**		|12			|MTCK / GPIO13	|| ?            | ?		    |**6**		||
|<span style="background-color:#c569b0;padding:5px 10px">&nbsp;</span> |**7** 			|15			|GPIO0			|| ?            | ?		    |**8**		||
||**9**		|16			|GPIO4			|| ?            | ?		    |**10**		||
|<span style="background-color:#1aff1a;padding:5px 10px">&nbsp;</span>|**11**		|25		|U0RXD			||U0TXD			|26			|**12**		|<span style="background-color:#e1be6a;padding:5px 10px">&nbsp;</span>|
|<span style="background-color:#0c7bdc;padding:5px 10px">&nbsp;</span>|**13**		|*Vdd*		|- 				||-				|*GND*		|**14**		|<span style="background-color:#4b0092;padding:5px 10px">&nbsp;</span>|

## Serial Connection
For programming you need to solder 5 jumper wires to the module pins *7*. *11*, *12*, *13* and *14*. 


Connect the other ends of the wires solder to pins *11*, *12*, *13* and *14* to the USB-to-serial adapter's *Tx*, *Rx*, *Vdd* and *GND* pins respectively.  Ensure that the Vdd is 3.3v.


NOTE: The Tx from the module goes to the Rx of the serial adapter and the Rx of the modules goes to Tx of the serial adapter.  Data sent from one side (Tx) is received on the other (Rx)

To enable UART firmware upload mode, Pin *7* (GPIO0) must be grounded by connecting to pin *14*.  This must be done **before** powering the module.  Once powered up in upload mode, you should be able to flash the 1mb Tasmota image.  After the flashing has been completed, Pin 7 should no longer be grounded.  power up again, to continue the [initial configuration](https://tasmota.github.io/docs/Getting-Started/#upgrade-using-webui)

## Resealing

To recreate the "plastic weld" that was broken to open the device, reassemble the case and backing then use a variable temperature hot air gun set (like those used for SMD soldering) to around 200°-300° C to slowly melt the plastic around the edge where the seam was broken.  Use a standard size flathead screwdriver to press the soft hot plastic together.  It will not look as good as it did new but it is on the side that is normally against a wall outlet or power strip.

## Configuration

Once *Tasmota*'s WebUI configuration interface is loaded in the browser, you can change many settings using the menu options. Console window is where you can change almost all configuration parameters.

Head straight to the *Configure Module* menu, selected *'Generic'* for *'Module type'*. Here are the settings that I selected on that screen:

![tasmota-generic-configuration](_media/Monoprice-417301-config.jpg)"Tasmota Generic configuration")

