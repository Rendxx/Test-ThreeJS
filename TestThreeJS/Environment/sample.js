/* Basic ------------------------------------------------------ */
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
var planeGeometry = new THREE.PlaneGeometry(50, 50);
var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xdddddd });
var plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.receiveShadow = true;
scene.add(plane);


/* Walls ------------------------------------------------------ */
var createWall = function (x, y, len, wid, rotate) {
    var cubeGeometry = new THREE.BoxGeometry(wid, len, 6);
    var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    cube.rotation.z = rotate / 180 * Math.PI;
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = 2;
    cube.castShadow = true;
    cube.receiveShadow = true;
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
    directional: null,
    hemisphere: null,
    point: null
};

// ambient
lights.ambient = new THREE.AmbientLight(0x404040);

// spot
lights.spot = new THREE.SpotLight(0xff0000);
lights.spot.castShadow = true;
lights.spot.position.set(6, 8, 2);
scene.add(lights.spot);

var spot_Geometry = new THREE.BoxGeometry(1, 1, 1);
var spot_Material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
var obj_spot = new THREE.Mesh(spot_Geometry, spot_Material);
obj_spot.position.set(6, 8, 2);
scene.add(obj_spot);

// directional
lights.directional = new THREE.DirectionalLight(0x00ff00, 0.5);
lights.directional.castShadow = true;
lights.directional.position.set(50, 50, 10);
scene.add(lights.directional);

// hemisphere
lights.hemisphere = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(lights.hemisphere);

// point
lights.point = new THREE.PointLight(0x0000ff, 1, 15);
lights.point.castShadow = true;
lights.point.position.set(-3, 7, 2);
scene.add(lights.point);

var point_Geometry = new THREE.BoxGeometry(1, 1, 1);
var point_Material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
var obj_point = new THREE.Mesh(point_Geometry, point_Material);
obj_point.position.set(-3, 7, 2);
scene.add(obj_point);

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
    directional: false,
    hemisphere:false,
    point: false
};

var ambientOn = false;

var f_light = datGUI.addFolder('Light');
var con_ambient = f_light.add(lightControl, 'ambient');
var con_spot = f_light.add(lightControl, 'spot');
var con_directional = f_light.add(lightControl, 'directional');
var con_hemisphere = f_light.add(lightControl, 'hemisphere');
var con_point = f_light.add(lightControl, 'point');

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
                lights[i].intensity = 5;
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

con_hemisphere.onChange(function (value) {
    setLight();
});

con_point.onChange(function (value) {
    setLight();
});

setLight();


// controller - light - move ---------------------------------------------
var lightMove = {
    x: 0,
    y: 0
};

var datGUI = new dat.GUI();

// controller - camera
var f_lightmove = datGUI.addFolder('Light Move');
var con_moveX = f_lightmove.add(lightMove, 'x', -50, 50);
var con_moveY = f_lightmove.add(lightMove, 'y', -50, 50);

var setLightPos = function () {
    obj_spot.position.set(lightMove.x, lightMove.y, 2);
    lights.spot.position.set(lightMove.x, lightMove.y, 2);
    //camera.lookAt(scene.position);
};

con_moveX.onChange(function (value) {
    setLightPos();
});
con_moveY.onChange(function (value) {
    setLightPos();
});

setLightPos();