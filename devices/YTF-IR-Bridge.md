* [YTF](https://www.amazon.com/gp/product/B07H46LJZK)
* [BaKEN](https://www.amazon.co.uk/gp/product/B07ZQSJ4VD) - Identical to the YTF
* [Tuya](https://www.aliexpress.com/item/a/32951202513.html)

## Flashing
### OTA flashing
This device is based on a Tuya Wi-Fi module and may still be flashable with [Tuya-Convert](https://github.com/ct-Open-Source/tuya-convert).

### Serial flashing
Like most devices, GPIO0 has to be held low during power up to get into flash mode. In the picture below, notice the red jumper wire between IO0 and GND. I soldered it in such a way I could hold it during power on, but release later (basically acts as a button), since it can not be held low if you want normal operation.

![img_1140](https://user-images.githubusercontent.com/1296162/50830738-8b069100-12fd-11e9-968a-ed93e396c614.JPG)
![image](https://user-images.githubusercontent.com/563412/61639258-d255dd00-aca3-11e9-8c6d-27bdfa2d2b85.png)
![img_2323](https://user-images.githubusercontent.com/1296162/50830734-8b069100-12fd-11e9-9c4d-130d17056257.JPG)
![img_8334](https://user-images.githubusercontent.com/1296162/50830737-8b069100-12fd-11e9-83b0-1d9b1ee42fb9.JPG)
![img_3255](https://user-images.githubusercontent.com/1296162/50830739-8b9f2780-12fd-11e9-83b3-bdaea3f50bb2.JPG)
![img_3282](https://user-images.githubusercontent.com/1296162/50830740-8b9f2780-12fd-11e9-9a11-9572d9990e44.JPG)

## Configuration
Introduced in version [6.4.1.8](https://github.com/arendst/Tasmota/commit/c5f68235700b4447198a9508b709c3e254676114#diff-ddfd77b547e11c4b59fa0d20fddd7f94R1679) as [`YTF IR Bridge (62)`](https://www.aliexpress.com/item/Tuya-universal-Smart-IR-Hub-remote-control-Voice-Control-AC-TV-Work-With-Alexa-Google-Home/32951202513.html)

GPIO | Component | Description
-- | -- | --
04 | LED1i (52) | Blue LED - Link status
05 | IRrecv (51) | IR Receiver
13 | Button1 (17) | Button
14 | IRsend (8) | IR Transmitter

## IR Codes
[IR Code List](Codes-for-IR-Remotes-(for-YTF-IR-Bridge))
