## Flush Wifi Moduls with latching Relays

### V3.1 Relay
![](https://user-images.githubusercontent.com/43306023/46289799-61193200-c58a-11e8-93a6-9f4d259c9c54.jpg)

***

### V5.0 Relay
![](https://user-images.githubusercontent.com/43306023/46250630-1c34b480-c43f-11e8-9af9-9718ee243fe1.PNG)
### V5.0 Relay (PCB Backside)
![](https://user-images.githubusercontent.com/43306023/46289287-e865a600-c588-11e8-94e2-52c46209b50b.jpg)

***

### Pinouts:
**V3.1**

GPIO00 Module Pin 8  
GPIO01 UART0_TXD Pin 2   
GPIO02 Module Pin 7   
GPIO03 UART0_RXD Pin 3  
GPIO04 Module Pin 10  
GPIO05 Module Pin 9  
GPIO12 Relay1 (High = off)  
GPIO13 Relay1 (High = on )

**V5.0**

GPIO00 Module Pin 4  
GPIO02 Module Pin 3  
GPIO04 Module Pin 2  
GPIO05 Module Pin 1  
GPIO12 Relay1 ( High = Off)  
GPIO13 Relay1 ( High = On)  
GPIO14 Relay2 ( High = Off)  
GPIO15 LED1  
GPIO16 Relay2 ( High = On)  

***

### Serial Connection  

![](https://user-images.githubusercontent.com/43306023/46314990-7ca52c80-c5cc-11e8-8e2c-6d355b71aebc.jpg)

The only way to flashing the moduls you must soldering 4 wires to the RX/TX/3V3/GND pins from the ESP. The PCB have no serial pinout connector. For connecting the ground (GND) on a V5.0 Modul you can use one of the 2 GND pinout connectors from the PCB. For flashing the moduls enable the flashmode of the ESP, connect PIN4 (GPIO00) to GND.  

***

**_!!! Don't flashing the modul when it connected to the main power. You brick the device and your computer or USB Port. Use only a 3.3V USB Adapter for flashing!!!_**

***

### Notes   

For use the V5.0 Modul with the "EXS Relay(s)" profile you must change the "Module parameters" (see picture below)

![](https://pi-gate.net/images/Blackline.png)  

Now you see in device setup

![](https://pi-gate.net/images/Blackline_Device_Setup.png)  

The output pins of the V5.0 are reversed on the PCB. You must use "out1" for Relay2 and "out2" for Relay1 !!! This is the only way for support both Moduls with Tasmota. (thanks for this Note to Theo Arends)



