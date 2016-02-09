$(function () {
    var scene, camera, renderer;
    var controls, guiControls, datGUI;
    var axis, grid, color;
    var stats;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
    var sk_helper;

    var action = {}, mixer, fadeAction;

    var clock = new THREE.Clock();
    /*variables for lights*/


    function init() {
        /*creates empty scene object and renderer*/
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 5000);
        renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setClearColor(0x000000);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;

        /*add controls*/
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);

        /*adds helpers*/
        axis = new THREE.AxisHelper(10);
        scene.add(axis);

        grid = new THREE.GridHelper(50, 5);
        color = new THREE.Color("rgb(255,0,0)");
        grid.setColors(color, 0x000000);
        /*scene.add(grid);*/

        camera.position.x = 40;
        camera.position.y = 40;
        camera.position.z = 40;
        camera.lookAt(scene.position);

        // Ambient
        var light = new THREE.AmbientLight();
        light.color.setHex(0x333333);
        scene.add(light);

        // dat gui
        guiControls = {
            animation1: function () {
                fadeAction('t1');
            },
            animation2: function () {
                fadeAction('t2');
            }
        };
        datGUI = new dat.GUI();
        datGUI.add(guiControls, 'animation1');
        datGUI.add(guiControls, 'animation2');

        $("#webGL-container").append(renderer.domElement);
        // status track
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);

        //AddBlenderMesh('table.2.json');
        AddBlenderMesh('player-2.json');
    }

    function AddBlenderMesh(file) {
        var loader = new THREE.JSONLoader();
        var mesh = null;
        loader.load(file, function (geometry, materials) {
            //for (var i = 0; i < materials.length; i++) {
            //    materials[i].skinning = true;
            //}
            //mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
            mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            //action.t1 = new THREE.AnimationAction(geometry.animations[0]);
            //action.t2 = new THREE.AnimationAction(geometry.animations[1]);
            //action.t1.weight = 1;
            //action.t2.weight = 0;

            //mixer = new THREE.AnimationMixer(mesh);
            //mixer.addAction(action.t1);
            //mixer.addAction(action.t2);

            scene.add(mesh);

            //sk_helper = new THREE.SkeletonHelper(mesh);
            //scene.add(sk_helper);
        });
    }

    function render() {
        /*necessary to make lights function*/
        //cubeMaterial.needsUpdate = true;
        //torMaterial.needsUpdate = true;
    }


    fadeAction = function () {
        var activeActionName = 't1';
        return function (name) {
            if (name == activeActionName) return;
            mixer.crossFade(action[activeActionName], action[name], .3);
            activeActionName = name;
        };
    }();


    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
        if (sk_helper) sk_helper.update();

        var delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        renderer.render(scene, camera);
    }

    $(window).resize(function () {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;

        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();

        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    });

    init();
    animate();
});