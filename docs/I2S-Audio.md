# I2S Audio :material-cpu-32-bit:

??? failure "This feature is not included in precompiled binaries"  

    When [compiling your build](Compile-your-build) add the following to `user_config_override.h`:
    To use it you must [compile your build](Compile-your-build). Add the following to `user_config_override.h`:

    ```arduino
    #ifndef USE_I2S_AUDIO
    #define USE_I2S_AUDIO   // Add support for I2S audio output
    // #define USE_I2S_NO_DAC                         // Add support for transistor-based output without DAC
    // #define USE_I2S_WEBRADIO                       // Add support for MP3 web radio streaming
    // #define USE_I2S_SAY_TIME                       // Add support for english speaking clock
    // #define USE_I2S_RTTTL                          // Add support for Rtttl playback
    // #define 
    #endif

    #ifndef USE_I2S_MIC
    #define USE_I2S_MIC                               // if you use a microphone
    #endif

    // if you use a microphone with MP3 encoding, this also requires PSRAM
    #ifndef USE_SHINE
    #define USE_SHINE                                 // use MP3 encoding
    #endif

    ```
    remark:  USE_M5STACK_CORE2, USE_TTGO_WATCH and ESP32S3_BOX automatically include I2S_AUDIO

!!! warning "Only supported on ESP32 chips (except ESP32-C3)"

I2S (Inter-IC Sound) is a serial, synchronous communication protocol that is usually used for transmitting audio data between two digital audio devices.

ESP32 contains two I2S peripherals. These peripherals can be configured to input and output sample data via the I2S driver. [Read more...](https://docs.espressif.com/projects/esp-idf/en/v4.2/esp32/api-reference/peripherals/i2s.html)

## Hardware Required

### Audio Output

![DAC Breakout Board](https://user-images.githubusercontent.com/11647075/185345605-be22d8a9-c597-4eb0-8426-12978b126ea0.jpg){ align=right width="200" }

For audio output an I2S DAC is required. It is recommended to use an external DAC

|I2SDAC|ESP32-GPIO|
|---|---|
|BCLK|I2S_BCLK|
|LRCK/WS|I2S_WS|
|DIN|I2S_DOUT|
|SD|nc|
|GAIN|nc|
|VIN|3.3-5V|
|GND|Ground|

#### Internal DAC 

ESP32 has two 8-bit DAC (digital to analog converter) channels, connected to GPIO25 (Channel 1) and GPIO26 (Channel 2).

Those channels can be driven via the I2S driver when using the “built-in DAC mode” enabled with `USE_I2S_NO_DAC`

### Audio Input

![I2S Microphone](https://user-images.githubusercontent.com/11647075/185345648-37979fa9-2114-4aa0-be99-ee8c855219b2.jpg){ align=right width="200" }

For microphone input an I2S microphone must be provided. There are also several brands available.

|I2S micro|ESP32-GPIO|
|---|---|
|SCK|I2S_BCLK|
|WS|I2S_WS|
|SD|I2S_DIN|
|L/R|Ground|
|VDD|3.3V|
|GND|Ground|

## Commands

### DAC Output

|CMD DAC|action|
|---|---|
|I2SGain | `0..100` = sets the volume of the audio signal |
|I2SPlay | `/file.mp3` = plays a .mp3 audio file from the file system, the systems blocks until sound is played<BR>`+/file.mp3` = plays a .mp3 audio file from the file system, sound is played in a separate task not blocking the system|
|I2SRtttl| `string` = play [Ring Tones Text Transfer Language (RTTTL)](https://www.mobilefish.com/tutorials/rtttl/rtttl_quickguide_specification.html) ringtones (requires defined `USE_I2S_RTTTL`) |
|I2Say   | `text` = speaks the text you typed (only English language supported)|
|I2STime | tells current Tasmota time in English (requires defined `USE_I2S_SAY_TIME`)|
|I2SWr | `url` = starts playing an [mp3 radio](http://fmstream.org/) stream, no blocking (requires defined `USE_I2S_WEBRADIO`)<BR>no parameter = stops playing the stream|

### Microphone Input

|CMD micro|action|
|---|---|
|I2SRec | `/file.mp3` = starts recording a .mp3 audio file to the file system, no blocking<BR> no parameter = stops recording<BR>`-?` = shows how many seconds already recorded|
|I2SMGain | `1..50` = sets the gain factor of the microphone|

## MP3 Streaming

Starts an .mp3 streaming server on port 81 which can stream microphone audio to a browser (PSRAM needed)  
`http://<device_ip>:81/stream.mp3`

```arduino
#ifndef MP3_MIC_STREAM
#define MP3_MIC_STREAM          // Add support for MP3 audio streaming
#endif

#define MP3_STREAM_PORT 81     // if defined overwrites the default 81
```

## I2S Audio Bridge

Starts an UDP audio service to connect 2 ESP32 devices as an audio intercom ([an example](https://github.com/arendst/Tasmota/discussions/16226)). 

Needs audio output and microphone on 2 devices (no PSRAM needed)  

```arduino
#ifndef I2S_BRIDGE
#define I2S_BRIDGE               // Add support for UDP PCM audio bridge
#endif

#define I2S_BRIDGE_PORT 6970     // if defined overwrites the default 6970
```

|CMD bridge|action|
|---|---|
| I2SBridge | `ip` = sets the IP of the slave device<BR>`0` = stop bridge<BR>`1` = start bridge in read mode<BR>`2` = start bridge in write mode<BR>`3` = start bridge in loopback mode<BR>`4` = set bridge to master<br>`5` = set bridge to slave<br>`6` = set microphone to swapped<BR>`7` = set microphone to not swapped<BR>`p<x>` = sets the push to talk button where `x` is the button's GPIO pin number|

If a push to talk button is defined the bridge goes to write mode if the button is pushed and to read mode if the button is released  
