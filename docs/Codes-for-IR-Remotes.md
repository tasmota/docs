The IR Codes can be used with any device with an IR sender.

The codes will also fit other devices from same manufacturer or series.
Please try out...

Feel free to contribute this list.

## TV's

### Samsung AA59 TV remote controller

**Example IRsend Command:**

`IRsend {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E09966"}`

| button        | code                                                 |
| ------------- | -----------------------------------------------------|
| TOGGLE ON/OFF | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E040BF"} |
| ON            | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E09966"} |
| OFF           | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E019E6"} |
| SOURCE        | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0807F"} |
| 1             | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E020DF"} |
| 2             | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0A05F"} |
| 3             | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0609F"} |
| 4             | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E010EF"} |
| 5             | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0906F"} |
| 6             | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E050AF"} |
| 7             | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E030CF"} |
| 8             | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0B04F"} |
| 9             | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0708F"} |
| 0             | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E08877"} |
| TTX/MIX       | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E034CB"} |
| PRE-CHN       | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0C837"} |
| VOL+          | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0E01F"} |
| VOL-          | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0D02F"} |
| CH LIST       | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0D629"} |
| MUTE          | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0F00F"} |
| PROG+         | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E048B7"} |
| PROG-         | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E008F7"} |
| MENU          | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E058A7"} |
| SMARTHUB      | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E09E61"} |
| GUIDE         | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0F20D"} |
| TOOLS         | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0D22D"} |
| INFO          | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0F807"} |
| UP            | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E006F9"} |
| DOWN          | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E08679"} |
| LEFT          | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0A659"} |
| RIGHT         | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E046B9"} |
| MIDDLE        | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E016E9"} |
| RETURN        | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E01AE5"} |
| EXIT          | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0B44B"} |
| A_RED         | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E036C9"} |
| B_GREEN       | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E028D7"} |
| C_YELLOW      | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0A857"} |
| D_BLUE        | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E06897"} |
| E-MANUAL      | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0FC03"} |
| 3D            | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0F906"} |
| AD/SUBT       | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0A45B"} |
| STOP          | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0629D"} |
| PREV          | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0A25D"} |
| PLAY          | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E0E21D"} |
| PAUSE         | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E052AD"} |
| NEXT          | {"Protocol":"SAMSUNG","Bits":32,"Data":"0xE0E012ED"} |

### TCL 55P715 TV

**Example IRsend Command:**

`IRsend {"Protocol":"NIKAI","Bits":48,"Data":0x0x0D5F2A}`

| button   | code     |
| -------- | -------- |
| Power    | 0x0D5F2A |
| Vol+     | 0x0D0F2F |
| Vol-     | 0x0D1F2E |
| Mute     | 0x0C0F3F |
| info     | 0x0C3F3C |
| P+=      | 0x0D2F2D |
| P-       | 0x0D3F2C |
| Settings | 0x030FCF |
| EPG      | 0x0E5F1A |
| Home     | 0x0F7F08 |
| UP       | 0x0A6F59 |
| Down     | 0x0A7F58 |
| LEFT     | 0x0A9F56 |
| Right    | 0x0A8F57 |
| Enter    | 0x00BFF4 |
| Menu     | 0x013FEC |
| Back     | 0x0D8F27 |
| NetFlix  | 0x010FEF |
| Source   | 0x05CFA3 |

### TCL 55T8B TV (with remote RC833 P/N GUB1)

**Example IRsend Command:**

`IRsend {"Protocol":"NIKAI","Bits":24,"Data":"0xD5F2A","DataLSB":"0xB0FA54","Repeat":0}`

| button        | code                                                                            |
| ------------- | --------------------------------------------------------------------------------|
| TOGGLE ON/OFF | {"Protocol":"NIKAI","Bits":24,"Data":"0xD5F2A","DataLSB":"0xB0FA54","Repeat":0} |
| MUTE          | {"Protocol":"NIKAI","Bits":24,"Data":"0xC0F3F","DataLSB":"0x30F0FC","Repeat":0} |
| 1             | {"Protocol":"NIKAI","Bits":24,"Data":"0xCEF31","DataLSB":"0x30F78C","Repeat":0} |
| 2             | {"Protocol":"NIKAI","Bits":24,"Data":"0xCDF32","DataLSB":"0x30FB4C","Repeat":0} |
| 3             | {"Protocol":"NIKAI","Bits":24,"Data":"0xCCF33","DataLSB":"0x30F3CC","Repeat":0} |
| 4             | {"Protocol":"NIKAI","Bits":24,"Data":"0xCBF34","DataLSB":"0x30FD2C","Repeat":0} |
| 5             | {"Protocol":"NIKAI","Bits":24,"Data":"0xCAF35","DataLSB":"0x30F5AC","Repeat":0} |
| 6             | {"Protocol":"NIKAI","Bits":24,"Data":"0xC9F36","DataLSB":"0x30F96C","Repeat":0} |
| 7             | {"Protocol":"NIKAI","Bits":24,"Data":"0xC8F37","DataLSB":"0x30F1EC","Repeat":0} |
| 8             | {"Protocol":"NIKAI","Bits":24,"Data":"0xC7F38","DataLSB":"0x30FE1C","Repeat":0} |
| 9             | {"Protocol":"NIKAI","Bits":24,"Data":"0xC6F39","DataLSB":"0x30F69C","Repeat":0} |
| 0             | {"Protocol":"NIKAI","Bits":24,"Data":"0xCFF30","DataLSB":"0x30FF0C","Repeat":0} |
| SOURCE        | {"Protocol":"NIKAI","Bits":24,"Data":"0x5CFA3","DataLSB":"0xA0F3C5","Repeat":0} |
| MENU          | {"Protocol":"NIKAI","Bits":24,"Data":"0x13FEC","DataLSB":"0x80FC37","Repeat":0} |
| RED           | {"Protocol":"NIKAI","Bits":24,"Data":"0xFFF00","DataLSB":"0xF0FF00","Repeat":0} |
| GREEN         | {"Protocol":"NIKAI","Bits":24,"Data":"0x17FE8","DataLSB":"0x80FE17","Repeat":0} |
| YELLOW        | {"Protocol":"NIKAI","Bits":24,"Data":"0x1BFE4","DataLSB":"0x80FD27","Repeat":0} |
| BLUE          | {"Protocol":"NIKAI","Bits":24,"Data":"0x27FD8","DataLSB":"0x40FE1B","Repeat":0} |
| ACCOUNT       | {"Protocol":"NIKAI","Bits":24,"Data":"0x7CF83","DataLSB":"0xE0F3C1","Repeat":0} |
| GOOGLE MIC    | {"Protocol":"NIKAI","Bits":24,"Data":"0xA3F5C","DataLSB":"0x50FC3A","Repeat":0} |
| SETTINGS      | {"Protocol":"NIKAI","Bits":24,"Data":"0x30FCF","DataLSB":"0xC0F0F3","Repeat":0} |
| UP            | {"Protocol":"NIKAI","Bits":24,"Data":"0xA6F59","DataLSB":"0x50F69A","Repeat":0} |
| DOWN          | {"Protocol":"NIKAI","Bits":24,"Data":"0xA7F58","DataLSB":"0x50FE1A","Repeat":0} |
| LEFT          | {"Protocol":"NIKAI","Bits":24,"Data":"0xA9F56","DataLSB":"0x50F96A","Repeat":0} |
| RIGHT         | {"Protocol":"NIKAI","Bits":24,"Data":"0xA8F57","DataLSB":"0x50F1EA","Repeat":0} |
| OK            | {"Protocol":"NIKAI","Bits":24,"Data":"0xBFF4","DataLSB":"0xFD2F","Repeat":0}    |
| BACK          | {"Protocol":"NIKAI","Bits":24,"Data":"0xD8F27","DataLSB":"0xB0F1E4","Repeat":0} |
| HOME          | {"Protocol":"NIKAI","Bits":24,"Data":"0xF7F08","DataLSB":"0xF0FE10","Repeat":0} |
| TV            | {"Protocol":"NIKAI","Bits":24,"Data":"0xE5F1A","DataLSB":"0x70FA58","Repeat":0} |
| VOL+          | {"Protocol":"NIKAI","Bits":24,"Data":"0xD0F2F","DataLSB":"0xB0F0F4","Repeat":0} |
| VOL-          | {"Protocol":"NIKAI","Bits":24,"Data":"0xD1F2E","DataLSB":"0xB0F874","Repeat":0} |
| CH +          | {"Protocol":"NIKAI","Bits":24,"Data":"0xD2F2D","DataLSB":"0xB0F4B4","Repeat":0} |
| CH -          | {"Protocol":"NIKAI","Bits":24,"Data":"0xD3F2C","DataLSB":"0xB0FC34","Repeat":0} |
| LIST          | {"Protocol":"NIKAI","Bits":24,"Data":"0x9EF61","DataLSB":"0x90F786","Repeat":0} |
| INFO          | {"Protocol":"NIKAI","Bits":24,"Data":"0xC3F3C","DataLSB":"0x30FC3C","Repeat":0} |
| NETFLIX       | {"Protocol":"NIKAI","Bits":24,"Data":"0x10FEF","DataLSB":"0x80F0F7","Repeat":0} |
| PRIME VIDEO   | {"Protocol":"NIKAI","Bits":24,"Data":"0x3EFC1","DataLSB":"0xC0F783","Repeat":0} |
| YOUTUBE       | {"Protocol":"NIKAI","Bits":24,"Data":"0x1DFE2","DataLSB":"0x80FB47","Repeat":0} |
| TCL CHANNEL   | {"Protocol":"NIKAI","Bits":24,"Data":"0x1CFE3","DataLSB":"0x80F3C7","Repeat":0} |
| TCL HOME      | {"Protocol":"NIKAI","Bits":24,"Data":"0x80F7F","DataLSB":"0x10F0FE","Repeat":0} |
| WEB           | {"Protocol":"NIKAI","Bits":24,"Data":"0x9CF63","DataLSB":"0x90F3C6","Repeat":0} |


### Panasonic TX65FXW784 TV

**Example received Code:**

`tele/sonoffIRBridge_1/RESULT = {"IrReceived":{"Protocol":"PANASONIC","Bits":48,"Data":"0x100BCBD"}}`

**Example IRsend Command:**

`IRsend {"Protocol":"PANASONIC","Bits":48,"Data":0x100BCBD}`

| button        | code           |
| ------------- | -------------- |
| ON/OFF        | 0x40040100BCBD |
| Mute          | 0x400401004C4D |
| Vol+          | 0x400401000405 |
| Vol-          | 0x400401008485 |
| P+            | 0x400401002C2D |
| P-            | 0x40040100ACAD |
| Left          | 0x400401007273 |
| Right         | 0x40040100F2F3 |
| Up            | 0x400401005253 |
| Down          | 0x40040100D2D3 |
| OK            | 0x400401009293 |
| Menu          | 0x400401004A4B |
| Red           | 0x400401000E0F |
| Yellow        | 0x400401004E4F |
| Green         | 0x400401008E8F |
| Blue          | 0x40040100CECF |
| Last View     | 0x40040100ECED |
| My App        | 0x400401206D4C |
| Netflix       | 0x400401904FDE |
| Apps          | 0x40040190F160 |
| Play          | 0x400401900392 |
| Pause         | 0x400401908312 |
| Stop          | 0x4004019043D2 |
| Forward       | 0x40040190C352 |
| Back          | 0x4004019023B2 |
| Key 1         | 0x400401000809 |
| Key 2         | 0x400401008889 |
| Key 3         | 0x400401004849 |
| Key 4         | 0x40040100C8C9 |
| Key 5         | 0x400401002829 |
| Key 6         | 0x40040100A8A9 |
| Key 7         | 0x400401006869 |
| Key 8         | 0x40040100E8E9 |
| Key 9         | 0x400401001819 |
| Key 0         | 0x400401009899 |
| Title forward | 0x40040190BB2A |
| Title back    | 0x400401903BAA |
| Record        | 0x40040190A332 |
| Guide         | 0x40040190E170 |
| Exit          | 0x40040100CBCA |
| Back          | 0x400401002B2A |
| Option        | 0x40040190E574 |
| Info          | 0x400401009C9D |
| TV            | 0x400401400C4D |
| AV            | 0x40040100A0A1 |
| Text          | 0x40040180C041 |
| STTL          | 0x40040180A021 |
| Picture       | 0x400401000A0B |
| Help          | 0x400401003534 |

### Sony KDL-EX540 TV

Common buttons should work across multiple models

| button              | code                                          |
| ------------------- | --------------------------------------------- |
| Input               | {"Protocol":"SONY","Bits":12,"Data":"0xA50"}  |
| Power On            | {"Protocol":"SONY","Bits":12,"Data":"0x750"}  |
| Power Off           | {"Protocol":"SONY","Bits":12,"Data":"0xF50"}  |
| Power Toggle        | {"Protocol":"SONY","Bits":12,"Data":"0xA90"}  |
| Vol +               | {"Protocol":"SONY","Bits":12,"Data":"0x490"}  |
| Vol -               | {"Protocol":"SONY","Bits":12,"Data":"0xC90"}  |
| Mute                | {"Protocol":"SONY","Bits":12,"Data":"0x290"}  |
| Ch +                | {"Protocol":"SONY","Bits":12,"Data":"0x090"}  |
| Ch -                | {"Protocol":"SONY","Bits":12,"Data":"0x890"}  |
| Theatre Mode        | {"Protocol":"SONY","Bits":15,"Data":"0x03EE"} |
| Play/Pause          | {"Protocol":"SONY","Bits":15,"Data":"0x2CE9"} |
| Stop                | {"Protocol":"SONY","Bits":15,"Data":"0x0CE9"} |
| Rew                 | {"Protocol":"SONY","Bits":15,"Data":"0x6CE9"} |
| Fwd                 | {"Protocol":"SONY","Bits":15,"Data":"0x1CE9"} |
| Sync Menu           | {"Protocol":"SONY","Bits":15,"Data":"0x0D58"} |
| Prev                | {"Protocol":"SONY","Bits":15,"Data":"0x1EE9"} |
| Next                | {"Protocol":"SONY","Bits":15,"Data":"0x5EE9"} |
| i-Manual            | {"Protocol":"SONY","Bits":15,"Data":"0x6F58"} |
| Scene               | {"Protocol":"SONY","Bits":15,"Data":"0x0F58"} |
| Aspect              | {"Protocol":"SONY","Bits":15,"Data":"0x5E25"} |
| Digital/Analog      | {"Protocol":"SONY","Bits":15,"Data":"0x58EE"} |
| PIP                 | {"Protocol":"SONY","Bits":15,"Data":"0x7725"} |
| Internet Video      | {"Protocol":"SONY","Bits":15,"Data":"0x4F58"} |
| Favourite           | {"Protocol":"SONY","Bits":15,"Data":"0x37EE"} |
| Guide               | {"Protocol":"SONY","Bits":15,"Data":"0x6D25"} |
| Info                | {"Protocol":"SONY","Bits":12,"Data":"0x5D0"}  |
| Return              | {"Protocol":"SONY","Bits":15,"Data":"0x62E9"} |
| Options             | {"Protocol":"SONY","Bits":15,"Data":"0x36E9"} |
| Home                | {"Protocol":"SONY","Bits":12,"Data":"0x070"}  |
| Up                  | {"Protocol":"SONY","Bits":12,"Data":"0x2F0"}  |
| Down                | {"Protocol":"SONY","Bits":12,"Data":"0xAF0"}  |
| Left                | {"Protocol":"SONY","Bits":12,"Data":"0x2D0"}  |
| Right               | {"Protocol":"SONY","Bits":12,"Data":"0xCD0"}  |
| Enter               | {"Protocol":"SONY","Bits":12,"Data":"0xA70"}  |
| Red                 | {"Protocol":"SONY","Bits":15,"Data":"0x52E9"} |
| Green               | {"Protocol":"SONY","Bits":15,"Data":"0x32E9"} |
| Yellow              | {"Protocol":"SONY","Bits":15,"Data":"0x72E9"} |
| Blue                | {"Protocol":"SONY","Bits":15,"Data":"0x12E9"} |
| 1                   | {"Protocol":"SONY","Bits":12,"Data":"0x010"}  |
| 2                   | {"Protocol":"SONY","Bits":12,"Data":"0x810"}  |
| 3                   | {"Protocol":"SONY","Bits":12,"Data":"0x410"}  |
| 4                   | {"Protocol":"SONY","Bits":12,"Data":"0xC10"}  |
| 5                   | {"Protocol":"SONY","Bits":12,"Data":"0x210"}  |
| 6                   | {"Protocol":"SONY","Bits":12,"Data":"0xA10"}  |
| 7                   | {"Protocol":"SONY","Bits":12,"Data":"0x610"}  |
| 8                   | {"Protocol":"SONY","Bits":12,"Data":"0xE10"}  |
| 9                   | {"Protocol":"SONY","Bits":12,"Data":"0x110"}  |
| Text                | {"Protocol":"SONY","Bits":12,"Data":"0xFD0"}  |
| 0                   | {"Protocol":"SONY","Bits":12,"Data":"0x110"}  |
| Subtitles           | {"Protocol":"SONY","Bits":15,"Data":"0x0AE9"} |
| Audio Track         | {"Protocol":"SONY","Bits":12,"Data":"0xE90"}  |
| HDMI 1              | {"Protocol":"SONY","Bits":15,"Data":"0x2D58"} |
| HDMI 2              | {"Protocol":"SONY","Bits":15,"Data":"0x6D58"} |
| HDMI 3              | {"Protocol":"SONY","Bits":15,"Data":"0x1D58"} |
| HDMI 4              | {"Protocol":"SONY","Bits":15,"Data":"0x5D58"} |
| Video 1             | {"Protocol":"SONY","Bits":12,"Data":"0x030"}  |
| Video 2             | {"Protocol":"SONY","Bits":12,"Data":"0x830"}  |
| Video 3/Component 1 | {"Protocol":"SONY","Bits":12,"Data":"0x430"}  |
| PC                  | {"Protocol":"SONY","Bits":12,"Data":"0xC30"}  |
| Digital TV          | {"Protocol":"SONY","Bits":15,"Data":"0x25EE"} |

### LG 55UH8509 TV

**Example received Code:**

`tele/sonoffIRBridge_1/RESULT = {"IrReceived":{"Protocol":"NEC","Bits":32,"Data":"0x20DF10EF"}}`

**Example IRsend Command:**

`IRsend {"Protocol":"NEC","Bits":32,"Data":0x20DF10EF}`

**or with mosquitto_pub:**

`mosquitto_pub -q 2 -t cmnd/sonoffIRBridge_1/IRSend -m '{"protocol": "NEC","bits": 32, "data": 0x20DF10EF}'`

| button                         | code       |
| ------------------------------ | ---------- |
| ON/OFF                         | 0x20DF10EF |
| TV                             | 0x20DF0FF0 |
| Ratio                          | 0x20DF9E61 |
| Input                          | 0x20DFD02F |
| Energy                         | 0x20DFA956 |
| Key 1                          | 0x20DF8877 |
| Key 2                          | 0x20DF48B7 |
| Key 3                          | 0x20DFC837 |
| Key 4                          | 0x20DF28D7 |
| Key 5                          | 0x20DFA857 |
| Key 6                          | 0x20DF6897 |
| Key 7                          | 0x20DFE817 |
| Key 8                          | 0x20DF18E7 |
| Key 9                          | 0x20DF9867 |
| List                           | 0x20DFCA35 |
| Key 0                          | 0x20DF08F7 |
| Q.View                         | 0x20DF58A7 |
| Vol+                           | 0x20DF40BF |
| Vol-                           | 0x20DFC03F |
| Vol-                           | 0x20DFCE31 |
| Fav                            | 0x20DF7887 |
| 3D                             | 0x20DF3BC4 |
| Mute                           | 0x20DF906F |
| P+                             | 0x20DF00FF |
| P-                             | 0x20DF807F |
| Settings                       | 0x20DFC23D |
| Info                           | 0x20DF55AA |
| Q.Menu                         | 0x20DFA25D |
| Left                           | 0x20DFE01F |
| Right                          | 0x20DF609F |
| Up                             | 0x20DF02FD |
| Down                           | 0x20DF827D |
| OK                             | 0x20DF22DD |
| Back                           | 0x20DF14EB |
| Guide                          | 0x20DFD52A |
| Exit                           | 0x20DFDA25 |
| Red                            | 0x20DF4EB1 |
| Green                          | 0x20DF8E71 |
| Yellow                         | 0x20DFC639 |
| Blue                           | 0x20DF8679 |
| Text                           | 0x20DF04FB |
| T.Opt                          | 0x20DF847B |
| Subtitle                       | 0x20DF9C63 |
| Stop                           | 0x20DF8D72 |
| Play                           | 0x20DF0DF2 |
| Pause                          | 0x20DF5DA2 |
| Backward                       | 0x20DFF10E |
| Forward                        | 0x20DF718E |
| Simplink                       | 0x20DF7E81 |
| AD                             | 0x20DF8976 |
| AV Mode                        | 0x20DF0CF3 |
| Live TV                        | 0x20DF3EC1 |
| Live TV                        | 0x20DF42BD |
| Status                         | 0x20DF35CA |
| Audio Language                 | 0x20DF50AF |
| Shortmenu                      | 0x20DF57A8 |
| AV                             | 0x20DF5AA5 |
| online manual                  | 0x20DF5EA1 |
| Volume to 50                   | 0x20DF619E |
| Volume to 80                   | 0x20DF21DE |
| Volume to 100                  | 0x20DFE11E |
| Radio/TV                       | 0x20DF6B94 |
| doze function                  | 0x20DF708F |
| Display off                    | 0x20DFA35C |
| Standby                        | 0x20DFD728 |
| Power on                       | 0x20DF23DC |
| Settings of remote             | 0x20DFB44B |
| Program guide                  | 0x20DF956A |
| Radio/TV                       | 0x20DFF00F |
| HDMI 1                         | 0x20DF738C |
| HDMI 2                         | 0x20DF33CC |
| HDMI 3                         | 0x20DF9768 |
| Component                      | 0x20DFFD02 |
| Live Zoom                      | 0x20DFF50A |
| Input info                     | 0x20DFF20D |
| Picture mode                   | 0x20DFB24D |
| Recordings                     | 0x20DF09F6 |
| Audio mode                     | 0x20DF4AB5 |
| Register magic remote          | 0x20DF7B84 |
| directly register magic remote | 0x20DFAE51 |
| Subtitles                      | 0x20DF1CE3 |
| Presentation in shop           | 0x20DFCC33 |
| Start recording                | 0x20DFBD42 |
| LG TV Plus                     | 0x20DFAD52 |
| Sports mode                    | 0x20DFDD22 |
| Search                         | 0x20DF1EE1 |
| Warning: instart               | 0x20DFDF20 |
| Warning: Poweronly             | 0x20DF7F80 |
| Warning: Easy adjust           | 0x20DFFF00 |
| Warning: instop                | 0x20DF5FA0 |
| Enter Password                 | 0x20DF5FA0 |
| Warning: Reset to factory      | 0x20DF3FC0 |

### Generic VEON TV (eg model SRO322016)

| button     | code                                             |
| ---------- | ------------------------------------------------ |
| On/Off     | {"Protocol":"NEC","Bits":32,"Data":"0x00FEA857"} |
| Mute       | {"Protocol":"NEC","Bits":32,"Data":"0x00FE6897"} |
| Sleep      | {"Protocol":"NEC","Bits":32,"Data":"0x00FE38C7"} |
| Source     | {"Protocol":"NEC","Bits":32,"Data":"0x00FE48B7"} |
| Info       | {"Protocol":"NEC","Bits":32,"Data":"0x00FE28D7"} |
| EPG        | {"Protocol":"NEC","Bits":32,"Data":"0x00FEAA55"} |
| Vol+       | {"Protocol":"NEC","Bits":32,"Data":"0x00FED827"} |
| Vol-       | {"Protocol":"NEC","Bits":32,"Data":"0x00FE58A7"} |
| Chan+      | {"Protocol":"NEC","Bits":32,"Data":"0x00FE9867"} |
| Chan-      | {"Protocol":"NEC","Bits":32,"Data":"0x00FE18E7"} |
| Play/Pause | {"Protocol":"NEC","Bits":32,"Data":"0x00FE52AD"} |
| Stop       | {"Protocol":"NEC","Bits":32,"Data":"0x00FED22D"} |
| Rwd        | {"Protocol":"NEC","Bits":32,"Data":"0x00FEE21D"} |
| FFd        | {"Protocol":"NEC","Bits":32,"Data":"0x00FE629D"} |
| Back       | {"Protocol":"NEC","Bits":32,"Data":"0x00FEA25D"} |
| Skip       | {"Protocol":"NEC","Bits":32,"Data":"0x00FE22DD"} |
| 1          | {"Protocol":"NEC","Bits":32,"Data":"0x00FE807F"} |
| 2          | {"Protocol":"NEC","Bits":32,"Data":"0x00FE40BF"} |
| 3          | {"Protocol":"NEC","Bits":32,"Data":"0x00FEC03F"} |
| 4          | {"Protocol":"NEC","Bits":32,"Data":"0x00FE20DF"} |
| 5          | {"Protocol":"NEC","Bits":32,"Data":"0x00FEA05F"} |
| 6          | {"Protocol":"NEC","Bits":32,"Data":"0x00FE609F"} |
| 7          | {"Protocol":"NEC","Bits":32,"Data":"0x00FEE01F"} |
| 8          | {"Protocol":"NEC","Bits":32,"Data":"0x00FE10EF"} |
| 9          | {"Protocol":"NEC","Bits":32,"Data":"0x00FE906F"} |
| 0          | {"Protocol":"NEC","Bits":32,"Data":"0x00FE00FF"} |
| Menu       | {"Protocol":"NEC","Bits":32,"Data":"0x00FE8877"} |
| Up         | {"Protocol":"NEC","Bits":32,"Data":"0x00FE30CF"} |
| Down       | {"Protocol":"NEC","Bits":32,"Data":"0x00FEB04F"} |
| Left       | {"Protocol":"NEC","Bits":32,"Data":"0x00FEF00F"} |
| Right      | {"Protocol":"NEC","Bits":32,"Data":"0x00FE708F"} |
| OK         | {"Protocol":"NEC","Bits":32,"Data":"0x00FE08F7"} |
| Exit       | {"Protocol":"NEC","Bits":32,"Data":"0x00FEC837"} |

## Set-top Boxes

### VU+ Duo2

**Example received Code:**

`tele/sonoffIRBridge_1/RESULT = {"IrReceived":{"Protocol":"RC6","Bits":36,"Data":"0x8052900C"}`

**Example IRsend Command:**

`IRsend {"Protocol":"RC6","Bits":36,"Data":0x8052900C}`

| button     | code        |
| ---------- | ----------- |
| ON/OFF     | 0xC8052900C |
| Mute       | 0xC8052100D |
| Vol+       | 0xC80529010 |
| Vol-       | 0xC80521011 |
| P+         | 0xC80529020 |
| P+         | 0xC80529021 |
| Left       | 0xC8052105A |
| Right      | 0xC8052905B |
| Up         | 0xC80529058 |
| Down       | 0xC80529059 |
| OK         | 0xC8052905C |
| Men        | 0xC80529054 |
| Red        | 0xC8052906D |
| Yellow     | 0xC8052906F |
| Green      | 0xC8052906E |
| Blue       | 0xC80529070 |
| Play/Pause | 0xC8052902D |
| Stop       | 0xC80529031 |
| Forward    | 0xC80529028 |
| Back       | 0xC80529029 |
| Key 1      | 0xC80529001 |
| Key 2      | 0xC80529002 |
| Key 3      | 0xC80529003 |
| Key 4      | 0xC80529004 |
| Key 5      | 0xC80529005 |
| Key 6      | 0xC80529006 |
| Key 7      | 0xC80529007 |
| Key 8      | 0xC80529008 |
| Key 9      | 0xC80529009 |
| Key 0      | 0xC80529000 |
| Key &lt;   | 0xC805290BB |
| Key >      | 0xC805290BC |
| Record     | 0xC80529037 |
| EPG        | 0xC805290CC |
| Exit       | 0xC80529055 |
| Audio      | 0xC805290E5 |
| Radio      | 0xC805290F2 |
| TV         | 0xC805290E4 |
| Context    | 0xC80521049 |
| Help       | 0xC80529081 |

### AppleTV Gen4

| button     | code                                                    |
| ---------- | ------------------------------------------------------- |
| Up         | {"Protocol":"NEC","Bits":32,"Data":"0x77E15080"}        |
| Down       | {"Protocol":"NEC","Bits":32,"Data":"0x77E13080"}        |
| Left       | {"Protocol":"NEC","Bits":32,"Data":"0x77E19080"}        |
| Right      | {"Protocol":"NEC","Bits":32,"Data":"0x77E16080"}        |
| Ok         | {"Protocol":"NEC","Bits":32,"Data":"0x77E13A80"}        |
| Menu       | {"Protocol":"NEC","Bits":32,"Data":"0x77E1C080"}        |
| Play/Pause | {"Protocol":"NEC","Bits":32,"Data":"0x77E1FA80"}        |
| Home       | {"Protocol":"NEC","Bits":0,"Data":"0xFFFFFFFFFFFFFFFF"} |

### Humax HMS-1000T DVB-T2 DVR PAL 4-Tune

| button   | code                                             |
| -------- | ------------------------------------------------ |
| Power    | {"Protocol":"NEC","Bits":32,"Data":"0x000800FF"} |
| TV Apps  | {"Protocol":"NEC","Bits":32,"Data":"0x0008D22D"} |
| Text     | {"Protocol":"NEC","Bits":32,"Data":"0x00087689"} |
| Wide     | {"Protocol":"NEC","Bits":32,"Data":"0x0008728D"} |
| Play     | {"Protocol":"NEC","Bits":32,"Data":"0x000816E9"} |
| Pause    | {"Protocol":"NEC","Bits":32,"Data":"0x000846B9"} |
| Rew      | {"Protocol":"NEC","Bits":32,"Data":"0x0008A659"} |
| Fwd      | {"Protocol":"NEC","Bits":32,"Data":"0x000826D9"} |
| Stop     | {"Protocol":"NEC","Bits":32,"Data":"0x0008C639"} |
| Record   | {"Protocol":"NEC","Bits":32,"Data":"0x00088679"} |
| Search   | {"Protocol":"NEC","Bits":32,"Data":"0x0008E21D"} |
| Plus     | {"Protocol":"NEC","Bits":32,"Data":"0x000842BD"} |
| Exit     | {"Protocol":"NEC","Bits":32,"Data":"0x00086897"} |
| Back     | {"Protocol":"NEC","Bits":32,"Data":"0x0008827D"} |
| Up       | {"Protocol":"NEC","Bits":32,"Data":"0x00088877"} |
| Down     | {"Protocol":"NEC","Bits":32,"Data":"0x0008A857"} |
| Left     | {"Protocol":"NEC","Bits":32,"Data":"0x000848B7"} |
| Right    | {"Protocol":"NEC","Bits":32,"Data":"0x000828D7"} |
| Enter    | {"Protocol":"NEC","Bits":32,"Data":"0x0008C837"} |
| Vol +    | {"Protocol":"NEC","Bits":32,"Data":"0x0008F807"} |
| Vol -    | {"Protocol":"NEC","Bits":32,"Data":"0x000802FD"} |
| Mute     | {"Protocol":"NEC","Bits":32,"Data":"0x000818E7"} |
| Home     | {"Protocol":"NEC","Bits":32,"Data":"0x0008708F"} |
| Guide    | {"Protocol":"NEC","Bits":32,"Data":"0x0008D827"} |
| Ch +     | {"Protocol":"NEC","Bits":32,"Data":"0x000808F7"} |
| Ch -     | {"Protocol":"NEC","Bits":32,"Data":"0x0008F00F"} |
| Red      | {"Protocol":"NEC","Bits":32,"Data":"0x000838C7"} |
| Green    | {"Protocol":"NEC","Bits":32,"Data":"0x0008B847"} |
| Yellow   | {"Protocol":"NEC","Bits":32,"Data":"0x000858A7"} |
| Blue     | {"Protocol":"NEC","Bits":32,"Data":"0x00087887"} |
| 1        | {"Protocol":"NEC","Bits":32,"Data":"0x0008C03F"} |
| 2        | {"Protocol":"NEC","Bits":32,"Data":"0x000820DF"} |
| 3        | {"Protocol":"NEC","Bits":32,"Data":"0x0008A05F"} |
| 4        | {"Protocol":"NEC","Bits":32,"Data":"0x0008609F"} |
| 5        | {"Protocol":"NEC","Bits":32,"Data":"0x0008E01F"} |
| 6        | {"Protocol":"NEC","Bits":32,"Data":"0x000810EF"} |
| 7        | {"Protocol":"NEC","Bits":32,"Data":"0x0008906F"} |
| 8        | {"Protocol":"NEC","Bits":32,"Data":"0x000850AF"} |
| 9        | {"Protocol":"NEC","Bits":32,"Data":"0x0008D02F"} |
| 0        | {"Protocol":"NEC","Bits":32,"Data":"0x000830CF"} |
| TV/Radio | {"Protocol":"NEC","Bits":32,"Data":"0x0008B04F"} |

### FetchTV Mini (Hybroad H626T)

| button          | code                                             |
| --------------- | ------------------------------------------------ |
| Power Toggle    | {"Protocol":"NEC","Bits":32,"Data":"0x2662BA45"} |
| Keyboard Select | {"Protocol":"NEC","Bits":32,"Data":"0x26624CB3"} |
| Ch +            | {"Protocol":"NEC","Bits":32,"Data":"0x26627B84"} |
| Ch -            | {"Protocol":"NEC","Bits":32,"Data":"0x2662DB24"} |
| TV Guide        | {"Protocol":"NEC","Bits":32,"Data":"0x266207F8"} |
| Red             | {"Protocol":"NEC","Bits":32,"Data":"0x2662738C"} |
| Green           | {"Protocol":"NEC","Bits":32,"Data":"0x2662936C"} |
| Yellow          | {"Protocol":"NEC","Bits":32,"Data":"0x2662E31C"} |
| Blue            | {"Protocol":"NEC","Bits":32,"Data":"0x266213EC"} |
| Info            | {"Protocol":"NEC","Bits":32,"Data":"0x26628B74"} |
| Search          | {"Protocol":"NEC","Bits":32,"Data":"0x26622CD3"} |
| Apps            | {"Protocol":"NEC","Bits":32,"Data":"0x2662CC33"} |
| Menu            | {"Protocol":"NEC","Bits":32,"Data":"0x26629B64"} |
| Up              | {"Protocol":"NEC","Bits":32,"Data":"0x26629B64"} |
| Down            | {"Protocol":"NEC","Bits":32,"Data":"0x266223DC"} |
| Left            | {"Protocol":"NEC","Bits":32,"Data":"0x2662837C"} |
| Right           | {"Protocol":"NEC","Bits":32,"Data":"0x2662C33C"} |
| Enter           | {"Protocol":"NEC","Bits":32,"Data":"0x26621CE3"} |
| Back            | {"Protocol":"NEC","Bits":32,"Data":"0x2662AB54"} |
| Exit            | {"Protocol":"NEC","Bits":32,"Data":"0x266227D8"} |
| Rew             | {"Protocol":"NEC","Bits":32,"Data":"0x2662BB44"} |
| Play/Pause      | {"Protocol":"NEC","Bits":32,"Data":"0x26625BA4"} |
| Fwd             | {"Protocol":"NEC","Bits":32,"Data":"0x26625BA4"} |
| Stop            | {"Protocol":"NEC","Bits":32,"Data":"0x2662B34C"} |
| Record          | {"Protocol":"NEC","Bits":32,"Data":"0x26624BB4"} |
| 1               | {"Protocol":"NEC","Bits":32,"Data":"0x266240BF"} |
| 2               | {"Protocol":"NEC","Bits":32,"Data":"0x2662C03F"} |
| 3               | {"Protocol":"NEC","Bits":32,"Data":"0x266220DF"} |
| 4               | {"Protocol":"NEC","Bits":32,"Data":"0x2662A05F"} |
| 5               | {"Protocol":"NEC","Bits":32,"Data":"0x2662609F"} |
| 6               | {"Protocol":"NEC","Bits":32,"Data":"0x2662E01F"} |
| 7               | {"Protocol":"NEC","Bits":32,"Data":"0x266210EF"} |
| 8               | {"Protocol":"NEC","Bits":32,"Data":"0x2662906F"} |
| 9               | {"Protocol":"NEC","Bits":32,"Data":"0x266250AF"} |
| 0               | {"Protocol":"NEC","Bits":32,"Data":"0x2662D02F"} |

### Smart Reveiver VX/CX

| button       | code                                                                               |
| ------------ | ---------------------------------------------------------------------------------- |
| on/off       | {"Protocol":"NEC","Bits":32,"Data":"0x00FF30CF","DataLSB":"0x00FF0CF3","Repeat":0} |
| mute         | {"Protocol":"NEC","Bits":32,"Data":"0x00FFB04F","DataLSB":"0x00FF0DF2","Repeat":0} |
| FORMAT       | {"Protocol":"NEC","Bits":32,"Data":"0x00FF1CE3","DataLSB":"0x00FF38C7","Repeat":0} |
| 16:9         | {"Protocol":"NEC","Bits":32,"Data":"0x00FFC13E","DataLSB":"0x00FF837C","Repeat":0} |
| AUDIO        | {"Protocol":"NEC","Bits":32,"Data":"0x00FFFA05","DataLSB":"0x00FF5FA0","Repeat":0} |
| 1            | {"Protocol":"NEC","Bits":32,"Data":"0x00FF807F","DataLSB":"0x00FF01FE","Repeat":0} |
| 2            | {"Protocol":"NEC","Bits":32,"Data":"0x00FF40BF","DataLSB":"0x00FF02FD","Repeat":0} |
| 3            | {"Protocol":"NEC","Bits":32,"Data":"0x00FFC03F","DataLSB":"0x00FF03FC","Repeat":0} |
| 4            | {"Protocol":"NEC","Bits":32,"Data":"0x00FF20DF","DataLSB":"0x00FF04FB","Repeat":0} |
| 5            | {"Protocol":"NEC","Bits":32,"Data":"0x00FFA05F","DataLSB":"0x00FF05FA","Repeat":0} |
| 6            | {"Protocol":"NEC","Bits":32,"Data":"0x00FF609F","DataLSB":"0x00FF06F9","Repeat":0} |
| 7            | {"Protocol":"NEC","Bits":32,"Data":"0x00FFE01F","DataLSB":"0x00FF07F8","Repeat":0} |
| 8            | {"Protocol":"NEC","Bits":32,"Data":"0x00FF10EF","DataLSB":"0x00FF08F7","Repeat":0} |
| 9            | {"Protocol":"NEC","Bits":32,"Data":"0x00FF906F","DataLSB":"0x00FF09F6","Repeat":0} |
| TV/R         | {"Protocol":"NEC","Bits":32,"Data":"0x00FFA25D","DataLSB":"0x00FF45BA","Repeat":0} |
| 0            | {"Protocol":"NEC","Bits":32,"Data":"0x00FF00FF","DataLSB":"0x00FF00FF","Repeat":0} |
| RECALL       | {"Protocol":"NEC","Bits":32,"Data":"0x00FF19E6","DataLSB":"0x00FF9867","Repeat":0} |
| volume +     | {"Protocol":"NEC","Bits":32,"Data":"0x00FF5AA5","DataLSB":"0x00FF5AA5","Repeat":0} |
| volume -     | {"Protocol":"NEC","Bits":32,"Data":"0x00FFDA25","DataLSB":"0x00FF5BA4","Repeat":0} |
| P -          | {"Protocol":"NEC","Bits":32,"Data":"0x00FFBA45","DataLSB":"0x00FF5DA2","Repeat":0} |
| P +          | {"Protocol":"NEC","Bits":32,"Data":"0x00FF3AC5","DataLSB":"0x00FF5CA3","Repeat":0} |
| red          | {"Protocol":"NEC","Bits":32,"Data":"0x00FFEC13","DataLSB":"0x00FF37C8","Repeat":0} |
| green        | {"Protocol":"NEC","Bits":32,"Data":"0x00FF6C93","DataLSB":"0x00FF36C9","Repeat":0} |
| yellow       | {"Protocol":"NEC","Bits":32,"Data":"0x00FF4CB3","DataLSB":"0x00FF32CD","Repeat":0} |
| blue         | {"Protocol":"NEC","Bits":32,"Data":"0x00FF2CD3","DataLSB":"0x00FF34CB","Repeat":0} |
| MENU         | {"Protocol":"NEC","Bits":32,"Data":"0x00FF4AB5","DataLSB":"0x00FF52AD","Repeat":0} |
| BACK         | {"Protocol":"NEC","Bits":32,"Data":"0x00FF44BB","DataLSB":"0x00FF22DD","Repeat":0} |
| EXIT         | {"Protocol":"NEC","Bits":32,"Data":"0x00FFB44B","DataLSB":"0x00FF2DD2","Repeat":0} |
| up           | {"Protocol":"NEC","Bits":32,"Data":"0x00FF04FB","DataLSB":"0x00FF20DF","Repeat":0} |
| left         | {"Protocol":"NEC","Bits":32,"Data":"0x00FF8877","DataLSB":"0x00FF11EE","Repeat":0} |
| OK           | {"Protocol":"NEC","Bits":32,"Data":"0x00FFEA15","DataLSB":"0x00FF57A8","Repeat":0} |
| right        | {"Protocol":"NEC","Bits":32,"Data":"0x00FF08F7","DataLSB":"0x00FF10EF","Repeat":0} |
| down         | {"Protocol":"NEC","Bits":32,"Data":"0x00FF847B","DataLSB":"0x00FF21DE","Repeat":0} |
| INFO         | {"Protocol":"NEC","Bits":32,"Data":"0x00FF34CB","DataLSB":"0x00FF2CD3","Repeat":0} |
| FAV          | {"Protocol":"NEC","Bits":32,"Data":"0x00FF8679","DataLSB":"0x00FF619E","Repeat":0} |
| TXT          | {"Protocol":"NEC","Bits":32,"Data":"0x00FF7A85","DataLSB":"0x00FF5EA1","Repeat":0} |
| EPG          | {"Protocol":"NEC","Bits":32,"Data":"0x00FF06F9","DataLSB":"0x00FF609F","Repeat":0} |
| FR           | {"Protocol":"NEC","Bits":32,"Data":"0x00FF8976","DataLSB":"0x00FF916E","Repeat":0} |
| REC          | {"Protocol":"NEC","Bits":32,"Data":"0x00FF619E","DataLSB":"0x00FF8679","Repeat":0} |
| FF           | {"Protocol":"NEC","Bits":32,"Data":"0x00FF29D6","DataLSB":"0x00FF946B","Repeat":0} |
| PREV         | {"Protocol":"NEC","Bits":32,"Data":"0x00FF09F6","DataLSB":"0x00FF906F","Repeat":0} |
| Play/Pause   | {"Protocol":"NEC","Bits":32,"Data":"0x00FFE916","DataLSB":"0x00FF9768","Repeat":0} |
| NEXT         | {"Protocol":"NEC","Bits":32,"Data":"0x00FFC936","DataLSB":"0x00FF936C","Repeat":0} |
| (none left)  | {"Protocol":"NEC","Bits":32,"Data":"0x00FF4BB4","DataLSB":"0x00FFD22D","Repeat":0} |
| STOP         | {"Protocol":"NEC","Bits":32,"Data":"0x00FF718E","DataLSB":"0x00FF8E71","Repeat":0} |
| (none right) | {"Protocol":"NEC","Bits":32,"Data":"0x00FF8976","DataLSB":"0x00FF916E","Repeat":0} |
| USB          | {"Protocol":"NEC","Bits":32,"Data":"0x00FFFB04","DataLSB":"0x00FFDF20","Repeat":0} |
| HELP         | {"Protocol":"NEC","Bits":32,"Data":"0x00FF54AB","DataLSB":"0x00FF2AD5","Repeat":0} |
| DVD          | {"Protocol":"NEC","Bits":32,"Data":"0x00FFDB24","DataLSB":"0x00FFDB24","Repeat":0} |

## BD/DVD players

## Panasonic DP-UB424EGK/ Remote n2qayb001185

| button         | code                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------|
| TOGGLE ON/OFF  | {"Protocol":"PANASONIC","Bits":48,"Data":"0x40040D00BCB1","DataLSB":"0x220B0003D8D","Repeat":0} |
| OPEN/CLOSE     | {"Protocol":"PANASONIC","Bits":48,"Data":"0x40040D00808D","DataLSB":"0x220B00001B1","Repeat":0} |
| SEARCH BACK    | {"Protocol":"PANASONIC","Bits":48,"Data":"0x40040D00202D","DataLSB":"0x220B00004B4","Repeat":0} |
| SEARCH FORWARD | {"Protocol":"PANASONIC","Bits":48,"Data":"0x40040D00A0AD","DataLSB":"0x220B00005B5","Repeat":0} |
| SKIP BACK      | {"Protocol":"PANASONIC","Bits":48,"Data":"0x40040D00929F","DataLSB":"0x220B00049F9","Repeat":0} |
| SKIP FORWARD   | {"Protocol":"PANASONIC","Bits":48,"Data":"0x40040D00525F","DataLSB":"0x220B0004AFA","Repeat":0} |
| PLAY           | {"Protocol":"PANASONIC","Bits":48,"Data":"0x40040D00505D","DataLSB":"0x220B0000ABA","Repeat":0} |
| PAUSE          | {"Protocol":"PANASONIC","Bits":48,"Data":"0x40040D00606D","DataLSB":"0x220B00006B6","Repeat":0} |
| STOP           | {"Protocol":"PANASONIC","Bits":48,"Data":"0x40040D00000D","DataLSB":"0x220B00000B0","Repeat":0} |
| TOP MENU       | {"Protocol":"PANASONIC","Bits":48,"Data":"0x40040D00D9D4","DataLSB":"0x220B0009B2B","Repeat":0} |
| POPUP MENU     | {"Protocol":"PANASONIC","Bits":48,"Data":"0x40040D800A87","DataLSB":"0x220B00150E1","Repeat":0} |
| HOME           | {"Protocol":"PANASONIC","Bits":48,"Data":"0x40040D00EAE7","DataLSB":"0x220B00057E7","Repeat":0} |

There are more buttons on the control, which I don't use, therefore not listed


### Sony BD-S1500

Common buttons should work across multiple models

| button      | code                                           |
| ----------- | ---------------------------------------------- |
| Eject       | {"Protocol":"SONY","Bits":20,"Data":"0x68B47"} |
| Power       | {"Protocol":"SONY","Bits":20,"Data":"0xA8B47"} |
| Red         | {"Protocol":"SONY","Bits":20,"Data":"0xE6B47"} |
| Green       | {"Protocol":"SONY","Bits":20,"Data":"0x16B47"} |
| Yellow      | {"Protocol":"SONY","Bits":20,"Data":"0x96B47"} |
| Bue         | {"Protocol":"SONY","Bits":20,"Data":"0x66B47"} |
| Top Menu    | {"Protocol":"SONY","Bits":20,"Data":"0x34B47"} |
| Popup/Menu  | {"Protocol":"SONY","Bits":20,"Data":"0x94B47"} |
| Return      | {"Protocol":"SONY","Bits":20,"Data":"0xC2B47"} |
| Options     | {"Protocol":"SONY","Bits":20,"Data":"0xFCB47"} |
| Home        | {"Protocol":"SONY","Bits":20,"Data":"0x42B47"} |
| Up          | {"Protocol":"SONY","Bits":20,"Data":"0x9CB47"} |
| Down        | {"Protocol":"SONY","Bits":20,"Data":"0x5CB47"} |
| Left        | {"Protocol":"SONY","Bits":20,"Data":"0xDCB47"} |
| Right       | {"Protocol":"SONY","Bits":20,"Data":"0x3CB47"} |
| Enter       | {"Protocol":"SONY","Bits":20,"Data":"0xBCB47"} |
| Favourites  | {"Protocol":"SONY","Bits":20,"Data":"0xBCB47"} |
| Netflix     | {"Protocol":"SONY","Bits":20,"Data":"0xD2B47"} |
| Play        | {"Protocol":"SONY","Bits":20,"Data":"0x58B47"} |
| Pause       | {"Protocol":"SONY","Bits":20,"Data":"0x98B47"} |
| Rew         | {"Protocol":"SONY","Bits":20,"Data":"0xD8B47"} |
| Fwd         | {"Protocol":"SONY","Bits":20,"Data":"0x38B47"} |
| Prev        | {"Protocol":"SONY","Bits":20,"Data":"0xEAB47"} |
| Next        | {"Protocol":"SONY","Bits":20,"Data":"0x6AB47"} |
| Stop        | {"Protocol":"SONY","Bits":20,"Data":"0x18B47"} |
| Subtitles   | {"Protocol":"SONY","Bits":20,"Data":"0xC6B47"} |
| Audio Track | {"Protocol":"SONY","Bits":20,"Data":"0x26B47"} |
| Vol +       | {"Protocol":"SONY","Bits":12,"Data":"0x490"}   |
| Vol -       | {"Protocol":"SONY","Bits":12,"Data":"0xC90"}   |
| Mute        | {"Protocol":"SONY","Bits":12,"Data":"0x290"}   |

## Projectors

### Acer K132

IR Remote Codes for Acer K132 projector and possibly other models using a remote with model number M1820.

| button | code                                             |
| ------ | ------------------------------------------------ |
| ON/OFF | {"Protocol":"NEC","Bits":32,"Data":"0x10C8E11E"} |
| Freeze | {"Protocol":"NEC","Bits":32,"Data":"0x10C8718E"} |
| Hide   | {"Protocol":"NEC","Bits":32,"Data":"0x10C8F10E"} |
| Ratio  | {"Protocol":"NEC","Bits":32,"Data":"0x10C806F9"} |
| Zoom   | {"Protocol":"NEC","Bits":32,"Data":"0x10C8D12E"} |
| Mode   | {"Protocol":"NEC","Bits":32,"Data":"0x10C801FE"} |
| Source | {"Protocol":"NEC","Bits":32,"Data":"0x10C831CE"} |
| Back   | {"Protocol":"NEC","Bits":32,"Data":"0x10C832CD"} |
| Up     | {"Protocol":"NEC","Bits":32,"Data":"0x10C841BE"} |
| Down   | {"Protocol":"NEC","Bits":32,"Data":"0x10C8A15E"} |
| Left   | {"Protocol":"NEC","Bits":32,"Data":"0x10C8C13E"} |
| Right  | {"Protocol":"NEC","Bits":32,"Data":"0x10C8817E"} |
| Enter  | {"Protocol":"NEC","Bits":32,"Data":"0x10C8B24D"} |
| Menu   | {"Protocol":"NEC","Bits":32,"Data":"0x10C821DE"} |
| Vol+   | {"Protocol":"NEC","Bits":32,"Data":"0x10C8C639"} |
| Vol-   | {"Protocol":"NEC","Bits":32,"Data":"0x10C826D9"} |
| Sound  | {"Protocol":"NEC","Bits":32,"Data":"0x10C8AD52"} |
| Mute   | {"Protocol":"NEC","Bits":32,"Data":"0x10C88679"} |

### Sanyo PLV-Z4

Selected IR Remote Codes for the Sanyo PLV-Z4 with Sanyo CXTS remote.

In the absence of a separate "Power On" and "Power Off" IR command, you will probably want to disable the "Power Off Confirmation" in the projector settings menu to simplify automation.

| button | code                                                                               |
| ------ | ---------------------------------------------------------------------------------- |
| ON/OFF | {"Protocol":"NEC","Bits":32,"Data":"0xCC0000FF","DataLSB":"0x330000FF","Repeat":0} |
| Video  | {"Protocol":"NEC","Bits":32,"Data":"0xCC00BC43","DataLSB":"0x33003DC2","Repeat":0} |
| SVideo | {"Protocol":"NEC","Bits":32,"Data":"0xCC007C83","DataLSB":"0x33003EC1","Repeat":0} |
| C1     | {"Protocol":"NEC","Bits":32,"Data":"0xCC00C13E","DataLSB":"0x3300837C","Repeat":0} | 
| C2     | {"Protocol":"NEC","Bits":32,"Data":"0xCC00817E","DataLSB":"0x3300817E","Repeat":0} |
| HDMI   | {"Protocol":"NEC","Bits":32,"Data":"0xCC00EC13","DataLSB":"0x330037C8","Repeat":0} |
| PC     | {"Protocol":"NEC","Bits":32,"Data":"0xCC001CE3","DataLSB":"0x330038C7","Repeat":0} |


## Soundbars

### Panasonic SCALL70T Soundbar

**Example received Code:**

`tele/sonoffIRBridge_1/RESULT = {"IrReceived":{"Protocol":"PANASONIC","Bits":48,"Data":"0x40040500BCB9"}}`

**Example IRsend Command:**

`IRsend {"Protocol":"PANASONIC","Bits":48,"Data":0x40040500BCB9}`

| button    | code           |
| --------- | -------------- |
| ON/OFF    | 0x40040500BCB9 |
| Mute      | 0x400405004C49 |
| Vol+      | 0x400405000401 |
| Vol-      | 0x400405008481 |
| OK        | 0x40040538DFE2 |
| Up        | 0x400405383F02 |
| Down      | 0x40040538BF82 |
| Setup     | 0x40040538AD90 |
| Sound     | 0x400405280D20 |
| Bluetooth | 0x400405380538 |
| Input     | 0x400405006164 |

### Soundcore Infini Pro

**Example received Code:**

`tele/sonoffIRBridge_1/RESULT = {"IrReceived":{"Protocol":"NEC","Bits":32,"Data":"0xFD256897"}}`

**Example IRsend Command:**

`{"Protocol":"NEC","Bits":32,"Data":"0xFD256897"}`

| button     | code       |
| ---------- | ---------- |
| ON/OFF     | 0xFD2502FD |
| Mute       | 0xFD2518E7 |
| Input      | 0xFD2508F7 |
| Bluetooth  | 0xFD259867 |
| TV         | 0xFD2548B7 |
| Vol+       | 0xFD256897 |
| Vol-       | 0xFD2558A7 |
| Previous   | 0xFD258A75 |
| Next       | 0xFD250AF5 |
| Play/Pause | 0xFD25C837 |
| Movie      | 0xFD2554AB |
| Music      | 0xFD255CA3 |
| Voice      | 0xFD2552AD |
| Bass-      | 0xFD2532CD |
| Bass+      | 0xFD258877 |
| Surround   | 0xFD2538C7 |

### IR Codes Goodmans GDSBT1000P

**Example received Code:**

`RESULT = {"IrReceived":{"Protocol":"NEC","Bits":32,"Data":"0x4FBD02F","DataLSB":"0x20DF0BF4","Repeat":0}}`

**Example IRsend Command:**

`{"Protocol":"NEC","Bits":32,"Data":"0x4FB30CF"}`

| button            | code       |
| ----------------- | ---------- |
| ON/OFF            | 0x4FB30CF  |
| Mute              | 0x20DF08F7 |
| Mode Bluetooth    | 0x20DF0FF0 |
| Mode Optical      | 0x20DF0AF5 |
| Mode Coaxial      | 0x20DF16E9 |
| Mode Line in      | 0x20DF07F8 |
| Mode AUX          | 0x20DF09F6 |
| Bluetooth Pairing | 0x20DF06F9 |
| Music             | 0x20DF10EF |
| Movie             | 0x20DF0BF4 |
| Voice             | 0x20DF14EB |
| Treble +          | 0x20DF00FF |
| Treble -          | 0x20DF03FC |
| Bass +            | 0x20DF01FE |
| Bass -            | 0x20DF04FB |
| Volume +          | 0x20DF02FD |
| Volume -          | 0x20DF05FA |
| Previous          | 0x20DF11EE |
| Play/Pause        | 0x20DF12ED |
| Next              | 0x20DF13EC |

## Hi-Fi Amplifiers & Receivers

### JBL On Air 2.4G Control

| button       | code                                             |
| ------------ | ------------------------------------------------ |
| Change Input | {"Protocol":"NEC","Bits":32,"Data":"0x538522DD"} |
| Volume Up    | {"Protocol":"NEC","Bits":32,"Data":"0x538521DE"} |
| Volume Down  | {"Protocol":"NEC","Bits":32,"Data":"0x538520DF"} |
| Mute         | {"Protocol":"NEC","Bits":32,"Data":"0x538523DC"} |

### NAD D-3020 v1

| button       | code                                             |
| ------------ | ------------------------------------------------ |
| Power On     | {"Protocol":"NEC","Bits":32,"Data":"0xE13EA45B"} |
| Power Off    | {"Protocol":"NEC","Bits":32,"Data":"0xE13E13EC"} |
| Source Up    | {"Protocol":"NEC","Bits":32,"Data":"0xE13E58A7"} |
| Source Down  | {"Protocol":"NEC","Bits":32,"Data":"0xE13EB847"} |
| Volume Up    | {"Protocol":"NEC","Bits":32,"Data":"0xE13E11EE"} |
| Volume Down  | {"Protocol":"NEC","Bits":32,"Data":"0xE13E31CE"} |
| Mute         | {"Protocol":"NEC","Bits":32,"Data":"0xE13EBB44"} |
| Skip Back    | {"Protocol":"NEC","Bits":32,"Data":"0xE13E8B74"} |
| Skip Forward | {"Protocol":"NEC","Bits":32,"Data":"0xE13E4BB4"} |
| Optical 1    | {"Protocol":"NEC","Bits":32,"Data":"0xE13E916E"} |
| Optical 2    | {"Protocol":"NEC","Bits":32,"Data":"0xE13EB14E"} |
| Coax         | {"Protocol":"NEC","Bits":32,"Data":"0xE13EA15E"} |
| Computer     | {"Protocol":"NEC","Bits":32,"Data":"0xE13E8976"} |
| Aux 1        | {"Protocol":"NEC","Bits":32,"Data":"0xE13ED926"} |
| Aux 2        | {"Protocol":"NEC","Bits":32,"Data":"0xE13E03FC"} |
| Bluetooth    | {"Protocol":"NEC","Bits":32,"Data":"0xE13E43BC"} |

### Yamaha RX-V1900

Selected codes for the Yamaha RX-V1900 AV Reciever with RAV385 Remote. Only codes relevant to remote operation included.

| button       | code                                                                               |
| ------------ | ---------------------------------------------------------------------------------- |
| Power On     | {"Protocol":"NEC","Bits":32,"Data":"0x7E817E81","DataLSB":"0x7E817E81","Repeat":0} |
| Power Off    | {"Protocol":"NEC","Bits":32,"Data":"0x7E81FE01","DataLSB":"0x7E817F80","Repeat":0} |
| Multi        | {"Protocol":"NEC","Bits":32,"Data":"0x5EA1E11E","DataLSB":"0x7A858778","Repeat":0} |
| V-Aux        | {"Protocol":"NEC","Bits":32,"Data":"0x5EA1AA55","DataLSB":"0x7A8555AA","Repeat":0} |
| Phono        | {"Protocol":"NEC","Bits":32,"Data":"0x5EA128D7","DataLSB":"0x7A8514EB","Repeat":0} |
| Dock         | {"Protocol":"NEC","Bits":32,"Data":"0xFE8052AD","DataLSB":"0x7F014AB5","Repeat":0} |
| BD HD DVD    | {"Protocol":"NEC","Bits":32,"Data":"0x5EA113EC","DataLSB":"0x7A85C837","Repeat":0} |
| DVD          | {"Protocol":"NEC","Bits":32,"Data":"0x5EA1837C","DataLSB":"0x7A85C13E","Repeat":0} |
| CD           | {"Protocol":"NEC","Bits":32,"Data":"0x5EA1A857","DataLSB":"0x7A8515EA","Repeat":0} |
| MD CD-R      | {"Protocol":"NEC","Bits":32,"Data":"0x5EA19867","DataLSB":"0x6AE5F81F","Repeat":0} |
| CBL SAT      | {"Protocol":"NEC","Bits":32,"Data":"0x5EA103FC","DataLSB":"0x7A85C03F","Repeat":0} |
| TV           | {"Protocol":"NEC","Bits":32,"Data":"0x5EA12AD5","DataLSB":"0x7A8554AB","Repeat":0} |
| DVR          | {"Protocol":"NEC","Bits":32,"Data":"0x5EA1C837","DataLSB":"0x7A8513EC","Repeat":0} |
| VCR          | {"Protocol":"NEC","Bits":32,"Data":"0x5EA1F00F","DataLSB":"0x7A850FF0","Repeat":0} |
| Tuner        | {"Protocol":"NEC","Bits":32,"Data":"0x5EA16897","DataLSB":"0x7A8516E9","Repeat":0} |
| USB          | {"Protocol":"NEC","Bits":32,"Data":"0xFE80FC03","DataLSB":"0x7F013FC0","Repeat":0} |
| Sur Decode   | {"Protocol":"NEC","Bits":32,"Data":"0x5EA1B14E","DataLSB":"0x7A858D72","Repeat":0} |
| Stereo       | {"Protocol":"NEC","Bits":32,"Data":"0x5EA131CE","DataLSB":"0x7A858D72","Repeat":0} |
| Enhancer     | {"Protocol":"NEC","Bits":32,"Data":"0x5EA129D6","DataLSB":"0x7A85946B","Repeat":0} |

## Vacuum Cleaners

### Ecovacs Deebot Slim2 Vacuum Cleaner

**Example received Code:**

`tele/sonoffIRBridge_1/RESULT = {"IrReceived":{"Protocol":"NEC","Bits":32,"Data":"0x00FFD02F"}}`

**Example IRsend Command:**

`IRsend {"Protocol":"NEC","Bits":32,"Data":0x00FFD02F}`

| button                | code       |
| --------------------- | ---------- |
| Automatic Mode/Pause  | 0x00FFD02F |
| Edge Cleaning         | 0x00FF609F |
| Spot Cleaning         | 0x00FF40BF |
| Back to Charging Base | 0x00FF708F |
| Forward               | 0x00FFC837 |
| Left                  | 0x00FFE01F |
| Right                 | 0x00FFF00F |
| Back/Turn around      | 0x00FFC03F |

## Ventilation

### Prana 150 energy recovery ventilation

See device <https://prana.org.ua/models/prana_150> (Ukrainian)

**Example received Code:**

`MQT: tele/sonoffir/RESULT = {"IrReceived":{"Protocol":"NEC","Bits":32,"Data":"0x00FF00FF"}}`

**Example IRsend Command:**

`IRsend {"Protocol":"NEC","Bits":32,"Data":"0x00FF00FF"}`

| button                | code                                             |
| --------------------- | ------------------------------------------------ |
| Power                 | {"Protocol":"NEC","Bits":32,"Data":"0x00FF00FF"} |
| Screen/LED Brightness | {"Protocol":"NEC","Bits":32,"Data":"0x00FF807F"} |
| Heat OFF              | {"Protocol":"NEC","Bits":32,"Data":"0x00FF30CF"} |
| Heat ON               | {"Protocol":"NEC","Bits":32,"Data":"0x00FF906F"} |
| Fan                   | {"Protocol":"NEC","Bits":32,"Data":"0x00FF50AF"} |
| Anti freeze           | {"Protocol":"NEC","Bits":32,"Data":"0x00FFA857"} |
| Night Mode            | {"Protocol":"NEC","Bits":32,"Data":"0x00FFB04F"} |
| Fan -                 | {"Protocol":"NEC","Bits":32,"Data":"0x00FF708F"} |
| Fan +                 | {"Protocol":"NEC","Bits":32,"Data":"0x00FF28D7"} |
| Night Mode Fan -      | {"Protocol":"NEC","Bits":32,"Data":"0x00FF609F"} |
| Night Mode Fan +      | {"Protocol":"NEC","Bits":32,"Data":"0x00FF10EF"} |

![image](https://user-images.githubusercontent.com/563412/61618791-4aa5a980-ac76-11e9-850a-3bf920a3b32b.png)

## Christmas candle - Weihnachtsbeleuchtung

### Krinner Lumix IR Remote

Remote control has two buttons and three channels.

Button 1 is to switch on

Button 0 is to switch off

Double click on button 1 is flicker mode

No usable protocol found yet, but raw mode does it.

**Example for HttpGetRequest and irsend**

`sendHttpGetRequest("http://192.168.1.234/cm?cmnd=irsend5%200,2000,1000,%20400,1000,%20400,%20400,1000,1000,%20400,1000,%20400,%20400,1000,%20400,1000,%20400,1000,%20400,2000,5600")`

-   off channel A
    `irsend 0,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400, 400,1000, 400,1000, 400,1000, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400, 400,1000, 400,1000, 400,1000, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400, 400,1000, 400,1000, 400,1000, 400,2000,5600`
-   on channel A
    `irsend 0,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400, 400,2000,5600`
-   flicker channel A
    `irsend 0,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400, 400,1000, 400,1100,1000, 400, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400, 400,1000, 400,1100,1000, 400, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400, 400,1000, 400,1100,1000, 400, 400,2000,5600`

-   off channel B
    `irsend 0,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400,1000, 400, 400,1000, 400,1000, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400,1000, 400, 400,1000, 400,1000, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400,1000, 400, 400,1000, 400,1000, 400,2000,5600`
-   on channel B
    `irsend 0,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400,1000, 400,1000, 400,1000, 400, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400,1000, 400,1000, 400,1000, 400, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400,1000, 400,1000, 400,1000, 400, 400,2000,5600`
-   flicker channel B
    `irsend 0,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400,1000, 400, 400,1100,1000, 400, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400,1000, 400, 400,1100,1000, 400, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400,1000, 400,1000, 400, 400,1100,1000, 400, 400,2000,5600`

-   off channel C
    `irsend 0,2000,1000, 400,1000, 400, 400,1000,1000, 400, 400,1000,1000, 400, 400,1000, 400,1000, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400, 400,1000,1000, 400, 400,1000, 400,1000, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400, 400,1000,1000, 400, 400,1000, 400,1000, 400,2000,5600`
-   on channel C
    `irsend 0,2000,1000, 400,1000, 400, 400,1000,1000, 400, 400,1000,1000, 400,1000, 400,1000, 400, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400, 400,1000,1000, 400,1000, 400,1000, 400, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400, 400,1000,1000, 400,1000, 400,1000, 400, 400,2000,5600`
-   flicker channel C
    `irsend 0,2000,1000, 400,1000, 400, 400,1000,1000, 400, 400,1000,1000, 400, 400,1100,1000, 400, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400, 400,1000,1000, 400, 400,1100,1000, 400, 400,2000,5600,2000,1000, 400,1000, 400, 400,1000,1000, 400, 400,1000,1000, 400, 400,1100,1000, 400, 400,2000,5600`

### Vinkor Flameless Flickering Candles (and clones probably)

| button | code                                                        |
| ------ | ----------------------------------------------------------- |
| on     | {"Protocol":"NEC","Bits":32,"Data":"0x10ED00FF","Repeat":0} |
| off    | {"Protocol":"NEC","Bits":32,"Data":"0x10ED40BF","Repeat":0} |
| dim    | {"Protocol":"NEC","Bits":32,"Data":"0x10ED08F7","Repeat":0} |
| bright | {"Protocol":"NEC","Bits":32,"Data":"0x10ED48B7","Repeat":0} |
| candle | {"Protocol":"NEC","Bits":32,"Data":"0x10ED30CF","Repeat":0} |
| light  | {"Protocol":"NEC","Bits":32,"Data":"0x10ED708F","Repeat":0} |
| 2H     | {"Protocol":"NEC","Bits":32,"Data":"0x10ED20DF","Repeat":0} |
| 4H     | {"Protocol":"NEC","Bits":32,"Data":"0x10ED609F","Repeat":0} |
| 6H     | {"Protocol":"NEC","Bits":32,"Data":"0x10ED10EF","Repeat":0} |
| 8H     | {"Protocol":"NEC","Bits":32,"Data":"0x10ED50AF","Repeat":0} |

## LED Candles / LED Kerzen

### Duni Warm White LED Candle / Duni Warmweiß LED Kerzen

| button         | code                                             |
| -------------- | ------------------------------------------------ |
| ON             | {"Protocol":"NEC","Bits":32,"Data":"0x00FF00FF"} |
| OFF            | {"Protocol":"NEC","Bits":32,"Data":"0x00FF807F"} |
| 4h             | {"Protocol":"NEC","Bits":32,"Data":"0x00FF40BF"} |
| 8h             | {"Protocol":"NEC","Bits":32,"Data":"0x00FFC03F"} |
| ModeCandle     | {"Protocol":"NEC","Bits":32,"Data":"0x00FF20DF"} |
| ModeLight      | {"Protocol":"NEC","Bits":32,"Data":"0x00FFA05F"} |
| ModeDark       | {"Protocol":"NEC","Bits":32,"Data":"0x00FF906F"} |
| ModeBright     | {"Protocol":"NEC","Bits":32,"Data":"0x00FFE01F"} |
| ModeMoon       | {"Protocol":"NEC","Bits":32,"Data":"0x00FF10EF"} |
| ModeNightLight | {"Protocol":"NEC","Bits":32,"Data":"0x00FF609F"} |

### Duni Multicoloured LED Candle / Duni Mehrfarbige LED Kerzen

| button               | code                                                                    |
| -------------------- | ----------------------------------------------------------------------- |
| ON_COL               | {"Protocol":"NEC","Bits":32,"Data":"0x807F48B7","DataLSB":"0x01FE12ED"} |
| OFF_COL              | {"Protocol":"NEC","Bits":32,"Data":"0x807F807F","DataLSB":"0x01FE01FE"} |
| ModeSmooth_COL       | {"Protocol":"NEC","Bits":32,"Data":"0x807F58A7","DataLSB":"0x01FE1AE5"} |
| ModeNightLight_COL   | {"Protocol":"NEC","Bits":32,"Data":"0x807F7887","DataLSB":"0x01FE1EE1"} |
| ModeCandle_COL       | {"Protocol":"NEC","Bits":32,"Data":"0x807F40BF","DataLSB":"0x01FE02FD"} |
| ModeLight_COL        | {"Protocol":"NEC","Bits":32,"Data":"0x807FC03F","DataLSB":"0x01FE03FC"} |
| ModeTimer_COL        | {"Protocol":"NEC","Bits":32,"Data":"0x807F20DF","DataLSB":"0x01FE04FB"} |
| ModeDark_COL         | {"Protocol":"NEC","Bits":32,"Data":"0x807FA05F","DataLSB":"0x01FE05FA"} |
| ModeBright_COL       | {"Protocol":"NEC","Bits":32,"Data":"0x807F609F","DataLSB":"0x01FE06F9"} |
| ColorRed_COL         | {"Protocol":"NEC","Bits":32,"Data":"0x807FE01F","DataLSB":"0x01FE07F8"} |
| ColorGreen_COL       | {"Protocol":"NEC","Bits":32,"Data":"0x807F10EF","DataLSB":"0x01FE08F7"} |
| ColorBlue_COL        | {"Protocol":"NEC","Bits":32,"Data":"0x807F906F","DataLSB":"0x01FE09F6"} |
| ColorOrange_COL      | {"Protocol":"NEC","Bits":32,"Data":"0x807F50AF","DataLSB":"0x01FE0AF5"} |
| ColorLightGreen_COL  | {"Protocol":"NEC","Bits":32,"Data":"0x807FD827","DataLSB":"0x01FE1BE4"} |
| ColorLightBlue_COL   | {"Protocol":"NEC","Bits":32,"Data":"0x807FF807","DataLSB":"0x01FE1FE0"} |
| ColorViolet_COL      | {"Protocol":"NEC","Bits":32,"Data":"0x807F30CF","DataLSB":"0x01FE0CF3"} |
| ColorYellow_COL      | {"Protocol":"NEC","Bits":32,"Data":"0x807FB04F","DataLSB":"0x01FE0DF2"} |
| ColorBlueWhite_COL   | {"Protocol":"NEC","Bits":32,"Data":"0x807F708F","DataLSB":"0x01FE0EF1"} |
| ColorPink_COL        | {"Protocol":"NEC","Bits":32,"Data":"0x807F00FF","DataLSB":"0x01FE00FF"} |
| ColorYellowWhite_COL | {"Protocol":"NEC","Bits":32,"Data":"0x807FF00F","DataLSB":"0x01FE0FF0"} |
| ColorWhite_COL       | {"Protocol":"NEC","Bits":32,"Data":"0x807F9867","DataLSB":"0x01FE19E6"} |

### Fishtec Bougie / Generic Multicolored Led Candle / Generische mehrfarbige LED Kerzen

| button           | code                                            |
| ---------------- | ----------------------------------------------- |
| ON               | {"Protocol":"NEC","Bits":32,"Data":"0x1FE48B7"} |
| OFF              | {"Protocol":"NEC","Bits":32,"Data":"0x1FE58A7"} |
| ColorBlue        | {"Protocol":"NEC","Bits":32,"Data":"0x1FE609F"} |
| ColorRed         | {"Protocol":"NEC","Bits":32,"Data":"0x1FE20DF"} |
| ColorGreen       | {"Protocol":"NEC","Bits":32,"Data":"0x1FEA05F"} |
| ColorWhite       | {"Protocol":"NEC","Bits":32,"Data":"0x1FE30CF"} |
| ColorTurkis      | {"Protocol":"NEC","Bits":32,"Data":"0x1FE10EF"} |
| ColorOrange      | {"Protocol":"NEC","Bits":32,"Data":"0x1FE50AF"} |
| ColorPink        | {"Protocol":"NEC","Bits":32,"Data":"0x1FE708F"} |
| ColorPurple      | {"Protocol":"NEC","Bits":32,"Data":"0x1FEF807"} |
| ColorLightPurple | {"Protocol":"NEC","Bits":32,"Data":"0x1FE906F"} |
| ColorLightBlue   | {"Protocol":"NEC","Bits":32,"Data":"0x1FED827"} |
| ColorOceanBlue   | {"Protocol":"NEC","Bits":32,"Data":"0x1FEB04F"} |
| ModeMultiColor   | {"Protocol":"NEC","Bits":32,"Data":"0x1FEC03F"} |
| ModeSwitch       | {"Protocol":"NEC","Bits":32,"Data":"0x1FE7887"} |

### Edifier R1850DB IR remote

| button   | code                                                                              |
| -------- | --------------------------------------------------------------------------------- |
| MUTE     | {"Protocol":"NEC","Bits":32,"Data":"0x8E7827D","DataLSB":"0x10E741BE","Repeat":0} |
| +        | {"Protocol":"NEC","Bits":32,"Data":"0x8E7609F","DataLSB":"0x10E706F9","Repeat":0} |
| -        | {"Protocol":"NEC","Bits":32,"Data":"0x8E7E21D","DataLSB":"0x10E747B8","Repeat":0} |
| ON/OFF   | {"Protocol":"NEC","Bits":32,"Data":"0x8E7629D","DataLSB":"0x10E746B9","Repeat":0} |
| PC       | {"Protocol":"NEC","Bits":32,"Data":"0x8E7E01F","DataLSB":"0x10E707F8","Repeat":0} |
| AUX      | {"Protocol":"NEC","Bits":32,"Data":"0x8E7906F","DataLSB":"0x10E709F6","Repeat":0} |
| OPT      | {"Protocol":"NEC","Bits":32,"Data":"0x8E7A25D","DataLSB":"0x10E745BA","Repeat":0} |
| COX      | {"Protocol":"NEC","Bits":32,"Data":"0x8E7C03F","DataLSB":"0x10E703FC","Repeat":0} |
| BT       | {"Protocol":"NEC","Bits":32,"Data":"0x8E73AC5","DataLSB":"0x10E75CA3","Repeat":0} |
| \<\<     | {"Protocol":"NEC","Bits":32,"Data":"0x8E77887","DataLSB":"0x10E71EE1","Repeat":0} |
| \>\|\|   | {"Protocol":"NEC","Bits":32,"Data":"0x8E77A85","DataLSB":"0x10E75EA1","Repeat":0} |
| \>\>     | {"Protocol":"NEC","Bits":32,"Data":"0x8E740BF","DataLSB":"0x10E702FD","Repeat":0} |
