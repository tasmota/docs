
The "open Home Automation Bus" ([openHAB](http://www.openhab.org/)) is an open source, technology agnostic home automation platform which runs as the center of your smart home. Besides 200 other add-ons for all kinds of technologies, openHAB provides an MQTT add-on ("binding") to interface with systems like Tasmota.

By following the guide below you'll be able to observe, control and manage your Tasmotamodules from your openHAB system. If you are new to openHAB, please learn about the basic concepts and the initial setup. The below article will not cover any basics which are out of scope to the Tasmota integration.

**Example Result:**
The screenshot of an openHAB Sitemap below features a few Sonoff modules for lighting, two modified Sonoff Basic with sensors for temperature and humidity readings and two Sonoff Pow for power measurements of a washing machine and dishwasher:

![example openHAB sitemap](https://community-openhab-org.s3-eu-central-1.amazonaws.com/original/2X/c/c4c91610a96750bb3ee30c88c299884039f80172.png)

## Requirements

* Working openHAB installation (https://www.openhab.org/docs/)
* Configured Tasmota device (accessible from your local network)
* MQTT broker available (e.g. Eclipse Mosquitto via [openHABian](https://www.openhab.org/docs/installation/openhabian.html))
* A [basic understanding of MQTT](http://www.hivemq.com/blog/mqtt-essentials) 
* Working and tested connection between openHAB and the MQTT broker
* (optional) Standalone [MQTT client](http://www.hivemq.com/blog/seven-best-mqtt-client-tools) (e.g. [mqtt-spy](https://kamilfb.github.io/mqtt-spy)) to observe and identify messages on the MQTT broker

**Highly recommended:** If you are new to openHAB + MQTT, go through this tutorial: <br>
⇨ [MQTT Binding - Getting Started 101](https://community.openhab.org/t/mqtt-binding-v1-11-getting-started-101/33958)

Before continuing, please make sure you assigned **unique MQTT "Topics"** in the Tasmota configuration interface of each pf your devices. The default MQTT topic is "tasmota", in the examples below we will use names like "tasmota-A00EEA".

<!-- ![Example Tasmota MQTT settings](https://community-openhab-org.s3-eu-central-1.amazonaws.com/original/2X/8/8fe9008fb24b0b70e6eddf7cf0f0c70c8ac21b92.png "Example Tasmota MQTT settings") -->

----

If not done yet, you first need to **install and activate** the [MQTTv1](https://www.openhab.org/addons/bindings/mqtt1/)/[MQTTv2](https://www.openhab.org/addons/bindings/mqtt/)&ast;, the [MQTT action](https://www.openhab.org/addons/actions/mqtt/) and the [JsonPath transformation](https://www.openhab.org/addons/transformations/jsonpath/), e.g. via the openHAB Paper UI Add-ons section.

****

?> MQTTv1 vs. MQTTv2 Binding Information<br>
The openHAB community has released a new native openHAB 2 MQTT Binding, which complies with enhancements and significantly changes. Be aware that if you update your openHAB instance, the new MQTT binding may be get installed and `mqtt1` could be uninstalled! This means that any MQTT openHAB automations in your openHAB environment will exhibit odd behavior or not operate at all. If you are using `mqtt1`, jump to the `mqtt1` section [below](#mqttv1-Integration).

## MQTTv2 Integration

**.things File:**

```js
Bridge mqtt:broker:myMQTTBroker [ host="IPofBroker", secure=false, username="myUser", password="myPassword" , clientID="myMQTTClient" ]
{
    Thing topic tasmota_TH_Thing "Light_TH" {
    Channels:
        Type switch : PowerSwitch  [ stateTopic="stat/tasmota_TH/POWER" , transformationPattern="JSONPATH:$.POWER" , commandTopic="cmnd/tasmota_TH/POWER", on="ON", off="OFF" ]
        Type string : Version [stateTopic="stat/tasmota_TH/STATUS2", transformationPattern="JSONPATH:$.StatusFWR.Version"]
        Type string : Temperature [stateTopic="tele/tasmota_TH/SENSOR", transformationPattern="JSONPATH:$.AM2301.Temperature"]
      }
}
```

**.items File:**

```js
Switch Switch_TH "Switch_TH"  { channel="mqtt:topic:myMQTTBroker:tasmota_TH_Thing:PowerSwitch" }

String  Switch_TH_Temperatur "Temperatur [%s °C]" <temperature> {channel="mqtt:topic:myMQTTBroker:tasmota_TH_Thing:Temperature"}
String  Sonoff_Version "Tasmota Version: [%s]" <tasmota_basic> { channel="mqtt:topic:myMQTTBroker:tasmota_6_Thing:Version"}
```

**.rules File for the Maintenance Action:**

```js
// Work with a list of selected Tasmota modules
val tasmota_device_ids = newArrayList(
    "tasmota-A00EEA",
    //… add all your modules here!
    "tasmota-E8A6E4"
)
// OR
// Work with the grouptopic, addressing ALL modules at once
//val tasmota_device_ids = newArrayList("tasmotas")

rule "TasmotaMaintenance"
when
    Item Sonoff_Action received command
then
    logInfo("tasmota.rules", "TasmotaMaintenance on all devices: " + receivedCommand)
    val actionsBroker = getActions("mqtt","mqtt:broker:MyMQTTBroker") // change to your broker name!
    for (String device_id : tasmota_device_ids) {
        switch (receivedCommand) {
            case "restart" :
                actionsBroker.publishMQTT( "cmnd/" + device_id + "/restart", "1")
            case "queryFW" :
                actionsBroker.publishMQTT( "cmnd/" + device_id + "/status", "2")
            case "upgrade" : {
                actionsBroker.publishMQTT( "cmnd/" + device_id + "/otaurl", "http://thehackbox.org/tasmota/release/tasmota.bin")  // Replace with your preferred build
                actionsBroker.publishMQTT( "cmnd/" + device_id + "/upgrade", "1")
            }
        }
    }
    Sonoff_Action.postUpdate(NULL)
end
```

## MQTTv1 Integration

Please note that since `mqtt1` is a legacy binding, it will no longer receive updates or fixes. If you update your openHAB instance, the new MQTT binding will be installed and `mqtt1` will be uninstalled! This means that any MQTT openHAB automations in your openHAB environment will exhibit odd behavior or not operate at all. Fortunately, the `mqtt1` Binding can be reinstalled. To do so, turn on "Include Legacy 1.x Bindings" via PaperUI (Configuration > System) or set `legacy = true` in `addons.cfg`. Then reinstall the `mqtt1` Binding. Installing both `mqtt2` and `mqtt1` bindings will allow you to migrate over time to be ready for the eventuality of `mqtt1` end of life.

For users that intend to migrate to the new MQTT Binding some examples for the integration have been added [above](#MQTTv2-Integration).

----


In the example configuration you can see a non-default **Full Topic** definition, which is **not** used in the following examples (but which can be recommended).

Simply **set up items** for all Tasmota [MQTT topics](MQTT#mqtt-topic-definition) you are interested in. Examples for most needed topics are given below. Some Tasmota topics are JSON encoded, the `JSONPATH` transformation can be used to extract this data.
 
Additional or further interesting topics are easily identified by reading up on the Tasmota wiki and by subscribing to the modules topics. Subscribe to all topics of one module with the [MQTT wildcard](http://www.hivemq.com/blog/mqtt-essentials-part-5-mqtt-topics-best-practices) topic string `+/tasmota-XYZ/#` (String depends on your user-configured Topic/FullTopic). Configure items for the identified topics similar to the ones below.

**Example:**
MQTT messages published by a Sonoff Pow module are shown below (using [mosquitto_sub](https://mosquitto.org/man/mosquitto_sub-1.html)).
The module reports its device state and energy readings periodically.
In the second half of the example the module relay was switched into the OFF position.

```js
$ mosquitto_sub -h localhost -t "+/tasmota-E8A6E4/#" -v

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

### Mandatory Topics / Items

This it the minimal set of items for the basic functionality of different Tasmota devices. You'll need to replace the given example dive name (e.g. "tasmota-A00EEA") by the one chosen for your module. 
<br /> (*Note: Lines have been wrapped for better presentation*)

**tasmota.items:**

* Sonoff Basic / Sonoff S20 Smart Socket (Read and switch on-state)
  ```js
  Switch LivingRoom_Light "Living Room Light" <light> (LR,gLight)
      { mqtt=">[broker:cmnd/tasmota-A00EEA/POWER:command:*:default],
              <[broker:stat/tasmota-A00EEA/POWER:state:default]" }
  ```
* Sonoff Pow (Read and switch on-state, read current wattage)
  ```js
  // compare with example message stream above!
  Switch BA_Washingmachine "Washingmachine" <washer> (BA)
      { mqtt=">[broker:cmnd/tasmota-E8A6E4/POWER:command:*:default],
              <[broker:stat/tasmota-E8A6E4/POWER:state:default]" }
  
  Number BA_Washingmachine_Power "Washingmachine Power [%.1f W]" (BA,gPower)
      { mqtt="<[broker:tele/tasmota-E8A6E4/SENSOR:state:JSONPATH($.ENERGY.Power)]" }
  ```

* RGB(CW) LED stripes or other devices which support `Color` command (Read and switch on-state)
  ```js
  Switch LivingRoom_Light "Living Room Light" <light> (LR,gLight)
      { mqtt=">[broker:cmnd/tasmota-000000/POWER:command:*:default],
              <[broker:stat/tasmota-000000/RESULT:state:JSONPATH($.POWER)]" }
  ```
### Status Topics / Items

It is furthermore recommended, to add the following status items for every Tasmota device.

**tasmota.items:** 

* A switch being 'ON' as long as the device is reachable 💬
  ```js
  Switch LivingRoom_Light_Reachable "Living Room Light: reachable" (gReachable)
      { mqtt="<[broker:tele/tasmota-A00EEA/LWT:state:MAP(reachable.map)]" }
  ```

* Wifi Signal Strength in Percent
  ```js
  Number LivingRoom_Light_RSSI "Living Room Light: RSSI [%d %%]" (gRSSI)
      { mqtt="<[broker:tele/tasmota-A00EEA/STATE:state:JSONPATH($.Wifi.RSSI)]" }
  ```

* Optional! A collection of return messages by the Sonoff module
<br>Recommendation: Define specific items for what you really need on a regular basis, use standalone MQTT client for troubleshooting
  ```js
  String LivingRoom_Light_Verbose "Living Room Light: MQTT return message [%s]"
      { mqtt="<[broker:tele/tasmota-A00EEA/INFO1:state:default],
              <[broker:stat/tasmota-A00EEA/STATUS2:state:default],
              <[broker:stat/tasmota-A00EEA/RESULT:state:default]" }
  ```

💬 The "LWT" topic (["Last Will and Testament"](http://www.hivemq.com/blog/mqtt-essentials-part-9-last-will-and-testament)) will receive regular "Online" messages by the module and an "Offline" message a short time after the module is disconnected, generated by the MQTT broker. These messages are transformed to a valid `ON`/`OFF` state by the [MAP](https://www.openhab.org/addons/transformations/map/) transformation. Of course you can implement `Unreachable` instead of `Reachable` if you prefer. The following transformation file is needed:

**reachable.map:**
```js
Online=ON
Offline=OFF
```

## Maintenance Actions

A home automation system setup would not be complete without a certain maintenance automation!

Add the following elements to your openHAB setup to be able to perform actions on your Tasmota devices by the press of a simple sitemap button.

The example below includes upgrading the firmware of all devices. A shoutout to @evilgreen for the idea and a big thanks to @smadds for [providing](https://github.com/arendst/Tasmota/issues/19) the public firmware server used in the example.

![Tasmota Maintenance Actions](https://community-openhab-org.s3-eu-central-1.amazonaws.com/original/2X/9/97f0bdf6a81ffe94068e596804adf94839a5580b.png)

**tasmota.items:**
```js
//... all the above

//Maintenance
String  Sonoff_Action "Tasmota Action" <tasmota_basic>
```

**yourhome.sitemap:**
```js
//...
Switch item=Sonoff_Action mappings=[restart="Restart", queryFW="Query FW", upgrade="Upgrade FW"]
//...
```

**tasmota.rules:**
```js
// Work with a list of selected Tasmota modules
val tasmota_device_ids = newArrayList(
    "tasmota-A00EEA",
    //... add all your modules here!
    "tasmota-E8A6E4"
)
// OR
// Work with the grouptopic, addressing ALL modules at once
//val tasmota_device_ids = newArrayList("tasmotas")

rule "Tasmota Maintenance"
when
    Item Sonoff_Action received command
then 
    logInfo("tasmota.rules", "TasmotaMaintenance on all devices: " + receivedCommand)
    for (String device_id : tasmota_device_ids) {
        switch (receivedCommand) {
            case "restart" :
                publish("broker", "cmnd/" + device_id + "/restart", "1") 
            case "queryFW" :
                publish("broker", "cmnd/" + device_id + "/status", "2")
            case "upgrade" : {
                publish("broker", "cmnd/" + device_id + "/otaurl", "http://thehackbox.org/tasmota/tasmota.bin")
                publish("broker", "cmnd/" + device_id + "/upgrade", "1")
            }
        }
    }
    Sonoff_Action.postUpdate(NULL)
end
```

#### Comparing your device firmware with the current Tasmota GitHub Release

Knowing your devices firmware version(s) is good.
Being able to compare it with the current release directly, is even better.
You can archive this by combining the maintenance actions with the openHAB http binding, the jsonpath transformation and the GitHub API.

Just extend the maintenance setup with the following Item and config:

**http.cfg:**
```js
# Tasmota Release Status (cached twice a day)
tasmotaRelease.url=https://api.github.com/repos/arendst/Tasmota/tags
tasmotaRelease.updateInterval=43200000
```

**tasmota.items:**
```js
String Sonoff_Current_FW_Available "Current Release [%s]" <tasmota_basic> (Sonoff_Maintenance) { http="<[tasmotaRelease:10000:JSONPATH($[0].name)]"}
```

With the item in your sitemap, you will now see the latest release/tag from the tasmota repository.

## Community Forum

For more openHAB related details and questions, please visit the [openHAB community forum thread on Sonoff and Tasmota](https://community.openhab.org/t/itead-sonoff-switches-and-sockets-cheap-esp8266-wifi-mqtt-hardware/15024/1).
