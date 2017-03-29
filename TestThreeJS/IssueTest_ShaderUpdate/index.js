(function () {
    var scene, camera, renderer;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
    var code_vs, code_fs;
    var material;

    var init = function () {
        code_vs = document.getElementById('vertex_shader').textContent;
        code_fs = document.getElementById('fragment_shader').textContent;

        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(0x000000);
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 5000);
        camera.position.z = 400;
        var controls = new THREE.OrbitControls(camera, renderer.domElement);

        window.addEventListener('resize', function () {
            SCREEN_WIDTH = window.innerWidth;
            SCREEN_HEIGHT = window.innerHeight;
            camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
            camera.updateProjectionMatrix();
            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        }, true);
        document.getElementById('webGL-container').appendChild(renderer.domElement);

        addPlane();
        bindEvent();
    }

    var addPlane = function () {
        // material & geo
        material = new THREE.ShaderMaterial({
            vertexShader: code_vs,
            fragmentShader: code_fs
        });
        var geo = new THREE.PlaneBufferGeometry(128, 128);
        // mesh
        var planes= [];
        for (var i=0;i<4;i++){
            planes[i] = new THREE.Mesh(geo,material);
            planes[i].position.set(300-i*200, 0, -512);
            scene.add(planes[i]);
        }
    };

    var bindEvent = function () {
        var btn = document.querySelector('.toggleBtn');
        var isRed = false;
        var definedRed = '#define colorRed\n'

        btn.addEventListener('click',function(){
            isRed=!isRed;
            if (isRed){
                btn.style['background-color'] = '#993333';
                material.setValues({
                    fragmentShader: definedRed+code_fs
                });
            }else{
                btn.style['background-color'] = '#0066cc';
                material.setValues({
                    fragmentShader: code_fs
                });
            }            
            material.needsUpdate=true;
        },false);
    };
    
    var animate = function () {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    init();
    animate();
})();

