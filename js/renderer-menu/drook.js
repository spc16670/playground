
// the ns
var DROOK;

if ( typeof define === 'function' && define.amd ) {
	define( 'DROOK', DROOK );
} else if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
	module.exports = DROOK;
}

(function(DROOK, THREE) {
	'use strict';
	DROOK.REVISION = '1';
	DROOK.THREE = (function () { 
		if (THREE) {
			return THREE;
		} else {
			console.log("THREE is undefined");
			return null;
		}
	})();
	
	function setup() {
		console.log("setup",this);
	}
	
	function Dog() {
		this.type = "dog";
		this.count = 1;
		this.total = function() {
			this.total = 10 + this.count;
		}
		this.total();
		console.log("Dog",this);
	}
	
	DROOK.Dog = Dog;
	
})( DROOK || ( DROOK = {} ) , (typeof THREE == 'undefined') ? null : THREE );


//console.log("new",new DROOK.Dog(),"\n-------------");

//=============================================================================
//=============================================================================
//=============================================================================
/*
var Person = function() {
	this.canTalk = true;
}
console.log("1 Person()",Person);
console.log("1 Person()",Person.constructor);

var personInstance = new Person();
console.log("1 Person()",personInstance);
console.log("1 Person()",personInstance.constructor);

Person.prototype.greet = function() {
	if (this.canTalk) {
		console.log("Hi, I am ", + this.name);
	}
}


var Employee = function(name, title) {
	Person.call(this); // call the Person function with the given this
	this.name = name;
	this.title = title;
}

Employee.prototype.greet = function() {
  if (this.canTalk) {
    console.log('Hi, I am ' + this.name + ', the ' + this.title);
  }
};


console.log("1 Employee()",new Employee());

Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;


var empInstance = new Employee("CZAJA","MR");

console.log("2 Employee()",empInstance);

empInstance.greet()

*/




























