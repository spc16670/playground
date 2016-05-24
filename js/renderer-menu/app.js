

var module = angular.module('controller.Show',[
	'services.Util'
]);

module.controller('ShowController',['$scope',function($scope){
	$scope.show = true;
}]);

var module = angular.module('directive.Renderer',[]);

module.directive('renderer',['UtilService','$http','$templateCache','$compile',function(UtilService,$http,$templateCache,$compile){
	 return {
		restrict: 'A'
		,template: "<div class=\"renderer-menu renderer-menu-slide-out\"></div>"
		,link: function (scope, element, atts, controller) {
					
			var size = { x: element[0].clientWidth, y: 400 };
			console.log(size);
			var STATE = { 
				scene : null 
				, camera : null
				, renderer : null
				, mesh : null
				, controls : null
				, animRef : null
			}; 				
			
			function init() {
			
				$http.get(atts.menuTemplate, {cache: $templateCache}).success(function(html) {
					var linkFn = $compile(html);
					var content = linkFn(scope);
					var htmlDiv = element[0].querySelector(".renderer-menu");
					var el = angular.element(htmlDiv);
					el.append(content);
				})

			
				STATE.scene = new THREE.Scene();

				STATE.camera = new THREE.PerspectiveCamera( 75, size.x / size.y , 1, 10000 );
				STATE.camera.position.z = 1000;

				var geometry = new THREE.BoxGeometry( 200, 200, 200 );

				var materials = [];
				for (var i=0;i<6;i++) {
					materials.push(new THREE.MeshBasicMaterial( { color: 0xd3d3d3, overdraw : true } ));
				}
				var material = new THREE.MeshFaceMaterial(materials);

				STATE.mesh = new THREE.Mesh( geometry, material );
				STATE.scene.add( STATE.mesh );

				STATE.renderer = new THREE.WebGLRenderer( { alpha: true } );
				STATE.renderer.setClearColor( 0x000000, 0 );
				STATE.renderer.setSize( size.x, size.y );
				
				element[0].addEventListener("mouseenter",function() { scope.toggleMenu(true); });
				element[0].addEventListener("mouseleave",function() { scope.toggleMenu(false); });
				
				STATE.renderer.domElement.style.border = "1px solid black";
				
				element[0].style.overflow = "hidden";
				element[0].style.margin = "0px";
				element[0].style.padding = "0px";
				element[0].appendChild( STATE.renderer.domElement );
				
				for (var i=0;i<STATE.mesh.material.materials.length;i++) {
					var image = new Image();
					var texture = new THREE.Texture(image);
					STATE.mesh.material.materials[i].map = texture;
					image.onload = function() {
						for (var j=0;j<STATE.mesh.material.materials.length;j++) {
							STATE.mesh.material.materials[j].map.needsUpdate = true
						}
					} 
					image.src = UtilService.getBitmap();
				}

			}

			function animate() {
				STATE.animRef = requestAnimationFrame( animate );
				STATE.mesh.rotation.x += 0.01;
				STATE.mesh.rotation.y += 0.02;
				STATE.renderer.render( STATE.scene, STATE.camera );
			}
			init();
			animate();


			scope.menu = { scale : { value : 2 }, rotate : { selected : false } };
			scope.$watch( function() { return scope.menu.scale.value },function(){
				console.log(scope.menu.scale.value);
			},true);
			scope.$watch( function() { return scope.menu.rotate.selected } ,function(){
				console.log(scope.menu.rotate.selected);
			},true);
			
			scope.toggleMenu = function(on) {
				var htmlDiv = element[0].querySelector(".renderer-menu");
				var el = angular.element(htmlDiv);

				if (on) {
					el.removeClass("renderer-menu-slide-out"); 
					var top = (el[0].top = size.y - el[0].clientHeight) + "px";
					el.css({ top: top });
					el.addClass("renderer-menu-slide-in");
				} else {
					var menuHandleDiv = element[0].querySelector(".renderer-menu-handle");
					var menuHandleDivEl = angular.element(menuHandleDiv);
					var top = (el[0].top = (size.y - 10) - menuHandleDivEl[0].clientHeight) + "px";
					el.css({ top: top });
					el.addClass("renderer-menu-slide-out");
					el.removeClass("renderer-menu-slide-in"); 
				}
			}

			scope.$on('$destroy', function() {
				function empty(elem) {
				    while (elem.lastChild) elem.removeChild(elem.lastChild);
				}

				cancelAnimationFrame( STATE.animRef );
				STATE.scene.remove(STATE.mesh);

				for (var j=0;j<STATE.mesh.material.materials.length;j++) {
					STATE.mesh.material.materials[j].map.dispose();
				}
				STATE.mesh.geometry.dispose();
				STATE.mesh = null;
				STATE.scene = null;
				STATE.renderer = null;
				STATE.camera = null;
				STATE.controls = null;
				STATE = null;
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