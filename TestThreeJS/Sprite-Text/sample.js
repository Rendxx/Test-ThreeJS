$(function () {
    var scene, camera, renderer;
    var cameraOrtho, sceneOrtho;
    var planeGeometry;
    var planeMaterial;
    var plane;
    var controls, guiControls;
    
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
        createHUDSprites();
        
        $("#webGL-container").append(renderer.domElement);
    }

    function createHUDSprites() {

        var spritey = makeTextSprite(" Hello, ", { fontsize: 60, color: { r: 255, g: 100, b: 100, a: 0.8 } });
        spritey.position.set(0, 0, 9);
        sceneOrtho.add(spritey);
    }

    var _helper_canvas = document.createElement('canvas');
    var _helper_canvas_ctx = _helper_canvas.getContext('2d');
    function makeTextSprite(message, parameters) {
        _helper_canvas_ctx.clearRect(0, 0, _helper_canvas.width, _helper_canvas.height);
        if (parameters === undefined) parameters = {};

        var fontface = parameters.hasOwnProperty("fontface") ?
            parameters["fontface"] : "Arial";

        var fontsize = parameters.hasOwnProperty("fontsize") ?
            parameters["fontsize"] : 18;

        var color = parameters.hasOwnProperty("color") ?
            parameters["color"] : { r: 255, g: 255, b: 255, a: 1.0 };

        var align = parameters.hasOwnProperty("align") ?
            parameters["align"] : "center";

        // set font parameter
        _helper_canvas_ctx.font = fontsize + "px " + fontface;
        //_helper_canvas_ctx.shadowColor = "black";
        //_helper_canvas_ctx.shadowBlur = 5;
        //_helper_canvas_ctx.textBaseline = 'top';

        // measure text
        var metrics = _helper_canvas_ctx.measureText(message);
        var width = parameters.hasOwnProperty("width") ?
            parameters["width"]  : Math.ceil(metrics.width);
        var height = parameters.hasOwnProperty("height") ?
            parameters["height"]  : fontsize;

        _helper_canvas.width = width;
        _helper_canvas.height = height;
        _helper_canvas_ctx.font = fontsize + "px " + fontface;

        // text 
        _helper_canvas_ctx.fillStyle = "rgba(" + color.r + "," + color.g + ","
                                      + color.b + "," + color.a + ")";
        _helper_canvas_ctx.fillText(message, 0, (_helper_canvas.height + fontsize) / 2);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(_helper_canvas);
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(width, height, 1.0);
        return sprite;
    }
    
    function addObj() {
        /*create plane*/
        planeGeometry = new THREE.PlaneGeometry(100, 100, 100);
        planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        plane = new THREE.Mesh(planeGeometry, planeMaterial);

        /*position and add objects to scene*/
        plane.receiveShadow = true;
        scene.add(plane);

        /*scene lights*/
        ambient = new THREE.AmbientLight();
        scene.add(ambient);
    };

    function render() {
        planeMaterial.needsUpdate = true;

        renderer.clear();
        renderer.render(scene, camera);
        renderer.clearDepth();
        renderer.render(sceneOrtho, cameraOrtho);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
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
        
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    });

    init();
    animate();
});