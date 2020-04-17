# ESP32 Support (Early alpha development)

!!! warning "ESP32 support is in early alpha and only basic functions will work"

## Compiling for ESP32

Rename `platformio_override_sample.ini` to `platformio_override.ini` and uncomment tasmota32 in line #28. Next build will create a `tasmota32.bin`. Flash using esptool.py

`esptool.py --chip esp32 --port <your-port> write_flash 0x1000 tasmota32.bin`

![platformio_override.ini](_media/esp32-pio.jpg)

## Activate user_config_override.h

To use your `user_config_override.h` in tasmota32 you need to uncomment line 254.

![user_config_override.ini](_media/esp32-uco.jpg)
