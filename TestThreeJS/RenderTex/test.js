$(function () {
    var container, stats;
    var cameraRTT, camera, sceneRTT, sceneScreen, scene, renderer;

    var rtTexture, material, quad;

    init();
    animate();

    function init() {

        container = $("#webGL-container")[0];

        cameraRTT = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
        cameraRTT.position.z = 1000;

        camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10000, 10000); 
        camera.position.z = 100;

        scene = new THREE.Scene();
        sceneRTT = new THREE.Scene();
        sceneScreen = new THREE.Scene();

        rtTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat });

        material = new THREE.MeshBasicMaterial();

        var materialScreen = new THREE.ShaderMaterial({
            uniforms: { tDiffuse: { type: "t", value: 0, texture: rtTexture } },
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragment_shader_screen').textContent,
            depthWrite: false

        });

        var plane = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

        quad = new THREE.Mesh(plane, material);
        quad.position.z = -100;
        sceneRTT.add(quad);

        addObj(sceneRTT);

        quad = new THREE.Mesh(plane, materialScreen);
        quad.position.z = -100;
        sceneScreen.add(quad);

        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(window.innerWidth / 2, window.innerHeight / 2), new THREE.MeshBasicMaterial({  map: rtTexture }));
        scene.add(mesh);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.autoClear = false;

        container.appendChild(renderer.domElement);

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        container.appendChild(stats.domElement);
    }

    function addObj(xscene) {

        var loader = new THREE.ObjectLoader();
        loader.load('/RenderTex/logoModel/' + 'City-2.json', function (obj) {
            obj.scale.set(8, 8, 8);
            xscene.add(obj);
            isloaded = true;
        });
    };

    function animate() {

        requestAnimationFrame(animate);

        render();
        stats.update();

    }

    function render() {
        renderer.clear();
        renderer.render(sceneRTT, cameraRTT, rtTexture, true);
        renderer.render(sceneScreen, cameraRTT);
        renderer.render(scene, camera);

    }
});