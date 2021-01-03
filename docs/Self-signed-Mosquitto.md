
!!! failure "This feature is not included in precompiled binaries"
    To use it you must [compile your build](Compile-your-build).


The following guide will walk you through the setup of Tasmota with your own instance of Mosquitto Server with Certificate-based TLS encryption and a Self-signed CA (Certificate Authority).

## Benefits
The following setup provides stronger security in communication between your devices and your MQTT server.

### - No cloud usage

Many people might prefer cloud-based solutions, such as [AWS IOT](AWS-IoT). Nonetheless, running local MQTT provides various benefits like no internet requirements, no data sharing with third parties and lower latencies.

### - Maximum security

This setup is designed with 'security first' in mind.

Communication is done over TLS 1.2 tunnels, using client certificates to authenticate each device.

Strong encryption is particularly interesting considering that ESP8266-based Tasmota devices can only connect using WPA2 with preshared keys. Beside being much more secure than other solution, WPA2 Personal is still exposed to security weaknesses. Thus, MQTT strong TLS configuration is encouraged in this scenario.

## Caveats
Certificate-based MQTT-TLS requires each Tasmota device to have its own distinct Private Key and Certificate (~800 bytes). Although you could imagine to use the same Private Key in all your devices, this is considered as a very bad practice. You are warned!

During TLS handshake, a secondary stack of 5.3k is allocated on the heap to allow BearSSL to have enough stack room. Memory is freed at the end of the handshake. Allocating such big chunks of memory can cause issues when heap fragmentation gets too high. If you see memory going below 15KB, you may experience crashes.

## How to configure?
Ideally we will work on three systems:
1. **CA machine**: a secure, possibly air-gap system, where you generate your certificates;
2. **Server Machine**: the machine running your MQTT server. We will assume it is running some Debian-based distribution (i.e. Ubuntu Server), though the steps could be adapted to different OSes;
3. **Compiling Machine**: the machine used to compile your customized Tasmota firmware. This machine might be the same **Server Machine**, though I would not recommend it.

!!! failure "Security notice" Your CA keys should reside on a secure, possibly air-gapped system. Securing your CA exceeds the scope of this guide, but we assume you follow best security practices.



### 1. Prepare your CA (on **Server Machine**)
We will use Easy-RSA for easy management of the CA and certificates. Some modification are required to match our configuration.

#### 1.1. Prepare Easy-RSA :
Get a copy of Easy-RSA and add a reduced x509 extension definition for Tasmota.
Certificates obtained using standard client definitions are too big and results in failure when storing them on Tasmota devices.
```
git clone https://github.com/OpenVPN/easy-rsa.git
cd easy-rsa/easyrsa3

# Define reduced x509 extension for Tasmota
cat <<EOF > x509-types/tasmota
# X509 extensions for a Tasmota client
basicConstraints = critical,CA:FALSE
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always
keyUsage = critical,digitalSignature
EOF
```
#### 1.2.  Define your certificate information :

```
# Define your info
cat <<EOF > vars
# Define X509 DN mode.
# This is used to adjust what elements are included in the Subject field as the DN
# (this is the "Distinguished Name.")
# Note that in cn_only mode the Organizational fields further below aren't used.
#
# Choices are:
#   cn_only  - use just a CN value
#   org      - use the "traditional" Country/Province/City/Org/OU/email/CN format

set_var EASYRSA_DN "org"

# Organizational fields (used with 'org' mode and ignored in 'cn_only' mode.)
# These are the default values for fields which will be placed in the
# certificate.  Don't leave any of these fields blank, although interactively
# you may omit any specific field by typing the "." symbol (not valid for
# email.)

set_var EASYRSA_REQ_COUNTRY "UK"
set_var EASYRSA_REQ_PROVINCE "London"
set_var EASYRSA_REQ_CITY "London"
set_var EASYRSA_REQ_ORG "myorg"
set_var EASYRSA_REQ_EMAIL "info@myorg.com"
set_var EASYRSA_REQ_OU "MQTT"

# Choose a size in bits for your keypairs. The recommended value is 2048.  Using
# 2048-bit keys is considered more than sufficient for many years into the
# future. Larger keysizes will slow down TLS negotiation and make key/DH param
# generation take much longer. Values up to 4096 should be accepted by most
# software. Only used when the crypto alg is rsa (see below.)

set_var EASYRSA_KEY_SIZE 2048

# The default crypto mode is rsa; ec can enable elliptic curve support.
# Note that not all software supports ECC, so use care when enabling it.
# Choices for crypto alg are: (each in lower-case)
#  * rsa
#  * ec
#  * ed

set_var EASYRSA_ALGO rsa

# Define the named curve, used in ec & ed modes:

set_var EASYRSA_CURVE prime256v1
# In how many days should the root CA key expire?

set_var EASYRSA_CA_EXPIRE 3650

# In how many days should certificates expire?

set_var EASYRSA_CERT_EXPIRE 1800
# Cryptographic digest to use.
# Do not change this default unless you understand the security implications.
# Valid choices include: md5, sha1, sha256, sha224, sha384, sha512

#set_var EASYRSA_DIGEST "sha256"
EOF
```

#### 1.3. Initialize and generate the CA and the server certificate:

```
# Reset PKI
./easyrsa init-pki
# Build CA following instructions
./easyrsa build-ca
# Request server certificate following instructions
./easyrsa gen-req mqtt.myorg.com
# Sign certificate for server
./easyrsa sign-req server mqtt.myorg.com
```

#### 1.4. Change key types (EC is required for tasmota devices)
```
sed -i '/^set_var\ EASYRSA_ALGO/ s/rsa/ec/' vars
```

#### 1.5. Copy the following files to the **Server Machine**
```
./pki/ca.crt --> CA certificate file
./pki/issued/mqtt.myorg.com.crt --> Server certificate file
./pki/private/mqtt.myorg.com.key --> Server private Key file
```

#### 1.6. (Optional step for Full Cert Validation)
- Copy `./pki/ca.crt`to your **Compiling Machine**
- Install BearSSL:
```
git clone https://www.bearssl.org/git/BearSSL
cd BearSSL
make
```
- Obtain CA in BearSSL format:
```
./build/brssl ta /path/to/your/ca.crt > myca.ino
```


### 2. Configure your Tasmotabuild (on **Compiling Machine**)
Refer to your preferred way to custom compile Tasmota.
Modify the default configuration following one of 2.1 or 2.2 solutions (Easier or Advanced):

#### 2.1. Easier: Using fingerprint validation

Add the following to `user_config_override.h`:

```
#ifndef USE_MQTT_TLS
#define USE_MQTT_TLS
//  #define USE_MQTT_TLS_CA_CERT                   // Force full CA validation instead of fingerprints, slower, but simpler to use.  (+2.2k code, +1.9k mem during connection handshake)
#define USE_MQTT_AWS_IOT    // This includes the LetsEncrypt CA in tasmota_ca.ino for verifying server certificates
#define USE_MQTT_TLS_FORCE_EC_CIPHER           // Force Elliptic Curve cipher (higher security) required by some servers (automatically enabled with USE_MQTT_AWS_IOT) (+11.4k code, +0.4k mem)
#define MQTT_FINGERPRINT1      "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00"  // [MqttFingerprint1] (auto-learn)
#define MQTT_FINGERPRINT2      "DA 39 A3 EE 5E 6B 4B 0D 32 55 BF EF 95 60 18 90 AF D8 07 09"  // [MqttFingerprint2] (invalid)
#endif
```
#### 2.2. Advanced: Using Full certificate validation
Add the following to `user_config_override.h`:

```
#ifndef USE_MQTT_TLS
#define USE_MQTT_TLS
#define USE_MQTT_TLS_CA_CERT                   // Force full CA validation instead of fingerprints, slower, but simpler to use.  (+2.2k code, +1.9k mem during connection handshake)
#define USE_MQTT_AWS_IOT    // This will include LetsEncrypt CA, as well as our CA, in tasmota_ca.ino for verifying server certificates
#define USE_MQTT_TLS_FORCE_EC_CIPHER           // Force Elliptic Curve cipher (higher security) required by some servers (automatically enabled with USE_MQTT_AWS_IOT) (+11.4k code, +0.4k mem)
#endif
```
Merge your `myca.ino` to `$TASMOTAROOT/tasmota/tasmota_ca.ino`. Result should look like:
```
[...]
const br_x509_trust_anchor PROGMEM AmazonRootCA1_TA = {
	{ (unsigned char *)AmazonRootCA1_DN, sizeof AmazonRootCA1_DN },
	BR_X509_TA_CA,
	{
		BR_KEYTYPE_RSA,
		{ .rsa = {
			(unsigned char *)AmazonRootCA1_RSA_N, sizeof AmazonRootCA1_RSA_N,
			(unsigned char *)AmazonRootCA1_RSA_E, sizeof AmazonRootCA1_RSA_E,
		} }
	}
};

const unsigned char TA0_DN[] PROGMEM = {
	// MANY RANDOM  HEX VALUES FROM YOUR TA0_DN HERE
};

const unsigned char TA0_RSA_N[] PROGMEM = {
	// MANY RANDOM  HEX VALUES FROM YOUR TA0_RSA_N HERE
};

const unsigned char TA0_RSA_E[] PROGMEM = {
	0x01, 0x00, 0x01 // values from your TA0_RSA_N
};

const br_x509_trust_anchor TA0 PROGMEM = {
	{ (unsigned char *)TA0_DN, sizeof TA0_DN },
	BR_X509_TA_CA,
	{
		BR_KEYTYPE_RSA,
		{ .rsa = {
			(unsigned char *)TA0_RSA_N, sizeof TA0_RSA_N,
			(unsigned char *)TA0_RSA_E, sizeof TA0_RSA_E,
		} }
	}
};

// cumulative CA
const br_x509_trust_anchor PROGMEM Tasmota_TA[] = {
	{
		{ (unsigned char *)LetsEncrypt_DN, sizeof LetsEncrypt_DN },
		BR_X509_TA_CA,
		{
			BR_KEYTYPE_RSA,
			{ .rsa = {
				(unsigned char *)LetsEncrypt_RSA_N, sizeof LetsEncrypt_RSA_N,
				(unsigned char *)LetsEncrypt_RSA_E, sizeof LetsEncrypt_RSA_E,
			} }
		}
	}
	,
	{
		{ (unsigned char *)AmazonRootCA1_DN, sizeof AmazonRootCA1_DN },
		BR_X509_TA_CA,
		{
			BR_KEYTYPE_RSA,
			{ .rsa = {
				(unsigned char *)AmazonRootCA1_RSA_N, sizeof AmazonRootCA1_RSA_N,
				(unsigned char *)AmazonRootCA1_RSA_E, sizeof AmazonRootCA1_RSA_E,
			} }
		}
	}
	,
        {
                { (unsigned char *)TA0_DN, sizeof TA0_DN },
                BR_X509_TA_CA,
                {
                        BR_KEYTYPE_RSA,
                        { .rsa = {
                                (unsigned char *)TA0_RSA_N, sizeof TA0_RSA_N,
                                (unsigned char *)TA0_RSA_E, sizeof TA0_RSA_E,
                        } }
                }
        }
};

const size_t Tasmota_TA_size = ARRAY_SIZE(Tasmota_TA);

// we add a separate CA for telegram
[...]
```



### 2. Build your Tasmota Binaries, flash and configure your devices


### 3. Configure your network
- Configure your router to point `mqtt.myorg.com` to your **Server Machine**.
- Configure your **Server Machine** hostname to `mqtt.myorg.com`.
- Check other Tasmota guidelines about [Securing your IoT](Securing-your-IoT-from-hacking).

### 4. Install and configure Mosquitto on your server
Install Mosquitto
```
sudo apt-get install Mosquitto
```
Copy the files from **CA Machine** to the following dirs:
```
/etc/mosquitto/ca_certificates/ca.crt
/etc/mosquitto/certs/mqtt.myorg.com.crt
/etc/mosquitto/certs/mqtt.myorg.com.key
```

```openssl rsa -in mqtt.myorg.com.key -out mqtt.myorg.com.pem```
Ensure the files have owner `mosquitto:mosquitto` and permissions `-r--------`. Also ensure `ca_certificates` and `certs` directories have owner `mosquitto:mosquitto` and permissions `dr-x------`.

Edit `/etc/mosquitto/conf.d/default.conf` as following:
```
protocol mqtt
allow_anonymous false
listener 8884
socket_domain ipv4
# Certs and Keys
cafile /etc/mosquitto/ca_certificates/ca.crt
certfile /etc/mosquitto/certs/mqtt.myorg.com.crt
keyfile /etc/mosquitto/certs/mqtt.myorg.com.pem
require_certificate true
use_identity_as_username true
```

Start Mosquitto:
```
sudo service mosquitto Start
```

### 5 - Generate and configure certificates for your devices

!!! failure "Repeated step" Repet the following 5.x steps once for every device, changing tasmota_name for each device. Also choose a password for each device when prompted.
#### 5.1 Generate the client certificates

```
export TAS=tasmota_name
# Request tasmota certs (will ask for password)
./easyrsa gen-req $TAS
# Sign certificate for Tasmota
./easyrsa sign-req tasmota $TAS
```
#### 5.2 Show the keys as Tasmota compatible format

You will now need to convert your certificates to Tasmota commands. Credentials are composed of two distinct parts, first a Private Key - this is the secret that will allow your device to prove it is who it pretends to be. Consider this as sensitive as a password. The Private Key is exactly 32 bytes (256 bits).

Run the following commands and follow the instruction in the console output.
```
# Decrypt private key (will ask the respective password)
openssl ec -in ./pki/private/$TAS.key -out ./pki/private/$TAS.pem
# Extract TlsKey1 and TlsKey2 Value
openssl ec -in ./pki/private/$TAS.pem -inform PEM -outform DER | openssl asn1parse -inform DER | head -3 | tail -1 | awk -F':' '{ print $4 }' | xxd -r -p | base64 | echo -e "----\n\nCopy the following commands\n\n---\n\nTLSKey1 $(</dev/stdin)" && openssl x509 -in ./pki/issued/$TAS.crt -inform PEM -outform DER|openssl base64 -e -in - -A|echo -e "\n\nTlskey2 $(</dev/stdin)"
```
#### 5.3 Access your device's web interface and configure the keys.

Run the `TLSKey1` and `TLSKey2` commands as obtained in the previous output.

#### 5.4 Verify the device is connecting as expected.
