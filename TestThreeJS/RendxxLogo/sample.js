$(function () {
    var scene, camera, renderer;
    var controls, guiControls, datGUI;
    var stats;
    var SCREEN_WIDTH, SCREEN_HEIGHT;

    var ambient = null;
    var directional = null;
    var bgPlane = null;
    var grayPlane1 = null;
    var grayPlane2 = null;

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

        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 80;
        camera.lookAt(scene.position);

        guiControls = {
            ambient: {
                ambColor: 0x333333
            },
            spot: {
                lightX: 20,
                lightY: 5,
                lightZ: 40
            }
        };

        ambient = new THREE.AmbientLight();
        spot = new THREE.SpotLight();

        var lightTarget = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshPhongMaterial({ color: 0xff3300 }));
        lightTarget.position.set(0,2.75,0);
        scene.add(lightTarget);

        // Ambient
        ambient.color.setHex(guiControls.ambient.ambColor);
        scene.add(ambient);

        // Spot
        spot.castShadow = true;
        spot.shadow.mapSize.width = 4096;
        spot.shadow.mapSize.height = 4096;
        spot.shadow.bias = 0.0001;
        spot.shadow.far = 800;
        spot.shadow.near = 10;
        spot.exponent = 0.5;
        spot.angle = 1.570;
        spot.intensity = 1;
        spot.position.set(guiControls.spot.lightX, guiControls.spot.lightY, guiControls.spot.lightZ);
        scene.add(spot);


        datGUI = new dat.GUI();
        /*ambient light controls*/
        var ambFolder = datGUI.addFolder('Ambient Light');
        ambFolder.addColor(guiControls.ambient, 'ambColor').onChange(function (value) {
            ambient.color.setHex(value);
        });

        /*spot gui controls*/
        var shadowHelper_spot = null;
        var spotFolder = datGUI.addFolder('Spot Light');
        spotFolder.add(guiControls.spot, 'lightX', -60, 180).onChange(function (value) {
            spot.position.x = value;
        });
        spotFolder.add(guiControls.spot, 'lightY', 0, 180).onChange(function (value) {
            spot.position.y = value;
        });
        spotFolder.add(guiControls.spot, 'lightZ', -60, 180).onChange(function (value) {
            spot.position.z = value;
        });

        $("#webGL-container").append(renderer.domElement);
        // status track
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);

        AddBlenderMesh('/RendxxLogo/obj/City-2.json');

        // bg
        bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshBasicMaterial({ color: 0xeeeeee }));
        bgPlane.position.set(0, 0, -80);
        scene.add(bgPlane);

        //gray
        grayPlane1 = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshBasicMaterial({ color: 0xbbbbbb }));
        grayPlane1.position.set(0, 0, -77);
        grayPlane1.rotation.z = Math.PI / 5.5;
        scene.add(grayPlane1);

        grayPlane2 = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshBasicMaterial({ color: 0xeeeeee }));
        grayPlane2.position.set(0, 0, -78);
        grayPlane2.rotation.z = Math.PI / 5.5;
        scene.add(grayPlane2);
    }

    function AddBlenderMesh(file) {
        var loader = new THREE.ObjectLoader();
        loader.load(file, function (obj) {
            obj.rotation.x = -Math.PI / 2;
            obj.rotation.y = -Math.PI / 4;
            obj.position.z = -76;
            scene.add(obj);
        });
    }

    function render() {

        spot.position.x = guiControls.spot.lightX;
        spot.position.y = guiControls.spot.lightY;
        spot.position.z = guiControls.spot.lightZ;
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