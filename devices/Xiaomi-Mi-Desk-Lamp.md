***Supported in Development since 2019-01-15***

Mi Desk Lamp is a cold+warm white led lamp, which has a rotary knob that also acts as a push-button:
- pushing it turns the lamp on/off
- rotating it controls the brightness
- rotating it while pushed controls the color temperature

At the bottom of the lamp stand there is also a 'Reset' button, which can be pressed by a hairpin/toothpick/etc only.

[Manufacturer Link](https://www.mi.com/global/smartlamp/)

![Device image here](https://u01.appmifile.com/images/2018/03/07/7aa83e74-3fe4-4445-80cf-2bf2201bfffe.jpg)

## Configuration

Tasmota supports it directly as `Module "Mi Desk Lamp"`. This module is deactivated by default. You must add `#define ROTARY_V1` in your `user_config_override.h` and [compile](installation/Flashing#compiling-from-source) the firmware for this module to be available as a selection option.

To configure it as `Generic`, here is the GPIO assignment:
- GPIO02: Button (`GPIO_KEY1`)
- GPIO04: Cold White (`GPIO_PWM1`)
- GPIO05: Warm White (`GPIO_PWM2`)
- GPIO12: Rotary switch A pin (`GPIO_ROT_A`)
- GPIO13: Rotary switch B pin (`GPIO_ROT_B`)

NOTE: The operation of the rotary switch depends on the module type being `MI_DESK_LAMP`, so full functionality cannot be achieved with the `Generic` config.


# Flashing

This lamp is based on a YeeLight LXU 1.7 module, that contains:
- an ESP8266
- **2 MB** flash

## Disassembly

First of all, remove the knob by pushing some soft and flat tool underneath it and gently pry away from the stand.

Then remove the bottom of the stand, held by 3 screws underneath the rubber strips:
![Feel around the rubber strips for depressions, the screws are underneath](https://github.com/gsimon75/Tasmota_MiDeskLamp_Notes/raw/master/00_remove_bottom.jpg)

Underneath you find a small board for the power input and the reset button, and the controller board:
![White PCB, 3 wires from the power board, 3 wires to the LEDs, and a Yeelight module underneath it](https://github.com/gsimon75/Tasmota_MiDeskLamp_Notes/raw/master/01_controller_board_bottom.jpg)

The test points (8 vertical, 2 horizontal) are connected to the module pins 7..14 and 17..18 (see below).
As GPIO0 is not among them, they aren't enough for flashing, so the board must be removed anyway.

NOTE: You need to remove the knob before you can remove this controller board.

The controller board contains
- a 3.3V converter on the side of the white power wires
- two LED drivers on the side of the red/blue/black LED wires
- the rotary button
- the Yeelight module

![The controller board](https://github.com/gsimon75/Tasmota_MiDeskLamp_Notes/raw/master/02_controller_board_top.jpg)


## Pinout

![Pinout image](https://github.com/gsimon75/Tasmota_MiDeskLamp_Notes/raw/master/03_controller_board_pinout.jpg)

Left side:
- Pin 1: ADC (N.C.)
- Pin 2: GPIO15 (N.C.)
- Pin 3: GND
- Pin 4: GPIO0
- Pin 5: GND
- Pin 6: GND

Bottom:
- Pin 7: GND
- Pin 8: Vcc (3.3V)
- Pin 9: GPIO14 (Reset button)
- Pin 10: GPIO2 (Rotary button)
- Pin 11: GPIO13 (Rotary B)
- Pin 12: GPIO12 (Rotary A)
- Pin 13: GPIO4 (Cold white)
- Pin 14: GPIO5 (Warm white)

Right side:
- Pin 15: GND 
- Pin 16: GND
- Pin 17: RxD (N.C.)
- Pin 18: TxD (N.C.)
- Pin 19: GND (N.C.)
- Pin 20: GND (N.C.)

Three pins (ADC, GPIO0 and GPIO15) are not used by the lamp, they are available for hacking :).


## Procedure

For serial flashing we need 2 power wires (GND, Vcc), 2 serial wires (RxD, TxD) and the boot mode button (GPIO0):

![Wiring image](https://github.com/gsimon75/Tasmota_MiDeskLamp_Notes/raw/master/04_controller_board_wired.jpg)

As there is plenty of free space in the lamp stand, I left the wires long enough to reach some empty area and soldered solo pin head sockets on them. This way they will be available if/when I decide to add something on those 3 extra pins :).

The rest of the serial flashing process is [as usual](installation/Hardware-Preparation), but if you want to make a backup of the original firmware, keep in mind that the flash size is **2 MBs**.

If you are re-flashing the original firmware, the flash size must be explicitly set to '2MB-c1', **the auto-detected '2MB' doesn't work**, so: `esptool.py write_flash --flash_size 2MB-c1 0x00000 xiaomi_desk_lamp.orig.bin`


## Serial logging

A bonus feature for debugging/logging: The lamp has an external DC12V power supply, so there is no shock hazard. Nonetheless, accidental 12V can still cause damage to a 3.3V serial converter, so be cautious if you do serial logging on a live lamp.

The [original firmware](https://github.com/gsimon75/Tasmota_MiDeskLamp_Notes/raw/master/xiaomi_desk_lamp.orig.bin) sets the USART to the same 74880 baud as the ESP boot loader, and it dumps some details as well:
```
 ets Jan  8 2013,rst cause:1, boot mode:(3,7)

load 0x60000020, len 4, room 16 
phy ver: 1055_1, pp ver: 10.7

rf cal sector: 507
tcpip_task_hdl : 3fff2958, prio:10,stack:512
idle_task_hdl : 3fff29f8,prio:0, stack:384
tim_task_hdl : 3fff5188, prio:2,stack:512
pwm version:1.0.2
mcu version: 1.3.0_0055
prod: yeelink.light.lamp1
data  : 0x3ffe8000 ~ 0x3ffe91f4, len: 4596
rodata: 0x3ffe9310 ~ 0x3ffeaa7c, len: 5996
bss   : 0x3ffeaa80 ~ 0x3fff27d8, len: 32088
heap  : 0x3fff27d8 ~ 0x40000000, len: 55336
BUILD TIME: May 25 2018,07:01:12
ESP SDK VER: 1.5.0-dev(c6beda8)
did is 65282142
mac addr 7811dc06cfd9
reset reason: 0
current flash flag is 0, current user bin addr 0x101000
mode : softAP(7a:11:dc:06:cf:d9)
dhcp server start:(ip:192.168.4.1,mask:255.255.255.0,gw:192.168.4.1)
add if1
bcn 100
```

## Hacking

The lamp has 3 pins that aren't used in normal operation: ADC, GPIO0 and GPIO15.
GPIO15 is and must be pulled up for boot selection, so its usability is somewhat limited.

On the other hand, if you already soldered wires to VCC, GND and GPIO0 for serial
flashing, they are perfect for a DHT11 or DHT22 temperature+humidity sensor!

As the lamp has external power supply, and the LEDs are in the upper part of the lamp,
the temperature of the base is the same as of the ambient, and by its nature the lamp
is situated on your desk, so it's a perfect place for temp+humidity measurements.

If you want to place the sensor inside the lamp base, then you may need to remove some
material from one of the weight panels, and if you choose to place it on the outside
(e.g., near the base), then a convenient and relatively hidden path for the 3 wires is
above the power jack, just enlarge the hole by 2 mm-s with a file.
