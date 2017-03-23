
function Ticker() {
	this.handlers = [];
	this.contextObjs = [];
	this._lft = new Date().getTime();
	this.frameRate = 15;
	this.frameTime = 1000 / this.frameRate;
}

Ticker.prototype = {
	constructor: Ticker,
	add: function (obj, handler) {
		if (!handler instanceof Function) return;
		if (this.contextObjs.indexOf(obj) == -1 || this.handlers.indexOf(handler) == -1) {
			this.handlers.push(handler);
			this.contextObjs.push(obj);
		}
	},
	remove: function (handler) {
		var pos = this.handlers.indexOf(handler);
		if (pos >= 0) {
			this.handlers.splice(pos, 1);
			this.contextObjs.splice(pos, 1);
		}
	},
	tick: function () {
		var now = new Date().getTime();
		if ((now - this._lft) > this.frameTime) {
			this._lft = now;
			for (var i = 0; i < this.handlers.length; ++i) {
				this.handlers[i].call(this.contextObjs[i]);
			}
		}
	}

};
Ticker.instance = new Ticker();

//Implement Popout class wrap around a div
function Popout() {
	this._scrX = 0;
	this._scrY = 0;
	this._$ = $(this);
}

Popout.prototype = {
	constructor: Popout,
	setPosition: function (x, y) {
		this._scrX = x;
		this._scrY = y;
		this.style.left = x + 'px';
		this.style.top = y + 'px';
	},
	getX: function () { return this._scrX; },
	getY: function () { return this._scrY; },
	setData: function (markerObj) {
		this._$.find('img')[0].src = markerObj.image;
		this._$.find('.name-tag')[0].innerHTML = markerObj.name;
		this._$.find('.role-tag')[0].innerHTML = markerObj.role;

	},
	show: function (time) {
		if (this.style.display != 'block') this._$.stop().show(time);
	},
	hide: function (time) {
		this._$.stop().hide(time);
	}
};

Popout.extend = function (divEl) {
	$.extend(divEl, Popout.prototype);
	Popout.apply(divEl);
	return divEl;
};

function BaseMarker() {
	this._scrX = 0;
	this._scrY = 0;
	this._live = true;
}

BaseMarker.prototype = {
	constructor: BaseMarker,
	setPosition: function (x, y) {
		this._scrX = x;
		this._scrY = y;
		this.style.left = x + 'px';
		this.style.top = y + 'px';
	},
	getX: function () { return this._scrX; },
	getY: function () { return this._scrY; },
	visible: function (value) {
		var isVisible = (this.style.display != 'none');
		if (value === undefined) {
			return isVisible;
		} else {
			if (value != isVisible) {
				this.style.display = (value) ? 'block' : 'none';
			}
			return value;
		}
	},
	activate: function () {
		this._live = true;
	},
	deactivate: function () {
		this._live = false;
	}
};

function NavMarker(index, initObj) {
	BaseMarker.call(this);
	this.className = 'navigate-point';
	this.id = 'navmarker' + index;
	this.position = new THREE.Vector3(initObj.x, initObj.y, initObj.z);
	this.target = initObj.target;

	this.unitVector = new THREE.Vector3(initObj.x, initObj.y, initObj.z).normalize();

	this._bgX = 0;
	Ticker.instance.add(this, this._animateBackground);
}

NavMarker.prototype = new BaseMarker();
NavMarker.prototype.constructor = NavMarker;
NavMarker.prototype._animateBackground = function () {
	if (!this.visible()) return;
	this.style.backgroundPosition = this._bgX + 'px 0px';
	this._bgX += 80;
	if (this._bgX >= 1120) this._bgX = 0;
};

//factory function to create a PosMarker extends a Div element
NavMarker.create = function (index, initObj) {
	var element = document.createElement('div');
	$.extend(element, NavMarker.prototype);
	NavMarker.apply(element, arguments);
	return element;
};

//Implement Marker class wrap around a div
function PosMarker(index, x, y, z, personObj) {
	BaseMarker.call(this);
	this.className = 'marker';
	this.id = 'marker' + index;
	this.position = new THREE.Vector3(x, y, z);
	this.data = personObj;
	if (!personObj) alert('no personObj for marker ' + index);
	this.innerHTML = '<span class="marker-label">' + personObj.name + '</span><br/><div class="marker-symbol"></div>';

	this.addEventListener('click', this.markerClickHandler);
	this.unitVector = new THREE.Vector3(x, y, z).normalize();

	this._bgX = 0;
	Ticker.instance.add(this, this._animateBackground);
}

PosMarker.prototype = new BaseMarker();
PosMarker.prototype.constructor = PosMarker;
PosMarker.prototype._animateBackground = function () {
	if (!this.visible()) return;
	this.childNodes[2].style.backgroundPosition = this._bgX + 'px 0px';
	this._bgX += 40;
	if (this._bgX > 280) this._bgX = 0;
};
PosMarker.prototype.markerClickHandler = function (e) {
	popout.setData(this.data);
	popout.setPosition(this._scrX, this._scrY);
	popout.targetMarker = this;
	popout.show(200);
	$('#container')[0].addEventListener('mouseup', this.clickOutsideHandler);
};
PosMarker.prototype.clickOutsideHandler = function (e) {
	popout.hide(200);
	popout.targetMarker = null;
	e.currentTarget.removeEventListener('mouseup', this.clickOutsideHandler);
};
//override visible function
PosMarker.prototype.visible = function (value) {
	if (value) {
		//move register point at center of div
		this.style.marginLeft = (- this.offsetWidth / 2) + 'px';
	}
	return BaseMarker.prototype.visible.call(this, value);

};

//factory function to create a PosMarker extends a Div element
PosMarker.create = function (index, x, y, z, personObj) {
	var element = document.createElement('div');
	$.extend(element, PosMarker.prototype);
	PosMarker.apply(element, arguments);
	return element;
};

function Panorama(panoramaObj, people) {
	this.textureFile = panoramaObj.mapFile;

	this.group = new THREE.Object3D();

	var this_obj = this;
	var panoMap = THREE.ImageUtils.loadTexture(this.textureFile, undefined, function () {
		if (typeof this_obj.textureLoadCompleteCallback == 'function') {
			this_obj.textureLoadCompleteCallback.apply();
		}
		render(true);
	});

	var sphere;
	if (isWebGL) {
		sphere = new THREE.Mesh(new THREE.SphereGeometry(500, 60, 40), new THREE.MeshBasicMaterial({ map: panoMap, wireframe: false }));
	} else {
		//reduce number of poligons to improve performance
		sphere = new THREE.Mesh(new THREE.SphereGeometry(500, 60, 40), new THREE.MeshBasicMaterial({ map: panoMap, wireframe: false }));
		sphere.overdraw = true; //seamless texture
	}
	sphere.doubleSided = true;
	sphere.scale.x = -1;
	this.sphere = sphere;
	this.group.add(sphere);
	var i;
	this.markers = [];
	this.markerLen = panoramaObj.markers.length;
	for (i = 0; i < this.markerLen; ++i) {
		var markerObj = panoramaObj.markers[i];
		var marker = PosMarker.create(i, markerObj.x, markerObj.y, markerObj.z, people[markerObj.person]);

		//document.body.appendChild(marker);
		this.markers.push(marker);
	}

	this.navMarkers = [];
	for (i = 0; i < panoramaObj.navMarkers.length; ++i) {
		var navMarker = NavMarker.create(i, panoramaObj.navMarkers[i]);
		this.navMarkers.push(navMarker);
		navMarker.addEventListener('click', this.switchPanoramaHandler);
	}

	//testing 3D objects
	// var plane = new THREE.PlaneGeometry(100, 67, 2, 4);
	// var cardStringMat = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('textures/in2-logo.png', undefined, function () { render(true); }), wireframe: false });
	// cardStringMat.transparent = true;
	// this.plane3d = new THREE.Mesh(plane, cardStringMat);
	// this.plane3d.doubleSided = true;
	// this.plane3d.overdraw = true;
	// //temporary hardcode
	// if (this.textureFile.indexOf('in2_pano.jpg') > 0) {
	// 	this.plane3d.rotation.y = 30 * 3.14 / 180; //deg to rad
	// 	this.plane3d.position.set(-299.0747446024751, 10.5235985097694784, -23.53769286835167);
	// } else {
	// 	this.plane3d.rotation.y = 0 * 3.14 / 180; //deg to rad
	// 	this.plane3d.position.set(249.93231648951297, 19.359692475887403, -164.79999842665347);
	// }
	// this.group.add(this.plane3d);

	//CUBE
	/*var materials = [];
  
	for (i = 0; i < 6; i ++ ) {
	  materials.push( [ new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) ] );
  
	}
  
	this.cube = new THREE.Mesh( new THREE.CubeGeometry( 20, 30, 20, 1, 1, 1, materials ), new THREE.MeshFaceMaterial() );
	this.cube.position.y = Math.random() * -60;
	this.cube.position.z = Math.random() * 200 - 50;
	this.cube.position.x = Math.random() * 200 - 150;
	this.cube.overdraw = true;
  
	this.group.add(this.cube);*/

}

// TODO: copy global variable to inside class
Panorama.prototype = {
	constructor: Panorama,
	place: function () {
		this.group.position.x = 0;
		this.group.position.y = 0;
		this.group.position.z = 0;
		scene.add(this.group);
	},
	placeMarkers: function () {
		var i;
		for (i = 0; i < this.markerLen; ++i) {
			document.body.appendChild(this.markers[i]);
			this.markers[i].activate();
		}
		for (i = 0; i < this.navMarkers.length; ++i) {
			document.body.appendChild(this.navMarkers[i]);
			this.navMarkers[i].activate();
		}
	},
	remove: function () {
		scene.remove(this.group);
	},
	removeMarkers: function () {
		for (var i = 0; i < this.markerLen; ++i) {
			document.body.removeChild(this.markers[i]);
			this.markers[i].deactivate();
		}
		for (i = 0; i < this.navMarkers.length; ++i) {
			document.body.removeChild(this.navMarkers[i]);
			this.navMarkers[i].deactivate();
		}
	},
	switchPanoramaHandler: function (event) {
		var navMarker = event.currentTarget;
		var movePos = new THREE.Vector3(- navMarker.position.x, - navMarker.position.y, - navMarker.position.z);
		movePos.normalize();
		movePos.multiplyScalar(300);

		var targetPano = panoList[navMarker.target];
		activePano.removeMarkers();
		needRender = true;
		if (isWebGL) new TWEEN.Tween(activePano.sphere.materials[0]).to({ opacity: 0 }, 500).start();
		new TWEEN.Tween(activePano.group.position).to({
			x: movePos.x, y: movePos.y, z: movePos.z
		}, 500).onComplete(function () {
			activePano.remove();
			targetPano.place();

			activePano = targetPano; //closure scope problem with this.target
			lat = 0;
			lon = 0;
			if (isWebGL) {
				targetPano.sphere.materials[0].opacity = 0;
				new TWEEN.Tween(targetPano.sphere.materials[0]).to({ opacity: 1 }, 500).onComplete(function () {
					targetPano.placeMarkers();
					needRender = false;
				}).start();
			} else {
				targetPano.placeMarkers();
			}

		}).start();
	},
	update: function () {
		var camUnitVector = camera.target.clone().normalize();
		var i, angle, sameSide, p2D, marker;
		for (i = 0; i < this.markerLen; ++i) {
			marker = this.markers[i];
			p2D = projector.projectVector(marker.position.clone(), camera);

			p2D.x = (p2D.x + 1) / 2 * window.innerWidth;
			p2D.y = - (p2D.y - 1) / 2 * window.innerHeight;

			//my trick
			angle = Math.acos(camUnitVector.dot(marker.unitVector)) * 180 / 3.14;
			sameSide = (angle < 90);

			if (!sameSide || p2D.x < 0 || p2D.x > window.innerWidth ||
				p2D.y < 0 || p2D.y > window.innerHeight) {
				marker.visible(false);
			} else {
				marker.visible(true);
				marker.setPosition(p2D.x, p2D.y);
			}
			if (popout.targetMarker === marker) {
				marker.visible(false);
				popout.setPosition(marker.getX(), marker.getY());
			}
		}

		for (i = 0; i < this.navMarkers.length; ++i) {
			marker = this.navMarkers[i];
			p2D = projector.projectVector(marker.position.clone(), camera);

			p2D.x = (p2D.x + 1) / 2 * window.innerWidth;
			p2D.y = - (p2D.y - 1) / 2 * window.innerHeight;

			//my trick
			angle = Math.acos(camUnitVector.dot(marker.unitVector)) * 180 / 3.14;
			sameSide = (angle < 90);

			if (!sameSide || p2D.x < 0 || p2D.x > window.innerWidth ||
				p2D.y < 0 || p2D.y > window.innerHeight) {
				marker.visible(false);
			} else {
				marker.visible(true);
				marker.setPosition(p2D.x, p2D.y);
			}
		}
		//testing:
		//this.cardString.rotation.y += 0.01;
		//this.cube.rotation.y = camera.rotation.y;
	}
};

//-----------------------------------------  MAIN SCRIPT ----------------------------------

var camera, scene, renderer, projector;

var mouse = { x: 0, y: 0 }, intersected;

var fov = 50,
	texture_placeholder,
	isUserInteracting = false,
	onMouseDownMouseX = 0, onMouseDownMouseY = 0,
	lon = 0, onMouseDownLon = 0,
	lat = 0, onMouseDownLat = 0,
	phi = 0, theta = 0,
	onPointerDownPointerX,
	onPointerDownPointerY,
	onPointerDownLon,
	onPointerDownLat,
	isWebGL = false,
	needRender = false;

var container, popout, activePano, panoList;

//snow
var particles = [];
var particleImage = new Image();/*THREE.ImageUtils.loadTexture( "img/ParticleSmoke.png" );*/
particleImage.src = 'images/ParticleSmoke.png';

//testing
var targetPos = { x: 0, y: 0, z: 0 };

init();
animate();

function init() {
	container = document.getElementById('container');

	camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1100);

	camera.target = new THREE.Vector3(0, 0, 0);

	scene = new THREE.Scene();

	projector = new THREE.Projector();

	var rendererInfo = document.getElementById('renderer-info');

	if (!Detector.canvas) {
		document.getElementById('loading-box').innerHTML = 'Your browser doesn\'t support <br/>HTML5 Canvas.';
	}

	//if (false) {
	if (Detector.webgl) {
		renderer = new THREE.WebGLRenderer();
		rendererInfo.innerHTML = "WebGL Renderer (Fast)";
		isWebGL = true;
	} else {
		renderer = new THREE.CanvasRenderer();
		rendererInfo.innerHTML = "2D Canvas Renderer (Slow)";
	}
	renderer.setSize(window.innerWidth, window.innerHeight);


	var snowTexture = new THREE.Texture(particleImage);
	var snowMat = new THREE.ParticleBasicMaterial({ map: snowTexture });

	var pCount = (isWebGL) ? 500 : 100
	pCount = 500;
	for (var j = 0; j < pCount; j++) {

		if (isWebGL) {
			particle = new Particle3DWebGL(THREE.ImageUtils.loadTexture("images/ParticleSmoke.png"));
		} else {
			particle = new Particle3DCanvas(snowMat);
		}
		particle.position.x = Math.random() * 700 - 350;
		particle.position.y = Math.random() * 700 - 350;
		particle.position.z = Math.random() * 700 - 350;
		particle.scale.x = particle.scale.y = 0.5;
		// particle.uvScale.set( 0.5, 0.5 );
		// particle.uvOffset.set( -0.5, -0.5 );

		scene.add(particle);

		particles[j] = particle;
	}

	Ticker.instance.add(this, renderSnow);

	container.appendChild(renderer.domElement);

	panoList = [];

	for (var i = 0; i < officeData.panorama.length; ++i) {
		panoList.push(new Panorama(officeData.panorama[i], officeData.people));
	}

	activePano = panoList[0];
	activePano.textureLoadCompleteCallback = panoramaReadyHandler;
	activePano.place();
	activePano.placeMarkers();

	popout = Popout.extend($('#popout').get(0));

	renderer.sortObjects = false;
	container.appendChild(renderer.domElement);

	document.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);
	document.addEventListener('mousewheel', onDocumentMouseWheel, false);
	document.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);

}

function panoramaReadyHandler() {
	$('#loading-box').hide(500);
}

function onDocumentMouseDown(event) {

	event.preventDefault();

	isUserInteracting = true;

	onPointerDownPointerX = event.clientX;
	onPointerDownPointerY = event.clientY;

	onPointerDownLon = lon;
	onPointerDownLat = lat;

}

function onDocumentMouseMove(event) {

	if (isUserInteracting) {

		lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
		lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
		needRender = true;
	}

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function onDocumentMouseUp(event) {

	isUserInteracting = false;

	var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
	projector.unprojectVector(vector, camera);

	var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());

	var intersects = ray.intersectScene(scene);
	//var intersects = ray.intersectObject(mesh );
	needRender = false;

	if (intersects.length > 0) {

	} else {

	}

}

function onDocumentMouseWheel(event) {

	// WebKit
	/* disable mouse wheel for now
	  if ( event.wheelDeltaY ) {
	
		fov -= event.wheelDeltaY * 0.05;
	
		// Opera / Explorer 9
	
	  } else if ( event.wheelDelta ) {
	
		fov -= event.wheelDelta * 0.05;
	
		// Firefox
	
	  } else if ( event.detail ) {
	
		fov += event.detail * 1.0;
	
	  }
	
	  camera.projectionMatrix = THREE.Matrix4.makePerspective( fov, window.innerWidth / window.innerHeight, 1, 1100 );
	  render();
	*/
}

function animate() {

	requestAnimationFrame(animate);
	render();
	TWEEN.update();
}

function render(forceRender) {

	lat = Math.max(- 85, Math.min(85, lat));
	phi = (90 - lat) * Math.PI / 180;
	theta = lon * Math.PI / 180;

	camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
	camera.target.y = 500 * Math.cos(phi);
	camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

	var newPos = camera.target.clone().normalize().multiplyScalar(-20);
	camera.position.set(newPos.x, newPos.y, newPos.z);

	camera.lookAt(camera.target);

	/*
	var now = new Date().getTime();
	if (now - frameTime > 120) {
	  sprite.uvOffset.x += spriteOffset;
	  if (sprite.uvOffset.x > 1.0) {
		sprite.uvOffset.x = 0.0;
	  }
	  frameTime = now;
	}
  
  
	var p2D = projector.projectVector(sprite.position.clone(), camera);
  
	p2D.x = (p2D.x + 1)/2 * window.innerWidth;
	p2D.y = - (p2D.y - 1)/2 * window.innerHeight;*/
	//$('#popout').position(p2D.x, p2D.y);
	//popout.style.left = p2D.x + 'px';
	//popout.style.top = p2D.y + 'px';

	/*
	 // distortion
	 camera.position.x = - camera.target.x;
	 camera.position.y = - camera.target.y;
	 camera.position.z = - camera.target.z;
	 //*/
	if (needRender || forceRender) renderer.render(scene, camera);
	if (activePano) {
		activePano.update();
	}
	//call ticker
	Ticker.instance.tick();
}

function renderSnow() {
	//animating snow:
	var len = particles.length
	for (var i = 0; i < len; i++) {

		var particle = particles[i];
		particle.updatePhysics();

		var pos = particle.position;
		if (pos.y < -350) pos.y += 700;
		if (pos.x > 350) pos.x -= 700;
		else if (pos.x < -350) pos.x += 700;
		if (pos.z > 350) pos.z -= 700;
		else if (pos.z < -350) pos.z += 700;
	}
	renderer.render(scene, camera);
}
