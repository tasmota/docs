It is possible to amend your existing Arduino [Uno](https://store.arduino.cc/usa/arduino-uno-rev3)/[Mini](https://store.arduino.cc/usa/arduino-mini-05)/[Nano](https://store.arduino.cc/usa/arduino-nano) project to interface with a Tasmota powered ESP8266/ESP8285 generic development boards such as the Wemos D1 or NodeMCU branded hardware boards.

The creation of a slave driver interface implemented since Tasmota 7.0.0.2 enables this possibility.

!> **This feature is not included in precompiled binaries.**     

To use it you must [compile your build](Compile-your-build). Add the following to `user_config_override.h`:
```
#ifndef USE_TASMOTA_SLAVE
#define USE_TASMOTA_SLAVE    // Enable the driver
#endif

#ifndef USE_TASMOTA_SLAVE_FLASH_SPEED
#define USE_TASMOTA_SLAVE_FLASH_SPEED 57600    // Configure the baud rate of the bootloader
#endif

#ifndef USE_TASMOTA_SLAVE_SERIAL_SPEED 57600  
#define USE_TASMOTA_SLAVE_SERIAL_SPEED 57600    // Configure the baud rate at which the slave microcontroller will be interfacing to Tasmota
#endif
```

Please note that the `USE_TASMOTA_SLAVE_FLASH_SPEED` will depend on the variant of Arduino Uno/Mini/Nano board you are using - The general observation is that the 3.3V devices usually run at 57600 whereas the 5V devices usually run on 115200 but this is provided for guidance only as it has been found that some boards will not necessarily adhere to this. The main driving factor behind the baud rate is the crystal oscillator on the board which is usually 8Mhz for 3.3V variants and 16Mhz for 5V variants - hence 57600 being 1/2 of 115200.

It should also be noted that this option is only really applicable if you're actually using an Arduino UNO/Mini/Nano as a slave device and you want to be able to update the firmware on the Arduino OTA via the Tasmota Web UI. 

If you are using another type of microcontroller, obviously the OTA update functionality will not work (for now, until support is added for other microcontrollers). But if you are able to program the device manually there is no reason why you cannot use any microcontroller or development board as a slave to your Tasmota powered ESP8266/8285 hardware.

Once you have compiled your own variant with the correct settings and flashed the self-compiled binary to your Tasmota device it is time to make the necessary configuration within Tasmota.

## Configuring Tasmota to use the TasmotaSlave functionality

The communication interface between Tasmota and your slave micro-controller will be over serial communication. To make this possible you will need to configure two of the GPIO pins to `Slave TX` and `Slave RX` respectively. In addition to this you also need to define the GPIO which will be used to pull the reset pin of your slave microcontroller down to GND or up to 3.3V, so either `Slave RST` for normal reset behaviour (active low) or `Slave RSTi` for inverted reset behaviour (active high)

![TasmotaSlave GPIO Configuration](https://user-images.githubusercontent.com/470015/68074208-2a22da80-fda1-11e9-8413-4c4f539da0b5.png)

As mentioned above it is possible to connect any microcontroller of your choice but for the purpose of this article, only the implementation of an Arduino Pro Mini (3.3V) will be covered.

## Getting things wired up

With Tasmota GPIO configuration provided above you may now proceed to make the necessary electrical connections between the ESP8266/ESP8285 and your slave device, for example:

| ESP8266  | Arduino Pro Mini (3.3V) |
|------------|-------------------------|
| VCC        | VCC                     |
| GND        | GND                     |
| D2 (GPIO4) | RX (0)                  |
| D1 (GPIO5) | TX (1)                  |
| D4 (GPIO2) | Reset (RST)             |

So to visualize the above:

![Arduino Pro Mini](https://user-images.githubusercontent.com/470015/68076796-fe641c80-fdc1-11e9-9b0a-20a634bb78bf.png)

**Please verify your specific board's pin naming as they are not always exactly the same depending on where they came from!**

## Compiling a test sketch for the slave

The TasmotaSlave driver requires your slave to operate within specific parameters allowed by the driver itself so head over to the [TasmotaSlave Library](https://github.com/andrethomas/TasmotaSlave) and install the library in your local Arduino development environment.

Once installed you should be able to access the examples from the menu system:

![Arduino Library Examples](https://user-images.githubusercontent.com/470015/68074566-1aa59080-fda5-11e9-86c1-15d6ae6f673e.png)

Make sure you have the correct board and speed selected:

![Arduino Board Configuration](https://user-images.githubusercontent.com/470015/68074633-d36bcf80-fda5-11e9-8023-633ccba3e017.png)

Now that everything is set, it's time to export the compiled binary by selecting it from the Arduino menu:

![Export compiled Binary](https://user-images.githubusercontent.com/470015/68074653-1a59c500-fda6-11e9-89c2-fbab9f0471ae.png)

Once completed head over to the known folder you chose in previous steps and locate the `.hex` file which should be in the same folder as where your sketch was originally saved to.

You will most likely see a file listing like this:

![Arduino Sketch Folder](https://user-images.githubusercontent.com/470015/68074676-686ec880-fda6-11e9-8923-a890881474dd.png)

You are interested in `Blink.ino.eightanaloginputs.hex` and can ignore the one which has `bootloader` as part of the file name since the Arduino Pro Mini already has the bootloader flashed. Take note of the location and name of this file as you will need it in the next step to upload the compiled file to your slave device.

## Uploading a new hex file to your slave device

If you are using an Arduino Pro Mini as is the case in this example you would have created a `.hex` file in the previous step. This file can be flashed directly to the Arduino Pro Mini via the Tasmota Web UI.

Navigate to the Firmware Upgrade page where you would normally upload a new binary file to upgrade Tasmota. The same method is used to upload a `HEX` file to the slave device. Tasmota will automatically decide where it will flash the upload based on whether you're uploading a `.bin` file or a `.hex` file.

![Firmware Upgrade Page](https://user-images.githubusercontent.com/470015/68074735-1c705380-fda7-11e9-96a3-45b91bbdb5b9.png)

Tasmota will prompt you for the firmware file you wish to upload - You need to navigate to the previously known location folder you chose in earlier steps and select the `.hex` file previously identified:

![File Selection](https://user-images.githubusercontent.com/470015/68074784-b932f100-fda7-11e9-8a10-1b7e67ad3153.png)

After selecting the hex file you may proceed to click the Start Upgrade button:

![Start Upgrade Button](https://user-images.githubusercontent.com/470015/68074796-0b741200-fda8-11e9-9bf1-4f50977c5fe7.png)

The `hex` file will upload to Tasmota and Tasmota will flash the new slave firmware onto the Arduino Pro Mini and present you with the following web page:

![Upgrade Success](https://user-images.githubusercontent.com/470015/68074819-80dfe280-fda8-11e9-9652-2587fd2d7e7b.png)

After the device completes a restart you should now have an Arduino Pro Mini running as a slave where the blink is controlled from Tasmota's internal one-second callback.
