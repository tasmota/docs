## Introduction
Tasmota firmware can be upgraded using 'Firmware Upgrade' option on the main menu and selecting an OTA URL to fetch (and flash) a new firmware on the device.  

<p align="center">
  <img src="https://github.com/arendst/arendst.github.io/blob/master/media/fw-upgrade-menu.png">
</p>

To use this feature, firmware files need to be hosted on an HTTP web server (e.g., http://thehackbox.org/tasmota). Alternatively, users can to deploy a local HTTP server with Apache, Nginx, or other software solutions.  

Python makes available the [Flask (micro)framework](http://flask.pocoo.org) that can be used at different levels of complexity due to its modular architecture. [A simple HTTP server](http://flask.pocoo.org/docs/1.0/quickstart/#a-minimal-application) (hello-world) can be deployed with only *six* lines of Python code.  

A Flask application to offer Tasmota firmware images for OTA upgrades is available as part of the available [tools](https://github.com/arendst/Tasmota/tree/development/tools/fw_server/).  

## Requirements
* Switching to superuser privileges and installing additional packages (and libraries) on a Linux/Windows box.
* Python3 (follow instruction related to your operating system)
* netifaces and Flask libraries - can be installed by 'pip' package manager:
  ```
  pip install netifaces flask
  ```

## Instructions
Copy Tasmota firmware binary files in 'tools/fw' directory. A set of pre-built firmware binary files can be downloaded from the Tasmota [repository](http://thehackbox.org/tasmota).

Configure your Tasmota device with your firmware server URL:  
```
Firmware Upgrade -> Upgrade by web server:
     http://<ip_address>:5000/tasmota.bin
```

or use the following command:  
```
Backlog OTAURL http://<ip_address>:5000/tasmota.bin; Upgrade 1
```

## Usage
To start Python HTTP server:  
`python fw-server.py -d <net_iface>   (default: eth0)`  
  or  
`python fw-server.py -i <ip_address>`  

Example:  
`python fw-server.py -d wlan0`  
  or  
`python fw-server.py -i 192.168.1.1`  

**Note:** On Windows it is advisable to use '-i' option because Windows uses UUID naming for network interfaces that are difficult to enter.  

## Linux server:
If your MQTT broker is hosted on a local server, you may want your firmware web server used for Tasmota OTA updates to reside on the same server. Follow these steps to create it as a service:  
- Copy the python script on the Linux server:  
  ```
  $ sudo su
  # mkdir /srv/tasmota/fw_server/fw
  # cd /srv/tasmota/fw_server
  # wget https://github.com/arendst/Tasmota/tree/development/tools/fw_server/fw-server.py
  ```
- Create a new file named `tasmota.service` in `/etc/systemd/system/` and paste these lines (replace `XYZ` by your username):  
  ```
  [Unit]
  Description=Local OTA server for Tasmota
  Requires=network.target
  After=network.target multi-user.target
 
  [Service]
  User=XYZ
  Type=idle
  ExecStart=/usr/bin/python /srv/tasmota/fw_server/fw-server.py -d wlan0
  Restart=on-failure
 
  [Install]
  WantedBy=multi-user.target
  ```
- User rights:  
  The files and directories have been created as `root` but this is not desirable. Invoke the following commands (replace the four instances of `XYZ` by your username):  
  ```
  # chown -hR XYZ:XYZ /srv/tasmota
  # chown XYZ:XYZ /etc/systemd/system/tasmota.service
  ```
- Run the service:  
  ```
  # systemctl daemon-reload
  # systemctl enable tasmota.service
  # systemctl start tasmota.service
  ```

   If the server is rebooted, the service will automatically restart.  
- Check that the service is active and running:  
  ```
  # systemctl status tasmota.service
  ```
- Test the server:  
  Copy new firmware files to the `/srv/tasmota/fw_server/fw` folder. Ensure that they have `XYZ` user rights in a similar fashion as shown above. You can use `scp` or a `samba` share.  Copy the firmware files into the folder (`firmware.bin` in the example below).  

  The service can be tested from any browser by issuing the address `http://<ip_address>:5000/firmware.bin` were `<ip_address>` is the address of the Linux server.  

- If the web server becomes unresponsive:  
  After a power failure, your wlan0 IP may resolve to an invalid value like `169.254.5.153` because your LAN gateway was not ready when the web server restarted. If you notice that the OTA mechanism is broken, try to download the file from a browser. If you can't, then restart the service and check the status. Log in using a terminal session and enter:  
  ```
  $ sudo su
  # systemctl restart tasmota.service
  # systemctl status tasmota.service
  ```
  If you recognize the IP address of your server on the last line of the status output, the web server should be OK. You can confirm that your OTA web server is restored by trying to download a file using your web browser.  

- PlatformIO:  
  If you want PlatformIO to be able to upload your compiled binaries to the local server, you'll still have to setup `ssh` with `ssh-keygen` in order to use the Tasmota script `pio/sftp-uploader.py` without a password.
