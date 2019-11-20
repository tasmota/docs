# IR Codes Prana 150 energy recovery ventilation
See device https://prana.org.ua/models/prana_150 (Ukrainian)


**Example received Code:**
**MQT: tele/sonoffir/RESULT = {"IrReceived":{"Protocol":"NEC","Bits":32,"Data":"0x00FF00FF"}}**

**Example IRsend Command:**
**IRsend {"Protocol":"NEC","Bits":32,"Data":"0x00FF00FF"}**

* {"Protocol":"NEC","Bits":32,"Data":"0x00FF00FF"}="Power"
* {"Protocol":"NEC","Bits":32,"Data":"0x00FF807F"}="Screen/LED Brightness"
* {"Protocol":"NEC","Bits":32,"Data":"0x00FF30CF"}="Heat OFF"
* {"Protocol":"NEC","Bits":32,"Data":"0x00FF906F"}="Heat ON"
* {"Protocol":"NEC","Bits":32,"Data":"0x00FF50AF"}="Fan"
* {"Protocol":"NEC","Bits":32,"Data":"0x00FFA857"}="Anti freeze"
* {"Protocol":"NEC","Bits":32,"Data":"0x00FFB04F"}="Night Mode"
* {"Protocol":"NEC","Bits":32,"Data":"0x00FF708F"}="Fan -"
* {"Protocol":"NEC","Bits":32,"Data":"0x00FF28D7"}="Fan +"
* {"Protocol":"NEC","Bits":32,"Data":"0x00FF609F"}="Night Mode Fan -"
* {"Protocol":"NEC","Bits":32,"Data":"0x00FF10EF"}="Night Mode Fan +"


![image](https://user-images.githubusercontent.com/563412/61618791-4aa5a980-ac76-11e9-850a-3bf920a3b32b.png)

