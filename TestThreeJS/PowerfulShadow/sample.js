$(function () {
    var scene, camera, renderer;
    var cubeGeometry, wallGeometry, planeGeometry;
    var cubeMaterial, wallMaterial, planeMaterial;
    var cube, wall, plane;
    var controls, guiControls, datGUI, stats;
    var spotHelper;

    var view_light, view_block, view_group;

    /*variables for lights*/
    var ambient,spot;
    
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
        renderer.autoClear = false; // To allow render overlay on top of sprited sphere
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;

        /*add controls*/
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);

        addObj();
        customize();
        addDatGui();
        
        $("#webGL-container").append(renderer.domElement);
        /*stats*/
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);
    }

    function customize() {
        //var view_light, view_block, view_group;

        // group
        view_group = new THREE.Group();

        // light
        view_light = new THREE.PointLight();
        view_light.distance = 100;
        view_light.position.set(0, 0, 0);
        view_light.castShadow = true;
        view_light.updateMatrix();
        view_group.add(view_light);

        // block
        view_block = [];
        var blockGeometry = new THREE.PlaneGeometry(20, 20);
        var block_mesh = new THREE.Mesh(blockGeometry, new THREE.MeshPhongMaterial({ color: 0x000055 }));
        block_mesh.material.side = THREE.DoubleSide;
        block_mesh.position.set(10, 0, 0);
        block_mesh.rotation.y = 0.5 * Math.PI;
        block_mesh.castShadow = true;
        block_mesh.updateMatrix();
        view_block.push(block_mesh);
        view_group.add(block_mesh);

        var blockGeometry = new THREE.PlaneGeometry(20, 20);
        var block_mesh = new THREE.Mesh(blockGeometry, new THREE.MeshPhongMaterial({ color: 0x000055 }));
        block_mesh.material.side = THREE.DoubleSide;
        block_mesh.position.set(0, 0, -10);
        block_mesh.castShadow = true;
        block_mesh.updateMatrix();
        view_block.push(block_mesh);
        view_group.add(block_mesh);

        var blockGeometry = new THREE.PlaneGeometry(20, 20);
        var block_mesh = new THREE.Mesh(blockGeometry, new THREE.MeshPhongMaterial({ color: 0x000055 }));
        block_mesh.material.side = THREE.DoubleSide;
        block_mesh.position.set(0, 0, 10);
        block_mesh.castShadow = true;
        block_mesh.updateMatrix();
        view_block.push(block_mesh);
        view_group.add(block_mesh);

        scene.add(view_group);
    };
    
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
        scene.add(spot);
        spot.castShadow = true;
        spot.position.set(20, 35, 40);
        spot.penumbra = 0.5;
        spot.target = cube;

        spotHelper = new THREE.CameraHelper(spot.shadow.camera);
        scene.add(spotHelper);  
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
        view_group.position.x = guiControls.viewX;
        view_group.position.y = guiControls.viewY;
        view_group.position.z = guiControls.viewZ;

        /*adds controls to scene*/
        datGUI = new dat.GUI();
        datGUI.addColor(guiControls, 'ambColor').onChange(function (value) {
            ambient.color.setHex(value);
        });
        var spotFolder = datGUI.addFolder('Spot Light');
        spotFolder.add(guiControls, 'lightX', -60, 180);
        spotFolder.add(guiControls, 'lightY', 0, 180);
        spotFolder.add(guiControls, 'lightZ', -60, 180);
        datGUI.add(guiControls, 'viewX', -60, 180);
        datGUI.add(guiControls, 'viewY', 0, 180);
        datGUI.add(guiControls, 'viewZ', -60, 180);
    };

    function render() {
        spot.position.x = guiControls.lightX;
        spot.position.y = guiControls.lightY;
        spot.position.z = guiControls.lightZ;

        view_group.position.x = guiControls.viewX;
        view_group.position.y = guiControls.viewY;
        view_group.position.z = guiControls.viewZ;

        /*necessary to make lights function*/
        cubeMaterial.needsUpdate = true;
        planeMaterial.needsUpdate = true;
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