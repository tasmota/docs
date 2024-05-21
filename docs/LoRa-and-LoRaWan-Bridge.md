# LoRa and LoRaWan Bridge

??? tip "This feature is included only in `tasmota32` binaries" 

    When [compiling your build](Compile-your-build) add the following to `user_config_override.h`:
    ```c++
    #ifndef USE_SPI 
    #define USE_SPI                 // Add support for SPI
    #endif
    #define USE_SPI_LORA            // Add support for LoRaSend and LoRaCommand (+4k code)
    #define USE_LORA_SX126X         // Add driver support for LoRa on SX126x based devices like LiliGo T3S3 Lora32 (+16k code)
    #define USE_LORA_SX127X         // Add driver support for LoRa on SX127x based devices like M5Stack LoRa868, RFM95W (+5k code)
    #define USE_LORAWAN_BRIDGE      // Add support for LoRaWan bridge (+8k code)
    ```

The LoRa feature can be used to add a RF communication channel between two or more devices. The LoRaWan Bridge feature can be used to receive information from any joined LoRaWan devices.

Both features use dedicated hardware supporting the LoRa protocol. Tasmota provides support for two different Semtech drivers used in most LoRa devices today: SX127x and newer SX126x.

Some devices using SX127x are:

* HopeRF RFM95W, RFM96W and RFM98W
* LilyGo TTGO T3 LoRa32 868MHz ESP32 (uses SX1276)
* LilyGo TTGO T-Higrow 868MHz (uses SX1276)
* DFRobot FireBeetle Covers LoRa Radio 868MHz (uses SX1278)
* M5Stack LoRa868 (uses AI-01 which uses SX1276)
* Modtronix
 
Some devices using SX126x are:

* LilyGo T3S3 LoRa32 868MHz ESP32S3 (uses SX1262)
* LilyGo TTGO T-Weigh ESP32 LoRa 868MHz HX711 (uses SX1262)
* Heltec (CubeCell) (uses SX1262)
* Waveshare SX1262 Lora Node (HF) and (LF)

## LoRa commands

* `LoRaConfig`: show current configuration.
* `LoRaConfig 1`: set default LoRa configuration.
* `LoRaConfig 2`: set default LoRaWan configuration.
* `LoRaConfig {"Frequency":868.0,"Bandwidth":125.0}`: changes frequency and bandwidth. Other parameters can be changed using the same JSON parameter layout.
* `LoRaSend`: disable hexadecimal and switch to text decoding.
* `LoRaSend <string>`: send appending `\n` (newline).
* `LoRaSend1 <string>`: send appending `\n` (newline).
* `LoRaSend2 <string>`: send.
* `LoRaSend3 <string>`: replace escape characters and send.
* `LoRaSend4 <string>`: send as binary. Data in response messages is encoded as binary strings.
* `LoRaSend5 <string>`: send as hex. Data in response messages is encoded as hex strings.
* `LoRaSend6 <string>`: send as comma-delimited string of decimal numbers.
* `LoRaSend15 <string>`: send as hex with inverted IQ. Data in response messages is encoded as hex strings.
* `LoRaCommand <topic_of_lora_receiver> <command>`: send command to device with MQTT topic.

## LoRaWan commands

* `LoRaWanBridge 1`: enable LoRaWan bridge.
* `LoRaWanBridge 0`: disable LoRaWan bridge.
* `LoRaWanAppKey<x> <32_character_app_key>`: set known appkey of LoRaWan device or node to be joined.
* `LoRaWanName<x> <string>`: set friendly name for device or node.

## Configuration

First assign SPI GPIOs to `SPI MISO`, `SPI MOSI`, `SPI CLK`, `LoRa CS` and `LoRa Rst` types in the "Configure Module" page. In addition assign sx127x specific GPIO to `LoRa DIO0` or sx126x specific GPIOs to 
`LoRa Busy` and `LoRa DIO1`.

## LoRaWan bridge

The LoRaWan Bridge can communicate with LoRaWan devices supporting single channel mode.

