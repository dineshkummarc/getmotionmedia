define([
    'gmm/framecap'
], function (FrameCap) {

  var MotionController;
  var MotionControllerProto;
  var labels = ['nw', 'n', 'ne', 'w', 'c', 'e', 'sw', 's', 'se'];
  var differenceThreshold = 21;
  var buttonHitThreshold = 0.05;

  //button ratio, where 1 is the length of the canvas at that dimension
  var buttonWidthRatio = 1 / 5;
  var buttonHeightRatio = 1 / 5;

  //bitwise absolute

  function fastAbs(value) {
    return(value ^ (value >> 31)) - (value >> 31);
  }

  //returns an array of button areadata

  function assignButtonData(x, y, width, height) {
    return [x, y, width, height];
  }

  //generates button area data

  function getButtonData(width, height) {
    var i, j, k = 0;

    var buttons = {};
    var buttonWidth = width * buttonWidthRatio;
    var buttonHeight = height * buttonHeightRatio;

    //buttons run from bottom left, around the canvas to bottom right
    for(i = 0; i < height; i += (2 * buttonHeight)) {
      for(j = 0; j < width; j += (2 * buttonWidth)) {
        buttons[labels[k++]] = assignButtonData(j, i, buttonWidth, buttonHeight);
      }
    }

    return buttons;
  }

  //checks if an area covered by a button is hit by motion

  function buttonCheck(context, b) {

    var buttonFrame = context.getImageData(b[0], b[1], b[2], b[3]);
    var buttonPixels = buttonFrame.data;
    var length = buttonPixels.length;
    var i, whitePixels = 0;

    for(i = 0; i < length; i += 4) {
      whitePixels += (buttonPixels[i] === 255) ? 1 : 0;
    }

    return(whitePixels / (length / 4)) > buttonHitThreshold;
  }

  //get pixel difference

  function getPixelDifference(current, previous, i) {

    //greyscale the pixel
    var average = (current[i] + current[i + 1] + current[i + 2]) / 3;
    var previousAverage = (previous[i] + previous[i + 1] + previous[i + 2]) / 3;

    //differentiate the two pixels. If greater than differenceThreshold, pixel is white
    return(fastAbs(average - previousAverage) > differenceThreshold) ? 255 : 0;

  }

  MotionController = function () {

    var self = this;

    //frame cache
    var referenceFrame = this.createImageData();
    var reference = referenceFrame.data;
    var length = reference.length;
    var x = length;

    //initialize frame to opaque
    while(x--) reference[x] = 255;

    var previousFrame;

    var buttonData = getButtonData(this.width, this.height);

    //the canvas from which we get the positions
    var controllerCanvas = document.createElement('canvas');
    controllerCanvas.width = this.width;
    controllerCanvas.height = this.height;
    var controllerContext = controllerCanvas.getContext('2d');

    this.on('newframe', function (frame) {

      var i, j, difference, currentLabel;

      //if previous frame does not exist (first frame loaded), skip this one
      if(!previousFrame) {
        previousFrame = frame;
        return;
      }

      //get the difference frame
      for(i = 0; i < length; i += 4) {
        difference = getPixelDifference(frame.data, previousFrame.data, i);
        reference[i] = reference[i + 1] = reference[i + 2] = difference;
      }

      //emit the reference frame for use
      self.emit('motionframe', referenceFrame);

      //controller now!
      controllerContext.putImageData(referenceFrame, 0, 0);

      //check each button for hits
      for(j = 0; j < labels.length; ++j) {
        currentLabel = labels[j];
        if(buttonCheck(controllerContext, buttonData[currentLabel])) {
          self.emit('button', currentLabel);
        }
      }

      //pass the current frame to the previous frame before the next run
      previousFrame = frame;

    });

  };

  MotionControllerProto = MotionController.prototype = new FrameCap();

  return MotionController;

});
