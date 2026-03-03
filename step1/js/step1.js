let steadyHeight = 0;
let randomHeight = 0;

let maxHeight = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  drawSky();
  drawGround();
  drawSun();
  drawSeeds();
  drawFlowers();
}

function drawSky() {
  background(173, 216, 230);
}

function drawGround() {
  fill(144, 238, 144);
  noStroke();
  rect(0, height * 0.65, width, height * 0.35);
}

function drawSun() {
  fill(255, 204, 0);
  noStroke();
  ellipse(width - 120, 120, 150, 150);
}

function drawSeeds() {
  fill(101, 67, 33); // brown
  ellipse(width * 0.4, height * 0.65, 20, 12);
  ellipse(width * 0.6, height * 0.65, 20, 12);
}

function drawFlowers() {
  let groundY = height * 0.65;

  stroke(34, 139, 34);
  strokeWeight(4);

  // STEADY FLOWER
  if (steadyHeight > 0) {
    line(width * 0.4, groundY, width * 0.4, groundY - steadyHeight);
  }

  // RANDOM FLOWER
  if (randomHeight > 0) {
    line(width * 0.6, groundY, width * 0.6, groundY - randomHeight);
  }

  // Blossoms (both pink)
  noStroke();
  fill(255, 105, 180);

  if (steadyHeight >= maxHeight) {
    ellipse(width * 0.4, groundY - steadyHeight, 30);
  }

  if (randomHeight >= maxHeight) {
    ellipse(width * 0.6, groundY - randomHeight, 30);
  }
}

function keyPressed() {
  // steady grows consistently
  if (steadyHeight < maxHeight) {
    steadyHeight += 10;
  }

  // random grows unpredictably
  if (randomHeight < maxHeight) {
    randomHeight += random(0, 10);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}