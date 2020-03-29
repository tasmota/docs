## General Weaknesses

Whenever you add devices to your network you generate additional points of potential intrusion. This is not only valid for your mobile phones and computers, but also for you Smart TV, you Alexa, or all of your SONOFF devices (ESP8266).

There are following potential risks you have to mitigate:  
- Someone hacks your device and is able to log in into your WLAN. (why is this a problem? [1](#scenario-1))
- Someone hacks your device and is able to read and change any value on your MQTT server (why is this a problem? [2](#scenario-2))
- Someone hacks your network and can interact with your devices (why is this a problem? [3](#scenario-3))
- Someone hacks your device and use it for different things like mail bot or DOS (Denial of Service) device or WLAN jammer (why is this a problem? [4](#scenario-4))

#### Scenario 1  
If someone is able to get your WLAN key, he can login into your network, if he is nearby and scan for any traffic and for any devices. Many communication is not encrypted in your WLAN by default. Therefore be part of your WLAN gives the attacker a great opportunity to screw-up the rest of your infrastructure. Also be part of your WLAN does mean, that the attacker can use your IP-Address and your traffic to do nasty things.

#### Scenario 2
If you can hack an ESP82xx device, you might get access to the keys stored in the device. For example, the MQTT password allows you to read ALL of your devices and change any device at any time. With the information of the MQTT-Server user/password, it might be not required anymore to physically be in your WLAN. Maybe your MQTT Server is publicly accessible. Then the attacker can control your home from any place.

Update: Beginning with version 6.0.0, passwords are not directly exposed through the serial connection or web interface in configuration mode. Therefore it is now less simple, **however still possible** to obtain the MQTT or WLAN password from a device. Such can be accomplished by downloading a configuration backup via the web UI of the device and decoding it using the `decode-config.py` script found in the Tasmota `tools` folder.

#### Scenario 3
It might happen, that e.g. your Samsung SmartTV is not as secure as it should be and an attacker gets access to your network. Now he can listen to any traffic and maybe can make changes on all of your IoT devices.

#### Scenario 4
If someone uses your device to spam mail or do a DOS attack the impact at your home is minimal. You might have more outbound traffic, but maybe you don't recognize this either. But thousands of hacked IoT devices can generate tremendous trouble even at the largest internet providers.

I hope these four typical scenarios ( the list is not complete) give you some idea, why you should take care, even if you're not a terrorist and normally nobody is interested into hacking you personally.

## Securing your WLAN 
That you should have a WLAN key and use WPA2 for encryption is a "no brainer". This is a minimum requirement. Now think about someone can extract the password from the device. E.g. because the device is in the garden and someone with a Laptop and some USB stuff can connect and extract information.  

The hacker will get the key. The ONLY possible preventive action to mitigate worst case scenario is to have a second WLAN, like the "FritzBox Guest WLAN". Many other routers offer similar things. This guest WLAN has no access to your private WLAN. Additionally, there are some interesting switched you can configure for the WLAN.  

At the FritzRouter you can configure _"network separation"_. At Fritz this is done by DISABLE _"The wireless devices connected with the guest access can communicate with each other"_. This does mean, that a device in the network can not interact with any other device in the WLAN. It can only communicate with the Internet. This simple configuration prevents any attacker to do nasty stuff on YOUR network. Now we have to take care, that the attacker is not creating a Bot-Net and sending e.g., Spam-Mails.  

Normally a device in the "guest WLAN" can use any internet service. For our IoT devices and for any new device we can create a Router rule, that ONLY MQTT is allowed to our server and any other traffic is blocked. This is a great configuration because it limits the options what a hacker can do. If you have a FritzBox following configuration has to be created to get this working:

1. Create Profile to block all communication except MQTT and NTP Time services.

   Internet -> Filters -> List -> "Add Network Application"

   "New Protocol" (Add four rules, This will block all but UDP123 for Timeserver and 8883 for MQTT Server)  
   - TCP from any to Port 1 to 8882
   - TCP from any to Port 8884 to 65636
   - UDP from any to Port 1 to 122
   - UDP from any to Port 124 to 65636

2. Create a list of "websites" your IoT devices are allowed to access.  
   Internet -> Filters -> List -> "Permitted web sites" -> EDIT
   ```
   yourserver
   01.de.pool.ntp.org
   ```
   Replace <yourserver> with the full qualified name of your router in the Internet.  
   NTP server - Use the one you have defined in Tasmota to be the timeserver.  

3. Create a profile you can attach to your IoT devices.  
   Internet -> Filters -> Access profiles -> "new Access profile"  
   "Filter Web sites"  
   DISABLE "Allow HTTPS queries"  
   SELECT "Permit web sites (whitelist)  

Now you will probably ask two questions:   
1. How can I communicate with my MQTT Server in my personal WLAN if only traffic into the internet is allowed?  
2. How can I access the WebConsole of my devices to upload new Firmware and/or make investigations?  

The first topic will be solved by exposing your MQTT server to the Internet (no worries, can be done securely).  

The second topic has only a workaround. If you want access to your devices you need to change the configuration temporary on your router and ENABLE _"The wireless devices connected with the guest access can communicate with each other"_. Secondly, you must login with your Laptop into the GuestWLAN to be able to communicate. If the Webserver is running you should be able to connect and upload e.g. a new firmware.

## Securing your Communication
In the world of IoT devices and more and more devices in a network, it is essential to use encryption ALL the time. The Tasmota project is able to enable encryption for MQTT. This is great. But it cannot enable encryption on the WebServer. This is bad. As a conclusion, the Webserver must be switched OFF all the time and only be switched ON for administrative purpose. This also disables the feature to change the Relay Status with an HTTP REST call. But this option is insecure anyway and should be avoided.

Now let's work on the MQTT configuration. Also here an attacker can get access to user and password. To minimize the impact EVERY and really EVERY device must have a unique USER and a unique password. If you don't follow this rule the attacker get one device he can control ALL devices. With the USER/PASSWORD he now can control the one device he already holds in his hands. ok, no big deal. How to configure Mosquitto?

In general, Tasmota stores data in stat/<topic>/+ and  tele/<topic>/+. or cmnd/<topic>/+ to control something. If we use the <topic> as username we can make some quite nice and straight forward configuration.

Example:  
Topic: ESP_123456  
User: ESP_123456 (must be the same to Topic)  
password: 987654321  

Configurationfile: /etc/mosquitte/conf.d/jp.acl
```
user root
topic read #
topic write #

pattern read cmnd/%u/#
pattern write stat/%u/#
pattern write tele/%u/#
```

My user root is allowed to do everything. This is used in my home-automation to control all devices and listen to all devices. The "pattern" is used for ALL other users and the %u is a substitute. The great thing is that the device can read its configuration but cannot write to it. And the status information it posts to the /status/ but is not able to read it afterward. With this minimal configuration, Tasmota devices are running.

To add the different user to Mosquitte the following two commands work fine. There is also a re-read available, but a restart works better for me.

```
sudo mosquitto_passwd -b /etc/mosquitto/conf.d/jp.pw ESP_123456 987654321
sudo /etc/init.d/mosquitto restart
```

If this is running we switch the Mosquitto to secure communication on Port 8883 and disable all insecure options. 

/etc/mosquitto/conf.d/user.conf
```
#User Config
password_file /etc/mosquitto/conf.d/jp.pw
acl_file /etc/mosquitto/conf.d/jp.acl

allow_anonymous false

listener 8883

cafile   /etc/mosquitto/certs/ca.crt
certfile /etc/mosquitto/certs/server.crt
keyfile  /etc/mosquitto/certs/server.key
require_certificate false
```

How to generate the certificates in mosquitto please look at:
- [Mosquitto SSL Configuration - MQTT TLS Security](http://www.steves-internet-guide.com/mosquitto-tls/)
- [Adding TLS to connect to Mosquitto](https://myles.eftos.id.au/blog/2016/08/07/adding-tls/#.Wlo7EnXiZ9N)
- [Internet of Things messaging MQTT with TLS](http://lukse.lt/uzrasai/2015-02-internet-of-things-messaging-mqtt-1-installing-mosquitto-server/)
- [Enable Secure Communication with TLS and the Mosquitto Broker](https://mcuoneclipse.com/2017/04/14/enable-secure-communication-with-tls-and-the-mosquitto-broker/)

## SSL/TLS on Tasmota

[TLS](TLS) article explains how to set it up in Tasmota

## Disable unsecured fallback WiFi (WifiManager)

In case your Wifi SSID is not available (i.e. access point dies), the WiFiManager will jump into action and make your tasmota devices available using an unsecured access point.
Type WifiConfig into the tasmota console. If this parameter is set to 2, you might want to change it after completing the setup of your device. Some less risky options would be: 0/4/5. (For details, see https://tasmota.github.io/docs/#/Commands?id=wi-fi)
