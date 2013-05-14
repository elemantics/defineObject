defineObject
============

A bit of sugar for defining JavaScript Objects and their prototypes.

Why
------------

* Just a tiny wrapper around JavaScript objects, does not try turn JavaScript into something it's not. (ie classes)
* Define objects without having to deal with the awkward and verbose syntax found in ES3 & ES5.
* Guarantees a side-effect free constructor for painless inheritance.
* Provides a simple mechanism for mixins.
* Provides a consistent structure for extension, mixins and inheritance.
* Avoids the 'new' keyword when create new object instances. [ES3]

Why not?
------------

* Adds some overhead when defining new objects, although the cost is very minimal and most likely paid upfront.
* Adds 1 extra function call overhead when instantiating new objects, should not be an issue for the vast majority of js applications. For games, the use of object pooling can make this a non-issue as well.
* Yet another library ...

Usage
----------

```javascript
  var Animal = defineObject({
    //a initialization method with side-effects
    //that luckily will not get called when the Animal object is inherited from
    init: function() {
      this.launchRockets();
    },
    prototype : {
      sound: 'silence',
      weight: 0,
      vocalize: function() {
        console.log(this.sound);
      }
    }
  });

  var Logger = defineObject({
    init: function() {
      this.logHistory = [];
    },
    prototype: {
      log : function(msg) {
        this.logHistory.push(msg);
        console.log(msg)
      }
    }
  });

  var Dog = defineObject({
    init : function(weight) {
      this.weight = weight;
      //Dog.parent.init.call(this); -- if you need to have access to the Animal initialization method
    },
    parent : Animal, //inherits from Animal
    mixin : Logger , //alternatively an array may be passed for multiple mixins ie [Logger, Events]
    prototype : {
      sound : 'woof',
      vocalize : function() {
        Dog.parentProto.vocalize.call(this); // Calling 'super' methods remains about the same.
        this.log("dog is vocalizing");
      },
      drool: function() {
        console.log("I want what you're having.");
        this.log("dog is drooling")
      }
    }
  });

  var dog = Dog.create(80); //Alternatively 'new Dog(80)' or 'Dog(80)'
  dog.vocalize();
  dog.drool();
  console.log("History", dog.logHistory);

  console.log( dog instanceof Dog );
  
  
```

[ES5 ONLY] Properties
--------------------

Including a 'properties' field will simply pass the assigned literal to Object.defineProperties upon the creation of an object.

See: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperties

```javascript
  
  var O = defineObject({
    properties : {
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

