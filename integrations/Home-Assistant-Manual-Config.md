[Home Assistant](https://home-assistant.io/) (Hass) is an open-source home automation platform running on Python 3.

**Important:** The information on this page is related to:
 - Tasmota development version 6.3.0.**17** (2018-12-13) or later
   - **Version 6.3.0 will NOT work**
 - Home Assistant 0.84.2 or later

## Hass configuration - General
This page describes configuring Hass and Tasmota **without** MQTT device discovery, with manual configuration of each device in Hass.

While [automatic discovery|Home-Assistant] is the recommended method, an advantage of manually configuring device is the user maintains control of all aspects of the device configuration and usage.

Hass configuration not exposed in the UI is done by editing the file `configuration.yaml` which is found in folder `.homeassistant` after installation and first start of Hass.

Note: After every change to the configuration file you'll need to restart Hass to make it aware of the changes.
This can be done either:
- Through the UI: Configuration -> General -> Server Management -> Restart
- From command line: On a Debian Linux based system, use the command `sudo systemctl restart home-assistant`.

In the examples shown the following Tasmota parameters are set:
- ``MQTT_STATUS_OFF`` in ``user_config.h`` = ``OFF``
- ``MQTT_STATUS_ON`` in ``user_config.h`` = ``ON``
- ``SUB_PREFIX`` in ``user_config.h`` = ``cmnd``
- ``PUB_PREFIX`` in ``user_config.h`` = ``stat``
- ``PUB_PREFIX2`` in ``user_config.h`` = ``tele``
- ``Mqtt`` = 1
- ``MqttHost`` = ``domus1``
- ``MqttPort`` = 1883
- ``Topic`` = ``sonoff``
- ``PowerRetain`` = 0
- ``TelePeriod`` = 300

* Note: If the power state needs to be persistent across Tasmota reboots set the PowerRetain to 1.

If you are using a localized version (eg. de-DE) be sure to check the correct spelling and cases for the defines:
  * 'D_ONLINE' for 'payload_available' 
  * 'D_OFFLINE' for 'payload_not_available'
  * 'D_ON' for 'payload_on'
  * 'D_OFF' for 'payload_off'

## Hass configuration - MQTT broker

As Tasmota is [MQTT](https://www.home-assistant.io/components/mqtt/) based you will need to configure Home Assistant to connect to an MQTT broker. 

Home Assistant comes with an [embedded MQTT broker](https://www.home-assistant.io/docs/mqtt/broker#embedded-broker) which is easy to set up but you may want to opt for a [separate MQTT broker](https://www.home-assistant.io/docs/mqtt/broker#run-your-own) instead for better stability. A popular choice for this is the open-source [Eclipse Mosquitto](https://mosquitto.org/).

### Configure an external broker
To connect Hass to an external MQTT server, use Hass web UI:\

Configuration -> Integrations -> Set up a new Integration -> MQTT\

Note: Make sure to tick the "Enable discovery" option to enable MQTT device discovery.

### Configure the embedded broker

```yaml
# Example configuration.yaml entry
mqtt:
  password: hello
```

Default username for the embedded broker is `homeassistant` while port defaults to `1883`.

## Tips

### Tip: Sync power state

If the MQTT broker or Hass is restarted, or there is a WiFi outage, Tasmota device state may not be synced with Home Assistant.

Use this automation to get all your devices in sync, including power state, **immediately** after Home Assistant is (re)started.

```yaml
# Example automations.yaml entry
- alias: "Power state on HA start-up"
  trigger:
    platform: homeassistant
    event: start
  action:
    - service: mqtt.publish
      data:
        topic: "cmnd/tasmotas/state"
        payload: ""
    - service: mqtt.publish
      data:
        topic: cmnd/tasmotas/POWER
    - service: mqtt.publish
      data:
        topic: cmnd/tasmotas/POWER2
    - service: mqtt.publish
      data:
        topic: cmnd/tasmotas/POWER3  
```

This automation posts to the default "sonoffs" group topic.  Each device will send back their status message which contains relay power and light status.

### Tip: View the firmware version number of a Tasmota device

Add a sensor like below in your sensor section for each Tasmota device in one card in an order that makes sense for you. Change the `state_topic` and `availability_topic` to the unique topic of each device.

```yaml
# Example configuration.yaml entry
sensor:
  - platform: mqtt
    name: "S20_Rock"
    state_topic: "stat/S20Beta/STATUS2"
    value_template: "{{value_json['StatusFWR'].Version }}"
    qos: 0
    availability_topic: "tele/S20Beta/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
```

Automation to have each device to push out the firmware version on Home Assistant reboot. *Tip: The user can manually trigger this automation without a reboot during upgrades of devices.*

```yaml
# Example automations.yaml entry
- alias: "Sonoff state on HA start-up"
  trigger:
    platform: homeassistant
    event: start
  action:
    - service: mqtt.publish
      data:
        topic: "cmnd/tasmotas/STATUS"
        payload: "2"
```

### Tip: Get the IP address of a newly flashed Sonoff (ESP8266)
Here is some code that will display the IP address of you newly flashed ESP8266
if you have to change PROJECT name in user_config.h you must also change the script topic has to match it.

The script:

```yaml	
# Example scripts.yaml entry
 get_sonoff_ip:	
  alias: Get Sonoff New IP (sonoff)	
  sequence:	
  - data:	
      topic: cmnd/tasmota/ipaddress	
    service: mqtt.publish	
```	
topic: cmnd/_the PROJECT NAME_/ipaddress	

The sensor:
```yaml
# Example configuration.yaml entry
sensor:
  - platform: mqtt
    name: "SonOff IP"
    state_topic: 'stat/tasmota/RESULT'
    value_template: "{{ value_json.IPAddress1.split(' ')[1].replace('(','').replace(')','') }}"
```
Put it into a group
```yaml
# Example groups.yaml entry
  sonoff:
    name: "Sonoff Tasmota"
    control: hidden
    entities:
      - script.get_sonoff_ip
      - sensor.sonoff_ip
```
Restart HA and plug in your newly flashed ESP8266 device. Click `EXECUTE` (in the new group) and the "Sonoff IP" sensor will display the IP address. After finding out the new IP don't forget to change the topic name in "Configure MQTT" in the Configuration Menu.

### Tip: Wi-Fi RSSI Signal Strength

Display the Wi-Fi signal strength published from each telemetry message (default time is every 300 seconds).  Change the two topics below to your Tasmota device name.  It may not immediately show on your Home Assistant panel until the next telemetry message is published.

```yaml
# Example configuration.yaml entry
sensor:
  - platform: mqtt
    state_topic: "tele/SNF-Washer/STATE"
    name: "Washer Signal"
    unit_of_measurement: "%"
    value_template: "{{value_json['Wifi'].RSSI }}"
    availability_topic: "tele/SNF-Washer/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
```

## Configure Switches
Use the [`switch.mqtt`](https://www.home-assistant.io/components/switch.mqtt/) component.

Use POWER1, POWER2, etc when you are using a device with more than one relay or if [SetOption26](commands#setoption26) is enabled)

Configure the module, and on the Console run:\
`SetOption59 1` - This enables sending of tele/<topic>/STATE on POWER and light related commands

```yaml
# Example configuration.yaml entry
switch:
  - platform: mqtt
    name: "Sonoff power"
    state_topic: "stat/tasmota/RESULT"
    value_template: "{{ value_json.POWER }}"
    command_topic: "cmnd/tasmota/POWER"
    availability_topic: "tele/tasmota/LWT"
    qos: 1
    payload_on: "ON"
    payload_off: "OFF"
    payload_available: "Online"
    payload_not_available: "Offline"
    retain: false
```

If you are using your Sonoff to control a light, you may want to use the [`light.mqtt`](https://www.home-assistant.io/components/light.mqtt/) component. Replace `switch:` with `light:` in the above configuration. All other settings remain the same.

## Configure Sensors
Use the [`sensor.mqtt`](https://www.home-assistant.io/components/sensor.mqtt/) component.
### DHT22 sensor

#### Periodical updates

A DHT22 Temperature and Humidity sensor connected to a Sonoff TH10 will send in [`TelePeriod`](commands#teleperiod) set intervals the following information to the MQTT broker:
```json
tele/tasmota/SENSOR = {"Time":"2017-02-12T16:11:12", "DHT22":{"Temperature":23.9, "Humidity":34.1}}
```
To make the information visible in HA add the following lines to the configuration file.
```yaml
# Example configuration.yaml entry
sensor:
  - platform: mqtt
    name: "Tele Temperature"
    state_topic: "tele/tasmota/SENSOR"
    value_template: "{{ value_json['DHT22'].Temperature }}"
    unit_of_measurement: "°C"
    availability_topic: "tele/tasmota/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
  - platform: mqtt
    name: "Tele Humidity"
    state_topic: "tele/tasmota/SENSOR"
    value_template: "{{ value_json['DHT22'].Humidity }}"
    unit_of_measurement: "%"
    availability_topic: "tele/tasmota/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
```

#### Manual updates

Another means of sensor information retrieval from Tasmota is using the status command ``Status 10`` or ``cmnd/tasmota/status 10``. This would result in a message like:
```
stat/tasmota/STATUS10 {"StatusSNS":{"Time":"2017-02-11T18:06:05", "DHT22":{"Temperature":"21.8", "Humidity":"48.0"}}}
```
The HA configuration would then look like this:
```yaml
# Example configuration.yaml entry
sensor:
  - platform: mqtt
    name: "Stat Temperature"
    state_topic: "stat/tasmota/STATUS10"
    value_template: "{{ value_json.StatusSNS.DHT22.Temperature }}"
    unit_of_measurement: "°C"
  - platform: mqtt
    name: "Stat Humidity"
    state_topic: "stat/tasmota/STATUS10"
    value_template: "{{ value_json.StatusSNS.DHT22.Humidity }}"
    unit_of_measurement: "%"
```
The Tasmota command could be initiated by a mosquitto mqtt pub command on ``mosquitto_pub -h localhost -t 'cmnd/tasmota/status' -m '10'``

### HTU and BMP I2C sensors

HTU21 and BMP280 sensors connected to ``sonoff2`` send messages like:
```
tele/sonoff2/SENSOR = {"Time":"2017-02-12T16:16:43", "HTU21":{"Temperature":24.0, "Humidity":34.0}, "BMP280":{"Temperature":24.9, "Pressure":1032.5}}
```
Where the Pressure information would be made available to HA with
```yaml
# Example configuration.yaml entry
sensor:
  - platform: mqtt
    name: "Tele Pressure"
    state_topic: "tele/sonoff2/SENSOR"
    value_template: "{{ value_json.BMP280.Pressure }}"
    unit_of_measurement: "hPa"
```

### Sonoff Pow Energy sensors

#### Periodical updates

A Sonoff Pow device called ``pow1`` will periodically send the following message:
```
tele/pow1/SENSOR = {"Time":"2018-02-14T21:51:31","ENERGY":{"Total":0.984,"Yesterday":0.000,"Today":0.984,"Period":12,"Power":145,"Factor":0.90,"Voltage":220,"Current":0.731}}
```
The HA configuration for Energy, Power, Voltage and Current would be:
```yaml
# Example configuration.yaml entry
sensor:
  - platform: mqtt
    name: "Energy"
    state_topic: "tele/pow1/SENSOR"
    value_template: '{{ value_json["ENERGY"]["Today"] }}'
    unit_of_measurement: "kWh"
  - platform: mqtt
    name: "Power"
    state_topic: "tele/pow1/SENSOR"
    value_template: '{{ value_json["ENERGY"]["Power"] }}'
    unit_of_measurement: "W"
  - platform: mqtt
    name: "Voltage"
    state_topic: "tele/pow1/SENSOR"
    value_template: '{{ value_json["ENERGY"]["Voltage"] }}'
    unit_of_measurement: "V"
  - platform: mqtt
    name: "Current"
    state_topic: "tele/pow1/SENSOR"
    value_template: '{{ value_json["ENERGY"]["Current"] }}'
    unit_of_measurement: "A"
```

#### Manual updates

The manual message retrieved with command ``Status 8`` or ``cmnd/pow1/status 8`` will show:
```
stat/pow1/STATUS8 = {"StatusPWR":{"Yesterday":0.002, "Today":0.002, "Power":4, "Factor":0.37, "Voltage":227, "Current":0.056}}
```
The HA configuration for Power Factor would then be:
```yaml
# Example configuration.yaml entry
sensor:
  - platform: mqtt
    name: "Power Factor"
    state_topic: "stat/pow1/STATUS8"
    value_template: "{{ value_json.StatusPWR.Factor }}"
```
Complete tutorial on a power monitoring plug setup:


[![Laundry sensor](https://img.youtube.com/vi/ktHQrhAF8VQ/0.jpg)](https://www.youtube.com/watch?v=ktHQrhAF8VQ)

## Configure Lights
Use the [`light.mqtt`](https://www.home-assistant.io/components/light.mqtt/) component.
### Dimmer / PWM LED
Configure the module, and on the Console run:\
`SetOption59 1` - This enables sending of tele/<topic>/STATE on POWER and light related commands

```yaml
# Example configuration.yaml entry
light:
  - platform: mqtt
    name: "Light 1"
    command_topic: "cmnd/light1/POWER"
    state_topic: "tele/light1/STATE"
    state_value_template: "{{value_json.POWER}}"
    availability_topic: "tele/light1/LWT"
    brightness_command_topic: "cmnd/light1/Dimmer"
    brightness_state_topic: "tele/light1/STATE"
    brightness_scale: 100
    on_command_type: "brightness"
    brightness_value_template: "{{value_json.Dimmer}}"
    payload_on: "ON"
    payload_off: "OFF"
    payload_available: "Online"
    payload_not_available: "Offline"
    qos: 1
    retain: false
```

### RGB Lights
#### Any 3-channel PWM LED dimmer or AiLight
Configure the module, and on the Console run:\
`SetOption17 1` - This enables decimal colors\
`SetOption59 1` - This enables sending of tele/<topic>/STATE on POWER and light related commands

```yaml
# Example configuration.yaml entry
light:
  - platform: mqtt
    name: "Light 1"
    command_topic: "cmnd/light1/POWER"
    state_topic: "tele/light1/STATE"
    state_value_template: "{{value_json.POWER}}"
    availability_topic: "tele/light1/LWT"
    brightness_command_topic: "cmnd/light1/Dimmer"
    brightness_state_topic: "tele/light1/STATE"
    brightness_scale: 100
    on_command_type: "brightness"
    brightness_value_template: "{{value_json.Dimmer}}"
    rgb_command_topic: "cmnd/light1/Color2"
    rgb_state_topic: "tele/light1/STATE"
    rgb_value_template: "{{value_json.Color.split(',')[0:3]|join(',')}}"
    effect_command_topic: "cmnd/light1/Scheme"
    effect_state_topic: "tele/light1/STATE"
    effect_value_template: "{{value_json.Scheme}}"
    effect_list:
      - 0
      - 1
      - 2
      - 3
      - 4
    payload_on: "ON"
    payload_off: "OFF"
    payload_available: "Online"
    payload_not_available: "Offline"
    qos: 1
    retain: false
```

#### LED WS281X

Configure any of the pins of the module as "WS2812B", and on the Console run:\
`SetOption17 1` - This enables decimal colors\

```yaml
# Example configuration.yaml entry
light:
  - platform: mqtt
    name: "Light 1"
    command_topic: "cmnd/light1/POWER"
    state_topic: "stat/light1/STATE"
    state_value_template: "{{value_json.POWER}}"
    availability_topic: "tele/light1/LWT"
    brightness_command_topic: "cmnd/light1/Dimmer"
    brightness_state_topic: "stat/light1/STATE"
    brightness_scale: 100
    on_command_type: "brightness"
    brightness_value_template: "{{value_json.Dimmer}}"
    rgb_command_topic: "cmnd/light1/Color2"
    rgb_state_topic: "tele/light1/STATE"
    rgb_value_template: "{{value_json.Color.split(',')[0:3]|join(',')}}"
    effect_command_topic: "cmnd/light1/Scheme"
    effect_state_topic: "stat/light1/STATE"
    effect_value_template: "{{value_json.Scheme}}"
    effect_list:
      - 0
      - 1
      - 2
      - 3
      - 4
      - 5
      - 6
      - 7
      - 8
      - 9
      - 10
      - 11
      - 12
    payload_on: "ON"
    payload_off: "OFF"
    payload_available: "Online"
    payload_not_available: "Offline"
    qos: 1
    retain: false
```

### RGBW Lights

#### MagicHome LED Controller 

Configure the module as "34 MagicHome", and on the Console run:\
`SetOption17 1` - This enables decimal colors\
`SetOption59 1` - This enables sending of tele/<topic>/STATE on POWER and light related commands

#### Arilux LC02 

Configure the module as "18 Generic module", and on the Console run:
`SetOption17 1` - This enables decimal colors
`SetOption59 1` - This enables sending of tele/<topic>/STATE on POWER and light related commands

More info how to configure the GPIO [Arilux LC02](https://github.com/arendst/Tasmota/wiki/Arilux-LC02)

```yaml
# Example configuration.yaml entry
light:
  - platform: mqtt
    name: "Light 1"
    command_topic: "cmnd/light1/POWER"
    state_topic: "tele/light1/STATE"
    state_value_template: "{{value_json.POWER}}"
    availability_topic: "tele/light1/LWT"
    brightness_command_topic: "cmnd/light1/Dimmer"
    brightness_state_topic: "tele/light1/STATE"
    brightness_scale: 100
    on_command_type: "brightness"
    brightness_value_template: "{{value_json.Dimmer}}"
    white_value_state_topic: "tele/light1/STATE"
    white_value_command_topic: "cmnd/light1/White"
    white_value_scale: 100
    white_value_template: "{{ value_json.Channel[3] }}"
    rgb_command_topic: "cmnd/light1/Color2"
    rgb_state_topic: "tele/light1/STATE"
    rgb_value_template: "{{value_json.Color.split(',')[0:3]|join(',')}}"
    effect_command_topic: "cmnd/light1/Scheme"
    effect_state_topic: "tele/light1/STATE"
    effect_value_template: "{{value_json.Scheme}}"
    effect_list:
      - 0
      - 1
      - 2
      - 3
      - 4
    payload_on: "ON"
    payload_off: "OFF"
    payload_available: "Online"
    payload_not_available: "Offline"
    qos: 1
    retain: false
```

### RGBWW Lights

#### Sonoff B1, or any 5-channel LED dimmer
Configure the module, and on the Console run:\
`SetOption17 1` - This enables decimal colors\
`SetOption59 1` - This enables sending of tele/<topic>/STATE on POWER and light related commands

You can set the following using the sonoff web interface - Console or by sending it MQTT commands
```
Fade on (optional, but makes the transitions slower)
Speed 5 (optional, but makes the transitions slower)
```

```yaml
# Example configuration.yaml entry
light:
  - platform: mqtt
    name: "Light 1"
    command_topic: "cmnd/light1/POWER"
    state_topic: "tele/light1/STATE"
    state_value_template: "{{value_json.POWER}}"
    availability_topic: "tele/light1/LWT"
    brightness_command_topic: "cmnd/light1/Dimmer"
    brightness_state_topic: "tele/light1/STATE"
    brightness_scale: 100
    on_command_type: "brightness"
    brightness_value_template: "{{value_json.Dimmer}}"
    color_temp_command_topic: "cmnd/light1/CT"
    color_temp_state_topic: "tele/light1/STATE"
    color_temp_value_template: "{{value_json.CT}}"
    rgb_command_topic: "cmnd/light1/Color2"
    rgb_state_topic: "tele/light1/STATE"
    rgb_value_template: "{{value_json.Color.split(',')[0:3]|join(',')}}"
    effect_command_topic: "cmnd/light1/Scheme"
    effect_state_topic: "tele/light1/STATE"
    effect_value_template: "{{value_json.Scheme}}"
    effect_list:
      - 0
      - 1
      - 2
      - 3
      - 4
    payload_on: "ON"
    payload_off: "OFF"
    payload_available: "Online"
    payload_not_available: "Offline"
    qos: 1
    retain: false
```

## Configure RF Codes from Sonoff-Bridge
Use the [`binary_sensor.mqtt`](https://www.home-assistant.io/components/binary_sensor.mqtt/) component.
```yaml
# Example configuration.yaml entry
binary_sensor:
  - platform: mqtt
    name: "Test RF bridge rfkey 1"
    payload_on: "1"
    payload_off: "0"
    device_class: opening
    state_topic: "tele/sonoff_bridge/RESULT"
    value_template: '{{ value_json.RfReceived.RfKey }}'
```

## Configure iFan02
Use the [`fan.mqtt`](https://www.home-assistant.io/components/fan.mqtt/) component.

### iFan02 - Example 1

From @kbickar in [Support for Ifan02 #2839](https://github.com/arendst/Tasmota/issues/2839)`

Modified by @finity69x2 in [Support for Ifan02 #2839](https://github.com/arendst/Tasmota/issues/2839)`

```yaml
# Example configuration.yaml entry
fan:
- platform: mqtt  
    name: "Sonoff Fan"
    command_topic: "cmnd/sonoff_fan/FanSpeed"
    speed_command_topic: "cmnd/sonoff_fan/FanSpeed"    
    state_topic: "stat/sonoff_fan/RESULT"
    speed_state_topic: "stat/sonoff_fan/RESULT"
    #state_value_template: '{% if value_json.FanSpeed == 0 -%}0{%- elif value_json.FanSpeed > 0 -%}4{%- endif %}'
    state_value_template: >
      {% if value_json.FanSpeed is defined %}
        {% if value_json.FanSpeed == 0 -%}0{%- elif value_json.FanSpeed > 0 -%}4{%- endif %}
      {% else %}
        {% if states.fan.sonoff_fan.state == 'off' -%}0{%- elif states.fan.sonoff_fan.state == 'on' -%}4{%- endif %}
      {% endif %}
    speed_value_template: "{{ value_json.FanSpeed }}"
    availability_topic: tele/sonoff_fan/LWT
    payload_off: "0"
    payload_on: "4"
    payload_low_speed: "1"
    payload_medium_speed: "2"
    payload_high_speed: "3"
    payload_available: Online
    payload_not_available: Offline
    speeds:
      - off
      - low
      - medium
      - high
```

### iFan02 - Example 2 - Group with Fan + Light
Combination of configs found in the support thread: 
[Support for Ifan02 #2839](https://github.com/arendst/Tasmota/issues/2839)
and Home Assistant forum: 
[Sonoff IFan02 (Tasmota) MQTT Fan](https://community.home-assistant.io/t/sonoff-ifan02-tasmota-mqtt-fan/64083)

```yaml
# Example configuration.yaml entry
fan:
  - platform: mqtt  
    name: "Pat Ceiling Fan"  
    state_topic: "stat/ifan02_1/RESULT"
    speed_state_topic: "stat/ifan02_1/RESULT"
    state_value_template: >
        {% if value_json.FanSpeed is defined %}
          {% if value_json.FanSpeed == 0 -%}0{%- elif value_json.FanSpeed > 0 -%}2{%- endif %}
        {% else %}
          {% if states.fan.pat_ceiling_fan.state == 'off' -%}0{%- elif states.fan.pat_ceiling_fan.state == 'on' -%}2{%- endif %}
        {% endif %}
    speed_value_template: "{{ value_json.FanSpeed }}"
    availability_topic: tele/ifan02_1/LWT
    payload_available: Online
    payload_not_available: Offline
    speed_command_topic: "cmnd/ifan02_1/FanSpeed"
    payload_low_speed: "1"
    payload_medium_speed: "2"
    payload_high_speed: "3"
    command_topic: "cmnd/ifan02_1/FanSpeed"
    payload_off: "0"
    payload_on: "2"
    qos: 1
    retain: false
    speeds:
      - low
      - medium
      - high
light:
  - platform: mqtt
    name: "Pat Ceiling Light"
    state_topic: "tele/ifan02_1/STATE"
    value_template: "{{ value_json.POWER }}"
    command_topic: "cmnd/ifan02_1/POWER"
    availability_topic: "tele/ifan02_1/LWT"
    qos: 1
    payload_on: "ON"
    payload_off: "OFF"
    payload_available: "Online"
    payload_not_available: "Offline"
    retain: false
```

groups.yaml
```yaml
# Example groups.yaml entry
Pat Ceiling Fan:
  - fan.pat_ceiling_fan
  - light.pat_ceiling_light
```

## Configure Sonoff S31 w/ Power Monitoring as group of switch + sensor
Configure the module as Sonoff S31, and on the Console run:\
`SetOption4 1`\
`SetOption59 1`

```yaml
# Example configuration.yaml entry
switch:
  - platform: mqtt
    name: "s31_02 power"
    state_topic: "tele/s31_02/STATE"
    value_template: "{{ value_json.POWER }}"
    command_topic: "cmnd/s31_02/POWER"
    availability_topic: "tele/s31_02/LWT"
    qos: 1
    payload_on: "ON"
    payload_off: "OFF"
    payload_available: "Online"
    payload_not_available: "Offline"
    retain: false

sensor:
  - platform: mqtt
    name: "s31_02 Voltage"
    state_topic: "tele/s31_02/SENSOR"
    value_template: "{{ value_json['ENERGY'].Voltage }}"
    unit_of_measurement: "V"
    availability_topic: "tele/s31_02/LWT"
    qos: 1
    payload_available: "Online"
    payload_not_available: "Offline"
  - platform: mqtt
    name: "s31_02 Current"
    state_topic: "tele/s31_02/SENSOR"
    value_template: "{{ value_json['ENERGY'].Current | round(2) }}"
    unit_of_measurement: "A"
    availability_topic: "tele/s31_02/LWT"
    qos: 1
    payload_available: "Online"
    payload_not_available: "Offline"
  - platform: mqtt
    name: "s31_02 Power"
    state_topic: "tele/s31_02/SENSOR"
    value_template: "{{ value_json['ENERGY'].Power }}"
    unit_of_measurement: "W"
    availability_topic: "tele/s31_02/LWT"
    qos: 1
    payload_available: "Online"
    payload_not_available: "Offline"
  - platform: mqtt
    name: "s31_02 Power Factor"
    state_topic: "tele/s31_02/SENSOR"
    value_template: "{{ value_json['ENERGY'].Factor }}"
    availability_topic: "tele/s31_02/LWT"
    qos: 1
    payload_available: "Online"
    payload_not_available: "Offline"
  - platform: mqtt
    name: "s31_02 Energy Today"
    state_topic: "tele/s31_02/SENSOR"
    value_template: "{{ value_json['ENERGY'].Today }}"
    unit_of_measurement: "kWh"
    availability_topic: "tele/s31_02/LWT"
    qos: 1
    payload_available: "Online"
    payload_not_available: "Offline"
  - platform: mqtt
    name: "s31_02 Energy Yesterday"
    state_topic: "tele/s31_02/SENSOR"
    value_template: "{{ value_json['ENERGY'].Yesterday }}"
    unit_of_measurement: "kWh"
    availability_topic: "tele/s31_02/LWT"
    qos: 1
    payload_available: "Online"
    payload_not_available: "Offline"
  - platform: mqtt
    name: "s31_02 Energy Total"
    state_topic: "tele/s31_02/SENSOR"
    value_template: "{{ value_json['ENERGY'].Total }}"
    unit_of_measurement: "kWh"
    availability_topic: "tele/s31_02/LWT"
    qos: 1
    payload_available: "Online"
    payload_not_available: "Offline"
```

groups.yaml
```yaml
Sonoff S31_02:
  - switch.s31_02
  - sensor.s31_02_voltage
  - sensor.s31_02_current
  - sensor.s31_02_power
  - sensor.s31_02_power_factor
  - sensor.s31_02_energy_today
  - sensor.s31_02_energy_yesterday
  - sensor.s31_02_energy_total
```


### Counter/Pulse/Water Meter sensor 

The tasmota counter is volatile (not saved in case or reset/ reboot) due to flash wear. 
Common use cases are a water meter that works with a pulse.
this custom component [counter](https://github.com/hhaim/hass/blob/master/custom_components/sensor/tasmota_counter.py)
 can handle it.

```yaml
- platform: tasmota_counter
    name: HASS_NAME
    s topic: TOPIC
    counter_id: 1
    max_valid_diff: 2000
    unit_of_measurement: 'l'
    icon: mdi:water-pump
    expire_after: 300
    value_template: "{{ (4885 + (value))|int }}"
``` 

<!-- broken links and deprecated custom components in HA
### MCP230xx binary sensor 

It has a few async mqtt indications (interrupt and status) and it is tedious to define many of them 
this custom component can solve this (use case, alarm with 16 inputs)

[MCP23017 binary sensor](https://github.com/hhaim/hass/blob/master/custom_components/binary_sensor/mqtt_alarm.py)

```yaml

tasmota_alarm:
  devices:
    - name: HASS_NAME
      stopic: TOPIC
      binary_sensors:
         - name: door
           polar: true
         - name: vol
           polar: true
         - name: kitchen
           polar: true
         - name: backdoor
           polar: true
..
```
see [full example](https://github.com/hhaim/hass/blob/master/configuration.yaml)


### A simpler way to define a Switch 

[tasmota switch](https://github.com/hhaim/hass)

* No need Option59,
* No need startup script command 
* No need to define LWT/Qos

it just works and sync with HASS
 
```yaml
switch:
  - platform: mqtt_tasmota
    name: HASS_DEVICE
    index: '1' #POWER ID
    stopic: TOPIC
..
```

## Relay connected to an MCP230XX

This example controls a relay connected to D6 pin of the MCP23017 expander.
```
- platform: mqtt
    name: "AC RED LED"
    state_topic: "stat/FishtankAC/RESULT"
    value_template: "{{ value_json.S29cmnd_D6.STATE }}"
    state_on: "ON"
    state_off: "OFF"
    command_topic: "cmnd/FishtankAC/sensor29"
    payload_on: "6,ON"
    payload_off: "6,OFF"
    qos: 1
```

-->



