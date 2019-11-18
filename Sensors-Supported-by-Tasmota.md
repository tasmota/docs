Here you will a complete list of the sensors, drivers and displays which are supported 
in Tasmota. 

Most up to date list can be found in this [Google Sheet](https://docs.google.com/spreadsheets/d/e/2PACX-1vRBFqaP5QAFmT8iIYBxrn-EQp7-SrkxL6tb0OjpqtBxDEsmkiWCFei3sFyA_UXoqlbs3CqtEdOfC6Pa/pubhtml?gid=1029939700&single=true).

### Drivers (drv)

| Name           | Type                                   | Filename                   | IF Type  | IF Address | Version          | Maintainer                                |
|----------------|----------------------------------------|----------------------------|----------|------------|------------------|-------------------------------------------|
| HTTP           | Webserver                              | xdrv_01_webserver          | Wifi     |            | 2019             | Theo Arends                               |
| MQTT           | Interface                              | xdrv_02_mqtt.ino           | Wifi     |            | 2019             | Theo Arends                               |
|                | Energy sensor support                  | xdrv_03_energy.ino         | GPIO     |            | 2019             | Theo Arends                               |
| PWM, WS2812    | Sonoff LED support                     | xdrv_04_light.ino          | GPIO     |            | 2019             | Theo Arends                               |
| IR             | Infra Red support                      | xdrv_05_irremote.ino       | GPIO     |            | 2019             | Heiko Krupp, Lazar Obradovic, Theo Arends |
| Sonoff RF      | 433MHz Bridge support                  | xdrv_06_snfbridge.ino      | RF       |            | 2019             | Theo Arends, Erik Andrén Zachrisson       |
| Domo           | Domoticz support                       | xdrv_07_domoticz.ino       | Wifi     |            | 2019             | Theo Arends                               |
|                | Serial Bridge support                  | xdrv_08_serial_bridge.ino  | Serial   |            |                  | Theo Arends, Dániel Zoltán Tolnai         |
| Timer          | Timer support                          | xdrv_09_timers.ino         | Internal |            | 2019             | Theo Arends                               |
| Rules          | Rule support                           | xdrv_10_rules.ino          | Console  |            | 2019             | ESP Easy Group, Theo Arends               |
| KNX IP         | KNX IP Protocol support                | xdrv_11_knx.ino            | Wifi     |            | 2019             | Adrian Scillato                           |
| HA             | Home Assistant support                 | xdrv_12_home_assistant.ino | Wifi     |            | 2019             | Theo Arends                               |
| Display        | Display support                        | xdrv_13_display.ino        | Internal |            | 2019             | Theo Arends                               |
| MP3            | MP3 Player support                     | xdrv_14_mp3.ino            | Serial   |            | 1.0.0.4 20181003 | Gerhard Mutz, Mike Fleischer, Theo Arends |
| PCA9685        | 12 Bit,  16 Pin Hardware PWM driver    | xdrv_15_pca9685.ino        | I<sup>2</sup>C      | 0x40..0x7F | 2019             | Andre Thomas, Theo Arends                 |
| Tuya           | Dimmer support                         | xdrv_16_tuyadimmer.ino     | Serial   |            | 2019             | digiblur, Joel Stein, Theo Arends         |
| RF Transceiver | RF Transceiver using  RcSwitch library | xdrv_17_rcswitch.ino       | GPIO     |            | 2019             | Theo Arends                               |
| Armtronix      | Dimmer support                         | xdrv_18_armtronix_dimmers.ino | Serial   |            | 2019             | wvdv2002, Theo Arends                     |
| PS_16_DZ       | Dimmer support                         | xdrv_19_ps16dz_dimmer.ino  | Serial   |            | 2019             | Joel Stein, Theo Arends                   |
| Debug          | Debug support                          | xdrv_99_debug.ino          | Internal |            | 2019             | Theo Arends                               |
| Generic        | Driver interface                       | xdrv_interface.ino         | Internal |            | 2019             | Theo Arends inspired by ESPEasy           |

### Displays (dsp)

| Name    | Type                       | Filename            | IF Type  | IF Address   | Version | Maintainer                           |
|---------|----------------------------|---------------------|----------|--------------|---------|--------------------------------------|
| LCD     | Display LCD support        | xdsp_01_lcd.ino     | I<sup>2</sup>C      | 0x27 or 0x3F | 2019    | Theo Arends, Adafruit                |
| SSD1306 | Display Oled support       | xdsp_02_ssd1306.ino | I<sup>2</sup>C      | 0x3C or 0x3D | 2019    | Theo Arends, Adafruit                |
| HT16K33 | Display 8x8 Matrix support | xdsp_03_matrix.ino  | I<sup>2</sup>C      | 0x70..0x77   | 2019    | Theo Arends, Adafruit                |
| ILI9341 | Display TFT support        | xdsp_04_ili9341.ino | SPI      |              | 2019    | Theo Arends, Adafruit                |
| E-Paper | Display E-Paper support    | xdsp_05_epaper_29.ino| SPI      |              | 2019    | Theo Arends, Gerhard Mutz, Waveshare |
| Generic | Display interface          | xdsp_interface.ino  | Internal |              | 2019    | Theo Arends                          |

### Energy Messaurement (nrg)

| Name                | Type                                                                                         | Filename              | IF Type       | IF Address | Version | Maintainer                      |
|---------------------|----------------------------------------------------------------------------------------------|-----------------------|---------------|------------|---------|---------------------------------|
| HLW8012 based       | Energy sensor support (Sonoff Pow, KMC70011,  HuaFan, AplicWDP303075,  Teckin Power Socket)  | xnrg_01_hlw8012.ino   | Serial        |            | 2019    | Theo Arends                     |
| CSE7766             | Energy sensor support (Sonoff S31, Sonoff POW R2)                                            | xnrg_02_cse7766.ino   | Serial        |            | 2019    | Theo Arends                     |
| PZEM004T            | Energy sensor support                                                                        | xnrg_03_pzem004t.ino  | Serial        |            | 2019    | Theo Arends                     |
| MCP39F501, Shelly 2 | Energy sensor support                                                                        | xnrg_04_mcp39f501.ino | Serial        |            | 2019    | Theo Arends                     |
| PZEM-014, PZEM -016 | Modbus AC Energy sensor support                                                              | xnrg_05_pzem_ac.ino   | Modbus Serial |            | 2019    | Theo Arends                     |
| PZEM-003, PZEM-017  | Modbus DC Energy sensor support                                                              | xnrg_06_pzem_dc.ino   | Modbus Serial |            | 2019    | Theo Arends                     |
| Generic             | Energy Driver Interface                                                                      | xnrg_interface.ino    | Internal      |            | 2019    | Theo Arends inspired by ESPEasy |

### Plug Type Devices (plg)

| Name      | Type                         | Filename         | IF Type         | IF Address | Version | Maintainer               |
|-----------|------------------------------|------------------|-----------------|------------|---------|--------------------------|
| Wemo, Hue | Support                      | xplg_wemohue.ino | Wifi            |            | 2019    | Heiko Krupp, Stephan Hadinger, Theo Arends |
| WS2812    | LED String and Strip support | xplg_ws2812.ino  | Serial NeoPixel |            | 2019    | Heiko Krupp, Theo Arends |

### Sensors (sns)

| Name                                   | Type                                                              | Filename                   | IF Type         | IF Address                               | Version          | Maintainer                                         |
|----------------------------------------|-------------------------------------------------------------------|----------------------------|-----------------|------------------------------------------|------------------|----------------------------------------------------|
| Counter                                | Counter sensors support (water  meters, electricity meters, etc.) | xsns_01_counter.ino        | Internal        |                                          | 2019             | Maarten Damen, Theo Arends                         |
| ADC                                    | ESP8266 ADC support                                               | xsns_02_analog.ino         | Internal        |                                          | 2019             | Theo Arends                                        
| iTead Sonoff SC                        | Temperature, Humidity, Light and Air Quality sensor support       | xsns_04_snfsc.ino          | GPIO            |                                          | 2019             | Theo Arends                                        |
| DS18B20                                | Temperature sensor support                                        | xsns_05_ds18b20.ino        | GPIO            |                                          | 2019             | Theo Arends                                        |
| DS18x20                                | Temperature sensor support                                        | xsns_05_ds18x20.ino        | GPIO            |                                          | 2019             | Theo Arends                                        |
| DS18x20 Legacy                         | Temperature sensor support                                        | xsns_05_ds18x20_legacy.ino | GPIO            |                                          | 2019             | Heiko Krupp, Theo Arends                           |
| DHTxx, AM23xx, SI7021                  | Temperature and Humidity  sensor support                          | xsns_06_dht.ino            | GPIO            |                                          | 2019             | Theo Arends                                        |
| SHT1x, SHT10/11/15                     | Temperature and Humidity sensor support                           | xsns_07_sht1x.ino          | I<sup>2</sup>C             | 0x40 default                             | 2019             | Theo Arends                                        |
| HTU21                                  | Temperature and Humidity sensor support                           | xsns_08_htu21.ino          | I<sup>2</sup>C             | 0x40                                     | 2019             | Heiko Krupp, Theo Arends                           |
| BMP085, BMP180, BMP280, BME280, BME680 | Pressure, Temperature, Humidity  and Gas (BME680) sensor support  | xsns_09_bmp.ino            | I<sup>2</sup>C             | 0x76 and 0x77.  Two BMP are now possible | 2019             | Heiko Krupp, Theo Arends                           |
| BH1750                                 | Ambient Light sensor support                                      | xsns_10_bh1750.ino         | I<sup>2</sup>C             |                                          | 2019             | Theo Arends                                        |
| VEML6070                               | Ultra Violet Light (UV-A), UV Index and UV Power sensor support   | xsns_11_veml6070.ino       | I<sup>2</sup>C             | 0x38 & 0x39                              | 1.0.0.3 20181006 | Mike Fleischer, Theo Arends                        |
| ADS1115                                | A/D Converter support                                             | xsns_12_ads1115.ino        | I<sup>2</sup>C             | 0x48, 0x49, 0x4A or 0x4B                 | 2019             | Theo Arends                                        |
| ADS1x15                                | A/D Converter support                                             | xsns_12_ads1115_i2cdev.ino | I<sup>2</sup>C             | 0x48, 0x49, 0x4A or 0x4B                 | 2019             | Stefan Bode, Theo Arends                           |
| INA219                                 | High-Side DC Current and Voltage sensor support                   | xsns_13_ina219.ino         | I<sup>2</sup>C             | 0x40..0x4F                               | 2019             | Stefan Bode, Theo Arends                           |
| SHT3X                                  | Temperature and Humidity  sensor support                          | xsns_14_sht3x.ino          | I<sup>2</sup>C             | 0x44, 0x45 or  0x70 (SHTC3)              | 2019             | Theo Arends                                        |
| MH-Z19(B)                              | CO<sub>2</sub> sensor support                                                | xsns_15_mhz19.ino          | Hardware Serial |                                          | 2019             | Theo Arends                                        |
| TSL2561                                | Light sensor support                                              | xsns_16_tsl2561.ino        | I<sup>2</sup>C             | 0x29, 0x39  or 0x49                      | 2019             | Theo Arends, Joachim Banzhaf                       |
| SenseAir K30, K70  and S8 (CO<sub>2</sub>) | CO<sub>2</sub> sensor support                                                | xsns_17_senseair.ino       | I<sup>2</sup>C             | 0x68                                     | 2019             | Theo Arends                                        |
| PMS5003-7003                           | Particle Concentration sensor support                             | xsns_18_pms5003.ino        | Serial          |                                          | 2019             | Theo Arends                                        |
| Xadow, Grove                           | Mutichannel Gas sensor support                                    | xsns_19_mgs.ino            | I<sup>2</sup>C             | programmable, 0x04 default               | 2019             | Palich2000, Theo Arends                            |
| Nova  SDS011, SDS021                   | Particle Concentration sensor support                             | xsns_20_novasds.ino        | Serial          |                                          | 2019             | Theo Arends                                        |
| SGP30                                  | Gas and Air Quality sensor support                                | xsns_21_sgp30.ino          | I<sup>2</sup>C             | 0x58 only                                | 2019             | Theo Arends                                        |
| HC-SR04,  HC-SR04+, JSN-SR04T          | Ultrasonic sensor support                                         | xsns_22_sr04.ino           | GPIO            |                                          | 2019             | Nuno Ferreira, Theo Arends                         |
| Eastron SDM120                         | Modbus Energy Meter support                                       | xsns_23_sdm120.ino         | Serial          |                                          | 2019             | Gennaro Tortone                                    |
| SI1145, SI1146, SI1147                 | UV Index, IR and Visible Light  sensor support                    | xsns_24_si1145.ino         | I<sup>2</sup>C             | 0x60 only                                | 2019             | Theo Arends                                        |
| Eastron SDM630                         | Modbus Energy Meter support                                       | xsns_25_sdm630.ino         | Serial          |                                          | 2019             | Gennaro Tortone                                    |
| LM75AD                                 | Temperature sensor support                                        | xsns_26_lm75ad.ino         | I<sup>2</sup>C             | 0x48..0x4F                               | 2019             | Andre Thomas, Theo Arends                          |
| APDS9960                               | Proximity Sensor support                                          | xsns_27_apds9960.ino       | I<sup>2</sup>C             | 0x39 only                                | 2019             | Shawn Hymel/Sparkfun, Christian Baars, Theo Arends |
| TM1638                                 | 8 Switch, LED and 7 Segment Unit  sensor support                  | xsns_28_tm1638.ino         | GPIO            |                                          | 2019             | Theo Arends                                        |
| MCP23008, MCP23017                     | GPIO Expander                                                     | xsns_29_mcp230xx.ino       | I<sup>2</sup>C             | 0x20..0x27                               | 2019             | Andre Thomas, Theo Arends                          |
| MPR121                                 | 12 Point Proximity Capacitive  Touch Sensor controller            | xsns_30_mpr121.ino         | I<sup>2</sup>C             | 0x5A, 0x5B, 0x5C or 0x5D                 | 2019             | Rene 'Renne' Bartsch                              |
| CCS811                                 | Gas and Air Quality  sensor support                               | xsns_31_ccs811.ino         | I<sup>2</sup>C             | 0x5A or 0x5B                             | 2019             | Gerhard Mutz, Theo Arends                          |
| MPU6050                                | 3-Axis Gyroscope and 3-Axis Accelerometer sensor support          | xsns_32_mpu6050.ino        | I<sup>2</sup>C             | 0x68 or 0x69  with AD0 HIGH              | 2019             | Oliver Welter                                      |
| DS3231                                 | RTC chip, act like sensor support                                 | xsns_33_ds3231.ino         | I<sup>2</sup>C             | 0x68                                     | 2019             | Guy Elgabsi                                        |
| HX711                                  | Load Cell sensor support                                          | xsns_34_hx711.ino          | GPIO            |                                          | 2019             | Theo Arends                                        |
| TX20                                   | La Crosse Wind (Anemometer) sensor support                        | xsns_35_Tx20.ino           | GPIO            |                                          | 2019             | Thomas Eckerstorfer, Theo Arends                   |
| MGC3130                                | Electric Field Sensor                                             | xsns_36_mgc3130.ino        | I<sup>2</sup>C             |                                          | 2019             | Christian Baars, Theo Arends                                        
| RF                                     | RF Sensor receiver                                                | xsns_37_rfsensor.ino       | GPIO            |                                          | 2019             | Theo Arends                                        
| AZ_Instrument 7798                     | CO<sub>2</sub>, Temperature and Humidity Meter support                       | xsns_38_az7798.ino         | Serial          |                                          | 2019             | Theo Arends                                        
| MAX31855                               | Thermocouple Sensor support                                       | xsns_39_max31855.ino       | SPI             |                                          | 2019             | Markus Past                                        
| PN532                                  | NFC Tag Reader                                                    | xsns_40_pn532_i2c.ino      | I<sup>2</sup>C             |                                          | 2019             | Andre Thomas, Theo Arends                           |             
| MAX44009                               | Ambient Light Sensor support                                      | xsns_41_max44009.ino       | I<sup>2</sup>C             |                                          | 2019             | Theo Arends                                        
| SCD30                                  | CO2 Sensor support                                                | xsns_42_scd30.ino          | I<sup>2</sup>C             |                                          | 2019             | Frogmore42                                        
| SPS30                                  | Particulate Matter (PM) sensor                                              | xsns_44_sps30.ino           |I<sup>2</sup>C           |                                          | 2019             |  Gerhard Mutz| Generic                                | Sensor Interface                                                  | xsns_interface.ino         | Internal        |                                          | 2019             | Theo Arends, Inspired by ESPEasy                   |
| Debug                                  | Debug support                                                     | zzzz_debug.ino             | Internal        |                                          | 2019             | Theo Arends                                        

### Documents

