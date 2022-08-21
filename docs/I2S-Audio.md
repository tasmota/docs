# I2S Audio :material-cpu-32-bit:

??? failure "This feature is not included in precompiled binaries"  

    When [compiling your build](Compile-your-build) add the following to `user_config_override.h`:
    To use it you must [compile your build](Compile-your-build). Add the following to `user_config_override.h`:

    ```arduino
    #ifndef USE_I2S_AUDIO
    #define USE_I2S_AUDIO   // Add support for I2S audio output
    #endif

    #ifndef USE_I2S_MIC
    #define USE_I2S_MIC		  // in case you want to use a microphone
    #endif

    // in case you want to use a microphone with mp3 encoding, this also requires PSRAM
    #ifndef USE_SHINE
    #define USE_SHINE		// use mp3 encoding		
    #endif

    ```
    remark:  USE_M5STACK_CORE2, USE_TTGO_WATCH and ESP32S3_BOX automatically include i2s audio


!!! warning "Only supported on ESP32 chips (except ESP32-C3)"


## Hardware Required

![](https://user-images.githubusercontent.com/11647075/185345605-be22d8a9-c597-4eb0-8426-12978b126ea0.jpg){ align=right width="200" }

#### Audio Output

For audio output an I2S DAC Audio breakout must be provided. There are several brands available   

![](https://user-images.githubusercontent.com/11647075/185345648-37979fa9-2114-4aa0-be99-ee8c855219b2.jpg){ align=right width="200" }

#### Audio Input

For microphone input an I2S microphone must be provided. There are also several brands available.

## Connecting the I2S hardware to an ESP32


|I2SDAC|ESP32-GPIO|
|---|---|
|BCLK|I2S_BCLK|
|LRC|I2S_WS|
|DIN|I2S_DOUT|
|SD|nc|
|GAIN|nc|
|VIN|3.3-5V|
|GND|Ground|

|I2S micro|ESP32-GPIO|
|---|---|
|SCK|I2S_BCLK|
|WS|I2S_WS|
|SD|I2S_DIN|
|L/R|Ground|
|VDD|3.3V|
|GND|Ground|


## Tasmota Commands

|CMD ADC|action|
|---|---|
|i2splay | `/file.mp3` = plays an mp3 audio file from the file system, the systems blocks until sound is played|
|i2splay | `+/file.mp3` = plays an mp3 audio file from the file system, sound is played in a separate task not blocking the system|
|i2sgain | `0..100` = sets the loudness of the audio signal |
|i2ssay  | `text` = speaks the text you typed (only English language supported)|
|i2stime | tells current time, (only if `#define USE_I2S_SAY_TIME` is defined|

|CMD micro|action|
|---|---|
|i2srec | `/file.mp3` = starts recording an mp3 audio file to the file system, no blocking|
|i2srec | stops recording<BR>`-?` = shows how many seconds already recorded|
|i2smgain | `1..50` = sets the gain factor of the microphone|

----

## Web Radio Support

(PSRAM needed)  

```arduino
#ifndef USE_I2S_WEBRADIO
#define USE_I2S_WEBRADIO          // Add support mp3 webradio streaming
#endif
```

|CMD WR|action|
|---|---|
|i2swr | `url` = starts playing an mp3 audio radio stream, no blocking|
|i2swr |stops playing|

## MP3 Streaming Support

Starts an mp3 streaming server on port 81 which can stream microphone audio to a browser (PSRAM needed)  
`http://IP:81/stream.mp3`

```arduino
#ifndef MP3_MIC_STREAM
#define MP3_MIC_STREAM          // Add support for mp3 audio streaming
#endif

#define MP3_STREAM_PORT 81	// if defined overwrites the default 81
```


## I2S Audio Bridge Support

Starts an UDP audio service to connect 2 ESP32 devices as an audio intercom. Needs audio output and microphone on 2 devices (no PSRAM needed)  

```arduino
#ifndef I2S_BRIDGE
#define I2S_BRIDGE          // Add support for udp pcm audio bridge
#endif

#define I2S_BRIDGE_PORT 6970 // if defined overwrites the default 6970
```

|CMD bridge|action|
|---|---|
i2sbridge | `ip` = sets the IP of the slave device|
|i2sbridge | Sets microphone swap<br>`6` = swapped<BR>`7` = not swapped|
|i2sbridge | Sets master mode <br> `4` = master<br>`5` = slave|
|i2sbridge pN|`p<x>` = sets the push to talk button to GPIO pin number <x\>|
|i2sbridge | Starts the bridge in write or read mode<BR>`1` = read<BR>`2` = write<BR>`0` = stop|  

If a push to talk button is defined: the bridge goes to write mode if the button is pushed and to read mode if the button is released  