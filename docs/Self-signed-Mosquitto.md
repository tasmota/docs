
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

Strong encryption is particularly valuable considering that ESP8266-based Tasmota devices can only connect using WPA2 with 
preshared keys. Because WPA2 Personal has known security weaknesses, the MQTT strong TLS configuration is encouraged in this scenario.

## Caveats
Certificate-based MQTT-TLS requires each Tasmota device to have its own distinct Private Key and Certificate (~800 bytes). Although you could imagine to use the same Private Key in all your devices, this is considered as a very bad practice. You are warned!

During TLS handshake, a secondary stack of 5.3k is allocated on the heap to allow BearSSL to have enough stack room. Memory is freed at the end of the handshake. Allocating such big chunks of memory can cause issues when heap fragmentation gets too high. If you see memory going below 15KB, you may experience crashes.

## How to configure?
Ideally we will work on three systems:
1. **CA machine**: a secure, possibly air-gap system, where you generate your certificates;
2. **Server Machine**: the machine running your MQTT server. We will assume it is running some Debian-based distribution (i.e. Ubuntu Server), though the steps could be adapted to different OSes;
3. **Compiling Machine**: the machine used to compile your customized Tasmota firmware. This machine might be the same **Server Machine**, though I would not recommend it.

!!! failure "Security notice" Private keys, and in particular the CA private key should reside on a secure, possibly air-gapped system. Securing your CA and procedures for managing private keys exceeds the scope of this guide, but we assume you follow best security practices.

There are several figures below containing command sequences that need to be executed in a POSIX shell. The intention is that text in the figure windows will be selected and copied, then pasted into a terminal window. These commands will not work if pasted into a Windows command prompt.

### Linux and Windows

The description below is written mainly from the perspective of someone using a Linux OS. Information is also provided for those working on a Windows OS, but a Linux command shell (e.g. `sh` or `bash`) is assumed for much of the work. Cygwin is a good choice for this purpose. It's not impossible to do perform these tasks in native Windows without a POSIX shell, although that is beyond the scope of this document.

A Cygwin installation should include the git package (Devel category) and openssl package (Net category). Additional packages will required as discussed later if BearSSL is to be installed.

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
Windows users may have trouble running EasyRSA in natively. If that happens, it's also possible to install Cygwin, and run it from a Cygwin terminal window. 
One note of caution: The `easyrsa` shell script may wind up with the wrong line endings if git is not configured to checkout line endings "as is". When this happens, the shell script will not run in Cygwin, and this problem may be fixed by using the `tr` program to delete carriage returns in the script file:
```
mv easyrsa tmprsa
tr -d '\r' <tmprsa >easyrsa
```

#### 1.2.  Define your certificate information

The commands below may be copied and pasted into a terminal window, then the resulting file, `vars` edited as appropriate.

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

This creates a configuration file named `vars` -- the default file which the `easyrsa` shell script looks for.

If the configuration is to be changed there are two options. First, `vars` can simply be edited to reflect the new configuration. 
However, if multiple configurations are often used, it may be easier to use a different file for each configuation, and the configuration specified on the command line.
For example, to use a configuration file named `vars3`, the command would look like this (the config file spec must come before other arguments):

```
./easyrsa --vars=./vars3 <remaining arguments>
```

Note that the file is specified as `./<filename>`, not `<filename>`. This required because the specified file will be sourced in the EasyRSA shell script, and it's assumed that the current directory is not part of the search path (that would be a security concern).

#### 1.3. Initialize and generate the CA and the server certificates:
When generating the server (aka broker) certificate, it is crucial that the Common Name (CN) be set correctly. Failing to do this will result in Tasmota devices refusing to make TLS connections to the server.

Each Tasmota device needs to be configured with the host name of the server. This is done via the `MQTT_HOST` macro in `user_config_override.h`, and/or in the device's MQTT Configuration web page. The host name string must meet two requirements:
- The Tasmota device must be able to resolve the name, which might require access to a DNS server.
- This string must match the Common Name (CN) in the broker's certificate -- exactly.

Consider a situation where the device is running on an isolated WiFi network with no access to a DNS server. In this case, it may be necessary to specify the MQTT Host as a numeric IP address (e.g. `192.168.2.3`). In this example, the CN in the host's certificate would need to be the string `192.168.2.3`, or the device won't trust the server and won't connect.

To generate the root CA and server certificates, issue these commands. This example assumes the server's hostname and server certificate CN is `mqtt.myorg.com`.

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

This example shows editing of the `vars` file, although a second configuration file could be created for EC keys as explained previously.

```
sed -i '/^set_var\ EASYRSA_ALGO/ s/rsa/ec/' vars
```

#### 1.5. Copy the following files to the **Server Machine**
```
./pki/ca.crt --> CA certificate file
./pki/issued/mqtt.myorg.com.crt --> Server certificate file
./pki/private/mqtt.myorg.com.key --> Server private Key file
```

#### 1.6. (Optional step for full certificate validation)
- Copy `./pki/ca.crt`to your **Compiling Machine**
- Install and build BearSSL (see below for help with building BearSSL on Windows machines).
```
git clone https://www.bearssl.org/git/BearSSL
cd BearSSL
make tools
```
- Convert the root certificate into a format suitable for inclusion in the Tasmota build. This be will easier if the `brssl` (`brssl.exe` in Cygwin) executable is copied into the the `easyrsa3` directory first. Then, these two commands may be executed from the `easyrsa3` directory verbatim to generate the required header files.
 
```
./brssl ta pki/ca.crt | sed -e 's/TA0/PROGMEM TA0/' -e '/br_x509/,+999 d' > local_ca_data.h
./brssl ta pki/ca.crt | sed -e '1,/br_x509/ d' -e '/};/,+999 d' >local_ca_descriptor.h
```

### 2. Configure your Tasmotabuild (on **Compiling Machine**)
Refer to your preferred way to custom compile Tasmota.
Modify the default configuration following one of 2.1 or 2.2 solutions (Easier or Advanced):

#### 2.1. Easier: Using fingerprint validation

Add the following to `user_config_override.h`:

```
#ifndef USE_MQTT_TLS
#define USE_MQTT_TLS
//  #define USE_MQTT_TLS_CA_CERT               // Force full CA validation instead of fingerprints, slower, but simpler to use.  (+2.2k code, +1.9k mem during connection handshake)
#define USE_MQTT_AWS_IOT                       // This includes the LetsEncrypt CA in tasmota_ca.ino for verifying server certificates
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
#define USE_MQTT_AWS_IOT                       // This will include LetsEncrypt CA, as well as our CA, in tasmota_ca.ino for verifying server certificates
#define USE_MQTT_TLS_FORCE_EC_CIPHER           // Force Elliptic Curve cipher (higher security) required by some servers (automatically enabled with USE_MQTT_AWS_IOT) (+11.4k code, +0.4k mem)
#define INCLUDE_LOCAL_CA_CERT
#endif
```
Copy or move the files created in step 1.6 above (`local_ca_data.h` and `local_ca_descriptor.h`) to the `$TASMOTAROOT/tasmota` directory. If desired, the two built-in certificates for Let's Encrypt and Amazon AWS may be omitted from the build by defining these macros in `user_config_overrirde.h`:

```
#define OMIT_LETS_ENCRYPT_CERT
#define OMIT_AWS_CERT
```

### 3. Build your Tasmota Binaries, flash and configure your devices

Initially at least, build the binaries with the web server enabled. Pull up the web page on each device and check the configuration. 
In particular check the following settings.

- WiFi Host Name
- MQTT Host -- must be resolvable, and match the Common Name on the server's certificate
- MQTT Port -- this often does not come up as defined in the configuration file, and must be changed to 8883
- MQTT Topic

### 4. Configure your network

The Common Name (CN) in the server's certificate will either be a resolvable name (like `mqtt.myorg.com`), or the IP address 
string for the server (e.g. `192.168.2.3`). The host name assigned to the server must match this CN, unless an IP address string is used in the server certificate CN, in which case the host name can be anything. These next two items are only necessary where the CN is not an IP address string.

- Configure your router to resolve the Tasmota device's MQTT Host Name (e.g. `mqtt.myorg.com`) to your **Server Machine**.
- Configure your **Server Machine** hostname to the same name (e.g. `mqtt.myorg.com`).

In all cases, check these Tasmota guidelines about [Securing your IoT](Securing-your-IoT-from-hacking).

### 5. Install and configure Mosquitto on your server
Install Mosquitto

#### Linux

```
sudo apt-get install Mosquitto
```

#### Windows

Download the Windows installer from `https://www.mosquitto.org/` and run it. Mosquitto may be installed either as a program or service. The main difference is in how mosquitto is started. As a program, it must be started by a user every time, but as a service it can be automatically started by the OS during boot.

#### 5.1 Configuration

Copy the files from **CA Machine** to the following locations on a Linux server machine:

```
/etc/mosquitto/ca_certificates/ca.crt
/etc/mosquitto/certs/mqtt.myorg.com.crt
/etc/mosquitto/certs/mqtt.myorg.com.key
```

and to here on a Windows server machine (requires Administrative priveledges):

```
C:\Program Files\mosquitto\ca.crt
C:\Program Files\mosquitto\mqtt.myorg.com.crt
C:\Program Files\mosquitto\mqtt.myorg.com.key
```
On Windows, if preferred, subdirectories within the mosquitto directory can be created to hold the certificates. That might make it easier to restrict access to a private key in plain text form.

There are two options for configuring the server's private key. It can be converted to plain text form (`.pem`) as shown below, or left encrypted (`.key`). If left encrypted, the password will need to be entered by hand every time the server is started. This will not be feasible if mosquitto is to be run as a service. Security risks can be minimzed by setting tight permissions on the files, as shown below.

Convert the private key to plain text format like this:

```openssl rsa -in mqtt.myorg.com.key -out mqtt.myorg.com.pem```

#### File Permissions: Linux

Ensure the files have owner `mosquitto:mosquitto` and permissions `-r--------`. Also ensure `ca_certificates` and `certs` directories have owner `mosquitto:mosquitto` and permissions `dr-x------`.

#### File Permissions: Windows

It should be possible to configure permissions so that only the `SYSTEM` user can read the private key file, and when mosquitto is run as a service, it runs under the `SYSTEM` account. How to do this is currently beyond the scope of this guide.

#### 5.3 Configure and start the server

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

On a Windows machine, the configuration file is `C:\Program Files\mosquitto\mosquitto.conf`, and the paths to the certificate and key files should be set accordingly.

To start Mosquitto on Linux:

```
sudo service mosquitto Start
```

To start Mosquitto on Windows, either use the services snap-in (`services.msc`), or from an Administrator command prompt:

```
net start mosquitto
```

### 6. - Generate and configure certificates for your devices

!!! failure "Repeated step" Repet the following 6.x steps once for every device, changing tasmota_name for each device. You will be prompted for a private key password for each device. 
After entering the new password (twice for verification), you will also be prompted for the private key password of the root CA certificate.

#### 6.1 Generate the client certificates

```
export TAS=tasmota_name
# Request tasmota certs (will ask for password)
./easyrsa gen-req $TAS
# Sign certificate for Tasmota
./easyrsa sign-req tasmota $TAS
```
#### 6.2 Convert certificate keys to Tasmota compatible format

The new certificate must be converted to Tasmota commands which can be entered into the device's web console. 
Credentials are composed of two distinct parts:

- Private Key - this is the secret that will allow your device to prove its identity, and consists of 32 bytes (256 bits). Consider this as sensitive as a password.
- Public Key - this allows others to encrypt messages which can only be decrypted with the Private Key, and contains 256 bytes (2048 bits).

Both of these must be loaded into flash in the Tasmota device. This is done by entering `TLSKey` commands in the device's web console. 

This step must be performed on the machine where the device certificates were created, from within the `easyrsa3` directory. The following commands will generate a shell script, `gen-tlskeys`, which will perform the necessary work (that's easier than copying and pasting the entire command set for each device.)

```
cat >gen-tlskeys <<'EOF'
# Decrypt private key (will ask for a password), then extract TLSKey1 (private) and TLSKey2 (public) values
if [ "$#" -ne 1 ] ; then
    echo "Usage: gen-tasmota-cert <device-certificate-name>"
    exit 1
fi
if [ ! -f pki/private/$1.key ] ; then
    echo "Could not find private key file pki/private/$1.key"
    exit 1
fi
if [ ! -f pki/issued/$1.crt ] ; then
    echo "Could not find public key file pki/issued/$1.crt"
    exit 1
fi
openssl ec -in ./pki/private/$1.key -outform PEM | \
openssl ec -inform PEM -outform DER | openssl asn1parse -inform DER | \
head -3 | tail -1 | awk -F':' '{ print $4 }' | xxd -r -p | base64 | \
echo -e "----\n\nCopy the following commands and paste them into the device's web console\n\n---\n\nTLSKey1 $(</dev/stdin)" && \
openssl x509 -in ./pki/issued/$1.crt -inform PEM -outform DER | \
openssl base64 -e -in - -A|echo -e "\n\nTlskey2 $(</dev/stdin)"
EOF
chmod 755 gen-tlskeys
```

Now, for each device, simply enter this command. The argument (`$TAS`) is the name of the device's certificate. Output will consist of two Tasmota device commands which must be copied and pasted into the device's web console.

```
./gen-tlskeys $TAS
```

The `TLSKey1` command contains the device's private key in plain text (unencrypted) format, so don't keep it around any longer than necessary.

#### 6.3 Access your device's web console and configure the keys.

Run the `TLSKey1` and `TLSKey2` commands as obtained in the previous output. Open each of the files, copy the text and paste it into the web console.

#### 6.4 Verify the device is connecting as expected.

## Building BearSSL on Windows machines

This can be a challenging task, and a method to accomplish this through Cygwin is described here. Cygwin also provides an alternative if problems are encountered in trying to run EasyRSA in a native Windows environment.

Here are the issues that need to be fixed before BearSSL will build under Cygwin. Many of them are related to the differences between Windows and Linux when it comes to programming socket I/O.
- Commands for compiling and linking are `gcc`, not `cc`
- Additional compiler flags are required to compile and link socket I/O code
- A Windows socket library (`libws2_32`) must be included in the link edit step when building the brssl executable
- A local implementation of a missing function (`inet_ntop`) must be added to the build

The current git master branch of BearSSL is required -- the 0.6 version available as a gzipped tar archive will not work. An up-to-date version of gcc in Cygwin is also required -- old versions may experience an internal compiler error when building BearSSL.

Start by installing Cygwin, selecting the `gcc` and `make` packages in the `Devel` category, and the `openssl` package in the `Net` category.

Open a Cygwin terminal window and change to the directory where BearSSL source was unpacked. To access a Windows letter drive such as `F:\somepath` in Cygwin, use the path `/cygdrive/f/somepath`. 

All of the necessary patches are easily made by copying and pasting this set of commands into the Cygwin terminal window. This will create files needed to patch the BearSSL build. First, change to the top level BearSSL directory in the Cytwin window. After selecting the text in the window below, click in the Cygwin window and hit Control-Insert to paste, or right-click in the window and select Paste from the drop-down menu. You may need to hit Enter after doing this.

```
cat >edit-Unix-mk.sed <<'EOF'
1 a \# Modified for building on Cygwin systems
/^CC.*=.*cc/ c \CC = gcc
/^LDDLL.*=.*cc/ c \LDDLL = gcc
/^LD.*=.*cc/ c \LD = gcc
/^CFLAGS.*=/ s/-fPIC/-DWINVER=0x0501 -DEWOULDBLOCK=EAGAIN/
/^LDOUT.*=/ a \BRSSL_EXT_LIBS = -lws2_32
EOF

cat >extraTargets <<'EOF'

$(OBJDIR)$Pinet_ntop$O: tools$Pinet_ntop.c $(HEADERSTOOLS)
	$(CC) $(CFLAGS) $(INCFLAGS) $(CCOUT)$(OBJDIR)$Pinet_ntop$O tools$Pinet_ntop.c

$(BRSSL): $(BEARSSLLIB) $(OBJBRSSL)
	$(LD) $(LDFLAGS) $(LDOUT)$(BRSSL) $(OBJBRSSL) $(BEARSSLLIB) $(BRSSL_EXT_LIBS)
EOF

cat >tools/inet_ntop.c <<'EOF'
#ifdef _WIN32
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <errno.h>
#include <signal.h>
#include <winsock2.h>
#include <ws2tcpip.h>
const char *inet_ntop(int af, const void *src, char *dst, int cnt)
{
        if (af == AF_INET)
        {
                struct sockaddr_in in;
                memset(&in, 0, sizeof(in));
                in.sin_family = AF_INET;
                memcpy(&in.sin_addr, src, sizeof(struct in_addr));
                getnameinfo((struct sockaddr *)&in, sizeof(struct
sockaddr_in), dst, cnt, NULL, 0, NI_NUMERICHOST);
                return dst;
        }
        else if (af == AF_INET6)
        {
                struct sockaddr_in6 in;
                memset(&in, 0, sizeof(in));
                in.sin6_family = AF_INET6;
                memcpy(&in.sin6_addr, src, sizeof(struct in_addr6));
                getnameinfo((struct sockaddr *)&in, sizeof(struct
sockaddr_in6), dst, cnt, NULL, 0, NI_NUMERICHOST);
                return dst;
        }
        return NULL;
}
#endif
EOF

cat >patch-bearssl <<'EOF'
sed -f edit-Unix-mk.sed conf/Unix.mk >conf/Cygwin.mk
sed -e '/^OBJBRSSL = / a \ $(OBJDIR)$Pinet_ntop$O \\' mk/Rules.mk >Rules.tmp
cat Rules.tmp extraTargets >mk/Rules.mk
rm -f Rules.tmp
cp -f tools/brssl.h brssl.tmp
sed -e '/^#include.*bearssl\.h/ a \const char *inet_ntop(int,const void*,char*,int);' brssl.tmp >tools/brssl.h
rm -f brssl.tmp
EOF
chmod 755 patch-bearssl
```

Check to make sure that the file `extraTargets` contains a leading tab character, not spaces on the `$(CC)` and `$(LD)` lines.
Executing the following commands should get the job done:

```
./patch-bearssl
make tools CONF=Cygwin
```

The resulting `brssl.exe` file will be found in the `build` directory.
