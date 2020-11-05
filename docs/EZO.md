# EZO sensors

EZO is a series of chemical sensors provided by [Atlas Scientific](https://atlas-scientific.com/)

## Configuration

All EZO devices must operate under the I2C mode to be compatible with Tastmota.  One of the easiest way to achieve this is to short **SDA/Tx to PGND** while powering the device through **VCC & GND**.  For more details, see [Instructables](https://www.instructables.com/UART-AND-I2C-MODE-SWITCHING-FOR-ATLAS-SCIENTIFIC-E/).

<img src="https://myhydropi.com/wp-content/uploads/2016/07/temp-manual-i2c-config.png" />

Tasmota will automatically detect any new device that has an I2C bus address between 0x61-0x70 (which covers the default address of all EZO devices).  You may change the address of your device by sending an I2C command to the device.  For example, to change the address of an EZOpH sensor, you can issue the following command in the console:
```
Sensor78 I2C,100
```

Tasmota supports more than one sensor of the same type.  In order to individually address each sensor, you must specify the index you wish to send the command to:
```
Sensor78-2 I2C,101
```

The corresponding sensor command of each sensor can be used to send it any command specified in its datasheet.  Here's the list of currently supported devices:
| Sensor # | Sensor |
|---|---|
| 78 | [EZOpH](https://atlas-scientific.com/files/pH_EZO_Datasheet.pdf) |
| 79 | [EZOORP](https://atlas-scientific.com/files/ORP_EZO_Datasheet.pdf) |
