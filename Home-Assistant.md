[Home Assistant](https://home-assistant.io/) (Hass) is an open-source home automation platform running on Python 3.

**Important:** The information on this page is related to:
 - Tasmota release 6.4.1 or later
 - Home Assistant 0.84.2 or later

## Hass configuration - General
This page describes configuring Hass and Tasmota for MQTT device discovery.

If you don't want to use this option, please refer to:
 - [Home Assistant - Manual Config](Home-Assistant-Manual-Config) - For Home Assistant 0.84.2 or later together with Tasmota developement version built 2018-12-13 or later
 - [Home Assistant - Manual Config (Legacy)](Home-Assistant-Manual-Config-(Legacy)) - For older versions of Home Assistant or Tasmota

Hass configuration is not exposed in the web UI. It is done by editing the `configuration.yaml` file which is found in the `.homeassistant` folder after installing and the first startup of Hass (or in the `/config` folder, if you’re using Hass.io).

Note: After every change to the configuration file you'll need to restart Hass to make it aware of the changes.
This can be done either:
- Through the UI: Configuration -> General -> Server Management -> Restart
- From command line: On a Debian Linux based system, use the command `sudo systemctl restart home-assistant`.

## Hass configuration - MQTT broker

As Tasmota is [MQTT](https://www.home-assistant.io/components/mqtt/) based you will need to configure Home Assistant to connect to an MQTT broker. 

Home Assistant comes with an [embedded MQTT broker](https://www.home-assistant.io/docs/mqtt/broker#embedded-broker) which is easy to set up but you may want to opt for a [separate MQTT broker](https://www.home-assistant.io/docs/mqtt/broker#run-your-own) instead for better stability. A popular choice for this is the open-source [Eclipse Mosquitto](https://mosquitto.org/).

The Hass.io implementation of Home Assistant also has Mosquitto available as a standard add-on, which makes for easy installation and almost no configuration. Authentication, for example, is done using the normal Home Assistant user database, so MQTT credentials can be created there.

### Configure an external broker
To connect Hass to an external MQTT server, use Hass web UI:\
Configuration -> Integrations -> Set up a new Integration -> MQTT\
Note: Make sure to tick the "Enable discovery" option to enable MQTT device discovery.

### Configure the embedded broker (deprecated since 0.92 but still working)

```yaml
# Example configuration.yaml entry
mqtt:
  password: hello
  discovery: true
```

Default username for the embedded broker is `homeassistant` while port defaults to `1883`.  

#### :warning: Warning:
As of release 0.92, the embedded broker has been marked as deprecated. This means bugs may not be fixed, and the functionality may be removed in a future release.

## Add Tasmota devices to Home Assistant
To ease Home Assistant configuration, a feature called [MQTT discovery](https://www.home-assistant.io/docs/mqtt/discovery/) is available. _(warning: this feature is not included in `tasmota-classic.bin`)_\
With MQTT discovery, no user interaction or configuration file edit is needed to add new devices to Hass.

Automatic discovery is currently supported for:
- Relay - Announced as Home Assistant `switch`
- Light (LED dimmer) - Announced as Home Assistant `light`
  - To show a relay as a Home Assistant "light" instead of as a "switch" either:
    - In Tasmota console type the following command: `SetOption30 1`
    - Use Hass [light.switch](https://www.home-assistant.io/components/light.switch/) component
- Sensor - Announced as Home Assistant `sensor`
- Button - Announced as Home Assistant `binary sensor` 
- Switch - Announced as Home Assistant `binary sensor`

Starting from release 6.7.1, to have `buttons` and `switches` discovered `switchtopic` or `buttontopic` must be set to the default value of `0` and they will listen to `%topic%/stat/RESULT` topic.
```lua
MQT: tasmota/stat/RESULT = {"BUTTON1":"TOGGLE"} 
MQT: tasmota/stat/RESULT = {"POWER":"ON"} 
MQT: tasmota/stat/POWER = ON
```
This option gives the user the ability to get a more granular control over entities on both Tasmota and Hass.

A simple Tasmota rule example:
```lua
Rule1 ON Button1#STATE DO Var1 %value% ENDON
```
With the rule enabled , when you press the button you will get
```lua
RUL: BUTTON1#STATE performs "var1 2"
MQT: tasmota/stat/RESULT = {"Var1":"2"}
MQT: tasmota/stat/RESULT = {"BUTTON1":"TOGGLE"}
```
and the relay will NOT be switched.


Tasmota `switchmode` default for buttons and switches is `Switchmode 0` (TOGGLE). This means all the entities created will automatically turn off after `one second`. To change the button behavior, [`SwitchMode`](Commands#switchmode) must be changed. For example setting up a switch to `SwitchMode 1` (follow) will create a switch with ON and OFF payloads.

For other type of devices, e.g Sonoff iFan02, example entries for `configuration.yaml` are available in [Home Assistant - Manual Config|Home-Assistant-‐-Manual-Config]

On each Tasmota device which should be automatically discovered by Hass, enter the following commands in the web console:\
`SetOption19 1` - Enables MQTT discovery\
 
By executing `SetOption19 1`, the automatic discovery feature is enabled and a retained MQTT message starting with topic "homeassistant/..", as defined in `my_user_config.h` HOME_ASSISTANT_DISCOVERY_PREFIX, is sent containing parameters used by Home Assistant to automatically configure a device.

To disable the automatic discovery feature and remove the retained message, execute `SetOption19 0` and the "homeassistant" topic is removed from Home Assistant and MQTT broker. **The device topic will not revert to defaults**. You have to manually change the fulltopic structure back to `%prefix%/%topic%/` in [**MQTT Configuration**](MQTT).

#### :warning: Important:
This feature will change the default Tasmota fulltopic `%prefix%/%topic%/<command>`, e.g. `cmnd/tasmota/POWER` to `%topic%/%prefix%/<command>`, e.g., `tasmota/cmnd/POWER`.
You cannot use custom defined topics while `Setoption19` is on since it will always revert it to `%topic%/%prefix%` due to Home Assistant requirements.

## Setup Tasmota devices through Home Assistant
All automatically discovered entities will show up under:  
Configuration -> Integrations -> Configured -> MQTT  
The entities are grouped by hardware, example for a Sonoff Basic:

![image](https://user-images.githubusercontent.com/7702766/67961116-082b2b80-fbda-11e9-8552-ce2bd85d2a3f.png)

By clicking on one of the entities, and then on the cog wheel, name in Hass and `entity_id` can be customized:

![image](https://user-images.githubusercontent.com/14281572/50020005-f4cc9d00-ffd4-11e8-9881-b04ed6e85468.png)

![image](https://user-images.githubusercontent.com/14281572/50020040-09109a00-ffd5-11e8-8026-74293753783a.png)

Note1: Lights currently show up under "Entities without devices", this will be fixed in Hass 0.85 [#19013](https://github.com/home-assistant/home-assistant/pull/19013)\
Note2: After changing `entity_id` Hass must be restarted, this will be fixed in Hass 0.85 [#19414](https://github.com/home-assistant/home-assistant/pull/19414)

For every device discovered with `SetOption19` an informative sensor will be created automatically:

![image](https://user-images.githubusercontent.com/7702766/67965278-88ed2600-fbe0-11e9-9de5-29ecd2c78fac.png)

## Tips

### Tip: Sync power state

If the MQTT broker or Hass is restarted, or there is a WiFi outage, Tasmota device state may not be synced with Home Assistant. Use this automation to get all your (auto discovered) devices in sync, including power state, **immediately** after Home Assistant is (re)started.

```yaml
# Example automations.yaml entry
- alias: "Power state on HA start-up"
  trigger:
    platform: homeassistant
    event: start
  action:
    - service: mqtt.publish
      data:
        topic: "tasmotas/cmnd/state"
        payload: ""
```
### Tip: Make all Tasmota devices be automatically discovered

If you want all your devices to be found by Home Assistant, add an automation which will enable `SetOption19` for all devices.  
The automation will be triggered each time Home Assistant is (re)started although it is necessary to run it only if you have a device that doesn't have `SetOption19` enabled. After all your devices are setup with autodiscovery, it is advisable to turn off or delete this automation.

Note: This must use the default Tasmota topic format `%prefix%/%topic%/<command>`. After enabling `SetOption19`, the format will change to `%topic%/%prefix%/<command>` and those devices won't see this message.

This can also be done manually in Home Assistant UI through Developer tools - ![](https://cdn.pbrd.co/images/HY47i1b.jpg) (MQTT) by publishing to grouptopic `cmnd/tasmotas/SetOption19` with payload `1`

```yaml
# Example automations.yaml entry
- alias: "Enable MQTT discovery for all devices"
  trigger:
    platform: homeassistant
    event: start
  action:
    - service: mqtt.publish
      data:
        topic: "cmnd/tasmotas/SetOption19"
        payload: "1"
```

#### Note: For disabling the Discovery, the automation is:

```yaml
# Example automations.yaml entry
- alias: "Disable MQTT discovery for all devices"
  trigger:
    platform: homeassistant
    event: start
  action:
    - service: mqtt.publish
      data:
        topic: "tasmotas/cmnd/SetOption19"
        payload: "0"
```

### Tip: Make all Tasmota devices report their firmware version

```yaml
# Example automations.yaml entry
- id: 'sonoff_firmware_installed'
  alias: Sonoff Firmware Installed
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
From my configuration.yaml
```yaml
# Tasmota Firmware
# Getting Firmware from JSON for Tasmota
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
    state_topic: "sonoff1/stat/STATUS2"
    value_template: 'v{{ value_json.StatusFWR.Version }}'
  - platform: mqtt
    name: "Garage Door Firmware"
    state_topic: "sonoff5/stat/STATUS2"
    value_template: 'v{{ value_json.StatusFWR.Version }}'
binary_sensor:
  - platform: template
    sensors:
      sonoff_update_available:
        value_template: >-
          {{ (states.sensor.sonoff_firmware_version_available.state > states.sensor.coffee_maker_firmware.state) or (states.sensor.sonoff_firmware_version_available.state > states.sensor.garage_door_firmware.state)
              }}
```
Note the above is for 2 switches.

In customize.yaml
```yaml
binary_sensor.sonoff_update_available:
  friendly_name: Update Available Sonoff
  device_class: problem
```
Then it will show as an alert icon that you can show in Lovelace.