?> **Status LEDs** are the LEDs on the device used to display its state.

Those LEDs are defined in a template or module using `Led1`, `Led2`, `Led3` or `Led4` (or `Led1i`, `Led2i`, `Led3i` or `Led4i`) and additionally using `LedLink` or `LedLinki` (`LedLink` was introduced in version 6.5.0.12). It is not recommended to assign `Led<x>` and `Led<x>i` with the same `<x>` number. Prior to version 6.5.0.12, Tasmota only supported up to two LED components to indicate the power state of the relay(s), and the Wi-Fi/MQTT connectivity status. 

> [!NOTE]
> It is possible to wire in your own LED and assign it as any of the above mentioned but that's outside the scope of this article.

If only one LED is configured, it serves both purposes; the link status LED and/or the LED that indicates the power state of the relay(s). If more than one LED component is defined, `Led1`/`Led1i` will act as the Wi-Fi/MQTT status LED and the next defined LED (e.g., `Led2`/`Led2i`) will act as the LED that indicates the power state of the relay(s). _This is the default behavior_. Configuring a GPIO as an [`LEDLink`/`LEDLinki`](#using-ledlink) component changes this behavior.

<img src="https://raw.githubusercontent.com/blakadder/testdocusite/master/sonoff%20blinking.gif" align=right height=90%>

For example, on a Sonoff Basic the green LED is used as the link status LED. Once the device connects, the LED is used to indicate the relay's power status.

### Link status LED

**Link status LED** shows the network state, more specifically the Wi-Fi and MQTT connection status.

It blinks if the device is not connected to your Wi-Fi AP **and** MQTT broker (if MQTT is enabled). You can change this behaviour with [`LedState`](Commands#ledstate) or turn it off with [`SetOption31`](Commands#SetOption31).

### Power status LED
**Power status LED** shows the power status of relay component(s). [`LedMask`](Commands#ledmask) determines which relay(s) are associated with the power status LED. This behavior can be modified with the [`LedState`](Commands#ledstate) command. The LED is turned off by default when the relay is OFF and turned on when the relay switches ON.

> [!NOTE] Depending on the device design, some LEDs are connected to the same GPIO as the relay. Those cannot be independently controlled since they have to follow the relay state.

If you have more than one LED wired independently and you want it to show the power state of the relay, you must assign an `LedLink` GPIO.

### Using LedLink
`LedLink` / `LedLinki` was introduced with Tasmota version 6.5.0.12. It is used to assign the link status LED. If your device does not have an LED for link status (or you want to use that LED for a different purpose), you can assign `LedLink` to an available free GPIO. When `LedLink(i)` is assigned, other LEDs are automatically linked to their corresponding relay and serve as that relay's power status LED - i.e., `Led<x>(i)` links to `Relay<x>(i)`

### LedPower command
When you use [`LedPower`](Commands#ledpower) you take over control of that particular LED and it stops being linked to its corresponding relay and being its power status LED.
