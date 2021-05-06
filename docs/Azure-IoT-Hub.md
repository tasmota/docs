!!! failure "This feature is not included in precompiled binaries, To use it you must compile your build.

Add the following to `user_config_override.h`:

```
#ifndef USE_MQTT_TLS
#define USE_MQTT_TLS
#endif
#define USE_MQTT_AZURE_IOT
```

As of Tasmota version 9.2.4, Tasmota now supports TLS 1.2 connections to [Azure IoT Hub](http://aka.ms/iothub) using time bound token authentication based on a unique key.  Tasmota can be used with or without [Azure Device Provisioning Service](https://docs.microsoft.com/en-us/azure/iot-dps/) which is used for simplified deployment at scale.

## Benefits

Azure IoT Hub supports bi-directional communication between the could and both IoT Devices and/or Intelligent Edge devices base on [Azure IoT Edge](http://aka.ms/iotedge).  Azure IoT Hub supports REST, AMQP and the MQTT 3.1.1 protocol as [discussed here](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-mqtt-support).  IoT Hub supports Trusted Platform Module (when used with Device Provisioning Service), x509 Certificates and Preshared Keys authentication [discussed here](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-security).

### Authentication

This version of Tasmota leverages the Preshared Key authentication, which will create a time bound (one hour by default) SHA256 signature based on a unique key.  Only this signed text is sent across the network over a TLS 1.2 channel ensuring mutual authentication.  Because of this time bound nature, Tasmota must (by default) be configured to synchronize time with public Network Time Protocol Servers.  Developer level information provided here [discussed here](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-security#security-tokens).

## Cost

Azure IoT Hub provides a [free tier](https://azure.microsoft.com/en-us/pricing/details/iot-hub/) that allows for up to 8,000 message a day.

### IoT Central

In additon to Azure IoT Hub which is a Platform as a Service (PaaS), Tasmota also works with [IoT Central](http://aka.ms/iotcentral) which is a more complete Software as a Service (SaaS).

## How to configure (without Device Provisioning Service)

### 0. Open an Azure Subscription

If you don't already have a subscription (one is included with most MSDN subscriptions), you can get started here: https://azure.microsoft.com/account/free

### 1. Create an Azure IoT Hub and a Device

The following steps will walk you through creating an IoT Hub and your first device using a web browser: https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-create-through-portal

You will need 3 pieces of information from this step:

Information| Your Setting | <i>Example Value</i>
----|-----|----
IoT Hub Full Name|  | <i>myiothub.azure-devices.net</i>
Device Id|  | <i>myfirstTasmotaDevice</i>
Primary Key|  | <i>i2B6TVRnpWGS5i5aZaRddaGTc+tIte1gg4PUkh0t+30=</i>

### 2. Compile your binary including support for Azure IoT

Following the directions here: https://tasmota.github.io/docs/Compile-your-build/ compile your binary adding the following settings to your [my_user_config.h](https://github.com/arendst/Tasmota/blob/development/tasmota/my_user_config.h).
```
#ifndef USE_MQTT_TLS
#define USE_MQTT_TLS
#endif
#define USE_MQTT_AZURE_IOT
```

### 3. Flash your device and configure for WiFi

Flash your device as [discussed here](https://tasmota.github.io/docs/Getting-Started/#flashing) and then configure the WiFi as [discussed here](https://tasmota.github.io/docs/Getting-Started/#using-web-ui).

### 4. Configure your device for you Azure IoT Hub

In the web portal, click the configuration button and then the configure MQTT button.

Following the diagram below, type in the Host (IoT Hub Full Name), TLS Port of 8883, select MQTT TLS, type in the Client and User name (your Device Id) and the Password (your Primary Key) and click Save.  Your device will reboot and connect.

![image](https://user-images.githubusercontent.com/15837044/117373396-c0e9bf00-ae90-11eb-8e45-81d9480e611c.png)

### 5. Verify your connection

In the Console of Tasmota, you will see it was authenticated with a token, connected and it will start sending state:

![image](https://user-images.githubusercontent.com/15837044/117373656-479e9c00-ae91-11eb-82b5-80ca096e1220.png)

Using a tool like the [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer/releases/), you can see the message in the cloud:

![image](https://user-images.githubusercontent.com/15837044/117373712-669d2e00-ae91-11eb-9bcd-86f2f457d5dc.png)

### 6. Send a message to your Tasmota

Using a tool like the [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer/releases/), select Cloud-to-device message set a property of Topic to ```/power```, add ```toggle``` to the message body and click Send message to device.

![image](https://user-images.githubusercontent.com/15837044/117373865-afed7d80-ae91-11eb-8824-25a690f97c59.png)

## How to configure (with Device Provisioning Service)

Device Provisioning Services (DPS) allows for automatic deployment at scale.  Simular to Tasmota authenticating to IoT Hub without DPS, authenticating to DPS uses a time bound SHA256 signature to authenticate over TLS 1.2.

For this setup, we configure the following settings when building our binary.  For full automation, you will want to add ```STA_SSID1``` and ```STA_PASS1``` to your `user_config_override.h`.

Add the following to `user_config_override.h`:

```
#ifndef USE_MQTT_TLS
#define USE_MQTT_TLS
#endif
#define USE_MQTT_AZURE_IOT
#define USE_MQTT_AZURE_DPS_SCOPEID        "YOURSCOPEIDHERE"
#define USE_MQTT_AZURE_DPS_PRESHAREDKEY   "YOURPRESHAREDKEYHERE=="
```

### 0. Open an Azure Subscription

If you don't already have a subscription (one is included with most MSDN subscriptions), you can get started here: https://azure.microsoft.com/account/free

### 1. Create a Device Provisioning Service, IoT Hub and link them together

Following: https://docs.microsoft.com/en-us/azure/iot-dps/tutorial-set-up-cloud create your DPS and IoT Hub.  Note your Scope Id for later use as shown below:

![image](https://user-images.githubusercontent.com/15837044/117375578-e5479a80-ae94-11eb-87b5-71ff977b95e4.png)

### 2. Create a Group Enrollment with a Symetrical Key

In your Device Provisiniong Service, click `Manage enrollments` and then click `Add enrollment group`.

As shown below, name your group, select Symmetric Key, select your linked IoT Hub and then click Save.

![image](https://user-images.githubusercontent.com/15837044/117375387-7d914f80-ae94-11eb-84b0-e795c844a1fb.png)

Once created you can select the enrollment group to retrieve the Primary Key, as shown below:

![image](https://user-images.githubusercontent.com/15837044/117375492-b4fffc00-ae94-11eb-9658-af29508e45bf.png)

### 3. Compile your binary including support for Azure IoT Device Provisioning Service

Following the directions here: https://tasmota.github.io/docs/Compile-your-build/ compile your binary adding the following settings to your [my_user_config.h](https://github.com/arendst/Tasmota/blob/development/tasmota/my_user_config.h) adding your Scope Id and your Primary Key.

!!! tip 
  Don't foget your WiFi for complete automation.

```
#ifndef USE_MQTT_TLS
#define USE_MQTT_TLS
#endif
#define USE_MQTT_AZURE_IOT
#define USE_MQTT_AZURE_DPS_SCOPEID        "0ne00223A39"
#define USE_MQTT_AZURE_DPS_PRESHAREDKEY   "mVVdX8MPUFUoYaG7Wq6HyMcsz0kZNfwVwiafChvFDxrs0s8pa5gVV6myMbqOBCqGraVFZFupD3RiIgx0B4ZACA=="
```

### 4. Flash your device and configure for WiFi

!!! tip 
  If you configured the WiFi in the config file, no WiFi configuration needed.

Flash your device as [discussed here](https://tasmota.github.io/docs/Getting-Started/#flashing) and then configure the WiFi as [discussed here](https://tasmota.github.io/docs/Getting-Started/#using-web-ui).

### 5. Verify your automatic (DPS) configuration

In the Console of Tasmota, you will see it was registered with Device Provisioning Service (which created the IoT Hub device) and authenticated with a token, connected and it will start sending state:

![image](https://user-images.githubusercontent.com/15837044/117375783-59823e00-ae95-11eb-8045-6e7ff369192e.png)

If you look at the properties, you will see it automatically definded the Host name, port, TLS and MQTT Client (device Id) -- which defaulted to the MAC address:

![image](https://user-images.githubusercontent.com/15837044/117376026-e88f5600-ae95-11eb-8b2f-197d0f4d1511.png)

Using a tool like the [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer/releases/), you can see the message in the cloud:

![image](https://user-images.githubusercontent.com/15837044/117373712-669d2e00-ae91-11eb-9bcd-86f2f457d5dc.png)

### 6. Send a message to your Tasmota

Using a tool like the [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer/releases/), select Cloud-to-device message set a property of Topic to ```/power```, add ```toggle``` to the message body and click Send message to device.

![image](https://user-images.githubusercontent.com/15837044/117373865-afed7d80-ae91-11eb-8824-25a690f97c59.png)


