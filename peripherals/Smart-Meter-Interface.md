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

**Note:** If no `>M` section is found in the script or if the scripting language is not compiled, the driver reverts to the default `#define` definition(s).  
  
## Descriptor Syntax
This section must be present, but empty  
> `>D`  

Declare a script `>B` (boot) section to inform the interface to read the meter descriptor(s)
> `>B`  
=>[sensor53](Commands#sensor53) r

Declare a script `>M` section with the number of connected meters (n = `1..5`)
> `>M <n>`  

### Meter Declaration
`+<M>,<rxGPIO>,<type>,<flag>,<parameter>,<jsonPrefix>{,<txGPIO>,<txPeriod>,<cmdTelegram>}`  

- `<M>` - meter number  
- `<rxGPIO>` - meter data receive GPIO  
- `<type>` - meter type of meter  
  - `o` = OBIS ASCII type of coding  
  - `s` = SML binary smart message coding  
  - `c` = Counter type  
  - `e` = EBus binary coding  
  - `m` = MODBus binary coding  
  - `r` = Raw binary coding (any binary telegram)  
- `<flag>` - options flag  
  - `0` = counter without pullup  
  - `1` = counter with pullup   
  - `16` = enable median filter for that meter (not available for counters)     
- `<parameter>` - parameters according to meter type  
  - for `o,s,e,m,r`: serial baud rate  
  - for `c`:  
    - positive value = counter poll interval  
    - negative value = debounce time (milliseconds) for irq driven counters  
- `<jsonPrefix>` - prefix for Web UI and MQTT JSON payload. Up to 7 characters  
- `<txGPIO>` - meter command transmit GPIO  
- `<txPeriod>` - number of 250ms increments. Period to repeat the transmission of commands to the meter  
- `<cmdTelegram>` - comma separated hex coded byte blocks to send to meter device. For modbus each block is a command to retrieve a certain register from the meter  

Examples:  
`+1,3,o,0,9600,OBIS`  
`+1,3,m,0,9600,MODBUS,1,1,01040000,01040002,01040004,01040006,01040008,0104000a,0104000c,0104000e,01040010`  

### Meter Metrics
Each meter typically provides multiple metrics (voltage, power, humidity, etc.) which it measures. An entry for each metric to be collected `#define MAX_VARS N` (n = `1..16`) must be specified. An entry defines how to decode the data and put it into variables.

`<M>,<decoder>@<scale>,<label>,<UoM>,<var>,<precision>`  
- `<M>` - meter number to which this decoder belongs  
- `<decoder>` - decoding specification. Decode OBIS as ASCII; SML, EBUS, RAW as HEX ASCII
  - OBIS: ASCII OBIS code terminated with `(` character which indicates the start of the meter value  
  - SML: SML binary OBIS as hex terminated with `0xFF` indicating start of SML encoded value  
  - EBUS,RAW: hex values of EBUS,RAW block to compare  
    - `xx` means ignore value  
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
    - decoding a 0/1 bit is indicated by a `@` character followed by `bx:` (x = `0..7`) extracting the corresponding bit from a byte.  
      e.g., 1,xxxx5017xxuu@b0:1,Solarpump,,Solarpump,0  
    - in the case of MODBus, `ix:` designates the index (x = `0..n`) referring to the requested block in the transmit section of the meter definition
      e.g., 1,010404ffffffffxxxx@i0:1,Voltage P1,V,Voltage_P1,2  
- `@` decoding definition termination character  
- `<scale>` - scaling factor (divisor)  
  This can be a fraction (e.g., 0.1 => result * 10), or a negative value  
  When decoding a string result (e.g., a serial meter), use `#` character for this parameter (only in one line per meter). For OBIS, you need a `)` termination character after the `#` character  
- `<label>` - web UI label (max 23 chars)  
- `<UoM>` - unit of measure (max 7 chars)  
- `<var>` - MQTT variable name (max 23 chars)  
- `<precision>` - number of decimal places  
  Add 16 to transmit the data immediately. Otherwise it is transmitted on [`TelePeriod`](Commands#teleperiod)  

e.g., `1,1-0:1.8.0*255(@1,consumption,KWh,Total_in,4`

`#` character terminates the list  

**Special Commands**

with the '=' char at the beginning of a line you may do some special decoding  

- `M,=m` perform arithmetic (`+,-,*,/`) on the metric. Use `#` before a number to designate a constant value  
  example:  
  `1,=m 3+4+5/#3` add result of decoder entry 3,4,5 and divided by 3 (i.e., average)  
- `M,=d` calculate difference between metric values decoded at time intervals  
  example:  
  `1,=d 3 10` calculate 10 second interval difference of decoder entry 3  
- `M,=h` html text (up to 30 chars)  
  inserts a html line between entries (these lines do not count as decoder entry)  
  example:  
  `2,=h==================` insert a separator line  

## Smart Meter Descriptors
- [Hager EHZ363 (SML)](#Hager-EHZ363-SML)
- [Hager EHZ161 (OBIS)](#Hager-EHZ161-OBIS)
- [COMBO Meter (Water,Gas,SML)](#COMBO-Meter-WaterGasSML)
- [WOLF CSZ 11/300 Heater](#WOLF-CSZ-11300-Heater)
- [SDM530 (MODBUS)](#SDM530)
- [Janitza B23 (MODBUS)](#Janitza-B23)
- [Hager EHZ363 (SML) with daily values](#Hager-EHZ363-SML-with-daily-values)
- [Iskra MT 174](#Iskra-MT-174)
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
1,010404ffffffffxxxx@i6:1,active Power P1,W,Power_P1,2  
1,010404ffffffffxxxx@i7:1,active Power P2,W,Power_P2,2  
1,010404ffffffffxxxx@i8:1,actibe Power P3,W,Power_P3,2  
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
2,1-0:1.8.0*255(@100,Zählerstand,cbm,Count,3  
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


### Iskra MT 174

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

------------------------------------------------------------------------------
