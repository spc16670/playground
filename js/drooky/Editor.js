

(function Editor(DROOKY) {

	var NOT_IMPLEMENTED = "Not Implemented";

	var Editor = function() {
		this.executing = null;
		this.history = SNIP_LIST.create();
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
			this.executing = null;
		}
	};
	
	DROOKY.Editor = new Editor();
	
	function Command() {
		DROOKY.Editor.executing = this;
		this.history = true;
	}
	
	Command.prototype = {
		constructor : Command
		,execute : function () { throw NOT_IMPLEMENTED; }
		,reverse : function () { throw NOT_IMPLEMENTED; }
	}
	
	Editor.prototype.Command = Command;
	
	Editor.prototype.load = function(fn) {
		var args = Array.prototype.slice.call(arguments, 1);
		console.log("args",args)
		//method creates a new object with the specified prototype object and properties.
		fn.prototype = Object.create(DROOKY.Editor.Command.prototype);
		fn.prototype.constructor = fn;
		return new fn;
	}	
})(DROOKY || {});



// ====================================================================

var Commands = {

	CopyCommand : function CopyCommand() {
		DROOKY.Editor.Command.call( this );
		this.execute = function() { console.log(" CopyCommand BEEN EXECUTED ") }
		this.reverse = function() { console.log(" CopyCommand BEEN REVERSED ") }
	}
	
	,ToolCommand : function ToolCommand(name) {
		DROOKY.Editor.Command.call( this );
		this.name = name;
		this.execute = function() { console.log(" ToolCommand BEEN EXECUTED " + this.name) }
		this.reverse = function() { console.log(" ToolCommand BEEN REVERSED " + this.name) }
	}

}

	
function unDo() {
	DROOKY.Editor.unDo();
	console.log(DROOKY);
}

//DROOKY.Editor.load(fn);
function reDo() {
	DROOKY.Editor.reDo();
	console.log(DROOKY);
}

function copy() {
	DROOKY.Editor.load(Commands['CopyCommand']);
	DROOKY.Editor.run();
	console.log(DROOKY);
}

function tool() {
	var fn = Commands['ToolCommand'];
	console.log("fn",fn);
	DROOKY.Editor.load(fn);
	DROOKY.Editor.run();
	console.log(DROOKY);
}

//=================





