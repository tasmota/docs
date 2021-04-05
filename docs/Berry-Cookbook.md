# Berry Cookbook

## Adding commands to Tasmota

It is very easy to dynamically add a command to Tasmota with Berry.

### Trivial example

Let's start with the most simple command.

Let's define a command `BrGC` that triggers a garbage collection and returns the memory allocated by Berry. We first define the function:

```python
def br_gc()
  var allocated = tasmota.gc()    #- trigger gc and return allocated memory -#
  import string
  tasmota.resp_cmnd(string.format('{"BrGc":%i}', allocated))
end
```

And register the function:

```python
tasmota.add_cmd('BrGc', br_gc)
```

Then in Tasmota Console:

```yaml
brgc

21:04:30.369 CMD: brgc
21:04:30.376 RSL: stat/tasmota_923B34/RESULT = {"BrGc":5767}
```

### General form of the custom command function

The custom command function have the general form below where parameters are optionals:

```python
def function_name(cmd, idx, payload, payload_json)
  ...
end
```

Parameter|Description
:---|:---
`cmd`|`string` name of the command in lower case. Can be used if same function is used for multiple similar commands for example.
`idx`|Command's index is the unsigned `integer` (optionally) added at the end of the command name before the parameters (like `Demo1`). Default to 1 if not specified.
`payload`|`string` of the command line as without any parsing.
`payload_json`|if the payload is a valid JSON, it is converted into a Berry `map` object.

### More complete example

In this example, we will create a new command called `LightGold` that turns the light on and sets it to color gold #FFD700. This command accepts an optional JSON payload with the argument `Dimmer` ranging from 0..100.

First we define a new Berry function with the logic. This function takes 4 arguments:

1. `cmd`: the command name (with same case as it was registered). This is useful if you want to share the same code in multiple commands. Here `cmd` is `LightGold`
2. `idx`: the command index used, default to 1.
3. `payload`: the raw payload of the command as string
4. `payload_json`: the payload parsed as JSON, or `nil` if the payload is not JSON

Example:

- command `lightgold`: `cmd`=`LightGold`, `idx`=1, `payload`=`""`, `payload_json`=`nil`
- command `LIGHTGOLD2`: `cmd`=`LightGold`, `idx`=2, `payload`=`""`, `payload_json`=`nil`
- command `lightgold not sure`: `cmd`=`LightGold`, `idx`=1, `payload`=`'not sure'`, `payload_json`=`nil`
- command `lightgold {"value":"some"}`: `cmd`=`LightGold`, `idx`=1, `payload`=`'{"value":"some"}'`, `payload_json`=`{'value':'some'}`

In Berry, arguments are always optional, so you don't need to define them if you don't need them.

```python
def light_gold(cmd, idx, payload, payload_json)
  var dimmer = 50      #- default brightness to 50% -#
  var bri
  
  # parse payload
  if payload_json != nil && payload_json.find("Dimmer") != nil    # does the payload contain a 'dimmer' field
    dimmer = int(payload_json.find("Dimmer"))
  end

  # set_light expects a brightness in range 0..255
  bri = tasmota.scale_uint(dimmer, 0, 100, 0, 255)
  
  # build the payload for set_light
  var light_payload = {'power':true, 'rgb':'FFD700', 'bri':bri}

  #- set the light values -#
  tasmota.set_light(light_payload)
  
  # report the command as successful
  tasmota.resp_cmnd_done()
end
```

Finally you need to register the command:

```python
tasmota.add_cmd('LightGold', light_gold)
```

Example (in Tasmota console, not Berry console):

```yaml
lightgold

20:53:28.142 CMD: lightgold
20:53:28.151 RSL: stat/tasmota_923B34/RESULT = {"POWER":"ON"}
20:53:28.153 RSL: stat/tasmota_923B34/POWER = ON
20:53:28.160 RSL: stat/tasmota_923B34/RESULT = {"LightGold":"Done"}

lightgold {"Dimmer":20}

20:54:16.837 CMD: lightgold {"Dimmer":20}
20:54:16.848 RSL: stat/tasmota_923B34/RESULT = {"LightGold":"Done"}
```

### Responding to commands

Tasmota expects that you send a response to commands. You can use the following methods:

- `tasmota.resp_cmnd_done()`: report command as `Done` (including trasnlated versions)
- `tasmota.resp_cmnd_error()`: report command as `Error`
- `tasmota.resp_cmnd_failed()`: report command as `Failed`
- `tasmota.resp_cmnd_str(<msg>)`: report an arbitrary string
- `tasmota.resp_cmd(<json>)`: report a custom JSON message (not prefixed by command name).


## Creating a Tasmota driver

You can easily create a complete Tasmota driver with Berry.

As a convenience, a skeleton class `Driver` is provided. A Driver responds to messages from Tasmota. For each message type, the method with the same name is called.

- `every_second()`: called every second
- `every_100ms()`: called every 100ms (i.e. 10 times per second)
- `web_sensor()`: display sensor information on the Web UI
- `json_append()`: display sensor information in JSON format for TelePeriod reporting
- `web_add_button()`:
- `web_add_main_button()`:
- `save_before_restart()`:
- `button_pressed()`:

Then register the driver with `tasmota.add_driver(<driver>)`.

There are basically two ways to respond to an event:

**Method 1: create a sub-class**

Define a sub-class of the `Driver` class and override methods.

```python
class MyDriver : Driver
  def every_second()
    # do something
  end
end

d1 = MyDriver()

tasmota.add_driver(d1)
```

**Method 2: redefine the attribute with a function**

Just use the `Driver` class and set the attribute to a new function:

```python
d2 = Driver()

d2.every_second = def ()
  # do something
end

tasmota.add_driver(d2)
```

## Creating an I2C driver

Berry Scripting provides all necessary primitves for a complete I2C driver.

### Step by step approach

We will explore the different steps to write an I2C driver, and will take the MPU6886 as an example. The native driver already exists, and we'll rewrite it in Berry code.

**Step 1: detect the device**

I2C device are identified by address, only one device per address is allowed per I2C physical bus. Tasmota32 supports up to 2 I2C buses, using `wire1` or `wire2` objects.

To simplify device detection, we provide the convenience method `tasmota.scan_wire()`. The first argument is the device address (0x68 for MPU6886). The optional second argument is the I2C Tasmota index, allowing to selectively disable some device families. See `I2CDevice` command and page XXX. The index number for MPU6886 is 58.

```python
class MPU6886 : Driver
  var wire     # contains the wire object if the device was detected
  
  def init()
    self.wire = tasmota.wire_scan(0x68, 58)
  end
end
```

`self.wire` contains a reference to `wire1` if the device was detected on I2C bus 1, a reference to `wire2` if the device was detected on bus 2, or `nil` if the device was not detected, or if I2C index 58 was disabled through `I2CEnable`.

**Step 2: verify the device**

To make sure the device is actually an MPU6886, we check it's signature by reading register 0x75. It should respond 0x19 (see datasheet for MPU6886).

```python
[...]
    if self.wire
      var v = self.wire.read(0x68,0x75,1)
      if v != 0x19 return end  #- wrong device -#
[...]
```

**Step 3: initialize the device**

We write a series of values in registers to configure the device as expected (see datasheet).

```python
[...]
      self.wire.write(0x68, 0x6B, 0, 1)
      tasmota.delay(10)
      self.wire.write(0x68, 0x6B, 1<<7, 1)    # MPU6886_PWR_MGMT_1
      tasmota.delay(10)
      self.wire.write(0x68, 0x6B, 1<<0, 1)    # MPU6886_PWR_MGMT_1
      tasmota.delay(10)
      self.wire.write(0x68, 0x1C, 0x10, 1)    # MPU6886_ACCEL_CONFIG - AFS_8G
      tasmota.delay(1)
      self.wire.write(0x68, 0x1B, 0x18, 1)    # MPU6886_GYRO_CONFIG - GFS_2000DPS
      tasmota.delay(1)
      self.wire.write(0x68, 0x1A, 0x01, 1)    # MPU6886_CONFIG
      tasmota.delay(1)
      self.wire.write(0x68, 0x19, 0x05, 1)    # MPU6886_SMPLRT_DIV
      tasmota.delay(1)
      self.wire.write(0x68, 0x38, 0x00, 1)    # MPU6886_INT_ENABLE
      tasmota.delay(1)
      self.wire.write(0x68, 0x1D, 0x00, 1)    # MPU6886_ACCEL_CONFIG2
      tasmota.delay(1)
      self.wire.write(0x68, 0x6A, 0x00, 1)    # MPU6886_USER_CTRL
      tasmota.delay(1)
      self.wire.write(0x68, 0x23, 0x00, 1)    # MPU6886_FIFO_EN
      tasmota.delay(1)
      self.wire.write(0x68, 0x37, 0x22, 1)    # MPU6886_INT_PIN_CFG
      tasmota.delay(1)
      self.wire.write(0x68, 0x38, 0x01, 1)    # MPU6886_INT_ENABLE
      tasmota.delay(100)
[...]
```

We also pre-compute multipler to convert raw values to actual values:

```python
[...]
      self.gres = 2000.0/32768.0
      self.ares = 8.0/32678.0
      print("I2C: MPU6886 detected on bus "+str(self.wire.bus))
[...]
```

**Step 4: read sensor value**

We will detail here the acceleration senor; gyroscope works similarly and is not further detailed.

Reading the x/y/z sensor requires to read 6 bytes as a `bytes()` object

```python
    var b = self.wire.read_bytes(0x68,0x3B,6)
```

Each value is 2 bytes. We use `bytes.get(offset,size)` to extract 2-bytes values at offsets 0/2/4. The size is `-2` to indicate that values are encoded in Big Endian instead of Little Endian.

```python
    var a1 = b.get(0,-2)
```

Finally the read value is unsigned 16 bits, but the sensor value is signed 16 bits. We convert 16 bits unsigned to 16 bits signed.

```python
    if a1 >= 0x8000 a1 -= 0x10000 end
```

We then repeat for y and z:

```python
  def read_accel()
    if !self.wire return nil end  #- exit if not initialized -#
    var b = self.wire.read_bytes(0x68,0x3B,6)
    var a1 = b.get(0,-2)
    if a1 >= 0x8000 a1 -= 0x10000 end
    var a2 = b.get(2,-2)
    if a2 >= 0x8000 a2 -= 0x10000 end
    var a3 = b.get(4,-2)
    if a3 >= 0x8000 a3 -= 0x10000 end
    self.accel = [a1 * self.ares, a2 * self.ares, a3 * self.ares]
    return self.accel
  end
```

**Step 5: read sensor every second**

Simply override `every_second()`

```python
  def every_second()
    if !self.wire return nil end  #- exit if not initialized -#
    self.read_accel()
    self.read_gyro()
  end
```

**Step 6: display sensor value in Web UI**

You need to override `web_sensor()` and provide the formatted string. `tasmota.web_send_decimal()` sends a string to the Web UI, and converts decimal numbers according to the locale settings.

Tasmota uses specific markers:

- `{s}`: start of line
- `{m}`: separator between name and value
- `{e}`: end of line

```python
  #- display sensor value in the web UI -#
  def web_sensor()
    if !self.wire return nil end  #- exit if not initialized -#
    import string
    var msg = string.format(
             "{s}MPU6886 acc_x{m}%.3f G{e}"..
             "{s}MPU6886 acc_y{m}%.3f G{e}"..
             "{s}MPU6886 acc_z{m}%.3f G{e}"..
             "{s}MPU6886 gyr_x{m}%i dps{e}"..
             "{s}MPU6886 gyr_y{m}%i dps{e}"..
             "{s}MPU6886 gyr_z{m}%i dps{e}",
              self.accel[0], self.accel[1], self.accel[2], self.gyro[0], self.gyro[1], self.gyro[2])
    tasmota.web_send_decimal(msg)
  end
```

**Step 7: publish JSON TelePeriod sensor value**

Similarly to Web UI, publish sensor value as JSON.

```python
  #- add sensor value to teleperiod -#
  def json_append()
    if !self.wire return nil end  #- exit if not initialized -#
    import string
    var ax = int(self.accel[0] * 1000)
    var ay = int(self.accel[1] * 1000)
    var az = int(self.accel[2] * 1000)
    var msg = string.format(",\"MPU6886\":{\"AX\":%i,\"AY\":%i,\"AZ\":%i,\"GX\":%i,\"GY\":%i,\"GZ\":%i}",
              ax, ay, az, self.gyro[0], self.gyro[1], self.gyro[2])
    tasmota.response_append(msg)
  end
```

### Full example

The code can be loaded manually with copy/paste, or stored in flash and loaded at startup in `autoexec.be` as `load("mpu6886.be")`. Alternatively it can be loaded with a Tasmota native command or rule:

```
Br load("mpu6886.be")
```

See code example below for MPU6886:

```python
#-
 - Example of I2C driver written in Berry
 -
 - Support for MPU6886 device found in M5Stack
 - Alternative to xsns_85_mpu6886.ino 
 -#

class MPU6886 : Driver
  var wire          #- if wire == nil then the module is not initialized -#
  var gres, ares
  var accel, gyro

  def init()
    self.wire = tasmota.wire_scan(0x68, 58)

    if self.wire
      var v = self.wire.read(0x68,0x75,1)
      if v != 0x19 return end  #- wrong device -#

      self.wire.write(0x68, 0x6B, 0, 1)
      tasmota.delay(10)
      self.wire.write(0x68, 0x6B, 1<<7, 1)    # MPU6886_PWR_MGMT_1
      tasmota.delay(10)
      self.wire.write(0x68, 0x6B, 1<<0, 1)    # MPU6886_PWR_MGMT_1
      tasmota.delay(10)
      self.wire.write(0x68, 0x1C, 0x10, 1)    # MPU6886_ACCEL_CONFIG - AFS_8G
      tasmota.delay(1)
      self.wire.write(0x68, 0x1B, 0x18, 1)    # MPU6886_GYRO_CONFIG - GFS_2000DPS
      tasmota.delay(1)
      self.wire.write(0x68, 0x1A, 0x01, 1)    # MPU6886_CONFIG
      tasmota.delay(1)
      self.wire.write(0x68, 0x19, 0x05, 1)    # MPU6886_SMPLRT_DIV
      tasmota.delay(1)
      self.wire.write(0x68, 0x38, 0x00, 1)    # MPU6886_INT_ENABLE
      tasmota.delay(1)
      self.wire.write(0x68, 0x1D, 0x00, 1)    # MPU6886_ACCEL_CONFIG2
      tasmota.delay(1)
      self.wire.write(0x68, 0x6A, 0x00, 1)    # MPU6886_USER_CTRL
      tasmota.delay(1)
      self.wire.write(0x68, 0x23, 0x00, 1)    # MPU6886_FIFO_EN
      tasmota.delay(1)
      self.wire.write(0x68, 0x37, 0x22, 1)    # MPU6886_INT_PIN_CFG
      tasmota.delay(1)
      self.wire.write(0x68, 0x38, 0x01, 1)    # MPU6886_INT_ENABLE
      tasmota.delay(100)

      self.gres = 2000.0/32768.0
      self.ares = 8.0/32678.0
      print("I2C: MPU6886 detected on bus "+str(self.wire.bus))
    end
  end

  #- returns a list of 3 axis, float as g acceleration -#
  def read_accel()
    if !self.wire return nil end  #- exit if not initialized -#
    var b = self.wire.read_bytes(0x68,0x3B,6)
    var a1 = b.get(0,-2)
    if a1 >= 0x8000 a1 -= 0x10000 end
    var a2 = b.get(2,-2)
    if a2 >= 0x8000 a2 -= 0x10000 end
    var a3 = b.get(4,-2)
    if a3 >= 0x8000 a3 -= 0x10000 end
    self.accel = [a1 * self.ares, a2 * self.ares, a3 * self.ares]
    return self.accel
  end

  #- returns a list of 3 gyroscopes, int as dps (degree per second)  -#
  def read_gyro()
    if !self.wire return nil end  #- exit if not initialized -#
    var b = self.wire.read_bytes(0x68,0x43,6)
    var g1 = b.get(0,-2)
    if g1 >= 0x8000 g1 -= 0x10000 end
    var g2 = b.get(2,-2)
    if g2 >= 0x8000 g2 -= 0x10000 end
    var g3 = b.get(4,-2)
    if g3 >= 0x8000 g3 -= 0x10000 end
    self.gyro = [int(g1 * self.gres), int(g2 * self.gres), int(g3 * self.gres)]
    return self.gyro
  end

  #- trigger a read every second -#
  def every_second()
    if !self.wire return nil end  #- exit if not initialized -#
    self.read_accel()
    self.read_gyro()
  end

  #- display sensor value in the web UI -#
  def web_sensor()
    if !self.wire return nil end  #- exit if not initialized -#
    import string
    var msg = string.format(
             "{s}MPU6886 acc_x{m}%.3f G{e}"..
             "{s}MPU6886 acc_y{m}%.3f G{e}"..
             "{s}MPU6886 acc_z{m}%.3f G{e}"..
             "{s}MPU6886 gyr_x{m}%i dps{e}"..
             "{s}MPU6886 gyr_y{m}%i dps{e}"..
             "{s}MPU6886 gyr_z{m}%i dps{e}",
              self.accel[0], self.accel[1], self.accel[2], self.gyro[0], self.gyro[1], self.gyro[2])
    tasmota.web_send_decimal(msg)
  end

  #- add sensor value to teleperiod -#
  def json_append()
    if !self.wire return nil end  #- exit if not initialized -#
    import string
    var ax = int(self.accel[0] * 1000)
    var ay = int(self.accel[1] * 1000)
    var az = int(self.accel[2] * 1000)
    var msg = string.format(",\"MPU6886\":{\"AX\":%i,\"AY\":%i,\"AZ\":%i,\"GX\":%i,\"GY\":%i,\"GZ\":%i}",
              ax, ay, az, self.gyro[0], self.gyro[1], self.gyro[2])
    tasmota.response_append(msg)
  end

end
mpu6886 = MPU6886()
tasmota.add_driver(mpu6886)
```
