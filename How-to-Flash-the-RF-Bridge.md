
Someone asked me on here a more detailed explanation of how to do this, so I thought I would post (as best as I can recall) how to do it with a Windows PC.

- The Sonoff RF Bridge firmware is uploaded Like any other ESP device. Please refer to the [flashing](installation/Flashing) instructions.

- Ensure the switch on your RF Bridge is switched of the OFF position (change it back to ON position AFTER flashing your Bridge).

- Connect up your USB serial adapter to the correct pins on the bridge. Hold DOWN the pairing button while connecting the USB serial adapter to your computer (the bridge should now go into the correct mode where you can flash it). (Pin out etc on the below image)
    ![pin](https://i.imgur.com/djhr2Jg.jpg)

- At the top right of the Arduio IDE software, click on the right arrow (UPLOAD) to upload the firmware. This should take about 2-3 minutes as it compiles the firmware then uploads it.

  When compete, disconnect the cables etc, switch the switch back to the ON position (away from the 5 pin header) and it should now be working as you expect.

Credits @erew123 #1841
