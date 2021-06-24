const toggleMusicBtns = Array.from(document.querySelectorAll('.music__play-btn'));
const progressBar = document.querySelector('.music-player__audio-progress');
const progressSlider = document.querySelector('.music-player__audio-bar');
const audios = Array.from(document.querySelectorAll('audio'));
const musicPlayerPlayBtn = document.querySelector('.music-player__play-btn');
const musicPlayerNextBtn = document.querySelector('.music-player__next-btn');
const musicPlayerPrevBtn = document.querySelector('.music-player__prev-btn');
const musicVolume = document.querySelector('.music-player__volume');
const musicVolumeIcon = document.querySelector('.music-player__volume-box i');
 


function resetIcon(audio, icon){
    audio.paused ? icon.setAttribute("class", "fa fa-play") : icon.setAttribute("class", "fa fa-pause"); 
}

function toggleMusicIcon(audio){
    const icon = audio.nextElementSibling.querySelector('i');
    resetIcon(audio, icon);
}
function toggleMusicPlayIcon(audio){
    const icon = musicPlayerPlayBtn.querySelector('i');
    resetIcon(audio, icon);
}
function resetAudio(currAudio){
    audios.forEach(audio =>{
        if(audio !== currAudio && audio.classList.contains('active')){
            audio.currentTime = 0;
            audio.pause();
            audio.classList.remove('active');
            disablePrevAnime(audio);
            // remove active class from music box to remove  bg color
            audio.parentElement.parentElement.classList.remove('active')
            toggleMusicIcon(audio);
            toggleMusicPlayIcon(audio);
        }
    });
}
function updateMusicText(audio){
    const musicBox = audio.parentElement;
    const musicName = musicBox.querySelector('.music__song-name');
    const musicSingerName = musicBox.querySelector('.music__singer');
    
    document.querySelector('.music-player__song').textContent = musicName.textContent;
    document.querySelector('.music-player__singer').textContent = musicSingerName.textContent;
}
 
function disablePrevAnime(audio){
    console.log(audio, 'prev audio');
    const musicAnimateBox = audio.nextElementSibling.querySelector('.music-animate-box');
    const icon = audio.nextElementSibling.querySelector('i'); 
    icon.style.display = "block"; 
    musicAnimateBox.classList.remove('active');
}
function enableCurrentAnime(audio){
    console.log(audio, 'curr audio');
    const musicAnimateBox = audio.nextElementSibling.querySelector('.music-animate-box');
    const icon = audio.nextElementSibling.querySelector('i'); 
    if(!audio.paused) {
        icon.style.display = "none"; 
        musicAnimateBox.classList.add('active');
    } else {
        icon.style.display = "block"; 
        musicAnimateBox.classList.remove('active');
    }
}

function toggleMusic(){
    const audio = this.previousElementSibling;
    const method = audio.paused ? "play" : "pause";
    
    audio[method]();
    enableCurrentAnime(audio);
    audio.volume = musicVolume.value;
     
    resetAudio(audio);
    audio.classList.add('active');
    // add active class to music box to set bg color
    audio.parentElement.parentElement.classList.add('active');
    
    toggleMusicIcon(audio);
    toggleMusicPlayIcon(audio);
    updateMusicText(audio);
    updateVolumeIcon(musicVolume.value);
}

function getActiveAudio(){
    return audios.filter(audio => audio.classList.contains('active'))[0];
}

function playMusic(){
    audios.forEach((audio, audioIndex) =>{
        if(audio.currentTime > 0 && audio.paused){
            audio.play();
            toggleMusicIcon(audio, this);
            toggleMusicPlayIcon(audio, this);
        } else if(audio.currentTime > 0 && !audio.paused){
            audio.pause();
            toggleMusicIcon(audio, this);
            toggleMusicPlayIcon(audio, this);
        }    
    })
}
function updateCurrentAudioTime(){
    const activeAudioDuration = getActiveAudio().duration;
    const totalPassedTime = document.querySelector('.music-player__audio-passed-time');
    const currAudioDuration  = document.querySelector('.music-player__audio-duration');
    totalPassedTime.textContent = `${Math.floor(getActiveAudio().currentTime / 60).toString().padStart(2, "0")}:${Math.floor(getActiveAudio().currentTime % 60).toString().padStart(2, "0")}`;

    currAudioDuration.textContent = `${Math.floor(activeAudioDuration / 60).toString().padStart(2, "0")}:${Math.floor(activeAudioDuration % 60).toString().padStart(2, "0")}`;
}
function checkMusicEnded(audio){
    if(audio.ended){
        skipToNextMusic();
    }
}
function updateProgress(){
    progressBar.style = `flex-basis: ${(this.currentTime / this.duration) * 100}%`;
    updateCurrentAudioTime();
   checkMusicEnded(this);
}
function changeProgress(e){
    const activeAudio = getActiveAudio();
    const progressBarWidth = this.clientWidth;
    const offsetX = e.offsetX;
    activeAudio.currentTime = (offsetX / progressBarWidth) * activeAudio.duration;
    progressBar.style = `flex-basis: ${(offsetX / progressBarWidth) * 100}%`;
}
function updateVolumeIcon(volume){
    if(volume > 0.6){
        musicVolumeIcon.setAttribute("class", "fas fa-volume-up");
    } else if(volume > 0.3 && volume <= 0.6){
        musicVolumeIcon.setAttribute("class", "fas fa-volume-down");
    } else if(volume > 0 && volume <= 0.3){
        musicVolumeIcon.setAttribute("class", "fas fa-volume-off");
    } else {
        musicVolumeIcon.setAttribute("class", "fas fa-volume-mute");
    } 
}
function changeMusicVolume(){
    const activeAudio = getActiveAudio();
    if(activeAudio){
        activeAudio.volume = this.value;
        updateVolumeIcon(activeAudio.volume);
    }  
}

let isActive = false
let prevVolume;
function toggleVolume(){
    const activeAudio = getActiveAudio();
    if(!isActive){
        prevVolume = activeAudio.volume;
        activeAudio.volume = 0;
        if(musicVolume.value == "0"){
            musicVolume.value = "0.1";
            activeAudio.volume = 0.1;
            prevVolume = activeAudio.volume;
            updateVolumeIcon(activeAudio.volume)
        }
        updateVolumeIcon(activeAudio.volume);
        isActive = !isActive
    } else {
        activeAudio.volume = prevVolume;
        updateVolumeIcon(activeAudio.volume);
        isActive = !isActive
    }
    
}

// don't change it
let counter = 0;
function updateMusicsDuration(){
    const musicBoxes = document.querySelectorAll('.musics .music');
    musicBoxes.forEach(box =>{
        const audioDuration = box.querySelector('audio').duration;
        const musicDuration = box.querySelector('.music__duration');
        musicDuration.textContent = `${Math.floor(audioDuration / 60).toString().padStart(2, "0")}:${Math.floor(audioDuration % 60).toString().padStart(2, "0")}`;
        if(counter === audios.length)return;
        counter++;
    })
}
function resetPrevAudio(audio){
    audio.classList.remove('active');
    audio.currentTime = 0;
    audio.pause();
    audio.parentElement.parentElement.classList.remove('active');
    audio.volume = musicVolume.value;
    updateVolumeIcon(audio.volume);
}
function resetNextAudio(audio){
    audio.classList.add('active');
    audio.play();
    audio.parentElement.parentElement.classList.add('active');
    audio.volume = musicVolume.value;
    updateVolumeIcon(audio.volume);
}

let currMusicIndex = 0;
function skipToPrevMusic(){
    const activeAudio = getActiveAudio();
    const activeAudioIndex = audios.findIndex(audio => audio === activeAudio);
    currMusicIndex = activeAudioIndex;
    if(currMusicIndex === 0){
        audios[activeAudioIndex].currentTime = 0;
        return;
    }
    // audios[activeAudioIndex].classList.remove('active');
    // audios[activeAudioIndex].currentTime = 0;
    // audios[activeAudioIndex].pause();
    // audios[activeAudioIndex].parentElement.parentElement.classList.remove('active');
    resetPrevAudio(audios[activeAudioIndex])
    toggleMusicIcon(audios[activeAudioIndex]);
    toggleMusicPlayIcon(audios[activeAudioIndex]);
    disablePrevAnime(audios[activeAudioIndex]);
    currMusicIndex--;
    // audios[activeAudioIndex - 1].classList.add('active');
    // audios[activeAudioIndex - 1].play();
    // audios[activeAudioIndex - 1].parentElement.parentElement.classList.add('active');
    
    resetNextAudio(audios[activeAudioIndex - 1]);
    enableCurrentAnime(audios[activeAudioIndex - 1]);
    updateMusicText(audios[activeAudioIndex - 1]);
    toggleMusicIcon(audios[activeAudioIndex - 1]);
    toggleMusicPlayIcon(audios[activeAudioIndex - 1]);

    
    
}
function skipToNextMusic(){
    const activeAudio = getActiveAudio();
    const activeAudioIndex = audios.findIndex(audio => audio === activeAudio);
    currMusicIndex = activeAudioIndex;
    if(currMusicIndex === audios.length - 1){
        audios[activeAudioIndex].currentTime = 0;
        return;
    }
    // audios[activeAudioIndex].classList.remove('active');
    // audios[activeAudioIndex].currentTime = 0;
    // audios[activeAudioIndex].pause();
    // audios[activeAudioIndex].parentElement.parentElement.classList.remove('active');
    resetPrevAudio(audios[activeAudioIndex]);
    toggleMusicIcon(audios[activeAudioIndex]);
    toggleMusicPlayIcon(audios[activeAudioIndex]);
    disablePrevAnime(audios[activeAudioIndex]);
    currMusicIndex++;
    // audios[activeAudioIndex + 1].classList.add('active');
    // audios[activeAudioIndex + 1].play();
    // audios[activeAudioIndex + 1].parentElement.parentElement.classList.add('active')
    resetNextAudio(audios[activeAudioIndex + 1]);
    enableCurrentAnime(audios[activeAudioIndex + 1]);
    updateMusicText(audios[activeAudioIndex + 1]);
    toggleMusicIcon(audios[activeAudioIndex + 1]);
    toggleMusicPlayIcon(audios[activeAudioIndex + 1]);
};

toggleMusicBtns.forEach(btn => btn.addEventListener('click', toggleMusic));
musicPlayerPlayBtn.addEventListener('click', playMusic);
audios.forEach(audio => {
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateMusicsDuration);
});
progressSlider.addEventListener('click', changeProgress);

musicVolume.addEventListener('change', changeMusicVolume);
musicVolume.addEventListener('mousemove', changeMusicVolume);

musicVolumeIcon.addEventListener('click', toggleVolume);

musicPlayerPrevBtn.addEventListener('click', skipToPrevMusic);
musicPlayerNextBtn.addEventListener('click', skipToNextMusic);