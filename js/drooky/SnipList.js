
var SNIP_LIST;

(function(SNIP_LIST){
	'use strict';
	
	var DLL = function(params) {
		
		
		function DLL(params) {
			this.length = 0;
			this.head = null;
			this.tail = null;
			this.pointer = -1;
			this.params = params;
		}
		
		var Node = function(data) {
			this.next = null;
			this.prev = null;
			this.data = data;
		};
		
		/**
		 * Appens some data to the end of the list. This method traverses
		 * the existing list and places the value at the end in a new item.
		 * @param {variant} data The data to add to the list.
		 * @return {Void}
		 * @method add
		 */
		DLL.prototype.add = function(data) {

			var node = new Node(data);
			
			if (this.length == 0) {
				this.head = node;
				this.tail = node;
			} else {

				//attach to the tail node
				this.tail.next = node;
				node.prev = this.tail;
				this.tail = node;
			}        

			this.length++;
			this.pointer++;
			
		};
		
		 /**
		 * Removes the item from the given location in the list.
		 * @param {int} index The zero-based index of the item to remove.
		 * @return {variant} The data in the given position in the list or null if
		 *      the item doesn't exist.
		 * @method remove
		 */
		DLL.prototype.remove = function(index) {
			//check for out-of-bounSNIP_LIST values
			if (index > -1 && index < this.length){

				var current = this.head, i = 0;

				//special case: removing first item
				if (index === 0){
					this.head = current.next;

					/*
					 * If there's only one item in the list and you remove it,
					 * then this.head will be null. In that case, you should
					 * also set this.tail to be null to effectively destroy
					 * the list. Otherwise, set the previous pointer on the
					 * new this.head to be null.
					 */
					if (!this.head){
						this.tail = null;
					} else {
						this.head.prev = null;
					}

				//special case: removing last item
				} else if (index === this.length -1){
					current = this.tail;
					this.tail = current.prev;
					this.tail.next = null;
				} else {

					//find the right location
					while(i++ < index){
						current = current.next;
					}

					//skip over the item to remove
					current.prev.next = current.next;
				}

				//decrement the length
				this.length--;
				this.pointer--;

				//return the value
				return current.data;            

			} else {
				return null;
			}
		};
		
		
		
		/**
		 * Retrieves the node in the given position in the list.
		 * @param {int} index The zero-based index of the node
		 * @return {variant} node
		 * @method node
		 */
		DLL.prototype.node = function(index) {

			//check for out-of-bounSNIP_LIST values
			if (index > -1 && index < this.length){
				var current = this.head,
					i = 0;

				while(i++ < index){
					current = current.next;
				}

				return current;
			} else {
				return null;
			}
			
		};
		
		 /**
		 * Retrieves the data in the given position in the list.
		 * @param {int} index The zero-based index of the item whose value 
		 *      should be returned.
		 * @return {variant} The value in the "data" portion of the given item
		 *      or null if the item doesn't exist.
		 * @method item
		 */
		DLL.prototype.item = function(index) {
			var node = this.node(index);
			return (node == null) ? null : node.data;
		};
		
		DLL.prototype.moveBack = function() {
			if (this.pointer > -1) {
				this.pointer--;
				return true;
			} else {
				return false;
			}
		};
		
		DLL.prototype.moveForward = function() {
			if (this.pointer < (this.length -1)) {
				this.pointer++;
				return true;
			} else {
				return false;
			}
		};
		
		DLL.prototype.getPointed = function() {
			return this.item(this.pointer);
		};
		
		/**
		 * Appends some data after the node pointed by the pointer
		 * snipping the rest of the list UNLESS the pointed node is
		 * the first node. In such a case the first node is swapped.
		 * @param {variant} data The data to add to the list.
		 * @return {Void}
		 * @method add
		 */
		DLL.prototype.addSnipping = function(data) {

			var node = new Node(data);
			
			if (this.length == 0) {
				this.head = node;
				this.tail = node;
			} else if (this.pointer == -1) {
				var first = this.node(0);
				if (first.next != null) {
					var follower = first.next;
					follower.prev = null;
				}
				first = null;
				this.head = node;
				this.tail = node;
			} else {
				var pointed = this.node(this.pointer);
				if (pointed.next != null) {
					var follower = pointed.next;
					follower.prev = null;
				}
				pointed.next = node;
				node.prev = pointed;
				this.tail = node;
			}  
			this.pointer++			
			this.length = this.pointer + 1;			
			
		};
		
		/**
		 * Returns the number of items in the list.
		 * @return {int} The number of items in the list.
		 * @method size
		 */
		DLL.prototype.size = function(){
			return this.length;
		};
		
		/**
		 * Converts the list into an array.
		 * @return {Array} An array containing all of the data in the list.
		 * @method toArray
		 */
		DLL.prototype.toArray = function(){
			var result = [],
				current = this.head;
			
			while(current){
				result.push(current.data);
				current = current.next;
			}
			
			return result;
		};
		
		/**
		 * Respresnt nodes ad an Array
		 * @return {Array} An array containing all the noodes
		 * @method state
		 */
		DLL.prototype.state = function(){
			var result = [],
				current = this.head;
			
			while(current){
				result.push(current);
				current = current.next;
			}
			
			return { length : this.length, pointer : this.pointer, nodes : result };
		};
		
		/**
		 * Converts the list into a string representation.
		 * @return {String} A string representation of the list.
		 * @method toString
		 */
		DLL.prototype.toString = function(){
			return this.toArray().toString();
		}; 
		
		return new DLL(params);
	}
	
	SNIP_LIST.create = function(params) { return DLL(params) };
	
	SNIP_LIST.test = function() {
		
		var DLL1 = SNIP_LIST.create();
		DLL1.addSnipping({ o : "o"});
		console.log("SIZE SHOULD BE 1",DLL1.size());
		console.log("POINTED SHOULD BE o",DLL1.getPointed());
		DLL1.addSnipping({ p : "p"});
		console.log("SIZE SHOULD BE 2",DLL1.size());
		console.log("POINTED SHOULD BE p",DLL1.getPointed());
		
		console.log(DLL1.toArray());
		DLL1.remove(1);
		console.log("SIZE SHOULD BE 1",DLL1.size());
		DLL1.remove(0);
		console.log("SIZE SHOULD BE 0",DLL1.size());
		DLL1.add({ a : "a"});
		DLL1.add({ b : "b"});
		var c = { c : "c"};DLL1.add(c);
		DLL1.add({ d : "d"});
		console.log("SIZE SHOULD BE 4",DLL1.size());

		DLL1.remove(2);
		console.log("ITEM @ INDEX 2 REMOVED SO THE SIZE SHOULD BE 3",DLL1.size());
		console.log("AND THE ITEM @ INDEX 2 SHOULD BE {d}",DLL1.item(2));
		console.log("SINCE POINTER WENT UP WITH EVERY ADDITION AND DOWN WITH EVERY REMOVAL IT SHOULD POINT AT NODE {d}",DLL1.getPointed());

		DLL1.moveForward();
		console.log("MOVING POINTER FORWARD SHOULD RETURN THE SAME ELEMENT {d}",DLL1.getPointed());

		DLL1.moveBack();
		console.log("MOVING POINTER BACK SHOULD RETURN ELEMENT {b}",DLL1.getPointed());

		DLL1.addSnipping({ z : "z"});
		console.log("SNIPPING AND ADDING ELEMENT NOW SHOULD REMOVE THE {d} AND INSERT {z} IN ITS PLACE",DLL1.item(2));
		console.log("SIZE SHOULD REMAIN 3",DLL1.size());

		console.log("AND getPointed() SHOULD RETURN {z}",DLL1.getPointed());
		
		DLL1.moveBack();
		DLL1.moveBack();
		DLL1.moveBack();
		console.log("MOVING BACK THREE TIMES SHOULD BRING THE POINTED TO NULL",DLL1.getPointed());
		DLL1.addSnipping({ sz : "sz"});
		console.log("AND SNIP AND ADDING HERE SHOULD BRING THE SIZE TO 1",DLL1.size());
		console.log("RETURNING {sz} FOR POINTED",DLL1.getPointed());
		console.log(DLL1.toArray());
		
	}
})(SNIP_LIST || (SNIP_LIST = {}));

//SNIP_LIST.test();




