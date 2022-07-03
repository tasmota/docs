# ULP for ESP32 :material-cpu-32-bit:

## Ultra Low Power coprocessor
  
The purpose of this document is not to repeat every information of this document: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/ulp.html
  
It will also not make it easy to write assembler code for the ULP and embed it in Berry projects. But it shall guide you through the process of adapting one of many open source examples, do some little changes and setting up a toolchain for personal use cases.  
It can even make it easier and substantially faster to rapidly develop assembler projects, because there is no flashing involved in the code deployment, which happens in Berry at runtime.  
  
### Limits of the ULP
  
To simplify some things:  
Everything in the ULP is limited. There are only 4 registers, very few operations and limited memory access. For some operations it is not possible to use mutable values, but the code must be fixed (for pin/register access) at compile time. That's why you will see lots of defines and constants in basically every example project.  
This was the reason, why for projects like Tasmota it never made sense to include ULP code.  
  
### Advantages of the ULP
Besides the possibility to run code in deep sleep and wake up the system, it can also make sense to run the ULP in parallel to the main system.  
To simplify again:  
Everything that is critical to precise timing and is somehow portable to ULP, should run better than on the main cores! This includes the internal temperatur sensor and the hall sensor. Additionally it can free the main cores of some tasks.  
  
### Data exchange between main system and ULP
  
There is a memory region which is located at fixed  address 0x5000000, which is called RTC_SLOW_MEM. This is the only region that is accessible from main cores and the ULP. It is the coders job to find a way to control the data flow, by reading and writing from and to certain addresses. The toolchains down below will print out data, that will show, where accessible variable can be found to access from Berry with `ULP.get_mem()` and `ULP.set_mem`.
  
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
The ULP code is embedded as a multiline string in Micropython scripts. For use in Tasmota it makes sense to make some changes, that are described in an `ulp_template.py`.  
After you created or did download your 'ulp_app.py' you can export the data with 'micropython ulp_app.py' to the console, from where it can be copy pasted to the Berry console or to your Berry project.
  

###  Export from ESP-IDF project with helper Python script
  
Many projects are using the ESP-IDF with CMAKE and will be compiled with `idf.py build`. We can extract the ULP code without flashing this project, by starting a helper Python (`binS2Berry.py`) script in the root level of the project, which prints the same information to console as the Micropython way.


... to be continued
