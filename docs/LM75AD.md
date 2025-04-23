# LM75AD temperature sensor

??? tip "This feature is included only in `tasmota-sensors` and `tasmota32` binaries" 

    When [compiling your build](Compile-your-build) add the following to `user_config_override.h`:
    ```arduino
    #ifndef USE_LM75AD 
    #define USE_LM75AD      // [I2cDriver20] Enable LM75AD sensor (I2C addresses 0x48 - 0x4F) (+0k5 code)
    #endif
    ```

The LM75AD is an I<sup>2</sup>C temperature sensor that converts temperature directly to digital signals from -55°C to +125°C and achieves an accuracy of 0.125°C

>Some features of the LM75A chip not implemented in this driver:   
>-  Programmable temperature threshold and hysteresis set points 
>- Stand-alone operation as thermostat at power-up 

[LM75A Datasheet](https://www.nxp.com/docs/en/data-sheet/LM75A.pdf)

The STDS75 chip is functionally identical to the LM75A, and can be interfaced using the same code as the LM75A.

## Configuration

### Wiring
| LM75AD   | ESP |
|---|---|
|VCC   |3.3V
|GND   |GND   
|SDA   | GPIOx
|SCL   | GPIOy
|OS    | not used

The driver currently only allows the use of a single LM75AD sensor on any of the addresses configurable through pins A0, A1 and A2. These are conveniently broken out on the breakout board either as pins or as solderable joints as can be seen on the example breakout board.

These pins need to be tied down to either GND or VCC (3.3V) and the resulting I<sup>2</sup>C address will be set during power-up according to the table: ![Address MAP](https://github.com/andrethomas/images/raw/master/lm75ad/Address_Map.png)

### Tasmota Settings 
In the **_Configuration -> Configure Module_** page assign:

1. GPIOx to `I2C SDA`
2. GPIOy to `I2C SCL`

After a reboot the driver will detect LM75AD automatically and display Temperature.

### Commands
[`TempOffset`](Commands.md#tempoffset) can be used for calibrating the measured temperature. This setting affects **all** temperature sensors on the device.

### Breakout Boards

<table border="0"><tr><td><img src="https://github.com/andrethomas/images/raw/master/lm75ad/board_lm75ad_top.png"></img></td><td><img src="https://github.com/andrethomas/images/raw/master/lm75ad/board_lm75ad_bot.png" width=220></td></tr></table>


Can also be used standalone if soldered to a board given the diagram is used

![Circuit](https://github.com/andrethomas/images/raw/master/lm75ad/SimpleCircuit.png)

R1 and R2 are pull-up resistors which are required by the I<sup>2</sup>C bus to operate properly. If you have other I<sup>2</sup>C sensors with pull-up resistors connected to the same I<sup>2</sup>C bus it's probably not necessary to have them.
