!!! info "This feature is included in all precompiled binaries except `minimal` and `safeboot`"

    To add it to a custom build, add `#define USE_LOCATION` to `user_config_override.h`.
    *Introduced in version 16.0.0.4*

A device can store **where it is** and **how it is oriented**. Tools such as 3D building views or
dashboards can then read the position from the device itself, instead of deriving it from
MQTT topic naming conventions.

The location has two parts:

- **Global anchor** (WGS84): `Latitude`, `Longitude` and `Altitude`. These are the same values
  used by [sunrise and sunset timers](Timers.md).
- **Local pose**: a position `X`, `Y`, `Z` and an orientation `Alpha`, `Beta`, `Gamma` in a local
  frame of your choice, for example the house or the room. Tasmota does not interpret the frame,
  it only stores and reports it.

## Commands

Command|Parameters
:---|:---
Latitude<a id="latitude"></a>|`<value>` = set latitude in decimal degrees, e.g. `48.858360`
Longitude<a id="longitude"></a>|`<value>` = set longitude in decimal degrees, e.g. `2.294442`
Altitude<a id="altitude"></a>|`-30000..30000` = altitude in meters
Location<a id="location"></a>|Show global anchor and local pose<BR>`x,y,z` = set local position (in meters when `LocationScale` is `3`)<BR>`x,y,z,alpha,beta,gamma` = set local position and orientation (degrees)
LocationRot<a id="locationrot"></a>|`alpha,beta,gamma` = set orientation in degrees: yaw, pitch and roll, applied in Z-Y-X order. Angles are reported in the range `-180..180`, so `190` is shown as `-170`.
LocationScale<a id="locationscale"></a>|`0..6` = number of decimals for `X`, `Y` and `Z` (default `3` = millimeter resolution, `6` = micrometer). Changing the scale keeps the position, only the resolution changes.
LocationClear<a id="locationclear"></a>|Clear the local pose. The global anchor is kept.
SetOption166<a id="setoption166"></a>|`1` = add `Location` to the `tele/STATE` message

The local pose commands (`LocationRot`, `LocationScale`, `LocationClear` and setting a pose with
`Location`) need a place to store the pose: a file system on ESP32 or ESP8266, or the settings
area on ESP8266 (see [Storage](#storage)). ESP32 builds without file system only support the
global anchor.

## Examples

Set the global anchor and a pose 1.25 m east, 3.40 m north and 0.90 m above the local origin,
turned 90 degrees:

```haskell
Backlog Latitude 48.858360; Longitude 2.294442; Altitude 35; Location 1.25,3.4,0.9,90,0,0
```

Response:

```json
{"Location":{"Lat":48.858360,"Lon":2.294442,"Alt":35,"X":1.250,"Y":3.400,"Z":0.900,"Alpha":90.00,"Beta":0.00,"Gamma":0.00,"Scale":3}}
```

`X`, `Y`, `Z`, `Alpha`, `Beta`, `Gamma` and `Scale` are only shown when a local pose is set.

Change only the orientation:

```haskell
LocationRot 12.35,-0.5,190
```

Add the location to the telemetry message:

```haskell
SetOption166 1
```

```json
{"Time":"2026-11-13T12:00:00","Uptime":"0T00:10:00", ... ,"Location":{"Lat":48.858360,"Lon":2.294442,"Alt":35,"X":1.250,"Y":3.400,"Z":0.900,"Alpha":12.35,"Beta":-0.50,"Gamma":-170.00,"Scale":3}}
```

## Storage

`Latitude`, `Longitude` and `Altitude` are stored in the settings, as before.

The local pose is stored depending on what the device has:

**With a file system** (all ESP32, ESP8266 builds with [UFS](UFS.md) such as `tasmota-4M`):

- The pose is stored as JSON in `/.drvset000` under the key `drvset95` with full precision:
  ```json
  {"drvset95":{"Scale":3,"Flags":1,"Pos":[1250,3400,900],"Rot":[1235,-50,-17000]}}
  ```
- `Pos` is in units of 10<sup>-Scale</sup> (millimeters at scale 3), `Rot` in hundredths of a degree.
- The pose is included in a configuration backup (`*.dmp`) and restored with it.

**Without a file system** (ESP8266 1M builds, or when no file system is mounted):

- The pose is packed into 12 bytes of the settings area. This reduces the precision:

    | | With file system | Without file system (ESP8266) |
    |---|---|---|
    | Position range | ±2,147,483,647 units (±2147 km at scale 3) | ±1,048,575 units (±1048 m at scale 3) |
    | Position resolution | 1 unit (1 mm at scale 3) | 1 unit (1 mm at scale 3) |
    | Orientation resolution | 0.01° | 360/1024 ≈ 0.35° |

- Values are reduced to this precision when they are set, so what you see is what survives a
  restart. If a position is outside the range, the console logs
  `LOC: Position limited to +/-1048575 units without file system`.
- When the same device later runs a build with a file system (for example after changing from
  `tasmota` to `tasmota-4M`), the packed pose is moved to the file automatically.

`Reset 4`, `Reset 5` and `Reset 6` clear the local pose. `LocationClear` removes the `drvset95`
key from the file.

!!! note
    On ESP8266 without a file system, downgrading to a version before 16.0.0.4 and upgrading
    again clears the stored local pose. Set it again after the upgrade. With a file system the
    pose is kept.
