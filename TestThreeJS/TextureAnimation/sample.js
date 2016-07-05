$(function () {
    var scene, camera, renderer;
    var controls, guiControls;
    var plane;
    var annie;
    var clock = new THREE.Clock();
    
    function init() {
        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;
        /*creates empty scene object and renderer*/
        camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 5000);
        camera.position.z = 1500;

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
    };
    

    function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
        // note: texture passed by reference, will be updated by the update function.

        this.tilesHorizontal = tilesHoriz;
        this.tilesVertical = tilesVert;
        // how many images does this spritesheet contain?
        //  usually equals tilesHoriz * tilesVert, but not necessarily,
        //  if there at blank tiles at the bottom of the spritesheet. 
        this.numberOfTiles = numTiles;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

        // how long should each image be displayed?
        this.tileDisplayDuration = tileDispDuration;

        // how long has the current image been displayed?
        this.currentDisplayTime = 0;

        // which image is currently being displayed?
        this.currentTile = 0;

        this.update = function (milliSec) {
            this.currentDisplayTime += milliSec;
            while (this.currentDisplayTime > this.tileDisplayDuration) {
                this.currentDisplayTime -= this.tileDisplayDuration;
                this.currentTile++;
                if (this.currentTile == this.numberOfTiles)
                    this.currentTile = 0;
                var currentColumn = this.currentTile % this.tilesHorizontal;
                texture.offset.x = currentColumn / this.tilesHorizontal;
                var currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
                texture.offset.y = -currentRow / this.tilesVertical;
            }
        };
    }

    function addObj() {
        var runnerTexture = new THREE.ImageUtils.loadTexture('effort.blood.png');
        annie = new TextureAnimator(runnerTexture, 4, 4, 15, 50); // texture, #horiz, #vert, #total, duration.
        var runnerMaterial = new THREE.MeshBasicMaterial({ map: runnerTexture, transparent: true });
        var runnerGeometry = new THREE.PlaneGeometry(128, 128, 1, 1);
        var runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
        runner.position.set(0, 0, 10);
        scene.add(runner);

        /*create plane*/
        var planeGeometry = new THREE.PlaneGeometry(500, 500, 100);
        var planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        plane = new THREE.Mesh(planeGeometry, planeMaterial);

        /*position and add objects to scene*/
        plane.receiveShadow = true;
        scene.add(plane);

        /*scene lights*/
        ambient = new THREE.AmbientLight();
        scene.add(ambient);
    };

    function render() {
        var delta = clock.getDelta();
        annie.update(1000 * delta);
        renderer.clear();
        renderer.render(scene, camera);
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
        
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    });

    init();
    animate();
});