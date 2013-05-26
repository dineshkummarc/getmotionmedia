#Get Motion Media

A "Dancepad Kinect"-like mashup webcam motion game powered only by JavaScript!

It's my entry for [Mozilla's Dev Derby](https://developer.mozilla.org/en-US/demos/devderby) May 2013, which requires the use of [`getUserMedia`](https://developer.mozilla.org/en-US/docs/WebRTC/navigator.getUserMedia). This allows JavaScript to tap into your microphone and webcam. Along with some `<video>` and `<canvas>` magic, JavaScript can extract video frames as raw pixel data... And do whatever you like with them!

The concept of the game revolves around the use of motion. This is done by dumping video frames into a canvas, take 2 of them (current and previous) and checking for differences. If a difference is found, then there's motion! If you map the occurrences of the motion to sections of the screen, presto! We have a motion map! Map these sections to some UI elements like buttons, add in some timers and event handling and instant motion controller!

Most of the code is powered by my own [MiniEvent](https://github.com/fskreuz/MiniEvent) microlibrary and some motion tracking code that I was experimenting months ago. It also has a custom "ramp builder" which generates button timings for the "ramp dots".

The following libraries and snippets are used as well:

- [KineticJS](http://kineticjs.com/)
- [jQuery](http://jquery.com/)
- [jQueryUI](http://jqueryui.com/)
- [RequireJS](http://requirejs.org/)
- [requestAnimationFrame polyfill](https://gist.github.com/paulirish/1579671)

The music is called ["Ether Disco" by Kevin McLeod](http://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100237) (incompetech.com) licensed under [Creative Commons: By Attribution 3.0](http://creativecommons.org/licenses/by/3.0/)

[A demo is currently hosted here](http://gum.ap01.aws.af.cm/).