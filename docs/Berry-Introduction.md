# Berry Introduction (in 20 minutes or less)

This quick start will drive you in the basics of the Berry language. It should take no more than 20 minutes and is inspired by [Ruby in Twenty Minutes](https://www.ruby-lang.org/en/documentation/quickstart/)

Berry is a ultra-lightweight dynamically typed scripting language. It is designed for lower-performance embedded devices. It also runs on a regular computer, and it can run directly in your browser for quick testing.


Berry is the next generation scripting for Tasmota, embedded by default in all ESP32 based firmwares. It is used for advanced scripting and superseded Rules. Its advanced features are used to extend Tasmota: adding commands, adding drivers (I2C, serial...), extending the web UI, adding full applications (TAPP files), driving advanced graphics with [LVGL](https://lvgl.io/).

To start with Berry, you have at least 3 choices:

- use the [Berry online console](https://berry-lang.github.io/try-online/) and start in less than 10 seconds
- [flash an ESP32](https://tasmota.github.io/docs/Getting-Started/#needed-software) based device with Tasmota and use the Berry console
- compile Berry on your computer from sources and run the Berry interpreter (less preferred)

## Hello, Berry

In the console type:

``` ruby
> print("Hello, Berry")
Hello, Berry
```

What just happened? We just sent the simplest possible Berry program `print("Hello, Berry")`. Internally this program was compiled into Berry bytecode and ran using the Berry virtual machine.

In Berry you can append commands one after the other. Contrary to `C` you don't need any separator like `;`. Unlike `Python` indentation has no importance. Commands need only to be separated by at least one space-like character: space, tab, newline.

``` ruby
> print("Hello, Berry") print("Hello, Berry")
Hello, Berry
Hello, Berry
```

In this second example, the implicit program contains 2 commands.

## Your free calculator is here

Not surprisingly, like most scripting languages you can do direct calculation.

``` berry
> 3+2
5
> 3*2
6
```

The above computations are made against integers. Berry supports either 32 bits or 64 bits integers depending on the underlying platform (usually 32 bits on embedded systems).

Berry supports floating point calculation, as soon as at lest one member if floating point. Floating point uses either 32 bits `float` or 64 bits `double` depending on compilation options (usually 32 bits on embedded systems).

``` ruby
> 3/2
1
> 3.0/2
1.5
> 1/3.0
0.333333
```

The command `3/2` works on integers and returns an integer result. `3.0/2`, `3/2.0` or `3.0/2.0` work on floating point numbers since at least one operand is floating point.

You can convert an integer to floating point using `real()` and truncate to integer with `int()`.

``` ruby
> 3/2
1
> real(3)/2
1.5
> int(3.0/2)
1
```

Beyond the core Berry language, advanced math function are available via the additional module `math` [see documentation](https://github.com/berry-lang/berry/wiki/Chapter-7#math-module).

``` ruby
> import math
> math.sqrt(2)       # square root of 2
1.41421

> math.pow(2,3)      # 2^3
8
```

## Defining a function

What if you want to say "Hello" a lot without getting your fingers all tired? You should define another function:

``` ruby
> def hi() print("Hello, Berry") end
> 
```

Now let's call the function:

``` ruby
> hi()
Hello, Berry
```

`hi` is a function that takes no argument, returns nothing, and prints a message in the console. Calling a function always requires sending arguments between parenthesis `()`. Otherwise Berry thinks that you want to manipulate the function itself as an entity.

``` ruby
> hi           # return the function entity itself
<function: 0x3ffdac6c>

> hi()         # call the function
Hello, Berry
```

What if we want to say hello to one person, and not only to Berry? Just redefine hi function to take a name as an argument.

``` ruby
> def hi(name) print("Hello, " + name) end
```

This way, `hi` is a function that takes a single argument as string.

``` ruby
> hi("Skiars") hi("Theo")
Hello, Skiars
Hello, Theo
```

This function only works if the argument is a string, and fails if you use any other type of argument. Let's use `str()` built-in function to force-convert the argument to a string.

``` ruby
> def hi(name) print("Hello, " + str(name)) end

> hi("Skiars") hi("Theo")
Hello, Skiars
Hello, Theo

> hi(2)
Hello, 2
```

What happens if you don't send any argument to a function that expects one? Let's try:

``` ruby
> def hi(name) print("Hello, " + str(name)) end

> hi()
Hello, nil
```

## The knights who say `nil`

What is this `nil` thing? Berry has a special value `nil` meaning "nothing". `nil` is the implicit value passed to a function when no argument is sent, or the value returned by a function that does not return anything.

``` ruby
> nil
nil

> hi(nil)
Hello, nil

> hi()
Hello, nil
```

As you see, `nil` is the implicit value passed when arguments are missing, but also a value that you can pass explicitly.

## Formatting strings

In the above example, we only concatenated two strings. Berry provides a more advanced scheme to format numerical values as well. It is widely inspired from `C` formatting used by `printf`. Don't forget to import the `string` module first.

``` ruby
> import string
> def say_hi(name) print(string.format("Hello, %s!", name)) end
> def say_bye(name) print(string.format("Bye, %s, come back soon", name)) end

> say_hi("Bob")
Hello, Bob!
> say_bye("Bob")
Bye, Bob, come back soon
```

You can combine with string functions like `loupper()` to convert to uppercase

``` ruby
> import string
> name = "Bob"
> string.format("Hello, %s!", string.toupper(name))
Hello, BOB!
```

In the example above, we have created a global variable called `name` containing the string `"Bob"` and used `string.toupper()` to convert it to all uppercase.

## Evolving into a Greeter

What if we want a real greeter around, one that remembers your name and welcomes you and treats you always with respect. You might want to use an object for that. Let’s create a “Greeter” class.

Note: since it's a multi-line example, you may need to copy the entire block and paste it at once in the console (not line-by-line).

``` ruby
class Greeter
  var name
  
  def init(name)
    self.name = name
  end
  
  def say_hi()
    import string
    print(string.format("Hi %s", self.name))
  end
  
  def say_bye()
    import string
    print(string.format("Bye %s, come back soon.", self.name))
  end
end
```

The new keyword here is `class`. This defines a new class called `Greeter` and a bunch of methods for that class. Also notice `var name`. This is an instance variable, and is available to all the methods of the class. As you can see it’s used by `say_hi` and `say_bye` as `self.name`.

The `init()` method is a special method called a "constructor". It is implicitly called when you create a new instance for the class, and the arguments are passed to `init()`. The constructor is responsible for complete initialization of the object, and it's always the first method called. The above example is typical of any object: it takes an argument `name` and copies it to an instance variable `self.name` to make it available to any method.

Note: Berry has no concept of private members (contrary to C++). All instance variables and methods are always public.

## Creating a greeter object

Now let’s create a greeter object and use it:

``` ruby
> greeter = Greeter("Pat")
> greeter.say_hi()
Hi Pat
> greeter.say_bye()
Bye Pat, come back soon.
```

Once the `greeter` object is created, it remembers that the name is Pat.  If you want to get the `name` from a greeter, you can ask a greeter by accessing the name variable on it (without parenthesis):

``` ruby
> greeter.name
Pat
```

## Subclasses

Methods and instance variables are defined at the class creation. You can't add method or instance variables to an already existing class. To extend a class you can create a sub-class:

``` ruby
class SurGreeter : Greeter     # subclass of Greeter
  var surname
  
  def init(name, surname)      # sub-class takes 2 arguments
    super(self).init(name)     # call constructor of super-class
    self.surname = surname
  end
  
  def say_hi()
    import string
    print(string.format("Hi %s %s", self.name, self.surname))
  end
end
```

The class `SurGreeter` extends `Greeter` with an additional `surname` field. It overwrides `say_hi()` but leaves `say_bye()` unchanged.

There is a special syntax for calling a method of the subclass `super(self).init(name)`.

Note: classes have always an `init()` method, either because it was explicitly defined, or implicitly. It is always ok to call `super(self).init()` even if the subclass has no explicit `init()` method.

Now let's try this new class:

``` ruby
> greet = SurGreeter("John", "Smith")
> greet.say_hi()
Hi John Smith
> greet.say_bye()
Bye John, come back soon.

> greet.name
John
> greet.surname
Smith
```

## Greetings everyone!

This greeter isn’t all that interesting though, it can only deal with one person at a time. What if we had some kind of MegaGreeter that could either greet the world, one person, or a whole list of people? Let’s try to build that. We will start with a class definition:

``` ruby
class MegaGreeter
  var names
  
  def init(name)
    self.names = []          # empty list
    if name != nil
      self.names.push(name)
    end
  end
end
```

So MegaGreeter objects have a list of names. The names field is initialized to the empty list `[]`. The body of the MegaGreeter constructor adds the given name argument to the end of the list of names if it's not `nil`. Mega greeters don't have a single name and no name field, so here the name is just an ordinary parameter that we can use in the body of the constructor.

Let's try it:

``` ruby
> greeter = MegaGreeter()
> greeter.names
[]

> greeter = MegaGreeter("World")
> greeter.names
['World']
```

We can now go ahead and add greeter methods that add more names and show all the names:


``` ruby
class MegaGreeter
  var names
  
  def init(name)
    self.names = []          # empty list
    if name != nil
      self.names.push(name)
    end
  end
  
  def add(name)
    self.names.push(name)
  end
  
  def say_hi()
    import string
    for n: self.names
      print(string.format("Hello %s!", n))
    end
  end
  
  def say_bye()
    import string
    for n: self.names
      print(string.format("Bye %s, come back soon.", n))
    end
  end
end
```

We introduced here a new construct known as an iterator. `for n: self.names` creates a new local variable `n` and iterate the following code for each value in `self.names`.

Let's try the full example now:

``` ruby
> greeter = MegaGreeter()
> greeter.add("Skiars")
> greeter.add("Theo")
> greeter.add("Stephan")

> greeter.say_hi()
Hello Skiars!
Hello Theo!
Hello Stephan!

> greeter.say_bye()
Bye Skiars, come back soon.
Bye Theo, come back soon.
Bye Stephan, come back soon.
```

## Comments

Sometimes, it is nice just to add comments that explain interesting things related to your code. In the example in the last section, there were a few single line comments:

``` ruby
  self.names = []          # empty list
```

Such comments start with `#` and tell the system to ignore the rest of the line.

You can also use multi-line comments starting with `#-` and ending with `-#`.

``` ruby
#-
 This is a comment
-#

#-
# This is also a comment block (`#` are ignored)
-#

#-----------------------------------------
 Alternative way to make comment blocks
 -----------------------------------------#
```

Indentation has no impact on Berry compiler, it's only by convention to make source code more readable.

## Maps

Maps are a very common and powerful feature to store key/value pairs. They are declared usin `{}`.

``` ruby
> m1 = {}           # empty map
> m
{}

> m2 = {"k1":"v1", "k2":"v2", "k3":"v3"}
> m2
{'k2': 'v2', 'k1': 'v1', 'k3': 'v3'}
```

Actually keys and values can be of arbitrary type.

``` ruby
> m3 = { 1.5: 3, 2:"two", true:1, false:nil }
> m3
{1.5: 3, true: 1, 2: 'two', false: nil}
```

The main restriction is that a key can't be `nil`. Setting adding a key of value `nil` is silently ignored.


``` ruby
> m4 = { nil:"foo" }
> m4
{}
```

Accessing a value in the map uses `[<key>]`:

``` ruby
> m1 = {}
> m1['k1'] = "value1"
> m1
{'k1': 'value1'}

# working with numerical values
> m1['k2'] = 0
> m1['k2'] += 5      # shortcut for `m1['k2'] = m1['k2'] + 5`
> m1
{'k': 'value', 'k2': 5}
```

Accessing a non-existent key raises an error. There is an alternative function `find()` to access a key and return a default value if the key is absent. `contains()` can also be used to check the presence of the key.

``` ruby
> m1 = {"foo":"bar"}
> m1.contains("foo")
true
> m1.contains("bar")      # only checks for keys, not values
false

> m1["foo"]
bar
> m1["bar"]
key_error: bar
stack traceback:
   <native>: in native function
   stdin:1: in function `main`

# alternative with find
> m1.find("foo", "not_found")
bar
> m1.find("bar", "not_found")
not_found
> m1.find("bar")          # returns nil by default if not found
```

Note: `m[k] = v` is syntactic sugar for `m.setitem(k, v)`. When reading a value, `m[k]` is equivalent to `m.item(k)`.


## If statements and basic expressions

We can program a ridiculously inefficient Fibonacci sequence generator using if and recursion:

``` ruby
def fib(n)
  if n <= 1 return n end
  return fib(n-1) + fib(n-2)
end
```

This defines a top-level function called `fib` that is not a member of any class. The `fib` function is recursive, calling itself, and also makes use of a few new features. The if-statement is well known from other languages. In Berry it works by taking an expression and conditionally evaluating a block.

Berry also has the usual array of infix operators, `+`, `-`, `*`, `/`, `%` etc. and the relational operators `<`, `<=`, `>`, `>=`, `==` and `!=`.

``` ruby
> fib(10)
55
```



## Cycling and Looping

As we've seen in `MegaGreeter` it is very simple to iterate over a list `for n: self.names [...] end`.


Iterators can also be used over ranges like `for i:0..4` which will iterate over all values between `0` and `4` inclusive (5 iterations in total).

``` ruby
> for i:0..4 print(i) end
0
1
2
3
4
```

Iterating over maps goes in two flavors: iterating over values, or over keys.

``` ruby
> m = {"k1":"v1", "k2":"v2", "k3":"v3"}
> print(m)     # keep in mind that there is no order in a map
{'k2': 'v2', 'k1': 'v1', 'k3': 'v3'}

# iterate over values
> for v: m          print(v) end
v2
v1
v3

# iterate over keys
> for k: m.keys()   print(k) end
k2
k1
k3

# iterate over both keys and values
> for k: m.keys()   print(k, m[k]) end
k2 v2
k1 v1
k3 v3
```

For `C` programmers, the equivalent of `for (int i=0; i<a; i++) { [...] }` is `for i: 0..a-1 [...] end`

## Functions and arguments

In Berry, functions are first class entities (Berry supports functional programming as well as object oriented). Berry is not a strongly types language, which means that you don't define any type as input or output when you define a function. This may seem as a problem, but it's a very powerful feature instead.

Berry relies on what is known as "Duck Typing", as in “If it walks like a duck and it quacks like a duck, then it must be a duck”. As long as the type you provide supports the right methods and calls, then it's fine.

A function only defines the number of arguments it receives:

``` ruby
> def f(a, b) return str(a) + str(b) end        # takes only 2 arguments
```

`f` expects 2 arguments, if you provide less than 2, the non-defined are set to `nil`. If you provide more than 2, the extra-arguments are silently ignored.

``` ruby
> def f(a, b) return str(a) + str(b) end        # takes only 2 arguments
> f("foo", "bar")
foobar
> f("foo")
foonil
> f("foo", "bar", "baz")
foobar
```

A function may or may not return a value with `return <expression>`. If you call just `return` or the function ends without any return statement, the function returns `nil`.

## Closures

Let's finish this introduction with a very powerful feature known as closures. It is sometimes seen as intimidating or complex, but it's actually very simple. We will visit only the most common use of closures, if you want to get more details see the [Berry documentation](https://github.com/berry-lang/berry/wiki/Chapter-5#closure).

Let's go back to our simple Byer example (class that says Bye).

``` ruby
class Byer
  var name
  def init(name)
    self.name = name
  end
  def say_bye()
    import string
    print(string.format("Bye %s, see you soon.", self.name))
  end
end
```

Let's define an instance of this class:

``` ruby
> bye_bob = Byer("Bob")
> bye_pat = Byer("Pat")
> bye_bob.say_bye()
Bye Bob, see you soon.
```

Nothing new until now. Closure are useful as soon as you need callbacks. Let's say that you are using a framework that accepts a callback (a function you provide that will be fired in the future). We want to pass a function that says Bye to Bob.

The naive approach would be to use `bye_bob.say_bye` method, which is a valid function. However this function has no context and can't know which instance you are referring to.

``` ruby
> bye_bob.say_bye
<function: 0x3ffb3200>
> bye_pat.say_bye
<function: 0x3ffb3200>    # same function as above
```

As shown above, since the context is missing, you can't distinguish from the method `bye_bob.say_bye` and `bye_pat.say_bye`. They are the same function.

Closure allows to create a new synthetic function that encapsulates transparently the context.

``` ruby
> cb = def () bye_bob.say_bye() end
> cb
<function: 0x3ffd9df4>

# let's check than a closure on bye_pat is different
> cb_pat = def () bye_pat.say_bye() end
<function: 0x3ffdaaa0>
```

`cb` is a closure, if creates a function that captures the instance `bye_bob` and then calls `say_bye()` on it. Let's call the closures to check they are working.

``` ruby
> cb()
Bye Bob, see you soon.
```

**Tasmota** this is widely used in Tasmota for example for deferred functions. For example if you want to run `bye_bob.say_bye()` in 5 seconds in the future:

``` ruby
> tasmota.set_timer(5000, cb)     # cb() is called in 5000 milliseconds
```

Advanced users: there is a compact syntax for simple callbacks: `def cb(a,b) return <expr> end` becomes`/ a,b -> <expr>`

## Consider Yourself Introduced

So that's a quick tour of Berry. Please have a look at the online [Berry documentation](https://github.com/berry-lang/berry/wiki/Reference).

For Tasmota users, also have a look at the [Tasmota Berry documentation](https://tasmota.github.io/docs/Berry/) and [Tasmota Berry Cookbook](https://tasmota.github.io/docs/Berry-Cookbook/).

## Extra

Here is a short comparison of Berry and Python syntax, courtesy of @Beormund

| Berry vs Python                        | Berry                   | MicroPython             |
|:---------------------------------------|:------------------------|:------------------------|
| Current object                         | `self`                  | `self`                  |
| Single line comments                   | `#`                     | `#`                     |
| Multi line comments                    | `#- ... -#`             |                         |
| Logical 'and', 'or' and not operators  | `&& || !`             | `and or not`            |
| Shift left, right                      | `<< >>`                 | `<< >>`                 |
| Integer division                       | `/`                     | `//`                    |
| Statement blocks/grouping              | (scope)                 | (indent)                |
| Class definition & inheritance         | `class a:b`             | `class a(b):`           |
| Class constructor                      | `def init(x) ... end`   | `def __init__(self, x):` |
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
