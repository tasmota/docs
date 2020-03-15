

<a id="top">
!> **This feature is not included in precompiled binaries.**     

To use it you must [compile your build](compile-your-build). Add the following to `user_config_override.h`:

```
#ifndef USE_SCRIPT
#define USE_SCRIPT  # adds about 17k flash size, variable ram size
#endif
#ifndef USE_SML_M
#define USE_SML_M
#endif
#ifdef USE_RULES
#undef USE_RULES
#endif
// see bellow instructions to set the value N accordingly
#define SML_MAX_VARS N
```
----

**Driver for various meters , heating devices, and reed like contacts**

To use this interface, connect the meter to available GPIO pins. These GPIOs must be set as `None (0)`
components in Tasmota. If the interface detects that a meter descriptor GPIO conflicts with a Tasmota GPIO setting, the interface will generate a "duplicate GPIO defined" error in the log and the meter descriptor will be ignored.  

The Smart Meter Interface provides a means to connect many kinds of meters to Tasmota. **The following types of meter protocols are supported:**  
- ASCII OBIS telegrams emitted from many smart meters and also from P1 meter interface  
- Binary SML OBIS telegram emitted from many smart meters  
- Binary EBUS telegram emitted by many heaters and heat pumps  (e.g., Vaillant, Wolf)
- Binary MODBUS telegram used by many power meters
- Binary RAW telegram decodes all kinds of binary data eg EMS heater bus
- Counter interface (uses Tasmota counter storage) for e.g., reed contacts either in polling or IRQ mode

There are many different meters that use the same protocol. There are multitudes of variants and use cases. A meter can be defined by using compilation time `#define` pragmas. This requires recompiling the firmware to make modifications.  

This interface provides a means of specifying these definitions through [meter descriptors](#Smart-Meter-Descriptors). This method uses the [scripting language](Scripting-Language) editor to define the descriptors. In this way, only one firmware binary version is required and a modification can be made easily "on the fly".  

> [!NOTE] If no `>M` section is found in the script or if the scripting language is not compiled, the driver reverts to the default `#define` definition(s).  
  
> [!NOTE]Additional hardware is required to read certain measuring devices. For example: RS485toTTL Adaper for Modbus, IR transistor for electricity meters. Sometimes an additional IR diode and resistors.  
  
  
## Descriptor Syntax
This section must be present, but empty. In most cases, there is no need to define variables for this driver.  
> `>D`  

Declare a script `>B` (boot) section to inform the interface to read the meter descriptor(s)
> `>B`  
=>[sensor53](Commands#sensor53) r

Declare a script `>M` section with the number of connected meters (n = `1..5`)
> `>M <n>`  
------------------------------------------------------------------------------
### Meter Declaration
`+<M>,<rxGPIO>,<type>,<flag>,<parameter>,<jsonPrefix>{,<txGPIO>,<txPeriod>,<cmdTelegram>}`  

> [!EXAMPLE]
`+1,3,o,0,9600,OBIS1,1,2,2F3F210D0A` 
`+1,3,s,16,9600,SML1`  
`+1,12,c,1,-10,H20_Cnt`
`+1,3,m,0,9600,MODBUS,1,1,01040000,01040002,01040004,01040006,01040008,0104000a,0104000c,0104000e,01040010`  

`+<M>,<rxGPIO>,<type>,<flag>,<parameter>,<jsonPrefix>{,<txGPIO>,<txPeriod>,<cmdTelegram>}`  
- `<M>` - meter number. The number must be increased with each additional Meter. (1...5)  
- `<rxGPIO>` - meter data receive GPIO  
- `<type>` - meter type of meter:  
  - `o` = OBIS ASCII type of coding  
  - `s` = SML binary smart message coding  
  - `c` = Counter type  
  - `e` = EBus binary coding  
  - `m` = MODBus binary coding with serial mode 8N1   
  - `M` = MODBus binary coding with serial mode 8E1 
  - `r` = Raw binary coding (any binary telegram)  
- `<flag>` - options flag:  
  - `0` = counter without pullup  
  - `1` = counter with pullup   
  - `16` = enable median filter for that meter. Can help with sporadic dropouts eg. reading errors. (not available for counters)     
- `<parameter>` - parameters according to meter type:  
  - for `o,s,e,m,r`: serial baud rate eg. 9600  
  - for `c`:  
    - positive value >0 = counter poll interval  
    - negative value <=0 = debounce time (milliseconds) for irq driven counters  
- `<jsonPrefix>` - prefix for Web UI and MQTT JSON payload. Up to 7 characters  
- `<txGPIO>` - meter command transmit GPIO (optional)  
- `<txPeriod>` - number of 250ms increments (n * 250ms). Period to repeat the transmission of commands to the meter (optional)  
- `<cmdTelegram>` - comma separated hex coded byte blocks to send to meter device. For modbus each comma separated block is a command to retrieve a certain register from the meter (Optional, only required for measuring devices that have to be triggered with a certain character string.)  
  
**Modbus:**
> [!EXAMPLE]  
`+1,3,m,0,9600,MODBUS,1,1,01040000,01040002,01040004,01040006,01040008,0104000a,0104000c,0104000e,01040010`    
Components of the character string:  
`...01040000,01040002,...`    
`01` = Modbus slave device ID   
`04` = Instruction to read an Input Register (alternatively, `03` = Instruction to read an Holding Register)
`0000`/`0002` = Register # (as Hexadecimal codification, without the prefix `0x`. Example: `0x0079` -> `0079`)

> [!NOTE] `ID`, `Instruction to read the Register` value (Input vs Holding) and `Register #` may differ depending on the measuring device.  
   
------------------------------------------------------------------------------  
### Meter Metrics
Each meter typically provides multiple metrics (voltage, power, current, humidity etc.) which it measures. An entry for each metric to be collected as `#define SML_MAX_VARS N` (n = `1..16`) must be specified, in `user_config_override.h` file (see the code at the page top). An entry defines how to decode the data and put it into variables.

> [!EXAMPLE] (OBIS/SML/MODBus): 
`1,1-0:1.8.1\*255(@1,Total consumption,KWh,Total_in,4`   
`1,77070100010801ff@1000,W1,kWh,w1,4`  
`1,010304UUuuxxxxxxxx@i0:1,Spannung L1,V,Voltage_L1,0`  

`<M>,<decoder>@<scale>,<label>,<UoM>,<var>,<precision>`  
- `<M>` - meter number to which this decoder belongs  
- `<decoder>` - decoding specification. Decode OBIS as ASCII; SML, EBUS, MODBus, RAW as HEX ASCII
  - OBIS: ASCII OBIS code terminated with `(` character which indicates the start of the meter value  
  - SML: SML binary OBIS as hex terminated with `0xFF` indicating start of SML encoded value  
  - EBUS, MODBus, RAW: hex values of EBUS, MODBus, RAW block to compare  
    - `xx` means ignore value  (1 byte)
    - `ss` = extract a signed byte  
    - `uu` = extract an unsigned byte  
    - `UUuu` = extract an unsigned word (high order byte first)  
    - `uuUU` = extract an unsigned word (low order byte first) 
    - `UUuuUUuu` = extract an unsigned long word (high order byte first)  
    - `SSss` = extract a signed word (high order byte first)   
    - `ssSS` = extract a signed word (low order byte first)  
    - `SSssSSss` = extract an signed long word (high order byte first)  
    - `ffffffff` = extract a float value  
    - `FFffFFff` = extract a reverse float value  
    - `@` decoding definition termination character
    - decoding a 0/1 bit is indicated by a `@` character followed by `bx:` (x = `0..7`) extracting the corresponding bit from a byte.   
      e.g.: `1,xxxx5017xxuu@b0:1,Solarpump,,Solarpump,0`  
    - in the case of **MODBus**, `ix:` designates the index (x = `0..n`) referring to the requested block in the transmit section of the meter definition  
	> [!EXAMPLE] 
   `+1,3,M,1,9600,SBC,1,2,01030023,01030028...`  
   `1,010304UUuuxxxxxxxx@i0:1,Voltage L1,V,Voltage_L1,0` < the `i0:1` refers to: `01030023` with a scaling factor (`:1`) of 1   
   `1,010304UUuuxxxxxxxx@i1:10,Current L1,V,Current_L1,2` < the `i1:10` refers to: `01030028` with a scaling factor (`:10`) of 10       
  
- `<scale>` - scaling factor (divisor)  
  This can be a fraction (e.g., 0.1 => result * 10), or a negative value  
  When decoding a string result (e.g., a serial meter), use `#` character for this parameter (only in one line per meter). For OBIS, you need a `)` termination character after the `#` character  
 Example:
 OBIS: `1,1-0:0.0.0\*255(@#),Meter Nr,, Meter_number,0`  
 SML: `1,77078181c78203ff@#,Service ID,,Meter_id,0`  
- `<label>` - web UI label (max 23 chars)  
- `<UoM>` - unit of measure (max 7 chars)  
- `<var>` - MQTT variable name (max 23 chars)  
- `<precision>` - number of decimal places  
  Add 16 to transmit the data immediately. Otherwise it is transmitted on [`TelePeriod`](Commands#teleperiod)  
> [!EXAMPLE]   
 `1,1-0:1.8.0*255(@1,consumption,KWh,Total_in,4` > Transmitted on  [`TelePeriod`](Commands#teleperiod)   
`1,1-0:1.8.0*255(@1,consumption,KWh,Total_in,20` > Precision of 4. 4 + 16 = 20 >transmit its value immediately  

`#` character terminates the list  

------------------------------------------------------------------------------
**Special Commands**

with the '=' char at the beginning of a line you may do some special decoding  

- `M,=m` perform arithmetic (`+,-,*,/`) on the metric. Use `#` before a number to designate a constant value  
> [!EXAMPLE]    
  `1,=m 3+4+5/#3 @100,Voltage L1+L2+L3/3,V,Volt_avg,2`  
  `1,=m 3+4+5/#3` add result of decoder entry 3,4,5 and divided by 3 (i.e., average)  
- `M,=d` calculate difference between metric values decoded at time intervals  
> [!EXAMPLE]   
  `1,=d 3 10` calculate 10 second interval difference of decoder entry 3  
- `M,=h` html text (up to 30 chars)  
  inserts a html line between entries (these lines do not count as decoder entry)  
> [!EXAMPLE]     
  `1,=h==================` insert a separator line  

> [!TIP] Use: `sensor53 dM` to output the received data in the console. M = the number of the defined meter in the script.  
>[!NOTE]During the output of the data in the console, the data in the WEB UI are not updated. To return write: `sensor53 d0`  
    
    
[!WARNING] With a few meters, it is necessary to request the meter to send its data using a specific character string. This string has to be send at a very low baudrate. (300Baud) 
  If you reply the meter with an acknowledge and ask the it for a new baudrate of 9600 baud, the baudrate of the SML driver has to be changed, too.

  
  To change the baudrate:
  >sml(`METERNUMBER` 0 `BAUDRATE`)  
  
  For sending a specific character string:
  
  >sml(`METERNUMBER` 1 `STRING`)
  
  That works like this:  
    
    
  > [!EXAMPLE] `>D`  
    res=0  
    scnt=0    
;For this Example in the >F section  
    > `>F`
    ;count 100ms   
    scnt+=1  
    switch scnt  
    case 6  
    ;set sml driver to 300 baud and send /?! as HEX to trigger the Meter   
    res=sml(1 0 300)  
    res=sml(1 1 "2F3F210D0A")  
    >;1800ms later \> Send ACK and ask for switching to 9600 baud  
    case 18  
    res=sml(1 1 "063035300D0A")  
    >;2000ms later \> Switching sml driver to 9600 baud    
    case 20  
    res=sml(1 0 9600)   
    >;Restart sequence after 50x100ms    
    case 50  
    ; 5000ms later \> restart sequence    
    scnt=0  
    ends        
    > `>M 1`  
    +1,3,o,0,9600, ,1  
    ...etc.  
  
  You can find the example [here.](#landis-gyr-zmr120ares2r2sfcs-obis)  

!>Attention, this procedure is only necessary, if the meter explicitly asks for 300 baud. The most meters work directly with 9600 baud. Therefore it is easier to give this method a try:  
> [!EXAMPLE] `Meter#,GPIO# Input,TYPE,FLAG,Baudrate,JSONNAME,GPIO# Output,TX Period,Character string`  
  > \+ 1,3, o, 0,9600, energy, 1,4,2F3F210D0A   

   Example: [here.](#Iskra-MT-174-obis)


	  

## Smart Meter Descriptors
- [EMH ED300L (SML)](#EMH-ED300L-SML)
- [Hager EHZ363 (SML)](#Hager-EHZ363-SML)
- [Hager EHZ161 (OBIS)](#Hager-EHZ161-OBIS)
- [Landis + Gyr ZMR120AR (OBIS)](#landis-gyr-zmr120ares2r2sfcs-obis)
- [COMBO Meter (Water,Gas,SML)](#COMBO-Meter-WaterGasSML)
- [WOLF CSZ 11/300 Heater](#WOLF-CSZ-11300-Heater)
- [SDM530 (MODBUS)](#SDM530)
- [Janitza B23 (MODBUS)](#Janitza-B23)
- [Hager EHZ363 (SML) with daily values](#Hager-EHZ363-SML-with-daily-values)
- [Iskra MT 174](#Iskra-MT-174-obis)
- [SBC ALE3 (MODBUS)](#SBC-ALE3-MODBUS)
- [2 * SBC ALE3 (MODBUS)](#_2-SBC-ALE3-MODBUS)
--------------------------------------------------------


### EMH ED300L (SML)  
  
>`>D`    
  
>`>B`   
=>sensor53 r  
>`>M 2`  
+1,13,s,0,9600,Haus  
+2,12,s,0,9600,Heizung  
>
>1,77070100100700ff@1,Aktuell,W,Power_curr,0  
1,77070100010800FF@1000,Zählerstand Verb.,kWh,Tariflos,2  
1,77070100020800FF@1000,Zählerstand Einsp.,kWh,Tariflos,2  
2,=h==================  
2,77070100100700ff@1,Aktuell,W,Power_curr,0  
2,77070100010800FF@1000,Zählerstand Verb.,kWh,Tariflos,2  
2,77070100020800FF@1000,Zählerstand Einsp.,kWh,Tariflos,2  
\#    
  

[Back To Top](#top)

------------------------------------------------------------------------------

### Hager EHZ363 (SML)

>`>D`  

>`>B`  
=>sensor53 r

>`>M 1`  
+1,3,s,0,9600,SML  
>
>1,77070100010800ff@1000,Total consumption,KWh,Total_in,4  
1,77070100020800ff@1000,Total Feed,KWh,Total_out,4  
1,77070100100700ff@1,Current consumption,W,Power_curr,0  
1,77070100000009ff@#,Meter Nr,,Meter_number,0  
\#  


[Back To Top](#top)

------------------------------------------------------------------------------

### Hager EHZ161 (OBIS)

>`>D`  

>`>B`  
=>sensor53 r

>`>M 1`  
+1,3,o,0,9600,OBIS  
>
>1,1-0:1.8.1\*255(@1,Total consumption,KWh,Total_in,4  
1,1-0:2.8.1\*255(@1,Total Feed,KWh,Total_out,4  
1,=d 2 10 @1,Current consumption,W,Power_curr,0  
1,1-0:0.0.0\*255(@#),Meter Nr,, Meter_number,0  
\#  

[Back To Top](#top)

------------------------------------------------------------------------------

### Landis + Gyr ZMR120AReS2R2sfCS (OBIS)
  
 ?> Example: Changing the baud rate during operation.
    
> `>D`  
;Var Power consumption total HT+NT  
v1=0  
;HT Main electricity tariff consumption total   
v2=0  
;NT Night electricity tariff consumption total  
v3=0  
; Energie L1+L2+L3  
v4=0  
;recent Energie L1  
v5=0  
;recent Energie L2  
v6=0  
;recent Energie L3  
v7=0  
  
  
>;Var minute   
min=0  
;Var hour  
hr=0  
;Var begin of the month 01.xx.20xx 0:00 Uhr  
md=0  
;Var begin of the year 01.01. 0:00 Uhr  
yr=0  
;Var for counter see >F=ms  
scnt=0  
;Var for baudrate changeing 
res=0  
  
>;Permanent Var Meter1 0:00   
p:sm=0  
p:HT_sm=0  
p:NT_sm=0  
;Var for daily =0  
sd=0  
HT_sd=0  
NT_sd=0  
;Permanent Var for month begin  
p:sma=0  
p:HT_sma=0  
p:NT_sma=0  
;Var for monthly =0  
smn=0  
HT_smn=0  
NT_smn=0  
;Permanent Var for year begin  
p:sya=0  
p:HT_sya=0  
p:NT_sya=0  
;Var for yearly =0  
syn=0  
HT_syn=0  
NT_syn=0  
  
>;Fill vars with content on teleperiod    
> `>T`  
v1=#Total_in  
v2=#HT_Total_in  
v3=#NT_Total_in  
v4=#kW_L1+L2+L3  
v5=#kw_L1  
v6=#kw_L2  
v7=#kw_L3  
  
> `>B`  
;Restart driver  
=>sensor53 r  
;Set teleperiod to 20sec  
tper=20  
  
> `>F`  
; count 100ms   
scnt+=1  
switch scnt  
case 6  
;set sml driver to 300 baud and send /?! as HEX to trigger the Meter   
res=sml(1 0 300)  
res=sml(1 1 "2F3F210D0A")  
  
>;1800ms later \> Ack and ask for switching to 9600 baud  
case 18  
res=sml(1 1 "063035300D0A")  
  
>;2000ms later \> Switching sml driver to 9600 baud    
case 20  
res=sml(1 0 9600)  
  
>;Restart sequence after 50x100ms    
case 50  
; 5000ms later \> restart sequence    
scnt=0  
ends  
  
> `>S`  
;daily usage  
hr=hours  
if chg[hr]>0  
and hr==0  
and v1>0  
then  
sm=v1  
HT_sm=v2  
NT_sm=v3  
svars  
endif  
  
>if upsecs%tper==0{  
sd=v1-sm  
HT_sd=v2-HT_sm  
NT_sd=v3-NT_sm  
}  

>;Monthly usage  
md=day  
if chg[md]>0  
and md==1  
and v1>0  
then  
sma=v1  
HT_sma=v2  
NT_sma=v3  
svars  
endif  
  
>if upsecs%tper==0{  
smn=v1-sma  
HT_smn=v2-HT_sma  
NT_smn=v3-NT_sma  
}  
  
> ;Yearly usage  
yr=year  
if chg[yr]>0  
and v1>0  
then  
sya=v1  
HT_sya=v2  
NT_sya=v3  
svars  
endif  
  
>if upsecs%tper==0{  
syn=v1-sya  
HT_syn=v2-HT_sya  
NT_syn=v3-NT_sya  

  

>; Json payload \> send on teleperiod  
> `>J`  
,"Strom_Vb_Tag":%3sd%  
,"HT_Strom_Vb_Tag":%3HT_sd%  
,"NT_Strom_Vb_Tag":%3NT_sd%  
,"Strom_Vb_M":%1smn%  
,"HT_Strom_Vb_M":%1HT_smn%  
,"NT_Strom_Vb_M":%1NT_smn%  
,"Strom_Vb_Jahr":%0syn%  
,"HT_Strom_Vb_Jahr":%0HT_syn%  
,"NT_Strom_Vb_Jahr":%0NT_syn%  
,"Strom_0:00 _Uhr":%1sm%  
,"HT_Strom_0:00 _Uhr":%1HT_sm%  
,"NT_Strom_0:00 _Uhr":%1NT_sm%  
,"Strom_Ma":%3sma%  
,"HT_Strom_Ma":%3HT_sma%  
,"NT_Strom_Ma":%3NT_sma%  
,"Strom_Ja":%3sya%  
,"HT_Strom_Ja":%3HT_sya%  
,"NT_Strom_Ja":%3NT_sya%  
  



>;Webdisplay stuff  
> `>W`  
\----------------------  
>0:00 Uhr Σ HT+NT: {m} %0sm% KWh  
HT: {m} %0HT_sm% KWh  
NT: {m} %0NT_sm% KWh  
\----------------------  
>Monatsanfang: {m} %1sma% KWh  
HT: {m} %1HT_sma% KWh  
NT: {m} %1NT_sma% KWh  
\----------------------  
>Jahresanfang: {m} %0sya% KWh  
HT: {m} %0HT_sya% KWh  
NT: {m} %0NT_sya% KWh  
\.............................  
Tagesverbrauch: {m} %1sd% KWh  
HT: {m} %1HT_sd% KWh  
NT: {m} %1NT_sd% KWh  
\----------------------  
>Monatsverbrauch: {m} %0smn% KWh  
HT: {m} %0HT_smn% KWh  
NT: {m} %0NT_smn% KWh  
\---------------------  
>Jahresverbrauch: {m} %0syn% KWh  
HT: {m} %0HT_syn% KWh  
> 0:00 Uhr Σ HT+NT: {m} %0sm% KWh  
HT: {m} %0HT_sm% KWh  
NT: {m} %0NT_sm% KWh  
\----------------------  
>Monatsanfang: {m} %1sma% KWh  
HT: {m} %1HT_sma% KWh  
NT: {m} %1NT_sma% KWh  
\----------------------  
>Jahresanfang: {m} %0sya% KWh  
HT: {m} %0HT_sya% KWh  
NT: {m} %0NT_sya% KWh  
\.............................  
Tagesverbrauch: {m} %1sd% KWh  
HT: {m} %1HT_sd% KWh  
NT: {m} %1NT_sd% KWh  
\----------------------  
>Monatsverbrauch: {m} %0smn% KWh  
HT: {m} %0HT_smn% KWh  
NT: {m} %0NT_smn% KWh  
\---------------------  
>Jahresverbrauch: {m} %0syn% KWh  
HT: {m} %0HT_syn% KWh  
NT: {m} %0NT_syn% KWhNT: {m} %0NT_syn% KWh  
  
> `>M 1`  
>
>+1,3,o,0,9600,,1  
1,0.0.1(@1,Zählernummer,,Meter_number,0  
1,0.9.1(@#),Zeitstempel,Uhr,time-stamp,0  
1,=h===================  
1,1.8.0(@1,HT+NT Zählerstand,KWh,Total_in,3  
1,1.8.1(@1,HT,KWh,HT_Total_in,3  
1,1.8.2(@1,NT,KWh,NT_Total_in,3  
1,=h===================  
1,36.7.0(@1,Power_L1,kW,kW_L1,2  
1,56.7.0(@1,Power_L2,kW,kW_L2,2  
1,76.7.0(@1,Power_L3,kW,kW_L3,2  
1,16.7.0(@1,Σ_L1+L2+L3,kW,kW_L1+L2+L3,2  
1,=h===================  
1,31.7.0(@1,Strom_L1,A,I_L1,2  
1,51.7.0(@1,Strom_L2,A,I_L2,2  
1,71.7.0(@1,Strom_L3,A,I_L3,2  
\#

[Back To Top](#top)

------------------------------------------------------------------------------

### COMBO Meter (Water,Gas,SML)

>`>D`  

>`>B`  
=>sensor53 r

>`>M 3`  
+1,1,c,0,10,H20  
+2,4,c,0,50,GAS  
+3,3,s,0,9600,SML  
>
>1,1-0:1.8.0\*255(@10000,Water reading,cbm,Count,4  
2,=h==================  
2,1-0:1.8.0\*255(@100,Gas reading,cbm,Count,3  
3,77070100010800ff@1000,Total consumption,KWh,Total_in,3  
3,=h==================  
3,77070100100700ff@1,Current consumption,W,Power_curr,2  
3,=h -------------------------------  
3,=m 10+11+12 @100,Currents L1+L2+L3,A,Curr_summ,2  
3,=m 13+14+15/#3 @100,Voltage L1+L2+L3/3,V,Volt_avg,2  
3,=h==================  
3,77070100240700ff@1,Consumption P1,W,Power_p1,2  
3,77070100380700ff@1,Consumption P2,W,Power_p2,2  
3,770701004c0700ff@1,Consumption P3,W,Power_p3,2  
3,=h -------------------------------  
3,770701001f0700ff@100,Current L1,A,Curr_p1,2  
3,77070100330700ff@100,Current L2,A,Curr_p2,2  
3,77070100470700ff@100,Current L3,A,Curr_p3,2  
3,=h -------------------------------  
3,77070100200700ff@100,Voltage L1,V,Volt_p1,2  
3,77070100340700ff@100,Voltage L2,V,Volt_p2,2  
3,77070100480700ff@100,Voltage L3,V,Volt_p3,2  
3,=h==================  
3,77070100000009ff@#,Service ID,,Meter_id,0  
3,=h--------------------------------  
\#  

[Back To Top](#top)

------------------------------------------------------------------------------

### WOLF CSZ 11/300 Heater

>`>D`  

>`>B`  
=>sensor53 r

>`>M 1`  
+1,3,e,0,2400,EBUS  
>
>1,xxxx0503xxxxxxxxxxxxxxxxss@1,Outside temperature,C,Outsidetemp,0  
1,xxxx5014xxxxxxxxxxuu@1,Romm temperature,C,Roomtemp,0  
1,xxxx0503xxxxxxxxxxxxxxuu@1,Warmwater,C,Warmwater,0  
1,xxxx0503xxxxxxxxxxuu@1,Boiler,C,Boiler,0  
1,03fe0503xxxxxxxxxxxxuu@1,Returns,C,Returns,0  
1,03fe0503xxxxuu@1,Status,,Status,0  
1,03fe0503xxxxxxuu@b3:1,Burner on,,Burner,0  
1,xxxx5017xxxxxxuuuu@16,Solar collektor,C,Collector,1  
1,xxxx5017xxxxxxxxxxuuuu@16,Solar storage,C,Solarstorage,1  
1,xxxx5017xxuu@b0:1,Solar pump on,,Solarpump,0  
\#  

[Back To Top](#top)

------------------------------------------------------------------------------

### MODBUS Devices
### SDM530

>`>D`  

>`>B`  
=>sensor53 r

>`>M 1`  
+1,3,m,0,9600,MODBUS,1,1,01040000,01040002,01040004,01040006,01040008,0104000a,0104000c,0104000e,01040010  
>
>1,010404ffffffffxxxx@i0:1,Voltage P1,V,Voltage_P1,2  
1,010404ffffffffxxxx@i1:1,Voltage P2,V,Voltage_P2,2  
1,010404ffffffffxxxx@i2:1,Voltage P3,V,Voltage_P3,2  
1,010404ffffffffxxxx@i3:1,Current P1,A,Current_P1,2  
1,010404ffffffffxxxx@i4:1,Current P2,A,Current_P2,2  
1,010404ffffffffxxxx@i5:1,Current P3,A,Current_P3,2  
1,010404ffffffffxxxx@i6:1,Active Power P1,W,Power_P1,2  
1,010404ffffffffxxxx@i7:1,Active Power P2,W,Power_P2,2  
1,010404ffffffffxxxx@i8:1,Active Power P3,W,Power_P3,2  
\#  

[Back To Top](#top)

------------------------------------------------------------------------------


### Janitza B23

>`>D`

>`>B`  
=>sensor53 r

>`>M 1` 
+1,3,m,0,9600,Janiza,1,1,01034A38,01034A3A,01034A3C,01034A4C,01034A4E,01034A50,01034A72,01034A7A,01034A82  
>
>1,010304ffffffffxxxx@i0:1,Voltage L1-N,V,Voltage_L1-N,2  
1,010304ffffffffxxxx@i1:1,Voltage L2-N,V,Voltage_L2-N,2  
1,010304ffffffffxxxx@i2:1,Voltage L3-N,V,Voltage_L3-N,2  
1,010304ffffffffxxxx@i3:1,Real power L1-N,W,Real_power_L1-N,2  
1,010304ffffffffxxxx@i4:1,Real power L2-N,W,Real_power_L2-N,2  
1,010304ffffffffxxxx@i5:1,Real power L3-N,W,Real_power_L3-N,2  
1,010304ffffffffxxxx@i6:1,Real energy L3,Wh,Real_energy_L3,2  
1,010304ffffffffxxxx@i7:1,Real energy L3-consumed,Wh,Real_energy_L3_consumed,2  
1,010304ffffffffxxxx@i8:1,Real energy L3-delivered,Wh,Real_energy_L3_delivered,2   
\#

[Back To Top](#top)

------------------------------------------------------------------------------


### Hager EHZ363 (SML) with daily values

>`>D`  
pin=0  
pout=0  
pi_d=0  
po_d=0  
hr=0  
; permanent midnight values  
p:pi_m=0  
p:po_m=0  

>`>B`  
=>sensor53 r  

>`>T`  
; get total consumption and total feed  
pin=SML#Total_in  
pout=SML#Total_out  

>`>S`  
; at midnight, save meter total values  
hr=hours  
if chg[hr]>0  
and hr==0  
then  
pi_m=pin  
po_m=pout  
svars  
endif  
>
>; on teleperiod calculate current daily values from midnight  
if upsecs%tper==0  
then  
pi_d=pin-pi_m  
po_d=pout-po_m  
endif  

>; show these values on WEB UI  
>`>W`  
Tagesverbrauch: {m} %pi_d% kWh  
Tageseinspeisung: {m} %po_d% kWh    

>; transmit these values with MQTT  
>`>J`  
,"daily_consumption":%pi_d%,"daily_feed":%po_d%  

>; meter definition  
>`>M 1`  
+1,3,s,0,9600,SML  
>  
>1,77070100010800ff@1000,Total Consumed,KWh,Total_in,4  
1,77070100020800ff@1000,Total Delivered,KWh,Total_out,4  
1,77070100100700ff@1,Current Consumption,W,Power_curr,0  
1,77070100000009ff@#,Meter Number,,Meter_number,0  
\#

[Back To Top](#top)

------------------------------------------------------------------------------


### Iskra MT 174 (OBIS)

>`>D`

>`>B`  
=>sensor53 r

>`>M 1`  
+1,3,o,0,300,STROM,1,100,2F3F210D0A  
>
>1,1-0:1.8.1*255(@1,Total Consumed,KWh,Total_in,3  
1,1-0:2.8.1*255(@1,Total Delivered,KWh,Total_out,3  
1,1-0:0.0.0*255(@#),Meter Number,,Meter_number,0    
\#

[Back To Top](#top)

### SBC ALE3 MODBUS
>`>D`  
>`>B`  
=>sensor53 r  
>`>M 1`  
+1,3,M,1,9600,SBC,1,1,02030023,02030028,0203002d,02030025,0203002a,0203002f,02030032,02030027,0203002c,02030031,02030021,02030015,02030018  
>  
>1,020304UUuuxxxxxxxx@i0:1,Spannung L1,V,Voltage_L1,0  
1,020304UUuuxxxxxxxx@i1:1,Spannung L2,V,Voltage_L2,0  
1,020304UUuuxxxxxxxx@i2:1,Spannung L3,V,Voltage_L3,0  
1,020304xxxxUUuuxxxx@i0:10,Strom L1,A,Current_L1,2  
1,020304xxxxUUuuxxxx@i1:10,Strom L2,A,Current_L2,2  
1,020304xxxxUUuuxxxx@i2:10,Strom L3,A,Current_L3,2  
1,=h=  
1,020304UUuuxxxxxxxx@i3:100,Leistung L1,kW,Power_L1,3  
1,020304UUuuxxxxxxxx@i4:100,Leistung L2,kW,Power_L2,3  
1,020304UUuuxxxxxxxx@i5:100,Leistung L3,kW,Power_L3,3  
1,020304UUuuxxxxxxxx@i6:100,Leistung Total,kW,Power_Total,3  
1,020304xxxxSSssxxxx@i3:100,BlindLeistung L1,kVAr,ReaktivePower_L1,3  
1,020304xxxxSSssxxxx@i4:100,BlindLeistung L2,kVAr,ReaktivePower_L2,3  
1,020304xxxxSSssxxxx@i5:100,BlindLeistung L3,kVAr,ReaktivePower_L3,3  
1,020304xxxxSSssxxxx@i6:100,BLeistung Total,kVAr,ReaktivePower_Total,3  
1,=h=  
1,020304UUuuxxxxxxxx@i7:100,CosPhi L1,,CosPhi_L1,2  
1,020304UUuuxxxxxxxx@i8:100,CosPhi L2,,CosPhi_L2,2  
1,020304UUuuxxxxxxxx@i9:100,CosPhi L3,,CosPhi_L3,2  
1,=h=  
1,020304UUuuUUuuxxxx@i10:100,T2 Wert,kWh,T2_Value,2  
\#

[Back To Top](#top)

### 2 * SBC ALE3 MODBUS
>`>D`  
>`>B`  
=>sensor53 r  
>`>M 1`  
>
>+1,3,M,1,9600,Meter,1,1,01030023,01030028,0103002d,01030025,0103002a,0103002f,01030032,01030027,0103002c,01030031,0103001B,0103001d,03030023,03030028,0303002d,03030025,0303002a,0303002f,03030032,03030027,0303002c,03030031,0303001B,0303001d  
>  
>1,=h Domestic Electricity:  
1,010304UUuuUUuuxxxx@i10:100,1 Tariff 1 total,kWh,M1_T1_total,2  
1,010304UUuuUUuuxxxx@i11:100,1 Tariff 1 partial,kWh,M1_T1_par,2  
1,=h Readings:  
1,010304UUuuxxxxxxxx@i0:1,1 Voltage L1,V,M1_Voltage_L1,0  
1,010304UUuuxxxxxxxx@i1:1,1 Voltage L2,V,M1_Voltage_L2,0  
1,010304UUuuxxxxxxxx@i2:1,1 Voltage L3,V,M1_Voltage_L3,0  
1,010304xxxxUUuuxxxx@i0:10,1 Current L1,A,M1_Current_L1,2  
1,010304xxxxUUuuxxxx@i1:10,1 Current L2,A,M1_Current_L2,2  
1,010304xxxxUUuuxxxx@i2:10,1 Current L3,A,M1_Current_L3,2  
1,010304UUuuxxxxxxxx@i3:100,1 Active Power L1,kW,M1_PRMS_L1,3  
1,010304UUuuxxxxxxxx@i4:100,1 Active Power L2,kW,M1_PRMS_L2,3  
1,010304UUuuxxxxxxxx@i5:100,1 Active Power L3,kW,M1_PRMS_L3,3  
1,010304UUuuxxxxxxxx@i6:100,1 Active Power total,kW,M1_PRMS_total,3  
1,010304xxxxSSssxxxx@i3:100,1 Reactive Power L1,kVAr,M1_QRMS_L1,3  
1,010304xxxxSSssxxxx@i4:100,1 Reactive Power L2,kVAr,M1_QRMS_L2,3  
1,010304xxxxSSssxxxx@i5:100,1 Reactive Power L3,kVAr,M1_QRMS_L3,3  
1,010304xxxxSSssxxxx@i6:100,1 Reactive Power total,kVAr,M1_QRMS_total,3  
1,010304UUuuxxxxxxxx@i7:100,1 CosPhi L1,,M1_CosPhi_L1,2  
1,010304UUuuxxxxxxxx@i8:100,1 CosPhi L2,,M1_CosPhi_L2,2  
1,010304UUuuxxxxxxxx@i9:100,1 CosPhi L3,,M1_CosPhi_L3,2  
1,=h________________________________________________  
; meter 2 +12 offset  
1,=h Heat Pump  
1,030304UUuuUUuuxxxx@i22:100,2 Tariff 1 total,kWh,M2_T1_total,2  
1,030304UUuuUUuuxxxx@i23:100,2 Tariff 1 partial,kWh,M2_T1_par,2  
1,=h Readings:  
1,030304UUuuxxxxxxxx@i12:1,2 Voltage L1,V,M2_Voltage_L1,0  
1,030304UUuuxxxxxxxx@i13:1,2 Voltage L2,V,M2_Voltage_L2,0  
1,030304UUuuxxxxxxxx@i14:1,2 Voltage L3,V,M2_Voltage_L3,0  
1,030304xxxxUUuuxxxx@i12:10,2 Current L1,A,M2_Current_L1,2  
1,030304xxxxUUuuxxxx@i13:10,2 Current L2,A,M2_Current_L2,2  
1,030304xxxxUUuuxxxx@i14:10,2 Current L3,A,M2_Current_L3,2  
1,030304UUuuxxxxxxxx@i15:100,2 Active Power L1,kW,M2_PRMS_L1,3  
1,030304UUuuxxxxxxxx@i16:100,2 Active Power L2,kW,M2_PRMS_L2,3  
1,030304UUuuxxxxxxxx@i17:100,2 Active Power L3,kW,M2_PRMS_L3,3  
1,030304UUuuxxxxxxxx@i18:100,2 Active Power total,kW,M2_PRMS_total,3  
1,030304xxxxSSssxxxx@i15:100,2 Reactive Power L1,kVAr,M2_QRMS_L1,3  
1,030304xxxxSSssxxxx@i16:100,2 Reactive Power L2,kVAr,M2_QRMS_L2,3  
1,030304xxxxSSssxxxx@i16:100,2 Reactive Power L3,kVAr,M2_QRMS_L3,3  
1,030304xxxxSSssxxxx@i18:100,2 Reactive Power total,kVAr,M2_QRMS_total,3  
1,030304UUuuxxxxxxxx@i19:100,2 CosPhi L1,,M2_CosPhi_L1,2  
1,030304UUuuxxxxxxxx@i20:100,2 CosPhi L2,,M2_CosPhi_L2,2  
1,030304UUuuxxxxxxxx@i21:100,2 CosPhi L3,,M2_CosPhi_L3,2  
\#  

[Back To Top](#top)

------------------------------------------------------------------------------
