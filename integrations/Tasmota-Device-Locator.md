# Tasmota Device Locator

Locate Tasmota Devices on your network when you only know the subnet of the device. The search is done with JavaScript in a browser and no software installation is required. Only newer devices with HTTP Cross-Origin Resource Sharing (CORS) support will be found. CORS is disabled in Tasmota by default. Use [`SetOption73`](Commands#setoption73) to change this setting.

![Tasmota Device Locator](https://user-images.githubusercontent.com/34340210/67679904-8e3c3d80-f960-11e9-93a6-c163dd5b4a9c.png)

## Usage

Enter any IP address in the subnet and it will search for devices on the entire subnet. For example, specify 192.168.0.0 to locate all devices in the range 192.168.0.0 to 192.168.0.255.

If the devices are password protected also enter the password. The password will be tried on all devices. If they have different passwords, multiple searches must be performed.

## Run the live version
The live version can be found [here](http://tasmota.simplethings.work)

## Local Deployment
If you want to run your own server, the [Tasmota Device Locator](https://github.com/KimNyholm/tasmota-device-locator) can be served by any static http server (not https).
- Checkout the branch gh-pages.
- Copy the files to the root of the web server

## Development
Sources can be found on github, [Tasmota Device Locator](https://github.com/KimNyholm/tasmota-device-locator).
