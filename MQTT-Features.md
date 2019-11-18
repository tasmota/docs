Sonoff responds to the following MQTT commands using MQTT Topic for ```cmnd/tasmota/<command>``` and MQTT Message/Payload for ```<parameter>```:

- The relay can be controlled with ```cmnd/tasmota/power on```, ```cmnd/tasmota/power off``` or ```cmnd/tasmota/power toggle```. Sonoff will send a MQTT status message like ```stat/tasmota/POWER ON```.

- The power state message can be sent with the retain flag set. Enable this with ```cmnd/tasmota/PowerRetain on```.

- The telemetry messages can also be sent with the retain flag, but this is a compile time option. See [#1071](https://github.com/arendst/Tasmota/issues/1071).

- For Sonoff Dual or 4CH the relays need to be addressed with `cmnd/tasmota/power<x>`, where `<x>` is the relay number from 1 to 2 (Dual) or from 1 to 4 (4CH).

- The MQTT topic can be changed with ```cmnd/tasmota/topic sonoff1``` which reboots sonoff and makes it available for MQTT commands like ```cmnd/sonoff1/power on```.

- The OTA firmware location can be made known to sonoff with ```cmnd/tasmota/otaurl http://domus1:80/api/sonoff/sonoff.ino.bin``` where domus1 is your web server hosting the firmware. Reset to default with ```cmnd/tasmota/otaurl 1```.

- Upgrade OTA firmware with ```cmnd/tasmota/upgrade 1```.

- Show all status information with ```cmnd/tasmota/status 0```.

- The button can send a MQTT message to the broker that in turn will switch the relay. To configure this you need to perform ```cmnd/tasmota/ButtonTopic sonoff``` where sonoff equals to Topic. The message can also be provided with the retain flag by ```cmnd/tasmota/ButtonRetain on```.

- Sonoff Pow status can be retrieved with ```cmnd/tasmota/status 8``` or periodically every 5 minutes using ```cmnd/tasmota/TelePeriod 300```.

- When a Sonoff Pow threshold like PowerLow has been met a message ```tele/tasmota/POWER_LOW ON``` will be sent. When the error is corrected a message ```tele/tasmota/POWER_LOW OFF``` will be sent.

While most MQTT commands will result in a message in JSON format the power status feedback will always be returned like ```stat/tasmota/POWER ON``` too.

Telemetry data will be sent by prefix ```tele``` like ```tele/tasmota/SENSOR {"Time":"2017-02-16T10:13:52", "DS18B20":{"Temperature":20.6}}```

## MQTT Topic definition
Until version 5.0.5 the MQTT topic was defined rigidly by using the commands ``Prefix<x>`` and ``Topic`` resulting in a command topic string like ``cmnd/tasmota/Power``.

Starting with version 5.0.5 the MQTT topic is more flexible using command ``FullTopic`` and tokens to be placed within the user definable string up to 100 characters in size. The provided tokens are:
- ``%prefix%`` to be dynamically substituted by one of three prefixes as defined by commands ``Prefix1`` (default: "cmnd"), ``Prefix2`` (default: "stat") and ``Prefix3`` (default: "tele").
- ``%topic%`` to be dynamically substituted by one of five topics as defined by commands ``Topic``, ``GroupTopic``, ``ButtonTopic``, ``SwitchTopic`` and ``MqttClient``. 

Using the tokens the following example topics can be made:
- ``FullTopic %prefix%/%topic%/`` being the legacy situation up to version 5.0.5
- ``FullTopic tasmota/%topic%/%prefix%/``
- ``FullTopic tasmota/bedroom/%topic%/%prefix%/``
- ``FullTopic penthouse/bedroom1/bathroom2/%topic%/%prefix%/``

To solve possible MQTT topic loops I strongly suggest to use the ``%prefix%`` token in all of your FullTopics. It may work without %prefix% as I implemented some validation by forcing the use of a prefix in commands send to the device but status and telemetry do not need a prefix. Just play with it and report strange problems I might solve in the future.

The use of the ``%topic%`` token is also mandatory in case you want to use ``ButtonTopic`` and/or ``SwitchTopic``. It also provides for grouptopic and fallback topic functionality.

Recommendation: **Use both tokens at all time within your FullTopic string**

## Send multiple MQTT commands at once

To change connectivity configuration over MQTT you can (should) use the [Backlog command](https://github.com/arendst/Tasmota/wiki/Commands#using-backlog) to send multiple commands to your Sonoff(s) at once and prevent reboot between the commands. For example you can change the wifi SSID and Password in one step by sending the following MQTT message to your sonoff's `Backlog` topic:

```mosquitto_pub -t 'cmnd/yoursonoff/Backlog' -m 'ssid1 yournewssid; password1 yournewpassword'```

Your Sonoff will be rebooted after both settings are written to the configuration, so your device will connect to the new network. You can also change the MQTT connection parameters the same way and of course any other settings.
