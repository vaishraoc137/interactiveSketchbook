let circleX = 90;
let circleY = 10;
let xSpeed = 5;
let ySpeed = 5;

function setup() {
  createCanvas(600, 600);
}

function draw() {
  // clear out old frames
  background(30, 144, 255); // sky blue background
  
  fill(255, 255, 0);    

  // draw current frame based on state
  circle(circleX, circleY, 100);

  // modify state
  circleX = circleX + xSpeed;
  circleY = circleY + ySpeed;

  //bounce off left and right
  if(circleX < 0 || circleX > width) {
    xSpeed = xSpeed * -1;
  }

  // bounce off top and bottom
  if(circleY < 0 || circleY > height) {
    ySpeed = ySpeed * -1;
  }
}