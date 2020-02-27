Very cheap outlet with USB-charger functionality (supposed to deliver 2A, have to test this though) and real 16A relay:

[Winfuture price comparison](https://winfuture.de/preisvergleich/1417869601)

Device Images
![](https://user-images.githubusercontent.com/2738932/46142043-f4362d00-c255-11e8-9244-35f89c34f068.jpg)
![](https://user-images.githubusercontent.com/2738932/46142044-f4362d00-c255-11e8-8e95-b0de09f29da0.jpg)
![](https://user-images.githubusercontent.com/2738932/46142045-f4362d00-c255-11e8-840a-f0f3701b81db.jpg)
3.3V, GND and GPI00 are accessible on the main board.
The used TYWE3S board unfortunately does not have easily reachable solderpads for TX/RX, but I managed to solder with a normal 60W iron between main board and TYWE3S board:
![](https://user-images.githubusercontent.com/2738932/46142046-f4362d00-c255-11e8-9210-e83dcb495e19.jpg)

Works perfectly with Tasmota 6.2.1 and the same configuration like [SM-PW701E Socket Board: TYWE3S](devices/TYWE3S)
