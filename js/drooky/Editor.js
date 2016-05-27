

(function Editor(DROOKY) {

	var NOT_IMPLEMENTED = "Not Implemented";

	var Editor = function() {
		this.executing = null;
		this.history = DROOKY.Utils.SnipList.create();
	};

	Editor.prototype = {
		constructor : Editor
		,unDo : function() {
			var command = this.history.getPointed();
			if (command == null) return;
			command.reverse();
			this.history.moveBack();
		}
		,reDo : function() {
			if (this.history.moveForward()) {
				var command = this.history.getPointed();
				command.execute();
			}
		}
		,run : function() {
			if (this.executing == null) return;
			if (this.executing.history) {
				this.history.addSnipping(this.executing);
			}
			
			this.executing.execute();
			this.executing.finish();
			this.executing = null;
		}
	};
	
	DROOKY.Editor = new Editor();
	
	function Command() {
		DROOKY.Editor.executing = this;
		this.history = true;
		this.async = false;
	}
	
	Command.prototype = {
		constructor : Command
		,finish : function() { }
		,execute : function () { throw NOT_IMPLEMENTED; }
		,finish : function() { }
		,reverse : function () { throw NOT_IMPLEMENTED; }
		,init : function() { DROOKY.Editor.Command.call( this ); }
	}
	
	Editor.prototype.Command = Command;
	
	Editor.prototype.load = function(fn,args) {
		if (DROOKY.Editor.executing != null) {
			DROOKY.Editor.executing.finish();
		}
		fn.prototype = Object.create(DROOKY.Editor.Command.prototype);
		fn.prototype.constructor = fn;
		var inst = Object.create(fn.prototype);
		inst.init();
		fn.apply(inst,args)
		if (inst.async) {
			inst.prepare(DROOKY.Editor.run.bind(this));
		} else {
			DROOKY.Editor.run()
		}
	}	
	
})(DROOKY);




