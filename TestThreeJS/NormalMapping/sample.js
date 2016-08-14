$(function () {
    var scene, camera, renderer;
    var cube;

    var controls, datGUI, stats;
    var container = $("#webGL-container")[0];

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

    var ambient, spot;
    function init() {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        /*creates empty scene object and renderer*/
        camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 5000);
        camera.position.z = 100;

        scene = new THREE.Scene();

        // render
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000);
        renderer.autoClear = false; // To allow render overlay on top of sprited sphere
        renderer.setSize(window.innerWidth, window.innerHeight);

        /*add controls*/
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', function () {
            render();
            var pos = camera.position;
            spot.position.set(pos.x, pos.y, pos.z);
        });

        addObj();

        $("#webGL-container").append(renderer.domElement);
        /*stats*/
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);

        /*scene lights*/
        ambient = new THREE.AmbientLight();
        scene.add(ambient);

        spot = new THREE.SpotLight()
        spot.castShadow = true;
        spot.position.set(20, 35, 40);
        spot.penumbra = 0.5;
        spot.target = cube;
        scene.add(spot);
    }

    function addObj() {
        var textureLoader = new THREE.TextureLoader();
        var cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
        var cubeMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333,
            //map: textureLoader.load("/NormalMapping/normalMap.jpg"),
            normalMap: textureLoader.load("/NormalMapping/test-normal.png")
        });
        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        scene.add(cube);
    };

    function render() {
        renderer.clear();
        renderer.render(scene, camera);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    $(window).resize(function () {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;

        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();

        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    });

    // mouse

    init();
    animate();
});