(For information on the iFan02 please see here - [iFan02](https://github.com/arendst/Tasmota/wiki/Sonoff-iFan02))

## Serial Flashing
Please see the [Hardware Preparation](https://github.com/arendst/Tasmota/wiki/Hardware-Preparation) page for general instructions.

Next, please see the [Flashing](https://github.com/arendst/Tasmota/wiki/Flashing) page for general information on the flashing process.

Flash the latest version of [`tasmota.bin`](http://thehackbox.org/tasmota/json/tasmota.bin):

1. Connect your serial flashing device pins to the iFan03 (for connection locations see the pin out on the left hand side of the picture below).  
   ![](https://github.com/tim-dcl/BRUH3-Home-Assistant-Configuration/blob/master/IMG_20190817_155847511_HDR.jpg)

2. When you are ready to flash your device, hold down the large white tipped button on the iFan03 while connecting the serial adapter to your computer. This will power the serial adapter as well as the iFan03. Usually, you can release the button on the iFan03 once it has fully booted - after 3-5 seconds once the lights have flashed. If the device does not enter programming mode successfully, cycle power but this time continue to hold the button during the entire firmware upload process (i.e., step 4 below).

3. Using NodeMCU Pyflasher (recommended):
   - Select the firmware file that you want to flash
   - Set the COM port for your serial programming adapter
   - Ensure that flash mode `Dual Output (DOUT)`, and baud rate of `115200` is selected
   - If you are flashing Tasmota for the first time, also select `yes, wipes all data`.

4. Click on the "Flash NodeMCU" button and wait until the flashing process is completed. 

5. Cycle power on the serial adapter by unplugging and plugging it back in from the USB port. Do not hold down the iFan03 button. Wait for the iFan03 to reboot.

6. If this is the first time you have flashed Tasmota on the device, connect to the iFan03 `sonoff-xxxx` Wi-Fi access point and configure your Wi-Fi credentials by opening `192.168.4.1` in a browser. Wait for the iFan03 to reboot.

7. Find the IP address of the iFan03 and navigate to that IP address in any browser. Select "Configure Module" from the "Configuration" menu and select `Sonoff iFan03 (71)` from the drop down list.

8. Wait for the iFan03 to restart and then continue any other required or desired configuration.

## US Ceiling Fans

The capacitors in the iFan03 do not set the speed of US fans correctly. To correct the speeds for US ceiling fans, you need to remove the existing capacitors from the iFan03 and replace them with equivalently electrically rated 5uF (microfarad) capacitors. **Do NOT do this if you are not comfortable using a soldering iron as improperly performing this action could increase the risk of bodily injury or property damage.**
![](https://github.com/tim-dcl/BRUH3-Home-Assistant-Configuration/blob/master/IMG_20190817_155903267.jpg)
![](https://github.com/tim-dcl/BRUH3-Home-Assistant-Configuration/blob/master/IMG_20190817_155910936_HDR.jpg)
![](https://github.com/tim-dcl/BRUH3-Home-Assistant-Configuration/blob/master/IMG_20190817_155853950_HDR.jpg)

## RF Remote Control Pairing

To pair the remote control after the device has been flashed with the new firmware, the device needs to be powered from _**mains**_ voltage (not from the USB serial flashing device). **Be careful dealing with mains voltages. Ensure that all connections are correctly made and that the iFan03 covers are properly re-assembled.**

To pair the remote control, hold down any button on the remote control and apply power to the iFan03. Once the device boots up you should hear a series of clicks as the internal relays operate. Once completed you can test the remote and it should all be operational.

## Home Assistant Configuration

### Fan Speed
Credit to [finity](https://community.home-assistant.io/t/sonoff-ifan02-tasmota-mqtt-fan/64083/13)

There are two different configurations that need to be used depending on the method of use in Home Assistant.

To use the iFan03 along with the [Fan Control Entity Row](https://github.com/finity69x2/fan-control-entity-row) then use the configuration below:

```yaml
  - platform: mqtt  
    name: "iFan03-2 Test Fan"
    command_topic: "cmnd/iFan03-2/FanSpeed"
    speed_command_topic: "cmnd/iFan03-2/FanSpeed"    
    state_topic: "stat/iFan03-2/RESULT"
    speed_state_topic: "stat/iFan03-2/RESULT"
    state_value_template: >
      {% if value_json.FanSpeed is defined %}
        {% if value_json.FanSpeed == 0 -%}0{%- elif value_json.FanSpeed > 0 -%}4{%- endif %}
      {% else %}
        {% if states.fan.ifan03_2_test_fan.state == 'off' -%}0{%- elif states.fan.ifan03_2_test_fan.state == 'on' -%}4{%- endif %}
      {% endif %}
    speed_value_template: "{{ value_json.FanSpeed }}"
    availability_topic: tele/iFan03-2/LWT
    payload_off: "0"
    payload_on: "4"
    payload_low_speed: "1"
    payload_medium_speed: "2"
    payload_high_speed: "3"
    payload_available: Online
    payload_not_available: Offline
    speeds:
      - off
      - low
      - medium
      - high
```

If you will be using the regular toggle to control off & on and using the pop up "more info" window to control the speeds then use this configuration:

```yaml
  - platform: mqtt  
    name: "iFan03-2 Test Fan Popup"
    command_topic: "cmnd/iFan03-2/FanSpeed"
    speed_command_topic: "cmnd/iFan03-2/FanSpeed"    
    state_topic: "stat/iFan03-2/RESULT"
    speed_state_topic: "stat/iFan03-2/RESULT"
    state_value_template: >
      {% if value_json.FanSpeed is defined %}
        {% if value_json.FanSpeed == 0 -%}0{%- elif value_json.FanSpeed > 0 -%}ON{%- endif %}
      {% else %}
        {% if states.fan.ifan03_2_test_fan_popup.state == 'off' -%}0{%- elif states.fan.ifan03_2_test_fan_popup.state == 'on' -%}ON{%- endif %}
      {% endif %}
    speed_value_template: "{{ value_json.FanSpeed }}"
    availability_topic: tele/iFan03-2/LWT
    payload_off: "0"
    payload_on: "ON"
    payload_low_speed: "1"
    payload_medium_speed: "2"
    payload_high_speed: "3"
    payload_available: Online
    payload_not_available: Offline
    speeds:
      - off
      - low
      - medium
      - high
```

### Fan Light

```yaml
  - platform: mqtt
    name: "iFan03-2 Light"
    command_topic: "cmnd/iFan03-2/power1"
    state_topic: "stat/iFan03-2/POWER1"
    qos: 1
    payload_on: "ON"
    payload_off: "OFF"
    retain: false
```