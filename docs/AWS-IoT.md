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
#ifndef USE_MQTT_AWS_IOT
#define USE_MQTT_AWS_IOT
#endif
#ifdef USE_DISCOVERY
#undef USE_DISCOVERY
#endif
```

As of Tasmota version 6.6.0.3, the device-specific credentials are no longer restricted to being set at compile time only. You can now use the same firmware for all your devices. AWS IoT credentials can be set through the Console at runtime and are stored in flash memory. Credentials will survive firmware updates and OTA. Credentials will not survive a full Flash reset `Reset 5` or `Reset 6` nor will it survive a System Parameter Flash reset `Reset 3`

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

Communication is done over TLS 1.2 tunnels, using client certificates to authenticate each device. Up to now it was challenging to enable TLS on ESP8266 because of the high memory requirements of TLS.

Thanks to the switch of Arduino to BearSSL and aggressive optimization, the amount of memory needed is as low as 6.0k during normal operation, and an additional 6.6k during connection (TLS handshake). This makes it totally doable with standard 'Tasmota' firmware with Web and Hue emulation activated. You should see more than 20k of memory still available.

## Caveats

AWS IoT requires each Tasmota device to have its own distinct Private Key and Certificate (~800 bytes). Although you could imagine to use the same Private Key in all your devices, this is considered as a very bad practice. You are warned!

During TLS handshake, a secondary stack of 5.3k is allocated on the heap to allow BearSSL to have enough stack room. Memory is freed at the end of the handshake. Allocating such big chunks of memory can cause issues when heap fragmentation gets too high. If you see memory going below 15KB, you may experience crashes.

#### Cost

AWS provides a [Free Tier](https://aws.amazon.com/free/) that allows you to use some services for free up to a specific level. For example, it allows you to have 50 devices connecting 24 hours a day exchanging 300 messages per day. For a typical house, there is a good chance the service costs you nothing (the first year).

## How to configure?

AWS IoT requires a distinct Private Key and Certificate per Tasmota device. Currently you need to custom compile your Tasmota firmware and burn the Key and Certificate in your firmware. We will later explore how to configure them separately.

Here is a simple guide.

### 0. Open an AWS Account

If you don't have already one, just follow the guide: https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/

### 1. Prerequisites

You will need to install/compile the following:

 * Complete environment to compile Tasmota, ex: PlatformIO (PlatformIO)
 * Recent version of `openssl`


### 2. Enable AWS IoT in Tasmota

Using your favorite IDE, create `user_config_override.h` and add the required compilation directives as documented at the top of this article.  

Note: TLS handshake takes ~1.2s on ESP8266 @80MHz. You may choose to switch to 160MHz if the power supply of your device supports it. If you do so, handshake time should be ~0.7s.

Compile the firmware and ensure it completes successfully.

> This step is only to check compilation goes well. Your firmware is still not usable since it does not contain the Private Key + Certificate.

### 3. Flash your device

Flash your device the normal way; either through serial or OTA. If you use OTA, first flash a `sonoff-minimal` firmware, then your target firmware.

### 4. Configure AWS IoT Policy (to be done once) 

Open the AWS Console and select the target region. In the example below we will use **(EU) Frankfurt** (eu-central-1).

Download the CloudFormation template [Tasmota-MqttPolicy](https://tasmota.github.io/docs/_media/aws_iot/Tasmota-MqttPolicy.yaml "Tasmota-MqttPolicy CloudFormation template"){target=_blank} and use it in AWS CloudFormation.


Or click on the link for the region you have chosen:  

Region| Code | Launch
------|------|-------
US East (N. Virginia) | <span style="font-family:'Courier';">us-east-1</span> | [![Launch IotThingGenerator in us-east-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=TasmotaMqttPolicy&templateURL=https://tasmota-eu-central-1.s3.eu-central-1.amazonaws.com/Tasmota-MqttPolicy.yaml)
EU (Frankfurt) | <span style="font-family:'Courier';">eu-central-1</span> | [![Launch IotThingGenerator in eu-west-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks/new?stackName=TasmotaMqttPolicy&templateURL=https://tasmota-eu-central-1.s3.eu-central-1.amazonaws.com/Tasmota-MqttPolicy.yaml)
EU (Paris) | <span style="font-family:'Courier';">eu-west-3</span> | [![Launch IotThingGenerator in eu-west-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-3#/stacks/new?stackName=TasmotaMqttPolicy&templateURL=https://tasmota-eu-central-1.s3.eu-central-1.amazonaws.com/Tasmota-MqttPolicy.yaml)

1. At the **Create Stack** screen, click **Next**.

 ![MqttPolicy01](https://user-images.githubusercontent.com/49731213/79642169-46be9d80-819c-11ea-8875-55248707c0a2.png)

1. At the **Specify stack details** screen, keep all default parameters and click **Next**.

 ![MqttPolicy02](https://user-images.githubusercontent.com/49731213/79642201-6d7cd400-819c-11ea-81c1-f2f2dda9062e.png)

1. At the **Configure stack options** screen, keep all default parameters and click **Next**.

 ![MqttPolicy03](https://user-images.githubusercontent.com/49731213/79642200-6d7cd400-819c-11ea-9bec-731bd315ea36.png)

1. At the **Review TasmotaMqttPolicy** screen, scroll down and click **Create Stack**.

 ![MqttPolicy04](https://user-images.githubusercontent.com/49731213/79642199-6ce43d80-819c-11ea-822a-b5d6b0b2aefd.png)

1. The stack usually takes less than 2 minutes to complete. Wait for it to reach `CREATE_COMPLETE` state.

 ![MqttPolicy05](https://user-images.githubusercontent.com/49731213/79642197-6ce43d80-819c-11ea-8dda-c8ec717ea6f1.png)

1. If you have left the parameter `RetentionPolicy` to `Retain`, then you can delete this CloudFormation stack (it will not delete the Policy). Click on the **Delete** button.

 ![MqttPolicy06](https://user-images.githubusercontent.com/49731213/79642195-6c4ba700-819c-11ea-99bb-bec6c9c5dfbb.png)

1. After less than 2 minutes, the stack should have reached the state `DELETE_COMPLETE`

 ![MqttPolicy07](https://user-images.githubusercontent.com/49731213/79642194-6bb31080-819c-11ea-98cf-8be4b6b62fce.png)



### 5. Create an AWS IoT Thing with Private Key and Certificate (once per Tasmota device)

The provided AWS CloudFormation template will create the required resources to create:

* One AWS IoT Thing
* One Private key
* One Certificate signed by AWS IoT
* Temporary resources (AWS Lambda functions, AWS IAM resources) that you can delete once the Tasmota thing is created.

Open the AWS Console and select the target region. In the example below we will use **(EU) Frankfurt** (eu-central-1).

Download the CloudFormation template [Tasmota-Thing](https://tasmota.github.io/docs/_media/aws_iot/Tasmota-Thing.yaml "Tasmota-Thing CloudFormation template"){target=_blank} and use it in AWS CloudFormation.


Or click on the link for the region you have chosen:  

Region| Code | Launch
------|------|-------
US East (N. Virginia) | <span style="font-family:'Courier';">us-east-1</span> | [![Launch IotThingGenerator in us-east-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=Tasmota-01&templateURL=https://tasmota-eu-central-1.s3.eu-central-1.amazonaws.com/Tasmota-Thing.yaml)
EU (Frankfurt) | <span style="font-family:'Courier';">eu-central-1</span> | [![Launch IotThingGenerator in eu-west-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks/new?stackName=Tasmota-01&templateURL=https://tasmota-eu-central-1.s3.eu-central-1.amazonaws.com/Tasmota-Thing.yaml)
EU (Paris) | <span style="font-family:'Courier';">eu-west-3</span> | [![Launch IotThingGenerator in eu-west-1](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-3#/stacks/new?stackName=Tasmota-01&templateURL=https://tasmota-eu-central-1.s3.eu-central-1.amazonaws.com/Tasmota-Thing.yaml)


1. At the **Create Stack** screen, click **Next**.

 ![MqttThing01](https://user-images.githubusercontent.com/49731213/79642402-8639b980-819d-11ea-8447-de9617b3c1cf.png)

1. At the **Specify stack details** screen, keep all default parameters and click **Next**.

 Note: you can change the name of the Thing in AWS IoT by specifying the parameter ThingParamName.

 ![MqttThing02](https://user-images.githubusercontent.com/49731213/79642400-85088c80-819d-11ea-8458-44eeafcbd7e6.png)

1. At the **Configure stack options** screen, keep all default parameters and click **Next**.

 ![MqttPolicy03](https://user-images.githubusercontent.com/49731213/79642200-6d7cd400-819c-11ea-9bec-731bd315ea36.png)

1. At the **Review Tasmota-91** screen, scroll down, check the box **I acknowledge that AWS CloudFormation might create IAM resources.** and click **Create Stack**.

 ![MqttThing03](https://user-images.githubusercontent.com/49731213/79642399-846ff600-819d-11ea-84c0-09696c3da661.png)

1. The stack usually takes less than 4 minutes to complete. Wait for it to reach `CREATE_COMPLETE` state.

 ![MqttThing04](https://user-images.githubusercontent.com/49731213/79642496-18da5880-819e-11ea-8d14-81ab2fb17cea.png)

> You need to copy & paste the contents of the **Outputs** tab of the CloudFormation stack: MqttHost, TlsKey1, TlsKey2

 ![MqttThing05](https://user-images.githubusercontent.com/49731213/79642605-dcf3c300-819e-11ea-852e-2df80da3917c.png)

 ![MqttThing06](https://user-images.githubusercontent.com/49731213/79642792-d6b21680-819f-11ea-81a2-682e5310098d.png)
 
 ![MqttThing07](https://user-images.githubusercontent.com/49731213/79642791-d6198000-819f-11ea-8a12-db4b95a7b4a0.png)

Keep a copy of those parameters in a file, you might need them again.

**Cleaning**: to avoid having CloudFormation templates piling up in your console, you can delete them. The created resources will remain, if you have left the parameter `RetentionPolicy` to `Retain`.

### 6. Configure Tasmota device

This is the last step, you need to configure the MQTT parameters. The easiest way is through the web console. We will only cut and paste parameters from the **Outputs** tab of the CloudFormation console.

#### Configure the AWS EndPoint

Copy and paste in the web console the content of **MqttHost**

Example:
```
Backlog MqttHost <your_endpoint>-ats.iot.eu-central-1.amazonaws.com; MqttPort 8883
```

This will trigger a reboot of the device.

Optional, change the topic to distinguish the devices from each others: `Topic sonoff/Tasmota-01`

#### Check that the key store is empty

Type the following command: `TLSKey`

```
hh:mm:ss CMD: TLSKey
hh:mm:ss MQT: stat/<topic>/RESULT = {"TLSKey1":-1,"TLSKey2":-1}
```

If both values are `-1`, it means it does not contain any key.

If you need to reset the key store, use the command `TLSKey 0`.


#### Configure the Private Key and Certificate

AWS IoT credentials are composed of two distinct parts, first a Private Key - this is the secret that will allow your device to prove it is who it pretends to be. Consider this as sensitive as a password. The Private Key is exactly 32 bytes (256 bits).

The second part is the Certificate delivered by AWS IoT. Tasmota will also need it to authenticate to the AWS IoT endpoint.

Both credentials must be stored in Tasmota Flash memory, in that order, using the new `TLSKey` command. `TlsKey1` stores the Private Key. `TlsKey2` stores the Certificate. There is no command to retrieve the private key from a Tasmota device, but keep in mind this secret information can easily be dumped via Serial if somebody gets physical access to the device (ESP8266 does not contain any secure storage area).

Simply Copy and Paste the two commands from `TlsKey1` and `TlsKey2`.


```
TLSKey1 <secret_key_secret_key_secret_key>=
TLSKey2 MIIC<certificate_very_long_string>=
```

`TLSKey1` and `TLSKey2` must be entered in that order. If successful, you should see a message similar to:

```
hh:mm:ss MQT: stat/<topic>/RESULT = {"TLSKey1":32,"TLSKey2":641}
```

You need to check that both values are not "-1". The value for "TLSKey1" should always be 32. The value for "TLSKey2" varies depending on several parameters, and should be within the 640-700 bytes range.

#### Connect to AWS IoT

Once the `TLSKey1` and `TLSKey2` are entered, Tasmota will try to connect to AWS IoT. 

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

## Appendix: Manual configuration


### 1. Prerequisites

You will need to install/compile the following:

 * Complete environment to compile Tasmota, ex: PlatformIO (PlatformIO)
 * Recent version of `openssl`


### 2. Configure AWS IoT (to be done once) 

Open the AWS Console.

Click on "**Services**" and select "**IoT Core**".

Select the AWS Region where you want to locate your data, for ex: "**(EU) Frankfurt**".

<img width="1267" alt="AWS_IoT" src="https://user-images.githubusercontent.com/49731213/62428724-f2a28480-b704-11e9-83e1-7503050e90b8.png">

Now we need to create a security policy to allow your Tasmota devices to connect to AWS IoT, publish and subscribe to topics.

On the left panel, click on "**Secure**" > "**Policies**". Click on the "**Create**" button in the upper right corner.

Enter in the "**Name**" field, enter the name of your policy, for ex: "**TasmotaMqttPolicy**".

<img width="994" alt="Create_policy" src="https://user-images.githubusercontent.com/49731213/62428733-267daa00-b705-11e9-85ca-54609eb408ae.png">

Then click on "**Advanced mode**" Cut and paste the policy below. Click on "**Create**" in the lower right corner.

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Connect",
        "iot:Publish",
        "iot:Subscribe",
        "iot:Receive"
      ],
      "Resource": "*"
    }
  ]
}
```

### 3. Create a Private Key and Certificate (once per Tasmota device)

> Do not use the default AWS IoT feature to generate your private key online. It creates a 2048 bits RSA key. Instead we are using elliptic curves keys - they are much smaller in memory than RSA keys (this saves ~1k of memory) and the handshake is significantly faster.

First create an ECC private key for your device (as described in this [Blog](https://aws.amazon.com/fr/blogs/iot/elliptic-curve-cryptography-and-forward-secrecy-support-in-aws-iot-3/)). Keep you private key in a safe place.

```
$ openssl ecparam -name prime256v1 -genkey -out tasmota-01.key
```

Next, using this private key, create a certificate signing request (CSR). When asked enter the certificate details. This is not really used later, you can just enter a 2 letters country code like "**EU**" and leave all other fields blank (type 8 times enter).

```
$ openssl req -new -sha256 -key tasmota-01.key -nodes -out tasmota-01.csr
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) []:EU <enter>
State or Province Name (full name) []: <enter>
Locality Name (eg, city) []: <enter>
Organization Name (eg, company) []: <enter>
Organizational Unit Name (eg, section) []: <enter>
Common Name (eg, fully qualified host name) []: <enter>
Email Address []: <enter>

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []: <enter>
```

Next ask AWS IoT to sign your key with its certificate. On the left panel, click on "**Secure**" > "**Certificates**". Click on "**Create a certificate**".

Then choose the "**Create with CSR**" button, locate your CSR file from above. Click on "**Upload file**". Download the certificate file, click on "**Download**", save the file as "**tasmota-01.cert.pem**".

**Important**: don't forget to click on the "**Activate**" to activate the certificate.

**Your Private Key and Certificates are ready to use. Now we need to register the Tasmota Device.**

### 4. Write down your AWS IoT endpoint (same for all devices)

Click on "**Settings**" in the left panel. You should see a field called "**Custom endpoint**". Write down the endpoint domain name. It should look like this (if you have chosen the Frankfurt region:

```
<xxxxxxxxxxxxxx>-ats.iot.eu-central-1.amazonaws.com
```

This is your MQTT endpoint, the port is 8883 - MQTT over TLS.

### 5. Register the device in AWS IoT (once per Tasmota device)

Now on the left pane, click on "**Manage**" > "**Things**". Click on "**Register a thing**", then "**Create a single thing**".

Give your device a name like "**Tasmota-01**". Scroll down and click "**Next**" at the botton right. Then click on "**Create thing without a certificate**".

Now we need to associate the certificate created earlier to your device. In the left panel, click back on "**Secure**" > "**Certificates**". Select the certificate created earlier. In the next pane, click on "**Actions**" in the upper right part. First select "**Attach policy**", check "**TasmotaMqttPolicy**" and "**Attach**". Click again on "**Actions**" and select "**Attach thing**", check "**Tasmota-01**" and "**Attach**".

Your setup is done in AWS IoT. Let's proceed to the custom firmware.

<img width="863" alt="Tasmota-01" src="https://user-images.githubusercontent.com/49731213/62428753-6c3a7280-b705-11e9-816e-77ead8e53053.png">

### 8. Prepare your AWS IoT credentials

You will now need to convert your AWS IoT credentials to Tasmota commands. Credentials are composed of two distinct parts, first a Private Key - this is the secret that will allow your device to prove it is who it pretends to be. Consider this as sensitive as a password. The Private Key is exactly 32 bytes (256 bits).

The second part is the Certificate delivered by AWS IoT. Tasmota will also need it to authenticate to the AWS IoT endpoint.

Both credentials must be stored in Tasmota Flash memory, in that order, using the new `TLSKey` command.

#### a. First check that the key store is empty

Type the following command: `TLSKey`

```
hh:mm:ss CMD: TLSKey
hh:mm:ss MQT: stat/tasmota/RESULT = {"TLSKey1":-1,"TLSKey2":-1}
```

If both values are `-1`, it means it does not contain any key.

If you need to reset the key store, use the command `TLSKey 0`.

#### b. Convert the Private Key

We will extract the 32 bytes Private key from `tasmota-01.key` generated above.

1-line method, use the following command: (fake key below)

`openssl ec -in tasmota-01.key -inform PEM -outform DER | openssl asn1parse -inform DER | head -3 | tail -1 | awk -F':' '{ print $4 }' | xxd -r -p | base64 | echo "TLSKey1 $(</dev/stdin)"`

Example:

```
openssl ec -in tasmota-01.key -inform PEM -outform DER | openssl asn1parse -inform DER | head -3 | tail -1 | awk -F':' '{ print $4 }' | xxd -r -p | base64 | echo "TLSKey1 $(</dev/stdin)"
read EC key
writing EC key
TLSKey1 UvBgyCuPr/lKSgwumf/8o/mIsKQPBHn3ZZAGZl4ui9E=
```

Cut and paste the command starting with `TLSKey1 ...` into the Tasmota Web Console or through MQTT.

```
hh:mm:ss CMD: TLSKey1 UvBgyCuPr/lKSgwumf/8o/mIsKQPBHn3ZZAGZl4ui9E=
hh:mm:ss MQT: stat/tasmota/RESULT = {"TLSKey1":32,"TLSKey2":-1}
```

Alternative method:

Convert the Private Key file from `PEM` to `DER` (binary format):

`openssl ec -in tasmota-01.key -inform PEM -outform DER -out tasmota-01.key.der`

Dump the `ASN.1` format from the `DER` file:

```
openssl asn1parse -inform DER -in tasmota-01.key.der
    0:d=0  hl=2 l= 119 cons: SEQUENCE          
    2:d=1  hl=2 l=   1 prim: INTEGER           :01
    5:d=1  hl=2 l=  32 prim: OCTET STRING      [HEX DUMP]:52F060C82B8FAFF94A4A0C2E99FFFCA3F988B0A40F0479F7659006665E2E8BD1
   39:d=1  hl=2 l=  10 cons: cont [ 0 ]        
   41:d=2  hl=2 l=   8 prim: OBJECT            :prime256v1
   51:d=1  hl=2 l=  68 cons: cont [ 1 ]        
   53:d=2  hl=2 l=  66 prim: BIT STRING        
```

Then convert the byte stream after `[HEX DUMP]` to base64 and use it with the `TLSKey1` command.

#### c. Convert the Certificate

Similarly you will need to convert the file "**tasmota-01.cert.pem**" generated above to a Tasmota command.

1-line version, use the following command:

`openssl x509 -in tasmota-01.cert.pem -inform PEM -outform DER | base64 | echo "TLSKey2 $(</dev/stdin)"`

Example: (fake certificate)

```
openssl x509 -in tasmota-01.cert.pem -inform PEM -outform DER | base64 | echo "TLSKey2 $(</dev/stdin)"
TLSKey2 MIICfTCCAWWgAwIBAgIUMPd6KefJYqwIHxzgCk1kEXIjHhkwDQYJKoZIhvcNAQELBQAwTTFLMEkGA1UECwxCQW1hem9uIFdlYiBTZXJ2aWNlcyBPPUFtYXpvbi5jb20gSW5jLiBMPVNlYXR0bGUgU1Q9V2FzaGluZ3RvbiBDPVVTMB4XDTE5MDgwNDE5MjI1NVoXDTQ5MTIzMTIzNTk1OVowDTELMAkGA1UEBhMCRVUwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAASCzFZFhPXBbr6G6gbhT/rGXROhN5AHdwhxfpY55xi3c1W3TBuvUdZYdU2Urc9t4ces9Nz3UcF1xfMBvIpVqMVco2AwXjAfBgNVHSMEGDAWgBT3n7seZ1eHUIcZCcuwn0fkEad77TAdBgNVHQ4EFgQUUruspk3ohBJB8buA8qq9kQIZUs0wDAYDVR0TAQH/BAIwADAOBgNVHQ8BAf8EBAMCB4AwDQYJKoZIhvcNAQELBQADggEBAFPKpVjaowYY3taAcKsSxfwkwzglI2eUlnmSdnu6WZkNEdiYpx8QVYb+miJnIyTVaE3bzkTr4PvObwf4Vs92uMtIQ5BuU1lj8EdfsZAs6uA1rqfQIl0n7ty3bErtVb3d+uUBm4C1b9mtbQS45itfrTvzWEoLuWflUxAFqyYVmNPNHTfPFLjAP9dcpWk+388pRl3jkGo1qiFrEp+ucQMtkqwn3lfVXlRFuGY6GxKg2lBWvqW5CuHaBhFjeT63pqUmjj76VrBk/Vp9BMjIJ3a1omuW3ZUGCPdXUVqj4/m2pXoYIGW7l/fZpfV4piKOW1tcxeX/iBdgPUL1XUMbCtBybbc=
```

Copy and paste the last line starting with `TLSKey2 ...` into the Web Tasmota Console or through MQTT. Note: you cannot use this command through Serial, it is bigger than the max serial buffer (520 bytes).

```
hh:mm:ss CMD: TLSKey2 MIICfTCCAWWgAwIBAgIUMPd6KefJYqwIHxzgCk1kEXIjHhkwDQYJKoZIhvcNAQELBQAwTTFLMEkGA1UECwxCQW1hem9uIFdlYiBTZXJ2aWNlcyBPPUFtYXpvbi5jb20gSW5jLiBMPVNlYXR0bGUgU1Q9V2FzaGluZ3RvbiBDPVVTMB4XDTE5MDgwNDE5MjI1NVoXDTQ5MTIzMTIzNTk1OVowDTELMAkGA1UEBhMCRVUwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAASCzFZFhPXBbr6G6gbhT/rGXROhN5AHdwhxfpY55xi3c1W3TBuvUdZYdU2Urc9t4ces9Nz3UcF1xfMBvIpVqMVco2AwXjAfBgNVHSMEGDAWgBT3n7seZ1eHUIcZCcuwn0fkEad77TAdBgNVHQ4EFgQUUruspk3ohBJB8buA8qq9kQIZUs0wDAYDVR0TAQH/BAIwADAOBgNVHQ8BAf8EBAMCB4AwDQYJKoZIhvcNAQELBQ
hh:mm:ss MQT: stat/tasmota/IR2/RESULT = {"TLSKey1":32,"TLSKey2":641}
```

You need to check that both values are not "-1". The value for "TLSKey1" should always be 32. The value for "TLSKey2" varies depending on several parameters, and should be within the 640-700 bytes range.

Alternative version:

Convert your certificate from `PEM` to `DER` (binary) format:

`openssl x509 -in tasmota-01.cert.pem -inform PEM -outform DER -out tasmota-01.cert.der`

Then convert the Certificate to plain base64 in a single line (use `-A` flag):

`openssl base64 -e -in tasmota-01.cert.der -A -out tasmota-01.cert.b64`

Then use the command `TSLKey2 <base64>` and replace `<base64>` with the content of `tasmota-01.cert.b64`.
