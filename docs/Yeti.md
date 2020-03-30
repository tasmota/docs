[Yeti](https://getyeti.co) is a smart home mobile app (available for [Android](https://play.google.com/store/apps/details?id=com.netbeast.yeti) & [iOS](https://itunes.apple.com/us/app/yeti-smart-home-automation/id1190638808)) that allows you to control your different brands from a single interface. 

It supports a wide range of devices and brands. From Smart Plugs and Lights to Thermostats and Speakers. Currently, it supports the following brands: 

- Philips Hue (Lights)
- LIFX (Lights)
- Wemo (Lights & Sockets)
- Sonos (Play1, Play3, Play5)
- Yeelight (Lights)
- Ecobee (Thermostats)
- Nest (Thermostats)
- Nuki (Locker)
- Netatmo (Thermostats & Cameras)

And from now on, in the newest version, it also supports devices with latest Tasmota version installed.

Check out this guide about [Controlling your Tasmota devices with Yeti](https://getyeti.co/posts/controlling-your-sonoff-tasmota-with-yeti)
# Yeti & Tasmota Integration

There is a guide where you can see step by step how to control your Tasmota devices using Yeti. In that guide, there is an example using Sonoff devices but it will work with almost any device which has the latest Tasmota version installed

[How to control Tasmota devices with Yeti](https://getyeti.co/posts/controlling-your-sonoff-tasmota-with-yeti)

## Requirements

- [Yeti for Android](https://play.google.com/store/apps/details?id=com.netbeast.yeti)
- [Yeti for iOS](https://itunes.apple.com/us/app/yeti-smart-home-automation/id1190638808)
- Tasmota version >= 5.12.0
- Having your Tasmota devices connected to the same Wifi network as your phone

## Connect your Tasmota devices to Yeti

Once you have your Tasmota devices connected to the same network as your phone and Yeti installed on it, open the app.

After opening the app and creating an account, Yeti will start scanning for your smart home devices in your network. If you have any other additional supported brand it'll also find it. 

<img src="https://image.ibb.co/ez79Sx/2i_Phone_7.jpg" width="50%" height="50%">

If Yeti can't find your Tasmota devices automatically in the first scan (This will happen if you don't have a Sonoff device) you can find it manually. 
Being in the home view, tap in the + button, then select the option configure brands and look for "Sonoff" and then select "Advanced Options". You'll be asked to introduce the Ip of your device manually. After that Yeti will scan for that device in your network

<img src="https://image.ibb.co/m9pZuc/iPhone_7.jpg" width="50%" height="50%">

Finally, you'll be able to control your Tasmota devices

<img src="https://image.ibb.co/jgOoLH/iPhone_7.jpg" width="50%" height="50%">

## Common Issues

### Yeti can't find my devices in the first Scan

If Yeti can't find your devices in the first scan it can be because Yeti is not able to find it automatically or you have your Sonoff Password-Protected.

To solve this issue, we've implemented an "Advanced Option" menu where you can introduce the Ip of your devices manually and also the user and password in case you have a sonoff password-protected.

1. In the home screen press the **+ button**. 
2. Then tap **Configure Brands**, look for Sonoff and the press **connect**
3. In that menu you will see some information and also an **Advanced Menu** text in the bottom. **Tap it**
4. Finally you'll be required to introduce the Ip and in case you have password set up, you can also introduce it. By default username is admin, in case you changed it, please add the new username

## Anything Else?

I highly recommend trying charms and routines features in Yeti

## What's coming

Right now, only switch control is available. In the next version, sensor information will be available for users to check them within Yeti and use it as a trigger for routines and charms.
