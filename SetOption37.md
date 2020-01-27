SetOption37 is used for re-mapping the RGBW<sub>c</sub>W<sub>w</sub> channels. This transformation happens right before the hardware-specific output, so all the advanced features (schemes, hsb setting, etc.) works with the original, un-mapped values.

The main reason for this option is to provide support for bulbs whose physical wiring is *almost* the usual/standard one, but the channels are arranged in a different way.

For technical reasons this transformation isn't a full N-to-N mapping, it can only the **re-arrange** the channels, which is equivalent to map the (R,G,B,W<sub>c</sub>,W<sub>w</sub>) channels to one of their permutations.

The required permutation can be configured via `SetOption37 n`, where `n` is the **systematic index** of the permutation, a number from the [0 .. 119] interval, from 0=(R,G,B,W<sub>c</sub>,W<sub>w</sub>) to 119=(W<sub>w</sub>,W<sub>c</sub>,B,G,R):

| Idx | Perm.               | Idx | Perm.               | Idx | Perm.               | Idx | Perm.               |
|-----|---------------------|-----|---------------------|-----|---------------------|-----|---------------------|
|   0 | R,G,B,W<sub>c</sub>,W<sub>w</sub> |  1 | R,G,B,W<sub>w</sub>,W<sub>c</sub> |  2 | R,G,W<sub>c</sub>,B,W<sub>w</sub> |  3 | R,G,W<sub>c</sub>,W<sub>w</sub>,B |
|   4 | R,G,W<sub>w</sub>,B,W<sub>c</sub> |  5 | R,G,W<sub>w</sub>,W<sub>c</sub>,B |  6 | R,B,G,W<sub>c</sub>,W<sub>w</sub> |  7 | R,B,G,W<sub>w</sub>,W<sub>c</sub> |
|   8 | R,B,W<sub>c</sub>,G,W<sub>w</sub> |  9 | R,B,W<sub>c</sub>,W<sub>w</sub>,G | 10 | R,B,W<sub>w</sub>,G,W<sub>c</sub> | 11 | R,B,W<sub>w</sub>,W<sub>c</sub>,G |
|  12 | R,W<sub>c</sub>,G,B,W<sub>w</sub> | 13 | R,W<sub>c</sub>,G,W<sub>w</sub>,B | 14 | R,W<sub>c</sub>,B,G,W<sub>w</sub> | 15 | R,W<sub>c</sub>,B,W<sub>w</sub>,G |
|  16 | R,W<sub>c</sub>,W<sub>w</sub>,G,B | 17 | R,W<sub>c</sub>,W<sub>w</sub>,B,G | 18 | R,W<sub>w</sub>,G,B,W<sub>c</sub> | 19 | R,W<sub>w</sub>,G,W<sub>c</sub>,B |
|  20 | R,W<sub>w</sub>,B,G,W<sub>c</sub> | 21 | R,W<sub>w</sub>,B,W<sub>c</sub>,G | 22 | R,W<sub>w</sub>,W<sub>c</sub>,G,B | 23 | R,W<sub>w</sub>,W<sub>c</sub>,B,G |
|  24 | G,R,B,W<sub>c</sub>,W<sub>w</sub> | 25 | G,R,B,W<sub>w</sub>,W<sub>c</sub> | 26 | G,R,W<sub>c</sub>,B,W<sub>w</sub> | 27 | G,R,W<sub>c</sub>,W<sub>w</sub>,B |
|  28 | G,R,W<sub>w</sub>,B,W<sub>c</sub> | 29 | G,R,W<sub>w</sub>,W<sub>c</sub>,B | 30 | G,B,R,W<sub>c</sub>,W<sub>w</sub> | 31 | G,B,R,W<sub>w</sub>,W<sub>c</sub> |
|  32 | G,B,W<sub>c</sub>,R,W<sub>w</sub> | 33 | G,B,W<sub>c</sub>,W<sub>w</sub>,R | 34 | G,B,W<sub>w</sub>,R,W<sub>c</sub> | 35 | G,B,W<sub>w</sub>,W<sub>c</sub>,R |
|  36 | G,W<sub>c</sub>,R,B,W<sub>w</sub> | 37 | G,W<sub>c</sub>,R,W<sub>w</sub>,B | 38 | G,W<sub>c</sub>,B,R,W<sub>w</sub> | 39 | G,W<sub>c</sub>,B,W<sub>w</sub>,R |
|  40 | G,W<sub>c</sub>,W<sub>w</sub>,R,B | 41 | G,W<sub>c</sub>,W<sub>w</sub>,B,R | 42 | G,W<sub>w</sub>,R,B,W<sub>c</sub> | 43 | G,W<sub>w</sub>,R,W<sub>c</sub>,B |
|  44 | G,W<sub>w</sub>,B,R,W<sub>c</sub> | 45 | G,W<sub>w</sub>,B,W<sub>c</sub>,R | 46 | G,W<sub>w</sub>,W<sub>c</sub>,R,B | 47 | G,W<sub>w</sub>,W<sub>c</sub>,B,R |
|  48 | B,R,G,W<sub>c</sub>,W<sub>w</sub> | 49 | B,R,G,W<sub>w</sub>,W<sub>c</sub> | 50 | B,R,W<sub>c</sub>,G,W<sub>w</sub> | 51 | B,R,W<sub>c</sub>,W<sub>w</sub>,G |
|  52 | B,R,W<sub>w</sub>,G,W<sub>c</sub> | 53 | B,R,W<sub>w</sub>,W<sub>c</sub>,G | 54 | B,G,R,W<sub>c</sub>,W<sub>w</sub> | 55 | B,G,R,W<sub>w</sub>,W<sub>c</sub> |
|  56 | B,G,W<sub>c</sub>,R,W<sub>w</sub> | 57 | B,G,W<sub>c</sub>,W<sub>w</sub>,R | 58 | B,G,W<sub>w</sub>,R,W<sub>c</sub> | 59 | B,G,W<sub>w</sub>,W<sub>c</sub>,R |
|  60 | B,W<sub>c</sub>,R,G,W<sub>w</sub> | 61 | B,W<sub>c</sub>,R,W<sub>w</sub>,G | 62 | B,W<sub>c</sub>,G,R,W<sub>w</sub> | 63 | B,W<sub>c</sub>,G,W<sub>w</sub>,R |
|  64 | B,W<sub>c</sub>,W<sub>w</sub>,R,G | 65 | B,W<sub>c</sub>,W<sub>w</sub>,G,R | 66 | B,W<sub>w</sub>,R,G,W<sub>c</sub> | 67 | B,W<sub>w</sub>,R,W<sub>c</sub>,G |
|  68 | B,W<sub>w</sub>,G,R,W<sub>c</sub> | 69 | B,W<sub>w</sub>,G,W<sub>c</sub>,R | 70 | B,W<sub>w</sub>,W<sub>c</sub>,R,G | 71 | B,W<sub>w</sub>,W<sub>c</sub>,G,R |
|  72 | W<sub>c</sub>,R,G,B,W<sub>w</sub> | 73 | W<sub>c</sub>,R,G,W<sub>w</sub>,B | 74 | W<sub>c</sub>,R,B,G,W<sub>w</sub> | 75 | W<sub>c</sub>,R,B,W<sub>w</sub>,G |
|  76 | W<sub>c</sub>,R,W<sub>w</sub>,G,B | 77 | W<sub>c</sub>,R,W<sub>w</sub>,B,G | 78 | W<sub>c</sub>,G,R,B,W<sub>w</sub> | 79 | W<sub>c</sub>,G,R,W<sub>w</sub>,B |
|  80 | W<sub>c</sub>,G,B,R,W<sub>w</sub> | 81 | W<sub>c</sub>,G,B,W<sub>w</sub>,R | 82 | W<sub>c</sub>,G,W<sub>w</sub>,R,B | 83 | W<sub>c</sub>,G,W<sub>w</sub>,B,R |
|  84 | W<sub>c</sub>,B,R,G,W<sub>w</sub> | 85 | W<sub>c</sub>,B,R,W<sub>w</sub>,G | 86 | W<sub>c</sub>,B,G,R,W<sub>w</sub> | 87 | W<sub>c</sub>,B,G,W<sub>w</sub>,R |
|  88 | W<sub>c</sub>,B,W<sub>w</sub>,R,G | 89 | W<sub>c</sub>,B,W<sub>w</sub>,G,R | 90 | W<sub>c</sub>,W<sub>w</sub>,R,G,B | 91 | W<sub>c</sub>,W<sub>w</sub>,R,B,G |
|  92 | W<sub>c</sub>,W<sub>w</sub>,G,R,B | 93 | W<sub>c</sub>,W<sub>w</sub>,G,B,R | 94 | W<sub>c</sub>,W<sub>w</sub>,B,R,G | 95 | W<sub>c</sub>,W<sub>w</sub>,B,G,R |
|  96 | W<sub>w</sub>,R,G,B,W<sub>c</sub> | 97 | W<sub>w</sub>,R,G,W<sub>c</sub>,B | 98 | W<sub>w</sub>,R,B,G,W<sub>c</sub> | 99 | W<sub>w</sub>,R,B,W<sub>c</sub>,G |
| 100 | W<sub>w</sub>,R,W<sub>c</sub>,G,B |101 | W<sub>w</sub>,R,W<sub>c</sub>,B,G |102 | W<sub>w</sub>,G,R,B,W<sub>c</sub> |103 | W<sub>w</sub>,G,R,W<sub>c</sub>,B |
| 104 | W<sub>w</sub>,G,B,R,W<sub>c</sub> |105 | W<sub>w</sub>,G,B,W<sub>c</sub>,R |106 | W<sub>w</sub>,G,W<sub>c</sub>,R,B |107 | W<sub>w</sub>,G,W<sub>c</sub>,B,R |
| 108 | W<sub>w</sub>,B,R,G,W<sub>c</sub> |109 | W<sub>w</sub>,B,R,W<sub>c</sub>,G |110 | W<sub>w</sub>,B,G,R,W<sub>c</sub> |111 | W<sub>w</sub>,B,G,W<sub>c</sub>,R |
| 112 | W<sub>w</sub>,B,W<sub>c</sub>,R,G |113 | W<sub>w</sub>,B,W<sub>c</sub>,G,R |114 | W<sub>w</sub>,W<sub>c</sub>,R,G,B |115 | W<sub>w</sub>,W<sub>c</sub>,R,B,G |
| 116 | W<sub>w</sub>,W<sub>c</sub>,G,R,B |117 | W<sub>w</sub>,W<sub>c</sub>,G,B,R |118 | W<sub>w</sub>,W<sub>c</sub>,B,R,G |119 | W<sub>w</sub>,W<sub>c</sub>,B,G,R |

Source: [this spreadsheet](https://docs.google.com/spreadsheets/d/1ovEWyUBObOYYAl8ey6K6LffHhiniRXuIq7iivyxmyEU)
