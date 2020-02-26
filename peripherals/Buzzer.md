**»6.6.0.4**

Tasmota gives you the option to control the sound pattern of a buzzer. 

> [!NOTE]
> A device LED can be assigned as a `Buzzer` component to display a blink pattern.

## Buzzer command
Parameters for the `Buzzer` command can be

`<count>,<beep>,<silence>,<tune>`    
all parameters are optional. *(default is `1,1,1` (one 100 millisecond beep))*.

`<count>`   
number of beeps
`-1` for infinite, `-2` to follow state of LED1;» v8.1.0.6

`<beep>`    
duration of one beep in 100 millisecond steps

`<silence>`   
duration of silence between beeps 100 millisecond steps

`<tune>`    
is a 32-bit [bitmask](https://en.wikipedia.org/wiki/Mask_(computing)#Masking_bits_to_1) where a `1` bit beeps and a `0` bit is silence according to `<beep>` and `<silence>`, respectively. The tune is played from most significant bit (MSB) to least significant bit (LSB). Leading and trailing `0` bits are ignored. If `<tune>` is specified, `<count>` is ignored (`<count>` for `<tune>` supported in » v8.1.0.6). If `<tune>` is `0`, it is ignored.

Examples:
`3` - Beep three times with 100 milliseconds duration and 100 milliseconds pause<BR>
`2,3` - Beep twice with 300 milliseconds duration and 100 milliseconds pause<BR>`2,3,4` - Beep twice with 300 milliseconds duration and 400 milliseconds pause<BR>`1,2,3,0xF54` (0000 0000 0000 0000 0000 1111 0101 0100). Each `1` bit beeps for 200 milliseconds and each bounded `0` bit pauses for 300 milliseconds


`0` = stop active buzzer cycle &emsp;» v6.6.0.18
