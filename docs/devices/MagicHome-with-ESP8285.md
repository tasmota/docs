Yet another MagicHome RGB controller. I specifically had [this one](https://www.aliexpress.com/item/DC5-24V-Wireless-WIFI-LED-RGB-Controller-RGBW-Controller-IR-RF-Remote-Control-IOS-Android-for/32827253255.html).

Aside from it going 9-28V, there are no other external model numbers etc, however opening it up revealed a very different configuration inside, using an ESP8285 chip directly on the board.

<img width="50%" src="https://user-images.githubusercontent.com/816454/43894935-fd83a9d8-9c16-11e8-9a78-b7a058d972de.jpg" alt="opened with cover in view">

(Right click and view the original image to see the full size image for all images below)

## Identifying this board

Looking closely you can see it's an ESP8285, on the main board, it has the part number: `ZJ-WFMN-A V1.1`, `ZJ-WFMN-B V1.1`, `ZJ-WFMN-C V1.1`, or `ZJ-WFMN-D V1.0`

<img width="40%" src="https://user-images.githubusercontent.com/816454/43895058-6fcb4e10-9c17-11e8-8c9c-b99c57a39c55.jpg" alt="board top 1"> 
<img width="40%" src="https://user-images.githubusercontent.com/816454/43895059-6ffdd7b8-9c17-11e8-994e-aeb8f65f47ef.jpg" alt="board top 2">

## Arilux devices

The devices are similar to the Arilux devices. Here is an overview:

| Model | Color Support | Voltages (sometimes) | Remote | PCB part number  | Link                      |
|-------|---------------|----------------------|--------|------------------|---------------------------|
| LC01  | RGB           | 5-28V                | None   | ZJ-WFMN-A V1.1   | [Banggood][LC01-banggood] |
| LC02  | RGBW          | 9-12V (5-28V)        | None   | ZJ-WFMN-B V1.1   | [Banggood][LC02-banggood] |
| LC03  | RGB           | 5-28V                | IR     | ZJ-WFMN-A V1.1   | [Banggood][LC03-banggood] |
| LC04  | RGBW          | 9-12V (5-28V)        | IR     | ZJ-WFMN-A V1.1   | [Banggood][LC04-banggood] |
| LC08  | RGBWW/RGBWC   | 5-28V                | None   |                  | [Banggood][LC08-banggood] |
| LC09  | RGB           | 5-28V                | RF     |                  | [Banggood][LC09-banggood] |
| LC10  | RGBW          | 9-28V                | RF     |                  | [Banggood][LC10-banggood] |
| LC11  | RGBWW/RGBWC   | 9-28V                | RF     | ZJ-WFMN-D V1.0   | [Banggood][LC11-banggood] |

## Flashing

I found that on the back it has pads to solder to so you can flash it.

<img width="40%" src="https://user-images.githubusercontent.com/816454/43895057-6f80d178-9c17-11e8-8c6f-535d31ea0603.jpg" alt="board back">

The `IO0` port is `GPIO0` that needs to be pulled to ground when powered on for flashing (as per all ESP devices). I soldered cables to each of these. Note that some are very close to other pads, so be careful. If you want to avoid soldering, also pogo pins work well with the pads.

<img width="40%" src="https://user-images.githubusercontent.com/816454/43895056-6f41e094-9c17-11e8-95b7-cf565967c89e.jpg" alt="board back with cables">

## Template configuration 

**Arilux LC01 (ZJ-WFMN-A V1.1)**

Automatic configuration:

| Field | Value | Function |
|---|---|---|
|Module type|37 Arilux LC01|Module type|

Manual configuration:

| Field | Value | Function |
|---|---|---|
|Module type|18 Generic|Module type|
|GPIO5|37 PWM1|RED|
|GPIO12|38 PWM2|GREEN|
|GPIO13|39 PWM3|BLUE|


**Arilux LC02 (ZJ-WFMN-B V1.1)**

| Field | Value |
|---|---|
|Module type|18 Generic| 
|GPIO5|38 PWM2|
|GPIO12|39 PWM3|
|GPIO13|40 PWM4|
|GPIO14|37 PWM1|

**Arilux LC03 (ZJ-WFMN-A V1.1)**

| Field | Value | Function |
|---|---|---|
|Module type|18 Generic|Module type|
|GPIO4|51 IRRecv|IR Remote|
|GPIO5|37 PWM1|RED|
|GPIO12|38 PWM2|GREEN|
|GPIO13|39 PWM3|BLUE|

**Arilux LC04 (ZJ-WFMN-A V1.1)**

| Field | Value | Function |
|---|---|---|
|Module type|18 Generic|Module type|
|GPIO4|51 IRRecv|IR Remote (optional, view console for debugging!)|
|GPIO5|38 PWM2|BLUE|
|GPIO12|37 PWM1|RED|
|GPIO13|39 PWM3|GREEN|
|GPIO15|40 PWM4|WHITE|

**Arilux LC11 (ZJ-WFMN-D V1.0)**

| Field | Value | Function |
|---|---|---|
|Module type|18 Generic|Module type|
|GPIO4|147 ALux IrRcv||
|GPIO5|40 PWM4|COLD WHITE|
|GPIO12|38 PWM2|GREEN|
|GPIO13|39 PWM3|BLUE|
|GPIO14|37 PWM1|RED|
|GPIO15|41 PWM5|WARM WHITE|
|GPIO16|159 ALux IrSel||


With all that done, one of the critical things I needed to do so I could set the colors was to run the command to set `SetOption15 1`. 

After that it is possible to test the lights functionality, e.g. with the command `color #ff0000ff`.


### RF control

If you have an RF variant, you will want to configure the GPIOs like this:

```
  { "MagicHome RF",    // Magic Home RF (ESP8266) - (Arilux LC10)
     GPIO_USER,        // GPIO00 Optional Button
     GPIO_USER,        // GPIO01 Serial RXD and Optional sensor
     GPIO_LED1_INV,    // GPIO02 Blue onboard LED (optional)
     GPIO_USER,        // GPIO03 Serial TXD and Optional sensor0
     GPIO_ARIRFRCV,    // GPIO04 RF receiver input 
     GPIO_PWM2,        // GPIO05 RGB LED Green
     0, 0, 0, 0, 0, 0, // Flash connection
     GPIO_PWM3,        // GPIO12 RGB LED Blue
     GPIO_PWM4,        // GPIO13 RGBW LED White
     GPIO_PWM1,        // GPIO14 RGB LED Red
     GPIO_LED2_INV,    // GPIO15 RF receiver control
     0, 0
  },
```

or like this:

```
  { "MagicHome RF",    // Magic Home RF (ESP8285) - (IRrecv)
     GPIO_USER,        // GPIO00 Optional Button
     GPIO_USER,        // GPIO01 Serial RXD and Optional sensor
     GPIO_LED1_INV,    // GPIO02 Blue onboard LED (not soldered)
     GPIO_USER,        // GPIO03 Serial TXD and Optional sensor0
     GPIO_IRRECV,      // GPIO04 IR receiver input 
     GPIO_PWM1,        // GPIO05 RGB LED Green
     0, 0, 0, 0, 0, 0, // Flash connection
     GPIO_PWM2,        // GPIO12 RGB LED Blue
     GPIO_PWM3,        // GPIO13 RGBW LED White
     0, 0, 0
  },
```
After choosing the correct module type in your Tasmota configuration, press a key on the remote after boot for the device to learn your code.

### Full Set of rules for IR remote
Each rule can only be 511 characters long, some of the colors below use the built in predefined shortcut color numbers.
```
mosquitto_pub -t 'cmnd/RGBled/rule1' -m 'On IrReceived#Data=0x00FF906F Do Dimmer + EndOn On IrReceived#Data=0x00FF9867 Do Color2 1 EndOn On IrReceived#Data=0x00FFE817 Do HSBColor1 13 EndOn On IrReceived#Data=0x00FF02FD Do HSBColor1 23 EndOn On IrReceived#Data=0x00FF50AF Do HSBColor1 33 EndOn On IrReceived#Data=0x00FF38C7 Do HSBColor1 43 EndOn On IrReceived#Data=0x00FFB847 Do Dimmer - EndOn On IrReceived#Data=0x00FFD827 Do Color2 2 EndOn On IrReceived#Data=0x00FF48B7 Do HSBColor1 140 EndOn On IrReceived#Data=0x00FF32CD Do HSBColor1 160 EndOn'

mosquitto_pub -t 'cmnd/RGBled/rule2' -m 'Rule2 On IrReceived#Data=0x00FF7887 Do HSBColor1 180 EndOn On IrReceived#Data=0x00FF28D7 Do HSBColor1 200 EndOn On IrReceived#Data=0x00FFF807 Do Power 0 EndOn On IrReceived#Data=0x00FF8877 Do Color2 3 EndOn On IrReceived#Data=0x00FF6897 Do HSBColor1 260 EndOn On IrReceived#Data=0x00FF20DF Do HSBColor1 280 EndOn On IrReceived#Data=0x00FF708F Do HSBColor1 300 EndOn On IrReceived#Data=0x00FFF00F Do HSBColor1 320 EndOn'

mosquitto_pub -t 'cmnd/RGBled/rule3' -m 'Rule3 On IrReceived#Data=0x00FFB04F Do Power 1 EndOn On IrReceived#Data=0x00FFA857 Do Color2 12 EndOn On IrReceived#Data=0x00FFB24D Do Backlog Power 0; WakeupDuration 1; Dimmer 100; Wakeup EndOn On IrReceived#Data=0x00FF00FF Do Backlog Power 0; WakeupDuration 5; Wakeup EndOn On IrReceived#Data=0x00FF58A7 Do Backlog Scheme 2; Speed 1 EndOn On IrReceived#Data=0x00FF30CF Do Backlog Scheme 3; Speed 5 EndOn'
```
A Google Sheets Document to edit the desired actions and create the three needed rules is linked [here](https://docs.google.com/spreadsheets/d/1tUI5OMcQmaC1vnZVKgn82qKmZt0KDFFnHTbJAl-pY2A/edit?usp=sharing).

After setting the rules you need to activate them with the following:
```
mosquitto_pub -t 'cmnd/RGBled/rule1' -m 'ON'
mosquitto_pub -t 'cmnd/RGBled/rule2' -m 'ON'
mosquitto_pub -t 'cmnd/RGBled/rule3' -m 'ON'
```

The hex codes for the "Data" value come from the data tag when looking at the JSON sent via MQTT. You can also view this data on the Tasmota console screen. From here you can program it to do whatever you want using [Rules](Rules).

[LC01-banggood]: http://www.banggood.com/ARILUX-AL-LC01-Super-Mini-LED-WIFI-Smart-RGB-Controller-For-RGB-LED-Strip-Light-DC-9-12V-p-1058603.html?rmmds=search
[LC02-banggood]: http://www.banggood.com/ARILUX-AL-LC02-Super-Mini-LED-WIFI-APP-Controller-Dimmer-for-RGBW-LED-Strip-Light-DC-9-12V-p-1060222.html
[LC03-banggood]: http://www.banggood.com/ARILUX-AL-LC03-Super-Mini-LED-WIFI-APP-Controller-Remote-Control-For-RGB-LED-Strip-DC-9-12V-p-1060223.html
[LC04-banggood]: http://www.banggood.com/ARILUX-AL-LC04-Super-Mini-LED-WIFI-APP-Controller-Remote-Control-For-RGBW-LED-Strip-DC-9-12V-p-1060231.html
[LC08-banggood]: http://www.banggood.com/ARILUX-AL-LC08-Super-Mini-LED-WIFI-APP-Controller-Dimmer-for-RGBWW-LED-Strip-Light-DC-5-28V-p-1081241.html
[LC09-banggood]: http://www.banggood.com/ARILUX-AL-LC09-Super-Mini-LED-WIFI-APP-Controller-RF-Remote-Control-For-RGB-LED-Strip-DC9-28V-p-1081344.html
[LC10-banggood]: http://www.banggood.com/ARILUX-AL-LC10-Super-Mini-LED-WIFI-APP-Controller-RF-Remote-Control-For-RGBW-LED-Strip-DC9-28V-p-1085111.html
[LC11-banggood]: http://www.banggood.com/ARILUX-AL-LC11-Super-Mini-LED-WIFI-APP-Controller-RF-Remote-Control-For-RGBWW-LED-Strip-DC9-28V-p-1085112.html
