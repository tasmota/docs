Using the [`Sleep`](Commands#sleep) command you can instruct Tasmota to sleep for the set milliseconds in its main cycle. While sleeping your device will consume less power.

[Dynamic Sleep](Dynamic-Sleep) is enabled by default with a value of 50. To continue using Normal Sleep you may disable it by using the command:

[`SetOption60 1`](Commands#setoption60)

Setting `Sleep` to lowest value `1` reduces power consumption already about ~30% in idle mode (relay off) and button presses are still noticed without any delay. Setting this around 50 ms reduces power consumption from ~1.1 W to ~0.6 W on an idling (relay off) device and button presses are still noticed correctly. With this setting you have to concentrate very hard to click the button so fast that it is not recognized by the device.

If your device needs to do something continuously, this will be affected. E.g., device LED will flicker and Sonoff POW will not be able to correctly total the energy consumption. Spot readings of power, voltage, etc. will however remain correct.

> From the release notes:
> Expect overall button/key/switch misses and wrong values on Sonoff Pow

Also, if using [KNX IP Protocol](integrations/KNX), `Sleep` needs to be 0 in order to avoid losing any telegram.

**Notes:**
- Starting with Tasmota 6.1.1.12 `Sleep` &ne; `0` has no impact on real time related commands like [`Delay`](Commands#delay), [`PulseTime`](Commands#pulsetime), [`TelePeriod`](Commands#teleperiod) and [`Blinktime`](Commands#blinktime).
- As the WiFi Modem on an ESP8266 is the major consumer - using Sleep with WiFi AP mode enabled is more or less without effect.

## Device power consumption and measurement

Most low-price plug-in home energy meters like Sonoff devices are very imprecise for power consumption &lt; 10 W and become more and more imprecise for power consumption (&lt; 1.5 W). Furthermore, the results of such meters are very strongly dependant on the load type (capacitive/inductive) and are absolutely imprecise for non-ohmic load types having switch-mode power supplies.

In addition, using `Sleep` - which periodically cycles the power of the device between 20% and 100% - on such meters makes their readings more or less useless.

## Example of power consumption

### Absolute AC line measurement using calibrated meter

The following measurement was done directly on 230 V/AC line using a [Sonoff Dual R2](http://sonoff.itead.cc/en/products/sonoff/sonoff-dual) and two different [Sonoff S20](http://sonoff.itead.cc/en/products/residential/s20-socket) connected on different MID calibrated meter (Eastron SMD630 MID/saia-burgess ALE3).

#### Device power consumption using Sleep
Device       | Sleep 0 | Sleep 1 | Sleep 50 | Sleep 200
------------ | ------------ | ------------ | ------------- | ------------
Sonoff Dual R2 |  1.24 W |  0.84 W | 0.76 W   | 0.68 W
Sonoff S20     |  1.11 W |  0.77 W | 0.59 W   | 0.51 W

All measurements were done with
- WiFi STA mode, enabled and connected (70%)
- MQTT enabled and connected
- Syslog enabled and connected
- `TelePeriod 60` for debugging
- Relays off
- Measurement period of 24-56 hours to reduce measurement discrepancies

The first impression is that a higher sleep value reduces the consumption, but only slightly. The second result is that using `Sleep <value>` (`value` &ne; 0, e. g., 1) is good enough to reduce the power consumption anywhere between 1/3 and up to 45% (value=200).

### Quantity measurement of ESP-12 module/ESP8266 3.3V line

To find out why Sleep reduces the power consumption and how its value should be set, the current of the 3.3V DC ESP8266 of an ESP-12 module was measured using an oscilloscope and (for easy reading the oscilloscope diagram) a 1 &ohm; shunt which results in a 1:1 interpretation between voltage and current.

This measurement simplified the measure of a time based power consumption; no integration must be done. On the other side note that the quantity measurement does not respect the effectiveness of the complete device circuit.

#### Sleep 0
Using `Sleep 0` there are no `delay()` calls in Tasmota main loop and therefore the power consumption is continuous at current ~80 mA:
![sleep 0](https://user-images.githubusercontent.com/6636844/36341353-2c67b1e8-13ed-11e8-8e45-b75136704291.png)

#### Sleep 1
Due to the fact that the Tasmota main loop now calls `delay()` (even with 1ms) it seems it results in periodically (100ms) enabling the WiFi Modem Sleep mode within the WiFi Manager library. It results in periodically lowering the current to 15-20 mA for ~90ms of each loop:
![sleep 1](https://user-images.githubusercontent.com/6636844/36341400-f129a18a-13ed-11e8-882b-d6640a0c5d61.png)

#### Sleep 100
By increasing the sleep value, there are more and more ~90ms periods with additional lowering of the current to 8-10 mA - I really don't know where this comes from:
![sleep 100 1](https://user-images.githubusercontent.com/6636844/36341463-04485df0-13ef-11e8-8f93-2b6d4c42b4b1.png)

#### Sleep 250
As already noticed with `Sleep 100` the number periods having 8-10 mA instead of 15-20 mA increase again:
![sleep 250 1](https://user-images.githubusercontent.com/6636844/36341493-5696bf48-13ef-11e8-8155-44ac90200df8.png)

The quantity measurement confirms the suspicion that a `Sleep` value &ne; 0 results in reducing the power consumption about 1/3.
