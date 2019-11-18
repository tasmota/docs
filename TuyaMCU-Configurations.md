Before proceeding identify dpId's and their function.

## Dimmer	
We need to configure four functions of a dimmer:  	
1. Dimming dpId	
2. Dimming Range	
3. Power metering if supported.	
4. Dimming less than 10%	

### Dimming dpId	
The dimmer FunctionId is `21`. On a dimmer dpId generally is `2` or `3`. Try both.  	
1. Go to the Tasmota Console and type `TuyaMCU 21,2` and wait for it to reboot.	
2. Enter `Backlog Dimmer 10; Dimmer 100` in the Console. 	
   - If your bulb responds to `Dimmer` commands, you have successfully configured the dimmer FunctionId. Make note of it. 	
   - If not try id `3` and if even `3` doesn't work keep trying Ids from all unknown Ids from the log until one works.	

### Dimming Range	
Once you have figured out the dimming functionId, we need to find the maximum dimming range. Once the dimming Id is set, the logs will continue	
```	
TYA: Heartbeat	
TYA: RX Packet: "55aa03070005010100010011"	
TYA: RX Relay-1 --> MCU State: Off Current State:Off	
TYA: RX Packet: "55aa03070008020200040000000720"	
TYA: FnId=21 is set for dpId=2	
TYA: RX Dim State=7	
```	

Now using the hardware buttons increase the dimmer to its maximum and observe the log. The `Dim State=XXX` shows the current dimmer level reported by MCU. Once the dimmer is at max, note this number. Again using hardware buttons decrease dimmer to minimum and note the number for minimum.	
Now we need to tell Tasmota to use maximum and minimum values. This controlled by [DimmerRange](Commands#DimmerRange) command. We can set it using `DimmerRange <Min>,<Max>` where `<Min>` is the minimum dimmer state and `<Max>` maximum dimmer state reported in logs.	

Once set, try `dimmer 100` in the Console and check if the brightness of bulb is same is the same as when the maximum was set using hardware buttons.	

### Power metering	
<a id="power-metering"></a>	
Some Tuya MCU devices support Power measurement support over serial. For this its better to use a bulb with known wattage rating.  	

Observe the logs in the Console  	
```	
TYA: RX Packet: "55aa03070005010100010011"	
TYA: FnId=11 is set for dpId=1	
TYA: RX Device-1 --> MCU State: Off Current State:Off	
TYA: RX Packet: "55aa03070008020200040000000720"	
TYA: FnId=21 is set for dpId=2	
TYA: RX Dim State=7	
TYA: RX Packet: "55aa0307000803020004000000001a"	
TYA: FnId=0 is set for dpId=3	
TYA: RX Packet: "55aa0307000804020004000000251b"	
TYA: FnId=0 is set for dpId=4	
TYA: RX Packet: "55aa0307000805020004000000591c"	
TYA: FnId=0 is set for dpId=5	
TYA: RX Packet: "55aa03070008060200040000098fb5"	
TYA: FnId=0 is set for dpId=6	
```	

In the `RX Packet` we are interested in the 3 digits before last 2 digits. For example:	
`98f` in `"55aa03070008060200040000098fb5"`	

1. Make sure the bulb if off.	
2. Find out the voltage standard of your country (generally 220, 240, 120v) from this [table](https://www.worldstandards.eu/electricity/plug-voltage-by-country/).	
3. Multiply that number by 10 (2400) and Convert that number (2400) to Hex using any [hex converter](https://www.binaryhexconverter.com/decimal-to-hex-converter) (2400 = 0x960). 	
4. Now look for the number nearest to `960` in the logs. In our case it is `98f`. So we expect that's the voltage which is `ID=6` in our example.	
5. Set voltage functionId `33` by entering `TuyaMCU 33,6`.	
6. Now set dimmer to 100% using the `dimmer 100` command and observe the logs.	
7. Now we need the power rating of your bulb example `9W`. Multiply by 10 (90) and convert to hex which gives us 0x5A. Check which unknown ID is close to `5A`. I this example it is `59` for `ID=5`. This is the Id of `Active Power` function.	
8. Set the active power functionId `31` by entering `TuyaMCU 31,5`.	
9. Once Power and Voltage are set you should see something such as this in the logs:	
   ```	
   TYA: RX Packet: "55aa03070005010100010011"	
   TYA: FnId=11 is set for dpId=1	
   TYA: RX Device-1 --> MCU State: Off Current State:Off	
   TYA: RX Packet: "55aa03070008020200040000000720"	
   TYA: FnId=21 is set for dpId=2	
   TYA: RX Dim State=7	
   TYA: RX Packet: "55aa0307000803020004000000001a"	
   TYA: FnId=0 is set for dpId=3	
   TYA: RX Packet: "55aa0307000804020004000000251b"	
   TYA: FnId=0 is set for dpId=4	
   TYA: RX Packet: "55aa0307000805020004000000591c"	
   TYA: FnId=31 is set for dpId=5	
   TYA: Rx ID=5 Active_Power=9	
   TYA: RX Packet: "55aa03070008060200040000098fb5"	
   TYA: FnId=33 is set for dpId=6	
   TYA: Rx ID=6 Voltage=244.7	
   ```	
10. To get the Id for the current, calculate Current = Power / Voltage ( 9 / 244.7 ) = 0.0367. Multiply this by 1000 = 36.77. Now convert 36 to hex which is 0x24. This is closest to `25` which is Id 4. 	
11. Set the current FunctionId `32` using command `TuyaMCU 32,4`.	
12. Observe the logs should start showing	
    ```	
    TYA: RX Packet: "55aa03070005010100010011"	
    TYA: FnId=11 is set for dpId=1	
    TYA: RX Device-1 --> MCU State: Off Current State:Off	
    TYA: RX Packet: "55aa03070008020200040000000720"	
    TYA: FnId=21 is set for dpId=2	
    TYA: RX Dim State=7	
    TYA: RX Packet: "55aa0307000803020004000000001a"	
    TYA: FnId=0 is set for dpId=3	
    TYA: RX Packet: "55aa0307000804020004000000251b"	
    TYA: FnId=32 is set for dpId=4	
    TYA: Rx ID=4 Current=312	
    TYA: RX Packet: "55aa0307000805020004000000591c"	
    TYA: FnId=31 is set for dpId=5	
    TYA: Rx ID=5 Active_Power=9	
    TYA: RX Packet: "55aa03070008060200040000098fb5"	
    TYA: FnId=33 is set for dpId=6	
    TYA: Rx ID=6 Voltage=2447	
    ```	
13. Power and current should change on dimming high / low. The Tasmota web UI should show power values now.	

## Switches	
For switches we need to  	
1. Configure the number of relays.	
2. Configure Power metering.	

### Configure number of relays	
By default, the TuyaMCU module expects a 1 gang switch. There is currenty no way to detect the number of relays present in an MCU based switch. We need to tell the number of relays to Tasmota using FunctionIDs 12 to 18 for Relay2 to Relay4. 	
* For a 4 gang switch set `TuyaMCU 12,2`, `TuyaMCU 13,3` and `TuyaMCU 14,4` if the dpIds for Relays 2-4 are `2`,`3`,`4`.	

> You can configure all at once by using `Backlog TuyaMCU 12,2; TuyaMCU 13,3; TuyaMCU 14,4`	
### Configure power metering	
Power metering configuration is same as for [dimmers](#power-metering).	

## Curtain Motor	
The Zemismart WiFi curtain motor uses a Tuya TYWE1S inside the little white dongle as a radio modem.	
`U1TX` is connected to "USB D+", `U1RX` is connected to "USB D-", and there is a blue LED in the dongle connected to "USB3 R-" controlled by the MCU. To flash Tasmota, we need `U0RX`, `U0TX`, and `GPIO0`. None of which are broken out on the PCB, so soldering or Tuya-Convert are necessary.	

The stock Tuya App communicates with the PIC Micro inside the motor housing at 9600 8N1. 	
* `dpId 101` is the "partial open/partial close" command with a 4 byte field of 0-100%. 	
* `dpId 102` is a "fully open/fully close" command with a 1-byte Boolean field. 	
* `dpId 103` is unknown.	

### Debugging	
```	
55 aa 00 06 "deliver dp" 0005 "len=5" 66 04 00 01 <00=close100%,01=open0%> <chksum> is the fully open/close command	
07 "report dp" 0005 (len) 66 04 00 01 <00 or 01> <chksum> is the reply.	
55 aa 00 06 "deliver dp" 0008 (len=8) 65 02 00 04  <value.32 <chksum> is the move partial command	
55 aa 00 07 "report dp" 0008 (len=8) 65 02 00 04 <value.32> <chksum> is the reply. 	
```	

There may first be a reply of 65 02 00 04 <oldvalue.32> <chksum> before the motor engages	

### Tasmota	
1. `module 54` # TuyaMCU (will reboot)	
2. `backlog gpio1 0; gpio3 0; gpio15 107; gpio13 108` # change GPIO assignments. The dongle uses gpio15 for U1TX and gpio13 for U1RX (will reboot)	
3. `tuyamcu 21,101` # declare curtain as a dimmer (will reboot)	
4. \# no idea what a good tuyamcu xx,102 is	
5. \# no idea what a good tuyamcu xx,103 is	
6. `setoption 69 0` # allow dimmer below 25% or 10%. (won't reboot)	

With these settings, the `dimmer` command can adjust the curtain from 100% (closed) to 1% (almost fully open, 0% is the motor limit, but 1% is the Tasmota limit?)	

#### Things that did not work	
```	
tuyamcu 1,102 # make 0x66 a button	
tuyamcu 1,103 # make 0x67 a button	
```	
Having 0x66 declared a button caused the motor to oscillate - open part way and then close again. Like Tasmota was sending the "fully open" command and then immediately cancelling it with a "partial close" command.	
```	
tuyamcu 11,102 # make 0x66 a relay	
tuyamcu 11,103 # make 0x67 a relay	
```	
Does not appear to have any impact on the curtain.

### Aromatherapy Diffuser
Applies to devices using the PCB marked GD-HDFW05-v1.0. ![image](https://user-images.githubusercontent.com/5904370/67526288-c4559500-f6b4-11e9-867f-2b3ae0b82437.png)

This diffuser uses the same dpId scheme as the [example protocol](tuya-protocols#aromatherapy-machine-oil-diffuser)

#### Functions
`dpID 1` device power: 0 = off / 1 = on    
`dpID 11` led power: 0 = off / 1 = on    
`dpID 12` error notification: 0 = ok / 1 = error  
`dpID 13` countdown mode options: 0 = off / 1 = 1hr / 2 = 3hr *not needed with Tasmota*    
`dpID 14` countdown status: reports value of 0...360 minutes *not needed with Tasmota*    
`dpID 103` mist strength: 0 = low / 1 = high    
`dpID 108` led color: 14 char value in hex (can define only RGB and send HSV value as max: `RRGGBBffff6464`)    
`dpID 110` led mode: 0 = rgb_cycle / 1 = color / 2 = white    
`dpID 110` led dimmer **color and white modes only** *it is important to define 'DimmerRange 1,255'*

#### Configuration

After applying the template and configuring Wi-Fi and MQTT issue

```lua
Backlog SetOption66 1; TuyaMCU 21,111; TuyaMCU 11,1; TuyaMCU 12,11; TuyaMCU 13,103; TuyaMCU 14,12; TuyaMCU 15,110; DimmerRange 1,255; SetOption59 1
```
```lua
Rule1 on TuyaReceived#data=55AA000700056E040001007E do publish2 stat/GD-30W/EFFECT rgb_cycle endon on TuyaReceived#data=55AA000700056E040001017F do publish2 stat/GD-30W/EFFECT color endon on event#rgb_cycle do tuyasend4 110,0 endon on event#color do tuyasend4 110,1 endon on event#ON do backlog tuyasend4 110,1; tuyasend 11,1 endon on event#off do tuyasend1 11,0 endon on power3#state=1 do tuyasend4 103,1 endon on power3#state=0 do tuyasend4 103,0 endon
Rule1 1
```

*Optional rule used to prevent the device going into countdown mode (f.e. using on device controls) and complete MCU status update on restart*

```lua
Rule3 on TuyaReceived#data=55AA000700050D040001011E do tuyasend4 13,0 endon on TuyaReceived#data=55AA000700050D040001021F do tuyasend4 13,0 endon on mqtt#connected do serialsend5 55aa0001000000 endon
Rule3 1
```
[All commands in .txt](https://gist.github.com/blakadder/2d112b50edd8f75f2d7fb0dddd9310c4)

#### What you get
- Relay1 turns the diffuser on or off in stored mist strength mode, turns led on or off in stored mode and serves as device power status
- Relay2 turns light on or off and serves as light power status.
- Relay3 mist strength status and control using `Rule1`
- Relay4 is used for error status (ON = error), no control
- Relay5 is used for light mode status (0 = rgb_cycle, 1 = color), no control

LED mode status is reported to mqtt topic `stat/GD-30W/EFFECT` and command [`Event`](https://github.com/arendst/Tasmota/wiki/Commands#event) is used to control some functions using [`TuyaSend4`](https://github.com/arendst/Tasmota/wiki/Commands#tuyasend4) command. All this is defined in `Rule1`

Color can be changed using `TuyaSend3 108,RRGGBB64646464` (RR, GG and BB are hex value) only in color mode.

Dimming works using slider and `Dimmer` command but only when in color mode, in rgb_cycle there are no brightness controls.

Long press on device's power button initiates Tasmota's Wi-Fi config
