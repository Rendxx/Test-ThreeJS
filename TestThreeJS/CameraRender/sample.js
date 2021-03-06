﻿$(function () {
    var scene, cameraAll, cameraPlayer, renderer;
    var controls, guiControls, datGUI;
    var axis, grid, light;
    var stats;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
    var mesh, walls;
    var light;

    function init() {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        /*creates empty scene object and renderer*/
        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer({ antialias: true });
        //renderer.autoClear = false; // To allow render overlay on top of sprited sphere

        renderer.setClearColor(0x000000);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        cameraSetup();

        /*add controls*/
        controls = new THREE.OrbitControls(cameraAll, renderer.domElement);
        controls.addEventListener('change', render);

        /*adds helpers*/
        axis = new THREE.AxisHelper(10);
        scene.add(axis);

        grid = new THREE.GridHelper(50, 5);
        color = new THREE.Color("rgb(255,0,0)");
        grid.setColors(color, 0x000000);
        /*scene.add(grid);*/

        addStuff();

        arrayOfLights = [
            new THREE.AmbientLight(),
            new THREE.SpotLight()
        ];

        var lightTarget = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({ color: 0xff3300 }));
        scene.add(lightTarget);

        // Ambient
        arrayOfLights[0].color.setHex(guiControls.ambient.ambColor);
        scene.add(arrayOfLights[0]);


        datGUI = new dat.GUI();
        /*ambient light controls*/
        var ambFolder = datGUI.addFolder('Ambient Light');
        ambFolder.addColor(guiControls.ambient, 'ambColor').onChange(function (value) {
            arrayOfLights[0].color.setHex(value);
        });

        $("#webGL-container").append(renderer.domElement);
        // status track
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);

        AddBlenderMesh('cabinet_b.1.json');
    }

    function addStuff() {
        /*create plane*/
        planeGeometry = new THREE.PlaneGeometry(100, 100, 100);
        planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        plane = new THREE.Mesh(planeGeometry, planeMaterial);

        /*position and add objects to scene*/
        plane.rotation.x = -.5 * Math.PI;
        plane.receiveShadow = true;
        scene.add(plane);

        /*add wall*/
        walls = [];
        var createWall = function (z, x, len, wid, rotate, deep) {
            var cubeGeometry = new THREE.BoxGeometry(len, deep || 16, wid);
            var cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xbb44bb });
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

            cube.rotation.y = rotate / 180 * Math.PI;
            cube.position.x = x;
            cube.position.y = 8;
            cube.position.z = z
            cube.castShadow = true;
            cube.receiveShadow = true;
            scene.add(cube);

            walls.push(cube);
        }
        createWall(0, 10, 20, 2, 90);
        createWall(11, 7, 8, 2, 0);
        createWall(4, 4, 12, 2, 90);
        createWall(-11, 3, 16, 2, 0);
        createWall(-3, 0, 10, 2, 0);

        guiControls = {
            ambient: {
                ambColor: 0x999999
            }
        };
    };

    function cameraSetup() {
        // camera

        cameraAll = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 400);
        scene.add(cameraAll);

        //cameraPlayer = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 400);
        //scene.add(cameraPlayer);

        cameraAll.position.x = 40;
        cameraAll.position.y = 40;
        cameraAll.position.z = 40;
        cameraAll.lookAt(scene.position);

    };
    
    function cameraUpdate () {
        renderer.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        renderer.clear();

        renderer.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        renderer.render(scene, cameraAll);
    };

    function AddBlenderMesh(file) {
        var loader = new THREE.JSONLoader();
        loader.load(file, function (geometry, materials) {
            for (var i = 0; i < materials.length; i++) {
                materials[i].skinning = true;
            }
            mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            //mesh.skeleton.bones[0].rotation.x = Math.PI/2;

            scene.add(mesh);
        });
    }

    function render() {
        /*necessary to make lights function*/
        //cubeMaterial.needsUpdate = true;
        //torMaterial.needsUpdate = true;
        planeMaterial.needsUpdate = true;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
        //cameraUpdate();
        renderer.render(scene, cameraAll);
    }

    $(window).resize(function () {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;

        //camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        //camera.updateProjectionMatrix();

        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    });

    init();
    animate();
});

