Simple somewhat compact WiFi controllable EU plug socket. Sold in the Netherlands by Action.

## Product
![Box](https://www.action.com/globalassets/cmsarticleimages/79/98/2578685_8712879142782-111.png?preset=mediaSliderImageLarge)
![Plug](https://www.action.com/globalassets/cmsarticleimages/79/99/2578685_8712879142782-110_02.png?preset=mediaSliderImageLarge)

## Internals
Inside the device is a Tuya TYWE2S. This device can be flashed using a software OTA hack using [tuya-convert](https://github.com/ct-Open-Source/tuya-convert)

## Flashing

Simply connect the (clearly labeled) 3v3, GND, TX, RX pins of the TYWE2S to the appropriate pins on your serial adapter and connect IO0 to GND to enter flashing mode.

With the device connected and in flashing mode, create a backup of the factory firmware, erase the flash, and flash a tasmota firmware approximately as follows:

    esptool.py read_flash 0x000000 0x100000 image1M.bin
    esptool.py erase_flash
    esptool.py write_flash -fs 1MB -fm dout 0x0 tasmota-lite.bin`

## Configuration
⚠️ Warning! While the below configuration is correct and working, configuring a button on GPIO14 will make the device reset itself to the default Tasmota configuration after a number of seconds.

![Config](https://user-images.githubusercontent.com/6934851/64065636-298a8e00-cc10-11e9-9909-1077e665513d.png)
