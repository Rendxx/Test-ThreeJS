var sound = new Howl({
    urls: ['test.mp3'],
    loop: true
});

var t = 0;

var play = function () {
    sound.play();
};
var stop = function () {
    sound.stop();
};