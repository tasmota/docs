Tasmota sensor API documentation for sensor driver development.

*	[**Important things to consider**](#important-things-to-consider)
*	[**API Structure**](#api-structure)
*	[**Keeping ESP8266 code compact**](#keeping-esp8266-code-compact)

# Important things to consider
* There are several I<sup>2</sup>C sensor examples you can take from the development codebase when writing your own and you are encouraged to do this as it is a quick and easy way to see how things fit together.
* The Tasmota firmware is essentially intended for ESP8266/ESP8285 Wi-Fi SoC based devices and commits to the main development branch will be subject to review based on whether or not what you intend to develop or add to the existing code is relevant to the general ESP device users.
* That being said, there is a lot of development going into the firmware which extends the functionality of standard off the shelf Sonoff devices. The firmware in itself is also useful for boards such as the WeMos ESP82xx boards. More technically inclined individuals who use generic ESP82xx modules in their own circuits to provide more access to pins and the ability to add more sensors and hardware external to the device or the generic ESP82xx module circuits can also take advantage of Tasmota.
* The resources on the ESP82xx are finite. Most devices ship with 1MByte SPI flash which means for the generic device users, the code generally needs to be less than 502KBytes to ensure that OTA (Over The Air) flash functionality (which is the main reason why people use this firmware) remains available. RAM is also limited to an absolute maximum of 80KBytes. This memory is divided into heap (used by global variables and Strings) and stack (used by local variables) where stack space is just 4KBytes.
* Given the above resource constraints its important to keep your code as small as possible, as fast running as possible, and use as little RAM as possible.
* You need to think about these resource constraints all the time whilst doing any development you wish to add to the firmware functionality - Face the fact that microcontroller development isn't as close a relative to standard computer programming as you'd expect.
* You will be adding code to an existing framework which requires you to adhere to some simple but strict rules such as not having any infinite loops like you would have in your generic Arduino code and try to avoid using the delay() functions when writing your code as this will cause the entire firmware to be subjected to the delays you have added - Infinite loops will cause the firmware to lock up completely!
* If your sensor has configuration options please make these available by using the `SensorXX` framework which is already incorporated in the base code - This may not stop you from using a web-based configuration interface but since web-based configuration takes up a lot of code space in flash it is very important to make this optional by means of a compiler directive or a #define in the configuration file and as such something you need to keep in mind during your development and debugging - The more progressively optional additional features are in your driver the smaller the basic codebase can be for minimalist implementations.
* Whilst developing drivers for devices that use the I<sup>2</sup>C bus always consider other devices already supported in the codebase which may use the same address range. This could mean you need to find a unique way of differentiating your device detection from other devices on the same address range (e.g. querying a model-specific register) and/or disabling by #undef existing devices if yours is selected with a #define statement and in such cases always provide a warning to the user during compile time using the #warning pragma such as including `#warning **** Turned off conflicting drivers SHT and VEML6070 ****` in your code.
* DO NOT ADD WEB INTERFACE FOR SENSOR CONFIGURATION if your sensor requires additional user configuration. The reason for this is the additional program memory required but most importantly the amount of RAM required to even create minimal user interfaces. Running out of RAM during runtime will lead to abnormal behaviour of your driver and/or other drivers or the entire firmware! See sensors such as the MCP23008/MCP23017 driver on more information on how to implement `SensorXX` commands instead!
* While developing you might want to enable additional debugging provided by file ``xdrv_95_debug.ino`` using `#define USE_DEBUG_DRIVER` which provides some commands for managing configuration settings and CPU timing. In addition you can enable define `PROFILE_XSNS_SENSOR_EVERY_SECOND` to profile your drivers duration.
* Do not assume others will know immediately how to use your addition and know that you will need to write a Wiki for it in the end.

# Managing a Forked Branch
If you plan to submit a PR bigger than a simple change in one file, here is a short intro about how to do a clean PR.

- fork the Tasmota repository in Github
- `git clone https://github.com/<github_user>/Tasmota.git` and work on your local copy
- `git remote add upstream https://github.com/arendst/Tasmota.git`
- `git checkout development`
- `git checkout -b <temp_branch>` to create a working branch where you can push commits
- `git push --set-upstream origin <temp_branch>`
- work on your local version and push as many commits as you want

When you think it is ready to merge and submit a PR:
- `git checkout development` to go back to the main branch
- `git pull upstream development` to update all the latest changes
- `git push` to update your fork
- `git checkout -b <pr_branch>` to create a new branch for the final PR
- `git push --set-upstream origin <pr_branch>`
- Merge the edits but be sure to remove the history of your local commits
- `git merge --squash <temp_branch>`
- `git commit -m "Message"`

Now you have a clean single commit from which you can create the PR on the Tasmota Github.

# Directory/file structure
Sensor libraries are located in the `lib/` directory. Sensor drivers are located in the `tasmota/` directory. The filename of the sensor driver is `xsns_<driver_ID>_<driver_name>.ino`, e.g. `xsns_05_ds18b20.ino` where `<driver_ID>` is a _unique_ number between 01 and 90 and `<driver_name>` is a human-readable name of the driver.

Using generic libraries from external sources for sensors should be avoided as far as possible as they usually include code for other platforms and are not always written in an optimized way.

# API structure
## Pre-processor directives
Conditional compiling of a sensor driver is achieved by adding a pre-processor directive of the scheme `USE_<driver_name>` in `my_user_config.h`. Accordingly the driver code has to be wrapped in `#ifdef USE_<driver_name> ... #endif  // USE_<driver_name>`. Any Sensor driver must contain a pre-processor directive defining the driver ID by the scheme `#define XSNS_<driver_ID>`.

## Callback function

Any sensor driver needs a callback function following the scheme
```c++
// Conditional compilation of driver
#ifdef USE_<driver_name>

// Define driver ID
#define XSNS_<driver_ID>  <driver_ID>

/**
 * The callback function Xsns<driver_ID>() interfaces Tasmota with the sensor driver.
 *
 * It provides the Tasmota callback IDs.
 *
 * @param   byte    callback_id  Tasmota function ID.
 * @return  boolean              Return value.
 * @pre     None.
 * @post    None.
 *
 */
boolean Xsns<driverID>(byte callback_id) {

  // Set return value to `false`
  boolean result = false;

  // Check if I2C interface mode
// if(i2c_flg) {

  // Check which callback ID is called by Tasmota
  switch (callback_id) {
    case FUNC_INIT:
      break;
    case FUNC_EVERY_50_MSECOND:
      break;
    case FUNC_EVERY_SECOND:
      break;
    case FUNC_JSON_APPEND:
      break;
#ifdef USE_WEBSERVER
    case FUNC_WEB_APPEND:
      break;
#endif // USE_WEBSERVER
    case FUNC_SAVE_BEFORE_RESTART:
      break;
    case FUNC_COMMAND:
      break;
  }
// } // if(i2c_flg)

  // Return boolean result
  return result;
}
#endif // USE_<driver_name>
```

## Callback IDs

`FUNC_INIT`

This callback ID is called when sensor drivers should be initialized.

`FUNC_EVERY_50_MSECOND`

This callback ID is called every 50 milliseconds, e.g. for near real-time operation

`FUNC_EVERY_SECOND`

This callback ID is called every second.

It can be useful for anything that you need to do on a per second basis and is commonly used as an entry point to detect a driver or initialize an externally driven device such as a sensor, relay board or other forms of input/output required by your driver.

You would normally want to make sure you've detected and initialised before it is used by `JSON_APPEND`, etc. so that its ready to serve data.

The generally accepted way to use this would be to detect your sensor and once this is done set a sensor value accordingly so that the function does not use unnecessary resources during future calls, for example:
```c++
void MySensorDetect()
{
  if (MySensorDetected) { return; }
  /*
   * Perform the code which needs to be completed to
   * detect your sensor and then set MySensorDetected to
   * a non-zero value which will prevent this section
   * of your code to re-run every time the function is
   * called.
   * 
   * Under normal circumstances you'd not need to do
   * re-detect or initialise your sensor once it has been
   * done
   */
}
```

Setting a flag that the driver was successful in detecting the attached chip/board via I<sup>2</sup>C or SPI will prevent it from continuously trying to initialize an already initialized device.

When writing your function responsible for detecting an externally connected I<sup>2</sup>C device try to create a method by which you read or write to specific registers that would be applicable to that specific I<sup>2</sup>C device only as to confirm a positive detect for the device. If this is not done extensively it will lead to some drivers getting false detects for a different device type simply because it shares the same I<sup>2</sup>C address.

Unless your driver is specifically going to use the entire array of addresses provisioned by the manufacturer please consider using a `#define USE_MYCHIPNAME_ADDR` in the `my_user_config.h` so that the user may specify the address on which to expect the device. This is of course only applicable to drivers that are not enabled by default in any of the pre-built binaries.

**I<sup>2</sup>C address auto-detection example**
```c++
#define MPR121_I2C_ADDR_1ST  0x5A    /** 1st I2C address of sensor model **/
#define MPR121_I2C_ADDR_NUM  4       /** Number of sensors/I2C addresses **/
#define MPR121_I2C_ID_REG    0x5D    /** Sensor model specific ID register **/
#define MPR121_I2C_ID_VAL    0x24    /** Sensor model specific ID register value **/

/* Sensor data struct type declaration/default definition */
typedef struct {
    bool connected    = false;     /** Status if sensor is connected at I2C address */
    bool running      = false;     /** Running state of sensor */
        .
        .
        .
} mpr121;

// Declare array of sensor data structs
mpr121 mpr121[MPR121_I2C_ADDR_NUM];

// Sensor specific init function
void mpr121_init() {

    // Loop through I2C addresses
    for (uint8_t i = 0; i < MPR121_I2C_ADDR_NUM); i++) {

        // Check if sensor is connected on I2C address
        mpr121[i].connected = (MPR121_I2C_ID_VAL == I2cRead8(MPR121_I2C_ADDR_1ST + i, MPR121_I2C_ID_REG);
        if(mpr121[i].connected) {

            // Log sensor found
            snprintf_P(log_data, sizeof(log_data), PSTR(D_LOG_I2C "MPR121-%d " D_FOUND_AT " 0x%X"), i, MPR121_I2C_ADDR_1ST + i);
            AddLog(LOG_LEVEL_INFO);

            // Initialize sensor
            .
            .
            .

            // Set running to true
            mpr121[i].running = true;
        }
    }
    if(!(mpr121[0].connected || mpr121[1].connected || mpr121[2].connected || mpr121[3].connected)){
        snprintf_P(log_data, sizeof(log_data), PSTR(D_LOG_I2C "MPR121: No sensors found"));
        AddLog(LOG_LEVEL_INFO);
    }
}
```

**Four advanced methods to use `FUNC_EVERY_SECOND` (Food for thought) :**
* If a sensor needs an action which takes a long time, like more than 100mS, the action will be started here for a future follow-up. Using the uptime variable for testing like (uptime &1) will happen every 2 seconds. An example is the DS18B20 driver where readings (conversions they call it) can take up to 800mS from the initial request.
* If a sensor needed the previous action it is now time to gather the information and store it in a safe place to be used by `FUNC_JSON_APPEND` and/or `FUNC_WEB_APPEND`. Using the else function of the previous test (uptime &1) will happen every 2 seconds too but just 1 second later than the previous action.
* If a sensor does not respond for 10 times the sensor detection flag could be reset which will stop further processing until the sensor is re-detected. This is currently not being used actively as some users complain about disappearing sensors for whatever reason - Could be hardware related but easier to make Tasmota a little more flexible.
* Making re-detection of a sensor possible by executing this once every 100 seconds (94 == (uptime %100)) a re-attached sensor can be detected without a restart of Tasmota. The 94 given in this example should be different for every sensor driver to make sure not all sensors start detection at the same time. Using the drivers index number should be a good starting point.

`FUNC_PREP_BEFORE_TELEPERIOD`

NOTE: This callback ID is deprecated as sensors should prepare for more regular updates due to "realtime" rule execution. Use `FUNC_EVERY_SECOND` instead. See examples used in xsns_05_ds18x20.ino and xsns_09_bmp.ino where updated sensor data is stored in preparation to calls to FUNC_JSON_APPEND and FUNC_WEB_APPEND.

`FUNC_JSON_APPEND`

This callback ID is called when [`TelePeriod`](Commands#teleperiod) is due to append telemetry data to the MQTT JSON string or at approximately every 2 seconds when a rule is checked, e.g.
```c++
snprintf_P(mqtt_data, sizeof(mqtt_data), PSTR("{\"MPR121%c\":{\"Button%i\":%i}}"), pS->id[i], j, BITC(i,j));
```

`FUNC_WEB_APPEND`

This callback ID is called every <WebRefresh> millisecond when HTML code should be added to the Tasmota web-interface main page, e.g.,
```c++
snprintf_P(mqtt_data, sizeof(mqtt_data), PSTR("%s{s}MPR121%c Button%d{m}%d{e}"), mqtt_data, pS->id[i], j, BITC(i,j));
```
It should be wrapped in `#ifdef USE_WEBSERVER ... #endif  // USE_WEBSERVER`

`FUNC_SAVE_BEFORE_RESTART`

This callback ID is called to allow a sensor to prepare for saving configuration changes. To be used to save volatile data just before a restart. Variables can be appended to `struct SYSCFG {} Settings` in file `tasmota/settings.h`.

`FUNC_COMMAND`

This callback ID is called when a sensor specific command ``Sensor<xx>`` or ``Driver<xx>`` is executed where xx is the sensor index.
```c++
        case FUNC_COMMAND:
            if (XSNS_<driver_ID> == XdrvMailbox.index) {
               result = <driver_name>Command() { ... };  // Return true on success
            }
            break;
 
```
```c++
// Data struct of FUNC_COMMAND ID
struct XDRVMAILBOX {
  uint16_t      valid;      // ???
  uint16_t      index;      // Sensor index
  uint16_t      data_len;   // Length of command string
  uint16_t      payload16;  // 16 bit unsigned int of payload if it could be converted, otherwise 0
  int16_t       payload;    // 16 bit signed int of payload if it could be converted, otherwise 0
  uint8_t       grpflg;     // ???
  uint8_t       notused;    // ???
  char         *topic;      // Command topic
  char         *data;       // Command string/value - length of which is defined by data_len
} XdrvMailbox;
```

If your driver needs to accept multiple parameters for `SensorXX` and/or `DriverXX` please consider using comma delimited formatting and use the already written `subStr()` function declared in `support.ino` to parse through the parameters you need.

An example of those could be
```c++
SensorXX reset // The reset parameter may be intercepted using:
if (!strcmp(subStr(sub_string, XdrvMailbox.data, ",", 1),"RESET")) { // Note 1 used for param number
    MyDriverName_Reset(); 
    return serviced;
}
```
Or in the case of multiple parameters
```c++
SensorXX mode,1
if (!strcmp(subStr(sub_string, XdrvMailbox.data, ",", 1),"MODE")) { // Note 1 used for param number
  uint8_t mode = atoi(subStr(sub_string, XdrvMailbox.data, ",", 2);  // Note 2 used for param number
}
```

## Useful functions

### MQTT
___
```c++
void MqttPublishPrefixTopic_P(uint8_t prefix, const char* subtopic, boolean retained)
```
This function publishes MQTT messages immediately, e.g.,
```c++
snprintf_P(mqtt_data, sizeof(mqtt_data), PSTR("{\"MPR121%c\":{\"Button%i\":%i}}"), pS->id[i], j, BITC(i,j));
MqttPublishPrefixTopic_P(RESULT_OR_STAT, mqtt_data);
```
### Logging
```c++
void AddLog(byte loglevel)
```
This function adds log messages stored in ``log_data`` to the local logging system, e.g.
```c++
snprintf_P(log_data, sizeof(log_data), PSTR(D_LOG_I2C "MPR121(%c) " D_FOUND_AT " 0x%X"), pS->id[i], pS->i2c_addr[i]);
AddLog(LOG_LEVEL_INFO);
```
```c++
void AddLogSerial(byte loglevel)
```
This function adds a log message to the local logging system dumping the serial buffer as hex information, e.g.
```c++
AddLogSerial(LOG_LEVEL_INFO);
```
```c++
void AddLogMissed(char *sensor, uint8_t misses)
```
This function adds a log message to the local logging system about missed sensor reads.

### I<sup>2</sup>C Interface
```c++
bool I2cValidRead8(uint8_t *data, uint8_t addr, uint8_t reg)
```
```c++
bool I2cValidRead16(uint16_t *data, uint8_t addr, uint8_t reg)
```
```c++
bool I2cValidReadS16(int16_t *data, uint8_t addr, uint8_t reg)
```
```c++
bool I2cValidRead16LE(uint16_t *data, uint8_t addr, uint8_t reg)
```
```c++
bool I2cValidReadS16_LE(int16_t *data, uint8_t addr, uint8_t reg)
```
```c++
bool I2cValidRead24(int32_t *data, uint8_t addr, uint8_t reg)
```
```c++
bool I2cValidRead(uint8_t addr, uint8_t reg, uint8_t size)
```
These functions return `true` if 1, 2, 3 or `size` bytes can be read from the I<sup>2</sup>C address `addr` and register `reg` into `*data`.
Functions with a `S` read signed data types while functions without a `S` read unsigned data types.
Functions with LE read little-endian byte order while functions without LE read machine byte order.

```c++
uint8_t I2cRead8(uint8_t addr, uint8_t reg)
```
```c++
uint16_t I2cRead16(uint8_t addr, uint8_t reg)
```
```c++
int16_t I2cReadS16(uint8_t addr, uint8_t reg)
```
```c++
uint16_t I2cRead16LE(uint8_t addr, uint8_t reg)
```
```c++
int16_t I2cReadS16_LE(uint8_t addr, uint8_t reg)
```
```c++
int32_t I2cRead24(uint8_t addr, uint8_t reg)
```
These functions return 1, 2 or 3 bytes from the I<sup>2</sup>C address `addr` and register `reg`.
Functions with a `S` read signed data types while functions without a `S` read unsigned data types.
Functions with LE read little endian byte order while functions without LE read machine byte order.


```c++
bool I2cWrite8(uint8_t addr, uint8_t reg, uint8_t val)
```
```c++
bool I2cWrite16(uint8_t addr, uint8_t reg, uint16_t val)
```
```c++
bool I2cWrite(uint8_t addr, uint8_t reg, uint32_t val, uint8_t size)
```
These functions return true after successfully writing 1, 2 or `size` bytes to the I<sup>2</sup>C address `addr` and register `reg`.

```c++
int8_t I2cReadBuffer(uint8_t addr, uint8_t reg, uint8_t *reg_data, uint16_t len)
```
```c++
int8_t I2cWriteBuffer(uint8_t addr, uint8_t reg, uint8_t *reg_data, uint16_t len)
```
These functions copy `len` bytes from/to `*reg_data` starting at I<sup>2</sup>C address `addr` and register `reg`.

```c++
void I2cScan(char *devs, unsigned int devs_len)
```
This functions writes a list of I<sup>2</sup>C addresses in use into the string `*dev` with maximum length `devs_len`.

```c++
bool I2cDevice(byte addr)
```
This functions checks if the I<sup>2</sup>C address `addr` is in use.


## Useful pre-processor directives
`PSTR("string")`

This pre-processor directive saves RAM by storing strings in flash instead of RAM.

```c++
const char MyTextStaticVariable[] PROGMEM = "string";
```
This pre-processor directive saves RAM by storing strings in flash instead of RAM.

You may then reference them directly (if the type matches the parameter required) or force it to 4 byte alignment by using the variable as `FPSTR(MyTextStaticVariable)`

# Keeping ESP8266 code compact

Below are various tips and tricks to keep ESP8266 code compact and save both Flash and Memory. Flash code is limited to 1024k but keep in mind that to allow OTA upgrade, you need Flash memory to contain two firmwares at the same time. To go beyond 512k, you typically use `tasmota-minimal` as an intermediate firmware. `tasmota-minimal` takes roughly 360k, so it's safe not to go `uint32_t` beyond 620k of Flash. Memory is even more limited: 80k. With Arduino Core and basic Tasmota, there are 25k-30k left of heap space. Heap memory is very precious, running out of memory will generally cause a crash.

## About ESP8266

ESP8266 is based on [Xtensa instruction set](https://0x04.net/~mwk/doc/xtensa.pdf). Xtensa is a 32 bits RISC processor core, containing 16 x 32 bits registers. ESP8266 supports integer operations, including 32x32 multiplication. It does not contain an FPU for floating point operations, nor integer divisions.

Contrary to classical RISC processors, all instructions are 24 bits wide instead of 32 bits. To increase code compactness, some instructions have a 16 bits version used whenever possible by gcc.

If you want to see what assembly is generated by gcc, in file `platform.ini`, at the section used to compile (ex: `[core_2_6_1]`) in section `build_flags` add:

```-save-temps=obj -fverbose-asm```

Gcc will store `<file>.s` in the same folder as the `.o` file, typically in `.pioenvs/`.

### First example

Let's take a basic function:

```c++
uint32_t Example(uint32_t a, uint32_t b) {
  return a + b;
}
```

Below is the generated assembly. Function names are mangled using standard C++, i.e. their name derive from their arguments and return types:

```asm
_Z7Examplejj:
	add.n	a2, a2, a3	#, a, b
	ret.n
```

As you can see, this is the simplest function we can think of. Register A2 holds the first argument and is used for return value. A3 holds the second argument.

### uint8_t or uint32_t ?

```c++
uint32_t Example(uint32_t a, uint32_t b) {
  uint8_t c = a + b;
  return c;
}
```

Assembly:

```asm
_Z7Examplejj:
	add.n	a2, a2, a3	# tmp52, a, b
	extui	a2, a2, 0, 8	#, tmp52
	ret.n
```

Whenever gcc needs to convert from `uin32_t` to `uint8_t`, it uses an extra instruction `extui  <reg>, <reg>, 0, 8`.

Whenever you allocate `uint8_t` as a local variable, it will anyways allocate 32 bits on the stack.

In conclusion you can easily use `uint32_t` in many places in the code. The main reason to force `uint8_t` are:

* in structures, to save memory. This is the only place where  `uint8_t` will take 1 byte and the compiler will try to pack as much as 4 `uint8_t` in 32 bits
* when you want to ensure that the value can never exceed 255. Beware though that the compiler will just chunk the last 8 bits of a 32 bits value and will not report any overflow.

#### Loops

Should you use `uint8_t` or `uint32_t` for loops?

Let's try:

```c++
uint32_t Example(uint32_t a, uint32_t b) {
  for (uint8_t i = 0; i < 10; i++) {
    a += b;
  }
  for (uint32_t j = 0; j < 10; j++) {
    a += b;
  }
  return a;
}
```

Assembly:

```asm
_Z7Examplejj:
	movi.n	a3, 0	# ivtmp$7334,                     <- loop 1
.L2031:
	add.n	a2, a2, a3	# a, a, ivtmp$7334
	addi.n	a3, a3, 1	# ivtmp$7334, ivtmp$7334,
	bnei	a3, 10, .L2031	# ivtmp$7334,,
	movi.n	a3, 0	# j,                              <- loop 2
.L2033:
	add.n	a2, a2, a3	# a, a, j
	addi.n	a3, a3, 1	# j, j,
	bnei	a3, 10, .L2033	# j,,
	ret.n
```

As you can see here, both loops generate the same assembly for fixed size loops.

Let's now see for variable size loops.

```c++
uint32_t Example(uint32_t a, uint32_t b) {
  for (uint8_t i = 0; i < b; i++) {
    a += i;
  }
  for (uint32_t j = 0; j < b; j++) {
    a += j;
  }
  return a;
}
```

Assembly:

```asm
_Z7Examplejj:
	movi.n	a4, 0	# i,                     <- loop 1
	j	.L2030	#
.L2031:
	add.n	a2, a2, a4	# a, a, i
	addi.n	a4, a4, 1	# tmp48, i,
	extui	a4, a4, 0, 8	# i, tmp48       <- extra 32 to 8 bits conversion
.L2030:
	bltu	a4, a3, .L2031	# i, b,
	movi.n	a4, 0	# j,                     <- loop 2
	j	.L2032	#
.L2033:
	add.n	a2, a2, a4	# a, a, j
	addi.n	a4, a4, 1	# j, j,
.L2032:
	bne	a4, a3, .L2033	# j, b,
	ret.n
```

In the first loop, the register a4 needs to be converted from 32 bits to 8 bits in each iteration.

Again, there is no definitive rule, but keep in mind that using `uint8_t` can sometimes increase code size compared to `uint32_t`.

### Floats, not doubles!

ESP8266 does not have a FPU (Floating Point Unit), all floating point operations are emulated in software and provided in `libm.a`. The linker removes any unused functions, so we need to limit the number of floating point function calls.

**Rule 1**: use ints where you can, avoid floating point operations.

**Rule 2**: if you really need floating point, always use `float`, never **ever** use `double`.

Let's now see why.

`float`fits in 32 bits, with a mantissa of 20 bits, exponent of TODO. The mantissa is 20 bits wide, which provides enough precision for most of our needs.

`float` is 32 bits wide and fits in a single register, whereas `double` is 64 bits and requires 2 registers.

```c++
float Examplef(float a, float b) {
  return sinf(a) * (b + 0.4f) - 3.5f;
}
```

Assembly:

```asm
	.literal .LC1012, 0x3ecccccd      <- 0.4f
	.literal .LC1013, 0x40600000      <- 3.5f
_Z8Examplefff:
	addi	sp, sp, -16	#,,       <- reserve 16 bytes on stack
	s32i.n	a0, sp, 12	#,        <- save a0 (return address) on stack
	s32i.n	a12, sp, 8	#,        <- save a12 on stack, to free for local var
	s32i.n	a13, sp, 4	#,        <- save a13 on stack, to free for local var
	mov.n	a13, a3	# b, b            <- a3 holds 'b', save to a13
	call0	sinf	#                 <- calc sin of a2 (a)
	l32r	a3, .LC1012	#,        <- load 0.4f in a3
	mov.n	a12, a2	# D.171139,       <- save result 'sin(a)' to a12
	mov.n	a2, a13	#, b              <- move a13 (second arg: b) to a2
	call0	__addsf3	#         <- add floats a2 and a3, result to a2
	mov.n	a3, a2	# D.171139,       <- copy result to a3
	mov.n	a2, a12	#, D.171139       <- load a2 with a12: sin(a)
	call0	__mulsf3	#         <- multiply 'sin(a)*(b+0.4f)'
	l32r	a3, .LC1013	#,        <- load a3 with 3.5f
	call0	__subsf3	#         <- substract 
	l32i.n	a0, sp, 12	#,        <- restore a0 (return address)
	l32i.n	a12, sp, 8	#,        <- restore a12
	l32i.n	a13, sp, 4	#,        <- restore a13
	addi	sp, sp, 16	#,,       <- free stack
	ret.n                             <- return
```

Now with `double`:

```c++
double Exampled(double a, double b) {
  return sin(a) * (b + 0.4) - 3.5;
}
```

Assembly:

```asm
	.literal .LC1014, 0x9999999a, 0x3fd99999     <- 0.4
	.literal .LC1015, 0x00000000, 0x400c0000     <- 3.5
_Z8Exampleddd:
	addi	sp, sp, -32	#,,
	s32i.n	a0, sp, 28	#,
	s32i.n	a12, sp, 24	#,
	s32i.n	a13, sp, 20	#,
	s32i.n	a14, sp, 16	#,
	s32i.n	a15, sp, 12	#,
	mov.n	a14, a4	#,
	mov.n	a15, a5	#,
	call0	sin	#
	l32r	a4, .LC1014	#,
	l32r	a5, .LC1014+4	#,
	mov.n	a12, a2	#,
	mov.n	a13, a3	#,
	mov.n	a2, a14	#,
	mov.n	a3, a15	#,
	call0	__adddf3	#
	mov.n	a4, a2	#,
	mov.n	a5, a3	#,
	mov.n	a2, a12	#,
	mov.n	a3, a13	#,
	call0	__muldf3	#
	l32r	a4, .LC1015	#,
	l32r	a5, .LC1015+4	#,
	call0	__subdf3	#
	l32i.n	a0, sp, 28	#,
	l32i.n	a12, sp, 24	#,
	l32i.n	a13, sp, 20	#,
	l32i.n	a14, sp, 16	#,
	l32i.n	a15, sp, 12	#,
	addi	sp, sp, 32	#,,
	ret.n
```

As you can see the `double` needs to move many more registers around. Examplef (float) is 84 bytes, Exampled (double) is 119 bytes (+42% code size). Actually it's even worse, `sin` is larger than float version `sinf`.

Also, never forget to explicitly tag literals as float: always put `1.5f` and not `1.5`. Let's see the impact:

```c++
float Examplef2(float a, float b) {
  return sinf(a) * (b + 0.4) - 3.5;    // same as above with double literals
}
```

Assembly:

```asm

	.literal .LC1014, 0x9999999a, 0x3fd99999
	.literal .LC1015, 0x00000000, 0x400c0000
	.align	4
	.global	_Z9Examplef2ff
	.type	_Z9Examplef2ff, @function
_Z9Examplef2ff:
	addi	sp, sp, -16	#,,
	s32i.n	a0, sp, 12	#,
	s32i.n	a12, sp, 8	#,
	s32i.n	a13, sp, 4	#,
	s32i.n	a14, sp, 0	#,
	mov.n	a14, a3	# b, b
	call0	sinf	#
	call0	__extendsfdf2	#        <- extend float to double
	mov.n	a12, a2	#,
	mov.n	a2, a14	#, b
	mov.n	a13, a3	#,
	call0	__extendsfdf2	#        <- extend float to double
	l32r	a4, .LC1014	#,
	l32r	a5, .LC1014+4	#,
	call0	__adddf3	#        <- add double
	mov.n	a4, a2	#,
	mov.n	a5, a3	#,
	mov.n	a2, a12	#,
	mov.n	a3, a13	#,
	call0	__muldf3	#        <- multiply double
	l32r	a4, .LC1015	#,
	l32r	a5, .LC1015+4	#,
	call0	__subdf3	#        <- substract double
	call0	__truncdfsf2	#        <- truncate double to float
	l32i.n	a0, sp, 12	#,
	l32i.n	a12, sp, 8	#,
	l32i.n	a13, sp, 4	#,
	l32i.n	a14, sp, 0	#,
	addi	sp, sp, 16	#,,
	ret.n
```

The last example takes 143 bytes, which is even worse than the `double` version, because of conversions from `float` to `double` and back. Internally, if you don't force `float` literals, gcc will make all intermediate compute in `double` and convert to `float` in the end. This is usually what is wanted: compute with maximum precision and truncate at the last moment. But for ESP8266 we want the opposite: most compact code.

### String concatenation

Let's start with an easy example:

```c++
void ExampleStringConcat(String &s) {
  s += "suffix";
}
```

Assembly (25 bytes):

```asm
.LC1024:
	.string	"suffix"
	.literal .LC1025, .LC1024
_Z19ExampleStringConcatR6String:
	l32r	a3, .LC1025	#,
	addi	sp, sp, -16	#,,
	s32i.n	a0, sp, 12	#,
	call0	_ZN6String6concatEPKc	#
	l32i.n	a0, sp, 12	#,
	addi	sp, sp, 16	#,,
	ret.n
```

If you need to add more complex strings, do not concatenate using native c++ concat:

```c++
void ExampleStringConcat2(String &s, uint8_t a, uint8_t b) {
  s += "[" + String(a) + "," + String(b) + "]";
}
```

Assembly (122 bytes!):

```asm
.LC231:
	.string	","
.LC1026:
	.string	"["
.LC1029:
	.string	"]"
	.literal .LC1027, .LC1026
	.literal .LC1028, .LC231
	.literal .LC1030, .LC1029
_Z20ExampleStringConcat2R6Stringhh:
	addi	sp, sp, -64	#,,
	s32i.n	a13, sp, 52	#,
	extui	a13, a3, 0, 8	# a, a
	l32r	a3, .LC1027	#,
	s32i.n	a12, sp, 56	#,
	mov.n	a12, a2	# s, s
	addi.n	a2, sp, 12	#,,
	s32i.n	a0, sp, 60	#,
	s32i.n	a14, sp, 48	#,
	extui	a14, a4, 0, 8	# b, b
	call0	_ZN6StringC2EPKc	# .    <- allocate String
	movi.n	a4, 0xa	#,
	addi	a2, sp, 24	#,,
	mov.n	a3, a13	#, a
	call0	_ZN6StringC1Ehh	#              <- allocate String
	addi	a3, sp, 24	#,,
	addi.n	a2, sp, 12	#,,
	call0	_ZplRK15StringSumHelperRK6String	#
	l32r	a3, .LC1028	#,
	call0	_ZplRK15StringSumHelperPKc	#
	movi.n	a4, 0xa	#,
	mov.n	a13, a2	# D.171315,
	mov.n	a3, a14	#, b
	mov.n	a2, sp	#,
	call0	_ZN6StringC1Ehh	#              <- allocate String
	mov.n	a3, sp	#,
	mov.n	a2, a13	#, D.171315
	call0	_ZplRK15StringSumHelperRK6String	#
	l32r	a3, .LC1030	#,
	call0	_ZplRK15StringSumHelperPKc	#
	mov.n	a3, a2	# D.171315,
	mov.n	a2, a12	#, s
	call0	_ZN6String6concatERKS_	#
	mov.n	a2, sp	#,
	call0	_ZN6StringD1Ev	#              <- destructor
	addi	a2, sp, 24	#,,
	call0	_ZN6StringD1Ev	#              <- destructor
	addi.n	a2, sp, 12	#,,
	call0	_ZN6StringD2Ev	#	       <- destructor
	l32i.n	a0, sp, 60	#,
	l32i.n	a12, sp, 56	#,
	l32i.n	a13, sp, 52	#,
	l32i.n	a14, sp, 48	#,
	addi	sp, sp, 64	#,,
	ret.n
```

Instead use native `String` concat:

```c++
void ExampleStringConcat3(String &s, uint8_t a, uint8_t b) {
  s += "[";
  s += a;
  s += ",";
  s += b;
  s += "]";
}
```

Assembly (69 bytes, -43%):

```asm
.LC231:
	.string	","
.LC1026:
	.string	"["
.LC1029:
	.string	"]"
	.literal .LC1031, .LC1026
	.literal .LC1032, .LC231
	.literal .LC1033, .LC1029
_Z20ExampleStringConcat3R6Stringhh:
	addi	sp, sp, -16	#,,
	s32i.n	a13, sp, 4	#,
	extui	a13, a3, 0, 8	# a, a
	l32r	a3, .LC1031	#,
	s32i.n	a0, sp, 12	#,
	s32i.n	a12, sp, 8	#,
	s32i.n	a14, sp, 0	#,
	mov.n	a12, a2	# s, s
	extui	a14, a4, 0, 8	# b, b
	call0	_ZN6String6concatEPKc	#       <- native char* add
	mov.n	a3, a13	#, a
	mov.n	a2, a12	#, s
	call0	_ZN6String6concatEh	#       <- native int add
	l32r	a3, .LC1032	#,
	mov.n	a2, a12	#, s
	call0	_ZN6String6concatEPKc	#       <- native char* add
	mov.n	a3, a14	#, b
	mov.n	a2, a12	#, s
	call0	_ZN6String6concatEh	#       <- native int add
	l32r	a3, .LC1033	#,
	mov.n	a2, a12	#, s
	call0	_ZN6String6concatEPKc	#       <- native char* add
	l32i.n	a0, sp, 12	#,
	l32i.n	a12, sp, 8	#,
	l32i.n	a13, sp, 4	#,
	l32i.n	a14, sp, 0	#,
	addi	sp, sp, 16	#,,
	ret.n
```
