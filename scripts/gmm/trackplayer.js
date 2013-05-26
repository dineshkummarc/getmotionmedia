define([
    'utils/minievent'
], function (MiniEvent) {

  function TrackPlayer() {

    var self = this;
    var audio = this.audio = document.createElement('audio');

    audio.addEventListener('timeupdate', function () {

      var currentTime = this.currentTime;
      var ramp = self.ramp;

      var latestEntry;

      while(ramp[ramp.length - 1] && ramp[ramp.length - 1].time < currentTime) {
        latestEntry = ramp.pop();
        self.emit('ping', latestEntry.key);
      }

    });

    audio.addEventListener('ended', function () {
      self.emit('ended');
    });

  }

  TrackPlayer.prototype = new MiniEvent();

  TrackPlayer.prototype.load = function (config) {

    var self = this;

    this.mediaPath = config.media;
    this.ramp = config.ramp.slice(0).reverse();

    //load audio
    this.audio.src = config.media;

    this.audio.addEventListener('loadeddata', function () {
      self.emit('loaded');
    });
  };

  TrackPlayer.prototype.play = function () {
    this.audio.play();
    this.emit('play');
  };

  TrackPlayer.prototype.pause = function () {
    this.audio.pause();
    this.emit('pause');
  };

  return TrackPlayer;

});
