<a id="top"></a>
- [Scripting Language Example](#Scripting-Language-Example)
- [Sensor Logging](#Sensor-Logging)
- [e-Paper 29 Display with SGP30 and BME280](#e-Paper-29-Display-with-SGP30-and-BME280)
- [e-Paper 42 Display with SHT31 and BME280](#e-Paper-42-Display-with-SHT31-and-BME280)
- [ILI 9488 Color LCD Display with BMP280 and VL5310X](#ILI-9488-Color-LCD-Display-with-BMP280-and-VL5310X)
- [LED Bar Display with WS2812 LED Chain](#LED-Bar-Display-with-WS2812-LED-Chain)
- [Multiple IR Receiver Synchronization](#Multiple-IR-Receiver-Synchronization)
- [Fast Polling](#Fast-Polling)
- [Switching and Dimming By Recognizing Mains Power Frequency](#Switching-and-Dimming-By-Recognizing-Mains-Power-Frequency)
- [Web UI](#Web-UI)
- [Hue Emulation](#hue-emulation)
- [Alexa Controlled MCP230xx I<sup>2</sup>C GPIO Expander](#alexa-controlled-mcp230xx-i2c-gpio-expander)
- [Retrieve network gateway IP Address](#Retrieve-network-gateway-IP-Address)
- [Send e-mail](#Send-e-mail)

[Back To Top](#top)

------------------------------------------------------------------------------

#### Scripting Language Example
**Actually this code is too large**. This is only meant to show some of the possibilities

>**>D**  
; define all vars here  
p:mintmp=10  (p:means permanent)  
p:maxtmp=30  
t:timer1=30  (t:means countdown timer)  
t:mt=0  
i:count=0  (i:means auto counter)  
hello=&quot;hello world&quot;  
string=&quot;xxx&quot;  
url=&quot;[_IP_]&quot;  
hum=0  
temp=0  
timer=0  
dimmer=0  
sw=0  
rssi=0  
param=0
>
>col=&quot;&quot;  
ocol=&quot;&quot;  
chan1=0  
chan2=0  
chan3=0
>
>ahum=0  
atemp=0  
tcnt=0  
hour=0  
state=1  
m:med5=0  
M:movav=0  
; define array with 10 entries  
m:array=0 10

>**>B**  
string=hello+"how are you?"  
=\>print BOOT executed  
=\>print %hello%  
=\>mp3track 1
>
>; list gpio pin definitions  
for cnt 0 16 1  
tmp=pd[cnt]  
=>print %cnt% = %tmp%  
next
>
>; get gpio pin for relais 1  
tmp=pn[21]  
=>print relais 1 is on pin %tmp%
>
>; pulse relais over raw gpio  
spin(tmp 1)  
delay(100)  
spin(tmp 0)
>
>; raw pin level  
=>print level of gpio1 %pin[1]%
>
>; pulse over tasmota cmd  
=>power 1  
delay(100)  
=>power 0

>**>T**  
hum=BME280#Humidity  
temp=BME280#Temperature  
rssi=Wifi#RSSI  
string=SleepMode
>
>; add to median filter  
median=temp  
; add to moving average filter  
movav=hum
>
>; show filtered results  
=>print %median% %movav%
>
>if chg[rssi]>0  
then =>print rssi changed to %rssi%  
endif
>
>if temp\>30  
and hum\>70  
then =\>print damn hot!  
endif

>**>S**  
; every second but not completely reliable time here  
; use upsecs and uptime or best t: for reliable timers
>
>; arrays  
array[1]=4  
array[2]=5  
tmp=array[1]+array[2]
>
>; call subrountines with parameters   
=#sub1("hallo")  
=#sub2(999)
>
>; stop timer after expired  
if timer1==0  
then timer1=-1  
=>print timer1 expired  
endif
>
>; auto counter with restart  
if count>=10  
then =>print 10 seconds over  
count=0  
endif
>
>if upsecs%5==0  
then =\>print %upsecs%  (every 5 seconds)  
endif
>
>; not recommended for reliable timers  
timer+=1  
if timer\>=5  
then =\>print 5 seconds over (may be)  
timer=0  
endif
>
>dimmer+=1  
if dimmer\>100  
then dimmer=0  
endif
>
>=\>dimmer %dimmer%  
=\>WebSend %url% dimmer %dimmer%
>
>; show on display  
dp0  
=\>displaytext [c1l1f1s2p20] dimmer=%dimmer%
>
>=\>print %upsecs% %uptime% %time% %sunrise% %sunset% %tstamp%
>
>if time\>sunset  
and time< sunrise  
then  
; night time  
if pwr[1]==0  
then =\>power1 1  
endif  
else  
; day time  
if pwr[1]\>0  
then =\>power1 0  
endif  
endif
>
>; clr display on boot  
if boot\>0  
then =\>displaytext [z]  
endif
>
>; frost warning  
if temp<0  
and mt<=0  
then =#sendmail("frost alert")  
; alarm only every 5 minutes  
mt=300  
=>mp3track 2  
endif
>
>; var has been updated  
if upd[hello]>0  
then =>print %hello%  
endif
>
>; send to Thingspeak every 60 seconds  
; average data in between  
if upsecs%60==0   
then  
ahum/=tcnt  
atemp/=tcnt  
=>WebSend [_IP_]/update?key=_token_&field1=%atemp%&field2=%ahum%  
tcnt=0  
atemp=0  
ahum=0   
else  
ahum+=hum  
atemp+=temp  
tcnt+=1  
endif
>
>hour=int(time/60)  
if chg[hour]>0  
then  
; exactly every hour  
=>print full hour reached  
endif
>
>if time>5 {  
=>print more then 5 minutes after midnight   
} else {  
=>print less then 5 minutes after midnight  
}
>
>; publish abs hum every teleperiod time  
if mqtts>0  
and upsecs%tper==0  
then  
; calc abs humidity  
tmp=pow(2.718281828 (17.67\*temp)/(temp+243.5))  
tmp=(6.112\*tmp\*hum\*18.01534)/((273.15+temp)\*8.31447215)  
; publish median filtered value  
=>Publish tele/%topic%/SENSOR {"Script":{"abshum":%med(0 tmp)%}}  
endif
>
>;switch case state machine   
switch state  
case 1  
=>print state=%state% , start  
state+=1  
case 2  
=>print state=%state%  
state+=1  
case 3  
=>print state=%state%  , reset  
state=1  
ends
>
>; subroutines  
\#sub1(string)  
=>print sub1: %string%  
\#sub2(param)  
=>print sub2: %param%
>
>\#sendmail(string)  
=>sendmail [smtp.gmail.com:465:user:passwd:<sender@gmail.de>:<rec@gmail.de>:alarm] %string%

>**>E**  
=\>print event executed!
>
>; get HSBColor 1. component  
tmp=st(HSBColor , 1)
>
>; check if switch changed state  
sw=sw[1]  
if chg[sw]>0  
then =\>power1 %sw%  
endif
>
>hello=&quot;event occured&quot;
>
>; check for Color change (Color is a string)  
col=Color  
; color change needs 2 string vars  
if col!=ocol  
then ocol=col  
=>print color changed  %col%  
endif
>
>; or check change of color channels  
chan1=Channel[1]  
chan2=Channel[2]  
chan3=Channel[3]
>
>if chg[chan1]>0  
or chg[chan2]>0  
or chg[chan3]>0  
then => color has changed  
endif
>
>; compose color string for red  
col=hn(255)+hn(0)+hn(0)  
=>color %col%

>**>R**  
=\>print restarting now

[Back To Top](#top)

------------------------------------------------------------------------------

#### Sensor Logging
>; define all vars here  
; reserve large strings  
**>D 48**  
hum=0  
temp=0  
fr=0  
res=0  
; moving average for 60 seconds  
M:mhum=0 60  
M:mtemp=0 60  
str=""

>**>B**  
; set sensor file download link   
fl1("slog.txt")  
; delete file in case we want to start fresh  
;fd("slog.txt")
>
>; list all files in root directory  
fr=fo("/" 0)  
for cnt 1 20 1  
res=fr(str fr)  
if res>0  
then  
=>print %cnt% : %str%  
else  
break  
endif  
next  
fc(fr)

>**>T**  
; get sensor values  
temp=BME280#Temperature  
hum=BME280#Humidity

>**>S**  
; average sensor values every second  
mhum=hum  
mtemp=temp
>
>; write average to sensor log every minute  
if upsecs%60==0  
then  
; open file for write  
fr=fo("slog.txt" 1)  
; compose string for tab delimited file entry  
str=s(upsecs)+"\t"+s(mhum)+"\t"+s(mtemp)+"\n"  
; write string to log file  
res=fw(str fr)  
; close file  
fc(fr)  
endif

>**>R**  

[Back To Top](#top)

------------------------------------------------------------------------------

#### e-Paper 29 Display with SGP30 and BME280
Some variables are set from ioBroker  

>**>D**  
hum=0  
temp=0  
press=0  
ahum=0  
tvoc=0  
eco2=0  
zwz=0  
wr1=0  
wr2=0  
wr3=0  
otmp=0  
pwl=0  
tmp=0  
; DisplayText substituted to save script space
DT="DisplayText"  
; preset units in case they are not available   
punit="hPa"  
tunit="C"

>**>B**  
;reset auto draw  
=>%DT% [zD0]  
;clr display and draw a frame  
=>%DT% [x0y20h296x0y40h296]

>**>T**  
; get telemetry sensor values  
temp=BME280#Temperature  
hum=BME280#Humidity  
press=BME280#Pressure  
tvoc=SGP30#TVOC  
eco2=SGP30#eCO2  
ahum=SGP30#aHumidity  
tunit=TempUnit  
punit=PressureUnit

>**>S**  
// update display every [`TelePeriod`](Commands#teleperiod)  
if upsecs%tper==0  
then  
dp2  
=>%DT% [f1p7x0y5]%temp% %tunit%  
=>%DT% [p5x70y5]%hum% %%[x250y5t]   
=>%DT% [p11x140y5]%press% %punit%  
=>%DT% [p10x30y25]TVOC: %tvoc% ppb  
=>%DT% [p10x160y25]eCO2: %eco2% ppm  
=>%DT% [p10c26l5]ahum: %ahum% g^m3
>
>dp0  
=>%DT% [p25c1l5]WR 1 (Dach)  : %wr1% W  
=>%DT% [p25c1l6]WR 2 (Garage): %-wr3% W  
=>%DT% [p25c1l7]WR 3 (Garten): %-wr2% W  
=>%DT% [p25c1l8]Aussentemperatur: %otmp% C  
=>%DT% [x170y95r120:30f2p6x185y100] %pwl% %%  
; now update screen  
=>%DT% [d]  
endif

>**>E**  

>**>R**  

[Back To Top](#top)

------------------------------------------------------------------------------

#### e-Paper 42 Display with SHT31 and BME280
This script shows 2 graphs on an 4.2 inch e-Paper display: 1. some local sensors, and 2. power statistics  
- The first graph is the battery level of a solar battery (Tesla PowerWall 2)  
- The second graph shows the solar yield of the roof panels in Watts  
- Another special feature is that this script displays daily and weekly averages (via moving average) of all power IO of the house.  
- Since the display is a full update panel it is updated only once a minute  
- Some values (like power meters) are set remotely from ioBroker  

>**>D**  
hum=0  
temp=0  
press=0  
zwz=0  
wr1=0  
wr2=0  
wr3=0  
otmp=0  
pwl=0  
ez1=0  
sez1=0  
M:mez1=0 7  
ezh=0  
sezh=0  
M:mezh=0 7  
vzh=0  
svzh=0  
M:mvzh=0 7  
>  
>hr=0  
t1=0  
; DisplayText substituted to save script space
DT="DisplayText"  
  
>**>B**  
=>%DT% [IzD0]  
=>%DT% [zG10352:5:40:-350:80:10080:0:100f3x360y40]100 %%[x360y115]0 %%  
=>%DT% [f1x100y25]Powerwall - 7 Tage[f1x360y75] 0 %%  
=>%DT% [G10353:5:140:-350:80:10080:0:5000f3x360y140]+5000 W[x360y215]0 W  
=>%DT% [f1x70y125]Volleinspeisung - 7 Tage[f1x360y180] 0 W  
=>%DT% [p13x10y230]WR 1,2,3:  
=>%DT% [p13x10y245]H-Einsp.:  
=>%DT% [p13x10y260]H-Verbr.:  
=>%DT% [p13x10y275]D-Einsp.:  
=>%DT% [d]  
  
>**>T**  
press=BMP280#Pressure  
temp=SHT3X_0x44#Temperature  
hum=SHT3X_0x44#Humidity  
  
>**>S**  
if upsecs%60==0  
then  
dp2  
=>%DT% [f1p7x0y5]%temp% C  
=>%DT% [x0y20h400x250y5T][x350t][f1p10x70y5]%hum% %%  
=>%DT% [p10x140y5]%press% hPa  
dp0  
=>%DT% [p5x360y75]%pwl% %%  
=>%DT% [p6x360y180]%wr1%W  
=>%DT% [g0:%pwl%g1:%wr1%]  
>  
>=>%DT% [p24x75y230] %wr1% W : %-wr2% W : %-wr3% W  
=>%DT% [p-10x75y245]%ezh% kWh  
=>%DT% [p-10x75y260]%vzh% kWh  
=>%DT% [p-10x75y275]%ez1% kWh  
>  
>t1=mezh*7  
=>%DT% [p-10x150y245]: %t1% kWh  
t1=mvzh*7  
=>%DT% [p-10x150y260]: %t1% kWh  
t1=mez1*7  
=>%DT% [p-10x150y275]: %t1% kWh  
>  
>dp1 
t1=ezh-sezh  
=>%DT% [p12x250y245]: %t1% kWh  
t1=vzh-svzh  
=>%DT% [p12x250y260]: %t1% kWh  
t1=ez1-sez1  
=>%DT% [p12x250y275]: %t1% kWh 
>  
>dp0  
=>%DT% [f2p5x320y250] %otmp%C  
>  
>=>%DT% [d]  
endif  
>  
>hr=hours  
if chg[hr]>0  
and hr==0  
then  
mez1=ez1-sez1  
sez1=ez1  
mezh=ezh-sezh  
sezh=ezh  
mvzh=vzh-svzh  
svzh=vzh  
endif  
>  
>if sezh==0  
then  
sez1=ez1  
sezh=ezh  
svzh=vzh  
endif  
    
[Back To Top](#top)

------------------------------------------------------------------------------

#### ILI 9488 Color LCD Display with BMP280 and VL5310X
Shows various BMP280 energy graphs  
Turn display on and off using VL5310X proximity sensor to prevent burn-in

Some variables are set from ioBroker

>**>D**  
temp=0  
press=0  
zwz=0  
wr1=0  
wr2=0  
wr3=0  
otmp=0  
pwl=0  
tmp=0  
dist=0  
; DisplayText substituted to save script space
DT="DisplayText"  
punit="hPa"  
tunit="C"  
hour=0

>**>B**  
=>%DT% [z]
>
>// define 2 graphs, 2. has 3 tracks  
=>%DT% [zCi1G2656:5:20:400:80:1440:-5000:5000:3Ci7f3x410y20]+5000 W[x410y95]-5000 W [Ci7f1x70y3] Zweirichtungsz~80hler - 24 Stunden  
=>%DT%  [Ci1G2657:5:120:400:80:1440:0:5000:3Ci7f3x410y120]+5000 W[x410y195]0 W [Ci7f1x70y103] Wechselrichter 1-3 - 24 Stunden  
=>%DT% [Ci1G2658:5:120:400:80:1440:0:5000:16][Ci1G2659:5:120:400:80:1440:0:5000:5]  
=>%DT% [f1s1b0:260:260:100&#8203;:50:2:11:4:2:Rel 1:b1:370:260:100&#8203;:50:2:11:4:2:Dsp off:]  
=>mp3volume 100  
=>mp3track 4

>**>T**  
; get some telemetry values  
temp=BMP280#Temperature  
press=BMP280#Pressure  
tunit=TempUnit  
punit=PressureUnit  
dist=VL53L0X#Distance
>
>; check proximity sensor to turn display on and off to prevent burn-in  
if dist>300  
then  
if pwr[2]>0  
then  
=>power2 0  
endif  
else  
if pwr[2]==0  
then  
=>power2 1  
endif  
endif

>**>S**  
; update graph every teleperiod  
if upsecs%tper==0  
then  
dp2  
=>%DT% [f1Ci3x40y260w30Ci1]  
=>%DT% [Ci7x120y220t]  
=>%DT% [Ci7x180y220T]  
=>%DT% [Ci7p8x120y240]%temp% %tunit%   
=>%DT% [Ci7x120y260]%press% %punit%  
=>%DT% [Ci7x120y280]%dist% mm  
dp0  
=>%DT% [g0:%zwz%g1:%wr1%g2:%-wr2%g3:%-wr3%]  
if zwz>0  
then  
=>%DT% [p-8x410y55Ci2Bi0]%zwz% W  
else  
=>%DT% [p-8x410y55Ci3Bi0]%zwz% W  
endif  
=>%DT% [p-8x410y140Ci3Bi0]%wr1% W  
=>%DT% [p-8x410y155Ci16Bi0]%-wr2% W  
=>%DT% [p-8x410y170Ci5Bi0]%-wr3% W  
endif
>
>; chime every full hour  
hour=int(time/60)  
if chg[hour]>0  
then =>mp3track 4  
endif

>**>E**  

>**>R**  

[Back To Top](#top)

------------------------------------------------------------------------------

#### LED Bar Display with WS2812 LED Chain
Used to display home's solar power input/output (+-5000 Watts)

>**>D**  
m:array=0 60 ;defines array for 60 led pixels  
cnt=0  
val=0  
ind=0  
; rgb values for grid  
colr1=0x050000  
colr2=0x050100  
colg1=0x000300  
colg2=0x020300  
ledbar=0  
blue=64  
pixels=60  
steps=10  
div=0  
tog=0  
max=5000  
min=-5000  
pos=0

>**>B**  
div=pixels/steps  
=#prep  
ws2812(array)
>
>; ledbar is set from broker  

>**>S**  
if ledbar<min  
then ledbar=min  
endif
>
>if ledbar>max  
then ledbar=max  
endif
>
>pos=(ledbar/max)*(pixels/2)  
if ledbar>0  
then  
pos+=(pixels/2)  
if pos>pixels-1  
then pos=pixels  
endif  
else  
pos+=(pixels/2)+1  
if pos>pixels-1  
then pos=1  
endif  
endif
>
>if pos<1  
or pos>pixels  
then pos=1  
endif
>
>=#prep
>
>if ledbar==0  
then  
array[pos]=blue  
array[pos-1]=blue  
else  
array[pos]=blue  
endif
>
>; only used if power is off  
; so lets may be used normally if on  
if pwr[1]==0  
then  
ws2812(array)  
endif
>
>; subroutine for grid  
#prep  
for cnt 1 pixels 1  
ind+=1  
if ind>div  
then ind=1  
tog^=1  
endif
>
>if cnt<=pixels/2  
then  
if tog>0  
then val=colr1  
else val=colr2  
endif  
else  
if tog>0  
then val=colg1  
else val=colg2  
endif  
endif  
array[cnt]=val  
next

>**>R**  

[Back To Top](#top)

------------------------------------------------------------------------------

#### Multiple IR Receiver Synchronization
Shows how a Magic Home with IR receiver works  
Synchronizes 2 Magic Home devices by also sending the commands to a second Magic Home via [`WebSend`](Commands#websend)

**Script example using `if then else`**  
>; expand default string length to be able to hold `WebSend [xxx.xxx.xxx.xxx]`  
**>D 25**  
istr=""  
ws="WebSend [_IP_]"

>; event section  
**>E**  
; get ir data  
istr=IrReceived#Data
>
>; on  
if istr=="0x00F7C03F"  
then  
=>wakeup  
=>%ws% wakeup  
endif
>
>; off  
if istr=="0x00F740BF"  
then  
=>power1 0  
=>%ws% power1 0  
endif
>
>;white  
if istr=="0x00F7E01F"  
then  
=>color 000000ff  
=>%ws% color 000000ff  
endif
>
>;red  
if istr=="0x00F720DF"  
then  
=>color ff000000  
=>%ws% color ff000000  
endif
>
>;green  
if istr=="0x00F7A05F"  
then  
=>color 00ff0000  
=>%ws% color 00ff0000  
endif
>
>;blue  
if istr=="0x00F7609F"  
then  
=>color 0000ff00  
=>%ws% color 0000ff00  
endif
>
>; dimmer up  
if istr=="0x00F700FF"  
then  
=>dimmer +  
=>%ws% dimmer +  
endif
>
>;dimmer down  
if istr=="0x00F7807F"  
then  
=>dimmer -  
=>%ws% dimmer -  
endif
>
>istr=""

**Script example using `switch case ends`**  
>; expand default string length to be able to hold `WebSend [xxx.xxx.xxx.xxx]`  
**>D** 25  
istr=""  
ws="WebSend [_IP_]"  

>; event section  
**>E**  
; get ir data  
istr=IrReceived#Data  
>
>switch istr  
; on  
case "0x00F7C03F"  
=>wakeup  
=>%ws% wakeup  
>
>;off  
case "0x00F740BF"  
=>power1 0  
=>%ws% power1 0  
>
>;white  
case "0x00F7E01F"  
=>color 000000ff  
=>%ws% color 000000ff  
>
>;red  
case "0x00F720DF"  
=>color ff000000  
=>%ws% color ff000000  
>
>;green  
case "0x00F7A05F"  
=>color 00ff0000  
=>%ws% color 00ff0000  
>
>;blue  
case "0x00F7609F"  
=>color 0000ff00  
=>%ws% color 0000ff00  
>
>; dimmer up  
case "0x00F700FF"  
=>dimmer +  
=>%ws% dimmer +  
>
>; dimmer down  
case "0x00F7807F"  
=>dimmer -  
=>%ws% dimmer -  
ends  
>
>istr=""  

[Back To Top](#top)

------------------------------------------------------------------------------

#### Fast Polling

>; expand default string length to be able to hold `WebSend [xxx.xxx.xxx.xxx]`  
**>D 25**  
sw=0  
ws="WebSend [_IP_]"  
timer=0  
hold=0  
toggle=0

>**>B**  
; gpio 5 button input  
spinm(5,0)

>; fast section 100ms  
**>F**  
sw=pin[5]  
; 100 ms timer  
timer+=1
>
>; 3 seconds long press  
; below 0,5 short press  
if sw==0  
and timer>5  
and timer<30  
then  
; short press  
;=>print short press  
toggle^=1  
=>%ws% power1 %toggle%  
endif
>
>if sw>0  
then  
;pressed  
if timer>30  
then  
; hold  
hold=1  
;=>print hold=%timer%  
if toggle>0  
then  
=>%ws% dimmer +  
else  
=>%ws% dimmer -  
endif  
endif  
else  
timer=0  
hold=0  
endif

[Back To Top](#top)

------------------------------------------------------------------------------

#### Switching and Dimming By Recognizing Mains Power Frequency
Switching in Tasmota is usually done by High/Low (+3.3V/GND) changes on a GPIO. However, for devices like the [Moes QS-WiFi-D01 Dimmer](https://blakadder.github.io/templates/qs-wifi_D01_dimmer.html), this is achieved by a pulse frequency when connected to the GPIO, and these pulses are captured by `Counter1` in Tasmota.
![pushbutton-input](https://user-images.githubusercontent.com/36734573/61955930-5d90e480-afbc-11e9-8d7e-00ac526874d3.png)

- When the **light is OFF** and there is a **short period** of pulses **->** then turn the light **ON** at the previous dimmer level.
- When the **light is ON** and there is a **short period** of pulses **->** then turn the light **OFF**.
- When there is a longer period of pulses (i.e., **HOLD**) **->** toggle dimming direction and then adjust the brightness level as long as the button is pressed or until the limits are reached.

[#6085 (comment)](https://github.com/arendst/Tasmota/issues/6085#issuecomment-512353010)

In the Data Section >D at the beginning of the Script the following initialization variables may be changed:
- dim multiplier - 0..2.55 set the dimming increment value
- dim lower limit - range for the dimmer value for push-button operation (set according to your bulb); min 0
- dim upper limit - range for the dimmer value for push-button operation (set according to your bulb); max 100
- start dim level - initial dimmer level after power-up or restart; max 100

>**>D**  
sw=0  
tmp=0  
cnt=0  
tmr=0  
hold=0  
powert=0  
slider=0  
dim=""  
shortprl=2 ;short press lo limit  
shortpru=10;short press up limit  
dimdir=0   ;dim direction 0/1  
dimstp=2   ;dim step/speed 1 to 5  
dimmlp=2.2 ;dim multiplier  
dimll=15   ;dim lower limit  
dimul=95   ;dim upper limit  
dimval=70  ;start dim level  
  
>**>B**  
=>print "WiFi-Dimmer-Script-v0.2"  
=>Counter1 0  
=>Baudrate 9600  
; boot sequence  
=#senddim(dimval)  
delay(1000)  
=#senddim(0)  
  
>**>F**  
cnt=pc[1]  
if chg[cnt]>0  
; sw pressed  
then sw=1  
else sw=0  
; sw not pressed  
endif  
>
>; 100ms timer  
tmr+=1  
>
>
>; short press  
if sw==0  
and tmr>shortprl  
and tmr<shortpru  
then  
powert^=1  
>
>; change light on/off  
if powert==1  
then  
=#senddim(dimval)  
else  
=#senddim(0)  
endif  
endif  
>
>
>; long press  
if sw>0  
then  
if hold==0  
then  
>
>; change dim direction  
dimdir^=1  
endif  
if tmr>shortpru  
then  
hold=1  
if powert>0  
>
>; dim when on & hold  
then  
if dimdir>0  
then  
>
>; increase dim level  
dimval+=dimstp  
if dimval>dimul  
then  
>
>; upper limit  
dimval=dimul  
endif  
=#senddim(dimval)  
else  
>
>; decrease dim level  
dimval-=dimstp  
if dimval<dimll  
then  
>
>; lower limit  
dimval=dimll  
endif  
=#senddim(dimval)  
endif  
endif  
endif  
else  
tmr=0  
hold=0  
endif  
  
>**>E**  
slider=Dimmer  
>
>; slider change  
if chg[slider]>0  
then  
>
>; dim according slider  
if slider>0  
then  
dimval=slider  
=#senddim(dimval)  
else  
powert=0  
=#senddim(0)  
endif  
endif  
>
>if pwr[1]==1  
; on/off webui  
then  
powert=1  
=#senddim(dimval)  
else  
powert=0  
=#senddim(0)  
endif  

>; subroutine dim  
#senddim(tmp)  
dim="FF55"+hn(tmp*dimmlp)+"05DC0A"  
=>SerialSend5 %dim%  
=>Dimmer %tmp%  
\#  

[Back To Top](#top)

------------------------------------------------------------------------------  

#### Web UI
An example to show how to implement a web UI. This example controls a light via `WebSend`  

>**>D**  
dimmer=0  
sw=0  
color=""  
col1=""  
red=0  
green=0  
blue=0  
ww=0  

>**>F**  
color=hn(red)+hn(green)+hn(blue)+hn(ww)  
if color!=col1  
then  
col1=color  
=>websend [192.168.178.75] color %color%  
endif  
>
>if chg[dimmer]>0  
then  
=>websend [192.168.178.75] dimmer %dimmer%  
endif  
>
>if chg[sw]>0  
then  
=>websend [192.168.178.75] power1 %sw%  
endif  

>**>W**  
bu(sw "Light on" "Light off")  
ck(sw "Light on/off   ")  
sl(0 100 dimmer "0" "Dimmer" "100")  
sl(0 255 red "0" "red" "255")  
sl(0 255 green "0" "green" "255")  
sl(0 255 blue "0" "blue" "255")  
sl(0 255 ww "0" "warm white" "255")  
tx(color "color:   ")  

[Back To Top](#top)

------------------------------------------------------------------------------ 
#### Hue Emulation
An example to show how to respond to Alexa requests via Hue Emulation

When Alexa sends on/off, dimmer, and color (via hsb), send commands to a MagicHome device

>**>D**  
pwr1=0  
hue1=0  
sat1=0  
bri1=0  
tmp=0  
  
>**>E**  
if upd[hue1]>0  
or upd[sat1]>0  
or upd[bri1]>0  
then  
tmp=hue1/182  
->websend [192.168.178.84] hsbcolor %tmp%,%sat1%,%bri1%  
endif  
>
>if upd[pwr1]>0  
then  
->websend [192.168.178.84] power1 %pwr1%  
endif  
  
>**>H**  
; on,hue,sat,bri,ct  
livingroom,E,on=pwr1,hue=hue1,sat=sat1,bri=bri1  

[Back To Top](#top)

------------------------------------------------------------------------------ 

#### Alexa Controlled MCP230xx I<sup>2</sup>C GPIO Expander
Uses Tasmota's Hue Emulation capabilities for Alexa interface

>; define vars  
**>D**  
p:p1=0  
p:p2=0  
p:p3=0  
p:p4=0  
  
>; init ports  
**>B**  
->sensor29 0,5,0  
->sensor29 1,5,0  
->sensor29 2,5,0  
->sensor29 3,5,0  
->sensor29 0,%0p1%  
->sensor29 1,%0p2%  
->sensor29 2,%0p3%  
->sensor29 3,%0p4%  
  
>; define Alexa virtual devices  
**>H**  
port1,S,on=p1  
port2,S,on=p2  
port3,S,on=p3  
port4,S,on=p4  
  
>; handle events  
**>E**  
print EVENT  
>  
>if upd[p1]>0  
then  
->sensor29 0,%0p1%  
endif  
if upd[p2]>0  
then  
->sensor29 1,%0p2%  
endif  
if upd[p3]>0  
then  
->sensor29 2,%0p3%  
endif  
if upd[p4]>0  
then  
->sensor29 3,%0p4%  
endif  
>  
>=#pub  
  
>; publish routine  
#pub  
=>publish stat/%topic%/RESULT {"MCP23XX":{"p1":%0p1%,"p2":%0p2%,"p3":%0p3%,"p4":%0p4%}}  
svars  
  
>; web interface  
**>W**  
bu(p1 "p1 on" "p1 off")bu(p2 "p2 on" "p2 off")bu(p3 "p3 on" "p3 off")bu(p4 "p4 on" "p4 off")  

[Back To Top](#top)

------------------------------------------------------------------------------ 
#### Retrieve network gateway IP Address

>**>D**  
gw=""  

>; Request Status information. The response will trigger the `>U` section  
**>B**  
+>status 5  

>; Read the status JSON payload  
**>U**  
gw=StatusNET#Gateway  
print %gw%  

[Back To Top](#top)

------------------------------------------------------------------------------ 
#### Send e-mail
>**>D 25**  
day1=0  
et=0  
to="mrx@gmail.com"

>**>T**  
et=ENERGY#Total  

>**>S**  
; send at midnight  
day1=day  
if chg[day1]>0  
then  
=>sendmail [\*:\*:\*:\*:\*:\%to\%:energy report]\*  
endif  

>**>m**  
email report at %tstamp%  
your power consumption today was %et% KWh  
\#  

[Back To Top](#top)

------------------------------------------------------------------------------ 
