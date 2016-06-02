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

        var geometry = new THREE.Geometry();

        var posArr = [
            [10, 10, 10],
            [20, 20, 20],
            [30, 30, 30],
            [40, 40, 40],
            [50, 50, 50]
        ];
        for (var i = 0, l = posArr.length; i < l; i++) {
            geometry.vertices.push(new THREE.Vector3(posArr[i][0],posArr[i][1],posArr[i][2]));
        }


        var textureLoader = new THREE.TextureLoader();
        var discTexture = textureLoader.load('disc.png');
        var particleMaterial = new THREE.PointsMaterial({ map: discTexture, size: 12, color: 0xff0000, opacity: true, alphaTest: 0.5 });
        var particle = new THREE.Points(geometry, particleMaterial);
        particle.position.set(0, 50, 0);

        scene.add(particle);
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