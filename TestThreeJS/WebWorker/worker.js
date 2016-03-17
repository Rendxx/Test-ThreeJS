onmessage = function (e) {
    for (var i in e.data)
        delta[i] = e.data[i];
}

var delta = {
        x: 0,
        y: 0,
        z: 0
    },
    _max = Math.PI*2,

    rotation = {
        x: 0,
        y: 0,
        z: 0
    };

function timepass() {
    rotation.x = (rotation.x + delta.x) % _max;
    rotation.y = (rotation.y + delta.y) % _max;
    rotation.z = (rotation.z + delta.z) % _max;
}

setInterval(function () {
    timepass();
    postMessage(rotation);
}, 30);