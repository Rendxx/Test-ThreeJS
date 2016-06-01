$(function () {
    var scene, camera, renderer;
    var controls, datGUI, stats;


    /*variables for lights*/
    var ambient;

    function init() {
        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;
        /*creates empty scene object and renderer*/
        camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 5000);
        camera.position.z = 1500;

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

        $("#webGL-container").append(renderer.domElement);
        /*stats*/
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);
    }
        
    function addObj() {

        var cubeGeometry = new THREE.CubeGeometry(50, 50, 50, 20, 20, 20);
        var textureLoader = new THREE.TextureLoader();
        var discTexture = textureLoader.load('disc.png');
        var particleMaterial = new THREE.PointsMaterial({ map: discTexture, size: 12, color: 0xff0000, opacity: true, alphaTest: 0.5 });
        var particleCube = new THREE.Points(cubeGeometry, particleMaterial);
        particleCube.position.set(0, 50, 0);

        scene.add(particleCube);
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
        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;

        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();

        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    });

    init();
    animate();
});