This Device is based on a Tuya Wi-Fi Module. Refer to ["MCU Based Tuya Dimmers and Switches"](MCU-Based-Tuya-Dimmers-and-Switches) for details.  

![DM_WF_MDV4 Dimmer and Case](https://user-images.githubusercontent.com/34340210/66512192-6c107780-eaa6-11e9-9584-e8b3f77cba14.jpg)

This is a 240V Leading Edge Dimmer with a TYWE3S controller and an STM8 MCU

### Flashing:

The NRST pin of the STM8 needs to be grounded upon boot to disable it, this is brought out to a header pin, along with ground and VCC from the TYWE3S. Confirm by checking continuity with a multimeter

IO0 from the TYWE3s also needs to be grounded upon boot, otherwise it's normal tasmota flashing procedure.

Header pins from left to right
*VCC
*Unknown
*Ground
*STM8 NRST

![Header](https://user-images.githubusercontent.com/29167124/66513019-1d78d280-ead2-11e9-8a6e-d33e82b60154.png)

![TYWE3S](https://user-images.githubusercontent.com/29167124/66513030-236eb380-ead2-11e9-9887-d87159f2a0ab.png)

![STM8S003F3P6](https://user-images.githubusercontent.com/29167124/66513040-2669a400-ead2-11e9-9a70-ef29f9c231d0.png)

### Config:
As per main TuyaMCU page using

   GPIO | Component
   :-:|-
   01 | Tuya Rx (108)
   03 | Tuya Tx (107)

### More information:
Bought from [ebay](https://www.ebay.co.uk/itm/Smart-Wifi-Dimmer-Switch-Support-Tuya-Smart-Life-LED-Light-Timing-Remote-Control/233233166207)

[More information on TYWE3S](https://docs.tuya.com/docDetail?code=K8uhkbb1ihp8u)]


