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
        camera.position.y = -200;

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
        var size2 = 50;
        var posArr = [
            [-size2, 0, 0],
            [0, 0, -size2],
            [size2, 0, 0],
            [0, 0, size2],
            [0, size2, 0]
        ];
        var colorArr = [
            0x000088,
            0x008800,
            0x880000,
            0x888800,
            0x008888
        ];
        var rotateArr = [
            [0, Math.PI / 2, 0],
            [0, 0, 0],
            [0, -Math.PI / 2, 0],
                [0, -Math.PI, 0],
                [Math.PI / 2, 0, 0]
        ];
        var panel = [];
        for (var i = 0, l = posArr.length; i < l; i++) {
            panel[i] = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({ color: colorArr[i] }));
            panel[i].position.set(posArr[i][0], posArr[i][1], posArr[i][2]);
            panel[i].rotation.set(rotateArr[i][0], rotateArr[i][1], rotateArr[i][2]);
            scene.add(panel[i]);
        }
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