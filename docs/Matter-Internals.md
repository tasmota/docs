# Matter Internals

!!! danger "Matter protocol is experimental"

!!! tip "Matter is only supported on ESP32x based devices and requires a specific build with `#define USE_MATTER_DEVICE`"

Below are implementation notes to understand and extend Matter.

## Plugin System

The plugin system is designed to have different implementations for different types of devices or sensors. Each Matter endpoint is managed by an instance of a Plugin class.

Endpoint `root` (0) is managed by the `matter.Plugin_Root` class because of its specific behavior.

We provide currently the following classes:

| Plug-in class      | Description                         |
| ------------------ | ----------------------------------- |
| Plugin_Device      | Generic device (abstract) |
| Plugin_OnOff       | Simple On/Off Plug (type `0x010A`) |
| Plugin_Light0      | Light with 0 channel (OnOff) (type 0x0100)|
| Plugin_Light1      | Light with 1 channels (Dimmer) (type 0x0101)|
| Plugin_Light2      | Light with 2 channels (CT) (type 0x010C)|
| Plugin_Light3      | Light with 3 channels (RGB) (type 0x010D)|
| Plugin_Sensor | Generic Sensor class (abstract) |
| Plugin_Sensor_Temp | Temperature Sensor (type 0x0302) |
| Plugin_Sensor_Pressure | Pressure Sensor (type 0x0305) |
| Plugin_Sensor_Light | Light/Illuminance Sensor (type 0x0106) |
| Plugin_Sensor_Humidity | Humidity Sensor (type 0x0307) |

## Plugin superclass

All plugins inherit from the `Matter_Plugin` superclass.

Note: for solidification to succeed, you need to declare `class Matter_Plugin end` fake class in the same Berry file. The actual class will be used in solidified code.

| Plugin method          | Description                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| init(device, endpoint) | (can be overridden) Instantiate the plugin on a specific `endpoint`. You need to pass the root `matter_device` object |

## Core classes

### matter.Device root / `matter_device`

`matter_device` is a monad of `matter.Device` automatically created at boot. It checks if Matter si enabled (`SetOption151 1`) and instantiates all sub-systems.

#### Device attributes

Device variables|Description
:----|:---
plugins|List of `matter.Plugin()`.<BR>Each plugin manages a distinct endpoint and the associated sub-device behavior
sudp_server|instance of `matter.UDPServer()` and is used to (re-)send and receive UDP packets
message_handler|instance of `matter.MessageHandler()`, handles the dispatching of incoming packets to the relevant layers.
sessions|instance of `matter.Session_Store()` which holds a list of `matter.Session()`<BR>All active persistent and non-persistent sessions are listed here, and serve to dispatch incoming packets<BR>Session are also linked to `Fabric` when persisted
ui|instance of `matter.UI()`<BR>Handles the web UI for Matter.

When commissioning is open, here are the variables used:

Commissioning variables|Description
:----|:---
commissioning_open|timestamp for timeout of commissioning (millis()) or `nil` if closed
commissioning_iterations|current PBKDF number of iterations
commissioning_discriminator|commissioning_discriminator
commissioning_salt|current salt
commissioning_w0|current w0 (SPAKE2+)
commissioning_L|current L (SPAKE2+)
commissioning_instance_wifi|random instance name for commissioning (mDNS)
commissioning_instance_eth|random instance name for commissioning (mDNS)

For default commissioning, the following values are used (and can be changed via UI):

Root Commissioning variables|Description
:----|:---
root_discriminator|as `int`
root_passcode|as `int`
root_iterations|PBKDF number of iterations
&nbsp;|PBKDF information used only during PASE (freed afterwards)
root_salt|
root_w0|
root_L|

#### Device methods

Method|Description
:----|:---
start_root_basic_commissioning(timeout_s)|Start Basic Commissioning with root/UI parameters<BR>Open window for `timeout_s` (default 10 minutes)
remove_fabric(fabric)|Remove a fabric and clean all corresponding values and mDNS entries
start_basic_commissioning(timeout_s, iterations, discriminator, salt, w0, L, admin_fabric)|Start Basic Commissioning Window with custom parameters
is_root_commissioning_open()|Is root commissioning currently open. Mostly for UI to know if QRCode needs to be shown.
stop_basic_commissioning()|Stop PASE commissioning, mostly called when CASE is about to start
compute_qrcode_content()|Compute QR Code content - can be done only for root PASE
compute_manual_pairing_code()|Compute the 11 digits manual pairing code (without vendorid nor productid) p.223<BR>can be done only for root PASE (we need the passcode, but we don't get it with OpenCommissioningWindow command)
every_second()|Dispatch second-resolution ticks to: sessions, message_handler, plugins.<BR>Expire commissioning window.<BR>Called by Tasmota loop.
start_operational_discovery_deferred(session)|Start Operational Discovery for this session<BR>Deferred until next tick.
start_commissioning_complete_deferred(session)|Start Commissioning Complete for this session<BR>Deferred until next tick.
start_operational_discovery(session)|Start Operational Discovery for this session<BR>Stop Basic Commissioning and clean PASE specific values (to save memory). Announce fabric entry in mDNS.
start_commissioning_complete(session)|Commissioning Complete<BR>Stop basic commissioning.
get_active_endpoints(exclude_zero)|Return the list of endpoints from all plugins (distinct), exclude endpoint zero if `exclude_zero` is `true`
save_param()|Persistence of Matter Device parameters
load_param()|Load Matter Device parameters

Incoming messages handing

Method|Description
:----|:---
msg_received(raw, addr, port)|Callback when message is received.<BR>Send to `message_handler`
msg_send(raw, addr, port, id)|Global entry point for sending a message.<BR>Delegates to `udp_server`
received_ack(id)|Signals that a ack was received.<BR>Delegates to `udp_server` to remove from resending list.
attribute_updated(endpoint, cluster, attribute, fabric_specific)|Signal that an attribute has been changed and propagate to any active subscription.<BR>Delegates to `message_handler`
process_attribute_expansion(ctx, cb)|Proceed to attribute expansion (used for Attribute Read/Write/Subscribe)<BR>Called only when expansion is needed, so we don't need to report any error since they are ignored<BR><BR>Calls `cb(pi, ctx, direct)` for each attribute expanded.<BR>`pi`: plugin instance targeted by the attribute (via endpoint). Note: nothing is sent if the attribute is not declared in supported attributes in plugin.<BR>`ctx`: context object with `endpoint`, `cluster`, `attribute` (no `command`)<BR>`direct`: `true` if the attribute is directly targeted, `false` if listed as part of a wildcard<BR>returns: `true` if processed successfully, `false` if error occurred. If `direct`, the error is returned to caller, but if expanded the error is silently ignored and the attribute skipped.<BR>In case of `direct` but the endpoint/cluster/attribute is not supported, it calls `cb(nil, ctx, true)` so you have a chance to encode the exact error (UNSUPPORTED_ENDPOINT / UNSUPPORTED_CLUSTER / UNSUPPORTED_ATTRIBUTE / UNREPORTABLE_ATTRIBUTE)
invoke_request(session, val, ctx)|Matter plugin management<BR>Plugins allow to specify response to read/write attributes and command invokes

#### UDPPacket_sent

Method|Description
:----|:---
init(raw, addr, port, id)|Create raw UDP packet with `bytes()` content, target addr (string) and port (int). If `id` is not `nil` enqueue until acked
send(socket)|Send packet now. Returns `true` if packet was successfully sent.

#### mDNS (DNS-SD)

Method|Description
:----|:---
start_mdns_announce_hostnames()|Start mDNS and announce hostnames for Wi-Fi and ETH from MAC<BR>When the announce is active, `hostname_wifi` and `hostname_eth` are defined
mdns_announce_PASE()|Announce MDNS for PASE commissioning
mdns_remove_PASE()|MDNS remove any PASE announce
mdns_announce_op_discovery_all_fabrics()|Start UDP mDNS announcements for commissioning for all persisted sessions
mdns_announce_op_discovery(fabric)|Start UDP mDNS announcements for commissioning
mdns_remove_op_discovery_all_fabrics()|Remove all mDNS announces for all fabrics
mdns_remove_op_discovery(fabric)|Remove mDNS announce for fabric
save_before_restart()|Try to clean MDNS entries before restart.<BR>Called by Tasmota loop as a Tasmota driver.

#### Class UDPServer

This class creates a monad (singleton) in charge of receiving and sending all UDP packets. Packets to sent are generally put in a queue, and are re-sent with exponential backoff until they are acknowledged by the receiver (as part of Matter over UDP) or after the maximum of retries have been made.

Method|Description
:----|:---
init(addr, port)|Init UDP Server listening to `addr` and `port` (opt). By default, the server listens to `""` (all addresses) and port `5540`
start(cb)|Starts the server. Registers as device handler to Tasmota. <BR>`cb(packet, from_addr, from_port)`: callback to call when a message is received.<BR>Raises an exception if something is wrong. 
stop()|Stops the server and remove driver
every_50ms()|At every tick: Check if a packet has arrived, and dispatch to `cb`. Read at most `MAX_PACKETS_READ (4) packets at each tick to avoid any starvation.<BR>Then resend queued outgoing packets.
\_resend_packets()|Resend packets if they have not been acknowledged by receiver either with direct Ack packet or ack embedded in another packet. Packets with `id`=`nil` are not resent.<BR>Packets are re-sent at most `RETRIES` (4) times, i.e. sent maximum 5 times. Exponential back off is added after each resending.<BR>If all retries expired, remove packet and log.
received_ack()|Just received acknowledgment, remove packet from sender
send_response(raw, addr, port, id, session_id)|Send a packet, enqueue it if `id` is not `nil`.<BR>`session_id` is only used for logging.



### MessageHandler

`matter_device.message_handler` is a monad of `matter.MessageHandler`

Dispatches incoming messages and sends outgoing messages

Variables of Message Handler|Description
:----|:---
device|Reference to the global `matter_device` instance
commissioning|Commissioning Context instance, handling the PASE/CASE phases
im|Instance of `matter.IM` handling Interaction Model

General methods:

Method|Description
:----|:---
init(device)|Constructor, instantiates monads for `commissioning` and `im`
msg_received(raw, addr, port)|Called by `matter_device` when a message is received.<BR>- decodes the message header<BR>- associates the message with the corresponding active session, or create a new session<BR>- dispatches to `commissioning` or `im` depending on the message type<BR>- sends an Ack packet if the received packet had the `reliable` flag set and if the Ack was not already managed upper stack.
send_response(raw, addr, port, id, session_id)|Send a packet. Proxy to the same method in `device`


### TLV

Implements the TLV encoding and decoding as defined in Appendix A of the Matter specification. TLV stands for Tag-length-value encoding. It is a way to encode tagged values and structures in a binary compact format. Most Matter messages are encoded in TLV.

Parse and print:
`m = matter.TLV.parse(b) print(m)`

#### TLV Types

Type|Description
:----|:---
I1 I2 I4|Signed integer of at most (1/2/4) bytes (as 32 bits signed Berry type)
U1 U2 U4|Unsigned integer of at most (1/2/4) bytes (as 32 bits signed Berry type, be careful when comparing. Use `matter.Counter.is_greater(a,b)`)
I8 U8|Signed/unsigned 8 bytes. You can pass `bytes(8)`, `int64()` or `int`. Type is collapsed to a lower type if possible when encoding.
BOOL|Boolean, takes `true` and `false`. Abstracts the internal `BTRUE` and `BFALSE` that you don't need to use
FLOAT|32 bites float
UTF1 UTF2|String as UTF, size is encoded as 1 or 2 bytes automatically
B1 B2|raw `bytes()`, size is encoded as 1 or 2 bytes automatically
NULL|takes only `nil` value
STRUCT<BR>ARRAY<BR>LIST<BR>EOC|(internal) Use through abstractions
DOUBLE<BR>UTF4 UTF8<BR>B4 B8|Unsupported in Tasmota

#### Creating TLV

Simple value:
`matter.TLV.create_TLV(type, value)`

Example:
`matter.TLV.create_TLV(matter.TLV.UTF1, "Hello world")`
`matter.TLV.create_TLV(matter.TLV.BOOL, true)`
`matter.TLV.create_TLV(matter.TLV.NULL, nil)`
`matter.TLV.create_TLV(matter.TLV.FLOAT, 3.5)`
`matter.TLV.create_TLV(matter.TLV.I2, -345)`
`matter.TLV.create_TLV(matter.TLV.U8, bytes("DEADBEEFDEADBEEF"))`

## Subscriptions

When a subscription is issued by an initiator, we create an instance of `matter.IM_Subscription` which holds:

- the `CASE session` on which the subscription was issued. If the session is closed, the subscription dies. Subscriptions are not persisted and stop if reboot
- `subscription_id` (int) used to tell the initiator which subscription it was
- `path_list` list of `matter.Path` instances recording all the attributes subscribed to. They can include wildcards
- `min_interval` and `max_interval` (in seconds): Tasmota waits at least `min_interval` before sending a new value, and sends a message before `max_interval` (usually heartbeats to signal that the subscription is still alive). Generally changes to attributes are dispatched immediately.
- `fabric_filtered`: not used for now

Below are internal arguments:

- `not_before`: the actual timestamp that we should wait before sending updates, as to respect `min_interval`
- `expiration`: the maximum timestamp we can wait before sending a heartbeat. Both are updated after we sent a new value
- `wait_status`: signals that we sent everything and we wait for the final `StatusReport` to resume sending further updates
- `is_keep_alive` (bool) did the last message was a keep-alive, if so we just expect a Ack and no StatusReport
- `updates`: list of concrete attributes that have values changed since last update. They don't contain the new value, we will actually probe each attribute value when sending the update

#### IM_Subscription_Shop

This class (monad) contains the global list of all active subscriptions.
Method|Description
:----|:---
init(im)|Instantiate the monad with the global IM monad
new\_subscription(session, req)|Take a session and a `SubscribeRequestMessage`, parse the message and create a `matter.IM_Subscription` instance.<BR>Returns the `matter.IM_Subscription()` instance. Also allocates a new subscription id.

### What happens when an attribute is updated

Subscriptions are triggered by the value of an attribute changing. They can originate from an explicit WRITE Matter command from an initiator or another device, of be the consequence of a Matter command (like switching a light ON). The can also originated from independent source, like an action at Tasmota level (using Tasmota `Power` command), or Tasmota detecting that a sensor value has changed after periodical polling.

Note: default plugins for Lights actually probe Tasmota light status every second, and report any difference between the last known change (also called shadow value) and the current status. We realized that it was more consistent and reliable than trying to create rules for every event.

When an attribute's value changed, you need to call the plugin's method<BR>`self.attribute_updated(<endpoint_id>, <cluster_id>, <attribute_id> [, <fabric_specific>])`

`<fabric_specific>` (bool) is optional and currently ignored and reserved for future use.

The `endpoint_id` argument is optional. If the endpoint is unknown, the message is broadcast to all endpoints that support reading this attributes:<br>`self.attribute_updated(nil, <cluster_id>, <attribute_id>)`

More generally, you can use the global method to signal an attribute change from any code:<br>`matter_device.attribute_updated(nil, <cluster_id>, <attribute_id>)`

Note: internally this method creates a `matter.Path` instance and calls<BR>`matter_device.message_handler.im.subs_shop.attribute_updated_ctx(ctx, fabric_specific)`<BR>which in turns calls `attribute_updated_ctx(ctx, fabric_specific)` on every active subscription.

Calls to `attribute_updated_ctx()` are first check whether the attribute matches the filtering criteria's (that may include wildcards). If they match, the attribute is candidate to be added to the list. We then call `_add_attribute_unique_path()` to check if the attribute is not already in the list, and if not add it to the list of future updates. It's possible that during the `min_interval` time, an attribute may change value multiple times; yet we publish a single value (the last one).

#### Updates

The`Subscription_Shop`  monad checks every 250ms if there are updates ready to be sent via `every_250ms()`.

It does a first scan across all active subscriptions if updates can be sent out:

- subscription is not in `wait_status` (i.e. not waiting for a previous exchange to complete)
- subscription has a non-empty list of updates
- subscription has reached the `not_before` timestamp (so as to not sent too frequent updates)

If so:

- `im.send_subscribe_update(sub)` is called
- the subscription list of updates is cleared via `sub.clear_before_arm()`

Once all updates are sent, the subscription are scanned again to see if any heartbeat needs to be sent:

- subscription is not in `wait_status`
- subscription has reached `expiration` timestamp
If so:
- `im.send_subscribe_update(sub)` is called
- the subcription list of updates is cleared via `sub.clear_before_arm()` XXX TODO
