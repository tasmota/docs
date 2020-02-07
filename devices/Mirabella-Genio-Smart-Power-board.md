#Mirabella Genio Smart Powerboard

![Front_Photo](https://i.ibb.co/R3NB0kg/front.png)

This is a 4-way powerboard with the addition of a 2 USB ports. The USB Ports are switched together

Opening up the device was easy, but requires the use of a Tri-Wing Screwdriver ( like a phillips, but with 3 slots)
![tri_wing_screw](https://i.ibb.co/mSzYdVM/triwing.png)

Pry off the Rubber feet to reveal the scews bneath

![Back_Cover](https://i.ibb.co/qrN0gmM/back-screwholes.png)

Unscrew the Control Board with the ESB Module attached. Make sure to note which scres have a fibre washer under them so as to ensure you dont short out anything when re-assembling.

![Internal](https://i.ibb.co/BzF2cxj/Open-screws-marked.png)

The ESP module is mounted on a pcb with all of the required pins exposed.

![ESP_Connections](https://i.ibb.co/hX7F6BG/Wifi-Module-bottom.png)

![ESP8266 PINOUT](https://i.ibb.co/YRQstXr/ESP-PIN-OUT.png)


I was able to flash by using Tuyaconvert and also by connecting GPIO0 to GND while connecting my Serial Adaptor and flashing as per any other ESP device.

![Soldered_Pins](https://i.ibb.co/L8zv649/soldered-wifi.png)



Pins as Follows :-

GPIO 4 - GPO1
GPIO 12 - GPO3
GPIO 15 - GPO2
GPIO 14 - GPO4
GPIO5 5 - USB

GPIO0 - LED1i

GPIO13 - Button 1

