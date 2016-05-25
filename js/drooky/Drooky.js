

var DROOKY = { };

// =======================================
function unDo() {
	DROOKY.Editor.unDo();
	console.log(DROOKY);
}

function reDo() {
	DROOKY.Editor.reDo();
	console.log(DROOKY);
}

function copy() {
	DROOKY.Editor.load(DROOKY.Editor.Commands['Copy'],arguments);
	DROOKY.Editor.run();
	console.log(DROOKY);
}

function tool() {
	DROOKY.Editor.load(DROOKY.Editor.Commands['Tool'],arguments);
	DROOKY.Editor.run();
	console.log(DROOKY);
}

function crop() {
	var onFinish = function() {
		console.log("finish")
		DROOKY.Editor.run();
	};
	DROOKY.Editor.load(DROOKY.Editor.Commands['Crop'],[canvas,onFinish]);
	console.log(DROOKY);
}

function listener(e) {
	if (DROOKY.Editor.executing) { DROOKY.Editor.executing.listener(e) };
}


window.onload = function () {
	var canvas = document.getElementById("canvas");
	canvas.addEventListener("mousedown",listener, false);
	canvas.addEventListener("mouseup",listener, false);
}

