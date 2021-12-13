| Berry vs Python                        | Berry                   | MicroPython             |
|:---------------------------------------|:------------------------|:------------------------|
| Current object                         | `self`                  | `self`                  |
| Single line comments                   | `#`                     | `#`                     |
| Multi line comments                    | `#- ... -#`             |                         |
| Logical 'and', 'or' and not operators  | `&& \|\| !`             | `and or not`            |
| Shift left, right                      | `<< >>`                 | `<< >>`                 |
| Integer division                       | `/`                     | `//`                    |
| Statement blocks/grouping              | (scope)                 | (indent)                |
| Class definition & inheritance         | `class a:b`             | `class a(b):`           |
| Class constructor                      | `def init(x) ... end`   | `def__init__(self, x):` |
| Class and superclass constructors      | `def init(x)`<br>`super(self).init(x)`<br>`end` | `def __init__(self, x): super(b, self).__init__(x)`|
| Class constructor that assigns to fields| `def init(x)`<br>`self.x = x`<br>`end`|`def __init__(self, x): self.x = x`|
| Check object's type                    | `isinstance(b, a)`      | `isinstance(b, a)`      |
| Call method foo with 2 arguments       | `foo(x, y)`             | `foo(x,y)`              |
| Declare a member variable in a class   | `self.x = nil`          | `self.x = None`         |
| Declare a local variable in a method   | `var x = 2, y = nil`    | `x = 2`<br>`y = None`   |
| Define a constant in a class           | `static x = 2`          |                         |
| Definte a top level function           | `def foo(x,y) end`      | `def foo(x,y):`         |
| Define an instance method in a class   | `def foo(x,y) end`      | `def foo(self, x, y):`  |
| Define a static method in a class      | `static def foo(x,y) end`|                         |
| If statement                           | `if condition end`      | `if condition:`         |
| Fixed loop                             | `for i: range end`      | `for i in range(end):`  |
| Iterate over collection                | `for k: coll.keys() end`| `for x in coll:`        |
| While loop                             | `while condition end`   | `while condition:`      |
| Import from library                    | `import library`        | `import library`        |
| Print                                  | `print('hello world')`  | `print('Hello world')`  |
| Interpolation                          | `string.format("Hello %s", name)` | `print("Hello %s" %(name))`|
| Simple types                        | `int`<br>`real`<br>`bool (true\|false)`<br>`string`<br>`nil`|`int`<br>`float`<br>`bool (True\|False)`<br>`string`<br>`None`|
| Class types                         | `list`<br>`map`<br>`range`<br><br><br>|`list`<br>`dict`<br><br>`tuple`<br>`set`