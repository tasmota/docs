Amazon Link: https://www.amazon.com/Tempered-Controlled-Separately-Standard-Compatible/dp/B0719Q5G5B/ref=sr_1_3?ie=UTF8&qid=1540511385&sr=8-3&keywords=xenon+light+switch&dpID=21PWx5MUrEL&preST=_SY300_QL70_&dpSrc=srch

Also sold as the Mojocraft Wireless Smart Wall Switch 2 Gang: https://www.amazon.com/Mojocraft-Wireless-Sensitive-Compatible-Required/dp/B072JCWH23/ref=sr_1_3?ie=UTF8&qid=1540858092&sr=8-3&keywords=Mojocraft

I didn't spot any headers, but device has a sub-board with an ESP-12 module on it. Solder right to the 3.3V, Ground, TX, RX, and GPIO pins and flash away. I set the device up as a generic device with the following assignments. 

* GPIO 3 is button 2
* GPIO 4 is relay 2
* GPIO 12 is button 1 
* GPIO 13 is relay 1