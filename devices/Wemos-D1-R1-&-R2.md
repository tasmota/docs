## Wemos D1 Release 1 (R1) and Release 2 (R2)

Here you can find information for the big brother of the Wemos D1 mini which can be found [here](devices/Wemos-D1-Mini).

### R1 vs. R2 - The Difference
- When you take a look at the figure 1 you will see it with one blink of the eye thet the old Wemos
is different against the new verion R2. The old version has an ESP8266 12B or 12E model. The new one
has a ESP8266 12F model on the pcb board. You see this in the defference of the Wifi antenna. [Here](https://en.wikipedia.org/wiki/ESP8266) is a Wiki link to the different ESP8266 modules. The next part 
for R2 are the 2x4 solder pins for the serial and I2C interface which is not on the old model R1. The 
techncal data/specifiactions are the same. SO as you see they look
like an Arduino UNO inculding the stacks to mount different shields. Later i will give more information 
over shields which i have tested and there are a lot of them. 

Figure 1: WeMos D1 R1 vs. WeMos D1 R2

![WeMos D1 R1 vs. WeMos D1 R2](https://github.com/mike2nl/sensors/blob/master/images/1%20vs%202%20500x200.jpg?raw=true)

### Settings in Arduino IDE (v1.8.7):
- Both releases

First we will check that the right json index file is chosen. For that open File -> Preferences.
Search for "Additional Boards Manager URLs:" (Figure 2). There you have an input filed. If that field is empty
add this to it via copy&paste: _http://arduino.esp8266.com/stable/package_esp8266com_index.json_.
Then close that window by hitting the _OK_ button. If you have more then one link in that input field
you have to use a comma after every link. So as done in Figure 2.

Figure 2: Additional Boards Manager URLs

![Additional Boards Manager URLs](https://github.com/mike2nl/sensors/blob/master/images/addtional%20urls.PNG?raw=true)

Second we will look at the Boards Manager of Arduino IDE. As you can see in Figure 3 that the following
things has to be installed. Possibile you have done this already together with the first installtion.
_Open Tools -> Board Selection -> Boards Manager_, then search for _esp8266 by ESP8266 Community_. 
If you have fund it you will the same as in Figure 3. On the right side of that text you have searched
for you can see the installed verion. Here in the sample it is 2.4.2. It is not installed you can make 
a choice under _Select Version_. If you start a new installation you can use the version 2.4.2. It works
very well with both releases of Wemos D1.

Figure 3: Boards Manager

![Boards Manager](https://github.com/mike2nl/sensors/blob/master/images/BoardsManager.png?raw=true)

- Settings to Flash a firmware on R1:

Open _Tools -> Board_ and select the _WeMos D1 R1_ board. For the settings of release R1 see Figure 4.
Don't forget to select the right COM port so far your USB/Serial adapter is connected. Otherwise you
can change this later after you have verified your code and you are ready to compile and flash. Then
you have to connect your adapter and after the typical PING under Windows you can set your COM port.

Figure 4: Arduino Settings Wemos D1 R1

![Arduino Settings Wemos D1 R1](https://github.com/mike2nl/sensors/blob/master/images/arduino%20settings%20Wemos%20D1%20R1.png?raw=true)

- Settings to Flash a firmware on R2:

Open _Tools -> Board_ and select the _LOLIN(WEMOS) D1 R2 & mini_ board. And for the settings of 
release R2 see Figure 5, please. Don't forget to set your COM port.

Figure 5: 

![Arduino Settings Wemos D1 R2](https://github.com/mike2nl/sensors/blob/master/images/arduino%20settings%20Wemos%20D1%20R2.png?raw=true)

As you can see the settings are the same only the name of the board is different. Internal there
some different settings but we dont need to know that. Arduino IDE does the work for you.

### Module Selection for Tasmota:
- ...

### Housing:
- ...

### Shields:
- ...



