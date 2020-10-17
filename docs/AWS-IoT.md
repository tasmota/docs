!!! tip New simplified configuration, since AWS IoT does no more require private certificates, and can use password authentication. Requires v8.5.0.1 or higher. The certificate based authentication is kept for reference.


!!! tip "New simplified and automated configuration"
    We now provide easy to use AWS CloudFormation templates to generate the private key and sign the certificate. The manual method is now in Appendix

!!! failure "This feature is not included in precompiled binaries"
    To use it you must [compile your build](Compile-your-build). 

Add the following to `user_config_override.h`:

```
#ifndef USE_MQTT_TLS
#define USE_MQTT_TLS
#define USE_MQTT_TLS_CA_CERT // Optional but highly recommended
#endif
#ifndef USE_MQTT_AWS_IOT_LIGHT
#define USE_MQTT_AWS_IOT_LIGHT
#endif
#ifdef USE_DISCOVERY
#undef USE_DISCOVERY
#endif
```

As of Tasmota version 8.5.0.1, device-specific private key and certificate are no more required. We introduces AWS_IOT_LIGHT to use password based authentication. Legacy private certificate authentication can be found [here](AWS-IoT-cert).

## Benefits

AWS IoT provides secure, bi-directional communication between Internet-connected devices such as sensors, actuators, embedded micro-controllers. This basically allows to communicate in both direction from the cloud using MQTT over secure channels using TLS.

#### 1. More Alexa controls

It's actually easy to develop smarthome Alexa skills, so that you can control your whole house. Currently you can only use the local Philips Hue/Wemo emulation - limited to lights and switches. You can imagine for instance controlling your Sonoff RF Bridge and send IR codes to your TV.

Alexa skills need to communicate back to your devices, which is easy using MQTT and AWS IoT

#### 2. No need for a local gateway

Of course you can do it with a local gateway like Raspberry PI using many of the open-source solutions (Domoticz...).

You can also do it entirely from the cloud without the hassle of managing and updating a local gateway.

On top of it, AWS IoT provides tools to collect and archive your data, automate (AWS IoT things).

#### Maximum security

Keep in mind that AWS IoT is based with 'security first' in mind. All the data in AWS IoT is your data and is not shared with anyone else.

Communication is done over TLS 1.2 tunnels. Thanks to the switch of Arduino to BearSSL and aggressive optimization, the amount of memory needed is as low as 6.0k during normal operation, and an additional 6.6k during connection (TLS handshake). This makes it totally doable with standard 'Tasmota' firmware with Web and Hue emulation activated. You should see more than 20k of memory still available.

## Caveats

During TLS handshake, a secondary stack of 4.8k is allocated on the heap to allow BearSSL to have enough stack room. Memory is freed at the end of the handshake. Allocating such big chunks of memory can cause issues when heap fragmentation gets too high. If you see memory going below 15KB, you may experience crashes.

#### Cost

AWS provides a [Free Tier](https://aws.amazon.com/free/) that allows you to use some services for free up to a specific level. For example, it allows you to have 50 devices connecting 24 hours a day exchanging 300 messages per day. For a typical house, there is a good chance the service costs you nothing (the first year).

## How to configure?

AWS IoT now works with Password authentication. Although it is not a good practice to use the same password for all your devices, it is technically working and the easiest way to start with Tasmota and AWS IoT.

Here is a simple guide.

### 0. Open an AWS Account

If you don't have already one, just follow the guide: https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/

### 1. Prerequisites

You will need to install/compile the following:

 * Complete environment to compile Tasmota, ex: PlatformIO (PlatformIO)

### 2. Enable AWS IoT in Tasmota

Using your favorite IDE, create `user_config_override.h` and add the required compilation directives as documented at the top of this article.  

Note: TLS handshake takes ~1.2s on ESP8266 @80MHz. You may choose to switch to 160MHz if the power supply of your device supports it. If you do so, handshake time should be ~0.7s.

Compile the firmware and ensure it completes successfully.

> This step is only to check compilation goes well. Your firmware is still not usable since it does not contain the Private Key + Certificate.

### 3. Flash your device

Flash your device the normal way; either through serial or OTA. If you use OTA, first flash a `sonoff-minimal` firmware, then your target firmware.

### 4. Configure AWS IoT Policy (to be done once) 

Open the AWS Console and select the target region. In the example below we will use **(EU) Frankfurt** (eu-central-1).

**Under construction**

Download the CloudFormation template [TasmotaAuth](https://tasmota.github.io/docs/_media/aws_iot/TasmotaAuth.yaml "TasmotaAuth CloudFormation template") and use it in AWS CloudFormation.


Or click on the link for the region you have chosen:  

Region| Code | Launch
------|------|-------
US East (N. Virginia) | <span style="font-family:'Courier';">us-east-1</span> | [![Launch TasmotaAuth in us-east-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=TasmotaAuth&templateURL=https://tasmota-eu-central-1.s3.eu-central-1.amazonaws.com/TasmotaAuth.yaml)
EU (Frankfurt) | <span style="font-family:'Courier';">eu-central-1</span> | [![Launch TasmotaAuth in eu-west-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks/new?stackName=TasmotaAuth&templateURL=https://tasmota-eu-central-1.s3.eu-central-1.amazonaws.com/TasmotaAuth.yaml)
EU (Paris) | <span style="font-family:'Courier';">eu-west-3</span> | [![Launch TasmotaAuth in eu-west-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-3#/stacks/new?stackName=TasmotaAuth&templateURL=https://tasmota-eu-central-1.s3.eu-central-1.amazonaws.com/TasmotaAuth.yaml)

1. At the **Create Stack** screen, click **Next**.
   ![MqttAuth01](https://user-images.githubusercontent.com/49731213/96349739-e4dee200-10b1-11eb-94df-b0e006c3f010.png)

2. At the **Specify stack details** screen, keep all default parameters and click **Next**.
   ![MqttAuth02](https://user-images.githubusercontent.com/49731213/96349765-0fc93600-10b2-11eb-80b1-d97ac69012bc.png)

3. At the **Configure stack options** screen, keep all default parameters and click **Next**.
   ![MqttAuth03](https://user-images.githubusercontent.com/49731213/96349818-51f27780-10b2-11eb-90c5-4327e822789e.png)

4. At the **Review TasmotaMqttPolicy** screen, scroll down and click **Create Stack**.
   ![MqttAuth04](https://user-images.githubusercontent.com/49731213/96349826-62a2ed80-10b2-11eb-8702-591a363d231b.png)

5. The stack usually takes less than 1 minute to complete. Wait for it to reach `CREATE_COMPLETE` state.
   <img width="50%" src="https://user-images.githubusercontent.com/49731213/96349843-7ea68f00-10b2-11eb-8fe0-5c1da253e384.png">

6. Copy the commands under `BackLogComman`, you will need it to configure Tasmota devices.
   <img width="70%" src="https://user-images.githubusercontent.com/49731213/96350152-8d8e4100-10b4-11eb-997b-748e3f44563f.png">

7. If you have left the parameter `RetentionPolicy` to `Retain`, then you can delete this CloudFormation stack (it will not delete the Policy). Click on the **Delete** button.
   ![MqttAuth07](https://user-images.githubusercontent.com/49731213/96349854-9120c880-10b2-11eb-9919-25386d19ec13.png)

8. After less than 2 minutes, the stack should have reached the state `DELETE_COMPLETE`
   <img width="70%" src="https://user-images.githubusercontent.com/49731213/96349863-a138a800-10b2-11eb-9406-b254699102c5.png">

### 6. Configure Tasmota device

This is the last step, you need to configure the MQTT parameters. The easiest way is through the web console. We will only cut and paste parameters from the **Outputs** tab of the CloudFormation console.


#### Connect to AWS IoT

Once the `MQTTHost` and `MQTTPort` are configured, Tasmota will try to connect to AWS IoT. 

> Keep in mind that AWS IoT does not support 'retained' messages. Whatever the 'retained' configuration in Tasmota, messages are always published as 'retained=false'.

Here is an example of output you should see:

```
00:00:04 HTP: Web server active on sonoff-4585 with IP address 192.168.1.59
00:00:04 UPP: Multicast (re)joined
21:28:25 MQT: Attempting connection...
21:28:25 MQT: AWS IoT endpoint: xxxxxxxxxxxxx-ats.iot.eu-central-1.amazonaws.com
21:28:26 MQT: AWS IoT connected in 1279 ms
21:28:26 MQT: Connected
21:28:26 MQT: tele/tasmota/LWT = Online
21:28:26 MQT: cmnd/tasmota/POWER =
21:28:26 MQT: tele/tasmota/INFO1 = {"Module":"Sonoff Basic","Version":"6.5.0.14(sonoff)","FallbackTopic":
"cmnd/DVES_67B1E9_fb/","GroupTopic":"sonoffs"}
```

### 7. Check end-to-end communication

In the AWS IoT console, click on "**Test**" in the left panel.

In the "**Subscription topic**" field, type `+/sonoff/#` then click on "**Subscribe to topic**". This will display all MQTT messages received. Type a command in the Web Tasmota console, you should see MQTT message flow.

Enjoy!

### 8. Cleaning

**Cleaning**: to avoid having CloudFormation templates piling up in your console, you can delete them. The created resources will remain, if you have left the parameter `RetentionPolicy` to `Retain`.

### 9. Troubleshooting

`TLSError` shows any error at the TLS level. See [here](TLS#tls-troubleshooting) for most common error codes.


### For implementation details, see [here](TLS)
