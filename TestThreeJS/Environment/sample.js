﻿/* Basic ------------------------------------------------------ */
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
camera.rotation.order = "XYZ";

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

/* Spot Light ------------------------------------------------------ */
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.castShadow = true;
spotLight.position.set(15, 30, 50);
scene.add(spotLight);


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
var con_rotateZ = f_camera.add(cameraControl, 'rotateZ', -90, 90);
var con_rotateX = f_camera.add(cameraControl, 'rotateX', -90, 90);

var setCamera = function () {
    camera.position.z = 100;
    camera.position.x = cameraControl.rotateZ;
    camera.position.y = cameraControl.rotateX;
    camera.lookAt(scene.position);
    return;


    var r = cameraControl.distance;
    var a = cameraControl.rotateZ / 180 * Math.PI;
    var b = cameraControl.rotateX / 180 * Math.PI;

    camera.position.z = r * Math.cos(b);
    camera.position.x = r * Math.sin(b) * Math.sin(a);
    camera.position.y = r * Math.sin(b) * Math.cos(a);

    camera.lookAt(scene.position);
    console.log(camera.position);
    //camera.rotation.x = -b;
    //camera.rotation.z = -a;
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