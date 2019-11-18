This Tuya Wi-Fi module ESP8266 based device has a really attractive form factor and functionality (in-wall, single gang, dual outlet, USB port, each individually controllable).

<img src="https://raw.githubusercontent.com/DavinKD/SmartThings/master/DeviceImages/ks-604s.jpg" width="250" align="right" />

This device **_can be most easily flashed using using [Tuya-Convert](https://github.com/ct-Open-Source/tuya-convert/wiki/Compatible-devices)_**. Others have reported that flashing this device by attaching leads to the serial interface requires disassembling and unsoldering the internal AC components to get access to the needed contacts, however an AliBaba device was successfully flashed by connecting to the four terminals at the bottom of the back circuit board (3v3, Tx, Rx, G) and connecting pin D3 in block J7 to ground while booting and during the flashing process.

## Shopping

* [Ali Express](https://www.aliexpress.com/item/Smart-WiFi-USB-Charger-Wall-Outlet-High-Speed-Voice-Control-Dual-Outlets-Individually-Surge-Protection-Remote/32976742669.html)
* [Amazon](https://www.amazon.com/dp/B07JZ124FK)
* [Alibaba](https://www.alibaba.com/product-detail/New-Design-2-way-Double-Power_60817067611.html?spm=a2700.7724857.normalList.54.4dfd645aBY3qAH) (10 minimum)

## Configuration

It appears that there are different versions of the KS-604S. The device that [@DavinKD](https://github.com/DavinKD) flashed (likely purchased from Amazon in early to mid March 2019) has a different GPIO configuration than devices purchased from Alibaba in late March.

Rear

<img src="https://user-images.githubusercontent.com/34340210/55679367-8ccdf980-58d8-11e9-8da7-b2fb6ae637cd.jpg" width="500" />

### Amazon Device

{"NAME":"KS-604S","GPIO":[255,255,56,255,255,17,255,255,22,21,255,255,18],"FLAG":1,"BASE":18}

| GPIO | Function | Configuration |
|:---|:---|:---|
|  2 | Device Status (Green) | LED1i (56)
|  5 | Top Button | Button1 (17)
| 12 | Bottom Receptacle | Relay2 (22)
| 13 | Top Receptacle | Relay1 (21)
| 16 | Bottom Button | Button2 (18)

The USB port on this variant is not switchable.

### Alibaba Device

{"NAME":"KS-604S","GPIO":[158,255,255,17,56,18,255,255,22,21,57,23,255],"FLAG":0,"BASE":18}

| GPIO | Function | Configuration |
|:---|:---|:---|
|  0 | Device Status (Green) | LEDLinki (158)
|  3 | Top Button | Button1 (17)
|  4 | Top LED (Orange) | LED1i (56)
|  5 | Bottom Button | Button2 (18)
| 12 | Bottom Receptacle | Relay2 (22)
| 13 | Top Receptacle | Relay1 (21)
| 14 | Bottom LED (Orange) | LED2i (57)
| 15 | USB Port | Relay3 (23)

This configuration requires the `LedLinki` [Component](Components) (introduced in 6.5.0.12) to associate the GPIO to the status LED indicator. In order for the LED power indicators to follow the state of each receptacle relay, [`LedState`](Commands#ledstate) must be set to show the power state on the LEDs. Select the desired power on state for the device's relays using [`PowerOnState`](Commands#poweronstate) and/or a `System#Boot` triggered rule. This device also requires [SetOption63](Commands#setoption63) (introduced in 6.5.0.9) in order to disable relay power feedback state scanning at restart.

The following Console statements define the necessary settings and rules as described above.
```
Backlog SerialLog 0; PowerOnState 0; SetOption63 1; LEDState 1
Rule1 ON System#Boot DO Power3 On ENDON    # Turn the USB port on
Rule1 1
```