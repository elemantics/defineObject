// defineObject-js v0.1.1 
// (c) 2013 Sergey Melnikov 

// defineObject-js may be freely distributed under the MIT license

;(function () {
    "use strict";

    var root = this;

    var objectCreate = ( Object.create ||  function(o) {
        function F() {}
        F.prototype = o;
        return new F();
    });

    function extendObject(to,from) {
        for (var prop in from) { 
            if (from.hasOwnProperty(prop) && prop !== 'init') {
                to[prop] = from[prop];
            }
        }

        return to;
    }

    function safeExtend(to,from) {
        for (var prop in from) { 
            if (from.hasOwnProperty(prop)) {
                if (to.hasOwnProperty(prop)) {
                    throw "defineObject : can't set static property " + prop + ", property already exists on object ";
                }

                to[prop] = from[prop];
            }
        }

        return to;
    }
   
    function defineObject(args,staticArgs) {
        var F = function() {
            var i, l,
                mixin = F._mixin,
                properties = F._properties,
                f = !this || this === root ? objectCreate(F.prototype) : this;

            if (properties) {
                Object.defineProperties(f, properties);
            }

            F.init.apply(f,arguments);

            if (mixin) {
                for (i = 0, l = mixin.length; i < l; i++) {
                    mixin[i].call(f);
                }
            }

            return f;
        };

        F.init = (args && args.init) ? args.init : function() {};
        F._mixin = null;
        F._properties = null;
        F.properties = function(props) {
            F._properties || (F._properties = {});
            extendObject(F._properties,props);
            return F;
        };
        F.mixin = function(mixin) {
            if (typeof mixin === 'function') {
                F._mixin || (F._mixin = []);
                extendObject(F.prototype, mixin.prototype);
                F._mixin.push(mixin);
            } else {
                extendObject(F.prototype, mixin);
            }

            return F;
        },
        F.methods = function(methods) {
            if (methods.init) F.init = methods.init;
            extendObject(F.prototype, methods);
        },
        F.statics = function(statics) {
            safeExtend(F, statics);
        },
        F.create = function() {
            var f = F.apply(root,arguments);
            return f;
        };
        F.extend = function(args, staticArgs) {
            return defineObject.extend(F,args, staticArgs);
        };


        if (args) F.methods(args);
        if (staticArgs) F.statics(staticArgs);

        return F;

    }

    defineObject.extend = function(constructor, args, staticArgs) {
            var E = defineObject(null,staticArgs);
            E.prototype = objectCreate(constructor.prototype);
            E.init = (args && args.init) ? args.init : function() {};
            if (constructor._mixin) E._mixin = constructor._mixin.slice(0);
            if (constructor._properties) E._properties = extendObject({},constructor._properties);
            if (args) extendObject(E.prototype, args);
            E.__super__ = constructor.prototype;
            E.__superinit__ = constructor.init || constructor;
            return E;
    };

    if (typeof exports !== 'undefined') {
        module.exports = exports = defineObject;
    } else {
        root.defineObject = defineObject;
    }

}).call(this);