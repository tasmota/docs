description: How to configure an unknown device to work with Tasmota

If your device is not a built-in module listed in the module configuration menu, a [user contributed device template](https://templates.blakadder.com/) ([explanation](Templates)) may be available. Otherwise, follow this procedure for configuring the ESP chip pins used by your device.

Some smart devices have additional functionality which may be handled by codes sent to a separate MCU in the device. Devices with functions offloaded to a separate MCU require additional coding in the software or via rules. Certain supported Tasmota [BASE](Templates#base) devices have built-in code to handle MCU controlled devices. Using a template with an appropriate BASE device may have the programming logic required to manage the MCU commands for your device. If an existing BASE device with the logic for your device is **_not_** available, a modified device driver will be required. This case is outside of the scope of this article.

If your device is similar to the existing built-in module (e.g., a particular MCU or power monitoring algorithm) it is best to use that as a starting point. When you are not sure which module is suitable for your device, use `Generic module (18)`.  

### Step 1. 
Begin this procedure by disabling power state saves. Some improper GPIO assignments can cause device reboots. Disabling this setting avoids repeated flash writes. Also, it is best to allow Tasmota to return to a fail safe state in case of a bad configuration. Ensure that boot loop control is not disabled.  
```haskell
Backlog SetOption0 0; SetOption36 1
```  
### Step 2. 
Assign every available GPIO to successive `Relay<x>` components. For the initial GPIO probe, exclude "dedicated" GPIO such as GPIO0/GPIO2 and Tx/Rx, etc. You can use a [Template](Templates) to easily perform these assignments:  

```json
{"NAME":"ID Relays","GPIO":[0,0,0,0,224,225,0,0,226,227,228,229,230,0],"FLAG":0,"BASE":18}
```  

#### Step 2a. 
Save the configuration. Once the device reboots, use the virtual buttons on the web UI to find which of the assigned GPIO actually control the physical relays and LEDs on the device. Make note of which GPIO act on which device peripheral.    

- If you are unable to control some of the relays or LEDs on the device, they may be attached to the "dedicated" GPIO skipped in the initial probe. Now assign those GPIOs and repeat step _2a_:          
```json
{"NAME":"ID Relays 2","GPIO":[224,225,226,227,0,0,0,0,0,0,0,0,0,0],"FLAG":0,"BASE":18}
```

- If your device is based on the ESP8285 and you are still unable to control some of the relays or LEDs on the device, they may be attached to GPIO9 or GPIO10. Now assign those remaining GPIO and repeat step _2a_:  
```json
{"NAME":"ID Relays 3","GPIO":[0,0,0,0,0,0,224,225,0,0,0,0,0,0],"FLAG":0,"BASE":18}
```

#### Step 2b. 
Once you have found which GPIOs control the relays and LEDs, set these "active" GPIO to associate them with the corresponding `Relay<x>`, `LED<x>`, or `LEDLink` or `PWM<x>` (Some may require the use of inverted (i.e., `Relay<x>i`/`LED<x>i`/`LEDLinki`) component). Bulbs have mainly `PWM`.  

**For proper operation, in the final device configuration, assignment of like components must begin from `1` and be assigned sequentially!** Regular and inverted components can be intermixed.  
(e.g., `Relay1`, then `Relay2`; `Led1`, then `Led2i` and so on)  

### Step 3. 
Now assign every remaining GPIO (excluding, once again, remaining "dedicated" GPIO like GPIO0/GPIO2 and Tx/Rx, etc.) to successive `Switch1`..`Switch8` components (`9`..`16`). You can once again use a Template using `0` for the GPIO identified in step 2.

#### Step 3a. 
Save the configuration. Once the device reboots, use the web UI Console to run the `Status 8` (sensors) command. This will display the current state of each GPIO.

#### Step 3b. 
Then, while either holding down the physical button or having flipped the position of the physical switch, display `Status 8` again. Whichever GPIO changes state from what was shown in step _3a_ is the GPIO connected to the input.
      
- If you have a bulb, GPIO which are in state `on` will probably be SM16716 CLK or SM16716 DAT component.   
- If none of the GPIO change state, then assign the remaining GPIO and retry step _3a_.

#### Step 3c. 
Once you have found which GPIO are connected to each input, change the GPIO setting in the configuration to a `Button<x>` or `Switch<x>` according to your input component or use case. Proper operation may dictate the use regular or inverted (i.e., `Switch<x>i`/`Button<x>i`) settings. For buttons, you may need to determine whether the internal pull-up is used or not. If so, select `Button<x>`_**n**_, where _**n**_ indicates no pull-up.

### Step 4. 
Once you have determined which GPIO your device uses, set any remaining GPIOs to `None (0)` including the Analog A0 pin.
   
Save the configuration.

### Step 5. 
In case your device is a Tuya device with an MCU which controls everything see [TuyaMCU](TuyaMCU) for instructions on how to configure it.

### Step 6. 
Once the device reboots, set the device to save power state changes ([`SetOption0 1`](Commands#setoption0)).

### Step 7. 
Your device is configured for use with Tasmota.  

### Submit new template
Since you have now configured a device not previously known to the Tasmota user base, you can [export the template](Templates#exporting-your-template) and submit it to the [Tasmota Supported Devices Repository](https://templates.blakadder.com/new.html).  

View this [Digiblur DIY video](https://youtu.be/5Oa27pCHtYo?t=518) for a tutorial on this procedure.  
