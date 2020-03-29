Even though LEDs consume far less energy than incandescent bulbs, these devices contain more complex circuitries and sometimes they still produce more heat than they can handle.
The produced heat is proportional to the LED intensities, and if it builds up faster than how it dissipates from the chassis, then the temperature will rise.

The circuitries usually (but **not necessarily**) contain some last-resort countermeasure that shuts down the device when it is critically overheated, but it shouldn't be relied upon.

When testing the device for the first time, especially at higher light intensities, **monitor its temperature for some time**, like for at least half an hour, and if it rises rapidly, then please consider:

- Reducing the overall brightness
- Using only one of the light sources (i.e. either the color LEDs, or the high-power white ones)

For such a test use an electrically safe lamp in which you can access the bulb, and which you can easily disconnect from the mains anytime. For measuring the temperature the best tool is an IR thermometer: aim it at the heatsink part of the chassis from a direction perpendicular to it, from such a distance that its cone of sensitivity is fully on the chassis. If you choose to test the temperature by hand, then be prepared that it may be **hot**, so approach it slowly, and if you already feel its heat, then **don't touch it**.

During this check please also consider that a bulb standing on your desk in a test socket has considerably better cooling than one in a closed armature right below your ceiling, so try to 'model' the operating conditions in which you plan to use the device.

If you have found a solution that keeps the temperature stable, don't forget to **configure a limit in your home automation system** so you (or anyone else) won't accidentally set the device to overheating when it'll be already installed.

Some of the devices' original firmwares do contain such software throttling, but as the thermal behaviour differs from one model to another, there is no generic way to apply the *right amount* of throttling that would be both required and enough for everyone, so "your mileage may vary".


## Technical background

Light bulb circuitries consist of 3 main stages:

- A small power supply unit that converts the 230V or 110V mains to approx. 20V for the LEDs and 3.3V for the controller.
   This is a small switching-mode power supply, but usually of a parsimonius design, so it's usually barely adequate for the **average** power requirement, and sometimes not enough for the **maximum**.

   The main problem is not the transformer, but the voltage regulators: they produce heat proportionally to the current that's drawn through them, and **they aren't connected to the heatsink**, so all their heat goes just into the air within the bulb.

- The controller module, usually a SoC that contains the CPU, memory, flash and wifi.
   It is a logic circuit, its heat production is negligible compared to the other stages.

- The LED circuitry, meaning the LEDs themselves and their driver chips, usually on a separate board.
   They produce a lot of heat, but they are always connected to the chassis via either thermal grease or thermally conductive glue.

So the problems are:
- Voltage regulators produce heat proportional to light intensity
- Their thermal coupling to the chassis is terrible: via a huge air gap
- The chassis is not an effective heatsink (for aesthetic reasons it can't be)
- The overall system is designed for the average conditions and not for the maximum.

Thus our goal is to limit the power consumption to such a level that the heat produced can be dissipated by the chassis heatsink, and the way to achieve this is throttling down the light intensity and/or limiting the switched-on time.

## Measured values

### SYF05 (Fcmila/Sunyesmart)

- At start: 23°C
- After 10 minutes: 40°C (warm)
- After 20 minutes: 48°C (hot)
- After 30 minutes: 53°C (barely touchable)
- After 40 minutes: 55°C

At this point the thermal protection has shut the device down, and the local temperatures were:
- Chassis: 55°C
- RGB LED driver chip: 73°C
- White LED driver chip: 76°C
- Controller module: 76°C
- Transformer: 85°C
- Area around the voltage regulator: 91°C


### Sonoff B1

- At start: 26°C
- After 10 minutes: 33°C
- After 20 minutes: 40°C
- After 30 minutes: 44°C
- After 40 minutes: 47°C
- After 50 minutes: 48°C
- After 1 hour: 50°C

The bulb was operational at this point, but I considered this temperature too high for sustained use.
