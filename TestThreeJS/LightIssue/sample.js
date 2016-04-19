$(function () {
    var scene, camera, renderer;
    var plane;
    var controls;
    var ambient, spot, spot2;

    //function renderObjects( renderList, camera, fog, overrideMaterial )
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
        addObj();

        $("#webGL-container").append(renderer.domElement);
    }

    function addObj() {
        /*create plane*/
        var geometry = new THREE.PlaneGeometry(200, 200, 1, 1);
        var material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
        plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -.5 * Math.PI;
        plane.receiveShadow = true;
        scene.add(plane);

        /*scene lights*/
        ambient = new THREE.AmbientLight();
        scene.add(ambient);

        spot = new THREE.SpotLight()
        spot.castShadow = true;
        spot.position.set(20, 35, 40);
        spot.target = plane;
        scene.add(spot);

        spot2 = new THREE.SpotLight(0x990099);
        spot2.castShadow = false;
        spot2.position.set(-60, 35, -60);
        spot2.target = plane;
        scene.add(spot2);
    };

    function animate() {
        requestAnimationFrame(animate);
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