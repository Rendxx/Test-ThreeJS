$(function () {
    var scene, camera, renderer;
    var controls, guiControls, datGUI;
    var axis, grid, light;
    var stats;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
    var sk_helper;
    var mesh;
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
            mesh.rotation.y += .01;

            mesh.skeleton.bones[0].rotation.x = guiControls.bone.Bone_0;
            mesh.skeleton.bones[1].rotation.x = guiControls.bone.Bone_1;
            mesh.skeleton.bones[2].rotation.x = guiControls.bone.Bone_2;
            mesh.skeleton.bones[3].rotation.x = guiControls.bone.Bone_3;

        }
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



//$(function () {

//    function init() {
//        /*datGUI controls object*/
//        guiControls = new function () {
//            this.Bone_0 = 0.0;
//            this.Bone_1 = 0.0;
//            this.Bone_2 = 0.0;
//            this.Bone_3 = 0.0;

//            this.rotationX = 0.0;
//            this.rotationY = 0.0;
//            this.rotationZ = 0.0;

//            this.lightX = 131;
//            this.lightY = 107;
//            this.lightZ = 180;
//            this.intensity = 1.5;
//            this.distance = 373;
//            this.angle = 1.6;
//            this.exponent = 38;
//            this.shadowCameraNear = 34;
//            this.shadowCameraFar = 2635;
//            this.shadowCameraFov = 68;
//            this.shadowCameraVisible = false;
//            this.shadowMapWidth = 512;
//            this.shadowMapHeight = 512;
//            this.shadowBias = 0.00;
//            this.shadowDarkness = 0.11;

//            this.scene = function () {
//                console.log(scene);
//            };

//        }

//        //add some nice lighting
//        hemi = new THREE.HemisphereLight(0xff0090, 0xff0011);
//        scene.add(hemi);
//        //add some fog
//        scene.fog = new THREE.Fog(0xffff90, .01, 500);

//        /*adds spot light with starting parameters*/
//        spotLight = new THREE.SpotLight(0xffffff);
//        spotLight.castShadow = true;
//        spotLight.position.set(20, 35, 40);
//        spotLight.intensity = guiControls.intensity;
//        spotLight.distance = guiControls.distance;
//        spotLight.angle = guiControls.angle;
//        spotLight.exponent = guiControls.exponent;
//        spotLight.shadowCameraNear = guiControls.shadowCameraNear;
//        spotLight.shadowCameraFar = guiControls.shadowCameraFar;
//        spotLight.shadowCameraFov = guiControls.shadowCameraFov;
//        spotLight.shadowCameraVisible = guiControls.shadowCameraVisible;
//        spotLight.shadowBias = guiControls.shadowBias;
//        spotLight.shadowDarkness = guiControls.shadowDarkness;
//        scene.add(spotLight);

//        /*add loader call add model function*/
//        loader = new THREE.JSONLoader();
//        loader.load('https://cdn.rawgit.com/wpdildine/wpdildine.github.com/master/models/cylinder.json', addModel);


//        /*adds controls to scene*/
//        datGUI = new dat.GUI();

//        /*edit bones*/
//        datGUI.add(guiControls, "scene");
//        var cfolder = datGUI.addFolder('Controls');

//        cfolder.add(guiControls, 'Bone_0', -3.14, 3.14);
//        cfolder.add(guiControls, 'Bone_1', -3.14, 3.14);
//        cfolder.add(guiControls, 'Bone_2', -3.14, 3.14);
//        cfolder.add(guiControls, 'Bone_3', -3.14, 3.14);



//        var lfolder = datGUI.addFolder('Lights');
//        lfolder.add(guiControls, 'lightX', -60, 400);
//        lfolder.add(guiControls, 'lightY', 0, 400);
//        lfolder.add(guiControls, 'lightZ', -60, 400);

//        lfolder.add(guiControls, 'intensity', 0.01, 5).onChange(function (value) {
//            spotLight.intensity = value;
//        });
//        lfolder.add(guiControls, 'distance', 0, 1000).onChange(function (value) {
//            spotLight.distance = value;
//        });
//        lfolder.add(guiControls, 'angle', 0.001, 1.570).onChange(function (value) {
//            spotLight.angle = value;
//        });
//        lfolder.add(guiControls, 'exponent', 0, 50).onChange(function (value) {
//            spotLight.exponent = value;
//        });
//        lfolder.add(guiControls, 'shadowCameraNear', 0, 100).name("Near").onChange(function (value) {
//            spotLight.shadowCamera.near = value;
//            spotLight.shadowCamera.updateProjectionMatrix();
//        });
//        lfolder.add(guiControls, 'shadowCameraFar', 0, 5000).name("Far").onChange(function (value) {
//            spotLight.shadowCamera.far = value;
//            spotLight.shadowCamera.updateProjectionMatrix();
//        });
//        lfolder.add(guiControls, 'shadowCameraFov', 1, 180).name("Fov").onChange(function (value) {
//            spotLight.shadowCamera.fov = value;
//            spotLight.shadowCamera.updateProjectionMatrix();
//        });
//        lfolder.add(guiControls, 'shadowCameraVisible').onChange(function (value) {
//            spotLight.shadowCameraVisible = value;
//            spotLight.shadowCamera.updateProjectionMatrix();
//        });
//        lfolder.add(guiControls, 'shadowBias', 0, 1).onChange(function (value) {
//            spotLight.shadowBias = value;
//            spotLight.shadowCamera.updateProjectionMatrix();
//        });
//        lfolder.add(guiControls, 'shadowDarkness', 0, 1).onChange(function (value) {
//            spotLight.shadowDarkness = value;
//            spotLight.shadowCamera.updateProjectionMatrix();
//        });
//        datGUI.close();
//        $("#webGL-container").append(renderer.domElement);
//        /*stats*/
//        stats = new Stats();
//        stats.domElement.style.position = 'absolute';
//        stats.domElement.style.left = '0px';
//        stats.domElement.style.top = '0px';
//        $("#webGL-container").append(stats.domElement);
//    }
//    var set = [];
//    var helpset = [];
//    var scaleVal = 3;
//    function addModel(geometry, materials) {

//        for (var i = 0; i < 800; i++) {
//            materials[0].skinning = true;

//            var cs = scaleVal * Math.random();

//            set[i] = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
//            set[i].position.set(Math.random() * 250, Math.random() * 250, Math.random() * 250);
//            set[i].scale.set(cs, cs, cs);
//            set[i].castShadow = true;
//            set[i].receiveShadow = true;

//            scene.add(set[i]);
//            helpset[i] = new THREE.SkeletonHelper(set[i]);
//            //scene.add(helpset[i]);

//        }

//    }

//    function render() {
//        spotLight.position.x = guiControls.lightX;
//        spotLight.position.y = guiControls.lightY;
//        spotLight.position.z = guiControls.lightZ;

//        scene.traverse(function (child) {
//            if (child instanceof THREE.SkinnedMesh) {

//                child.rotation.y += .01;

//                child.skeleton.bones[0].rotation.z = guiControls.Bone_0;
//                child.skeleton.bones[1].rotation.z = guiControls.Bone_1;
//                child.skeleton.bones[2].rotation.z = guiControls.Bone_2;
//                child.skeleton.bones[3].rotation.z = guiControls.Bone_3;
//            }
//            else if (child instanceof THREE.SkeletonHelper) {
//                child.update();
//            }
//        });

//    }

//    function animate() {
//        requestAnimationFrame(animate);
//        render();
//        stats.update();
//        renderer.render(scene, camera);
//    }

//    init();
//    animate();

//    $(window).resize(function () {
//        SCREEN_WIDTH = window.innerWidth;
//        SCREEN_HEIGHT = window.innerHeight;
//        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
//        camera.updateProjectionMatrix();
//        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
//    });

//});

