requirejs.config({
  paths: {
    'jquery': 'plugins/jquery',
    'jqueryui': 'plugins/jquery-ui'
  }
});

require([
    'jquery',
    'plugins/kinetic',
    'gmm/motioncontroller',
    'gmm/trackplayer',
    'gmm/gameui',
    'media/disco',
    'jqueryui'
], function ($, Kinetic, MotionController, TrackPlayer, GameUI, DiscoTrack) {

  $(function () {

    var width = 800;
    var height = 600;
    var score = 0;
    var total = 0;

    //the stage container
    var container = $('<div/>', {
      id: 'stage',
      width: width,
      height: height
    })
      .css({
      margin: '0 auto'
    })
      .appendTo('body');

      var liveScore = $('#liveScore p');

    //the essentials
    var ui = new GameUI(container[0].id, width, height);
    var controller = new MotionController();
    var track = new TrackPlayer();


    //get the bg canvas to paint the camera feed
    var bgContext = ui.stage.getLayers()[0].getCanvas().getContext('2d');
    bgContext.translate(width, 0);
    bgContext.scale(-1, 1);

    controller.on('newframe', function (frame) {
      bgContext.drawImage(this.video, 0, 0, width, height);
    });

    //send over hit data to ui
    controller.on('button', function (direction) {
      ui.emit('hit', direction);
    });

    //set listeners for the parser
    track.on('ping', function (key) {
      ui.emit('buttonGuide', key);
    });

    track.on('ended', function () {
      $('h1',scoreDialog).text(((score * 100/total) | 0)+'%');
      scoreDialog.dialog('open');
    });

    //score counting from the UI
    ui.on('score', function (points) {
      score += points;
      liveScore.text(score);
    });

    ui.on('scorecount', function (count) {
      total += count;
    });


    //start the controller
    controller.start();

    //load the media for playing and listening
    track.load(DiscoTrack);

    var scoreDialog = $('#score').dialog({
      resizable: false,
      autoOpen : false,
      modal: true,
      buttons: {
        "Try Again?": function() {

          location.reload();
        }
      }
    });

    //THE ONLY INTERFACE
    var intro = $('#intro').dialog({
      resizable: false,
      modal: true,
      width: 640,
      buttons: {
        "START!": function() {

          //play the music
          track.play();
          $(this).dialog( "close" );
        }
      }
    });



  });
});
