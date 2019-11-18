# This has been obsoleted with the use of [Templates](Templates)

Before you add a new module type, you can try using the module type "Generic" over the web interface and set up the GPIO Config and export the module configuration using the [Template](Templates) function.

Generic Module was added in v5.12.0, before that version its called "Wemos D1 Mini".

Check the [Other Devices Page](https://github.com/arendst/Tasmota/wiki/Other-Devices) for more infos and other Devices with ESP.

***


Module types are defined in sonoff_template.h

This includes a "User Test" module type that you can experiment with

You can add an additional type by editing both the mytmplt and module_t arrays to add your own module type (make sure you keep the order of entries in the two arrays the same)

The module definition is a list that contains the module name, followed by a definition of what each of the 17 GPIO pins on the ESP-8266 are defined to be. Each item in the list can be either 0 (unused), or a pin definition from the list below.

As of 3/9/17 (4.0.3) these functions are:
```
* GPIO_DHT11,          // DHT11
* GPIO_DHT21,          // DHT21, AM2301
* GPIO_DHT22,          // DHT22, AM2302, AM2321
* GPIO_DSB,            // Single wire DS18B20 or DS18S20
* GPIO_I2C_SCL,        // I2C SCL
* GPIO_I2C_SDA,        // I2C SDA
* GPIO_WS2812,         // WS2812 Led string
* GPIO_IRSEND,         // IR remote
* GPIO_SWT1,           // User connected external switches
* GPIO_SWT2,
* GPIO_SWT3,
* GPIO_SWT4,
* GPIO_KEY1,           // Button usually connected to GPIO0
* GPIO_KEY2,
* GPIO_KEY3,
* GPIO_KEY4,
* GPIO_REL1,           // Relays (0 = off, 1 = on)
* GPIO_REL2,
* GPIO_REL3,
* GPIO_REL4,
* GPIO_REL1_INV,       // Relays with inverted signal control (0 = on, 1 = off)
* GPIO_REL2_INV,
* GPIO_REL3_INV,
* GPIO_REL4_INV,
* GPIO_LED1,           // Leds (0 = off, 1 = on)
* GPIO_LED2,
* GPIO_LED3,
* GPIO_LED4,
* GPIO_LED1_INV,       // Leds with inverted signal control (0 = on, 1 = off)
* GPIO_LED2_INV,
* GPIO_LED3_INV,
* GPIO_LED4_INV
* GPIO_PWM1,           // Warm
* GPIO_PWM2,           // Red (swapped with Blue from original)
* GPIO_PWM3,           // Green
* GPIO_PWM4,           // Blue (swapped with Red from original)
* GPIO_RXD,            // Serial interface
* GPIO_TXD,            // Serial interface
* GPIO_HLW_SEL,        // HLW8012 Sel output (Sonoff Pow)
* GPIO_HLW_CF1,        // HLW8012 CF1 voltage / current (Sonoff Pow)
* GPIO_HLW_CF,         // HLW8012 CF power (Sonoff Pow)
* GPIO_USER            // User configurable
```

The online user can only change GPIO functionality for pins that are defined as GPIO_USER in the module.