?> **Template** is a definition of a device and how its GPIOs are assigned.

These are intended to be an easy way for users to create and share configurations for devices that are unsupported in Tasmota but have common characteristics with existing modules. We encourage everyone who creates a template for a [new unknown device](Configuration-Procedure-for-New-Devices) to [add it to the database](https://blakadder.github.io/templates/) with an image of the device, links to the manufacturer or where it can be found and, of course, the template for it.

To provide easy processing by Tasmota, a user template is written as a JSON string and could look like this:
```json
{"NAME":"UserModule1","GPIO":[17,148,29,149,7,255,255,255,138,255,139,255,255],"FLAG":0,"BASE":18}
```
> [!TIP] [**Tasmota Device Templates Repository**](https://blakadder.github.io/templates/) has a complete list of supported devices and their templates.

## How to Use

Go to **Configuration - Configure Template** ...

![How to get to template config](https://i.postimg.cc/Z5QP4q7C/template1.png ":size=200")

... and you'll end up looking at this screen.

![Configure Template](https://i.postimg.cc/SR9375nG/template2.png ":size=200")

Time to create your template.

### Creating Your Template 
1. Change<img src="https://i.postimg.cc/SQwp2Lnr/template4.png" align="right"> the template name (also defines the name for the module).
2. Select a module to [**BASE** your template on](#base). If you're not sure, `Module 18` is the best choice. In this example the device is based on Blitzwolf SHP (45) module.
3. Configure the components assigned to the [**GPIOs**](#gpio) to match your device. If you do not know what pins your device uses, read about the [new device configuration procedure](Configuration-Procedure-for-New-Devices) to determine the correct pin assignments.
![GPIO configuration](https://i.postimg.cc/d1j4sYZp/template5.png)
 
    - Any unused GPIO that has cannot have a peripheral connected should be set to `None (0)`. In our example the device has no exposed GPIO's so the unused ones are set to `0` compared to the original BlitzWolf module.     
    - GPIOs that can have peripherals connected to (exposed GPIOs) should be set to `User (255)`. This allows future configuration through the **Configure Module** dialog without the need to create a new template.  
   
      > [!EXAMPLE]
      > Take `Sonoff TH` as one: It has a jack connected to GPIO4 that allows a user to plug in a sensor. Assigning GPIO4 as `255` allows a Template to have correct GPIOs for this device even if nothing is plugged in. But, when a user decides to connect a sensor using the jack, GPIO4 can be set to the type of sensor through the Configure Module page.

4. Click on **Save** and you'll see this message

![](https://i.postimg.cc/4dqjcZxd/template6.png ":size=200")

5. Finally, the device will reboot with the new template name

![](https://i.postimg.cc/NjxhzWpJ/template-finished.png ":size=200")

### Exporting Your Template

Now that you've set up your previously unsupported device in Tasmota it is time to share the knowledge:

1. Check that `Module 0` is selected in the **Configuration - Configure Module** menu. 
2. Open up **Console** and issue command `Template` which will output a string with the configuration of your currently active template. Our example gives the following:

```json
MQT: stat/tasmota/RESULT = {"NAME":"RGB Smart Plug","GPIO":[37,0,39,0,38,134,0,0,131,17,132,21,0],"FLAG":0,"BASE":45}
```

Copy the string `{"NAME":"RGB Smart Plug","GPIO":[37,0,39,0,38,134,0,0,131,17,132,21,0],"FLAG":0,"BASE":45}` and share it on the [Tasmota Device Templates Repository](https://blakadder.github.io/templates/).

### Importing Templates

Go to **Configuration - Configure Other**

![How to get to template config](https://i.postimg.cc/25Hsznpn/template-import1.png ":size=250")

When there:
1. Paste the template string into the Template field
2. Make sure you **check Activate**
3. Click on **Save**. 

![Template configuration](https://i.postimg.cc/P5HsKtzv/template-import2.png ":size=250")

The device will reboot with a name reflecting your template name and `Module 0` selected which has your new template stored.

![It is finished](https://i.postimg.cc/28hN4qvf/template-import3.png ":size=250")


## Commands
A user provided template can be stored in Tasmota using the [`Template`](Commands#template) command. It has the following parameters.

|Parameter|  Description |
|---------|----------|
` `|Show current Template
`0`|Create template from active module
`1..71`|Create template from a supported module
`{ ... }`|Store template written in a JSON string												

``Template {"NAME":"UserModule1","GPIO":[17,148,29,149,7,255,255,255,138,255,139,255,255],"FLAG":0,"BASE":18}`` stores a complete template based on the Generic module

``Template {"NAME":"AnotherModuleName"}`` updates the name of a stored template

``Template {"FLAG":0}`` changes FLAG value

``Template {"BASE":18}`` updates the base of a stored template to Generic

**After setting a template in command line it is necessary to issue `Module 0` command if the device doesn't reboot on its own.**

#### Merge Template with Module
You can set up your device in module **_Configuration -> Configure Module_** and use command `Template 255` to merge the settings of the Module with current template into a new Template named "Merged".

## Anatomy of a Template
Let's look again at our example template:

```
{"NAME":"UserModule1","GPIO":[17,148,29,149,7,255,255,255,138,255,139,255,255],"FLAG":0,"BASE":18}
```

The four properties with UPPERCASE property names have the following functionality:

Property name | Property value description
--------------|-----------------------------------------------------------------------------------------------------------
NAME          | Up to 14 characters for the Module name
[GPIO](#gpio) | Up to 13 decimal numbers from 0 to 255 representing GPIO0 to GPIO5, GPIO09, GPIO10 and GPIO12 to GPIO16
[FLAG](#flag) | 8 bit mask flag register
[BASE](#base) | Module number of a hard-coded device to be used when device specific functionality is needed

### GPIO

#### GPIO order

```  
GPIO# |00| 01|02| 03|04| 05| 09| 10| 12| 13| 14| 15| 16|  
CODE  [17,148,29,149,52,255,255,255,138,255,139,255,255] 
```

#### GPIO functionality
The GPIO functionality numbers are the same as shown by command ``GPIOs``. In addition code 255 is added to select a GPIO as user configurable via the GUI Configure Module menu.

> [!EXAMPLE]
>In our example the GPIO 00 data element is `17` which corresponds to the `Button1` component, according to the following table. If you change that template element to `9` it would then be assigned as a `Switch1` component instead.

#### Components
See [Components](Components) for a complete list

[Google Sheet](https://docs.google.com/spreadsheets/d/10aYCaR3P09omn_vryFGyyq7dS-XK54K2fGAcb4gruik) with the components by number or alphabetically.

### FLAG
Used to configure the [ADC](/peripherals/ADC) type. In most templates this should be set to `0`.

FLAG |  Feature description
-----|------------------------------
   0 | No features
   1 | Analog value
   2 | Temperature
   3 | Light
   4 | Button
   5 | Buttoni
  15 | User configured (same as GPIO `255`)

### BASE
BASE is the starting module setup for the custom template. Some modules include special programming. If your device is similar to an existing built-in module it is best to use that as a starting point. When you're not sure which BASE module is suitable for your device use the `Generic (18)` module. A list of hard-coded devices can be found in [Modules](Modules).

> [!EXAMPLE]
>In the [RGB Smart Plug](https://blakadder.github.io/templates/rgbpow.html)
template we used the `BlitzWolf SHP (45)` module as BASE since the power monitoring circuitry is identical but GPIO00 and GPIO02 were changed and an unused GPIO04 was added to enable the RGB LED function. Using that specific module we took advantage of that module's calibrated power monitoring special programming which the `Generic (18)` module does not use.



