SK03 Outdoor Smart Plug which can be found as different brand names on Amazon.  The ESP8266 module inside is a TYWE3S by Tuya. The power monitoring is a HLW8012 much like the original Sonoff POW and other power monitoring modules.

Pull the four rubber pads off the bottom to expose the screws and the unit opens up.  Unscrew the small screws from the board and it comes out of the case. The relay is close to the soldering points on the Tuya module but it can be done if you are careful.  GPIO0 is the button on the underside so you do not need to solder to that point, just hold the button during boot for your flashing process like you would with a Sonoff Basic.  

digiblurDIY did a livestream showing this device, soldering and flashing process (split in two videos): https://www.youtube.com/watch?v=C5_BqptJA_w  and https://www.youtube.com/watch?v=ca7P9TR9r68

As of firmware 6.3.0.11, the SK03 is available for use in the module configuration. 

Information regarding the standard soldering and pinouts for the TYWE3S module:

![tywe3s_3](https://user-images.githubusercontent.com/3240875/43324698-669affd6-917a-11e8-8e06-c800741bfb68.png)
![chip_wires](https://raw.githubusercontent.com/digiblur/TuyaDimmer-Tasmota/master/SK03_Outdoor_Flashing_Pinout.jpg)

```
  { "SK03 Outdoor",   // Outdoor smart plug with power monitoring HLW8012 chip - https://www.amazon.com/gp/product/B07CG7MBPV
     GPIO_KEY1,        // GPIO00 Button
     0, 0, 0,    
     GPIO_HLW_CF,      // GPIO04 HLW8012 CF power
     GPIO_NRG_CF1,     // GPIO05 HLW8012 CF1 current / voltage
     0, 0, 0, 0, 0, 0, // Flash connection
     GPIO_NRG_SEL_INV, // GPIO12 HLW8012 CF Sel output (0 = Voltage)
     GPIO_LED2_INV,    // GPIO13 Red Led (0 = On, 1 = Off)
     GPIO_LED1_INV,    // GPIO14 Blue Led (0 = On, 1 = Off)
     GPIO_REL1,        // GPIO15 Relay (0 = Off, 1 = On)
     0, 0
  }
```

![](https://github.com/digiblur/TuyaDimmer-Tasmota/raw/master/SK03-1.jpg)
![](https://github.com/digiblur/TuyaDimmer-Tasmota/raw/master/SK03-2.jpg)
![](https://github.com/digiblur/TuyaDimmer-Tasmota/raw/master/SK03-3.jpg)
![](https://github.com/digiblur/TuyaDimmer-Tasmota/raw/master/SK03-4.png)
![](https://github.com/digiblur/TuyaDimmer-Tasmota/raw/master/SK03-5.png)
![](https://github.com/digiblur/TuyaDimmer-Tasmota/raw/master/tasmota_example.JPG)



