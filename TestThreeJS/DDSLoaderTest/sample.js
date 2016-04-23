$(function () {
    var scene, camera, renderer;
    var plane;
    var controls;
    var ambient;

    //function renderObjects( renderList, camera, fog, overrideMaterial )
    function init() {
        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;
        /*creates empty scene object and renderer*/
        camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 5000);
        camera.position.x = 100;
        camera.position.y = 100;
        camera.position.z = 100;

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
        material.side = THREE.DoubleSide;
        plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -.5 * Math.PI;
        plane.receiveShadow = true;

        scene.add(plane);

        // Add texture
        var ddsLoader = new THREE.DDSLoader();
        var tex = ddsLoader.load('DeadScreen.dds');
        tex.anisotropy = 4;

        var mat = new THREE.SpriteMaterial({map: tex});
        var spr = new THREE.Sprite(mat);
        spr.position.set(0, 20, 20);
        spr.scale.set(100, 100, 1);
        scene.add(spr);

        var tex2 = ddsLoader.load('t2.dds');
        tex2.anisotropy = 4;

        var mat2 = new THREE.SpriteMaterial({ map: tex2 });
        var spr2 = new THREE.Sprite(mat2);
        spr2.position.set(0, 120, 120);
        spr2.scale.set(10, 10, 1);
        scene.add(spr2);

        /*scene lights*/
        ambient = new THREE.AmbientLight(0x666666);
        scene.add(ambient);
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