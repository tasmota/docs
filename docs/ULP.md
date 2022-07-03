# ULP for ESP32 :material-cpu-32-bit:

## Ultra Low Power coprocessor
  
The purpose of this document is not to repeat every information of these documents: []https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/ulp.html
[]https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/ulp_instruction_set.html
  
It will also not make it easy to write assembler code for the ULP and embed it in Berry projects. But it shall guide you through the process of adapting one of many open source examples, do some little changes and setting up a toolchain for personal use cases.  
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
  
Example:  
`rtc_gpio_isolate(12)` 
translates to:  
```
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
```
import upip
upip.install('micropython-esp32-ulp')
```
  
After that your are ready to assemble.  
The ULP code is embedded as a multiline string in Micropython scripts. For use in Tasmota it makes sense to make some changes, that are described in an `ulp_template.py` and to use this template by replacing the surce code string with the new code.  
The Micropython module can not really include external headers, but it offers a very conveniant database function as described here: []https://github.com/micropython/micropython-esp32-ulp/blob/master/docs/preprocess.rst  

After you created or did download your `ulp_app.py` you can export the data with 'micropython ulp_app.py' to the console, from where it can be copy pasted to the Berry console or to your Berry project.  
It is recommended to embed the setup steps for GPIO pins or ADC to the bottom part of this `ulp_app.py` for easier testing in the Berry console.
  

###  Export from ESP-IDF project with helper Python script
  
Many projects are using the ESP-IDF with CMAKE and will be compiled with `idf.py build`. We can extract the ULP code without flashing this project, by starting a helper Python (`binS2Berry.py`) script in the root level of the project, which prints the same information to console as the Micropython way.  
Thus the ULP projects that may fail to assemble in Micropython can be used too. But usually the route via Micropython makes it easier to pack everything nicely together.
  

## Examples
  
This is all about porting and adapting existing code. 
  
### Blink an LED
  
Let's take a look at [](https://github.com/micropython/micropython-esp32-ulp/blob/master/examples/blink.py).  
  
1.  Use a copy of `ulp_template.py`  and name it to your liking.
2.  Replace the `source` string of the template with the version of the example.
    The `.text`section starts with:
    ````
    .text
    magic: .long 0
    state: .long 0
    ```
    this must become:
    ````
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
    ```
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
````
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
  

... to be continued
