$(function () {
    var scene, camera, renderer;
    var controls, guiControls, datGUI;
    var axis, grid, light;
    var stats;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
    var sk_helper;
    var mesh;
    var light;
    var tween;

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

        camera.position.x = 40;
        camera.position.y = 40;
        camera.position.z = 40;
        camera.lookAt(scene.position);
        
        guiControls = {
            bone: {

                Bone_0: 0.0,
                Bone_1: 0.0,
                Bone_2: 0.0,
                Bone_3: 0.0,

                rotationX: 0.0,
                rotationY: 0.0,
                rotationZ: 0.0,
                rotateTween1: function () {
                    tween[1].stop();
                    tween[0].start();
                },
                rotateTween2: function () {
                    tween[0].stop();
                    tween[1].start();
                }
            },
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
        /*bone controls*/
        var cfolder = datGUI.addFolder('Controls');

        cfolder.add(guiControls.bone, 'Bone_0', -3.14, 3.14);
        cfolder.add(guiControls.bone, 'Bone_1', -3.14, 3.14);
        cfolder.add(guiControls.bone, 'Bone_2', -3.14, 3.14);
        cfolder.add(guiControls.bone, 'Bone_3', -3.14, 3.14);
        cfolder.add(guiControls.bone, 'rotateTween1');
        cfolder.add(guiControls.bone, 'rotateTween2');
        /*ambient light controls*/
        var ambFolder = datGUI.addFolder('Ambient Light');
        ambFolder.addColor(guiControls.ambient, 'ambColor').onChange(function (value) {
            arrayOfLights[0].color.setHex(value);
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

            scene.add(mesh);

            sk_helper = new THREE.SkeletonHelper(mesh);
            scene.add(sk_helper);

            tween = [];
            tween[0] = new TWEEN.Tween(mesh.skeleton.bones[1].rotation).to({ y: Math.PI / 2 }, 1000).easing(TWEEN.Easing.Quadratic.InOut);
            tween[1] = new TWEEN.Tween(mesh.skeleton.bones[1].rotation).to({ y: 0 }, 1000).easing(TWEEN.Easing.Quadratic.InOut);
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
        if (mesh != null) {
            //mesh.rotation.y += .01;

            mesh.skeleton.bones[0].rotation.x = guiControls.bone.Bone_0;
            mesh.skeleton.bones[1].rotation.x = guiControls.bone.Bone_1;
            mesh.skeleton.bones[2].rotation.x = guiControls.bone.Bone_2;
            mesh.skeleton.bones[3].rotation.x = guiControls.bone.Bone_3;
            sk_helper.update();
        }
        TWEEN.update();
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

