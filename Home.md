
<img style="margin: 10px 10px; float:right; width:40%" src="_media/frontlogob.svg" alt="Tasmota Logo"></img>

<!-- <img src="https://user-images.githubusercontent.com/5904370/55973675-661c1400-5c86-11e9-8453-0082bfcd61b6.png" width="200" align="right"> </img> -->
<span style="font-size:25px">Latest release:</span>

<span style="font-size:45px;">7.1.1 Betty</span>

<!-- <img src="https://user-images.githubusercontent.com/5904370/55974399-d4ada180-5c87-11e9-99cc-316220bf5e95.png" align="right" width=200></img> -->

[![GitHub download](https://img.shields.io/github/downloads/arendst/Tasmota/total.svg?style=flat-square&color=green)](https://github.com/arendst/Tasmota/releases/latest)
[![License](https://img.shields.io/github/license/arendst/Tasmota.svg?style=flat-square)](https://github.com/arendst/Tasmota/blob/development/LICENSE.txt)
[![Chat](https://img.shields.io/discord/479389167382691863.svg?style=flat-square&color=blueviolet)](https://discord.gg/Ks2Kzd4)
[![donate](https://img.shields.io/badge/donate-PayPal-blue.svg?style=flat-square)](https://paypal.me/tasmota)


### What's New?

<!-- tabs:start -->

#### **2019-12-04**
Remember that official Tasmota firmware flashing tool from a month ago? Pfft, old news! 

We present to you the even more official, completely home made and GMO free: **TASMOTIZER!**

[<img src="https://user-images.githubusercontent.com/11555742/69891714-ec14ca00-12fe-11ea-9140-92842fa1bff9.jpg" width=300></img>](https://github.com/tasmota/tasmotizer) 

It downloads the latest release/development firmware for you, backs up the original firmware with one-click and can even (if you wish so) send your default settings to the device after it's flashed. But most of all it has a dark theme, so it must be good!

#### **2019-11-29**
Tasmota v7.1.1 [Betty](https://www.youtube.com/watch?v=9iEoq8qZZK8) is released. Read [Moving to v7](moving-to-v7) on all the breaking changes and how to deal with them.

This release is chock full of changes and improvements! 
* Everything is Tasmota now, Sonoff-Tasmota is no more.
* WebUI went to the dark side but managed to pick up colorpicker powers on the way. 
* Default and only supported Arduino cores are >2.6.
* Expanded [TuyaMCU](TuyaMCU) support with new commands.
* Better [I2C device](I2CDevices) address management.
* [Zigbee](Zigbee) devices support.

and more...

Oh, there's also this swanky new Tasmota documentation site on http://tasmota.com.
 

#### **2019-11-15**
We present the official Tasmota firmware flashing tool:  
   
[<img src="https://raw.githubusercontent.com/tasmota/tasmota-pyflasher/v1/images/splash.png" width=300></img>](https://github.com/tasmota/tasmota-pyflasher) 

#### **2019-10-26**
[Tasmota v6.7.1 Allison](../releases/tag/v6.7.1) releases with a fix for the bug causing serious issues in power monitoring devices. 

#### **2019-10-25**
[Tasmota v6.7.0](../releases/tag/v6.7.0) is released bringing support for [blind and shutters](Commands#blinds-shutters-and-roller-shades), [deep sleep and wake up pin](DeepSleep). [Tuya component](tuyamcu) is more customisable supporting a wider range of devices and a plethora of new sensors. Support for [Zigbee](Zigbee) devices is in a nascent stage of development.    
Besides that there are bug fixes and improvements and on top of all that: better support for iFan03, Shelly 2.5, a rewrite of the light driver and the default Arduino core is now pre2.6. Last, but not least, the new tasmota-ir.bin build that has fully featured IR support but at the cost of other features.

_In with the new, out with the old!_    
Some outdated features have been removed so wave goodbye to: WPS, SmartConfig, tasmota-classic.bin build and Setoptions 2, 34, 41, 44, 45, 46, 65, 66 and 69

#### **2019-10-10**
Tasmota development branch is undergoing a big code rewrite of the light driver. Some things might break in the process, be aware of that if you're installing the daily build on a critical device and make sure to report any [issues](https://github.com/arendst/Tasmota/issues).

<!-- tabs:end -->

### Community
See [Discord](https://discord.gg/Ks2Kzd4), [Telegram](https://t.me/tasmota) or [Community Forum](https://groups.google.com/d/forum/sonoffusers) for feedback, questions and troubleshooting.

### Contributing
You too can [contribute](Contributing) to the Tasmota project.
