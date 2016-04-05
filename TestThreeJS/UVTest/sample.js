$(function () {
    var scene, camera, renderer;
    var controls, guiControls, datGUI;
    var stats;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
    var mesh = null;
    var GridSize = 4;

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

        /*texture*/
        var _textureLoader = new THREE.TextureLoader();
        var tex1 = _textureLoader.load('ground_ceramic.icon.png');
        tex1.wrapS = tex1.wrapT = THREE.RepeatWrapping;
        var tex2 = _textureLoader.load('wall.png');
        tex2.wrapS = tex2.wrapT = THREE.RepeatWrapping;

        /*create plane*/
        // 1
        var w = 7, h = 5;
        var planeGeometry1 = new THREE.PlaneGeometry(w * GridSize, h * GridSize, 1, 1);
        var uvs = planeGeometry1.faceVertexUvs[0];
        uvs[0][0].set(0, h);
        uvs[0][1].set(0, 0);
        uvs[0][2].set(w, h);
        uvs[1][0].set(0, 0);
        uvs[1][1].set(w, 0);
        uvs[1][2].set(w, h);

        var planeMaterial1 = new THREE.MeshPhongMaterial({ color: 0xeeeeee, map: tex1 });
        var plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
        plane1.rotation.x = -.5 * Math.PI;
        plane1.position.set(0,0,0);
        plane1.receiveShadow = true;
        scene.add(plane1);

        // 2
        var w = 8, h = 3;
        var planeGeometry2 = new THREE.PlaneGeometry(w * GridSize, h * GridSize, 1, 1);
        var uvs = planeGeometry2.faceVertexUvs[0];
        uvs[0][0].set(0, h / 4);
        uvs[0][1].set(0, 0);
        uvs[0][2].set(w / 4, h / 4);
        uvs[1][0].set(0, 0);
        uvs[1][1].set(w / 4, 0);
        uvs[1][2].set(w / 4, h / 4);

        var planeMaterial2 = new THREE.MeshPhongMaterial({ color: 0xeeeeee, map: tex2 });
        var plane2= new THREE.Mesh(planeGeometry2, planeMaterial2);
        //plane2.rotation.x = -.5 * Math.PI;
        plane1.position.set(GridSize*1, -GridSize * 1.5, 0);
        plane2.receiveShadow = true;
        scene.add(plane2);






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