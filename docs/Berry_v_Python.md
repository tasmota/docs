| Berry vs Python                        | Berry                   | MicroPython             |
|:---------------------------------------|:------------------------|:------------------------|
| Current object                         | `self`                  | <pre class="shiki" style="background-color: #2e3440ff"><code><span class="line"><span style="color: #81A1C1">self</span></span></code></pre>                  |
| Single line comments                   | `#`                     | <pre class="shiki" style="background-color: #2e3440ff"><code><span class="line"><span style="color: #616E88">#</span></span></code></pre>                     |
| Multi line comments                    | `#- ... -#`             |                         |
| Logical 'and', 'or' and not operators  | `&& \|\| !`             | `and or not`            |
| Shift left, right                      | `<< >>`                 | `<< >>`                 |
| Integer division                       | `/`                     | `//`                    |
| Statement blocks/grouping              | (scope)                 | (indent)                |
| Class definition & inheritance         | `class a:b`             | `class a(b):`           |
| Class constructor                      | `def init(x) ... end`   | <pre class="shiki" style="background-color: #2e3440ff"><code><span class="line"><span style="color: #88C0D0">def__init__</span><span style="color: #ECEFF4">(</span><span style="color: #81A1C1">self</span><span style="color: #ECEFF4">,</span><span style="color: #D8DEE9FF"> x</span><span style="color: #ECEFF4">):</span></span></code></pre> |
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
| While loop                             | `while condition end`   |  `while condition:`      |
| Import from library                    | `import library`        | `import library`        |
| Print                                  | `print('hello world')`  | `print('Hello world')`  |
| Interpolation                          | `string.format("Hello %s", name)` | `print("Hello %s" %(name))`|
| Simple types                        | `int`<br>`real`<br>`bool (true\|false)`<br>`string`<br>`nil`|`int`<br>`float`<br>`bool (True\|False)`<br>`string`<br>`None`|
| Class types                         | `list`<br>`map`<br>`range`<br><br><br>|`list`<br>`dict`<br><br>`tuple`<br>`set`




```
shiki.getHighlighter({theme: 'nord'}).then(highlighter => {console.log(highlighter.codeToHtml(`def fib(n):    # write Fibonacci series up to n
    """Print a Fibonacci series up to n."""
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a+b
    print()

# Now call the function we just defined:
fib(2000)`, { lang: 'py' }))})```
