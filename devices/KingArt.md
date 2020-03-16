# KingArt-N1 - Touch Light Light Switch

This is a relatively cheap Premium glass fronted touch panel, looks clean and minimal when installed too.  
 
Table Of Contents:
* [Device Features](#Device-Features)
* * [Breakdown](#Breakdown)
* * [Capacitive Touch IC](#Capacitive-Touch-IC)
* [Re-Programming](#Re-Programming)
* * [Tools](#Tools)
* * [Setup](#Setup)
* * [Programming Mode](#Programming-Mode)
* [Reference](#Reference)

***

# Device Features
* ESP8285 micro
* Blue status LED (micro controlled)
* Separate touch IC controlled switch status indicators (blue and red)
* Confirmed 10A/250VAC mains relay

![front](http://www.logicmetaworks.com/robin/GIT/sonoff-tasmota/images/img-module.jpeg)
-- Image: The 1 Gang Touch Panel, featuring the glass front (protective plastic film still on)

### Breakdown
Whats in the package...  This looks like a reasonably simple setup.  

Removing the front glass panel you have access to the main control PCB.  This holds the ESP8285 micro-controller and accompanying guff.  I've worked through mapping most of the pins of interest - notes are in the images below.

The control board runs off a 5V fed from the Power-Relay board at the read of the unit - a 3v3 reg is the control board for all the logic.
The back of the control board has the touch controller and the 8way header to the Power-Relay board.  
There are only touch pads on the back of the control board as a means to interface with the microcontroller. **There is no SonOff type programming header arrangement.**, see [Re-Programming](#Re-Programming).

* Control and Interface PCB
![front](http://www.logicmetaworks.com/robin/GIT/sonoff-tasmota/images/img-module-front1.jpeg)
![rear](http://www.logicmetaworks.com/robin/GIT/sonoff-tasmota/images/img-module-rear1.jpeg)
_Sorry for the horrible pics.. will replace_

* Some Application-Interesting Pin Allocations
![Some Pin Allocation](http://www.logicmetaworks.com/robin/GIT/sonoff-tasmota/images/img-pinalloc.jpeg)

*Trace for the King Art Switch  with 2 (Touch-)Button is confirmed  - works well with this Parameters

The Power-Relay board is reasonably simple as well.  
This board, being a 1-gang switch, only has a single relay - but the PCB is set out for 3 (again, see images for trace and pin notes ).

* Power-Relay PCB
![base front](http://www.logicmetaworks.com/robin/GIT/sonoff-tasmota/images/img-powerRelay-front.jpeg)
![base rear](http://www.logicmetaworks.com/robin/GIT/sonoff-tasmota/images/img-powerRelay-rear.jpeg)


### Capacitive Touch IC
This board uses a dedicated capacitive touch control IC.

Something interesting, that this IC manages touch switching as well a red and blue touch status LEDs for each of the touch pads that it services as the buttons.
The IC illuminates a diffuser block over a 'button', indicating:
* Blue : when Idle - button state is 'OFF'
* Red+Blue  : when Active - button state is 'ON'

The TW8001 is also linked to a red error indicator led on the front of the Control Board - it is co-located above the EPS8285 microcontroller's Blue status indicator. 

This appears to be used by the Touch IC to indicate its own state information
* eg, if the touch is held for +30s the touch shows an error state (red LED) and resets - useful if you replace the front panel and it needs to recalibrate.

With regard to interfacing with the microcontroller, this device seems function with GPIO-friendly pin state for the capacitive button state reporting.

![front](http://www.logicmetaworks.com/robin/GIT/sonoff-tasmota/images/img-IC-TW8001-notes1.png)

Here is the only information I have been able to find on this device at the time of this investigation : 
[TechWave - TW8001](https://translate.googleusercontent.com/translate_c?depth=1&hl=en&prev=search&rurl=translate.google.com&sl=zh-CN&sp=nmt4&u=http://www.techwaveltd.com.cn/content/%3F43.html&xid=17259,15700021,15700124,15700186,15700190,15700201,15700237,15700240,15700248&usg=ALkJrhjd4Qk_rQGiJLNJdAEqSnQL1YG0mA).
 
It does have much (or: any) in way of public datasheets.
If anyone finds a datasheet please link it here!

***

# Re-Programming

## Tools
You shall need something in way of the following: (or whatever works for you, this is just my setup)
* A USB-TTL adapter (TTL, 3V3.. something also with a 3V3 source)  
![base rear](http://www.logicmetaworks.com/robin/GIT/sonoff-tasmota/images/img-usbttl.jpeg)
* Some leads
* A soldering iron (solder, bits.. etc) - I'm going to assume you know how/what to do with this.

## Setup
(This is my setup)
USB-TTL  |  Lead   |  Board
  3V3        Red       3v3
  TXD        White     RX
  RXD        Grey      TX
  GND        Black     GND

NNB : **DO NOT USE or CONNECT THE 5V**  ever..

![base rear](http://www.logicmetaworks.com/robin/GIT/sonoff-tasmota/images/img-programming.jpeg)


### Programming Mode
Before you can program the board you **have to** start the ESP8285 micro in Programming Mode.
This is important.

Remember we soldered the blue lead to the board at (SW) - you will use this to force the micro to the required mode on startup.  (you can only do this on startup)

Entering Programming Mode:
* Remove power from the board
* Short the blue lead (SW) to ground (use a ground pad on the board or on your programmer)
  ![base rear](http://www.logicmetaworks.com/robin/GIT/sonoff-tasmota/images/img-programming-gnd.jpg)
* NOW: Apply power.  You can remove the short to ground after a second or two.

#### So, Are we in Programming Mode? ...

* **Test Failed** - try again
If the board has its factory firmware installed still it usually flashes the status LED on startup.. (ie: not in programming mode)

* **Test Success**
If you have successfully put the micro into programming mode the ONLY the _blue status illumination of the touch pad_ will be ON.  
-> Now you can access and upload to the device using your preferred tool (Atom IDE, ESPtool, Arduino.. etc)

Remember that the flashing mode MUST BE _**DOUT**_ as it is for ALL devices on which Tasmota is flashed!

# Reference
https://github.com/EphemeralPersistence/Sonoff-Tasmota/wiki
