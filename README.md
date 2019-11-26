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

> [!DANGER|style:flat]
> `> [!DANGER|style:flat]`

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
### Connection

I2C:
![](https://img.shields.io/static/v1?label=sensor&message=i2c&color=blue ":no-zoom")
GPIO:
 ![](https://img.shields.io/static/v1?label=controller&message=gpio&color=purple ":no-zoom")
ADC:
 ![](https://img.shields.io/static/v1?label=output&message=adc&color=orange ":no-zoom")
Serial:
 ![](https://img.shields.io/static/v1?label=connection&message=serial&color=seagreen ":no-zoom")
Serial:
 ![](https://img.shields.io/static/v1?label=connection&message=spi&color=slategrey ":no-zoom")
Tuya:
 ![](https://img.shields.io/static/v1?label=connection&message=tuya&color=orangered ":no-zoom")



