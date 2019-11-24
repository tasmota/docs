# Tasmota Documentation
This is the repo for documentation of the Tasmota open source alternative firmware for ESP8266 available from https://github.com/arendst/Tasmota 

## Editing Files

Use normal markdown syntax with some enhancements

## Enhancements


### Disable click on zoom for an image
Images support click on zoom function. If you don't want to use it:
```
![](image.png ":no-zoom")
```
### Image resizing
Due to click on zoom you can directly link to a big image but make it render smaller on the page:

```
![logo](https://docsify.js.org/_media/icon.svg ':size=50x100')
![logo](https://docsify.js.org/_media/icon.svg ':size=100')

<!-- Supports percentage -->

![logo](https://docsify.js.org/_media/icon.svg ':size=10%')
```

### Rendering Alert Tags

Blockquotes `>` can now look even fancier:

?> =`?>`

!> = `!>`

> [!TIP]
> `> [!TIP]`

> [!DANGER]
> `> [!DANGER]`

> [!NOTE]
> `> [!NOTE]`

> [!EXAMPLE]
> `> [!EXAMPLE]`

### Creating Tabs
Tabs inside tabs are not supported.

```
<!-- tabs:start -->

#### ** First Tab Title **

Hello!

#### ** Second Tab Title **

Bonjour!

#### ** Third Tab Title **

Ciao!

<!-- tabs:end -->
```

## Shields color codes

I2C:
<img src="https://img.shields.io/static/v1?label=&message=i2c&color=blue" style="float:right"> </img> 

GPIO:
 <img src="https://img.shields.io/static/v1?label=&message=gpio&color=purple"  style="float:right"> </img> 

ADC:
 <img src="https://img.shields.io/static/v1?label=&message=adc&color=orange"  style="float:right"> </img> 

Serial:
 <img src="https://img.shields.io/static/v1?label=&message=serial&color=seagreen"  style="float:right"> </img> 

Serial:
 <img src="https://img.shields.io/static/v1?label=&message=spi&color=slategrey"  style="float:right"> </img> 

Tuya:
 <img src="https://img.shields.io/static/v1?label=&message=tuya&color=orangered"  style="float:right"> </img> 
