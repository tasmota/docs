Tasmota's web user interface is a practical way to control and manage your tasmotised device. 

To access it use your device's IP address in your favorite web browser.

#### Configuration
Configuration menu allows you to configure everything from components to Wi-Fi and gives you the option to backup and restore the configuration in a secure location.

#### Information
Displays a single page loaded with information about the device including: current Tasmota version, Wi-Fi AP data, MQTT host data and more

#### Firmware Upgrade
An easy to use menu to initiate a firmware [upgrade](Upgrading) from an uploaded .bin or an OTA server.

#### Console
Terminal access to Tasmota. Issue [commands](Commands) here or follow the information stream. Useful for debugging when using [˙Weblog 4`](Commands#weblog).

## Themes
WebUI is themable starting with »6.6.0 using [`WebColor`](Commands#webcolor) commands. 

To apply the theme copy the entire code block and send it in console or via MQTT. 

#### Dark (default theme)
<img src="https://user-images.githubusercontent.com/5904370/68332933-e6e5a600-00d7-11ea-885d-50395f7239a1.png" style="width:100px;float:right"> 

```console
WebColor {"WebColor":["#eaeaea","#252525","#4f4f4f","#000000","#dddddd","#65c115","#1f1f1f","#ff5661","#008000","#faffff","#1fa3ec","#0e70a4","#d43535","#931f1f","#47c266","#5aaf6f","#faffff","#999999","#eaeaea"]}
```
<br>

#### Light (default until 6.7.1.)
<img src="https://user-images.githubusercontent.com/5904370/68239911-2c3ca180-000c-11ea-9b09-690138fed7a2.png" style="width:100px;float:right">

```console
WebColor {"WebColor":["#000000","#ffffff","#f2f2f2","#000000","#ffffff","#000000","#ffffff","#ff0000","#008000","#ffffff","#1fa3ec","#0e70a4","#d43535","#931f1f","#47c266","#5aaf6f","#ffffff","#999999","#000000"]}
```
<br>

#### Halloween
<img src="https://user-images.githubusercontent.com/5904370/68239855-0b744c00-000c-11ea-9384-4b03b6c1a8f4.png" style="width:100px;float:right">

```console
WebColor {"WebColor":["#cccccc","#2f3133","#3d3f41","#dddddd","#293134","#ffb000","#293134","#ff5661","#008000","#ffffff","#ec7600","#bf5f00","#d43535","#931f1f","#47c266","#5aaf6f","#ffffff","#999999","#bc4d90"]}
```
<br>

#### Navy 
<img src="https://user-images.githubusercontent.com/5904370/68239803-f5ff2200-000b-11ea-8ac2-203e9631440e.png" style="width:100px;float:right">

```console
WebColor {"WebColor":["#e0e0c0","#000033","#4f4f4f","#000000","#dddddd","#a7f432","#1e1e1e","#ff0000","#008000","#ffffff","#1fa3ec","#0e70a4","#d43535","#931f1f","#47c266","#5aaf6f","#ffffff","#999999","#eedd77"]}
```

<br>

#### Purple Rain 
<img src="https://user-images.githubusercontent.com/5904370/68995595-af24ee00-088f-11ea-8dd4-3588d188823c.png" style="width:100px;float:right">

```console
WebColor {"WebColor":["#eaeaea","#252525","#282531","#eaeaea","#282531","#d7ccff","#1d1b26","#ff5661","#008000","#faffff","#694fa8","#4d3e7f","#b73d5d","#822c43","#1f917c","#156353","#faffff","#716b7f","#eaeaea"]}
```

> [!TIP] When using an MQTT client such as `mosquitto_pub`, enclose the message payload in single quotes (`'`)
```
mosquitto_pub -h 192.168.1.20 -t "cmnd/myTopic/WebColor" -m '{"WebColor":["#eaeaea","#252525","#4f4f4f","#000000","#dddddd","#65c115","#1f1f1f","#ff5661","#008000","#faffff","#1fa3ec","#0e70a4","#d43535","#931f1f","#47c266","#5aaf6f","#faffff","#999999","#eaeaea"]}'
```
