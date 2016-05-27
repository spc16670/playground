

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
	console.log(DROOKY);
}

function tool() {
	DROOKY.Editor.load(DROOKY.Editor.Commands['Tool'],arguments);
	console.log(DROOKY);
}

function crop() {
	var canvas = document.getElementById("canvas");
	DROOKY.Editor.load(DROOKY.Editor.Commands['Crop'],[canvas]);
	console.log(DROOKY);
}


