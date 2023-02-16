<a id="top">
# SolaX Power - Single phase string inverter X1
??? failure "This feature is not included in precompiled binaries"

	When [compiling your build](Compile-your-build) add the following to `user_config_override.h`:
	```arduino
	#ifndef USE_SOLAX_X1
	#define USE_SOLAX_X1
	#endif
	```

	There are additional `#define` compiler directive parameters which can be used, if they are necessary for your setup.  
	Set an other serial speed than the default value of 9600:
	```arduino
	#undef  SOLAXX1_SPEED
	#define SOLAXX1_SPEED  9600
	```
	If your inverter has two PV-inputs, you can activate the 2nd one:
	```arduino
	#ifndef SOLAXX1_PV2
	#define SOLAXX1_PV2
	#endif
	```
	By using the standard firmware variant with Solax-X1 on top, the resulting binary fits into a normal 1M chip.
	If you need more space, e.g for other modules, you can disable the [`ReadConfig`](#console-commands) command to save about 3k1 bytes of code.
	To do this, simply remove the compiler directive:
	```arduino
	#define SOLAXX1_READCONFIG
	```
	This module works as energy sensor. So be sure to define this, if not already done:
	```arduino
	#ifndef USE_ENERGY_SENSOR
	#define USE_ENERGY_SENSOR
	#endif
	```
	
## General

This module reads runtime values from a [Solax X1](https://www.solaxpower.com) device via RS485 Modbus interface and publishes them to MQTT.  
[![X1 Mini](_media/solax-x1/X1Mini_200.png)](_media/solax-x1/X1Mini.png) [![X1 Air](_media/solax-x1/X1Air_200.png)](_media/solax-x1/X1Air.png) [![X1 Smart](_media/solax-x1/X1Smart_200.png)](_media/solax-x1/X1Smart.png)  
The communication of this module is based on the description of the [communication protocol version 1.8](_media/solax-x1/SolaxPower_Single_Phase_External_Communication_Protocol_X1_V1.8.pdf).

## Wiring

To connect the inverter to the Tasmota-device, you have to use a breakout board to adapt the RS485 interface of the inverter to serial interface of the ESP.

### Breakout boards

There are many RS485-to-TTL modules, aka breakout boards, available. They may work or not. You should have attention on the operation voltage. The ESP-devices work with 3 volts.
Because of that be careful experimenting with 5 volts. In the best case nothing works. In the worst case it will destroy your ESP or breakout board.
Here are two examples of tested breakout boards. Recommended is a board with a SP3485 chip, because it is designed for operating at 3 volts.

#### SP3485

The SP3485 breakout board is specially made to work with only 3 volts. It has a separate RTS-pin and works with a voltage from 3 to 5 volts.  
[![SP3485_Breakout1](_media/solax-x1/SP3485_Breakout1_240.jpg)](_media/solax-x1/SP3485_Breakout1.jpg) [![SP3485_Breakout2](_media/solax-x1/SP3485_Breakout2_240.jpg)](_media/solax-x1/SP3485_Breakout1.jpg)
#### HW-0519
The HW-0519 breakout board does not need a separate RTS-pin, because it automatically switches between sending and receiving. The recommended voltage is 5 volts, but it should also work with 3 volts.  
[![HW-0519_Breakout](_media/solax-x1/HW-0519_Breakout_480.jpg)](_media/solax-x1/HW-0519_Breakout.jpg)
### ESP ⬌ breakout board
The RX-, TX- and RTS- (if needed) lines have to be connected to the ESP matching the [module configuration](#configuration).

| ESP  | SP3485 | HW-0519 |
|------|--------|---------|
| 3.3V | 3-5V   | VCC     |
| GND  | GND    | GND     |
| RX   | TX-O   | RXD     |
| TX   | RX-I   | TXD     |
| RTS  | RTS    | -       |

### Breakout board ⬌ inverter
The RS485 interface is a 2-wire-connection. The wires are called `A+` and `B-`. The big advantage of the interface is, beside of needing only two wires, that it can reach a length up to 1200 meters.
The inverter has a RJ45-jack, where the interface is accessible. Please consult the manual of your inverter where it is located.

!!! tip	"Tip: You can use an ethernet cable and cut off one connector. The RS485 interface uses the blue wire pair."

<img src="../_media/solax-x1/RJ45.png" align=right width=200>

| Breakout board | RJ45 inverter | Wire color (T568B) |
|----------------|---------------|--------------------|
| A (+)          | Pin 4         | blue               |
| B (-)          | Pin 5         | blue-white         |
| G / Ground     | Pin 7         | brown-white        |

!!! info
	In many cases two wires are enough to keep it working without errors.
	When your environment has electrical interferences or your cable is quiet long, you should use a third wire to establish a common signal reference.
	This wire has to be connected to the `Ground` pins.

## Configuration
You have to configure the module or the template. Select `SolaxX1 Tx` and `SolaxX1 Rx` for the RS485 communication. If you have a breakout board which needs the RTS line, you must also select `SolaxX1 RTS`.  
![x1-config](_media/solax-x1/x1-config-mark_260.png)

## Operation
### Result
When every thing works you will see the current data on the main page. They are also provided via MQTT.  
![x1-example](_media/solax-x1/x1-example_300.png)

!!! tip "Tips"
	- To send a MQTT telemetry message immediately on every change of power, you can set a [`PowerDelta`](Commands#powerdelta) value.  
	E.g. `PowerDelta 101` for every change of at least 1 W.
	- Set [`SetOption72`](Commands#setoption72) to `1` for displaying the value of total energy reported from the inverter.

### Console commands
There are two special console commands for the X1 converter:  
`EnergyConfig ReadIDinfo` reads and displays ID-data from the inverter  
`EnergyConfig ReadConfig` reads and displays the configuration from the inverter  

### Inverter status
The inverter status field represents the value reported by the inverter, when the inverter is sending data.
In the case when no data is received, it will be display `off`. As the converter is only working, when _the sun is shining_, you will see `off` normally at night or too low light.  

!!! tip
	When the inverter is working and `off` is displayed, so you have to check your hard- and software setup.
