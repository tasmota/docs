---
desription: Everything about Tasmota on ESP32
---
!!! danger "ESP32-C3 and ESP32-S2 support is in beta and not all functions or supported peripherals will work reliably."
     Due to the scope and activity of development there might be breaking changes and incompatibilities between major and minor versions of Tasmota32. In case of problems first erase flash and serial flash the latest development binary.

## ESP32 Differences
All ESP32 systems on a chip (SoC) are 32-bit MCUs with 2.4 GHz Wi-Fi & Bluetooth/Bluetooth LE built in. There are distinct product lines which are different from each other in varying degrees. 

### ESP32

Tasmota32 is initially developed and tested with dual core version of ESP32.

??? note "ESP32 chips"

    | Module          | Core    | Core clock | Flash (MB)     | PSRAM (MB) | Touch Sensor | Hall sensor |   |
    |---|---|---|---|---|---|---|---|
    | [ESP32-WROOM-32E](_media/datasheets/esp32-wroom-32e_esp32-wroom-32ue_datasheet_en.pdf)<br>[ESP32-WROOM-32UE](_media/datasheets/esp32-wroom-32e_esp32-wroom-32ue_datasheet_en.pdf) | ESP32-D0WD-V3 Dual Core | 240 MHz  | 4,8,16         | N/A        | Yes          | Yes         | Bluetooth 4.2 LE  |
    | [ESP32-WROVER-E](_media/datasheets/esp32-wrover-e_esp32-wrover-ie_datasheet_en.pdf)<br>[ESP32-WROVER-IE](_media/datasheets/esp32-wrover-e_esp32-wrover-ie_datasheet_en.pdf)   | ESP32-D0WD-V3 Dual Core | 240 MHz  | 4,8,16         | 8          | Yes          | Yes         | Bluetooth 4.2 LE  |
    | ESP32-MINI-1    | ESP32-U4WDH Single Core | 160 MHz  | 4              | N/A        | Yes          | Yes         | Bluetooth 4.2 LE  |
    | [ESP32-SOLO-1](_media/datasheets/esp32-solo-1_datasheet_en.pdf)    | ESP32-S0WD Single Core  | 160 MHz  | 4              | N/A        | Yes          | Yes         | Bluetooth 4.2 LE  |
    | [ESP32-WROOM-32SE](_media/datasheets/esp32-wroom-32se_datasheet_en.pdf)                | ESP32-D0WD Dual Core    | 240 MHz  | 4,8,16         | N/A        | Yes          | Yes         | Bluetooth 4.2 LE  |

!!! warning "Single core SoCs do not work with standard binaries, for those use only `tasmota32solo1.bin` or compile your own binary using the tasmota32solo1 environment."

Initial ESP32 line is expanded with [ESP32-PICO-V3](_media/datasheets/esp32-pico-v3_datasheet_en.pdf), [ESP32-PICO-V3-02](_media/datasheets/esp32-pico-v3-02_datasheet_en.pdf) and [ESP32-PICO-D4](http://espressif.com/sites/default/files/documentation/esp32-pico-d4_datasheet_en.pdf).

### ESP32-S2
A more cost-efficient version of ESP32, cut down to a single core and several dedicated hardware security features (eFuse, flash encryption, secure boot, signature verification, integrated AES, SHA and RSA algorithms). It has 43 available GPIOs. [Product page for ESP32-S2](https://www.espressif.com/en/products/socs/esp32-s2)

!!! warning "Experimental support in Tasmota"

### ESP32-S3
Keeping the security improvements the S3 line now again features the dual core SoC with Bluetooth upgraded to V5 . [Product page for ESP32-S3](https://www.espressif.com/en/products/socs/esp32-s3). 

!!! warning "Untested with Tasmota"

### ESP32-C3
Unlike previous versions, C3 is a single-core Wi-Fi and Bluetooth 5 (LE) microcontroller SoC based on the open-source RISC-V architecture. It will be available as [ESP32-C3-MINI-1](_media/datasheets/esp32-c3-mini-1_datasheet_en.pdf) and [ESP32-C3-WROOM-02](_media/datasheets/esp32-c3-wroom-02_datasheet_en.pdf) modules. [Product page for ESP32-C3](https://www.espressif.com/en/products/socs/esp32-c3)

!!! note "Stable with Tasmota but requires a specially compiled C3 only binary"

## Exclusive Features

### CPU Temperature Sensor
Tasmota will create an internal temperature sensor and display the values in the webUI and MQTT.

```json
{"Time":"2021-01-01T00:00:00","ESP32":{"Temperature":41.7},"TempUnit":"C"}
```

### Hall Sensor
ESP32 has a built in hall effect sensor that detects changes in the magnetic field in its surroundings. It is located behind the metal lid of the module and connected to GPIO36 and GPIO39. 

To enable set in module configuration or template:

 - GPIO36 as `HallEffect 1`
 - GPIO39 as `HallEffect 2`

### Touch Pins

ESP32 has 10 capacitive touch GPIOs. More on configuring and [using them...](https://tasmota.github.io/docs/TouchPin/).

### DAC

[DAC](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/dac.html) GPIOs are supported through [Berry `gpio` module](Berry.md#dac-gpios).

### Berry Scripting
ESP32 introduces [Berry](Berry.md) language as a more approachable scripting language. Berry is very powerful and you can even code an I2C driver using it.

### LVGL
Use [LVGL](https://lvgl.io/) in conjunction with Berry on devices with displays and touch displays to design your own UI.

## Flashing

Use [ESP_Flasher](https://github.com/Jason2866/ESP_Flasher/releases) for flashing an ESP32 or ESP82xx (Windows and MacOs executables are tested and verified as working).

With esptool.py use the following command syntax (**replace COM port number!**):
```
esptool.py --chip esp32 --port COM5 --baud 921600 --before default_reset --after hard_reset write_flash -z --flash_mode dout --flash_freq 40m --flash_size detect 0x1000 bootloader_dout_40m.bin 0x8000 partitions.bin 0xe000 boot_app0.bin 0x10000 tasmota32.bin
```

!!! warning "Use a proper power supply!"
    ESP32 is power hungry and there's a high chance it will not be able to boot properly off the serial-to-USB power. Power it from a separate power supply that can provide at least 500mA.

You can download precompiled binaries:

  - development branch from [http://ota.tasmota.com/tasmota32/](http://ota.tasmota.com/tasmota32/) 
  - stable releases from [http://ota.tasmota.com/tasmota32/release/](http://ota.tasmota.com/tasmota32/release/) 
  - the required [flash files](https://github.com/arendst/Tasmota/tree/firmware/firmware/tasmota32/ESP32_needed_files) _(not needed when using ESP_Flasher)_

OTA upgrade from older versions of tasmota32 might fail due to significant changes in partition tables.

Every OTA upgrade currently fails on tasmotasolo1.bin builds. Upgrade by File upload should work instead.

## Compiling

Uncomment the tasmota32xxx build you want to compile in `platformio_override.ini`. For example, uncommenting tasmota32 will build `tasmota32.bin` on the next Build task in Platformio. 

![platformio_override.ini](_media/esp32-pio.jpg)

All binaries use `user_config_override.h` if it exists.

## Working Devices

[Tasmota Supported Devices Repository](https://templates.blakadder.com/esp32.html) has a more extenstive list of [ESP32 based](https://templates.blakadder.com/esp32.html) devices.

[ESP32 Devices][ESP32-Devices.md]