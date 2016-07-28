$(function () {
    var scene, camera, renderer;
    var controls, datGUI, stats;
    var container = $("#webGL-container")[0];
    var raycaster = new THREE.Raycaster();
    var panel = [];

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

        container.addEventListener('mousemove', onMouseMove, false);
    }

    function addObj() {
        var size2 = 50;
        var posArr = [
            [-size2, 0, 0],
            [0, 0, -size2],
            [size2, 0, 0],
                [0, size2, 0],
            [0, -size2, 0]
        ];
        var colorArr = [
            0x000088,
            0x008800,
            0x880000,
            0x888800,
            0x008888
        ];
        var rotateArr = [
            [0, Math.PI / 2, 0],
            [0, 0, 0],
            [0, -Math.PI / 2, 0],
                [Math.PI / 2, 0, 0],
                [-Math.PI / 2, 0, 0]
        ];
        for (var i = 0, l = posArr.length; i < l; i++) {
            panel[i] = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({ color: colorArr[i] }));
            panel[i].position.set(posArr[i][0], posArr[i][1], posArr[i][2]);
            panel[i].rotation.set(rotateArr[i][0], rotateArr[i][1], rotateArr[i][2]);
            panel[i].name = i;
            scene.add(panel[i]);
        }
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


    var onClickPosition = new THREE.Vector2();
    var mouse = new THREE.Vector2();
    var getMousePosition = function (dom, x, y) {
        var rect = dom.getBoundingClientRect();
        return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
    };

    var getIntersects = function (point, objects) {
        mouse.set((point.x * 2) - 1, -(point.y * 2) + 1);
        raycaster.setFromCamera(mouse, camera);
        return raycaster.intersectObjects(objects);
    };

    function onMouseMove(evt) {
        evt.preventDefault();
        var array = getMousePosition(container, evt.clientX, evt.clientY);
        onClickPosition.fromArray(array);

        var intersects = getIntersects(onClickPosition, panel);

        if (intersects.length > 0 && intersects[0].uv) {
            var uv = intersects[0].uv;
            var name = intersects[0].object.name;
            console.log(name+ ": "+uv.x+", "+uv.y);
        }

    };

    init();
    animate();
});