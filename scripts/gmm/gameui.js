define([
    'plugins/kinetic',
    'utils/MiniEvent'
], function (Kinetic, MiniEvent) {

  function GameUI(container, width, height) {

    var self = this;

    var guideOffset = 250;
    var speed = 1; //s
    var graceTime = 500; //ms
    var points = 1000;

    //build our stage
    var stage = this.stage = new Kinetic.Stage({
      container: container,
      width: width,
      height: height
    });

    //key mapping
    var keys = {
      '113': 'nw',
      '119': 'n',
      '101': 'ne',
      '97': 'w',
      '100': 'e',
      '122': 'sw',
      '99': 'se'
    };

    //add the layers
    var pad = this.pad = new Kinetic.Layer();
    var ramp = this.ramp = new Kinetic.Layer();
    var bg = this.bg = new Kinetic.Layer();
    stage.add(bg);
    stage.add(ramp);
    stage.add(pad);

    //button data
    var uiElements = {
      button: {
        radius: 70,
        color: '#CCC',
        hitColor: '#0F0',
        waitColor: '#00F',
        missColor: '#F00',
        stroke: '#000',
        strokeWidth: 4
      },
      guide: {
        radius: 20,
        color: '#CCC',
        endColor: '#F00',
        stroke: '#000',
        strokeWidth: 1,
        opacity: 0,
        tween: {
          opacity: 1,
          scaleX: 2,
          scaleY: 2,
          easing: Kinetic.Easings.Linear,
          fillR: 255,
          fillG: 255,
          fillB: 0
        }
      },
      data: {
        'nw': {
          button: {
            x: 0,
            y: 0
          },
          guide: {
            x: guideOffset,
            y: guideOffset
          }
        },
        'n': {
          button: {
            x: width / 2,
            y: 0
          },
          guide: {
            x: width / 2,
            y: guideOffset
          }
        },
        'ne': {
          button: {
            x: width,
            y: 0
          },
          guide: {
            x: width - guideOffset,
            y: guideOffset
          }
        },
        'w': {
          button: {
            x: 0,
            y: height / 2
          },
          guide: {
            x: guideOffset,
            y: height / 2
          }
        },
        'e': {
          button: {
            x: width,
            y: height / 2
          },
          guide: {
            x: width - guideOffset,
            y: height / 2
          }
        },
        'sw': {
          button: {
            x: 0,
            y: height
          },
          guide: {
            x: guideOffset,
            y: height - guideOffset
          }
        },
        'se': {
          button: {
            x: width,
            y: height,
          },
          guide: {
            x: width - guideOffset,
            y: height - guideOffset
          }
        }
      }
    };

    //build the uiElements
    var data = uiElements.data; //button coordinates

    for(var direction in data) {
      if(!data.hasOwnProperty(direction)) continue;

      //really needed a new scope per iteration
      (function (currentDirection) {

        currentDirection = data[direction];

        //build button circles
        var button = new Kinetic.Circle({
          x: currentDirection.button.x,
          y: currentDirection.button.y,
          radius: uiElements.button.radius,
          fill: uiElements.button.color,
          stroke: uiElements.button.stroke,
          strokeWidth: uiElements.strokeWidth
        });

        //build guides
        var guide = new Kinetic.Circle({
          x: currentDirection.guide.x,
          y: currentDirection.guide.y,
          radius: uiElements.guide.radius,
          fill: uiElements.guide.color,
          stroke: uiElements.guide.stroke,
          strokeWidth: uiElements.guide.strokeWidth,
          opacity: uiElements.guide.opacity
        });

        //add to layer before adding tween
        ramp.add(guide);
        pad.add(button);

        //build tweens
        var tween = new Kinetic.Tween({
          node: guide,
          duration: speed,
          x: currentDirection.button.x,
          y: currentDirection.button.y,
          opacity: uiElements.guide.tween.opacity,
          scaleX: uiElements.guide.tween.scaleX,
          scaleY: uiElements.guide.tween.scaleY,
          easing: uiElements.guide.tween.easing,
          fillR: uiElements.guide.tween.fillR,
          fillG: uiElements.guide.tween.fillG,
          fillB: uiElements.guide.tween.fillB,
          onFinish: function () {
            var guideTween = this;
            //when guide reaches button, show gracetime color
            button.setFill(uiElements.button.waitColor);
            pad.draw();

            //reset the guide tween
            guideTween.reset();

            //show the appropriate sign colors, red for miss, green for hit
            setTimeout(function () {

              //select color if hit or miss
              var data = uiElements.button;
              var color;

              if(currentDirection.hit) {
                color = data.hitColor;
                self.emit('score', points);
              } else {
                color = data.missColor;
              }

              self.emit('scorecount', points);

              button.setFill(color);
              pad.draw();

              //reset
              setTimeout(function () {
                button.setFill(data.color);
                pad.draw();
              }, 1000);

              currentDirection.hit = false;

            }, graceTime);
          }
        });

        //add to ui elements object
        currentDirection.buttonCircle = button;
        currentDirection.guideCircle = guide;
        currentDirection.tween = tween;

      }(data[direction]));
    }

    //draw all uiElements for the first time on stage
    pad.draw();

    //paint the button with hit color
    this.on('hit', function (direction) {

      //cancel out uiElements we don't need
      if(direction === 'c' || direction === 's') return;
      var directionData = uiElements.data[direction];
      var button = directionData.buttonCircle;

      directionData.hit = true;

    });

    //triggers 
    this.on('buttonGuide', function (key) {
      var data = uiElements.data[keys[key]];

      //add the guide to the ramp
      ramp.add(data.guideCircle);
      ramp.draw();

      //run the tween
      data.tween.play();
    });

  }

  GameUI.prototype = new MiniEvent();

  return GameUI;

});
