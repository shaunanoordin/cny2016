"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*  CNY2016
 *  (- Shaun A. Noordin, 20160121)
********************************************************************************
 */

/*  Primary App Class
 */
//==============================================================================

var App = function () {

  //----------------------------------------------------------------

  function App() {
    _classCallCheck(this, App);

    //--------------------------------
    App.INPUT_IDLE = 0;
    App.INPUT_ACTIVE = 1;
    App.INPUT_ENDED = 2;
    App.STATE_START = 0;
    App.STATE_PLAYING = 1;
    App.FRAMES_PER_SECOND = 30;
    App.COLOUR_SHADOW = "rgba(128,128,128,0.5)";
    App.MAX_KEYS = 256;
    //--------------------------------

    //--------------------------------
    this.container = document.getElementById("app");
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.console = document.getElementById("console");
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.state = App.STATE_START;
    this.player = new Actor(this.width / 2, this.height / 2);
    this.keys = new Array(App.MAX_KEYS);
    //--------------------------------

    //--------------------------------
    for (var i = 0; i < this.keys.length; i++) {
      this.keys[i] = {
        state: App.INPUT_IDLE,
        duration: 0
      };
    }
    this.pointer = {
      start: { x: 0, y: 0 },
      now: { x: 0, y: 0 },
      state: App.INPUT_IDLE,
      duration: 0
    };
    //--------------------------------

    //--------------------------------
    if ("onmousedown" in this.canvas && "onmousemove" in this.canvas && "onmouseup" in this.canvas) {
      this.canvas.onmousedown = this.onPointerStart.bind(this);
      this.canvas.onmousemove = this.onPointerMove.bind(this);
      this.canvas.onmouseup = this.onPointerEnd.bind(this);
    }

    if ("ontouchstart" in this.canvas && "ontouchmove" in this.canvas && "ontouchend" in this.canvas && "ontouchcancel" in this.canvas) {
      this.canvas.ontouchstart = this.onPointerStart.bind(this);
      this.canvas.ontouchmove = this.onPointerMove.bind(this);
      this.canvas.ontouchend = this.onPointerEnd.bind(this);
      this.canvas.ontouchcancel = this.onPointerEnd.bind(this);
    }
    //--------------------------------

    //--------------------------------
    if ("onkeydown" in window && "onkeyup" in window) {
      window.onkeydown = this.onKeyDown.bind(this);
      window.onkeyup = this.onKeyUp.bind(this);
    }
    //--------------------------------

    //--------------------------------
    this.runCycle = setInterval(this.run.bind(this), 1 / App.FRAMES_PER_SECOND);
    //--------------------------------
  }

  //----------------------------------------------------------------

  _createClass(App, [{
    key: "run",
    value: function run() {
      this.context.clearRect(0, 0, this.width, this.height);

      if (this.player) {
        if (this.pointer.state == App.INPUT_ACTIVE) {
          this.player.x = this.pointer.now.x;
          this.player.y = this.pointer.now.y;
        }

        if (this.keys[KeyCodes.LEFT].state == App.INPUT_ACTIVE && this.keys[KeyCodes.RIGHT].state != App.INPUT_ACTIVE) {
          this.player.x -= 2;
        } else if (this.keys[KeyCodes.LEFT].state != App.INPUT_ACTIVE && this.keys[KeyCodes.RIGHT].state == App.INPUT_ACTIVE) {
          this.player.x += 2;
        }

        if (this.keys[KeyCodes.UP].state == App.INPUT_ACTIVE && this.keys[KeyCodes.DOWN].state != App.INPUT_ACTIVE) {
          this.player.y -= 2;
        } else if (this.keys[KeyCodes.UP].state != App.INPUT_ACTIVE && this.keys[KeyCodes.DOWN].state == App.INPUT_ACTIVE) {
          this.player.y += 2;
        }

        this.context.fillStyle = App.COLOUR_SHADOW;
        this.context.beginPath();
        this.context.arc(this.player.x, this.player.y, this.player.size / 2, 0, 2 * Math.PI);
        this.context.fill();
        this.context.closePath();

        //this.console.innerHTML = this.pointer.now.x + ',' + this.pointer.now.y;
        this.console.innerHTML = this.keys[KeyCodes.DOWN].state + ':' + this.keys[KeyCodes.DOWN].duration;
      }
    }

    //----------------------------------------------------------------

  }, {
    key: "onPointerStart",
    value: function onPointerStart(e) {
      this.pointer.state = App.INPUT_ACTIVE;
      this.pointer.duration = 1;
      this.pointer.start = this.getPointerXY(e);
      this.pointer.now = this.pointer.start;
      return Utility.stopEvent(e);
    }
  }, {
    key: "onPointerMove",
    value: function onPointerMove(e) {
      if (this.pointer.state === App.INPUT_ACTIVE) {
        this.pointer.now = this.getPointerXY(e);
      }
      return Utility.stopEvent(e);
    }
  }, {
    key: "onPointerEnd",
    value: function onPointerEnd(e) {
      this.pointer.state = App.INPUT_ENDED;
      //this.pointer.now = this.getPointerXY(e);
      return Utility.stopEvent(e);
    }
  }, {
    key: "getPointerXY",
    value: function getPointerXY(e) {
      var boundingBox = this.canvas.getBoundingClientRect ? this.canvas.getBoundingClientRect() : { left: 0, top: 0 };
      var clientX = 0;
      var clientY = 0;
      if (e.clientX && e.clientY) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (e.touches && e.touches.length > 0 && e.touches[0].clientX && e.touches[0].clientY) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      var inputX = (clientX - boundingBox.left) * this.width / boundingBox.width;
      var inputY = (clientY - boundingBox.top) * this.height / boundingBox.height;
      return { x: inputX, y: inputY };
    }

    //----------------------------------------------------------------

  }, {
    key: "onKeyDown",
    value: function onKeyDown(e) {
      var keyCode = this.getKeyCode(e);
      if (keyCode > 0 && keyCode < App.MAX_KEYS) {
        this.keys[keyCode].state = App.INPUT_ACTIVE;
        this.keys[keyCode].duration = 1;
      } //if keyCode == 0, there's an error.
    }
  }, {
    key: "onKeyUp",
    value: function onKeyUp(e) {
      var keyCode = this.getKeyCode(e);
      if (keyCode > 0 && keyCode < App.MAX_KEYS) {
        this.keys[keyCode].state = App.INPUT_ENDED;
      } //if keyCode == 0, there's an error.
    }
  }, {
    key: "getKeyCode",
    value: function getKeyCode(e) {
      //KeyboardEvent.keyCode is the most reliable identifier for a keyboard event
      //at the moment, but unfortunately it's being deprecated.
      if (e.keyCode) {
        return e.keyCode;
      }

      //KeyboardEvent.code and KeyboardEvent.key are the 'new' standards, but it's
      //far from being standardised between browsers.
      if (e.code && KeyValues[e.code]) {
        return KeyValues[e.code];
      } else if (e.key && KeyValues[e.key]) {
        return KeyValues[e.key];
      }

      return 0;
    }
  }]);

  return App;
}();
//==============================================================================

/*  Actor Class
 */
//==============================================================================

var Actor = function Actor(x, y) {
  _classCallCheck(this, Actor);

  this.x = x;
  this.y = y;
  this.size = 32;
};
//==============================================================================

/*  Utility Classes
 */
//==============================================================================

var Utility = {
  randomInt: function randomInt(min, max) {
    var a = min < max ? min : max;
    var b = min < max ? max : min;
    return Math.floor(a + Math.random() * (b - a + 1));
  },

  stopEvent: function stopEvent(e) {
    //var eve = e || window.event;
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    e.returnValue = false;
    e.cancelBubble = true;
    return false;
  }
};

var KeyCodes = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ENTER: 13
};

var KeyValues = {
  "ArrowLeft": KeyCodes.LEFT,
  "Left": KeyCodes.LEFT,
  "ArrowUp": KeyCodes.UP,
  "Up": KeyCodes.UP,
  "ArrowDown": KeyCodes.DOWN,
  "Down": KeyCodes.DOWN,
  "ArrowRight": KeyCodes.RIGHT,
  "Right": KeyCodes.RIGHT,
  "Enter": KeyCodes.ENTER
};

function ImageAsset(url) {
  this.url = url;
  this.img = null;
  this.loaded = false;
  this.img = new Image();
  this.img.onload = function () {
    this.loaded = true;
  }.bind(this);
  this.img.src = this.url;
}
//==============================================================================

//Initialisations
//==============================================================================
var app;
window.onload = function () {
  window.app = new App();
};
//==============================================================================