
The "open Home Automation Bus" ([openHAB](http://www.openhab.org/)) is an open source, technology agnostic home automation platform which runs as the center of your smart home. Besides more than 400 other add-ons for all kinds of technologies, openHAB provides an MQTT add-on ("binding") to interface with systems like Tasmota.

By following the guide below you'll be able to observe, control and manage your Tasmota modules from your openHAB system. If you are new to openHAB, please learn about the basic concepts and the initial setup. The below article will not cover any basics which are out of scope to the Tasmota integration.

**Example Result:**
The screenshot of an openHAB Sitemap below features a few Sonoff modules for lighting, two modified Sonoff Basic with sensors for temperature and humidity readings and two Sonoff Pow for power measurements of a washing machine and dishwasher:

![example openHAB sitemap](https://community-openhab-org.s3-eu-central-1.amazonaws.com/original/2X/c/c4c91610a96750bb3ee30c88c299884039f80172.png)

## Requirements

* Working openHAB installation ([see documentation](https://www.openhab.org/docs/))
* Configured Tasmota device (accessible from your local network)
* MQTT broker available (e.g. Eclipse Mosquitto via [openHABian](https://www.openhab.org/docs/installation/openhabian.html#openhabian-hassle-free-openhab-setup))
* A [basic understanding of MQTT](http://www.hivemq.com/blog/mqtt-essentials) 
* Working and tested connection between openHAB and the MQTT broker
* (optional) Standalone [MQTT client](http://www.hivemq.com/blog/seven-best-mqtt-client-tools) (e.g. [MQTT Explorer](https://mqtt-explorer.com/)) to observe and identify messages on the MQTT broker

----

If not done yet, you first need to **install and activate** the [MQTT](https://www.openhab.org/addons/bindings/mqtt/) binding, the [MQTT action](https://www.openhab.org/addons/actions/mqtt/) and the [JsonPath transformation](https://www.openhab.org/addons/transformations/jsonpath/), e.g. via the openHAB Paper UI Add-ons section.

----

!!! info "MQTTv1 vs. MQTTv2 Binding Information"
    Please note that since `mqtt1` is a legacy binding for years now, it will no longer receive updates or fixes. See [older version of this tutorial](https://github.com/tasmota/docs/blob/4c7240ddd5d81146ea148f471b1544283e655ec3/docs/openHAB.md#mqttv1-integration) on how to integrate Tasmota using this binding if you are using `mqtt1` - but be advised that it's not recommended anymore, it's better to upgrade to MQTTv2 binding. See [openHAB announcement of MQTTv2 for details](https://www.openhab.org/blog/2018-12-16-mqtt-arrives-in-the-modern-openhab-2-x-architecture.html) on how to change your configuration.

## MQTTv2 Integration

Configuration is split throughout some openHAB configuration files. First we need to set up a MQTT connection and Tasmota things - you will need a separate thing for every Tasmota device you use.

In the example configuration you can see a non-default **Full Topic** definition. For your real world device simply **set up items** for all Tasmota [MQTT topics](MQTT#mqtt-topic-definition) you are interested in. Examples for most needed topics are given below, see section [Discovering Interesting Topics](#discovering-interesting-topics) below on how to watch the raw MQTT data. Some Tasmota topics are JSON encoded, the `JSONPATH` transformation can be used to extract this data.

You'll need to replace the given example device topic name (e.g. "Tasmota_TH") by the one chosen for your module.

**.things File:**

```js
Bridge mqtt:broker:myMQTTBroker "My only one and best MQTT server"
[
    host="IPofBroker",
    username="myUser",
    password="myPassword",
    clientID="myopenHABMQTTClient"
]

Thing mqtt:topic:tasmota:tasmota_TH "Light_TH" (mqtt:broker:myMQTTBroker) {
    Channels:
        // Sonoff Basic / Sonoff S20 Smart Socket (Read and switch on-state)
        Type switch : PowerSwitch  [stateTopic="stat/tasmota_TH/POWER",   commandTopic="cmnd/tasmota_TH/POWER", on="ON", off="OFF"]

        // Sonoff Pow (read current wattage; for read and switch on-state see above)
        Type number : Power        [stateTopic="tele/tasmota_TH/SENSOR", transformationPattern="JSONPATH:$.ENERGY.Power"}

        // devices including AM2301 temperature sensor
        Type number : Temperature  [stateTopic="tele/tasmota_TH/SENSOR",  transformationPattern="JSONPATH:$.AM2301.Temperature"]

        // Tasmota Status
        Type string : Version      [stateTopic="stat/tasmota_TH/STATUS2", transformationPattern="JSONPATH:$.StatusFWR.Version"]
        Type switch : Reachable    [stateTopic="tele/tasmota_TH/LWT",     transformationPattern="MAP:tasmota-reachable.map"]

        // Diagnostics: Define specific for what you really need on a regular basis, use standalone MQTT client for troubleshooting
        Type string : RestartReason [stateTopic="tele/tasmota_TH/INFO3", transformationPattern="JSONPATH:$.RestartReason"]
        // old one, have to query it
        Type string : Version2      [stateTopic="stat/tasmota_TH/STATUS2", transformationPattern="JSONPATH:$.StatusFWR.Version"]
        // new one - comes for free at startup
        Type string : Version       [stateTopic="tele/tasmota_TH/INFO1", transformationPattern="JSONPATH:$.Version"]
        Type number : RSSI          [stateTopic="tele/tasmota_TH/STATE", transformationPattern="JSONPATH:$.Wifi.RSSI"]
        Type string : WifiDowntime  [stateTopic="tele/tasmota_TH/STATE", transformationPattern="JSONPATH:$.Wifi.Downtime"]
        Type number : LoadAvg       [stateTopic="tele/tasmota_TH/STATE", transformationPattern="JSONPATH:$.LoadAvg"]
        Type number : Uptime        [stateTopic="tele/tasmota_TH/STATE", transformationPattern="JSONPATH:$.UptimeSec"]
        Type string : Result        [stateTopic="stat/tasmota_TH/RESULT"]
}

```

**.items File:**

For every property your device exposes, you need to define an item, linked to corresponding channel of your Tasmota thing.

```js
// device specific properties
Switch             Switch_TH      "Switch_TH"                           {channel="mqtt:topic:tasmota:tasmota_TH:PowerSwitch"}
Number:Temperature Switch_TH_Temp "Temperature [%.1f °C]" <temperature> {channel="mqtt:topic:tasmota:tasmota_TH:Temperature"}
Number:Power       Power          "Power [%.1f W]"                      {channel="mqtt:topic:tasmota:tasmota_TH:Power"}

// Tasmota Status
String             Tasmota_Version   "Tasmota Version [%s]" {channel="mqtt:topic:tasmota:tasmota_TH:Version", channel="mqtt:topic:tasmota:tasmota_TH:Version2"}
Switch             Tasmota_Reachable "Reachable"            {channel="mqtt:topic:tasmota:tasmota_TH:Reachable"}

// Diagnostics
String               Tasmota_RestartReason "Restart Reason [%s]"  {channel="mqtt:topic:tasmota:tasmota_TH:RestartReason"}
Number:Dimensionless Tasmota_RSSI          "Signal [%d %%]"       {channel="mqtt:topic:tasmota:tasmota_TH:RSSI"}
String               Tasmota_WifiDowntime  "Wifi Downtime [%s]"   {channel="mqtt:topic:tasmota:tasmota_TH:WifiDowntime"}
Number:Dimensionless Tasmota_LoadAvg       "Load [%d %%]"         {channel="mqtt:topic:tasmota:tasmota_TH:LoadAvg"}
String               Tasmota_Result        "Result [%s]"          {channel="mqtt:topic:tasmota:tasmota_TH:Result"}
Number:Time          Tasmota_Uptime        "Uptime [%.1f s]"      {channel="mqtt:topic:tasmota:tasmota_TH:Uptime"}

// Maintenance (described below)
String Tasmota_Action "Tasmota Action"
```

**.sitemap File:**

```js
// device specific properties
Switch item=Switch_TH
Text   item=Switch_TH_Temp
Text   item=Power

// Maintenance
Switch item=Tasmota_Action mappings=[restart="Restart", queryFW="Query FW", upgrade="Upgrade FW"]

// Tasmota Status
Text item=Tasmota_Version
Text item=Tasmota_Reachable

// Diagnostics
Text item=Tasmota_RestartReason
Text item=Tasmota_RSSI
Text item=Tasmota_WifiDowntime
Text item=Tasmota_LoadAvg
Text item=Tasmota_Uptime label="Uptime [%.1f d]"
Text item=Tasmota_Result
```

The "LWT" topic (["Last Will and Testament"](http://www.hivemq.com/blog/mqtt-essentials-part-9-last-will-and-testament)) will receive regular "Online" messages by the module and an "Offline" message a short time after the module is disconnected, generated by the MQTT broker. These messages are transformed to a valid `ON`/`OFF` state by the [MAP](https://www.openhab.org/addons/transformations/map/) transformation. Of course you can implement `Unreachable` instead of `Reachable` if you prefer. The following transformation file is needed:

**reachable.map Fíle:**

```js
Online=ON
Offline=OFF
```

## Maintenance Actions

A home automation system setup would not be complete without a certain maintenance automation!

Add the following elements to your openHAB setup to be able to perform actions on your Tasmota devices by the press of a simple sitemap button.

The example below includes upgrading the firmware of all devices. A shoutout to @evilgreen for the idea and a big thanks to @smadds for [providing](https://github.com/arendst/Tasmota/issues/19) the idea of a public firmware server.

![Tasmota Maintenance Actions](https://community-openhab-org.s3-eu-central-1.amazonaws.com/original/2X/9/97f0bdf6a81ffe94068e596804adf94839a5580b.png)

**tasmota_maintenance.rules File for Maintenance Actions:**

```js
// Work with grouptopic, addressing ALL modules at once, easiest solution
val tasmota_device_ids = newArrayList("tasmotas")
// OR
// Work with a list of selected Tasmota modules
//val tasmota_device_ids = newArrayList(
//    "tasmota_A00EEA",
//    //… add all your modules here, don't forget some!
//    "tasmota_E8A6E4"
//)

rule "Tasmota Maintenance"
when
    Item Tasmota_Action received command
then
    logInfo("tasmota_maintenance.rules", "Tasmota Maintenance on all devices: " + receivedCommand)
    val actionsBroker = getActions("mqtt","mqtt:broker:MyMQTTBroker") // change to your broker name!
    for (String device_id : tasmota_device_ids) {
        switch (receivedCommand) {
            case "restart" :
                actionsBroker.publishMQTT( "cmnd/" + device_id + "/restart", "1")
            case "queryFW" :
                actionsBroker.publishMQTT( "cmnd/" + device_id + "/status", "2")
            case "upgrade" : {
                // one could change OTA URL using MQTT but if you use different breeds (basic, ir, sensor, ...) of Tasmota, you would lose them
                // it's better to configure OTA url at each device (default) and just trigger upgrade - they will use OTA URL saved in your device.
                //actionsBroker.publishMQTT( "cmnd/" + device_id + "/otaurl", "http://ota.tasmota.com/tasmota/release/tasmota.bin")
                actionsBroker.publishMQTT( "cmnd/" + device_id + "/upgrade", "1")
            }
        }
    }
    createTimer(now.plusSeconds(1))[|Tasmota_Action.postUpdate(UNDEF)]
end
```

### Comparing your device firmware with the current Tasmota GitHub Release

Knowing your devices firmware version(s) is good.
Being able to compare it with the current release directly, is even better.
You can archive this by combining the maintenance actions with the openHAB http binding, the JsonPath transformation and the GitHub API.

Just extend the maintenance setup with the following Item and config:

**http.cfg:**

```js
# Tasmota Release Version (cached twice a day)
tasmotaRelease.url=https://api.github.com/repos/arendst/Tasmota/tags
tasmotaRelease.updateInterval=43200000
```

**tasmota.items:**

```js
String Tasmota_Current_FW_Available "Current Release [%s]" {http="<[tasmotaRelease:10000:JSONPATH($[0].name)]"}
```

With this item in your sitemap, you will now see the latest release/tag from Tasmota repository.

## Discovering Interesting Topics

Additional or further interesting topics are easily identified by reading up on the Tasmota wiki and by subscribing to the modules topics. Subscribe to all topics of one module using [MQTT wildcard](http://www.hivemq.com/blog/mqtt-essentials-part-5-mqtt-topics-best-practices) topic string `+/tasmota_XYZ/#` (string depends on your user-configured Topic/FullTopic). Configure items for the identified topics similar to the ones below.

**Example:**
MQTT messages published by a Sonoff Pow module are shown below (using [mosquitto_sub](https://mosquitto.org/man/mosquitto_sub-1.html)).
The module reports its device state and energy readings periodically.
In the second half of the example the module relay was switched into the OFF position.

```js
$ mosquitto_sub -h localhost -t "+/tasmota_E8A6E4/#" -v

tele/tasmota-E8A6E4/LWT Online
tele/tasmota-E8A6E4/UPTIME {"Time":"2017-07-25T12:02:00", "Uptime":68}
tele/tasmota-E8A6E4/STATE {"Time":"2017-07-25T12:06:28", "Uptime":68, "Vcc":3.122, "POWER":"POWER", "Wifi":{"AP":1, "SSID":"HotelZurBirke", "RSSI":100, "APMac":"24:65:11:BF:12:D8"}}
tele/tasmota-E8A6E4/ENERGY {"Time":"2017-07-25T12:06:28", "Total":0.640, "Yesterday":0.007, "Today":0.003, "Period":0, "Power":0, "Factor":0.00, "Voltage":0, "Current":0.000}
tele/tasmota-E8A6E4/STATE {"Time":"2017-07-25T12:11:28", "Uptime":68, "Vcc":3.122, "POWER":"POWER", "Wifi":{"AP":1, "SSID":"HotelZurBirke", "RSSI":100, "APMac":"24:65:11:BF:12:D8"}}
tele/tasmota-E8A6E4/ENERGY {"Time":"2017-07-25T12:11:28", "Total":0.640, "Yesterday":0.007, "Today":0.003, "Period":0, "Power":0, "Factor":0.00, "Voltage":0, "Current":0.000}
cmnd/tasmota-E8A6E4/POWER OFF
stat/tasmota-E8A6E4/RESULT {"POWER":"OFF"}
stat/tasmota-E8A6E4/POWER OFF
```

Following this method, the behavior-linked messages can be identified and bound to openHAB items.

## Community Forum

For more openHAB related details and questions, please visit the [openHAB community forum thread on Sonoff and Tasmota](https://community.openhab.org/t/itead-sonoff-switches-and-sockets-cheap-esp8266-wifi-mqtt-hardware/15024/1).
