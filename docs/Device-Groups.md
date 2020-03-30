# Device Groups

!!! info "Allow devices to share values and control entire groups of devices"

A framework to allow multiple devices to be in a group with values such as power, light color, color temperature, brightness, PWM values, sensor values and more, all shared with other devices in the group. For example: with multiple lights in a device group, light settings can be changed on one light and the settings will automatically be changed on  other lights. Dimmer switches could be in a device group with lights and that dimmer switch could control the power, brightness and colors of all the lights in the group. Multiple dimmer switches could be in a device group to form a 3-way/4-way dimmer switch.

UDP multicasts, followed by UDP unicasts if necessary, are used to send updates to all devices so updates are fast. There is no need for an MQTT server but all the devices in a group must be on the same IP network.

To enable device groups, execute command:  `SetOption85 1`. All devices in a group must be running firmware with device group support and have device groups enabled.

## Device Groups Operation

Device group name is the MQTT group topic set with the `GroupTopic` command. All devices in the same network with the same group topic are in the same group. Some modules may define additional device groups. For example: if Remote Device Mode is enabled, the PWM Dimmer module defines three devices groups.

Items that are sent to the group and the items that are received from the group are selected with the `DevGroupShare` command. By default all items are sent and received from the group. An example of when the `DevGroupShare` command would be used is when you have a group of lights that you control with a dimmer switch and home automation software. You want the dimmer switch to be able to control all items. The home automation software controls each light individually. When it controls the whole group, it actually sends command to each light in the group. If you use the home automation software to turn an individual light on or off or change it’s brightness, color or scheme, you do not want the change to be replicated to the other lights. In this case, you would set the incoming and outgoing item masks to 0xffffffff (all items) on the dimmer switch (`DevGroupShare 0xffffffff,0xffffffff`) and set the incoming item mask to 0xffffffff and outgoing item mask to 0 on all the lights (`DevGroupShare 0xffffffff,0`).

## Commands

| Command | Parameters|
| --- | --- |
DevGroupShare | `<in>,<out>` = set incoming and outgoing shared item mask (default = 0xffffffff,0xffffffff)<br>1 = Power, 2 = Light brightness, 4 = Light fade/speed, 8 = Light scheme, 16 = Light color, 32 = Dimmer settings (presets)
| GroupTopic<x> | `1` = reset device group &lt;x> MQTT group topic to firmware default (MQTT_GRPTOPIC) and restart<br>`<value>` = set device group &lt;x> MQTT group topic (32 chars max) and restart