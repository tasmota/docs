This device is a RGBW led controller and need a different setup against the ex Arilux LC01

You can configure it as a "generic module"

And set the GPIO as follow:

Red:
* D1 GPIO5 = 33 PWM1

Blue:
* D6 GPIO12 = 35 PWM3

White:
* D7 GPIO13 = 36 PWM4

Green:
* D5 GPIO14 = 34 PWM2

[Learn more about Arilux devices](devices/MagicHome-with-ESP8285)