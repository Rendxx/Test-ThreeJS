$(function () {
    var scene, camera, renderer;
    var cube;

    var controls, datGUI, stats;
    var container = $("#webGL-container")[0];

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

    function init() {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        /*creates empty scene object and renderer*/
        camera = new THREE.PerspectiveCamera(27, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 5000);
        camera.position.z = 2750;

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x050505, 2000, 3500);

        // render
        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000);
        renderer.autoClear = false; // To allow render overlay on top of sprited sphere
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        /*add controls*/
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', function () {
            render();
        });

        addLight();

        addObj();

        $("#webGL-container").append(renderer.domElement);
        /*stats*/
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);

        /*scene lights*/
        ambient = new THREE.AmbientLight();
        scene.add(ambient);
    }

    function addLight() {
        var light1 = new THREE.DirectionalLight(0xffffff, 0.5);
        light1.position.set(1, 1, 1);
        scene.add(light1);

        var light2 = new THREE.DirectionalLight(0xffffff, 1.5);
        light2.position.set(0, -1, 0);
        scene.add(light2);
        scene.add(new THREE.AmbientLight(0x444444));
    };

    function addObj() {
        var triangles = 160000;

        var geometry = new THREE.BufferGeometry();

        var positions = new Float32Array(triangles * 3 * 3);
        var normals = new Float32Array(triangles * 3 * 3);
        var colors = new Float32Array(triangles * 3 * 3);

        var color = new THREE.Color();

        var n = 800, n2 = n / 2;	// triangles spread in the cube
        var d = 12, d2 = d / 2;	// individual triangle size


        var pA = new THREE.Vector3();
        var pB = new THREE.Vector3();
        var pC = new THREE.Vector3();

        var cb = new THREE.Vector3();
        var ab = new THREE.Vector3();

        for (var i = 0; i < positions.length; i += 9) {

            // positions

            var x = Math.random() * n - n2;
            var y = Math.random() * n - n2;
            var z = Math.random() * n - n2;

            var ax = x + Math.random() * d - d2;
            var ay = y + Math.random() * d - d2;
            var az = z + Math.random() * d - d2;

            var bx = x + Math.random() * d - d2;
            var by = y + Math.random() * d - d2;
            var bz = z + Math.random() * d - d2;

            var cx = x + Math.random() * d - d2;
            var cy = y + Math.random() * d - d2;
            var cz = z + Math.random() * d - d2;

            positions[i] = ax;
            positions[i + 1] = ay;
            positions[i + 2] = az;

            positions[i + 3] = bx;
            positions[i + 4] = by;
            positions[i + 5] = bz;

            positions[i + 6] = cx;
            positions[i + 7] = cy;
            positions[i + 8] = cz;

            // flat face normals

            pA.set(ax, ay, az);
            pB.set(bx, by, bz);
            pC.set(cx, cy, cz);

            cb.subVectors(pC, pB);
            ab.subVectors(pA, pB);
            cb.cross(ab);

            cb.normalize();

            var nx = cb.x;
            var ny = cb.y;
            var nz = cb.z;

            normals[i] = nx;
            normals[i + 1] = ny;
            normals[i + 2] = nz;

            normals[i + 3] = nx;
            normals[i + 4] = ny;
            normals[i + 5] = nz;

            normals[i + 6] = nx;
            normals[i + 7] = ny;
            normals[i + 8] = nz;

            // colors

            var vx = (x / n) + 0.5;
            var vy = (y / n) + 0.5;
            var vz = (z / n) + 0.5;

            color.setRGB(vx, vy, vz);

            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;

            colors[i + 3] = color.r;
            colors[i + 4] = color.g;
            colors[i + 5] = color.b;

            colors[i + 6] = color.r;
            colors[i + 7] = color.g;
            colors[i + 8] = color.b;

        }

        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
        geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

        geometry.computeBoundingSphere();

        var material = new THREE.MeshPhongMaterial({
            color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
            side: THREE.DoubleSide, vertexColors: THREE.VertexColors
        });

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
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