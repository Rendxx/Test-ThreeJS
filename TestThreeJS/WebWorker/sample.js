$(function () {
    var scene, camera, renderer;
    var cubeGeometry, planeGeometry;
    var cubeMaterial, planeMaterial;
    var cube, plane;
    var controls, guiControls, datGUI, stats;
    var rotationX = 0, rotationY = 0, rotationZ = 0;
    var worker;

    /*variables for lights*/
    var ambient;
    
    function init() {
        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;
        /*creates empty scene object and renderer*/
        camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 5000);
        camera.position.y = 200;

        scene = new THREE.Scene();

        // render
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.autoClear = false; // To allow render overlay on top of sprited sphere
        renderer.setSize(window.innerWidth, window.innerHeight);

        /*add controls*/
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);

        addObj();
        addDatGui();
        customize();
        setupWorker();
        
        $("#webGL-container").append(renderer.domElement);
        /*stats*/
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);
    }

    function setupWorker() {
        worker = new Worker("worker.js");
        worker.onmessage = function (e) {
            rotationX = e.data.x;
            rotationY = e.data.y;
            rotationZ = e.data.z;
        }
    }

    function customize() {
    };
    
    function addObj() {
        /*create cube*/
        cubeGeometry = new THREE.BoxGeometry(1, 2, 3);
        cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff3300 });
        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        /*create plane*/
        planeGeometry = new THREE.PlaneGeometry(100, 100, 100);
        planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        plane = new THREE.Mesh(planeGeometry, planeMaterial);

        /*position and add objects to scene*/
        plane.rotation.x = -.5 * Math.PI;
        plane.receiveShadow = true;
        scene.add(plane);

        cube.position.x = 2.5;
        cube.position.y = 4;
        cube.position.z = 2.5;
        cube.castShadow = true;
        scene.add(cube);

        /*scene lights*/
        ambient = new THREE.AmbientLight();
        scene.add(ambient);
    };

    function addDatGui() {
        /*datGUI controls object*/
        guiControls = new function () {
            this.rotationX = 0.0;
            this.rotationY = 0.0;
            this.rotationZ = 0.0;
            /*ambient light values*/
            this.ambColor = 0xdddddd;
        }

        /*ambient light parameters*/
        ambient.color.setHex(guiControls.ambColor);
        /*adds controls to scene*/
        datGUI = new dat.GUI();
        datGUI.add(guiControls, 'rotationX', 0, 1).onChange(function (value) {
            worker.postMessage({ x: value });
        });
        datGUI.add(guiControls, 'rotationY', 0, 1).onChange(function (value) {
            worker.postMessage({ y: value });
        });
        datGUI.add(guiControls, 'rotationZ', 0, 1).onChange(function (value) {
            worker.postMessage({ z: value });
        });
        datGUI.addColor(guiControls, 'ambColor').onChange(function (value) {
            ambient.color.setHex(value);
        });
    };

    function render() {
        cube.rotation.x = rotationX;
        cube.rotation.y = rotationY;
        cube.rotation.z = rotationZ;

        /*necessary to make lights function*/
        cubeMaterial.needsUpdate = true;
        planeMaterial.needsUpdate = true;

        renderer.clear();
        renderer.render(scene, camera);
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