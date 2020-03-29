### Version 8.1.0 Doris

- Change Settings text handling allowing variable length text within a total text pool of 699 characters
- Change Smoother ``Fade`` using 100Hz instead of 20Hz animation (#7179)
- Change number of rule ``Var``s and ``Mem``s from 5 to 16 (#4933)
- Change number of ``FriendlyName``s from 4 to 8
- Add commands ``WebButton1`` until ``WebButton16`` to support user defined GUI button text (#7166)
- Add support for max 150 characters in most command parameter strings (#3686, #4754)
- Add support for GPS as NTP server by Christian Baars and Adrian Scillato
- Add support for ``AdcParam`` parameters to control ADC0 Moisture formula by Federico Leoni (#7309)
- Add Zigbee coalesce sensor attributes into a single message
- Add Zigbee better support for Xiaomi Double Switch and Xiaomi Vibration sensor
- Add Deepsleep start delay based on Teleperiod if ``Teleperiod`` differs from 10 or 300