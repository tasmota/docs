!> **This feature is included only in tasmota-knx build.**     

To use in other builds you must [compile your own build](compile-your-build). Add the following to `user_config_override.h`:
```
#ifndef USE_KNX
#define USE_KNX         // Enable KNX IP Protocol Support (+9.4k code, +3k7 mem)
#endif
```
----
## What is KNX?

[<img src="https://www.knx.org/wGlobal/wGlobal/layout/images/knx-logo.png" />](https://www.knx.org/knx-en/for-professionals/index.php)

The [KNX IP Protocol](https://en.wikipedia.org/wiki/KNX_(standard)) is an _international open standard_ for smart homes and smart buildings automation. It is a decentralized system. Each device can talk directly to each other without the need of a central controller or server. Any panel or server is just for telesupervision and for sending requests. KNX IP Protocol uses a UDP multicast on _224.0.23.12 : 3671_, so there is no need for a KNX Router unless you want to communicate to KNX Devices that are not in the WIFI Network (Twisted Pair, RF, Powerline).

Each device has a physical address (like a fixed IP) as **1 . 1 . 0** and that address is used for configuration purposes.

Each device can be configured with group addresses as **2 / 2 / 1** and that address can be used for sending/receiving commands.
So, for example, if 2 devices that are configured with the **2 / 2 / 1** for turning on/off their outputs, and other device send _Turn ON_ command to **2 / 2 / 1**, both devices will turn on their outputs.

## Integration

Several home automation systems have KNX support. For example, [Home Assistant](https://github.com/home-assistant/home-assistant) has a [XKNX Python Library](https://github.com/XKNX/xknx) to connect to KNX devices using a KNX Router. If you don't have a **KNX Router**, you can use a **Software KNX Router** like [KNXd](https://github.com/knxd/knxd) on the same Raspberry Pi than Home Assistant. KNXd is used by Home Assistant for reading this UDP Multicast, although KNXd has other cool features that need extra hardware like connect to KNX devices by Twister Pair, Power Line or RF.

If using the Home Assistant distribution called **Hassio**, everything for KNX is already included by default.

If you use the ETS (KNX Configurator Software) you can add any TasmotaTasmota KNX as a dummy device.

If the Tasmotadevice is connecting to a Wifi Repeater you might experience some issues receiving KNX Telegrams. This also applies to mDNS and Emulation features.

Also, if using KNX IP Protocol, sleep needs to be 0 in order to avoid losing any telegram.

## Implemented Features 

The implemented features, up to now, in KNX for Tasmota are:

General:
* buttons (just push)
* relays (on/off/toggle)
* lights (led strips, etc. but just on/off)

Sensor lists that you can use in KNX is (only one sensor per type):
* Temperature
* Humidity
* Energy (v, i, power)

For using rules:
* send KNX command (on/off)
* receive KNX command (on/off)
* send values by KNX (any float type, temperature for example)
* receive a KNX read request

## Usage Examples ##

There are multiple possible configurations. Here are explained just a few as example. The options for selecting relays, buttons, sensors, etc. are only available if were configured on _Configure Module Menu_.

To configure KNX, enter on the Configuration Menu of Tasmota and select Configure KNX.

<img src="https://github.com/ascillato/Tasmota_KNX/raw/development/.github/Config_Menu.jpg" />
<img src="https://github.com/ascillato/Tasmota_KNX/raw/development/.github/KNX_menu.jpg" />

_Note on KNX communication enhancement option: As Wifi Multicast communication is not reliable in some wifi router due to IGMP problems or Snooping, an enhancement was implemented. This option increase the reliability by reducing the chances of losing telegrams, sending the same telegram 3 times. In practice it works really good and it is enough for normal home use. When this option is on, Tasmota will ignore toggle commands by KNX if those are sent more than 1 toggle per second. Just 1 toggle per second is working fine._


### 1) Setting Several Tasmota to be controlled as one by a Home Automation System: ###

We can set one of the group address to be the same in all the devices so as to turn them on or off at the same time.
In this case, so as to inform the status of all the relays to the Automation System, just one of the devices have to be configured as the responder. If you use the same Group Address for sending and receiving, you have to take into account not to make loops.

DEVICE 1

<img src="https://github.com/ascillato/Tasmota_KNX/raw/development/.github/1.jpg" />

DEVICE 2

<img src="https://github.com/ascillato/Tasmota_KNX/raw/development/.github/2.jpg" />

### 2) Setting 2 Tasmota to be linked as stair lights: ###

We can set one device to send the status of its output and another to read that and follow. And the second device can send the status of its button and the first device will toggle. With this configuration we can avoid to make a loop.

DEVICE 1

<img src="https://github.com/ascillato/Tasmota_KNX/raw/development/.github/3.jpg" />

DEVICE 2

<img src="https://github.com/ascillato/Tasmota_KNX/raw/development/.github/4.jpg" />

### 3) Setting a button as initiator of a scene:

Just setting one device to send the push of a button, and the rest just use that value to turn them on. In this case, there is no toggle. Every time the button is pushed, the turn on command is sent.

DEVICE 1

<img src="https://github.com/ascillato/Tasmota_KNX/raw/development/.github/5.jpg" />

DEVICE 2

<img src="https://github.com/ascillato/Tasmota_KNX/raw/development/.github/6.jpg" />

### 4) Setting a Temperature sensor:

We can configure to send the value of temperature or humidity every teleperiod. This teleperiod can be configured. See TasmotaTasmota [wiki](Commands). It is recommended also to set the reply temperature address.

<img src="https://github.com/ascillato/Tasmota_KNX/raw/development/.github/7.jpg" />

### 5) Using rules: ###

More functionality can be added to Tasmota using rules.

* In the KNX Menu, can be set a Group Address to send data or commands by rules, as **KNX TX1** to **KNX TX5**

In rules we can use the command ``KnxTx_Cmnd1 1`` to send an ON state command to the group address set in **KNX TX1** slot of the KNX menu.
Also, we can use the command ``KnxTx_Val1 15`` to send a 15 value to the group address set in **KNX TX1** slot of the KNX menu.

* In the KNX Menu can be set a Group Address to receive commands by rules as **KNX RX1** to **KNX RX5**

In rules we can use the events to catch the reception of COMMANDS from KNX to those RX Slots.

Example: ``rule on event#knxrx_cmnd1 do var1 %value% endon`` to store the command received in the variable VAR1

In rules we can use the events to catch the reception of VALUES from KNX to those RX Slots.

Example: ``rule on event#knxrx_val1 do var1 %value% endon`` to store the value received in the variable VAR1

Also, if a Read request is received from KNX Network, we can use that in a rule as for example: ``rule on event#knxrx_req1 do knxtx_val1 %var3% endon``

### 6) Rule to send KNX Telegram with BH1750 Sensor Data: ###

* If you want to send your sensor values by KNX **every teleperiod time** to the Group Address defined in KNX_TX1, you can use the following rule:

```
rule1 1
rule1 on tele-BH1750#Illuminance do knxtx_val1 %value% endon
```

* If you want to send your sensor values by KNX only **when it changes in a delta of 10 lx** to the Group Address defined in KNX_TX1, you can use the following rule:

```
rule1 1
rule1 on system#boot do backlog var1 0; var2 0 endon on BH1750#Illuminance>%var1% do backlog var1 %value%; knxtx_val1 %value%; var2 %value%; add1 5; sub2 5 endon on BH1750#Illuminance<%var2% do backlog var2 %value%; knxtx_val1 %value%; var1 %value%; add1 5; sub2 5 endon
```
