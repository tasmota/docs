# Device Groups

!!! info "Allow devices to share values and control entire groups of devices"

A framework to allow multiple devices to be in a group with values such as power, light color, color temperature, brightness, PWM values, sensor values and more, all shared with other devices in the group. For example, with multiple lights in a device group, light settings can be changed on one light and the settings will automatically be changed on  other lights. Dimmer switches could be in a device group with lights and that dimmer switch could control the power, brightness and colors of all the lights in the group. Multiple dimmer switches could be in a device group to form a 3-way/4-way dimmer switch.

UDP multicasts, followed by UDP unicasts if necessary, are used to send updates to all devices so updates are fast. There is no need for an MQTT server but all the devices in a group must be on the same multicast network. The multicast address and port are specified at compile time with the DEVICE_GROUPS_ADDRESS (default=239.255.250.250) and DEVICE_GROUPS_PORT (default=4447) macros respectively.

To enable device groups, execute command:  `SetOption85 1`. All devices in a group must be running firmware with device group support and have device groups enabled.

## Operation

The device group name is set with the `DevGroupName` command (GroupTopic prior to 8.2.0.3). If a device group name is not set for a group, the MQTT group topic is used (with the device group number appended for device group numbers > 1). All devices in the same multicast network with the same device group name are in the same group. Some modules may define additional device groups. For example, if Remote Device Mode is enabled, the PWM Dimmer module defines three devices groups.

The items sent and received from the group are selected with the `DevGroupShare` command. By default all items are sent and received. An example of when the `DevGroupShare` command would be used is when you have a group of lights that you control with a dimmer switch and home automation software. You want the dimmer switch to be able to control all items. The home automation software controls each light individually. When it controls the whole group, it actually sends command to each light in the group. If you use the home automation software to turn an individual light on or off or change it's brightness, color or scheme, you do not want the change to be replicated to the other lights. In this case, you would set the incoming and outgoing item masks to 0xffffffff (all items) on the dimmer switch (`DevGroupShare 0xffffffff,0xffffffff`) and set the incoming item mask to 0xffffffff and outgoing item mask to 0 on all the lights (`DevGroupShare 0xffffffff,0`).

## Troubleshooting

If no values seem to be shared between devices, perform the following checks:
<ul>
<li>Enter the command SetOption85 on all devices in the group and make sure the result is ON on all devices.
<li>Enter the command DevGroupName on all devices in the group and make sure the result for device group 1 is the exact same (case-sensitive) name on all devices.
<li>Enter the command DevGroupShare -1,-1 on all devices in the group to enable sharing of all items.
<li>Enter the command DevGroupSend 128=1 on one device in the group. If the power turns on on the other devices, the device groups feature is working.
<li>Enter the command DevGroupStatus on all devices in the group. If you do not see all the other devices in the group listed as members, multicast packets are not being received by the devices. Check the network infrastructure that connects the devices together to make sure multicasts are enabled are not being filtered.
</ul>

## Commands

Command|Parameters
:---|:---
DevGroupName<x\><a class="cmnd" id="devgroupname"></a>|`0` = clear device group <x\> name and restart<br>`<value>` = set device group <x\> name and restart.<br>Prior to 8.2.0.3, `GroupTopic` was used to specify the device group name.
DevGroupSend<x\><a class="cmnd" id="devgroupsend"></a>|`<item> = <value>[ ...]` = send an update to device group <x\>. The device group name must have been previously set with DevGroupName<x\>. Multiple item/value pairs can be specified separated by a space. Spaces in `<value>` must be escaped with a backslash (\\). The message sent is also processed on the local device as if it had been received from the network.<br><br>For items with numeric values, `<value>` can be specified as @<operator\>[<operand\>] to send a value after performing an operation on the current value. <operator\> can be + (add), - (subtract) or ^ (invert). If <operand\> is not specified, it defaults to 0xffffffff for the invert operator and 1 for other operators.<br><br>Examples:<br>`DevGroupSend 4=90 128=1` - send an update to set the light brightness to 90 and turn relay 1 on.<br>`DevGroupSend 193=Buzzer\\ 2,3` - send the Buzzer 2,3 command.<br>`DevGroupSend 6=@+ 4=@-10` - set the next fixed color and decrease the brightness by 10.<br>`DevGroupSend 128=^` - toggle all the relays.<br><br>`2` = Light fade (0 = Off, 1 = On)<br>`3` = Light speed (1..40)<br>`4` = Light brightness (0..255)<br>`5` = Light [`Scheme`](Commands.md#scheme)<br>`6` = Light fixed color (0 = white (using CT channels), other values according to [`Color`](Commands.md#color)</a>)<br>`7` = PWM dimmer low preset (0..255)<br>`8` = PWM dimmer high preset (0..255)<br>`9` = PWM dimmer power-on brightness (0..255)<br>`128` = Relay Power - bitmask with bits set for relays to be powered on. The number of relays can be specified in bits 24 - 31. If the number of relays is not specified, only relay 1 is set<br>`192` = Event - event name and arguments<br>`193` = Command - command and arguments<br>`224` = Light channels - comma separated list of brightness levels (0..255) for channels 1 - 5 (e.g. 255,128,0,0,0  will turn the red channel on at 100% and the green channel on at 50% on an RBG light)
DevGroupShare<a class="cmnd" id="devgroupshare"></a>|`<in>,<out>` = set incoming and outgoing shared items _(default = `0xffffffff,0xffffffff`)_<BR> <in\> and <out\> are bit masks where each mask is the sum of the values for the categories (listed below) to be shared. For example, to receive only power (1), light brightness (2) and light color (16) and send only power (1), enter the command DevGroupShare 19,1.<br><br>`1` = Power<br>`2` = Light brightness<br>`4` = Light fade/speed<br>`8` = Light scheme<br>`16` = Light color<br>`32` = Dimmer settings (presets)<br>`64` = Event
DevGroupStatus<x\><a class="cmnd" id="devgroupstatus"></a>|Show the status of device group <x\> including a list of the currently known members.
