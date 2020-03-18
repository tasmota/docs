[Home Assistant](https://home-assistant.io/) (Hass) is an open source home automation solution that puts local control and privacy first.

Tasmota communicates with Home Assistant using MQTT. Before going any further, make sure MQTT is [properly set up in Home Assistant](https://www.home-assistant.io/docs/mqtt/broker) and [in Tasmota](MQTT). 

First, test if the two can communicate. 

In Home Assistant web UI go to **Developer Tools - MQTT**. Subscribe to `tele/topic%/STATE` and click **START LISTENING**. You should see a JSON response from your device.

To test control of a relay or light, as **Publish a packet topic** enter `cmnd/%topic%/POWER` with payload `toggle`. When you click **PUBLISH** your device should switch state and a JSON response will be visible in **Listen to a topic** window.

![](../_media/hass1.png ':size=150')
![](../_media/hass2.png ':size=150')

# Adding Devices

Home Assistant has two avenues of adding Tasmota devices:
1. Using MQTT discovery
2. Adding by editing configuration.yaml 

> [!NOTE]
> After every change to the configuration file you'll need to restart Home Assistant to make it aware of the changes.

If you don't want to use MQTT discovery, skip to [Manual Config](#configurationyaml-editing) 
## Automatic Discovery
Home Assistant has a feature called [MQTT discovery](https://www.home-assistant.io/docs/mqtt/discovery/).
With MQTT discovery no user interaction or configuration file editing is needed to add new devices in Home Assistant.

Automatic discovery is currently supported for

<!-- tabs:start -->

#### **Relays**
Announced to Home Assistant as [MQTT Switch](https://www.home-assistant.io/integrations/switch.mqtt/).

To make a relay discovered as "light" in Home Assistant use command [`SetOption30 1`](Commands#setoption30)   

_Alternatively you can configure it manually using [Light Switch](https://www.home-assistant.io/components/light.switch/) integration._

#### **Lights**
Announced to Home Assistant as [MQTT Light](https://www.home-assistant.io/integrations/light.mqtt/).

#### **Dimmers**
Announced to Home Assistant as [MQTT Light](https://www.home-assistant.io/integrations/light.mqtt/) with a single channel used for dimming.

#### **Buttons**
Announced to Home Assistant as [Automation Trigger](https://www.home-assistant.io/docs/automation/trigger/).

To have buttons discovered `ButtonTopic` must be set to `1` or to a custom name and it will automatically start to listen and publish using `/stat/%topic%/BUTTON<x>` topic.

When using `ButtonTopic 1` the only possible trigger will be `HOLD` (SetOption1 or SetOption11 must be enabled).  
When using `ButtonTopic` with a custom name all the possible combination enabled by SetOption1, SetOption11 and Setoption13 will be possible.

`SwitchMode` default for buttons and switches is `Switchmode 0` (TOGGLE). To change the behavior, [`SwitchMode`](Commands#switchmode) must be changed (the Button must be configured as Switch to have effect).  For example setting up a switch to `SwitchMode 1` (follow) will create a switch with ON and OFF payloads.

> [!WARNING] 
> When a Button is set to a different topic than `0` is not possible to use `Button#State` as a trigger for rules.

#### **Switches**
Announced to Home Assistant as [MQTT Binary Sensor](https://www.home-assistant.io/integrations/binary_sensor.mqtt/) and/or as a [Automation Trigger](https://www.home-assistant.io/docs/automation/trigger/).

To have switches discovered `SwitchTopic` must be set to a custom name and it will automatically start to listen and publish using `/stat/%topic%/SWITCH<x>` topic.

Depending by the `SwitchMode`used, a switch can be a Trigger (`TOGGLE`or `HOLD`), a Binary Sensor (`ON`/`OFF`) or both at the same time.

Example:  
When using with `SwitchMode 0` Tasmota will create just one Trigger for `TOGGLE`.  
When using with `SwitchMode 1` Tasmota will create a `Binary Sensor` with `ON` and `OFF` Payloads.  
When using with `Switchmode 5` Tasmota will create a `Binary Sensor` with `ON` and `OFF` Payloads and a Trigger for `TOGGLE`  

All switchmodes are supported with the exception of SwitchMode11 and SwitchMode12 able to generate just a `TOGGLE` trigger.

> [!WARNING] 
> When a Switch is set to a different topic than `0` is not possible to use `Switch#State` as a trigger for rules.

<!-- tabs:end -->

Types of devices not listed above (fans, covers, etc) require [manual configuration](#fans)

### Enabling 

For a Tasmota device to be automatically discovered by Home Assistant you need to enable MQTT discovery with command:

```console
SetOption19 1
```
> [!NOTE]
> Discovery is not built in to tasmota lite. Use the full version for discovery.


After the automatic discovery feature is enabled a retained MQTT message starting with topic "homeassistant/" is sent to the broker. That message contains your device configuration which will be picked up and used by Home Assistant to automatically add your device.

Enabling discovery will automatically change some SetOptions to suit the new configuration:

**`SetOption4` to `0`**   
Return MQTT response always as `RESULT` and not as %COMMAND% topic

**`SetOption17` to `1`**
  Show Color as a comma-separated decimal string instead of hexadecimal

**`SetOption59` to `1`**
Send `tele/%topic%/STATE` in addition to `stat/%topic%/RESULT` for commands `State`, `Power` and any command causing a light to be turned on.

> [!NOTE]
>For every change you made on your device configuration you will need a reboot or use `SetOption19 1` again to see the changes under Home Assistant.

> [!WARNING]
> Please be advised that not all sensors can be correctly rendered under Home Assistant. In those cases a fallback function will be used to create a generic sensor.

### Disabling 
To disable MQTT discovery and remove the retained message, execute `SetOption19 0`.  
The "homeassistant/" topic is removed from Home Assistant and MQTT broker. 

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

## configuration.yaml editing

The advantage of manually configuring a device is that you maintain control of all aspects of the configuration.

Home Assistant [configuration](https://www.home-assistant.io/docs/configuration/) is done by editing the `configuration.yaml` file.

> [!DANGER]
> All the configurations are just examples.    
You need to be familiar with Home Assistant's configuration structure and procedures.   
Straight copy paste of the given examples into configuration.yaml will not work for you. 

If you are using a localized (non-english) version be sure to check the correct spelling and cases for values:
  * 'payload_available' 
  * 'payload_not_available'
  * 'payload_on'
  * 'payload_off'

> [!TIP]
> If you want the power states to be persistent in Tasmota and Home Assistant set `PowerRetain 1` instead of using `retain: true` in Home Assistant

### Switches
Add in Home Assistant using the [MQTT Switch](https://www.home-assistant.io/components/switch.mqtt/) integration.

**Required Commands**   
`SetOption59 1` - enables sending of tele/%topic%/STATE on POWER and light related commands

<!-- tabs:start -->

#### **Single Switch**

```yaml
switch:
  - platform: mqtt
    name: "Tasmota Switch"
    state_topic: "stat/tasmota/RESULT"  
    value_template: "{{ value_json.POWER }}"
    command_topic: "cmnd/tasmota/POWER"
    payload_on: "ON"
    payload_off: "OFF"
    availability_topic: "tele/tasmota/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
    qos: 1
    retain: false
```


#### **Multiple Switches**
When a device has more than one relay you need to create a new switch for each relay. For each relay use corresponding POWER\<x\> (POWER1, POWER2, etc)  or if [SetOption26](Commands#setoption26) is enabled)

```yaml
switch:
  - platform: mqtt
    name: "Tasmota Switch 1"
    state_topic: "stat/tasmota/RESULT"  
    value_template: "{{ value_json.POWER1 }}"
    command_topic: "cmnd/tasmota/POWER1"
    payload_on: "ON"
    payload_off: "OFF"
    availability_topic: "tele/tasmota/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
    qos: 1
    retain: false
  - platform: mqtt
    name: "Tasmota Switch 2"
    state_topic: "stat/tasmota/RESULT"  
    value_template: "{{ value_json.POWER2 }}"
    command_topic: "cmnd/tasmota/POWER2"
    payload_on: "ON"
    payload_off: "OFF"
    availability_topic: "tele/tasmota/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
    qos: 1
    retain: false
  - platform: mqtt
    name: "Tasmota Switch 3"
    state_topic: "stat/tasmota/RESULT"  
    value_template: "{{ value_json.POWER3 }}"
    command_topic: "cmnd/tasmota/POWER3"
    payload_on: "ON"
    payload_off: "OFF"
    availability_topic: "tele/tasmota/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
    qos: 1
    retain: false
```

#### **Dimmer**
Used for dimmers and dimmable lights (single channel lights).

```yaml
light:
  - platform: mqtt
    name: "Dimmer"
    command_topic: "cmnd/tasmota/POWER"
    state_topic: "tele/tasmota/STATE"
    state_value_template: "{{value_json.POWER}}"
    availability_topic: "tele/tasmota/LWT"
    brightness_command_topic: "cmnd/tasmota/Dimmer"
    brightness_state_topic: "tele/tasmota/STATE"
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

<!-- tabs:end -->

> [!TIP]
>If you are using your device to control a light, you may want to use [`MQTT Light`](https://www.home-assistant.io/components/light.mqtt/) integration instead.   
Simply replace `switch:` with `light:` in the configuration keeping everything else the same.

### Lights
Add in Home Assistant using the [MQTT Light](https://www.home-assistant.io/components/light.mqtt/) integration.

**Required Commands**   
`SetOption17 1` - enables decimal colors\
`SetOption59 1` - enables sending of tele/%topic%/STATE on POWER and light related commands

**Optional Commands**   
`Fade on` - makes transitions smoother   
`Speed 5` - sets transition speed
<!-- tabs:start -->

#### **Dimming**
Used for dimmers and dimmable lights (single channel lights).

```yaml
light:
  - platform: mqtt
    name: "Dimmer"
    command_topic: "cmnd/tasmota/POWER"
    state_topic: "tele/tasmota/STATE"
    state_value_template: "{{value_json.POWER}}"
    availability_topic: "tele/tasmota/LWT"
    brightness_command_topic: "cmnd/tasmota/Dimmer"
    brightness_state_topic: "tele/tasmota/STATE"
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

#### **RGB Light**

```yaml
light:
  - platform: mqtt
    name: "RGB Light"
    command_topic: "cmnd/tasmota/POWER"
    state_topic: "tele/tasmota/STATE"
    state_value_template: "{{value_json.POWER}}"
    availability_topic: "tele/tasmota/LWT"
    brightness_command_topic: "cmnd/tasmota/Dimmer"
    brightness_state_topic: "tele/tasmota/STATE"
    brightness_scale: 100
    on_command_type: "brightness"
    brightness_value_template: "{{value_json.Dimmer}}"
    rgb_command_topic: "cmnd/tasmota/Color2"
    rgb_state_topic: "tele/tasmota/STATE"
    rgb_value_template: "{{value_json.Color.split(',')[0:3]|join(',')}}"
    effect_command_topic: "cmnd/tasmota/Scheme"
    effect_state_topic: "tele/tasmota/STATE"
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
#### **RGB+W Light**

```yaml
light:
  - platform: mqtt
    name: "RGB+W Light"
    command_topic: "cmnd/tasmota/POWER"
    state_topic: "tele/tasmota/STATE"
    state_value_template: "{{value_json.POWER}}"
    availability_topic: "tele/tasmota/LWT"
    brightness_command_topic: "cmnd/tasmota/Dimmer"
    brightness_state_topic: "tele/tasmota/STATE"
    brightness_scale: 100
    on_command_type: "brightness"
    brightness_value_template: "{{value_json.Dimmer}}"
    white_value_state_topic: "tele/tasmota/STATE"
    white_value_command_topic: "cmnd/tasmota/White"
    white_value_scale: 100
    white_value_template: "{{ value_json.Channel[3] }}"
    rgb_command_topic: "cmnd/tasmota/Color2"
    rgb_state_topic: "tele/tasmota/STATE"
    rgb_value_template: "{{value_json.Color.split(',')[0:3]|join(',')}}"
    effect_command_topic: "cmnd/tasmota/Scheme"
    effect_state_topic: "tele/tasmota/STATE"
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
#### **RGB+CCT Light**
Also known as RGBWW or 5 channel lights

```yaml
light:
  - platform: mqtt
    name: "RGBCCT Light"
    command_topic: "cmnd/tasmota/POWER"
    state_topic: "tele/tasmota/STATE"
    state_value_template: "{{value_json.POWER}}"
    availability_topic: "tele/tasmota/LWT"
    brightness_command_topic: "cmnd/tasmota/Dimmer"
    brightness_state_topic: "tele/tasmota/STATE"
    brightness_scale: 100
    on_command_type: "brightness"
    brightness_value_template: "{{value_json.Dimmer}}"
    color_temp_command_topic: "cmnd/tasmota/CT"
    color_temp_state_topic: "tele/tasmota/STATE"
    color_temp_value_template: "{{value_json.CT}}"
    rgb_command_topic: "cmnd/tasmota/Color2"
    rgb_state_topic: "tele/tasmota/STATE"
    rgb_value_template: "{{value_json.Color.split(',')[0:3]|join(',')}}"
    effect_command_topic: "cmnd/tasmota/Scheme"
    effect_state_topic: "tele/tasmota/STATE"
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

#### **Addressable LED**

Applies only to [WS281x](peripherals/WS2812B-and-WS2813) lights. 

```yaml
light:
  - platform: mqtt
    name: "Addressable LED"
    command_topic: "cmnd/tasmota/POWER"
    state_topic: "stat/tasmota/STATE"
    state_value_template: "{{value_json.POWER}}"
    availability_topic: "tele/tasmota/LWT"
    brightness_command_topic: "cmnd/tasmota/Dimmer"
    brightness_state_topic: "stat/tasmota/STATE"
    brightness_scale: 100
    on_command_type: "brightness"
    brightness_value_template: "{{value_json.Dimmer}}"
    rgb_command_topic: "cmnd/tasmota/Color2"
    rgb_state_topic: "tele/tasmota/STATE"
    rgb_value_template: "{{value_json.Color.split(',')[0:3]|join(',')}}"
    effect_command_topic: "cmnd/tasmota/Scheme"
    effect_state_topic: "stat/tasmota/STATE"
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

#### **No SetOption17 RGB**

 If you don't want to use `SetOption17 1` you can change
  ```yaml
  rgb_value_template: "{{value_json.Color.split(',')[0:3]|join(',')}}"
  ```
to
```yaml
  rgb_value_template: "{% if value_json.Color is defined %}{{ (value_json.Color[0:2]|int(base=16),value_json.Color[2:4]|int(base=16),value_json.Color[4:6]|int(base=16)) | join(',')}}{% endif %}"
```
<!-- tabs:end -->

### Sensors
Add in Home Assistant using the [MQTT Sensor](https://www.home-assistant.io/components/sensor.mqtt/) integration.

A sensor will send its data in set intervals defined by [`TelePeriod`](Commands#teleperiod) (default every 5 minutes).

<!-- tabs:start -->

#### **Temperature**

Check your sensor name in Tasmota and change accordingly. This example uses the DHT22 sensor.

```yaml
sensor:
  - platform: mqtt
    name: "Tasmota Temperature"
    state_topic: "tele/tasmota/SENSOR"
    value_template: "{{ value_json['DHT22'].Temperature }}"
    unit_of_measurement: "°C"  # "F" if using Fahrenheit
    availability_topic: "tele/tasmota/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
    device_class: temperature
```

#### **Humidity**

Check your sensor name in Tasmota and change accordingly. This example uses the DHT22 sensor.

```yaml
sensor:
  - platform: mqtt
    name: "Tasmota Humidity"
    state_topic: "tele/tasmota/SENSOR"
    value_template: "{{ value_json['DHT22'].Humidity }}"
    unit_of_measurement: "%"
    availability_topic: "tele/tasmota/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
    device_class: humidity
```

<!--  THIS LOOKS COMPLETELY UNNECCESSARY AND JUST CONFUSING TO A NEW USER

#### Manual updates

If you poll your sensor for data using `Status 10` command it would result in a message like this:
```
stat/tasmota/STATUS10 {"StatusSNS":{"Time":"2017-02-11T18:06:05", "DHT22":{"Temperature":"21.8", "Humidity":"48.0"}}}
```
Home Assistant configuration would then need to be:
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
-->

#### **Pressure**
Check your sensor name in Tasmota and change accordingly. This example uses the BMP280 sensor.

```yaml
sensor:
  - platform: mqtt
    name: "Tasmota Pressure"
    state_topic: "tele/tasmota/SENSOR"
    value_template: "{{ value_json.BMP280.Pressure }}"
    unit_of_measurement: "hPa"
    device_class: pressure
```
Change unit_of_measurement to `"mmHg"` if [`SetOption24 1`](Commands#setoption24)

<!-- Dead link and not default HA functionality
### Counter

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
```  -->

#### **Wi-Fi Signal Quality**

Monitor the relative Wi-Fi signal quality of a device.

```yaml
sensor:
  - platform: mqtt
    name: "Tasmota Wi-Fi Quality"
    state_topic: "tele/tasmota/STATE"
    unit_of_measurement: "%"
    value_template: "{{value_json['Wifi'].RSSI }}"
    availability_topic: "tele/tasmota/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
    device_class: signal_strength
```

<!-- tabs:end -->

### Power Monitoring
<img alt="Example of Lovelace UI" src="/docs/_media/hax_pow1.png" style="margin:5px;float:right;width:10em"></img>

Add in Home Assistant using the [MQTT Sensor](https://www.home-assistant.io/components/sensor.mqtt/) integration.

Power monitoring sensors will send their data in set intervals defined by [`TelePeriod`](Commands#teleperiod) (default every 5 minutes).

To get all the data in Home Assistant requires multiple sensors which you can later group to your liking in [Lovelace UI](https://www.home-assistant.io/lovelace/)

<!-- tabs:start -->

#### **Power Monitoring**

```yaml
sensor:
  - platform: mqtt
    name: "Energy Today"
    state_topic: "tele/tasmota/SENSOR"
    value_template: '{{ value_json["ENERGY"]["Today"] }}'
    unit_of_measurement: "kWh"
  - platform: mqtt
    name: "Power"
    state_topic: "tele/tasmota/SENSOR"
    value_template: '{{ value_json["ENERGY"]["Power"] }}'
    unit_of_measurement: "W"
  - platform: mqtt
    name: "Voltage"
    state_topic: "tele/tasmota/SENSOR"
    value_template: '{{ value_json["ENERGY"]["Voltage"] }}'
    unit_of_measurement: "V"
  - platform: mqtt
    name: "Current"
    state_topic: "tele/tasmota/SENSOR"
    value_template: '{{ value_json["ENERGY"]["Current"] }}'
    unit_of_measurement: "A"
```
> [!TIP]
>For additional sensors use "Total";"Yesterday";"Period","ApparentPower","ReactivePower";"Factor" in `value_template` string

<!-- AGAIN WITH THIS MANUAL UPDATE MALARKEY

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
 -->
<!-- tabs:end -->

[Video tutorial](https://www.youtube.com/watch?v=ktHQrhAF8VQ) on a power monitoring plug setup by Digiblur

### Binary Sensors
Add in Home Assistant using the [MQTT Binary Sensor](https://www.home-assistant.io/components/binary_sensor.mqtt/) integration.
<!-- tabs:start -->

#### **PIR Sensor**
Used for a configured [PIR Sensor](/peripherals/PIR-Motion-Sensors) and requires this rule:

**Required Commands**
```console
Rule1 on Switch1#State=1 do Publish stat/hall/MOTION ON endon on Switch1#State=1 do Publish stat/hall/MOTION OFF endon
Rule1 1
```
```yaml
binary_sensor:
  - platform: mqtt
    name: "Tasmota Motion Sensor"
    state_topic: "stat/tasmota/MOTION"
    availability_topic: "tele/tasmota/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
    device_class: motion
    qos: 1
```

#### **Door Sensor**
Requires a reed switch configured in Tasmota.

**Required Commands**
```console
Rule1 on Switch1#State=1 do Publish stat/hall/MOTION ON endon on Switch1#State=1 do Publish stat/hall/MOTION OFF endon
Rule1 1
```
```yaml
binary_sensor:
  - platform: mqtt
    name: "Tasmota Motion Sensor"
    state_topic: "stat/tasmota/MOTION"
    availability_topic: "tele/tasmota/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
    device_class: door   # also: window, garage_door or opening
    qos: 1
```

#### **RF Bridge**
An RF door sensor configured with an RF receiver in Tasmota.
```yaml
binary_sensor:
  - platform: mqtt
    name: "RF bridge rfkey"
    payload_on: "1"
    payload_off: "0"
    device_class: opening
    state_topic: "tele/tasmota/RESULT"
    value_template: '{{ value_json.RfReceived.RfKey }}'
```
<!-- tabs:end -->

### Fans
Add in Home Assistant using the [MQTT Fan](https://www.home-assistant.io/components/fan.mqtt/) integration.

<!-- tabs:start -->

#### **Fan**

Derived from [#2839](https://github.com/arendst/Tasmota/issues/2839) by @kbickar and @finity69x2


```yaml
# Example configuration.yaml entry
fan:
- platform: mqtt  
    name: "Tasmota Fan"
    command_topic: "cmnd/tasmota/FanSpeed"
    speed_command_topic: "cmnd/tasmota/FanSpeed"    
    state_topic: "stat/tasmota/RESULT"
    speed_state_topic: "stat/tasmota/RESULT"
    state_value_template: >
      {% if value_json.FanSpeed is defined %}
        {% if value_json.FanSpeed == 0 -%}0{%- elif value_json.FanSpeed > 0 -%}4{%- endif %}
      {% else %}
        {% if states.fan.tasmota.state == 'off' -%}0{%- elif states.fan.tasmota.state == 'on' -%}4{%- endif %}
      {% endif %}
    speed_value_template: "{{ value_json.FanSpeed }}"
    availability_topic: tele/tasmota/LWT
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
<!-- tabs:end -->

### Device Specific

<!-- tabs:start -->

#### **iFan02**
Combination of configs found in issue 
[#2839](https://github.com/arendst/Tasmota/issues/2839)
and Home Assistant forum thread 
[Sonoff IFan02 (Tasmota) MQTT Fan](https://community.home-assistant.io/t/sonoff-ifan02-tasmota-mqtt-fan/64083).

```yaml
fan:
  - platform: mqtt  
    name: "Pat Ceiling Fan"  
    state_topic: "stat/ifan02/RESULT"
    speed_state_topic: "stat/ifan02/RESULT"
    state_value_template: >
        {% if value_json.FanSpeed is defined %}
          {% if value_json.FanSpeed == 0 -%}0{%- elif value_json.FanSpeed > 0 -%}2{%- endif %}
        {% else %}
          {% if states.fan.pat_ceiling_fan.state == 'off' -%}0{%- elif states.fan.pat_ceiling_fan.state == 'on' -%}2{%- endif %}
        {% endif %}
    speed_value_template: "{{ value_json.FanSpeed }}"
    availability_topic: tele/ifan02/LWT
    payload_available: Online
    payload_not_available: Offline
    speed_command_topic: "cmnd/ifan02/FanSpeed"
    payload_low_speed: "1"
    payload_medium_speed: "2"
    payload_high_speed: "3"
    command_topic: "cmnd/ifan02/FanSpeed"
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
    state_topic: "tele/ifan02/STATE"
    value_template: "{{ value_json.POWER }}"
    command_topic: "cmnd/ifan02/POWER"
    availability_topic: "tele/ifan02/LWT"
    qos: 1
    payload_on: "ON"
    payload_off: "OFF"
    payload_available: "Online"
    payload_not_available: "Offline"
    retain: false
```

#### **Sonoff S31**
Configure the device as Sonoff S31, and run:\
`SetOption4 1`   
`SetOption59 1`

```yaml
switch:
  - platform: mqtt
    name: "s31 power"
    state_topic: "tele/s31/STATE"
    value_template: "{{ value_json.POWER }}"
    command_topic: "cmnd/s31/POWER"
    availability_topic: "tele/s31/LWT"
    qos: 1
    payload_on: "ON"
    payload_off: "OFF"
    payload_available: "Online"
    payload_not_available: "Offline"
    retain: false

sensor:
  - platform: mqtt
    name: "s31 Voltage"
    state_topic: "tele/s31/SENSOR"
    value_template: "{{ value_json['ENERGY'].Voltage }}"
    unit_of_measurement: "V"
    availability_topic: "tele/s31/LWT"
    qos: 1
    payload_available: "Online"
    payload_not_available: "Offline"
  - platform: mqtt
    name: "s31 Current"
    state_topic: "tele/s31/SENSOR"
    value_template: "{{ value_json['ENERGY'].Current | round(2) }}"
    unit_of_measurement: "A"
    availability_topic: "tele/s31/LWT"
    qos: 1
    payload_available: "Online"
    payload_not_available: "Offline"
  - platform: mqtt
    name: "s31 Power"
    state_topic: "tele/s31/SENSOR"
    value_template: "{{ value_json['ENERGY'].Power }}"
    unit_of_measurement: "W"
    availability_topic: "tele/s31/LWT"
    qos: 1
    payload_available: "Online"
    payload_not_available: "Offline"
    device_class: power
  - platform: mqtt
    name: "s31 Power Factor"
    state_topic: "tele/s31/SENSOR"
    value_template: "{{ value_json['ENERGY'].Factor }}"
    availability_topic: "tele/s31/LWT"
    qos: 1
    payload_available: "Online"
    payload_not_available: "Offline"
  - platform: mqtt
    name: "s31 Energy Today"
    state_topic: "tele/s31/SENSOR"
    value_template: "{{ value_json['ENERGY'].Today }}"
    unit_of_measurement: "kWh"
    availability_topic: "tele/s31/LWT"
    qos: 1
    payload_available: "Online"
    payload_not_available: "Offline"
  - platform: mqtt
    name: "s31 Energy Yesterday"
    state_topic: "tele/s31/SENSOR"
    value_template: "{{ value_json['ENERGY'].Yesterday }}"
    unit_of_measurement: "kWh"
    availability_topic: "tele/s31/LWT"
    qos: 1
    payload_available: "Online"
    payload_not_available: "Offline"
  - platform: mqtt
    name: "s31 Energy Total"
    state_topic: "tele/s31/SENSOR"
    value_template: "{{ value_json['ENERGY'].Total }}"
    unit_of_measurement: "kWh"
    availability_topic: "tele/s31/LWT"
    qos: 1
    payload_available: "Online"
    payload_not_available: "Offline"
```

<!-- tabs:end -->

### Zigbee Devices

<!-- tabs:start -->

#### **Dimmable Light**
This configuration is for a dimmable light reporting on `0xE1F9` using endpoint 1, cluster 8 for brightness. `ZbRead` part in the template is needed to always update the brightness values.

```yaml
# Example configuration.yaml entry
light:
  - platform: mqtt
    schema: template
    name: "Fire Light"
    command_topic: "cmnd/zigbee-gateway/Backlog"
    state_topic: "tele/zigbee-gateway/SENSOR"
    command_on_template: >
        {%- if brightness is defined -%}
        ZbSend { "device":"0xE1F9", "send":{"Dimmer":{{ brightness }} } }; ZbSend { "device":"0xE1F9", "send":{"Power":true} }; delay 20; ZbRead { "device":"0xE1F9", "endpoint":1, "cluster":8, "read":0 }
        {%- else -%}
        ZbSend { "device":"0xE1F9", "send":{"Power":true} }; delay 20; ZbRead { "device":"0xE1F9", "endpoint":1, "cluster":8, "read":0 }
        {%- endif -%}
    command_off_template: 'ZbSend { "device":"0xE1F9", "send":{"Power":false} }; delay 20; ZbRead { "device":"0xE1F9", "endpoint":1, "cluster":8, "read":0 }'
    state_template: >
        {% if value_json.ZbReceived is defined and value_json.ZbReceived['0xE1F9'] is defined and value_json.ZbReceived['0xE1F9'].Power is defined %}
        {% if value_json.ZbReceived['0xE1F9'].Power == true %}
        on
        {% else %}
        off
        {% endif %}
        {% else %}
        {{ states('light.fire_light') }}
        {% endif %}
    brightness_template: >
        {%- if value_json.ZbReceived is defined and value_json.ZbReceived['0xE1F9'] is defined and value_json.ZbReceived['0xE1F9'].Dimmer is defined -%}
        {{ value_json['ZbReceived']['0xE1F9'].Dimmer | int }}
        {%- else -%}
        {{ state_attr('light.fire_light', 'brightness') | int }}
        {%- endif -%}
```

#### **Water Leak Sensor**
This specific configuration is for Xiaomi Aqara Water Leak sensor reporting on `0x099F`.

```yaml
# Example configuration.yaml entry
binary_sensor:
  - platform: mqtt
    name: "Water Leak"
    state_topic: "tele/zigbee-gateway/SENSOR"
    value_template: >
      {%- if value_json.ZbReceived is defined and value_json.ZbReceived['0x099F'] is defined -%}
      {%- if value_json.ZbReceived['0x099F']['0500!00'] == '010000FF0000' -%}
      ON
      {% else %}
      OFF
      {% endif %}
      {% else %}
      {{ states('binary_sensor.water_leak') }}
      {% endif %}
    availability_topic: "tele/zigbee-gateway/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
    qos: 1
    device_class: moisture
```

<!-- tabs:end -->

## Useful Automations

<!-- tabs:start -->

#### **Sync Power State**

When MQTT broker or Home Assistant is restarted, or there is a WiFi outage, Tasmota device state may not be synced with Home Assistant. Use this automation to get all your (auto discovered) devices in sync, including power state, *immediately* after Home Assistant is started.

For autodiscovered devices:
```yaml
automation:
  - alias: "Sync Tasmota states on start-up - autodiscovery"
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
For manually configured devices:
```yaml
automation:
  - alias: "Sync Tasmota states on start-up - manual configuration"
    initial_state: true
    trigger:
      platform: homeassistant
      event: start
    action:
      - service: mqtt.publish
        data:
          topic: "cmnd/tasmotas/state"
          payload: ""
```

#### **Report Firmware Version - Autodiscovery**

```yaml
automation:
  - id: 'tasmota_firmware_installed'
    alias: "Tasmota Firmware Installed"
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

Then you can make a sensor that detects the latest version of Tasmota and alerts you if there is an update. Autodiscovery only.

configuration.yaml
```yaml
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

#### **Report Firmware Version - Manual**

Add a sensor like below for each Tasmota device whose firmware version you want to track.

```yaml
# Example configuration.yaml entry
sensor:
  - platform: mqtt
    name: "Tasmota"
    state_topic: "stat/tasmota/STATUS2"
    value_template: "{{value_json['StatusFWR'].Version }}"
    availability_topic: "tele/tasmota/LWT"
    payload_available: "Online"
    payload_not_available: "Offline"
    qos: 0
```

Automation to have each device report firmware version on Home Assistant reboot. 
*You can manually trigger this automation from Home Assistant UI.*

```yaml
automation:
  - alias: "Tasmota Firmware Version Check"
    trigger:
      platform: homeassistant
      event: start
    action:
      - service: mqtt.publish
        data:
          topic: "cmnd/tasmotas/STATUS"
          payload: "2"
```

#### **New device IP Address**
Here is some code that will display the IP address of yout newly flashed device.

The script:

```yaml	
script:
  get_tasmota_ip:	
    alias: Get Tasmota New IP (tasmota)	
    sequence:	
    - data:	
        topic: cmnd/tasmota/ipaddress	
      service: mqtt.publish	
```	

The sensor:
```yaml
sensor:
  - platform: mqtt
    name: "Tasmota IP"
    state_topic: 'stat/tasmota/RESULT'
    value_template: "{{ value_json.IPAddress1.split(' ')[1].replace('(','').replace(')','') }}"
```

Restart HA and plug in your newly flashed device. Click `EXECUTE` (in the new group) and the "Tasmota IP" sensor will display the IP address. After finding out the new IP don't forget to change the topic of the new device to a unique one.

<!-- tabs:end -->

> [!TIP]
> If you want all your devices to switch to autodiscovery method go through Developer tools - MQTT by publishing to grouptopic `cmnd/tasmotas/SetOption19` with payload `1`

![](https://cdn.pbrd.co/images/HY47i1b.jpg)
