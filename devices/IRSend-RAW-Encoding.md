There are two command syntax forms for sending a remote control code in RAW format with [`IRsend`](Commands#irsend):

1. `IRSend<x> <frequency>,<rawdata1>,<rawdata2>,..,<rawdataN>`

   e.g., `IRsend 0,926,844,958,832,1798,868,902,848,900,870,900,852,908,918,958,794,934,874,928,1738,934,856,1764`

2. `IRSend<x> raw,<frequency>[,<header_mark>,<header_space>,<bit_mark>],<zero_space>[, [<one_multiple>] | <one_space>],<bit_stream>`

   Where

| Parameter | Description |
|---|---|
| `<frequency>`    | carrier frequency (default 0 = 38kHz)
| `<header_mark>`** | header mark duration (µs) (optional for some protocols)
| `<header_space>`** | header space duration (µs) (optional for some protocols)
| `<bit_mark>` | bit mark duration (µs) (optional for some protocols)
| `<zero_space>` | zero space duration (µs)
| `<one_multiple>` | used to specify the one space duration if the one space duration is an integral multiple of the zero space duration. This parameter may be omitted if the multiple is 2.<BR><BR>_Use of this parameter is mutually exclusive with the `<one_space>` parameter_ 
| `<one_space>` | one space duration (µs). Use this parameter if the one space duration is not an integral multiple of `<zero_space>`<BR><BR>_Use of this parameter is mutually exclusive with the `<one_multiple>` parameter_ 
| `<bit_stream>` | bit stream data (stream of ones and zeroes)

  ** If `header_mark` and `header_space` are specified, the gap will be computed as `(header_mark + header_space) * 3` with a high limit of 65ms (65,000µs) to avoid 16 bits overflow.  If `header_mark` and `header_space` are not specified, the gap will be 40ms (40,000µs).

   This command syntax version makes use of the output of the raw IR decoder from [ToniA/Raw-IR-decoder-for-Arduino](https://github.com/ToniA/Raw-IR-decoder-for-Arduino)

## Examples for bitstream command syntax

### _rawirdecode_ output:

    Number of symbols: 75
    Symbols:
    Hh010101101000111011001110000000001100110000000001100000000000000010001100
    Bytes:
    00:  0101|0110 | 6A | 01101010
    01:  1000|1110 | 71 | 01110001
    02:  1100|1110 | 73 | 01110011
    03:  0000|0000 | 00 | 00000000
    04:  1100|1100 | 33 | 00110011
    05:  0000|0001 | 80 | 10000000
    06:  1000|0000 | 01 | 00000001
    07:  0000|0000 | 00 | 00000000
    08:  1000|1100 | 31 | 00110001
    6A,71,73,00,33,80,01,00,31
    Timings (in us):
    PAUSE SPACE:  0
    HEADER MARK:  8620
    HEADER SPACE: 4260
    BIT MARK:     544
    ZERO SPACE:   411
    ONE SPACE:    1496
    Decoding known protocols...
    Unknown protocol
    Bytecount: 9

Corresponding command:

    IRSend<x> raw,0,8620,4260,544,411,1496,010101101000111011001110000000001100110000000001100000000000000010001100

### Gree air conditioner Power On

```
{8956, 4560, 546, 1710, 588, 616, 584, 618, 584, 1712, 586, 1712, 588, 614, 586, 614, 586, 618, 586, 1706, 590, 616 , 586, 1708, 590, 616, 588, 610, 590, 612, 590, 612, 590, 618, 584, 618, 584, 616, 586, 614, 588, 612, 590, 612, 590, 1712, 586 , 616, 588, 612, 590, 614, 588, 614, 586, 618, 586, 616, 586, 1710, 588, 614, 586, 1708, 590, 610, 592, 612, 590, 1708, 588, 614 , 588, 20084, 548, 612, 590, 614, 588, 614, 588, 616, 586, 654, 546, 616, 586, 616, 586, 614, 588, 612, 588, 610, 592, 612, 590 , 612, 590, 614, 586, 1712, 586, 616, 586, 612, 588, 614, 588, 614, 586, 616, 586, 612, 590, 614, 588, 610, 590, 616, 586, 614 , 588, 612, 590, 612, 590, 614, 588, 614, 588, 614, 588, 1708, 590, 612, 590, 1708, 590}
```

Arrange the data into pairs:

| MARK | SPACE | BIT |
|------|-------|-----|
| 8956 | 4560  | (header)
| 546  | 1710  | 1
| 588  | 616   | 0
| 584  | 618   | 0
| 584  | 1712  | 1
| 586  | 1712  | 1
| 588  | 614   | 0
| 586  | 614   | 0
|    ... |
| 590  | 612   | 0
| 590  | 614   | 0
| 588  | 614   | 0
| 588  | 614   | 0
| 588  | 1708  | 1
| 590  | 612   | 0
| 590  | 1708  | 1
| 590  |       | (ignore)

The header is always the first pair, the zeroes have the shortest space duration and the ones have the longest space duration.

* header mark is 8956
* header space is 4560
* bit mark, get the average, say 590
* zero space, say 615
* one space, say 1710

Corresponding command:

    IRSend<x> raw,0,8956,4560,590,615,1710,1001100 ... 0000101

# Understanding IR encoding

Below are several topics that may help you decoding and understanding what your IR remotes are sending (ex: HVAC) or convert from popular IR formats like PRONTO or Broadlink.

First, have a look at the excellent article from Elektor [IR Remote Control Codes](https://www.handsontec.com/pdf_files/IR_Code_Analy.pdf)

## Decoding IR codes by hand

> From discussion with `@johan1111` on Discord.

Let's suppose you have an unsupported HVAL and record the following raw IR codes using Tasmota:

`[3094,3062,3092,4442,576,1652,578,528,576,1650,580,528,576,528,576,1650,...]`

IR messages typically start with a long Mark (IR on), followed by a long Space (IR off). Here we see a double sequence of Mark (3094 µs) - Space (3062 µs) - Mark (3092 µs) - Space (4442 µs).

The actual bitstream is `576,1652,578,528,576,1650,580,528,576,528,576,1650,...`.

You need to take timing by pairs, again the first value is Mark (IR on), the second Space (IR off). The Mark is typically of constant time, and the space will vary from short (~528 µs) for bit `0` to long (~1650 µs) for bit `1`.

So the first bits of the bitstream are: `101001...`

## Pioneer IR enconding

Pioneer IR encoding is very similar to NEC encoding for the bitstream. When capturing IR codes, they will easily be recognized as NEC codes. But they have subtle differences.

First, the Frequency if 40KHz for Pioneer vs 38KHz for NEC. The number of IR pulses are the same, so all Pioneer timings are 5% shorter than Nec equivalent. Most Pioneer will tolerate the difference, but some won't. If you have a Pioneer device, prefer the `Pioneer` encoding.

Second, Pioneer introduced 64 bits messages vs 32 bits for NEC. Most simple Pioneer commands still use 32 bits, but newer require 64 bits. 64 bits messages are actually sent as 2x 32 bits messages with a very short pause in between.

Example, Pioneer Vol+ is 32 bits message and must be sent twice. You can either send the same message `0xA55A50AF` twice with `IRSend2` or send a 64 bits message with twice the same 32 payload: `0xA55A50AFA55A50AF`.

`IRSend2 {"Protocol":"PIONEER","Bits":32,"Data":"0xA55A50AF"}`

or

`IRSend {"Protocol":"PIONEER","Bits":64,"Data":"0xA55A50AFA55A50AF"}`

Example 2: Pioneer Stereo:

`IRSend {"Protocol":"PIONEER","Bits":64,"Data":"0xA55AF906A55A03FC"}`

### How to convert Pioneer codes to Tasmota

Pioneer kindly publishes all [IR Codes](https://www.pioneerelectronics.com/PUSA/Support/Home-Entertainment-Custom-Install/IR+Codes) online on its website.

Let's take a Pioneer Receiver like VSX-820. Choose the right Excel file and navigate in the corresponding tab.

Pioneer codes are in short format. For example "TV / SAT" code is `A59B+A5CD`. You now need to convert these short codes into 64 bits IRRemote8266 codes.

Steps:
1. Take the first byte: `0xA5` or `0b10100101`. Pioneer codes are LSB, but we need MSB. So read backwards all bits to 0b10100101 and back to hex `A5`. Your first byte is `A5`. Note: You can see here that `0xA5` is a palindrome.
2. Invert all bits of previous byte: `0b01011010`. Your second byte is `5A`.
3. Take the second byte `0x9B` or `0b10011011`. Read backwards all bits giving 0b11011001. Your third byte is `D9`.
4. Invert all bits from previous byte: `0b00100110`. Your fourth byte is `26`.

Do the same with the second sequence `A5CD`, you should find the following sequence: `A55AB3CD`.

The final sequence is:

`IRSend {"Protocol":"PIONEER","Bits":64,"Data":"0xA55AD926A55AB3CD"}`

## Converting Pronto IR codes to Tasmota

`Pronto` is a very common and early format to describe raw IR codes. It is fully described in this excellent series of articles [The Pronto's IR Code Format](http://www.remotecentral.com/features/irdisp1.htm)

Pronto is commonly represented as a series of 4-digits HEX numbers in unsigned 16-bits format.

Example, from Foxtel Vol+:

`Vol +`<br>
`0000 0073 0000 0012 000F 000A 0006 000A 0006 0016 0006 000A 0006 0010 0006 0016 0006 0016 0006 000A 0006 000A 0006 000A 0006 0016 0006 0010 0006 0016 0006 000A 0006 0010 0006 000A 0006 000A 0006 0CA0`

To convert from Pronto to IRSend by hand it requires extra work.

1. Ignore first `0000`
2. `0073` is the IR frequency, compute as "Frequency = 1000000/(N * .241246)". So for 0x73 (115), this gives 36KHz. First value for IRSend is `36`.
3. `0000` is the length of the One Time Burst. There is no one time burst
4. `0012` - Decimal 18 is the length of the repeat burst. There are 18 bits (Burst pairs) in this code.
Next pulses are measured in pulses of the IR clock, so it depends on the frequency. With 36KHz, each pulse is (1000/36) 27.7 microseconds
So you need to multiply by 27.7 for Tasmota to get actual µs
`000F 000A` - becomes `415,277`
`0006 000A` - becomes `166,277`
And so on...

In the end, it will look like:

`IRSend  36,415,277,166,277,...`

## Converting Broadlink IR codes to Tasmota

Broadlink is another popular device to send and receive IR/RF codes. Unfortunately, it does not run ESP8266, so it cannot be Tasmotized.

Broadlink codes come either in Base64 format or in Hex format. Below will use Hex format which is easier to work by hand.

Example:

`"Code":`<br>
`"2600700000015692171117111612171116121612161117111735173517361636161117351735173517111636161216121611171116121612163616111735173517351735173517351700053D0001554916000C4E0001554916000C4E0001564817000C4D0001564917000C4C0001564917000D050000000000000000",`<br>
`"Base64":`<br>
`"JgBwAAABVpIXERcRFhIXERYSFhIWERcRFzUXNRc2FjYWERc1FzUXNRcRFjYWEhYSFhEXERYSFhIWNhYRFzUXNRc1FzUXNRc1FwAFPQABVUkWAAxOAAFVSRYADE4AAVZIFwAMTQABVkkXAAxMAAFWSRcADQUAAAAAAAAAAA==
`

The Broadling protocol is described here: [Broadlink RM2 network protocol](https://github.com/mjg59/python-broadlink/blob/master/protocol.md)

Here is a copy of the part specifically describing

|Offset|Contents|
|------|--------|
|0x00|0x26 = IR, 0xb2 for RF 433Mhz, 0xd7 for RF 315Mhz|
|0x01|repeat count, (0 = no repeat, 1 send twice, .....)|
|0x02-0x03|Length of the following data in little endian|
|0x04 ....|Pulse lengths in 2^-15 s units (µs * 269 / 8192 works very well)|
|....|0x0d 0x05 at the end for IR only|

Each value is represented by one byte. If the length exceeds one byte then it is stored big endian with a leading 0.

Example: The header for an Optoma projector is 8920 4450<br>
8920 * 269 / 8192 = 0x124<br>
4450 * 269 / 8192 = 0x92<br>
... which would be encoded as `0x00 0x1 0x24 0x92` in broalink format.

You have all the needed information to convert from Broadlink to Tasmota...
