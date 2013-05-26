define([
    'polyfills/getusermedia',
    'polyfills/requestanimationframe',
    'utils/minievent'
], function (getUserMedia, rAF, MiniEvent) {

  var FrameCap;
  var FrameCapProto;

  var requestAnimationFrame = rAF.requestAnimationFrame;
  var cancelAnimationFrame = rAF.cancelAnimationFrame;

  var state = {
    STOPPED: 0,
    STARTED: 1,
    PAUSED: 2
  };

  FrameCap = function () {

    var self = this;
    var lastSecond = 0;
    var frameCount = 0;

    this.width = 200;
    this.height = 150;
    this.currentState = 0;

    //create the video
    var video = this.video = document.createElement('video');
    video.width = this.width;
    video.height = this.height;
    video.addEventListener('loadeddata', function update() {

      //check if the video has been paused
      if(video.paused || video.ended) return false;
      requestAnimationFrame(update);

      var now;
      var sourceContext = self.sourceContext;
      var diff = (now = Date.now()) - lastSecond;

      //emit framerate      
      if(diff >= 1000) {
        self.emit('fps', frameCount);
        frameCount = 0;
        lastSecond = now;
      }
      frameCount++;

      //emit new frame
      sourceContext.drawImage(self.video, 0, 0, self.width, self.height);
      self.emit('newframe', sourceContext.getImageData(0, 0, self.width, self.height));
    });

    //create our source
    var source = this.source = document.createElement('canvas');
    source.width = this.width;
    source.height = this.height;

    var sourceContext = this.sourceContext = source.getContext('2d');
    sourceContext.translate(this.width, 0);
    sourceContext.scale(-1, 1);

  };

  FrameCapProto = FrameCap.prototype = new MiniEvent();

  //starts the camera and feeds the stream to gUM and starts the video that
  //feeds into the canvas
  FrameCapProto.start = function () {

    var self = this;
    var video = self.video;
    var currentState = this.currentState;

    //if already started, keep going
    if(currentState === state.STARTED) return false;

    if(currentState === state.PAUSED) {
      video.play();
      return true;
    }

    getUserMedia({
      video: true,
      audio: false
    }, function (localMediaStream) {

      self.mediaStreamObject = localMediaStream;
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();

      self.currentState = state.STARTED;
      self.emit('start');

    }, function (err) {
      console.log(err);
      self.emit('error', err);
    });

    return true;
  };

  //pauses the video and kills the webcam stream which destroys the
  //mediaStreamObject. In effect, your camera will be turned off by the call
  FrameCapProto.stop = function () {

    var video = this.video;

    if(!video || this.currentState !== state.STARTED) return false;

    video.pause();
    this.mediaStreamObject.stop();
    this.currentState = state.STOPPED;

    this.emit('stop');
    return true;
  };

  //pauses the video which pauses the update stream but it does not stop the
  //video stream.
  FrameCapProto.pause = function () {

    var video = this.video;

    if(!video || this.currentState !== state.STARTED) return false;

    video.pause();
    this.currentState = state.PAUSED;

    this.emit('pause');
    return true;
  };

  FrameCapProto.createImageData = function () {
    return this.sourceContext.createImageData(this.width, this.height);
  };
  return FrameCap;

});
