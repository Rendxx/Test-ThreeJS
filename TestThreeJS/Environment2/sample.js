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

        renderer.setClearColor(0xeeeeee);
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

        /*create cube*/
        cubeGeometry = new THREE.BoxGeometry(1, 2, 3);
        cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff3300 });
        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        /*create torus knot*/
        torGeometry = new THREE.TorusKnotGeometry(3, 1, 64, 64);
        torMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
        torusKnot = new THREE.Mesh(torGeometry, torMaterial);

        /*create plane*/
        planeGeometry = new THREE.PlaneGeometry(100, 100, 100);
        planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        plane = new THREE.Mesh(planeGeometry, planeMaterial);

        /*add wall*/
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

        /*position and add objects to scene*/
        plane.rotation.x = -.5 * Math.PI;
        plane.receiveShadow = true;
        scene.add(plane);

        cube.position.x = 2.5;
        cube.position.y = 4;
        cube.position.z = 2.5;
        cube.castShadow = true;
        scene.add(cube);

        torusKnot.position.x = -15;
        torusKnot.position.y = 6;
        torusKnot.position.z = 2.5;
        torusKnot.castShadow = true;
        scene.add(torusKnot);

        camera.position.x = 40;
        camera.position.y = 40;
        camera.position.z = 40;
        camera.lookAt(scene.position);

        /*scene lights*/
        arrayOfLights = [
            new THREE.AmbientLight(),
            new THREE.DirectionalLight(),
            new THREE.PointLight(),
            new THREE.SpotLight()
        ];

        /*datGUI controls object*/
        guiControls = new function () {
            this.rotationX = 0.0;
            this.rotationY = 0.0;
            this.rotationZ = 0.0;

            /*adds light*/
            this.lightSelector = 0;
            this.addLight = function () {
                addLight();
            };
            this.deleteLight = function () {
                deleteLight();
            };

            /*ambient light values*/
            this.ambColor = 0xdddddd;

            /*directional light values*/
            this.dirColor = 0xffffff;
            this.lightXD = 20;
            this.lightYD = 35;
            this.lightZD = 40;
            this.intensityD = 1;
            this.shadowCameraNearD = 0;
            this.shadowCameraFarD = 75;
            this.shadowLeft = -5;
            this.shadowRight = 5;
            this.shadowTop = 5;
            this.shadowBottom = -5;
            this.shadowCameraVisibleD = false;
            this.shadowMapWidthD = 2056;
            this.shadowMapHeightD = 2056;
            this.shadowBiasD = 0.00;
            this.shadowDarknessD = 0.5;
            this.targetD = cube;

            /*hemisphere light parameters*/
            this.skyColor = 0x140404;
            this.groundColorH = 0x140404;
            this.intensityH = 1;

            /*point light parameters*/
            this.colorP = 0x00ff39;
            this.intensityP = 1;
            this.distanceP = 0;
            this.lightXP = 20;
            this.lightYP = 35;
            this.lightZP = 40;

            /*spot light values*/
            this.lightX = 20;
            this.lightY = 35;
            this.lightZ = 40;
            this.intensity = 1;
            this.distance = 0;
            this.angle = 1.570;
            this.exponent = 0;
            this.shadowCameraNear = 10;
            this.shadowCameraFar = 100;
            this.shadowCameraFov = 50;
            this.shadowCameraVisible = false;
            this.shadowMapWidth = 2056;
            this.shadowMapHeight = 2056;
            this.shadowBias = 0.00;
            this.shadowDarkness = 0.5;
            this.target = cube;
        }

        /*ambient light parameters*/
        arrayOfLights[0].color.setHex(guiControls.ambColor);
        console.log(scene);

        /*directional light parameters*/
        arrayOfLights[1].color.setHex(guiControls.dirColor);
        arrayOfLights[1].castShadow = true;
        arrayOfLights[1].position.set(20, 35, 40);
        arrayOfLights[1].intensity = guiControls.intensityD;
        arrayOfLights[1].distance = guiControls.distanceD;
        arrayOfLights[1].angle = guiControls.angleD;
        arrayOfLights[1].exponent = guiControls.exponentD;
        arrayOfLights[1].shadowCameraNear = guiControls.shadowCameraNearD;
        arrayOfLights[1].shadowCameraFar = guiControls.shadowCameraFarD;
        arrayOfLights[1].shadowCameraFov = guiControls.shadowCameraFovD;
        arrayOfLights[1].shadowCameraLeft = guiControls.shadowLeft;
        arrayOfLights[1].shadowCameraRight = guiControls.shadowRight;
        arrayOfLights[1].shadowCameraTop = guiControls.shadowTop;
        arrayOfLights[1].shadowCameraBottom = guiControls.shadowBottom;
        arrayOfLights[1].shadowCameraVisible = guiControls.shadowCameraVisibleD;
        arrayOfLights[1].shadowBias = guiControls.shadowBiasD;
        arrayOfLights[1].shadowDarkness = guiControls.shadowDarknessD;
        arrayOfLights[1].shadowMapWidth = 4096;
        arrayOfLights[1].shadowMapHeight = 4096;

        /*point light parameters*/
        arrayOfLights[2].color.setHex(guiControls.colorP);
        arrayOfLights[2].intensity = guiControls.intensityP;
        arrayOfLights[2].distance = guiControls.distanceP;
        arrayOfLights[2].position.set(guiControls.lightXP, guiControls.lightYP, guiControls.lightZP);

        /*spot light parameters*/
        arrayOfLights[3].castShadow = true;
        arrayOfLights[3].position.set(20, 35, 40);
        arrayOfLights[3].intensity = guiControls.intensity;
        arrayOfLights[3].shadowCameraNear = guiControls.shadowCameraNear;
        arrayOfLights[3].shadowCameraFar = guiControls.shadowCameraFar;
        arrayOfLights[3].shadowCameraVisible = guiControls.shadowCameraVisible;
        arrayOfLights[3].shadowBias = guiControls.shadowBias;
        arrayOfLights[3].shadowDarkness = guiControls.shadowDarkness;

        /*adds controls to scene*/
        datGUI = new dat.GUI();

        /*light selection controls*/
        datGUI.add(guiControls, 'lightSelector', { 'Ambient': 0, 'Directional': 1, 'Point': 2, 'Spot': 3, 'Hemisphere': 4 }).name('Light Selection');
        datGUI.add(guiControls, 'addLight').name('Add a Light');
        datGUI.add(guiControls, 'deleteLight').name('Delete a Light');

        /*cube controls*/
        var geoFolder = datGUI.addFolder('Cube');
        geoFolder.add(guiControls, 'rotationX', 0, 1);
        geoFolder.add(guiControls, 'rotationY', 0, 1);
        geoFolder.add(guiControls, 'rotationZ', 0, 1);

        /*ambient light controls*/
        var ambFolder = datGUI.addFolder('Ambient Light');
        ambFolder.addColor(guiControls, 'ambColor').onChange(function (value) {
            arrayOfLights[0].color.setHex(value);
        });

        /*Directional gui controls*/
        var directFolder = datGUI.addFolder('Directional Light');
        directFolder.addColor(guiControls, 'dirColor').onChange(function (value) {
            arrayOfLights[1].color.setHex(value);
        });
        directFolder.add(guiControls, 'lightXD', -60, 180);
        directFolder.add(guiControls, 'lightYD', 0, 180);
        directFolder.add(guiControls, 'lightZD', -60, 180);
        directFolder.add(guiControls, 'target', ['cube', 'torusKnot']).onChange(function () {
            if (guiControls.target == 'cube') {
                arrayOfLights[1].target = cube;
            }
            else if (guiControls.target == 'torusKnot') {
                arrayOfLights[1].target = torusKnot;
            }
        });
        directFolder.add(guiControls, 'intensityD', 0.01, 5).onChange(function (value) {
            arrayOfLights[1].intensity = value;
        });
        directFolder.add(guiControls, 'shadowCameraNearD', 0, 100).name("Near").onChange(function (value) {
            arrayOfLights[1].shadow.camera.near = value;
            if (shadowHelper_direct != null) shadowHelper_direct.update();
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        directFolder.add(guiControls, 'shadowLeft', -30, 30).name("Left").onChange(function (value) {
            arrayOfLights[1].shadow.camera.left = value;
            if (shadowHelper_direct != null) shadowHelper_direct.update();
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        directFolder.add(guiControls, 'shadowRight', -30, 30).name("Right").onChange(function (value) {
            arrayOfLights[1].shadow.camera.right = value;
            if (shadowHelper_direct != null) shadowHelper_direct.update();
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        directFolder.add(guiControls, 'shadowTop', -30, 30).name("Top").onChange(function (value) {
            arrayOfLights[1].shadow.camera.top = value;
            if (shadowHelper_direct != null) shadowHelper_direct.update();
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        directFolder.add(guiControls, 'shadowBottom', -30, 30).name("Bottom").onChange(function (value) {
            arrayOfLights[1].shadow.camera.bottom = value;
            if (shadowHelper_direct != null) shadowHelper_direct.update();
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        directFolder.add(guiControls, 'shadowCameraFarD', 0, 100).name("Far").onChange(function (value) {
            arrayOfLights[1].shadow.camera.far = value;
            if (shadowHelper_direct != null) shadowHelper_direct.update();
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        directFolder.add(guiControls, 'shadowCameraVisibleD').onChange(function (value) {
            
            if (value) {
                if (shadowHelper_direct == null) {
                    shadowHelper_direct = new THREE.CameraHelper(arrayOfLights[1].shadow.camera);
                    scene.add(shadowHelper_direct);
                }
            } else {
                if (shadowHelper_direct != null) {
                    scene.remove(shadowHelper_direct);
                    shadowHelper_direct = null;
                }
            }
            if (shadowHelper_direct != null) shadowHelper_direct.update();
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        directFolder.add(guiControls, 'shadowBiasD', 0, 1).onChange(function (value) {
            arrayOfLights[1].shadowBias = value;
            if (shadowHelper_direct != null) shadowHelper_direct.update();
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        directFolder.add(guiControls, 'shadowDarknessD', 0, 1).onChange(function (value) {
            arrayOfLights[1].shadowDarkness = value;
            if (shadowHelper_direct != null) shadowHelper_direct.update();
            arrayOfLights[1].shadow.camera.updateProjectionMatrix();
        });
        directFolder.close();

        /*Hemisphere gui controls*/
        var hemiFolder = datGUI.addFolder('Hemisphere Light');
        hemiFolder.addColor(guiControls, 'groundColorH').onChange(function (value) {
            hemiLight.groundColor.setHex(value);
        });
        hemiFolder.addColor(guiControls, 'skyColor').onChange(function (value) {
            hemiLight.color.setHex(value);
        });
        hemiFolder.add(guiControls, 'intensityH', 0.01, 5).onChange(function (value) {
            hemiLight.intensity = value;
        });

        /*point gui controls*/
        var pointFolder = datGUI.addFolder('Point  Light Light');
        pointFolder.addColor(guiControls, 'colorP').onChange(function (value) {
            arrayOfLights[2].groundColor.setHex(value);
        });
        pointFolder.add(guiControls, 'intensityP', 0, 5);
        pointFolder.add(guiControls, 'distanceP', 0, 50);
        pointFolder.add(guiControls, 'lightXP', -60, 180);
        pointFolder.add(guiControls, 'lightYP', 0, 180);
        pointFolder.add(guiControls, 'lightZP', -60, 180);

        /*spot gui controls*/
        var spotFolder = datGUI.addFolder('Spot Light');
        spotFolder.add(guiControls, 'lightX', -60, 180);
        spotFolder.add(guiControls, 'lightY', 0, 180);
        spotFolder.add(guiControls, 'lightZ', -60, 180);
        spotFolder.add(guiControls, 'target', ['cube', 'torusKnot']).onChange(function () {
            if (guiControls.target == 'cube') {
                arrayOfLights[3].target = cube;
            }
            else if (guiControls.target == 'torusKnot') {
                arrayOfLights[3].target = torusKnot;
            }
        });
        spotFolder.add(guiControls, 'intensity', 0.01, 5).onChange(function (value) {
            arrayOfLights[3].intensity = value;
        });
        spotFolder.add(guiControls, 'distance', 0, 1000).onChange(function (value) {
            arrayOfLights[3].distance = value;
        });
        spotFolder.add(guiControls, 'angle', 0.001, 1.570).onChange(function (value) {
            arrayOfLights[3].angle = value;
        });
        spotFolder.add(guiControls, 'exponent', 0, 50).onChange(function (value) {
            arrayOfLights[3].penumbra = value;
        });
        spotFolder.add(guiControls, 'shadowCameraNear', 0, 100).name("Near").onChange(function (value) {
            arrayOfLights[3].shadow.camera.near = value;
            if (shadowHelper_spot != null) shadowHelper_spot.update();
            arrayOfLights[3].shadow.camera.updateProjectionMatrix();
        });
        spotFolder.add(guiControls, 'shadowCameraFar', 0, 5000).name("Far").onChange(function (value) {
            arrayOfLights[3].shadow.camera.far = value;
            if (shadowHelper_spot != null) shadowHelper_spot.update();
            arrayOfLights[3].shadow.camera.updateProjectionMatrix();
        });
        spotFolder.add(guiControls, 'shadowCameraFov', 1, 180).name("Fov").onChange(function (value) {
            arrayOfLights[3].shadow.camera.fov = value;
            if (shadowHelper_spot != null) shadowHelper_spot.update();
            arrayOfLights[3].shadow.camera.updateProjectionMatrix();
        });
        spotFolder.add(guiControls, 'shadowCameraVisible').onChange(function (value) {
            if (value) {
                if (shadowHelper_spot == null) {
                    shadowHelper_spot = new THREE.CameraHelper(arrayOfLights[3].shadow.camera);
                    scene.add(shadowHelper_spot);
                }
            } else {
                if (shadowHelper_spot != null) {
                    scene.remove(shadowHelper_spot);
                    shadowHelper_spot = null;
                }
            }
            if (shadowHelper_spot != null) shadowHelper_spot.update();
            arrayOfLights[3].shadow.camera.updateProjectionMatrix();
        });
        spotFolder.add(guiControls, 'shadowBias', 0, 1).onChange(function (value) {
            arrayOfLights[3].shadowBias = value;
            if (shadowHelper_spot != null) shadowHelper_spot.update();
            arrayOfLights[3].shadow.camera.updateProjectionMatrix();
        });
        spotFolder.add(guiControls, 'shadowDarkness', 0, 1).onChange(function (value) {
            arrayOfLights[3].shadowDarkness = value;
            if (shadowHelper_spot != null) shadowHelper_spot.update();
            arrayOfLights[3].shadow.camera.updateProjectionMatrix();
        });
        spotFolder.close();

        $("#webGL-container").append(renderer.domElement);
        /*stats*/
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);
    }

    function addLight() {
        if (guiControls.lightSelector == 0 && ambient == 0) {
            scene.add(arrayOfLights[guiControls.lightSelector]);
            ambient = 1;
        }
        else if (guiControls.lightSelector == 1 && directional == 0) {
            scene.add(arrayOfLights[guiControls.lightSelector]);
            directional = 1;
        }
        else if (guiControls.lightSelector == 2 && point == 0) {
            scene.add(arrayOfLights[guiControls.lightSelector]);
            pointLightHelper = new THREE.PointLightHelper(arrayOfLights[guiControls.lightSelector], 1);
            scene.add(pointLightHelper);
            point = 1;
        }
        else if (guiControls.lightSelector == 3 && spot == 0) {
            scene.add(arrayOfLights[guiControls.lightSelector]);
            spot = 1;
        }
        else if (guiControls.lightSelector == 4 && hemisphere == 0) {
            hemiLight = new THREE.HemisphereLight(0x140404, 0x140404, 3);
            hemiLight.position.set(0, 10, 0);
            hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 2);
            scene.add(hemiLight);
            hemisphere = 1;
        }
    }

    function deleteLight() {
        if (guiControls.lightSelector == 0 && ambient == 1) {
            scene.remove(arrayOfLights[guiControls.lightSelector]);
            ambient = 0;
        }
        else if (guiControls.lightSelector == 1 && directional == 1) {
            scene.remove(arrayOfLights[guiControls.lightSelector]);
            directional = 0;
        }
        else if (guiControls.lightSelector == 2 && point == 1) {
            scene.remove(arrayOfLights[guiControls.lightSelector]);
            scene.remove(pointLightHelper);
            point = 0;
        }
        else if (guiControls.lightSelector == 3 && spot == 1) {
            scene.remove(arrayOfLights[guiControls.lightSelector]);
            spot = 0;
        }
        else if (guiControls.lightSelector == 4 && hemisphere == 1) {
            scene.remove(hemiLight);
            scene.remove(hemiLightHelper);
            hemisphere = 0;
        }
    }

    function render() {

        cube.rotation.x += guiControls.rotationX;
        cube.rotation.y += guiControls.rotationY;
        cube.rotation.z += guiControls.rotationZ;

        /*necessary to make lights function*/
        cubeMaterial.needsUpdate = true;
        torMaterial.needsUpdate = true;
        planeMaterial.needsUpdate = true;

        for (var i in walls) walls[i].material.needsUpdate = true;

        arrayOfLights[1].position.x = guiControls.lightXD;
        arrayOfLights[1].position.y = guiControls.lightYD;
        arrayOfLights[1].position.z = guiControls.lightZD;

        arrayOfLights[2].position.x = guiControls.lightXP;
        arrayOfLights[2].position.y = guiControls.lightYP;
        arrayOfLights[2].position.z = guiControls.lightZP;

        arrayOfLights[3].position.x = guiControls.lightX;
        arrayOfLights[3].position.y = guiControls.lightY;
        arrayOfLights[3].position.z = guiControls.lightZ;
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