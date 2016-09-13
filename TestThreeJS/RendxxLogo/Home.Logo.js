window.Rendxx = window.Rendxx || {};
window.Rendxx.Home = window.Rendxx.Home || {};

(function (HOME) {
    'use strict';
    var Data = {
        bgColor: 0xeeeeee,
        ambientColor: 0x150D09,
        lightPos: [5, 20, 15],
        rotateSpeed: Math.PI / 120,
        root: '/RendxxLogo/logoModel/',
        html: {
            'scene': {
                'interaction': '<div class="scene-interaction"></div>',
                'webgl': '<div class="scene-webgl"></div>',
                'front': '<div class="scene-front"></div>',
                'back': '<div class="scene-back"></div>'
            },
            'interaction': {
                'center': '<div class="_center"></div>'
            },
            'words': '<div class="_words">KEEP CALM & CARRY ON</div>',
            'cloud': '<div class="_cloud"></div>'
        }
    };

    HOME.Logo = function (container) {
        var that = this,
            html = {},
            tween = {};

        // flag
        var isloaded = false,               // model loaded
            isInited = false,               // model init. move to view position
            mousedown = false;

        // webgl
        var scene, camera, renderer,
            width = 0,
            height = 0,
            ambientLight, spotLight, spotTarget,
            grayPlane, grayPlane1, grayPlane2, bgPlane, building, groundLogo, logoGrp, logoGrpWrap,
            lineGrp, arc, pointer, pointerInner;

        // cache
        var getMousePos = null;
        var mousePos = [0, 0],
            current = [0, 0],
            rotation = [0, 0],
            original_modelRotation = [0, 0],
            mouseDownRotation = [0, 0],
            centerWid = 0,
            centerHeight = 0;

        // public -------------------------------------


        // private ------------------------------------
        var render = function () {
            if (!isInited || !mousedown) return;
            rotation[0] = (mousePos[0] - mouseDownRotation[0]) / (centerWid);
            rotation[1] = -(mousePos[1] - mouseDownRotation[1]) / (centerHeight);
            mouseDownRotation = [mousePos[0], mousePos[1]];
            rotation[0] *= (1 - Math.abs(rotation[0] + current[0]));
            rotation[1] *= (1 - Math.abs(rotation[1] + current[1]));

            current[0] = Math.max(Math.min(rotation[0] + current[0], 1),-1);
            current[1] = Math.max(Math.min(rotation[1] + current[1], 1), -1);

            logoGrp.rotation.z = -current[0] * Math.PI / 2 + original_modelRotation[0];
            logoGrpWrap.rotation.x = -current[1] * Math.PI / 2;

            pointer.rotation.z = -current[0] * Math.PI / 4;
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
            centerWid = html['interaction']['center'].width();
            centerHeight = html['interaction']['center'].height();
            if (camera != null) {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        };


        var _startDrag = function (e) {
            if (!isInited) return;
            e.preventDefault();
            mousedown = true;
            if (getMousePos === null) _setupMouseFunc(e);
            html['scene']['interaction'].bind("mousemove", _onDrag);
            html['scene']['interaction'].bind("touchmove", _onDrag);
            mousePos = mouseDownRotation = getMousePos(e);
            tween['mouseLeave2'].stop();
            tween['mouseEnter2'].start();
        };

        var _onDrag = function (e) {
            if (!isInited) return;
            e.preventDefault();
            mousePos = getMousePos(e);
        };

        var _stopDrag = function (e) {
            if (!isInited||!mousedown) return;
            mousedown = false;
            html['scene']['interaction'].unbind("mousemove", _onDrag);
            html['scene']['interaction'].unbind("touchmove", _onDrag);
            tween['mouseEnter2'].stop();
            tween['mouseLeave2'].start();
            e.preventDefault();
        };

        // setup --------------------------------------
        var _setupMouseFunc = function (e2) {
            if (e2.pageX == undefined) {
                getMousePos = function (e) {
                    return [e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY];
                }
            } else {
                getMousePos = function (e) {
                    return [e.pageX, e.pageY];
                }
            }
        };

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
                html['words'].css({
                    'transform': 'translateX(0)',
                    'opacity': 1
                });
            });
            html['scene']['interaction'].bind("mousedown", _startDrag);
            html['scene']['interaction'].bind("touchstart", _startDrag);

            $('body').bind("mouseup", _stopDrag);
            $('body').bind("touchend", _stopDrag);
            $('body').bind("mouseleave", _stopDrag);
        };

        var _setupAnimation = function () {
            tween = {};

            var tweenData = { t: 0, t2: 0};
            var radian_diff_1 = (Math.PI / 6 + Math.PI * 3 / 32) / 20,
                radian_origin_1 = -Math.PI * 3 / 32,
                radian_diff_2 = (Math.PI / 12) / 20,
                radian_origin_2 = 0,
                posZ_diff = 10 / 20,
                posZ_origin = 120;
            tween['mouseEnter'] = new TWEEN.Tween(tweenData).to({ t: 20 }, 800)
                        .onUpdate(function () {
                            grayPlane.rotation.z = radian_origin_1 + radian_diff_1 * tweenData.t;
                            logoGrp.rotation.z = radian_origin_2 + radian_diff_2 * tweenData.t;
                            camera.position.z = posZ_origin - posZ_diff * tweenData.t;
                        }).easing(TWEEN.Easing.Quadratic.InOut);
            tween['mouseLeave'] = new TWEEN.Tween(tweenData).to({ t: 0 }, 800)
                        .onUpdate(function () {
                            grayPlane.rotation.z = radian_origin_1 + radian_diff_1 * tweenData.t;
                            logoGrp.rotation.z = radian_origin_2 + radian_diff_2 * tweenData.t;
                            camera.position.z = posZ_origin - posZ_diff * tweenData.t;
                        }).easing(TWEEN.Easing.Quadratic.InOut);

            tween['mouseEnter2'] = new TWEEN.Tween(tweenData).to({ t2: 10 }, 300)
                        .onUpdate(function () {
                            var t = tweenData.t2;
                            arc.material.opacity = t / 20;
                            pointerInner.material.opacity = t / 10;
                            lineGrp.position.x = 0.1 * t-1;
                        }).easing(TWEEN.Easing.Quadratic.InOut);
            tween['mouseLeave2'] = new TWEEN.Tween(tweenData).to({ t2: 0 }, 300)
                        .onUpdate(function () {
                            var t = tweenData.t2;
                            arc.material.opacity = t / 20;
                            pointerInner.material.opacity = t / 10;
                            lineGrp.position.x = 0.1 * t-1;
                        }).easing(TWEEN.Easing.Quadratic.InOut);

            tween['mouseClick'] = new TWEEN.Tween(tweenData).to({ t: 60 }, 1600)
                        .onUpdate(function () {
                            var t = tweenData.t;
                            if (t <= 20) {
                                grayPlane.rotation.z = radian_origin_1 + radian_diff_1 * t;
                            } else if (t>30 && t<=40) {
                                //grayPlane1.material.opacity = (30 - t) / 10;
                                grayPlane2.material.opacity = (40 - t) / 10;
                            } 
                            logoGrp.rotation.z = radian_origin_2 + radian_diff_2 * t;
                            camera.position.z = posZ_origin - posZ_diff * t;

                            if (t > 20) {
                                logoGrp.position.z = (-t + 20) / 10;
                                logoGrp.rotation.x = (t - 20) * Math.PI * 5 / 320;
                                camera.position.y = (t - 20) * -0.05;
                                camera.lookAt(scene.position);
                            }
                        }).onStart(function () {
                            html['interaction']['center'].remove();
                        }).onComplete(function () {
                            isInited = true;
                            original_modelRotation = [logoGrp.rotation.z, logoGrp.rotation.x];
                            logoGrp.remove(grayPlane);
                            html['cloud'].css('opacity',1);
                        }).easing(TWEEN.Easing.Quadratic.InOut);
        };

        var _setupLine = function () {

            //lineGrp, arc, marker;
            lineGrp = new THREE.Object3D();
            lineGrp.position.y = 3;
            lineGrp.position.x = 4;
            //lineGrp.rotation.z = Math.PI  / 4;
            lineGrp.rotation.x = Math.PI;
            scene.add(lineGrp);
            
            // cricle
            var lineGeometry1 = new THREE.CircleGeometry(16, 64, -Math.PI*1 / 4, Math.PI / 2);
            var lineGeometry2 = new THREE.CircleGeometry(15.5, 64, -Math.PI * 1 / 4, Math.PI /2);
            var lineGeometry = new THREE.Geometry();

            var i = 1;
            for (; i < 65; i++) {
                lineGeometry.vertices.push(lineGeometry1.vertices[i]);
                if (i % 4 === 1) {
                    lineGeometry.vertices.push(lineGeometry2.vertices[i]);
                    lineGeometry.vertices.push(lineGeometry1.vertices[i]);
                }
            }
            lineGeometry.vertices.push(lineGeometry1.vertices[i]);
            lineGeometry.vertices.push(lineGeometry2.vertices[i]);
            lineGeometry.vertices.push(lineGeometry1.vertices[i]);

            var lineMaterial = new THREE.LineBasicMaterial({
                color: 0x888888,
                linewidth:2,
                transparent:true,
                opacity: 0
            });

            arc = new THREE.Line(lineGeometry, lineMaterial);
            lineGrp.add(arc);

            // pointer
            var geometryPointer = new THREE.BoxGeometry(3,0.2);
            var MaterialPointer = new THREE.MeshBasicMaterial({
                color: 0x666666,
                transparent: true,
                opacity: 0
            });
            pointer = new THREE.Object3D();
            lineGrp.add(pointer);

            pointerInner = new THREE.Mesh(geometryPointer, MaterialPointer);
            pointerInner.position.x = 15.2;
            pointerInner.position.z = -0.1;
            pointer.add(pointerInner);
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
            spotLight.distance =200;
            spotLight.decay = 1;
            spotLight.angle = 1;
            spotLight.intensity = 1;
            scene.add(spotLight);

            var maxAnisotropy = renderer.getMaxAnisotropy();
            // model
            // logoGrp
            logoGrpWrap = new THREE.Object3D();
            scene.add(logoGrpWrap);

            logoGrp = new THREE.Object3D();
            logoGrp.position.set(0, 0, 0);
            logoGrpWrap.add(logoGrp);
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
            groundLogo = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture(Data.root + "ground_logo.png"), transparent: true, side: THREE.FrontSide }));
            groundLogo.rotation.z = Math.PI / 3;
            groundLogo.position.z = 0.2;
            groundLogo.material.map.anisotropy = maxAnisotropy;
            logoGrp.add(groundLogo);

            var loader = new THREE.ObjectLoader();
            //loader.load(Data.root + 'City-2.json', function (obj) {
            //    building = obj;
            //    obj.rotation.x = -Math.PI / 2;
            //    obj.rotation.y = Math.PI / 6;
            //    obj.position.z =0;
            //    logoGrp.add(obj);
            //    isloaded = true;
            //});

            var textureLoader = new THREE.TextureLoader();
            loader.load(Data.root + 'City-2.json', function (obj) {
                building = obj;
                obj.rotation.x = -Math.PI / 2;
                obj.rotation.y = Math.PI / 6;
                obj.position.z = 0;

                obj.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        var x = 0;
                        //var _uniforms = {
                        //    "texture": { type: "t", value: child.material.map },
                        //    "disMax": { type: "f", value: 80 },
                        //    "disMin": { type: "f", value: 20 },
                        //};

                        //var material =
                        //  new THREE.ShaderMaterial({
                        //      uniforms: _uniforms,
                        //      vertexShader: document.getElementById('vertex_shader').textContent,
                        //      fragmentShader: document.getElementById('fragment_shader').textContent
                        //  });
                        //child.material = material;
                        child.material.map.anisotropy = maxAnisotropy;
                        if (child.name === "Cube") {
                            var material = new THREE.MeshPhongMaterial({
                                map: child.material.map,
                                normalMap: textureLoader.load("/RendxxLogo/logoModel/City_normalMap_01.png")
                            });
                            child.material = material;
                        } else if (child.name === "Cube.001") {
                            var material = new THREE.MeshPhongMaterial({
                                map: child.material.map,
                                normalMap: textureLoader.load("/RendxxLogo/logoModel/City_normalMap_02.png")
                            });
                            child.material = material;
                        } else if (child.name === "Cube.002") {
                            var material = new THREE.MeshPhongMaterial({
                                map: child.material.map,
                                normalMap: textureLoader.load("/RendxxLogo/logoModel/City_normalMap_03.png")
                            });
                            child.material = material;
                        } else if (child.name === "Cube.003") {
                            var material = new THREE.MeshPhongMaterial({
                                map: child.material.map,
                                normalMap: textureLoader.load("/RendxxLogo/logoModel/City_normalMap_04.png")
                            });
                            child.material = material;
                        } else if (child.name === "Cube.005") {
                            var material = new THREE.MeshPhongMaterial({
                                map: child.material.map,
                                normalMap: textureLoader.load("/RendxxLogo/logoModel/City_normalMap_ground.png")
                            });
                            child.material = material;
                        }
                    }
                });
                logoGrp.add(obj);
                isloaded = true;
            });
        };

        var _setupWebGL = function () {
            // basic
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 5000);
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            html['scene']['webgl'].append(renderer.domElement);

            //renderer.setClearColor(Data.bgColor);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.soft = true;

            camera.position.set(0, 0, 120);
            camera.lookAt(scene.position);
        };

        var _setupHtml = function () {
            html = {};
            html['container'] = $(container);
            html['scene'] = {};
            html['scene']['interaction'] = $(Data.html['scene']['interaction']).appendTo(html['container']);
            html['scene']['webgl'] = $(Data.html['scene']['webgl']).appendTo(html['container']);
            html['scene']['front'] = $(Data.html['scene']['front']).appendTo(html['container']);
            html['scene']['back'] = $(Data.html['scene']['back']).appendTo(html['container']);
            width = html['scene']['webgl'].width();
            height = html['scene']['webgl'].height();
            
            html['interaction'] = {};
            html['interaction']['center'] = $(Data.html['interaction']['center']).appendTo(html['scene']['interaction']);
            centerWid = html['interaction']['center'].width();
            centerHeight = html['interaction']['center'].height();

            html['words'] = $(Data.html['words']).appendTo(html['scene']['front']);
            html['cloud'] = $(Data.html['cloud']).appendTo(html['scene']['back']);
        };

        var _init = function () {
            _setupHtml();
            _setupWebGL();
            _setupModel();
            _setupAnimation();
            _setupInteraction();
            _setupLine();
            $(window).resize(_resize);
            animate();
        };
        _init();
    };
})(window.Rendxx.Home);