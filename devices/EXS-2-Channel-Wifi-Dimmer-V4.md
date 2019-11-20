## Disclaimer
:warning: **DANGER OF ELECTROCUTION** :warning:

:warning: You must de-solder ESP8266 pins from the PCB in order to flash Tasmota!<br>
:warning: **You can't flash Tasmota over firmware from ex-store.de**

At the moment I can see no way to flash minimal.bin over the original firmware.

:warning: **How flash on assembled PCB** :warning:

Line TX and RX is directly wired from the dimmer to the MCU. Cut this 2 lines. For example desolder pin2 and pin3 from MCU.<br> Solder cable on GPIO0, TX, RX (ESP8266) VCC and GND (See description on pcb). Connect cables with your USB adapter.<br> Before you flash firmware connect the module with 230V (Solderpads "230V IN" and "NULL") since some USB adapters do not have enough power.

***

:warning: Das Modul sollte nur geflasht werden wenn es sich nicht auf der Leiterplatte befindet!<br>
:warning: **Die Firmware "Tasmota" kann nicht über die Firmware von ex-store.de geflasht werden (OTA)**

Versuchen Sie es trotzdem ist das Modul unbrauchbar und muss ausgebaut werden und neu geflasht werden.

:warning: **Aufspielen der Tasmota Firmware mit dem Modul auf der Platine** :warning:

Die Leitungen TX und RX sind direkt mit der Dimm-MCU verdrahtet. Diese Leitungen müssen getrennt werden. Zum Beispiel Pin2 und Pin3 von der MCU ablöten (hochbiegen). Löten Sie Kabel an GPIO0, TX, RX (ESP8266), VCC und GND (siehe Beschreibung auf der Platine). Verbinden Sie diese Kabel mit Ihrem USB Adapter.<br>
Bevor Sie die Firmware flashen, muss das Modul mit 230V (Lötpads "230V IN" und "NULL") verbunden werden. Einige USB-Adapter haben nicht genügend Strom um die Platine zu versorgen.

[
**230V sind für Lebewesen Lebensgefährlich. Ein Stromschlag kann unter anderem Ihren Herzrythmus stören und zum Tode führen. Dessen sollten Sie sich bewust sein wenn Sie an diesem Modul arbeiten.**](https://de.wikipedia.org/wiki/Stromunfall)

## Schematic

![](https://ex-store.de/media/image/product/222/lg/2-kanal-rs232-wifi-wlan-dimmer-modul-v4-fuer-unterputzmontage-230v-3a~3.png)  

## Menu

![](https://pi-gate.net/images/menu.png)  

# Example setup with DHT22
DHT wiring<br> 
VCC       - header VCC<br> 
Ground    - header GND<br> 
Data line - to GPIO14

![](https://pi-gate.net/images/V4_setup.png)  

