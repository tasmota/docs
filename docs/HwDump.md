# Hardware Dump :material-cpu-32-bit:

??? failure "This feature is not included in precompiled binaries"
    When [compiling your build](Compile-your-build) add the following to `user_config_override.h`:
    ```arduino
    #define USE_HWDUMP
    ```
    Code size increase can go up to +22KB, so this is meant for debug builds only.

`HwDump` writes to the log the full low-level hardware configuration of the MCU, as it is actually programmed in the chip registers: GPIO pads, IO_MUX, GPIO matrix routing, and the main peripherals. It complements [`Gpio`](Commands.md#gpio) (which shows what Tasmota *intends* to use) by showing what the silicon is *really* doing. Typical uses:

- check that a pin is really routed to the expected peripheral signal (for example `RMT_SIG_OUT0` for a WS2812 or `FSPID_OUT` for SPI MOSI)
- find pins taken by the ESP-IDF or the Arduino core behind Tasmota's back (flash, PSRAM, USB, console UART)
- verify pull-up/pull-down, drive strength, open drain or inversion of a pin
- inspect PWM (LEDC) timers and duty, UART baud rate, SPI clock, I2C speed, sleep and wakeup configuration

Supported targets: ESP32, ESP32-S2, ESP32-S3, ESP32-C3, ESP32-C5, ESP32-C6 and ESP32-P4. On other targets the command responds `Target not supported`.

The command only reads registers (through ESP-IDF driver and LL calls), it never writes anything. Registers with read side effects (UART, I2C, RMT or USB FIFOs) are never accessed, and a peripheral is only read when its bus clock is enabled and it is out of reset, otherwise it is reported as `peripheral clock disabled or in reset`.

## Usage

Type `HwDump` in the console. Output is sent to the log at `INFO` level.

!!! tip "Use the serial console for full output"
    The dump is long and goes through the log ring buffer, so it can be truncated in the web console. The serial console (or [`SerialLog 2`](Commands.md#seriallog) with a serial monitor) always gets everything.

Output sections, in order (each one only when supported by the SoC):

Section|Content
:---|:---
`GPIO`|One line per GPIO: pad, Tasmota component, IO_MUX function, GPIO matrix routing and electrical settings
`LEDC`|PWM clock, timers (divider, resolution, frequency) and channels (timer, duty, pins)
`RMT`|RMT clock and per-channel configuration (TX/RX, divider, tick, idle level, carrier, pins)
`I2S<x>`|I2S clocks and configuration, ESP32 `clk_out` pins
`SPI<x>`|SPI2/SPI3 role, mode, clock, bit order, duplex, DMA and pins (FSPI/HSPI/VSPI, not the flash SPI)
`I2C<x>`|I2C mode, clock, approximate SCL frequency, bus state, FIFO and pins
`UART<x>`|UART clock, baud rate, frame format, flow control, inversion, FIFO and pins
`USB-Serial-JTAG`|Built-in USB CDC/JTAG controller: console, pads, host activity, endpoint and interrupt status
`RTC_IO` / `LP_IO`|Pads of the RTC (or Low Power) domain, used during deep sleep and by the ULP/LP core
`SLEEP`|Last wakeup cause, power management, enabled wakeup sources, ext0/ext1, pad hold and GPIO deep sleep wakeup

Conventions used in all sections: `Y` = yes/enabled, `.` = no/disabled, `-` = not available or no pin.

Values like I2C `scl~`, I2S `fs~` and clocks derived from `RC_FAST` are approximations. SPI mode and `sck` are only decoded in master mode.

## GPIO section

```
 pin pad         tasmota      iomux      route  output signal        inv oeP  oe  od  ie  pu  pd drv  o  i  inputs
   3  GPIO3      Relay1       GPIO3      matrix GPIO                   .   Y   Y   .   Y   .   .   1  0  0
   5  MTDI       SPI MISO1    GPIO5      matrix GPIO                   .   .   .   .   Y   .   .   2  0  1  FSPIQ_IN
   8  GPIO8      WS2812       GPIO8      matrix RMT_SIG_OUT0           .   Y   Y   .   .   Y   .   2  0  0
  20  U0RXD                   U0RXD      iomux  U0RXD                  .   Y   .   .   Y   Y   .   2  0  1
  22* SDIO_DATA2 Backlight    GPIO22     matrix LEDC_LS_SIG_OUT0       .   Y   Y   .   .   .   .   2  0  0
```

GPIOs used by the flash (and PSRAM) are not listed, same as for command `Gpio`.

### How a pad is connected

Each physical pad can be driven in one of three ways, shown in the `route` column:

- `iomux`: the pad is directly connected by the IO_MUX to a fixed peripheral function. This is the fastest path, but each pad only offers a few functions (for example `U0TXD`, `MTDI`, `SPICLK`). The function is selected by the IO_MUX `MCU_SEL` field.
- `matrix`: the IO_MUX selects its GPIO function and the pad goes through the **GPIO matrix**, which can connect any peripheral signal to any pad. This is how Tasmota connects almost all components. The `output signal` column then shows the peripheral signal driving the pad: `GPIO` means the pad is driven by software (simple GPIO output, like a relay or a SPI CS), other names are peripheral signals like `RMT_SIG_OUT0`, `LEDC_LS_SIG_OUT0`, `FSPID_OUT`, `U1TXD_OUT`...
- `rtc`: the pad is switched to the RTC_IO (or LP_IO) domain. In that case all digital settings on the line (IO_MUX, GPIO matrix, pulls, drive) do **not** apply, see the `RTC_IO` / `LP_IO` section instead. Only shown on SoCs having RTC_IO or LP_IO.

Input signals work independently: a peripheral input can be connected through the GPIO matrix to any pad, they are listed in the `inputs` column. Several peripherals can listen to the same pad.

### Columns

Column|Meaning
:---|:---
`pin`|GPIO number. A `*` means the pin is reserved inside ESP-IDF (`esp_gpio_is_reserved()`). This is not only flash or PSRAM: drivers like LEDC, RMT or SPI also reserve the pins they use, so a `*` on a Tasmota configured pin is normal
`pad`|Physical pad name from the datasheet (e.g. `MTDI`, `U0TXD`, `XTAL_32K_P`, `SPIHD`). Gives a hint on the default or special function of the pad
`tasmota`|Component assigned by Tasmota to this GPIO, same naming as command `Gpio` (with index, e.g. `Relay1`, `SPI MOSI1`). Empty if none
`iomux`|IO_MUX function currently selected on this pad. `GPIO<n>` is the function routing the pad to the GPIO matrix. `GPIO<n>_0` is function 0, the reset default: such a pin was never touched since boot. Other names are direct peripheral functions (e.g. `U0TXD`, `MTCK`, `SPICLK`, `SDIO_CMD`). `F<n>` is shown for an unknown function number
`route`|`iomux`, `matrix` or `rtc` (see above)
`output signal`|GPIO matrix output signal when `route` is `matrix` (`GPIO` = software controlled, `sig<n>` if the signal name is unknown), else the IO_MUX function name
`inv`|Output inverted by the GPIO matrix (only meaningful for `matrix` routing)
`oeP`|Output enable controlled by the peripheral. When `Y`, the output enable comes from the peripheral driving the pad, which is useful for bidirectional lines (for the `GPIO` signal the peripheral is the GPIO controller itself, so it follows `oe`); when `.`, the output enable is forced by the `oe` bit of the GPIO enable register
`oe`|Output enable: the pad is actively driven. An input-only pin (button, sensor input, SPI MISO) shows `.`
`od`|Open drain: the pad only pulls low, the high level comes from a pull-up (I2C, 1-Wire)
`ie`|Input enable: the pad level can be read. If `.`, column `i` and peripheral inputs read `0`
`pu`|Internal pull-up enabled (~45 kΩ)
`pd`|Internal pull-down enabled (~45 kΩ)
`drv`|Drive strength `0..3`. Approximately 5, 10, 20 and 40 mA on most targets; `2` is the default. Some pads (ESP32 input-only GPIO34-39) show `0`
`o`|Output level written in the GPIO output register (only effective when the pad is driven by software `GPIO` and `oe` is enabled)
`i`|Current input level of the pad
`inputs`|Peripheral input signals connected to this pad through the GPIO matrix. A `!` prefix means the input is inverted

### Reading the GPIO table

Some typical lines and what they tell:

- `GPIO3  Relay1  GPIO3  matrix GPIO  . Y Y . Y` - a relay: software controlled output through the GPIO matrix, output enabled, input still enabled so that `i` reflects the actual level.
- `GPIO5  SPI MISO1  GPIO5  matrix GPIO  . . . . Y ... FSPIQ_IN` - an input-only pin: output disabled, input enabled and connected to the SPI `FSPIQ_IN` signal.
- `GPIO8  WS2812  GPIO8  matrix RMT_SIG_OUT0` - the pad is driven by RMT channel 0. See the `RMT` section, where the same channel lists `pins=8`.
- `GPIO22*  Backlight  GPIO22  matrix LEDC_LS_SIG_OUT0` - PWM output from LEDC low-speed channel 0, reserved by the LEDC driver (`*`). The `LEDC` section shows channel 0 with its duty and `pins 22`.
- `GPIO20  U0RXD  U0RXD  iomux  U0RXD` - console UART RX directly connected via IO_MUX, bypassing the GPIO matrix. The `UART0` section still reports `rx=20`.
- `GPIO4  GPIO4_0  iomux  GPIO4_0  . Y . . . . .` - an unused pad in its reset state: no pull, input disabled, output disabled.
- `GPIO2  GPIO2_0  iomux  GPIO2_0  . Y . . Y . Y` - an unused pad with a pull-down, typically a boot strapping pin configured by the ROM.

!!! note
    A pin with a Tasmota component but still in `GPIO<n>_0` / `iomux` route usually means the driver did not initialize the pin (driver not compiled, sensor not detected, or init failed).

## Peripheral sections

### LEDC (PWM)

```
LEDC  clk=XTAL (40 MHz) clk_en=Y
   timer          div  res      freq Hz paused  rst    cnt  clk
       0     156.2500    8     1000.000      .    .    209  40 MHz
      ch timer out_en idle hpoint    duty     max       %  pins
       0     0      Y    0      0     158     256   61.72  22
```

- timers: `div` fractional clock divider, `res` duty resolution in bits, resulting PWM frequency `freq = clk / (div * 2^res)`, `paused`, `rst` (timer held in reset), `cnt` current counter value, `clk` timer clock
- channels: bound `timer`, `out_en` output enabled, `idle` level when stopped, `hpoint` start of high level, current `duty`, `max` = `2^res`, duty in `%`, and `pins` driven by this channel through the GPIO matrix
- on ESP32 there are 2 groups (`high speed` and `low speed`) with their own timers and channels

### RMT, I2S, SPI, I2C, UART

Each instance is printed on one line with its clock source and frequency, configuration and status, followed when relevant by a `pins` line computed from the GPIO matrix and IO_MUX routing (`-` = not connected). `int_ena` are the interrupt sources enabled, `raw` the interrupt events latched by hardware (even if not enabled).

For UART, `baud` is computed from the actual clock divider, so it may differ slightly from the nominal speed (e.g. `115211` for 115200). Frame format is shown as `8N1`, `rts`/`cts` are hardware flow control, `inv_rx`/`inv_tx` line inversion, `rxd`/`txd` the current level of the lines.

### USB-Serial-JTAG

On ESP32-S3, C3, C5, C6 and P4, shows if the Tasmota console is on `UART` or `USB`, the USB pads (`D-`/`D+`), whether the host is sending start-of-frame packets (`sof`, `frame`) i.e. a USB host is connected, CDC endpoint and JTAG FIFO status, pad pull-up overrides and interrupt status decoded by name.

### RTC_IO / LP_IO

```
 rtc gpio pad         mux fun  ie  oe  od  pu  pd drv slp_sel slp_ie slp_oe hold force  o  i  int wake
  10    4 GPIO4       dig   0   .   .   .   .   Y   2       .      .      -    .     .  0  0    -    .
```

Pads belonging to the RTC (ESP32, S2, S3) or Low Power (C5, C6, P4) domain. These are the pads usable during deep sleep and by the ULP / LP core.

- `rtc` / `lp`: RTC_IO or LP_IO index, `gpio` the matching GPIO number
- `mux`: `dig` = pad controlled by the digital IO_MUX (see the GPIO section), `rtc` / `lp` = pad controlled by RTC_IO / LP_IO (the GPIO section settings do not apply)
- `fun`: RTC / LP IO_MUX function (`0` = RTC_GPIO on RTC_IO)
- `ie oe od pu pd drv`: same meaning as in the GPIO section, but for the RTC domain
- `slp_sel slp_ie slp_oe` (and `slp_pu slp_pd slp_drv` on LP_IO): pad settings applied automatically during sleep, when `slp_sel` is set
- `hold`: pad state latched (kept during reset and deep sleep), `force`: RTC_CNTL hold force
- `o i`: output and input level, `int`: interrupt type, `wake`: GPIO wakeup enabled

On ESP32-C3, which has no RTC_IO, the section reports `none on this SoC`.

### SLEEP

- `last_wakeup`: cause of the last wakeup (`undefined` after a normal reset), `causes` bitmask
- `pm`: power management configuration (CPU frequency range, automatic light sleep)
- `wakeup_ena`: wakeup sources enabled in RTC_CNTL / PMU, decoded by name
- `ext0` / `ext1`: deep sleep wakeup by RTC pads (pin, level or mode, pins that triggered the wakeup in `status`)
- `pad_hold`: digital pad hold state during sleep
- `deep_sleep_gpio_wakeup`: GPIOs enabled for deep sleep wakeup with their trigger type (C3, C5, C6, P4)

Add `#define USE_HWDUMP_SLEEP_PINS` to also get a per-pin table of the light sleep settings (`slp_sel`, `slp_oe`, `slp_ie`, `slp_pu`, `slp_pd`, `slp_drv`, hold, light sleep wakeup and interrupt type). It is disabled by default to keep the output short.

## Examples

??? example "ESP32"
    ```
    GPIO  *=reserved by IDF driver, inv=output inverted, oeP=output enable by peripheral, oe=output enable, od=open drain, ie=input enable, pu=pull-up, pd=pull-down, drv=drive strength 0-3, o=output level, i=input level, !=input inverted, route rtc=pad controlled by RTC_IO (see RTC_IO)
     pin pad         tasmota      iomux      route  output signal        inv oeP  oe  od  ie  pu  pd drv  o  i  inputs
       0  GPIO0                    GPIO0_0    iomux  GPIO0_0                .   Y   .   .   Y   Y   .   2  0  1
       1  U0TXD                    U0TXD      iomux  U0TXD                  .   Y   .   .   Y   .   .   2  0  1
       2  GPIO2                    GPIO2_0    iomux  GPIO2_0                .   Y   .   .   Y   .   Y   2  0  0
       3  U0RXD                    U0RXD      iomux  U0RXD                  .   Y   .   .   Y   Y   .   2  0  1
       4  GPIO4                    GPIO4_0    iomux  GPIO4_0                .   Y   .   .   Y   .   Y   2  0  0
       5  GPIO5                    GPIO5_0    iomux  GPIO5_0                .   Y   .   .   Y   Y   .   2  0  1
       6* SD_CLK                   SPICLK     iomux  SPICLK                 .   Y   .   .   Y   Y   .   3  0  0
       7* SD_DATA0                 GPIO7      matrix SPIQ_OUT               .   Y   Y   .   Y   Y   .   2  0  0  SPIQ_IN
       8* SD_DATA1                 GPIO8      matrix SPID_OUT               .   Y   Y   .   Y   Y   .   2  0  0  SPID_IN
       9* SD_DATA2                 GPIO9      matrix SPIHD_OUT              .   Y   Y   .   Y   Y   .   2  0  1  SPIHD_IN
      10* SD_DATA3                 GPIO10     matrix SPIWP_OUT              .   Y   Y   .   Y   Y   .   2  0  0  SPIWP_IN
      11* SD_CMD                   GPIO11     matrix SPICS0_OUT             .   Y   Y   .   Y   Y   .   2  0  1
      12  MTDI                     MTDI       iomux  MTDI                   .   Y   .   .   Y   .   Y   2  0  0
      13  MTCK                     MTCK       iomux  MTCK                   .   Y   .   .   Y   .   Y   2  0  0
      14  MTMS                     MTMS       iomux  MTMS                   .   Y   .   .   Y   Y   .   2  0  1
      15  MTDO                     MTDO       iomux  MTDO                   .   Y   .   .   Y   Y   .   2  0  1
      16  GPIO16                   GPIO16     matrix GPIO                   .   .   .   .   .   Y   .   2  0  0
      17  GPIO17                   GPIO17     matrix GPIO                   .   .   .   .   .   Y   .   3  0  0
      18  GPIO18                   GPIO18_0   iomux  GPIO18_0               .   Y   .   .   Y   .   .   2  0  0
      19  GPIO19                   GPIO19_0   iomux  GPIO19_0               .   Y   .   .   Y   .   .   2  0  0
      20  GPIO20                   GPIO20_0   iomux  GPIO20_0               .   Y   .   .   Y   .   .   2  0  0
      21  GPIO21                   GPIO21_0   iomux  GPIO21_0               .   Y   .   .   Y   .   .   2  0  0
      22  GPIO22                   GPIO22_0   iomux  GPIO22_0               .   Y   .   .   Y   .   .   2  0  0
      23  GPIO23                   GPIO23_0   iomux  GPIO23_0               .   Y   .   .   Y   .   .   2  0  0
      25  GPIO25                   GPIO25_0   iomux  GPIO25_0               .   Y   .   .   .   .   .   2  0  0
      26  GPIO26                   GPIO26_0   iomux  GPIO26_0               .   Y   .   .   .   .   .   2  0  0
      27  GPIO27                   GPIO27_0   iomux  GPIO27_0               .   Y   .   .   Y   .   .   2  0  0
      32  32K_XP                   GPIO32_0   iomux  GPIO32_0               .   Y   .   .   .   .   .   2  0  0
      33  32K_XN                   GPIO33_0   iomux  GPIO33_0               .   Y   .   .   .   .   .   2  0  0
      34  VDET_1                   GPIO34_0   iomux  GPIO34_0               .   Y   .   .   .   .   .   0  0  0
      35  VDET_2                   GPIO35_0   iomux  GPIO35_0               .   Y   .   .   .   .   .   0  0  0
      36  SENSOR_VP                GPIO36_0   iomux  GPIO36_0               .   Y   .   .   .   .   .   0  0  0
      37  SENSOR_CAPP              GPIO37_0   iomux  GPIO37_0               .   Y   .   .   .   .   .   0  0  0
      38  SENSOR_CAPN              GPIO38_0   iomux  GPIO38_0               .   Y   .   .   .   .   .   0  0  0
      39  SENSOR_VN                GPIO39_0   iomux  GPIO39_0               .   Y   .   .   .   .   .   0  0  0
    LEDC  slow_clk=APB (80 MHz)
      high speed
       timer          div  res      freq Hz paused  rst    cnt  clk
           0       1.0000   10      976.563      .    .    880  1 MHz
           1       1.0000   10      976.563      .    .    451  1 MHz
           2       1.0000   10      976.563      .    .    885  1 MHz
           3       1.0000   10      976.563      .    .    986  1 MHz
          ch timer out_en idle hpoint    duty     max       %  pins
           0     0      .    0      0       0    1024    0.00
           1     0      .    0      0       0    1024    0.00
           2     0      .    0      0       0    1024    0.00
           3     0      .    0      0       0    1024    0.00
           4     0      .    0      0       0    1024    0.00
           5     0      .    0      0       0    1024    0.00
           6     0      .    0      0       0    1024    0.00
           7     0      .    0      0       0    1024    0.00
      low speed
       timer          div  res      freq Hz paused  rst    cnt  clk
           0       1.0000   10      976.563      .    .     56  1 MHz
           1       1.0000   10      976.563      .    .    250  1 MHz
           2       1.0000   10      976.563      .    .    266  1 MHz
           3       1.0000   10      976.563      .    .    583  1 MHz
          ch timer out_en idle hpoint    duty     max       %  pins
           0     0      .    0      0       0    1024    0.00
           1     0      .    0      0       0    1024    0.00
           2     0      .    0      0       0    1024    0.00
           3     0      .    0      0       0    1024    0.00
           4     0      .    0      0       0    1024    0.00
           5     0      .    0      0       0    1024    0.00
           6     0      .    0      0       0    1024    0.00
           7     0      .    0      0       0    1024    0.00
    RMT  peripheral clock disabled or in reset
    I2S0  peripheral clock disabled or in reset
    I2S1  peripheral clock disabled or in reset
      clk_out pin_ctrl=0x000 CLK_OUT1=- CLK_OUT2=- CLK_OUT3=-
    SPI2  peripheral clock disabled or in reset
    SPI3  peripheral clock disabled or in reset
    I2C0  peripheral clock disabled or in reset
    I2C1  peripheral clock disabled or in reset
    UART0  clk=REF_TICK (1 MHz) baud=115942 8N1 rts=. cts=. inv_rx=. inv_tx=. loopback=. rx_fifo=0 tx_fifo=76 rxd=1 txd=0 int_ena=0x00195 raw=0x07002
           pins tx=1 rx=3 rts=- cts=-
    UART1  peripheral clock disabled or in reset
    UART2  peripheral clock disabled or in reset
    RTC_IO  mux=rtc: pad controlled by RTC_IO (IO_MUX/GPIO matrix settings do not apply), fun=RTC function (0=RTC_GPIO), force=RTC_CNTL hold force, -=not available on this pad
     rtc gpio pad         mux fun  ie  oe  od  pu  pd drv slp_sel slp_ie slp_oe hold force  o  i  int wake
       0   36 SENSOR_VP   dig   0   .   .   .   -   -   -       .      .      -    .     .  0  0    -    .
       1   37 SENSOR_CAPP dig   0   .   .   .   -   -   -       .      .      -    .     .  0  0    -    .
       2   38 SENSOR_CAPN dig   0   .   .   .   -   -   -       .      .      -    .     .  0  0    -    .
       3   39 SENSOR_VN   dig   0   .   .   .   -   -   -       .      .      -    .     .  0  0    -    .
       4   34 VDET_1      dig   0   .   .   .   -   -   -       .      .      -    .     .  0  0    -    .
       5   35 VDET_2      dig   0   .   .   .   -   -   -       .      .      -    .     .  0  0    -    .
       6   25 GPIO25      dig   0   .   .   .   .   .   2       .      .      -    .     .  0  0    -    .
       7   26 GPIO26      dig   0   .   .   .   .   .   2       .      .      -    .     .  0  0    -    .
       8   33 32K_XN      dig   0   .   .   .   .   .   2       .      .      -    .     .  0  0    -    .
       9   32 32K_XP      dig   0   .   .   .   .   .   2       .      .      -    .     .  0  0    -    .
      10    4 GPIO4       dig   0   .   .   .   .   Y   2       .      .      -    .     .  0  0    -    .
      11    0 GPIO0       dig   0   .   .   .   Y   .   2       .      .      -    .     .  0  1    -    .
      12    2 GPIO2       dig   0   .   .   .   .   Y   2       .      .      -    .     .  0  0    -    .
      13   15 MTDO        dig   0   .   .   .   Y   .   2       .      .      -    .     .  0  1    -    .
      14   13 MTCK        dig   0   .   .   .   .   Y   2       .      .      -    .     .  0  0    -    .
      15   12 MTDI        dig   0   .   .   .   .   Y   2       .      .      -    .     .  0  0    -    .
      16   14 MTMS        dig   0   .   .   .   Y   .   2       .      .      -    .     .  0  1    -    .
      17   27 GPIO27      dig   0   .   .   .   .   .   2       .      .      -    .     .  0  0    -    .
    SLEEP  last_wakeup=undefined causes=0x00001 pm=enabled max=0 MHz min=0 MHz light_sleep=.
      wakeup_ena=0x0000C gpio timer
      ext0 en=. gpio=36 level=low
      ext1 en=. mode=all_low gpios: none  status: none
      pad_hold autohold=. autohold_en=. force_hold=.
    ```

??? example "ESP32-S2"
    ```
    GPIO  *=reserved by IDF driver, inv=output inverted, oeP=output enable by peripheral, oe=output enable, od=open drain, ie=input enable, pu=pull-up, pd=pull-down, drv=drive strength 0-3, o=output level, i=input level, !=input inverted, route rtc=pad controlled by RTC_IO (see RTC_IO)
     pin pad        tasmota      iomux      route  output signal        inv oeP  oe  od  ie  pu  pd drv  o  i  inputs
       0  GPIO0                   GPIO0_0    iomux  GPIO0_0                .   Y   .   .   Y   Y   .   2  0  1
       1  GPIO1                   GPIO1_0    iomux  GPIO1_0                .   Y   .   .   Y   .   .   2  0  0
       2  GPIO2                   GPIO2_0    iomux  GPIO2_0                .   Y   .   .   Y   .   .   2  0  0
       3  GPIO3                   GPIO3_0    iomux  GPIO3_0                .   Y   .   .   .   .   .   2  0  0
       4  GPIO4                   GPIO4_0    iomux  GPIO4_0                .   Y   .   .   .   .   .   2  0  0
       5  GPIO5                   GPIO5_0    iomux  GPIO5_0                .   Y   .   .   .   .   .   2  0  0
       6  GPIO6                   GPIO6_0    iomux  GPIO6_0                .   Y   .   .   .   .   .   2  0  0
       7  GPIO7                   GPIO7_0    iomux  GPIO7_0                .   Y   .   .   .   .   .   2  0  0
       8  GPIO8                   GPIO8_0    iomux  GPIO8_0                .   Y   .   .   .   .   .   2  0  0
       9  GPIO9                   GPIO9_0    iomux  GPIO9_0                .   Y   .   .   Y   .   .   2  0  0
      10  GPIO10                  GPIO10_0   iomux  GPIO10_0               .   Y   .   .   Y   .   .   2  0  0
      11  GPIO11                  GPIO11_0   iomux  GPIO11_0               .   Y   .   .   Y   .   .   2  0  0
      12  GPIO12                  GPIO12_0   iomux  GPIO12_0               .   Y   .   .   Y   .   .   2  0  0
      13  GPIO13                  GPIO13_0   iomux  GPIO13_0               .   Y   .   .   Y   .   .   2  0  0
      14  GPIO14                  GPIO14_0   iomux  GPIO14_0               .   Y   .   .   Y   .   .   2  0  0
      15  XTAL_32K_P              GPIO15_0   iomux  GPIO15_0               .   Y   .   .   .   .   .   2  0  0
      16  XTAL_32K_N              GPIO16_0   iomux  GPIO16_0               .   Y   .   .   .   .   .   2  0  0
      17  DAC_1                   GPIO17_0   iomux  GPIO17_0               .   Y   .   .   Y   .   .   2  0  0
      18* DAC_2      WS28121      GPIO18     matrix RMT_SIG_OUT0           .   Y   Y   .   Y   .   .   2  0  0
      19  GPIO19                  GPIO19_0   iomux  GPIO19_0               .   Y   .   .   .   .   .   2  0  0
      20  GPIO20                  GPIO20_0   iomux  GPIO20_0               .   Y   .   .   .   .   .   2  0  0
      21  GPIO21                  GPIO21_0   iomux  GPIO21_0               .   Y   .   .   .   .   .   2  0  0
      33  GPIO33                  GPIO33_0   iomux  GPIO33_0               .   Y   .   .   Y   .   .   2  0  0
      34  GPIO34                  GPIO34_0   iomux  GPIO34_0               .   Y   .   .   Y   .   .   2  0  0
      35  GPIO35                  GPIO35_0   iomux  GPIO35_0               .   Y   .   .   Y   .   .   2  0  0
      36  GPIO36                  GPIO36_0   iomux  GPIO36_0               .   Y   .   .   Y   .   .   2  0  0
      37  GPIO37                  GPIO37_0   iomux  GPIO37_0               .   Y   .   .   Y   .   .   2  0  0
      38  GPIO38                  GPIO38_0   iomux  GPIO38_0               .   Y   .   .   Y   .   .   2  0  0
      39  MTCK                    MTCK       iomux  MTCK                   .   Y   .   .   Y   .   .   2  0  0
      40  MTDO                    MTDO       iomux  MTDO                   .   Y   .   .   Y   .   .   2  0  0
      41  MTDI                    MTDI       iomux  MTDI                   .   Y   .   .   Y   .   .   2  0  0
      42  MTMS                    MTMS       iomux  MTMS                   .   Y   .   .   Y   .   .   2  0  0
      43  U0TXD                   U0TXD      iomux  U0TXD                  .   Y   .   .   Y   .   .   2  0  1
      44  U0RXD                   U0RXD      iomux  U0RXD                  .   Y   .   .   Y   Y   .   2  0  1
      45  GPIO45                  GPIO45_0   iomux  GPIO45_0               .   Y   .   .   Y   .   Y   2  0  0
      46  GPIO46                  GPIO46_0   iomux  GPIO46_0               .   Y   .   .   Y   .   Y   2  0  0
    LEDC  clk=XTAL (40 MHz) clk_en=.
       timer          div  res      freq Hz paused  rst    cnt  clk
           0      39.9805   10      977.040      .    .    634  40 MHz
           1      39.9805   10      977.040      .    .    604  40 MHz
           2      39.9805   10      977.040      .    .     85  40 MHz
           3      39.9805   10      977.040      .    .    743  40 MHz
          ch timer out_en idle hpoint    duty     max       %  pins
           0     0      .    0      0       0    1024    0.00
           1     0      .    0      0       0    1024    0.00
           2     0      .    0      0       0    1024    0.00
           3     0      .    0      0       0    1024    0.00
           4     0      .    0      0       0    1024    0.00
           5     0      .    0      0       0    1024    0.00
           6     0      .    0      0       0    1024    0.00
           7     0      .    0      0       0    1024    0.00
    RMT  mem_access=direct mem_tx_wrap=Y mem_pd=. int_ena=0x00000001 raw=0x00001000
      ch0 clk=APB (80 MHz) div=2 tick=25 ns mem=3 owner=rx tx_start=. loop=. idle_out=Y lv=0 carrier=. rx_en=. idle_thres=4096 filter=./15 state=0 out=18 in=-
      ch1 clk=REF_TICK (1 MHz) div=2 tick=2000 ns mem=1 owner=rx tx_start=. loop=. idle_out=. lv=0 carrier=Y rx_en=. idle_thres=4096 filter=./15 state=0 out=- in=-
      ch2 clk=REF_TICK (1 MHz) div=2 tick=2000 ns mem=1 owner=rx tx_start=. loop=. idle_out=. lv=0 carrier=Y rx_en=. idle_thres=4096 filter=./15 state=0 out=- in=-
      ch3 clk=REF_TICK (1 MHz) div=2 tick=2000 ns mem=1 owner=rx tx_start=. loop=. idle_out=. lv=0 carrier=Y rx_en=. idle_thres=4096 filter=./15 state=0 out=- in=-
    I2S0  peripheral clock disabled or in reset
      clk_out pin_ctrl=0x7FF CLK_OUT1=- CLK_OUT2=- CLK_OUT3=-
    SPI2  peripheral clock disabled or in reset
    SPI3  peripheral clock disabled or in reset
    I2C0  peripheral clock disabled or in reset
    I2C1  peripheral clock disabled or in reset
    UART0  clk=REF_TICK (1 MHz) baud=115942 8N1 rts=. cts=. inv_rx=. inv_tx=. loopback=. rx_fifo=0 tx_fifo=104 rxd=1 txd=1 int_ena=0x00195 raw=0x07002
           pins tx=43 rx=44 rts=- cts=-
    UART1  peripheral clock disabled or in reset
    RTC_IO  mux=rtc: pad controlled by RTC_IO (IO_MUX/GPIO matrix settings do not apply), fun=RTC function (0=RTC_GPIO), force=RTC_CNTL hold force, -=not available on this pad
     rtc gpio pad         mux fun  ie  oe  od  pu  pd drv slp_sel slp_ie slp_oe hold force  o  i  int wake
       0    0 GPIO0       dig   0   .   .   .   .   Y   2       .      .      .    -     .  0  1    -    .
       1    1 GPIO1       dig   0   .   .   .   Y   .   2       .      .      .    -     .  0  0    -    .
       2    2 GPIO2       dig   0   .   .   .   .   Y   2       .      .      .    -     .  0  0    -    .
       3    3 GPIO3       dig   0   .   .   .   Y   .   2       .      .      .    -     .  0  0    -    .
       4    4 GPIO4       dig   0   .   .   .   .   Y   2       .      .      .    -     .  0  0    -    .
       5    5 GPIO5       dig   0   .   .   .   .   Y   2       .      .      .    -     .  0  0    -    .
       6    6 GPIO6       dig   0   .   .   .   Y   .   2       .      .      .    -     .  0  0    -    .
       7    7 GPIO7       dig   0   .   .   .   .   .   2       .      .      .    -     .  0  0    -    .
       8    8 GPIO8       dig   0   .   .   .   .   .   2       .      .      .    -     .  0  0    -    .
       9    9 GPIO9       dig   0   .   .   .   .   .   2       .      .      .    -     .  0  0    -    .
      10   10 GPIO10      dig   0   .   .   .   .   .   2       .      .      .    -     .  0  0    -    .
      11   11 GPIO11      dig   0   .   .   .   .   .   2       .      .      .    -     .  0  0    -    .
      12   12 GPIO12      dig   0   .   .   .   .   .   2       .      .      .    -     .  0  0    -    .
      13   13 GPIO13      dig   0   .   .   .   .   .   2       .      .      .    -     .  0  0    -    .
      14   14 GPIO14      dig   0   .   .   .   .   .   2       .      .      .    -     .  0  0    -    .
      15   15 XTAL_32K_P  dig   0   .   .   .   .   .   2       .      .      .    -     .  0  0    -    .
      16   16 XTAL_32K_N  dig   0   .   .   .   .   .   2       .      .      .    -     .  0  0    -    .
      17   17 DAC_1       dig   0   .   .   .   .   .   2       .      .      .    -     .  0  0    -    .
      18   18 DAC_2       dig   0   .   .   .   .   .   2       .      .      .    -     .  0  0    -    .
      19   19 GPIO19      dig   0   .   .   .   .   Y   2       .      .      .    -     .  0  0    -    .
      20   20 GPIO20      dig   0   .   .   .   .   Y   2       .      .      .    -     .  0  0    -    .
      21   21 GPIO21      dig   0   .   .   .   .   Y   2       .      .      .    -     .  0  0    -    .
    SLEEP  last_wakeup=undefined causes=0x00001 pm=enabled max=0 MHz min=0 MHz light_sleep=.
      wakeup_ena=0x0000C gpio timer
      ext0 en=. gpio=0 level=low
      ext1 en=. mode=all_low gpios: none  status: none
      pad_hold autohold=. autohold_en=. force_hold=.
    ```

??? example "ESP32-C3"
    ```
    GPIO  *=reserved by IDF driver, inv=output inverted, oeP=output enable by peripheral, oe=output enable, od=open drain, ie=input enable, pu=pull-up, pd=pull-down, drv=drive strength 0-3, o=output level, i=input level, !=input inverted
     pin pad        tasmota      iomux      route  output signal        inv oeP  oe  od  ie  pu  pd drv  o  i  inputs
       0  XTAL_32K_P              GPIO0_0    iomux  GPIO0_0                .   Y   .   .   .   .   .   2  0  0
       1  XTAL_32K_N              GPIO1_0    iomux  GPIO1_0                .   Y   .   .   .   .   .   2  0  0
       2  GPIO2                   GPIO2_0    iomux  GPIO2_0                .   Y   .   .   Y   .   .   1  0  0
       3  GPIO3      Relay1       GPIO3      matrix GPIO                   .   Y   Y   .   Y   .   .   1  0  0
       4  MTMS       Relay2       GPIO4      matrix GPIO                   .   Y   Y   .   Y   .   .   1  0  0
       5  MTDI       Relay3       GPIO5      matrix GPIO                   .   Y   Y   .   Y   .   .   1  0  0
       6  MTCK                    MTCK       iomux  MTCK                   .   Y   .   .   Y   .   .   2  0  1
       7  MTDO                    MTDO       iomux  MTDO                   .   Y   .   .   Y   .   .   2  0  0
       8  GPIO8                   GPIO8_0    iomux  GPIO8_0                .   Y   .   .   Y   .   .   2  0  1
       9  GPIO9                   GPIO9_0    iomux  GPIO9_0                .   Y   .   .   Y   Y   .   2  0  1
      10  GPIO10                  GPIO10_0   iomux  GPIO10_0               .   Y   .   .   Y   .   .   2  0  0
      11  VDD_SPI                 GPIO11_0   iomux  GPIO11_0               .   Y   .   .   .   .   .   2  0  0
      12* SPIHD                   GPIO12     matrix GPIO                   .   Y   .   .   Y   Y   .   1  0  1
      13* SPIWP                   GPIO13     matrix GPIO                   .   Y   .   .   Y   Y   .   1  0  1
      18  GPIO18     Relay4       GPIO18     matrix GPIO                   .   Y   Y   .   Y   .   .   3  0  0
      19  GPIO19     Relay5       GPIO19     matrix GPIO                   .   Y   Y   .   Y   .   .   3  0  0
      20  U0RXD                   U0RXD      iomux  U0RXD                  .   Y   .   .   Y   Y   .   2  0  1
      21  U0TXD                   U0TXD      iomux  U0TXD                  .   Y   .   .   Y   Y   .   2  0  1
    LEDC  clk=XTAL (40 MHz) clk_en=.
       timer          div  res      freq Hz paused  rst    cnt  clk
           0      39.9805   10      977.040      .    .    297  40 MHz
           1      39.9805   10      977.040      .    .    830  40 MHz
           2      39.9805   10      977.040      .    .     39  40 MHz
           3      39.9805   10      977.040      .    .    439  40 MHz
          ch timer out_en idle hpoint    duty     max       %  pins
           0     0      .    0      0       0    1024    0.00
           1     0      .    0      0       0    1024    0.00
           2     0      .    0      0       0    1024    0.00
           3     0      .    0      0       0    1024    0.00
           4     0      .    0      0       0    1024    0.00
           5     0      .    0      0       0    1024    0.00
    RMT  peripheral clock disabled or in reset
    I2S0  peripheral clock disabled or in reset
    SPI2  peripheral clock disabled or in reset
    I2C0  peripheral clock disabled or in reset
    UART0  clk=XTAL (40 MHz) baud=115211 8N1 rts=. cts=. inv_rx=. inv_tx=. loopback=. rx_fifo=0 tx_fifo=4 rxd=1 txd=1 int_ena=0x00195 raw=0x06002
           pins tx=21 rx=20 rts=- cts=-
    UART1  peripheral clock disabled or in reset
    USB-Serial-JTAG  console=UART phy=internal pad_enable=. D-=GPIO18 D+=GPIO19 reg_clk_force=. date=02007300
      host   sof=. frame=0 bus_reset=.
      cdc    in_ep1_free=. in_ep1_state=2 out_ep1_avail=. out_ep1_cnt=0 out_ep1_state=0
      jtag   in_fifo_cnt=0 in_empty=Y in_full=. out_fifo_cnt=0 out_empty=Y out_full=.
      pads   pull_override=Y dp_pullup=. dp_pulldown=. dm_pullup=. dm_pulldown=. exchg_pins=.
      int    ena=0x000  raw=0x000
    RTC_IO  none on this SoC (SOC_RTCIO_PIN_COUNT=0), RTC domain pads are listed below with their deep-sleep wakeup
    SLEEP  last_wakeup=undefined causes=0x00001 pm=enabled max=0 MHz min=0 MHz light_sleep=.
      wakeup_ena=0x0000C gpio timer
      pad_hold autohold=. autohold_en=. force_hold=.
      deep_sleep_gpio_wakeup clk=. pins: none
    ```

??? example "ESP32-S3"
    ```
    GPIO  *=reserved by IDF driver, inv=output inverted, oeP=output enable by peripheral, oe=output enable, od=open drain, ie=input enable, pu=pull-up, pd=pull-down, drv=drive strength 0-3, o=output level, i=input level, !=input inverted, route rtc=pad controlled by RTC_IO (see RTC_IO)
     pin pad        tasmota      iomux      route  output signal        inv oeP  oe  od  ie  pu  pd drv  o  i  inputs
       0  GPIO0                   GPIO0_0    iomux  GPIO0_0                .   Y   .   .   Y   Y   .   2  0  1
       1  GPIO1                   GPIO1_0    iomux  GPIO1_0                .   Y   .   .   Y   .   .   2  0  0
       2  GPIO2                   GPIO2_0    iomux  GPIO2_0                .   Y   .   .   Y   .   .   2  0  0
       3  GPIO3                   GPIO3_0    iomux  GPIO3_0                .   Y   .   .   Y   .   .   2  0  0
       4  GPIO4                   GPIO4_0    iomux  GPIO4_0                .   Y   .   .   .   .   .   2  0  0
       5  GPIO5                   GPIO5_0    iomux  GPIO5_0                .   Y   .   .   .   .   .   2  0  0
       6  GPIO6                   GPIO6_0    iomux  GPIO6_0                .   Y   .   .   .   .   .   2  0  0
       7  GPIO7                   GPIO7_0    iomux  GPIO7_0                .   Y   .   .   .   .   .   2  0  0
       8  GPIO8                   GPIO8_0    iomux  GPIO8_0                .   Y   .   .   .   .   .   2  0  0
       9  GPIO9                   GPIO9_0    iomux  GPIO9_0                .   Y   .   .   Y   .   .   2  0  0
      10  GPIO10                  GPIO10_0   iomux  GPIO10_0               .   Y   .   .   Y   .   .   2  0  0
      11  GPIO11                  GPIO11_0   iomux  GPIO11_0               .   Y   .   .   Y   .   .   2  0  0
      12  GPIO12                  GPIO12_0   iomux  GPIO12_0               .   Y   .   .   Y   .   .   2  0  0
      13  GPIO13                  GPIO13_0   iomux  GPIO13_0               .   Y   .   .   Y   .   .   2  0  0
      14  GPIO14                  GPIO14_0   iomux  GPIO14_0               .   Y   .   .   Y   .   .   2  0  0
      15  XTAL_32K_P              GPIO15_0   iomux  GPIO15_0               .   Y   .   .   .   .   .   2  0  0
      16  XTAL_32K_N              GPIO16_0   iomux  GPIO16_0               .   Y   .   .   .   .   .   2  0  0
      17  DAC_1                   GPIO17_0   iomux  GPIO17_0               .   Y   .   .   Y   .   .   1  0  1
      18  DAC_2                   GPIO18_0   iomux  GPIO18_0               .   Y   .   .   Y   .   .   1  0  1
      19  GPIO19                  GPIO19_0   iomux  GPIO19_0               .   Y   .   .   .   .   .   3  0  0
      20  GPIO20                  GPIO20_0   iomux  GPIO20_0               .   Y   .   .   .   .   .   3  0  0
      21  GPIO21                  GPIO21_0   iomux  GPIO21_0               .   Y   .   .   .   .   .   2  0  0
      33  GPIO33                  SPIIO4     iomux  SPIIO4                 .   Y   .   .   Y   Y   .   3  0  1
      34  GPIO34                  SPIIO5     iomux  SPIIO5                 .   Y   .   .   Y   Y   .   3  0  1
      35  GPIO35                  SPIIO6     iomux  SPIIO6                 .   Y   .   .   Y   Y   .   3  0  1
      36  GPIO36                  SPIIO7     iomux  SPIIO7                 .   Y   .   .   Y   Y   .   3  0  1
      37  GPIO37                  SPIDQS     iomux  SPIDQS                 .   Y   .   .   Y   Y   .   3  0  1
      38  GPIO38                  GPIO38_0   iomux  GPIO38_0               .   Y   .   .   Y   .   .   2  0  0
      39  MTCK                    MTCK       iomux  MTCK                   .   Y   .   .   Y   .   .   2  0  1
      40  MTDO                    MTDO       iomux  MTDO                   .   Y   .   .   Y   .   .   2  0  0
      41  MTDI                    MTDI       iomux  MTDI                   .   Y   .   .   Y   .   .   2  0  0
      42  MTMS                    MTMS       iomux  MTMS                   .   Y   .   .   Y   .   .   2  0  0
      43  U0TXD                   U0TXD      iomux  U0TXD                  .   Y   .   .   Y   Y   .   2  0  1
      44  U0RXD                   U0RXD      iomux  U0RXD                  .   Y   .   .   Y   Y   .   2  0  1
      45  GPIO45                  GPIO45_0   iomux  GPIO45_0               .   Y   .   .   Y   .   Y   2  0  0
      46  GPIO46                  GPIO46_0   iomux  GPIO46_0               .   Y   .   .   Y   .   Y   2  0  0
      47  SPICLK_P                GPIO47     matrix GPIO                   .   Y   .   .   Y   .   .   2  0  0
      48  SPICLK_N                GPIO48     matrix GPIO                   .   Y   .   .   Y   .   .   2  0  0
    LEDC  clk=XTAL (40 MHz) clk_en=.
       timer          div  res      freq Hz paused  rst    cnt  clk
           0      39.9805   10      977.040      .    .    776  40 MHz
           1      39.9805   10      977.040      .    .    458  40 MHz
           2      39.9805   10      977.040      .    .    357  40 MHz
           3      39.9805   10      977.040      .    .    281  40 MHz
          ch timer out_en idle hpoint    duty     max       %  pins
           0     0      .    0      0       0    1024    0.00
           1     0      .    0      0       0    1024    0.00
           2     0      .    0      0       0    1024    0.00
           3     0      .    0      0       0    1024    0.00
           4     0      .    0      0       0    1024    0.00
           5     0      .    0      0       0    1024    0.00
           6     0      .    0      0       0    1024    0.00
           7     0      .    0      0       0    1024    0.00
    RMT  peripheral clock disabled or in reset
    I2S0  peripheral clock disabled or in reset
    I2S1  peripheral clock disabled or in reset
    SPI2  peripheral clock disabled or in reset
    SPI3  peripheral clock disabled or in reset
    I2C0  peripheral clock disabled or in reset
    I2C1  peripheral clock disabled or in reset
    UART0  clk=XTAL (40 MHz) baud=115211 8N1 rts=. cts=. inv_rx=. inv_tx=. loopback=. rx_fifo=0 tx_fifo=0 rxd=1 txd=1 int_ena=0x00001 raw=0x04002
           pins tx=43 rx=44 rts=- cts=-
    UART1  peripheral clock disabled or in reset
    UART2  peripheral clock disabled or in reset
    USB-Serial-JTAG  console=USB phy=internal pad_enable=Y D-=GPIO19 D+=GPIO20 reg_clk_force=. date=02101200
      host   sof=Y frame=1100 bus_reset=.
      cdc    in_ep1_free=Y in_ep1_state=1 out_ep1_avail=. out_ep1_cnt=2 out_ep1_state=0
      jtag   in_fifo_cnt=0 in_empty=Y in_full=. out_fifo_cnt=0 out_empty=Y out_full=.
      pads   pull_override=. dp_pullup=Y dp_pulldown=. dm_pullup=. dm_pulldown=. exchg_pins=.
      int    ena=0x204 serial_out_recv_pkt usb_bus_reset  raw=0x12A sof serial_in_empty crc5_err in_token_rec_in_ep1
    RTC_IO  mux=rtc: pad controlled by RTC_IO (IO_MUX/GPIO matrix settings do not apply), fun=RTC function (0=RTC_GPIO), force=RTC_CNTL hold force, -=not available on this pad
     rtc gpio pad         mux fun  ie  oe  od  pu  pd drv slp_sel slp_ie slp_oe hold force  o  i  int wake
       0    0 GPIO0       dig   0   .   .   .   .   Y   2       .      .      .    -     .  0  0    -    .
       1    1 GPIO1       dig   0   .   .   .   Y   .   2       .      .      .    -     .  0  1    -    .
       2    2 GPIO2       dig   0   .   .   .   .   Y   2       .      .      .    -     .  0  0    -    .
       3    3 GPIO3       dig   0   .   .   .   Y   .   2       .      .      .    -     .  0  0    -    .
       4    4 GPIO4       dig   0   .   .   .   .   Y   2       .      .      .    -     .  0  1    -    .
       5    5 GPIO5       dig   0   .   .   .   .   Y   2       .      .      .    -     .  0  1    -    .
       6    6 GPIO6       dig   0   .   .   .   Y   .   2       .      .      .    -     .  0  1    -    .
       7    7 GPIO7       dig   0   .   .   .   .   .   2       .      .      .    -     .  0  1    -    .
       8    8 GPIO8       dig   0   .   .   .   .   .   2       .      .      .    -     .  0  1    -    .
       9    9 GPIO9       dig   0   .   .   .   .   .   2       .      .      .    -     .  0  0    -    .
      10   10 GPIO10      dig   0   .   .   .   .   .   2       .      .      .    -     .  0  1    -    .
      11   11 GPIO11      dig   0   .   .   .   .   .   2       .      .      .    -     .  0  1    -    .
      12   12 GPIO12      dig   0   .   .   .   .   .   2       .      .      .    -     .  0  0    -    .
      13   13 GPIO13      dig   0   .   .   .   .   .   2       .      .      .    -     .  0  1    -    .
      14   14 GPIO14      dig   0   .   .   .   .   .   2       .      .      .    -     .  0  0    -    .
      15   15 XTAL_32K_P  dig   0   .   .   .   .   .   2       .      .      .    -     .  0  0    -    .
      16   16 XTAL_32K_N  dig   0   .   .   .   .   .   2       .      .      .    -     .  0  1    -    .
      17   17 DAC_1       dig   0   .   .   .   .   .   2       .      .      .    -     .  0  1    -    .
      18   18 DAC_2       dig   0   .   .   .   .   .   2       .      .      .    -     .  0  1    -    .
      19   19 GPIO19      dig   0   .   .   .   .   Y   2       .      .      .    -     .  0  1    -    .
      20   20 GPIO20      dig   0   .   .   .   .   Y   2       .      .      .    -     .  0  1    -    .
      21   21 GPIO21      dig   0   .   .   .   .   Y   2       .      .      .    -     .  0  0    -    .
    SLEEP  last_wakeup=undefined causes=0x00001 pm=enabled max=0 MHz min=0 MHz light_sleep=.
      wakeup_ena=0x0000C gpio timer
      ext0 en=. gpio=0 level=low
      ext1 en=. mode=all_low gpios: none  status: none
      pad_hold autohold=. autohold_en=. force_hold=.
    ```

??? example "ESP32-C6"
    ```
    GPIO  *=reserved by IDF driver, inv=output inverted, oeP=output enable by peripheral, oe=output enable, od=open drain, ie=input enable, pu=pull-up, pd=pull-down, drv=drive strength 0-3, o=output level, i=input level, !=input inverted, route rtc=pad controlled by LP_IO (see LP_IO)
     pin pad         tasmota      iomux      route  output signal        inv oeP  oe  od  ie  pu  pd drv  o  i  inputs
       0  XTAL_32K_P               GPIO0_0    iomux  GPIO0_0                .   Y   .   .   .   .   .   2  0  0
       1  XTAL_32K_N               GPIO1_0    iomux  GPIO1_0                .   Y   .   .   .   .   .   2  0  0
       2  GPIO2                    GPIO2_0    iomux  GPIO2_0                .   Y   .   .   Y   .   .   2  0  0
       3  GPIO3                    GPIO3_0    iomux  GPIO3_0                .   Y   .   .   Y   .   .   2  0  0
       4  MTMS        SDCard CS1   GPIO4      matrix GPIO                   .   .   Y   .   Y   .   .   2  1  1
       5  MTDI        SPI MISO1    GPIO5      matrix GPIO                   .   .   .   .   Y   .   .   2  0  1  FSPIQ_IN
       6  MTCK        SPI MOSI1    GPIO6      matrix FSPID_OUT              .   Y   Y   .   Y   .   .   2  0  0
       7  MTDO        SPI CLK1     GPIO7      matrix FSPICLK_OUT            .   Y   Y   .   Y   .   .   2  0  1
       8  GPIO8       WS2812       GPIO8      matrix RMT_SIG_OUT0           .   Y   Y   .   .   Y   .   2  0  0
       9  GPIO9                    GPIO9_0    iomux  GPIO9_0                .   Y   .   .   Y   Y   .   2  0  1
      10  GPIO10                   GPIO10_0   iomux  GPIO10_0               .   Y   .   .   Y   .   .   2  0  0
      11  GPIO11                   GPIO11_0   iomux  GPIO11_0               .   Y   .   .   Y   .   .   2  0  0
      12  GPIO12                   GPIO12_0   iomux  GPIO12_0               .   Y   .   .   Y   .   .   3  0  1
      13  GPIO13                   GPIO13_0   iomux  GPIO13_0               .   Y   .   .   Y   Y   .   3  0  1
      14  GPIO14      SPI CS1      GPIO14     matrix GPIO                   .   .   Y   .   Y   .   .   2  1  1
      15  GPIO15      SPI DC1      GPIO15     matrix GPIO                   .   .   Y   .   Y   .   .   2  1  1
      16  U0TXD                    U0TXD      iomux  U0TXD                  .   Y   .   .   Y   Y   .   2  0  1
      17  U0RXD                    U0RXD      iomux  U0RXD                  .   Y   .   .   Y   Y   .   2  0  1
      18  SDIO_CMD                 SDIO_CMD   iomux  SDIO_CMD               .   Y   .   .   Y   .   .   2  0  0
      19  SDIO_CLK                 SDIO_CLK   iomux  SDIO_CLK               .   Y   .   .   Y   .   .   2  0  0
      20  SDIO_DATA0               SDIO_DATA0 iomux  SDIO_DATA0             .   Y   .   .   Y   .   .   2  0  0
      21  SDIO_DATA1  Display Rst  GPIO21     matrix GPIO                   .   .   Y   .   Y   .   .   2  1  1
      22* SDIO_DATA2  Backlight    GPIO22     matrix LEDC_LS_SIG_OUT0       .   Y   Y   .   .   .   .   2  0  0
      23  SDIO_DATA3               SDIO_DATA3 iomux  SDIO_DATA3             .   Y   .   .   Y   .   .   2  0  0
      26* SPIWP                    SPIWP      iomux  SPIWP                  .   Y   .   .   Y   Y   .   1  0  0
      28* SPIHD                    SPIHD      iomux  SPIHD                  .   Y   .   .   Y   Y   .   1  0  1
    LEDC  clk=XTAL (40 MHz) clk_en=Y
       timer          div  res      freq Hz paused  rst    cnt  clk
           0     156.2500    8     1000.000      .    .    209  40 MHz
           1      39.9805   10      977.040      .    .    345  40 MHz
           2      39.9805   10      977.040      .    .    754  40 MHz
           3      39.9805   10      977.040      .    .    145  40 MHz
          ch timer out_en idle hpoint    duty     max       %  pins
           0     0      Y    0      0     158     256   61.72  22
           1     0      .    0      0       0     256    0.00
           2     0      .    0      0       0     256    0.00
           3     0      .    0      0       0     256    0.00
           4     0      .    0      0       0     256    0.00
           5     0      .    0      0       0     256    0.00
    RMT  clk=PLL_F80M (80 MHz) div=1 group=80 MHz clk_en=. mem_force_pd=. int_ena=0x0001 raw=0x0000
      ch0 tx  div=2 tick=25 ns idle_out=Y lv=0 carrier=. loop=. mem=4 state=0 pins=8
      ch1 tx  div=2 tick=25 ns idle_out=. lv=0 carrier=Y loop=. mem=1 state=0 pins=-
      ch2 rx  en=. div=2 tick=25 ns idle_thres=32767 filter=./15 carrier=Y mem=1 state=0 pin=-
      ch3 rx  en=. div=2 tick=25 ns idle_thres=32767 filter=./15 carrier=Y mem=1 state=0 pin=-
    I2S0  peripheral clock disabled or in reset
    SPI2  clk_en=Y role=master mode=3 clk=XTAL/1 (40 MHz) sck=40 MHz order=MSB duplex=full busy=. dma_tx=. dma_rx=. cs_dis=0x00 int_ena=0x0 raw=0x1000
          pins sck=7 mosi=6 miso=5 hd=- wp=- cs=-
    I2C0  peripheral clock disabled or in reset
    UART0  clk=XTAL (40 MHz) baud=115211 8N1 rts=. cts=. inv_rx=. inv_tx=. loopback=. rx_fifo=0 tx_fifo=0 rxd=1 txd=1 int_ena=0x00001 raw=0x00002
           pins tx=16 rx=17 rts=- cts=-
    UART1  peripheral clock disabled or in reset
    USB-Serial-JTAG  console=USB phy=internal pad_enable=Y D-=GPIO12 D+=GPIO13 reg_clk_force=. date=02109220
      host   sof=. frame=739 bus_reset=.
      cdc    in_ep1_free=Y in_ep1_state=1 out_ep1_avail=. out_ep1_cnt=2 out_ep1_state=0
      jtag   in_fifo_cnt=0 in_empty=Y in_full=. out_fifo_cnt=0 out_empty=Y out_full=.
      pads   pull_override=. dp_pullup=Y dp_pulldown=. dm_pullup=. dm_pulldown=. exchg_pins=.
      int    ena=0x204 serial_out_recv_pkt usb_bus_reset  raw=0x108 serial_in_empty in_token_rec_in_ep1
    LP_IO  peripheral clock disabled or in reset
    SLEEP  last_wakeup=undefined causes=0x00001 pm=enabled max=0 MHz min=0 MHz light_sleep=.
      wakeup_ena=0x00000
      ext1 en=. gpios: none  high: none  status: none
      pad_hold mask=0x00000000 sleep: hp_pad_hold_all=. lp_pad_hold_all=. dig_pad_slp_sel=Y
      deep_sleep_gpio_wakeup clk=. pins: none
    ```

??? example "ESP32-C5"
    ```
    GPIO  *=reserved by IDF driver, inv=output inverted, oeP=output enable by peripheral, oe=output enable, od=open drain, ie=input enable, pu=pull-up, pd=pull-down, drv=drive strength 0-3, o=output level, i=input level, !=input inverted, route rtc=pad controlled by LP_IO (see LP_IO)
     pin pad         tasmota      iomux      route  output signal        inv oeP  oe  od  ie  pu  pd drv  o  i  inputs
       0  XTAL_32K_P               GPIO0_0    iomux  GPIO0_0                .   Y   .   .   .   .   .   0  0  1
       1  XTAL_32K_N               GPIO1_0    iomux  GPIO1_0                .   Y   .   .   .   .   .   0  0  1
       2  MTMS                     MTMS       iomux  MTMS                   .   Y   .   .   .   .   .   0  0  1
       3  MTDI                     MTDI       iomux  MTDI                   .   Y   .   .   .   .   .   0  0  1
       4  MTCK                     MTCK       iomux  MTCK                   .   Y   .   .   .   .   .   0  0  1
       5  MTDO                     MTDO       iomux  MTDO                   .   Y   .   .   .   .   .   0  0  1
       6  GPIO6                    GPIO6_0    iomux  GPIO6_0                .   Y   .   .   .   .   .   0  0  1
       7  GPIO7                    SDIO_DATA1 iomux  SDIO_DATA1             .   Y   .   .   .   .   .   0  0  1
       8  GPIO8                    GPIO8_0    iomux  GPIO8_0                .   Y   .   .   .   .   .   0  0  1
       9  GPIO9                    GPIO9_0    iomux  GPIO9_0                .   Y   .   .   .   .   .   0  0  1
      10  GPIO10                   SDIO_CMD   iomux  SDIO_CMD               .   Y   .   .   .   .   .   0  0  1
      11  U0TXD                    U0TXD      iomux  U0TXD                  .   Y   .   .   .   Y   .   0  0  1
      12  U0RXD                    U0RXD      iomux  U0RXD                  .   Y   .   .   Y   Y   .   0  0  1
      13  GPIO13                   GPIO13     matrix GPIO                   .   .   .   .   .   .   .   0  0  1
      14  GPIO14                   GPIO14     matrix GPIO                   .   .   .   .   .   .   .   0  0  1
      15  SPICS1                   SPICS1     iomux  SPICS1                 .   Y   .   .   .   .   .   0  0  1
      23  GPIO23                   GPIO23_0   iomux  GPIO23_0               .   Y   .   .   .   .   .   0  0  1
      24  GPIO24                   GPIO24_0   iomux  GPIO24_0               .   Y   .   .   .   .   .   0  0  1
      25  GPIO25                   GPIO25_0   iomux  GPIO25_0               .   Y   .   .   .   .   .   0  0  1
      26  GPIO26                   GPIO26_0   iomux  GPIO26_0               .   Y   .   .   .   .   .   0  0  1
      27  GPIO27                   GPIO27_0   iomux  GPIO27_0               .   Y   .   .   .   .   .   0  0  1
      28  GPIO28                   GPIO28_0   iomux  GPIO28_0               .   Y   .   .   .   .   .   0  0  1
    LEDC  clk=XTAL (48 MHz) clk_en=Y
       timer          div  res      freq Hz paused  rst    cnt  clk
           0      47.9766   10      977.040      .    .    813  48 MHz
           1      47.9766   10      977.040      .    .     16  48 MHz
           2      47.9766   10      977.040      .    .    231  48 MHz
           3      47.9766   10      977.040      .    .    393  48 MHz
          ch timer out_en idle hpoint    duty     max       %  pins
           0     0      .    0      0       0    1024    0.00
           1     0      .    0      0       0    1024    0.00
           2     0      .    0      0       0    1024    0.00
           3     0      .    0      0       0    1024    0.00
           4     0      .    0      0       0    1024    0.00
           5     0      .    0      0       0    1024    0.00
    RMT  peripheral clock disabled or in reset
    I2S0  peripheral clock disabled or in reset
    SPI2  peripheral clock disabled or in reset
    I2C0  peripheral clock disabled or in reset
    UART0  clk=XTAL (48 MHz) baud=115211 8N1 rts=. cts=. inv_rx=. inv_tx=. loopback=. rx_fifo=0 tx_fifo=0 rxd=0 txd=0 int_ena=0x00195 raw=0x00002
           pins tx=11 rx=12 rts=- cts=-
    UART1  peripheral clock disabled or in reset
    USB-Serial-JTAG  peripheral clock disabled or in reset
    LP_IO  peripheral clock disabled or in reset
    SLEEP  last_wakeup=undefined causes=0x00001 pm=enabled max=0 MHz min=0 MHz light_sleep=.
      wakeup_ena=0x00000
      ext1 en=. gpios: none  high: none  status: none
      pad_hold mask=0x00000000 sleep: hp_pad_hold_all=. lp_pad_hold_all=. dig_pad_slp_sel=.
      deep_sleep_gpio_wakeup clk=. pins: none
    ```

??? example "ESP32-P4"
    ```
    GPIO  *=reserved by IDF driver, inv=output inverted, oeP=output enable by peripheral, oe=output enable, od=open drain, ie=input enable, pu=pull-up, pd=pull-down, drv=drive strength 0-3, o=output level, i=input level, !=input inverted, route rtc=pad controlled by LP_IO (see LP_IO)
     pin pad         tasmota      iomux      route  output signal        inv oeP  oe  od  ie  pu  pd drv  o  i  inputs
       0  GPIO0                    GPIO0_0    iomux  GPIO0_0                .   Y   .   .   .   .   .   0  0  1
       1  GPIO1                    GPIO1_0    iomux  GPIO1_0                .   Y   .   .   .   .   .   0  0  1
       2  GPIO2                    MTCK       iomux  MTCK                   .   Y   .   .   .   .   .   0  0  1
       3  GPIO3                    MTDI       iomux  MTDI                   .   Y   .   .   .   .   .   0  0  1
       4  GPIO4                    MTMS       iomux  MTMS                   .   Y   .   .   .   .   .   0  0  1
       5  GPIO5                    MTDO       iomux  MTDO                   .   Y   .   .   .   .   .   0  0  1
       6  GPIO6                    GPIO6_0    iomux  GPIO6_0                .   Y   .   .   .   .   .   0  0  1
       7  GPIO7                    GPIO7_0    iomux  GPIO7_0                .   Y   .   .   .   .   .   0  0  1
       8  GPIO8                    GPIO8_0    iomux  GPIO8_0                .   Y   .   .   .   .   .   0  0  1
       9  GPIO9                    GPIO9_0    iomux  GPIO9_0                .   Y   .   .   .   .   .   0  0  1
      10  GPIO10                   GPIO10_0   iomux  GPIO10_0               .   Y   .   .   .   .   .   0  0  1
      11  GPIO11                   GPIO11_0   iomux  GPIO11_0               .   Y   .   .   .   .   .   0  0  1
      12  GPIO12                   GPIO12_0   iomux  GPIO12_0               .   Y   .   .   .   .   .   0  0  1
      13  GPIO13                   GPIO13_0   iomux  GPIO13_0               .   Y   .   .   .   .   .   0  0  1
      14  GPIO14                   GPIO14     matrix SD_CARD_CDATA0_2_OUT   .   Y   Y   .   Y   Y   .   0  0  0  SD_CARD_CDATA0_2_IN
      15  GPIO15                   GPIO15     matrix SD_CARD_CDATA1_2_OUT   .   Y   Y   .   Y   Y   .   0  0  0  SD_CARD_CDATA1_2_IN
      16  GPIO16                   GPIO16     matrix SD_CARD_CDATA2_2_OUT   .   Y   Y   .   Y   Y   .   0  0  0  SD_CARD_CDATA2_2_IN
      17  GPIO17                   GPIO17     matrix GPIO                   .   Y   Y   .   .   .   .   0  1  1
      18  GPIO18                   GPIO18     matrix SD_CARD_CCLK_2_OUT     .   Y   Y   .   .   Y   .   0  0  0
      19  GPIO19                   GPIO19     matrix SD_CARD_CCMD_2_OUT     .   Y   Y   .   Y   Y   .   0  0  0  SD_CARD_CCMD_2_IN
      20  GPIO20                   GPIO20_0   iomux  GPIO20_0               .   Y   .   .   .   .   .   0  0  1
      21  GPIO21                   GPIO21_0   iomux  GPIO21_0               .   Y   .   .   .   .   .   0  0  1
      22  GPIO22                   GPIO22_0   iomux  GPIO22_0               .   Y   .   .   .   .   .   0  0  1
      23  GPIO23                   GPIO23_0   iomux  GPIO23_0               .   Y   .   .   .   .   .   0  0  1
      24  GPIO24                   GPIO24     matrix GPIO                   .   .   .   .   .   .   .   0  0  1
      25  GPIO25                   GPIO25     matrix GPIO                   .   .   .   .   .   .   .   0  0  1
      26  GPIO26                   GPIO26_0   iomux  GPIO26_0               .   Y   .   .   .   .   .   0  0  1
      27  GPIO27                   GPIO27_0   iomux  GPIO27_0               .   Y   .   .   .   .   .   0  0  1
      28  GPIO28                   GPIO28_0   iomux  GPIO28_0               .   Y   .   .   .   .   .   0  0  1
      29  GPIO29                   GPIO29_0   iomux  GPIO29_0               .   Y   .   .   .   .   .   0  0  1
      30  GPIO30                   GPIO30_0   iomux  GPIO30_0               .   Y   .   .   .   .   .   0  0  1
      31  GPIO31                   GPIO31_0   iomux  GPIO31_0               .   Y   .   .   .   .   .   0  0  1
      32  GPIO32                   GPIO32_0   iomux  GPIO32_0               .   Y   .   .   .   .   .   0  0  1
      33  GPIO33                   GPIO33_0   iomux  GPIO33_0               .   Y   .   .   .   .   .   0  0  1
      34  GPIO34                   GPIO34_0   iomux  GPIO34_0               .   Y   .   .   .   .   .   0  0  1
      35  GPIO35                   GPIO35_0   iomux  GPIO35_0               .   Y   .   .   .   .   .   0  0  1
      36  GPIO36                   GPIO36_0   iomux  GPIO36_0               .   Y   .   .   .   .   .   0  0  1
      37  GPIO37                   UART0_TXD  iomux  UART0_TXD              .   Y   .   .   .   Y   .   0  0  1
      38  GPIO38                   UART0_RXD  iomux  UART0_RXD              .   Y   .   .   Y   Y   .   0  0  1
      39  GPIO39                   SD1_CDATA0 iomux  SD1_CDATA0             .   Y   .   .   .   .   .   0  0  1
      40  GPIO40                   SD1_CDATA1 iomux  SD1_CDATA1             .   Y   .   .   .   .   .   0  0  1
      41  GPIO41                   SD1_CDATA2 iomux  SD1_CDATA2             .   Y   .   .   .   .   .   0  0  1
      42  GPIO42                   SD1_CDATA3 iomux  SD1_CDATA3             .   Y   .   .   .   .   .   0  0  1
      43  GPIO43                   SD1_CCLK   iomux  SD1_CCLK               .   Y   .   .   .   .   .   0  0  1
      44  GPIO44                   SD1_CCMD   iomux  SD1_CCMD               .   Y   .   .   .   .   .   0  0  1
      45  GPIO45                   SD1_CDATA4 iomux  SD1_CDATA4             .   Y   .   .   .   .   .   0  0  1
      46  GPIO46                   SD1_CDATA5 iomux  SD1_CDATA5             .   Y   .   .   .   .   .   0  0  1
      47  GPIO47                   SD1_CDATA6 iomux  SD1_CDATA6             .   Y   .   .   .   .   .   0  0  1
      48  GPIO48                   SD1_CDATA7 iomux  SD1_CDATA7             .   Y   .   .   .   .   .   0  0  1
      49  GPIO49                   GPIO49_0   iomux  GPIO49_0               .   Y   .   .   .   .   .   0  0  1
      50  GPIO50                   GPIO50_0   iomux  GPIO50_0               .   Y   .   .   .   .   .   0  0  1
      51  GPIO51                   GPIO51_0   iomux  GPIO51_0               .   Y   .   .   .   .   .   0  0  1
      52  GPIO52                   GPIO52_0   iomux  GPIO52_0               .   Y   .   .   .   .   .   0  0  1
      53  GPIO53                   GPIO53_0   iomux  GPIO53_0               .   Y   .   .   .   .   .   0  0  1
      54  GPIO54                   GPIO54     matrix SD_CARD_CCLK_2_OUT     .   Y   Y   .   .   .   .   0  1  1
    LEDC  clk=XTAL (40 MHz) clk_en=Y
       timer          div  res      freq Hz paused  rst    cnt  clk
           0      39.9805   10      977.040      .    .    333  40 MHz
           1      39.9805   10      977.040      .    .    437  40 MHz
           2      39.9805   10      977.040      .    .    558  40 MHz
           3      39.9805   10      977.040      .    .    681  40 MHz
          ch timer out_en idle hpoint    duty     max       %  pins
           0     0      .    0      0       0    1024    0.00
           1     0      .    0      0       0    1024    0.00
           2     0      .    0      0       0    1024    0.00
           3     0      .    0      0       0    1024    0.00
           4     0      .    0      0       0    1024    0.00
           5     0      .    0      0       0    1024    0.00
           6     0      .    0      0       0    1024    0.00
           7     0      .    0      0       0    1024    0.00
    RMT  peripheral clock disabled or in reset
    I2S0  peripheral clock disabled or in reset
    I2S1  peripheral clock disabled or in reset
    I2S2  peripheral clock disabled or in reset
    SPI2  peripheral clock disabled or in reset
    SPI3  peripheral clock disabled or in reset
    I2C0  peripheral clock disabled or in reset
    I2C1  peripheral clock disabled or in reset
    UART0  clk=XTAL (40 MHz) baud=115211 8N1 rts=. cts=. inv_rx=. inv_tx=. loopback=. rx_fifo=0 tx_fifo=0 rxd=0 txd=0 int_ena=0x00195 raw=0x00002
           pins tx=37 rx=38 rts=- cts=-
    UART1  peripheral clock disabled or in reset
    UART2  peripheral clock disabled or in reset
    UART3  peripheral clock disabled or in reset
    UART4  peripheral clock disabled or in reset
    USB-Serial-JTAG  peripheral clock disabled or in reset
    LP_IO  peripheral clock disabled or in reset
    SLEEP  last_wakeup=undefined causes=0x00001 pm=enabled max=0 MHz min=0 MHz light_sleep=.
      wakeup_ena=0x00000
      ext1 en=. gpios: none  high: none  status: none
      pad_hold mask=0x0000000000000000 sleep: hp_pad_hold_all=. lp_pad_hold_all=. dig_pad_slp_sel=.
      deep_sleep_gpio_wakeup clk=. pins: none
    ```
