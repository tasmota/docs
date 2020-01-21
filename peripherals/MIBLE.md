# Experimental BLE-Bridge for certain Mijia-Bluetooth-Sensor using the NRF24L01(+)

## NRF24l01(+) and Bluetooth
  
This chip is manufactured by Nordic Semiconductors as a single chip transceiver in the 2,4 GHz band. There are many applications in wireless consumer products and the chip is well-known in many Arduino-projects as a versatile low-cost-module.  
In recent years solutions were found to use this chip for limited Bluetooth-Low-Energy communication.  
One of the first articles about this topic can be found here:  
https://dmitry.gr/?r=05.Projects&proj=11.%20Bluetooth%20LE%20fakery  
  
Several further work was done later on by different developers and a working bridge to read sensor data from a XIAOMI MJ_HT_V1 already exists.
The fundamental principle is, that some of these sensors send its data as a usual BLE-advertisement packet with a proprietary data format at the end of the payload. These packets had to fit into the 32 bytes of the FIFO-RX-buffer of the NRF24L01, otherwise the "later" bytes were lost.  

For the Tasmota-driver a new solution was found. 
The basic idea is to use some constant ID-bytes of the BLE-packets as the PDU-type for the NRF24l01. 
Thus, all bytes before these ID-bytes are lost and the size restriction for the payload is successfully circumvented. 
That way it is possible to read the sensor data from a Mi Flora sensor, which is positioned outside of the 32-byte-range.
Of course there is still no bidirectional "real" BLE-communication, only advertisements can be read.

## USAGE:
Uncomment #USE_SPI, #USE_NRF24 and #USE_MIBLE in 'my_user_config.h' and configure the pins vor SPI_DC and SPI_CS while connecting the hardware SPI pins 12 - 14(MOSI, MISO and CLOCK).  
!! ⚠️ In order to simplify the code, the pin names from the SPI-display-drivers are used ⚠️ !!   
For the NRF24L01 SPI_DC translates to CSN and SPI_CS to CE.  
   
   
  <img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/nrf24_config.png?raw=true" style="width:400px"></img>  
   
   
No additional steps are necessary.  
The initial log should like this:  
  
```  
00:00:00 NRF24L01 initialized  
00:00:00 NRF24L01+ detected  
00:00:00 MIBLE: started  
```  
  
The driver will do the rest automatically and starts to look for known "special" packets, which will be used to extract the sensor readings.
Web-GUI and TELE-messages will be populated with the sensor data.  This can take a while after start and may be influenced by the general traffic on the 2,4 GHz-band.  

For the first driver versíon multiple MJ_HT_V1-sensors and Flora-sensors are supported. They will be discriminated by using the company-assigned ID of the BLE Public Device Address (= the "lower" 24 bits). So a TELE-message could like look this:  
  
```
10:13:38 RSL: stat/tasmota/STATUS8 = {"StatusSNS":{"Time":"2019-12-18T10:13:38","Flora-6ab577":{"Temperature":21.7,"Illuminance":21,"Humidity":0,"Fertility":0},"MJ_HT_V1-3108be":{"Temperature":22.3,"Humidity":56.1},"TempUnit":"C"}}
```
  
As the NRF24L01 can only read BLE-advertisements, only the data in these advertisements is accessible.  
All sensors have an additional GATT-interface with more data in it, but it can not be read with a NRF24l01. 
  
As we can not use a checksum to test data integrity of the packet, only data of sensors, which adresses showed up more than once (default = 3 times) will be published. 
Internally from time to time "fake" sensors will be created, when there was data corruption in the address bytes.  These will be removed automatically.  
  
## Working sensors:

!> **It can not be ruled out, that changes in the device firmware may break the functionality of this driver completely !!**  

The naming conventions in the product range of bluetooth sensors in XIAOMI-universe can be a bit confusing. The exact same sensor can be advertised under slightly different names depending on the seller (Mijia, Xiaomi, Cleargrass, ...).
  
### MJ_HT_V1:  
Model: LYWSDCGQ/01ZM  
This device works with an AAA-battery for several months and the driver can read temperature, humidity and battery level.  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/mj_ht_v1.png?raw=true" style="width:200px"></img>
  
  
### Mi Flora:  
Works with a CR2032-coin-cell and provides temperature, illuminance, (soil-)humidity and (soil-)fertility.  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/miflora.png?raw=true" style="width:200px"></img>  
  
  
### LYWSD02:  
This device has an E-Ink-Display, works with 2 x CR2032-coin-cells and the driver can read temperature and humidity.  
  
<img src="https://github.com/tasmota/docs/blob/master/_media/peripherals/lywsd02.jpg?raw=true" style="width:200px"></img>  
  
Python code to compute and set the value for the time characteristic with a generic BLE-tool: https://github.com/arendst/Tasmota/pull/7564#issuecomment-576396125



### Potential "candidates":  
Based on published data, the chance to support following sensors in the future is quite good:  

+ CGG1 (similar to the LYWSDCGQ/01ZM , but with E-Ink-Display and CR2430-coin-cell)  
  
  
The situation for the new (and cheap) LYWSD03MMC (small, rectangular form) is different, as the sensor data in the advertisements is encrypted (or even absent at all).  


