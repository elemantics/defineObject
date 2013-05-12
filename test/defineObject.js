describe("defineObject", function() {
	var A, B, a, fn;

	beforeEach(function() {
		fn = function() {};
		A = defineObject();
		B = defineObject({parent: A});
		a = A.create();
	});


	describe("when defining an object", function() {

	    it("provide access to the constructor", function() {
	    	expect(typeof A.object).toBe('function');
	    	expect(a.constructor).toBe(A.object);
	    });

	    it("provide access to the prototype", function() {
	    	expect(typeof A.prototype).toBe('object');
	    	expect(a.__proto__).toBe(A.prototype);
	    });

	    it("provides access to the original initialization function", function() {
	    	var C = defineObject({init: fn});
	    	expect(C.init).toEqual(fn);
	    });
	});

	describe("when creating an object", function() {
		it("create an empty object", function() {
	    	expect(A.create()).toEqual({}); 
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
		 	expect(A.hadCreated(a)).toBe(true);
	    	expect(B.hadCreated(a)).toBe(false);
		});

		it("has the passed in properties as part of its prototype", function() {
			var O = defineObject({properties : { prop: 'value'}});
			var o = O.create();
			expect(o.prop).toEqual('value');
		});
	});

	describe("when inheriting from a parent", function() {

		it("inherits from the passed in parent", function() {
			expect(B.prototype.__proto__).toEqual(A.prototype);
		});

		it("provides access to the parent", function() {
	    	expect(B.parent).toBe(A);
	    });

	    it("provides access to the parent's prototype", function() {
	    	expect(B.parentProto).toBe(A.prototype);
	    });

	    it("throws an error if an incorrect object gets passed in as the parent", function() {
	    	expect(function() { 
	    		defineObject({ parent : {} }) 
	    	}).toThrow();
	    });
	});

	describe("when extending other objects", function() {
		it("extends plain objects", function() {
			var C = defineObject({
				extend : { value : true }
			});

			var c = C.create();
			expect(c.value).toBe(true);
		});

		it("extends the objects prototype field if it is found instead", function() {
			var o = function() {};
			o.prototype.value = true;

			var C = defineObject({
				extend : o
			});

			var c = C.create();
			expect(c.value).toBe(true);
		});

		it("extends the objects in order if an array is provided ", function() {
			var o = function() {};
			o.prototype.one = 0;
			o.prototype.two = 2;

			var C = defineObject({
				extend : [o, { one: 1, three: 3 }]
			});

			var c = C.create();
			expect(c.one).toBe(1);
			expect(c.two).toBe(2);
			expect(c.three).toBe(3);
		});
	});

	describe("when mixing in other objects", function() {
		it("extends the objects prototype with the mixed in objects", function() {
			var M = defineObject({ 
				properties: {
					value : true
				}
			});

			var C = defineObject({
				mixin : M
			});

			var c = C.create();
			expect(c.value).toBe(true);
		});

		it("calls the init method on the mixed in objects with the correct context", function() {
			var M = defineObject({ 
				init : function() {
					this.value = true;
				}
			});

			var C = defineObject({
				mixin : M
			});

			var c = C.create();
			expect(c.value).toBe(true);
		});

		it("mixes in the objects in order if an array is provided ", function() {
			var M = defineObject({ 
				properties : {
					one: 0,
					two: 2
				}
			});

			var M2 = defineObject({ 
				properties : {
					one : 1,
					three: 3
				}
			});

			var C = defineObject({
				mixin : [M, M2]
			});

			var c = C.create();
			expect(c.one).toBe(1);
			expect(c.two).toBe(2);
			expect(c.three).toBe(3);
		});

		it("calls the init method in order if an array is provided", function() {
			var M = defineObject({ 
				init : function() {
					this.one = 0;
					this.two = 2;
				}
			});

			var M2 = defineObject({ 
				init : function() {
					this.one = 1;
					this.three = 3;
				}
			});

			var C = defineObject({
				mixin : [M, M2]
			});

			var c = C.create();
			expect(c.one).toBe(1);
			expect(c.two).toBe(2);
			expect(c.three).toBe(3);
		});

		it("throws an error if an incorrect object gets passed in as the parent", function() {
			expect(function() {
				defineObject({
					mixin : {}
				})
			}).toThrow();
	    });
	});
});