$(function () {
    var scene, camera, renderer;
    var controls, datGUI, stats;
    var container = $("#webGL-container")[0];
    var raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 10;
    var lines = [];
    var panel;

    /*variables for lights*/
    var ambient;

    function init() {
        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;
        /*creates empty scene object and renderer*/
        camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 5000);
        camera.position.z = 800;

        scene = new THREE.Scene();

        // render
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.autoClear = false; // To allow render overlay on top of sprited sphere
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        /*add controls*/
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', function () {
            render();
            //console.log(camera.position);
        });

        drawBox({
            top: -0.9,
            left: -0.9,
            bottom: 0.9,
            right: 0.9,
            depth: 0.8,
            w: 1.0,
            color: new THREE.Color(0.5, 0, 0)
        });

        drawBox({
            top: -0.5,
            left: -0.5,
            bottom: 0.8,
            right: 0.8,
            depth: -0.5,
            w: 1.0,
            color: new THREE.Color(0, 0.5, 0)
        });

        $("#webGL-container").append(renderer.domElement);
        /*stats*/
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);
    }

    function drawBox(opts) {
        var top = opts.top || -1.0;
        var left = opts.left || -1.0;
        var bottom = opts.bottom || 1.0;
        var right = opts.right || 1.0;
        var depth = opts.depth || 1.0;
        var w = opts.w || 1.0;

        var color = opts.color || new THREE.Color(1.0, 0.0, 0.0);

        var positionAtt = new Float32Array([
            left, top, depth,
            left, bottom, depth,
            right, bottom, depth,
            right, top, depth
        ]);

        var indexAtt = new Int16Array([
            0, 1, 2, 2, 3, 0
        ]);

        var colorAtt = new Float32Array([
            color.r, color.g, color.b,
            color.r, color.g, color.b,
            color.r, color.g, color.b,
            color.r, color.g, color.b
        ]);


        var geometry = new THREE.BufferGeometry();
        geometry.setIndex(new THREE.BufferAttribute(indexAtt, 1));
        geometry.addAttribute('position', new THREE.BufferAttribute(positionAtt, 3));
        geometry.addAttribute('color', new THREE.BufferAttribute(colorAtt, 3));
        geometry.computeBoundingSphere();

        var uniforms = {
            w: { value: w }
        };

        var material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexColors: THREE.VertexColors,
            vertexShader: document.getElementById('vertex_shader').textContent,
            fragmentShader: document.getElementById('fragment_shader').textContent
        });

        material.side = THREE.DoubleSide;
        var panel = new THREE.Mesh(geometry, material);
        scene.add(panel);
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