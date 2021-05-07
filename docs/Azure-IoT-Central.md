!!! failure "This feature is not included in precompiled binaries, To use it you must compile your build.

Add the following to `user_config_override.h`:

```
#ifndef USE_MQTT_TLS
#define USE_MQTT_TLS
#endif
#define USE_MQTT_AZURE_IOT
#define USE_MQTT_AZURE_DPS_SCOPEID        "YOURSCOPEIDHERE"
#define USE_MQTT_AZURE_DPS_PRESHAREDKEY   "YOURPRESHAREDKEYHERE=="
```

As of Tasmota version 9.2.4, Tasmota now supports TLS 1.2 connections to [Azure IoT Hub](http://aka.ms/iothub) and [IoT Central](http://aka.ms/iotcentral) using time bound token authentication based on a unique key.  IoT Central includes [Azure Device Provisioning Service](https://docs.microsoft.com/en-us/azure/iot-dps/) which is used for simplified deployment at scale.

## Benefits

Azure IoT Central supports supports bi-directional communication between the could and both IoT Devices and/or Intelligent Edge devices base on [Azure IoT Edge](http://aka.ms/iotedge) and is delivered as a Software as a Service (SaaS).  In addition to telemtary and communication, IoT Central if a full solution for quickly managing and deploying IoT solutions at scale.

### Authentication

This version of Tasmota leverages the Preshared Key authentication, which will create a time bound (one hour by default) SHA256 signature based on a unique key.  Only this signed text is sent across the network over a TLS 1.2 channel ensuring mutual authentication.  Because of this time bound nature, Tasmota must (by default) be configured to synchronize time with public Network Time Protocol Servers.  Developer level information provided here [discussed here](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-security#security-tokens).

## Cost

Azure IoT Central provides a [free tier](http://aka.ms/iotcentral) that allows for 2 devices at no charge.

## Get Started

### 0. Create an IoT Central Application

Follow the steps here to create an IoT Central Application: https://docs.microsoft.com/en-us/azure/iot-central/core/quick-deploy-iot-central

### 1. Get the ID Scope

Select Administration --> Device Connection to note the ID Scope as shown below:

![image](https://user-images.githubusercontent.com/15837044/117377350-ae738380-ae98-11eb-8d40-0a72f946a3be.png)

### 2. Create a Enrollment Group

Click `Create enrollment group`, name the group, and select the Attestation type as `Shared access signature (SAS)`.  Click Save to and copy the Primary Key, as shown below:

![image](https://user-images.githubusercontent.com/15837044/117377523-11fdb100-ae99-11eb-9a59-8da8b5d4e2ce.png)

### 3. Compile your binary including support for Azure IoT Device Provisioning Service (and IoT Central)

Following the directions here: https://tasmota.github.io/docs/Compile-your-build/ compile your binary adding the following settings to your [my_user_config.h](https://github.com/arendst/Tasmota/blob/development/tasmota/my_user_config.h) adding your Scope Id and your Primary Key.

!!! tip 
  Don't foget your WiFi for complete automation.

```
#ifndef USE_MQTT_TLS
#define USE_MQTT_TLS
#endif
#define USE_MQTT_AZURE_IOT
#define USE_MQTT_AZURE_DPS_SCOPEID        "0ne002AEBBA"
#define USE_MQTT_AZURE_DPS_PRESHAREDKEY   "iQ9Qtjfux9wWW0guHi/ChRGQX//LLkZEnyUNIaLD8+imAsKvpZwYYT8M0kFPVxt3KjtRF00KpNi5/ejBt+1YLA=="
```

### 4. Flash your device and configure for WiFi

!!! tip 
  If you configured the WiFi in the config file, no WiFi configuration needed.

Flash your device as [discussed here](https://tasmota.github.io/docs/Getting-Started/#flashing) and then configure the WiFi as [discussed here](https://tasmota.github.io/docs/Getting-Started/#using-web-ui).

### 5. Verify your automatic (DPS) configuration

In the Console of Tasmota, you will see it was registered with Device Provisioning Service (which created the IoT Hub device) and authenticated with a token, connected and it will start sending state:

![image](https://user-images.githubusercontent.com/15837044/117375783-59823e00-ae95-11eb-8045-6e7ff369192e.png)

If you look at the properties, you will see it automatically definded the Host name, port, TLS and MQTT Client (device Id) -- which defaulted to the MAC address:

![image](https://user-images.githubusercontent.com/15837044/117377776-a831d700-ae99-11eb-8ef7-e30dd725f4b3.png)

In the IoT Central Application, you can see the telemtry data:

![image](https://user-images.githubusercontent.com/15837044/117377864-d8797580-ae99-11eb-8c1c-805a80ac9b15.png)
