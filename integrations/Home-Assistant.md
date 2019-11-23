[Home Assistant](https://home-assistant.io/) (Hass) is an open source home automation solution that puts local control and privacy first.

# MQTT Broker
Tasmota communicates with Home Assistant using MQTT. Before going any further, make sure MQTT is [properly set up in Home Assistant](https://www.home-assistant.io/docs/mqtt/broker) and [in Tasmota](MQTT). 

First, test if the two can communicate. 

In Home Assistant web UI go to **Developer Tools - MQTT**. Subscribe to `tele/topic%/STATE` and click **START LISTENING**. You should see a JSON response from your device.

To test control of a relay or light, as **Publish a packet topic** enter `cnmd/%topic%/POWER` with payload `toggle`. When you click **PUBLISH** your device should switch state and a JSON response will be visible in **Listen to a topic** window.

![](../_media/hass1.png ':size=150')
![](../_media/hass2.png ':size=150')

# Adding Tasmota Devices

Home Assistant has two avenues of adding Tasmota devices:
- MQTT Discovery
- Adding by editing configuration.yaml 

> [!NOTE]
> After every change to the configuration file you'll need to restart Home Assistant to make it aware of the changes.

If you don't want to use MQTT discovery, skip to [Manual Config](Manual-Config) 

## MQTT Discovery
Home Assistant has a feature called [MQTT discovery](https://www.home-assistant.io/docs/mqtt/discovery/).
With MQTT discovery no user interaction or configuration file editing is needed to add new devices in Home Assistant.

Automatic discovery is currently supported for:
- Relay - announced as `switch`
- Light and Dimmers - announced as `light`
- Sensor - announced as `sensor`
- Button - announced as `binary sensor` 
  - `ON` for `1 second` when pressed, then it will automatically turn `OFF`
- Switch - announced as `binary sensor`
  - will mantain his status until the next event

Types of devices not listed above (e.g. Sonoff iFan03)  require [manual configuration](#manual-confguration)

### Enabling 

For a Tasmota device to be automatically discovered by Home Assistant you need to enable MQTT discovery with command:

```console
SetOption19 1
```
 
After the automatic discovery feature is enabled a retained MQTT message starting with topic "homeassistant/" is sent to the broker. That message contains your device configuration which will be picked up and used by Home Assistant to automatically add your device.

> [!DANGER]
>Device FullTopic will become `%topic%/%prefix%/<command>` (`cmnd/tasmota/POWER` to `tasmota/cmnd/POWER`) and cannot be changed as long as `SetOption19 1` is active.

Enabling discovery will automatically change some SetOptions to suit the new configuration:

#### `SetOption4` to `0`   
Return MQTT response always as `RESULT` and not as %COMMAND% topic

#### `SetOption17` to `1`
  Show Color as a comma-separated decimal string instead of hexadecimal

#### `SetOption59` to `1`
Send `tele/%topic%/STATE` in addition to `stat/%topic%/RESULT` for commands `State`, `Power` and any command causing a light to be turned on.

> [!NOTE]
>For every change you made on your device configuration you will need a reboot or use `SetOption19 1` again to see the changes under Home Assistant.

> [!WARNING]
> Please be advised that not all sensors can be correctly rendered under Home Assistant. In those cases a fallback function will be used to create a generic sensor.

### Disabling 
To disable MQTT discovery and remove the retained message, execute `SetOption19 0`.

The "homeassistant/" topic is removed from Home Assistant and MQTT broker. 
!> **Device FullTopic will not revert to defaults**. You have to manually change the structure back to `%prefix%/%topic%/` using **Configure - MQTT Configuration** page in the webUI or [`FullTopic`](Commands#fulltopic) command.

<!-- tabs:start -->


#### **dont know**

To show a relay as a Home Assistant "light" instead of as a "switch" either:   
use Tasmota command [`SetOption30 1`](Commands#setoption30)   
use [light.switch](https://www.home-assistant.io/components/light.switch/) component

To have switches and buttons discovered `SwitchTopic` or `ButtonTopic` must be set to `0` (default value) and they will automatically start to listen and publish using `%topic%/stat/SWITCH<x>` or `%topic%/stat/BUTTON<x>` topic.

```console
MQT: tasmota/stat/SWITCH1 = {"STATE":"TOGGLE"} 
MQT: tasmota/stat/RESULT = {"POWER":"ON"} 
MQT: tasmota/stat/POWER = ON
```
This option gives the user the ability to get a more granular control over entities on both Tasmota and Home Assistant.

#### **why this is here*

A simple Tasmota rule example:
```console
Rule1 ON Button1#STATE DO Var1 %value% ENDON
Rule1 1
```

With this rule enabled , when you press the button you will get
```console
RUL: BUTTON1#STATE performs "Var1 2"
MQT: tasmota/stat/RESULT = {"Var1":"2"}
MQT: tasmota/stat/BUTTON1 = {"STATE":"TOGGLE"}
```
and the relay will NOT be switched.

Tasmota `SwitchMode` default for buttons and switches is `Switchmode 0` (TOGGLE). To change the behavior, [`SwitchMode`](Commands#switchmode) must be changed. For example setting up a switch to `SwitchMode 1` (follow) will create a switch with ON and OFF payloads.


<!-- tabs:end -->


### Finalizing Setup
All automatically discovered entities will show up under:  
**Configuration -> Integrations -> Configured -> MQTT**  

The entities are grouped by hardware, example for a Sonoff Basic:

![image](https://user-images.githubusercontent.com/7702766/67961116-082b2b80-fbda-11e9-8552-ce2bd85d2a3f.png ':size=80')

By clicking on one of the entities, and then on the cog wheel, name in Home Assistant and `entity_id` can be customized:

![image](https://user-images.githubusercontent.com/14281572/50020005-f4cc9d00-ffd4-11e8-9881-b04ed6e85468.png ':size=80')
![image](https://user-images.githubusercontent.com/14281572/50020040-09109a00-ffd5-11e8-8026-74293753783a.png ':size=80')

For every device discovered with `SetOption19` an informative sensor will be created automatically:

![image](https://user-images.githubusercontent.com/7702766/67965278-88ed2600-fbe0-11e9-9de5-29ecd2c78fac.png ':size=80')

[Home Assistant](https://home-assistant.io/) (Hass) is an open-source home automation platform running on Python 3.

## Manual Editing
Advantage of manually configuring device is that you maintain control of all aspects of the device configuration.

Home Assistant [configuration](https://www.home-assistant.io/docs/configuration/) is done by editing `configuration.yaml` file.

> [!NOTE]
> If you want the power states to be persistent in Tasmota and Home Assistant set `PowerRetain 1`

If you are using a localized (non-english) version be sure to check the correct spelling and cases for values:
  * 'payload_available' 
  * 'payload_not_available'
  * 'payload_on'
  * 'payload_off'



### Switches
Use the [`switch.mqtt`](https://www.home-assistant.io/components/switch.mqtt/) component.

Use POWER1, POWER2, etc when you are using a device with more than one relay or if [SetOption26](Commands#setoption26) is enabled)

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

### Sensors
Use the [`sensor.mqtt`](https://www.home-assistant.io/components/sensor.mqtt/) component.
#### DHT22 sensor

##### Periodical updates

A DHT22 Temperature and Humidity sensor connected to a Sonoff TH10 will send in [`TelePeriod`](commands#teleperiod) set intervals the following information to the MQTT broker:
```
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

### Power Monitoring

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

#### Lights
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

### RGB Light
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

### WS281X LED

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

### RGBW Light

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

### RGBWW Light

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

#### RF Bridge
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

### iFan02
Use the [`fan.mqtt`](https://www.home-assistant.io/components/fan.mqtt/) component.

#### Config 1

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
    #state_value_template: "{% if value_json.FanSpeed == 0 -%}0{%- elif value_json.FanSpeed > 0 -%}4{%- endif %}"
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

#### Config 2 - Group with Fan + Light
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

### Sonoff S31
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


### Counter Sensor 

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

# Tips

<!-- tabs:start -->

#### **Sync Power State**

when MQTT broker or Home Assistant is restarted, or there is a WiFi outage, Tasmota device state may not be synced with Home Assistant. Use this automation to get all your (auto discovered) devices in sync, including power state, *immediately* after Home Assistant is started.

automations.yaml
```
# Example automations.yaml entry
- alias: "Power state on HA start-up"
  initial_state: true
  trigger:
    platform: homeassistant
    event: start
  action:
    - service: mqtt.publish
      data:
        topic: "tasmotas/cmnd/state"
        payload: ""
```



#### **All Device Discovery**

If you want all your devices to be found by Home Assistant, add an automation which will enable `SetOption19` for all devices.  
The automation will be triggered each time Home Assistant is (re)started although it is necessary to run it only if you have a device that doesn't have `SetOption19` enabled. After all your devices are setup with autodiscovery, it is advisable to turn off or delete this automation.

Note: This must use the default Tasmota topic format `%prefix%/%topic%/<command>`. After enabling `SetOption19`, the format will change to `%topic%/%prefix%/<command>` and those devices won't see this message.

This can also be done manually in Home Assistant UI through Developer tools - ![](https://cdn.pbrd.co/images/HY47i1b.jpg) (MQTT) by publishing to grouptopic `cmnd/tasmotas/SetOption19` with payload `1`

```yaml
# Example automations.yaml entry
- id: 'all_tasmota_devices_discovery'
  alias: "Enable MQTT discovery for all devices"
  trigger:
    platform: homeassistant
    event: start
  action:
    - service: mqtt.publish
      data:
        topic: "cmnd/tasmotas/SetOption19"
        payload: "1"
```

Automation for disabling discovery:

```yaml
# Example automations.yaml entry
- id: 'disable_tasmota_discovery'
  alias: "Disable MQTT discovery for all devices"
  trigger:
    platform: homeassistant
    event: start
  action:
    - service: mqtt.publish
      data:
        topic: "tasmotas/cmnd/SetOption19"
        payload: "0"
```


#### **Report Firmware Version**

```yaml
# Example automations.yaml entry
- id: 'tasmota_firmware_installed'
  alias: Tasmota Firmware Installed
  initial_state: true
  trigger:
  - event: start
    platform: homeassistant
  action:
  - data:
      payload: '2'
      topic: tasmotas/cmnd/status
    service: mqtt.publish
  initial_state: 'true'
```

Then you can make a sensor that detects the latest version of Tasmota and alerts you if there is an update.  

configuration.yaml
```yaml
# Tasmota Firmware
# Getting Firmware from JSON for Tasmota
sensor:
  - platform: rest
    resource: https://api.github.com/repos/arendst/Tasmota/releases/latest
    name: Sonoff Firmware Version Available
    username: !secret githubuser
    password: !secret githubpass
    authentication: basic
    value_template: '{{ value_json.tag_name }}'
    headers:
      Accept: application/vnd.github.v3+json
      Content-Type: application/json
      User-Agent: Home Assistant REST sensor
  - platform: mqtt
    name: "Coffee Maker Firmware"
    state_topic: "coffee/stat/STATUS2"
    value_template: 'v{{ value_json.StatusFWR.Version }}'
  - platform: mqtt
    name: "Garage Door Firmware"
    state_topic: "garage/stat/STATUS2"
    value_template: 'v{{ value_json.StatusFWR.Version }}'
binary_sensor:
  - platform: template
    sensors:
      sonoff_update_available:
        value_template: >-
          {{ (states.sensor.tasmota_firmware_version_available.state > states.sensor.coffee_maker_firmware.state) or (states.sensor.tasmota_firmware_version_available.state > states.sensor.garage_door_firmware.state)
              }}
```
Note the above is for 2 switches.

customize.yaml
```yaml
binary_sensor.tasmota_update_available:
  friendly_name: Update Available Tasmota
  device_class: problem
```
Then it will show as an alert icon that you can show in Lovelace.

#### **Sync power state**

If the MQTT broker or Home Assistant is restarted, or there is a WiFi outage, Tasmota device state may not be synced with Home Assistant.

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

#### **Firmware version**

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

#### **new IP address**
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

#### **RSSI Signal Strength**

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


<!-- tabs:end -->
