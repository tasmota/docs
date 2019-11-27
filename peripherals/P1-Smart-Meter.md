# Kaifa MA105C Energy Meter
In this example the Kaifa MA105C meter is used and might work with other meters as well.

## Schematics
<img src="https://github.com/arendst/arendst.github.io/blob/master/media/wemos/wemos_kaifa_energy_meter_scematic.png?raw=true" >

The transistor makes sure that the RxD signal is converted and inverted to 3.3v 

#### Tasmota Settings
In the _Configuration -> Configure Module_ page, select module `Generic (18)`

From the web console set the serial delimiter to 10 (newline). This makes Tasmota publish each line of the telegram separately to mqtt. 

`SerialDelimiter 10`

`SerialSend`

### Example output
Below an example of the telegram message published (per line) to mqtt. From here your HA system can process the data required for your needs.

```json
16:59:39 MQT: tele/wemos-9/RESULT = {"SerialReceived":"/KFM5KAIFA-METER"}
16:59:39 MQT: tele/wemos-9/RESULT = {"SerialReceived":""}
16:59:39 MQT: tele/wemos-9/RESULT = {"SerialReceived":"1-3:0.2.8(42)"}
16:59:39 MQT: tele/wemos-9/RESULT = {"SerialReceived":"0-0:1.0.0(190104170020W)"}
16:59:39 MQT: tele/wemos-9/RESULT = {"SerialReceived":"0-0:96.1.1(4530303235303030303639363432393136)"}
16:59:39 MQT: tele/wemos-9/RESULT = {"SerialReceived":"1-0:1.8.1(002342.060*kWh)"}
16:59:39 MQT: tele/wemos-9/RESULT = {"SerialReceived":"1-0:1.8.2(002566.728*kWh)"}
16:59:39 MQT: tele/wemos-9/RESULT = {"SerialReceived":"1-0:2.8.1(000000.000*kWh)"}
16:59:39 MQT: tele/wemos-9/RESULT = {"SerialReceived":"1-0:2.8.2(000000.000*kWh)"}
16:59:39 MQT: tele/wemos-9/RESULT = {"SerialReceived":"0-0:96.14.0(0002)"}
16:59:40 MQT: tele/wemos-9/RESULT = {"SerialReceived":"1-0:1.7.0(00.428*kW)"}
16:59:40 MQT: tele/wemos-9/RESULT = {"SerialReceived":"1-0:2.7.0(00.000*kW)"}
16:59:40 MQT: tele/wemos-9/RESULT = {"SerialReceived":"0-0:96.7.21(00000)"}
16:59:40 MQT: tele/wemos-9/RESULT = {"SerialReceived":"0-0:96.7.9(00000)"}
16:59:40 MQT: tele/wemos-9/RESULT = {"SerialReceived":"1-0:99.97.0(1)(0-0:96.7.19)(000101000001W)(2147483647*s)"}
16:59:40 MQT: tele/wemos-9/RESULT = {"SerialReceived":"1-0:32.32.0(00000)"}
16:59:40 MQT: tele/wemos-9/RESULT = {"SerialReceived":"1-0:32.36.0(00000)"}
16:59:40 MQT: tele/wemos-9/RESULT = {"SerialReceived":"0-0:96.13.1()"}
16:59:40 MQT: tele/wemos-9/RESULT = {"SerialReceived":"0-0:96.13.0()"}
16:59:40 MQT: tele/wemos-9/RESULT = {"SerialReceived":"1-0:31.7.0(002*A)"}
16:59:40 MQT: tele/wemos-9/RESULT = {"SerialReceived":"1-0:21.7.0(00.453*kW)"}
16:59:40 MQT: tele/wemos-9/RESULT = {"SerialReceived":"1-0:22.7.0(00.000*kW)"}
16:59:40 MQT: tele/wemos-9/RESULT = {"SerialReceived":"0-1:24.1.0(003)"}
16:59:40 MQT: tele/wemos-9/RESULT = {"SerialReceived":"0-1:96.1.0(4730303332353631323736373836373136)"}
16:59:40 MQT: tele/wemos-9/RESULT = {"SerialReceived":"0-1:24.2.1(190104160000W)(02949.209*m3)"}
16:59:40 MQT: tele/wemos-9/RESULT = {"SerialReceived":"!EE58"}
```

### Description of each line 
see also [DSMR 5.0 - P1 Companion Standard](https://www.netbeheernederland.nl/_upload/Files/Slimme_meter_15_a727fce1f1.pdf)

``` 
Header information - {"SerialReceived":"/KFM5KAIFA-METER"}
Empty line - {"SerialReceived":""}
Version information for P1 output - {"SerialReceived":"1-3:0.2.8(42)"}
Date-time stamp of the P1 message - {"SerialReceived":"0-0:1.0.0(181227093413W)"}
Equipment identifier - {"SerialReceived":"0-0:96.1.1(4530303235303030303639363432393136)"}
electricityUsedTariff1 >> Meter Reading electricity delivered to client (Tariff 1) in 0,001 kWh - {"SerialReceived":"1-0:1.8.1(002293.192*kWh)"}
electricityUsedTariff2 >> Meter Reading electricity delivered to client (Tariff 2) in 0,001 kWh - {"SerialReceived":"1-0:1.8.2(002523.640*kWh)"}
Meter Reading electricity delivered by client (Tariff 1) in 0,001 kWh - {"SerialReceived":"1-0:2.8.1(000000.000*kWh)"}
Meter Reading electricity delivered by client (Tariff 2) in 0,001 kWh - {"SerialReceived":"1-0:2.8.2(000000.000*kWh)"}
electricityActiveTariff >> Tariff indicator electricity. The tariff indicator can also be used to switch tariff dependent loads e.g boilers. This is the responsibility of the P1 user - {"SerialReceived":"0-0:96.14.0(0002)"}
Actual electricity power delivered (+P) in 1 Watt resolution - {"SerialReceived":"1-0:1.7.0(00.474*kW)"}
Actual electricity power received (-P) in 1 Watt resolution - {"SerialReceived":"1-0:2.7.0(00.000*kW)"}
Number of power failures in any phase - {"SerialReceived":"0-0:96.7.21(00000)"}
Number of long power failures in any phase - {"SerialReceived":"0-0:96.7.9(00000)"}
Power Failure Event Log (long power failures) - {"SerialReceived":"1-0:99.97.0(1)(0-0:96.7.19)(000101000001W)(2147483647*s)"}
Number of voltage sags in phase L1 - {"SerialReceived":"1-0:32.32.0(00000)"}
Number of voltage swells in phase L1 - {"SerialReceived":"1-0:32.36.0(00000)"}
Text message max 1024 characters. - {"SerialReceived":"0-0:96.13.1()"}
Text message max 1024 characters. - {"SerialReceived":"0-0:96.13.0()"}
Instantaneous current L1 in A resolution - {"SerialReceived":"1-0:31.7.0(002*A)"}
Instantaneous active power L1 (+P) in W resolution - {"SerialReceived":"1-0:21.7.0(00.474*kW)"}
Instantaneous active power L1 (-P) in W resolution - {"SerialReceived":"1-0:22.7.0(00.000*kW)"}
Device-Type - {"SerialReceived":"0-1:24.1.0(003)"}
Equipment identifier (Gas) - {"SerialReceived":"0-1:96.1.0(4730303332353631323736373836373136)"}
GasMeterReadingFiveMinutes >> Last 5-minute value (temperature converted), gas delivered to client in m3, including decimal values and capture time - {"SerialReceived":"0-1:24.2.1(181227090000W)(02910.491*m3)"}
{"SerialReceived":"!5E3E"}
```

Additional info
* [Kaifa Meters (Dutch)](https://www.liander.nl/sites/default/files/Meters-Handleidingen-elektriciteit-Kaifa-uitgebreid.pdf)
* [DSMR 5.0 - P1 Companion Standard](https://www.netbeheernederland.nl/_upload/Files/Slimme_meter_15_a727fce1f1.pdf)
