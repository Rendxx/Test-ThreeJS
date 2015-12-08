/* Basic ------------------------------------------------------ */
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);

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
scene.add(grid);


/* Cube ------------------------------------------------------ */
var cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff3300 });
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

cube.position.x = 2.5;
cube.position.y = 2.5;
cube.position.z = 2.5;
cube.castShadow = true;

scene.add(cube);


/* Plane ------------------------------------------------------ */
var planeGeometry = new THREE.PlaneGeometry(30, 30, 30);
var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
var plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -.5 * Math.PI;
plane.receiveShadow = true;
scene.add(plane);


/* Spot Light ------------------------------------------------------ */
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.castShadow = true;
spotLight.position.set(15, 30, 50);
scene.add(spotLight);


/* Camera ------------------------------------------------------ */
camera.position.x = 40;
camera.position.y = 40;
camera.position.z = 40;
camera.lookAt(scene.position);


/* Render ------------------------------------------------------ */
function render() {
    requestAnimationFrame(render);
    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;
    renderer.render(scene, camera);
}
//render();
renderer.render(scene, camera);