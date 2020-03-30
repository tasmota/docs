How to setup and configure "OTA over SCP" upload for PlatformIO. The uploader pushes .bin files to remote OTA server using SCP (SSH connection). Images can be served to Tasmotas from there.

# Configuration
To upload .bin images to OTA server using SCP, edit the following lines under target environment:
```
; *** Upload file to OTA server using SCP
upload_port = USER@HOST:/path
extra_scripts = pio/sftp-uploader.py
```
upload_port should be modified to reflect user, host and path on the host where images should be uploaded.

# Requirements
SSH communication between the build server and OTA server should be pre-configured so that it doesn't require password (pre-shared keys).

## Add the pre-shared key
On a linux client machine type the following to generate the key. Press enter three times (without any input):
```
ssh-keygen -t rsa -C "YOUR OWN KEY DESCRIPTION"
```
Copy the key to your ssh server. You need to confirm this action. Use your server ssh password (one last time):
```
ssh-copy-id -i ~/.ssh/id_rsa.pub USER@HOST
```
_Optionally, reload the ssh service:_
```
sudo /etc/init.d/ssh restart
```

# Upload Tasmota
Easy compilation and upload can be performed from the icons at the left side of the PlatformIO screen or use `Ctrl` + `Alt` + `U` to upload (will build if needed).