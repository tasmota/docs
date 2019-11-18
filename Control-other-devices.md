## Double press & hold

It is possible to control another device from remote by using following options:

From version 5.1.6 on, hold button functionality for both the push button AND the external push button was implemented. 

If a ButtonTopic (and if [SetOption1](commands#SetOption1) (=ButtonRestrict) is `ON`) or [SwitchTopic](commands#SwitchTopic) (and SwitchMode = `5` or `6`) has been defined and a button is pressed longer than define KEY_HOLD_TIME (default 4 seconds) a MQTT message like `cmnd/%topic%/POWER HOLD` will be sent. `HOLD` message can be changed with command [StateText4](commands#StateText4).

Command [`SetOption11`](commands#setoption11) `ON / OFF` allows for swapping the functionality of the push button.

These changes result in the following table [(larger image)](https://user-images.githubusercontent.com/5904370/53023433-89cc9600-345d-11e9-8de3-9c89fb7af2f1.png):

![Action matrix](https://user-images.githubusercontent.com/5904370/53023433-89cc9600-345d-11e9-8de3-9c89fb7af2f1.png)

### Example

You can control a ceiling fan from a Sonoff Touch:<br>
If your standard topic of Sonoff Touch is `light` and the ceiling fan topic is `ceilingfan` issue these commands on the Sonoff Touch to activate the double press feature.
```
buttontopic ceilingfan
setoption11 1
```

Taken from the discussion:
[https://github.com/arendst/Tasmota/issues/200#issuecomment-343756826](https://github.com/arendst/Tasmota/issues/200#issuecomment-343756826)

[Example using Rules](https://github.com/arendst/Tasmota/wiki/Rule-cookbook#16-using-an-external-button-with-single-press---double-press-and-hold)
