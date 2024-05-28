# Telegram

??? failure "This feature is not included in precompiled binaries"  

    When [compiling your build](Compile-your-build) add the following to `user_config_override.h`:
    ```c++
    #ifndef USE_TELEGRAM 
    #define USE_TELEGRAM                 // Support for Telegram protocol (+49k code, +7.0k mem and +4.8k additional during connection handshake)
    #endif

    #ifndef
    #define USE_TELEGRAM_FINGERPRINT "\x4E\x7F\xF5\x6D\x1E\x29\x40\x58\xAB\x84\xDE\x63\x69\x7B\xCD\xDF\x44\x2E\xD2\xF6" // Telegram api.telegram.org TLS public key fingerpring
    #endif
    ```

With this feature you can control your device from Telegram using Tasmota commands. You can also send messages from Tasmota to Telegram.

You'll need to configure a Telegram Bot using it's BotFather. This will provide the `token` needed to communicate between Telegram and your device.

## Commands

* `TmFingerprint 1`: use default fingerprint 4E 7F F5 6D 1E 29 40 58 AB 84 DE 63 69 7B CD DF 44 2E D2 F6 as defined by USE_TELEGRAM_FINGERPRINT
* `TmFingerprint <fp>`: set fingerprint
* `TmToken <token>`: add your BotFather created bot token (default none)
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
