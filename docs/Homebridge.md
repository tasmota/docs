[Homebridge](https://github.com/nfarina/homebridge) is a NodeJS server which emulates the iOS HomeKit API to enable support for non-native devices (like Sonoff and Magichome devices).

Tasmota compatible plugins have been developed by [macwyznawca](https://www.npmjs.com/~macwyznawca) and [arachnetech](https://www.npmjs.com/~arachnetech) as well as others to add support for these devices in Apple's Home app and through iCloud for automation (iPad, HomePod/Apple TV 4 or newer required).
_Note these plugins are not necessarily specific to Sonoff devices._

The [`homebridge-mqttthing`](https://www.npmjs.com/package/homebridge-mqttthing) package has support for many types of devices and is quite flexible with different options especially for RGB/RGBW LED strips.

As of 1.0.11 [`homebridge-mqttthing`](https://www.npmjs.com/package/homebridge-mqttthing) supports the following Homekit device types:
*  Light bulb
*  Switch
*  Outlet
*  Motion Sensor
*  Occupancy Sensor
*  Light Sensor
*  Contact Sensor
*  Doorbell
*  Security System
*  Smoke Sensor
*  Temperature Sensor
*  Humidity Sensor
*  Stateless Programmable Switch
*  Garage Door
*  Garage Door Opener

Check out [macwyznawca's packages](https://www.npmjs.com/~macwyznawca) for supported functions, each in a separate package.

To use Homebridge with Tasmota you need to have an existing MQTT broker set up ([see wiki article](MQTT)) and each of your Sonoff devices should have a unique topic set.

Example screenshot from Apple Home.app

![Home iOS app HomeKit example](http://macwyznawca.pl/homekitsonoff.PNG)
