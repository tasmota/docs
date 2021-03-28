# Berry Scripting Language
!!! failure "This feature is experimental, ESP32 only and currently included in selected precompiled binaries"

To use it you must [compile your build](Compile-your-build). Add the following to `user_config_override.h`:

```arduino
#define USE_BERRY
```

<img style="float:right;height:40px" alt="Berry logo" src="../_media/berry/berry.svg">

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

```
10:47:45.235 Hello Tasmota!
10:47:45.236 Hello again
```

### Interacting with Tasmota

The `tasmota` object provides numerous functions to interact with Tasmota. See reference for the list of functions.

For example `tasmota.publish()` is similar to `Publish` and allows to publish arbitrary MQTT messages.

#### Sending native Tasmota commands

Use `tasmota.cmd()` to send arbitrary commands, as strings, like if they were entered via the Tasmota console. For example:

```python
> tasmota.cmd("Dimmer 50")
{"POWER":"ON","Dimmer":50,"Color":"80523A","HSBColor":"21,55,50","Channel":[50,32,23]}
```

If the command sends a reponse, the returned string is parsed as JSON and converted to native Berry `map` object.

#### Invoking Berry commands from Tasmota

Use Tasmota `Br` command to send arbitrary Berry commands.

Example (from the Tasmota console, not the Berry console):

```
12:34:04.085 CMD: Br 1+1
12:34:04.092 RSL: stat/tasmota_923B34/RESULT = {"Br":"2"}
```

## Rules

Berry supports the equivalent of Tasmota rules, using a very similar MQTT Json pattern.

Pattern has the format `<level1>#<level2#...#<levelN>` when parsing a JSON message. Pattern matching is case-insensitive. Using `?` in a sub-level matches any value (first occurence only). Add conditions to the last level, as you would do with rules.


Operator|Effect
:---|:---
`==` `!==`|Compare as strings
`=` `!=` `<` `<=` `>` `>=`|Compare a numers


Important: you don't need `DATA` sub-level with Berry when parsing JSON root level messages.

Example: `Dimmer>=50` will trigger the rule if there is a `Dimmer` field with a numerical value greater than `50`.

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
> def t() print("Booh!" end

> tasmota.set_timer(5000, t)
[5 seconds later]
Booh!
```

## Lights and Relays

Berry provides complete support for Relays and Lights.

You can control individual Relays or lights with `tasmota.get\_power()` and `tasmota.set\_power()`.

`tasmota.get\_power()` returns an array of booleans represnting the state of each relays and light (light comes last).

`tasmota.set\_light(relay, onoff)` changes the state of a single relay/light.

Example (2 relays and 1 light):

```python
> tasmota.get_powet()
[false, true, false]

> tasmota.set_power(0, true)
true

> tasmota.get_powet()
[true, true, false]
```

For light control, `tasmota.get\_light()` and `tasmota.set\_light()` accept a structured object containing the following arguments:

Attributes|Details
:---|:---
power|`boolean`<br>Turns the light off or on. Equivalent to `tasmota.set\_power()`. When brightness is set to `0`, power is automatically set to off. On the contrary, you need to specify `power:true` to turn the light on.
bri|`int range 0..255`<br>Set the overall brightness. Be aware that the range is `0..255` and not `0..100` as Dimmer.
hue|`int 0..360`<br>Set the color Hue in degree, range 0..360 (0=red).
sat|`int 0..255`<br>Set the color Saturation (0 is grey).
ct|`int 153..500`<br>Set the white color temperature in mireds, ranging from 153 (cold white) to 500 (warm white)
rgb|`string 6 hex digits`<br>Set the color as hex `RRGGBB`, changing color and brightness.
channels|`array of int, ranges 0..255`<br>Set the value for each channel, as an array of numbers

When setting attributes, they are evaluated in the following order, the latter overriding the previous: `power`, `ct`, `hue`, `sat`, `rgb`, `channles`, `bri`.

Example:

```python
  # set to yellow, 25% brightness
> tasmota.set_light({"power": true, "hue":60, "bri":64, "sat":255})
{'bri': 64, 'hue': 60, 'power': true, 'sat': 255, 'rgb': '404000', 'channels': [64, 64, 0]}

  # set to RGB 000080 (blue 50%)
> tasmota.set_light({"rgb": "000080"})
{'bri': 128, 'hue': 240, 'power': true, 'sat': 255, 'rgb': '000080', 'channels': [0, 0, 128]}

  # set bri to zero, also powers off
> tasmota.set_light({"bri": 0})
{'bri': 0, 'hue': 240, 'power': false, 'sat': 255, 'rgb': '000000', 'channels': [0, 0, 0]}

  # chaning bri doesn't automatically power
> tasmota.set_light({"bri": 32, "power":true})
{'bri': 32, 'hue': 240, 'power': true, 'sat': 255, 'rgb': '000020', 'channels': [0, 0, 32]}

  # set channels as numbers (purple 12%)
> tasmota.set_light({"channels": [32,0,32]})
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


#### `save(filename:string, f:closuer) -> nil`

Internally used function to save bytecode. It's a wrapper to the Berry's internal API `be_savecode()`. There is no check made on the filename.

Note: there is generally no need to use this function, it is used internally by `load()`.

### `tasmota` object

A root level object called `tasmota` is created and contains numerous functions to interact with Tasmota.

Tasmota Function|Parameters and details
:---|:---
tasmota.get\_free\_heap<a class="cmnd" id="tasmota_get_free_heap"></a>|`() -> int`<br>Returns the number of free bytes on the Tasmota heap.
tasmota.publish<a class="cmnd" id="tasmota_publish"></a>|`(topic:string, payload:string[, retain:bool]) -> nil`<br>Equivalent of `publish` command, publishes a MQTT message on `topic` with `payload`. Optional `retain` parameter.
tasmota.cmd<a class="cmnd" id="tasmota_cmd"></a>|`(command:string) -> string`<br>Sends any command to Tasmota, like it was type in the console. It returns the result of the command if any.
tasmota.millis<a class="cmnd" id="tasmota_millis"></a>|`([delay:int]) -> int`<br>Returns the number of milliseconds since last reboot. The optional parameter lets you specify the number of milliseconds in the future; useful for timers.
tasmota.time\_reached<a class="cmnd" id="tasmota_time_reached"></a>|`(timer:int) -> bool`<br>Checks whether the timer (in milliseconds) has been reached or not. Always use this function and don't do compares between `millis()` and timers, because of potential sign and overflow issues.
tasmota.yield<a class="cmnd" id="tasmota_yield"></a>|`() -> nil`<br>Calls Arduino framework `yield()` function to give back some time to low-level functions, like Wifi. Prevents WDT watchdog from happening.
tasmota.delay<a class="cmnd" id="tasmota_delay"></a>|`([delay:int]) -> int`<br>Waits and blocks execution for `delay` milliseconds. Should ideally never wait more than 10ms and absolute max 50ms. Otherwise use `set_timer`.
tasmota.add\_rule<a class="cmnd" id="tasmota_add_rule"></a>|`(pattern:string, f:function) ->nil`<br>Adds a rule to the rule engine. See above for rule patterns.
tasmota.gc<a class="cmnd" id="tasmota_gc"></a>|`() -> int`<br>Triggers a garbage collaction of Berry objects and returns the bytes currently allocated. This is for debug only and shouldn't be normally used. GC is otherwise automatically triggeredd when necessary.

Functions used to retrieve Tasmota configuration

Tasmota Function|Parameters and details
:---|:---
tasmota.get\_option<a class="cmnd" id="tasmota_get_option"></a>|`(index:int) -> int`<br>Returns the value of `SetOption <index>`
tasmota.wire\_scan<a class="cmnd" id="tasmota_wire_scan"></a>|`(addr:int [, index:int]) -> wire instance or nil`<br>Scan both I2C buses for a device of address addr, optionally taking into account disabled devices via `I2CDevice`. Returns a `wire` object corresponding to the bus where the device is, or `nil` if device is not connected or disabled.
tasmota.i2c\_enabled<a class="cmnd" id="tasmota_i2c_enabled"></a>|`(index:int) -> bool`<br>Returns true if the I2C module is enabled, see I2C page.


Functions used to respond to a command.

Tasmota Function|Parameters and details
:---|:---
tasmota.add\_cmd<a class="cmnd" id="tasmota_add_cmd"></a>|`(name:string, f:function) -> nil`<br>Adds a command to Tasmota commands. Command names are case-insensitive. Command names are analyzed after native commands and after most commands, so you can't override a native command
tasmota.resp\_cmnd_str<a class="cmnd" id="tasmota_resp_cmnd_str"></a>|`(message:string) -> nil`<br>Sets the output for the command to `message`.
tasmota.resp\_cmnd\_str\_done<a class="cmnd" id="tasmota_resp_cmnd_done"></a>|`(message:string) -> nil`<br>Sets the output for the command to "Done" (localized message).
tasmota.resp\_cmnd\_str\_error<a class="cmnd" id="tasmota_resp_cmnd_error"></a>|`(message:string) -> nil`<br>Sets the output for the command to "Error" (localized message).
tasmota.resp\_cmnd\_str\_fail<a class="cmnd" id="tasmota_resp_cmnd_fail"></a>|`(message:string) -> nil`<br>Sets the output for the command to "Fail" (localized message).
tasmota.resp\_cmnd<a class="cmnd" id="tasmota_resp_cmnd"></a>|`(message:string) -> nil`<br>Overrides the entire command response. Should be a valid JSON string.

Functions to manage Relay/Lights


Tasmota Function|Parameters and details
:---|:---
tasmota.get\_power<a class="cmnd" id="tasmota_get_power"></a>|`() -> list[bool]`<br>Returns the state On/Off of each Relay and Light as a list of bool.
tasmota.set\_power<a class="cmnd" id="tasmota_set_power"></a>|`(index:int, onoff:bool) -> bool`<br>Sets the on/off state of a Relay/Light. Returns the previous status of the Relay/Light of `nil` if index is invalid.<br>Example:<br>```> tasmota.get_power()```<br>```[true]```
tasmota.get\_light<a class="cmnd" id="tasmota_get_light"></a>|`(index:int) -> map`<br>Get the current status if light number `index` (default:0).<br>Example:<br>```> tasmota.get_light()```<br>```{'bri': 77, 'hue': 21, 'power': true, 'sat': 140, 'rgb': '4D3223', 'channels': [77, 50, 35]}```
tasmota.set\_light<a class="cmnd" id="tasmota_set_light"></a>|`(settings:map[, index:int]) -> map`<br>Sets the current state for light `index` (default: 0.<br>Example:<br>```> tasmota.set_light({'hue':120,'bri':50,'power':true})```<br>```{'bri': 50, 'hue': 120, 'power': true, 'sat': 140, 'rgb': '173217', 'channels': [23, 50, 23]}```

### `wire` object

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
