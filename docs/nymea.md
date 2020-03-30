# nymea
nymea is an open source IoT platform. It can be used in various IoT applications such as smart home appliances, IoT technology gateways or general "thing" automation. nymea is technology agnostic and uses a plugin framework to extend functionality towards different device types, online services or data transports. Using nymea-plugin-tasmota it can also interact with tasmota based devices.

nymea consists of three main parts: nymea:core, nymea:app and nymea:cloud.

**nymea:core** is the core piece of nymea and is meant to be installed on a persistent node in your network or the internet. It connects to devices and services and manages them using automation rules. Typically, nymea:core is installed on a IoT "box", such as a raspberry Pi or the nymea:box, however, it can be installed on Desktop PCs (Linux based), cloud servers, VM's or any other machine running Linux. nymea hosts pre-built packages for Ubuntu and Debian GNU/Linux as well as Snap packages which can be installed on any major Linux Distribution.

**nymea:app** is the frontend for nymea:core. It is used to configure the system as well as interact with it. It allows to control configured IoT devices, monitor states and logs and set up automation rules.

**nymea:cloud** is the cloud connectivity suite. It is optional (nymea can work fully offline, not requiring any registration or online service at all) and extends nymea with features such as easy remote connection without having to fiddle with firewall ports and allows to send nymea:core push notifications to phones/tablets having nymea:app installed.

![nymea:app's main page](https://nymea.io/files/images/mainpage.png)
![nymea:app's lights page](https://nymea.io/files/images/lightspage.png)

More information about nymea can be found at [the nymea website](https://nymea.io) and [the nymea wiki](https://wiki.nymea.io).

# Configuring Sonoff/Tasmota devices for use with nymea
## Requirements
* A working nymea installation (see nymea wiki for install instructions)
* A Tasmota device connected to the same network as nymea:core

Once those above requirements are met, use nymea:app to add the sonoff device. Depending how you've set it up it will appear as a switch or light bulb in nymea.

![From the main page, open the main menu](https://nymea.io/files/images/add-thing1.png)
![Select "Configure things"](https://nymea.io/files/images/add-thing2.png)
![Click on the + in the upper right corner](https://nymea.io/files/images/add-thing3.png)
![Find Tasmota in the list](https://nymea.io/files/images/add-thing4.png)
![Enter a name and the IP address, choose the connected device](https://nymea.io/files/images/add-thing5.png)
![That's it!](https://nymea.io/files/images/add-thing6.png)


# How does it work?
nymea:core features an internal MQTT broker. There is no need to set up an external MQTT broker. Also, during the setup, nymea will configure the Tasmota device. The only thing required is the IP address of the Tasmota device. Please note that for this to work the nymea internal MQTT broker needs to be enabled. This is the default setting so there should not be the need to manually configure anything unless you've previously disabled the internal MQTT broker.

# Support, troubleshooting, contributing
You are welcome to report issues and feature requests in the nymea bug trackers on [nymea:core's github page](https://github.com/guh/nymea) and [the nymea app github page](https://github.com/guh/nymea-app) as well as ask for help or just discuss about Tasmota and nymea in the [nymea forum](https://forum.nymea.io).