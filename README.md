defineObject
============

A bit of sugar for defining JavaScript Objects and their prototypes.

Why
------------

* Just a tiny wrapper around creating JavaScript objects, does not try turn JavaScript into something it's not. (ie classes)
* Define objects without having to deal with the awkward and verbose syntax found in ES3 & ES5.
* Guarantees a side-effect free constructor for painless inheritance.
* Provides a simple mechanism for mixins.
* What gets created is a plain javascript constructor
* Avoids the 'new' keyword when create new object instances. [ES3]

Why not?
------------

* Adds some overhead when defining new objects, although the cost is very minimal and most likely paid upfront.
* Adds 1 extra function call overhead when instantiating new objects, should not be an issue for the vast majority of js applications. For games, the use of object pooling can make this a non-issue as well.
* Yet another library ...

Usage
----------

```javascript
  
  //Create a base class with some default methods
  var Base = defineObject({
    hello: function() {
      console.log("hello world!");
    }
  });

  //Extend from the base class
  var Animal = Base.extend({
    //a initialization method with side-effects
    //that luckily will not get called when the Animal object is extended from
    init: function() {
      this.launchRockets();
    },
    sound: 'silence',
    weight: 0,
    vocalize: function() {
      console.log(this.sound);
    }
  });

  //Create a logger method which will be used as a mixin in our example
  //any object, or constructor can be used as a mixin
  var Logger = Base.extend({
    init: function() {
      this.logHistory = [];
    },
    log : function(msg) {
    this.logHistory.push(msg);
    console.log(msg)
    }
    
  });

  //Define the Dog object extending from Animal while mixing in Logger.
  var Dog = Animal.extend({
    init : function(weight) {
      this.weight = weight;
      //Dog.__superinit__.call(this); -- if you need to have access to the Animal initialization method
    },
    sound : 'woof',
    vocalize : function() {
      Dog.__super__.vocalize.call(this); // Calling 'super' methods remains about the same.
      this.log("dog is vocalizing");
    },
    drool: function() {
      console.log("I want what you're having.");
      this.log("dog is drooling")
    }
  }).mixin(Logger);

  var dog = Dog.create(80); //Alternatively 'new Dog(80)' or 'Dog(80)'
  dog.hello();
  dog.vocalize();
  dog.drool();
  console.log("History", dog.logHistory);

  console.log( dog instanceof Dog ); //true
  console.log( dog instanceof Animal); //true
  console.log( dog instanceof Logger); //false 
  
```

Extending from plain js constructors
------------------------------------

You can use defineObject to extend from plain javascript constructors using defineObject.extend

```javascript

var Plain = function() {
  this.foo = 'bar';
};

Plain.prototype.bar = 'foo';

var Ext = defineObject.extend(Plain, {
    init : function() {
      Ext.__superinit__.call(this);
    },
    fizz: 'fuzz'
}).mixin({'fud' : 'foo'});

var obj = Ext.create();

console.log(obj instanceof Plain);
console.log(obj.foo, obj.bar, obj.fizz, obj.fud);

```

Static Methods
-------------------

Static methods can be defined by passing in a second object literal to defineObject or extend;

```javascript

var O = defineObject({
    instanceProp: 'foo'
  },
  {
    staticProp: 'bar'
  });

console.log(O.staticProp)

```

Note: defineOjbect will not allow you to redifine exsisting static properties, an exception will be thrown. 


[ES5 ONLY] Properties
--------------------

calling the 'properties' method on an object definition will simply pass the assigned literal to Object.defineProperties upon the creation of an object.

See: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperties

```javascript
  
  var O = defineObject()
    .properties({
      field : {
            value : 'value',
            writable : false
          }
        }
    });
  
  var o = O.create();
  console.log(o.field);
  o.field = 'error'; //error
  
```

Chainable style
---------------

If preffered, objects can be defined in a fully chainable style as well: 

```javascript
  Dog = Animal.extend()
    .methods({...})
    .statics({...})
    .mixin(...)
    .mixin(...)
    .properties({...})
```

Where 'methods' and 'statics' replace the first two arguments of the extend/defineOjbect function.
Both functions can also be used to extend the prototype/static methods of an Object.