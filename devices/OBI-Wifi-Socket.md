### Where to buy
As shown in the name the Wifi Socket is only available in the OBI Diy-Warehouse. It can also be bought in the [OBI online-store](https://www.obi.de/hausfunksteuerung/wifi-stecker-schuko/p/2291706) 

### Open the socket
Opening the socket is kind of difficult. If you have one of the [Tri-Wing screwdrivers](https://www.amazon.de/dp/B00154ZYV0/ref=asc_df_B00154ZYV057501798/?tag=googshopde-21&creative=22398&creativeASIN=B00154ZYV0&linkCode=df0&hvadid=214366492459&hvpos=1o1&hvnetw=g&hvrand=5060839556356521171&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9044260&hvtargid=pla-420556387190&th=1&psc=1)
it is much more easier. If you haven't got use a normal head screwdriver. Be careful not damaging your hand with it.
> Tipp: Afterwards use normal cross screws to close the casing.

### Connection
| ESP | Programmer |
|-----|------------|
| VCC | 3V3        |
| TX  | RX         |
| RX  | TX         |
| GND | GND        |

Connect GPIO0 to GND before connecting power to enable flash mode!

### Additional Information
A low pulse on GPIO12 switches the relay on, a low pulse on GPIO5 switches it off.  
I have solved the 'pulse issue' by setting GPIO12 to always 0 (as LED) and works fine.   
More Infos can be found here: [#1988](https://github.com/arendst/Tasmota/issues/1988).

### Initial Configuration
In the default configuration GPIO0 (which is also used to enable flash-mode) is setup as a Button.  
To enable AP-Mode and setup the correct GPIOs as described below,  
You can short GPIO0 to GND 4 times as if it was a button (see [[Button-usage]])  
Using this method allows you to flash a precompiled binary
   
### Device Images
![1](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota/obi-socket/1.jpg)  
![2](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota/obi-socket/2.jpg)  
![3](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota/obi-socket/3.jpg)  
![4](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota/obi-socket/4.jpg)  
![5](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota/obi-socket/5.jpg)     
(images from https://github.com/martin-ger/ESP8266-WiFi-Socket)  

### GPIO Config

**UPDATE: with Tasmota 6.3.0 you have fully monitoring support (Add support for OBI Power Socket (#1988, #3944))**

** Beginning 6.3.0, no need to choose type 18 anymore, use type 51 Obi Socket ***

![Obi Socket GPIO Config](https://user-images.githubusercontent.com/36734573/36541304-c1b5a57c-17dd-11e8-884b-dcf22e985e6b.png)