

var module = angular.module('controller.Show',[]);

module.controller('ShowController',['$scope',function($scope){
	$scope.show = true;
}]);

var module = angular.module('directive.Renderer',[]);

module.directive('renderer',[function(){
	 return {
		restrict: 'AE'
		,link: function (scope, element, atts, controller) {


			scope.getBitmap = function (index) {
				function drawCircle(x,y,r,context) {
				    context.beginPath();
				    context.arc(x,y,r,0,Math.PI*2,true);
				    context.closePath();
				    context.fill();
				}
				function getRandomColor() {
				    // creating a random number between 0 and 255
				    var r = Math.floor(Math.random()*256);
				    var g = Math.floor(Math.random()*256);
				    var b = Math.floor(Math.random()*256);
				     
				    // going from decimal to hex
				    var hexR = r.toString(16);
				    var hexG = g.toString(16);
				    var hexB = b.toString(16);
				     
				    // making sure single character values are prepended with a "0"
				    if (hexR.length == 1) hexR = "0" + hexR;
				    if (hexG.length == 1) hexG = "0" + hexG;
				    if (hexB.length == 1) hexB = "0" + hexB;
				    
				    // creating the hex value by concatenatening the string values
				    var hexColor = "#" + hexR + hexG + hexB;
				    return hexColor.toUpperCase();
				} 
				var theCanvas=document.getElementById("myCanvas");
				var canvasContext=theCanvas.getContext("2d");
				for(var i=0; i<500; i++) {
				    canvasContext.fillStyle=getRandomColor();
				    drawCircle(Math.random()*theCanvas.width,
				               Math.random()*theCanvas.height,
				               Math.random()*40+10,
				               canvasContext);
				}
				return canvasContext.canvas.toDataURL();
			}
							
			if (DROOK.THREE) {

				var size = { x: 500, y: 400 };

				var state = { 
					scene : null 
					, camera : null
					, renderer : null
					, mesh : null
					, controls : null
					, animRef : null
				}; 				
				
				function init() {
					state.scene = new THREE.Scene();

					state.camera = new THREE.PerspectiveCamera( 75, size.x / size.y , 1, 10000 );
					state.camera.position.z = 1000;

					var geometry = new THREE.BoxGeometry( 200, 200, 200 );

					var materials = [];
					for (var i=0;i<6;i++) {
						materials.push(new THREE.MeshBasicMaterial( { color: 0xd3d3d3, overdraw : true } ));
					}
					var material = new THREE.MeshFaceMaterial(materials);

					state.mesh = new THREE.Mesh( geometry, material );
					state.scene.add( state.mesh );

					state.renderer = new THREE.WebGLRenderer( { alpha: true } );
					state.renderer.setClearColor( 0x000000, 0 );
					state.renderer.setSize( size.x, size.y );

					element[0].addEventListener("mouseenter",function() { scope.toggleMenu(true); });
					element[0].addEventListener("mouseleave",function() { scope.toggleMenu(false); });
					element[0].appendChild( state.renderer.domElement );

					var menuDiv = document.createElement("div");
					menuDiv.name = "rendererMenu";
					menuDiv.innerHTML = "asdf";
					menuDiv.className = "renderer-menu renderer-menu-hidden";
					element[0].appendChild( menuDiv );
					
					
					for (var i=0;i<state.mesh.material.materials.length;i++) {

						scope.getBitmap(i);
						var image = new Image();
						var texture = new THREE.Texture(image);
						state.mesh.material.materials[i].map = texture;
						image.onload = function() {
							for (var j=0;j<state.mesh.material.materials.length;j++) {
								state.mesh.material.materials[j].map.needsUpdate = true
							}
						} 
						image.src = scope.getBitmap();

					}

				}

				function animate() {

					state.animRef = requestAnimationFrame( animate );

					state.mesh.rotation.x += 0.01;
					state.mesh.rotation.y += 0.02;

					state.renderer.render( state.scene, state.camera );

				}
				init();
				animate();

			}
			

			scope.toggleMenu = function(onOff) {
				var htmlDiv = element[0].querySelector(".renderer-menu");
				var el = angular.element(htmlDiv);
				onOff ? el.removeClass("renderer-menu-hidden") : el.addClass("renderer-menu-hidden");
			}


			scope.$on('$destroy', function() {
				function empty(elem) {
				    while (elem.lastChild) elem.removeChild(elem.lastChild);
				}

				cancelAnimationFrame( state.animRef );
				state.scene.remove(state.mesh);

				for (var j=0;j<state.mesh.material.materials.length;j++) {
					state.mesh.material.materials[j].map.dispose();
				}
				state.mesh.geometry.dispose();
				state.mesh = null;
				state.scene = null;
				state.renderer = null;
				state.camera = null;
				state.controls = null;
				state = null;
				empty(element[0]);

				console.log("destroy");
			});

		}
	}
}]);



var app = angular.module('DrookApp', [
	'directive.Renderer'
	,'controller.Show'
]);