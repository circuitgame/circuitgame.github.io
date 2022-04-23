//Answers
import { ANSWER } from "./nums.js";

//Determines if user is on mobile
function mobileTest(){
    var isMobile = window.matchMedia("only screen and (max-width: 760px)");
    return isMobile.matches ? true : false;
}

//Initialize Canvas
var canvas = document.getElementsByClassName("game");
var parent = document.getElementsByClassName("gameCont");
canvas[0].width = parent[0].offsetWidth;
canvas[0].height = document.body.clientHeight;

//Return date in mm/dd/yyyy format
function GetFormattedDate() {
    var d = new Date();
    var datestring = (d.getMonth()+1)  + "/" + d.getDate() + "/" + d.getFullYear()
    return datestring;
}

//Copiable scorecard generation
function generateScoreCard () {
    let result = ``;
    clip_result  = "";
    let first_line = "Circuit " + GetFormattedDate() + "\n\n";

    for( var i=0; i< pastGuesses.length; i++ )
    {
      switch (pastGuesses[i].color) {
        case '#51ff45':
          result = result + '✅';
          break;
        case '#c1ff4d':
          result = result + '🟢';
          break;
        case '#fceb4c':
          result = result + '🟡';
          break;
        case '#ffa647':
          result = result + '🟠';
          break;
        case '#ff774a':
          result = result + '🟠';
          break;
        default:
          result = result + '🔴';
          break;
      }
    }
    var link = "\n\nhttp://www.circuitgame.us";
    link.link("http://www.circuitgame.us");
    clip_result = first_line + result + " = " + numGuesses + link;
    emoji_result  = result;
}

//Define color hex values for drawing circles
const colors = {
  red: "#ff3430",
  orange: "#ff774a",
  lightOrange: "#ffa647",
  yellow: "#fceb4c",
  green: "#c1ff4d",
  correct: "#51ff45"
};

//Define variables
const context = document.querySelector("canvas").getContext("2d");
context.width = document.body.clientWidth;
context.height = document.body.clientHeight;
let userRadius = 0;
let gen_cookies = true;
let win_anim = 0;
let emoji_result  = "";
let down = "none";
let chosenColor = "";
let lineWidth = 2;
let diff = 0;
let exit = false;
let clicked = false;
let pastGuesses = [];
let numGuesses = 0;
let gameActive = true;
let clip_result  = "";
let targetRad = 0;
let cook = document.cookie;

//Check user platform
if (mobileTest() == true){
  targetRad = ANSWER[1];
} else {
  targetRad = ANSWER[0];
}

//Listen for click/touch events
const controller = {
  keyListener: function (event) {
   if (gameActive == true){
      if((event.type == "mousedown") || (event.type == "touchstart")) {
        if (event.target.className == "game"){
          event.preventDefault();
          down = "down";
        }

      } else if ((event.type == "mouseup") || (event.type == "touchend")) {
        if (event.target.className == "game"){
          down = "up";
        }
      }
      else {
          down = "none";
      }
    }
  }
};

//Main game loop logic
const loop = function () {
  document.getElementById("h1").innerHTML = "Guess: " + numGuesses;
  if (exit != true){
    if (gameActive == true){
      if (down == "down"){
        userRadius = userRadius + 3;
      }
      else if (down == "up") {
        down = "none"
        diff = Math.abs(targetRad - userRadius)
        if (diff < 6){
          chosenColor = colors.correct;
          lineWidth = 8;
          gameActive = false;
          pastGuesses[numGuesses] = {radius: userRadius, color: chosenColor, width: lineWidth};
          numGuesses++;
          generateScoreCard();
          //Set and generat user stats
          if (gen_cookies == true){
            var wins = localStorage.getItem('wins');
            if (wins == null){
              localStorage.setItem('wins', 1);
              localStorage.setItem('avg', numGuesses);
            } else {
              var avg = localStorage.getItem('avg');
              wins = parseFloat(wins) + 1;
              let new_avg = parseFloat(avg);
              let help_num = (parseFloat(numGuesses) - parseFloat(avg));
              help_num = parseFloat(help_num)/parseFloat(wins)
              new_avg = (parseFloat(avg) + parseFloat(help_num)).toFixed(2)
              localStorage.setItem('wins', wins);
              localStorage.setItem('avg', new_avg);
            }

            gen_cookies = false;
          }

          document.getElementById("modal2-p").innerHTML = "Good work. </br></br>Circuit " + GetFormattedDate() + " completed in " + numGuesses + " guesses.</br></br>"  +  emoji_result + "</br></br> Average guesses per win: " + localStorage.getItem('avg') + "</br></br>Press 'Copy' to copy your results to clipboard, paste to share.";
          modal2.style.display = "block";
          exit = true;
        } else if (diff < 30) {
          chosenColor = colors.green;
        } else if (diff < 60) {
          chosenColor = colors.yellow;
        } else if (diff < 100) {
          chosenColor = colors.lightOrange;
        } else if (diff < 140) {
          chosenColor = colors.orange;
        } else {
          chosenColor = colors.red;
        }
        pastGuesses[numGuesses] = {radius: userRadius, color: chosenColor, width: lineWidth};
        if (gameActive == true){
          numGuesses++;
        }
        userRadius = 0;
      }
    }
  } 
  // Creates the backdrop for each frame
  context.fillStyle = "#201A23";
  context.fillRect(0, 0, context.width, context.height); // x, y, width, height

  if (lineWidth != 8){
    for (var i = 0; i < pastGuesses.length; i++){
      if (pastGuesses.length > 2){
        if (i > pastGuesses.length - 3){
          context.lineWidth = pastGuesses[i].width;
          context.strokeStyle = pastGuesses[i].color; // hex for circ color
          context.beginPath();
          context.arc(context.width/2, context.height/2 - 45, pastGuesses[i].radius, 0, 2 * Math.PI);
          context.stroke();
         }
      } else {
        context.lineWidth = pastGuesses[i].width;
        context.strokeStyle = pastGuesses[i].color; // hex for circ color
        context.beginPath();
        context.arc(context.width/2, context.height/2 - 45, pastGuesses[i].radius, 0, 2 * Math.PI);
        context.stroke();
      }
    }
  } else {
      win_anim = win_anim + 0.033;
      if (win_anim >= pastGuesses.length){
        win_anim = -0.5;
      }
      for (var i = 0; i < win_anim; i++){
        context.lineWidth = pastGuesses[i].width;
        context.strokeStyle = pastGuesses[i].color; // hex for circ color
        context.beginPath();
        context.arc(context.width/2, context.height/2 - 45, pastGuesses[i].radius, 0, 2 * Math.PI);
        context.stroke();
    }
  }

  // Creates and fills the circle for each frame
  context.fillStyle = "#8DAA9D"; // hex for circ color
  context.beginPath();
  context.arc(context.width/2, context.height/2 - 45, userRadius, 0, 2 * Math.PI);
  context.fill();

  // call update when the browser is ready to draw again
  window.requestAnimationFrame(loop);

};

window.addEventListener("mousedown", controller.keyListener, { passive: false });
window.addEventListener("mouseup", controller.keyListener);
window.addEventListener("touchstart", controller.keyListener, { passive: false });
window.addEventListener("touchend", controller.keyListener);

// MODAL SETUP
var modal = document.getElementById("myModal");
var modal2 = document.getElementById("myModal2");
// Get the button that opens the modal
var btn = document.getElementById("about");
var copy_btn = document.getElementById("copy");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close")[1];
// When the user clicks on the button, open the modal
btn.onclick = function() {
  gameActive = false;
  modal.style.display = "block";
}

copy_btn.onclick = function() {
  navigator.clipboard.writeText(clip_result);
  clip_result = "";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  gameActive = true;
  if (lineWidth == 8){
    exit = true;
  }
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    gameActive = true;
    //exit = true;

  }
  if (event.target == modal2) {
    modal2.style.display = "none";
    gameActive = true;
    //exit = true;
  }
  if (event.target.className == "close") {
    modal2.style.display = "none";
    gameActive = true;
    //exit = true;
  }
}

// Start animation loop
window.requestAnimationFrame(loop);
