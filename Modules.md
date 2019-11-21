?> **Module** is a firmware supported device which has specific code to enable its features.

**Configure Module** page in the webUI is used to configure your device as one of the modules **_and_** to [configure additional components](Components) connected to one of the free GPIO pins of the device.

> [!WARNING]
>New Modules are added to Tasmota only if a device requires additional code for new functions. Use [Templates](Templates) first to configure your device if it's not in the module list.

> [!TIP]
> Use Generic module `Module 18` to have almost all GPIO pins available.

Each module is assigned a number which is used in [Template configuration](Templates#BASE) or when using [`Module`](Commands#module) command.

| #| Name| Module specifics
| ---: | :-------- | :---
| 0 | Template | Module for currently active template. Named after the template NAME field.<br>*If a template is not active it will display `Generic (0)`.<br>**Do not use it until you configure a template**, use `Generic (18)` instead*|
<a id="SonoffBasic">	</a>	1	|	Sonoff Basic	|	
<a id="SonoffRF">	</a>	2	|	Sonoff RF	|	
<a id="SonoffSV">	</a>	3	|	Sonoff SV	|	
<a id="SonoffTh">	</a>	4	|	Sonoff TH	|	
<a id="SonoffDual">	</a>	5	|	Sonoff Dual	|	Process relay and button via hardware serial interface using GPIO01 and GPIO03. Change the baud rate to 19200 bps. Process buttons as single press only
<a id="SonoffPow">	</a>	6	|	Sonoff POW	|	
<a id="Sonoff4Ch">	</a>	7	|	Sonoff 4Ch	|	
<a id="SonoffS2X">	</a>	8	|	Sonoff S2X	|	
<a id="Slampher">	</a>	9	|	Slampher	|	
<a id="SonoffTouch">	</a>	10	|	Sonoff Touch	|	Invert `LedState 1` functionality
<a id="SonoffLED">	</a>	11	|	Sonoff LED	|	Set light type to 2 PWM channels disregarding SetOption15. Fix device specific LED instabilities by disabling GPIO04, GPIO5 and GPIO14
<a id="1Channel">	</a>	12	|	1 Channel	|	
<a id="4Channel">	</a>	13	|	4 Channel	|	[See Sonoff Dual](/devices/Sonoff-Dual)
<a id="MotorC/AC">	</a>	14	|	Motor C/AC	|	Force all relays ON at power up and disable command `PowerOnState`
<a id="ElectroDragon">	</a>	15	|	ElectroDragon	|	
<a id="EXSRelays">	</a>	16	|	EXS Relay(s)	|	Enable pulse latching using even/odd numbered relay pairs
<a id="WION">	</a>	17	|	WION	|	
<a id="Generic">	</a>	18	|	Generic	|	Show Wemos specific pin information in GUI
<a id="SonoffDev">	</a>	19	|	Sonoff Dev	|	
<a id="H801">	</a>	20	|	H801	|	Change hardware UART Tx from GPIO01 to GPIO02
<a id="SonoffSC">	</a>	21	|	Sonoff SC	|	Enable and process data via hardware serial interface using GPIO01 and GPIO03. Change the baud rate to 19200 bps
<a id="SonoffBN-SZ">	</a>	22	|	Sonoff BN-SZ	|	Set light type to 1 PWM channel disregarding `SetOption15`
<a id="Sonoff4ChPro">	</a>	23	|	Sonoff 4Ch Pro	|	Button handling disregarding `SetOption13` only allowing single press to enable RF learning while holding the button
<a id="HuafanSS">	</a>	24	|	Huafan SS	|	
<a id="SonoffBridge">	</a>	25	|	Sonoff Bridge	|	Enable and Process data via hardware serial interface using GPIO01 and GPIO03. Change the baud rate to 19200 bps. Process 16 buttons in web GUI. Enable EFM8BB1 firmware upload
<a id="SonoffB1">	</a>	26	|	Sonoff B1	|	Set light type to RGBWC using MY92x1
<a id="Ailight">	</a>	27	|	Ailight	|	Set light type to RGBW using MY92x1
<a id="SonoffT11Ch">	</a>	28	|	Sonoff T1 1Ch	|	[See Sonoff Touch](/devices/Sonoff-Touch)
<a id="SonoffT12Ch">	</a>	29	|	Sonoff T1 2Ch	|	[See Sonoff Touch](/devices/Sonoff-Touch)
<a id="SonoffT13Ch">	</a>	30	|	Sonoff T1 3Ch	|	[See Sonoff Touch](/devices/Sonoff-Touch)
<a id="SuplaEspablo">	</a>	31	|	Supla Espablo	|	
<a id="WittyCloud">	</a>	32	|	Witty Cloud	|	
<a id="YunshanRelay">	</a>	33	|	Yunshan Relay	|	
<a id="MagicHome">	</a>	34	|	MagicHome	|	
<a id="LuaniHVIO">	</a>	35	|	Luani HVIO	|	
<a id="KMC70011">	</a>	36	|	KMC 70011	|	
<a id="AriluxLC01">	</a>	37	|	Arilux LC01	|	
<a id="AriluxLC11">	</a>	38	|	Arilux LC11	|	
<a id="SonoffDualR2">	</a>	39	|	Sonoff Dual R2	|	Process buttons as single press only
<a id="AriluxLC06">	</a>	40	|	Arilux LC06	|	
<a id="SonoffS31">	</a>	41	|	Sonoff S31	|	Selects component types for the CSE7766 (serial connected energy monitoring chip) with Rx and Tx hardware serial (even parity) on GPIO01 and GPIO03 respectively. Sets serial interface to 4800 baud and disables serial logging
<a id="ZenggeWF017">	</a>	42	|	Zengge WF017	|	
<a id="SonoffPowR2">	</a>	43	|	Sonoff Pow R2	|	
<a id="SonoffIFan02">	</a>	44	|	Sonoff IFan02	|	Enable command [`FanSpeed`](Commands#fanspeed). Disable `Interlock` and `PulseTime`. Tune status information, MQTT data and GUI. Sync with microcontroller. Process Domoticz Fan state
<a id="BlitzwolfSHP">	</a>	45	|	Blitzwolf SHP	|	Module specific power monitoring calibration
<a id="Shelly1">	</a>	46	|	Shelly 1	|	
<a id="Shelly2">	</a>	47	|	Shelly 2	|	
<a id="XiaomiPhilips">	</a>	48	|	Xiaomi Philips	|	Process color temperature using PWM2 and intensity using PWM1
<a id="NeoCoolcam">	</a>	49	|	Neo Coolcam	|	
<a id="ESPSwitCh">	</a>	50	|	ESP SwitCh	|	
<a id="ObiSocket">	</a>	51	|	Obi Socket	|	
<a id="Teckin">	</a>	52	|	Teckin	|	
<a id="APLICWDP303075">	</a>	53	|	APLIC WDP303075	|	
<a id="TuyaMCU">	</a>	54	|	TuyaMCU	|	Enable and process data via software or hardware serial interface using component 107 and 108. Change the baud rate to 9600 bps. Process all buttons
<a id="GosundSP1v23">	</a>	55	|	Gosund SP1 v23	|	
<a id="ArmtronixDimmers">	</a>	56	|	Armtronix Dimmers	|	Enable and process data via software or hardware serial interface using component 148 and 149. Change baudrate to 115200 bps.
<a id="SK03OutdoorTuya">	</a>	57	|	SK03 Outdoor (Tuya)	|	
<a id="PS-16-DZ">	</a>	58	|	PS-16-DZ	|	Enable and process data via software or hardware serial interface using component 148 and 149. Change the baud rate to 19200 bps.
<a id="TeckinUS">	</a>	59	|	Teckin US	|	
<a id="ManzokuStripEU_4">	</a>	60	|	Manzoku Strip (EU 4)	|	
<a id="ObiSocket2">	</a>	61	|	Obi Socket 2	|	
<a id="YTFLRBridge">	</a>	62	|	YTF LR Bridge	|	Disable serial interface to stop loopback
<a id="DigooDG-SP202">	</a>	63	|	Digoo DG-SP202	|	
<a id="KA10">	</a>	64	|	KA10	|	
<a id="LumineaZX2820">	</a>	65	|	Luminea ZX2820	|	
<a id="MiDeskLamp">	</a>	66	|	Mi Desk Lamp	|	Process rotary and `Button1` data specific to this device
<a id="SP10">	</a>	67	|	SP10	|	
<a id="WAGACHCZ02MB">	</a>	68	|	WAGA CHCZ02MB	|	
<a id="SYF05">	</a>	69	|	SYF05	|	
<a id="SonoffL1">	</a>	70	|	Sonoff L1	|	
<a id="SonoffIFan03">	</a>	71	|	Sonoff iFan03	|	
<a id="EXSDimmer">	</a>	72	|	EX-Store Dimmer	|	

**Serial logging** is disabled by the Tasmota code for several modules and components (e.g., Sonoff POW, Sonoff S31, Sonoff Dual (v1), Tuya dimmers, PZEM components, etc.). Serial communication is used by these devices to transfer the data from the MCU chip to the ESP chip. Do not enable serial logging ([SerialLog 0](Commands#seriallog)) on these devices. It can cause the device software to crash.
