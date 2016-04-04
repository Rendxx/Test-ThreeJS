$(function () {
    var scene, camera, renderer;
    var controls, guiControls, datGUI;
    var axis, grid, color;
    var cubeGeometry, torGeometry, planeGeometry;
    var cubeMaterial, torMaterial, planeMaterial;
    var cube, torusKnot, plane;
    var spotLight, hemiLight, pointLightHelper, hemiLightHelper;
    var shadowHelper_spot, shadowHelper_direct;
    var walls = [];
    var stats;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
    var mesh = null;

    /*variables for lights*/
    var arrayOfLights;
    var ambient = 0;
    var area = 0;
    var directional = 0;
    var hemisphere = 0;
    var point = 0;
    var spot = 0;
    var light;

    function init() {
        /*creates empty scene object and renderer*/
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 5000);
        renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setClearColor(0x000000);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;

        /*add controls*/
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);

        /*adds helpers*/
        axis = new THREE.AxisHelper(10);
        scene.add(axis);

        grid = new THREE.GridHelper(50, 5);
        color = new THREE.Color("rgb(255,0,0)");
        grid.setColors(color, 0x000000);
        /*scene.add(grid);*/

        /*create plane*/
        planeGeometry = new THREE.PlaneGeometry(100, 100, 100);
        planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        plane = new THREE.Mesh(planeGeometry, planeMaterial);

        /*position and add objects to scene*/
        plane.rotation.x = -.5 * Math.PI;
        plane.receiveShadow = true;
        scene.add(plane);

        camera.position.x = 40;
        camera.position.y = 40;
        camera.position.z = 40;
        camera.lookAt(scene.position);

        guiControls = {
            rotation: 0,
            ambient: {
                ambColor: 0x555555
            },
            spot: {
                lightX: 20,
                lightY: 5,
                lightZ: 40,
                intensity: 1,
                distance: 80,
                angle: 1.570,
                exponent: 0,
                shadowCameraNear: 10,
                shadowCameraFar: 80,
                shadowCameraFov: 50,
                shadowCameraVisible: false,
                shadowMapWidth: 2056,
                shadowMapHeight: 2056,
                shadowBias: 0.00,
                shadowDarkness: 1
            }
        };

        arrayOfLights = [
            new THREE.AmbientLight(),
            new THREE.SpotLight()
        ];

        var lightTarget = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({ color: 0xff3300 }));
        scene.add(lightTarget);

        // Ambient
        arrayOfLights[0].color.setHex(guiControls.ambient.ambColor);
        scene.add(arrayOfLights[0]);

        // Spot
        arrayOfLights[1].castShadow = true;
        arrayOfLights[1].position.set(guiControls.spot.lightX, guiControls.spot.lightY, guiControls.spot.lightZ);
        arrayOfLights[1].intensity = guiControls.spot.intensity;
        arrayOfLights[1].shadowCameraNear = guiControls.spot.shadowCameraNear;
        arrayOfLights[1].shadowCameraFar = guiControls.spot.shadowCameraFar;
        arrayOfLights[1].shadowCameraVisible = guiControls.spot.shadowCameraVisible;
        arrayOfLights[1].shadowBias = guiControls.spot.shadowBias;
        arrayOfLights[1].shadowDarkness = guiControls.spot.shadowDarkness;
        scene.add(arrayOfLights[1]);


        datGUI = new dat.GUI();
        /*ambient light controls*/
        var ambFolder = datGUI.addFolder('Ambient Light');
        ambFolder.addColor(guiControls.ambient, 'ambColor').onChange(function (value) {
            arrayOfLights[0].color.setHex(value);
        });

        datGUI.add(guiControls, 'rotation', -180, 180).onChange(function (value) {
            mesh.rotation.y = value/180*Math.PI;
        });
        /*spot gui controls*/
        var shadowHelper_spot = null;
        var spotFolder = datGUI.addFolder('Spot Light');
        spotFolder.add(guiControls.spot, 'lightX', -60, 180).onChange(function (value) {
            arrayOfLights[1].position.x = value;
        });
        spotFolder.add(guiControls.spot, 'lightY', 0, 180).onChange(function (value) {
            arrayOfLights[1].position.y = value;
        });
        spotFolder.add(guiControls.spot, 'lightZ', -60, 180).onChange(function (value) {
            arrayOfLights[1].position.z = value;
        });
        spotFolder.add(guiControls.spot, 'intensity', 0.01, 5).onChange(function (value) {
            arrayOfLights[1].intensity = value;
        });
        spotFolder.add(guiControls.spot, 'distance', 0, 1000).onChange(function (value) {
            arrayOfLights[1].distance = value;
        });
        spotFolder.add(guiControls.spot, 'angle', 0.001, 1.570).onChange(function (value) {
            arrayOfLights[1].angle = value;
        });
        spotFolder.add(guiControls.spot, 'exponent', 0, 50).onChange(function (value) {
            arrayOfLights[1].exponent = value;
        });
        spotFolder.add(guiControls.spot, 'shadowCameraNear', 0, 100).name("Near").onChange(function (value) {
            arrayOfLights[1].shadow.camera.near = value;
            if (shadowHelper_spot != null) shadowHelper_spot.update();
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        spotFolder.add(guiControls.spot, 'shadowCameraFar', 0, 5000).name("Far").onChange(function (value) {
            arrayOfLights[1].shadow.camera.far = value;
            if (shadowHelper_spot != null) shadowHelper_spot.update();
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        spotFolder.add(guiControls.spot, 'shadowCameraFov', 1, 180).name("Fov").onChange(function (value) {
            arrayOfLights[1].shadow.camera.fov = value;
            if (shadowHelper_spot != null) shadowHelper_spot.update();
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        spotFolder.add(guiControls.spot, 'shadowCameraVisible').onChange(function (value) {
            if (value) {
                if (shadowHelper_spot == null) {
                    shadowHelper_spot = new THREE.CameraHelper(arrayOfLights[1].shadow.camera);
                    scene.add(shadowHelper_spot);
                }
            } else {
                if (shadowHelper_spot != null) {
                    scene.remove(shadowHelper_spot);
                    shadowHelper_spot = null;
                }
            }
            if (shadowHelper_spot != null) shadowHelper_spot.update();
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        spotFolder.add(guiControls.spot, 'shadowBias', 0, 1).onChange(function (value) {
            arrayOfLights[1].shadowBias = value;
            if (shadowHelper_spot != null) shadowHelper_spot.update();
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        spotFolder.add(guiControls.spot, 'shadowDarkness', 0, 1).onChange(function (value) {
            arrayOfLights[1].shadowDarkness = value;
            if (shadowHelper_spot != null) shadowHelper_spot.update();
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });

        $("#webGL-container").append(renderer.domElement);
        // status track
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);

        //AddBlenderMesh('table.2.json');
        //AddBlenderMesh('table.1.json');
        AddBlenderMesh2('/BlenderLoader/Door/door_wood_1_b.json');
    }

    function AddBlenderMesh(file) {
        var loader = new THREE.JSONLoader();
        loader.load(file, function (geometry, materials) {
            mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add(mesh);
        });
    }

    function AddBlenderMesh2(file) {
        var loader = new THREE.JSONLoader();
        
        loader.load(file, function (geometry, materials) {
            for (var i = 0; i < materials.length; i++) {
                materials[i].skinning = true;
            }
            mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            scene.add(mesh);
        });
    }

    function render() {
        /*necessary to make lights function*/
        //cubeMaterial.needsUpdate = true;
        //torMaterial.needsUpdate = true;
        planeMaterial.needsUpdate = true;

        arrayOfLights[1].position.x = guiControls.spot.lightX;
        arrayOfLights[1].position.y = guiControls.spot.lightY;
        arrayOfLights[1].position.z = guiControls.spot.lightZ;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
        renderer.render(scene, camera);
    }

    $(window).resize(function () {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;

        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();

        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    });

    init();
    animate();
});