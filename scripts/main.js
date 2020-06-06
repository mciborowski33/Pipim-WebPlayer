window.onload = function(){

    let selectPlaylist = document.getElementById("selectPlaylist");
    for( i = 0; i < playlists.length; i++ ){
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = playlists[i];
        selectPlaylist.appendChild(opt);
    }

    var video = document.getElementById('video');
    //var videoSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    let videoSrc = playlists[0];
    loadVideo(videoSrc);

    selectPlaylist.addEventListener('change', function(){
        console.log("Change playlist");
        console.log(playlists[selectPlaylist.value]);
        loadVideo(playlists[selectPlaylist.value]);
    })

    function loadVideo(videoSrc) {
        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play();
                refreshVideoDetails(hls.levels[hls.currentLevel])
                refreshQualitySelect(hls.levels, hls);
            });
            hls.on(Hls.Events.LEVEL_SWITCHED, function(){
                console.log(hls.levels[hls.currentLevel]);
                refreshVideoDetails(hls.levels[hls.currentLevel])
                refreshQualitySelect(hls.levels, hls);
            })
        }
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoSrc;
            video.addEventListener('loadedmetadata', function() {
            video.play();
            });
        }
    }

    var customURL = document.getElementById('customURL');
    var confirmURL = document.getElementById("confirmURL");
    confirmURL.addEventListener('click', function(){
        console.log("Change playlist with button");
        loadVideo(customURL.value);
    })

    var playButton = document.getElementById('playBtn');
    playButton.addEventListener('click', function(){
        video.play();
        console.log("Play");
    })
    var pauseButton = document.getElementById('pauseBtn');
    pauseButton.addEventListener('click', function(){
        video.pause();
        console.log("Pause");
    })

}

refreshVideoDetails = function(data){
    let bitrate = document.getElementById("bitrate");
    let vidHeight = document.getElementById("vidHeight");
    let vidWidth = document.getElementById("vidWidth");
    let vidCodec = document.getElementById("vidCodec");
    let audioCodec = document.getElementById("audioCodec");
    bitrate.innerHTML = data.bitrate;
    vidHeight.innerHTML = data.height;
    vidWidth.innerHTML = data.width;
    vidCodec.innerHTML = data.videoCodec;
    audioCodec.innerHTML = data.audioCodec;
}

refreshQualitySelect = function(data, hls){
    console.log("Buttons generating");
    console.log(data);
    //console.log(data[0].width);
    let qualitySelect = document.getElementById("qualitySelect");
    while (qualitySelect.firstChild) {
        qualitySelect.removeChild(qualitySelect.lastChild);
    }
    for( i = 0; i < data.length; i++ ){
        var qualityBtn = document.createElement('button');
        qualityBtn.id = "btn_" + i;
        let tmpStr = data[i].width + "x" + data[i].height + " (" + data[i].bitrate + ")";
        console.log(tmpStr);
        qualityBtn.innerHTML = tmpStr;
        qualitySelect.appendChild(qualityBtn);
        qualityBtn.addEventListener('click', function(){
            let qualityLevel = this.id.split("_")[1];
            hls.currentLevel = qualityLevel;
        })
    }
}
