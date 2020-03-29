[Wi-Fi Curtain Motor](https://www.aliexpress.com/item/32957276089.html)

Applicable Tuya Serial Protocols Communication can be found [here](https://github.com/arendst/Tasmota/files/3658412/protocol_CurtainM_20190926.pdf) if you wish to explore and implement the entire functionality.  

Don't forget to share what you have discovered and tested here in wiki :smiley:  

functionId and dpId Setup:  
```
stat/tasmota/RESULT = [{"fnId":11, "dpId":1},{"fnId":12, "dpId":101},{"fnId":13, "dpId":103}]
```

`55aa0007000501010001010f` -> auto power mode is on (TBD)  
`55aa00070005650400010075` -> Curtain motor is opening or opened  
`55aa000700086602000400000032ac` -> Control percentage 50%  
`55aa00070005670100010074` -> report working state ( opening or closing )  
`55aa000700086802000400000032ae` -> report percentage   


dpIds  
`01` -> Auto power mode on or off ( Can be configured as relay )  
`0x65` `101` -> Curtain mode ( open / close / stop)  
`0x66` `102` -> Curtain open percentage  
`0x67` `103` -> report work state  
`0x68` `104` -> Curtain percentage report only  

Commands  
`SerialSend5 55aa00060005650400010276` Forward  
`SerialSend5 55aa00060005650400010074` Reverse  
`SerialSend5 55aa00060005650400010175` Stop  

Additional Possible Commands (Untested)  
`SerialSend5 55aa000600086802000400000032ad` Should open curtain to 20%  
or  
`SerialSend5 55aa000600086602000400000032ab` should open curtain to 20%  

Commands may be necessary to start opening after setting the percentage.  
`SerialSend5 55aa0006000501010001010e` -> Should enable auto close mode  
`SerialSend5 55aa0006000501010001000d` -> should disable auto close mode  

If you send the direction changing too fast (from open to close and vice versa), the motor may be blocked by built in failsafes. Consider sending delay (1 sec) before changing direction. For example, these commands work and don't make the motor block:  
`Backlog delay 10; SerialSend5 55aa00060005650400010276` open  
`Backlog delay 10; SerialSend5 55aa00060005650400010074` close  
`Backlog delay 10; SerialSend5 55aa00060005650400010175` stop  

And if you use html requests:  
`http://ip/cm?cmnd=backlog%20delay%205%3B%20SerialSend5%2055aa00060005650400010276` open  
`http://ip/cm?cmnd=backlog%20delay%205%3B%20SerialSend5%2055aa00060005650400010074` close  
`http://ip/cm?cmnd=backlog%20delay%205%3B%20SerialSend5%2055aa00060005650400010175` stop  

![The motor](https://user-images.githubusercontent.com/16508296/65697684-01ae0f00-e084-11e9-91d5-eb85f312ef84.jpg)
![Inside](https://user-images.githubusercontent.com/16508296/65697737-1d191a00-e084-11e9-8752-6d5d78ce8abf.jpg)
![Soldering 1](https://user-images.githubusercontent.com/16508296/65697782-31f5ad80-e084-11e9-94d5-5e12d3aa278c.jpg)
![Soldering2](https://user-images.githubusercontent.com/16508296/65697826-4a65c800-e084-11e9-9129-16e61f57c3b7.jpg)
![TYWE3S chip](https://user-images.githubusercontent.com/16508296/65697877-5c476b00-e084-11e9-99e2-d0a96cea5096.jpg)
