

<a id="top">
!!! failure "This feature is not included in precompiled binaries"     

To use it you must [compile your build](Compile-your-build). Add the following to `user_config_override.h`:

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
// define max number of decoder entries (defaults to 20 if not defined)
#define SML_MAX_VARS N
```
----

**Driver for various meters , heating devices, and reed like contacts**

To use this interface, connect the meter to available GPIO pins. These GPIOs must be set as `None (0)`
components in Tasmota. If the interface detects that a meter descriptor GPIO conflicts with a Tasmota GPIO setting, the interface will generate a "duplicate GPIO defined" error in the log and the meter descriptor will be ignored. (only for script driven descriptors) if you use the deprecated hard coded interface and no meter script the default harcoded descriptor uses Pin 3 (REC) for receive and thus may interfere with other Tasmota Defintions without warning.  

!!! note
    on an ESP32 due to a different implementation serial ports may not be used in conjunction with other Tasmota serial devices.  

!!! note
    when changing GPIO configurations especially in conjunction with other Tasmota drivers a restart may be required  


The Smart Meter Interface provides a means to connect many kinds of meters to Tasmota. **The following types of meter protocols are supported:**  
- ASCII OBIS telegrams emitted from many smart meters and also from P1 meter interface  
- Binary SML OBIS telegram emitted from many smart meters  
- Binary EBUS telegram emitted by many heaters and heat pumps  (e.g., Vaillant, Wolf)  
- Binary MODBUS telegram used by many power meters  
- Binary RAW telegram decodes all kinds of binary data eg EMS heater bus  
- Counter interface (uses Tasmota counter storage) for e.g., reed contacts either in polling or IRQ mode  

There are many different meters that use the same protocol. There are multitudes of variants and use cases. A meter can be defined by using compilation time `#define` pragmas. This requires recompiling the firmware to make modifications.  

This interface provides a means of specifying these definitions through [meter descriptors](#smart-meter-descriptors). This method uses the [scripting language](Scripting-Language) editor to define the descriptors. In this way, only one firmware binary version is required and a modification can be made easily "on the fly".  

!!! note
    If no `>M` section is found in the script or if the scripting language is not compiled, the driver reverts to the default `#define` definition(s).  
  
!!! note
    Additional hardware is required to read certain measuring devices. For example: RS485toTTL Adaper for Modbus, IR transistor for electricity meters. Sometimes an additional IR diode and resistors.  
  
  
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

!!! example

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
- `<txPeriod>` - number of 100ms increments (n * 100ms). Period to repeat the transmission of commands to the meter (optional)  
- `<cmdTelegram>` - comma separated hex coded byte blocks to send to meter device. For modbus each comma separated block is a command to retrieve a certain register from the meter (Optional, only required for measuring devices that have to be triggered with a certain character string.)  
  
**Modbus:**

!!! example
`+1,3,m,0,9600,MODBUS,1,1,01040000,01040002,01040004,01040006,01040008,0104000a,0104000c,0104000e,01040010`    
Components of the character string:  
`...01040000,01040002,...`    
`01` = Modbus slave device ID   
`04` = Instruction to read an Input Register (alternatively, `03` = Instruction to read an Holding Register)
`0000`/`0002` = Register # (as Hexadecimal codification, without the prefix `0x`. Example: `0x0079` -> `0079`)  
the number of requested registers is fixed to 2, however with the char 'r' before the hex string the complete request string may be specified  
`...r010400000001,r010400020003,...`    

!!! note
    `ID`, `Instruction to read the Register` value (Input vs Holding) and `Register #` may differ depending on the measuring device.  
   
------------------------------------------------------------------------------  
### Meter Metrics
Each meter typically provides multiple metrics (voltage, power, current etc.) which it measures. An entry for each metric to be collected must be specified. up to 20 entries may be defined (default or `#define SML_MAX_VARS N` a larger number may be defined 
in `user_config_override.h` file). An entry defines how to decode the data and put it into variables.

!!! example  
(OBIS/SML/MODBus):  
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
    - `(` following the `@` character in case of obis decoder indicates to fetch the 2. value in brackets, not the 1. value.  
	e.g. in this obis paylod the second value is extracted 0-1:24.2.3(210117125004W)(01524.450*m3)  
    - decoding a 0/1 bit is indicated by a `@` character followed by `bx:` (x = `0..7`) extracting the corresponding bit from a byte.   
      e.g.: `1,xxxx5017xxuu@b0:1,Solarpump,,Solarpump,0`  
    - in the case of **MODBus**, `ix:` designates the index (x = `0..n`) referring to the requested block in the transmit section of the meter definition  
    
!!! example    
   `+1,3,M,1,9600,SBC,1,2,01030023,01030028...`  
   `1,010304UUuuxxxxxxxx@i0:1,Voltage L1,V,Voltage_L1,0` < the `i0:1` refers to: `01030023` with a scaling factor (`:1`) of 1   
   `1,010304UUuuxxxxxxxx@i1:10,Current L1,V,Current_L1,2` < the `i1:10` refers to: `01030028` with a scaling factor (`:10`) of 10       
   - `<scale>` - scaling factor (divisor)  
   This can be a fraction (e.g., 0.1 => result * 10), or a negative value  
   When decoding a string result (e.g., a serial meter), use `#` character for this parameter (only in one line per meter). For OBIS, you need a `)` termination character after the `#` character  
 Example:
 OBIS: `1,1-0:0.0.0\*255(@#),Meter Nr,, Meter_number,0`  
 SML: `1,77078181c78203ff@#,Service ID,,Meter_id,0`  
- `<label>` - web UI label (max 23 chars) if this label is the single char '*' the WEB UI is discarded for this line  
- `<UoM>` - unit of measure (max 7 chars)  
- `<var>` - MQTT variable name (max 23 chars)  
- `<precision>` - number of decimal places  
  Add 16 to transmit the data immediately. Otherwise it is transmitted on [`TelePeriod`](Commands#teleperiod)  

!!! example    
 `1,1-0:1.8.0*255(@1,consumption,KWh,Total_in,4` > Transmitted on  [`TelePeriod`](Commands#teleperiod)   
`1,1-0:1.8.0*255(@1,consumption,KWh,Total_in,20` > Precision of 4. 4 + 16 = 20 >transmit its value immediately  

`#` character terminates the list  

!!! note
    in the decoding section of the meter defintions before the @ char no space chars are allowed  
    

------------------------------------------------------------------------------
**Special Commands**

- With the '=' char at the beginning of a line you may do some special decoding  

- `M,=m` perform arithmetic (`+,-,*,/`) on the metric. Use `#` before a number to designate a constant value  

!!! example    
  `1,=m 3+4+5/#3 @100,Voltage L1+L2+L3/3,V,Volt_avg,2`  
  `1,=m 3+4+5/#3` add result of decoder entry 3,4,5 and divided by 3 (i.e., average)  
- `M,=d` calculate difference between metric values decoded at time intervals (up to 10 =d lines possible)  

!!! example   
  `1,=d 3 10` calculate 10 second interval difference of decoder entry 3  
  - `M,=h` html text (up to 30 chars)  
  inserts a html line between entries (these lines do not count as decoder entry)  

!!! example     
  `1,=h==================` insert a separator line 

- With an asterisk `*` character replacing the name in a descriptor line, this line can be hidden in the main menu. ("#define USE_SML_SCRIPT_CMD" required)

!!! example
```
  1,010304ffffffff@i0:1,*,V,Voltage_L1-N,2  
  1,010304ffffffff@i1:1,*,V,Voltage_L2-N,2  
  1,010304ffffffff@i2:1,*,V,Voltage_L3-N,2
  etc...
```


- With an asterisk `*`character as JSON Prefix in the Meter definiton suppresses the JSON output ("#define USE_SML_SCRIPT_CMD" required)

!!! example

  `+1,14,m,0,9600,*,12,2,01040000,01040002,01040004`


- To get the value of one of the descriptor lines, use sml[X]. X = Line number. Starts with 1.  ("#define  USE_SML_SCRIPT_CMD" required)

!!! example
```
  >D
  v1=0
  v2=0
  >S
  ;Writes the value of Descriptorline 1 to v1
  v1=sml[1] 
  ;Writes the value of Descriptorline 2 to v2
  v2=sml[2]
```
 

!!! tip
    Use: `sensor53 dM` to output the received data in the console. M = the number of the defined meter in the script.  

!!! note
    During the output of the data in the console, the data in the WEB UI are not updated. To return write: `sensor53 d0`  
    

!!! warning 
    With a few meters, it is necessary to request the meter to send its data using a specific character string. This string has to be       send at a very low baudrate. (300Baud) 
    If you reply the meter with an acknowledge and ask the it for a new baudrate of 9600 baud, the baudrate of the SML driver has to be     changed, too.

  
  To change the baudrate:
  >sml(`METERNUMBER` 0 `BAUDRATE`)  
  
  For sending a specific character string:
  
  >sml(`METERNUMBER` 1 `STRING`)
  
  That works like this:  
    
    
!!! example

    `>D`  
    res=0  
    scnt=0    
    ;For this Example in the >F section  
    `>F`
    ;count 100ms   
    scnt+=1  
    switch scnt  
    case 6  
    ;set sml driver to 300 baud and send /?! as HEX to trigger the Meter   
    res=sml(1 0 300)  
    res=sml(1 1 "2F3F210D0A")  
    ;1800ms later \> Send ACK and ask for switching to 9600 baud  
    case 18  
    res=sml(1 1 "063035300D0A")  
    ;2000ms later \> Switching sml driver to 9600 baud    
    case 20  
    res=sml(1 0 9600)   
    ;Restart sequence after 50x100ms    
    case 50  
    ; 5000ms later \> restart sequence    
    scnt=0  
    ends        
    >`>M 1`  
    +1,3,o,0,9600, ,1  
    ...etc.  
  
  You can find the example [here.](#landis-gyr-zmr120ares2r2sfcs-obis)  

!!! attention
    This procedure is only necessary, if the meter explicitly asks for 300 baud. The most meters work directly with 9600         baud. Therefore it is easier to give this method a try:  

!!! example
`Meter#,GPIO# Input,TYPE,FLAG,Baudrate,JSONNAME,GPIO# Output,TX Period,Character string`  
  > \+ 1,3, o, 0,9600, energy, 1,4,2F3F210D0A   

   Example: [here.](#iskra-mt-174-obis)


	  

## Smart Meter Descriptors
- [JANZ C3801 (SML - MODBUS)](#janz-c3801-sml-modbus)
- [EMH ED300L (SML)](#emh-ed300l-sml)
- [Hager EHZ363 (SML)](#hager-ehz363-sml)
- [Hager EHZ161 (OBIS)](#hager-ehz161-obis)
- [Landis + Gyr ZMR120AR (OBIS)](#landis-gyr-zmr120ares2r2sfcs-obis)
- [COMBO Meter (Water,Gas,SML)](#combo-meter-watergassml)
- [WOLF CSZ 11/300 Heater](#wolf-csz-11300-heater)
- [SDM530 (MODBUS)](#sdm530)
- [SDM230 (MODBUS)](#sdm230)
- [Janitza B23 (MODBUS)](#janitza-b23)
- [Hager EHZ363 (SML) with daily values](#hager-ehz363-sml-with-daily-values)
- [Iskra MT 174](#iskra-mt-174-obis)
- [SBC ALE3 (MODBUS)](#sbc-ale3-modbus)
- [2 * SBC ALE3 (MODBUS)](#2-sbc-ale3-modbus)
- [Trovis 557x](#trovis-557x)
- [4 * Hiking DDS238-2 ZN/S (MODBUS)](#4--hiking-dds238-2-zns3-modbus)

--------------------------------------------------------

### JANZ C3801 (SML - MODBUS)

This is an example for one of the many quite similar smart meters implemented in Portugal, by `EDP Distribuição S.A.`. May be valid for many more models, as stated.

You should configure your `user_config_override.h` as:

```
#ifndef USE_SCRIPT
#define USE_SCRIPT
#endif
#ifndef USE_SML_M
#define USE_SML_M
#endif
#ifdef USE_RULES
#undef USE_RULES
#endif

#define SML_MAX_VARS 10
```
Your Tasmota SML `script`:

```
>D
 
>B
=>sensor53 r
 
>M 1
 
+1,14,m,1,9600,EB,5,50,0104006C,01040079,0104007A,0104007F,01040026,01040027,01040028,0104000B,01040084
 
1,=hVALORES TÉCNICOS
1,010404UUuuxxxx@i0:10,Tensão,V,Voltage_P1,17
1,010404xxxxUUuu@i0:10,Corrente,A,Current_P1,17
1,010408UUuuUUuuxxxxxxxxxxxx@i1:1,Potência ativa,W,Power_P1,16
1,010406xxxxxxxxUUuu@i2:1000,Fator de potência,pu,PFactor_P1,19
1,01040aUUuuxxxx@i3:10,Frequência,Hz,Frequency_P1,17
1,=h&#8205;
1,=hTOTALIZADORES DE ENERGIA
1,010408UUuuUUuuxxxxxxxxxxxx@i4:1000,Vazio (1),kWh,Energy_P1_R1,17
1,010408UUuuUUuuxxxxxxxxxxxx@i5:1000,Ponta (2),kWh,Energy_P1_R2,17
1,010408UUuuUUuuxxxxxxxxxxxx@i6:1000,Cheia (3),kWh,Energy_P1_R3,17
1,=h&#8205;
1,=hESTADOS
1,010406uuxxxxxxxx@i7:1,Tarifa,,Tariff_P1,16
1,010406uuxxxxxxxx@i8:1,DCP,,DCP_P1,16
 
#
```

### EMH ED300L (SML)  

```
>D    
>B   
->sensor53 r  
>M 2  
+1,13,s,0,9600,Haus  
+2,12,s,0,9600,Heizung  
1,770701000F0700FF@1,Aktuell,W,Power_curr,0  
1,77070100010800FF@1000,Zählerstand Verb.,kWh,Tariflos,2  
1,77070100020800FF@1000,Zählerstand Einsp.,kWh,Tariflos,2  
2,=h==================  
2,770701000F0700FF@1,Aktuell,W,Power_curr,0  
2,77070100010800FF@1000,Zählerstand Verb.,kWh,Tariflos,2  
2,77070100020800FF@1000,Zählerstand Einsp.,kWh,Tariflos,2  
#    
```


------------------------------------------------------------------------------

### Hager EHZ363 (SML) & Apator Norax 3D

```
>D  

>B  
->sensor53 r

>M 1  
+1,3,s,0,9600,SML  
1,77070100010800ff@1000,Total consumption,KWh,Total_in,4  
1,77070100020800ff@1000,Total Feed,KWh,Total_out,4  
1,77070100100700ff@1,Current consumption,W,Power_curr,0  
1,77070100000009ff@#,Meter Nr,,Meter_number,0  
#  

```

------------------------------------------------------------------------------

### Hager EHZ161 (OBIS)

```
>D  
>B  
->sensor53 r
>M 1  
+1,3,o,0,9600,OBIS  
1,1-0:1.8.1\*255(@1,Total consumption,KWh,Total_in,4  
1,1-0:2.8.1\*255(@1,Total Feed,KWh,Total_out,4  
1,=d 2 10 @1,Current consumption,W,Power_curr,0  
1,1-0:0.0.0\*255(@#),Meter Nr,, Meter_number,0  
#  

```
------------------------------------------------------------------------------

### Landis + Gyr ZMR120AReS2R2sfCS (OBIS)
  
 Example: Changing the baud rate during operation.

```
>D  
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
  
;Var minute   
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
  
;Permanent Var Meter1 0:00   
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
  
;Fill vars with content on teleperiod    
>T  
v1=#Total_in  
v2=#HT_Total_in  
v3=#NT_Total_in  
v4=#kW_L1+L2+L3  
v5=#kw_L1  
v6=#kw_L2  
v7=#kw_L3  
  
>B  
;Restart driver  
->sensor53 r  
;Set teleperiod to 20sec  
tper=20  
  
>F  
; count 100ms   
scnt+=1  
switch scnt  
case 6  
;set sml driver to 300 baud and send /?! as HEX to trigger the Meter   
res=sml(1 0 300)  
res=sml(1 1 "2F3F210D0A")  
  
;1800ms later \> Ack and ask for switching to 9600 baud  
case 18  
res=sml(1 1 "063035300D0A")  
  
;2000ms later \> Switching sml driver to 9600 baud    
case 20  
res=sml(1 0 9600)  
  
;Restart sequence after 50x100ms    
case 50  
; 5000ms later \> restart sequence    
scnt=0  
ends  
  
>S  
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
  
if upsecs%tper==0{  
sd=v1-sm  
HT_sd=v2-HT_sm  
NT_sd=v3-NT_sm  
}  

;Monthly usage  
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
  
if upsecs%tper==0{  
smn=v1-sma  
HT_smn=v2-HT_sma  
NT_smn=v3-NT_sma  
}  
  
;Yearly usage  
yr=year  
if chg[yr]>0  
and v1>0  
then  
sya=v1  
HT_sya=v2  
NT_sya=v3  
svars  
endif  
  
if upsecs%tper==0{  
syn=v1-sya  
HT_syn=v2-HT_sya  
NT_syn=v3-NT_sya  

; Json payload \> send on teleperiod  
>J  
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

;Webdisplay stuff  
>W  
----------------------  
0:00 Uhr Σ HT+NT: {m} %0sm% KWh  
HT: {m} %0HT_sm% KWh  
NT: {m} %0NT_sm% KWh  
----------------------  
Monatsanfang: {m} %1sma% KWh  
HT: {m} %1HT_sma% KWh  
NT: {m} %1NT_sma% KWh  
----------------------  
Jahresanfang: {m} %0sya% KWh  
HT: {m} %0HT_sya% KWh  
NT: {m} %0NT_sya% KWh  
.............................  
Tagesverbrauch: {m} %1sd% KWh  
HT: {m} %1HT_sd% KWh  
NT: {m} %1NT_sd% KWh  
----------------------  
Monatsverbrauch: {m} %0smn% KWh  
HT: {m} %0HT_smn% KWh  
NT: {m} %0NT_smn% KWh  
---------------------  
Jahresverbrauch: {m} %0syn% KWh  
HT: {m} %0HT_syn% KWh  
0:00 Uhr Σ HT+NT: {m} %0sm% KWh  
HT: {m} %0HT_sm% KWh  
NT: {m} %0NT_sm% KWh  
----------------------  
Monatsanfang: {m} %1sma% KWh  
HT: {m} %1HT_sma% KWh  
NT: {m} %1NT_sma% KWh  
----------------------  
Jahresanfang: {m} %0sya% KWh  
HT: {m} %0HT_sya% KWh  
NT: {m} %0NT_sya% KWh  
.............................  
Tagesverbrauch: {m} %1sd% KWh  
HT: {m} %1HT_sd% KWh  
NT: {m} %1NT_sd% KWh  
----------------------  
Monatsverbrauch: {m} %0smn% KWh  
HT: {m} %0HT_smn% KWh  
NT: {m} %0NT_smn% KWh  
---------------------  
Jahresverbrauch: {m} %0syn% KWh  
HT: {m} %0HT_syn% KWh  
NT: {m} %0NT_syn% KWhNT: {m} %0NT_syn% KWh  
  
>M 1  
+1,3,o,0,9600,,1  
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
#

```
------------------------------------------------------------------------------

### COMBO Meter (Water,Gas,SML)

```

>D  

>B  
->sensor53 r

>M 3  
+1,1,c,0,10,H20  
+2,4,c,0,50,GAS  
+3,3,s,0,9600,SML  
1,1-0:1.8.0\*255(@10000,Water reading,cbm,Count,4  
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
#  

```

------------------------------------------------------------------------------

### WOLF CSZ 11/300 Heater

```

>D  

>B  
->sensor53 r

>M 1  
+1,3,e,0,2400,EBUS  
1,xxxx0503xxxxxxxxxxxxxxxxss@1,Outside temperature,C,Outsidetemp,0  
1,xxxx5014xxxxxxxxxxuu@1,Romm temperature,C,Roomtemp,0  
1,xxxx0503xxxxxxxxxxxxxxuu@1,Warmwater,C,Warmwater,0  
1,xxxx0503xxxxxxxxxxuu@1,Boiler,C,Boiler,0  
1,03fe0503xxxxxxxxxxxxuu@1,Returns,C,Returns,0  
1,03fe0503xxxxuu@1,Status,,Status,0  
1,03fe0503xxxxxxuu@b3:1,Burner on,,Burner,0  
1,xxxx5017xxxxxxuuuu@16,Solar collektor,C,Collector,1  
1,xxxx5017xxxxxxxxxxuuuu@16,Solar storage,C,Solarstorage,1  
1,xxxx5017xxuu@b0:1,Solar pump on,,Solarpump,0  
#  

```

------------------------------------------------------------------------------

### MODBUS Devices
### SDM530

```

>D  
>B  
->sensor53 r
>M 1  
+1,3,m,0,9600,MODBUS,1,1,01040000,01040002,01040004,01040006,01040008,0104000a,0104000c,0104000e,01040010  
1,010404ffffffff@i0:1,Voltage P1,V,Voltage_P1,2  
1,010404ffffffff@i1:1,Voltage P2,V,Voltage_P2,2  
1,010404ffffffff@i2:1,Voltage P3,V,Voltage_P3,2  
1,010404ffffffff@i3:1,Current P1,A,Current_P1,2  
1,010404ffffffff@i4:1,Current P2,A,Current_P2,2  
1,010404ffffffff@i5:1,Current P3,A,Current_P3,2  
1,010404ffffffff@i6:1,Active Power P1,W,Power_P1,2  
1,010404ffffffff@i7:1,Active Power P2,W,Power_P2,2  
1,010404ffffffff@i8:1,Active Power P3,W,Power_P3,2  
#  

```

------------------------------------------------------------------------------

### SDM230

```

>D  
ms="1,010404ffffffff@"  
>B  
->sensor53 r  
>M 1  
+1,3,m,0,9600,PV,1,2,01040000,01040006,0104000C,01040012,01040018,0104001E,01040024,01040046,01040048,0104004A,0104004C,0104004E,01040054,01040056,01040058,0104005A,0104005C,0104005E,01040102,01040108,01040152,01040158,01040180,01040182  
%ms%i0:1,Volt,V,Volt,2  
%ms%i1:1,Strom P1,A,Strom,3  
%ms%i2:1,*,W,Leistung,2  
%ms%i3:1,Scheinleistung,VA,ScheinLeistung,2  
%ms%i4:1,Blindleistung,VAr,Blindleistung,2  
%ms%i5:1,P-Faktor,,P_Faktor,1  
%ms%i6:1,cosPhi,°,cosPhi,2  
%ms%i7:1,Frequenz,Hz, Frequenz,1  
%ms%i8:1,Wirkleistung Import,kWh,Wirkleistung_Im1,3  
%ms%i9:1,Wirkleistung Export,kWh,Wirkleistung_Ex,3  
%ms%i10:1,Blindleistung Import,VkkVARh,Blindleistung_Im,3  
%ms%i11:1,Blindleistung Export,VkkVARh,Blindleistung_Ex,3  
%ms%i12:1,Gesamtleistungsbedarf,W,GesLeistBed,2  
%ms%i13:1,GesamtLeistung Max,W,GesLeistMax,2  
%ms%i14:1,Akt.Nachfrage,W,AktNachfrage,2  
%ms%i15:1,Rückleistungs Bed,W,RueckLeistBed,2  
%ms%i16:1,Rückleistungs Bed Max,W,RueckLeistBedMax,2  
%ms%i17:1,Strom Nachfrage,A,StromNachfrage2,2  
%ms%i19:1,Max Strombedarf,A,StromBedMax,2  
%ms%i20:1,Wirkleistung Gesamt,kWh,Wirkleistung_total,2  
%ms%i21:1,Blindleistung Gesamt,kVARh,Blindleistung_total,2  
%ms%i22:1,Temp Gesamtleistung,kWh,TempGesamtLeist,2  
#  

```

------------------------------------------------------------------------------

### Janitza B23

```

>D
>B  
->sensor53 r

>M 1  
+1,3,m,0,9600,Janitza,1,1,01034A38,01034A3A,01034A3C,01034A4C,01034A4E,01034A50,01034A72,01034A7A,01034A82  

1,010304ffffffff@i0:1,Voltage L1-N,V,Voltage_L1-N,2  
1,010304ffffffff@i1:1,Voltage L2-N,V,Voltage_L2-N,2  
1,010304ffffffff@i2:1,Voltage L3-N,V,Voltage_L3-N,2  
1,010304ffffffff@i3:1,Real power L1-N,W,Real_power_L1-N,2  
1,010304ffffffff@i4:1,Real power L2-N,W,Real_power_L2-N,2  
1,010304ffffffff@i5:1,Real power L3-N,W,Real_power_L3-N,2  
1,010304ffffffff@i6:1,Real energy L3,Wh,Real_energy_L3,2  
1,010304ffffffff@i7:1,Real energy L3-consumed,Wh,Real_energy_L3_consumed,2  
1,010304ffffffff@i8:1,Real energy L3-delivered,Wh,Real_energy_L3_delivered,2   
#

```

------------------------------------------------------------------------------


### Hager EHZ363 (SML) with daily values

```

>D  
pin=0  
pout=0  
pi_d=0  
po_d=0  
hr=0  
; permanent midnight values  
p:pi_m=0  
p:po_m=0  

>B  
->sensor53 r  

>T  
; get total consumption and total feed  
pin=SML#Total_in  
pout=SML#Total_out  

>S  
; at midnight, save meter total values  
hr=hours  
if chg[hr]>0  
and hr==0  
then  
pi_m=pin  
po_m=pout  
svars  
endif  

; on teleperiod calculate current daily values from midnight  
if upsecs%tper==0  
then  
pi_d=pin-pi_m  
po_d=pout-po_m  
endif  

; show these values on WEB UI  
>W  
Tagesverbrauch: {m} %pi_d% kWh  
Tageseinspeisung: {m} %po_d% kWh    

; transmit these values with MQTT  
>J  
,"daily_consumption":%pi_d%,"daily_feed":%po_d%  

; meter definition  
>M 1  
+1,3,s,0,9600,SML  

1,77070100010800ff@1000,Total Consumed,KWh,Total_in,4  
1,77070100020800ff@1000,Total Delivered,KWh,Total_out,4  
1,77070100100700ff@1,Current Consumption,W,Power_curr,0  
1,77070100000009ff@#,Meter Number,,Meter_number,0  
#

```

------------------------------------------------------------------------------


### Iskra MT 174 (OBIS)

```

>D
>B  
->sensor53 r

>M 1  
+1,3,o,0,300,STROM,1,100,2F3F210D0A  

1,1-0:1.8.1*255(@1,Total Consumed,KWh,Total_in,3  
1,1-0:2.8.1*255(@1,Total Delivered,KWh,Total_out,3  
1,1-0:0.0.0*255(@#),Meter Number,,Meter_number,0    
#

```

### SBC ALE3 MODBUS

```

>D  
>B  
->sensor53 r  
>M 1  
+1,3,M,1,9600,SBC,1,1,02030023,02030028,0203002d,02030025,0203002a,0203002f,02030032,02030027,0203002c,02030031,02030021,02030015,02030018  

1,020304UUuu@i0:1,Spannung L1,V,Voltage_L1,0  
1,020304UUuu@i1:1,Spannung L2,V,Voltage_L2,0  
1,020304UUuu@i2:1,Spannung L3,V,Voltage_L3,0  
1,020304xxxxUUuu@i0:10,Strom L1,A,Current_L1,2  
1,020304xxxxUUuu@i1:10,Strom L2,A,Current_L2,2  
1,020304xxxxUUuu@i2:10,Strom L3,A,Current_L3,2  
1,=h=  
1,020304UUuu@i3:100,Leistung L1,kW,Power_L1,3  
1,020304UUuu@i4:100,Leistung L2,kW,Power_L2,3  
1,020304UUuu@i5:100,Leistung L3,kW,Power_L3,3  
1,020304UUuu@i6:100,Leistung Total,kW,Power_Total,3  
1,020304xxxxSSss@i3:100,BlindLeistung L1,kVAr,ReaktivePower_L1,3  
1,020304xxxxSSss@i4:100,BlindLeistung L2,kVAr,ReaktivePower_L2,3  
1,020304xxxxSSss@i5:100,BlindLeistung L3,kVAr,ReaktivePower_L3,3  
1,020304xxxxSSss@i6:100,BLeistung Total,kVAr,ReaktivePower_Total,3  
1,=h=  
1,020304UUuu@i7:100,CosPhi L1,,CosPhi_L1,2  
1,020304UUuu@i8:100,CosPhi L2,,CosPhi_L2,2  
1,020304UUuu@i9:100,CosPhi L3,,CosPhi_L3,2  
1,=h=  
1,020304UUuuUUuu@i10:100,T2 Wert,kWh,T2_Value,2  
#

```

### 2 * SBC ALE3 MODBUS

```

>D  
>B  
->sensor53 r  
>M 1  
+1,3,M,1,9600,Meter,1,1,01030023,01030028,0103002d,01030025,0103002a,0103002f,01030032,01030027,0103002c,01030031,0103001B,0103001d,03030023,03030028,0303002d,03030025,0303002a,0303002f,03030032,03030027,0303002c,03030031,0303001B,0303001d  
  
1,=h Domestic Electricity:  
1,010304UUuuUUuu@i10:100,1 Tariff 1 total,kWh,M1_T1_total,2  
1,010304UUuuUUuu@i11:100,1 Tariff 1 partial,kWh,M1_T1_par,2  
1,=h Readings:  
1,010304UUuu@i0:1,1 Voltage L1,V,M1_Voltage_L1,0  
1,010304UUuu@i1:1,1 Voltage L2,V,M1_Voltage_L2,0  
1,010304UUuu@i2:1,1 Voltage L3,V,M1_Voltage_L3,0  
1,010304xxxxUUuu@i0:10,1 Current L1,A,M1_Current_L1,2  
1,010304xxxxUUuu@i1:10,1 Current L2,A,M1_Current_L2,2  
1,010304xxxxUUuu@i2:10,1 Current L3,A,M1_Current_L3,2  
1,010304UUuu@i3:100,1 Active Power L1,kW,M1_PRMS_L1,3  
1,010304UUuu@i4:100,1 Active Power L2,kW,M1_PRMS_L2,3  
1,010304UUuu@i5:100,1 Active Power L3,kW,M1_PRMS_L3,3  
1,010304UUuu@i6:100,1 Active Power total,kW,M1_PRMS_total,3  
1,010304xxxxSSss@i3:100,1 Reactive Power L1,kVAr,M1_QRMS_L1,3  
1,010304xxxxSSss@i4:100,1 Reactive Power L2,kVAr,M1_QRMS_L2,3  
1,010304xxxxSSss@i5:100,1 Reactive Power L3,kVAr,M1_QRMS_L3,3  
1,010304xxxxSSss@i6:100,1 Reactive Power total,kVAr,M1_QRMS_total,3  
1,010304UUuu@i7:100,1 CosPhi L1,,M1_CosPhi_L1,2  
1,010304UUuu@i8:100,1 CosPhi L2,,M1_CosPhi_L2,2  
1,010304UUuu@i9:100,1 CosPhi L3,,M1_CosPhi_L3,2  
1,=h________________________________________________  
; meter 2 +12 offset  
1,=h Heat Pump  
1,030304UUuuUUuu@i22:100,2 Tariff 1 total,kWh,M2_T1_total,2  
1,030304UUuuUUuu@i23:100,2 Tariff 1 partial,kWh,M2_T1_par,2  
1,=h Readings:  
1,030304UUuu@i12:1,2 Voltage L1,V,M2_Voltage_L1,0  
1,030304UUuu@i13:1,2 Voltage L2,V,M2_Voltage_L2,0  
1,030304UUuu@i14:1,2 Voltage L3,V,M2_Voltage_L3,0  
1,030304xxxxUUuu@i12:10,2 Current L1,A,M2_Current_L1,2  
1,030304xxxxUUuu@i13:10,2 Current L2,A,M2_Current_L2,2  
1,030304xxxxUUuu@i14:10,2 Current L3,A,M2_Current_L3,2  
1,030304UUuu@i15:100,2 Active Power L1,kW,M2_PRMS_L1,3  
1,030304UUuu@i16:100,2 Active Power L2,kW,M2_PRMS_L2,3  
1,030304UUuu@i17:100,2 Active Power L3,kW,M2_PRMS_L3,3  
1,030304UUuu@i18:100,2 Active Power total,kW,M2_PRMS_total,3  
1,030304xxxxSSss@i15:100,2 Reactive Power L1,kVAr,M2_QRMS_L1,3  
1,030304xxxxSSss@i16:100,2 Reactive Power L2,kVAr,M2_QRMS_L2,3  
1,030304xxxxSSss@i16:100,2 Reactive Power L3,kVAr,M2_QRMS_L3,3  
1,030304xxxxSSss@i18:100,2 Reactive Power total,kVAr,M2_QRMS_total,3  
1,030304UUuu@i19:100,2 CosPhi L1,,M2_CosPhi_L1,2  
1,030304UUuu@i20:100,2 CosPhi L2,,M2_CosPhi_L2,2  
1,030304UUuu@i21:100,2 CosPhi L3,,M2_CosPhi_L3,2  
#  

```

### 4 * Hiking DDS238-2 ZN/S3 MODBUS

This is an example for 4 MODBUS devices on the same bus  

![94788926-930d3b00-03d4-11eb-8951-7b379c65f9ca](https://user-images.githubusercontent.com/11647075/94828106-6cb5c280-0409-11eb-9f8c-c907b56a6707.png)


![94792441-45470180-03d9-11eb-86a2-0c79506226fc](https://user-images.githubusercontent.com/11647075/94828277-95d65300-0409-11eb-9cd0-1d647179f875.png)

```

>D  
>B 
->sensor53 r
>`>M 1`  
>  
+1,3,m,1,9600,Hiking,1,10,0103000c,0103000e,0303000c,0303000e,0403000c,0403000e,0503000c,0503000e  
;---> two groups of registrers for each device --> default 2 registers returned ---> 4 values per device  
1,=h Contatore 1  
1,010304UUuu@i0:10,C1_Voltage,V,C1Voltage,1  
;---> decoder for the first registry returned for the first group  
1,010304xxxxUUuu@i0:1000,C1_Current,A,C1Current,3  
;---> decoder for the second registry returned for the first group  
1,010304SSss@i1:1,C1_ActivePower,W,C1ActivePower,0  
1,010304xxxxUUuu@i1:1,C1_ReactivePower,Var,C1ReactivePower,0  
1,=h Contatore 3  
1,030304UUuu@i2:10,C3_Voltage,V,C3Voltage,1  
1,030304xxxxUUuu@i2:1000,C3_Current,A,C3Current,3  
1,030304SSss@i3:1,C3_ActivePower,W,C3ActivePower,0  
1,030304xxxxUUuu@i3:1,C3_ReactivePower,Var,C3ReactivePower,0  
1,=h Contatore 4  
1,040304UUuu@i4:10,C4_Voltage,V,C4Voltage,1  
1,040304xxxxUUuu@i4:1000,C4_Current,A,C4Current,3  
1,040304SSss@i5:1,C4_ActivePower,W,C4ActivePower,0  
1,040304xxxxUUuu@i5:1,C4_ReactivePower,Var,C4ReactivePower,0  
1,=h Contatore 5  
1,050304UUuu@i6:10,C5_Voltage,V,C5Voltage,1  
1,050304xxxxUUuu@i6:1000,C5_Current,A,C5Current,3  
1,050304SSss@i7:1,C5_ActivePower,W,C5ActivePower,0  
1,050304xxxxUUuu@i7:1,C5_ReactivePower,Var,C5ReactivePower,0  
#  

```

### Trovis 557x

These heating regulators have a [lot of registers](https://raw.githubusercontent.com/Tom-Bom-badil/samson_trovis_557x/master/_register.py).
```
>D
>B
->sensor53 r
>M 1
+1,3,m,0,19200,Trovis,1,2,rF7030009000E,rF703001C0004,F703006A
1,F7031CUUuu@i0:10,Außentemp.,°C,Temp_Outside,1
1,F7031CxxxxxxxxxxxxUUuu@i0:10,Vorlauftemp.,°C,Temp_Flow,1
1,F7031CxxxxxxxxxxxxxxxxxxxxxxxxxxxxUUuu@i0:10,Rücklauftemp.,°C,Temp_Return,1
1,F7031CxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUUuu@i0:10,Speichertemp.,°C,Temp_Vessel,1
1,F70308UUuu@i1:1,MesswertImp-h,imp/h,Metric_ImpH,0
1,F70308xxxxUUuu@i1:100,Messwertm3-h,m³/h,Metric_M3H,2
1,F70308xxxxxxxxUUuu@i1:10,AA10-10V,V,Metric_AA10,1
1,F70308xxxxxxxxxxxxUUuu@i1:10,AA20-10V,V,Metric_AA20,1
1,F70304UUuu@i2:1,StellsignalRk1,%,CtrlSig_RK1,0
#

```

### EasyMeter Q3A / Apator APOX+ (additional data disabled / PIN locked)

A 2-Tarif Meter which for Example SWM (Stadtwerke München) uses. Unfortunately this Version sends only whole kWh (precision 0).
Apator APOX+ behaves same as the EasyMeter while pin locked, just precision 0 without additional data. After calling the energy provider they send a letter with the unlock pin. 
```
>D
>B
=>sensor53 r
>M 1
+1,3,s,0,9600,SML
1,77070100010801ff@1000,Verbrauch_Tarif_1,kWh,Total_Tarif1,0
1,77070100010802ff@1000,Verbrauch_Tarif_2,kWh,Total_Tarif2,0
1,77070100010800ff@1000,Verbrauch_Summe,kWh,Total_Summe,0
#

```
### Apator APOX+ (additional data enabled)
Energy provider supplied a PIN code to enable output of additional data.

```
>D  

>B  
->sensor53 r

>M 1  
+1,3,s,0,9600,SML
1,77070100010801ff@1000,Verbrauch_Tarif_1,kWh,Total_Tarif1,3
1,77070100010802ff@1000,Verbrauch_Tarif_2,kWh,Total_Tarif2,3
1,77070100010800ff@1000,Verbrauch_Summe,kWh,Total_Summe,3
1,77070100100700ff@1,Current consumption,W,Power_curr,3
1,=h -------------------------------  
1,770701001f0700ff@1,Current L1,A,Curr_p1,3  
1,77070100330700ff@1,Current L2,A,Curr_p2,3  
1,77070100470700ff@1,Current L3,A,Curr_p3,3  
1,=h -------------------------------  
1,77070100200700ff@1,Voltage L1,V,Volt_p1,3 
1,77070100340700ff@1,Voltage L2,V,Volt_p2,3  
1,77070100480700ff@1,Voltage L3,V,Volt_p3,3
#
```

------------------------------------------------------------------------------
