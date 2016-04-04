$(function () {
    var scene, camera, renderer;
    var controls, guiControls, datGUI;
    var stats;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
    var mesh = null;

    /*variables for lights*/
    var arrayOfLights;
    var light;

    function init() {
        /*creates empty scene object and renderer*/
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 5000);
        renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setClearColor(0x000000);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;

        /*add controls*/
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);
        
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
                shadowCameraNear: 10,
                shadowCameraFar: 80,
                shadowCameraFov: 50,
                shadowMapWidth: 2056,
                shadowMapHeight: 2056
            }
        };

        arrayOfLights = [
            new THREE.AmbientLight(),
            new THREE.SpotLight(0xffffff, 1,10000)
        ];

        var lightTarget = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: 0xff3300 }));
        lightTarget.castShadow = true;
        lightTarget.position.set(0, 1, 0);
        scene.add(lightTarget);

        // Ambient
        arrayOfLights[0].color.setHex(guiControls.ambient.ambColor);
        scene.add(arrayOfLights[0]);

        // Spot
        arrayOfLights[1].castShadow = true;
        arrayOfLights[1].position.set(guiControls.spot.lightX, guiControls.spot.lightY, guiControls.spot.lightZ);
        arrayOfLights[1].intensity = guiControls.spot.intensity;
        arrayOfLights[1].shadow.camera.near = guiControls.spot.shadowCameraNear;
        arrayOfLights[1].shadow.camera.far = guiControls.spot.shadowCameraFar;
        scene.add(arrayOfLights[1]);

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

        $("#webGL-container").append(renderer.domElement);
        // status track
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);

        //AddBlenderMesh('table.2.json');
        //AddBlenderMesh('Door/door_wood_1_b.json', -10, 0);
        //AddBlenderMesh('Table/table.1.json', 10, 0);
    }

    function AddBlenderMesh(file, x, z) {
        var loader = new THREE.JSONLoader();
        loader.load(file, function (geometry, materials) {
            var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add(mesh);
            mesh.position.set(x, 0, z);
        });
    }

    function AddBlenderMesh2(file, x, z) {
        var loader = new THREE.JSONLoader();
        
        loader.load(file, function (geometry, materials) {
            for (var i = 0; i < materials.length; i++) {
                materials[i].skinning = true;
            }
            var mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.position.set(x, 0, z);

            scene.add(mesh);
        });
    }

    function render() {
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