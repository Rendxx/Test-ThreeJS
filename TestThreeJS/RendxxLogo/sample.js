$(function () {
    var scene, camera, renderer;
    var controls, guiControls, datGUI;
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

        renderer.setClearColor(0xeeeeee);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.soft = true;

        /*add controls*/
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);

        camera.position.x = 40;
        camera.position.y = 40;
        camera.position.z = 40;
        camera.lookAt(scene.position);

        guiControls = {
            rotation: 0,
            ambient: {
                ambColor: 0x333333
            },
            spot: {
                lightX: 20,
                lightY: 5,
                lightZ: 40,
                intensity: 1,
                distance: 80,
                angle: 1.570,
                exponent: 0.5,
                shadowCameraNear: 10,
                shadowCameraFar: 80,
                shadowCameraFov: 30,
                shadowCameraVisible: false,
                shadowMapWidth: 2056,
                shadowMapHeight: 2056,
                shadowBias: 0.0001,
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
        arrayOfLights[1].shadowMapWidth = guiControls.spot.shadowMapWidth;
        arrayOfLights[1].shadowMapHeight = guiControls.spot.shadowMapHeight;
        arrayOfLights[1].exponent = guiControls.spot.exponent;
        arrayOfLights[1].angle = guiControls.spot.angle;
        arrayOfLights[1].shadowBias = guiControls.spot.shadowBias;
        arrayOfLights[1].shadowDarkness = guiControls.spot.shadowDarkness;
        arrayOfLights[1].position.set(guiControls.spot.lightX, guiControls.spot.lightY, guiControls.spot.lightZ);
        arrayOfLights[1].intensity = guiControls.spot.intensity;
        scene.add(arrayOfLights[1]);


        datGUI = new dat.GUI();
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

        $("#webGL-container").append(renderer.domElement);
        // status track
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);

        AddBlenderMesh('/RendxxLogo/obj/City-2.json');
    }

    function AddBlenderMesh(file) {
        var loader = new THREE.ObjectLoader();
        loader.load(file, function (obj) {
            scene.add(obj);
        });
    }

    function render() {

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