
(function(DROOKY){
	
	DROOKY.Editor.Commands = {

	Copy : function () {
		this.execute = function() { console.log(" Copy BEEN EXECUTED ") }
		this.reverse = function() { console.log(" Copy BEEN REVERSED ") }
	}
	
	,Tool : function (name) {
		this.name = name;
		this.execute = function() { console.log(" Tool BEEN EXECUTED " + this.name) }
		this.reverse = function() { console.log(" Tool BEEN REVERSED " + this.name) }
	}
	
	,Crop : function (canvas) {
		this.canvas = canvas;
		this.async = true;
		this.points = { 
			start : { x : null, y : null }
			, end : { x : null, y : null } 
		}
		
		this.handleEvent = function(e) {
			var rect = this.canvas.getBoundingClientRect();
			if (e.type == "mousedown") {
				this.points.start.x = e.clientX - rect.left;
				this.points.start.y = e.clientY - rect.top;
			} else if (e.type == "mouseup") {
				this.points.end.x = e.clientX - rect.left;
				this.points.end.y = e.clientY - rect.top;
				this.onFinish();
			}
		}
		
		this.prepare = function(onFinish) {
			this.canvas.addEventListener("mousedown",this, false);
			this.canvas.addEventListener("mouseup",this, false);
			this.onFinish = onFinish;
		}
		
		this.execute = function() { 
			console.log("Crop");
			var ctx=this.canvas.getContext("2d");
			ctx.beginPath();
			ctx.moveTo(this.points.start.x,this.points.start.y);
			ctx.lineTo(this.points.end.x,this.points.end.y);
			ctx.stroke();
		}
		this.finish = function() {
			this.canvas.removeEventListener("mousedown",this, false);
			this.canvas.removeEventListener("mouseup",this, false);
		}
		this.reverse = function() { 
			console.log(" Crop BEEN REVERSED " + this.name) 
			var ctx=this.canvas.getContext("2d");
			ctx.clearRect(0,0,150,150);
		}
	}
}
	
})(DROOKY)