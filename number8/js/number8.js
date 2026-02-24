let images = [];
let currentIndex = 0;

function preload() {
  images[0] = loadImage("img/image1.jpeg");
  images[1] = loadImage("img/image2.jpeg");
  images[2] = loadImage("img/image3.jpeg");
  images[3] = loadImage("img/image4.jpeg");
  images[4] = loadImage("img/image5.jpeg");
  images[5] = loadImage("img/image6.jpeg");
  images[6] = loadImage("img/image7.jpeg");
}

function setup() {
  createCanvas(1000, 1000);

  
}

function draw() {
  background(230);


  if (images[currentIndex]) {
    image(images[currentIndex], 0, 0);
  }
  
// let img = loadImage("../img/img1.jpeg");
  // image(img, 0, 0, width, height);

}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    currentIndex++;
    if (currentIndex >= images.length) {
      currentIndex = 0;
    }
  }

  if (keyCode === LEFT_ARROW) {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = images.length - 1;
    }
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
} 