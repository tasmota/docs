If your device is not a built-in module listed in the module configuration menu, a [user contributed device template](https://blakadder.github.io/templates/) ([explanation](Templates)) may be available. Otherwise, follow this procedure for configuring the ESP chip pins used by your device.

Some smart devices have additional functionality which may be handled by codes sent to a separate MCU in the device. Devices with functions offloaded to a separate MCU require additional coding in the software or via rules. Certain supported Tasmota [BASE](Templates#base) devices have built-in code to handle MCU controlled devices. Using a template with an appropriate BASE device may have the programming logic required to manage the MCU commands for your device. If an existing BASE device with the logic for your device is **_not_** available, a modified device driver will be required. This case is outside of the scope of this article.

If your device is similar to the existing built-in module (e.g., a particular MCU or power monitoring algorithm) it is best to use that as a starting point. When you are not sure which module is suitable for your device, use `Generic module (18)`.  

1. Begin this procedure by disabling power state saves. Some improper GPIO assignments can cause device reboots. Disabling this setting avoids repeated flash writes. Also, it is best to allow Tasmota to return to a fail safe state in case of a bad configuration. Ensure that boot loop control is not disabled.  

   `Backlog SetOption0 0; SetOption36 1`  

2. Assign every available GPIO to successive `Relay<x>` components. For the initial GPIO probe, exclude "dedicated" GPIO such as GPIO0/GPIO2 and Tx/Rx, etc. You can use a [Template](Templates) to easily perform these assignments:  
   `{"NAME":"ID Components","GPIO":[0,0,0,0,21,22,0,0,23,24,25,26,27],"FLAG":0,"BASE":18}`  

   _a._ Save the configuration. Once the device reboots, use the virtual buttons on the web UI to find which of the assigned GPIO actually control the physical relays and LEDs on the device. Make note of which GPIO act on which device peripheral.  
      - If you are unable to control some of the relays or LEDs on the device, they may be attached to the "dedicated" GPIO skipped in the initial probe. Now assign those GPIO:  
        `{"NAME":"ID Components","GPIO":[21,22,23,24,0,0,0,0,0,0,0,0,0],"FLAG":0,"BASE":18}`
      - Repeat step _2a_.  
      - If you device is based on the ESP8285 and you are still unable to control some of the relays or LEDs on the device, they may be attached to GPIO9 or GPIO10. Now assign those remaining GPIO:  
        `{"NAME":"ID Components","GPIO":[0,0,0,0,0,0,21,22,0,0,0,0,0],"FLAG":0,"BASE":18}`
      - Repeat step _2a_.  

   _b._ Once you have found which GPIOs control the relays and LEDs, set these "active" GPIO to associate them with the corresponding `Relay<x>`, `LED<x>`, or `LEDLink` (Some may require the use of inverted (i.e., `Relay<x>i`/`LED<x>i`/`LEDLinki`) component).  

      **For proper operation, in the final device configuration, assignment of like components must begin from `1` and be assigned sequentially!** Regular and inverted components can be intermixed.  
      (e.g., `Relay1`, then `Relay2`; `Led1`, then `Led2i` and so on)  

3. Now, assign every remaining GPIO (excluding, once again, remaining "dedicated" GPIO like GPIO0/GPIO2 and Tx/Rx, etc.) to successive `Switch1`..`Switch8` components (`9`..`16`). You can once again use a Template using `0` for the GPIO identified in step 2.

   _a._ Save the configuration. Once the device reboots, use the web UI Console to run the `Status 8` (sensors) command. This will display the current state of each GPIO.

   _b._ Then, while either holding down the physical button or having flipped the position of the physical switch, display `Status 8` again. Whichever GPIO changes state from what was shown in step _3a_ is the GPIO connected to the input.

      - If none of the GPIO change state, then assign the remaining GPIO and retry step _3a_.

   _c._ Once you have found which GPIO are connected to each input, change the GPIO setting in the configuration to a `Button<x>` or `Switch<x>` according to your input component or use case. Proper operation may dictate the use regular or inverted (i.e., `Switch<x>i`/`Button<x>i`) settings. For buttons, you may need to determine whether the internal pull-up is used or not. If so, select `Button<x>`_**n**_, where _**n**_ indicates no pull-up.

      - See [Button with single press, double press, and hold](Rule-Cookbook#button-with-single-press-double-press-and-hold) to control multiple devices with one button.

4. Once you have determined which GPIO your device uses, set any remaining GPIO to `None (0)`.
   - Save the configuration.

5. Once the device reboots, set the device to save power state changes ([`SetOption0 1`](Commands#setoption0)).

6. Your device hardware is configured for use.  

Since you have now configured a device not previously known to the Tasmota user base, you may want to [export the template](Templates#exporting-your-template) and contribute it to the [templates repository](https://blakadder.github.io/templates/).  

View this [Digiblur DIY video](https://youtu.be/5Oa27pCHtYo?t=518) for a tutorial on this procedure.  
