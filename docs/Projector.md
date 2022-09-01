# LCD/DLP projector Serial Control

??? failure "This feature is not included in precompiled binaries"  

    When [compiling your build](Compile-your-build) add the following to `user_config_override.h`:

    ```c++
    #define USE_PROJECTOR_CTRL
    // _Mandatory:_ choose the communication protocol for your projector. define only one of them:
    #define USE_PROJECTOR_CTRL_NEC
    #define USE_PROJECTOR_CTRL_OPTOMA
    #define USE_PROJECTOR_CTRL_ACER
    // _Optional:_ set the Relay that powers your device (default is 1)
    #define PROJECTOR_CTRL_PWR_BY_RELAY 1  //the relay that powers the projector
    // _Optional:_ set the baudrate to communicate to your device (default is 9600):
    #define PROJECTOR_CTRL_SERIAL_BAUDRATE 9600
    // _Optional:_ enable debugging messages:
    #define DEBUG_PROJECTOR_CTRL
    // _Optional:_ Add Serial to TCP Bridge to your build if you want to play with your projector's communication protocol over network connection. Useful for ASCII protocol testing. Needs a different GPIO configuration and is completely independent to this module:
    #define USE_TCP_BRIDGE
    ```

## Description
This driver simulates an additional relay in your Tasmota device. If you have N physical relays and you configure GPIO pin functions `DLP Tx` and `DLP Rx` you'll see relay (N+1) after reboot. The two GPIO pins will be used for serial communication with your LCD or DLP projector. The communication protocol is unique for each manufacturer (compile-time option). The driver polls the projector's state periodically and updates the fake relay state. When you toggle the fake relay, serial commands are sent to the projector to power it up or down. While the projector is running, the driver prevents to switch off the real relay that feeds the projector. This protects the lamp of the projector (needs to be cooled down before power is cut from the device).

## Supported Projectors
* NEC projectors - tested with NEC V300W
* OPTOMA projectors - not tested yet / report your results!
* Acer projectors - tested with Acer P1500 & H5360BD

Fixes and definitions for further manufacturers should go to `tasmota\xdrv_53_projector_ctrl.h`

## Physical Connection
Connect your Tasmota GPIO pins (3.3V TTL level) to a MAX3232 interface (cheap items on internet sales). Such interface changes TTL signals to proper RS232 levels. There are 4 wires on TTL side (Vcc, GND, Rx and Tx) and 3 wires on RS232 side (GND, Tx and Rx). A wire jumper between pins 7(RTS) and 8(CTS) may be needed in DSUB9 connector going to projector.

![](_media/projectorCtrl_TH16_unboxed.jpg)
![](_media/projectorCtrl_TH16_mounted.jpg)
![](_media/projectorCtrl_V300W.jpg)

### Tasmota Settings 
In the **_Configuration -> Configure Module_** page assign:

1. GPIO1 to `DLP Tx`
2. GPIO3 to `DLP Rx`

Replace GPIO1/GPIO3 with your scenario. Use command `Weblog 3` to see extended logging of serial communication in Console.

## Projector Configuration
Check your projector settings concerning Serial port. It must match Tasmota settings eg. 9600 8N1. Some models have "ID number" feature to allow several projectors in one room. The control commands in Tasmota contain ID 0. Please switch off the "ID" control completely or set the ID to 0.

Since Acer H5360BD does not offer a simple RS2332 port setup is as follows:
![ESP01-RS232-AcerH5360](https://user-images.githubusercontent.com/4789510/174459412-f61db899-cdb3-4888-9484-9ca07e3befb0.png)


