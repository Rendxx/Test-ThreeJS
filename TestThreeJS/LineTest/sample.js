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
        camera.position.z = 200;

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
        var geometry = new THREE.BufferGeometry();
        var index = new Int8Array(6);
        index[0] = 0;
        index[1] = 1;
        index[2] = 2;
        index[3] = 0;
        index[4] = 2;
        index[5] = 3;

        var normals = new Float32Array(6 * 3);
        normals[0] = normals[1] = normals[2] = 1;
        normals[3 + 0] = normals[3 + 1] = normals[3 + 2] = 1;
        normals[6 + 0] = normals[6 + 1] = normals[6 + 2] = 1;
        normals[9 + 0] = normals[9 + 1] = normals[9 + 2] = 1;
        normals[12 + 0] = normals[12 + 1] = normals[12 + 2] = 1;
        normals[15 + 0] = normals[15 + 1] = normals[15 + 2] = 1;


        var position = new Float32Array(6 * 3);
        position[0] = position[1] = position[2] = 10;
        position[3 + 0] = position[3 + 1] = position[3 + 2] = 20;
        position[6 + 0] = position[6 + 1] = position[6 + 2] = 30;
        position[9 + 0] = position[9 + 1] = position[9 + 2] = 40;
        position[12 + 0] = position[12 + 1] = position[12 + 2] = 50;
        position[15 + 0] = position[15 + 1] = position[15 + 2] = 60;

        geometry.addAttribute('index', new THREE.BufferAttribute(index, 1));
        geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
        geometry.addAttribute('position', new THREE.BufferAttribute(position, 3));
        geometry.computeBoundingSphere();
        var material = new LineMaterial({
            width: 10,
            color: new THREE.Color(0xff0000),
            start: new THREE.Vector3(-40, 0, 0),
            end: new THREE.Vector3(40, 0, 0)
        });
        var line = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xeeeeee, side: THREE.DoubleSide }));
        lines.push(line);
        scene.add(line);

        // material

        var geometry = new THREE.PlaneGeometry(100, 100, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0xeeeeee, side: THREE.DoubleSide });
        panel = new THREE.Mesh(geometry, material);
        panel.position.z = -20;
        //scene.add(panel);
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