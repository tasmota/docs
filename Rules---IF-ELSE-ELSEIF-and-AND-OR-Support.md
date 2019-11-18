**This feature is not included in precompiled binaries.**    
To use it you must [compile your build](compile-your-build). Add the following to `user_config_override.h`:
```
#define USE_EXPRESSION         // Add support for expression evaluation in rules (+3k2 code, +64 bytes mem)  
#define SUPPORT_IF_STATEMENT   // Add support for IF statement in rules (+4k2 code, -332 bytes mem)  
```
----

## Major features  
- Support IF, ELSEIF, ELSE  
- Support for `<comparison>` and `<logical expression>` as condition  
- Support for executing multiple commands  
- Support for nested IF statements  
- Available free RAM is the only limit for logical operators, parenthesis, and nested IF statements.  

Note: All the commands executed _**within an IF block**_ are performed via `Backlog`  

## Syntax  
`<if-statement>`  
- `IF (<logical-expression>) <statement-list> {ELSEIF (<logical-expression>) <statement-list>} [ELSE <statement-list>] ENDIF`  

`<logical-expression>`  
- `<comparison-expression>`  
- `(` `<comparison-expression>` | `<logical-expression>` `)` {{`AND` | `OR`} `<logical-expression>`}  
- `(` `<logical-expression>` `)` {`AND` | `OR`} `<logical expression>`}  

`<comparison-expression>`  
- `<expression>` {`=` \| `<` \| `>` \| `|` \| `==` \| `<=` \| `>=` \| `!=`} `<expression>`  

`<statement-list>`  
- `<statement>` {`;` `<statement>`}  

`<statement>`  
- {`<Tasmota-command>` | `<if-statement>`}  

## In English
IF statement supports 3 formats:  
- `IF (<condition>) <statement-list> ENDIF`  
- `IF (<condition>) <statement-list> ELSE <statement-list> ENDIF`  
- `IF (<condition>) <statement-list> [ELSEIF (<condition>) <statement-list> ] ELSE <statement-list> ENDIF`  

`<condition>` is a logical expression, for example:  
- `VAR1>=10`  
- Multiple comparison expressions with logical operator `AND` or `OR` between them. `AND` has higher priority than `OR`. For example:  
`UPTIME>100 AND MEM1==1 OR MEM2==1`  
Parenthesis can be used to change the priority of logical expression. For example:  
`UPTIME>100 AND (MEM1==1 OR MEM2==1)`  
- The following variables can be used in `<condition>`:  

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

`<statement-list>`  
- A Tasmota command (e.g.,`LedPower on`)  
- Another IF statement (`IF ... ENDIF`)  
- Multiple Tasmota commands or IF statements separated by `;`. For example:  
  `Power1 off; LedPower on; IF (Mem1==0) Var1 Var1+1; Mem1 1 ENDIF; Delay 10; Power1 on`  
  `Backlog` is implied and is not required (saves rule set buffer space).  

## Example  
Rule used to control pressure cooker with a Sonoff S31. Once it is finished cooking, shut off the power immediately.  
```
Rule1
 on system#boot do var1 0 endon
 on energy#power>100 do if (var1!=1) ruletimer1 0;var1 1 endif endon
 on tele-energy#power<50 do if (var1==1) var1 2;ruletimer1 600 endif endon
 on rules#timer=1 do backlog var1 0;power off endon  
```