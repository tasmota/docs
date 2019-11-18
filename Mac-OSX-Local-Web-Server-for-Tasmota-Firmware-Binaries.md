Mac OSX comes with a built in web server, although it's not running by default. Starting the web server can be done by running:  
```bash
sudo apachectl start
```

To start the server, you'll be asked for your user's password.

Opening [your localhost](http://localhost) will show you 'it works!', which will tell you that much - it works.

The folder to put files in is  
```bash
/Library/WebServer/Documents
```

You may wish to create a subfolder for the firmware files.  

Use the IP address of this local web server to OTA flash Tasmota. You can determine your IP address [here](https://www.whatismybrowser.com/detect/what-is-my-local-ip-address). For example,  
```bash
http://192.168.1.123/tasmota-basic.bin
```

Issue this command to stop the web server when your are done flashing:  
```bash
sudo apachectl stop
```

_Note: The MAMP web server does not seem to deliver the results as expected!_