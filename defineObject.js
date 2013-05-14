(function () {
    "use strict";

    var root = this;

    var objectCreate = ( Object.create ||  function(o) {
        function F() {}
        F.prototype = o;
        return new F();
    });

    var isArray = ( Array.isArray || function(vArg) {
        return Object.prototype.toString.call(vArg) === "[object Array]";
    });

    function extendObj(to,from) {
        for (var prop in from) { 
            if (from.hasOwnProperty(prop)) {
                to[prop] = from[prop];
            }
        }
    }

    function forceArray(data) {
        return !data || isArray(data) ? data : [data];
    }
   
    function defineObject(args) {
        args = args || {};

        var i, l, F,
            prototype = args.prototype,
            properties = args.properties,
            extend = forceArray(args.extend),
            mixin = forceArray(args.mixin),
            init = args.init || function() {},
            parent = args.parent;

        F = function() {
            var f = !this || this === root ? objectCreate(F.prototype) : this;

            if (F.properties) {
                Object.defineProperties(f, F.properties);
            }

            F.init.apply(f,arguments);

            if (F.mixin) {
                for (i = 0, l = F.mixin.length; i < l; i++) {
                    F.mixin[i].call(f);
                }
            }

            return f;
        };

        if (parent) {
            F.prototype = objectCreate(parent.prototype);
        }

        if (extend) {
            for (i=0,l=extend.length; i < l; i++) {
                extendObj(F.prototype,  extend[i]);
            }
        }

        if (mixin) {
            for (i = 0, l = mixin.length; i < l; i++) {
                if (typeof mixin[i] === 'function') {
                    extendObj(F.prototype, mixin[i].prototype);
                } else {
                    throw "defineObject : not a valid mixin";
                }
            }
        }

        extendObj(F.prototype, prototype);

        F.init = init;
        F.mixin = mixin;
        F.properties = properties;
        F.create = function() {
            var f = F.apply(root,arguments);
            return f;
        };

        if (parent) {
            F.parent = parent;
            F.parentProto = parent.prototype;
        }

        return F;

    }

    if (typeof exports !== 'undefined') {
        module.exports = exports = defineObject;
    } else {
        root.defineObject = defineObject;
    }

}).call(this);