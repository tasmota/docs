# WifiPower Command

[`WifiPower`](Commands.md#wifipower) allows you to fine tune the Wi-Fi transmission power level. The default is 17dBm which should be enough power for the device to transmit to the Wi-Fi access point (AP) in a normal network environment use case. Changing this setting will impact the Wi-Fi range of the device. The general rule of thumb is for every 3dBm change up or down will double or halve the range, respectively. However, this is largely dependent on the Wi-Fi router's capabilities.

Use the RSSI signal level reported _**by the router**_ for a particular Tasmota device to adjust the power level of a device. Lower the value incrementally until you achieve a balance between connection stability and energy saving. In some cases a device may require slightly more power to maintain a stable connection to the Wi-Fi network. In this case, increment the value in 1 dBm increments until stable connectivity is observed. :warning: **Do not exceed 17dBm!** :warning: Exceeding the default 17dBm transmit power setting may cause unreliable device operation. Most devices have been designed with the 17dBm theoretical power setting and may not have the ability to dissipate the additional heat generated. Setting the transmit power too high may cause interference in the device antenna causing Wi-Fi reception problems.

This setting will _**not**_ affect the signal level received from the AP (i.e., the RSSI reading that Tasmota reports).

Improper setting of this parameter may cause operational instability and can generate exceptions. Increasing `WifiPower` puts additional demand on the device electrical power supply. Exceeding the capabilities of the power supply can cause other erratic device behaviors. Of course, the opposite may be the case when reducing transmit power levels allowing a device with a borderline power regulator to operate reliably.

You should perform substantial testing and monitoring to find the sweet spot for `WifiPower`.