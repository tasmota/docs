## Flash using CClib

To simplify this procedure, a ready to use [fork of the needed firmware files](https://github.com/s-hadinger/CCLib) is available.


### Flash CCLib on an ESP82xx Device
Flashing the CC2530 normally requires a [CC_DEBUGGER](https://www.aliexpress.com/item/32869263224.html). Using an ESP82xx device like a [Wemos D1 Mini](https://www.aliexpress.com/item/32681374223.html) is a lower cost alternative.  

If you are using a Wemos D1 Mini or NodeMCU, just plug the microUSB port. Vcc (3.3V), GND, Tx (GPIO1), and Rx (GPIO3) are connected via the microUSB port. Be sure that you are using a USB **_data_** cable.  

For ESP devices that do not have a microUSB connector, make the following connections:  

<BR>ESP<BR>Device|Serial<BR>Programming<BR>Adapter
:--:|:--:
Vcc|Vcc
GND|GND
GPIO0|GND
GPIO1|Rx
GPIO3|Tx

Follow the usual ESP82xx flashing process - you are just using [`CCLib_proxy.ino.bin`](https://github.com/s-hadinger/CCLib/blob/master/Bin/CCLib_proxy.ino.bin) instead of Tasmota.

Once the firmware upload completes, retain the serial interface connections (3.3V, GND, Tx, Rx). These will be used later for flashing the CC2530.


**C. Flash a DL-20 Zigbee module**
The DL-20 Zigbee module has a 5-pin 1.27mm pitch unpopulated header with 0.6mm througholes. For flashing any of the Zigbee modules, you need the following connections:  

ESP<BR>Pin|D1 Mini<BR>NodeMCU|CC2530<BR>Pin|[DL-20 J2<BR>Pin Location](https://user-images.githubusercontent.com/34340210/67676080-29301a00-f957-11e9-8799-c819241e0b4c.png "CC2530 DL-20 Pin-outs")
:--:|:--:|:--:|:--:
GPIO12|D6|CC_DD<BR>(A.K.A. P2_1 ('P21') or Debug Data)|5
GPIO4|D2|CC_DC<BR>(A.K.A. P2_2 ('P22') or Debug Clock)|4
Vcc|3.3v|Vcc|3
GPIO5|D1|CC_RST|2
GND|GND|GND|1

**DL-20 Flashing Jumpers**  
Insert alternating male Dupont jumpers; one jumper on one side, the next one on other side. This  allows the pins to provide the friction themselves to maintain contact and remain firmly in place. You only need DD, DC, and RST (a fourth jumper is shown which is used to keep the RST jumper in place). Vcc and GND are available on the main serial interface pins.  
<img src="https://user-images.githubusercontent.com/34340210/66960536-a47dfb80-f03a-11e9-9c24-9b3bc4676e49.jpg" width="360">  

**D. Upload the firmware to the CC2530**    
The CC2530 requires `Z-Stack_Home_1.2`, of type `Default` (not `Source Routing`). For convenience, ready to use [firmware files](https://github.com/s-hadinger/CCLib/tree/master/Bin) are provided. Select the right one for your hardware: `CC2530`, `CC2530 + CC2591` or `CC2530 + CC2592`.

_**These Python scripts require Python 2.7.**_  
1) Ensure that you have Python 2.7 installed

2) Install pyserial 3.0.1:

`pip install pyserial==3.0.1`

3) Check for connectivity before flashing:  

`python Python/cc_info.py -p <serial_port>`  

where \<serial_port> is the serial port for the ESP82xx device. e.g. `/dev/cu.usbserial-xxxx` or `COM7`

Example of result:
```
INFO: Found a CC2530 chip on /dev/cu.usbserial-xxxx

Chip information:
      Chip ID : 0xa524
   Flash size : 16 Kb
    Page size : 2 Kb
    SRAM size : 1 Kb
          USB : No

Device information:
 IEEE Address : 000000000000
           PC : 0000

Debug status:
 [ ] CHIP_ERASE_BUSY
 [ ] PCON_IDLE
 [X] CPU_HALTED
 [ ] PM_ACTIVE
 [ ] HALT_STATUS
 [X] DEBUG_LOCKED
 [X] OSCILLATOR_STABLE
 [ ] STACK_OVERFLOW

Debug config:
 [ ] SOFT_POWER_MODE
 [ ] TIMERS_OFF
 [ ] DMA_PAUSE
 [ ] TIMER_SUSPEND
```

If your CC2530 is DEBUG_LOCKED, then the flash size will be incorrectly _reported_ as 16kB. Dont worry flashing the Z-Stack firmware will work and reset the DEBUG_LOCKED bit. 

In some situation flashing fails with a error message `flash have not enough space`. If this happens do the following:   

```
python Python/cc_read_flash.py -p <serial_port> -o x.hex
python Python/cc_write_flash.py --erase -p <serial_port> -i x.hex
```
   Recheck for connectivity and the correct flash size by repeating step #3.


4) Flash the Z-Stack firmware using the following command:  

_Flashing the CC2530 **takes about 20 minutes**_  

```
python Python/cc_write_flash.py -e -p <serial_port> -i Bin/CC2530_DEFAULT_20190608_CC2530ZNP-Prod.hex
```  
   
```
INFO: Found a CC2530 chip on /dev/cu.usbserial-xxxx

Chip information:
 Chip ID : 0xa524
Flash size : 256 Kb
Page size : 2 Kb
SRAM size : 8 Kb
     USB : No
Sections in Bin/CC2530_DEFAULT_20190608_CC2530ZNP-Prod.hex:

Addr.    Size
-------- -------------
0x0000   8176 B 
0x1ff6   10 B 
0x3fff0   1 B 
0x2000   239616 B 

This is going to ERASE and REPROGRAM the chip. Are you sure? <y/N>:  y

Flashing:
- Chip erase...
- Flashing 4 memory blocks...
-> 0x0000 : 8176 bytes 
Progress 100%... OK
-> 0x1ff6 : 10 bytes 
Progress 100%... OK
-> 0x3fff0 : 1 bytes 
Progress 100%... OK
-> 0x2000 : 239616 bytes 
Progress 100%... OK

Completed
```

_If you don't see any on screen activity that flashing has begun (i.e., progress percentages increasing) within a couple minutes, then abort the command, cycle power on the ESP82xx, and start this step over._

Described in greater detail in [this blog post](https://www.zigbee2mqtt.io/information/alternative_flashing_methods.html).
