So far I analyzed it is equipped with these chips:

* ESP-12F
* STM32F-030C8T (Cortex M0)
* Winbond 25Q32 (EEPROM)
* 74HC245
* XL1509 3.3E1 (Step down regulator)
* RX/TX of STM is connected to ESP.
* 74HC245 buffers the outputs

ESP is connected to the STM RX/TX pins. No other connections seen.
We can assume there is some firmware in the STM that does the low level connection to the LEDs.

Question is how does the ESP communicate with the STM and what exactly does the STM at all.
But we can mod the hardware so the ESP can talk to the LEDs.

I made some pictures with phone and microscope.

PCB

![sp108e-board](https://user-images.githubusercontent.com/19874899/46249775-120aba00-c42f-11e8-8d2e-4262cb47cb9f.jpg)

Open the housing, see the red marks for the holders)

![sp108e-openhousing](https://user-images.githubusercontent.com/19874899/46249835-0ff52b00-c430-11e8-923b-1fa1cac6d1e5.jpg)

RX/TX connection ESP to STM

![sp108e-rxtx-](https://user-images.githubusercontent.com/19874899/46250002-eee20980-c432-11e8-8ffe-45bd28b71893.png)

STM32F0

![sp108e-stm32](https://user-images.githubusercontent.com/19874899/46249854-5fd3f200-c430-11e8-8168-6ba2791b891b.png)

EEPROM

![sp108e-eeprom](https://user-images.githubusercontent.com/19874899/46249886-06b88e00-c431-11e8-8515-0e86427c0bf8.png)

Pins lead to the STM32F0 (Firmware flash? Debug?)

![st108e-stm-32-externalconnections](https://user-images.githubusercontent.com/19874899/46249852-5b0f3e00-c430-11e8-81dd-7378074edfba.png)

ESP-12 and its pins

![sp108e-esp-1](https://user-images.githubusercontent.com/19874899/46249871-c78a3d00-c430-11e8-9c12-9f29d7a511fb.png)

![sp108e-esp-2](https://user-images.githubusercontent.com/19874899/46249872-c9540080-c430-11e8-85ed-db5366b03e74.png)

Buffer chip 74HC245

![p108e-hc245](https://user-images.githubusercontent.com/19874899/46250003-fa353500-c432-11e8-9035-897927aff6f2.png)

Traces on bottom side from STM to HC245 (actually R3 and R4)

![sp108e-traces-to-hc245](https://user-images.githubusercontent.com/19874899/46249954-1edcdd00-c432-11e8-8ad9-bcf360485a50.png)

Known differences to the 2nd gen

The following picture shows the pcb of the 2nd generation of the SP108E. 

![hardware 2nd gen](https://user-images.githubusercontent.com/6609851/105417021-42e40e00-5c3b-11eb-937d-306eee90cdd4.jpg)

The ESP12F was replaced to a proprietary ESP8285 pcb. Fortunately the pinout is printed on the back of the pcb so we can use it to connect the cables for flashing. As the pcb were already soldered out for taking the following picture it was flashed in this unmounted state. It should work as well while the ESP is soldered. Pay attention to the information below. 

![esp8285 sp108e 2nd gen](https://user-images.githubusercontent.com/6609851/105417173-863e7c80-5c3b-11eb-8396-aecd6df6c5bc.jpg)

The STM32F0 was replaced through a Geehy APM32F030C8T6 ARM-Cortex M0 microcontroller. At least the reset pin is at the same place. So the hardware modification of the first gen can also be applied.

For the hardware mod to make it working without the STM32F0/Geehy, there are several ways:
### 1. Cut traces and add wires
We need to break one of the traces on the bottom of the PCB. Then connect GPIO4 of ESP-12 with R4.
Also RX/TX connection between STM32F0 and ESP-12 need to be broken up.

### 2. Hold STM32F0 in reset
This is the simpler method, no cuts on the PCB required, just two additional wires.
- NRST of STM32F0 to GND
- IO4 of ESP-12 to R4

See [**here**](SP108E-HardwareMod.md) for details.

### Flashing prohibited
Major problem right now is that IO0 is directly connected to VCC, so we cannot bring ESP-12 into flash mode.
Working on a solution.
