!!! info "This feature is included only in tasmota-sensors.bin"

"BME280 sensor, an environmental sensor with temperature, barometric pressure and humidity", [see Datasheet.](https://ae-bst.resource.bosch.com/media/_tech/media/datasheets/BST-BME280_DS002.pdf)

"tasmota-sensors.bin is needed for this to work. tasmota.bin and tasmota-lite.bin do not include the necessary driver."

## Connect BME280 to Sonoff-Basic [based on the GPIO locations](Sonoff-Basic.md)

* BME280-3.3V -> Sonoff-3.3V
* BME280-GND -> Sonoff-GND
* BME280-SCL -> Sonoff-TX
* BME280-SDA -> Sonoff-RX

![Wiring BME280 with Sonoff BASIC](https://user-images.githubusercontent.com/34340210/66658472-8dd93e00-ec0f-11e9-923b-4183cde09cda.jpg)

NOTE:   
YOU NEED TO DISABLE SERIAL LOG COMPLETELY TO ALLOW SENSORS ON TX/RX PINS


On the Tasmota web interface go to `Configuration->Configure Module` and set

![GPIO setting](https://raw.githubusercontent.com/tasmota/docs/master/docs/_media/BME280-Tasmota-GPIO-Setting.png)
