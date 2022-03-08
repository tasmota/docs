# Berry Scripting Language :material-cpu-32-bit:

!!! info "If you're new to Berry, have a look at [Berry Introduction (in 20 minutes of less)](Berry-Introduction.md)"

!!! info "Berry Scripting is included in all Tasmota32 builds. It is not supported on ESP82xx"

!!! info "If you plan to code in Berry, you should enable `#define USE_BERRY_DEBUG` which will give you much more details when coding"

<img style="float:right;height:40px" alt="Berry logo" src="../_media/berry/berry.svg">

Useful resources:

- First time user of Berry: [Berry Introduction (in 20 minutes of less)](Berry-Introduction.md)
- Full language documentation [The Berry Script Language Reference Manual](https://github.com/berry-lang/berry/wiki/Reference)
- Tasmota extension of Berry, see below
- Full examples in the [Berry Cookbook](Berry-Cookbook.md)

## Introduction to Berry

Berry is the next generation scripting for Tasmota. It is based on the open-source Berry project, delivering an ultra-lightweight dynamically typed scripting language designed for lower-performance embedded devices. 

[**Github**](https://github.com/Skiars/berry)
[**Manual**](https://github.com/berry-lang/berry/wiki/Reference)

!!! tip "Reference sheet"
    Download [Berry Short Manual](https://github.com/Skiars/berry_doc/releases/download/latest/berry_short_manual.pdf) to get a list of basic functions and capabilities of Berry language
    
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

Berry Scripting in only supported on Tasmota32 for ESP32. The RAM usage starts at ~10kb and will be later optimized. Berry uses PSRAM on ESP32 if available (PSRAM is external RAM attached to Esp32 via SPI, it is slower but larger than internal RAM.

### Quick Start

Click on *Configuration* then *Berry Scripting Console* and enjoy the colorful Berry console, also called REPL (Read-Eval-Print-Loop).

![Berry console](https://user-images.githubusercontent.com/49731213/111880607-c193c800-89ac-11eb-81c9-a3558e26a1de.png)

!!! tip "Drag the bottom corner of each screen to change its size"

The console is not designed for big coding tasks but it's recommended to use a code editor when dealing with many, many lines of code. An extension for Visual Studio Code exists to make writing Berry scripts even easier with colored syntax. Download the entire [folder](https://github.com/berry-lang/berry/tree/master/tools/plugins/vscode/) and copy to VSCode extensions folder.

### REPL Console

Try typing simple commands in the REPL. Since the input can be multi-lines, press ++enter++ twice or click "Run" button to run the code. Use ++arrow-up++ and ++arrow-down++ to navigate through history of previous commands.

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

Note: Berry's native `print()` command displays text in the Berry Console and in the Tasmota logs. To log with finer control, you can also use the `log()` function which will not display in the Berry Console.

```python
> print('Hello Tasmota!')
  log('Hello again')
Hello Tasmota!
```

Meanwhile the Tasmota log shows:
```
> tasmota.cmd("Dimmer 60")
{"POWER":"ON","Dimmer":60,"Color":"996245","HSBColor":"21,55,60","Channel":[60,38,27]}
The light is bright
```

## Lights and Relays

Berry provides complete support for Relays and Lights.

You can control individual Relays or lights with `tasmota.get_power()` and `tasmota.set_power()`.

`tasmota.get_power()` returns an array of booleans representing the state of each relays and light (light comes last).

`tasmota.set_power(relay, onoff)` changes the state of a single relay/light.

!!! example "2 relays and 1 light"

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
ct|`int 153..500`<br>Set the white color temperature in mired, ranging from 153 (cold white) to 500 (warm white)
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
## Rules
The rule function have the general form below where parameters are optional:

```python
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

The same function can be used with multiple triggers.

If the function to process an ADC input should be triggered both by the `tele/SENSOR`
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

**Teleperiod rules**

Teleperiod rules are supported with a different syntax from Tasmota rules. Instead of using `Tele-` prefix, you must use `Tele#`. For example `Tele#ANALOG#Temperature1` instead of `Tele-ANALOG#Temperature1`

## Timers

Berry code, when it is running, blocks the rest of Tasmota. This means that you should not block for too long, or you may encounter problems. As a rule of thumb, try to never block more than 50ms. If you need to wait longer before the next action, use timers. As you will see, timers are very easy to create thanks to Berry's functional nature.

All times are in milliseconds. You can know the current running time in milliseconds since the last boot:

```python
> tasmota.millis()
9977038
```


!!! example "Sending a timer is as easy as `tasmota.set_timer(<delay in ms>,<function>)`"

    ```python
    > def t() print("Booh!") end

    > tasmota.set_timer(5000, t)
    [5 seconds later]
    Booh!
    ```

#### A word on functions and closure

Berry is a functional language, and includes the very powerful concept of a *closure*. In a nutshell, it means that when you create a function, it can capture the values of variables when the function was created. This roughly means that it does what intuitively you would expect it to do.

When using Rules or Timers, you always pass Berry functions.


## Loading Filesystem

You can upload Berry code in the filesystem using the ***Consoles - Manage File system*** menu and load them at runtime. Make careful to use `*.be` extension for those files.

To load a Berry file, use the `load(filename)` function where `filename` is the name of the file with `.be` or `.bec` extension; if the file has no extension '.be' is automatically appended.

!!! note "You don't need to prefix with `/`. A leading `/` will be added automatically if it is not present."

When loading a Berry script, the compiled bytecode is automatically saved to the filesystem, with the extension `.bec` (this is similar to Python's `.py`/`.pyc` mechanism). The `save(filename,closure)` function is used internally to save the bytecode.

If a precompiled bytecode (extension `.bec`) is present of more recent than the Berry source file, the bytecode is directly loaded which is faster than compiling code. You can eventually remove the `*.be` file and keep only `*.bec` file (even with `load("file.be")`.

## Creating a Tasmota Driver

You can easily create a complete Tasmota driver with Berry.

A Driver responds to messages from Tasmota. For each message type, the method with the same name is called. Actually you can register any class as a driver, it does not need to inherit from `Driver`; the call mechanism is based on names of methods that must match the name of the event to be called.

Driver methods are called with the following parameters: `f(cmd, idx, payload, raw)`. `cmd` is a string, `idx` an integer, `payload` a Berry object representation of the JSON in `payload` (if any) or `nil`, `raw` is a string. These parameters are meaninful to a small subset of events:

- `every_second()`: called every second
- `every_50ms()`: called every 50ms (i.e. 20 times per second)
- `every_100ms()`: called every 100ms (i.e. 10 times per second)
- `every_200ms()`: called every 50ms (i.e. 5 times per second)
- `every_250ms()`: called every 50ms (i.e. 4 times per second)
- `web_sensor()`: display sensor information on the Web UI
- `json_append()`: display sensor information in JSON format for TelePeriod reporting
- `web_add_button()`: (deprecated) synonym of `web_add_console_button()`
- `web_add_main_button()`, `web_add_management_button()`, `web_add_console_button()`, `web_add_config_button()`: add a button to Tasmotas Web UI on a specific page
- `web_add_handler()`: called when Tasmota web server started, and the right time to call `webserver.on()` to add handlers
- `button_pressed()`: called when a button is pressed
- `web_sensor()`: send sensor information as JSON or HTML
- `save_before_restart()`: called just before a restart
- `set_power_handler(cmd, idx)`: called whenever a Power command is made. `idx` contains the index of the relay or light. `cmd` can be ignored.
- `display()`: called by display driver with the following subtypes: `init_driver`, `model`, `dim`, `power`.

Then register the driver with `tasmota.add_driver(<driver>)`.

There are basically two ways to respond to an event:

**Example**

Define a class and implement methods with the same name as the events you want to respond to.

```python
class MyDriver
  def every_second()
    # do something
  end
end

d1 = MyDriver()

tasmota.add_driver(d1)
```

## Fast Loop

Beyond the events above, a specific mechanism is available for near-real-time events or fast loops (above 50 times per second).

Special attention is made so that there is no or very little impact on performance. Until a first callback is registered, performance is not impacted and Berry is not called. This protects any current use from any performance impact.

Once a callback is registered, it is called separately from Berry drivers to ensure minimal overhead.

`tasmota.add_fast_loop(cl:function) -> nil` registers a callback to be called in fast loop mode.

The callback is called without any parameter and does not need to return anything. The callback is called at each iteration of Tasmota event loop. The frequency is tightly linked to the `Speed <x>` command. By default, the sleep period is 50ms, hence fast_loop is called every 50ms. You can reduce the time with `Sleep 10` (10ms) hence calling 100 times per second. If you set `Sleep 0`, the callback is called as frequently as possible (discouraged unless you have a good reason).

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

Logs a message to the Tasmota console. Optional second argument is log_level (0..4), default is `2` `LOG_LEVEL_INFO`.

!!! example

    ```
    > log("A")
    A
    ```

#### `load(filename:string) -> bool`

Loads a Berry script from the filesystem, and returns true if loaded successfully, false if file not found, or raises an exception in runtime. Filename does not need to start with `/`, but needs to end with `.be` (Berry source code) or `.bec` (precompiled bytecode).

When loading a source file, the precompiled bytecode is saved to filesystem using the `.bec` extension.

#### `save(filename:string, f:closure) -> nil`

Internally used function to save bytecode. It's a wrapper to the Berry's internal API `be_savecode()`. There is no check made on the filename.

There is generally no need to use this function, it is used internally by `load()`.

### `tasmota` object

A root level object called `tasmota` is created and contains numerous functions to interact with Tasmota.

Tasmota Function|Parameters and details
:---|:---
tasmota.get\_free\_heap<a class="cmnd" id="tasmota_get_free_heap"></a>|`() -> int`<br>Returns the number of free bytes on the Tasmota heap.
tasmota.publish<a class="cmnd" id="tasmota_publish"></a>|`(topic:string, payload:string[, retain:bool, start:int, len:int]) -> nil`<br>_Deprecated_ see `mqtt.publish`
tasmota.publish_result<a class="cmnd" id="tasmota_publish_result"></a>|`(payload:string, subtopic:string) -> nil`<br>Publishes a JSON result and triggers any associated rule. `payload` is expected to be a JSON string, and `subtopic` the subtopic used to publish the payload.
tasmota.cmd<a class="cmnd" id="tasmota_cmd"></a>|`(command:string) -> string`<br>Sends any command to Tasmota, like it was type in the console. It returns the result of the command if any.
tasmota.memory<a class="cmnd" id="tasmota_memory"></a>|`() -> map`<br>Returns memory stats similar to the Information page.<br>Example: `{'iram_free': 41, 'frag': 51, 'program_free': 1856, 'flash': 4096, 'heap_free': 226, 'program': 1679}`<br>or when PSRAM `{'psram_free': 3703, 'flash': 16384, 'program_free': 3008, 'program': 1854, 'psram': 4086, 'frag': 27, 'heap_free': 150}`
tasmota.millis<a class="cmnd" id="tasmota_millis"></a>|`([delay:int]) -> int`<br>Returns the number of milliseconds since last reboot. The optional parameter lets you specify the number of milliseconds in the future; useful for timers.
tasmota.time\_reached<a class="cmnd" id="tasmota_time_reached"></a>|`(timer:int) -> bool`<br>Checks whether the timer (in milliseconds) has been reached or not. Always use this function and don't do compares between `millis()` and timers, because of potential sign and overflow issues.
tasmota.rtc<a class="cmnd" id="tasmota_rtc"></a>|`() -> map`<br>Returns clockwall time with variants.<br>Example: `{'local': 1619560407, 'utc': 1619556807, 'timezone': 60, 'restart': 1619556779}`
tasmota.time\_dump<a class="cmnd" id="tasmota_time_dump"></a>|`(timestamp:int) -> map`<br>Decompose a timestamp value (in seconds) to its components<br>Example: `tasmota.time_dump(1619560407)` -> `{'weekday': 2, 'sec': 27, 'month': 4, 'year': 2021, 'day': 27, 'min': 53, 'hour': 21}`
tasmota.time\_str<a class="cmnd" id="tasmota_time_str"></a>|`(timestamp:int) -> string`<br>Converts a timestamp value (in seconds) to an ISO 8601 string<br>Example: `tasmota.time_str(1619560407)` -> `2021-04-27T21:53:27`
tasmota.strftime<a class="cmnd" id="tasmota_strftime"></a>|`(format:string, timestamp:int) -> string`<br>Converts a timestamp value (in seconds) to a string using the format conversion specifiers<br>Example: `tasmota.strftime("%d %B %Y %H:%M:%S", 1619560407)` -> `27 April 2021 21:53:27`
tasmota.strptime<a class="cmnd" id="tasmota_strptime"></a>|`(time:string, format:string) -> map or nil`<br>Converts a string to a date, according to a time format following the C `strptime` format. Returns a `map` similar to `tasmota.time_dump()` or `nil` if parsing failed. An additional `unparsed` attribute reports the unparsed string, or empty string if everything was parsed.<br>Example: `tasmota.strptime("2001-11-12 18:31:01", "%Y-%m-%d %H:%M:%S")` -> `{'month': 11, 'weekday': 1, 'sec': 1, 'unparsed': '', 'year': 2001, 'day': 12, 'min': 31, 'hour': 18}`
tasmota.yield<a class="cmnd" id="tasmota_yield"></a>|`() -> nil`<br>Calls Arduino framework `yield()` function to give back some time to low-level functions, like Wifi. Prevents WDT watchdog from happening.
tasmota.delay<a class="cmnd" id="tasmota_delay"></a>|`([delay:int]) -> int`<br>Waits and blocks execution for `delay` milliseconds. Should ideally never wait more than 10ms and absolute max 50ms. Otherwise use `set_timer`.
tasmota.add\_rule<a class="cmnd" id="tasmota_add_rule"></a>|`(pattern:string, f:function [, id:any]) ->nil`<br>Adds a rule to the rule engine. See above for rule patterns.<br>Optional `id` to remove selectively rules.
tasmota.remove\_rule<a class="cmnd" id="tasmota_remove_rule"></a>|`(pattern:string [, id:any]) ->nil`<br>Removes a rule to the rule engine. Silently ignores the pattern if no rule matches. Optional `id` to remove selectively some rules.
tasmota.add\_driver<a class="cmnd" id="tasmota_add_driver"></a>|`(instance) ->nil`<br>Registers an instance as a driver
tasmota.remove\_driver<a class="cmnd" id="tasmota_remove_driver"></a>|`(instance) ->nil`<br>Removes a driver
tasmota.gc<a class="cmnd" id="tasmota_gc"></a>|`() -> int`<br>Triggers garbage collection of Berry objects and returns the bytes currently allocated. This is for debug only and shouldn't be normally used. `gc` is otherwise automatically triggered when necessary.

#### Functions used to retrieve Tasmota configuration

Tasmota Function|Parameters and details
:---|:---
tasmota.get\_option<a class="cmnd" id="tasmota_get_option"></a>|`(index:int) -> int`<br>Returns the value of `SetOption <index>`
tasmota.wire\_scan<a class="cmnd" id="tasmota_wire_scan"></a>|`(addr:int [, index:int]) -> wire instance or nil`<br>Scan both I^2^C buses for a device of address addr, optionally taking into account disabled devices via `I2CDevice`. Returns a `wire` object corresponding to the bus where the device is, or `nil` if device is not connected or disabled.
tasmota.i2c\_enabled<a class="cmnd" id="tasmota_i2c_enabled"></a>|`(index:int) -> bool`<br>Returns true if the I^2^C module is enabled, see I^2^C page.
tasmota.arch<a class="cmnd" id="tasmota_arch"></a>|`() -> string`<br>Returns the name of the architecture. Currently can be `esp32`, `esp32s2`, `esp32s3`, `esp32c3`
tasmota.read\_sensors<a class="cmnd" id="tasmota_read_sensors"></a>|`([show_sensor:bool]) -> string`<br>Returns the value of sensors as a JSON string similar to the teleperiod. The response is a string, not a JSON object. The reason is that some sensors might produce invalid JSON. It's your code's responsibility to try parsing as JSON.<br>An optional boolean parameter (false by default) can be set to trigger a display of the new values (i.e. sends a FUNC_SHOW_SENSOR` event to drivers).

#### Functions to create custom Tasmota command

Tasmota Function|Parameters and details
:---|:---
tasmota.add\_cmd<a class="cmnd" id="tasmota_add_cmd"></a>|`(name:string, f:function) -> nil`<br>Adds a command to Tasmota commands. Command names are case-insensitive. Command names are analyzed after native commands and after most commands, so you can't override a native command.
tasmota.resp\_cmnd_str<a class="cmnd" id="tasmota_resp_cmnd_str"></a>|`(message:string) -> nil`<br>Sets the output for the command to `message`.
tasmota.resp\_cmnd\_str\_done<a class="cmnd" id="tasmota_resp_cmnd_done"></a>|`(message:string) -> nil`<br>Sets the output for the command to "Done" (localized message).
tasmota.resp\_cmnd\_str\_error<a class="cmnd" id="tasmota_resp_cmnd_error"></a>|`(message:string) -> nil`<br>Sets the output for the command to "Error" (localized message).
tasmota.resp\_cmnd\_str\_fail<a class="cmnd" id="tasmota_resp_cmnd_fail"></a>|`(message:string) -> nil`<br>Sets the output for the command to "Fail" (localized message).
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
tasmota.get\_power<a class="cmnd" id="tasmota_get_power"></a>|`() -> list[bool]`<br>Returns the state On/Off of each Relay and Light as a list of bool.
tasmota.set\_power<a class="cmnd" id="tasmota_set_power"></a>|`(index:int, onoff:bool) -> bool`<br>Sets the on/off state of a Relay/Light. Returns the previous status of the Relay/Light of `nil` if index is invalid.<br>Example:<br>```> tasmota.get_power()```<br>```[true]```
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
tasmota.settings.sleep<a class="cmnd" id="tasmota_settings_sleep"></a>|Sleep value stored in flash

### `mqtt` module

Use with `import mqtt`.

Tasmota Function|Parameters and details
:---|:---
mqtt.publish<a class="cmnd" id="mqtt_publish"></a>|`(topic:string, payload:string[, retain:bool, start:int, len:int]) -> nil`<br>Equivalent of `publish` command, publishes a MQTT message on `topic` with `payload`. Optional `retain` parameter.<br>`payload` can be a string or a bytes() binary array<br>`start` and `len` allow to specificy a sub-part of the string or bytes buffer, useful when sending only a portion of a larger buffer.
mqtt.subscribe<a class="cmnd" id="mqtt_subscribe"></a>|`(topic:string) -> nil`<br>Subscribe to a `topic` (exact match). Contrary to Tasmota's `Subscribe` command, the topic is sent as-is and not appended with `/#`. You need to add wildcards yourself.
mqtt.unsubscribe<a class="cmnd" id="mqtt_unsubscribe"></a>|`(topic:string) -> nil`<br>Unubscribe to a `topic` (exact match).

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

This module allows to retrieve the GPIO configuration set in the templates. You need to distinguish between **logical gpio** (like PWM, or I2C) and **physical gpio** which represent the GPIO number of the physical pin. `gpio.pin()` transforms a logical GPIO to a physical GPIO, or `-1` if the logical GPIO is not set.

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

Any internal error or using unsupported GPIO yields an Berry exception.

??? note "Possible values for Tasmota GPIOs:"

    `gpio.NONE`, `gpio.KEY1`, `gpio.KEY1_NP`, `gpio.KEY1_INV`, `gpio.KEY1_INV_NP`, `gpio.SWT1`, `gpio.SWT1_NP`, `gpio.REL1`, `gpio.REL1_INV`, `gpio.LED1`, `gpio.LED1_INV`, `gpio.CNTR1`, `gpio.CNTR1_NP`, `gpio.PWM1`, `gpio.PWM1_INV`, `gpio.BUZZER`, `gpio.BUZZER_INV`, `gpio.LEDLNK`, `gpio.LEDLNK_INV`, `gpio.I2C_SCL`, `gpio.I2C_SDA`, `gpio.SPI_MISO`, `gpio.SPI_MOSI`, `gpio.SPI_CLK`, `gpio.SPI_CS`, `gpio.SPI_DC`, `gpio.SSPI_MISO`, `gpio.SSPI_MOSI`, `gpio.SSPI_SCLK`, `gpio.SSPI_CS`, `gpio.SSPI_DC`, `gpio.BACKLIGHT`, `gpio.OLED_RESET`, `gpio.IRSEND`, `gpio.IRRECV`, `gpio.RFSEND`, `gpio.RFRECV`, `gpio.DHT11`, `gpio.DHT22`, `gpio.SI7021`, `gpio.DHT11_OUT`, `gpio.DSB`, `gpio.DSB_OUT`, `gpio.WS2812`, `gpio.MHZ_TXD`, `gpio.MHZ_RXD`, `gpio.PZEM0XX_TX`, `gpio.PZEM004_RX`, `gpio.PZEM016_RX`, `gpio.PZEM017_RX`, `gpio.SAIR_TX`, `gpio.SAIR_RX`, `gpio.PMS5003_TX`, `gpio.PMS5003_RX`, `gpio.SDS0X1_TX`, `gpio.SDS0X1_RX`, `gpio.SBR_TX`, `gpio.SBR_RX`, `gpio.SR04_TRIG`, `gpio.SR04_ECHO`, `gpio.SDM120_TX`, `gpio.SDM120_RX`, `gpio.SDM630_TX`, `gpio.SDM630_RX`, `gpio.TM1638CLK`, `gpio.TM1638DIO`, `gpio.TM1638STB`, `gpio.MP3_DFR562`, `gpio.HX711_SCK`, `gpio.HX711_DAT`, `gpio.TX2X_TXD_BLACK`, `gpio.TUYA_TX`, `gpio.TUYA_RX`, `gpio.MGC3130_XFER`, `gpio.MGC3130_RESET`, `gpio.RF_SENSOR`, `gpio.AZ_TXD`, `gpio.AZ_RXD`, `gpio.MAX31855CS`, `gpio.MAX31855CLK`, `gpio.MAX31855DO`, `gpio.NRG_SEL`, `gpio.NRG_SEL_INV`, `gpio.NRG_CF1`, `gpio.HLW_CF`, `gpio.HJL_CF`, `gpio.MCP39F5_TX`, `gpio.MCP39F5_RX`, `gpio.MCP39F5_RST`, `gpio.PN532_TXD`, `gpio.PN532_RXD`, `gpio.SM16716_CLK`, `gpio.SM16716_DAT`, `gpio.SM16716_SEL`, `gpio.DI`, `gpio.DCKI`, `gpio.CSE7766_TX`, `gpio.CSE7766_RX`, `gpio.ARIRFRCV`, `gpio.ARIRFSEL`, `gpio.TXD`, `gpio.RXD`, `gpio.ROT1A`, `gpio.ROT1B`, `gpio.ADC_JOY`, `gpio.SSPI_MAX31865_CS1`, `gpio.HRE_CLOCK`, `gpio.HRE_DATA`, `gpio.ADE7953_IRQ`, `gpio.SOLAXX1_TX`, `gpio.SOLAXX1_RX`, `gpio.ZIGBEE_TX`, `gpio.ZIGBEE_RX`, `gpio.RDM6300_RX`, `gpio.IBEACON_TX`, `gpio.IBEACON_RX`, `gpio.A4988_DIR`, `gpio.A4988_STP`, `gpio.A4988_ENA`, `gpio.A4988_MS1`, `gpio.OUTPUT_HI`, `gpio.OUTPUT_LO`, `gpio.DDS2382_TX`, `gpio.DDS2382_RX`, `gpio.DDSU666_TX`, `gpio.DDSU666_RX`, `gpio.SM2135_CLK`, `gpio.SM2135_DAT`, `gpio.DEEPSLEEP`, `gpio.EXS_ENABLE`, `gpio.TASMOTACLIENT_TXD`, `gpio.TASMOTACLIENT_RXD`, `gpio.TASMOTACLIENT_RST`, `gpio.TASMOTACLIENT_RST_INV`, `gpio.HPMA_RX`, `gpio.HPMA_TX`, `gpio.GPS_RX`, `gpio.GPS_TX`, `gpio.HM10_RX`, `gpio.HM10_TX`, `gpio.LE01MR_RX`, `gpio.LE01MR_TX`, `gpio.CC1101_GDO0`, `gpio.CC1101_GDO2`, `gpio.HRXL_RX`, `gpio.ELECTRIQ_MOODL_TX`, `gpio.AS3935`, `gpio.ADC_INPUT`, `gpio.ADC_TEMP`, `gpio.ADC_LIGHT`, `gpio.ADC_BUTTON`, `gpio.ADC_BUTTON_INV`, `gpio.ADC_RANGE`, `gpio.ADC_CT_POWER`, `gpio.WEBCAM_PWDN`, `gpio.WEBCAM_RESET`, `gpio.WEBCAM_XCLK`, `gpio.WEBCAM_SIOD`, `gpio.WEBCAM_SIOC`, `gpio.WEBCAM_DATA`, `gpio.WEBCAM_VSYNC`, `gpio.WEBCAM_HREF`, `gpio.WEBCAM_PCLK`, `gpio.WEBCAM_PSCLK`, `gpio.WEBCAM_HSD`, `gpio.WEBCAM_PSRCS`, `gpio.BOILER_OT_RX`, `gpio.BOILER_OT_TX`, `gpio.WINDMETER_SPEED`, `gpio.KEY1_TC`, `gpio.BL0940_RX`, `gpio.TCP_TX`, `gpio.TCP_RX`, `gpio.ETH_PHY_POWER`, `gpio.ETH_PHY_MDC`, `gpio.ETH_PHY_MDIO`, `gpio.TELEINFO_RX`, `gpio.TELEINFO_ENABLE`, `gpio.LMT01`, `gpio.IEM3000_TX`, `gpio.IEM3000_RX`, `gpio.ZIGBEE_RST`, `gpio.DYP_RX`, `gpio.MIEL_HVAC_TX`, `gpio.MIEL_HVAC_RX`, `gpio.WE517_TX`, `gpio.WE517_RX`, `gpio.AS608_TX`, `gpio.AS608_RX`, `gpio.SHELLY_DIMMER_BOOT0`, `gpio.SHELLY_DIMMER_RST_INV`, `gpio.RC522_RST`, `gpio.P9813_CLK`, `gpio.P9813_DAT`, `gpio.OPTION_A`, `gpio.FTC532`, `gpio.RC522_CS`, `gpio.NRF24_CS`, `gpio.NRF24_DC`, `gpio.ILI9341_CS`, `gpio.ILI9341_DC`, `gpio.ILI9488_CS`, `gpio.EPAPER29_CS`, `gpio.EPAPER42_CS`, `gpio.SSD1351_CS`, `gpio.RA8876_CS`, `gpio.ST7789_CS`, `gpio.ST7789_DC`, `gpio.SSD1331_CS`, `gpio.SSD1331_DC`, `gpio.SDCARD_CS`, `gpio.ROT1A_NP`, `gpio.ROT1B_NP`, `gpio.ADC_PH`, `gpio.BS814_CLK`, `gpio.BS814_DAT`, `gpio.WIEGAND_D0`, `gpio.WIEGAND_D1`, `gpio.NEOPOOL_TX`, `gpio.NEOPOOL_RX`, `gpio.SDM72_TX`, `gpio.SDM72_RX`, `gpio.TM1637CLK`, `gpio.TM1637DIO`, `gpio.PROJECTOR_CTRL_TX`, `gpio.PROJECTOR_CTRL_RX`, `gpio.SSD1351_DC`, `gpio.XPT2046_CS`, `gpio.CSE7761_TX`, `gpio.CSE7761_RX`, `gpio.VL53L0X_XSHUT1`, `gpio.MAX7219CLK`, `gpio.MAX7219DIN`, `gpio.MAX7219CS`, `gpio.TFMINIPLUS_TX`, `gpio.TFMINIPLUS_RX`, `gpio.ZEROCROSS`, `gpio.HALLEFFECT`, `gpio.EPD_DATA`, `gpio.INPUT`, `gpio.SENSOR_END`


### H-bridge support

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
    Function returns closes voltage found. In this case its 1255 for setting to 1250.

### I2S

DAC can also be used via `Esp8266Audio` through the ESP32 I2S -> DAC bridge.

??? example
    ```python
    class MP3_Player : Driver
      var audio_output, audio_mp3
      def init()
        self.audio_output = AudioOutputI2S(
          gpio.pin(gpio.I2S_OUT_CLK),
          gpio.pin(gpio.I2S_OUT_SLCT),
          gpio.pin(gpio.I2S_OUT_DATA),
          0,    #- I2S port -#
          64)    #- number of DMA buffers of 64 bytes each, this is the value required since we update every 50ms -#
        self.audio_mp3 = AudioGeneratorMP3()
      end

      def play(mp3_fname)
        if self.audio_mp3.isrunning()
          self.audio_mp3.stop()
        end
        var audio_file = AudioFileSourceFS(mp3_fname)
        self.audio_mp3.begin(audio_file, self.audio_output)
        self.audio_mp3.loop()    #- start playing now -#
      end

      def every_50ms()
        if self.audio_mp3.isrunning()
          self.audio_mp3.loop()
        end
      end
    end

    mp3_player = MP3_Player()
    tasmota.add_driver(mp3_player)

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

List of `energy` attributes that you can read or write:

Attribute|Type|Description
:---|:---|:---
voltage<br>voltage\_2<br>voltage\_3|float|Voltage (V) for main phase or 3 phases
current<br>current\_2<br>current\_3|float|Current (A) for main phase or 3 phases
active\_power<br>active\_power\_2<br>active\_power\_3|float|Active Power (W) for main phase or 3 phases
reactive\_power<br>reactive\_power\_2<br>reactive\_power\_3|float|Reactive Power (W) for main phase or 3 phases
power\_factor<br>power\_factor_2<br>power\_factor\_3|float|Power Factor (no unit) for main phase or 3 phases
frequency<br>frequency\_2<br>frequency\_3|float|Frequency (Hz) for main phase or 3 phases
export\_active<br>export\_active\_2<br>export\_active\_3|float|(kWh)
start\_energy|float|Total previous energy (kWh)
daily|float|Daily energy (kWh)
total|float|Total energy (kWh)
today\_delta\_kwh|uint32|(deca milli Watt hours)<br>5764 = 0.05764 kWh = 0.058 kWh
today\_offset\_kwh|uint32|(deca milli Watt hours)
today\_kwh|uint32|(deca milli Watt hours)
period|uint32|(deca milli Watt hours)
fifth\_second|uint8|
command\_code|uint8|
data\_valid<br>data\_valid\_2<br>data\_valid\_3|uint8|
phase\_count|uint8|Number of phases (1,2 or 3)
voltage\_common|bool|Use single voltage
frequency\_common|bool|Use single frequency
use\_overtemp|bool|Use global temperature as overtemp trigger on internal energy monitor hardware
today\_offset\_init\_kwh|bool|
voltage\_available|bool|Enable if voltage is measured
current\_available|bool|Enable if current is measured
type\_dc|bool|
power\_on|bool|
|||**Below if for Energy Margin Detection**
power\_history\_0<br>power\_history\_0\_2<br>power\_history\_0\_3<br>power\_history\_1<br>power\_history\_1\_2<br>power\_history\_1\_3<br>power\_history\_2<br>power\_history\_2\_2<br>power\_history\_2\_3|uint16|
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
bus<a class="cmnd" id="wire_bus">|`read only attribute, 1 or 2`<br>Bus number for this wire instance.
enabled<a class="cmnd" id="wire_enabled">|`() -> bool`<br>Returns `true` is the I2C bus is initialized (i.e. GPIOs are defined)
scan<a class="cmnd" id="wire_scan">|`() -> array of int`<br>Scan the bus and return all responding addresses. Note: addresses are displayed as decimal ints, not hex.
scan<a class="cmnd" id="wire_scan">|`() -> array of int`<br>Scan the bus and return all responding addresses. Note: addresses are displayed as decimal ints, not hex.
detect<a class="cmnd" id="wire_detect">|`(addr:int) -> bool`<br>Returns `true` if the device of address `addr` is connected to this bus.
read<a class="cmnd" id="wire_read">|`(addr:int, reg:int, size:int) -> int or nil`<br>Read a value of 1..4 bytes from address `addr` and register `reg`. Returns `nil` if no response.
write<a class="cmnd" id="wire_write">|`(addr:int, reg:int, val:int, size:int) -> bool`<br>Writes a value of 1..4 bytes to address `addr`, register `reg` with value `val`. Returns `true` if successful, `false` if not.
read\_bytes<a class="cmnd" id="wire_read_bytes">|`(addr:int, reg:int ,size:int) -> instance of bytes()`<br>Reads a sequence of `size` bytes from address `addr` register `reg`. Result is a `bytes()` instance or `bytes()` if not successful.`
write\_bytes<a class="cmnd" id="wire_write_bytes">|`(addr:int, reg:int, val:bytes) -> nil`<br>Writes the `val` bytes sequence as `bytes()` to address `addr` register `reg`.

Low-level commands if you need finer control:

Wire Function|Parameters and details
:---|:---
\_begin\_transmission<a class="cmnd" id="wire_begin_transmission">|`(address:int) -> nil`
\_end\_transmission<a class="cmnd" id="wire_end_transmission">|`([stop:bool]) -> nil`<br>Send stop if `stop` is `true`.
\_request\_from<a class="cmnd" id="wire_request_from">|`(addr:int, size:int [stop:bool = true]) -> nil`
\_available<a class="cmnd" id="wire_available">|`() -> bool`
\_read<a class="cmnd" id="wire_read">|`read() -> int`<br>Reads a single byte.
\_write<a class="cmnd" id="wire_write">|`(value:int or s:string) -> nil`<br>Sends either single byte or an arbitrary string.

### `path` module

A simplified version of `os.path` module of standard Berry which is disabled in Tasmota because we don't have a full OS.
  
Tasmota Function|Parameters and details
:---|:---
path.exists<a class="cmnd" id="path_exists"></a>|`(file_name:string) -> bool`<br>Returns `true` if the file exists. You don't need to prefix with `/`, as it will automatically be added if the file does not start with `/`
path.last_modified<a class="cmnd" id="path_last_modified"></a>|`(file_name:string) -> int`<br>Returns the timestamp when the file was last modified, or `nil` if the file does not exist. You don't need to prefix with `/`, as it will automatically be added if the file does not start with `/`
path.listdir<a class="cmnd" id="path_listdir"></a>|`(dir_name:string) -> list(string)`<br>List a directory, typically root dir `"/"` and returns a list of filenames in the directory. Returns an empty list if the directory is invalid
path.remove<a class="cmnd" id="path_remove"></a>|`(file_name:string) -> bool`<br>Deletes a file by name, return `true` if successful

### `persist` module

Easy way to persist simple values in Berry and read/write any attribute. Values are written in JSON format in `_persist.json` file.

!!! example 
     > import persist    
     > persist.a = 1    
     > persist.b = "foobar"    
     > print(persist)    
     <instance: Persist({'a': 1, 'b': 'foobar'})>    
     > persist.save()   # save to _persist.json    

Tasmota Function|Parameters and details
:---|:---
persist.save<a class="cmnd" id="persist_save"></a>|`()`<br>triggers saving to file system. It is called automatically before a restart but you might want to call it yourself to prevent losing data in case of power loss or crash. `persist.save()` writes to flash, so be careful of not calling it too often, or it will cause wearing of flash and reduce its lifetime.
persist.has<a class="cmnd" id="persist_has"></a>|`(param:string) -> bool`<br>returns true or false if the key exists
persist.remove<a class="cmnd" id="persist_remove"></a>|`(param:string) -> bool`<br>removes a key or ignores if key doesn't exist
persist.find<a class="cmnd" id="persist_find"></a>|`my_param:string [, "default value"] -> string | bool`<br>returns the value for a key, or nil or the default value. Similar to `map.find`

### `introspect` module

Allows to do introspection on instances and modules, to programmatically list attributes, set and get them.

```python
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
introspect.vcall<a class="cmnd" id="introspect_vcall"></a>|`(function, [args,]* [list]?) -> any`<br>Calls a function with a dynamically built list of arguments. If the last argument is a list, it is expanded into individual arguments.

### `webclient` class
  
Class `webclient` provides an implementation of an HTTP/HTTPS web client and make requests on the LAN or over the Internet.

Features:

 - Support HTTP and HTTPS requests to IPv4 addresses and domain names, to arbitrary ports, via a full URL.
 - Support for HTTPS and TLS via BearSSL (which is much lighter than default mbetTLS)
 - HTTPS (TLS) only supports cipher ECDHE_RSA_WITH_AES_128_GCM_SHA256 which is both secure and widely supported
 - Support for URL redirections (tbc)
 - Ability to set custom User-Agent
 - Ability to set custom headers
 - Ability to set Authentication header
 - Support for Chunked encoding response (so works well with Tasmota devices)

The current implementation is based on a fork of Arduino's HttpClient customized to use BearSSL

Current limitations (if you need extra features please open a feature request on GitHub):

 - Only supports text responses (html, json...) but not binary content yet (no NULL char allowed)
 - Maximum response size is 32KB, requests are dropped if larger
 - HTTPS (TLS) is in 'insecure' mode and does not check the server's certificate; it is subject to Man-in-the-Middle attack
 - No access to response headers
 - No support for compressed response

 
!!! example
 
    ``` python
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
 
    ``` python
    > cl = webclient()
    > cl.begin("https://raw.githubusercontent.com/tasmota/autoconf/main/esp32/M5Stack_Fire_autoconf.zip")
    <instance: webclient()>

    > r = cl.GET()
    > print(r)
    200

    > cl.write_file("M5Stack_Fire_autoconf.zip")
    950
    ```


Main functions:

WebClient Function|Parameters and details
:---|:---
begin<a class="cmnd" id="wc_begin">|`(url:string) -> self`<br>Set the complete URL, including protocol (`http` or `https`), IPv4 or domain name, port... This should be the first call. The connection is not established at this point.
GET<a class="cmnd" id="wc_get">|`() -> result_code:int`<br>Establish a connection to server, send GET request and wait for response header.<BR>Returns the HTTP result code or an error code if negative, `200` means OK.
POST<a class="cmnd" id="wc_post">|`(payload:string or bytes) -> result_code:string`<br>Establish a connection to server, send POST request with payload and wait for response header.<BR>Returns the HTTP result code or an error code if negative, `200` means OK.
read<a class="cmnd" id="wire_read">|`(addr:int, reg:int, size:int) -> int or nil`<br>Read a value of 1..4 bytes from address `addr` and register `reg`. Returns `nil` if no response.
get\_size<a class="cmnd" id="wc_get_string">|`() -> int`<br>Once a connection succeeded (GET or POST), reads the size of the response as returned by the server in headers (before actually reading the content). A value `-1` means that the response size is unknown until you read it.
get\_string<a class="cmnd" id="wc_get_string">|`() -> string`<br>Once a connection succeeded (GET or POST), reads the content of the response in a string. The response max size is 32KB, any response larger is dropped. Connection is closed and resources are freed after this call completes.
close<a class="cmnd" id="wc_close">|`() -> nil`<br>Closes the connection and frees buffers. `close` can be called after `GET` or `POST` and is implicitly called by `get_string`. You don't usually need to use `close` unless you are only retrieving the result_code for a request and not interested in the content.
write\_file<a class="cmnd" id="wc_write_file">|`(file_name:string) -> int`<br>Downloads the binary content of the resource and stores it on the file system. Returns the number of bytes downloaded or -1 if an error occured

Request customization:

webclient Function|Parameters and details
:---|:---
add\_header<a class="cmnd" id="wc_add_header">|`(name:string, value:string [, first:bool=false [, replace:bool=true]]) -> nil`<br>Sets an arbitrary header for `name`:`value`.<BR>`first` moves the header in the first place, `replace` replaces a header with the same name or adds one line if false.
set\_timeouts<a class="cmnd" id="wc_set_timeouts">|`(req_timeout:int [, tcp_timeout:int]) -> self`<br>Sets the request timeout in ms and optionally the TCP connection timeout in ms.
set\_useragent<a class="cmnd" id="wc_set_useragent">|`(useragent:string) -> self`<br>Sets the User-Agent header used in request.
set\_auth<a class="cmnd" id="wc_set_auth">|`(auth:string) or (user:string, password:string) -> self`<br>Sets the authentication header, either using pre-encoded string, or standard user/password encoding.

### `webserver` module
  
Module `webserver` provides functions to enrich Tasmota's Web UI. It is tightly linked to Tasmota page layout.

Functions used to add UI elements like buttons to Tasmota pages, and analyze the current request. See above `Driver` to add buttons to Tasmota UI.

General Function|Parameters and details
:---|:---
arg_size<a class="cmnd" id="ws_arg_size">|`() -> int`<br>Returns the number of arguments in the request
arg<a class="cmnd" id="ws_arg">|`(arg_name:string or arg_index:int): -> string`<br>Returns the value of the argument either by name or by position number [0..arg_size()-1]. If an argument has multiple values, you need to iterate using ints to get all values
arg_name<a class="cmnd" id="ws_arg_name">|`(arg_index:int) -> string`<br>Returns the name of argument by index [0..arg_size()-1]
has_arg<a class="cmnd" id="ws_has_arg">|`(arg_name:string): -> bool`<br>Checks if an argument with this name exists
check_privileged_access<a class="cmnd" id="ws_check_privileged_access">|`() -> bool`<br>Returns `true` if the page needs privileged access
content_send<a class="cmnd" id="ws_content_send">|`(string) -> nil`<br>Sends the HTML content to the client. Tasmota uses Chunked encoding, which means than the content is regularly sent to the client and not buffered in Tasmota's memory
content_button<a class="cmnd" id="ws_content_button">|`([button:int]) -> nil`<br>Displays a standard button by code, using Tasmota localization. Possible values are `webserver.BUTTON_CONFIGURATION`, `webserver.BUTTON_INFORMATION`, `webserver.BUTTON_MAIN`, `webserver.BUTTON_MANAGEMENT`, `webserver.BUTTON_MODULE`. Default is `webserver.BUTTON_MAIN`.

Low-level functions if you want to display custom pages and content:

General Function|Parameters and details
:---|:---
on<a class="cmnd" id="ws_on">|`(prefix:string, callback:closure [, method:int]) -> nil`<br>Attaches a handler (any closure or function) to a prefix. An optional `method` argument (defaults to `webserver.HTTP_ANY` specifies the HTTP methods to be received (ANY, GET, POST, OPTIONS, POST)<BR>WARNING - this should be called only when receiving `web_add_handler` event. If called before the WebServer is set up and Wi-Fi on, it will crash. For debug purpose, it can be called later when you are sure that Wi-Fi or Ethernet is up.
state<a class="cmnd" id="wc_set_useragent">|`() -> int`<br>Returns the internal state of Tasmota web server. Possible values are `webserver.HTTP_OFF`, `webserver.HTTP_USER`, `webserver.HTTP_ADMIN`, `webserver.HTTP_MANAGER`, `webserver.HTTP_MANAGER_RESET_ONLY`.
content_start<a class="cmnd" id="ws_content_start">|`() -> nil`<br>Start response page
content_send_style<a class="cmnd" id="ws_content_send_style">|`() -> nil`<br>Sends the standard Tasmota style
content_flush<a class="cmnd" id="ws_content_flush">|`() -> nil`<br>Flush the buffer and send any buffered content to the client
content_stop<a class="cmnd" id="ws_content_stop">|`() -> nil`<br>End of the response, closes the connection

Module `webserver` also defines the following constants:

- Tasmota's web server states: `webserver.HTTP_OFF`, `webserver.HTTP_USER`, `webserver.HTTP_ADMIN`, `webserver.HTTP_MANAGER`, `webserver.HTTP_MANAGER_RESET_ONLY`
- Tasmota's pages: `webserver.BUTTON_CONFIGURATION`, `webserver.BUTTON_INFORMATION`, `webserver.BUTTON_MAIN`, `webserver.BUTTON_MANAGEMENT`, `webserver.BUTTON_MODULE`
- Methods received by handler: `webserver.HTTP_ANY`, `webserver.HTTP_GET`, `webserver.HTTP_OPTIONS`, `webserver.HTTP_POST`

See the [Berry Cookbook](Berry-Cookbook.md) for examples.

### `tcpclient` class

Simple tcp client supporting string and binary transfers:

- create an instance of the client with `var tcp = tcpclient()`
- connect to the server `tcp.connect(address:string, port:int [, timeout_ms:int]) -> bool` Address can be numerical IPv4 or domain name. Returns `true` if the connection succeeded. Optional `timeout` in milliseconds. The default timeout is `USE_BERRY_WEBCLIENT_TIMEOUT` (2 seconds).
- check if the socket is connected with `tcp.connected()`
- send content with `tcp.write(content:string or bytes) -> int`. Accepts either a string or a bytes buffer, returns the number of bytes sent. It's you responsibility to resend the missing bytes
- check if bytes are available for reading `tcp.available() -> int`. Returns `0` if nothing was received. This is the call you should make in loops for polling.
- read incoming content as string `tcp.read() -> string` or as bytes `tcp.readbytes() -> bytes`. It is best to call `tcp.available()` first to avoid creating empty response objects when not needed
- close the socket with `tcp.close()`


tcpclient Function|Parameters and details
:---|:---
connect<a class="cmnd" id="tcpclient_connect">|`connect(address:string, port:int [, timeout_ms:int]) -> bool`<BR>Connect to `addr:port` with optional timeout in milliseconds (default 2s).<BR>Returns `true` if connection was successful, the call is blocking until the connection succeeded to the timeout expired.
connected<a class="cmnd" id="tcpclient_connected">|`connected() -> bool`<BR>Returns `true` if the connection was successful and is still valid (not dropped by server or closed by client)
close<a class="cmnd" id="tcpclient_close">|`close() -> nil`<BR>Drops the current connection.
write<a class="cmnd" id="tcpclient_write">|`content:string or bytes) -> int`<BR>Accepts either a string or a bytes buffer, returns the number of bytes sent. It's you responsibility to resend the missing bytes.<BR>Returns `0` if something went wrong.
available<a class="cmnd" id="tcpclient_close">|`available() -> int`<BR>Returns the number of bytes received in buffer and ready to be read.
read<a class="cmnd" id="tcpclient_read">|`read([max_len:int]) -> string`<BR>Returns all the bytes received in Rx buffer as `string`.<br>Optional `max_len` parameter limits the number of characters returned, or read as much as possible by default.
readbytes<a class="cmnd" id="tcpclient_read">|`read([max_bytes:int]) -> bytes()`<BR>Returns all the bytes received in Rx buffer as `bytes()`.<br>Optional `max_bytes` parameter limits the number of bytes returned, or read as much as possible by default.
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

### `udp` class
  
Class `udp` provides ability to send and received UDP packets, including multicast addresses.

You need to create an object of class `udp`. Such object can send packets and listen to local ports. If you don't specify a local port, the client will take a random source port. Otherwise the local port is used as source port.

When creating a local port, you need to use `udp->begin(<ip>, <port)>`. If `<ip>` is empty string `""` then the port is open on all interfaces (wifi and ethernet).

General Function|Parameters and details
:---|:---
udp()<a class="cmnd" id="udp_ctor">|`udp() -> <instance udp>`<br>Creates an instance of `udp` class.
begin<a class="cmnd" id="udp_begin">|`begin(ip:string, port:int) -> bool`<BR>Create a UDP listener and sender on interface `ip` and `port`. If `ip` is an empty string, the listener connects to all interfaces (aka 0.0.0.0)<BR>Returns `true` if successful.
begin_multicast<a class="cmnd" id="udp_begin_mcast">|`begin(ip:string, port:int) -> bool`<BR>Create a UDP listener and sender on interface `ip` and `port`. `ip` must be a multicast address.<BR>Returns `true` if successful.
send<a class="cmnd" id="udp_send">|`send(addr:string, port:int, payload:bytes) -> bool`<BR>Sends a packet to address `addr`, port `port` and message as `bytes()` buffer.<BR>Returns `true` if successful.
send_multicast<a class="cmnd" id="udp_send_mcast">|`send(payload:bytes) -> bool`<BR>Sends a payload as `bytes()` buffer to the multicast address. `begin_multicast()` must have been previously called.<BR>Returns `true` if successful.
read<a class="cmnd" id="udp_read">|`read() -> bytes() or nil`<BR>Reads any received udp packet as bytes() buffer, or `nil` if no packet was received.
remote_ip<a class="cmnd" id="udp_remote_ip">|`remote_ip (string or nil)`<BR>Instance variable containing the remote ip (as string) from the last successful `read()` command.
remote_port<a class="cmnd" id="udp_remote_port">|`remote_port (int or nil)`<BR>Instance variable containing the remote port (as int) from the last successful `read()` command.

#### Sending udp packets

``` ruby
> u = udp()
> u.begin("", 2000)    # listen on all interfaces, port 2000
true
> u.send("192.168.1.10", 2000, bytes("414243"))   # send 'ABC' to 192.168.1.10:2000, source port is 2000
true
```

#### Receive udp packets

You need to do polling on `udp->read()`. If no packet was received, the call immediately returns `nil`.

``` ruby
> u = udp()
> u.begin("", 2000)    # listen on all interfaces, port 2000
true
> u.read()     # if no packet received, returns `nil`
>

> u.read()     # if no packet received, returns `nil`
bytes("414243")    # received packet as `bytes()`
```

#### Send and receive multicast

``` ruby
> u = udp()
> u.begin_multicast("224.3.0.1", 3000)    # connect to multicast 224.3.0.1:3000 on all interfaces
true

> client.send_multicast(bytes("33303030"))

> u.read()     # if no packet received, returns `nil`
> u.read()
bytes("414243")    # received packet as `bytes()`
```

### Adressable leds (WS2812, SK6812)

There is native support for adressable leds via NeoPixelBus, with support for animations. Currently supported: WS2812, SK6812.

Details are in [Berry leds](Berry_leds.md)

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
serial (constructor)<a class="cmnd" id="serial"></a>|`serial(gpio_rx:int, gpio_tx:int, baud:int [, mode:int])`<br>Creates a `serial` object<br>`gpio_rx` receive GPIO (or -1 if transmit only)<br>`gpio_tx` transmit GPIO (or -1 if receive only)<br>`baud` speed, ex: 9600, 115200<br>`mode` serial message format, default is `serial.SERIAL_8N1` (8 bits, no parity, 1 stop bit).<br>Other mode values are described below.
write<a class="cmnd" id="serial_write"></a>|`write(val:int || bytes()) -> bytes_sent:int`<br>Send either a single byte if argument is int, or send a binary message from a `bytes()` object.<br>The methods blocks until all messages are sent to the UART hardware buffer; they may not all have been sent over the wire
read<a class="cmnd" id="serial_read"></a>|`read(void) -> bytes()`<br>Read all bytes received in the incoming buffer. If the buffer is empty, returns an empty `bytes()` object
flush<a class="cmnd" id="serial_flush"></a>|`flush(void) -> void`<br>Flushes all buffers. Waits for all outgoing messages to be sent over the wire and clear the incoming buffer.
available<a class="cmnd" id="serial_available"></a>|`available(void) -> int`<br>Returns the number of incoming bytes in the incoming buffer, `0` in none.

Supported serial message formats: `SERIAL_5N1`, `SERIAL_6N1`, `SERIAL_7N1`, `SERIAL_8N1`, `SERIAL_5N2`, `SERIAL_6N2`, `SERIAL_7N2`, `SERIAL_8N2`, `SERIAL_5E1`, `SERIAL_6E1`, `SERIAL_7E1`, `SERIAL_8E1`, `SERIAL_5E2`, `SERIAL_6E2`, `SERIAL_7E2`, `SERIAL_8E2`, `SERIAL_5O1`, `SERIAL_6O1`, `SERIAL_7O1`, `SERIAL_8O1`, `SERIAL_5O2`, `SERIAL_6O2`, `SERIAL_7O2`, `SERIAL_8O2`

### `display` module

The `display` module provides a simple API to initialize the Universal Display Driver with data provided as a string. It is used by `autoconf` mechanism.

Tasmota Function|Parameters and details
:---|:---
start<a class="cmnd" id="display_start"></a>|`display.start(displayini:string) -> nil`<br>Initializes the Universal Display Driver with the string provided as argument, similar to content in `display.ini`. It is typically read from a file in the file-system.
started<a class="cmnd" id="display_started"></a>|`display.started() -> bool`<br>Returns `true` if display is already initialized, `false` if not started.
dimmer<a class="cmnd" id="display_dimmer"></a>|`display.started([dim:int]) -> int`<BR>Sets the dimmer of display, value 0..100. If `0` then turn off display. If no arg, read the current value.
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

## Compiling Berry

Berry is included if the following is defined in `user_config_override.h`:

```arduino
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
