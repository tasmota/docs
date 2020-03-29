<img alt="Exterior" src="https://github.com/arendst/arendst.github.io/blob/master/media/wkaku1a.jpg?raw=true" width="170" align="left" />
<img alt="Kaku" src="https://github.com/arendst/arendst.github.io/blob/master/media/kaku2a.jpg?raw=true" width="170" align="right" /> 
The Dutch Klik Aan Klik Uit PAR-1000 434MHz Power socket might suffer from Capacitor degeneration. In effect the power needed to engage the relay is too low. Replacing the Yellow Capacitor often solves the problem.
<br/>
<br/>
I have several of these lying around and they can be used very well with sonoff functionality. As the sonoff PCA is a bit too large I decided to design my own PCA using kicad.
<br/>
<br/>
<img alt="wKaku prototype" src="https://github.com/arendst/arendst.github.io/blob/master/media/wkaku2a.jpg?raw=true" width="170" align="left" /> 
<img alt="wKaku v1.3" src="https://github.com/arendst/arendst.github.io/blob/master/media/wkaku4a.jpg?raw=true" width="170" align="right" /> 
During Proof of Concept I used 5V power supplies from itead. After three units were built one crashed caused by debris on the PS PCA resulting in an AC short which in turn blew the large resistor. As the selected Songle relay has the control leads close to the AC leads I also changed the relay.
<br/>
<br/>
I decided to select the HiLink 5V power supply as it was also favourable on other sites. The relay now has the same connections as the one used in sonoff.
<br/>
<br/>
<img alt="wKaku parts" src="https://github.com/arendst/arendst.github.io/blob/master/media/wkaku5a.jpg?raw=true" width="170" align="left" /> 
<img alt="wKaku pca" src="https://github.com/arendst/arendst.github.io/blob/master/media/wkaku6b.jpg?raw=true" width="170" align="right" /> 
The parts used are:<br/>
= HiLink 5V power supply HLK-PM01 (aliexpress)<br/>
= 5V to 3V3 step down (aliexpress)<br/>
= 5V relay OJE-SH-105DM (ebay)<br/>
= ESP12-F (aliexpress)<br/>
= Capacitors and led from kaku PCA<br/>
= 2 x 1k and 1 x 10k Resistors

The image on the right shows how I mounted the ESP12-F vertically. Notice the 10k resistor from GPIO15 to the board.

The firmware used is sonoff without modification!
