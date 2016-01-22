﻿/* Basic ------------------------------------------------------ */
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
camera.rotation.order = "ZXY";

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xdddddd);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;

document.body.appendChild(renderer.domElement);


/* Axis ------------------------------------------------------ */
var axis = new THREE.AxisHelper(10);
scene.add(axis);


/* Grid ------------------------------------------------------ */
var grid = new THREE.GridHelper(50, 5);
var color = new THREE.Color("rgb(255,0,0)");
grid.setColors(color, 0x000000);
//scene.add(grid);


/* Plane ------------------------------------------------------ */
var planeGeometry = new THREE.PlaneGeometry(50, 50, 50);
var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xdddddd });
var plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.receiveShadow = true;
scene.add(plane);


/* Walls ------------------------------------------------------ */
var createWall = function (x, y, len, wid, rotate) {
    var cubeGeometry = new THREE.BoxGeometry(wid, len, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    cube.rotation.z = rotate / 180 * Math.PI;
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = 2;
    cube.castShadow = true;
    scene.add(cube);
};

createWall(0, 10, 20, 2, 90);
createWall(11, 7, 8, 2, 0);
createWall(4, 4, 12, 2, 90);
createWall(-11, 3, 16, 2, 0);
createWall(-3, 0, 10, 2, 0);

/* Light ------------------------------------------------------ */
var lights = {
    ambient: null,
    spot: null,
    directional: null
};

lights.ambient = new THREE.AmbientLight(0x404040);

lights.spot = new THREE.SpotLight(0xff0000);
lights.spot.castShadow = true;
lights.spot.position.set(15, 15, 2);
scene.add(lights.spot);

lights.directional = new THREE.DirectionalLight(0x00ff00, 0.5);
lights.directional.castShadow = true;
lights.directional.position.set(10, 10, 2);
scene.add(lights.directional);



/* Render ------------------------------------------------------ */
function render() {
    // camera

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();


/* Dat.GUI ------------------------------------------------------ */
var cameraControl = {
    distance: 100,
    rotateZ: 90,
    rotateX: 0
};

var datGUI = new dat.GUI();

// controller - camera
var f_camera = datGUI.addFolder('Camera');
var con_distance = f_camera.add(cameraControl, 'distance', 20, 1000);
var con_rotateZ = f_camera.add(cameraControl, 'rotateZ', 0, 360);
var con_rotateX = f_camera.add(cameraControl, 'rotateX', -90, 90);

var setCamera = function () {
    var r = cameraControl.distance;
    var a = cameraControl.rotateZ / 180 * Math.PI;
    var b = cameraControl.rotateX / 180 * Math.PI;

    camera.rotation.z = -a;
    camera.rotation.x = -b;

    camera.position.z = r * Math.cos(b);
    camera.position.x = r * Math.sin(b) * Math.sin(a);
    camera.position.y = r * Math.sin(b) * Math.cos(a);
    //camera.lookAt(scene.position);
};

con_distance.onChange(function (value) {
    setCamera();
});
con_rotateZ.onChange(function (value) {
    setCamera();
});
con_rotateX.onChange(function (value) {
    setCamera();
});

setCamera();

// controller - light ---------------------------------------------
var lightControl = {
    ambient: true,
    spot: false,
    directional: false
};

var ambientOn = false;

var f_light = datGUI.addFolder('Light');
var con_ambient = f_light.add(lightControl, 'ambient');
var con_spot = f_light.add(lightControl, 'spot');
var con_directional = f_light.add(lightControl, 'directional');

var setLight = function () {
    for (var i in lights) {
        if (i == 'ambient') {
            if (lightControl['ambient'] && !ambientOn) {
                scene.add(lights.ambient);
                ambientOn = true;
            } else if (!lightControl['ambient'] && ambientOn) {
                scene.remove(lights.ambient)
                ambientOn = false;;
            }
        } else {
            if (lightControl[i]) {
                lights[i].intensity = 1;
            } else {
                lights[i].intensity = 0;
            }
        }
    }
};

con_ambient.onChange(function (value) {
    setLight();
});

con_spot.onChange(function (value) {
    setLight();
});

con_directional.onChange(function (value) {
    setLight();
});

setLight();