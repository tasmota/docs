Warning: Construction zone.

SP108e (1st gen)

Below is correct, but IO0 is directly connected to VCC, so we cannot bring ESP-12 into flash mode. Will check for some OTA mode that can be used.

With just two additional wires we can use Tasmota with the SP108E.

[**Analysis of the hardware**](SP108E-HardwareAnalysis.md)

The trick is to hold the STM32F0 controller in reset. Then we do not need to cut any traces on the PCB because all pins of the STM32F0 are inputs.

Another warning: I did not yet proof it actually works, this is work in progress.

- Wire 1 - NRST (pin 7) of STM32F0 to GND
- Wire 2 - IO4 of ESP-12 to R4


![pins svg](https://user-images.githubusercontent.com/19874899/46259105-0a9dec00-c4d5-11e8-9874-d0f72e7a6934.png)

SP108E (2nd gen)

With the new hardware version of the SP108E a new microcontroller (Geehy APM32F030C8T6) comes to control the WS2812 leds. It seems to be pin compatible at least for the part of its reset pin. As the data sheet reveals the NRST is also located to pin 7. The Espressif chip was replaced as well. It has a different pinout and cannot be flashed as the usual ESP12S or similar. See [**Analysis of the hardware**](SP108E-HardwareAnalysis.md) page for more details on it. The picture below shows the necessary hardware modifications to run tasmota for the 2nd gen.

- Wire 1 NRST (pin 7) of Geehy APM32 to GND
- Wire 2 IO4 of ESP8285 to R4 (DAT)

![pins 2nd gen](https://user-images.githubusercontent.com/6609851/105415886-a3724b80-5c39-11eb-87d2-49238c9ebe25.jpg)
