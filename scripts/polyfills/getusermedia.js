define(function (window) {

  var fn = navigator.getUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.msGetUserMedia || function (options, success, fail) {
      fail.call(this, 'NOT_SUPPORTED_ERROR');
    };

  window.getUserMedia = function () {
    fn.apply(navigator, arguments);
  };

  return window.getUserMedia;

});
