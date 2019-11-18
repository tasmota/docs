<a id="top"></a>
- [Hager EHZ363 (SML)](#Hager-EHZ363-SML)
- [Hager EHZ161 (OBIS)](#Hager-EHZ161-OBIS)
- [COMBO Meter (Water,Gas,SML)](#COMBO-Meter-WaterGasSML)
- [WOLF CSZ 11/300 Heater](#WOLF-CSZ-11300-Heater)
- [SDM530 (MODBUS)](#SDM530)
- [Janitza B23 (MODBUS)](#Janitza-B23)
- [Hager EHZ363 (SML) with daily values](#Hager-EHZ363-SML-with-daily-values)
------------------------------------------------------------------------------

#### Hager EHZ363 (SML)

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

#### Hager EHZ161 (OBIS)

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

#### COMBO Meter (Water,Gas,SML)

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

#### WOLF CSZ 11/300 Heater

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

#### MODBUS Device
#### SDM530

>`>D`  

>`>B`  
=>sensor53 r

>`>M 1` 
 
+1,3,m,0,9600,MODBUS,1,1,01040000,01040002,01040004,01040006,01040008,0104000a,0104000c,0104000e,01040010  
 
1,010404ffffffffxxxx@i0:1,Voltage P1,V,Voltage_P1,2  
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


#### Janitza B23

>`>D`

>`>B`

=>sensor53 r

>`>M 1` 
> 
+1,3,m,0,9600,Janiza,1,1,01034A38,01034A3A,01034A3C,01034A4C,01034A4E,01034A50,01034A72,01034A7A,01034A82
>
1,010304ffffffffxxxx@i0:1,Voltage L1-N,V,Voltage_L1-N,2
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


#### Hager EHZ363 (SML) with daily values

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
; on midnight, save meter total values  
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
>1,77070100010800ff@1000,Verbrauch,KWh,Total_in,4  
1,77070100020800ff@1000,Einspeisung,KWh,Total_out,4  
1,77070100100700ff@1,Aktueller Verbrauch,W,Power_curr,0  
1,77070100000009ff@#,Zähler Nr,,Meter_number,0  
\#

[Back To Top](#top)

------------------------------------------------------------------------------