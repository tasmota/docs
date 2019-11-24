## PowerOnState Functionality

| Command | Description |
|-|-|
|[`PowerOnState`](Commands#poweronstate) | Control relay state after _**powering up**_ the device.<BR> `0` / `OFF` = keep relay(s) OFF after power up <BR> `1` / `ON` = turn relay(s) ON after power up <BR> `2` / `TOGGLE` = toggle relay(s) from last saved state <BR> `3` = switch relay(s) to their last saved state *(default)* <BR> `4` = turn relay(s) ON and disable further relay control <BR> `5` = after a `PulseTime` period turn relay(s) ON (acts as inverted [`PulseTime`](Commands#pulsetime) mode)|

The `PowerOnState` device configuration parameter is applied when the device is initially powered up. _It does not apply to device warm restarts_.

Tasmota tracks the relays' state in a masked variable. A set bit (`1`) means the corresponding **relay** is turned ON. The associated GPIO state will be high or low according to whether the relay is configured as `Relay<x>` or `Relay<x>i`. Every command for setting the relay state is "recorded" in the variable and saved to flash (depending on [`SetOption0`](Commands#setoption0)). The setting of the relay GPIO is then executed.

After a **_warm restart_**, the mask variable is re-initialised with the saved state from flash and the relay(s) set to that state. `PowerOnState` is not executed. During any a device restart, the relay power feedback state is scanned according to the setting of [`SetOption63`](Commands#setoption63). Scanning the relay state attempts to READ from GPIOs that are configured as relays, i.e., OUTPUTS! The result will not always be what is expected as it depends on how the device relays are wired to the GPIO. `SetOption63` was introduced to make this scan optional. With `SetOption63` set to `0` (the default), each GPIO assigned as a `Relay<x>` or `Relay<x>i` is scanned using _'digitalRead'_. The mask variable will be updated with the detected values. The state of the relay(s) will not be changed. READING from an OUTPUT GPIO may result in the mask value being different from the state the relays are in. Thus, `SetOption63` was introduced to disable the startup scan for devices where the scan leads to undefined results.

`SetOption63` is executed after `PowerOnState` or restart initialization.
