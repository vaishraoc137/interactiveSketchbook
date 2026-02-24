let effort = [0, 0];
let privileged = [true, false];
let maxEffort = 12;
let barWidth = 300;

function setup() {
  createCanvas(1000, 1000);
  textSize(16);
}

function draw() {
  background(230);

  for (let i = 0; i < 2; i++) {

    if (privileged[i]) {
      fill(60, 160, 80);
    } else {
      fill(180, 80, 80);
    }

    let h = map(effort[i], 0, maxEffort, 0, height - 60);

    rect(i * barWidth + 40, height - h - 30, barWidth - 10, h);

    fill(0);

    if (effort[i] >= maxEffort) {
      text("DONE", i * barWidth + 40, 25);
    } else {
      text("Effort: " + effort[i], i * barWidth + 40, 25);
    }
  }

  text("same input, different outcomes", 10, height - 10);
}

function mousePressed() {
  for (let i = 0; i < 2; i++) {
    if (effort[i] < maxEffort) {
      if (privileged[i]) {
        effort[i] += 1;
      } else {
        if (random() < 0.4) {
          effort[i] += 1;
        }
      }
    }
  }
}