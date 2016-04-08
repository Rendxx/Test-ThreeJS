var sound = new Howl({
    urls: ['step.mp3'],
    loop: true
}).play();

var t = 0;
var timer = setInterval(function () {
    sound.play(); t++;
    if (t == 30) clearInterval(timer);
}, 200);