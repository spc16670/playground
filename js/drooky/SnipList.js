

(function(DROOKY){
	'use strict';
	DROOKY.Utils.SnipList = {};
	
	var SnipList = function(params) {
		
		
		function SnipList(params) {
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
		SnipList.prototype.add = function(data) {

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
		SnipList.prototype.remove = function(index) {
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
		SnipList.prototype.node = function(index) {

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
		SnipList.prototype.item = function(index) {
			var node = this.node(index);
			return (node == null) ? null : node.data;
		};
		
		SnipList.prototype.moveBack = function() {
			if (this.pointer > -1) {
				this.pointer--;
				return true;
			} else {
				return false;
			}
		};
		
		SnipList.prototype.moveForward = function() {
			if (this.pointer < (this.length -1)) {
				this.pointer++;
				return true;
			} else {
				return false;
			}
		};
		
		SnipList.prototype.getPointed = function() {
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
		SnipList.prototype.addSnipping = function(data) {

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
		SnipList.prototype.size = function(){
			return this.length;
		};
		
		/**
		 * Converts the list into an array.
		 * @return {Array} An array containing all of the data in the list.
		 * @method toArray
		 */
		SnipList.prototype.toArray = function(){
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
		SnipList.prototype.state = function(){
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
		SnipList.prototype.toString = function(){
			return this.toArray().toString();
		}; 
		
		return new SnipList(params);
	}
	
	DROOKY.Utils.SnipList.create = function(params) { return SnipList(params) };
	
	DROOKY.Utils.SnipList.test = function() {
		
		var SnipList1 = DROOKY.Utils.SnipList.create();
		SnipList1.addSnipping({ o : "o"});
		console.log("SIZE SHOULD BE 1",SnipList1.size());
		console.log("POINTED SHOULD BE o",SnipList1.getPointed());
		SnipList1.addSnipping({ p : "p"});
		console.log("SIZE SHOULD BE 2",SnipList1.size());
		console.log("POINTED SHOULD BE p",SnipList1.getPointed());
		
		console.log(SnipList1.toArray());
		SnipList1.remove(1);
		console.log("SIZE SHOULD BE 1",SnipList1.size());
		SnipList1.remove(0);
		console.log("SIZE SHOULD BE 0",SnipList1.size());
		SnipList1.add({ a : "a"});
		SnipList1.add({ b : "b"});
		var c = { c : "c"};SnipList1.add(c);
		SnipList1.add({ d : "d"});
		console.log("SIZE SHOULD BE 4",SnipList1.size());

		SnipList1.remove(2);
		console.log("ITEM @ INDEX 2 REMOVED SO THE SIZE SHOULD BE 3",SnipList1.size());
		console.log("AND THE ITEM @ INDEX 2 SHOULD BE {d}",SnipList1.item(2));
		console.log("SINCE POINTER WENT UP WITH EVERY ADDITION AND DOWN WITH EVERY REMOVAL IT SHOULD POINT AT NODE {d}",SnipList1.getPointed());

		SnipList1.moveForward();
		console.log("MOVING POINTER FORWARD SHOULD RETURN THE SAME ELEMENT {d}",SnipList1.getPointed());

		SnipList1.moveBack();
		console.log("MOVING POINTER BACK SHOULD RETURN ELEMENT {b}",SnipList1.getPointed());

		SnipList1.addSnipping({ z : "z"});
		console.log("SNIPPING AND ADDING ELEMENT NOW SHOULD REMOVE THE {d} AND INSERT {z} IN ITS PLACE",SnipList1.item(2));
		console.log("SIZE SHOULD REMAIN 3",SnipList1.size());

		console.log("AND getPointed() SHOULD RETURN {z}",SnipList1.getPointed());
		
		SnipList1.moveBack();
		SnipList1.moveBack();
		SnipList1.moveBack();
		console.log("MOVING BACK THREE TIMES SHOULD BRING THE POINTED TO NULL",SnipList1.getPointed());
		SnipList1.addSnipping({ sz : "sz"});
		console.log("AND SNIP AND ADDING HERE SHOULD BRING THE SIZE TO 1",SnipList1.size());
		console.log("RETURNING {sz} FOR POINTED",SnipList1.getPointed());
		console.log(SnipList1.toArray());
		
	}
})(DROOKY);

//SNIP_LIST.test();




