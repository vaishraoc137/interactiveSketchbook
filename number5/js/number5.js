let bigSize = 300;
let smallSize = 100;
let currentSize = bigSize;

function setup() {
  createCanvas(1000, 1000);
}

function draw() {
 background(255, 200, 220);
fill(180, 220, 255);      

  ellipse(width / 2, height / 2, currentSize);
}

function mousePressed() {
  if (currentSize === bigSize) {
    currentSize = smallSize;
  } else {
    currentSize = bigSize;
  }
}
