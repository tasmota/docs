## Multi press functions
 
>If you [have changed](#Changing-default-button-functionality) [ButtonTopic](commands#buttontopic), [SetOption1](commands#setoption1), [SetOption11](commands#setoption11) or [SetOption13](commands#setoption13) some of the listed functionality will be changed or removed.

### 1 short press
Toggles the relay. This will blink the LED twice and send an MQTT status message like ```stat/tasmota/POWER1 ON```. If ```cmnd/tasmota/ButtonRetain on``` has been used the MQTT message will also contain the MQTT retain flag.

### 2 short presses
Toggles the second relay (if available on the device). This will blink the LED twice and send an MQTT status message like ```stat/tasmota/POWER2 on```.

> Since version 6.5.0.14. any device with more than one power output can be configured to act on a double press to switch the second relay (or for Blitzwolf SHP5 the USB power). To be sure not to activate accidental three button press it is wise to set `SetOption1 1`.

### 3 short presses
Start Wi-Fi smart config allowing for SSID and password configuration using an Android mobile phone with the [ESP8266 SmartConfig](https://play.google.com/store/apps/details?id=com.cmmakerclub.iot.esptouch) app. The LED will blink during the config period. A single button press during this period will abort and restart the device. **Only in tasmota-classic.bin**

### 4 short presses
Start Wi-Fi manager providing an Access Point with IP address 192.168.4.1 and a web server allowing the configuration of Wi-Fi. The LED will blink during the config period. A single button press during this period will abort and restart the device.

### 5 short presses
Start Wi-Fi Protected Setup (WPS) allowing for SSID and password configuration using the router's WPS button or web page. The LED will blink during the config period. A single button press during this period will abort and restart the device. **Only in tasmota-classic.bin**

### 6 short presses
Restarts the device.

### 7 short presses
Start OTA update of firmware using [OtaUrl](commands#otaurl). The green LED is lit during the update.

### **Long press**
There are two separate functions associated with a button long press based on how long it is held:
1. When held continuously for 40 seconds (Configurable with [SetOption32](commands#setoption32), value is 10x the configured hold time) Tasmota will reset to firmware defaults and restart.
2. If enabled, button pressed for 4 seconds (Configurable with [SetOption32](commands#setoption32)) creates a HOLD action. Check [table below](#changing-default-button-functionality) on how to enable this function.

  >:warning: When a button is configured with a [Switchmode](commands#switchmode) that keeps it as ON while depressed it activates the reset to firmware defaults function. Change the button to switch or change switchmode to avoid it.

## [ButtonTopic](Commands#ButtonTopic)

**`ButtonTopic 0`**

> Default option

By default a button controls the corresponding relay and doesn't send any MQTT messages itself.

No MQTT message will be published on account of the new button state. The message you see in console is the new state of the relay that is controlled and not the button state.

**`ButtonTopic 1`**

> Sets MQTT button topic to device %topic%

When changing the state of the button an MQTT message is sent to the device topic with the payload according to `SwitchMode` set.  

*Example: Device topic `sonoff`, `SwitchMode 3` yields the following message.*

```MQT: cmnd/tasmota/POWER = ON```

*Notice the ***`cmnd`*** instead of the `stat` at the beginning.*

This is the same as sending an MQTT commands to this device, the device relay will be set to the defined state.

**`ButtonTopic <value>`**

> Set button topic to a custom topic (32 characters max)

This will send an MQTT message to a custom defined topic similarly to option 1.

For example, we set the topic to `sonoff02` with `ButtonTopic sonoff02`. 

*Example: Device topic `sonoff`, `SwitchMode 1`, custom topic `sonoff02` yields the following message.*

```MQT: cmnd/sonoff02/POWER = TOGGLE```

If you have a device with the topic `sonoff02` this action will toggle its relay while not affecting anything on the `sonoff` device.

### In summary

`ButtonTopic 0` controls the relay directly.  
`ButtonTopic 1` sends an MQTT message to the device topic. This sets the state of the devices relay accordingly.  
`ButtonTopic <value>` sends an MQTT message command to the custom topic. This does not change the state of the devices relay.

## Changing default button functionality

If a [`ButtonTopic`](commands#buttontopic) (and if [`SetOption1 1`](commands#SetOption1)) or [`SwitchTopic 1`](commands#SwitchTopic) is defined (and [`SwitchMode`](commands#switchmode) is set to `5` or `6`) and a button is pressed longer than defined Key Hold Time ([`SetOption32`](commands#setoption32) default 4 seconds) an MQTT message like `cmnd/%topic%/POWER HOLD` will be sent. `HOLD` can be changed with [`StateText4`](commands#StateText4).

Command [`SetOption11`](commands#setoption11) allows for swapping the functionality of the push button.

These changes result in the following table [(larger image)](https://user-images.githubusercontent.com/5904370/53023433-89cc9600-345d-11e9-8de3-9c89fb7af2f1.png):

![Action matrix](https://user-images.githubusercontent.com/5904370/53023433-89cc9600-345d-11e9-8de3-9c89fb7af2f1.png)

#### Example

You can control a ceiling fan from a Sonoff Touch:<br>
If your standard topic of Sonoff Touch is `light` and the ceiling fan topic is `ceilingfan` issue these commands on the Sonoff Touch to activate the double press feature.
```
buttontopic ceilingfan
setoption11 1
```
All of the above is easier accomplished using [Rules](Rules)!

[Example using Rules](Rule-cookbook#using-an-external-button-with-single-press---double-press-and-hold)