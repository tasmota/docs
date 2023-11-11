## Hubitat
[Hubitat](https://hubitat.com/) is a SmartHome platform combining advanced functionality with an easier to approach interface. Designed to be highly reliable and without requiring an internet connection Gary  has built an integration without any custom code, and able to integrate directly with Hubitat.

The integration is best discussed on [this forum thread](https://community.hubitat.com/t/release-tasmota-sync-native-and-real-time-synchronization-between-hubitat-and-tasmota-11-or-later/93651) and support can be found there too. For a direct link to the project on Github you can find it at [Hubitat-Tasmota](https://github.com/GaryMilne/Hubitat-Tasmota)

There are 12 unique drivers that perform realtime native synchronisation between Tasmota 11 or greater and Hubitat. No special compilation of Tasmota or webhooks required. Drivers use Tasmota triggers and rules to notify Hubitat using a JSON like sync whenever a monitored parameter changes such as power, color, dimmer, watts etc.<br/>
1) Color Bulb
2) Switch with Dimmer
3) Switch with Fan
3) Fan with Dimmer
4) Single Relay\Switch\Plug with optional power monitoring
5) Dual Relay\Switch\Plug with optional power monitoring
6) Triple Relay\Switch\Plug (No power monitoring)
7) Quad Relay\Switch\Plug (No power monitoring)
8) Eight Relay\Switch (No power monitoring)
9) Universal Multi Sensor
10) Universal Multi Sensor Single Relay
11) Universal Multi Sensor Double Relay

## Installation
Whilst full installation instructions are on the above forum/github links, installation is very easy involving a few simple steps:
1) Install 'Tasmota Sync' using [Hubitat Package Manager](https://hubitatpackagemanager.hubitatcommunity.com/)
2) Create a device and add the MAC address (or IP address) as the device ID
3) Press 'Save Device' and then 'tasmotaInjectRule' and it should be working!
