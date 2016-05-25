
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
	
	,Crop : function (canvas,onFinish) {
		this.name = name;
		this.onFinish = onFinish;
		this.canvas = canvas;
		this.execute = function() { 
			console.log(" Crop BEEN EXECUTED " + this.name) 
			var ctx=this.canvas.getContext("2d");
			ctx.beginPath();
			ctx.moveTo(this.points.start.x,this.points.start.y);
			ctx.lineTo(this.points.end.x,this.points.end.y);
			ctx.stroke();
		}
		this.reverse = function() { 
			console.log(" Crop BEEN REVERSED " + this.name) 
			var ctx=this.canvas.getContext("2d");
			ctx.clearRect(0,0,150,150);
		}
		this.points = { 
			start : { x : null, y : null }
			, end : { x : null, y : null } 
		}
		this.listener = function(e) {
			var rect = this.canvas.getBoundingClientRect();
			console.log
			if (e.type === "mousedown") {
				this.points.start.x = e.clientX - rect.left;
				this.points.start.y = e.clientY - rect.top;
			} else if (e.type === "mouseup") {
				this.points.end.x = e.clientX - rect.left;
				this.points.end.y = e.clientY - rect.top;
				this.onFinish();
			}
		}
	}
}
	
})(DROOKY)