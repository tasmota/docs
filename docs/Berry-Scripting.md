# Berry Scripting Language
!!! failure "This feature is experimental, ESP32 only and currently not included in precompiled binaries"

To use it you must [compile your build](Compile-your-build). Add the following to `user_config_override.h`:

```arduino
#define USE_BERRY
```

## Introduction to Berry

Berry is a ultra-lightweight dynamically typed embedded scripting language. It is designed for lower-performance embedded devices. 

https://github.com/Skiars/berry

Berry has the following advantages:

- Lightweight: A well-optimized interpreter with very little resources. Ideal for use in microprocessors.
- Fast: optimized one-pass bytecode compiler and register-based virtual machine.
- Powerful: supports imperative programming, object-oriented programming, functional programming.
- Flexible: Berry is a dynamic type script, and it's intended for embedding in applications. It can provide good dynamic scalability for the host system.
- Simple: simple and natural syntax, support garbage collection, and easy to use FFI (foreign function interface).
- RAM saving: With compile-time object construction, most of the constant objects are stored in read-only code data segments, so the RAM usage of the interpreter is very low when it starts.

## Tasmota port

This version is primarily targeted for ESP32. The RAM usage starts at ~10kb which makes it tight for ESP8266. However, for development purpose, the Berry module does compile on ESP8266, although it is not optimized nor supported (this might change in the future).

The Tasmota integration is far from complete and the following will be added later:

- file system support to save scripts and bytecode
- use of a native Tasmota module (it is currently emulated with a Class)
- LVGL integration
- (much more...)

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

## Examples

### Interactive mode

Initialization:

```
00:00:00.079 BRY: Berry initialized, RAM consumed=14160 (Heap=301040)
```

Use the command `Br` to use interactive mode commands:

```
12:50:56.830 CMD: br 1+1
12:50:56.837 RSL: stat/tasmota_B90B50/RESULT = {"Br":"2"}
12:51:07.880 CMD: br a=3
12:51:07.888 RSL: stat/tasmota_B90B50/RESULT = {"Br":"3"}
12:51:11.430 CMD: br a=a+1
12:51:11.438 RSL: stat/tasmota_B90B50/RESULT = {"Br":"4"}
12:51:15.180 CMD: br b
12:51:15.187 RSL: stat/tasmota_B90B50/RESULT = {"Br":"[syntax_error] input:1: 'b' undeclared (first use in this function)"}
12:51:22.880 CMD: br tasmota.getfreeheap()
12:51:22.887 RSL: stat/tasmota_B90B50/RESULT = {"Br":"230092"}
12:51:32.080 CMD: br log("Hello Tasmota!")
12:51:32.085 Hello Tasmota!
12:51:32.087 RSL: stat/tasmota_B90B50/RESULT = {"Br":"Hello Tasmota!"}
```

## Reference

Below are the Tasmota specific functions and modules implemented on top of Berry.

### Differences with native Berry

The Berry native `print()` function outputs to Hardware Serial and should not be used, except for very specific debug purposes.

#### `log(msg:string [, level:int = 3]) -> string`

Logs a message to the Tasmota console. Optional second argument is log_level (0..4), default is `2` `LOG_LEVEL_INFO`.

Example:

```
12:55:50.949 CMD: br log("a")
12:55:50.954 a

(log_level is 2)
12:56:05.699 CMD: br log("b",3)
12:56:05.706 RSL: stat/tasmota_B90B50/RESULT = {"Br":"3"}
```

#### `load(filename:string) -> int`

Loads a Berry script from the filesystem, and returns an error code; `0` means no error. Filename does not need to start with `/`, but needs to end with `.be` (Berry source code) or `.bec` (precompiled bytecode).

When loading a source file, the precompiled bytecode is saved to filesystem using the `.bec` extension.


#### `save(filename:string, f:closuer) -> nil`

Internally used function to save bytecode. It's a wrapper to the Berry's internal API `be_savecode()`. There is no check made on the filename.

Note: there is generally no need to use this function, it is used internally by `load()`.

### `module tasmota`


Tasmota specific functions are now in the `tasmota` module.
Tasmota automatically imports all modules; i.e. the following commands are done at startup:

```python
import string
import json
import gc
import tasmota
import tasmota as t
```


#### `tasmota.getfreeheap() -> int`

Returns the number of free bytes on the Tasmota heap.

Example:

```
br tasmota.getfreeheap()

20:29:08.758 CMD: br tasmota.getfreeheap()
20:29:08.765 RSL: stat/tasmota_67B1E9/RESULT = {"Br":"25408"}
```

#### `tasmota.publish(topic:string, payload:string[, retain:bool]) -> nil`

Equivalent of `publish` command, publishes a MQTT message on `topic` with `payload`. Optional `retain` parameter.

Example:

```
br tasmota.publish('my_topic','message')

20:28:30.504 CMD: br tasmota.publish('my_topic','message')
20:28:30.510 RSL: my_topic = message
20:28:30.512 RSL: stat/tasmota_67B1E9/RESULT = {"Br":"message"}
```

#### `tasmota.cmd(command:string) -> string`

Sends any command to Tasmota, like it was type in the console. It returns the result of the command if any.

Example:

```
br tasmota.cmd("Dimmer 50")

20:32:19.227 CMD: br tasmota.cmd("Dimmer 50")
20:32:19.235 RSL: stat/tasmota_67B1E9/RESULT = {"POWER":"ON","Dimmer":50,"Color":"808080","HSBColor":"0,0,50","Channel":[50,50,50]}
20:32:19.238 BRY: Error be_top is non zero=1
20:32:19.242 RSL: stat/tasmota_67B1E9/RESULT = {"Br":"{"POWER":"ON","Dimmer":50,"Color":"808080","HSBColor":"0,0,50","Channel":[50,50,50]}"}
```

#### `tasmota.millis([delay:int]) -> int`

Returns the number of milliseconds since last reboot. The optional parameter lets you specify the number of milliseconds in the future; useful for timers.

Example:

```
br tasmota.millis()

20:33:52.671 CMD: br tasmota.millis()
20:33:52.677 RSL: stat/tasmota_67B1E9/RESULT = {"Br":"1207263"}
```

#### `tasmota.timereached(timer:int) -> bool`

Checks whether the timer (in milliseconds) has been reached or not. Always use this function and don't do compares between `millis()` and timers, because of potential sign and overflow issues.

Example:

```
br t = tasmota.millis(5000)

20:36:23.523 CMD: br t = tasmota.millis(5000)
20:36:23.532 RSL: stat/tasmota_67B1E9/RESULT = {"Br":"1363118"}

br tasmota.timereached(t)

20:36:36.806 CMD: br tasmota.timereached(t)
20:36:36.813 RSL: stat/tasmota_67B1E9/RESULT = {"Br":"true"}
```
