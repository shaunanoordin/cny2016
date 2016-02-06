'use strict';

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
    App.INPUT_DISTANCE_SENSITIVITY = 64; //Only applicable to pointers.
    App.INPUT_DURATION_SENSITIVITY = 2;
    App.STATE_START = 0;
    App.STATE_ADVENTURE = 1;
    App.STATE_END = 2;
    App.FRAMES_PER_SECOND = 30;
    App.COLOUR_SHADOW = 'rgba(128,128,128,0.5)';
    App.COLOUR_BANANA_SHADOW = 'rgba(255,255,64,0.5)';
    App.COLOUR_SPIKES_SHADOW = 'rgba(192,64,64,0.5)';
    App.COLOUR_TILE_AIR = 'rgba(192,255,255,1)';
    App.COLOUR_TILE_VINE = 'rgba(128,192,128,1)';
    App.MAX_KEYS = 128;

    App.MONKEY_SPEED = 8;
    App.TILE_SIZE = 64;
    App.TILE_SCROLL_SPEED = 8;
    App.SPIKES_SPEED = App.TILE_SCROLL_SPEED + 4;

    App.TILE_TYPE_AIR = 0;
    App.TILE_TYPE_VINE = 1;
    //--------------------------------

    //--------------------------------
    this.container = document.getElementById("app");
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.console = document.getElementById("console");
    this.boundingBox = undefined; //To be defined by this.updateSize().
    this.sizeRatioX = 1;
    this.sizeRatioY = 1;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.state = App.STATE_START;
    this.player = new Actor(Actor.TYPE_MONKEY, this.width / 2, this.height / 2);
    this.actors = [this.player];
    this.tiles = [];
    this.tileRowCount = this.height / App.TILE_SIZE + 1;
    this.tileColCount = this.width / App.TILE_SIZE;
    this.tileYOffset = -App.TILE_SIZE;
    for (var i = 0; i < this.tileRowCount; i++) {
      this.addTileRow();
    }
    console.log(this.tiles);
    //--------------------------------

    //--------------------------------
    this.keys = new Array(App.MAX_KEYS);
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
    if ("onresize" in window) {
      window.onresize = this.updateSize.bind(this);
    }
    this.updateSize();
    //--------------------------------

    //--------------------------------
    this.runCycle = setInterval(this.run.bind(this), 1000 / App.FRAMES_PER_SECOND);
    //--------------------------------
  }

  //----------------------------------------------------------------

  _createClass(App, [{
    key: 'run',
    value: function run() {
      //Switch To State
      //--------------------------------
      switch (this.state) {
        case App.STATE_START:
          this.run_start();
          break;
        case App.STATE_ADVENTURE:
          this.run_adventure();
          break;
        case App.STATE_END:
          this.run_end();
          break;
        default:
          break;
      }
      //--------------------------------

      //Cleanup Input
      //--------------------------------
      for (var i = 0; i < this.keys.length; i++) {
        if (this.keys[i].state === App.INPUT_ACTIVE) {
          this.keys[i].duration++;
        } else if (this.keys[i].state === App.INPUT_ENDED) {
          this.keys[i].duration = 0;
          this.keys[i].state = App.INPUT_IDLE;
        }
      }
      //--------------------------------
    }

    //----------------------------------------------------------------

  }, {
    key: 'run_start',
    value: function run_start() {
      //TEST: Press up to start the game.
      //--------------------------------
      if (this.pointer.state === App.INPUT_ACTIVE && this.pointer.start.y - this.pointer.now.y > App.INPUT_DISTANCE_SENSITIVITY * this.sizeRatioY || this.keys[KeyCodes.UP].state === App.INPUT_ACTIVE) {
        this.state = App.STATE_ADVENTURE;
        return;
      }
      //--------------------------------

      //Update Visuals
      //--------------------------------
      this.context.clearRect(0, 0, this.width, this.height);
      this.context.fillStyle = '#39c';
      this.context.fillRect(0, 0, this.width, this.height);
      //--------------------------------
    }

    //----------------------------------------------------------------

  }, {
    key: 'run_adventure',
    value: function run_adventure() {

      //Get User Input
      //--------------------------------
      this.player.intent = { x: 0, y: 0 };

      if (this.pointer.state === App.INPUT_ACTIVE) {
        //this.player.x = this.pointer.now.x;
        //this.player.y = this.pointer.now.y;
      }

      if (this.keys[KeyCodes.LEFT].state === App.INPUT_ACTIVE && this.keys[KeyCodes.RIGHT].state != App.INPUT_ACTIVE) {
        this.player.intent.x = -App.MONKEY_SPEED;
      } else if (this.keys[KeyCodes.LEFT].state != App.INPUT_ACTIVE && this.keys[KeyCodes.RIGHT].state === App.INPUT_ACTIVE) {
        this.player.intent.x = App.MONKEY_SPEED;
      }

      if (this.keys[KeyCodes.UP].state === App.INPUT_ACTIVE && this.keys[KeyCodes.DOWN].state != App.INPUT_ACTIVE) {
        this.player.intent.y = -App.MONKEY_SPEED;
      } else if (this.keys[KeyCodes.UP].state != App.INPUT_ACTIVE && this.keys[KeyCodes.DOWN].state === App.INPUT_ACTIVE) {
        this.player.intent.y = App.MONKEY_SPEED;
      }

      if (this.keys[KeyCodes.SPACE].state === App.INPUT_ACTIVE && this.keys[KeyCodes.SPACE].duration === App.INPUT_DURATION_SENSITIVITY) {
        var newActor = new Actor(Utility.randomInt(1, 2) === 1 ? Actor.TYPE_SPIKES : Actor.TYPE_BANANA, Utility.randomInt(App.TILE_SIZE, this.width - App.TILE_SIZE), Utility.randomInt(App.TILE_SIZE, this.height - App.TILE_SIZE));
        newActor.speed.y = newActor.type === Actor.TYPE_SPIKES ? App.SPIKES_SPEED : App.TILE_SCROLL_SPEED;
        this.actors.push(newActor);
      }
      //--------------------------------

      //Climb Tree/Scroll the Tiles
      //--------------------------------
      this.tileYOffset += App.TILE_SCROLL_SPEED;
      if (this.tileYOffset >= 0) {
        this.tileYOffset -= App.TILE_SIZE;
        this.addTileRow();
        this.removeTileRow();
      }
      //--------------------------------

      //Apply Physics
      //--------------------------------
      for (var i = 0, actor; actor = this.actors[i]; i++) {
        if (actor == this.player) {
          //Player
          //----------------
          actor.speed.x = actor.intent.x;
          actor.speed.y = actor.intent.y;
          //----------------
        } else {
            //Banana or Spikes
            //Is it colliding with the player?
            //----------------
            var collisionThreshold = this.player.size / 2 + actor.size / 2;
            var distX = this.player.x - actor.x;
            var distY = this.player.y - actor.y;
            if (collisionThreshold * collisionThreshold > distX * distX + distY * distY) {
              if (actor.type === Actor.TYPE_BANANA) {
                actor.state = Actor.STATE_PLEASEDELETEME;
              } else if (actor.type === Actor.TYPE_SPIKES) {
                this.state = App.STATE_END;
                return;
              }
            }
            //----------------
          }

        //Physics? Physics!
        //----------------
        actor.x += actor.speed.x;
        actor.y += actor.speed.y;
        //----------------

        //Check the boundaries of the actor.
        //----------------
        if (actor.y > this.height + actor.size) {
          //Bottom border
          if (actor == this.player) {
            this.state = App.STATE_END;
            return;
          } else {
            actor.state = Actor.STATE_PLEASEDELETEME;
          }
        }
        actor.y = Math.max(actor.y, -actor.size / 2); //Top border
        actor.x = Math.max(actor.x, actor.size / 2); //Left border
        actor.x = Math.min(actor.x, this.width - actor.size / 2); //Right border
        //----------------

        //Cleanup
        //----------------
        if (actor.state === Actor.STATE_PLEASEDELETEME) {
          this.actors.splice(i, 1);
          //Note that the for() loop counts down, not counts up, to accommodate
          //the splice().
        }
        //----------------
      }
      //--------------------------------

      //Update Visuals
      //--------------------------------
      this.context.clearRect(0, 0, this.width, this.height);

      //Tiles
      this.console.innerHTML = '';
      for (var y = 0; y < this.tiles.length; y++) {
        this.console.innerHTML += '#';
        for (var x = 0; x < this.tiles[y].length; x++) {
          this.console.innerHTML += '+';
          switch (this.tiles[y][x]) {
            case App.TILE_TYPE_VINE:
              this.context.fillStyle = App.COLOUR_TILE_VINE;
              break;
            default:
              this.context.fillStyle = App.COLOUR_TILE_AIR;
              break;
          }
          this.context.fillRect(x * App.TILE_SIZE, y * App.TILE_SIZE + this.tileYOffset, App.TILE_SIZE, App.TILE_SIZE);
        }
      }
      //this.console.innerHTML = this.tiles[0].length +'x'+ this.tiles.length;

      //Actors
      for (var i = this.actors.length - 1, actor; actor = this.actors[i]; i--) {
        if (actor.type === Actor.TYPE_MONKEY) {
          this.context.fillStyle = App.COLOUR_SHADOW;
        } else if (actor.type === Actor.TYPE_BANANA) {
          this.context.fillStyle = App.COLOUR_BANANA_SHADOW;
        } else if (actor.type === Actor.TYPE_SPIKES) {
          this.context.fillStyle = App.COLOUR_SPIKES_SHADOW;
        } else {
          this.context.fillStyle = App.COLOUR_SHADOW;
        }
        this.context.beginPath();
        this.context.arc(actor.x, actor.y, actor.size / 2, 0, 2 * Math.PI);
        this.context.fill();
        this.context.closePath();
      }

      //this.context.beginPath();
      //this.context.moveTo(this.pointer.start.x, this.pointer.start.y);
      //this.context.lineTo(this.pointer.now.x, this.pointer.now.y);
      //this.context.stroke();
      //this.context.closePath();
      //--------------------------------

      //Debug
      //--------------------------------
      //this.console.innerHTML = 'Actors: ' + this.actors.length;
      //--------------------------------
    }

    //----------------------------------------------------------------

  }, {
    key: 'run_end',
    value: function run_end() {
      //Update Visuals
      //--------------------------------
      this.context.clearRect(0, 0, this.width, this.height);
      this.context.fillStyle = '#c33';
      this.context.fillRect(0, 0, this.width, this.height);
      //--------------------------------
    }

    //----------------------------------------------------------------

  }, {
    key: 'onPointerStart',
    value: function onPointerStart(e) {
      this.pointer.state = App.INPUT_ACTIVE;
      this.pointer.duration = 1;
      this.pointer.start = this.getPointerXY(e);
      this.pointer.now = this.pointer.start;
      return Utility.stopEvent(e);
    }
  }, {
    key: 'onPointerMove',
    value: function onPointerMove(e) {
      if (this.pointer.state === App.INPUT_ACTIVE) {
        this.pointer.now = this.getPointerXY(e);
      }
      return Utility.stopEvent(e);
    }
  }, {
    key: 'onPointerEnd',
    value: function onPointerEnd(e) {
      this.pointer.state = App.INPUT_ENDED;
      //this.pointer.now = this.getPointerXY(e);
      return Utility.stopEvent(e);
    }
  }, {
    key: 'getPointerXY',
    value: function getPointerXY(e) {
      var clientX = 0;
      var clientY = 0;
      if (e.clientX && e.clientY) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (e.touches && e.touches.length > 0 && e.touches[0].clientX && e.touches[0].clientY) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      var inputX = (clientX - this.boundingBox.left) * this.sizeRatioX;
      var inputY = (clientY - this.boundingBox.top) * this.sizeRatioY;
      return { x: inputX, y: inputY };
    }

    //----------------------------------------------------------------

  }, {
    key: 'onKeyDown',
    value: function onKeyDown(e) {
      var keyCode = this.getKeyCode(e);
      if (keyCode > 0 && keyCode < App.MAX_KEYS && this.keys[keyCode].state != App.INPUT_ACTIVE) {
        this.keys[keyCode].state = App.INPUT_ACTIVE;
        this.keys[keyCode].duration = 1;
      } //if keyCode == 0, there's an error.
    }
  }, {
    key: 'onKeyUp',
    value: function onKeyUp(e) {
      var keyCode = this.getKeyCode(e);
      if (keyCode > 0 && keyCode < App.MAX_KEYS) {
        this.keys[keyCode].state = App.INPUT_ENDED;
      } //if keyCode == 0, there's an error.
    }
  }, {
    key: 'getKeyCode',
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

    //----------------------------------------------------------------

  }, {
    key: 'updateSize',
    value: function updateSize() {
      var boundingBox = this.canvas.getBoundingClientRect ? this.canvas.getBoundingClientRect() : { left: 0, top: 0 };
      this.boundingBox = boundingBox;
      this.sizeRatioX = this.width / this.boundingBox.width;
      this.sizeRatioY = this.height / this.boundingBox.height;
    }

    //----------------------------------------------------------------

    /*  Add a new row of tiles at the top.
     */

  }, {
    key: 'addTileRow',
    value: function addTileRow() {
      var newRow = [];
      for (var i = 0; i < this.tileColCount; i++) {
        var newTile = i >= 1 && i < this.tileColCount - 1 ? Utility.randomInt(1, 3) : 1;
        switch (newTile) {
          case 2:
          case 3:
            newTile = App.TILE_TYPE_VINE;
            break;
          default:
            newTile = App.TILE_TYPE_AIR;
            break;
        }
        newRow.push(newTile);
      }
      this.tiles.unshift(newRow);
    }

    /*  Add bottom-most row of tiles.
     */

  }, {
    key: 'removeTileRow',
    value: function removeTileRow() {
      this.tiles.pop();
    }
  }]);

  return App;
}();
//==============================================================================

/*  Actor Class
 */
//==============================================================================

var Actor = function Actor(type, x, y) {
  _classCallCheck(this, Actor);

  this.type = type;
  this.x = x;
  this.y = y;
  this.state = Actor.STATE_OK;
  this.intention = {
    x: 0,
    y: 0
  };
  this.speed = {
    x: 0,
    y: 0
  };
  this.size = 64;
};

Actor.TYPE_MONKEY = 1;
Actor.TYPE_BANANA = 2;
Actor.TYPE_SPIKES = 3;
Actor.STATE_OK = 1;
Actor.STATE_PLEASEDELETEME = 2;
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
  ENTER: 13,
  SPACE: 32,
  ESCAPE: 27
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
  "Enter": KeyCodes.ENTER,
  "Space": KeyCodes.SPACE,
  " ": KeyCodes.SPACE,
  "Esc": KeyCodes.ESCAPE,
  "Escape": KeyCodes.ESCAPE
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