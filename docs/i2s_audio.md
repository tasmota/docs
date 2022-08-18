# I2S Audio

!!! failure "This feature is not included in precompiled binaries"     
This option is only supported on ESP32 variants (except C3)   
To use it you must [compile your build](Compile-your-build). Add the following to `user_config_override.h`:
```
#ifndef USE_I2S_AUDIO
#define USE_I2S_AUDIO          // Add support for I2S audio output
#endif

#ifndef USE_I2S_MIC
#define USE_I2S_MIC		// in case you want to use a mircophone
#endif

// in case you want to use a mircophone with mp3 encoding, this also requires PSRAM
#ifndef USE_SHINE
#define USE_SHINE		// use mp3 encoding		
#endif

```
----


## Hardware needed
### audio output
<img src="file:///Users/gerhardmutz1/Desktop/s-l1600-1.jpg" align=right width=240>  

for audio output an I2S DAC Audio breakout must be provided    
there are several brands available   
&nbsp;

&nbsp;

&nbsp;

&nbsp;

### audio input
<img src="file:///Users/gerhardmutz1/Desktop/s-l1600-1.jpg" align=right width=240>  

for microphone input an I2S microphone must be provided    
there are also several brands available  
&nbsp;

&nbsp;

&nbsp;

&nbsp;



## Configuration
### Connecting the I2S hardware to an ESP32


|  I2SDAC | ESP32-GPIO |
|---|---|
|BCLK  |I2S_BCLK|
|LRC   |I2S_WS|
|DIN   |I2S_DOUT|
|SD   |nc|
|GAIN   |nc|
|VIN   |3.3-5V|
|GND   |Ground|

|  I2S micro | ESP32-GPIO |
|---|---|
|SCK  | I2S_BCLK |
|WS   |I2S_WS|
|SD   |I2S_DIN|
|L/R   |Ground|
|VDD   |3.3V|
|GND   | Ground |


### Tasmota console cmds
|  CMD ADC | action|
|---|---|
|i2splay /file.mp3|plays an mp3 audio file from the file system, the systems blocks until sound is played|
|i2splay +/file.mp3|plays an mp3 audio file from the file system, sound is played in a seperate task not blocking the system|
|i2sgain L|sets the loudness of the audio signal  L = 0-100|
|i2ssay hello|speaks the text you type (only english language supported)|
|i2stime|tells current time, if #define USE_I2S_SAY_TIME is defined|

|  CMD micro | action|
|---|---|
|i2srec /file.mp3|starts recording an mp3 audio file to the file system, no blocking|
|i2srec|stops recording|
|i2srec -?|tells how many seconds already recorded|
|i2smgain F|sets the gain factor of the microphone  F = 1-50|
----

### mp3 streaming support

this starts an mp3 streaming server on port 81 which can stream microphone audio to a browser (PSRAM needed)  
`http://IP:81/stream.mp3`

```
#ifndef MP3_MIC_STREAM
#define MP3_MIC_STREAM          // Add support for mp3 audio streaming
#endif

#define MP3_STREAM_PORT 81	// if defined overwrites the default 81

```
----

### i2s audio bridge support

this starts an udp audio service to connect 2 esp32 devices as an audio intercom
needs audio output and microphone on 2 devices (no PSRAM needed)  
```
#ifndef I2S_BRIDGE
#define I2S_BRIDGE          // Add support for udp pcm audio bridge
#endif

#define I2S_BRIDGE_PORT 6970 // if defined overwrites the default 6970

```
|  CMD bridge | action|
|---|---|
i2sbridge IP|sets the ip of the slave device|
|i2sbridge S|sets microphone swap, 6=swapped, 7=not swapped|
|i2sbridge M|sets master mode, 4=master, 5=slave|
|i2sbridge pN|sets the GPIO pin numer of a push to talk button|
|i2sbridge M|starts the bridge in write or read mode, 1=read,2=write,0=stop|  

if a push to talk button is defined the brdge goes to write mode if the button is pushed and to read mode if the button is released  
 


----


