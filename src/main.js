/*  Main JS
 *  (- Shaun A. Noordin, 20160121)
********************************************************************************
 */

/*  Primary App Class
 */
//==============================================================================
class App {
  constructor() {
    this.container = document.getElementById("app");
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    
    this.canvas.onclick = this.canvasOnClick;
  }
  
  canvasOnClick(e) {
    console.log(e);
  }
}
//==============================================================================

//Initialisations
//==============================================================================
var app;
window.onload = function() {
  window.app = new App();
};
//==============================================================================
