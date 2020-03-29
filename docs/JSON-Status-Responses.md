
# Table of Contents
- [JSON Changes](#json-changes)
- [Basic Response](#basic-response)
- [MQTT](#mqtt)
- [Domoticz](#domoticz)
- [POW](#pow)
- [Sensors](#sensors)
   - [AM2301](#am2301)
   - [BMP280](#bmp280)
   - [DHT11](#dht11)
   - [DS18B20](#ds18b20)
   - [SHT3X (and DHT11, multiple Sensor example)](#sht3x-and-dht11-multiple-sensor-example)
   - [Sonoff SC](#sonoff-sc)
   - [PMS5003 and HTU21](#pms5003-and-htu21)

## JSON Changes
temp note: for now (6.0.0a) the statetext overwrites the json power result (e.g. "ON" => "AN" or any other statetext the users enter)

## Basic Response
    {
      "Status": {
        "Module": 1,
        "FriendlyName": "XXX",
        "Topic": "sonoff",
        "ButtonTopic": "0",
        "Power": 0,
        "PowerOnState": 0,
        "LedState": 1,
        "SaveData": 0,
        "SaveState": 1,
        "ButtonRetain": 0,
        "PowerRetain": 0
      },
      "StatusPRM": {
        "Baudrate": 115200,
        "GroupTopic": "sonoffs",
        "OtaUrl": "XXX",
        "Uptime": "1 02:33:26",
        "Sleep": 150,
        "BootCount": 32,
        "SaveCount": 72,
        "SaveAddress": "FB000"
      },
      "StatusFWR": {
        "Version": "5.12.0a",
        "BuildDateTime": "2018.02.11 16:15:40",
        "Boot": 31,
        "Core": "2_4_0",
        "SDK": "2.1.0(deb1901)"
      },
      "StatusLOG": {
        "SerialLog": 0,
        "WebLog": 4,
        "SysLog": 0,
        "LogHost": "domus1",
        "LogPort": 514,
        "SSId1": "XXX",
        "SSId2": "XXX",
        "TelePeriod": 300,
        "SetOption": "00000001"
      },
      "StatusMEM": {
        "ProgramSize": 457,
        "Free": 544,
        "Heap": 23,
        "ProgramFlashSize": 1024,
        "FlashSize": 1024,
        "FlashMode": 3
      },
      "StatusNET": {
        "Hostname": "XXX",
        "IPAddress": "192.168.178.XX",
        "Gateway": "192.168.178.XX",
        "Subnetmask": "255.255.255.XX",
        "DNSServer": "192.168.178.XX",
        "Mac": "2C:3A:E8:XX:XX:XX",
        "Webserver": 2,
        "WifiConfig": 4
      },
      "StatusTIM": {
        "UTC": "Thu Feb 15 00:00:50 2018",
        "Local": "Thu Feb 15 01:00:50 2018",
        "StartDST": "Sun Mar 25 02:00:00 2018",
        "EndDST": "Sun Oct 28 03:00:00 2018",
        "Timezone": 1
      },
      "StatusSNS": {
        "Time": "2018.02.15 01:00:50",
        "Switch1": "OFF"
      },
      "StatusSTS": {
        "Time": "2018.02.15 01:00:50",
        "Uptime": "1 02:33:26",
        "Vcc": 3.504,
        "POWER": "OFF",
        "Wifi": {
          "AP": 1,
          "SSId": "XXX",
          "RSSI": 100,
          "APMac": "34:31:C4:XX:XX:XX"
        }
      }
    }


## MQTT

After StatusNET

    "StatusMQT": {
        "MqttHost": "192.168.XXX.XX",
        "MqttPort": 1883,
        "MqttClientMask": "DVES_%06X",
        "MqttClient": "DVES_4AXXXX",
        "MqttUser": "admin",
        "MAX_PACKET_SIZE": 1000,
        "KEEPALIVE": 15
      },

## Domoticz
idx, nvalue, svalue without array

      ..."StatusTIM": {
        "UTC": "Thu Feb 01 20:29:40 2018",
        "Local": "Thu Feb 01 21:29:40 2018",
        "StartDST": "Sun Mar 25 02:00:00 2018",
        "EndDST": "Sun Oct 28 03:00:00 2018",
        "Timezone": 1
      },
      "idx": 286,
      "nvalue": 0,
      "svalue": "19.7",
      "StatusSNS": {
        "Time": "2018.02.01 21:29:40",
        "DS18B20": {
          "Temperature": 19.7
        },
        "TempUnit": "C"
      },
      "StatusSTS": { ...

  
## POW

After StatusTIM

    "StatusPTH": {
        "PowerLow": 0,
        "PowerHigh": 0,
        "VoltageLow": 0,
        "VoltageHigh": 0,
        "CurrentLow": 0,
        "CurrentHigh": 0
      },
      "StatusSNS": {
        "Time": "2018.02.04 23:17:01",
        "ENERGY": {
          "Total": 3.185,
          "Yesterday": 3.058,
          "Today": 0.127,
          "Power": 0,
          "Factor": 0.00,
          "Voltage": 221,
          "Current": 0.000
        }
      },
   
   

[Back to Top](#table-of-contents)   
   
## Sensors

### AM2301

    "StatusSNS": {
        "Time": "2018.02.01 22:52:09",
        "AM2301": {
          "Temperature": 15.5,
          "Humidity": 50.6
        },
        "TempUnit": "C"
      },
   
### BMP280

    {
      "StatusSNS": {
        "Time": "2018-02-10T22:46:34",
        "BMP280": {
          "Temperature": 80.9,
          "Pressure": 984.4
        }
      }
    }


### DHT11

    "StatusSNS": {
        "Time": "2018.02.01 22:48:39",
        "DHT11": {
          "Temperature": 12.0,
          "Humidity": 42.0
        },
        "TempUnit": "C"
      },

### DS18B20

      "StatusSNS": {
        "Time": "2018.02.01 21:29:40",
        "DS18B20": {
          "Temperature": 19.7
        },
        "TempUnit": "C"
      },

### SHT3X (and DHT11, multiple Sensor example)

    {
      "StatusSNS": {
        "Time": "2018-02-07T20:16:19",
        "DHT11": {
          "Temperature": 78.8,
          "Humidity": 27.0
        },
        "SHT3X": {
          "Temperature": 74.8,
          "Humidity": 18.9
        },
        "TempUnit": "F"
      }
    }


### Sonoff SC

      "StatusSNS": {
        "Time": "2018-02-16T16:18:49",
        "Temperature": 25,
        "Humidity": 83,
        "Light": 10,
        "Noise": 20,
        "AirQuality": 100,
        "TempUnit": "C"
      },

### PMS5003 and HTU21

    "StatusSNS": {
        "Time": "2018-02-16T16:22:12",
        "HTU21": {
          "Temperature": 24.7,
          "Humidity": 32.1
        },
        "PMS5003": {
          "CF1": 1,
          "CF2.5": 2,
          "CF10": 2,
          "PM1": 1,
          "PM2.5": 2,
          "PM10": 2,
          "PB0.3": 423,
          "PB0.5": 116,
          "PB1": 17,
          "PB2.5": 1,
          "PB5": 0,
          "PB10": 0
        },
        "TempUnit": "C"
      },   

[Back to Top](#table-of-contents)