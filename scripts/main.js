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

    selectPlaylist.addEventListener('change', function(){
        console.log("Change playlist");
        video.pause();
        console.log(playlists[selectPlaylist.value]);
        hls.loadSource(playlists[selectPlaylist.value]);
        hls.attachMedia(video);
        video.load();
    })

    if (Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        //video.play();
        console.log("Events manifest parsed");
        console.log(hls.levels);
      });
    hls.on(Hls.Events.LEVEL_SWITCHED, function(){
      console.log(hls.levels[hls.currentLevel]);
      refreshVideoDetails(hls.levels[hls.currentLevel])
      refreshQualitySelect(hls.levels, hls);
    })
    }
    // hls.js is not supported on platforms that do not have Media Source
    // Extensions (MSE) enabled.
    //
    // When the browser has built-in HLS support (check using `canPlayType`),
    // we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video
    // element through the `src` property. This is using the built-in support
    // of the plain video element, without using hls.js.
    //
    // Note: it would be more normal to wait on the 'canplay' event below however
    // on Safari (where you are most likely to find built-in HLS support) the
    // video.src URL must be on the user-driven white-list before a 'canplay'
    // event will be emitted; the last video event that can be reliably
    // listened-for when the URL is not on the white-list is 'loadedmetadata'.
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
      video.addEventListener('loadedmetadata', function() {
        //video.play();
        console.log("Metadata loaded");
      });
    }

    var playButton = document.getElementById('playBtn');
    playButton.addEventListener('click', function(){
        video.play();
        console.log(hls.currentLevel);
        //refreshVideoDetails(hls.levels[hls.currentLevel])
    })
    var pauseButton = document.getElementById('pauseBtn');
    pauseButton.addEventListener('click', function(){
        video.pause();
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
