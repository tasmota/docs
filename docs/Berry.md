# Berry Scripting Language
!!! info "This feature is experimental, ESP32 only and included in all ESP32 pre-compiled builds"

If you compile your own version, make sure the following is defined:

```arduino
#define USE_BERRY
```

<img style="float:right;height:40px" alt="Berry logo" src="../_media/berry/berry.svg">

See full examples in the [Berry Cookbook](Berry-Cookbook.md)

## Introduction to Berry

Berry is the next generation scripting for Tasmota. It is based on the open-source Berry project, deliveting an ultra-lightweight dynamically typed embedded scripting language. It is designed for lower-performance embedded devices. 

[**Berry Github**](https://github.com/Skiars/berry)

Berry Scripting allows simple and advanced extension of Tasmota, for example:

- simple scripting and advanced Rules
- advanced rules, beyond what is possible with native rules
- advanced automation

Berry Scripting takes it one step further and allows to build dynamic extensions to Tasmota, that would previously require native code:

- build light animations
- build I2C drivers
- build complete Tasmota drivers
- integrate native libraries like `lvgl` (coming soon)


### About the Berry language

Berry has the following advantages:

- Lightweight: A well-optimized interpreter with very little resources. Ideal for use in microprocessors.
- Fast: optimized one-pass bytecode compiler and register-based virtual machine.
- Powerful: supports imperative programming, object-oriented programming, functional programming.
- Flexible: Berry is a dynamic type script, and it's intended for embedding in applications. It can provide good dynamic scalability for the host system.
- Simple: simple and natural syntax, support garbage collection, and easy to use FFI (foreign function interface).
- RAM saving: With compile-time object construction, most of the constant objects are stored in read-only code data segments, so the RAM usage of the interpreter is very low when it starts.

### Tasmota port

Berry Scripting in only supported on Tasmota32 for ESP32. The RAM usage starts at ~10kb and will be later optimized. Berry uses PSRAM on ESP32 if available (PSRAM is external RAM attached to Esp32 via SPI, it is slower but larger than internal RAM.

## Quick Tutorial

Make sure you compile Tasmota32 with `#define USE_BERRY`.

You should see similare lines in the Tasmota logs:

```
00:00:00.098 BRY: Berry initialized, RAM used=10002
00:00:00.264 BRY: No 'autoexec.be' file
```

Click on *Configuration* then *Berry Scripting Console* and enjoy the colorful Berry console, also called REPL (Read-Eval-Print-Loop).

![Berry console](https://user-images.githubusercontent.com/49731213/111880607-c193c800-89ac-11eb-81c9-a3558e26a1de.png)

### Getting familiar with the REPL

Try typing simple commands in the REPL. Since the input can be multi-lines, press 'Enter' twice to run the code. Use Up/Down arrows to navigate through history of previous commands.

```python
> 1+1
2
```

```python
> 2.0/3
0.666667
```

```python
> print('Hello Tasmota!')
Hello Tasmota!
```

Note: Berry's native `print()` command displays text in the Berry Console and in the Tasmota logs. To log with finer control, you can also use the `log()` function, but it will not display in the Berry Console.


```python
> print('Hello Tasmota!')
  log('Hello again')
Hello Tasmota!
```

Meanwhile the Tasmota log shows:

> tasmota.cmd("Dimmer 60")
{"POWER":"ON","Dimmer":60,"Color":"996245","HSBColor":"21,55,60","Channel":[60,38,27]}
The light is bright
```
The rule function have the general form below where parameters are optionals:

```python
def function_name(value, trigger, msg)
  ...
end
```

Parameter|Description
:---|:---
`value`|The value of the trigger. Similar to `%value%` in native rules.
`trigger`|`string` of the trigger with all levels. Can be used if the same function is used with multiple triggers.
`msg`|`string` of the message that triggered the rule. If it is a JSON, it has to be explicitly converted to a map object with `json.load(msg)`.

Example:

```python
> def dimmer_over_50()
    print("The light is bright")
  end
  tasmota.add_rule("Dimmer>50", dimmer_over_50)
```

```python
> tasmota.cmd("Dimmer 30")
{"POWER":"ON","Dimmer":30,"Color":"4D3223","HSBColor":"21,55,30","Channel":[30,20,14]}

> tasmota.cmd("Dimmer 60")
{"POWER":"ON","Dimmer":60,"Color":"996245","HSBColor":"21,55,60","Channel":[60,38,27]}
The light is bright
```

The same fucntion can be used with multiple triggers.

Example if the function to process an ADC input should be triggered both by the `tele/SENSOR`
message and the result of a `Status 10` command:

```python
tasmota.add_rule("ANALOG#A1", rule_adc_1)
tasmota.add_rule("StatusSNS#ANALOG#A1", rule_adc_1)
```

Or if the same function is used to process similar triggers:
```python
import string

def rule_adc(value, trigger)
  i=string.find(trigger,"#A")
  tr=string.split(trigger,i+2)
  adc=number(tr[1])
  print("value of adc",adc," is ",value)
end

tasmota.add_rule("ANALOG#A1",rule_adc)
tasmota.add_rule("ANALOG#A2",rule_adc)
```

Another way to address the same using anonymous functions created dynamically
```python
def rule_adc(adc, value)
  print("value of adc",adc," is ",value)
end
tasmota.add_rule("ANALOG#A1",def (value) rule_adc(1,value) end )
tasmota.add_rule("ANALOG#A2",def (value) rule_adc(2,value) end )
```

## A word on functions and closure

Berry is a functional language, and includes the very powerful concept of a *closure*. In a nutshell, it means that when you create a function, it can capture the values of variables when the function was created. This roughly means that it does what intuitively you would expect it to do.

When using Rules or Timers, you always pass a Berry functions.

## Timers

Berry code, when it is running, blocks the rest of Tasmota. This means that you should not block for too long, or you may encounter problems. As a rule of thumb, try to never block more than 50ms. If you need to wait longer before the next action, use timers. As you will see, timers are very easy to create thanks to Berry's functional nature.

All times are in milliseconds. You can know the current running time in milliseconds since the last boot:

```python
> tasmota.millis()
9977038
```

Sending a timer is as easy as `tasmota.set_timer(<delay in ms>,<function>)`

Example:

```python
> def t() print("Booh!") end

> tasmota.set_timer(5000, t)
[5 seconds later]
Booh!
```

## Lights and Relays

Berry provides complete support for Relays and Lights.

You can control individual Relays or lights with `tasmota.get_power()` and `tasmota.set_power()`.

`tasmota.get_power()` returns an array of booleans represnting the state of each relays and light (light comes last).

`tasmota.set_power(relay, onoff)` changes the state of a single relay/light.

Example (2 relays and 1 light):

```python
> tasmota.get_power()
[false, true, false]

> tasmota.set_power(0, true)
true

> tasmota.get_power()
[true, true, false]
```

For light control, `light.get()` and `light.set` accept a structured object containing the following arguments:

Attributes|Details
:---|:---
power|`boolean`<br>Turns the light off or on. Equivalent to `tasmota.set_power()`. When brightness is set to `0`, power is automatically set to off. On the contrary, you need to specify `power:true` to turn the light on.
bri|`int range 0..255`<br>Set the overall brightness. Be aware that the range is `0..255` and not `0..100` as Dimmer.
hue|`int 0..360`<br>Set the color Hue in degree, range 0..360 (0=red).
sat|`int 0..255`<br>Set the color Saturation (0 is grey).
ct|`int 153..500`<br>Set the white color temperature in mireds, ranging from 153 (cold white) to 500 (warm white)
rgb|`string 6 hex digits`<br>Set the color as hex `RRGGBB`, changing color and brightness.
channels|`array of int, ranges 0..255`<br>Set the value for each channel, as an array of numbers

When setting attributes, they are evaluated in the following order, the latter overriding the previous: `power`, `ct`, `hue`, `sat`, `rgb`, `channles`, `bri`.


```python
  # set to yellow, 25% brightness
> light.set({"power": true, "hue":60, "bri":64, "sat":255})
{'bri': 64, 'hue': 60, 'power': true, 'sat': 255, 'rgb': '404000', 'channels': [64, 64, 0]}

  # set to RGB 000080 (blue 50%)
> light.set({"rgb": "000080"})
{'bri': 128, 'hue': 240, 'power': true, 'sat': 255, 'rgb': '000080', 'channels': [0, 0, 128]}

  # set bri to zero, also powers off
> light.set({"bri": 0})
{'bri': 0, 'hue': 240, 'power': false, 'sat': 255, 'rgb': '000000', 'channels': [0, 0, 0]}

  # chaning bri doesn't automatically power
> light.set({"bri": 32, "power":true})
{'bri': 32, 'hue': 240, 'power': true, 'sat': 255, 'rgb': '000020', 'channels': [0, 0, 32]}

  # set channels as numbers (purple 12%)
> light.set({"channels": [32,0,32]})
{'bri': 32, 'hue': 300, 'power': true, 'sat': 255, 'rgb': '200020', 'channels': [32, 0, 32]}
``` 


## Loading code from filesystem

You can upload Berry code in the filesytem and load them at runtime. Just be careful to use the `*.be` extensions.

To load a Berry file, use the `load(filename)` function. It takes a filename and must end by `.be` or `.bec`.

Note: you don't need to prefix with `/`. A leading `/` will be added automatically if it is not present.

When loading a Berry script, the compiled bytecode is automatically saved to the filesystem, with the extension `.bec` (this is similar to Python's `.py`/`.pyc` mechanism). The `save(filename,closure)` function is used internally to save the bytecode.

Currently the precompiled is not loaded unless you explicitly use `load("filename.bec")` extension, this may change in the future.

## Reference

Below are the Tasmota specific functions and modules implemented on top of Berry.

### Extensions to native Berry

#### `log(msg:string [, level:int = 3]) -> string`

Logs a message to the Tasmota console. Optional second argument is log_level (0..4), default is `2` `LOG_LEVEL_INFO`.

Example:

```
> log("A")
A
```

#### `load(filename:string) -> int`

Loads a Berry script from the filesystem, and returns an error code; `0` means no error. Filename does not need to start with `/`, but needs to end with `.be` (Berry source code) or `.bec` (precompiled bytecode).

When loading a source file, the precompiled bytecode is saved to filesystem using the `.bec` extension.


#### `save(filename:string, f:closure) -> nil`

Internally used function to save bytecode. It's a wrapper to the Berry's internal API `be_savecode()`. There is no check made on the filename.

Note: there is generally no need to use this function, it is used internally by `load()`.

### **`tasmota` object**

A root level object called `tasmota` is created and contains numerous functions to interact with Tasmota.

Tasmota Function|Parameters and details
:---|:---
tasmota.get\_free\_heap<a class="cmnd" id="tasmota_get_free_heap"></a>|`() -> int`<br>Returns the number of free bytes on the Tasmota heap.
tasmota.publish<a class="cmnd" id="tasmota_publish"></a>|`(topic:string, payload:string[, retain:bool]) -> nil`<br>Equivalent of `publish` command, publishes a MQTT message on `topic` with `payload`. Optional `retain` parameter.
tasmota.cmd<a class="cmnd" id="tasmota_cmd"></a>|`(command:string) -> string`<br>Sends any command to Tasmota, like it was type in the console. It returns the result of the command if any.
tasmota.millis<a class="cmnd" id="tasmota_millis"></a>|`([delay:int]) -> int`<br>Returns the number of milliseconds since last reboot. The optional parameter lets you specify the number of milliseconds in the future; useful for timers.
tasmota.time\_reached<a class="cmnd" id="tasmota_time_reached"></a>|`(timer:int) -> bool`<br>Checks whether the timer (in milliseconds) has been reached or not. Always use this function and don't do compares between `millis()` and timers, because of potential sign and overflow issues.
tasmota.rtc<a class="cmnd" id="tasmota_rtc"></a>|`() -> map`<br>Returns clockwall time with variants.<br>Example: `{'local': 1619560407, 'utc': 1619556807, 'timezone': 60, 'restart': 1619556779}`
tasmota.time\_dump<a class="cmnd" id="tasmota_time_dump"></a>|`(map) -> map`<br>Decompose a time value (in seconds) to its components<br>Example: `tasmota.time_dump(1619560407)` -> `{'weekday': 2, 'sec': 27, 'month': 4, 'year': 2021, 'day': 27, 'min': 53, 'hour': 21}`
tasmota.time\_str<a class="cmnd" id="tasmota_time_str"></a>|`(map) -> string`<br>Converts a time value (in seconds) to an ISO 8601 string<br>Example: `tasmota.time_str(1619560407)` -> `2021-04-27T21:53:27`
tasmota.yield<a class="cmnd" id="tasmota_yield"></a>|`() -> nil`<br>Calls Arduino framework `yield()` function to give back some time to low-level functions, like Wifi. Prevents WDT watchdog from happening.
tasmota.delay<a class="cmnd" id="tasmota_delay"></a>|`([delay:int]) -> int`<br>Waits and blocks execution for `delay` milliseconds. Should ideally never wait more than 10ms and absolute max 50ms. Otherwise use `set_timer`.
tasmota.add\_rule<a class="cmnd" id="tasmota_add_rule"></a>|`(pattern:string, f:function) ->nil`<br>Adds a rule to the rule engine. See above for rule patterns.
tasmota.remove\_rule<a class="cmnd" id="tasmota_remove_rule"></a>|`(pattern:string) ->nil`<br>Removes a rule to the rule engine. Silently ignores the pattern if no rule matches.
tasmota.gc<a class="cmnd" id="tasmota_gc"></a>|`() -> int`<br>Triggers a garbage collaction of Berry objects and returns the bytes currently allocated. This is for debug only and shouldn't be normally used. GC is otherwise automatically triggeredd when necessary.

Functions used to retrieve Tasmota configuration

Tasmota Function|Parameters and details
:---|:---
tasmota.get\_option<a class="cmnd" id="tasmota_get_option"></a>|`(index:int) -> int`<br>Returns the value of `SetOption <index>`
tasmota.wire\_scan<a class="cmnd" id="tasmota_wire_scan"></a>|`(addr:int [, index:int]) -> wire instance or nil`<br>Scan both I2C buses for a device of address addr, optionally taking into account disabled devices via `I2CDevice`. Returns a `wire` object corresponding to the bus where the device is, or `nil` if device is not connected or disabled.
tasmota.i2c\_enabled<a class="cmnd" id="tasmota_i2c_enabled"></a>|`(index:int) -> bool`<br>Returns true if the I2C module is enabled, see I2C page.


Functions to create custom Tasmota command.

Tasmota Function|Parameters and details
:---|:---
tasmota.add\_cmd<a class="cmnd" id="tasmota_add_cmd"></a>|`(name:string, f:function) -> nil`<br>Adds a command to Tasmota commands. Command names are case-insensitive. Command names are analyzed after native commands and after most commands, so you can't override a native command.
tasmota.resp\_cmnd_str<a class="cmnd" id="tasmota_resp_cmnd_str"></a>|`(message:string) -> nil`<br>Sets the output for the command to `message`.
tasmota.resp\_cmnd\_str\_done<a class="cmnd" id="tasmota_resp_cmnd_done"></a>|`(message:string) -> nil`<br>Sets the output for the command to "Done" (localized message).
tasmota.resp\_cmnd\_str\_error<a class="cmnd" id="tasmota_resp_cmnd_error"></a>|`(message:string) -> nil`<br>Sets the output for the command to "Error" (localized message).
tasmota.resp\_cmnd\_str\_fail<a class="cmnd" id="tasmota_resp_cmnd_fail"></a>|`(message:string) -> nil`<br>Sets the output for the command to "Fail" (localized message).
tasmota.resp\_cmnd<a class="cmnd" id="tasmota_resp_cmnd"></a>|`(message:string) -> nil`<br>Overrides the entire command response. Should be a valid JSON string.
tasmota.remove\_cmd<a class="cmnd" id="tasmota_remove_cmd"></a>|`(name:string) -> nil`<br>Remove a command to Tasmota commands. Removing an non-existing command is skipped silently.

Functions to add custom responses to JSON and Web UI.

Tasmota Function|Parameters and details
:---|:---
tasmota.response\_append<a class="cmnd" id="tasmota_response_append"></a>|`(name:string) -> nil`<br>Adds JSON fragment to the current response. Used for example for sensors to add JSON to teleperiod.
tasmota.web\_send<a class="cmnd" id="tasmota_web_send"></a>|`(message:string) -> nil`<br>Adds an HTML fragment to the Web output.
tasmota.web\_send\_decimal<a class="cmnd" id="tasmota_web_send_decimal"></a>|`(message:string) -> nil`<br>Adds an HTML fragment to the Web output, similar to `web_send` but converts decimal dot `.` to the locale decimal separator.

See examples in the [Berry-Cookbook](Berry-Cookbook#adding-commands-to-tasmota)

Functions to manage Relay/Lights


Tasmota Function|Parameters and details
:---|:---
tasmota.get\_power<a class="cmnd" id="tasmota_get_power"></a>|`() -> list[bool]`<br>Returns the state On/Off of each Relay and Light as a list of bool.
tasmota.set\_power<a class="cmnd" id="tasmota_set_power"></a>|`(index:int, onoff:bool) -> bool`<br>Sets the on/off state of a Relay/Light. Returns the previous status of the Relay/Light of `nil` if index is invalid.<br>Example:<br>```> tasmota.get_power()```<br>```[true]```
tasmota.get\_light<a class="cmnd" id="tasmota_get_light"></a>|_deprecated_ use `light.get`
tasmota.set\_light<a class="cmnd" id="tasmota_set_light"></a>|_deprecated_ use `light.set`


### **`light` object**

Module `light` is automatically imported via a hidden `import light` command.


Tasmota Function|Parameters and details
:---|:---
light.get<a class="cmnd" id="light_get"></a>|`(index:int) -> map`<br>Get the current status if light number `index` (default:0).<br>Example:<br>```> light.get```<br>```{'bri': 77, 'hue': 21, 'power': true, 'sat': 140, 'rgb': '4D3223', 'channels': [77, 50, 35]}```
light.set<a class="cmnd" id="light_set"></a>|`(settings:map[, index:int]) -> map`<br>Sets the current state for light `index` (default: 0.<br>Example:<br>```> light.set({'hue':120,'bri':50,'power':true})```<br>```{'bri': 50, 'hue': 120, 'power': true, 'sat': 140, 'rgb': '173217', 'channels': [23, 50, 23]}```
light.gamma10<a class="cmnd" id="light_gamma10"></a>|`(channel) -> int`<br>Computes the gamma corrected value with 10 bits resolution for input and output. Note: Gamma is optimized for speed and smooth fading, and is not 100% mathematically accurate.<br>Input and output are in range 0..1023.
light.reverse\_gamma10<a class="cmnd" id="light_reverse_gamma10"></a>|`(gamma) -> int`<br>Computes the reverse gamma with 10 bits resolution for input and output.<br>Input and output are in range 0..1023.
light.gamma8<a class="cmnd" id="light_gamma8"></a>|`(channel) -> int`<br>Computes the gamma corrected value with 8 bits resolution for input and output.<br>Input and output are in range 0..255.

### **`gpio` module**

This module allows to retrieve the GPIO configuration set in the templates. You need to distinguish between **logical gpio** (like PWM, or I2C) and **physical gpio** which represent the GPIO number of the physicla pin. `gpio.pin()` transforms a logical gpio to a physical gpio, or `-1` if the logical gpio is not set.

Currently there is limited support for GPIO: you can only read/write in digital mode and set the PGIO mode.

Tasmota Function|Parameters and details
:---|:---
gpio.pin_used<a class="cmnd" id="gpio_pin_used"></a>|`(gpio [,index]) -> bool`<br>returns if a specific GPIO is used. `index` allows to iterate through gpios. Example: `gpio.pin_used(gpio.REL1)` to check Relay1, or `gpio.pin_used(gpio.REL1,1)` to check Relay2 (index is zero-based)
gpio.pin<a class="cmnd" id="gpio_pin"></a>|`(gpio [,index]) -> int`<br>returns the physical GPIO number assigned to the Tasmota GPIO, or -1 if the GPIO is not assigned
gpio.digital\_write<a class="cmnd" id="gpio_digital_write"></a>|`(phy_gpio, val) -> nil` needs the physical GPIO number<br>sets the GPIO to LOW/HIGH. `val` can be `0`, `1`, `gpio.LOW` or `gpio.HIGH`. Example: `gpio.digital_write(gpio.pin(gpio.REL1), gpio.HIGH)` sets Relay1 to High.
gpio.digital\_read<a class="cmnd" id="gpio_digital_read"></a>|`(phy_gpio) -> int` needs the physical GPIO number<br>reads the value of a GPIO. Returns 0 or 1.
gpio.pin\_mode<a class="cmnd" id="gpio_pin_mode"></a>|`(phy_gpio, mode) -> nil` needs the physical GPIO number<br>Changes the GPIO mode. It should be called very cautiously. Normally Tasmota handles automatically GPIO modes.<BR>`mode` can have the following values: `gpio.INPUT`, `gpio.OUTPUT`, `gpio.PULLUP`, `gpio.INPUT_PULLUP`, `gpio.PULLDOWN`, `gpio.OPEN_DRAIN`, `gpio.OUTPUT_OPEN_DRAIN`


Here are the possible values for Tasmota GPIOS:

`gpio.NONE`, `gpio.KEY1`, `gpio.KEY1_NP`, `gpio.KEY1_INV`, `gpio.KEY1_INV_NP`, `gpio.SWT1`, `gpio.SWT1_NP`, `gpio.REL1`, `gpio.REL1_INV`, `gpio.LED1`, `gpio.LED1_INV`, `gpio.CNTR1`, `gpio.CNTR1_NP`, `gpio.PWM1`, `gpio.PWM1_INV`, `gpio.BUZZER`, `gpio.BUZZER_INV`, `gpio.LEDLNK`, `gpio.LEDLNK_INV`, `gpio.I2C_SCL`, `gpio.I2C_SDA`, `gpio.SPI_MISO`, `gpio.SPI_MOSI`, `gpio.SPI_CLK`, `gpio.SPI_CS`, `gpio.SPI_DC`, `gpio.SSPI_MISO`, `gpio.SSPI_MOSI`, `gpio.SSPI_SCLK`, `gpio.SSPI_CS`, `gpio.SSPI_DC`, `gpio.BACKLIGHT`, `gpio.OLED_RESET`, `gpio.IRSEND`, `gpio.IRRECV`, `gpio.RFSEND`, `gpio.RFRECV`, `gpio.DHT11`, `gpio.DHT22`, `gpio.SI7021`, `gpio.DHT11_OUT`, `gpio.DSB`, `gpio.DSB_OUT`, `gpio.WS2812`, `gpio.MHZ_TXD`, `gpio.MHZ_RXD`, `gpio.PZEM0XX_TX`, `gpio.PZEM004_RX`, `gpio.PZEM016_RX`, `gpio.PZEM017_RX`, `gpio.SAIR_TX`, `gpio.SAIR_RX`, `gpio.PMS5003_TX`, `gpio.PMS5003_RX`, `gpio.SDS0X1_TX`, `gpio.SDS0X1_RX`, `gpio.SBR_TX`, `gpio.SBR_RX`, `gpio.SR04_TRIG`, `gpio.SR04_ECHO`, `gpio.SDM120_TX`, `gpio.SDM120_RX`, `gpio.SDM630_TX`, `gpio.SDM630_RX`, `gpio.TM1638CLK`, `gpio.TM1638DIO`, `gpio.TM1638STB`, `gpio.MP3_DFR562`, `gpio.HX711_SCK`, `gpio.HX711_DAT`, `gpio.TX2X_TXD_BLACK`, `gpio.TUYA_TX`, `gpio.TUYA_RX`, `gpio.MGC3130_XFER`, `gpio.MGC3130_RESET`, `gpio.RF_SENSOR`, `gpio.AZ_TXD`, `gpio.AZ_RXD`, `gpio.MAX31855CS`, `gpio.MAX31855CLK`, `gpio.MAX31855DO`, `gpio.NRG_SEL`, `gpio.NRG_SEL_INV`, `gpio.NRG_CF1`, `gpio.HLW_CF`, `gpio.HJL_CF`, `gpio.MCP39F5_TX`, `gpio.MCP39F5_RX`, `gpio.MCP39F5_RST`, `gpio.PN532_TXD`, `gpio.PN532_RXD`, `gpio.SM16716_CLK`, `gpio.SM16716_DAT`, `gpio.SM16716_SEL`, `gpio.DI`, `gpio.DCKI`, `gpio.CSE7766_TX`, `gpio.CSE7766_RX`, `gpio.ARIRFRCV`, `gpio.ARIRFSEL`, `gpio.TXD`, `gpio.RXD`, `gpio.ROT1A`, `gpio.ROT1B`, `gpio.ADC_JOY`, `gpio.SSPI_MAX31865_CS1`, `gpio.HRE_CLOCK`, `gpio.HRE_DATA`, `gpio.ADE7953_IRQ`, `gpio.SOLAXX1_TX`, `gpio.SOLAXX1_RX`, `gpio.ZIGBEE_TX`, `gpio.ZIGBEE_RX`, `gpio.RDM6300_RX`, `gpio.IBEACON_TX`, `gpio.IBEACON_RX`, `gpio.A4988_DIR`, `gpio.A4988_STP`, `gpio.A4988_ENA`, `gpio.A4988_MS1`, `gpio.OUTPUT_HI`, `gpio.OUTPUT_LO`, `gpio.DDS2382_TX`, `gpio.DDS2382_RX`, `gpio.DDSU666_TX`, `gpio.DDSU666_RX`, `gpio.SM2135_CLK`, `gpio.SM2135_DAT`, `gpio.DEEPSLEEP`, `gpio.EXS_ENABLE`, `gpio.TASMOTACLIENT_TXD`, `gpio.TASMOTACLIENT_RXD`, `gpio.TASMOTACLIENT_RST`, `gpio.TASMOTACLIENT_RST_INV`, `gpio.HPMA_RX`, `gpio.HPMA_TX`, `gpio.GPS_RX`, `gpio.GPS_TX`, `gpio.HM10_RX`, `gpio.HM10_TX`, `gpio.LE01MR_RX`, `gpio.LE01MR_TX`, `gpio.CC1101_GDO0`, `gpio.CC1101_GDO2`, `gpio.HRXL_RX`, `gpio.ELECTRIQ_MOODL_TX`, `gpio.AS3935`, `gpio.ADC_INPUT`, `gpio.ADC_TEMP`, `gpio.ADC_LIGHT`, `gpio.ADC_BUTTON`, `gpio.ADC_BUTTON_INV`, `gpio.ADC_RANGE`, `gpio.ADC_CT_POWER`, `gpio.WEBCAM_PWDN`, `gpio.WEBCAM_RESET`, `gpio.WEBCAM_XCLK`, `gpio.WEBCAM_SIOD`, `gpio.WEBCAM_SIOC`, `gpio.WEBCAM_DATA`, `gpio.WEBCAM_VSYNC`, `gpio.WEBCAM_HREF`, `gpio.WEBCAM_PCLK`, `gpio.WEBCAM_PSCLK`, `gpio.WEBCAM_HSD`, `gpio.WEBCAM_PSRCS`, `gpio.BOILER_OT_RX`, `gpio.BOILER_OT_TX`, `gpio.WINDMETER_SPEED`, `gpio.KEY1_TC`, `gpio.BL0940_RX`, `gpio.TCP_TX`, `gpio.TCP_RX`, `gpio.ETH_PHY_POWER`, `gpio.ETH_PHY_MDC`, `gpio.ETH_PHY_MDIO`, `gpio.TELEINFO_RX`, `gpio.TELEINFO_ENABLE`, `gpio.LMT01`, `gpio.IEM3000_TX`, `gpio.IEM3000_RX`, `gpio.ZIGBEE_RST`, `gpio.DYP_RX`, `gpio.MIEL_HVAC_TX`, `gpio.MIEL_HVAC_RX`, `gpio.WE517_TX`, `gpio.WE517_RX`, `gpio.AS608_TX`, `gpio.AS608_RX`, `gpio.SHELLY_DIMMER_BOOT0`, `gpio.SHELLY_DIMMER_RST_INV`, `gpio.RC522_RST`, `gpio.P9813_CLK`, `gpio.P9813_DAT`, `gpio.OPTION_A`, `gpio.FTC532`, `gpio.RC522_CS`, `gpio.NRF24_CS`, `gpio.NRF24_DC`, `gpio.ILI9341_CS`, `gpio.ILI9341_DC`, `gpio.ILI9488_CS`, `gpio.EPAPER29_CS`, `gpio.EPAPER42_CS`, `gpio.SSD1351_CS`, `gpio.RA8876_CS`, `gpio.ST7789_CS`, `gpio.ST7789_DC`, `gpio.SSD1331_CS`, `gpio.SSD1331_DC`, `gpio.SDCARD_CS`, `gpio.ROT1A_NP`, `gpio.ROT1B_NP`, `gpio.ADC_PH`, `gpio.BS814_CLK`, `gpio.BS814_DAT`, `gpio.WIEGAND_D0`, `gpio.WIEGAND_D1`, `gpio.NEOPOOL_TX`, `gpio.NEOPOOL_RX`, `gpio.SDM72_TX`, `gpio.SDM72_RX`, `gpio.TM1637CLK`, `gpio.TM1637DIO`, `gpio.PROJECTOR_CTRL_TX`, `gpio.PROJECTOR_CTRL_RX`, `gpio.SSD1351_DC`, `gpio.XPT2046_CS`, `gpio.CSE7761_TX`, `gpio.CSE7761_RX`, `gpio.VL53L0X_XSHUT1`, `gpio.MAX7219CLK`, `gpio.MAX7219DIN`, `gpio.MAX7219CS`, `gpio.TFMINIPLUS_TX`, `gpio.TFMINIPLUS_RX`, `gpio.ZEROCROSS`, `gpio.HALLEFFECT`, `gpio.EPD_DATA`, `gpio.INPUT`, `gpio.SENSOR_END`

### **`wire` object**

Berry Scripting provides 2 objects `wire1` and `wire2` to communicate with both I2C buses.

Use `wire1.scan()` and `wire2.scan()` to scan both buses:

```
> wire1.scan()
[]

> wire2.scan()
[140]
```

You generally use `tasmota.wire_scan()` to find a device and the corresponding I2C bus.

Example with MPU6886 on bus 2:

```
> mpuwire = tasmota.wire_scan(0x68, 58)
> mpuwire
<instance: Wire()>
```


Wire Function|Parameters and details
:---|:---
bus<a class="cmnd" id="wire_bus">|`read only attribute, 1 or 2`<br>Bus number for this wire instance.
scan<a class="cmnd" id="wire_scan">|`() -> array of int`<br>Scan the bus and return all responding addresses. Note: addresses are displayed as decimal ints, not hex.
detect<a class="cmnd" id="wire_detect">|`(addr:int) -> bool`<br>Returns `true` if the device of address `addr` is connected to this bus.
read<a class="cmnd" id="wire_read">|`(addr:int, reg:int, size:int) -> int or nil`<br>Read a value of 1..4 bytes from address `addr` and register `reg`. Returns `nil` if no response.
write<a class="cmnd" id="wire_write">|`(addr:int, reg:int, val:int, size:int) -> bool`<br>Writes a value of 1..4 bytes to address `addr`, register `reg` with value `val`. Returns `true` if successful, `false` if not.
read\_bytes<a class="cmnd" id="wire_read_bytes">|`(addr:int, reg:int ,size:int) -> instance of bytes()`<br>Reads a sequence of `size` bytes from address `addr` register `reg`. Result is a `bytes()` instance or `bytes()` if not succesful.`
write\_bytes<a class="cmnd" id="wire_write_bytes">|`(addr:int, reg:int, val:bytes) -> nil`<br>Writes the `val` bytes sequence as `bytes()` to address `addr` register `reg`.

The following are low-level commands if you need finer control:



Wire Function|Parameters and details
:---|:---
\_begin\_transmission<a class="cmnd" id="wire_begin_transmission">|`(address:int) -> nil`
\_end\_transmission<a class="cmnd" id="wire_end_transmission">|`([stop:bool]) -> nil`<br>Send stop if `stop` is `true`.
\_request\_from<a class="cmnd" id="wire_request_from">|`(addr:int, size:int [stop:bool = true]) -> nil`
\_available<a class="cmnd" id="wire_available">|`() -> bool`
\_read<a class="cmnd" id="wire_read">|`read() -> int`<br>Reads a single byte.
\_write<a class="cmnd" id="wire_write">|`(value:int or s:string) -> nil`<br>Sends either single byte or an arbitrary string.
