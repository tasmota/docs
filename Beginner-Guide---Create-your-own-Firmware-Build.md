
## Preparation
You can use Atom to build your own firmware. In this guide Atom on Windows 10 x64 is described.

* Download Atom from [atom.io](https://atom.io/) ([Direct Download](https://atom.io/download/windows_x64))
* Run the setup

After the setup is done, Atom should be started already. Now you need to install the platform.io IDE for Atom:
* Top Menu: File > Settings > Install
* Now you can search for a package. Search for platform.io IDE
* Choose platformio-ide and hit the Install Button
![](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota-wiki-beginner-guide/1.jpg)

* Atom will ask you to install Clang now, do this by clicking on "Install Clang"
![](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota-wiki-beginner-guide/2.jpg)
* A new website will popup. Scroll down to "II. Clang for Intelligent Code Completion" and hit the Download Button.
If the download is done, start the setup. Please select "Add LLVM to the system PATH" option on the installation step.
![](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota-wiki-beginner-guide/3.jpg)
![](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota-wiki-beginner-guide/4.jpg)

* After you have installed Clang close the website and go back to Atom. After Atom has installed all Packages you need to restart Atom. 
![](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota-wiki-beginner-guide/5.jpg)

You got Atom with Platform.io ready now.


## Building the firmware
First you need to get the Source files from Github.

Go to the [Code Page](https://github.com/arendst/Tasmota/tree/development).

Now you can change the Branch(1). I suggest you to use the development Branch.

Then click on "Clone or Download"(2) and choose "Download Zip"(3)
![](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota-wiki-beginner-guide/6.jpg)

Go to the location you saved the ZIP and unzip it by right clicking it and choose "Extract All". 

Back to Atom open the PlatformIO Home Tab (should be open already).

Click on "Open Project" and choose the unzipped folder you just downloaded. Be sure that the platformio.ini file is there. **This is important to load the custom platformio.ini file.**
![](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota-wiki-beginner-guide/7.jpg)
![](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota-wiki-beginner-guide/8.jpg)

In the left Sidebar create a file in the sonoff folder called user_config_override.h and change your default configuration in this file. I suggest you to read everything in my_user_config.h and adapt everything to your needs.

If you are done press ctrl+s to save the file.
![](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota-wiki-beginner-guide/9.jpg)

At last go to PlatformIO Menu and click on "Build". Atom is now starting to compile the firmware.
To speed up the compiling, you can uncomment your preferred language in the platformio.ini file (remove the ";" from one line, don't forget to save ctrl+s).
![](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota-wiki-beginner-guide/10.jpg)
![](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota-wiki-beginner-guide/11.jpg)

After its done, you can find the firmware in the .pioenvs directory in the unzipped folder.   
Attention: .pioenvs is a hidden folder on unix systems.
![](https://raw.githubusercontent.com/reloxx13/reloxx13.github.io/master/media/tasmota-wiki-beginner-guide/12.jpg)
