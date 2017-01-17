var fileLoader = function (pathArr, cb) {
    if (!pathArr || pathArr.length===0) return;

    // --------------------------------------------
    var readFile = function (idx, path, cb){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', path);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE){
                if (xhr.status === 200) {
                    cb(idx, xhr.responseText);
                } else {
                    alert('File load fail');
                }
            }
        }
        xhr.send();
    };
    // --------------------------------------------

    var count = pathArr.length;
    var contentArr = [];
    var onFileLoad = function (idx, content){
        contentArr[idx] = content;
        if (--count <= 0) cb(contentArr);
    };

    for (var i=0;i< pathArr.length;i++) 
        readFile(i, pathArr[i], onFileLoad);
};

$(function () {
    var scene, camera, renderer;

    var container = $("#webGL-container")[0];

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;



    function init() {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        /*creates empty scene object and renderer*/
        camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 5000);
        camera.position.z = 0;

        scene = new THREE.Scene();

        // render
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000);
        renderer.autoClear = false; // To allow render overlay on top of sprited sphere
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        fileLoader(['point.vs','point.fs'], function(content){
            addMesh(content[0], content[1]);
        });

        $("#webGL-container").append(renderer.domElement);
    }

    function addMesh(vs, fs) {
        // material
        var material = new THREE.ShaderMaterial({
            vertexShader: vs,
            fragmentShader: fs
        });

        // geometry
        var position = new Float32Array(10 * 3);
        var radius = new Float32Array(10);
        for (var i = 0; i < 10; i++) {
            var t = i * 50;
            position[i * 3 + 0] = t;
            position[i * 3 + 1] = t;
            position[i * 3 + 2] = -t;
            radius[i] = i;
        }

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(position, 3));
        geometry.addAttribute('radius', new THREE.BufferAttribute(radius, 1));

        var mesh = new THREE.Points(geometry, material);
        mesh.position.set(-250, -250, -400);
        scene.add(mesh);
    };

    function render() {
        renderer.clear();
        renderer.render(scene, camera);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
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