# Berry Scripting Language :material-cpu-32-bit:

!!! info "Berry Scripting is included in all `tasmota32` builds. It is **NOT** supported on ESP82xx"

!!! tip "If you plan to code in Berry, you should enable `#define USE_BERRY_DEBUG` which will give you much more details when coding"

<img style="float:right;height:40px" alt="Berry logo" src="../_media/berry/berry.svg">

Useful resources:

- First time user of Berry: [Berry Introduction (in 20 minutes of less)](Berry-Introduction.md)
- Language fast reference PDF (7 pages) [Berry Short manual](https://tasmota.github.io/docs/_media/berry_short_manual.pdf)
- Full language documentation [The Berry Script Language Reference Manual](https://berry.readthedocs.io/en/latest/source/en/Reference.html)
- Tasmota extension of Berry, see below
- Full examples in the [Berry Cookbook](Berry-Cookbook.md)

!!! tip "If you're new to Berry, have a look at [Berry Introduction (in 20 minutes of less)](Berry-Introduction.md)"

## Introduction to Berry

Berry is the next generation scripting for Tasmota. It is based on the open-source Berry project, delivering an ultra-lightweight dynamically typed scripting language designed for lower-performance embedded devices.

[**Github**](https://github.com/berry-lang/berry/)
[**Manual**](https://github.com/berry.readthedocs.io/en/latest/source/en/Reference.html)

!!! tip "Reference sheet"
    Download [Berry Short Manual](https://tasmota.github.io/docs/_media/berry_short_manual.pdf) to get a list of basic functions and capabilities of Berry language
    
Berry Scripting allows simple and also advanced extensions of Tasmota, for example:

- simple scripting
- advanced rules, beyond what is possible with native rules
- advanced automations

Berry Scripting takes it one step further and allows to build dynamic extensions to Tasmota, that would previously require native code:

- build light animations
- build I^2^C drivers
- build complete Tasmota drivers
- integrate native libraries like `lvgl` see [LVGL](LVGL.md)

### About the Berry language

Berry has the following advantages:

- Lightweight: A well-optimized interpreter with very little resources. Ideal for use in microprocessors.
- Fast: optimized one-pass bytecode compiler and register-based virtual machine.
- Powerful: supports imperative programming, object-oriented programming, functional programming.
- Flexible: Berry is a dynamic type script, and it's intended for embedding in applications. It can provide good dynamic scalability for the host system.
- Simple: simple and natural MicroPython-eque syntax, supports garbage collection and easy to use FFI (foreign function interface).
- RAM saving: With compile-time object construction, most of the constant objects are stored in read-only code data segments, so the RAM usage of the interpreter is very low when it starts.

## Tasmota Port

Berry Scripting in only supported on Tasmota32 for ESP32. The RAM usage starts at ~10KB and will be later optimized. Berry uses PSRAM on ESP32 if available (PSRAM is external RAM attached to ESP32 via SPI, it is slower but larger than internal RAM.

### Quick Start

Click on *Configuration* then *Berry Scripting Console* and enjoy the colorful Berry console, also called REPL (Read-Eval-Print-Loop).

![Berry console](https://user-images.githubusercontent.com/49731213/111880607-c193c800-89ac-11eb-81c9-a3558e26a1de.png)

!!! tip "Drag the bottom corner of each screen to change its size"

The console is not designed for big coding tasks but it's recommended to use a code editor when dealing with many, many lines of code. An extension for Visual Studio Code exists to make writing Berry scripts even easier with colored syntax. Download the entire [folder](https://github.com/berry-lang/berry/tree/master/tools/plugins/vscode/) and copy to VSCode extensions folder.

### REPL Console

Try typing simple commands in the REPL. Since the input can be multi-lines, press ++enter++ twice or click "Run" button to run the code. Use ++arrow-up++ and ++arrow-down++ to navigate through history of previous commands.

```berry
> 1+1
2
```

```berry
> 2.0/3
0.666667
```

```berry
> print('Hello Tasmota!')
Hello Tasmota!
```

Note: Berry's native `print()` command displays text in the Berry Console and in the Tasmota logs. To log with finer control, you can also use the `log()` function which will not display in the Berry Console.

```berry
> print('Hello Tasmota!')
  log('Hello again')
Hello Tasmota!
```

Meanwhile the Tasmota log shows:
```
> tasmota.cmd("Dimmer 60")
{'POWER': 'ON', 'Dimmer': 60, 'Color': '996245', 'HSBColor': '21,55,60', 'Channel': [60, 38, 27]}
The light is bright
```
## Save your Scripts
Berry can autostart your scripts. See a short description in the Section about the filesystem:
https://tasmota.github.io/docs/UFS/#autoexecbe
Your can use the Filemanager to edit or save files with your berry scripts.

## Iterate without rebooting
Since v13.0.0.1 you can restart the entire Berry VM with a click in the Berry console. This feature requires to compile with `#define USE_BERRY_DEBUG` which is anyways highly recommended when coding in Berry. Be aware that restarting the Berry VM loses all context, and may generate negative side effects that we haven't yet identified. When restarting the VM, `autoexec.be` is ran again.

Instead of using the Web UI, you can also use the `BrRestart` command which does not require `#define USE_BERRY_DEBUG`.

## Lights and Relays

Berry provides complete support for Relays and Lights.

You can control individual Relays or lights with `tasmota.get_power()` and `tasmota.set_power()`.

`tasmota.get_power()` returns an array of booleans representing the state of each relays and light (light comes last).

`tasmota.set_power(relay, onoff)` changes the state of a single relay/light.

!!! example "2 relays and 1 light"

    ```berry
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
sat|`int 0..255`<br>Set the color Saturation (0 is gray).
ct|`int 153..500`<br>Set the white color temperature in mired, ranging from 153 (cold white) to 500 (warm white)
rgb|`string 6 hex digits`<br>Set the color as hex `RRGGBB`, changing color and brightness.
channels|`array of int, ranges 0..255`<br>Set the value for each channel, as an array of numbers

When setting attributes, they are evaluated in the following order, the latter overriding the previous: `power`, `ct`, `hue`, `sat`, `rgb`, `channels`, `bri`.

```berry
  # set to yellow, 25% brightness
> light.set({"power": true, "hue":60, "bri":64, "sat":255})
{'bri': 64, 'hue': 60, 'power': true, 'sat': 255, 'rgb': '404000', 'channels': [64, 64, 0]}

  # set to RGB 000080 (blue 50%)
> light.set({"rgb": "000080"})
{'bri': 128, 'hue': 240, 'power': true, 'sat': 255, 'rgb': '000080', 'channels': [0, 0, 128]}

  # set bri to zero, also powers off
> light.set({"bri": 0})
{'bri': 0, 'hue': 240, 'power': false, 'sat': 255, 'rgb': '000000', 'channels': [0, 0, 0]}

  # changing bri doesn't automatically power
> light.set({"bri": 32, "power":true})
{'bri': 32, 'hue': 240, 'power': true, 'sat': 255, 'rgb': '000020', 'channels': [0, 0, 32]}

  # set channels as numbers (purple 12%)
> light.set({"channels": [32,0,32]})
{'bri': 32, 'hue': 300, 'power': true, 'sat': 255, 'rgb': '200020', 'channels': [32, 0, 32]}
``` 
## Rules
The rule function have the general form below where parameters are optional:

```berry
def function_name(value, trigger, msg)
end
```

Parameter|Description
:---|:---
`value`|The value of the trigger. Similar to `%value%` in native rules.
`trigger`|`string` of the trigger with all levels. Can be used if the same function is used with multiple triggers.
`msg`|`map` Berry structured object of the message, decoded from JSON. If JSON was invalid, it contains the original string

!!! example "Dimmer rule"

    Define the function and add a rule to Tasmota where the function runs if Dimmer value is more than 50
    ```berry
    > def dimmer_over_50()
        print("The light is bright")
      end
      tasmota.add_rule("Dimmer>50", dimmer_over_50)
    ```

    ```berry
    > tasmota.cmd("Dimmer 30")
    {'POWER': 'ON', 'Dimmer': 30, 'Color': '4D3223', 'HSBColor': '21,55,30', 'Channel': [30, 20, 14]}

    > tasmota.cmd("Dimmer 60")
    {'POWER': 'ON', 'Dimmer': 60, 'Color': '996245', 'HSBColor': '21,55,60', 'Channel': [60, 38, 27]}
    The light is bright
    ```

The same function can be used with multiple triggers.

If the function to process an ADC input should be triggered both by the `tele/SENSOR`
message and the result of a `Status 10` command:

```berry
tasmota.add_rule("ANALOG#A1", rule_adc_1)
tasmota.add_rule("StatusSNS#ANALOG#A1", rule_adc_1)
```

Or if the same function is used to process similar triggers:
```berry
import string

def rule_adc(value, trigger)
  var i=string.find(trigger,"#A")
  var tr=string.split(trigger,i+2)
  var adc=number(tr[1])
  print("value of adc",adc," is ",value)
end

tasmota.add_rule("ANALOG#A1",rule_adc)
tasmota.add_rule("ANALOG#A2",rule_adc)
```

Another way to address the same using anonymous functions created dynamically
```berry
def rule_adc(adc, value)
  print("value of adc",adc," is ",value)
end
tasmota.add_rule("ANALOG#A1", def (value) rule_adc(1,value) end )
tasmota.add_rule("ANALOG#A2", def (value) rule_adc(2,value) end )
```

### Multiple triggers AND logic ###

It is possible to combine multiple triggers in a AND logic as an array:
```berry
tasmota.add_rule(["ANALOG#A1>300","ANALOG#A1<500"], def (values) rule_adc_in_range(1,values) end )
```
would trigger if `300 < ANALOG#A1 < 500`

Triggers can be of different types too:
```berry
tasmota.add_rule(["ANALOG#A1>300","BME280#Temperature>28.0"], def (values) rule_adc_and_temp(1,values) end )
```
would trigger for simultaneous `ANALOG#A1>300` AND `BME280#Temperature>28.0`

In that case, the value and trigger arguments passed to the rule function are also lists:
```berry
def function_name(values:list_of_string, triggers:list_of_string, msg)
end
```
The 3rd argument `msg` remains unchanged.

### Teleperiod rules ###

Teleperiod rules are supported with a different syntax from Tasmota rules. Instead of using `Tele-` prefix, you must use `Tele#`. For example `Tele#ANALOG#Temperature1` instead of `Tele-ANALOG#Temperature1`

### Rules operators

|Operator|Function|
|:-:|:--|
||**String Operators**|
|`=` | equal to (used for string comparison)|
|`!==` | not equal to (used for string comparison)|
|`$<`| string starts with|
|`$>`| string ends with|
|`$\|`| string contains|
|`$!`| string is not equal to|
|`$^`| string do not contains|
||**Numerical Operators**|
|`==`| equal to (used for numerical comparison)|
|`>`| greater than|
|`<`| lesser than|
|`!=`| number not equal to|
|`>=`| greater than or equal to|
|`<=`| lesser than or equal to|
|`\|`|Modulo division to this number is `0` (remainder=0)|

## Timers

Berry code, when it is running, blocks the rest of Tasmota. This means that you should not block for too long, or you may encounter problems. As a rule of thumb, try to never block more than 50ms. If you need to wait longer before the next action, use timers. As you will see, timers are very easy to create thanks to Berry's functional nature.

All times are in milliseconds. You can know the current running time in milliseconds since the last boot:

```berry
> tasmota.millis()
9977038
```


!!! example "Sending a timer is as easy as `tasmota.set_timer(<delay in ms>,<function>)`"

    ```berry
    > def t() print("Booh!") end

    > tasmota.set_timer(5000, t)
    [5 seconds later]
    Booh!
    ```

Timers are scheduled roughly within 50 milliseconds ticks. This means that you cannot have better than 50 ms resolution, and `set_timer(0, <function>`) will schedule the function 50 ms later. In certain cases, you need to defer a function to an immediate future; for such case use `tasmota.defer(<function>)` which will run the function typically within the next millisecond.

#### A word on functions and closure

Berry is a functional language, and includes the very powerful concept of a *closure*. In a nutshell, it means that when you create a function, it can capture the values of variables when the function was created. This roughly means that it does what intuitively you would expect it to do.

When using Rules or Timers, you always pass Berry functions.

## `cron` recurrent calls

You can choose to run some function/closure at regular intervals specified as `cron` style format with the first field representing seconds. 
``` berry
> def f() print("Hi") end
> tasmota.add_cron("*/15 * * * * *", f, "every_15_s")
Hi
Hi      # added every 15 seconds
> tasmota.remove_cron("every_15_s")     # cron stops
```

Like timers, you need to create a closure if you want to register a method of an instance. Example:

``` ruby
class A
    var name
    def init(name)
        self.name = name
    end
    def p()
        print("Hi,", self.name)
    end
end
```

``` ruby
> bob = A("bob")
> bob.p()
Hi, bob
> tasmota.add_cron("*/15 * * * * *", /-> bob.p(), "hi_bob")
Hi, bob
Hi, bob
Hi, bob
> tasmota.remove_cron("hi_bob")     # cron stops
```

You can get the timestamp for the next event by using `tasmota.next_cron(id)` which returns an epoch in seconds.

## Loading Filesystem

Berry files can exist in 2 forms, either a source file (extension `.be`) or a pre-compiled bytecode (extension `.bec`). Pre-compiled are usually smaller and load slightly faster (although compilation is fast enough in most use cases). It's usually more flexible and simpler to use source code (`.be`).

You can upload Berry code in the filesystem using the ***Consoles - Manage File system*** menu and load them at runtime. Make careful to use `*.be` extension for those files.

To load a Berry file, use the `load(filename)` function where `filename` is the name of the file with `.be` or `.bec` extension; if the file has no extension '.be' is automatically appended.

!!! note "You don't need to prefix with `/`. A leading `/` will be added automatically if it is not present."

??? note "Previous behavior before 13.4.0.3:"

    When loading a Berry script, the compiled bytecode is automatically saved to the filesystem, with the extension `.bec` (this is similar to Python's `.py`/`.pyc` mechanism). The `save(filename,closure)` function is used internally to save the bytecode.

    If a precompiled bytecode (extension `.bec`) is present of more recent than the Berry source file, the bytecode is directly loaded which is faster than compiling code. You can eventually remove the `*.be` file and keep only `*.bec` file (even with `load("file.be")`.

The loading behavior is as follows:

- `load("hello")` and `load("hello.be")` loads `hello.be` and tries `hello.bec` if the first does not exist. If both `hello.be` and `hello.bec` exist, `hello.bec` is deleted to avoid confusion between versions.
- `load("hello.bec")` loads only `hello.bec` and fails if only `hello.be` is present

To compile to `.bec` use `tasmota.compile("hello.be")`. If all is good, it returns `true` and creates `hello.bec`. But beware that if you use `load()` the `.bec` file is deleted.

Note: `tasmota.compile()` is different than native Berry `compile()`

## Creating a Tasmota Driver

You can easily create a complete Tasmota driver with Berry.

A Driver responds to messages from Tasmota. For each message type, the method with the same name is called. Actually you can register any class as a driver, it does not need to inherit from `Driver`; the call mechanism is based on names of methods that must match the name of the event to be called.

Driver methods are called with the following parameters: `f(cmd, idx, payload, raw)`. `cmd` is a string, `idx` an integer, `payload` a Berry object representation of the JSON in `payload` (if any) or `nil`, `raw` is a string. These parameters are meaningful to a small subset of events:

- `every_second()`: called every second
- `every_50ms()`: called every 50ms (i.e. 20 times per second)
- `every_100ms()`: called every 100ms (i.e. 10 times per second)
- `every_250ms()`: called every 250ms (i.e. 4 times per second)
- `web_sensor()`: display sensor information on the Web UI
- `json_append()`: display sensor information in JSON format for TelePeriod reporting
- `web_add_button()`: (deprecated) synonym of `web_add_console_button()`
- `web_add_main_button()`, `web_add_management_button()`, `web_add_console_button()`, `web_add_config_button()`: add a button to Tasmota's Web UI on a specific page
- `web_add_handler()`: called when Tasmota web server started, and the right time to call `webserver.on()` to add handlers
- `button_pressed()`: called when a button is pressed
- `save_before_restart()`: called just before a restart
- `mqtt_data(topic, idx, data, databytes)`: called for MQTT payloads matching `mqtt.subscribe`. `idx` is zero, and `data` is normally unparsed JSON.
- `set_power_handler(cmd, idx)`: called whenever a Power command is made. `idx` is a combined index value, with one bit per relay or light currently on. `cmd` can be ignored.
- `any_key(cmd, idx)`: called when an interaction with Button or Switch occurs. `idx` is encoded as follows: `device_save << 24 | key << 16 | state << 8 | device`
- `display()`: called by display driver with the following subtypes: `init_driver`, `model`, `dim`, `power`.

Then register the driver with `tasmota.add_driver(<driver>)`.

There are basically two ways to respond to an event:

**Example**

Define a class and implement methods with the same name as the events you want to respond to.

```berry
class MyDriver
  def every_second()
    # do something
  end
end

d1 = MyDriver()

tasmota.add_driver(d1)
```

## Fast Loop

Beyond the events above, a specific mechanism is available for near-real-time events or fast loops (200 times per second, or 5ms).

Special attention is made so that there is no or very little impact on performance. Until a first callback is registered, performance is not impacted and Berry is not called. This protects any current use from any performance impact.

Once a callback is registered, it is called separately from Berry drivers to ensure minimal overhead.

`tasmota.add_fast_loop(cl:function) -> nil` registers a callback to be called in fast loop mode.

The callback is called without any parameter and does not need to return anything. The callback is called at each iteration of Tasmota event loop. The frequency is set to 200Hz or 5ms.

Note: since v13.1.0.2, the frequency of `fast_loop` does not depend anymore on the value of the `Sleep <x>` command.

`tasmota.remove_fast_loop(cl:function) -> nil` removes a previously registered function or closure. You need to pass the exact same closure reference.

Warning, if you need to register a method from an instance, you need a closure:

```
class my_driver
  def every_100ms()
    # called every 100ms via normal way
  end

  def fast_loop()
    # called at each iteration, and needs to be registered separately and explicitly
  end

  def init()
    # register fast_loop method
    tasmota.add_fast_loop(/-> self.fast_loop())
    # variant:
    # tasmota.add_fast_loop(def () self.fast_loop() end)
  end
end

tasmota.add_driver(my_driver())                     # register driver
tasmota.add_fast_loop(/-> my_driver.fast_loop())    # register a closure to capture the instance of the class as well as the method
```

## Tasmota Only Extensions

#### `log(msg:string [, level:int = 3]) -> string`

Logs a message to the Tasmota console. Optional second argument is log_level (0..4), default is `2` (matching build time `LOG_LEVEL_INFO`).

!!! example

    ```
    > log("A")
    A
    ```

#### `load(filename:string) -> bool`

Loads a Berry script from the filesystem, and returns true if loaded successfully, false if file not found, or raises an exception in runtime. Filename does not need to start with `/`, but needs to end with `.be` (Berry source code) or `.bec` (precompiled bytecode). If the `.be` extension is missing, it is automatically added.

The behavior for `.bec` files changed in v13.4:
- when loading `<file>.be`, the `.be` file is loaded in priority and any `.bec` file with same prefix is removed (to avoid inconsistencies). If no `.be` file is present, it tried to load `.bec` file.
- when loading `<file>.bec`, only `.bec` files are loaded and `.be` is ignored.
- to create `.bec` files, you need to use `tasmota.compile` (see below)

#### `tasmota.compile(filename:string) -> bool`

Loads a `.be` file, compiles it and saves a `.bec` file containing the compiled bytecode.

Note: `tasmota.compile` is different from Berry native `compile` function.

#### `save(filename:string, f:closure) -> nil`

Internally used function to save bytecode. It's a wrapper to the Berry's internal API `be_savecode()`. There is no check made on the filename.

There is generally no need to use this function, it is used internally by `load()`.

### `tasmota` object

A root level object called `tasmota` is created and contains numerous functions to interact with Tasmota.

Tasmota Function|Parameters and details
:---|:---
tasmota.get\_free\_heap<a class="cmnd" id="tasmota_get_free_heap"></a>|`() -> int`<br>Returns the number of free bytes on the Tasmota heap.
tasmota.publish<a class="cmnd" id="tasmota_publish"></a>|`(topic:string, payload:string[, retain:bool, start:int, len:int]) -> nil`<br>_Deprecated_ see `mqtt.publish`
tasmota.publish\_result<a class="cmnd" id="tasmota_publish_result"></a>|`(payload:string, subtopic:string) -> nil`<br>Publishes a JSON result and triggers any associated rule. `payload` is expected to be a JSON string, and `subtopic` the subtopic used to publish the payload.
tasmota.publish\_rule<a class="cmnd" id="tasmota_publish_rule"></a>|`(payload:string) -> handled:bool`<br>sends a JSON stringified message to the rule engine, without actually publishing a message to MQTT. Returns `true` if the message was handled by a rule.
tasmota.cmd<a class="cmnd" id="tasmota_cmd"></a>|`(command:string [, mute:bool]) -> map`<br>Sends any command to Tasmota, like it was type in the console. It returns the result of the command if any, as a map parsed from the command output JSON. Takes an optional `mute` attribute. If `mute` is `true`, logging (serial, web, mqtt) is reduced to level `1` (only severe errors) to avoid polluting the logs.
tasmota.memory<a class="cmnd" id="tasmota_memory"></a>|`() -> map` or `(key:string) -> any`<br>Returns memory stats similar to the Information page.<br>Example: `{'iram_free': 41, 'frag': 51, 'program_free': 1856, 'flash': 4096, 'heap_free': 226, 'program': 1679}`<br>or when PSRAM `{'psram_free': 3703, 'flash': 16384, 'program_free': 3008, 'program': 1854, 'psram': 4086, 'frag': 27, 'heap_free': 150}`<br>If a `key` is passed, the value is returned without allocating a new `map`, or `nil` if no value matches the `key`.
tasmota.add\_rule<a class="cmnd" id="tasmota_add_rule"></a>|`(trigger:string, f:function [, id:any]) ->nil`<br>`(triggers:list_of_string, f:function [, id:any]) ->nil`<br>Adds a rule to the rule engine. See above for rule triggers.<br>Optional `id` allows to remove selectively rules with `tasmota.remove_rule()`.<br>If you add a new rule with the same `trigger` and the same non-`nil` `id`, the previous rule is removed and the new one replaces it (this is handy when developing new code)
tasmota.add\_rule\_once<a class="cmnd" id="tasmota_add_rule_once"></a>|`(trigger:string, f:function [, id:any]) ->nil`<br>`(triggers:list_of_string, f:function [, id:any]) ->nil`<br>Same as `add_rule` except the rule is fired only once and then removed from rules
tasmota.remove\_rule<a class="cmnd" id="tasmota_remove_rule"></a>|`(trigger:string [, id:any]) ->nil`<br>`(triggers:list_of_string [, id:any]) ->nil`<br>Removes a rule from the rule engine. Silently ignores the trigger(s) if no rule matches. Optional `id` to remove selectively some rules.
tasmota.when\_network\_up<a class="cmnd" id="tasmota_when_network_up"></a>|`(f:function) ->nil`<br>Runs the provided function or closure as soon as the first network stack is available (wifi or ethernet).<br>This is to be used whenever you call network function from Berry, calling most of network functions before the network is up generally causes a crash.
tasmota.add\_driver<a class="cmnd" id="tasmota_add_driver"></a>|`(instance) ->nil`<br>Registers an instance as a driver
tasmota.remove\_driver<a class="cmnd" id="tasmota_remove_driver"></a>|`(instance) ->nil`<br>Removes a driver
tasmota.gc<a class="cmnd" id="tasmota_gc"></a>|`() -> int`<br>Triggers garbage collection of Berry objects and returns the bytes currently allocated. This is for debug only and shouldn't be normally used. `gc` is otherwise automatically triggered when necessary.
tasmota.urlfetch<a class="cmnd" id="tasmota_urlfetch"></a>|`(url:string [, filename:string]) -> bytes:int`<br>Download a url (http or https) and store the content in the filesystem<br>`filename` is optional, needed if you want to change the name of the file from the url suffix. Returns the number of bytes downloaded or -1 if failed.
tasmota.urlbecload<a class="cmnd" id="tasmota_urlbecload"></a>|`(url:string) -> bool`<br>Download `.bec` file from a url and run it, return `true` if successful. This allows to run complementary code like Partition Wizard from precompiled Berry.
tasmota.scale\_uint<a class="cmnd" id="tasmota_scale_uint"></a>|`(value:int, fromMin:int, fromMax:int, toMin:int, toMax:int) -> int`<br>Linear scaling of an unsigned integer range, based on two points on the line, typically min and max for "from" and "to" ranges. The internal implementation works better on 16 bits integers.
tasmota.scale\_int<a class="cmnd" id="tasmota_scale_int"></a>|`(value:int, fromMin:int, fromMax:int, toMin:int, toMax:int) -> int`<br>Linear scaling of an integer range, based on two points on the line, typically min and max for "from" and "to" ranges.
tasmota.int<a class="cmnd" id="tasmota_int"></a>|`(value:int, min:int, max:int) -> int`<br>Convert a value `v` to an `int` and to guard the value between `min` and `max`. If `v` is `nil`, it returns `min`. If `min > max`, it returns `min`. If `min` or `max` are `nil`, it behaves like Berry native `int()`.<BR>Since v14.4.2

#### Functions used to retrieve Tasmota configuration

Tasmota Function|Parameters and details
:---|:---
tasmota.get\_option<a class="cmnd" id="tasmota_get_option"></a>|`(index:int) -> int`<br>Returns the value of `SetOption <index>`
tasmota.wire\_scan<a class="cmnd" id="tasmota_wire_scan"></a>|`(addr:int [, index:int]) -> wire instance or nil`<br>Scan both I^2^C buses for a device of address `addr`, optionally taking into account disabled devices via `I2CDevice`. Returns a `wire` object corresponding to the bus where the device is, or `nil` if device is not connected or disabled.
tasmota.i2c\_enabled<a class="cmnd" id="tasmota_i2c_enabled"></a>|`(index:int) -> bool`<br>Returns true if the I^2^C module is enabled, see I^2^C page.
tasmota.arch<a class="cmnd" id="tasmota_arch"></a>|`() -> string`<br>Returns the name of the architecture. Currently can be `esp32`, `esp32s2`, `esp32s3`, `esp32c3`
tasmota.read\_sensors<a class="cmnd" id="tasmota_read_sensors"></a>|`([show_sensor:bool]) -> string`<br>Returns the value of sensors as a JSON string similar to the teleperiod. The response is a string, not a JSON object. The reason is that some sensors might produce invalid JSON. It's your code's responsibility to try parsing as JSON.<br>An optional boolean parameter (false by default) can be set to trigger a display of the new values (i.e. sends a FUNC_SHOW_SENSOR` event to drivers).
tasmota.wifi<a class="cmnd" id="tasmota_wifi"></a>|`() -> map` or `(key:string) -> any`<br>Retrieves Wi-Fi connection info or empty map.<br>Example: `{'mac': 'aa:bb:cc:22:11:03', 'quality': 100, 'rssi': -47, 'ip': '192.168.1.102'}`<br>If a `key` is passed, the value is returned without allocating a new `map`, or `nil` if no value matches the `key`.
tasmota.eth<a class="cmnd" id="tasmota_eth"></a>|`() -> map` or `(key:string) -> any`<br>Retrieves Ethernet connection info or empty map.<br>Example: `{'mac': 'aa:bb:cc:22:11:00', 'ip': '192.168.1.101'}`<br>If a `key` is passed, the value is returned without allocating a new `map`, or `nil` if no value matches the `key`.
tasmota.webcolor<a class="cmnd" id="tasmota_webcolor"></a>|`() -> map` or `(index:integer) -> string`<br>Dump all webcolors from the Tasmota configuratio, or retrieve a specific color by index number.<br>Colors are expressed in `#RRGGBB` hex format and ready to use for HASPmota<br>Note: indices are 0-based so `1` less than in `WebColor` command<br>`0`: Global text, default `"#eaeaea"`<br>`1`: Global background, default `"#252525"`<br>`2`: Form background, default `"#4f4f4f"`<br>`3`: Input text, default `"#000000"`<br>`4`: Input background, default `"#dddddd"`<br>`5`: Console text, default `"#65c115"`<br>`6`: Console background, default `"#1f1f1f"`<br>`7`: Warning text, default `"#ff5661"`<br>`8`: Success text, default `"#008000"`<br>`9`: Button text, default `"#faffff"`<br>`10`: Button, default `"#1fa3ec"`<br>`11`: Button hovered over, default `"#0e70a4"`<br>`12`: Restart/Reset/Delete button, default `"#d43535"`<br>`13`: Restart/Reset/Delete button hover, default `"#931f1f"`<br>`14`: Save button, default `"#47c266"`<br>`15`: Save button hover, default `"#5aaf6f"`<br>`16`: Config timer tab text, default `"#faffff"`<br>`17`: Config timer tab background, default `"#999999"`<br>`18`: Module title and FriendlyName text, default `"#eaeaea"`<br>`19`: Button color when off, default `"#08405e"`

#### Functions for time, timers or cron

Tasmota Function|Parameters and details
:---|:---
tasmota.millis<a class="cmnd" id="tasmota_millis"></a>|`([delay:int]) -> int`<br>Returns the number of milliseconds since last reboot. The optional parameter lets you specify the number of milliseconds in the future; useful for timers.
tasmota.time\_reached<a class="cmnd" id="tasmota_time_reached"></a>|`(timer:int) -> bool`<br>Checks whether the timer (in milliseconds) has been reached or not. Always use this function and don't do compares between `millis()` and timers, because of potential sign and overflow issues.
tasmota.rtc<a class="cmnd" id="tasmota_rtc"></a>|`() -> map` or `(key:string) -> any`<br>Returns clockwall time with variants.<br>Example: `{'local': 1619560407, 'utc': 1619556807, 'timezone': 60, 'restart': 1619556779}`<br>If a `key` is passed, the value is returned without allocating a new `map`, or `nil` if no value matches the `key`.
tasmota.time\_dump<a class="cmnd" id="tasmota_time_dump"></a>|`(timestamp:int) -> map`<br>Decompose a timestamp value (in seconds) to its components<br>Example: `tasmota.time_dump(1619560407)` -> `{'min': 53, 'weekday': 2, 'sec': 27, 'month': 4, 'year': 2021, 'day': 27, 'epoch': 1619560407, 'hour': 21}`
tasmota.time\_str<a class="cmnd" id="tasmota_time_str"></a>|`(timestamp:int) -> string`<br>Converts a timestamp value (in seconds) to an ISO 8601 string<br>Example: `tasmota.time_str(1619560407)` -> `2021-04-27T21:53:27`
tasmota.set\_timer<a class="cmnd" id="tasmota_set_timer"></a>|`(delay:int, f:function [, id:any]) -> nil`<br>Runs the closure or function `f` after `delay` milliseconds, optional `id` can be used to remove the timer.<BR>The `delay` resolution is roughly 50 milliseconds.<BR>If you need to defer the function immediately after the current event loop, and not wait for 50 millisecond, consider using `tasmota.defer()` below.
tasmota.defer<a class="cmnd" id="tasmota_defer"></a>|`(f:function) -> nil`<br>Runs the closure or function `f` within the next millisecond (delay is not guaranteed). This can be used as a faster alternative to `tasmota.set_timer(0, f)`
tasmota.remove\_timer<a class="cmnd" id="tasmota_remove_timer"></a>|`(id:string) -> nil`<br>Removes the timer with the `id` used on `tasmota.set_timer`.
tasmota.strftime<a class="cmnd" id="tasmota_strftime"></a>|`(format:string, timestamp:int) -> string`<br>Converts a timestamp value (in seconds) to a string using the format conversion specifiers<br>Example: `tasmota.strftime("%d %B %Y %H:%M:%S", 1619560407)` -> `27 April 2021 21:53:27`
tasmota.strptime<a class="cmnd" id="tasmota_strptime"></a>|`(time:string, format:string) -> map or nil`<br>Converts a string to a date, according to a time format following the C `strptime` format. Returns a `map` similar to `tasmota.time_dump()` or `nil` if parsing failed. An additional `unparsed` attribute reports the unparsed string, or empty string if everything was parsed.<br>Example: `tasmota.strptime("2001-11-12 18:31:01", "%Y-%m-%d %H:%M:%S")` -> `{'unparsed': '', 'weekday': 1, 'day': 12, 'epoch': 1005589861, 'min': 31, 'year': 2001, 'month': 11, 'sec': 1, 'hour': 18}`
tasmota.yield<a class="cmnd" id="tasmota_yield"></a>|`() -> nil`<br>Calls Arduino framework `yield()` function to give back some time to low-level functions, like Wifi. Prevents WDT watchdog from happening.
tasmota.delay<a class="cmnd" id="tasmota_delay"></a>|`([delay:int]) -> int`<br>Waits and blocks execution for `delay` milliseconds. Should ideally never wait more than 10ms and absolute max 50ms. Otherwise use `set_timer`.
tasmota.add\_cron<a class="cmnd" id="tasmota_add_cron"></a>|`(pattern:string, f:function [, id:any]) -> nil`<br>Adds a cron-type timer, with a cron pattern and a function/closure to call. An optional id can be added to retrieve or delete the cron timer
tasmota.remove\_cron<a class="cmnd" id="tasmota_remove_cron"></a>|`(id:any) -> nil`<br>Remove a cron timer.
tasmota.next\_cron<a class="cmnd" id="tasmota_next_cron"></a>|`(id:any) -> int`<br>returns the next timestamp for the cron timer. The timestamp is second epoch in local time. You can use `tasmota.tasmota.time_str()` to convert to a time string.


#### Functions to create custom Tasmota command

Tasmota Function|Parameters and details
:---|:---
tasmota.add\_cmd<a class="cmnd" id="tasmota_add_cmd"></a>|`(name:string, f:function) -> nil`<br>Adds a command to Tasmota commands. Command names are case-insensitive. Command names are analyzed after native commands and after most commands, so you can't override a native command.
tasmota.resp\_cmnd_str<a class="cmnd" id="tasmota_resp_cmnd_str"></a>|`(message:string) -> nil`<br>Sets the output for the command to `message`.
tasmota.resp\_cmnd\_done<a class="cmnd" id="tasmota_resp_cmnd_done"></a>|`() -> nil`<br>Sets the output for the command to "Done" (localized message).
tasmota.resp\_cmnd\_error<a class="cmnd" id="tasmota_resp_cmnd_error"></a>|`() -> nil`<br>Sets the output for the command to "Error" (localized message).
tasmota.resp\_cmnd\_failed<a class="cmnd" id="tasmota_resp_cmnd_failed"></a>|`() -> nil`<br>Sets the output for the command to "Fail" (localized message).
tasmota.resp\_cmnd<a class="cmnd" id="tasmota_resp_cmnd"></a>|`(message:string) -> nil`<br>Overrides the entire command response. Should be a valid JSON string.
tasmota.remove\_cmd<a class="cmnd" id="tasmota_remove_cmd"></a>|`(name:string) -> nil`<br>Remove a command to Tasmota commands. Removing an non-existing command is skipped silently.

#### Functions to add custom responses to JSON and Web UI to sensors

Tasmota Function|Parameters and details
:---|:---
tasmota.response\_append<a class="cmnd" id="tasmota_response_append"></a>|`(name:string) -> nil`<br>Adds JSON fragment to the current response. Used for example for sensors to add JSON to teleperiod.<br>Can be called only in `json_append()` method of a registered driver (see cookbook). It is called at least at each teleperiod, or when reading sensor data in JSON.
tasmota.web\_send<a class="cmnd" id="tasmota_web_send"></a>|`(message:string) -> nil`<br>Adds an HTML fragment to the Web output.<br>Can be called only in `web_sensor()` method of a registered driver (see cookbook). It is called at each main page refresh.
tasmota.web\_send\_decimal<a class="cmnd" id="tasmota_web_send_decimal"></a>|`(message:string) -> nil`<br>Adds an HTML fragment to the Web output, similar to `web_send` but converts decimal dot `.` to the locale decimal separator.<br>Can be called only in `web_sensor()` method of a registered driver (see cookbook). It is called at each main page refresh.

See examples in the [Berry-Cookbook](Berry-Cookbook#adding-commands-to-tasmota)

#### Functions to manage Relays and Lights

Tasmota Function|Parameters and details
:---|:---
tasmota.get\_power<a class="cmnd" id="tasmota_get_power"></a>|`([index:int]) -> bool or list[bool]`<br>Returns Relay or Light On/Off state for one channel, or as a list of `bool` for all.
tasmota.set\_power<a class="cmnd" id="tasmota_set_power"></a>|`(index:int, onoff:bool) -> bool or nil`<br>Sets the on/off state of a Relay/Light. Returns the previous status of the Relay/Light or `nil` if index is invalid.<br>Example:<br>```> tasmota.set_power(0, true)```<br>```[true]```
tasmota.get\_light<a class="cmnd" id="tasmota_get_light"></a>|_deprecated_ use `light.get`
tasmota.set\_light<a class="cmnd" id="tasmota_set_light"></a>|_deprecated_ use `light.set`
tasmota.get\_switches<a class="cmnd" id="tasmota_get_switches"></a>|`() -> list(bool)`<br>Returns as many values as switches are present. `true` means `PRESSED` and `false` means `NOT_PRESSED`. (Warning: this is the opposite of the internal representation where PRESSED=0)<br>Note: if there are holes in the switch definition, the values will be skipped. I.e. if you define SWITCH1 and SWITCH3, the array will return the two consecutive values for switches 1/3.

#### Low-level access to Tasmota globals and settings.

***Use with care and only if you know what you are doing.***

The construct is to use `tasmota.global` or `tasmota.settings` to read or write attributes. 

!!! warning "You can do bad things with these features"

Value|Details
:---|:---
tasmota.global.sleep<a class="cmnd" id="tasmota_global_sleep"></a>|Current sleep value
tasmota.global.devices_present<a class="cmnd" id="tasmota_global_devices_present"></a>|Number of Power channels, e.g. having virtual relays
tasmota.settings.sleep<a class="cmnd" id="tasmota_settings_sleep"></a>|Sleep value stored in flash

### `mqtt` module

Use with `import mqtt`.

Since v11.1.0.1, there is an easier way than registering a driver, and listening to `mqtt_data` event. You can now just attach a function or closure to a MQTT topic, and it does the magic for you.

The function you attach to a topic pattern received **only** the matching MQTT messages, not all messages unlike `mqtt_data()` would.

The function takes the same parameters as `mqtt_data()`:

- `topic`: full topic received from the broker
- `idx`: not used
- `payload_s`: payload as string, usually converted to JSON with `import json json.load(payload_s)`
- `payload_b`: payload as a binary payload, bytes() array

the function should return `true` if the event was parsed or if the event should not trigger a Tasmota command. If you return `nil` or nothing, it is considered as `true` which is the usual behavior you want (i.e. not trigger a Tasmota command from random MQTT messages).

Tasmota Function|Parameters and details
:---|:---
mqtt.publish<a class="cmnd" id="mqtt_publish"></a>|`(topic:string, payload:string[, retain:bool, start:int, len:int]) -> nil`<br>Equivalent of `publish` command, publishes a MQTT message on `topic` with `payload`. Optional `retain` parameter.<br>`payload` can be a string or a bytes() binary array<br>`start` and `len` allow to specify a sub-part of the string or bytes buffer, useful when sending only a portion of a larger buffer.
mqtt.subscribe<a class="cmnd" id="mqtt_subscribe"></a>|`mqtt.subscribe(topic:string [, function:closure]) -> nil`<br>Subscribes to a `topic` (exact match or pattern). Contrary to Tasmota's `Subscribe` command, the topic is sent as-is and not appended with `/#`. You need to add wildcards yourself. Driver method `mqtt_data` is called for each matching payload.<br>If a function/closure is added, the function is called whenever and only if an incoming messages matches the pattern for this function. The function should return `true` if message was processed, `false` if not which will let the message flow to Tasmota eventually as a command.<br>You can call mqtt.subscribe even without MQTT connection, and Tasmota will manage subscriptions upon connection, also when reconnecting after an outage. This allows code in `autoexec.be` do make a subscription, which will then have effect after connection has been established.
mqtt.unsubscribe<a class="cmnd" id="mqtt_unsubscribe"></a>|`(topic:string) -> nil`<br>Unsubscribe to a `topic` (exact match).
mqtt.connected<a class="cmnd" id="mqtt_connected"></a>|`mqtt.connected() -> bool`<br>Returns `true` if Tasmota is connected to the MQTT broker

### `light` object

Module `light` is automatically imported via a hidden `import light` command.

Tasmota Function|Parameters and details
:---|:---
light.get<a class="cmnd" id="light_get"></a>|`(index:int) -> map`<br>Get the current status if light number `index` (default:0).<br>Example:<br>```> light.get```<br>```{'bri': 77, 'hue': 21, 'power': true, 'sat': 140, 'rgb': '4D3223', 'channels': [77, 50, 35]}```
light.set<a class="cmnd" id="light_set"></a>|`(settings:map[, index:int]) -> map`<br>Sets the current state for light `index` (default: 0.<br>Example:<br>```> light.set({'hue':120,'bri':50,'power':true})```<br>```{'bri': 50, 'hue': 120, 'power': true, 'sat': 140, 'rgb': '173217', 'channels': [23, 50, 23]}```
light.gamma10<a class="cmnd" id="light_gamma10"></a>|`(channel) -> int`<br>Computes the gamma corrected value with 10 bits resolution for input and output. Note: Gamma is optimized for speed and smooth fading, and is not 100% mathematically accurate.<br>Input and output are in range 0..1023.
light.reverse\_gamma10<a class="cmnd" id="light_reverse_gamma10"></a>|`(gamma) -> int`<br>Computes the reverse gamma with 10 bits resolution for input and output.<br>Input and output are in range 0..1023.
light.gamma8<a class="cmnd" id="light_gamma8"></a>|`(channel) -> int`<br>Computes the gamma corrected value with 8 bits resolution for input and output.<br>Input and output are in range 0..255.

### `gpio` module

This module allows to retrieve the GPIO configuration set in the templates. You need to distinguish between **logical GPIO** (like PWM, or I2C) and **physical GPIO** which represent the GPIO number of the physical pin. `gpio.pin()` transforms a logical GPIO to a physical GPIO, or `-1` if the logical GPIO is not set.

Currently there is limited support for GPIO: you can only read/write in digital mode and set the GPIO mode.

Tasmota Function|Parameters and details
:---|:---
gpio.pin_used<a class="cmnd" id="gpio_pin_used"></a>|`(gpio [,index]) -> bool`<br>returns if a specific GPIO is used. `index` allows to iterate through GPIOs. Example: `gpio.pin_used(gpio.REL1)` to check Relay1, or `gpio.pin_used(gpio.REL1,1)` to check Relay2 (index is zero-based)
gpio.pin<a class="cmnd" id="gpio_pin"></a>|`(gpio [,index]) -> int`<br>returns the physical GPIO number assigned to the Tasmota GPIO, or -1 if the GPIO is not assigned
gpio.digital\_write<a class="cmnd" id="gpio_digital_write"></a>|`(phy_gpio, val) -> nil` needs the physical GPIO number<br>sets the GPIO to LOW/HIGH. `val` can be `0`, `1`, `gpio.LOW` or `gpio.HIGH`. Example: `gpio.digital_write(gpio.pin(gpio.REL1), gpio.HIGH)` sets Relay1 to High.
gpio.digital\_read<a class="cmnd" id="gpio_digital_read"></a>|`(phy_gpio) -> int` needs the physical GPIO number<br>reads the value of a GPIO. Returns 0 or 1.
gpio.pin\_mode<a class="cmnd" id="gpio_pin_mode"></a>|`(phy_gpio, mode) -> nil` needs the physical GPIO number<br>Changes the GPIO mode. It should be called very cautiously. Normally Tasmota handles automatically GPIO modes.<BR>`mode` can have the following values: `gpio.INPUT`, `gpio.OUTPUT`, `gpio.PULLUP`, `gpio.INPUT_PULLUP`, `gpio.PULLDOWN`, `gpio.OPEN_DRAIN`, `gpio.OUTPUT_OPEN_DRAIN`, `gpio.DAC`
gpio.dac\_voltage<a class="cmnd" id="gpio_dac_voltage"></a>|`(phy_gpio:int, voltage_mv:int) -> int`<br>Sets the DAC voltage in mV. The resolution is 8 bits over a range of 0..3.3V, i.e. an increment of ~13mV, this function returns the actual voltage output rounded to the closest value. See below for constraints of DAC GPIOs.
gpio.set\_pwm<a class="cmnd" id="gpio_set_pwm"></a>|`(phy_gpio:int, duty:int [, phase:int]) -> nil`<br>Sets the value of a PWM output<br>`phy_gpio`: physical GPIO number<br>`duty`: analog value for the pwm, range is 0..1023 unless you change the PWM range<br>`phase`: (opt) set the starting point in time for this pulse from start of cycle. Range is 0..1023 unless you change PWM range. This allows to dephase pulses, for example for H-bridge.<br>**Low-level** this is a low-level function that bypasses all the Tasmota logic around PWM. Use with caution as a `PWM` command might overwrite your settings.
gpio.set\_pwm\_freq<a class="cmnd" id="gpio_set_pwm_frew"></a>|`(phy_gpio:int, frequency:int) -> nil`<br>Sets the frequency value of a PWM output.<br>**Low-level** this is a low-level function that bypasses all the Tasmota logic around PWM. Use with caution as a `PWM` command might overwrite your settings.
gpio.counter\_read<a class="cmnd" id="gpio_counter_read"></a>|`(counter:int) -> int or nil`<br>Read counter value, 0 is Counter1, or return nil if counter is not used
gpio.counter\_set<a class="cmnd" id="gpio_counter_set"></a>|`(counter:int, value:int) -> int or nil`<br>Set the counter value, 0 is Counter1, return the actual value, or return nil if counter is not used
gpio.counter\_add<a class="cmnd" id="gpio_counter_add"></a>|`(counter:int, value:int) -> int or nil`<br>Add to the counter value, 0 is Counter1, return the actual value, or return nil if counter is not used

Any internal error or using unsupported GPIO yields a Berry exception.

??? note "Possible values for Tasmota GPIOs:"

    `gpio.NONE`, `gpio.KEY1`, `gpio.KEY1_NP`, `gpio.KEY1_INV`, `gpio.KEY1_INV_NP`, `gpio.SWT1`, `gpio.SWT1_NP`, `gpio.REL1`, `gpio.REL1_INV`, `gpio.LED1`, `gpio.LED1_INV`, `gpio.CNTR1`, `gpio.CNTR1_NP`, `gpio.PWM1`, `gpio.PWM1_INV`, `gpio.BUZZER`, `gpio.BUZZER_INV`, `gpio.LEDLNK`, `gpio.LEDLNK_INV`, `gpio.I2C_SCL`, `gpio.I2C_SDA`, `gpio.SPI_MISO`, `gpio.SPI_MOSI`, `gpio.SPI_CLK`, `gpio.SPI_CS`, `gpio.SPI_DC`, `gpio.SSPI_MISO`, `gpio.SSPI_MOSI`, `gpio.SSPI_SCLK`, `gpio.SSPI_CS`, `gpio.SSPI_DC`, `gpio.BACKLIGHT`, `gpio.OLED_RESET`, `gpio.IRSEND`, `gpio.IRRECV`, `gpio.RFSEND`, `gpio.RFRECV`, `gpio.DHT11`, `gpio.DHT22`, `gpio.SI7021`, `gpio.DHT11_OUT`, `gpio.DSB`, `gpio.DSB_OUT`, `gpio.WS2812`, `gpio.MHZ_TXD`, `gpio.MHZ_RXD`, `gpio.PZEM0XX_TX`, `gpio.PZEM004_RX`, `gpio.PZEM016_RX`, `gpio.PZEM017_RX`, `gpio.SAIR_TX`, `gpio.SAIR_RX`, `gpio.PMS5003_TX`, `gpio.PMS5003_RX`, `gpio.SDS0X1_TX`, `gpio.SDS0X1_RX`, `gpio.SBR_TX`, `gpio.SBR_RX`, `gpio.SR04_TRIG`, `gpio.SR04_ECHO`, `gpio.SDM120_TX`, `gpio.SDM120_RX`, `gpio.SDM630_TX`, `gpio.SDM630_RX`, `gpio.TM1638CLK`, `gpio.TM1638DIO`, `gpio.TM1638STB`, `gpio.MP3_DFR562`, `gpio.HX711_SCK`, `gpio.HX711_DAT`, `gpio.TX2X_TXD_BLACK`, `gpio.TUYA_TX`, `gpio.TUYA_RX`, `gpio.MGC3130_XFER`, `gpio.MGC3130_RESET`, `gpio.RF_SENSOR`, `gpio.AZ_TXD`, `gpio.AZ_RXD`, `gpio.MAX31855CS`, `gpio.MAX31855CLK`, `gpio.MAX31855DO`, `gpio.NRG_SEL`, `gpio.NRG_SEL_INV`, `gpio.NRG_CF1`, `gpio.HLW_CF`, `gpio.HJL_CF`, `gpio.MCP39F5_TX`, `gpio.MCP39F5_RX`, `gpio.MCP39F5_RST`, `gpio.PN532_TXD`, `gpio.PN532_RXD`, `gpio.SM16716_CLK`, `gpio.SM16716_DAT`, `gpio.SM16716_SEL`, `gpio.DI`, `gpio.DCKI`, `gpio.CSE7766_TX`, `gpio.CSE7766_RX`, `gpio.ARIRFRCV`, `gpio.ARIRFSEL`, `gpio.TXD`, `gpio.RXD`, `gpio.ROT1A`, `gpio.ROT1B`, `gpio.ADC_JOY`, `gpio.SSPI_MAX31865_CS1`, `gpio.HRE_CLOCK`, `gpio.HRE_DATA`, `gpio.ADE7953_IRQ`, `gpio.SOLAXX1_TX`, `gpio.SOLAXX1_RX`, `gpio.ZIGBEE_TX`, `gpio.ZIGBEE_RX`, `gpio.RDM6300_RX`, `gpio.IBEACON_TX`, `gpio.IBEACON_RX`, `gpio.A4988_DIR`, `gpio.A4988_STP`, `gpio.A4988_ENA`, `gpio.A4988_MS1`, `gpio.OUTPUT_HI`, `gpio.OUTPUT_LO`, `gpio.DDS2382_TX`, `gpio.DDS2382_RX`, `gpio.DDSU666_TX`, `gpio.DDSU666_RX`, `gpio.SM2135_CLK`, `gpio.SM2135_DAT`, `gpio.DEEPSLEEP`, `gpio.EXS_ENABLE`, `gpio.TASMOTACLIENT_TXD`, `gpio.TASMOTACLIENT_RXD`, `gpio.TASMOTACLIENT_RST`, `gpio.TASMOTACLIENT_RST_INV`, `gpio.HPMA_RX`, `gpio.HPMA_TX`, `gpio.GPS_RX`, `gpio.GPS_TX`, `gpio.HM10_RX`, `gpio.HM10_TX`, `gpio.LE01MR_RX`, `gpio.LE01MR_TX`, `gpio.CC1101_GDO0`, `gpio.CC1101_GDO2`, `gpio.HRXL_RX`, `gpio.ELECTRIQ_MOODL_TX`, `gpio.AS3935`, `gpio.ADC_INPUT`, `gpio.ADC_TEMP`, `gpio.ADC_LIGHT`, `gpio.ADC_BUTTON`, `gpio.ADC_BUTTON_INV`, `gpio.ADC_RANGE`, `gpio.ADC_CT_POWER`, `gpio.WEBCAM_PWDN`, `gpio.WEBCAM_RESET`, `gpio.WEBCAM_XCLK`, `gpio.WEBCAM_SIOD`, `gpio.WEBCAM_SIOC`, `gpio.WEBCAM_DATA`, `gpio.WEBCAM_VSYNC`, `gpio.WEBCAM_HREF`, `gpio.WEBCAM_PCLK`, `gpio.WEBCAM_PSCLK`, `gpio.WEBCAM_HSD`, `gpio.WEBCAM_PSRCS`, `gpio.BOILER_OT_RX`, `gpio.BOILER_OT_TX`, `gpio.WINDMETER_SPEED`, `gpio.KEY1_TC`, `gpio.BL0940_RX`, `gpio.TCP_TX`, `gpio.TCP_RX`, `gpio.ETH_PHY_POWER`, `gpio.ETH_PHY_MDC`, `gpio.ETH_PHY_MDIO`, `gpio.TELEINFO_RX`, `gpio.TELEINFO_ENABLE`, `gpio.LMT01`, `gpio.IEM3000_TX`, `gpio.IEM3000_RX`, `gpio.ZIGBEE_RST`, `gpio.DYP_RX`, `gpio.MIEL_HVAC_TX`, `gpio.MIEL_HVAC_RX`, `gpio.WE517_TX`, `gpio.WE517_RX`, `gpio.AS608_TX`, `gpio.AS608_RX`, `gpio.SHELLY_DIMMER_BOOT0`, `gpio.SHELLY_DIMMER_RST_INV`, `gpio.RC522_RST`, `gpio.P9813_CLK`, `gpio.P9813_DAT`, `gpio.OPTION_A`, `gpio.FTC532`, `gpio.RC522_CS`, `gpio.NRF24_CS`, `gpio.NRF24_DC`, `gpio.ILI9341_CS`, `gpio.ILI9341_DC`, `gpio.ILI9488_CS`, `gpio.EPAPER29_CS`, `gpio.EPAPER42_CS`, `gpio.SSD1351_CS`, `gpio.RA8876_CS`, `gpio.ST7789_CS`, `gpio.ST7789_DC`, `gpio.SSD1331_CS`, `gpio.SSD1331_DC`, `gpio.SDCARD_CS`, `gpio.ROT1A_NP`, `gpio.ROT1B_NP`, `gpio.ADC_PH`, `gpio.BS814_CLK`, `gpio.BS814_DAT`, `gpio.WIEGAND_D0`, `gpio.WIEGAND_D1`, `gpio.NEOPOOL_TX`, `gpio.NEOPOOL_RX`, `gpio.SDM72_TX`, `gpio.SDM72_RX`, `gpio.TM1637CLK`, `gpio.TM1637DIO`, `gpio.PROJECTOR_CTRL_TX`, `gpio.PROJECTOR_CTRL_RX`, `gpio.SSD1351_DC`, `gpio.XPT2046_CS`, `gpio.CSE7761_TX`, `gpio.CSE7761_RX`, `gpio.VL53LXX_XSHUT1`, `gpio.MAX7219CLK`, `gpio.MAX7219DIN`, `gpio.MAX7219CS`, `gpio.TFMINIPLUS_TX`, `gpio.TFMINIPLUS_RX`, `gpio.ZEROCROSS`, `gpio.HALLEFFECT`, `gpio.EPD_DATA`, `gpio.INPUT`, `gpio.KEY1_PD`, `gpio.KEY1_INV_PD`, `gpio.SWT1_PD`, `gpio.I2S_OUT_DATA`, `gpio.I2S_OUT_CLK`, `gpio.I2S_OUT_SLCT`, `gpio.I2S_IN_DATA`, `gpio.I2S_IN_CLK`, `gpio.I2S_IN_SLCT`, `gpio.INTERRUPT`, `gpio.MCP2515_CS`, `gpio.HRG15_TX`, `gpio.VINDRIKTNING_RX`, `gpio.BL0939_RX`, `gpio.BL0942_RX`, `gpio.HM330X_SET`, `gpio.HEARTBEAT`, `gpio.HEARTBEAT_INV`, `gpio.SHIFT595_SRCLK`, `gpio.SHIFT595_RCLK`, `gpio.SHIFT595_OE`, `gpio.SHIFT595_SER`, `gpio.SOLAXX1_RTS`, `gpio.OPTION_E`, `gpio.SDM230_TX`, `gpio.SDM230_RX`, `gpio.ADC_MQ`, `gpio.CM11_TXD`, `gpio.CM11_RXD`, `gpio.BL6523_TX`, `gpio.BL6523_RX`, `gpio.ADE7880_IRQ`, `gpio.RESET`, `gpio.MS01`, `gpio.SDIO_CMD`, `gpio.SDIO_CLK`, `gpio.SDIO_D0`, `gpio.SDIO_D1`, `gpio.SDIO_D2`, `gpio.SDIO_D3`, `gpio.FLOWRATEMETER_SIGNAL`, `gpio.SENSOR_END`

An H-bridge is an electronic circuit that switches the polarity of a voltage applied to a load. These circuits are often used in robotics and other applications to allow DC motors to run forwards or backwards.

See the Berry cookbook for [H-bridge control](Berry-Cookbook.md#h-bridge-control)

### DAC GPIOs

DAC is limited to specific GPIOs:

- ESP32: only GPIO 25-26
- ESP32-S2: only GPIO 17-18
- ESP32-C3: not supported

!!! example
    ```
    > gpio.pin_mode(25, gpio.DAC)   # sets GPIO25 to a DAC pin
    > gpio.dac_voltage(25, 1250)    # set voltage to 1250mV
    1255
    ```
    The function returns the closest voltage found. In this case it's 1255 for setting to 1250.

### I2S

DAC can also be used via `Esp8266Audio` through the ESP32 I2S -> DAC bridge.

??? example
    ```berry
    class MP3_Player : Driver
      var audio_output, audio_mp3, fast_loop_closure
      def init()
        self.audio_output = AudioOutputI2S()
        self.audio_mp3 = AudioGeneratorMP3()
        self.fast_loop_closure = def () self.fast_loop() end
        tasmota.add_fast_loop(self.fast_loop_closure)
      end
    
      def play(mp3_fname)
        if self.audio_mp3.isrunning()
          self.audio_mp3.stop()
        end
        var audio_file = AudioFileSourceFS(mp3_fname)
        self.audio_mp3.begin(audio_file, self.audio_output)
        self.audio_mp3.loop()    #- start playing now -#
      end
    
      def fast_loop()
        if self.audio_mp3.isrunning()
          if !self.audio_mp3.loop()
            self.audio_mp3.stop()
            tasmota.remove_fast_loop(self.fast_loop_closure)
          end
        end
      end
    end
    
    mp3_player = MP3_Player()
    mp3_player.play("/pno-cs.mp3")
    ```

### `energy` module

The `energy` module provides ways to read current energy counters and values (if you're creating your own automation) or updating the energy counters (if you're writing a driver).

It relies on a new Berry feature that provides a direct mapping between the internal `C` structure called `struct Energy` and the `energy` module in Berry.

For example, if you want to read or update an energy value:

```
> energy.active_power
0
> energy.active_power = 460
> energy.active_power
460

# internally it updates the C value `Energy.active_power[0]` (float)
```

You don't need to do `import energy` since Tasmota does it for you at boot.

The special `energy.read()` function dumps all current values to a single `map`. Be aware that the object is very long. Prefer accessing individual attributes instead.

Tasmota Function|Parameters and details
:---|:---
energy.read()<a class="cmnd" id="energy_read"></a>|`() -> map`<br>Returns all current values for the energy module. Some values may be unused by the current driver.
energy.driver_enabled()<a class="cmnd" id="energy_driver_enabled"></a>|`() -> bool`<br>Returns `true` if the Berry virtual driver is active, i.e. `OPTION_A 9` is configured on a GPIO.<br>See below for Berry Energy driver implementation.

List of `energy` attributes that you can read or write:

Attribute|Type|Description
:---|:---|:---
voltage|float|Voltage (V) for main phase
voltage\_phases|array of float|Voltage (V) as an array of phases
current|float|Current (A) for main phase
current\_phases|array of float|Current (A) as an array of phases
active\_power|float|Active Power (W) for main phase
active\_power\_phases|array of float|Active Power (W) as an array of phases
reactive\_power|float|Reactive Power (W) for main phase
reactive\_power\_phases|array of float|Reactive Power (W) as an array of phases
power\_factor|float|Power Factor (no unit) for main phase
power\_factor\_phases|array of float|Power Factor (no unit) as an array of phases
frequency|float|Frequency (Hz) for main phase
frequency\_phases|array of float|Frequency (Hz) as an array of phases
export\_active|float|(kWh)
export\_active\_phases|array of float|(kWh)
start\_energy|float|Total previous energy (kWh)
daily|float|Daily energy (kWh)
total|float|Total energy (kWh)
today\_delta\_kwh|uint32|(deca milli Watt hours)<br>5764 = 0.05764 kWh = 0.058 kWh
today\_offset\_kwh|uint32|(deca milli Watt hours)
today\_kwh|uint32|(deca milli Watt hours)
period|uint32|(deca milli Watt hours)
fifth\_second|uint8|
command\_code|uint8|
data\_valid|uint8|`0` if data is valid for main phase
data\_valid\_phases|array of uint8|`0` if data is valid as an array of phases
phase\_count|uint8|Number of phases (1..8)
voltage\_common|bool|Use single voltage
frequency\_common|bool|Use single frequency
use\_overtemp|bool|Use global temperature as overtemp trigger on internal energy monitor hardware
today\_offset\_init\_kwh|bool|
voltage\_available|bool|Enable if voltage is measured
current\_available|bool|Enable if current is measured
type\_dc|bool|
power\_on|bool|
|||**Below if for Energy Margin Detection**
power\_history\_0<br>power\_history\_1<br>power\_history\_2|uint16|
power\_steady\_counter|uint8|Allow for power on stabilization
min\_power\_flag|bool|
max\_power\_flag|bool|
min\_voltage\_flag|bool|
max\_voltage\_flag|bool|
min\_current\_flag|bool|
max\_current\_flag|bool|
|||**Below if for Energy Power Limit**
mplh\_counter|uint16|
mplw\_counter|uint16|
mplr\_counter|uint8|
max\_energy\_state|uint8|

### Energy driver in Berry

Since v14.2.0, it is possible to implement an Energy driver in pure Berry. The Berry driver is enabled when an `OPTION_A 9` GPIO is configured:

- by default, the energy driver has zero consumption.
- the berry code can is `energy.driver_enabled()` to check if the virtual Berry Energy driver is active (i.e. `OPTION_A 9` is configured)
- the following values need to be configured: `energy.phase_count` (default `1`), `energy.voltage`, `energy.current`, `energy.power_factor` (typically `1.0` or less), `energy.frequency` (default `nan`)
- the most important value is `energy.active_power` (in Watt) which is added to the daily power consumption

Example test code in `autoexec.be`:

```berry
if energy.driver_enabled()
  energy.phase_count = 1
  energy.voltage = 240
  energy.power_factor = 1.0
  energy.current = 1.5
  energy.frequency = 50
  energy.active_power = 360
end
```

### `wire` object for I^2^C

Berry Scripting provides 2 objects: `wire1` and `wire2` to communicate with both I^2^C buses.

Use `wire1.scan()` and `wire2.scan()` to scan both buses:

```
> wire1.scan()
[]

> wire2.scan()
[140]
```

You generally use `tasmota.wire_scan()` to find a device and the corresponding I^2^C bus.

!!! example "MPU6886 on bus 2"

    ```
    > mpuwire = tasmota.wire_scan(0x68, 58)
    > mpuwire
    <instance: Wire()>
    ```

Wire Function|Parameters and details
:---|:---
bus<a class="cmnd" id="wire_bus"></a>|`read only attribute, 1 or 2`<br>Bus number for this wire instance.
enabled<a class="cmnd" id="wire_enabled"></a>|`() -> bool`<br>Returns `true` is the I2C bus is initialized (i.e. GPIOs are defined)
scan<a class="cmnd" id="wire_scan"></a>|`() -> array of int`<br>Scan the bus and return all responding addresses. Note: addresses are displayed as decimal ints, not hex.
scan<a class="cmnd" id="wire_scan"></a>|`() -> array of int`<br>Scan the bus and return all responding addresses. Note: addresses are displayed as decimal ints, not hex.
detect<a class="cmnd" id="wire_detect"></a>|`(addr:int) -> bool`<br>Returns `true` if the device of address `addr` is connected to this bus.
read<a class="cmnd" id="wire_read"></a>|`(addr:int, reg:int, size:int) -> int or nil`<br>Read a value of 1..4 bytes from address `addr` and register `reg`. Returns `nil` if no response.
write<a class="cmnd" id="wire_write"></a>|`(addr:int, reg:int, val:int, size:int) -> bool`<br>Writes a value of 1..4 bytes to address `addr`, register `reg` with value `val`. Returns `true` if successful, `false` if not.
read\_bytes<a class="cmnd" id="wire_read_bytes"></a>|`(addr:int, reg:int ,size:int) -> instance of bytes()`<br>Reads a sequence of `size` bytes from address `addr` register `reg`. Result is a `bytes()` instance or `bytes()` if not successful.`
write\_bytes<a class="cmnd" id="wire_write_bytes"></a>|`(addr:int, reg:int, val:bytes) -> nil`<br>Writes the `val` bytes sequence as `bytes()` to address `addr` register `reg`.

Low-level commands if you need finer control:

Wire Function|Parameters and details
:---|:---
\_begin\_transmission<a class="cmnd" id="wire_begin_transmission"></a>|`(address:int) -> nil`
\_end\_transmission<a class="cmnd" id="wire_end_transmission"></a>|`([stop:bool]) -> nil`<br>Send stop if `stop` is `true`.
\_request\_from<a class="cmnd" id="wire_request_from"></a>|`(addr:int, size:int [stop:bool = true]) -> nil`
\_available<a class="cmnd" id="wire_available"></a>|`() -> bool`
\_read<a class="cmnd" id="wire_read"></a>|`read() -> int`<br>Reads a single byte.
\_write<a class="cmnd" id="wire_write"></a>|`(value:int or s:string) -> nil`<br>Sends either single byte or an arbitrary string.

### `path` module

A simplified version of `os.path` module of standard Berry which is disabled in Tasmota because we don't have a full OS.

The default file-system is the ESP32 internal flash. If you have a SD card mounted, it is mapped to the `/sd/` subdirectory.

Example:

``` berry
import path
print(path.listdir("/sd/"))
# outputs a list of filenames at the root dir of the SD card
```

Tasmota Function|Parameters and details
:---|:---
path.exists<a class="cmnd" id="path_exists"></a>|`(file_name:string) -> bool`<br>Returns `true` if the file exists. You don't need to prefix with `/`, as it will automatically be added if the file does not start with `/`
path.last_modified<a class="cmnd" id="path_last_modified"></a>|`(file_name:string) -> int`<br>Returns the timestamp when the file was last modified, or `nil` if the file does not exist. You don't need to prefix with `/`, as it will automatically be added if the file does not start with `/`
path.listdir<a class="cmnd" id="path_listdir"></a>|`(dir_name:string) -> list(string)`<br>List a directory, typically root dir `"/"` and returns a list of filenames in the directory. Returns an empty list if the directory is invalid
path.remove<a class="cmnd" id="path_remove"></a>|`(file_name:string) -> bool`<br>Deletes a file by name, return `true` if successful<br>A folder needs to be empty or a `false` is returned.
path.format<a class="cmnd" id="path_format"></a>|`(true:bool) -> bool`<br>Re-formats the LittleFS filesystem (internal ESP32 flash) and erases all content. The parameter needs to be true as to avoid unwanted calls. Returns true if reformatting was successful.<br>This is sometimes useful when the file-system becomes unstable or corrupt after multiple re-partitionings.
path.mkdir<a class="cmnd" id="path_mkdir"></a>|`(dir_name:string) -> bool`<br>Creates a directory, return `true` if successful
path.rmdir<a class="cmnd" id="path_rmdir"></a>|`(dir_name:string) -> bool`<br>Deletes a directory if empty, return `true` if successful
path.isdir<a class="cmnd" id="path_isdir"></a>|`(name:string) -> bool`<br>Checks if path name is a directory
path.rename<a class="cmnd" id="path_rename"></a>|`(name1:string, name2:string) -> bool`<br>Rename file or folder `name1` into `name2`, return `true` if successful


### `persist` module

Easy way to persist simple values in Berry and read/write any attribute. Values are written in JSON format in `_persist.json` file. Be aware that `persist` cannot detect any change in sub-objects like lists or maps; in such case you can call `persist.dirty()` to indicate that data needs to be saved.

!!! example
     ```berry
     > import persist    
     > persist.a = 1    
     > persist.b = "foobar"    
     > print(persist)    
     <instance: Persist({'a': 1, 'b': 'foobar'})>    
     > persist.save()   # save to _persist.json
     ```   

Tasmota Function|Parameters and details
:---|:---
persist.save<a class="cmnd" id="persist_save"></a>|`()` -> nil<br>triggers saving to filesystem. It is called automatically before a restart but you might want to call it yourself to prevent losing data in case of power loss or crash. `persist.save()` writes to flash, so be careful of not calling it too often, or it will cause wearing of flash and reduce its lifetime.<br>By default `persist.save()` only saves if data was marked as dirty, or does nothing. You can force an actual save with `persist.save(true)`
persist.has<a class="cmnd" id="persist_has"></a>|`(key:string) -> bool`<br>returns true/false if the key exists
persist.remove<a class="cmnd" id="persist_remove"></a>|`(key:string) -> bool`<br>removes a key or ignores if key doesn't exist
persist.find<a class="cmnd" id="persist_find"></a>|`(key:string [, "default value"]) -> string | bool`<br>returns the value for a key, nil or the default value. Similar to `map.find`
persist.member<a class="cmnd" id="persist_member"></a>|`(key:string) -> string | nil`<br>returns the value for a key, or nil.
persist.setmember<a class="cmnd" id="persist_setmember"></a>|`(key:string, value:string) -> nil`<br>sets the value for a key, when the key is in a variable
persist.zero<a class="cmnd" id="persist_zero"></a>|`() -> nil`<br>clears all entries. This may be destructive to other code using `persist`
persist.dirty<a class="cmnd" id="persist_dirty"></a>|`() -> nil`<br>marks data as dirty to force writing to flash

### `introspect` module

Allows to do introspection on instances and modules, to programmatically list attributes, set and get them.

```berry
> class A var a,b def f() return 1 end end
> ins=A()
> ins.a = "foo"
> import introspect

> introspect.members(ins)
['b', 'a', 'f']

> introspect.get(ins, "a")
foo

> introspect.set(ins, "a", "bar")
bar

> ins.a
bar
```

Tasmota Function|Parameters and details
:---|:---
introspect.members<a class="cmnd" id="introspect_members"></a>|`(nil | instance | module | class) -> list`<br>Returns the list of members of the object. If `nil` is passed, it returns the list of globals (similar to `global` module). Note: virtual dynamic members are not listed.
introspect.get<a class="cmnd" id="introspect_get"></a>|`(instance | module, name:string) -> any`<br>Returns the member of name `name` or `nil` if it does not exist. Note: virtual dynamic members are not yet supported. Note2: classes are not yet supported.
introspect.set<a class="cmnd" id="introspect_set"></a>|`(instance | module, name:string, value:any) -> any`<br>Sets the member of name `name` to `value` or ignores the call if the member does not exist. Note: virtual dynamic members are not yet supported.
introspect.module<a class="cmnd" id="introspect_module"></a>|`(name:string) -> module or nil`<br>Loads a module by name or return nil if not found. The import command works only for static predefined names, this addition makes it dynamic. Contrary to import command, this function does not create an entry in the current scope (i.e. does not either create a global variable with the module's name).
introspect.toptr<a class="cmnd" id="introspect_toptr"></a>|`(any) -> comptr`<br>Converts an `int` to a `comptr` pointer. This is sage in Tasmota since pointers and ints are both 32 bits in size.<br>If argument is a general object, this returns a pointer to the object, and can be converted back to the original object with `introspect.fromptr`.
introspect.fromptr<a class="cmnd" id="introspect_fromptr"></a>|`(comptr) -> any`<br>Converts a `comptr` pointer to its original object.<br>**Warning:** this operation is considered dangerous and should be used with extreme care. If the pointer is invalid or the object was garbage collected, Tasmota will crash.
introspect.ismethod<a class="cmnd" id="introspect_ismethod"></a>|`(function or closure) -> bool`<br>Returns `true` if the function passed as argument is a method of a class, or `false` if the argument is a simple function or a static method.<br>This is typically used to check callbacks and make sure that you don't pass a method as argument; methods typically need to be wrapped in a closure to capture the target object.

### `webclient` class

Class `webclient` provides an implementation of an HTTP/HTTPS web client and make requests on the LAN or over the Internet.

Features:

 - Support HTTP and HTTPS requests to IPv4 addresses and domain names, to arbitrary ports, via a full URL.
 - Support for HTTPS and TLS via BearSSL (which is much lighter than default mbedTLS)
 - HTTPS (TLS) only supports cipher ECDHE_RSA_WITH_AES_128_GCM_SHA256 which is both secure and widely supported
 - Support for URL redirections
 - Ability to set custom User-Agent
 - Ability to set custom headers
 - Ability to set Authentication header
 - Support for Chunked encoding response (so works well with Tasmota devices)
 - Support for `GET`, `POST`, `PUT`, `PATCH`, `DELETE` methods

The current implementation is based on a fork of Arduino's HttpClient customized to use BearSSL

Current limitations (if you need extra features please open a feature request on GitHub):

 - Payload sent to server (`POST`) can include either text or binary
 - Only supports text responses (html, json...) but not binary content yet (no NULL char allowed). However you can download binary content to the file-system with `write_file`
 - Maximum response size is 32KB, requests are dropped if larger
 - HTTPS (TLS) is in 'insecure' mode and does not check the server's certificate; it is subject to Man-in-the-Middle attack
 - No support for compressed response - this should not be a problem since the client does not advertise support for compressed responses


!!! example

    ``` berry
    > cl = webclient()
    > cl.begin("http://ota.tasmota.com/tasmota32/release/")
    <instance: webclient()>

    > r = cl.GET()
    > print(r)
    200

    > s = cl.get_string()
    > print(s)
    <pre>
    <b></b>Alternative firmware for ESP32 based devices with web UI,
    [.../...]
    ```


!!! example of downloading a file from Github
 
    ``` berry
    > cl = webclient()
    > cl.begin("https://raw.githubusercontent.com/tasmota/autoconf/main/esp32/M5Stack_Fire_autoconf.zip")
    <instance: webclient()>

    > r = cl.GET()
    > print(r)
    200

    > cl.write_file("M5Stack_Fire_autoconf.zip")
    950
    ```

#### Managing redirects

HTTP redirects (301/302) are not followed by default. You can use `wc.set_follow_redirects(true)` to have redirects automatically followed for HEAD and GET. There is a default limit of 10 successive redirects, this prevents from infinite loops.

For the examples, we use `http://ota.tasmota.com/tasmota32` which is redirected to `http://ota.tasmota.com/tasmota32/`

!!! example of following redirects
 
    ``` berry
    cl = webclient()
    cl.set_follow_redirects(true)
    cl.begin("http://ota.tasmota.com/tasmota32")
    r = cl.GET()
    print(r)
    s = cl.get_string()
    print(s)
    ```

Alternatively, you can manage yourself redirects and retrieve the `Location` header

!!! example of retrieving Location
 
    ``` berry
    cl = webclient()
    cl.set_follow_redirects(false)
    cl.collect_headers("Location")
    cl.begin("http://ota.tasmota.com/tasmota32")
    r = cl.GET()
    print(r)
    if r == 301 || r == 302
      print("Location:", cl.get_header("Location"))
    elif r == 200
      s = cl.get_string()
      print(s)
    end
    cl.close()
    ```

Main functions:

webclient method|Parameters and details
:---|:---
begin<a class="cmnd" id="wc_begin"></a>|`(url:string) -> self`<br>Set the complete URL, including protocol (`http` or `https`), IPv4 or domain name, port... This should be the first call. The connection is not established at this point.<br>Use `url_encode()` prior to sending a URL if it requires URL encoding.
GET<a class="cmnd" id="wc_get"></a>|`() -> result_code:int`<br>Establish a connection to server, send GET request and wait for response header.<BR>Returns the HTTP result code or an error code if negative, `200` means OK.
POST<a class="cmnd" id="wc_post"></a>|`(payload:string or bytes) -> result_code:int`<br>Establish a connection to server, send POST request with payload and wait for response header.<BR>Returns the HTTP result code or an error code if negative, `200` means OK.
PUT<a class="cmnd" id="wc_put"></a>|`(payload:string or bytes) -> result_code:int`<br>Establish a connection to server, send PUT request with payload and wait for response header.<BR>Returns the HTTP result code or an error code if negative, `200` means OK.
PATCH<a class="cmnd" id="wc_patch"></a>|`(payload:string or bytes) -> result_code:int`<br>Establish a connection to server, send PATCH request with payload and wait for response header.<BR>Returns the HTTP result code or an error code if negative, `200` means OK.
DELETE<a class="cmnd" id="wc_delete"></a>|`(payload:string or bytes) -> result_code:int`<br>Establish a connection to server, send DELETE request with payload and wait for response header.<BR>Returns the HTTP result code or an error code if negative, `200` means OK.
get\_size<a class="cmnd" id="wc_get_size"></a>|`() -> int`<br>Once a connection succeeded (GET or POST), reads the size of the response as returned by the server in headers (before actually reading the content). A value `-1` means that the response size is unknown until you read it.
get\_string<a class="cmnd" id="wc_get_string"></a>|`() -> string`<br>Once a connection succeeded (GET or POST), reads the content of the response in a string. The response max size is 32KB, any response larger is dropped. Connection is closed and resources are freed after this call completes.
close<a class="cmnd" id="wc_close"></a>|`() -> nil`<br>Closes the connection and frees buffers. `close` can be called after `GET` or `POST` and is implicitly called by `get_string`. You don't usually need to use `close` unless you are only retrieving the result_code for a request and not interested in the content.
write\_file<a class="cmnd" id="wc_write_file"></a>|`(file_name:string) -> int`<br>Downloads the binary content of the resource and stores it on the filesystem. Returns the number of bytes downloaded or -1 if an error occurred

Request customization:

webclient method|Parameters and details
:---|:---
add\_header<a class="cmnd" id="wc_add_header"></a>|`(name:string, value:string [, first:bool=false [, replace:bool=true]]) -> nil`<br>Sets an arbitrary header for `name`:`value`.<BR>`first` moves the header in the first place, `replace` replaces a header with the same name or adds one line if false.
set\_timeouts<a class="cmnd" id="wc_set_timeouts"></a>|`(req_timeout:int [, tcp_timeout:int]) -> self`<br>Sets the request timeout in ms and optionally the TCP connection timeout in ms.
set\_useragent<a class="cmnd" id="wc_set_useragent"></a>|`(useragent:string) -> self`<br>Sets the User-Agent header used in request.
set\_auth<a class="cmnd" id="wc_set_auth"></a>|`(auth:string) or (user:string, password:string) -> self`<br>Sets the authentication header, either using pre-encoded string, or standard user/password encoding.
set\_follow\_redirects<a class="cmnd" id="wc_set_follow_redirects"></a>|`(bool) -> self`<br>Enables or disables redirects following.<BR>If `false`: (`HTTPC_DISABLE_FOLLOW_REDIRECTS`) no redirection will be followed.<BR>If `true`: (`HTTPC_STRICT_FOLLOW_REDIRECTS`) strict RFC2616, only requests using GET or HEAD methods will be redirected (using the same method), since the RFC requires end-user confirmation in other cases.<BR>There is a default limit of 10 successive redirects, this prevents from infinite loops.
collect\_headers<a class="cmnd" id="wc_collect_headers"></a>|`( [header_name:string]* ) -> self`<br>Registers a list of header names that needs to be collected from the response. Pass multiple strings as separate arguments (not as a list).
get\_header<a class="cmnd" id="wc_get_header"></a>|`(header_name:string) -> string`<br>Returns the header value for a header name (case sensitive). Returns "" (empty string) if no header.

Static utility methods:

webclient static method|Parameters and details
:---|:---
url\_encode<a class="cmnd" id="wc_url_encode"></a>|`(url:string) -> string`<br>Encodes a string according to URL escape rules. Use before you use `begin()`


### `webserver` module

Module `webserver` provides functions to enrich Tasmota's Web UI. It is tightly linked to Tasmota page layout.

Functions used to add UI elements like buttons to Tasmota pages, and analyze the current request. See above `Driver` to add buttons to Tasmota UI.

General Function|Parameters and details
:---|:---
arg\_size<a class="cmnd" id="ws_arg_size"></a>|`() -> int`<br>Returns the number of arguments in the request
arg<a class="cmnd" id="ws_arg"></a>|`(arg_name:string or arg_index:int): -> string`<br>Returns the value of the argument either by name or by position number [0..arg_size()-1]. If an argument has multiple values, you need to iterate using ints to get all values
arg\_name<a class="cmnd" id="ws_arg_name"></a>|`(arg_index:int) -> string`<br>Returns the name of argument by index [0..arg_size()-1]
has\_arg<a class="cmnd" id="ws_has_arg"></a>|`(arg_name:string): -> bool`<br>Checks if an argument with this name exists
check\_privileged\_access<a class="cmnd" id="ws_check_privileged_access"></a>|`() -> bool`<br>Returns `true` if the page needs privileged access
header<a class="cmnd" id="ws_header"></a>|`(name:string) -> string or nil`<br>Return the header with key `name` sent by the browser. The name is case sensitive. Return `nil` if the header is not present or not collected.<br>Currently only `Referer`, `Host`, `Authorization` and `If-None-Match`.
content\_send<a class="cmnd" id="ws_content_send"></a>|`(string) -> nil`<br>Sends the HTML content to the client. Tasmota uses Chunked encoding, which means that the content is regularly sent to the client and not buffered in Tasmota's memory
content\_button<a class="cmnd" id="ws_content_button"></a>|`([button:int]) -> nil`<br>Displays a standard button by code, using Tasmota localization. Possible values are `webserver.BUTTON_CONFIGURATION`, `webserver.BUTTON_INFORMATION`, `webserver.BUTTON_MAIN`, `webserver.BUTTON_MANAGEMENT`, `webserver.BUTTON_MODULE`. Default is `webserver.BUTTON_MAIN`.
html\_escape<a class="cmnd" id="ws_html_escape"></a>|`(string) -> string`<br>Escapes characters to safe HTML.

Low-level functions if you want to display custom pages and content:

General Function|Parameters and details
:---|:---
on<a class="cmnd" id="ws_on"></a>|`(prefix:string, callback:closure [, method:int]) -> nil`<br>Attaches a handler (any closure or function) to a prefix. An optional `method` argument (defaults to `webserver.HTTP_ANY` specifies the HTTP methods to be received (ANY, GET, POST, OPTIONS, POST)<BR>WARNING - this should be called only when receiving `web_add_handler` event. If called before the WebServer is set up and Wi-Fi on, it will crash. For debug purpose, it can be called later when you are sure that Wi-Fi or Ethernet is up.
state<a class="cmnd" id="ws_state"></a>|`() -> int`<br>Returns the internal state of Tasmota web server. Possible values are `webserver.HTTP_OFF`, `webserver.HTTP_USER`, `webserver.HTTP_ADMIN`, `webserver.HTTP_MANAGER`, `webserver.HTTP_MANAGER_RESET_ONLY`.
content_open<a class="cmnd" id="ws_content_open"></a>|`(http_code:int, mimetype:string) -> nil`<br>Sets http code and mime type for the response
content_start<a class="cmnd" id="ws_content_start"></a>|`(string) -> nil`<br>Start response page with title
content_response<a class="cmnd" id="ws_content_response"></a>|`(string) -> nil`<br>Sends a response to a XMLHttpRequest
content_send_style<a class="cmnd" id="ws_content_send_style"></a>|`() -> nil`<br>Sends the standard Tasmota style
content_flush<a class="cmnd" id="ws_content_flush"></a>|`() -> nil`<br>Flush the buffer and send any buffered content to the client
content_stop<a class="cmnd" id="ws_content_stop"></a>|`() -> nil`<br>End of the response, closes the connection
redirect<a class="cmnd" id="ws_redirect"></a>|`(string) -> nil`<br>Sets location header, and http status 302

Module `webserver` also defines the following constants:

- Tasmota's web server states: `webserver.HTTP_OFF`, `webserver.HTTP_USER`, `webserver.HTTP_ADMIN`, `webserver.HTTP_MANAGER`, `webserver.HTTP_MANAGER_RESET_ONLY`
- Tasmota's pages: `webserver.BUTTON_CONFIGURATION`, `webserver.BUTTON_INFORMATION`, `webserver.BUTTON_MAIN`, `webserver.BUTTON_MANAGEMENT`, `webserver.BUTTON_MODULE`
- Methods received by handler: `webserver.HTTP_ANY`, `webserver.HTTP_GET`, `webserver.HTTP_OPTIONS`, `webserver.HTTP_POST`

See the [Berry Cookbook](Berry-Cookbook.md) for examples.

### `tcpclient` class

Simple TCP client supporting string and binary transfers:

- create an instance of the client with `var tcp = tcpclient()`
- connect to the server `tcp.connect(address:string, port:int [, timeout_ms:int]) -> bool` Address can be numerical IPv4 or domain name. Returns `true` if the connection succeeded. Optional `timeout` in milliseconds. The default timeout is `USE_BERRY_WEBCLIENT_TIMEOUT` (2 seconds).
- check if the socket is connected with `tcp.connected()`
- send content with `tcp.write(content:string or bytes) -> int`. Accepts either a string or a bytes buffer, returns the number of bytes sent. It's your responsibility to resend the missing bytes
- check if bytes are available for reading `tcp.available() -> int`. Returns `0` if nothing was received. This is the call you should make in loops for polling.
- read incoming content as string `tcp.read() -> string` or as bytes `tcp.readbytes() -> bytes`. It is best to call `tcp.available()` first to avoid creating empty response objects when not needed
- close the socket with `tcp.close()`


tcpclient Function|Parameters and details
:---|:---
connect<a class="cmnd" id="tcpclient_connect"></a>|`connect(address:string, port:int [, timeout_ms:int]) -> bool`<BR>Connect to `addr:port` with optional timeout in milliseconds (default 2s).<BR>Returns `true` if connection was successful, the call is blocking until the connection succeeded to the timeout expired.
connected<a class="cmnd" id="tcpclient_connected"></a>|`connected() -> bool`<BR>Returns `true` if the connection was successful and is still valid (not dropped by server or closed by client)
close<a class="cmnd" id="tcpclient_close"></a>|`close() -> nil`<BR>Drops the current connection.
write<a class="cmnd" id="tcpclient_write"></a>|`write(content:string or bytes) -> int`<BR>Accepts either a string or a bytes buffer, returns the number of bytes sent. It's you responsibility to resend the missing bytes.<BR>Returns `0` if something went wrong.
available<a class="cmnd" id="tcpclient_available"></a>|`available() -> int`<BR>Returns the number of bytes received in buffer and ready to be read.
read<a class="cmnd" id="tcpclient_read"></a>|`read([max_len:int]) -> string`<BR>Returns all the bytes received in Rx buffer as `string`.<br>Optional `max_len` parameter limits the number of characters returned, or read as much as possible by default.
readbytes<a class="cmnd" id="tcpclient_readbytes"></a>|`read([max_bytes:int]) -> bytes()`<BR>Returns all the bytes received in Rx buffer as `bytes()`.<br>Optional `max_bytes` parameter limits the number of bytes returned, or read as much as possible by default.

Full example:

```
tcp = tcpclient()
tcp.connect("192.168.2.204", 80)
print("connected:", tcp.connected())
s= "GET / HTTP/1.0\r\n\r\n"
tcp.write(s)
print("available1:", tcp.available())
tasmota.delay(100)
print("available1:", tcp.available())
r = tcp.read()
tcp.close()
print(r)
```

### `tcpclientasync` class

Variant of `tcpclient` using only non-blocking calls in full asynchronous mode. This allows to have multiple concurrent connections with fine-grained control over timeouts and no blocking of Tasmota. This is especially useful for Matter Border Router for ESP8266 Tasmota based devices via HTTP.

All calls return immediately, so you need to poll the API periodically to send/receive data, and manage timeouts yourself.

Typical sequence:

- create an instance of the client with `var tcp = tcpclientasync()`
- connect to the server `tcp.connect(address:string, port:int) -> bool`. Address should be numerical IPv4 or IPv6 if you want the call to return immediately (i.e. do DNS resolution ahead of time), otherwise a DNS resolution might take some time and fail. If DNS failed, this call returns `false`.
- regularly call `connected()` waiting for `true` to detect when the connection is established. While `connected()` returns `nil` then connection is in-progress. If `connected()` changes to `false` then the connection was refused by the host.
- if the connection is not established after a definite amount of time, you should declare 'timeout' and call `close()`
- to send data: first call `listening()` to ensure that the socket is ready to send data. Note: the socket is always listening when the connection was just established. Then call `write()` to send you data (string or bytes), this call returns the actual amount of data sent; if it is lower than your content, you need to handle yourself re-sending the remaining data. Note: ensuring that you send less than the MTU should keep you from happening (~1430 bytes max).
- to receive data: first call `available()` to check if some data is ready to be received. Then call `read()` or `readbytes()` to get the buffer as string or bytes. You can limit the amount of data received, but in such case, the extra data is discarded and lost.
- regularly call `connected()` to check if the connection is still up
- finally call `close()` to close the connection on your side and free resources. It is implicitly called if the connection was closed from the peer.


tcpclient Function|Parameters and details
:---|:---
connect<a class="cmnd" id="tcpclientasync_connect"></a>|`connect(address:string, port:int) -> bool`<BR>Initiates a connection to `addr:port`.<BR>If `addr` is in numerical format, DNS is immediate, and this calls returns immediately.<BR>If `addr` is a domain name, the DNS resolution is made in blocking mode and call returns `true` if successful, or `false` if DNS failed.<BR>Hence if you want a pure non-blocking mode, you should do the DNS resolution ahead of time.
connected<a class="cmnd" id="tcpclientasync_connected"></a>|`connected() -> bool or nil`<BR>Returns:<BR>`nil` if the connection in still on-going and was not yet established<BR>`true` if the connection is established.<BR>`false` if the connection is down, either because it was refused or closed (if it changed from `true` to `false`)
listening<a class="cmnd" id="tcpclientasync_listening"></a>|`listening() -> bool`<BR>Returns `true` if the socket is ready to send data (hence established and out buffer empty), or `false` if the out buffer is not empty or the connection is down.<BR>You should always wait for `listening()` to be `true` before calling `write()`.
available<a class="cmnd" id="tcpclientasync_available"></a>|`available() -> int`<BR>Returns the number of bytes received in buffer and ready to be read, or `0` if nothing to read.
close<a class="cmnd" id="tcpclientasync_close"></a>|`close() -> nil`<BR>Close the current connection and free the file descriptor.
write<a class="cmnd" id="tcpclientasync_write"></a>|`write(content:string or bytes) -> int`<BR>Accepts either a string or a bytes buffer, returns the number of bytes sent. It's you responsibility to resend the missing bytes.<BR>Returns `0` if something went wrong.
read<a class="cmnd" id="tcpclientasync_read"></a>|`read([max_len:int]) -> string`<BR>Returns all the bytes received in Rx buffer as `string`.<br>Optional `max_len` parameter limits the number of characters returned, or read as much as possible by default. However in the non-blocking version, limiting receive buffer will truncate (and lose) any extra data.
readbytes<a class="cmnd" id="tcpclientasync_readbytes"></a>|`read([max_bytes:int]) -> bytes()`<BR>Returns all the bytes received in Rx buffer as `bytes()`.<br>Optional `max_bytes` parameter limits the number of bytes returned, or read as much as possible by default.  However in the non-blocking version, limiting receive buffer will truncate (and lose) any extra data.
info<a class="cmnd" id="tcpclientasync_info"></a>|`info() -> map`<BR>Returns a map with various information about the socket.<BR>Example: `{'listening': true, 'local_addr': '192.168.1.20', 'available': false, 'fd': 50, 'remote_addr': '192.168.1.54', 'connected': true, 'local_port': 64808, 'remote_port': 53469}`<BR>`fd`: the file descriptor number used internally<BR>`connected`, `listening`, `available`: values of corresponding methods<BR>`remote_addr`, `remote_port`: remote address used and remote port<BR>`local_addr`, `local_port`: local address used and local port.


Full example:

``` berry
def try_connect(addr, port)
  import string
  var tcp = tcpclientasync()
  var now = tasmota.millis()
  var r = tcp.connect(addr, port)
  print(string.format("Time=%5i state=%s", tasmota.millis()-now, str(tcp.connected())))
  print(tcp.info())
  tasmota.delay(50)
  print(string.format("Time=%5i state=%s", tasmota.millis()-now, str(tcp.connected())))
  print(tcp.info())
  tasmota.delay(150)
  print(string.format("Time=%5i state=%s", tasmota.millis()-now, str(tcp.connected())))
  print(tcp.info())
  tasmota.delay(500)
  print(string.format("Time=%5i state=%s", tasmota.millis()-now, str(tcp.connected())))
  print(tcp.info())
  return tcp
end
tcp = try_connect("192.168.1.19", 80)
```

### `tcpserver` class

Simple TCP server (socket) listening for incoming connection on any port.

- create an instance of the `tcpserver` on a specific port with `s = tcpserver(8888)`
- periodically call `s.hasclient()` to know if a new client has connected
- if the previous returned `true`, call `var c = s.accept()` or `var c = s.acceptasync()` to accept the connection. It returns an instance of `tcpclient` or `tcpclientasync`; it responds to the same APIs as outgoing TCP connection and allows text and binary transfers.
- you can call `c.close()` to close the connection, or call `c.connected()` to know if it's still connected (i.e. the client hasn't closed the connection on their side)
- close the server with `s.close()`. This will prevent the server from receiving any new connection, but existing connections are kept alive.

tcpserver Function|Parameters and details
:---|:---
constructor<a class="cmnd" id="tcpserver_constructor"></a>|`tcpserver(port:int) -> nit`<BR>Opens a socket on `port` and starts listening to new incoming connections. If the server can't open the socket (ex: it is already in use) an exception is raised
hasclient<a class="cmnd" id="tcpserver_hasclient"></a>|`hasclient() -> bool`<BR>Returns `true` if a new client connected to the socket, in such case you should call `accept()`. You need to call this method regularly (ex: in event loop or fast\_loop)
accept<a class="cmnd" id="tcpserver_accept"></a>|`accept() -> instance:tcpclient or nil`<BR>Returns an instance of `tcpclient` for the new incoming connection, or raise an exception if no connection is available. You should call `hasclient()` returning `true` before calling `accept()`.
acceptasync<a class="cmnd" id="tcpserver_acceptasync"></a>|`acceptasync() -> instance:tcpclientasync or nil`<BR>Returns an instance of `tcpclientasync` for the new incoming connection, or raise an exception if no connection is available. You should call `hasclient()` returning `true` before calling `acceptasync()`.
close<a class="cmnd" id="tcpserver_close"></a>|`close() -> nil`<BR>Closes the server and makes the port available again.

Full example:
``` berry
> s = tcpserver(8888)    # listen on port 8888
> s.hasclient()
false

# in parallel connect on this port with `nc <ip_address> 8888`

> s.hasclient()
true               # we have an incoming connection
> c = s.accept()
> c
<instance: tcpclient()>

# send 'foobar' from the client
> c.read()
foobar

# send 'foobar2' again from the client
> c.readbytes()
bytes('666F6F626172320A')

> c.close()
# this closes the connection
```

### `udp` class
  
Class `udp` provides ability to send and received UDP packets, including multicast addresses.

You need to create an object of class `udp`. Such object can send packets and listen to local ports. If you don't specify a local port, the client will take a random source port. Otherwise the local port is used as source port.

When creating a local port, you need to use `udp->begin(<ip>, <port)>`. If `<ip>` is empty string `""` then the port is open on all interfaces (wifi and ethernet).

General Function|Parameters and details
:---|:---
udp()<a class="cmnd" id="udp_ctor"></a>|`udp() -> <instance udp>`<br>Creates an instance of `udp` class.
begin<a class="cmnd" id="udp_begin"></a>|`begin(interface:string, port:int) -> bool`<BR>Create a UDP listener and sender on a specific interface (IP address) or on all interfaces if `interface` is an empty string<BR>Listen on a specific `port` number, or set `0` to choose a random free port for sending only<BR>Returns `true` if successful.
begin_multicast<a class="cmnd" id="udp_begin_multicast"></a>|`begin(ip:string, port:int) -> bool`<BR>Create a UDP listener and sender on interface `ip` and `port`. `ip` must be a multicast address.<BR>Returns `true` if successful.
close<a class="cmnd" id="udp_close"></a>|`close() -> bil`<BR>Closes UDP listener and sender, and frees resources. You can't send or receive anymore with this instance.
send<a class="cmnd" id="udp_send"></a>|`send(addr:string, port:int, payload:bytes) -> bool`<BR>Sends a packet to address `addr`, port `port` and message as `bytes()` buffer.<BR>Returns `true` if successful.
send_multicast<a class="cmnd" id="udp_send_multicast"></a>|`send(payload:bytes) -> bool`<BR>Sends a payload as `bytes()` buffer to the multicast address. `begin_multicast()` must have been previously called.<BR>Returns `true` if successful.<BR>You can also send a multicast packet with `send` if you specify the multicast address and port.
read<a class="cmnd" id="udp_read"></a>|`read() -> bytes() or `nil`<BR>Reads any received udp packet as bytes() buffer, or `nil` if no packet was received.
remote_ip<a class="cmnd" id="udp_remote_ip"></a>|`remote_ip (string or nil)`<BR>Instance variable containing the remote ip (as string) from the last successful `read()` command.
remote_port<a class="cmnd" id="udp_remote_port"></a>|`remote_port (int or nil)`<BR>Instance variable containing the remote port (as int) from the last successful `read()` command.

#### Sending udp packets

``` berry
> u = udp()
> u.begin("", 2000)    # listen on all interfaces, port 2000
true
> u.send("192.168.1.10", 2000, bytes("414243"))   # send 'ABC' to 192.168.1.10:2000, source port is 2000
true
```

#### Receive udp packets

You need to do polling on `udp->read()`. If no packet was received, the call immediately returns `nil`.

``` berry
> u = udp()
> u.begin("", 2000)    # listen on all interfaces, port 2000
true
> u.read()     # if no packet received, returns `nil`
>

> u.read()     # if no packet received, returns `nil`
bytes("414243")    # received packet as `bytes()`
```

#### Simple UDP server printing received packets

``` berry
class udp_listener
  var u
  def init(ip, port)
    self.u = udp()
    print(self.u.begin_multicast(ip, port))
    tasmota.add_driver(self)
  end
  def every_50ms()
    import string
    var packet = self.u.read()
    while packet != nil
      tasmota.log(string.format(">>> Received packet ([%s]:%i): %s", self.u.remote_ip, self.u.remote_port, packet.tohex()), 2)
      packet = self.u.read()
    end
  end
end

# listen on port 2000 for all interfaces
# udp_listener("", 2000)
```

#### Send and receive multicast

IPv4 example, using the `udp_listener` listener above.

On receiver side:
``` berry
udp_listener("224.3.0.1", 2000)
```

On sender side:
``` berry
u = udp()
u.begin_multicast("224.3.0.1", 2000)
u.send_multicast(bytes().fromstring("hello"))

# alternatively
u = udp()
u.begin("", 0)      # send on all interfaces, choose random port number
u.send("224.3.0.1", 2000, bytes().fromstring("world"))
```

The receiver will show:
```
>>> Received packet ([192.168.x.x]:2000): 68656C6C6F
>>> Received packet ([192.168.x.x]:64882): 776F726C64
```

This works the same with IPv6 using an address like "FF35:0040:FD00::AABB"

### `mdns` module
  
Module `import mdns` support for mDNS (Multicast DNS, aka Bonjour protocol) announces. This is needed for Matter Wifi support.

This feature requires `#define USE_DISCOVERY` compile option (not included in standard builds).

Example (announce of a Matter Wifi device):

``` berry
import mdns
mdns.start()
mdns.add_service("_matterc","_udp", 5540, {"VP":"65521+32768", "SII":5000, "SAI":300, "T":1, "D":3840, "CM":1, "PH":33, "PI":""})
```

General Function|Parameters and details
:---|:---
start<a class="cmnd" id="mdns_start"></a>|`mdns.start([hostname: string]) -> nil`<br>Start or restart mDNS, specify a new hostname if needed or implicitly use `tasmota.hostname()` if none provided (default)
stop<a class="cmnd" id="mdns_stop"></a>|`mdns.stop() -> nil`<br>Free all mDNS resources
set_hostname<a class="cmnd" id="mdns_set_hostname"></a>|`mdsn.set_hostname(hostname:string) -> nil`<br>Change the hostname
add_service<a class="cmnd" id="mdns_add_service"></a>|`mdns.add_service(service:string, proto:string, port:int, txt:map) -> nil`<br>Add a service declaration using the current hostname as instance name, and specify TXT fields as a `map`

### Addressable LEDs (WS2812, SK6812)

There is native support for addressable LEDs via NeoPixelBus, with support for animations. Currently supported: WS2812, SK6812.

Details are in [Berry LEDs](Berry_Addressable-LED.md)

### `serial` class

The `serial` class provides a low-level interface to hardware UART. The serial GPIOs don't need to be configured in the template.

!!! example

    ```
    # gpio_rx:4 gpio_tx:5
    ser = serial(4, 5, 9600, serial.SERIAL_7E1)

    ser.write(bytes(203132))   # send binary 203132
    ser.write(bytes().fromstring("Hello))   # send string "Hello"

    msg = ser.read()   # read bytes from serial as bytes
    print(msg.asstring())   # print the message as string
    ```

Tasmota Function|Parameters and details
:---|:---
serial (constructor)<a class="cmnd" id="serial"></a>|`serial(gpio_rx:int, gpio_tx:int, baud:int [, mode:int, inverted:bool])`<br>Creates a `serial` object<br>`gpio_rx` receive GPIO (or -1 if transmit only)<br>`gpio_tx` transmit GPIO (or -1 if receive only)<br>`baud` speed, ex: 9600, 115200<br>`mode` serial message format, default is `serial.SERIAL_8N1` (8 bits, no parity, 1 stop bit)<br>`inverted` true if signal is inverted (inactive low), default `false`<br>Other mode values are described below.
config_tx_en<a class="cmnd" id="serial_config_tx_en"></a>|`config_tx_en(phy_gpio:int) -> nil`<br>Configures the Tx EN GPIO, or `-1` to clear it. Typically used for RS485.
write<a class="cmnd" id="serial_write"></a>|`write(val:int || bytes()) -> bytes_sent:int`<br>Send either a single byte if argument is int, or send a binary message from a `bytes()` object.<br>The methods blocks until all messages are sent to the UART hardware buffer; they may not all have been sent over the wire
read<a class="cmnd" id="serial_read"></a>|`read( [max_bytes:int] ) -> bytes()`<br>Read all bytes received in the incoming buffer. If the buffer is empty, returns an empty `bytes()` object; in such case you can call `available()` first to check if the buffer is empty<br>Takes an optional argument `max_bytes` to limit the number of bytes returned, remaining bytes are kept in the internal serial buffer.
flush<a class="cmnd" id="serial_flush"></a>|`flush(void) -> void`<br>Flushes all buffers. Waits for all outgoing messages to be sent over the wire and clear the incoming buffer.
available<a class="cmnd" id="serial_available"></a>|`available(void) -> int`<br>Returns the number of incoming bytes in the incoming buffer, `0` in none.
close<a class="cmnd" id="serial_close"></a>|`close(void) -> nil`<br>Closes the serial port and deallocates resources and hardware serial. After this, any call to the serial instance will return `nil` and will have no effect

Supported serial message formats: `SERIAL_5N1`, `SERIAL_6N1`, `SERIAL_7N1`, `SERIAL_8N1`, `SERIAL_5N2`, `SERIAL_6N2`, `SERIAL_7N2`, `SERIAL_8N2`, `SERIAL_5E1`, `SERIAL_6E1`, `SERIAL_7E1`, `SERIAL_8E1`, `SERIAL_5E2`, `SERIAL_6E2`, `SERIAL_7E2`, `SERIAL_8E2`, `SERIAL_5O1`, `SERIAL_6O1`, `SERIAL_7O1`, `SERIAL_8O1`, `SERIAL_5O2`, `SERIAL_6O2`, `SERIAL_7O2`, `SERIAL_8O2`

### `display` module

The `display` module provides a simple API to initialize the Universal Display Driver with data provided as a string. It is used by `autoconf` mechanism.

Tasmota Function|Parameters and details
:---|:---
start<a class="cmnd" id="display_start"></a>|`display.start(displayini:string) -> nil`<br>Initializes the Universal Display Driver with the string provided as argument, similar to content in `display.ini`. It is typically read from a file in the file-system.
started<a class="cmnd" id="display_started"></a>|`display.started() -> bool`<br>Returns `true` if display is already initialized, `false` if not started.
dimmer<a class="cmnd" id="display_dimmer"></a>|`display.dimmer([dim:int]) -> int`<BR>Sets the dimmer of display, value 0..100. If `0` then turn off display. If no arg, read the current value.
driver\_name<a class="cmnd" id="display_driver_name"></a>|`display.driver_name() -> string`<br>Returns the Display driver name as specified in `display.ini`
touch\_update<a class="cmnd" id="display_touch_update"></a>|`display.touch_update(touches:int, raw_x:int, raw_y:int, gesture:int) -> nil`<br>Sets the last Touch Screen update values to be passed to LVGL. This allows an external touchscreen driver to periodically update the touch information.<BR>`touches`: number of touches (`0` = no touch, `1` = screen touched). Multiple touch is not supported<BR>`raw_x` and `raw_y` = coordinates before conversion (resistive touch screens need conversion)<BR>`gesture`: type of gesture. `0` = no gesture, `16` = move up, `17` = move down, `18` = move left, `19` = move right, `32` = zoom in, `33` = zoom out.

### `uuid` module

The `uuid` module allows to generate uuid4 random ids.

``` ruby
> import uuid
> uuid.uuid4()
1a8b7f78-59d8-4868-96a7-b7ff3477d43f
```

Tasmota Function|Parameters and details
:---|:---
uuid4<a class="cmnd" id="uuid_uuid4"></a>|`uuid.uuid4() -> string`<br>Generates a uuid4 random id as string.


### `crc` module

The `crc` module allows to compute crc32/16/8 from bytes() arrays.

``` ruby
> import crc
> crc.crc32(0xFFFFFFFF, bytes("AABBCC"))
-1091314015
> crc.crc16(0xFFFF, bytes("AABBCC"))
20980
> crc.crc8(0xFF, bytes("AABBCC"))
139
```

Tasmota Function|Parameters and details
:---|:---
crc32<a class="cmnd" id="crc_crc32"></a>|`crc.crc32(crc:int, payload:bytes) -> int`<br>Compute crc32 from an initial value and a bytes() buffer
crc16<a class="cmnd" id="crc_crc16"></a>|`crc.crc16(crc:int, payload:bytes) -> int`<br>Compute crc16 from an initial value and a bytes() buffer
crc8<a class="cmnd" id="crc_crc8"></a>|`crc.crc8(crc:int, payload:bytes) -> int`<br>Compute crc8 from an initial value and a bytes() buffer

### `tasmota_log_reader` class

The `tasmota_log_reader` class allows you to read and potentially parse the Tasmota logs. It keeps track of what logs were already read in the past and feeds you with new log lines if some are available. It is for example used by the LVGL `tasmota_log` widget to display logs on a display.

Note: calling `tasmota_log_reader` can be expensive in string allocations, and adds pressure on the garbage collector. Use wisely.

Example:

``` berry
var lr = tasmota_log_reader()

# do this regularly
var ret = lr.get_log(2)    # read at log level 2
if ret != nil
  var lines = r.split('\n')  # extract as a list of lines
  # do whatever you need
end
```

Tasmota Function|Parameters and details
:---|:---
tasmota_log_reader()<a class="cmnd" id="tasmota_log_reader"></a>|`tasmota_log_reader(void) -> instance(tasmota_log_reader)`<br>Instantiate a new `tasmota_log_reader`. Multiple readers can coexist and they each keep track of already read log lines
get_log<a class="cmnd" id="tasmota_log_reader_get_log"></a>|`get_log(log_level:int) -> string or nil`<br>Returns new log lines as a big string object. Lines are separated by `\n`. Returns `nil` if no new logs are available.<br>`log_level` can be `0..4` and specifies the highest log level that we be reported (it is usually wise to start with `2`). Higher log level will be reported only if they are recorded, i.e. there is at least one logger that asks for it. This class does not cause log-level 4 to be recorded if none other loggers are recording them (`weblog`, `mqttlog` or `seriallog`).

### `ULP` module

The `ULP` module exposes the third computing unit of the ESP32, which is a simple finite state machine (FSM) that is designed to perform measurements using the ADC, temperature sensor and even external I2C sensors.
This small ultra low power coprocessor can run in parallel to the main cores and in deep sleep mode, where it is capable to wake up the system, i.e. in reaction to sensor measurements.
The binding to Berry consists of some lightweight wrapper functions and the communication with the main cores works by accessing the RTC_SLOW_MEM from both sides, which is the same way as in any other ESP32 ULP project.

``` ruby
# simple LED blink example
import ULP
ULP.wake_period(0,500000) # off time
ULP.wake_period(1,200000) # on time 
c = bytes("756c70000c006c00000000001000008000000000000000000000000010008072010000d0e5af2c72340040802705cc190005681d10008072e1af8c720100006821008072040000d0120080720800207004000068010005825c0000800405681d00000092680000800505681d0100009268000080000000b0")
ULP.load(c)
ULP.run()
```

Tasmota Function|Parameters and details
:---|:---
run<a class="cmnd" id="ULP_run"></a>|`ULP.run() -> nil`<br>Execute ULP program
load<a class="cmnd" id="ULP_load"></a>|`ULP.load(code:bytes) -> nil`<br>Load ULP code from a bytes() buffer into memory
set_mem<a class="cmnd" id="ULP_set_mem"></a>|`ULP.set_mem(addr:int, value:int) -> nil`<br>Set memory position in RTC_SLOW_MEM to value. Address and Value are 32-bit!!
get_mem<a class="cmnd" id="ULP_get_mem"></a>|`ULP.set_mem(addr:int) -> int16_t`<br>Get value from memory position in RTC_SLOW_MEM. By hardware design only the lower 16-bit are usable, so this function already masks out the upper 16-bit
gpio_init <a class="cmnd" id="ULP_gpio_init"></a>|`ULP.gpio_init(pin:int, mode:int) -> pin:int`<br>Makes a valid GPIO pin accessible to the ULP and sets the mode according to the enum 'rtc_gpio_mode_t', returns the same pin, but translated to the RTC system, which is the numbering scheme in the assembly code
adc_config <a class="cmnd" id="ULP_adc_config"></a>|`ULP.adc_config(channel:int, attenuation:int, width:int) -> nil`<br>Configures ADC pin usage for the ULP according to the enums ' adc1_channel_t', 'adc_atten_t' and 'adc_bits_width_t'
wake_period <a class="cmnd" id="ULP_wake_period"></a>|`ULP.wake_period(register:int, time:int) -> nil`<br>Configures one of 5 (0..4) wake timer registers with the time value in microseconds
sleep <a class="cmnd" id="ULP_sleep"></a>|`ULP.wake_period([time:int]) -> nil`<br>Starts deep sleep mode and allow wake up by the ULP, with an optional time value in seconds an additional wake up timer gets started
  
More information (including suggestions for a toolchain) on the [ULP page](ULP.md).
  
### `re` regex module

Use with `import re`.

There are two ways to use regex, first is to call directly the module which triggers a compilation of the regex at each call. The second one is to pre-compile the regex once into an object which is much more efficient if you need to use the regex multiple times. Any error in the compilation of the regex pattern yields an exception.

``` berry
> import re

# first series are all-in-one, patterns are compiled on the fly

# Returns the list of matches, or empty list of no match
> re.search("a.*?b(z+)", "zaaaabbbccbbzzzee")
['aaaabbbccbbzzz', 'zzz']

# Returns the list of list of matches
> re.searchall('<([a-zA-Z]+)>', '<abc> yeah <xyz>')
[['<abc>', 'abc'], ['<xyz>', 'xyz']]

# Returns the list of matches, or empty list of no match; must match from the beginning of the string.
> re.match("a.*?b(z+)", "aaaabbbccbbzzzee")
['aaaabbbccbbzzz', 'zzz']

# Returns the number of chars matched instead of the entire match (saves memory)
> re.match2("a.*?b(z+)", "aaaabbbccbbzzzee")
[14, 'zzz']

# Returns the list of matches, or empty list of no match; there should not be any gaps between matches.
> re.matchall('<([a-zA-Z]+)>', '<abc> yeah <xyz>')
[['<abc>', 'abc']])
> re.matchall('<([a-zA-Z]+)>', '<abc><xyz>')
[['<abc>', 'abc'], ['<xyz>', 'xyz']]

# Returns the list of strings from split
> re.split('/', "foo/bar//baz")
['foo', 'bar', '', 'baz']

# below are pre-compiled patterns, which is much faster if you use the
# pattern multiple times
#
# the compiled pattern is a `bytes()` object that can be used
# as a replacement for the pattern string
> rb = re.compilebytes('<([a-zA-Z]+)>')
# rb is compiled to bytes('1A0000000C0000000100000062030260FB7E00013C7E020302617A415A62F87E03013E7E017F')

> re.searchall(rb, '<abc> yeah <xyz>')
[['<abc>', 'abc'], ['<xyz>', 'xyz']]

> rb = re.compilebytes("/")
> rb
bytes('0C000000070000000000000062030260FB7E00012F7E017F')

> re.split(rb, "foo/bar//baz")
['foo', 'bar', '', 'baz']
> re.split(rb, "/b")
['', 'b']
```

Tasmota Function|Parameters and details
:---|:---
search<a class="cmnd" id="re_search"></a>|`re.search(pattern:string or bytes, payload:string [, offset:int]) -> list of strings`<br>Returns the list of matches, or empty list of no match
match<a class="cmnd" id="re_match"></a>|`re.match(pattern:string or bytes, payload:string [, offset:int]) -> list of strings`<br>Returns the list of matches, or empty list of no match. The difference with `search` is that match must match from the beginning of the string.<br>Takes an optional second argument offset which indicates at which character to start the in the payload (default 0).
match2<a class="cmnd" id="re_match2"></a>|`re.match2(pattern:string or bytes, payload:string [, offset:int]) -> list of strings`<br>Returns the list of matches, or empty list of no match. The difference with `match` is that the first element contains the number of matched characters instead of the matched string, which saves memory for large matches.<br>Takes an optional second argument offset which indicates at which character to start the in the payload (default 0).
searchall<a class="cmnd" id="re_searchall"></a>|`re.searchall(pattern:string or bytes, payload:string [, limit:string]) -> list of list of strings`<br>Returns the list of list of matches, or empty list of no match. `limit` allows to limit the number of matches.
matchall<a class="cmnd" id="re_matchall"></a>|`re.matchall(pattern:string or bytes, payload:string [, limit:string]) -> list of list of strings`<br>Returns the list of matches, or empty list of no match. The difference with `searchall` is that there should not be any gaps between matches.  `limit` allows to limit the number of matches.
split<a class="cmnd" id="re_split"></a>|`re.search(pattern:string or bytes, payload:string) -> list of strings`<br>Returns the list of strings from split, or a list with a single element containing the entire string if no match
compilebytes<a class="cmnd" id="re_compilebytes"></a>|`re.compilebytes(pattern:string) -> instance of bytes()`<br>Compiles the regex into a reusable faster bytecode. You can then use the `bytes()` compiled pattern as a replacement for the patter string
compile<a class="cmnd" id="re_compile"></a>|**Deprecated**, use `compilebytes` instead.<br>`re.compile(pattern:string) -> instance of <re_pattern>`<br>Compiles the regex into a reusable faster bytecode. You can then call the following methods:<br>`search()`, `match()`, `split()` similarly to the module's functions.
dump<a class="cmnd" id="re_dump"></a>|`re.dump(pattern:bytes) -> nil`<br>Prints to the console a dump of the compiled pattern.<br>Only if compiled with `#define USE_BERRY_DEBUG` and only for curiosity/debugging purpose.

Note: for `match` and `search`, the first element in the list contains the global match of the pattern. Additional elements correspond to the sub-groups (in parenthesis).

The regex engine is based on [re1.5](https://github.com/pfalcon/re1.5) also used in MicroPython.

### `crypto` module

Module `import crypto` support for common cryptographic algorithms.

Currently supported algorithms:

- AES CTR 256 bits - requires `#define USE_BERRY_CRYPTO_AES_CTR`
- AES GCM 256 bits
- AES CCM 128 or 256 bits
- AES CBC 128 bits
- Elliptic Curve C25519 - requires `#define USE_BERRY_CRYPTO_EC_C25519`
- Elliptic Curve P256 (secp256r1) - requires `#define USE_BERRY_CRYPTO_EC_P256`
- HKDF key derivation with HMAC SHA256 - requires `#define USE_BERRY_CRYPTO_HKDF_SHA256`
- HMAC SHA256
- MD5
- PKKDF2 with HMAC SHA256 key derivation - requires `#define USE_BERRY_CRYPTO_PBKDF2_HMAC_SHA256`
- SHA256
- JWT RS256 (RSASSA-PKCS1-v1_5 with SHA256) - requires `#define USE_BERRY_CRYPTO_RSA`

#### `crypto.AES_CTR` class

Encrypt and decrypt, using AES CTR (Counter mode) with 256 bits keys.

General Function|Parameters and details
:---|:---
init<a class="cmnd" id="aes_ctr_init"></a>|`AES_CTR.init(secret_key:bytes(32)) -> instance`<br>Initialize AES CTR instance with `secret_key` (256 bits) and `iv` (initialization vector or nonce, 96 bits)
encrypt<a class="cmnd" id="aes_ctr_encrypt"></a>|`encrypt(ciphertext:bytes, iv:bytes(12), cc:int) -> bytes`<br>Encrypt the ciphertext. The `iv` (Initialization Vector) must be 12 bytes, it can be the concatenation of 4 bytes Nonce and 8 bytes iv. `cc` is the counter (4 bytes) incremented for each block of 16 bytes.<BR>Note: the last counter value is not returned, so it is advised to encrypt all data at once.
decrypt<a class="cmnd" id="aes_ctr_decrypt"></a>|`decrypt(ciphertext:bytes, iv:bytes(12), cc:int) -> bytes`<br>Identical to `encrypt` above.

Test vectors from <https://datatracker.ietf.org/doc/html/rfc4231>

``` berry
# Test case from https://www.ietf.org/rfc/rfc3686.txt
import crypto
key = bytes("F6D66D6BD52D59BB0796365879EFF886C66DD51A5B6A99744B50590C87A23884")
iv = bytes("00FAAC24C1585EF15A43D875")
cc = 0x000001
aes = crypto.AES_CTR(key)
plain = bytes("000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F")
cipher = aes.encrypt(plain, iv, cc)
assert(cipher == bytes("F05E231B3894612C49EE000B804EB2A9B8306B508F839D6A5530831D9344AF1C"))
plain2 = aes.decrypt(cipher, iv, cc)
assert(plain == plain2)
```

#### `crypto.AES_GCM` class

Encrypt, decrypt and verify, using AES GCM (Galois Counter Mode) with 256 bits keys.

General Function|Parameters and details
:---|:---
init<a class="cmnd" id="aes_gcm_init"></a>|`AES_GCM.init(secret_key:bytes(32), iv:bytes(12)) -> instance`<br>Initialize AES GCM instance with `secret_key` (256 bits) and `iv` (initialization vector or nonce, 96 bits)
encrypt<a class="cmnd" id="aes_gcm_encrypt"></a>|`encrypt(ciphertext:bytes) -> bytes`<br>Encrypt the ciphertext. Can be called multiple times, the tag is updated accordingly
decrypt<a class="cmnd" id="aes_gcm_decrypt"></a>|`decrypt(ciphertext:bytes) -> bytes`<br>Decrypt the ciphertext. Can be called multiple times, the tag is updated accordingly
tag<a class="cmnd" id="aes_gcm_tag"></a>|`tag() -> bytes`<br>Compute the verification tag for the object encrypted or decrypted (128 bits).

Example taken from <https://wizardforcel.gitbooks.io/practical-cryptography-for-developers-book/content/symmetric-key-ciphers/aes-encrypt-decrypt-examples.html>

``` berry
import crypto

key = bytes('233f8ce4ac6aa125927ccd98af5750d08c9c61d98a3f5d43cbf096b4caaebe80')
ciphertext = bytes('1334cd5d487f7f47924187c94424a2079656838e063e5521e7779e441aa513de268550a89917fbfb0492fc')
iv = bytes('2f3849399c60cb04b923bd33265b81c7')
authTag = bytes('af453a410d142bc6f926c0f3bc776390')

# decrypt ciphertext with key and iv
aes = crypto.AES_GCM(key, iv)
plaintext = aes.decrypt(ciphertext)
print(plaintext.asstring())
# 'Message for AES-256-GCM + Scrypt encryption'

tag = aes.tag()
print(tag == authTag)
# true
```

#### `crypto.AES_CCM` class

Encrypt and decrypt, using AES CCM with 256 bits keys.

General Function|Parameters and details
:---|:---
init<a class="cmnd" id="aes_ccm_init"></a>|`AES_CCM.init(secret_key:bytes(16 or 32), iv:bytes(7..13), aad:bytes(), data_len:int, tag_len:int) -> instance`<br>Initialize AES CCM instance with `secret_key` (128 or 256 bits), `iv` (initialization vector or nonce, 56 to 104 bits), `aad` is the associated data, `data_len` is the size of the payload that you need to announce in advance, `tag_len` is the length in bytes of the tag (normally 16).
encrypt<a class="cmnd" id="aes_ccm_encrypt"></a>|`encrypt(ciphertext:bytes) -> bytes`<br>Encrypt the ciphertext.
decrypt<a class="cmnd" id="aes_ccm_decrypt"></a>|`decrypt(ciphertext:bytes) -> bytes`<br>Identical to `encrypt` above.
tag<a class="cmnd" id="aes_ccm_tag"></a>|`tag() -> bytes`<br>Returns the tag or MIC.
decrypt1<a class="cmnd" id="aes_ccm_decrypt1"></a>|`AES_CCM.decrypt1(secret_key:bytes(16 or 32), iv:bytes(), iv_start:int, iv_len:int (7..13), aad:bytes(), aad_start:int, aad_len:int, data:bytes(), data_start:int, data_len:int, tag:bytes(), tag_start:int, tag_len:int (4..16)) -> bool (true if tag matches)`<br>Decrypt in a single call, avoiding any object allocation
encrypt1<a class="cmnd" id="aes_ccm_encrypt1"></a>|`AES_CCM.encrypt1(secret_key:bytes(16 or 32), iv:bytes(), iv_start:int, iv_len:int (7..13), aad:bytes(), aad_start:int, aad_len:int, data:bytes(), data_start:int, data_len:int, tag:bytes(), tag_start:int, tag_len:int (4..16)) -> bool (always true)`<br>Decrypt in a single call, avoiding any object allocation. Data is encrypted in-place and Tag is changed in the buffer.

Example from Matter:

```berry
# raw_in is the received frame
raw_in = bytes("00A0DE009A5E3D0F3E85246C0EB1AA630A99042B82EC903483E26A4148C8AC909B12EF8CDB6B144493ABD6278EDBA8859C9B2C")

payload_idx = 8     # unencrypted header is 8 bytes
tag_len = 16        # MIC is 16 bytes

p = raw[payload_idx .. -tag_len - 1]   # payload
mic = raw[-tag_len .. ]                # MIC
a = raw[0 .. payload_idx - 1]          # AAD

i2r = bytes("92027B9F0DBC82491D4C3B3AFA5F2DEB")   # key
# p   = bytes("3E85246C0EB1AA630A99042B82EC903483E26A4148C8AC909B12EF")
# a 	= bytes("00A0DE009A5E3D0F")
n   = bytes("009A5E3D0F0000000000000000")         # nonce / IV
# mic = bytes("8CDB6B144493ABD6278EDBA8859C9B2C")

# expected cleartext
clr = bytes("05024FF601001536001724020024031D2404031818290324FF0118")

# method 1 - with distinct calls
import crypto
aes = crypto.AES_CCM(i2r, n, a, size(p), 16)
cleartext = aes.decrypt(p)
tag = aes.tag()

assert(cleartext == clr)
assert(tag == mic)

# method 2 - single call
raw = raw_in.copy()      # copy first if we want to keep the encrypted version
var ret = crypto.AES_CCM.decrypt1(i2r, n, 0, size(n), raw, 0, payload_idx, raw, payload_idx, size(raw) - payload_idx - tag_len, raw, size(raw) - tag_len, tag_len)

assert(ret)
assert(raw[payload_idx .. -tag_len - 1] == clr)
```

#### `crypto.AES_CBC` class

Encrypt and decrypt, using AES CBC with 128 bits keys.

General Function|Parameters and details
:---|:---
decrypt1<a class="cmnd" id="aes_cbc_decrypt1"></a>|`AES_CBC.decrypt1(secret_key:bytes(16), iv:bytes(16), data:bytes(n*16)) -> bool (always true)`<br>Decrypt in a single call in-place, avoiding any object allocation
encrypt1<a class="cmnd" id="aes_cbc_encrypt1"></a>|`AES_CBC.encrypt1(secret_key:bytes(16), iv:bytes(16), data:bytes(n*16)) -> bool (always true)`<br>Decrypt in a single call, avoiding any object allocation. Data is encrypted in-place and IV is changed in the buffer too.
  
Example:

```berry
var b = bytes().fromstring("hello world_____") # 16-byte aligned
var key = bytes().fromstring("1122334455667788") # 16 bytes
var iv = bytes().fromstring("8877665544332211") # 16 bytes

print("data:",b.asstring()) # "hello world_____"
import crypto
aes = crypto.AES_CBC()
aes.encrypt1(key, iv, b)
print("cipher:",b)
iv = bytes().fromstring("8877665544332211")
aes.decrypt1(key, iv, b)
print("decrypted data:",b.asstring()) # "hello world_____"
```

#### `crypto.EC_C25519` class

Provides Elliptic Curve C25519 Diffie-Hellman key agreement. Requires `#define USE_BERRY_CRYPTO_EC_C25519`

General Function|Parameters and details
:---|:---
public_key<a class="cmnd" id="ec_c25519_public_key"></a>|`crypto.EC_C25519().public_key(secret_key:bytes(32)) -> bytes(32)`<br>Computes the public key given a random private key.
shared_key<a class="cmnd" id="ec_c25519_shared_key"></a>|`crypto.EC_C25519().shared_key(our_private_key:bytes(32), their_public_key:bytes(32)) -> bytes(32)`<br>Compute a shared key (Diffie-Hellman) using our private key and the other party's public key. The other party will compute the same shared key using their private key and our pubic key.

Example from test vectors <https://www.rfc-editor.org/rfc/rfc7748>:

``` berry
import crypto

# alice side
alice_priv_key = bytes("77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a")
alice_pub_key = bytes("8520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a")
assert(crypto.EC_C25519().public_key(alice_priv_key) == alice_pub_key)

# bob side
bob_priv_key = bytes("5dab087e624a8a4b79e17f8b83800ee66f3bb1292618b6fd1c2f8b27ff88e0eb")
bob_pub_key = bytes("de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b4f")
assert(crypto.EC_C25519().public_key(bob_priv_key) == bob_pub_key)

# shared key computed by alice
ref_shared_key = bytes("4a5d9d5ba4ce2de1728e3bf480350f25e07e21c947d19e3376f09b3c1e161742")
alice_shared_key = crypto.EC_C25519().shared_key(alice_priv_key, bob_pub_key)
bob_shared_key = crypto.EC_C25519().shared_key(bob_priv_key, alice_pub_key)
assert(alice_shared_key == ref_shared_key)
assert(bob_shared_key == ref_shared_key)
```

#### `crypto.EC_P256` class

Provides Elliptic Curve Prime256 (secp256r1) Diffie-Hellman key agreement and various functions on P256 curve. Requires `#define USE_BERRY_CRYPTO_EC_P256`

General Function|Parameters and details
:---|:---
public_key<a class="cmnd" id="ec_p256_public_key"></a>|`crypto.EC_P256().public_key(secret_key:bytes(32)) -> bytes(65)`<br>Computes the public key given a random private key. The result is uncompressed point coordinates starting with 0x04 (65 bytes in total)
shared_key<a class="cmnd" id="ec_p256_shared_key"></a>|`crypto.EC_P256().shared_key(our_private_key:bytes(32), their_public_key:bytes(65)) -> bytes(32)`<br>Compute a shared key (Diffie-Hellman) using our private key and the other party's public key. The other party will compute the same shared key using their private key and our pubic key.<BR>The result is actually the X coordinate of the multiplication of the points coordinates of the public key, and a large number (private key)

Specific Functions|Parameters and details
:---|:---
mod<a class="cmnd" id="ec_p256_mod"></a>|`crypto.EC_P256().mod(data:bytes()) -> bytes(32)`<br>Computes the modulus of an arbitrary large number. The modulus is done towards the order of the curve.
neg<a class="cmnd" id="ec_p256_neg"></a>|`crypto.EC_P256().neg(data:bytes(32)) -> bytes(32)`<br>`-x mod p` or `p - x` if `x` is lower than `p`<br>Computes the opposite (negate) of a number modulus the order of the curve (it's actually modulus - data).
mul<a class="cmnd" id="ec_p256_mul"></a>|`crypto.EC_P256().mul(x:bytes(), A:bytes(65)) -> bytes(65)`<br>`x * A`<br>Computes multiplication of a number and a point on the curve.<br>`x` needs to be smaller than `p`, use `mod()` if not sure<br>The function checks that the point `A` is on the curve, or raises an error
muladd<a class="cmnd" id="ec_p256_muladd"></a>|`crypto.EC_P256().muladd(x:bytes(), A:bytes(65), y:bytes(), B:bytes(65)) -> bytes(65)`<br>`x * A + y * B`<br>`x` and `y` need to be smaller than `p`, use `mod()` if not sure<br>The function checks that the points `A` and `B` are on the curve, or raises an error<br>If `B` is empty `bytes()`, the Generator `P` of the curve is used instead.

Example:

``` berry
import crypto
priv = bytes("f502fb911d746b77f4438c674e1c43650b68285dfcc0583c49cd6ed88f0fbb58")
p = crypto.EC_P256()
pub = p.public_key(priv)
assert(pub == bytes("04F94C20D682DA29B7E99985D8DBA6ABEA9051D16508742899835098B1113D3D749466644C47B559DB184556C1733C33E5788AE250B8FB45F29D4CF48FF752C1ED"))

import crypto
priv = bytes("4E832960415F2B5FA2B1FDA75C1A8F3C84BAEB189EDC47211EF6D27A21FC0ED8")
p = crypto.EC_P256()
pub = p.public_key(priv)
assert(pub == bytes("042166AE4F89981472B7589B8D79B8F1244E2EEE6E0A737FFBFED2981DA3E193D6643317E054D2A924F2F56F1BF4BECA13192B27D8566AF379FBBF8615A223D899"))
print("x=",pub[1..32])
print("y=",pub[33..65])

import crypto
p = crypto.EC_P256()
priv_A = bytes("f502fb911d746b77f4438c674e1c43650b68285dfcc0583c49cd6ed88f0fbb58")
pub_A = bytes("04F94C20D682DA29B7E99985D8DBA6ABEA9051D16508742899835098B1113D3D749466644C47B559DB184556C1733C33E5788AE250B8FB45F29D4CF48FF752C1ED")
priv_B = bytes("4E832960415F2B5FA2B1FDA75C1A8F3C84BAEB189EDC47211EF6D27A21FC0ED8")
pub_B = bytes("042166AE4F89981472B7589B8D79B8F1244E2EEE6E0A737FFBFED2981DA3E193D6643317E054D2A924F2F56F1BF4BECA13192B27D8566AF379FBBF8615A223D899")

shared_1 = p.shared_key(priv_A, pub_B)
shared_2 = p.shared_key(priv_B, pub_A)
assert(shared_1 == shared_2)
```

#### `crypto.HKDF_SHA256` class

Provides HKDF using HMAC SHA256 key derivation. Turns 'ikm' (input keying material) of low entropy and creates a pseudo random key. Requires `#define USE_BERRY_CRYPTO_HKDF_SHA256`

General Function|Parameters and details
:---|:---
derive<a class="cmnd" id="aes_hkdf_sha256_derive"></a>|`crypto.HKDF_SHA256().derive(ikm:bytes(), salt:bytes(), info:bytes(), out_bytes:int) -> bytes(out_bytes)`<br>Computes a key derivation function<br>`ikm` is the input keying material, typically a password<br>`salt` can be empty<br>`info` can be empty and is used to create multiple derived keys<br>`out_bytes` indicates the number of bytes to generate (between 1 and 256)

Test vectors from <https://www.rfc-editor.org/rfc/rfc5869>

``` berry
import crypto

# Test Case 1
hk = crypto.HKDF_SHA256()
ikm = bytes("0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B")
salt = bytes("000102030405060708090A0B0C")
info = bytes("F0F1F2F3F4F5F6F7F8F9")
k = hk.derive(ikm, salt, info, 42)
assert(k == bytes("3CB25F25FAACD57A90434F64D0362F2A2D2D0A90CF1A5A4C5DB02D56ECC4C5BF34007208D5B887185865"))

# Test Case 2
hk = crypto.HKDF_SHA256()
ikm  = bytes("000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f")
salt = bytes("606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeaf")
info = bytes("b0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff")
k = hk.derive(ikm, salt, info, 82)
assert(k == bytes("b11e398dc80327a1c8e7f78c596a49344f012eda2d4efad8a050cc4c19afa97c59045a99cac7827271cb41c65e590e09da3275600c2f09b8367793a9aca3db71cc30c58179ec3e87c14c01d5c1f3434f1d87"))

# Test Case 3
hk = crypto.HKDF_SHA256()
ikm  = bytes("0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b")
salt = bytes()
info = bytes()
k = hk.derive(ikm, salt, info, 42)
assert(k == bytes("8da4e775a563c18f715f802a063c5a31b8a11f5c5ee1879ec3454e5f3c738d2d9d201395faa4b61a96c8"))
```

#### `crypto.PBKDF2_HMAC_SHA256` class

Provides PBKDF2 using HMAC SHA256 key derivation. Turns a password into a hash.

General Function|Parameters and details
:---|:---
derive<a class="cmnd" id="aes_pbkdf2_hmac_sha256_derive"></a>|`crypto.PBKDF2_HMAC_SHA256().derive(password:bytes(), salt:bytes(), iterations:int, out_bytes:int) -> bytes(out_bytes)`<br>Computes a key derivation function<br>`password` is the input keying material<br>`salt` can be empty `bytes()`<br>`iterations` counts the number of iterations of HMAC, limited to 10000 to make computation short enough for ESP32<br>`out_bytes` indicates the number of bytes to generate (between 1 and 256)

Test vectors from <https://github.com/brycx/Test-Vector-Generation/blob/master/PBKDF2/pbkdf2-hmac-sha2-test-vectors.md>

``` berry
import crypto
pb = crypto.PBKDF2_HMAC_SHA256()

assert(pb.derive("password", "salt", 1, 20) == bytes('120fb6cffcf8b32c43e7225256c4f837a86548c9'))

assert(pb.derive("password", "salt", 2, 20) == bytes('ae4d0c95af6b46d32d0adff928f06dd02a303f8e'))

assert(pb.derive("password", "salt", 3, 20) == bytes('ad35240ac683febfaf3cd49d845473fbbbaa2437'))

assert(pb.derive("password", "salt", 4096, 20) == bytes('c5e478d59288c841aa530db6845c4c8d962893a0'))

assert(pb.derive("passwd", "salt", 1, 128) == bytes('55AC046E56E3089FEC1691C22544B605F94185216DDE0465E68B9D57C20DACBC49CA9CCCF179B645991664B39D77EF317C71B845B1E30BD509112041D3A19783C294E850150390E1160C34D62E9665D659AE49D314510FC98274CC79681968104B8F89237E69B2D549111868658BE62F59BD715CAC44A1147ED5317C9BAE6B2A'))
```

#### `crypto.SHA256` class

Provides SHA256 hashing function

General Function|Parameters and details
:---|:---
init<a class="cmnd" id="aes_sha256_init"></a>|`HMAC_SHA256.init() -> instance`<br>Initialize SHA256 hashing function
update<a class="cmnd" id="aes_sha256_update"></a>|`update(data:bytes) -> self`<br>Add content to the hash. Calls can be chained.
out<a class="cmnd" id="aes_sha256_out"></a>|`out() -> bytes(32)`<br>Output the value of the hash

Example test vectors from <https://www.dlitz.net/crypto/shad256-test-vectors/>

``` berry
import crypto
h = crypto.SHA256()

# SHA256 of empty message
assert(h.out() == bytes("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"))

# (first 16 bytes of RC4 keystream where the key = 0)
h.update(bytes("de188941a3375d3a8a061e67576e926d"))
assert(h.out() == bytes("067c531269735ca7f541fdaca8f0dc76305d3cada140f89372a410fe5eff6e4d"))
```

#### `crypto.HMAC_SHA256` class

Provides HMAC SHA256 hashing function

General Function|Parameters and details
:---|:---
init<a class="cmnd" id="aes_hmac_sha256_init"></a>|`HMAC_SHA256.init(key:bytes) -> instance`<br>Initialize HMAC_SHA256 hashing function with a provided key
update<a class="cmnd" id="aes_hmac_sha256_update"></a>|`update(data:bytes) -> self`<br>Add content to the hash. Calls can be chained
out<a class="cmnd" id="aes_hmac_sha256_out"></a>|`out() -> bytes(32)`<br>Output the value of the hash

Test case from <https://datatracker.ietf.org/doc/html/rfc4231>:

``` berry
import crypto
key = bytes("4a656665")
msg = bytes("7768617420646f2079612077616e7420666f72206e6f7468696e673f")
h = crypto.HMAC_SHA256(key)
h.update(msg)
hmac = h.out()
assert(hmac == bytes("5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843"))
```

#### `crypto.RSA` class

Provides RSA core features, currently only JWT RS256 signing (RSASSA-PKCS1-v1_5 with SHA256) - requires `#define USE_BERRY_CRYPTO_RSA`

Function|Parameters and details
:---|:---
rs256<a class="cmnd" id="aes_rsa_rs256"></a>|`crypto.RSA.rs256HMAC_SHA256.init(private_key:bytes(), payload:bytes()) -> bytes()`<br>Sign a payload with an RSA private key in DER binary format.<br>`private_key`: (bytes) contains the binary DER (ASN.1) private key, see example below to convert from PEM.<br>`payload` (bytes) JWT payload to sign, it should be derived from JSON encoded as base64url<br>Outputs a `bytes()` array of the payload, hashed with SHA256 and signed with the RSA private key. The output is 256 bytes longs for a 2048 RSA key.


!!! example "Signing a full JWT token with RS256"

    ``` berry
    import string
    import crypto

    # JWT requires base64url and not raw base64
    # see https://base64.guru/standards/base64url
    # input: string or bytes
    def base64url(v)
      import string
      if type(v) == 'string'   v = bytes().fromstring(v) end
      var b64 = v.tob64()
      # remove trailing padding
      b64 = string.tr(b64, '=', '')
      b64 = string.tr(b64, '+', '-')
      b64 = string.tr(b64, '/', '_')
      return b64
    end

    # JWT header and claim
    var header = '{"alg":"RS256","typ":"JWT"}'
    var claim = '{"sub":"1234567890","name":"John Doe","admin":true,"iat":1516239022}'
    var b64header = base64url(header)
    var b64claim = base64url(claim)

    assert(b64header == 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9')
    assert(b64claim == 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0')

    # `body` is the payload to sign with RS256
    var body = b64header + '.' + b64claim
    assert(body == 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0')

    var private_key =
    '-----BEGIN PRIVATE KEY-----\n'+
    'MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC7VJTUt9Us8cKj\n'+
    'MzEfYyjiWA4R4/M2bS1GB4t7NXp98C3SC6dVMvDuictGeurT8jNbvJZHtCSuYEvu\n'+
    'NMoSfm76oqFvAp8Gy0iz5sxjZmSnXyCdPEovGhLa0VzMaQ8s+CLOyS56YyCFGeJZ\n'+
    'qgtzJ6GR3eqoYSW9b9UMvkBpZODSctWSNGj3P7jRFDO5VoTwCQAWbFnOjDfH5Ulg\n'+
    'p2PKSQnSJP3AJLQNFNe7br1XbrhV//eO+t51mIpGSDCUv3E0DDFcWDTH9cXDTTlR\n'+
    'ZVEiR2BwpZOOkE/Z0/BVnhZYL71oZV34bKfWjQIt6V/isSMahdsAASACp4ZTGtwi\n'+
    'VuNd9tybAgMBAAECggEBAKTmjaS6tkK8BlPXClTQ2vpz/N6uxDeS35mXpqasqskV\n'+
    'laAidgg/sWqpjXDbXr93otIMLlWsM+X0CqMDgSXKejLS2jx4GDjI1ZTXg++0AMJ8\n'+
    'sJ74pWzVDOfmCEQ/7wXs3+cbnXhKriO8Z036q92Qc1+N87SI38nkGa0ABH9CN83H\n'+
    'mQqt4fB7UdHzuIRe/me2PGhIq5ZBzj6h3BpoPGzEP+x3l9YmK8t/1cN0pqI+dQwY\n'+
    'dgfGjackLu/2qH80MCF7IyQaseZUOJyKrCLtSD/Iixv/hzDEUPfOCjFDgTpzf3cw\n'+
    'ta8+oE4wHCo1iI1/4TlPkwmXx4qSXtmw4aQPz7IDQvECgYEA8KNThCO2gsC2I9PQ\n'+
    'DM/8Cw0O983WCDY+oi+7JPiNAJwv5DYBqEZB1QYdj06YD16XlC/HAZMsMku1na2T\n'+
    'N0driwenQQWzoev3g2S7gRDoS/FCJSI3jJ+kjgtaA7Qmzlgk1TxODN+G1H91HW7t\n'+
    '0l7VnL27IWyYo2qRRK3jzxqUiPUCgYEAx0oQs2reBQGMVZnApD1jeq7n4MvNLcPv\n'+
    't8b/eU9iUv6Y4Mj0Suo/AU8lYZXm8ubbqAlwz2VSVunD2tOplHyMUrtCtObAfVDU\n'+
    'AhCndKaA9gApgfb3xw1IKbuQ1u4IF1FJl3VtumfQn//LiH1B3rXhcdyo3/vIttEk\n'+
    '48RakUKClU8CgYEAzV7W3COOlDDcQd935DdtKBFRAPRPAlspQUnzMi5eSHMD/ISL\n'+
    'DY5IiQHbIH83D4bvXq0X7qQoSBSNP7Dvv3HYuqMhf0DaegrlBuJllFVVq9qPVRnK\n'+
    'xt1Il2HgxOBvbhOT+9in1BzA+YJ99UzC85O0Qz06A+CmtHEy4aZ2kj5hHjECgYEA\n'+
    'mNS4+A8Fkss8Js1RieK2LniBxMgmYml3pfVLKGnzmng7H2+cwPLhPIzIuwytXywh\n'+
    '2bzbsYEfYx3EoEVgMEpPhoarQnYPukrJO4gwE2o5Te6T5mJSZGlQJQj9q4ZB2Dfz\n'+
    'et6INsK0oG8XVGXSpQvQh3RUYekCZQkBBFcpqWpbIEsCgYAnM3DQf3FJoSnXaMhr\n'+
    'VBIovic5l0xFkEHskAjFTevO86Fsz1C2aSeRKSqGFoOQ0tmJzBEs1R6KqnHInicD\n'+
    'TQrKhArgLXX4v3CddjfTRJkFWDbE/CkvKZNOrcf1nhaGCPspRJj2KUkj1Fhl9Cnc\n'+
    'dn/RsYEONbwQSjIfMPkvxF+8HQ==\n'+
    '-----END PRIVATE KEY-----\n'

    # public_key for reference but not actually used here
    var public_key =
    '-----BEGIN PUBLIC KEY-----\n'+
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1SU1LfVLPHCozMxH2Mo\n'+
    '4lgOEePzNm0tRgeLezV6ffAt0gunVTLw7onLRnrq0/IzW7yWR7QkrmBL7jTKEn5u\n'+
    '+qKhbwKfBstIs+bMY2Zkp18gnTxKLxoS2tFczGkPLPgizskuemMghRniWaoLcyeh\n'+
    'kd3qqGElvW/VDL5AaWTg0nLVkjRo9z+40RQzuVaE8AkAFmxZzow3x+VJYKdjykkJ\n'+
    '0iT9wCS0DRTXu269V264Vf/3jvredZiKRkgwlL9xNAwxXFg0x/XFw005UWVRIkdg\n'+
    'cKWTjpBP2dPwVZ4WWC+9aGVd+Gyn1o0CLelf4rEjGoXbAAEgAqeGUxrcIlbjXfbc\n'+
    'mwIDAQAB\n'+
    '-----END PUBLIC KEY-----\n'

    # read private_key as DER binary
    while (private_key[-1] == '\n') private_key = private_key[0..-2] end
    var private_key_DER = bytes().fromb64(string.split(private_key, '\n')[1..-2].concat())

    # comparison with what was expected
    assert(private_key_DER.tob64() == 'MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC7VJTUt9Us8cKjMzEfYyjiWA4R4/M2bS1GB4t7NXp98C3SC6dVMvDuictGeurT8jNbvJZHtCSuYEvuNMoSfm76oqFvAp8Gy0iz5sxjZmSnXyCdPEovGhLa0VzMaQ8s+CLOyS56YyCFGeJZqgtzJ6GR3eqoYSW9b9UMvkBpZODSctWSNGj3P7jRFDO5VoTwCQAWbFnOjDfH5Ulgp2PKSQnSJP3AJLQNFNe7br1XbrhV//eO+t51mIpGSDCUv3E0DDFcWDTH9cXDTTlRZVEiR2BwpZOOkE/Z0/BVnhZYL71oZV34bKfWjQIt6V/isSMahdsAASACp4ZTGtwiVuNd9tybAgMBAAECggEBAKTmjaS6tkK8BlPXClTQ2vpz/N6uxDeS35mXpqasqskVlaAidgg/sWqpjXDbXr93otIMLlWsM+X0CqMDgSXKejLS2jx4GDjI1ZTXg++0AMJ8sJ74pWzVDOfmCEQ/7wXs3+cbnXhKriO8Z036q92Qc1+N87SI38nkGa0ABH9CN83HmQqt4fB7UdHzuIRe/me2PGhIq5ZBzj6h3BpoPGzEP+x3l9YmK8t/1cN0pqI+dQwYdgfGjackLu/2qH80MCF7IyQaseZUOJyKrCLtSD/Iixv/hzDEUPfOCjFDgTpzf3cwta8+oE4wHCo1iI1/4TlPkwmXx4qSXtmw4aQPz7IDQvECgYEA8KNThCO2gsC2I9PQDM/8Cw0O983WCDY+oi+7JPiNAJwv5DYBqEZB1QYdj06YD16XlC/HAZMsMku1na2TN0driwenQQWzoev3g2S7gRDoS/FCJSI3jJ+kjgtaA7Qmzlgk1TxODN+G1H91HW7t0l7VnL27IWyYo2qRRK3jzxqUiPUCgYEAx0oQs2reBQGMVZnApD1jeq7n4MvNLcPvt8b/eU9iUv6Y4Mj0Suo/AU8lYZXm8ubbqAlwz2VSVunD2tOplHyMUrtCtObAfVDUAhCndKaA9gApgfb3xw1IKbuQ1u4IF1FJl3VtumfQn//LiH1B3rXhcdyo3/vIttEk48RakUKClU8CgYEAzV7W3COOlDDcQd935DdtKBFRAPRPAlspQUnzMi5eSHMD/ISLDY5IiQHbIH83D4bvXq0X7qQoSBSNP7Dvv3HYuqMhf0DaegrlBuJllFVVq9qPVRnKxt1Il2HgxOBvbhOT+9in1BzA+YJ99UzC85O0Qz06A+CmtHEy4aZ2kj5hHjECgYEAmNS4+A8Fkss8Js1RieK2LniBxMgmYml3pfVLKGnzmng7H2+cwPLhPIzIuwytXywh2bzbsYEfYx3EoEVgMEpPhoarQnYPukrJO4gwE2o5Te6T5mJSZGlQJQj9q4ZB2Dfzet6INsK0oG8XVGXSpQvQh3RUYekCZQkBBFcpqWpbIEsCgYAnM3DQf3FJoSnXaMhrVBIovic5l0xFkEHskAjFTevO86Fsz1C2aSeRKSqGFoOQ0tmJzBEs1R6KqnHInicDTQrKhArgLXX4v3CddjfTRJkFWDbE/CkvKZNOrcf1nhaGCPspRJj2KUkj1Fhl9Cncdn/RsYEONbwQSjIfMPkvxF+8HQ==')

    # sign body
    var body_b64 = bytes().fromstring(body)
    var sign = crypto.RSA.rs256(private_key_DER, body_b64)
    var b64sign = base64url(sign)

    # check output
    assert(b64sign == 'NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ')

    # Final token:
    var jwt_token = payload + '.' + b64sign
    ```

#### `crypto.MD5` class

Provides MD5 hashing function.

General Function|Parameters and details
:---|:---
init<a class="cmnd" id="aes_md5_init"></a>|`MD5.init() -> instance`<br>Initialize MD5 hashing function
update<a class="cmnd" id="aes_md5_update"></a>|`update(data:bytes) -> self`<br>Add content to the hash. Calls can be chained.
finish<a class="cmnd" id="aes_md5_finish"></a>|`finish() -> bytes(16)`<br>Finish the MD5 calculation and output the result (16 bytes)

Test vector:

``` berry
import crypto
h = crypto.MD5()
t = bytes().fromstring("The quick brown fox jumps over the lazy dog")
h.update(t)
m = h.finish()
assert(m == bytes("9e107d9d372bb6826bd81d3542a419d6"))
```


### `flash` module

Warning: this is a low-level module used to read and write flash memory. You normally shouldn't need to use it. It is used internally by `partition_core`. Use with `import flash`.


Function|Parameters and details
:---|:---
read<a class="cmnd" id="flash_read"></a>|`flash.read(address:int[, length:int]) -> bytes()`<br>Reads bytes from an absolute address from the flash and returns a `bytes()` object. If `length` is omitted, the size is 4KB (4096 bytes)
write<a class="cmnd" id="flash_write"></a>|`flash.write(address:int, content:bytes [, no_erase:bool]) -> nil`<br>Writes a `bytes` object to flash. It is generally better to do 4KB aligned writes.<br>By default, the 4KB page is first erased and the content is written back to it. This call handles automatically writes non-aligned to 4KB boundaries<br>If `no_erase` is `true`, content is written without erasing, which can be useful when writing a small number of bytes from previously erased pages<br>Flash contains all ones when erased, and writing to flash can only turn `1` to `0`. Erasing flash causes wear leveling and reduces the lifetime of flash.
erase<a class="cmnd" id="flash_erase"></a>|`flash.erase(address:int, length:int) -> nil`<br>Erases flash pages. `address` and `lenght` must be 4KB aligned, i.e. multiples of `4096`
id<a class="cmnd" id="flash_id"></a>|`flash.id() -> int`<br>Returns the 32-bit flash identifier
size<a class="cmnd" id="flash_size"></a>|`flash.size() -> int`<br>Returns the size of flash in bytes
current_ota<a class="cmnd" id="flash_current_ota"></a>|`flash.current_ota() -> int`<br>Returns the number of the partition Tasmota is running from, typically `0` or `1`, or `-1` for safeboot. With safeboot layout, it is always `0`
factory<a class="cmnd" id="flash_factory"></a>|`flash.factory(force_ota:bool) -> nil`<br>Forces the next restart to use the `factory` partition if any is present.<br>If `force_ota` is true, it forces an OTA update with the current URL
  
### `img` class

Thin wrapper for image data, that allows format conversions and is able to reduce memory reallocations in certain scenarios.  
  
Supports following image types, which integer values are equal to the enum `pixformat_t` of Espressif's webcam driver:  
- `img.RGB565`      = 0  
- `img.RGB888`      = 5  
- `img.JPEG`        = 4  
- `img.GRAYSCALE`   = 3  

Create an instance of an image with `var i = img()`.  
Memory will be released automatically by Berry's garbage collector after deletion of the instance.  

img Function|Parameters and details
:---|:---
from_jpeg|`img.from_jpeg(jpeg_buffer:bytes[, type:img.type]) -> nil` Copy JPEG image as byte buffer to the buffer of an `img` instance. If optional image type is provided, this will be converted on the fly. This will not reallocate the image buffer, if the size and format does not change.
from_buffer|`img.from_buffer(image_data:bytes,width:int:height:int,type:img.type) -> nil` Construct image from raw image data for the types `RGB565`, `RGB888` and `GRAYSCALE`.
get_buffer|`img.get_buffer([descriptor:bytes]) -> image_data:bytes` Returns the raw image data for any supported type. For `RGB565`, `RGB888` and `GRAYSCALE` a descriptor can be provided to get a ROI (region of interest).
convert_to|`img.convert_to(type:img.type) -> nil` Internal conversion of the image format.
info|`img.info() -> map` Returns a map with some information about the current image.
  
The optional ROI descriptor is a representation of an affine matrix, which can be constructed in Berry:
```berry
#  Describe ROI using an affine matrix (https://en.wikipedia.org/wiki/Affine_transformation#Image_transformation)
#   | scale_x shear_x translation_x |
#   | shear_y scale_y translation_y |
#   | 0	      0       1             | - these are constants in this scope
  
def roi_dsc(m)
    var d = bytes(-24)
    d.setfloat(0,m["scaleX"])
    d.setfloat(4,m["shearX"])
    d.setfloat(8,m["shearY"])
    d.setfloat(12,m["scaleY"])
    d.seti(16,m["transX"],2)
    d.seti(18,m["transY"],2)
    d.seti(20,m["width"],2)
    d.seti(22,m["height"],2)
    return d
end
```
A simple web tool to create such matrices is embedded in the docs: [ROI  editor](ROI-editor.md)
  
Example:
```berry
# load jpg file into img
var i = img()
var f = open("j.jpg","r")
i.from_jpg(f.readbytes(),img.RGB565) # i now holds image data with type RGB565
f.close()
```
  
### `cam` module

Very small module to access a connected camera module with the purpose to have as much heap memory available as possible in comparison to the fully fledged webcam drivers for machine learning, but there are more possible applications. It is not intended to be a general replacement for the webcam drivers.
  
Tasmota Function|Parameters and details
:---|:---
cam.setup|`(mode:int) -> bool` Init camera hardware with the resolution (same value as command `wcresolution`).
cam.get_image|`([image:img[,type:img.type]]) -> bytes or nil` Takes a picture - without an additional option this is just a JPEG buffer. If an image instance is provided, the image data will go there. If an additional type is given, a conversion will happen on the fly. This will not lead to a memory reallocation, if there is no change for size and type of the image.
cam.info|`() -> map` Shows info map with last current resolution and camera mode 

Example:  

``` berry

# Simple "video player" for boards with a camera and a display

scr = lv.scr_act()
scr.set_style_bg_color(lv.color(lv.COLOR_BLUE), lv.PART_MAIN | lv.STATE_DEFAULT)

# create a lv_img object as image view
cam_view = lv.img(scr)
cam_view.center()

i = img()

import cam
cam.setup(4) # 240 x 240
cam.get_image(i,i.RGB565)

def lv_img_dsc(image)
    var i = image.info()
    var dsc = bytes(24)
    dsc..0x19 # magic
    dsc..0x12 # cf RGB565
    dsc.add(0,2) # flags
    dsc.add(i["width"],2) # width
    dsc.add(i["height"],2) # height
    dsc.add(i["width"] * 2,2) # stride
    dsc.add(0,2) # reserved
    dsc.add(i["size"],4) # size
    dsc.add(i["buf_addr"],4) # data
    dsc.add(0,4) # reserved
    print(dsc)
    return dsc
end

descriptor = lv_img_dsc(i)
cam_view.set_src(descriptor) # bind cam_view to buffer of img

def video()
    cam.get_image(i,i.RGB565) # this will just update the buffer, no reallocation
    cam_view.invalidate()
    tasmota.set_timer(20,/->video()) # aim for 50 Hz
end

video()
```

### `BLE` module
  
Write drivers and applications for Bluetooth Low Energy supporting all 4 roles. More information here: [BLE module](Bluetooth_MI32.md#ble-module)
  
## Philips Hue emulation for Alexa
Berry extends the native Hue/Alexa emulation and makes it possible to handle any number of virtual lights. You can easily define "virtual" lights in Berry, respond to commands from Alexa and send light status.

It is up to you to define the final behavior. For example you could control some fancy devices, light strips or whatever takes on/off, dimmer or RGB commands. Your imagination is the limit.

Hue emulation requires both `#define USE_EMULATION` and 
`#define USE_EMULATION_HUE`. Emulation must also be enabled with `Emulation 2` command.

### `light_state` class

The core class is `light_state` which represents a virtual light.

`light_state` general methods:

Methods|Parameters and details
:---|:---
init<a class="cmnd" id="aes_md5_init"></a>|`light_state.init(channels:int) -> instance`<br>Creates a `light_state` instance for a light with `channels` channels.<BR>Constants are:<BR>`light_state.RELAY` = `0`<BR>`light_state.DIMMER` = `1`<BR>`light_state.CT` = `2`<BR>`light_state.RGB` = `3`<BR>`light_state.RGBW` = `4`<BR>`light_state.RGBCT` = `5`
signal_change|`signal_change() -> nil`<br>Called when a changed was triggered by Alexa.<BR>You can sub-class this class and override this method. Alternatively you can also poll for any change.

`light_state` getters:

Attributes|Parameters and details
:---|:---
power|`(bool)` on/off state
reachable|`(bool)` light is reachable
type|`(int)` number of channels of the light
bri|`(int)` brightness of the light (0..255)
ct|`(int)` white temperature of the light (153..500)
sat|`(int)` saturation of the light (0..255)
hue|`(int)` hue of the light (0..360)
hue16|`(int)` hue as 16 bits (0..65535)
r<BR>g<BR>b|`(int)` Red Green Blue channels (0..255)
x<BR>y|`(float)` x/y color as floats (0.0 .. 1.0)
mode_ct<BR>mode_rgb|`(bool)` light is in RGB or CT mode
get|`get() -> map` returns the complete state of the light as a map<BR>Example:<BR>`{'rgb': '1E285A', 'hue': 230, 'type': 5, 'power': false, 'bri': 90, 'mode_rgb': true, 'sat': 170, 'mode_ct': false, 'channels': [30, 40, 90, 0, 0]}`

`light_state` setters:

Methods|Parameters and details
:---|:---
set\_power|`set_power(bool) -> nil` sets on/off state
set\_reachable|`set_reachable(bool) -> nil` sets the reachable state
set\_bri|`set_bri(int) -> nil` sets the brightness (0..255)
set\_ct|`set_ct(int) -> nil` sets the white temperature (153..500)
set\_sat|`set_sat(int) -> nil` sets the saturation (0..255)
set\_huesat|`set_huesat(hue:int, sat:int) -> nil` sets hue and saturation (0..360, 0..255)
set\_hue16sat|`set_hue16sat(hue16:int, sat:int) -> nil` sets hue16 and saturation (0..65535, 0..255)
set\_rgb|`set_rgb(r:int, g:int, b=int) -> nil` sets red/green/blue channels (0..255 x 3)
set\_xy|`set_xy(x:float, y:float) -> nil` sets color as x/y (0.0 .. 1.0 x 2)

`light_state` static helper functions:

Methods|Parameters and details
:---|:---
gamma8|`gamma8(int) -> nil` applies gamma correction to 8 bits value (0..255)
gamma10|`gamma10(int) -> nil` applies gamma correction to 10 bits value (0..1023)
reverse\_gamma10|`reverse_gamma10(int) -> nil` applies reverse gamma correction to 10 bits value (0..1023)

### `hue_bridge` module

Use `import hue_bridge` and declare all the virtual lights. Example:

```berry
# put this in `autoexec.be`
import hue_bridge

l1 = light_state(light_state.DIMMER)
hue_bridge.add_light(11, l1, "Synthetic Dimmer", "V1", "Tasmota Factory")

l2 = light_state(light_state.CT)
hue_bridge.add_light(12, l2, "Synthetic CT", "V1", "Tasmota Factory")

l5 = light_state(light_state.RGBCT)
hue_bridge.add_light(15, l5, "Synthetic RGBCT")
```

When you start the Hue pairing, all virtual lights are advertised. You need to make sure that virtual lights are defined at each restart (in `autoexec.be` for example).

`hue_bridge` functions:

Methods|Parameters and details
:---|:---
add\_light|`add_light(id:int, light:instance of light_state, name:string [, model:string, manuf:strin]) -> light`<BR>Adds an virtual light to the Hue bridge.<BR>`id` = numerical identifier of the Hue light. Using low numbers avoids conflict with real lights from Tasmota<BR>`light` = instance of `light_state` handling the state and behavior of the light<BR>`name` = name of the light as displayed in the Alexa app (can be overridden in the app)<BR>`model` (opt) = name of the manufacturer model, defaults to "Unknown"<BR>`manuf` (opt) = name of the manufacturer, defaults to "Tasmota"
remove\_light|`remove_light(id:int) -> nil`<BR>Removes a light from the Hue bridge by hue id.
light_to_id|`light_to_id(light:instance) -> int` converts a registered `light_instance` instance to its Hue id

## Zigbee

For Zigbee coordinators, there is a Berry mapping that allows explore Zigbee configurations and devices. It also allows to intercept incoming message (low and high level) and transform messages before they reach the Tasmota layer. This is useful for non-standard Zigbee devices for which Zigbee plug-ins are not sufficient.

Note: the following are only available when compiling with `#define USE_ZIGBEE`

Internally, the Tasmota Zigbee engine calls `callBerryZigbeeDispatcher()` at key points to allow your Berry code to take over and change messages on-the-fly.

### `import zigbee`

First step is to use `import zigbee` which returns an instance (monad) of `zb_coord()`.

General methods|Parameters and details
:---|:---
started|`zigbee.started() -> bool or nil`<BR>Returns `true` if Zigbee successfully started, then all other Zigbee methods are available. This state is final and does not change.<BR>Returns `false` if Zigbee is still in initialization process. This state eventually changes to `true` or `nil`.<BR>Returns `nil` if Zigbee is not configured (no GPIO) or if initialization failed. This state is final and indicates a fatal error.
info|`zigbee.info() -> map` returns a map with general configuration of the Zigbee coordinator.<BR>Format is identical to `ZbConfig`<BR>Example: <BR>`{'ext_pan_id': '0xCCCCCCCCA11A2233', 'tx_radio': 20, 'shortaddr': 0, 'longaddr': '0x00124B0026BAABBC', 'channel': 11, 'pan_id': 837, 'pan_id_hex': '0x0345', 'shortaddr_hex': '0x0000'}`
size|`zigbee.size() -> int` returns the number of devices known by the coordinator
iter|`zigbee.iter() -> iterator`<BR>Returns an iterator on all Zigbee devices<BR>Use compact implicit form:<BR>`for ze: zigbee  print(ze)  end`
item<BR>\[\]|`zigbee.item(shortaddr:int | friendlyname:str) -> instance of zb_device`<BR>Returns the Zigbee device corresponding to short address `shortaddr` or to friendly name `friendlyname`.<BR>Returns an `index_error` exception if not found.<BR>You can use the compact syntax `zigbee[0xFAB6]`
find|`zigbee.find(shortaddr:int | friendlyname:str) -> instance of zb_device`<BR>Returns the Zigbee device corresponding to short address `shortaddr` or to friendly name `friendlyname`.<BR>Contrary to the above, returns `nil` if not found (no exception).
abort|`zigbee.abort() -> nil` aborts the initialization of Zigbee MCU. To be used when initialization of Zigbee failed

### `zb_device` class

The class `zb_device` contains all known information about a paired Zigbee device (end-device or router). You can't create a `zb_device` from scratch, they most be retrieved from `zigbee` object.

General methods|Parameters and details
:---|:---
info|`info() -> attribute_list or nil`<BR>Returns the last known state for this device as an `attribute_list`<br>This is equivalent of running `ZbInfo <device>`` and getting the attribute_list

`zb_device` instances can only be read, you can't change directly any attribute.

Instance Variables|Parameters and details
:---|:---
shortaddr|`shortaddr -> int` returns the 16 bits short address
longaddr|`longaddr -> bytes` returns the long 64 bits address as 8 bytes (or all zeroes if unknown)
name|`name -> string` returns the friendly name of the device or `0x....` hex name if no friendly name was defined using `ZbName` command
reachable|`reachable -> bool` is the device reachable, i.e. did it respond last time we tried to contact them
hidden|`hidden -> bool` is the device declared as hidden, i.e. not announced in Hue emulation
router|`router -> bool` is the device known to be a router
model|`model -> string` model of the device
manufacturer|`manufacturer -> string` manufacturer name of the device
lastseen|`lastseen -> int` timestamp (epoch) when the device was last seen
lqi|`lqi -> int` radio strength and quality when the device was last seen
battery|`battery -> int` percentage of battery, or `-1` if unknown of no battery
battery\_lastseen|`battery_lastseen -> int` timestamp (epoch) when the battery was last reported, or `-1`

Example:
```berry
import zigbee

# show all devices
for device: zigbee
  print(device)
end
#
# outputs:
# <instance: zb_device(0x868E, 0x00124B001F841E41, name:'Bedroom', model:'TH01', manufacturer:'eWeLink')>
# ... more devices

# read one device by short address
var device = zigbee[0x868E]

print(device.longaddr)
# bytes('411E841F004B1200')

print(device.reachable)
# false - because it's a sleep device

print(device.router)
# false - it's a sleepy device so not a router

print(device.manufacturer, device.model)
# eWeLink TH013000_g5xawfcq')>

# example with a plug
device = zigbee[0xC1BC]
print(device.longaddr, device.reachable, device.router)
# bytes('859F4E001044EF54') true false
print(device.manufacturer, device.model)
# LUMI lumi.plug.maeu01
```

### Changing Zigbee values on-the-fly

Whenever a Zigbee message is received (typically values of attributes), the Tasmota Zigbee engines generates events at key points which allow custom Berry code to intercept and change messages on-the-fly.

Messages are sent in the following order:

- `frame_received`: (low-level) the raw Zigbee message is passed as `bytes` and attributes are not yet decoded. The `bytes` buffer can be modified and passed back to the Tasmota Zigbee engine.
- `attributes_raw`: (mid-level) Zigbee attributes are decoded but no transformation is applied yet. Attributes are only available in cluster/attribute format, names are not decoded and plug-ins are not yet applied.<BR>This is the perfect moment to change non-standard attributes and map them to standard ones.
- `attributes_refined`: (high-level) Attributes are mapped to their names (when possible) and all transformations are applied. This is the last chance to change values.
- `attributes_final`: (high-level) consolidated `attributes_refined`. It is triggered just before final and consolidated attributes are sent to MQTT. Zigbee typically waits for 350ms before sending attributes, so it can consolidate multiple sensors (like temperature + humidity + pressure) in a single MQTT message


The format of methods are the following:
`def <zigbee event>(event_type, frame, attr_list, idx)`

Argument|Description
---|---
`event_type`|(string) can take values: `frame_received`, `attributes_raw` or `attributes_refined`
`frame`|(instance of `zcl_frame`) low-level ZCL frame<BR>Always present
`attr_list`|(instance of `XXX`) list of attributes.<BR>This attribute is `nil` for `frame_received`, contains raw attributes in `attributes_raw` and refined attributes in `attributes_refined`
`idx`|(int 16 bits unsigned) contains the Zigbee short address

Example, if you want to dump all the traffic passed:

``` berry
import zigbee
class my_zb_handler
  def frame_received(event_type, frame, attr_list, idx)
    print(f"shortaddr=0x{idx:04X} {event_type=} {frame=}")
  end
  def attributes_raw(event_type, frame, attr_list, idx)
    print(f"shortaddr=0x{idx:04X} {event_type=} {attr_list=}")
  end
  def attributes_refined(event_type, frame, attr_list, idx)
    print(f"shortaddr=0x{idx:04X} {event_type=} {attr_list=}")
  end
  def attributes_final(event_type, frame, attr_list, idx)
    print(f"shortaddr=0x{idx:04X} {event_type=} {attr_list=}")
  end

end

var my_handler = my_zb_handler()
zigbee.add_handler(my_handler)

# example of reading for a plug
#
# shortaddr=0xC1BC event_type=frame_received frame={'srcendpoint': 21, 'transactseq_set': 0, 'shortaddr': 49596, 'dstendpoint': 1, 'payload': bytes('5500003956CE8243'), 'shortaddr_hex': '0xC1BC', 'manuf': 0, 'payload_ptr': <ptr: 0x3ffccb5c>, 'need_response': 0, 'transactseq': 25, 'cmd': 1, 'direct': 0, 'cluster': 12, 'cluster_specific': 0, 'groupaddr': 0}
# shortaddr=0xC1BC event_type=attributes_raw attr_list={"000C/0055":261.612,"Endpoint":21,"LinkQuality":21}
# shortaddr=0xC1BC event_type=attributes_refined attr_list={"ActivePower":261.612,"(ActivePower)":"0B04/050B","Endpoint":21,"LinkQuality":21}
# shortaddr=0xC1BC event_type=attributes_final attr_list={"ActivePower":261.612,"(ActivePower)":"0B04/050B","Endpoint":21,"LinkQuality":21}

# to remove handler:
# zigbee.remove_handler(my_handler)
```

The `attr_list` is of class `zcl_attribute_list` and can be accessed with `zigbee.zcl_attribute_list`.

Methods|Parameters and details
:---|:---
size|`size() -> int`<BR>Number of attributes in the list
remove|`remove(index:int) -> nil`<BR>Remove the item at `index`
item<BR>[x]|`item(index:int) -> instance` or `[index:int] -> instance`<BR>Retrieve attribute at `index`, or `nil` if none.<BR>Note: contrary to native `list` it does not throw an exception if the index if off bounds.
new\_head|`new_head(attribute:instance of zigbee.zcl_attribute_list) -> self`<BR>Adds a new attribute at the beginning (head) of the list
new\_tail|`new_tail(attribute:instance of zigbee.zcl_attribute_list) -> self`<BR>Adds a new attribute at the end (tail) of the list

Variables of `zcl_attribute_list` for the entire list and common to all attributes:

Attributes (read or write)|Details
:---|:---
`groupaddr`|`uint16` group address if the message was multicast, or `nil`
`src_ep`|`uint8` source endpoint of the message
`lqi`|`uint8` lqi for the message received (link quality)

The `zcl_attribute_list` contains a list of `zcl_attribute` instance.

Attributes (read or write)|Details
:---|:---
`cluster`|`uint16` ZCL cluster number
`attr_id`|`uint16` ZCL attribute id
`cmd`|`uint8` ZCL command number
`direction`|`0 or 1` ZCL direction of the message (to or from the coordinator)
`cmd_general`|`0 or 1` ZCL flag indicating a general command vs a cluster specific command
`key`|`string or nil` attribute name (if any) or `nil`
`val`|`any` ZCL value of the attribute, can be `int/float/string/bytes...`
`key_suffix`|`uint8` key suffix in case a same attribute is repeated<BR>Like `Power1`, `Power2`...
`manuf`|`uint16` ZCL manufacturer specific code or 0 if none<BR>This is typically indicating a proprietary attribute
`attr_multiplier`|`int` multiplier to be applied or `1`
`attr_divider`|`int` divider to be applied or `1`
`attr_base`|`int` offset to be applied or `0`
`attr_type`|`uint8` ZCL type byte for the received attribute

`zcl_attribute_list` methods:

Methods|Parameters and details
:---|:---
tomap|`tomap() -> map`<BR>Transforms main attributes as map (read-only): `cluster`, `attr_id`, `cmd`, `direction`, `key`, `val` 

#### Changing attributes received

For events `attributes_raw` and `attributes_refined`, you receive an instance of `attr_list` which represents all the attributes received. This list can be modified according to specificities of devices, hence giving full liberty on decoding exotic protocols or manufacturers.

The decoding is done in 2 steps:

- `attributes_raw` contains individual attributes with their native raw values. Names are not yet matched, nor scale factors applied. This is where you want to decode non-standard protocols
  Example:
  `{"000C/0055":261.612,"Endpoint":21,"LinkQuality":21}`
  represents raw value from a plug; the value was decoded as float.

- `attributes_refined` contains a similar list with additional decoding handled, any scale factor applied (like transforming integer temperature in 1/100 of Celsius to a `float`), and human readable names attached.
  Example:
  `{"ActivePower":261.612,"(ActivePower)":"0B04/050B","Endpoint":21,"LinkQuality":21}`
  In this example, the attribute is `0B04/050B` is rename as `ActivePower`, but the original `0B04/050B` attribute cluster/id is still readable. We can see that the generic `000C/0055 (AnalogValue)` from `lumi.plug.maeu01` is replaced with `0B04/050B (ActivePower)`.


#### Changing Zigbee frame, `zcl_frame` class

The `zcl_frame` represents a low-level ZCL (Zigbee Cluster Library) structure before any decoding or specific processing. You generally prefer to modify a frame later on when attributes or commands are decoded.

class `zcl_frame`:

Attributes (read or write)|Details
:---|:---
`srcendpoint`|`uint8` source endpoint
`dtsendpoint`|`uint8` destination endpoint
`shortaddr`|`uint16` destination short address
`groupadddr`|`uint16` destination multicast group address (if shortaddr is 0xFFFE)
`cluster`|`uint16` cluster number
`cmd`|`uint8` ZCL command number
`cluster_specific`|`flag 0/1` is the command general or cluster specific
`manuf`|`uint16` manufacturer specific number (or 0x0000)
`needs_response`|`flag 0/1` does this frame needs a response
`payload`|`bytes()` bytes of the actual data (use with caution, can be read and changed)
 |The following are rarely used flags
`direct`|`flag 0/1` is the frame to be sent directly only (not routed)
`transactseq`|`uint8` transaction number (read only)
`transactseq_set`|`uint8` transaction number (write only - if you need to change it)

Example:
```berry
frame_received frame_received {'srcendpoint': 21, 'transactseq_set': 0, 'shortaddr': 49596, 'dstendpoint': 1, 'payload': bytes('550039D5787B43'), 'shortaddr_hex': '0xC1BC', 'manuf': 4447, 'payload_ptr': <ptr: 0x3ffd4d04>, 'need_response': 0, 'transactseq': 60, 'cmd': 10, 'direct': 0, 'cluster': 12, 'cluster_specific': 0, 'groupaddr': 0} nil 49596
```

## Compiling Berry

Berry is included if the following is defined in `user_config_override.h`:

```C
#define USE_BERRY
```

Other options that can be changed:

Option|Description
:---|:---
`#define USE_BERRY_PSRAM`|Use PSRAM to allocate memory instead of main RAM. If no PSRAM is connected, this option has no effect.<BR>Enabled by default
`#define USE_BERRY_DEBUG`|Provide additional information in case of a Berry exception, adding line number in the call chain. This feature adds ~8% of memory consumption to Berry compiled code.<BR>Disabled by default
`#define USE_WEBCLIENT`|Enable the `webclient` module allowing to do HTTP requests.<BR>Enabled by default
`#define USE_WEBCLIENT_HTTPS`|Adds support for HTTPS to `webclient`. This feature adds ~45KB of Flash space for TLS support.<BR>Disabled by default
`#define USE_BERRY_WEBCLIENT_USERAGENT  "TasmotaClient"`|Specifies the default `User-Agent` field sent by `webclient`. Can be changed on a per request basis.
`#define USE_BERRY_WEBCLIENT_TIMEOUT  5000`|Specifies the default timeout in millisecond for `webclient`. Can be changed on a per request basis.

## [Berry Cookbook](Berry-Cookbook.md)

Find complete examples and use scenarios of Berry in the [Berry Cookbook](Berry-Cookbook.md)
