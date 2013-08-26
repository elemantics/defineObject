describe("defineObject", function() {
	var A, B, a, b, fn;

	beforeEach(function() {
		fn = function() {};
		A = defineObject({
			__init__: function() {
				this.prop = true;
			}
		});
		B = A.extend();
		a = new A();
		b = new B();
	});


	describe("when defining an object", function() {

	    it("provides access to the prototype", function() {
	    	expect(typeof A.prototype).toBe('object');
	    	expect(a.__proto__).toBe(A.prototype);
	    });

	    it("creates static methods on the object", function() {
	    	var C = defineObject({},{
	    		prop : 'value'
	    	});

	    	expect(C.prop).toEqual('value');
	    });
	});

	describe("when creating an object", function() {
	    it("creates an object with new", function() {
	    	var O = defineObject({
	    		prop : 'value'
	    	});

	    	var o = new O();
	    	expect(o instanceof O).toBe(true);
	    	expect(o.prop).toBe('value');
	    });

		it("call the initalization method, forwarding parameters", function() {
			var result = false;
			var O = defineObject({__init__: function() {}});
			spyOn(O.prototype,"__init__");
			new O(0,1);
			expect(O.prototype.__init__).toHaveBeenCalledWith(0,1);
		});

		it("set the proper context on the initalization method", function() {
			var context;
			var O = defineObject({__init__ : function() {
				context = this;
			}});

			var o = new O();
			expect(context).toEqual(o);

		});

		it("is able to identify constructor object", function() {
		 	expect(a instanceof A).toBe(true);
	    	expect(a instanceof B).toBe(false);
		});

		it("has the passed in prototype as part of its prototype", function() {
			var O = defineObject({prop: 'value'});
			var o = new O();
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

			var o = new O();
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

			var o =  new O();
			expect(o.prop).toEqual('value');
			expect(o.prop2).toEqual('value');
		});

		it("passes on the properties to the inherited object", function() {
			var O = defineObject().properties({
				prop : {
					value : 'value'
				}
			});

			var o = new (O.extend());
			
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

			var o = new O();
			var e = new E();

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

			var o = new O();

			expect(o.prop).toBe('value');
			expect(o.prop2).toBe('value2');
			expect(o instanceof F).toBe(true);
		});

	    it("provides access to the parent's prototype", function() {
	    	expect(B.__super__).toBe(A.prototype);
	    });

	    it("inherits and runs the __init__ method", function() {
	    	expect(B.prototype.__init__).toBe(A.prototype.__init__);
	    	expect(b.prop).toBe(true);
	    });

	    it("has the correct constructor property", function() {
	    	expect(b.constructor).toBe(B);
	    });
	});


	describe("when mixing in other objects", function() {
		it("extends the objects prototype with the mixed in objects", function() {
			var M = defineObject({ 
				value : true
			});

			var C = defineObject().mixin(M);

			var c = new C();
			expect(c.value).toBe(true);
		});

		it("calls the __init__ method on the mixed in objects with the correct context", function() {
			var M = defineObject({ 
				__init__ : function() {
					this.value = true;
				}
			});

			var C = defineObject().mixin(M);

			var c = new C();
			expect(c.value).toBe(true);
		});

		it("can mixin plain constructors", function() {
			var M = function() {
				this.value2 = true;
			};

			M.prototype.value = true;

			var C = defineObject().mixin(M);
			var c = new C();

			expect(c.value).toBe(true);
			expect(c.value2).toBe(true);
		});

		it("can mixin with plain objects", function() {
			var M = {
				value: true
			};

			var C = defineObject().mixin(M);
			var c = new C();

			expect(c.value).toBe(true);
		});

		it("calls the __init__ method on plain objects", function() {
			var result = [];

			var C = defineObject({
				__init__ : function() {
					result.push(3);
				}		
			})
			.mixin({
				__init__ : function() {
					result.push(1);
				}
			})
			.mixin({
				__init__: function() {
					result.push(2);
				}
			});

			new C();

			expect(result).toEqual([1,2,3]);
		});

		it("passes along the mixin to the extended object", function() {
			var M = defineObject({ 
				__init__ : function() {
					this.value = true;
				}
			});

			var O = defineObject().mixin(M);
			var o = new (O.extend());
			
			expect(o.value).toEqual(true);
		});

		it("does not affect parent constructor if new mixins are added to the child", function() {
			var M = defineObject({ 
				__init__ : function() {
					this.value = true;
				}
			});

			var M2 = defineObject({ 
				__init__ : function() {
					this.value2 = true;
				}
			});

			var O = defineObject().mixin(M);

			var E = O.extend().mixin(M2);

			var o = new O();
			var e = new E();

			expect(o.value2).toBe(undefined);
			expect(e.value2).toEqual(true);
		});
	});
});