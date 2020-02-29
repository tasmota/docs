![BlitzWolf SHP7](https://github.com/arneman/docs/raw/master/_media/bw-shp7.jpg ":size=200")

## Serial Connection

Please see the [Hardware Preparation](installation/Hardware-Preparation) page for general instructions.

### Step 1
**Disconnect device from power source!**

### Step 2
Remove the two stickers on the front.

### Step 3
Undo 2 screws. **PH1** screwdriver required.

![Two PH1 screws](https://github.com/arneman/docs/raw/master/_media/bw-shp7-front.jpg ":size=200")

### Step 4
Remove back with screwdriver

![Remove back](https://github.com/arneman/docs/raw/master/_media/bw-shp7-back.jpg ":size=200")

### Step 4
Undo 2 screws at the back. **PH1** screwdriver required.

![Two PH1 screws](https://github.com/arneman/docs/raw/master/_media/bw-shp7-back-screws.jpg ":size=200")

### Step 5
Remove PCB from casing for easier soldering.

### Step 6
Solder cables to the ESP pins.

![Solder points 1](https://github.com/arneman/docs/blob/master/_media/bw-shp7-pins1.jpg ":size=400")

Because GND is hard to solder/access, I recommend to use the other side for GND:
![Solder points 2](https://github.com/arneman/docs/blob/master/_media/bw-shp7-pins2.jpg ":size=400")

Result:
![Soldered cables](https://github.com/arneman/docs/raw/master/_media/bw-shp7-soldered.jpg ":size=200")

### Step 7
Connect serial adapter and make a shortwire between Pin IO0 and GND during startup (for entering flashmode).

### Step 8
Flash Tasmota.

### Step 9
Setup Tasmota (wifi settings). 
 
Go to  _Configuration -> Configure Other_ and enter this template:
{"NAME":"SHP7 v2","GPIO":[18,158,56,131,134,132,0,0,17,57,21,0,22],"FLAG":0,"BASE":45} 
(I had to use v2 from https://templates.blakadder.com/blitzwolf_SHP7.html)

Done !
