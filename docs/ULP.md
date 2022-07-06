# ULP for ESP32 :material-cpu-32-bit:

## Ultra Low Power coprocessor
  
The purpose of this document is not to repeat every information of these documents:  
[https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/ulp.html](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/ulp.html)  
[https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/ulp_instruction_set.html](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/ulp_instruction_set.html)  
  
It will also not make it easy to write assembler code for the ULP and embed it in Berry projects. But it shall guide you through the process of adapting one of many open source examples, do some little changes and setting up a toolchain for personal use cases.  
!!! tip 
    It can even make it easier and substantially faster to rapidly develop assembler projects, because there is no flashing involved in the code deployment, which happens in Berry at runtime.
  
  
### Limits of the ULP
  
To simplify some things:  
Everything in the ULP is limited. There are only 4 registers, very few operations and limited memory access. For some operations it is not possible to use mutable values, but the code must be fixed (for pin/register access) at compile time. That's why you will see lots of defines and constants in basically every example project.  
This was the reason, why for projects like Tasmota it never made sense to include ULP code.  
  
### Advantages of the ULP
Besides the possibility to run code in deep sleep and wake up the system, it can also make sense to run the ULP in parallel to the main system.  
To simplyfy again:  
Everything that is critical to precise timing and is somehow portable to ULP, should run better than on the main cores! This includes the internal temperatur sensor and the hall sensor. Additionally it can free the main cores of some tasks.  
  
### Data exchange between main system and ULP
  
There is a memory region which is located at fixed  address 0x5000000, which is called RTC_SLOW_MEM. This is the only region that is accessible from main cores and the ULP. It is the coders job to find a way to control the data flow, by reading and writing from and to certain addresses. The toolchains down below will print out data, that will show, where accessible variable can be found to access from Berry with `ULP.get_mem()` and `ULP.set_mem()`.  
  
### General program flow
  
A typical ULP program is started from the main core at the position of the so called *global entry point*. Then it executes its chain of commands and ends with a `halt` command. It is technically possible to create a run loop inside the code and to not end with `halt`. But typically such a loop is realized with a wakeup timer, that restarts the programm with a certain interval, which can be set with `ULP.wake_period(register,time in microseconds)`. The register is numbered from 0 to 4 and can be changed in the assembly code with `sleep register`.  
  
### Tasmota conventions
  
The assembly code can be divided in different sections of which the so called `.text`sections contains the programm, but can hold variables or arbitrary data too. In general for the assembler it is not so important, where the functions or the *global entry point* is located.  
But for Tasmota the rule is, that the global entry point or a jump to it is located at position 0 in RTC_SLO_MEM. That way ULP.run() can always point to this addresss 0.  
It is a design decision to keep the ULP module as small as possible and the addition of more internal functions shall be avoided, i.e. for doing setup of GPIO/RTC pins. If possible, this should be done in assembly code.  
  
!!! example 
``` asm
// rtc_gpio_isolate(12) translates to:
WRITE_RTC_REG(RTC_IO_TOUCH_PAD5_REG, 27, 1, 0) //disable pullup
WRITE_RTC_REG(RTC_IO_TOUCH_PAD5_REG, 28, 1, 0) //disable pulldown
WRITE_RTC_REG(RTC_IO_TOUCH_PAD5_REG, 13, 1, 0) //disable input
WRITE_RTC_REG(RTC_GPIO_ENABLE_W1TS_REG, 29, 1, 0) //disable output
WRITE_RTC_REG(RTC_IO_TOUCH_PAD5_REG, 31, 1, 1) //hold
```
  

## Using external toolchains for this driver  
  
There are 2 ways to assemble code for later use in Tasmota. In theory every external ULP project, which fits in the reserved memory space that is defined in the framework package used to compile the Tasmota firmware, should be convertible. This limit is subject to change.  
  
### Micropython and micropython-esp32-ulp
  
A great project to run ULP code in Micropython on the ESP32 can be used to assemble and export the same projects to Tasmota.  
There are ports of Micropython for Linux, Windows and Mac, which must be installed to the system of your choice. Run it and in the Micropython console install like that:  
``` py
import upip
upip.install('micropython-esp32-ulp')
```
  
After that your are ready to assemble.  
The ULP code is embedded as a multiline string in Micropython scripts. For use in Tasmota it makes sense to make some changes, that are described in an [ulp_template.py](https://github.com/Staars/berry-examples/blob/main/ulp_helper/ulp_template.py) and to use this template by replacing the surce code string with the new code.  
!!! tip
    The Micropython module can not really include external headers, but it offers a very conveniant database function as described here:   [link:preprocess](https://github.com/micropython/micropython-esp32-ulp/blob/master/docs/preprocess.rst)  
    Otherwise the missing defines must be added amnually.

After you created or did download your `ulp_app.py` you can export the data with 'micropython ulp_app.py' to the console, from where it can be copy pasted to the Berry console or to your Berry project.  
!!! tip
    It is recommended to embed the setup steps for GPIO pins or ADC to the bottom part of this `ulp_app.py` by printing Berry commands for easier testing in the Berry console.
  

###  Export from ESP-IDF project with helper Python script
  
Many projects are using the ESP-IDF with CMAKE and will be compiled with `idf.py build`. We can extract the ULP code without flashing this project, by starting a helper Python ([binS2Berry.py](https://github.com/Staars/berry-examples/blob/main/ulp_helper/binS2Berry.py) script in the root level of the project, which prints the same information to console as the Micropython way.  
Thus the ULP projects that may fail to assemble in Micropython can be used too. But usually the route via Micropython makes it easier to pack everything nicely together.
  
  

## Examples
  
This is all about porting and adapting existing code. Thank you to everyone who is sharing their ULP code!!  
  
### Blink an LED
  
Let's take a look at [https://github.com/micropython/micropython-esp32-ulp/blob/master/examples/blink.py](https://github.com/micropython/micropython-esp32-ulp/blob/master/examples/blink.py).  
  
1.  Use a copy of [ulp_template.py](https://github.com/Staars/berry-examples/blob/main/ulp_helper/ulp_template.py)  and name it to your liking.
2.  Replace the `source` string of the template with the version of the example.
    The `.text`section starts with:
    ``` asm
    .text
    magic: .long 0
    state: .long 0
    ```
    this must become:
    ``` asm
    .text
    jump entry
    magic: .long 0
    state: .long 0
    ```
3.  This is already enough to assemble. For convenience it is recommended to add a line to the last section (with multiple "prints") with content: `print("ULP.wake_period(0, 500000)")`. 
  
Done!
  
Now let's modify the code slightly for different intervals for "on" and "off".

1. Add a second wake period with `print("ULP.wake_period(1, 200000)")`.
2. Add `sleep` commmands to the source code like so:
    ``` asm
    on:
    # turn on led (set GPIO)
    WRITE_RTC_REG(RTC_GPIO_ENABLE_W1TS_REG, RTC_GPIO_ENABLE_W1TS_S + gpio, 1, 1)
    sleep 0
    jump exit

    off:
    # turn off led (clear GPIO)
    WRITE_RTC_REG(RTC_GPIO_ENABLE_W1TC_REG, RTC_GPIO_ENABLE_W1TC_S + gpio, 1, 1)
    sleep 1
    jump exit
    ```
  
The console output should look something like that:  
  
``` berry
    #You can paste the following snippet into Tasmotas Berry console:
    import ULP
    ULP.wake_period(0,500000) # on time
    ULP.wake_period(1,200000) # off time 
    c = bytes("756c70000c006c...") # cut version for Tasmota docs
    ULP.load(c)
    ULP.run()
```
  
After executing it the builtin LED should blink (if wired to the usual GPIO 2).
You can change the wake intervals on-the-fly with i.e. `ULP.wake_period(1, 800000)` in the Berry console.

Now on to something more complex with wake from deep sleep.
  
### Hall sensor
  
We have a working example here: [https://github.com/duff2013/ulptool/blob/master/src/ulp_examples/ulp_hall_sensor/hall_sensor.s](https://github.com/duff2013/ulptool/blob/master/src/ulp_examples/ulp_hall_sensor/hall_sensor.s)
  
Converting is possible in the same manner as before. Start with  `ulp_template.py`, replace the string with the content of the .s file and make sure you have the include database properly populated or you add the missing defines from the header files manually.  
Additionally we need to setup the ADC pins with the help of `ULP.adc_config()`. In this particular example the resulting code is (in the form of print outputs placed in the .py file):  

``` berry
print("ULP.adc_config(0,2,3)") # adc1_config_channel_atten(ADC1_CHANNEL_0, ADC_ATTEN_DB_6);
print("ULP.adc_config(3,2,3)") # adc1_config_channel_atten(ADC1_CHANNEL_3, ADC_ATTEN_DB_6); + adc1_config_width(ADC_WIDTH_BIT_12);
```
  
The entry point is already at address zero, so there are no changes needed to assemble, load and start he ULP programm in Tasmota. In the console output we can find the positions of the variables which hold the voltage measurements and can read out it values. 
  
In order to use this whole construction to wake the ESP32 with the help of a magnet, we now have to do some measurements to find feasible threshold values. 
This can be done by calculating the difference between  `Sens_Vpx` and `Sens_Vnx` in Berry. Then place the magnet of your choice near the ESP32 and note how these values change. If the magnet is strong enough, chances are great, that you find a stable threshold.  
Now let's add some assembly code!  
  
We can add some constants in the header part of the code (that worked with a tested weak magnet):
``` asm
    .set threshold_pos   , 7
    .set threshold_neg   , 2
```
  
Now append some variables to the end of the .bss section:  
``` asm
  .global Sens_Diff_p1
Sens_Diff_p1:
  .long 0
  
  .global Sens_Diff_n1
Sens_Diff_n1:
  .long 0
```
  
The we need some code, which replaces line 135 and 136 of the original example:  
``` asm
/* calculate differences */
    move r3, Sens_Vn1
    ld r3, r3, 0
    move r2, Sens_Vn0
    ld r2, r2, 0
    sub r3, r2, r3         # eventually change to sub r3, r2, r3 for your setup
    move r2, Sens_Diff_n1
    st r3,r2,0
    move r3, Sens_Vp1
    ld r3, r3, 0
    move r2, Sens_Vp0
    ld r2, r2, 0
    sub r3, r3, r2          # eventually change to sub r3, r2, r3 for your setup
    move r2, Sens_Diff_p1
    st r3,r2,0
    
/* wake up */
    ld r0,r2,0 # Sens_Diff_p1
    JUMPR wake_up, threshold_pos, GE
```
  
After loading and starting you can send the ESP to deepsleep. For testing it is recommended to add the optional wake timer as a fallback:  
`ULP.sleep(30)` 
  
Try to wake up the system with the magnet.  

But is there a way to circumvent the limitation of this example, that forces us to set the threshold value as a constant? Well ... yes, we can do some hacky stuff.  
  
We must dig a little deeper, to understand how the 32-bit instructions are constructed. Let's look at the `jumpr` command, which is defined in ulp.h like that:  
  
``` c
    struct {
        uint32_t imm : 16;          /*!< Immediate value to compare against */
        uint32_t cmp : 1;           /*!< Comparison to perform: B_CMP_L or B_CMP_GE */
        uint32_t offset : 7;        /*!< Absolute value of target PC offset w.r.t. current PC, expressed in words */
        uint32_t sign : 1;          /*!< Sign of target PC offset: 0: positive, 1: negative */
        uint32_t sub_opcode : 3;    /*!< Sub opcode (SUB_OPCODE_B) */
        uint32_t opcode : 4;        /*!< Opcode (OPCODE_BRANCH) */
    } b;                            /*!< Format of BRANCH instruction (relative address, conditional on R0) */
```
  
The constant (= immediate) value is stored in the upper 16 bits and we can access in the byte buffer. To find the address of the command we can simply add a label in the code:  
  
``` asm
  .global jmp_threshold
jmp_threshold:
    JUMPR wake_up, threshold_pos, GE
```
  
This will get printed to the console while assembling. Then in Berry we can do a:  
  
``` berry
    var c = bytes("...")
    # jmp_threshold is the 32-bit-address in RTC_SLOW_MEM
    var jmp_threshold = 51
    var cmd = c.get((3+jmp_threshold)*4, 2) # 3 is header length in long words
    var threshold = 9 # or whatever
    c.set(3+jmp_threshold)*4, threshold, 2)
    ULP.load(c)
```  
  
Now we can change these constant values on the fly.  

 

### I2C access
  
Although there are special assembler commands to access I2C devices the most common method in the examples on GitHub is bitbanging. This is reported to be more reliable and circumvents some limitations (only 2 pin combinations and bytewise access with special I2C commands).  
Nearly every example is based on some very clever macros and control flow tricks, that replicate a simple stack and subroutines (similiar to a library), which is a good example for the "Art of coding".  
To make it assemble in Micropython we need some functions in the Micropython-script, that can expand the macros. These functions are in a very early stage of development and might eventually later find their way into the micropython-esp32-ulp project after more refinement.  
!!! tip
    If your examples do not assemble in Micropython, please try out the ESP-IDF variant.
  
An example for the BH-1750 light sensor can be found here:
[https://github.com/duff2013/ulptool/tree/master/src/ulp_examples/ulp_i2c_bitbang](https://github.com/duff2013/ulptool/tree/master/src/ulp_examples/ulp_i2c_bitbang)
  
With our techniques from above the concatenation of the .s files results in:   [BH-1750](https://github.com/Staars/berry-examples/blob/main/ulp_examples/ulp_I2C_BH1750.py)


... to be continued
