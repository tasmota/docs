# Berry Scripting Language
!!! failure "This feature is experimental, ESP32 only and currently included in selected precompiled binaries"

To use it you must [compile your build](Compile-your-build). Add the following to `user_config_override.h`:

```arduino
#define USE_BERRY
```

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

### Rules

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


### A word on functions and closure

Berry is a functional language, and includes the very powerful concept of a *closure*. In a nutshell, it means that when you create a function, it can capture the values of variables when the function was created. This roughly means that it does what intuitively you would expect it to do.

When using Rules or Timers, you always pass a Berry functions.

### Timers

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

### Lights and Relays

To be completed


## Loading code from filesystem

You can upload Berry code in the filesytem and load them at runtime. Just be careful to use the `*.be` extensions.

To load a Berry file, use the `load(filename)` function. It takes a filename and must end by `.be` or `.bec`.

Note: you don't need to prefix with `/`. A leading `/` will be added automatically if it is not present.

When loading a Berry script, the compiled bytecode is automatically saved to the filesystem, with the extension `.bec` (this is similar to Python's `.py`/`.pyc` mechanism). The `save(filename,closure)` function is used internally to save the bytecode.

Currently the precompiled is not loaded unless you explicitly use `load("filename.bec")` extension, this may change in the future.

Here is the Berry code in the `load()` function:

```python
# simple wrapper to load a file
# prefixes '/' if needed, and simpler to use than `compile()`
def load(f)
  try
    # check that the file ends with '.be' of '.bec'
    var fl = string.split(f,'.')
    if (size(fl) <= 1 || (fl[-1] != 'be' && fl[-1] != 'bec'))
      raise "file extension is not '.be' or '.bec'"
    end
    var native = f[size(f)-1] == 'c'
    # add prefix if needed
    if f[0] != '/' f = '/' + f end
    # load - works the same for .be and .bec
    var c = compile(f,'file')
    # save the compiled bytecode
    if !native
      save(f+'c', c)
    end
    # call the compiled code
    c()
  except .. as e
    log(string.format(\"BRY: could not load file '%s' - %s\",f,e))
  end
end
```

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
tasmota.get_free_heap<a class="cmnd" id="tasmota_get_free_heap"></a>|`() -> int`<br>Returns the number of free bytes on the Tasmota heap.
`tasmota.publish`<a class="cmnd" id="tasmota_publish"></a>|`(topic:string, payload:string[, retain:bool]) -> nil`<br>Equivalent of `publish` command, publishes a MQTT message on `topic` with `payload`. Optional `retain` parameter.
`tasmota.cmd`<a class="cmnd" id="tasmota_cmd"></a>|`(command:string) -> string`<br>Sends any command to Tasmota, like it was type in the console. It returns the result of the command if any.
`tasmota.millis`<a class="cmnd" id="tasmota_millis"></a>|`([delay:int]) -> int`<br>Returns the number of milliseconds since last reboot. The optional parameter lets you specify the number of milliseconds in the future; useful for timers.
`tasmota.time_reached`<a class="cmnd" id="tasmota_time_reached"></a>|`(timer:int) -> bool`<br>Checks whether the timer (in milliseconds) has been reached or not. Always use this function and don't do compares between `millis()` and timers, because of potential sign and overflow issues.
`tasmota.yield`<a class="cmnd" id="tasmota_yield"></a>|`() -> nil`<br>Calls Arduino framework `yield()` function to give back some time to low-level functions, like Wifi. Prevents WDT watchdog from happening.
`tasmota.delay`<a class="cmnd" id="tasmota_delay"></a>|`([delay:int]) -> int`<br>Waits and blocks execution for `delay` milliseconds. Should ideally never wait more than 10ms and absolute max 50ms. Otherwise use `set_timer`.
`tasmota.add_rule`<a class="cmnd" id="tasmota_add_rule"></a>|`(pattern:string, f:function) ->nil`<br>Adds a rule to the rule engine. See above for rule patterns.
`tasmota.gc`<a class="cmnd" id="tasmota_gc"></a>|`() -> int`<br>Triggers a garbage collaction of Berry objects and returns the bytes currently allocated. This is for debug only and shouldn't be normally used. GC is otherwise automatically triggeredd when necessary.

Functions used to retrieve Tasmota configuration

Tasmota Function|Parameters and details
:---|:---
`tasmota.get_option`<a class="cmnd" id="tasmota_get_option"></a>|`(index:int) -> int`<br>Returns the value of `SetOption <index>`
`tasmota.i2c_enabled`<a class="cmnd" id="tasmota_i2c_enabled"></a>|`(index:int) -> bool`<br>Returns true if the I2C module is enabled, see I2C page.


Functions used to respond to a command.

Tasmota Function|Parameters and details
:---|:---
`tasmota.add_cmd`<a class="cmnd" id="tasmota_add_cmd"></a>|`(name:string, f:function) -> nil`<br>Adds a command to Tasmota commands. Command names are case-insensitive. Command names are analyzed after native commands and after most commands, so you can't override a native command
`tasmota.resp_cmnd_str`<a class="cmnd" id="tasmota_resp_cmnd_str"></a>|`(message:string) -> nil`<br>Sets the output for the command to `message`.
`tasmota.resp_cmnd_str_done`<a class="cmnd" id="tasmota_resp_cmnd_done"></a>|`(message:string) -> nil`<br>Sets the output for the command to "Done" (localized message).
`tasmota.resp_cmnd_str_error`<a class="cmnd" id="tasmota_resp_cmnd_error"></a>|`(message:string) -> nil`<br>Sets the output for the command to "Error" (localized message).
`tasmota.resp_cmnd_str_fail`<a class="cmnd" id="tasmota_resp_cmnd_fail"></a>|`(message:string) -> nil`<br>Sets the output for the command to "Fail" (localized message).
`tasmota.resp_cmnd`<a class="cmnd" id="tasmota_resp_cmnd"></a>|`(message:string) -> nil`<br>Overrides the entire command response. Should be a valid JSON string.

Functions to manage Relay/Lights


Tasmota Function|Parameters and details
:---|:---
`tasmota.get_power`<a class="cmnd" id="tasmota_get_power"></a>|`() -> list[bool]`<br>Returns the state On/Off of each Relay and Light as a list of bool.
`tasmota.set_power`<a class="cmnd" id="tasmota_set_power"></a>|`(index:int, onoff:bool) -> bool`<br>Sets the on/off state of a Relay/Light. Returns the previous status of the Relay/Light of `nil` if index is invalid.<br>Example:<br>```> tasmota.get_power()```<br>```[true]```
`tasmota.get_light`<a class="cmnd" id="tasmota_get_light"></a>|`(index:int) -> map`<br>Get the current status if light number `index` (default:0).<br>Example:<br>```> tasmota.get_light()```<br>```{'bri': 77, 'hue': 21, 'power': true, 'sat': 140, 'rgb': '4D3223', 'channels': [77, 50, 35]}```
`tasmota.set_light`<a class="cmnd" id="tasmota_set_light"></a>|`(settings:map[, index:int]) -> map`<br>Sets the current state for light `index` (default: 0.<br>Example:<br>```> tasmota.set_light({'hue':120,'bri':50,'power':true})```<br>```{'bri': 50, 'hue': 120, 'power': true, 'sat': 140, 'rgb': '173217', 'channels': [23, 50, 23]}```

