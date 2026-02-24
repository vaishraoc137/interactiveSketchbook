let bloom = 10;
function setup() {
  createCanvas(1000, 1000);
}

function draw() {
  background(240);

  
  if (mouseX > width / 2) {
    bloom += 1;
  } else {
    bloom -= 1;
  }

  bloom = constrain(bloom, 10, 100);


  fill(255, 200, 0);
  ellipse(width / 2, height / 2, bloom, bloom);
}
