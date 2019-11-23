MQTT is the recommended protocol for controlling your devices. If you have no previous knowledge of it you can learn more from [MQTT Overview](MQTT-Overview) or get a complete course in the [MQTT Essentials](http://www.hivemq.com/mqtt-essentials/) article series. After you have a working [MQTT broker](https://www.google.com/search?q=setting+up+an+mqtt+broker) you need to configure Tasmota to communicate with it. 

## Configure MQTT 
If you flashed a precompiled .bin or didn't enter MQTT info in `user_config_override.h` before compiling you have to configure it on your device first.

### Configure MQTT using WebUI
Go to **Configuration -> Configure Other** and make sure **"MQTT Enable"** box is checked.<BR> 
Once MQTT is enabled you need to set it up using **Configuration -> Configure MQTT**. 

>While here, you might as well change the Friendly Name into something more descriptive than generic "Tasmota". *This is a must for Home Assistant autodiscovery feature.*

![Enable MQTT](https://i.postimg.cc/6QDQnH2X/mqtt-config1.png)
![Configure MQTT ](https://i.postimg.cc/y8LggXy1/mqtt-config2.png)

For a basic setup you only need to set **Host**, **User** and **Password** but it is recommended to change **Topic** to avoid issues. Each device should have a unique **Topic**.

- **Host** = your MQTT broker address or IP (**avoid mDNS**, means no `.local` at the end of the name!) 
- **Port** = your MQTT broker port (default port is set to 1883)
- **Client** = device's unique identifier, do not change if not sure what it is for
- **User** = username for authenticating on your MQTT broker
- **Password** = password for authenticating on your MQTT broker
- **Topic** = unique identifying topic for your device (e.g. `hallswitch`, `kitchen-light`). `%topic%` in wiki references to this. 
- **FullTopic** = [full topic definition](#mqtt-topic-definition), do not change if not sure what it is for

### Configure MQTT using Backlog

Using a serial connection or the WebUI Console you can issue (or even better, paste a premade) Backlog command for quick and easy MQTT setup.

```
Backlog mqtthost <mqtt_broker_address>; mqttport <mqtt_broker_port>; mqttuser <username>; mqttpassword <password>; topic <device_topic>
```

After a reboot all necessary MQTT settings are configured. Don't forget, you can use Backlog for all commands!

## Commands over MQTT
To send commands and view responses you'll need an [MQTT client](http://www.hivemq.com/blog/seven-best-mqtt-client-tools).

Commands over MQTT are issued to Tasmota by using `cmnd/%topic%/<command> <parameter>`. If there is no `<parameter>` (an empty MQTT message/payload), a query is sent for current status of the `<command>`.

> [!TIP]
> If you are using *mosquitto_pub*, you can issue an empty payload using the `-n` command line option. 
> If your MQTT client cannot issue an empty payload, you can use the single character `?` instead.

### Command flow

The following example will go in depth on what happens when you send an MQTT command.

A device was flashed and configured with the **FullTopic** as default `%prefix%/%topic%/` and the **Topic** set to `tasmota-switch`. We want to see current status of the switch and change it.

By looking at the [commands](commands) table we can learn about the [Power](commands#power) command and options associated with it. 
* Ask the device for status:
  ```java
  cmnd/tasmota-switch/Power ← 	// an empty message/payload sends a status query
     ↳ stat/tasmota-switch/RESULT → {"POWER":"OFF"}  
     ↳ stat/tasmota-switch/POWER → OFF
  ```
  We can see that the module's relay is turned off.

* Send a command to toggle the switch:
  ```java
  cmnd/tasmota-switch/Power ← "TOGGLE"
     ↳ // Power for relay 1 is toggled
     ↳ stat/tasmota-switch/RESULT → {"POWER":"ON"}  
     ↳ stat/tasmota-switch/POWER → ON
  ```
  We've sent the toggle command and received confirmation that the switch is turned on.

### Examples
In the following examples `%topic%` is `tasmota` for demonstration purposes:

- The relay can be controlled with `cmnd/tasmota/POWER on`, `cmnd/tasmota/POWER off` or `cmnd/tasmota/POWER toggle`. Tasmota will send a MQTT status message like `stat/tasmota/POWER ON`.

- The power state message can be sent with the retain flag set. Enable this with `cmnd/tasmota/PowerRetain on`.

- The telemetry messages can also be sent with the retain flag, but this is a compile time option. See [#1071](https://github.com/arendst/Tasmota/issues/1071).

- For Sonoff Dual or Sonoff 4CH the relays need to be addressed with `cmnd/tasmota/POWER<x>`, where {x} is the relay number from 1 to 2 (Sonoff Dual) or from 1 to 4 (Sonoff 4CH). `cmnd/tasmota/POWER4 off` turns off the 4th relay on a Sonoff 4CH.

- MQTT topic can be changed with `cmnd/tasmota/TOPIC tasmota1` which reboots Tasmota and changes the `%topic%` to `tasmota1`. From that point on MQTT commands should look like `cmnd/tasmota1/POWER on`.

- The OTA firmware location can be made known to tasmota with `cmnd/tasmota/OtaUrl http://thehackbox.org/tasmota/release/tasmota.bin`. Reset to default with `cmnd/tasmota/OraUrl 1`.

- Upgrade OTA firmware from the OtaUrl server with `cmnd/tasmota/Upgrade 1`.

- Show all status information with `cmnd/tasmota/Status 0`.

- The button can send a MQTT message to the broker that in turn will switch the relay. To configure this you need to perform `cmnd/tasmota/ButtonTopic tasmota` where tasmota equals to Topic. The message can also be provided with the retain flag by `cmnd/tasmota/ButtonRetain on`.

- Sonoff Pow status can be retreived with `cmnd/tasmota/status 8` or periodically every 5 minutes using `cmnd/tasmota/TelePeriod 300`.

- When a Sonoff Pow threshold like PowerLow has been met a message `tele/tasmota/POWER_LOW ON` will be sent. When the error is corrected a message `tele/tasmota/POWER_LOW OFF` will be sent.

While most MQTT commands will result in a message in JSON format the power status feedback will always be returned like `stat/tasmota/POWER ON` too.

Telemetry data will be sent by prefix `tele` like `tele/tasmota/SENSOR {"Time":"2017-02-16T10:13:52", "DS18B20":{"Temperature":20.6}}`

## MQTT Topic Definition
MQTT topic is flexible using command `FullTopic` and tokens to be placed within the user definable string (100 character limit). The tokens are substituted dynamically at run-time. The available substitution tokens are:
- `%prefix%` = one of three prefixes as defined by commands `Prefix1` *(default = `cmnd`)*, `Prefix2` *(default = `stat`)* and `Prefix3` *(default = `tele`)*.
- `%topic%` = one of five topics as defined by commands `Topic`, `GroupTopic`, `ButtonTopic`, `SwitchTopic` and `MqttClient`.
- `%hostname%` = the hostname of the device as defined through the web UI *(default = `%s-%04d`)* or via the `Hostname` command.
- `%id%` =  the MAC address of the device.

> These substitution tokens will be used in examples across the wiki.

If `FullTopic` does not contain the `%topic%` token, the device will not subscribe to `GroupTopic` and `FallbackTopic`.

Using the tokens the following example topics can be made:
- `FullTopic %prefix%/%topic%/` _default_
- `FullTopic tasmota/%topic%/%prefix%/`
- `FullTopic tasmota/bedroom/%topic%/%prefix%/`
- `FullTopic penthouse/bedroom1/bathroom2/%topic%/%prefix%/`

#### %prefix%
Tasmota uses 3 prefixes for forming a FullTopic:

- `cmnd` - prefix to issue commands; ask for status
- `stat` - reports back status or configuration message
- `tele` - reports telemetry info at specified intervals

> [!TIP] 
> To solve possible MQTT topic loops it is strongly suggested that you use the `%prefix%` token in all of your FullTopics. It may work without `%prefix%` as some validation are implemented forcing the use of a prefix in commands sent to the device. Status and telemetry do not need a prefix.

The use of the `%topic%` token is also mandatory in case you want to use [`ButtonTopic`](commands#buttontopic) and/or [`SwitchTopic`](commands#switchtopic). It also provides for grouptopic and fallback topic functionality.

Recommendation: **Use `%prefix%` and `%topic%` tokens at all time within your FullTopic definition!**