## `crypto` module

Module `import crypto` support for common cryptographic algorithms.  
  
Cryptographic operations are heavy tasks for an embedded platform and especially do enlarge the size of the firmware binaries. That's why not every supported cryptographic function is part of Tasmota's standard builds.  
Keep in mind, that some of the newer cryptographic methods are not finalized standardized RFCs of the [IETF](https://www.ietf.org/process/rfcs/).  
Tasmota's crypto functionality is based on BearSSL, which has no support for hardware acceleration but a small memory footprint and allows usage on the ESP8266 in a reasonable way in some areas (of course not in Berry). Very few Berry crypto functions use reference C implementations.  
  
It is hard to keep the naming schemes 100% consistent and you will find different names for the same things every now and then in our code and documentation.  
In 99.9% of the occurrences:  
`iv` aka initialization vector == `nonce` aka number used once  
`mac` aka message authentication code == tag  (== `MIC` aka message integrity code)  
`private_key` == `secret_key`  
  
On the other hand, similar names may have vastly different meanings or at least different underlying implementations:  
Elliptic Curve `C25519` != `EdDSA25519`  
`ssh-chacha20-poly1305@openssh` != `chacha20-poly1305-aead`
  
Currently supported algorithms:

- AES CTR 256 bits - requires `#define USE_BERRY_CRYPTO_AES_CTR`
- AES GCM 256 bits
- AES CCM 128 or 256 bits
- AES CBC 128 bits
- Chacha20-Poly1305 - requires `#define USE_BERRY_CRYPTO_CHACHA_POLY`
- Elliptic Curve C25519 - requires `#define USE_BERRY_CRYPTO_EC_C25519`
- Elliptic Curve P256 (secp256r1) - requires `#define USE_BERRY_CRYPTO_EC_P256`
- EdDSA25519 - requires `#define USE_BERRY_CRYPTO_ED25519`
- HKDF key derivation with HMAC SHA256 - requires `#define USE_BERRY_CRYPTO_HKDF_SHA256`
- HMAC SHA256
- MD5
- PKKDF2 with HMAC SHA256 key derivation - requires `#define USE_BERRY_CRYPTO_PBKDF2_HMAC_SHA256`
- SHA256
- JWT RS256 (RSASSA-PKCS1-v1_5 with SHA256) - requires `#define USE_BERRY_CRYPTO_RSA`

### `crypto.AES_CTR` class

Encrypt and decrypt, using AES CTR (Counter mode) with 256 bits keys.

General Function|Parameters and details
:---|:---
init<a class="cmnd" id="aes_ctr_init"></a>|`AES_CTR.init(secret_key:bytes(32)) -> instance`<br>Initialise AES CTR instance with `secret_key` (256 bits) and `iv` (initialization vector or nonce, 96 bits)
encrypt<a class="cmnd" id="aes_ctr_encrypt"></a>|`encrypt(ciphertext:bytes, iv:bytes(12), cc:int) -> bytes`<br>Encrypt the ciphertext. The `iv` (Initialization Vector) must be 12 bytes, it can be the concatenation of 4 bytes Nonce and 8 bytes iv. `cc` is the counter (4 bytes) incremented for each block of 16 bytes.<BR>Note: the last counter value is not returned, so it is advised to encrypt all data at once.
decrypt<a class="cmnd" id="aes_ctr_decrypt"></a>|`decrypt(ciphertext:bytes, iv:bytes(12), cc:int) -> bytes`<br>Identical to `encrypt` above.

Test vectors from <https://datatracker.ietf.org/doc/html/rfc4231>

``` berry
# Test case from https://www.ietf.org/rfc/rfc3686.txt
import crypto
key = bytes("F6D66D6BD52D59BB0796365879EFF886C66DD51A5B6A99744B50590C87A23884")
iv = bytes("00FAAC24C1585EF15A43D875")
cc = 0x000001
aes = crypto.AES_CTR(key)
plain = bytes("000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F")
cipher = aes.encrypt(plain, iv, cc)
assert(cipher == bytes("F05E231B3894612C49EE000B804EB2A9B8306B508F839D6A5530831D9344AF1C"))
plain2 = aes.decrypt(cipher, iv, cc)
assert(plain == plain2)
```

### `crypto.AES_GCM` class

Encrypt, decrypt and verify, using AES GCM (Galois Counter Mode) with 256 bits keys.

General Function|Parameters and details
:---|:---
init<a class="cmnd" id="aes_gcm_init"></a>|`AES_GCM.init(secret_key:bytes(32), iv:bytes(12)) -> instance`<br>Initialise AES GCM instance with `secret_key` (256 bits) and `iv` (initialization vector or nonce, 96 bits)
encrypt<a class="cmnd" id="aes_gcm_encrypt"></a>|`encrypt(ciphertext:bytes) -> bytes`<br>Encrypt the ciphertext. Can be called multiple times, the tag is updated accordingly
decrypt<a class="cmnd" id="aes_gcm_decrypt"></a>|`decrypt(ciphertext:bytes) -> bytes`<br>Decrypt the ciphertext. Can be called multiple times, the tag is updated accordingly
tag<a class="cmnd" id="aes_gcm_tag"></a>|`tag() -> bytes`<br>Compute the verification tag for the object encrypted or decrypted (128 bits).

Example taken from <https://wizardforcel.gitbooks.io/practical-cryptography-for-developers-book/content/symmetric-key-ciphers/aes-encrypt-decrypt-examples.html>

``` berry
import crypto

key = bytes('233f8ce4ac6aa125927ccd98af5750d08c9c61d98a3f5d43cbf096b4caaebe80')
ciphertext = bytes('1334cd5d487f7f47924187c94424a2079656838e063e5521e7779e441aa513de268550a89917fbfb0492fc')
iv = bytes('2f3849399c60cb04b923bd33265b81c7')
authTag = bytes('af453a410d142bc6f926c0f3bc776390')

# decrypt ciphertext with key and iv
aes = crypto.AES_GCM(key, iv)
plaintext = aes.decrypt(ciphertext)
print(plaintext.asstring())
# 'Message for AES-256-GCM + Scrypt encryption'

tag = aes.tag()
print(tag == authTag)
# true
```

### `crypto.AES_CCM` class

Encrypt and decrypt, using AES CCM with 256 bits keys.

General Function|Parameters and details
:---|:---
init<a class="cmnd" id="aes_ccm_init"></a>|`AES_CCM.init(secret_key:bytes(16 or 32), iv:bytes(7..13), aad:bytes(), data_len:int, tag_len:int) -> instance`<br>Initialise AES CCM instance with `secret_key` (128 or 256 bits), `iv` (initialization vector or nonce, 56 to 104 bits), `aad` is the associated data, `data_len` is the size of the payload that you need to announce in advance, `tag_len` is the lenght in bytes of the tag (normally 16).
encrypt<a class="cmnd" id="aes_ccm_encrypt"></a>|`encrypt(ciphertext:bytes) -> bytes`<br>Encrypt the ciphertext.
decrypt<a class="cmnd" id="aes_ccm_decrypt"></a>|`decrypt(ciphertext:bytes) -> bytes`<br>Identical to `encrypt` above.
tag<a class="cmnd" id="aes_ccm_tag"></a>|`tag() -> bytes`<br>Returns the tag or MIC.
decrypt1<a class="cmnd" id="aes_ccm_decrypt1"></a>|`AES_CCM.decrypt1(secret_key:bytes(16 or 32), iv:bytes(), iv_start:int, iv_len:int (7..13), aad:bytes(), aad_start:int, aad_len:int, data:bytes(), data_start:int, data_len:int, tag:bytes(), tag_start:int, tag_len:int (4..16)) -> bool (true if tag matches)`<br>Decrypt in a single call, avoiding any object allocation
encrypt1<a class="cmnd" id="aes_ccm_encrypt1"></a>|`AES_CCM.encrypt1(secret_key:bytes(16 or 32), iv:bytes(), iv_start:int, iv_len:int (7..13), aad:bytes(), aad_start:int, aad_len:int, data:bytes(), data_start:int, data_len:int, tag:bytes(), tag_start:int, tag_len:int (4..16)) -> bool (always true)`<br>Decrypt in a single call, avoiding any object allocation. Data is encrypted in-place and Tag is changed in the buffer.

Example from Matter:

```berry
# raw_in is the received frame
raw_in = bytes("00A0DE009A5E3D0F3E85246C0EB1AA630A99042B82EC903483E26A4148C8AC909B12EF8CDB6B144493ABD6278EDBA8859C9B2C")

payload_idx = 8     # unencrypted header is 8 bytes
tag_len = 16        # MIC is 16 bytes

p = raw[payload_idx .. -tag_len - 1]   # payload
mic = raw[-tag_len .. ]                # MIC
a = raw[0 .. payload_idx - 1]          # AAD

i2r = bytes("92027B9F0DBC82491D4C3B3AFA5F2DEB")   # key
# p   = bytes("3E85246C0EB1AA630A99042B82EC903483E26A4148C8AC909B12EF")
# a 	= bytes("00A0DE009A5E3D0F")
n   = bytes("009A5E3D0F0000000000000000")         # nonce / IV
# mic = bytes("8CDB6B144493ABD6278EDBA8859C9B2C")

# expected cleartext
clr = bytes("05024FF601001536001724020024031D2404031818290324FF0118")

# method 1 - with distinct calls
import crypto
aes = crypto.AES_CCM(i2r, n, a, size(p), 16)
cleartext = aes.decrypt(p)
tag = aes.tag()

assert(cleartext == clr)
assert(tag == mic)

# method 2 - single call
raw = raw_in.copy()      # copy first if we want to keep the encrypted version
var ret = crypto.AES_CCM.decrypt1(i2r, n, 0, size(n), raw, 0, payload_idx, raw, payload_idx, size(raw) - payload_idx - tag_len, raw, size(raw) - tag_len, tag_len)

assert(ret)
assert(raw[payload_idx .. -tag_len - 1] == clr)
```

### `crypto.AES_CBC` class

Encrypt and decrypt, using AES CBC with 128 bits keys.

General Function|Parameters and details
:---|:---
decrypt1<a class="cmnd" id="aes_cbc_decrypt1"></a>|`AES_CBC.decrypt1(secret_key:bytes(16), iv:bytes(16), data:bytes(n*16)) -> bool (always true)`<br>Decrypt in a single call in-place, avoiding any object allocation
encrypt1<a class="cmnd" id="aes_cbc_encrypt1"></a>|`AES_CBC.encrypt1(secret_key:bytes(16), iv:bytes(16), data:bytes(n*16)) -> bool (always true)`<br>Decrypt in a single call, avoiding any object allocation. Data is encrypted in-place and IV is changed in the buffer too.
  
Example:

```berry
var b = bytes().fromstring("hello world_____") # 16-byte aligned
var key = bytes().fromstring("1122334455667788") # 16 bytes
var iv = bytes().fromstring("8877665544332211") # 16 bytes

print("data:",b.asstring()) # "hello world_____"
import crypto
aes = crypto.AES_CBC()
aes.encrypt1(key, iv, b)
print("cipher:",b)
iv = bytes().fromstring("8877665544332211")
aes.decrypt1(key, iv, b)
print("decrypted data:",b.asstring()) # "hello world_____"
```

### `crypto.CHACH20_POLY1305` class

Encrypt and decrypt using stream cipher ChaCha20 and compute MAC (= message authentication code aka integrity tag) using Poly1305.  
The reason to split this module into relatively low level functions is to have support for ssh-chacha20-poly1305@openssh. Thus the implementation for Chacha20-Poly1305-AEAD has to be completed in Berry.  
 
General Function|Parameters and details
:---|:---
chacha_run|`CHACH20_POLY1305.chacha_run(secret_key:bytes(32),iv:bytes(12),cipher:bytes(n*16),)-> int counter`<br>En/Decrypt in a single call in-place, returns counter
poly_run|`CHACH20_POLY1305.poly_run(data:bytes(),poly_key:bytes(32),)-> tag:bytes(16)`<br>Computes tag on (encrypted) data.
  
Example:
```berry
# helper function to support Chacha20-POLY1305-AEAD
def pad16(data)
    # pad to 16 bytes
    if (size(data) % 16) == 0
        return data
    else
        return data + bytes(-(16 - (size(data) % 16)))
    end
end

# https://boringssl.googlesource.com/boringssl/+/2e2a226ac9201ac411a84b5e79ac3a7333d8e1c9/crypto/cipher_extra/test/chacha20_poly1305_tests.txt
import crypto
c = crypto.CHACHA20_POLY1305()
key = bytes("808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9f")
iv =bytes("070000004041424344454647")
aad= bytes("50515253c0c1c2c3c4c5c6c7")
_msg = "Ladies and Gentlemen of the class of '99: If I could offer you only one tip for the future, sunscreen would be it."
msg = bytes().fromstring(_msg) # make bytes
ct = bytes("d31a8d34648e60db7b86afbc53ef7ec2a4aded51296e08fea9e2b5a736ee62d63dbea45e8ca9671282fafb69da92728b1a71de0a9e060b2905d6a5b67ecd3b3692ddbd7f2d778b8c9803aee328091b58fab324e4fad675945585808b4831d7bc3ff4def08e4b7a9de576d26586cec64b6116") # reference crypto ciphertext for comparison
tag = bytes("1ae10b594f09e26a7e902ecbd0600691")
#create polykey
poly_key = bytes(-32)
c.chacha_run(key,iv,0,poly_key) # create with zero'ed bytes object and counter value of 0
sizes = bytes(-16)
sizes.seti(0,size(aad),4) # in reality this is uint64 and not only uint32
sizes.seti(8,size(ct),4) # same here
_tag = c.poly_run(pad16(aad)+pad16(ct)+sizes,poly_key) # for AEAD standard data must be padded to 16 and sizes bytes are added
# encrypt
c.chacha_run(key,iv,1,msg) # now run with counter value of 1
assert(_tag == tag)
assert(ct == msg)

# now decrypt - reuse aad and sizes
 _newtag = c.poly_run(pad16(aad)+pad16(msg)+sizes,poly_key) # first run poly on still encrypted data
c.chacha_run(key,iv,1,msg) # then decrypt
assert(_newtag==_tag)
assert(msg.asstring()==_msg)

# https://datatracker.ietf.org/doc/draft-ietf-sshm-chacha20-poly1305/01/
# special needs for SSH:
# chacha run over length and data with different keys
# poly run over whole encrypted material with key used for data

import crypto
c = crypto.CHACHA20_POLY1305()
keys = bytes("8bbff6855fc102338c373e73aac0c914f076a905b2444a32eecaffeae22becc5e9b7a7a5825a8249346ec1c28301cf394543fc7569887d76e168f37562ac0740")
packet = bytes("2c3ecce4a5bc05895bf07a7ba956b6c68829ac7c83b780b7000ecde745afc705bbc378ce03a280236b87b53bed5839662302b164b6286a48cd1e097138e3cb909b8b2b829dd18d2a35ff82d995349e855bf02c298ef775f2d1a7e8b8")
iv = bytes("000000000000000000000007") # seq number
k_header = keys[-32..]
k_main = keys[0..31]

poly_key = bytes(-32)
c.chacha_run(k_main,iv,0,poly_key)
given_mac = packet[-16..]
calculated_mac = c.poly_run(packet[0..-17],poly_key)
assert(calculated_mac == given_mac)

data = packet[4..-17]
length = packet[0..3]
c.chacha_run(k_header,iv,0,length) # use upper 32 bytes of key material
assert(length == bytes("00000048"))
counter = c.chacha_run(k_main, iv, 1, data) # lower bytes of key for packet
# assert(valid == true)
assert(length + data == bytes("00000048065e00000000000000384c6f72656d20697073756d20646f6c6f722073697420616d65742c20636f6e7365637465747572206164697069736963696e6720656c69744e43e804dc6c"))

# reverse it - now encrypt a packet

raw_packet = bytes("00000048065e00000000000000384c6f72656d20697073756d20646f6c6f722073697420616d65742c20636f6e7365637465747572206164697069736963696e6720656c69744e43e804dc6c")
length = raw_packet[0..3]
c.chacha_run(k_header,iv,0,length) # use upper 32 bytes of key material

data = raw_packet[4..]
counter = c.chacha_run(k_main, iv, 1, data) # lower bytes of key for packet
enc_packet = length + data

poly_key = bytes(-32)
c.chacha_run(k_main,iv,0,poly_key)
mac = c.poly_run(enc_packet,poly_key)
enc_packet .. mac
assert(enc_packet == packet)

```

### `crypto.EC_C25519` class

Provides Elliptic Curve C25519 Diffie-Hellman key agreement. Requires `#define USE_BERRY_CRYPTO_EC_C25519`

General Function|Parameters and details
:---|:---
public_key<a class="cmnd" id="ec_c25519_public_key"></a>|`crypto.EC_C25519().public_key(secret_key:bytes(32)) -> bytes(32)`<br>Computes the public key given a random private key.
shared_key<a class="cmnd" id="ec_c25519_shared_key"></a>|`crypto.EC_C25519().shared_key(our_private_key:bytes(32), their_public_key:bytes(32)) -> bytes(32)`<br>Compute a shared key (Diffie-Hellman) using our private key and the other party's public key. The other party will compute the same shared key using their private key and our pubic key.

Example from test vectors <https://www.rfc-editor.org/rfc/rfc7748>:

``` berry
import crypto

# alice side
alice_priv_key = bytes("77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a")
alice_pub_key = bytes("8520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a")
assert(crypto.EC_C25519().public_key(alice_priv_key) == alice_pub_key)

# bob side
bob_priv_key = bytes("5dab087e624a8a4b79e17f8b83800ee66f3bb1292618b6fd1c2f8b27ff88e0eb")
bob_pub_key = bytes("de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b4f")
assert(crypto.EC_C25519().public_key(bob_priv_key) == bob_pub_key)

# shared key computed by alice
ref_shared_key = bytes("4a5d9d5ba4ce2de1728e3bf480350f25e07e21c947d19e3376f09b3c1e161742")
alice_shared_key = crypto.EC_C25519().shared_key(alice_priv_key, bob_pub_key)
bob_shared_key = crypto.EC_C25519().shared_key(bob_priv_key, alice_pub_key)
assert(alice_shared_key == ref_shared_key)
assert(bob_shared_key == ref_shared_key)
```

### `crypto.EC_P256` class

Provides Elliptic Curve Prime256 (secp256r1) Diffie-Hellman key agreement and various functions on P256 curve. Requires `#define USE_BERRY_CRYPTO_EC_P256`

General Function|Parameters and details
:---|:---
public_key<a class="cmnd" id="ec_p256_public_key"></a>|`crypto.EC_P256().public_key(secret_key:bytes(32)) -> bytes(65)`<br>Computes the public key given a random private key. The result is uncompressed point coordinates starting with 0x04 (65 bytes in total)
shared_key<a class="cmnd" id="ec_p256_shared_key"></a>|`crypto.EC_P256().shared_key(our_private_key:bytes(32), their_public_key:bytes(65)) -> bytes(32)`<br>Compute a shared key (Diffie-Hellman) using our private key and the other party's public key. The other party will compute the same shared key using their private key and our pubic key.<BR>The result is actually the X coordinate of the multiplication of the points coordinates of the public key, and a large number (private key)

Specific Functions|Parameters and details
:---|:---
mod<a class="cmnd" id="ec_p256_mod"></a>|`crypto.EC_P256().mod(data:bytes()) -> bytes(32)`<br>Computes the modulus of an arbitrary large number. The modulus is done towards the order of the curve.
neg<a class="cmnd" id="ec_p256_neg"></a>|`crypto.EC_P256().neg(data:bytes(32)) -> bytes(32)`<br>`-x mod p` or `p - x` if `x` is lower than `p`<br>Computes the opposite (negate) of a number modulus the order of the curve (it's actuall modulus - data).
mul<a class="cmnd" id="ec_p256_mul"></a>|`crypto.EC_P256().mul(x:bytes(), A:bytes(65)) -> bytes(65)`<br>`x * A`<br>Computes multiplication of a number and a point on the curve.<br>`x` needs to be smaller than `p`, use `mod()` if not sure<br>The function checks that the point `A` is on the curve, or raises an error
muladd<a class="cmnd" id="ec_p256_muladd"></a>|`crypto.EC_P256().muladd(x:bytes(), A:bytes(65), y:bytes(), B:bytes(65)) -> bytes(65)`<br>`x * A + y * B`<br>`x` and `y` need to be smaller than `p`, use `mod()` if not sure<br>The function checks that the points `A` and `B` are on the curve, or raises an error<br>If `B` is empty `bytes()`, the Generator `P` of the curve is used instead.

Example:

``` berry
import crypto
priv = bytes("f502fb911d746b77f4438c674e1c43650b68285dfcc0583c49cd6ed88f0fbb58")
p = crypto.EC_P256()
pub = p.public_key(priv)
assert(pub == bytes("04F94C20D682DA29B7E99985D8DBA6ABEA9051D16508742899835098B1113D3D749466644C47B559DB184556C1733C33E5788AE250B8FB45F29D4CF48FF752C1ED"))

import crypto
priv = bytes("4E832960415F2B5FA2B1FDA75C1A8F3C84BAEB189EDC47211EF6D27A21FC0ED8")
p = crypto.EC_P256()
pub = p.public_key(priv)
assert(pub == bytes("042166AE4F89981472B7589B8D79B8F1244E2EEE6E0A737FFBFED2981DA3E193D6643317E054D2A924F2F56F1BF4BECA13192B27D8566AF379FBBF8615A223D899"))
print("x=",pub[1..32])
print("y=",pub[33..65])

import crypto
p = crypto.EC_P256()
priv_A = bytes("f502fb911d746b77f4438c674e1c43650b68285dfcc0583c49cd6ed88f0fbb58")
pub_A = bytes("04F94C20D682DA29B7E99985D8DBA6ABEA9051D16508742899835098B1113D3D749466644C47B559DB184556C1733C33E5788AE250B8FB45F29D4CF48FF752C1ED")
priv_B = bytes("4E832960415F2B5FA2B1FDA75C1A8F3C84BAEB189EDC47211EF6D27A21FC0ED8")
pub_B = bytes("042166AE4F89981472B7589B8D79B8F1244E2EEE6E0A737FFBFED2981DA3E193D6643317E054D2A924F2F56F1BF4BECA13192B27D8566AF379FBBF8615A223D899")

shared_1 = p.shared_key(priv_A, pub_B)
shared_2 = p.shared_key(priv_B, pub_A)
assert(shared_1 == shared_2)
```

### `crypto.ED25519` class

Edwards-Curve Digital Signature Algorithm (EdDSA) using the edwards25519 curve, more info in [RFC8032](https://datatracker.ietf.org/doc/html/rfc8032).

General Function|Parameters and details
:---|:---
secret_key|`crypto.EC_C25519().secret_key(seed:bytes(32)) -> secret_key:bytes(64)`<br>Computes the secret key given a random private key. As the public key is equal to the last 32 bytes, there is no extra function to get the public key. Example: public_key = secret_key[-32..]
sign|`crypto.EC_C25519().sign(message:bytes(), secret_key:bytes(64)) -> signature:bytes(64)`<br>Returns the signature of a message, signed with the secret key.
verify|`crypto.EC_C25519().verify((message:bytes(), signature:bytes(64), public_key:bytes(32) -> bool`<br>Verifies the the given signature of a message with a public key, returns success as boolean.

``` berry
import crypto
e = crypto.ED25519()
seed = bytes("9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60") # some randome bytes
secret_key=e.secret_key(seed)
message = bytes()
public_key = secret_key[-32..]
_public_key = bytes("d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a") # test data
assert(public_key == _public_key)
signature = e.sign(message, secret_key)
assert(signature == bytes("e5564300c360ac729086e2cc806e828a84877f1eb8e5d974d873e065224901555fb8821590a33bacc61e39701cf9b46bd25bf5f0595bbe24655141438e7a100b")) # test data
# now verify
assert(e.verify(message, signature, public_key)==true)
```


### `crypto.HKDF_SHA256` class

Provides HKDF using HMAC SHA256 key derivation. Turns 'ikm' (input keying material) of low entropy and creates a pseudo random key. Requires `#define USE_BERRY_CRYPTO_HKDF_SHA256`

General Function|Parameters and details
:---|:---
derive<a class="cmnd" id="aes_hkdf_sha256_derive"></a>|`crypto.HKDF_SHA256().derive(ikm:bytes(), salt:bytes(), info:bytes(), out_bytes:int) -> bytes(out_bytes)`<br>Computes a key derivation function<br>`ikm` is the input keying material, typically a password<br>`salt` can be empty<br>`info` can be empty and is used to create multiple derived keys<br>`out_bytes` indicates the number of bytes to generate (between 1 and 256)

Test vectors from <https://www.rfc-editor.org/rfc/rfc5869>

``` berry
import crypto

# Test Case 1
hk = crypto.HKDF_SHA256()
ikm = bytes("0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B")
salt = bytes("000102030405060708090A0B0C")
info = bytes("F0F1F2F3F4F5F6F7F8F9")
k = hk.derive(ikm, salt, info, 42)
assert(k == bytes("3CB25F25FAACD57A90434F64D0362F2A2D2D0A90CF1A5A4C5DB02D56ECC4C5BF34007208D5B887185865"))

# Test Case 2
hk = crypto.HKDF_SHA256()
ikm  = bytes("000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f")
salt = bytes("606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeaf")
info = bytes("b0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff")
k = hk.derive(ikm, salt, info, 82)
assert(k == bytes("b11e398dc80327a1c8e7f78c596a49344f012eda2d4efad8a050cc4c19afa97c59045a99cac7827271cb41c65e590e09da3275600c2f09b8367793a9aca3db71cc30c58179ec3e87c14c01d5c1f3434f1d87"))

# Test Case 3
hk = crypto.HKDF_SHA256()
ikm  = bytes("0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b")
salt = bytes()
info = bytes()
k = hk.derive(ikm, salt, info, 42)
assert(k == bytes("8da4e775a563c18f715f802a063c5a31b8a11f5c5ee1879ec3454e5f3c738d2d9d201395faa4b61a96c8"))
```

### `crypto.PBKDF2_HMAC_SHA256` class

Provides PBKDF2 using HMAC SHA256 key derivation. Turns a password into a hash.

General Function|Parameters and details
:---|:---
derive<a class="cmnd" id="aes_pbkdf2_hmac_sha256_derive"></a>|`crypto.PBKDF2_HMAC_SHA256().derive(password:bytes(), salt:bytes(), iterations:int, out_bytes:int) -> bytes(out_bytes)`<br>Computes a key derivation function<br>`password` is the input keying material<br>`salt` can be empty `bytes()`<br>`iterations` counts the number of iterations of HMAC, limited to 10000 to make computation short enough for ESP32<br>`out_bytes` indicates the number of bytes to generate (between 1 and 256)

Test vectors from <https://github.com/brycx/Test-Vector-Generation/blob/master/PBKDF2/pbkdf2-hmac-sha2-test-vectors.md>

``` berry
import crypto
pb = crypto.PBKDF2_HMAC_SHA256()

assert(pb.derive("password", "salt", 1, 20) == bytes('120fb6cffcf8b32c43e7225256c4f837a86548c9'))

assert(pb.derive("password", "salt", 2, 20) == bytes('ae4d0c95af6b46d32d0adff928f06dd02a303f8e'))

assert(pb.derive("password", "salt", 3, 20) == bytes('ad35240ac683febfaf3cd49d845473fbbbaa2437'))

assert(pb.derive("password", "salt", 4096, 20) == bytes('c5e478d59288c841aa530db6845c4c8d962893a0'))

assert(pb.derive("passwd", "salt", 1, 128) == bytes('55AC046E56E3089FEC1691C22544B605F94185216DDE0465E68B9D57C20DACBC49CA9CCCF179B645991664B39D77EF317C71B845B1E30BD509112041D3A19783C294E850150390E1160C34D62E9665D659AE49D314510FC98274CC79681968104B8F89237E69B2D549111868658BE62F59BD715CAC44A1147ED5317C9BAE6B2A'))
```

### `crypto.SHA256` class

Provides SHA256 hashing function

General Function|Parameters and details
:---|:---
init<a class="cmnd" id="aes_sha256_init"></a>|`HMAC_SHA256.init() -> instance`<br>Initialise SHA256 hashing function
update<a class="cmnd" id="aes_sha256_update"></a>|`update(data:bytes) -> self`<br>Add content to the hash. Calls can be chained.
out<a class="cmnd" id="aes_sha256_out"></a>|`out() -> bytes(32)`<br>Output the value of the hash

Example test vectors from <https://www.dlitz.net/crypto/shad256-test-vectors/>

``` berry
import crypto
h = crypto.SHA256()

# SHA256 of empty message
assert(h.out() == bytes("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"))

# (first 16 bytes of RC4 keystream where the key = 0)
h.update(bytes("de188941a3375d3a8a061e67576e926d"))
assert(h.out() == bytes("067c531269735ca7f541fdaca8f0dc76305d3cada140f89372a410fe5eff6e4d"))
```

### `crypto.HMAC_SHA256` class

Provides HMAC SHA256 hashing function

General Function|Parameters and details
:---|:---
init<a class="cmnd" id="aes_hmac_sha256_init"></a>|`HMAC_SHA256.init(key:bytes) -> instance`<br>Initialise HMAC_SHA256 hashing function with a provided key
update<a class="cmnd" id="aes_hmac_sha256_update"></a>|`update(data:bytes) -> self`<br>Add content to the hash. Calls can be chained
out<a class="cmnd" id="aes_hmac_sha256_out"></a>|`out() -> bytes(32)`<br>Output the value of the hash

Test case from <https://datatracker.ietf.org/doc/html/rfc4231>:

``` berry
import crypto
key = bytes("4a656665")
msg = bytes("7768617420646f2079612077616e7420666f72206e6f7468696e673f")
h = crypto.HMAC_SHA256(key)
h.update(msg)
hmac = h.out()
assert(hmac == bytes("5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843"))
```

### `crypto.RSA` class

Provides RSA core features, currently only JWT RS256 signing (RSASSA-PKCS1-v1_5 with SHA256) - requires `#define USE_BERRY_CRYPTO_RSA`

Function|Parameters and details
:---|:---
rs256<a class="cmnd" id="aes_rsa_rs256"></a>|`crypto.RSA.rs256HMAC_SHA256.init(private_key:bytes(), payload:bytes()) -> bytes()`<br>Sign a payload with an RSA private key in DER binary format.<br>`private_key`: (bytes) contains the binary DER (ASN.1) private key, see example below to convert from PEM.<br>`payload` (bytes) JWT payload to sign, it should be derived from JSON encoded as base64url<br>Outputs a `bytes()` array of the payload, hashed with SHA256 and signed with the RSA private key. The output is 256 bytes longs for a 2048 RSA key.


!!! example "Signing a full JWT token with RS256"

    ``` berry
    import string
    import crypto

    # JWT requires base64url and not raw base64
    # see https://base64.guru/standards/base64url
    # input: string or bytes
    def base64url(v)
      import string
      if type(v) == 'string'   v = bytes().fromstring(v) end
      var b64 = v.tob64()
      # remove trailing padding
      b64 = string.tr(b64, '=', '')
      b64 = string.tr(b64, '+', '-')
      b64 = string.tr(b64, '/', '_')
      return b64
    end

    # JWT header and claim
    var header = '{"alg":"RS256","typ":"JWT"}'
    var claim = '{"sub":"1234567890","name":"John Doe","admin":true,"iat":1516239022}'
    var b64header = base64url(header)
    var b64claim = base64url(claim)

    assert(b64header == 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9')
    assert(b64claim == 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0')

    # `body` is the payload to sign with RS256
    var body = b64header + '.' + b64claim
    assert(body == 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0')

    var private_key =
    '-----BEGIN PRIVATE KEY-----\n'+
    'MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC7VJTUt9Us8cKj\n'+
    'MzEfYyjiWA4R4/M2bS1GB4t7NXp98C3SC6dVMvDuictGeurT8jNbvJZHtCSuYEvu\n'+
    'NMoSfm76oqFvAp8Gy0iz5sxjZmSnXyCdPEovGhLa0VzMaQ8s+CLOyS56YyCFGeJZ\n'+
    'qgtzJ6GR3eqoYSW9b9UMvkBpZODSctWSNGj3P7jRFDO5VoTwCQAWbFnOjDfH5Ulg\n'+
    'p2PKSQnSJP3AJLQNFNe7br1XbrhV//eO+t51mIpGSDCUv3E0DDFcWDTH9cXDTTlR\n'+
    'ZVEiR2BwpZOOkE/Z0/BVnhZYL71oZV34bKfWjQIt6V/isSMahdsAASACp4ZTGtwi\n'+
    'VuNd9tybAgMBAAECggEBAKTmjaS6tkK8BlPXClTQ2vpz/N6uxDeS35mXpqasqskV\n'+
    'laAidgg/sWqpjXDbXr93otIMLlWsM+X0CqMDgSXKejLS2jx4GDjI1ZTXg++0AMJ8\n'+
    'sJ74pWzVDOfmCEQ/7wXs3+cbnXhKriO8Z036q92Qc1+N87SI38nkGa0ABH9CN83H\n'+
    'mQqt4fB7UdHzuIRe/me2PGhIq5ZBzj6h3BpoPGzEP+x3l9YmK8t/1cN0pqI+dQwY\n'+
    'dgfGjackLu/2qH80MCF7IyQaseZUOJyKrCLtSD/Iixv/hzDEUPfOCjFDgTpzf3cw\n'+
    'ta8+oE4wHCo1iI1/4TlPkwmXx4qSXtmw4aQPz7IDQvECgYEA8KNThCO2gsC2I9PQ\n'+
    'DM/8Cw0O983WCDY+oi+7JPiNAJwv5DYBqEZB1QYdj06YD16XlC/HAZMsMku1na2T\n'+
    'N0driwenQQWzoev3g2S7gRDoS/FCJSI3jJ+kjgtaA7Qmzlgk1TxODN+G1H91HW7t\n'+
    '0l7VnL27IWyYo2qRRK3jzxqUiPUCgYEAx0oQs2reBQGMVZnApD1jeq7n4MvNLcPv\n'+
    't8b/eU9iUv6Y4Mj0Suo/AU8lYZXm8ubbqAlwz2VSVunD2tOplHyMUrtCtObAfVDU\n'+
    'AhCndKaA9gApgfb3xw1IKbuQ1u4IF1FJl3VtumfQn//LiH1B3rXhcdyo3/vIttEk\n'+
    '48RakUKClU8CgYEAzV7W3COOlDDcQd935DdtKBFRAPRPAlspQUnzMi5eSHMD/ISL\n'+
    'DY5IiQHbIH83D4bvXq0X7qQoSBSNP7Dvv3HYuqMhf0DaegrlBuJllFVVq9qPVRnK\n'+
    'xt1Il2HgxOBvbhOT+9in1BzA+YJ99UzC85O0Qz06A+CmtHEy4aZ2kj5hHjECgYEA\n'+
    'mNS4+A8Fkss8Js1RieK2LniBxMgmYml3pfVLKGnzmng7H2+cwPLhPIzIuwytXywh\n'+
    '2bzbsYEfYx3EoEVgMEpPhoarQnYPukrJO4gwE2o5Te6T5mJSZGlQJQj9q4ZB2Dfz\n'+
    'et6INsK0oG8XVGXSpQvQh3RUYekCZQkBBFcpqWpbIEsCgYAnM3DQf3FJoSnXaMhr\n'+
    'VBIovic5l0xFkEHskAjFTevO86Fsz1C2aSeRKSqGFoOQ0tmJzBEs1R6KqnHInicD\n'+
    'TQrKhArgLXX4v3CddjfTRJkFWDbE/CkvKZNOrcf1nhaGCPspRJj2KUkj1Fhl9Cnc\n'+
    'dn/RsYEONbwQSjIfMPkvxF+8HQ==\n'+
    '-----END PRIVATE KEY-----\n'

    # public_key for reference but not actually used here
    var public_key =
    '-----BEGIN PUBLIC KEY-----\n'+
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1SU1LfVLPHCozMxH2Mo\n'+
    '4lgOEePzNm0tRgeLezV6ffAt0gunVTLw7onLRnrq0/IzW7yWR7QkrmBL7jTKEn5u\n'+
    '+qKhbwKfBstIs+bMY2Zkp18gnTxKLxoS2tFczGkPLPgizskuemMghRniWaoLcyeh\n'+
    'kd3qqGElvW/VDL5AaWTg0nLVkjRo9z+40RQzuVaE8AkAFmxZzow3x+VJYKdjykkJ\n'+
    '0iT9wCS0DRTXu269V264Vf/3jvredZiKRkgwlL9xNAwxXFg0x/XFw005UWVRIkdg\n'+
    'cKWTjpBP2dPwVZ4WWC+9aGVd+Gyn1o0CLelf4rEjGoXbAAEgAqeGUxrcIlbjXfbc\n'+
    'mwIDAQAB\n'+
    '-----END PUBLIC KEY-----\n'

    # read private_key as DER binary
    while (private_key[-1] == '\n') private_key = private_key[0..-2] end
    var private_key_DER = bytes().fromb64(string.split(private_key, '\n')[1..-2].concat())

    # comparison with what was expected
    assert(private_key_DER.tob64() == 'MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC7VJTUt9Us8cKjMzEfYyjiWA4R4/M2bS1GB4t7NXp98C3SC6dVMvDuictGeurT8jNbvJZHtCSuYEvuNMoSfm76oqFvAp8Gy0iz5sxjZmSnXyCdPEovGhLa0VzMaQ8s+CLOyS56YyCFGeJZqgtzJ6GR3eqoYSW9b9UMvkBpZODSctWSNGj3P7jRFDO5VoTwCQAWbFnOjDfH5Ulgp2PKSQnSJP3AJLQNFNe7br1XbrhV//eO+t51mIpGSDCUv3E0DDFcWDTH9cXDTTlRZVEiR2BwpZOOkE/Z0/BVnhZYL71oZV34bKfWjQIt6V/isSMahdsAASACp4ZTGtwiVuNd9tybAgMBAAECggEBAKTmjaS6tkK8BlPXClTQ2vpz/N6uxDeS35mXpqasqskVlaAidgg/sWqpjXDbXr93otIMLlWsM+X0CqMDgSXKejLS2jx4GDjI1ZTXg++0AMJ8sJ74pWzVDOfmCEQ/7wXs3+cbnXhKriO8Z036q92Qc1+N87SI38nkGa0ABH9CN83HmQqt4fB7UdHzuIRe/me2PGhIq5ZBzj6h3BpoPGzEP+x3l9YmK8t/1cN0pqI+dQwYdgfGjackLu/2qH80MCF7IyQaseZUOJyKrCLtSD/Iixv/hzDEUPfOCjFDgTpzf3cwta8+oE4wHCo1iI1/4TlPkwmXx4qSXtmw4aQPz7IDQvECgYEA8KNThCO2gsC2I9PQDM/8Cw0O983WCDY+oi+7JPiNAJwv5DYBqEZB1QYdj06YD16XlC/HAZMsMku1na2TN0driwenQQWzoev3g2S7gRDoS/FCJSI3jJ+kjgtaA7Qmzlgk1TxODN+G1H91HW7t0l7VnL27IWyYo2qRRK3jzxqUiPUCgYEAx0oQs2reBQGMVZnApD1jeq7n4MvNLcPvt8b/eU9iUv6Y4Mj0Suo/AU8lYZXm8ubbqAlwz2VSVunD2tOplHyMUrtCtObAfVDUAhCndKaA9gApgfb3xw1IKbuQ1u4IF1FJl3VtumfQn//LiH1B3rXhcdyo3/vIttEk48RakUKClU8CgYEAzV7W3COOlDDcQd935DdtKBFRAPRPAlspQUnzMi5eSHMD/ISLDY5IiQHbIH83D4bvXq0X7qQoSBSNP7Dvv3HYuqMhf0DaegrlBuJllFVVq9qPVRnKxt1Il2HgxOBvbhOT+9in1BzA+YJ99UzC85O0Qz06A+CmtHEy4aZ2kj5hHjECgYEAmNS4+A8Fkss8Js1RieK2LniBxMgmYml3pfVLKGnzmng7H2+cwPLhPIzIuwytXywh2bzbsYEfYx3EoEVgMEpPhoarQnYPukrJO4gwE2o5Te6T5mJSZGlQJQj9q4ZB2Dfzet6INsK0oG8XVGXSpQvQh3RUYekCZQkBBFcpqWpbIEsCgYAnM3DQf3FJoSnXaMhrVBIovic5l0xFkEHskAjFTevO86Fsz1C2aSeRKSqGFoOQ0tmJzBEs1R6KqnHInicDTQrKhArgLXX4v3CddjfTRJkFWDbE/CkvKZNOrcf1nhaGCPspRJj2KUkj1Fhl9Cncdn/RsYEONbwQSjIfMPkvxF+8HQ==')

    # sign body
    var body_b64 = bytes().fromstring(body)
    var sign = crypto.RSA.rs256(private_key_DER, body_b64)
    var b64sign = base64url(sign)

    # check output
    assert(b64sign == 'NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ')

    # Final token:
    var jwt_token = payload + '.' + b64sign
    ```

### `crypto.MD5` class

Provides MD5 hashing function.

General Function|Parameters and details
:---|:---
init<a class="cmnd" id="aes_md5_init"></a>|`MD5.init() -> instance`<br>Initialise MD5 hashing function
update<a class="cmnd" id="aes_md5_update"></a>|`update(data:bytes) -> self`<br>Add content to the hash. Calls can be chained.
finish<a class="cmnd" id="aes_md5_finish"></a>|`finish() -> bytes(16)`<br>Finish the MD5 calculation and output the result (16 bytes)

Test vector:

``` berry
import crypto
h = crypto.MD5()
t = bytes().fromstring("The quick brown fox jumps over the lazy dog")
h.update(t)
m = h.finish()
assert(m == bytes("9e107d9d372bb6826bd81d3542a419d6"))
```
