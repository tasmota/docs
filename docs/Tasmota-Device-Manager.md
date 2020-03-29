[Tasmota Device Manager](https://github.com/jziolkowski/tdm) or TDM is a GUI application written in Python for discovery and monitoring of Tasmota flashed devices.

![Screenshot](https://user-images.githubusercontent.com/11555742/66050573-bf764900-e52d-11e9-8356-e3dbf4ef6205.png ':size=300')

# Features

 - clean, readable interface
 - autodetection of devices following the default topic template for Tasmota (%prefix%/%topic%/) and for HomeAssistant Auto Discovery protocol (%topic%/%prefix%/)
 - module and GPIO configuration
 - rules editor
 - devices with different syntax can be added manually
 - clean retained MQTT topic messages
 - toggleable active querying of telemetry
 - passive monitoring of state and telemetry (currently supported sensors are listed in "status8.json")
 - relay control via context menu on device list (all ON/OFF, or individual)
 - MQTT console with payload preview (dbl-click an entry to display), sorting and filtering
 - selectable detail columns in device list
 - BSSID aliasing for larger deployments

# Installation

Python 3.6+ is required. Clone the [repo](https://github.com/jziolkowski/tdm) or download zip and extract, install prerequisites and run tdm.py using Python binary.

### Prerequisites
>PyQt5: <pre>pip install PyQt5</pre>
>
>paho-mqtt: <pre>pip install paho-mqtt</pre>
