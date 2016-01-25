/*  CNY2016
 *  (- Shaun A. Noordin, 20160121)
********************************************************************************
 */

/*  Primary App Class
 */
//==============================================================================
class App {
  
  //----------------------------------------------------------------
  
  constructor() {
    
    //--------------------------------
    App.INPUT_IDLE = 0;
    App.INPUT_ACTIVE = 1;
    App.INPUT_ENDED = 2;
    App.STATE_START = 0;
    App.STATE_PLAYING = 1;
    App.FRAMES_PER_SECOND = 30;
    App.COLOUR_SHADOW = "rgba(128,128,128,0.5)";
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
    //--------------------------------
    
    //--------------------------------
    this.inputStart = { x: 0, y: 0 };
    this.inputNow = { x: 0, y: 0 };
    this.inputState = App.INPUT_IDLE;
    this.inputDuration = 0;
    //--------------------------------
    
    //--------------------------------
    if ("onmousedown" in this.canvas && "onmousemove" in this.canvas &&
        "onmouseup" in this.canvas) {
      this.canvas.onmousedown = this.canvasOnPointerStart.bind(this);
      this.canvas.onmousemove = this.canvasOnPointerMove.bind(this);
      this.canvas.onmouseup = this.canvasOnPointerEnd.bind(this);
    }
    
    if ("ontouchstart" in this.canvas && "ontouchmove" in this.canvas &&
        "ontouchend" in this.canvas && "ontouchcancel" in this.canvas) {
      this.canvas.ontouchstart = this.canvasOnPointerStart.bind(this);
      this.canvas.ontouchmove = this.canvasOnPointerMove.bind(this);
      this.canvas.ontouchend = this.canvasOnPointerEnd.bind(this);
      this.canvas.ontouchcancel = this.canvasOnPointerEnd.bind(this);
    }
      
    this.runCycle = setInterval(this.run.bind(this), 1 / App.FRAMES_PER_SECOND);
    //--------------------------------
    
  }
  
  //----------------------------------------------------------------
  
  run() {
    this.context.clearRect(0, 0, this.width, this.height);
    
    if (this.player) {
      this.player.x = this.inputNow.x;
      this.player.y = this.inputNow.y;
      
      this.context.fillStyle = App.COLOUR_SHADOW;
      this.context.beginPath();
      this.context.arc(this.player.x, this.player.y, this.player.size / 2, 0, 2 * Math.PI);
      this.context.fill();
      this.context.closePath();
      
      this.console.innerHTML = this.inputNow.x + ',' + this.inputNow.y;
    }
  }
  
  //----------------------------------------------------------------
  
  canvasOnPointerStart(e) {
    console.log('canvasOnPointerStart()');
    this.inputState = App.INPUT_ACTIVE;
    this.inputDuration = 1;
    this.inputStart = this.getInputXY(e);
    this.inputNow = this.inputStart;
    return Utility.stopEvent(e);
  }
  
  canvasOnPointerMove(e) {
    console.log('canvasOnPointerMove()');
    if (this.inputState === App.INPUT_ACTIVE) {
      this.inputNow = this.getInputXY(e);
    }
    return Utility.stopEvent(e);
  }
  
  canvasOnPointerEnd(e) {
    console.log('canvasOnPointerEnd()');
    this.inputState = App.INPUT_ENDED;
    //this.inputNow = this.getInputXY(e);
    return Utility.stopEvent(e);
  }
  
  getInputXY(e) {
    let boundingBox = (this.canvas.getBoundingClientRect)
      ? this.canvas.getBoundingClientRect()
      : { left: 0, top: 0 };     
    let clientX = 0;
    let clientY = 0;
    if (e.clientX && e.clientY) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e.touches && e.touches.length > 0 && e.touches[0].clientX && e.touches[0].clientY) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    let inputX = (clientX - boundingBox.left) * this.width / boundingBox.width;
    let inputY = (clientY - boundingBox.top) * this.height / boundingBox.height;
    return { x: inputX, y: inputY };
  }
}
//==============================================================================

/*  Actor Class
 */
//==============================================================================
class Actor {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 32;
  }
}
//==============================================================================

/*  Utility Classes
 */
//==============================================================================
var Utility = {
  randomInt: function (min, max) {
    let a = min < max ? min : max;
    let b = min < max ? max : min;
    return Math.floor(a + Math.random() * (b - a  + 1));
  },

  stopEvent: function (e) {
    //var eve = e || window.event;
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    e.returnValue = false;
    e.cancelBubble = true;
    return false;
  }
}

function ImageAsset(url) {
  this.url = url;
  this.img = null;
  this.loaded = false;
  this.img = new Image();
  this.img.onload = function() {
    this.loaded = true;
  }.bind(this);
  this.img.src = this.url;
}
//==============================================================================

//Initialisations
//==============================================================================
var app;
window.onload = function() {
  window.app = new App();
};
//==============================================================================
