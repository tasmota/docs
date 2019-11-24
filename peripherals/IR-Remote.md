IR Remote driver enables sending IR codes through an IR transmitter and receiving them through an IR receiver via [IRremoteESP8266 library](https://github.com/crankyoldgit/IRremoteESP8266).

Most builds support only most common IR protocols, but [tasmota-ir.bin](Tasmota-IR) supports almost all protocols available in the IRremoteESP8266 library.

# IR Transmitter
<img src="https://user-images.githubusercontent.com/5904370/68168682-e3cca780-ff69-11e9-928d-e1571a24a3ab.png" align=right></img>Common transmitter modules in the market have a weak IR LED, thus effective transmit distance is really short. If you need range it is best to [build your own](https://github.com/crankyoldgit/IRremoteESP8266/wiki#ir-sending). For the LED we recommend [TSAL6400](https://t.ly/8DX7N) for best performance.
> YT-IRTM transmitter/receiver board is serial only and does not work with this driver (its also limited to only NEC IR protocol).


#### Wiring
| IR w/ 2N222   | ESP266 |
|---|---|
|data   |GPIOx   |
|+   | 3.3v/5v  |
|-  |GND    |

### Tasmota
In the _Configuration -> Configure Module_ page assign:
- GPIOx to `IRsend (8)`   

See [IR commands](Commands#ir-remote) for use. 

# IR Receiver
<img src="https://user-images.githubusercontent.com/5904370/68152195-7443c180-ff43-11e9-95dc-0268d5e5dd3c.png" align=right width=170></img>

IR Receiver is used to capture IR codes. Those codes can be sent using [`IRSend`](Commands#irsend) or used as a [rule](Rules) trigger.   

Example uses the widely available [KY-022](https://arduinomodules.info/ky-022-infrared-receiver-module/) breakout board.

#### Wiring
| KY-022   | ESP266 |
|---|---|
|S   |GPIOx   |
|+   | 5v  |
|-  |GND    |

### Tasmota
In the _Configuration -> Configure Module_ page assign:
- GPIOx to `IRrecv (51)`   

On a captured code IR receiver sends a `tele/%topic%/RESULT` JSON reponse:

```json
{
  "Time": "2019-01-01T00:00:00",
  "IrReceived": {
    "Protocol": "NEC",
    "Bits": 32,
    "Data": "0x00FF00FF"
  }
}

```
## Further Reading
This covers only the basic IR protocols. Read [Complete IR Remote Protocols](Tasmota-IR) for more advanced applications.

[IR Send RAW configuration and use](IRSend-RAW-Encoding)

User maintained [codes database for IR](Codes-for-IR-Remotes-(for-YTF-IR-Bridge))

[Linux Infrared Remote Control (LIRC)](http://www.lirc.org/) for more information. 

## Related Projects
- [IR Blaster with Tasmota](http://www.asknoone.com/ir-blaster-with-tasmota/)
- [Sonoff Basic IR "hat"](https://github.com/altelch/SonoffIR)

Example circuit with transmitter and receiver:
![Example circuit with transmitter and receiver](https://user-images.githubusercontent.com/5904370/68167905-820b3e00-ff67-11e9-978f-d7108a179353.png)