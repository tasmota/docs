An inexpensive IR sensor such as a [TSOP1838](https://hobbyking.com/en_us/keyes-tsop1838-infra-red-37-9khz-receiver-for-arduino.html) can be connected to a device running Tasmota. Configure a free device GPIO as 'IRrecv (51)'. When Tasmota receives an IR message, the data portion of the payload has the same format as the [`IRsend`](Commands#irsend) parameter.
    {"IrReceived":{"Protocol":"<value>","Bits":<value>,"Data":<value>}}

This JSON payload data can be used in a rule such as:
    ON IrReceived#Data=<value> DO <command> ENDON

If the data is received on an unknown protocol, `setoption58 1`  See [here](https://github.com/arendst/Tasmota/issues/2116#issuecomment-440716483).
