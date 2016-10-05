(function () {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var makeTextSprite = function (message, parameters) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (parameters === undefined) parameters = {};

        var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
        var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
        var color = parameters.hasOwnProperty("color") ? parameters["color"] : { r: 255, g: 255, b: 255, a: 1.0 };
        var bg = parameters.hasOwnProperty("bg") ? parameters["bg"] : { r: 255, g: 255, b: 255, a: 1.0 };
        var align = parameters.hasOwnProperty("align") ? parameters["align"] : "center";


        // set font parameter
        ctx.font = fontsize + "px " + fontface;


        // measure text
        var metrics = ctx.measureText(message);
        var width = parameters.hasOwnProperty("width") ? parameters["width"] : Math.ceil(metrics.width);
        var height = parameters.hasOwnProperty("height") ? parameters["height"] : fontsize;

        canvas.width = width;
        canvas.height = height;
        ctx.font = fontsize + "px " + fontface;
        ctx.shadowColor = "black";
        ctx.shadowBlur = 5;
        ctx.textBaseline = 'middle';

        // Draw bg
        ctx.fillStyle = "rgba(" + bg.r + "," + bg.g + "," + bg.b + "," + bg.a + ")";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // text 
        ctx.fillStyle = "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
        ctx.fillText(message, 0, (canvas.height) / 2);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(width, height, 1.0);
        return sprite;
    }

    window.makeTextSprite = makeTextSprite;
})();