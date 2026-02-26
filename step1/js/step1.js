function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  drawSky();
  drawGround();
  drawSun();
  drawSeeds();
}

function drawSky() {
  background(173, 216, 230); // light blue sky
}

function drawGround() {
  noStroke();
  fill(144, 238, 144); // light green
  rect(0, height * 0.65, width, height * 0.35);
}

function drawSun() {
  fill(255, 204, 0);
  noStroke();
  ellipse(width - 120, 120, 150, 150);
}

function drawSeeds() {
  fill(101, 67, 33); // brown
  ellipse(width * 0.4, height * 0.68, 20, 12);
  ellipse(width * 0.6, height * 0.68, 20, 12);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}