---
desription: Everything about Tasmota on ESP32
---
!!! warning "ESP32 support is in beta and not all functions or supported peripherals will work reliably."
     Due to the scope and activity of development there might be breaking changes and incompatibilities between major and minor versions of Tasmota32. In case of problems first erase flash and serial flash the latest development binary.

## Flashing


Use [ESP_Flasher](https://github.com/Jason2866/ESP_Flasher/releases) for flashing an ESP32 or ESP82xx (Windows and MacOs executables are tested and verified as working).

With esptool.py use the following command syntax (**replace COM port number!**):
```
esptool.py --chip esp32 --port COM5 --baud 921600 --before default_reset --after hard_reset write_flash -z --flash_mode dout --flash_freq 40m --flash_size detect 0x1000 bootloader_dout_40m.bin 0x8000 partitions.bin 0xe000 boot_app0.bin 0x10000 tasmota32.bin
```

You can download precompiled binaries:

  - development branch from [http://ota.tasmota.com/tasmota32/release/](http://ota.tasmota.com/tasmota32/release/) 
  - stable releases from [https://github.com/arendst/Tasmota/tree/firmware/firmware/tasmota32](https://github.com/arendst/Tasmota/tree/firmware/firmware/tasmota32) 
  - the required [flash files](https://github.com/arendst/Tasmota/tree/firmware/firmware/tasmota32/ESP32_needed_files) _(not needed when using ESP_Flasher)_

OTA upgrade from older versions of tasmota32 might fail due to significant changes in partition tables.

Every OTA upgrade currently fails on tasmotasolo1.bin builds. Upgrade by File upload should work instead.

## ESP32 Differences
All ESP32 systems on a chip (SoC) are 32-bit MCUs with 2.4 GHz Wi-Fi & Bluetooth/Bluetooth LE built in. There are distinct product lines which are different from each other in varying degrees. 

### ESP32

Tasmota32 is initially developed and tested with dual core version of ESP32

| Module          | Core    | Core clock | Flash (MB)     | PSRAM (MB) | Touch Sensor | Hall sensor |   |
|---------------------------------|-------------------------|--------------------------|----------------|------------|--------------|-------------|-------------------|
| [ESP32-WROOM-32E](/media/datasheets/esp32-wroom-32e_esp32-wroom-32ue_datasheet_en.pdf)<br>[ESP32-WROOM-32UE](/media/datasheets/esp32-wroom-32e_esp32-wroom-32ue_datasheet_en.pdf) | ESP32-D0WD-V3 Dual Core | 240 MHz  | 4,8,16         | N/A        | Yes          | Yes         | Bluetooth 4.2 LE  |
| [ESP32-WROVER-E](/media/datasheets/esp32-wrover-e_esp32-wrover-ie_datasheet_en.pdf)<br>[ESP32-WROVER-IE](/media/datasheets/esp32-wrover-e_esp32-wrover-ie_datasheet_en.pdf)   | ESP32-D0WD-V3 Dual Core | 240 MHz  | 4,8,16         | 8          | Yes          | Yes         | Bluetooth 4.2 LE  |
| ESP32-MINI-1    | ESP32-U4WDH Single Core | 160 MHz  | 4              | N/A        | Yes          | Yes         | Bluetooth 4.2 LE  |
| [ESP32-SOLO-1](/media/datasheets/esp32-solo-1_datasheet_en.pdf)    | ESP32-S0WD Single Core  | 160 MHz  | 4              | N/A        | Yes          | Yes         | Bluetooth 4.2 LE  |
| [ESP32-WROOM-32SE](/media/datasheets/esp32-wroom-32se_datasheet_en.pdf)                | ESP32-D0WD Dual Core    | 240 MHz  | 4,8,16         | N/A        | Yes          | Yes         | Bluetooth 4.2 LE  |

Single core SoCs do not work with standard binaries, for those use only `tasmota32solo1.bin` or compile your own binary using the tasmota32solo1 environment.

ESP32 line is later expanded with [ESP32-PICO-V3](/media/datasheets/esp32-pico-v3_datasheet_en.pdf), [ESP32-PICO-V3-02](/media/datasheets/esp32-pico-v3-02_datasheet_en.pdf) and [ESP32-PICO-D4](http://espressif.com/sites/default/files/documentation/esp32-pico-d4_datasheet_en.pdf)

### ESP32-S2
A more cost-efficient version of ESP32, cut down to a single core and several dedicated hardware security features (eFuse, flash encryption, secure boot, signature verification, integrated AES, SHA and RSA algorithms). It has 43 available GPIOs. [Product page for ESP32-S2](https://www.espressif.com/en/products/socs/esp32-s2)

Tasmota does not boot correctly on this line.

### ESP32-S3
Keeping the security improvements the S3 line now again features the dual core SoC with Bluetooth upgraded to V5 . [Product page for ESP32-S3](https://www.espressif.com/en/products/socs/esp32-s3). 

Untested with Tasmota.

### ESP32-C3
Unlike previous versions, C3 is a single-core Wi-Fi and Bluetooth 5 (LE) microcontroller SoC based on the open-source RISC-V architecture. It will be available as [ESP32-C3-MINI-1](/media/datasheets/esp32-c3-mini-1_datasheet_en.pdf) and [ESP32-C3-WROOM-02](/media/datasheets/esp32-c3-wroom-02_datasheet_en.pdf) modules. [Product page for ESP32-C3](https://www.espressif.com/en/products/socs/esp32-c3)

Work has already begun on adapting Tasmota32 for RISC-V architecture.

## Exclusive Features

### CPU Temperature Sensor
Every tasmota32 binary will create and display internal chip temperature sensor in the webUI and in MQTT.

```json
MQT: tele/tasmota_17A5A0/SENSOR = {"Time":"2021-01-01T00:00:00","ESP32":{"Temperature":41.7},"TempUnit":"C"}
```

### Hall Sensor
ESP32 has a built in hall effect sensor that detects changes in the magnetic field in its surroundings. It is located behind the metal lid of the module and connected to GPIO36 and GPIO39. 

To enable set in module configuration or template:
 - GPIO36 as `HallEffect 1`
 - GPIO39 as `HallEffect 2`

### Touch Pins

ESP32 has 10 capacitive touch GPIOs. More on configuring and [using them...](https://tasmota.github.io/docs/TouchPin/).

### Berry Scripting
[Berry](Berry.md) language as a more approachable scripting language. 

### LVGL
Use [LVGL](https://lvgl.io/) in conjunction with Berry on devices with displays and touch displays to design your own UI.

## Compiling ESP32 Binaries

Uncomment the tasmota32xxx build you want to compile in `platformio_tasmota32.ini`. For exampple, uncommenting tasmota32 in line #9 will build `tasmota32.bin` on the next Build task in Platformio. 

![platformio_override.ini](_media/esp32-pio.jpg)

All binaries use `user_config_override.h` if it exists.

## Working Devices

Tasmota Device Templates Repository has a more extenstive list of [ESP32 based](https://templates.blakadder.com/esp32.html) devices.

### LilyGO TTGO T-Camera OV2640_V05

In `platformio_override.ini` uncomment the line with `tasmota32` and set the correct COM port. 

In `user_config_override.h` add:

```c
#define USE_BMP
#define USE_I2C
#define USE_SPI
#define USE_DISPLAY
#define USE_DISPLAY_SSD1306
#define SHOW_SPLASH
#define USE_WEBCAM
```

Upload via USB, then apply the following Template:

```json
{"NAME":"TTGO_V05","GPIO":[1,1,1,1,5090,5088,1,1,5056,5024,5089,5091,1,1,5092,5184,0,640,608,5093,0,5152,4928,5120,0,0,0,0,4992,160,32,1,5094,0,0,5095],"FLAG":0,"BASE":2}
```

The PIR will turn ON/OFF the display and send over MQTT the POWER status. The display shows the sensor data.
To make the device work nicely, change the following settings in the Console:

Camera settings to correct orientation (USB on the bottom):
```
WCFlip ON
WCMirror ON
WCResolution 6
WCSaturation 0
WCBrightness -1
WCContrast 1
```

Display Settings (USB on the bottom):
```
DisplayRotate 2
DisplayCols 21
DisplayRows 7
DisplayMode 2
```

BME280 Settings (it is not very trustable):
```
HumOffset 10
TempOffset -15
```

PIR/Button Settings:
```
SwitchMode1 1
SetOption73 1
```

### ODROID-GO

is supported via module. Upload firmware via USB and select module `Odroid Go`


To make the device work nicely, change the following settings in the Console:
```
adcparam3 6,0,4095,0,6160
```

Display Settings:
```
DisplayRotate 3
DisplayCols 53
DisplayRows 30
DisplayMode 5
```


Rule for Joystick to dim the display:
```
on analog#joy2=1 do dimmer - endon on analog#joy2=2 do dimmer + endon
```

### AITHINKER CAM

```json
{"NAME":"AITHINKER CAM","GPIO":[4992,1,672,1,416,5088,1,1,1,6720,736,704,1,1,5089,5090,0,5091,5184,5152,0,5120,5024,5056,0,0,0,0,4928,576,5094,5095,5092,0,0,5093],"FLAG":0,"BASE":2}
```

### wESP32

```json
{"NAME":"wESP32","GPIO":[0,0,1,0,1,1,0,0,1,1,1,1,5568,5600,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,1],"FLAG":0,"BASE":1}

```

### WT32-ETH01

```json
{"NAME":"WT32-ETH01","GPIO":[1,1,1,1,1,1,0,0,1,0,1,1,3840,576,5600,0,0,0,0,5568,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,1],"FLAG":0,"BASE":1}
```

### Denky (Teleinfo)

```json
{"NAME":"Denky (Teleinfo)","GPIO":[1,1,1,1,5664,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1376,1,1,0,0,0,0,1,5632,1,1,1,0,0,1],"FLAG":0,"BASE":1}
```

### Olimex ESP32-PoE

```json
{"NAME":"Olimex ESP32-PoE","GPIO":[1,1,1,1,1,1,0,0,5536,1,1,1,1,0,5600,0,0,0,0,5568,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,1],"FLAG":0,"BASE":1}
```

### M5Stack Atom

```json
{"NAME":"M5Stack Atom","GPIO":[1,1,1,1,1,1,1,1,1056,1,1,1,1,1,1,1,0,609,1,1,0,641,640,1376,0,0,0,0,608,1,1,1,1,0,0,32],"FLAG":0,"BASE":1}
```

### M5Stack Atom lite

```json
{"NAME":"M5Stack Atom Lite","GPIO":[1,1,1,1,1,1,1,1,1056,1,1,1,1,1,1,1,0,1,1,1,0,1,640,1376,0,0,0,0,608,1,1,1,1,0,0,32],"FLAG":0,"BASE":1}
```

### LilyGO ttgo-t-eth-poe

```json
{"NAME":"LilyGO ttgo-t-eth-poe","GPIO":[0,1,1,1,1,1,1,1,1,1,1,1,1,1,5600,1,0,1,1,5568,0,1,1,1,0,0,0,0,1,1,1,1,1,0,0,1],"FLAG":0,"BASE":1}
```

For working Ethernet, change the following setting in the Console:
```
EthClockMode 1
```

these 3 devices are also fully supported, more detailed info will be added later  

### TTGO ESP32 watch  
fully supported with all sensors  

### TTGO T4 
fully supported

### m5stack CORE2

is fully supported with all sensors and SD card. Upload firmware via USB and select module `core2`
  
all pin definitions hardcoded except GPIO 33,34 for extern SCL,SDA on grove bus  
console cmd:  

`core2shutdown seconds` - shut down hardware and wake up after N seconds (>=30)  
`core2shutdown HH:MM` - shut down hardware and wake up on HH:MM time  


### Heltec WiFi Kit 32
OLED display needs the following template

```json
{"NAME":"WiFi Kit 32","GPIO":[1,1,1,1,640,1,1,1,1,1,1,608,3840,1,1,1,0,1,1,1,0,224,1,1,0,0,0,0,1,1,1,1,1,0,0,1],"FLAG":0,"BASE":1}
```


### WEMOS / LOLIN D32
verified support for board plus I2C sensors

to use I2C, set IO21 to SDA and IO22 to SCL


### Displays, sensors and other options 

displays: (most probably all I2C displays will work)    

```c
USE_DISPLAY_SH1106  
USE_DISPLAY_EPAPER_29  
USE_DISPLAY_EPAPER_42  
USE_DISPLAY_ILI9341  
USE_DISPLAY_ILI9488  
USE_DISPLAY_SSD1351  
USE_DISPLAY_RA8876  
USE_DISPLAY_ST7789  
USE_DISPLAY_ILI9341_2  
USE_DISPLAY_ILI9342  
```

sensors:  (most probably all I2C sensors will work)    

```c
USE_SHT3X  
USE_BMP  
USE_VL53L0X  
USE_MLX90614  
USE_IBEACON  
USE_SML_M  
```

misc:  
```c
USE_MP3_PLAYER  
USE_SCRIPT (scripting and all its options)  
USE_24C256  
USE_SENDMAIL
USE_ESP32MAIL
```
