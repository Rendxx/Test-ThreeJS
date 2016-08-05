$(function () {
    var scene, camera, renderer;
    var sceneRTT, cameraRTT;
    var sceneScreen;
    var bufferTex;

    var controls, datGUI, stats;
    var container = $("#webGL-container")[0];

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

    function init() {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        /*creates empty scene object and renderer*/
        cameraRTT = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 5000);
        cameraRTT.position.z = 1000;
        camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10000, 10000);
        camera.position.z = 100;

        scene = new THREE.Scene();
        screenRTT = new THREE.Scene();
        sceneScreen = new THREE.Scene();

        // render
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.autoClear = false; // To allow render overlay on top of sprited sphere
        renderer.setSize(window.innerWidth, window.innerHeight);

        /*add controls*/
        //controls = new THREE.OrbitControls(cameraRTT, renderer.domElement);
        //controls.addEventListener('change', function () {
        //    render();
        //});

        addMesh();
        addObj();

        $("#webGL-container").append(renderer.domElement);
        /*stats*/
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);

    }

    function addMesh() {
        // buffer
        bufferTex = new THREE.WebGLRenderTarget(SCREEN_WIDTH , SCREEN_HEIGHT, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });

        var materialScreen = new THREE.ShaderMaterial({
            uniforms: { tDiffuse: { type: "t", value: 0, texture: bufferTex } },
            vertexShader: document.getElementById('vertex_shader_screen').textContent,
            fragmentShader: document.getElementById('fragment_shader_screen').textContent,
            depthWrite: false
        });

        var plane = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
        
        var quad = new THREE.Mesh(plane, materialScreen);
        quad.position.z = -100;
        sceneScreen.add(quad);

        var ball = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2), new THREE.MeshBasicMaterial({ color: 0xffffff, map: bufferTex }));
        scene.add(ball);
    };

    function addObj() {
        var loader = new THREE.ObjectLoader();
        loader.load('/EDL/logoModel/' + 'City-2.json', function (obj) {
            obj.scale.set(8, 8, 8);
            screenRTT.add(obj);
        });
    };

    function render() {
        renderer.clear();
        renderer.render(screenRTT, cameraRTT, bufferTex, true);
        renderer.render(sceneScreen, cameraRTT);
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