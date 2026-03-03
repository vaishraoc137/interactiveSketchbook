let offset=0;
let offsetY=0;

let startTime;
let timeLimit=10000;

function setup (){
  createCanvas (windowWidth, windowHeight); 
  rectMode (CENTER) ;
  // RECT MODE CENTER MEASURES PLACEMENT FROM THE CENTER OF THE SHAPE
 startTime=millis();
} 

function draw() { 
  background (0);

let elapsed = millis() - startTime;

let remaining = floor((timeLimit - elapsed) / 1000);

textSize(32);
fill(255);
textAlign(CENTER, CENTER);
text("Time Remaining: " + remaining, width / 2, height / 4);

if (elapsed > timeLimit) {
  offset = 0;
  offsetY = 0;
  startTime = millis();
} 

  push();
  translate(offset, offsetY);
  fill(100, 200,100);
  rect(width/3, height/2, 100, 100);
  pop() ;


  rect (width *2/3, height/2, 100, 100);

}


function keyPressed ( ){

  if (!timerStarted) {
  startTime = millis();
  timerStarted = true;
  }
  offset += random(-50, 50);
  offsetY += random(-75, 75);



}

function windowResized(){
resizeCanvas (windowWidth, windowHeight);
}