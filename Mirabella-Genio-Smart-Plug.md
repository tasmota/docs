# Mirabella Genio Smart Plug 
This is a simple smart plug with the addition of a USB port, as far as I can see the USB port  is 'always on' and is not access this from the ESP module.
Opening up the device was easy, 2 screws then a small amount of gentle prying exposed the components, 2 more screws had it fully deconstructed.

The ESP module is mounted on a pcb with all of the required pins exposed.
 
![Photo of plug](https://i.ibb.co/FDk2TMz/genio-plug-connections-SM.jpg)
![ESP8266 PINOUT](https://i.ibb.co/YRQstXr/ESP-PIN-OUT.png)

I was able to flash by connecting GPIO0 to GND while connecting my Serial Adaptor and flashing as per any other ESP device 
Use the string below from the console of the device to configure everything (replace required data with your own SSID, Password, MQTT Settings etc.):

`Backlog SSID1 YOUR_SSID_NAME; Password1 YOUR_WIFI_PASSWORD; MqttHost MQTT_INTERNAL_IP_ADDRESS; MqttUser MQTT_USER_NAME; MqttPassword MQTT_PASSWORD; GPIO2 56; GPIO12 21; GPIO13 17;topic genio1; FriendlyName Genio1` 

[my prefered flashing method](https://www.youtube.com/watch?v=UDnNI5wkNNY)
Once flashed, the config should look like: 

![config settings](https://i.ibb.co/khNDTvV/settings.png)
