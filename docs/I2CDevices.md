# I2C devices

Tasmota supports several I2C devices but to use them they mostly need to be enabled at compile time to solve possible address conflicts.

### Look at [Pre-Compiled Builds](https://github.com/arendst/Tasmota/blob/development/BUILDS.md) to see, which Driver is compiled in the release binarys.

Using command ``I2cDriver`` individual drivers can be enabled or disabled at runtime allowing duplicate I2C addresses at compile time. Use the Index from the table below to control I2C drivers like ``I2cDriver10 0`` for disabling BMP support.

## Supported I2C devices
The following table lists the supported I2C devices

Index | Define              | Driver  | Device   | Address(es) | Description
------|---------------------|---------|----------|-------------|-----------------------------------------------
   1  | USE_PCA9685         | xdrv_15 | PCA9685  | 0x40 - 0x47 | 16-channel 12-bit pwm driver
   2  | USE_PCF8574         | xdrv_28 | PCF8574  | 0x20 - 0x26 | 8-bit I/O expander
   2  | USE_PCF8574         | xdrv_28 | PCF8574A | 0x39 - 0x3F | 8-bit I/O expander
   3  | USE_DISPLAY_LCD     | xdsp_01 |          | 0x27, 0x3F  | LCD display
   4  | USE_DISPLAY_SSD1306 | xdsp_02 | SSD1306  | 0x3C - 0x3D | Oled display
   5  | USE_DISPLAY_MATRIX  | xdsp_03 | HT16K33  | 0x70 - 0x77 | 8x8 led matrix
   6  | USE_DISPLAY_SH1106  | xdsp_07 | SH1106   | 0x3C - 0x3D | Oled display
   7  | USE_ADE7953         | xnrg_07 | ADE7953  | 0x38        | Energy monitor
   8  | USE_SHT             | xsns_07 | SHT1X    | Any         | Temperature and Humidity sensor
   9  | USE_HTU             | xsns_08 | HTU21    | 0x40        | Temperature and Humidity sensor
   9  | USE_HTU             | xsns_08 | SI7013   | 0x40        | Temperature and Humidity sensor
   9  | USE_HTU             | xsns_08 | SI7020   | 0x40        | Temperature and Humidity sensor
   9  | USE_HTU             | xsns_08 | SI7021   | 0x40        | Temperature and Humidity sensor
  10  | USE_BMP             | xsns_09 | BMP085   | 0x76 - 0x77 | Pressure and temperature sensor
  10  | USE_BMP             | xsns_09 | BMP180   | 0x76 - 0x77 | Pressure and temperature sensor
  10  | USE_BMP             | xsns_09 | BMP280   | 0x76 - 0x77 | Pressure and temperature sensor
  10  | USE_BMP             | xsns_09 | BME280   | 0x76 - 0x77 | Pressure, temperature and humidity sensor
  10  | USE_BMP             | xsns_09 | BME680   | 0x76 - 0x77 | Pressure, temperature, humidity and gas sensor
  11  | USE_BH1750          | xsns_10 | BH1750   | 0x23, 0x5C  | Ambient light intensity sensor
  12  | USE_VEML6070        | xsns_11 | VEML6070 | 0x38 - 0x39 | Ultra violet light intensity sensor
  13  | USE_ADS1115         | xsns_12 | ADS1115  | 0x48 - 0x4B | 4-channel 16-bit A/D converter
  14  | USE_INA219          | xsns_13 | INA219   | 0x40 - 0x41, 0x44 - 0x45 | Low voltage current sensor
  15  | USE_SHT3X           | xsns_14 | SHT3X    | 0x44 - 0x45 | Temperature and Humidity sensor
  15  | USE_SHT3X           | xsns_14 | SHTC3    | 0x70        | Temperature and Humidity sensor
  16  | USE_TSL2561         | xsns_16 | TSL2561  | 0x29, 0x39, 0x49 | Light intensity sensor
  17  | USE_MGS             | xsns_19 | Grove    | 0x04        | Multichannel gas sensor
  18  | USE_SGP30           | xsns_21 | SGP30    | 0x58        | Gas (TVOC) and air quality sensor
  19  | USE_SI1145          | xsns_24 | SI1145   | 0x60        | Ultra violet index and light sensor
  19  | USE_SI1145          | xsns_24 | SI1146   | 0x60        | Ultra violet index and light sensor
  19  | USE_SI1145          | xsns_24 | SI1147   | 0x60        | Ultra violet index and light sensor
  20  | USE_LM75AD          | xsns_26 | LM75AD   | 0x48 - 0x4F | Temperature sensor
  21  | USE_APDS9960        | xsns_27 | APDS9960 | 0x39        | Proximity ambient light RGB and gesture sensor
  22  | USE_MCP230xx        | xsns_29 | MCP23008 | 0x20 - 0x26 | 16-bit I/O expander
  22  | USE_MCP230xx        | xsns_29 | MCP23017 | 0x20 - 0x26 | 16-bit I/O expander
  23  | USE_MPR121          | xsns_30 | MPR121   | 0x5A - 0x5D | Proximity capacitive touch sensor
  24  | USE_CCS811          | xsns_31 | CCS811   | 0x5A        | Gas (TVOC) and air quality sensor
  25  | USE_MPU6050         | xsns_32 | MPU6050  | 0x68 - 0x69 | 3-axis gyroscope and temperature sensor
  26  | USE_DS3231          | xsns_33 | DS3231   | 0x68        | Real time clock
  27  | USE_MGC3130         | xsns_36 | MGC3130  | 0x42        | Electric field sensor
  28  | USE_MAX44009        | xsns_41 | MAX44009 | 0x4A - 0x4B | Ambient light intensity sensor
  29  | USE_SCD30           | xsns_42 | SCD30    | 0x61        | CO2 sensor
  30  | USE_SPS30           | xsns_44 | SPS30    | 0x69        | Particle sensor
  31  | USE_VL53L0X         | xsns_45 | VL53L0X  | 0x29        | Time-of-flight (ToF) distance sensor
  32  | USE_MLX90614        | xsns_46 | MLX90614 | 0x5A        | Infra red temperature sensor
  33  | USE_CHIRP           | xsns_48 | CHIRP    | 0x20        | Soil moisture sensor
  34  | USE_PAJ7620         | xsns_50 | PAJ7620  | 0x73        | Gesture sensor
  35  | USE_INA226          | xsns_54 | INA226   | 0x40 - 0x41, 0x44 - 0x45 | Low voltage current sensor
  36  | USE_HIH6            | xsns_55 | HIH6130  | 0x27        | Temperature and Humidity sensor
  37  | USE_24C256          | xdrv_10 | 24C256   | 0x50        | Scripter EEPROM storage
  38  | USE_DISPLAY_ILI9488 | xdsp_08 | FT6236   | 0x38        | Touch panel controller
  39  | USE_DISPLAY_RA8876  | xdsp_10 | FT5316   | 0x38        | Touch panel controller
  40  | USE_TSL2591         | xsns_57 | TLS2591  | 0x29        | Light intensity sensor
  41  | USE_DHT12           | xsns_58 | DHT12    | 0x5C        | Temperature and humidity sensor
  42  | USE_DS1624          | xsns_59 | DS1621   | 0x48 - 0x4F | Temperature sensor
  42  | USE_DS1624          | xsns_59 | DS1624   | 0x48 - 0x4F | Temperature sensor
  43  | USE_AHT1x           | xsns_63 | AHT10/15 | 0x38 or 0x39 | Temperature and humidity sensor
  43  | USE_AHT2x           | xsns_63 | AHT20    | 0x38        | Temperature and humidity sensor
  44  | USE_WEMOS_MOTOR_V1  | xdrv_34 |          | 0x2D - 0x30 | WEMOS motor shield v1.0.0 (6612FNG)
  45  | USE_HDC1080         | xsns_65 | HDC1080  | 0x40        | Temperature and Humidity sensor
  46  | USE_IAQ             | xsns_66 | IAQ      | 0x5a        | Air quality sensor
  47  | USE_DISPLAY_SEVENSEG| xdsp_11 | HT16K33  | 0x70 - 0x77 | Seven segment LED
  48  | USE_AS3935          | xsns_67 | AS3935   | 0x03        | Franklin Lightning Sensor
  49  | USE_VEML6075        | xsns_70 | VEML6075 | 0x10        | UVA/UVB/UVINDEX Sensor
  50  | USE_VEML7700        | xsns_71 | VEML7700 | 0x10        | Ambient light intensity sensor
  51  | USE_MCP9808         | xsns_72 | MCP9808  | 0x18 - 0x1F | Temperature sensor
  52  | USE_HP303B          | xsns_73 | HP303B   | 0x76 - 0x77 | Pressure and temperature sensor
  53  | USE_MLX90640        | xdrv_43 | MLX90640 | 0x33        | 32x24 IR/Thermal image sensor
  54  | USE_VL53L1X         | xsns_77 | VL53L1X  | 0x29        | Time-of-flight (ToF) distance sensor
  55  | USE_EZO             | xsns_78 | EZO_*    | 0x61 - 0x70 | EZO family of sensors (DO, ORP, PH...)
  56  | USE_SEESAW_SOIL     | xsns_81 | ADA4026  | 0x36 - 0x39 | Adafruit capacitve soil sensor (https://www.adafruit.com/product/4026)