Beginning with Tasmota version 6.4.1.14, an optional feature for using mathematical expressions in rules was introduced. This feature is disabled by default but can be enabled by compiling from source and adding `#define USE_EXPRESSION` to `user_config_override.h`. Of course, `#define USE_RULES` is also required (enabled by default).

### Supported Commands
Once the feature is enabled, the use of expressions is supported in the following commands:
* Var
* Mem
* RuleTimer
* [If conditional statement](Rules---IF-ELSE-ELSEIF-and-AND-OR-Support) (requires `#define SUPPORT_IF_STATEMENT`)

### Syntax
Expressions can use of the following operators. They are listed by the order of operations priority, from higher to lower.
* `(  )` (parentheses are used to explicitly control the order of operations)
* `^` (power)
* `%` (modulo, division by zero returns modulo "0")
* `*` and `/`  (multiplication and division; division by zero returns "0")
* `+` and `-`  (addition and subtraction)

**Order of Operations Example**  
* `1+2*2`   results in 5.0 as the multiplication is done first due to its higher priority
* `(1+2)*2`   results in 6.0

In addition to numeric constants, the following symbolic values can be used:  

Symbol|Description
-|-
VAR\<x>|variable (\<x> = `1..MAX_RULE_VARS`, e.g., `VAR2`)
MEM\<x>|persistent variable (\<x> = `1..MAX_RULE_MEMS`, e.g., `MEM3`)
TIME|minutes past midnight
UPTIME|uptime minutes
UTCTIME|UTC time, UNIX timestamp, seconds since 01/01/1970
LOCALTIME|local time, UNIX timestamp
SUNRISE|current sunrise time (minutes past midnight)
SUNSET|current sunset time (minutes past midnight)

Example: `Mem1=((0.5*Var1)+10)*0.7`

To use expressions in the `Var`, `Mem` and `RuleTimer` commands, an equal sign (`=`) character has to be used after the command. If not, the traditional syntax interpretation is used.  

Statement|Var1 Result
-|-
`Var1=42`|42
`Var1 1+1`|"1+1" (the literal string)
`Var1=1+1`|2
`Var1=sunset-sunrise`|duration of daylight in minutes
