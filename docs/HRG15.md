# Hydreon RG-15 Solid State Rain Sensor

!!! failure "This feature is not included in precompiled binaries"

You must [compile your build](Compile-your-build). Add the following to `user_config_override.h`:
```
#ifndef USE_HRG15
#define USE_HRG15    // Add support for Hydreon RG-15 Solid State Rain sensor (+1k5 code)
#endif
```
----
The Hydreon RG-15 Solid State Tipping Bucket is a rainfall measuring device intended to replace conventional tipping buckets.

The RG-15 uses beams of infrared light within a plastic lens about the size of a tennis ball. The round surface of the lens discourages collection of debris, and the RG-15 has no moving parts to stick, and no water-pathways to clog. The device features an open-collector output that emulates a conventional tipping bucket, as well as serial communications that provide more detailed data and allow for configuration of the device.

Find out more on the [manufacturer's website](https://rainsensors.com/products/rg-15/).

## Configuration

### Wiring
| HRG15 | ESP
|   ---|    ---
|GND (1)  | GND
|V+ 3.3V (8)   | 3.3V 
|RS232 Out (4) | GPIOx
|RS232 In (5)  | GPIOy

### Tasmota Settings 
In the **_Configuration -> Configure Module_** page assign:

- GPIOx to `HRG15 Rx`   
- GPIOy to `HRG15 Tx`

### Commands
[`Sensor90`](Commands.md#sensor90) can be used to configure the rain sensor

## Tasmota Display 

After a reboot the driver will detect the sensor and show the sensor data. An example is given below:

| Item | Value
|   ---|    ---
|RG-15 Active  | 0.01 mm
|RG-15 Event   | 0.13 mm
|RG-15 Total   | 26.8 mm
|RG-15 FlowRate | 0.32 mm.h 

This data is also part of the `tele/%topic%/SENSOR` payload:

```json
{
    "Time": "2021-08-25T17:15:45",
    "RG-15": {
        "Active": 0.01,
        "Event": 0.13,
        "Total": 26.80,
        "FlowRate": 0.32
    },
    "TempUnit": "C"
}
```

### MQTT 

The sensor data is made available over MQTT as per the configured [`TelePeriod`](Commands.md#teleperiod). Additionally, instant telemetry messages are sent during active rainfall events. The sensor will report additional accumulation every 5-60 seconds. The driver resets the `Active` and `FlowRate` values to 0 if no additional accumuatlion is detected after 60 seconds.
