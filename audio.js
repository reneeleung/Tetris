var audio = document.getElementById('music');

function toggle() {
    if(audio.paused) {
        document.getElementById('button-icon').src='pause-button.png';
        return audio.play();
    }
    document.getElementById('button-icon').src='play-button.png';
    return audio.pause();
}
