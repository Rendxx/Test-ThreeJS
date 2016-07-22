window.Rendxx = window.Rendxx || {};
window.Rendxx.Home = window.Rendxx.Home || {};

(function (HOME) {
    var Data = {
        bgColor: 0xeeeeee,
        ambientColor: 0xeeeeee,
        lightPos: [0, 40, 20],
        html: {
            'scene': {
                'interaction': '<div class="scene-interaction"></div>',
                'webgl': '<div class="scene-webgl"></div>'
            },
            'interaction': {
                'center': '<div class="_center"></div>'
            }
        }
    };

    HOME.Logo = function (container) {
        var that = this,
            html = {};

        // flag
        var isloaded = false;           // modle loaded

        // webgl
        var scene, camera, renderer,
            width = 0,
            height = 0,
            ambientLight, spotLight, spotTarget,
            grayPlane1,grayPlane2, bgPlane;

        // public -------------------------------------


        // private ------------------------------------
        var render = function () {

        };

        var animate= function () {
            requestAnimationFrame(animate);
            render();
            renderer.render(scene, camera);
        };

        var _resize = function () {
            width = html['scene']['webgl'].width();
            height = html['scene']['webgl'].height();
            if (camera != null) {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        };

        // setup --------------------------------------
        var _setupFunction = function () {

        };
        var _setupModel = function () {
            // Ambient
            ambientLight = new THREE.AmbientLight();
            ambientLight.color.setHex(Data.ambientColor);
            scene.add(ambientLight);

            // Spot
            spotTarget = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.1), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 }));
            spotTarget.position.set(0, 2.75, 0);
            scene.add(spotTarget);

            spotLight = new THREE.SpotLight();
            spotLight.castShadow = true;
            spotLight.shadow.mapSize.width = 4096;
            spotLight.shadow.mapSize.height = 4096;
            spotLight.shadow.bias = 0.0001;
            spotLight.shadow.far = 800;
            spotLight.shadow.near = 10;
            spotLight.exponent = 0.5;
            spotLight.angle = 1.570;
            spotLight.intensity = 1;
            spotLight.position.set(Data.lightPos[0], Data.lightPos[1], Data.lightPos[2]);
            scene.add(spotLight);

            // model
            // bg
            bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshBasicMaterial({ color: 0xeeeeee }));
            bgPlane.position.set(0, 0, -80);
            scene.add(bgPlane);

            //gray
            grayPlane1 = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshBasicMaterial({ color: 0xbbbbbb }));
            grayPlane1.position.set(0, 0, -77);
            grayPlane1.rotation.z = -Math.PI * 3 / 32;
            scene.add(grayPlane1);

            grayPlane2 = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshBasicMaterial({ color: 0xeeeeee }));
            grayPlane2.position.set(0, 0, -78);
            grayPlane2.rotation.z = -Math.PI * 3 / 32;
            scene.add(grayPlane2);

            // building
            var loader = new THREE.ObjectLoader();
            loader.load('/RendxxLogo/obj/City-2.json', function (obj) {
                obj.rotation.x = -Math.PI / 2;
                obj.rotation.y = -Math.PI / 3;
                obj.position.z = -76;
                scene.add(obj);
                isloaded = true;
            });
        };

        var _setupWebGL = function () {
            // basic
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 5000);
            renderer = new THREE.WebGLRenderer({ antialias: true });
            html['scene']['webgl'].append(renderer.domElement);

            renderer.setClearColor(Data.bgColor);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.soft = true;

            camera.position.set(0, 0, 20);
            camera.lookAt(scene.position);
        };

        var _setupHtml = function () {
            html = {};
            html['container'] = $(container);
            html['scene'] = {};
            html['scene']['interaction'] = $(Data.html['scene']['interaction']).appendTo(html['container']);
            html['scene']['webgl'] = $(Data.html['scene']['webgl']).appendTo(html['container']);
            width = html['scene']['webgl'].width();
            height = html['scene']['webgl'].height();
            
            html['interaction'] = {};
            html['interaction']['center'] = $(Data.html['interaction']['center']).appendTo(html['scene']['interaction']);
        };

        var _init = function () {
            _setupHtml();
            _setupWebGL();
            _setupModel();
            $(window).resize(_resize);
            animate();
        };
        _init();
    };
})(window.Rendxx.Home);