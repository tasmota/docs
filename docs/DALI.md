??? note "This feature is included in tasmota32 binaries"     

    When [compiling your build](Compile-your-build) add the following to `user_config_override.h`:
    ```arduino
    #ifndef USE_DALI
    #define USE_DALI        // Add support for DALI gateway (+5k code)
    #endif
    ```

## What is DALI?

[Digital Addressable Lighting Interface](https://en.wikipedia.org/wiki/Digital_Addressable_Lighting_Interface) (DALI) is a trademark for network-based products that control lighting.

A DALI network consists of at least one application controller and bus power supply (which may be built into any of the products) as well as input devices (e.g. sensors and push-buttons), control gear (e.g., electrical ballasts, LED drivers and dimmers) with DALI interfaces.

Application controllers can control, configure or query each device by means of a bi-directional data exchange. Unlike DMX, multiple controllers can co-exist on the bus.

The DALI protocol permits addressing devices individually, in groups or via broadcast.

Scenes can be stored in the devices, for recall on an individual, group or broadcast basis. Groups and scenes are used to ensure simultaneous execution of level changes, since each packet requires about 25 ms - or 1.5 seconds if all 64 addresses were to change level.

## Implemented Features

Tasmota DALI gateway is an application controller. It defaults to supporting Device Type 6 (DT6) or Part207 single color LED lighting controller using standard Tasmota light controls. It also supports Device Type 8 (DT8) or Part209 RGBWAF color control using standard Tasmota light controls.

Connecting several Tasmota DALI gateways to the same bus is supported. It will synchronise the GUI if configured equally or allow control of different lights using standard Tasmota light controls.

## Hardware

The driver is supported on both ESP8266 and ESP32. A possible DALI interface could look like this as used on the DALI 2 Click. <img alt="Dali" src="../_media/dali_schematics.png"></img> On the left side is the connection, TB1, to the DALI bus which should provide a voltage between 16V to 22.5V DC. On the right side is the connection to an ESP device where wires are connected according to the table:

| DALI interface | ESP device |
|----------------|------------|
|            VCC | 3V3        |
|        DALI_TX | DALI TX_i  |
|        DALI_RX | DALI RX_i  |
|            GND | GND        |

### MikroE DALI Click

Initial implementation has been performed using [DALI Click](https://www.mikroe.com/dali-click) with GPIO settings `DALI TX` and `DALI RX` and a [Busch-Jaeger Rotary dimmer](https://www.busch-jaeger.de/en/online-catalogue/detail/2CKA006599A2986) acting as a DALI bus power supply.

### MikroE DALI 2 Click

A redesigned version called [DALI 2 Click](https://www.mikroe.com/dali-2-click) also works fine whith GPIO settings `DALI TX_i` and `DALI RX_i`.

### Waveshare Pico DALI2

This [DALI2 expansion Module](https://www.waveshare.com/pico-dali2.htm) for ESP32-Pico series boards works fine with a Waveshare [ESP32-S3-Pico](https://www.waveshare.com/ESP32-S3-Pico.htm) using GPIO14 as `DALI RX` and GPIO17 as `DALI TX_i`. 

The Waveshare [ESP32-C6-Pico](https://www.waveshare.com/ESP32-C6-Pico.htm) also works fine using GPIO5 as `DALI RX` and GPIO14 as `DALI TX_i`. 

!!! note "For best result you'll need to isolate GPIO4 (pin 4) from the Pico DALI2. The ESP32-C6-Pico GPIO4 is hardwired to it's USB Type-C interface input voltage using a resistor bridge and is supposed to be used as an ADC input to measure voltage. The Pico DALI2 uses the same pin for high voltage DALI receive input. It seems to interfere with the data on GPIO5 resulting in no DALI signal detection. An easy fix is to remove pin 4 from the ESP32-C6-Pico header."

### Shelly DALI Dimmer Gen3

<img alt="ShellyDali" src="../_media/dali_shelly.png" style="margin:10px;float:right;width:17em"> </img>
The ESP32-C3 based [Shelly DALI Dimmer Gen3](https://www.shelly.com/products/shelly-dali-dimmer-gen3) is supported using template 
```
{"NAME":"Shelly DALI Dimmer Gen3","GPIO":[34,4736,0,3840,11360,11392,128,129,0,1,576,0,0,0,0,0,0,0,0,1,1,1],"FLAG":0,"BASE":1}
```
and additional commands 
```
Backlog AdcGpio1 10000,10000,4000; ButtonTopic 0; SetOption1 1; SetOption11 0; SetOption32 20; DimmerStep 5; LedTable 0
```
The following rule
```
rule1 on button1#state=2 do dimmer + endon on button2#state=2 do dimmer - endon on button1#state=3 do power 2 endon on button2#state=3 do power 2 endon
```
allows dimmer control using two buttons.

Notice that the Shelly DALI dimmer uses inverted DALI GPIO's `DALI TX_i` and `DALI_RX_i` and provides a limited DALI bus power supply of 10mA, enough for 5 DALI control gear.

To add Shelly DALI Dimmer to a bus powered environment it's best to disable the internal Shelly power supply. In that case use template (changed GPIO3)
```
{"NAME":"Shelly DALI Dimmer Gen3 (No power)","GPIO":[34,4736,0,3872,11360,11392,128,129,0,1,576,0,0,0,0,0,0,0,0,1,1,1],"FLAG":0,"BASE":1}
``` 
In addition you can easily remove the Shelly power supply assembly from the main board.

## Commands

Command|Parameters
:---|:---
DaliSend<x\><a class="cmnd" id="dalisend"></a>|Low level DALI control.<br><br>`<byte1>,<byte2>` = Execute DALI code and do not expect a DALI backward frame.<br>`<0xA3>,<byte2>,<byte3>,<byte4>` = Set DALI parameter using DTR0 and do not expect a DALI backward frame.<br><br><x\> = optional, 6 for DT6 extended commands or 8 for DT8 extended commands.
DaliQuery<x\><a class="cmnd" id="daliquery"></a>|Low level DALI control with expected response.<br><br>`<byte1>,<byte2>` = Execute DALI code and report result (DALI backward frame).<br><br><x\> = optional, 6 for DT6 extended commands or 8 for DT8 extended commands.
DaliScan<a class="cmnd" id="daliscan"></a>|Sequential address assignment using commissioning protocol. This resets  parameters stored on the control gear.<br><br>`<option1>[,<option2>]` where option1 =<br>`1` = Reset and commission new device addresses.<br>`2` = Reset and commission additional device addresses.<br>and option2 defines the max number of devices allowed to add.
DaliGear<a class="cmnd" id="daligear"></a>|To reduce DaliGroup response time set the max commissionned control gear address.<br><br>Display current max address.<br>`1..64` = Set max address (default = `64`).
DaliGroup<x\><a class="cmnd" id="daligroup"></a>|Add or remove control gear to/from up to 16 groups.<br><br>Display current group contents.<br>`[+]<device>,<device>...` = Add devices to group.<br>`-<device>,<device>...` = Remove devices from group.<br><br><x\> = 1 to 16.
DaliBS<a class="cmnd" id="dalibs"></a>|Show or Hide broadcast slider from the GUI.<br><br>Display current state.<br>`0` - Hide broadcast slider.<br>`1` - Show broadcast slider (default).
DaliGroupSliders<a class="cmnd" id="daligroupsliders"></a>|Add or remove group sliders from the GUI.<br><br>Display current groupsliders amount.<br>`1..16` = Number of groupsliders to display (default 2).
DaliPower<x\><a class="cmnd" id="dalipower"></a>|Control power to broadcast or any control gear or group.<br><br>Display current power state.<br>`0` = Turn power off.<br>`1` = Restore power to last dimmer value.<br>`2` = Toggle power.<br>`3` to `254` = Set absolute brightness.<br><br><x\> = 0 for broadcast, 1 to 64 for individual gear or 101 to 116 for group.
DaliDimmer<x\><a class="cmnd" id="dalidimmer"></a>|Control dimmer to broadcast or any control gear or group.<br><br>Display current dimmer state.<br>`0` = Turn power off.<br>`1` to `100` = Percentage of brightness.<br><br><x\> = 0 for broadcast, 1 to 64 for individual gear or 101 to 116 for group.
DaliLight<a class="cmnd" id="dalilight"></a>|Switch between DALI or Tasmota Light control. The latter allows for the DALI lighting to be controlled as a local light by any Tasmota protocol like Matter, Alexa, Hue and KNX.<br><br>Display current state.<br>`0` = Disable Tasmota light control for DaliTarget device.<br>`1` = Enable Tasmota light control for DaliTarget device (default).
DaliTarget<a class="cmnd" id="dalitarget"></a>|Select DALI target to be used when DaliLight is enabled (Tasmota Light control).<br><br>Display current target.<br>`0` = Broadcast (default).<br>`1` to `64` = Individual gear.<br>`101` to `116` = group.
DaliChannels<a class="cmnd" id="dalichannels"></a>|Select number of color channels to be used when DaliLight is enabled (Tasmota Light control). Depending on the chosen number of channels the GUI will display sliders for Cold-Warm white (CCT), Hue, Saturation and Brightness.<br><br>Display current number of channels.<br>`1` = W - Single color like white with Brightness slider.<br>`2` = CW - Two colors like Cold and Warm white with CCT and Brightness sliders.<br>`3` = RGB - Three colors like Red, Green and Blue with Hue, Saturation and Brightness sliders.<br>`4` = RGBW - Four colors like Red, Green, Blue and White with Hue, Saturation and Brightness sliders.<br>`5` = RGBCW or RGBCCT - Five colors like Red, Green, Blue, Cold white and Warm white with Hue, Saturation and Brightness sliders.<br><br>When using 4 or 5 channels executing command `SetOption37 128` will add additional Brightness and CCT sliders.

## DALI ballasts

I've tested Tasmota DALI with several DALI-2 DT6 certified ballasts like inbuild ceiling LEDs and larger LED panels. It also works with DT8 color LED ballasts.

### MiBoxer DALI 5 in 1 LED controller (DT8)

This controller is not a certified DALI ballast but it will work with Tasmota DALI. Do not try to commission the DALI bus when it is connected as it will likely fail.

The controller is tested with an RGB led strip using it's default configuration and a user selected short address.  With a short address set to 11 and using the following commands once will enable Tasmota light control:
```
DaliTarget 12
DaliChannels 3
DaliLight 1
```

Using two or more devices in a group also works fine. Execute the following commands assuming the second controller has a short address of 12:
```
Daligroup1 12,13
DaliTarget 101
```
!!! note "The numbering for Tasmota short adresses is from 1 to 64 and group addresses from 101 to 116."