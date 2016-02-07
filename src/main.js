/*  
CNY2016
=======

A Chinese New Year greeting card/'endless climber' game with a Year of the
Monkey theme.

(Shaun A. Noordin || shaunanoordin.com || 20160207)
********************************************************************************
 */

/*  Primary App Class
 */
//==============================================================================
class App {
    
  constructor() {
    //--------------------------------
    App.INPUT_IDLE = 0;
    App.INPUT_ACTIVE = 1;
    App.INPUT_ENDED = 2;
    App.INPUT_DISTANCE_SENSITIVITY = 16;  //Only applicable to pointers.
    App.INPUT_DURATION_SENSITIVITY = 2;
    App.STATE_START = 0;
    App.STATE_ADVENTURE = 1;
    App.STATE_END = 2;
    App.FRAMES_PER_SECOND = 50;
    App.MAX_KEYS = 128;
    
    App.COLOUR_SHADOW = 'rgba(128,128,128,0.5)';
    App.COLOUR_BANANA_SHADOW = 'rgba(255,255,64,0.2)';
    App.COLOUR_SPIKES_SHADOW = 'rgba(192,64,64,0.1)';
    App.FONT_SIZE = 32;
    App.FONT_STYLE = App.FONT_SIZE + 'px Verdana';
    App.FONT_COLOUR = 'rgba(255,255,255,0.8)';
    
    App.MONKEY_SPEED = 12;
    App.TILE_SIZE = 64;
    App.TILE_SCROLL_SPEED = 4;
    App.GRAVITY = 4;
    
    App.TILE_TYPE_AIR = 0;
    App.TILE_TYPE_VINE = 1;
    App.DIFFICULTY_RAMP = 50;
    //--------------------------------
    
    //--------------------------------
    this.sprites = new ImageAsset('./assets/cny2016-sprites.png');
    this.animationCounter = 0;
    App.ANIMATION_STEP_LENGTH = 8;
    App.ANIMATION_COUNTER_MAX = 4 * App.ANIMATION_STEP_LENGTH;
    //--------------------------------
    
    //--------------------------------
    App.SPRITE_DATA = {
      MONKEY_0: { srcX: 0 * App.TILE_SIZE, srcY: 0,
        offsetX: -App.TILE_SIZE / 2, offsetY: -App.TILE_SIZE / 2,
        width: App.TILE_SIZE, height: App.TILE_SIZE * 2 },
      MONKEY_1: { srcX: 1 * App.TILE_SIZE, srcY: 0,
        offsetX: -App.TILE_SIZE / 2, offsetY: -App.TILE_SIZE / 2,
        width: App.TILE_SIZE, height: App.TILE_SIZE * 2 },
      MONKEY_2: { srcX: 2 * App.TILE_SIZE, srcY: 0,
        offsetX: -App.TILE_SIZE / 2, offsetY: -App.TILE_SIZE / 2,
        width: App.TILE_SIZE, height: App.TILE_SIZE * 2 },
      VINE_TILE: { srcX: 3 * App.TILE_SIZE, srcY: 0,
        offsetX: 0, offsetY: 0,
        width: App.TILE_SIZE, height: App.TILE_SIZE },
      AIR_TILE: { srcX: 4 * App.TILE_SIZE, srcY: 0,
        offsetX: 0, offsetY: 0,
        width: App.TILE_SIZE, height: App.TILE_SIZE },
      BANANA: { srcX: 3 * App.TILE_SIZE, srcY: App.TILE_SIZE,
        offsetX: -App.TILE_SIZE / 2, offsetY: -App.TILE_SIZE / 2,
        width: App.TILE_SIZE, height: App.TILE_SIZE },
      SPIKES: { srcX: 4 * App.TILE_SIZE, srcY: App.TILE_SIZE,
        offsetX: -App.TILE_SIZE / 2, offsetY: -App.TILE_SIZE / 2,
        width: App.TILE_SIZE, height: App.TILE_SIZE },      
      ARROW_RIGHT_0: { srcX: 5 * App.TILE_SIZE, srcY: 0,
        offsetX: -App.TILE_SIZE / 2, offsetY: -App.TILE_SIZE / 2,
        width: App.TILE_SIZE, height: App.TILE_SIZE },
      ARROW_RIGHT_1: { srcX: 5 * App.TILE_SIZE, srcY: App.TILE_SIZE,
        offsetX: -App.TILE_SIZE / 2, offsetY: -App.TILE_SIZE / 2,
        width: App.TILE_SIZE, height: App.TILE_SIZE },
      ARROW_DOWN_0: { srcX: 6 * App.TILE_SIZE, srcY: 0,
        offsetX: -App.TILE_SIZE / 2, offsetY: -App.TILE_SIZE / 2,
        width: App.TILE_SIZE, height: App.TILE_SIZE },
      ARROW_DOWN_1: { srcX: 6 * App.TILE_SIZE, srcY: App.TILE_SIZE,
        offsetX: -App.TILE_SIZE / 2, offsetY: -App.TILE_SIZE / 2,
        width: App.TILE_SIZE, height: App.TILE_SIZE },
      ARROW_LEFT_0: { srcX: 7 * App.TILE_SIZE, srcY: 0,
        offsetX: -App.TILE_SIZE / 2, offsetY: -App.TILE_SIZE / 2,
        width: App.TILE_SIZE, height: App.TILE_SIZE },
      ARROW_LEFT_1: { srcX: 7 * App.TILE_SIZE, srcY: App.TILE_SIZE,
        offsetX: -App.TILE_SIZE / 2, offsetY: -App.TILE_SIZE / 2,
        width: App.TILE_SIZE, height: App.TILE_SIZE },
      ARROW_UP_0: { srcX: 8 * App.TILE_SIZE, srcY: 0,
        offsetX: -App.TILE_SIZE / 2, offsetY: -App.TILE_SIZE / 2,
        width: App.TILE_SIZE, height: App.TILE_SIZE },
      ARROW_UP_1: { srcX: 8 * App.TILE_SIZE, srcY: App.TILE_SIZE,
        offsetX: -App.TILE_SIZE / 2, offsetY: -App.TILE_SIZE / 2,
        width: App.TILE_SIZE, height: App.TILE_SIZE }
    };
    //--------------------------------
    
    //--------------------------------
    this.container = document.getElementById("app");
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.console = document.getElementById("console");
    this.boundingBox = undefined;  //To be defined by this.updateSize().
    this.sizeRatioX = 1;
    this.sizeRatioY = 1;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    this.state = undefined;
    this.player = undefined;
    this.actors = [];
    this.distanceTravelled = 0;
    this.score = 0;
    this.tiles = [];
    this.tileRowCount = this.height / App.TILE_SIZE + 1;
    this.tileColCount = this.width / App.TILE_SIZE;
    this.tileYOffset = -App.TILE_SIZE;
    //--------------------------------
    
    //--------------------------------
    App.INTERACTION_WAIT_LIMIT = 1 * App.FRAMES_PER_SECOND;
    this.interactionWaitCounter = 0;  //Keeps track of how long a user
                                      //hasn't interacted with the app.
    //--------------------------------
    
    //--------------------------------
    this.keys = new Array(App.MAX_KEYS);
    for (let i = 0; i < this.keys.length; i++) {
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
    }
    //--------------------------------
    
    //--------------------------------
    if ("onmousedown" in this.canvas && "onmousemove" in this.canvas &&
        "onmouseup" in this.canvas) {
      this.canvas.onmousedown = this.onPointerStart.bind(this);
      this.canvas.onmousemove = this.onPointerMove.bind(this);
      this.canvas.onmouseup = this.onPointerEnd.bind(this);
    }    
    if ("ontouchstart" in this.canvas && "ontouchmove" in this.canvas &&
        "ontouchend" in this.canvas && "ontouchcancel" in this.canvas) {
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
    this.changeState(App.STATE_START);
    this.runCycle = setInterval(this.run.bind(this), 1000 / App.FRAMES_PER_SECOND);
    //--------------------------------
  }
  
  //----------------------------------------------------------------
  
  run() {    
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
    
    //Animation Step
    //--------------------------------
    this.animationCounter++;
    if (this.animationCounter >= App.ANIMATION_COUNTER_MAX) {
      this.animationCounter = 0;
    }
    //--------------------------------
    
    //Cleanup Input
    //--------------------------------
    if (this.pointer.state === App.INPUT_ENDED) {
      this.pointer.duration = 0;
      this.pointer.state = App.INPUT_IDLE;
    }
    for (let i = 0; i < this.keys.length; i++) {
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
  
  run_start() {
    //Check if assets are loaded
    //--------------------------------
    if (!this.sprites.loaded) {
      this.context.clearRect(0, 0, this.width, this.height);
      this.context.font = App.FONT_STYLE;
      this.context.fillStyle = App.FONT_COLOUR;
      this.context.fillText('Happy Chinese New Year! Loading...',
        App.FONT_SIZE / 2, App.FONT_SIZE);
      return;
    }
    //--------------------------------
    
    //Get Input: Press up to start the game.
    //--------------------------------
    this.interactionWaitCounter = Math.min(
      this.interactionWaitCounter + 1, App.INTERACTION_WAIT_LIMIT);
    if (this.interactionWaitCounter === App.INTERACTION_WAIT_LIMIT &&
        ((this.pointer.state === App.INPUT_ACTIVE &&
            (this.pointer.start.y - this.pointer.now.y) >
                (App.INPUT_DISTANCE_SENSITIVITY * this.sizeRatioY)) ||
        this.keys[KeyCodes.UP].state === App.INPUT_ACTIVE)) {
      this.changeState(App.STATE_ADVENTURE);
      return;
    }
    //--------------------------------
    
    //Update Visuals
    //--------------------------------
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillStyle = '#39c';
    this.context.fillRect(0, 0, this.width, this.height);
    
    let animationStep = Math.floor(this.animationCounter / App.ANIMATION_STEP_LENGTH);
    
    if (this.interactionWaitCounter === App.INTERACTION_WAIT_LIMIT) {      
      let arrowSprite = (animationStep < 2) ?
        App.SPRITE_DATA.ARROW_UP_0 :
        App.SPRITE_DATA.ARROW_UP_1;
      this.context.drawImage(this.sprites.img,
        arrowSprite.srcX, arrowSprite.srcY,
        arrowSprite.width, arrowSprite.height,
        Math.round(this.width / 2 + arrowSprite.offsetX),
        Math.round(this.height - 2 * App.TILE_SIZE + arrowSprite.offsetY),
        arrowSprite.width, arrowSprite.height);
    }
    //--------------------------------
  }
  
  //----------------------------------------------------------------
  
  run_end() {    
    //Get Input: Press up to restart the game.
    //--------------------------------
    this.interactionWaitCounter = Math.min(
      this.interactionWaitCounter + 1, App.INTERACTION_WAIT_LIMIT);
    if (this.interactionWaitCounter === App.INTERACTION_WAIT_LIMIT &&
        ((this.pointer.state === App.INPUT_ACTIVE &&
            (this.pointer.start.y - this.pointer.now.y) >
                (App.INPUT_DISTANCE_SENSITIVITY * this.sizeRatioY)) ||
        this.keys[KeyCodes.UP].state === App.INPUT_ACTIVE)) {
      this.changeState(App.STATE_START);
      return;
    }
    //--------------------------------
    
    //Update Visuals
    //--------------------------------
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillStyle = '#c33';
    this.context.fillRect(0, 0, this.width, this.height);
    
    let animationStep = Math.floor(this.animationCounter / App.ANIMATION_STEP_LENGTH);
    
    if (this.interactionWaitCounter === App.INTERACTION_WAIT_LIMIT) {      
      let arrowSprite = (animationStep < 2) ?
        App.SPRITE_DATA.ARROW_UP_0 :
        App.SPRITE_DATA.ARROW_UP_1;
      this.context.drawImage(this.sprites.img,
        arrowSprite.srcX, arrowSprite.srcY,
        arrowSprite.width, arrowSprite.height,
        Math.round(this.width / 2 + arrowSprite.offsetX),
        Math.round(this.height - 2 * App.TILE_SIZE + arrowSprite.offsetY),
        arrowSprite.width, arrowSprite.height);
    }
    //--------------------------------
  }
  
  //----------------------------------------------------------------
  
  run_adventure() {
    //Get User Input
    //--------------------------------
    this.player.intent = { x: 0, y: 0 };
    
    if (this.pointer.state === App.INPUT_ACTIVE) {  //Pointer input
      let distX = this.pointer.now.x - this.pointer.start.x;
      let distY = this.pointer.now.y - this.pointer.start.y;
      let dist = Math.sqrt(distX * distX + distY * distY);
      
      if (dist >= App.INPUT_DISTANCE_SENSITIVITY * this.sizeRatioY) {
        let angle = Math.atan2(distY, distX);
        let speed = App.MONKEY_SPEED;        
        this.player.intent.x = Math.cos(angle) * speed;
        this.player.intent.y = Math.sin(angle) * speed;
        
        //UX improvement: reset the base point of the pointer so the player can
        //switch directions much more easily.
        if (dist >= App.INPUT_DISTANCE_SENSITIVITY * this.sizeRatioY * 2) {
          this.pointer.start.x = this.pointer.now.x - Math.cos(angle) *
            App.INPUT_DISTANCE_SENSITIVITY * this.sizeRatioY * 2;
          this.pointer.start.y = this.pointer.now.y - Math.sin(angle) *
            App.INPUT_DISTANCE_SENSITIVITY * this.sizeRatioY * 2;
        }
      }
    } else {  //Key input
      if (this.keys[KeyCodes.LEFT].state === App.INPUT_ACTIVE &&
          this.keys[KeyCodes.RIGHT].state != App.INPUT_ACTIVE) {
        this.player.intent.x = -App.MONKEY_SPEED;
      } else if (this.keys[KeyCodes.LEFT].state != App.INPUT_ACTIVE &&
          this.keys[KeyCodes.RIGHT].state === App.INPUT_ACTIVE) {
        this.player.intent.x = App.MONKEY_SPEED;
      }
      
      if (this.keys[KeyCodes.UP].state === App.INPUT_ACTIVE &&
          this.keys[KeyCodes.DOWN].state != App.INPUT_ACTIVE) {
        this.player.intent.y = -App.MONKEY_SPEED;
      } else if (this.keys[KeyCodes.UP].state != App.INPUT_ACTIVE &&
          this.keys[KeyCodes.DOWN].state === App.INPUT_ACTIVE) {
        this.player.intent.y = App.MONKEY_SPEED;
      }
          
      if (this.player.intent.x !== 0 && this.player.intent.y !== 0) {
        this.player.intent.x /= Math.sqrt(2);
        this.player.intent.y /= Math.sqrt(2);
      }
    }
    //--------------------------------
    
    //Climb Tree/Scroll the Tiles
    //--------------------------------
    this.tileYOffset += App.TILE_SCROLL_SPEED;
    this.distanceTravelled += App.TILE_SCROLL_SPEED;
    if (this.tileYOffset >= 0) {
      this.tileYOffset -= App.TILE_SIZE;
      this.addTileRow();
      this.removeTileRow();
    }
    //--------------------------------
    
    //Apply Physics
    //--------------------------------
    for (let i = 0, actor; actor = this.actors[i]; i++) {
      if (actor == this.player) {  //Player
        //Apply player's intended speed
        //----------------
        actor.speed.x = actor.intent.x;
        actor.speed.y = actor.intent.y;
        //----------------
        
        //Check tile the player is on
        //----------------
        let tileX = Math.floor(actor.x / App.TILE_SIZE);
        let tileY = Math.floor((actor.y - this.tileYOffset) / App.TILE_SIZE);
        tileX = Math.min(Math.max(0, tileX), this.tileColCount - 1);
        tileY = Math.min(Math.max(0, tileY), this.tileRowCount - 1);
        if (this.tiles[tileY][tileX] === App.TILE_TYPE_AIR) {
          if (actor.speed.y < 0) {  //It's hard to climb if it ain't a vine!
            actor.speed.y /= 2;
          }
          actor.speed.y += App.GRAVITY + App.TILE_SCROLL_SPEED;
        }
        //----------------
      } else {  //Banana or Spikes
        //Is it colliding with the player?
        //----------------
        let collisionThreshold = this.player.size / 2 + actor.size / 2;
        let distX = this.player.x - actor.x;
        let distY = this.player.y - actor.y;
        if (collisionThreshold * collisionThreshold >
            distX * distX + distY * distY) {
          if (actor.type === Actor.TYPE_BANANA) {
            this.score++;
            actor.state = Actor.STATE_PLEASEDELETEME;
          } else if (actor.type === Actor.TYPE_SPIKES) {
            this.changeState(App.STATE_END);
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
      if (actor.y > this.height + actor.size) {  //Bottom border
        if (actor == this.player) {
          this.changeState(App.STATE_END);
          return;
        } else {
          actor.state = Actor.STATE_PLEASEDELETEME;
        }
      }
      actor.y = Math.max(actor.y, -actor.size / 2);  //Top border
      actor.x = Math.max(actor.x, actor.size / 2);  //Left border
      actor.x = Math.min(actor.x, this.width - actor.size / 2);  //Right border
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
    let animationStep =
      Math.floor(this.animationCounter / App.ANIMATION_STEP_LENGTH);
    
    //Tiles
    for (let y = 0; y < this.tiles.length; y++) {
      for (let x = 0; x < this.tiles[y].length; x++) {
        let tileSprite = (this.tiles[y][x] === App.TILE_TYPE_VINE) ?
          App.SPRITE_DATA.VINE_TILE :
          App.SPRITE_DATA.AIR_TILE;
        this.context.drawImage(this.sprites.img,
          tileSprite.srcX, tileSprite.srcY,
          tileSprite.width, tileSprite.height,
          Math.floor(x * App.TILE_SIZE) + tileSprite.offsetX,
          Math.floor(y * App.TILE_SIZE + this.tileYOffset) + tileSprite.offsetY,
          tileSprite.width, tileSprite.height);
      }
    }
    
    //Actors
    for (let i = this.actors.length - 1, actor; actor = this.actors[i]; i--) {
      let actorSprite = App.SPRITE_DATA.ARROW_DOWN_0;
      if (actor.type === Actor.TYPE_MONKEY) {
        this.context.fillStyle = App.COLOUR_SHADOW;
        if (animationStep === 1) {
          actorSprite = App.SPRITE_DATA.MONKEY_1;
        } else if (animationStep === 3) {
          actorSprite = App.SPRITE_DATA.MONKEY_2;
        } else {
          actorSprite = App.SPRITE_DATA.MONKEY_0;
        }
      } else if (actor.type === Actor.TYPE_BANANA) {
        this.context.fillStyle = App.COLOUR_BANANA_SHADOW;
        actorSprite = App.SPRITE_DATA.BANANA;
      } else if (actor.type === Actor.TYPE_SPIKES) {
        this.context.fillStyle = App.COLOUR_SPIKES_SHADOW;
        actorSprite = App.SPRITE_DATA.SPIKES;
      } else {
        this.context.fillStyle = App.COLOUR_SHADOW;
        actorSprite = App.SPRITE_DATA.ARROW_DOWN_0;
      }
      
      //Draw shadow
      this.context.beginPath();
      this.context.arc(actor.x, actor.y, actor.size / 2, 0, 2 * Math.PI);
      this.context.fill();
      this.context.closePath();
      
      //Draw sprite
      this.context.drawImage(this.sprites.img,
        actorSprite.srcX, actorSprite.srcY,
        actorSprite.width, actorSprite.height,
        Math.round(actor.x) + actorSprite.offsetX,
        Math.round(actor.y) + actorSprite.offsetY,
        actorSprite.width, actorSprite.height);
    }
    
    //Score
    this.context.font = App.FONT_STYLE;
    this.context.fillStyle = App.FONT_COLOUR;
    this.context.fillText('Bananas: ' + this.score,
      App.FONT_SIZE, App.FONT_SIZE);
    
    //Input Marker - Helps show where User Input started.
    if (this.pointer.state === App.INPUT_ACTIVE) {
      this.context.fillStyle = App.COLOUR_SHADOW;
      this.context.beginPath();
      this.context.arc(this.pointer.start.x, this.pointer.start.y,
        App.INPUT_DISTANCE_SENSITIVITY * this.sizeRatioY, 0, 2 * Math.PI);
      this.context.fill();
      this.context.closePath();
    }
    
    //Hint Marker - Helps show user what the controls are
    if (this.pointer.state === App.INPUT_IDLE &&
        this.keys[KeyCodes.RIGHT].state === App.INPUT_IDLE &&
        this.keys[KeyCodes.DOWN].state === App.INPUT_IDLE &&
        this.keys[KeyCodes.LEFT].state === App.INPUT_IDLE &&
        this.keys[KeyCodes.UP].state === App.INPUT_IDLE) {
      if (this.interactionWaitCounter < App.INTERACTION_WAIT_LIMIT) {
        this.interactionWaitCounter++;
      } else {
        let arrowSprite;
        
        arrowSprite = (animationStep < 2) ?
          App.SPRITE_DATA.ARROW_RIGHT_0 :
          App.SPRITE_DATA.ARROW_RIGHT_1;
        this.context.drawImage(this.sprites.img,
          arrowSprite.srcX, arrowSprite.srcY,
          arrowSprite.width, arrowSprite.height,
          Math.round(this.player.x + arrowSprite.offsetX + arrowSprite.width),
          Math.round(this.player.y + arrowSprite.offsetY),
          arrowSprite.width, arrowSprite.height);
        
        arrowSprite = (animationStep < 2) ?
          App.SPRITE_DATA.ARROW_DOWN_0 :
          App.SPRITE_DATA.ARROW_DOWN_1;
        this.context.drawImage(this.sprites.img,
          arrowSprite.srcX, arrowSprite.srcY,
          arrowSprite.width, arrowSprite.height,
          Math.round(this.player.x + arrowSprite.offsetX),
          Math.round(this.player.y + arrowSprite.offsetY + arrowSprite.height),
          arrowSprite.width, arrowSprite.height);
        
        arrowSprite = (animationStep < 2) ?
          App.SPRITE_DATA.ARROW_LEFT_0 :
          App.SPRITE_DATA.ARROW_LEFT_1;
        this.context.drawImage(this.sprites.img,
          arrowSprite.srcX, arrowSprite.srcY,
          arrowSprite.width, arrowSprite.height,
          Math.round(this.player.x + arrowSprite.offsetX - arrowSprite.width),
          Math.round(this.player.y + arrowSprite.offsetY),
          arrowSprite.width, arrowSprite.height);
        
        arrowSprite = (animationStep < 2) ?
          App.SPRITE_DATA.ARROW_UP_0 :
          App.SPRITE_DATA.ARROW_UP_1;
        this.context.drawImage(this.sprites.img,
          arrowSprite.srcX, arrowSprite.srcY,
          arrowSprite.width, arrowSprite.height,
          Math.round(this.player.x + arrowSprite.offsetX),
          Math.round(this.player.y + arrowSprite.offsetY - arrowSprite.height),
          arrowSprite.width, arrowSprite.height);
      }
    } else {
      this.interactionWaitCounter = 0;
    }
    //--------------------------------
    
    //Debug
    //--------------------------------
    //this.console.innerHTML = 'Actors: ' + this.actors.length;
    //--------------------------------

  }
  
  //----------------------------------------------------------------
  
  onPointerStart(e) {
    this.pointer.state = App.INPUT_ACTIVE;
    this.pointer.duration = 1;
    this.pointer.start = this.getPointerXY(e);
    this.pointer.now = this.pointer.start;
    return Utility.stopEvent(e);
  }
  
  onPointerMove(e) {
    if (this.pointer.state === App.INPUT_ACTIVE) {
      this.pointer.now = this.getPointerXY(e);
    }
    return Utility.stopEvent(e);
  }
  
  onPointerEnd(e) {
    this.pointer.state = App.INPUT_ENDED;
    //this.pointer.now = this.getPointerXY(e);
    return Utility.stopEvent(e);
  }
  
  getPointerXY(e) {
    let clientX = 0;
    let clientY = 0;
    if (e.clientX && e.clientY) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e.touches && e.touches.length > 0 && e.touches[0].clientX &&
        e.touches[0].clientY) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    let inputX = (clientX - this.boundingBox.left) * this.sizeRatioX;
    let inputY = (clientY - this.boundingBox.top) * this.sizeRatioY;
    return { x: inputX, y: inputY };
  }

  //----------------------------------------------------------------
  
  onKeyDown(e) {
    let keyCode = this.getKeyCode(e);    
    if (keyCode > 0 && keyCode < App.MAX_KEYS && this.keys[keyCode].state != App.INPUT_ACTIVE) {
      this.keys[keyCode].state = App.INPUT_ACTIVE;
      this.keys[keyCode].duration = 1;
    }  //if keyCode == 0, there's an error.
  }
  
  onKeyUp(e) {
    let keyCode = this.getKeyCode(e);    
    if (keyCode > 0 && keyCode < App.MAX_KEYS) {
      this.keys[keyCode].state = App.INPUT_ENDED;
    }  //if keyCode == 0, there's an error.
  }
  
  getKeyCode(e) {
    //KeyboardEvent.keyCode is the most reliable identifier for a keyboard event
    //at the moment, but unfortunately it's being deprecated.
    if (e.keyCode) { 
      return e.keyCode;
    }
    
    //KeyboardEvent.code and KeyboardEvent.key are the 'new' standards, but it's
    //far from being standardised between browsers.
    if (e.code && KeyValues[e.code]) {
      return KeyValues[e.code]
    } else if (e.key && KeyValues[e.key]) {
      return KeyValues[e.key]
    }
    
    return 0;
  }
  
  //----------------------------------------------------------------
  
  updateSize() {
    let boundingBox = (this.canvas.getBoundingClientRect)
      ? this.canvas.getBoundingClientRect()
      : { left: 0, top: 0 };
    this.boundingBox = boundingBox;
    this.sizeRatioX = this.width / this.boundingBox.width;
    this.sizeRatioY = this.height / this.boundingBox.height;
  }
  
  //----------------------------------------------------------------
  
  changeState(state) {
    //Initialise keys
    //--------------------------------
    this.keys = new Array(App.MAX_KEYS);
    for (let i = 0; i < this.keys.length; i++) {
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
    }
    //--------------------------------
    
    //Change state
    //--------------------------------
    this.state = state;
    this.interactionWaitCounter = 0;
    if (state === App.STATE_ADVENTURE) {      
      this.player = new Actor(Actor.TYPE_MONKEY, this.width / 2, this.height / 2);
      this.actors = [this.player];
      this.distanceTravelled = 0;
      this.score = 0;
      this.tiles = [];
      this.tileYOffset = -App.TILE_SIZE;
      for (let i = 0; i < this.tileRowCount; i++) {
        this.addTileRow();
      }
    }
    //--------------------------------
  }
  
  //----------------------------------------------------------------
  
  /*  Add a new row of tiles at the top.
   */
  addTileRow() {
    //A new row of randomised tiles.
    //--------------------------------
    let difficultyLevel = this.distanceTravelled /
      (App.TILE_SIZE * App.DIFFICULTY_RAMP);
    let newRow = [];
    for (let i = 0; i < this.tileColCount; i++) {
      let newTile = App.TILE_TYPE_AIR;
      
      if (i >= 1 && i < this.tileColCount - 1) {
        if (difficultyLevel < 1 ||
            Utility.randomInt(1,5) > 1) {
          newTile = App.TILE_TYPE_VINE
        }
      }
      newRow.push(newTile);
    }
    this.tiles.unshift(newRow);
    //--------------------------------
    
    //Add a banana.
    //--------------------------------
    if (difficultyLevel > 0 &&
        Utility.randomInt(1,3) === 1) {
      let newActor = new Actor(
        Actor.TYPE_BANANA,
        Utility.randomInt(App.TILE_SIZE, this.width - App.TILE_SIZE),
        - App.TILE_SIZE / 2);
      newActor.speed.y = App.TILE_SCROLL_SPEED;
      this.actors.push(newActor);
    }
    //--------------------------------
    
    //Add increasing number of spikes.
    //--------------------------------
    for (let i = 2; i < difficultyLevel; i++) {
      if (Utility.randomInt(1,6) === 1) {
        let newActor = new Actor(
          Actor.TYPE_SPIKES,
          Utility.randomInt(App.TILE_SIZE, this.width - App.TILE_SIZE),
          - App.TILE_SIZE / 2);
        newActor.speed.y = App.TILE_SCROLL_SPEED +
          App.GRAVITY * Utility.randomInt(1,3) * 0.5;
        this.actors.push(newActor);
      }
    }
    //--------------------------------
  }
  
  /*  Add bottom-most row of tiles.
   */
  removeTileRow() {
    this.tiles.pop();
  }
}
//==============================================================================

/*  Actor Class
 */
//==============================================================================
class Actor {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.state = Actor.STATE_OK;
    this.intent = {
      x: 0,
      y: 0
    };
    this.speed = {
      x: 0,
      y: 0
    };
    this.size = 64;
  }
}
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

var KeyCodes = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ENTER: 13,
  SPACE: 32,
  ESCAPE: 27
}

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

/*  Initialisations
 */
//==============================================================================
var app;
window.onload = function() {
  window.app = new App();
};
//==============================================================================
