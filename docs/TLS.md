# TLS Secured MQTT
!!! failure "This feature is not included in precompiled binaries"     

To use it you must [compile your build](Compile-your-build) do the follow changes:
1 - Add the following to `user_config_override.h`:

```C
#ifndef USE_MQTT_TLS 
#define USE_MQTT_TLS                             // Use TLS for MQTT connection (+34.5k code, +7.0k mem and +4.8k additional during connection handshake)
//  #define USE_MQTT_TLS_CA_CERT                   // Force full CA validation instead of fingerprints, slower, but simpler to use.  (+2.2k code, +1.9k mem during connection handshake)
                                                   // This includes the LetsEncrypt CA in tasmota_ca.ino for verifying server certificates
//  #define USE_MQTT_TLS_FORCE_EC_CIPHER           // Force Elliptic Curve cipher (higher security) required by some servers (automatically enabled with USE_MQTT_AWS_IOT) (+11.4k code, +0.4k mem)
#endif
```

2 - Change port to 8883
```
#define MQTT_PORT              8883              // [MqttPort] MQTT port (10123 on CloudMQTT)
```

3 - Ensure that for the environment you have selected, `lib/lib_ssl` is included on `platformio_tasmota_env.ini` :
```
lib_extra_dirs          = lib/lib_ssl
```

TLS offers increased security between your connected devices and your MQTT server, providing server authentication and encryption. Please refer to the general discussion in [Securing-your-IoT-from-hacking](Securing-your-IoT-from-hacking)

Starting version 6.5.0.15, there are major changes to TLS to make it lighter in memory and easier to use. It has now reduced flash and memory requirements that makes it compatible with Web and Hue Emulation.

!!! note "If you are upgrading from a previous TLS activated version, there are breaking changes in the way Fingerprints are calculated"

At the Tasmota configuration, you need to enable to use the TLS Version. This is done by enable `#define USE_MQTT_TLS` in `user_config_override.h` and 

If you are using LetsEncrypt to generate your server certificates, you should activate `#define USE_MQTT_TLS_CA_CERT`. Tasmota will transparently check the server's certificate with LetsEncrypt CA. If you are generating self-signed certificates or prefer fingerprints, read below.

## Fingerprint Validation

The fingerprint is now calculated on the server's Public Key and no longer on its Certificate. The good news is that Public Keys tend to change far less often than certificates, i.e. LetsEncrypt triggers a certificate renewal every 3 months, the Public Key fingerprint will not change after a certificate renewal. The bad news is that there is no `openssl` command to retrieve the server's Public Key fingerprint, although [a tool exists to calculate it](https://github.com/issacg/tasmota-fingerprint) from your certificate.

So to simplify your task, we have added two more options: 1/ auto-learning of the fingerprint, 2/ disabling of the fingerprint validation altogether.

#### Option 1: Fingerprint auto-learn
If set, Tasmota will automatically learn the fingerprint during the first connection and will set the Fingerprint settings to the target fingerprint. To do so, use one of the following commands:

```
#define MQTT_FINGERPRINT1     "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00"
```
or
```
#define MQTT_FINGERPRINT2     "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00"
```

#### Option 2: Disable Fingerprint
You can completely disable server fingerprint validation, which means that Tasmota will not check the server's identity. This also means that your traffic can possibly be intercepted and read/changed, so this option should only be used on trusted networks, i.e. with an MQTT on your local network. **YOU HAVE BEEN WARNED!**

To do so, set one of the Fingerprints to all 0xFF:

```
#define MQTT_FINGERPRINT1     "FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF"
```
Tasmota also provide an option to authenticate clients using an x509 certificate and a public key for authentication, instead of username/password.

For details on how to set up your local instance of Mosquitto, check the article [Self-signed-Mosquitto](Self-signed-Mosquitto).

## Limitations

Starting with 6.5.0.15, AxTLS has been replaced with [BearSSL](https://bearssl.org/). This uses less memory, typically 6.0k constantly, and an additional 6.8k during TLS connection. This makes TLS compatible with Web and Hue/Wemo emulation.

Main limitations are:

- Your SSL/TLS server must support TLS 1.2 and the `RSA_WITH_AES_128_GCM_SHA256` cipher - which is the case with the default Mosquitto configuration
- The server certificate must have an RSA private key (max 2048 bits) and the certificate must be signed with RSA and SHA256 hash. This is the case with default LetsEncrypt certificates.
- Your SSL/TLS should support TLS 1.2 MFLN to limit buffer to 1024 bytes. If MFLN is not supported, it will still work well, as long as the server does not send any message above 1024 bytes (which should be ok, since Tasmota cannot parse MQTT messages above 1024 bytes)

-----------


## Implementation Notes

Arduino Core switched from AxTLS to BearSSL in 2.4.2, allowing further optimization of the TLS library footprint. BearSSL is designed for compactness, both in code size and memory requirements. Furthermore it is modular and allows for inclusion of only the code necessary for the subset of crypto-algorithms you want to support.

Thanks to BearSSL's compactness and aggressive optimization, the minimal TLS configuration requires just **34.5k of Flash** and **6.7k of Memory**. The full-blown AWS IoT version with full certificate validation requires 48.3k of Flash and 9.4k of Memory.

Here are the tips and tricks used to reduce Flash and Memory:

* **MFLN** (Maximum Fragment Length Negotiation): TLS normally uses 16k buffers for send and receive. 32k looks very small on a server, but immensely huge for ESP8266. TLS 1.2 introduced MFLN, which allows the TLS Client to reduce both buffers down to 512 bytes. MFLN is not widely supported yet, but it is by recent OpenSSL versions and by AWS IoT. This is a huge improvement in memory footprint. If your server does not support MFLN, it will still work as long as the messages sent by the server do not exceed the buffer length. In Tasmota the buffer length is 1024 bytes for send buffer and 1024 bytes for receive buffer. Going below creates message fragmentation and much longer TLS connection times (above 3s). If your server does not support MFLN, you'll see a message to that effect in the logs.
* **Max Certificate size**: BearSSL normally supports server certificates of up to RSA 4096 bits and EC 521 bits. These certificates are very uncommon currently. To save extra memory, the included BearSSL library is trimmed down to maximum RSA 2048 bit certificate and EC 256 bit certificate. This should not have any impact for you.

!!! bug "Tasmota will crash if the server serves a 4096 bit RSA certificate. The crash will likely be in `br_rsa_i15_pkcs1_vrfy`. Enable `USE_4K_RSA` to avoid this behaviour."
    
* **EC private key**: AWS IoT requires the client to authenticate with its own Private Key and Certificate. By default AWS IoT will generate an RSA 2048 bit private key. In Tasmota, we moved to an EC (Elliptic Curve) Private Key of 256 bits. EC keys are much smaller, and handshake is significantly faster. Note: the key being 256 bits does not mean it's less secure than RSA 2048, it's actually the opposite.
* **Single Cipher**: to reduce code size, we only support a single TLS cipher and embed only the code strictly necessary. When using TLS (e.g. LetsEncrypt on Mosquitto) the supported cipher is `RSA_WITH_AES_128_GCM_SHA256` which is a very commonly supported cipher. For AWS IoT, the only supported cipher is `ECDHE_RSA_WITH_AES_128_GCM_SHA256` which is one of the recommended ciphers. Additionally, ECDHE offers Perfect Forward Secrecy which means extra security.
* **Adaptive Thunk Stack**: BearSSL does not allocate memory on its own. It's either the caller's responsibility or memory is taken on the Stack. Stack usage can go above 5k, more than the ESP8266 stack. Arduino created a **Thunk Stack**, a secondary stack of 5.6k, allocated on Heap, and activated when a TLS connection is active. Actually the stack is mostly used during TLS handshake, and much less memory is required during TLS message processing. Tasmota only allocates the Thunk Stack during TLS handshake and switches back to the normal Stack afterwards. See below for details of actual memory usage.
* **Keys and CA in PROGMEM**: BearSSL was adapted from original source code to push most on the tables and static data into PROGMEM:
https://github.com/earlephilhower/bearssl-esp8266. Additional work now allows us to put the Client Private Key, Certificate and CA in PROGMEM too, saving at least 3k of Memory.

## Memory Usage

TLS on Tasmota has been aggressively optimized to use as little memory (heap) as possible. It was also optimized to limit code size.

Memory consumption (nominal):

* BearSSL lib: **1424 bytes** (or 1024 bytes with LetsEncrypt or regular TLS)
* BearSSL ClientContext: **3440 bytes**
* Buffers (1024 bytes in + 1024 bytes out + overhead): **2528 bytes**
* **Total = 7.4k** (or 7.0k with LetsEncrypt or regular TLS)

Note: if you use `USE_WEBSERVER`, your impact is lowered by 2k since the Web log buffer is reduced from 4k to 2k. Overall, when activating `USE_WEBSERVER`, you just see a memory impact of 5.4k.

Memory needed during connection (TLS handshake - fingerprint validation):

* ThunkStack = **5308 bytes** (or **3608 bytes** with LetsEncrypt or regular TLS)
* DecoderContext = **1152 bytes**
* **Total for connection = 6.5k** (or **4.8k** with LetsEncrypt or regular TLS)

Memory needed during connection (TLS handshake - full CA validation):

* ThunkStack = **5308 bytes** (or **3608 bytes** with LetsEncrypt or regular TLS)
* DecoderContext = **3072 bytes**
* **Total for connection = 8.4k** (or **6.7k** with LetsEncrypt or regular TLS)

## Connection Time

ESP8266 is quite slow compared to modern processors when it comes to SSL handshakes. Here are observed performance times when connecting to an SSL/TLS server, depending on CPU frequency (80MHz or 160MHz):

AWS IoT Connection, with EC Private Key, simple fingerprint validation:

* **0.7s** at 160MHz
* **1.3s** at 80 MHz

AWS IoT Connection, with EC Private Key, full CA validation (easier to configure than fingerprints):

* **1.0s** at 160MHz
* **1.8s** at 80 MHz

LetsEncrypt based server (Mosquitto for ex), simple fingerprint validation:

* **0.3s** at 160MHz
* **0.4s** at 80MHz

LetsEncrypt based server (Mosquitto for ex), with full CA validation (easier to configure than fingerprint):

* **0.4s** at 160MHz
* **0.7s** at 80MHz

### TLS Troubleshooting

Here are most common TLS errors:  

|Error code | Description|
|---:|:---|
| -1004 | Missing CA |
| -1003 | Missing EC private key |
| -1002 | Cannot connect to TCP port |
| -1001 | Cannot resolve IP address |
| -1000 | Out of memory error |
| 1 | Bad fingerprint |
| 2 | BR_ERR_BAD_STATE |
| 3 | BR_ERR_UNSUPPORTED_VERSION |
| 4 | BR_ERR_BAD_VERSION |
| 5 | BR_ERR_BAD_LENGTH |
| 6 | BR_ERR_TOO_LARGE |
| 7 | BR_ERR_BAD_MAC |
| 8 | BR_ERR_NO_RANDOM |
| 9 | BR_ERR_UNKNOWN_TYPE |
| 10 | BR_ERR_UNEXPECTED |
| 12 | BR_ERR_BAD_CCS |
| 13 | BR_ERR_BAD_ALERT |
| 14 | BR_ERR_BAD_HANDSHAKE |
| 15 | BR_ERR_OVERSIZED_ID |
| 16 | BR_ERR_BAD_CIPHER_SUITE |
| 17 | BR_ERR_BAD_COMPRESSION |
| 18 | BR_ERR_BAD_FRAGLEN |
| 19 | BR_ERR_BAD_SECRENEG |
| 20 | BR_ERR_EXTRA_EXTENSION |
| 21 | BR_ERR_BAD_SNI |
| 22 | BR_ERR_BAD_HELLO_DONE |
| 23 | BR_ERR_LIMIT_EXCEEDED: the server's public key is too large. Tasmota TLS is limited to 2048 RSA keys |
| 24 | BR_ERR_BAD_FINISHED |
| 25 | BR_ERR_RESUME_MISMATCH |
| 26 | BR_ERR_INVALID_ALGORITHM |
| 27 | BR_ERR_BAD_SIGNATURE |
| 28 | BR_ERR_WRONG_KEY_USAGE |
| 29 | BR_ERR_NO_CLIENT_AUTH |
| 31 | BR_ERR_IO |
| 54 | BR_ERR_X509_EXPIRED X.509 status: certificate is expired or not yet valid. |
| 56 | BR_ERR_X509_BAD_SERVER_NAME X.509 status: expected server name was not found in the chain. |
| 62 | X509 not trusted, the server certificate is not signed by the CA (AWS IoT or LetsEncrypt) |
| 266 | SSL3_ALERT_UNEXPECTED_MESSAGE |
| 276 | TLS1_ALERT_BAD_RECORD_MAC |
| 277 | TLS1_ALERT_DECRYPTION_FAILED |
| 278 | TLS1_ALERT_RECORD_OVERFLOW |
| 286 | SSL3_ALERT_DECOMPRESSION_FAIL |
| 296 | SSL3_ALERT_HANDSHAKE_FAILURE |
| 298 | TLS1_ALERT_BAD_CERTIFICATE: Missing or bad client private key |
| 299 | TLS1_ALERT_UNSUPPORTED_CERT |
| 300 | TLS1_ALERT_CERTIFICATE_REVOKED |
| 301 | TLS1_ALERT_CERTIFICATE_EXPIRED |
| 302 | TLS1_ALERT_CERTIFICATE_UNKNOWN |
| 303 | SSL3_ALERT_ILLEGAL_PARAMETER |
| 304 | TLS1_ALERT_UNKNOWN_CA |
| 305 | TLS1_ALERT_ACCESS_DENIED |
| 306 | TLS1_ALERT_DECODE_ERROR |
| 307 | TLS1_ALERT_DECRYPT_ERROR |
| 316 | TLS1_ALERT_EXPORT_RESTRICTION |
| 326 | TLS1_ALERT_PROTOCOL_VERSION |
| 327 | TLS1_ALERT_INSUFFIENT_SECURITY |
| 336 | TLS1_ALERT_INTERNAL_ERROR |
| 346 | TLS1_ALERT_USER_CANCELED |
| 356 | TLS1_ALERT_NO_RENEGOTIATION |
| 366 | TLS1_ALERT_UNSUPPORTED_EXT |

[Additional `BR_ERR*` error codes](https://www.bearssl.org/gitweb/?p=BearSSL;a=blob;f=inc/bearssl_ssl.h)  
