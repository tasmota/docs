!> **This feature is not included in precompiled binaries.**     
To use it you must [compile your build](compile-your-build). Add the following to `user_config_override.h`:
```
#ifndef USE_SCRIPT
#define USE_SCRIPT  # adds about 17k flash size, variable ram size
#endif
#ifndef USE_SML_M
#define USE_SML_M
#endif
#ifdef USE_RULES
#undef USE_RULES
#endif  
```
----

**Driver for various meters , heating devices, and reed like contacts**

[Smart Meter Descriptors](Smart-Meter-Interface-Descriptors)

To use this interface, connect the meter to available GPIO pins. These GPIOs must be set as `None (0)`
components in Tasmota. If the interface detects that a meter descriptor GPIO conflicts with a Tasmota GPIO setting, the interface will generate a "duplicate GPIO defined" error in the log and the meter descriptor will be ignored.  

The Smart Meter Interface provides a means to connect many kinds of meters to Tasmota. **The following types of meter protocols are supported:**  
- ASCII OBIS telegrams emitted from many smart meters and also from P1 meter interface  
- Binary SML OBIS telegram emitted from many smart meters  
- Binary EBUS telegram emitted by many heaters and heat pumps  (e.g., Vaillant, Wolf)
- Binary MODBUS telegram used by many power meters
- Binary RAW telegram decodes all kinds of binary data eg EMS heater bus
- Counter interface (uses Tasmota counter storage) for e.g., reed contacts either in polling or IRQ mode

There are many different meters that use the same protocol. There are multitudes of variants and use cases. A meter can be defined by using compilation time `#define` pragmas. This requires recompiling the firmware to make modifications.  

This interface provides a means of specifying these definitions through [meter descriptors](Smart-Meter-Interface-Descriptors). This method uses the [scripting language](Scripting-Language) editor to define the descriptors. In this way, only one firmware binary version is required and a modification can be made easily "on the fly".  

**Note:** If no `>M` section is found in the script or if the scripting language is not compiled, the driver reverts to the default `#define` definition(s).  
  
## Descriptor Syntax
This section must be present, but empty  
> `>D`  

Declare a script `>B` (boot) section to inform the interface to read the meter descriptor(s)
> `>B`  
=>[sensor53](Commands#sensor53) r

Declare a script `>M` section with the number of connected meters (n = `1..5`)
> `>M <n>`  

### Meter Declaration
`+<M>,<rxGPIO>,<type>,<flag>,<parameter>,<jsonPrefix>{,<txGPIO>,<txPeriod>,<cmdTelegram>}`  

- `<M>` - meter number  
- `<rxGPIO>` - meter data receive GPIO  
- `<type>` - meter type of meter  
  - `o` = OBIS ASCII type of coding  
  - `s` = SML binary smart message coding  
  - `c` = Counter type  
  - `e` = EBus binary coding  
  - `m` = MODBus binary coding  
  - `r` = Raw binary coding (any binary telegram)  
- `<flag>` - options flag  
  - `0` = counter without pullup  
  - `1` = counter with pullup   
  - `16` = enable median filter for that meter (not available for counters)     
- `<parameter>` - parameters according to meter type  
  - for `o,s,e,m,r`: serial baud rate  
  - for `c`:  
    - positive value = counter poll interval  
    - negative value = debounce time (milliseconds) for irq driven counters  
- `<jsonPrefix>` - prefix for Web UI and MQTT JSON payload. Up to 7 characters  
- `<txGPIO>` - meter command transmit GPIO  
- `<txPeriod>` - number of 250ms increments. Period to repeat the transmission of commands to the meter  
- `<cmdTelegram>` - comma separated hex coded byte blocks to send to meter device. For modbus each block is a command to retrieve a certain register from the meter  

Examples:  
`+1,3,o,0,9600,OBIS`  
`+1,3,m,0,9600,MODBUS,1,1,01040000,01040002,01040004,01040006,01040008,0104000a,0104000c,0104000e,01040010`  

### Meter Metrics
Each meter typically provides multiple metrics (voltage, power, humidity, etc.) which it measures. An entry for each metric to be collected `#define MAX_VARS N` (n = `1..16`) must be specified. An entry defines how to decode the data and put it into variables.

`<M>,<decoder>@<scale>,<label>,<UoM>,<var>,<precision>`  
- `<M>` - meter number to which this decoder belongs  
- `<decoder>` - decoding specification. Decode OBIS as ASCII; SML, EBUS, RAW as HEX ASCII
  - OBIS: ASCII OBIS code terminated with `(` character which indicates the start of the meter value  
  - SML: SML binary OBIS as hex terminated with `0xFF` indicating start of SML encoded value  
  - EBUS,RAW: hex values of EBUS,RAW block to compare  
    - `xx` means ignore value  
    - `ss` = extract a signed byte  
    - `uu` = extract an unsigned byte  
    - `uuuu` = extract an unsigned word 
    - `uuuuuuuu` = extract an unsigned long word  
    - `ssss` = extract a signed word  
    - `ffffffff` = extract a float value  
    - `FFffFFff` = extract a reverse float value  
    - decoding a 0/1 bit is indicated by a `@` character followed by `bx:` (x = `0..7`) extracting the corresponding bit from a byte.  
      e.g., 1,xxxx5017xxuu@b0:1,Solarpump,,Solarpump,0  
    - in the case of MODBus, `ix:` designates the index (x = `0..n`) referring to the requested block in the transmit section of the meter definition
      e.g., 1,010404ffffffffxxxx@i0:1,Voltage P1,V,Voltage_P1,2  
- `@` decoding definition termination character  
- `<scale>` - scaling factor (divisor)  
  This can be a fraction (e.g., 0.1 => result * 10), or a negative value  
  When decoding a string result (e.g., a serial meter), use `#` character for this parameter (only in one line per meter). For OBIS, you need a `)` termination character after the `#` character  
- `<label>` - web UI label (max 23 chars)  
- `<UoM>` - unit of measure (max 7 chars)  
- `<var>` - MQTT variable name (max 23 chars)  
- `<precision>` - number of decimal places  
  Add 16 to transmit the data immediately. Otherwise it is transmitted on [`TelePeriod`](Commands#teleperiod)  

e.g., `1,1-0:1.8.0*255(@1,consumption,KWh,Total_in,4`

`#` character terminates the list  

**Special Commands**

with the '=' char at the beginning of a line you may do some special decoding  

- `M,=m` perform arithmetic (`+,-,*,/`) on the metric. Use `#` before a number to designate a constant value  
  example:  
  `1,=m 3+4+5/#3` add result of decoder entry 3,4,5 and divided by 3 (i.e., average)  
- `M,=d` calculate difference between metric values decoded at time intervals  
  example:  
  `1,=d 3 10` calculate 10 second interval difference of decoder entry 3  
- `M,=h` html text (up to 30 chars)  
  inserts a html line between entries (these lines do not count as decoder entry)  
  example:  
  `2,=h==================` insert a separator line  