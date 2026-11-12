# minitiger Touch Light Switch

This is a cheap Sonoff T1 clone. Available with 1/2/3 channels.

The board has the ID **2PH89174A**

# Device
* ESP8285 micro
* Blue status LED (micro controlled)
* Separate touch IC controlled switch status indicators (blue and red)
* Aliexpress link: [Click](https://www.aliexpress.com/item/EU-UK-1-2-3-Gang-eWelink-Touch-Light-Smart-Switch-WiFi-Wall-Switch-With-Alexa/32916836771.html?spm=a2g0s.9042311.0.0.27424c4dtwJjoV)
* Aliexpress link for no neutral version (single live wire) version: [Click](https://www.aliexpress.com/item/32961290914.html)

# Images

Front and soldering: [Fullsize](https://ibb.co/fGxR0CJ)

![Front and soldering](https://i.ibb.co/fGxR0CJ/IMG-20190410-153939.jpg)

Front and identification number: [Fullsize](https://ibb.co/FsVTDz5)

![Front and identification number](https://i.ibb.co/FsVTDz5/IMG-20190410-173922.jpg)

Back and GND: [Fullsize](https://ibb.co/6wmcNyx)

![Back and GND](https://i.ibb.co/6wmcNyx/IMG-20190410-153953.jpg)

Soldering layout: [Fullsize](https://ibb.co/ZLt9WG1)

![Soldering layout](https://i.ibb.co/ZLt9WG1/IMG-20190410-173942.jpg)


# Flashing
This board can be flashed with vanilla sonoff-tasmota. I used esptool on linux to upload the firmware.

## Programming mode:

Short GPIO0 to GND, as with all boards.

If you have successfully put the micro into programming mode the LED does not light up!

# Config:
## Single Channel:
Works out of the box, configured as Sonoff Basic. The LED does not light up when the switch is turned off. Configure as Sonoff T1 to enable the LED.

## Dual Channel:
        {"NAME":"Wall Switch 2C","GPIO":[17,255,255,255,0,22,18,0,21,56,0,0,0],"FLAG":0,"BASE":28}

## Dual Channel - No Neutral (Single Live Wire):
        {"NAME":"Wall Switch 2C","GPIO":[53,52,255,17,18,0,0,0,0,21,22,0,0],"FLAG":0,"BASE":28}

## Triple Channel:
Since I don't own such a board, you are on your own...

Button 3 should be GPIO10 and Relay 3 should be GPIO4. Use at your own risk!
