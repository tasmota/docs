## MQTT Message flow 

Here is a diagram showing the connection phase and the network transactions required to turn a sonoff device on.   

![flow diagram](http://alt2.pbeirne.com/images/sonoff_cmnd_flow3.png)

In a typical setup, you'll have multiple devices on the left-hand side.  

![image](http://alt2.pbeirne.com/images/sonoff_cmnd_flow2.png)


There are lots of ways to control your devices. One typically uses a laptop/desktop to configure and test your Sonoffs and perhaps a smartphone to keep track of what's happening. In the long run you might want to integrate your device in a home-automation system like node-RED, openHAB, HomeAssistant, HomeBridge, Domoticz, ...

### MQTT Message Prefixes
Message|Issued by|Intent
:---|:---|:---
`cmnd`|devices shown on the right-hand side|control the Sonoff; set configuration; ask for status
`stat`|the Sonoffs on the left-hand side|report back status or configuration message
`tele`|some Sonoffs (like temperature measuring devices)|report unsolicited telemetry info at periodic intervals

These are `prefix1`, `prefix2` & `prefix3` in the code

### Configuring MQTT
MQTT settings can be initially setup in the web interface and thereafter configured by commands.

#### Enable MQTT
Enable MQTT with the tickbox under Configuration -> Configuration Other

#### Configure MQTT Settings
Once enabled MQTT can be configured at Configuration -> Configure MQTT. 

Field|Size|Default(my_user_config.h)|Notes
:---|:---|:---|:---
Host name |32|MQTT_HOST=mqtt_broker.com|Remote URL or ip address. Note that without a special firmware build SSL is NOT supported. 
Port|uint|MQTT_PORT=1883|0-65535
Client Id|32|MQTT_CLIENT_ID=DVES_%06X|FallBack topic of this device, will be unique for every device; logged by the MQTT server
Username|32|MQTT_USER=DVES_USER|Username for MQTT server authentication
Password|32|MQTT_PASS=DVES_PASS|Password for MQTT server authentication
Topic|32|MQTT_TOPIC=sonoff|User friendly topic name; usually describes the location or use of this device; used in the MQTT commands and responses; should be unique
Full Topic|100|%prefix%/%topic%|Format string used to assemble the MQTT commands

Note: By default firmware will search for an MQTT broker using mDNS by searching for a tcp record mqtt.local. However the use of local mDNS hostnames (ex: mqtt_home.local) is not supported, if you want to use a broker on your local network you need to use its local IP or rely on a local DNS to resolve the hostnames.

## Programming examples for the Sonoff-MQTT-OTA-Arduino

### TL;DR
    mosquitto_sub -h mqtt_server_name.com -t stat/my_sonoff/POWER -v    # listen for status
    mosquitto_pub -h mqtt_server_name.com -t cmnd/my_sonoff/power -m 1  # turn on the light

### General

See the wiki's [command list](Commands) for the definitive list of operations that you can perform. The first word in the column marked `Command` is the text that you need to put at the end of a `cmnd` string when you issue a publication message. The second word is the contents of the payload. If there is no second word, you can simply send an empty payload. For example:

Command|Description
:---|:---
Power|Show current power state as On or Off
Power on|Turn power On
Power off|Turn power Off

To execute these, issue (publish) these MQTT requests

    MQTT topic            MQTT payload
    cmnd/my_device/power  <empty>
    cmnd/my_device/power  on
    cmnd/my_device/power  off

The sonoff will respond with these publications:

    MQTT topic            MQTT payload
    stat/my_device/POWER  ON
    stat/my_device/POWER  ON
    stat/my_device/POWER  OFF

If you have subscribed to these `stat` messages, you can be informed of changes on the device.


#### Connecting to MQTT
You'll need an MQTT server somewhere to communicate with your Sonoff. Some people use publicly available servers, such as iot.eclipse.org. [List of brokers](http://moxd.io/2015/10/public-mqtt-brokers/)

Other people think the MQTT server should reside inside your private LAN. You could use a Raspberry/Orange Pi, or just about any Linux machine as the server/broker; you might even squeeze it into your router if you're using OpenWRT.

#### Topics
The middle word of the 'topic' phrase indicates the name of the device. You can communicate with a sonoff using its topic name, its group name or its FallBack topic name (like DVES_123456).

At the time the sonoff connects with the MQTT server, the sonoff subscribes to +++"cmnd/my-topic/#", "cmnd/group-topic/#" and "cmnd/fallback-topic/#",+++ and listens on all those names. You can find the group name using "status 0" and the FallBack topic using "status 6" or both on the Information page in WebUI.


#### Creating your own MQTT server/broker
See these sites:
- [Rufio howto](https://www.digitalocean.com/community/questions/how-to-setup-a-mosquitto-mqtt-server-and-receive-data-from-owntracks)
- [Wingsquare howto](http://wingsquare.com/blog/setting-up-mqtt-mosquitto-broker-in-ubuntu-linux/)
- [Instructables howto on Raspberry Pi](http://www.instructables.com/id/Installing-MQTT-BrokerMosquitto-on-Raspberry-Pi/)


### Linux/Cygwin command line

You can install the mosquitto client system using either
- [Cygwin] setup mosquitto_client
- [Ubuntu/Debian] apt install mosquitto_client
- [Centos/Fedora] yum install mosquitto_client

#### Controlling (Publishing)

You can control the relay in your Sonoff with mosquitto_pub. Suppose your Sonoff topic is "my_house_living_room" and your mqtt broker is "control_central". To turn on the Sonoff, type this on the command line:

    mosquitto_pub -h control_central -t cmnd/my_house_living_room/power -m 1

You can turn the Sonoff back off again with:

    mosquitto_pub -h control_central -t cmnd/my_house_living_room/power -m 0

If you want to find out what state your sonoff is, issue this command with an empty payload to trigger a status response (see below for how to listen):

    mosquitto_pub -h control_central -t cmnd/my_house_living_room/status -n

#### Listening (Subscribing)
To keep track of your sonoff, just subscribe to messages starting with `stat`, followed by your topic. For example, to pick up status messages from your sonoff, use

    mosquitto_sub -h control_central -t stat/my_house_living_room/STATUS -v

The optional `-v` will show you the topic _and_ payload.

These Sonoffs can provide specific information if you wish. To just monitor the relay state, try

    mosquitto_sub -h control_central -t stat/my_house_living_room/POWER

You can also use wildcards in your subscription. To pick up _every_ message from this sonoff, you can use

    mosquitto_sub -h control_central -t stat/my_house_living_room/+

and then some other code to just pick out the messages you want. If you have a collection of sonoffs, you can listen to them all by either using the group topic

    mosquitto_sub -h control_central -t stat/my_house_collection/POWER

or by using a wildcard in the 2nd position

    mosquitto_sub -h control_central -t stat/+/POWER



### Python
Of course you can always call `system()` or `subprocess()` to run the `mosquitto_pub` and `mosquitto_sub` command lines as shown above. But if you wish, you can install the paho-mqtt package and communicate with MQTT using Python objects.

Let's turn the lights on, wait a few seconds, turn them off, check the status and wait for a time stamp

```python
import paho.mqtt.client as mqtt, time, sys

last_topic = ""
last_payload = ""

# main
def on_connect(client, userdata, flags, rc):
    print("Connected")
    client.is_connected = True

def on_message(client, userdata, message):
    ''' note: message is a tuple of (topic, payload, qos, retain)'''
    global last_topic, last_payload
    last_topic = message.topic
    last_payload = message.payload
    print("Got a message with topic: [" + last_topic + "] and payload [" + last_payload + "]")

client = mqtt.Client()
# if you need a username and/or password for mqtt uncomment next line
# client.username_pw_set("myusr", password="mypwd") 
client.on_connect = on_connect
client.on_message = on_message

client.is_connected = False
client.loop_start()
client.connect("control_central") # replace "control_central" with ip address or name of server

time.sleep(6)
if not client.is_connected:
    print("problem connecting to the MQTT server; please check your settings")
    sys.exit(1)

# edit subscribe and publish lines and use yours like "stat/tasmota/POWER"
client.subscribe("stat/my_house_living_room/POWER")
client.publish("cmnd/my_house_living_room/power","1")

# wait a little bit
time.sleep(15)
client.publish("cmnd/my_house_living_room/power","0")

# ask for system status
time.sleep(1)
client.subscribe("stat/my_house_living_room/STATUS")
client.publish("cmnd/my_house_living_room/status",None)

# now wait for a time stamp from the sonoff; this could take an hour
client.subscribe("tele/my_house_living_room/+")

# if using tasmota-sensors.bin next section will not work unless you replace "STATE" with "SENSOR"
while 1:
    if last_topic.startswith("tele/") and last_topic.endswith("STATE"):
        locate_time = last_payload.find(b'"Time":')
        the_time = last_payload[locate_time+8:locate_time+8+19]
        print("the sonoff thinks the time is: "+the_time.decode("utf-8"))
        break
    time.sleep(5)

client.loop_stop()
client.disconnect()
```

Ref: [Python MQTT](https://pypi.python.org/pypi/paho-mqtt/1.1)

### JavaScript
Using the node module MQTT.js you can connect to the MQTT broker, send messages and listen to topics. The example uses code compatible with Node v4 or later.

```javascript
'use strict';
const mqtt   = require('mqtt');

const broker = 'mqtt://192.168.0.13';	// MQTT Broker hostname/IP address
const client = mqtt.connect(broker);	// MQTT Client
const device = 'switch1';				// Sonoff device identifier

let state = 'OFF';
let timer;

client.on('connect', function () {

	console.log(`${Date.now()} Client connected to ${broker}`);

	client.subscribe(`stat/${device}/+`);
	client.subscribe(`tele/${device}/+`);

	client.publish(`cmnd/${device}/status`);

	timer = setInterval(loop, 2000);
});

client.on('message', function (topic, message) {

	if (topic === `stat/${device}/POWER`) {
		state = message.toString();
	}

	console.log(`${Date.now()} RX ${topic} ${message}`);
});

function loop() {

	if (!client.connected) {
		return timer && timer.clearInterval();
	}

	let newState = state === 'OFF' ? 'ON' : 'OFF';

	client.publish(`cmnd/${device}/power`, newState);

	console.log(`${Date.now()} TX cmnd/${device}/power ${newState}`);
}
```

Ref: [Node MQTT.js](https://github.com/mqttjs/MQTT.js)

### Android phone MQTT Dashboard
The [MQTT Dashboard](https://play.google.com/store/apps/details?id=com.thn.iotmqttdashboard)
provides the ability to connect and control Sonoff devices directly.

On the first page, enter the details of how your phone should connect to the MQTT broker. On the SUBSCRIBE page, you
can create widgets which listen for publications from the Sonoff. A typical subscription for a power controller might be
`stat/my_device/POWER`

You could also pick up _all_ your devices with
`stat/+/POWER`

On the PUBLISH page, you can create widgets to toggle or on/off your Sonoff. Typically you'd send a
`cmnd/my_device/power` as the topic, and `on` or `off` as the _publish value_. Note that you can also have separate words
on the app's user interface, such as `illuminated` and `extinguished`; these are _not_ sent out via MQTT, they're just
user interface.

Alternatively, if you're using a home automation system, there may be an Andriod/iOS app to link to your home automation.
That's not covered in this how-to.

## Troubleshooting

### CONNECT FAILED
    MQTT: CONNECT FAILED x.x.x.x:x, rc {code}. Retry in 10 seconds

## [Status codes](http://pubsubclient.knolleary.net/api.html#state)

    -4: MQTT_CONNECTION_TIMEOUT - the server didn't respond within the keepalive time
    -3: MQTT_CONNECTION_LOST - the network connection was broken
    -2: MQTT_CONNECT_FAILED - the network connection failed
    -1: MQTT_DISCONNECTED - the client is disconnected cleanly
     0: MQTT_CONNECTED - the client is connected
     1: MQTT_CONNECT_BAD_PROTOCOL - the server doesn't support the requested version of MQTT
     2: MQTT_CONNECT_BAD_CLIENT_ID - the server rejected the client identifier
     3: MQTT_CONNECT_UNAVAILABLE - the server was unable to accept the connection
     4: MQTT_CONNECT_BAD_CREDENTIALS - the username/password were rejected
     5: MQTT_CONNECT_UNAUTHORIZED - the client was not authorized to connect


## Debug Tools
- [MQTT Snooper - Sniffer App on Android](https://play.google.com/store/apps/details?id=mqttsnooper.mqttsnooper)
- [MQTT Explorer - Desktop Application](https://mqtt-explorer.com/?c=tasmota-wiki)
- If mosquitto is installed, command-line: `mosquitto_sub -h mqtt-host -v -t "#"`
