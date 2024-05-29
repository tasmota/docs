# Telegram

??? failure "This feature is not included in precompiled binaries"  

    When [compiling your build](Compile-your-build) add the following to `user_config_override.h`:
    ```c++
    #ifndef USE_TELEGRAM 
    #define USE_TELEGRAM                 // Support for Telegram protocol (+49k code, +7.0k mem and +4.8k additional during connection handshake)
    #endif

    #ifndef USE_TELEGRAM_FINGERPRINT
    #define USE_TELEGRAM_FINGERPRINT "\x4E\x7F\xF5\x6D\x1E\x29\x40\x58\xAB\x84\xDE\x63\x69\x7B\xCD\xDF\x44\x2E\xD2\xF6" // Telegram api.telegram.org TLS public key fingerpring
    #endif
    ```

With this feature you can control your device from Telegram using Tasmota commands. You can also send messages from Tasmota to Telegram.

You'll need to configure a Telegram Bot using it's BotFather. This will provide the `API token` needed to communicate between Telegram and your device.

## Commands

* `TmFingerprint 1`: use default fingerprint 4E 7F F5 6D 1E 29 40 58 AB 84 DE 63 69 7B CD DF 44 2E D2 F6 as defined by USE_TELEGRAM_FINGERPRINT
* `TmFingerprint <fp>`: set fingerprint
* `TmToken <API token>`: add your BotFather created bot API token (default none)
* `TmChatId <chat_id>`: add your BotFather created bot chat id (default none)
* `TmPoll <seconds>`: Telegram receive poll time (default 10 seconds)
* `TmState 0`: disable telegram sending (default)
* `TmState 1`: enable telegram sending (needs valid TmChatId)
* `TmState 2`: disable telegram listener (default)
* `TmState 3`: enable telegram listener
* `TmState 4`: disable telegram response echo (default)
* `TmState 5`: enable telegram response echo
* `TmState 6`: enable telegram auto fingerprint fix (default)
* `TmState 7`: disable telegram auto fingerprint fix but present new fingerprint to user
* `TmSend <data>`: if telegram sending is enabled AND a chat id is present then send data

## Usage

Once you have the Telegram bot configured and Telegram compiled in your binary it's time to try it out.

### Receive data in your Telegram App

Perform the following commands in your Tasmota console:

```
TmToken <your API token as received from the BotFather>
TmState 3
```

Now go over to your Telegram APP and type `Status`. Within ten seconds, depending on the ``TmPoll`` value, you'll receive a response in your App and in the Tasmota console.

### Send a message from Tasmota 

Before you can send a message to Telegram you'll need a `chat_id`. This can be found in the received response from the command above. To see it enable logging level 4 (``seriallog 4`` or ``weblog 4``) and perform the same command `Status` in your Telegram APP. You should receive a message like:

```
18:17:36.117-016 TGM: Response '{"ok":true,"result":[{"update_id":14354552,
"message":{"message_id":379,"from":{"id":101234293,"is_bot":false,"first_name":"Theo","last_name":"Arends","username":"user","language_code":"nl"},"chat":{"id":101234293,"first_name":"Theo","last_name":"Arends","username":"user","type":"private"},"date":1716913055,"text":"Status"}}]}'
```

Notice the provided `"chat":{"id":101234293`.

Perform the following commands in your Tasmota console:

```
TmChatId 101234293
TmState 1
TmSend Greetings from Tasmota
```

In the Telegram APP the message "Greetings from Tasmota" should be shown.

### To continue

The ``TmState``, ``TmToken`` and ``TmChatId`` commands need to be performed only once. They will be remembered after a restart.

### Background information

Communication between Tasmota and Telegram is using HTTPS. It needs a so called `Fingerprint` for this to work. The initial fingerprint is provided by you as `#define USE_TELEGRAM_FINGERPRINT`. Over time Telegram might change this fingerprint. The default Tasmota configuration will try to adopt the new Telegram fingerprint and continue to work without your interaction. 

If for any reason this `auto-fingerprint` doesn't work you can disable it with command ``TmState 7`` and enter the correct fingerprint using command ``TmFingerprint 4E 7F F5 6D 1E 29 40 58 AB 84 DE 63 69 7B CD DF 44 2E D2 F6``.

## Resources

[Telegram BotFather tutorial](https://core.telegram.org/bots/tutorial)
