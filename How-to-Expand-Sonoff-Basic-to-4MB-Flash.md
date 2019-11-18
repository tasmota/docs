
Heya,

In this memo I'll describe how to expand the flash of a sonoff basic from 1MB to 4MB.
The advantage for this change is, to avoid to double flash with the minimal and then with the normal firmware and to use more features like Webserver and SSL encryption.

It was hard to find those information, I'll give credits to some users from the german [CreationX](http://forum.creationx.de/forum/index.php?thread/319-sonoff-flash-speicher-verg%C3%B6%C3%9Fern-auf-4mb/) Forum.


Because to unsolder the flash isn't that easy as just solder in pins, this is **only for advanced users**.

**Don't forget, it's at your own risk and the device could be damaged permanently.**




### The Hardware
- Soldering iron
- Tin
- Tweezers

### The Flash
The origin flash block is a XTX PN25F08B 1725XDG.
We exchange it with a WINBOND W25Q32FVSIG 1416.
You can find the WINBOND Flash on [eBay](https://www.ebay.de/itm/50PCS-W25Q32FVSIG-W25Q32FVSIG-SOP8-WINBOND-New/182328997807) ([another ebay](https://www.ebay.de/itm/172420981050)) or [AliExpress](https://de.aliexpress.com/item/Freies-Verschiffen-50-ST-CKE-W25Q32FVSSIG-W25Q32FVSIG-statt-W25Q32BVSSIG-IC-SPI-FLASH-32-MBIT-8-SOIC/32834924280.html)

![winbond1](http://forum.creationx.de/index.php?attachment/839-aufdruck-jpg/)

![winbond-different](http://forum.creationx.de/index.php?attachment/1075-unterschied-jpg/)


Those China flash memory ICs are cheap productions, means the chance to solder in a new defect not working flash block is high! Be ready to re-do the operation if the upload fails.

If you want to test the flash block, build yourself a test module, something like this for easy soldering in a flash and test it before soldering it in another sonoff basics board.
![flash test](http://forum.creationx.de/index.php?attachment/844-tester2-jpg/)
   
   

### The Operation
You will notice that the LED is in the way. Get a pen and mark on of its Pin with the board, so you can solder it in back later in the correct Position. Its a Red-Green LED, if you solder it in the wrong way, it will light up in red.

After the LED is out of the way, you give some tin on the pins from the flash block and connect all 4 pins in a row together with tin. This way it will be easier to desolder it, because you need to melt all pins at the same time.

Now get a thin object between the flash and the board, try to gently lift the flash up  and at the same time melt both rows of the flash pins tin rotatory. If you got enough space between the board and the flash change to the tweezers and finally take the flash block off.

Now refresh the contacts on the board for the new flash block with a lil bit of fresh tin.
Don't forget to give a lil bit tin to the new pins of the flash block, too!

Now put it on the contacts on the board and try to lock it with the tweezers.
Next take the solder iron and head just one pin and try to arrange the flashblock in the center now.
Finally, heat and solder the other pins to the board.

![enter image description here](http://forum.creationx.de/index.php?attachment/1077-4mb-auf-platine-jpg/)

You can also use a hot air rework station, this would be much safer, but also more expensive ([Amazon](https://www.amazon.de/italtronik-L%C3%B6tstation-Yihua-Hei%C3%9Fluft-Eingabestift/dp/B06VWMKDQQ)).
Be sure to protect the rest of the board if using the heat gun!
![enter image description here](http://forum.creationx.de/index.php?attachment/840-ausbau-jpg/)


Good job, you are done :)


### Flashing
The next step is to tell Atom (i did not do it with Arduino IDE, sry) to use the whole new 4MB Flash.
Note: You can only use 3MB, because 1MB is needed for SPIFFS.

To do this, you need to edit the platformio.ini file.
Search for your prefered language Block and copy the whole Block.
Rename it to e.g. Sonoff-DE-4M
Now change the following line

    build_flags = -Wl,-Tesp8266.flash.1m0.ld -DMY_LANGUAGE=de-DE

to

    build_flags = -Wl,-Tesp8266.flash.4m1m.ld -DMY_LANGUAGE=de-DE


Now scroll back to the top and enter a new default environment with the name of your newly created block

    env_default = sonoff-DE-4M

You are done with the preparations, connect the Sonoff with the 4MB Flash in flash mode (hold button while powering it up), click clean, click build, click upload.
![config1](http://forum.creationx.de/index.php?attachment/835-tesp8266-flash-1m0-ld-png/)![enter image description here](http://forum.creationx.de/index.php?attachment/836-tesp8266-flash-4m1m-ld-png/)



### Result
On the Information Page on the tasmota web interface you can now see the 4MB flash :)
![info1](http://forum.creationx.de/index.php?attachment/784-flashen-ohne-mini-png/)
![info](http://forum.creationx.de/index.php?attachment/850-screenshot-2018-02-05-00-56-37-714-org-mozilla-firefox-png/)




