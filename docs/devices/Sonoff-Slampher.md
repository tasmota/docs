
See this article: [Tasmota: Sonoff Slampher WiFi Bulb Holder Local Control](https://blog.hobbytronics.pk/tasmota-sonoff-slampher-local-control/) (external link)

---

I purchased a Sonoff Slampher V2 in July, 2020.  The circuit board didn't match either/any of the tutorial for getting the original or V2 devices into programming mode.  Though it's labeled "V2", the cluster of resistors/capacitors around the CPU is different; in particular the resistor at the position indicated by many of the tutorials as labelled `r9`, is instead labelled `r18`.  There does seem to be a trace attached to the GPIO0 pin on the CPU but it leads to a dead end (perhaps a via to the other side of the board).

After much screwing around, I discovered that simply holding the button while I connected to the four header pins and powered it on put it into programming mode.

I flashed it from a mac terminal window like so:

```shellsession
esptool.py --port /dev/tty.usbserial-A60226NF write_flash -fs 1MB -fm dout 0x0 ~/Downloads/tasmota.bin
```

The barcode on the box for the device that I received is 6920075757361, it's also labeled with MPN:IM190528001.  

I purchased the device from Amazon, it was titled `SONOFF Slampher R2 433MHz RF&WiFi Smart Lamp Bulb Holder for Smart Home, Compatible with Alexa and Google Assistant` and was at this URL: https://www.amazon.com/gp/product/B07TRSYJGB
