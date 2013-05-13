(function () {
    "use strict";

    var root = this;

    function extendObj(to,from) {
        for (var prop in from) { 
            if (from.hasOwnProperty(prop)) {
                to[prop] = from[prop];
            }
        }
    }

    function forceArray(data) {
        return !data || typeof(data) === 'object' && data.push ? data : [data];
    }
   
    function defineObject(args) {
        args = args || {};

        var i, l,
            F  = function() {},
            prototype = args.prototype,
            properties = args.properties,
            extend = forceArray(args.extend),
            mixin = forceArray(args.mixin),
            init = args.init || function() {},
            parent = args.parent;

        if (parent) {
            if (typeof parent.object === 'function' && typeof parent.init === 'function') {
                F.prototype = new parent.object();
            } else if (typeof parent === 'function') {
                F.prototype = new parent();
            } else {
                throw "defineObject: not a valid parent";
            }
        }

        if (extend) {
            for (i=0,l=extend.length; i < l; i++) {
                extendObj(F.prototype, typeof extend[i].prototype === 'object' ? extend[i].prototype : extend[i]);
            }
        }

        if (mixin) {
            for (i = 0, l = mixin.length; i < l; i++) {
                if (typeof mixin[i].prototype === 'object' && typeof mixin[i].init === 'function') {
                    extendObj(F.prototype, mixin[i].prototype);
                } else {
                    throw "defineObject : not a valid mixin";
                }
            }
        }

        extendObj(F.prototype, prototype);

        return {
            object: F,
            init: init,
            prototype: F.prototype,
            parent : parent,
            parentProto : parent ? parent.prototype : null,
            properties : properties,
            create: function() {
                var f = new this.object();

                if (this.properties) {
                    Object.defineProperties(f, properties);
                }

                this.init.apply(f,arguments);

                if (mixin) {
                    for (i = 0, l = mixin.length; i < l; i++) {
                        mixin[i].init.call(f);
                    }
                }

                return f;
            },
            hadCreated: function(obj) {
                return obj instanceof this.object;
            }
        };
    }

    if (typeof exports !== 'undefined') {
        module.exports = exports = defineObject;
    } else {
        root.defineObject = defineObject;
    }

}).call(this);