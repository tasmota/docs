# Mirabella Genio Bulb
Mirabella have released a few smart bulbs.
Here is a bit of a guide on how to flash them with Tasmota.

There are two ways: Over the Air (OTA) or via Serial.
  
## Flashing Over the Air
Flashing over the air requires running a linux shell script called [tuya-convert](https://github.com/ct-Open-Source/tuya-convert) and hence requires a computer (I used a Raspberry PI 3) with a wifi adaptor that supports AP mode.  There are options if you run Windows to use either a virtual machine (it is reported that KALI Linux running on VMWare has worked) or potentially a live usb (I haven't tested it). 

Follow this [procedure](https://github.com/ct-Open-Source/tuya-convert#procedure). 

To get the bulb into config mode, have the bulb on for at least 10 seconds, then cycle it off and on 3 times via a physical light switch. The bulb should flash rapidly when its in config mode.

Tasmota v6.4.1 basic build is included as part of the tuya-convert script. It will open an WiFi access point named sonoff-XXX on the bulb once flashed correctly.

 
## Flashing via Serial
Flashing via Serial requires disassembling the bulb and soldiering wires to the board.

_Note: modifying these bulbs is dangerous if you do not understand what you are doing, please do so at your own risk!_

[Mirabella Bulbs](https://mirabellagenio.net.au/bulbs)
### Disassembling bulb

![B22](https://i.ibb.co/HT7mc8B/B22-0-SM.jpg)


The 2 main outer parts of the bulb are stuck together with high temp silicone or something similar.
Squeeze the outer of the bulb (the bit that looks like glass) as near to the join as possible, you can use a tool like a spudger or something if that helps to break the seal, being careful not to damage any internal parts or cut yourself!

Once the outer (fake glass) is removed you will see this:

![1](https://i.ibb.co/SwdZLZ9/b22-1-SM.jpg)

Carefully cut / scrape away as much of the sealent on the outer edge of the round circut board then using some needle nose pliers and your spudger pry the round board out.

![2](https://i.ibb.co/hmz7QGF/B22-2-SM.jpg)

If you are really good at soldering and have a fine tip on your iron you could possibly skip this step and jump straight to the next one.
#### B22
Stand the bulb up and de-solder the 2 pads, and straighten the wires to remove the board.

![3](https://i.ibb.co/56ys1r7/B22-3-SM.jpg)
#### E27
Using a sharp strong blade carefully pry out the small terminal on the end of the bulb then straighten the wire in side

![E27](https://i.ibb.co/N9WTW5n/E27-1-SM.jpg)

![E27](https://i.ibb.co/gWDVDPM/E27-2-SM.jpg)

This will allow you to pull the board out a little and get enough angle on it to make soldering easier.

You should now have these parts (E27 bulb will be still partly assembled):

#### B22

![4](https://i.ibb.co/rQZWVnB/B22-4-SM.jpg)

#### E27

![E27](https://i.ibb.co/Q9pqCsw/E27-3-SM.jpg)

(with wires added)

### Connect FTDI

Connect your FTDI up to these pins:

![5](https://i.ibb.co/7pFp70n/B22-5-SM.jpg)
 ![6](https://i.ibb.co/1LKbN2Q/TYWE3-L-Modul.jpg)

Flash with your preferred method [I use this one](https://www.youtube.com/watch?v=UDnNI5wkNNY)
(remember to connect GPIO0 to GND when plugging in your FTDI this will force the ESP into firmware write mode, you may need to try it a couple of times.

## Module Settings
Once flashed I use termite (or you could use any serial command tool) to send my settings:

_Note: Change these to match your environment_

`Backlog SSID1 YOUR_SSID_NAME; Password1 YOUR_WIFI_PASSWORD; MqttHost MQTT_INTERNAL_IP_ADDRESS; MqttUser MQTT_USER_NAME; MqttPassword MQTT_PASSWORD; module 38;topic bulb1; FriendlyName Bulb1` 

Or set manually from the web interface:

### Dimmable warm white or cool white bulbs
![Config](https://i.ibb.co/RD4xfMr/Bulb-Config.png)

### Tunable warm/cool white bulbs
I based these settings on the RGBW settings. I would have thought PWM1-3 were redundant, but have only had it work with all of these assigned as per below. The bulb is then tunable, with a brightness slider and a cool/warm slider.

* Module type => Generic
* D2 GPIO4  => PWM1 (37)
* D1 GPIO5  => PWM4 (40)
* D6 GPIO12 => PWM2￼ (38)
* D7 GPIO13 => PWM5 (41)
* D5 GPIO14 => PWM3￼ (39)

![config](https://user-images.githubusercontent.com/29367905/52713078-80b97000-2fea-11e9-941b-2970304f1edf.PNG)


### RGBW colour bulbs

* Module type = Generic
* D2 GPIO4 = PWM1 37 = Red
* D6 GPIO12 = PWM2 38 = Green
* D5 GPIO14 = PWM3 39 = Blue
* D1 GPIO5 = PWM4 = White

![Mirabella RGBW Bulb Tasmota Settings](https://i.ibb.co/BBM0Xyw/mirabella-genio-rgbw-tasmota-settings.png)



## Re-assembly

Re-assembly procedure is the reverse of the disassemble procedure!
