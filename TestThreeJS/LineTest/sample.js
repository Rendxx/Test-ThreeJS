$(function () {
    var scene, camera, renderer;
    var controls, datGUI, stats;
    var container = $("#webGL-container")[0];
    var raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 10;
    var lines = [];
    var panel;
    var nearClip = 0.1;

    /*variables for lights*/
    var ambient;

    window.camera = null;

    function init() {
        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;
        /*creates empty scene object and renderer*/
        camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, nearClip, 5000);
        camera.position.z = 800;
        window.camera = camera
        //camera.position.z = 0;
        //camera.rotation.x = -0.66573;
        //camera.rotation.y = 0.70557;
        //camera.rotation.z = 0.471035;
        //camera.position.set(14,140,300);

        scene = new THREE.Scene();

        // render
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0x111111);
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
        var pos_1 = new THREE.Vector3(-800, 100, 0);
        var pos_2 = new THREE.Vector3(800, 100, 0);
        drawLine(pos_1,pos_2);

        var pos_1 = new THREE.Vector3(-20, 30, 20);
        var pos_2 = new THREE.Vector3(-10, -30, 5);
        drawLine(pos_1, pos_2);
    };

    function drawLine(pos_1, pos_2) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(1, 1, 1));
        geometry.vertices.push(new THREE.Vector3(2, 2, 2));
        geometry.vertices.push(new THREE.Vector3(3, 3, 3));
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(0, 2, 3));

        var material = new LineMaterial({
            viewportSize: new THREE.Vector2(window.innerWidth, window.innerHeight),
            width: 10,
            color: new THREE.Color(0xff0000),
            start: pos_1,
            end: pos_2,
            opacity: 0.6,
            nearClip: nearClip
        });

        material.transparent = true;
        material.depthTest = 0;
        var line = new THREE.Mesh(geometry, material);
        lines.push(line);
        scene.add(line);

        // end

        var geometry3 = new THREE.BufferGeometry();
        var position3 = new Float32Array(2 * 3);

        position3[0] = pos_1.x;
        position3[1] = pos_1.y;
        position3[2] = pos_1.z;

        position3[3] = pos_2.x;
        position3[4] = pos_2.y;
        position3[5] = pos_2.z;

        geometry3.addAttribute('position', new THREE.BufferAttribute(position3, 3));
        geometry3.computeBoundingSphere();
        var material3 = new EndMaterial({
            width: 10,
            color: new THREE.Color(0xff0000),
            opacity: 0.6,

            start: pos_1,
            end: pos_2,
            nearClip: nearClip
        });
        material3.transparent = true;


        var end = new THREE.Points(geometry3, material3);
        scene.add(end);


        var geometry2 = new THREE.PlaneGeometry(100, 100, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
        panel = new THREE.Mesh(geometry2, material);
        panel.position.z = -80;
        scene.add(panel);



        var geometry4 = new THREE.Geometry();
        geometry4.vertices.push(pos_1);
        geometry4.vertices.push(pos_2);

        var material4 = new THREE.LineBasicMaterial({
            color: 0x0000ff,
            depthTest: 0.0
        });
        var line4 = new THREE.Line(geometry4, material4);
        scene.add(line4);
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