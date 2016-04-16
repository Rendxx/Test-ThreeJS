$(function () {
    var scene, camera, renderer;
    var cubeGeometry, wallGeometry, planeGeometry;
    var cubeMaterial, wallMaterial, planeMaterial;
    var cube, wall, plane;
    var controls, guiControls, datGUI, stats;


    /*variables for lights*/
    var ambient, spot, spot2;
    
    function init() {
        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;
        /*creates empty scene object and renderer*/
        camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 5000);
        camera.position.x = 300;
        camera.position.y = 300;
        camera.position.z = 300;

        scene = new THREE.Scene();

        // render
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;

        /*add controls*/
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);

        addObj();
        addDatGui();
        
        $("#webGL-container").append(renderer.domElement);
        /*stats*/
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);
    }
    
    function addObj() {
        /*create cube*/
        cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
        cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x33ff00 });
        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        /*create wall*/
        wallGeometry = new THREE.BoxGeometry(5, 100, 200);
        wallMaterial = new THREE.MeshPhongMaterial({ color: 0xff3300 });
        wall = new THREE.Mesh(wallGeometry, wallMaterial);

        /*create plane*/
        planeGeometry = new THREE.PlaneGeometry(500, 500);
        planeMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 });
        plane = new THREE.Mesh(planeGeometry, planeMaterial);

        /*position and add objects to scene*/
        plane.rotation.x = -.5 * Math.PI;
        plane.receiveShadow = true;
        scene.add(plane);

        wall.position.x = 0;
        wall.position.y = 0;
        wall.position.z = 0;
        wall.castShadow = true;
        wall.receiveShadow = true;
        scene.add(wall);

        cube.position.x = -40;
        cube.position.y = 20;
        cube.position.z = -40;
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);

        /*scene lights*/
        ambient = new THREE.AmbientLight();
        scene.add(ambient);

        spot = new THREE.SpotLight()
        spot.castShadow = true;
        spot.position.set(20, 35, 40);
        spot.penumbra = 0.5;
        spot.target = cube;
        scene.add(spot);

        spot2 = new THREE.SpotLight(0x990099);
        spot2.castShadow = true;
        spot2.position.set(-60, 35, -60);
        spot2.penumbra = 0.5;
        spot2.target = cube;
        scene.add(spot2);
    };

    function addDatGui() {
        /*datGUI controls object*/
        guiControls = new function () {
            /*ambient light values*/
            this.ambColor = 0x333333;
            /*spot light values*/
            this.lightX = 50;
            this.lightY = 50;
            this.lightZ = 50;

            /*view light values*/
            this.viewX = 20;
            this.viewY = 20;
            this.viewZ = 20;
        };

        /*ambient light parameters*/
        ambient.color.setHex(guiControls.ambColor);
        /*spot light parameters*/
        spot.position.x = guiControls.lightX;
        spot.position.y = guiControls.lightY;
        spot.position.z = guiControls.lightZ;
        /*view light parameters*/
        spot2.position.x = guiControls.viewX;
        spot2.position.y = guiControls.viewY;
        spot2.position.z = guiControls.viewZ;

        /*adds controls to scene*/
        datGUI = new dat.GUI();
        datGUI.addColor(guiControls, 'ambColor').onChange(function (value) {
            ambient.color.setHex(value);
        });
        var spotFolder = datGUI.addFolder('Spot Light');
        spotFolder.add(guiControls, 'lightX', -180, 180);
        spotFolder.add(guiControls, 'lightY', 0, 180);
        spotFolder.add(guiControls, 'lightZ', -180, 180);
        spotFolder.open();

        var viewFolder = datGUI.addFolder('View');
        viewFolder.add(guiControls, 'viewX', -180, 180);
        viewFolder.add(guiControls, 'viewY', 0, 180);
        viewFolder.add(guiControls, 'viewZ', -180, 180);
        viewFolder.open();
    };

    function render() {
        spot.position.x = guiControls.lightX;
        spot.position.y = guiControls.lightY;
        spot.position.z = guiControls.lightZ;

        spot2.position.x = guiControls.viewX;
        spot2.position.y = guiControls.viewY;
        spot2.position.z = guiControls.viewZ;

        /*necessary to make lights function*/
        cubeMaterial.needsUpdate = true;
        planeMaterial.needsUpdate = true;
        wallMaterial.needsUpdate = true;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
        renderer.render(scene, camera);
    }

    $(window).resize(function () {
        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;

        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
        
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    });

    init();
    animate();
});