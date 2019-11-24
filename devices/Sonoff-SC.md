## Serial Connection / Flashing

Please see the [Hardware Preparation](installation/Hardware-Preparation) page for general instructions.

Flashing the ESP8266

Remove the 4 screws on the bottom.
The button is connected to GPIO0.

You will have to remove the TX jumper in the board to avoid the ATMega328P to interfere in the upload process.

Press and hold the button while powering the board to set the ESP8266 into flashing mode.
Note! After flashing you need to set the baudrate to 19200.
Don't forget to reconnect the TX jumper after flashing ;)

<img alt="SonoffSC" src="https://puu.sh/vZZRI/ff36ff9244.jpg" width="230" />
<img alt="SonoffScRemoveTX" src="https://puu.sh/vZZSi/43244f3cc1.jpg" width="230" /> 
<img alt="SonoffSCButoom" src="https://puu.sh/vZZSC/aaa140afa3.jpg" width="130" />