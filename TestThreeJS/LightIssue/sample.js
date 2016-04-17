$(function () {
    var scene, camera, renderer;
    var cubeGeometry, planeGeometry;
    var cubeMaterial, planeMaterial;
    var cube, plane;
    var controls, guiControls;


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

        $("#webGL-container").append(renderer.domElement);
    }

    function addObj() {
        /*create cube*/
        cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
        cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x33ff00 });
        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        /*create plane*/

        var textureLoader = new THREE.TextureLoader();
        textureLoader.load('ceramic.png', function (tex) {
            var w = 500, h = 500;
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            planeGeometry = new THREE.PlaneGeometry(w, h,1,1);
            // set uv
            var uvs = planeGeometry.faceVertexUvs[0];
            uvs[0][0].set(0, h/16);
            uvs[0][1].set(0, 0);
            uvs[0][2].set(w/16, h/16);
            uvs[1][0].set(0, 0);
            uvs[1][1].set(w/16, 0);
            uvs[1][2].set(w/16, h/16);

            planeMaterial = new THREE.MeshPhongMaterial({ map: tex });
            planeMaterial.side = THREE.DoubleSide;
            plane = new THREE.Mesh(planeGeometry, planeMaterial);

            /*position and add objects to scene*/
            plane.rotation.x = -.5 * Math.PI;
            plane.receiveShadow = true;
            scene.add(plane);
        });

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
    function render() {
        cubeMaterial.needsUpdate = true;
        if (planeMaterial !== undefined) planeMaterial.needsUpdate = true;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
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