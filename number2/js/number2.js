function setup() {
  createCanvas(600, 600);
  frameRate(1.5);
}

function draw() {

  let flowerX = random(0, width);
  let flowerY = random(0, height);
  let petalSize = 100;
  let petalDistance = petalSize / 2;

  background(0, 100, 0);

  fill(255, 192, 203);

  // upper-left petal
  circle(flowerX - petalDistance, flowerY - petalDistance, petalSize);

  // upper-right petal
  circle(flowerX + petalDistance, flowerY - petalDistance, petalSize);

  // lower-left petal
  circle(flowerX - petalDistance, flowerY + petalDistance, petalSize);

  // lower-right petal
  circle(flowerX + petalDistance, flowerY + petalDistance, petalSize);

  // center petal
  fill(255, 0, 0);
  circle(flowerX, flowerY, petalSize);
}