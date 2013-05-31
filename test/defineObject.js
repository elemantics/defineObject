describe("defineObject", function() {
	var A, B, a, fn;

	beforeEach(function() {
		fn = function() {};
		A = defineObject();
		B = A.extend();
		a = A.create();
	});


	describe("when defining an object", function() {

	    it("provide access to the prototype", function() {
	    	expect(typeof A.prototype).toBe('object');
	    	expect(a.__proto__).toBe(A.prototype);
	    });

	    it("provides access to the original initialization function", function() {
	    	var C = defineObject({init: fn});
	    	expect(C.init).toEqual(fn);
	    });

	    it("creates static methods on the object", function() {
	    	var C = defineObject({},{
	    		prop : 'value'
	    	});

	    	expect(C.prop).toEqual('value');
	    });

	    it("prevents static methods redifining existing methods", function() {
	    	expect(function() {
	    		defineObject({},{init: 'error'});
	    	}).toThrow();
	    });
	});

	describe("when creating an object", function() {
		it("create an empty object", function() {
	    	expect(A.create()).toEqual({}); 
	    });

	    it("creates an object with create function", function() {
			var O = defineObject({
	    		prop : 'value'
	    		
	    	});

	    	var o = O.create();
	    	expect(o instanceof O).toBe(true);
	    	expect(o.prop).toBe('value');

	    });

	    it("creates an object with new", function() {
	    	var O = defineObject({
	    		prop : 'value'
	    	});

	    	var o = new O();
	    	expect(o instanceof O).toBe(true);
	    	expect(o.prop).toBe('value');
	    });

	    it("creates an object without new", function() {
	    	var O = defineObject({
	    		prop : 'value'
	    	});

	    	var o = O();
	    	expect(o instanceof O).toBe(true);
	    	expect(o.prop).toBe('value');
	    });

		it("call the initialization method, forwarding parameters", function() {
			var result = false;
			var O = defineObject({init: function() {}});
			spyOn(O,"init");
			O.create(0,1);
			expect(O.init).toHaveBeenCalledWith(0,1);
		});

		it("set the proper context on the initialization method", function() {
			var context;
			var O = defineObject({init : function() {
				context = this;
			}});

			var o = O.create();
			expect(context).toEqual(o);

		});

		it("is able to identify constructor object", function() {
		 	expect(a instanceof A).toBe(true);
	    	expect(a instanceof B).toBe(false);
		});

		it("has the passed in prototype as part of its prototype", function() {
			var O = defineObject({prop: 'value'});
			var o = O.create();
			expect(o.prop).toEqual('value');
		});

		
	});

	describe("when defining properties", function() {
		it("creates properties with Object.defineProperties", function() {
			var O = defineObject()
				.properties({
					prop : {
						value : 'value'
					}
				});

			var o = O.create();
			expect(o.prop).toEqual('value');
		});

		it("stacks the properties with multiple calls", function() {
			var O = defineObject().properties({
					prop : {
						value : 'value'
					}
				}).properties({
					prop2 : {
						value : 'value'
					}
				});

			var o = O.create();
			expect(o.prop).toEqual('value');
			expect(o.prop2).toEqual('value');
		});

		it("passes on the properties to the inherited object", function() {
			var O = defineObject().properties({
				prop : {
					value : 'value'
				}
			});

			var o = O.extend().create();
			
			expect(o.prop).toEqual('value');

		});

		it("does not affect parent constructor if new properties are added to the child", function() {
			var O = defineObject().properties({
				prop : {
					value : 'value'
				}
			});

			var E = O.extend().properties({
				prop2 : {
					value : 'value'
				}
			});

			var o = O.create();
			var e = E.create();

			expect(o.prop2).toBe(undefined);
			expect(e.prop2).toEqual('value');

		});
	});

	describe("when inheriting from a parent", function() {

		it("inherits from the passed in parent", function() {
			expect(B.prototype.__proto__).toEqual(A.prototype);
		});

		it("inherits from normal constructor", function() {
			var F = function() {};
			F.prototype.prop = 'value';

			var O = defineObject.extend(F,{
				prop2 : 'value2'
			});

			var o = O.create();

			expect(o.prop).toBe('value');
			expect(o.prop2).toBe('value2');
			expect(o instanceof F).toBe(true);
		});

		it("provides access to the parent's init method", function() {
	    	expect(B.__superinit__).toBe(A.init);
	    });

	    it("provides access to the parent's prototype", function() {
	    	expect(B.__super__).toBe(A.prototype);
	    });
	});


	describe("when mixing in other objects", function() {
		it("extends the objects prototype with the mixed in objects", function() {
			var M = defineObject({ 
				value : true
			});

			var C = defineObject().mixin(M);

			var c = C.create();
			expect(c.value).toBe(true);
		});

		it("calls the init method on the mixed in objects with the correct context", function() {
			var M = defineObject({ 
				init : function() {
					this.value = true;
				}
			});

			var C = defineObject().mixin(M);

			var c = C.create();
			expect(c.value).toBe(true);
		});

		it("can mixin plain constructors", function() {
			var M = function() {
				this.value2 = true;
			};

			M.prototype.value = true;

			var C = defineObject().mixin(M);
			var c = C.create();

			expect(c.value).toBe(true);
			expect(c.value2).toBe(true);
		});

		it("can mixin with plain objects", function() {
			var M = {
				value: true
			};

			var C = defineObject().mixin(M);
			var c = C.create();

			expect(c.value).toBe(true);
		});

		it("passes along the mixin to the extended object", function() {
			var M = defineObject({ 
				init : function() {
					this.value = true;
				}
			});

			var O = defineObject().mixin(M);
			var o = O.extend().create();
			
			expect(o.value).toEqual(true);
		});

		it("does not affect parent constructor if new mixins are added to the child", function() {
			var M = defineObject({ 
				init : function() {
					this.value = true;
				}
			});

			var M2 = defineObject({ 
				init : function() {
					this.value2 = true;
				}
			});

			var O = defineObject().mixin(M);

			var E = O.extend().mixin(M2);

			var o = O.create();
			var e = E.create();

			expect(o.value2).toBe(undefined);
			expect(e.value2).toEqual(true);
		});
	});
});