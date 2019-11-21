![](https://image.ibb.co/jyhUhU/5b2a4ed0a7c897823481c2e2_Header_Blog.jpg)

Alexa is a virtual assistant developed by Amazon. It's capable of recognizing voice commands so you can interact with Alexa through its Echo devices and have access to their powerful actions. 

# How can I connect Tasmota devices to Alexa

To control a Tasmota device with Alexa, enable emulation (Configure Other on the Tasmotat web UI).

![](https://user-images.githubusercontent.com/24528715/51428829-9369a080-1c08-11e9-8523-81f729aa2ea7.png)

Use `Belkin WeMo` for devices with a single relay or `Hue Bridge` for devices with one or more relays or for lights. Tasmota devices will be discovered by the Alexa app.

For control of lights, color control (introduced in version 6.5.0.9), on/off, and dimming is supported. Enable `Hue Bridge` emulation in Tasmota and perform a device discovery in the Alexa app. No skill needs to be added to Alexa. Select Hue Bridge V1 as the device type.

Relays and lights with friendly names beginning with a dollar sign (`$`) will cause Tasmota to not "announce" them (i.e., be hidden) to Alexa. If they were previously discovered, they will still continue to work. As there are only four friendly names provided in Tasmota, if `FriendlyName4` begins with `$`, component 4 and all higher numbered discoverable components will not be discovered by Alexa.  

**Note: Alexa Hue integration requires a physical Alexa device. The app alone is not enough.**  

**Note: Hue Bridge emulation does not support sensors.**  