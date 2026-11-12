# TFA Marbella pool thermometer

??? failure "This feature is not included in precompiled binaries"

    When [compiling your build](Compile-your-build) add the following to `user_config_override.h`:
    ```arduino
    #define USE_SPI                         // Hardware SPI using GPIO12(MISO), GPIO13(MOSI) and GPIO14(CLK) in addition to two user selectable GPIOs(CS and DC)
    #define USE_TFA_MARBELLA                // Add support for TFA Dostmann Marbella 868MHz pool thermometer using a CC1101 (+12k6 code on ESP8266, +5k7 on ESP32)
      #define TFA_MARBELLA_TIMEOUT   900    // Seconds without a packet after which the reading is dropped
      #define TFA_MARBELLA_SERIAL    0      // Sensor id to bind to, 0 learns the first sensor received
    ```

The [TFA Dostmann Marbella](https://www.tfa-dostmann.de/produkt/funk-poolthermometer-marbella-30-3066/) (30.3066.01) is a floating pool thermometer that transmits the water temperature on 868 MHz about once a minute. Tasmota receives it with a CC1101 module and reports temperature, sensor id, rolling counter and battery state.

The sensor is receive-only from Tasmota's point of view: there is nothing to pair, no button to press, and the display that comes with the thermometer keeps working alongside.

## Wiring

The CC1101 shares the SPI bus with any other SPI peripheral. Only chip select and GDO0 belong to the module itself.

| CC1101  | ESP8266        | Tasmota      |
| ------- | -------------- | ------------ |
|  CSN    | GPIO0..5,15,16 |  CC1101 CS   |
|  GDO0   | GPIO0..5,15,16 |  CC1101 GDO0 |
|  SCK    | GPIO14         |  SPI CLK     |
|  MOSI   | GPIO13         |  SPI MOSI    |
|  MISO   | GPIO12         |  SPI MISO    |
|  GDO2   | not used       |              |
|  GND    | GND            |              |
|  3V3    | 3V3            |              |

!!! note
    `SPI CLK`, `SPI MOSI` and `SPI MISO` are the shared bus lines - assign them once, even if several SPI devices are connected. `CC1101 CS` and `CC1101 GDO0` are specific to this module.

An 868 MHz antenna is required. The wire antennas that come with common CC1101 breakout boards are cut for 433 MHz and will work poorly; a quarter wave for 868 MHz is about 8.6 cm.

## Configuration

Set the GPIOs in **Configuration - Configure Module** as listed above. After a restart the driver starts listening and binds itself to the first sensor it receives with a valid checksum:

```
MRB: TFA Marbella receiver started
MRB: Bound to sensor 68B94A
```

From then on every other sensor is ignored, so an identical thermometer next door cannot feed readings into the same value.

## Commands

Command|Parameters
:---|:---
Marbella|Show the bound sensor id, the reception state and the receive frequency<br>`<id>` = bind to one sensor, id as six hex digits, e.g. `683f16`<br>`0` = forget the binding and learn the next sensor seen<br>`<MHz>` = tune the receiver, e.g. `868.021`, up to 0.2 MHz either way

The binding is stored and survives a restart, so the receiver cannot bind itself to a neighbour's sensor while yours happens to be quiet. `TFA_MARBELLA_SERIAL` sets it at compile time instead.

Readings are published as they arrive, which matters here: the sensor transmits about once a minute while the default `TelePeriod` is 300 seconds, so waiting for telemetry would drop four readings out of five. [`SetOption147`](Commands#setoption147) turns the immediate publish off, the same way it does for the other receiving drivers; rules still see every reading.

## Tuning

A decimal point is what tells a frequency from a sensor id, so no extra keyword is needed:

```
Marbella 868.021
```

The setting is stored and survives a restart, and `Marbella` reports it:

```json
{"Marbella":{"Id":"68B94A","Bound":"YES","Reading":"VALID","Frequency":868.021}}
```

Most modules need no correction. The one it exists for is crystal tolerance: the CC1101 derives its frequency from a 26 MHz crystal, and a cheap one lands the receiver beside the frequency it was told. Measured on one module, `868.000` put it on 867.973 - 27 kHz low. That still fits inside the 135 kHz receive filter, but it spends the margin the signal needs, and reception then works only while the sensor is close.

The symptom is losing frames for no apparent reason while the sensor is demonstrably transmitting. Finding the right value needs a receiver you can trust, an SDR for instance; guessing is not useful, since being wrong in the other direction is just as bad.

## Web interface

The sensor section shows temperature and battery state:

```
TFA Marbella Temperature    33.4 °C
TFA Marbella Battery        ok
```

The battery line is always shown, not only when the battery is low - a line that appears only in the bad case cannot be told apart from a driver that does not report it at all. It reads `low - replace` when the sensor raises the flag.

## Sensor output

```json
{"TFAMarbella":{"Id":"68B94A","Temperature":30.5,"Counter":0,"BatteryLow":0,"LQI":4},"TempUnit":"C"}
```

Id
: Serial number of the sensor, changes only when the sensor is reset

Temperature
: Water temperature

Counter
: 3 bit rolling counter, increments with every transmission - useful to spot lost packets

BatteryLow
: `1` when the sensor reports a low battery, `0` when it is fine. The sensor sends a single bit, not a level - hence `BatteryLow` and not `Battery`, which is a percentage elsewhere in Tasmota

LQI
: Link quality of the packet, `0` to `127`, **lower is better** - it counts how far the symbols fell from their expected positions, so `0` is a flawless frame. Note that this is the opposite of the LQI reported by Zigbee transceivers, where a high value means a good link. The RSSI the chip appends to each packet is not reported: RadioLib keeps it in a private field, and the register that remains readable holds the noise floor by the time the frame is complete

Every frame carries a checksum, and frames that fail it are discarded. If nothing is received for `TFA_MARBELLA_TIMEOUT` seconds the reading disappears from the telemetry and the web interface rather than showing a value that has silently stopped updating.

Reception restarts itself after three minutes without a valid frame. The CC1101 can end up waiting in RX without signalling again, and nothing would ever wake it - the reading would just stop. The restart is logged at debug level:

```
MRB: Receiver re-armed after 180 s without a frame
```

Seeing that line regularly means frames are being lost for another reason - check the antenna and the LQI before assuming the sensor is at fault.

## Notes

`USE_TFA_MARBELLA` and `USE_KEELOQ` cannot be combined. Both drive the same CC1101, one transmitting on 433 MHz and one receiving on 868 MHz, so the combination fails at compile time.

On ESP32 the driver builds and uses the same RadioLib library, but has not been verified on hardware.
