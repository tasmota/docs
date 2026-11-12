# Heap Map

!!!note "New in Tasmota v16.0.0.1"

Heap Map is a debugging aid for developers and advanced users on **ESP32** (all variants). It logs how much internal RAM (heap) is used at each stage of the boot, and which driver consumed it. It is useful when a device runs out of memory, for example with a large display and LVGL on an ESP32 without PSRAM, and you need to know *who* uses the memory.

Heap Map is **not included in any pre-compiled binary**. You need to [compile your own build](Compile-your-build.md) with `USE_HEAP_MAP`. It is not available on ESP8266.

Heap Map logs at `LOG_LEVEL_DEBUG` , so the log levels must be at least `3` ([`SerialLog 3`](Commands.md#seriallog) / [`WebLog 3`](Commands.md#weblog)). `SerialLog` and `WebLog` default to `2` (info) and are applied only after the settings are loaded, so the first rows would be missed. To see the whole boot, also set the default levels at compile time.

### Options

Option|Default|Description
:---|:---|:---
`HEAP_MAP_PERIOD`|`30`|Seconds between two periodic rows once the device is booted. `0` disables the periodic rows.
`HEAP_MAP_CALL_MIN`|`100`|Minimum change of the heap, in bytes, for a driver call to be logged. `0` disables the logging of driver calls and keeps only the table rows.
`HEAP_MAP_EVENTS_BOOT_ONLY`|`1`|Stop logging stages and driver calls once the `boot` row is logged (10 seconds after start), and keep only the periodic rows to avoid noise. `0` keeps logging stages and driver calls for the whole run.

## Reading the log

All lines start with `HMP:`. Here is an example, with the timestamp removed:

```
HMP: stage           largest     min  blks delta    used   delta    free  heap used
HMP: setup            216.0K  254.8K   310         45.2K          254.8K  [##..........]  15%
HMP: settings         214.0K  252.1K   330   +20   47.9K   +2.7K  252.1K  [##..........]  16%
HMP: berry            181.9K  221.4K   980  +650   78.4K  +30.5K  221.6K  [###.........]  26%
HMP: xdrv_52  INIT                                 81.8K   +3.4K  218.2K  [###.........]  27%
HMP: preinit          181.9K  217.0K  1010   +30   82.5K   +0.7K  217.5K  [###.........]  28%
HMP: xdsp_17  DISPLAY_INIT_DRIVER                  83.6K   +1.1K  216.4K  [###.........]  28%
HMP: xdsp_17  DISPLAY_INIT                        120.4K  +36.8K  179.6K  [#####.......]  40%
HMP: xdrv_54  INIT                                132.8K  +12.4K  167.2K  [#####.......]  44%
HMP: init             120.0K  160.0K  1105   +95  133.7K   +0.9K  166.3K  [#####.......]  45%
HMP: network_connect  118.7K  160.0K  1120   +15  134.9K   +1.2K  165.1K  [#####.......]  45%
HMP: xdrv_01  WEB_ADD_HANDLER                     137.0K   +2.1K  163.0K  [#####.......]  46%
HMP: network_started  110.2K  153.2K  1160   +40  146.6K   +9.6K  153.4K  [######......]  49%
HMP: boot             110.2K  152.0K  1171   +11  146.9K   +0.3K  153.1K  [######......]  49%
HMP: up 30s           110.2K  152.0K  1173    +2  147.0K   +0.1K  153.0K  [######......]  49%
HMP: up 60s           110.2K  152.0K  1173     0  147.0K       0  153.0K  [######......]  49%
```

All sizes are in KB with one decimal. Only the **internal** heap is reported. PSRAM and IRAM are not counted, as they are not the usual cause of memory problems and would make the figures confusing.

### Table rows

A row is logged at some stages of the boot, then every `HEAP_MAP_PERIOD` seconds. The header is repeated every 20 rows.

Column|Description
:---|:---
`stage`|Event after which the row was logged, see below.
`largest`|Largest free contiguous block. This is the biggest allocation that can succeed, a small value compared to `free` shows fragmentation.
`min`|Minimum free heap since boot. It shows peak usage that happened between two rows.
`blks`|Number of allocated blocks.
`delta` (after `blks`)|Change of the number of allocated blocks since the previous row.
`used`|Heap in use (total heap size minus free).
`delta` (after `used`)|Change of `used` since the line above, whatever line it is (a table row or a driver call). `0` means no change.
`free`|Free heap.
`heap used`|Bar and percentage of the heap in use.

Stages logged during boot:

Stage|Description
:---|:---
`setup`|Start of `setup()`, as soon as logging is available.
`settings`|Settings loaded.
`berry`|Berry VM started and `preinit.be` loaded (only with Berry).
`preinit`|After `FUNC_PRE_INIT` was sent to all drivers.
`init`|After `FUNC_INIT` was sent to all drivers.
`autoexec`|After `autoexec.be` was run (only with Berry).
`network_connect`|Network (Wi-Fi or Ethernet) just connected, before network services are started.
`network_started`|Network services (web server, mDNS...) started.
`boot`|End of the boot, 10 seconds after start.
`up Ns`|Periodic row, `N` is the uptime in seconds.

### Driver lines

Between table rows, a line is logged every time a driver call changes the heap by at least `HEAP_MAP_CALL_MIN` bytes. They show the driver (`xdrv`, `xsns`, `xlgt`, `xnrg` or `xdsp` followed by its number, as in `xdrv_52` for `xdrv_52_*_berry.ino`) and the event, followed by `used`, `delta`, `free` and the bar.

Only a few events are tracked, the ones where drivers allocate their memory:

* All drivers: `PRE_INIT`, `INIT`, `MODULE_INIT`, `MQTT_INIT`, `WEB_ADD_HANDLER`, `NETWORK_UP`
* Display drivers: `DISPLAY_INIT_DRIVER`, `DISPLAY_INIT`

Periodic events (`EVERY_SECOND`, `LOOP`...), commands and sensor reporting are not tracked as they would generate too much noise.

If a light or energy driver did not claim the device, it is identified by its position in the driver list instead of its number, for example `xlgt#3`. For display drivers, the number is the one of the display model (`DisplayModel`).

An `other` line shows the heap used outside of the tracked calls since the previous line, if it is at least `HEAP_MAP_CALL_MIN`. Together with the `delta` column this makes the figures add up from line to line.

!!! note
    The heap is global to the whole device. Memory allocated by other tasks (Wi-Fi, TCP/IP stack...) while a driver call is running is charged to this driver. A `+` and `-` of the same size on unrelated drivers is usually such noise.

## Berry

!!!note "Requires `USE_HEAP_MAP`"

You can log a row from Berry, for example to measure what a script costs.

```berry
tasmota.heapmap()                  # logs a row labeled "berry"
tasmota.heapmap("my_script")       # logs a row with your own label
tasmota.heapmap("my_script", true) # also forces the table header
```

Rows logged from Berry are always logged, even after the `boot` row with `HEAP_MAP_EVENTS_BOOT_ONLY`.

Only the first 15 characters of the label are displayed.
