*Introduced in v6.6.0*

LedMask command allows setting a [bitmask](https://en.wikipedia.org/wiki/Mask_(computing)#Masking_bits_to_1) which specifies which relays control the LED indicator used to display whether a relay is latched/powered. The order of the `<bitmask>` is from most significant bit (MSB) to least significant bit (LSB). Bit 15 (MSB) masks Relay16 through bit 0 (LSB) which masks Relay1, respectively. For each  relay to be included in controlling the power LED, set its corresponding bit in the `<bitmask>` to `1`. `<bitmask>` bits without corresponding configured relay components have no effect and can be ignored.

`<bitmask>` = [bitwise](https://whatis.techtarget.com/definition/bitwise) value representing each relay. Values may be entered as either hexadecimal or decimal values (e.g., 0xFFFF = 65535).    
`0xFFFF` (= 1111 1111 1111 1111) All relays control the power LED _(default)_

*[LedState](Commands#LedState) must be enabled (i.e., `!= 0`) in order for `LedMask` to take effect.*

#### Examples:
<li>`LedMask 0xFFFD` Every relay, except Relay2, controls the power LED (0xFFFD = 1111 1111 1111 1101)</li>
<li>`LedMask 0x0002` Only Relay 2 controls the power LED (0x0002 = 0000 0000 0000 0010)</li>
