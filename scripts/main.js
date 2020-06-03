window.onload = function(){

    var video = document.getElementById('video');
    var videoSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    if (Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        //video.play();
        console.log("Events manifest parsed");
        console.log(hls.levels);
      });
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
    })
    var pauseButton = document.getElementById('pauseBtn');
    pauseButton.addEventListener('click', function(){
        video.pause();
    })

}

refreshVideoDetails(hls){
    let bitrate = document.getElementById("bitrate");
}
