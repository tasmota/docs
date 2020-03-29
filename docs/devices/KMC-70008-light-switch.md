[Shopping](https://www.amazon.com/KMC-Wireless-Lighting-Compatible-Assistant/dp/B078HFR27T/ref=sr_1_3?ie=UTF8&qid=1540418560&sr=8-3&keywords=kmc+light+switch)

Depending on the version of the firmware shipped on the device, you may be able to flash it using the [Tuya-Convert OTA flashing tool](https://github.com/ct-Open-Source/tuya-convert/wiki/Compatible-devices). [This tutorial](https://youtu.be/O5GYh470m5k) shows how that tool works.

If the OTA flash method does not work, you will have to solder leads to flash the device. Except for GPIO0, the programming pins are not broken out on the PCB. The module has the usual ESP-12 pin layout, so carefully solder right to the chip's pins. The device button is connected to GPIO0. You do not need to solder onto GPIO0. Just hold the button down when booting the device to get it into flash mode.

![](https://user-images.githubusercontent.com/34340210/57195302-e8fb5c00-6f1e-11e9-96d6-9e872a48d263.jpg)
![](https://user-images.githubusercontent.com/34340210/57195305-eac51f80-6f1e-11e9-97ef-25629b14519e.jpg)
![](https://user-images.githubusercontent.com/34340210/57195306-ed277980-6f1e-11e9-95b0-0f1db04b6298.jpg)
![](https://user-images.githubusercontent.com/34340210/57195308-ef89d380-6f1e-11e9-9434-410e3df8533e.jpg)

Once you get the device flashed, set up the Wi-Fi configuration and connect to the device using a browser using its IP address. To keep the device from constantly rebooting, the first configuration step you should perform is to set the module type to Generic (18).

**Configuration:**
* Digiblur's Tasmota [forked firmware](https://www.youtube.com/redirect?redir_token=_fOGibOs_MdahUVBGBUJ4_0QFpd8MTU1NzE1MTczNUAxNTU3MDY1MzM1&event=video_description&v=O5GYh470m5k&q=https%3A%2F%2Fgithub.com%2Fdigiblur%2Ftasmota-Tasmota%2Fraw%2Fdevelopment%2Fgeneric%2Ftasmota-6.5.0-generic-wifiman-2.3.0.bin)
* Generic (18)
* GPIO0: Button1
* GPIO13: Led1i
* GPIO14: Relay1

When the blue LED on GPIO 13 is set to LED1i the white light shines when the relay is off and the blue light illuminates then the relay is on. 

Further configuration and setup may be required as the blue LED constantly flashes.