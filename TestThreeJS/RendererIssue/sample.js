(function () {
    var scene, camera, renderer;
    var sceneScreen, cameraScreen;
    var screenPanel;
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    var ORI_WIDTH = SCREEN_WIDTH;
    var ORI_HEIGHT = SCREEN_HEIGHT;
    var renderTarget = new THREE.WebGLRenderTarget(SCREEN_WIDTH, SCREEN_HEIGHT, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat });

    function init() {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(0x333333);
        renderer.setSize(window.innerWidth, window.innerHeight);

        setupObjScene();
        setupScreenScene();
        window.addEventListener('resize', function () {
            SCREEN_WIDTH = window.innerWidth;
            SCREEN_HEIGHT = window.innerHeight;

            camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
            camera.updateProjectionMatrix();

            cameraScreen.left = -SCREEN_WIDTH / 2;
            cameraScreen.right = SCREEN_WIDTH / 2;
            cameraScreen.top = SCREEN_HEIGHT / 2;
            cameraScreen.bottom = -SCREEN_HEIGHT / 2;
            cameraScreen.updateProjectionMatrix();

            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

            screenPanel.scale.x = SCREEN_WIDTH / ORI_WIDTH;
            screenPanel.scale.y = SCREEN_HEIGHT / ORI_HEIGHT;
            renderTarget.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        }, true);
        document.getElementById('webGL-container').appendChild(renderer.domElement);
    }

    function setupObjScene() {
        // scene & camera
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 5000);
        camera.position.z = 10;

        var controls = new THREE.OrbitControls(camera, renderer.domElement);

        // texture
        var loader = new THREE.TextureLoader();
        //loader.setCrossOrigin("use-credentials");
        var texture = loader.load('cloud.png');

        // mesh
        var plane = new THREE.Mesh(
            new THREE.PlaneGeometry(1024, 1024),
            new THREE.MeshBasicMaterial({
                map: texture
            })
        );
        plane.position.set(0, 0, -512);
        scene.add(plane);
    };

    function setupScreenScene() {
        // scene & camera
        sceneScreen = new THREE.Scene();
        cameraScreen = new THREE.OrthographicCamera(-SCREEN_WIDTH / 2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, -SCREEN_HEIGHT / 2, 1, 100);

        // mesh
        screenPanel = new THREE.Mesh(
            new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT),
            new THREE.ShaderMaterial({
                uniforms: {
                    "tex": { type: "t", value: renderTarget }
                },
                vertexShader: document.getElementById('vertex_shader').textContent,
                fragmentShader: document.getElementById('fragment_shader').textContent
            })
        );
        screenPanel.position.set(0, 0, -10);
        sceneScreen.add(screenPanel);
    };

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera, renderTarget, true);
        renderer.render(sceneScreen, cameraScreen);
    }

    init();
    animate();
})();

