﻿$(function () {
    var scene, camera, renderer;
    var cameraOrtho, sceneOrtho;
    var cubeGeometry, planeGeometry;
    var cubeMaterial, planeMaterial;
    var cube, plane;
    var controls, guiControls, datGUI, stats;
    var spriteTL, spriteTR, spriteBL, spriteBR, spriteC;

    /*variables for lights*/
    var ambient;
    
    function init() {
        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;
        /*creates empty scene object and renderer*/
        camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 5000);
        camera.position.z = 1500;

        cameraOrtho = new THREE.OrthographicCamera(-SCREEN_WIDTH / 2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, -SCREEN_HEIGHT / 2, 1, 10);
        cameraOrtho.position.z = 10;

        scene = new THREE.Scene();
        sceneOrtho = new THREE.Scene();

        // render
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.autoClear = false; // To allow render overlay on top of sprited sphere
        renderer.setSize(window.innerWidth, window.innerHeight);

        /*add controls*/
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);

        addObj();
        addDatGui();
        customize();
        
        $("#webGL-container").append(renderer.domElement);
        /*stats*/
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);
    }

    function customize() {
        var textureLoader = new THREE.TextureLoader();
        var start_tex = textureLoader.load('start_1.icon.png', createHUDSprites);
        var end_tex = textureLoader.load('end_1.icon.png');

        var end_mat = new THREE.SpriteMaterial({ map: end_tex, color: 0xff0000 });
        var sprite2 = new THREE.Sprite(end_mat);
        sprite2.position.set(-100, 50, 0);
        sprite2.scale.set(32, 32, 1.0); // imageWidth, imageHeight
        scene.add(sprite2);

        var end_mat = new THREE.SpriteMaterial({ map: end_tex, color: 0x00ff00 });
        var sprite2 = new THREE.Sprite(end_mat);
        sprite2.position.set(-0, 50, 0);
        sprite2.scale.set(32, 32, 1.0); // imageWidth, imageHeight
        scene.add(sprite2);

        var end_mat = new THREE.SpriteMaterial({ map: end_tex, color: 0x0000ff });
        var sprite2 = new THREE.Sprite(end_mat);
        sprite2.position.set(100, 50, 0);
        sprite2.scale.set(32, 32, 1.0); // imageWidth, imageHeight
        scene.add(sprite2);


        var spritey = makeTextSprite(" Hello, ", { fontsize: 24, borderColor: { r: 255, g: 0, b: 0, a: 1.0 }, backgroundColor: { r: 255, g: 100, b: 100, a: 0.8 } });
        spritey.position.set(-85, 105, 55);
        scene.add(spritey);

        var spritey = makeTextSprite(" World! ",
            { fontsize: 32, fontface: "Georgia", borderColor: { r: 0, g: 0, b: 255, a: 1.0 } });
        spritey.position.set(55, 105, 55);
        scene.add(spritey);
    };

    function createHUDSprites(texture) {

        var material = new THREE.SpriteMaterial({ map: texture });

        var width = material.map.image.width;
        var height = material.map.image.height;

        spriteTL = new THREE.Sprite(material);
        spriteTL.scale.set(width, height, 1);
        sceneOrtho.add(spriteTL);

        spriteTR = new THREE.Sprite(material);
        spriteTR.scale.set(width, height, 1);
        sceneOrtho.add(spriteTR);

        spriteBL = new THREE.Sprite(material);
        spriteBL.scale.set(width, height, 1);
        sceneOrtho.add(spriteBL);

        spriteBR = new THREE.Sprite(material);
        spriteBR.scale.set(width, height, 1);
        sceneOrtho.add(spriteBR);

        spriteC = new THREE.Sprite(material);
        spriteC.scale.set(width, height, 1);
        sceneOrtho.add(spriteC);

        updateHUDSprites();

    }

    function updateHUDSprites() {

        var width = window.innerWidth / 2;
        var height = window.innerHeight / 2;

        var material = spriteTL.material;

        var imageWidth = material.map.image.width / 2;
        var imageHeight = material.map.image.height / 2;

        spriteTL.position.set(-width + imageWidth, height - imageHeight, 1); // top left
        spriteTR.position.set(width - imageWidth, height - imageHeight, 1); // top right
        spriteBL.position.set(-width + imageWidth, -height + imageHeight, 1); // bottom left
        spriteBR.position.set(width - imageWidth, -height + imageHeight, 1); // bottom right
        spriteC.position.set(0, 0, 1); // center
    }

    function makeTextSprite(message, parameters) {
        if (parameters === undefined) parameters = {};

        var fontface = parameters.hasOwnProperty("fontface") ?
            parameters["fontface"] : "Arial";

        var fontsize = parameters.hasOwnProperty("fontsize") ?
            parameters["fontsize"] : 18;

        var borderThickness = parameters.hasOwnProperty("borderThickness") ?
            parameters["borderThickness"] : 4;

        var borderColor = parameters.hasOwnProperty("borderColor") ?
            parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 1.0 };

        var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
            parameters["backgroundColor"] : { r: 255, g: 255, b: 255, a: 1.0 };

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;

        // get size data (height depends only on font size)
        var metrics = context.measureText(message);
        var textWidth = metrics.width;

        // background color
        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
                                      + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
                                      + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;
        roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
        // 1.4 is extra height factor for text below baseline: g,j,p,q.

        // text color
        context.fillStyle = "rgba(0, 0, 0, 1.0)";

        context.fillText(message, borderThickness, fontsize + borderThickness);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(100, 50, 1.0);
        return sprite;
    }

    // function for drawing rounded rectangles
    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function addObj() {
        /*create cube*/
        cubeGeometry = new THREE.BoxGeometry(1, 2, 3);
        cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff3300 });
        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        /*create plane*/
        planeGeometry = new THREE.PlaneGeometry(100, 100, 100);
        planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        plane = new THREE.Mesh(planeGeometry, planeMaterial);

        /*position and add objects to scene*/
        plane.rotation.x = -.5 * Math.PI;
        plane.receiveShadow = true;
        scene.add(plane);

        cube.position.x = 2.5;
        cube.position.y = 4;
        cube.position.z = 2.5;
        cube.castShadow = true;
        scene.add(cube);

        /*scene lights*/
        ambient = new THREE.AmbientLight();
        scene.add(ambient);
    };

    function addDatGui() {
        /*datGUI controls object*/
        guiControls = new function () {
            this.rotationX = 0.0;
            this.rotationY = 0.0;
            this.rotationZ = 0.0;
            /*ambient light values*/
            this.ambColor = 0xdddddd;
        }

        /*ambient light parameters*/
        ambient.color.setHex(guiControls.ambColor);
        /*adds controls to scene*/
        datGUI = new dat.GUI();
        datGUI.add(guiControls, 'rotationX', 0, 1);
        datGUI.add(guiControls, 'rotationY', 0, 1);
        datGUI.add(guiControls, 'rotationZ', 0, 1);
        datGUI.addColor(guiControls, 'ambColor').onChange(function (value) {
            ambient.color.setHex(value);
        });
    };

    function render() {
        cube.rotation.x += guiControls.rotationX;
        cube.rotation.y += guiControls.rotationY;
        cube.rotation.z += guiControls.rotationZ;

        /*necessary to make lights function*/
        cubeMaterial.needsUpdate = true;
        planeMaterial.needsUpdate = true;

        renderer.clear();
        renderer.render(scene, camera);
        renderer.clearDepth();
        renderer.render(sceneOrtho, cameraOrtho);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
        renderer.render(scene, camera);
    }

    $(window).resize(function () {
        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;

        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();


        cameraOrtho.left = -SCREEN_WIDTH / 2;
        cameraOrtho.right = SCREEN_WIDTH / 2;
        cameraOrtho.top = SCREEN_HEIGHT / 2;
        cameraOrtho.bottom = -SCREEN_HEIGHT / 2;
        cameraOrtho.updateProjectionMatrix();

        updateHUDSprites();

        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    });

    init();
    animate();
});