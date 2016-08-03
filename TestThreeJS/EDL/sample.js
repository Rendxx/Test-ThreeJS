$(function () {
    var scene, camera, renderer;
    var controls, datGUI, stats;
    var container = $("#webGL-container")[0];
    var raycaster = new THREE.Raycaster();
    var building = null;
    var uniforms = [];

    /*variables for lights*/
    var ambient;

    function init() {
        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;
        /*creates empty scene object and renderer*/
        camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 5000);
        camera.position.z = 100;

        scene = new THREE.Scene();

        // render
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xeeeeee);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.autoClear = false; // To allow render overlay on top of sprited sphere
        renderer.setSize(window.innerWidth, window.innerHeight);

        /*add controls*/
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', function () {

            var c = [camera.position.x, camera.position.y, camera.position.z];
            for (var i = 0; i < uniforms.length; i++) uniforms[i]["cameraPos"].value = c;
            render();
        });

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

        var loader = new THREE.ObjectLoader();
        loader.load('/EDL/logoModel/' + 'City-2.json', function (obj) {
            building = obj;
            //obj.rotation.x = -Math.PI / 2;
            obj.position.z = 0;
            
            obj.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    var _uniforms = {
                        "texture": { type: "t", value: child.material.map },
                        "cameraPos": { type: "v3", value: [camera.position.x, camera.position.y, camera.position.z ] },
                    };

                    uniforms.push(_uniforms);

                    var material =
                      new THREE.ShaderMaterial({
                          uniforms: _uniforms,
                          vertexShader: document.getElementById('vertex_shader').textContent,
                          fragmentShader: document.getElementById('fragment_shader').textContent
                      });
                    child.material = material;
                }
            });

            scene.add(obj);
            isloaded = true;
        });
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

    // mouse

    init();
    animate();
});