$(function () {
    var scene, camera, renderer;
    var controls, guiControls, datGUI;
    var axis, grid, light;
    var stats;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
    var mesh, walls;
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

        //add some fog
        scene.fog = new THREE.Fog(0xffff90, .01, 500);

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

        /*add wall*/
        walls = [];
        var createWall = function (z, x, len, wid, rotate, deep) {
            var cubeGeometry = new THREE.BoxGeometry(len, deep || 6, wid);
            var cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xbb44bb });
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

            cube.rotation.y = rotate / 180 * Math.PI;
            cube.position.x = x;
            cube.position.y = 2;
            cube.position.z = z
            cube.castShadow = true;
            cube.receiveShadow = true;
            scene.add(cube);

            walls.push(cube);
        }
        createWall(0, 10, 20, 2, 90);
        createWall(11, 7, 8, 2, 0);
        createWall(4, 4, 12, 2, 90);
        createWall(-11, 3, 16, 2, 0);
        createWall(-3, 0, 10, 2, 0);

        camera.position.x = 40;
        camera.position.y = 40;
        camera.position.z = 40;
        camera.lookAt(scene.position);
        
        guiControls = {
            ambient: {
                ambColor: 0x000000
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
                shadowDarkness: 0.9
            },
            spot2: {
                lightX: -20,
                lightY: 5,
                lightZ: -40,
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
                shadowDarkness: 0.9
            }
        };

        arrayOfLights = [
            new THREE.AmbientLight(),
            new THREE.SpotLight(),
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
        // Spot2
        arrayOfLights[2].castShadow = true;
        arrayOfLights[2].position.set(guiControls.spot.lightX, guiControls.spot.lightY, guiControls.spot.lightZ);
        arrayOfLights[2].intensity = guiControls.spot.intensity;
        arrayOfLights[2].shadowCameraNear = guiControls.spot.shadowCameraNear;
        arrayOfLights[2].shadowCameraFar = guiControls.spot.shadowCameraFar;
        arrayOfLights[2].shadowCameraVisible = guiControls.spot.shadowCameraVisible;
        arrayOfLights[2].shadowBias = guiControls.spot.shadowBias;
        arrayOfLights[2].shadowDarkness = guiControls.spot.shadowDarkness;
        scene.add(arrayOfLights[2]);


        datGUI = new dat.GUI();
        /*ambient light controls*/
        var ambFolder = datGUI.addFolder('Ambient Light');
        ambFolder.addColor(guiControls.ambient, 'ambColor').onChange(function (value) {
            arrayOfLights[0].color.setHex(value);
        });

        /*spot gui controls*/
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
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        spotFolder.add(guiControls.spot, 'shadowCameraFar', 0, 5000).name("Far").onChange(function (value) {
            arrayOfLights[1].shadow.camera.far = value;
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        spotFolder.add(guiControls.spot, 'shadowCameraFov', 1, 180).name("Fov").onChange(function (value) {
            arrayOfLights[1].shadow.camera.fov = value;
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        spotFolder.add(guiControls.spot, 'shadowBias', 0, 1).onChange(function (value) {
            arrayOfLights[1].shadowBias = value;
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        spotFolder.add(guiControls.spot, 'shadowDarkness', 0, 1).onChange(function (value) {
            arrayOfLights[1].shadowDarkness = value;
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });

        /*spot2 gui controls*/
        var spotFolder2 = datGUI.addFolder('spot2 Light 2');
        spotFolder2.add(guiControls.spot2, 'lightX', -60, 180).onChange(function (value) {
            arrayOfLights[2].position.x = value;
        });
        spotFolder2.add(guiControls.spot2, 'lightY', 0, 180).onChange(function (value) {
            arrayOfLights[2].position.y = value;
        });
        spotFolder2.add(guiControls.spot2, 'lightZ', -60, 180).onChange(function (value) {
            arrayOfLights[2].position.z = value;
        });
        spotFolder2.add(guiControls.spot2, 'intensity', 0.01, 5).onChange(function (value) {
            arrayOfLights[2].intensity = value;
        });
        spotFolder2.add(guiControls.spot2, 'distance', 0, 1000).onChange(function (value) {
            arrayOfLights[2].distance = value;
        });
        spotFolder2.add(guiControls.spot2, 'angle', 0.001, 1.570).onChange(function (value) {
            arrayOfLights[2].angle = value;
        });
        spotFolder2.add(guiControls.spot2, 'exponent', 0, 50).onChange(function (value) {
            arrayOfLights[2].exponent = value;
        });
        spotFolder2.add(guiControls.spot2, 'shadowCameraNear', 0, 100).name("Near").onChange(function (value) {
            arrayOfLights[2].shadow.camera.near = value;
            arrayOfLights[2].shadow.camera.updateProjectionMatrix();
        });
        spotFolder2.add(guiControls.spot2, 'shadowCameraFar', 0, 5000).name("Far").onChange(function (value) {
            arrayOfLights[2].shadow.camera.far = value;
            arrayOfLights[2].shadow.camera.updateProjectionMatrix();
        });
        spotFolder2.add(guiControls.spot2, 'shadowCameraFov', 1, 180).name("Fov").onChange(function (value) {
            arrayOfLights[2].shadow.camera.fov = value;
            arrayOfLights[2].shadow.camera.updateProjectionMatrix();
        });
        spotFolder2.add(guiControls.spot2, 'shadowBias', 0, 1).onChange(function (value) {
            arrayOfLights[2].shadowBias = value;
            arrayOfLights[2].shadow.camera.updateProjectionMatrix();
        });
        spotFolder2.add(guiControls.spot2, 'shadowDarkness', 0, 1).onChange(function (value) {
            arrayOfLights[2].shadowDarkness = value;
            arrayOfLights[2].shadow.camera.updateProjectionMatrix();
        });
        $("#webGL-container").append(renderer.domElement);
        // status track
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);

        AddBlenderMesh('animationTest.json');
    }

    function AddBlenderMesh(file) {
        var loader = new THREE.JSONLoader();
        loader.load(file, function (geometry, materials) {
            for (var i = 0; i < materials.length; i++) {
                materials[i].skinning = true;
            }
            mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.skeleton.bones[0].rotation.x = Math.PI/2;

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

        arrayOfLights[2].position.x = guiControls.spot2.lightX;
        arrayOfLights[2].position.y = guiControls.spot2.lightY;
        arrayOfLights[2].position.z = guiControls.spot2.lightZ;
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

