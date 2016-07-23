﻿window.Rendxx = window.Rendxx || {};
window.Rendxx.Home = window.Rendxx.Home || {};

(function (HOME) {
    var Data = {
        bgColor: 0xeeeeee,
        ambientColor: 0x150D09,
        lightPos: [10,10, 10],
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
            html = {},
            tween = {};

        // flag
        var isloaded = false;           // modle loaded

        // webgl
        var scene, camera, renderer,
            width = 0,
            height = 0,
            ambientLight, spotLight, spotTarget,
            grayPlane, grayPlane1, grayPlane2, bgPlane, building, groundLogo, logoGrp;

        // public -------------------------------------


        // private ------------------------------------
        var render = function () {

        };

        var animate= function () {
            requestAnimationFrame(animate);
            TWEEN.update();
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
        var _setupInteraction = function () {
            html['interaction']['center'].mouseenter(function () {
                tween['mouseLeave'].stop();
                tween['mouseEnter'].start();
            });
            html['interaction']['center'].mouseleave(function () {
                tween['mouseEnter'].stop();
                tween['mouseLeave'].start();
            });
            html['interaction']['center'].click(function () {
                html['interaction']['center'].unbind('mouseenter').unbind('mouseleave').unbind('click');
                tween['mouseClick'].start();
            });
        };
        var _setupAnimation = function () {
            tween = {};

            var tweenData = { t: 0};
            var radian_diff_1 = (Math.PI / 6 + Math.PI * 3 / 32) / 20,
                radian_origin_1 = -Math.PI * 3 / 32,
                radian_diff_2 = (Math.PI / 12) / 20,
                radian_origin_2 = 0,
                posZ_diff = 10 / 20,
                posZ_origin = -76;
            tween['mouseEnter'] = new TWEEN.Tween(tweenData).to({ t: 20 }, 800)
                        .onUpdate(function () {
                            grayPlane.rotation.z = radian_origin_1 + radian_diff_1 * tweenData.t;
                            logoGrp.rotation.z = radian_origin_2 + radian_diff_2 * tweenData.t;
                            logoGrp.position.z = posZ_origin + posZ_diff * tweenData.t;
                        }).easing(TWEEN.Easing.Quadratic.InOut);
            tween['mouseLeave'] = new TWEEN.Tween(tweenData).to({ t: 0 }, 800)
                        .onUpdate(function () {
                            grayPlane.rotation.z = radian_origin_1 + radian_diff_1 * tweenData.t;
                            logoGrp.rotation.z = radian_origin_2 + radian_diff_2 * tweenData.t;
                            logoGrp.position.z = posZ_origin + posZ_diff * tweenData.t;
                        }).easing(TWEEN.Easing.Quadratic.InOut);
            tween['mouseClick'] = new TWEEN.Tween(tweenData).to({ t: 60 }, 1600)
                        .onUpdate(function () {
                            var t = tweenData.t;
                            if (t <= 20) {
                                grayPlane.rotation.z = radian_origin_1 + radian_diff_1 * t;
                            } else if (t <= 30) {
                                //grayPlane1.material.opacity = (30 - t) / 10;
                                grayPlane2.material.opacity = (30 - t) / 10;
                            } 
                            logoGrp.rotation.z = radian_origin_2 + radian_diff_2 * t;
                            logoGrp.position.z = posZ_origin + posZ_diff * t;

                            if (t > 20) {
                                logoGrp.rotation.x = (t - 20) * Math.PI * 5 / 320;
                                camera.position.y = (t - 20) * -0.05;
                                camera.position.z = 20+(t - 20) * -0.1;
                                camera.lookAt(scene.position);
                            }
                        }).onComplete(function () {
                            logoGrp.remove(grayPlane);
                            scene.remove(bgPlane);
                        }).easing(TWEEN.Easing.Quadratic.InOut);
        };

        var _setupModel = function () {
            // Ambient
            ambientLight = new THREE.AmbientLight();
            ambientLight.color.setHex(Data.ambientColor);
            scene.add(ambientLight);

            // Spot
            spotTarget = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.1), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 }));
            spotTarget.position.set(0, -6, 0);
            scene.add(spotTarget);

            spotLight = new THREE.SpotLight();
            spotLight.castShadow = true;
            spotLight.shadow.mapSize.width = 4096;
            spotLight.shadow.mapSize.height = 4096;
            spotLight.shadow.bias = 0.0001;
            spotLight.shadow.far = 100;
            spotLight.shadow.fov = 100;
            spotLight.shadow.near = 1;
            spotLight.distance =100;
            spotLight.decay = 1;
            spotLight.angle = 1;
            spotLight.intensity = 1.4;
            scene.add(spotLight);

            // model
            // bg
            bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshBasicMaterial({ color: 0xeeeeee }));
            bgPlane.position.set(0, 0, -80);
            scene.add(bgPlane);

            // logoGrp
            logoGrp = new THREE.Object3D();
            logoGrp.position.set(0, 0, -76);
            scene.add(logoGrp);
            spotLight.position.set(Data.lightPos[0], Data.lightPos[1], Data.lightPos[2]);
            spotLight.target = logoGrp;
            
            //gray
            grayPlane = new THREE.Object3D();
            grayPlane1 = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshBasicMaterial({ color: 0xbbbbbb,transparent:true,side:THREE.FrontSide }));
            grayPlane1.position.set(0, 0, 0.1);
            grayPlane.add(grayPlane1);

            grayPlane2 = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshBasicMaterial({ color: 0xeeeeee, transparent: true }));
            grayPlane2.position.set(0, 0, -0);
            grayPlane.add(grayPlane2);

            grayPlane.position.set(0, 0, -2.45);
            grayPlane.rotation.z = -Math.PI * 3 / 32;
            logoGrp.add(grayPlane);

            // building
            var loader = new THREE.ObjectLoader();
            loader.load('/RendxxLogo/obj/City-2.json', function (obj) {
                building = obj;
                obj.rotation.x = -Math.PI / 2;
                obj.rotation.y = Math.PI / 6;
                obj.position.z =0;
                logoGrp.add(obj);

                groundLogo = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("/RendxxLogo/obj/ground_logo.png"), transparent: true, side: THREE.FrontSide }));
                groundLogo.rotation.z = Math.PI / 3;
                groundLogo.position.z = 0.2;
                logoGrp.add(groundLogo);
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
            _setupAnimation();
            _setupInteraction();
            $(window).resize(_resize);
            animate();
        };
        _init();
    };
})(window.Rendxx.Home);